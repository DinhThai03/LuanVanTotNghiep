<?php

namespace App\Http\Controllers\Api\User;


use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh', 'sendResetLinkEmail', 'resetPassword']]);
    }

    public function register(RegisterRequest $request)
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['error' => 'Không được phép! Chỉ có admin mới có quyền tạo tài khoản mới.'], 403);
        }

        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        if ($user) {
            $token = Auth::login($user);
            $newRefreshToken = $this->createRefreshToken();
            return $this->respondWithToken($token, $newRefreshToken);
        }
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('username', 'password');

        if (! $token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Tài khoản hoặc mật khẩu không đúng'], 401);
        }

        $user = Auth::user();

        if ($user->is_active == false && ($user->role === "admin") || ($user->role === "teacher")) {
            Auth::logout();
            return response()->json(['error' => 'Tài khoản của bạn đã bị khóa'], 403);
        }

        $refreshToken = $this->createRefreshToken();

        return $this->respondWithToken($token, $refreshToken);
    }


    public function profile()
    {
        try {
            return response()->json(Auth::user());
        } catch (JWTException $exception) {
            return response()->json(['error' => 'Không được phép'], 401);
        }
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Đã đăng xuất']);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->refresh_token;

        try {
            $decode = JWTAuth::getJWTProvider()->decode($refreshToken);
            $user = User::find($decode['sub']);

            if (!$user) {
                return response()->json(['error' => 'Không tìm thấy người dùng'], 404);
            }

            Auth::invalidate(); // Invalidate current access token
            $token = Auth::login($user);
            $newRefreshToken = $this->createRefreshToken();

            return $this->respondWithToken($token, $newRefreshToken);
            return response()->json($decode);
        } catch (JWTException $exception) {
            return response()->json(['error' => 'refresh token không đúng'], 500);
        }
    }

    protected function respondWithToken($token, $refreshToken)
    {
        $user = Auth::user(); // Lấy thông tin user hiện tại

        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
        ]);
    }


    protected function createRefreshToken()
    {
        $data = [
            'sub' => JWTAuth::user()->id,
            'random' => Str::random(40),
            'exp' => time() + config('jwt.refresh_ttl') * 60
        ];

        return JWTAuth::getJWTProvider()->encode($data);
    }


    public function sendResetLinkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Vui lòng nhập địa chỉ email',
            'email.email' => 'Địa chỉ email không hợp lệ',
            'email.exists' => 'Email không tồn tại trong hệ thống',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Email không tồn tại'], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Đã gửi email đặt lại mật khẩu']);
        }

        return response()->json(['message' => 'Không thể gửi email'], 500);
    }

    public function resetPassword(Request $request)
    {

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();

                event(new PasswordReset($user));
            }
        );


        if ($status === Password::PASSWORD_RESET) {
            $token = Auth::attempt([
                'email' => $request->email,
                'password' => $request->password,
            ]);

            return response()->json([
                'message' => 'Đặt lại mật khẩu thành công',
                'token' => $token,
            ]);
        }

        return response()->json(['message' => "Token đã hết hạn"], 422);
    }
}

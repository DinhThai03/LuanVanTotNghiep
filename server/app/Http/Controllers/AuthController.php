<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('username', 'password');

        if (! $token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $refreshToken = $this->createRefreshToken();

        return $this->respondWithToken($token, $refreshToken);
    }

    public function profile()
    {
        try {
            return response()->json(Auth::user());
        } catch (JWTException $exception) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->refresh_token;

        try {
            $decode = JWTAuth::getJWTProvider()->decode($refreshToken);
            $user = User::find($decode['sub']);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            Auth::invalidate(); // Invalidate current access token
            $token = Auth::login($user);
            $newRefreshToken = $this->createRefreshToken();

            return $this->respondWithToken($token, $newRefreshToken);
            return response()->json($decode);

        } catch (JWTException $exception) {
            return response()->json(['error' => 'Refresh Token Invalid'], 500);
        }
    }

    protected function respondWithToken($token, $refreshToken)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60
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
}

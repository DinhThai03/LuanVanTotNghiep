<?php

namespace App\Http\Controllers\Api\Finance;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\TuitionFee;

class MomoController extends Controller
{
    public function createPayment(Request $request)
    {
        Log::info('MoMo createPayment called');
        Log::debug('Request Data: ', $request->all());

        $tuitionFeeIds = $request->input('tuition_fee_ids', []);
        $amount = $request->input('total_amount');

        if (empty($tuitionFeeIds) || !$amount) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ'], 422);
        }

        $orderId = Str::uuid();
        $requestId = Str::uuid();

        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');
        $redirectUrl = env('MOMO_REDIRECT_URL') . "?orderId=$orderId";
        $ipnUrl = env('MOMO_IPN_URL');

        $extraData = implode(',', $tuitionFeeIds);
        $orderInfo = "Thanh toán học phí sinh viên";
        $requestType = "captureWallet";
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType";
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $body = [
            'partnerCode' => $partnerCode,
            'accessKey' => $accessKey,
            'requestId' => $requestId,
            'amount' => (string)(int)$amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature,
            'lang' => 'vi',
        ];

        $response = Http::post($endpoint, $body);
        Log::debug('MoMo API response: ', $response->json());

        $data = $response->json();
        Log::debug('MoMo API response: ', $data);

        if ($data['resultCode'] != 0) {
            return response()->json([
                'message' => $data['message'] ?? 'Giao dịch thất bại',
                'resultCode' => $data['resultCode'],
            ], 400); // Bad Request
        }

        return response()->json($data);
    }

    public function handleIpn(Request $request)
    {

        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');

        $rawHash = "accessKey={$accessKey}&amount={$request->amount}&extraData={$request->extraData}&message={$request->message}&orderId={$request->orderId}&orderInfo={$request->orderInfo}&orderType={$request->orderType}&partnerCode={$partnerCode}&payType={$request->payType}&requestId={$request->requestId}&responseTime={$request->responseTime}&resultCode={$request->resultCode}&transId={$request->transId}";

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        if ($signature !== $request->signature) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        if ((int)$request->resultCode === 0 && !empty($request->extraData)) {
            $feeIds = explode(',', $request->extraData);

            if (count($feeIds)) {
                $now = now();
                $tuitionFees = TuitionFee::with(['registration.student.user', 'registration.lesson'])->whereIn('id', $feeIds)->get();

                $updatedRows = 0;
                $activatedUsers = [];

                foreach ($tuitionFees as $fee) {
                    if (!$fee->paid_at) {
                        $fee->payment_status = 'success';
                        $fee->payment_method = 'momo';
                        $fee->transaction_id = $request->transId;
                        $fee->paid_at = $now;
                        $fee->save();
                        $updatedRows++;
                    }

                    $studentCode = $fee->registration->student->code;
                    $semesterId = $fee->registration->lesson->semester_id;

                    $allFees = TuitionFee::whereHas('registration', function ($query) use ($studentCode, $semesterId) {
                        $query->where('student_code', $studentCode)
                            ->whereHas('lesson', function ($q) use ($semesterId) {
                                $q->where('semester_id', $semesterId);
                            });
                    })->get();

                    $total = $allFees->sum(fn($p) => floatval($p->amount));
                    $paid = $allFees->where('payment_status', 'success')->sum(fn($p) => floatval($p->amount));

                    if ($paid >= $total && $total > 0) {
                        $user = $fee->registration->student->user;
                        if (!$user->is_active) {
                            $user->is_active = true;
                            $user->save();
                            $activatedUsers[] = $user->id;
                        }
                    }
                }
            }

            return response()->json(['message' => 'IPN processed'], 200);
        }
    }
}

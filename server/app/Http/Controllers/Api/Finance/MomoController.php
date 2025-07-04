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
            'amount' => (string)$amount,
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

        return response()->json($response->json());
    }

    public function handleIpn(Request $request)
    {
        Log::debug('🔥 MoMo IPN Called', $request->all());

        $partnerCode = env('MOMO_PARTNER_CODE');
        $accessKey = env('MOMO_ACCESS_KEY');
        $secretKey = env('MOMO_SECRET_KEY');

        $rawHash = "accessKey={$accessKey}&amount={$request->amount}&extraData={$request->extraData}&message={$request->message}&orderId={$request->orderId}&orderInfo={$request->orderInfo}&orderType={$request->orderType}&partnerCode={$partnerCode}&payType={$request->payType}&requestId={$request->requestId}&responseTime={$request->responseTime}&resultCode={$request->resultCode}&transId={$request->transId}";

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        if ($signature !== $request->signature) {
            Log::warning('❌ MoMo IPN - Signature mismatch!');
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        if ((int)$request->resultCode === 0 && !empty($request->extraData)) {
            $feeIds = explode(',', $request->extraData);

            if (count($feeIds)) {
                $updatedRows = TuitionFee::whereIn('id', $feeIds)
                    ->whereNull('paid_at')
                    ->update([
                        'payment_status' => 'success',
                        'payment_method' => 'momo',
                        'transaction_id' => $request->transId,
                        'paid_at' => now(),
                    ]);

                Log::info("✅ Đã cập nhật $updatedRows học phí đã thanh toán: ", $feeIds);
            } else {
                Log::warning("⚠️ extraData không hợp lệ hoặc rỗng: " . $request->extraData);
            }
        } else {
            Log::warning("⚠️ Thanh toán không thành công hoặc thiếu extraData. resultCode: {$request->resultCode}");
        }

        return response()->json(['message' => 'IPN processed'], 200);
    }
}

"use client";
import { createMomoPayment } from "@/services/TuitionFee";
import { TuitionFee } from "@/types/TuitionFeeType";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
    semesterName?: string;
    tuitionFees?: TuitionFee[] | null;
};

export default function TuitionFeeForm({ semesterName, tuitionFees }: Props) {
    const [selectedFees, setSelectedFees] = useState<number[]>([]);
    const [isPaying, setIsPaying] = useState(false); // ✅ NEW

    const safeTuitionFees = tuitionFees ?? [];

    const handleToggle = (id: number) => {
        setSelectedFees((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const totalAmount = safeTuitionFees
        .filter((fee) => selectedFees.includes(fee.id))
        .reduce((sum, fee) => sum + parseFloat(fee.amount), 0);

    const paidCount = safeTuitionFees.filter((fee) => fee.payment_status === "success").length;
    const unpaidCount = safeTuitionFees.filter((fee) => fee.payment_status !== "success").length;

    const totalPaidAmount = safeTuitionFees
        .filter((fee) => fee.payment_status === "success")
        .reduce((sum, fee) => sum + parseFloat(fee.amount), 0);

    const totalUnpaidAmount = safeTuitionFees
        .filter((fee) => fee.payment_status !== "success")
        .reduce((sum, fee) => sum + parseFloat(fee.amount), 0);

    const handlePayment = async () => {
        if (selectedFees.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một học phần.");
            return;
        }

        setIsPaying(true); // ✅ Bắt đầu loading

        try {
            const data = await createMomoPayment(selectedFees, totalAmount);

            if (data?.payUrl) {
                toast.success("Đang chuyển đến MoMo...");
                setTimeout(() => {
                    window.location.href = data.payUrl;
                }, 1000);
            } else {
                toast.error("Không tạo được liên kết thanh toán.");
            }
        } catch (error: any) {
            console.error("Lỗi khi gọi MoMo:", error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Có lỗi khi xử lý thanh toán.";

            toast.error(`Thanh toán thất bại: ${message}`);
        }
        finally {
            setIsPaying(false); // ✅ Dừng loading
        }
    };

    return (
        <div className="relative">
            {/* Overlay loading thanh toán */}
            {isPaying && (
                <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-pink-600 border-solid"></div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-4 p-4 [zoom:70%] md:[zoom:100%]">
                <h2 className="text-xl font-semibold text-center text-gray-800">
                    Học phí - {semesterName}
                </h2>

                {/* Thống kê tổng quan */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
                    <div className="bg-gray-50 p-3 rounded border shadow-sm">
                        <div className="font-medium">Môn đã thanh toán</div>
                        <div className="text-green-600 text-lg font-semibold">{paidCount}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border shadow-sm">
                        <div className="font-medium">Môn chưa thanh toán</div>
                        <div className="text-yellow-600 text-lg font-semibold">{unpaidCount}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border shadow-sm">
                        <div className="font-medium">Tổng tiền đã thanh toán</div>
                        <div className="text-blue-600 text-lg font-semibold">
                            {totalPaidAmount.toLocaleString()} đ
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border shadow-sm">
                        <div className="font-medium">Tổng tiền chưa thanh toán</div>
                        <div className="text-red-600 text-lg font-semibold">
                            {totalUnpaidAmount.toLocaleString()} đ
                        </div>
                    </div>
                </div>

                {/* Bảng học phí */}
                <table className="w-full table-auto border text-sm mt-4">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">#</th>
                            <th className="p-2">Mã môn</th>
                            <th className="p-2">Tên môn</th>
                            <th className="p-2 text-center">Tín chỉ</th>
                            <th className="p-2 text-right">Học phí</th>
                            <th className="p-2">Thanh toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {safeTuitionFees.map((fee, index) => {
                            const subject = fee.registration.lesson.teacher_subject.subject;
                            const isPaid = fee.payment_status === "success";
                            return (
                                <tr key={fee.id} className="border-t">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{subject.code}</td>
                                    <td className="p-2">{subject.name}</td>
                                    <td className="p-2 text-center">{subject.tuition_credit}</td>
                                    <td className="p-2 text-right">
                                        {parseFloat(fee.amount).toLocaleString()} đ
                                    </td>
                                    <td className="p-2">
                                        {isPaid ? (
                                            <span className="text-green-600 font-medium">
                                                Đã thanh toán
                                            </span>
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={selectedFees.includes(fee.id)}
                                                onChange={() => handleToggle(fee.id)}
                                                disabled={isPaying} // ✅ không cho chọn khi đang thanh toán
                                            />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Tổng số tiền đang chọn để thanh toán */}
                <div className="text-right mt-4">
                    <span className="font-semibold mr-2">Tổng học phí cần thanh toán:</span>
                    <span className="text-red-600 font-bold text-lg">
                        {totalAmount.toLocaleString()} đ
                    </span>
                </div>

                {/* Nút thanh toán */}
                {totalAmount > 0 && (
                    <div className="text-right mt-2">
                        <button
                            onClick={handlePayment}
                            disabled={isPaying}
                            className={`${isPaying ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
                                } text-white font-semibold py-2 px-4 rounded shadow`}
                        >
                            {isPaying ? "Đang xử lý..." : "Thanh toán MoMo"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

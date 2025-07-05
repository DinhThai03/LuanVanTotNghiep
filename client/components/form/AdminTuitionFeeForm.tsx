"use client";
import { getSemestersByStudent } from "@/services/Semesters";
import { createMomoPayment, getStudentTuitionFee, payByCash } from "@/services/TuitionFee";
import { TuitionFee } from "@/types/TuitionFeeType";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    code: string;
    semester_id: number;
};

export default function AdminTuitionFeeForm({ code, semester_id }: Props) {
    const [selectedFees, setSelectedFees] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [tuitionData, setTuitionData] = useState<{
        semester: string;
        tuition_fees: any[];
    } | null>(null);

    // Fetch tuition fee when semester changes
    useEffect(() => {
        const fetchTuitionFee = async () => {
            setLoading(true);
            try {
                const data = await getStudentTuitionFee(code, semester_id);
                console.log(code, semester_id),
                    console.log(data);
                setTuitionData(data);
                setSelectedFees([]); // Reset selected fees when semester changes
            } catch (err) {
                toast.error("Không thể tải học phí");
                setTuitionData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTuitionFee();
    }, []);

    const safeTuitionFees = tuitionData?.tuition_fees ?? [];

    const handleToggle = (id: number) => {
        setSelectedFees((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const totalAmount = safeTuitionFees
        .filter((fee) => selectedFees.includes(fee.id))
        .reduce((sum, fee) => sum + parseFloat(fee.amount), 0);



    const handlePayment = async () => {
        try {
            if (!selectedFees || selectedFees.length === 0) {
                toast.warning("Vui lòng chọn các khoản học phí cần thanh toán.");
                return;
            }

            const res = await payByCash(selectedFees);
            toast.success(res.message || "Đã thanh toán học phí thành công.");
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.error || "Đã xảy ra lỗi khi thanh toán.");
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-4 p-4 [zoom:70%] md:[zoom:100%]">
            <h2 className="text-xl font-semibold text-center text-gray-800">
                Học phí - {tuitionData?.semester || "Chọn học kỳ"}
            </h2>

            {!tuitionData ? (
                <div className="p-4 text-center text-gray-500">Không có dữ liệu học phí</div>
            ) : (
                <>
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
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Tổng số tiền đang chọn để thanh toán */}
                    {totalAmount > 0 && (
                        <>
                            <div className="text-right mt-4">
                                <span className="font-semibold mr-2">Tổng học phí cần thanh toán:</span>
                                <span className="text-red-600 font-bold text-lg">
                                    {totalAmount.toLocaleString()} đ
                                </span>
                            </div>

                            <div className="text-right mt-2">
                                <button
                                    onClick={handlePayment}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                                >
                                    Thanh toán
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
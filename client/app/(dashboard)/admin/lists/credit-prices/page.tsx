"use client";

import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DefaultHeader } from "@/components/ui/defautl-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import FormModal from "@/components/form/FormModal";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { deleteCreditPrice, getCreditPrices } from "@/services/CreditPrice";
import { CreditPriceData } from "@/types/CreditPriceType";


const columnHelper = createColumnHelper<CreditPriceData>();

const CreditPricePage = () => {
    const [creditPriceMap, setCreditPriceMap] = useState<Map<number, CreditPriceData>>(new Map());

    const [loading, setLoading] = useState(true);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCreditPrice, setSelectedCreditPrice] = useState<CreditPriceData | null>(null);
    const [editingCreditPrice, setEditingCreditPrice] = useState<CreditPriceData | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        const fetchclasses = async () => {
            try {
                setLoading(true);
                const res = await getCreditPrices();
                console.log(res);
                if (res) {
                    const newMap = new Map<number, CreditPriceData>();
                    res.forEach((creditPrice: CreditPriceData) => newMap.set(creditPrice.id, creditPrice));
                    setCreditPriceMap(newMap);
                }
            } catch (err) {
                const axiosErr = err as AxiosError<any>;
                let message;
                console.error("Chi tiết lỗi khi lấy danh sách creditPrice:", axiosErr.response?.data);

                if (axiosErr.response?.data?.message) {
                    message = (axiosErr.response.data.message);
                } else if (axiosErr.response?.data?.error) {
                    message = (axiosErr.response.data.error);
                }
                else if (axiosErr.message === "Network Error") {
                    message = ("Không thể kết nối đến server.");
                } else {
                    message = ("Đã có lỗi xảy ra khi lấy danh sách creditPrice.");
                }

                console.error("Lỗi khi lấy danh sách creditPrice:", err);
                toast.error(message, {
                    description: "Vui lòng kiểm tra lại",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchclasses();
    }, []);

    const handleAddSuccess = (creditPrice: CreditPriceData) => {
        setCreditPriceMap(prev => new Map(prev).set(creditPrice.id, creditPrice));
    };

    const handleUpdateSuccess = (creditPrice: CreditPriceData) => {
        setCreditPriceMap(prev => new Map(prev).set(creditPrice.id, creditPrice));
    };

    const handleDelete = async () => {
        if (!selectedCreditPrice) return;
        try {
            await deleteCreditPrice(selectedCreditPrice.id);
            setCreditPriceMap(prev => {
                const newMap = new Map(prev);
                newMap.delete(selectedCreditPrice.id);
                return newMap;
            });
            toast.success("Xóa thành công")
        } catch (err: any) {
            const message =
                err?.response?.data?.message || // nếu từ axios hoặc fetch API
                err?.message || // nếu là Error object
                JSON.stringify(err); // nếu là object khác

            toast.error("Xóa thất bại", {
                description: message
            });
        } finally {
            setShowConfirm(false);
            setSelectedCreditPrice(null);
        }
    };

    const columns = [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                    aria-label="Chọn tất cả"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Chọn dòng"
                />
            ),
            meta: { displayName: "▢" },
            size: 10,
        }),

        columnHelper.accessor("subject_type", {
            id: "subject_type",
            header: (info) => <DefaultHeader info={info} name="Loại môn" />,
            cell: (info) => info.getValue() === "LT" ? "Lý thuyết" : "Thực hành",
            meta: { displayName: "Loại môn" },
            size: 120,
        }),

        columnHelper.accessor("price_per_credit", {
            id: "price_per_credit",
            header: (info) => <DefaultHeader info={info} name="Giá / tín chỉ" />,
            cell: (info) =>
                Number(info.getValue()).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }),
            meta: { displayName: "Giá mỗi tín chỉ" },
            size: 150,
        }),

        columnHelper.accessor("is_active", {
            id: "is_active",
            header: "Trạng thái",
            cell: (info) => (info.getValue() ? "Có hiệu lực" : "Không hiệu lực"),
            meta: { displayName: "Trạng thái" },
            size: 150,
        }),

        columnHelper.accessor((row) => `${row.academic_year?.start_year}-${row.academic_year?.end_year}`, {
            id: "academic_year",
            header: (info) => <DefaultHeader info={info} name="Năm học" />,
            cell: (info) => info.getValue() || "—",
            meta: { displayName: "Năm học" },
            size: 160,
        }),

        columnHelper.display({
            id: "actions",
            header: () => "Tùy chọn",
            cell: ({ row }) => {
                const creditPrice = row.original;
                return (
                    <div className="flex text-lg gap-4">
                        <button
                            className="text-orange-500"
                            onClick={() => {
                                setEditingCreditPrice(creditPrice);
                                setShowUpdateForm(true);
                                setShowAddForm(false);
                            }}
                        >
                            <FaRegPenToSquare />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setSelectedCreditPrice(creditPrice);
                                setShowConfirm(true);
                            }}
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                );
            },
            enableGlobalFilter: false,
            size: 40,
            meta: { displayName: "Tùy chọn" },
        }),
    ];


    return (
        <div className="w-full bg-white shadow-lg shadow-gray-500 p-4">
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Đang tải danh sách creditPrice...
                </div>
            ) : (
                <>
                    <DataTable<CreditPriceData, any>
                        columns={columns}
                        data={Array.from(creditPriceMap.values())}
                        onAddClick={() => {
                            setShowAddForm(true);
                            setShowUpdateForm(false);
                            setEditingCreditPrice(null);
                        }}
                    />

                    {showAddForm && (
                        <FormModal
                            table="creditPrice"
                            type="create"
                            onClose={() => setShowAddForm(false)}
                            onSubmitSuccess={handleAddSuccess}
                        />
                    )}

                    {showUpdateForm && editingCreditPrice && (
                        <FormModal
                            table="creditPrice"
                            type="update"
                            data={editingCreditPrice}
                            onClose={() => {
                                setShowUpdateForm(false);
                                setEditingCreditPrice(null);
                            }}
                            onSubmitSuccess={handleUpdateSuccess}
                        />
                    )}

                    <ConfirmDialog
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa không?`}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        onCancel={() => {
                            setShowConfirm(false);
                            setSelectedCreditPrice(null);
                        }}
                        onConfirm={handleDelete}
                    />
                </>
            )}
        </div>
    );
};

export default CreditPricePage;

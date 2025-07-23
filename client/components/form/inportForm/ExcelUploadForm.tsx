"use client";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";

const excelSchema = z.object({
    file: z
        .custom<File>((file) => file instanceof File, {
            message: "Vui lòng chọn file",
        })
        .refine(
            (file) =>
                ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(
                    file.type
                ),
            {
                message: "Chỉ chấp nhận file Excel (.xlsx, .xls)",
            }
        ),
});


type ExcelFormData = z.infer<typeof excelSchema>;

interface ExcelUploadFormProps {
    onUpload: (formData: FormData) => Promise<void>;
}

const ExcelUploadForm = ({ onUpload }: ExcelUploadFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ExcelFormData>({
        resolver: zodResolver(excelSchema),
    });

    const onSubmit: SubmitHandler<ExcelFormData> = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file);

        try {
            await onUpload(formData);
            reset();
        } catch (err) {
            const axiosErr = err as AxiosError<any>;
            let message = "Đã xảy ra lỗi khi tải file.";
            if (axiosErr.response?.data?.message) {
                message = axiosErr.response.data.message;
            }
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Tải file Excel</h2>

            <FileUploader
                name="file"
                control={control}
                error={errors.file}
                acceptTypes={[
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                    "application/vnd.ms-excel", // .xls
                ]}
            />


            <button
                type="submit"
                className={cn("bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700")}
            >
                Tải lên
            </button>
        </form>
    );
};

export default ExcelUploadForm;

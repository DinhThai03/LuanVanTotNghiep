"use client";

import React, { useEffect, useState } from "react";
import { Controller, Control, FieldError } from "react-hook-form";

type Props = {
    name: string;
    control: Control<any>;
    error?: FieldError;
    defaultFilename?: string;
    acceptTypes?: string[]; // ← kiểu MIME được truyền từ ngoài
};

const FileUploader: React.FC<Props> = ({
    name,
    control,
    error,
    defaultFilename,
    acceptTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/vnd.ms-powerpoint", // ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
    ],
}) => {
    const [filename, setFilename] = useState<string | null>(defaultFilename || null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (defaultFilename) {
            setFilename(defaultFilename);
        }
    }, [defaultFilename]);

    const acceptAttr = acceptTypes
        .map((type) => {
            if (type === "application/pdf") return ".pdf";
            if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return ".docx";
            if (type === "application/vnd.ms-powerpoint") return ".ppt";
            if (type === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return ".pptx";
            if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return ".xlsx";
            if (type === "application/vnd.ms-excel") return ".xls";
            return "";
        })
        .filter(Boolean)
        .join(",");

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: (file: File | null) => {
                    if (!file && !defaultFilename) return "Tệp là bắt buộc";
                    if (file && !acceptTypes.includes(file.type)) {
                        return "Tệp không hợp lệ.";
                    }
                    return true;
                },
            }}
            render={({ field: { onChange } }) => (
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-xs text-gray-500" htmlFor={name}>
                        Chọn tệp {acceptAttr ? `(${acceptAttr})` : ""}
                    </label>
                    <input
                        type="file"
                        id={name}
                        ref={inputRef}
                        accept={acceptAttr}
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFilename(file?.name || null);
                            onChange(file);
                            if (inputRef.current) inputRef.current.value = "";
                        }}
                    />
                    <label
                        htmlFor={name}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm cursor-pointer text-gray-700 bg-white hover:bg-gray-50 truncate overflow-hidden whitespace-nowrap"
                    >
                        {filename || "Chưa có tệp được chọn"}
                    </label>
                    {error?.message && <p className="text-sm text-red-500">{error.message}</p>}
                </div>
            )}
        />
    );
};

export default FileUploader;

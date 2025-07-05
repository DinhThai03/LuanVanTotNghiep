"use client";

import React, { useEffect, useState } from "react";
import { Controller, Control, FieldError } from "react-hook-form";

const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/vnd.ms-powerpoint", // ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
];

type Props = {
    name: string;
    control: Control<any>;
    error?: FieldError;
    defaultFilename?: string;
};

const FileUploader: React.FC<Props> = ({ name, control, error, defaultFilename }) => {
    const [filename, setFilename] = useState<string | null>(defaultFilename || null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (defaultFilename) {
            setFilename(defaultFilename);
        }
    }, [defaultFilename]);

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: (file: File | null) => {
                    if (!file && !defaultFilename) return "Tệp là bắt buộc";
                    if (file && !allowedTypes.includes(file.type)) {
                        return "Tệp không hợp lệ. Chỉ chấp nhận PDF, DOCX, PPT, PPTX.";
                    }
                    return true;
                },
            }}
            render={({ field: { onChange } }) => (
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-xs text-gray-500" htmlFor={name}>
                        Chọn tệp (PDF, DOCX, PPT, PPTX)
                    </label>
                    <input
                        type="file"
                        id={name}
                        ref={inputRef}
                        accept=".pdf,.docx,.ppt,.pptx"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFilename(file?.name || null);
                            onChange(file);
                            // Reset input để cho phép chọn lại cùng file
                            if (inputRef.current) inputRef.current.value = "";
                        }}
                    />
                    <label
                        htmlFor={name}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm cursor-pointer text-gray-700 bg-white hover:bg-gray-50 truncate overflow-hidden whitespace-nowrap"
                    >
                        {filename || "Chưa có tệp được chọn"}
                    </label>
                    {error?.message && (
                        <p className="text-sm text-red-500">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
};

export default FileUploader;

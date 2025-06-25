"use client";

import React from "react";
import Select, { SingleValue } from "react-select";
import { Controller, Control, FieldError } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface OptionItem {
    label: string;
    value: string | number;
}

interface SearchableSelectFieldProps {
    name: string;
    control: Control<any>;
    id: string;
    label: string;
    options: OptionItem[];
    placeholder?: string;
    className?: string;
    error?: FieldError;
}

export default function SearchableSelectField({
    name,
    control,
    id,
    label,
    options,
    placeholder,
    className = "",
    error,
}: SearchableSelectFieldProps) {
    return (
        <div className={`grid gap-2 ${className}`}>
            <Label htmlFor={id}>{label}</Label>

            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Select
                        inputId={id}
                        ref={field.ref}
                        options={options}
                        placeholder={placeholder}
                        value={options.find((opt) => opt.value === field.value) || null}
                        onChange={(selected: SingleValue<OptionItem>) =>
                            field.onChange(selected ? selected.value : null)
                        }
                        onBlur={field.onBlur}
                        isSearchable
                        menuPortalTarget={
                            typeof window !== "undefined" ? document.body : null
                        }
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                    />
                )}
            />

            <div className="min-h-[18px]">
                {error && <p className="text-xs text-red-500">{error.message}</p>}
            </div>
        </div>
    );
}

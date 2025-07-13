"use client"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { ReactNode } from "react"

type ConfirmDeleteDialogProps = {
    open: boolean
    title: string
    message: ReactNode
    onConfirm: () => void
    onCancel?: () => void
    cancelText?: string
    confirmText?: string
}

export const ConfirmDialog = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    cancelText = "Hủy",
    confirmText = "Xác nhận",
}: ConfirmDeleteDialogProps) => {
    const handleOpenChange = (value: boolean) => {
        if (!value) onCancel?.()
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {onCancel && // 👈 Đã sửa từ oncancel thành onCancel
                        <AlertDialogCancel onClick={onCancel}>
                            {cancelText}
                        </AlertDialogCancel>
                    }
                    <AlertDialogAction onClick={onConfirm}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
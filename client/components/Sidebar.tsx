import Image from "next/image";
import { useEffect } from "react";
import Menu from "./menu";

interface SidebarProps {
    isOpen: boolean;
    role: string;
    onClose: () => void;
}

const Sidebar = ({ isOpen, role, onClose }: SidebarProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <>

            <div
                className={`fixed inset-0 bg-black z-40 transition lg:hidden ${isOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className={`fixed top-0 left-0 w-64 h-screen bg-white z-50 shadow-lg transform transition-transform duration-500 ease-in-out lg:-translate-x-full ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="relative flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 cursor-default">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={200}
                            height={200}
                            className="w-16 h-auto"
                        />
                        <div className="flex flex-col">
                            <span className="text-blue-950 text-[10px]">
                                TRƯỜNG ĐẠI HỌC
                            </span>
                            <span className="text-red-500 text-[12px] font-bold">
                                CÔNG NGHỆ SÀI GÒN
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-600 text-2xl font-bold absolute top-0 right-2 transition hover:text-black hover:rotate-90"
                        aria-label="Đóng menu"
                    >
                        &times;
                    </button>
                </div>
                <div className="h-[calc(100vh-70px)] overflow-y-auto">
                    <Menu />
                </div>
            </div>
        </>
    );
};

export default Sidebar;

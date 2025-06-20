import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Menu from "@/components/menu";
import { Toaster } from "sonner";



export const metadata: Metadata = {
    title: "Cổng thông tin đào tạo STU",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <div className="flex ">
                <div className='hidden bg-white lg:block w-64  h-[calc(100vh-60px)] overflow-auto'>
                    <Menu />
                </div>
                <div className='flex justify-center w-full lg:ml-3  h-[calc(100vh-60px)] overflow-auto'>
                    {children}
                </div>
            </div>
            <Toaster richColors position="top-center" />
        </>

    );
}

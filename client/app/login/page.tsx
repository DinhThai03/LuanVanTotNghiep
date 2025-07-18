"use client"

import { LoginForm } from "@/features/auth/components/login-form"
import { Copyright } from "lucide-react"
import Image from "next/image"

const LoginPage = () => {
    return (
        <div className='flex flex-col'>
            <div className="flex items-center justify-center w-full h-[calc(100vh-50px)] bg-gray-100">
                <div className="flex w-full h-fit justify-center">
                    <div className='container sm:flex justify-center gap-8'>
                        {/* LEFT */}
                        <div className='w-full h-fit sm:w-1/2 py-10 md:py-0 md:w-1/2 lg:w-3/5'>
                            <div className='w-full justify-center flex gap-2'>
                                <Image
                                    src="/logo.png"
                                    width={200}
                                    height={200}
                                    alt="logo"
                                    className='w-30 h-fit'
                                    priority
                                />
                                <div >
                                    <div className="text-blue-950 text-md">TRƯỜNG ĐẠI HỌC</div>
                                    <div className="text-red-500 text-xl font-bold">CÔNG NGHỆ SÀI GÒN</div>
                                </div>
                            </div>
                            <p className='text-lg text-center mt-1 text-gray-500'>GIỎI CHUYÊN MÔN - SÁNG TÂM ĐỨC</p>
                        </div>

                        {/* RIGHT */}
                        <div className='flex w-full sm:w-1/2 md:w-1/2 lg:w-2/5 justify-center md:justify-start items-center'>
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[50px] bg-gray-900 text-white flex items-center justify-center text-sm shadow-inner">
                <Copyright width={15} />LVTN - Trần Đình Thái - 2025
            </div>

        </div>
    )
}

export default LoginPage
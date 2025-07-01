"use client";

import { logout } from "@/lib/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCog } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";

const NavUser = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col gap-1">
      <Link
        href={"/profile"}
      >
        <button
          className="flex items-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200 hover:text-gray-800 w-full cursor-pointer"
        >
          <FaUserCog className="w-5 h-5" />
          <span className="lg:block">Quản lý tài khoản</span>
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200 hover:text-red-600 w-full cursor-pointer"
      >
        <RiLogoutBoxRFill className="w-5 h-5" />
        <span className="lg:block">Đăng xuất</span>
      </button>
    </div>
  );
};

export default NavUser;

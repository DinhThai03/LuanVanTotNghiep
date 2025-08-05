"use client"

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import NavUser from "./nav-user";
import { FaRegMessage } from "react-icons/fa6";
import { BsBell } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { User } from "@/types/UserType";
import Cookies from "js-cookie";
import { profile } from "@/features/auth/api";
import Sidebar from "./sidebar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await profile()
      if (res)
        setCurrentUser(res);
    }
    fetchCurrentUser();
  }, []);

  return (
    <div className="relative flex bg-white shadow-sm z-40 h-[60px] items-center">
      <div className="flex w-full items-center justify-between px-4 md:px-8">
        <div
          className="flex items-center gap-2 cursor-pointer lg:cursor-default"
          onClick={isMobile ? () => setSidebarOpen(true) : undefined}
        >
          <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-16" />
          <div className="flex-col hidden md:flex">
            <span className="text-blue-950 text-[10px]">
              TRƯỜNG ĐẠI HỌC
            </span>
            <span className="text-red-500 text-[12px] font-bold">
              CÔNG NGHỆ SÀI GÒN
            </span>
          </div>
        </div>

        {/* ICONS AND USER */}
        <div className="flex items-center gap-6 justify-end w-fit">
          {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
            <FaRegMessage className="w-4 h-4 text-gray-600" />
          </div>
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
            <BsBell className="w-5 h-5 text-gray-600" />

            {
              false ?
                <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div> : ""
            }
          </div> */}
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">{currentUser?.last_name + " " + currentUser?.first_name}</span>
            <span className="text-[10px] text-gray-500 text-right">{currentUser?.role}</span>
          </div>

          {/* AVATAR & MENU */}
          <div className="relative" ref={menuRef}>

            <FaUserCircle
              className="w-8 h-8 text-gray-500 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-max bg-white shadow-lg rounded-lg  p-2 z-50 border border-gray-200">
                <NavUser />
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <Sidebar isOpen={sidebarOpen} role={currentUser ? currentUser.role : ""} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

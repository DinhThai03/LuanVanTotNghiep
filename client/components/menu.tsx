"use client";
import { User } from "@/types/UserType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSolidSchool } from "react-icons/bi";
import { FaBook, FaBriefcase, FaChalkboardTeacher, FaUserFriends, FaUserGraduate, FaUserShield } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdMeetingRoom } from "react-icons/md";
import Cookies from "js-cookie";
import { profile } from "@/features/auth/api";
import { IoMdNotifications } from "react-icons/io";
import { TbCircleDashedLetterA } from "react-icons/tb";
import { GiArchiveRegister, GiTeacher } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";

const menuItems = [
  {
    items: [
      {
        icon: <IoHome className="w-4.5 h-4.5" />,
        label: "Trang chủ",
        href: "/admin/home",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "Quản lý người dùng",
    items: [
      {
        icon: <FaUserShield className="w-4.5 h-4.5" />,
        label: "Quản trị viên",
        href: "/admin/lists/admins",
        visible: ["admin"],
      },
      {
        icon: <FaChalkboardTeacher className="w-4.5 h-4.5" />,
        label: "Giảng viên",
        href: "/admin/lists/teachers",
        visible: ["admin"],
      },
      {
        icon: <FaUserGraduate className="w-4.5 h-4.5" />,
        label: "Sinh viên",
        href: "/admin/lists/students",
        visible: ["admin"],
      },
      {
        icon: <FaUserFriends className="w-4.5 h-4.5" />,
        label: "Phụ Huynh",
        href: "/admin/lists/students",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "Quản lý đào tạo",
    items: [
      {
        icon: <BiSolidSchool className="w-4.5 h-4.5" />,
        label: "Niên khóa",
        href: "/admin/lists/academic-years",
        visible: ["admin"],
      },
      {
        icon: <FaBriefcase className="w-4.5 h-4.5" />,
        label: "Học kì",
        href: "/admin/lists/semesters",
        visible: ["admin"],
      },
      {
        icon: <FaBook className="w-4.5 h-4.5" />,
        label: "Môn học",
        href: "",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "Quản lý lớp & khoa",
    items: [
      {
        icon: <FaBriefcase className="w-4.5 h-4.5" />,
        label: "Khoa",
        href: "/admin/lists/facultys",
        visible: ["admin"],
      },
      {
        icon: <SiGoogleclassroom className="w-4.5 h-4.5" />,
        label: "Lớp học",
        href: "",
        visible: ["admin"],
      },
      {
        icon: <MdMeetingRoom className="w-4.5 h-4.5" />,
        label: "Phòng học",
        href: "",
        visible: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "Quản lý giảng dạy",
    items: [
      {
        icon: <GiTeacher className="w-4.5 h-4.5" />,
        label: "Bài giảng",
        href: "",
        visible: ["admin"],
      },
      {
        icon: <GiArchiveRegister className="w-4.5 h-4.5" />,
        label: "Đăng ký môn",
        href: "",
        visible: ["admin"],
      },
      {
        icon: <TbCircleDashedLetterA className="w-4.5 h-4.5" />,
        label: "Kết quả",
        href: "",
        visible: ["admin"],
      },
    ],
  },

  {
    title: "Quản lý giảng dạy",
    items: [
      {
        icon: <IoMdNotifications className="w-4.5 h-4.5" />,
        label: "Thông báo",
        href: "",
        visible: ["admin"],
      },
      //   {
      //     icon: <FaBriefcase className="w-4.5 h-4.5" />,
      //     label: "Đăng ký môn",
      //     href: "",
      //     visible: ["admin"],
      //   },
      //   {
      //     icon: <FaBook className="w-4.5 h-4.5" />,
      //     label: "Kết quả",
      //     href: "",
      //     visible: ["admin"],
      //   },
    ],
  },
];

const Menu = () => {
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await profile()
      if (res)
        setCurrentUser(res);
    }
    fetchCurrentUser();
  }, []);
  return (
    <div className="mt-4 text-base sm:text-lg">
      {menuItems.map((group, index) => {
        const visibleItems = group.items.filter((item) =>
          item.visible.includes(String(currentUser?.role))
        );

        if (visibleItems.length === 0) return null;

        return (
          <div
            className="flex flex-col gap-1 px-4 py-2 min-w-0"
            key={`menu-group-${index}`}
          >
            {group.title && (
              <h2 className="text-gray-300 text-sm font-bold mb-1">{group.title}</h2>
            )}
            {visibleItems.map((item) => (
              <Link
                href={item.href.trim()}
                key={`${item.label}-${item.href}`}
                className="flex items-center gap-4 py-2 pl-2 text-gray-500 bg-white rounded-md text-sm hover:bg-gray-100 hover:text-gray-800"
              >
                <div className="shrink-0">{item.icon}</div>
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;

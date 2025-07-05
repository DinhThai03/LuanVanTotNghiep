import React from "react";
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaUserFriends,
    FaUserShield,
} from "react-icons/fa";
import clsx from "clsx";

type UserCardProps = {
    type: "student" | "teacher" | "parent" | "admin";
    count: number;
    onClick?: () => void;
    isSelected?: boolean;
};

const getCardInfo = (type: string) => {
    switch (type) {
        case "student":
            return {
                label: "Sinh viên",
                Icon: FaUserGraduate,
                bg: "bg-blue-100/50",
                iconBg: "bg-blue-200 text-blue-700",
                ring: "ring-blue-300",
            };
        case "teacher":
            return {
                label: "Giảng viên",
                Icon: FaChalkboardTeacher,
                bg: "bg-pink-100/50",
                iconBg: "bg-pink-200 text-pink-700",
                ring: "ring-pink-300",
            };
        case "parent":
            return {
                label: "Phụ huynh",
                Icon: FaUserFriends,
                bg: "bg-yellow-100/50",
                iconBg: "bg-yellow-200 text-yellow-700",
                ring: "ring-yellow-300",
            };
        case "admin":
            return {
                label: "Quản trị viên",
                Icon: FaUserShield,
                bg: "bg-purple-100/50",
                iconBg: "bg-purple-200 text-purple-700",
                ring: "ring-purple-300",
            };
        default:
            return {
                label: "Unknown",
                Icon: FaUserShield,
                bg: "bg-gray-100/50",
                iconBg: "bg-gray-200 text-gray-700",
                ring: "ring-gray-300",
            };
    }
};

const UserCard = ({ type, count, onClick, isSelected }: UserCardProps) => {
    const { label, Icon, bg, iconBg, ring } = getCardInfo(type);

    return (
        <button
            onClick={onClick}
            className={clsx(
                "relative w-full h-[120px] rounded-2xl p-4 transition-all duration-300 flex items-center gap-4 backdrop-blur-md scale-[0.98]",
                "focus:outline-none focus:ring-2 ring-offset-0",
                bg,
                isSelected
                    ? `ring-2 ${ring} shadow-xl ring-offset-0`
                    : "hover:shadow-md",
                ring // Thêm lớp ring vào focus
            )}
            aria-label={`${label} - ${count}`}
        >
            {/* Icon trong khung tròn */}
            <div
                className={clsx(
                    "w-14 h-14 flex items-center justify-center rounded-full shadow-sm",
                    iconBg
                )}
            >
                <Icon size={24} />
            </div>

            {/* Nội dung */}
            <div className="flex flex-col justify-center text-left">
                <div className="text-2xl font-bold leading-tight">{count}</div>
                <div className="text-sm text-gray-700">{label}</div>
            </div>
        </button>
    );
};

export default UserCard;
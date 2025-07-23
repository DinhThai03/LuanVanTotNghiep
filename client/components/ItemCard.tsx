import clsx from "clsx";
import Image from "next/image";

type ItemCardProps = {
    type: "class" | "subject" | "lesson" | "registration";
    count: number;
};

const getBgColor = (type: string) => {
    switch (type) {
        case "class":
            return "bg-[#eef4ff]";         // xanh dương nhạt
        case "subject":
            return "bg-[#fff7e6]";         // vàng kem
        case "lesson":
            return "bg-[#f5f5f5]";         // xám nhẹ
        case "registration":
            return "bg-[#ecfdf5]";         // xanh bạc hà
        default:
            return "bg-gray-100";
    }
};

const getLabel = (type: string) => {
    switch (type) {
        case "class":
            return "Lớp học";
        case "subject":
            return "Môn học";
        case "lesson":
            return "Bài giảng";
        case "registration":
            return "Đăng ký";
        default:
            return type;
    }
};

const ItemCard = ({ type, count }: ItemCardProps) => {
    const bgColor = getBgColor(type);
    const label = getLabel(type);

    return (
        <div className={clsx(
            "relative w-full h-[120px] rounded-2xl p-4 transition-all duration-300 flex items-center gap-4 backdrop-blur-md scale-[0.98]",
            "focus:outline-none focus:ring-2 ring-offset-0",
            getBgColor(type),

        )}>

            {/* Main Count */}
            < h1 className="text-3xl font-bold my-4 text-gray-800" > {count}</ h1>

            {/* Label */}
            < h2 className="text-sm font-medium text-gray-600" > {label}</ h2>
        </div >
    );
};

export default ItemCard;

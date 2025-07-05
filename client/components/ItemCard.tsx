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
        <div className={`rounded-2xl ${bgColor} p-4 flex-1 min-w-[160px] shadow-lg`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-gray-600 border">
                    Năm 2024/25
                </span>
            </div>

            {/* Main Count */}
            <h1 className="text-3xl font-bold my-4 text-gray-800">{count}</h1>

            {/* Label */}
            <h2 className="text-sm font-medium text-gray-600">{label}</h2>
        </div>
    );
};

export default ItemCard;

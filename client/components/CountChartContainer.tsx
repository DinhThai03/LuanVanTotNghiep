import Image from "next/image";
import CountChart from "./CountChart";

type CountChartContainerProps = {
    name: string;
    boys: number;
    girls: number;
};

const getVietnameseTitle = (key: string) => {
    switch (key) {
        case "student":
            return "Sinh viên";
        case "teacher":
            return "Giảng viên";
        case "parent":
            return "Phụ huynh";
        case "admin":
            return "Quản trị viên";
        default:
            return key;
    }
};


const CountChartContainer = ({ name, boys, girls }: CountChartContainerProps) => {
    const total = boys + girls;

    return (
        <div className="bg-white rounded-xl shadow-lg w-full h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">{getVietnameseTitle(name)}</h1>
            </div>

            {/* CHART */}
            <CountChart boys={boys} girls={girls} />

            {/* BOTTOM */}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1 items-center">
                    <div className="w-5 h-5 bg-blue-200 rounded-full" />
                    <h1 className="font-bold">{boys}</h1>
                    <h2 className="text-xs text-gray-600">
                        Nam ({total > 0 ? Math.round((boys / total) * 100) : 0}%)
                    </h2>
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <div className="w-5 h-5 bg-pink-200 rounded-full" />
                    <h1 className="font-bold">{girls}</h1>
                    <h2 className="text-xs text-gray-600">
                        Nữ ({total > 0 ? Math.round((girls / total) * 100) : 0}%)
                    </h2>
                </div>

            </div>
        </div>
    );
};

export default CountChartContainer;

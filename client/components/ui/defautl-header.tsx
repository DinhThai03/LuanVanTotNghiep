import { AdminData } from "@/types/AdminType";
import { HeaderContext } from "@tanstack/react-table";
import { BiSort } from "react-icons/bi";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";

interface DefaultHeaderProps<T> {
    info: HeaderContext<AdminData, T>;
    name: string;
}

export function DefaultHeader<T>({ info, name }: DefaultHeaderProps<T>) {
    const sorted = info.column.getIsSorted();
    return (
        <div
            onPointerDown={(e) => {
                e.preventDefault();
                info.column.toggleSorting();
            }}
            className='cursor-pointer select-none inline-flex items-center gap-1 group'>
            {name}
            {sorted === "asc" && <FaSortAlphaDown className="text-blue-900" />}
            {sorted === "desc" && <FaSortAlphaDownAlt className="text-red-500" />}
            {!sorted && <BiSort className="text-gray-500 opacity-0 group-hover:opacity-100" />}
        </div>
    );
}

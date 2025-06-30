"use client"

import BigCalendar from "@/components/BigCalender"
import { getAttendances } from "@/services/Attendances";
import { useEffect, useState } from "react"

const Page = () => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        const fetchAttendances = async () => {
            const res = await getAttendances("DH52100123");
            setData(res);
            console.log(">>>", res);
        }
        fetchAttendances()
    }, [])
    return (
        <div className='bg-white w-full'>
            <BigCalendar events={data} />
        </div>
    )
}

export default Page
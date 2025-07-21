"use client";

import { useEffect, useState } from "react";
import { profile } from "@/features/auth/api";
import { getStudentExamSchedules } from "@/services/ExamSchedule";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { StudentExamSchedulesResponse } from "@/types/ExamType";
import { getOneStudent } from "@/services/Student";

export default function StudentExamSchedulePage() {
  const [data, setData] = useState<StudentExamSchedulesResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await profile();
        if (pRes) {
          const sRes = await getOneStudent(pRes.id);
          const res = await getStudentExamSchedules(sRes.code, 6);
          setData(res);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch thi:", error);
        toast.error("Không thể tải dữ liệu lịch thi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const allSchedules = data?.exam_schedules ?? [];

  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-60px)] p-4 bg-white">
        <p className="mx-auto p-4 text-muted-foreground">
          Đang tải dữ liệu lịch thi...
        </p>
      </div>
    );
  }

  if (allSchedules.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-60px)] p-4 bg-white">
        <p className="p-4 text-sm text-muted-foreground">
          Không có lịch thi nào được tìm thấy.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-60px)] p-4 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">Môn học</th>
              <th className="border px-3 py-2 text-left">Ngày thi</th>
              <th className="border px-3 py-2 text-left">Giờ thi</th>
              <th className="border px-3 py-2 text-left">Thời lượng</th>
              <th className="border px-3 py-2 text-left">Phòng thi</th>
            </tr>
          </thead>
          <tbody>
            {allSchedules.map((schedule, index) => (
              <tr key={index} className="border-t even:bg-gray-50">
                <td className="border px-3 py-2">{schedule.subject_name}</td>
                <td className="border px-3 py-2">
                  {format(parseISO(schedule.exam_date), "dd/MM/yyyy")}
                </td>
                <td className="border px-3 py-2">
                  {schedule.exam_time.slice(0, 5)}
                </td>
                <td className="border px-3 py-2">{schedule.duration} phút</td>
                <td className="border px-3 py-2">
                  {Array.isArray(schedule.rooms) && schedule.rooms.length > 0 ? (
                    <ul className="list-inside space-y-1">
                      {schedule.rooms.map((room, i) => (
                        <li key={i}>
                          {room.room} (STT {room.start_seat} đến {room.end_seat})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground italic">Chưa phân phòng</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

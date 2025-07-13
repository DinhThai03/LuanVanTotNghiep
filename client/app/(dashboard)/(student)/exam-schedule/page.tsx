"use client";

import { useEffect, useState } from "react";

type ExamRoom = {
  room: string;
  class: string;
  start_seat: number;
  end_seat: number;
};

type ExamSchedule = {
  subject_name: string;
  exam_date: string;
  exam_time: string;
  duration: number;
  rooms: ExamRoom[];
};

export default function StudentExamSchedulePage() {
  const [data, setData] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock dữ liệu
    const timeout = setTimeout(() => {
      const mockData: ExamSchedule[] = [
        {
          subject_name: "Toán cao cấp",
          exam_date: "2025-07-20",
          exam_time: "08:00",
          duration: 90,
          rooms: [
            { room: "P101", class: "CTK43A", start_seat: 1, end_seat: 20 },
            { room: "P102", class: "CTK43A", start_seat: 21, end_seat: 40 },
          ],
        },
        {
          subject_name: "Lập trình Web",
          exam_date: "2025-07-22",
          exam_time: "13:30",
          duration: 60,
          rooms: [
            { room: "P201", class: "CTK43B", start_seat: 1, end_seat: 25 },
          ],
        },
      ];

      setData(mockData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu lịch thi...</p>;
  }

  if (data.length === 0) {
    return <p className="text-muted-foreground">Không có lịch thi nào được tìm thấy.</p>;
  }

  return (
    <div className="w-full bg-white h-[calc(100vh-60px)] p-4">
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Môn học</th>
            <th className="border px-3 py-2 text-left">Ngày thi</th>
            <th className="border px-3 py-2 text-left">Giờ thi</th>
            <th className="border px-3 py-2 text-left">Thời lượng</th>
            <th className="border px-3 py-2 text-left">Phòng thi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((schedule, index) => (
            <tr key={index} className="border-t">
              <td className="border px-3 py-2">{schedule.subject_name}</td>
              <td className="border px-3 py-2">{schedule.exam_date}</td>
              <td className="border px-3 py-2">{schedule.exam_time}</td>
              <td className="border px-3 py-2">{schedule.duration} phút</td>
              <td className="border px-3 py-2">
                <ul className=" list-inside space-y-1">
                  {schedule.rooms.map((room, i) => (
                    <li key={i}>
                      {room.room} - {room.class} (stt {room.start_seat} đến {room.end_seat})
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import CountChartContainer from "@/components/CountChartContainer";
import ItemCard from "@/components/ItemCard";
import UserCard from "@/components/UserCard";
import { DashboardStats } from "@/types/DashboardType";
import { getDashboardStats } from "@/services/Dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAcademicYears } from "@/services/AcademicYear";
import { getSemesters } from "@/services/Semesters";
import { AcademicYearData } from "@/types/AcademicYearType";
import { SemesterData } from "@/types/SemesterType";

type UserGroup = "student" | "teacher" | "parent" | "admin";

const userGroupMap: Record<UserGroup, keyof DashboardStats["users"]> = {
  student: "students",
  teacher: "teachers",
  parent: "parents",
  admin: "admins",
};

const AdminPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup>("student");

  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [academicYearId, setAcademicYearId] = useState<number | undefined>();
  const [semesterId, setSemesterId] = useState<number | undefined>();

  // Load danh sách niên khóa
  useEffect(() => {
    getAcademicYears().then((res) => {
      setAcademicYears(res.data);
      if (res.data.length > 0) {
        setAcademicYearId(res.data[0].id);
      }
    });
  }, []);

  // Load danh sách học kỳ khi chọn niên khóa
  useEffect(() => {
    if (academicYearId) {
      getSemesters(academicYearId).then((res) => setSemesters(res.data));
    } else {
      setSemesters([]);
      setSemesterId(undefined);
    }
  }, [academicYearId]);

  // Lấy dữ liệu dashboard
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats(Number(academicYearId), Number(semesterId));
        setStats(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [academicYearId, semesterId]);

  const getGenderData = () => {
    const key = userGroupMap[selectedGroup];
    return stats?.users[key] ?? { male: 0, female: 0 };
  };

  if (loading)
    return (
      <div className="p-4 text-gray-500 animate-pulse">
        Đang tải thống kê...
      </div>
    );

  if (!stats)
    return (
      <div className="p-4 text-red-500">Không thể tải dữ liệu thống kê.</div>
    );

  return (
    <ScrollArea className="bg-white w-full h-[calc(100vh-60px)] p-4">
      <div className='flex flex-col gap-8'>

        {/* Select lọc */}
        {/* <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium mr-2">Niên khóa:</label>
            <Select
              value={academicYearId?.toString()}
              onValueChange={(val) => setAcademicYearId(Number(val))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn niên khóa" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((ay) => (
                  <SelectItem key={ay.id} value={ay.id.toString()}>
                    {ay.start_year} - {ay.end_year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mr-2">Học kỳ:</label>
            <Select
              value={semesterId?.toString()}
              onValueChange={(val) => setSemesterId(Number(val))}
              disabled={!academicYearId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Chọn học kỳ" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div> */}

        {/* User cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(userGroupMap) as UserGroup[]).map((type) => (
            <UserCard
              key={type}
              type={type}
              count={
                (stats?.users[userGroupMap[type]]?.male ?? 0) +
                (stats?.users[userGroupMap[type]]?.female ?? 0)
              }
              isSelected={selectedGroup === type}
              onClick={() => setSelectedGroup(type)}
            />
          ))}
        </div>

        {/* Item cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ItemCard type="class" count={stats.classes} />
          <ItemCard type="subject" count={stats.subjects} />
          <ItemCard type="lesson" count={stats.lessons} />
          <ItemCard type="registration" count={stats.registrations} />
        </div>

        {/* Chart */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="w-full h-[450px]">
            <CountChartContainer
              name={selectedGroup}
              boys={getGenderData().male}
              girls={getGenderData().female}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AdminPage;

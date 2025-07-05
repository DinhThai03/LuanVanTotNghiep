"use client";

import {
  Calendar,
  momentLocalizer,
  Views,
  View,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useRef, useEffect, useCallback, useMemo, MouseEvent } from "react";
import "moment/locale/vi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScheduleData } from "@/types/ScheduleType";
import { SubjectData } from "@/types/SubjectType";
import { TeacherData } from "@/types/TeacherType";
import Link from "next/link";

moment.locale("vi");
const localizer = momentLocalizer(moment);

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  subject: SubjectData;
  teacher: TeacherData;
  room: string;
  file_path?: string;
};

const getTeacherName = (teacher?: TeacherData) =>
  `${teacher?.user?.last_name ?? ""} ${teacher?.user?.first_name ?? ""}`.trim();

const parseDateTime = (date: string | Date, time: string) => {
  const parsed = moment(date, "YYYY-MM-DD").toDate();
  const [h, m] = time?.split(":").map(Number) || [0, 0];
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), h, m);
};

const ResponsiveSchedule = ({ events, role }: { events: ScheduleData[], role: string }) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(moment().startOf("week").toDate());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const generateEvents = useCallback(() => {
    const all: CalendarEvent[] = [];

    events.forEach((ev) => {
      if (ev.repeat === "weekly") {
        let day = moment(ev.startDate);
        const until = moment(ev.endDate);

        while (day.isSameOrBefore(until)) {
          if (day.isoWeekday() === ev.dayOfWeek) {
            all.push({
              id: ev.id,
              title: ev.title,
              start: parseDateTime(day.toDate(), ev.startTime),
              end: parseDateTime(day.toDate(), ev.endTime),
              subject: ev.subject,
              teacher: ev.teacher,
              room: ev.room,
              file_path: ev.file_path,
            });
          }
          day.add(1, "day");
        }
      } else {
        all.push({
          id: ev.id,
          title: ev.title,
          start: parseDateTime(ev.startDate, ev.startTime),
          end: parseDateTime(ev.startDate, ev.endTime),
          subject: ev.subject,
          teacher: ev.teacher,
          room: ev.room,
          file_path: ev.file_path,
        });
      }
    });

    return all;
  }, [events]);

  const allEvents = useMemo(() => generateEvents(), [generateEvents]);

  const CustomEvent = useCallback(({ event }: { event: CalendarEvent }) => {
    return (
      <div className="flex h-full flex-col gap-2 justify-center items-center text-gray-800 text-md font-medium p-1">
        <div className="text-[10px]">
          {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
        </div>
        <div className="font-bold line-clamp-1">{event.title}</div>
        <div className="line-clamp-1">{event.room}</div>
      </div>
    );
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent, e: React.SyntheticEvent) => {
    e.stopPropagation();
    const rect = calendarRef.current?.getBoundingClientRect();
    setPopupPos({
      x: (e as MouseEvent).clientX - (rect?.left ?? 0),
      y: (e as MouseEvent).clientY - (rect?.top ?? 0),
    });
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
  }, []);

  const EventPopup = () => {
    if (!selectedEvent) return null;

    const popupWidth = 220;
    const popupHeight = 160;
    const containerWidth = calendarRef.current?.offsetWidth || 800;
    const containerHeight = calendarRef.current?.offsetHeight || 600;

    const left =
      containerWidth - popupPos.x > popupWidth
        ? popupPos.x + 10
        : popupPos.x - popupWidth - 10;
    const top =
      containerHeight - popupPos.y > popupHeight
        ? popupPos.y
        : popupPos.y - popupHeight;

    return (
      <div
        className="absolute bg-white shadow-md border p-3 text-sm z-50 rounded-lg"
        style={{ top, left, width: popupWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold mb-1">{selectedEvent.title}</div>
        <div>Mã môn: {selectedEvent.subject.code}</div>
        <div>GV: {getTeacherName(selectedEvent.teacher)}</div>
        <div>Phòng: {selectedEvent.room}</div>
        <div className="mt-2 flex gap-1">
          {selectedEvent.file_path && (
            <Link
              href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${selectedEvent.file_path}`}
              className="block flex-1 text-center bg-cyan-100 text-gray-800 text-xs py-1 rounded"
              target="_blank"
            >
              Bài giảng
            </Link>
          )}
          {(role == "teacher" || role == "admin") &&

            <Link
              href={`/lesson-classes/${selectedEvent.id}`}
              className="block  flex-1 text-center bg-orange-200 text-gray-800 text-xs py-1 rounded"
            >
              Ds lớp
            </Link>
          }
        </div>
      </div>
    );
  };

  const CustomToolbar: React.FC<ToolbarProps<any>> = ({ label, onNavigate }) => (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1 justify-between">
        <button
          onClick={() => onNavigate("PREV")}
          className="p-2 rounded-l-md bg-gray-200 hover:bg-gray-300"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="font-semibold text-sm">
          {view === Views.WEEK
            ? `${moment(currentDate).startOf("week").format("DD/MM/YYYY")} - ${moment(currentDate).endOf("week").format("DD/MM/YYYY")}`
            : moment(currentDate).format("DD/MM/YYYY")}
        </span>
        <button
          onClick={() => onNavigate("NEXT")}
          className="p-2 rounded-r-md bg-gray-200 hover:bg-gray-300"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          className={`px-2 py-1 text-sm rounded ${view === Views.WEEK ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setView(Views.WEEK)}
        >
          Tuần
        </button>
        <button
          className={`px-2 py-1 text-sm rounded ${view === Views.DAY ? "bg-gray-800 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
          onClick={() => setView(Views.DAY)}
        >
          Ngày
        </button>
      </div>
    </div>
  );


  useEffect(() => {
    const closePopup = () => setSelectedEvent(null);
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative [zoom:0.4] md:[zoom:0.7] lg:[zoom:0.8] xl:[zoom:1]"

    >
      <div ref={calendarRef} >
        <Calendar
          timeslots={1}
          step={50}
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          view={view}
          views={[Views.WEEK, Views.DAY]}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(v) => setView(v)}
          components={{ event: CustomEvent, toolbar: CustomToolbar }}
          onSelectEvent={handleSelectEvent}
          min={new Date(2025, 0, 1, 7, 0)}
          max={new Date(2025, 0, 1, 18, 0)}
          formats={{
            dayFormat: (date) => {
              return moment(date).format("dddd");
            },
          }}

        />
        {EventPopup()}
      </div>
    </div>
  );
};

export default ResponsiveSchedule;

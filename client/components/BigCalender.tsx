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
  link?: string;
};

const getTeacherName = (teacher?: TeacherData) =>
  `${teacher?.user?.last_name ?? ""} ${teacher?.user?.first_name ?? ""}`.trim();

const parseDateTime = (date: string | Date, time: string) => {
  const parsed = moment(date, "YYYY-MM-DD").toDate();
  const [h, m] = time?.split(":").map(Number) || [0, 0];
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), h, m);
};

const ResponsiveSchedule = ({ events }: { events: ScheduleData[] }) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(moment().startOf("week").toDate());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

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
              // link: ev.link,
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
          // link: ev.link,
        });
      }
    });

    return all;
  }, [events]);

  const allEvents = useMemo(() => generateEvents(), [generateEvents]);

  const CustomEvent = ({ event }: { event: CalendarEvent }) => (
    <div className="text-xs px-1 py-0.5 truncate">
      <div className="font-semibold">{event.title}</div>
      <div>{event.room}</div>
    </div>
  );

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
        <div>Mã môn: {selectedEvent.subject.id}</div>
        <div>GV: {getTeacherName(selectedEvent.teacher)}</div>
        <div>Phòng: {selectedEvent.room}</div>
        <div className="mt-2 space-y-1">
          {selectedEvent.link && (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL_FILE}${selectedEvent.link}`}
              className="block text-center bg-blue-600 text-white text-xs py-1 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem bài giảng
            </a>
          )}
          <a
            href={`/teacher/students/${selectedEvent.id}`}
            className="block text-center bg-green-600 text-white text-xs py-1 rounded"
          >
            Danh sách lớp
          </a>
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
          className={`px-2 py-1 text-sm rounded ${view === Views.WEEK ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView(Views.WEEK)}
        >
          Tuần
        </button>
        <button
          className={`px-2 py-1 text-sm rounded ${view === Views.DAY ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView(Views.DAY)}
        >
          Ngày
        </button>
      </div>
    </div>
  );


  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const width = wrapperRef.current.offsetWidth;
      const baseWidth = 1200;
      setScale(Math.min(width / baseWidth, 1));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const closePopup = () => setSelectedEvent(null);
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-fit"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      <div ref={calendarRef} className="relative">
        <Calendar
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

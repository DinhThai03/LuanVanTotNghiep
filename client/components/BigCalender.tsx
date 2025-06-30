"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useRef, useEffect, useCallback, useMemo, MouseEvent } from "react";
import "moment/locale/vi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScheduleData } from "@/types/ScheduleType";
import { TeacherData } from "@/types/TeacherType";
import { SubjectData } from "@/types/SubjectType";

moment.locale("vi");

const VIEW_OPTIONS = [
  { id: Views.DAY, label: "Ngày" },
  { id: Views.WEEK, label: "Tuần" },
] as const;

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

const getTeacherName = (teacher?: TeacherData) => {
  return `${teacher?.user?.last_name ?? ""} ${teacher?.user?.first_name ?? ""}`.trim();
};

const localizer = momentLocalizer(moment);

const BigCalendar = ({ events }: { events: ScheduleData[] }) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(moment().startOf("week").toDate());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const calendarRef = useRef<HTMLDivElement>(null);

  const parseDateTime = useCallback((date: string | Date, time: string) => {
    const parsedDate = moment(date, "YYYY-MM-DD").toDate();
    const [hours, minutes] = time?.split(":").map(Number) || [0, 0];
    return new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      hours,
      minutes
    );
  }, []);

  const generateRecurringEvents = useCallback(() => {
    const allEvents: CalendarEvent[] = [];

    events.forEach((event) => {
      if (event.repeat === "weekly") {
        let startDate = moment(event.startDate);
        const repeatUntil = moment(event.endDate);

        while (startDate.isSameOrBefore(repeatUntil)) {
          if (startDate.isoWeekday() === event.dayOfWeek) {
            allEvents.push({
              id: event.id,
              title: event.title,
              start: parseDateTime(startDate.toDate(), event.startTime),
              end: parseDateTime(startDate.toDate(), event.endTime),
              teacher: event.teacher,
              room: event.room,
              subject: event.subject,
            });
          }
          startDate.add(1, "day");
        }
      } else {
        allEvents.push({
          id: event.id,
          title: event.title,
          start: parseDateTime(event.startDate, event.startTime),
          end: parseDateTime(event.startDate, event.endTime),
          teacher: event.teacher,
          room: event.room,
          subject: event.subject,
        });
      }
    });

    return allEvents;
  }, [events, parseDateTime]);

  const allEvents = useMemo(() => generateRecurringEvents(), [generateRecurringEvents]);

  const handleViewChange = useCallback((newView: View, selectedDate?: Date) => {
    setView(newView);
    setSelectedEvent(null);
    if (newView === Views.DAY) {
      setCurrentDate(selectedDate ?? moment().toDate());
    } else if (newView === Views.WEEK) {
      setCurrentDate(moment().startOf("week").toDate());
    }
  }, []);

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      setCurrentDate((prevDate) =>
        direction === "prev"
          ? moment(prevDate).subtract(1, view === Views.WEEK ? "weeks" : "days").toDate()
          : moment(prevDate).add(1, view === Views.WEEK ? "weeks" : "days").toDate()
      );
      setSelectedEvent(null);
    },
    [view]
  );

  const handleSelectEvent = useCallback((event: CalendarEvent, e: React.SyntheticEvent) => {
    e.stopPropagation();
    const rect = calendarRef.current?.getBoundingClientRect();
    const clickX = (e as MouseEvent).clientX - (rect?.left ?? 0);
    const clickY = (e as MouseEvent).clientY - (rect?.top ?? 0);
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
    setPopupPos({ x: clickX, y: clickY });
  }, []);

  const CustomEvent = useCallback(({ event }: { event: CalendarEvent }) => {
    return (
      <div className="flex h-full flex-col justify-center items-center text-gray-800 text-xs font-medium p-1">
        <div className="text-[10px]">
          {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
        </div>
        <div className="font-bold line-clamp-1">{event.title}</div>
        <div className="line-clamp-1">{event.room}</div>
      </div>
    );
  }, []);

  const EventPopup = useCallback(() => {
    if (!selectedEvent) return null;

    const popupWidth = 200;
    const popupHeight = 150;
    const calendarWidth = calendarRef.current?.offsetWidth || window.innerWidth;
    const calendarHeight = calendarRef.current?.offsetHeight || window.innerHeight;

    const xRightSpace = calendarWidth - popupPos.x;
    const yBottomSpace = calendarHeight - popupPos.y;

    const left = xRightSpace > popupWidth
      ? popupPos.x + 10
      : Math.max(popupPos.x - popupWidth - 10, 10);
    const top = yBottomSpace > popupHeight
      ? popupPos.y
      : Math.max(popupPos.y - popupHeight, 10);

    return (
      <div
        className="absolute bg-white border border-gray-300 shadow-lg p-2 z-50 text-sm rounded-lg"
        style={{
          top,
          left,
          width: popupWidth,
          maxWidth: "90vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-semibold mb-1">{selectedEvent.title}</div>
        <div className="mb-1">Mã môn: {selectedEvent.subject.id}</div>
        <div className="mb-1">Giảng viên: {getTeacherName(selectedEvent.teacher)}</div>
        <div className="mb-2">Phòng: {selectedEvent.room}</div>
        <div className="flex justify-between gap-2">
          {selectedEvent.link && (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL_FILE}${selectedEvent.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded bg-cyan-900 text-white text-xs w-full text-center hover:bg-cyan-800 transition-colors"
            >
              Xem bài giảng
            </a>
          )}
          <a
            href={`/teacher/students/${selectedEvent.id}`}
            className="px-2 py-1 rounded bg-cyan-900 text-white text-xs w-full text-center hover:bg-cyan-800 transition-colors"
          >
            Danh sách lớp
          </a>
        </div>
      </div>
    );
  }, [selectedEvent, popupPos]);

  useEffect(() => {
    const handleClickOutside = () => setSelectedEvent(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const currentDateRange = useMemo(() => {
    return view === Views.WEEK
      ? `${moment(currentDate).startOf("week").format("DD/MM/YYYY")} - ${moment(currentDate)
        .endOf("week")
        .format("DD/MM/YYYY")}`
      : moment(currentDate).format("DD/MM/YYYY");
  }, [view, currentDate]);

  return (
    <div className="p-4 relative w-full h-full" ref={calendarRef}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div></div>

        <div className="flex items-center gap-1 order-2 sm:order-1">
          <button
            onClick={() => handleNavigate("prev")}
            className="p-2 rounded-l-md bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="font-semibold text-sm px-2 min-w-[180px] text-center">{currentDateRange}</span>
          <button
            onClick={() => handleNavigate("next")}
            className="p-2 rounded-r-md bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>


        <div className="flex gap-1 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
          {VIEW_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleViewChange(id)}
              className={`w-full sm:w-auto px-3 py-1 rounded-md text-xs sm:text-sm transition-colors ${id === view
                ? "text-white bg-cyan-900 hover:bg-cyan-800"
                : "text-cyan-900 bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div
          className={`${view === Views.WEEK ? "min-w-[800px]" : ""}`}
        >
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WEEK, Views.DAY]}
            view={view}
            date={currentDate}
            min={new Date(2025, 0, 1, 7, 0, 0)}
            max={new Date(2025, 0, 1, 18, 0, 0)}
            toolbar={false}
            formats={{
              weekdayFormat: (date) => moment(date).format("dddd"),
              dayFormat: (date) => moment(date).format("dddd"),
            }}
            components={{
              event: CustomEvent,
            }}
            onSelectEvent={handleSelectEvent}
            onDrillDown={(date) => handleViewChange(Views.DAY, date)}
          />
        </div>
      </div>

      <EventPopup />
    </div>
  );
};

export default BigCalendar;

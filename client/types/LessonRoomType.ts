import { LessonData } from "./LessonType";
import { RoomData } from "./RoomType";

export interface LessonRoomData {
    id: number;
    lesson_id: number;
    room_id: number;
    start_time: string;
    end_time: string;
    lesson: LessonData;
    room: RoomData;
}
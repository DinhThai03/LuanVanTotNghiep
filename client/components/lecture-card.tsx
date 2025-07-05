"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Lecture } from "@/types/LessonType";

interface LectureCardProps {
    lecture: Lecture;
    groupName: string;
}

const DAYS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export function LectureCard({ lecture, groupName }: LectureCardProps) {
    const isFull = lecture.registrations_count >= lecture.room.size;
    const remainingSlots = lecture.room.size - lecture.registrations_count;

    return (
        <div className={cn(
            "w-full p-2 transition-colors",
            isFull ? "bg-gray-100 opacity-75" : "hover:bg-gray-100"
        )}>
            <div className=" w-full flex items-center space-x-4">
                <RadioGroupItem
                    value={lecture.id.toString()}
                    id={`${groupName}-${lecture.id}`}
                    disabled={isFull}
                    className={cn(
                        "w-5 h-5 rounded-full border-2 border-gray-700",
                        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
                        "data-[state=checked]:after:content-[''] data-[state=checked]:after:block data-[state=checked]:after:w-2.5 data-[state=checked]:after:h-2.5 data-[state=checked]:after:mx-auto data-[state=checked]:after:my-auto data-[state=checked]:after:rounded-full data-[state=checked]:after:bg-white", // dấu tròn bên trong
                        "focus:outline-none focus:ring-2 focus:ring-primary" // hiệu ứng focus
                    )}
                />

                <Label htmlFor={`${groupName}-${lecture.id}`} className="w-full cursor-pointer">
                    <div className="w-full grid grid-cols-5 gap-4 items-center">
                        <div className="text-center space-y-2">
                            <p>
                                {DAYS[lecture.day_of_week]}
                            </p>
                            <p className="font-medium">
                                ({lecture.start_time} - {lecture.end_time})
                            </p>
                        </div>
                        <div className=''>

                            <p className="text-sm text-gray-500">GV:</p>
                            <p> {lecture.teacher_subject.teacher.user.last_name + " " + lecture.teacher_subject.teacher.user.first_name}</p>
                        </div>

                        <div>
                            <p className="text-sm">Phòng học</p>
                            <p className="font-medium">{lecture.room.name}</p>

                        </div>

                        <div className="">
                            <div className="flex flex-col items-center gap-2 mt-1">
                                <Badge
                                    variant={isFull ? "destructive" : "outline"}
                                    className="text-xs"
                                >
                                    {lecture.registrations_count}/{lecture.room.size}
                                </Badge>
                                {!isFull && (
                                    <span className="text-xs text-green-600">
                                        {remainingSlots} chỗ trống
                                    </span>
                                )}
                                {isFull && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Lớp đã đầy
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="">
                            <p className="text-sm">Thời gian diễn ra</p>
                            <p className="font-medium">
                                Từ {new Date(lecture.start_date).toLocaleDateString("vi-VN")} đến {new Date(lecture.end_date).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    </div>
                </Label>
            </div>
        </div>
    );
}
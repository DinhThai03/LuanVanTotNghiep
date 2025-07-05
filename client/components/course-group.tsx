"use client";

import { LectureCard } from "./lecture-card";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "./ui/radio-group";
import { useEffect, useState } from "react";
import { Lecture } from "@/types/LessonType";

interface CourseGroupProps {
    subjectCode: string;
    subjectName: string;
    lectures: Lecture[];
    onSelectLecture?: (subjectCode: string, lectureId: number | undefined) => void;
}

export function CourseGroup({
    subjectCode,
    subjectName,
    lectures,
    onSelectLecture,
}: CourseGroupProps) {
    const [value, setValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        const registeredLecture = lectures.find((lecture) => lecture.is_registered);
        if (registeredLecture && value === undefined) {
            setValue(String(registeredLecture.id));
            onSelectLecture?.(subjectCode, registeredLecture.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lectures]);


    const handleChange = (val: string) => {
        setValue((prev) => {
            const newValue = prev === val ? undefined : val;

            onSelectLecture?.(subjectCode, newValue ? parseInt(newValue) : undefined);

            return newValue;
        });
    };

    const totalRemaining = lectures.reduce((sum, lecture) => {
        return sum + (lecture.room.size - lecture.registrations_count);
    }, 0);

    return (
        <Card className="[zoom:0.5] md:[zoom:1] p-0 gap-0 overflow-hidden">
            <CardHeader className="bg-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {subjectName} <span className="text-gray-500">({subjectCode})</span>
                        </h2>
                        <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                                {lectures[0].teacher_subject.subject.credit} tín chỉ
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                {lectures[0].teacher_subject.subject.tuition_credit} TC học phí
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tổng chỗ trống:
                        </span>
                        <Badge
                            variant={totalRemaining > 0 ? "default" : "destructive"}
                            className="text-xs"
                        >
                            {totalRemaining}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <RadioGroup value={value} onValueChange={handleChange} className="flex items-center space-x-4">
                    <div className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {lectures.map((lecture) => (
                            <LectureCard
                                key={lecture.id}
                                lecture={lecture}
                                groupName={subjectCode}
                            />
                        ))}
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

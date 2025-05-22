<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Announcement;
use Illuminate\Support\Carbon;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        Announcement::insert([
            [
                'title' => 'Thông báo khai giảng',
                'content' => 'Lễ khai giảng năm học mới sẽ diễn ra vào ngày 5/9.',
                'date' => Carbon::create(2025, 9, 5),
            ],
            [
                'title' => 'Nộp học phí học kỳ 1',
                'content' => 'Hạn chót nộp học phí là ngày 20/9. Sinh viên vui lòng hoàn tất đúng hạn.',
                'date' => Carbon::create(2025, 9, 1),
            ],
            [
                'title' => 'Kế hoạch thi giữa kỳ',
                'content' => 'Lịch thi giữa kỳ sẽ được thông báo trên hệ thống vào tuần tới.',
                'date' => Carbon::create(2025, 10, 15),
            ],
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ClassAnnouncement;

class ClassAnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ClassAnnouncement::insert([
            [
                'class_id' => 1,
                'announcement_id' => 1,
                
            ],
            [
                'class_id' => 2,
                'announcement_id' => 2,
            ],
        ]);
    }
}

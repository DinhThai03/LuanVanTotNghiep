<?php

namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Process;

class AnnouncementNotification extends Notification
{
    use Queueable;

    public $announcement;

    public function __construct(Announcement $announcement)
    {
        $this->announcement = $announcement;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Thông báo mới: ' . $this->announcement->title)
            ->line($this->announcement->content)
            ->line('Ngày: ' . \Carbon\Carbon::parse($this->announcement->date)->format('d/m/Y'))
            ->action('Xem chi tiết', env('CLIENT_URL'))
            ->line('Vui lòng kiểm tra và thực hiện nếu cần.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'announcement_id' => $this->announcement->id,
            'title' => $this->announcement->title,
        ];
    }
}

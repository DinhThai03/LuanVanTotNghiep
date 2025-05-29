<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;
    public $token;
    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $resetUrl = url("/reset-password?token={$this->token}&email={$notifiable->email}");

        return (new MailMessage)
            ->subject('Yêu cầu đặt lại mật khẩu')
            ->line('Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu.')
            ->action('Đặt lại mật khẩu', $resetUrl)
            ->line('Nếu bạn không yêu cầu, vui lòng bỏ qua.');
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

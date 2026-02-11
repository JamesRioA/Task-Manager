<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskAssigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    public function __construct($task)
    {
        // Load users so the frontend has the full team context immediately
        $this->task = $task->load('users');
    }

    public function broadcastOn()
    {
        // We broadcast on a public channel named 'tasks'
        return new Channel('tasks');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use App\Events\TaskStatusUpdated;
use App\Events\TaskAssigned;
use App\Events\TaskUpdated;

class TaskController extends Controller
{

    public function index()
    {
        // Eager load 'users' to avoid N+1 query issues
        return Task::with('users')->latest()->get();
    }

    public function store(Request $request)
    {
        if($request->user()->role !== 'admin')
        {
            return response()->json([
                'message' => 'Unauthorized, Admin Access Required'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_ids' => 'required|array',
        ]);

       $task = Task::create($request->only('title', 'description'));
       $task->users()->sync($request->user_ids);

       broadcast(new TaskAssigned($task))->toOthers();

       return response()->json($task->load('users'), 201);
    }
    
    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $data = [
            'status' => $validated['status'],
        ];

        // If the task is being marked as completed, record who did it
        if ($validated['status'] === 'completed') {
            $data['completed_by'] = $request->user()->id;
        } else {
            // Optional: Clear the completer if it's being moved back to pending/in_progress
            $data['completed_by'] = null;
        }

        $updated = $task->update($data);

        if ($updated) {
            broadcast(new TaskStatusUpdated($task->load('users')))->toOthers();
        }

        return response()->json($task->load('users'), 200);
    }

    public function update(Request $request, Task $task)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'required|in:pending,in_progress,completed',
            'user_ids'    => 'required|array',
        ]);

        // Update core fields
        $task->update($request->only('title', 'description', 'status'));

        // Re-sync the team (this deletes old assignments and adds new ones)
        $task->users()->sync($request->user_ids);

        // Broadcast to everyone
        broadcast(new TaskUpdated($task))->toOthers();

        return response()->json($task->load('users'), 200);
    }
   
    public function myTasks(Request $request)
    {
        // Returns only tasks where the user_id matches the authenticated user
        return $request->user()->tasks()->with('users')->get();
    }
}

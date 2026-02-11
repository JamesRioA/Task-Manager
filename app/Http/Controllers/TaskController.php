<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use App\Events\TaskStatusUpdated;

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

        $task = Task::create($validated);
        $task->users()->sync($request->user_ids);

        return response()->json($task->load('users'), 201);
    }
    
    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $updated = $task->update(['status' => $validated['status']]);

        if ($updated) {
            broadcast(new TaskStatusUpdated($task->load('users')))->toOthers();
        }

        return response()->json($task->load('users'), 200);
    }
   
    public function myTasks(Request $request)
    {
        // Returns only tasks where the user_id matches the authenticated user
        return $request->user()->tasks()->with('users')->get();
    }
}

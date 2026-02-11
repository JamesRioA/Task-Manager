<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
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
}

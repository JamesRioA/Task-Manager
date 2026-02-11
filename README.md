# Task Commander: Real-Time Workload Manager

A high-performance, event-driven task management system built with **Laravel 10** and **React**. This project replaces traditional polling with a persistent WebSocket architecture using **Laravel Reverb**, ensuring mission-critical data is synchronized across all users with zero latency.

## 🚀 Key Features

* **Real-Time Kanban Board**: Surgical UI updates ensure that when a task moves, it transitions across all user dashboards instantly without a page refresh.
* **Surgical State Reconciliation**: The frontend logic identifies specific task changes and updates only those objects in the state, preventing "UI blinking" or full table reloads.
* **Role-Based Access Control**:
    * **Admins**: Full visibility into team workload, ability to assign/reassign agents, and manage the task backlog.
    * **Employees**: Focused view of personal assignments with one-click status transitions.
* **Drag-and-Drop Interaction**: Built with `@dnd-kit` for a smooth, production-grade user experience.
* **Optimistic UI**: Local state updates immediately upon user action, with automatic reconciliation if the server request fails.

## 🛠️ Tech Stack

* **Backend**: Laravel 10 (PHP)
* **Frontend**: React (JSX), Material UI (MUI)
* **Real-Time Engine**: Laravel Reverb (WebSockets)
* **Frontend Bridge**: Laravel Echo & Pusher-js
* **Database**: MySQL / PostgreSQL (with eager-loaded relationships)

## 📦 Installation & Setup

### 1. Backend Requirements
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/JamesRioA/Task-Manager.git
    cd Task-and-Workload-Manager
    ```
2.  **Install Dependencies**:
    ```bash
    composer install
    ```
3.  **Environment Configuration**:
    * Copy `.env.example` to `.env`.
    * Set `BROADCAST_DRIVER=reverb`.
    * Configure your database credentials.
4.  **Database & Reverb Setup**:
    ```bash
    php artisan key:generate
    php artisan migrate --seed
    php artisan reverb:install
    ```

### 2. Frontend Requirements
1.  **Install Node Dependencies**:
    ```bash
    npm install
    ```
2.  **Vite Configuration**:
    Ensure your `resources/js/utils/echo.js` is configured to use the Reverb broadcaster.

## 🚦 Running the System

To enable full real-time synchronization, you must have **three** terminals running:

1.  **API Server**:
    ```bash
    php artisan serve
    ```
2.  **WebSocket Server**:
    ```bash
    php artisan reverb:start
    ```
3.  **Frontend Bundler**:
    ```bash
    npm run dev
    ```

## 🛡️ Architectural Highlight: Surgical Sync

This project rejects the "trash" approach of fetching the entire task list every few seconds. Instead, it uses **Event-Driven Architecture**:



1.  **Event Dispatch**: When a task is updated in `TaskController.php`, a `ShouldBroadcast` event is dispatched.
2.  **Passive Listening**: The React frontend sits idle until a WebSocket frame is received via `echo.channel('tasks')`.
3.  **Surgical Update**: The `updateTaskLocally` function swaps only the affected task in the array:
    ```javascript
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    ```

## 👨‍💻 Author
**Rio**
* Graduating BSIT Student, Bukidnon State University.
* Focused on IoT, Machine Learning, and High-Performance Web Systems.

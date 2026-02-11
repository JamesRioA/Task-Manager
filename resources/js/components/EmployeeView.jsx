import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Chip, Stack, Button,
    LinearProgress, Container, alpha
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { echo } from '../utils/echo';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const statusConfig = {
    pending: { color: '#4f46e5', bg: 'rgba(79,70,229,0.04)', label: 'TO DO', dot: '#818cf8' },
    in_progress: { color: '#f59e0b', bg: 'rgba(245,158,11,0.04)', label: 'IN PROGRESS', dot: '#fbbf24' },
    completed: { color: '#10b981', bg: 'rgba(16,185,129,0.04)', label: 'COMPLETED', dot: '#34d399' },
};

const SortableTaskCard = ({ task, color, onStatusUpdate }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.3 : 1, cursor: 'grab' };
    const isCompleted = task.status === 'completed';

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} elevation={0} sx={{ mb: 2, borderLeft: `4px solid ${color}`, '&:active': { cursor: 'grabbing' } }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{task.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: isCompleted ? 0 : 1.5 }}>
                    {task.description || "No description."}
                </Typography>
                {!isCompleted && (
                    <Button fullWidth variant="contained" disableElevation size="small"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onStatusUpdate(task.id, task.status === 'pending' ? 'in_progress' : 'completed')}
                        sx={{ background: task.status === 'pending' ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : 'linear-gradient(135deg, #059669, #10b981)' }}
                    >
                        {task.status === 'pending' ? 'Start' : 'Mark Complete'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ status, tasks, onStatusUpdate }) => {
    const config = statusConfig[status];
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <Grid item xs={12} lg={4}>
            <Box ref={setNodeRef} sx={{ p: 2.5, borderRadius: '12px', bgcolor: config.bg, border: '1px solid', borderColor: 'divider', minHeight: '70vh' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <FiberManualRecordIcon sx={{ fontSize: 10, color: config.dot }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: config.color }}>{config.label}</Typography>
                    </Stack>
                    <Chip label={tasks.length} size="small" sx={{ fontWeight: 800, bgcolor: alpha(config.color, 0.1), color: config.color }} />
                </Stack>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <Box sx={{ minHeight: '50vh' }}>
                        {tasks.map(task => <SortableTaskCard key={task.id} task={task} color={config.color} onStatusUpdate={onStatusUpdate} />)}
                    </Box>
                </SortableContext>
            </Box>
        </Grid>
    );
};

export default function EmployeeView() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const fetchMyTasks = async () => {
        try { const { data } = await api.get(`/my-tasks?t=${Date.now()}`); setTasks(data); } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const updateTaskLocally = (updatedTask) => {
        const isMyTask = updatedTask.users?.some(u => u.id === user.id);
        setTasks(prev => {
            const exists = prev.some(t => t.id === updatedTask.id);
            if (isMyTask) {
                if (exists) return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
                return [updatedTask, ...prev];
            }
            return prev.filter(t => t.id !== updatedTask.id);
        });
    };

    useEffect(() => {
        fetchMyTasks();

        // REVERB LISTENERS [cite: 2025-12-10]
        const channel = echo.channel('tasks');
        channel.listen('TaskStatusUpdated', (e) => updateTaskLocally(e.task))
            .listen('TaskUpdated', (e) => updateTaskLocally(e.task))
            .listen('TaskAssigned', (e) => updateTaskLocally(e.task));

        return () => echo.leaveChannel('tasks');
    }, [user.id]);

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
        } catch (error) { fetchMyTasks(); }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        const activeTask = tasks.find(t => t.id === active.id);
        let targetStatus = over.id;
        if (!['pending', 'in_progress', 'completed'].includes(over.id)) {
            targetStatus = tasks.find(t => t.id === over.id)?.status;
        }
        if (targetStatus && activeTask.status !== targetStatus) {
            handleStatusUpdate(active.id, targetStatus);
        }
    };

    if (loading) return <LinearProgress />;

    return (
        <Container maxWidth={false} sx={{ px: { xs: 2, lg: 5 }, py: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: 'white', display: 'flex' }}>
                    <AssignmentRoundedIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box><Typography variant="h4" sx={{ fontWeight: 800 }}>My Board</Typography></Box>
            </Stack>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                    <KanbanColumn status="pending" tasks={tasks.filter(t => t.status === 'pending')} onStatusUpdate={handleStatusUpdate} />
                    <KanbanColumn status="in_progress" tasks={tasks.filter(t => t.status === 'in_progress')} onStatusUpdate={handleStatusUpdate} />
                    <KanbanColumn status="completed" tasks={tasks.filter(t => t.status === 'completed')} onStatusUpdate={handleStatusUpdate} />
                </Grid>
                <DragOverlay>{activeId ? <Card elevation={10} sx={{ p: 2, width: 300 }}><Typography sx={{ fontWeight: 700 }}>{tasks.find(t => t.id === activeId).title}</Typography></Card> : null}</DragOverlay>
            </DndContext>
        </Container>
    );
}
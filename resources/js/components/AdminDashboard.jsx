import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Chip,
    AvatarGroup, Avatar, Tooltip, Divider, Container,
    Stack, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Autocomplete, Button, alpha
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import api from '../api/axios';
import { echo } from '../utils/echo';

// DND Kit Core & Sortable
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const statusConfig = {
    pending: { color: '#4f46e5', bg: 'rgba(79,70,229,0.04)', label: 'BACKLOG', dot: '#818cf8' },
    in_progress: { color: '#f59e0b', bg: 'rgba(245,158,11,0.04)', label: 'IN PROGRESS', dot: '#fbbf24' },
    completed: { color: '#10b981', bg: 'rgba(16,185,129,0.04)', label: 'COMPLETED', dot: '#34d399' },
};

const SortableTaskCard = ({ task, color, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            elevation={0}
            sx={{
                mb: 2,
                borderLeft: `4px solid ${color}`,
                bgcolor: '#fff',
                '&:active': { cursor: 'grabbing' },
                '&:hover': {
                    borderColor: color,
                    boxShadow: `0 8px 25px ${alpha(color, 0.12)}`,
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.9rem' }}>
                        {task.title}
                    </Typography>
                    <IconButton
                        size="small"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onEdit(task)}
                        sx={{ mt: -0.5, mr: -0.5 }}
                    >
                        <EditRoundedIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.82rem', lineHeight: 1.6 }}>
                    {task.description || "No mission intelligence provided."}
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                        {task.status === 'completed' ? 'MISSION ACCOMPLISHED BY:' : 'ASSIGNED AGENTS:'}
                    </Typography>
                    <AvatarGroup max={4} sx={{ justifyContent: 'start', '& .MuiAvatar-root': { width: 26, height: 26, fontSize: '0.7rem' } }}>
                        {task.users?.map((u) => (
                            <Tooltip key={u.id} title={u.name} arrow>
                                <Avatar sx={{ bgcolor: '#4f46e5' }}>
                                    {u.name.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                </Box>
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ status, tasks, onEdit }) => {
    const config = statusConfig[status];
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <Grid item xs={12} md={4}>
            <Box ref={setNodeRef} sx={{ p: 2.5, borderRadius: '12px', bgcolor: config.bg, border: '1px solid', borderColor: 'divider', minHeight: '70vh' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <FiberManualRecordIcon sx={{ fontSize: 10, color: config.dot }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: config.color }}>
                            {config.label}
                        </Typography>
                    </Stack>
                    <Chip label={tasks.length} size="small" sx={{ fontWeight: 800, bgcolor: alpha(config.color, 0.1), color: config.color }} />
                </Stack>

                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <Box sx={{ minHeight: '50vh' }}>
                        {tasks.map(task => (
                            <SortableTaskCard key={task.id} task={task} color={config.color} onEdit={onEdit} />
                        ))}
                    </Box>
                </SortableContext>
            </Box>
        </Grid>
    );
};

export default function AdminDashboard() {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const fetchData = async () => {
        try {
            const [taskRes, userRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/users')
            ]);
            setTasks(taskRes.data);
            setEmployees(userRes.data);
        } catch (error) { console.error("Admin Sync Error:", error); }
    };

    const updateTaskLocally = (updatedTask) => {
        setTasks(prev => {
            const exists = prev.some(t => t.id === updatedTask.id);
            if (exists) {
                return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
            }
            return [updatedTask, ...prev];
        });
    };

    useEffect(() => {
        fetchData();

        // RUTHLESS REVERB: No intervals, only listening [cite: 2025-12-10]
        const channel = echo.channel('tasks');
        channel.listen('TaskStatusUpdated', (e) => updateTaskLocally(e.task))
            .listen('TaskUpdated', (e) => updateTaskLocally(e.task))
            .listen('TaskAssigned', (e) => updateTaskLocally(e.task));

        return () => echo.leaveChannel('tasks');
    }, []);

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        let targetStatus = over.id;

        if (!['pending', 'in_progress', 'completed'].includes(over.id)) {
            const overTask = tasks.find(t => t.id === over.id);
            targetStatus = overTask?.status;
        }

        if (targetStatus && activeTask.status !== targetStatus) {
            try {
                setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: targetStatus } : t));
                await api.patch(`/tasks/${active.id}/status`, { status: targetStatus });
            } catch (error) { fetchData(); }
        }
    };

    return (
        <Container maxWidth={false} sx={{ py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ p: 1.2, borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white', display: 'flex' }}>
                    <DashboardRoundedIcon sx={{ fontSize: 26 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Operations Dashboard</Typography>
            </Stack>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                    <KanbanColumn status="pending" tasks={tasks.filter(t => t.status === 'pending')} onEdit={(t) => { setEditingTask({ ...t, user_ids: t.users.map(u => u.id) }); setEditModalOpen(true); }} />
                    <KanbanColumn status="in_progress" tasks={tasks.filter(t => t.status === 'in_progress')} onEdit={(t) => { setEditingTask({ ...t, user_ids: t.users.map(u => u.id) }); setEditModalOpen(true); }} />
                    <KanbanColumn status="completed" tasks={tasks.filter(t => t.status === 'completed')} onEdit={(t) => { setEditingTask({ ...t, user_ids: t.users.map(u => u.id) }); setEditModalOpen(true); }} />
                </Grid>
                <DragOverlay>
                    {activeId ? (
                        <Card elevation={10} sx={{ borderLeft: `4px solid ${statusConfig[tasks.find(t => t.id === activeId).status].color}`, p: 2, width: 300 }}>
                            <Typography sx={{ fontWeight: 700 }}>{tasks.find(t => t.id === activeId).title}</Typography>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* EDIT MODAL */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>Modify Mission</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField label="Title" fullWidth value={editingTask?.title || ''} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                        <Autocomplete multiple options={employees} getOptionLabel={(o) => o.name} value={employees.filter(e => editingTask?.user_ids?.includes(e.id))} onChange={(e, val) => setEditingTask({ ...editingTask, user_ids: val.map(v => v.id) })} renderInput={(p) => <TextField {...p} label="Reassign Agents" />} />
                        <TextField label="Status" select fullWidth SelectProps={{ native: true }} value={editingTask?.status || ''} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                            <option value="pending">Backlog</option><option value="in_progress">In Progress</option><option value="completed">Secured</option>
                        </TextField>
                        <TextField label="Description" fullWidth multiline rows={3} value={editingTask?.description || ''} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={async () => {
                        setUpdateLoading(true);
                        try {
                            await api.put(`/tasks/${editingTask.id}`, { ...editingTask });
                            setEditModalOpen(false);
                            fetchData();
                        } catch (e) { alert("Fail"); } finally { setUpdateLoading(false); }
                    }} disabled={updateLoading}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
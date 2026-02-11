import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Button,
    Chip, Stack, Box, LinearProgress, Paper, Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // Required to identify the current user

export default function EmployeeView() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Access the logged-in user's data

    // 1. Fetching Logic with Cache Busting
    const fetchMyTasks = async () => {
        try {
            const cacheBuster = `?t=${new Date().getTime()}`;
            const { data } = await api.get(`/my-tasks${cacheBuster}`);
            setTasks(data);
        } catch (error) {
            console.error("Error loading tasks", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Real-time & Polling Logic
    useEffect(() => {
        fetchMyTasks();

        // Backup Polling (Safety Net)
        const interval = setInterval(() => {
            fetchMyTasks();
        }, 5000);

        // Real-time Assignment Listener
        if (window.Echo) {
            window.Echo.channel('tasks')
                .listen('TaskAssigned', (e) => {
                    // Check if this specific employee is part of the new task
                    const isAssignedToMe = e.task.users.some(u => u.id === user.id);

                    if (isAssignedToMe) {
                        console.log("New Mission Received:", e.task.title);
                        fetchMyTasks(); // Update the board immediately
                    }
                });
        }

        return () => clearInterval(interval);
    }, [user.id]);

    // 3. Action Handlers
    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchMyTasks(); // Force refresh to sync with backend
        } catch (error) {
            alert("Failed to update task status. Please check your connection.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'warning';
            default: return 'primary';
        }
    };

    if (loading) return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <LinearProgress />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    My Operations Board
                </Typography>
            </Box>

            {tasks.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed #ccc' }}>
                    <Typography variant="h6" color="text.secondary">
                        No active assignments found.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        New missions will appear here automatically when assigned.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map(task => (
                        <Grid item xs={12} md={6} lg={4} key={task.id}>
                            <Card
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    borderTop: `6px solid ${task.status === 'completed' ? '#2e7d32' :
                                            task.status === 'in_progress' ? '#ed6c02' : '#1976d2'
                                        }`,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)' }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {task.title}
                                        </Typography>
                                        <Chip
                                            label={task.status.toUpperCase().replace('_', ' ')}
                                            size="small"
                                            color={getStatusColor(task.status)}
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Stack>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {task.description || "Mission details pending..."}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mt: 'auto' }}>
                                        {task.status === 'pending' && (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                startIcon={<PlayArrowIcon />}
                                                onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                                                sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                            >
                                                Accept & Start
                                            </Button>
                                        )}
                                        {task.status === 'in_progress' && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                fullWidth
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleStatusUpdate(task.id, 'completed')}
                                                sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                            >
                                                Complete Mission
                                            </Button>
                                        )}
                                        {task.status === 'completed' && (
                                            <Box sx={{
                                                textAlign: 'center', py: 1, bgcolor: '#e8f5e9',
                                                borderRadius: 2, color: 'success.main', fontWeight: 'bold'
                                            }}>
                                                Mission Accomplished
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
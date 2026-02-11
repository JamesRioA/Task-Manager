import React, { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Button,
    Chip, Stack, Box, LinearProgress, Paper, Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../api/axios';

export default function EmployeeView() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const { data } = await api.get('/my-tasks');
            setTasks(data);
        } catch (error) {
            console.error("Error loading tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            fetchMyTasks(); // Refresh state
        } catch (error) {
            alert("Failed to update task status.");
        }
    };

    if (loading) return <LinearProgress />;

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>My Assignments</Typography>

            {tasks.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">You have no active assignments. Rest up!</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map(task => (
                        <Grid item xs={12} md={6} key={task.id}>
                            <Card variant="outlined" sx={{ borderLeft: `6px solid ${task.status === 'completed' ? '#2e7d32' : '#1976d2'}` }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{task.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {task.description}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={task.status.replace('_', ' ')}
                                            size="small"
                                            color={task.status === 'in_progress' ? 'secondary' : 'default'}
                                        />
                                    </Stack>

                                    <Divider sx={{ my: 2 }} />

                                    <Stack direction="row" spacing={2}>
                                        {task.status === 'pending' && (
                                            <Button
                                                variant="contained"
                                                startIcon={<PlayArrowIcon />}
                                                onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                                            >
                                                Start Task
                                            </Button>
                                        )}
                                        {task.status === 'in_progress' && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleStatusUpdate(task.id, 'completed')}
                                            >
                                                Mark as Done
                                            </Button>
                                        )}
                                        {task.status === 'completed' && (
                                            <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" /> Task Completed
                                            </Typography>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
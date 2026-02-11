import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Autocomplete, Box, Paper, Typography,
    Grid, Card, CardContent, Chip, AvatarGroup, Avatar, Tooltip, Divider, Container, Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import api from '../api/axios';

export default function AdminView() {
    const [employees, setEmployees] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [form, setForm] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);

    // 1. Fetching Logic with Cache Busting
    const fetchAdminData = async () => {
        try {
            // RUTHLESS FIX: Add a unique timestamp to prevent the browser 
            // from serving a cached (old) version of the task list.
            const cacheBuster = `?t=${new Date().getTime()}`;

            const [userRes, taskRes] = await Promise.all([
                api.get(`/users${cacheBuster}`),
                api.get(`/tasks${cacheBuster}`)
            ]);

            setEmployees(userRes.data);
            setAllTasks(taskRes.data);

            // Console log to verify T02 status in the incoming network data
            console.log("Admin Dashboard Updated:", taskRes.data);
        } catch (error) {
            console.error("Data fetch failed:", error);
        }
    };

    // 2. Polling Logic
    useEffect(() => {
        fetchAdminData();
        // Sync every 3 seconds to capture employee updates quickly
        const refreshInterval = setInterval(() => {
            fetchAdminData();
        }, 3000);
        return () => clearInterval(refreshInterval);
    }, []);

    // 3. Task Creation Logic
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!form.title || selectedUsers.length === 0) return;

        setLoading(true);
        try {
            const payload = {
                ...form,
                user_ids: selectedUsers.map(u => u.id)
            };
            await api.post('/tasks', payload);

            setForm({ title: '', description: '' });
            setSelectedUsers([]);
            fetchAdminData(); // Immediate manual sync after creation
        } catch (error) {
            alert("Task creation failed. Check console for 500 errors.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, mb: 5, borderRadius: 3, borderLeft: '6px solid #1a237e' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AddCircleOutlineIcon color="primary" sx={{ fontSize: 30, mr: 1.5 }} />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Assign New Mission</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create a task and assign it to your team members
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3} component="form" onSubmit={handleCreateTask}>
                    {/* Row 1: Title + Team Members */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Task Title"
                            fullWidth
                            required
                            variant="outlined"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            multiple
                            options={employees}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedUsers}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, newValue) => setSelectedUsers(newValue)}
                            renderInput={(params) => <TextField {...params} label="Select Team Members" variant="outlined" />}
                        />
                    </Grid>

                    {/* Row 2: Description */}
                    <Grid item xs={12}>
                        <TextField
                            label="Description & Operations Info"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Add task details, goals, deadlines, or any relevant context..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </Grid>

                    {/* Row 3: Submit Button */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                size="large"
                                startIcon={<AddCircleOutlineIcon />}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 4 }
                                }}
                            >
                                {loading ? 'Assigning...' : 'Assign Mission'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DashboardIcon sx={{ fontSize: 32, mr: 2, color: 'text.secondary' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Live Operations Dashboard
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {allTasks.length === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', border: '2px dashed #ccc' }}>
                            <Typography color="text.secondary">No active operations currently running.</Typography>
                        </Paper>
                    </Grid>
                )}
                {allTasks.map(task => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card
                            elevation={3}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                borderTop: `5px solid ${task.status === 'completed' ? '#2e7d32' : task.status === 'in_progress' ? '#ed6c02' : '#0288d1'}`,
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-3px)' }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Chip
                                        label={task.status.toUpperCase().replace('_', ' ')}
                                        color={
                                            task.status === 'completed' ? 'success' :
                                                task.status === 'in_progress' ? 'warning' : 'info'
                                        }
                                        size="small"
                                        sx={{ fontWeight: 'bold', borderRadius: 1 }}
                                    />
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
                                        #{task.id}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.3 }}>
                                    {task.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {task.description || "No description provided."}
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                                        ASSIGNED AGENTS
                                    </Typography>
                                    <AvatarGroup max={5} sx={{ justifyContent: 'start', '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.8rem' } }}>
                                        {task.users && task.users.map(u => (
                                            <Tooltip key={u.id} title={u.name} arrow>
                                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                    {u.name.charAt(0)}
                                                </Avatar>
                                            </Tooltip>
                                        ))}
                                    </AvatarGroup>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
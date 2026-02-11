import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Autocomplete, Box, Paper, Typography,
    Grid, Card, CardContent, Chip, AvatarGroup, Avatar, Tooltip, Divider
} from '@mui/material';
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

        // CLEANUP: Essential to prevent memory leaks when switching roles
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
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">Assign New Team Task</Typography>
                <Grid container spacing={2} component="form" onSubmit={handleCreateTask}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Task Title"
                            fullWidth
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            multiple
                            options={employees}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedUsers}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, newValue) => setSelectedUsers(newValue)}
                            renderInput={(params) => <TextField {...params} label="Select Employees" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ height: '56px' }}
                        >
                            {loading ? 'Deploying...' : 'Deploy Task'}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description / Goals"
                            fullWidth
                            multiline
                            rows={2}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Live Team Progress
            </Typography>

            <Grid container spacing={3}>
                {allTasks.length === 0 && (
                    <Typography sx={{ ml: 3, color: 'text.secondary' }}>No active tasks.</Typography>
                )}
                {allTasks.map(task => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card elevation={3} sx={{
                            borderTop: `4px solid ${task.status === 'completed' ? '#2e7d32' : '#ed6c02'}`,
                            transition: 'all 0.3s ease'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Chip
                                        label={task.status.toUpperCase().replace('_', ' ')}
                                        color={
                                            task.status === 'completed' ? 'success' :
                                                task.status === 'in_progress' ? 'secondary' : 'warning'
                                        }
                                        size="small"
                                    />
                                    <Typography variant="caption">ID: #{task.id}</Typography>
                                </Box>
                                <Typography variant="h6" noWrap>{task.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                                    {task.description || "No description provided."}
                                </Typography>

                                <Typography variant="subtitle2" gutterBottom>Assigned to:</Typography>
                                <AvatarGroup max={4} sx={{ justifyContent: 'start' }}>
                                    {task.users && task.users.map(u => (
                                        <Tooltip key={u.id} title={u.name}>
                                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                                                {u.name.charAt(0)}
                                            </Avatar>
                                        </Tooltip>
                                    ))}
                                </AvatarGroup>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
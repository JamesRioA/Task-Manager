import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, Box, Paper, Typography, Grid, Stack, alpha } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import api from '../api/axios';

export default function AdminCreateTask({ onTaskCreated }) {
    const [employees, setEmployees] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [form, setForm] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/users').then(res => setEmployees(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || selectedUsers.length === 0) return;
        setLoading(true);
        try {
            const payload = { ...form, user_ids: selectedUsers.map(u => u.id) };
            await api.post('/tasks', payload);
            onTaskCreated();
        } catch (error) {
            alert("Task creation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Box
                    sx={{
                        p: 1.2,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                        color: 'white',
                        display: 'flex',
                        boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                    }}
                >
                    <PostAddRoundedIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                        Create New Task
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Assign work to your team members
                    </Typography>
                </Box>
            </Stack>

            {/* Form */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                <Grid container spacing={3} component="form" onSubmit={handleSubmit}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Task Title"
                            fullWidth
                            required
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
                            onChange={(e, val) => setSelectedUsers(val)}
                            renderInput={(params) => <TextField {...params} label="Assign Team Members" />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<SendRoundedIcon />}
                                disabled={loading}
                                sx={{
                                    px: 5,
                                    py: 1.4,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                                    boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4338ca 0%, #0891b2 100%)',
                                        boxShadow: '0 6px 20px rgba(79,70,229,0.4)',
                                    },
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Task'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
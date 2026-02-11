import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await api.post('/login', { email, password });
        login(data.user, data.token);
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Sign In</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Email" sx={{ mb: 2 }} onChange={e => setEmail(e.target.value)} />
                    <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} onChange={e => setPassword(e.target.value)} />
                    <Button fullWidth variant="contained" type="submit">Login</Button>
                </form>
            </Paper>
        </Box>
    );
}
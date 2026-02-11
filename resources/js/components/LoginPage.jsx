import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, CssBaseline, Avatar, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, width: '100%' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        >
                            Log In
                        </Button>
                    </Box>
                </Paper>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    {'Technician & Admin Portal'}
                </Typography>
            </Box>
        </Container>
    );
}
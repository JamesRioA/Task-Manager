import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Avatar, Container, Paper, alpha } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/login', { email, password });
            login(data.user, data.token);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e293b 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-30%',
                    width: '80%',
                    height: '150%',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-40%',
                    left: '-20%',
                    width: '60%',
                    height: '120%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: (theme) => alpha(theme.palette.background.paper, 0.08),
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '14px',
                    }}
                >
                    <Avatar
                        sx={{
                            m: 1,
                            width: 52,
                            height: 52,
                            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                            boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
                        }}
                    >
                        <LockOutlinedIcon sx={{ fontSize: 26 }} />
                    </Avatar>

                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            color: '#ffffff',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                        Sign in to your workspace
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
                                    '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
                            }}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
                                    '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.1,
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                                boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4338ca 0%, #0891b2 100%)',
                                    boxShadow: '0 6px 20px rgba(79,70,229,0.5)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Box>
                </Paper>

                <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 4, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}
                >
                    Task & Workload Manager · Admin Portal
                </Typography>
            </Container>
        </Box>
    );
}
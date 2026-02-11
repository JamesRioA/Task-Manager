import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Avatar, Stack, alpha } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage';
import AdminView from './AdminView';
import EmployeeView from './EmployeeView';

export default function MainDashboard() {
    const { user, logout } = useAuth();

    if (!user) return <LoginPage />;

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 0,
                }}
            >
                <Toolbar sx={{ py: 0.5 }}>
                    {/* Brand */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                fontWeight: 900,
                                color: '#fff',
                                boxShadow: '0 2px 10px rgba(79,70,229,0.4)',
                            }}
                        >
                            T
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: '0.04em',
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            TASK COMMANDER
                        </Typography>
                    </Box>

                    {/* User info */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.25),
                                    color: '#22d3ee',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    border: '1.5px solid rgba(34,211,238,0.3)',
                                }}
                            >
                                {user.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#e0e7ff', fontWeight: 600, fontSize: '0.82rem', lineHeight: 1.3 }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                                    {user.role}
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            onClick={logout}
                            color="inherit"
                            size="small"
                            startIcon={<LogoutRoundedIcon sx={{ fontSize: '1rem' }} />}
                            sx={{
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'rgba(255,255,255,0.7)',
                                px: 2,
                                py: 0.7,
                                fontSize: '0.78rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.35)',
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    color: '#fff',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1 }}>
                {user.role === 'admin' ? <AdminView /> : <EmployeeView />}
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 2.5,
                    px: 2,
                    mt: 'auto',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                    © {new Date().getFullYear()} Task & Workload Manager
                </Typography>
            </Box>
        </Box>
    );
}
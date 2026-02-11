import React from 'react';
import { Container, Box, Typography, Button, AppBar, Toolbar, CssBaseline } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage';
import AdminView from './AdminView';
import EmployeeView from './EmployeeView';

export default function MainDashboard() {
    const { user, logout } = useAuth();

    if (!user) return <LoginPage />;

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f4f6f8', // Light grey background for the whole app
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CssBaseline />

            {/* Header */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a237e' }}> {/* Deep Blue */}
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
                        TASK COMMANDER
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Welcome, {user.name} ({user.role})
                        </Typography>
                        <Button
                            onClick={logout}
                            color="inherit"
                            variant="outlined"
                            sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                {/* Role-based view switching */}
                <Box>
                    {user.role === 'admin' ? <AdminView /> : <EmployeeView />}
                </Box>
            </Container>

            {/* Footer (Optional, aligns with "premium" feel) */}
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e0e0e0' }}>
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Task & Workload Manager
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
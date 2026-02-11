import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material'; // <--- Add these imports
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage';
import AdminView from './AdminView';
import EmployeeView from './EmployeeView';

export default function MainDashboard() {
    const { user, logout } = useAuth();

    if (!user) return <LoginPage />;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Team Task Manager</Typography>
                <Button onClick={logout} variant="outlined" color="error">Logout</Button>
            </Box>

            {/* Role-based view switching */}
            <Box sx={{ mt: 2 }}>
                {user.role === 'admin' ? <AdminView /> : <EmployeeView />}
            </Box>
        </Container>
    );
}
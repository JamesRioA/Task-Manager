import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import MainDashboard from './components/MainDashboard';
import { AuthProvider } from './context/AuthContext';

if (document.getElementById('root')) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthProvider>
                    <MainDashboard />
                </AuthProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
}
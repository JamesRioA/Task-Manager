import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainDashboard from './components/MainDashboard';
import { AuthProvider } from './context/AuthContext';

if (document.getElementById('root')) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <AuthProvider>
                <MainDashboard />
            </AuthProvider>
        </React.StrictMode>
    );
}
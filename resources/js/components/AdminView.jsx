import React, { useState } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, alpha
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AdminDashboard from './AdminDashboard';
import AdminCreateTask from './AdminCreateTask';

const drawerWidth = 260;

export default function AdminView() {
    const [activeView, setActiveView] = useState('dashboard');

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardRoundedIcon /> },
        { key: 'create', label: 'Create Task', icon: <AddCircleRoundedIcon /> },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* SIDEBAR */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)',
                        color: 'white',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 0,
                        top: 'auto',
                    },
                }}
            >
                {/* Sidebar Header */}
                <Box sx={{ px: 3, py: 2.5 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255,255,255,0.35)',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            fontSize: '0.65rem',
                        }}
                    >
                        NAVIGATION
                    </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.06)', mx: 2 }} />

                <List sx={{ mt: 1, px: 1.5 }}>
                    {navItems.map((item) => {
                        const isActive = activeView === item.key;
                        return (
                            <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    selected={isActive}
                                    onClick={() => setActiveView(item.key)}
                                    sx={{
                                        borderRadius: '10px',
                                        py: 1.3,
                                        px: 2,
                                        transition: 'all 0.2s ease',
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(255,255,255,0.12)',
                                            borderLeft: '3px solid #06b6d4',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                                        },
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        {React.cloneElement(item.icon, {
                                            sx: {
                                                color: isActive ? '#22d3ee' : 'rgba(255,255,255,0.5)',
                                                fontSize: '1.3rem',
                                                transition: 'color 0.2s ease',
                                                ...(isActive && {
                                                    filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.4))',
                                                }),
                                            },
                                        })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.85rem',
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>

            {/* MAIN WORKSPACE */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    bgcolor: 'background.default',
                    minHeight: 'calc(100vh - 64px)',
                }}
            >
                {activeView === 'dashboard' ? (
                    <AdminDashboard />
                ) : (
                    <AdminCreateTask onTaskCreated={() => setActiveView('dashboard')} />
                )}
            </Box>
        </Box>
    );
}
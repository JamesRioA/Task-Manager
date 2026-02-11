import { createTheme, alpha } from '@mui/material/styles';

const palette = {
    primary: {
        main: '#4f46e5',       // Indigo 600
        dark: '#3730a3',       // Indigo 800
        light: '#818cf8',      // Indigo 400
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#06b6d4',       // Cyan 500
        dark: '#0891b2',       // Cyan 600
        light: '#22d3ee',      // Cyan 400
        contrastText: '#ffffff',
    },
    success: {
        main: '#10b981',       // Emerald 500
        dark: '#059669',
        light: '#34d399',
    },
    warning: {
        main: '#f59e0b',       // Amber 500
        dark: '#d97706',
        light: '#fbbf24',
    },
    error: {
        main: '#ef4444',
        dark: '#dc2626',
        light: '#f87171',
    },
    background: {
        default: '#f1f5f9',    // Slate 100
        paper: '#ffffff',
    },
    text: {
        primary: '#1e293b',    // Slate 800
        secondary: '#64748b',  // Slate 500
    },
    divider: '#e2e8f0',       // Slate 200
};

const theme = createTheme({
    palette,
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h3: { fontWeight: 800, letterSpacing: '-0.02em' },
        h4: { fontWeight: 800, letterSpacing: '-0.01em' },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700, fontSize: '1rem' },
        subtitle1: { fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em' },
        body2: { lineHeight: 1.7 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: palette.background.default,
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${palette.primary.light} transparent`,
                },
                '*::-webkit-scrollbar': { width: '6px' },
                '*::-webkit-scrollbar-thumb': {
                    borderRadius: '3px',
                    backgroundColor: palette.primary.light,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    transition: 'all 0.2s ease-in-out',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: `0 4px 14px ${alpha(palette.primary.main, 0.4)}`,
                        transform: 'translateY(-1px)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': { borderWidth: '1.5px' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    border: `1px solid ${palette.divider}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 10 },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        transition: 'box-shadow 0.2s ease',
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 3px ${alpha(palette.primary.main, 0.15)}`,
                        },
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 14,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    borderRadius: 6,
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontWeight: 700,
                    fontSize: '0.8rem',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: { borderRadius: 4 },
            },
        },
    },
});

export default theme;

import { createTheme, Theme } from '@mui/material/styles';
import { tokens } from './tokens';

/**
 * MUI theme configuration for Minimal Notes
 * Based on Design.md specifications with Notion-like calm utility
 */
export const theme: Theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: tokens.color.bg.default,
            paper: tokens.color.bg.elevated,
        },
        text: {
            primary: tokens.color.text.primary,
            secondary: tokens.color.text.secondary,
            disabled: tokens.color.text.muted,
        },
        primary: {
            main: tokens.color.accent.primary,
            light: tokens.color.accent.secondary,
        },
        divider: tokens.color.border.default,
    },
    typography: {
        fontFamily: tokens.typography.fontFamily.primary,
        fontSize: tokens.typography.fontSize.body,
        h1: {
            fontSize: tokens.typography.fontSize.h1,
            fontWeight: tokens.typography.fontWeight.medium,
            lineHeight: tokens.typography.lineHeight.h1,
        },
        h2: {
            fontSize: tokens.typography.fontSize.h2,
            fontWeight: tokens.typography.fontWeight.medium,
            lineHeight: tokens.typography.lineHeight.h2,
        },
        body1: {
            fontSize: tokens.typography.fontSize.body,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.body,
        },
        caption: {
            fontSize: tokens.typography.fontSize.caption,
            fontWeight: tokens.typography.fontWeight.regular,
            lineHeight: tokens.typography.lineHeight.caption,
            color: tokens.color.text.secondary,
        },
    },
    spacing: (factor: number) => {
        // Map spacing tokens (1-8) to pixels
        if (factor <= 8 && factor >= 1) {
            return tokens.space[factor as keyof typeof tokens.space];
        }
        // Fallback to 8px base for other factors
        return factor * 8;
    },
    shape: {
        borderRadius: tokens.radius.md,
    },
    shadows: [
        'none', // 0
        '0 1px 2px rgba(0, 0, 0, 0.05)', // 1
        '0 4px 6px rgba(0, 0, 0, 0.07)', // 2
        '0 10px 15px rgba(0, 0, 0, 0.1)', // 3
        '0 20px 25px -5px rgba(0, 0, 0, 0.1)', // 4
        '0 10px 10px -5px rgba(0, 0, 0, 0.04)', // 5
        '0 0 0 0 rgba(0, 0, 0, 0)', // 6
        '0 0 0 0 rgba(0, 0, 0, 0)', // 7
        '0 0 0 0 rgba(0, 0, 0, 0)', // 8
        '0 0 0 0 rgba(0, 0, 0, 0)', // 9
        '0 0 0 0 rgba(0, 0, 0, 0)', // 10
        '0 0 0 0 rgba(0, 0, 0, 0)', // 11
        '0 0 0 0 rgba(0, 0, 0, 0)', // 12
        '0 0 0 0 rgba(0, 0, 0, 0)', // 13
        '0 0 0 0 rgba(0, 0, 0, 0)', // 14
        '0 0 0 0 rgba(0, 0, 0, 0)', // 15
        '0 0 0 0 rgba(0, 0, 0, 0)', // 16
        '0 0 0 0 rgba(0, 0, 0, 0)', // 17
        '0 0 0 0 rgba(0, 0, 0, 0)', // 18
        '0 0 0 0 rgba(0, 0, 0, 0)', // 19
        '0 0 0 0 rgba(0, 0, 0, 0)', // 20
        '0 0 0 0 rgba(0, 0, 0, 0)', // 21
        '0 0 0 0 rgba(0, 0, 0, 0)', // 22
        '0 0 0 0 rgba(0, 0, 0, 0)', // 23
        '0 0 0 0 rgba(0, 0, 0, 0)', // 24
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: tokens.radius.md,
                    fontWeight: tokens.typography.fontWeight.medium,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: tokens.radius.md,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: tokens.radius.lg,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: tokens.color.text.secondary,
                    '&:hover': {
                        backgroundColor: tokens.color.bg.surface,
                        color: tokens.color.text.primary,
                    },
                },
            },
        },
    },
    transitions: {
        duration: {
            shortest: tokens.motion.duration.fast,
            shorter: tokens.motion.duration.fast,
            short: tokens.motion.duration.base,
            standard: tokens.motion.duration.base,
            complex: tokens.motion.duration.slow,
            enteringScreen: tokens.motion.duration.slow,
            leavingScreen: tokens.motion.duration.slow,
        },
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: tokens.motion.easing,
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
    },
});

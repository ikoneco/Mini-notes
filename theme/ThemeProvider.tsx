'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

/**
 * Client-side ThemeProvider wrapper
 * Must be a client component because MUI theme contains functions
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
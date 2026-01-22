/**
 * Design tokens for Minimal Notes
 * Based on Design.md specifications
 */

export const tokens = {
    // Colors - semantic first
    color: {
        bg: {
            default: '#ffffff',
            surface: '#fafafa',
            elevated: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
            muted: '#9ca3af',
        },
        border: {
            default: '#e5e7eb',
            subtle: '#f3f4f6',
        },
        accent: {
            primary: '#2563eb',
            secondary: '#3b82f6',
        },
        status: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
    },
    // Spacing - 8pt base
    space: {
        1: 4,
        2: 8,
        3: 16,
        4: 24,
        5: 32,
        6: 40,
        7: 48,
        8: 64,
    },
    // Typography
    typography: {
        fontFamily: {
            primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        fontSize: {
            display: 32,
            h1: 24,
            h2: 18,
            body: 15,
            caption: 12,
        },
        fontWeight: {
            regular: 400,
            medium: 600,
        },
        lineHeight: {
            display: 1.2,
            h1: 1.3,
            h2: 1.35,
            body: 1.55,
            caption: 1.4,
        },
    },
    // Radius
    radius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
    },
    // Motion
    motion: {
        duration: {
            fast: 100,
            base: 200,
            slow: 250,
        },
        easing: 'ease-out',
    },
    // Shadow
    shadow: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
} as const;
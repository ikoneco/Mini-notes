/**
 * UndoToast component
 * 
 * Provides a calm, non-intrusive toast for undoing deleted notes.
 * Auto-dismisses after timeout and restores deleted note on undo.
 */

'use client';

import { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export interface UndoToastProps {
    visible: boolean;
    message?: string;
    onUndo: () => void;
    autoDismissMs?: number;
    onDismiss: () => void;
}

export default function UndoToast({
    visible,
    message = 'Note deleted',
    onUndo,
    autoDismissMs = 5000,
    onDismiss
}: UndoToastProps) {
    const toastRef = useRef<HTMLDivElement>(null);

    // Auto-dismiss timer
    useEffect(() => {
        if (!visible) return;

        const timer = setTimeout(() => {
            onDismiss();
        }, autoDismissMs);

        return () => clearTimeout(timer);
    }, [visible, autoDismissMs, onDismiss]);

    useGSAP(() => {
        if (visible) {
            gsap.fromTo(toastRef.current,
                { y: 50, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.75)' }
            );
        }
    }, { dependencies: [visible] });

    if (!visible) return null;

    return (
        <Box
            ref={toastRef}
            sx={{
                position: 'fixed',
                bottom: 20,
                left: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                px: 2,
                py: 1.5,
                zIndex: 2000,
                border: '1px solid',
                borderColor: 'divider',
                maxWidth: 400,
            }}
        >
            <Typography
                variant="body2"
                sx={{ color: 'text.primary', flex: 1 }}
            >
                {message}
            </Typography>
            <Button
                size="small"
                startIcon={<UndoIcon fontSize="small" />}
                onClick={() => {
                    onUndo();
                    onDismiss();
                }}
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 'auto',
                }}
            >
                Undo
            </Button>
        </Box>
    );
}
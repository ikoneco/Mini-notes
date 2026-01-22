/**
 * UndoToast component
 * 
 * Provides a calm, non-intrusive toast for undoing deleted notes.
 * Auto-dismisses after timeout and restores deleted note on undo.
 */

'use client';

import { useEffect } from 'react';
import { Box, Button, Typography, Fade } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';

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
    // Auto-dismiss timer
    useEffect(() => {
        if (!visible) return;

        const timer = setTimeout(() => {
            onDismiss();
        }, autoDismissMs);

        return () => clearTimeout(timer);
    }, [visible, autoDismissMs, onDismiss]);

    if (!visible) return null;

    return (
        <Fade in={visible}>
            <Box
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
        </Fade>
    );
}
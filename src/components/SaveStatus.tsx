/**
 * SaveStatus component
 * 
 * Displays autosave status for editor.
 * States: saved, saving, error
 */

import { Typography, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface SaveStatusProps {
    isSaving: boolean;
    lastSavedAt: number | null;
    error: string | null;
}

/**
 * Save status indicator component - highly subtle for premium feel
 */
export default function SaveStatus({
    isSaving,
    lastSavedAt,
    error,
}: SaveStatusProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'background.paper',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                boxShadow: 1,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            {error ? (
                <>
                    <ErrorOutlineIcon sx={{ fontSize: '0.8rem', color: 'error.main' }} />
                    <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.7rem' }}>
                        Error saving
                    </Typography>
                </>
            ) : isSaving ? (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', opacity: 0.8 }}>
                    Saving…
                </Typography>
            ) : lastSavedAt ? (
                <>
                    <CheckIcon sx={{ fontSize: '0.8rem', color: 'success.main', opacity: 0.6 }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', opacity: 0.6 }}>
                        Saved
                    </Typography>
                </>
            ) : null}
        </Box>
    );
}
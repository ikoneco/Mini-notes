/**
 * SaveStatus component
 * 
 * Displays autosave status for editor.
 * States: saved, saving, error
 */

import { useRef } from 'react';
import { Typography, Box } from '@mui/material';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

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
    const savedRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isSaving && lastSavedAt && !error) {
            gsap.fromTo(savedRef.current,
                { scale: 1.2, opacity: 1 },
                { scale: 1, opacity: 0.6, duration: 0.6, ease: 'back.out(1.7)' }
            );
        }
    }, { dependencies: [isSaving, lastSavedAt, error] });
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
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: '0.8rem', color: 'error.main' }} />
                    <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.7rem' }}>
                        Error saving
                    </Typography>
                </>
            ) : isSaving ? (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', opacity: 0.8 }}>
                    Saving…
                </Typography>
            ) : lastSavedAt ? (
                <Box ref={savedRef} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DoneOutlinedIcon sx={{ fontSize: '0.8rem', color: 'success.main', opacity: 0.6 }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', opacity: 0.6 }}>
                        Saved
                    </Typography>
                </Box>
            ) : null}
        </Box>
    );
}
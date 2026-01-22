/**
 * NoteRow component
 * 
 * Displays a single note in the notes list with emoji, title, tags, and avatars.
 * Refined to match premium "Docs" list view from screenshots.
 */

'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DocIcon } from './DocIcon';
import { Note } from '../lib/domain/types';

export interface NoteRowProps {
    note: Note;
    isSelected: boolean;
    onSelect: (note: Note) => void;
    onDelete: (noteId: string) => void;
}

/**
 * Format date for display
 */
function formatDate(date: number): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;

    // For older dates, match the screenshot style: "May 19, 2020 1:46pm"
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * NoteRow component
 */
export default function NoteRow({
    note,
    isSelected,
    onSelect,
    onDelete,
}: NoteRowProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const formattedDate = mounted ? formatDate(note.createdAt) : '';

    return (
        <Box
            className="note-row"
            onClick={() => onSelect(note)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.75,
                px: 2,
                cursor: 'pointer',
                borderRadius: '8px',
                mb: 0.5,
                transition: 'all 0.1s ease-out',
                backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                '&:hover': {
                    backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    '& .delete-button': {
                        opacity: 1,
                    }
                },
            }}
        >
            {/* Minimal High-End Icon */}
            <Box sx={{ mr: 2.5, display: 'flex', color: isSelected ? 'text.primary' : 'text.muted' }}>
                <DocIcon size={18} opacity={isSelected ? 0.6 : 0.3} />
            </Box>

            {/* Title & Snippet */}
            <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                <Typography
                    sx={{
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: '0.88rem',
                        color: isSelected ? 'text.primary' : 'rgba(0, 0, 0, 0.8)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {note.title || 'Untitled'}
                </Typography>
            </Box>

            {/* Metadata Section (Right side) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                {/* Date */}
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.muted',
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem',
                        opacity: 0.6
                    }}
                >
                    {formattedDate}
                </Typography>

                {/* Delete Button (visible on hover) */}
                <IconButton
                    className="delete-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note.id);
                    }}
                    aria-label="Delete note"
                    size="small"
                    sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        color: 'text.muted',
                        '&:hover': {
                            color: 'error.main',
                        },
                    }}
                >
                    <DeleteRoundedIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
            </Box>
        </Box>
    );
}
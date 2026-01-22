/**
 * NoteRow component
 * 
 * Displays a single note in the notes list with emoji, title, tags, and avatars.
 * Refined to match premium "Docs" list view from screenshots.
 */

'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Note } from '../lib/domain/types';

export interface NoteRowProps {
    note: Note;
    isSelected: boolean;
    onSelect: (note: Note) => void;
    onDelete: (noteId: string) => void;
}

/**
 * Mock helper to get an emoji based on note title
 */
function getEmoji(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('interview')) return '🤝';
    if (t.includes('mobile')) return '📱';
    if (t.includes('stripe') || t.includes('billing')) return '💳';
    if (t.includes('database')) return '🗄️';
    if (t.includes('marketing')) return '📈';
    if (t.includes('analytics') || t.includes('report')) return '📊';
    if (t.includes('meeting')) return '📝';
    if (t.includes('onboarding')) return '👋';
    return '📄';
}

/**
 * Mock tags based on note title
 */
function getTags(title: string) {
    const t = title.toLowerCase();
    if (t.includes('marketing')) return [{ label: 'Marketing', color: '#ffedd5', textColor: '#9a3412' }];
    if (t.includes('interview')) return [{ label: 'HR', color: '#f3e8ff', textColor: '#581c87' }];
    if (t.includes('stripe') || t.includes('billing')) return [{ label: 'Engineering', color: '#fce7f3', textColor: '#9d174d' }];
    if (t.includes('sales')) return [{ label: 'Sales', color: '#ecfdf5', textColor: '#065f46' }];
    return [];
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

    const emoji = getEmoji(note.title);
    const tags = getTags(note.title);
    const formattedDate = mounted ? formatDate(note.createdAt) : '';

    return (
        <Box
            className="note-row"
            onClick={() => onSelect(note)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.2,
                px: 1.5,
                cursor: 'pointer',
                borderRadius: '10px',
                mx: 1,
                mb: 0.5,
                transition: 'all 0.15s ease',
                backgroundColor: isSelected ? '#F3F4F6' : 'transparent',
                position: 'relative',
                '&:hover': {
                    backgroundColor: isSelected ? '#F3F4F6' : 'rgba(0, 0, 0, 0.02)',
                    '& .delete-button': {
                        opacity: 1,
                    }
                },
            }}
        >
            {/* Color Indicator Bar */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    bottom: '25%',
                    width: '3px',
                    bgcolor: tags[0]?.textColor || '#007AFF',
                    borderRadius: '0 4px 4px 0',
                    opacity: 0.8
                }}
            />
            {/* Emoji Icon */}
            <Typography sx={{ fontSize: '1.2rem', mr: 2, mt: -0.2 }}>
                {emoji}
            </Typography>

            {/* Title */}
            <Box sx={{ flex: 1, minWidth: 0, ml: 1, mr: 1 }}>
                <Typography
                    sx={{
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '0.9rem',
                        color: isSelected ? 'text.primary' : 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {note.title || 'Untitled'}
                </Typography>
            </Box>

            {/* Metadata Section (Right side) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                {/* Date */}
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.disabled',
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem',
                        mr: 0.5
                    }}
                >
                    {formattedDate}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag.label}
                            label={tag.label}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                backgroundColor: tag.color,
                                color: tag.textColor,
                                borderRadius: '4px',
                            }}
                        />
                    ))}
                </Box>

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
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
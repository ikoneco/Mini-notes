/**
 * NoteRow component
 * 
 * Displays a single note in the notes list with emoji, title, tags, and avatars.
 * Refined to match premium "Docs" list view from screenshots.
 */

'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import { Note } from '../lib/domain/types';

export interface NoteRowProps {
    note: Note;
    isSelected: boolean;
    onSelect: (note: Note) => void;
    onDelete: (noteId: string) => void;
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
        setMounted(true);
    }, []);

    const tags = getTags(note.title);
    const formattedDate = mounted ? formatDate(note.createdAt) : '';

    return (
        <Box
            className="note-row"
            onClick={() => onSelect(note)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: 1.25,
                px: 1.5,
                cursor: 'pointer',
                borderRadius: '6px',
                mb: 0.25,
                transition: 'background-color 0.12s ease',
                backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                '&:hover': {
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                    '& .delete-button': {
                        opacity: 1,
                    }
                },
            }}
        >
            {/* Icon */}
            <Box sx={{
                color: isSelected ? 'primary.main' : 'text.muted',
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                opacity: isSelected ? 0.85 : 0.5,
                flexShrink: 0
            }}>
                {isSelected ? <DescriptionIcon sx={{ fontSize: '1rem' }} /> : <DescriptionOutlinedIcon sx={{ fontSize: '1rem' }} />}
            </Box>

            {/* Title */}
            <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                <Typography
                    sx={{
                        fontWeight: isSelected ? 500 : 400,
                        fontSize: '0.875rem',
                        color: isSelected ? 'text.primary' : 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {note.title || 'Untitled'}
                </Typography>
            </Box>

            {/* Date */}
            <Typography
                variant="caption"
                sx={{
                    color: 'text.muted',
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                }}
            >
                {formattedDate}
            </Typography>

            {/* Tags */}
            {tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag.label}
                            label={tag.label}
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                backgroundColor: tag.color,
                                color: tag.textColor,
                                borderRadius: '4px',
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Delete Button */}
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
                    transition: 'opacity 0.15s',
                    color: 'text.muted',
                    ml: 1,
                    p: 0.5,
                    '&:hover': {
                        color: 'error.main',
                    },
                }}
            >
                <DeleteOutlineOutlinedIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
        </Box>
    );
}
/**
 * NotesListLayer component
 * 
 * Progressive disclosure layer for browsing and opening notes without navigating away from editor.
 * Follows Design.md Notes List Layer specification.
 */

'use client';

import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    List,
    IconButton,
    InputAdornment,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { deleteNote } from '../lib/infra/notesStore';
import NoteRow from './NoteRow';
import { Note } from '../lib/domain/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export interface NotesListLayerProps {
    open: boolean;
    onClose: () => void;
    onNoteSelect: (note: Note) => void;
    onNewNote: () => void;
    selectedNoteId: string | null;
    onNoteDelete: (noteId: string) => void;
    notes: Note[];
}

import { DocIcon } from './DocIcon';

/**
 * NotesListLayer component
 * 
 * Provides a sidebar drawer for browsing and selecting notes.
 */

export default function NotesListLayer(props: NotesListLayerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { open, onClose, onNoteSelect, onNewNote, selectedNoteId, onNoteDelete, notes } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    const handleNoteSelectInternal = (note: Note) => {
        onNoteSelect(note);
    };

    const handleDelete = async (noteId: string) => {
        try {
            await deleteNote(noteId);
            onNoteDelete(noteId);
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useGSAP(() => {
        if (open && filteredNotes.length > 0) {
            gsap.fromTo('.note-row',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' }
            );
        }
    }, { dependencies: [open, filteredNotes.length], scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header Area */}
            <Box sx={{ p: 4.5, pb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        cursor: 'pointer',
                        px: 2.5,
                        py: 1,
                        borderRadius: 3,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.92rem', color: 'text.primary', letterSpacing: '-0.01em' }}>
                            All Docs
                        </Typography>
                        <KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.2rem', color: 'text.muted', opacity: 0.4 }} />
                    </Box>
                    <IconButton onClick={onNewNote} aria-label="New Note" size="small" sx={{ ml: 1, color: 'text.muted', opacity: 0.5, '&:hover': { color: 'text.primary', opacity: 1, bgcolor: 'transparent' } }}>
                        <AddRoundedIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                </Box>
                <IconButton onClick={onClose} aria-label="Close" size="small" sx={{ color: 'text.muted', opacity: 0.5, '&:hover': { color: 'text.primary', opacity: 1 } }}>
                    <CloseRoundedIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
            </Box>

            {/* Search Area */}
            <Box sx={{ px: 4, mb: 4 }}>
                <TextField
                    placeholder="Search docs…"
                    variant="standard"
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon sx={{ fontSize: '1.1rem', color: 'text.muted', mr: 1, opacity: 0.5 }} />
                            </InputAdornment>
                        ),
                        sx: {
                            fontSize: '0.9rem',
                            bgcolor: 'rgba(0, 0, 0, 0.025)',
                            px: 2.5,
                            py: 1.15,
                            borderRadius: '14px',
                            color: 'text.primary',
                            border: '1px solid transparent',
                            transition: 'all 0.2s ease',
                            '&:focus-within': {
                                bgcolor: 'transparent',
                                borderColor: 'rgba(0, 0, 0, 0.08)',
                            },
                            '& input::placeholder': {
                                color: 'text.muted',
                                opacity: 0.5,
                            }
                        }
                    }}
                />
            </Box>

            {/* Document List */}
            <Box sx={{ flex: 1, overflow: 'hidden', px: 3, pb: 4 }}>
                {filteredNotes.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 14 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <DocIcon size={48} opacity={0.1} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.6, fontWeight: 500 }}>
                            {searchQuery ? 'No documents found' : 'Ready for a new doc?'}
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding sx={{ height: '100%', overflowY: 'auto' }}>
                        {filteredNotes.map((note) => (
                            <NoteRow
                                key={note.id}
                                note={note}
                                isSelected={note.id === selectedNoteId}
                                onSelect={handleNoteSelectInternal}
                                onDelete={handleDelete}
                            />
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
}
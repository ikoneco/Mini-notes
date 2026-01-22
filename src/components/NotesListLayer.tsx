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
    InputAdornment,
    Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

/**
 * NotesListLayer component
 * 
 * Provides a sidebar drawer for browsing and selecting notes.
 */
export default function NotesListLayer(props: NotesListLayerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { open, onNoteSelect, onNewNote, selectedNoteId, onNoteDelete, notes } = props;
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
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, { dependencies: [open, filteredNotes.length], scope: containerRef });

    return (
        <Box ref={containerRef} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', borderRight: '1px solid', borderColor: 'divider' }}>
            {/* Sidebar Header & Search */}
            <Box sx={{ p: 2, pb: 1 }}>
                <TextField
                    placeholder="Search"
                    variant="standard"
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '1.1rem', color: 'text.secondary', ml: 0.5 }} />
                            </InputAdornment>
                        ),
                        sx: {
                            fontSize: '0.9rem',
                            bgcolor: '#F3F4F6',
                            px: 1,
                            py: 0.8,
                            borderRadius: '50px',
                            '& input': {
                                py: 0.5
                            }
                        }
                    }}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 1.5,
                            py: 1,
                            borderRadius: '8px',
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer'
                        }}
                    >
                        <Typography sx={{ fontSize: '1.1rem' }}>📄</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
                            Notes
                        </Typography>
                    </Box>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    onClick={onNewNote}
                    startIcon={<Box sx={{ fontSize: '1.2rem', mr: 0.5, mb: 0.2 }}>+</Box>}
                    sx={{
                        bgcolor: '#007AFF', // Vibrant Blue
                        color: 'white',
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.2,
                        fontSize: '0.9rem',
                        '&:hover': {
                            bgcolor: '#0062CC',
                        },
                        mb: 3
                    }}
                >
                    Create new note
                </Button>

                <Typography
                    variant="caption"
                    sx={{
                        px: 1.5,
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: 'text.secondary',
                        display: 'block',
                        mb: 1
                    }}
                >
                    Recent
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: 'hidden', px: 1 }}>
                {filteredNotes.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {searchQuery ? 'No results found' : 'Nothing here yet'}
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
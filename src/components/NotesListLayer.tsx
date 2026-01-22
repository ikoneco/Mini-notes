/**
 * NotesListLayer component
 * 
 * Progressive disclosure layer for browsing and opening notes without navigating away from editor.
 * Follows Design.md Notes List Layer specification.
 */

'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    List,
    IconButton,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { deleteNote } from '../lib/infra/notesStore';
import NoteRow from './NoteRow';
import { Note } from '../lib/domain/types';

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
    const { open, onClose, onNoteSelect, onNewNote, selectedNoteId, onNoteDelete, notes } = props;

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

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ mr: 1, fontSize: '1rem' }}>📄</Box>
                            All Docs
                        </Typography>
                        <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                    </Box>
                    <IconButton onClick={onNewNote} aria-label="New Note" size="small" sx={{ ml: 1 }}>
                        <Box sx={{ fontSize: '1.2rem', lineHeight: 1 }}>+</Box>
                    </IconButton>
                </Box>
                <IconButton onClick={onClose} aria-label="Close" size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box sx={{ px: 2, mb: 2 }}>
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
                                <SearchIcon sx={{ fontSize: '1rem', color: 'text.muted' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            fontSize: '0.85rem',
                            bgcolor: 'action.hover',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                        }
                    }}
                />
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
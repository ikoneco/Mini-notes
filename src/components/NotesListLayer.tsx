/**
 * NotesListLayer component
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
    Button,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { Tooltip } from '@mui/material';
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
    isVoiceSupported: boolean;
    isListening: boolean;
    onToggleListening: () => void;
}

export default function NotesListLayer(props: NotesListLayerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { open, onClose, onNoteSelect, onNewNote, selectedNoteId, onNoteDelete, notes, isVoiceSupported, isListening, onToggleListening } = props;
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
        <Box ref={containerRef} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header */}
            <Box sx={{
                pl: '16px',
                pr: '16px',
                height: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        onClick={onNewNote}
                        size="small"
                        variant="contained"
                        disableElevation
                        startIcon={<AddOutlinedIcon sx={{ fontSize: '0.9rem' }} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            height: '28px',
                            px: 1.5,
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '6px',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        New
                    </Button>
                    {isVoiceSupported && (
                        <Tooltip title={isListening ? 'Stop Listening' : 'Start Voice Input'}>
                            <IconButton
                                onClick={onToggleListening}
                                size="small"
                                sx={{
                                    color: isListening ? 'error.main' : 'text.secondary',
                                    bgcolor: isListening ? 'rgba(211, 47, 47, 0.08)' : 'transparent',
                                    p: 0.5,
                                    '&:hover': { bgcolor: isListening ? 'rgba(211, 47, 47, 0.12)' : 'rgba(0,0,0,0.04)' }
                                }}
                            >
                                {isListening ? <MicOutlinedIcon sx={{ fontSize: '1.1rem' }} /> : <MicNoneOutlinedIcon sx={{ fontSize: '1.1rem' }} />}
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <IconButton size="small" onClick={onClose} sx={{ color: 'text.muted', p: 0.5 }}>
                    <CloseOutlinedIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
            </Box>

            {/* Search */}
            <Box sx={{ pl: '16px', pr: '16px', pb: '20px' }}>
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
                                <SearchOutlinedIcon sx={{ fontSize: '1rem', color: 'text.muted' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            fontSize: '0.875rem',
                            bgcolor: 'rgba(0, 0, 0, 0.03)',
                            px: 1.5,
                            py: 1,
                            borderRadius: '6px',
                        }
                    }}
                />
            </Box>

            {/* Notes List */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                {filteredNotes.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10, px: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.muted' }}>
                            {searchQuery ? 'No results found' : 'Nothing here yet'}
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding sx={{ height: '100%', overflowY: 'auto', px: '16px' }}>
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
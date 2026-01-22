/**
 * Home page - Main Editor Surface
 * Refined to match premium Notion-meets-Apple aesthetic from screenshots.
 */

'use client';

import { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { listNotes } from '../src/lib/infra/notesStore';
import { createOrUpdateNote } from '../src/lib/infra/notesStore';
import { useAutosave } from '../src/lib/ui/useAutosave';
import { getLastNote } from '../src/lib/infra/lastNote';
import SaveStatus from '../src/components/SaveStatus';
import NotesListLayer from '../src/components/NotesListLayer';
import UndoToast from '../src/components/UndoToast';
import { Note } from '../src/lib/domain/types';

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

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<'editor' | 'home'>('home');
  const [lastNote, setLastNote] = useState<{ id: string | null; title: string; body: string; createdAt: number | null }>({
    id: null,
    title: '',
    body: '',
    createdAt: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isNotesListOpen, setIsNotesListOpen] = useState(true);
  const [deletedNote, setDeletedNote] = useState<Note | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  const refreshNotes = async () => {
    try {
      const fetchedNotes = await listNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshNotes();
      const note = await getLastNote();
      if (note) {
        setLastNote({ id: note.id, title: note.title, body: note.body, createdAt: note.createdAt });
        setView('editor');
      } else {
        setLastNote({ id: null, title: '', body: '', createdAt: null });
        setView('home');
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const [title, setTitle, body, setBody, autosaveState, cancelSave] = useAutosave(
    lastNote?.body || '',
    lastNote?.title || '',
    lastNote?.createdAt || null,
    lastNote?.id || null,
    {
      debounceMs: 1000,
      onSaveComplete: (noteId: string) => {
        refreshNotes();
        setLastNote(prev => {
          if (!prev.id && noteId) {
            return { ...prev, id: noteId };
          }
          return prev;
        });
      },
      onError: (error: Error) => {
        console.error('Autosave error:', error);
      },
    }
  );

  const displayEmoji = getEmoji(title);

  const handleNoteSelect = (note: Note) => {
    setLastNote({
      id: note.id,
      title: note.title,
      body: note.body,
      createdAt: note.createdAt
    });
    setTitle(note.title);
    setBody(note.body);
    setView('editor');
  };

  const handleNewNote = () => {
    setLastNote({ id: null, title: '', body: '', createdAt: null });
    setTitle('');
    setBody('');
    setView('editor');
  };

  const handleGoHome = () => {
    setView('home');
    setLastNote({ id: null, title: '', body: '', createdAt: null });
    setTitle('');
    setBody('');
  };

  const handleNoteDelete = (note: Note) => {
    // Clear any previous undo state before new delete
    setDeletedNote(null);
    setShowUndoToast(false);

    // Set new deleted note for potential undo
    setDeletedNote(note);
    setShowUndoToast(true);

    if (lastNote?.id === note.id) {
      cancelSave();
      handleGoHome();
    }
  };

  const handleUndo = async () => {
    if (!deletedNote) return;
    try {
      await createOrUpdateNote(deletedNote);
      await refreshNotes();
      if (view === 'home') {
        setLastNote({
          id: deletedNote.id,
          title: deletedNote.title,
          body: deletedNote.body,
          createdAt: deletedNote.createdAt
        });
        setTitle(deletedNote.title);
        setBody(deletedNote.body);
        setView('editor');
      }
      // Clear undo state after successful restoration
      setDeletedNote(null);
      setShowUndoToast(false);
    } catch (error) {
      console.error('Failed to restore note:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Preparing your workspace…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>

      {/* Sidebar - Matches Screenshot 1/0 look */}
      <Box
        sx={{
          width: isNotesListOpen ? 320 : 0,
          borderRight: isNotesListOpen ? '1px solid' : 'none',
          borderColor: 'divider',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.surface',
        }}
      >
        <NotesListLayer
          open={isNotesListOpen}
          notes={notes}
          onClose={() => setIsNotesListOpen(false)}
          onNoteSelect={handleNoteSelect}
          onNewNote={handleNewNote}
          onNoteDelete={async (noteId) => {
            const noteToDelete = notes.find(n => n.id === noteId);
            if (noteToDelete) {
              handleNoteDelete(noteToDelete);
            }
            await refreshNotes();
          }}
          selectedNoteId={lastNote?.id || null}
        />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Top Header Bar - Simplified */}
        <Box
          sx={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Side: Navigation & Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isNotesListOpen && (
              <IconButton size="small" onClick={() => setIsNotesListOpen(true)}>
                <MenuIcon fontSize="small" />
              </IconButton>
            )}

            {/* Breadcrumbs */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Typography
                variant="caption"
                onClick={handleGoHome}
                sx={{
                  color: 'text.muted',
                  cursor: 'pointer',
                  '&:hover': { color: 'text.primary' },
                  fontWeight: view === 'home' ? 600 : 400
                }}
              >
                Home
              </Typography>
              {view === 'editor' && (
                <>
                  <ChevronRightIcon sx={{ fontSize: '1rem', color: 'text.muted', mx: 0.5 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 0.5 }}>{displayEmoji}</Box>
                    {title || 'Untitled'}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          {/* Right Side: Primary Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={handleNewNote}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              New Note
            </Button>
          </Box>
        </Box>

        {/* Scrollable Content Area */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 4, display: 'flex', justifyContent: 'center', alignItems: view === 'home' ? 'center' : 'flex-start' }}>
          {view === 'home' ? (
            <Box sx={{ maxWidth: 400, textAlign: 'center', mb: 8 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', letterSpacing: '-0.02em' }}>
                Minimal Notes
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontSize: '1rem', lineHeight: 1.6 }}>
                Capture your thoughts instantly. Pure focus, zero noise.
                Start writing something meaningful today.
              </Typography>
              <Button
                variant="contained"
                size="large"
                disableElevation
                onClick={handleNewNote}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 2
                }}
              >
                Create your first note
              </Button>
              <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.muted' }}>
                All your data stays local and automatically saves as you type.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%', maxWidth: 720, position: 'relative' }}>

              {/* Document Header - Matches Screenshot 2 Large Title */}
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ fontSize: '4rem', mb: 2, display: 'block' }}>
                  {displayEmoji}
                </Typography>
                <Box
                  component="input"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Untitled"
                  sx={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    bgcolor: 'transparent',
                    fontWeight: 800,
                    fontSize: '2.5rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    color: 'text.primary',
                    mb: 1,
                    fontFamily: 'inherit',
                    '&::placeholder': {
                      opacity: 0.3
                    }
                  }}
                />
              </Box>

              {/* Main Editor */}
              <Box
                component="textarea"
                value={body}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                placeholder="Start typing..."
                autoFocus
                sx={{
                  width: '100%',
                  minHeight: '60vh',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'text.primary',
                  bgcolor: 'transparent',
                  '&::placeholder': {
                    color: 'text.muted',
                    opacity: 0.5,
                  },
                }}
              />

              {/* Save Status - Subtle Floating or Bottom Style */}
              <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
                <SaveStatus
                  isSaving={autosaveState.isSaving}
                  lastSavedAt={autosaveState.lastSavedAt}
                  error={autosaveState.error}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Undo Toast - Shows after deletion (outside conditional to work in both views) */}
        <UndoToast
          visible={showUndoToast}
          message="Note deleted"
          onUndo={handleUndo}
          autoDismissMs={5000}
          onDismiss={() => setShowUndoToast(false)}
        />
      </Box>
    </Box>
  );
}
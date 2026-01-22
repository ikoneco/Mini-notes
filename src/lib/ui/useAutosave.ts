/* eslint-disable react-hooks/exhaustive-deps */
/**
 * useAutosave hook
 * 
 * Manages autosave logic for notes with debounce and error handling.
 * Follows PRD FR-1: autosave within 1 second of stopping input.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createOrUpdateNote } from '../infra/notesStore';
import { Note } from '../domain/types';

export interface AutosaveState {
    isSaving: boolean;
    lastSavedAt: number | null;
    error: string | null;
}

export interface UseAutosaveOptions {
    debounceMs?: number;
    onSaveComplete?: (noteId: string) => void;
    onError?: (error: Error) => void;
}

/**
 * Hook to autosave note content with debounce
 * 
 * @param initialContent - Initial content for body
 * @param initialTitle - Initial content for title
 * @param initialCreatedAt - Initial creation timestamp
 * @param noteId - ID of note being edited (null for new notes)
 * @param options - Configuration options
 * @returns [title, setTitle, body, setBody, autosaveState]
 */
export function useAutosave(
    initialContent: string,
    initialTitle: string,
    initialCreatedAt: number | null,
    noteId: string | null,
    options: UseAutosaveOptions = {}
): [
        string,
        (title: string) => void,
        string,
        (body: string) => void,
        AutosaveState,
        () => void // cancelSave
    ] {
    const { debounceMs = 1000, onSaveComplete, onError } = options;

    // Editor state
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialContent);

    // Autosave state
    const [autosaveState, setAutosaveState] = useState<AutosaveState>({
        isSaving: false,
        lastSavedAt: null,
        error: null,
    });

    // Refs to track debounce timeout and pending content
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingTitleRef = useRef<string>(title);
    const pendingBodyRef = useRef<string>(body);
    const currentNoteIdRef = useRef<string | null>(noteId);
    const createdAtRef = useRef<number | null>(initialCreatedAt);

    // Sync state with refs manually to ensure they're up to date for the effect
    useEffect(() => {
        pendingTitleRef.current = title;
    }, [title]);

    useEffect(() => {
        pendingBodyRef.current = body;
    }, [body]);

    useEffect(() => {
        currentNoteIdRef.current = noteId;
    }, [noteId]);

    useEffect(() => {
        createdAtRef.current = initialCreatedAt;
    }, [initialCreatedAt]);

    /**
     * Debounced save function
     */
    const saveNote = useCallback(async (idToSave?: string | null) => {
        const titleToSave = pendingTitleRef.current;
        const bodyToSave = pendingBodyRef.current;
        const currentNoteId = currentNoteIdRef.current;
        const targetId = idToSave !== undefined ? idToSave : currentNoteId;
        const createdAt = createdAtRef.current;

        // If saving on switch (idToSave provided) and no targetId exists, skip (prevents zombies)
        if (idToSave !== undefined && !targetId) {
            return;
        }

        // Don't save empty content
        if ((!bodyToSave || bodyToSave.trim().length === 0) && (!titleToSave || titleToSave.trim().length === 0)) {
            return;
        }

        // Mark as saving
        setAutosaveState({
            isSaving: true,
            lastSavedAt: null,
            error: null,
        });

        try {
            const now = Date.now();

            // Create or update note
            const noteToSave: Note = {
                id: targetId || crypto.randomUUID(),
                title: titleToSave || 'Untitled',
                body: bodyToSave || '',
                inputMode: 'typing',
                createdAt: createdAt || now,
                updatedAt: now,
            };

            const savedNote = await createOrUpdateNote(noteToSave);

            // Update createdAtRef if we just created a new note
            if (!createdAt) {
                createdAtRef.current = noteToSave.createdAt;
            }

            // Success - update state
            setAutosaveState({
                isSaving: false,
                lastSavedAt: now,
                error: null,
            });

            // Callback
            onSaveComplete?.(savedNote.id);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save note';
            setAutosaveState({
                isSaving: false,
                lastSavedAt: null,
                error: errorMessage,
            });
            onError?.(error instanceof Error ? error : new Error(errorMessage));
        }
    }, [noteId, onSaveComplete, onError]);

    /**
     * Debounce effect
     */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        // Don't save empty notes
        if ((!title || title.trim().length === 0) && (!body || body.trim().length === 0)) {
            return;
        }

        debounceRef.current = setTimeout(() => {
            saveNote();
        }, debounceMs);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [title, body, debounceMs, saveNote]);

    /**
     * Switch effect
     */
    useEffect(() => {
        const previousNoteId = currentNoteIdRef.current;
        currentNoteIdRef.current = noteId;

        if (previousNoteId && noteId !== previousNoteId) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (pendingBodyRef.current || pendingTitleRef.current) {
                // Pass previous ID to ensure we save the correct note
                setTimeout(() => saveNote(previousNoteId), 0);
            }
        }
    }, [noteId, saveNote]);

    /**
     * Cancel save function
     */
    const cancelSave = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        // Clear pending refs to avoid any delayed triggers from switch effect
        pendingTitleRef.current = '';
        pendingBodyRef.current = '';
    }, []);

    return [title, setTitle, body, setBody, autosaveState, cancelSave];
}
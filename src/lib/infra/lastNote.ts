/**
 * Last note loading helper
 * 
 * Loads the most recent note (by updatedAt) on app open.
 */

import { listNotes } from './notesStore';
import { Note } from '../domain/types';

/**
 * Get the most recent note from storage
 * @returns The most recent note, or null if no notes exist
 */
export async function getLastNote(): Promise<Note | null> {
    const notes = await listNotes();

    // Return null if no notes
    if (!notes || notes.length === 0) {
        return null;
    }

    // Return first note (already ordered by updatedAt descending in listNotes)
    return notes[0] || null;
}
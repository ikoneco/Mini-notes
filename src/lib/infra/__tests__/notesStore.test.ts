/**
 * Integration tests for notesStore (IndexedDB)
 */

import 'fake-indexeddb/auto';
import { Note } from '../../domain/types';
import {
    createOrUpdateNote,
    getNote,
    listNotes,
    deleteNote,
    clearAllNotes,
} from '../notesStore';

describe('notesStore integration tests', () => {
    // Clean up before each test
    beforeEach(async () => {
        await clearAllNotes();
    });

    // Clean up after all tests
    afterAll(async () => {
        await clearAllNotes();
    });

    describe('createOrUpdateNote', () => {
        it('should create a new note', async () => {
            const note: Note = {
                id: '1',
                title: 'Test Note',
                body: 'This is a test note',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'typing',
            };

            const result = await createOrUpdateNote(note);
            expect(result).toEqual(note);
        });

        it('should update an existing note', async () => {
            const originalNote: Note = {
                id: '1',
                title: 'Original Title',
                body: 'Original content',
                createdAt: Date.now() - 1000,
                updatedAt: Date.now() - 1000,
                inputMode: 'typing',
            };

            await createOrUpdateNote(originalNote);

            const updatedNote: Note = {
                ...originalNote,
                title: 'Updated Title',
                body: 'Updated content',
                updatedAt: Date.now(),
            };

            const result = await createOrUpdateNote(updatedNote);
            expect(result.title).toBe('Updated Title');
            expect(result.body).toBe('Updated content');
        });

        it('should persist note across retrieval', async () => {
            const note: Note = {
                id: '1',
                title: 'Persistent Note',
                body: 'This should persist',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'typing',
            };

            await createOrUpdateNote(note);
            const retrieved = await getNote(note.id);

            expect(retrieved).toEqual(note);
        });
    });

    describe('getNote', () => {
        it('should retrieve an existing note by ID', async () => {
            const note: Note = {
                id: '1',
                title: 'Test Note',
                body: 'Content',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'typing',
            };

            await createOrUpdateNote(note);
            const retrieved = await getNote('1');

            expect(retrieved).toEqual(note);
        });

        it('should return null for non-existent note', async () => {
            const retrieved = await getNote('non-existent');
            expect(retrieved).toBeNull();
        });
    });

    describe('listNotes', () => {
        it('should return empty array when no notes exist', async () => {
            const notes = await listNotes();
            expect(notes).toEqual([]);
        });

        it('should return all notes ordered by updatedAt descending', async () => {
            const now = Date.now();
            const note1: Note = {
                id: '1',
                title: 'First Note',
                body: 'Content 1',
                createdAt: now - 3000,
                updatedAt: now - 2000,
                inputMode: 'typing',
            };

            const note2: Note = {
                id: '2',
                title: 'Second Note',
                body: 'Content 2',
                createdAt: now - 2000,
                updatedAt: now - 1000,
                inputMode: 'typing',
            };

            const note3: Note = {
                id: '3',
                title: 'Third Note',
                body: 'Content 3',
                createdAt: now,
                updatedAt: now,
                inputMode: 'voice',
            };

            await createOrUpdateNote(note1);
            await createOrUpdateNote(note2);
            await createOrUpdateNote(note3);

            const notes = await listNotes();
            expect(notes).toHaveLength(3);
            expect(notes[0].id).toBe('3'); // Most recent
            expect(notes[1].id).toBe('2');
            expect(notes[2].id).toBe('1'); // Oldest
        });

        it('should return correct notes after updates', async () => {
            const now = Date.now();
            const note1: Note = {
                id: '1',
                title: 'Note 1',
                body: 'Content',
                createdAt: now - 2000,
                updatedAt: now - 2000,
                inputMode: 'typing',
            };

            const note2: Note = {
                id: '2',
                title: 'Note 2',
                body: 'Content',
                createdAt: now - 1000,
                updatedAt: now - 1000,
                inputMode: 'typing',
            };

            await createOrUpdateNote(note1);
            await createOrUpdateNote(note2);

            // Update note1 to make it most recent
            const updatedNote1: Note = {
                ...note1,
                updatedAt: now,
            };
            await createOrUpdateNote(updatedNote1);

            const notes = await listNotes();
            expect(notes[0].id).toBe('1'); // Now most recent
            expect(notes[1].id).toBe('2');
        });
    });

    describe('deleteNote', () => {
        it('should delete an existing note', async () => {
            const note: Note = {
                id: '1',
                title: 'To Delete',
                body: 'Content',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'typing',
            };

            await createOrUpdateNote(note);
            await deleteNote('1');

            const retrieved = await getNote('1');
            expect(retrieved).toBeNull();
        });

        it('should not throw error when deleting non-existent note', async () => {
            await expect(deleteNote('non-existent')).resolves.not.toThrow();
        });

        it('should remove note from list', async () => {
            const note1: Note = {
                id: '1',
                title: 'Note 1',
                body: 'Content 1',
                createdAt: Date.now() - 1000,
                updatedAt: Date.now() - 1000,
                inputMode: 'typing',
            };

            const note2: Note = {
                id: '2',
                title: 'Note 2',
                body: 'Content 2',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'typing',
            };

            await createOrUpdateNote(note1);
            await createOrUpdateNote(note2);

            let notes = await listNotes();
            expect(notes).toHaveLength(2);

            await deleteNote('1');
            notes = await listNotes();
            expect(notes).toHaveLength(1);
            expect(notes[0].id).toBe('2');
        });
    });

    describe('clearAllNotes', () => {
        it('should remove all notes from storage', async () => {
            const note1: Note = {
                id: '1',
                title: 'Note 1',
                body: 'Content 1',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'typing',
            };

            const note2: Note = {
                id: '2',
                title: 'Note 2',
                body: 'Content 2',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                inputMode: 'voice',
            };

            await createOrUpdateNote(note1);
            await createOrUpdateNote(note2);

            let notes = await listNotes();
            expect(notes).toHaveLength(2);

            await clearAllNotes();

            notes = await listNotes();
            expect(notes).toHaveLength(0);
        });
    });

    describe('persistence across operations', () => {
        it('should maintain data integrity through multiple operations', async () => {
            const now = Date.now();

            // Create notes
            const note1: Note = {
                id: '1',
                title: 'Note 1',
                body: 'Content 1',
                createdAt: now - 2000,
                updatedAt: now - 2000,
                inputMode: 'typing',
            };

            const note2: Note = {
                id: '2',
                title: 'Note 2',
                body: 'Content 2',
                createdAt: now - 1000,
                updatedAt: now - 1000,
                inputMode: 'voice',
            };

            await createOrUpdateNote(note1);
            await createOrUpdateNote(note2);

            // Update note1
            const updatedNote1: Note = {
                ...note1,
                title: 'Updated Note 1',
                updatedAt: now,
            };
            await createOrUpdateNote(updatedNote1);

            // Delete note2
            await deleteNote('2');

            // Verify final state
            const notes = await listNotes();
            expect(notes).toHaveLength(1);
            expect(notes[0].id).toBe('1');
            expect(notes[0].title).toBe('Updated Note 1');

            const retrieved = await getNote('1');
            expect(retrieved?.title).toBe('Updated Note 1');
        });
    });
});
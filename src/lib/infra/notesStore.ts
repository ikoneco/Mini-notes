/**
 * IndexedDB storage adapter for Minimal Notes
 * 
 * This module provides a versioned IndexedDB implementation for note persistence.
 * Schema version: 1
 */

import { Note } from '../domain/types';

const DB_NAME = 'MinimalNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

/**
 * Open IndexedDB database and initialize schema
 */
async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error(`Failed to open IndexedDB: ${request.error}`));
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create notes store with id as keyPath
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

                // Create indexes for common queries
                store.createIndex('updatedAt', 'updatedAt', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
}

/**
 * Create or update a note
 */
export async function createOrUpdateNote(note: Note): Promise<Note> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(note);

        request.onsuccess = () => {
            resolve(note);
        };

        request.onerror = () => {
            reject(new Error(`Failed to save note: ${request.error}`));
        };

        transaction.oncomplete = () => {
            db.close();
        };

        transaction.onerror = () => {
            reject(new Error(`Transaction failed: ${transaction.error}`));
        };
    });
}

/**
 * Get a note by ID
 */
export async function getNote(id: string): Promise<Note | null> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            const result = request.result;
            resolve(result || null);
        };

        request.onerror = () => {
            reject(new Error(`Failed to get note: ${request.error}`));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/**
 * List all notes, ordered by createdAt descending
 */
export async function listNotes(): Promise<Note[]> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('createdAt');
        const request = index.openCursor(null, 'prev'); // prev = descending (newest first)

        const notes: Note[] = [];

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                notes.push(cursor.value);
                cursor.continue();
            }
        };

        request.onerror = () => {
            reject(new Error(`Failed to list notes: ${request.error}`));
        };

        transaction.oncomplete = () => {
            resolve(notes);
            db.close();
        };
    });
}

/**
 * Delete a note by ID
 */
export async function deleteNote(id: string): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(new Error(`Failed to delete note: ${request.error}`));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/**
 * Clear all notes (useful for testing)
 */
export async function clearAllNotes(): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(new Error(`Failed to clear notes: ${request.error}`));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}
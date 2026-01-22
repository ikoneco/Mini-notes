/**
 * Domain types for Minimal Notes
 */

export type InputMode = 'typing' | 'voice';

export interface Note {
    id: string;
    title: string;
    body: string;
    createdAt: number; // Unix timestamp in ms
    updatedAt: number; // Unix timestamp in ms
    inputMode: InputMode;
}
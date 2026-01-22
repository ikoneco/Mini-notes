import { deriveTitle, deriveSnippet } from '../helpers';

describe('deriveTitle', () => {
    it('should return empty string for empty body', () => {
        expect(deriveTitle('')).toBe('');
        expect(deriveTitle('   ')).toBe('');
    });

    it('should return first line as title', () => {
        expect(deriveTitle('First line\nSecond line')).toBe('First line');
        expect(deriveTitle('Single line only')).toBe('Single line only');
    });

    it('should trim whitespace from title', () => {
        expect(deriveTitle('  Trimmed title  ')).toBe('Trimmed title');
    });
});

describe('deriveSnippet', () => {
    it('should return empty string for empty body', () => {
        expect(deriveSnippet('')).toBe('');
        expect(deriveSnippet('   ')).toBe('');
    });

    it('should return cleaned body if within limit', () => {
        const shortText = 'This is a short note';
        expect(deriveSnippet(shortText)).toBe(shortText);
    });

    it('should truncate and add ellipsis if over limit', () => {
        const longText = 'a'.repeat(150);
        expect(deriveSnippet(longText).length).toBe(103); // 100 + '...'
        expect(deriveSnippet(longText)).toContain('...');
    });

    it('should remove newlines from snippet', () => {
        const multiLine = 'Line one\nLine two\nLine three';
        expect(deriveSnippet(multiLine)).toBe('Line one Line two Line three');
    });
});
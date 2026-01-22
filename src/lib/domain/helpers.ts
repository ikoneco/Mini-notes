/**
 * Domain helpers for Minimal Notes
 */

const MAX_SNIPPET_LENGTH = 100;

/**
 * Derive title from note body
 * @param body - Note body text
 * @returns Title derived from first line, or empty string if no content
 */
export function deriveTitle(body: string): string {
    if (!body || body.trim().length === 0) {
        return '';
    }

    // Get first line
    const firstLine = body.split('\n')[0].trim();
    return firstLine;
}

/**
 * Derive snippet from note body for list display
 * @param body - Note body text
 * @returns First N characters for list display, with ellipsis if truncated
 */
export function deriveSnippet(body: string): string {
    if (!body || body.trim().length === 0) {
        return '';
    }

    // Remove newlines and trim
    const cleaned = body.replace(/\n/g, ' ').trim();

    if (cleaned.length <= MAX_SNIPPET_LENGTH) {
        return cleaned;
    }

    return cleaned.slice(0, MAX_SNIPPET_LENGTH).trim() + '...';
}
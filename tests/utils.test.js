import { escapeHTML } from '../js/utils.js';

describe('escapeHTML', () => {
    it('escapes special characters', () => {
        expect(escapeHTML('&')).toBe('&amp;');
        expect(escapeHTML('<')).toBe('&lt;');
        expect(escapeHTML('>')).toBe('&gt;');
        expect(escapeHTML('"')).toBe('&quot;');
        expect(escapeHTML("'")).toBe('&#039;');
    });

    it('escapes combinations of special characters', () => {
        expect(escapeHTML('<script>alert("XSS & \'hack\'")</script>'))
            .toBe('&lt;script&gt;alert(&quot;XSS &amp; &#039;hack&#039;&quot;)&lt;/script&gt;');
    });

    it('returns empty string for null or undefined', () => {
        expect(escapeHTML(null)).toBe('');
        expect(escapeHTML(undefined)).toBe('');
    });

    it('converts non-string inputs to strings and escapes them', () => {
        expect(escapeHTML(123)).toBe('123');
        expect(escapeHTML(true)).toBe('true');
        expect(escapeHTML({})).toBe('[object Object]');
    });

    it('returns the same string if there are no special characters', () => {
        expect(escapeHTML('hello world')).toBe('hello world');
    });
});

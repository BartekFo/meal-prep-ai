import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// Configure marked with security-focused options
marked.setOptions({
	gfm: true,
	breaks: true,
	headerIds: false, // Prevent ID injection
	mangle: false // Don't mangle email addresses
});

/**
 * Sanitizes and renders markdown to HTML safely
 * @param markdown - The markdown text to render
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeMarkdown(markdown: string): string {
	// First convert markdown to HTML
	const html = marked(markdown, { gfm: true, breaks: true }) as string;

	// Then sanitize the HTML to prevent XSS
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			'p',
			'br',
			'strong',
			'em',
			'u',
			'code',
			'pre',
			'a',
			'ul',
			'ol',
			'li',
			'blockquote',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'hr',
			'table',
			'thead',
			'tbody',
			'tr',
			'th',
			'td'
		],
		ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
		ALLOW_DATA_ATTR: false,
		FORCE_BODY: true
	});
}

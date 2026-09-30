/**
 * dangerouslySetInnerHTML
 * =======================
 *
 * `dangerouslySetInnerHTML` allows React to set an element's `innerHTML` directly
 * instead of rendering its content as escaped text. It is useful for trusted HTML
 * content, but untrusted input must be sanitized before it is rendered.
 */

import { useState } from "react";

// -----------------------------------------------------------------------
// 1. Rendering HTML as text
// -----------------------------------------------------------------------

// JSX escapes strings before rendering them, so HTML-looking content is displayed
// as text rather than interpreted as markup.
function EscapedContent() {
  const content = "<strong>Hello, John Doe!</strong>";

  return <p>{content}</p>;
}

// The browser displays the literal `<strong>` tags instead of creating a `<strong>` element.

// -----------------------------------------------------------------------
// 2. Rendering HTML with `dangerouslySetInnerHTML`
// -----------------------------------------------------------------------

// `dangerouslySetInnerHTML` accepts an object with an `__html` property containing
// the HTML string that React should assign to the element's `innerHTML`.
function HtmlContent() {
  const content = "<strong>Hello, John Doe!</strong>";

  return <p dangerouslySetInnerHTML={{ __html: content }} />;
}

// The browser interprets the string as HTML, so the text appears bold.

// -----------------------------------------------------------------------
// 3. Rendering multiple HTML elements
// -----------------------------------------------------------------------

// The HTML string can contain multiple elements and nested markup.
function ArticleContent() {
  const html = `
        <h2>Article title</h2>
        <p>This is a paragraph with <strong>important</strong> content.</p>
        <ul>
            <li>First item</li>
            <li>Second item</li>
        </ul>
    `;

  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}

// React passes the HTML string to the DOM as HTML instead of creating the elements from JSX.

// -----------------------------------------------------------------------
// 4. Dynamic HTML content
// -----------------------------------------------------------------------

// HTML can be generated from application data when the resulting content is trusted
// or has already been sanitized.
function UserProfile() {
  const name = "John Doe";
  const description = `<strong>${name}</strong> is an administrator.`;

  return <div dangerouslySetInnerHTML={{ __html: description }} />;
}

// Dynamic interpolation does not automatically make the resulting HTML safe.
// The complete HTML string must be considered untrusted if any interpolated value is untrusted.

// -----------------------------------------------------------------------
// 5. User-controlled HTML is unsafe
// -----------------------------------------------------------------------

// Never insert raw user-controlled content directly into `dangerouslySetInnerHTML`.
function UnsafeComment({ comment }: { comment: string }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}

// If `comment` contains attacker-controlled HTML, the browser may interpret it as markup.
// Depending on the content and browser context, this can create a cross-site scripting (XSS) risk.

// -----------------------------------------------------------------------
// 6. Sanitizing HTML before rendering
// -----------------------------------------------------------------------

// A sanitizer should be used when an application intentionally accepts HTML from
// an untrusted source, such as user-generated rich text.
function SafeComment({ html }: { html: string }) {
  const sanitizedHtml = sanitizeHtml(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

// The sanitizer is responsible for removing or neutralizing unsafe HTML before React
// receives the string. React itself does not sanitize the value supplied to `__html`.
function sanitizeHtml(html: string): string {
  // Placeholder for a real HTML sanitization library.
  return html;
}

// A production application should use a well-maintained HTML sanitizer rather than
// implementing security filtering manually.

// -----------------------------------------------------------------------
// 7. Updating the HTML content
// -----------------------------------------------------------------------

// Changing the `__html` value causes React to update the element's HTML.
function Preview() {
  const [html, setHtml] = useState("<p>Initial content</p>");

  return (
    <>
      <button onClick={() => setHtml("<p><strong>Updated content</strong></p>")}>Update</button>

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

// The HTML is controlled by React state, but the value still bypasses React's normal
// JSX escaping and therefore must only contain trusted or sanitized HTML.

// -----------------------------------------------------------------------
// 8. The `__html` property
// -----------------------------------------------------------------------

// The API requires an object whose `__html` property contains the HTML string.
function Message() {
  const html = "<strong>System ready</strong>";

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// The property name is intentionally explicit: it makes the developer acknowledge
// that raw HTML is being inserted into the DOM.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - JSX normally escapes strings so HTML-looking content is rendered as text.
// - `dangerouslySetInnerHTML={{ __html: html }}` tells React to insert the string as HTML.
// - The API is intended for trusted HTML or content that has already been sanitized.
// - React does not sanitize the value supplied to `__html`.
// - Directly rendering untrusted HTML can introduce cross-site scripting (XSS) vulnerabilities.
// - HTML from untrusted sources should be passed through a dedicated sanitizer before rendering.

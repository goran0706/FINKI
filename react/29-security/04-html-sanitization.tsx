/**
 * HTML Sanitization
 * ==================
 *
 * HTML sanitization removes or neutralizes HTML that is not permitted by an application's
 * content policy before that HTML reaches an HTML-parsing sink. It is different from ordinary
 * JSX escaping: escaping is appropriate when content should remain text, while sanitization
 * is appropriate when an application intentionally needs to preserve a controlled subset of HTML.
 *
 * In React, sanitization is particularly important when sanitized content is later rendered
 * with `dangerouslySetInnerHTML`. A sanitizer should be treated as a security boundary, kept
 * up to date, and applied before the HTML reaches the rendering sink.
 */

import DOMPurify from "dompurify";
import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Text versus HTML
// ---------------------------------------------------------------------

const TextRenderingExample: FC = (): ReactElement => {
  const content = "<strong>Hello, John Doe</strong>";

  return <p>{content}</p>;
};

// Normal JSX treats the value as text.
//
// The browser does not interpret `<strong>` as an element in this context.
//
// When an application does not need HTML formatting, this is preferable to
// sanitizing and rendering an HTML string.

// ---------------------------------------------------------------------
// 2. When sanitization is needed
// ---------------------------------------------------------------------

const UntrustedRichText: FC = (): ReactElement => {
  const html = "<p>Hello, <strong>John Doe</strong></p>";

  const sanitizedHtml = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// Sanitization is appropriate when the application intentionally wants to
// preserve some HTML formatting while removing content that violates the
// application's security policy.
//
// OWASP recommends using a dedicated HTML sanitizer such as DOMPurify for
// this use case. :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 3. Sanitization is not HTML escaping
// ---------------------------------------------------------------------

const EscapingAndSanitization: FC = (): ReactElement => {
  const html = "<p>Hello, <strong>John Doe</strong></p>";

  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <section>
      <p>{html}</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </section>
  );
};

// The first value is rendered as text.
//
// The second value is interpreted as HTML after sanitization.
//
// These approaches solve different requirements:
//
// - Escaping keeps the input as text.
// - Sanitization permits a controlled subset of HTML to remain HTML.

// ---------------------------------------------------------------------
// 4. Why sanitization is necessary
// ---------------------------------------------------------------------

// A rich-text application may intentionally accept HTML such as:
//
// <p>Introduction</p>
// <strong>Important</strong>
// <em>Additional information</em>
//
// Simply escaping that content would display the markup itself rather than
// preserving the intended formatting.
//
// Sanitization allows the application to preserve permitted HTML while
// removing or neutralizing content that violates its policy.

// ---------------------------------------------------------------------
// 5. Sanitizing before the HTML sink
// ---------------------------------------------------------------------

interface RichTextProps {
  readonly html: string;
}

const SanitizedRichText: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// The important sequence is:
//
// untrusted HTML
//       ↓
// sanitizer
//       ↓
// sanitized HTML
//       ↓
// dangerouslySetInnerHTML
//
// The sanitizer should run before the value reaches the HTML-parsing sink.

// ---------------------------------------------------------------------
// 6. Do not sanitize after rendering
// ---------------------------------------------------------------------

// This sequence is incorrect:
//
// const html = untrustedHtml;
//
// return <div dangerouslySetInnerHTML={{__html: html}} />;
//
// const sanitizedHtml = DOMPurify.sanitize(html);
//
// Once unsafe HTML has already reached the browser sink, sanitizing another
// copy does not undo the earlier unsafe operation.
//
// Sanitization must happen before the dangerous operation.

// ---------------------------------------------------------------------
// 7. Do not modify sanitized HTML afterward
// ---------------------------------------------------------------------

const SanitizeThenModifyExample: FC = (): ReactElement => {
  const untrustedHtml = "<p>Hello, John Doe</p>";
  const sanitizedHtml = DOMPurify.sanitize(untrustedHtml);

  // Do not concatenate arbitrary content into `sanitizedHtml` after this
  // point and assume that the resulting string remains sanitized.
  const finalHtml = sanitizedHtml;

  return <div dangerouslySetInnerHTML={{ __html: finalHtml }} />;
};

// Sanitization establishes a security property for a particular value.
// If application code modifies that value afterward, the resulting HTML
// must be treated as requiring another security review or sanitization pass.

// ---------------------------------------------------------------------
// 8. Sanitization is policy-driven
// ---------------------------------------------------------------------

// Sanitization is not simply:
//
// "remove anything that looks suspicious"
//
// The application should define which HTML it actually intends to support.
//
// A rich-text editor might allow:
//
// - paragraphs,
// - headings,
// - emphasis,
// - strong text,
// - lists,
// - links.
//
// The allowed set should be determined by the application's content
// requirements and security policy.

// ---------------------------------------------------------------------
// 9. Allowing a restricted HTML subset
// ---------------------------------------------------------------------

const RestrictedRichText: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// Restricting the allowed elements can reduce the application's HTML surface
// when the product only needs a small subset of HTML.
//
// The configuration should be based on actual application requirements rather
// than copying a broad allowlist into every component.

// ---------------------------------------------------------------------
// 10. Allowing specific attributes
// ---------------------------------------------------------------------

const RichTextWithLinks: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "strong", "em", "a"],
    ALLOWED_ATTR: ["href"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// Attributes can be security-sensitive too.
//
// An application should not assume that restricting element names alone
// completely defines the security policy.

// ---------------------------------------------------------------------
// 11. URL-bearing HTML attributes
// ---------------------------------------------------------------------

const LinkRichText: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "a"],
    ALLOWED_ATTR: ["href"],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// An `href` value inside sanitized HTML is still a URL-bearing value.
//
// The sanitizer must therefore apply appropriate URL handling rather than
// merely preserving every string assigned to `href`.
//
// HTML sanitization and URL validation are related security controls, but
// they address different parsing contexts.

// ---------------------------------------------------------------------
// 12. Sanitizing arbitrary HTML is not the same as validating a URL
// ---------------------------------------------------------------------

const UrlIsNotHtml: FC = (): ReactElement => {
  const url = "https://example.com/profile";

  return <a href={url}>Open profile</a>;
};

// If the application receives an untrusted URL, it should validate the URL
// according to the application's navigation policy.
//
// An HTML sanitizer should not be treated as a generic replacement for
// context-specific URL validation.

// ---------------------------------------------------------------------
// 13. Server-side sanitization
// ---------------------------------------------------------------------

// Sanitization can be performed on the server, client, or both depending
// on the application's architecture.
//
// The important property is that unsafe HTML does not reach an HTML sink.
//
// A server-side pipeline might conceptually perform:
//
// external input
//      ↓
// server validation
//      ↓
// HTML sanitization
//      ↓
// persisted or rendered content
//
// Client-side sanitization can still be appropriate when untrusted HTML
// reaches a browser-side HTML sink.

// ---------------------------------------------------------------------
// 14. Do not trust stored HTML automatically
// ---------------------------------------------------------------------

interface Article {
  readonly title: string;
  readonly bodyHtml: string;
}

const StoredArticle: FC<{ readonly article: Article }> = ({ article }): ReactElement => {
  const sanitizedBody = DOMPurify.sanitize(article.bodyHtml);

  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </article>
  );
};

// Data coming from a database is not automatically trustworthy.
//
// A database may contain content originally supplied by users, imported from
// another system, or written before the current security policy existed.
//
// Trust should therefore be based on the actual data flow and security
// boundary rather than merely on the fact that the value is stored locally.

// ---------------------------------------------------------------------
// 15. Sanitizing on input versus output
// ---------------------------------------------------------------------

// Sanitizing content once when it is submitted can be useful, but output-time
// sanitization may still be appropriate when content can be modified,
// imported, migrated, or processed by other systems.
//
// A security architecture should define where the trusted representation
// is established and ensure that later transformations do not invalidate it.
//
// Do not assume that a value is safe merely because it was sanitized at some
// earlier point in the application's lifecycle.

// ---------------------------------------------------------------------
// 16. Keep the sanitizer close to the trust boundary
// ---------------------------------------------------------------------

const sanitizeRichText = (html: string): string => {
  return DOMPurify.sanitize(html);
};

// Centralizing sanitization can make the security boundary easier to audit.
//
// The helper should remain narrow and should not be treated as a universal
// sanitizer for every possible browser context.

// ---------------------------------------------------------------------
// 17. A named sanitized value
// ---------------------------------------------------------------------

const SanitizedContentExample: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = sanitizeRichText(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// A name such as `sanitizedHtml` communicates the intended trust state.
//
// The name itself does not make the value safe. The call to the actual
// sanitizer is what establishes the security transformation.

// ---------------------------------------------------------------------
// 18. TypeScript cannot prove sanitization
// ---------------------------------------------------------------------

type SanitizedHtml = string;

const sanitizeHtml = (html: string): SanitizedHtml => {
  return DOMPurify.sanitize(html);
};

const TypedSanitizedHtml: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = sanitizeHtml(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// TypeScript can document the application's intended trust boundary:
//
// string → SanitizedHtml
//
// But both values are still strings at runtime.
//
// The type system does not inspect the HTML or independently verify that
// sanitization occurred.

// ---------------------------------------------------------------------
// 19. Do not use regular expressions as an HTML sanitizer
// ---------------------------------------------------------------------

// This is not a sanitizer:
//
// const sanitize = (html: string): string => {
//     return html.replace(/<script.*?>.*?<\/script>/gi, "");
// };
//
// HTML is parsed according to browser parsing rules, and dangerous behavior
// is not limited to one element name.
//
// A security-sensitive HTML transformation should use a dedicated HTML
// sanitizer rather than ad-hoc string replacement.

// ---------------------------------------------------------------------
// 20. Sanitization libraries must be maintained
// ---------------------------------------------------------------------

// A sanitizer is security-sensitive software.
//
// Its implementation and configuration should be maintained as dependencies,
// and security updates should be applied promptly.
//
// Browsers evolve and sanitizer bypasses can be discovered over time.
// OWASP specifically recommends keeping DOMPurify or another chosen
// sanitization library patched. :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 21. Do not mutate sanitized output
// ---------------------------------------------------------------------

const UnsafePostSanitizationModification = (html: string): string => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  // Treat the sanitized value as the final HTML representation.
  //
  // Do not append arbitrary markup afterward and assume the security
  // properties of the original sanitized value still apply.
  return sanitizedHtml;
};

// If another transformation needs to modify the HTML, the resulting output
// should be evaluated as part of the sanitization pipeline and sanitized again
// when necessary.

// ---------------------------------------------------------------------
// 22. Markdown conversion is also a trust boundary
// ---------------------------------------------------------------------

interface MarkdownProps {
  readonly markdown: string;
}

// A Markdown parser that produces HTML creates another HTML-generation
// boundary.
//
// The resulting HTML should be evaluated according to the parser's behavior
// and the application's trust model before it reaches an HTML sink.
const MarkdownContent: FC<MarkdownProps> = ({ markdown }): ReactElement => {
  const generatedHtml = markdown;
  const sanitizedHtml = DOMPurify.sanitize(generatedHtml);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// This example deliberately does not pretend that a Markdown string is
// already safe HTML.
//
// If a Markdown library generates HTML, that generated HTML should be treated
// according to the library's security guarantees and the application's
// rendering requirements.

// ---------------------------------------------------------------------
// 23. Sanitization and React
// ---------------------------------------------------------------------

const ReactSanitizedHtml: FC<RichTextProps> = ({ html }): ReactElement => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// React documents `dangerouslySetInnerHTML` as a dangerous API and recommends
// extreme caution with values that are not completely trusted. :contentReference[oaicite:2]{index=2}
//
// Sanitization provides the necessary security boundary when the application
// intentionally needs to render HTML from an untrusted source.

// ---------------------------------------------------------------------
// 24. Trusted Types
// ---------------------------------------------------------------------

// Modern applications may additionally use Trusted Types as a browser-level
// control for DOM XSS sinks.
//
// Conceptually:
//
// Content-Security-Policy:
//     require-trusted-types-for 'script'
//
// A Trusted Types policy can require HTML-producing operations to receive
// approved TrustedHTML values rather than arbitrary strings.
//
// Trusted Types complement sanitization; they do not replace the need for a
// correctly designed sanitizer and security policy.

// ---------------------------------------------------------------------
// 25. Defense in depth
// ---------------------------------------------------------------------

// HTML sanitization should be part of a layered security model.
//
// Other controls can include:
//
// - React's normal output escaping,
// - context-appropriate URL validation,
// - server-side validation,
// - Content Security Policy,
// - Trusted Types where appropriate,
// - secure dependency management.
//
// OWASP describes sanitization and output encoding as complementary defenses
// and recommends additional controls such as CSP as defense in depth. :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 26. Sanitization does not fix every injection context
// ---------------------------------------------------------------------

// HTML sanitization is designed for HTML content.
//
// It is not a universal solution for:
//
// - JavaScript strings,
// - CSS,
// - SQL,
// - shell commands,
// - URL construction,
// - HTTP headers,
// - other interpreter-specific contexts.
//
// Each context requires its own appropriate validation, encoding, or safe API.

// ---------------------------------------------------------------------
// 27. Prefer safe sinks when HTML is unnecessary
// ---------------------------------------------------------------------

const SafeTextSinkExample: FC = (): ReactElement => {
  const content = "<strong>Not markup</strong>";

  return <p>{content}</p>;
};

// When the desired result is text, the safest strategy is usually to use a
// text-rendering API rather than sanitizing HTML and then interpreting it.
//
// OWASP recommends safe sinks such as `textContent` when HTML parsing is not
// actually required. :contentReference[oaicite:4]{index=4}

// ---------------------------------------------------------------------
// 28. Integrated rich-text pipeline
// ---------------------------------------------------------------------

interface RichArticleProps {
  readonly title: string;
  readonly bodyHtml: string;
}

const RichArticle: FC<RichArticleProps> = ({ title, bodyHtml }): ReactElement => {
  const sanitizedBody = sanitizeRichText(bodyHtml);

  return (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </article>
  );
};

const HtmlSanitizationDemo: FC = (): ReactElement => {
  const article = {
    title: "Application Security",
    bodyHtml: "<p>HTML should be sanitized before it reaches an HTML sink.</p>",
  };

  return (
    <section>
      <RichArticle title={article.title} bodyHtml={article.bodyHtml} />
    </section>
  );
};

// The complete flow is:
//
// untrusted HTML
//      ↓
// sanitizeRichText()
//      ↓
// sanitized HTML
//      ↓
// dangerouslySetInnerHTML
//
// The component does not treat the original HTML as trusted merely because
// it came from an application data object.

// ---------------------------------------------------------------------
// 29. Security review checklist
// ---------------------------------------------------------------------

// Before rendering sanitized HTML, verify:
//
// 1. Is HTML actually required?
// 2. Could the source contain attacker-controlled content?
// 3. Is the content passed through a dedicated HTML sanitizer?
// 4. Is the sanitizer maintained and regularly updated?
// 5. Is the sanitizer configured for the application's actual HTML policy?
// 6. Are URL-bearing attributes handled according to the sanitizer's policy?
// 7. Is the sanitized result modified afterward?
// 8. Does another library transform the sanitized result?
// 9. Is `dangerouslySetInnerHTML` kept at a narrow, auditable boundary?
// 10. Are additional controls such as CSP or Trusted Types appropriate?

// ---------------------------------------------------------------------
// 30. Practical guidance
// ---------------------------------------------------------------------

// Prefer ordinary JSX when content should remain text:
//
// <p>{untrustedText}</p>
//
// Use HTML sanitization when the product genuinely requires controlled rich
// HTML:
//
// const sanitizedHtml = DOMPurify.sanitize(untrustedHtml);
//
// return <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} />;
//
// Keep the sanitization step immediately before the HTML trust boundary when
// possible, and do not modify the sanitized result afterward.
//
// Most importantly, do not treat "sanitized" as a permanent property of a
// string. Any transformation after sanitization can change the security
// properties of the resulting HTML.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HTML sanitization removes or neutralizes HTML that violates an application's content policy.
// - Sanitization is appropriate when the application genuinely needs to preserve controlled HTML.
// - Normal JSX escaping is preferable when content should remain text.
// - `dangerouslySetInnerHTML` should receive only appropriately trusted or sanitized HTML.
// - DOMPurify is a commonly used HTML sanitizer and is recommended by OWASP for this purpose.
// - Sanitization should happen before the HTML reaches the rendering sink.
// - Modifying sanitized HTML afterward can invalidate the security assumptions established by sanitization.
// - Regular expressions are not an appropriate replacement for a dedicated HTML sanitizer.
// - Sanitizer dependencies must be kept current because security bypasses can be discovered over time.
// - Sanitization policies should explicitly define the HTML elements and attributes the application needs.
// - URL-bearing HTML attributes require appropriate URL security handling as part of the HTML policy.
// - Stored HTML is not automatically trustworthy merely because it came from a database.
// - TypeScript types and names such as `SanitizedHtml` document intent but do not prove that sanitization occurred.
// - HTML sanitization is specific to HTML and does not replace security controls for JavaScript, CSS, URLs, SQL, or other contexts.
// - Trusted Types and Content Security Policy can provide additional defense in depth.
// - If HTML is unnecessary, use normal JSX or another safe text sink instead.
// - The core security boundary is: untrusted HTML → sanitizer → controlled HTML sink.

export default HtmlSanitizationDemo;

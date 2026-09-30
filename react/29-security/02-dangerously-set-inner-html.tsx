/**
 * dangerouslySetInnerHTML
 * ========================
 *
 * `dangerouslySetInnerHTML` is React's API for inserting an HTML string directly into the DOM.
 * Unlike normal JSX interpolation, React does not escape the supplied HTML, so the value must
 * come from a controlled trust boundary or be sanitized for the intended HTML context first.
 *
 * The API is useful when an application genuinely needs to render HTML, but it should not be
 * used simply because a value happens to contain markup-like text.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Normal JSX escapes text
// ---------------------------------------------------------------------

const EscapedHtmlExample: FC = (): ReactElement => {
  const content = "<strong>Hello, John Doe</strong>";

  return (
    <section>
      <h2>Escaped content</h2>
      <p>{content}</p>
    </section>
  );
};

// The string is rendered as text:
//
// <strong>Hello, John Doe</strong>
//
// React does not interpret the string as an HTML element when it is rendered
// through a normal JSX expression.

// ---------------------------------------------------------------------
// 2. Basic `dangerouslySetInnerHTML` syntax
// ---------------------------------------------------------------------

const BasicHtmlExample: FC = (): ReactElement => {
  const html = "<strong>Hello, John Doe</strong>";

  return (
    <section>
      <h2>HTML content</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
};

// `dangerouslySetInnerHTML` receives an object with an `__html` property.
//
// The object syntax is intentional:
//
// dangerouslySetInnerHTML={{__html: html}}
//
// The outer `{}` enters the JSX expression.
// The inner `{__html: html}` creates the object passed to the prop.

// ---------------------------------------------------------------------
// 3. Why the API is dangerous
// ---------------------------------------------------------------------

// React normally escapes interpolated values:
//
// <div>{content}</div>
//
// `dangerouslySetInnerHTML` deliberately bypasses that behavior:
//
// <div dangerouslySetInnerHTML={{__html: content}} />
//
// The browser receives HTML rather than escaped text.
//
// Therefore, the security of this operation depends on the value assigned
// to `__html` and on the trust boundary established by the application.

// ---------------------------------------------------------------------
// 4. Static HTML
// ---------------------------------------------------------------------

const StaticHtmlExample: FC = (): ReactElement => {
  return (
    <article
      dangerouslySetInnerHTML={{
        __html: "<p>This HTML is part of the application source.</p>",
      }}
    />
  );
};

// Static HTML controlled entirely by the application does not have the same
// untrusted-input problem as arbitrary user-generated HTML.
//
// Even so, `dangerouslySetInnerHTML` should remain limited to cases where
// actual HTML rendering is required.

// ---------------------------------------------------------------------
// 5. User-controlled HTML
// ---------------------------------------------------------------------

interface UserHtmlProps {
  readonly html: string;
}

const UserHtmlExample: FC<UserHtmlProps> = ({ html }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// This component creates a security-sensitive trust boundary.
//
// If `html` can contain attacker-controlled content, directly passing it
// to `dangerouslySetInnerHTML` can create an XSS vulnerability.
//
// The TypeScript type `string` does not indicate whether the string is safe.

// ---------------------------------------------------------------------
// 6. Rendering untrusted content as text
// ---------------------------------------------------------------------

const TextInsteadOfHtmlExample: FC<UserHtmlProps> = ({ html }): ReactElement => {
  return <div>{html}</div>;
};

// When formatting is not required, ordinary JSX is the safer approach.
//
// The value remains data and React escapes it for the HTML text context.

// ---------------------------------------------------------------------
// 7. Sanitizing HTML before rendering
// ---------------------------------------------------------------------

// If an application genuinely needs to render HTML supplied by an external
// or user-controlled source, the HTML should pass through a dedicated
// sanitizer before reaching the HTML sink.
//
// Conceptually:
//
// const sanitizedHtml = sanitize(untrustedHtml);
//
// return <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} />;
//
// The sanitizer must understand HTML parsing and the security requirements
// of the application's output context.
//
// Do not attempt to create an HTML sanitizer using regular expressions.

// ---------------------------------------------------------------------
// 8. Establishing a sanitization boundary
// ---------------------------------------------------------------------

interface SanitizedHtmlProps {
  readonly sanitizedHtml: string;
}

const SanitizedHtml: FC<SanitizedHtmlProps> = ({ sanitizedHtml }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// The prop name documents an architectural expectation:
//
// `sanitizedHtml` is expected to have already passed through the application's
// approved sanitization process.
//
// TypeScript cannot enforce that this happened. The application architecture
// must ensure that only appropriately processed HTML reaches this component.

// ---------------------------------------------------------------------
// 9. Keep sanitization close to the trust boundary
// ---------------------------------------------------------------------

interface ExternalArticle {
  readonly title: string;
  readonly html: string;
}

// A security-sensitive application should make the trust transition explicit.
//
// Conceptually:
//
// const article: ExternalArticle = await fetchArticle();
// const sanitizedHtml = sanitize(article.html);
//
// return (
//     <article>
//         <h1>{article.title}</h1>
//         <SanitizedHtml sanitizedHtml={sanitizedHtml} />
//     </article>
// );
//
// The important boundary is:
//
// untrusted HTML
//       ↓
// sanitization
//       ↓
// sanitized HTML
//       ↓
// dangerouslySetInnerHTML

// ---------------------------------------------------------------------
// 10. HTML is not the same as text
// ---------------------------------------------------------------------

const TextContentExample: FC = (): ReactElement => {
  const content = "<em>Important information</em>";

  return (
    <div>
      <p>{content}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

// The first element displays the characters as text.
//
// The second element interprets the string as HTML and therefore displays
// the text using the `<em>` element's formatting.
//
// The difference is the parsing context, not the TypeScript type.

// ---------------------------------------------------------------------
// 11. HTML attributes are parsed too
// ---------------------------------------------------------------------

const AttributeExample: FC = (): ReactElement => {
  const html = '<p class="notice">Important information</p>';

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// The HTML string can contain elements, attributes, and other markup.
//
// Sanitization therefore needs to consider the complete HTML syntax rather
// than checking only for a few obvious strings such as `<script>`.

// ---------------------------------------------------------------------
// 12. Removing `<script>` is not sufficient
// ---------------------------------------------------------------------

// A sanitizer cannot safely be implemented as:
//
// const unsafeHtml = html.replace(/<script.*?>.*?<\/script>/gi, "");
//
// This approach does not correctly model HTML parsing or the many ways
// browser-interpreted markup can become dangerous.
//
// Security filtering must account for HTML elements, attributes, URLs,
// parsing behavior, and the sanitizer's security model.

// ---------------------------------------------------------------------
// 13. HTML sanitization is context-sensitive
// ---------------------------------------------------------------------

// Sanitization requirements depend on what HTML is permitted by the
// application.
//
// For example, a rich-text editor may intentionally allow:
//
// - paragraphs,
// - headings,
// - emphasis,
// - lists,
// - links.
//
// It may intentionally reject:
//
// - scripts,
// - event-handler attributes,
// - dangerous URL schemes,
// - embedded active content.
//
// The allowed HTML should therefore be defined by an explicit policy rather
// than by accepting arbitrary markup.

// ---------------------------------------------------------------------
// 14. URL attributes inside HTML
// ---------------------------------------------------------------------

// HTML can contain URLs:
//
// const html = '<a href="...">Open link</a>';
//
// Sanitization must consider the URL scheme and destination as well as the
// HTML element itself.
//
// This is one reason a sanitizer must understand HTML structure instead of
// performing simple string replacement.

// ---------------------------------------------------------------------
// 15. Event-handler attributes
// ---------------------------------------------------------------------

// HTML can also contain event-handler attributes:
//
// const html = '<button onclick="...">...</button>';
//
// User-controlled HTML must not be allowed to introduce executable event
// handlers.
//
// A proper HTML sanitization policy should remove or reject unsafe active
// content rather than attempting to detect a few known attribute names.

// ---------------------------------------------------------------------
// 16. Do not concatenate untrusted values into HTML
// ---------------------------------------------------------------------

const UnsafeTemplateExample: FC = (): ReactElement => {
  const name = "John Doe";
  const html = `<p>Hello, ${name}</p>`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// Even when the template appears simple, the security properties depend on
// every value inserted into the resulting HTML string.
//
// If `name` becomes attacker-controlled, it becomes part of the HTML source.
//
// Prefer normal JSX when HTML generation is unnecessary:
//
// <p>Hello, {name}</p>

// ---------------------------------------------------------------------
// 17. Safe JSX alternative
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

const SafeGreeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <p>Hello, {name}</p>;
};

// JSX keeps `name` as data in the text context.
//
// This is preferable to generating an HTML string merely to insert a
// variable into a paragraph.

// ---------------------------------------------------------------------
// 18. Rendering trusted rich text
// ---------------------------------------------------------------------

interface RichTextArticleProps {
  readonly title: string;
  readonly sanitizedBody: string;
}

const RichTextArticle: FC<RichTextArticleProps> = ({ title, sanitizedBody }): ReactElement => {
  return (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </article>
  );
};

// A legitimate use case is rendering sanitized rich text produced by an
// editor or another controlled content-processing pipeline.
//
// The important property is not that the content "looks trusted"; it is that
// the application has an explicit process that establishes the HTML trust
// boundary before rendering.

// ---------------------------------------------------------------------
// 19. Server-rendered applications
// ---------------------------------------------------------------------

// Server rendering does not make unsafe HTML safe.
//
// If a server sends attacker-controlled HTML to the browser and the client
// renders that HTML with `dangerouslySetInnerHTML`, the same security
// considerations apply.
//
// Sanitization and validation must therefore remain part of the application's
// data-processing pipeline regardless of where rendering occurs.

// ---------------------------------------------------------------------
// 20. TypeScript cannot create a security guarantee
// ---------------------------------------------------------------------

type SanitizedHtml = string;

const createSanitizedHtml = (html: string): SanitizedHtml => {
  // A real implementation would call an approved HTML sanitizer here.
  //
  // This example does not pretend that a type assertion or alias performs
  // sanitization.
  return html;
};

const TypedHtmlExample: FC = (): ReactElement => {
  const html = createSanitizedHtml("<p>Safe rich text</p>");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// A type alias such as `SanitizedHtml` is useful for documenting intent,
// but TypeScript cannot inspect the runtime contents of a string.
//
// The function responsible for creating the value must actually establish
// the security property.

// ---------------------------------------------------------------------
// 21. Keep the sink narrow
// ---------------------------------------------------------------------

// A useful architectural pattern is to keep `dangerouslySetInnerHTML` in a
// small number of components.
//
// Most of the application can then use ordinary JSX while a small, explicit
// boundary handles sanitized rich text.
//
// This reduces the number of places that must be reviewed for HTML injection.

// ---------------------------------------------------------------------
// 22. Avoid unnecessary HTML parsing
// ---------------------------------------------------------------------

const UnnecessaryHtmlExample: FC<GreetingProps> = ({ name }): ReactElement => {
  const html = `<p>Hello, ${name}</p>`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// There is no reason to create HTML here.
//
// The equivalent JSX is simpler and keeps the value in a normal text context:
//
// <div>
//     <p>Hello, {name}</p>
// </div>
//
// `dangerouslySetInnerHTML` should be reserved for cases where the application
// already has HTML that must actually be interpreted as HTML.

// ---------------------------------------------------------------------
// 23. Rich text component boundary
// ---------------------------------------------------------------------

const RichText: FC<SanitizedHtmlProps> = ({ sanitizedHtml }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

const Article: FC = (): ReactElement => {
  const article = {
    title: "Application Security",
    body: "<p>Security should be considered at every trust boundary.</p>",
  };

  // The example assumes that `article.body` has already passed through
  // the application's HTML sanitization pipeline.
  const sanitizedBody = createSanitizedHtml(article.body);

  return (
    <article>
      <h1>{article.title}</h1>
      <RichText sanitizedHtml={sanitizedBody} />
    </article>
  );
};

// In production code, `createSanitizedHtml` must perform actual sanitization.
// The function above is intentionally only a typed boundary example.

// ---------------------------------------------------------------------
// 24. Security review checklist
// ---------------------------------------------------------------------

// Before using `dangerouslySetInnerHTML`, verify:
//
// 1. Is HTML rendering genuinely required?
// 2. Where did the HTML originate?
// 3. Can any part of it be controlled by a user or external source?
// 4. Where is the HTML sanitized?
// 5. Is the sanitizer maintained and configured for the intended policy?
// 6. Are dangerous elements and attributes rejected?
// 7. Are URLs inside the HTML handled safely?
// 8. Can the application render the content as ordinary JSX instead?
// 9. Is the HTML sink isolated to a small, auditable boundary?
// 10. Is defense in depth, such as Content Security Policy, also appropriate?

// ---------------------------------------------------------------------
// 25. Integrated example
// ---------------------------------------------------------------------

interface ArticlePreviewProps {
  readonly title: string;
  readonly sanitizedContent: string;
}

const ArticlePreview: FC<ArticlePreviewProps> = ({ title, sanitizedContent }): ReactElement => {
  return (
    <article>
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </article>
  );
};

const DangerouslySetInnerHtmlDemo: FC = (): ReactElement => {
  const article = {
    title: "Security fundamentals",
    sanitizedContent: "<p>Keep untrusted data separate from browser-interpreted HTML.</p>",
  };

  return (
    <section>
      <ArticlePreview title={article.title} sanitizedContent={article.sanitizedContent} />
    </section>
  );
};

// This integrated example represents the final rendering boundary.
// The content is explicitly named `sanitizedContent` to communicate that
// sanitization must happen before this component receives the value.

// ---------------------------------------------------------------------
// 26. Practical guidance
// ---------------------------------------------------------------------

// Prefer:
//
// <div>{content}</div>
//
// when the content should be displayed as text.
//
// Use:
//
// <div dangerouslySetInnerHTML={{__html: sanitizedContent}} />
//
// only when the application genuinely needs HTML parsing.
//
// Establish the trust boundary before the value reaches the component that
// performs the HTML insertion.
//
// Keep the HTML-rendering surface small, auditable, and explicit.
//
// Remember that TypeScript types, variable names, and comments document
// assumptions; they do not perform sanitization.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `dangerouslySetInnerHTML` inserts an HTML string directly into the DOM.
// - Normal JSX escapes interpolated text, while `dangerouslySetInnerHTML` intentionally does not.
// - The API should be used only when actual HTML rendering is required.
// - Untrusted HTML must not be passed directly to `dangerouslySetInnerHTML`.
// - HTML that genuinely needs to be rendered should pass through an appropriate sanitization process first.
// - HTML sanitization should use a dedicated, maintained sanitizer rather than regular expressions.
// - Sanitization should account for elements, attributes, URLs, and active content.
// - Rendering ordinary text through JSX is safer when HTML formatting is unnecessary.
// - TypeScript cannot determine whether a string is trusted or sanitized.
// - Naming a value `sanitizedHtml` documents an assumption but does not establish the security property.
// - Keeping `dangerouslySetInnerHTML` inside a small rendering boundary makes security review easier.
// - Server rendering does not eliminate the security considerations associated with unsafe HTML.
// - Defense-in-depth controls such as Content Security Policy can complement safe HTML handling.
// - The security of `dangerouslySetInnerHTML` depends on the trust boundary established before the HTML reaches the sink.

export default DangerouslySetInnerHtmlDemo;

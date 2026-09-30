/**
 * Cross-Site Scripting (XSS)
 * ==========================
 *
 * Cross-Site Scripting (XSS) occurs when untrusted data is interpreted as executable content
 * in a user's browser. React escapes values rendered through normal JSX, which provides an
 * important default protection, but unsafe HTML APIs, URL handling, third-party libraries,
 * and incorrect trust boundaries can still introduce XSS vulnerabilities.
 *
 * The central security principle is to keep untrusted data as data and avoid turning it into
 * executable HTML, JavaScript, or other browser-interpreted content.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Untrusted input
// ---------------------------------------------------------------------

// User-controlled values must be treated as untrusted.
//
// Examples of untrusted data include:
//
// - Form input
// - URL parameters
// - Query-string values
// - API responses
// - Database content originating from users
// - Third-party content
// - Imported files
//
// The fact that data came from an application backend does not automatically
// make it trustworthy. The backend may contain data originally supplied by
// another user or external system.

interface ProfileProps {
  readonly displayName: string;
}

const Profile: FC<ProfileProps> = ({ displayName }): ReactElement => {
  return <p>{displayName}</p>;
};

// ---------------------------------------------------------------------
// 2. JSX escaping
// ---------------------------------------------------------------------

// React escapes text inserted through JSX expressions.
//
// The value below is rendered as text rather than being interpreted as HTML.
const SafeTextExample: FC = (): ReactElement => {
  const userInput = "<strong>Untrusted content</strong>";

  return (
    <section>
      <h2>Profile</h2>
      <p>{userInput}</p>
    </section>
  );
};

// If `userInput` contains markup-like characters, React does not normally
// interpret those characters as HTML when they are rendered as JSX text.
//
// This default escaping is one of the important security properties of
// normal React rendering.

// ---------------------------------------------------------------------
// 3. JSX attributes
// ---------------------------------------------------------------------

// React also handles ordinary attribute values as data rather than treating
// the value itself as executable JavaScript.
//
// The application should still validate that the value is appropriate for
// the attribute's intended purpose.
const SafeAttributeExample: FC = (): ReactElement => {
  const label = "John Doe";

  return <input aria-label={label} type="text" />;
};

// Escaping and validation solve different problems:
//
// - Escaping prevents data from being interpreted as markup in a context.
// - Validation checks whether the value is acceptable for the application's
//   intended domain or behavior.
//
// Both can be relevant to secure application design.

// ---------------------------------------------------------------------
// 4. Why React does not eliminate XSS
// ---------------------------------------------------------------------

// React's normal JSX escaping does not protect every browser-facing sink.
//
// Security problems can still arise when an application:
//
// - explicitly renders raw HTML,
// - constructs unsafe URLs,
// - uses browser APIs that interpret strings as HTML,
// - passes untrusted data to unsafe third-party libraries,
// - bypasses React's normal rendering behavior,
// - or incorrectly handles data at a trust boundary.
//
// Therefore, "React escapes JSX" is useful protection, but it is not a
// complete application security model.

// ---------------------------------------------------------------------
// 5. Dangerous HTML rendering
// ---------------------------------------------------------------------

interface HtmlContentProps {
  readonly html: string;
}

// `dangerouslySetInnerHTML` tells React to insert HTML rather than escaping
// the value as ordinary JSX text.
//
// Never pass arbitrary user-controlled HTML to this API without an
// appropriate sanitization strategy.
const UnsafeHtmlBoundary: FC<HtmlContentProps> = ({ html }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// This API is intentionally named to make the security-sensitive behavior
// obvious. The danger comes from the trust boundary around the HTML value,
// not from the API itself.

// ---------------------------------------------------------------------
// 6. Safe HTML alternative
// ---------------------------------------------------------------------

const SafeHtmlBoundary: FC<HtmlContentProps> = ({ html }): ReactElement => {
  return <div>{html}</div>;
};

// When HTML formatting is not actually required, rendering the value as
// ordinary JSX text is safer and simpler.
//
// The browser receives text rather than application-supplied HTML markup.

// ---------------------------------------------------------------------
// 7. Sanitization
// ---------------------------------------------------------------------

// Sometimes an application genuinely needs to display a restricted subset
// of HTML, such as formatted user-generated content.
//
// In that situation, escaping would remove the formatting, while rendering
// arbitrary HTML would create an unsafe trust boundary.
//
// A dedicated HTML sanitizer should be used before the value reaches
// `dangerouslySetInnerHTML`.
//
// Conceptually:
//
// const sanitizedHtml = sanitize(untrustedHtml);
//
// return <div dangerouslySetInnerHTML={{__html: sanitizedHtml}} />;
//
// The sanitizer must be configured for the actual HTML context and should
// be maintained as a security-sensitive dependency.
//
// Do not implement an HTML sanitizer with a few regular expressions or
// string replacements.

// ---------------------------------------------------------------------
// 8. Encoding is context-dependent
// ---------------------------------------------------------------------

// Security encoding depends on the context in which data is inserted.
//
// HTML text, HTML attributes, URLs, CSS, and JavaScript have different
// parsing rules.
//
// For example:
//
// const value = untrustedValue;
//
// return <p>{value}</p>;
//
// is a normal JSX text context.
//
// A value intended to become a URL:
//
// return <a href={value}>Open</a>;
//
// requires a different security analysis because the browser interprets
// the resulting value as a URL.
//
// A generic "escape everything" function is therefore not a universal
// solution to injection problems.

// ---------------------------------------------------------------------
// 9. Avoid HTML construction with strings
// ---------------------------------------------------------------------

// Avoid constructing HTML strings from untrusted values:
//
// const html = `<p>${untrustedValue}</p>`;
//
// Once a string is treated as HTML, the application has created a new
// injection boundary.
//
// Prefer React's declarative JSX:
//
// return <p>{untrustedValue}</p>;
//
// React can then keep the value in a text context and escape it appropriately.

// ---------------------------------------------------------------------
// 10. Browser HTML sinks
// ---------------------------------------------------------------------

// Browser APIs that parse strings as HTML require particular care.
//
// Examples include:
//
// - `element.innerHTML`
// - `element.outerHTML`
// - `insertAdjacentHTML`
//
// A React application should generally prefer React rendering rather than
// directly constructing HTML with these APIs.
//
// If a browser API must receive HTML, the data must pass through an
// appropriate security boundary first.

// ---------------------------------------------------------------------
// 11. DOM APIs and React
// ---------------------------------------------------------------------

// Direct DOM manipulation is sometimes necessary for integrations,
// measurements, or browser APIs.
//
// The security rule remains the same: do not place untrusted HTML into
// an HTML-parsing DOM API.
//
// Safe text insertion:
//
// const element = document.createElement("p");
// element.textContent = untrustedValue;
//
// `textContent` represents the value as text rather than parsing it as HTML.
//
// This example is placed inside a function so importing the module does not
// require a browser environment.
const createSafeTextNode = (value: string): HTMLParagraphElement => {
  const element = document.createElement("p");
  element.textContent = value;
  return element;
};

// ---------------------------------------------------------------------
// 12. Event handlers are not string HTML
// ---------------------------------------------------------------------

// React event handlers should be functions:
//
// const handleClick = (): void => {
//     // application logic
// };
//
// return <button onClick={handleClick}>Save</button>;
//
// Avoid patterns that construct executable JavaScript from strings.
//
// React's event-handler API does not require application code to generate
// JavaScript source code from user input.

// ---------------------------------------------------------------------
// 13. Avoid dynamic code execution
// ---------------------------------------------------------------------

// Never treat untrusted input as JavaScript source code.
//
// Dangerous APIs include:
//
// - `eval()`
// - `Function()`
//
// They can turn strings into executable JavaScript.
//
// For application data, use structured values and normal program logic
// instead of dynamically evaluating source code.

// ---------------------------------------------------------------------
// 14. Third-party content
// ---------------------------------------------------------------------

interface ExternalContentProps {
  readonly content: string;
}

// Data returned by a third-party API should still be treated according to
// the trust level of the source.
//
// If it contains plain text, render it as text.
const ExternalTextContent: FC<ExternalContentProps> = ({ content }): ReactElement => {
  return <p>{content}</p>;
};

// If an external system intentionally provides HTML, the application must
// establish an explicit HTML trust boundary and sanitize or otherwise
// constrain the content before rendering it as HTML.

// ---------------------------------------------------------------------
// 15. User-generated content
// ---------------------------------------------------------------------

interface CommentProps {
  readonly author: string;
  readonly comment: string;
}

const Comment: FC<CommentProps> = ({ author, comment }): ReactElement => {
  return (
    <article>
      <h3>{author}</h3>
      <p>{comment}</p>
    </article>
  );
};

// User-generated comments do not need HTML rendering merely because users
// supplied the content.
//
// Keeping comments as text substantially reduces the browser interpretation
// surface.

// ---------------------------------------------------------------------
// 16. Rich text requires an explicit trust boundary
// ---------------------------------------------------------------------

interface RichTextProps {
  readonly sanitizedHtml: string;
}

// This component documents an important architectural boundary:
//
// its prop is expected to contain HTML that has already passed through the
// application's approved sanitization process.
const SanitizedRichText: FC<RichTextProps> = ({ sanitizedHtml }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// The component itself cannot prove that the prop is actually sanitized.
// TypeScript types describe data shapes, not security properties.
//
// The application must enforce the trust boundary through its architecture,
// validation, and sanitization process.

// ---------------------------------------------------------------------
// 17. TypeScript does not prevent XSS
// ---------------------------------------------------------------------

interface UserInput {
  readonly value: string;
}

// TypeScript can describe the shape of data:
//
// const input: UserInput = {
//     value: externalValue,
// };
//
// But TypeScript cannot determine whether `value` is trustworthy.
//
// This is valid TypeScript:
//
// const trusted: string = untrustedValue;
//
// The type system does not automatically change the security classification
// of the value.
//
// Security decisions must therefore remain explicit in application design.

// ---------------------------------------------------------------------
// 18. Sanitization does not replace validation
// ---------------------------------------------------------------------

// Validation and sanitization have different purposes.
//
// Validation asks:
//
// "Is this value acceptable for this application field?"
//
// Sanitization asks:
//
// "How can this content be made safe for a particular output context?"
//
// For example, an application may validate that a profile name has an
// acceptable length and character set while separately sanitizing HTML
// content when rich text is intentionally supported.
//
// Neither concept should be treated as a universal replacement for the other.

// ---------------------------------------------------------------------
// 19. Server-side security
// ---------------------------------------------------------------------

// Client-side protections are not sufficient as the application's only
// security boundary.
//
// The server should also validate and constrain incoming data.
//
// A server may receive requests from:
//
// - a normal browser,
// - another application,
// - an automated client,
// - or a modified client that does not execute the application's React code.
//
// Therefore, security-sensitive validation cannot depend exclusively on
// client-side React components.

// ---------------------------------------------------------------------
// 20. Content Security Policy
// ---------------------------------------------------------------------

// A Content Security Policy (CSP) can provide an additional browser-level
// defense against some classes of XSS.
//
// CSP is configured through HTTP response headers or, in some cases,
// a meta element.
//
// A CSP should be designed for the application's actual architecture.
// It is a defense-in-depth mechanism and should not be treated as a
// replacement for safe rendering and correct input handling.
//
// Example concept:
//
// Content-Security-Policy: default-src 'self';
//
// A production policy generally requires more deliberate configuration,
// particularly when using scripts, styles, images, fonts, workers,
// connections, and other resource types.

// ---------------------------------------------------------------------
// 21. Security headers are defense in depth
// ---------------------------------------------------------------------

// Security headers can reduce the impact of certain browser-side attacks,
// but they do not make unsafe HTML rendering safe by themselves.
//
// A secure React application commonly combines:
//
// - safe JSX rendering,
// - appropriate validation,
// - HTML sanitization when required,
// - secure URL handling,
// - a suitable Content Security Policy,
// - secure cookie configuration,
// - server-side validation,
// - dependency maintenance,
// - and appropriate authentication and authorization controls.
//
// Security is therefore a layered system rather than one React feature.

// ---------------------------------------------------------------------
// 22. Avoid trusting visual appearance
// ---------------------------------------------------------------------

// An application should not assume that content is safe because it appears
// harmless in the UI.
//
// The same value may be interpreted differently depending on its destination:
//
// text content,
// an HTML attribute,
// a URL,
// CSS,
// or HTML markup.
//
// Security analysis should follow the value to the final browser sink
// rather than relying only on where the value originally came from.

// ---------------------------------------------------------------------
// 23. Security review example
// ---------------------------------------------------------------------

interface ReviewExampleProps {
  readonly title: string;
  readonly description: string;
}

const SecurityReviewExample: FC<ReviewExampleProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
};

// When reviewing a component, ask:
//
// 1. Can any displayed value originate outside the application?
// 2. Is the value rendered as ordinary JSX text?
// 3. Is `dangerouslySetInnerHTML` used?
// 4. Are URLs controlled by untrusted data?
// 5. Are browser HTML-parsing APIs used?
// 6. Is a third-party library interpreting the value?
// 7. Does the server validate the corresponding input?
// 8. If HTML is required, where is it sanitized?
// 9. Is the sanitization policy appropriate for the output context?
// 10. Is there defense in depth such as an appropriate CSP?

// ---------------------------------------------------------------------
// 24. Integrated example
// ---------------------------------------------------------------------

interface UserProfileProps {
  readonly displayName: string;
  readonly biography: string;
}

const UserProfile: FC<UserProfileProps> = ({ displayName, biography }): ReactElement => {
  return (
    <article>
      <h2>{displayName}</h2>
      <p>{biography}</p>
    </article>
  );
};

const XssDemo: FC = (): ReactElement => {
  const profile = {
    displayName: "John Doe",
    biography: "Software developer and writer.",
  };

  return (
    <section>
      <h1>User Profile</h1>
      <UserProfile displayName={profile.displayName} biography={profile.biography} />
    </section>
  );
};

// The integrated example deliberately uses ordinary JSX text.
//
// No raw HTML is necessary, so there is no reason to introduce an
// HTML-parsing trust boundary.

// ---------------------------------------------------------------------
// 25. Practical security rules
// ---------------------------------------------------------------------

// Prefer normal JSX:
//
// <p>{untrustedValue}</p>
//
// instead of constructing HTML:
//
// <div dangerouslySetInnerHTML={{__html: untrustedValue}} />
//
// If rich HTML is a genuine product requirement, establish an explicit
// sanitization boundary before rendering it.
//
// Treat URL values as a separate security problem because URL schemes and
// browser navigation behavior introduce risks that ordinary text escaping
// does not solve.
//
// Keep server-side validation in place even when client-side validation exists.
//
// Use defense in depth such as Content Security Policy and secure browser
// configuration rather than relying on a single mitigation.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - XSS occurs when untrusted data is interpreted as executable browser content.
// - Normal React JSX escapes interpolated text and provides an important default defense.
// - `dangerouslySetInnerHTML` creates an HTML trust boundary and requires careful handling.
// - When HTML is not required, render untrusted content as ordinary JSX text.
// - If trusted rich HTML is genuinely required, sanitize it before rendering.
// - HTML sanitization should use a dedicated, maintained sanitizer rather than regular expressions.
// - Escaping, validation, and sanitization address different security concerns.
// - Security encoding is context-dependent; HTML, URLs, CSS, and JavaScript have different parsing rules.
// - Browser HTML sinks such as `innerHTML` and `insertAdjacentHTML` require particular care.
// - Avoid `eval`, `Function`, and other mechanisms that turn untrusted strings into executable JavaScript.
// - TypeScript describes data types but does not establish whether a value is trustworthy.
// - Client-side validation does not replace server-side validation.
// - Content Security Policy provides defense in depth but does not replace safe rendering.
// - XSS prevention is a layered application-security responsibility rather than a single React feature.

export default XssDemo;

/**
 * URL Injection
 * =============
 *
 * URL injection occurs when untrusted data is used to construct or control a URL in a way that
 * produces unintended navigation, resource loading, or other browser behavior. React escapes JSX
 * attribute values, but escaping does not make a URL safe because the browser interprets the value
 * according to URL semantics after React renders it.
 *
 * URL handling therefore requires validating the intended protocol, destination, and URL structure
 * rather than relying on JSX escaping alone.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. URLs are interpreted by the browser
// ---------------------------------------------------------------------

const BasicUrlExample: FC = (): ReactElement => {
  const url = "https://example.com/profile";

  return <a href={url}>Open profile</a>;
};

// React safely handles the string as an attribute value.
//
// However, the browser still interprets the resulting `href` according to
// URL rules. Escaping the attribute does not determine whether the URL
// points to an appropriate or trustworthy destination.

// ---------------------------------------------------------------------
// 2. Untrusted URLs
// ---------------------------------------------------------------------

interface LinkProps {
  readonly url: string;
}

const ExternalLink: FC<LinkProps> = ({ url }): ReactElement => {
  return <a href={url}>Open link</a>;
};

// The TypeScript type `string` says nothing about whether the URL is safe.
//
// The value could have originated from:
//
// - user input,
// - query parameters,
// - an API response,
// - database content,
// - imported data,
// - or another external system.
//
// The URL therefore needs security validation appropriate to the intended
// navigation behavior.

// ---------------------------------------------------------------------
// 3. JSX escaping does not validate URL schemes
// ---------------------------------------------------------------------

const UntrustedUrlExample: FC = (): ReactElement => {
  const url = "javascript:alert('Unexpected code execution')";

  return <a href={url}>Open link</a>;
};

// React's normal JSX escaping does not turn an unsafe URL scheme into a safe
// one. The browser still interprets the value as a URL.
//
// The important distinction is:
//
// HTML escaping:
//     protects the markup representation of an attribute.
//
// URL validation:
//     determines whether the URL itself is acceptable.
//
// These are separate security concerns.

// ---------------------------------------------------------------------
// 4. Allowlisting protocols
// ---------------------------------------------------------------------

const isAllowedProtocol = (url: URL): boolean => {
  return url.protocol === "https:" || url.protocol === "http:";
};

// An application that permits external HTTP(S) links can explicitly allow
// only those protocols.
//
// The correct protocol allowlist depends on the application's requirements.
// For example, an application that requires secure external navigation may
// allow only `https:`.

// ---------------------------------------------------------------------
// 5. Parsing before validation
// ---------------------------------------------------------------------

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

// `URL` parses the URL according to the platform's URL parser.
//
// Parsing does not mean that the URL is trusted or appropriate. A successfully
// parsed URL can still use a protocol or destination that the application
// should reject.

// ---------------------------------------------------------------------
// 6. Validating an absolute external URL
// ---------------------------------------------------------------------

const getSafeExternalUrl = (value: string): string | null => {
  const url = parseUrl(value);

  if (url === null || !isAllowedProtocol(url)) {
    return null;
  }

  return url.href;
};

// The validation process explicitly rejects values that:
//
// - cannot be parsed as URLs,
// - use protocols outside the application's allowlist.
//
// Additional destination validation may be required depending on the
// application's security requirements.

// ---------------------------------------------------------------------
// 7. Rendering a validated URL
// ---------------------------------------------------------------------

const SafeExternalLink: FC<LinkProps> = ({ url }): ReactElement => {
  const safeUrl = getSafeExternalUrl(url);

  if (safeUrl === null) {
    return <span>Invalid link</span>;
  }

  return <a href={safeUrl}>Open link</a>;
};

// The URL is validated before reaching the navigation sink.
//
// The important security boundary is the validation step, not the JSX
// attribute itself.

// ---------------------------------------------------------------------
// 8. Relative URLs
// ---------------------------------------------------------------------

const RelativeUrlExample: FC = (): ReactElement => {
  const path = "/account/profile";

  return <a href={path}>Profile</a>;
};

// Relative URLs can be appropriate when navigation is intentionally limited
// to the current origin.
//
// The application should still validate or constrain dynamically generated
// paths if users can influence them.

// ---------------------------------------------------------------------
// 9. Building paths from untrusted values
// ---------------------------------------------------------------------

interface ProfileLinkProps {
  readonly username: string;
}

const ProfileLink: FC<ProfileLinkProps> = ({ username }): ReactElement => {
  const path = `/users/${encodeURIComponent(username)}`;

  return <a href={path}>View profile</a>;
};

// `encodeURIComponent` prevents characters in `username` from changing the
// structure of this particular path segment.
//
// Encoding is context-specific. It does not make an arbitrary URL safe and
// should not be treated as a general-purpose URL sanitizer.

// ---------------------------------------------------------------------
// 10. Query-string values
// ---------------------------------------------------------------------

interface SearchLinkProps {
  readonly query: string;
}

const SearchLink: FC<SearchLinkProps> = ({ query }): ReactElement => {
  const params = new URLSearchParams({ q: query });
  const href = `/search?${params.toString()}`;

  return <a href={href}>Search</a>;
};

// `URLSearchParams` correctly encodes query-string values.
//
// This is preferable to manually concatenating untrusted values:
//
// const href = `/search?q=${query}`;
//
// URL encoding and URL security validation are related but distinct concerns.

// ---------------------------------------------------------------------
// 11. Do not manually concatenate complex URLs
// ---------------------------------------------------------------------

const ManualUrlConstruction: FC<SearchLinkProps> = ({ query }): ReactElement => {
  const href = `/search?q=${encodeURIComponent(query)}`;

  return <a href={href}>Search</a>;
};

// Encoding a single query parameter can be correct here, but `URLSearchParams`
// is generally clearer when constructing multiple query parameters:
//
// const params = new URLSearchParams({
//     q: query,
//     page: "1",
// });
//
// const href = `/search?${params.toString()}`;

// ---------------------------------------------------------------------
// 12. Protocol-relative URLs
// ---------------------------------------------------------------------

const ProtocolRelativeExample: FC = (): ReactElement => {
  const url = "//example.com/profile";

  return <a href={url}>Open profile</a>;
};

// A URL beginning with `//` inherits the current page's protocol.
//
// For applications that require explicit HTTPS external URLs, protocol-relative
// URLs should not be treated as equivalent to an `https:` allowlist without
// deliberate handling.

// ---------------------------------------------------------------------
// 13. Hostname validation
// ---------------------------------------------------------------------

const isExampleHost = (url: URL): boolean => {
  return url.protocol === "https:" && url.hostname === "example.com";
};

const getSafeExampleUrl = (value: string): string | null => {
  const url = parseUrl(value);

  if (url === null || !isExampleHost(url)) {
    return null;
  }

  return url.href;
};

// When navigation must remain within a particular external origin, validate
// the parsed hostname rather than checking whether the raw string merely
// contains the expected hostname.

// ---------------------------------------------------------------------
// 14. Do not use substring checks for host validation
// ---------------------------------------------------------------------

const unsafeHostnameCheck = (value: string): boolean => {
  return value.includes("example.com");
};

// A substring check does not establish the actual destination.
//
// For example, an attacker-controlled URL could contain `example.com` as
// part of another hostname or as data elsewhere in the URL.
//
// Parse the URL and compare structured URL properties instead.

// ---------------------------------------------------------------------
// 15. Subdomains require an explicit policy
// ---------------------------------------------------------------------

const isExampleSubdomain = (url: URL): boolean => {
  return url.protocol === "https:" && (url.hostname === "example.com" || url.hostname.endsWith(".example.com"));
};

// Whether subdomains should be trusted depends on the application's ownership
// and security model.
//
// A suffix check should include the leading dot so that an unrelated hostname
// such as `notexample.com` does not match.

// ---------------------------------------------------------------------
// 16. Redirect parameters
// ---------------------------------------------------------------------

interface RedirectProps {
  readonly destination: string;
}

const UnsafeRedirectLink: FC<RedirectProps> = ({ destination }): ReactElement => {
  return <a href={destination}>Continue</a>;
};

// A common pattern is:
//
// /login?redirect=<destination>
//
// If `destination` is allowed to become an arbitrary external URL, the
// application may introduce an open redirect.
//
// Open redirects can be abused for phishing and can interact with other
// security mechanisms in ways that make them more dangerous.

// ---------------------------------------------------------------------
// 17. Restricting internal redirects
// ---------------------------------------------------------------------

const getSafeInternalPath = (value: string): string | null => {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
};

// This example accepts paths beginning with a single `/` while rejecting
// protocol-relative URLs beginning with `//`.
//
// Real applications may need stricter rules depending on their routing
// structure and whether encoded or normalized paths require additional
// handling.

// ---------------------------------------------------------------------
// 18. Redirect validation with URL parsing
// ---------------------------------------------------------------------

const getSafeInternalUrl = (value: string): string | null => {
  try {
    const url = new URL(value, "https://example.com");

    if (url.origin !== "https://example.com") {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

// Supplying a base URL allows relative paths to be parsed as URLs.
//
// The important property is the final origin comparison. A string merely
// beginning with `/` should not be treated as a complete security policy
// for every possible URL-processing context.

// ---------------------------------------------------------------------
// 19. URL fragments
// ---------------------------------------------------------------------

const FragmentExample: FC = (): ReactElement => {
  const href = "/docs/security#urls";

  return <a href={href}>URL security</a>;
};

// URL fragments are normally handled entirely on the client and are not sent
// to the server as part of an HTTP request.
//
// They can still affect browser-side application behavior if client code
// interprets the fragment as a command, route, selector, or other data.

// ---------------------------------------------------------------------
// 20. Dynamic resource URLs
// ---------------------------------------------------------------------

interface ImageProps {
  readonly src: string;
  readonly alt: string;
}

const ExternalImage: FC<ImageProps> = ({ src, alt }): ReactElement => {
  return <img src={src} alt={alt} />;
};

// URL validation is also relevant to resource attributes such as `src`.
//
// React escaping protects the attribute representation, but it does not
// establish that the resource URL is an appropriate destination.
//
// The required policy depends on the resource type and application's design.

// ---------------------------------------------------------------------
// 21. Restricting image hosts
// ---------------------------------------------------------------------

const getSafeImageUrl = (value: string): string | null => {
  const url = parseUrl(value);

  if (url === null) {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname !== "images.example.com") {
    return null;
  }

  return url.href;
};

const SafeExternalImage: FC<ImageProps> = ({ src, alt }): ReactElement => {
  const safeSrc = getSafeImageUrl(src);

  if (safeSrc === null) {
    return <span>Image unavailable</span>;
  }

  return <img src={safeSrc} alt={alt} />;
};

// A resource allowlist can be stricter than a general navigation allowlist.
//
// Security requirements should be defined according to the specific sink
// and resource type.

// ---------------------------------------------------------------------
// 22. Download URLs
// ---------------------------------------------------------------------

interface DownloadLinkProps {
  readonly url: string;
  readonly fileName: string;
}

const DownloadLink: FC<DownloadLinkProps> = ({ url, fileName }): ReactElement => {
  const safeUrl = getSafeExternalUrl(url);

  if (safeUrl === null) {
    return <span>Download unavailable</span>;
  }

  return (
    <a href={safeUrl} download={fileName}>
      Download
    </a>
  );
};

// A `download` attribute does not make an unsafe URL safe.
//
// The URL still needs to satisfy the application's resource and trust policy.

// ---------------------------------------------------------------------
// 23. `target="_blank"` and external links
// ---------------------------------------------------------------------

const NewTabLink: FC<LinkProps> = ({ url }): ReactElement => {
  const safeUrl = getSafeExternalUrl(url);

  if (safeUrl === null) {
    return <span>Invalid link</span>;
  }

  return (
    <a href={safeUrl} target="_blank" rel="noopener noreferrer">
      Open external page
    </a>
  );
};

// `rel="noopener noreferrer"` is appropriate when opening untrusted or
// externally controlled destinations in a new tab.
//
// This protects the opener relationship and reduces information leakage
// through the referrer in supported browser behavior.
//
// It does not validate the URL itself.

// ---------------------------------------------------------------------
// 24. URL objects do not establish trust
// ---------------------------------------------------------------------

const UrlObjectExample: FC<LinkProps> = ({ url }): ReactElement => {
  const parsedUrl = parseUrl(url);

  if (parsedUrl === null) {
    return <span>Invalid URL</span>;
  }

  return <a href={parsedUrl.href}>Open link</a>;
};

// Parsing a string into a `URL` object only establishes that the value can be
// represented as a URL.
//
// It does not establish that the protocol, hostname, port, path, or other
// properties satisfy the application's security policy.

// ---------------------------------------------------------------------
// 25. Client-side validation is not the only boundary
// ---------------------------------------------------------------------

// A client application may validate a URL before rendering it:
//
// const safeUrl = getSafeExternalUrl(value);
//
// However, the server must independently validate security-sensitive URL
// values when it processes them.
//
// A malicious client can bypass React and submit requests directly.
//
// Client-side validation improves the browser-side behavior, but it should
// not be treated as the sole security boundary.

// ---------------------------------------------------------------------
// 26. Server-side redirects
// ---------------------------------------------------------------------

// Server-side redirects require the same fundamental distinction:
//
// untrusted redirect target
//            ↓
// validation
//            ↓
// approved destination
//            ↓
// redirect response
//
// A server should not blindly place an arbitrary request parameter into a
// redirect response:
//
// response.redirect(request.query.redirect);
//
// Instead, the application should enforce an explicit redirect policy.

// ---------------------------------------------------------------------
// 27. Do not rely on URL encoding alone
// ---------------------------------------------------------------------

const EncodedButNotValidated: FC<LinkProps> = ({ url }): ReactElement => {
  const encodedUrl = encodeURI(url);

  return <a href={encodedUrl}>Open link</a>;
};

// `encodeURI` performs URI encoding; it does not decide whether the resulting
// URL is an allowed destination or protocol.
//
// Encoding and validation answer different questions.
//
// Do not use encoding functions as substitutes for a URL security policy.

// ---------------------------------------------------------------------
// 28. Validation policy
// ---------------------------------------------------------------------

interface UrlPolicy {
  readonly protocols: readonly string[];
  readonly hostnames?: readonly string[];
}

const validateUrl = (value: string, policy: UrlPolicy): string | null => {
  const url = parseUrl(value);

  if (url === null || !policy.protocols.includes(url.protocol)) {
    return null;
  }

  if (policy.hostnames !== undefined && !policy.hostnames.includes(url.hostname)) {
    return null;
  }

  return url.href;
};

// A policy makes the allowed destinations explicit.
//
// Different sinks can use different policies instead of sharing one overly
// broad "safe URL" helper for every browser context.

// ---------------------------------------------------------------------
// 29. Example URL policies
// ---------------------------------------------------------------------

const externalNavigationPolicy: UrlPolicy = {
  protocols: ["https:"],
};

const exampleOnlyPolicy: UrlPolicy = {
  protocols: ["https:"],
  hostnames: ["example.com"],
};

const validateExternalNavigation = (value: string): string | null => {
  return validateUrl(value, externalNavigationPolicy);
};

const validateExampleNavigation = (value: string): string | null => {
  return validateUrl(value, exampleOnlyPolicy);
};

// Explicit policies make security assumptions visible in the code.
//
// An application should choose the narrowest policy that satisfies the
// actual product requirement.

// ---------------------------------------------------------------------
// 30. Avoid unsafe trust propagation
// ---------------------------------------------------------------------

interface ApiLink {
  readonly label: string;
  readonly url: string;
}

const ApiLinkExample: FC<{ readonly link: ApiLink }> = ({ link }): ReactElement => {
  const safeUrl = validateExternalNavigation(link.url);

  if (safeUrl === null) {
    return <span>{link.label}</span>;
  }

  return <a href={safeUrl}>{link.label}</a>;
};

// Data arriving from an API is not automatically trusted.
//
// The API may itself contain user-generated or externally supplied values.
//
// The application should validate the URL according to the intended policy
// before using it as a browser navigation or resource destination.

// ---------------------------------------------------------------------
// 31. Integrated example
// ---------------------------------------------------------------------

interface ProfileUrlProps {
  readonly displayName: string;
  readonly profileUrl: string;
}

const SafeProfileLink: FC<ProfileUrlProps> = ({ displayName, profileUrl }): ReactElement => {
  const safeUrl = validateExternalNavigation(profileUrl);

  if (safeUrl === null) {
    return <span>{displayName} — profile link unavailable</span>;
  }

  return <a href={safeUrl}>{displayName}</a>;
};

const UrlInjectionDemo: FC = (): ReactElement => {
  const profile = {
    displayName: "John Doe",
    profileUrl: "https://example.com/users/john-doe",
  };

  return (
    <section>
      <h1>User profile</h1>
      <SafeProfileLink displayName={profile.displayName} profileUrl={profile.profileUrl} />
    </section>
  );
};

// The integrated example demonstrates the complete flow:
//
// external data
//      ↓
// parse URL
//      ↓
// validate protocol
//      ↓
// produce approved URL
//      ↓
// render with `href`

// ---------------------------------------------------------------------
// 32. Security review checklist
// ---------------------------------------------------------------------

// When a value controls a URL, ask:
//
// 1. Can the value be controlled by a user or external system?
// 2. Which browser sink receives the value?
// 3. Which protocols are allowed?
// 4. Is HTTPS required?
// 5. Must navigation remain on the application's origin?
// 6. Are allowed hostnames explicitly defined?
// 7. Is the URL parsed before structured properties are validated?
// 8. Are redirect targets restricted?
// 9. Are path and query parameters encoded for their specific context?
// 10. Is client-side validation incorrectly being treated as the only security boundary?
//
// The exact validation policy should follow the application's navigation,
// resource, and trust requirements.

// ---------------------------------------------------------------------
// 33. Practical guidance
// ---------------------------------------------------------------------

// React's escaping protects the HTML representation of an `href` value,
// but it does not decide whether the URL is safe.
//
// For dynamic URLs:
//
// - Parse the URL.
// - Allowlist the protocols that are actually required.
// - Restrict hostnames when the destination must be controlled.
// - Restrict redirects to approved internal paths or destinations.
// - Encode individual path and query parameters for their contexts.
// - Avoid substring checks for security decisions.
// - Validate security-sensitive values on the server as well.
//
// Prefer narrow, explicit URL policies over a generic helper that assumes
// every URL is safe for every browser sink.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - URL injection occurs when untrusted data controls a browser-interpreted URL in an unsafe way.
// - React escapes JSX attribute values, but escaping does not validate the URL itself.
// - URL protocols should be explicitly allowlisted according to the application's requirements.
// - `javascript:` and other unintended schemes must not be accepted when they are outside the policy.
// - Parsing a string with `new URL()` does not make the resulting URL trustworthy.
// - Validate structured URL properties such as protocol, hostname, port, and origin when required.
// - Avoid substring checks such as `value.includes("example.com")` for hostname validation.
// - `encodeURIComponent` and `URLSearchParams` encode data for specific URL contexts; they do not establish trust.
// - Relative internal paths can be safer when navigation is intentionally restricted to the application origin.
// - Redirect targets require explicit validation to prevent open redirects.
// - Resource URLs such as image `src` values require their own appropriate security policy.
// - `target="_blank"` links should use `rel="noopener noreferrer"` when appropriate, but this does not validate the destination.
// - TypeScript types such as `string` or `URL` do not establish that a value is safe.
// - Client-side URL validation does not replace server-side validation.
// - URL security should be implemented as an explicit trust boundary between untrusted data and browser URL sinks.
// - Use the narrowest URL policy that satisfies the application's actual requirements.

export default UrlInjectionDemo;

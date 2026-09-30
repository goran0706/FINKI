/**
 * URL
 * ===
 *
 * A URL (Uniform Resource Locator) identifies a resource and describes how a
 * client can locate and access it. A URL is composed of structured components
 * such as a scheme, authority, optional port, path, query string, and fragment.
 *
 * The general structure is:
 *
 *   scheme://host:port/path?query#fragment
 *
 * The scheme identifies the access protocol, such as `https`. The authority
 * contains the host and optional port. The path identifies a resource or
 * resource hierarchy on the server. The query contains additional parameters
 * and is separated from the path by `?`. The fragment identifies a location
 * within the retrieved resource and is separated by `#`.
 *
 * Browsers provide the `URL` Web API for parsing and constructing URLs. A
 * `URL` instance normalizes components into structured properties such as
 * `protocol`, `hostname`, `port`, `pathname`, `search`, and `hash`.
 *
 * Relative URLs do not contain enough information to independently identify
 * their final location. The `URL` constructor can resolve a relative URL
 * against an absolute base URL.
 *
 * URL parsing is different from URL encoding. Parsing separates an existing
 * URL into components, while encoding transforms characters so they can be
 * safely represented inside a URL component.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UrlBasicExampleProps {
  readonly url: string;
}

export interface UrlComponentsExampleProps {
  readonly url: string;
}

export interface UrlConstructionExampleProps {
  readonly origin: string;
  readonly pathname: string;
}

export interface UrlRelativeExampleProps {
  readonly baseUrl: string;
  readonly relativePath: string;
}

export interface UrlSpecialCharactersExampleProps {
  readonly value: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Parses an absolute URL and displays its complete serialized representation.
 */
export const UrlBasicExample: FC<UrlBasicExampleProps> = ({ url }: UrlBasicExampleProps): ReactNode => {
  let parsedUrl: URL | null = null;
  let errorMessage: string | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    errorMessage = "The supplied value is not a valid absolute URL.";
  }

  return (
    <section>
      <h3>Parsing an absolute URL</h3>

      {parsedUrl !== null ? <p>{parsedUrl.href}</p> : <p>{errorMessage}</p>}
    </section>
  );
};

/**
 * Demonstrates the structured properties exposed by the URL Web API.
 */
export const UrlComponentsExample: FC<UrlComponentsExampleProps> = ({ url }: UrlComponentsExampleProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Reading URL components</h3>
        <p>Unable to parse the supplied URL.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Reading URL components</h3>

      <dl>
        <dt>Protocol</dt>
        <dd>{parsedUrl.protocol}</dd>

        <dt>Origin</dt>
        <dd>{parsedUrl.origin}</dd>

        <dt>Hostname</dt>
        <dd>{parsedUrl.hostname}</dd>

        <dt>Port</dt>
        <dd>{parsedUrl.port || "(default)"}</dd>

        <dt>Pathname</dt>
        <dd>{parsedUrl.pathname}</dd>

        <dt>Search</dt>
        <dd>{parsedUrl.search || "(none)"}</dd>

        <dt>Hash</dt>
        <dd>{parsedUrl.hash || "(none)"}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates constructing a URL from an origin and pathname instead of
 * concatenating strings manually.
 */
export const UrlConstructionExample: FC<UrlConstructionExampleProps> = ({
  origin,
  pathname,
}: UrlConstructionExampleProps): ReactNode => {
  let constructedUrl: URL | null = null;

  try {
    constructedUrl = new URL(pathname, origin);
  } catch {
    constructedUrl = null;
  }

  return (
    <section>
      <h3>Constructing a URL</h3>

      {constructedUrl !== null ? (
        <p>{constructedUrl.href}</p>
      ) : (
        <p>The origin and pathname could not be combined into a valid URL.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates how the URL constructor resolves a relative reference against
 * an absolute base URL.
 */
export const UrlRelativeExample: FC<UrlRelativeExampleProps> = ({
  baseUrl,
  relativePath,
}: UrlRelativeExampleProps): ReactNode => {
  let resolvedUrl: URL | null = null;

  try {
    resolvedUrl = new URL(relativePath, baseUrl);
  } catch {
    resolvedUrl = null;
  }

  return (
    <section>
      <h3>Resolving a relative URL</h3>

      {resolvedUrl !== null ? <p>{resolvedUrl.href}</p> : <p>The base URL or relative reference is invalid.</p>}
    </section>
  );
};

/**
 * Demonstrates URL encoding for a value that contains characters with special
 * meaning in URLs.
 */
export const UrlSpecialCharactersExample: FC<UrlSpecialCharactersExampleProps> = ({
  value,
}: UrlSpecialCharactersExampleProps): ReactNode => {
  const encodedValue: string = encodeURIComponent(value);

  return (
    <section>
      <h3>Encoding URL component data</h3>

      <p>Original: {value}</p>
      <p>Encoded: {encodedValue}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UrlContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>URL</h1>

      <h2>1. Parsing an absolute URL</h2>
      <UrlBasicExample url="https://example.com/products/item" />

      <h2>2. Reading URL components</h2>
      <UrlComponentsExample url="https://example.com:8443/products/item?category=books#details" />

      <h2>3. Constructing a URL</h2>
      <UrlConstructionExample origin="https://example.com" pathname="/products" />

      <h2>4. Resolving a relative URL</h2>
      <UrlRelativeExample baseUrl="https://example.com/products/" relativePath="item" />

      <h2>5. Encoding URL component data</h2>
      <UrlSpecialCharactersExample value="John Doe & React" />
    </main>
  );
};

export default UrlContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A URL identifies a resource and contains structured components.
// - The general URL structure is scheme://host:port/path?query#fragment.
// - The `URL` Web API parses and constructs URLs using structured properties.
// - `protocol` identifies the scheme, while `hostname` identifies the host.
// - `pathname` identifies the path portion of the URL.
// - `search` contains the query string, including its leading `?` when present.
// - `hash` contains the fragment, including its leading `#` when present.
// - The `URL` constructor can resolve relative references against an absolute base URL.
// - Invalid absolute URLs cause the `URL` constructor to throw a `TypeError`.
// - URL parsing and URL encoding are different operations.
// - `encodeURIComponent` is intended for encoding individual URL components rather than complete URLs.

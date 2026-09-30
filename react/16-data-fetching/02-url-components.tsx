/**
 * URL Components
 * ==============
 *
 * A URL is composed of distinct components that identify how and where a
 * resource is accessed. The URL Web API exposes these components through
 * properties on a `URL` instance.
 *
 * For an absolute URL such as:
 *
 *   https://user:password@example.com:8443/products/item?category=books#details
 *
 * the URL contains a protocol (`https:`), username, password, hostname,
 * optional port, pathname, query (`?category=books`), and fragment
 * (`#details`). The `origin` combines the scheme, hostname, and effective
 * port, while `href` represents the complete serialized URL.
 *
 * The `URL` interface also exposes `host`, which contains the hostname and
 * explicit port together, and `searchParams`, which provides a structured
 * `URLSearchParams` interface for the query string.
 *
 * URL component properties are not interchangeable. For example, `pathname`
 * does not include the query string, `search` includes the leading `?`, and
 * `hash` includes the leading `#`. The `URL` object handles serialization and
 * normalization when individual components are changed.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UrlComponentsDisplayProps {
  readonly url: string;
}

export interface UrlComponentsAuthorityProps {
  readonly url: string;
}

export interface UrlComponentsPathProps {
  readonly url: string;
}

export interface UrlComponentsQueryProps {
  readonly url: string;
}

export interface UrlComponentsFragmentProps {
  readonly url: string;
}

export interface UrlComponentsMutationProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Displays the major URL components exposed by the URL Web API.
 */
export const UrlComponentsDisplayExample: FC<UrlComponentsDisplayProps> = ({
  url,
}: UrlComponentsDisplayProps): ReactNode => {
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
        <p>Invalid URL.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Reading URL components</h3>

      <dl>
        <dt>href</dt>
        <dd>{parsedUrl.href}</dd>

        <dt>origin</dt>
        <dd>{parsedUrl.origin}</dd>

        <dt>protocol</dt>
        <dd>{parsedUrl.protocol}</dd>

        <dt>host</dt>
        <dd>{parsedUrl.host}</dd>

        <dt>hostname</dt>
        <dd>{parsedUrl.hostname}</dd>

        <dt>port</dt>
        <dd>{parsedUrl.port || "(default)"}</dd>

        <dt>pathname</dt>
        <dd>{parsedUrl.pathname}</dd>

        <dt>search</dt>
        <dd>{parsedUrl.search || "(none)"}</dd>

        <dt>hash</dt>
        <dd>{parsedUrl.hash || "(none)"}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates the distinction between origin, host, hostname, and port.
 */
export const UrlComponentsAuthorityExample: FC<UrlComponentsAuthorityProps> = ({
  url,
}: UrlComponentsAuthorityProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Reading authority components</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Reading authority components</h3>

      <dl>
        <dt>Origin</dt>
        <dd>{parsedUrl.origin}</dd>

        <dt>Host</dt>
        <dd>{parsedUrl.host}</dd>

        <dt>Hostname</dt>
        <dd>{parsedUrl.hostname}</dd>

        <dt>Port</dt>
        <dd>{parsedUrl.port || "(default)"}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates that pathname contains the hierarchical path without the query
 * string or fragment.
 */
export const UrlComponentsPathExample: FC<UrlComponentsPathProps> = ({ url }: UrlComponentsPathProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Reading the pathname</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Reading the pathname</h3>

      <p>Pathname: {parsedUrl.pathname}</p>

      <p>Search remains separate: {parsedUrl.search || "(none)"}</p>

      <p>Hash remains separate: {parsedUrl.hash || "(none)"}</p>
    </section>
  );
};

/**
 * Demonstrates the raw query-string component and the structured
 * `URLSearchParams` representation.
 */
export const UrlComponentsQueryExample: FC<UrlComponentsQueryProps> = ({ url }: UrlComponentsQueryProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Reading the query component</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  const entries: Array<readonly [string, string]> = Array.from(parsedUrl.searchParams.entries());

  return (
    <section>
      <h3>Reading the query component</h3>

      <p>Raw search: {parsedUrl.search || "(none)"}</p>

      {entries.length > 0 ? (
        <ul>
          {entries.map((entry: readonly [string, string], index: number): ReactNode => (
            <li key={`${entry[0]}-${index}`}>
              {entry[0]} = {entry[1]}
            </li>
          ))}
        </ul>
      ) : (
        <p>No query parameters.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates the fragment component. The fragment is client-side
 * information and is not included in the HTTP request sent to the server.
 */
export const UrlComponentsFragmentExample: FC<UrlComponentsFragmentProps> = ({
  url,
}: UrlComponentsFragmentProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Reading the fragment</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Reading the fragment</h3>

      <p>Hash: {parsedUrl.hash || "(none)"}</p>

      <p>Fragment value: {parsedUrl.hash ? parsedUrl.hash.slice(1) : "(none)"}</p>
    </section>
  );
};

/**
 * Demonstrates that changing a URL component updates the URL's serialized
 * representation and can trigger normalization performed by the URL API.
 */
export const UrlComponentsMutationExample: FC<UrlComponentsMutationProps> = ({
  url,
}: UrlComponentsMutationProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Changing URL components</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  parsedUrl.pathname = "/updated-resource";
  parsedUrl.hash = "details";

  return (
    <section>
      <h3>Changing URL components</h3>

      <p>Updated URL: {parsedUrl.href}</p>

      <p>Updated pathname: {parsedUrl.pathname}</p>

      <p>Updated hash: {parsedUrl.hash}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UrlComponentsContainer: FC = (): ReactNode => {
  const completeUrl: string = "https://example.com:8443/products/item?category=books&sort=asc#details";

  return (
    <main>
      <h1>URL Components</h1>

      <h2>1. Reading URL components</h2>
      <UrlComponentsDisplayExample url={completeUrl} />

      <h2>2. Reading authority components</h2>
      <UrlComponentsAuthorityExample url="https://example.com:8443/products" />

      <h2>3. Reading the pathname</h2>
      <UrlComponentsPathExample url={completeUrl} />

      <h2>4. Reading the query component</h2>
      <UrlComponentsQueryExample url={completeUrl} />

      <h2>5. Reading the fragment</h2>
      <UrlComponentsFragmentExample url={completeUrl} />

      <h2>6. Changing URL components</h2>
      <UrlComponentsMutationExample url="https://example.com/products/item?category=books" />
    </main>
  );
};

export default UrlComponentsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `href` is the complete serialized URL.
// - `origin` contains the scheme, hostname, and effective port.
// - `host` contains the hostname and explicit port.
// - `hostname` contains only the host name.
// - `port` contains the explicit port or an empty string when the default port is used.
// - `pathname` contains the URL path without the query or fragment.
// - `search` contains the query string, including the leading `?` when present.
// - `searchParams` provides structured access to query parameters.
// - `hash` contains the fragment, including the leading `#` when present.
// - URL fragments are handled by the client and are not sent as part of an HTTP request.
// - Assigning URL component properties changes the serialized URL and can normalize its representation.

/**
 * Fetch Headers
 * =============
 *
 * HTTP headers are metadata fields exchanged with HTTP requests and responses.
 * The Fetch API represents request and response headers with the Headers
 * interface. Headers provides methods such as set(), append(), get(), has(),
 * delete(), and entries() for manipulating and inspecting header fields.
 *
 * Request headers can be supplied through the `headers` property of RequestInit
 * or through a Headers instance. Response headers are exposed through the
 * `headers` property of a Response object after fetch() receives a response.
 *
 * Header names are case-insensitive. A Headers object normalizes header names
 * according to the Fetch standard, so `Content-Type` and `content-type` refer
 * to the same header field. Header values are represented as strings.
 *
 * `set()` replaces the existing value for a header, while `append()` adds
 * another value to the existing header field. `get()` returns the combined
 * header value when a header exists and returns null when it does not.
 *
 * Browsers restrict JavaScript from setting certain request headers directly.
 * These restrictions protect browser-controlled networking behavior. A custom
 * application header can also cause a cross-origin request to require a CORS
 * preflight when it is not CORS-safelisted.
 *
 * Response headers are subject to browser exposure rules for cross-origin
 * responses. A server may need to expose non-safelisted response headers with
 * Access-Control-Expose-Headers before browser JavaScript can read them.
 */

import { type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchHeadersCreateProps {
  readonly name: string;
  readonly value: string;
}

export interface FetchHeadersSetProps {
  readonly name: string;
  readonly initialValue: string;
  readonly replacementValue: string;
}

export interface FetchHeadersAppendProps {
  readonly name: string;
  readonly firstValue: string;
  readonly secondValue: string;
}

export interface FetchHeadersGetProps {
  readonly name: string;
  readonly value: string;
}

export interface FetchHeadersDeleteProps {
  readonly name: string;
  readonly value: string;
}

export interface FetchRequestHeadersProps {
  readonly url: string;
  readonly headerName: string;
  readonly headerValue: string;
}

export interface FetchResponseHeadersProps {
  readonly url: string;
  readonly headerName: string;
}

export interface FetchHeaderCaseProps {
  readonly firstName: string;
  readonly secondName: string;
  readonly value: string;
}

export interface FetchHeadersListProps {
  readonly headers: readonly [string, string][];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates creating a Headers object and adding a header with set().
 */
export const FetchHeadersCreateExample: FC<FetchHeadersCreateProps> = ({
  name,
  value,
}: FetchHeadersCreateProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(name, value);

  return (
    <section>
      <h3>Creating Headers</h3>

      <p>Header name: {name}</p>

      <p>Header value: {headers.get(name) ?? "Not set"}</p>
    </section>
  );
};

/**
 * Demonstrates that set() replaces an existing header value instead of adding
 * another value to the existing field.
 */
export const FetchHeadersSetExample: FC<FetchHeadersSetProps> = ({
  name,
  initialValue,
  replacementValue,
}: FetchHeadersSetProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(name, initialValue);

  headers.set(name, replacementValue);

  return (
    <section>
      <h3>Replacing a header with set()</h3>

      <p>Initial value: {initialValue}</p>

      <p>Replacement value: {replacementValue}</p>

      <p>Current value: {headers.get(name) ?? "Not set"}</p>
    </section>
  );
};

/**
 * Demonstrates that append() adds a value to an existing header rather than
 * replacing the current value.
 */
export const FetchHeadersAppendExample: FC<FetchHeadersAppendProps> = ({
  name,
  firstValue,
  secondValue,
}: FetchHeadersAppendProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.append(name, firstValue);

  headers.append(name, secondValue);

  return (
    <section>
      <h3>Appending a header value</h3>

      <p>Header name: {name}</p>

      <p>Combined value: {headers.get(name) ?? "Not set"}</p>

      <p>
        append() preserves the existing header value and adds another value according to HTTP header serialization
        rules.
      </p>
    </section>
  );
};

/**
 * Demonstrates checking for a header with has() and reading it with get().
 */
export const FetchHeadersGetExample: FC<FetchHeadersGetProps> = ({ name, value }: FetchHeadersGetProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(name, value);

  const exists: boolean = headers.has(name);

  const currentValue: string | null = headers.get(name);

  return (
    <section>
      <h3>Reading a header</h3>

      <p>Header exists: {exists ? "Yes" : "No"}</p>

      <p>Header value: {currentValue ?? "Not available"}</p>
    </section>
  );
};

/**
 * Demonstrates removing a header with delete().
 */
export const FetchHeadersDeleteExample: FC<FetchHeadersDeleteProps> = ({
  name,
  value,
}: FetchHeadersDeleteProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(name, value);

  const beforeDelete: string | null = headers.get(name);

  headers.delete(name);

  const afterDelete: string | null = headers.get(name);

  return (
    <section>
      <h3>Deleting a header</h3>

      <p>Before delete: {beforeDelete ?? "Not set"}</p>

      <p>After delete: {afterDelete ?? "Not set"}</p>
    </section>
  );
};

/**
 * Demonstrates supplying request headers through RequestInit.
 */
export const FetchRequestHeadersExample: FC<FetchRequestHeadersProps> = ({
  url,
  headerName,
  headerValue,
}: FetchRequestHeadersProps): ReactNode => {
  const request: Request = new Request(url, {
    headers: {
      [headerName]: headerValue,
    },
  });

  const configuredValue: string | null = request.headers.get(headerName);

  return (
    <section>
      <h3>Request headers</h3>

      <p>URL: {request.url}</p>

      <p>
        {headerName}: {configuredValue ?? "Not set"}
      </p>
    </section>
  );
};

/**
 * Demonstrates reading a response header after fetch() receives a response.
 */
export const FetchResponseHeadersExample: FC<FetchResponseHeadersProps> = ({
  url,
  headerName,
}: FetchResponseHeadersProps): ReactNode => {
  const [value, setValue] = useState<string>("Waiting for response");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        const headerValue: string | null = response.headers.get(headerName);

        setValue(headerValue ?? "Header was not exposed or was not present.");
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setValue("Unable to retrieve response headers.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [headerName, url]);

  return (
    <section>
      <h3>Response headers</h3>

      <p>
        {headerName}: {value}
      </p>

      <p>Cross-origin response headers can be hidden from JavaScript unless the server exposes them.</p>
    </section>
  );
};

/**
 * Demonstrates that HTTP header names are case-insensitive.
 */
export const FetchHeaderCaseExample: FC<FetchHeaderCaseProps> = ({
  firstName,
  secondName,
  value,
}: FetchHeaderCaseProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(firstName, value);

  const firstLookup: string | null = headers.get(firstName);

  const secondLookup: string | null = headers.get(secondName);

  const sameValue: boolean = firstLookup === secondLookup;

  return (
    <section>
      <h3>Case-insensitive header names</h3>

      <p>First lookup: {firstLookup ?? "Not found"}</p>

      <p>Second lookup: {secondLookup ?? "Not found"}</p>

      <p>Same header value: {sameValue ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates constructing Headers from multiple header name/value pairs and
 * iterating over the normalized entries.
 */
export const FetchHeadersListExample: FC<FetchHeadersListProps> = ({
  headers: headerEntries,
}: FetchHeadersListProps): ReactNode => {
  const headers: Headers = new Headers(headerEntries);

  const entries: readonly string[] = Array.from(
    headers.entries(),
    (entry: [string, string]): string => `${entry[0]}: ${entry[1]}`,
  );

  return (
    <section>
      <h3>Iterating over headers</h3>

      <ul>
        {entries.map((entry: string): ReactNode => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>

      <p>Header names are normalized by the Headers implementation and are compared without regard to case.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchHeadersContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch Headers</h1>

      <h2>1. Creating and setting headers</h2>
      <FetchHeadersCreateExample name="X-Example-Header" value="example" />

      <h2>2. Replacing a header with set()</h2>
      <FetchHeadersSetExample name="X-Example-Header" initialValue="first" replacementValue="second" />

      <h2>3. Appending a header value</h2>
      <FetchHeadersAppendExample name="X-Example-Header" firstValue="first" secondValue="second" />

      <h2>4. Checking and reading headers</h2>
      <FetchHeadersGetExample name="X-Example-Header" value="example" />

      <h2>5. Deleting headers</h2>
      <FetchHeadersDeleteExample name="X-Example-Header" value="example" />

      <h2>6. Supplying request headers to fetch()</h2>
      <FetchRequestHeadersExample
        url="https://example.com/api/users"
        headerName="X-Example-Header"
        headerValue="example"
      />

      <h2>7. Reading response headers</h2>
      <FetchResponseHeadersExample url="https://example.com/api/users" headerName="Content-Type" />

      <h2>8. Understanding case-insensitive header names</h2>
      <FetchHeaderCaseExample firstName="Content-Type" secondName="content-type" value="application/json" />

      <h2>9. Iterating over a Headers object</h2>
      <FetchHeadersListExample
        headers={[
          ["Content-Type", "application/json"],
          ["X-Example-Header", "example"],
        ]}
      />
    </main>
  );
};

export default FetchHeadersContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The Fetch API uses the Headers interface to represent request and response headers.
// - Headers can be created with new Headers() and populated with set().
// - set() replaces the current value for a header.
// - append() adds another value to the existing header.
// - get() reads a header value and returns null when the header does not exist.
// - has() checks whether a header exists.
// - delete() removes a header.
// - Request headers can be supplied through RequestInit.headers.
// - Response headers are available through Response.headers.
// - HTTP header names are case-insensitive.
// - Header values are represented as strings.
// - Browsers restrict JavaScript from setting certain request headers.
// - Non-safelisted custom request headers can cause a cross-origin request to require a CORS preflight.
// - Cross-origin response headers can require Access-Control-Expose-Headers before browser JavaScript can read them.
// - Headers.entries() can be used to iterate over normalized header name/value pairs.

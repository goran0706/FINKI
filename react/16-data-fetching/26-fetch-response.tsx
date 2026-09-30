/**
 * Fetch Response
 * ==============
 *
 * The Fetch API represents an HTTP response with the `Response` interface.
 * A Response contains response metadata such as the final URL, HTTP status,
 * status text, response type, headers, redirect state, and response body.
 *
 * The `fetch()` function resolves its Promise with a Response once the browser
 * has received the response headers. The response body is exposed separately
 * through the Response body-reading methods `text()`, `json()`, `blob()`,
 * `arrayBuffer()`, `bytes()`, and `formData()`, depending on the runtime
 * environment and TypeScript DOM library version.
 *
 * `response.ok` is true when the HTTP status is in the 200-299 range. It is
 * false for statuses such as 400, 404, and 500. A false `ok` value does not
 * cause fetch() itself to reject; application code normally checks `ok` or
 * `status` explicitly.
 *
 * Response bodies are streams. Reading a body consumes it, causing
 * `response.bodyUsed` to become true. A response body normally cannot be read
 * twice after it has been consumed. `response.clone()` creates a second
 * Response whose body can be consumed independently.
 *
 * The `Response` constructor can also create synthetic Response objects without
 * performing network requests. This is useful for understanding Response
 * properties and for APIs that need to produce response-like values.
 *
 * Response headers are exposed through the Headers interface. For cross-origin
 * responses, browser CORS rules determine which response headers JavaScript can
 * access.
 */

import { type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchResponseStatusProps {
  readonly status: number;
}

export interface FetchResponseOkProps {
  readonly status: number;
}

export interface FetchResponseStatusTextProps {
  readonly status: number;
  readonly statusText: string;
}

export interface FetchResponseUrlProps {
  readonly url: string;
}

export interface FetchResponseRedirectedProps {
  readonly url: string;
  readonly redirected: boolean;
}

export interface FetchResponseTypeProps {
  readonly type: ResponseType;
}

export interface FetchResponseHeadersProps {
  readonly contentType: string;
}

export interface FetchResponseBodyProps {
  readonly body: string;
}

export interface FetchResponseBodyUsedProps {
  readonly body: string;
}

export interface FetchResponseCloneProps {
  readonly body: string;
}

export interface FetchResponseFetchProps {
  readonly url: string;
}

export interface FetchResponseErrorProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates reading the HTTP status from a Response.
 */
export const FetchResponseStatusExample: FC<FetchResponseStatusProps> = ({
  status,
}: FetchResponseStatusProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
  });

  return (
    <section>
      <h3>Response status</h3>

      <p>HTTP status: {response.status}</p>
    </section>
  );
};

/**
 * Demonstrates the relationship between Response.ok and the HTTP status.
 */
export const FetchResponseOkExample: FC<FetchResponseOkProps> = ({ status }: FetchResponseOkProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
  });

  return (
    <section>
      <h3>Response ok</h3>

      <p>HTTP status: {response.status}</p>

      <p>response.ok: {response.ok ? "true" : "false"}</p>

      <p>`ok` is true only for HTTP statuses from 200 through 299.</p>
    </section>
  );
};

/**
 * Demonstrates the statusText property of a Response.
 */
export const FetchResponseStatusTextExample: FC<FetchResponseStatusTextProps> = ({
  status,
  statusText,
}: FetchResponseStatusTextProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
    statusText,
  });

  return (
    <section>
      <h3>Response status text</h3>

      <p>Status: {response.status}</p>

      <p>Status text: {response.statusText}</p>
    </section>
  );
};

/**
 * Demonstrates the URL associated with a Response.
 */
export const FetchResponseUrlExample: FC<FetchResponseUrlProps> = ({ url }: FetchResponseUrlProps): ReactNode => {
  const response: Response = new Response(null, {
    headers: {
      "Content-Type": "text/plain",
    },
  });

  return (
    <section>
      <h3>Response URL</h3>

      <p>Requested URL: {url}</p>

      <p>Synthetic Response URL: {response.url || "Empty because this Response was created locally"}</p>

      <p>A Response created by fetch() normally has its final response URL available through response.url.</p>
    </section>
  );
};

/**
 * Demonstrates the redirected property on a synthetic Response and explains
 * that this property describes redirect handling performed by fetch().
 */
export const FetchResponseRedirectedExample: FC<FetchResponseRedirectedProps> = ({
  url,
  redirected,
}: FetchResponseRedirectedProps): ReactNode => {
  const response: Response = new Response(null);

  return (
    <section>
      <h3>Response redirected state</h3>

      <p>URL: {url}</p>

      <p>Synthetic response redirected: {response.redirected ? "true" : "false"}</p>

      <p>
        A Response created directly with the constructor is not the result of following an HTTP redirect. Fetch-created
        responses can report whether redirects occurred.
      </p>

      <p>Configured example value: {redirected ? "true" : "false"}</p>
    </section>
  );
};

/**
 * Demonstrates the Response type property.
 */
export const FetchResponseTypeExample: FC<FetchResponseTypeProps> = ({ type }: FetchResponseTypeProps): ReactNode => {
  const response: Response = new Response(null);

  return (
    <section>
      <h3>Response type</h3>

      <p>Synthetic Response type: {response.type}</p>

      <p>
        Fetch-created responses can have types such as basic, cors, opaque, opaqueredirect, or error depending on the
        request and browser processing.
      </p>

      <p>Example requested type: {type}</p>
    </section>
  );
};

/**
 * Demonstrates reading headers from a Response object.
 */
export const FetchResponseHeadersExample: FC<FetchResponseHeadersProps> = ({
  contentType,
}: FetchResponseHeadersProps): ReactNode => {
  const response: Response = new Response(null, {
    headers: {
      "Content-Type": contentType,
    },
  });

  const headerValue: string | null = response.headers.get("Content-Type");

  return (
    <section>
      <h3>Response headers</h3>

      <p>Content-Type: {headerValue ?? "Not available"}</p>

      <p>Response headers are available through the Response.headers Headers object.</p>
    </section>
  );
};

/**
 * Demonstrates reading a response body with Response.text().
 */
export const FetchResponseBodyExample: FC<FetchResponseBodyProps> = ({ body }: FetchResponseBodyProps): ReactNode => {
  const [message, setMessage] = useState<string>("Body has not been consumed.");

  const handleRead = (): void => {
    const response: Response = new Response(body, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const read: () => Promise<void> = async (): Promise<void> => {
      try {
        const text: string = await response.text();

        setMessage(`Response body: ${text}`);
      } catch (error: unknown) {
        setMessage("The response body could not be read.");
      }
    };

    void read();
  };

  return (
    <section>
      <h3>Reading a response body</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRead}>
        Read response body
      </button>
    </section>
  );
};

/**
 * Demonstrates the bodyUsed property before and after a Response body is
 * consumed.
 */
export const FetchResponseBodyUsedExample: FC<FetchResponseBodyUsedProps> = ({
  body,
}: FetchResponseBodyUsedProps): ReactNode => {
  const [bodyUsed, setBodyUsed] = useState<boolean>(false);

  const handleRead = (): void => {
    const response: Response = new Response(body);

    const read: () => Promise<void> = async (): Promise<void> => {
      await response.text();

      setBodyUsed(response.bodyUsed);
    };

    void read();
  };

  return (
    <section>
      <h3>Response bodyUsed</h3>

      <p>Body used in demonstration: {bodyUsed ? "true" : "false"}</p>

      <button type="button" onClick={handleRead}>
        Consume response body
      </button>
    </section>
  );
};

/**
 * Demonstrates cloning a Response before consuming its body.
 */
export const FetchResponseCloneExample: FC<FetchResponseCloneProps> = ({
  body,
}: FetchResponseCloneProps): ReactNode => {
  const [message, setMessage] = useState<string>("Neither response has been consumed.");

  const handleRead = (): void => {
    const response: Response = new Response(body);

    const clone: Response = response.clone();

    const read: () => Promise<void> = async (): Promise<void> => {
      try {
        const originalText: string = await response.text();

        const cloneText: string = await clone.text();

        setMessage(`Original: ${originalText}; Clone: ${cloneText}`);
      } catch (error: unknown) {
        setMessage("The response body could not be consumed.");
      }
    };

    void read();
  };

  return (
    <section>
      <h3>Cloning a response</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRead}>
        Read original and clone
      </button>
    </section>
  );
};

/**
 * Demonstrates obtaining a Response from fetch() and checking its status
 * before reading its body.
 */
export const FetchResponseFetchExample: FC<FetchResponseFetchProps> = ({ url }: FetchResponseFetchProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request not started.");

  const handleFetch = (): void => {
    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url);

        if (!response.ok) {
          setMessage(`HTTP ${response.status}: response is not successful.`);
          return;
        }

        setMessage(`HTTP ${response.status}: response received successfully.`);
      } catch (error: unknown) {
        setMessage("The request failed before a usable Response was received.");
      }
    };

    void load();
  };

  return (
    <section>
      <h3>Response from fetch()</h3>

      <p>{message}</p>

      <button type="button" onClick={handleFetch}>
        Fetch response
      </button>
    </section>
  );
};

/**
 * Demonstrates that HTTP error responses do not normally cause fetch() to
 * reject, so response.ok or response.status must be checked explicitly.
 */
export const FetchResponseErrorExample: FC<FetchResponseErrorProps> = ({ url }: FetchResponseErrorProps): ReactNode => {
  const [message, setMessage] = useState<string>("No response has been received.");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        if (response.ok) {
          setMessage(`HTTP ${response.status}: successful response.`);
          return;
        }

        setMessage(`HTTP ${response.status}: fetch resolved, but the HTTP response indicates an error.`);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("A network or browser-level fetch error occurred.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>HTTP errors versus fetch rejection</h3>

      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchResponseContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch Response</h1>

      <h2>1. Reading the HTTP status</h2>
      <FetchResponseStatusExample status={200} />

      <h2>2. Checking response.ok</h2>
      <FetchResponseOkExample status={404} />

      <h2>3. Reading status text</h2>
      <FetchResponseStatusTextExample status={200} statusText="OK" />

      <h2>4. Reading the response URL</h2>
      <FetchResponseUrlExample url="https://example.com/api/users" />

      <h2>5. Understanding redirect state</h2>
      <FetchResponseRedirectedExample url="https://example.com/api/users" redirected={false} />

      <h2>6. Inspecting response type</h2>
      <FetchResponseTypeExample type="basic" />

      <h2>7. Reading response headers</h2>
      <FetchResponseHeadersExample contentType="application/json" />

      <h2>8. Reading the response body</h2>
      <FetchResponseBodyExample body="Hello from the response body." />

      <h2>9. Tracking response bodyUsed</h2>
      <FetchResponseBodyUsedExample body="Example response content." />

      <h2>10. Cloning a response before consumption</h2>
      <FetchResponseCloneExample body="Example response content." />

      <h2>11. Receiving a Response from fetch()</h2>
      <FetchResponseFetchExample url="https://example.com/api/users" />

      <h2>12. Handling HTTP errors separately from fetch rejection</h2>
      <FetchResponseErrorExample url="https://example.com/api/users" />
    </main>
  );
};

export default FetchResponseContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - fetch() resolves with a Response when an HTTP response is available.
// - Response.status contains the numeric HTTP status code.
// - Response.statusText contains the response status text when provided.
// - Response.ok is true for HTTP status codes from 200 through 299.
// - A 4xx or 5xx HTTP response normally does not cause fetch() to reject.
// - Response.url contains the final response URL for fetch-created responses.
// - Response.redirected indicates whether the response resulted from following redirects.
// - Response.type describes how the browser classified the response.
// - Response.headers exposes response metadata through the Headers interface.
// - Response.text() asynchronously consumes a response body as text.
// - Response bodies are streams and can normally be consumed only once.
// - Response.bodyUsed indicates whether the response body has been consumed.
// - Response.clone() creates a second response whose body can be consumed independently.
// - Network and browser-level failures can reject the fetch Promise.
// - HTTP failures should normally be handled by checking response.ok or response.status.
// - Synthetic Response objects can be created with the Response constructor without a network request.

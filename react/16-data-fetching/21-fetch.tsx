/**
 * Fetch
 * =====
 *
 * The Fetch API is a browser and web-platform interface for making HTTP
 * requests and receiving responses asynchronously. The primary entry point is
 * the global `fetch()` function, which returns a Promise that resolves to a
 * Response object.
 *
 * Calling fetch() starts an HTTP request and returns a Promise immediately.
 * The Promise normally resolves when the response headers have been received,
 * even when the HTTP status represents an error such as 404 or 500. The
 * response body is exposed separately through methods such as `json()`,
 * `text()`, `blob()`, and `arrayBuffer()`, each of which returns a Promise.
 *
 * Because HTTP error status codes do not normally reject the fetch Promise,
 * application code commonly checks `response.ok` or `response.status` before
 * processing the response as successful data. Network failures, malformed
 * requests rejected by the browser, and an AbortController cancellation can
 * instead cause the fetch Promise to reject.
 *
 * Fetch uses Request and Response objects to represent requests and responses.
 * Request configuration can specify the HTTP method, headers, body, credentials,
 * cache behavior, redirect behavior, referrer policy, and an AbortSignal.
 *
 * Fetch is promise-based and integrates naturally with async/await. In React,
 * asynchronous requests commonly run from effects when the request depends on
 * component state or props. An AbortController can cancel an in-flight request
 * when the component unmounts or when a newer request replaces an older one.
 *
 * A successful fetch operation does not imply a successful HTTP operation.
 * The distinction between a fulfilled fetch Promise and an HTTP success status
 * is one of the most important details when handling Fetch API responses.
 */

import { type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchBasicProps {
  readonly url: string;
}

export interface FetchStatusProps {
  readonly url: string;
}

export interface FetchTextProps {
  readonly url: string;
}

export interface FetchJsonProps {
  readonly url: string;
}

export interface FetchMethodProps {
  readonly url: string;
  readonly method: string;
}

export interface FetchHeadersProps {
  readonly url: string;
  readonly headerName: string;
  readonly headerValue: string;
}

export interface FetchPostProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface FetchAbortProps {
  readonly url: string;
}

export interface FetchErrorProps {
  readonly url: string;
}

export interface FetchResponseProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic fetch() Promise lifecycle.
 */
export const FetchBasicExample: FC<FetchBasicProps> = ({ url }: FetchBasicProps): ReactNode => {
  const [status, setStatus] = useState<string>("Request not started");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const request: Request = new Request(url, {
      signal: controller.signal,
    });

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(request);

        setStatus(`Request completed with HTTP ${response.status}`);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setStatus("Request failed before a response was received.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Basic fetch request</h3>

      <p>URL: {url}</p>

      <p>{status}</p>
    </section>
  );
};

/**
 * Demonstrates that fetch resolves for an HTTP response even when the status
 * is outside the successful 2xx range.
 */
export const FetchStatusExample: FC<FetchStatusProps> = ({ url }: FetchStatusProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting for response");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        if (response.ok) {
          setMessage(`HTTP ${response.status}: successful response`);
        } else {
          setMessage(`HTTP ${response.status}: fetch resolved, but the response is not successful`);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("The request failed before an HTTP response was available.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>HTTP status and fetch Promise resolution</h3>

      <p>{message}</p>

      <p>fetch() does not normally reject solely because the server returned a 4xx or 5xx status.</p>
    </section>
  );
};

/**
 * Demonstrates reading a text response with Response.text().
 */
export const FetchTextExample: FC<FetchTextProps> = ({ url }: FetchTextProps): ReactNode => {
  const [text, setText] = useState<string>("Waiting for text response");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setText(`HTTP error: ${response.status}`);
          return;
        }

        const responseText: string = await response.text();

        setText(responseText);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setText("Unable to retrieve the text response.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Reading a text response</h3>

      <p>{text}</p>
    </section>
  );
};

/**
 * Demonstrates parsing a JSON response with Response.json().
 */
export const FetchJsonExample: FC<FetchJsonProps> = ({ url }: FetchJsonProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting for JSON response");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setMessage(`HTTP error: ${response.status}`);
          return;
        }

        const data: unknown = await response.json();

        if (typeof data === "object" && data !== null) {
          setMessage("JSON response parsed successfully.");
        } else {
          setMessage("JSON response is a primitive value.");
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("Unable to parse the JSON response.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Reading a JSON response</h3>

      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates selecting an HTTP method through the Request configuration.
 */
export const FetchMethodExample: FC<FetchMethodProps> = ({ url, method }: FetchMethodProps): ReactNode => {
  const request: Request = new Request(url, {
    method,
  });

  return (
    <section>
      <h3>Configuring the HTTP method</h3>

      <p>Method: {request.method}</p>

      <p>URL: {request.url}</p>
    </section>
  );
};

/**
 * Demonstrates adding a custom request header through the Headers API.
 */
export const FetchHeadersExample: FC<FetchHeadersProps> = ({
  url,
  headerName,
  headerValue,
}: FetchHeadersProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(headerName, headerValue);

  const request: Request = new Request(url, {
    headers,
  });

  const configuredValue: string | null = request.headers.get(headerName);

  return (
    <section>
      <h3>Configuring request headers</h3>

      <p>URL: {request.url}</p>

      <p>
        {headerName}: {configuredValue ?? "Not set"}
      </p>
    </section>
  );
};

/**
 * Demonstrates sending a JSON request body with fetch().
 */
export const FetchPostExample: FC<FetchPostProps> = ({ url, name, email }: FetchPostProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request not sent");

  const handleSend = (): void => {
    const body: string = JSON.stringify({
      name,
      email,
    });

    const controller: AbortController = new AbortController();

    const send: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
          signal: controller.signal,
        });

        setMessage(`Server returned HTTP ${response.status}.`);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("The request failed.");
      }
    };

    void send();
  };

  return (
    <section>
      <h3>Sending a JSON request body</h3>

      <p>{message}</p>

      <button type="button" onClick={handleSend}>
        Send JSON request
      </button>
    </section>
  );
};

/**
 * Demonstrates cancelling an in-flight fetch request with AbortController.
 */
export const FetchAbortExample: FC<FetchAbortProps> = ({ url }: FetchAbortProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request is idle");

  const handleStart = (): void => {
    const controller: AbortController = new AbortController();

    setMessage("Request started.");

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        await fetch(url, {
          signal: controller.signal,
        });

        setMessage("Request completed.");
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setMessage("Request was aborted.");
          return;
        }

        setMessage("Request failed.");
      }
    };

    void load();

    controller.abort();
  };

  return (
    <section>
      <h3>Aborting a fetch request</h3>

      <p>{message}</p>

      <button type="button" onClick={handleStart}>
        Start and abort request
      </button>
    </section>
  );
};

/**
 * Demonstrates the Response object returned by fetch() and its common
 * metadata properties.
 */
export const FetchResponseExample: FC<FetchResponseProps> = ({ url }: FetchResponseProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting for response");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        const description: string = `status=${response.status}, ok=${response.ok}, redirected=${response.redirected}`;

        setMessage(description);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("Unable to obtain a Response object.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Inspecting a Fetch Response</h3>

      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch API</h1>

      <h2>1. Making a basic fetch request</h2>
      <FetchBasicExample url="https://example.com/api/users" />

      <h2>2. Handling HTTP status codes</h2>
      <FetchStatusExample url="https://example.com/api/users" />

      <h2>3. Reading a text response</h2>
      <FetchTextExample url="https://example.com/api/message" />

      <h2>4. Parsing a JSON response</h2>
      <FetchJsonExample url="https://example.com/api/users" />

      <h2>5. Configuring an HTTP method</h2>
      <FetchMethodExample url="https://example.com/api/users" method="GET" />

      <h2>6. Configuring request headers</h2>
      <FetchHeadersExample url="https://example.com/api/users" headerName="X-Example-Header" headerValue="example" />

      <h2>7. Sending a JSON request body</h2>
      <FetchPostExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>8. Cancelling a fetch request</h2>
      <FetchAbortExample url="https://example.com/api/users" />

      <h2>9. Inspecting the Response object</h2>
      <FetchResponseExample url="https://example.com/api/users" />
    </main>
  );
};

export default FetchContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - fetch() is a promise-based API for making HTTP requests.
// - fetch() resolves with a Response object when an HTTP response is available.
// - HTTP 4xx and 5xx statuses do not normally reject the fetch Promise.
// - response.ok can be used to identify HTTP statuses in the successful 2xx range.
// - Response.text() reads a response body as text.
// - Response.json() asynchronously parses a response body as JSON.
// - Request configuration can specify methods, headers, bodies, credentials, and signals.
// - Headers can be configured with the Headers API or compatible header objects.
// - JSON request bodies should normally be serialized with JSON.stringify() and paired with an application/json Content-Type.
// - AbortController can cancel an in-flight fetch request through its AbortSignal.
// - Aborted fetch requests reject with an AbortError.
// - Response body methods consume the response body and return Promises.
// - A Response object contains metadata such as status, ok, url, headers, and redirected.
// - A successful fetch operation and a successful HTTP operation are separate concepts.

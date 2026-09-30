/**
 * XMLHttpRequest (XHR)
 * =====================
 *
 * XMLHttpRequest is a browser API for creating and controlling HTTP requests
 * from JavaScript. Despite its name, XMLHttpRequest is not limited to XML and
 * can retrieve text, JSON, binary data, or other response formats.
 *
 * An XMLHttpRequest instance progresses through a request lifecycle. Code
 * creates the object, opens it with a method and URL, optionally configures
 * headers and other properties, registers event handlers, and calls send().
 * The browser then performs the network operation asynchronously unless the
 * request has explicitly been configured as synchronous.
 *
 * The `readyState` property represents the request lifecycle:
 * 0 means UNSENT, 1 means OPENED, 2 means HEADERS_RECEIVED, 3 means
 * LOADING, and 4 means DONE. The `readystatechange` event can be used to
 * observe these transitions.
 *
 * HTTP completion is represented by the `load` event, while failures,
 * explicit aborts, and timeouts have separate events. An HTTP error status
 * such as 404 or 500 does not inherently cause the XHR `error` event;
 * the request can complete normally and expose that HTTP status through
 * `status`.
 *
 * XMLHttpRequest also supports request and response headers, response type
 * selection, progress events, request cancellation, credentials, and upload
 * progress. These capabilities make XHR more event-oriented than the
 * promise-based Fetch API.
 *
 * XHR is still part of the browser platform, but new application code commonly
 * prefers Fetch for straightforward HTTP operations. XHR remains useful when
 * an application specifically needs its event model, upload progress, or
 * other XHR-specific capabilities.
 */

import { type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface XhrBasicProps {
  readonly url: string;
}

export interface XhrReadyStateProps {
  readonly url: string;
}

export interface XhrStatusProps {
  readonly url: string;
}

export interface XhrJsonProps {
  readonly url: string;
}

export interface XhrHeadersProps {
  readonly url: string;
}

export interface XhrAbortProps {
  readonly url: string;
}

export interface XhrTimeoutProps {
  readonly url: string;
  readonly timeoutMs: number;
}

export interface XhrPostProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface XhrLifecycleProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic XMLHttpRequest lifecycle: create, open, listen,
 * and send.
 */
export const XhrBasicExample: FC<XhrBasicProps> = ({ url }: XhrBasicProps): ReactNode => {
  const [status, setStatus] = useState<string>("Not started");

  useEffect((): (() => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const handleLoad = (): void => {
      setStatus(`Completed with HTTP status ${xhr.status}`);
    };

    const handleError = (): void => {
      setStatus("Network error");
    };

    xhr.addEventListener("load", handleLoad);

    xhr.addEventListener("error", handleError);

    xhr.open("GET", url);

    xhr.send();

    return (): void => {
      xhr.removeEventListener("load", handleLoad);

      xhr.removeEventListener("error", handleError);

      xhr.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Basic XMLHttpRequest</h3>

      <p>URL: {url}</p>

      <p>Status: {status}</p>
    </section>
  );
};

/**
 * Demonstrates the five XMLHttpRequest readyState values and their meaning.
 */
export const XhrReadyStateExample: FC<XhrReadyStateProps> = ({ url }: XhrReadyStateProps): ReactNode => {
  const [readyState, setReadyState] = useState<number>(XMLHttpRequest.UNSENT);

  useEffect((): (() => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const handleReadyStateChange = (): void => {
      setReadyState(xhr.readyState);
    };

    xhr.addEventListener("readystatechange", handleReadyStateChange);

    xhr.open("GET", url);

    xhr.send();

    return (): void => {
      xhr.removeEventListener("readystatechange", handleReadyStateChange);

      xhr.abort();
    };
  }, [url]);

  const stateNames: Record<number, string> = {
    [XMLHttpRequest.UNSENT]: "UNSENT (0)",
    [XMLHttpRequest.OPENED]: "OPENED (1)",
    [XMLHttpRequest.HEADERS_RECEIVED]: "HEADERS_RECEIVED (2)",
    [XMLHttpRequest.LOADING]: "LOADING (3)",
    [XMLHttpRequest.DONE]: "DONE (4)",
  };

  return (
    <section>
      <h3>XHR readyState</h3>

      <p>Current state: {stateNames[readyState] ?? `Unknown (${readyState})`}</p>
    </section>
  );
};

/**
 * Demonstrates that an HTTP error status is exposed through status rather
 * than automatically being treated as an XHR network error.
 */
export const XhrStatusExample: FC<XhrStatusProps> = ({ url }: XhrStatusProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting for response");

  useEffect((): (() => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const handleLoad = (): void => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setMessage(`Success: HTTP ${xhr.status}`);
        return;
      }

      setMessage(`HTTP response received: ${xhr.status}`);
    };

    const handleError = (): void => {
      setMessage("The browser reported a network error.");
    };

    xhr.addEventListener("load", handleLoad);

    xhr.addEventListener("error", handleError);

    xhr.open("GET", url);

    xhr.send();

    return (): void => {
      xhr.removeEventListener("load", handleLoad);

      xhr.removeEventListener("error", handleError);

      xhr.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>HTTP status versus network error</h3>

      <p>{message}</p>

      <p>An HTTP 4xx or 5xx response can still complete normally as an XHR operation.</p>
    </section>
  );
};

/**
 * Demonstrates requesting JSON by setting responseType before sending the
 * XMLHttpRequest.
 */
export const XhrJsonExample: FC<XhrJsonProps> = ({ url }: XhrJsonProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting for JSON");

  useEffect((): (() => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const handleLoad = (): void => {
      if (xhr.status < 200 || xhr.status >= 300) {
        setMessage(`HTTP error: ${xhr.status}`);
        return;
      }

      const response: unknown = xhr.response;

      if (typeof response === "object" && response !== null) {
        setMessage("Received a JSON object.");
        return;
      }

      setMessage("Received JSON that is not an object.");
    };

    const handleError = (): void => {
      setMessage("Network error while requesting JSON.");
    };

    xhr.addEventListener("load", handleLoad);

    xhr.addEventListener("error", handleError);

    xhr.open("GET", url);

    xhr.responseType = "json";

    xhr.send();

    return (): void => {
      xhr.removeEventListener("load", handleLoad);

      xhr.removeEventListener("error", handleError);

      xhr.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>JSON responseType</h3>

      <p>{message}</p>

      <p>`responseType = "json"` lets the browser parse a JSON response for the XHR object.</p>
    </section>
  );
};

/**
 * Demonstrates reading response headers after the server has supplied them.
 */
export const XhrHeadersExample: FC<XhrHeadersProps> = ({ url }: XhrHeadersProps): ReactNode => {
  const [contentType, setContentType] = useState<string>("Waiting for response");

  useEffect((): (() => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const handleLoad = (): void => {
      const headerValue: string | null = xhr.getResponseHeader("Content-Type");

      setContentType(headerValue ?? "Content-Type was not exposed");
    };

    const handleError = (): void => {
      setContentType("Unable to read response headers.");
    };

    xhr.addEventListener("load", handleLoad);

    xhr.addEventListener("error", handleError);

    xhr.open("GET", url);

    xhr.send();

    return (): void => {
      xhr.removeEventListener("load", handleLoad);

      xhr.removeEventListener("error", handleError);

      xhr.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Response headers</h3>

      <p>Content-Type: {contentType}</p>

      <p>Response headers are available after the response headers have been received.</p>
    </section>
  );
};

/**
 * Demonstrates cancelling an active XMLHttpRequest with abort().
 */
export const XhrAbortExample: FC<XhrAbortProps> = ({ url }: XhrAbortProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request is idle");

  const handleAbort = (): void => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    xhr.open("GET", url);

    xhr.addEventListener("abort", (): void => {
      setMessage("Request aborted.");
    });

    xhr.send();

    setMessage("Request started, but this example creates a new request for the abort action.");

    xhr.abort();
  };

  return (
    <section>
      <h3>Aborting an XHR request</h3>

      <p>{message}</p>

      <button type="button" onClick={handleAbort}>
        Start and abort request
      </button>
    </section>
  );
};

/**
 * Demonstrates the timeout property and timeout event for an XMLHttpRequest.
 */
export const XhrTimeoutExample: FC<XhrTimeoutProps> = ({ url, timeoutMs }: XhrTimeoutProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request is idle");

  const handleRequest = (): void => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    xhr.timeout = timeoutMs;

    xhr.addEventListener("load", (): void => {
      setMessage(`Completed with HTTP status ${xhr.status}`);
    });

    xhr.addEventListener("timeout", (): void => {
      setMessage(`Request timed out after ${timeoutMs} ms.`);
    });

    xhr.addEventListener("error", (): void => {
      setMessage("Network error.");
    });

    xhr.open("GET", url);

    xhr.send();

    setMessage(`Request started with a ${timeoutMs} ms timeout.`);
  };

  return (
    <section>
      <h3>XHR timeout</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRequest}>
        Send request
      </button>
    </section>
  );
};

/**
 * Demonstrates sending a URL-encoded form body with XMLHttpRequest.
 */
export const XhrPostExample: FC<XhrPostProps> = ({ url, name, email }: XhrPostProps): ReactNode => {
  const [message, setMessage] = useState<string>("Form not submitted");

  const handleSubmit = (): void => {
    const body: URLSearchParams = new URLSearchParams();

    body.set("name", name);

    body.set("email", email);

    const xhr: XMLHttpRequest = new XMLHttpRequest();

    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");

    xhr.addEventListener("load", (): void => {
      setMessage(`Server returned HTTP ${xhr.status}.`);
    });

    xhr.addEventListener("error", (): void => {
      setMessage("Network error.");
    });

    xhr.send(body.toString());

    setMessage("Form submission started.");
  };

  return (
    <section>
      <h3>Sending a request body</h3>

      <p>{message}</p>

      <button type="button" onClick={handleSubmit}>
        Submit form
      </button>
    </section>
  );
};

/**
 * Demonstrates the complete event-oriented lifecycle of an XMLHttpRequest.
 */
export const XhrLifecycleExample: FC<XhrLifecycleProps> = ({ url }: XhrLifecycleProps): ReactNode => {
  const [events, setEvents] = useState<readonly string[]>([]);

  useEffect((): (() => void) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();

    const appendEvent = (eventName: string): void => {
      setEvents((previousEvents: readonly string[]): readonly string[] => [...previousEvents, eventName]);
    };

    const handleReadyStateChange = (): void => {
      appendEvent(`readystatechange:${xhr.readyState}`);
    };

    const handleLoad = (): void => {
      appendEvent("load");
    };

    const handleError = (): void => {
      appendEvent("error");
    };

    xhr.addEventListener("readystatechange", handleReadyStateChange);

    xhr.addEventListener("load", handleLoad);

    xhr.addEventListener("error", handleError);

    xhr.open("GET", url);

    xhr.send();

    return (): void => {
      xhr.removeEventListener("readystatechange", handleReadyStateChange);

      xhr.removeEventListener("load", handleLoad);

      xhr.removeEventListener("error", handleError);

      xhr.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>XHR request lifecycle</h3>

      <ol>
        {events.map((event: string, index: number): ReactNode => (
          <li key={`${event}-${index}`}>{event}</li>
        ))}
      </ol>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const XhrContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>XMLHttpRequest</h1>

      <h2>1. Creating and sending an XHR request</h2>
      <XhrBasicExample url="https://example.com/api/users" />

      <h2>2. Observing the XHR readyState</h2>
      <XhrReadyStateExample url="https://example.com/api/users" />

      <h2>3. Distinguishing HTTP status from network errors</h2>
      <XhrStatusExample url="https://example.com/api/users" />

      <h2>4. Receiving JSON with responseType</h2>
      <XhrJsonExample url="https://example.com/api/users" />

      <h2>5. Reading response headers</h2>
      <XhrHeadersExample url="https://example.com/api/users" />

      <h2>6. Aborting an XMLHttpRequest</h2>
      <XhrAbortExample url="https://example.com/api/users" />

      <h2>7. Applying an XHR timeout</h2>
      <XhrTimeoutExample url="https://example.com/api/users" timeoutMs={5000} />

      <h2>8. Sending a URL-encoded request body</h2>
      <XhrPostExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>9. Observing the XHR event lifecycle</h2>
      <XhrLifecycleExample url="https://example.com/api/users" />
    </main>
  );
};

export default XhrContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - XMLHttpRequest is a browser API for creating and controlling HTTP requests.
// - XHR is not limited to XML and can handle text, JSON, binary data, and other response formats.
// - A request is created with XMLHttpRequest, configured with open(), and started with send().
// - readyState progresses through UNSENT, OPENED, HEADERS_RECEIVED, LOADING, and DONE.
// - The load event indicates that the HTTP operation completed successfully at the XHR transport level.
// - HTTP 4xx and 5xx responses do not automatically trigger the XHR error event.
// - HTTP status codes should be inspected separately from network-level failures.
// - responseType can request browser-managed response representations such as JSON.
// - Response headers can be read with getResponseHeader() after response headers are available.
// - abort() cancels an active XHR and produces the abort event.
// - timeout specifies a request time limit and produces the timeout event when exceeded.
// - Request headers are configured with setRequestHeader() after open() and before send().
// - URLSearchParams can be serialized for an application/x-www-form-urlencoded request body.
// - Event listeners should be removed and active requests aborted when a React component unmounts.
// - XHR's event-driven API differs from the promise-based Fetch API.

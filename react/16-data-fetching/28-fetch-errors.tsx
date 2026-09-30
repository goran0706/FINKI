/**
 * Fetch Errors
 * ============
 *
 * The Fetch API reports different failure conditions through different
 * mechanisms. A failed HTTP status such as 404 or 500 normally does not cause
 * fetch() to reject. Instead, fetch() resolves with a Response whose `ok`
 * property is false and whose `status` contains the HTTP status code.
 *
 * Network-level failures, malformed request URLs, blocked requests, and other
 * browser-level failures can cause the Promise returned by fetch() to reject.
 * These failures are normally handled with try/catch around an awaited fetch()
 * call.
 *
 * Response-body parsing is a separate failure point. For example,
 * response.json() can reject when the response body is not valid JSON, even
 * though fetch() itself succeeded and returned a Response.
 *
 * AbortController provides another intentional rejection path. Calling
 * controller.abort() causes an associated fetch() operation to reject with a
 * DOMException whose name is typically `AbortError`.
 *
 * Because JavaScript catch clauses can contain values of any type, robust
 * TypeScript code should use `unknown` for caught errors and narrow the value
 * before reading properties from it. Error and DOMException provide standard
 * properties for common JavaScript and browser errors.
 *
 * A useful error-handling flow therefore separates transport failures,
 * HTTP-status failures, body-parsing failures, and intentional cancellation.
 * Treating every failed request as the same kind of error can hide important
 * information needed by the user interface or recovery logic.
 */

import { type FC, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchNetworkErrorProps {
  readonly url: string;
}

export interface FetchHttpErrorProps {
  readonly status: number;
  readonly statusText: string;
}

export interface FetchJsonParseErrorProps {
  readonly body: string;
}

export interface FetchAbortErrorProps {
  readonly url: string;
}

export interface FetchUnknownErrorProps {
  readonly error: unknown;
}

export interface FetchErrorClassificationProps {
  readonly error: unknown;
}

export interface FetchSafeRequestProps {
  readonly url: string;
}

export interface FetchResponseErrorProps {
  readonly status: number;
}

export interface FetchErrorStateProps {
  readonly initialMessage: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates handling a fetch rejection caused by an invalid request URL.
 */
export const FetchNetworkErrorExample: FC<FetchNetworkErrorProps> = ({ url }: FetchNetworkErrorProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been made.");

  const handleRequest = (): void => {
    const request: () => Promise<void> = async (): Promise<void> => {
      try {
        await fetch(url);

        setMessage("The request completed without a fetch rejection.");
      } catch (error: unknown) {
        if (error instanceof TypeError) {
          setMessage("fetch() rejected with a TypeError.");
          return;
        }

        setMessage("fetch() rejected with an unexpected error.");
      }
    };

    void request();
  };

  return (
    <section>
      <h3>Network and browser-level errors</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRequest}>
        Fetch URL
      </button>
    </section>
  );
};

/**
 * Demonstrates that an HTTP error status is represented by Response rather
 * than by a rejected fetch Promise.
 */
export const FetchHttpErrorExample: FC<FetchHttpErrorProps> = ({
  status,
  statusText,
}: FetchHttpErrorProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
    statusText,
  });

  return (
    <section>
      <h3>HTTP status errors</h3>

      <p>Status: {response.status}</p>

      <p>Status text: {response.statusText}</p>

      <p>response.ok: {response.ok ? "true" : "false"}</p>

      <p>HTTP 4xx and 5xx responses normally resolve through fetch() and must be checked explicitly.</p>
    </section>
  );
};

/**
 * Demonstrates handling invalid JSON after fetch() has already produced a
 * successful Response.
 */
export const FetchJsonParseErrorExample: FC<FetchJsonParseErrorProps> = ({
  body,
}: FetchJsonParseErrorProps): ReactNode => {
  const [message, setMessage] = useState<string>("The response body has not been parsed.");

  const handleParse = (): void => {
    const response: Response = new Response(body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        const data: unknown = await response.json();

        setMessage(`Parsed JSON: ${JSON.stringify(data)}`);
      } catch (error: unknown) {
        if (error instanceof SyntaxError) {
          setMessage("The response body is not valid JSON.");
          return;
        }

        setMessage("The response body could not be parsed.");
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>JSON parsing errors</h3>

      <p>{message}</p>

      <button type="button" onClick={handleParse}>
        Parse response JSON
      </button>
    </section>
  );
};

/**
 * Demonstrates identifying an intentionally aborted fetch operation.
 */
export const FetchAbortErrorExample: FC<FetchAbortErrorProps> = ({ url }: FetchAbortErrorProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request has not started.");

  const handleAbort = (): void => {
    const controller: AbortController = new AbortController();

    const request: () => Promise<void> = async (): Promise<void> => {
      try {
        setMessage("Request started.");

        await fetch(url, {
          signal: controller.signal,
        });

        setMessage("Request completed.");
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setMessage("Request was intentionally aborted.");
          return;
        }

        setMessage("Request failed for another reason.");
      }
    };

    void request();

    controller.abort();
  };

  return (
    <section>
      <h3>Abort errors</h3>

      <p>{message}</p>

      <button type="button" onClick={handleAbort}>
        Start and abort request
      </button>
    </section>
  );
};

/**
 * Demonstrates safely handling an unknown value from a catch clause.
 */
export const FetchUnknownErrorExample: FC<FetchUnknownErrorProps> = ({ error }: FetchUnknownErrorProps): ReactNode => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Unknown error value";
  }

  return (
    <section>
      <h3>Narrowing unknown errors</h3>

      <p>{message}</p>

      <p>Catch variables should be treated as unknown until their runtime type has been established.</p>
    </section>
  );
};

/**
 * Demonstrates classifying common fetch-related errors without assuming that
 * every rejected operation represents the same failure.
 */
export const FetchErrorClassificationExample: FC<FetchErrorClassificationProps> = ({
  error,
}: FetchErrorClassificationProps): ReactNode => {
  let category: string;

  if (error instanceof DOMException && error.name === "AbortError") {
    category = "Request cancellation";
  } else if (error instanceof SyntaxError) {
    category = "Response parsing failure";
  } else if (error instanceof TypeError) {
    category = "Network or request failure";
  } else if (error instanceof Error) {
    category = "General JavaScript error";
  } else {
    category = "Unknown error value";
  }

  return (
    <section>
      <h3>Classifying rejected operations</h3>

      <p>Category: {category}</p>
    </section>
  );
};

/**
 * Demonstrates a request function that separates HTTP errors from rejected
 * fetch operations and returns only successful responses.
 */
export const FetchSafeRequestExample: FC<FetchSafeRequestProps> = ({ url }: FetchSafeRequestProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been made.");

  const handleRequest = (): void => {
    const request: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url);

        if (!response.ok) {
          setMessage(`HTTP error: ${response.status}`);
          return;
        }

        setMessage(`Request succeeded with HTTP ${response.status}.`);
      } catch (error: unknown) {
        if (error instanceof TypeError) {
          setMessage("The request failed before a usable response was received.");
          return;
        }

        setMessage("The request failed unexpectedly.");
      }
    };

    void request();
  };

  return (
    <section>
      <h3>Separating HTTP and fetch errors</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRequest}>
        Make request
      </button>
    </section>
  );
};

/**
 * Demonstrates explicitly checking a synthetic Response for an HTTP failure
 * before processing its body.
 */
export const FetchResponseErrorExample: FC<FetchResponseErrorProps> = ({
  status,
}: FetchResponseErrorProps): ReactNode => {
  const response: Response = new Response(
    JSON.stringify({
      message: "Example response",
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const message: string = response.ok
    ? "The response has a successful HTTP status."
    : `The response has HTTP status ${response.status}.`;

  return (
    <section>
      <h3>Checking response.ok</h3>

      <p>{message}</p>

      <p>Checking response.ok makes HTTP-status handling explicit before the response body is processed.</p>
    </section>
  );
};

/**
 * Demonstrates storing a request error as UI state so an error message can be
 * rendered separately from the loading and success paths.
 */
export const FetchErrorStateExample: FC<FetchErrorStateProps> = ({
  initialMessage,
}: FetchErrorStateProps): ReactNode => {
  const [errorMessage, setErrorMessage] = useState<string | null>(initialMessage);

  const clearError = (): void => {
    setErrorMessage(null);
  };

  return (
    <section>
      <h3>Error state</h3>

      {errorMessage === null ? <p>No error is currently stored.</p> : <p>Error: {errorMessage}</p>}

      <button type="button" onClick={clearError}>
        Clear error
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchErrorsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch Errors</h1>

      <h2>1. Handling fetch rejections</h2>
      <FetchNetworkErrorExample url="https://" />

      <h2>2. Handling HTTP error statuses</h2>
      <FetchHttpErrorExample status={404} statusText="Not Found" />

      <h2>3. Handling invalid JSON</h2>
      <FetchJsonParseErrorExample body='{"message":"Example"' />

      <h2>4. Handling request cancellation</h2>
      <FetchAbortErrorExample url="https://example.com/api/users" />

      <h2>5. Narrowing unknown caught errors</h2>
      <FetchUnknownErrorExample error={new Error("Example request failure")} />

      <h2>6. Classifying different error types</h2>
      <FetchErrorClassificationExample error={new DOMException("The request was aborted.", "AbortError")} />

      <h2>7. Separating HTTP errors from fetch failures</h2>
      <FetchSafeRequestExample url="https://example.com/api/users" />

      <h2>8. Checking response.ok before processing a response</h2>
      <FetchResponseErrorExample status={500} />

      <h2>9. Representing errors as UI state</h2>
      <FetchErrorStateExample initialMessage="Example request error" />
    </main>
  );
};

export default FetchErrorsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - fetch() rejects for network-level and browser-level request failures.
// - HTTP 4xx and 5xx responses normally resolve as Response objects.
// - response.ok and response.status should be checked for HTTP failures.
// - Response-body parsing is a separate operation that can fail independently.
// - response.json() can reject when the response body contains invalid JSON.
// - AbortController cancellation normally causes fetch() to reject with an AbortError.
// - Catch variables should be treated as unknown and narrowed before their properties are accessed.
// - TypeError commonly represents browser-level fetch failures such as network or request problems.
// - SyntaxError can identify malformed JSON during JSON parsing.
// - DOMException with the AbortError name identifies an intentionally aborted fetch.
// - HTTP errors, transport errors, parsing errors, and cancellation can require different UI behavior.
// - Error state can be represented separately from loading and successful response state.

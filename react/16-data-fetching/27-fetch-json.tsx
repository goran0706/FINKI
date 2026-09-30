/**
 * Fetch JSON
 * ==========
 *
 * JSON is a text-based data format commonly used for HTTP request and
 * response bodies. The Fetch API provides `Response.json()` for asynchronously
 * reading a response body and parsing it as JSON.
 *
 * `response.json()` consumes the response body and returns a Promise that
 * resolves with the parsed JavaScript value. The parsed value is not
 * automatically given a specific application type at runtime, so TypeScript
 * type assertions or runtime validation may be needed when application code
 * depends on a particular JSON shape.
 *
 * A JSON request body is different from a JSON response body. To send JSON,
 * application code normally converts a JavaScript value with
 * `JSON.stringify()` and supplies `Content-Type: application/json`. To receive
 * JSON, application code normally checks the HTTP response and then calls
 * `response.json()`.
 *
 * `response.json()` can reject when the body cannot be parsed as valid JSON.
 * An HTTP error status does not itself cause `response.json()` or `fetch()` to
 * reject, so applications commonly check `response.ok` before parsing an
 * expected successful response.
 *
 * JSON values can be objects, arrays, strings, numbers, booleans, or null.
 * TypeScript interfaces describe expected object shapes at compile time but do
 * not validate untrusted JSON at runtime.
 */

import { type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchJsonResponseProps {
  readonly url: string;
}

export interface FetchJsonObjectProps {
  readonly body: string;
}

export interface FetchJsonArrayProps {
  readonly body: string;
}

export interface FetchJsonPrimitiveProps {
  readonly body: string;
}

export interface FetchJsonTypedProps {
  readonly body: string;
}

export interface FetchJsonInvalidProps {
  readonly body: string;
}

export interface FetchJsonHttpErrorProps {
  readonly status: number;
}

export interface FetchJsonRequestProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface FetchJsonContentTypeProps {
  readonly contentType: string;
  readonly body: string;
}

export interface FetchJsonBodyUsedProps {
  readonly body: string;
}

interface ExampleUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates parsing a JSON response body with Response.json().
 */
export const FetchJsonResponseExample: FC<FetchJsonResponseProps> = ({ url }: FetchJsonResponseProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting for the response.");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setMessage(`HTTP ${response.status}`);
          return;
        }

        const data: unknown = await response.json();

        setMessage(JSON.stringify(data, null, 2));
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("The response could not be fetched or parsed as JSON.");
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <h3>Parsing JSON with response.json()</h3>

      <p>URL: {url}</p>

      <pre>{message}</pre>
    </section>
  );
};

/**
 * Demonstrates parsing a JSON object from a synthetic Response.
 */
export const FetchJsonObjectExample: FC<FetchJsonObjectProps> = ({ body }: FetchJsonObjectProps): ReactNode => {
  const [message, setMessage] = useState<string>("JSON has not been parsed.");

  const handleParse = (): void => {
    const response: Response = new Response(body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        const data: unknown = await response.json();

        setMessage(JSON.stringify(data, null, 2));
      } catch (error: unknown) {
        setMessage("The response did not contain valid JSON.");
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>Parsing a JSON object</h3>

      <pre>{message}</pre>

      <button type="button" onClick={handleParse}>
        Parse JSON object
      </button>
    </section>
  );
};

/**
 * Demonstrates that JSON responses can contain arrays rather than objects.
 */
export const FetchJsonArrayExample: FC<FetchJsonArrayProps> = ({ body }: FetchJsonArrayProps): ReactNode => {
  const [items, setItems] = useState<readonly unknown[]>([]);

  const handleParse = (): void => {
    const response: Response = new Response(body);

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          setItems([]);
          return;
        }

        setItems(data);
      } catch (error: unknown) {
        setItems([]);
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>Parsing a JSON array</h3>

      <p>Items parsed: {items.length}</p>

      <ul>
        {items.map((item: unknown, index: number): ReactNode => (
          <li key={index}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
        ))}
      </ul>

      <button type="button" onClick={handleParse}>
        Parse JSON array
      </button>
    </section>
  );
};

/**
 * Demonstrates that JSON can represent primitive values as well as objects
 * and arrays.
 */
export const FetchJsonPrimitiveExample: FC<FetchJsonPrimitiveProps> = ({
  body,
}: FetchJsonPrimitiveProps): ReactNode => {
  const [value, setValue] = useState<unknown>(undefined);

  const handleParse = (): void => {
    const response: Response = new Response(body);

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        const data: unknown = await response.json();

        setValue(data);
      } catch (error: unknown) {
        setValue(undefined);
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>Parsing a JSON primitive</h3>

      <p>Parsed value: {value === undefined ? "Not parsed" : JSON.stringify(value)}</p>

      <button type="button" onClick={handleParse}>
        Parse primitive
      </button>
    </section>
  );
};

/**
 * Demonstrates using an expected TypeScript type after JSON parsing.
 */
export const FetchJsonTypedExample: FC<FetchJsonTypedProps> = ({ body }: FetchJsonTypedProps): ReactNode => {
  const [user, setUser] = useState<ExampleUser | null>(null);

  const handleParse = (): void => {
    const response: Response = new Response(body);

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        const data: unknown = await response.json();

        const typedUser: ExampleUser = data as ExampleUser;

        setUser(typedUser);
      } catch (error: unknown) {
        setUser(null);
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>Typing parsed JSON</h3>

      {user === null ? (
        <p>No user has been parsed.</p>
      ) : (
        <>
          <p>ID: {user.id}</p>

          <p>Name: {user.name}</p>

          <p>Email: {user.email}</p>
        </>
      )}

      <button type="button" onClick={handleParse}>
        Parse typed user
      </button>

      <p>A TypeScript assertion describes an expected shape but does not validate untrusted JSON at runtime.</p>
    </section>
  );
};

/**
 * Demonstrates handling malformed JSON when response.json() cannot parse the
 * response body.
 */
export const FetchJsonInvalidExample: FC<FetchJsonInvalidProps> = ({ body }: FetchJsonInvalidProps): ReactNode => {
  const [message, setMessage] = useState<string>("JSON has not been parsed.");

  const handleParse = (): void => {
    const response: Response = new Response(body);

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        await response.json();

        setMessage("The body was valid JSON.");
      } catch (error: unknown) {
        if (error instanceof SyntaxError) {
          setMessage("The body is not valid JSON.");
          return;
        }

        setMessage("The response body could not be parsed.");
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>Handling invalid JSON</h3>

      <p>{message}</p>

      <button type="button" onClick={handleParse}>
        Parse invalid JSON
      </button>
    </section>
  );
};

/**
 * Demonstrates that an HTTP error status is separate from JSON parsing.
 */
export const FetchJsonHttpErrorExample: FC<FetchJsonHttpErrorProps> = ({
  status,
}: FetchJsonHttpErrorProps): ReactNode => {
  const response: Response = new Response(
    JSON.stringify({
      message: "Example error",
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const statusMessage: string = response.ok ? "HTTP response is successful." : "HTTP response is an error.";

  return (
    <section>
      <h3>HTTP status versus JSON parsing</h3>

      <p>HTTP status: {response.status}</p>

      <p>{statusMessage}</p>

      <p>JSON parsing is a separate operation and can still succeed for an error response.</p>
    </section>
  );
};

/**
 * Demonstrates serializing a JavaScript object before sending it as JSON.
 */
export const FetchJsonRequestExample: FC<FetchJsonRequestProps> = ({
  url,
  name,
  email,
}: FetchJsonRequestProps): ReactNode => {
  const data: ExampleUser = {
    id: 1,
    name,
    email,
  };

  const body: string = JSON.stringify(data);

  const request: Request = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>Sending JSON with fetch()</h3>

      <p>Method: {request.method}</p>

      <p>Content-Type: {request.headers.get("Content-Type") ?? "Not set"}</p>

      <pre>{body}</pre>
    </section>
  );
};

/**
 * Demonstrates that response.json() parses the body based on JSON syntax and
 * does not itself require the response Content-Type header to be checked first.
 */
export const FetchJsonContentTypeExample: FC<FetchJsonContentTypeProps> = ({
  contentType,
  body,
}: FetchJsonContentTypeProps): ReactNode => {
  const [message, setMessage] = useState<string>("Body has not been parsed.");

  const handleParse = (): void => {
    const response: Response = new Response(body, {
      headers: {
        "Content-Type": contentType,
      },
    });

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        const data: unknown = await response.json();

        setMessage(`Parsed value: ${JSON.stringify(data)}`);
      } catch (error: unknown) {
        setMessage("The body was not valid JSON.");
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>JSON and Content-Type</h3>

      <p>Content-Type: {contentType}</p>

      <p>{message}</p>

      <button type="button" onClick={handleParse}>
        Parse response
      </button>

      <p>
        response.json() performs JSON parsing of the response body. Applications can separately inspect Content-Type
        when their API contract requires it.
      </p>
    </section>
  );
};

/**
 * Demonstrates that response.json() consumes the response body.
 */
export const FetchJsonBodyUsedExample: FC<FetchJsonBodyUsedProps> = ({ body }: FetchJsonBodyUsedProps): ReactNode => {
  const [message, setMessage] = useState<string>("The response body has not been consumed.");

  const handleParse = (): void => {
    const response: Response = new Response(body);

    const parse: () => Promise<void> = async (): Promise<void> => {
      try {
        await response.json();

        setMessage(response.bodyUsed ? "response.json() consumed the body." : "The body is still unused.");
      } catch (error: unknown) {
        setMessage("The response body could not be parsed.");
      }
    };

    void parse();
  };

  return (
    <section>
      <h3>JSON parsing consumes the body</h3>

      <p>{message}</p>

      <button type="button" onClick={handleParse}>
        Parse JSON
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchJsonContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch JSON</h1>

      <h2>1. Parsing JSON with response.json()</h2>
      <FetchJsonResponseExample url="https://example.com/api/users" />

      <h2>2. Parsing a JSON object</h2>
      <FetchJsonObjectExample
        body={JSON.stringify({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        })}
      />

      <h2>3. Parsing a JSON array</h2>
      <FetchJsonArrayExample body={JSON.stringify(["first", "second", "third"])} />

      <h2>4. Parsing JSON primitives</h2>
      <FetchJsonPrimitiveExample body="true" />

      <h2>5. Applying an expected TypeScript type</h2>
      <FetchJsonTypedExample
        body={JSON.stringify({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        })}
      />

      <h2>6. Handling malformed JSON</h2>
      <FetchJsonInvalidExample body='{"name": "John Doe"' />

      <h2>7. Separating HTTP errors from JSON parsing</h2>
      <FetchJsonHttpErrorExample status={400} />

      <h2>8. Sending JSON in a request</h2>
      <FetchJsonRequestExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>9. Understanding JSON and Content-Type</h2>
      <FetchJsonContentTypeExample contentType="text/plain" body='{"message":"Example"}' />

      <h2>10. Understanding body consumption</h2>
      <FetchJsonBodyUsedExample
        body={JSON.stringify({
          message: "Example response",
        })}
      />
    </main>
  );
};

export default FetchJsonContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Response.json() asynchronously parses a response body as JSON.
// - response.json() consumes the response body.
// - JSON can represent objects, arrays, strings, numbers, booleans, and null.
// - JSON request bodies are normally created with JSON.stringify().
// - JSON request bodies should normally use the application/json Content-Type.
// - fetch() does not automatically serialize JavaScript objects as JSON.
// - HTTP error statuses do not automatically cause fetch() to reject.
// - Applications should normally check response.ok or response.status before processing an expected successful response.
// - response.json() can reject when the response body contains invalid JSON.
// - TypeScript types describe expected JSON shapes but do not validate untrusted JSON at runtime.
// - Content-Type can be inspected separately from JSON parsing when an API contract requires it.
// - Calling response.json() changes response.bodyUsed to true.
// - A consumed response body cannot normally be parsed a second time.

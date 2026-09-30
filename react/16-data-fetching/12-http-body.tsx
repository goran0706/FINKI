/**
 * HTTP Body
 * =========
 *
 * An HTTP message body is the optional data carried after the HTTP headers.
 * Request bodies allow clients to send data to servers, while response bodies
 * allow servers to return representations or other payload data to clients.
 *
 * In the Fetch API, request bodies are supplied through the `body` option of
 * `Request` or `fetch()`. A body can be represented by supported BodyInit
 * values such as strings, URLSearchParams, FormData, Blob, ArrayBuffer, and
 * related typed-array or stream values. The server uses the request headers,
 * especially `Content-Type`, to determine how the payload should be
 * interpreted.
 *
 * Response bodies are exposed through the `Body` interface implemented by
 * `Response`. Methods such as `text()`, `json()`, `blob()`, `arrayBuffer()`,
 * and `formData()` asynchronously consume the body stream and return a
 * promise containing the decoded representation.
 *
 * A body is different from headers. Headers describe the message and its
 * metadata, while the body contains the actual payload. A body is also
 * different from the HTTP status code, which describes the result of request
 * processing.
 *
 * Request and response bodies are optional. A response such as `204 No Content`
 * has no response body, and a GET request created through the Fetch API cannot
 * contain a request body. Body data should therefore be supplied only when the
 * HTTP method and server contract support it.
 *
 * Body consumption is generally one-shot because the underlying body is a
 * stream. After a body-reading method consumes the body, `bodyUsed` becomes
 * true. `Response.clone()` can be used before consumption when two consumers
 * need independent copies of the body stream.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpBodyRequestProps {
  readonly url: string;
  readonly name: string;
}

export interface HttpBodyJsonProps {
  readonly name: string;
  readonly email: string;
}

export interface HttpBodyTextProps {
  readonly url: string;
  readonly content: string;
}

export interface HttpBodyFormProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface HttpBodyResponseProps {
  readonly name: string;
}

export interface HttpBodyConsumptionProps {
  readonly value: string;
}

export interface HttpBodyEmptyResponseProps {
  readonly status: number;
}

export interface HttpBodyCloneProps {
  readonly value: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates adding a string request body to a POST request.
 */
export const HttpBodyRequestExample: FC<HttpBodyRequestProps> = ({ url, name }: HttpBodyRequestProps): ReactNode => {
  const body: string = name;

  const request: Request = new Request(url, {
    method: "POST",
    body,
  });

  return (
    <section>
      <h3>Adding a request body</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>

        <dt>Body available</dt>
        <dd>{request.body === null ? "No" : "Yes"}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates serializing structured application data as JSON before placing
 * it in an HTTP request body.
 */
export const HttpBodyJsonExample: FC<HttpBodyJsonProps> = ({ name, email }: HttpBodyJsonProps): ReactNode => {
  const data: {
    readonly name: string;
    readonly email: string;
  } = {
    name,
    email,
  };

  const body: string = JSON.stringify(data);

  const request: Request = new Request("https://example.com/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>Sending JSON in a request body</h3>

      <dl>
        <dt>Content-Type</dt>
        <dd>{request.headers.get("Content-Type")}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates using a plain string as a request body and explicitly declaring
 * the corresponding media type.
 */
export const HttpBodyTextExample: FC<HttpBodyTextProps> = ({ url, content }: HttpBodyTextProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
    },
    body: content,
  });

  return (
    <section>
      <h3>Sending text in a request body</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>Body: {content}</p>
    </section>
  );
};

/**
 * Demonstrates URL-encoded form data as a request body. URLSearchParams is
 * automatically serialized using application/x-www-form-urlencoded rules.
 */
export const HttpBodyFormExample: FC<HttpBodyFormProps> = ({ url, name, email }: HttpBodyFormProps): ReactNode => {
  const formData: URLSearchParams = new URLSearchParams();

  formData.set("name", name);
  formData.set("email", email);

  const request: Request = new Request(url, {
    method: "POST",
    body: formData,
  });

  return (
    <section>
      <h3>Sending URL-encoded form data</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>Body: {formData.toString()}</p>
    </section>
  );
};

/**
 * Demonstrates that response body data can be represented as a string and
 * consumed asynchronously through `Response.text()`.
 */
export const HttpBodyResponseExample: FC<HttpBodyResponseProps> = ({ name }: HttpBodyResponseProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const response: Response = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <section>
      <h3>Reading a response body</h3>

      <p>Response status: {response.status}</p>

      <p>Raw body: {body}</p>

      <p>Content-Type: {response.headers.get("Content-Type")}</p>
    </section>
  );
};

/**
 * Demonstrates the one-shot nature of body streams by inspecting `bodyUsed`
 * before consumption.
 */
export const HttpBodyConsumptionExample: FC<HttpBodyConsumptionProps> = ({
  value,
}: HttpBodyConsumptionProps): ReactNode => {
  const response: Response = new Response(value);

  const bodyUsedBeforeReading: boolean = response.bodyUsed;

  return (
    <section>
      <h3>Understanding body consumption</h3>

      <p>Body: {value}</p>

      <p>Body used before reading: {bodyUsedBeforeReading ? "Yes" : "No"}</p>

      <p>After a body-reading method consumes the stream, `bodyUsed` becomes true.</p>
    </section>
  );
};

/**
 * Demonstrates a response without a body. A 204 response represents successful
 * processing while intentionally containing no response content.
 */
export const HttpBodyEmptyResponseExample: FC<HttpBodyEmptyResponseProps> = ({
  status,
}: HttpBodyEmptyResponseProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
  });

  return (
    <section>
      <h3>Handling a response without a body</h3>

      <p>Status: {response.status}</p>

      <p>Body available: {response.body === null ? "No" : "Yes"}</p>

      <p>A response without a body must not be treated as if it contained JSON or text.</p>
    </section>
  );
};

/**
 * Demonstrates cloning a response before its body is consumed. Each clone has
 * a separate body stream that can be consumed independently.
 */
export const HttpBodyCloneExample: FC<HttpBodyCloneProps> = ({ value }: HttpBodyCloneProps): ReactNode => {
  const response: Response = new Response(value);

  const clonedResponse: Response = response.clone();

  return (
    <section>
      <h3>Cloning a response body</h3>

      <p>Original body available: {response.body === null ? "No" : "Yes"}</p>

      <p>Cloned body available: {clonedResponse.body === null ? "No" : "Yes"}</p>

      <p>The clone must be created before the original body has been consumed.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpBodyContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Body</h1>

      <h2>1. Adding a request body</h2>
      <HttpBodyRequestExample url="https://example.com/api/users" name="John Doe" />

      <h2>2. Sending JSON in a request body</h2>
      <HttpBodyJsonExample name="John Doe" email="john.doe@example.com" />

      <h2>3. Sending text in a request body</h2>
      <HttpBodyTextExample url="https://example.com/api/messages" content="Hello from the client." />

      <h2>4. Sending URL-encoded form data</h2>
      <HttpBodyFormExample url="https://example.com/api/contact" name="John Doe" email="john.doe@example.com" />

      <h2>5. Reading a response body</h2>
      <HttpBodyResponseExample name="John Doe" />

      <h2>6. Understanding body consumption</h2>
      <HttpBodyConsumptionExample value="Example response body" />

      <h2>7. Handling a response without a body</h2>
      <HttpBodyEmptyResponseExample status={204} />

      <h2>8. Cloning a response body</h2>
      <HttpBodyCloneExample value="Example response body" />
    </main>
  );
};

export default HttpBodyContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An HTTP body carries optional request or response payload data.
// - Request bodies are supplied through the Fetch API `body` option.
// - Response bodies are exposed through the `Response` Body API.
// - JSON request data should be serialized with `JSON.stringify()` and normally use `Content-Type: application/json`.
// - Plain text bodies should declare an appropriate text media type when the server requires it.
// - `URLSearchParams` can be used to create application/x-www-form-urlencoded request bodies.
// - Body-reading methods such as `text()` and `json()` are asynchronous.
// - A body is generally a one-shot stream, and `bodyUsed` indicates whether it has been consumed.
// - `Response.clone()` creates a separate body stream before the original response body is consumed.
// - Some valid HTTP responses, including 204 No Content, intentionally contain no body.
// - GET requests cannot have a request body through the Fetch API.
// - The body payload and its `Content-Type` metadata must agree with the server's expected representation.

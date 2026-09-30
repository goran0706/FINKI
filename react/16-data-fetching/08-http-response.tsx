/**
 * HTTP Response
 * =============
 *
 * An HTTP response is the message returned by an HTTP server after processing
 * an HTTP request. A response contains a status code, status text, response
 * headers, and an optional response body.
 *
 * In the Fetch API, the `Response` interface represents an HTTP response. Its
 * `status` property contains the numeric status code, `statusText` contains
 * the associated reason phrase when available, and `ok` is `true` when the
 * status is in the inclusive 200-299 range.
 *
 * Response headers are exposed through the `Headers` interface. The response
 * body is a readable stream and can be consumed through methods such as
 * `json()`, `text()`, `blob()`, `arrayBuffer()`, and `formData()`. These
 * body-reading methods return promises because response data can arrive
 * asynchronously.
 *
 * A response body is consumable. After the body has been consumed, the
 * response's `bodyUsed` property becomes `true`, and attempting to consume
 * the same body again normally fails. `Response.clone()` creates another
 * response with a separate body stream when the same body needs to be
 * consumed more than once.
 *
 * A common misconception is that Fetch rejects its promise for HTTP error
 * status codes such as 404 or 500. Fetch normally resolves with a `Response`
 * for HTTP responses, including these status codes. Application code should
 * inspect `response.ok` or `response.status` when HTTP status determines
 * whether the operation succeeded. The Fetch promise rejects for failures
 * such as network errors or an aborted request.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpResponseStatusProps {
  readonly status: number;
  readonly statusText: string;
}

export interface HttpResponseOkProps {
  readonly status: number;
}

export interface HttpResponseHeadersProps {
  readonly contentType: string;
  readonly cacheControl: string;
}

export interface HttpResponseBodyProps {
  readonly name: string;
}

export interface HttpResponseConsumptionProps {
  readonly name: string;
}

export interface HttpResponseCloneProps {
  readonly name: string;
}

export interface HttpResponseErrorStatusProps {
  readonly status: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the status code and status text exposed by a Response object.
 */
export const HttpResponseStatusExample: FC<HttpResponseStatusProps> = ({
  status,
  statusText,
}: HttpResponseStatusProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
    statusText,
  });

  return (
    <section>
      <h3>Reading response status information</h3>

      <dl>
        <dt>Status</dt>
        <dd>{response.status}</dd>

        <dt>Status text</dt>
        <dd>{response.statusText}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates the `ok` convenience property, which is true only for status
 * codes from 200 through 299.
 */
export const HttpResponseOkExample: FC<HttpResponseOkProps> = ({ status }: HttpResponseOkProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
  });

  return (
    <section>
      <h3>Checking whether a response is successful</h3>

      <p>Status: {response.status}</p>

      <p>Response is OK: {response.ok ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates reading metadata from response headers.
 */
export const HttpResponseHeadersExample: FC<HttpResponseHeadersProps> = ({
  contentType,
  cacheControl,
}: HttpResponseHeadersProps): ReactNode => {
  const response: Response = new Response(null, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  });

  return (
    <section>
      <h3>Reading response headers</h3>

      <dl>
        <dt>Content-Type</dt>
        <dd>{response.headers.get("Content-Type")}</dd>

        <dt>Cache-Control</dt>
        <dd>{response.headers.get("Cache-Control")}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates asynchronous consumption of a JSON response body.
 */
export const HttpResponseBodyExample: FC<HttpResponseBodyProps> = ({ name }: HttpResponseBodyProps): ReactNode => {
  const body: string = JSON.stringify({
    id: 1,
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
      <h3>Understanding a response body</h3>

      <p>Body content: {body}</p>

      <p>Body type: {response.headers.get("Content-Type")}</p>
    </section>
  );
};

/**
 * Demonstrates the `bodyUsed` state before and after consuming a response body.
 */
export const HttpResponseConsumptionExample: FC<HttpResponseConsumptionProps> = ({
  name,
}: HttpResponseConsumptionProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const response: Response = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const initialBodyUsed: boolean = response.bodyUsed;

  return (
    <section>
      <h3>Understanding response body consumption</h3>

      <p>Body used before reading: {initialBodyUsed ? "Yes" : "No"}</p>

      <p>A response body is consumed asynchronously by methods such as `json()` or `text()`.</p>

      <p>After consumption, `bodyUsed` becomes `true`.</p>
    </section>
  );
};

/**
 * Demonstrates cloning a response before consuming its body. Cloning allows
 * separate consumers to read equivalent response data.
 */
export const HttpResponseCloneExample: FC<HttpResponseCloneProps> = ({ name }: HttpResponseCloneProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const response: Response = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const clonedResponse: Response = response.clone();

  return (
    <section>
      <h3>Cloning a response</h3>

      <p>Original body used: {response.bodyUsed ? "Yes" : "No"}</p>

      <p>Cloned body used: {clonedResponse.bodyUsed ? "Yes" : "No"}</p>

      <p>Both responses contain independently consumable body streams.</p>
    </section>
  );
};

/**
 * Demonstrates that an HTTP error status still produces a Response object.
 * Fetch does not normally reject merely because the server returned 4xx or
 * 5xx.
 */
export const HttpResponseErrorStatusExample: FC<HttpResponseErrorStatusProps> = ({
  status,
}: HttpResponseErrorStatusProps): ReactNode => {
  const response: Response = new Response(
    JSON.stringify({
      message: "Resource not found",
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (
    <section>
      <h3>Handling an HTTP error status</h3>

      <p>Status: {response.status}</p>

      <p>Response exists: Yes</p>

      <p>Response is OK: {response.ok ? "Yes" : "No"}</p>

      <p>Application code should inspect the status or `ok` property to handle HTTP errors.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpResponseContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Response</h1>

      <h2>1. Reading response status information</h2>
      <HttpResponseStatusExample status={200} statusText="OK" />

      <h2>2. Checking whether a response is successful</h2>
      <HttpResponseOkExample status={201} />

      <h2>3. Reading response headers</h2>
      <HttpResponseHeadersExample contentType="application/json" cacheControl="no-cache" />

      <h2>4. Understanding a response body</h2>
      <HttpResponseBodyExample name="John Doe" />

      <h2>5. Understanding response body consumption</h2>
      <HttpResponseConsumptionExample name="John Doe" />

      <h2>6. Cloning a response</h2>
      <HttpResponseCloneExample name="John Doe" />

      <h2>7. Handling an HTTP error status</h2>
      <HttpResponseErrorStatusExample status={404} />
    </main>
  );
};

export default HttpResponseContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An HTTP response contains a status code, headers, and an optional body.
// - The Fetch API represents HTTP responses with the `Response` interface.
// - `status` contains the numeric HTTP status code.
// - `statusText` contains the response reason phrase when available.
// - `ok` is true only when the status code is between 200 and 299.
// - Response headers are accessed through the `Headers` interface.
// - Response body methods such as `json()` and `text()` are asynchronous.
// - A response body is consumable, and `bodyUsed` indicates whether it has been consumed.
// - `Response.clone()` creates another response whose body can be consumed separately.
// - Fetch normally resolves for HTTP 4xx and 5xx responses rather than rejecting because of the status.
// - Application code should explicitly inspect `ok` or `status` when HTTP status determines success.
// - Network failures and other Fetch-level failures are distinct from HTTP error status responses.

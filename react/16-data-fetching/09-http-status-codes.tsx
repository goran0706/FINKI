/**
 * HTTP Status Codes
 * =================
 *
 * HTTP status codes are three-digit integers sent by a server in an HTTP
 * response to communicate the result of processing a request. The first digit
 * identifies the broad status class, while the remaining digits identify a
 * more specific condition.
 *
 * Status codes are divided into five classes. `1xx` codes are informational,
 * `2xx` codes indicate successful processing, `3xx` codes indicate
 * redirection, `4xx` codes indicate that the request cannot be fulfilled
 * because of a client-side condition, and `5xx` codes indicate that the
 * server encountered an error while processing an otherwise valid request.
 *
 * The status code does not by itself determine whether an application
 * operation succeeded in the way the application expects. For example, a
 * `204 No Content` response is successful but has no response body, while a
 * `404 Not Found` response is a valid HTTP response that indicates the
 * requested resource was not found.
 *
 * The Fetch API exposes the numeric status through `Response.status` and
 * provides `Response.ok` as a convenience property that is `true` for all
 * status codes from 200 through 299. Fetch does not normally reject its
 * promise for HTTP 4xx or 5xx responses, so application code must inspect the
 * response when status codes affect control flow.
 *
 * Some status codes have additional protocol semantics. For example, `201`
 * commonly indicates that a resource was created, `202` indicates that
 * processing was accepted but may not have completed, `301` and `302`
 * represent redirects, `401` indicates that authentication credentials are
 * required or invalid, `403` indicates that the server understood the request
 * but refuses to authorize it, and `429` indicates that the client has made
 * too many requests in a given period.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpStatusClassProps {
  readonly status: number;
}

export interface HttpStatusSuccessProps {
  readonly status: number;
}

export interface HttpStatusRedirectProps {
  readonly status: number;
}

export interface HttpStatusClientErrorProps {
  readonly status: number;
}

export interface HttpStatusServerErrorProps {
  readonly status: number;
}

export interface HttpStatusMeaningProps {
  readonly status: number;
  readonly description: string;
}

export interface HttpStatusValidationProps {
  readonly status: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Determines the broad HTTP status class from the first digit of a valid
 * three-digit status code.
 */
export const HttpStatusClassExample: FC<HttpStatusClassProps> = ({ status }: HttpStatusClassProps): ReactNode => {
  const statusClass: number = Math.floor(status / 100);

  const className: string = statusClass >= 1 && statusClass <= 5 ? `${statusClass}xx` : "Invalid";

  const description: string =
    statusClass === 1
      ? "Informational"
      : statusClass === 2
        ? "Successful"
        : statusClass === 3
          ? "Redirection"
          : statusClass === 4
            ? "Client error"
            : statusClass === 5
              ? "Server error"
              : "Not an HTTP status class";

  return (
    <section>
      <h3>Identifying the HTTP status class</h3>

      <p>Status: {status}</p>
      <p>Class: {className}</p>
      <p>Meaning: {description}</p>
    </section>
  );
};

/**
 * Demonstrates successful HTTP status codes and the Fetch API's `ok`
 * property.
 */
export const HttpStatusSuccessExample: FC<HttpStatusSuccessProps> = ({ status }: HttpStatusSuccessProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
  });

  return (
    <section>
      <h3>Successful status codes</h3>

      <p>Status: {response.status}</p>

      <p>`response.ok`: {response.ok ? "true" : "false"}</p>

      <p>The 2xx class represents successful HTTP processing.</p>
    </section>
  );
};

/**
 * Demonstrates that redirect status codes belong to the 3xx class and may
 * instruct an HTTP client to retrieve a different resource.
 */
export const HttpStatusRedirectExample: FC<HttpStatusRedirectProps> = ({
  status,
}: HttpStatusRedirectProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
    headers: {
      Location: "https://example.com/new-location",
    },
  });

  return (
    <section>
      <h3>Redirection status codes</h3>

      <p>Status: {response.status}</p>

      <p>Location: {response.headers.get("Location")}</p>

      <p>Redirection responses belong to the 3xx status class.</p>
    </section>
  );
};

/**
 * Demonstrates that a 4xx response is an HTTP response rather than a Fetch
 * rejection and that application code can inspect its status explicitly.
 */
export const HttpStatusClientErrorExample: FC<HttpStatusClientErrorProps> = ({
  status,
}: HttpStatusClientErrorProps): ReactNode => {
  const response: Response = new Response(
    JSON.stringify({
      message: "The requested resource was not found.",
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
      <h3>Client error status codes</h3>

      <p>Status: {response.status}</p>

      <p>`response.ok`: {response.ok ? "true" : "false"}</p>

      <p>HTTP error responses can still be represented by a resolved `Response` object.</p>
    </section>
  );
};

/**
 * Demonstrates that a 5xx response represents a server-side HTTP error while
 * remaining a normal HTTP response from the perspective of Fetch.
 */
export const HttpStatusServerErrorExample: FC<HttpStatusServerErrorProps> = ({
  status,
}: HttpStatusServerErrorProps): ReactNode => {
  const response: Response = new Response(
    JSON.stringify({
      message: "The server could not complete the request.",
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
      <h3>Server error status codes</h3>

      <p>Status: {response.status}</p>

      <p>`response.ok`: {response.ok ? "true" : "false"}</p>

      <p>5xx responses indicate that the server encountered an error while processing the request.</p>
    </section>
  );
};

/**
 * Associates an application-defined description with a specific status code.
 * The status code itself remains the authoritative protocol value.
 */
export const HttpStatusMeaningExample: FC<HttpStatusMeaningProps> = ({
  status,
  description,
}: HttpStatusMeaningProps): ReactNode => {
  const response: Response = new Response(null, {
    status,
  });

  return (
    <section>
      <h3>Interpreting a specific status code</h3>

      <p>Status: {response.status}</p>
      <p>Application meaning: {description}</p>
    </section>
  );
};

/**
 * Demonstrates validation before constructing a Response. The Response
 * constructor accepts status codes in the range 200 through 599, so arbitrary
 * integers should not be passed without validation.
 */
export const HttpStatusValidationExample: FC<HttpStatusValidationProps> = ({
  status,
}: HttpStatusValidationProps): ReactNode => {
  const isValidStatus: boolean = Number.isInteger(status) && status >= 200 && status <= 599;

  let message: string;

  if (isValidStatus) {
    const response: Response = new Response(null, {
      status,
    });

    message = `Response created with status ${response.status}.`;
  } else {
    message = "The Response constructor requires a status from 200 through 599.";
  }

  return (
    <section>
      <h3>Validating a status code</h3>

      <p>Status: {status}</p>
      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpStatusCodesContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Status Codes</h1>

      <h2>1. Identifying the HTTP status class</h2>
      <HttpStatusClassExample status={200} />

      <h2>2. Successful status codes</h2>
      <HttpStatusSuccessExample status={201} />

      <h2>3. Redirection status codes</h2>
      <HttpStatusRedirectExample status={302} />

      <h2>4. Client error status codes</h2>
      <HttpStatusClientErrorExample status={404} />

      <h2>5. Server error status codes</h2>
      <HttpStatusServerErrorExample status={500} />

      <h2>6. Interpreting a specific status code</h2>
      <HttpStatusMeaningExample
        status={204}
        description="The request succeeded and the response contains no content."
      />

      <h2>7. Validating a status code</h2>
      <HttpStatusValidationExample status={200} />
    </main>
  );
};

export default HttpStatusCodesContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HTTP status codes are three-digit values that communicate the result of an HTTP request.
// - `1xx` status codes are informational.
// - `2xx` status codes indicate successful processing.
// - `3xx` status codes indicate redirection.
// - `4xx` status codes indicate client-side request conditions.
// - `5xx` status codes indicate server-side processing errors.
// - `Response.status` exposes the numeric status code.
// - `Response.ok` is true for status codes from 200 through 299.
// - Fetch normally resolves with a `Response` for HTTP 4xx and 5xx statuses.
// - Application code should inspect the status when different HTTP outcomes require different behavior.
// - A successful response such as `204 No Content` can legitimately have no response body.
// - The `Response` constructor accepts status codes from 200 through 599.

/**
 * HTTP Methods
 * ============
 *
 * HTTP methods identify the intended operation for an HTTP request. Common
 * methods include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and
 * `OPTIONS`. The method is carried in the request and gives the server
 * information about how the request should be processed.
 *
 * `GET` retrieves a representation of a resource and is defined as safe and
 * idempotent. `POST` submits data for processing and is commonly used to
 * create a subordinate resource or trigger server-side processing. `PUT`
 * creates or replaces a resource at a known target URI and is idempotent.
 * `PATCH` applies partial modifications to a resource; its idempotency depends
 * on the particular patch operation. `DELETE` requests removal of a resource
 * and is defined as idempotent, although repeated requests can still produce
 * different response status codes.
 *
 * `HEAD` has the same semantics as `GET` except that the server must not send a
 * response body. It is useful when metadata is needed without transferring
 * the representation. `OPTIONS` requests information about communication
 * options for the target resource and is commonly involved in CORS preflight
 * requests.
 *
 * Method properties such as safety and idempotency are protocol semantics, not
 * guarantees that an application implementation has no side effects. A server
 * can still perform logging, accounting, or other internal work while
 * processing a safe method. The semantics describe the intended effect on the
 * target resource.
 *
 * The Fetch API accepts standard HTTP methods through the `method` option.
 * `GET` and `HEAD` requests cannot have a request body through Fetch, while
 * methods such as `POST`, `PUT`, and `PATCH` can carry one when the request
 * semantics and server API support it.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpMethodsGetProps {
  readonly url: string;
}

export interface HttpMethodsPostProps {
  readonly url: string;
  readonly name: string;
}

export interface HttpMethodsPutProps {
  readonly url: string;
  readonly name: string;
}

export interface HttpMethodsPatchProps {
  readonly url: string;
  readonly name: string;
}

export interface HttpMethodsDeleteProps {
  readonly url: string;
}

export interface HttpMethodsHeadProps {
  readonly url: string;
}

export interface HttpMethodsOptionsProps {
  readonly url: string;
}

export interface HttpMethodsSemanticsProps {
  readonly method: string;
  readonly safe: boolean;
  readonly idempotent: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a GET request. GET is intended to retrieve a resource
 * representation and does not use a request body in the Fetch API.
 */
export const HttpMethodsGetExample: FC<HttpMethodsGetProps> = ({ url }: HttpMethodsGetProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "GET",
  });

  return (
    <section>
      <h3>GET</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Body</dt>
        <dd>{request.body === null ? "None" : "Present"}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates a POST request with a JSON body. POST is commonly used to submit
 * data for processing or to create a subordinate resource.
 */
export const HttpMethodsPostExample: FC<HttpMethodsPostProps> = ({ url, name }: HttpMethodsPostProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const request: Request = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>POST</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates a PUT request with a complete resource representation. PUT is
 * defined as idempotent by HTTP semantics.
 */
export const HttpMethodsPutExample: FC<HttpMethodsPutProps> = ({ url, name }: HttpMethodsPutProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const request: Request = new Request(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>PUT</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates a PATCH request containing only the fields being changed. PATCH
 * itself does not guarantee idempotency; that property depends on the patch
 * operation defined by the server.
 */
export const HttpMethodsPatchExample: FC<HttpMethodsPatchProps> = ({ url, name }: HttpMethodsPatchProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const request: Request = new Request(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>PATCH</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates a DELETE request targeting a specific resource.
 */
export const HttpMethodsDeleteExample: FC<HttpMethodsDeleteProps> = ({ url }: HttpMethodsDeleteProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "DELETE",
  });

  return (
    <section>
      <h3>DELETE</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates a HEAD request. HEAD has the semantics of GET but does not include a
 * response body.
 */
export const HttpMethodsHeadExample: FC<HttpMethodsHeadProps> = ({ url }: HttpMethodsHeadProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "HEAD",
  });

  return (
    <section>
      <h3>HEAD</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Request body</dt>
        <dd>{request.body === null ? "None" : "Present"}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates an OPTIONS request. OPTIONS asks the server for information about
 * communication options available for the target resource.
 */
export const HttpMethodsOptionsExample: FC<HttpMethodsOptionsProps> = ({ url }: HttpMethodsOptionsProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "OPTIONS",
  });

  return (
    <section>
      <h3>OPTIONS</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>URL</dt>
        <dd>{request.url}</dd>
      </dl>
    </section>
  );
};

/**
 * Displays protocol-level safety and idempotency properties supplied for a
 * method. These are semantic properties of the HTTP method, not application
 * success indicators.
 */
export const HttpMethodsSemanticsExample: FC<HttpMethodsSemanticsProps> = ({
  method,
  safe,
  idempotent,
}: HttpMethodsSemanticsProps): ReactNode => {
  return (
    <section>
      <h3>Method semantics</h3>

      <dl>
        <dt>Method</dt>
        <dd>{method}</dd>

        <dt>Safe</dt>
        <dd>{safe ? "Yes" : "No"}</dd>

        <dt>Idempotent</dt>
        <dd>{idempotent ? "Yes" : "No"}</dd>
      </dl>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpMethodsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Methods</h1>

      <h2>1. GET retrieves a resource representation</h2>
      <HttpMethodsGetExample url="https://example.com/api/users/42" />

      <h2>2. POST submits data for processing</h2>
      <HttpMethodsPostExample url="https://example.com/api/users" name="John Doe" />

      <h2>3. PUT replaces a resource representation</h2>
      <HttpMethodsPutExample url="https://example.com/api/users/42" name="John Doe" />

      <h2>4. PATCH applies a partial modification</h2>
      <HttpMethodsPatchExample url="https://example.com/api/users/42" name="John Doe" />

      <h2>5. DELETE targets a resource for removal</h2>
      <HttpMethodsDeleteExample url="https://example.com/api/users/42" />

      <h2>6. HEAD requests resource metadata without a response body</h2>
      <HttpMethodsHeadExample url="https://example.com/api/users/42" />

      <h2>7. OPTIONS requests communication options</h2>
      <HttpMethodsOptionsExample url="https://example.com/api/users" />

      <h2>8. GET is safe and idempotent</h2>
      <HttpMethodsSemanticsExample method="GET" safe={true} idempotent={true} />

      <h2>9. POST is neither safe nor inherently idempotent</h2>
      <HttpMethodsSemanticsExample method="POST" safe={false} idempotent={false} />

      <h2>10. PUT is idempotent but not safe</h2>
      <HttpMethodsSemanticsExample method="PUT" safe={false} idempotent={true} />
    </main>
  );
};

export default HttpMethodsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HTTP methods communicate the intended operation for a request.
// - GET retrieves a resource representation and is safe and idempotent.
// - POST submits data for processing and is not inherently idempotent.
// - PUT replaces or creates a resource at a known target and is idempotent.
// - PATCH applies partial modifications and does not inherently guarantee idempotency.
// - DELETE requests removal of a resource and is idempotent by HTTP semantics.
// - HEAD has GET semantics but does not include a response body.
// - OPTIONS requests information about communication options for a target resource.
// - Method safety and idempotency describe HTTP semantics rather than application success.
// - GET and HEAD requests cannot have request bodies through the Fetch API.
// - Methods such as POST, PUT, and PATCH can carry request bodies when supported by the request and server API.

/**
 * Fetch Request Body
 * ==================
 *
 * The Fetch API accepts request bodies through the `body` property of
 * RequestInit. The body carries application data to the server and is
 * commonly used with HTTP methods such as POST, PUT, and PATCH.
 *
 * A request body can be represented by several BodyInit-compatible types,
 * including strings, URLSearchParams, FormData, Blob, ArrayBuffer, and
 * typed-array or DataView representations. The browser serializes the supplied
 * body according to its type when the request is sent.
 *
 * When a string contains JSON, fetch() does not automatically identify it as
 * JSON. The application should serialize the value with JSON.stringify() and
 * normally set the Content-Type header to `application/json`.
 *
 * URLSearchParams represents URL-encoded form data and can be supplied directly
 * as a request body. FormData represents multipart form data and can contain
 * text fields and files. When FormData is used as the body, application code
 * should normally not manually set the Content-Type header because the browser
 * must generate the multipart boundary parameter.
 *
 * Blob represents immutable binary data and can be used when the request body
 * should contain explicitly typed binary or textual data. A Blob can carry a
 * MIME type through its `type` property, although applications may still need
 * to configure an appropriate Content-Type header for the API contract.
 *
 * GET and HEAD requests cannot have a request body in the Fetch API. Attempting
 * to construct a Request with a body for either method throws a TypeError.
 *
 * Request bodies are streams. Once a Request body has been consumed, its
 * `bodyUsed` property becomes true and the body cannot normally be consumed a
 * second time. Request.clone() can create another request whose body can be
 * consumed independently before either copy is consumed.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchStringBodyProps {
  readonly url: string;
  readonly value: string;
}

export interface FetchJsonBodyProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface FetchUrlSearchParamsBodyProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface FetchFormDataBodyProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface FetchBlobBodyProps {
  readonly url: string;
  readonly value: string;
  readonly contentType: string;
}

export interface FetchBodyMethodGotchaProps {
  readonly url: string;
}

export interface FetchBodyUsedProps {
  readonly url: string;
  readonly value: string;
}

export interface FetchBodyCloneProps {
  readonly url: string;
  readonly value: string;
}

export interface FetchBodyInspectionProps {
  readonly url: string;
  readonly value: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates using a plain string as a Fetch request body.
 */
export const FetchStringBodyExample: FC<FetchStringBodyProps> = ({ url, value }: FetchStringBodyProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "POST",
    body: value,
  });

  return (
    <section>
      <h3>String request body</h3>

      <p>Method: {request.method}</p>

      <p>Body: {value}</p>

      <p>A string body is sent as request content. The server needs to know how that content should be interpreted.</p>
    </section>
  );
};

/**
 * Demonstrates serializing an object as JSON before supplying it as the
 * request body.
 */
export const FetchJsonBodyExample: FC<FetchJsonBodyProps> = ({ url, name, email }: FetchJsonBodyProps): ReactNode => {
  const data: {
    readonly name: string;
    readonly email: string;
  } = {
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
      <h3>JSON request body</h3>

      <p>Method: {request.method}</p>

      <p>Content-Type: {request.headers.get("Content-Type") ?? "Not configured"}</p>

      <pre>{body}</pre>
    </section>
  );
};

/**
 * Demonstrates using URLSearchParams as an application/x-www-form-urlencoded
 * request body.
 */
export const FetchUrlSearchParamsBodyExample: FC<FetchUrlSearchParamsBodyProps> = ({
  url,
  name,
  email,
}: FetchUrlSearchParamsBodyProps): ReactNode => {
  const parameters: URLSearchParams = new URLSearchParams();

  parameters.set("name", name);

  parameters.set("email", email);

  const request: Request = new Request(url, {
    method: "POST",
    body: parameters,
  });

  return (
    <section>
      <h3>URLSearchParams request body</h3>

      <p>Method: {request.method}</p>

      <p>Content-Type: {request.headers.get("Content-Type") ?? "Not configured"}</p>

      <p>Serialized body: {parameters.toString()}</p>

      <p>Passing URLSearchParams directly as the body allows the Fetch API to use its URL-encoded representation.</p>
    </section>
  );
};

/**
 * Demonstrates using FormData as a multipart/form-data request body.
 */
export const FetchFormDataBodyExample: FC<FetchFormDataBodyProps> = ({
  url,
  name,
  email,
}: FetchFormDataBodyProps): ReactNode => {
  const formData: FormData = new FormData();

  formData.append("name", name);

  formData.append("email", email);

  const request: Request = new Request(url, {
    method: "POST",
    body: formData,
  });

  return (
    <section>
      <h3>FormData request body</h3>

      <p>Method: {request.method}</p>

      <p>Form fields: name, email</p>

      <p>FormData is serialized as multipart form data when the request is sent.</p>

      <p>
        The Content-Type header should normally not be set manually because the browser must include the generated
        multipart boundary.
      </p>
    </section>
  );
};

/**
 * Demonstrates using a Blob as a request body with an explicit MIME type.
 */
export const FetchBlobBodyExample: FC<FetchBlobBodyProps> = ({
  url,
  value,
  contentType,
}: FetchBlobBodyProps): ReactNode => {
  const blob: Blob = new Blob([value], {
    type: contentType,
  });

  const request: Request = new Request(url, {
    method: "POST",
    body: blob,
  });

  return (
    <section>
      <h3>Blob request body</h3>

      <p>Method: {request.method}</p>

      <p>Blob MIME type: {blob.type}</p>

      <p>Blob size: {blob.size} bytes</p>

      <p>A Blob can represent immutable binary or textual data supplied as the request body.</p>
    </section>
  );
};

/**
 * Demonstrates the Fetch API restriction that GET and HEAD requests cannot
 * contain a request body.
 */
export const FetchBodyMethodGotchaExample: FC<FetchBodyMethodGotchaProps> = ({
  url,
}: FetchBodyMethodGotchaProps): ReactNode => {
  let message: string = "A GET request cannot have a request body.";

  try {
    new Request(url, {
      method: "GET",
      body: "example body",
    });

    message = "The request was unexpectedly accepted.";
  } catch (error: unknown) {
    if (error instanceof TypeError) {
      message = "The Fetch API rejected the GET request body.";
    } else {
      message = "The request failed for an unexpected reason.";
    }
  }

  return (
    <section>
      <h3>GET and HEAD body restriction</h3>

      <p>{message}</p>

      <p>Use a method that permits a request body when the server API requires request content.</p>
    </section>
  );
};

/**
 * Demonstrates that consuming a Request body changes its bodyUsed state.
 */
export const FetchBodyUsedExample: FC<FetchBodyUsedProps> = ({ url, value }: FetchBodyUsedProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "POST",
    body: value,
  });

  const beforeConsumption: boolean = request.bodyUsed;

  return (
    <section>
      <h3>Request bodyUsed</h3>

      <p>Body used before consumption: {beforeConsumption ? "Yes" : "No"}</p>

      <p>
        A Request body is a stream. Once a body is consumed, bodyUsed becomes true and the same body cannot normally be
        consumed again.
      </p>
    </section>
  );
};

/**
 * Demonstrates cloning a Request before consuming its body so that the body
 * can be consumed independently from the original request.
 */
export const FetchBodyCloneExample: FC<FetchBodyCloneProps> = ({ url, value }: FetchBodyCloneProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "POST",
    body: value,
  });

  const clonedRequest: Request = request.clone();

  return (
    <section>
      <h3>Cloning a request body</h3>

      <p>Original body used: {request.bodyUsed ? "Yes" : "No"}</p>

      <p>Clone body used: {clonedRequest.bodyUsed ? "Yes" : "No"}</p>

      <p>
        Request.clone() creates another request whose body can be consumed independently before either request is
        consumed.
      </p>
    </section>
  );
};

/**
 * Demonstrates inspecting the body stream of a Request without consuming it.
 */
export const FetchBodyInspectionExample: FC<FetchBodyInspectionProps> = ({
  url,
  value,
}: FetchBodyInspectionProps): ReactNode => {
  const request: Request = new Request(url, {
    method: "POST",
    body: value,
  });

  const hasBody: boolean = request.body !== null;

  return (
    <section>
      <h3>Inspecting a request body</h3>

      <p>Request has a body: {hasBody ? "Yes" : "No"}</p>

      <p>Body used: {request.bodyUsed ? "Yes" : "No"}</p>

      <p>The body property exposes the request body as a ReadableStream when a body is present.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchRequestBodyContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch Request Body</h1>

      <h2>1. Sending a string request body</h2>
      <FetchStringBodyExample url="https://example.com/api/messages" value="Hello from a request body" />

      <h2>2. Sending a JSON request body</h2>
      <FetchJsonBodyExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>3. Sending URL-encoded request data</h2>
      <FetchUrlSearchParamsBodyExample
        url="https://example.com/api/users"
        name="John Doe"
        email="john.doe@example.com"
      />

      <h2>4. Sending multipart form data</h2>
      <FetchFormDataBodyExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>5. Sending a Blob request body</h2>
      <FetchBlobBodyExample url="https://example.com/api/data" value="Example text payload" contentType="text/plain" />

      <h2>6. Understanding the GET and HEAD body restriction</h2>
      <FetchBodyMethodGotchaExample url="https://example.com/api/users" />

      <h2>7. Understanding bodyUsed</h2>
      <FetchBodyUsedExample url="https://example.com/api/messages" value="Example request body" />

      <h2>8. Cloning a request before consuming its body</h2>
      <FetchBodyCloneExample url="https://example.com/api/messages" value="Example request body" />

      <h2>9. Inspecting a request body stream</h2>
      <FetchBodyInspectionExample url="https://example.com/api/messages" value="Example request body" />
    </main>
  );
};

export default FetchRequestBodyContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - RequestInit.body supplies content for a Fetch request.
// - Fetch request bodies can use strings, URLSearchParams, FormData, Blob, and other BodyInit-compatible values.
// - JSON request bodies should normally be serialized with JSON.stringify().
// - JSON requests should normally specify an application/json Content-Type.
// - URLSearchParams provides an application/x-www-form-urlencoded representation.
// - FormData is used for multipart form data and can contain text fields and files.
// - The Content-Type header for FormData should normally be left to the browser so that the multipart boundary is generated correctly.
// - Blob can represent textual or binary request content and can carry a MIME type.
// - GET and HEAD requests cannot have request bodies in the Fetch API.
// - Request bodies are streams and bodyUsed indicates whether the body has been consumed.
// - A consumed request body cannot normally be consumed a second time.
// - Request.clone() can create an independent request body before consumption.
// - Request.body exposes the underlying ReadableStream when a request body is present.

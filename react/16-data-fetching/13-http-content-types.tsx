/**
 * HTTP Content Types
 * ==================
 *
 * HTTP content types describe the media type of a request or response body.
 * The `Content-Type` header tells the recipient how the enclosed representation
 * is formatted, optionally followed by parameters such as `charset` or a
 * boundary value.
 *
 * A media type consists of a type and subtype, such as `application/json`,
 * `text/plain`, or `text/html`. Structured syntax suffixes such as `+json`
 * can identify formats that use the JSON representation model while retaining
 * a more specific media type, for example `application/problem+json`.
 *
 * `Content-Type` describes the representation actually contained in the
 * message. It is different from `Accept`, which expresses the media types that
 * a client is willing to receive in a response. `Content-Type` therefore
 * describes the body being sent, while `Accept` describes preferred response
 * representations.
 *
 * Parameters are part of the media type value. For example,
 * `text/plain; charset=UTF-8` identifies plain text with a UTF-8 character
 * encoding. Multipart media types commonly include a `boundary` parameter
 * that separates individual parts of the multipart body.
 *
 * The Fetch API can infer some request `Content-Type` values from body types.
 * For example, a `URLSearchParams` body is associated with
 * `application/x-www-form-urlencoded;charset=UTF-8`, while `FormData` uses a
 * multipart content type with a generated boundary. The boundary must not be
 * manually supplied when using `FormData`, because the browser needs to
 * generate and manage it consistently with the encoded body.
 *
 * A content type does not itself validate the body contents. It is metadata
 * describing how the recipient should interpret the bytes. The server must
 * still parse the body according to the declared media type and may reject
 * malformed or unsupported representations.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpContentTypeJsonProps {
  readonly name: string;
  readonly email: string;
}

export interface HttpContentTypeTextProps {
  readonly content: string;
}

export interface HttpContentTypeHtmlProps {
  readonly title: string;
}

export interface HttpContentTypeFormProps {
  readonly name: string;
  readonly email: string;
}

export interface HttpContentTypeMultipartProps {
  readonly name: string;
  readonly fileContent: string;
}

export interface HttpContentTypeAcceptProps {
  readonly contentType: string;
}

export interface HttpContentTypeParametersProps {
  readonly mediaType: string;
  readonly charset: string;
}

export interface HttpContentTypeSuffixProps {
  readonly contentType: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a JSON request body and its corresponding media type.
 */
export const HttpContentTypeJsonExample: FC<HttpContentTypeJsonProps> = ({
  name,
  email,
}: HttpContentTypeJsonProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
    email,
  });

  const request: Request = new Request("https://example.com/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>application/json</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>Body: {body}</p>
    </section>
  );
};

/**
 * Demonstrates a plain-text request body with an explicit text media type.
 */
export const HttpContentTypeTextExample: FC<HttpContentTypeTextProps> = ({
  content,
}: HttpContentTypeTextProps): ReactNode => {
  const request: Request = new Request("https://example.com/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
    },
    body: content,
  });

  return (
    <section>
      <h3>text/plain</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>Body: {content}</p>
    </section>
  );
};

/**
 * Demonstrates HTML as a response representation and shows that the content
 * type describes the representation returned to the client.
 */
export const HttpContentTypeHtmlExample: FC<HttpContentTypeHtmlProps> = ({
  title,
}: HttpContentTypeHtmlProps): ReactNode => {
  const body: string = `<html><body><h1>${title}</h1></body></html>`;

  const response: Response = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  });

  return (
    <section>
      <h3>text/html</h3>

      <p>Content-Type: {response.headers.get("Content-Type")}</p>

      <p>Body: {body}</p>
    </section>
  );
};

/**
 * Demonstrates URL-encoded form data. URLSearchParams causes Fetch to assign
 * the appropriate application/x-www-form-urlencoded content type.
 */
export const HttpContentTypeFormExample: FC<HttpContentTypeFormProps> = ({
  name,
  email,
}: HttpContentTypeFormProps): ReactNode => {
  const formData: URLSearchParams = new URLSearchParams();

  formData.set("name", name);
  formData.set("email", email);

  const request: Request = new Request("https://example.com/api/contact", {
    method: "POST",
    body: formData,
  });

  return (
    <section>
      <h3>application/x-www-form-urlencoded</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>Body: {formData.toString()}</p>
    </section>
  );
};

/**
 * Demonstrates FormData as a multipart request body. The browser generates the
 * multipart boundary automatically, so application code should not manually
 * set the Content-Type header when using FormData with Fetch.
 */
export const HttpContentTypeMultipartExample: FC<HttpContentTypeMultipartProps> = ({
  name,
  fileContent,
}: HttpContentTypeMultipartProps): ReactNode => {
  const formData: FormData = new FormData();

  formData.set("name", name);

  const file: File = new File([fileContent], "example.txt", {
    type: "text/plain",
  });

  formData.set("file", file);

  const request: Request = new Request("https://example.com/api/uploads", {
    method: "POST",
    body: formData,
  });

  return (
    <section>
      <h3>multipart/form-data</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>The browser-generated boundary is part of the Content-Type value.</p>
    </section>
  );
};

/**
 * Demonstrates the difference between Content-Type and Accept. Content-Type
 * describes the body being sent, while Accept describes response formats the
 * client is willing to receive.
 */
export const HttpContentTypeAcceptExample: FC<HttpContentTypeAcceptProps> = ({
  contentType,
}: HttpContentTypeAcceptProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", contentType);

  headers.set("Accept", "application/json");

  const request: Request = new Request("https://example.com/api/users", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "John Doe",
    }),
  });

  return (
    <section>
      <h3>Content-Type versus Accept</h3>

      <p>Content-Type: {request.headers.get("Content-Type")}</p>

      <p>Accept: {request.headers.get("Accept")}</p>
    </section>
  );
};

/**
 * Demonstrates a media type parameter. Parameters extend the media type with
 * additional metadata such as the character encoding.
 */
export const HttpContentTypeParametersExample: FC<HttpContentTypeParametersProps> = ({
  mediaType,
  charset,
}: HttpContentTypeParametersProps): ReactNode => {
  const contentType: string = `${mediaType}; charset=${charset}`;

  const headers: Headers = new Headers();

  headers.set("Content-Type", contentType);

  return (
    <section>
      <h3>Content-Type parameters</h3>

      <p>Content-Type: {headers.get("Content-Type")}</p>
    </section>
  );
};

/**
 * Demonstrates a structured syntax suffix. A `+json` suffix indicates that
 * the representation follows JSON-based syntax while retaining its specific
 * media type.
 */
export const HttpContentTypeSuffixExample: FC<HttpContentTypeSuffixProps> = ({
  contentType,
}: HttpContentTypeSuffixProps): ReactNode => {
  const response: Response = new Response(
    JSON.stringify({
      type: "validation-error",
      message: "Example error",
    }),
    {
      status: 400,
      headers: {
        "Content-Type": contentType,
      },
    },
  );

  return (
    <section>
      <h3>Structured syntax suffix</h3>

      <p>Content-Type: {response.headers.get("Content-Type")}</p>

      <p>The `+json` suffix identifies a JSON-based representation.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpContentTypesContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Content Types</h1>

      <h2>1. application/json describes JSON data</h2>
      <HttpContentTypeJsonExample name="John Doe" email="john.doe@example.com" />

      <h2>2. text/plain describes plain text</h2>
      <HttpContentTypeTextExample content="Hello from the HTTP client." />

      <h2>3. text/html describes an HTML representation</h2>
      <HttpContentTypeHtmlExample title="Example page" />

      <h2>4. application/x-www-form-urlencoded describes URL-encoded form data</h2>
      <HttpContentTypeFormExample name="John Doe" email="john.doe@example.com" />

      <h2>5. multipart/form-data describes multipart content</h2>
      <HttpContentTypeMultipartExample name="John Doe" fileContent="Example file contents" />

      <h2>6. Content-Type describes the body while Accept describes preferred response formats</h2>
      <HttpContentTypeAcceptExample contentType="application/json" />

      <h2>7. Content-Type parameters provide additional media-type metadata</h2>
      <HttpContentTypeParametersExample mediaType="text/plain" charset="UTF-8" />

      <h2>8. Structured syntax suffixes identify representation formats</h2>
      <HttpContentTypeSuffixExample contentType="application/problem+json" />
    </main>
  );
};

export default HttpContentTypesContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Content-Type` describes the media type of an HTTP message body.
// - A media type consists of a type and subtype, such as `application/json`.
// - Media types can include parameters such as `charset` and multipart boundaries.
// - `application/json` describes JSON representations.
// - `text/plain` describes plain-text representations.
// - `text/html` describes HTML representations.
// - `application/x-www-form-urlencoded` describes URL-encoded form data.
// - `multipart/form-data` uses a boundary to separate individual body parts.
// - Fetch can infer appropriate Content-Type values for supported body types such as URLSearchParams and FormData.
// - The browser should generate the multipart boundary when FormData is used as a request body.
// - `Content-Type` describes the representation being sent, while `Accept` describes representations the client is willing to receive.
// - A `+json` structured syntax suffix identifies a JSON-based representation.
// - Content-Type metadata does not validate that the body actually conforms to the declared media type.

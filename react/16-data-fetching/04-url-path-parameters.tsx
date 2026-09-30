/**
 * URL Path Parameters
 * ====================
 *
 * URL path parameters are dynamic values embedded within the path portion of a
 * URL. They are commonly used to identify a specific resource, such as an
 * identifier in `/users/42` or a nested resource in `/users/42/posts/7`.
 *
 * A path parameter is not a special feature of the URL syntax itself. The URL
 * only contains path segments. The application or routing system defines a
 * convention such as `/users/:userId`, then matches the concrete path
 * `/users/42` and extracts `42` as the value of `userId`.
 *
 * Path parameters differ from query parameters. Path parameters are normally
 * part of the resource path, while query parameters provide additional
 * request information after `?`. For example, `/products/42` identifies a
 * product resource, while `/products?category=books` supplies a category
 * filter.
 *
 * Dynamic path values must be encoded before they are inserted into a URL
 * path. `encodeURIComponent()` is appropriate for an individual path
 * parameter because characters such as `/`, `?`, and `#` have structural
 * meaning in URLs. Encoding prevents a parameter value from accidentally
 * becoming additional URL syntax.
 *
 * When reading an existing path, `URL.pathname` provides the path portion.
 * Splitting it into segments requires application-level parsing because the
 * URL API does not know which segments represent application parameters.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UrlPathParameterBasicProps {
  readonly baseUrl: string;
  readonly userId: string;
}

export interface UrlPathParameterNestedProps {
  readonly baseUrl: string;
  readonly userId: string;
  readonly postId: string;
}

export interface UrlPathParameterParsingProps {
  readonly url: string;
}

export interface UrlPathParameterEncodingProps {
  readonly baseUrl: string;
  readonly value: string;
}

export interface UrlPathParameterMissingProps {
  readonly url: string;
}

export interface UrlPathParameterNumericProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Builds a resource URL containing one dynamic path parameter.
 */
export const UrlPathParameterBasicExample: FC<UrlPathParameterBasicProps> = ({
  baseUrl,
  userId,
}: UrlPathParameterBasicProps): ReactNode => {
  const url: URL = new URL(baseUrl);
  const encodedUserId: string = encodeURIComponent(userId);

  url.pathname = `/users/${encodedUserId}`;

  return (
    <section>
      <h3>Building a path parameter</h3>

      <p>{url.href}</p>
    </section>
  );
};

/**
 * Builds a nested resource URL containing multiple dynamic path parameters.
 */
export const UrlPathParameterNestedExample: FC<UrlPathParameterNestedProps> = ({
  baseUrl,
  userId,
  postId,
}: UrlPathParameterNestedProps): ReactNode => {
  const url: URL = new URL(baseUrl);

  const encodedUserId: string = encodeURIComponent(userId);

  const encodedPostId: string = encodeURIComponent(postId);

  url.pathname = `/users/${encodedUserId}/posts/${encodedPostId}`;

  return (
    <section>
      <h3>Building nested path parameters</h3>

      <p>{url.href}</p>
    </section>
  );
};

/**
 * Extracts path segments from a URL. The URL API supplies the pathname, but
 * application code determines which segment represents a parameter.
 */
export const UrlPathParameterParsingExample: FC<UrlPathParameterParsingProps> = ({
  url,
}: UrlPathParameterParsingProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Parsing a path parameter</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  const segments: string[] = parsedUrl.pathname.split("/").filter((segment: string): boolean => segment.length > 0);

  const userIndex: number = segments.indexOf("users");

  const userId: string | null =
    userIndex >= 0 && userIndex + 1 < segments.length ? decodeURIComponent(segments[userIndex + 1]) : null;

  return (
    <section>
      <h3>Parsing a path parameter</h3>

      <p>Pathname: {parsedUrl.pathname}</p>

      <p>User ID: {userId ?? "(missing)"}</p>
    </section>
  );
};

/**
 * Encodes an individual path parameter before placing it into a URL path.
 * This prevents reserved characters from changing the URL structure.
 */
export const UrlPathParameterEncodingExample: FC<UrlPathParameterEncodingProps> = ({
  baseUrl,
  value,
}: UrlPathParameterEncodingProps): ReactNode => {
  const url: URL = new URL(baseUrl);

  const encodedValue: string = encodeURIComponent(value);

  url.pathname = `/search/${encodedValue}`;

  return (
    <section>
      <h3>Encoding a path parameter</h3>

      <p>Original value: {value}</p>
      <p>Encoded value: {encodedValue}</p>
      <p>URL: {url.href}</p>
    </section>
  );
};

/**
 * Demonstrates the difference between a missing path parameter and an empty
 * path segment.
 */
export const UrlPathParameterMissingExample: FC<UrlPathParameterMissingProps> = ({
  url,
}: UrlPathParameterMissingProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Handling a missing path parameter</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  const segments: string[] = parsedUrl.pathname.split("/");

  const usersIndex: number = segments.indexOf("users");

  const userId: string | null =
    usersIndex >= 0 && usersIndex + 1 < segments.length && segments[usersIndex + 1].length > 0
      ? decodeURIComponent(segments[usersIndex + 1])
      : null;

  return (
    <section>
      <h3>Handling a missing path parameter</h3>

      <p>User ID: {userId ?? "(missing)"}</p>
    </section>
  );
};

/**
 * Demonstrates explicit conversion of a path parameter from its URL string
 * representation into a number. URL path values are always represented as
 * strings until application code converts them.
 */
export const UrlPathParameterNumericExample: FC<UrlPathParameterNumericProps> = ({
  url,
}: UrlPathParameterNumericProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Converting a numeric path parameter</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  const segments: string[] = parsedUrl.pathname.split("/").filter((segment: string): boolean => segment.length > 0);

  const productsIndex: number = segments.indexOf("products");

  const rawProductId: string | null =
    productsIndex >= 0 && productsIndex + 1 < segments.length ? decodeURIComponent(segments[productsIndex + 1]) : null;

  const productId: number | null = rawProductId !== null && /^[0-9]+$/.test(rawProductId) ? Number(rawProductId) : null;

  return (
    <section>
      <h3>Converting a numeric path parameter</h3>

      <p>Raw value: {rawProductId ?? "(missing)"}</p>

      <p>Numeric value: {productId !== null ? productId : "(invalid)"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UrlPathParametersContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>URL Path Parameters</h1>

      <h2>1. Building a path parameter</h2>
      <UrlPathParameterBasicExample baseUrl="https://example.com" userId="42" />

      <h2>2. Building nested path parameters</h2>
      <UrlPathParameterNestedExample baseUrl="https://example.com" userId="42" postId="7" />

      <h2>3. Parsing a path parameter</h2>
      <UrlPathParameterParsingExample url="https://example.com/users/42/profile" />

      <h2>4. Encoding a path parameter</h2>
      <UrlPathParameterEncodingExample baseUrl="https://example.com" value="John Doe / React" />

      <h2>5. Handling a missing path parameter</h2>
      <UrlPathParameterMissingExample url="https://example.com/users/" />

      <h2>6. Converting a numeric path parameter</h2>
      <UrlPathParameterNumericExample url="https://example.com/products/42" />
    </main>
  );
};

export default UrlPathParametersContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - URL path parameters are application-defined dynamic values embedded in path segments.
// - The URL API treats path parameters as ordinary pathname segments; routing conventions determine their meaning.
// - `URL.pathname` provides the path portion without the query string or fragment.
// - `encodeURIComponent()` should be used when inserting an individual dynamic value into a path.
// - `decodeURIComponent()` can decode an encoded path parameter after it has been extracted.
// - Path parameters and query parameters serve different purposes and occupy different URL components.
// - Path parameters are strings when extracted from a URL and require explicit conversion for numeric or other application-specific types.
// - Missing parameters and empty path segments should be handled explicitly.
// - Nested resources can represent multiple dynamic values in a single path.
// - Application code should validate extracted path parameters before using them as identifiers or other typed values.

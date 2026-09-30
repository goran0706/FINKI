/**
 * URL Encoding
 * =============
 *
 * URL encoding converts characters into a representation that can safely
 * appear in a URL component. Characters with special meaning in URL syntax
 * may need to be percent-encoded so that data is not interpreted as URL
 * structure.
 *
 * Percent-encoding represents a byte using `%` followed by two hexadecimal
 * digits. JavaScript's `encodeURIComponent()` and `decodeURIComponent()`
 * operate on individual URL components, while `encodeURI()` and `decodeURI()`
 * operate on complete URI strings and preserve characters that are meaningful
 * as URI delimiters.
 *
 * The distinction is important when constructing URLs. A path parameter is an
 * individual component, so `encodeURIComponent()` should normally be used for
 * that value. Encoding an entire URL with `encodeURIComponent()` would also
 * encode its structural characters such as `:`, `/`, and `?`, producing a
 * value that is no longer a normal URL.
 *
 * `URLSearchParams` uses application/x-www-form-urlencoded serialization for
 * query parameters. In that serialization, spaces are represented as `+`
 * rather than `%20`. This differs from the output of
 * `encodeURIComponent()`, which represents a space as `%20`.
 *
 * Decoding must use the function corresponding to the encoding operation.
 * Calling `decodeURIComponent()` on an entire URL can incorrectly interpret
 * delimiters that were intentionally part of the URL structure. Malformed
 * percent-encoded input causes the decoding functions to throw a `URIError`.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UrlEncodingComponentProps {
  readonly value: string;
}

export interface UrlEncodingUriProps {
  readonly url: string;
}

export interface UrlEncodingPathParameterProps {
  readonly baseUrl: string;
  readonly parameter: string;
}

export interface UrlEncodingQueryParameterProps {
  readonly baseUrl: string;
  readonly parameter: string;
}

export interface UrlEncodingDecodingProps {
  readonly encodedValue: string;
}

export interface UrlEncodingMalformedProps {
  readonly encodedValue: string;
}

export interface UrlEncodingComparisonProps {
  readonly value: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Encodes an individual URL component with `encodeURIComponent()`.
 */
export const UrlEncodingComponentExample: FC<UrlEncodingComponentProps> = ({
  value,
}: UrlEncodingComponentProps): ReactNode => {
  const encodedValue: string = encodeURIComponent(value);

  return (
    <section>
      <h3>Encoding an individual URL component</h3>

      <p>Original: {value}</p>
      <p>Encoded: {encodedValue}</p>
    </section>
  );
};

/**
 * Encodes a complete URI with `encodeURI()`. URI delimiters such as `/`, `?`,
 * and `:` remain available as URL structure.
 */
export const UrlEncodingUriExample: FC<UrlEncodingUriProps> = ({ url }: UrlEncodingUriProps): ReactNode => {
  const encodedUri: string = encodeURI(url);

  return (
    <section>
      <h3>Encoding a complete URI</h3>

      <p>Original: {url}</p>
      <p>Encoded URI: {encodedUri}</p>
    </section>
  );
};

/**
 * Demonstrates encoding a dynamic path value before inserting it into a URL.
 */
export const UrlEncodingPathParameterExample: FC<UrlEncodingPathParameterProps> = ({
  baseUrl,
  parameter,
}: UrlEncodingPathParameterProps): ReactNode => {
  const url: URL = new URL(baseUrl);

  const encodedParameter: string = encodeURIComponent(parameter);

  url.pathname = `/users/${encodedParameter}`;

  return (
    <section>
      <h3>Encoding a path parameter</h3>

      <p>Original parameter: {parameter}</p>

      <p>Encoded parameter: {encodedParameter}</p>

      <p>URL: {url.href}</p>
    </section>
  );
};

/**
 * Demonstrates query parameter serialization through `URLSearchParams`.
 * Query values are encoded automatically when the parameters are serialized.
 */
export const UrlEncodingQueryParameterExample: FC<UrlEncodingQueryParameterProps> = ({
  baseUrl,
  parameter,
}: UrlEncodingQueryParameterProps): ReactNode => {
  const url: URL = new URL(baseUrl);

  url.searchParams.set("search", parameter);

  return (
    <section>
      <h3>Encoding a query parameter</h3>

      <p>Original value: {parameter}</p>

      <p>Serialized query: {url.search}</p>

      <p>URL: {url.href}</p>
    </section>
  );
};

/**
 * Decodes an individual percent-encoded URL component with
 * `decodeURIComponent()`.
 */
export const UrlEncodingDecodingExample: FC<UrlEncodingDecodingProps> = ({
  encodedValue,
}: UrlEncodingDecodingProps): ReactNode => {
  let decodedValue: string | null = null;
  let errorMessage: string | null = null;

  try {
    decodedValue = decodeURIComponent(encodedValue);
  } catch {
    errorMessage = "The value contains malformed percent-encoding.";
  }

  return (
    <section>
      <h3>Decoding a URL component</h3>

      <p>Encoded value: {encodedValue}</p>

      <p>Decoded value: {decodedValue ?? errorMessage}</p>
    </section>
  );
};

/**
 * Demonstrates the difference between `encodeURIComponent()` and `encodeURI`.
 * The component encoder treats URL delimiters as data, while the URI encoder
 * preserves delimiters that define the URI structure.
 */
export const UrlEncodingComparisonExample: FC<UrlEncodingComparisonProps> = ({
  value,
}: UrlEncodingComparisonProps): ReactNode => {
  const encodedComponent: string = encodeURIComponent(value);

  const encodedUri: string = encodeURI(value);

  return (
    <section>
      <h3>Comparing component and URI encoding</h3>

      <p>Original: {value}</p>

      <p>encodeURIComponent: {encodedComponent}</p>

      <p>encodeURI: {encodedUri}</p>
    </section>
  );
};

/**
 * Demonstrates malformed percent-encoded input. Decoding functions throw
 * `URIError` instead of returning partially decoded data.
 */
export const UrlEncodingMalformedExample: FC<UrlEncodingMalformedProps> = ({
  encodedValue,
}: UrlEncodingMalformedProps): ReactNode => {
  let result: string = "";

  try {
    result = decodeURIComponent(encodedValue);
  } catch (error: unknown) {
    if (error instanceof URIError) {
      result = "URIError: malformed percent-encoding.";
    } else {
      result = "An unexpected decoding error occurred.";
    }
  }

  return (
    <section>
      <h3>Handling malformed encoded input</h3>

      <p>Input: {encodedValue}</p>

      <p>Result: {result}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UrlEncodingContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>URL Encoding</h1>

      <h2>1. Encoding an individual URL component</h2>
      <UrlEncodingComponentExample value="John Doe & React/TypeScript" />

      <h2>2. Encoding a complete URI</h2>
      <UrlEncodingUriExample url="https://example.com/products?search=React & TypeScript" />

      <h2>3. Encoding a path parameter</h2>
      <UrlEncodingPathParameterExample baseUrl="https://example.com" parameter="John Doe/42" />

      <h2>4. Encoding a query parameter</h2>
      <UrlEncodingQueryParameterExample baseUrl="https://example.com/search" parameter="React & TypeScript" />

      <h2>5. Decoding a URL component</h2>
      <UrlEncodingDecodingExample encodedValue="John%20Doe%20%26%20React" />

      <h2>6. Comparing component and URI encoding</h2>
      <UrlEncodingComparisonExample value="https://example.com/products?category=books" />

      <h2>7. Handling malformed encoded input</h2>
      <UrlEncodingMalformedExample encodedValue="invalid%2" />
    </main>
  );
};

export default UrlEncodingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - URL encoding prevents data characters from being interpreted as URL structure.
// - Percent-encoding represents bytes with `%` followed by two hexadecimal digits.
// - `encodeURIComponent()` is intended for individual URL components.
// - `encodeURI()` is intended for complete URI strings and preserves URI delimiters.
// - Dynamic path parameters should normally be encoded with `encodeURIComponent()` before insertion into a path.
// - `URLSearchParams` automatically serializes query parameter values using form-encoding rules.
// - `decodeURIComponent()` decodes an individual URL component.
// - `decodeURI()` is intended for decoding complete URI strings.
// - `encodeURIComponent()` encodes URL delimiters such as `/`, `?`, and `#` when they are data.
// - Decoding malformed percent-encoded input throws a `URIError`.
// - Encoding an entire URL with `encodeURIComponent()` is usually incorrect because it encodes the URL's structural delimiters.

/**
 * URL Query Parameters
 * =====================
 *
 * URL query parameters are key-value pairs appended to a URL after the `?`
 * character. They provide additional information to a resource without
 * changing the URL path.
 *
 * For example, in:
 *
 *   https://example.com/products?category=books&page=2
 *
 * `category=books` and `page=2` are query parameters. The query string can
 * contain multiple parameters separated by `&`, and parameter names and
 * values are URL-encoded when necessary.
 *
 * The `URLSearchParams` Web API provides structured operations for creating,
 * reading, updating, deleting, and serializing query parameters. Unlike
 * manually splitting a query string, `URLSearchParams` correctly handles
 * percent-encoding and repeated parameter names.
 *
 * Query parameters can have repeated keys, such as `tag=react&tag=typescript`.
 * `get()` returns only the first value, while `getAll()` returns every value
 * associated with the key.
 *
 * A query parameter may also exist without an application-defined value, such
 * as `?enabled`. `URLSearchParams` represents that parameter with an empty
 * string value. Therefore, application code should distinguish between a
 * missing parameter and a present parameter whose value is empty.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UrlQueryParametersReadProps {
  readonly queryString: string;
}

export interface UrlQueryParametersRepeatedProps {
  readonly queryString: string;
}

export interface UrlQueryParametersMutationProps {
  readonly queryString: string;
}

export interface UrlQueryParametersConstructionProps {
  readonly baseUrl: string;
}

export interface UrlQueryParametersEncodingProps {
  readonly queryString: string;
}

export interface UrlQueryParametersPresenceProps {
  readonly queryString: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Reads a single query parameter using `URLSearchParams.get()`.
 */
export const UrlQueryParametersReadExample: FC<UrlQueryParametersReadProps> = ({
  queryString,
}: UrlQueryParametersReadProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const category: string | null = searchParams.get("category");

  return (
    <section>
      <h3>Reading a query parameter</h3>

      <p>Category: {category ?? "(missing)"}</p>
    </section>
  );
};

/**
 * Demonstrates repeated query parameter names and the difference between
 * `get()` and `getAll()`.
 */
export const UrlQueryParametersRepeatedExample: FC<UrlQueryParametersRepeatedProps> = ({
  queryString,
}: UrlQueryParametersRepeatedProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const firstTag: string | null = searchParams.get("tag");

  const allTags: string[] = searchParams.getAll("tag");

  return (
    <section>
      <h3>Reading repeated query parameters</h3>

      <p>First tag: {firstTag ?? "(missing)"}</p>

      <p>All tags: {allTags.length > 0 ? allTags.join(", ") : "(none)"}</p>
    </section>
  );
};

/**
 * Demonstrates modifying query parameters with `set()`, `append()`, and
 * `delete()`. `set()` replaces every existing value for a key, while
 * `append()` adds another value without removing existing values.
 */
export const UrlQueryParametersMutationExample: FC<UrlQueryParametersMutationProps> = ({
  queryString,
}: UrlQueryParametersMutationProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  searchParams.set("page", "2");
  searchParams.append("tag", "typescript");
  searchParams.delete("temporary");

  return (
    <section>
      <h3>Modifying query parameters</h3>

      <p>Updated query: {searchParams.toString()}</p>
    </section>
  );
};

/**
 * Demonstrates constructing query parameters from scratch without manually
 * concatenating strings or handling URL encoding.
 */
export const UrlQueryParametersConstructionExample: FC<UrlQueryParametersConstructionProps> = ({
  baseUrl,
}: UrlQueryParametersConstructionProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams();

  searchParams.set("category", "books");
  searchParams.set("page", "2");

  const url: URL = new URL(baseUrl);

  url.search = searchParams.toString();

  return (
    <section>
      <h3>Constructing query parameters</h3>

      <p>{url.href}</p>
    </section>
  );
};

/**
 * Demonstrates that URLSearchParams handles encoding of characters that have
 * special meaning in a URL query string.
 */
export const UrlQueryParametersEncodingExample: FC<UrlQueryParametersEncodingProps> = ({
  queryString,
}: UrlQueryParametersEncodingProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const value: string | null = searchParams.get("search");

  const serialized: string = searchParams.toString();

  return (
    <section>
      <h3>Handling encoded query values</h3>

      <p>Decoded search value: {value ?? "(missing)"}</p>

      <p>Serialized query: {serialized || "(empty)"}</p>
    </section>
  );
};

/**
 * Demonstrates the difference between checking whether a parameter exists
 * and checking whether its value is non-empty.
 */
export const UrlQueryParametersPresenceExample: FC<UrlQueryParametersPresenceProps> = ({
  queryString,
}: UrlQueryParametersPresenceProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const enabledValue: string | null = searchParams.get("enabled");

  const hasEnabled: boolean = searchParams.has("enabled");

  const hasNonEmptyEnabledValue: boolean = enabledValue !== null && enabledValue.length > 0;

  return (
    <section>
      <h3>Checking parameter presence</h3>

      <p>Parameter exists: {hasEnabled ? "Yes" : "No"}</p>

      <p>Parameter has a non-empty value: {hasNonEmptyEnabledValue ? "Yes" : "No"}</p>

      <p>Value: {enabledValue ?? "(missing)"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UrlQueryParametersContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>URL Query Parameters</h1>

      <h2>1. Reading a query parameter</h2>
      <UrlQueryParametersReadExample queryString="?category=books&page=2" />

      <h2>2. Reading repeated query parameters</h2>
      <UrlQueryParametersRepeatedExample queryString="?tag=react&tag=typescript&tag=web" />

      <h2>3. Modifying query parameters</h2>
      <UrlQueryParametersMutationExample queryString="?category=books&page=1&temporary=yes&tag=react" />

      <h2>4. Constructing query parameters</h2>
      <UrlQueryParametersConstructionExample baseUrl="https://example.com/products" />

      <h2>5. Handling encoded query values</h2>
      <UrlQueryParametersEncodingExample queryString="?search=React%20%26%20TypeScript" />

      <h2>6. Checking parameter presence</h2>
      <UrlQueryParametersPresenceExample queryString="?enabled" />
    </main>
  );
};

export default UrlQueryParametersContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Query parameters are key-value pairs following the `?` in a URL.
// - `URLSearchParams` provides structured query-string operations.
// - `get()` returns the first value associated with a parameter name.
// - `getAll()` returns every value associated with a repeated parameter name.
// - `set()` replaces existing values for a parameter name.
// - `append()` adds another value without removing existing values.
// - `delete()` removes all values associated with a parameter name.
// - `has()` checks whether a parameter name exists, even when its value is empty.
// - `URLSearchParams` handles query-string encoding and decoding.
// - A missing parameter returns `null` from `get()`, while a present parameter without a value returns an empty string.
// - Query parameters should be treated as strings and explicitly converted when application logic requires numbers, booleans, or other types.

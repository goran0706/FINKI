/**
 * URLSearchParams
 * ===============
 *
 * `URLSearchParams` is a Web API for parsing, reading, modifying, and
 * serializing the query component of a URL. It represents query parameters as
 * an ordered sequence of name-value pairs rather than as a plain object.
 *
 * A `URLSearchParams` instance can be created from a query string, an iterable
 * of key-value pairs, or a record of string values. When constructed from a
 * query string, an initial leading `?` is ignored.
 *
 * Query parameter names can occur more than once. For example,
 * `?tag=react&tag=typescript` contains two `tag` entries. `get()` returns the
 * first matching value, while `getAll()` returns every matching value.
 *
 * `URLSearchParams` decodes percent-encoded values when they are read and
 * percent-encodes values when the collection is serialized with `toString()`.
 * Its serialization uses `application/x-www-form-urlencoded` rules, which
 * means spaces are serialized as `+`.
 *
 * `set()` replaces all existing values for a name with one value, whereas
 * `append()` adds another pair. `delete()` removes all values for a name.
 * `sort()` orders entries by their parameter names while preserving the
 * relative order of values belonging to the same name.
 *
 * `URLSearchParams` is mutable. When it is created from `URL.searchParams`,
 * changes to the `URLSearchParams` object update the associated URL's query
 * string, and assigning a URL's `search` property updates its associated
 * search parameters.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UrlSearchParamsConstructionProps {
  readonly category: string;
  readonly page: string;
}

export interface UrlSearchParamsReadProps {
  readonly queryString: string;
}

export interface UrlSearchParamsRepeatedProps {
  readonly queryString: string;
}

export interface UrlSearchParamsMutationProps {
  readonly queryString: string;
}

export interface UrlSearchParamsIterationProps {
  readonly queryString: string;
}

export interface UrlSearchParamsSortingProps {
  readonly queryString: string;
}

export interface UrlSearchParamsUrlBindingProps {
  readonly url: string;
}

export interface UrlSearchParamsEdgeCaseProps {
  readonly queryString: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Constructs `URLSearchParams` from individual key-value pairs.
 */
export const UrlSearchParamsConstructionExample: FC<UrlSearchParamsConstructionProps> = ({
  category,
  page,
}: UrlSearchParamsConstructionProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams();

  searchParams.set("category", category);
  searchParams.set("page", page);

  return (
    <section>
      <h3>Constructing search parameters</h3>

      <p>Query string: {searchParams.toString()}</p>
    </section>
  );
};

/**
 * Reads individual values from a `URLSearchParams` instance.
 */
export const UrlSearchParamsReadExample: FC<UrlSearchParamsReadProps> = ({
  queryString,
}: UrlSearchParamsReadProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const category: string | null = searchParams.get("category");

  const page: string | null = searchParams.get("page");

  return (
    <section>
      <h3>Reading search parameters</h3>

      <p>Category: {category ?? "(missing)"}</p>

      <p>Page: {page ?? "(missing)"}</p>
    </section>
  );
};

/**
 * Demonstrates repeated parameter names and the distinction between `get()`
 * and `getAll()`.
 */
export const UrlSearchParamsRepeatedExample: FC<UrlSearchParamsRepeatedProps> = ({
  queryString,
}: UrlSearchParamsRepeatedProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const firstTag: string | null = searchParams.get("tag");

  const tags: string[] = searchParams.getAll("tag");

  return (
    <section>
      <h3>Reading repeated parameters</h3>

      <p>First tag: {firstTag ?? "(missing)"}</p>

      <p>All tags: {tags.length > 0 ? tags.join(", ") : "(none)"}</p>
    </section>
  );
};

/**
 * Demonstrates the mutation methods provided by `URLSearchParams`.
 */
export const UrlSearchParamsMutationExample: FC<UrlSearchParamsMutationProps> = ({
  queryString,
}: UrlSearchParamsMutationProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  searchParams.set("page", "2");
  searchParams.append("tag", "typescript");
  searchParams.delete("temporary");

  return (
    <section>
      <h3>Mutating search parameters</h3>

      <p>Updated query: {searchParams.toString()}</p>
    </section>
  );
};

/**
 * Iterates over the ordered key-value entries stored by `URLSearchParams`.
 */
export const UrlSearchParamsIterationExample: FC<UrlSearchParamsIterationProps> = ({
  queryString,
}: UrlSearchParamsIterationProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const entries: Array<readonly [string, string]> = Array.from(searchParams.entries());

  return (
    <section>
      <h3>Iterating over search parameters</h3>

      {entries.length > 0 ? (
        <ul>
          {entries.map((entry: readonly [string, string], index: number): ReactNode => (
            <li key={`${entry[0]}-${index}`}>
              {entry[0]} = {entry[1]}
            </li>
          ))}
        </ul>
      ) : (
        <p>No parameters.</p>
      )}
    </section>
  );
};

/**
 * Sorts parameters by name. When duplicate names exist, their relative value
 * order is preserved by the stable sorting behavior of `URLSearchParams`.
 */
export const UrlSearchParamsSortingExample: FC<UrlSearchParamsSortingProps> = ({
  queryString,
}: UrlSearchParamsSortingProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const beforeSort: string = searchParams.toString();

  searchParams.sort();

  const afterSort: string = searchParams.toString();

  return (
    <section>
      <h3>Sorting search parameters</h3>

      <p>Before sorting: {beforeSort}</p>

      <p>After sorting: {afterSort}</p>
    </section>
  );
};

/**
 * Demonstrates that `URL.searchParams` is a live view of the URL's query
 * parameters. Mutating it updates the URL's serialized query string.
 */
export const UrlSearchParamsUrlBindingExample: FC<UrlSearchParamsUrlBindingProps> = ({
  url,
}: UrlSearchParamsUrlBindingProps): ReactNode => {
  let parsedUrl: URL | null = null;

  try {
    parsedUrl = new URL(url);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl === null) {
    return (
      <section>
        <h3>Binding search parameters to a URL</h3>
        <p>Invalid URL.</p>
      </section>
    );
  }

  parsedUrl.searchParams.set("page", "2");

  parsedUrl.searchParams.append("tag", "react");

  return (
    <section>
      <h3>Binding search parameters to a URL</h3>

      <p>Updated URL: {parsedUrl.href}</p>

      <p>Updated search: {parsedUrl.search}</p>
    </section>
  );
};

/**
 * Demonstrates the difference between a missing parameter and a present
 * parameter whose value is an empty string.
 */
export const UrlSearchParamsEdgeCaseExample: FC<UrlSearchParamsEdgeCaseProps> = ({
  queryString,
}: UrlSearchParamsEdgeCaseProps): ReactNode => {
  const searchParams: URLSearchParams = new URLSearchParams(queryString);

  const enabled: string | null = searchParams.get("enabled");

  const hasEnabled: boolean = searchParams.has("enabled");

  return (
    <section>
      <h3>Handling missing and empty values</h3>

      <p>Exists: {hasEnabled ? "Yes" : "No"}</p>

      <p>Value: {enabled === null ? "(missing)" : enabled.length === 0 ? "(empty)" : enabled}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UrlSearchParamsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>URLSearchParams</h1>

      <h2>1. Constructing search parameters</h2>
      <UrlSearchParamsConstructionExample category="books" page="2" />

      <h2>2. Reading search parameters</h2>
      <UrlSearchParamsReadExample queryString="?category=books&page=2" />

      <h2>3. Reading repeated parameters</h2>
      <UrlSearchParamsRepeatedExample queryString="?tag=react&tag=typescript&tag=web" />

      <h2>4. Mutating search parameters</h2>
      <UrlSearchParamsMutationExample queryString="?category=books&page=1&tag=react&temporary=yes" />

      <h2>5. Iterating over search parameters</h2>
      <UrlSearchParamsIterationExample queryString="?category=books&page=2&sort=asc" />

      <h2>6. Sorting search parameters</h2>
      <UrlSearchParamsSortingExample queryString="?z=last&category=books&a=first&category=magazines" />

      <h2>7. Binding search parameters to a URL</h2>
      <UrlSearchParamsUrlBindingExample url="https://example.com/products?category=books" />

      <h2>8. Handling missing and empty values</h2>
      <UrlSearchParamsEdgeCaseExample queryString="?enabled" />
    </main>
  );
};

export default UrlSearchParamsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `URLSearchParams` represents URL query parameters as an ordered collection of key-value pairs.
// - A leading `?` is accepted when constructing `URLSearchParams` from a query string.
// - `get()` returns the first value for a parameter name.
// - `getAll()` returns every value for a parameter name.
// - `has()` checks whether a parameter name exists.
// - `set()` replaces all existing values for a parameter name.
// - `append()` adds another value while preserving existing values.
// - `delete()` removes all values for a parameter name.
// - `toString()` serializes the collection using URL form-encoding rules.
// - `sort()` orders entries by parameter name while preserving the order of duplicate values.
// - `URL.searchParams` is connected to its `URL` object, so mutations update the URL.
// - Missing parameters return `null` from `get()`, while present parameters without values return an empty string.
// - Query parameters should be treated as strings until application code explicitly converts them to another type.

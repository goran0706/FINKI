/**
 * Route Query Parameters
 * =======================
 *
 * Query parameters are key-value pairs stored in the URL's search string after `?`.
 * They are useful for URL state such as filters, sorting, pagination, search terms,
 * and other values that should be shareable and restorable through the browser URL.
 *
 * React Router provides `useSearchParams` for reading and updating query parameters.
 * It returns a `URLSearchParams` instance and a setter that navigates to the updated
 * search string. Query parameter values are always strings, so application-specific
 * conversion and validation must be performed explicitly.
 *
 * Unlike route parameters, query parameters are not declared in the route path.
 * A route such as `/products` can therefore receive `/products?category=books&page=2`
 * without changing its route definition.
 */

import { type FC, type ReactElement, useSearchParams } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ProductFilters {
  readonly category: string;
  readonly sort: string;
  readonly page: number;
}

export interface QueryParameterState {
  readonly search: string;
  readonly category: string;
  readonly sort: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates reading a single query parameter.
 *
 * `URLSearchParams.get` returns the parameter value as a string or `null`
 * when the parameter does not exist.
 */
export const SingleQueryParameterExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const category: string | null = searchParams.get("category");

  return (
    <div>
      <p>Category: {category ?? "Not specified"}</p>
    </div>
  );
};

/**
 * Demonstrates reading multiple query parameters.
 *
 * Each query parameter is read independently from the `URLSearchParams`
 * object returned by `useSearchParams`.
 */
export const MultipleQueryParametersExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const category: string | null = searchParams.get("category");
  const sort: string | null = searchParams.get("sort");

  return (
    <div>
      <p>Category: {category ?? "All"}</p>
      <p>Sort: {sort ?? "relevance"}</p>
    </div>
  );
};

/**
 * Demonstrates reading all values for a repeated query parameter.
 *
 * `get` returns only the first value, while `getAll` returns every value
 * associated with the same parameter name.
 */
export const RepeatedQueryParameterExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const tags: string[] = searchParams.getAll("tag");

  return (
    <div>
      <p>Tags: {tags.length > 0 ? tags.join(", ") : "None"}</p>
    </div>
  );
};

/**
 * Demonstrates updating a query parameter with `setSearchParams`.
 *
 * Setting a parameter replaces its existing value in the generated search
 * string and navigates to the resulting URL.
 */
export const SetQueryParameterExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategoryChange = (): void => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      category: "books",
    });
  };

  return (
    <button type="button" onClick={handleCategoryChange}>
      Set category to books
    </button>
  );
};

/**
 * Demonstrates removing a query parameter.
 *
 * `delete` removes every value associated with the specified parameter name.
 */
export const DeleteQueryParameterExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleDelete = (): void => {
    const nextSearchParams: URLSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("category");
    setSearchParams(nextSearchParams);
  };

  return (
    <button type="button" onClick={handleDelete}>
      Remove category
    </button>
  );
};

/**
 * Demonstrates updating one query parameter while preserving the others.
 *
 * Creating a new `URLSearchParams` instance from the current parameters
 * prevents unrelated query parameters from being discarded.
 */
export const PreserveQueryParametersExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (): void => {
    const nextSearchParams: URLSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", "price");
    setSearchParams(nextSearchParams);
  };

  return (
    <button type="button" onClick={handleSortChange}>
      Sort by price
    </button>
  );
};

/**
 * Demonstrates converting a query parameter from a string to a number.
 *
 * Query parameters are strings at the URL boundary. The application must
 * explicitly convert and validate values before treating them as numbers.
 */
export const NumericQueryParameterExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const pageValue: string | null = searchParams.get("page");
  const page: number = Number(pageValue);
  const isValidPage: boolean = Number.isInteger(page) && page > 0;

  return (
    <div>
      <p>Raw page value: {pageValue ?? "Not specified"}</p>
      <p>Parsed page: {isValidPage ? page : "Invalid"}</p>
    </div>
  );
};

/**
 * Demonstrates a boolean query parameter.
 *
 * URLSearchParams does not automatically convert `"true"` and `"false"`
 * into boolean values, so the application must define its own conversion rule.
 */
export const BooleanQueryParameterExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const previewValue: string | null = searchParams.get("preview");
  const previewEnabled: boolean = previewValue === "true";

  return (
    <div>
      <p>Preview: {previewEnabled ? "Enabled" : "Disabled"}</p>
    </div>
  );
};

/**
 * Demonstrates replacing query-string history instead of pushing a new entry.
 *
 * `replace: true` updates the current history entry, which can be useful for
 * transient URL state that should not create a separate Back-navigation step.
 */
export const ReplaceQueryParameterExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleReplace = (): void => {
    const nextSearchParams: URLSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("view", "grid");

    setSearchParams(nextSearchParams, {
      replace: true,
    });
  };

  return (
    <button type="button" onClick={handleReplace}>
      Set grid view without new history entry
    </button>
  );
};

/**
 * Demonstrates query parameters used as filter state.
 *
 * Because the filter values are stored in the URL, the resulting URL can be
 * bookmarked, copied, refreshed, and revisited with the same filter state.
 */
export const QueryParameterFilterExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = {
    category: searchParams.get("category") ?? "all",
    sort: searchParams.get("sort") ?? "relevance",
    page: Number(searchParams.get("page") ?? "1"),
  };

  const handleBooksFilter = (): void => {
    const nextSearchParams: URLSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", "books");
    nextSearchParams.set("sort", "price");
    nextSearchParams.set("page", "1");
    setSearchParams(nextSearchParams);
  };

  return (
    <div>
      <p>Category: {filters.category}</p>
      <p>Sort: {filters.sort}</p>
      <p>Page: {filters.page}</p>
      <button type="button" onClick={handleBooksFilter}>
        Filter books
      </button>
    </div>
  );
};

/**
 * Demonstrates reading the complete search string.
 *
 * `useLocation` exposes the raw `search` portion of the current location,
 * including the leading `?`.
 */
export const RawSearchStringExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <div>
      <p>Search string: {location.search || "No query parameters"}</p>
    </div>
  );
};

/**
 * Demonstrates a common misconception about query parameters.
 *
 * Query parameters do not require separate route definitions. The route remains
 * `/products` whether the URL contains no search string or several query parameters.
 */
export const QueryParametersDoNotDefineRoutesExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const category: string | null = searchParams.get("category");

  return (
    <div>
      <p>This is still the same products route.</p>
      <p>Category: {category ?? "All"}</p>
    </div>
  );
};

/**
 * Demonstrates that query parameter values are strings.
 *
 * TypeScript generics do not change the runtime representation of URL values.
 * Explicit parsing remains necessary when an application expects another type.
 */
export const QueryParameterTypingGotchaExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const page: string | null = searchParams.get("page");

  return (
    <div>
      <p>Runtime value: {page ?? "Missing"}</p>
      <p>Runtime type: {typeof page}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Query Parameters</h2>
      <p>Open the products route with different query strings to inspect how URL search parameters work.</p>

      <nav aria-label="Query parameter examples">
        <ul>
          <li>
            <Link to="/products?category=books">Single parameter</Link>
          </li>
          <li>
            <Link to="/products?category=books&sort=price">Multiple parameters</Link>
          </li>
          <li>
            <Link to="/products?tag=react&tag=typescript&tag=router">Repeated parameter</Link>
          </li>
          <li>
            <Link to="/products?page=3">Numeric parameter</Link>
          </li>
          <li>
            <Link to="/products?preview=true">Boolean parameter</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const ProductsPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Products</h2>

      <section>
        <h3>1. Single Query Parameter</h3>
        <SingleQueryParameterExample />
      </section>

      <section>
        <h3>2. Multiple Query Parameters</h3>
        <MultipleQueryParametersExample />
      </section>

      <section>
        <h3>3. Repeated Query Parameter</h3>
        <RepeatedQueryParameterExample />
      </section>

      <section>
        <h3>4. Set Query Parameter</h3>
        <SetQueryParameterExample />
      </section>

      <section>
        <h3>5. Delete Query Parameter</h3>
        <DeleteQueryParameterExample />
      </section>

      <section>
        <h3>6. Preserve Existing Parameters</h3>
        <PreserveQueryParametersExample />
      </section>

      <section>
        <h3>7. Numeric Query Parameter</h3>
        <NumericQueryParameterExample />
      </section>

      <section>
        <h3>8. Boolean Query Parameter</h3>
        <BooleanQueryParameterExample />
      </section>

      <section>
        <h3>9. Replace Query Parameter</h3>
        <ReplaceQueryParameterExample />
      </section>

      <section>
        <h3>10. Query Parameter Filter State</h3>
        <QueryParameterFilterExample />
      </section>

      <section>
        <h3>11. Raw Search String</h3>
        <RawSearchStringExample />
      </section>

      <section>
        <h3>12. Query Parameters Do Not Define Routes</h3>
        <QueryParametersDoNotDefineRoutesExample />
      </section>

      <section>
        <h3>13. Query Parameter Typing</h3>
        <QueryParameterTypingGotchaExample />
      </section>

      <p>
        <Link to="/">Back home</Link>
      </p>
    </main>
  );
};

const QueryParametersDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default QueryParametersDemo;

// ---------------------------------------------------------------------
// Summary
// Query parameters are stored in the URL search string after `?`.
// `useSearchParams` provides access to the current query parameters and a setter for updates.
// `URLSearchParams.get` returns one value or `null` when the parameter is absent.
// `getAll` returns every value for a repeated parameter name.
// Query parameters are strings and must be explicitly converted and validated for other types.
// Updating one parameter should preserve unrelated parameters when they are still needed.
// `replace: true` updates the current history entry instead of creating another one.
// Query parameters can represent shareable URL state such as filters, sorting, and pagination.
// Query parameters are separate from route parameters and do not require separate route definitions.
// `useLocation().search` provides the raw search string, including its leading `?`.
// ---------------------------------------------------------------------

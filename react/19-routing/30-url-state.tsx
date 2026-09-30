/**
 * URL State
 * =========
 *
 * URL state is application state represented directly in the browser URL. It can
 * include path parameters, query parameters, and other navigation information
 * that should remain addressable, shareable, and restorable through browser history.
 *
 * React Router provides `useParams` for path parameters and `useSearchParams` for
 * query parameters. URL state is especially useful for filters, sorting, pagination,
 * search terms, selected tabs, and other state that should survive refreshes or be
 * shared through a link.
 *
 * URL state differs from navigation state: navigation state is associated with a
 * history entry without appearing in the URL, while URL state is encoded into the
 * URL itself and can therefore be copied, bookmarked, and restored independently.
 */

import { type FC, type ReactElement } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SearchState {
  readonly query: string;
  readonly category: string;
}

export interface FilterState {
  readonly category: string;
  readonly sort: string;
}

export interface PaginationState {
  readonly page: number;
}

export interface ProductRouteParams {
  readonly productId: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates reading a path parameter as URL state.
 *
 * Path parameters identify a resource or route segment and are available
 * through `useParams`.
 */
export const PathParameterStateExample: FC = (): ReactElement => {
  const { productId } = useParams<"productId">();

  return (
    <section>
      <h2>1. Path parameter state</h2>
      <p>Product ID: {productId ?? "No product ID was provided."}</p>
      <p>The product identifier is part of the URL path.</p>
    </section>
  );
};

/**
 * Demonstrates reading query parameters with `useSearchParams`.
 *
 * Query parameters are useful when multiple independent pieces of state need
 * to be represented in a shareable URL.
 */
export const QueryParameterStateExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();

  const query: string = searchParams.get("q") ?? "";
  const category: string = searchParams.get("category") ?? "all";

  return (
    <section>
      <h2>2. Query parameter state</h2>
      <p>Search: {query || "No search query."}</p>
      <p>Category: {category}</p>
    </section>
  );
};

/**
 * Demonstrates updating query parameters with `setSearchParams`.
 *
 * Updating search parameters causes the URL to change and triggers normal
 * React Router navigation behavior.
 */
export const UpdateQueryParametersExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory: string = searchParams.get("category") ?? "all";

  const handleCategoryChange = (category: string): void => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (category === "all") {
      nextSearchParams.delete("category");
    } else {
      nextSearchParams.set("category", category);
    }

    setSearchParams(nextSearchParams);
  };

  return (
    <section>
      <h2>3. Update query parameters</h2>
      <p>Current category: {currentCategory}</p>
      <button type="button" onClick={() => handleCategoryChange("all")}>
        All
      </button>{" "}
      <button type="button" onClick={() => handleCategoryChange("books")}>
        Books
      </button>{" "}
      <button type="button" onClick={() => handleCategoryChange("electronics")}>
        Electronics
      </button>
    </section>
  );
};

/**
 * Demonstrates multiple pieces of URL state working together.
 *
 * Search, filtering, and sorting can coexist in the same query string because
 * each value has its own query parameter.
 */
export const CombinedUrlStateExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: string = searchParams.get("q") ?? "";
  const category: string = searchParams.get("category") ?? "all";
  const sort: string = searchParams.get("sort") ?? "relevance";

  const handleSortChange = (sortValue: string): void => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", sortValue);
    setSearchParams(nextSearchParams);
  };

  return (
    <section>
      <h2>4. Combined URL state</h2>
      <p>Search: {query || "none"}</p>
      <p>Category: {category}</p>
      <p>Sort: {sort}</p>
      <button type="button" onClick={() => handleSortChange("price-ascending")}>
        Sort by price
      </button>{" "}
      <button type="button" onClick={() => handleSortChange("name")}>
        Sort by name
      </button>
    </section>
  );
};

/**
 * Demonstrates URL state used for filtering.
 *
 * Filters encoded in the URL can be restored when the page is refreshed or
 * when the URL is opened in another browser context.
 */
export const UrlFilterStateExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category: string = searchParams.get("category") ?? "all";

  const handleFilterChange = (nextCategory: string): void => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", nextCategory);
    setSearchParams(nextSearchParams);
  };

  return (
    <section>
      <h2>5. URL filter state</h2>
      <p>Active filter: {category}</p>
      <button type="button" onClick={() => handleFilterChange("all")}>
        All
      </button>{" "}
      <button type="button" onClick={() => handleFilterChange("available")}>
        Available
      </button>{" "}
      <button type="button" onClick={() => handleFilterChange("sale")}>
        Sale
      </button>
    </section>
  );
};

/**
 * Demonstrates pagination represented in the URL.
 *
 * Pagination state belongs in the URL when the current page should be
 * bookmarkable, shareable, and recoverable through browser navigation.
 */
export const UrlPaginationStateExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage: string = searchParams.get("page") ?? "1";
  const parsedPage: number = Number(rawPage);
  const page: number = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const setPage = (nextPage: number): void => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", String(nextPage));
    setSearchParams(nextSearchParams);
  };

  return (
    <section>
      <h2>6. URL pagination state</h2>
      <p>Current page: {page}</p>
      <button type="button" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}>
        Previous
      </button>{" "}
      <button type="button" onClick={() => setPage(page + 1)}>
        Next
      </button>
    </section>
  );
};

/**
 * Demonstrates URL state used for a selected tab.
 *
 * A tab represented by the URL can be linked directly and restored after
 * refreshing the page.
 */
export const UrlTabStateExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: string = searchParams.get("tab") ?? "overview";

  const selectTab = (tab: string): void => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("tab", tab);
    setSearchParams(nextSearchParams);
  };

  return (
    <section>
      <h2>7. URL tab state</h2>
      <p>Active tab: {activeTab}</p>
      <button type="button" onClick={() => selectTab("overview")}>
        Overview
      </button>{" "}
      <button type="button" onClick={() => selectTab("reviews")}>
        Reviews
      </button>{" "}
      <button type="button" onClick={() => selectTab("specifications")}>
        Specifications
      </button>
    </section>
  );
};

/**
 * Demonstrates reading URL state through `useLocation`.
 *
 * `useLocation` provides the complete location object, including pathname,
 * search, hash, and navigation state. Query parameters should still be parsed
 * through the URL search parameter APIs rather than manually splitting strings.
 */
export const LocationUrlStateExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <section>
      <h2>8. Location URL state</h2>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search || "No query string."}</p>
      <p>Hash: {location.hash || "No hash."}</p>
    </section>
  );
};

/**
 * Demonstrates constructing a URL with query parameters before navigation.
 *
 * `URLSearchParams` handles encoding of parameter values and avoids manual
 * string concatenation.
 */
export const ConstructUrlStateExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleSearch = (): void => {
    const searchParams = new URLSearchParams({
      q: "wireless headphones",
      category: "electronics",
    });

    navigate(`/products?${searchParams.toString()}`);
  };

  return (
    <section>
      <h2>9. Construct URL state</h2>
      <button type="button" onClick={handleSearch}>
        Search products
      </button>
    </section>
  );
};

/**
 * Demonstrates that URL state survives a normal page refresh because the
 * state is represented by the URL itself.
 */
export const RefreshableUrlStateExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();

  const query: string = searchParams.get("q") ?? "";

  return (
    <section>
      <h2>10. Refreshable URL state</h2>
      <p>Search query: {query || "none"}</p>
      <p>Refreshing the page preserves this value because it is encoded in the URL.</p>
    </section>
  );
};

/**
 * Demonstrates that URL state can be shared.
 *
 * Anyone who opens the same URL can reconstruct the represented URL state,
 * provided the underlying route and data remain available.
 */
export const ShareableUrlStateExample: FC = (): ReactElement => {
  const [searchParams] = useSearchParams();

  const query: string = searchParams.get("q") ?? "";
  const category: string = searchParams.get("category") ?? "all";

  return (
    <section>
      <h2>11. Shareable URL state</h2>
      <p>Search: {query || "none"}</p>
      <p>Category: {category}</p>
      <p>These values can be represented by a URL that another user can open.</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between URL state and navigation state.
 *
 * URL state appears in the address bar and can be shared. Navigation state is
 * associated with the history entry without being encoded into the URL.
 */
export const UrlStateVsNavigationStateExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <section>
      <h2>12. URL state versus navigation state</h2>
      <p>
        URL: {location.pathname}
        {location.search}
      </p>
      <p>
        URL state is addressable and shareable. Navigation state is transient context associated with the history entry.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ProductsLayout: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>
      <p>The product route demonstrates path and query state together.</p>
      <Outlet />
    </main>
  );
};

const ProductsPage: FC = (): ReactElement => {
  const { productId } = useParams<"productId">();
  const [searchParams] = useSearchParams();

  const query: string = searchParams.get("q") ?? "";
  const category: string = searchParams.get("category") ?? "all";

  return (
    <section>
      <h2>Product route</h2>
      <p>Product ID: {productId ?? "unknown"}</p>
      <p>Search: {query || "none"}</p>
      <p>Category: {category}</p>
    </section>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>URL State</h1>
      <p>Select an example to inspect state represented by the browser URL.</p>

      <nav aria-label="URL state examples">
        <ul>
          <li>
            <Link to="/products/product-100">Path parameter</Link>
          </li>
          <li>
            <Link to="/query?q=headphones&category=electronics">Query parameters</Link>
          </li>
          <li>
            <Link to="/update-query?category=books">Update query parameters</Link>
          </li>
          <li>
            <Link to="/combined?q=headphones&category=electronics&sort=relevance">Combined URL state</Link>
          </li>
          <li>
            <Link to="/filter?category=available">URL filter state</Link>
          </li>
          <li>
            <Link to="/pagination?page=3">URL pagination state</Link>
          </li>
          <li>
            <Link to="/tabs?tab=reviews">URL tab state</Link>
          </li>
          <li>
            <Link to="/location?view=compact#results">Location URL state</Link>
          </li>
          <li>
            <Link to="/construct">Construct URL state</Link>
          </li>
          <li>
            <Link to="/refresh?q=example">Refreshable URL state</Link>
          </li>
          <li>
            <Link to="/share?q=example&category=books">Shareable URL state</Link>
          </li>
          <li>
            <Link to="/comparison">URL state versus navigation state</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const UrlStateDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/products",
      element: <ProductsLayout />,
      children: [
        {
          path: ":productId",
          element: <ProductsPage />,
        },
      ],
    },
    {
      path: "/query",
      element: <QueryParameterStateExample />,
    },
    {
      path: "/update-query",
      element: <UpdateQueryParametersExample />,
    },
    {
      path: "/combined",
      element: <CombinedUrlStateExample />,
    },
    {
      path: "/filter",
      element: <UrlFilterStateExample />,
    },
    {
      path: "/pagination",
      element: <UrlPaginationStateExample />,
    },
    {
      path: "/tabs",
      element: <UrlTabStateExample />,
    },
    {
      path: "/location",
      element: <LocationUrlStateExample />,
    },
    {
      path: "/construct",
      element: <ConstructUrlStateExample />,
    },
    {
      path: "/refresh",
      element: <RefreshableUrlStateExample />,
    },
    {
      path: "/share",
      element: <ShareableUrlStateExample />,
    },
    {
      path: "/comparison",
      element: <UrlStateVsNavigationStateExample />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default UrlStateDemo;

// ---------------------------------------------------------------------
// Summary
// URL state represents application state directly in the browser URL.
// Path parameters identify resources or route segments.
// Query parameters represent additional state such as search, filtering, sorting, and pagination.
// `useParams` reads dynamic path parameters.
// `useSearchParams` reads and updates query parameters.
// `URLSearchParams` provides structured parsing, updating, and encoding of query parameters.
// URL state survives refreshes because the state is represented by the URL.
// URL state can be bookmarked and shared with other users.
// Multiple URL state values can coexist in the same query string.
// Invalid or missing URL values should be handled explicitly.
// URL state differs from navigation state because it is encoded into the addressable URL.
// ---------------------------------------------------------------------

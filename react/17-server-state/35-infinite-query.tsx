/**
 * Infinite Query
 * ==============
 *
 * An infinite query manages a sequence of pages as one logical query while allowing the client
 * to load additional pages incrementally. Instead of replacing the currently displayed page,
 * fetching the next page appends its results to the existing collection of loaded pages.
 *
 * Infinite queries are useful for feeds, activity histories, search results, and other interfaces
 * where users consume an ordered collection progressively. The query maintains page boundaries
 * and pagination metadata so the next request can be derived from the previous response.
 *
 * The pagination mechanism can use offsets, cursors, or another server-provided continuation value.
 * The important distinction is that the query retains multiple pages as part of one query result.
 * Loading another page therefore extends the existing result rather than creating an unrelated
 * query for each page.
 *
 * In a real query library, the query cache commonly stores both the individual page data and the
 * page parameters used to retrieve those pages. When a next-page request succeeds, the new page
 * is appended to the existing pages while the corresponding page parameter is appended alongside it.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface UserPage {
  readonly data: readonly User[];
  readonly nextCursor: number | null;
}

export interface InfiniteQueryData<TData> {
  readonly pages: readonly TData[];
  readonly pageParams: readonly number[];
}

export interface InfiniteQueryProps {
  readonly initialPage: UserPage;
  readonly nextPages: readonly UserPage[];
}

export interface PageDisplayProps {
  readonly page: UserPage;
  readonly pageNumber: number;
}

export interface InfiniteDataDisplayProps {
  readonly data: InfiniteQueryData<UserPage>;
}

export interface InfiniteQueryControlsProps {
  readonly hasNextPage: boolean;
  readonly isFetchingNextPage: boolean;
  readonly onFetchNextPage: () => void;
}

export interface PageParameterDisplayProps {
  readonly pageParams: readonly number[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PageDisplay: FC<PageDisplayProps> = ({ page, pageNumber }): ReactElement => {
  return (
    <section>
      <h3>Page {pageNumber}</h3>
      <ul>
        {page.data.map((user: User) => (
          <li key={user.id}>
            {user.name} — {user.role}
          </li>
        ))}
      </ul>
      <p>Next cursor: {page.nextCursor ?? "null"}</p>
    </section>
  );
};

export const InfiniteDataDisplay: FC<InfiniteDataDisplayProps> = ({ data }): ReactElement => {
  const allUsers: User[] = data.pages.flatMap((page: UserPage) => [...page.data]);

  return (
    <div>
      <p>Loaded pages: {data.pages.length}</p>
      <p>Loaded users: {allUsers.length}</p>
      <ul>
        {allUsers.map((user: User) => (
          <li key={user.id}>
            {user.name} — {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PageParameterDisplay: FC<PageParameterDisplayProps> = ({ pageParams }): ReactElement => {
  return (
    <div>
      <p>Page parameters used:</p>
      <ol>
        {pageParams.map((pageParam: number, index: number) => (
          <li key={`${pageParam}-${index}`}>{pageParam}</li>
        ))}
      </ol>
    </div>
  );
};

export const InfiniteQueryControls: FC<InfiniteQueryControlsProps> = ({
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={!hasNextPage || isFetchingNextPage} onClick={onFetchNextPage}>
        {isFetchingNextPage ? "Loading..." : "Load more"}
      </button>
      {!hasNextPage && <p>No more pages available.</p>}
    </div>
  );
};

export const InfiniteQuery: FC<InfiniteQueryProps> = ({ initialPage, nextPages }): ReactElement => {
  const [pages, setPages] = useState<readonly UserPage[]>([initialPage]);
  const [pageParams, setPageParams] = useState<readonly number[]>([0]);
  const [nextPageIndex, setNextPageIndex] = useState<number>(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);

  const currentPage = pages[pages.length - 1];
  const hasNextPage = currentPage?.nextCursor !== null && nextPageIndex < nextPages.length;

  const fetchNextPage = (): void => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    setIsFetchingNextPage(true);

    const nextPage = nextPages[nextPageIndex];

    if (!nextPage) {
      setIsFetchingNextPage(false);
      return;
    }

    window.setTimeout(() => {
      setPages((currentPages: readonly UserPage[]) => [...currentPages, nextPage]);
      setPageParams((currentParams: readonly number[]) => [
        ...currentParams,
        nextPage.nextCursor ?? nextPage.data.at(-1)?.id ?? 0,
      ]);
      setNextPageIndex((index: number) => index + 1);
      setIsFetchingNextPage(false);
    }, 700);
  };

  const infiniteData: InfiniteQueryData<UserPage> = {
    pages,
    pageParams,
  };

  return (
    <div>
      <InfiniteDataDisplay data={infiniteData} />
      {pages.map((page: UserPage, index: number) => (
        <PageDisplay key={`page-${index + 1}`} page={page} pageNumber={index + 1} />
      ))}
      <PageParameterDisplay pageParams={pageParams} />
      <InfiniteQueryControls
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
      />
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const firstPage: UserPage = {
  data: [
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Jane Smith", role: "Editor" },
    { id: 3, name: "Alex Johnson", role: "Viewer" },
    { id: 4, name: "Emily Brown", role: "Editor" },
    { id: 5, name: "Michael Davis", role: "Viewer" },
  ],
  nextCursor: 5,
};

const nextPages: readonly UserPage[] = [
  {
    data: [
      { id: 6, name: "Sarah Wilson", role: "Admin" },
      { id: 7, name: "Daniel Taylor", role: "Viewer" },
      { id: 8, name: "Olivia Anderson", role: "Editor" },
      { id: 9, name: "James Thomas", role: "Viewer" },
      { id: 10, name: "Sophia Jackson", role: "Admin" },
    ],
    nextCursor: 10,
  },
  {
    data: [
      { id: 11, name: "William White", role: "Editor" },
      { id: 12, name: "Emma Harris", role: "Viewer" },
      { id: 13, name: "Benjamin Martin", role: "Viewer" },
      { id: 14, name: "Mia Thompson", role: "Editor" },
      { id: 15, name: "Henry Garcia", role: "Admin" },
    ],
    nextCursor: 15,
  },
  {
    data: [
      { id: 16, name: "Charlotte Martinez", role: "Viewer" },
      { id: 17, name: "Lucas Robinson", role: "Editor" },
      { id: 18, name: "Amelia Clark", role: "Viewer" },
      { id: 19, name: "Alexander Rodriguez", role: "Admin" },
      { id: 20, name: "Harper Lewis", role: "Editor" },
    ],
    nextCursor: null,
  },
];

const InfiniteQueryDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Individual Query Pages</h2>
      <PageDisplay page={firstPage} pageNumber={1} />

      <h2>2. Infinite Query Data Structure</h2>
      <InfiniteDataDisplay
        data={{
          pages: [firstPage],
          pageParams: [0],
        }}
      />

      <h2>3. Page Parameters</h2>
      <PageParameterDisplay pageParams={[0, 5, 10]} />

      <h2>4. Interactive Infinite Query</h2>
      <InfiniteQuery initialPage={firstPage} nextPages={nextPages} />
    </section>
  );
};

export default InfiniteQueryDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// An infinite query represents multiple loaded pages as one logical query.
// The query retains individual pages instead of replacing previous results.
// Page parameters identify the request parameters associated with each loaded page.
// The next page parameter is normally derived from metadata returned by the previous page.
// Cursor-based pagination is one common mechanism for determining the next page parameter.
// `hasNextPage` indicates whether another page can currently be requested.
// `isFetchingNextPage` describes the state of loading an additional page.
// Loading another page appends data to the existing pages rather than replacing them.
// The pages and page parameters are maintained together so their positions remain correlated.
// Infinite queries are commonly used for feeds, activity lists, and "load more" interfaces.
// An infinite query is not the same thing as an infinite scroll UI: scrolling is only one possible
// trigger for requesting the next page.

/**
 * Cursor Pagination
 * =================
 *
 * Cursor pagination divides a collection into pages by using a cursor that represents a position
 * in the dataset rather than calculating a numeric offset. The server returns a cursor with a page
 * of results, and the client sends that cursor back when requesting the next or previous page.
 *
 * A cursor is commonly derived from a stable ordering field such as an ID or creation timestamp.
 * Unlike an offset, the cursor does not require the server to skip an increasing number of records.
 * This makes cursor pagination particularly useful for large or frequently changing collections.
 *
 * Cursor pagination depends on a stable and deterministic sort order. A cursor should identify a
 * precise position in that ordering, and the server must use the same ordering when interpreting it.
 * When records are inserted or deleted between requests, cursor pagination generally avoids the
 * offset-shifting problem because subsequent requests continue from the cursor's position.
 */

import type { FC, ReactElement } from "react";
import { useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface CursorPage<TData> {
  readonly data: readonly TData[];
  readonly nextCursor: number | null;
  readonly previousCursor: number | null;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface CursorPaginationProps {
  readonly items: readonly User[];
  readonly pageSize: number;
}

export interface CursorCalculationProps {
  readonly cursor: number | null;
  readonly pageSize: number;
}

export interface CursorPageDisplayProps {
  readonly page: CursorPage<User>;
}

export interface CursorControlsProps {
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export interface CursorEdgeCaseProps {
  readonly items: readonly User[];
  readonly pageSize: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CursorCalculation: FC<CursorCalculationProps> = ({ cursor, pageSize }): ReactElement => {
  return (
    <div>
      <p>Current cursor: {cursor ?? "null"}</p>
      <p>Page size: {pageSize}</p>
      <p>Request: {cursor === null ? "first page" : `after=${cursor}`}</p>
    </div>
  );
};

export const CursorPageDisplay: FC<CursorPageDisplayProps> = ({ page }): ReactElement => {
  return (
    <div>
      <p>Returned records: {page.data.length}</p>
      <p>Next cursor: {page.nextCursor ?? "null"}</p>
      <p>Previous cursor: {page.previousCursor ?? "null"}</p>
      <ul>
        {page.data.map((user: User) => (
          <li key={user.id}>
            {user.name} — {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CursorControls: FC<CursorControlsProps> = ({
  hasNextPage,
  hasPreviousPage,
  onPrevious,
  onNext,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={!hasPreviousPage} onClick={onPrevious}>
        Previous
      </button>
      <button type="button" disabled={!hasNextPage} onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export const CursorPagination: FC<CursorPaginationProps> = ({ items, pageSize }): ReactElement => {
  const [cursor, setCursor] = useState<number | null>(null);

  const page = useMemo<CursorPage<User>>(() => {
    const startIndex = cursor === null ? 0 : items.findIndex((user: User) => user.id === cursor) + 1;

    const safeStartIndex = startIndex === 0 && cursor !== null ? items.length : startIndex;

    const data = items.slice(safeStartIndex, safeStartIndex + pageSize);
    const nextItem = items[safeStartIndex + pageSize];
    const previousItem = items[Math.max(safeStartIndex - 1, 0)];

    return {
      data,
      nextCursor: nextItem?.id ?? null,
      previousCursor: safeStartIndex > 0 ? previousItem.id : null,
      hasNextPage: safeStartIndex + pageSize < items.length,
      hasPreviousPage: safeStartIndex > 0,
    };
  }, [cursor, items, pageSize]);

  const goToNextPage = (): void => {
    if (page.nextCursor !== null) {
      setCursor(page.nextCursor);
    }
  };

  const goToPreviousPage = (): void => {
    if (page.previousCursor === null) {
      setCursor(null);
      return;
    }

    const previousCursorIndex = items.findIndex((user: User) => user.id === page.previousCursor);

    const previousPageStartIndex = Math.max(previousCursorIndex - pageSize + 1, 0);
    const previousPageCursor = previousPageStartIndex === 0 ? null : (items[previousPageStartIndex - 1]?.id ?? null);

    setCursor(previousPageCursor);
  };

  return (
    <div>
      <CursorPageDisplay page={page} />
      <CursorControls
        hasNextPage={page.hasNextPage}
        hasPreviousPage={page.hasPreviousPage}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
      />
    </div>
  );
};

export const CursorEdgeCase: FC<CursorEdgeCaseProps> = ({ items, pageSize }): ReactElement => {
  const lastPageStartIndex = Math.max(items.length - pageSize, 0);
  const lastPage = items.slice(lastPageStartIndex);
  const lastItem = lastPage[lastPage.length - 1];

  return (
    <div>
      <p>Total records: {items.length}</p>
      <p>Requested page size: {pageSize}</p>
      <p>Final page records: {lastPage.length}</p>
      <p>Final cursor: {lastItem?.id ?? "null"}</p>
      <p>Has next page: no</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const users: readonly User[] = [
  { id: 1, name: "John Doe", role: "Admin" },
  { id: 2, name: "Jane Smith", role: "Editor" },
  { id: 3, name: "Alex Johnson", role: "Viewer" },
  { id: 4, name: "Emily Brown", role: "Editor" },
  { id: 5, name: "Michael Davis", role: "Viewer" },
  { id: 6, name: "Sarah Wilson", role: "Admin" },
  { id: 7, name: "Daniel Taylor", role: "Viewer" },
  { id: 8, name: "Olivia Anderson", role: "Editor" },
  { id: 9, name: "James Thomas", role: "Viewer" },
  { id: 10, name: "Sophia Jackson", role: "Admin" },
  { id: 11, name: "William White", role: "Editor" },
  { id: 12, name: "Emma Harris", role: "Viewer" },
  { id: 13, name: "Benjamin Martin", role: "Viewer" },
  { id: 14, name: "Mia Thompson", role: "Editor" },
  { id: 15, name: "Henry Garcia", role: "Admin" },
  { id: 16, name: "Charlotte Martinez", role: "Viewer" },
  { id: 17, name: "Lucas Robinson", role: "Editor" },
  { id: 18, name: "Amelia Clark", role: "Viewer" },
  { id: 19, name: "Alexander Rodriguez", role: "Admin" },
  { id: 20, name: "Harper Lewis", role: "Editor" },
  { id: 21, name: "Daniel Lee", role: "Viewer" },
  { id: 22, name: "Evelyn Walker", role: "Editor" },
  { id: 23, name: "Matthew Hall", role: "Viewer" },
];

const CursorPaginationDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Cursor Request Parameters</h2>
      <CursorCalculation cursor={null} pageSize={5} />
      <CursorCalculation cursor={10} pageSize={5} />

      <h2>2. Cursor-Paginated Response</h2>
      <CursorPageDisplay
        page={{
          data: users.slice(0, 5),
          nextCursor: 6,
          previousCursor: null,
          hasNextPage: true,
          hasPreviousPage: false,
        }}
      />

      <h2>3. Interactive Cursor Pagination</h2>
      <CursorPagination items={users} pageSize={5} />

      <h2>4. Partial Final Page</h2>
      <CursorEdgeCase items={users} pageSize={5} />
    </section>
  );
};

export default CursorPaginationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Cursor pagination identifies a position in an ordered dataset rather than using a numeric offset.
// The first request commonly starts without a cursor, represented here by `null`.
// A subsequent request sends a cursor such as `after=10` to continue from a known position.
// The server commonly returns the next cursor together with the current page of records.
// A stable and deterministic ordering is required for cursor pagination to work correctly.
// Cursor pagination is generally better suited to large or frequently changing datasets.
// It avoids the need to skip an increasing number of records as the user moves through pages.
// Unlike offset pagination, cursor pagination does not naturally provide a total page count.
// A cursor should be treated as an opaque server-issued value in real APIs; clients should not
// assume that a cursor is always a numeric ID or expose assumptions about its internal encoding.
// Inserts and deletions can still affect results, but a stable cursor-based ordering avoids many
// of the record-shifting problems associated with numeric offsets.

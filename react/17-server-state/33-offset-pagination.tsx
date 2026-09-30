/**
 * Offset Pagination
 * =================
 *
 * Offset pagination divides a collection into fixed-size pages by calculating how many records
 * should be skipped before selecting the records for the requested page. The offset is typically
 * calculated as `(page - 1) * pageSize`, while the page size determines how many records are returned.
 *
 * An offset-based request commonly contains `offset` and `limit` parameters. For example, a request
 * with `offset=20` and `limit=10` skips the first 20 records and returns the next 10. The server can
 * also return the total number of matching records so the client can calculate the total page count.
 *
 * Offset pagination is straightforward and works well for relatively stable collections, but offsets
 * can become expensive for large datasets because the database may need to skip many records. It is
 * also sensitive to inserts and deletions between requests: when the underlying collection changes,
 * records can move between offsets, potentially causing duplicates or skipped records.
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

export interface PaginatedResponse<TData> {
  readonly data: readonly TData[];
  readonly offset: number;
  readonly limit: number;
  readonly total: number;
}

export interface OffsetPaginationProps {
  readonly items: readonly User[];
  readonly pageSize: number;
}

export interface PageDisplayProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly pageSize: number;
}

export interface PaginationControlsProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export interface OffsetCalculationProps {
  readonly currentPage: number;
  readonly pageSize: number;
}

export interface PaginatedDataProps {
  readonly response: PaginatedResponse<User>;
}

export interface OffsetEdgeCaseProps {
  readonly totalItems: number;
  readonly pageSize: number;
  readonly currentPage: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const OffsetCalculation: FC<OffsetCalculationProps> = ({ currentPage, pageSize }): ReactElement => {
  const offset = (currentPage - 1) * pageSize;

  return (
    <div>
      <p>Page: {currentPage}</p>
      <p>Page size: {pageSize}</p>
      <p>Offset: {offset}</p>
      <p>
        Request parameters: offset={offset}, limit={pageSize}
      </p>
    </div>
  );
};

export const PaginatedData: FC<PaginatedDataProps> = ({ response }): ReactElement => {
  return (
    <div>
      <p>Offset: {response.offset}</p>
      <p>Limit: {response.limit}</p>
      <p>Total: {response.total}</p>
      <ul>
        {response.data.map((user: User) => (
          <li key={user.id}>
            {user.name} — {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PageDisplay: FC<PageDisplayProps> = ({ currentPage, totalPages, totalItems, pageSize }): ReactElement => {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <p>
      Showing {firstItem}-{lastItem} of {totalItems} items. Page {currentPage} of {totalPages}.
    </p>
  );
};

export const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}): ReactElement => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div>
      <button type="button" disabled={isFirstPage} onClick={onPrevious}>
        Previous
      </button>
      <span>
        {" "}
        Page {currentPage} of {totalPages}{" "}
      </span>
      <button type="button" disabled={isLastPage} onClick={onNext}>
        Next
      </button>
    </div>
  );
};

export const OffsetEdgeCase: FC<OffsetEdgeCaseProps> = ({ totalItems, pageSize, currentPage }): ReactElement => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = (currentPage - 1) * pageSize;
  const remainingItems = Math.max(totalItems - offset, 0);
  const returnedItems = Math.min(pageSize, remainingItems);

  return (
    <div>
      <p>Total items: {totalItems}</p>
      <p>Page size: {pageSize}</p>
      <p>Current page: {currentPage}</p>
      <p>Total pages: {totalPages}</p>
      <p>Items returned on this page: {returnedItems}</p>
      <p>Offset: {offset}</p>
    </div>
  );
};

export const OffsetPagination: FC<OffsetPaginationProps> = ({ items, pageSize }): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const response = useMemo<PaginatedResponse<User>>(() => {
    const offset = (currentPage - 1) * pageSize;
    const data = items.slice(offset, offset + pageSize);

    return {
      data,
      offset,
      limit: pageSize,
      total: totalItems,
    };
  }, [currentPage, items, pageSize, totalItems]);

  const goToPreviousPage = (): void => {
    setCurrentPage((page: number) => Math.max(page - 1, 1));
  };

  const goToNextPage = (): void => {
    setCurrentPage((page: number) => Math.min(page + 1, totalPages));
  };

  return (
    <div>
      <PageDisplay currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} />
      <PaginatedData response={response} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
      />
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

const OffsetPaginationDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Offset and Limit Calculation</h2>
      <OffsetCalculation currentPage={3} pageSize={10} />

      <h2>2. Paginated Response</h2>
      <PaginatedData
        response={{
          data: users.slice(10, 20),
          offset: 10,
          limit: 10,
          total: users.length,
        }}
      />

      <h2>3. Page Information</h2>
      <PageDisplay currentPage={2} totalPages={3} totalItems={users.length} pageSize={10} />

      <h2>4. Interactive Offset Pagination</h2>
      <OffsetPagination items={users} pageSize={5} />

      <h2>5. Partial Final Page</h2>
      <OffsetEdgeCase totalItems={23} pageSize={10} currentPage={3} />
    </section>
  );
};

export default OffsetPaginationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Offset pagination identifies a page by calculating how many records must be skipped.
// The standard calculation is `(currentPage - 1) * pageSize`.
// The `limit` or page size determines how many records are returned after the offset.
// A paginated response commonly contains the returned records, offset, limit, and total count.
// `Math.ceil(total / pageSize)` calculates the number of pages when the total count is known.
// The final page may contain fewer records than the requested page size.
// Offset pagination is simple, but large offsets can become increasingly expensive for databases.
// Inserts or deletions between requests can shift offsets and cause duplicates or skipped records.
// A page number is usually a UI concept, while `offset` and `limit` are request-level parameters.

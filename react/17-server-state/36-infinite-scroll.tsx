/**
 * Infinite Scroll
 * ===============
 *
 * Infinite scroll is a user-interface pattern that automatically requests and displays additional
 * content as the user approaches the end of a scrollable list. The list grows continuously instead
 * of requiring the user to select a numbered page or explicitly activate a "Load more" control.
 *
 * A common implementation places a sentinel element after the currently rendered content and observes
 * it with the Intersection Observer API. When the sentinel becomes visible, the application requests
 * another page of data. The newly received records are appended to the existing list, and the sentinel
 * remains at the end so that it can trigger another request as the user continues scrolling.
 *
 * Infinite scroll is a UI pattern rather than a pagination strategy. The underlying requests can use
 * cursor pagination, offset pagination, or another continuation mechanism. A robust implementation
 * must also prevent duplicate requests while a page is loading, stop observing when no more data exists,
 * and clean up the observer when the component unmounts.
 */

import type { FC, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

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
  readonly hasNextPage: boolean;
}

export interface InfiniteScrollProps {
  readonly pages: readonly UserPage[];
}

export interface UserListProps {
  readonly users: readonly User[];
}

export interface ScrollStatusProps {
  readonly isFetching: boolean;
  readonly hasNextPage: boolean;
}

export interface ScrollSentinelProps {
  readonly onVisible: () => void;
  readonly disabled: boolean;
}

export interface PageRequestProps {
  readonly pageNumber: number;
  readonly pageSize: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const UserList: FC<UserListProps> = ({ users }): ReactElement => {
  return (
    <ul>
      {users.map((user: User) => (
        <li key={user.id}>
          {user.name} — {user.role}
        </li>
      ))}
    </ul>
  );
};

export const ScrollStatus: FC<ScrollStatusProps> = ({ isFetching, hasNextPage }): ReactElement => {
  if (isFetching) {
    return <p>Loading more users...</p>;
  }

  if (!hasNextPage) {
    return <p>No more users available.</p>;
  }

  return <p>Scroll to the end to load more users.</p>;
};

export const ScrollSentinel: FC<ScrollSentinelProps> = ({ onVisible, disabled }): ReactElement => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (sentinel === null || disabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries: readonly IntersectionObserverEntry[]): void => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          onVisible();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(sentinel);

    return (): void => {
      observer.disconnect();
    };
  }, [disabled, onVisible]);

  return <div ref={sentinelRef} aria-hidden="true" style={{ height: "1px" }} />;
};

export const PageRequest: FC<PageRequestProps> = ({ pageNumber, pageSize }): ReactElement => {
  return (
    <p>
      Requesting page {pageNumber} with {pageSize} records.
    </p>
  );
};

export const InfiniteScroll: FC<InfiniteScrollProps> = ({ pages }): ReactElement => {
  const [loadedPageCount, setLoadedPageCount] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const hasNextPage = pages[loadedPageCount - 1]?.hasNextPage ?? false;
  const users: User[] = pages.slice(0, loadedPageCount).flatMap((page: UserPage) => [...page.data]);

  const loadNextPage = (): void => {
    if (isFetching || !hasNextPage || loadedPageCount >= pages.length) {
      return;
    }

    setIsFetching(true);

    window.setTimeout(() => {
      setLoadedPageCount((count: number) => count + 1);
      setIsFetching(false);
    }, 700);
  };

  return (
    <div>
      <UserList users={users} />
      <PageRequest pageNumber={loadedPageCount + 1} pageSize={pages[loadedPageCount]?.data.length ?? 0} />
      <ScrollSentinel onVisible={loadNextPage} disabled={isFetching || !hasNextPage} />
      <ScrollStatus isFetching={isFetching} hasNextPage={hasNextPage} />
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const userPages: readonly UserPage[] = [
  {
    data: [
      { id: 1, name: "John Doe", role: "Admin" },
      { id: 2, name: "Jane Smith", role: "Editor" },
      { id: 3, name: "Alex Johnson", role: "Viewer" },
      { id: 4, name: "Emily Brown", role: "Editor" },
      { id: 5, name: "Michael Davis", role: "Viewer" },
    ],
    hasNextPage: true,
  },
  {
    data: [
      { id: 6, name: "Sarah Wilson", role: "Admin" },
      { id: 7, name: "Daniel Taylor", role: "Viewer" },
      { id: 8, name: "Olivia Anderson", role: "Editor" },
      { id: 9, name: "James Thomas", role: "Viewer" },
      { id: 10, name: "Sophia Jackson", role: "Admin" },
    ],
    hasNextPage: true,
  },
  {
    data: [
      { id: 11, name: "William White", role: "Editor" },
      { id: 12, name: "Emma Harris", role: "Viewer" },
      { id: 13, name: "Benjamin Martin", role: "Viewer" },
      { id: 14, name: "Mia Thompson", role: "Editor" },
      { id: 15, name: "Henry Garcia", role: "Admin" },
    ],
    hasNextPage: true,
  },
  {
    data: [
      { id: 16, name: "Charlotte Martinez", role: "Viewer" },
      { id: 17, name: "Lucas Robinson", role: "Editor" },
      { id: 18, name: "Amelia Clark", role: "Viewer" },
      { id: 19, name: "Alexander Rodriguez", role: "Admin" },
      { id: 20, name: "Harper Lewis", role: "Editor" },
    ],
    hasNextPage: false,
  },
];

const InfiniteScrollDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Scroll Position as the Trigger</h2>
      <ScrollStatus isFetching={false} hasNextPage={true} />

      <h2>2. Intersection Observer Sentinel</h2>
      <ScrollSentinel
        onVisible={(): void => {
          // The sentinel becomes a trigger when it enters the viewport.
        }}
        disabled={false}
      />

      <h2>3. Infinite Scroll List</h2>
      <InfiniteScroll pages={userPages} />
    </section>
  );
};

export default InfiniteScrollDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Infinite scroll automatically loads additional content as the user approaches the end of a list.
// The Intersection Observer API can detect when a sentinel element enters or approaches the viewport.
// The sentinel is placed after the currently rendered content so it moves with the growing list.
// `rootMargin` can trigger loading before the sentinel is actually visible, allowing preloading.
// The loading state must prevent multiple requests from being started at the same time.
// The observer should be disconnected when the component unmounts or observation is no longer needed.
// Infinite scroll must stop requesting data when the server reports that no next page exists.
// Newly loaded records are appended to the existing collection rather than replacing it.
// Infinite scroll is a UI pattern and does not determine whether the API uses cursor or offset pagination.
// A "Load more" button can provide a more explicit alternative when automatic loading is undesirable.

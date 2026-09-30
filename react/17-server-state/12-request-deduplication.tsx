/**
 * Request Deduplication
 * =====================
 *
 * Request deduplication prevents multiple identical requests from being sent to the server
 * when several consumers request the same server data at approximately the same time. Instead
 * of starting a separate network request for every consumer, a query-management system can
 * associate the consumers with one in-flight request and share its result.
 *
 * Deduplication is based on query identity, commonly represented by a query key. Two requests
 * that represent the same resource can share an in-flight request when their query identities
 * match. Requests for different resources must remain independent because they can resolve to
 * different server data.
 *
 * Deduplication primarily concerns requests that are already in flight. It is different from
 * cache reuse: cache reuse can avoid a network request because data is already available, while
 * request deduplication prevents duplicate network requests while the same data is currently
 * being fetched.
 *
 * The examples below model the coordination behavior explicitly. A real query-management
 * library owns the request registry and promise lifecycle rather than storing that coordination
 * state directly in a component.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface RequestState<TData> {
  readonly queryKey: string;
  readonly data: TData | null;
  readonly requestCount: number;
  readonly isFetching: boolean;
}

export interface DeduplicatedRequestProps {
  readonly initialState: RequestState<User>;
}

export interface DuplicateRequestsWithoutDeduplicationProps {
  readonly initialState: RequestState<User>;
}

export interface DifferentQueryKeysProps {
  readonly initialState: readonly RequestState<User>[];
}

export interface SharedInFlightRequestProps {
  readonly initialState: RequestState<User>;
}

export interface CacheReuseVsDeduplicationProps {
  readonly initialState: RequestState<User>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DeduplicatedRequest: React.FC<DeduplicatedRequestProps> = ({ initialState }): React.ReactElement => {
  const [state, setState] = useState<RequestState<User>>(initialState);
  const [requestPromise, setRequestPromise] = useState<Promise<User> | null>(null);

  const fetchUser = (): void => {
    if (requestPromise !== null) {
      return;
    }

    const request: Promise<User> = new Promise<User>((resolve: (value: User | PromiseLike<User>) => void): void => {
      window.setTimeout((): void => {
        resolve({
          id: 1,
          name: "John Doe",
        });
      }, 1000);
    });

    setRequestPromise(request);
    setState((currentState: RequestState<User>): RequestState<User> => ({
      ...currentState,
      requestCount: currentState.requestCount + 1,
      isFetching: true,
    }));

    void request.then((user: User): void => {
      setState({
        queryKey: initialState.queryKey,
        data: user,
        requestCount: state.requestCount + 1,
        isFetching: false,
      });
      setRequestPromise(null);
    });
  };

  return (
    <div>
      <p>Query: {state.queryKey}</p>
      <p>Network requests started: {state.requestCount}</p>
      <p>Fetching: {state.isFetching ? "yes" : "no"}</p>
      <p>Data: {state.data?.name ?? "none"}</p>
      <button type="button" onClick={fetchUser} disabled={state.isFetching}>
        Request user
      </button>
    </div>
  );
};

export const DuplicateRequestsWithoutDeduplication: React.FC<DuplicateRequestsWithoutDeduplicationProps> = ({
  initialState,
}): React.ReactElement => {
  const [state, setState] = useState<RequestState<User>>(initialState);

  const fetchUser = (): void => {
    setState((currentState: RequestState<User>): RequestState<User> => ({
      ...currentState,
      requestCount: currentState.requestCount + 1,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setState((currentState: RequestState<User>): RequestState<User> => ({
        ...currentState,
        data: {
          id: 1,
          name: "John Doe",
        },
        isFetching: false,
      }));
    }, 1000);
  };

  const requestFromFirstConsumer = (): void => {
    fetchUser();
  };

  const requestFromSecondConsumer = (): void => {
    fetchUser();
  };

  return (
    <div>
      <p>Query: {state.queryKey}</p>
      <p>Network requests started: {state.requestCount}</p>
      <p>Data: {state.data?.name ?? "none"}</p>
      <button type="button" onClick={requestFromFirstConsumer}>
        Consumer 1 requests data
      </button>
      <button type="button" onClick={requestFromSecondConsumer}>
        Consumer 2 requests data
      </button>
    </div>
  );
};

export const DifferentQueryKeys: React.FC<DifferentQueryKeysProps> = ({ initialState }): React.ReactElement => {
  const [states, setStates] = useState<readonly RequestState<User>[]>(initialState);

  const fetchQuery = (queryKey: string): void => {
    setStates((currentStates: readonly RequestState<User>[]): readonly RequestState<User>[] =>
      currentStates.map((state: RequestState<User>): RequestState<User> =>
        state.queryKey === queryKey
          ? {
              ...state,
              requestCount: state.requestCount + 1,
              isFetching: true,
            }
          : state,
      ),
    );

    window.setTimeout((): void => {
      setStates((currentStates: readonly RequestState<User>[]): readonly RequestState<User>[] =>
        currentStates.map((state: RequestState<User>): RequestState<User> =>
          state.queryKey === queryKey
            ? {
                ...state,
                data: {
                  id: state.queryKey === "user:1" ? 1 : 2,
                  name: state.queryKey === "user:1" ? "John Doe" : "Jane Doe",
                },
                isFetching: false,
              }
            : state,
        ),
      );
    }, 1000);
  };

  return (
    <div>
      {states.map((state: RequestState<User>): React.ReactElement => (
        <div key={state.queryKey}>
          <p>
            {state.queryKey}: {state.requestCount} request(s)
          </p>
          <p>Data: {state.data?.name ?? "none"}</p>
          <button type="button" onClick={(): void => fetchQuery(state.queryKey)}>
            Request {state.queryKey}
          </button>
        </div>
      ))}
    </div>
  );
};

export const SharedInFlightRequest: React.FC<SharedInFlightRequestProps> = ({ initialState }): React.ReactElement => {
  const [state, setState] = useState<RequestState<User>>(initialState);
  const [isRequestInFlight, setIsRequestInFlight] = useState<boolean>(false);
  const [consumerCount, setConsumerCount] = useState<number>(0);

  const requestForConsumer = (): void => {
    setConsumerCount((currentCount: number): number => currentCount + 1);

    if (isRequestInFlight) {
      return;
    }

    setIsRequestInFlight(true);
    setState((currentState: RequestState<User>): RequestState<User> => ({
      ...currentState,
      requestCount: currentState.requestCount + 1,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setState((currentState: RequestState<User>): RequestState<User> => ({
        ...currentState,
        data: {
          id: 1,
          name: "John Doe",
        },
        isFetching: false,
      }));
      setIsRequestInFlight(false);
    }, 1000);
  };

  return (
    <div>
      <p>Query: {state.queryKey}</p>
      <p>Consumers requesting data: {consumerCount}</p>
      <p>Network requests started: {state.requestCount}</p>
      <p>Fetching: {state.isFetching ? "yes" : "no"}</p>
      <p>All consumers can receive the same in-flight result.</p>
      <button type="button" onClick={requestForConsumer}>
        Request from consumer
      </button>
    </div>
  );
};

export const CacheReuseVsDeduplication: React.FC<CacheReuseVsDeduplicationProps> = ({
  initialState,
}): React.ReactElement => {
  const [state, setState] = useState<RequestState<User>>(initialState);
  const [hasCachedData, setHasCachedData] = useState<boolean>(initialState.data !== null);

  const requestUser = (): void => {
    if (hasCachedData) {
      return;
    }

    setState((currentState: RequestState<User>): RequestState<User> => ({
      ...currentState,
      requestCount: currentState.requestCount + 1,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setState((currentState: RequestState<User>): RequestState<User> => ({
        ...currentState,
        data: {
          id: 1,
          name: "John Doe",
        },
        isFetching: false,
      }));
      setHasCachedData(true);
    }, 1000);
  };

  const clearCache = (): void => {
    setHasCachedData(false);
    setState((currentState: RequestState<User>): RequestState<User> => ({
      ...currentState,
      data: null,
    }));
  };

  return (
    <div>
      <p>Query: {state.queryKey}</p>
      <p>Cached data: {hasCachedData ? "yes" : "no"}</p>
      <p>Network requests started: {state.requestCount}</p>
      <p>Data: {state.data?.name ?? "none"}</p>
      <button type="button" onClick={requestUser} disabled={state.isFetching}>
        Request user
      </button>
      <button type="button" onClick={clearCache}>
        Clear cache
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RequestDeduplication: React.FC = (): React.ReactElement => {
  const initialUserRequest: RequestState<User> = {
    queryKey: "user:1",
    data: null,
    requestCount: 0,
    isFetching: false,
  };

  const initialQueryStates: readonly RequestState<User>[] = [
    {
      queryKey: "user:1",
      data: null,
      requestCount: 0,
      isFetching: false,
    },
    {
      queryKey: "user:2",
      data: null,
      requestCount: 0,
      isFetching: false,
    },
  ];

  const cachedUserRequest: RequestState<User> = {
    queryKey: "user:1",
    data: {
      id: 1,
      name: "John Doe",
    },
    requestCount: 0,
    isFetching: false,
  };

  return (
    <main>
      <h1>Request Deduplication</h1>

      <h2>1. Identical requests can share one in-flight request</h2>
      <DeduplicatedRequest initialState={initialUserRequest} />

      <h2>2. Without deduplication, consumers can start duplicate requests</h2>
      <DuplicateRequestsWithoutDeduplication initialState={initialUserRequest} />

      <h2>3. Different query keys represent different requests</h2>
      <DifferentQueryKeys initialState={initialQueryStates} />

      <h2>4. Multiple consumers can share the same in-flight request</h2>
      <SharedInFlightRequest initialState={initialUserRequest} />

      <h2>5. Cache reuse and request deduplication solve different problems</h2>
      <CacheReuseVsDeduplication initialState={cachedUserRequest} />
    </main>
  );
};

export default RequestDeduplication;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Request deduplication prevents identical in-flight requests from being sent multiple times.
// Query identity, commonly represented by a query key, determines which requests can be shared.
// Different query keys represent different server resources and should remain independent.
// Multiple consumers can subscribe to the same in-flight request and share its result.
// Cache reuse avoids a network request because usable data is already cached.
// Request deduplication avoids duplicate network requests while the same request is already running.
// Deduplication is primarily an in-flight coordination mechanism, not a replacement for caching.

/**
 * Data Fetching Effect
 * ====================
 *
 * Data fetching is an external synchronization because the component
 * communicates with a resource outside React's rendering system. An Effect can
 * start a request after the component commits and can return cleanup that
 * aborts a request that is no longer relevant.
 *
 * A fetch Promise can resolve after the component has rendered newer props or
 * after the component has unmounted. `AbortController` provides a cancellation
 * mechanism for requests that are no longer needed. The Effect creates the
 * controller for its own request and aborts that request during cleanup.
 *
 * The dependency array determines when a new request is needed. If a request
 * depends on a URL or query value, that value belongs in the dependency list.
 * When it changes, React runs cleanup for the previous request before starting
 * the next request.
 *
 * Request failures and aborts are distinct outcomes. An aborted request is
 * expected cleanup and normally should not be displayed as an application
 * error. Other failures should be represented separately from loading and
 * successful data states.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicFetchProps {
  readonly url: string;
}

export interface AbortableFetchProps {
  readonly url: string;
}

export interface QueryFetchProps {
  readonly initialQuery: string;
}

export interface FetchStatusProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicFetch: FC<BasicFetchProps> = ({ url }): ReactElement => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    let active: boolean = true;

    setLoading(true);
    setError(null);

    void fetch(url)
      .then(async (response: Response): Promise<string> => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.text();
      })
      .then((responseText: string): void => {
        if (active) {
          setData(responseText);
          setLoading(false);
        }
      })
      .catch((requestError: unknown): void => {
        if (active) {
          const message: string = requestError instanceof Error ? requestError.message : "Unknown request error";

          setError(message);
          setLoading(false);
        }
      });

    return (): void => {
      active = false;
    };
  }, [url]);

  return (
    <section>
      <p>Status: {loading ? "Loading" : error === null ? "Complete" : "Error"}</p>

      {error !== null && <p>Error: {error}</p>}
      {data !== null && <p>Response length: {data.length}</p>}
    </section>
  );
};

export const AbortableFetch: FC<AbortableFetchProps> = ({ url }): ReactElement => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    setData(null);
    setError(null);
    setLoading(true);

    void fetch(url, { signal: controller.signal })
      .then(async (response: Response): Promise<string> => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.text();
      })
      .then((responseText: string): void => {
        setData(responseText);
        setLoading(false);
      })
      .catch((requestError: unknown): void => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        const message: string = requestError instanceof Error ? requestError.message : "Unknown request error";

        setError(message);
        setLoading(false);
      });

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <p>Status: {loading ? "Loading" : error === null ? "Complete" : "Error"}</p>

      {error !== null && <p>Error: {error}</p>}
      {data !== null && <p>Response length: {data.length}</p>}
    </section>
  );
};

export const QueryFetch: FC<QueryFetchProps> = ({ initialQuery }): ReactElement => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [status, setStatus] = useState<string>("Ready");

  useEffect((): (() => void) | undefined => {
    const normalizedQuery: string = query.trim();

    if (normalizedQuery.length === 0) {
      setStatus("Enter a query");
      return undefined;
    }

    const controller: AbortController = new AbortController();

    setStatus(`Loading "${normalizedQuery}"`);

    const encodedQuery: string = encodeURIComponent(normalizedQuery);
    const requestUrl: string = `https://jsonplaceholder.typicode.com/posts?userId=${encodedQuery}`;

    void fetch(requestUrl, { signal: controller.signal })
      .then((response: Response): void => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setStatus(`Loaded results for "${normalizedQuery}"`);
      })
      .catch((requestError: unknown): void => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setStatus("Request failed");
      });

    return (): void => {
      controller.abort();
    };
  }, [query]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <section>
      <label htmlFor="query-fetch-input">User ID</label>
      <input id="query-fetch-input" value={query} onChange={handleChange} />

      <p>{status}</p>
    </section>
  );
};

export const FetchStatus: FC<FetchStatusProps> = ({ url }): ReactElement => {
  const [status, setStatus] = useState<string>("Idle");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    setStatus("Loading");

    void fetch(url, { signal: controller.signal })
      .then((response: Response): void => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setStatus("Loaded successfully");
      })
      .catch((requestError: unknown): void => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setStatus(requestError instanceof Error ? `Error: ${requestError.message}` : "Error: Unknown request error");
      });

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return (
    <section>
      <p>{status}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const DataFetchingEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Fetching data when a URL dependency changes</h2>
      <BasicFetch url="https://jsonplaceholder.typicode.com/posts/1" />

      <h2>2. Aborting an obsolete request during cleanup</h2>
      <AbortableFetch url="https://jsonplaceholder.typicode.com/posts/2" />

      <h2>3. Re-fetching when the query dependency changes</h2>
      <QueryFetch initialQuery="1" />

      <h2>4. Representing loading, success, and failure states</h2>
      <FetchStatus url="https://jsonplaceholder.typicode.com/posts/3" />
    </main>
  );
};

export default DataFetchingEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Fetching is external synchronization and can be initiated from an Effect.
// - Values that determine the requested resource belong in the Effect's
//   dependency array.
// - `AbortController` can cancel a fetch that becomes obsolete during cleanup.
// - Each Effect setup should own the controller for the request it started.
// - Abort errors normally represent expected cleanup rather than application
//   failures.
// - Non-success HTTP responses should be handled explicitly because `fetch`
//   resolves its Promise for HTTP error status codes.
// - Loading, successful data, and request errors are separate application
//   states and should not be conflated.
// - Cleanup prevents obsolete requests from continuing to participate in the
//   component's current synchronization.
// - An asynchronous Effect should not make the component render depend on a
//   Promise resolving synchronously; the initial render must represent the
//   loading state correctly.

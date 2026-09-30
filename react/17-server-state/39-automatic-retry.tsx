/**
 * Automatic Retry
 * ===============
 *
 * Automatic retry means that a query or mutation operation is attempted again after a request
 * failure without requiring the user to manually trigger another attempt. Retry behavior is usually
 * configured in the query layer because transient failures can often recover without application
 * code explicitly starting a new request.
 *
 * A retry policy normally defines whether an error is retryable and how many additional attempts
 * are permitted. A retry count of `3`, for example, means the initial request may be followed by
 * up to three additional attempts, for a maximum of four total requests.
 *
 * Not every error should be retried. Network failures and temporary server errors can be reasonable
 * retry candidates, while errors such as authentication failures, invalid request parameters, or
 * permission failures generally require a different action. The decision depends on the HTTP status,
 * error type, operation semantics, and application requirements.
 *
 * Automatic retry should also be bounded. An unlimited retry loop can keep consuming resources and
 * delay useful error feedback. Production query libraries commonly combine retry limits with a delay
 * strategy, often exponential backoff, before eventually exposing the error to the application.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface QueryError {
  readonly message: string;
  readonly statusCode?: number;
  readonly retryable: boolean;
}

export interface RetryState<TData> {
  readonly data: TData | null;
  readonly error: QueryError | null;
  readonly failureCount: number;
  readonly retryCount: number;
  readonly isFetching: boolean;
}

export interface RetryPolicy {
  readonly maxRetries: number;
}

export interface RetryStatusProps {
  readonly state: RetryState<string>;
  readonly policy: RetryPolicy;
}

export interface RetryDecisionProps {
  readonly error: QueryError;
  readonly policy: RetryPolicy;
  readonly failureCount: number;
}

export interface AutomaticRetryProps {
  readonly policy: RetryPolicy;
  readonly errors: readonly QueryError[];
}

export interface RetryResultProps {
  readonly state: RetryState<string>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const RetryStatus: FC<RetryStatusProps> = ({ state, policy }): ReactElement => {
  const totalAttempts = state.failureCount + state.retryCount;

  return (
    <div>
      <p>Status: {state.isFetching ? "fetching" : state.error ? "failed" : state.data ? "success" : "idle"}</p>
      <p>Failed attempts: {state.failureCount}</p>
      <p>Retries started: {state.retryCount}</p>
      <p>Maximum retries: {policy.maxRetries}</p>
      <p>Total requests attempted: {totalAttempts}</p>
    </div>
  );
};

export const RetryDecision: FC<RetryDecisionProps> = ({ error, policy, failureCount }): ReactElement => {
  const canRetry = error.retryable && failureCount <= policy.maxRetries;

  return (
    <div>
      <p>Error: {error.message}</p>
      <p>Retryable: {error.retryable ? "yes" : "no"}</p>
      <p>Decision: {canRetry ? "retry" : "stop"}</p>
    </div>
  );
};

export const RetryResult: FC<RetryResultProps> = ({ state }): ReactElement => {
  if (state.data !== null) {
    return <p>Query succeeded: {state.data}</p>;
  }

  if (state.error !== null) {
    return (
      <p role="alert">
        Query failed after {state.failureCount} failed attempts: {state.error.message}
      </p>
    );
  }

  return <p>No completed query result.</p>;
};

export const AutomaticRetry: FC<AutomaticRetryProps> = ({ policy, errors }): ReactElement => {
  const [state, setState] = useState<RetryState<string>>({
    data: null,
    error: null,
    failureCount: 0,
    retryCount: 0,
    isFetching: false,
  });

  const runQuery = (): void => {
    setState({
      data: null,
      error: null,
      failureCount: 0,
      retryCount: 0,
      isFetching: true,
    });

    const executeAttempt = (attempt: number): void => {
      window.setTimeout(() => {
        const error = errors[attempt];

        if (error === undefined) {
          setState((currentState: RetryState<string>) => ({
            ...currentState,
            data: "Server response received.",
            error: null,
            isFetching: false,
          }));
          return;
        }

        const nextFailureCount = attempt + 1;
        const canRetry = error.retryable && attempt < policy.maxRetries;

        if (!canRetry) {
          setState({
            data: null,
            error,
            failureCount: nextFailureCount,
            retryCount: attempt,
            isFetching: false,
          });
          return;
        }

        setState({
          data: null,
          error: null,
          failureCount: nextFailureCount,
          retryCount: attempt + 1,
          isFetching: true,
        });

        executeAttempt(attempt + 1);
      }, 500);
    };

    executeAttempt(0);
  };

  return (
    <div>
      <RetryStatus state={state} policy={policy} />
      <RetryResult state={state} />
      <button type="button" disabled={state.isFetching} onClick={runQuery}>
        Run query
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const retryableErrors: readonly QueryError[] = [
  {
    message: "Temporary server failure.",
    statusCode: 503,
    retryable: true,
  },
  {
    message: "Service temporarily unavailable.",
    statusCode: 503,
    retryable: true,
  },
];

const nonRetryableError: QueryError = {
  message: "Authentication is required.",
  statusCode: 401,
  retryable: false,
};

const AutomaticRetryDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Retry Decision</h2>
      <RetryDecision error={retryableErrors[0]} policy={{ maxRetries: 3 }} failureCount={1} />

      <h2>2. Non-Retryable Error</h2>
      <RetryDecision error={nonRetryableError} policy={{ maxRetries: 3 }} failureCount={1} />

      <h2>3. Automatic Retry Sequence</h2>
      <AutomaticRetry policy={{ maxRetries: 3 }} errors={retryableErrors} />

      <h2>4. Retry Limit</h2>
      <RetryStatus
        state={{
          data: null,
          error: {
            message: "The server is still unavailable.",
            statusCode: 503,
            retryable: true,
          },
          failureCount: 4,
          retryCount: 3,
          isFetching: false,
        }}
        policy={{ maxRetries: 3 }}
      />
    </section>
  );
};

export default AutomaticRetryDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Automatic retry starts another request after a retryable failure without manual user action.
// The retry count should be bounded so persistent failures do not create an endless request loop.
// A retry count usually counts additional attempts after the initial request.
// A maximum of three retries therefore permits up to four total requests.
// Retryability should depend on the type and context of the error rather than every error being retried.
// Temporary network or server failures can be retry candidates.
// Authentication, authorization, validation, and malformed-request errors commonly require another action.
// A retry policy should eventually expose the error when its retry limit is exhausted.
// Automatic retry is separate from retry delay; a delay strategy determines when the next attempt begins.
// Production implementations should also account for cancellation, component lifecycle, and request races.
// Mutations require additional care because repeating a state-changing operation can duplicate server effects.

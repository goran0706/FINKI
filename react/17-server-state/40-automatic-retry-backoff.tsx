/**
 * Automatic Retry Backoff
 * =======================
 *
 * Automatic retry backoff controls how long a query waits before starting another attempt after a
 * failed request. Instead of retrying immediately, the retry mechanism progressively increases the
 * delay between attempts, giving a temporarily unavailable service time to recover.
 *
 * Exponential backoff commonly calculates each delay from the retry number. With a base delay of
 * 500 milliseconds, for example, the delays can be 500 ms, 1,000 ms, 2,000 ms, and 4,000 ms.
 * A maximum delay can cap the growth so later retries do not become excessively slow.
 *
 * Backoff is separate from the retry count. The retry count determines whether another attempt is
 * permitted, while the backoff delay determines when that attempt starts. Production systems may
 * also add jitter, which introduces controlled randomness to prevent many clients that failed at
 * the same time from retrying simultaneously.
 *
 * A retry timer should be cancellable. If the component unmounts or the retry sequence is otherwise
 * cancelled, pending timers should not continue updating component state after the operation ends.
 */

import type { FC, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface QueryError {
  readonly message: string;
  readonly statusCode?: number;
  readonly retryable: boolean;
}

export interface BackoffPolicy {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
}

export interface RetryAttempt {
  readonly attempt: number;
  readonly delayMs: number;
  readonly status: "failed" | "waiting" | "success";
}

export interface BackoffState {
  readonly attempts: readonly RetryAttempt[];
  readonly error: QueryError | null;
  readonly data: string | null;
  readonly isFetching: boolean;
  readonly nextRetryDelayMs: number | null;
}

export interface BackoffCalculationProps {
  readonly retryNumber: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
}

export interface BackoffPolicyDisplayProps {
  readonly policy: BackoffPolicy;
}

export interface RetryAttemptListProps {
  readonly attempts: readonly RetryAttempt[];
}

export interface BackoffStateDisplayProps {
  readonly state: BackoffState;
}

export interface AutomaticRetryBackoffProps {
  readonly policy: BackoffPolicy;
  readonly errors: readonly QueryError[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BackoffCalculation: FC<BackoffCalculationProps> = ({
  retryNumber,
  baseDelayMs,
  maxDelayMs,
}): ReactElement => {
  const exponentialDelay = baseDelayMs * 2 ** retryNumber;
  const delayMs = Math.min(exponentialDelay, maxDelayMs);

  return (
    <div>
      <p>Retry number: {retryNumber}</p>
      <p>Base delay: {baseDelayMs} ms</p>
      <p>Calculated delay: {delayMs} ms</p>
      <p>Formula: min(baseDelay × 2^retry, maximum delay)</p>
    </div>
  );
};

export const BackoffPolicyDisplay: FC<BackoffPolicyDisplayProps> = ({ policy }): ReactElement => {
  return (
    <div>
      <p>Maximum retries: {policy.maxRetries}</p>
      <p>Base delay: {policy.baseDelayMs} ms</p>
      <p>Maximum delay: {policy.maxDelayMs} ms</p>
    </div>
  );
};

export const RetryAttemptList: FC<RetryAttemptListProps> = ({ attempts }): ReactElement => {
  if (attempts.length === 0) {
    return <p>No attempts have been made.</p>;
  }

  return (
    <ol>
      {attempts.map((attempt: RetryAttempt) => (
        <li key={attempt.attempt}>
          Attempt {attempt.attempt}: {attempt.status}
          {attempt.status === "waiting" && ` — waiting ${attempt.delayMs} ms`}
        </li>
      ))}
    </ol>
  );
};

export const BackoffStateDisplay: FC<BackoffStateDisplayProps> = ({ state }): ReactElement => {
  return (
    <div>
      <p>Status: {state.isFetching ? "fetching" : state.data ? "success" : state.error ? "failed" : "idle"}</p>
      <RetryAttemptList attempts={state.attempts} />
      {state.nextRetryDelayMs !== null && <p>Next retry in: {state.nextRetryDelayMs} ms</p>}
      {state.data !== null && <p>{state.data}</p>}
      {state.error !== null && <p role="alert">{state.error.message}</p>}
    </div>
  );
};

export const AutomaticRetryBackoff: FC<AutomaticRetryBackoffProps> = ({ policy, errors }): ReactElement => {
  const [state, setState] = useState<BackoffState>({
    attempts: [],
    error: null,
    data: null,
    isFetching: false,
    nextRetryDelayMs: null,
  });

  const timeoutRef = useRef<number | null>(null);
  const runIdRef = useRef<number>(0);

  useEffect(() => {
    return (): void => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      runIdRef.current += 1;
    };
  }, []);

  const runQuery = (): void => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    runIdRef.current += 1;
    const runId = runIdRef.current;

    setState({
      attempts: [],
      error: null,
      data: null,
      isFetching: true,
      nextRetryDelayMs: null,
    });

    const executeAttempt = (retryNumber: number): void => {
      if (runId !== runIdRef.current) {
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;

        if (runId !== runIdRef.current) {
          return;
        }

        const error = errors[retryNumber];

        if (error === undefined) {
          setState((currentState: BackoffState) => ({
            ...currentState,
            attempts: [
              ...currentState.attempts,
              {
                attempt: retryNumber + 1,
                delayMs: 0,
                status: "success",
              },
            ],
            error: null,
            data: "Server response received.",
            isFetching: false,
            nextRetryDelayMs: null,
          }));
          return;
        }

        const failedAttempt: RetryAttempt = {
          attempt: retryNumber + 1,
          delayMs: 0,
          status: "failed",
        };

        const canRetry = error.retryable && retryNumber < policy.maxRetries;

        if (!canRetry) {
          setState((currentState: BackoffState) => ({
            ...currentState,
            attempts: [...currentState.attempts, failedAttempt],
            error,
            data: null,
            isFetching: false,
            nextRetryDelayMs: null,
          }));
          return;
        }

        const exponentialDelay = policy.baseDelayMs * 2 ** retryNumber;
        const nextDelayMs = Math.min(exponentialDelay, policy.maxDelayMs);

        setState((currentState: BackoffState) => ({
          ...currentState,
          attempts: [
            ...currentState.attempts,
            failedAttempt,
            {
              attempt: retryNumber + 2,
              delayMs: nextDelayMs,
              status: "waiting",
            },
          ],
          error: null,
          data: null,
          isFetching: true,
          nextRetryDelayMs: nextDelayMs,
        }));

        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null;

          if (runId !== runIdRef.current) {
            return;
          }

          executeAttempt(retryNumber + 1);
        }, nextDelayMs);
      }, 500);
    };

    executeAttempt(0);
  };

  return (
    <div>
      <BackoffStateDisplay state={state} />
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
  {
    message: "The service is still unavailable.",
    statusCode: 503,
    retryable: true,
  },
];

const nonRetryableError: QueryError = {
  message: "Authentication is required.",
  statusCode: 401,
  retryable: false,
};

const AutomaticRetryBackoffDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Exponential Backoff Calculation</h2>
      <BackoffCalculation retryNumber={0} baseDelayMs={500} maxDelayMs={8000} />
      <BackoffCalculation retryNumber={1} baseDelayMs={500} maxDelayMs={8000} />
      <BackoffCalculation retryNumber={3} baseDelayMs={500} maxDelayMs={8000} />

      <h2>2. Maximum Delay Cap</h2>
      <BackoffCalculation retryNumber={5} baseDelayMs={500} maxDelayMs={4000} />

      <h2>3. Backoff Policy</h2>
      <BackoffPolicyDisplay
        policy={{
          maxRetries: 3,
          baseDelayMs: 500,
          maxDelayMs: 4000,
        }}
      />

      <h2>4. Automatic Retry With Backoff</h2>
      <AutomaticRetryBackoff
        policy={{
          maxRetries: 3,
          baseDelayMs: 500,
          maxDelayMs: 4000,
        }}
        errors={retryableErrors}
      />

      <h2>5. Non-Retryable Error Stops Immediately</h2>
      <AutomaticRetryBackoff
        policy={{
          maxRetries: 3,
          baseDelayMs: 500,
          maxDelayMs: 4000,
        }}
        errors={[nonRetryableError]}
      />
    </section>
  );
};

export default AutomaticRetryBackoffDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Backoff determines how long the application waits before starting another retry.
// Exponential backoff commonly increases the delay by a factor of two after each failure.
// A base delay establishes the initial backoff interval.
// A maximum delay prevents exponential growth from producing excessively long waits.
// Retry count determines whether another attempt is allowed; backoff determines when it occurs.
// Backoff and retry count are therefore separate parts of the retry policy.
// A retry sequence should stop when the retry limit is reached or the error is not retryable.
// Pending retry timers should be cancelled when the operation or component is no longer active.
// Production systems commonly add jitter to reduce synchronized retries from many clients.
// Backoff does not make a non-retryable error retryable; the retry policy still determines eligibility.
// Mutations require additional consideration because repeating a state-changing request can duplicate effects.

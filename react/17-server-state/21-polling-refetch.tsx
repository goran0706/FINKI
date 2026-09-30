/**
 * Polling Refetch
 * ===============
 *
 * Polling refetches server state at a configured interval by repeatedly starting requests while
 * the query remains eligible for polling. Unlike a one-time refetch, polling establishes a recurring
 * synchronization cycle so that the client can periodically obtain newer server data.
 *
 * Polling is useful for data that changes independently of the current user's actions, such as
 * job progress, processing status, dashboards, or periodically changing metrics. The polling
 * interval controls how frequently the client attempts synchronization, but it does not guarantee
 * that every request will complete within that interval.
 *
 * A polling implementation must also account for lifecycle and request state. The interval should
 * be cleaned up when polling stops, and applications should avoid unnecessarily starting overlapping
 * requests when a previous poll is still in flight.
 */

import type { FC } from "react";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Job {
  readonly id: number;
  readonly name: string;
  readonly progress: number;
  readonly status: "processing" | "completed";
}

export interface PollingState<TData> {
  readonly data: TData | null;
  readonly isFetching: boolean;
  readonly isPolling: boolean;
  readonly pollCount: number;
}

export interface BasicPollingProps {
  readonly job: Job;
  readonly isFetching: boolean;
  readonly pollCount: number;
}

export interface PollingIntervalProps {
  readonly interval: number;
  readonly isPolling: boolean;
}

export interface PollingLifecycleProps {
  readonly job: Job;
  readonly isPolling: boolean;
  readonly pollCount: number;
}

export interface PollingOverlapProps {
  readonly isFetching: boolean;
  readonly pollCount: number;
}

export interface PollingControlProps {
  readonly isPolling: boolean;
  readonly isFetching: boolean;
  readonly onToggle: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicPolling: FC<BasicPollingProps> = ({ job, isFetching, pollCount }): React.ReactElement => {
  return (
    <div>
      <p>
        {job.name}: {job.progress}%
      </p>
      <p>Status: {job.status}</p>
      <p>Polls completed: {pollCount}</p>
      <p>{isFetching ? "A polling request is currently in flight." : "No polling request is currently in flight."}</p>
    </div>
  );
};

export const PollingInterval: FC<PollingIntervalProps> = ({ interval, isPolling }): React.ReactElement => {
  return (
    <div>
      <p>Polling interval: {interval} ms</p>
      <p>Polling: {isPolling ? "enabled" : "disabled"}</p>
      <p>The interval determines how often another synchronization attempt can begin.</p>
    </div>
  );
};

export const PollingLifecycle: FC<PollingLifecycleProps> = ({ job, isPolling, pollCount }): React.ReactElement => {
  return (
    <div>
      <p>Job progress: {job.progress}%</p>
      <p>Job status: {job.status}</p>
      <p>{isPolling ? "Polling continues while the query is active." : "Polling has stopped."}</p>
      <p>Total polling cycles: {pollCount}</p>
    </div>
  );
};

export const PollingWithoutOverlap: FC<PollingOverlapProps> = ({ isFetching, pollCount }): React.ReactElement => {
  return (
    <div>
      <p>Completed polling requests: {pollCount}</p>
      <p>
        {isFetching
          ? "Current request is still running; another request should not overlap it."
          : "No polling request is currently running."}
      </p>
      <p>
        Polling should coordinate interval timing with request state when requests can take longer than the polling
        interval.
      </p>
    </div>
  );
};

export const PollingControl: FC<PollingControlProps> = ({ isPolling, isFetching, onToggle }): React.ReactElement => {
  return (
    <div>
      <button type="button" onClick={onToggle}>
        {isPolling ? "Stop polling" : "Start polling"}
      </button>
      <p>
        {isFetching
          ? "A poll is currently fetching server data."
          : isPolling
            ? "Waiting for the next polling cycle."
            : "Polling is stopped."}
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PollingRefetch: FC = (): React.ReactElement => {
  const pollingInterval: number = 2000;
  const [job, setJob] = useState<Job>({
    id: 1,
    name: "Report generation",
    progress: 0,
    status: "processing",
  });
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);

  useEffect((): (() => void) => {
    if (!isPolling) {
      return (): void => undefined;
    }

    const poll = (): void => {
      if (isFetching) {
        return;
      }

      setIsFetching(true);

      window.setTimeout((): void => {
        setJob((currentJob: Job): Job => {
          const nextProgress: number = Math.min(currentJob.progress + 25, 100);

          return {
            ...currentJob,
            progress: nextProgress,
            status: nextProgress === 100 ? "completed" : "processing",
          };
        });
        setPollCount((count: number): number => count + 1);
        setIsFetching(false);
      }, 700);
    };

    const intervalId: number = window.setInterval(poll, pollingInterval);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [isPolling, isFetching]);

  const togglePolling = (): void => {
    setIsPolling((polling: boolean): boolean => !polling);
  };

  const reset = (): void => {
    setJob({
      id: 1,
      name: "Report generation",
      progress: 0,
      status: "processing",
    });
    setIsPolling(true);
    setIsFetching(false);
    setPollCount(0);
  };

  return (
    <main>
      <h1>Polling Refetch</h1>

      <section>
        <h2>1. Basic Polling</h2>
        <BasicPolling job={job} isFetching={isFetching} pollCount={pollCount} />
      </section>

      <section>
        <h2>2. Polling Interval</h2>
        <PollingInterval interval={pollingInterval} isPolling={isPolling} />
      </section>

      <section>
        <h2>3. Polling Lifecycle</h2>
        <PollingLifecycle job={job} isPolling={isPolling} pollCount={pollCount} />
      </section>

      <section>
        <h2>4. Avoiding Overlapping Polls</h2>
        <PollingWithoutOverlap isFetching={isFetching} pollCount={pollCount} />
      </section>

      <section>
        <h2>5. Starting and Stopping Polling</h2>
        <PollingControl isPolling={isPolling} isFetching={isFetching} onToggle={togglePolling} />
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default PollingRefetch;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Polling repeatedly refetches server state according to a configured interval.
// Polling is useful when server data can change without direct user interaction.
// The polling interval controls how frequently synchronization attempts are scheduled.
// Polling should stop when the query or component is no longer eligible for polling.
// Intervals must be cleaned up to prevent requests from continuing after polling stops.
// Applications should consider whether a previous request is still in flight before starting another.
// Polling does not guarantee that every request will finish before the next interval occurs.
// Existing query data can remain visible while each polling request is running.
// Polling is a recurring synchronization mechanism rather than a single manual refetch.

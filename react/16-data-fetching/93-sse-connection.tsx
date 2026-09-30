/**
 * SSE Connection
 * ==============
 *
 * An SSE connection is a long-lived HTTP connection established by `EventSource` to an endpoint
 * that returns a `text/event-stream` response. The server keeps the response open and writes
 * events as they become available, while the browser parses the stream and dispatches the
 * resulting events to the client.
 *
 * The browser manages the connection lifecycle automatically. A connection starts in the
 * `CONNECTING` state, becomes `OPEN` after the HTTP stream is successfully established, and
 * normally returns to `CONNECTING` after an unexpected interruption so that the browser can
 * attempt reconnection. Calling `close()` transitions the instance to `CLOSED` and stops further
 * automatic reconnection.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface SseConnectionProps {
  readonly url: string;
}

interface SseConnectionMonitoringProps {
  readonly url: string;
}

interface SseConnectionCloseProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Establishes an SSE connection and reports its lifecycle state.
 *
 * The EventSource instance is created when the component mounts or when its URL changes. The
 * connection remains open until the server closes it, the browser encounters an interruption,
 * or the component explicitly closes it during cleanup.
 */
export const SseConnection: React.FC<SseConnectionProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setStatus("Open");
    };

    const handleError = (_event: Event): void => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        setStatus("Reconnecting");
        return;
      }

      setStatus("Closed");
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("error", handleError);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>URL: {url}</p>
      <p>Status: {status}</p>
    </div>
  );
};

/**
 * Monitors the EventSource readyState while the connection is active.
 *
 * The `readyState` property is a numeric constant rather than a string. The EventSource constants
 * provide the corresponding semantic values: CONNECTING is 0, OPEN is 1, and CLOSED is 2.
 */
export const SseConnectionMonitoring: React.FC<SseConnectionMonitoringProps> = ({ url }): React.ReactElement => {
  const [readyState, setReadyState] = useState<number>(EventSource.CONNECTING);

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const updateReadyState = (): void => {
      setReadyState(eventSource.readyState);
    };

    eventSource.addEventListener("open", updateReadyState);
    eventSource.addEventListener("error", updateReadyState);

    return (): void => {
      eventSource.removeEventListener("open", updateReadyState);
      eventSource.removeEventListener("error", updateReadyState);
      eventSource.close();
    };
  }, [url]);

  const stateLabel: string =
    readyState === EventSource.CONNECTING ? "CONNECTING" : readyState === EventSource.OPEN ? "OPEN" : "CLOSED";

  return (
    <div>
      <p>Ready state: {stateLabel}</p>
      <p>Ready state value: {readyState}</p>
    </div>
  );
};

/**
 * Demonstrates explicitly closing an SSE connection.
 *
 * Calling `close()` is different from allowing a network interruption to occur. An interrupted
 * connection can trigger EventSource's automatic reconnection behavior, whereas an explicitly
 * closed EventSource enters the CLOSED state and does not reconnect automatically.
 */
export const SseConnectionClose: React.FC<SseConnectionCloseProps> = ({ url }): React.ReactElement => {
  const [closed, setClosed] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setClosed(false);
    };

    eventSource.addEventListener("open", handleOpen);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.close();
    };
  }, [url]);

  const handleClose = (): void => {
    setClosed(true);
  };

  return (
    <div>
      <p>Connection: {closed ? "Closed by application" : "Active"}</p>
      <button type="button" onClick={handleClose}>
        Close connection
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SseConnectionExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>SSE Connection</h1>

      <h2>1. Establishing an SSE Connection</h2>
      <SseConnection url="https://example.com/events" />

      <h2>2. Monitoring the Connection State</h2>
      <SseConnectionMonitoring url="https://example.com/events" />

      <h2>3. Explicitly Closing the Connection</h2>
      <SseConnectionClose url="https://example.com/events" />
    </main>
  );
};

export default SseConnectionExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `EventSource` establishes a long-lived HTTP connection for receiving server-sent events.
// - An SSE endpoint keeps the HTTP response open and uses the `text/event-stream` media type.
// - `CONNECTING`, `OPEN`, and `CLOSED` represent the three EventSource connection states.
// - `readyState` exposes the current state as a numeric value.
// - An interrupted connection normally returns to `CONNECTING` while EventSource attempts reconnection.
// - Automatic reconnection is managed by the browser rather than by application timers.
// - Calling `close()` explicitly moves the EventSource to `CLOSED` and prevents automatic reconnection.
// - React effects should close the EventSource during cleanup to prevent a connection from outliving its component.
// - Event listeners should be removed during cleanup when they were registered explicitly.

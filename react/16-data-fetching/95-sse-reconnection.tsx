/**
 * SSE Reconnection
 * ================
 *
 * Server-Sent Events provide browser-managed reconnection for an `EventSource` connection. When
 * an established SSE connection is interrupted, the browser normally changes the connection state
 * back to `CONNECTING` and attempts to establish the HTTP stream again. The server can communicate
 * a reconnection delay using the SSE `retry` field.
 *
 * Reconnection is different from application-managed retry logic. An application normally should
 * not create a new `EventSource` inside every `error` handler because the browser already manages
 * reconnection for a persistent EventSource. Calling `close()` explicitly disables that automatic
 * reconnection for the instance, so cleanup must distinguish normal connection interruptions from
 * intentional component unmounting.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface SseReconnectionProps {
  readonly url: string;
}

interface SseReconnectionStateProps {
  readonly url: string;
}

interface SseReconnectControlProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Observes browser-managed SSE reconnection.
 *
 * The `error` event does not necessarily mean that the EventSource has permanently failed. An
 * interrupted connection commonly enters `CONNECTING`, allowing the browser to attempt another
 * connection automatically.
 */
export const SseReconnection: React.FC<SseReconnectionProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setStatus("Connected");
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
      <p>Status: {status}</p>
    </div>
  );
};

/**
 * Displays the EventSource state while a connection is allowed to reconnect.
 *
 * An SSE connection can repeatedly transition between OPEN and CONNECTING during its lifetime.
 * The CLOSED state is terminal for that EventSource instance because `close()` prevents further
 * automatic reconnection.
 */
export const SseReconnectionState: React.FC<SseReconnectionStateProps> = ({ url }): React.ReactElement => {
  const [readyState, setReadyState] = useState<number>(EventSource.CONNECTING);

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const updateState = (): void => {
      setReadyState(eventSource.readyState);
    };

    eventSource.addEventListener("open", updateState);
    eventSource.addEventListener("error", updateState);

    return (): void => {
      eventSource.removeEventListener("open", updateState);
      eventSource.removeEventListener("error", updateState);
      eventSource.close();
    };
  }, [url]);

  const stateName: string =
    readyState === EventSource.CONNECTING ? "CONNECTING" : readyState === EventSource.OPEN ? "OPEN" : "CLOSED";

  return (
    <div>
      <p>Current state: {stateName}</p>
      <p>Automatic reconnection is active while the state is CONNECTING.</p>
    </div>
  );
};

/**
 * Demonstrates that explicit closure stops browser-managed reconnection.
 *
 * The `EventSource` instance is retained by the component so a button can explicitly call
 * `close()`. Once closed, the same instance cannot be reopened; a new EventSource must be created
 * if the application later needs another connection.
 */
export const SseReconnectControl: React.FC<SseReconnectControlProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");
  const [closed, setClosed] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setStatus("Connected");
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

  const handleClose = (): void => {
    setClosed(true);
    setStatus("Closed by application");
  };

  return (
    <div>
      <p>Status: {status}</p>
      <p>Reconnection control: {closed ? "closed" : "active"}</p>
      <button type="button" onClick={handleClose} disabled={closed}>
        Close EventSource
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SseReconnectionExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>SSE Reconnection</h1>

      <h2>1. Browser-Managed Reconnection</h2>
      <SseReconnection url="https://example.com/events" />

      <h2>2. Reconnection State</h2>
      <SseReconnectionState url="https://example.com/events" />

      <h2>3. Explicitly Stopping Reconnection</h2>
      <SseReconnectControl url="https://example.com/events" />
    </main>
  );
};

export default SseReconnectionExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - EventSource automatically attempts to reconnect after an interrupted SSE connection.
// - An error event does not necessarily mean that the EventSource is permanently closed.
// - `readyState === EventSource.CONNECTING` commonly indicates that automatic reconnection is in progress.
// - The server can use the SSE `retry` field to communicate the reconnection delay.
// - Application code normally does not need to create a replacement EventSource for every transient error.
// - Calling `close()` explicitly stops automatic reconnection for that EventSource instance.
// - A closed EventSource cannot be reopened; a new EventSource instance is required.
// - React effect cleanup should explicitly close the EventSource when the component unmounts.
// - Reconnection and cleanup should be treated separately: network interruptions may reconnect, while intentional cleanup must terminate the connection.

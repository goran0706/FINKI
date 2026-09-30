/**
 * Polling vs. SSE vs. WebSocket
 * =============================
 *
 * Polling, Server-Sent Events (SSE), and WebSocket are different approaches to delivering changing
 * data between a browser and a server. Polling repeatedly creates independent HTTP requests, SSE
 * keeps one HTTP response open so the server can push text events to the browser, and WebSocket
 * upgrades a connection to a persistent bidirectional channel where both endpoints can send
 * messages.
 *
 * The main architectural distinction is communication direction and connection lifetime. Polling
 * is request-driven and works with ordinary HTTP infrastructure, SSE provides persistent
 * server-to-client delivery with browser-managed reconnection, and WebSocket provides persistent
 * two-way communication. The appropriate mechanism depends on whether the client needs continuous
 * updates, client-to-server messages over the same connection, or only periodic snapshots.
 */

import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface PollingExampleProps {
  readonly url: string;
  readonly interval: number;
}

interface SseExampleProps {
  readonly url: string;
}

interface WebSocketExampleProps {
  readonly url: string;
}

interface CommunicationComparisonProps {
  readonly polling: string;
  readonly sse: string;
  readonly webSocket: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates request-driven polling.
 *
 * Each polling cycle creates a new HTTP request and waits for its response. The requests are
 * independent, so there is no persistent application-level connection between cycles. The
 * interval controls how frequently the client asks the server for another snapshot.
 */
export const PollingExample: React.FC<PollingExampleProps> = ({ url, interval }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Waiting");
  const [requestCount, setRequestCount] = useState<number>(0);

  useEffect((): (() => void) => {
    let cancelled: boolean = false;

    const poll = async (): Promise<void> => {
      if (cancelled) {
        return;
      }

      setStatus("Requesting");

      try {
        const response: Response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        await response.text();

        if (!cancelled) {
          setRequestCount((previousCount: number): number => previousCount + 1);
          setStatus("Response received");
        }
      } catch {
        if (!cancelled) {
          setStatus("Request failed");
        }
      }
    };

    void poll();

    const timer: ReturnType<typeof setInterval> = setInterval((): void => {
      void poll();
    }, interval);

    return (): void => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [interval, url]);

  return (
    <div>
      <p>Status: {status}</p>
      <p>HTTP requests completed: {requestCount}</p>
    </div>
  );
};

/**
 * Demonstrates server-to-client streaming with SSE.
 *
 * EventSource creates one long-lived HTTP connection and receives events whenever the server sends
 * them. The browser manages reconnection after an interrupted connection, making SSE suitable for
 * continuously delivered server-originated updates.
 */
export const SseExample: React.FC<SseExampleProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");
  const [message, setMessage] = useState<string>("No event received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setStatus("Connected");
    };

    const handleMessage = (event: MessageEvent<string>): void => {
      setMessage(event.data);
    };

    const handleError = (_event: Event): void => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        setStatus("Reconnecting");
        return;
      }

      setStatus("Closed");
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("message", handleMessage);
    eventSource.addEventListener("error", handleError);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("message", handleMessage);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>Status: {status}</p>
      <p>Latest event: {message}</p>
    </div>
  );
};

/**
 * Demonstrates bidirectional communication with WebSocket.
 *
 * A WebSocket maintains a persistent connection through which both client and server can send
 * messages. The client can therefore send application messages without creating a separate HTTP
 * request for each operation.
 */
export const WebSocketExample: React.FC<WebSocketExampleProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");
  const [message, setMessage] = useState<string>("No message received");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect((): (() => void) => {
    const socket: WebSocket = new WebSocket(url);
    socketRef.current = socket;

    const handleOpen = (_event: Event): void => {
      setStatus("Connected");
    };

    const handleMessage = (event: MessageEvent<string>): void => {
      setMessage(event.data);
    };

    const handleError = (_event: Event): void => {
      setStatus("Connection error");
    };

    const handleClose = (_event: CloseEvent): void => {
      setStatus("Closed");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);

      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }

      socketRef.current = null;
    };
  }, [url]);

  const handleSend = (): void => {
    const socket: WebSocket | null = socketRef.current;

    if (socket === null || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "message",
        content: "Hello from the browser",
      }),
    );
  };

  return (
    <div>
      <p>Status: {status}</p>
      <p>Latest message: {message}</p>
      <button type="button" onClick={handleSend} disabled={status !== "Connected"}>
        Send message
      </button>
    </div>
  );
};

/**
 * Displays the communication-direction distinction between the three mechanisms.
 *
 * Polling and SSE use HTTP requests, but polling repeatedly starts new requests while SSE keeps
 * one response open. WebSocket is persistent and supports messages in both directions.
 */
export const CommunicationComparison: React.FC<CommunicationComparisonProps> = ({
  polling,
  sse,
  webSocket,
}): React.ReactElement => {
  return (
    <table>
      <thead>
        <tr>
          <th>Mechanism</th>
          <th>Communication model</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Polling</td>
          <td>{polling}</td>
        </tr>
        <tr>
          <td>SSE</td>
          <td>{sse}</td>
        </tr>
        <tr>
          <td>WebSocket</td>
          <td>{webSocket}</td>
        </tr>
      </tbody>
    </table>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PollingVsSseVsWebSocketExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Polling vs. SSE vs. WebSocket</h1>

      <h2>1. Request-Driven Polling</h2>
      <PollingExample url="https://example.com/api/status" interval={5000} />

      <h2>2. Server-Sent Events</h2>
      <SseExample url="https://example.com/events" />

      <h2>3. Bidirectional WebSocket Communication</h2>
      <WebSocketExample url="wss://example.com/socket" />

      <h2>4. Communication Model Comparison</h2>
      <CommunicationComparison
        polling="Client repeatedly requests server state."
        sse="Server continuously sends events over one HTTP connection."
        webSocket="Client and server can both send messages over one persistent connection."
      />
    </main>
  );
};

export default PollingVsSseVsWebSocketExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Polling repeatedly creates independent HTTP requests at an application-defined interval.
// - Polling is useful when periodic snapshots are sufficient and a persistent connection is unnecessary.
// - SSE keeps one HTTP response open and provides server-to-client event delivery.
// - EventSource automatically attempts to reconnect after an interrupted SSE connection.
// - WebSocket provides a persistent bidirectional channel for client-to-server and server-to-client messages.
// - SSE and WebSocket avoid the repeated request cycle used by polling for continuously delivered updates.
// - WebSocket is appropriate when the client also needs low-latency messages sent through the persistent channel.
// - SSE is inherently server-to-client; client commands require a separate HTTP mechanism or another connection.
// - The communication model should be selected according to the required direction, lifetime, and message behavior.

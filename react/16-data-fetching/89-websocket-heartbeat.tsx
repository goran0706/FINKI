/**
 * WebSocket Reconnection
 * ======================
 *
 * A WebSocket connection is a long-lived TCP-based communication channel that can close because
 * of network interruptions, server restarts, browser connectivity changes, or application-level
 * failures. Reconnection therefore requires explicit application logic: after a connection closes,
 * the client schedules a new WebSocket instance rather than attempting to reuse the closed object.
 *
 * A reliable reconnection strategy must also avoid creating multiple simultaneous connections,
 * must cancel pending timers when the component unmounts, and should normally use backoff so that
 * repeated failures do not produce a rapid stream of connection attempts. Exponential backoff
 * increases the delay between attempts while a maximum delay bounds how long the client waits.
 */

import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface ReconnectionDelayProps {
  readonly attempt: number;
  readonly baseDelay: number;
  readonly maximumDelay: number;
}

interface WebSocketReconnectionProps {
  readonly url: string;
  readonly baseDelay: number;
  readonly maximumDelay: number;
}

interface ReconnectionCleanupProps {
  readonly enabled: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Calculates an exponentially increasing delay for a reconnection attempt.
 *
 * The delay doubles for each subsequent attempt and is capped at maximumDelay.
 * The attempt number is zero-based: attempt 0 produces the base delay.
 */
export const ReconnectionDelay: React.FC<ReconnectionDelayProps> = ({
  attempt,
  baseDelay,
  maximumDelay,
}): React.ReactElement => {
  const delay: number = Math.min(baseDelay * 2 ** attempt, maximumDelay);

  return (
    <div>
      <p>Attempt: {attempt}</p>
      <p>Next delay: {delay} ms</p>
    </div>
  );
};

/**
 * Maintains a WebSocket connection and automatically reconnects after an unexpected close.
 *
 * A new WebSocket instance is created for every connection attempt because a WebSocket object
 * cannot be reopened after it has entered the CLOSED state. The reconnect timer is stored in a
 * ref so that it survives renders without causing additional renders.
 */
export const WebSocketReconnection: React.FC<WebSocketReconnectionProps> = ({
  url,
  baseDelay,
  maximumDelay,
}): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");
  const [attempt, setAttempt] = useState<number>(0);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedRef = useRef<boolean>(false);

  useEffect((): (() => void) => {
    stoppedRef.current = false;

    const clearReconnectTimer = (): void => {
      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const connect = (): void => {
      if (stoppedRef.current) {
        return;
      }

      clearReconnectTimer();
      setStatus("Connecting");

      const socket: WebSocket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = (_event: Event): void => {
        setStatus("Connected");
        setAttempt(0);
      };

      socket.onmessage = (_event: MessageEvent<string>): void => {
        setStatus("Message received");
      };

      socket.onerror = (_event: Event): void => {
        setStatus("Connection error");
      };

      socket.onclose = (_event: CloseEvent): void => {
        if (stoppedRef.current) {
          return;
        }

        setStatus("Disconnected");

        setAttempt((previousAttempt: number): number => {
          const nextAttempt: number = previousAttempt + 1;
          const delay: number = Math.min(baseDelay * 2 ** previousAttempt, maximumDelay);

          reconnectTimerRef.current = setTimeout((): void => {
            reconnectTimerRef.current = null;
            connect();
          }, delay);

          return nextAttempt;
        });
      };
    };

    connect();

    return (): void => {
      stoppedRef.current = true;
      clearReconnectTimer();

      const socket: WebSocket | null = socketRef.current;

      if (socket !== null) {
        socket.close();
        socketRef.current = null;
      }
    };
  }, [baseDelay, maximumDelay, url]);

  return (
    <div>
      <p>URL: {url}</p>
      <p>Status: {status}</p>
      <p>Reconnection attempts: {attempt}</p>
    </div>
  );
};

/**
 * Demonstrates why a pending reconnection timer must be cancelled during cleanup.
 *
 * A timer scheduled by a closed WebSocket can otherwise fire after the component has unmounted,
 * creating a new connection for a component that no longer exists. Cleanup prevents that timer
 * from outliving the component.
 */
export const ReconnectionCleanup: React.FC<ReconnectionCleanupProps> = ({ enabled }): React.ReactElement => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect((): (() => void) => {
    if (!enabled) {
      return (): void => {
        // No timer is created while reconnection is disabled.
      };
    }

    timerRef.current = setTimeout((): void => {
      timerRef.current = null;
    }, 5000);

    return (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled]);

  return <p>Reconnection timer: {enabled ? "scheduled" : "disabled"}</p>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const WebSocketReconnectionExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>WebSocket Reconnection</h1>

      <h2>1. Exponential Reconnection Delay</h2>
      <ReconnectionDelay attempt={3} baseDelay={1000} maximumDelay={10000} />

      <h2>2. Automatic WebSocket Reconnection</h2>
      <WebSocketReconnection url="wss://example.com/socket" baseDelay={1000} maximumDelay={10000} />

      <h2>3. Reconnection Timer Cleanup</h2>
      <ReconnectionCleanup enabled={true} />
    </main>
  );
};

export default WebSocketReconnectionExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A closed WebSocket cannot be reopened; each reconnection requires a new WebSocket instance.
// - The close event is the normal place to schedule a subsequent connection attempt.
// - Exponential backoff increases the delay between repeated failed connection attempts.
// - A maximum delay prevents exponential backoff from growing without an upper bound.
// - Reconnection timers belong in refs because changing a timer does not need to trigger a render.
// - Cleanup must cancel pending timers and close the active WebSocket when the component unmounts.
// - A stopped or unmounted component must not create a new connection from a delayed callback.
// - Successful connections reset the reconnection-attempt counter so later failures start over.

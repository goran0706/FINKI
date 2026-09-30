/**
 * Real-Time Data
 * ==============
 *
 * Real-time data is application state that is updated as new information
 * arrives rather than only being retrieved through an occasional request.
 * A React component can represent the latest server value in state and update
 * that state whenever a real-time transport delivers a new event.
 *
 * Common real-time transports include WebSockets, Server-Sent Events (SSE),
 * and other event-driven mechanisms. WebSockets provide bidirectional
 * communication over a persistent connection. SSE provides a persistent
 * HTTP connection through which a server can push text events to a browser.
 * The transport determines how data arrives, while React state determines how
 * the UI represents the latest application value.
 *
 * A real-time component must manage the connection lifecycle carefully.
 * Connections should normally be created from an effect and cleaned up when
 * the component unmounts or when a dependency changes. Without cleanup,
 * multiple subscriptions can remain active and cause duplicated updates,
 * unnecessary network activity, or state updates from obsolete connections.
 *
 * Real-time events can arrive faster than a component renders, and events can
 * arrive after a previous value has already been replaced. The component must
 * therefore define what each event means and how it affects state. Replacing
 * the current value is appropriate for snapshots, while functional state
 * updates are useful when each event modifies previously stored state.
 *
 * A common misconception is that real-time data means the browser always has
 * a permanently reliable connection. Network failures, server restarts,
 * browser suspension, proxy behavior, and authentication changes can all
 * interrupt a stream. Production real-time clients therefore commonly need
 * explicit connection-state handling, cleanup, reconnection, and recovery
 * strategies.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RealTimeDataProps {
  readonly initialValue: number;
  readonly updateIntervalMs: number;
}

export interface RealTimeSnapshotProps {
  readonly initialValue: number;
}

export interface RealTimeEventProps {
  readonly initialValue: number;
  readonly updateIntervalMs: number;
}

export interface RealTimeConnectionProps {
  readonly updateIntervalMs: number;
}

export interface RealTimeLifecycleProps {
  readonly initialValue: number;
  readonly updateIntervalMs: number;
}

export interface RealTimeLatestValueProps {
  readonly initialValue: number;
  readonly updateIntervalMs: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic real-time value that changes whenever a simulated
 * server event arrives.
 *
 * The interval represents an external event source. In a real application,
 * the callback could instead be invoked by a WebSocket, SSE connection, or
 * another event-driven transport.
 */
export const RealTimeData: React.FC<RealTimeDataProps> = ({
  initialValue,
  updateIntervalMs,
}: RealTimeDataProps): React.ReactElement => {
  const [value, setValue] = useState<number>(initialValue);

  useEffect((): (() => void) => {
    const intervalId: number = window.setInterval((): void => {
      setValue((previousValue: number): number => previousValue + 1);
    }, updateIntervalMs);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [updateIntervalMs]);

  return (
    <section>
      <p>Current real-time value: {value}</p>
    </section>
  );
};

/**
 * Demonstrates the snapshot model of real-time data.
 *
 * Each incoming event represents the complete current value. The component
 * replaces the previous snapshot rather than deriving the next value from the
 * previous state.
 */
export const RealTimeSnapshot: React.FC<RealTimeSnapshotProps> = ({
  initialValue,
}: RealTimeSnapshotProps): React.ReactElement => {
  const [snapshot, setSnapshot] = useState<number>(initialValue);

  useEffect((): (() => void) => {
    const eventSource: number = window.setInterval((): void => {
      const nextSnapshot: number = Math.floor(Math.random() * 100);

      setSnapshot(nextSnapshot);
    }, 1000);

    return (): void => {
      window.clearInterval(eventSource);
    };
  }, []);

  return (
    <section>
      <p>Latest complete snapshot: {snapshot}</p>
    </section>
  );
};

/**
 * Demonstrates an event stream in which every incoming event represents an
 * incremental change.
 *
 * Functional state updates ensure that each event is calculated from the
 * latest React state value even when multiple events arrive close together.
 */
export const RealTimeEvent: React.FC<RealTimeEventProps> = ({
  initialValue,
  updateIntervalMs,
}: RealTimeEventProps): React.ReactElement => {
  const [value, setValue] = useState<number>(initialValue);
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const eventSource: number = window.setInterval((): void => {
      setValue((previousValue: number): number => previousValue + 5);

      setEventCount((previousCount: number): number => previousCount + 1);
    }, updateIntervalMs);

    return (): void => {
      window.clearInterval(eventSource);
    };
  }, [updateIntervalMs]);

  return (
    <section>
      <p>Current value: {value}</p>
      <p>Events received: {eventCount}</p>
    </section>
  );
};

/**
 * Demonstrates explicit connection-state tracking for a real-time source.
 *
 * The simulated connection transitions to "connected" when the effect starts
 * and to "disconnected" during cleanup. Real transports expose their own
 * connection events that can be mapped to similar application state.
 */
export const RealTimeConnection: React.FC<RealTimeConnectionProps> = ({
  updateIntervalMs,
}: RealTimeConnectionProps): React.ReactElement => {
  const [connectionState, setConnectionState] = useState<"disconnected" | "connected">("disconnected");

  useEffect((): (() => void) => {
    setConnectionState("connected");

    const intervalId: number = window.setInterval((): void => {
      setConnectionState("connected");
    }, updateIntervalMs);

    return (): void => {
      window.clearInterval(intervalId);

      setConnectionState("disconnected");
    };
  }, [updateIntervalMs]);

  return (
    <section>
      <p>Connection state: {connectionState}</p>
    </section>
  );
};

/**
 * Demonstrates real-time lifecycle cleanup.
 *
 * The effect creates an external subscription and returns a cleanup function
 * that removes it. This prevents the old subscription from continuing when the
 * component is unmounted or when the interval dependency changes.
 */
export const RealTimeLifecycle: React.FC<RealTimeLifecycleProps> = ({
  initialValue,
  updateIntervalMs,
}: RealTimeLifecycleProps): React.ReactElement => {
  const [value, setValue] = useState<number>(initialValue);
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0);

  useEffect((): (() => void) => {
    setSubscriptionCount((previousCount: number): number => previousCount + 1);

    const intervalId: number = window.setInterval((): void => {
      setValue((previousValue: number): number => previousValue + 1);
    }, updateIntervalMs);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [updateIntervalMs]);

  return (
    <section>
      <p>Current value: {value}</p>
      <p>Subscription starts observed: {subscriptionCount}</p>
    </section>
  );
};

/**
 * Demonstrates retaining only the latest real-time value.
 *
 * This pattern is useful when the UI needs the newest server snapshot but does
 * not need a history of every event. Keeping only the latest value also avoids
 * unbounded client-side state growth.
 */
export const RealTimeLatestValue: React.FC<RealTimeLatestValueProps> = ({
  initialValue,
  updateIntervalMs,
}: RealTimeLatestValueProps): React.ReactElement => {
  const [latestValue, setLatestValue] = useState<number>(initialValue);

  useEffect((): (() => void) => {
    const intervalId: number = window.setInterval((): void => {
      const incomingValue: number = Math.floor(Math.random() * 1000);

      setLatestValue(incomingValue);
    }, updateIntervalMs);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [updateIntervalMs]);

  return (
    <section>
      <p>Latest received value: {latestValue}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const RealTimeDataDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Real-Time Data</h1>

      <h2>1. Update React State From a Real-Time Source</h2>
      <RealTimeData initialValue={0} updateIntervalMs={1000} />

      <h2>2. Replace State With the Latest Snapshot</h2>
      <RealTimeSnapshot initialValue={0} />

      <h2>3. Apply Incremental Real-Time Events</h2>
      <RealTimeEvent initialValue={0} updateIntervalMs={1000} />

      <h2>4. Track the Real-Time Connection State</h2>
      <RealTimeConnection updateIntervalMs={1000} />

      <h2>5. Clean Up Real-Time Subscriptions</h2>
      <RealTimeLifecycle initialValue={0} updateIntervalMs={1000} />

      <h2>6. Keep Only the Latest Real-Time Value</h2>
      <RealTimeLatestValue initialValue={0} updateIntervalMs={1000} />
    </main>
  );
};

export default RealTimeDataDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Real-time data updates application state as external events arrive.
// - WebSockets and Server-Sent Events are examples of transports that can deliver real-time data.
// - Snapshot events replace the current value, while incremental events can derive their result from previous state.
// - Functional state updates prevent event handlers from relying on stale state values.
// - Real-time subscriptions should be created and cleaned up with an effect.
// - Connection state should be represented separately when the UI needs to distinguish connected and disconnected conditions.
// - Keeping only the latest snapshot prevents unnecessary unbounded growth when event history is not required.
// - Network connections are not permanently reliable and can require reconnection and recovery logic in production systems.
// - Client-side real-time state does not guarantee that the displayed value is current if the connection is interrupted or events are lost.

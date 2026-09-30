/**
 * Effect Cleanup
 * ==============
 *
 * Effect cleanup releases or reverses external resources established by an
 * Effect. The cleanup function is returned from the Effect setup function.
 * React runs cleanup before the Effect is re-synchronized because a dependency
 * changed, and it runs the final cleanup when the component unmounts.
 *
 * Cleanup is required for resources that persist outside React's render tree,
 * such as timers, DOM event listeners, subscriptions, and connections. The
 * cleanup operation should correspond to the setup operation so that each
 * synchronization cycle leaves no obsolete resource behind.
 *
 * Cleanup is not a general-purpose callback for every state change. It should
 * undo the specific external synchronization established by the associated
 * setup. Calling state setters from cleanup can also create confusing update
 * behavior and is generally unnecessary when the cleanup is correctly scoped
 * to the external resource.
 *
 * Development Strict Mode can run an Effect's setup and cleanup more than once
 * during initial development lifecycle checks. Cleanup must therefore be
 * idempotent with respect to the resource it owns: removing an event listener
 * should remove the listener created by that setup, and clearing a timer should
 * clear the timer created by that setup.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TimerCleanupProps {
  readonly delay: number;
}

export interface EventListenerCleanupProps {
  readonly eventName: string;
}

export interface SubscriptionCleanupProps {
  readonly channel: string;
}

export interface ConnectionCleanupProps {
  readonly initialConnected: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const TimerCleanup: FC<TimerCleanupProps> = ({ delay }): ReactElement => {
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect((): (() => void) => {
    setCompleted(false);

    // same with intervals
    const timerId: number = window.setTimeout((): void => {
      setCompleted(true);
    }, delay);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [delay]);

  return (
    <section>
      <p>{completed ? "Timer completed." : "Timer is running."}</p>
    </section>
  );
};

export const EventListenerCleanup: FC<EventListenerCleanupProps> = ({ eventName }): ReactElement => {
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const handleEvent = (): void => {
      setEventCount((previousCount: number): number => previousCount + 1);
    };

    window.addEventListener(eventName, handleEvent);

    return (): void => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName]);

  return (
    <section>
      <p>
        Events received for "{eventName}": {eventCount}
      </p>
    </section>
  );
};

export const SubscriptionCleanup: FC<SubscriptionCleanupProps> = ({ channel }): ReactElement => {
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const handleMessage = (): void => {
      setMessageCount((previousCount: number): number => previousCount + 1);
    };

    window.addEventListener(`message:${channel}`, handleMessage);

    return (): void => {
      window.removeEventListener(`message:${channel}`, handleMessage);
    };
  }, [channel]);

  return (
    <section>
      <p>
        Messages received from "{channel}": {messageCount}
      </p>
    </section>
  );
};

export const ConnectionCleanup: FC<ConnectionCleanupProps> = ({ initialConnected }): ReactElement => {
  const [connected, setConnected] = useState<boolean>(initialConnected);

  useEffect((): (() => void) | undefined => {
    if (!connected) {
      return undefined;
    }

    const connectionId: number = window.setInterval((): void => {
      // The interval represents an external resource that must be released.
    }, 1000);

    return (): void => {
      window.clearInterval(connectionId);
    };
  }, [connected]);

  const toggleConnection = (): void => {
    setConnected((previousConnected: boolean): boolean => !previousConnected);
  };

  return (
    <section>
      <p>Connection: {connected ? "Connected" : "Disconnected"}</p>

      <button type="button" onClick={toggleConnection}>
        Toggle connection
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectCleanupExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Cleaning up a timer when synchronization changes</h2>
      <TimerCleanup delay={2000} />

      <h2>2. Removing an event listener during cleanup</h2>
      <EventListenerCleanup eventName="resize" />

      <h2>3. Ending a subscription when its dependency changes</h2>
      <SubscriptionCleanup channel="example-channel" />

      <h2>4. Releasing an external connection resource</h2>
      <ConnectionCleanup initialConnected={false} />
    </main>
  );
};

export default EffectCleanupExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Effect cleanup releases resources established by the corresponding setup.
// - React runs cleanup before re-running an Effect after dependency changes.
// - React also runs the final cleanup when the component unmounts.
// - Timers should be cleared with their corresponding `clearTimeout` or
//   `clearInterval` operation.
// - Event listeners should be removed using the same event type and handler
//   function that were supplied to `addEventListener`.
// - Subscriptions and connections should be explicitly terminated during
//   cleanup.
// - Each setup should clean up only the external resource created by that
//   synchronization cycle.
// - Cleanup must tolerate development lifecycle checks that can repeat setup
//   and cleanup.
// - Cleanup is for reversing external synchronization, not for performing
//   unrelated application state transitions.

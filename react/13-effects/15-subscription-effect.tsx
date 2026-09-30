/**
 * Subscription Effect
 * ===================
 *
 * A subscription is an external system that can notify a React component when
 * something changes. An Effect can establish the subscription after a commit
 * and return cleanup that removes exactly that subscription.
 *
 * The setup function captures the subscription inputs from its render. When a
 * dependency changes, React runs cleanup for the previous subscription before
 * running setup for the new dependency values. This prevents multiple active
 * subscriptions from accumulating and ensures notifications are associated
 * with the current synchronization.
 *
 * The browser `EventTarget` API provides a concrete subscription model:
 * `addEventListener` registers a callback and `removeEventListener` unregisters
 * it. The same event type, target, and callback function identity must be used
 * for removal. Creating a new callback for cleanup instead of retaining the
 * setup callback leaves the original listener registered.
 *
 * Subscription callbacks can update React state with functional updates when
 * the new state depends on the previous state. The subscription itself should
 * still be established and removed by the Effect so its lifetime follows the
 * component's synchronization requirements.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WindowSubscriptionProps {
  readonly eventName: string;
}

export interface ChannelSubscriptionProps {
  readonly initialChannel: string;
}

export interface SubscriptionStatusProps {
  readonly initialSubscribed: boolean;
}

export interface EventCountSubscriptionProps {
  readonly eventName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const WindowSubscription: FC<WindowSubscriptionProps> = ({ eventName }): ReactElement => {
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
        "{eventName}" events received: {eventCount}
      </p>
    </section>
  );
};

export const ChannelSubscription: FC<ChannelSubscriptionProps> = ({ initialChannel }): ReactElement => {
  const [channel, setChannel] = useState<string>(initialChannel);
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect((): (() => void) => {
    setMessageCount(0);

    const handleMessage = (): void => {
      setMessageCount((previousCount: number): number => previousCount + 1);
    };

    const eventName: string = `channel:${channel}`;

    window.addEventListener(eventName, handleMessage);

    return (): void => {
      window.removeEventListener(eventName, handleMessage);
    };
  }, [channel]);

  const changeChannel = (): void => {
    setChannel((previousChannel: string): string => (previousChannel === "general" ? "updates" : "general"));
  };

  return (
    <section>
      <p>Subscribed channel: {channel}</p>
      <p>Messages received: {messageCount}</p>

      <button type="button" onClick={changeChannel}>
        Change channel
      </button>
    </section>
  );
};

export const SubscriptionStatus: FC<SubscriptionStatusProps> = ({ initialSubscribed }): ReactElement => {
  const [subscribed, setSubscribed] = useState<boolean>(initialSubscribed);
  const [status, setStatus] = useState<string>(initialSubscribed ? "Subscribed" : "Not subscribed");

  useEffect((): (() => void) | undefined => {
    if (!subscribed) {
      setStatus("Not subscribed");
      return undefined;
    }

    setStatus("Subscribed");

    const handleUpdate = (): void => {
      setStatus("Subscription received an update");
    };

    window.addEventListener("example-update", handleUpdate);

    return (): void => {
      window.removeEventListener("example-update", handleUpdate);
    };
  }, [subscribed]);

  const toggleSubscription = (): void => {
    setSubscribed((previousSubscribed: boolean): boolean => !previousSubscribed);
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={toggleSubscription}>
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </button>
    </section>
  );
};

export const EventCountSubscription: FC<EventCountSubscriptionProps> = ({ eventName }): ReactElement => {
  const [count, setCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const handleEvent = (): void => {
      setCount((previousCount: number): number => previousCount + 1);
    };

    window.addEventListener(eventName, handleEvent);

    return (): void => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName]);

  return (
    <section>
      <p>
        Active subscription for "{eventName}": {count} notifications
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SubscriptionEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Subscribing to a browser event and removing the listener</h2>
      <WindowSubscription eventName="resize" />

      <h2>2. Replacing a subscription when its channel changes</h2>
      <ChannelSubscription initialChannel="general" />

      <h2>3. Starting and stopping a subscription from state</h2>
      <SubscriptionStatus initialSubscribed={false} />

      <h2>4. Updating state safely from a subscription callback</h2>
      <EventCountSubscription eventName="online" />
    </main>
  );
};

export default SubscriptionEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Subscriptions are external systems whose lifetime should be synchronized
//   with React through an Effect.
// - Subscription setup belongs in the Effect, and cleanup must remove the exact
//   subscription established by that setup.
// - `removeEventListener` requires the same event type and callback identity
//   used by `addEventListener`.
// - When a subscription dependency changes, React cleans up the previous
//   subscription before establishing the new one.
// - Conditional subscriptions should return no cleanup when no subscription
//   was established.
// - Functional state updates are useful when subscription callbacks increment,
//   append, or otherwise derive new state from previous state.
// - Missing cleanup can cause duplicate notifications and stale subscriptions.
// - Development Strict Mode can repeat setup and cleanup, so subscription
//   synchronization must remain correct when it is started and stopped more
//   than once.

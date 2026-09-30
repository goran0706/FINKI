/**
 * useOptimistic
 * =============
 *
 * `useOptimistic` provides temporary state that represents the result a user
 * expects before the corresponding asynchronous or transition-based operation
 * finishes. It returns the current optimistic value and a dispatcher that
 * applies an optimistic update function to the latest base state.
 *
 * The first argument is the base state. The second argument is a pure update
 * function that receives the current state and an action and returns the
 * temporary state to display while the associated Action is pending.
 *
 * Optimistic state does not replace the underlying source of truth. When the
 * surrounding Action or Transition finishes, React reconciles the optimistic
 * value with the current base state. If the base state has not been updated to
 * reflect the requested change, the optimistic value is removed and the UI
 * returns to the base state.
 *
 * The optimistic dispatcher is intended to be called while an Action or
 * Transition is executing. `startTransition` can establish the transition
 * boundary for client-side examples. The update function itself must remain
 * pure because React may evaluate it while processing optimistic updates.
 *
 * A common misconception is that `useOptimistic` persists changes by itself.
 * It does not perform the server request, mutate external data, or permanently
 * update the base state. The application must perform the real operation and
 * then update the source of truth that supplies the base state.
 */

import { type ChangeEvent, type FC, type ReactNode, startTransition, useOptimistic, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface OptimisticCounterProps {
  readonly initialCount: number;
}

export interface OptimisticLikeState {
  readonly count: number;
  readonly liked: boolean;
}

export interface OptimisticLikeProps {
  readonly initialState: OptimisticLikeState;
}

export interface Message {
  readonly id: number;
  readonly text: string;
  readonly sending: boolean;
}

export interface OptimisticMessageProps {
  readonly initialMessages: readonly Message[];
}

export interface OptimisticFormProps {
  readonly initialValue: string;
}

export interface OptimisticFailureProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates an optimistic numeric update. The UI changes immediately
 * inside a transition while the simulated operation is pending. The base
 * state is updated after the operation succeeds, which makes the optimistic
 * value become the new committed value.
 */
export const OptimisticCounterExample: FC<OptimisticCounterProps> = ({
  initialCount,
}: OptimisticCounterProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);
  const [optimisticCount, addOptimisticCount] = useOptimistic<number, number>(
    count,
    (currentCount: number, change: number): number => currentCount + change,
  );

  const increment = (): void => {
    startTransition(async (): Promise<void> => {
      addOptimisticCount(1);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 500);
      });

      setCount((previousCount: number): number => previousCount + 1);
    });
  };

  return (
    <section>
      <h3>Optimistic counter</h3>
      <p>Displayed count: {optimisticCount}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates an optimistic toggle where the optimistic state contains
 * multiple related fields. The update function receives an action describing
 * the intended change and returns a new immutable state object.
 */
export const OptimisticLikeExample: FC<OptimisticLikeProps> = ({ initialState }: OptimisticLikeProps): ReactNode => {
  const [state, setState] = useState<OptimisticLikeState>(initialState);

  const [optimisticState, updateOptimisticState] = useOptimistic<OptimisticLikeState, boolean>(
    state,
    (currentState: OptimisticLikeState, nextLiked: boolean): OptimisticLikeState => ({
      count: nextLiked ? currentState.count + 1 : Math.max(0, currentState.count - 1),
      liked: nextLiked,
    }),
  );

  const toggleLike = (): void => {
    const nextLiked: boolean = !optimisticState.liked;

    startTransition(async (): Promise<void> => {
      updateOptimisticState(nextLiked);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 500);
      });

      setState((previousState: OptimisticLikeState): OptimisticLikeState => ({
        count: nextLiked ? previousState.count + 1 : Math.max(0, previousState.count - 1),
        liked: nextLiked,
      }));
    });
  };

  return (
    <section>
      <h3>Optimistic toggle</h3>
      <p>Likes: {optimisticState.count}</p>
      <p>Status: {optimisticState.liked ? "Liked" : "Not liked"}</p>
      <button type="button" onClick={toggleLike}>
        {optimisticState.liked ? "Unlike" : "Like"}
      </button>
    </section>
  );
};

/**
 * Demonstrates optimistic insertion into a collection. A temporary message is
 * displayed immediately with `sending: true`, then the base state is updated
 * after the simulated asynchronous operation completes.
 */
export const OptimisticMessageExample: FC<OptimisticMessageProps> = ({
  initialMessages,
}: OptimisticMessageProps): ReactNode => {
  const [messages, setMessages] = useState<readonly Message[]>(initialMessages);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<readonly Message[], Message>(
    messages,
    (currentMessages: readonly Message[], message: Message): readonly Message[] => [...currentMessages, message],
  );

  const sendMessage = (): void => {
    const message: Message = {
      id: Date.now(),
      text: "Hello from the optimistic UI.",
      sending: true,
    };

    startTransition(async (): Promise<void> => {
      addOptimisticMessage(message);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 700);
      });

      setMessages((previousMessages: readonly Message[]): readonly Message[] => [
        ...previousMessages,
        {
          ...message,
          sending: false,
        },
      ]);
    });
  };

  return (
    <section>
      <h3>Optimistic collection update</h3>

      <ul>
        {optimisticMessages.map((message: Message): ReactNode => (
          <li key={message.id}>
            {message.text}
            {message.sending ? " — Sending..." : " — Sent"}
          </li>
        ))}
      </ul>

      <button type="button" onClick={sendMessage}>
        Send message
      </button>
    </section>
  );
};

/**
 * Demonstrates that the optimistic update function should calculate a value
 * rather than perform an external side effect. The safe pattern is to keep
 * the update function pure and perform the real operation in the surrounding
 * Action or Transition.
 */
export const PureOptimisticUpdateExample: FC = (): ReactNode => {
  const [value, setValue] = useState<number>(0);

  const [optimisticValue, updateOptimisticValue] = useOptimistic<number, number>(
    value,
    (currentValue: number, nextValue: number): number => nextValue,
  );

  const update = (): void => {
    startTransition(async (): Promise<void> => {
      updateOptimisticValue(value + 1);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 400);
      });

      setValue((previousValue: number): number => previousValue + 1);
    });
  };

  return (
    <section>
      <h3>Pure optimistic update function</h3>
      <p>Value: {optimisticValue}</p>
      <button type="button" onClick={update}>
        Update value
      </button>
    </section>
  );
};

/**
 * Demonstrates that optimistic state is temporary. If the underlying
 * operation fails and the base state is not changed, the optimistic value
 * disappears when the transition completes.
 */
export const OptimisticFailureExample: FC<OptimisticFailureProps> = ({
  initialCount,
}: OptimisticFailureProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);

  const [optimisticCount, addOptimisticCount] = useOptimistic<number, number>(
    count,
    (currentCount: number, change: number): number => currentCount + change,
  );

  const simulateFailure = (): void => {
    startTransition(async (): Promise<void> => {
      addOptimisticCount(1);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 500);
      });

      // The base state intentionally remains unchanged to simulate failure.
      setCount((previousCount: number): number => previousCount);
    });
  };

  return (
    <section>
      <h3>Optimistic rollback</h3>
      <p>Count: {optimisticCount}</p>
      <button type="button" onClick={simulateFailure}>
        Simulate failed update
      </button>
    </section>
  );
};

/**
 * Demonstrates a common misconception by showing an invalid approach as text.
 * `useOptimistic` does not replace the source of truth, so changing only the
 * optimistic value cannot permanently persist an external update.
 */
export const OptimisticSourceOfTruthExample: FC = (): ReactNode => {
  const invalidPattern: string = `
// This does not permanently save the value.
addOptimisticValue(nextValue);

// The real operation must update the source of truth.
await saveValue(nextValue);
setValue(nextValue);
`;

  return (
    <section>
      <h3>Optimistic state is not the source of truth</h3>
      <pre>{invalidPattern}</pre>
    </section>
  );
};

/**
 * Demonstrates that optimistic state can be driven by normal input state.
 * The input itself remains controlled by `useState`; `useOptimistic` is used
 * only for the temporary value shown while the update is pending.
 */
export const OptimisticInputExample: FC<OptimisticFormProps> = ({ initialValue }: OptimisticFormProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);

  const [optimisticValue, updateOptimisticValue] = useOptimistic<string, string>(
    value,
    (_currentValue: string, nextValue: string): string => nextValue,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const save = (): void => {
    startTransition(async (): Promise<void> => {
      updateOptimisticValue(value);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 500);
      });

      setValue(value);
    });
  };

  return (
    <section>
      <h3>Optimistic value with controlled input</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <button type="button" onClick={save}>
        Save
      </button>

      <p>Displayed saved value: {optimisticValue}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseOptimisticContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useOptimistic</h1>

      <h2>1. Showing an optimistic numeric update</h2>
      <OptimisticCounterExample initialCount={0} />

      <h2>2. Applying an optimistic toggle</h2>
      <OptimisticLikeExample
        initialState={{
          count: 10,
          liked: false,
        }}
      />

      <h2>3. Adding optimistic collection items</h2>
      <OptimisticMessageExample
        initialMessages={[
          {
            id: 1,
            text: "Existing message.",
            sending: false,
          },
        ]}
      />

      <h2>4. Keeping optimistic update functions pure</h2>
      <PureOptimisticUpdateExample />

      <h2>5. Returning to base state after failure</h2>
      <OptimisticFailureExample initialCount={0} />

      <h2>6. Keeping the source of truth separate</h2>
      <OptimisticSourceOfTruthExample />

      <h2>7. Combining optimistic state with input state</h2>
      <OptimisticInputExample initialValue="John Doe" />
    </main>
  );
};

export default UseOptimisticContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useOptimistic` displays temporary state while an Action or Transition is pending.
// - The first argument is the committed base state.
// - The update function calculates optimistic state from the current state and an action.
// - Optimistic update functions should be pure and should not perform side effects.
// - The optimistic dispatcher is intended to run inside an Action or Transition.
// - Optimistic state does not replace or permanently mutate the source of truth.
// - The underlying operation must update the base state when it succeeds.
// - If the base state does not incorporate the optimistic change, the UI can return to it.
// - `startTransition` can establish the transition boundary for client-side optimistic updates.

/**
 * Zustand Actions
 * ===============
 *
 * Zustand actions are functions stored alongside state in a Zustand store. They use the set
 * function to update state and can use the get function to read the current store state when
 * an update depends on multiple values or when one action needs to coordinate other state.
 *
 * Actions are part of the store's public API, so components do not need to contain the state
 * transition logic themselves. Keeping state changes inside actions centralizes the behavior and
 * gives every component the same update rules.
 *
 * Actions can perform direct updates, functional updates based on previous state, coordinated
 * updates across multiple fields, and asynchronous work. An action does not need to be called
 * from a React component; it can also be invoked through the store's imperative API.
 */

import { create } from "zustand";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterActionsStore {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export interface QuantityStore {
  readonly quantity: number;
  readonly increase: (amount: number) => void;
  readonly decrease: (amount: number) => void;
}

export interface AccountStore {
  readonly name: string;
  readonly email: string;
  readonly profileComplete: boolean;
  readonly updateAccount: (name: string, email: string) => void;
  readonly clearAccount: () => void;
}

export interface ActionCompositionStore {
  readonly count: number;
  readonly increment: () => void;
  readonly incrementTwice: () => void;
}

export interface AsyncActionStore {
  readonly status: "idle" | "loading" | "succeeded";
  readonly message: string;
  readonly loadMessage: () => Promise<void>;
}

export interface ZustandActionsExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const useCounterActionsStore = create<CounterActionsStore>((set): CounterActionsStore => ({
  count: 0,
  increment: (): void => {
    set((state): Pick<CounterActionsStore, "count"> => ({
      count: state.count + 1,
    }));
  },
  decrement: (): void => {
    set((state): Pick<CounterActionsStore, "count"> => ({
      count: state.count - 1,
    }));
  },
  reset: (): void => {
    set({
      count: 0,
    });
  },
}));

export const ZustandBasicActionsExample: FC<ZustandActionsExampleProps> = ({
  title,
}: ZustandActionsExampleProps): ReactElement => {
  const count: number = useCounterActionsStore((state: CounterActionsStore): number => state.count);
  const increment: () => void = useCounterActionsStore((state: CounterActionsStore): (() => void) => state.increment);
  const decrement: () => void = useCounterActionsStore((state: CounterActionsStore): (() => void) => state.decrement);
  const reset: () => void = useCounterActionsStore((state: CounterActionsStore): (() => void) => state.reset);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={decrement}>
        Decrement
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </article>
  );
};

export const useQuantityStore = create<QuantityStore>((set): QuantityStore => ({
  quantity: 1,
  increase: (amount: number): void => {
    set((state): Pick<QuantityStore, "quantity"> => ({
      quantity: state.quantity + amount,
    }));
  },
  decrease: (amount: number): void => {
    set((state): Pick<QuantityStore, "quantity"> => ({
      quantity: Math.max(0, state.quantity - amount),
    }));
  },
}));

export const ZustandParameterizedActionExample: FC<ZustandActionsExampleProps> = ({
  title,
}: ZustandActionsExampleProps): ReactElement => {
  const quantity: number = useQuantityStore((state: QuantityStore): number => state.quantity);
  const increase: (amount: number) => void = useQuantityStore(
    (state: QuantityStore): ((amount: number) => void) => state.increase,
  );
  const decrease: (amount: number) => void = useQuantityStore(
    (state: QuantityStore): ((amount: number) => void) => state.decrease,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Quantity: {quantity}</p>
      <button
        type="button"
        onClick={() => {
          increase(5);
        }}
      >
        Increase by 5
      </button>
      <button
        type="button"
        onClick={() => {
          decrease(2);
        }}
      >
        Decrease by 2
      </button>
    </article>
  );
};

export const useAccountStore = create<AccountStore>((set): AccountStore => ({
  name: "",
  email: "",
  profileComplete: false,
  updateAccount: (name: string, email: string): void => {
    set({
      name,
      email,
      profileComplete: name.trim().length > 0 && email.includes("@"),
    });
  },
  clearAccount: (): void => {
    set({
      name: "",
      email: "",
      profileComplete: false,
    });
  },
}));

export const ZustandCoordinatedActionExample: FC<ZustandActionsExampleProps> = ({
  title,
}: ZustandActionsExampleProps): ReactElement => {
  const name: string = useAccountStore((state: AccountStore): string => state.name);
  const email: string = useAccountStore((state: AccountStore): string => state.email);
  const profileComplete: boolean = useAccountStore((state: AccountStore): boolean => state.profileComplete);
  const updateAccount: (name: string, email: string) => void = useAccountStore(
    (state: AccountStore): ((name: string, email: string) => void) => state.updateAccount,
  );
  const clearAccount: () => void = useAccountStore((state: AccountStore): (() => void) => state.clearAccount);

  return (
    <article>
      <h3>{title}</h3>
      <p>Name: {name || "Not set"}</p>
      <p>Email: {email || "Not set"}</p>
      <p>Profile: {profileComplete ? "complete" : "incomplete"}</p>
      <button
        type="button"
        onClick={() => {
          updateAccount("John Doe", "john.doe@example.com");
        }}
      >
        Set account
      </button>
      <button type="button" onClick={clearAccount}>
        Clear account
      </button>
    </article>
  );
};

export const useActionCompositionStore = create<ActionCompositionStore>((set, get): ActionCompositionStore => ({
  count: 0,
  increment: (): void => {
    set((state): Pick<ActionCompositionStore, "count"> => ({
      count: state.count + 1,
    }));
  },
  incrementTwice: (): void => {
    get().increment();
    get().increment();
  },
}));

export const ZustandActionCompositionExample: FC<ZustandActionsExampleProps> = ({
  title,
}: ZustandActionsExampleProps): ReactElement => {
  const count: number = useActionCompositionStore((state: ActionCompositionStore): number => state.count);
  const incrementTwice: () => void = useActionCompositionStore(
    (state: ActionCompositionStore): (() => void) => state.incrementTwice,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={incrementTwice}>
        Increment twice
      </button>
    </article>
  );
};

export const useAsyncActionStore = create<AsyncActionStore>((set): AsyncActionStore => ({
  status: "idle",
  message: "",
  loadMessage: async (): Promise<void> => {
    set({
      status: "loading",
    });

    await new Promise<void>((resolve): void => {
      window.setTimeout(resolve, 700);
    });

    set({
      status: "succeeded",
      message: "Data loaded successfully.",
    });
  },
}));

export const ZustandAsyncActionExample: FC<ZustandActionsExampleProps> = ({
  title,
}: ZustandActionsExampleProps): ReactElement => {
  const status: AsyncActionStore["status"] = useAsyncActionStore(
    (state: AsyncActionStore): AsyncActionStore["status"] => state.status,
  );
  const message: string = useAsyncActionStore((state: AsyncActionStore): string => state.message);
  const loadMessage: () => Promise<void> = useAsyncActionStore(
    (state: AsyncActionStore): (() => Promise<void>) => state.loadMessage,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Status: {status}</p>
      <p>{message || "No data loaded."}</p>
      <button
        type="button"
        disabled={status === "loading"}
        onClick={() => {
          void loadMessage();
        }}
      >
        {status === "loading" ? "Loading..." : "Load data"}
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandActionsDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Defining Basic Store Actions</h2>
      <ZustandBasicActionsExample title="Basic Actions" />

      <h2>2. Passing Arguments to Actions</h2>
      <ZustandParameterizedActionExample title="Parameterized Actions" />

      <h2>3. Updating Multiple State Values in One Action</h2>
      <ZustandCoordinatedActionExample title="Coordinated Action" />

      <h2>4. Composing Actions with get()</h2>
      <ZustandActionCompositionExample title="Composed Actions" />

      <h2>5. Performing Asynchronous Work in an Action</h2>
      <ZustandAsyncActionExample title="Async Action" />
    </section>
  );
};

export default ZustandActionsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Zustand actions are functions stored directly alongside the state they modify.
// Actions use set to create state updates and can use functional updates when previous state matters.
// Actions can accept typed parameters for reusable state transitions.
// One action can update multiple related state properties atomically.
// The get function allows one action to read the current store state or compose other actions.
// Asynchronous actions can perform async work and call set when the operation progresses or completes.
// Keeping state transitions inside actions prevents components from duplicating store update logic.

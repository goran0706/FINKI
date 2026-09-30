/**
 * Zustand Store
 * =============
 *
 * A Zustand store is a centralized state container created with the create function.
 * The store can hold state values, derived behavior, and actions that update the state.
 *
 * Zustand separates the store definition from the components that consume it. The generated
 * hook can be used inside React components for reactive subscriptions, while the store also
 * exposes imperative APIs such as getState and setState for access outside React rendering.
 *
 * Store actions receive set and get from the store initializer. set produces state updates,
 * while get reads the current store state at the moment an action executes. This allows
 * actions to coordinate multiple state values without depending on component props or state.
 */

import { create } from "zustand";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterStore {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export interface ProfileStore {
  readonly name: string;
  readonly email: string;
  readonly updateProfile: (name: string, email: string) => void;
}

export interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly quantity: number;
}

export interface CartStore {
  readonly items: readonly CartItem[];
  readonly addItem: (item: CartItem) => void;
  readonly removeItem: (itemId: number) => void;
  readonly clearCart: () => void;
}

export interface ZustandStoreExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const useCounterStore = create<CounterStore>((set): CounterStore => ({
  count: 0,
  increment: (): void => {
    set((state): Pick<CounterStore, "count"> => ({
      count: state.count + 1,
    }));
  },
  decrement: (): void => {
    set((state): Pick<CounterStore, "count"> => ({
      count: state.count - 1,
    }));
  },
  reset: (): void => {
    set({
      count: 0,
    });
  },
}));

export const ZustandBasicStoreExample: FC<ZustandStoreExampleProps> = ({
  title,
}: ZustandStoreExampleProps): ReactElement => {
  const count: number = useCounterStore((state: CounterStore): number => state.count);
  const increment: () => void = useCounterStore((state: CounterStore): (() => void) => state.increment);
  const decrement: () => void = useCounterStore((state: CounterStore): (() => void) => state.decrement);

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
    </article>
  );
};

export const useProfileStore = create<ProfileStore>((set): ProfileStore => ({
  name: "John Doe",
  email: "john.doe@example.com",
  updateProfile: (name: string, email: string): void => {
    set({
      name,
      email,
    });
  },
}));

export const ZustandMultipleValuesExample: FC<ZustandStoreExampleProps> = ({
  title,
}: ZustandStoreExampleProps): ReactElement => {
  const name: string = useProfileStore((state: ProfileStore): string => state.name);
  const email: string = useProfileStore((state: ProfileStore): string => state.email);
  const updateProfile: (name: string, email: string) => void = useProfileStore(
    (state: ProfileStore): ((name: string, email: string) => void) => state.updateProfile,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <button
        type="button"
        onClick={() => {
          updateProfile("Jane Doe", "jane.doe@example.com");
        }}
      >
        Update profile
      </button>
    </article>
  );
};

export const useCartStore = create<CartStore>((set): CartStore => ({
  items: [],
  addItem: (item: CartItem): void => {
    set((state): Pick<CartStore, "items"> => ({
      items: [...state.items, item],
    }));
  },
  removeItem: (itemId: number): void => {
    set((state): Pick<CartStore, "items"> => ({
      items: state.items.filter((item: CartItem): boolean => item.id !== itemId),
    }));
  },
  clearCart: (): void => {
    set({
      items: [],
    });
  },
}));

export const ZustandStoreCollectionExample: FC<ZustandStoreExampleProps> = ({
  title,
}: ZustandStoreExampleProps): ReactElement => {
  const items: readonly CartItem[] = useCartStore((state: CartStore): readonly CartItem[] => state.items);
  const addItem: (item: CartItem) => void = useCartStore(
    (state: CartStore): ((item: CartItem) => void) => state.addItem,
  );
  const removeItem: (itemId: number) => void = useCartStore(
    (state: CartStore): ((itemId: number) => void) => state.removeItem,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Items: {items.length}</p>
      <button
        type="button"
        onClick={() => {
          addItem({
            id: 1,
            name: "Notebook",
            quantity: 1,
          });
        }}
      >
        Add item
      </button>
      <button
        type="button"
        onClick={() => {
          removeItem(1);
        }}
      >
        Remove item
      </button>
      <ul>
        {items.map((item: CartItem): ReactElement => (
          <li key={item.id}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
    </article>
  );
};

export const ZustandImperativeStoreExample: FC<ZustandStoreExampleProps> = ({
  title,
}: ZustandStoreExampleProps): ReactElement => {
  const count: number = useCounterStore((state: CounterStore): number => state.count);

  const readStoreDirectly = (): void => {
    const currentCount: number = useCounterStore.getState().count;
    console.log("Current count:", currentCount);
  };

  const resetStoreDirectly = (): void => {
    useCounterStore.getState().reset();
  };

  return (
    <article>
      <h3>{title}</h3>
      <p>Reactive count: {count}</p>
      <button type="button" onClick={readStoreDirectly}>
        Read store directly
      </button>
      <button type="button" onClick={resetStoreDirectly}>
        Reset store directly
      </button>
    </article>
  );
};

export const ZustandStoreUpdateExample: FC<ZustandStoreExampleProps> = ({
  title,
}: ZustandStoreExampleProps): ReactElement => {
  const count: number = useCounterStore((state: CounterStore): number => state.count);

  const incrementStoreDirectly = (): void => {
    useCounterStore.setState((state): Pick<CounterStore, "count"> => ({
      count: state.count + 1,
    }));
  };

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={incrementStoreDirectly}>
        Update store directly
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandStoreDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Creating a Basic Zustand Store</h2>
      <ZustandBasicStoreExample title="Counter Store" />

      <h2>2. Storing Multiple Values and Actions</h2>
      <ZustandMultipleValuesExample title="Profile Store" />

      <h2>3. Storing Collections in the Store</h2>
      <ZustandStoreCollectionExample title="Cart Store" />

      <h2>4. Reading Store State Imperatively</h2>
      <ZustandImperativeStoreExample title="Direct Store Access" />

      <h2>5. Updating Store State Imperatively</h2>
      <ZustandStoreUpdateExample title="Direct Store Update" />
    </section>
  );
};

export default ZustandStoreDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Zustand store combines state values and actions in one centralized store.
// The create function returns a hook that components can use to subscribe to store state.
// Store actions can use set to update state and can use get when they need current store values.
// Components can select individual state values or actions from the store.
// Zustand stores expose getState for imperative reads outside normal React rendering.
// Zustand stores also expose setState for imperative updates.
// A Zustand store does not require a React Context Provider for its basic usage.

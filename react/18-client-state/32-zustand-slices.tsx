/**
 * Zustand Slices
 * ==============
 *
 * Zustand slices are a pattern for dividing a larger store into smaller state-and-action
 * modules. Each slice describes one logical part of the store and can be composed with other
 * slices when creating the final Zustand store.
 *
 * A slice is typically a function that receives Zustand's set and get functions and returns
 * the state fields and actions belonging to that slice. The slices are combined into one store,
 * so components can subscribe to individual fields or actions without needing separate stores.
 *
 * Slices are an organizational pattern rather than a separate Zustand API. They are useful when
 * a store contains multiple independent domains, but they should remain focused on related state
 * and behavior rather than becoming arbitrary collections of unrelated fields.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { create } from "zustand";
import type { FC, ReactElement } from "react";

export interface UserSlice {
  readonly userName: string;
  readonly setUserName: (userName: string) => void;
}

export interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly quantity: number;
}

export interface CartSlice {
  readonly items: readonly CartItem[];
  readonly addItem: (item: CartItem) => void;
  readonly removeItem: (itemId: number) => void;
}

export interface AppStore extends UserSlice, CartSlice {}

export interface SliceExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const createUserSlice = (set: (updater: (state: AppStore) => Partial<AppStore>) => void): UserSlice => ({
  userName: "John Doe",
  setUserName: (userName: string): void => {
    set((): Partial<AppStore> => ({
      userName,
    }));
  },
});

const createCartSlice = (set: (updater: (state: AppStore) => Partial<AppStore>) => void): CartSlice => ({
  items: [],
  addItem: (item: CartItem): void => {
    set((state: AppStore): Partial<AppStore> => ({
      items: [...state.items, item],
    }));
  },
  removeItem: (itemId: number): void => {
    set((state: AppStore): Partial<AppStore> => ({
      items: state.items.filter((item: CartItem): boolean => item.id !== itemId),
    }));
  },
});

export const useAppStore = create<AppStore>((set, get): AppStore => ({
  ...createUserSlice(set),
  ...createCartSlice(set, get),
}));

export const UserSliceExample: FC<SliceExampleProps> = ({ title }: SliceExampleProps): ReactElement => {
  const userName: string = useAppStore((state: AppStore): string => state.userName);
  const setUserName: (userName: string) => void = useAppStore(
    (state: AppStore): ((userName: string) => void) => state.setUserName,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>User: {userName}</p>
      <button
        type="button"
        onClick={(): void => {
          setUserName("Jane Doe");
        }}
      >
        Change User
      </button>
    </article>
  );
};

export const CartSliceExample: FC<SliceExampleProps> = ({ title }: SliceExampleProps): ReactElement => {
  const items: readonly CartItem[] = useAppStore((state: AppStore): readonly CartItem[] => state.items);
  const addItem: (item: CartItem) => void = useAppStore((state: AppStore): ((item: CartItem) => void) => state.addItem);

  return (
    <article>
      <h3>{title}</h3>
      <p>Cart items: {items.length}</p>
      <button
        type="button"
        onClick={(): void => {
          addItem({
            id: 1,
            name: "Notebook",
            quantity: 1,
          });
        }}
      >
        Add Item
      </button>
    </article>
  );
};

export const SliceCompositionExample: FC<SliceExampleProps> = ({ title }: SliceExampleProps): ReactElement => {
  const userName: string = useAppStore((state: AppStore): string => state.userName);
  const itemCount: number = useAppStore((state: AppStore): number => state.items.length);

  return (
    <article>
      <h3>{title}</h3>
      <p>User slice: {userName}</p>
      <p>Cart slice items: {itemCount}</p>
      <p>Both slices are composed into one Zustand store.</p>
    </article>
  );
};

export const SliceIsolationExample: FC<SliceExampleProps> = ({ title }: SliceExampleProps): ReactElement => {
  const setUserName: (userName: string) => void = useAppStore(
    (state: AppStore): ((userName: string) => void) => state.setUserName,
  );

  return (
    <article>
      <h3>{title}</h3>
      <button
        type="button"
        onClick={(): void => {
          setUserName("Example User");
        }}
      >
        Update User Slice
      </button>
      <p>This action changes the user slice without directly modifying the cart slice.</p>
    </article>
  );
};

export const SliceCrossAccessExample: FC<SliceExampleProps> = ({ title }: SliceExampleProps): ReactElement => {
  const addItem: (item: CartItem) => void = useAppStore((state: AppStore): ((item: CartItem) => void) => state.addItem);

  const setUserName: (userName: string) => void = useAppStore(
    (state: AppStore): ((userName: string) => void) => state.setUserName,
  );

  return (
    <article>
      <h3>{title}</h3>
      <button
        type="button"
        onClick={(): void => {
          setUserName("Customer");
          addItem({
            id: 2,
            name: "Pen",
            quantity: 1,
          });
        }}
      >
        Update Both Slices
      </button>
      <p>Composed slices can participate in one store update when an application requires coordinated state changes.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandSlicesDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. A Slice Owns One Logical State Domain</h2>
      <UserSliceExample title="User Slice" />

      <h2>2. A Second Slice Owns Related Cart State</h2>
      <CartSliceExample title="Cart Slice" />

      <h2>3. Multiple Slices Compose Into One Store</h2>
      <SliceCompositionExample title="Slice Composition" />

      <h2>4. A Component Can Subscribe to One Slice</h2>
      <SliceIsolationExample title="Slice Isolation" />

      <h2>5. Composed Slices Can Participate in Shared Updates</h2>
      <SliceCrossAccessExample title="Cross-Slice Access" />
    </section>
  );
};

export default ZustandSlicesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Zustand slice is a logical module containing related state and actions.
// Slices are an organizational pattern rather than a separate Zustand store type.
// Multiple slices can be composed into one Zustand store.
// Components can subscribe to individual fields or actions from the composed store.
// A slice should normally represent a coherent state domain rather than an arbitrary collection of values.
// Composed slices can access the same store when coordinated updates are required.
// Slice composition helps keep larger Zustand stores divided into focused, maintainable modules.

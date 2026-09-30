/**
 * useState
 * ========
 *
 * `useState` adds a state value to a React function component. React stores
 * the value outside the component function and associates it with the Hook's
 * stable position in the component's Hook sequence. Calling the state setter
 * schedules a new render, after which the component receives the current
 * state value.
 *
 * The initializer can be either a value or a function. A function initializer
 * is evaluated by React when the state is initialized and is useful when
 * calculating the initial value is expensive. In development Strict Mode,
 * React may call initializer functions more than once to detect impure logic,
 * so initializers must be pure.
 *
 * A state setter accepts either a replacement value or an updater function.
 * The updater form receives the previous state and is required when the next
 * state depends on the previous state, especially when several updates are
 * queued during the same event.
 *
 * State updates replace the stored value rather than shallow-merging objects.
 * Updating an object or array therefore requires creating a new value that
 * contains the desired changes. Mutating the existing state object and then
 * passing the same reference back can prevent React from treating the update
 * as a meaningful state change.
 *
 * React compares the new state with the previous state using `Object.is`.
 * When the values are considered equal, React can skip the resulting render.
 */

import { type ChangeEvent, type FC, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicStateProps {
  readonly initialCount: number;
}

export interface LazyInitialStateProps {
  readonly initialValue: number;
}

export interface FunctionalUpdateProps {
  readonly initialCount: number;
}

export interface ObjectStateProps {
  readonly initialName: string;
}

export interface ArrayStateProps {
  readonly initialItems: readonly string[];
}

export interface EqualStateUpdateProps {
  readonly initialValue: string;
}

export interface ControlledInputStateProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic `useState` pattern. The setter replaces the current
 * state value and schedules React to render the component again.
 */
export const BasicStateExample: FC<BasicStateProps> = ({ initialCount }: BasicStateProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  const decrement = (): void => {
    setCount((previousCount: number): number => previousCount - 1);
  };

  return (
    <section>
      <h3>Basic state</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={decrement}>
        Decrement
      </button>
    </section>
  );
};

/**
 * Demonstrates a lazy initializer. Passing a function to `useState` lets
 * React initialize the state from the function's returned value instead of
 * evaluating an expensive calculation on every render.
 */
export const LazyInitialStateExample: FC<LazyInitialStateProps> = ({
  initialValue,
}: LazyInitialStateProps): ReactNode => {
  const [value, setValue] = useState<number>(() => initialValue * 2);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <h3>Lazy initial state</h3>
      <p>Value: {value}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates functional state updates. Each updater receives the most
 * recent pending state, allowing multiple updates to be composed correctly.
 */
export const FunctionalUpdateExample: FC<FunctionalUpdateProps> = ({
  initialCount,
}: FunctionalUpdateProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);

  const incrementThreeTimes = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
    setCount((previousCount: number): number => previousCount + 1);
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>Functional updates</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={incrementThreeTimes}>
        Increment three times
      </button>
    </section>
  );
};

/**
 * Demonstrates that object state is replaced rather than automatically
 * shallow-merged. The updater explicitly copies the existing properties and
 * replaces only the property that should change.
 */
export const ObjectStateExample: FC<ObjectStateProps> = ({ initialName }: ObjectStateProps): ReactNode => {
  const [profile, setProfile] = useState<{ name: string; age: number }>({
    name: initialName,
    age: 30,
  });

  const updateName = (): void => {
    setProfile(
      (previousProfile: {
        name: string;
        age: number;
      }): {
        name: string;
        age: number;
      } => ({
        ...previousProfile,
        name: "John Doe",
      }),
    );
  };

  const incrementAge = (): void => {
    setProfile(
      (previousProfile: {
        name: string;
        age: number;
      }): {
        name: string;
        age: number;
      } => ({
        ...previousProfile,
        age: previousProfile.age + 1,
      }),
    );
  };

  return (
    <section>
      <h3>Object state replacement</h3>
      <p>
        Name: {profile.name}, Age: {profile.age}
      </p>
      <button type="button" onClick={updateName}>
        Set example name
      </button>
      <button type="button" onClick={incrementAge}>
        Increment age
      </button>
    </section>
  );
};

/**
 * Demonstrates immutable array state updates. The setter receives a new array
 * instead of mutating the existing state array in place.
 */
export const ArrayStateExample: FC<ArrayStateProps> = ({ initialItems }: ArrayStateProps): ReactNode => {
  const [items, setItems] = useState<string[]>((): string[] => [...initialItems]);

  const addItem = (): void => {
    setItems((previousItems: string[]): string[] => [...previousItems, `Item ${previousItems.length + 1}`]);
  };

  const removeLastItem = (): void => {
    setItems((previousItems: string[]): string[] => {
      return previousItems.slice(0, -1);
    });
  };

  return (
    <section>
      <h3>Array state</h3>
      <p>{items.length > 0 ? items.join(", ") : "No items"}</p>
      <button type="button" onClick={addItem}>
        Add item
      </button>
      <button type="button" onClick={removeLastItem}>
        Remove last item
      </button>
    </section>
  );
};

/**
 * Demonstrates that setting state to the same primitive value does not
 * represent a changed state according to React's `Object.is` comparison.
 */
export const EqualStateUpdateExample: FC<EqualStateUpdateProps> = ({
  initialValue,
}: EqualStateUpdateProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);

  const setSameValue = (): void => {
    setValue(value);
  };

  const setDifferentValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "active" ? "inactive" : "active"));
  };

  return (
    <section>
      <h3>Equal state update</h3>
      <p>Value: {value}</p>
      <button type="button" onClick={setSameValue}>
        Set same value
      </button>
      <button type="button" onClick={setDifferentValue}>
        Toggle value
      </button>
    </section>
  );
};

/**
 * Demonstrates state-driven controlled input behavior. The input's displayed
 * value comes from React state, while its change event updates that state.
 */
export const ControlledInputStateExample: FC<ControlledInputStateProps> = ({
  initialValue,
}: ControlledInputStateProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Controlled input state</h3>
      <label>
        Name
        <input value={value} onChange={handleChange} />
      </label>
      <p>Current value: {value || "Empty"}</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception: mutating an object stored in state is
 * not the same as creating a new state value. The example displays the
 * incorrect pattern as text so the invalid mutation is never executed.
 */
export const StateMutationGotchaExample: FC = (): ReactNode => {
  const [profile, setProfile] = useState<{ name: string; age: number }>({
    name: "John Doe",
    age: 30,
  });

  // Incorrect Pattern: Avoid mutating state directly.
  profile.age += 1;
  setProfile(profile);

  return (
    <section>
      <h3>State mutation gotcha</h3>
      <pre>{incorrectPattern}</pre>
      <p>Create a new object instead so the state reference changes.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseStateContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useState</h1>

      <h2>1. Storing and updating basic state</h2>
      <BasicStateExample initialCount={0} />

      <h2>2. Lazily calculating initial state</h2>
      <LazyInitialStateExample initialValue={10} />

      <h2>3. Updating state from the previous value</h2>
      <FunctionalUpdateExample initialCount={0} />

      <h2>4. Replacing object state immutably</h2>
      <ObjectStateExample initialName="John Doe" />

      <h2>5. Updating array state immutably</h2>
      <ArrayStateExample initialItems={["Apple", "Banana"]} />

      <h2>6. Handling an update to the same value</h2>
      <EqualStateUpdateExample initialValue="active" />

      <h2>7. Using state with a controlled input</h2>
      <ControlledInputStateExample initialValue="John Doe" />

      <h2>8. Avoiding direct state mutation</h2>
      <StateMutationGotchaExample />
    </main>
  );
};

export default UseStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useState` stores a value across renders and returns its current value and setter.
// - A state setter schedules an update; the new state value replaces the old value.
// - Functional updates receive the latest pending state and are useful for dependent updates.
// - Lazy initializers defer initial-state calculation until state initialization.
// - Object and array state should be updated by creating new immutable values.
// - React compares state values with `Object.is` when determining whether they changed.
// - Setting state to an equal value does not represent a state change.
// - State can control form inputs by using the state value as the input's `value`.
// - Direct mutation of state does not provide React with a new state reference.

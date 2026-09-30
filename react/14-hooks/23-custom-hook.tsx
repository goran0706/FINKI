/**
 * Custom Hook
 * ===========
 *
 * A custom Hook is a reusable function whose name starts with `use` and that
 * calls one or more React Hooks. Custom Hooks encapsulate stateful behavior,
 * subscriptions, effects, memoization, or other Hook-based logic without
 * sharing the underlying state between component instances.
 *
 * A custom Hook executes as part of the calling component's render and follows
 * the same Rules of Hooks as built-in Hooks. Calling the same custom Hook from
 * two components creates two independent Hook state chains; the function is
 * shared, but its React-managed state is not.
 *
 * A custom Hook can accept parameters and return any values that the consuming
 * component needs. Its return type should describe the public API rather than
 * exposing implementation details unnecessarily.
 *
 * Custom Hooks are different from ordinary utility functions because they may
 * call React Hooks. A utility function can be called from arbitrary code, while
 * a custom Hook must follow Hook invocation rules.
 *
 * Custom Hooks should encapsulate one coherent piece of reusable behavior.
 * Combining unrelated responsibilities into one Hook makes its API harder to
 * understand and makes callers more dependent on implementation details.
 */

import { type ChangeEvent, type FC, type ReactNode, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UseCounterProps {
  readonly initialCount: number;
  readonly step: number;
}

export interface UseToggleProps {
  readonly initialValue: boolean;
}

export interface UseInputProps {
  readonly initialValue: string;
}

export interface UsePreviousProps {
  readonly initialValue: string;
}

export interface UseListProps {
  readonly initialItems: readonly string[];
}

export interface UseDerivedValueProps {
  readonly initialValue: number;
  readonly multiplier: number;
}

export interface UseResettableStateProps {
  readonly initialValue: string;
}

export interface UseHookCompositionProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

interface CounterHookResult {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

/**
 * Encapsulates counter state and operations in a reusable custom Hook.
 */
const useCounter = (initialCount: number, step: number): CounterHookResult => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + step);
  };

  const decrement = (): void => {
    setCount((previousCount: number): number => previousCount - step);
  };

  const reset = (): void => {
    setCount(initialCount);
  };

  return {
    count,
    increment,
    decrement,
    reset,
  };
};

/**
 * Demonstrates the mainstream custom-Hook pattern: reusable stateful counter
 * behavior is extracted into a named Hook and consumed by a component.
 */
export const CustomCounterExample: FC<UseCounterProps> = ({ initialCount, step }: UseCounterProps): ReactNode => {
  const { count, increment, decrement, reset }: CounterHookResult = useCounter(initialCount, step);

  return (
    <section>
      <h3>Encapsulating reusable counter behavior</h3>

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
    </section>
  );
};

interface ToggleHookResult {
  readonly value: boolean;
  readonly toggle: () => void;
  readonly setValue: (value: boolean) => void;
}

/**
 * Encapsulates boolean state and its state-changing operations in a custom
 * Hook.
 */
const useToggle = (initialValue: boolean): ToggleHookResult => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue((previousValue: boolean): boolean => !previousValue);
  };

  return {
    value,
    toggle,
    setValue,
  };
};

/**
 * Demonstrates a custom Hook with a boolean state API.
 */
export const CustomToggleExample: FC<UseToggleProps> = ({ initialValue }: UseToggleProps): ReactNode => {
  const { value, toggle }: ToggleHookResult = useToggle(initialValue);

  return (
    <section>
      <h3>Encapsulating boolean behavior</h3>

      <p>Status: {value ? "Enabled" : "Disabled"}</p>

      <button type="button" onClick={toggle}>
        Toggle
      </button>
    </section>
  );
};

interface InputHookResult {
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly clear: () => void;
}

/**
 * Encapsulates controlled-input state and its event handler.
 */
const useInput = (initialValue: string): InputHookResult => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const clear = (): void => {
    setValue("");
  };

  return {
    value,
    onChange,
    clear,
  };
};

/**
 * Demonstrates a custom Hook that returns values and event handlers for a
 * controlled input.
 */
export const CustomInputExample: FC<UseInputProps> = ({ initialValue }: UseInputProps): ReactNode => {
  const { value, onChange, clear }: InputHookResult = useInput(initialValue);

  return (
    <section>
      <h3>Encapsulating controlled-input behavior</h3>

      <label>
        Name
        <input value={value} onChange={onChange} />
      </label>

      <p>Value: {value || "(empty)"}</p>

      <button type="button" onClick={clear}>
        Clear
      </button>
    </section>
  );
};

interface PreviousHookResult {
  readonly current: string;
  readonly previous: string | undefined;
}

/**
 * Demonstrates a custom Hook that derives a previous value from React state.
 * The Hook uses a ref internally so changing the stored previous value does
 * not itself cause another render.
 */
const usePrevious = (value: string): string | undefined => {
  const [previous, setPrevious] = useState<string | undefined>(undefined);

  const currentPrevious: string | undefined = previous;

  if (previous !== value) {
    setPrevious(value);
  }

  return currentPrevious;
};

/**
 * Demonstrates consuming a custom Hook that exposes the previous rendered
 * value of a stateful value.
 */
export const CustomPreviousExample: FC<UsePreviousProps> = ({ initialValue }: UsePreviousProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const previous: string | undefined = usePrevious(value);

  const updateValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "example.com" ? "John Doe" : "example.com"));
  };

  return (
    <section>
      <h3>Encapsulating value-history behavior</h3>

      <p>Current: {value}</p>
      <p>Previous: {previous ?? "(none)"}</p>

      <button type="button" onClick={updateValue}>
        Change value
      </button>
    </section>
  );
};

interface ListHookResult {
  readonly items: readonly string[];
  readonly add: (item: string) => void;
  readonly remove: (index: number) => void;
}

/**
 * Encapsulates immutable list state updates. Functional updates ensure that
 * each operation is based on the latest state when multiple updates are
 * scheduled.
 */
const useList = (initialItems: readonly string[]): ListHookResult => {
  const [items, setItems] = useState<readonly string[]>(initialItems);

  const add = (item: string): void => {
    setItems((previousItems: readonly string[]): readonly string[] => [...previousItems, item]);
  };

  const remove = (index: number): void => {
    setItems((previousItems: readonly string[]): readonly string[] =>
      previousItems.filter((_item: string, itemIndex: number): boolean => itemIndex !== index),
    );
  };

  return {
    items,
    add,
    remove,
  };
};

/**
 * Demonstrates a custom Hook that manages reusable collection behavior.
 */
export const CustomListExample: FC<UseListProps> = ({ initialItems }: UseListProps): ReactNode => {
  const { items, add, remove }: ListHookResult = useList(initialItems);

  const addItem = (): void => {
    add("New item");
  };

  return (
    <section>
      <h3>Encapsulating list behavior</h3>

      <ul>
        {items.map((item: string, index: number): ReactNode => (
          <li key={`${item}-${index}`}>
            {item}

            <button type="button" onClick={(): void => remove(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={addItem}>
        Add item
      </button>
    </section>
  );
};

interface DerivedValueHookResult {
  readonly doubled: number;
  readonly multiplied: number;
}

/**
 * Encapsulates derived calculations. `useMemo` is used here to memoize the
 * derived object so its identity remains stable when its inputs are unchanged.
 */
const useDerivedValue = (value: number, multiplier: number): DerivedValueHookResult => {
  return useMemo<DerivedValueHookResult>(
    (): DerivedValueHookResult => ({
      doubled: value * 2,
      multiplied: value * multiplier,
    }),
    [multiplier, value],
  );
};

/**
 * Demonstrates that custom Hooks can combine ordinary calculations with React
 * Hooks and return a focused derived-data API.
 */
export const CustomDerivedValueExample: FC<UseDerivedValueProps> = ({
  initialValue,
  multiplier,
}: UseDerivedValueProps): ReactNode => {
  const [value, setValue] = useState<number>(initialValue);

  const { doubled, multiplied }: DerivedValueHookResult = useDerivedValue(value, multiplier);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <h3>Returning derived values from a custom Hook</h3>

      <p>Value: {value}</p>
      <p>Doubled: {doubled}</p>
      <p>Multiplied: {multiplied}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

interface ResettableStateHookResult {
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly reset: () => void;
}

/**
 * Encapsulates state together with an explicit reset operation. The initial
 * value is captured by the Hook invocation and reused when reset is requested.
 */
const useResettableState = (initialValue: string): ResettableStateHookResult => {
  const [value, setValue] = useState<string>(initialValue);

  const reset = (): void => {
    setValue(initialValue);
  };

  return {
    value,
    setValue,
    reset,
  };
};

/**
 * Demonstrates a custom Hook that exposes a small, purpose-specific state API.
 */
export const CustomResettableStateExample: FC<UseResettableStateProps> = ({
  initialValue,
}: UseResettableStateProps): ReactNode => {
  const { value, setValue, reset }: ResettableStateHookResult = useResettableState(initialValue);

  return (
    <section>
      <h3>Encapsulating resettable state</h3>

      <p>Value: {value}</p>

      <button type="button" onClick={(): void => setValue("Updated value")}>
        Update
      </button>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
};

interface ComposedHookResult {
  readonly count: number;
  readonly enabled: boolean;
  readonly increment: () => void;
  readonly toggle: () => void;
}

/**
 * Demonstrates custom-Hook composition. A custom Hook can call other custom
 * Hooks and expose a higher-level API without sharing their internal state
 * between component instances.
 */
const useCounterControls = (initialCount: number): ComposedHookResult => {
  const { count, increment }: CounterHookResult = useCounter(initialCount, 1);

  const { value: enabled, toggle }: ToggleHookResult = useToggle(false);

  return {
    count,
    enabled,
    increment,
    toggle,
  };
};

/**
 * Demonstrates composing multiple custom Hooks into one focused component API.
 */
export const CustomHookCompositionExample: FC<UseHookCompositionProps> = ({
  initialCount,
}: UseHookCompositionProps): ReactNode => {
  const { count, enabled, increment, toggle }: ComposedHookResult = useCounterControls(initialCount);

  return (
    <section>
      <h3>Composing custom Hooks</h3>

      <p>Count: {count}</p>
      <p>Enabled: {enabled ? "Yes" : "No"}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>

      <button type="button" onClick={toggle}>
        Toggle
      </button>
    </section>
  );
};

/**
 * Demonstrates the common misconception that custom Hooks share state merely
 * because the Hook function itself is shared. Each invocation creates its own
 * React-managed state.
 */
export const CustomHookIsolationExample: FC = (): ReactNode => {
  const firstCounter: CounterHookResult = useCounter(0, 1);
  const secondCounter: CounterHookResult = useCounter(10, 1);

  return (
    <section>
      <h3>Each custom-Hook invocation has independent state</h3>

      <p>First count: {firstCounter.count}</p>
      <p>Second count: {secondCounter.count}</p>

      <button type="button" onClick={firstCounter.increment}>
        Increment first
      </button>

      <button type="button" onClick={secondCounter.increment}>
        Increment second
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CustomHookContainer: FC = (): ReactNode => {
  const initialItems: readonly string[] = ["React", "TypeScript", "JavaScript"];

  return (
    <main>
      <h1>Custom Hook</h1>

      <h2>1. Encapsulating reusable counter behavior</h2>
      <CustomCounterExample initialCount={0} step={1} />

      <h2>2. Encapsulating boolean behavior</h2>
      <CustomToggleExample initialValue={false} />

      <h2>3. Encapsulating controlled-input behavior</h2>
      <CustomInputExample initialValue="" />

      <h2>4. Encapsulating value-history behavior</h2>
      <CustomPreviousExample initialValue="example.com" />

      <h2>5. Encapsulating list behavior</h2>
      <CustomListExample initialItems={initialItems} />

      <h2>6. Returning derived values from a custom Hook</h2>
      <CustomDerivedValueExample initialValue={2} multiplier={3} />

      <h2>7. Encapsulating resettable state</h2>
      <CustomResettableStateExample initialValue="Initial value" />

      <h2>8. Composing custom Hooks</h2>
      <CustomHookCompositionExample initialCount={0} />

      <h2>9. Keeping custom-Hook state independent</h2>
      <CustomHookIsolationExample />
    </main>
  );
};

export default CustomHookContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A custom Hook is a reusable function whose name starts with `use` and can call React Hooks.
// - Custom Hooks encapsulate reusable stateful behavior without sharing state between invocations.
// - Each invocation of a custom Hook receives its own React-managed state.
// - Custom Hooks can accept parameters and return a focused, explicitly typed API.
// - Custom Hooks must follow the Rules of Hooks just like built-in Hooks.
// - Custom Hooks can compose other custom Hooks to build higher-level behavior.
// - Custom Hooks are different from ordinary utility functions because they can use React Hooks.
// - Functional state updates are useful inside custom Hooks when new state depends on previous state.
// - A custom Hook should expose the behavior consumers need without unnecessarily exposing implementation details.

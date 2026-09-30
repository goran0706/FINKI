/**
 * Custom Hook State
 * =================
 *
 * A stateful custom Hook encapsulates React state inside a reusable function.
 * The custom Hook owns its own `useState` calls, while the consuming component
 * receives the state and operations exposed by the Hook.
 *
 * Each invocation of a stateful custom Hook creates an independent state chain
 * for the component that invoked it. Reusing the same Hook function does not
 * cause separate consumers to share state.
 *
 * A custom Hook can hide state-update mechanics behind domain-specific
 * operations such as increment, decrement, reset, add, remove, or update.
 * Functional state updates are important when the next state depends on the
 * previous state because React may batch multiple updates.
 *
 * State initialization can accept either a value or a lazy initializer
 * function. A lazy initializer is useful when calculating the initial state is
 * expensive because React can perform that initialization without repeating
 * the calculation on ordinary re-renders.
 *
 * A stateful custom Hook should expose a deliberate API. Returning only the
 * state and operations required by consumers reduces coupling to the Hook's
 * internal implementation.
 */

import { type FC, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CustomHookStateCounterProps {
  readonly initialCount: number;
  readonly step: number;
}

export interface CustomHookStateFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface CustomHookStateListProps {
  readonly initialItems: readonly string[];
}

export interface CustomHookStateBooleanProps {
  readonly initialValue: boolean;
}

export interface CustomHookStateLazyProps {
  readonly initialValue: number;
}

export interface CustomHookStateObjectProps {
  readonly initialName: string;
  readonly initialAge: number;
}

export interface CustomHookStateIndependentProps {
  readonly firstInitialCount: number;
  readonly secondInitialCount: number;
}

export interface CustomHookStateResetProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

interface CounterState {
  readonly count: number;
}

interface CounterActions {
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

interface CounterHookResult extends CounterState, CounterActions {}

/**
 * Encapsulates numeric state and exposes operations that derive the next count
 * from the previous count.
 */
const useCounterState = (initialCount: number, step: number): CounterHookResult => {
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
 * Demonstrates a stateful custom Hook that hides the implementation of a
 * counter while exposing a small domain-specific API.
 */
export const CustomHookStateCounterExample: FC<CustomHookStateCounterProps> = ({
  initialCount,
  step,
}: CustomHookStateCounterProps): ReactNode => {
  const { count, increment, decrement, reset }: CounterHookResult = useCounterState(initialCount, step);

  return (
    <section>
      <h3>Encapsulating counter state</h3>

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

interface FormState {
  readonly name: string;
  readonly email: string;
}

interface FormActions {
  readonly setName: (name: string) => void;
  readonly setEmail: (email: string) => void;
  readonly reset: () => void;
}

interface FormHookResult extends FormState, FormActions {}

/**
 * Encapsulates multiple related state fields in one custom Hook. The reset
 * operation restores both fields from the original initial values.
 */
const useFormState = (initialName: string, initialEmail: string): FormHookResult => {
  const [form, setForm] = useState<FormState>({
    name: initialName,
    email: initialEmail,
  });

  const setName = (name: string): void => {
    setForm((previousForm: FormState): FormState => ({
      ...previousForm,
      name,
    }));
  };

  const setEmail = (email: string): void => {
    setForm((previousForm: FormState): FormState => ({
      ...previousForm,
      email,
    }));
  };

  const reset = (): void => {
    setForm({
      name: initialName,
      email: initialEmail,
    });
  };

  return {
    ...form,
    setName,
    setEmail,
    reset,
  };
};

/**
 * Demonstrates managing related object state inside a custom Hook.
 */
export const CustomHookStateFormExample: FC<CustomHookStateFormProps> = ({
  initialName,
  initialEmail,
}: CustomHookStateFormProps): ReactNode => {
  const { name, email, setName, setEmail, reset }: FormHookResult = useFormState(initialName, initialEmail);

  return (
    <section>
      <h3>Encapsulating related object state</h3>

      <label>
        Name
        <input
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setName(event.target.value);
          }}
        />
      </label>

      <label>
        Email
        <input
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
          }}
        />
      </label>

      <p>Name: {name || "(empty)"}</p>
      <p>Email: {email || "(empty)"}</p>

      <button type="button" onClick={reset}>
        Reset form
      </button>
    </section>
  );
};

interface ListHookResult {
  readonly items: readonly string[];
  readonly add: (item: string) => void;
  readonly removeAt: (index: number) => void;
  readonly clear: () => void;
}

/**
 * Encapsulates immutable collection state. Each update creates a new array
 * rather than mutating the existing state object.
 */
const useListState = (initialItems: readonly string[]): ListHookResult => {
  const [items, setItems] = useState<readonly string[]>(initialItems);

  const add = (item: string): void => {
    setItems((previousItems: readonly string[]): readonly string[] => [...previousItems, item]);
  };

  const removeAt = (index: number): void => {
    setItems((previousItems: readonly string[]): readonly string[] =>
      previousItems.filter((_item: string, itemIndex: number): boolean => itemIndex !== index),
    );
  };

  const clear = (): void => {
    setItems([]);
  };

  return {
    items,
    add,
    removeAt,
    clear,
  };
};

/**
 * Demonstrates reusable collection state with functional updates and immutable
 * array operations.
 */
export const CustomHookStateListExample: FC<CustomHookStateListProps> = ({
  initialItems,
}: CustomHookStateListProps): ReactNode => {
  const { items, add, removeAt, clear }: ListHookResult = useListState(initialItems);

  const addItem = (): void => {
    add(`Item ${items.length + 1}`);
  };

  return (
    <section>
      <h3>Encapsulating collection state</h3>

      <ul>
        {items.map((item: string, index: number): ReactNode => (
          <li key={`${item}-${index}`}>
            {item}

            <button type="button" onClick={(): void => removeAt(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={addItem}>
        Add item
      </button>

      <button type="button" onClick={clear}>
        Clear
      </button>
    </section>
  );
};

interface BooleanHookResult {
  readonly value: boolean;
  readonly enable: () => void;
  readonly disable: () => void;
  readonly toggle: () => void;
}

/**
 * Encapsulates boolean state behind semantic operations instead of exposing
 * callers to the underlying state setter.
 */
const useBooleanState = (initialValue: boolean): BooleanHookResult => {
  const [value, setValue] = useState<boolean>(initialValue);

  const enable = (): void => {
    setValue(true);
  };

  const disable = (): void => {
    setValue(false);
  };

  const toggle = (): void => {
    setValue((previousValue: boolean): boolean => !previousValue);
  };

  return {
    value,
    enable,
    disable,
    toggle,
  };
};

/**
 * Demonstrates exposing semantic state operations from a custom Hook.
 */
export const CustomHookStateBooleanExample: FC<CustomHookStateBooleanProps> = ({
  initialValue,
}: CustomHookStateBooleanProps): ReactNode => {
  const { value, enable, disable, toggle }: BooleanHookResult = useBooleanState(initialValue);

  return (
    <section>
      <h3>Encapsulating boolean state operations</h3>

      <p>Status: {value ? "Enabled" : "Disabled"}</p>

      <button type="button" onClick={enable}>
        Enable
      </button>

      <button type="button" onClick={disable}>
        Disable
      </button>

      <button type="button" onClick={toggle}>
        Toggle
      </button>
    </section>
  );
};

/**
 * Uses a lazy state initializer so the initial value calculation is represented
 * by a function passed to `useState`. The initializer does not run again for
 * ordinary re-renders.
 */
const useLazyNumberState = (
  initialValue: number,
): {
  readonly value: number;
  readonly increment: () => void;
} => {
  const [value, setValue] = useState<number>((): number => initialValue * initialValue);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return {
    value,
    increment,
  };
};

/**
 * Demonstrates lazy initialization inside a stateful custom Hook.
 */
export const CustomHookStateLazyExample: FC<CustomHookStateLazyProps> = ({
  initialValue,
}: CustomHookStateLazyProps): ReactNode => {
  const {
    value,
    increment,
  }: {
    readonly value: number;
    readonly increment: () => void;
  } = useLazyNumberState(initialValue);

  return (
    <section>
      <h3>Using lazy state initialization</h3>

      <p>Initialized value: {value}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

interface UserState {
  readonly name: string;
  readonly age: number;
}

interface UserStateHookResult {
  readonly user: UserState;
  readonly updateName: (name: string) => void;
  readonly incrementAge: () => void;
}

/**
 * Demonstrates updating one field of object state without discarding the
 * remaining fields. The previous object is copied before the changed field is
 * replaced.
 */
const useUserState = (initialName: string, initialAge: number): UserStateHookResult => {
  const [user, setUser] = useState<UserState>({
    name: initialName,
    age: initialAge,
  });

  const updateName = (name: string): void => {
    setUser((previousUser: UserState): UserState => ({
      ...previousUser,
      name,
    }));
  };

  const incrementAge = (): void => {
    setUser((previousUser: UserState): UserState => ({
      ...previousUser,
      age: previousUser.age + 1,
    }));
  };

  return {
    user,
    updateName,
    incrementAge,
  };
};

/**
 * Demonstrates preserving unrelated fields when updating object state inside a
 * custom Hook.
 */
export const CustomHookStateObjectExample: FC<CustomHookStateObjectProps> = ({
  initialName,
  initialAge,
}: CustomHookStateObjectProps): ReactNode => {
  const { user, updateName, incrementAge }: UserStateHookResult = useUserState(initialName, initialAge);

  return (
    <section>
      <h3>Updating object state immutably</h3>

      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>

      <button type="button" onClick={(): void => updateName("John Doe")}>
        Set example name
      </button>

      <button type="button" onClick={incrementAge}>
        Increase age
      </button>
    </section>
  );
};

/**
 * Demonstrates that every invocation of a stateful custom Hook creates
 * independent React state. The two counters use the same Hook implementation
 * but their values are stored separately.
 */
export const CustomHookStateIndependentExample: FC<CustomHookStateIndependentProps> = ({
  firstInitialCount,
  secondInitialCount,
}: CustomHookStateIndependentProps): ReactNode => {
  const firstCounter: CounterHookResult = useCounterState(firstInitialCount, 1);

  const secondCounter: CounterHookResult = useCounterState(secondInitialCount, 1);

  return (
    <section>
      <h3>Keeping Hook instances independent</h3>

      <p>First counter: {firstCounter.count}</p>
      <p>Second counter: {secondCounter.count}</p>

      <button type="button" onClick={firstCounter.increment}>
        Increment first
      </button>

      <button type="button" onClick={secondCounter.increment}>
        Increment second
      </button>
    </section>
  );
};

interface ResettableHookResult {
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly reset: () => void;
}

/**
 * Encapsulates state with a reset operation. The reset function restores the
 * initial value captured by this particular Hook invocation.
 */
const useResettableState = (initialValue: string): ResettableHookResult => {
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
 * Demonstrates a custom Hook that exposes both direct state updates and a
 * reusable reset operation.
 */
export const CustomHookStateResetExample: FC<CustomHookStateResetProps> = ({
  initialValue,
}: CustomHookStateResetProps): ReactNode => {
  const { value, setValue, reset }: ResettableHookResult = useResettableState(initialValue);

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

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CustomHookStateContainer: FC = (): ReactNode => {
  const initialItems: readonly string[] = ["React", "TypeScript", "JavaScript"];

  return (
    <main>
      <h1>Custom Hook State</h1>

      <h2>1. Encapsulating counter state</h2>
      <CustomHookStateCounterExample initialCount={0} step={1} />

      <h2>2. Encapsulating related object state</h2>
      <CustomHookStateFormExample initialName="John Doe" initialEmail="john@example.com" />

      <h2>3. Encapsulating collection state</h2>
      <CustomHookStateListExample initialItems={initialItems} />

      <h2>4. Encapsulating boolean state operations</h2>
      <CustomHookStateBooleanExample initialValue={false} />

      <h2>5. Using lazy state initialization</h2>
      <CustomHookStateLazyExample initialValue={4} />

      <h2>6. Updating object state immutably</h2>
      <CustomHookStateObjectExample initialName="John Doe" initialAge={30} />

      <h2>7. Keeping Hook instances independent</h2>
      <CustomHookStateIndependentExample firstInitialCount={0} secondInitialCount={10} />

      <h2>8. Encapsulating resettable state</h2>
      <CustomHookStateResetExample initialValue="Initial value" />
    </main>
  );
};

export default CustomHookStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A stateful custom Hook encapsulates React-managed state behind a reusable API.
// - Each invocation of a stateful custom Hook owns an independent state instance.
// - Functional state updates are appropriate when the next state depends on previous state.
// - Object state should be updated immutably so unchanged fields are preserved.
// - Collection state should be updated with new arrays rather than mutating existing arrays.
// - Lazy `useState` initialization can defer an expensive initial calculation until state initialization.
// - Domain-specific operations can hide raw state-update mechanics from consumers.
// - A custom Hook can expose reset operations that restore its captured initial value.
// - Stateful custom Hooks should expose only the state and operations required by their consumers.

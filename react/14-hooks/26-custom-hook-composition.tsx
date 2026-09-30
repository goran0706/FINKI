/**
 * Custom Hook Composition
 * =======================
 *
 * Custom Hook composition means building a custom Hook by calling other custom
 * Hooks. Each Hook can encapsulate one focused behavior, while the composed
 * Hook coordinates those behaviors into a higher-level API for a component.
 *
 * Custom Hooks do not share their internal state merely because they call the
 * same underlying Hook. Every invocation creates its own React Hook state for
 * the component invocation. Composition therefore combines behavior, not state
 * ownership.
 *
 * Hook composition follows the Rules of Hooks. A composed Hook must call its
 * constituent Hooks at the top level of the custom Hook and must not call them
 * conditionally, inside loops, or inside nested callbacks.
 *
 * A composed Hook should expose a stable and focused API. Internal Hooks can
 * remain implementation details, allowing the composed Hook to coordinate
 * state, derived values, event handlers, and effects without exposing every
 * implementation detail to its consumer.
 *
 * Composition is different from combining unrelated logic into one Hook.
 * Focused Hooks should represent coherent behaviors, while the composed Hook
 * should provide the higher-level behavior that actually belongs together.
 */

import { type ChangeEvent, type FC, type ReactNode, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CustomHookCompositionCounterProps {
  readonly initialCount: number;
}

export interface CustomHookCompositionFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface CustomHookCompositionSearchProps {
  readonly initialQuery: string;
}

export interface CustomHookCompositionStatusProps {
  readonly initialEnabled: boolean;
}

export interface CustomHookCompositionCartProps {
  readonly initialItems: readonly string[];
}

export interface CustomHookCompositionValidationProps {
  readonly initialValue: string;
}

export interface CustomHookCompositionDashboardProps {
  readonly initialCount: number;
  readonly initialEnabled: boolean;
}

export interface CustomHookCompositionIndependentProps {
  readonly firstInitialCount: number;
  readonly secondInitialCount: number;
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
 * Encapsulates only counter state and its state transitions.
 */
const useCounter = (initialCount: number): CounterHookResult => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  const decrement = (): void => {
    setCount((previousCount: number): number => previousCount - 1);
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
 * Encapsulates only boolean state and its state transitions.
 */
const useBoolean = (
  initialValue: boolean,
): {
  readonly value: boolean;
  readonly toggle: () => void;
} => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue((previousValue: boolean): boolean => !previousValue);
  };

  return {
    value,
    toggle,
  };
};

/**
 * Demonstrates composing two focused Hooks into one component behavior.
 */
export const CustomHookCompositionBasicExample: FC<CustomHookCompositionDashboardProps> = ({
  initialCount,
  initialEnabled,
}: CustomHookCompositionDashboardProps): ReactNode => {
  const counter: CounterHookResult = useCounter(initialCount);

  const booleanState: {
    readonly value: boolean;
    readonly toggle: () => void;
  } = useBoolean(initialEnabled);

  return (
    <section>
      <h3>Composing focused state Hooks</h3>

      <p>Count: {counter.count}</p>
      <p>Enabled: {booleanState.value ? "Yes" : "No"}</p>

      <button type="button" onClick={counter.increment}>
        Increment
      </button>

      <button type="button" onClick={booleanState.toggle}>
        Toggle
      </button>
    </section>
  );
};

interface FormHookResult {
  readonly name: string;
  readonly email: string;
  readonly setName: (name: string) => void;
  readonly setEmail: (email: string) => void;
}

/**
 * Encapsulates controlled form state without knowing how the form will be
 * presented by its consumer.
 */
const useForm = (initialName: string, initialEmail: string): FormHookResult => {
  const [name, setName] = useState<string>(initialName);

  const [email, setEmail] = useState<string>(initialEmail);

  return {
    name,
    email,
    setName,
    setEmail,
  };
};

interface FormValidationResult {
  readonly nameValid: boolean;
  readonly emailValid: boolean;
  readonly valid: boolean;
}

/**
 * Encapsulates validation derived from form values.
 */
const useFormValidation = (name: string, email: string): FormValidationResult => {
  return useMemo<FormValidationResult>((): FormValidationResult => {
    const nameValid: boolean = name.trim().length > 0;

    const emailValid: boolean = email.includes("@") && email.trim().length > 3;

    return {
      nameValid,
      emailValid,
      valid: nameValid && emailValid,
    };
  }, [email, name]);
};

/**
 * Composes form state and validation into one higher-level form behavior.
 */
const useValidatedForm = (initialName: string, initialEmail: string): FormHookResult & FormValidationResult => {
  const form: FormHookResult = useForm(initialName, initialEmail);

  const validation: FormValidationResult = useFormValidation(form.name, form.email);

  return {
    ...form,
    ...validation,
  };
};

/**
 * Demonstrates composing state and derived validation Hooks behind one
 * higher-level Hook.
 */
export const CustomHookCompositionFormExample: FC<CustomHookCompositionFormProps> = ({
  initialName,
  initialEmail,
}: CustomHookCompositionFormProps): ReactNode => {
  const form: FormHookResult & FormValidationResult = useValidatedForm(initialName, initialEmail);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    form.setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    form.setEmail(event.target.value);
  };

  return (
    <section>
      <h3>Composing form state and validation</h3>

      <label>
        Name
        <input value={form.name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input value={form.email} onChange={handleEmailChange} />
      </label>

      <p>Name: {form.nameValid ? "Valid" : "Required"}</p>

      <p>Email: {form.emailValid ? "Valid" : "Invalid"}</p>

      <p>Form: {form.valid ? "Valid" : "Incomplete"}</p>
    </section>
  );
};

interface SearchStateResult {
  readonly query: string;
  readonly setQuery: (query: string) => void;
}

/**
 * Encapsulates query state independently from any search-specific derivation.
 */
const useSearchQuery = (initialQuery: string): SearchStateResult => {
  const [query, setQuery] = useState<string>(initialQuery);

  return {
    query,
    setQuery,
  };
};

interface SearchFilterResult {
  readonly normalizedQuery: string;
  readonly hasQuery: boolean;
}

/**
 * Encapsulates pure query normalization and derived state.
 */
const useSearchFilter = (query: string): SearchFilterResult => {
  return useMemo<SearchFilterResult>((): SearchFilterResult => {
    const normalizedQuery: string = query.trim().toLowerCase();

    return {
      normalizedQuery,
      hasQuery: normalizedQuery.length > 0,
    };
  }, [query]);
};

/**
 * Composes query state with query normalization to expose a focused search
 * input API.
 */
const useSearch = (initialQuery: string): SearchStateResult & SearchFilterResult => {
  const searchQuery: SearchStateResult = useSearchQuery(initialQuery);

  const filter: SearchFilterResult = useSearchFilter(searchQuery.query);

  return {
    ...searchQuery,
    ...filter,
  };
};

/**
 * Demonstrates composing independent query and derived-value Hooks.
 */
export const CustomHookCompositionSearchExample: FC<CustomHookCompositionSearchProps> = ({
  initialQuery,
}: CustomHookCompositionSearchProps): ReactNode => {
  const search: SearchStateResult & SearchFilterResult = useSearch(initialQuery);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    search.setQuery(event.target.value);
  };

  return (
    <section>
      <h3>Composing query state and derived data</h3>

      <label>
        Search
        <input value={search.query} onChange={handleChange} />
      </label>

      <p>Normalized query: {search.normalizedQuery || "(empty)"}</p>

      <p>Query active: {search.hasQuery ? "Yes" : "No"}</p>
    </section>
  );
};

interface StatusEffectResult {
  readonly status: string;
}

/**
 * Encapsulates synchronization with an external effect. The effect records a
 * status message whenever its input changes.
 */
const useStatusEffect = (enabled: boolean): StatusEffectResult => {
  const [status, setStatus] = useState<string>("Not synchronized");

  useEffect((): void => {
    setStatus(enabled ? "External system synchronized." : "External system disabled.");
  }, [enabled]);

  return {
    status,
  };
};

/**
 * Composes boolean state with an effect that reacts to that state.
 */
const useManagedStatus = (
  initialEnabled: boolean,
): {
  readonly enabled: boolean;
  readonly toggle: () => void;
  readonly status: string;
} => {
  const booleanState: {
    readonly value: boolean;
    readonly toggle: () => void;
  } = useBoolean(initialEnabled);

  const status: StatusEffectResult = useStatusEffect(booleanState.value);

  return {
    enabled: booleanState.value,
    toggle: booleanState.toggle,
    status: status.status,
  };
};

/**
 * Demonstrates composing state and effect behavior while keeping each
 * individual Hook focused on one responsibility.
 */
export const CustomHookCompositionStatusExample: FC<CustomHookCompositionStatusProps> = ({
  initialEnabled,
}: CustomHookCompositionStatusProps): ReactNode => {
  const managedStatus: {
    readonly enabled: boolean;
    readonly toggle: () => void;
    readonly status: string;
  } = useManagedStatus(initialEnabled);

  return (
    <section>
      <h3>Composing state with an effect</h3>

      <p>Enabled: {managedStatus.enabled ? "Yes" : "No"}</p>

      <p>Status: {managedStatus.status}</p>

      <button type="button" onClick={managedStatus.toggle}>
        Toggle
      </button>
    </section>
  );
};

interface CartResult {
  readonly items: readonly string[];
  readonly addItem: (item: string) => void;
  readonly removeItem: (item: string) => void;
}

interface CartCountResult {
  readonly count: number;
}

/**
 * Encapsulates collection state for a simple cart-like behavior.
 */
const useCart = (initialItems: readonly string[]): CartResult => {
  const [items, setItems] = useState<readonly string[]>(initialItems);

  const addItem = (item: string): void => {
    setItems((previousItems: readonly string[]): readonly string[] => [...previousItems, item]);
  };

  const removeItem = (item: string): void => {
    setItems((previousItems: readonly string[]): readonly string[] =>
      previousItems.filter((currentItem: string): boolean => currentItem !== item),
    );
  };

  return {
    items,
    addItem,
    removeItem,
  };
};

/**
 * Encapsulates a derived item count independently from the collection state.
 */
const useItemCount = (items: readonly string[]): CartCountResult => {
  const count: number = useMemo<number>((): number => items.length, [items]);

  return {
    count,
  };
};

/**
 * Composes collection state and derived collection information.
 */
const useCartSummary = (initialItems: readonly string[]): CartResult & CartCountResult => {
  const cart: CartResult = useCart(initialItems);

  const count: CartCountResult = useItemCount(cart.items);

  return {
    ...cart,
    ...count,
  };
};

/**
 * Demonstrates composing collection state with derived collection information.
 */
export const CustomHookCompositionCartExample: FC<CustomHookCompositionCartProps> = ({
  initialItems,
}: CustomHookCompositionProps): ReactNode => {
  const cart: CartResult & CartCountResult = useCartSummary(initialItems);

  const addExampleItem = (): void => {
    cart.addItem("New item");
  };

  return (
    <section>
      <h3>Composing collection state and derived data</h3>

      <p>Item count: {cart.count}</p>

      <ul>
        {cart.items.map((item: string, index: number): ReactNode => (
          <li key={`${item}-${index}`}>
            {item}

            <button type="button" onClick={(): void => cart.removeItem(item)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={addExampleItem}>
        Add item
      </button>
    </section>
  );
};

interface ValidationResult {
  readonly valid: boolean;
  readonly message: string;
}

/**
 * Encapsulates validation of a single value.
 */
const useValidation = (value: string): ValidationResult => {
  return useMemo<ValidationResult>((): ValidationResult => {
    const trimmedValue: string = value.trim();

    if (trimmedValue.length === 0) {
      return {
        valid: false,
        message: "A value is required.",
      };
    }

    if (trimmedValue.length < 3) {
      return {
        valid: false,
        message: "Use at least three characters.",
      };
    }

    return {
      valid: true,
      message: "Value is valid.",
    };
  }, [value]);
};

/**
 * Demonstrates composing a state Hook with a validation Hook without exposing
 * the individual implementation details to the component.
 */
const useValidatedValue = (
  initialValue: string,
): {
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly validation: ValidationResult;
} => {
  const [value, setValue] = useState<string>(initialValue);

  const validation: ValidationResult = useValidation(value);

  return {
    value,
    setValue,
    validation,
  };
};

/**
 * Demonstrates a composed Hook that coordinates mutable state with derived
 * validation state.
 */
export const CustomHookCompositionValidationExample: FC<CustomHookCompositionValidationProps> = ({
  initialValue,
}: CustomHookCompositionValidationProps): ReactNode => {
  const validatedValue: {
    readonly value: string;
    readonly setValue: (value: string) => void;
    readonly validation: ValidationResult;
  } = useValidatedValue(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    validatedValue.setValue(event.target.value);
  };

  return (
    <section>
      <h3>Composing state with validation</h3>

      <label>
        Value
        <input value={validatedValue.value} onChange={handleChange} />
      </label>

      <p>{validatedValue.validation.message}</p>
    </section>
  );
};

interface DashboardHookResult {
  readonly count: number;
  readonly enabled: boolean;
  readonly status: string;
  readonly increment: () => void;
  readonly toggle: () => void;
}

/**
 * Composes multiple focused Hooks into a single higher-level domain API. The
 * component does not need to know which underlying Hooks provide each value.
 */
const useDashboardState = (initialCount: number, initialEnabled: boolean): DashboardHookResult => {
  const counter: CounterHookResult = useCounter(initialCount);

  const managedStatus: {
    readonly enabled: boolean;
    readonly toggle: () => void;
    readonly status: string;
  } = useManagedStatus(initialEnabled);

  return {
    count: counter.count,
    enabled: managedStatus.enabled,
    status: managedStatus.status,
    increment: counter.increment,
    toggle: managedStatus.toggle,
  };
};

/**
 * Demonstrates a higher-level composed Hook that hides several lower-level
 * behaviors behind one domain-specific API.
 */
export const CustomHookCompositionDashboardExample: FC<CustomHookCompositionDashboardProps> = ({
  initialCount,
  initialEnabled,
}: CustomHookCompositionDashboardProps): ReactNode => {
  const dashboard: DashboardHookResult = useDashboardState(initialCount, initialEnabled);

  return (
    <section>
      <h3>Creating a higher-level composed Hook</h3>

      <p>Count: {dashboard.count}</p>
      <p>Enabled: {dashboard.enabled ? "Yes" : "No"}</p>
      <p>Status: {dashboard.status}</p>

      <button type="button" onClick={dashboard.increment}>
        Increment
      </button>

      <button type="button" onClick={dashboard.toggle}>
        Toggle
      </button>
    </section>
  );
};

/**
 * Demonstrates that composition does not merge state between separate
 * invocations. Each invocation of the composed Hook owns its own underlying
 * Hook state.
 */
export const CustomHookCompositionIndependentExample: FC<CustomHookCompositionIndependentProps> = ({
  firstInitialCount,
  secondInitialCount,
}: CustomHookCompositionIndependentProps): ReactNode => {
  const firstDashboard: DashboardHookResult = useDashboardState(firstInitialCount, false);

  const secondDashboard: DashboardHookResult = useDashboardState(secondInitialCount, true);

  return (
    <section>
      <h3>Keeping composed Hook instances independent</h3>

      <p>First count: {firstDashboard.count}</p>

      <p>Second count: {secondDashboard.count}</p>

      <button type="button" onClick={firstDashboard.increment}>
        Increment first
      </button>

      <button type="button" onClick={secondDashboard.increment}>
        Increment second
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CustomHookCompositionContainer: FC = (): ReactNode => {
  const initialItems: readonly string[] = ["React", "TypeScript", "JavaScript"];

  return (
    <main>
      <h1>Custom Hook Composition</h1>

      <h2>1. Composing focused state Hooks</h2>
      <CustomHookCompositionBasicExample initialCount={0} initialEnabled={false} />

      <h2>2. Composing form state and validation</h2>
      <CustomHookCompositionFormExample initialName="John Doe" initialEmail="john@example.com" />

      <h2>3. Composing query state and derived data</h2>
      <CustomHookCompositionSearchExample initialQuery="" />

      <h2>4. Composing state with an effect</h2>
      <CustomHookCompositionStatusExample initialEnabled={true} />

      <h2>5. Composing collection state and derived data</h2>
      <CustomHookCompositionCartExample initialItems={initialItems} />

      <h2>6. Composing state with validation</h2>
      <CustomHookCompositionValidationExample initialValue="" />

      <h2>7. Creating a higher-level composed Hook</h2>
      <CustomHookCompositionDashboardExample initialCount={0} initialEnabled={false} />

      <h2>8. Keeping composed Hook instances independent</h2>
      <CustomHookCompositionIndependentExample firstInitialCount={0} secondInitialCount={10} />
    </main>
  );
};

export default CustomHookCompositionContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom Hook composition builds higher-level behavior from focused custom Hooks.
// - A composed Hook can coordinate state, derived values, validation, subscriptions, and effects.
// - Every constituent Hook must still follow the Rules of Hooks.
// - Composing Hooks combines behavior but does not merge their state ownership.
// - Each invocation of a composed Hook receives its own underlying Hook state.
// - A composed Hook should expose a focused API rather than leaking every implementation detail.
// - Functional state updates remain important inside composed state Hooks when updates depend on previous state.
// - Derived behavior can be isolated in separate Hooks and combined by a higher-level Hook.
// - Composition is most useful when each lower-level Hook has one coherent responsibility.

/**
 * Custom Hook API
 * ===============
 *
 * A custom Hook API is the public contract returned by a custom Hook. The API
 * determines which state, derived values, and operations are exposed to the
 * component using the Hook while keeping implementation details private.
 *
 * An object return value is useful when a Hook exposes several named values or
 * operations because consumers can destructure properties by name and the API
 * remains self-documenting. A tuple can be useful for small positional APIs,
 * but its meaning depends on the order of returned values.
 *
 * Functions returned by a custom Hook can be recreated on every render. When a
 * consumer needs referential stability, `useCallback` can memoize those
 * functions according to their dependencies. An object containing the API can
 * likewise be memoized with `useMemo` when its reference is passed to a
 * memoized child or used as a dependency.
 *
 * Memoization is not required merely because a Hook returns an object or
 * function. It is useful when reference identity has observable consequences,
 * such as dependency comparison or memoized child rendering.
 *
 * A good Hook API exposes domain operations rather than its internal state
 * machinery. For example, `increment` communicates intent more clearly than
 * exposing a raw `setCount` when callers should only perform a specific state
 * transition.
 *
 * The API should also define edge-case behavior explicitly. Reset operations
 * should have a clear initial value, collection operations should preserve
 * immutability, and callers should not depend on implementation details that
 * are not part of the returned contract.
 */

import { type ChangeEvent, type FC, type ReactNode, useCallback, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CustomHookApiObjectProps {
  readonly initialCount: number;
}

export interface CustomHookApiTupleProps {
  readonly initialValue: string;
}

export interface CustomHookApiDomainProps {
  readonly initialValue: string;
}

export interface CustomHookApiStableProps {
  readonly initialCount: number;
}

export interface CustomHookApiDerivedProps {
  readonly initialFirstName: string;
  readonly initialLastName: string;
}

export interface CustomHookApiCollectionProps {
  readonly initialItems: readonly string[];
}

export interface CustomHookApiEdgeCaseProps {
  readonly initialCount: number;
}

export interface CustomHookApiEncapsulationProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

interface CounterHookApi {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

/**
 * Exposes a named object API for a counter. Named properties describe the
 * behavior available to consumers without exposing the internal state setter.
 */
const useCounterObjectApi = (initialCount: number): CounterHookApi => {
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
 * Demonstrates a named object API for a custom Hook.
 */
export const CustomHookApiObjectExample: FC<CustomHookApiObjectProps> = ({
  initialCount,
}: CustomHookApiObjectProps): ReactNode => {
  const counter: CounterHookApi = useCounterObjectApi(initialCount);

  return (
    <section>
      <h3>Returning a named object API</h3>

      <p>Count: {counter.count}</p>

      <button type="button" onClick={counter.increment}>
        Increment
      </button>

      <button type="button" onClick={counter.decrement}>
        Decrement
      </button>

      <button type="button" onClick={counter.reset}>
        Reset
      </button>
    </section>
  );
};

type ValueHookApi = readonly [value: string, setValue: (value: string) => void, reset: () => void];

/**
 * Exposes a small positional tuple API. The order of the tuple is part of its
 * contract and is therefore explicitly typed.
 */
const useValueTupleApi = (initialValue: string): ValueHookApi => {
  const [value, setValue] = useState<string>(initialValue);

  const reset = (): void => {
    setValue(initialValue);
  };

  return [value, setValue, reset];
};

/**
 * Demonstrates a tuple API for a small custom Hook contract.
 */
export const CustomHookApiTupleExample: FC<CustomHookApiTupleProps> = ({
  initialValue,
}: CustomHookApiTupleProps): ReactNode => {
  const [value, setValue, reset]: ValueHookApi = useValueTupleApi(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Returning a tuple API</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
};

interface DomainValueHookApi {
  readonly value: string;
  readonly isEmpty: boolean;
  readonly setValue: (value: string) => void;
  readonly clear: () => void;
}

/**
 * Exposes domain-specific operations rather than exposing implementation
 * details such as the internal React state setter.
 */
const useDomainValueApi = (initialValue: string): DomainValueHookApi => {
  const [value, setValue] = useState<string>(initialValue);

  const clear = (): void => {
    setValue("");
  };

  const isEmpty: boolean = value.trim().length === 0;

  return {
    value,
    isEmpty,
    setValue,
    clear,
  };
};

/**
 * Demonstrates a domain-oriented Hook API.
 */
export const CustomHookApiDomainExample: FC<CustomHookApiDomainProps> = ({
  initialValue,
}: CustomHookApiDomainProps): ReactNode => {
  const valueApi: DomainValueHookApi = useDomainValueApi(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    valueApi.setValue(event.target.value);
  };

  return (
    <section>
      <h3>Exposing domain-specific operations</h3>

      <label>
        Value
        <input value={valueApi.value} onChange={handleChange} />
      </label>

      <p>Empty: {valueApi.isEmpty ? "Yes" : "No"}</p>

      <button type="button" onClick={valueApi.clear}>
        Clear
      </button>
    </section>
  );
};

interface StableCounterApi {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
}

/**
 * Memoizes action functions so their references remain stable. Functional state
 * updates allow the callbacks to avoid depending on the current count.
 */
const useStableCounterApi = (initialCount: number): StableCounterApi => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = useCallback((): void => {
    setCount((previousCount: number): number => previousCount + 1);
  }, []);

  const decrement = useCallback((): void => {
    setCount((previousCount: number): number => previousCount - 1);
  }, []);

  return useMemo<StableCounterApi>(
    (): StableCounterApi => ({
      count,
      increment,
      decrement,
    }),
    [count, increment, decrement],
  );
};

/**
 * Demonstrates stable action references in a custom Hook API.
 */
export const CustomHookApiStableExample: FC<CustomHookApiStableProps> = ({
  initialCount,
}: CustomHookApiStableProps): ReactNode => {
  const counter: StableCounterApi = useStableCounterApi(initialCount);

  return (
    <section>
      <h3>Providing stable action references</h3>

      <p>Count: {counter.count}</p>

      <button type="button" onClick={counter.increment}>
        Increment
      </button>

      <button type="button" onClick={counter.decrement}>
        Decrement
      </button>
    </section>
  );
};

interface PersonNameApi {
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly setFirstName: (value: string) => void;
  readonly setLastName: (value: string) => void;
}

/**
 * Exposes a derived value as part of the public Hook API.
 */
const usePersonNameApi = (initialFirstName: string, initialLastName: string): PersonNameApi => {
  const [firstName, setFirstName] = useState<string>(initialFirstName);

  const [lastName, setLastName] = useState<string>(initialLastName);

  const fullName: string = useMemo<string>(
    (): string => `${firstName.trim()} ${lastName.trim()}`.trim(),
    [firstName, lastName],
  );

  return {
    firstName,
    lastName,
    fullName,
    setFirstName,
    setLastName,
  };
};

/**
 * Demonstrates exposing derived data directly through a Hook API.
 */
export const CustomHookApiDerivedExample: FC<CustomHookApiDerivedProps> = ({
  initialFirstName,
  initialLastName,
}: CustomHookApiDerivedProps): ReactNode => {
  const person: PersonNameApi = usePersonNameApi(initialFirstName, initialLastName);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    person.setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    person.setLastName(event.target.value);
  };

  return (
    <section>
      <h3>Exposing derived values</h3>

      <label>
        First name
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>

      <label>
        Last name
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>

      <p>Full name: {person.fullName}</p>
    </section>
  );
};

interface CollectionApi {
  readonly items: readonly string[];
  readonly count: number;
  readonly add: (item: string) => void;
  readonly removeAt: (index: number) => void;
  readonly clear: () => void;
}

/**
 * Exposes collection operations while preserving immutable array updates.
 * Invalid removal indexes are treated as no-ops.
 */
const useCollectionApi = (initialItems: readonly string[]): CollectionApi => {
  const [items, setItems] = useState<readonly string[]>(initialItems);

  const add = (item: string): void => {
    setItems((previousItems: readonly string[]): readonly string[] => [...previousItems, item]);
  };

  const removeAt = (index: number): void => {
    setItems((previousItems: readonly string[]): readonly string[] => {
      if (index < 0 || index >= previousItems.length) {
        return previousItems;
      }

      return previousItems.filter((_item: string, itemIndex: number): boolean => itemIndex !== index);
    });
  };

  const clear = (): void => {
    setItems([]);
  };

  return {
    items,
    count: items.length,
    add,
    removeAt,
    clear,
  };
};

/**
 * Demonstrates a collection-oriented Hook API with explicit edge-case
 * behavior for invalid indexes.
 */
export const CustomHookApiCollectionExample: FC<CustomHookApiCollectionProps> = ({
  initialItems,
}: CustomHookApiCollectionProps): ReactNode => {
  const collection: CollectionApi = useCollectionApi(initialItems);

  const addItem = (): void => {
    collection.add(`Item ${collection.count + 1}`);
  };

  return (
    <section>
      <h3>Designing collection operations</h3>

      <p>Count: {collection.count}</p>

      <ul>
        {collection.items.map((item: string, index: number): ReactNode => (
          <li key={`${item}-${index}`}>
            {item}

            <button type="button" onClick={(): void => collection.removeAt(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={addItem}>
        Add item
      </button>

      <button type="button" onClick={collection.clear}>
        Clear
      </button>
    </section>
  );
};

interface EncapsulatedApi {
  readonly value: string;
  readonly update: (value: string) => void;
  readonly reset: () => void;
}

/**
 * Keeps the raw state setter private and exposes domain-level operations.
 */
const useEncapsulatedApi = (initialValue: string): EncapsulatedApi => {
  const [value, setValue] = useState<string>(initialValue);

  const update = (nextValue: string): void => {
    setValue(nextValue);
  };

  const reset = (): void => {
    setValue(initialValue);
  };

  return {
    value,
    update,
    reset,
  };
};

/**
 * Demonstrates encapsulation of the Hook's internal state implementation.
 */
export const CustomHookApiEncapsulationExample: FC<CustomHookApiEncapsulationProps> = ({
  initialValue,
}: CustomHookApiEncapsulationProps): ReactNode => {
  const api: EncapsulatedApi = useEncapsulatedApi(initialValue);

  return (
    <section>
      <h3>Encapsulating implementation details</h3>

      <p>Value: {api.value}</p>

      <button type="button" onClick={(): void => api.update("Updated value")}>
        Update
      </button>

      <button type="button" onClick={api.reset}>
        Reset
      </button>
    </section>
  );
};

interface OptionalValueApi {
  readonly value: string | null;
  readonly hasValue: boolean;
  readonly setValue: (value: string) => void;
  readonly clear: () => void;
}

/**
 * Represents an absent value explicitly with `null`, distinguishing it from
 * a present empty string.
 */
const useOptionalValueApi = (initialValue: string | null): OptionalValueApi => {
  const [value, setValue] = useState<string | null>(initialValue);

  const hasValue: boolean = value !== null;

  const setOptionalValue = (nextValue: string): void => {
    setValue(nextValue);
  };

  const clear = (): void => {
    setValue(null);
  };

  return {
    value,
    hasValue,
    setValue: setOptionalValue,
    clear,
  };
};

/**
 * Demonstrates explicit representation of an absent value.
 */
export const CustomHookApiEdgeCaseExample: FC<CustomHookApiEdgeCaseProps> = ({
  initialCount,
}: CustomHookApiEdgeCaseProps): ReactNode => {
  const initialValue: string | null = initialCount > 0 ? "Available" : null;

  const api: OptionalValueApi = useOptionalValueApi(initialValue);

  return (
    <section>
      <h3>Representing an explicit empty state</h3>

      <p>Value: {api.value ?? "(no value)"}</p>

      <p>Has value: {api.hasValue ? "Yes" : "No"}</p>

      <button type="button" onClick={(): void => api.setValue("")}>
        Set empty string
      </button>

      <button type="button" onClick={api.clear}>
        Clear to null
      </button>
    </section>
  );
};

interface ReferenceApi {
  readonly value: string;
  readonly update: (value: string) => void;
}

/**
 * Memoizes both the action function and returned API object so their
 * references remain stable when their dependencies have not changed.
 */
const useMemoizedApi = (initialValue: string): ReferenceApi => {
  const [value, setValue] = useState<string>(initialValue);

  const update = useCallback((nextValue: string): void => {
    setValue(nextValue);
  }, []);

  return useMemo<ReferenceApi>(
    (): ReferenceApi => ({
      value,
      update,
    }),
    [value, update],
  );
};

/**
 * Demonstrates memoization of a returned Hook API object when reference
 * identity matters to its consumer.
 */
export const CustomHookApiMemoizedObjectExample: FC<CustomHookApiEncapsulationProps> = ({
  initialValue,
}: CustomHookApiEncapsulationProps): ReactNode => {
  const api: ReferenceApi = useMemoizedApi(initialValue);

  return (
    <section>
      <h3>Memoizing a returned API object</h3>

      <p>Value: {api.value}</p>

      <button type="button" onClick={(): void => api.update("New value")}>
        Update value
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CustomHookApiContainer: FC = (): ReactNode => {
  const initialItems: readonly string[] = ["React", "TypeScript", "JavaScript"];

  return (
    <main>
      <h1>Custom Hook API</h1>

      <h2>1. Returning a named object API</h2>
      <CustomHookApiObjectExample initialCount={0} />

      <h2>2. Returning a tuple API</h2>
      <CustomHookApiTupleExample initialValue="Initial value" />

      <h2>3. Exposing domain-specific operations</h2>
      <CustomHookApiDomainExample initialValue="Example value" />

      <h2>4. Providing stable action references</h2>
      <CustomHookApiStableExample initialCount={0} />

      <h2>5. Exposing derived values</h2>
      <CustomHookApiDerivedExample initialFirstName="John" initialLastName="Doe" />

      <h2>6. Designing collection operations</h2>
      <CustomHookApiCollectionExample initialItems={initialItems} />

      <h2>7. Encapsulating implementation details</h2>
      <CustomHookApiEncapsulationExample initialValue="Initial value" />

      <h2>8. Representing an explicit empty state</h2>
      <CustomHookApiEdgeCaseExample initialCount={1} />

      <h2>9. Memoizing a returned API object</h2>
      <CustomHookApiMemoizedObjectExample initialValue="Initial value" />
    </main>
  );
};

export default CustomHookApiContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A custom Hook API is the public contract returned by a custom Hook.
// - Object APIs are useful for multiple named values and operations.
// - Tuple APIs are useful for small positional contracts with obvious ordering.
// - Domain-specific operations can hide raw React state setters and implementation details.
// - `useCallback` can stabilize action function references when reference identity matters.
// - `useMemo` can stabilize a returned API object when consumers depend on object identity.
// - Memoization is not automatically required for every Hook API.
// - Derived values can be exposed directly so consumers do not duplicate domain calculations.
// - Collection APIs should preserve immutable state and define behavior for invalid operations.
// - An API can explicitly distinguish an absent value such as `null` from a present empty string.
// - A custom Hook should expose the smallest useful contract rather than its internal implementation.

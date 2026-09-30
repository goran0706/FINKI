/**
 * useMemo
 * =======
 *
 * `useMemo` caches the result of a calculation between renders. React calls
 * the calculation function during rendering and stores its result together
 * with the dependency values. On a later render, React compares the
 * dependencies with their previous values using `Object.is`. If they have not
 * changed, React can return the previously calculated value instead of
 * running the calculation again.
 *
 * The cache belongs to a particular component instance and is an optimization,
 * not application state. React may discard a memoized value when necessary,
 * so code must remain correct if the calculation runs again.
 *
 * `useMemo` is useful when a calculation is sufficiently expensive that
 * avoiding repeated work matters, or when a stable object or array reference
 * is required by another optimization such as `memo`. It does not make a
 * calculation asynchronous, move it outside rendering, or guarantee that the
 * calculation executes only once.
 *
 * Dependencies must include every reactive value used by the calculation.
 * Omitting a dependency can produce stale results. Conversely, including a
 * value that changes on every render can make the memoization ineffective.
 *
 * `useMemo` should not be used simply to make every calculation look
 * optimized. Simple calculations are often clearer without it. The primary
 * purpose is performance optimization and, in specific cases, referential
 * stability.
 */

import { type ChangeEvent, type FC, memo, type ReactNode, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ExpensiveCalculationProps {
  readonly initialLimit: number;
}

export interface FilteredListProps {
  readonly items: readonly string[];
  readonly initialQuery: string;
}

export interface StableObjectProps {
  readonly initialName: string;
}

export interface DependencyProps {
  readonly initialMultiplier: number;
}

export interface MemoizedChildProps {
  readonly configuration: {
    readonly color: string;
    readonly size: number;
  };
}

export interface DerivedValueProps {
  readonly firstName: string;
  readonly lastName: string;
}

export interface CacheGotchaProps {
  readonly initialValue: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates memoizing an expensive calculation. The calculation runs again
 * when `limit` changes but can be skipped when unrelated state changes.
 */
export const ExpensiveCalculationExample: FC<ExpensiveCalculationProps> = ({
  initialLimit,
}: ExpensiveCalculationProps): ReactNode => {
  const [limit, setLimit] = useState<number>(initialLimit);
  const [themeVersion, setThemeVersion] = useState<number>(0);

  const calculation = useMemo<number>(() => {
    let total: number = 0;

    for (let index: number = 0; index <= limit; index += 1) {
      total += index;
    }

    return total;
  }, [limit]);

  const increaseLimit = (): void => {
    setLimit((previousLimit: number): number => previousLimit + 100);
  };

  const changeTheme = (): void => {
    setThemeVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Memoizing an expensive calculation</h3>

      <p>Limit: {limit}</p>
      <p>Calculated total: {calculation}</p>
      <p>Unrelated render version: {themeVersion}</p>

      <button type="button" onClick={increaseLimit}>
        Increase limit
      </button>

      <button type="button" onClick={changeTheme}>
        Change unrelated state
      </button>
    </section>
  );
};

/**
 * Demonstrates memoizing a filtered array so the filtering calculation only
 * runs when either the source items or the search query changes.
 */
export const FilteredListExample: FC<FilteredListProps> = ({ items, initialQuery }: FilteredListProps): ReactNode => {
  const [query, setQuery] = useState<string>(initialQuery);

  const filteredItems = useMemo<readonly string[]>(() => {
    const normalizedQuery: string = query.trim().toLowerCase();

    if (normalizedQuery === "") {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <section>
      <h3>Memoizing filtered data</h3>

      <label>
        Search
        <input value={query} onChange={handleChange} />
      </label>

      <ul>
        {filteredItems.map((item: string): ReactNode => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates using `useMemo` to preserve an object reference. A stable
 * object can prevent a memoized child from re-rendering when unrelated parent
 * state changes.
 */
export const StableObjectExample: FC<StableObjectProps> = ({ initialName }: StableObjectProps): ReactNode => {
  const [name, setName] = useState<string>(initialName);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const configuration = useMemo<{
    readonly name: string;
    readonly color: string;
  }>(
    () => ({
      name,
      color: "royalblue",
    }),
    [name],
  );

  const updateName = (): void => {
    setName("John Doe");
  };

  const forceParentRender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Memoizing an object reference</h3>

      <p>Parent render version: {renderVersion}</p>

      <MemoizedConfigurationChild configuration={configuration} />

      <button type="button" onClick={updateName}>
        Update name
      </button>

      <button type="button" onClick={forceParentRender}>
        Re-render parent
      </button>
    </section>
  );
};

/**
 * A memoized child skips rendering when its object prop retains the same
 * reference. `useMemo` in the parent provides that stable reference when the
 * configuration's contents do not need to change.
 */
const MemoizedConfigurationChild: FC<MemoizedChildProps> = memo(({ configuration }: MemoizedChildProps): ReactNode => {
  return (
    <div>
      <p>Name: {configuration.name}</p>
      <p>Color: {configuration.color}</p>
    </div>
  );
});

/**
 * Demonstrates that all reactive values used by a memoized calculation belong
 * in the dependency list. The result is recalculated when the multiplier
 * changes.
 */
export const DependencyExample: FC<DependencyProps> = ({ initialMultiplier }: DependencyProps): ReactNode => {
  const [value, setValue] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(initialMultiplier);

  const result = useMemo<number>(() => {
    return value * multiplier;
  }, [multiplier, value]);

  const increaseValue = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  const increaseMultiplier = (): void => {
    setMultiplier((previousMultiplier: number): number => previousMultiplier + 1);
  };

  return (
    <section>
      <h3>Declaring complete dependencies</h3>

      <p>Value: {value}</p>
      <p>Multiplier: {multiplier}</p>
      <p>Result: {result}</p>

      <button type="button" onClick={increaseValue}>
        Increase value
      </button>

      <button type="button" onClick={increaseMultiplier}>
        Increase multiplier
      </button>
    </section>
  );
};

/**
 * Demonstrates a calculation that does not need memoization. The derived
 * string is inexpensive to calculate, so adding a cache would normally add
 * complexity without a meaningful optimization.
 */
export const DerivedValueExample: FC<DerivedValueProps> = ({ firstName, lastName }: DerivedValueProps): ReactNode => {
  const fullName: string = `${firstName} ${lastName}`;

  return (
    <section>
      <h3>Simple calculations do not require useMemo</h3>
      <p>Full name: {fullName}</p>
    </section>
  );
};

/**
 * Demonstrates that a memoized value is not a replacement for state. The
 * computed value is derived from state and can be recalculated whenever its
 * dependencies change.
 */
export const MemoizedDerivedStateExample: FC = (): ReactNode => {
  const [count, setCount] = useState<number>(0);

  const doubledCount = useMemo<number>(() => {
    return count * 2;
  }, [count]);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>useMemo is not state</h3>

      <p>Count: {count}</p>
      <p>Doubled count: {doubledCount}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates the common misconception that `useMemo` guarantees a
 * calculation will execute only once. The calculation is pure and remains
 * correct even if React executes it again.
 */
export const CacheGotchaExample: FC<CacheGotchaProps> = ({ initialValue }: CacheGotchaProps): ReactNode => {
  const [value, setValue] = useState<number>(initialValue);

  const doubledValue = useMemo<number>(() => {
    return value * 2;
  }, [value]);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <h3>Gotcha: memoization is an optimization</h3>

      <p>Value: {value}</p>
      <p>Doubled value: {doubledValue}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>

      <p>The calculation must remain correct even if React recalculates the memoized value.</p>
    </section>
  );
};

/**
 * Demonstrates the difference between a stable primitive and a newly created
 * object. Primitive values already have value semantics, while object
 * references change whenever a new object is created.
 */
export const ReferenceStabilityExample: FC = (): ReactNode => {
  const [count, setCount] = useState<number>(0);

  const unstableObject: { readonly value: number } = {
    value: count,
  };

  const stableObject = useMemo<{
    readonly value: number;
  }>(
    () => ({
      value: count,
    }),
    [count],
  );

  return (
    <section>
      <h3>Primitive values versus object references</h3>

      <p>Count: {count}</p>
      <p>Unstable object value: {unstableObject.value}</p>
      <p>Stable object value: {stableObject.value}</p>

      <button
        type="button"
        onClick={(): void => {
          setCount((previousCount: number): number => previousCount + 1);
        }}
      >
        Increment
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseMemoContainer: FC = (): ReactNode => {
  const items: readonly string[] = ["React", "TypeScript", "JavaScript", "CSS", "HTML"];

  return (
    <main>
      <h1>useMemo</h1>

      <h2>1. Memoizing an expensive calculation</h2>
      <ExpensiveCalculationExample initialLimit={1000} />

      <h2>2. Memoizing filtered data</h2>
      <FilteredListExample items={items} initialQuery="" />

      <h2>3. Preserving an object reference</h2>
      <StableObjectExample initialName="John Doe" />

      <h2>4. Declaring complete calculation dependencies</h2>
      <DependencyExample initialMultiplier={2} />

      <h2>5. Avoiding unnecessary memoization for simple calculations</h2>
      <DerivedValueExample firstName="John" lastName="Doe" />

      <h2>6. Using memoization for derived data rather than state</h2>
      <MemoizedDerivedStateExample />

      <h2>7. Treating memoization as an optimization</h2>
      <CacheGotchaExample initialValue={5} />

      <h2>8. Understanding reference stability</h2>
      <ReferenceStabilityExample />
    </main>
  );
};

export default UseMemoContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useMemo` caches a calculation result between renders.
// - Dependencies determine when React may reuse the cached value.
// - Dependencies are compared with `Object.is`.
// - Every reactive value used by the calculation should be represented in the dependency list.
// - `useMemo` can reduce expensive recalculation when dependencies have not changed.
// - `useMemo` can provide stable object or array references for memoized children.
// - `useMemo` is an optimization, not state and not a correctness mechanism.
// - Simple calculations often do not benefit from memoization.
// - Memoized calculations must remain correct if React recalculates them.

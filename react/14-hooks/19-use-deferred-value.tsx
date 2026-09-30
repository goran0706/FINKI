/**
 * useDeferredValue
 * ================
 *
 * `useDeferredValue` lets a component receive a deferred version of a value.
 * React returns the current value when rendering is inexpensive and can return
 * a previous value temporarily when updating the deferred value would require
 * non-urgent rendering work.
 *
 * The Hook does not delay the source state update. The original value is
 * updated immediately, while React may render the consuming portion with an
 * older deferred value until the newer value can be rendered.
 *
 * The deferred value participates in React's concurrent rendering model. When
 * the value changes, React first renders using the previous deferred value and
 * schedules work to bring the deferred value up to date. If more urgent work
 * arrives, React can prioritize that work before completing the deferred
 * rendering.
 *
 * `useDeferredValue` is especially useful when a fast-changing value controls
 * an expensive child, such as a large filtered list. The input can remain
 * responsive because it uses the immediate value, while the expensive result
 * consumes the deferred value.
 *
 * The Hook does not debounce a value and does not impose a fixed delay. There
 * is no timer or configurable number of milliseconds. The deferred value is
 * controlled by React's scheduling system and can eventually become equal to
 * the source value.
 *
 * An optional initial value can be supplied. During the initial render, React
 * uses that initial value for the deferred value instead of the source value.
 * This is useful when the initial expensive rendering should begin from a
 * known fallback value.
 */

import { type ChangeEvent, type FC, type ReactNode, useDeferredValue, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DeferredSearchProps {
  readonly items: readonly string[];
  readonly initialQuery: string;
}

export interface DeferredListProps {
  readonly items: readonly string[];
  readonly initialFilter: string;
}

export interface DeferredObjectProps {
  readonly initialQuery: string;
}

export interface DeferredInitialValueProps {
  readonly value: string;
  readonly initialDeferredValue: string;
}

export interface DeferredComparisonProps {
  readonly initialValue: string;
}

export interface DeferredChildProps {
  readonly query: string;
  readonly items: readonly string[];
}

export interface DeferredGotchaProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the primary use case: an input uses the immediate value while
 * an expensive list consumes the deferred value.
 */
export const DeferredSearchExample: FC<DeferredSearchProps> = ({
  items,
  initialQuery,
}: DeferredSearchProps): ReactNode => {
  const [query, setQuery] = useState<string>(initialQuery);
  const deferredQuery: string = useDeferredValue<string>(query);

  const filteredItems = useMemo<readonly string[]>(() => {
    const normalizedQuery: string = deferredQuery.trim().toLowerCase();

    if (normalizedQuery === "") {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedQuery));
  }, [deferredQuery, items]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const isStale: boolean = query !== deferredQuery;

  return (
    <section>
      <h3>Deferring an expensive search value</h3>

      <label>
        Search
        <input value={query} onChange={handleChange} />
      </label>

      {isStale && <p>Results are updating...</p>}

      <p>Current query: {query}</p>
      <p>Rendered query: {deferredQuery}</p>

      <ul>
        {filteredItems.map((item: string): ReactNode => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates that the deferred value can temporarily differ from the
 * source value. The comparison provides a simple way to detect that the
 * deferred rendering has not caught up yet.
 */
export const DeferredListExample: FC<DeferredListProps> = ({ items, initialFilter }: DeferredListProps): ReactNode => {
  const [filter, setFilter] = useState<string>(initialFilter);
  const deferredFilter: string = useDeferredValue<string>(filter);

  const visibleItems = useMemo<readonly string[]>(() => {
    const normalizedFilter: string = deferredFilter.trim().toLowerCase();

    if (normalizedFilter === "") {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedFilter));
  }, [deferredFilter, items]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFilter(event.target.value);
  };

  const isDeferred: boolean = filter !== deferredFilter;

  return (
    <section>
      <h3>Detecting a deferred value</h3>

      <label>
        Filter
        <input value={filter} onChange={handleChange} />
      </label>

      <p>{isDeferred ? "The displayed list is using a deferred filter." : "The displayed list is current."}</p>

      <p>Visible items: {visibleItems.length}</p>
    </section>
  );
};

/**
 * Demonstrates deferring a primitive value. Primitive values can be compared
 * directly to determine whether the deferred value has caught up.
 */
export const DeferredPrimitiveExample: FC = (): ReactNode => {
  const [value, setValue] = useState<number>(0);
  const deferredValue: number = useDeferredValue<number>(value);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  const isDeferred: boolean = value !== deferredValue;

  return (
    <section>
      <h3>Deferring a primitive value</h3>

      <p>Current value: {value}</p>
      <p>Deferred value: {deferredValue}</p>
      <p>Status: {isDeferred ? "Deferred" : "Current"}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates the optional initial deferred value. The initial deferred value
 * is used on the initial render and the deferred value can subsequently catch
 * up with the source value.
 */
export const DeferredInitialValueExample: FC<DeferredInitialValueProps> = ({
  value,
  initialDeferredValue,
}: DeferredInitialValueProps): ReactNode => {
  const deferredValue: string = useDeferredValue<string>(value, initialDeferredValue);

  return (
    <section>
      <h3>Providing an initial deferred value</h3>

      <p>Source value: {value}</p>
      <p>Deferred value: {deferredValue}</p>
    </section>
  );
};

/**
 * Demonstrates that `useDeferredValue` does not debounce a value. There is no
 * fixed timeout, and React determines when the deferred rendering catches up.
 */
export const DeferredNoDebounceExample: FC<DeferredComparisonProps> = ({
  initialValue,
}: DeferredComparisonProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const deferredValue: string = useDeferredValue<string>(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>useDeferredValue is not debouncing</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <p>Immediate: {value}</p>
      <p>Deferred: {deferredValue}</p>

      <p>There is no fixed delay; the deferred value catches up according to React&apos;s scheduling.</p>
    </section>
  );
};

/**
 * Demonstrates passing a deferred value to a child component. The child
 * receives the deferred query and performs its expensive rendering from that
 * value rather than from the rapidly changing source value.
 */
export const DeferredChildExample: FC<DeferredChildProps> = ({ query, items }: DeferredChildProps): ReactNode => {
  const deferredQuery: string = useDeferredValue<string>(query);

  return (
    <section>
      <h3>Passing a deferred value to a child</h3>

      <p>Source query: {query}</p>
      <DeferredResults query={deferredQuery} items={items} />
    </section>
  );
};

/**
 * Represents an expensive child that consumes the deferred value. The child
 * remains independent from the source input state.
 */
const DeferredResults: FC<DeferredChildProps> = ({ query, items }: DeferredChildProps): ReactNode => {
  const normalizedQuery: string = query.trim().toLowerCase();

  const results = useMemo<readonly string[]>(() => {
    if (normalizedQuery === "") {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedQuery));
  }, [items, normalizedQuery]);

  return (
    <div>
      <p>Deferred query: {query}</p>
      <p>Results: {results.length}</p>
    </div>
  );
};

/**
 * Demonstrates a common misconception: deferring a value does not make the
 * calculation itself cheaper. It changes when the consuming render is
 * performed, while the calculation still has to execute when React renders
 * the deferred value.
 */
export const DeferredGotchaExample: FC<DeferredGotchaProps> = ({ initialValue }: DeferredGotchaProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const deferredValue: string = useDeferredValue<string>(value);

  const calculatedLength: number = deferredValue.length;

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Gotcha: deferring does not make calculations cheaper</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <p>Current value: {value}</p>
      <p>Deferred value: {deferredValue}</p>
      <p>Deferred value length: {calculatedLength}</p>
    </section>
  );
};

/**
 * Demonstrates that the source state remains authoritative. The deferred
 * value is a rendering optimization and should not be treated as the source
 * of truth for user input.
 */
export const DeferredSourceOfTruthExample: FC = (): ReactNode => {
  const [query, setQuery] = useState<string>("");
  const deferredQuery: string = useDeferredValue<string>(query);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <section>
      <h3>Keeping the immediate value as the source of truth</h3>

      <label>
        Query
        <input value={query} onChange={handleChange} />
      </label>

      <p>Source of truth: {query || "(empty)"}</p>
      <p>Deferred rendering value: {deferredQuery || "(empty)"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseDeferredValueContainer: FC = (): ReactNode => {
  const items: readonly string[] = [
    "React",
    "TypeScript",
    "JavaScript",
    "CSS",
    "HTML",
    "Accessibility",
    "Components",
    "Hooks",
  ];

  return (
    <main>
      <h1>useDeferredValue</h1>

      <h2>1. Deferring an expensive search value</h2>
      <DeferredSearchExample items={items} initialQuery="" />

      <h2>2. Detecting when a deferred value is behind</h2>
      <DeferredListExample items={items} initialFilter="" />

      <h2>3. Deferring a primitive value</h2>
      <DeferredPrimitiveExample />

      <h2>4. Providing an initial deferred value</h2>
      <DeferredInitialValueExample value="example.com" initialDeferredValue="" />

      <h2>5. Understanding that useDeferredValue is not debouncing</h2>
      <DeferredNoDebounceExample initialValue="" />

      <h2>6. Passing a deferred value to a child</h2>
      <DeferredChildExample query="" items={items} />

      <h2>7. Understanding that deferring does not reduce calculation cost</h2>
      <DeferredGotchaExample initialValue="example.com" />

      <h2>8. Keeping the immediate value as the source of truth</h2>
      <DeferredSourceOfTruthExample />
    </main>
  );
};

export default UseDeferredValueContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useDeferredValue` provides a deferred version of an existing value.
// - The source value updates immediately; the deferred value can temporarily lag behind.
// - React controls when the deferred value catches up.
// - `useDeferredValue` does not use a fixed timeout and is not a debounce mechanism.
// - It is useful when a rapidly changing value drives expensive rendering.
// - The immediate value should remain the source of truth for responsive interactions.
// - A deferred value can temporarily differ from its source value.
// - The optional initial value applies to the initial deferred render.
// - Deferring rendering does not make the underlying calculation intrinsically cheaper.
// - `useTransition` marks state updates as non-urgent, while `useDeferredValue` defers consumption of an existing value.

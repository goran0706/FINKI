/**
 * useTransition
 * =============
 *
 * `useTransition` lets a component mark state updates as non-urgent
 * transitions. It returns an `isPending` flag and a `startTransition`
 * function. Updates scheduled synchronously inside `startTransition` are
 * assigned transition priority, allowing React to keep urgent interactions
 * such as typing and clicking responsive while rendering the transition in
 * the background.
 *
 * The Hook does not make JavaScript calculations asynchronous and does not
 * delay the callback itself. `startTransition` immediately executes its
 * scope; React treats state updates scheduled synchronously inside that scope
 * as non-urgent work. The transition can be interrupted by more urgent work
 * and React can restart rendering with newer state.
 *
 * Transition updates are appropriate for rendering expensive, non-urgent
 * results such as filtering a large collection or switching a complex view.
 * The input state itself should remain an urgent update so the controlled input
 * stays responsive.
 *
 * `isPending` becomes `true` while React has pending transition work. It can
 * be used to display a loading indicator or temporarily communicate that
 * non-urgent rendering is still in progress.
 *
 * State updates after an asynchronous boundary are not automatically part of
 * the original transition. When asynchronous work is involved, the state
 * update that should be treated as a transition must be scheduled with
 * `startTransition` again after the asynchronous operation completes.
 *
 * `useTransition` is different from `useDeferredValue`. `useTransition`
 * controls the priority of a state update at its source, while
 * `useDeferredValue` lets a component receive a deferred version of an
 * existing value.
 */

import { type ChangeEvent, type FC, type ReactNode, useMemo, useState, useTransition } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TransitionFilterProps {
  readonly items: readonly string[];
  readonly initialQuery: string;
}

export interface TransitionViewProps {
  readonly initialView: "summary" | "details";
}

export interface TransitionPendingProps {
  readonly initialCount: number;
}

export interface TransitionSearchProps {
  readonly items: readonly string[];
  readonly initialQuery: string;
}

export interface TransitionUrgencyProps {
  readonly initialValue: number;
}

export interface TransitionAsyncProps {
  readonly initialStatus: string;
}

export interface TransitionGotchaProps {
  readonly initialQuery: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the primary use case for `useTransition`: keeping an urgent
 * input update separate from an expensive non-urgent filtering update.
 */
export const TransitionFilterExample: FC<TransitionFilterProps> = ({
  items,
  initialQuery,
}: TransitionFilterProps): ReactNode => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [filter, setFilter] = useState<string>(initialQuery);
  const [isPending, startTransition] = useTransition();

  const filteredItems = useMemo<readonly string[]>(() => {
    const normalizedQuery: string = filter.trim().toLowerCase();

    if (normalizedQuery === "") {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedQuery));
  }, [filter, items]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextQuery: string = event.target.value;

    setQuery(nextQuery);

    startTransition((): void => {
      setFilter(nextQuery);
    });
  };

  return (
    <section>
      <h3>Keeping urgent input responsive</h3>

      <label>
        Search
        <input value={query} onChange={handleChange} />
      </label>

      {isPending && <p>Updating results...</p>}

      <ul>
        {filteredItems.map((item: string): ReactNode => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates marking a view switch as non-urgent. The selected view state
 * is updated through a transition so React can prioritize other urgent work.
 */
export const TransitionViewExample: FC<TransitionViewProps> = ({ initialView }: TransitionViewProps): ReactNode => {
  const [view, setView] = useState<"summary" | "details">(initialView);
  const [isPending, startTransition] = useTransition();

  const showSummary = (): void => {
    startTransition((): void => {
      setView("summary");
    });
  };

  const showDetails = (): void => {
    startTransition((): void => {
      setView("details");
    });
  };

  return (
    <section>
      <h3>Marking a view change as non-urgent</h3>

      <button type="button" onClick={showSummary}>
        Summary
      </button>

      <button type="button" onClick={showDetails}>
        Details
      </button>

      {isPending && <p>Switching view...</p>}

      {view === "summary" ? (
        <p>Summary view is active.</p>
      ) : (
        <div>
          <p>Details view is active.</p>
          <p>Additional information is rendered as part of the selected view.</p>
        </div>
      )}
    </section>
  );
};

/**
 * Demonstrates the `isPending` value returned by `useTransition`. The pending
 * flag is suitable for communicating that transition rendering is still in
 * progress.
 */
export const TransitionPendingExample: FC<TransitionPendingProps> = ({
  initialCount,
}: TransitionPendingProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);
  const [isPending, startTransition] = useTransition();

  const increment = (): void => {
    startTransition((): void => {
      setCount((previousCount: number): number => previousCount + 1);
    });
  };

  return (
    <section>
      <h3>Reading transition pending state</h3>

      <p>Count: {count}</p>
      <p>Status: {isPending ? "Pending" : "Idle"}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates that the callback passed to `startTransition` runs immediately.
 * The transition controls the priority of synchronous state updates rather than
 * turning the callback itself into an asynchronous function.
 */
export const TransitionUrgencyExample: FC<TransitionUrgencyProps> = ({
  initialValue,
}: TransitionUrgencyProps): ReactNode => {
  const [value, setValue] = useState<number>(initialValue);
  const [message, setMessage] = useState<string>("Ready");
  const [isPending, startTransition] = useTransition();

  const runTransition = (): void => {
    setMessage("Transition callback executed");

    startTransition((): void => {
      setValue((previousValue: number): number => previousValue + 1);
    });
  };

  return (
    <section>
      <h3>Transition scope does not make code asynchronous</h3>

      <p>Value: {value}</p>
      <p>{message}</p>
      <p>{isPending ? "Transition pending" : "No transition pending"}</p>

      <button type="button" onClick={runTransition}>
        Start transition
      </button>
    </section>
  );
};

/**
 * Demonstrates keeping an urgent update outside the transition while marking
 * the related rendering update as non-urgent.
 */
export const TransitionSearchExample: FC<TransitionSearchProps> = ({
  items,
  initialQuery,
}: TransitionSearchProps): ReactNode => {
  const [inputValue, setInputValue] = useState<string>(initialQuery);
  const [searchValue, setSearchValue] = useState<string>(initialQuery);
  const [isPending, startTransition] = useTransition();

  const results = useMemo<readonly string[]>(() => {
    const normalizedValue: string = searchValue.trim().toLowerCase();

    if (normalizedValue === "") {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedValue));
  }, [items, searchValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue: string = event.target.value;

    setInputValue(nextValue);

    startTransition((): void => {
      setSearchValue(nextValue);
    });
  };

  return (
    <section>
      <h3>Separating urgent input from non-urgent results</h3>

      <label>
        Search
        <input value={inputValue} onChange={handleChange} />
      </label>

      <p>{isPending ? "Rendering search results..." : "Search results are current."}</p>

      <p>Matches: {results.length}</p>
    </section>
  );
};

/**
 * Demonstrates that urgent state can continue to update while transition state
 * represents work that React is allowed to interrupt and restart.
 */
export const TransitionInterruptionExample: FC = (): ReactNode => {
  const [text, setText] = useState<string>("");
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  const selectNumber = (value: number): void => {
    startTransition((): void => {
      setSelectedNumber(value);
    });
  };

  return (
    <section>
      <h3>Allowing urgent work to interrupt transitions</h3>

      <label>
        Urgent text input
        <input value={text} onChange={handleTextChange} />
      </label>

      <p>Input: {text}</p>
      <p>Selected value: {selectedNumber}</p>
      <p>{isPending ? "Selection pending" : "Selection current"}</p>

      <button type="button" onClick={(): void => selectNumber(1)}>
        Select 1
      </button>

      <button type="button" onClick={(): void => selectNumber(2)}>
        Select 2
      </button>

      <button type="button" onClick={(): void => selectNumber(3)}>
        Select 3
      </button>
    </section>
  );
};

/**
 * Demonstrates an asynchronous boundary. A state update that happens after
 * asynchronous work must be wrapped in `startTransition` again if that update
 * should be treated as transition work.
 */
export const TransitionAsyncExample: FC<TransitionAsyncProps> = ({
  initialStatus,
}: TransitionAsyncProps): ReactNode => {
  const [status, setStatus] = useState<string>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const simulateRequest = (): void => {
    startTransition((): void => {
      setStatus("Request started");
    });

    window.setTimeout((): void => {
      startTransition((): void => {
        setStatus("Request completed");
      });
    }, 500);
  };

  return (
    <section>
      <h3>Re-entering a transition after asynchronous work</h3>

      <p>Status: {status}</p>
      <p>{isPending ? "Transition pending" : "Idle"}</p>

      <button type="button" onClick={simulateRequest}>
        Simulate request
      </button>
    </section>
  );
};

/**
 * Demonstrates the misconception that every state update inside a component
 * should be placed inside a transition. Urgent interaction state remains
 * outside the transition while expensive rendering state is transitioned.
 */
export const TransitionGotchaExample: FC<TransitionGotchaProps> = ({
  initialQuery,
}: TransitionGotchaProps): ReactNode => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [displayQuery, setDisplayQuery] = useState<string>(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextQuery: string = event.target.value;

    setQuery(nextQuery);

    startTransition((): void => {
      setDisplayQuery(nextQuery);
    });
  };

  return (
    <section>
      <h3>Gotcha: not every state update needs a transition</h3>

      <label>
        Query
        <input value={query} onChange={handleChange} />
      </label>

      <p>Urgent input value: {query}</p>
      <p>Transition-rendered value: {displayQuery}</p>

      {isPending && <p>Updating non-urgent content...</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseTransitionContainer: FC = (): ReactNode => {
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
      <h1>useTransition</h1>

      <h2>1. Keeping urgent input responsive</h2>
      <TransitionFilterExample items={items} initialQuery="" />

      <h2>2. Marking a view change as non-urgent</h2>
      <TransitionViewExample initialView="summary" />

      <h2>3. Reading transition pending state</h2>
      <TransitionPendingExample initialCount={0} />

      <h2>4. Understanding transition callback timing</h2>
      <TransitionUrgencyExample initialValue={0} />

      <h2>5. Separating urgent input from non-urgent results</h2>
      <TransitionSearchExample items={items} initialQuery="" />

      <h2>6. Allowing urgent work to interrupt transitions</h2>
      <TransitionInterruptionExample />

      <h2>7. Re-entering a transition after asynchronous work</h2>
      <TransitionAsyncExample initialStatus="Ready" />

      <h2>8. Avoiding unnecessary transitions</h2>
      <TransitionGotchaExample initialQuery="" />
    </main>
  );
};

export default UseTransitionContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useTransition` marks synchronous state updates as non-urgent transition work.
// - It returns an `isPending` flag and a `startTransition` function.
// - `startTransition` executes its callback immediately; it does not make the callback asynchronous.
// - Urgent state such as controlled input values should generally remain outside the transition.
// - Expensive non-urgent rendering can be scheduled inside `startTransition`.
// - React can interrupt transition rendering when more urgent work arrives.
// - `isPending` can communicate that transition work is still being processed.
// - State updates after asynchronous boundaries may need another `startTransition` call.
// - `useTransition` controls update priority, while `useDeferredValue` defers consumption of a value.

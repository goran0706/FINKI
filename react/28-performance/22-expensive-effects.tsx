/**
 * Expensive Effects
 * =================
 *
 * Effects can become a performance bottleneck when their setup, cleanup, or synchronization work is expensive.
 * Understanding when Effects run, what causes them to rerun, and how to separate expensive work from synchronization
 * helps prevent unnecessary CPU work, network requests, subscriptions, and state updates.
 */

import { useEffect, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Expensive work inside an Effect
// ---------------------------------------------------------------------

const ExpensiveEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const start = performance.now();

    for (let index = 0; index < 1_000_000; index += 1) {
      Math.sqrt(index);
    }

    console.log(`Effect work for "${query}": ${(performance.now() - start).toFixed(2)} ms`);
  }, [query]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// Expensive JavaScript inside an Effect runs whenever its dependencies require synchronization.
// If the dependency changes frequently, the expensive work can also happen frequently.

// ---------------------------------------------------------------------
// 2. Effect frequency matters
// ---------------------------------------------------------------------

const FrequentlyRunningEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Expensive synchronization for:", query);
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>
    </section>
  );
};

// The Effect does not rerun when count changes because count is not a dependency.
// Expensive Effects become problematic when the values they depend on change frequently.

// ---------------------------------------------------------------------
// 3. Unstable object dependencies can make Effects expensive
// ---------------------------------------------------------------------

const UnstableObjectDependency: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const options = {
    mode: "compact",
  };

  useEffect(() => {
    console.log("Synchronizing with options:", options);
  }, [options]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// options is a new object on every render.
// Its reference changes even when its contents are identical, so the Effect can rerun after every committed render.

// ---------------------------------------------------------------------
// 4. Depend on the primitive value the Effect actually needs
// ---------------------------------------------------------------------

const NarrowObjectDependency: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const mode = "compact";

  useEffect(() => {
    console.log("Synchronizing mode:", mode);
  }, [mode]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// Depending on the primitive value avoids reruns caused only by object identity changes.
// The Effect now reruns only when the value it actually uses changes.

// ---------------------------------------------------------------------
// 5. Move Effect-specific objects inside the Effect
// ---------------------------------------------------------------------

const LocalOptions: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");

  useEffect(() => {
    const options = {
      roomId,
      mode: "compact",
    };

    console.log("Connecting with:", options);
  }, [roomId]);

  return (
    <button type="button" onClick={() => setRoomId((value) => (value === "main" ? "support" : "main"))}>
      Room: {roomId}
    </button>
  );
};

// If an object exists only for the Effect, creating it inside the Effect keeps its identity
// from becoming an unnecessary dependency of the synchronization.

// ---------------------------------------------------------------------
// 6. Expensive cleanup is also performance work
// ---------------------------------------------------------------------

const ExpensiveCleanup: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");

  useEffect(() => {
    console.log("Opening connection:", roomId);

    return () => {
      console.log("Closing connection:", roomId);

      for (let index = 0; index < 500_000; index += 1) {
        Math.sqrt(index);
      }
    };
  }, [roomId]);

  return (
    <button type="button" onClick={() => setRoomId((value) => (value === "main" ? "support" : "main"))}>
      Room: {roomId}
    </button>
  );
};

// Cleanup runs before an Effect is replaced and when the component unmounts.
// If cleanup is expensive, unnecessary Effect reruns can make the performance cost occur twice:
// once for cleanup and again for the new setup.

// ---------------------------------------------------------------------
// 7. Expensive setup and cleanup should match real synchronization
// ---------------------------------------------------------------------

interface ConnectionOptions {
  readonly roomId: string;
}

const createConnection = (options: ConnectionOptions): (() => void) => {
  console.log("Creating connection for:", options.roomId);

  return () => {
    console.log("Disconnecting:", options.roomId);
  };
};

const ConnectionEffect: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");

  useEffect(() => {
    const disconnect = createConnection({ roomId });

    return disconnect;
  }, [roomId]);

  return (
    <button type="button" onClick={() => setRoomId((value) => (value === "main" ? "support" : "main"))}>
      Room: {roomId}
    </button>
  );
};

// The connection is created only when roomId changes.
// This keeps setup and cleanup aligned with the external resource being synchronized.

// ---------------------------------------------------------------------
// 8. Avoid using Effects for derived values
// ---------------------------------------------------------------------

const DerivedValueEffect: FC = (): ReactElement => {
  const [price, setPrice] = useState(100);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(price * 1.2);
  }, [price]);

  return (
    <section>
      <p>Total: {total}</p>

      <button type="button" onClick={() => setPrice((value) => value + 10)}>
        Increase price
      </button>
    </section>
  );
};

// total is fully determined by price.
// Using an Effect introduces an additional state update and render for a value that could be calculated directly.

// ---------------------------------------------------------------------
// 9. Calculate derived values during rendering
// ---------------------------------------------------------------------

const DerivedValueDirectly: FC = (): ReactElement => {
  const [price, setPrice] = useState(100);

  const total = price * 1.2;

  return (
    <section>
      <p>Total: {total}</p>

      <button type="button" onClick={() => setPrice((value) => value + 10)}>
        Increase price
      </button>
    </section>
  );
};

// Direct calculation removes the Effect and the extra state update.
// This is especially useful when the derived calculation is cheap.

// ---------------------------------------------------------------------
// 10. Expensive calculations are a separate concern
// ---------------------------------------------------------------------

const expensiveFilter = (query: string): readonly string[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return Array.from({ length: 10_000 }, (_, index) => `Product ${index + 1}`).filter((product) =>
    product.toLowerCase().includes(normalizedQuery),
  );
};

const ExpensiveCalculation: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const results = expensiveFilter(query);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {results.length}</p>
    </section>
  );
};

// Expensive calculations that produce values for rendering belong to the render calculation,
// not in an Effect that writes the result into separate state.

// ---------------------------------------------------------------------
// 11. Memoize expensive calculations when measurement justifies it
// ---------------------------------------------------------------------

const MemoizedExpensiveCalculation: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const results = useMemo(() => {
    return expensiveFilter(query);
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {results.length}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>
    </section>
  );
};

// useMemo can avoid repeating an expensive calculation when its dependencies have not changed.
// It does not make the calculation intrinsically cheaper and should be justified by actual cost.

// ---------------------------------------------------------------------
// 12. Do not use an Effect just to populate derived state
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
}

const products: readonly Product[] = Array.from({ length: 5_000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
}));

const DerivedProducts: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter products" />

      <p>Matches: {visibleProducts.length}</p>
    </section>
  );
};

// The filtered collection is derived from products and query.
// Keeping it in state through an Effect would create another synchronization path without adding information.

// ---------------------------------------------------------------------
// 13. Expensive Effects can be triggered by broad dependencies
// ---------------------------------------------------------------------

interface UserSettings {
  readonly userId: number;
  readonly theme: string;
  readonly language: string;
}

const UserSettingsEffect: FC = (): ReactElement => {
  const [settings, setSettings] = useState<UserSettings>({
    userId: 1,
    theme: "light",
    language: "en",
  });

  useEffect(() => {
    console.log("Synchronizing user:", settings.userId);
  }, [settings]);

  return (
    <button
      type="button"
      onClick={() =>
        setSettings((current) => ({
          ...current,
          theme: current.theme === "light" ? "dark" : "light",
        }))
      }
    >
      Theme: {settings.theme}
    </button>
  );
};

// The Effect only uses userId but depends on the entire settings object.
// Changing theme creates a new settings object and unnecessarily reruns the synchronization.

// ---------------------------------------------------------------------
// 14. Narrow the dependency to the value being synchronized
// ---------------------------------------------------------------------

const NarrowUserSettingsEffect: FC = (): ReactElement => {
  const [settings, setSettings] = useState<UserSettings>({
    userId: 1,
    theme: "light",
    language: "en",
  });

  useEffect(() => {
    console.log("Synchronizing user:", settings.userId);
  }, [settings.userId]);

  return (
    <button
      type="button"
      onClick={() =>
        setSettings((current) => ({
          ...current,
          theme: current.theme === "light" ? "dark" : "light",
        }))
      }
    >
      Theme: {settings.theme}
    </button>
  );
};

// The Effect now responds specifically to userId.
// Theme changes no longer cause this particular synchronization to rerun.

// ---------------------------------------------------------------------
// 15. Function identity can trigger expensive Effects
// ---------------------------------------------------------------------

const FunctionDependencyEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const buildRequest = (): string => {
    return `/api/search?q=${encodeURIComponent(query)}`;
  };

  useEffect(() => {
    console.log("Request URL:", buildRequest());
  }, [buildRequest]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// buildRequest is recreated on every render.
// Its changing function reference causes the Effect to rerun after every committed render.

// ---------------------------------------------------------------------
// 16. Move Effect-specific functions inside the Effect
// ---------------------------------------------------------------------

const LocalFunctionEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const buildRequest = (): string => {
      return `/api/search?q=${encodeURIComponent(query)}`;
    };

    console.log("Request URL:", buildRequest());
  }, [query]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// When a function is only needed by one Effect, defining it inside that Effect
// can remove an unnecessary function dependency and make synchronization more precise.

// ---------------------------------------------------------------------
// 17. Network synchronization can be expensive
// ---------------------------------------------------------------------

const SearchSynchronization: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadResults = async (): Promise<void> => {
      console.log("Requesting results for:", query);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        console.log("Received response:", response.status);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Search request failed:", error);
      }
    };

    void loadResults();

    return () => {
      controller.abort();
    };
  }, [query]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// Every query change starts synchronization with the external system.
// Cleanup aborts the previous request so obsolete work does not continue unnecessarily.

// ---------------------------------------------------------------------
// 18. Frequent input can cause frequent synchronization
// ---------------------------------------------------------------------

const SearchOnEveryKeystroke: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log("Synchronizing search:", query);
  }, [query]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a query" />;
};

// An Effect depending on query runs after each committed query change.
// For expensive external work, this frequency may need to be considered as part of the performance design.

// ---------------------------------------------------------------------
// 19. Debouncing can reduce external synchronization frequency
// ---------------------------------------------------------------------

const DebouncedSearch: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery === "") {
      return;
    }

    console.log("Perform expensive search for:", debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// Debouncing delays synchronization until the input has remained unchanged for the configured interval.
// The first Effect still runs for each query change, but the expensive operation is driven by debouncedQuery.

// ---------------------------------------------------------------------
// 20. Avoid doing expensive work in cleanup unnecessarily
// ---------------------------------------------------------------------

const ResourceEffect: FC = (): ReactElement => {
  const [resourceId, setResourceId] = useState("one");

  useEffect(() => {
    console.log("Acquire resource:", resourceId);

    return () => {
      console.log("Release resource:", resourceId);
    };
  }, [resourceId]);

  return (
    <button type="button" onClick={() => setResourceId((value) => (value === "one" ? "two" : "one"))}>
      Resource: {resourceId}
    </button>
  );
};

// Cleanup is necessary when a resource must be released.
// The performance goal is not to avoid cleanup but to avoid unnecessary resource lifecycles.

// ---------------------------------------------------------------------
// 21. Effects that subscribe should subscribe to the correct source
// ---------------------------------------------------------------------

interface Message {
  readonly id: number;
  readonly text: string;
}

const MessageSubscription: FC = (): ReactElement => {
  const [messages, setMessages] = useState<readonly Message[]>([]);

  useEffect(() => {
    const handleMessage = (event: Event): void => {
      const customEvent = event as CustomEvent<Message>;

      setMessages((current) => [...current, customEvent.detail]);
    };

    window.addEventListener("example-message", handleMessage);

    return () => {
      window.removeEventListener("example-message", handleMessage);
    };
  }, []);

  return <p>Messages received: {messages.length}</p>;
};

// The subscription is created once for the lifetime of the component.
// Functional state updates allow the event handler to append to the latest state without depending on messages.

// ---------------------------------------------------------------------
// 22. Avoid stale state dependencies when only updating state
// ---------------------------------------------------------------------

const FunctionalStateUpdate: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCount((current) => current + 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return <p>Count: {count}</p>;
};

// The functional updater reads the latest state value when the update occurs.
// The Effect does not need to restart its timer every time count changes.

// ---------------------------------------------------------------------
// 23. Recreating timers can create unnecessary work
// ---------------------------------------------------------------------

const RestartingTimer: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      console.log("Timer completed");
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Restart timer: {count}
    </button>
  );
};

// Every count change cleans up the existing timer and creates another one.
// Whether this is correct depends on the intended synchronization semantics.

// ---------------------------------------------------------------------
// 24. Keep expensive work outside unrelated Effects
// ---------------------------------------------------------------------

const SeparateEffects: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    console.log("Connect to room:", roomId);
  }, [roomId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <section>
      <button type="button" onClick={() => setRoomId((value) => (value === "main" ? "support" : "main"))}>
        Room: {roomId}
      </button>

      <button type="button" onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}>
        Theme: {theme}
      </button>
    </section>
  );
};

// Independent synchronization processes should have independent dependencies.
// Changing the theme does not need to recreate the room connection, and changing the room does not need to update the theme.

// ---------------------------------------------------------------------
// 25. Measure Effect duration directly
// ---------------------------------------------------------------------

const MeasuredExpensiveEffect: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();

    for (let index = 0; index < 1_000_000; index += 1) {
      Math.sqrt(index + value);
    }

    const elapsed = performance.now() - start;

    console.log(`Effect duration: ${elapsed.toFixed(2)} ms`);
  }, [value]);

  return (
    <button type="button" onClick={() => setValue((current) => current + 1)}>
      Value: {value}
    </button>
  );
};

// performance.now measures the JavaScript execution inside the measured section.
// It does not measure the complete React render, commit, browser paint, network latency, or other external work.

// ---------------------------------------------------------------------
// 26. Measure frequency as well as duration
// ---------------------------------------------------------------------

const MeasuredEffectFrequency: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.count("Measured Effect execution");
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// An Effect can be expensive because each execution is slow, because it executes too often,
// or because both conditions occur at the same time.

// ---------------------------------------------------------------------
// 27. Strict Mode can expose incorrect Effect cleanup
// ---------------------------------------------------------------------

const StrictModeCleanup: FC = (): ReactElement => {
  useEffect(() => {
    console.log("Setup");

    return () => {
      console.log("Cleanup");
    };
  }, []);

  return <p>Observe setup and cleanup in development.</p>;
};

// In development Strict Mode, React can perform an additional setup-and-cleanup cycle.
// Effects should therefore correctly undo the work performed by their setup.

// ---------------------------------------------------------------------
// 28. Avoid Effect-driven update loops
// ---------------------------------------------------------------------

const ControlledEffectUpdate: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value < 3) {
      setValue((current) => current + 1);
    }
  }, [value]);

  return <p>Value: {value}</p>;
};

// An Effect that updates one of its own dependencies can repeatedly trigger more renders.
// A terminating condition is required if such a synchronization pattern is intentional.

// ---------------------------------------------------------------------
// 29. Separate expensive JavaScript from external synchronization
// ---------------------------------------------------------------------

const ProcessedDataEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const processedResults = useMemo(() => {
    return expensiveFilter(query);
  }, [query]);

  useEffect(() => {
    console.log("Synchronizing result count:", processedResults.length);
  }, [processedResults.length]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <p>Matches: {processedResults.length}</p>
    </section>
  );
};

// The expensive calculation produces data needed for rendering.
// The Effect handles a separate synchronization concern and depends only on the result count it uses.

// ---------------------------------------------------------------------
// 30. Do not assume useMemo fixes an expensive Effect
// ---------------------------------------------------------------------

const MemoizedInputButExpensiveEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  useEffect(() => {
    const start = performance.now();

    for (let index = 0; index < 1_000_000; index += 1) {
      Math.sqrt(index);
    }

    console.log(`Synchronization for "${normalizedQuery}": ${(performance.now() - start).toFixed(2)} ms`);
  }, [normalizedQuery]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>
    </section>
  );
};

// useMemo can prevent the normalized value from being recalculated unnecessarily,
// but it does not reduce the cost of the Effect when normalizedQuery actually changes.

// ---------------------------------------------------------------------
// 31. Optimize the source of repeated work
// ---------------------------------------------------------------------

const BetterSearchEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      return;
    }

    console.log("Perform expensive synchronization:", debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// Reducing how often expensive synchronization starts can matter more than optimizing the
// JavaScript inside the Effect itself.

// ---------------------------------------------------------------------
// 32. Integrated example
// ---------------------------------------------------------------------

const ExpensiveEffectsDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery)).slice(0, 50);
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      return;
    }

    const start = performance.now();

    console.log("Synchronizing search:", debouncedQuery);
    console.log("Visible result count:", visibleProducts.length);

    console.log(`Synchronization setup: ${(performance.now() - start).toFixed(2)} ms`);
  }, [debouncedQuery, visibleProducts.length]);

  useEffect(() => {
    if (selectedId === null) {
      return;
    }

    console.log("Synchronizing selected product:", selectedId);
  }, [selectedId]);

  return (
    <main>
      <h1>Expensive Effects</h1>

      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {visibleProducts.length}</p>

      <ul>
        {visibleProducts.map((product) => (
          <li key={product.id}>
            <button type="button" onClick={() => setSelectedId(product.id)}>
              {product.name}
            </button>
          </li>
        ))}
      </ul>

      <p>Selected: {selectedId === null ? "None" : (products[selectedId - 1]?.name ?? "Unknown")}</p>
    </main>
  );
};

export default ExpensiveEffectsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Expensive Effects can hurt performance through high execution cost, high execution frequency, or both.
// - Effect setup and cleanup are both forms of work that should be considered when measuring performance.
// - Unstable object and function dependencies can cause Effects to rerun more often than intended.
// - Depend on the specific values an Effect actually uses instead of broad objects when possible.
// - Objects and functions used only by an Effect can often be created inside that Effect.
// - Effects that synchronize external resources should have dependencies that match the lifetime of those resources.
// - Cleanup is necessary for subscriptions, timers, connections, requests, and other resources that must be stopped.
// - Cleanup should not be removed merely to reduce performance cost; unnecessary resource lifecycles should instead be avoided.
// - Derived values should normally be calculated during rendering rather than stored through Effect-driven state updates.
// - Expensive render calculations and external synchronization are separate performance concerns.
// - useMemo can avoid repeating an expensive calculation when its dependencies remain unchanged.
// - useMemo does not make an Effect cheaper when the Effect itself is the expensive operation.
// - Frequent input changes can cause frequent synchronization when an Effect depends directly on the input value.
// - Debouncing can reduce how often an expensive external operation is started when intermediate values are not useful.
// - Functional state updates can allow long-lived Effects to update current state without depending on that state value.
// - Separate independent synchronization processes into separate Effects with focused dependency lists.
// - An Effect that updates one of its own dependencies can create repeated renders and potentially an update loop.
// - Development Strict Mode can perform additional setup and cleanup cycles to expose Effect synchronization problems.
// - performance.now can measure JavaScript execution time inside an Effect, but it does not measure complete browser or React performance.
// - Measure both Effect duration and Effect frequency when diagnosing an Effect-related bottleneck.
// - Optimize the source and frequency of expensive synchronization as well as the work performed by the Effect itself.

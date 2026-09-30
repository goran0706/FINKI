/**
 * Effect Performance
 * ===================
 *
 * Effects synchronize a component with systems outside React, such as browser APIs, subscriptions,
 * timers, or network connections. Poorly designed Effects can add unnecessary work, repeat expensive
 * operations, trigger extra renders, or create synchronization loops.
 */

import { useEffect, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Effects run after rendering
// ---------------------------------------------------------------------

const BasicEffect: FC = (): ReactElement => {
  useEffect(() => {
    console.log("Effect ran");
  });

  return <p>Open the console to observe the Effect.</p>;
};

// Without a dependency array, the Effect setup runs after every committed render.
// If the Effect performs expensive work, frequent renders can make that work expensive.

// ---------------------------------------------------------------------
// 2. Dependencies control when an Effect synchronizes
// ---------------------------------------------------------------------

const DependencyEffect: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Count changed:", count);
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// The Effect runs after the initial commit and when count changes.
// React compares dependency values between renders to determine whether the Effect needs to synchronize again.

// ---------------------------------------------------------------------
// 3. An empty dependency array does not mean "never runs"
// ---------------------------------------------------------------------

const MountEffect: FC = (): ReactElement => {
  useEffect(() => {
    console.log("Effect ran after the component mounted");
  }, []);

  return <p>Mount synchronization example.</p>;
};

// With an empty dependency array, the Effect does not rerun because of subsequent dependency changes.
// The setup still runs after the initial commit, subject to React's development behavior such as Strict Mode.

// ---------------------------------------------------------------------
// 4. Avoid Effects for values that can be calculated during rendering
// ---------------------------------------------------------------------

const DerivedValueWithEffect: FC = (): ReactElement => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return (
    <section>
      <p>{fullName}</p>

      <button type="button" onClick={() => setFirstName("Jane")}>
        Change first name
      </button>
    </section>
  );
};

// fullName is completely determined by firstName and lastName.
// Storing and synchronizing this derived value with an Effect introduces another state update
// and an additional render cycle.

// ---------------------------------------------------------------------
// 5. Calculate derived values during rendering instead
// ---------------------------------------------------------------------

const DerivedValueDuringRender: FC = (): ReactElement => {
  const [firstName, setFirstName] = useState("John");
  const [lastName] = useState("Doe");

  const fullName = `${firstName} ${lastName}`;

  return (
    <section>
      <p>{fullName}</p>

      <button type="button" onClick={() => setFirstName("Jane")}>
        Change first name
      </button>
    </section>
  );
};

// A value that can be calculated directly from current props and state does not need an Effect.
// Removing unnecessary Effects eliminates synchronization work and the state updates they may cause.

// ---------------------------------------------------------------------
// 6. Effects that update state can cause additional renders
// ---------------------------------------------------------------------

const EffectDrivenState: FC = (): ReactElement => {
  const [value, setValue] = useState(0);
  const [double, setDouble] = useState(0);

  useEffect(() => {
    setDouble(value * 2);
  }, [value]);

  return (
    <section>
      <p>Value: {value}</p>
      <p>Double: {double}</p>

      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// Updating state from an Effect schedules another render.
// If the second state value is derived from the first, calculating it during rendering is usually simpler and cheaper.

// ---------------------------------------------------------------------
// 7. Expensive Effect work can repeat frequently
// ---------------------------------------------------------------------

const ExpensiveEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();

    console.log("Performing expensive synchronization:", normalizedQuery);
  }, [query]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />;
};

// Every query change causes the Effect to run again.
// If synchronization is expensive, frequent state changes can make the interaction expensive.

// ---------------------------------------------------------------------
// 8. Keep Effect dependencies as narrow as possible
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
};

const NarrowDependencyEffect: FC = (): ReactElement => {
  useEffect(() => {
    console.log("Synchronizing user:", user.id);
  }, [user.id]);

  return <p>{user.name}</p>;
};

// If an Effect only needs user.id, depending on user.id expresses the actual synchronization requirement.
// Narrow dependencies can prevent unnecessary Effect reruns when unrelated properties change.

// ---------------------------------------------------------------------
// 9. Object dependencies can change by reference
// ---------------------------------------------------------------------

const ObjectDependencyEffect: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const options = {
    mode: "compact",
  };

  useEffect(() => {
    console.log("Options changed");
  }, [options]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// options is recreated on every render.
// Its reference changes even though its contents are identical, so the Effect can rerun after every render.

// ---------------------------------------------------------------------
// 10. Depend on primitive values when possible
// ---------------------------------------------------------------------

const PrimitiveDependencyEffect: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const mode = "compact";

  useEffect(() => {
    console.log("Mode changed:", mode);
  }, [mode]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// mode remains the same primitive value across renders.
// The Effect does not rerun merely because the component rendered again.

// ---------------------------------------------------------------------
// 11. Move object creation into the Effect when appropriate
// ---------------------------------------------------------------------

const EffectLocalObject: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");

  useEffect(() => {
    const options = {
      roomId,
    };

    console.log("Connecting with:", options);
  }, [roomId]);

  return (
    <button type="button" onClick={() => setRoomId("support")}>
      Room: {roomId}
    </button>
  );
};

// If an object exists only to configure an Effect, creating it inside the Effect can avoid
// making the object itself an unstable dependency.

// ---------------------------------------------------------------------
// 12. useMemo can stabilize object identity when needed
// ---------------------------------------------------------------------

const MemoizedOptionsEffect: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");
  const [count, setCount] = useState(0);

  const options = useMemo(
    () => ({
      roomId,
      mode: "compact",
    }),
    [roomId],
  );

  useEffect(() => {
    console.log("Synchronizing with:", options);
  }, [options]);

  return (
    <section>
      <p>Room: {roomId}</p>

      <button type="button" onClick={() => setRoomId("support")}>
        Change room
      </button>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>
    </section>
  );
};

// useMemo keeps the options reference stable when roomId does not change.
// This can prevent an Effect from rerunning because of an object dependency whose contents are unchanged.

// ---------------------------------------------------------------------
// 13. Function dependencies can also cause repeated Effects
// ---------------------------------------------------------------------

const FunctionDependencyEffect: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const getMessage = (): string => {
    return `Count: ${count}`;
  };

  useEffect(() => {
    console.log(getMessage());
  }, [getMessage]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      {count}
    </button>
  );
};

// getMessage is recreated on every render.
// Its reference therefore changes, causing the Effect to rerun after every committed render.

// ---------------------------------------------------------------------
// 14. Move Effect-specific functions inside the Effect
// ---------------------------------------------------------------------

const LocalEffectFunction: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getMessage = (): string => {
      return `Count: ${count}`;
    };

    console.log(getMessage());
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      {count}
    </button>
  );
};

// When a function is only needed by one Effect, defining it inside that Effect removes
// the function reference from the component's dependency-management problem.

// ---------------------------------------------------------------------
// 15. Cleanup prevents unnecessary ongoing work
// ---------------------------------------------------------------------

const SubscriptionEffect: FC = (): ReactElement => {
  useEffect(() => {
    const handleOnline = (): void => {
      console.log("Browser is online");
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return <p>Online-status subscription is active.</p>;
};

// Cleanup removes the subscription when the Effect is replaced or the component unmounts.
// Without cleanup, subscriptions can accumulate and continue doing work after they are no longer needed.

// ---------------------------------------------------------------------
// 16. Timers also require cleanup
// ---------------------------------------------------------------------

const TimerEffect: FC = (): ReactElement => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((value) => value + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return <p>Elapsed seconds: {seconds}</p>;
};

// Cleanup stops the timer when the Effect is no longer active.
// Without cleanup, old timers can continue scheduling state updates and consume resources.

// ---------------------------------------------------------------------
// 17. Recreating subscriptions unnecessarily adds work
// ---------------------------------------------------------------------

const SubscriptionByRoom: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Subscribe to room:", roomId);

    return () => {
      console.log("Unsubscribe from room:", roomId);
    };
  }, [roomId]);

  return (
    <section>
      <p>Room: {roomId}</p>

      <button type="button" onClick={() => setRoomId("support")}>
        Change room
      </button>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>
    </section>
  );
};

// The subscription is recreated only when roomId changes.
// The unrelated count does not cause the Effect to clean up and resubscribe.

// ---------------------------------------------------------------------
// 18. Avoid Effects that respond to every render unnecessarily
// ---------------------------------------------------------------------

const UnnecessaryRenderEffect: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Render-driven Effect work");
  });

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// This Effect runs after every committed render.
// If the work does not represent synchronization with an external system, it may not belong in an Effect.

// ---------------------------------------------------------------------
// 19. Effects should synchronize with external systems
// ---------------------------------------------------------------------

const ExternalSystemEffect: FC = (): ReactElement => {
  const [title, setTitle] = useState("Example");

  useEffect(() => {
    document.title = title;
  }, [title]);

  return <input value={title} onChange={(event) => setTitle(event.target.value)} />;
};

// document.title is an external browser system.
// The Effect is appropriate because React state is being synchronized with something outside React's rendering model.

// ---------------------------------------------------------------------
// 20. Avoid unnecessary Effects for event-specific logic
// ---------------------------------------------------------------------

const EventDrivenAction: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving user data");
  };

  return (
    <button type="button" onClick={handleSave}>
      Save
    </button>
  );
};

// An action that occurs because the user clicked a button can usually be performed directly
// in the event handler rather than setting state and waiting for an Effect to react to that state.

// ---------------------------------------------------------------------
// 21. Effect chains can multiply work
// ---------------------------------------------------------------------

const EffectChain: FC = (): ReactElement => {
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [third, setThird] = useState(0);

  useEffect(() => {
    setSecond(first + 1);
  }, [first]);

  useEffect(() => {
    setThird(second + 1);
  }, [second]);

  return (
    <section>
      <p>
        {first} → {second} → {third}
      </p>

      <button type="button" onClick={() => setFirst((value) => value + 1)}>
        Start chain
      </button>
    </section>
  );
};

// Chaining Effects through state creates multiple synchronization steps and additional renders.
// When values are purely derived from one another, calculate them directly instead.

// ---------------------------------------------------------------------
// 22. Calculate related values together
// ---------------------------------------------------------------------

const DirectDerivedValues: FC = (): ReactElement => {
  const [first, setFirst] = useState(0);

  const second = first + 1;
  const third = second + 1;

  return (
    <section>
      <p>
        {first} → {second} → {third}
      </p>

      <button type="button" onClick={() => setFirst((value) => value + 1)}>
        Update
      </button>
    </section>
  );
};

// Direct derivation avoids the intermediate Effect-driven updates.
// The rendered values always correspond to the same current state.

// ---------------------------------------------------------------------
// 23. Separate expensive computation from synchronization
// ---------------------------------------------------------------------

const ExpensiveCalculationEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return Array.from({ length: 5000 }, (_, index) => `Result ${index + 1}`).filter((value) =>
      value.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  useEffect(() => {
    console.log("Synchronizing result count:", results.length);
  }, [results.length]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search results" />
      <p>Matches: {results.length}</p>
    </section>
  );
};

// The calculation belongs in rendering and can be memoized when its cost justifies it.
// The Effect is reserved for the separate external synchronization step.

// ---------------------------------------------------------------------
// 24. Avoid putting derived collections into state
// ---------------------------------------------------------------------

const DerivedCollection: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter items" />

      <p>Matches: {results.length}</p>
    </section>
  );
};

// results is derived from items and query.
// Keeping it as state synchronized by an Effect would introduce another update path without adding information.

// ---------------------------------------------------------------------
// 25. Dependency changes can be caused by parent-created values
// ---------------------------------------------------------------------

interface SearchOptions {
  readonly query: string;
}

interface SearchProps {
  readonly options: SearchOptions;
}

const SearchComponent: FC<SearchProps> = ({ options }): ReactElement => {
  useEffect(() => {
    console.log("Synchronizing search:", options.query);
  }, [options.query]);

  return <p>Query: {options.query}</p>;
};

// Depending on the primitive value actually used by the Effect can avoid reruns caused by
// an options object whose reference changes even though its relevant query remains the same.

// ---------------------------------------------------------------------
// 26. Cleanup and setup can become expensive
// ---------------------------------------------------------------------

const ExpensiveSubscription: FC = (): ReactElement => {
  const [roomId, setRoomId] = useState("main");

  useEffect(() => {
    console.log("Opening expensive connection:", roomId);

    return () => {
      console.log("Closing expensive connection:", roomId);
    };
  }, [roomId]);

  return (
    <button type="button" onClick={() => setRoomId((current) => (current === "main" ? "support" : "main"))}>
      Room: {roomId}
    </button>
  );
};

// When setup and cleanup are expensive, unnecessary dependency changes become more significant.
// The dependency list should represent the values that actually determine the external synchronization.

// ---------------------------------------------------------------------
// 27. Strict Mode can expose Effect cleanup problems during development
// ---------------------------------------------------------------------

const StrictModeEffect: FC = (): ReactElement => {
  useEffect(() => {
    console.log("Effect setup");

    return () => {
      console.log("Effect cleanup");
    };
  }, []);

  return <p>Inspect setup and cleanup in development.</p>;
};

// In development Strict Mode, React may run an additional setup-and-cleanup cycle to help reveal
// Effects that are not correctly resilient to being started and stopped.
// This development behavior is not itself a production performance problem.

// ---------------------------------------------------------------------
// 28. Avoid state-update loops
// ---------------------------------------------------------------------

const SafeEffect: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value < 5) {
      setValue((current) => current + 1);
    }
  }, [value]);

  return <p>Value: {value}</p>;
};

// This Effect deliberately stops updating once the condition is false.
// An Effect that updates one of its own dependencies without a terminating condition can cause repeated renders
// and may lead to an infinite update loop.

// ---------------------------------------------------------------------
// 29. Effects can be more expensive than the work they replace
// ---------------------------------------------------------------------

const SimpleCalculation: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  const doubled = value * 2;

  return (
    <button type="button" onClick={() => setValue((current) => current + 1)}>
      {doubled}
    </button>
  );
};

// A simple synchronous calculation is usually cheaper than storing the result in state
// and using an Effect to synchronize that state after rendering.

// ---------------------------------------------------------------------
// 30. Measure before optimizing Effects
// ---------------------------------------------------------------------

const MeasuredEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const start = performance.now();

    const normalizedQuery = query.trim().toLowerCase();
    console.log("Synchronizing:", normalizedQuery);

    const elapsed = performance.now() - start;
    console.log(`Effect work: ${elapsed.toFixed(2)} ms`);
  }, [query]);

  return (
    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Measure synchronization" />
  );
};

// performance.now can reveal how much JavaScript time an Effect's own work consumes.
// It does not measure all rendering or browser work caused by the update.

// ---------------------------------------------------------------------
// 31. Measure render work separately from Effect work
// ---------------------------------------------------------------------

const MeasuredRenderAndEffect: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const renderStart = performance.now();

  const visibleQuery = query.trim();

  const renderElapsed = performance.now() - renderStart;

  useEffect(() => {
    const effectStart = performance.now();

    console.log("Effect synchronization:", visibleQuery);

    const effectElapsed = performance.now() - effectStart;
    console.log(`Effect work: ${effectElapsed.toFixed(2)} ms`);
  }, [visibleQuery]);

  console.log(`Render calculation: ${renderElapsed.toFixed(2)} ms`);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Measure" />;
};

// Rendering calculations and Effect synchronization happen at different phases.
// Measuring them separately makes it easier to identify where the actual work is occurring.

// ---------------------------------------------------------------------
// 32. Integrated example
// ---------------------------------------------------------------------

interface SearchResult {
  readonly id: number;
  readonly name: string;
}

const searchResults: readonly SearchResult[] = Array.from({ length: 5000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
}));

const EffectPerformanceDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === "") {
      return searchResults.slice(0, 50);
    }

    return searchResults.filter((result) => result.name.toLowerCase().includes(normalizedQuery)).slice(0, 50);
  }, [query]);

  useEffect(() => {
    document.title = query === "" ? "Product Search" : `Search: ${query}`;
  }, [query]);

  useEffect(() => {
    if (selectedId === null) {
      return;
    }

    console.log("Selected product changed:", selectedId);
  }, [selectedId]);

  return (
    <main>
      <h1>Effect Performance</h1>

      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Showing {filteredResults.length} results</p>

      <ul>
        {filteredResults.map((result) => (
          <li key={result.id}>
            <button type="button" onClick={() => setSelectedId(result.id)}>
              {result.name}
            </button>
          </li>
        ))}
      </ul>

      <p>Selected: {selectedId === null ? "None" : (searchResults[selectedId - 1]?.name ?? "Unknown")}</p>
    </main>
  );
};

export default EffectPerformanceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Effects are for synchronizing React with external systems.
// - An Effect without dependencies runs after every committed render.
// - An Effect with dependencies reruns when its dependency values change.
// - An empty dependency array runs the Effect after the initial commit and does not respond to later dependency changes.
// - Effects that update state can introduce additional renders.
// - Derived values should usually be calculated during rendering rather than synchronized through Effects.
// - Effect chains can multiply rendering and synchronization work.
// - Narrow dependency lists can prevent unnecessary synchronization when only specific values matter.
// - Object and function dependencies can change identity on every render and cause repeated Effect execution.
// - Creating Effect-specific objects and functions inside the Effect can simplify dependency management.
// - useMemo can stabilize an object reference when that identity is genuinely required by the Effect.
// - Cleanup is necessary for subscriptions, timers, and other resources that must stop when synchronization ends.
// - Unnecessary setup and cleanup cycles can become expensive when external systems are costly to initialize.
// - Effects should not be used as a general mechanism for responding to ordinary user events or deriving state.
// - Expensive calculations and external synchronization should be treated as separate kinds of work.
// - Virtualized rendering, memoization, and other rendering optimizations do not replace correct Effect design.
// - React Strict Mode can perform additional development-only Effect setup and cleanup to expose synchronization bugs.
// - Effects that update their own dependencies without a terminating condition can cause repeated renders or update loops.
// - performance.now can measure JavaScript work inside an Effect, but it does not measure complete browser rendering cost.
// - Rendering work and Effect work occur at different stages and should be measured separately when diagnosing performance.
// - Performance optimizations should be based on measured Effect frequency, setup cost, cleanup cost, and synchronization work.

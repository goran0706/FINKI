/**
 * Transitions for Performance
 * ===========================
 *
 * React Transitions let non-urgent state updates render in the background so more urgent
 * interactions can remain responsive. They are useful when an update is expensive but the
 * user does not need its resulting UI to block immediate interactions.
 */

import { useState, useTransition, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic useTransition syntax
// ---------------------------------------------------------------------

const BasicTransitionExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("overview");

  const selectTab = (nextTab: string): void => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <section>
      <p>Active tab: {tab}</p>
      <p>{isPending ? "Updating..." : "Ready"}</p>
      <button type="button" onClick={() => selectTab("overview")}>
        Overview
      </button>
      <button type="button" onClick={() => selectTab("details")}>
        Details
      </button>
    </section>
  );
};

// useTransition returns:
// - isPending: whether a Transition is currently pending.
// - startTransition: a function used to mark state updates as Transitions.
//
// React can perform the Transition update as non-blocking work.

// ---------------------------------------------------------------------
// 2. A Transition does not delay the action function
// ---------------------------------------------------------------------

const ImmediateActionExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("Initial");

  const handleClick = (): void => {
    console.log("Before transition");

    startTransition(() => {
      console.log("Inside transition");
      setValue("Updated");
    });

    console.log("After transition");
  };

  return (
    <section>
      <p>{value}</p>
      <p>{isPending ? "Transition pending" : "No transition pending"}</p>
      <button type="button" onClick={handleClick}>
        Update
      </button>
    </section>
  );
};

// startTransition executes its callback immediately.
// It does not behave like setTimeout.
// State updates scheduled while the callback executes are marked as Transitions.

// ---------------------------------------------------------------------
// 3. Urgent and non-urgent updates can be separated
// ---------------------------------------------------------------------

const PriorityExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [resultsQuery, setResultsQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextQuery: string): void => {
    setQuery(nextQuery);

    startTransition(() => {
      setResultsQuery(nextQuery);
    });
  };

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => handleChange(event.target.value)} />
      </label>

      <p>Input: {query}</p>
      <p>Results for: {resultsQuery}</p>
      <p>{isPending ? "Updating results..." : "Results ready"}</p>
    </section>
  );
};

// The input state is updated urgently so typing can remain responsive.
// The results state is marked as non-urgent because it can update after the input.
// The two updates represent different priorities even though they happen in the same event.

// ---------------------------------------------------------------------
// 4. Transitions are useful when rendering is expensive
// ---------------------------------------------------------------------

const expensiveItems: readonly string[] = Array.from({ length: 2_000 }, (_, index) => `Item ${index + 1}`);

const ExpensiveList = (query: string): readonly string[] => {
  const normalizedQuery = query.toLowerCase();

  return expensiveItems.filter((item) => {
    return item.toLowerCase().includes(normalizedQuery);
  });
};

const ExpensiveUpdateExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [listQuery, setListQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextQuery: string): void => {
    setQuery(nextQuery);

    startTransition(() => {
      setListQuery(nextQuery);
    });
  };

  const visibleItems = ExpensiveList(listQuery);

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => handleChange(event.target.value)} />
      </label>

      <p>{isPending ? "Updating list..." : "List ready"}</p>
      <p>Matches: {visibleItems.length}</p>
    </section>
  );
};

// The list update may require substantial rendering work.
// Marking the list state update as a Transition lets React treat that work as non-blocking.

// ---------------------------------------------------------------------
// 5. Transitions can be interrupted
// ---------------------------------------------------------------------

const InterruptibleExample: FC = (): ReactElement => {
  const [selection, setSelection] = useState("first");
  const [isPending, startTransition] = useTransition();

  const select = (nextSelection: string): void => {
    startTransition(() => {
      setSelection(nextSelection);
    });
  };

  return (
    <section>
      <p>Selection: {selection}</p>
      <p>{isPending ? "Updating selection..." : "Selection ready"}</p>
      <button type="button" onClick={() => select("first")}>
        First
      </button>
      <button type="button" onClick={() => select("second")}>
        Second
      </button>
      <button type="button" onClick={() => select("third")}>
        Third
      </button>
    </section>
  );
};

// A Transition can be interrupted by another state update.
// React can stop or restart Transition rendering so a newer update can be handled first.

// ---------------------------------------------------------------------
// 6. Transitions do not make JavaScript execution asynchronous
// ---------------------------------------------------------------------

const SynchronousWorkExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(0);

  const handleClick = (): void => {
    startTransition(() => {
      setValue((current) => current + 1);

      for (let index = 0; index < 1_000_000; index += 1) {
        Math.sqrt(index);
      }
    });
  };

  return (
    <section>
      <p>Value: {value}</p>
      <p>{isPending ? "Transition pending" : "Ready"}</p>
      <button type="button" onClick={handleClick}>
        Update
      </button>
    </section>
  );
};

// startTransition does not move arbitrary JavaScript into a background thread.
// The expensive loop above still runs synchronously inside the event handler.
// Transitions prioritize React rendering work; they do not make CPU-heavy JavaScript non-blocking.

// ---------------------------------------------------------------------
// 7. Transitions do not replace optimization
// ---------------------------------------------------------------------

const UnoptimizedTransitionExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [resultsQuery, setResultsQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextQuery: string): void => {
    setQuery(nextQuery);

    startTransition(() => {
      setResultsQuery(nextQuery);
    });
  };

  const results = expensiveItems.filter((item) => {
    return item.toLowerCase().includes(resultsQuery.toLowerCase());
  });

  return (
    <section>
      <input value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Search" />
      <p>{isPending ? "Searching..." : "Ready"}</p>
      <p>Matches: {results.length}</p>
    </section>
  );
};

// The Transition changes the priority of the update.
// It does not reduce the amount of work required to calculate or render results.
// Expensive algorithms and unnecessary rendering should still be optimized independently.

// ---------------------------------------------------------------------
// 8. Transition state should not control a text input
// ---------------------------------------------------------------------

const InputTransitionExample: FC = (): ReactElement => {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextValue: string): void => {
    setValue(nextValue);

    startTransition(() => {
      console.log("Non-urgent work for:", nextValue);
    });
  };

  return (
    <section>
      <input value={value} onChange={(event) => handleChange(event.target.value)} />
      <p>{isPending ? "Processing..." : "Ready"}</p>
    </section>
  );
};

// The controlled input itself is updated outside the Transition.
// React explicitly does not support using Transition updates to control text inputs.
// Keep urgent input state separate from non-urgent derived UI.

// ---------------------------------------------------------------------
// 9. isPending provides immediate transition feedback
// ---------------------------------------------------------------------

const PendingIndicatorExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState("home");

  const navigate = (nextPage: string): void => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <section>
      <nav>
        <button type="button" onClick={() => navigate("home")}>
          Home
        </button>
        <button type="button" onClick={() => navigate("profile")}>
          Profile
        </button>
      </nav>

      {isPending && <p>Loading page...</p>}
      <p>Current page: {page}</p>
    </section>
  );
};

// isPending becomes true while the Transition is pending.
// It can be used to communicate progress without replacing the current UI with an abrupt fallback.

// ---------------------------------------------------------------------
// 10. Keep the current UI visible during a Transition
// ---------------------------------------------------------------------

const ExistingContentExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState("home");

  const navigate = (nextPage: string): void => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <section>
      <button type="button" onClick={() => navigate("home")}>
        Home
      </button>
      <button type="button" onClick={() => navigate("details")}>
        Details
      </button>

      {isPending && <p>Updating...</p>}
      <article>
        <h2>{page}</h2>
        <p>The current content remains available while the Transition is pending.</p>
      </article>
    </section>
  );
};

// A Transition is designed for non-blocking updates.
// This can avoid replacing already-visible content with an unwanted loading state during navigation.

// ---------------------------------------------------------------------
// 11. Transitions can contain multiple state updates
// ---------------------------------------------------------------------

const MultipleUpdatesExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState("1");

  const handleNavigation = (nextPage: string): void => {
    startTransition(() => {
      setPage(nextPage);
      setSelectedId(nextPage === "home" ? "1" : "2");
    });
  };

  return (
    <section>
      <p>Page: {page}</p>
      <p>Selected ID: {selectedId}</p>
      <p>{isPending ? "Transition pending" : "Ready"}</p>

      <button type="button" onClick={() => handleNavigation("home")}>
        Home
      </button>
      <button type="button" onClick={() => handleNavigation("details")}>
        Details
      </button>
    </section>
  );
};

// State updates scheduled synchronously inside startTransition are marked as part of the Transition.
// This allows related non-urgent state changes to be coordinated.

// ---------------------------------------------------------------------
// 12. Standalone startTransition can be used outside components
// ---------------------------------------------------------------------

import { startTransition } from "react";

const StandaloneTransitionExample: FC = (): ReactElement => {
  const [value, setValue] = useState("Initial");

  const handleClick = (): void => {
    startTransition(() => {
      setValue("Updated");
    });
  };

  return (
    <section>
      <p>{value}</p>
      <button type="button" onClick={handleClick}>
        Update
      </button>
    </section>
  );
};

// The standalone startTransition function can mark updates as Transitions without useTransition.
// Unlike useTransition, it does not provide an isPending value.

// ---------------------------------------------------------------------
// 13. useTransition is a Hook and must be called during rendering
// ---------------------------------------------------------------------

const HookUsageExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("Initial");

  const update = (): void => {
    startTransition(() => {
      setValue("Updated");
    });
  };

  return (
    <section>
      <p>{value}</p>
      <p>{isPending ? "Pending" : "Ready"}</p>
      <button type="button" onClick={update}>
        Update
      </button>
    </section>
  );
};

// useTransition must be called at the top level of a component or custom Hook.
// It cannot be called conditionally or from an event handler.

// ---------------------------------------------------------------------
// 14. State updates after an await require another Transition
// ---------------------------------------------------------------------

const AsyncTransitionExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("Idle");

  const handleSave = (): void => {
    startTransition(async () => {
      setStatus("Saving...");

      await Promise.resolve();

      startTransition(() => {
        setStatus("Saved");
      });
    });
  };

  return (
    <section>
      <p>Status: {status}</p>
      <p>{isPending ? "Saving..." : "Ready"}</p>
      <button type="button" onClick={handleSave} disabled={isPending}>
        Save
      </button>
    </section>
  );
};

// React currently requires state updates after an await to be wrapped in another startTransition
// if those updates should also be marked as Transitions.
// This is a current limitation of async Transition scope handling.

// ---------------------------------------------------------------------
// 15. Transitions can be used for navigation-style updates
// ---------------------------------------------------------------------

interface PageProps {
  readonly page: string;
}

const PageContent: FC<PageProps> = ({ page }): ReactElement => {
  return (
    <article>
      <h2>{page}</h2>
      <p>Content for the {page} page.</p>
    </article>
  );
};

const NavigationExample: FC = (): ReactElement => {
  const [page, setPage] = useState("Home");
  const [isPending, startTransition] = useTransition();

  const navigate = (nextPage: string): void => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <section>
      <nav>
        <button type="button" onClick={() => navigate("Home")}>
          Home
        </button>
        <button type="button" onClick={() => navigate("Profile")}>
          Profile
        </button>
        <button type="button" onClick={() => navigate("Settings")}>
          Settings
        </button>
      </nav>

      {isPending && <p>Updating page...</p>}
      <PageContent page={page} />
    </section>
  );
};

// React recommends that Suspense-enabled routers mark navigation updates as Transitions.
// This allows navigation rendering to be interruptible and helps avoid unwanted loading states.

// ---------------------------------------------------------------------
// 16. Transitions work with Suspense-enabled rendering
// ---------------------------------------------------------------------

const SuspenseTransitionExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [section, setSection] = useState("overview");

  const changeSection = (nextSection: string): void => {
    startTransition(() => {
      setSection(nextSection);
    });
  };

  return (
    <section>
      <button type="button" onClick={() => changeSection("overview")}>
        Overview
      </button>
      <button type="button" onClick={() => changeSection("details")}>
        Details
      </button>

      <p>{isPending ? "Updating section..." : "Ready"}</p>
      <p>Section: {section}</p>
    </section>
  );
};

// In a real Suspense-enabled application, a Transition can coordinate navigation or other
// updates that may suspend without immediately hiding already revealed content.
// The Suspense boundary itself is responsible for handling suspended content.

// ---------------------------------------------------------------------
// 17. Transitions are different from useDeferredValue
// ---------------------------------------------------------------------

const DeferredValueComparisonExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextQuery: string): void => {
    setQuery(nextQuery);

    startTransition(() => {
      console.log("Transition update:", nextQuery);
    });
  };

  return (
    <section>
      <input value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Search" />
      <p>{isPending ? "Processing..." : "Ready"}</p>
      <p>Query: {query}</p>
    </section>
  );
};

// useTransition is useful when you control the state setter and want to mark an update as non-urgent.
// useDeferredValue is useful when you want a derived value to lag behind another value.
// They solve related but different prioritization problems.

// ---------------------------------------------------------------------
// 18. Transition updates can be interrupted by urgent updates
// ---------------------------------------------------------------------

const InterruptibleSearchExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [resultsQuery, setResultsQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextQuery: string): void => {
    setQuery(nextQuery);

    startTransition(() => {
      setResultsQuery(nextQuery);
    });
  };

  const resultCount = expensiveItems.filter((item) => {
    return item.toLowerCase().includes(resultsQuery.toLowerCase());
  }).length;

  return (
    <section>
      <input value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Search" />
      <p>Results: {resultCount}</p>
      <p>{isPending ? "Updating results..." : "Results ready"}</p>
    </section>
  );
};

// If another urgent update arrives while the Transition is rendering,
// React can interrupt the Transition work and handle the urgent update first.
// React may then restart the Transition rendering work using the latest state.

// ---------------------------------------------------------------------
// 19. Transition priority does not guarantee faster total work
// ---------------------------------------------------------------------

const TotalWorkExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(0);

  const update = (): void => {
    startTransition(() => {
      setValue((current) => current + 1);
    });
  };

  return (
    <section>
      <p>Value: {value}</p>
      <p>{isPending ? "Transition pending" : "Ready"}</p>
      <button type="button" onClick={update}>
        Update
      </button>
    </section>
  );
};

// A Transition changes scheduling priority; it does not inherently reduce the amount of rendering work.
// If the update is expensive, it may still consume substantial CPU time.
// The benefit is that React can prioritize more urgent work around it.

// ---------------------------------------------------------------------
// 20. Measure Transition performance
// ---------------------------------------------------------------------

const MeasuredTransitionExample: FC = (): ReactElement => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(0);

  const update = (): void => {
    startTransition(() => {
      setValue((current) => current + 1);
    });
  };

  return (
    <section>
      <p>Value: {value}</p>
      <p>{isPending ? "Transition pending" : "Ready"}</p>
      <button type="button" onClick={update}>
        Update
      </button>
    </section>
  );
};

// Transitions should be evaluated using real interactions and representative workloads.
// Browser performance tools and React's performance tooling can show how Transition work
// is scheduled relative to blocking and other work.

// ---------------------------------------------------------------------
// 21. Integrated example
// ---------------------------------------------------------------------

const largeProductList: readonly string[] = Array.from({ length: 5_000 }, (_, index) => `Product ${index + 1}`);

const TransitionPerformanceDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextQuery: string): void => {
    setQuery(nextQuery);

    startTransition(() => {
      setFilterQuery(nextQuery);
    });
  };

  const visibleProducts = largeProductList.filter((product) => {
    return product.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <main>
      <h1>Transitions for Performance</h1>

      <label>
        Search
        <input value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Search products" />
      </label>

      <p>{isPending ? "Updating results..." : "Results ready"}</p>

      <p>
        Showing {visibleProducts.length} of {largeProductList.length} products.
      </p>

      <ul>
        {visibleProducts.slice(0, 20).map((product) => (
          <li key={product}>{product}</li>
        ))}
      </ul>
    </main>
  );
};

export default TransitionPerformanceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - useTransition marks state updates as non-blocking Transition work.
// - useTransition returns an isPending flag and a startTransition function.
// - startTransition executes its callback immediately; it does not delay the callback like setTimeout.
// - State updates scheduled synchronously inside startTransition are marked as Transitions.
// - Transition work can be interrupted by more urgent state updates.
// - Transitions are useful when an update is expensive but does not need to block urgent interactions.
// - Urgent input state should remain outside the Transition when controlling a text input.
// - isPending can provide feedback while Transition work is pending.
// - Transitions do not move JavaScript execution to another thread or automatically reduce CPU work.
// - Transitions change update priority rather than optimizing the underlying algorithm.
// - Multiple synchronous state updates can be marked as part of the same Transition.
// - State updates after an await currently require another startTransition if they should remain part of the Transition.
// - The standalone startTransition function can be used when useTransition is not available.
// - useTransition is a Hook and must be called at the top level of a component or custom Hook.
// - Transitions are useful for navigation and Suspense-enabled updates because they can remain interruptible.
// - useTransition and useDeferredValue address related but different prioritization patterns.
// - Transition performance should be measured with representative workloads rather than assumed.

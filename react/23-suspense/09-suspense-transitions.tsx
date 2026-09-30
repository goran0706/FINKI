/**
 * Suspense Transitions
 * ====================
 *
 * React Transitions mark state updates as non-urgent so React can render the
 * resulting UI in the background without blocking more urgent interactions.
 * When a Transition causes already-visible content to suspend, React can keep
 * that revealed content visible instead of immediately replacing it with the
 * nearest Suspense fallback.
 *
 * `startTransition` marks an update as a Transition but does not expose a
 * pending state. `useTransition` provides the same Transition capability plus
 * an `isPending` flag that can be used to communicate progress to the user.
 *
 * Transitions do not fetch data by themselves, do not make a Promise resolve
 * faster, and cannot be used to control text inputs. Their purpose is to tell
 * React that a state update can be rendered non-blockingly.
 */

import { type FC, type ReactElement, startTransition, Suspense, use, useState, useTransition } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TabData {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface TabContentProps {
  readonly tabPromise: Promise<TabData>;
}

export interface LoadingFallbackProps {
  readonly label: string;
}

export interface TabButtonProps {
  readonly tab: TabData;
  readonly active: boolean;
  readonly pending: boolean;
  readonly onSelect: (tabId: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a Promise whose delay makes Suspense behavior observable.
 *
 * The resulting Promise is created outside the consuming component so its
 * identity remains stable across Suspense render retries.
 */
const createTabResource = (tab: TabData, delay: number): Promise<TabData> => {
  return new Promise<TabData>((resolve): void => {
    window.setTimeout((): void => {
      resolve(tab);
    }, delay);
  });
};

const overviewResource: Promise<TabData> = createTabResource(
  {
    id: "overview",
    title: "Overview",
    description: "Overview content is already available.",
  },
  500,
);

const detailsResource: Promise<TabData> = createTabResource(
  {
    id: "details",
    title: "Details",
    description: "Details content takes longer to become available.",
  },
  1800,
);

const activityResource: Promise<TabData> = createTabResource(
  {
    id: "activity",
    title: "Activity",
    description: "Activity content is loading asynchronously.",
  },
  1400,
);

const tabResources: Record<string, Promise<TabData>> = {
  overview: overviewResource,
  details: detailsResource,
  activity: activityResource,
};

/**
 * Provides the fallback displayed when a Suspense boundary is waiting for
 * content that has not yet resolved.
 */
export const LoadingFallback: FC<LoadingFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Reads tab data with `use()`.
 *
 * If the Promise is still pending, the component suspends and the nearest
 * Suspense boundary controls the visible fallback.
 */
export const TabContent: FC<TabContentProps> = ({ tabPromise }): ReactElement => {
  const tab: TabData = use(tabPromise);

  return (
    <article>
      <h3>{tab.title}</h3>
      <p>{tab.description}</p>
    </article>
  );
};

/**
 * Renders one tab-selection button.
 */
export const TabButton: FC<TabButtonProps> = ({ tab, active, pending, onSelect }): ReactElement => {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      disabled={pending}
      onClick={(): void => {
        onSelect(tab.id);
      }}
    >
      {tab.title}
    </button>
  );
};

/**
 * Demonstrates a normal urgent state update that causes Suspense to show a
 * fallback when the newly selected content suspends.
 *
 * The important distinction is that no Transition is used here.
 */
export const UrgentSuspendingUpdateExample: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <div>
        <button
          type="button"
          onClick={(): void => {
            setSelectedTab("overview");
          }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={(): void => {
            setSelectedTab("details");
          }}
        >
          Details
        </button>
      </div>

      <Suspense fallback={<LoadingFallback label="Loading selected tab..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates `startTransition`.
 *
 * The state update is marked as non-urgent, allowing React to keep already
 * revealed content visible while the new content suspends.
 */
export const StartTransitionExample: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const selectTab = (tabId: string): void => {
    startTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <div>
        <button
          type="button"
          onClick={(): void => {
            selectTab("overview");
          }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={(): void => {
            selectTab("details");
          }}
        >
          Details
        </button>
      </div>

      <Suspense fallback={<LoadingFallback label="Loading selected tab..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the difference between `startTransition` and `useTransition`.
 *
 * `startTransition` marks the update but provides no `isPending` value.
 * `useTransition` provides both the Transition function and its pending state.
 */
export const UseTransitionExample: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isPending, startTabTransition] = useTransition();

  const selectTab = (tabId: string): void => {
    startTabTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <p>{isPending ? "Transition is pending..." : "No transition is pending."}</p>

      <div>
        <button
          type="button"
          disabled={isPending}
          onClick={(): void => {
            selectTab("overview");
          }}
        >
          Overview
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={(): void => {
            selectTab("details");
          }}
        >
          Details
        </button>
      </div>

      <Suspense fallback={<LoadingFallback label="Loading selected tab..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates using `isPending` to provide lightweight progress feedback
 * without replacing the existing content with a full-page loading state.
 */
export const PendingIndicatorExample: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isPending, startTabTransition] = useTransition();

  const selectTab = (tabId: string): void => {
    startTabTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <header>
        <p>
          Current tab: <strong>{selectedTab}</strong>
        </p>

        {isPending ? <p aria-live="polite">Updating content...</p> : null}
      </header>

      <div>
        <button
          type="button"
          onClick={(): void => {
            selectTab("overview");
          }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={(): void => {
            selectTab("activity");
          }}
        >
          Activity
        </button>
      </div>

      <Suspense fallback={<LoadingFallback label="Loading tab content..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that a Transition does not wait for every Suspense boundary.
 *
 * Already revealed content can remain visible while newly rendered content
 * suspends. A nested boundary can still display its own fallback immediately.
 */
export const NestedSuspenseDuringTransitionExample: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isPending, startTabTransition] = useTransition();

  const selectTab = (tabId: string): void => {
    startTabTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <p>{isPending ? "Transition is updating the selected content." : "Content is stable."}</p>

      <div>
        <button
          type="button"
          onClick={(): void => {
            selectTab("details");
          }}
        >
          Show details
        </button>
      </div>

      <article>
        <h3>Already revealed layout</h3>
        <p>This surrounding content does not need to disappear while the new tab is loading.</p>

        <Suspense fallback={<LoadingFallback label="Loading nested content..." />}>
          <TabContent tabPromise={selectedResource} />
        </Suspense>
      </article>
    </section>
  );
};

/**
 * Demonstrates that a Transition does not make a Promise resolve faster.
 *
 * The artificial delay is unchanged. The Transition only changes how React
 * schedules the state update and handles already revealed Suspense content.
 */
export const TransitionDoesNotSpeedUpDataExample: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isPending, startTabTransition] = useTransition();

  const selectTab = (tabId: string): void => {
    startTabTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <p>{isPending ? "React is rendering the transition." : "No transition is pending."}</p>

      <button
        type="button"
        onClick={(): void => {
          selectTab("details");
        }}
      >
        Load delayed details
      </button>

      <Suspense fallback={<LoadingFallback label="Waiting for data..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that text input state should remain an urgent update.
 *
 * Transition updates cannot be used to control text inputs. The input state is
 * therefore updated normally while a separate Transition controls the
 * non-urgent content update.
 */
export const TextInputAndTransitionExample: FC = (): ReactElement => {
  const [query, setQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isPending, startTabTransition] = useTransition();

  const handleTabChange = (tabId: string): void => {
    startTabTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <label>
        Search
        <input
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setQuery(event.target.value);
          }}
        />
      </label>

      <p>
        Query: <strong>{query}</strong>
      </p>

      <button
        type="button"
        onClick={(): void => {
          handleTabChange("details");
        }}
      >
        {isPending ? "Loading details..." : "Show details"}
      </button>

      <Suspense fallback={<LoadingFallback label="Loading details..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates an intentionally simple navigation-like Transition.
 *
 * Navigation is a common place for Transitions because replacing an already
 * revealed screen with a loading fallback can create a disruptive visual
 * jump.
 */
export const NavigationTransitionExample: FC = (): ReactElement => {
  const [page, setPage] = useState<string>("overview");
  const [isPending, startNavigation] = useTransition();

  const navigate = (nextPage: string): void => {
    startNavigation((): void => {
      setPage(nextPage);
    });
  };

  const pageResource: Promise<TabData> = tabResources[page];

  return (
    <section>
      <nav aria-label="Demo navigation">
        <button
          type="button"
          onClick={(): void => {
            navigate("overview");
          }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={(): void => {
            navigate("activity");
          }}
        >
          Activity
        </button>
      </nav>

      <p>{isPending ? "Navigation is pending..." : `Current page: ${page}`}</p>

      <Suspense fallback={<LoadingFallback label="Loading destination..." />}>
        <TabContent tabPromise={pageResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the difference between an urgent update and a Transition.
 *
 * The urgent update is suitable for immediately reflected input state. The
 * Transition is suitable for a more expensive content update that may suspend.
 */
export const UrgentVsNonUrgentExample: FC = (): ReactElement => {
  const [value, setValue] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [isPending, startTabTransition] = useTransition();

  const updateTab = (tabId: string): void => {
    startTabTransition((): void => {
      setSelectedTab(tabId);
    });
  };

  const selectedResource: Promise<TabData> = tabResources[selectedTab];

  return (
    <section>
      <label>
        Urgent input
        <input
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setValue(event.target.value);
          }}
        />
      </label>

      <button
        type="button"
        onClick={(): void => {
          updateTab("details");
        }}
      >
        {isPending ? "Updating..." : "Show non-urgent content"}
      </button>

      <Suspense fallback={<LoadingFallback label="Loading non-urgent content..." />}>
        <TabContent tabPromise={selectedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the common misconception that `startTransition` delays the
 * callback itself.
 *
 * The callback executes immediately. React uses the callback to identify the
 * state updates scheduled during that synchronous execution as Transitions.
 */
export const TransitionCallbackIsImmediateExample: FC = (): ReactElement => {
  const [message, setMessage] = useState<string>("Ready");

  const handleClick = (): void => {
    startTransition((): void => {
      setMessage("Updated inside a Transition");
    });
  };

  return (
    <section>
      <button type="button" onClick={handleClick}>
        Run transition
      </button>

      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseTransitionsDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense Transitions</h1>

      <section>
        <h2>1. Urgent suspending update</h2>
        <UrgentSuspendingUpdateExample />
      </section>

      <section>
        <h2>2. startTransition</h2>
        <StartTransitionExample />
      </section>

      <section>
        <h2>3. useTransition and isPending</h2>
        <UseTransitionExample />
      </section>

      <section>
        <h2>4. Pending progress indicator</h2>
        <PendingIndicatorExample />
      </section>

      <section>
        <h2>5. Nested Suspense during a Transition</h2>
        <NestedSuspenseDuringTransitionExample />
      </section>

      <section>
        <h2>6. Transitions do not speed up data</h2>
        <TransitionDoesNotSpeedUpDataExample />
      </section>

      <section>
        <h2>7. Text input with a separate Transition</h2>
        <TextInputAndTransitionExample />
      </section>

      <section>
        <h2>8. Navigation-like Transition</h2>
        <NavigationTransitionExample />
      </section>

      <section>
        <h2>9. Urgent versus non-urgent updates</h2>
        <UrgentVsNonUrgentExample />
      </section>

      <section>
        <h2>10. Transition callback execution</h2>
        <TransitionCallbackIsImmediateExample />
      </section>
    </main>
  );
};

export default SuspenseTransitionsDemo;

// ---------------------------------------------------------------------
// Summary
// startTransition marks synchronous state updates as non-urgent Transitions.
// useTransition provides both startTransition and an isPending indicator.
// Transitions can keep already revealed Suspense content visible during updates that suspend.
// A Transition does not make asynchronous work resolve faster or fetch data automatically.
// Newly rendered Suspense boundaries can still display their own fallbacks during a Transition.
// Text inputs should remain controlled by urgent state updates rather than Transition updates.
// Transition callbacks execute immediately; React uses them to identify the state updates scheduled inside.
// startTransition can be used outside components, while useTransition is a Hook used inside components.
// ---------------------------------------------------------------------

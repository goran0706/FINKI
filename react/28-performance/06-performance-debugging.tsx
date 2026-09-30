/**
 * Performance Debugging
 * ======================
 *
 * Performance debugging is the process of identifying where an application spends time,
 * determining why that work occurs, and verifying whether a change improves the measured behavior.
 * React performance problems can originate from rendering, state updates, effects, JavaScript work,
 * browser operations, network activity, or interactions between these layers.
 *
 * Effective debugging starts with an observable problem, uses profiling and measurement to isolate
 * the expensive work, and changes one relevant factor at a time before measuring the result again.
 */

import { Profiler, useEffect, useState, type FC, type ProfilerOnRenderCallback, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Start with an observable performance problem
// ---------------------------------------------------------------------

const SlowList: FC = (): ReactElement => {
  const items = Array.from({ length: 2000 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const ObservableProblem: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <SlowList />
    </section>
  );
};

// The first step is to identify what the user actually experiences.
// Examples include delayed input, dropped frames, slow navigation, excessive CPU usage,
// long loading periods, or an interaction that becomes slower as data grows.

// ---------------------------------------------------------------------
// 2. Add logging to understand render frequency
// ---------------------------------------------------------------------

const RenderLogger: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.count("RenderLogger");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// console.count() can quickly reveal how often a component renders during an interaction.
// Render frequency alone does not prove that a performance problem exists.
// It is a debugging signal that should be combined with timing and profiling data.

// ---------------------------------------------------------------------
// 3. Measure an expensive operation directly
// ---------------------------------------------------------------------

const expensiveCalculation = (values: readonly number[]): number => {
  const startTime = performance.now();

  const result = values.reduce((total, value) => {
    let current = value;

    for (let index = 0; index < 5000; index++) {
      current = Math.sqrt(current * current + index);
    }

    return total + current;
  }, 0);

  const duration = performance.now() - startTime;
  console.log(`Calculation: ${duration.toFixed(2)}ms`);

  return result;
};

const CalculationProblem: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const values = Array.from({ length: 100 }, (_, index) => index + 1);
  const result = expensiveCalculation(values);

  return (
    <section>
      <p>Count: {count}</p>
      <p>Result: {result.toFixed(2)}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Direct timing can reveal that a calculation is repeated whenever the component renders.
// This separates the cost of the calculation from the broader cost of rendering the component tree.

// ---------------------------------------------------------------------
// 4. Profile the React subtree
// ---------------------------------------------------------------------

const ProfiledList: FC = (): ReactElement => {
  const items = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const profileRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration): void => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
  });
};

const ReactProfilerDebugging: FC = (): ReactElement => {
  return (
    <Profiler id="ProfiledList" onRender={profileRender}>
      <ProfiledList />
    </Profiler>
  );
};

// The React Profiler provides measurements for the rendering work of the profiled subtree.
// actualDuration describes the work performed for the current commit.
// baseDuration provides an estimate of rendering the subtree without rendering optimizations.

// ---------------------------------------------------------------------
// 5. Identify which component renders
// ---------------------------------------------------------------------

const ChildA: FC = (): ReactElement => {
  console.log("ChildA rendered");

  return <p>Child A</p>;
};

const ChildB: FC = (): ReactElement => {
  console.log("ChildB rendered");

  return <p>Child B</p>;
};

const ComponentTree: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("ComponentTree rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ChildA />
      <ChildB />
    </section>
  );
};

// Component-level logging can reveal which components participate in an update.
// Once the rendering path is known, profiling can determine whether that work is actually expensive.

// ---------------------------------------------------------------------
// 6. Distinguish render frequency from render duration
// ---------------------------------------------------------------------

const FrequentButCheap: FC = (): ReactElement => {
  console.count("FrequentButCheap");

  return <p>Small component</p>;
};

const ExpensiveRender: FC = (): ReactElement => {
  const values = Array.from({ length: 100 }, (_, index) => index + 1);
  const result = expensiveCalculation(values);

  return <p>{result.toFixed(2)}</p>;
};

// A component can render frequently without being expensive.
// Another component may render less frequently but perform substantial work each time.
// Performance debugging should therefore examine both frequency and duration.

// ---------------------------------------------------------------------
// 7. Inspect state ownership
// ---------------------------------------------------------------------

const LocalState: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  return (
    <section>
      <p>Value: {value}</p>
      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

const StateOwner: FC = (): ReactElement => {
  return (
    <main>
      <h1>Application</h1>
      <LocalState />
    </main>
  );
};

// State updates affect the component that owns the state and the rendering work associated with its subtree.
// During debugging, inspect whether frequently changing state is located higher in the tree than necessary.
// State should still be placed according to application requirements; moving it solely for performance
// should follow evidence from profiling.

// ---------------------------------------------------------------------
// 8. Inspect object and function identity
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserCardProps {
  readonly user: User;
  readonly onSelect: () => void;
}

const UserCard: FC<UserCardProps> = ({ user, onSelect }): ReactElement => {
  console.log("UserCard rendered");

  return (
    <article>
      <p>{user.name}</p>
      <button type="button" onClick={onSelect}>
        Select
      </button>
    </article>
  );
};

const IdentityProblem: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const user = { name: "John Doe" };
  const handleSelect = (): void => {
    console.log("Selected");
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <UserCard user={user} onSelect={handleSelect} />
    </section>
  );
};

// Object literals and function declarations inside a component create new references on each render.
// If a memoized child is expected to bail out, these new references can prevent that bailout.
// Reference identity is therefore one possible cause to investigate when profiling shows unnecessary work.

// ---------------------------------------------------------------------
// 9. Inspect effects that run too often
// ---------------------------------------------------------------------

const EffectExample: FC<{ readonly query: string }> = ({ query }): ReactElement => {
  useEffect(() => {
    console.log("Effect ran for query:", query);
  }, [query]);

  return <p>Query: {query}</p>;
};

// An effect runs after the component commits when one of its dependencies has changed.
// During debugging, verify that dependencies represent the values the effect actually uses.
// Avoid removing dependencies simply to reduce effect executions; that can create stale values or incorrect behavior.

// ---------------------------------------------------------------------
// 10. Detect expensive effects
// ---------------------------------------------------------------------

const ExpensiveEffect: FC = (): ReactElement => {
  useEffect(() => {
    const startTime = performance.now();

    for (let index = 0; index < 1000000; index++) {
      Math.sqrt(index);
    }

    const duration = performance.now() - startTime;
    console.log(`Effect work: ${duration.toFixed(2)}ms`);
  }, []);

  return <p>Effect debugging example</p>;
};

// Effects can contain expensive JavaScript work that occurs after rendering.
// When an interaction feels slow, inspect effects as well as render functions.
// An expensive effect can also trigger additional state updates and create more work.

// ---------------------------------------------------------------------
// 11. Detect accidental state-update loops
// ---------------------------------------------------------------------

const ControlledEffect: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value < 3) {
      setValue((current) => current + 1);
    }
  }, [value]);

  return <p>Value: {value}</p>;
};

// State updates inside effects can cause additional renders.
// This example intentionally stops after a small number of updates.
// During debugging, look for effects that update state on every execution without a terminating condition
// or a dependency relationship that makes the effect run more often than intended.

// ---------------------------------------------------------------------
// 12. Use browser performance tools for broader problems
// ---------------------------------------------------------------------

const BrowserPerformanceExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Browser performance</h2>
      <p>Broader browser activity requires browser performance tooling.</p>
    </section>
  );
};

// Browser performance tools can expose JavaScript execution, style calculation, layout, painting,
// network activity, and other browser-level work.
// If React profiling does not explain the observed slowdown, inspect these broader categories.

// ---------------------------------------------------------------------
// 13. Check whether the problem is JavaScript or rendering
// ---------------------------------------------------------------------

const DataProcessingExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const items = Array.from({ length: 5000 }, (_, index) => `Item ${index + 1}`);

  const startTime = performance.now();
  const filteredItems = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  const duration = performance.now() - startTime;

  console.log(`Filtering: ${duration.toFixed(2)}ms`);

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>Matches: {filteredItems.length}</p>
    </section>
  );
};

// Filtering is JavaScript work performed while the component renders.
// If the measurement shows that filtering is expensive, the investigation can focus on the data
// processing rather than assuming that React reconciliation itself is the primary bottleneck.

// ---------------------------------------------------------------------
// 14. Inspect network-related delays separately
// ---------------------------------------------------------------------

const NetworkBoundary: FC = (): ReactElement => {
  return (
    <section>
      <h2>Network boundary</h2>
      <p>Network latency is separate from React rendering cost.</p>
    </section>
  );
};

// A slow network request can make an interface appear slow even when React rendering is inexpensive.
// Network timing should therefore be inspected separately from component rendering.
// Browser network tools and application-level request measurements are useful for this distinction.

// ---------------------------------------------------------------------
// 15. Compare before and after changes
// ---------------------------------------------------------------------

const BeforeAfterExample: FC = (): ReactElement => {
  return (
    <Profiler
      id="BeforeAfter"
      onRender={(id, phase, actualDuration) => {
        console.log({
          id,
          phase,
          actualDuration,
        });
      }}
    >
      <ProfiledList />
    </Profiler>
  );
};

// A performance change should be evaluated against a baseline.
// Measure the same interaction before and after the change so that the comparison answers
// whether the modification affected the behavior being investigated.

// ---------------------------------------------------------------------
// 16. Change one relevant factor at a time
// ---------------------------------------------------------------------

const DebuggingWorkflow: FC = (): ReactElement => {
  return (
    <ol>
      <li>Reproduce the observable problem.</li>
      <li>Measure the affected interaction.</li>
      <li>Identify the expensive component or operation.</li>
      <li>Change one relevant factor.</li>
      <li>Repeat the same measurement.</li>
    </ol>
  );
};

// Changing many unrelated parts of an application at once makes performance improvements difficult to attribute.
// A controlled debugging process produces clearer evidence about which change affected the result.

// ---------------------------------------------------------------------
// 17. Avoid premature memoization
// ---------------------------------------------------------------------

const CandidateForMemoization: FC = (): ReactElement => {
  return (
    <section>
      <h2>Memoization candidate</h2>
      <p>Measure this component before deciding whether memoization is useful.</p>
    </section>
  );
};

// React.memo, useMemo, and useCallback can reduce certain forms of repeated work,
// but each introduces its own comparison or dependency-management considerations.
// Performance debugging should first establish that repeated work is significant and that
// the proposed optimization addresses the measured cause.

// ---------------------------------------------------------------------
// 18. Verify behavior after optimization
// ---------------------------------------------------------------------

const VerificationExample: FC = (): ReactElement => {
  return (
    <Profiler
      id="Verification"
      onRender={(id, phase, actualDuration, baseDuration) => {
        console.log({
          id,
          phase,
          actualDuration,
          baseDuration,
        });
      }}
    >
      <ProfiledList />
    </Profiler>
  );
};

// An optimization is not complete when the code changes.
// Measure the original workflow again and verify that the intended behavior still works.
// Performance and correctness should both be checked after the change.

// ---------------------------------------------------------------------
// 19. Integrated example
// ---------------------------------------------------------------------

const PerformanceDebuggingDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const items = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);

  const filteredItems = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  const handleProfile: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration): void => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
    });
  };

  return (
    <main>
      <h1>Performance debugging</h1>

      <Profiler id="DebuggingDemo" onRender={handleProfile}>
        <section>
          <label>
            Search
            <input value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>

          <p>Matches: {filteredItems.length}</p>

          <ul>
            {filteredItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </Profiler>
    </main>
  );
};

export default PerformanceDebuggingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Performance debugging starts with an observable performance problem.
// - Render frequency and render duration are separate measurements.
// - console.count() can reveal how often a component renders during an interaction.
// - performance.now() can isolate the duration of specific JavaScript work.
// - React Profiler can measure rendering work within a component subtree.
// - State ownership, reference identity, and effect execution are useful areas to inspect.
// - Expensive JavaScript, effects, network requests, and browser work can all contribute to perceived slowness.
// - Browser performance tools provide information beyond React rendering.
// - A baseline makes before-and-after performance comparisons meaningful.
// - Changing one relevant factor at a time makes performance results easier to interpret.
// - Memoization should address measured rendering work rather than being applied solely because a component re-renders.
// - After an optimization, verify both performance behavior and application correctness.

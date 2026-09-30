/**
 * React Profiler
 * ==============
 *
 * React provides the Profiler API for measuring rendering performance of a component subtree.
 * A Profiler can report information about commits, including how long React spent rendering
 * the subtree and why the update occurred.
 *
 * Profiling helps identify expensive rendering work and frequent updates so that performance
 * optimizations can be based on measured behavior rather than assumptions.
 */

import { Profiler, useState, type FC, type ProfilerOnRenderCallback, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic Profiler usage
// ---------------------------------------------------------------------

const ProfiledComponent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Profiled component</h2>
      <p>This subtree is measured by React.</p>
    </section>
  );
};

const BasicProfilerExample: FC = (): ReactElement => {
  return (
    <Profiler id="BasicExample" onRender={() => {}}>
      <ProfiledComponent />
    </Profiler>
  );
};

// Profiler accepts an id and an onRender callback.
// The callback runs after React commits an update for the profiled subtree.
// The Profiler measures the React rendering work associated with that commit.

// ---------------------------------------------------------------------
// 2. The Profiler callback receives timing information
// ---------------------------------------------------------------------

const logProfile: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime): void => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  });
};

const TimingProfilerExample: FC = (): ReactElement => {
  return (
    <Profiler id="TimingExample" onRender={logProfile}>
      <ProfiledComponent />
    </Profiler>
  );
};

// id identifies the Profiler instance.
// phase indicates whether the commit resulted from an initial mount or an update.
// actualDuration measures the time spent rendering the profiled subtree for this commit.
// baseDuration is an estimate of the time needed to render the entire subtree without optimizations.
// startTime and commitTime provide timing information for the render and commit.

// ---------------------------------------------------------------------
// 3. Mount and update phases
// ---------------------------------------------------------------------

const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

const PhaseExample: FC = (): ReactElement => {
  return (
    <Profiler id="Counter" onRender={logProfile}>
      <Counter />
    </Profiler>
  );
};

// The first committed render of Counter reports the "mount" phase.
// Later committed updates to Counter report the "update" phase.
// The phase describes the relationship of the profiled subtree to that Profiler instance.

// ---------------------------------------------------------------------
// 4. actualDuration measures work for the current commit
// ---------------------------------------------------------------------

const ExpensiveList: FC = (): ReactElement => {
  const items = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const ActualDurationExample: FC = (): ReactElement => {
  return (
    <Profiler
      id="ExpensiveList"
      onRender={(id, phase, actualDuration) => {
        console.log(id, phase, actualDuration);
      }}
    >
      <ExpensiveList />
    </Profiler>
  );
};

// actualDuration represents the time React spent rendering the profiled subtree for the commit.
// It is useful for observing how much work a particular update required.

// ---------------------------------------------------------------------
// 5. baseDuration provides a comparison baseline
// ---------------------------------------------------------------------

const MemoizedLikeSubtree: FC = (): ReactElement => {
  return (
    <section>
      <h2>Summary</h2>
      <p>Profile this subtree to observe its rendering cost.</p>
    </section>
  );
};

const BaseDurationExample: FC = (): ReactElement => {
  return (
    <Profiler
      id="Baseline"
      onRender={(id, phase, actualDuration, baseDuration) => {
        console.log({
          id,
          phase,
          actualDuration,
          baseDuration,
        });
      }}
    >
      <MemoizedLikeSubtree />
    </Profiler>
  );
};

// baseDuration estimates how long it would take to render the entire subtree
// without optimizations such as memoization.
// It can be useful for understanding the potential rendering cost of the subtree.

// ---------------------------------------------------------------------
// 6. Profiling a subtree
// ---------------------------------------------------------------------

const Header: FC = (): ReactElement => {
  return <header>Application header</header>;
};

const Content: FC = (): ReactElement => {
  return (
    <section>
      <h2>Content</h2>
      <p>Application content.</p>
    </section>
  );
};

const Footer: FC = (): ReactElement => {
  return <footer>Application footer</footer>;
};

const SubtreeProfilerExample: FC = (): ReactElement => {
  return (
    <Profiler id="ApplicationContent" onRender={logProfile}>
      <Header />
      <Content />
      <Footer />
    </Profiler>
  );
};

// A Profiler measures the component subtree between its opening and closing tags.
// Multiple Profiler components can be used when different parts of an application
// need to be measured independently.

// ---------------------------------------------------------------------
// 7. Profiling different subtrees independently
// ---------------------------------------------------------------------

const IndependentProfiling: FC = (): ReactElement => {
  return (
    <main>
      <Profiler id="Header" onRender={logProfile}>
        <Header />
      </Profiler>

      <Profiler id="Content" onRender={logProfile}>
        <Content />
      </Profiler>
    </main>
  );
};

// Separate Profiler boundaries produce separate measurements.
// This can help determine which part of a larger UI is responsible for rendering work.

// ---------------------------------------------------------------------
// 8. Profiling updates caused by state
// ---------------------------------------------------------------------

const StatefulProfile: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <Profiler id="StatefulProfile" onRender={logProfile}>
      <section>
        <p>Count: {count}</p>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
      </section>
    </Profiler>
  );
};

// When the state update causes the profiled subtree to render and commit,
// the Profiler callback receives information about that commit.
// This makes it possible to observe rendering behavior during real interactions.

// ---------------------------------------------------------------------
// 9. Profiling parent and child work
// ---------------------------------------------------------------------

const Child: FC = (): ReactElement => {
  return <p>Child content.</p>;
};

const Parent: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Child />
    </section>
  );
};

const ParentChildProfilerExample: FC = (): ReactElement => {
  return (
    <Profiler id="ParentTree" onRender={logProfile}>
      <Parent />
    </Profiler>
  );
};

// Profiling a parent subtree includes the rendering work performed within that subtree.
// A Profiler does not replace component-level analysis; it establishes a measurement boundary
// around the complete subtree.

// ---------------------------------------------------------------------
// 10. Nested Profilers
// ---------------------------------------------------------------------

const NestedProfilerExample: FC = (): ReactElement => {
  return (
    <Profiler id="Outer" onRender={logProfile}>
      <Header />

      <Profiler id="InnerContent" onRender={logProfile}>
        <Content />
      </Profiler>

      <Footer />
    </Profiler>
  );
};

// Profilers can be nested.
// The outer Profiler measures its entire subtree, while the inner Profiler separately
// reports measurements for its own subtree.

// ---------------------------------------------------------------------
// 11. Profiler callbacks should stay lightweight
// ---------------------------------------------------------------------

const lightweightProfile: ProfilerOnRenderCallback = (id, phase, actualDuration): void => {
  if (actualDuration > 10) {
    console.log(`${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
  }
};

const LightweightCallbackExample: FC = (): ReactElement => {
  return (
    <Profiler id="MeasuredTree" onRender={lightweightProfile}>
      <ExpensiveList />
    </Profiler>
  );
};

// The callback itself runs as part of the profiling mechanism.
// Avoid performing expensive work inside the callback because the measurement code
// should not become a significant source of application overhead.

// ---------------------------------------------------------------------
// 12. Development profiling and production builds
// ---------------------------------------------------------------------

const ProductionProfilingExample: FC = (): ReactElement => {
  return (
    <Profiler id="ProductionCandidate" onRender={logProfile}>
      <Content />
    </Profiler>
  );
};

// React's profiling behavior depends on the build and runtime configuration.
// Development builds include additional development behavior and overhead,
// while production builds are optimized for deployment.
// When production performance itself is the concern, measurements should represent
// the production configuration as closely as possible.

// ---------------------------------------------------------------------
// 13. Profiling is different from browser performance measurement
// ---------------------------------------------------------------------

const BrowserAndReactMeasurement: FC = (): ReactElement => {
  return (
    <Profiler id="ReactSubtree" onRender={logProfile}>
      <ExpensiveList />
    </Profiler>
  );
};

// React Profiler focuses on React rendering measurements for the profiled subtree.
// Browser performance tools can measure a broader set of activity, including JavaScript execution,
// layout, painting, style calculation, network activity, and user interactions.
// These tools answer different performance questions and can be used together.

// ---------------------------------------------------------------------
// 14. Profiling should focus on real interactions
// ---------------------------------------------------------------------

const SearchExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const items = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`);
  const filteredItems = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <Profiler id="SearchResults" onRender={logProfile}>
      <section>
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <ul>
          {filteredItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </Profiler>
  );
};

// Profiling an actual interaction, such as typing into a search field,
// can reveal how much rendering work occurs for each update.
// This is generally more useful than optimizing based only on static code inspection.

// ---------------------------------------------------------------------
// 15. React DevTools Profiler
// ---------------------------------------------------------------------

const DevToolsExample: FC = (): ReactElement => {
  return (
    <Profiler id="DevToolsExample" onRender={logProfile}>
      <Content />
    </Profiler>
  );
};

// React DevTools provides profiling capabilities for inspecting component rendering behavior.
// The Profiler API is complementary to DevTools: the API exposes measurements programmatically,
// while DevTools provides an interactive interface for inspecting component performance.

// ---------------------------------------------------------------------
// 16. Profiling does not optimize the application
// ---------------------------------------------------------------------

const ProfileOnly: FC = (): ReactElement => {
  return (
    <Profiler id="MeasurementOnly" onRender={logProfile}>
      <Content />
    </Profiler>
  );
};

// Adding a Profiler does not make the profiled subtree faster.
// Its purpose is measurement.
// Once an expensive update is identified, an appropriate optimization can be evaluated
// and measured again to determine whether it actually improved performance.

// ---------------------------------------------------------------------
// 17. Integrated example
// ---------------------------------------------------------------------

const ProfilerDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

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
      <h1>React Profiler</h1>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>

      <Profiler id="DemoSubtree" onRender={handleProfile}>
        <section>
          <h2>Profiled content</h2>
          <p>This subtree is measured whenever it commits.</p>
        </section>
      </Profiler>
    </main>
  );
};

export default ProfilerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The React Profiler API measures rendering behavior for a component subtree.
// - The onRender callback runs after a profiled subtree commits an update.
// - The callback receives the Profiler id, phase, and timing information.
// - The mount phase describes the initial committed render for a Profiler boundary.
// - The update phase describes later committed updates for that boundary.
// - actualDuration measures the rendering work performed for the current commit.
// - baseDuration provides an estimate of rendering the subtree without optimizations.
// - Multiple and nested Profiler boundaries can measure different parts of an application.
// - Profiler callbacks should remain lightweight so measurement overhead stays small.
// - React Profiler measurements and browser performance measurements answer different questions.
// - Profiling identifies performance characteristics but does not optimize the application itself.
// - Performance changes should be measured before and after optimization to verify their effect.

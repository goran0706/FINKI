/**
 * Performance Measurement
 * ========================
 *
 * React performance should be measured with concrete observations rather than assumptions.
 * Different tools measure different layers of an application, including component rendering,
 * JavaScript execution, browser work, and user-visible interaction latency.
 *
 * Performance measurement is useful for establishing a baseline, identifying expensive work,
 * comparing changes, and verifying whether an optimization actually improves the application.
 */

import { Profiler, useState, type FC, type ProfilerOnRenderCallback, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Measure elapsed time with performance.now()
// ---------------------------------------------------------------------

const measureCalculation = (values: readonly number[]): number => {
  const startTime = performance.now();

  const result = values.reduce((total, value) => {
    let current = value;

    for (let index = 0; index < 5000; index++) {
      current = Math.sqrt(current * current + index);
    }

    return total + current;
  }, 0);

  const endTime = performance.now();

  console.log(`Calculation took ${(endTime - startTime).toFixed(2)}ms`);

  return result;
};

// performance.now() returns a high-resolution timestamp suitable for measuring elapsed time.
// Subtracting the starting timestamp from the ending timestamp gives the duration of the operation.
// The measured duration includes the JavaScript work performed between the two timestamps.

// ---------------------------------------------------------------------
// 2. Measure a specific operation
// ---------------------------------------------------------------------

const MeasurementExample: FC = (): ReactElement => {
  const [result, setResult] = useState<number | null>(null);

  const handleMeasure = (): void => {
    const values = Array.from({ length: 100 }, (_, index) => index + 1);
    const startTime = performance.now();
    const calculationResult = values.reduce((total, value) => total + value * value, 0);
    const duration = performance.now() - startTime;

    console.log(`Operation took ${duration.toFixed(2)}ms`);
    setResult(calculationResult);
  };

  return (
    <section>
      <button type="button" onClick={handleMeasure}>
        Measure operation
      </button>
      {result !== null && <p>Result: {result}</p>}
    </section>
  );
};

// Measuring a specific operation isolates the work being investigated.
// The measurement should begin immediately before the relevant operation
// and end immediately after it when the goal is to measure that operation's elapsed time.

// ---------------------------------------------------------------------
// 3. Use Performance Mark and Measure
// ---------------------------------------------------------------------

const runMeasuredOperation = (): void => {
  performance.mark("operation-start");

  for (let index = 0; index < 100000; index++) {
    Math.sqrt(index);
  }

  performance.mark("operation-end");
  performance.measure("measured-operation", "operation-start", "operation-end");

  const [measurement] = performance.getEntriesByName("measured-operation");

  if (measurement) {
    console.log(`Measured operation: ${measurement.duration.toFixed(2)}ms`);
  }

  performance.clearMarks("operation-start");
  performance.clearMarks("operation-end");
  performance.clearMeasures("measured-operation");
};

// Performance marks create named timestamps.
// performance.measure() calculates the duration between named marks.
// Performance entries can then be inspected through the Performance API or browser tooling.

// ---------------------------------------------------------------------
// 4. Measure React rendering with Profiler
// ---------------------------------------------------------------------

const ProfiledList: FC = (): ReactElement => {
  const items = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const ReactMeasurementExample: FC = (): ReactElement => {
  const handleProfile: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration): void => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
    });
  };

  return (
    <Profiler id="ProfiledList" onRender={handleProfile}>
      <ProfiledList />
    </Profiler>
  );
};

// React's Profiler measures React rendering work for the profiled subtree.
// This is different from measuring an arbitrary JavaScript function with performance.now().
// The Profiler is therefore useful when the question is specifically about React rendering.

// ---------------------------------------------------------------------
// 5. Measure render duration across updates
// ---------------------------------------------------------------------

const InteractiveList: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleProfile: ProfilerOnRenderCallback = (id, phase, actualDuration): void => {
    console.log(`${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
  };

  return (
    <Profiler id="InteractiveList" onRender={handleProfile}>
      <section>
        <p>Count: {count}</p>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
        <ProfiledList />
      </section>
    </Profiler>
  );
};

// Profiling an interactive component makes it possible to observe rendering during actual updates.
// Comparing measurements across repeated interactions can reveal whether a particular update
// consistently produces substantial rendering work.

// ---------------------------------------------------------------------
// 6. Measure JavaScript work separately from React work
// ---------------------------------------------------------------------

const JavaScriptWork: FC = (): ReactElement => {
  const [result, setResult] = useState(0);

  const handleCalculate = (): void => {
    const values = Array.from({ length: 1000 }, (_, index) => index + 1);
    const startTime = performance.now();
    const total = values.reduce((sum, value) => sum + Math.sqrt(value), 0);
    const duration = performance.now() - startTime;

    console.log(`JavaScript calculation: ${duration.toFixed(2)}ms`);
    setResult(total);
  };

  return (
    <section>
      <button type="button" onClick={handleCalculate}>
        Calculate
      </button>
      <p>{result.toFixed(2)}</p>
    </section>
  );
};

// performance.now() measures the elapsed time of the JavaScript operation in this example.
// It does not tell us how much of the application's total work came from React rendering.
// Separating these measurements helps identify which layer contains the expensive work.

// ---------------------------------------------------------------------
// 7. Measure repeated operations
// ---------------------------------------------------------------------

const measureRepeatedOperation = (operation: () => void, iterations: number): number => {
  const startTime = performance.now();

  for (let index = 0; index < iterations; index++) {
    operation();
  }

  return performance.now() - startTime;
};

const RepeatedMeasurementExample: FC = (): ReactElement => {
  const duration = measureRepeatedOperation(() => {
    Math.sqrt(12345);
  }, 100000);

  return <p>Measurement: {duration.toFixed(2)}ms</p>;
};

// Repeating an operation can make very small durations easier to observe.
// The result represents the total duration for all iterations, not the duration of one iteration.
// Microbenchmarks should be interpreted carefully because real application behavior is usually more complex.

// ---------------------------------------------------------------------
// 8. Compare two implementations
// ---------------------------------------------------------------------

const calculateWithLoop = (values: readonly number[]): number => {
  let total = 0;

  for (const value of values) {
    total += value * value;
  }

  return total;
};

const calculateWithReduce = (values: readonly number[]): number => {
  return values.reduce((total, value) => total + value * value, 0);
};

const compareCalculations = (): void => {
  const values = Array.from({ length: 100000 }, (_, index) => index + 1);

  const loopStart = performance.now();
  calculateWithLoop(values);
  const loopDuration = performance.now() - loopStart;

  const reduceStart = performance.now();
  calculateWithReduce(values);
  const reduceDuration = performance.now() - reduceStart;

  console.log({
    loopDuration,
    reduceDuration,
  });
};

// Comparing implementations requires measuring the same workload under comparable conditions.
// A single measurement can be noisy, so meaningful comparisons generally require repeated runs
// and representative workloads.

// ---------------------------------------------------------------------
// 9. Browser Performance tools measure more than React
// ---------------------------------------------------------------------

const BrowserMeasurementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Browser measurement</h2>
      <p>Use browser performance tools to inspect broader runtime behavior.</p>
    </section>
  );
};

// Browser performance tools can expose JavaScript execution, style calculation, layout,
// painting, rendering, network activity, and interaction-related timing.
// These measurements complement React-specific profiling rather than replacing it.

// ---------------------------------------------------------------------
// 10. Measure interaction-related work
// ---------------------------------------------------------------------

const SearchInterface: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const handleChange = (value: string): void => {
    const startTime = performance.now();

    setQuery(value);

    const duration = performance.now() - startTime;
    console.log(`Handler execution: ${duration.toFixed(2)}ms`);
  };

  const items = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);
  const filteredItems = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => handleChange(event.target.value)} />
      </label>

      <p>Matches: {filteredItems.length}</p>

      <ul>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

// Measuring the event handler itself does not measure the React update caused by setQuery.
// React state updates are scheduled work, so the handler's elapsed time and the resulting
// render duration are separate measurements.

// ---------------------------------------------------------------------
// 11. Avoid measuring the wrong boundary
// ---------------------------------------------------------------------

const BoundaryExample: FC = (): ReactElement => {
  const startTime = performance.now();

  const items = Array.from({ length: 500 }, (_, index) => index);
  const total = items.reduce((sum, value) => sum + value, 0);

  const duration = performance.now() - startTime;

  console.log(`Calculation and allocation: ${duration.toFixed(2)}ms`);

  return <p>Total: {total}</p>;
};

// The start and end points define what the measurement represents.
// If setup, rendering, logging, or unrelated work is included inside the boundary,
// the resulting duration cannot be interpreted as the cost of the intended operation alone.

// ---------------------------------------------------------------------
// 12. Development measurements can differ from production
// ---------------------------------------------------------------------

const DevelopmentMeasurement: FC = (): ReactElement => {
  return (
    <Profiler
      id="DevelopmentMeasurement"
      onRender={(id, phase, duration) => {
        console.log(`${id} ${phase}: ${duration.toFixed(2)}ms`);
      }}
    >
      <BrowserMeasurementExample />
    </Profiler>
  );
};

// Development builds can include additional checks and development-only behavior.
// Measurements taken during development are therefore not automatically representative
// of production performance.
// Production performance should be measured using an appropriate production build and environment.

// ---------------------------------------------------------------------
// 13. Establish a baseline before optimizing
// ---------------------------------------------------------------------

const BaselineExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <Profiler
      id="Baseline"
      onRender={(id, phase, actualDuration) => {
        console.log({
          id,
          phase,
          actualDuration,
        });
      }}
    >
      <section>
        <p>Count: {count}</p>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Increment
        </button>
        <ProfiledList />
      </section>
    </Profiler>
  );
};

// A baseline records the current behavior before an optimization is introduced.
// Without a baseline, it is difficult to determine whether a later change actually improved performance.

// ---------------------------------------------------------------------
// 14. Measure after optimization
// ---------------------------------------------------------------------

const OptimizedMeasurementExample: FC = (): ReactElement => {
  return (
    <Profiler
      id="AfterOptimization"
      onRender={(id, phase, actualDuration) => {
        console.log(`${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
      }}
    >
      <ProfiledList />
    </Profiler>
  );
};

// After changing an implementation, measure the same workflow again.
// The comparison should use the same or representative workload and the same relevant environment.
// An optimization should be retained because measured behavior improved, not merely because the code looks faster.

// ---------------------------------------------------------------------
// 15. Measurement should use representative workloads
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
}

const ProductList: FC<{ readonly products: readonly Product[] }> = ({ products }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

const RepresentativeWorkload: FC = (): ReactElement => {
  const products: readonly Product[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    name: `Product ${index + 1}`,
  }));

  return (
    <Profiler
      id="ProductList"
      onRender={(id, phase, duration) => {
        console.log(`${id} ${phase}: ${duration.toFixed(2)}ms`);
      }}
    >
      <ProductList products={products} />
    </Profiler>
  );
};

// A benchmark containing ten items may not expose a problem that occurs with ten thousand items.
// Measurements should reflect the application's realistic data sizes and interaction patterns
// whenever the goal is to understand real user-facing performance.

// ---------------------------------------------------------------------
// 16. Avoid relying on a single measurement
// ---------------------------------------------------------------------

const repeatMeasurement = (operation: () => void, iterations: number): readonly number[] => {
  const durations: number[] = [];

  for (let index = 0; index < iterations; index++) {
    const startTime = performance.now();
    operation();
    durations.push(performance.now() - startTime);
  }

  return durations;
};

const RepeatedMeasurements: FC = (): ReactElement => {
  const durations = repeatMeasurement(() => {
    Array.from({ length: 1000 }, (_, index) => index * 2);
  }, 5);

  return <p>Measurements: {durations.map((duration) => duration.toFixed(2)).join(", ")}ms</p>;
};

// Runtime conditions vary between measurements.
// Repeating an operation provides multiple observations rather than treating one timing
// as a definitive representation of performance.

// ---------------------------------------------------------------------
// 17. Measurement tools answer different questions
// ---------------------------------------------------------------------

const MeasurementToolsExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Performance measurement</h2>
      <ul>
        <li>React Profiler: React rendering work.</li>
        <li>Performance API: elapsed time and named performance entries.</li>
        <li>Browser performance tools: broader browser and runtime activity.</li>
      </ul>
    </section>
  );
};

// No single measurement tool explains every performance problem.
// Choosing the measurement boundary according to the question prevents unrelated metrics
// from being interpreted as evidence about the wrong layer.

// ---------------------------------------------------------------------
// 18. Integrated example
// ---------------------------------------------------------------------

const PerformanceMeasurementDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const handleProfile: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration): void => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
    });
  };

  const items = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`);
  const filteredItems = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <main>
      <h1>Performance measurement</h1>

      <Profiler id="SearchResults" onRender={handleProfile}>
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

export default PerformanceMeasurementDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Performance measurement establishes evidence about how an application actually behaves.
// - performance.now() can measure elapsed time for a specific JavaScript operation.
// - Performance marks and measures provide named timing entries for broader analysis.
// - React Profiler measures rendering work within a specific React subtree.
// - Browser performance tools measure broader activity such as JavaScript, layout, painting, and network work.
// - Measuring an event handler does not automatically measure the React update caused by that handler.
// - Measurements should use clear boundaries so the resulting duration represents the intended work.
// - Development and production environments can produce different performance characteristics.
// - A baseline should be established before introducing an optimization.
// - The same representative workflow should be measured again after an optimization.
// - Repeated measurements are more informative than relying on a single timing.
// - Performance optimization should be based on measured behavior rather than assumptions.

/**
 * Expensive Computation
 * =====================
 *
 * An expensive computation is work that consumes noticeable CPU time or performs substantial
 * processing during rendering. In React, expensive calculations can make renders slower, so
 * performance work should first identify the costly operation and then reduce or defer it when appropriate.
 */

import { useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. An expensive computation runs during rendering
// ---------------------------------------------------------------------

const calculateTotal = (items: readonly number[]): number => {
  let total = 0;

  for (let index = 0; index < items.length; index += 1) {
    total += items[index] ?? 0;
  }

  return total;
};

const BasicComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const items = [10, 20, 30, 40, 50];

  const total = calculateTotal(items);

  return (
    <section>
      <p>Total: {total}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// calculateTotal runs every time BasicComputationExample renders.
// If the calculation becomes expensive, unrelated state updates can repeatedly pay its cost.

// ---------------------------------------------------------------------
// 2. Expensive work can involve substantial data processing
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = [
  { id: 1, name: "Keyboard", price: 80 },
  { id: 2, name: "Mouse", price: 40 },
  { id: 3, name: "Monitor", price: 300 },
  { id: 4, name: "Headphones", price: 120 },
  { id: 5, name: "Webcam", price: 90 },
];

const calculateExpensiveTotal = (items: readonly Product[]): number => {
  let total = 0;

  for (let index = 0; index < items.length; index += 1) {
    const product = items[index];

    if (product !== undefined) {
      total += product.price;
    }
  }

  return total;
};

const DataProcessingExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const total = calculateExpensiveTotal(products);

  return (
    <section>
      <p>Product total: ${total}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// A calculation becomes more significant as its input grows or its algorithm becomes more costly.
// The important question is whether the work is actually expensive enough to affect the application.

// ---------------------------------------------------------------------
// 3. Expensive calculations can repeat on unrelated renders
// ---------------------------------------------------------------------

const performExpensiveCalculation = (value: number): number => {
  let result = 0;

  for (let index = 0; index < 5_000_000; index += 1) {
    result += (index * value) % 97;
  }

  return result;
};

const RepeatedComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = performExpensiveCalculation(10);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Changing count causes the component to render again.
// The calculation does not depend on count, but it still runs again because it is part of rendering.

// ---------------------------------------------------------------------
// 4. useMemo can cache an expensive calculation
// ---------------------------------------------------------------------

const MemoizedComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(10);
  }, []);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The calculation is performed when the component needs the memoized value.
// While the dependency list remains unchanged, React can reuse the previously calculated result.
// count can change without requiring this calculation to run again.

// ---------------------------------------------------------------------
// 5. Dependencies determine when the calculation must run again
// ---------------------------------------------------------------------

const DependentComputationExample: FC = (): ReactElement => {
  const [multiplier, setMultiplier] = useState(1);
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(multiplier);
  }, [multiplier]);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Multiplier: {multiplier}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setMultiplier((value) => value + 1)}>
        Change multiplier
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>
    </section>
  );
};

// Changing multiplier invalidates the cached calculation because the result depends on it.
// Changing count does not invalidate the calculation because count is not a dependency.

// ---------------------------------------------------------------------
// 6. useMemo does not make an inherently cheap calculation necessary
// ---------------------------------------------------------------------

const CheapComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = count * 2;

  return (
    <section>
      <p>Doubled: {doubled}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Simple arithmetic is normally inexpensive enough to perform directly.
// Adding useMemo introduces dependency tracking and cache management without solving a meaningful problem.

// ---------------------------------------------------------------------
// 7. Expensive does not mean merely "long-looking" code
// ---------------------------------------------------------------------

const FilterProductsExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>Matches: {filteredProducts.length}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Filtering a small array is usually inexpensive.
// The same operation can become expensive with a large collection, complex predicates,
// repeated transformations, or frequent renders.

// ---------------------------------------------------------------------
// 8. Expensive filtering can be memoized when appropriate
// ---------------------------------------------------------------------

const MemoizedFilterExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return products.filter((product) => {
      return product.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query]);

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>Matches: {filteredProducts.length}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The filtered result depends on query.
// An unrelated count update does not change query, so the cached filtered array can be reused.

// ---------------------------------------------------------------------
// 9. Preserve the calculation's actual dependencies
// ---------------------------------------------------------------------

interface PriceRange {
  readonly minimum: number;
  readonly maximum: number;
}

const PriceFilterExample: FC = (): ReactElement => {
  const [range, setRange] = useState<PriceRange>({
    minimum: 50,
    maximum: 150,
  });
  const [count, setCount] = useState(0);

  const matchingProducts = useMemo(() => {
    return products.filter((product) => {
      return product.price >= range.minimum && product.price <= range.maximum;
    });
  }, [range]);

  return (
    <section>
      <p>Matches: {matchingProducts.length}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setRange({ minimum: 0, maximum: 100 })}>
        Change range
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The calculation reads range, so range belongs in its dependency list.
// If range changes, the calculation runs again because the previous result may no longer be valid.

// ---------------------------------------------------------------------
// 10. Avoid creating unnecessary object dependencies
// ---------------------------------------------------------------------

const ObjectDependencyExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const searchOptions = {
    query,
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return product.name.toLowerCase().includes(searchOptions.query.toLowerCase());
    });
  }, [searchOptions]);

  return (
    <section>
      <p>Matches: {filteredProducts.length}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setQuery("mouse")}>
        Search
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// searchOptions is a new object on every render.
// Its reference therefore changes on every render, causing the useMemo dependency to change.
// The calculation can consequently run again even when query itself has not changed.

// ---------------------------------------------------------------------
// 11. Depend directly on primitive values when possible
// ---------------------------------------------------------------------

const PrimitiveDependencyExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return products.filter((product) => {
      return product.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query]);

  return (
    <section>
      <p>Matches: {filteredProducts.length}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setQuery("mouse")}>
        Search
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// query is a primitive value and directly represents what the calculation needs.
// Depending directly on query avoids an unnecessary object-identity dependency.

// ---------------------------------------------------------------------
// 12. Expensive computations should remain pure
// ---------------------------------------------------------------------

const PureComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(count);
  }, [count]);

  return (
    <section>
      <p>Result: {result}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The calculation reads count and derives a value from it.
// It does not modify state, manipulate the DOM, perform network requests, or produce other side effects.
// Keeping calculations pure makes them safe to rerun when React needs to render again.

// ---------------------------------------------------------------------
// 13. Do not use an expensive calculation to perform side effects
// ---------------------------------------------------------------------

const SideEffectFreeComputationExample: FC = (): ReactElement => {
  const [value, setValue] = useState(10);

  const result = useMemo(() => {
    return value * value;
  }, [value]);

  return (
    <section>
      <p>Result: {result}</p>
      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Change value
      </button>
    </section>
  );
};

// useMemo is for calculating a value.
// Side effects such as network requests, subscriptions, and imperative DOM operations belong
// in the appropriate effect or event-handling mechanism rather than inside the calculation.

// ---------------------------------------------------------------------
// 14. useMemo is not a semantic guarantee
// ---------------------------------------------------------------------

const CacheCaveatExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(10);
  }, []);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Code must remain correct if the calculation runs again.
// useMemo is a performance optimization that lets React reuse a previously calculated value;
// it should not be used to make correctness depend on the cache being preserved.

// ---------------------------------------------------------------------
// 15. Measure before optimizing
// ---------------------------------------------------------------------

const MeasurableComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    const start = performance.now();
    const calculatedValue = performExpensiveCalculation(10);
    const duration = performance.now() - start;

    console.log(`Calculation duration: ${duration.toFixed(2)} ms`);

    return calculatedValue;
  }, []);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// performance.now() can help measure JavaScript execution time.
// In real applications, use representative workloads and profiling tools rather than assuming
// that a calculation is expensive based only on its source code.

// ---------------------------------------------------------------------
// 16. Expensive computation is different from expensive rendering
// ---------------------------------------------------------------------

const RenderingVersusComputationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(10);
  }, []);

  return (
    <section>
      <h2>Computation result</h2>
      <p>{result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The calculation is only one possible source of rendering cost.
// A render can also be expensive because of component work, large lists, reconciliation,
// DOM commits, effects, or other JavaScript executed during the update.

// ---------------------------------------------------------------------
// 17. Memoization does not fix an inefficient algorithm
// ---------------------------------------------------------------------

const inefficientSearch = (items: readonly Product[], query: string): Product[] => {
  const results: Product[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const product = items[index];

    if (product?.name.toLowerCase().includes(query.toLowerCase())) {
      results.push(product);
    }
  }

  return results;
};

const AlgorithmExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return inefficientSearch(products, query);
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      <p>Matches: {results.length}</p>
    </section>
  );
};

// useMemo can avoid repeating the same calculation when dependencies are unchanged.
// It does not improve the algorithm itself.
// Reducing unnecessary work, choosing a better algorithm, reducing input size, and memoizing
// appropriate results are separate optimization strategies.

// ---------------------------------------------------------------------
// 18. Integrated example
// ---------------------------------------------------------------------

const calculateProductSummary = (
  items: readonly Product[],
): {
  total: number;
  average: number;
  count: number;
} => {
  let total = 0;

  for (let index = 0; index < items.length; index += 1) {
    const product = items[index];

    if (product !== undefined) {
      total += product.price;
    }
  }

  return {
    total,
    average: items.length > 0 ? total / items.length : 0,
    count: items.length,
  };
};

const ExpensiveComputationDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const summary = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    const matchingProducts = products.filter((product) => {
      return product.name.toLowerCase().includes(normalizedQuery);
    });

    return calculateProductSummary(matchingProducts);
  }, [query]);

  return (
    <main>
      <h1>Expensive Computation</h1>

      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      </label>

      <p>Matching products: {summary.count}</p>
      <p>Total: ${summary.total.toFixed(2)}</p>
      <p>Average: ${summary.average.toFixed(2)}</p>
      <p>Unrelated count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>
    </main>
  );
};

export default ExpensiveComputationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An expensive computation is work that consumes enough CPU time to affect rendering performance.
// - Calculations performed during rendering run again whenever the component renders unless their work is avoided.
// - Unrelated state updates can therefore repeat expensive calculations.
// - useMemo can cache a calculated value between renders when its dependencies remain unchanged.
// - A dependency change causes the memoized calculation to run again because its previous result may no longer be valid.
// - Dependencies should represent the reactive values that the calculation actually reads.
// - Object and function identity can cause unnecessary dependency changes when those values are recreated during rendering.
// - Depending directly on primitive values can avoid unnecessary identity-based invalidation.
// - Memoized calculations should be pure and should not perform side effects.
// - useMemo caches a value; it does not cache a function's execution in the same sense as useCallback.
// - useMemo does not improve the underlying algorithm or automatically make expensive work inexpensive.
// - Cheap calculations usually do not need memoization.
// - useMemo is a performance optimization, not a semantic guarantee that a cached value will always be retained.
// - Application performance should be measured with representative workloads and appropriate profiling tools.
// - Expensive computation is only one possible source of rendering cost.

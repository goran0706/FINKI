/**
 * Memoization Tradeoffs
 * ======================
 *
 * Memoization can reduce repeated computation or preserve reference identity, but it also introduces
 * dependency tracking, cache management, and additional complexity. Effective memoization depends on
 * whether the saved work is meaningful enough to justify those costs.
 */

import { memo, useCallback, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Memoization is a performance optimization
// ---------------------------------------------------------------------

const BasicMemoizationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  return (
    <section>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// useMemo allows React to reuse the calculated value when count has not changed.
// The purpose is performance, not changing what the component means or how the result is defined.

// ---------------------------------------------------------------------
// 2. Cheap calculations may not benefit from memoization
// ---------------------------------------------------------------------

const CheapCalculationExample: FC = (): ReactElement => {
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

// count * 2 is inexpensive.
// useMemo would add dependency tracking and cache management without avoiding meaningful work.

// ---------------------------------------------------------------------
// 3. Memoization has an overhead
// ---------------------------------------------------------------------

const MemoizationOverheadExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const value = useMemo(() => count + 1, [count]);

  return (
    <section>
      <p>Value: {value}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// React must track the dependency list and manage the memoized value.
// For trivial calculations, that overhead can be unnecessary compared with simply calculating the value.

// ---------------------------------------------------------------------
// 4. Memoization can reduce repeated expensive work
// ---------------------------------------------------------------------

const performExpensiveCalculation = (value: number): number => {
  let result = 0;

  for (let index = 0; index < 5_000_000; index += 1) {
    result += (index * value) % 97;
  }

  return result;
};

const ExpensiveCalculationExample: FC = (): ReactElement => {
  const [value, setValue] = useState(10);
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(value);
  }, [value]);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Change value
      </button>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment count
      </button>
    </section>
  );
};

// The expensive calculation depends on value.
// Changes to count do not invalidate the cached result, so the expensive work can be avoided
// when count changes without changing value.

// ---------------------------------------------------------------------
// 5. Memoization only helps when dependencies remain unchanged
// ---------------------------------------------------------------------

const FrequentlyChangingDependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(count);
  }, [count]);

  return (
    <section>
      <p>Result: {result}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// count changes on every button click.
// Because count is a dependency, the calculation must run again after each change.
// Memoization provides little opportunity to skip the calculation in this particular interaction.

// ---------------------------------------------------------------------
// 6. Stable dependencies provide more opportunity for reuse
// ---------------------------------------------------------------------

const StableDependencyExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(10);
  }, []);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
      <p>Result: {result}</p>
      <p>Query: {query}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// The expensive calculation does not depend on query or count.
// Those state changes can therefore reuse the memoized result.

// ---------------------------------------------------------------------
// 7. Memoization can preserve object identity
// ---------------------------------------------------------------------

interface FilterOptions {
  readonly query: string;
}

const ObjectIdentityExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const options = useMemo<FilterOptions>(() => {
    return { query };
  }, [query]);

  return (
    <section>
      <p>Query: {options.query}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setQuery("keyboard")}>
        Change query
      </button>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// options retains its object reference while query remains unchanged.
// This can matter when the object is passed to a memoized child or used as a dependency.

// ---------------------------------------------------------------------
// 8. Preserving identity is only useful when identity matters
// ---------------------------------------------------------------------

const IdentityWithoutConsumerExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const options = useMemo<FilterOptions>(() => {
    return { query };
  }, [query]);

  return (
    <section>
      <p>{options.query}</p>
      <button type="button" onClick={() => setQuery("keyboard")}>
        Change query
      </button>
    </section>
  );
};

// If no identity-sensitive consumer observes options, preserving its reference may provide little value.
// The fact that an object is recreated does not by itself make the render inefficient.

// ---------------------------------------------------------------------
// 9. Memoized children can make stable object identity useful
// ---------------------------------------------------------------------

interface SearchPanelProps {
  readonly options: FilterOptions;
}

const SearchPanel: FC<SearchPanelProps> = memo(({ options }): ReactElement => {
  console.log("SearchPanel rendered");

  return <p>Searching for: {options.query || "all products"}</p>;
});

const MemoizedChildExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const options = useMemo<FilterOptions>(() => {
    return { query };
  }, [query]);

  return (
    <section>
      <SearchPanel options={options} />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setQuery("keyboard")}>
        Change query
      </button>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// SearchPanel is memoized and receives options by reference.
// When only count changes, the stable options reference can allow SearchPanel to bail out.

// ---------------------------------------------------------------------
// 10. useCallback has similar tradeoffs for function identity
// ---------------------------------------------------------------------

interface ActionProps {
  readonly onAction: () => void;
}

const ActionButton: FC<ActionProps> = memo(({ onAction }): ReactElement => {
  console.log("ActionButton rendered");

  return (
    <button type="button" onClick={onAction}>
      Run action
    </button>
  );
});

const CallbackTradeoffExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  return (
    <section>
      <ActionButton onAction={handleAction} />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// useCallback can preserve the callback reference passed to ActionButton.
// Without a concrete identity-sensitive consumer, however, stabilizing the callback may not provide
// a meaningful performance improvement.

// ---------------------------------------------------------------------
// 11. Memoization adds dependency maintenance
// ---------------------------------------------------------------------

const DependencyMaintenanceExample: FC = (): ReactElement => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");

  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);

  return (
    <section>
      <p>{fullName}</p>
      <button type="button" onClick={() => setFirstName("Jane")}>
        Change first name
      </button>
      <button type="button" onClick={() => setLastName("Smith")}>
        Change last name
      </button>
    </section>
  );
};

// Every reactive value read by the calculation must be represented in its dependency list.
// Adding memoization therefore creates another dependency relationship that must remain correct.

// ---------------------------------------------------------------------
// 12. Incorrect dependencies can break correctness
// ---------------------------------------------------------------------

const IncorrectDependencyExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  const greeting = useMemo(() => {
    return `Hello, ${name}`;
  }, []);

  return (
    <section>
      <p>{greeting}</p>
      <button type="button" onClick={() => setName("Jane Doe")}>
        Change name
      </button>
    </section>
  );
};

// The calculation reads name but does not declare it as a dependency.
// The memoized value can therefore remain based on the initial name after name changes.
// Performance optimization must never take precedence over dependency correctness.

// ---------------------------------------------------------------------
// 13. Memoization should not hide an inefficient algorithm
// ---------------------------------------------------------------------

const inefficientSearch = (items: readonly string[], query: string): string[] => {
  const results: string[] = [];
  const normalizedQuery = query.toLowerCase();

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (item?.toLowerCase().includes(normalizedQuery)) {
      results.push(item);
    }
  }

  return results;
};

const AlgorithmTradeoffExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const items = ["Keyboard", "Mouse", "Monitor", "Headphones", "Webcam"];

  const results = useMemo(() => {
    return inefficientSearch(items, query);
  }, [items, query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
      <p>Matches: {results.length}</p>
    </section>
  );
};

// Memoization does not improve the search algorithm.
// If the algorithm itself is inefficient, changing the algorithm or reducing the amount of work
// may have a larger effect than caching its result.

// ---------------------------------------------------------------------
// 14. Stable references can require additional code
// ---------------------------------------------------------------------

const ExplicitMemoizationExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const options = useMemo<FilterOptions>(() => {
    return { query };
  }, [query]);

  return (
    <section>
      <p>{options.query}</p>
      <button type="button" onClick={() => setQuery("keyboard")}>
        Change query
      </button>
    </section>
  );
};

const DirectObjectExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const options: FilterOptions = { query };

  return (
    <section>
      <p>{options.query}</p>
      <button type="button" onClick={() => setQuery("keyboard")}>
        Change query
      </button>
    </section>
  );
};

// The memoized version is more explicit about reference stability but also adds Hook complexity.
// The direct version is simpler when object identity has no observable performance consequence.

// ---------------------------------------------------------------------
// 15. Memoization does not prevent the component from rendering
// ---------------------------------------------------------------------

const ComponentRenderExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(10);
  }, []);

  console.log("Component rendered");

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// useMemo can skip recalculating result.
// It does not stop the component itself from rendering when its state changes.

// ---------------------------------------------------------------------
// 16. React.memo and useMemo solve different problems
// ---------------------------------------------------------------------

interface ResultProps {
  readonly value: number;
}

const ResultDisplay: FC<ResultProps> = memo(({ value }): ReactElement => {
  console.log("ResultDisplay rendered");

  return <p>Result: {value}</p>;
});

const MemoRelationshipExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    return performExpensiveCalculation(10);
  }, []);

  return (
    <section>
      <ResultDisplay value={result} />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// useMemo caches the calculated result inside the parent.
// React.memo allows the child to skip a parent-driven render when its props are unchanged.
// They can complement each other, but they optimize different work.

// ---------------------------------------------------------------------
// 17. More memoization is not always better
// ---------------------------------------------------------------------

const MultipleMemoizationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const first = useMemo(() => count + 1, [count]);
  const second = useMemo(() => count + 2, [count]);
  const third = useMemo(() => count + 3, [count]);

  return (
    <section>
      <p>{first}</p>
      <p>{second}</p>
      <p>{third}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// Three trivial calculations do not automatically justify three memoization boundaries.
// Excessive memoization can make dependency relationships harder to understand and maintain.

// ---------------------------------------------------------------------
// 18. Memoization should be driven by observable work
// ---------------------------------------------------------------------

const ObservableOptimizationExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const results = useMemo(() => {
    return products.filter((product) => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      <p>Matches: {results.length}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// This memoization has a concrete reason: results depend on query but not count.
// Measurement can determine whether avoiding repeated filtering actually improves the application.

// ---------------------------------------------------------------------
// 19. Correctness should work without memoization
// ---------------------------------------------------------------------

const CorrectnessExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = performExpensiveCalculation(10);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// This component may perform the calculation more often, but its behavior remains correct.
// If the calculation is later memoized, the optimization should preserve the same result and behavior.

// ---------------------------------------------------------------------
// 20. Measure before and after optimization
// ---------------------------------------------------------------------

const MeasuredOptimizationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const result = useMemo(() => {
    const start = performance.now();
    const value = performExpensiveCalculation(10);
    const duration = performance.now() - start;

    console.log(`Calculation duration: ${duration.toFixed(2)} ms`);

    return value;
  }, []);

  return (
    <section>
      <p>Result: {result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

// performance.now() can measure JavaScript execution time.
// In real applications, compare representative workloads before and after an optimization
// rather than assuming that memoization improved performance.

// ---------------------------------------------------------------------
// 21. Integrated example
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const productList: readonly Product[] = [
  { id: 1, name: "Keyboard", price: 80 },
  { id: 2, name: "Mouse", price: 40 },
  { id: 3, name: "Monitor", price: 300 },
  { id: 4, name: "Headphones", price: 120 },
  { id: 5, name: "Webcam", price: 90 },
];

interface ProductListProps {
  readonly products: readonly Product[];
  readonly onSelect: (product: Product) => void;
}

const ProductList: FC<ProductListProps> = memo(({ products: visibleProducts, onSelect }): ReactElement => {
  console.log("ProductList rendered");

  return (
    <ul>
      {visibleProducts.map((product) => (
        <li key={product.id}>
          {product.name} — ${product.price}
          <button type="button" onClick={() => onSelect(product)}>
            Select
          </button>
        </li>
      ))}
    </ul>
  );
});

const MemoizationTradeoffsDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return productList.filter((product) => {
      return product.name.toLowerCase().includes(normalizedQuery);
    });
  }, [query]);

  const handleSelect = useCallback((product: Product): void => {
    console.log(`Selected: ${product.name}`);
  }, []);

  return (
    <main>
      <h1>Memoization Tradeoffs</h1>

      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      </label>

      <p>Unrelated count: {count}</p>

      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment count
      </button>

      <ProductList products={visibleProducts} onSelect={handleSelect} />
    </main>
  );
};

export default MemoizationTradeoffsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Memoization is a performance optimization rather than a correctness mechanism.
// - useMemo can avoid repeating an expensive calculation when its dependencies remain unchanged.
// - useCallback can preserve a function reference when stable identity has a concrete purpose.
// - React.memo can skip parent-driven rendering when a memoized component's relevant props remain equal.
// - Memoization introduces dependency tracking and cache-management overhead.
// - Cheap calculations often do not benefit enough from memoization to justify that additional complexity.
// - Frequently changing dependencies reduce the opportunity for a memoized calculation to be reused.
// - Stable object and function references can be valuable when memoized children or other identity-sensitive consumers depend on them.
// - Preserving reference identity is not inherently useful unless something observes that identity.
// - Incorrect dependency lists can produce stale values or stale closures.
// - Memoization does not improve an inefficient algorithm.
// - Memoization does not prevent the component containing useMemo from rendering.
// - useMemo and React.memo optimize different kinds of work and can be used together.
// - Correctness should not depend on a memoized value remaining cached.
// - Measurement should establish whether an optimization actually reduces meaningful application work.
// - Good memoization balances saved work against implementation complexity and maintenance cost.

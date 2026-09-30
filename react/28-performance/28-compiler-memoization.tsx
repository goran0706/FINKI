/**
 * Compiler Memoization
 * =====================
 *
 * React Compiler can automatically memoize values, functions, and component output based on its
 * analysis of the code. This reduces the need for manually adding `useMemo`, `useCallback`, and
 * `memo`, while preserving them when explicit memoization is still useful for precise control.
 */

import { useEffect, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Compiler memoization is automatic
// ---------------------------------------------------------------------

const CompilerMemoizationConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>React Compiler analyzes supported React code during compilation.</p>
      <p>It can automatically preserve values, functions, and component output when appropriate.</p>
    </section>
  );
};

// Compiler memoization is a build-time optimization rather than a runtime Hook.
// The component source can remain straightforward while the compiler derives optimization opportunities.

// ---------------------------------------------------------------------
// 2. Manual memoization before the compiler
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = [
  { id: 1, name: "Notebook", price: 12 },
  { id: 2, name: "Keyboard", price: 80 },
  { id: 3, name: "Monitor", price: 240 },
];

const ManualMemoizationConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>`useMemo` caches calculated values.</p>
      <p>`useCallback` caches function references.</p>
      <p>`memo` can skip a child component when its props are unchanged.</p>
    </section>
  );
};

// These APIs remain valid with the compiler.
// The difference is that compiler-enabled applications can often achieve equivalent optimization automatically.

// ---------------------------------------------------------------------
// 3. Compiler memoization of calculated values
// ---------------------------------------------------------------------

const CalculatedValueExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {visibleProducts.length}</p>
    </section>
  );
};

// Without manual memoization, the calculation normally runs whenever the component renders.
// With the React Compiler enabled, compatible calculations can be automatically memoized.

// ---------------------------------------------------------------------
// 4. Compiler memoization of function references
// ---------------------------------------------------------------------

const FunctionMemoizationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleIncrement = (): void => {
    setCount((value) => value + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
    </section>
  );
};

// Functions declared during rendering normally receive a new identity on each render.
// The compiler can preserve function identity when doing so is useful and safe.

// ---------------------------------------------------------------------
// 5. Compiler memoization of component output
// ---------------------------------------------------------------------

interface ProductRowProps {
  readonly product: Product;
}

const ProductRow: FC<ProductRowProps> = ({ product }): ReactElement => {
  return (
    <li>
      {product.name}: ${product.price}
    </li>
  );
};

const ProductRows: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
};

// Compiler memoization can allow React to reuse compatible component output when relevant inputs have not changed.
// This is conceptually similar to the optimization provided by `memo`.

// ---------------------------------------------------------------------
// 6. Compiler memoization can skip cascading re-renders
// ---------------------------------------------------------------------

const CascadingRenderExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Parent count: {count}</p>
      <ProductRows />

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update parent
      </button>
    </section>
  );
};

// When a parent updates, React normally evaluates descendants as part of the update.
// Compiler memoization can allow unaffected descendant work to be reused when its relevant inputs are unchanged.

// ---------------------------------------------------------------------
// 7. Memoization follows data dependencies
// ---------------------------------------------------------------------

const DependencyBasedExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {visibleProducts.length}</p>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update unrelated state
      </button>
    </section>
  );
};

// The filtering calculation depends on `query`, but not on `count`.
// Compiler analysis can use these data-flow relationships to avoid repeating work when only unrelated state changes.

// ---------------------------------------------------------------------
// 8. Manual useMemo expresses dependencies explicitly
// ---------------------------------------------------------------------

const ManualUseMemoExample: FC = (): ReactElement => {
  return (
    <section>
      <p>`useMemo(() =&gt; calculate(query), [query])` explicitly declares the dependencies of a cached calculation.</p>
    </section>
  );
};

// Manual `useMemo` remains useful when explicit control over memoization is required.
// React compares its dependencies with `Object.is` semantics.

// ---------------------------------------------------------------------
// 9. Compiler memoization can reduce dependency-array maintenance
// ---------------------------------------------------------------------

const DependencyArrayExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const result = products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <p>Matches: {result.length}</p>
    </section>
  );
};

// Manual memoization requires developers to maintain dependency arrays.
// Compiler analysis can derive relevant dependencies automatically for supported transformations.

// ---------------------------------------------------------------------
// 10. Function dependencies can also be derived
// ---------------------------------------------------------------------

const FunctionDependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const incrementBy = (amount: number): void => {
    setCount((value) => value + amount);
  };

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={() => incrementBy(1)}>
        Add one
      </button>

      <button type="button" onClick={() => incrementBy(5)}>
        Add five
      </button>
    </section>
  );
};

// The compiler can analyze how functions capture state, props, and other reactive values.
// This can allow function identity to remain stable when the relevant captured values have not changed.

// ---------------------------------------------------------------------
// 11. Inline callbacks can also be optimized
// ---------------------------------------------------------------------

const InlineCallbackExample: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button type="button" onClick={() => console.log(product.name)}>
            Select {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

// An inline callback normally creates a new function during rendering.
// The React Compiler can optimize supported cases where preserving that callback's identity is beneficial.

// ---------------------------------------------------------------------
// 12. Compiler memoization is more precise than blanket memoization
// ---------------------------------------------------------------------

const PreciseMemoizationExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <p>Matches: {visibleProducts.length}</p>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update count
      </button>
    </section>
  );
};

// Memoization is most useful when it avoids meaningful repeated work.
// Compiler optimization can analyze individual values and dependencies instead of requiring developers to memoize everything manually.

// ---------------------------------------------------------------------
// 13. Not every value needs memoization
// ---------------------------------------------------------------------

const CheapCalculationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = count * 2;

  return (
    <section>
      <p>{doubled}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// A simple arithmetic calculation is already cheap.
// Compiler memoization does not mean every expression should be treated as an expensive computation.

// ---------------------------------------------------------------------
// 14. Compiler memoization is different from state
// ---------------------------------------------------------------------

const StateVsMemoizationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>State: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// State stores information that controls the component's behavior.
// Memoization stores reusable computation or identity as an optimization.

// ---------------------------------------------------------------------
// 15. Compiler memoization is different from refs
// ---------------------------------------------------------------------

const RefConceptExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Refs are used to retain mutable values or references without rendering.</p>
      <p>Compiler memoization is an optimization of compatible render-time work.</p>
    </section>
  );
};

// A ref is part of the component's runtime state model.
// Memoization should not be used as a substitute for a ref when persistent mutable storage is actually required.

// ---------------------------------------------------------------------
// 16. Memoization should not be required for correctness
// ---------------------------------------------------------------------

const CorrectnessExample: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  const label = enabled ? "Enabled" : "Disabled";

  return (
    <section>
      <p>{label}</p>

      <button type="button" onClick={() => setEnabled((value) => !value)}>
        Toggle
      </button>
    </section>
  );
};

// If removing a memoization optimization changes correctness, the underlying code has a separate problem.
// Memoization should improve performance, not establish required application semantics.

// ---------------------------------------------------------------------
// 17. Effects can make memoized identity important
// ---------------------------------------------------------------------

const EffectDependencyExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const searchConfiguration = {
    query: query.trim(),
    limit: 10,
  };

  useEffect(() => {
    console.log("Search configuration changed", searchConfiguration);
  }, [searchConfiguration]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
    </section>
  );
};

// Object identity matters when a value is used as a dependency of another Hook.
// Manual `useMemo` can provide precise control in cases where stable identity is required for effect behavior.

// ---------------------------------------------------------------------
// 18. Manual useMemo remains an escape hatch
// ---------------------------------------------------------------------

const ExplicitMemoizationExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const searchConfiguration = {
    query: query.trim(),
    limit: 10,
  };

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <p>Configuration query: {searchConfiguration.query || "none"}</p>
    </section>
  );
};

// React Compiler does not make `useMemo` obsolete.
// React's documentation describes manual memoization as an escape hatch when precise control is needed.

// ---------------------------------------------------------------------
// 19. Existing manual memoization should not be removed blindly
// ---------------------------------------------------------------------

const ExistingMemoizationExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Existing memoization may be intentional.</p>
      <p>Verify compiler behavior before removing it.</p>
    </section>
  );
};

// Existing `useMemo`, `useCallback`, and `memo` calls can affect compiler output.
// Removing them mechanically can therefore change the generated optimization behavior.

// ---------------------------------------------------------------------
// 20. Incomplete dependencies can interfere with optimization
// ---------------------------------------------------------------------

const CompleteDependencyExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10);

  const result = products
    .filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, limit);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <button type="button" onClick={() => setLimit((value) => value + 1)}>
        Increase limit
      </button>

      <p>Matches shown: {result.length}</p>
    </section>
  );
};

// When manual memoization is used, its dependency list must accurately represent the calculation's reactive inputs.
// Incorrect dependencies can produce stale values and can also prevent the compiler from reasoning correctly about the data flow.

// ---------------------------------------------------------------------
// 21. Compiler memoization does not make impure calculations safe
// ---------------------------------------------------------------------

const PureCalculationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = count * 2;

  return (
    <section>
      <p>{doubled}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Render-time calculations should remain pure.
// An optimizer may reuse a calculation, so code that depends on the calculation running for an unrelated side effect is incorrect.

// ---------------------------------------------------------------------
// 22. Side effects belong in explicit effect or event boundaries
// ---------------------------------------------------------------------

const ExplicitSideEffectExample: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  const save = (): void => {
    setSaved(true);
    console.log("Saved");
  };

  return (
    <section>
      <p>{saved ? "Saved" : "Not saved"}</p>

      <button type="button" onClick={save}>
        Save
      </button>
    </section>
  );
};

// Event handlers are explicit places for event-driven side effects.
// Effects are appropriate for synchronization with external systems when an effect is actually needed.

// ---------------------------------------------------------------------
// 23. Compiler memoization can preserve JSX-related work
// ---------------------------------------------------------------------

interface ProductDetailsProps {
  readonly product: Product;
}

const ProductDetails: FC<ProductDetailsProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </article>
  );
};

const ProductDetailsExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <ProductDetails product={products[0]} />

      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update count
      </button>
    </section>
  );
};

// Compiler memoization can allow unchanged component output to be reused when a parent updates.
// This reduces unnecessary cascading work without requiring every child to be manually wrapped in `memo`.

// ---------------------------------------------------------------------
// 24. Compiler memoization can preserve stable values
// ---------------------------------------------------------------------

const StableValueExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const configuration = {
    language: "en",
    currency: "USD",
  };

  return (
    <section>
      <p>
        {configuration.language} / {configuration.currency}
      </p>
      <p>{count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Object literals normally create new references on each render.
// Compiler memoization can preserve compatible values when doing so is useful for downstream work.

// ---------------------------------------------------------------------
// 25. Compiler memoization can preserve callback identity
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly onAction: () => void;
}

const ActionButton: FC<ActionButtonProps> = ({ onAction }): ReactElement => {
  return (
    <button type="button" onClick={onAction}>
      Perform action
    </button>
  );
};

const StableCallbackExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = (): void => {
    console.log("Action");
  };

  return (
    <section>
      <ActionButton onAction={handleAction} />

      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update count
      </button>
    </section>
  );
};

// Stable callback identity can matter when a callback is passed to an optimized child.
// The compiler can automatically optimize compatible callback references.

// ---------------------------------------------------------------------
// 26. Compiler memoization is not a guarantee against every render
// ---------------------------------------------------------------------

const RenderStillChangesExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>{count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Memoization is an optimization rather than a different rendering model.
// When relevant state or props change, React still needs to produce the corresponding new UI.

// ---------------------------------------------------------------------
// 27. Compiler memoization does not eliminate state updates
// ---------------------------------------------------------------------

const StateUpdateExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const increment = (): void => {
    setCount((value) => value + 1);
  };

  return (
    <section>
      <p>{count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

// Automatic memoization does not turn state updates into no-ops.
// It determines which unaffected work can be reused around the update.

// ---------------------------------------------------------------------
// 28. Compiler memoization and useCallback
// ---------------------------------------------------------------------

const UseCallbackComparison: FC = (): ReactElement => {
  return (
    <section>
      <p>Manual: `useCallback` explicitly caches a function according to dependencies.</p>
      <p>Compiler: compatible function identity can be optimized automatically.</p>
    </section>
  );
};

// React's current documentation recommends relying on the compiler for memoization in new code when possible,
// while retaining `useCallback` when precise control over function identity is needed.

// ---------------------------------------------------------------------
// 29. Compiler memoization and useMemo
// ---------------------------------------------------------------------

const UseMemoComparison: FC = (): ReactElement => {
  return (
    <section>
      <p>Manual: `useMemo` explicitly caches a calculation result.</p>
      <p>Compiler: compatible calculations can be memoized automatically.</p>
    </section>
  );
};

// `useMemo` remains available for cases where explicit control is useful.
// The compiler reduces the need to manually annotate ordinary calculations.

// ---------------------------------------------------------------------
// 30. Compiler memoization and React.memo
// ---------------------------------------------------------------------

const ReactMemoComparison: FC = (): ReactElement => {
  return (
    <section>
      <p>Manual: `memo` creates an explicit component memoization boundary.</p>
      <p>Compiler: compatible components can receive equivalent automatic optimization.</p>
    </section>
  );
};

// React Compiler can automatically apply the equivalent of `memo` to components.
// Manual `memo` remains available when explicit control or existing code compatibility requires it.

// ---------------------------------------------------------------------
// 31. Memoization does not replace component composition
// ---------------------------------------------------------------------

const CompositionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Application</h2>
      <p>Independent content can be passed as children.</p>
    </section>
  );
};

// Good component composition can avoid unnecessary state propagation and re-rendering without relying on memoization.
// Compiler optimization complements sound component architecture rather than replacing it.

// ---------------------------------------------------------------------
// 32. Memoization does not replace local state
// ---------------------------------------------------------------------

const LocalStateExample: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <label>
      Value
      <input value={value} onChange={(event) => setValue(event.target.value)} />
    </label>
  );
};

// Keeping transient state close to the component that owns it can reduce unnecessary updates naturally.
// This can make memoization less necessary in the first place.

// ---------------------------------------------------------------------
// 33. Memoization does not replace removing unnecessary Effects
// ---------------------------------------------------------------------

const UnnecessaryEffectExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <p>{normalizedQuery}</p>
    </section>
  );
};

// Derived render-time values usually do not need an Effect just to synchronize one piece of state from another.
// Removing unnecessary update chains can be more effective than memoizing them.

// ---------------------------------------------------------------------
// 34. Compiler optimization should be measured
// ---------------------------------------------------------------------

interface PerformanceMeasurement {
  readonly metric: string;
  readonly before: number;
  readonly after: number;
}

const performanceMeasurements: readonly PerformanceMeasurement[] = [
  { metric: "Render work", before: 18, after: 11 },
  { metric: "Derived calculation", before: 14, after: 7 },
];

const MeasurementExample: FC = (): ReactElement => {
  return (
    <ul>
      {performanceMeasurements.map((measurement) => (
        <li key={measurement.metric}>
          {measurement.metric}: {measurement.before} ms → {measurement.after} ms
        </li>
      ))}
    </ul>
  );
};

// The values above are illustrative rather than benchmark results.
// Real compiler benefits should be measured with representative application workloads.

// ---------------------------------------------------------------------
// 35. Compiler memoization is primarily an update optimization
// ---------------------------------------------------------------------

const UpdateOptimizationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <p>Unchanged content can potentially be reused.</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update
      </button>
    </section>
  );
};

// React Compiler's automatic memoization is primarily focused on update performance:
// avoiding unnecessary cascading re-renders and repeated expensive calculations during updates.

// ---------------------------------------------------------------------
// 36. Compiler memoization does not optimize resource delivery
// ---------------------------------------------------------------------

const ResourceBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Memoization: reuse compatible runtime work.</p>
      <p>Code splitting: defer JavaScript resource delivery.</p>
    </section>
  );
};

// Network performance still requires techniques such as code splitting, compression, caching, and resource prioritization.
// Compiler memoization does not reduce the need for those independent optimizations.

// ---------------------------------------------------------------------
// 37. Compiler memoization does not optimize every algorithm
// ---------------------------------------------------------------------

const AlgorithmicCostExample: FC = (): ReactElement => {
  const sortedProducts = [...products].sort((left, right) => left.price - right.price);

  return (
    <ol>
      {sortedProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ol>
  );
};

// Reusing a calculation can reduce how often an algorithm executes.
// It does not change the algorithm's inherent computational complexity.

// ---------------------------------------------------------------------
// 38. Compiler directives can control compilation
// ---------------------------------------------------------------------

const CompilerDirectiveConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Compiler directives can provide fine-grained control over whether a function is compiled.</p>
    </section>
  );
};

// Current React Compiler documentation defines `"use memo"` to opt a function into compilation
// and `"use no memo"` to prevent compilation for a specific function.

// ---------------------------------------------------------------------
// 39. Compiler memoization works with ordinary React code
// ---------------------------------------------------------------------

const OrdinaryReactCodeExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  return (
    <section>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />

      <p>Hello, {name}.</p>
    </section>
  );
};

// The goal is not to write a special "compiler version" of a component.
// The compiler analyzes ordinary React code and optimizes supported patterns during compilation.

// ---------------------------------------------------------------------
// 40. Integrated compiler memoization example
// ---------------------------------------------------------------------

const CompilerMemoizationDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));

  const handleIncrement = (): void => {
    setCount((value) => value + 1);
  };

  return (
    <main>
      <h1>Compiler Memoization</h1>

      <section>
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <p>Matches: {visibleProducts.length}</p>

        <ul>
          {visibleProducts.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </ul>
      </section>

      <section>
        <p>Unrelated count: {count}</p>

        <button type="button" onClick={handleIncrement}>
          Increment
        </button>
      </section>
    </main>
  );
};

export default CompilerMemoizationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React Compiler performs memoization automatically during compilation when its analysis determines that optimization is safe and useful.
// - Compiler memoization can preserve calculated values, function identities, and component output.
// - Automatic memoization primarily targets update performance, including cascading re-renders and repeated expensive calculations.
// - Manual `useMemo`, `useCallback`, and `memo` remain valid with the compiler.
// - `useMemo` caches a calculation result, while `useCallback` caches a function reference.
// - `memo` provides an explicit component memoization boundary.
// - Compiler memoization can reduce the amount of manual memoization required in supported code.
// - Compiler analysis can derive relevant data dependencies instead of requiring every optimization to use a manually maintained dependency array.
// - Inline callbacks and newly created objects can also be optimized when compiler analysis determines that preserving their identity is beneficial.
// - Memoization is an optimization and should not be required for application correctness.
// - Render-time calculations should remain pure because the compiler may reuse their results.
// - Side effects should remain in explicit event handlers or appropriate Effects.
// - Existing manual memoization should not be removed mechanically because it can affect compiler output and may have been added for a specific reason.
// - Manual memoization can remain useful as an escape hatch when precise control over identity or recalculation is required.
// - Incomplete manual dependency lists can produce stale behavior and interfere with compiler analysis.
// - Compiler memoization does not replace good component composition, local state ownership, efficient algorithms, or removal of unnecessary Effects.
// - Compiler memoization does not replace code splitting, resource optimization, or virtualization because those techniques address different performance costs.
// - Compiler optimization should be evaluated with representative workloads rather than assumed to improve every component.
// - Compiler directives such as `"use memo"` and `"use no memo"` provide fine-grained control over compilation when needed.
// - The compiler optimizes ordinary React code; components do not need to be rewritten into a special compiler-specific style.

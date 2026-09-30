/**
 * React Compiler
 * ==============
 *
 * The React Compiler is a build-time optimization tool that analyzes React and JavaScript code
 * and automatically applies memoization when it can determine that doing so preserves behavior.
 * It is intended to reduce the need for manually adding performance optimizations such as `useMemo`,
 * `useCallback`, and `memo` in code that follows the compiler's supported rules.
 */

import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Compiler optimization happens at build time
// ---------------------------------------------------------------------

const CompilerConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Source code is analyzed during the build.</p>
      <p>Supported code can be transformed into optimized output.</p>
    </section>
  );
};

// The compiler is not a runtime hook.
// Its optimization work happens as part of the application's build process.

// ---------------------------------------------------------------------
// 2. The compiler analyzes component behavior
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly role: string;
}

const user: User = {
  name: "John Doe",
  role: "Member",
};

const ComponentAnalysisExample: FC = (): ReactElement => {
  return (
    <section>
      <p>{user.name}</p>
      <p>{user.role}</p>
    </section>
  );
};

// The compiler analyzes how values are created, consumed, and changed.
// This analysis allows it to identify opportunities for preserving values or skipping unnecessary work.

// ---------------------------------------------------------------------
// 3. Manual memoization and compiler optimization
// ---------------------------------------------------------------------

const ManualMemoizationExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Manual optimization explicitly controls memoization boundaries.</p>
      <p>Compiler optimization can derive compatible memoization automatically.</p>
    </section>
  );
};

// Traditional React optimization often uses `memo`, `useMemo`, and `useCallback` explicitly.
// The compiler can automate many of these optimizations when it can safely prove that they preserve behavior.

// ---------------------------------------------------------------------
// 4. Pure calculations are easier to optimize
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = [
  { name: "Notebook", price: 12 },
  { name: "Keyboard", price: 80 },
  { name: "Monitor", price: 240 },
];

const ProductList: FC = (): ReactElement => {
  const formattedProducts = products.map((product) => ({
    ...product,
    formattedPrice: `$${product.price.toFixed(2)}`,
  }));

  return (
    <ul>
      {formattedProducts.map((product) => (
        <li key={product.name}>
          {product.name}: {product.formattedPrice}
        </li>
      ))}
    </ul>
  );
};

// Pure calculations have predictable inputs and outputs.
// Predictable code gives an optimizer more information about which work can safely be reused.

// ---------------------------------------------------------------------
// 5. Avoid unnecessary side effects during rendering
// ---------------------------------------------------------------------

const PureRenderExample: FC = (): ReactElement => {
  const label = `User: ${user.name}`;

  return <p>{label}</p>;
};

// Rendering should describe the result of the component rather than perform unrelated side effects.
// Side effects belong in the appropriate React or application mechanisms rather than arbitrary render-time code.

// ---------------------------------------------------------------------
// 6. State still changes component output
// ---------------------------------------------------------------------

const StateExample: FC = (): ReactElement => {
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

// Compiler optimization does not change the semantics of state.
// A state update still schedules the component to render with the new state.

// ---------------------------------------------------------------------
// 7. Props still determine component behavior
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <p>Hello, {name}.</p>;
};

const PropsExample: FC = (): ReactElement => {
  return <Greeting name="John Doe" />;
};

// Compiler optimizations must preserve the relationship between props and rendered output.
// If a prop changes in a way that affects the component, the resulting UI must still update correctly.

// ---------------------------------------------------------------------
// 8. Derived values can be optimized
// ---------------------------------------------------------------------

const DerivedValueExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const matchingProducts = products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {matchingProducts.length}</p>
    </section>
  );
};

// Derived values are ordinary calculations during rendering.
// The compiler can identify some repeated calculations and preserve results when its analysis proves that doing so is safe.

// ---------------------------------------------------------------------
// 9. Object creation can affect identity
// ---------------------------------------------------------------------

const ObjectIdentityExample: FC = (): ReactElement => {
  const settings = {
    language: "en",
    currency: "USD",
  };

  return (
    <section>
      <p>Language: {settings.language}</p>
      <p>Currency: {settings.currency}</p>
    </section>
  );
};

// JavaScript object literals create new object identities when they execute.
// Compiler optimization can sometimes preserve such values when that transformation is proven safe.

// ---------------------------------------------------------------------
// 10. Function creation can affect identity
// ---------------------------------------------------------------------

const FunctionIdentityExample: FC = (): ReactElement => {
  const handleSelect = (): void => {
    console.log("Selected");
  };

  return (
    <button type="button" onClick={handleSelect}>
      Select
    </button>
  );
};

// Functions are objects in JavaScript and therefore have reference identity.
// The compiler can optimize function identity in supported cases without changing the callback's behavior.

// ---------------------------------------------------------------------
// 11. Manual useCallback expresses an optimization explicitly
// ---------------------------------------------------------------------

const ManualUseCallbackConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>`useCallback` explicitly asks React to preserve a function reference according to its dependencies.</p>
    </section>
  );
};

// With manual memoization, developers must maintain the dependency list themselves.
// Compiler optimization can remove the need for some of these manual annotations.

// ---------------------------------------------------------------------
// 12. Manual useMemo expresses an optimization explicitly
// ---------------------------------------------------------------------

const ManualUseMemoConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>`useMemo` explicitly asks React to reuse a calculated value according to its dependencies.</p>
    </section>
  );
};

// The compiler can automatically apply equivalent optimizations where its analysis supports them.
// The source code can therefore focus more directly on the calculation itself.

// ---------------------------------------------------------------------
// 13. Manual memo expresses a component boundary
// ---------------------------------------------------------------------

interface ItemProps {
  readonly item: Product;
}

const Item: FC<ItemProps> = ({ item }): ReactElement => {
  return (
    <li>
      {item.name}: ${item.price}
    </li>
  );
};

// `memo` has historically been used to explicitly create a memoized component boundary.
// With compiler optimization enabled, many such manual boundaries may no longer be necessary.

// ---------------------------------------------------------------------
// 14. Compiler optimization does not mean every render disappears
// ---------------------------------------------------------------------

const RenderSemanticsExample: FC = (): ReactElement => {
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

// Optimization is selective.
// A component still needs to produce new output when its relevant inputs change.

// ---------------------------------------------------------------------
// 15. Compiler optimization must preserve semantics
// ---------------------------------------------------------------------

const SemanticPreservationExample: FC = (): ReactElement => {
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

// An optimization is valid only when the transformed program behaves equivalently for the supported semantics.
// Performance optimization must not change which UI is produced for the same relevant state and props.

// ---------------------------------------------------------------------
// 16. Compiler optimization depends on supported code
// ---------------------------------------------------------------------

const SupportedCodeExample: FC = (): ReactElement => {
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

// The compiler does not treat arbitrary JavaScript as automatically optimizable.
// Its transformations depend on the compiler's supported React and JavaScript semantics.

// ---------------------------------------------------------------------
// 17. Rules of React help the compiler reason about code
// ---------------------------------------------------------------------

const RulesOfReactExample: FC = (): ReactElement => {
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

// Rules such as calling Hooks at the top level and keeping render logic pure provide predictable structure.
// Predictable structure makes static analysis and optimization more reliable.

// ---------------------------------------------------------------------
// 18. Side effects belong outside pure calculations
// ---------------------------------------------------------------------

const SideEffectExample: FC = (): ReactElement => {
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

// The event handler performs an intentional side effect in response to an event.
// Keeping side effects in explicit event or effect boundaries makes component behavior easier to analyze.

// ---------------------------------------------------------------------
// 19. Compiler optimization can reduce manual dependency management
// ---------------------------------------------------------------------

const DependencyManagementExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />

      <p>Normalized query: {normalizedQuery}</p>
    </section>
  );
};

// Manual memoization requires developers to maintain dependency arrays.
// Automatic memoization can reduce that maintenance when the compiler can derive the relevant dependencies.

// ---------------------------------------------------------------------
// 20. Compiler optimization does not change Hook semantics
// ---------------------------------------------------------------------

const HookSemanticsExample: FC = (): ReactElement => {
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

// Hooks still have their normal runtime semantics.
// The compiler optimizes compatible code around those semantics rather than replacing React's state model.

// ---------------------------------------------------------------------
// 21. Compiler optimization can help with child props
// ---------------------------------------------------------------------

interface ListProps {
  readonly items: readonly Product[];
}

const ProductListChild: FC<ListProps> = ({ items }): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>
          {item.name}: ${item.price}
        </li>
      ))}
    </ul>
  );
};

const ChildPropsExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter products" />

      <ProductListChild items={filteredProducts} />
    </section>
  );
};

// Derived props can create new references during rendering.
// Compiler optimization can sometimes reduce unnecessary downstream work when it can safely preserve relevant values.

// ---------------------------------------------------------------------
// 22. Compiler optimization does not replace good component design
// ---------------------------------------------------------------------

const ComponentDesignExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>Profile information</p>
      <p>Preferences</p>
    </section>
  );
};

// Component boundaries should still reflect meaningful responsibilities.
// The compiler is an optimization tool, not a substitute for clear state ownership or component structure.

// ---------------------------------------------------------------------
// 23. Compiler optimization does not replace algorithmic efficiency
// ---------------------------------------------------------------------

const AlgorithmExample: FC = (): ReactElement => {
  const sortedProducts = [...products].sort((left, right) => left.price - right.price);

  return (
    <ol>
      {sortedProducts.map((product) => (
        <li key={product.name}>
          {product.name}: ${product.price}
        </li>
      ))}
    </ol>
  );
};

// Automatic memoization can avoid repeating some work, but it does not change the fundamental complexity of an algorithm.
// Choosing an efficient algorithm can remain important even when compiler optimization is enabled.

// ---------------------------------------------------------------------
// 24. Compiler optimization does not replace code splitting
// ---------------------------------------------------------------------

const CodeSplittingExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Compiler optimization: optimize generated React code.</p>
      <p>Code splitting: divide resources into independently loaded chunks.</p>
    </section>
  );
};

// Compiler optimization and code splitting address different performance dimensions.
// One can reduce repeated runtime work while the other can change when JavaScript is downloaded.

// ---------------------------------------------------------------------
// 25. Compiler optimization does not replace virtualization
// ---------------------------------------------------------------------

const VirtualizationExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Compiler optimization: optimize compatible component calculations.</p>
      <p>Virtualization: render only a visible window of a large collection.</p>
    </section>
  );
};

// Virtualization reduces the number of mounted list items.
// Compiler optimization can reduce repeated work within the components that are actually rendered.

// ---------------------------------------------------------------------
// 26. Compiler optimization does not replace resource optimization
// ---------------------------------------------------------------------

const ResourceOptimizationExample: FC = (): ReactElement => {
  return (
    <section>
      <p>JavaScript optimization affects runtime work.</p>
      <p>Resource optimization affects network delivery and loading.</p>
    </section>
  );
};

// Image compression, font optimization, caching, preloading, and code splitting address resource delivery.
// Compiler optimization addresses a different layer of application performance.

// ---------------------------------------------------------------------
// 27. Compiler adoption should be measured
// ---------------------------------------------------------------------

interface PerformanceMeasurement {
  readonly metric: string;
  readonly before: number;
  readonly after: number;
}

const measurements: readonly PerformanceMeasurement[] = [
  { metric: "Render duration", before: 18, after: 12 },
  { metric: "Repeated calculation time", before: 14, after: 8 },
];

const MeasurementExample: FC = (): ReactElement => {
  return (
    <ul>
      {measurements.map((measurement) => (
        <li key={measurement.metric}>
          {measurement.metric}: {measurement.before} ms → {measurement.after} ms
        </li>
      ))}
    </ul>
  );
};

// Performance numbers should be measured rather than assumed.
// The values above are illustrative and do not represent a benchmark of React Compiler itself.

// ---------------------------------------------------------------------
// 28. Compiler optimization should be evaluated in production-like builds
// ---------------------------------------------------------------------

const ProductionMeasurementExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Measure representative production builds.</p>
      <p>Use realistic data and interactions.</p>
      <p>Compare equivalent workloads before and after optimization.</p>
    </section>
  );
};

// Development tooling and production builds can have different performance characteristics.
// Compiler-related performance evaluation should use the build and workload that represent the target application.

// ---------------------------------------------------------------------
// 29. Manual memoization can still communicate intent
// ---------------------------------------------------------------------

const ExplicitMemoizationExample: FC = (): ReactElement => {
  return (
    <section>
      <p>
        Existing manual memoization should not automatically be removed without verifying the compiler configuration and
        behavior.
      </p>
    </section>
  );
};

// Compiler adoption is not simply a search-and-replace operation.
// Existing optimization code may have correctness, compatibility, or project-specific reasons that still need review.

// ---------------------------------------------------------------------
// 30. Compiler configuration is part of the build
// ---------------------------------------------------------------------

const CompilerConfigurationConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>The compiler is configured as part of the application's build pipeline.</p>
      <p>Its output should be verified in the generated application.</p>
    </section>
  );
};

// Exact configuration depends on the application's build system and React tooling.
// The important distinction is that compiler optimization is integrated into compilation rather than invoked from a component at runtime.

// ---------------------------------------------------------------------
// 31. Compiler diagnostics can identify unsupported patterns
// ---------------------------------------------------------------------

const DiagnosticConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Compiler diagnostics can identify code that does not satisfy the assumptions required for a transformation.</p>
    </section>
  );
};

// Unsupported or problematic patterns should be treated as engineering signals.
// Code should not be changed merely to force optimization if doing so makes the behavior less clear or correct.

// ---------------------------------------------------------------------
// 32. Compiler optimization is incremental
// ---------------------------------------------------------------------

const IncrementalAdoptionExample: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <section>
      <p>Compiler-enabled optimization: {enabled ? "on" : "off"}</p>

      <button type="button" onClick={() => setEnabled((value) => !value)}>
        Toggle
      </button>
    </section>
  );
};

// Compiler adoption can be evaluated incrementally depending on the project's tooling and configuration.
// A project can verify transformed behavior and performance rather than assuming every component changes identically.

// ---------------------------------------------------------------------
// 33. Compiler optimization should preserve correctness first
// ---------------------------------------------------------------------

const CorrectnessExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  return (
    <section>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />

      <p>Hello, {name}.</p>
    </section>
  );
};

// The primary requirement remains correct React behavior.
// An optimization that changes visible behavior, state semantics, or side-effect ordering would not be a valid optimization.

// ---------------------------------------------------------------------
// 34. Compiler optimization can simplify application code
// ---------------------------------------------------------------------

const SimplifiedComponent: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />

      <p>Matches: {filteredProducts.length}</p>
    </section>
  );
};

// With compiler optimization, developers can often write straightforward calculations without manually wrapping every value in `useMemo`.
// The compiler decides whether compatible memoization is beneficial and safe based on its analysis.

// ---------------------------------------------------------------------
// 35. Integrated React Compiler example
// ---------------------------------------------------------------------

const ReactCompilerDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handleIncrement = (): void => {
    setCount((value) => value + 1);
  };

  return (
    <main>
      <h1>React Compiler</h1>

      <section>
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <p>Matches: {filteredProducts.length}</p>

        <ul>
          {filteredProducts.map((product) => (
            <li key={product.name}>
              {product.name}: ${product.price}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p>Count: {count}</p>

        <button type="button" onClick={handleIncrement}>
          Increment
        </button>
      </section>
    </main>
  );
};

export default ReactCompilerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The React Compiler performs static analysis and optimization during the build process.
// - Compiler optimization is different from runtime Hooks such as `useMemo` and `useCallback`.
// - The compiler can automatically apply memoization in supported code when it can prove that the transformation preserves behavior.
// - Pure calculations provide predictable inputs and outputs that are easier for static analysis to reason about.
// - React state and props continue to determine component behavior after compiler optimization.
// - Compiler optimization does not mean every render disappears.
// - Components still need to render when relevant state or props change.
// - JavaScript object and function identity can affect React performance, and the compiler can optimize some identity-related work automatically.
// - Manual `useMemo`, `useCallback`, and `memo` have historically provided explicit performance optimizations.
// - Compiler optimization can reduce the amount of manual memoization required in compatible applications.
// - The compiler does not change Hook semantics or the rules governing Hook usage.
// - Side effects should remain in explicit event handlers or effect mechanisms rather than arbitrary render-time calculations.
// - Compiler optimization does not replace good component boundaries or clear state ownership.
// - Compiler optimization does not replace efficient algorithms.
// - Code splitting addresses JavaScript delivery, while compiler optimization addresses compatible runtime code transformations.
// - Virtualization reduces the number of mounted items, while compiler optimization can reduce repeated work in rendered components.
// - Resource optimization addresses network delivery and browser resource costs, which are separate from compiler optimization.
// - Compiler adoption should be evaluated with representative workloads and production-like builds.
// - Existing manual memoization should not be removed mechanically without verifying compiler configuration, compatibility, and behavior.
// - Compiler diagnostics can identify patterns that cannot safely receive a particular transformation.
// - Compiler optimization must preserve application semantics and visible behavior.
// - Performance improvements should be measured rather than assumed.

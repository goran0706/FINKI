/**
 * React Compiler Directives
 * ==========================
 *
 * React Compiler directives provide explicit control over whether individual functions are
 * compiled by React Compiler. `"use memo"` opts a function into compilation, while
 * `"use no memo"` opts a function out of compilation.
 *
 * These directives are primarily useful when controlling compiler adoption or handling
 * specific cases that need explicit compilation boundaries. In the default `infer` mode,
 * most components and hooks are detected automatically, so directives are generally an
 * escape hatch rather than something every component needs.
 */

import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. `"use memo"`
// ---------------------------------------------------------------------

// `"use memo"` explicitly opts this function into React Compiler optimization.
//
// The directive must be the first statement in the function body.
// Comments may appear before it, but executable statements may not.
const OptimizedCalculation = (value: number): number => {
  "use memo";

  return value * value;
};

// The directive is a string literal with special meaning to React Compiler.
// Without React Compiler, it has no special runtime behavior.
const DirectiveExample = (): ReactElement => {
  const result = OptimizedCalculation(10);

  return <p>Calculated value: {result}</p>;
};

// ---------------------------------------------------------------------
// 2. `"use memo"` on components
// ---------------------------------------------------------------------

interface ProductCardProps {
  readonly name: string;
  readonly price: number;
}

// A component can explicitly opt into compiler optimization.
//
// This is especially useful when using `compilationMode: "annotation"`,
// where functions must be explicitly marked with `"use memo"` to compile.
const OptimizedProductCard: FC<ProductCardProps> = ({ name, price }): ReactElement => {
  "use memo";

  return (
    <article>
      <h2>{name}</h2>
      <p>${price}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. `"use memo"` on custom Hooks
// ---------------------------------------------------------------------

// `"use memo"` can also be used on custom Hooks.
//
// In annotation mode, custom Hooks that should be compiled need the directive
// just like components do.
const useDisplayName = (name: string): string => {
  "use memo";

  return name.trim();
};

const CustomHookExample: FC = (): ReactElement => {
  const displayName = useDisplayName("John Doe");

  return <p>{displayName}</p>;
};

// ---------------------------------------------------------------------
// 4. Directive placement
// ---------------------------------------------------------------------

// Correct placement:
//
// function Example() {
//     "use memo";
//     // function body
// }
//
// The directive must be the first statement in the function body.
const CorrectDirectivePlacement = (): ReactElement => {
  "use memo";

  return <p>The directive is correctly placed.</p>;
};

// This would not opt the function into compilation:
//
// function IncorrectDirectivePlacement() {
//     const value = 10;
//     "use memo";
//     return <p>{value}</p>;
// }
//
// Once executable code has appeared, the string is no longer a directive.

// ---------------------------------------------------------------------
// 5. `"use no memo"`
// ---------------------------------------------------------------------

// `"use no memo"` explicitly prevents React Compiler from optimizing a function.
//
// This is primarily intended as a temporary escape hatch for debugging
// or isolating compiler-related behavior.
const CompilerOptOutExample = (): ReactElement => {
  "use no memo";

  return <p>This function is excluded from compiler optimization.</p>;
};

// The directive does not mean that the component is "unoptimized" in every
// possible sense. It specifically tells React Compiler not to optimize this
// function.

// ---------------------------------------------------------------------
// 6. Function-level directives override module-level directives
// ---------------------------------------------------------------------

// A module-level directive can establish a default for functions in the module:
//
// "use memo";
//
// function FirstComponent() {
//     return <p>Compiled by the module directive.</p>;
// }
//
// function SecondComponent() {
//     "use no memo";
//     return <p>Excluded by the function directive.</p>;
// }
//
// The function-level `"use no memo"` takes precedence over the module-level
// `"use memo"` directive.
//
// This example is shown as comments because putting a module-level directive
// in this tutorial file would change the compilation behavior of the entire file.

// ---------------------------------------------------------------------
// 7. Compilation modes
// ---------------------------------------------------------------------

// React Compiler supports different compilation modes that determine how
// functions are selected for compilation.
//
// annotation:
//   Only functions explicitly marked with `"use memo"` are compiled.
//
// infer:
//   The compiler automatically identifies compatible components and Hooks.
//   Function-level directives can override its decision.
//
// all:
//   Functions are compiled by default, while `"use no memo"` can exclude
//   individual functions.
//
// Example configuration:
//
// {
//     compilationMode: "annotation"
// }
//
// With annotation mode:
//
// const ExplicitlyCompiled = (): ReactElement => {
//     "use memo";
//     return <p>Compiled.</p>;
// };
//
// const NotCompiled = (): ReactElement => {
//     return <p>Not compiled.</p>;
// };

// ---------------------------------------------------------------------
// 8. Why `"use memo"` is not normally required
// ---------------------------------------------------------------------

// In the default `infer` mode, React Compiler automatically detects
// components and custom Hooks using their naming conventions and analyzes
// whether they can be optimized.
//
// Therefore, this component generally does not need `"use memo"`:
//
// const ProductList: FC = (): ReactElement => {
//     return <ul>...</ul>;
// };
//
// Adding `"use memo"` everywhere would make the source noisier without
// providing additional value when the compiler already selects the function.
//
// If a function is unexpectedly skipped in infer mode, correcting its
// component or Hook naming is generally preferable to adding a directive.

// ---------------------------------------------------------------------
// 9. Directives are not runtime memoization APIs
// ---------------------------------------------------------------------

// `"use memo"` does not behave like calling `useMemo`.
//
// It does not return a cached value and does not receive a dependency array.
//
// The compiler analyzes the function during the build process and can
// introduce memoization where it determines that it is safe and useful.
const CompilerManagedCalculation = (items: readonly number[]): number => {
  "use memo";

  return items.reduce((total, item) => total + item, 0);
};

const CompilerCalculationExample: FC = (): ReactElement => {
  const total = CompilerManagedCalculation([10, 20, 30]);

  return <p>Total: {total}</p>;
};

// ---------------------------------------------------------------------
// 10. Compiler directives and manual memoization
// ---------------------------------------------------------------------

// React Compiler reduces the need for manual `useMemo`, `useCallback`,
// and `memo` in compatible code.
//
// Manual memoization can still be useful when precise control is needed,
// so directives do not mean that these APIs become invalid.
//
// The distinction is:
//
// - `"use memo"` controls compiler compilation of a function.
// - `useMemo` manually caches the result of a calculation.
// - `useCallback` manually caches a function reference.
// - `memo` manually controls component prop-based memoization.
//
// Compiler directives and manual memoization solve related but different
// problems.

// ---------------------------------------------------------------------
// 11. `"use no memo"` for debugging
// ---------------------------------------------------------------------

interface DebugExampleProps {
  readonly value: number;
}

// `"use no memo"` can be useful when investigating whether a problem is
// related to compiler optimization.
//
// It should not be used as a replacement for fixing a Rules of React
// violation or another underlying correctness problem.
const DebugExample: FC<DebugExampleProps> = ({ value }): ReactElement => {
  "use no memo";

  return <p>Value: {value}</p>;
};

// A useful debugging sequence is:
//
// 1. Reproduce the problem with the compiler enabled.
// 2. Temporarily add `"use no memo"` to the affected function.
// 3. Check whether the behavior changes.
// 4. Investigate Rules of React violations or other underlying causes.
// 5. Remove the directive after the underlying problem is fixed.
//
// `"use no memo"` is therefore an isolation mechanism, not a performance
// recommendation.

// ---------------------------------------------------------------------
// 12. Documenting an opt-out
// ---------------------------------------------------------------------

// If `"use no memo"` is necessary, the reason should be documented.
//
// For example:
//
// const ThirdPartyWrapper: FC = (): ReactElement => {
//     "use no memo"; // Temporary workaround for an incompatible integration.
//     return <ThirdPartyComponent />;
// };
//
// A bare `"use no memo"` makes the reason for the exception difficult
// to understand later.

// ---------------------------------------------------------------------
// 13. Directives and Rules of React
// ---------------------------------------------------------------------

// Compiler directives do not make invalid React code safe.
//
// The compiler relies on code following the Rules of React and other
// assumptions required for correct optimization.
//
// For example, a component should not conditionally call Hooks:
//
// const InvalidComponent = (enabled: boolean): ReactElement => {
//     if (enabled) {
//         useState(0);
//     }
//
//     return <p>Invalid Hook usage.</p>;
// };
//
// Adding `"use memo"` would not make this code valid.
//
// Correctness comes first; directives control compiler participation.

// ---------------------------------------------------------------------
// 14. Directives do not replace algorithmic optimization
// ---------------------------------------------------------------------

// Compiler optimization does not automatically turn an inefficient
// algorithm into an efficient one.
//
// For example, this still performs a linear search for every item:
//
// const ContainsAll = (items: readonly string[], values: readonly string[]): boolean => {
//     "use memo";
//
//     return values.every((value) => items.includes(value));
// };
//
// `"use memo"` may allow React Compiler to optimize compatible calculations,
// but the algorithm itself still has its original computational complexity.
//
// Performance work still includes choosing appropriate algorithms,
// reducing unnecessary work, and measuring actual bottlenecks.

// ---------------------------------------------------------------------
// 15. Directives do not replace code splitting
// ---------------------------------------------------------------------

// Compiler directives affect compilation and optimization of functions.
// They do not split JavaScript into separate network-loaded chunks.
//
// Code splitting still requires mechanisms such as dynamic `import()`:
//
// const loadFeature = async (): Promise<unknown> => {
//     return import("./feature");
// };
//
// The compiler directive and code splitting operate at different layers:
//
// - compiler directives control compiler optimization.
// - dynamic imports control when code is loaded.
// - lazy loading controls when features become available.
// - resource strategies control network loading behavior.

// ---------------------------------------------------------------------
// 16. Directives do not replace virtualization
// ---------------------------------------------------------------------

interface Item {
  readonly id: number;
  readonly label: string;
}

interface ItemListProps {
  readonly items: readonly Item[];
}

// Optimizing this component does not change the number of DOM nodes it
// renders. If thousands of items are rendered, they are still rendered.
const LargeItemList: FC<ItemListProps> = ({ items }): ReactElement => {
  "use memo";

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
};

// Virtualization is a separate rendering strategy that limits how many
// rows are mounted at once. Compiler optimization and virtualization can
// therefore address different sources of performance cost.

// ---------------------------------------------------------------------
// 17. Module-level directives
// ---------------------------------------------------------------------

// Directives can also appear at the top of a module:
//
// "use memo";
//
// All functions in that module are affected by the module-level directive,
// subject to the compiler's configuration and compilation rules.
//
// A function-level directive can override the module-level behavior:
//
// function IncludedComponent() {
//     return <p>Included.</p>;
// }
//
// function ExcludedComponent() {
//     "use no memo";
//     return <p>Excluded.</p>;
// }
//
// A module-level directive should therefore be treated as a broad policy,
// while a function-level directive provides a narrower exception.

// ---------------------------------------------------------------------
// 18. Gradual adoption
// ---------------------------------------------------------------------

// Directives can support incremental adoption of React Compiler.
//
// A project can use annotation mode and explicitly mark selected components
// and Hooks with `"use memo"`:
//
// const AdoptedComponent: FC = (): ReactElement => {
//     "use memo";
//
//     return <p>Compiler adoption can begin here.</p>;
// };
//
// After validating the behavior and performance of compiled code, a project
// can expand compiler coverage or move toward automatic inference.
//
// This allows compiler adoption to be evaluated incrementally rather than
// requiring every component to be changed at once.

// ---------------------------------------------------------------------
// 19. Integrated example
// ---------------------------------------------------------------------

interface DashboardProps {
  readonly name: string;
  readonly count: number;
}

const DashboardHeader: FC<{ readonly name: string }> = ({ name }): ReactElement => {
  "use memo";

  return <h2>Welcome, {name}</h2>;
};

const DashboardCount: FC<{ readonly count: number }> = ({ count }): ReactElement => {
  "use memo";

  return <p>Items: {count}</p>;
};

// This component intentionally opts out of compiler optimization.
//
// In a real application, an opt-out should have a concrete reason and
// normally be temporary.
const DashboardDiagnostic: FC = (): ReactElement => {
  "use no memo";

  return <small>Diagnostic information</small>;
};

const CompilerDirectivesDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <DashboardHeader name="John Doe" />
      <DashboardCount count={count} />
      <DashboardDiagnostic />

      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

export default CompilerDirectivesDemo;

// ---------------------------------------------------------------------
// 20. Practical guidance
// ---------------------------------------------------------------------

// Prefer normal React code and let React Compiler optimize compatible code
// when the project uses its default inference-based compilation.
//
// Use `"use memo"` when explicit opt-in is required, such as annotation mode,
// or when a specific function needs to be explicitly included.
//
// Use `"use no memo"` sparingly when temporarily isolating a compiler-related
// issue or excluding a known incompatible function.
//
// Directives should not be added merely because a component renders often.
// Measure performance and keep the underlying React code correct first.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `"use memo"` explicitly opts a function into React Compiler optimization.
// - `"use no memo"` explicitly excludes a function from React Compiler optimization.
// - A function-level directive must appear as the first statement in the function body.
// - Module-level directives can establish compiler behavior for an entire module.
// - Function-level directives can override module-level compiler directives.
// - In `infer` mode, React Compiler normally detects components and Hooks automatically.
// - `annotation` mode can use `"use memo"` for explicit, incremental compiler adoption.
// - `"use no memo"` is primarily a temporary debugging or compatibility escape hatch.
// - Compiler directives control compiler participation; they are not replacements for `useMemo`, `useCallback`, or `memo` in every situation.
// - Compiler optimization does not replace algorithmic optimization, code splitting, virtualization, or resource optimization.
// - Directives do not make code that violates the Rules of React correct.
// - For new code, prefer normal React code and use directives only when explicit compiler control is actually needed.

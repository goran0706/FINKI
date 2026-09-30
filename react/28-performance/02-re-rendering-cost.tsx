/**
 * Re-rendering Cost
 * ==================
 *
 * A re-render occurs when React executes a component again to determine what its UI should look like
 * after an update. Re-renders are normal, but unnecessary or expensive re-renders can increase the
 * amount of JavaScript work React performs during frequent or large updates.
 *
 * Re-rendering should be understood separately from DOM mutation: a component can re-render while
 * React determines that little or nothing needs to change in the DOM.
 */

import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. State updates trigger re-renders
// ---------------------------------------------------------------------

const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("Counter rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Calling the state setter schedules an update for the component.
// React renders the component again to determine the next UI.
// The render itself does not mean that the entire DOM subtree is replaced.

// ---------------------------------------------------------------------
// 2. A parent re-render can re-render descendants
// ---------------------------------------------------------------------

const Child: FC = (): ReactElement => {
  console.log("Child rendered");

  return <p>Child content</p>;
};

const Parent: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("Parent rendered");

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

// When Parent re-renders, React normally evaluates Child again as part of rendering the subtree.
// This can happen even though Child does not receive any changing props.
// React can later determine that Child's existing DOM can be reused.

// ---------------------------------------------------------------------
// 3. Re-rendering does not mean DOM replacement
// ---------------------------------------------------------------------

const StableMarkup: FC = (): ReactElement => {
  console.log("StableMarkup rendered");

  return <p>This paragraph stays the same.</p>;
};

const CounterWithStableMarkup: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <StableMarkup />
    </section>
  );
};

// StableMarkup can execute again when its parent renders.
// React compares the newly returned element tree with the previous one.
// If the relevant output has not changed, React can keep the existing DOM.

// ---------------------------------------------------------------------
// 4. Re-rendering can repeat expensive calculations
// ---------------------------------------------------------------------

const calculateTotal = (values: readonly number[]): number => {
  return values.reduce((total, value) => {
    let result = value;

    for (let index = 0; index < 5000; index++) {
      result = Math.sqrt(result * result + index);
    }

    return total + result;
  }, 0);
};

const ExpensiveComponent: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const values = Array.from({ length: 100 }, (_, index) => index + 1);
  const total = calculateTotal(values);

  return (
    <section>
      <p>Count: {count}</p>
      <p>Total: {total.toFixed(2)}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Every render executes calculateTotal again.
// Updating count therefore repeats work that is unrelated to count.
// Whether this matters depends on the calculation's actual cost and how frequently the component renders.

// ---------------------------------------------------------------------
// 5. Re-rendering can repeat collection processing
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const ProductDirectory: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const products: readonly Product[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    name: `Product ${index + 1}`,
    price: (index + 1) * 10,
  }));

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <p>Matches: {filteredProducts.length}</p>

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price}
          </li>
        ))}
      </ul>
    </section>
  );
};

// Each query update causes ProductDirectory to render again.
// The filtering operation and list mapping also execute again.
// For modest collections this may be entirely acceptable; optimization becomes relevant
// when profiling shows that repeated work is materially affecting responsiveness.

// ---------------------------------------------------------------------
// 6. Frequently changing state can increase render frequency
// ---------------------------------------------------------------------

const FrequentlyUpdated: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  return (
    <section>
      <output>{value}</output>
      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Update
      </button>
    </section>
  );
};

// A small render can be inexpensive even when it happens frequently.
// Conversely, expensive rendering performed frequently can consume substantial CPU time.
// Performance analysis therefore considers render frequency together with render duration.

// ---------------------------------------------------------------------
// 7. Local state can limit the affected subtree
// ---------------------------------------------------------------------

const LocalCounter: FC = (): ReactElement => {
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

const PageWithLocalState: FC = (): ReactElement => {
  return (
    <main>
      <h1>Page</h1>
      <LocalCounter />
    </main>
  );
};

// The state belongs to LocalCounter, so an update to that state schedules work for that component.
// Keeping frequently changing state close to the UI that needs it can avoid making an unrelated
// higher-level component re-render solely because of that state.

// ---------------------------------------------------------------------
// 8. Lifting state can increase the affected render tree
// ---------------------------------------------------------------------

interface SearchResultsProps {
  readonly query: string;
}

const SearchResults: FC<SearchResultsProps> = ({ query }): ReactElement => {
  console.log("SearchResults rendered");

  return <p>Searching for: {query}</p>;
};

const SearchPage: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  console.log("SearchPage rendered");

  return (
    <main>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <SearchResults query={query} />
    </main>
  );
};

// When state is placed in a parent, updates to that state cause the parent to render.
// The parent then renders its descendants as part of producing the next subtree.
// This is not inherently a problem; state placement should primarily follow data ownership and UI needs.
// Performance considerations become important when a frequently changing parent contains expensive subtrees.

// ---------------------------------------------------------------------
// 9. Stable props do not automatically prevent re-rendering
// ---------------------------------------------------------------------

interface ProfileProps {
  readonly name: string;
}

const Profile: FC<ProfileProps> = ({ name }): ReactElement => {
  console.log("Profile rendered");

  return <p>{name}</p>;
};

const ProfilePage: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const name = "John Doe";

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Profile name={name} />
    </section>
  );
};

// Profile receives the same primitive prop value on every parent render.
// That fact alone does not make Profile skip rendering.
// A parent re-render normally causes React to evaluate the child again.
// Memoization mechanisms can change this behavior when their comparison conditions are satisfied.

// ---------------------------------------------------------------------
// 10. Object props can change identity on every render
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly user: {
    readonly name: string;
  };
}

const UserCard: FC<UserCardProps> = ({ user }): ReactElement => {
  console.log("UserCard rendered");

  return <p>{user.name}</p>;
};

const UserPage: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const user = { name: "John Doe" };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <UserCard user={user} />
    </section>
  );
};

// The user object is created during every UserPage render.
// Each creation produces a new object reference.
// If a child later uses memoization based on shallow prop comparison,
// this changing reference can prevent the expected bailout.

// ---------------------------------------------------------------------
// 11. Function props can change identity on every render
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly onAction: () => void;
}

const ActionButton: FC<ActionButtonProps> = ({ onAction }): ReactElement => {
  console.log("ActionButton rendered");

  return (
    <button type="button" onClick={onAction}>
      Run action
    </button>
  );
};

const ActionPage: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = (): void => {
    console.log("Action executed");
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ActionButton onAction={handleAction} />
    </section>
  );
};

// handleAction is a new function object each time ActionPage renders.
// Function identity can therefore become relevant when a child is memoized
// and receives callbacks as props.

// ---------------------------------------------------------------------
// 12. Re-rendering and reconciliation are related but distinct
// ---------------------------------------------------------------------

const ReconciliationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h2>Counter</h2>
      <p>{count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The component renders a new React element tree after count changes.
// React reconciles that result with the previous tree.
// Because the element types and structure remain compatible, React can update
// the existing DOM rather than replacing the entire section.

// ---------------------------------------------------------------------
// 13. Re-rendering is not automatically a performance problem
// ---------------------------------------------------------------------

const NormalComponent: FC = (): ReactElement => {
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

// Re-rendering is a normal part of React's update model.
// A component should not be optimized merely because it renders.
// Optimization is justified when measurement shows that rendering work contributes meaningfully
// to CPU usage, input latency, frame drops, or other observable performance problems.

// ---------------------------------------------------------------------
// 14. Measurement identifies expensive re-renders
// ---------------------------------------------------------------------

const MeasuredSubtree: FC = (): ReactElement => {
  const items = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

// React DevTools Profiler can show component render activity and commit durations.
// Browser performance tools can provide additional information about JavaScript execution,
// scripting time, rendering, painting, and user interaction.
// These measurements help determine whether a re-render is actually expensive.

// ---------------------------------------------------------------------
// 15. Integrated example
// ---------------------------------------------------------------------

const ReRenderingCostDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const items = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    label: `Item ${index + 1}`,
  }));

  console.log("ReRenderingCostDemo rendered");

  return (
    <main>
      <h1>Re-rendering cost</h1>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </main>
  );
};

export default ReRenderingCostDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A state update can cause React to render a component again.
// - Parent re-renders normally cause React to evaluate descendant components.
// - Re-rendering does not mean that the DOM subtree is replaced.
// - Expensive calculations and collection processing can be repeated during re-renders.
// - Render frequency matters alongside the amount of work performed by each render.
// - Local state can keep frequently changing updates closer to the UI that owns them.
// - Object and function props can acquire new references during every parent render.
// - Stable props do not automatically prevent a child component from rendering.
// - Re-rendering is normal and should not be optimized solely because it occurs.
// - Profiling should identify whether repeated rendering is an actual performance problem.

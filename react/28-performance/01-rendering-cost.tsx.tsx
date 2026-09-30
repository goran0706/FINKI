/**
 * Rendering Cost
 * ==============
 *
 * React rendering is the process of calling components to determine what the UI should look like.
 * A render is not the same as a DOM update: React can render a component and then determine that
 * no DOM changes are necessary.
 *
 * Rendering has a cost because React must execute component functions, evaluate JSX, create React
 * elements, and reconcile the resulting tree. Understanding these costs helps distinguish expensive
 * rendering from expensive DOM updates and provides the foundation for later performance techniques.
 */

import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. A render executes the component function
// ---------------------------------------------------------------------

interface RenderExampleProps {
  readonly label: string;
}

const RenderExample: FC<RenderExampleProps> = ({ label }): ReactElement => {
  console.log("RenderExample executed");

  return <p>{label}</p>;
};

// ---------------------------------------------------------------------
// 2. Rendering produces a React element tree
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const ProductCard: FC<{ readonly product: Product }> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </article>
  );
};

const ProductList: FC = (): ReactElement => {
  const products: readonly Product[] = [
    { id: 1, name: "Keyboard", price: 80 },
    { id: 2, name: "Mouse", price: 40 },
    { id: 3, name: "Monitor", price: 300 },
  ];

  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Rendering is different from committing DOM changes
// ---------------------------------------------------------------------

const RenderVsCommit: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("Render phase: component executed");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// React first renders the component to determine the next React element tree.
// React then compares that result with the previous tree during reconciliation.
// Only the necessary DOM changes are committed.
// A render therefore does not mean that every rendered element is recreated in the DOM.

// ---------------------------------------------------------------------
// 4. Rendering has CPU work
// ---------------------------------------------------------------------

interface Item {
  readonly id: number;
  readonly name: string;
}

const ItemList: FC = (): ReactElement => {
  const items: readonly Item[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
  }));

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// The cost of rendering depends partly on the work performed while the component executes.
// Mapping a large collection, filtering data, formatting values, and constructing complex
// element trees all consume CPU time during rendering.

// ---------------------------------------------------------------------
// 5. Expensive rendering work
// ---------------------------------------------------------------------

const expensiveCalculation = (items: readonly number[]): number => {
  return items.reduce((total, value) => {
    let result = value;

    for (let index = 0; index < 5000; index++) {
      result = Math.sqrt(result * result + index);
    }

    return total + result;
  }, 0);
};

const ExpensiveRender: FC = (): ReactElement => {
  const values = Array.from({ length: 100 }, (_, index) => index + 1);
  const result = expensiveCalculation(values);

  return <output>Result: {result.toFixed(2)}</output>;
};

// This calculation runs every time ExpensiveRender renders.
// The important performance characteristic is not the number of lines of JSX,
// but the amount of work performed while producing the next UI.

// ---------------------------------------------------------------------
// 6. Parent rendering can cause child rendering
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
      <p>Parent count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Child />
    </section>
  );
};

// When Parent renders, React normally calls Child again as part of rendering the subtree.
// This does not necessarily mean that Child's DOM node is replaced.
// React can reconcile the new result against the previous result and commit only required changes.
// Later performance techniques can sometimes allow unchanged subtrees to bail out of rendering.

// ---------------------------------------------------------------------
// 7. Not every render produces a DOM mutation
// ---------------------------------------------------------------------

const StaticChild: FC = (): ReactElement => {
  console.log("StaticChild rendered");

  return <p>This content does not change.</p>;
};

const CounterWithStaticChild: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <StaticChild />
    </section>
  );
};

// CounterWithStaticChild can re-render after the state update.
// StaticChild can also be rendered again, but its returned output remains the same.
// React's reconciliation determines whether the existing DOM can be reused.
// Rendering work and DOM mutation are therefore separate costs.

// ---------------------------------------------------------------------
// 8. Rendering cost is contextual
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
}

const UserList: FC<{ readonly users: readonly User[] }> = ({ users }): ReactElement => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

const UserDirectory: FC = (): ReactElement => {
  const users: readonly User[] = Array.from({ length: 500 }, (_, index) => ({
    id: index,
    name: `User ${index + 1}`,
  }));

  return <UserList users={users} />;
};

// Rendering 500 simple list items may be inexpensive on one application and noticeable on another.
// The actual cost depends on component complexity, tree size, data processing, device performance,
// render frequency, and how often updates occur.

// ---------------------------------------------------------------------
// 9. Render frequency matters
// ---------------------------------------------------------------------

const FrequentlyUpdatedComponent: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  return (
    <section>
      <p>Value: {value}</p>
      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Update
      </button>
    </section>
  );
};

// A component that performs moderate work once may be harmless.
// The same work performed hundreds of times can become significant.
// Performance analysis therefore considers both how expensive a render is and how frequently it occurs.

// ---------------------------------------------------------------------
// 10. Rendering cost versus DOM cost
// ---------------------------------------------------------------------

const ExampleApplication: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Rendering example</h1>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <p>This element can remain unchanged in the DOM.</p>
    </main>
  );
};

// An update can require React to execute component code and reconcile a subtree
// while ultimately changing only the text node containing the count.
// Measuring DOM mutations alone therefore does not fully describe rendering cost.

// ---------------------------------------------------------------------
// 11. Rendering cost should be measured before optimizing
// ---------------------------------------------------------------------

const MeasurableComponent: FC = (): ReactElement => {
  const items = Array.from({ length: 200 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

// Performance optimization should be based on observed work rather than assumptions.
// React DevTools Profiler and browser performance tools can help identify components,
// commits, render durations, and expensive JavaScript work.

// ---------------------------------------------------------------------
// 12. Integrated example
// ---------------------------------------------------------------------

const RenderingCostDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const items = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    label: `Item ${index + 1}`,
  }));

  return (
    <main>
      <h1>Rendering cost</h1>
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

export default RenderingCostDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Rendering means executing components to determine the next React element tree.
// - Rendering work and DOM mutations are different phases of an update.
// - React can render a component without replacing its existing DOM nodes.
// - Component execution, JSX creation, data processing, and reconciliation consume CPU time.
// - Parent renders normally cause React to render descendants unless a bailout prevents that work.
// - Rendering cost depends on both the amount of work per render and how frequently rendering occurs.
// - Performance optimization should be guided by measurement rather than assumptions.

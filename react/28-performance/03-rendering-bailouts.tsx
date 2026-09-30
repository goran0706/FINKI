/**
 * Rendering Bailouts
 * ===================
 *
 * A rendering bailout occurs when React can avoid rendering part of a component tree because
 * React can determine that the relevant inputs have not changed. Bailouts reduce rendering work,
 * but they do not mean that a component never renders or that every unchanged DOM node requires
 * a separate bailout.
 *
 * Bailouts are closely related to state, props, context, reference identity, and memoization.
 * Understanding when React can reuse existing work is important before applying performance optimizations.
 */

import { memo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. A state update normally renders the updated component
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

// A state update schedules work for the component that owns that state.
// React must evaluate the component to determine whether its output has changed.

// ---------------------------------------------------------------------
// 2. Setting state to the same value can bail out
// ---------------------------------------------------------------------

const SameStateValue: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("SameStateValue rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount(count)}>
        Set to current value
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// React compares a new state value with the current state using Object.is semantics.
// When the new state is the same value, React can skip scheduling the update work that would
// otherwise be necessary for the component. This is one example of a state-level bailout.

// ---------------------------------------------------------------------
// 3. React.memo can skip a child render
// ---------------------------------------------------------------------

interface LabelProps {
  readonly label: string;
}

const Label: FC<LabelProps> = memo(({ label }): ReactElement => {
  console.log("Label rendered");

  return <p>{label}</p>;
});

const MemoizedChildExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Label label="Static label" />
    </section>
  );
};

// memo creates a memoized component that can skip re-rendering when its props are unchanged.
// In this example, count changes but Label receives the same primitive string value.
// React can therefore bail out of rendering Label.

// ---------------------------------------------------------------------
// 4. React.memo uses shallow prop comparison by default
// ---------------------------------------------------------------------

interface ProfileProps {
  readonly name: string;
  readonly age: number;
}

const Profile: FC<ProfileProps> = memo(({ name, age }): ReactElement => {
  console.log("Profile rendered");

  return (
    <article>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </article>
  );
});

const ProfileExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Profile name="John Doe" age={30} />
    </section>
  );
};

// React.memo compares each incoming prop with its previous value using Object.is.
// Primitive values such as the string "John Doe" and number 30 remain equal here,
// so Profile can bail out when only the parent's count changes.

// ---------------------------------------------------------------------
// 5. New object references can prevent a bailout
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserCardProps {
  readonly user: User;
}

const UserCard: FC<UserCardProps> = memo(({ user }): ReactElement => {
  console.log("UserCard rendered");

  return <p>{user.name}</p>;
});

const ObjectPropExample: FC = (): ReactElement => {
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

// user is created again whenever ObjectPropExample renders.
// Each object literal creates a new reference.
// Even though the object's contents are the same, the user prop is not Object.is-equal
// to the previous user object, so UserCard cannot bail out based on its default comparison.

// ---------------------------------------------------------------------
// 6. New function references can prevent a bailout
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly onAction: () => void;
}

const ActionButton: FC<ActionButtonProps> = memo(({ onAction }): ReactElement => {
  console.log("ActionButton rendered");

  return (
    <button type="button" onClick={onAction}>
      Run action
    </button>
  );
});

const FunctionPropExample: FC = (): ReactElement => {
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

// A function declared inside the component is recreated on every render.
// The new function reference differs from the previous reference.
// React.memo therefore cannot use its default prop comparison to bail out ActionButton.

// ---------------------------------------------------------------------
// 7. A stable primitive prop is easier to compare
// ---------------------------------------------------------------------

const StablePrimitiveChild: FC<{ readonly status: string }> = memo(({ status }): ReactElement => {
  console.log("StablePrimitiveChild rendered");

  return <p>Status: {status}</p>;
});

const StablePrimitiveExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <StablePrimitiveChild status="ready" />
    </section>
  );
};

// Primitive props can often remain stable naturally.
// When a memoized child receives the same primitive values after a parent update,
// React can compare them directly and potentially bail out of rendering the child.

// ---------------------------------------------------------------------
// 8. Custom comparison functions can control a memo bailout
// ---------------------------------------------------------------------

interface AccountProps {
  readonly id: number;
  readonly name: string;
}

const areAccountsEqual = (previous: AccountProps, next: AccountProps): boolean => {
  return previous.id === next.id && previous.name === next.name;
};

const Account: FC<AccountProps> = memo(({ id, name }): ReactElement => {
  console.log("Account rendered");

  return (
    <article>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
    </article>
  );
}, areAccountsEqual);

// A custom comparison function can tell React whether the previous and next props
// should be treated as equivalent for memoization.
// The comparison itself has a cost, so it should be simpler and cheaper than the rendering work
// it is intended to avoid.

// ---------------------------------------------------------------------
// 9. Memoization does not bypass state updates inside the component
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly label: string;
}

const Toggle: FC<ToggleProps> = memo(({ label }): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  console.log("Toggle rendered");

  return (
    <button type="button" onClick={() => setEnabled((value) => !value)}>
      {label}: {enabled ? "On" : "Off"}
    </button>
  );
});

const ToggleExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Parent count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment parent
      </button>
      <Toggle label="Notifications" />
    </section>
  );
};

// memo only controls whether a component can skip rendering caused by unchanged props.
// Toggle's own state updates still cause Toggle to render.
// Memoization does not freeze the component or prevent its internal state from updating.

// ---------------------------------------------------------------------
// 10. Context updates can bypass prop-based memoization
// ---------------------------------------------------------------------

// React context is intentionally omitted from this example because a context provider
// requires a context definition and consumer relationship to demonstrate the behavior clearly.
// A memoized component that reads a context still needs to render when the consumed context value changes.
// memo compares props; it does not make a component independent of the context it consumes.

// ---------------------------------------------------------------------
// 11. Children and component identity matter
// ---------------------------------------------------------------------

interface PanelProps {
  readonly children: ReactElement;
}

const Panel: FC<PanelProps> = memo(({ children }): ReactElement => {
  console.log("Panel rendered");

  return <div>{children}</div>;
});

const ChildrenExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Panel>
        <p>Static content</p>
      </Panel>
    </section>
  );
};

// JSX passed as children is a React element object.
// A new JSX expression can produce a new element object when the parent renders.
// Because children is a prop, its reference identity can affect memoization.
// This means wrapping a component in memo does not guarantee a bailout when its props,
// including children, receive new references.

// ---------------------------------------------------------------------
// 12. Keys help reconciliation preserve identity
// ---------------------------------------------------------------------

interface Item {
  readonly id: number;
  readonly name: string;
}

const List: FC<{ readonly items: readonly Item[] }> = ({ items }): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// Keys identify corresponding elements among siblings across renders.
// Stable keys allow React's reconciliation algorithm to preserve the identity of matching items.
// Keys are not a general-purpose rendering bailout mechanism, but they can prevent unnecessary
// remounting and help React reconcile list changes correctly.

// ---------------------------------------------------------------------
// 13. Bailouts do not mean React skips the entire update
// ---------------------------------------------------------------------

const Header: FC = memo((): ReactElement => {
  console.log("Header rendered");

  return <header>Application header</header>;
});

const Content: FC = (): ReactElement => {
  console.log("Content rendered");

  return <p>Current content</p>;
};

const Page: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <main>
      <Header />
      <Content />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </main>
  );
};

// A bailout applies to the work React can safely skip.
// It does not mean that every component in the application is skipped for every update.
// In this example, Header may bail out while Page and Content still participate in the update.

// ---------------------------------------------------------------------
// 14. Bailouts depend on the kind of update
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
}

const Message: FC<MessageProps> = memo(({ message }): ReactElement => {
  console.log("Message rendered");

  return <p>{message}</p>;
});

const UpdateExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Hello");

  return (
    <section>
      <p>Count: {count}</p>
      <Message message={message} />

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Update count
      </button>
      <button type="button" onClick={() => setMessage("Hello")}>
        Set same message
      </button>
      <button type="button" onClick={() => setMessage("Goodbye")}>
        Change message
      </button>
    </section>
  );
};

// Updating count leaves Message's prop unchanged, so Message can bail out.
// Setting message to the existing "Hello" value does not produce a different state value.
// Changing message to "Goodbye" changes the prop, so Message must render to determine its new output.

// ---------------------------------------------------------------------
// 15. Bailouts are an optimization, not a correctness requirement
// ---------------------------------------------------------------------

const OrdinaryComponent: FC<{ readonly value: string }> = ({ value }): ReactElement => {
  return <p>{value}</p>;
};

const OrdinaryExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <OrdinaryComponent value="Static value" />
    </section>
  );
};

// React applications remain correct without manually adding memoization to every component.
// Bailouts are performance optimizations that reduce work when React can safely determine
// that rendering a subtree again is unnecessary.

// ---------------------------------------------------------------------
// 16. Bailouts should be guided by measurement
// ---------------------------------------------------------------------

const MeasuredComponent: FC = memo((): ReactElement => {
  const items = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`);

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});

// memo is not automatically beneficial for every component.
// Comparing props, maintaining memoization boundaries, and preserving references can also add complexity.
// Profiling should establish that skipped rendering provides a meaningful benefit.

// ---------------------------------------------------------------------
// 17. Integrated example
// ---------------------------------------------------------------------

interface SummaryProps {
  readonly name: string;
}

const Summary: FC<SummaryProps> = memo(({ name }): ReactElement => {
  console.log("Summary rendered");

  return <p>User: {name}</p>;
});

const RenderingBailoutDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Rendering bailouts</h1>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>

      <Summary name="John Doe" />
    </main>
  );
};

export default RenderingBailoutDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A rendering bailout allows React to skip work when it can determine that relevant inputs are unchanged.
// - State updates to the same value can allow React to avoid unnecessary update work.
// - React.memo can allow a child to bail out when its props remain equivalent.
// - React.memo uses Object.is comparison for each prop by default.
// - New object and function references can prevent a memoized child from bailing out.
// - Custom memo comparison functions can change how prop equality is determined.
// - memo does not prevent a component from rendering when its own state changes.
// - Context updates can cause a memoized component that consumes that context to render.
// - Keys help React preserve element identity during list reconciliation but are not general-purpose memoization.
// - A bailout can skip specific work without skipping the entire update.
// - Bailouts are performance optimizations, not requirements for correct React behavior.
// - Profiling should determine whether the rendering work being avoided is significant enough to justify optimization.

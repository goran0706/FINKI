/**
 * HOC vs. Render Props vs. Hooks
 * ==============================
 *
 * Higher-order components, render props, and custom hooks are different patterns for sharing
 * reusable behavior between React components. They can solve similar problems, but they place
 * the shared behavior at different boundaries and expose that behavior through different APIs.
 */

import { useState, type ComponentType, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Shared behavior
// ---------------------------------------------------------------------

interface CounterState {
  readonly count: number;
  readonly increment: () => void;
}

const useCounterState = (initialValue = 0): CounterState => {
  const [count, setCount] = useState(initialValue);

  const increment = (): void => {
    setCount((currentCount) => currentCount + 1);
  };

  return { count, increment };
};

// ---------------------------------------------------------------------
// 2. Custom hook approach
// ---------------------------------------------------------------------

export const HookCounter: FC = (): ReactElement => {
  const { count, increment } = useCounterState();

  return (
    <section>
      <h2>Custom Hook</h2>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

// The component calls the hook directly and decides how to use its returned values.
// The hook shares the behavior without introducing another component into the tree.

// ---------------------------------------------------------------------
// 3. Render props approach
// ---------------------------------------------------------------------

interface CounterRenderProps {
  readonly count: number;
  readonly increment: () => void;
}

interface CounterRenderPropProps {
  readonly children: (state: CounterRenderProps) => ReactNode;
}

export const CounterRenderProp: FC<CounterRenderPropProps> = ({ children }): ReactElement => {
  const { count, increment } = useCounterState();

  return <>{children({ count, increment })}</>;
};

export const RenderPropCounter: FC = (): ReactElement => (
  <CounterRenderProp>
    {({ count, increment }) => (
      <section>
        <h2>Render Prop</h2>
        <p>Count: {count}</p>
        <button type="button" onClick={increment}>
          Increment
        </button>
      </section>
    )}
  </CounterRenderProp>
);

// The reusable behavior is owned by the render-prop component.
// The child function determines the UI produced from that behavior.

// ---------------------------------------------------------------------
// 4. Higher-order component approach
// ---------------------------------------------------------------------

interface CounterInjectedProps {
  readonly count: number;
  readonly increment: () => void;
}

export const withCounter = <Props extends object>(
  Component: ComponentType<Props & CounterInjectedProps>,
): FC<Props> => {
  const WithCounter: FC<Props> = (props): ReactElement => {
    const { count, increment } = useCounterState();

    return <Component {...props} count={count} increment={increment} />;
  };

  return WithCounter;
};

interface CounterViewProps extends CounterInjectedProps {}

export const CounterView: FC<CounterViewProps> = ({ count, increment }): ReactElement => (
  <section>
    <h2>Higher-Order Component</h2>
    <p>Count: {count}</p>
    <button type="button" onClick={increment}>
      Increment
    </button>
  </section>
);

export const EnhancedCounter = withCounter(CounterView);

export const HocCounter: FC = (): ReactElement => <EnhancedCounter />;

// The HOC owns the reusable behavior and injects its result as props.
// The wrapped component remains focused on rendering those injected values.

// ---------------------------------------------------------------------
// 5. Comparing the component boundaries
// ---------------------------------------------------------------------

interface ComparisonProps {
  readonly title: string;
  readonly description: string;
}

export const ComparisonNote: FC<ComparisonProps> = ({ title, description }): ReactElement => (
  <article>
    <h2>{title}</h2>
    <p>{description}</p>
  </article>
);

export const PatternBoundaries: FC = (): ReactElement => (
  <div>
    <ComparisonNote
      title="Custom Hook"
      description="The consuming component calls the hook and receives reusable state and behavior directly."
    />

    <ComparisonNote
      title="Render Prop"
      description="A component owns reusable behavior and passes its current values to a render function."
    />

    <ComparisonNote
      title="Higher-Order Component"
      description="A function wraps a component and returns another component with additional behavior."
    />
  </div>
);

// ---------------------------------------------------------------------
// 6. Different consumers of the same behavior
// ---------------------------------------------------------------------

export const HookConsumer: FC = (): ReactElement => {
  const { count, increment } = useCounterState();

  return (
    <div>
      <strong>Hook consumer:</strong> {count}
      <button type="button" onClick={increment}>
        +
      </button>
    </div>
  );
};

export const RenderPropConsumer: FC = (): ReactElement => (
  <CounterRenderProp>
    {({ count, increment }) => (
      <div>
        <strong>Render prop consumer:</strong> {count}
        <button type="button" onClick={increment}>
          +
        </button>
      </div>
    )}
  </CounterRenderProp>
);

export const HocConsumer: FC = (): ReactElement => {
  const EnhancedValue: FC<CounterInjectedProps> = ({ count, increment }): ReactElement => (
    <div>
      <strong>HOC consumer:</strong> {count}
      <button type="button" onClick={increment}>
        +
      </button>
    </div>
  );

  const ConnectedValue = withCounter(EnhancedValue);

  return <ConnectedValue />;
};

// The behavior is similar in each example, but the integration point differs.
// Hooks are called directly, render props use a callback, and HOCs wrap components.

// ---------------------------------------------------------------------
// 7. Component tree implications
// ---------------------------------------------------------------------

export const TreeExample: FC = (): ReactElement => (
  <section>
    <HookCounter />

    <CounterRenderProp>
      {({ count, increment }) => (
        <div>
          <p>Render prop count: {count}</p>
          <button type="button" onClick={increment}>
            Increment
          </button>
        </div>
      )}
    </CounterRenderProp>

    <EnhancedCounter />
  </section>
);

// The hook approach does not require an additional wrapper component.
// The render-prop approach introduces a component that invokes the render function.
// The HOC approach creates a new component that wraps the original component.

// ---------------------------------------------------------------------
// 8. Composition differences
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserViewProps {
  readonly user: User;
}

export const UserView: FC<UserViewProps> = ({ user }): ReactElement => <p>{user.name}</p>;

interface WithUserProps {
  readonly user: User;
}

export const withUser = <Props extends object>(Component: ComponentType<Props & WithUserProps>): FC<Props> => {
  const WithUser: FC<Props> = (props): ReactElement => {
    const user: User = {
      name: "John Doe",
    };

    return <Component {...props} user={user} />;
  };

  return WithUser;
};

export const ConnectedUserView = withUser(UserView);

// HOCs compose by wrapping components.
// Render props compose by nesting or combining render functions.
// Hooks compose by calling multiple hooks inside the same component.

// ---------------------------------------------------------------------
// 9. Choosing the integration model
// ---------------------------------------------------------------------

interface PatternDescriptionProps {
  readonly pattern: string;
  readonly integration: string;
}

export const PatternDescription: FC<PatternDescriptionProps> = ({ pattern, integration }): ReactElement => (
  <li>
    <strong>{pattern}:</strong> {integration}
  </li>
);

export const PatternComparison: FC = (): ReactElement => (
  <ul>
    <PatternDescription pattern="Custom hook" integration="Call the hook from the component that needs the behavior." />
    <PatternDescription
      pattern="Render prop"
      integration="Provide a function that receives the shared behavior and returns UI."
    />
    <PatternDescription
      pattern="Higher-order component"
      integration="Wrap a component with a function that adds behavior or injected props."
    />
  </ul>
);

// These are different composition mechanisms rather than interchangeable syntax.
// The appropriate model depends on where the behavior should be exposed and how it should be consumed.

// ---------------------------------------------------------------------
// 10. Complete comparison example
// ---------------------------------------------------------------------

export const HocVsRenderPropsVsHooksDemo: FC = (): ReactElement => (
  <div>
    <HookCounter />
    <RenderPropCounter />
    <HocCounter />
    <PatternBoundaries />
    <TreeExample />
    <ConnectedUserView />
    <PatternComparison />
  </div>
);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom hooks expose reusable behavior directly to the component that calls the hook.
// - Render props expose reusable behavior through a function that determines the rendered UI.
// - Higher-order components expose reusable behavior by returning an enhanced component.
// - Hooks integrate behavior directly into a component without requiring a wrapper component.
// - Render props preserve flexible rendering through a callback but introduce a render-function boundary.
// - HOCs can inject props and compose behavior around components but introduce wrapper components.
// - The three patterns can solve related problems while producing different component APIs and composition structures.
// - The important distinction is where shared behavior lives and how consumers receive it.

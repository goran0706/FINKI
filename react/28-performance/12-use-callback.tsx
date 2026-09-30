/**
 * useCallback
 * ===========
 *
 * useCallback is a React Hook that caches a function definition between renders until its
 * dependencies change. It is primarily useful when function reference identity matters, such as
 * when passing callbacks to memoized components or using them as dependencies of other Hooks.
 */

import { memo, useCallback, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic useCallback syntax
// ---------------------------------------------------------------------

const BasicUseCallbackExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={handleAction}>
        Run action
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// useCallback returns a function reference.
// With an empty dependency array, React can reuse that reference across renders
// of the same component instance while the component remains mounted.

// ---------------------------------------------------------------------
// 2. Functions normally receive new references during rendering
// ---------------------------------------------------------------------

const RegularFunctionExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = (): void => {
    console.log("Action");
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={handleAction}>
        Run action
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// handleAction is created again whenever RegularFunctionExample renders.
// The function can have identical behavior on every render while still receiving a new reference.

// ---------------------------------------------------------------------
// 3. useCallback preserves function identity
// ---------------------------------------------------------------------

const FunctionIdentityExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={handleAction}>
        Run action
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// When count changes, handleAction can retain the same function reference.
// This matters only when some identity-sensitive mechanism can benefit from that stability.

// ---------------------------------------------------------------------
// 4. useCallback dependencies determine when the function changes
// ---------------------------------------------------------------------

const DependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const logCount = useCallback((): void => {
    console.log("Count:", count);
  }, [count]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={logCount}>
        Log count
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// logCount reads count from its closure.
// When count changes, the callback must be recreated so that it captures the new value.
// count is therefore included in the dependency array.

// ---------------------------------------------------------------------
// 5. A stable callback can close over stable values
// ---------------------------------------------------------------------

const StableClosureExample: FC = (): ReactElement => {
  const message = "Action";

  const handleAction = useCallback((): void => {
    console.log(message);
  }, [message]);

  return (
    <button type="button" onClick={handleAction}>
      Run action
    </button>
  );
};

// message is a primitive value that remains equal between these renders.
// The callback can therefore retain its reference while message remains unchanged.

// ---------------------------------------------------------------------
// 6. useCallback can stabilize a function prop
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

const StableFunctionPropExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

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

// ActionButton is memoized and receives a stable callback reference.
// When count changes, the onAction prop can remain equal, allowing ActionButton to skip
// a parent-driven render when no other relevant input changed.

// ---------------------------------------------------------------------
// 7. Without useCallback, a memoized child receives a new function
// ---------------------------------------------------------------------

const UnstableFunctionPropExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = (): void => {
    console.log("Action");
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

// handleAction receives a new reference whenever the parent renders.
// React.memo compares the function prop by reference, so ActionButton cannot use that prop
// to bail out when the parent creates a new callback.

// ---------------------------------------------------------------------
// 8. useCallback is often paired with React.memo
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserCardProps {
  readonly user: User;
  readonly onSelect: () => void;
}

const UserCard: FC<UserCardProps> = memo(({ user, onSelect }): ReactElement => {
  console.log("UserCard rendered");

  return (
    <article>
      <p>{user.name}</p>
      <button type="button" onClick={onSelect}>
        Select
      </button>
    </article>
  );
});

const MemoizedPropsExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [user] = useState<User>({
    name: "John Doe",
  });

  const handleSelect = useCallback((): void => {
    console.log(`${user.name} selected`);
  }, [user]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <UserCard user={user} onSelect={handleSelect} />
    </section>
  );
};

// Both user and handleSelect retain stable references when count changes.
// UserCard can therefore potentially bail out when the parent changes only count.

// ---------------------------------------------------------------------
// 9. The dependency array must match the callback's reactive inputs
// ---------------------------------------------------------------------

const CompleteDependencyExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");
  const [count, setCount] = useState(0);

  const handleSelect = useCallback((): void => {
    console.log(`Selected: ${name}`);
  }, [name]);

  return (
    <section>
      <p>{name}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setName("Jane Doe")}>
        Change name
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={handleSelect}>
        Select
      </button>
    </section>
  );
};

// name is read by the callback and therefore belongs in the dependency array.
// count is not read by the callback and does not belong there.
// A dependency array should describe the values that the callback actually depends on.

// ---------------------------------------------------------------------
// 10. Missing dependencies can create stale closures
// ---------------------------------------------------------------------

const StaleClosureExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const logCount = useCallback((): void => {
    console.log("Count:", count);
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={logCount}>
        Log count
      </button>
    </section>
  );
};

// The callback reads count but does not list it as a dependency.
// Its reference remains stable, but its closure retains the count value from the render
// in which that callback was created.
// Stable identity is not more important than correct captured values.

// ---------------------------------------------------------------------
// 11. Functional state updates can reduce dependencies
// ---------------------------------------------------------------------

const IncrementExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const increment = useCallback((): void => {
    setCount((currentCount) => currentCount + 1);
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

// The callback does not read count directly.
// The functional state-update form receives the current state value when React applies the update.
// This allows increment to remain stable without depending on count.

// ---------------------------------------------------------------------
// 12. useCallback does not make the callback execute less often
// ---------------------------------------------------------------------

const ExecutionExample: FC = (): ReactElement => {
  const handleAction = useCallback((): void => {
    console.log("Action executed");
  }, []);

  return (
    <button type="button" onClick={handleAction}>
      Run action
    </button>
  );
};

// useCallback controls the function's reference identity.
// It does not debounce, throttle, cache the function's result, or prevent the callback
// from executing whenever an event invokes it.

// ---------------------------------------------------------------------
// 13. useCallback does not cache a function's result
// ---------------------------------------------------------------------

const ResultExample: FC = (): ReactElement => {
  const calculateValue = useCallback((value: number): number => {
    return value * 2;
  }, []);

  const result = calculateValue(10);

  return <p>Result: {result}</p>;
};

// useCallback caches the function reference, not the result returned by the function.
// Calling calculateValue still executes its function body.

// ---------------------------------------------------------------------
// 14. useCallback versus useMemo
// ---------------------------------------------------------------------

const HookComparisonExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  const logCount = useCallback((): void => {
    console.log("Count:", count);
  }, [count]);

  return (
    <section>
      <p>Doubled: {doubled}</p>
      <button type="button" onClick={logCount}>
        Log count
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// useMemo caches a calculated value.
// useCallback caches a function reference.
// Conceptually, useCallback(fn, dependencies) is closely related to useMemo(() => fn, dependencies).

// ---------------------------------------------------------------------
// 15. Callback identity can matter for effects
// ---------------------------------------------------------------------

import { useEffect } from "react";

const EffectDependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const report = useCallback((): void => {
    console.log("Current count:", count);
  }, [count]);

  useEffect(() => {
    report();
  }, [report]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// report is an effect dependency because the effect calls it.
// report changes whenever count changes, so the effect runs after those updates.
// The callback's identity accurately reflects the value it captures.

// ---------------------------------------------------------------------
// 16. Moving a function inside an effect can simplify dependencies
// ---------------------------------------------------------------------

const InternalEffectFunctionExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const report = (): void => {
      console.log("Current count:", count);
    };

    report();
  }, [count]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// If a function is only needed by one effect, defining it inside the effect can avoid
// introducing a separate function dependency.
// The effect can then depend directly on the reactive values it reads.

// ---------------------------------------------------------------------
// 17. Callback identity can matter for custom hooks
// ---------------------------------------------------------------------

interface SaveOptions {
  readonly onSave: () => void;
}

const useSaveAction = (options: SaveOptions): void => {
  useEffect(() => {
    console.log("Save action changed");
  }, [options.onSave]);
};

const CustomHookExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleSave = useCallback((): void => {
    console.log("Saving");
  }, []);

  useSaveAction({
    onSave: handleSave,
  });

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </section>
  );
};

// A custom Hook may use callback identity as part of its own dependency management.
// A stable callback can therefore prevent unnecessary work inside identity-sensitive custom Hooks.

// ---------------------------------------------------------------------
// 18. useCallback has a cost
// ---------------------------------------------------------------------

const MemoizationCostExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={handleAction}>
        Run action
      </button>
    </section>
  );
};

// useCallback itself requires React to track the callback and its dependencies.
// If a callback is cheap and its identity does not affect anything important,
// adding useCallback may provide little or no benefit.

// ---------------------------------------------------------------------
// 19. Avoid memoizing every event handler automatically
// ---------------------------------------------------------------------

const SimpleHandlerExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleClick = (): void => {
    setCount((value) => value + 1);
  };

  return (
    <button type="button" onClick={handleClick}>
      Count: {count}
    </button>
  );
};

// A normal function is often the simplest and most appropriate choice.
// useCallback becomes more relevant when the callback's reference identity has a concrete purpose.

// ---------------------------------------------------------------------
// 20. Stable callback identity is local to a component instance
// ---------------------------------------------------------------------

const InstanceIdentityExample: FC = (): ReactElement => {
  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  return (
    <button type="button" onClick={handleAction}>
      Run action
    </button>
  );
};

// The callback reference is stable across renders of this component instance.
// A separate mounted instance of InstanceIdentityExample has its own callback reference.

// ---------------------------------------------------------------------
// 21. Callback dependencies can intentionally change identity
// ---------------------------------------------------------------------

interface GreetingButtonProps {
  readonly name: string;
}

const GreetingButton: FC<GreetingButtonProps> = ({ name }): ReactElement => {
  const handleGreeting = useCallback((): void => {
    console.log(`Hello, ${name}`);
  }, [name]);

  return (
    <button type="button" onClick={handleGreeting}>
      Greet {name}
    </button>
  );
};

// A callback does not need to remain stable forever.
// When the data it captures changes, creating a new callback reference is expected and correct.

// ---------------------------------------------------------------------
// 22. Integrated example
// ---------------------------------------------------------------------

interface ProfileActionsProps {
  readonly name: string;
  readonly onSelect: () => void;
}

const ProfileActions: FC<ProfileActionsProps> = memo(({ name, onSelect }): ReactElement => {
  console.log("ProfileActions rendered");

  return (
    <article>
      <h2>{name}</h2>
      <button type="button" onClick={onSelect}>
        Select profile
      </button>
    </article>
  );
});

const UseCallbackDemo: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");
  const [count, setCount] = useState(0);

  const handleSelect = useCallback((): void => {
    console.log(`Selected: ${name}`);
  }, [name]);

  return (
    <main>
      <h1>useCallback</h1>

      <p>Name: {name}</p>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setName("Jane Doe")}>
        Change name
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>

      <ProfileActions name={name} onSelect={handleSelect} />
    </main>
  );
};

export default UseCallbackDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - useCallback caches a function reference between renders.
// - The callback reference changes when one of its dependencies changes.
// - A normal function created during rendering receives a new reference on each render.
// - Stable callback references can help memoized children avoid unnecessary parent-driven renders.
// - Callback dependencies must include the reactive values that the callback reads.
// - Omitting a required dependency can create a stale closure.
// - Functional state updates can reduce callback dependencies when the callback only needs previous state.
// - useCallback does not cache a function's return value.
// - useCallback does not debounce, throttle, or otherwise control callback execution.
// - useCallback can be relevant when callback identity participates in effect or custom Hook dependencies.
// - A function used only inside one effect can often be defined inside that effect instead.
// - useCallback has its own tracking cost and is not automatically beneficial for every function.
// - Callback identity is stable only for the relevant component instance and dependency set.
// - A callback should receive a new identity when the values it correctly captures change.
// - useCallback is primarily an identity optimization, not a general-purpose performance mechanism.

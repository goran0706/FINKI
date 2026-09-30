/**
 * Function Identity
 * ==================
 *
 * Every function expression and function declaration creates a function object with its own
 * reference identity. Two functions can perform the same operation while still being different
 * references, which affects React.memo, effect dependencies, and other identity-sensitive APIs.
 */

// ---------------------------------------------------------------------
// 1. Functions have reference identity
// ---------------------------------------------------------------------

const firstFunction = (): void => {
  console.log("Action");
};

const secondFunction = (): void => {
  console.log("Action");
};

console.log(firstFunction === secondFunction); // false
console.log(Object.is(firstFunction, secondFunction)); // false

// The two functions contain equivalent code but were created as separate function objects.
// Function equality compares their references, not whether their implementations look the same.

// ---------------------------------------------------------------------
// 2. Assigning a function preserves its identity
// ---------------------------------------------------------------------

const originalFunction = (): void => {
  console.log("Action");
};

const sameFunction = originalFunction;

console.log(originalFunction === sameFunction); // true
console.log(Object.is(originalFunction, sameFunction)); // true

// Assigning a function to another variable does not create another function object.
// Both variables refer to the same function.

// ---------------------------------------------------------------------
// 3. Function identity changes when a function is recreated
// ---------------------------------------------------------------------

const createHandler = (): (() => void) => {
  return (): void => {
    console.log("Action");
  };
};

const handlerA = createHandler();
const handlerB = createHandler();

console.log(handlerA === handlerB); // false

// Each call to createHandler creates and returns a new function object.
// The returned functions perform the same operation but have different identities.

// ---------------------------------------------------------------------
// 4. Inline functions create new references
// ---------------------------------------------------------------------

const InlineFunctionExample = (): React.ReactElement => {
  const handleAction = (): void => {
    console.log("Action");
  };

  return (
    <button type="button" onClick={handleAction}>
      Run action
    </button>
  );
};

// handleAction is created again whenever InlineFunctionExample renders.
// The function's behavior can remain identical while its reference changes.

// ---------------------------------------------------------------------
// 5. Function identity and React.memo
// ---------------------------------------------------------------------

import { memo, useState, type FC, type ReactElement } from "react";

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

const MemoFunctionExample: FC = (): ReactElement => {
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

// handleAction is recreated when MemoFunctionExample renders.
// ActionButton receives a different function reference after the parent re-renders.
// React.memo therefore cannot use its default prop comparison to bail out based on that prop.

// ---------------------------------------------------------------------
// 6. useCallback can preserve function identity
// ---------------------------------------------------------------------

import { useCallback } from "react";

const StableFunctionExample: FC = (): ReactElement => {
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

// useCallback returns the same function reference between renders until one of its dependencies changes.
// This can allow a memoized child to receive a stable function prop.
// useCallback should be used when reference stability has a concrete purpose rather than simply
// because every function must be memoized.

// ---------------------------------------------------------------------
// 7. Dependencies determine callback identity
// ---------------------------------------------------------------------

const DependentCallbackExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Current count:", count);
  }, [count]);

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

// Because handleAction reads count, count belongs in the dependency array.
// When count changes, useCallback returns a new function reference.
// This keeps the callback's closure synchronized with the value it reads.

// ---------------------------------------------------------------------
// 8. Functional state updates can reduce dependencies
// ---------------------------------------------------------------------

const FunctionalUpdateExample: FC = (): ReactElement => {
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

// The callback does not need to read count directly.
// The functional state-update form receives the current state value when React applies the update.
// This allows increment to keep a stable identity with an empty dependency array.

// ---------------------------------------------------------------------
// 9. Function identity and useEffect
// ---------------------------------------------------------------------

import { useEffect } from "react";

const EffectFunctionExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = (): void => {
    console.log("Action");
  };

  useEffect(() => {
    handleAction();
  }, [handleAction]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// handleAction is recreated on every render.
// Because the function reference changes, the dependency is considered changed,
// so the effect runs after each committed render caused by count.

// ---------------------------------------------------------------------
// 10. useCallback can stabilize an effect dependency
// ---------------------------------------------------------------------

const StableEffectFunctionExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  useEffect(() => {
    handleAction();
  }, [handleAction]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// handleAction keeps the same reference between renders because it has no changing dependencies.
// The effect therefore does not rerun merely because count changes.

// ---------------------------------------------------------------------
// 11. Callback closures still capture values
// ---------------------------------------------------------------------

const ClosureIdentityExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const logCount = useCallback((): void => {
    console.log("Count:", count);
  }, [count]);

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

// A callback can close over values from the render that created it.
// When count changes, a new callback is required here so that the callback captures the new count.
// Stabilizing a callback must not come at the cost of using stale captured values.

// ---------------------------------------------------------------------
// 12. Function identity is different from function behavior
// ---------------------------------------------------------------------

const BehaviorExample: FC = (): ReactElement => {
  const first = (): string => "Hello";
  const second = (): string => "Hello";

  console.log(first() === second()); // true
  console.log(first === second); // false

  return (
    <section>
      <p>Equivalent results do not imply identical function references.</p>
    </section>
  );
};

// Calling the functions compares the values they return.
// Comparing the functions themselves compares their reference identities.
// These are two different comparisons.

// ---------------------------------------------------------------------
// 13. Passing a function through multiple components
// ---------------------------------------------------------------------

interface ToolbarProps {
  readonly onSave: () => void;
}

const Toolbar: FC<ToolbarProps> = memo(({ onSave }): ReactElement => {
  console.log("Toolbar rendered");

  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
});

const Editor: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  const handleSave = useCallback((): void => {
    console.log("Saving:", value);
  }, [value]);

  return (
    <section>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <Toolbar onSave={handleSave} />
    </section>
  );
};

// The callback reference changes when value changes because the callback reads value.
// Toolbar can still benefit from memoization when its parent re-renders for reasons
// that do not change value, because handleSave retains its reference in those renders.

// ---------------------------------------------------------------------
// 14. useCallback does not make a function globally stable
// ---------------------------------------------------------------------

const LocalCallbackExample: FC = (): ReactElement => {
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

// useCallback preserves the callback reference across renders of this particular component instance.
// A different instance of LocalCallbackExample receives its own callback identity.
// It does not create one universal function reference shared by every component instance.

// ---------------------------------------------------------------------
// 15. Stable identity has a purpose, not a guarantee of faster rendering
// ---------------------------------------------------------------------

const MemoizationTradeoffExample: FC = (): ReactElement => {
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

// useCallback itself has runtime and memory costs.
// Stable function identity is useful when it enables a meaningful optimization or satisfies
// an identity-sensitive dependency, but wrapping every function in useCallback is not inherently beneficial.

// ---------------------------------------------------------------------
// 16. Integrated example
// ---------------------------------------------------------------------

interface UserActionsProps {
  readonly onSelect: () => void;
}

const UserActions: FC<UserActionsProps> = memo(({ onSelect }): ReactElement => {
  console.log("UserActions rendered");

  return (
    <button type="button" onClick={onSelect}>
      Select user
    </button>
  );
});

const FunctionIdentityDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleSelect = useCallback((): void => {
    console.log("John Doe selected");
  }, []);

  return (
    <main>
      <h1>Function identity</h1>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>

      <UserActions onSelect={handleSelect} />
    </main>
  );
};

export default FunctionIdentityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Every function object has its own reference identity.
// - Two functions with equivalent implementations can still have different identities.
// - Assigning a function to another variable preserves its identity.
// - Recreating a function during render produces a new reference.
// - React.memo compares function props by reference using Object.is semantics.
// - A changing function prop can prevent a memoized child from bailing out.
// - useCallback can preserve a function reference between renders.
// - useCallback dependencies determine when a new callback reference is created.
// - Callback closures must include the values they read in the dependency array.
// - Functional state updates can reduce callback dependencies when the callback only needs previous state.
// - Function identity and function behavior are separate concepts.
// - useCallback is an optimization and identity-management tool, not a requirement for every function.

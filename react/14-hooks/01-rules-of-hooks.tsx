/**
 * Rules of Hooks
 * ==============
 *
 * React Hooks are stateful APIs whose behavior depends on React calling them
 * in the same order on every render. React associates each Hook invocation
 * with an internal position in the component's Hook list rather than with a
 * variable name. Preserving that call order lets React match state, effects,
 * refs, and other Hook-specific data with the correct invocation across
 * renders.
 *
 * Hooks must therefore be called only at the top level of React function
 * components or custom Hooks. Calling a Hook conditionally, inside a loop,
 * after an early return, inside a nested function, or from a regular
 * JavaScript function can change or obscure the expected invocation order.
 *
 * The `eslint-plugin-react-hooks` rules can statically detect many violations.
 * The runtime also detects inconsistent Hook ordering in development builds,
 * but runtime detection cannot make an invalid Hook call correct.
 *
 * A common misconception is that "top level" means a Hook must appear directly
 * inside a component's outermost lexical scope with no surrounding helper
 * expression. The important requirement is that the Hook call itself executes
 * unconditionally and in the same order on every render. Conditional behavior
 * belongs inside the Hook's callback or in the values passed to the Hook.
 */

import { type FC, type ReactNode, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TopLevelHookProps {
  readonly initialCount: number;
}

export interface ConditionalLogicInsideHookProps {
  readonly enabled: boolean;
}

export interface EarlyReturnSafeHookProps {
  readonly isReady: boolean;
}

export interface CustomHookCompositionProps {
  readonly initialName: string;
}

export interface InvalidHookExampleProps {
  readonly enabled: boolean;
}

export interface RulesOfHooksDemoProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a Hook called directly and unconditionally at the component
 * level. The same `useState` invocation remains the first Hook on every
 * render, so React can associate its state consistently.
 */
export const TopLevelHookExample: FC<TopLevelHookProps> = ({ initialCount }: TopLevelHookProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>Top-level Hook call</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates that conditional behavior can safely live inside an effect.
 * The `useEffect` call itself is unconditional, while its callback decides
 * whether the effect should perform work.
 */
export const ConditionalLogicInsideHook: FC<ConditionalLogicInsideHookProps> = ({
  enabled,
}: ConditionalLogicInsideHookProps): ReactNode => {
  useEffect((): void | (() => void) => {
    if (!enabled) {
      return;
    }

    document.title = "Hook enabled";

    return (): void => {
      document.title = "React";
    };
  }, [enabled]);

  return (
    <section>
      <h3>Conditional logic inside a Hook</h3>
      <p>Effect enabled: {enabled ? "yes" : "no"}</p>
    </section>
  );
};

/**
 * Demonstrates that an early return must not occur before a Hook that is
 * expected to run on every render. The component keeps the Hook call before
 * the conditional return, preserving its position in the Hook sequence.
 */
export const EarlyReturnSafeHook: FC<EarlyReturnSafeHookProps> = ({ isReady }: EarlyReturnSafeHookProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting");

  const markReady = (): void => {
    setMessage("Ready");
  };

  if (!isReady) {
    return (
      <section>
        <h3>Hook before an early return</h3>
        <p>{message}</p>
        <button type="button" onClick={markReady}>
          Mark ready
        </button>
      </section>
    );
  }

  return (
    <section>
      <h3>Hook before an early return</h3>
      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates custom Hook composition. A custom Hook may call other Hooks,
 * but it must itself obey the Rules of Hooks. Its internal Hook calls execute
 * in a stable order whenever the custom Hook is invoked.
 */
const useNameState = (initialName: string): [string, (name: string) => void] => {
  const [name, setName] = useState<string>(initialName);

  const updateName = (nextName: string): void => {
    setName(nextName);
  };

  return [name, updateName];
};

export const CustomHookCompositionExample: FC<CustomHookCompositionProps> = ({
  initialName,
}: CustomHookCompositionProps): ReactNode => {
  const [name, updateName] = useNameState(initialName);

  const greeting = useMemo<string>((): string => {
    return `Hello, ${name}`;
  }, [name]);

  const rename = (): void => {
    updateName("John Doe");
  };

  return (
    <section>
      <h3>Custom Hook composition</h3>
      <p>{greeting}</p>
      <button type="button" onClick={rename}>
        Use example name
      </button>
    </section>
  );
};

/**
 * Demonstrates the shape of a conditional Hook call without executing it.
 * The intentionally invalid code is represented as a string so this example
 * remains valid TypeScript and does not introduce a runtime Rules of Hooks
 * violation into the demonstration file.
 */
export const InvalidConditionalHookExample: FC<InvalidHookExampleProps> = ({
  enabled,
}: InvalidHookExampleProps): ReactNode => {
  const invalidExample: string = "if (enabled) { useState(0); } // Do not call Hooks conditionally.";

  return (
    <section>
      <h3>Conditional Hook calls are invalid</h3>
      <p>Condition enabled: {enabled ? "yes" : "no"}</p>
      <pre>{invalidExample}</pre>
    </section>
  );
};

/**
 * Provides a container for the Rules of Hooks demonstrations. Each example
 * has an independent component boundary, so its Hook state belongs only to
 * that component's Hook sequence.
 */
export const RulesOfHooksDemo: FC<RulesOfHooksDemoProps> = ({ children }: RulesOfHooksDemoProps): ReactNode => {
  return <main>{children}</main>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RulesOfHooksContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Rules of Hooks</h1>

      <h2>1. Calling Hooks at the top level</h2>
      <TopLevelHookExample initialCount={0} />

      <h2>2. Keeping conditional logic inside a Hook</h2>
      <ConditionalLogicInsideHook enabled={true} />

      <h2>3. Placing Hooks before early returns</h2>
      <EarlyReturnSafeHook isReady={false} />

      <h2>4. Composing Hooks through a custom Hook</h2>
      <CustomHookCompositionExample initialName="John Doe" />

      <h2>5. Avoiding conditional Hook calls</h2>
      <InvalidConditionalHookExample enabled={true} />
    </main>
  );
};

export default RulesOfHooksContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Call Hooks only from React function components or custom Hooks.
// - Call Hooks at the top level so their execution order remains stable.
// - Do not conditionally execute Hooks, including inside loops or nested functions.
// - Place conditional behavior inside the Hook callback or its inputs.
// - Place Hooks before early returns when those Hooks must run on every render.
// - Custom Hooks may compose other Hooks, but must obey the same rules.
// - Static linting can detect many Rules of Hooks violations before runtime.

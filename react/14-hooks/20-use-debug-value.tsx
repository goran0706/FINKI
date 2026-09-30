/**
 * useDebugValue
 * =============
 *
 * `useDebugValue` lets a custom Hook provide a human-readable label to React
 * DevTools. The label is displayed when the custom Hook is inspected, making
 * internal Hook state easier to identify during debugging.
 *
 * The Hook has no effect on the component's rendered output and does not
 * change state, trigger renders, or alter application behavior. React uses the
 * value supplied to `useDebugValue` only as debugging metadata for DevTools.
 *
 * The optional formatting function is evaluated when React needs to display
 * the debug value. This allows potentially expensive formatting work to be
 * avoided during normal rendering. The formatter receives the debug value and
 * returns the value that should be presented to the developer.
 *
 * `useDebugValue` is primarily intended for custom Hooks rather than ordinary
 * components. A custom Hook can expose meaningful semantic information instead
 * of forcing a developer to inspect several internal primitive Hook values.
 *
 * The debug value should describe the Hook's current state without becoming a
 * second source of truth. Debug metadata is development tooling information,
 * not UI state and should never be required for application correctness.
 */

import { type FC, type ReactNode, useDebugValue, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DebugValueStatusProps {
  readonly initialStatus: "idle" | "loading" | "success" | "error";
}

export interface DebugValueCounterProps {
  readonly initialCount: number;
}

export interface DebugValueUserProps {
  readonly initialUserName: string;
}

export interface DebugValueFormatterProps {
  readonly initialCount: number;
}

export interface DebugValueToggleProps {
  readonly initialEnabled: boolean;
}

export interface DebugValueGotchaProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a custom Hook exposing a semantic status through
 * `useDebugValue`. The returned state is still ordinary application state;
 * the debug value only makes that state easier to identify in DevTools.
 */
const useStatus = (
  initialStatus: DebugValueStatusProps["initialStatus"],
): {
  readonly status: DebugValueStatusProps["initialStatus"];
  readonly setStatus: (status: DebugValueStatusProps["initialStatus"]) => void;
} => {
  const [status, setStatus] = useState<DebugValueStatusProps["initialStatus"]>(initialStatus);

  useDebugValue(status);

  return {
    status,
    setStatus,
  };
};

/**
 * Demonstrates exposing a semantic custom-Hook status in DevTools.
 */
export const DebugValueStatusExample: FC<DebugValueStatusProps> = ({
  initialStatus,
}: DebugValueStatusProps): ReactNode => {
  const { status, setStatus } = useStatus(initialStatus);

  const setLoading = (): void => {
    setStatus("loading");
  };

  const setSuccess = (): void => {
    setStatus("success");
  };

  const setError = (): void => {
    setStatus("error");
  };

  const setIdle = (): void => {
    setStatus("idle");
  };

  return (
    <section>
      <h3>Displaying a custom Hook value in DevTools</h3>

      <p>Status: {status}</p>

      <button type="button" onClick={setIdle}>
        Idle
      </button>

      <button type="button" onClick={setLoading}>
        Loading
      </button>

      <button type="button" onClick={setSuccess}>
        Success
      </button>

      <button type="button" onClick={setError}>
        Error
      </button>
    </section>
  );
};

/**
 * Demonstrates a custom Hook exposing a primitive value through
 * `useDebugValue`. The debug value is the current count, while the returned
 * state setter remains the mechanism that changes application state.
 */
const useDebugCounter = (
  initialCount: number,
): {
  readonly count: number;
  readonly increment: () => void;
} => {
  const [count, setCount] = useState<number>(initialCount);

  useDebugValue(count);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return {
    count,
    increment,
  };
};

/**
 * Demonstrates debugging state owned by a custom counter Hook.
 */
export const DebugValueCounterExample: FC<DebugValueCounterProps> = ({
  initialCount,
}: DebugValueCounterProps): ReactNode => {
  const { count, increment } = useDebugCounter(initialCount);

  return (
    <section>
      <h3>Debugging custom Hook state</h3>

      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates using a formatted debug value. The formatter converts internal
 * state into a concise developer-facing description without changing the
 * actual value returned by the custom Hook.
 */
const useUserName = (
  initialUserName: string,
): {
  readonly userName: string;
  readonly setUserName: (userName: string) => void;
} => {
  const [userName, setUserName] = useState<string>(initialUserName);

  useDebugValue(userName, (value: string): string => {
    return `User: ${value}`;
  });

  return {
    userName,
    setUserName,
  };
};

/**
 * Demonstrates a formatted debug label for a custom Hook.
 */
export const DebugValueUserExample: FC<DebugValueUserProps> = ({ initialUserName }: DebugValueUserProps): ReactNode => {
  const { userName, setUserName } = useUserName(initialUserName);

  const updateUser = (): void => {
    setUserName("John Doe");
  };

  return (
    <section>
      <h3>Formatting a debug value</h3>

      <p>User: {userName}</p>

      <button type="button" onClick={updateUser}>
        Set example user
      </button>
    </section>
  );
};

/**
 * Demonstrates that the formatter can produce a developer-oriented label
 * while leaving the actual application state unchanged.
 */
const useFormattedCount = (initialCount: number): number => {
  const [count, setCount] = useState<number>(initialCount);

  useDebugValue(count, (value: number): string => `Count is ${value}`);

  return count;
};

/**
 * Demonstrates a formatted primitive debug value.
 */
export const DebugValueFormatterExample: FC<DebugValueFormatterProps> = ({
  initialCount,
}: DebugValueFormatterProps): ReactNode => {
  const count: number = useFormattedCount(initialCount);
  const [displayCount, setDisplayCount] = useState<number>(count);

  const increment = (): void => {
    setDisplayCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>Separating debug formatting from application data</h3>

      <p>Count: {displayCount}</p>

      <button type="button" onClick={increment}>
        Increment displayed count
      </button>
    </section>
  );
};

/**
 * Demonstrates a boolean custom Hook value with a descriptive debug label.
 * The formatter is useful when a primitive value alone would be ambiguous in
 * DevTools.
 */
const useToggle = (
  initialEnabled: boolean,
): {
  readonly enabled: boolean;
  readonly toggle: () => void;
} => {
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);

  useDebugValue(enabled, (value: boolean): string => (value ? "Enabled" : "Disabled"));

  const toggle = (): void => {
    setEnabled((previousEnabled: boolean): boolean => !previousEnabled);
  };

  return {
    enabled,
    toggle,
  };
};

/**
 * Demonstrates giving a boolean custom Hook a readable DevTools label.
 */
export const DebugValueToggleExample: FC<DebugValueToggleProps> = ({
  initialEnabled,
}: DebugValueToggleProps): ReactNode => {
  const { enabled, toggle } = useToggle(initialEnabled);

  return (
    <section>
      <h3>Formatting boolean Hook state</h3>

      <p>{enabled ? "Enabled" : "Disabled"}</p>

      <button type="button" onClick={toggle}>
        Toggle
      </button>
    </section>
  );
};

/**
 * Demonstrates a conditional debug value. Passing `undefined` to
 * `useDebugValue` is useful when a custom Hook has no meaningful diagnostic
 * information for a particular state.
 */
const useOptionalDebugValue = (value: string): string => {
  useDebugValue(value === "" ? undefined : `Value: ${value}`);

  return value;
};

/**
 * Demonstrates that debug metadata can intentionally be omitted when there is
 * no useful diagnostic information.
 */
export const DebugValueOptionalExample: FC = (): ReactNode => {
  const [value, setValue] = useState<string>("");

  const debuggedValue: string = useOptionalDebugValue(value);

  const setExampleValue = (): void => {
    setValue("example.com");
  };

  const clearValue = (): void => {
    setValue("");
  };

  return (
    <section>
      <h3>Conditionally providing debug information</h3>

      <p>Value: {debuggedValue || "(empty)"}</p>

      <button type="button" onClick={setExampleValue}>
        Set value
      </button>

      <button type="button" onClick={clearValue}>
        Clear value
      </button>
    </section>
  );
};

/**
 * Demonstrates the common misconception that `useDebugValue` changes the
 * rendered interface. It does not produce visible UI and should not replace
 * state or rendering logic needed by the application.
 */
export const DebugValueGotchaExample: FC<DebugValueGotchaProps> = ({
  initialValue,
}: DebugValueGotchaProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);

  useDebugValue(value, (currentValue: string): string => {
    return `Debug: ${currentValue}`;
  });

  const updateValue = (): void => {
    setValue("Updated value");
  };

  return (
    <section>
      <h3>Gotcha: debug values are not rendered UI</h3>

      <p>Rendered value: {value}</p>

      <button type="button" onClick={updateValue}>
        Update value
      </button>

      <p>
        The debug label is intended for React DevTools and does not appear as part of this component&apos;s rendered
        interface.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseDebugValueContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useDebugValue</h1>

      <h2>1. Displaying a custom Hook value in DevTools</h2>
      <DebugValueStatusExample initialStatus="idle" />

      <h2>2. Debugging custom Hook state</h2>
      <DebugValueCounterExample initialCount={0} />

      <h2>3. Formatting a debug value</h2>
      <DebugValueUserExample initialUserName="John Doe" />

      <h2>4. Separating debug formatting from application data</h2>
      <DebugValueFormatterExample initialCount={0} />

      <h2>5. Formatting boolean Hook state</h2>
      <DebugValueToggleExample initialEnabled={false} />

      <h2>6. Conditionally providing debug information</h2>
      <DebugValueOptionalExample />

      <h2>7. Understanding that debug values are not rendered UI</h2>
      <DebugValueGotchaExample initialValue="example.com" />
    </main>
  );
};

export default UseDebugValueContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useDebugValue` provides descriptive debugging information for custom Hooks.
// - Debug values are visible to React DevTools rather than the rendered UI.
// - The Hook does not update state, trigger renders, or affect application behavior.
// - A formatter can convert internal Hook state into a concise developer-facing label.
// - Formatting is useful when raw primitive or object values are difficult to interpret.
// - `useDebugValue` is primarily intended for custom Hooks.
// - Debug metadata should describe application state rather than become a second source of truth.
// - Debug values should not be used to implement application behavior.

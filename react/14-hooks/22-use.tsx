/**
 * use
 * ===
 *
 * The `use` API reads the value of a supported resource during rendering.
 * React currently supports using `use` with Promises and context objects.
 * Unlike ordinary Hooks, `use` can be called conditionally and inside loops,
 * because its call does not rely on the fixed positional Hook ordering used by
 * traditional Hooks.
 *
 * When `use` receives a Promise that is pending, React suspends the component
 * until the Promise settles. A surrounding `Suspense` boundary can display
 * fallback content while the component is suspended. If the Promise resolves,
 * `use` returns its resolved value; if it rejects, the rejection can be
 * handled by an appropriate error boundary.
 *
 * When `use` receives a context object, it reads the current context value.
 * This is similar to `useContext`, but `use` can read the context conditionally
 * or inside a loop. The context must still be provided by an ancestor for a
 * custom value to be available.
 *
 * Promises passed to `use` should have stable identity. Creating a new Promise
 * during every render can cause React to repeatedly suspend because each render
 * receives a different pending resource. Promise creation should therefore
 * normally happen outside the component or be otherwise cached.
 *
 * `use` does not make arbitrary values awaitable. It accepts supported React
 * resources, such as Promises and context objects. It also does not replace
 * ordinary state or effect Hooks.
 */

import { createContext, type FC, type ReactNode, Suspense, use, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UsePromiseProps {
  readonly resource: Promise<string>;
}

export interface UseContextProps {
  readonly initialTheme: "light" | "dark";
}

export interface UseConditionalProps {
  readonly initialEnabled: boolean;
}

export interface UseStablePromiseProps {
  readonly initialMessage: string;
}

export interface UseContextLoopProps {
  readonly labels: readonly string[];
}

export interface UseGotchaProps {
  readonly initialEnabled: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A stable Promise resource is created outside the component so its identity
 * remains unchanged across renders.
 */
const exampleMessagePromise: Promise<string> = Promise.resolve("Data loaded from a Promise resource.");

/**
 * Demonstrates reading a resolved Promise with `use`. A resolved Promise does
 * not require visible fallback work, while the same API also supports pending
 * Promises through Suspense.
 */
export const UsePromiseExample: FC<UsePromiseProps> = ({ resource }: UsePromiseProps): ReactNode => {
  const message: string = use(resource);

  return (
    <section>
      <h3>Reading a Promise with use</h3>

      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates a stable Promise resource. The resource is passed as a prop,
 * while the component reads its resolved value during rendering.
 */
export const UseStablePromiseExample: FC<UseStablePromiseProps> = ({
  initialMessage,
}: UseStablePromiseProps): ReactNode => {
  const messageResource: Promise<string> =
    initialMessage === "example.com" ? Promise.resolve(initialMessage) : exampleMessagePromise;

  const message: string = use(messageResource);

  return (
    <section>
      <h3>Reading a stable Promise resource</h3>

      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates reading context with `use`. The context is read during
 * rendering and the resulting value follows the nearest matching provider.
 */
const ThemeContext = createContext<"light" | "dark">("light");

export const UseContextExample: FC<UseContextProps> = ({ initialTheme }: UseContextProps): ReactNode => {
  return (
    <ThemeContext.Provider value={initialTheme}>
      <ThemeConsumer />
    </ThemeContext.Provider>
  );
};

/**
 * Reads the current theme context using `use`.
 */
const ThemeConsumer: FC = (): ReactNode => {
  const theme: "light" | "dark" = use(ThemeContext);

  return (
    <div>
      <p>Theme: {theme}</p>
    </div>
  );
};

/**
 * Demonstrates that `use` can be called conditionally. Traditional Hooks must
 * preserve call order, while `use` is specifically designed to support
 * conditional resource and context reads.
 */
export const UseConditionalExample: FC<UseConditionalProps> = ({ initialEnabled }: UseConditionalProps): ReactNode => {
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);

  const toggle = (): void => {
    setEnabled((previousEnabled: boolean): boolean => !previousEnabled);
  };

  return (
    <section>
      <h3>Reading a resource conditionally</h3>

      {enabled ? <ConditionalMessage /> : <p>The resource is not being read.</p>}

      <button type="button" onClick={toggle}>
        Toggle resource
      </button>
    </section>
  );
};

/**
 * Reads the resource only when the parent condition enables it.
 */
const ConditionalMessage: FC = (): ReactNode => {
  const message: string = use(exampleMessagePromise);

  return <p>{message}</p>;
};

/**
 * Demonstrates that `use` can be called inside a loop. Each iteration reads
 * the same stable context resource, which is valid for `use`.
 */
const LabelContext = createContext<string>("Default label");

export const UseContextLoopExample: FC<UseContextLoopProps> = ({ labels }: UseContextLoopProps): ReactNode => {
  return (
    <LabelContext.Provider value="Shared label">
      <LabelList labels={labels} />
    </LabelContext.Provider>
  );
};

/**
 * Reads context inside a loop to demonstrate the special call behavior of
 * `use`.
 */
const LabelList: FC<UseContextLoopProps> = ({ labels }: UseContextLoopProps): ReactNode => {
  return (
    <ul>
      {labels.map((label: string): ReactNode => {
        const sharedLabel: string = use(LabelContext);

        return (
          <li key={label}>
            {label}: {sharedLabel}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Demonstrates that `use` does not turn a Promise into local mutable state.
 * The returned value represents the resource's resolved result and should be
 * rendered as data rather than treated as a state setter.
 */
export const UsePromiseDataExample: FC = (): ReactNode => {
  const message: string = use(exampleMessagePromise);

  return (
    <section>
      <h3>Using the resolved Promise value as render data</h3>

      <p>Message: {message}</p>
    </section>
  );
};

/**
 * Demonstrates the role of Suspense when `use` reads a Promise that has not
 * completed. The Promise is created once outside rendering so its identity is
 * stable.
 */
const delayedMessagePromise: Promise<string> = new Promise<string>((resolve): void => {
  window.setTimeout((): void => {
    resolve("Delayed data is ready.");
  }, 500);
});

export const UseSuspenseExample: FC = (): ReactNode => {
  return (
    <section>
      <h3>Suspending while reading a Promise</h3>

      <Suspense fallback={<p>Loading Promise data...</p>}>
        <SuspendedMessage />
      </Suspense>
    </section>
  );
};

/**
 * Reads a pending Promise and suspends until React can obtain its value.
 */
const SuspendedMessage: FC = (): ReactNode => {
  const message: string = use(delayedMessagePromise);

  return <p>{message}</p>;
};

/**
 * Demonstrates the common misconception that `use` accepts arbitrary
 * JavaScript values. The API is used here with a supported Promise resource;
 * ordinary synchronous values should simply be used directly.
 */
export const UseGotchaExample: FC<UseGotchaProps> = ({ initialEnabled }: UseGotchaProps): ReactNode => {
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);

  const toggle = (): void => {
    setEnabled((previousEnabled: boolean): boolean => !previousEnabled);
  };

  return (
    <section>
      <h3>Gotcha: use is for supported React resources</h3>

      <p>
        {enabled
          ? "A supported Promise or context can be read with use."
          : "The component is not reading the resource."}
      </p>

      <button type="button" onClick={toggle}>
        Toggle
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseContainer: FC = (): ReactNode => {
  const labels: readonly string[] = ["First", "Second", "Third"];

  return (
    <main>
      <h1>use</h1>

      <h2>1. Reading a Promise with use</h2>
      <UsePromiseExample resource={exampleMessagePromise} />

      <h2>2. Reading a stable Promise resource</h2>
      <UseStablePromiseExample initialMessage="example.com" />

      <h2>3. Reading context with use</h2>
      <UseContextExample initialTheme="dark" />

      <h2>4. Reading a resource conditionally</h2>
      <UseConditionalExample initialEnabled={true} />

      <h2>5. Reading context inside a loop</h2>
      <UseContextLoopExample labels={labels} />

      <h2>6. Using a resolved Promise as render data</h2>
      <UsePromiseDataExample />

      <h2>7. Suspending while reading a Promise</h2>
      <UseSuspenseExample />

      <h2>8. Understanding supported use resources</h2>
      <UseGotchaExample initialEnabled={true} />
    </main>
  );
};

export default UseContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `use` reads supported React resources such as Promises and context.
// - A pending Promise read with `use` suspends the component until the Promise settles.
// - A `Suspense` boundary can provide fallback UI while Promise-based rendering is suspended.
// - Promise resources should have stable identity and should not be recreated on every render.
// - `use` can read context conditionally or inside loops.
// - The resolved value from a Promise is render data, not React-owned state.
// - `use` does not accept arbitrary JavaScript values as asynchronous resources.
// - `use` complements ordinary React state and effect Hooks rather than replacing them.

/**
 * Progressive Enhancement
 * ========================
 *
 * Progressive enhancement means that a form should retain useful behavior when
 * JavaScript is unavailable, delayed, or has not finished loading. HTML forms
 * already provide a native submission mechanism through their `action` and `method`
 * attributes, so a React form can build additional client-side behavior on top
 * of that baseline.
 *
 * A URL-based form action is inherently compatible with native browser submission.
 * A React function passed to `action` is different: it relies on React's form Action
 * handling and, for pre-hydration submission, requires a Server Function. A normal
 * client-side function should therefore not be described as a no-JavaScript fallback.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface ProgressiveFormProps {
  readonly action: string;
  readonly method: "get" | "post";
}

interface ProgressiveSubmitProps {
  readonly label: string;
}

interface ProgressiveEnhancementProps {
  readonly onResult: (message: string) => void;
}

interface ProgressiveActionProps {
  readonly onResult: (message: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A normal HTML form action provides a browser-native submission path.
 * The browser can submit this form without React event handling.
 */
export const ProgressiveNativeForm: React.FC<ProgressiveFormProps> = ({ action, method }): React.ReactElement => {
  return (
    <form action={action} method={method}>
      <label>
        Name
        <input name="name" defaultValue="Ada" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * A reusable submit control can remain ordinary HTML. Its disabled state is
 * optional enhancement rather than a requirement for basic submission.
 */
export const ProgressiveSubmitButton: React.FC<ProgressiveSubmitProps> = ({ label }): React.ReactElement => {
  return <button type="submit">{label}</button>;
};

/**
 * JavaScript can enhance a native form submission with client-side behavior.
 * Calling `preventDefault()` changes the baseline behavior, so this pattern
 * is no longer a no-JavaScript fallback for the intercepted submission.
 */
export const ProgressiveClientEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  onResult,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const name: FormDataEntryValue | null = formData.get("name");

    onResult(`Enhanced submission: ${String(name ?? "")}`);
  };

  return (
    <form action="/api/profile" method="post" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" defaultValue="Ada" />
      </label>

      <ProgressiveSubmitButton label="Submit with enhancement" />
    </form>
  );
};

/**
 * A React form Action can provide richer React integration. A regular client
 * function is not itself a no-JavaScript fallback; it depends on React's
 * client-side Action handling.
 */
export const ProgressiveClientAction: React.FC<ProgressiveActionProps> = ({ onResult }): React.ReactElement => {
  const action = (formData: FormData): void => {
    const name: FormDataEntryValue | null = formData.get("name");

    onResult(`Client Action: ${String(name ?? "")}`);
  };

  return (
    <form action={action}>
      <label>
        Name
        <input name="name" defaultValue="Ada" />
      </label>

      <button type="submit">Run client Action</button>
    </form>
  );
};

/**
 * A URL action can be progressively enhanced by React without replacing the
 * browser's underlying navigation/submission mechanism.
 */
export const ProgressiveUrlAction: React.FC = (): React.ReactElement => {
  return (
    <form action="/search" method="get">
      <label>
        Search
        <input name="q" defaultValue="React" />
      </label>

      <button type="submit">Search</button>
    </form>
  );
};

/**
 * A Server Function used as a form Action can support submission before the
 * React tree has hydrated. The function itself must be a real Server Function;
 * an ordinary client-side function does not provide this guarantee.
 *
 * The `"use server"` directive shown here is illustrative of the required
 * Server Function boundary and is not equivalent to an ordinary client Action.
 */
export const ProgressiveServerAction: React.FC = (): React.ReactElement => {
  /*
   * A real Server Function would be defined in a server-compatible module:
   *
   * "use server";
   *
   * export async function submitProfile(formData: FormData): Promise<void> {
   *   // Server-side processing.
   * }
   *
   * The form could then use:
   *
   * <form action={submitProfile}>
   *
   * The Server Function must be created and exposed by the framework/runtime
   * responsible for React Server Components.
   */

  return (
    <form action="/api/profile" method="post">
      <label>
        Name
        <input name="name" defaultValue="Ada" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ProgressiveEnhancement: React.FC = (): React.ReactElement => {
  const [result, setResult] = React.useState<string>("No enhanced submission yet.");

  const handleResult = (message: string): void => {
    setResult(message);
  };

  return (
    <div>
      <h1>Progressive Enhancement</h1>

      <h2>1. Native HTML Form Submission</h2>
      <ProgressiveNativeForm action="/api/profile" method="post" />

      <h2>2. Reusable Native Submit Button</h2>
      <form action="/api/profile" method="post">
        <input name="name" defaultValue="Ada" />
        <ProgressiveSubmitButton label="Submit" />
      </form>

      <h2>3. Client-Side Enhancement</h2>
      <ProgressiveClientEnhancement onResult={handleResult} />
      <p>{result}</p>

      <h2>4. Client-Side Form Action</h2>
      <ProgressiveClientAction onResult={handleResult} />

      <h2>5. URL-Based Form Action</h2>
      <ProgressiveUrlAction />

      <h2>6. Server Function Boundary</h2>
      <ProgressiveServerAction />
    </div>
  );
};

export default ProgressiveEnhancement;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Progressive enhancement starts with a form that has useful native HTML behavior.
// - A URL-based `action` can be submitted by the browser without React event handling.
// - `method` determines how the browser submits the form data to the target URL.
// - Client-side event handling can enhance a form, but `preventDefault()` replaces native submission for that event.
// - A client-side function passed to React's `action` is not itself a no-JavaScript fallback.
// - React Server Functions can support form submission before hydration when used through a compatible React server environment.
// - Progressive enhancement separates the baseline browser submission mechanism from optional client-side behavior.
// - A form should not rely on client-only behavior when the server can provide a meaningful native submission path.

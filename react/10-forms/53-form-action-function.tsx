/**
 * Form Action Function
 * =====================
 *
 * A form action function is a function passed directly to a React form's `action` prop. React
 * invokes the function with the submitted `FormData`, allowing submission logic to be defined as
 * an ordinary function rather than an event handler that manually prevents the browser's default
 * submission behavior.
 *
 * Form action functions can be synchronous or asynchronous. When an asynchronous action returns a
 * Promise, React tracks the action as part of its form submission lifecycle. The function receives
 * the form data snapshot produced by the submission, so it can safely inspect submitted values
 * without depending on the input elements after submission.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormActionFunctionBasicProps {
  readonly initialUsername: string;
}

export interface FormActionFunctionAsyncProps {
  readonly initialEmail: string;
}

export interface FormActionFunctionValuesProps {
  readonly initialTitle: string;
  readonly initialCategory: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormActionFunctionBasic: React.FC<FormActionFunctionBasicProps> = ({
  initialUsername,
}): React.ReactElement => {
  const [result, setResult] = React.useState<string>("");

  const submitForm = (formData: FormData): void => {
    const username: FormDataEntryValue | null = formData.get("username");

    if (typeof username !== "string") {
      setResult("A username was not submitted.");
      return;
    }

    setResult(`Submitted username: ${username}`);
  };

  return (
    <div>
      <form action={submitForm}>
        <label>
          Username
          <input type="text" name="username" defaultValue={initialUsername} />
        </label>

        <button type="submit">Submit</button>
      </form>

      {result !== "" && <p role="status">{result}</p>}
    </div>
  );
};

export const FormActionFunctionAsync: React.FC<FormActionFunctionAsyncProps> = ({
  initialEmail,
}): React.ReactElement => {
  const [status, setStatus] = React.useState<string>("");

  const submitForm = async (formData: FormData): Promise<void> => {
    const email: FormDataEntryValue | null = formData.get("email");

    if (typeof email !== "string" || email.trim() === "") {
      setStatus("An email address is required.");
      return;
    }

    setStatus("Submitting...");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 750);
    });

    setStatus(`Submitted email: ${email}`);
  };

  return (
    <div>
      <form action={submitForm}>
        <label>
          Email
          <input type="email" name="email" defaultValue={initialEmail} />
        </label>

        <button type="submit">Submit</button>
      </form>

      {status !== "" && <p role="status">{status}</p>}
    </div>
  );
};

export const FormActionFunctionValues: React.FC<FormActionFunctionValuesProps> = ({
  initialTitle,
  initialCategory,
}): React.ReactElement => {
  const [result, setResult] = React.useState<string>("");

  const submitForm = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");

    const category: FormDataEntryValue | null = formData.get("category");

    const featured: FormDataEntryValue | null = formData.get("featured");

    if (typeof title !== "string" || typeof category !== "string") {
      setResult("Required form values are missing.");
      return;
    }

    const isFeatured: boolean = featured === "on";

    setResult(`${title} — ${category} — ${isFeatured ? "featured" : "not featured"}`);
  };

  return (
    <div>
      <form action={submitForm}>
        <label>
          Title
          <input type="text" name="title" defaultValue={initialTitle} />
        </label>

        <label>
          Category
          <select name="category" defaultValue={initialCategory}>
            <option value="news">News</option>
            <option value="tutorial">Tutorial</option>
            <option value="reference">Reference</option>
          </select>
        </label>

        <label>
          <input type="checkbox" name="featured" />
          Featured
        </label>

        <button type="submit">Submit</button>
      </form>

      {result !== "" && <p role="status">{result}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Action Function</h1>

      <h2>1. Passing a Synchronous Function to the Form Action</h2>
      <FormActionFunctionBasic initialUsername="" />

      <h2>2. Passing an Asynchronous Function to the Form Action</h2>
      <FormActionFunctionAsync initialEmail="" />

      <h2>3. Reading Different Form Control Values from FormData</h2>
      <FormActionFunctionValues initialTitle="" initialCategory="tutorial" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A function passed to a form's `action` prop receives the submitted `FormData`.
// - The action function can be declared separately and passed to the form as a function reference.
// - A synchronous action function can process submitted values immediately.
// - An asynchronous action function can return `Promise<void>` and perform asynchronous work.
// - `FormData.get()` returns a `FormDataEntryValue`, which can be a string or a File.
// - Form controls need meaningful `name` attributes when their values should be included in `FormData`.
// - Checkbox controls contribute their value only when they are checked.
// - The submitted `FormData` represents the values captured at submission time rather than a live view of the controls.
// - A form action function does not receive a `React.FormEvent`; it receives `FormData` instead.
// - A form action function does not require `event.preventDefault()` because React handles the form Action submission.
// - An action function can perform application logic after validating the submitted `FormData`.

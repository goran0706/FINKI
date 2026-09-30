/**
 * Server Form Actions
 * ====================
 *
 * A Server Function can be passed directly to a form's `action` prop so that form
 * submission is processed on the server. The browser submits the form data, while
 * React and the server framework coordinate the Server Function invocation.
 *
 * Server Functions must be asynchronous and are marked with the `"use server"`
 * directive. The exact transport, serialization, authentication, and request handling
 * are provided by the React Server Components framework or server environment hosting
 * the application; React itself does not define a standalone HTTP endpoint for the
 * function.
 *
 * A Server Function should treat every value in `FormData` as untrusted input. Client
 * validation can improve the user experience, but server-side validation remains
 * necessary because the server cannot trust the browser or previously rendered UI.
 */

"use server";

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface ServerFormActionState {
  readonly message: string;
  readonly error: string | null;
}

interface ServerFormProps {
  readonly action: (formData: FormData) => Promise<void>;
}

interface ServerValidationResult {
  readonly message: string;
  readonly error: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A Server Function can be used directly as a form Action. The function receives
 * the submitted FormData on the server instead of a React submit event.
 */
export async function submitProfile(formData: FormData): Promise<void> {
  const name: FormDataEntryValue | null = formData.get("name");
  const email: FormDataEntryValue | null = formData.get("email");

  const normalizedName: string = String(name ?? "").trim();
  const normalizedEmail: string = String(email ?? "").trim();

  if (normalizedName === "" || normalizedEmail === "") {
    throw new Error("Name and email are required.");
  }

  // Server-side processing would occur here.
  console.log({
    name: normalizedName,
    email: normalizedEmail,
  });
}

/**
 * The form Action can perform server-side validation before processing the data.
 * FormData values must be validated on the server even when the form has client-side
 * validation, because a client can submit arbitrary data.
 */
export async function validateServerForm(formData: FormData): Promise<void> {
  const username: FormDataEntryValue | null = formData.get("username");
  const normalizedUsername: string = String(username ?? "").trim();

  if (normalizedUsername.length < 3) {
    throw new Error("Username must contain at least three characters.");
  }

  if (normalizedUsername.length > 30) {
    throw new Error("Username must not exceed thirty characters.");
  }

  console.log(`Validated username: ${normalizedUsername}`);
}

/**
 * A Server Function can perform asynchronous work such as database operations
 * or calls to other server-side services. The actual persistence mechanism depends
 * on the application's server environment.
 */
export async function saveServerForm(formData: FormData): Promise<void> {
  const title: FormDataEntryValue | null = formData.get("title");
  const content: FormDataEntryValue | null = formData.get("content");

  const normalizedTitle: string = String(title ?? "").trim();
  const normalizedContent: string = String(content ?? "").trim();

  if (normalizedTitle === "" || normalizedContent === "") {
    throw new Error("Title and content are required.");
  }

  // Database persistence would normally happen here.
  console.log({
    title: normalizedTitle,
    content: normalizedContent,
  });
}

/**
 * A Server Function can be used with a form without manually constructing
 * a React submit event or calling `preventDefault()`.
 */
export const ServerFormBasic: React.FC<ServerFormProps> = ({ action }): React.ReactElement => {
  return (
    <form action={action}>
      <label>
        Name
        <input name="name" defaultValue="Ada" />
      </label>

      <label>
        Email
        <input name="email" type="email" defaultValue="ada@example.com" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Different forms can use different Server Functions. Each form controls which
 * server-side operation receives its submitted FormData.
 */
export const ServerFormOperations: React.FC = (): React.ReactElement => {
  return (
    <div>
      <form action={submitProfile}>
        <input name="name" defaultValue="Ada" />
        <input name="email" defaultValue="ada@example.com" />
        <button type="submit">Submit Profile</button>
      </form>

      <form action={validateServerForm}>
        <input name="username" defaultValue="developer" />
        <button type="submit">Validate Username</button>
      </form>

      <form action={saveServerForm}>
        <input name="title" defaultValue="Document" />
        <textarea name="content" defaultValue="Content" />
        <button type="submit">Save Document</button>
      </form>
    </div>
  );
};

/**
 * Server-side validation is still required even when HTML validation attributes
 * are present. Browser validation can be bypassed, so the server must validate
 * the received FormData independently.
 */
export const ServerFormValidation: React.FC = (): React.ReactElement => {
  return (
    <form action={validateServerForm}>
      <label>
        Username
        <input name="username" minLength={3} maxLength={30} required defaultValue="" />
      </label>

      <button type="submit">Create Account</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ServerFormActions: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>Server Form Actions</h1>

      <h2>1. Server Function as Form Action</h2>
      <ServerFormBasic action={submitProfile} />

      <h2>2. Multiple Server Form Operations</h2>
      <ServerFormOperations />

      <h2>3. Server-Side Validation</h2>
      <ServerFormValidation />
    </div>
  );
};

export default ServerFormActions;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A Server Function can be passed to a form's `action` prop.
// - Server Functions must be asynchronous and use the `"use server"` directive.
// - The Server Function receives the submitted `FormData` rather than a React submit event.
// - The server must validate submitted data because client-side validation is not a security boundary.
// - Server Functions can perform server-side work such as persistence or service calls.
// - React and the hosting React Server Components framework coordinate the Server Function invocation.
// - The exact transport and server infrastructure depend on the framework hosting the application.
// - Server form Actions avoid requiring a client-side `onSubmit` handler for the server operation.

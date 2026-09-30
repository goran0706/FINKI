/**
 * Server Functions
 * ================
 *
 * Server Functions are asynchronous functions that run on the server and can be called from
 * Client Components. The `"use server"` directive marks a function as callable from client-side
 * code, allowing React and the framework to create a server reference and perform the network
 * request required to execute the function on the server.
 */

import { type FC, type FormEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic Server Function
// ---------------------------------------------------------------------

export async function getMessage(): Promise<string> {
  "use server";

  return "Hello from the server.";
}

// A Server Function must be asynchronous because calling it from the client
// involves an asynchronous network request to the server.

// ---------------------------------------------------------------------
// 2. The `use server` directive marks the function
// ---------------------------------------------------------------------

export async function createMessage(message: string): Promise<string> {
  "use server";

  return `Created message: ${message}`;
}

// `"use server"` tells the React Server Components implementation that this
// function can be referenced by client-side code and executed on the server.

// ---------------------------------------------------------------------
// 3. Server Functions are not Server Components
// ---------------------------------------------------------------------

export async function getAccountName(): Promise<string> {
  "use server";

  return "John Doe";
}

// The `"use server"` directive does not mark a component as a Server Component.
// It marks a function as a Server Function.
//
// Server Components do not require a directive.

// ---------------------------------------------------------------------
// 4. Server Functions are asynchronous
// ---------------------------------------------------------------------

export async function calculateTotal(price: number, quantity: number): Promise<number> {
  "use server";

  return price * quantity;
}

// The function returns a Promise because Server Function calls cross
// the client-server boundary asynchronously.

// ---------------------------------------------------------------------
// 5. Server Functions can receive arguments
// ---------------------------------------------------------------------

interface CreateUserInput {
  readonly name: string;
  readonly email: string;
}

export async function createUser(input: CreateUserInput): Promise<string> {
  "use server";

  return `Created ${input.name} (${input.email})`;
}

// Arguments sent from the client must use values supported by the
// Server Function serialization model.

// ---------------------------------------------------------------------
// 6. Arguments are client-controlled
// ---------------------------------------------------------------------

interface UpdateProfileInput {
  readonly displayName: string;
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  "use server";

  // The client can control `input`.
  // Validation and authorization must happen before performing the mutation.

  if (input.displayName.trim() === "") {
    throw new Error("Display name is required.");
  }

  // Persist the validated value on the server.
}

// Never assume that TypeScript types or the Client Component have already
// validated the data correctly. The server must validate received input.

// ---------------------------------------------------------------------
// 7. Validate primitive arguments
// ---------------------------------------------------------------------

export async function saveQuantity(quantity: number): Promise<void> {
  "use server";

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  // Persist the validated quantity.
}

// Runtime validation is required because TypeScript types do not validate
// values received over the network.

// ---------------------------------------------------------------------
// 8. Validate strings
// ---------------------------------------------------------------------

export async function saveUsername(username: string): Promise<void> {
  "use server";

  const normalizedUsername = username.trim();

  if (normalizedUsername.length < 3) {
    throw new Error("Username must contain at least 3 characters.");
  }

  // Persist `normalizedUsername`.
}

// Normalize and validate values on the server before using them.

// ---------------------------------------------------------------------
// 9. Server-side authorization
// ---------------------------------------------------------------------

interface AccountUpdate {
  readonly accountId: string;
  readonly displayName: string;
}

async function getCurrentUserId(): Promise<string | null> {
  return "user-001";
}

async function canUpdateAccount(userId: string, accountId: string): Promise<boolean> {
  return userId === "user-001" && accountId === "account-001";
}

export async function updateAccount(input: AccountUpdate): Promise<void> {
  "use server";

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  if (!(await canUpdateAccount(userId, input.accountId))) {
    throw new Error("Not authorized.");
  }

  if (input.displayName.trim() === "") {
    throw new Error("Display name is required.");
  }

  // Perform the authorized mutation.
}

// Authentication identifies the caller.
// Authorization determines whether that caller may perform the operation.

// ---------------------------------------------------------------------
// 10. Server Functions can access server-side resources
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

async function updateProductInDatabase(product: Product): Promise<void> {
  // Database access would happen here.
  void product;
}

export async function updateProduct(product: Product): Promise<void> {
  "use server";

  await updateProductInDatabase(product);
}

// Server Functions can access server-side resources that should not be
// exposed to browser code, such as database connections or private services.

// ---------------------------------------------------------------------
// 11. Server Functions can call server-only helpers
// ---------------------------------------------------------------------

async function readInventory(productId: string): Promise<number> {
  // Server-side database lookup.
  return productId === "product-001" ? 10 : 0;
}

export async function reserveProduct(productId: string, quantity: number): Promise<void> {
  "use server";

  const available = await readInventory(productId);

  if (quantity < 1 || quantity > available) {
    throw new Error("Requested quantity is unavailable.");
  }

  // Reserve the validated quantity on the server.
}

// Internal helpers do not need to be Server Functions when they are only
// called by other server-side code.

// ---------------------------------------------------------------------
// 12. Server Functions can return values
// ---------------------------------------------------------------------

export async function getUpdatedName(name: string): Promise<string> {
  "use server";

  const normalizedName = name.trim();

  if (normalizedName === "") {
    throw new Error("Name is required.");
  }

  return normalizedName;
}

// A Client Component receives the resolved return value after the
// Server Function request completes.

// ---------------------------------------------------------------------
// 13. Calling a Server Function is asynchronous
// ---------------------------------------------------------------------

async function useServerFunctionResult(): Promise<void> {
  const name = await getUpdatedName("John Doe");

  console.log(name);
}

// The call returns a Promise and must be awaited when the result is needed.

// ---------------------------------------------------------------------
// 14. Module-level `use server`
// ---------------------------------------------------------------------

// A separate server-only module can use:
//
// "use server";
//
// export async function createMessage(
//     message: string,
// ): Promise<void> {
//     // Server-side mutation.
// }
//
// export async function deleteMessage(
//     messageId: string,
// ): Promise<void> {
//     // Server-side mutation.
// }
//
// A module-level directive marks all exports in that module as Server Functions.
// This is the form required when Client Components import Server Functions.

// ---------------------------------------------------------------------
// 15. Function-level vs. module-level directives
// ---------------------------------------------------------------------

// Function-level:
//
// async function updateProfile() {
//     "use server";
//
//     // Only this function is a Server Function.
// }
//
// Module-level:
//
// "use server";
//
// export async function updateProfile() {
//     // Server Function.
// }
//
// export async function deleteProfile() {
//     // Server Function.
// }
//
// The two forms serve different organization patterns.

// ---------------------------------------------------------------------
// 16. Server Functions can be defined inside Server Components
// ---------------------------------------------------------------------

interface NotePageProps {
  readonly noteId: string;
}

async function getNote(noteId: string): Promise<string> {
  return `Note ${noteId}`;
}

export const NotePage: FC<NotePageProps> = async ({ noteId }): Promise<ReactElement> => {
  const note = await getNote(noteId);

  async function saveNote(): Promise<void> {
    "use server";

    console.log(`Saving ${note}`);
  }

  return (
    <article>
      <h1>{note}</h1>
      <button type="button" onClick={saveNote}>
        Save
      </button>
    </article>
  );
};

// A Server Component can define a Server Function and pass the resulting
// Server Function reference to a Client Component.

// ---------------------------------------------------------------------
// 17. Passing a Server Function to a Client Component
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly action: () => Promise<void>;
}

// In an actual Client Component:
//
// "use client";
//
// export const SaveButton = ({
//     action,
// }: SaveButtonProps): ReactElement => {
//     return (
//         <button
//             type="button"
//             onClick={() => {
//                 void action();
//             }}
//         >
//             Save
//         </button>
//     );
// };
//
// The function received by the Client Component is a Server Function reference,
// not the original server-side function implementation.

// ---------------------------------------------------------------------
// 18. Server Function references are not ordinary functions
// ---------------------------------------------------------------------

// When a Server Function is passed to a Client Component, the client does not
// receive the server's implementation and execute it in the browser.
//
// Conceptually:
//
// Client Component
//       |
//       | call server reference
//       v
//   network request
//       |
//       v
// Server Function
//       |
//       v
// server-side result

// The actual implementation remains on the server.

// ---------------------------------------------------------------------
// 19. Importing Server Functions into Client Components
// ---------------------------------------------------------------------

// A module intended to be imported by Client Components can use:
//
// "use server";
//
// export async function deleteMessage(
//     messageId: string,
// ): Promise<void> {
//     // Server-side mutation.
// }
//
// A Client Component can then import `deleteMessage` from that module.
//
// "use client";
//
// import {deleteMessage} from "./actions";
//
// The bundler/framework provides the Client Component with a reference to
// the Server Function rather than shipping the server implementation.

// ---------------------------------------------------------------------
// 20. Ordinary functions are not Server Functions
// ---------------------------------------------------------------------

const formatMessage = (message: string): string => {
  return message.trim();
};

// This ordinary function cannot be imported by Client Components as a Server Function:
//
// export {formatMessage};
//
// A function must be explicitly marked with `"use server"` or be exported
// from a module marked with `"use server"`.

// ---------------------------------------------------------------------
// 21. Server Functions must be async
// ---------------------------------------------------------------------

// This is invalid:
//
// function invalidServerFunction(): void {
//     "use server";
// }
//
// `"use server"` can only mark an asynchronous function because the client
// invokes the server function through an asynchronous network request.

// ---------------------------------------------------------------------
// 22. Form actions
// ---------------------------------------------------------------------

export async function submitContactForm(formData: FormData): Promise<void> {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name is required.");
  }

  if (typeof email !== "string" || email.trim() === "") {
    throw new Error("Email is required.");
  }

  // Persist the validated form submission.
}

// A Server Function can receive FormData when used as a form action.

// ---------------------------------------------------------------------
// 23. Form action with a Client Component
// ---------------------------------------------------------------------

interface ContactFormProps {
  readonly action: (formData: FormData) => Promise<void>;
}

// Conceptually:
//
// "use client";
//
// export const ContactForm = ({
//     action,
// }: ContactFormProps): ReactElement => {
//     return (
//         <form action={action}>
//             <input
//                 name="name"
//                 type="text"
//             />
//             <input
//                 name="email"
//                 type="email"
//             />
//             <button type="submit">
//                 Submit
//             </button>
//         </form>
//     );
// };
//
// Passing a Server Function to `action` lets React invoke it when the form submits.

// ---------------------------------------------------------------------
// 24. Form actions receive FormData
// ---------------------------------------------------------------------

export async function requestUsername(formData: FormData): Promise<string> {
  "use server";

  const value = formData.get("username");

  if (typeof value !== "string") {
    throw new Error("Username is required.");
  }

  const username = value.trim();

  if (username.length < 3) {
    throw new Error("Username must contain at least 3 characters.");
  }

  return username;
}

// React supplies the submitted FormData when the Server Function is used
// as the form's `action`.

// ---------------------------------------------------------------------
// 25. FormData values must be validated
// ---------------------------------------------------------------------

export async function uploadMetadata(formData: FormData): Promise<void> {
  "use server";

  const title = formData.get("title");
  const category = formData.get("category");

  if (typeof title !== "string") {
    throw new Error("Title is required.");
  }

  if (typeof category !== "string") {
    throw new Error("Category is required.");
  }

  // Validate and persist the submitted values.
}

// FormData values can be strings, File objects, or null.
// Do not blindly cast them to the expected type.

// ---------------------------------------------------------------------
// 26. Server Functions and events
// ---------------------------------------------------------------------

export async function deleteProduct(productId: string): Promise<void> {
  "use server";

  if (productId.trim() === "") {
    throw new Error("Product ID is required.");
  }

  // Delete the product after authentication and authorization checks.
}

// A Client Component should pass serializable values to the Server Function.
//
// It should not send a browser event object:
//
// onClick={(event) => deleteProduct(event)}
//
// Event objects are not supported Server Function arguments.

// ---------------------------------------------------------------------
// 27. Server Functions outside forms
// ---------------------------------------------------------------------

export async function incrementLike(currentCount: number): Promise<number> {
  "use server";

  if (!Number.isInteger(currentCount) || currentCount < 0) {
    throw new Error("Invalid like count.");
  }

  return currentCount + 1;
}

// Server Functions can be called from client code outside a form.
// React recommends calling them in a Transition when doing so.

// ---------------------------------------------------------------------
// 28. Calling from a Client Component with a Transition
// ---------------------------------------------------------------------

// A Client Component could conceptually use:
//
// "use client";
//
// import {
//     useState,
//     useTransition,
//     type ReactElement,
// } from "react";
//
// export const LikeButton = (): ReactElement => {
//     const [count, setCount] = useState(0);
//     const [isPending, startTransition] = useTransition();
//
//     const handleClick = (): void => {
//         startTransition(async () => {
//             const nextCount = await incrementLike(count);
//
//             startTransition(() => {
//                 setCount(nextCount);
//             });
//         });
//     };
//
//     return (
//         <button
//             type="button"
//             onClick={handleClick}
//             disabled={isPending}
//         >
//             Likes: {count}
//         </button>
//     );
// };
//
// Calling a Server Function outside a form should be performed in a Transition
// so React can coordinate pending state and the asynchronous action.

// ---------------------------------------------------------------------
// 29. Forms automatically use transitions
// ---------------------------------------------------------------------

// When a Server Function is passed directly to:
//
// <form action={serverFunction}>
//
// React handles the form submission as an Action.
// The Server Function does not need to be manually wrapped in `startTransition`.

// ---------------------------------------------------------------------
// 30. `useActionState` can track the result
// ---------------------------------------------------------------------

export interface UpdateNameResult {
  readonly error: string | null;
}

export async function updateName(previousState: UpdateNameResult, formData: FormData): Promise<UpdateNameResult> {
  "use server";

  void previousState;

  const value = formData.get("name");

  if (typeof value !== "string" || value.trim() === "") {
    return {
      error: "Name is required.",
    };
  }

  return {
    error: null,
  };
}

// A Client Component can use `useActionState` with a Server Function:
//
// "use client";
//
// import {useActionState, type ReactElement} from "react";
//
// export const NameForm = (): ReactElement => {
//     const [state, action, isPending] = useActionState(
//         updateName,
//         {error: null},
//     );
//
//     return (
//         <form action={action}>
//             <input
//                 name="name"
//                 type="text"
//                 disabled={isPending}
//             />
//             <button
//                 type="submit"
//                 disabled={isPending}
//             >
//                 Save
//             </button>
//             {state.error !== null && (
//                 <p>{state.error}</p>
//             )}
//         </form>
//     );
// };

// `useActionState` lets the Client Component receive the latest return value
// and pending state from the action.

// ---------------------------------------------------------------------
// 31. Server Functions can return structured results
// ---------------------------------------------------------------------

interface SaveResult {
  readonly success: boolean;
  readonly message: string;
}

export async function saveSettings(settings: {
  readonly displayName: string;
  readonly email: string;
}): Promise<SaveResult> {
  "use server";

  if (settings.displayName.trim() === "") {
    return {
      success: false,
      message: "Display name is required.",
    };
  }

  if (settings.email.trim() === "") {
    return {
      success: false,
      message: "Email is required.",
    };
  }

  return {
    success: true,
    message: "Settings saved.",
  };
}

// Return values use the Server Function serialization model.
// Plain objects containing supported values are suitable return values.

// ---------------------------------------------------------------------
// 32. Server Functions can throw errors
// ---------------------------------------------------------------------

export async function publishArticle(articleId: string): Promise<void> {
  "use server";

  if (articleId.trim() === "") {
    throw new Error("Article ID is required.");
  }

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  // Publish only after validation and authorization.
}

// Errors can propagate to the caller.
// Applications should handle expected failures and provide appropriate UI feedback.

// ---------------------------------------------------------------------
// 33. Authentication must happen on the server
// ---------------------------------------------------------------------

export async function deleteAccount(): Promise<void> {
  "use server";

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  // Delete only the authenticated user's account.
  console.log(`Deleting account for ${userId}`);
}

// The Client Component should not be trusted to identify the current user.
// Authentication state must be checked using server-side mechanisms.

// ---------------------------------------------------------------------
// 34. Authorization must happen for every protected mutation
// ---------------------------------------------------------------------

export async function deleteOtherAccount(accountId: string): Promise<void> {
  "use server";

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  const authorized = await canUpdateAccount(userId, accountId);

  if (!authorized) {
    throw new Error("Not authorized.");
  }

  // Perform the protected mutation.
}

// Authorization belongs inside the server-side operation.
// Do not rely only on whether a button was visible in the Client Component.

// ---------------------------------------------------------------------
// 35. Server Functions can use private configuration
// ---------------------------------------------------------------------

async function sendInternalNotification(message: string): Promise<void> {
  // Access to private server configuration would happen here.
  console.log(message);
}

export async function notifyUser(userId: string, message: string): Promise<void> {
  "use server";

  if (userId.trim() === "") {
    throw new Error("User ID is required.");
  }

  if (message.trim() === "") {
    throw new Error("Message is required.");
  }

  await sendInternalNotification(message);
}

// Secrets and private configuration can remain inside server-side implementation code.

// ---------------------------------------------------------------------
// 36. Server Functions should focus on mutations
// ---------------------------------------------------------------------

export async function updatePreferences(preferences: {
  readonly emailNotifications: boolean;
  readonly theme: "light" | "dark";
}): Promise<void> {
  "use server";

  // Validate the authenticated user and persist the preferences.
  console.log(preferences);
}

// React documents Server Functions as primarily intended for mutations that update
// server-side state. They are not the recommended mechanism for ordinary data fetching.

// ---------------------------------------------------------------------
// 37. Data fetching belongs in Server Components when appropriate
// ---------------------------------------------------------------------

async function getProducts(): Promise<readonly Product[]> {
  return [
    {
      id: "product-001",
      name: "Example Product",
      price: 49.99,
    },
  ];
}

export const ProductList = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

// Server Components can directly perform server-side data fetching.
// A Server Function is generally intended for operations that mutate server state.

// ---------------------------------------------------------------------
// 38. Server Functions and progressive enhancement
// ---------------------------------------------------------------------

export async function submitFeedback(formData: FormData): Promise<SaveResult> {
  "use server";

  const feedback = formData.get("feedback");

  if (typeof feedback !== "string" || feedback.trim() === "") {
    return {
      success: false,
      message: "Feedback is required.",
    };
  }

  return {
    success: true,
    message: "Feedback submitted.",
  };
}

// Server Functions used as form actions support progressive enhancement.
// Forms can be submitted before the client JavaScript has finished loading.

// ---------------------------------------------------------------------
// 39. Server Functions are framework-integrated
// ---------------------------------------------------------------------

// React defines the Server Function model, but a framework or compatible
// React Server Components bundler provides the infrastructure that turns
// `"use server"` functions into callable server references.
//
// The implementation of the network endpoint, request routing, and server
// execution is framework/bundler-specific.

// ---------------------------------------------------------------------
// 40. Server Functions are not ordinary API routes
// ---------------------------------------------------------------------

// An API route usually exposes an HTTP endpoint that application code calls
// explicitly using mechanisms such as `fetch`.
//
// A Server Function instead gives React a callable server reference:
//
// Client Component
//       |
//       | call Server Function
//       v
// React / framework integration
//       |
//       v
// server-side function
//
// The underlying network transport is an implementation detail of the
// React Server Components framework or bundler.

// ---------------------------------------------------------------------
// 41. Server Functions and serialization
// ---------------------------------------------------------------------

interface OrderInput {
  readonly productId: string;
  readonly quantity: number;
}

export async function placeOrder(input: OrderInput): Promise<{
  readonly orderId: string;
}> {
  "use server";

  if (input.productId.trim() === "") {
    throw new Error("Product ID is required.");
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  return {
    orderId: "order-001",
  };
}

// Server Function arguments are serialized when the client calls the function.
// React supports primitives, iterables with serializable values, Date, FormData,
// plain objects, Server Functions, and Promises, subject to the serialization rules.

// ---------------------------------------------------------------------
// 42. JSX is not a Server Function argument
// ---------------------------------------------------------------------

// This is invalid:
//
// export async function saveContent(
//     content: ReactElement,
// ): Promise<void> {
//     "use server";
//
//     // React elements are not supported Server Function arguments.
// }
//
// JSX and React elements can cross a Server-Client Component boundary in supported
// props, but they are not supported as Server Function arguments.

// ---------------------------------------------------------------------
// 43. Server Functions can receive FormData
// ---------------------------------------------------------------------

export async function saveProfileForm(formData: FormData): Promise<SaveResult> {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");

  if (typeof name !== "string" || name.trim() === "") {
    return {
      success: false,
      message: "Name is required.",
    };
  }

  if (typeof email !== "string" || email.trim() === "") {
    return {
      success: false,
      message: "Email is required.",
    };
  }

  return {
    success: true,
    message: "Profile saved.",
  };
}

// FormData is specifically supported for Server Function arguments and is
// especially useful with form actions.

// ---------------------------------------------------------------------
// 44. Server Function security boundary
// ---------------------------------------------------------------------

export async function changeEmail(email: string): Promise<void> {
  "use server";

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  const normalizedEmail = email.trim();

  if (!normalizedEmail.includes("@")) {
    throw new Error("Invalid email address.");
  }

  // Update the authenticated user's email address.
  console.log(userId, normalizedEmail);
}

// Treat every argument as untrusted input.
// Validate it, authenticate the caller, authorize the operation,
// and only then perform the mutation.

// ---------------------------------------------------------------------
// 45. Keep sensitive data on the server
// ---------------------------------------------------------------------

async function readPrivateConfiguration(): Promise<string> {
  return "private-server-value";
}

export async function performPrivateOperation(): Promise<void> {
  "use server";

  const secret = await readPrivateConfiguration();

  // Use the secret on the server without returning it to the client.
  console.log(secret.length);
}

// A Server Function should not return sensitive server-only values merely because
// they happen to be serializable.

// ---------------------------------------------------------------------
// 46. A Server Function can call another server-side helper
// ---------------------------------------------------------------------

async function persistMessage(message: string): Promise<void> {
  console.log(`Persisting: ${message}`);
}

export async function saveMessage(message: string): Promise<void> {
  "use server";

  const normalizedMessage = message.trim();

  if (normalizedMessage === "") {
    throw new Error("Message is required.");
  }

  await persistMessage(normalizedMessage);
}

// Server Functions can use ordinary server-side functions internally.
// Only the externally callable operation needs to be exposed as a Server Function.

// ---------------------------------------------------------------------
// 47. Complete mutation example
// ---------------------------------------------------------------------

interface SaveProfileInput {
  readonly displayName: string;
  readonly email: string;
}

interface SaveProfileResult {
  readonly success: boolean;
  readonly message: string;
}

async function saveProfileToDatabase(userId: string, input: SaveProfileInput): Promise<void> {
  console.log(`Saving ${input.displayName} for ${userId}`);
}

export async function saveProfile(input: SaveProfileInput): Promise<SaveProfileResult> {
  "use server";

  const userId = await getCurrentUserId();

  if (userId === null) {
    return {
      success: false,
      message: "Authentication required.",
    };
  }

  const displayName = input.displayName.trim();
  const email = input.email.trim();

  if (displayName === "") {
    return {
      success: false,
      message: "Display name is required.",
    };
  }

  if (!email.includes("@")) {
    return {
      success: false,
      message: "A valid email address is required.",
    };
  }

  await saveProfileToDatabase(userId, {
    displayName,
    email,
  });

  return {
    success: true,
    message: "Profile saved.",
  };
}

// This pattern keeps validation, authentication, authorization, and persistence
// on the server while exposing one asynchronous operation to the Client Component.

// ---------------------------------------------------------------------
// 48. Client Component form example
// ---------------------------------------------------------------------

interface ProfileFormProps {
  readonly action: (formData: FormData) => Promise<SaveResult>;
}

// Conceptually:
//
// "use client";
//
// import {useActionState, type ReactElement} from "react";
//
// export const ProfileForm = ({
//     action,
// }: ProfileFormProps): ReactElement => {
//     const [state, submitAction, isPending] = useActionState(
//         action,
//         {
//             success: false,
//             message: "",
//         },
//     );
//
//     return (
//         <form action={submitAction}>
//             <label>
//                 Display name
//                 <input
//                     name="displayName"
//                     type="text"
//                     disabled={isPending}
//                 />
//             </label>
//
//             <label>
//                 Email
//                 <input
//                     name="email"
//                     type="email"
//                     disabled={isPending}
//                 />
//             </label>
//
//             <button
//                 type="submit"
//                 disabled={isPending}
//             >
//                 Save
//             </button>
//
//             {state.message !== "" && (
//                 <p>{state.message}</p>
//             )}
//         </form>
//     );
// };
//
// A real form action can use `useActionState` when the UI needs the latest
// Server Function result and pending state.

// ---------------------------------------------------------------------
// 49. Event handler example
// ---------------------------------------------------------------------

interface DeleteButtonProps {
  readonly onDelete: () => Promise<void>;
}

// Conceptually:
//
// "use client";
//
// export const DeleteButton = ({
//     onDelete,
// }: DeleteButtonProps): ReactElement => {
//     const handleClick = (): void => {
//         void onDelete();
//     };
//
//     return (
//         <button
//             type="button"
//             onClick={handleClick}
//         >
//             Delete
//         </button>
//     );
// };
//
// The event handler runs in the browser.
// It calls the Server Function reference, which performs the mutation on the server.

// ---------------------------------------------------------------------
// 50. Server Function architecture
// ---------------------------------------------------------------------

// A typical flow is:
//
// 1. Server code defines an async Server Function.
// 2. `"use server"` marks the function as callable from client code.
// 3. The framework/bundler creates a server reference.
// 4. The Server Component can pass that reference to a Client Component,
//    or client code can import the Server Function from a server-action module.
// 5. The Client Component calls the reference.
// 6. React/framework sends a network request.
// 7. The server validates the serialized arguments.
// 8. The server authenticates and authorizes the operation.
// 9. The Server Function performs the mutation.
// 10. A serializable result or error is returned to the client.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server Functions are asynchronous server-side functions callable from Client Components.
// - The `"use server"` directive marks an async function as a Server Function.
// - `"use server"` does not mark a Server Component; Server Components have no directive.
// - Function-level `"use server"` marks one function.
// - Module-level `"use server"` marks all exports in that module as Server Functions.
// - Module-level Server Functions can be imported by Client Components through React's Server Components integration.
// - Server Function calls cross the client-server boundary through an asynchronous network request.
// - Server Functions can receive serializable arguments and return serializable values.
// - FormData is supported as a Server Function argument and is useful for form actions.
// - Ordinary JavaScript functions are not Server Functions unless explicitly marked or exported from a server-function module.
// - Server Functions must be asynchronous because the client call is asynchronous.
// - Server Functions are primarily designed for mutations that update server-side state.
// - Ordinary server-side data fetching is generally better performed directly in Server Components.
// - Server Functions can access databases, private services, server configuration, and other server-only resources.
// - Server Function arguments are fully controlled by the client and must be treated as untrusted input.
// - Runtime validation must happen on the server even when TypeScript types describe the arguments.
// - Authentication and authorization must be checked on the server for protected operations.
// - Client-side visibility checks are not a security boundary.
// - Server Functions can be passed to Client Components as supported function references.
// - Server Functions can be used as form `action` or `formAction` values.
// - Form actions are automatically handled as Actions, while Server Functions called elsewhere should be used in a Transition.
// - `useActionState` can track Server Function results and pending state in Client Components.
// - Server Functions are different from ordinary API routes and are integrated with React Server Components.
// - React defines the Server Function model, while a compatible framework or bundler provides the underlying server integration.

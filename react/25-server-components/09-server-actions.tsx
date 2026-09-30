/**
 * Server Actions
 * ==============
 *
 * A Server Action is a Server Function used as an Action, such as a function passed to a
 * form's `action` prop or invoked from another Action. Server Actions provide React with a
 * structured way to submit mutations to the server, manage pending state, return action
 * results, and progressively enhance forms.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Server Actions are Server Functions used as Actions
// ---------------------------------------------------------------------

// A Server Function is not automatically a Server Action.
//
// A Server Function becomes a Server Action when it is used as an Action,
// such as:
//
// <form action={serverFunction}>
//
// or:
//
// startTransition(async () => {
//     await serverFunction();
// });
//
// The broader term is "Server Function".
// "Server Action" describes its use as an Action.

// ---------------------------------------------------------------------
// 2. Basic Server Action
// ---------------------------------------------------------------------

export async function saveMessage(formData: FormData): Promise<void> {
  "use server";

  const message = formData.get("message");

  if (typeof message !== "string" || message.trim() === "") {
    throw new Error("Message is required.");
  }

  // Persist the message on the server.
}

// Passing `saveMessage` to a form's `action` prop makes it a Server Action.

// ---------------------------------------------------------------------
// 3. A form can use a Server Action directly
// ---------------------------------------------------------------------

export const MessagePage = (): ReactElement => {
  return (
    <main>
      <h1>Messages</h1>

      <form action={saveMessage}>
        <label htmlFor="message">Message</label>

        <input id="message" name="message" type="text" />

        <button type="submit">Save</button>
      </form>
    </main>
  );
};

// React passes the submitted FormData to the Server Action.
// The form does not need an `onSubmit` handler for this pattern.

// ---------------------------------------------------------------------
// 4. `action` is different from `onSubmit`
// ---------------------------------------------------------------------

export const SearchForm = (): ReactElement => {
  return (
    <form action={saveMessage}>
      <input name="message" type="text" />

      <button type="submit">Submit</button>
    </form>
  );
};

// A form `action` function receives FormData.
// A traditional `onSubmit` handler receives a browser submit event.
//
// `action` also gives React control over the Action lifecycle.
// Calling `event.preventDefault()` is not required for a form Action.

// ---------------------------------------------------------------------
// 5. Server Actions are asynchronous
// ---------------------------------------------------------------------

export async function createMessage(formData: FormData): Promise<void> {
  "use server";

  const message = formData.get("message");

  if (typeof message !== "string") {
    throw new Error("Message is required.");
  }

  await persistMessage(message);
}

async function persistMessage(message: string): Promise<void> {
  console.log(`Persisting: ${message}`);
}

// Server Actions are asynchronous because the underlying Server Function
// executes on the server and communicates across the client-server boundary.

// ---------------------------------------------------------------------
// 6. Extracting form values
// ---------------------------------------------------------------------

export async function updateProfile(formData: FormData): Promise<void> {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");

  if (typeof name !== "string") {
    throw new Error("Name is required.");
  }

  if (typeof email !== "string") {
    throw new Error("Email is required.");
  }

  // Validate and persist the values on the server.
}

// Form fields become entries in FormData according to their `name` attributes.

// ---------------------------------------------------------------------
// 7. FormData values require runtime validation
// ---------------------------------------------------------------------

export async function saveQuantity(formData: FormData): Promise<void> {
  "use server";

  const value = formData.get("quantity");

  if (typeof value !== "string") {
    throw new Error("Quantity is required.");
  }

  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  // Persist the validated quantity.
}

// Form input values arrive as runtime data.
// TypeScript does not validate values submitted by a browser.

// ---------------------------------------------------------------------
// 8. Server Actions must treat input as untrusted
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

export async function updateAccount(formData: FormData): Promise<void> {
  "use server";

  const accountId = formData.get("accountId");
  const displayName = formData.get("displayName");

  if (typeof accountId !== "string") {
    throw new Error("Account ID is required.");
  }

  if (typeof displayName !== "string" || displayName.trim() === "") {
    throw new Error("Display name is required.");
  }

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  if (!(await canUpdateAccount(userId, accountId))) {
    throw new Error("Not authorized.");
  }

  const update: AccountUpdate = {
    accountId,
    displayName: displayName.trim(),
  };

  console.log(update);
}

// Authentication and authorization belong inside the server-side operation.

// ---------------------------------------------------------------------
// 9. Server Actions can use hidden fields
// ---------------------------------------------------------------------

export const ProductForm = (): ReactElement => {
  return (
    <form action={addToCart}>
      <input name="productId" type="hidden" value="product-001" />

      <input name="quantity" type="number" min="1" defaultValue="1" />

      <button type="submit">Add to cart</button>
    </form>
  );
};

export async function addToCart(formData: FormData): Promise<void> {
  "use server";

  const productId = formData.get("productId");
  const quantity = formData.get("quantity");

  if (typeof productId !== "string") {
    throw new Error("Product ID is required.");
  }

  if (typeof quantity !== "string") {
    throw new Error("Quantity is required.");
  }

  console.log(productId, quantity);
}

// Hidden fields are useful for values associated with the submitted form.
// They are still client-controlled and must be validated.

// ---------------------------------------------------------------------
// 10. Server Actions can return structured results
// ---------------------------------------------------------------------

interface SaveResult {
  readonly success: boolean;
  readonly message: string;
}

export async function saveSettings(formData: FormData): Promise<SaveResult> {
  "use server";

  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    return {
      success: false,
      message: "Name is required.",
    };
  }

  return {
    success: true,
    message: "Settings saved.",
  };
}

// Returning expected validation or business errors as data is often preferable
// when the UI needs to display those errors directly.

// ---------------------------------------------------------------------
// 11. Throwing unexpected errors
// ---------------------------------------------------------------------

export async function deleteMessage(formData: FormData): Promise<void> {
  "use server";

  const messageId = formData.get("messageId");

  if (typeof messageId !== "string" || messageId === "") {
    throw new Error("Message ID is required.");
  }

  await removeMessage(messageId);
}

async function removeMessage(messageId: string): Promise<void> {
  console.log(`Deleting ${messageId}`);
}

// Known validation failures can be returned as action state.
// Unexpected failures can be thrown and handled by an Error Boundary.

// ---------------------------------------------------------------------
// 12. Server Actions can be used by Client Components
// ---------------------------------------------------------------------

// A Client Component can import a Server Function from a module with
// a module-level `"use server"` directive:
//
// "use server";
//
// export async function deleteMessage(
//     formData: FormData,
// ): Promise<void> {
//     // Server-side mutation.
// }
//
// The Client Component receives a server reference rather than the
// server implementation itself.

// ---------------------------------------------------------------------
// 13. Client Component using a Server Action
// ---------------------------------------------------------------------

// Conceptually:
//
// "use client";
//
// import {deleteMessage} from "./actions";
//
// export const DeleteForm = (): ReactElement => {
//     return (
//         <form action={deleteMessage}>
//             <input
//                 name="messageId"
//                 type="hidden"
//                 value="message-001"
//             />
//
//             <button type="submit">
//                 Delete
//             </button>
//         </form>
//     );
// };
//
// The form can be rendered by a Client Component while the Server Action
// itself remains implemented on the server.

// ---------------------------------------------------------------------
// 14. Server Actions and progressive enhancement
// ---------------------------------------------------------------------

export const NewsletterForm = (): ReactElement => {
  return (
    <form action={subscribe}>
      <label htmlFor="email">Email</label>

      <input id="email" name="email" type="email" required />

      <button type="submit">Subscribe</button>
    </form>
  );
};

export async function subscribe(formData: FormData): Promise<void> {
  "use server";

  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    throw new Error("A valid email address is required.");
  }

  // Subscribe the user on the server.
}

// A Server Function used directly as a form Action can support submission
// before the Client Component JavaScript has finished loading.

// ---------------------------------------------------------------------
// 15. Progressive enhancement before hydration
// ---------------------------------------------------------------------

// With a Server Action as the form's action:
//
// 1. The browser can submit the form.
// 2. The server receives the form data.
// 3. The Server Action performs the mutation.
// 4. The application can progressively enhance the interaction once
//    the client-side React code has loaded.
//
// This makes Server Actions particularly useful for form mutations.

// ---------------------------------------------------------------------
// 16. Successful form Actions reset uncontrolled fields
// ---------------------------------------------------------------------

export const CommentForm = (): ReactElement => {
  return (
    <form action={saveComment}>
      <textarea name="comment" rows={4} />

      <button type="submit">Post comment</button>
    </form>
  );
};

export async function saveComment(formData: FormData): Promise<void> {
  "use server";

  const comment = formData.get("comment");

  if (typeof comment !== "string" || comment.trim() === "") {
    throw new Error("Comment is required.");
  }

  // Persist the comment.
}

// After a successful form Action, React automatically resets uncontrolled
// form fields. Controlled fields remain under the control of their state.

// ---------------------------------------------------------------------
// 17. `useActionState` tracks Server Action state
// ---------------------------------------------------------------------

// A Client Component can use `useActionState` when it needs the latest
// returned action state and pending state:
//
// "use client";
//
// import {
//     useActionState,
//     type ReactElement,
// } from "react";
//
// import {saveSettings} from "./actions";
//
// export const SettingsForm = (): ReactElement => {
//     const [state, formAction, isPending] = useActionState(
//         saveSettings,
//         {
//             success: false,
//             message: "",
//         },
//     );
//
//     return (
//         <form action={formAction}>
//             <input
//                 name="name"
//                 type="text"
//                 disabled={isPending}
//             />
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
// `useActionState` returns the current state, a form action, and the
// pending state in current React versions.

// ---------------------------------------------------------------------
// 18. The action signature changes with `useActionState`
// ---------------------------------------------------------------------

export interface NameActionState {
  readonly error: string | null;
}

export async function updateName(previousState: NameActionState, formData: FormData): Promise<NameActionState> {
  "use server";

  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    return {
      error: "Name is required.",
    };
  }

  void previousState;

  return {
    error: null,
  };
}

// Without `useActionState`, a form Action normally receives FormData:
//
// async function updateName(formData: FormData) {}
//
// With `useActionState`, the action receives the previous state first:
//
// async function updateName(
//     previousState: NameActionState,
//     formData: FormData,
// ) {}
//
// This difference is important when defining the function signature.

// ---------------------------------------------------------------------
// 19. Displaying validation errors with `useActionState`
// ---------------------------------------------------------------------

// Conceptually:
//
// "use client";
//
// import {
//     useActionState,
//     type ReactElement,
// } from "react";
//
// export const NameForm = (): ReactElement => {
//     const [state, formAction, isPending] = useActionState(
//         updateName,
//         {
//             error: null,
//         },
//     );
//
//     return (
//         <form action={formAction}>
//             <label htmlFor="name">
//                 Name
//             </label>
//
//             <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 disabled={isPending}
//             />
//
//             <button
//                 type="submit"
//                 disabled={isPending}
//             >
//                 Save
//             </button>
//
//             {state.error !== null && (
//                 <p role="alert">
//                     {state.error}
//                 </p>
//             )}
//         </form>
//     );
// };
//
// The Server Action returns the validation result.
// `useActionState` makes that result available to the Client Component.

// ---------------------------------------------------------------------
// 20. `isPending` represents the Action state
// ---------------------------------------------------------------------

// Conceptually:
//
// const [state, formAction, isPending] = useActionState(
//     updateName,
//     {error: null},
// );
//
// <button
//     type="submit"
//     disabled={isPending}
// >
//     {isPending ? "Saving..." : "Save"}
// </button>
//
// The pending value allows the UI to communicate that the Action is running.

// ---------------------------------------------------------------------
// 21. `useFormStatus` can read the parent form status
// ---------------------------------------------------------------------

// A nested Client Component can use `useFormStatus`:
//
// "use client";
//
// import {
//     useFormStatus,
//     type ReactElement,
// } from "react-dom";
//
// export const SubmitButton = (): ReactElement => {
//     const {pending} = useFormStatus();
//
//     return (
//         <button
//             type="submit"
//             disabled={pending}
//         >
//             {pending ? "Saving..." : "Save"}
//         </button>
//     );
// };
//
// The hook reads the status of the nearest parent form Action.

// ---------------------------------------------------------------------
// 22. `useFormStatus` must be inside the form subtree
// ---------------------------------------------------------------------

// Conceptually:
//
// <form action={saveSettings}>
//     <SubmitButton />
// </form>
//
// `SubmitButton` can read the form's status because it is rendered
// inside the form.
//
// A component rendered outside the form cannot use `useFormStatus`
// to observe that form's submission.

// ---------------------------------------------------------------------
// 23. Server Actions can be assigned to `formAction`
// ---------------------------------------------------------------------

export async function archiveMessage(formData: FormData): Promise<void> {
  "use server";

  const messageId = formData.get("messageId");

  if (typeof messageId !== "string") {
    throw new Error("Message ID is required.");
  }

  console.log(`Archiving ${messageId}`);
}

// A button can have its own Action using `formAction`:
//
// <form>
//     <input
//         name="messageId"
//         type="hidden"
//         value="message-001"
//     />
//
//     <button
//         type="submit"
//         formAction={archiveMessage}
//     >
//         Archive
//     </button>
// </form>
//
// This is useful when multiple submit buttons perform different mutations.

// ---------------------------------------------------------------------
// 24. Multiple Actions in one form
// ---------------------------------------------------------------------

export async function publishMessage(formData: FormData): Promise<void> {
  "use server";

  const messageId = formData.get("messageId");

  if (typeof messageId !== "string") {
    throw new Error("Message ID is required.");
  }

  console.log(`Publishing ${messageId}`);
}

export async function archiveMessageCopy(formData: FormData): Promise<void> {
  "use server";

  const messageId = formData.get("messageId");

  if (typeof messageId !== "string") {
    throw new Error("Message ID is required.");
  }

  console.log(`Archiving ${messageId}`);
}

// Conceptually:
//
// <form>
//     <input
//         name="messageId"
//         type="hidden"
//         value="message-001"
//     />
//
//     <button
//         type="submit"
//         formAction={publishMessage}
//     >
//         Publish
//     </button>
//
//     <button
//         type="submit"
//         formAction={archiveMessageCopy}
//     >
//         Archive
//     </button>
// </form>
//
// Each submit button can select a different Action.

// ---------------------------------------------------------------------
// 25. Server Actions can return validation state
// ---------------------------------------------------------------------

interface LoginState {
  readonly error: string | null;
  readonly success: boolean;
}

export async function login(previousState: LoginState, formData: FormData): Promise<LoginState> {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  void previousState;

  if (typeof email !== "string" || !email.includes("@")) {
    return {
      error: "Enter a valid email address.",
      success: false,
    };
  }

  if (typeof password !== "string" || password.length < 8) {
    return {
      error: "Password must contain at least 8 characters.",
      success: false,
    };
  }

  // Authenticate on the server.

  return {
    error: null,
    success: true,
  };
}

// Expected validation failures can be represented as returned state.

// ---------------------------------------------------------------------
// 26. Authentication remains server-side
// ---------------------------------------------------------------------

export async function authenticateUser(previousState: LoginState, formData: FormData): Promise<LoginState> {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  void previousState;

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      error: "Credentials are required.",
      success: false,
    };
  }

  // Verify credentials using server-side authentication infrastructure.
  // Do not trust a client-side authenticated state.

  return {
    error: null,
    success: true,
  };
}

// Authentication credentials and authorization decisions must be handled
// by trusted server-side code.

// ---------------------------------------------------------------------
// 27. Authorization belongs inside the Action
// ---------------------------------------------------------------------

export async function deleteAccount(formData: FormData): Promise<void> {
  "use server";

  const accountId = formData.get("accountId");

  if (typeof accountId !== "string") {
    throw new Error("Account ID is required.");
  }

  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("Authentication required.");
  }

  if (!(await canUpdateAccount(userId, accountId))) {
    throw new Error("Not authorized.");
  }

  console.log(`Deleting ${accountId}`);
}

// Hiding a delete button in the Client Component is not authorization.
// The Server Action must verify permission before the mutation.

// ---------------------------------------------------------------------
// 28. Avoid returning sensitive server data
// ---------------------------------------------------------------------

interface PublicActionResult {
  readonly success: boolean;
  readonly message: string;
}

export async function updateEmail(formData: FormData): Promise<PublicActionResult> {
  "use server";

  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    return {
      success: false,
      message: "Invalid email address.",
    };
  }

  // Update the authenticated user's email on the server.

  return {
    success: true,
    message: "Email updated.",
  };
}

// Return only the data the client needs.
// Do not return private database records, credentials, secrets, or internal configuration.

// ---------------------------------------------------------------------
// 29. Server Actions and browser events
// ---------------------------------------------------------------------

// Do not pass a browser event object to a Server Action:
//
// const handleSubmit = (event: SubmitEvent): void => {
//     void saveMessage(event);
// };
//
// Events are not supported Server Function arguments.
//
// Instead, let React provide FormData through:
//
// <form action={saveMessage}>
//
// or extract the required values before calling the Server Action.

// ---------------------------------------------------------------------
// 30. Server Actions outside forms
// ---------------------------------------------------------------------

export async function incrementLike(currentCount: number): Promise<number> {
  "use server";

  if (!Number.isInteger(currentCount) || currentCount < 0) {
    throw new Error("Invalid count.");
  }

  return currentCount + 1;
}

// Server Functions can be called outside forms.
// When called from client code outside a form Action, they should be
// invoked inside a Transition.

// ---------------------------------------------------------------------
// 31. Calling a Server Action outside a form
// ---------------------------------------------------------------------

// Conceptually:
//
// "use client";
//
// import {
//     useState,
//     useTransition,
//     type ReactElement,
// } from "react";
//
// import {incrementLike} from "./actions";
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
//             {isPending ? "Updating..." : `Likes: ${count}`}
//         </button>
//     );
// };
//
// Forms automatically run Server Actions as Actions.
// Direct client-side calls outside forms should be wrapped in a Transition.

// ---------------------------------------------------------------------
// 32. Why forms are a natural Server Action boundary
// ---------------------------------------------------------------------

export const ProfileForm = (): ReactElement => {
  return (
    <form action={saveProfile}>
      <label htmlFor="displayName">Display name</label>

      <input id="displayName" name="displayName" type="text" />

      <label htmlFor="email">Email</label>

      <input id="email" name="email" type="email" />

      <button type="submit">Save profile</button>
    </form>
  );
};

export async function saveProfile(formData: FormData): Promise<SaveResult> {
  "use server";

  const displayName = formData.get("displayName");
  const email = formData.get("email");

  if (typeof displayName !== "string" || displayName.trim() === "") {
    return {
      success: false,
      message: "Display name is required.",
    };
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return {
      success: false,
      message: "A valid email address is required.",
    };
  }

  // Persist the validated profile.

  return {
    success: true,
    message: "Profile saved.",
  };
}

// Forms naturally provide the mutation input as FormData and integrate
// directly with React's Action lifecycle.

// ---------------------------------------------------------------------
// 33. `useActionState` can combine state and form submission
// ---------------------------------------------------------------------

// Conceptually:
//
// "use client";
//
// import {
//     useActionState,
//     type ReactElement,
// } from "react";
//
// import {saveProfile} from "./actions";
//
// export const ProfileFormWithState = (): ReactElement => {
//     const [state, formAction, isPending] = useActionState(
//         saveProfile,
//         {
//             success: false,
//             message: "",
//         },
//     );
//
//     return (
//         <form action={formAction}>
//             <input
//                 name="displayName"
//                 type="text"
//                 disabled={isPending}
//             />
//
//             <input
//                 name="email"
//                 type="email"
//                 disabled={isPending}
//             />
//
//             <button
//                 type="submit"
//                 disabled={isPending}
//             >
//                 {isPending ? "Saving..." : "Save"}
//             </button>
//
//             {state.message !== "" && (
//                 <p>{state.message}</p>
//             )}
//         </form>
//     );
// };
//
// `useActionState` turns the Server Action's return value into component state.

// ---------------------------------------------------------------------
// 34. `useActionState` changes the first argument
// ---------------------------------------------------------------------

export interface ProfileActionState {
  readonly success: boolean;
  readonly message: string;
}

export async function saveProfileWithState(
  previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  "use server";

  const displayName = formData.get("displayName");

  if (typeof displayName !== "string" || displayName.trim() === "") {
    return {
      success: false,
      message: "Display name is required.",
    };
  }

  console.log(previousState);

  return {
    success: true,
    message: "Profile saved.",
  };
}

// The first parameter is the previous action state.
// The second parameter is the FormData supplied by the form.

// ---------------------------------------------------------------------
// 35. `useActionState` with a permalink
// ---------------------------------------------------------------------

// Conceptually:
//
// const [state, formAction] = useActionState(
//     saveProfileWithState,
//     {
//         success: false,
//         message: "",
//     },
//     "/profile",
// );
//
// The optional permalink gives React a stable URL to navigate to when a
// form using progressive enhancement is submitted before the JavaScript
// bundle has loaded.
//
// The destination must render the same form/action combination so React
// can restore the action state correctly.

// ---------------------------------------------------------------------
// 36. Server Actions can be used with dynamic forms
// ---------------------------------------------------------------------

interface ProductFormProps {
  readonly productId: string;
}

export const ProductFormWithId: FC<ProductFormProps> = ({ productId }): ReactElement => {
  return (
    <form action={purchaseProduct}>
      <input name="productId" type="hidden" value={productId} />

      <input name="quantity" type="number" min="1" defaultValue="1" />

      <button type="submit">Purchase</button>
    </form>
  );
};

export async function purchaseProduct(formData: FormData): Promise<SaveResult> {
  "use server";

  const productId = formData.get("productId");
  const quantityValue = formData.get("quantity");

  if (typeof productId !== "string") {
    return {
      success: false,
      message: "Product is required.",
    };
  }

  if (typeof quantityValue !== "string") {
    return {
      success: false,
      message: "Quantity is required.",
    };
  }

  const quantity = Number(quantityValue);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      success: false,
      message: "Quantity must be a positive integer.",
    };
  }

  // Validate product availability and authorization on the server.

  return {
    success: true,
    message: `Purchased ${quantity} of ${productId}.`,
  };
}

// Server Actions can combine route/server data with submitted form values.
// All submitted values remain untrusted.

// ---------------------------------------------------------------------
// 37. Server Actions can mutate databases
// ---------------------------------------------------------------------

async function updateProductInDatabase(productId: string, name: string): Promise<void> {
  console.log(`Updating ${productId}: ${name}`);
}

export async function renameProduct(formData: FormData): Promise<SaveResult> {
  "use server";

  const productId = formData.get("productId");
  const name = formData.get("name");

  if (typeof productId !== "string") {
    return {
      success: false,
      message: "Product ID is required.",
    };
  }

  if (typeof name !== "string" || name.trim() === "") {
    return {
      success: false,
      message: "Product name is required.",
    };
  }

  await updateProductInDatabase(productId, name.trim());

  return {
    success: true,
    message: "Product renamed.",
  };
}

// A Server Action can perform the actual server-side mutation instead of
// exposing database credentials or database code to the browser.

// ---------------------------------------------------------------------
// 38. Server Actions should not be used for ordinary data fetching
// ---------------------------------------------------------------------

async function getProducts(): Promise<readonly string[]> {
  return ["Example Product", "Another Product"];
}

export const ProductList = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product}>{product}</li>
      ))}
    </ul>
  );
};

// Server Components are designed to perform server-side data fetching directly.
// Server Functions and Server Actions are primarily intended for mutations.

// ---------------------------------------------------------------------
// 39. Server Actions and optimistic UI
// ---------------------------------------------------------------------

export async function updateQuantity(productId: string, quantity: number): Promise<number> {
  "use server";

  if (productId.trim() === "") {
    throw new Error("Product ID is required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be positive.");
  }

  // Persist the quantity.

  return quantity;
}

// Client-side Actions can coordinate pending and optimistic state with React.
// The server remains the authoritative source of the persisted result.

// ---------------------------------------------------------------------
// 40. Server Action errors should have deliberate semantics
// ---------------------------------------------------------------------

interface ActionResult {
  readonly success: boolean;
  readonly message: string;
}

export async function saveAddress(formData: FormData): Promise<ActionResult> {
  "use server";

  const city = formData.get("city");

  if (typeof city !== "string" || city.trim() === "") {
    return {
      success: false,
      message: "City is required.",
    };
  }

  try {
    await persistAddress(city.trim());
  } catch {
    throw new Error("Address could not be saved.");
  }

  return {
    success: true,
    message: "Address saved.",
  };
}

async function persistAddress(city: string): Promise<void> {
  console.log(`Persisting address: ${city}`);
}

// Expected business or validation failures can be returned as data.
// Unexpected failures can be thrown and handled by an Error Boundary.

// ---------------------------------------------------------------------
// 41. Server Actions and controlled inputs
// ---------------------------------------------------------------------

// Server Actions work with both controlled and uncontrolled inputs.
// However, the form Action receives the submitted FormData.
//
// A Client Component can manage local state:
//
// const [name, setName] = useState("");
//
// and still submit through:
//
// <form action={serverAction}>
//
// The Client Component does not need to manually construct an HTTP request.

// ---------------------------------------------------------------------
// 42. Server Actions and form reset behavior
// ---------------------------------------------------------------------

// With uncontrolled inputs:
//
// <form action={saveMessage}>
//     <input
//         name="message"
//         type="text"
//     />
//
//     <button type="submit">
//         Save
//     </button>
// </form>
//
// A successful Action causes React to reset the uncontrolled fields.
//
// Controlled inputs remain controlled by their React state and therefore
// require state updates if their values should be cleared.

// ---------------------------------------------------------------------
// 43. Server Actions and client references
// ---------------------------------------------------------------------

// The browser does not receive the Server Action's implementation.
//
// Conceptually:
//
// Server:
//     saveMessage()
//
//          |
//          | server reference
//          v
//
// Client:
//     form action={saveMessage}
//
//          |
//          | request
//          v
//
// Server:
//     execute saveMessage(formData)
//
// The actual transport and endpoint implementation are supplied by the
// framework or React Server Components bundler.

// ---------------------------------------------------------------------
// 44. Server Actions are not API routes
// ---------------------------------------------------------------------

// An API route generally exposes an explicit HTTP endpoint.
//
// A Server Action instead exposes a React Server Function reference that
// React and the framework know how to invoke.
//
// Server Actions therefore provide React-specific integration with:
//
// - forms
// - Actions
// - pending state
// - `useActionState`
// - progressive enhancement
// - Server Component rendering
//
// An application may use both API routes and Server Actions for different needs.

// ---------------------------------------------------------------------
// 45. Complete profile mutation
// ---------------------------------------------------------------------

interface ProfileInput {
  readonly displayName: string;
  readonly email: string;
}

interface ProfileResult {
  readonly success: boolean;
  readonly message: string;
}

async function saveProfileRecord(userId: string, profile: ProfileInput): Promise<void> {
  console.log(`Saving profile for ${userId}: ${profile.displayName}`);
}

export async function updateProfileAction(formData: FormData): Promise<ProfileResult> {
  "use server";

  const displayName = formData.get("displayName");
  const email = formData.get("email");

  if (typeof displayName !== "string" || displayName.trim() === "") {
    return {
      success: false,
      message: "Display name is required.",
    };
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return {
      success: false,
      message: "A valid email address is required.",
    };
  }

  const userId = await getCurrentUserId();

  if (userId === null) {
    return {
      success: false,
      message: "Authentication required.",
    };
  }

  const profile: ProfileInput = {
    displayName: displayName.trim(),
    email: email.trim(),
  };

  await saveProfileRecord(userId, profile);

  return {
    success: true,
    message: "Profile updated.",
  };
}

// This is a complete Server Action flow:
//
// form input
//     |
//     v
// FormData
//     |
//     v
// runtime validation
//     |
//     v
// authentication
//     |
//     v
// authorization
//     |
//     v
// server-side mutation
//     |
//     v
// action result

// ---------------------------------------------------------------------
// 46. Complete Server Component form
// ---------------------------------------------------------------------

export const ProfilePage = (): ReactElement => {
  return (
    <main>
      <h1>Profile</h1>

      <form action={updateProfileAction}>
        <label htmlFor="profile-name">Display name</label>

        <input id="profile-name" name="displayName" type="text" />

        <label htmlFor="profile-email">Email</label>

        <input id="profile-email" name="email" type="email" />

        <button type="submit">Save profile</button>
      </form>
    </main>
  );
};

// The Server Component renders the form and provides the Server Action.
// The mutation itself remains server-side.

// ---------------------------------------------------------------------
// 47. Complete Client Component pattern with `useActionState`
// ---------------------------------------------------------------------

// Conceptually:
//
// "use client";
//
// import {
//     useActionState,
//     type ReactElement,
// } from "react";
//
// import {updateProfileAction} from "./actions";
//
// export const InteractiveProfileForm = (): ReactElement => {
//     const [state, formAction, isPending] = useActionState(
//         updateProfileAction,
//         {
//             success: false,
//             message: "",
//         },
//     );
//
//     return (
//         <form action={formAction}>
//             <label htmlFor="name">
//                 Display name
//             </label>
//
//             <input
//                 id="name"
//                 name="displayName"
//                 type="text"
//                 disabled={isPending}
//             />
//
//             <label htmlFor="email">
//                 Email
//             </label>
//
//             <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 disabled={isPending}
//             />
//
//             <button
//                 type="submit"
//                 disabled={isPending}
//             >
//                 {isPending ? "Saving..." : "Save profile"}
//             </button>
//
//             {state.message !== "" && (
//                 <p role="status">
//                     {state.message}
//                 </p>
//             )}
//         </form>
//     );
// };
//
// `useActionState` provides a convenient client-side interface for the
// result and pending state of the Server Action.

// ---------------------------------------------------------------------
// 48. Server Action architecture
// ---------------------------------------------------------------------

// A typical Server Action flow is:
//
// 1. Define an async Server Function.
// 2. Mark it with `"use server"`.
// 3. Use it as a form `action` or `formAction`.
// 4. React creates the appropriate server reference.
// 5. The browser submits the form.
// 6. React/framework sends the request to the server.
// 7. The Server Action receives FormData.
// 8. The server validates the submitted values.
// 9. The server authenticates the caller.
// 10. The server authorizes the requested mutation.
// 11. The server performs the mutation.
// 12. The Action returns a supported result or throws an error.
// 13. React updates the UI from the Action result.
// 14. `useActionState` can expose the result and pending state to the Client Component.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A Server Action is a Server Function used as an Action.
// - Not every Server Function is a Server Action.
// - Passing a Server Function to a form's `action` prop makes it a Server Action.
// - Passing a Server Function to a button's `formAction` prop makes it a Server Action.
// - Server Actions are asynchronous and execute on the server.
// - A form Server Action receives the submitted `FormData`.
// - Form fields must have `name` attributes to appear in the submitted FormData.
// - Hidden inputs can provide additional submitted values, but those values remain client-controlled.
// - Server Action arguments must be treated as untrusted input.
// - Runtime validation must happen on the server.
// - Authentication and authorization must happen on the server.
// - Server Actions are primarily intended for mutations rather than ordinary data fetching.
// - A successful form Action automatically resets uncontrolled form fields.
// - Server Actions can return structured serializable results for expected validation or business errors.
// - Unexpected errors can be thrown and handled by an Error Boundary.
// - `useActionState` exposes the latest Action result and a pending state to a Client Component.
// - When an Action is passed to `useActionState`, the previous state becomes the first argument and FormData becomes the second argument.
// - `useFormStatus` can read the pending status of a parent form from a nested component.
// - `formAction` allows individual buttons within a form to use different Actions.
// - Server Actions can support progressive enhancement, including form submission before client hydration.
// - Server Actions called outside a form should be invoked inside a Transition.
// - Forms automatically integrate Server Functions with React's Action lifecycle.
// - Server Actions are React Server Function references rather than ordinary browser-side function implementations.
// - Server Actions are distinct from traditional API routes and are integrated with React's Server Components and Actions model.

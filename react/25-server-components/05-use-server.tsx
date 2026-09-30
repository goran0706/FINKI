/**
 * "use server"
 * ============
 *
 * The `"use server"` directive marks a function as a Server Function so that it executes on the
 * server when called through a supported React Server Components framework. When placed at the
 * top of a module, it marks all exported functions in that module as Server Functions.
 *
 * Server Functions provide a way for client-side code to invoke server-side logic across the
 * Server-Client boundary. They are different from Server Components: `"use server"` does not
 * mark a component as a Server Component.
 */

// ---------------------------------------------------------------------
// 1. Module-level "use server"
// ---------------------------------------------------------------------

"use server";

// Every exported function in this module is treated as a Server Function.
// The directive applies to the entire module when it appears at the top level.

// ---------------------------------------------------------------------
// 2. Basic Server Function
// ---------------------------------------------------------------------

export async function saveMessage(message: string): Promise<void> {
  console.log(`Saving message: ${message}`);
}

// The function executes on the server when invoked through a supported Server Function mechanism.
// The caller does not execute the function body directly in the browser.

// ---------------------------------------------------------------------
// 3. Server Functions are asynchronous
// ---------------------------------------------------------------------

export async function createUser(name: string, email: string): Promise<{ name: string; email: string }> {
  return {
    name,
    email,
  };
}

// Server Functions normally return Promises because their work executes remotely from the caller.
// The function can perform asynchronous server-side operations such as database access.

// ---------------------------------------------------------------------
// 4. Server Functions can access server-side resources
// ---------------------------------------------------------------------

export async function getUserProfile(userId: string): Promise<{ id: string; name: string }> {
  // A real implementation could query a database or another server-side data source.
  return {
    id: userId,
    name: "John Doe",
  };
}

// Server-only resources can remain on the server because the function body is not shipped
// to the browser as ordinary client-side implementation code.

// ---------------------------------------------------------------------
// 5. Server Functions are not Server Components
// ---------------------------------------------------------------------

export async function getAccountName(): Promise<string> {
  return "John Doe";
}

// This function is a Server Function.
// It is not a Server Component because it does not return a React element tree.
//
// Server Component:
//
// async function AccountPage(): Promise<ReactElement> {
//     ...
// }
//
// Server Function:
//
// async function getAccountName(): Promise<string> {
//     ...
// }

// ---------------------------------------------------------------------
// 6. "use server" does not mark a component as a Server Component
// ---------------------------------------------------------------------

export async function AccountData(): Promise<{
  readonly name: string;
}> {
  return {
    name: "John Doe",
  };
}

// `"use server"` describes Server Functions.
// A Server Component does not need a `"use server"` directive.

// ---------------------------------------------------------------------
// 7. Server Functions can perform mutations
// ---------------------------------------------------------------------

interface UpdateProfileInput {
  readonly name: string;
  readonly email: string;
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  console.log(`Updating profile for ${input.name}.`);
  console.log(`New email: ${input.email}`);
}

// A mutation can be implemented inside a Server Function so that the actual write operation
// remains on the server.

// ---------------------------------------------------------------------
// 8. Server Functions can return data
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export async function getProduct(productId: string): Promise<Product> {
  return {
    id: productId,
    name: "Example Product",
    price: 49.99,
  };
}

// A Server Function can return supported values to the caller.
// The returned value crosses the Server-Client boundary through the framework's
// Server Function mechanism.

// ---------------------------------------------------------------------
// 9. Server Functions can accept structured arguments
// ---------------------------------------------------------------------

interface CreateProductInput {
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  return {
    id: "product-001",
    name: input.name,
    price: input.price,
  };
}

// Structured values can be passed as arguments when their contents are supported
// by the Server Function serialization model.

// ---------------------------------------------------------------------
// 10. Server Functions can be imported by Client Components
// ---------------------------------------------------------------------

// A Client Component can conceptually import:
//
// import {saveMessage} from "./server-functions";
//
// and invoke:
//
// await saveMessage("Hello");
//
// The imported reference represents a Server Function.
// The function body itself remains on the server.

// ---------------------------------------------------------------------
// 11. The client does not receive the server implementation
// ---------------------------------------------------------------------

export async function processOrder(orderId: string): Promise<void> {
  // Server-side implementation could access a database,
  // validate the order, and perform other protected operations.
  console.log(`Processing order: ${orderId}`);
}

// Importing `processOrder` into a supported Client Component does not mean that
// the implementation of `processOrder` is bundled as ordinary client JavaScript.

// ---------------------------------------------------------------------
// 12. Server Functions can be passed to Client Components
// ---------------------------------------------------------------------

interface SaveControlProps {
  readonly action: (message: string) => Promise<void>;
}

// A Client Component can conceptually receive:
//
// <SaveControl action={saveMessage} />
//
// The `action` value represents a Server Function reference.
// The Client Component can invoke it without directly importing the server implementation.

// ---------------------------------------------------------------------
// 13. Server Functions and event handlers
// ---------------------------------------------------------------------

export async function saveForm(value: string): Promise<void> {
  console.log(`Saving: ${value}`);
}

// A Client Component can conceptually connect a Server Function to an event:
//
// <button
//     type="button"
//     onClick={() => {
//         void saveForm("Example");
//     }}
// >
//     Save
// </button>
//
// The browser handles the click.
// The Server Function executes its function body on the server.

// ---------------------------------------------------------------------
// 14. Server Functions can be used with forms
// ---------------------------------------------------------------------

export async function submitContactForm(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const email = formData.get("email");

  console.log("Name:", name);
  console.log("Email:", email);
}

// Server Functions can be used as form actions in frameworks that support React Server Functions.
//
// Conceptually:
//
// <form action={submitContactForm}>
//     ...
// </form>
//
// The browser submits the form through the framework's Server Function mechanism,
// allowing the server function to receive the resulting `FormData`.

// ---------------------------------------------------------------------
// 15. FormData can contain multiple field types
// ---------------------------------------------------------------------

export async function submitProfile(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const email = formData.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    return;
  }

  console.log({
    name,
    email,
  });
}

// Server-side validation should still verify incoming values.
// TypeScript types do not validate runtime input received from a browser.

// ---------------------------------------------------------------------
// 16. Validate Server Function arguments
// ---------------------------------------------------------------------

export async function deleteProduct(productId: string): Promise<void> {
  if (!productId.trim()) {
    throw new Error("Product ID is required.");
  }

  console.log(`Deleting product: ${productId}`);
}

// Server Functions are entry points that can be invoked from outside the server module.
// Runtime validation remains important even when the TypeScript signature is precise.

// ---------------------------------------------------------------------
// 17. Authentication belongs on the server
// ---------------------------------------------------------------------

export async function updateAccount(accountId: string, name: string): Promise<void> {
  // A real implementation should determine the authenticated user on the server
  // and verify that the user is allowed to modify this account.
  console.log(`Updating account ${accountId} with name ${name}.`);
}

// Client-side checks are not a replacement for server-side authorization.
// A Server Function should verify authentication and authorization before performing
// protected operations.

// ---------------------------------------------------------------------
// 18. Authorization must be checked for mutations
// ---------------------------------------------------------------------

export async function removeAccount(accountId: string): Promise<void> {
  // A real implementation should:
  // 1. Identify the authenticated user.
  // 2. Verify permission to modify this account.
  // 3. Perform the deletion only after authorization succeeds.
  console.log(`Removing account: ${accountId}`);
}

// The Server Function boundary should be treated as a server entry point,
// not as a trusted continuation of client-side validation.

// ---------------------------------------------------------------------
// 19. Server Functions can call other server-side functions
// ---------------------------------------------------------------------

async function validateProduct(productId: string): Promise<boolean> {
  return productId.trim().length > 0;
}

export async function publishProduct(productId: string): Promise<void> {
  const valid = await validateProduct(productId);

  if (!valid) {
    throw new Error("Invalid product.");
  }

  console.log(`Publishing product: ${productId}`);
}

// A Server Function can call other server-side functions normally.
// Those internal helpers do not need to be exported as Server Functions
// when they are never exposed across the boundary.

// ---------------------------------------------------------------------
// 20. Internal helpers can remain private
// ---------------------------------------------------------------------

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function saveEmail(email: string): Promise<void> {
  const normalizedEmail = normalizeEmail(email);

  console.log(`Saving email: ${normalizedEmail}`);
}

// Keeping implementation helpers private limits the public Server Function surface.

// ---------------------------------------------------------------------
// 21. Server Functions can throw errors
// ---------------------------------------------------------------------

export async function requireProduct(productId: string): Promise<Product> {
  if (!productId.trim()) {
    throw new Error("Product ID is required.");
  }

  return {
    id: productId,
    name: "Example Product",
    price: 49.99,
  };
}

// A rejected Promise or thrown error can be observed by the caller through
// the framework's Server Function error-handling mechanism.

// ---------------------------------------------------------------------
// 22. Server Functions should not expose sensitive implementation details
// ---------------------------------------------------------------------

export async function authenticateUser(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  // A real implementation would perform authentication against a server-side
  // identity system without exposing credentials or private implementation details.
  return normalizedEmail === "john@example.com";
}

// Sensitive server-side values should remain on the server.
// Return only the information that the caller actually needs.

// ---------------------------------------------------------------------
// 23. Server Functions can use environment-specific APIs
// ---------------------------------------------------------------------

export async function readServerConfiguration(): Promise<string> {
  // A real implementation could read a server-side environment variable.
  // The secret value itself should not be returned to untrusted client code.
  return "Example configuration";
}

// Server-only APIs can be used inside Server Functions when supported by the
// surrounding server environment.

// ---------------------------------------------------------------------
// 24. Do not put secrets in returned values
// ---------------------------------------------------------------------

export async function getPublicAccountData(): Promise<{
  readonly name: string;
  readonly email: string;
}> {
  return {
    name: "John Doe",
    email: "john@example.com",
  };
}

// Returning a value makes it available to the caller.
// Private credentials, API keys, database passwords, and other secrets should never
// be returned merely because the function executes on the server.

// ---------------------------------------------------------------------
// 25. Server Functions can use asynchronous operations
// ---------------------------------------------------------------------

async function loadRecord(id: string): Promise<{ readonly id: string }> {
  return {
    id,
  };
}

export async function processRecord(id: string): Promise<void> {
  const record = await loadRecord(id);

  console.log(`Processing record: ${record.id}`);
}

// Server Functions can await database queries, filesystem operations, network requests,
// and other asynchronous server-side work.

// ---------------------------------------------------------------------
// 26. Server Functions can return serializable structured values
// ---------------------------------------------------------------------

export async function getDashboardSummary(): Promise<{
  readonly userName: string;
  readonly notifications: number;
  readonly items: readonly string[];
}> {
  return {
    userName: "John Doe",
    notifications: 3,
    items: ["Item A", "Item B"],
  };
}

// The returned structure should contain values supported by the Server Function
// serialization model.

// ---------------------------------------------------------------------
// 27. Server Functions can receive FormData directly
// ---------------------------------------------------------------------

export async function savePreferences(formData: FormData): Promise<void> {
  const theme = formData.get("theme");
  const language = formData.get("language");

  console.log({
    theme,
    language,
  });
}

// `FormData` is particularly useful for form actions because it represents the
// submitted form fields without requiring a separate client-side request handler.

// ---------------------------------------------------------------------
// 28. Server Functions are different from API route handlers
// ---------------------------------------------------------------------

export async function updatePreference(key: string, value: string): Promise<void> {
  console.log(`Updating ${key} to ${value}.`);
}

// A Server Function is an RPC-like React-integrated mechanism for invoking server logic.
// An API route is a separately defined HTTP endpoint.
// They can solve related problems but are not the same abstraction.

// ---------------------------------------------------------------------
// 29. Server Functions are different from ordinary server utilities
// ---------------------------------------------------------------------

async function calculateTotal(price: number, quantity: number): Promise<number> {
  return price * quantity;
}

export async function calculateOrderTotal(price: number, quantity: number): Promise<number> {
  return calculateTotal(price, quantity);
}

// `calculateTotal` is an ordinary internal server helper.
// `calculateOrderTotal` is exposed as a Server Function because it is exported
// from this `"use server"` module.

// ---------------------------------------------------------------------
// 30. Module-level "use server" applies to exports
// ---------------------------------------------------------------------

export async function firstServerFunction(): Promise<string> {
  return "First";
}

export async function secondServerFunction(): Promise<string> {
  return "Second";
}

// Both exported functions are Server Functions because the module has a top-level
// `"use server"` directive.

// ---------------------------------------------------------------------
// 31. Inline "use server" can mark an individual function
// ---------------------------------------------------------------------

// An individual Server Function can also use `"use server"` inside its function body:
//
// async function saveComment(
//     comment: string,
// ): Promise<void> {
//     "use server";
//
//     console.log(comment);
// }
//
// This form is useful when only a particular function needs to be exposed as a Server Function.
// It is different from placing `"use server"` at the top of the entire module.

// ---------------------------------------------------------------------
// 32. Module-level and inline forms have different scopes
// ---------------------------------------------------------------------

// Module-level:
//
// "use server";
//
// export async function saveUser() {
//     ...
// }
//
// export async function deleteUser() {
//     ...
// }
//
// Both exported functions are Server Functions.
//
// Function-level:
//
// export async function saveUser() {
//     "use server";
//     ...
// }
//
// Only `saveUser` is marked as a Server Function.

// ---------------------------------------------------------------------
// 33. "use server" does not make every function in the application server-callable
// ---------------------------------------------------------------------

function calculateDiscount(price: number): number {
  return price * 0.9;
}

export async function getDiscountedPrice(price: number): Promise<number> {
  return calculateDiscount(price);
}

// With module-level `"use server"`, exported functions are Server Functions.
// A private helper such as `calculateDiscount` is simply an internal server function
// and is not independently exposed as a Server Function reference.

// ---------------------------------------------------------------------
// 34. Server Functions can be composed with Client Components
// ---------------------------------------------------------------------

interface DeleteButtonProps {
  readonly action: () => Promise<void>;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ action }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        void action();
      }}
    >
      Delete
    </button>
  );
};

// A Server Component can conceptually pass a Server Function to `DeleteButton`:
//
// <DeleteButton action={removeAccount} />
//
// `DeleteButton` runs on the client.
// `removeAccount` executes on the server when invoked.

// ---------------------------------------------------------------------
// 35. Server Functions can be composed with client-side state
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly action: () => Promise<void>;
}

export const InteractiveSaveButton: FC<SaveButtonProps> = ({ action }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        void action();
      }}
    >
      Save
    </button>
  );
};

// The Client Component can manage local UI state such as pending, success, or error status,
// while the Server Function performs the server-side operation.

// ---------------------------------------------------------------------
// 36. A complete mutation example
// ---------------------------------------------------------------------

interface UpdateProfileInput {
  readonly name: string;
  readonly email: string;
}

async function validateProfile(input: UpdateProfileInput): Promise<void> {
  if (!input.name.trim()) {
    throw new Error("Name is required.");
  }

  if (!input.email.includes("@")) {
    throw new Error("A valid email is required.");
  }
}

export async function saveProfile(input: UpdateProfileInput): Promise<void> {
  await validateProfile(input);

  // A real implementation would authenticate the request,
  // authorize the current user, and update the database here.
  console.log(`Saving profile for ${input.name}.`);
}

// The complete flow is:
//
// Client Component
//      |
//      | invoke Server Function
//      v
// saveProfile()
//      |
//      v
// validate input
//      |
//      v
// authenticate / authorize
//      |
//      v
// update server-side data

// ---------------------------------------------------------------------
// 37. A complete form action example
// ---------------------------------------------------------------------

export async function createContact(formData: FormData): Promise<void> {
  const name = formData.get("name");
  const email = formData.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    throw new Error("Invalid form data.");
  }

  if (!name.trim() || !email.includes("@")) {
    throw new Error("Invalid contact information.");
  }

  console.log({
    name,
    email,
  });
}

// A supported framework can connect this Server Function directly to a form action:
//
// <form action={createContact}>
//     <input name="name" />
//     <input name="email" type="email" />
//     <button type="submit">Create contact</button>
// </form>
//
// The form is submitted through the framework's Server Function integration.

// ---------------------------------------------------------------------
// 38. Keep authorization inside the Server Function
// ---------------------------------------------------------------------

async function getCurrentUser(): Promise<{
  readonly id: string;
}> {
  return {
    id: "user-001",
  };
}

export async function updateOwnProfile(profileId: string, name: string): Promise<void> {
  const currentUser = await getCurrentUser();

  if (currentUser.id !== profileId) {
    throw new Error("Not authorized.");
  }

  console.log(`Updating profile ${profileId} to ${name}.`);
}

// Authorization should be performed using trusted server-side information.
// A client-provided identifier must not be treated as proof of authorization.

// ---------------------------------------------------------------------
// 39. Server Functions can coordinate multiple operations
// ---------------------------------------------------------------------

async function updateInventory(productId: string): Promise<void> {
  console.log(`Updating inventory for ${productId}.`);
}

async function createOrderRecord(productId: string): Promise<void> {
  console.log(`Creating order for ${productId}.`);
}

export async function placeOrder(productId: string): Promise<void> {
  await updateInventory(productId);
  await createOrderRecord(productId);
}

// A Server Function can coordinate multiple server-side operations while keeping
// the implementation details on the server.

// ---------------------------------------------------------------------
// 40. Complete Server Function architecture
// ---------------------------------------------------------------------

export async function saveOrder(orderId: string): Promise<{ readonly success: boolean }> {
  if (!orderId.trim()) {
    throw new Error("Order ID is required.");
  }

  // A real implementation would:
  // 1. Read the authenticated server-side user.
  // 2. Verify authorization for this order.
  // 3. Validate the order.
  // 4. Update the database.
  // 5. Return only the result required by the caller.

  return {
    success: true,
  };
}

// The conceptual architecture is:
//
// Client Component
//      |
//      | invoke
//      v
// Server Function
//      |
//      +--> authentication
//      |
//      +--> authorization
//      |
//      +--> validation
//      |
//      +--> database / server resources
//      |
//      v
// returned supported value
//
// The Server Function is the server-side entry point.
// The implementation remains on the server.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `"use server"` marks functions as Server Functions.
// - A top-level `"use server"` directive marks all exported functions in the module as Server Functions.
// - An inline `"use server"` directive can mark an individual function as a Server Function.
// - `"use server"` does not mark a component as a Server Component.
// - Server Components do not need `"use server"`.
// - Server Functions execute on the server when invoked through a supported React Server Components framework.
// - Client Components can invoke Server Functions through supported framework integration.
// - Server Functions can be passed to Client Components as supported callable server references.
// - Server Functions are useful for server-side mutations, data access, validation, and other protected operations.
// - Server Functions can accept supported arguments and return supported values across the Server-Client boundary.
// - `FormData` can be used directly by Server Functions connected to supported form actions.
// - Ordinary JavaScript functions are not equivalent to Server Functions.
// - Server Functions are different from API route handlers and ordinary private server utilities.
// - Server-only implementation details should remain on the server.
// - Returned values should contain only the data the caller actually needs.
// - Authentication and authorization should be enforced on the server rather than trusted from client-side checks.
// - Runtime validation remains necessary because TypeScript types do not validate values received at runtime.
// - Module-level `"use server"` and function-level `"use server"` differ in scope.
// - Server Functions can call private server-side helpers and coordinate multiple server operations.
// - `"use server"` provides the server-side callable boundary; the surrounding framework provides the transport and integration that invokes the function.

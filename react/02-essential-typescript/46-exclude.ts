/**
 * Exclude Utility Type
 * ====================
 *
 * TypeScript's built-in `Exclude<T, U>` utility type allows you to construct
 * a new type by taking a union type `T` and removing the members that are
 * assignable to `U`, leaving everything else behind. It is a distributive
 * conditional type, which means it is applied member by member across the
 * union rather than to the union as a whole. It is effectively the inverse
 * of `Extract<T, U>`.
 */

// ---------------------------------------------------------------------
// 1. Removing matching union members
// ---------------------------------------------------------------------

type Status = "idle" | "loading" | "success" | "error";

type NonLoadingStatus = Exclude<Status, "loading">;

let status: NonLoadingStatus = "idle";
status = "success";
status = "error";

// status = "loading"; // Error: Type '"loading"' is not assignable to type 'NonLoadingStatus'.

console.log(status);

// ---------------------------------------------------------------------
// 2. Exclude with object unions
// ---------------------------------------------------------------------

type AppAction =
  | { type: "login"; username: string }
  | { type: "logout" }
  | { type: "updateProfile"; username: string }
  | { type: "deleteAccount" };

type WithoutLogout = Exclude<AppAction, { type: "logout" }>;

const updateAction: WithoutLogout = {
  type: "updateProfile",
  username: "janedoe",
};

const deleteAction: WithoutLogout = {
  type: "deleteAccount",
};

console.log(updateAction);
console.log(deleteAction);

// ---------------------------------------------------------------------
// 3. Exclude with primitive unions
// ---------------------------------------------------------------------

type MixedValue = string | number | boolean | null | undefined;

type NonStringValue = Exclude<MixedValue, string>;
type NonNullishValue = Exclude<MixedValue, null | undefined>;

let nonStringValue: NonStringValue = 42;
nonStringValue = true;
nonStringValue = null;

let nonNullishValue: NonNullishValue = "hello";
nonNullishValue = 42;
nonNullishValue = true;

console.log(nonStringValue);
console.log(nonNullishValue);

// ---------------------------------------------------------------------
// 4. Removing finished states from a union
// ---------------------------------------------------------------------

type RequestStatus = "idle" | "pending" | "success" | "error";

type UnfinishedStatus = Exclude<RequestStatus, "success" | "error">;

let unfinishedStatus: UnfinishedStatus = "idle";
unfinishedStatus = "pending";

console.log(unfinishedStatus);

// ---------------------------------------------------------------------
// 5. Exclude with keyof
// ---------------------------------------------------------------------

type User = {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
};

type UserKeys = keyof User;
type NonIdentityKeys = Exclude<UserKeys, "id">;

const nonIdentityKey: NonIdentityKeys = "isAdmin";

console.log(nonIdentityKey);

// ---------------------------------------------------------------------
// 6. Excluding function keys
// ---------------------------------------------------------------------

type Service = {
  name: string;
  start(): void;
  stop(): void;
  restart(): void;
};

type ServiceKeys = keyof Service;
type NonLifecycleKeys = Exclude<ServiceKeys, "start" | "stop" | "restart">;

const nonLifecycleKey: NonLifecycleKeys = "name";

console.log(nonLifecycleKey);

// ---------------------------------------------------------------------
// 7. Excluding specific function types
// ---------------------------------------------------------------------

type AsyncHandler = (() => void) | (() => Promise<void>) | ((value: string) => void);

type SyncHandler = Exclude<AsyncHandler, () => Promise<void>>;

const syncHandler: SyncHandler = (value?: string) => {
  console.log(value);
};

console.log(syncHandler);

// ---------------------------------------------------------------------
// 8. Exclude with literal unions
// ---------------------------------------------------------------------

type Direction = "north" | "south" | "east" | "west";

type VerticalDirection = Exclude<Direction, "east" | "west">;

let verticalDirection: VerticalDirection = "north";
verticalDirection = "south";

console.log(verticalDirection);

// ---------------------------------------------------------------------
// 9. Excluding non-matching events from a union
// ---------------------------------------------------------------------

type AppEvent =
  | { type: "click"; x: number; y: number }
  | { type: "focus"; element: string }
  | { type: "submit"; formId: string }
  | { type: "keydown"; key: string };

type NonFormEvent = Exclude<AppEvent, { type: "submit" }>;

const keyboardEvent: NonFormEvent = {
  type: "keydown",
  key: "Enter",
};

console.log(keyboardEvent);

// ---------------------------------------------------------------------
// 10. Excluding a component variant
// ---------------------------------------------------------------------

type ComponentProps =
  | {
      variant: "button";
      label: string;
      onClick(): void;
    }
  | {
      variant: "input";
      placeholder: string;
      onChange(value: string): void;
    }
  | {
      variant: "link";
      href: string;
      label: string;
    };

type NonInteractiveProps = Exclude<ComponentProps, { variant: "button" | "input" }>;

const nonInteractiveProps: NonInteractiveProps = {
  variant: "link",
  href: "/about",
  label: "About",
};

console.log(nonInteractiveProps);

// ---------------------------------------------------------------------
// 11. Excluding successful responses
// ---------------------------------------------------------------------

type ApiResponse =
  | { status: 200; data: { id: number; name: string } }
  | { status: 201; data: { id: number; name: string } }
  | { status: 400; error: string }
  | { status: 404; error: string }
  | { status: 500; error: string };

type ErrorResponse = Exclude<ApiResponse, { status: 200 | 201 }>;

const errorResponse: ErrorResponse = {
  status: 404,
  error: "User not found",
};

console.log(errorResponse);

// ---------------------------------------------------------------------
// 12. Exclude with a union of string literal keys
// ---------------------------------------------------------------------

type Permission = "users:read" | "users:write" | "posts:read" | "posts:write" | "settings:read";

type NonUserPermission = Exclude<Permission, `users:${string}`>;

const nonUserPermission: NonUserPermission = "posts:read";

console.log(nonUserPermission);

// ---------------------------------------------------------------------
// 13. Exclude with template literal types
// ---------------------------------------------------------------------

type EventName = "user:created" | "user:deleted" | "order:created" | "order:cancelled";

type OrderEvent = Exclude<EventName, `user:${string}`>;

let orderEvent: OrderEvent = "order:cancelled";

console.log(orderEvent);

// ---------------------------------------------------------------------
// 14. How Exclude is implemented
// ---------------------------------------------------------------------

type ExcludeImpl<T, U> = T extends U ? never : T;

type ExampleUnion = "a" | "b" | "c";

type WithoutA = ExcludeImpl<ExampleUnion, "a">;

let withoutA: WithoutA = "b";
withoutA = "c";

console.log(withoutA);

// ---------------------------------------------------------------------
// 15. Excluding nullish values
// ---------------------------------------------------------------------

type MaybeValue = string | number | null | undefined;

type DefinedValue = Exclude<MaybeValue, null | undefined>;

let definedValue: DefinedValue = "hello";
definedValue = 42;

console.log(definedValue);

// ---------------------------------------------------------------------
// 16. Exclude with readonly properties
// ---------------------------------------------------------------------

type Data =
  | { readonly id: number; name: string }
  | { readonly id: number; title: string }
  | { readonly id: number; active: boolean };

type NonNamedData = Exclude<Data, { name: string }>;

const nonNamedData: NonNamedData = {
  id: 2,
  active: true,
};

console.log(nonNamedData);

// ---------------------------------------------------------------------
// 17. Practical API type filtering
// ---------------------------------------------------------------------

type ApiResult =
  | { kind: "user"; value: { id: number; username: string } }
  | { kind: "post"; value: { id: number; title: string } }
  | { kind: "comment"; value: { id: number; body: string } };

type ContentResult = Exclude<ApiResult, { kind: "user" }>;

function renderContent(result: ContentResult): string {
  return result.kind === "post" ? result.value.title : result.value.body;
}

console.log(
  renderContent({
    kind: "post",
    value: {
      id: 2,
      title: "TypeScript Utility Types",
    },
  }),
);

// ---------------------------------------------------------------------
// 18. Combining Extract and Exclude
// ---------------------------------------------------------------------

type AllAction =
  | { type: "create"; resource: "user" }
  | { type: "create"; resource: "post" }
  | { type: "update"; resource: "user" }
  | { type: "update"; resource: "post" }
  | { type: "delete"; resource: "user" }
  | { type: "delete"; resource: "post" };

// Extract picks a subset of a union, Exclude removes it: taken together,
// they let you partition one union into two complementary halves.
type UserAction = Extract<AllAction, { resource: "user" }>;
type NonUserAction = Exclude<AllAction, { resource: "user" }>;

const userAction: UserAction = {
  type: "update",
  resource: "user",
};

const nonUserAction: NonUserAction = {
  type: "create",
  resource: "post",
};

console.log(userAction);
console.log(nonUserAction);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Exclude<T, U>` constructs a type by removing the members of union `T` that are assignable to `U`, keeping everything else.
// - It is a distributive conditional type: TypeScript checks the condition once per union member and merges the non-matches back into a new, narrower union.
// - Ideal for removing a specific subset from a larger union, such as a disallowed action type, a completed status, or a key to treat separately.
// - Operates as the exact complement to `Extract<T, U>`; applying both with the same `U` splits a union into two non-overlapping halves.
// - Like all utility types, it is a compile-time, type-level operation only and has no effect on runtime values.

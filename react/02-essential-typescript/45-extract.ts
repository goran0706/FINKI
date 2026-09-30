/**
 * Extract Utility Type
 * ====================
 *
 * TypeScript's built-in `Extract<T, U>` utility type allows you to construct
 * a new type by taking a union type `T` and keeping only the members that
 * are assignable to `U`, discarding the rest. It is a distributive
 * conditional type, which means it is applied member by member across the
 * union rather than to the union as a whole. It is effectively the inverse
 * of `Exclude<T, U>`.
 */

// ---------------------------------------------------------------------
// 1. Keeping matching union members
// ---------------------------------------------------------------------

type Status = "idle" | "loading" | "success" | "error";

type ActiveStatus = Extract<Status, "loading" | "success">;

let activeStatus: ActiveStatus = "loading";
activeStatus = "success";

// activeStatus = "idle"; // Error: Type '"idle"' is not assignable to type 'ActiveStatus'.

console.log(activeStatus);

// ---------------------------------------------------------------------
// 2. Extract with object unions
// ---------------------------------------------------------------------

type AppAction =
  | { type: "login"; username: string }
  | { type: "logout" }
  | { type: "updateProfile"; username: string }
  | { type: "deleteAccount" };

type UserAction = Extract<AppAction, { type: "login" | "logout" }>;

const loginAction: UserAction = {
  type: "login",
  username: "johndoe",
};

const logoutAction: UserAction = {
  type: "logout",
};

console.log(loginAction);
console.log(logoutAction);

// ---------------------------------------------------------------------
// 3. Extract by discriminant property
// ---------------------------------------------------------------------

type SuccessAction = Extract<AppAction, { type: "login" }>;

const successAction: SuccessAction = {
  type: "login",
  username: "johndoe",
};

console.log(successAction);

// ---------------------------------------------------------------------
// 4. Extract with primitive unions
// ---------------------------------------------------------------------

type MixedValue = string | number | boolean | null | undefined;

type StringValue = Extract<MixedValue, string>; // string
type NumericValue = Extract<MixedValue, number>; // number

let stringValue: StringValue = "hello";
let numericValue: NumericValue = 42;

console.log(stringValue);
console.log(numericValue);

// ---------------------------------------------------------------------
// 5. Extract with structural types
// ---------------------------------------------------------------------

type Value = string | number | (() => void) | { id: number };

type FunctionValue = Extract<Value, (...args: never[]) => unknown>;
type ObjectValue = Extract<Value, object>;

const fn: FunctionValue = () => {
  console.log("called");
};

const objectValue: ObjectValue = {
  id: 1,
};

console.log(fn);
console.log(objectValue);

// ---------------------------------------------------------------------
// 6. Filtering a discriminated union
// ---------------------------------------------------------------------

type Request =
  { status: "pending"; data: undefined } | { status: "success"; data: string } | { status: "error"; data: Error };

type SuccessfulRequest = Extract<Request, { status: "success" }>;
type FailedRequest = Extract<Request, { status: "error" }>;

const successfulRequest: SuccessfulRequest = {
  status: "success",
  data: "User loaded successfully",
};

const failedRequest: FailedRequest = {
  status: "error",
  data: new Error("Request failed"),
};

console.log(successfulRequest);
console.log(failedRequest);

// ---------------------------------------------------------------------
// 7. Extract with keyof
// ---------------------------------------------------------------------

type User = {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
};

type UserKeys = keyof User;
type ContactKeys = Extract<UserKeys, "username" | "email">;

const contactKey: ContactKeys = "email";

console.log(contactKey);

// ---------------------------------------------------------------------
// 8. Extract function keys
// ---------------------------------------------------------------------

type Service = {
  name: string;
  start(): void;
  stop(): void;
  restart(): void;
};

type ServiceKeys = keyof Service;
type LifecycleKeys = Extract<ServiceKeys, "start" | "stop" | "restart">;

const lifecycleKey: LifecycleKeys = "restart";

console.log(lifecycleKey);

// ---------------------------------------------------------------------
// 9. Extract from a union of function types
// ---------------------------------------------------------------------

type Handler = ((value: string) => void) | ((value: number) => void) | (() => void);

type ValueHandler = Extract<Handler, (value: string) => void>;

const valueHandler: ValueHandler = (value) => {
  console.log(value);
};

console.log(valueHandler);

// ---------------------------------------------------------------------
// 10. Extract with literal unions
// ---------------------------------------------------------------------

type Direction = "north" | "south" | "east" | "west";

type HorizontalDirection = Extract<Direction, "east" | "west">;

let horizontalDirection: HorizontalDirection = "east";
horizontalDirection = "west";

console.log(horizontalDirection);

// ---------------------------------------------------------------------
// 11. Building a reusable union filter
// ---------------------------------------------------------------------

type AppEvent =
  | { type: "click"; x: number; y: number }
  | { type: "focus"; element: string }
  | { type: "submit"; formId: string }
  | { type: "keydown"; key: string };

type MouseEvent2 = Extract<AppEvent, { type: "click" }>;
type FormEvent2 = Extract<AppEvent, { type: "submit" }>;

const mouseEvent: MouseEvent2 = {
  type: "click",
  x: 100,
  y: 200,
};

const formEvent: FormEvent2 = {
  type: "submit",
  formId: "login-form",
};

console.log(mouseEvent);
console.log(formEvent);

// ---------------------------------------------------------------------
// 12. Extracting component prop variants
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

type ButtonProps = Extract<ComponentProps, { variant: "button" }>;
type InputProps = Extract<ComponentProps, { variant: "input" }>;
type LinkProps = Extract<ComponentProps, { variant: "link" }>;

const buttonProps: ButtonProps = {
  variant: "button",
  label: "Save",
  onClick() {
    console.log("Saved");
  },
};

const inputProps: InputProps = {
  variant: "input",
  placeholder: "Enter your name",
  onChange(value) {
    console.log(value);
  },
};

const linkProps: LinkProps = {
  variant: "link",
  href: "/dashboard",
  label: "Dashboard",
};

console.log(buttonProps);
console.log(inputProps);
console.log(linkProps);

// ---------------------------------------------------------------------
// 13. Extracting API response variants
// ---------------------------------------------------------------------

type ApiResponse =
  | { status: 200; data: { id: number; name: string } }
  | { status: 201; data: { id: number; name: string } }
  | { status: 400; error: string }
  | { status: 404; error: string }
  | { status: 500; error: string };

type SuccessResponse = Extract<ApiResponse, { status: 200 | 201 }>;

const successResponse: SuccessResponse = {
  status: 200,
  data: {
    id: 1,
    name: "John Doe",
  },
};

console.log(successResponse);

// ---------------------------------------------------------------------
// 14. Extract with a union of string literal keys
// ---------------------------------------------------------------------

type Permission = "users:read" | "users:write" | "posts:read" | "posts:write" | "settings:read";

type UserPermission = Extract<Permission, `users:${string}`>;

const userPermission: UserPermission = "users:write";

console.log(userPermission);

// ---------------------------------------------------------------------
// 15. Extract with template literal types
// ---------------------------------------------------------------------

type EventName = "user:created" | "user:deleted" | "order:created" | "order:cancelled";

type UserEvent = Extract<EventName, `user:${string}`>;

let userEvent: UserEvent = "user:created";

console.log(userEvent);

// ---------------------------------------------------------------------
// 16. How Extract is implemented
// ---------------------------------------------------------------------

type ExtractImpl<T, U> = T extends U ? T : never;

type ExampleUnion = "a" | "b" | "c";

type OnlyA = ExtractImpl<ExampleUnion, "a">;

const onlyA: OnlyA = "a";

console.log(onlyA);

// ---------------------------------------------------------------------
// 17. Why distribution matters
// ---------------------------------------------------------------------

type ValuesToFilter = string | number | boolean;

// A conditional type written directly against a union type is evaluated
// once, against the whole union, and does not distribute.
type OnlyStrings = ValuesToFilter extends string ? ValuesToFilter : never; // never

// A conditional type written against a bare type parameter distributes:
// TypeScript evaluates the condition once per union member and merges
// the results back into a union. This is exactly how Extract works.
type DistributedStrings<T> = T extends string ? T : never;
type FilteredStrings = DistributedStrings<ValuesToFilter>; // string

let filteredString: FilteredStrings = "hello";

console.log(filteredString);

// ---------------------------------------------------------------------
// 18. Practical event handler filtering
// ---------------------------------------------------------------------

type FormAppEvent =
  | { type: "click"; x: number; y: number }
  | { type: "input"; value: string }
  | { type: "submit"; formId: string }
  | { type: "resize"; width: number; height: number };

type InputEvent2 = Extract<FormAppEvent, { type: "input" }>;

function handleInput(event: InputEvent2): void {
  console.log(event.value);
}

handleInput({
  type: "input",
  value: "John",
});

// ---------------------------------------------------------------------
// 19. Extracting nullable members
// ---------------------------------------------------------------------

type MaybeValue = string | number | null | undefined;

type NullishValue = Extract<MaybeValue, null | undefined>;

let nullishValue: NullishValue = null;
nullishValue = undefined;

console.log(nullishValue);

// ---------------------------------------------------------------------
// 20. Extract with readonly properties
// ---------------------------------------------------------------------

type Data =
  | { readonly id: number; name: string }
  | { readonly id: number; title: string }
  | { readonly id: number; active: boolean };

type NamedData = Extract<Data, { name: string }>;

const namedData: NamedData = {
  id: 1,
  name: "Document",
};

console.log(namedData);

// ---------------------------------------------------------------------
// 21. Practical API type filtering
// ---------------------------------------------------------------------

type ApiResult =
  | { kind: "user"; value: { id: number; username: string } }
  | { kind: "post"; value: { id: number; title: string } }
  | { kind: "comment"; value: { id: number; body: string } };

type UserResult = Extract<ApiResult, { kind: "user" }>;

function renderUser(result: UserResult): string {
  return result.value.username;
}

console.log(
  renderUser({
    kind: "user",
    value: {
      id: 1,
      username: "johndoe",
    },
  }),
);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Extract<T, U>` constructs a type by keeping only the members of union `T` that are assignable to `U`.
// - It is a distributive conditional type: TypeScript checks the condition once per union member and merges the matches back into a new, narrower union.
// - Ideal for pulling a specific subset out of a larger union, such as a group of action types, one variant of a discriminated union, or a related set of keys from a `keyof` result.
// - Operates as the exact complement to `Exclude<T, U>`; applying both with the same `U` splits a union into two non-overlapping halves.
// - Like all utility types, it is a compile-time, type-level operation only and has no effect on runtime values.

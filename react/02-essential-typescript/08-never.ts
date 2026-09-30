/**
 * Never
 * =====
 *
 * The `never` type represents values that never occur. It is used for functions
 * that never successfully return and for values that TypeScript determines are impossible.
 */

// -----------------------------------------------------------------------
// 1. Functions that never return
// -----------------------------------------------------------------------

// A function that always throws an error never reaches a normal return.
function fail(message: string): never {
  throw new Error(message);
}

// fail("Something went wrong");

// Because `fail` never completes normally, its return type is `never`.

// -----------------------------------------------------------------------
// 2. Infinite loops
// -----------------------------------------------------------------------

// A function containing an infinite loop also never returns.
function runForever(): never {
  while (true) {
    // Intentionally never exits.
  }
}

// `runForever()` has the return type `never` because execution never reaches the end.

// -----------------------------------------------------------------------
// 3. Never vs void
// -----------------------------------------------------------------------

// `void` means a function completes without returning a value.
function logMessage(message: string): void {
  console.log(message);
}

// `never` means a function cannot complete normally.
function throwError(message: string): never {
  throw new Error(message);
}

logMessage("Operation completed");

// throwError("Operation failed");

// A `void` function returns normally, while a `never` function does not.

// -----------------------------------------------------------------------
// 4. Never in impossible union states
// -----------------------------------------------------------------------

// After all possible members of a union have been handled,
// TypeScript can narrow the remaining value to `never`.
type Status = "pending" | "success" | "error";

function getMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "Request is pending.";

      ```
case "success":
  return "Request succeeded.";

case "error":
  return "Request failed.";
```;
  }
}

// Every possible `Status` value is handled, so there is no remaining value.

// -----------------------------------------------------------------------
// 5. Exhaustive checking
// -----------------------------------------------------------------------

// A `never` parameter can enforce exhaustive handling of a discriminated union.
type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: string;
};

type ErrorState = {
  status: "error";
  message: string;
};

type RequestState = LoadingState | SuccessState | ErrorState;

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function getStateMessage(state: RequestState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";

      ```
case "success":
  return state.data;

case "error":
  return state.message;

default:
  return assertNever(state);
```;
  }
}

console.log(getStateMessage({ status: "loading" })); // "Loading..."
console.log(getStateMessage({ status: "success", data: "Loaded" })); // "Loaded"
console.log(getStateMessage({ status: "error", message: "Failed" })); // "Failed"

// If another state is added to `RequestState` without adding a corresponding
// switch case, TypeScript will report an error at `assertNever(state)`.

// -----------------------------------------------------------------------
// 6. Never from impossible intersections
// -----------------------------------------------------------------------

// An intersection can produce `never` when two required types cannot coexist.
type StringAndNumber = string & number;

// A value cannot simultaneously be both a string and a number.
// let impossible: StringAndNumber = "hello"; // TS2322: Type 'string' is not assignable to type 'never'.

// TypeScript reduces the impossible intersection to `never`.

// -----------------------------------------------------------------------
// 7. Never in conditional types
// -----------------------------------------------------------------------

// `never` can be used as the branch for a condition that should produce no type.
type ExtractString<T> = T extends string ? T : never;

type StringValues = ExtractString<string | number | boolean>;

const text: StringValues = "Hello";

console.log(text); // "Hello"

// `number` and `boolean` become `never` and are removed from the resulting union.

// -----------------------------------------------------------------------
// 8. Never is assignable to every type
// -----------------------------------------------------------------------

// Because `never` represents an impossible value, it can be assigned to any type.
function failOperation(): never {
  throw new Error("Operation failed");
}

function getUsername(): string {
  return failOperation();
}

function getUserId(): number {
  return failOperation();
}

// `failOperation()` can satisfy either return type because it never produces a value.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - `never` represents a value that can never occur.
// - Functions that always throw or never terminate can have a `never` return type.
// - `never` differs from `void`: `void` functions complete normally, while `never` functions do not.
// - TypeScript can narrow an exhaustively handled union to `never`.
// - A `never` helper can enforce exhaustive handling of discriminated unions.
// - Impossible intersections and some conditional types can produce `never`.
// - `never` is assignable to every other type because it represents no possible value.

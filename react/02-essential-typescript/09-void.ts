/**
 * void
 * ====
 *
 * The void type represents the absence of a useful return value, most commonly
 * for functions that perform an action without returning a result.
 */

// ---------------------------------------------------------------------
// 1. Basic void return type
// ---------------------------------------------------------------------

function logMessage(message: string): void {
  console.log(message);
}

logMessage("Hello, TypeScript"); // "Hello, TypeScript"

// void indicates that the function does not return a meaningful value.

// ---------------------------------------------------------------------
// 2. Functions that return nothing
// ---------------------------------------------------------------------

function printUser(name: string): void {
  console.log(`User: ${name}`);
}

function notifyUser(message: string): void {
  console.log(`Notification: ${message}`);
}

printUser("John"); // "User: John"
notifyUser("Profile updated"); // "Notification: Profile updated"

// These functions perform side effects instead of producing a result
// for the caller to use.

// ---------------------------------------------------------------------
// 3. Returning without a value
// ---------------------------------------------------------------------

function validateName(name: string): void {
  if (name.length === 0) {
    return;
  }

  console.log(`Valid name: ${name}`);
}

validateName(""); // no output
validateName("John"); // "Valid name: John"

// A void function can use return to exit early, but it does not return
// a useful value.

// ---------------------------------------------------------------------
// 4. Void and undefined
// ---------------------------------------------------------------------

function doNothing(): void {
  return;
}

const result = doNothing();

console.log(result); // undefined

// A void-returning function produces undefined at runtime when it does not
// explicitly return a value.

// void describes the function's intended API: callers should not depend
// on a return value.

// ---------------------------------------------------------------------
// 5. void is not the same as undefined
// ---------------------------------------------------------------------

let nothing: undefined = undefined;
let noResult: void = undefined;

console.log(nothing); // undefined
console.log(noResult); // undefined

// Although both can contain undefined, void has a different purpose.
// undefined describes a specific value, while void commonly describes
// a function whose result should not be used.

// ---------------------------------------------------------------------
// 6. Functions returning undefined
// ---------------------------------------------------------------------

function explicitlyUndefined(): undefined {
  return undefined;
}

function implicitlyVoid(): void {
  console.log("Done");
}

console.log(explicitlyUndefined()); // undefined
console.log(implicitlyVoid()); // undefined

// The return types communicate different intent:
//
// undefined
// -> the function explicitly produces the undefined value.
//
// void
// -> the caller should treat the function as having no useful result.

// ---------------------------------------------------------------------
// 7. Void function type
// ---------------------------------------------------------------------

type Logger = (message: string) => void;

const logger: Logger = (message) => {
  console.log(message);
};

logger("Application started"); // "Application started"

// A function type can explicitly specify void as its return type.

// ---------------------------------------------------------------------
// 8. Void functions can perform side effects
// ---------------------------------------------------------------------

function incrementCounter(counter: { value: number }): void {
  counter.value += 1;
}

const counter = { value: 0 };

incrementCounter(counter);
incrementCounter(counter);

console.log(counter.value); // 2

// Mutating external state is a side effect.
// The function does not need to return the updated value.

/**
 * Common side-effect functions include:
 *
 * - logging
 * - updating application state
 * - modifying the DOM
 * - sending a request
 * - dispatching an action
 * - writing to storage
 */

// ---------------------------------------------------------------------
// 9. void with array methods
// ---------------------------------------------------------------------

const users = ["John", "Alice", "Michael"];

users.forEach((user) => {
  console.log(user);
});

// forEach() expects a callback whose return value is not used.
// This is a common practical use of void-compatible functions.

// ---------------------------------------------------------------------
// 10. Void callbacks
// ---------------------------------------------------------------------

type ButtonHandler = () => void;

function registerButtonHandler(handler: ButtonHandler): void {
  handler();
}

registerButtonHandler(() => {
  console.log("Button clicked");
});

// void is commonly used for callbacks where the caller intentionally
// ignores the callback's return value.

// ---------------------------------------------------------------------
// 11. Void callback and returned values
// ---------------------------------------------------------------------

type Action = () => void;

const action: Action = () => {
  console.log("Action executed");
  return "completed";
};

action(); // "Action executed"

// TypeScript allows a function returning a value to be assigned to a
// callback returning void when the caller is expected to ignore that value.

// The returned string exists at runtime, but the Action type tells callers
// not to depend on it.

// ---------------------------------------------------------------------
// 12. Why void callback compatibility exists
// ---------------------------------------------------------------------

const numbers = [1, 2, 3];

numbers.forEach((number) => {
  return number * 2;
});

// forEach() does not use the returned value.
// Allowing callbacks with return values here is useful because the callback
// can contain an expression or return early without affecting the API.

// ---------------------------------------------------------------------
// 13. void does not mean "any return value"
// ---------------------------------------------------------------------

function execute(action: () => void): void {
  action();
}

execute(() => {
  return "done";
});

// The callback's return value is intentionally ignored by execute().
// void therefore communicates that the consumer of the callback does not
// depend on its return value.

// ---------------------------------------------------------------------
// 14. void in event handlers
// ---------------------------------------------------------------------

function handleClick(): void {
  console.log("Clicked");
}

function handleSubmit(): void {
  console.log("Submitted");
}

handleClick();
handleSubmit();

// Browser and React event handlers commonly return void because the event
// system does not use a handler's return value.

// ---------------------------------------------------------------------
// 15. React event handlers
// ---------------------------------------------------------------------

// React event handlers commonly use void as their return type.
//
// function Button() {
//   const handleClick = (): void => {
//     console.log("Button clicked");
//   };
//
//   return <button onClick={handleClick}>Click</button>;
// }

// The handler performs an action; React does not use its return value.

// ---------------------------------------------------------------------
// 16. void and async functions
// ---------------------------------------------------------------------

async function saveUser(): Promise<void> {
  console.log("Saving user...");
}

saveUser();

// An async function that does not return a value produces Promise<void>.
// The function itself is asynchronous, but its resolved value is undefined.

// ---------------------------------------------------------------------
// 17. Promise<void>
// ---------------------------------------------------------------------

async function sendNotification(): Promise<void> {
  console.log("Notification sent");
}

const notificationResult = sendNotification();

notificationResult.then(() => {
  console.log("Operation completed");
});

// Promise<void> means that the Promise resolves without a useful value.

// ---------------------------------------------------------------------
// 18. void does not describe thrown errors
// ---------------------------------------------------------------------

function processRequest(): void {
  if (Math.random() < 0) {
    throw new Error("Request failed");
  }

  console.log("Request processed");
}

processRequest();

// A void return type describes the successful return value.
// It does not mean that the function cannot throw an exception.

// ---------------------------------------------------------------------
// 19. Void vs. never
// ---------------------------------------------------------------------

function logAndReturn(): void {
  console.log("Finished");
}

function fail(): never {
  throw new Error("Operation failed");
}

// void:
// -> the function completes without returning a useful value.
//
// never:
// -> the function never successfully completes.

// logAndReturn();
// fail();

// ---------------------------------------------------------------------
// 20. Void vs. never with infinite execution
// ---------------------------------------------------------------------

function runForever(): never {
  while (true) {
    // The function never reaches its end.
  }
}

// runForever();

// A function returning never cannot complete normally.
// A function returning void completes normally but has no useful result.

// ---------------------------------------------------------------------
// 21. Void vs. undefined in APIs
// ---------------------------------------------------------------------

type VoidCallback = () => void;
type UndefinedCallback = () => undefined;

const onComplete: VoidCallback = () => {
  console.log("Completed");
};

// A callback typed as () => undefined must explicitly return undefined.
//
// const strictCallback: UndefinedCallback = () => {
//   console.log("Completed");
// };
// Error because the function does not return undefined explicitly.

// void is therefore generally more appropriate for callbacks whose result
// should simply be ignored.

// ---------------------------------------------------------------------
// 22. Inferred void return type
// ---------------------------------------------------------------------

function logUser(name: string) {
  console.log(name);
}

const logged = logUser("John");

console.log(logged); // undefined

// TypeScript infers the return type as void because the function has no
// return statement that produces a value.

// ---------------------------------------------------------------------
// 23. Explicit vs. inferred void
// ---------------------------------------------------------------------

function sendMessage(message: string): void {
  console.log(message);
}

function sendMessageInferred(message: string) {
  console.log(message);
}

sendMessage("Hello");
sendMessageInferred("Hello");

// Explicit void documents the function's API.
// Inferred void is useful when the return type is obvious from the body.

// Public APIs and important callbacks can benefit from explicit return
// types because they communicate intent directly.

/**
 * Prefer explicit return types when:
 *
 * - the function is part of a public API
 * - the return behavior is important to the design
 * - the function is complex
 * - you want the compiler to enforce the intended return contract
 *
 * In small local functions, inference is often sufficient.
 */

// ---------------------------------------------------------------------
// 24. Void and mutable state
// ---------------------------------------------------------------------

type UserState = {
  name: string;
};

function renameUser(user: UserState, name: string): void {
  user.name = name;
}

const userState: UserState = {
  name: "John",
};

renameUser(userState, "Alice");

console.log(userState.name); // "Alice"

// A void function can still have important effects.
// void only describes its return contract, not whether the function
// changes application state.

// ---------------------------------------------------------------------
// 25. React state updates
// ---------------------------------------------------------------------

// React state setters are commonly used as actions rather than functions
// whose return values are consumed.
//
// const [count, setCount] = useState(0);
//
// const increment = (): void => {
//   setCount((current) => current + 1);
// };

// The update function performs an action and does not need to return
// the resulting state value.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - void represents the absence of a useful return value.
// - It is most commonly used for functions that perform side effects.
// - A void function can complete normally and returns undefined at runtime.
// - void is different from undefined: undefined describes a value, while
//   void commonly describes a function's return contract.
// - Void callbacks are common in event handlers, array iteration, and APIs.
// - TypeScript allows value-returning functions to be used where a void
//   callback is expected because the callback's return value is ignored.
// - Promise<void> represents an asynchronous operation with no useful
//   resolved value.
// - void does not mean that a function cannot throw an error.
// - void differs from never: void functions complete, while never functions
//   do not complete normally.
// - React event handlers and state-changing functions commonly use void.
// - Explicit void return types can document API intent, while TypeScript
//   can also infer void automatically.

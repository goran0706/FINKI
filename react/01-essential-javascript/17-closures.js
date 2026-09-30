/**
 * Closures
 * ========
 *
 * A closure is a function that retains access to variables from its surrounding lexical
 * environment even after the scope in which those variables were created has finished executing.
 *
 * Closures are a natural consequence of lexical scoping and are commonly used for encapsulation,
 * function factories, callbacks, asynchronous code, and functions that maintain private state.
 */

// ---------------------------------------------------------------------
// 1. What is a closure?
// ---------------------------------------------------------------------

// An inner function can access variables declared in an enclosing function.
// When the inner function is returned, it retains access to those variables.

function createGreeting() {
  const greeting = "Hello";

  function greet(name) {
    return `${greeting}, ${name}!`;
  }

  return greet;
}

const greet = createGreeting();

// `greet` is a closure because it retains access to `greeting`
// from the lexical environment in which `greet` was created.

console.log(greet("John")); // "Hello, John!"

// `createGreeting` has already returned when `greet` is called.
// The returned function still has access to the `greeting` binding.

// ---------------------------------------------------------------------
// 2. Lexical scope
// ---------------------------------------------------------------------

// A function's variable lookup is determined by where the function is defined,
// not by where the function is called.

const message = "global";

function createReader() {
  const message = "outer";

  function readMessage() {
    return message;
  }

  return readMessage;
}

const readMessage = createReader();

console.log(readMessage()); // "outer"

// `readMessage` was defined inside `createReader`, so its lexical scope
// includes the `message` binding declared inside `createReader`.

// ---------------------------------------------------------------------
// 3. Closures preserve access to outer variables
// ---------------------------------------------------------------------

// A closure can maintain access to a variable across multiple calls.

function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// `count` is not recreated on each call to `counter`.
// The returned function retains access to the same `count` binding.

// ---------------------------------------------------------------------
// 4. Each closure can have independent state
// ---------------------------------------------------------------------

// Calling the outer function again creates a new lexical environment
// with a different `count` binding.

const counterA = createCounter();
const counterB = createCounter();

console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterB()); // 1
console.log(counterA()); // 3
console.log(counterB()); // 2

// `counterA` and `counterB` close over different `count` bindings.

// ---------------------------------------------------------------------
// 5. Closures can read outer variables
// ---------------------------------------------------------------------

// A closure does not need to modify the captured variable.
// It can simply retain access to it.

function createUsernameReader() {
  const username = "john";

  return function () {
    return username;
  };
}

const getUsername = createUsernameReader();

console.log(getUsername()); // "john"

// The returned function does not contain an independent copy of `username`.
// It retains access to the lexical binding created by `createUsernameReader`.

// ---------------------------------------------------------------------
// 6. Closures can modify outer variables
// ---------------------------------------------------------------------

// A closure can also modify a captured binding when that binding is mutable.

function createScore() {
  let score = 0;

  return {
    increase() {
      score++;
    },

    decrease() {
      score--;
    },

    get() {
      return score;
    },
  };
}

const score = createScore();

score.increase();
score.increase();
score.decrease();

console.log(score.get()); // 1

// The `score` binding is not directly accessible from outside.
// The returned methods provide controlled access to it.

// ---------------------------------------------------------------------
// 7. Closures provide encapsulation
// ---------------------------------------------------------------------

// Variables captured by a closure are not automatically exposed as
// properties of the returned object.

function createBankAccount() {
  let balance = 0;

  return {
    deposit(amount) {
      balance += amount;
    },

    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount();

account.deposit(100);
account.deposit(50);

console.log(account.getBalance()); // 150
console.log(account.balance); // undefined

// `balance` exists in the lexical environment captured by the methods.
// It is not a property of the returned object.

// ---------------------------------------------------------------------
// 8. Function factories
// ---------------------------------------------------------------------

// A function factory creates and returns functions that are configured
// with values supplied when the factory is called.

function multiplyBy(factor) {
  return function (value) {
    return value * factor;
  };
}

const multiplyBy2 = multiplyBy(2);
const multiplyBy10 = multiplyBy(10);

console.log(multiplyBy2(5)); // 10
console.log(multiplyBy10(5)); // 50

// `multiplyBy2` closes over `factor` with the value `2`.
// `multiplyBy10` closes over a different `factor` binding with the value `10`.

// ---------------------------------------------------------------------
// 9. Closures with configuration
// ---------------------------------------------------------------------

// A closure can capture configuration once and reuse it across multiple calls.

function createFormatter(prefix) {
  return function (value) {
    return `${prefix}: ${value}`;
  };
}

const formatError = createFormatter("ERROR");
const formatInfo = createFormatter("INFO");

console.log(formatError("File not found")); // "ERROR: File not found"
console.log(formatInfo("Server started")); // "INFO: Server started"

// Each returned function retains access to the `prefix` binding
// created by its corresponding call to `createFormatter`.

// ---------------------------------------------------------------------
// 10. Function parameters can be captured
// ---------------------------------------------------------------------

// Function parameters are local bindings, so they can also be captured by closures.

function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const triple = createMultiplier(3);

console.log(triple(4)); // 12
console.log(triple(7)); // 21

// The returned function closes over the `multiplier` parameter.

// ---------------------------------------------------------------------
// 11. Closures capture bindings, not snapshots
// ---------------------------------------------------------------------

// A closure retains access to a binding.
// If that binding changes, the closure observes the updated value.

function createTracker() {
  let value = 0;

  return {
    increment() {
      value++;
    },

    read() {
      return value;
    },
  };
}

const tracker = createTracker();

console.log(tracker.read()); // 0

tracker.increment();
console.log(tracker.read()); // 1

tracker.increment();
console.log(tracker.read()); // 2

// Both methods access the same `value` binding.
// They do not each receive a separate copy of its current value.

// ---------------------------------------------------------------------
// 12. Closures inside loops
// ---------------------------------------------------------------------

// `let` creates a separate binding for each loop iteration.
// A closure created during an iteration retains access to that iteration's binding.

const functions = [];

for (let index = 0; index < 3; index++) {
  functions.push(() => index);
}

console.log(functions[0]()); // 0
console.log(functions[1]()); // 1
console.log(functions[2]()); // 2

// Each callback closes over a different `index` binding.

// ---------------------------------------------------------------------
// 13. The classic `var` loop problem
// ---------------------------------------------------------------------

// `var` is function-scoped rather than block-scoped.
// The callbacks below therefore close over the same `index` binding.

const callbacks = [];

for (var index = 0; index < 3; index++) {
  callbacks.push(() => index);
}

console.log(callbacks[0]()); // 3
console.log(callbacks[1]()); // 3
console.log(callbacks[2]()); // 3

// By the time the callbacks are invoked, the shared `index` binding is `3`.
// `let` provides a separate binding for each iteration.

// ---------------------------------------------------------------------
// 14. Closures and callbacks
// ---------------------------------------------------------------------

// A callback becomes a closure when it accesses variables from
// the scope in which the callback was created.

function createLogger(prefix) {
  return (message) => {
    console.log(`${prefix}: ${message}`);
  };
}

const logInfo = createLogger("INFO");

["Started", "Running", "Finished"].forEach((message) => {
  logInfo(message);
});

// Output:
// INFO: Started
// INFO: Running
// INFO: Finished

// `logInfo` closes over `prefix`.
// A callback passed to `forEach` also forms a closure when it captures
// variables from its surrounding scope.

// ---------------------------------------------------------------------
// 15. Closures and asynchronous code
// ---------------------------------------------------------------------

// Closures allow callbacks that execute later to retain access to
// variables from the scope in which they were created.

function delayedGreeting(name) {
  setTimeout(() => {
    console.log(`Hello, ${name}!`);
  }, 100);
}

delayedGreeting("John");

// `delayedGreeting` returns before the timer callback executes.
// The callback still has access to the `name` parameter through its closure.
//
// Output after approximately 100 ms:
// Hello, John!

// ---------------------------------------------------------------------
// 16. Closures with private state
// ---------------------------------------------------------------------

// A closure can expose operations that work with private internal state
// without exposing the state itself.

function createTodoList() {
  const todos = [];

  return {
    add(todo) {
      todos.push(todo);
    },

    remove(todo) {
      const index = todos.indexOf(todo);

      if (index !== -1) {
        todos.splice(index, 1);
      }
    },

    getAll() {
      return [...todos];
    },
  };
}

const todoList = createTodoList();

todoList.add("Learn JavaScript");
todoList.add("Learn TypeScript");

console.log(todoList.getAll()); // ["Learn JavaScript", "Learn TypeScript"]

// `todos` remains private to the closure.
// `getAll` returns a new array so callers cannot directly mutate the internal array.

// ---------------------------------------------------------------------
// 17. Closures and mutable state
// ---------------------------------------------------------------------

// A closure can maintain mutable state across multiple calls when
// the captured binding is declared with `let`.

function createToggle() {
  let enabled = false;

  return function () {
    enabled = !enabled;
    return enabled;
  };
}

const toggle = createToggle();

console.log(toggle()); // true
console.log(toggle()); // false
console.log(toggle()); // true

// Each invocation reads and updates the same captured `enabled` binding.

// ---------------------------------------------------------------------
// 18. Closures can retain immutable configuration
// ---------------------------------------------------------------------

// A closure does not require mutable state.
// It can retain configuration that never changes.

function createTaxCalculator(rate) {
  return (price) => price * rate;
}

const calculateTax = createTaxCalculator(0.2);

console.log(calculateTax(100)); // 20
console.log(calculateTax(250)); // 50

// `rate` is captured and never modified.
// The returned function can reuse that configuration across calls.

// ---------------------------------------------------------------------
// 19. Closures and stale values
// ---------------------------------------------------------------------

// A callback can retain access to a particular lexical environment.
// When the callback executes later, it uses the bindings available
// through that environment.

function createMessage() {
  let message = "Initial";

  return {
    update(newMessage) {
      message = newMessage;
    },

    log() {
      console.log(message);
    },
  };
}

const messageStore = createMessage();

messageStore.log(); // "Initial"
messageStore.update("Updated");
messageStore.log(); // "Updated"

// Both methods close over the same `message` binding.
// They therefore observe its current value.

// ---------------------------------------------------------------------
// 20. Common mistake: confusing a closure with a copied value
// ---------------------------------------------------------------------

function createReader() {
  let value = 10;

  return {
    set(newValue) {
      value = newValue;
    },

    get() {
      return value;
    },
  };
}

const reader = createReader();

reader.set(50);

console.log(reader.get()); // 50

// The returned function does not contain a frozen copy of `value`.
// It retains access to the original lexical binding.

// ---------------------------------------------------------------------
// 21. Common mistake: exposing mutable internal state
// ---------------------------------------------------------------------

// Returning a mutable object directly can expose the state that the
// closure was intended to keep private.

function createItems() {
  const items = [];

  return {
    add(item) {
      items.push(item);
    },

    getItems() {
      return items;
    },
  };
}

const itemStore = createItems();

itemStore.add("A");

const exposedItems = itemStore.getItems();
exposedItems.push("B");

console.log(itemStore.getItems()); // ["A", "B"]

// The caller received the same array referenced by the closure.
// Mutating that array therefore mutates the internal state.

// Return a copy when callers should not receive direct access to the internal array.

function createSafeItems() {
  const items = [];

  return {
    add(item) {
      items.push(item);
    },

    getItems() {
      return [...items];
    },
  };
}

const safeStore = createSafeItems();

safeStore.add("A");

const copiedItems = safeStore.getItems();
copiedItems.push("B");

console.log(safeStore.getItems()); // ["A"]

// The caller can modify the returned copy without modifying the internal array.

// ---------------------------------------------------------------------
// 22. Closure lifetime
// ---------------------------------------------------------------------

// A lexical environment can remain reachable after its outer function returns
// when a returned function still references bindings from that environment.

function createSecretReader() {
  const secret = "JavaScript";

  return () => secret;
}

const readSecret = createSecretReader();

console.log(readSecret()); // "JavaScript"

// `createSecretReader` has returned, but `secret` remains reachable
// through the closure held by `readSecret`.
//
// When no reachable function or object retains references to the environment,
// the environment and its captured data can become eligible for garbage collection.

// ---------------------------------------------------------------------
// 23. Closure mental model
// ---------------------------------------------------------------------

// A useful mental model is:
//
//   outer function
//       |
//       +-- local bindings
//       |
//       +-- inner function
//               |
//               +-- retains access to the outer bindings
//
// The inner function can continue using those bindings after
// the outer function has returned.

function createNextNumber() {
  let number = 0;

  return () => ++number;
}

const nextNumber = createNextNumber();

console.log(nextNumber()); // 1
console.log(nextNumber()); // 2
console.log(nextNumber()); // 3

// `nextNumber` is a function that retains access to the lexical environment
// containing the `number` binding.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A closure is a function that retains access to its surrounding lexical environment.
// - Closures are a natural consequence of JavaScript's lexical scoping.
// - A closure can access variables after the outer function has returned.
// - Closures retain access to bindings rather than independent snapshots of values.
// - Each call to a closure-producing function can create independent private state.
// - Closures can read and modify captured bindings.
// - Closures can provide encapsulation by keeping variables inaccessible directly from outside.
// - Function factories commonly use closures to retain configuration.
// - Callbacks form closures when they capture variables from their surrounding scope.
// - `let` creates separate loop bindings, while `var` can cause callbacks to share one binding.
// - Closures allow asynchronous callbacks to retain access to variables from earlier execution.
// - Returning copies instead of internal mutable objects helps preserve closure-based encapsulation.

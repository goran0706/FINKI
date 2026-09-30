/**
 * Event Loop
 * ==========
 *
 * JavaScript uses a call stack and host-provided scheduling mechanisms to
 * coordinate synchronous execution with asynchronous work. The event loop
 * determines when queued tasks and microtasks can be processed after the
 * current JavaScript job completes.
 *
 * This explains why asynchronous callbacks execute later, why a 0ms timer
 * is not immediate, and why long-running synchronous work can block other work.
 */

// ---------------------------------------------------------------------
// 1. Synchronous code runs first
// ---------------------------------------------------------------------

console.log("First");
console.log("Second");
console.log("Third");

// First
// Second
// Third

// The current synchronous JavaScript job executes from top to bottom.
// Asynchronous callbacks cannot interrupt the currently running job.

// ---------------------------------------------------------------------
// 2. The call stack
// ---------------------------------------------------------------------

function first() {
  console.log("first");
  second();
}

function second() {
  console.log("second");
  third();
}

function third() {
  console.log("third");
}

first();

// first
// second
// third

// Function calls are placed on the call stack.
// The most recently called function executes first and is then removed.

// ---------------------------------------------------------------------
// 3. Nested call-stack execution
// ---------------------------------------------------------------------

function calculate() {
  const result = 10 + 20;
  return result;
}

function showResult() {
  const result = calculate();
  console.log(result);
}

showResult();

// 30

// While showResult() is executing:
//
// 1. showResult() is pushed onto the call stack.
// 2. calculate() is pushed onto the call stack.
// 3. calculate() returns and is removed.
// 4. showResult() continues execution.
// 5. showResult() returns and is removed.

// ---------------------------------------------------------------------
// 4. Asynchronous callbacks do not interrupt synchronous execution
// ---------------------------------------------------------------------

console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");

// Start
// End
// Timeout

// setTimeout() arranges for its callback to become eligible for later
// execution. It cannot run until the current synchronous job finishes.

// ---------------------------------------------------------------------
// 5. A 0ms timer is not immediate
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Timer callback");
}, 0);

console.log("Synchronous code");

// Synchronous code
// Timer callback

// The delay specifies a minimum delay before the timer can become
// eligible to run. It does not guarantee immediate execution after
// that amount of time.

// ---------------------------------------------------------------------
// 6. Tasks
// ---------------------------------------------------------------------

console.log("Start");

setTimeout(() => {
  console.log("Task");
}, 0);

console.log("End");

// Start
// End
// Task

// Browser timers can queue callbacks as tasks.
// The host environment controls when eligible tasks are selected for
// execution, so the exact scheduling details are host-dependent.

// ---------------------------------------------------------------------
// 7. Microtasks
// ---------------------------------------------------------------------

console.log("Start");

queueMicrotask(() => {
  console.log("Microtask");
});

console.log("End");

// Start
// End
// Microtask

// A microtask is processed after the current JavaScript job completes.
// Pending microtasks are normally processed before another task begins.

// ---------------------------------------------------------------------
// 8. Promise reactions are microtasks
// ---------------------------------------------------------------------

console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise callback");
});

console.log("End");

// Start
// End
// Promise callback

// Promise reactions created by then(), catch(), and finally()
// are scheduled as microtasks.

// ---------------------------------------------------------------------
// 9. Microtasks run before the next task
// ---------------------------------------------------------------------

console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");

// Start
// End
// Promise
// Timeout

// After the current synchronous job:
//
// 1. Pending microtasks are processed.
// 2. The promise reaction runs.
// 3. A later task, such as the timer callback, can then run.

// ---------------------------------------------------------------------
// 10. queueMicrotask() vs. setTimeout()
// ---------------------------------------------------------------------

console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

queueMicrotask(() => {
  console.log("Microtask");
});

console.log("End");

// Start
// End
// Microtask
// Timeout

// queueMicrotask() schedules a microtask.
// setTimeout() schedules a timer callback for later task processing.
// Microtasks are processed before the event loop proceeds to another task.

// ---------------------------------------------------------------------
// 11. Multiple microtasks
// ---------------------------------------------------------------------

console.log("Start");

queueMicrotask(() => {
  console.log("Microtask 1");
});

queueMicrotask(() => {
  console.log("Microtask 2");
});

queueMicrotask(() => {
  console.log("Microtask 3");
});

console.log("End");

// Start
// End
// Microtask 1
// Microtask 2
// Microtask 3

// Microtasks are processed in queue order.
// Each callback runs to completion before the next microtask begins.

// ---------------------------------------------------------------------
// 12. Microtasks can schedule more microtasks
// ---------------------------------------------------------------------

console.log("Start");

queueMicrotask(() => {
  console.log("Microtask 1");

  ```
queueMicrotask(() => {
    console.log("Microtask 2");
});
```;
});

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");

// Start
// End
// Microtask 1
// Microtask 2
// Timeout

// A microtask created while the microtask queue is being processed
// is added to that queue and can run before the next task.

// ---------------------------------------------------------------------
// 13. Promise chains create microtasks
// ---------------------------------------------------------------------

Promise.resolve()
  .then(() => {
    console.log("First then");
  })
  .then(() => {
    console.log("Second then");
  });

console.log("Synchronous code");

// Synchronous code
// First then
// Second then

// The first promise reaction runs as a microtask.
// Its returned promise settles after the callback completes, allowing
// the second reaction to be queued as another microtask.

// ---------------------------------------------------------------------
// 14. async functions
// ---------------------------------------------------------------------

async function getMessage() {
  return "Hello";
}

console.log("Start");

getMessage().then((message) => {
  console.log(message);
});

console.log("End");

// Start
// End
// Hello

// An async function always returns a Promise.
// Even when it returns a value immediately, a .then() reaction runs
// asynchronously as a microtask.

// ---------------------------------------------------------------------
// 15. await pauses the async function
// ---------------------------------------------------------------------

async function run() {
  console.log("Inside 1");

  ```
await Promise.resolve();

console.log("Inside 2");
```;
}

console.log("Start");

run();

console.log("End");

// Start
// Inside 1
// End
// Inside 2

// Code before await runs synchronously.
// await suspends the remainder of the async function and schedules
// its continuation for later asynchronous execution.

// ---------------------------------------------------------------------
// 16. await does not block the JavaScript thread
// ---------------------------------------------------------------------

async function example() {
  console.log("A");

  ```
await Promise.resolve();

console.log("B");
```;
}

example();

console.log("C");

// A
// C
// B

// await pauses only the current async function.
// Other JavaScript work can continue while that function is suspended.

// ---------------------------------------------------------------------
// 17. Combined ordering
// ---------------------------------------------------------------------

console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

queueMicrotask(() => {
  console.log("4");
});

console.log("5");

// 1
// 5
// 3
// 4
// 2

// The synchronous job runs first.
// The promise reaction and queueMicrotask() callback then run in
// insertion order before the timer task.

// ---------------------------------------------------------------------
// 18. Tasks can schedule microtasks
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Task 1");

  ```
queueMicrotask(() => {
    console.log("Microtask from Task 1");
});
```;
}, 0);

setTimeout(() => {
  console.log("Task 2");
}, 0);

// Task 1
// Microtask from Task 1
// Task 2

// After Task 1 finishes, its newly created microtask is processed
// before the event loop proceeds to Task 2.

// ---------------------------------------------------------------------
// 19. Promise inside a timer
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Timeout");

  ```
Promise.resolve().then(() => {
    console.log("Promise inside timeout");
});
```;
}, 0);

setTimeout(() => {
  console.log("Second timeout");
}, 0);

// Timeout
// Promise inside timeout
// Second timeout

// The promise reaction is queued during the first timer task.
// The microtask is processed before another task is selected.

// ---------------------------------------------------------------------
// 20. A complete event-loop sequence
// ---------------------------------------------------------------------

console.log("1: synchronous");

setTimeout(() => {
  console.log("2: timer");

  ```
Promise.resolve().then(() => {
    console.log("3: promise inside timer");
});
```;
}, 0);

Promise.resolve().then(() => {
  console.log("4: promise");

  ```
setTimeout(() => {
    console.log("5: timer inside promise");
}, 0);
```;
});

console.log("6: synchronous");

// 1: synchronous
// 6: synchronous
// 4: promise
// 2: timer
// 3: promise inside timer
// 5: timer inside promise

// The simplified sequence is:
//
// synchronous job
// -> pending microtasks
// -> task
// -> microtasks created by that task
// -> next task

// ---------------------------------------------------------------------
// 21. The event loop does not make JavaScript synchronous work parallel
// ---------------------------------------------------------------------

console.log("Start");

const values = Array.from({ length: 1_000_000 }, (_, index) => index);

let total = 0;

for (const value of values) {
  total += value;
}

console.log("End");
console.log(total);

setTimeout(() => {
  console.log("Timeout");
}, 0);

// Start
// End
// 499999500000
// Timeout

// The synchronous loop occupies the JavaScript execution thread.
// The timer cannot run until that synchronous work has completed.

// ---------------------------------------------------------------------
// 22. Blocking the event loop
// ---------------------------------------------------------------------

console.log("Before blocking");

const start = Date.now();

while (Date.now() - start < 1000) {
  // Deliberately block the JavaScript thread for about one second.
}

console.log("After blocking");

// Before blocking
// After blocking

// While synchronous JavaScript is running, ordinary JavaScript callbacks
// cannot execute on that same thread.

// ---------------------------------------------------------------------
// 23. Timers are not exact execution times
// ---------------------------------------------------------------------

const startTime = Date.now();

setTimeout(() => {
  const elapsed = Date.now() - startTime;
  console.log(`Timer callback ran after approximately ${elapsed}ms`);
}, 100);

// The callback cannot run before the timer becomes eligible.
// Other synchronous work and host scheduling can delay its execution,
// so the measured elapsed time can be greater than the requested delay.

// ---------------------------------------------------------------------
// 24. Event listeners and the event loop
// ---------------------------------------------------------------------

// In a browser, an event listener can be registered like this:
//
// document.addEventListener("click", () => {
//     console.log("User clicked");
// });
//
// When the browser dispatches the event, the listener callback becomes
// part of the browser's scheduled work and runs when the event loop can
// process it.

// ---------------------------------------------------------------------
// 25. User interaction does not interrupt synchronous code
// ---------------------------------------------------------------------

function expensiveOperation() {
  const start = Date.now();

  ```
while (Date.now() - start < 500) {
    // Simulate expensive synchronous work.
}
```;
}

expensiveOperation();

// A browser cannot process ordinary JavaScript event callbacks on the
// same thread while this synchronous operation is still running.
//
// Long-running synchronous work can therefore delay user interactions
// and make a page feel unresponsive.

// ---------------------------------------------------------------------
// 26. Rendering and the event loop
// ---------------------------------------------------------------------

// In a browser, rendering is coordinated by the browser around JavaScript
// execution and other rendering work. It is not simply another JavaScript
// callback queue.
//
// Long-running JavaScript can prevent the browser from performing timely
// visual updates until the blocking work finishes.
//
// Expensive computation may therefore need to be optimized, split into
// smaller pieces, scheduled appropriately, or moved to a Web Worker.

// ---------------------------------------------------------------------
// 27. requestAnimationFrame()
// ---------------------------------------------------------------------

// In a browser:
//
// requestAnimationFrame(() => {
//     console.log("Run before the next repaint");
// });
//
// requestAnimationFrame() is designed for callbacks associated with
// browser rendering, such as animation and visual updates.
//
// It follows rendering-oriented browser scheduling rather than the
// timer scheduling used by setTimeout().

// ---------------------------------------------------------------------
// 28. Splitting large synchronous workloads
// ---------------------------------------------------------------------

function processChunk(items, startIndex, chunkSize) {
  const endIndex = Math.min(startIndex + chunkSize, items.length);

  ```
for (let index = startIndex; index < endIndex; index++) {
    items[index] *= 2;
}

if (endIndex < items.length) {
    setTimeout(() => {
        processChunk(items, endIndex, chunkSize);
    }, 0);
}
```;
}

const items = Array.from({ length: 10 }, (_, index) => index + 1);

processChunk(items, 0, 3);

console.log("Initial synchronous work can continue");

// Splitting a large workload into smaller chunks can give the host
// opportunities to process other work between chunks.
//
// This is a simplified scheduling technique. The appropriate strategy
// depends on the workload, responsiveness requirements, and host environment.

// ---------------------------------------------------------------------
// 29. Microtask starvation
// ---------------------------------------------------------------------

// Microtasks should normally complete quickly.
// Continuously scheduling more microtasks can prevent the event loop
// from reaching pending tasks.
//
// function scheduleForever() {
//     queueMicrotask(scheduleForever);
// }
//
// scheduleForever();
//
// A pattern like this can starve timers, user events, rendering,
// and other work that requires the event loop to continue.

// ---------------------------------------------------------------------
// 30. The event-loop mental model
// ---------------------------------------------------------------------

// A simplified browser mental model is:
//
// 1. Execute the current JavaScript job.
// 2. When it completes, process pending microtasks.
// 3. Allow the browser to perform appropriate rendering work.
// 4. Select another task.
// 5. Process microtasks again.
// 6. Continue.
//
// The actual browser scheduling model contains additional details,
// including multiple task sources and rendering opportunities.
//
// This sequence is therefore a useful teaching model, not a complete
// specification of every browser scheduling decision.

// ---------------------------------------------------------------------
// 31. A compact ordering rule
// ---------------------------------------------------------------------

console.log("sync");

queueMicrotask(() => {
  console.log("microtask");
});

setTimeout(() => {
  console.log("task");
}, 0);

// sync
// microtask
// task

// The core rule is:
//
// - synchronous JavaScript runs first,
// - microtasks run after the current job,
// - later tasks such as timer callbacks run afterward.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JavaScript executes synchronous code using the call stack.
// - The host environment provides mechanisms for scheduling asynchronous work.
// - The event loop coordinates when queued work can be processed.
// - A 0ms timer does not execute immediately.
// - A timer callback becomes eligible only after its minimum delay has elapsed.
// - Promise reactions and queueMicrotask() callbacks are microtasks.
// - Microtasks run after the current JavaScript job completes.
// - Pending microtasks are normally processed before another task.
// - Microtasks can schedule additional microtasks.
// - A task can create microtasks that run before the next task.
// - async functions always return Promises.
// - await suspends the current async function without blocking the thread.
// - Code before await runs synchronously; the continuation runs later.
// - Long-running synchronous work blocks other JavaScript work on the same thread.
// - Blocking the main thread can delay timers, events, and rendering.
// - Rendering is coordinated by the browser rather than being a normal
//   JavaScript callback queue.
// - Microtask starvation can prevent tasks and other work from progressing.
// - The event loop coordinates scheduling; it does not make synchronous
//   JavaScript execution parallel.

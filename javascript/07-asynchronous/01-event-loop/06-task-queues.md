# Task Queues

## Core Concepts & Queue Architecture

**Task Queues:** The data structures and queue mechanisms within the JavaScript runtime environment that hold
asynchronous callback functions, macrotasks, and microtasks waiting to be transferred to the call stack by the event
loop.

* **Callback queue / task queue**
* **Microtask queue**
* **Job queue**
* **Macro tasks**
* **Micro tasks**

## Deep-Dive Architectural Breakdown

| Concept / Mechanism             | Comprehensive Description & Engine Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|:--------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Callback queue / task queue** | • **Macrotask Storage:** A FIFO (First-In-First-Out) data structure that holds asynchronous callbacks originating from Web APIs, timers (`setTimeout`, `setInterval`), I/O operations, and UI event listeners.<br>• **Single Task Processing:** During each turn of the event loop, typically *one* macrotask is pulled from the task queue and pushed onto the call stack for execution.<br>• **Environment Separation:** Runtimes may maintain multiple task queues (e.g., separate queues for rendering, user interaction, and network events) to allow priority management.                                                                                     |
| **Microtask queue**             | • **High-Priority Queue:** A dedicated FIFO queue that holds high-priority asynchronous tasks, primarily consisting of Promise resolution/rejection handlers (`.then`, `.catch`, `.finally`), `queueMicrotask`, and `process.nextTick` (in Node.js).<br>• **Complete Queue Drainage:** Unlike the task queue (which processes one macrotask per tick), whenever the call stack clears, the event loop drains the *entire* microtask queue completely, executing any newly spawned microtasks recursively until the queue is empty.<br>• **Execution Priority:** Microtasks always execute before any subsequent macrotasks or rendering updates can proceed.        |
| **Job queue**                   | • **ECMAScript Specification Term:** The formal specification term used by the JavaScript language standard (ECMAScript) to describe what is commonly referred to as the microtask queue.<br>• **Specification Formalism:** Standardizes how Promise settlement jobs and asynchronous generator tasks are queued and processed sequentially following the completion of execution contexts.                                                                                                                                                                                                                                                                         |
| **Macro tasks**                 | • **Broad Background Operations:** Large-scale tasks that represent discrete, independent units of work handled by the runtime.<br>• **Common Sources:** Includes `setTimeout`, `setInterval`, `setImmediate`, I/O operations, UI rendering events, and network requests (`fetch` completion callbacks).<br>• **Interleaved Execution:** Processed one at a time, giving the event loop regular opportunities to handle user interactions and microtasks between each major workload.                                                                                                                                                                               |
| **Micro tasks**                 | • **Fine-Grained Asynchronous Operations:** Small tasks designed to execute immediately after the currently executing script or function finishes, before the browser handles rendering or moves to the next macrotask.<br>• **Deterministic Ordering:** Guarantees that asynchronous operations dependent on immediate state transformations (like Promise resolution chains) resolve before any external UI updates or timer triggers occur.<br>• **Starvation Risk:** If microtasks continually spawn *new* microtasks during execution, they can trap the event loop in an infinite draining loop, starving macrotasks and completely freezing the application. |

## Comprehensive Execution Workflow

1. **Synchronous Stack Execution:** The call stack executes synchronous instructions until completely empty.
2. **Microtask Queue Inspection:** The event loop immediately inspects the microtask queue and executes every single
   pending microtask until the queue is entirely empty (including any nested microtasks spawned during this phase).
3. **Macrotask Selection:** Once microtasks are exhausted, the event loop selects the oldest macrotask from the task
   queue (or callback queue).
4. **Stack Push & Execution:** The selected macrotask callback is pushed onto the call stack and executed, after which
   the loop cycles back to check the microtask queue again.

## Best Practices

* **Understand task prioritization:** Remember that microtasks (Promises) always run before macrotasks (`setTimeout`),
  ensuring asynchronous state checks happen swiftly.<br>
* **Avoid microtask starvation loops:** Do not create recursive promise chains or infinite `queueMicrotask` loops, as
  they will permanently block the event loop from processing macrotasks or rendering.<br>
* **Choose appropriate scheduling tools:** Use `setTimeout` for deferring heavy UI-blocking tasks to later macrotask
  cycles, and use `queueMicrotask` or Promises when you need code to run immediately after the current operation before
  the next render tick.
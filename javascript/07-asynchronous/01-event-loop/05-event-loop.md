# Event Loop

## Core Concepts & Mechanics

**The Event Loop:** A continuous architectural control loop within the JavaScript runtime environment that monitors the
call stack and task queues, coordinating the execution of synchronous code, asynchronous asynchronous background APIs,
and system events.

| Concept / Mechanism            | Description & Engine Behavior                                                                                                 |
|:-------------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| **Continuous Monitoring**      | An infinite loop checking whether the call stack is empty and whether pending callbacks wait in task queues.                  |
| **Bridge Architecture**        | Connects the single-threaded JavaScript engine to multi-threaded asynchronous background APIs (Web APIs or Node.js bindings). |
| **Non-Blocking Orchestration** | Ensures efficient asynchronous I/O handling despite executing all application code on a single main thread.                   |
| **Stack Empty Check**          | The event loop waits until the call stack is completely empty before pulling tasks from queues.                               |

## Event Loop Phases & Execution Order

| Phase / Cycle                   | Behavior & Characteristics                                                                                                                            |
|:--------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Node.js Phases (libuv)**      | Operates through sequential phases: timers (`setTimeout`, `setInterval`), pending callbacks, poll (I/O), check (`setImmediate`), and close callbacks. |
| **Browser Execution Cycles**    | Operates on continuous task processing cycles interspersed with microtask queue exhaustion and visual rendering updates.                              |
| **Microtask Priority**          | Entirely drains the microtask queue (Promises, `queueMicrotask`) immediately after a task finishes, before moving to the next phase.                  |
| **NextTick Priority (Node.js)** | Maintains a higher priority than standard microtasks, draining completely before the Promise microtask queue is touched.                              |
| **Browser Rendering Lifecycle** | Targets 60Hz (one frame every 16.6ms) executing macrotasks, microtasks, `requestAnimationFrame`, style/layout/paint, and idle callbacks.              |

## Starvation & Performance Hazards

* **Event Loop Starvation:** Occurs when continuous microtask generation, recursive `process.nextTick` loops, or heavy
  synchronous code locks the runtime, trapping pending network or user input tasks indefinitely.
* **Timer Drift:** Timers schedule a minimum delay rather than exact timestamps; heavy event loop congestion delays
  execution and introduces timing inaccuracies.
* **Rendering Delays:** If a macrotask or microtask chain runs longer than 16.6ms, the browser misses its rendering
  deadline, resulting in dropped frames and jank.

## Comprehensive Execution Workflow

1. **Stack Clear Detection:** The call stack finishes executing its current context and becomes completely empty.
2. **NextTick Queue Drainage (Node.js):** All pending `process.nextTick` callbacks are fully executed before moving
   forward.
3. **Microtask Queue Drainage:** All pending Promise microtasks and `queueMicrotask` entries are processed until the
   queue is entirely empty.
4. **Phase / Rendering Hand-off:** In browsers, the engine evaluates style, layout, and rendering frames; in Node.js, it
   proceeds to the next active event loop phase.

## Best Practices

* **Never block the event loop:** Avoid synchronous heavy loops, intensive cryptographic math, or complex algorithms on
  the main thread to keep event loop ticks fast and responsive.
* **Break up heavy tasks:** Use techniques like chunking arrays, `setTimeout` slicing, or Web Workers to split massive
  computational workloads across multiple event loop ticks.
* **Understand microtask accumulation:** Avoid infinite recursive promise chains or excessive microtask generation, as
  completely draining massive microtask queues will starve the event loop phases and freeze the application.
* **Use `process.nextTick()` sparingly:** Reserve it strictly for necessary asynchronous dependency resolutions or
  immediate error cleanup in Node.js modules.
* **Respect the browser render budget:** Break heavy computational work into smaller chunks using `setTimeout` or
  `requestAnimationFrame` to ensure the browser maintains a smooth 60fps rendering pipeline.
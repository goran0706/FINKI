# Execution Order

## Core Concepts & Sequencing Mechanics

**Execution Order:** The predictable, deterministic sequence in which JavaScript statements, synchronous blocks,
macrotasks, and microtasks are evaluated and processed by the engine runtime and event loop.

* **Sync + async execution order**
* **Multiple callbacks**
* **setTimeout scheduling**
* **Timer execution behavior**

## Deep-Dive Architectural Breakdown

| Concept / Mechanism              | Comprehensive Description & Engine Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|:---------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Sync + async execution order** | • **Strict Synchronous First:** All synchronous code on the main script is executed immediately and completely before any asynchronous callback can ever run.<br>• **Microtask Priority over Macrotasks:** When the call stack clears, all queued microtasks (Promises) execute before any waiting macrotasks (`setTimeout`).<br>• **Layered Sequencing Rule:** Synchronous code $\rightarrow$ Microtask queue drainage $\rightarrow$ Single Macrotask execution $\rightarrow$ Repeat.                                                                                                                                                          |
| **Multiple callbacks**           | • **Queue Ordering:** Multiple asynchronous operations finishing around the same time are ordered in their respective queues based on completion timing or timer expiration.<br>• **Chained Microtasks:** If multiple promises resolve during execution, their `.then()` callbacks are appended to the microtask queue in the order they settled and are executed back-to-back until the queue is fully drained.<br>• **Macrotask Interleaving:** Multiple `setTimeout` calls with identical delays are queued sequentially as macrotasks and executed across consecutive event loop ticks (one per tick, assuming microtasks don't interfere). |
| **setTimeout scheduling**        | • **Minimum Delay Guarantee:** `setTimeout(fn, delay)` schedules the callback to be placed in the task queue *no sooner than* the specified delay in milliseconds.<br>• **Call Stack Blocking Impact:** If the call stack is occupied when a timer expires, the timer callback sits waiting in the task queue until the stack clears and the event loop reaches its task phase.<br>• **Nested Timer Clamping:** Browsers enforce a minimum nesting delay (typically 4ms) for deeply nested `setTimeout` calls to prevent excessive CPU consumption from runaway timers.                                                                         |
| **Timer execution behavior**     | • **Drift & Inaccuracy:** Timers are not high-precision execution guarantees; heavy computational workloads or overloaded event loops cause substantial execution drift.<br>• **Phase Timing (Node.js vs Browser):** In Node.js, timer execution order can vary depending on script entry points and whether timers are initialized inside I/O cycles or the main module scope.<br>• **Queue Extraction:** When the event loop enters the timer phase, it evaluates expired timers and executes their callbacks sequentially until the timer queue is empty or a system limit is reached.                                                       |

## Comprehensive Execution Workflow

1. **Initial Synchronous Pass:** The engine runs all top-level synchronous code, evaluating variables, functions, and
   logging statements straight onto the call stack.
2. **Asynchronous Registration:** Encountered async functions (`setTimeout`, `fetch`, `.then()`) register their
   callbacks with Web APIs or internal task/microtask queues.
3. **Call Stack Clears:** Once synchronous execution completes, the call stack empties entirely.
4. **Queue Drainage & Iteration:** The runtime drains the microtask queue completely, executes a single macrotask from
   the task queue, and repeats the cycle deterministically.

## Best Practices

* **Do not rely on exact timer delays:** Treat `setTimeout` delays as minimum thresholds rather than precise timestamps
  for time-critical operations.<br>
* **Reason through execution flows systematically:** Always mentally trace code by separating synchronous blocks from
  microtasks (Promises) and macrotasks (`setTimeout`) to predict exact log outputs.<br>
* **Avoid tight timing dependencies:** Design asynchronous workflows to be resilient against timer drift and queue
  latency variations rather than relying on strict millisecond timing assumptions.
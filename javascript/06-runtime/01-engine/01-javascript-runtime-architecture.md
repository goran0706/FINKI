## JavaScript Runtime Architecture

JavaScript execution is easier to understand when the runtime is separated into two layers:

1. **ECMAScript** defines the language and execution model: execution contexts, functions, objects, Jobs, Promises,
   Realms, Agents, and related mechanisms.
2. **The host environment** provides capabilities outside the language itself: timers, networking, files, UI events,
   rendering, workers, and the event loop/task scheduling model.

A browser, Node.js, Deno, or another JavaScript host combines these two layers into a complete runtime.

A useful conceptual hierarchy is:

```text
JavaScript Runtime
│
├── Host Environment
│   ├── Event Loop
│   ├── Task Queues
│   ├── Timers
│   ├── I/O
│   ├── Rendering (browser)
│   └── Other host APIs
│
└── ECMAScript Engine
    ├── Agent
    │   ├── Execution Context Stack
    │   ├── Running Execution Context
    │   ├── Jobs / Job Queue
    │   └── Realms
    │       ├── Global Object
    │       ├── Global Environment
    │       └── Intrinsics
    │
    └── JavaScript Objects / Functions / Promises / etc.
```

The exact implementation differs between runtimes, but this model provides the correct conceptual foundation.

### Agent

An **Agent** is an ECMAScript execution unit that provides the environment in which JavaScript code executes.

An agent has concepts such as:

* an execution context stack,
* a currently running execution context,
* a set of Realms,
* mechanisms for executing Jobs,
* and access to the agent's execution state.

For a software developer, the important point is that an agent represents an **isolated JavaScript execution
environment**.

Do not equate an Agent directly with a native OS thread. Hosts commonly associate independent JavaScript execution
agents with separate threads or worker execution environments, but the ECMAScript concept and the operating-system
concept are not identical.

For example, in a browser:

```text
Main execution environment
        │
        └── Agent
             ├── Realm
             ├── Execution Context Stack
             └── JavaScript execution

Web Worker
        │
        └── Agent
             ├── Realm
             ├── Execution Context Stack
             └── JavaScript execution
```

Separate workers do not normally share ordinary JavaScript objects. Shared mutable memory can be provided explicitly
through mechanisms such as `SharedArrayBuffer`.

The important distinction is:

```text
Agent ≠ OS thread
Agent = ECMAScript execution unit
```

### Realm

A **Realm** is an ECMAScript environment containing the built-in objects and global environment associated with a
particular JavaScript execution context.

A Realm includes its own:

* intrinsic objects,
* global object,
* global environment,
* built-in constructors and prototypes.

For example:

```javascript
Object
Array
Function
Promise
Object.prototype
Array.prototype
```

belong to a particular Realm.

This matters because two Realms can have separate versions of these objects:

```text
Realm A                         Realm B
────────                        ────────
Object                         Object
Array                          Array
Object.prototype               Object.prototype
Array.prototype                Array.prototype
globalThis                     globalThis
```

Consequently:

```javascript
arrayFromRealmA instanceof ArrayFromRealmB
```

can produce surprising results when objects and constructors originate from different Realms.

Browsers create multiple Realms in situations such as different documents, iframes, or other execution environments.

A useful mental model is:

```text
Agent
│
├── Realm A
│   ├── globalThis
│   ├── Object
│   ├── Array
│   ├── Function
│   └── other intrinsics
│
└── Realm B
    ├── globalThis
    ├── Object
    ├── Array
    ├── Function
    └── other intrinsics
```

A Realm is therefore about **the JavaScript environment and its built-ins**, whereas an Agent is about **the execution
environment in which code runs**.

### Execution Context

An **Execution Context** represents the state required to execute a piece of JavaScript code.

Execution contexts are created for things such as:

* global code,
* function calls,
* module execution,
* `eval`.

For example:

```javascript
function add(a, b) {
    return a + b;
}

add(10, 20);
```

When `add()` executes, the runtime creates an execution context for that function call.

Conceptually:

```text
Execution Context Stack
────────────────────────

┌─────────────────────┐
│ add(10, 20)         │ ← currently executing
├─────────────────────┤
│ global code         │
└─────────────────────┘
```

When `add()` returns, its execution context is removed:

```text
Execution Context Stack
────────────────────────

┌─────────────────────┐
│ global code         │ ← currently executing
└─────────────────────┘
```

This stack is commonly referred to by developers as the **call stack**.

The call stack is therefore a useful implementation-oriented view of the execution context stack.

### Call Stack

The **call stack** tracks currently executing synchronous JavaScript.

Consider:

```javascript
function first() {
    second();
}

function second() {
    third();
}

function third() {
    console.log("done");
}

first();
```

Conceptually:

```text
third()
second()
first()
global
```

The most recent function call is at the top.

JavaScript executes the current synchronous operation until it completes, throws, or otherwise transfers control.

This is the basis of the common statement:

> JavaScript execution is run-to-completion.

If a function is currently executing, another scheduled task does not interrupt that JavaScript execution in the middle
of the function.

### Job

ECMAScript uses the concept of a **Job** for units of work that the engine executes independently of the currently
executing synchronous operation.

Promise reactions are an important example.

```javascript
console.log("A");

Promise.resolve().then(() => {
    console.log("B");
});

console.log("C");
```

The synchronous code executes first:

```text
A
C
```

The Promise reaction is then processed as a Job:

```text
B
```

Therefore:

```text
A
C
B
```

The distinction is important:

```text
Synchronous JavaScript
        │
        ▼
Execution Context Stack
        │
        ▼
runs to completion
        │
        ▼
Job processing
```

The exact scheduling of Jobs is defined through the ECMAScript execution model and integrated with the host environment.

### Task

A **Task** is primarily a host-environment concept.

Browsers and other hosts maintain task queues for externally initiated work such as:

* timer callbacks,
* user interaction events,
* network-related callbacks,
* message events,
* other host-defined operations.

For example:

```javascript
setTimeout(() => {
    console.log("timer");
}, 0);
```

The callback does not execute immediately.

The host schedules work associated with the timer, and the callback can execute later when the host selects the
corresponding task.

This is why the common developer term **macrotask** is useful:

```text
macrotask
    ↓
common developer terminology

task
    ↓
host scheduling concept
```

However, “macrotask queue” should not be treated as a universal ECMAScript language feature.

### Microtask Queue

A **microtask** is a unit of work that the host/runtime processes at a microtask checkpoint, before continuing with the
next task.

Common sources include:

```javascript
Promise.resolve().then(callback);

queueMicrotask(callback);
```

Browsers also use microtasks for mechanisms such as MutationObserver callbacks.

For example:

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

queueMicrotask(() => {
    console.log("C");
});

console.log("D");
```

The synchronous code runs first:

```text
A
D
```

Then the microtask is processed:

```text
C
```

Only later can the timer task execute:

```text
B
```

So the observable order is:

```text
A
D
C
B
```

The important scheduling relationship is:

```text
Current JavaScript execution
        │
        ▼
Microtask checkpoint
        │
        ▼
Next host task
        │
        ▼
Microtask checkpoint
        │
        ▼
Next host task
        │
        ▼
...
```

A microtask queue is generally drained completely at a microtask checkpoint before the host proceeds to the next task.

This has an important consequence:

```javascript
queueMicrotask(() => {
    queueMicrotask(() => {
        console.log("nested");
    });
});
```

The newly created microtask is also eligible during the same microtask-draining process.

Therefore, continuously creating microtasks can prevent the runtime from reaching subsequent tasks.

### Event Loop

The **event loop** is primarily a host-environment scheduling mechanism.

It should not be thought of as:

```text
"the event loop polls the call stack"
```

A more accurate model is:

```text
                Host Event Loop
                     │
                     ▼
              Select a Task
                     │
                     ▼
          Execute JavaScript
                     │
                     ▼
          JavaScript completes
                     │
                     ▼
         Microtask checkpoint
                     │
                     ▼
       Host performs other work
       (e.g. rendering in browser)
                     │
                     ▼
              Select next Task
```

The host chooses when and what task to execute. Once JavaScript starts executing that task, the synchronous JavaScript
runs to completion.

For example:

```javascript
setTimeout(() => {
    console.log("timer");
}, 0);

console.log("start");

while (true) {
    // blocks the JavaScript execution environment
}
```

The timer does not interrupt the infinite loop.

The host may have scheduled the timer, but JavaScript execution is still occupied by the current synchronous operation.

This is the fundamental reason that CPU-heavy synchronous JavaScript can block timers, input handling, rendering, and
other callbacks.

### Tasks vs Microtasks

The distinction can be summarized as:

```text
Task
│
├── timer callback
├── event callback
├── message callback
└── other host-defined work

Microtask
│
├── Promise reaction
├── queueMicrotask()
└── MutationObserver callback
```

A simplified browser-oriented scheduling cycle is:

```text
┌─────────────────────────────┐
│ Execute a Task              │
│                             │
│   JavaScript runs           │
│   synchronously             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Drain Microtasks            │
│                             │
│   Promise callbacks         │
│   queueMicrotask callbacks  │
│   MutationObserver          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Host-specific processing    │
│                             │
│   Rendering, I/O, etc.      │
└──────────────┬──────────────┘
               │
               ▼
        Next Task
```

The exact sequence around rendering and other host activities is environment-specific. Rendering should therefore not be
described as a universal part of the JavaScript event loop.

### Browser vs Node.js

The general concepts above apply across JavaScript hosts, but the host scheduling model is not identical everywhere.

For example:

```text
Browser
────────────────────────────
JavaScript engine
    +
DOM APIs
    +
Timers
    +
Task queues
    +
Microtask checkpoints
    +
Rendering
    +
Network APIs
```

Node.js:

```text
Node.js
────────────────────────────
JavaScript engine
    +
Node APIs
    +
libuv
    +
Event-loop phases
    +
Timers
    +
I/O
    +
Microtasks
```

Therefore, statements such as:

> "JavaScript always executes timers after rendering"

or:

> "The event loop always works exactly like this"

are too broad.

The ECMAScript execution model is combined with a host-specific scheduling model.

### Shared Memory

JavaScript normally isolates ordinary objects between independent execution environments.

For example:

```javascript
const state = {
    count: 10
};
```

An ordinary object cannot simply be accessed simultaneously by unrelated JavaScript execution agents.

Explicit shared memory is possible through mechanisms such as:

```javascript
SharedArrayBuffer
```

and synchronization primitives such as:

```javascript
Atomics
```

This is fundamentally different from ordinary object sharing:

```text
Ordinary objects

Agent A ── object A

Agent B ── object B


Shared memory

Agent A ──┐
          ├── SharedArrayBuffer
Agent B ──┘
```

The host is responsible for providing the mechanisms that allow separate execution environments to communicate.

### Putting Everything Together

A practical mental model for a JavaScript runtime is:

```text
┌─────────────────────────────────────────────────────┐
│ Host Environment                                    │
│                                                     │
│  Event Loop                                         │
│      │                                              │
│      ├── Task Queue                                 │
│      │       │                                      │
│      │       ▼                                      │
│      │  Execute JavaScript                          │
│      │       │                                      │
│      │       ▼                                      │
│      │  Execution Context Stack                     │
│      │       │                                      │
│      │       ▼                                      │
│      │  Current synchronous execution               │
│      │       │                                      │
│      │       ▼                                      │
│      │  Microtask Checkpoint                        │
│      │       │                                      │
│      │       └── Promise reactions / microtasks     │
│      │                                              │
│      └── Host-specific work                         │
│              └── rendering, I/O, etc.               │
│                                                     │
│  ECMAScript Engine                                  │
│      │                                              │
│      └── Agent                                      │
│          ├── Execution Context Stack                │
│          ├── Jobs                                   │
│          └── Realms                                 │
│              ├── Global Object                      │
│              ├── Global Environment                 │
│              └── Intrinsics                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

The most important relationships to remember are:

```text
Agent
  → provides the ECMAScript execution environment

Realm
  → provides a particular global environment and set of intrinsics

Execution Context
  → represents the state needed to execute JavaScript

Call Stack
  → practical view of the execution-context stack

Job / Microtask
  → deferred JavaScript work processed by the runtime

Task
  → host-scheduled unit of work

Event Loop
  → host mechanism that schedules tasks and coordinates execution

Host APIs
  → provide timers, I/O, events, networking, rendering, etc.
```

The key architectural distinction is:

```text
ECMAScript specification
    │
    ├── Agent
    ├── Realm
    ├── Execution Context
    ├── Jobs
    └── JavaScript execution semantics
              │
              ▼
Host environment
    │
    ├── Event Loop
    ├── Tasks / Task Queues
    ├── Timers
    ├── I/O
    ├── Events
    └── Rendering or other host-specific work
```

JavaScript itself is therefore not "the event loop." The JavaScript language defines how JavaScript executes; the host
environment provides the mechanisms that allow JavaScript to interact with asynchronous external operations and schedule
additional work.

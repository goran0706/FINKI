# Event Fundamentals

## Overview of Event-Driven Architecture

In browser environments, JavaScript operates on an asynchronous event-driven model. Rather than polling for user
interactions or environment changes continuously, the browser engine emits **events**—signal objects representing system
state changes, user inputs, or network progress. Applications register callback functions (event handlers) that remain
inert until the runtime dispatches a matching event.

| Core Concept       | Definition                                   | Architectural Role                                                |
|:-------------------|:---------------------------------------------|:------------------------------------------------------------------|
| **Event**          | An object inheriting from `Event` interface  | Represents a state change (e.g., `click`, `load`, `keydown`)      |
| **Event Target**   | Object implementing `EventTarget` interface  | Node capable of receiving events and having listeners bound to it |
| **Event Listener** | Callback function attached to a target       | Executes when a matching event is dispatched to its target        |
| **Event Loop**     | Concurrent execution mechanism in JavaScript | Picks queued task callbacks and executes them on the call stack   |

## The Event Loop Execution Model

JavaScript executes code in a single-threaded environment. Asynchronous events are handled via the browser's Event Loop
system, which coordinates four key layers:

1. **Call Stack:** Executes synchronous JavaScript instructions line by line.
2. **Web APIs (Host Environment):** Manages DOM elements, timers, network requests, and input hardware off the main
   thread.
3. **Task Queue (Macrotask Queue):** Stores callbacks ready for execution originating from user interactions, timers 
   (`setTimeout`), and I/O.
4. **Microtask Queue:** Holds high-priority promises (`Promise.then`), `MutationObserver` callbacks, and
   `queueMicrotask()` calls.

```
+-----------------------------------------------------------------------+
|                              CALL STACK                               |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    MICROTASK QUEUE (Promises, etc.)                   |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                 TASK QUEUE (Events, Timers, I/O)                      |
+-----------------------------------------------------------------------+
```

### Execution Priority Mechanics

When a user interacts with a DOM element (such as clicking a button):

1. The browser's Web API layer constructs a native `Event` instance.
2. The callback function registered to that event is pushed to the **Task Queue**.
3. The Event Loop checks if the **Call Stack** is currently empty.
4. Once the stack clears, all queued **Microtasks** run to completion.
5. Finally, the Event Loop takes the oldest task from the **Task Queue** and pushes it onto the Call Stack for
   execution.

## Event Targets (`EventTarget` Interface)

All DOM nodes (`Element`, `Document`, `Window`), as well as other host objects like `XMLHttpRequest` and `AudioContext`,
inherit from the base `EventTarget` interface. The `EventTarget` prototype exposes three foundational methods:
`addEventListener(type, listener, options)` registers an event handler, `removeEventListener(type, listener, options)`
unbinds an event handler, and `dispatchEvent(event)` programmatically fires an event at the target.

```javascript
// Checking the prototype hierarchy of a DOM button
const button = document.createElement('button');

console.log(button instanceof HTMLButtonElement); // true
console.log(button instanceof HTMLElement);       // true
console.log(button instanceof Element);           // true
console.log(button instanceof Node);              // true
console.log(button instanceof EventTarget);       // true
```

## Synchronous vs Asynchronous Event Delivery

Events in the DOM fall into two distinct execution pathways based on how they enter the call stack.

| Event Delivery Category | Execution Mechanism                                                                            | Examples                                                                                            |
|:------------------------|:-----------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------|
| **Asynchronous Events** | Queued via the Web API layer; executed on a subsequent Event Loop iteration.                   | User-driven clicks (`click`), keystrokes (`keydown`), network responses (`load`)                    |
| **Synchronous Events**  | Executed **immediately** on the Call Stack during method invocation, bypassing the task queue. | `element.dispatchEvent()`, form submission via `form.submit()`, element focus via `element.focus()` |

```javascript
const btn = document.querySelector('#action-btn');

btn.addEventListener('click', () => {
    console.log('2. Event handler executed');
});

console.log('1. Script start');

// Programmatic dispatch runs SYNCHRONOUSLY
btn.dispatchEvent(new Event('click'));

console.log('3. Script end');

// Output order:
// "1. Script start"
// "2. Event handler executed"
// "3. Script end"
```

## Use Cases

* **User Interaction Handling:** Responding dynamically to clicks, inputs, scrolls, and mouse movements.
* **Component Lifecycle Coordination:** Reacting to DOM readiness (`DOMContentLoaded`) or window resize events (
  `resize`).
* **Asynchronous Flow Management:** Handling file loading operations via `FileReader` or tracking network connectivity
  changes (`online`/`offline`).
* **Custom Event Bus Architecture:** Extending `EventTarget` or using DOM nodes to emit domain-specific messages in
  decoupled architectures.

## Best Practices

* **Keep Event Handlers Lightweight:** Offload complex mathematical or parsing operations inside handlers to Web Workers
  or schedule them using `requestIdleCallback()`.
* **Beware of Synchronous Dispatch Side Effects:** Understand that `dispatchEvent()` executes immediately; ensure
  application state is consistent before programmatically firing events.
* **Do Not Rely on Exact Input Timing:** Never assume two user interactions will execute in a fixed sequence within a
  single frame; decouple state updates from timing assumptions.
* **Understand Microtask Primacy:** Remember that pending Promise resolution microtasks will always run *before* the
  next queued event task executes.
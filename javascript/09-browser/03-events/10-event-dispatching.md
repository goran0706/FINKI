# Triggering and Dispatching Events

## Overview of Synthetic Events

While the browser automatically dispatches events in response to user actions and system state changes, developers can
also create and fire custom events programmatically. This process is known as **dispatching synthetic events**.
Programmatic event dispatching is essential for component communication, testing UI behavior, building custom event
buses, and triggering native element behaviors.

| Event Creation Approach                     | Use Case                                               | `isTrusted` Property | Bubbles by Default?  |
|:--------------------------------------------|:-------------------------------------------------------|:---------------------|:---------------------|
| **Native Interaction** (User click, typing) | Real hardware/OS inputs                                | `true`               | Varies by event type |
| **`new Event()`**                           | Simple custom triggers where no extra data is needed   | `false`              | `false`              |
| **`new CustomEvent()`**                     | Complex events carrying custom payload data (`detail`) | `false`              | `false`              |

## Creating and Dispatching Basic Events (`Event`)

For simple notifications where no payload data is required, use the standard `Event` constructor and pass it to
`EventTarget.dispatchEvent()`.

```javascript
const button = document.querySelector('#action-btn');

// 1. Create a basic event instance (does not bubble by default)
const customNotificationEvent = new Event('notification', {
    bubbles: true,
    cancelable: true
});

// 2. Dispatch the event from the target element
button.dispatchEvent(customNotificationEvent);
```

### Event Constructor Options

When initializing an `Event`, you can pass an optional configuration dictionary:

* `bubbles` (`boolean`, default: `false`): Determines if the event participates in the bubbling phase.
* `cancelable` (`boolean`, default: `false`): Determines if `event.preventDefault()` can be invoked on the event.
* `composed` (`boolean`, default: `false`): Determines if the event crosses shadow DOM boundaries.

## Passing Custom Data (`CustomEvent`)

To pass structured application data along with a synthetic event, use the `CustomEvent` constructor. Data is attached
via the `detail` property.

```javascript
// 1. Define a custom event with payload data
const userUpdateEvent = new CustomEvent('userupdate', {
    bubbles: true,
    cancelable: true,
    detail: {userId: 42, status: 'active', role: 'admin'}
});

// 2. Listen for the custom event
document.addEventListener('userupdate', (event) => {
    console.log(`User ID updated: ${event.detail.userId}`);
    console.log(`New status: ${event.detail.status}`);
});

// 3. Dispatch the event
document.dispatchEvent(userUpdateEvent);
```

## Synchronous Dispatch Mechanics

A critical characteristic of programmatic event dispatching is that **`dispatchEvent()` executes synchronously**. When
you call `dispatchEvent()`, the browser pauses execution of the current script, runs all matching synchronous event
listeners immediately, and only resumes after every listener has finished executing.

```javascript
const input = document.querySelector('input');

input.addEventListener('input', (e) => {
    console.log('2. Event listener executed inside dispatch');
});

console.log('1. Before dispatch');

// Fires synchronously right now
input.dispatchEvent(new Event('input', {bubbles: true}));

console.log('3. After dispatch');

// Execution order:
// "1. Before dispatch"
// "2. Event listener executed inside dispatch"
// "3. After dispatch"
```

## Use Cases

* **Component Decoupling & Event Bus:** Emitting custom domain events from isolated UI components to notify parent
  containers without tight reference coupling.
* **Automated UI Testing:** Simulating clicks, keystrokes, and form inputs programmatically during unit and integration
  testing.
* **Cross-Shadow DOM Communication:** Dispatching composed custom events (`composed: true`) to pierce shadow DOM
  encapsulation boundaries in Web Components.
* **State Synchronization:** Triggering synthetic validation or update events when programmatically modifying form
  fields via JavaScript.

## Best Practices

* **Always Check `event.isTrusted` for Security:** Remember that synthetic events have `event.isTrusted === false`. Do
  not rely solely on programmatic events for sensitive security checks or authentication workflows.
* **Explicitly Set `bubbles: true` for Container Listening:** Standard `new Event()` instances do not bubble by default;
  explicitly pass `{ bubbles: true }` if you want parent containers to intercept the custom event.
* **Use `CustomEvent` for Data Passing:** Always prefer `CustomEvent` over modifying raw `Event` objects when you need
  to transmit payload data via the `.detail` property.
* **Be Aware of Synchronous Side Effects:** Remember that `dispatchEvent()` blocks the call stack until all listeners
  finish; design your event handlers to avoid unexpected recursive dispatch loops.
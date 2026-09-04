# Removing Event Listeners and Memory Management

## Overview of Event Cleanup

When event listeners are bound to DOM nodes, the target element maintains a strong reference to the listener callback
function. If a DOM node is removed from the document but an active event listener remains attached to it, or if
listeners are repeatedly bound without unbinding, **memory leaks** can occur. Managing listener lifecycles correctly is
essential for Single-Page Applications (SPAs) and dynamic user interfaces where elements are constantly mounted,
unmounted, and destroyed.

| Cleanup Strategy            | Mechanism                                                      | Best Suited For                                                    |
|:----------------------------|:---------------------------------------------------------------|:-------------------------------------------------------------------|
| **`removeEventListener()`** | Explicitly unbinds a specific callback function                | Static components with manual teardown methods                     |
| **`AbortController`**       | Aborts and unbinds an entire group of listeners simultaneously | Dynamic components, async fetches, and multi-listener teardowns    |
| **`{ once: true }`**        | Automatically unbinds after a single execution                 | One-time initializers, modal open handlers, or transition triggers |

## The `removeEventListener()` Method

To successfully remove an event listener using `removeEventListener()`, the unbinding call must match the exact
parameters passed during registration: **the same event type**, **the exact same function reference**, and **the same
options configuration** (specifically the `capture` flag).

```javascript
const button = document.querySelector('#action-btn');

function handleClick(event) {
    console.log('Clicked!');
}

// 1. Bind listener
button.addEventListener('click', handleClick, {capture: false});

// 2. Unbind listener (must match type, function reference, and capture flag)
button.removeEventListener('click', handleClick, {capture: false});
```

### Common Pitfalls with Anonymous Functions

Anonymous arrow functions or inline functions cannot be removed via `removeEventListener()` because no variable
reference exists to point to them.

```javascript
// BROKEN: Cannot remove this listener later because it's anonymous
element.addEventListener('click', () => {
    console.log('Clicked');
});

// Impossible to unbind:
element.removeEventListener('click', () => {
}); // FAILS
```

## Modern Cleanup with `AbortController`

Manually calling `removeEventListener()` for multiple handlers becomes verbose and difficult to maintain. The modern,
idiomatic approach to cleaning up listeners is using an `AbortController` and its associated `AbortSignal`.

```javascript
class DropdownMenu {
    constructor(element) {
        this.element = element;
        this.abortController = new AbortController();

        this.initListeners();
    }

    initListeners() {
        const {signal} = this.abortController;

        // Bind multiple event listeners to a shared signal
        document.addEventListener('click', (e) => this.handleOutsideClick(e), {signal});
        window.addEventListener('resize', () => this.reposition(), {signal});
        this.element.addEventListener('keydown', (e) => this.handleKeydown(e), {signal});
    }

    destroy() {
        // Instantly removes ALL event listeners associated with this controller
        this.abortController.abort();
        console.log('Dropdown destroyed and all listeners cleaned up.');
    }
}
```

## Garbage Collection and Detached DOM Nodes

A memory leak happens when JavaScript objects remain in memory because they are still reachable via a reference chain
from a global root (like `window` or `document`).

```
[window / document] 
       |
       v (Lingering Event Listener Reference)
[Detached DOM Element] ---> [Attached Callback Closures] ---> [Heavy Component State]
```

Even if you run `element.remove()` to strip a node from the DOM, if an event listener remains bound to it (or if the
node is referenced inside an active closure), the browser engine cannot garbage-collect the node or its internal
properties.

## Use Cases

* **Single-Page Application Route Changes:** Tearing down component-level event listeners when navigating between views
  to prevent memory bloat.
* **Modal / Drawer Component Unmounting:** Cleaning up document-level click-outside listeners and keyboard handlers when
  a modal dialog closes.
* **Infinite Scroll & Resize Observers:** Dismantling high-frequency scroll or resize listeners when infinite feeds or
  resizable panels are destroyed.

## Best Practices

* **Always Store Named Function References:** Never pass anonymous inline functions to `addEventListener()` if you need
  to manually unbind them later.
* **Prefer `AbortController` for Group Cleanup:** Use an `AbortController` instance when managing multiple event
  listeners across a component lifecycle to avoid writing tedious individual `removeEventListener()` calls.
* **Clean Up Global Listeners:** Always unbind listeners attached to `window`, `document`, or parent containers when
  local components unmount.
* **Leverage `{ once: true }` for Single-Run Logic:** Use the `{ once: true }` configuration option on
  `addEventListener()` for listeners that only need to run once, eliminating manual cleanup entirely.
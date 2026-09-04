# Event Control and Cancellation

## Overview of Event Control Mechanisms

Controlling events involves managing default browser behaviors, halting event traversal through the DOM tree, and
optimizing execution performance. JavaScript provides explicit methods on the `Event` interface alongside binding flags
to regulate how events behave during runtime execution.

| Control Method / Flag                  | Primary Function                                  | Affects Event Propagation?                                 | Affects Browser Default Behavior?      |
|:---------------------------------------|:--------------------------------------------------|:-----------------------------------------------------------|:---------------------------------------|
| **`event.preventDefault()`**           | Suppresses default browser action                 | **No** (Event continues bubbling)                          | **Yes** (Native action is blocked)     |
| **`event.stopPropagation()`**          | Halts traversal through DOM ancestors             | **Yes** (Stops further capturing/bubbling)                 | **No** (Default behavior still runs)   |
| **`event.stopImmediatePropagation()`** | Halts DOM traversal and cancels sibling listeners | **Yes** (Stops DOM traversal AND remaining local handlers) | **No**                                 |
| **`passive: true`**                    | Declares handler will not call `preventDefault()` | **No**                                                     | **No** (Allows non-blocking scrolling) |

## Preventing Default Browser Actions (`preventDefault`)

Browsers execute native default behaviors for specific user interactions (e.g., submitting forms, navigating link URLs,
checking checkboxes). Calling `event.preventDefault()` prevents these built-in actions while allowing event propagation
to continue normally.

```javascript
// Intercepting form submission for AJAX handling
const form = document.querySelector('#login-form');

form.addEventListener('submit', (event) => {
    // Prevent browser page reload / HTTP post navigation
    event.preventDefault();

    // Custom asynchronous login execution
    performAsyncLogin();
});
```

### Checking Cancellability

Not all DOM events can have their default behavior suppressed. The read-only `event.cancelable` property indicates
whether `preventDefault()` will take effect.

```javascript
element.addEventListener('touchmove', (event) => {
    if (event.cancelable) {
        event.preventDefault(); // Successfully suppresses scrolling
    } else {
        console.warn('Event cannot be canceled in current context');
    }
});
```

## Halting Propagation (`stopPropagation` vs `stopImmediatePropagation`)

To manage event flow across nested components, use `stopPropagation()` or `stopImmediatePropagation()`.

```javascript
const parent = document.querySelector('.card');
const button = document.querySelector('.card-btn');

// Listener 1 on Button
button.addEventListener('click', (event) => {
    console.log('Button clicked - Handler 1');

    // Halts bubbling to parent, but Handler 2 on this same button STILL RUNS
    event.stopPropagation();
});

// Listener 2 on Button
button.addEventListener('click', (event) => {
    console.log('Button clicked - Handler 2');
});

// Parent Listener (WILL NOT FIRE due to stopPropagation)
parent.addEventListener('click', () => {
    console.log('Parent card clicked');
});
```

To prevent **sibling listeners** bound to the exact same element from executing, call `stopImmediatePropagation()`:

```javascript
button.addEventListener('click', (event) => {
    console.log('Critical security validation handler');

    if (isInvalid) {
        // Halts bubbling AND prevents any subsequent click listeners on 'button' from running
        event.stopImmediatePropagation();
    }
});
```

## Non-Blocking Scroll Optimization (`passive: true`)

By default, the browser engine delays smooth scroll thread rendering when `touchmove` or `wheel` events fire, waiting to
see if JavaScript calls `event.preventDefault()`. Marking a listener `{ passive: true }` informs the browser engine that
`preventDefault()` will never be called, offloading scroll animations to the compositor thread.

```javascript
// Optimized high-frequency scroll listener
window.addEventListener('wheel', handleScroll, {passive: true});

// Calling preventDefault inside a passive listener triggers a console warning
function handleScroll(event) {
    // event.preventDefault(); // Ignored; throws warning in strict environments
    updateScrollProgress();
}
```

## Use Cases

* **Single-Page Application Navigation:** Calling `event.preventDefault()` on `<a>` tags to intercept anchor navigation
  and route pages client-side.
* **Nested Interactive Controls:** Stopping propagation on action buttons embedded within clickable list items or card
  components.
* **High-Performance Touch/Scroll UI:** Using `{ passive: true }` on custom carousels or scroll containers to maintain
  steady frame rates.
* **Validation Control Chains:** Using `stopImmediatePropagation()` in early validation handlers to halt downstream
  processing when input criteria fail.

## Best Practices

* **Do Not Confuse `preventDefault()` and `stopPropagation()`:** Remember that `preventDefault()` halts browser native
  actions, while `stopPropagation()` halts DOM tree traversal—they operate independently.
* **Check `event.defaultPrevented`:** Inspect `event.defaultPrevented` in parent handlers to verify if a child element
  handler already canceled the default action.
* **Avoid Overusing `stopPropagation()`:** Halting event propagation indiscriminately can break global analytics
  tracking, dropdown auto-dismissal listeners, and accessibility tooling.
* **Default to `{ passive: true }` for Touch/Wheel Events:** Always pass `{ passive: true }` for non-canceling
  `touchstart`, `touchmove`, and `wheel` handlers to maintain compositor thread performance.
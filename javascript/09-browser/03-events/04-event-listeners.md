# Listening for Events

## Overview of Event Binding Mechanisms

Event binding connects JavaScript callback logic to state changes or user interactions on a given `EventTarget`. The DOM
specification offers three primary approaches to register event handlers, each with distinct trade-offs in flexibility,
memory management, and control over event flow.

| Binding Approach          | Syntax Pattern                                 | Multiple Handlers?                       | Supports Options (`once`, `passive`)?            | Security & Scope Context                                     |
|:--------------------------|:-----------------------------------------------|:-----------------------------------------|:-------------------------------------------------|:-------------------------------------------------------------|
| **`addEventListener()`**  | `target.addEventListener('type', fn, options)` | **Yes** (Executes in registration order) | **Yes** (`capture`, `passive`, `once`, `signal`) | Strict JavaScript scope; clean separation from markup        |
| **DOM Onevent Property**  | `target.onclick = fn`                          | **No** (Overwrites existing handler)     | **No**                                           | JavaScript object property assignment                        |
| **Inline HTML Attribute** | `<button onclick="fn()">`                      | **No**                                   | **No**                                           | Weak scope isolation; violates Content Security Policy (CSP) |

## The `addEventListener()` Method

`addEventListener()` is the modern standard for attaching event handlers to DOM nodes, `window`, or other event targets.

```javascript
const button = document.querySelector('#submit-btn');

function handleClick(event) {
    console.log('Button clicked!', event.target);
}

// Basic listener binding
button.addEventListener('click', handleClick);
```

### Signature

```typescript
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
```

* **`type`**: A case-sensitive string representing the target event type (e.g., `'click'`, `'keydown'`).
* **`listener`**: An event handler callback function or an object implementing the `EventListener` interface (
  `{ handleEvent(e) {} }`).
* **`options` / `useCapture`**: An options configuration object or a boolean indicating capture phase binding.

## Configuration Options (`AddEventListenerOptions`)

Passing an options object as the third argument allows precise control over listener execution mechanics. In touch and
scroll listeners (`touchstart`, `touchmove`, `wheel`), the browser engine must wait for the JavaScript handler to finish
executing to check if `e.preventDefault()` was called. Marking a listener `passive: true` allows instant main-thread
scrolling without waiting for JS execution.

```javascript
target.addEventListener('touchstart', handleTouch, {
    capture: false,
    passive: true,
    once: true,
    signal: abortController.signal
});
```

| Property      | Type          | Default     | Description / Impact                                                                                                                               |
|:--------------|:--------------|:------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| **`capture`** | `boolean`     | `false`     | When `true`, dispatches the listener during the **capturing phase** instead of the bubbling phase.                                                 |
| **`passive`** | `boolean`     | `false`     | When `true`, guarantees the handler will **never call `preventDefault()`**. Improves scroll performance by eliminating compositor thread blocking. |
| **`once`**    | `boolean`     | `false`     | Automatically unbinds and removes the listener after it executes a single time.                                                                    |
| **`signal`**  | `AbortSignal` | `undefined` | Associates the listener with an `AbortSignal`, allowing instant cleanup via `abortController.abort()`.                                             |

## Using the `handleEvent()` Interface

In addition to standard functions, `addEventListener()` accepts objects that implement the `handleEvent` method. This
pattern preserves instance context without needing manual `.bind(this)` closures.

```javascript
class ToggleComponent {
    constructor(element) {
        this.element = element;
        this.isOpen = false;

        // Passes object instance directly as event listener
        this.element.addEventListener('click', this);
    }

    handleEvent(event) {
        switch (event.type) {
            case 'click':
                this.toggle();
                break;
        }
    }

    toggle() {
        this.isOpen = !this.isOpen;
        console.log('Component open state:', this.isOpen);
    }
}

const component = new ToggleComponent(document.querySelector('.accordion'));
```

## Use Cases

* **Non-Blocking Touch/Scroll Handlers:** Using `{ passive: true }` on window scroll and touch move interactions to
  maintain steady 60–120 FPS animations.
* **One-Time Event Execution:** Utilizing `{ once: true }` for clean-up or initialization triggers like `transitionend`
  or modal opening actions.
* **Declarative Listener Lifecycles:** Passing an `AbortSignal` to dismantle group event bindings simultaneously when
  unmounting UI components.
* **Class-Based UI Modules:** Utilizing `handleEvent()` to handle events inside component classes while preserving
  instance `this` bindings natively.

## Best Practices

* **Always Use `addEventListener()` Over Onevent Properties:** Avoid `element.onclick = fn` to prevent accidental
  handler overwrites and maintain multiple listener capability.
* **Never Use Inline HTML Handlers:** Avoid inline attributes like `onclick=""`; they break Content Security Policies (
  CSP) and tightly couple markup to business logic.
* **Mark Scroll and Touch Listeners as `passive`:** Always specify `{ passive: true }` on high-frequency `touchmove`,
  `touchstart`, or `wheel` handlers unless explicitly preventing default scroll behavior.
* **Use `{ once: true }` Instead of Manual Removal:** Prefer the `{ once: true }` option over manually executing
  `removeEventListener()` inside a single-use handler callback.
* **Pass Named Functions When Manual Removal is Required:** Avoid passing anonymous inline arrow functions if you intend
  to remove the exact listener later using `removeEventListener()`.
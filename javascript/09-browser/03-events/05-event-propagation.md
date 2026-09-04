# DOM Event Propagation

## Overview of Event Propagation

Event propagation describes the mechanism by which an event travels through the DOM tree when an interaction occurs.
Rather than firing strictly on the single target element, the event traverses down from the top of the document
hierarchy and then propagates back up.

| Phase                  | `eventPhase` Value            | Propagation Direction         | Behavior & Default Listener State                                |
|:-----------------------|:------------------------------|:------------------------------|:-----------------------------------------------------------------|
| **1. Capturing Phase** | `Event.CAPTURING_PHASE` (`1`) | Top-down (`Window` → Target)  | Triggers listeners registered with `{ capture: true }`           |
| **2. Target Phase**    | `Event.AT_TARGET` (`2`)       | At Target Element             | Triggers all listeners registered on the target element itself   |
| **3. Bubbling Phase**  | `Event.BUBBLING_PHASE` (`3`)  | Bottom-up (Target → `Window`) | Triggers standard listeners registered with `{ capture: false }` |

## Phase Breakdown

### 1. Capturing Phase (Trickling)

When an event occurs, the browser starts at the outermost root (`Window`) and travels downward through every ancestor
node until it reaches the target's direct parent. By default, standard listeners (`addEventListener('type', fn)`) ignore
this phase unless explicitly configured.

```javascript
// Listens during the Capturing Phase
parentElement.addEventListener('click', (e) => {
    console.log('Capture phase handler on parent');
}, {capture: true});
```

### 2. Target Phase

The event reaches the node where the interaction actually occurred (`event.target`). Listeners attached directly to the
target run during this phase, regardless of whether they were set to capture or bubble.

### 3. Bubbling Phase

After the target phase finishes, the event reverses direction and travels back up the DOM tree through every ancestor
node all the way to `document` and `Window`. Most user interface events (such as `click`, `keydown`, `input`) bubble by
default.

```javascript
// Listens during the Bubbling Phase (default behavior)
parentElement.addEventListener('click', (e) => {
    console.log('Bubbling phase handler on parent');
});
```

## Non-Bubbling Events

While most user interaction events bubble, certain UI and focus events do not traverse upward during Phase 3.

| Category             | Events that DO NOT Bubble                           | Bubbling Counterparts   |
|:---------------------|:----------------------------------------------------|:------------------------|
| **Focus**            | `focus`, `blur`                                     | `focusin`, `focusout`   |
| **Mouse / Pointer**  | `mouseenter`, `mouseleave`                          | `mouseover`, `mouseout` |
| **Media / Resource** | `load`, `unload`, `abort`, `error`, `play`, `pause` | N/A                     |
| **Layout / Scroll**  | `resize`, `scroll` (on elements)                    | N/A                     |

```javascript
const form = document.querySelector('form');

// 'focus' does NOT bubble, so this won't catch child input focus events
form.addEventListener('focus', handleFocus);

// 'focusin' DOES bubble, allowing event delegation on the container
form.addEventListener('focusin', handleFocus); 
```

## Controlling Propagation

The `Event` object provides methods to halt or modify event traversal.

```javascript
childElement.addEventListener('click', (event) => {
    // Prevents the event from traveling to ancestor nodes
    event.stopPropagation();
});

childElement.addEventListener('click', (event) => {
    // Prevents bubbling AND stops remaining handlers on THIS element from running
    event.stopImmediatePropagation();
});
```

| Method                                 | Effect on Current Element's Handlers              | Effect on Ancestor Handlers                       |
|:---------------------------------------|:--------------------------------------------------|:--------------------------------------------------|
| **`event.stopPropagation()`**          | Runs normally                                     | **Blocked** (Halts further capturing or bubbling) |
| **`event.stopImmediatePropagation()`** | **Blocked** (Cancels remaining sibling listeners) | **Blocked**                                       |

## Use Cases

* **Event Delegation:** Attaching a single event listener to a parent container to manage events triggered by any
  current or dynamically added child nodes.
* **Global Interception (Capturing):** Registering a capture-phase listener on `window` to intercept and log or block
  specific interactions before child component handlers run.
* **Modal Overlay Isolation:** Using `event.stopPropagation()` on a modal dialog's inner content container to prevent
  clicks inside the modal from bubbling up and closing the backdrop.

## Best Practices

* **Default to Bubbling:** Use standard bubbling listeners unless you specifically need to intercept events before child
  handlers execute.
* **Use `stopPropagation()` Sparingly:** Halting propagation can break global analytics tracking, global document click
  listeners (like dropdown auto-closers), and third-party UI components.
* **Leverage `focusin` / `focusout` for Delegation:** Use `focusin` instead of `focus` when you need focus events to
  bubble up to a parent container.
* **Check `event.eventPhase` During Debugging:** Inspect `event.eventPhase` (`1`, `2`, or `3`) when debugging complex
  nested listener behavior to verify when and where a handler is executing.
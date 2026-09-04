# Event Delegation

## Overview of Event Delegation

Event Delegation is a performance optimization pattern that leverages **event bubbling** to manage handlers efficiently.
Instead of attaching individual event listeners to multiple child elements, a single listener is bound to a common
parent container. When an interaction occurs on any child element, the event bubbles up to the parent, where
`event.target` is inspected to handle the action.

| Approach                          | Memory Overhead                               | Handling Dynamic Elements                                                       | Maintenance Complexity                                               |
|:----------------------------------|:----------------------------------------------|:--------------------------------------------------------------------------------|:---------------------------------------------------------------------|
| **Direct Binding** (N Listeners)  | **High** (O(N) listeners allocated in memory) | **Manual:** Requires binding new listeners on every element creation            | **High:** Requires cleaning up listeners when elements are destroyed |
| **Event Delegation** (1 Listener) | **Low** (O(1) listener allocated)             | **Automatic:** New dynamic children are handled automatically without rebinding | **Low:** Single cleanup point on parent removal                      |

## Basic Delegation with `.matches()` and `.closest()`

When an event fires on a complex child node (e.g., clicking an `<i>` icon or `<span>` text inside a `<button>`),
`event.target` refers to the exact inner node clicked. To ensure you match the intended boundary container, use
`Element.prototype.closest()`.

```javascript
const tableBody = document.querySelector('#users-table tbody');

tableBody.addEventListener('click', (event) => {
    // Find the nearest ancestor matching the action selector
    const deleteBtn = event.target.closest('.delete-btn');

    // If the click didn't happen inside a delete button, exit
    if (!deleteBtn || !tableBody.contains(deleteBtn)) return;

    // Extract data attributes from the element
    const userId = deleteBtn.dataset.userId;
    deleteUser(userId);
});
```

### Delegation Selector Matching Comparison

| Method                             | Behavior                                                                   | Handles Child Sub-Elements?                                   |
|:-----------------------------------|:---------------------------------------------------------------------------|:--------------------------------------------------------------|
| **`event.target.matches('.btn')`** | Checks if the exact clicked element matches the selector                   | **No** (Fails if clicking an `<i>` or `<span>` inside `.btn`) |
| **`event.target.closest('.btn')`** | Traverses upward from `event.target` to find the nearest matching ancestor | **Yes** (Traverses up to locate `.btn`)                       |

## Declarative Action Routing (Data Attributes)

A powerful implementation of event delegation is the **action router pattern**, which maps UI interactions to methods
via `data-*` attributes without requiring custom CSS selectors for every element.

```html

<div id="toolbar">
    <button data-action="save">Save Document</button>
    <button data-action="print">Print Document</button>
    <button data-action="delete" class="danger">Delete</button>
</div>
```

```javascript
const toolbar = document.querySelector('#toolbar');

// Action mapping table
const actions = {
    save() {
        console.log('Saving...');
    },
    print() {
        window.print();
    },
    delete() {
        console.log('Deleting...');
    }
};

toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button || !toolbar.contains(button)) return;

    const actionName = button.dataset.action;
    if (typeof actions[actionName] === 'function') {
        actions[actionName]();
    }
});
```

## Handling Non-Bubbling Events in Delegation

Certain events—like `focus` and `blur`—do not bubble up the DOM tree by default. To delegate non-bubbling events, use
their bubbling counterparts (`focusin`, `focusout`) or capture-phase listeners (`{ capture: true }`).

```javascript
const formContainer = document.querySelector('#dynamic-form');

// 'focus' does NOT bubble, but 'focusin' DOES
formContainer.addEventListener('focusin', (event) => {
    if (event.target.matches('input, select, textarea')) {
        event.target.classList.add('active-field');
    }
});

formContainer.addEventListener('focusout', (event) => {
    if (event.target.matches('input, select, textarea')) {
        event.target.classList.remove('active-field');
    }
});
```

## Use Cases

* **Dynamic Data Lists/Tables:** Handling item deletion, editing, or selection in lists, tables, or infinite feeds where
  rows are constantly added or removed.
* **Component Toolbars and Menus:** Routing button clicks across toolbars, context menus, or tab navigation bars using
  single container listeners.
* **Global Hotkey & Click Routing:** Intercepting interactions on `document.body` for global popover dismissals or modal
  backdrop clicks.

## Best Practices

* **Always Use `.closest()` Over Direct `event.target` Checks:** Prevent broken clicks on nested child elements (
  `<span>`, `svg`, `path`) by using `event.target.closest(selector)`.
* **Verify Parent Bounds with `container.contains()`:** Always ensure `container.contains(matchedElement)` returns true
  so `.closest()` doesn't traverse outside your container boundary.
* **Use `focusin`/`focusout` for Focus Delegation:** Substitute non-bubbling `focus` and `blur` events with `focusin`
  and `focusout` when delegating focus management.
* **Avoid Delegation for Ultra-High-Frequency Events:** Avoid delegating continuous events like `pointermove` or
  `scroll` to `document.body` without throttling or using `{ passive: true }`.
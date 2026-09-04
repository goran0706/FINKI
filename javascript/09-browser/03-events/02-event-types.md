# DOM Event Types

## Overview of Event Categories

Browser engines emit dozens of standardized events representing specific interaction categories and document lifecycle
states. Each event type maps to a concrete interface extending the base `Event` object, providing context-specific
properties and behaviors.

| Event Category        | Primary Events                                    | Specific Event Interface               | Bubbles?                                            |
|:----------------------|:--------------------------------------------------|:---------------------------------------|:----------------------------------------------------|
| **Mouse / Pointer**   | `click`, `dblclick`, `pointerdown`, `pointermove` | `MouseEvent` / `PointerEvent`          | Yes                                                 |
| **Keyboard**          | `keydown`, `keyup`, `keypress` (deprecated)       | `KeyboardEvent`                        | Yes                                                 |
| **Form / Input**      | `submit`, `input`, `change`, `reset`              | `SubmitEvent` / `InputEvent` / `Event` | Varies (`input`: Yes, `change`: Yes, `submit`: Yes) |
| **Focus**             | `focus`, `blur`, `focusin`, `focusout`            | `FocusEvent`                           | `focus`/`blur`: No, `focusin`/`focusout`: Yes       |
| **Document / Window** | `DOMContentLoaded`, `load`, `resize`, `scroll`    | `Event` / `UIEvent`                    | No (on `window`/`document` root)                    |
| **Clipboard**         | `copy`, `cut`, `paste`                            | `ClipboardEvent`                       | Yes                                                 |

## Mouse and Pointer Events

Modern web applications use Pointer Events (`PointerEvent`), which unify mouse, touch, and stylus interactions into a
single cross-device API.

```javascript
const box = document.querySelector('.interactive-box');

// Preferred: Unified pointer interaction handling
box.addEventListener('pointerdown', (e) => {
    console.log(`Pointer ID: ${e.pointerId}`);
    console.log(`Input type: ${e.pointerType}`); // 'mouse', 'touch', or 'pen'
    console.log(`Position: X=${e.clientX}, Y=${e.clientY}`);
});
```

### Event Sequence Comparison

| Action Phase        | Mouse Event Sequence | Pointer Event Sequence | Touch Equivalent |
|:--------------------|:---------------------|:-----------------------|:-----------------|
| **Press Down**      | `mousedown`          | `pointerdown`          | `touchstart`     |
| **Movement**        | `mousemove`          | `pointermove`          | `touchmove`      |
| **Release**         | `mouseup`            | `pointerup`            | `touchend`       |
| **Full Activation** | `click`              | `click`                | `click`          |

## Keyboard Events

Keyboard events track physical key state changes across `KeyboardEvent` objects.

```javascript
document.addEventListener('keydown', (e) => {
    // e.key: Logical printed value ('a', 'Enter', 'Shift')
    // e.code: Physical key layout position ('KeyA', 'Enter', 'ShiftLeft')

    if (e.key === 'Escape') {
        closeModal();
    }

    if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault(); // Intercept browser save hotkey
        saveDocument();
    }
});
```

| Property       | Value Purpose                          | Example (`Shift` + `a`) |
|:---------------|:---------------------------------------|:------------------------|
| **`e.key`**    | User-intended character / logical key  | `'A'`                   |
| **`e.code`**   | Physical hardware key layout location  | `'KeyA'`                |
| **`e.repeat`** | Boolean indicating if key is held down | `true` (on auto-repeat) |

## Form and Focus Events

Form and focus events track data input, focus traversal, and form submission states.

```javascript
const searchInput = document.querySelector('#search');

// Fires synchronously on EVERY character alteration
searchInput.addEventListener('input', (e) => {
    console.log('Current value:', e.target.value);
});

// Fires when value changes AND field loses focus (or commit via Enter)
searchInput.addEventListener('change', (e) => {
    console.log('Committed value:', e.target.value);
});
```

### Focus Event Traversal Differences

| Event          | Bubbles? | Trigger Context                            |
|:---------------|:---------|:-------------------------------------------|
| **`focus`**    | **No**   | Element receives focus                     |
| **`blur`**     | **No**   | Element loses focus                        |
| **`focusin`**  | **Yes**  | Element (or any descendant) receives focus |
| **`focusout`** | **Yes**  | Element (or any descendant) loses focus    |

## Document and Resource Lifecycle Events

Document loading events track HTML parsing, asset fetching, and page unload lifecycles.

```javascript
// 1. DOM tree is parsed and ready (Sub-resources like images may still be loading)
document.addEventListener('DOMContentLoaded', () => {
    initUIComponent();
});

// 2. Entire page (HTML, CSS, Images, Frames) fully loaded
window.addEventListener('load', () => {
    hideLoadingSpinner();
});
```

## Use Cases

* **Cross-Input Drag & Drop:** Using `pointerdown`, `pointermove`, and `pointerup` for seamless desktop and mobile touch
  gestures.
* **Hotkeys and Shortcuts:** Intercepting key combinations via `keydown` using `e.code` for deterministic key matching
  across keyboard layouts.
* **Instant Search Filtering:** Using `input` on text fields for real-time query updates instead of waiting for
  `change`.
* **Focus Containment (Focus Trap):** Listening for `focusin` on modal overlays to contain keyboard navigation inside
  accessible dialogs.

## Best Practices

* **Prefer `PointerEvent` over `MouseEvent`/`TouchEvent`:** Use pointer events to automatically handle mouse, stylus,
  and touch inputs through a single code path.
* **Use `e.key` for Characters, `e.code` for Hotkeys:** Use `e.key` when reading string values and `e.code` when
  checking physical shortcuts (e.g., WASD gaming controls).
* **Differentiate `input` and `change`:** Use `input` for immediate validation/search feedback and `change` for heavy
  operations fired after field blur.
* **Use `focusin`/`focusout` for Delegation:** Prefer `focusin` and `focusout` when delegating focus events on parent
  container elements, as standard `focus` and `blur` do not bubble.
* **Avoid `keypress`:** The `keypress` event is deprecated; use `keydown` for reading key inputs across all modern
  browsers.
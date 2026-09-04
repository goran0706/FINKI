# DOM Styling and CSS Manipulation

## Overview of DOM Styling APIs

Dynamic styling allows JavaScript to manipulate element visual presentations in real time. The browser provides three
primary mechanisms to inspect and modify styles programmatically: direct class management via `classList`, inline style
manipulation through `element.style`, and computed style inspection using `window.getComputedStyle()`. Choosing the
appropriate API depends on whether you are managing component state variations, setting dynamic runtime values (such as
coordinates), or inspecting final visual properties.

| Mechanism                | Target Scope                                    | Read/Write Access | Specificity Impact                                    |
|:-------------------------|:------------------------------------------------|:------------------|:------------------------------------------------------|
| **`classList`**          | CSS class names on HTML `class` attribute       | Read/Write        | Follows standard CSS cascade rules                    |
| **`element.style`**      | Local inline style attribute (`style="..."`)    | Read/Write        | High specificity (Overrides CSS stylesheet rules)     |
| **`getComputedStyle()`** | Final calculated CSS values on rendered element | Read-Only         | Evaluates resolved cascade values (Pixels, RGB, etc.) |

## Managing Classes (`element.classList`)

The `classList` property exposes a live `DOMTokenList` representing the element's CSS classes. It provides convenient
helper methods to manipulate classes without manual string concatenation on `element.className`. Manipulating classes
via `classList` separates styling definitions in CSS from application logic in JavaScript.

| Method           | Parameters                             | Return Value | Operational Mechanics                                 |
|:-----------------|:---------------------------------------|:-------------|:------------------------------------------------------|
| **`add()`**      | One or more class strings              | `undefined`  | Adds classes to the element if not already present    |
| **`remove()`**   | One or more class strings              | `undefined`  | Removes specified classes from the element            |
| **`toggle()`**   | Class string, optional boolean `force` | `boolean`    | Flips class presence or forces state based on boolean |
| **`contains()`** | Class string                           | `boolean`    | Evaluates whether the element possesses the class     |
| **`replace()`**  | `oldClass`, `newClass`                 | `boolean`    | Replaces an existing class with a new class           |

```javascript
const card = document.querySelector('.card-component');

// Adding and removing classes safely
card.classList.add('active', 'elevated');
card.classList.remove('hidden');

// Toggling class state based on a conditional boolean
const isExpanded = card.classList.toggle('is-expanded', userSettings.expandAll);

// Checking class existence
if (card.classList.contains('active')) {
    console.log('Card is currently active.');
}
```

## Inline Style Manipulation (`element.style` & `cssText`)

The `element.style` property exposes a `CSSStyleDeclaration` object representing the element's inline `style` attribute.
Multi-word CSS properties are written in **camelCase** identifiers in JavaScript. The `element.style` property reads *
*only** inline styles set directly on the element tag or via JavaScript—it cannot read styles defined in external CSS
stylesheets.

| CSS Property Name      | JS `element.style` Identifier | Example Value Assignment                    |
|:-----------------------|:------------------------------|:--------------------------------------------|
| **`background-color`** | `backgroundColor`             | `element.style.backgroundColor = '#f3f4f6'` |
| **`font-size`**        | `fontSize`                    | `element.style.fontSize = '16px'`           |
| **`z-index`**          | `zIndex`                      | `element.style.zIndex = '1000'`             |
| **`display`**          | `display`                     | `element.style.display = 'none'`            |

```javascript
const box = document.querySelector('.box');

// Applying individual inline styles
box.style.backgroundColor = 'royalblue';
box.style.marginTop = '20px';

// Setting multiple inline styles simultaneously via cssText
box.style.cssText = 'background-color: royalblue; margin-top: 20px; display: block;';

// Removing an inline style property
box.style.removeProperty('margin-top');
```

## Inspecting Final Styles (`window.getComputedStyle()`)

To read the actual rendered style values calculated by the browser's CSS cascading engine, use
`window.getComputedStyle(element)`. Reading computed styles triggers the browser to update layout calculations if
pending DOM writes exist, which can cause layout thrashing if called repeatedly inside loops.

| Property / Feature     | `element.style`                                         | `window.getComputedStyle(element)`                                |
|:-----------------------|:--------------------------------------------------------|:------------------------------------------------------------------|
| **Source**             | Inline `style` attribute only                           | Entire CSS cascade (External sheets, `<style>` tags, inline)      |
| **Read/Write State**   | Read / Write                                            | Read-Only                                                         |
| **Unit Normalization** | Returns exact assigned string (e.g., `'2rem'`, `'50%'`) | Resolves to explicit calculated units (e.g., `'32px'`, `'400px'`) |

```javascript
const button = document.querySelector('.submit-btn');

// Fetching resolved computed styles
const computed = window.getComputedStyle(button);

console.log(computed.getPropertyValue('background-color')); // e.g., "rgb(37, 99, 235)"
console.log(computed.width); // e.g., "120.5px" (Resolved pixel size)

// Inspecting pseudo-elements
const beforeStyles = window.getComputedStyle(button, '::before');
console.log(beforeStyles.content);
```

## CSS Custom Properties (Variables)

JavaScript can read and modify CSS Custom Properties (`var(--property-name)`) on individual elements or globally on the
root document node (`:root`). Dynamically updating CSS custom properties allows application-wide theme switching without
modifying individual element properties.

```javascript
const root = document.documentElement; // <html> root node

// Reading a CSS variable
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-theme').trim();

// Modifying a CSS variable globally
root.style.setProperty('--primary-theme', '#10b981');
```

## Use Cases

* **State-Driven Class Toggling:** Switching UI component states (e.g., active tabs, open modals, or drawer navigation)
  using `classList.toggle()`.
* **Dynamic Coordinate Positioning:** Updating exact inline `left`, `top`, or `transform` positions during drag-and-drop
  interactions or dynamic canvas rendering.
* **Global Theme Switching:** Toggling CSS variables on `document.documentElement` to switch between dark and light
  color modes.
* **Reading Rendered Dimensions:** Measuring actual element width, height, or computed background colors before
  performing alignment logic.

## Best Practices

* **Prefer `classList` Over Inline `style`:** Manage visual styling using predefined CSS classes in stylesheets rather
  than assigning hardcoded styles via `element.style`.
* **Use `element.style` for Dynamic Runtime Values:** Reserve `element.style` for properties calculated at runtime that
  cannot be predicted in static CSS (such as mouse coordinates or progress percentages).
* **Always Include Units in Inline Styles:** Always attach unit strings (e.g., `'20px'` or `'50%'`) when setting length
  properties; assigning pure numbers (e.g., `style.width = 100`) fails silently in modern browsers.
* **Batch Style Reads and Writes:** Separate reading computed styles (`getComputedStyle`) from writing styles (
  `element.style`) to avoid layout thrashing and unnecessary browser reflows.
* **Use `setProperty()` for CSS Variables:** Set custom properties using
  `element.style.setProperty('--var-name', value)` rather than direct property access.
* **Remember `getComputedStyle` is Read-Only:** Do not attempt to assign values to properties returned by
  `getComputedStyle()`; update inline styles or class names instead.
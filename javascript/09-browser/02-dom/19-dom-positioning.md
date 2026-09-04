# DOM Positioning and Coordinates

## Overview of DOM Positioning

Positioning in the DOM involves both CSS layout rules (how elements align relative to their document container) and
JavaScript Coordinate Systems (how locations are calculated on screen). Understanding the interplay between CSS layout
positioning (`position: absolute`, `relative`, `fixed`, `sticky`) and JavaScript APIs (`getBoundingClientRect()`,
`elementFromPoint()`, event coordinates) is essential for positioning popovers, dropdowns, tooltips, and canvas
overlays.

## CSS Positioning Modes in the DOM

CSS controls an element's placement in the document flow via the `position` property.

| Positioning Mode | In Normal Flow?                   | Containing Block Anchor                              | Effect of `top`, `bottom`, `left`, `right`                      |
|:-----------------|:----------------------------------|:-----------------------------------------------------|:----------------------------------------------------------------|
| **`static`**     | **Yes**                           | Parent element                                       | Ineffective (ignored)                                           |
| **`relative`**   | **Yes** (reserves original space) | Self (original layout box position)                  | Offsets element visually without affecting surrounding layout   |
| **`absolute`**   | **No** (removed from flow)        | Nearest positioned ancestor (`position` != `static`) | Positions relative to parent padding edge                       |
| **`fixed`**      | **No** (removed from flow)        | Viewport boundary (or transformed container)         | Anchors relative to window frame during scrolling               |
| **`sticky`**     | **Yes** (hybrid behavior)         | Nearest scrolling ancestor                           | Behaves as `relative` until threshold, then sticks like `fixed` |

## Coordinate Systems in DOM JavaScript

When measuring element locations or handling pointer events (mouse/touch), JavaScript operates across three distinct
coordinate space frames.

| Coordinate Frame      | Event API / Method                                            | Reference Origin (0,0)                         | Scroll Sensitive?                                            |
|:----------------------|:--------------------------------------------------------------|:-----------------------------------------------|:-------------------------------------------------------------|
| **Viewport (Client)** | `event.clientX`, `event.clientY`<br>`getBoundingClientRect()` | Top-left corner of current browser viewport    | **No** (Coordinates change when page scrolls)                |
| **Page (Document)**   | `event.pageX`, `event.pageY`                                  | Top-left corner of the full HTML document      | **Yes** (Coordinates remain fixed relative to document root) |
| **Screen**            | `event.screenX`, `event.screenY`                              | Top-left corner of the physical monitor screen | **No** (Relative to monitor resolution boundaries)           |

## Converting Viewport Coordinates to Page Coordinates

To position an absolute overlay element based on viewport measurements returned by `getBoundingClientRect()` or
`clientX/clientY`, convert viewport coordinates into page-relative coordinates by adding global scroll offsets.

```javascript
function getAbsolutePageCoordinates(element) {
    const rect = element.getBoundingClientRect();

    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
    };
}

// Example: Positioning an absolute tooltip directly over a target button
const button = document.querySelector('#submit-btn');
const tooltip = document.querySelector('#tooltip');

const pos = getAbsolutePageCoordinates(button);

// Place tooltip directly above the button
tooltip.style.position = 'absolute';
tooltip.style.top = `${pos.top - tooltip.offsetHeight - 8}px`;
tooltip.style.left = `${pos.left + (pos.width / 2) - (tooltip.offsetWidth / 2)}px`;
```

## Determining Element at Specific Coordinates

The DOM provides `document.elementFromPoint(x, y)` and `document.elementsFromPoint(x, y)` to locate elements residing
under specific **viewport** coordinates.

```javascript
// Finds the topmost element at viewport location (x: 150, y: 300)
const topElement = document.elementFromPoint(150, 300);

// Finds ALL stacked elements under the coordinate (e.g., overlays, modals, backdrops)
const elementStack = document.elementsFromPoint(150, 300);
console.log('Stacked elements:', elementStack);
```

> **Note:** `elementFromPoint()` expects **viewport (Client)** coordinates, not page coordinates. Always pass
`clientX` / `clientY` values or subtract scroll offsets before calling this method.

## Use Cases

* **Floating Tooltip and Popover Placement:** Calculating bounds using `getBoundingClientRect()` to render context menus
  or tooltips above/below target triggers.
* **Custom Drag-and-Drop Engines:** Calculating pointer movement deltas via `event.clientX` and updating inline
  `transform: translate3d(x, y, 0)` styles.
* **Canvas and SVG Event Mapping:** Translating click locations on page layout down to local `<canvas>` pixel
  coordinates via `event.clientX - rect.left`.
* **Collision Detection:** Checking if two DOM rect bounding boxes overlap using viewport coordinates.

## Best Practices

* **Prefer CSS `transform` Over Direct Positioning Properties:** Animate or update positions using
  `transform: translate3d(x, y, 0)` rather than altering `top` and `left` inline properties to prevent triggering
  expensive browser layout reflows.
* **Remember Viewport vs. Page Differences:** Pass viewport coordinates (`clientX`/`clientY`) to
  `getBoundingClientRect()` or `elementFromPoint()`, and use page coordinates (`pageX`/`pageY`) for statically
  positioned absolute document overlays.
* **Account for Transform Ancestors with `position: fixed`:** Be aware that applying `transform`, `perspective`, or
  `filter` properties to a parent element causes `position: fixed` children to anchor relative to *that ancestor*
  instead of the global viewport.
* **Use `Popover API` or Modern Positioning Engines for Edge Auto-Flipping:** Use the native browser `popover` API or
  libraries like Floating UI when building popups that need automatic boundary collision handling and viewport edge
  detection.
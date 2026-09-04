# DOM Layout and Dimensions

## Overview of Layout Metrics APIs

Measuring elements in the DOM requires understanding how the browser calculates layout bounds, padding, borders,
margins, scrollable areas, and viewport offsets. JavaScript provides three primary metric groups (`offset*`, `client*`,
and `scroll*`), alongside precise geometric APIs like `getBoundingClientRect()`. Choosing the right property depends on
whether you need visual layout size, inner content dimensions, scroll offsets, or sub-pixel viewport coordinates.

| Metric Group     | Content Included                               | Excludes                    | Key Metric Properties                                    |
|:-----------------|:-----------------------------------------------|:----------------------------|:---------------------------------------------------------|
| **`offset*`**    | Content + Padding + Border + Scrollbars        | Margin                      | `offsetWidth`, `offsetHeight`, `offsetTop`, `offsetLeft` |
| **`client*`**    | Content + Padding                              | Border, Margin, Scrollbars  | `clientWidth`, `clientHeight`, `clientTop`, `clientLeft` |
| **`scroll*`**    | Total Content Area (including hidden overflow) | Border, Margin              | `scrollWidth`, `scrollHeight`, `scrollTop`, `scrollLeft` |
| **Bounding Box** | Precise visual bounds relative to Viewport     | Transforms/Scaling included | `getBoundingClientRect()` (`width`, `height`, `x`, `y`)  |

## Offset Metrics (`offsetWidth`, `offsetHeight`, `offsetParent`)

Offset properties measure the visual space an element occupies on screen, including its content box, padding, borders,
and vertical/horizontal scrollbars if present. All `offset*` properties return **rounded integers**.

| Property           | Calculation Formula                              | Description                                                        |
|:-------------------|:-------------------------------------------------|:-------------------------------------------------------------------|
| **`offsetWidth`**  | `Content Width + Padding + Borders + Scrollbar`  | Total layout width of the element box                              |
| **`offsetHeight`** | `Content Height + Padding + Borders + Scrollbar` | Total layout height of the element box                             |
| **`offsetTop`**    | Distance from top border to `offsetParent`       | Vertical distance to nearest positioned ancestor                   |
| **`offsetLeft`**   | Distance from left border to `offsetParent`      | Horizontal distance to nearest positioned ancestor                 |
| **`offsetParent`** | Nearest CSS-positioned parent element            | Nearest ancestor with `position: relative`, `absolute`, or `fixed` |

```javascript
const box = document.querySelector('.card-container');

// Visual size including padding and borders
console.log('Visual Width:', box.offsetWidth);
console.log('Visual Height:', box.offsetHeight);

// Distance relative to nearest positioned ancestor
console.log('Top Offset:', box.offsetTop);
console.log('Positioned Parent:', box.offsetParent);
```

## Client Metrics (`clientWidth`, `clientHeight`, `clientTop`)

Client properties measure the inner dimensions of an element, representing the space available for child content.

| Property           | Calculation Formula                           | Operational Notes                                     |
|:-------------------|:----------------------------------------------|:------------------------------------------------------|
| **`clientWidth`**  | `Content Width + Padding - Scrollbar Width`   | Inner visible content width                           |
| **`clientHeight`** | `Content Height + Padding - Scrollbar Height` | Inner visible content height                          |
| **`clientTop`**    | Width of top border                           | Distance from outer top border to inner padding edge  |
| **`clientLeft`**   | Width of left border                          | Distance from outer left border to inner padding edge |

```javascript
const panel = document.querySelector('.scrollable-panel');

// Inner usable area for content (excluding border and scrollbar)
console.log('Inner Width:', panel.clientWidth);
console.log('Inner Height:', panel.clientHeight);

// Border thickness measurements
console.log('Top Border Width:', panel.clientTop);
console.log('Left Border Width:', panel.clientLeft);
```

## Scroll Metrics (`scrollWidth`, `scrollHeight`, `scrollTop`)

Scroll properties track the total dimensions of an element's scrollable content—including parts hidden outside the
visible overflow container—as well as current scroll offsets. Modifying `scrollTop` or `scrollLeft` instantly scrolls
the element to the specified pixel offset.

| Property           | Access Mode      | Operational Mechanics                                    |
|:-------------------|:-----------------|:---------------------------------------------------------|
| **`scrollWidth`**  | Read-Only        | Total width of entire content area (visible + overflow)  |
| **`scrollHeight`** | Read-Only        | Total height of entire content area (visible + overflow) |
| **`scrollTop`**    | **Read / Write** | Number of pixels scrolled vertically from top edge       |
| **`scrollLeft`**   | **Read / Write** | Number of pixels scrolled horizontally from left edge    |

```javascript
const container = document.querySelector('.modal-body');

// Total scrollable content height
console.log('Total Scroll Height:', container.scrollHeight);

// Programmatically scrolling to top or checking scroll position
console.log('Current Scroll Position:', container.scrollTop);

// Scroll to top
container.scrollTop = 0;

// Check if user reached bottom of container
const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
```

## Exact Viewport Metrics (`getBoundingClientRect()`)

The `element.getBoundingClientRect()` method returns a `DOMRect` object containing the exact size of an element and its
position relative to the current **viewport**. Unlike `offsetWidth` and `clientHeight`, `getBoundingClientRect()`
returns **floating-point numbers** and reflects CSS transforms (such as `transform: scale(1.5)`).

| `DOMRect` Property | Reference Anchor                         | Accounting for Transforms          |
|:-------------------|:-----------------------------------------|:-----------------------------------|
| **`x` / `left`**   | Viewport left edge to element left edge  | Yes (Reflects CSS scale/rotate)    |
| **`y` / `top`**    | Viewport top edge to element top edge    | Yes (Reflects CSS scale/rotate)    |
| **`right`**        | Viewport left edge to element right edge | Yes                                |
| **`bottom`**       | Viewport top edge to element bottom edge | Yes                                |
| **`width`**        | Total bounding box width                 | Yes (Includes sub-pixel fractions) |
| **`height`**       | Total bounding box height                | Yes (Includes sub-pixel fractions) |

```javascript
const target = document.querySelector('.target-element');
const rect = target.getBoundingClientRect();

console.log('X Position relative to Viewport:', rect.left);
console.log('Y Position relative to Viewport:', rect.top);

// Calculating absolute page position (including window scroll)
const absoluteTop = rect.top + window.scrollY;
const absoluteLeft = rect.left + window.scrollX;
```

## Window and Viewport Dimensions

To measure the overall browser window or document dimensions, query the `window` object or the document root (
`document.documentElement`).

```javascript
// Viewport dimensions (excluding browser chrome, including scrollbars)
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

// Entire page content dimensions
const pageHeight = document.documentElement.scrollHeight;
const pageWidth = document.documentElement.scrollWidth;

// Current global scroll offset
const scrollY = window.scrollY; // or window.pageYOffset
```

## Use Cases

* **Scroll Tracking and Infinite Feeds:** Comparing `scrollHeight - scrollTop === clientHeight` to detect when a user
  has scrolled to the bottom of a container to fetch more items.
* **Tooltip and Popover Positioning:** Using `getBoundingClientRect()` to calculate floating menu position relative to
  the target element without clipping viewport boundaries.
* **Custom Scroll Progress Indicators:** Calculating scroll percentage using
  `(scrollTop / (scrollHeight - clientHeight)) * 100`.
* **Sticky Navigation Locks:** Comparing `window.scrollY` against an element's `offsetTop` to toggle fixed CSS header
  positioning.

## Best Practices

* **Prefer `getBoundingClientRect()` for Sub-Pixel Precision:** Use `getBoundingClientRect()` when accurate
  floating-point geometry or CSS transform support is required.
* **Avoid Layout Thrashing:** Do not interleave reading layout metrics (`offsetWidth`, `clientHeight`,
  `getBoundingClientRect()`) with writing DOM styles in fast loops; batch reads first, then apply DOM writes.
* **Cache Offset Values in Loops:** Store layout properties in local variables rather than reading `element.offsetWidth`
  on every loop iteration or animation frame.
* **Account for Window Scroll Offsets:** Remember that `getBoundingClientRect()` is relative to the *viewport*; add
  `window.scrollY` and `window.scrollX` to get absolute coordinates relative to the top of the page.
* **Use `ResizeObserver` to Detect Size Changes:** Use `ResizeObserver` instead of listening to window resize events
  when monitoring dimensions of specific DOM elements.
* **Remember `client*` Excludes Scrollbars:** Use `clientWidth` rather than `offsetWidth` when calculating usable layout
  space inside containers with visible scrollbars.
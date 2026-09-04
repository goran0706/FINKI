# DOM Scrolling APIs and Mechanics

## Overview of DOM Scrolling

Scrolling in the DOM involves programmatically moving the visible viewport of the browser window or an overflow-scroll
container. JavaScript provides multiple complementary APIs for navigating scroll positions—ranging from high-level
element alignment methods like `scrollIntoView()` to precise pixel-coordinate controls (`scrollTo`, `scrollBy`) and
property-based offsets (`scrollTop`, `scrollLeft`). Modern scrolling methods support smooth transition physics via CSS
and JavaScript configuration objects.

| API / Method                                   | Target Context             | Behavior Customization                          | Primary Use Case                               |
|:-----------------------------------------------|:---------------------------|:------------------------------------------------|:-----------------------------------------------|
| **`element.scrollIntoView()`**                 | Target Element             | Smooth/Instant, Vertical & Horizontal alignment | Scrolling a specific element into view         |
| **`window.scrollTo()` / `element.scrollTo()`** | Window or Scroll Container | Coordinate object (`top`, `left`, `behavior`)   | Moving directly to absolute pixel coordinates  |
| **`window.scrollBy()` / `element.scrollBy()`** | Window or Scroll Container | Coordinate object (`top`, `left`, `behavior`)   | Relative incremental scrolling (e.g., +200px)  |
| **`element.scrollTop` / `element.scrollLeft`** | Scroll Container           | Direct property assignment (Instant only)       | Immediate reading or setting of scroll offsets |

## Scrolling Elements Into View (`scrollIntoView`)

The `scrollIntoView()` method scrolls the element's parent containers so that the element on which `scrollIntoView()` is
called becomes visible to the user. Using `block: 'nearest'` prevents unnecessary scrolling if the target element is
already partially visible within the viewport.

```javascript
const section = document.querySelector('#target-section');

// Simple boolean argument (true = align to top, false = align to bottom)
section.scrollIntoView(true);

// Advanced configuration object
section.scrollIntoView({
    behavior: 'smooth', // 'smooth' or 'instant' / 'auto'
    block: 'start',     // 'start', 'center', 'end', or 'nearest'
    inline: 'nearest'   // 'start', 'center', 'end', or 'nearest'
});
```

| Parameter Property | Valid Options                               | Operational Description                               |
|:-------------------|:--------------------------------------------|:------------------------------------------------------|
| **`behavior`**     | `'smooth'`, `'instant'`, `'auto'`           | Defines transition animation timing                   |
| **`block`**        | `'start'`, `'center'`, `'end'`, `'nearest'` | Vertical alignment relative to the scroll container   |
| **`inline`**       | `'start'`, `'center'`, `'end'`, `'nearest'` | Horizontal alignment relative to the scroll container |

## Absolute and Relative Pixel Scrolling (`scrollTo` & `scrollBy`)

For exact coordinate control over scrollable windows or container elements, use `scrollTo()` (absolute targets) or
`scrollBy()` (relative distance offsets). Both methods accept either two positional arguments (`x, y`) or a unified
`ScrollToOptions` dictionary.

```javascript
// Absolute scrolling: Move container directly to Y = 500px
window.scrollTo({
    top: 500,
    left: 0,
    behavior: 'smooth'
});

// Relative scrolling: Move down by 200px from current position
const scrollablePanel = document.querySelector('.panel-body');
scrollablePanel.scrollBy({
    top: 200,
    left: 0,
    behavior: 'smooth'
});
```

## Scroll Events and Performance

Detecting when a user scrolls is handled via the `scroll` event listener attached to `window` or an overflow container.
Because the `scroll` event fires synchronously at the browser's display refresh rate (frequently 60–120 times per
second), heavy DOM calculations inside scroll handlers must be throttled or scheduled using `requestAnimationFrame`.

```javascript
// Reading current global window scroll position
const currentY = window.scrollY; // or window.pageYOffset

// Detecting when a user scrolls to the bottom of a container
const container = document.querySelector('.feed-container');

container.addEventListener('scroll', () => {
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 1;

    if (isAtBottom) {
        console.log('End of scroll container reached. Fetching additional content...');
    }
});
```

## CSS Scroll Behaviors and Snap Controls

CSS properties can manage scroll physics declaratively without forcing JavaScript execution. Setting
`scroll-padding-top` ensures that methods like `element.scrollIntoView()` automatically offset target alignment to
accommodate sticky navigation bars.

```css
/* Enable smooth scrolling globally for internal page anchors */
html {
    scroll-behavior: smooth;
}

/* Scroll Padding: Keeps fixed sticky headers from covering scrolled target elements */
html {
    scroll-padding-top: 80px; /* Height of fixed navigation header */
}

/* CSS Scroll Snap Container */
.carousel-container {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
}

.carousel-item {
    scroll-snap-align: center;
}
```

## Use Cases

* **Smooth Navigation Anchors:** Scrolling smoothly to page sub-sections when top navigation links are clicked.
* **Infinite Scroll Feeds:** Monitoring `scrollHeight - scrollTop === clientHeight` to load subsequent data pages
  automatically.
* **Scroll-to-Top Floating Buttons:** Displaying a floating button when `window.scrollY > 300` and invoking
  `window.scrollTo({ top: 0, behavior: 'smooth' })`.
* **Chat Message Auto-Scrolling:** Setting `chatContainer.scrollTop = chatContainer.scrollHeight` when new messages
  arrive to keep the latest message visible.

## Best Practices

* **Use `scroll-padding-top` for Fixed Headers:** Define `scroll-padding-top` on the root element in CSS so
  `scrollIntoView()` does not tuck content under fixed navigation bars.
* **Throttle Scroll Event Handlers:** Wrap high-frequency `scroll` event handlers inside `requestAnimationFrame()` or a
  throttling function to maintain 60 FPS performance.
* **Prefer CSS `scroll-behavior: smooth` for Static Layouts:** Use declarative CSS `scroll-behavior: smooth` on `html`
  for basic anchor navigation instead of binding JavaScript click listeners to every link.
* **Check for Reduced Motion Preferences:** Respect user accessibility preferences by bypassing smooth scroll animations
  when `window.matchMedia('(prefers-reduced-motion: reduce)')` evaluates to true.
* **Use `ResizeObserver` / `IntersectionObserver` Over Heavy Scroll Math:** Use `IntersectionObserver` to detect element
  visibility instead of calculating bounding boxes inside continuous `scroll` event listeners.
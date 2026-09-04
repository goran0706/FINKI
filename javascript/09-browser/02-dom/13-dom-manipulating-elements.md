# Manipulating DOM Elements

## Overview of Element Manipulation

Manipulating DOM elements involves updating their structural contents, raw markup, or surrounding element tags.
JavaScript exposes multiple APIs to read, set, and alter element content—ranging from simple text node updates to full
HTML parsing engines and modern node replacement APIs. Choosing the appropriate manipulation property or method directly
impacts application performance, security against Cross-Site Scripting (XSS), and browser rendering speed.

| API / Property      | Content Scope                                     | Triggers HTML Parser                 | Security Risk Level               |
|:--------------------|:--------------------------------------------------|:-------------------------------------|:----------------------------------|
| **`textContent`**   | All text inside element (ignoring CSS formatting) | No (Text node creation)              | Safe (Automatic HTML escaping)    |
| **`innerText`**     | Rendered text content (respects CSS visibility)   | No (Requires layout recalculation)   | Safe (Automatic HTML escaping)    |
| **`innerHTML`**     | Inner markup string inside element tags           | Yes (Full child node reconstruction) | High (XSS risk if unsanitized)    |
| **`outerHTML`**     | Full element markup string including outer tags   | Yes (Replaces target element in DOM) | High (XSS risk if unsanitized)    |
| **`replaceWith()`** | Replaces target element with nodes or strings     | No (Operates on node tree directly)  | Safe (When using node parameters) |

## Text Content Manipulation (`textContent` vs `innerText`)

Both `textContent` and `innerText` update or read plain text within an element, but they handle hidden elements, script
tags, and browser reflows differently. Because `textContent` bypasses CSS layout processing, it is significantly faster
than `innerText` when updating or inspecting large document subtrees.

| Feature / Trait        | `textContent`                                         | `innerText`                                                        |
|:-----------------------|:------------------------------------------------------|:-------------------------------------------------------------------|
| **Hidden Text Access** | Reads text inside `display: none` elements            | Omits text hidden via CSS (`display: none` / `visibility: hidden`) |
| **Script/Style Tags**  | Includes raw content of `<script>` and `<style>` tags | Ignores non-rendered element contents                              |
| **Performance Cost**   | High performance (No layout trigger)                  | Triggers synchronous browser layout calculation                    |
| **Formatting Rules**   | Preserves whitespace and line breaks as defined       | Converts `<br>` tags to newlines and normalizes spaces             |

```javascript
const element = document.querySelector('.card-description');

// Setting text safely (Overwrites all inner child nodes with a single text node)
element.textContent = 'Updated body text without HTML parsing.';

// Reading text
console.log(element.textContent);
```

## Markup String Parsing (`innerHTML` and `outerHTML`)

The `innerHTML` and `outerHTML` properties allow getting or setting raw HTML strings directly. Setting either property
causes the browser's HTML parser to process the string, destroy affected existing DOM nodes, and instantiate new node
subtrees.

```javascript
const container = document.querySelector('#content-container');

// Reading inner markup
console.log(container.innerHTML); // Output: "<p>Original <span>content</span></p>"

// Setting inner markup
container.innerHTML = '<div class="alert">Operation successful!</div>';

// Replacing the target container element itself
container.outerHTML = '<section id="new-container"><p>Replaced whole tag.</p></section>';
```

### The `innerHTML +=` Performance Anti-Pattern

Concatenating strings onto `innerHTML` destroys and recreates all descendant nodes within the element:

```javascript
// DANGER: Re-parses all existing child nodes on every iteration!
// Destroys active event listeners attached to child elements.
for (let i = 0; i < 100; i++) {
    container.innerHTML += `<p>Item ${i}</p>`;
}

// CORRECT: Build DOM nodes in memory or use DOM insertion APIs
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    const p = document.createElement('p');
    p.textContent = `Item ${i}`;
    fragment.appendChild(p);
}
container.appendChild(fragment);
```

## Replacing Elements (`replaceWith` & `replaceChild`)

Replacing an existing element with a new node or HTML element can be achieved using modern element methods or classic
parent-node navigation. Using `replaceWith()` avoids holding explicit parent node references, enabling cleaner node
swapping during UI component updates.

| Method               | Syntax                                     | Execution Scope                   | Parameters Accepted                           |
|:---------------------|:-------------------------------------------|:----------------------------------|:----------------------------------------------|
| **`replaceWith()`**  | `targetEl.replaceWith(newNode1, 'string')` | Called directly on target element | Nodes, DOMStrings, or multiple arguments      |
| **`replaceChild()`** | `parent.replaceChild(newChild, oldChild)`  | Called on parent container node   | `Node` instances only (Returns replaced node) |

```javascript
const oldButton = document.querySelector('#submit-btn');

// Modern replacement (Target element replaces itself)
const newButton = document.createElement('button');
newButton.textContent = 'Confirm Submission';
newButton.className = 'btn-primary';

oldButton.replaceWith(newButton);

// Classic replacement via parent node
// oldButton.parentNode.replaceChild(newButton, oldButton);
```

## Use Cases

* **Safe Dynamic Text Rendering:** Setting user names, email addresses, or comments via `textContent` to ensure user
  inputs are rendered safely without HTML injection.
* **Complex Markup Hydration:** Injecting pre-parsed HTML strings from trusted templates into container elements using
  `innerHTML`.
* **Component Replacement:** Swapping interactive states (e.g., replacing a static text paragraph with an inline
  `<input>` control) via `element.replaceWith()`.
* **Wiping Container Contents:** Rapidly clearing all child elements inside a container using
  `container.textContent = ''`.

## Best Practices

* **Default to `textContent` for Plain Text Updates:** Use `textContent` instead of `innerHTML` whenever HTML parsing is
  not required to prevent XSS vulnerabilities and avoid unnecessary layout calculations.
* **Never Assign Unsanitized User Input to `innerHTML`:** Always sanitize external or user-generated HTML strings with a
  sanitizer library before writing to `innerHTML` or `outerHTML`.
* **Avoid `innerHTML +=` in Loops:** Never concatenate HTML strings onto `innerHTML` in repetitive loops; use
  `DocumentFragment` or `append()` instead to preserve performance and retain active event handlers.
* **Prefer `textContent = ''` to Clear Elements:** Use `container.textContent = ''` instead of
  `container.innerHTML = ''` to remove child nodes cleanly with minimal CPU execution overhead.
* **Use `replaceWith()` for Direct Node Swapping:** Prefer `element.replaceWith()` over `parent.replaceChild(new, old)`
  for concise, readable code that doesn't require parent container references.
* **Remember Listener Destruction on Reparsing:** Keep in mind that setting `innerHTML` re-creates child DOM nodes,
  unbinding all event listeners previously attached to inner elements.
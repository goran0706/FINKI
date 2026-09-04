# DOM Traversing

## Overview of DOM Traversal

DOM traversal is the process of moving through the document tree to locate parent, child, or sibling nodes relative to a
starting reference node. Traversing the DOM allows scripts to navigate existing structural relationships dynamically
without re-querying the entire document with selector lookups. Choosing between general node properties and element-only
properties determines whether inter-tag whitespace and comments impact your traversal path.

| Traversal Vector              | Node Traversal API (Includes Text/Comments) | Element Traversal API (HTML Tags Only)          |
|:------------------------------|:--------------------------------------------|:------------------------------------------------|
| **Upward**                    | `parentNode`                                | `parentElement` / `closest(selector)`           |
| **Downward (All)**            | `childNodes`                                | `children`                                      |
| **Downward (First / Last)**   | `firstChild` / `lastChild`                  | `firstElementChild` / `lastElementChild`        |
| **Lateral (Previous / Next)** | `previousSibling` / `nextSibling`           | `previousElementSibling` / `nextElementSibling` |

## Upward Traversal (Ancestors)

Upward traversal moves from a target element up toward the document root container. The `closest()` method checks the
target element itself first before traversing upward through parent elements.

| Method / Property       | Search Scope                     | Return Value                       | Primary Use Case                                        |
|:------------------------|:---------------------------------|:-----------------------------------|:--------------------------------------------------------|
| **`parentNode`**        | Immediate parent container       | `Node` or `null`                   | Navigating upward when root may be a `DocumentFragment` |
| **`parentElement`**     | Immediate parent node            | `Element` or `null`                | Inspecting or manipulating direct parent container      |
| **`closest(selector)`** | Target element and all ancestors | First matching `Element` or `null` | Locating component wrappers in event delegation         |

```javascript
// Upward navigation with closest()
const button = document.querySelector('.delete-btn');
const cardContainer = button.closest('.card-item');

if (cardContainer) {
    cardContainer.remove();
}
```

## Downward Traversal (Descendants)

Downward traversal moves from a container element down into its nested child nodes or child elements. Using `children`
or `firstElementChild` avoids handling unexpected blank text nodes produced by code formatting line breaks.

| Property                | Return Type         | Description / Traversal Scope                                        |
|:------------------------|:--------------------|:---------------------------------------------------------------------|
| **`childNodes`**        | `NodeList`          | Live list of all direct child nodes, including whitespace text nodes |
| **`firstChild`**        | `Node` or `null`    | First child node                                                     |
| **`lastChild`**         | `Node` or `null`    | Terminal child node                                                  |
| **`children`**          | `HTMLCollection`    | Live list containing only direct child element nodes                 |
| **`firstElementChild`** | `Element` or `null` | First child node that is an HTML element                             |
| **`lastElementChild`**  | `Element` or `null` | Terminal child node that is an HTML element                          |

```javascript
const list = document.querySelector('ul.menu');

// Navigating direct child elements cleanly
const firstOption = list.firstElementChild;
const allOptions = list.children;

console.log('Total element items:', allOptions.length);
```

## Lateral Traversal (Siblings)

Lateral traversal moves between nodes that share the same direct parent container. If no adjacent sibling exists in the
specified direction, sibling traversal properties return `null`.

| Property                     | Target Sibling                | Traversal Behavior                   |
|:-----------------------------|:------------------------------|:-------------------------------------|
| **`previousElementSibling`** | Immediately preceding element | Skips leading whitespace text nodes  |
| **`nextElementSibling`**     | Immediately following element | Skips trailing whitespace text nodes |
| **`previousSibling`**        | Immediately preceding node    | May return text node or comment      |
| **`nextSibling`**            | Immediately following node    | May return text node or comment      |

```javascript
// Iterating through sibling elements laterally
let currentItem = document.querySelector('.active-tab');

while (currentItem) {
    console.log('Tab label:', currentItem.textContent);
    currentItem = currentItem.nextElementSibling;
}
```

## Use Cases

* **Event Delegation Routing:** Using `event.target.closest('.list-item')` inside a single list listener to resolve
  clicked elements to their parent row.
* **Accordion and Tab Controls:** Locating adjacent accordion panels or tab content panels via
  `element.nextElementSibling`.
* **Dynamic Table Row Manipulation:** Traversing from a button in a table cell upward to the parent `<tr>` element using
  `closest('tr')`.
* **Custom Context Menus:** Traversing downward through a container's `children` to toggle focus or highlight active
  menu items.

## Best Practices

* **Default to Element Traversal Properties:** Use `children`, `firstElementChild`, and `nextElementSibling` instead of
  general node properties to bypass line breaks and whitespace.
* **Leverage `closest()` for Event Delegation:** Replace manual `parentElement.parentElement` chains with
  `element.closest('.selector')` to keep navigation resilient against HTML layout changes.
* **Validate Traversal References:** Always check that traversal properties return a non-null reference before calling
  methods or accessing properties to avoid runtime exceptions.
* **Avoid Deep Structural Coupling:** Do not chain multiple traversal calls together (e.g.,
  `el.parentElement.parentElement.nextElementSibling.firstElementChild`); query a stable container or class name
  instead.
* **Convert `children` Collections When Needed:** Convert the `HTMLCollection` returned by `element.children` to a
  standard array via `Array.from()` before applying array methods like `.filter()`.
* **Account for Scope Boundaries:** Remember that `parentElement` returns `null` if the parent is a `DocumentFragment`
  or `Document` node, whereas `parentNode` returns the parent node context.
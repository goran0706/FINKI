# DOM Collections

## Overview of DOM Collections

DOM collections are array-like objects returned by DOM selection methods and tree navigation properties. Although they
provide numerical indexing and a `length` property, DOM collections are not standard JavaScript arrays. They lack native
array methods such as `map()`, `filter()`, `reduce()`, or `slice()` by default, requiring specific conversion or
iteration strategies depending on whether you are working with an `HTMLCollection` or a `NodeList`.

| Feature / Trait            | `HTMLCollection`                         | `NodeList`                              | Standard `Array`            |
|:---------------------------|:-----------------------------------------|:----------------------------------------|:----------------------------|
| **Node Types Allowed**     | Element nodes only (`nodeType === 1`)    | Any DOM node (Elements, Text, Comments) | Any JavaScript value        |
| **Native `.forEach()`**    | Not supported                            | Supported                               | Supported                   |
| **Named Item Access**      | Supported (`collection.namedItem('id')`) | Not supported                           | Not supported               |
| **Standard Array Methods** | Missing (`map`, `filter`, etc.)          | Missing (`map`, `filter`, etc.)         | Full prototype availability |

## HTMLCollection vs NodeList

The browser DOM API exposes two primary collection types: `HTMLCollection` and `NodeList`. Key differences center on
contained node types, access methods, and native iteration support.

### 1. `HTMLCollection`

An `HTMLCollection` is an array-like list containing **only element nodes**. It is returned by traditional DOM querying
methods such as `getElementsByClassName()`, `getElementsByTagName()`, and structural element properties like
`element.children`.

```javascript
const items = document.getElementsByClassName('list-item'); // HTMLCollection

// Access by index
console.log(items[0]);

// Access by name or ID via namedItem()
console.log(items.namedItem('primary-header'));

// Cannot call items.forEach() directly!
```

### 2. `NodeList`

A `NodeList` is a collection of DOM nodes of **any type** (including elements, text fragments, and comments). It is
returned by methods like `querySelectorAll()`, `getElementsByName()`, and properties like `node.childNodes`.

```javascript
const nodes = document.querySelectorAll('.list-item'); // Static NodeList

// Supports native forEach iteration
nodes.forEach((node, index) => {
    console.log(`Node ${index}:`, node);
});
```

## Live vs Static Collections

One of the most critical aspects of DOM collections is whether they synchronize dynamically with mutations in the active
document tree.

| Collection Class     | Returned By                                                          | Liveness State | Behavioral Impact                                              |
|:---------------------|:---------------------------------------------------------------------|:---------------|:---------------------------------------------------------------|
| **`HTMLCollection`** | `getElementsByClassName`, `getElementsByTagName`, `element.children` | **Live**       | Updates automatically in real time when the DOM changes        |
| **`NodeList`**       | `node.childNodes`                                                    | **Live**       | Updates automatically when child nodes are added/removed       |
| **`NodeList`**       | `document.querySelectorAll()`                                        | **Static**     | Snapshot fixed at query time; does not update on DOM mutations |

### The Live Collection Loop Pitfall

Iterating over a live collection while mutating the underlying DOM can alter the collection's `length` and index
positions during execution, causing missed elements or infinite loops.

```javascript
const liveItems = document.getElementsByClassName('card'); // Live HTMLCollection

// DANGER: Removing elements shifts index positions dynamically!
for (let i = 0; i < liveItems.length; i++) {
    // Removing an element shrinks liveItems.length immediately
    liveItems[i].remove();
}

// SAFE ALTERNATIVE 1: Iterate backwards
for (let i = liveItems.length - 1; i >= 0; i--) {
    liveItems[i].remove();
}

// SAFE ALTERNATIVE 2: Convert to a static array first
const staticArray = Array.from(liveItems);
staticArray.forEach(item => item.remove());
```

## Array Conversion Techniques

Converting array-like DOM collections into native JavaScript arrays allows developers to leverage utility methods such
as `.map()`, `.filter()`, `.reduce()`, and `.find()`.

| Method                      | Syntax                                   | Browser Support | Notes                                             |
|:----------------------------|:-----------------------------------------|:----------------|:--------------------------------------------------|
| **`Array.from()`**          | `Array.from(collection)`                 | Modern / ES6+   | Preferred; accepts an optional mapping callback   |
| **Spread Syntax**           | `[...collection]`                        | Modern / ES6+   | Clean, readable syntax for converting iterables   |
| **`Array.prototype.slice`** | `Array.prototype.slice.call(collection)` | Legacy / ES5    | Fallback approach for legacy browser environments |

```javascript
const liveCollection = document.getElementsByTagName('button');

// Method 1: Using Array.from() with an inline mapping callback
const disabledButtonIds = Array.from(liveCollection, btn => btn.disabled ? btn.id : null)
    .filter(Boolean);

// Method 2: Using the spread operator
const buttonArray = [...liveCollection];
const activeButtons = buttonArray.filter(btn => btn.classList.contains('active'));
```

## Use Cases

* **Batch Element Style Updates:** Converting a `NodeList` returned by `querySelectorAll()` into an array to filter
  target nodes and apply dynamic CSS classes.
* **Safe DOM Batch Deletion:** Snapshotting a live `HTMLCollection` with `Array.from()` prior to clearing or removing
  list elements from a parent container.
* **Form Element Extraction:** Accessing named form fields directly using `HTMLFormElement.elements`, which returns a
  live `HTMLFormControlsCollection` (a specialized `HTMLCollection`).
* **Filtering Text Nodes from Mixed Subtrees:** Traversing `node.childNodes` (live `NodeList`) and filtering out
  whitespace text nodes to isolate structural components.

## Best Practices

* **Convert Live Collections Before Destructive Iteration:** Always convert live `HTMLCollection` references into
  standard arrays using `Array.from()` or `[...]` before executing loops that insert, move, or delete DOM elements.
* **Prefer `querySelectorAll()` for Static Snapshots:** Default to `querySelectorAll()` when querying multiple elements
  to obtain a stable, static `NodeList` that won't mutate unexpectedly during execution.
* **Leverage Native `.forEach()` on `NodeList`:** Use `nodeList.forEach()` directly for simple read/write iterations
  without creating unnecessary intermediate arrays.
* **Do Not Rely on `instanceof Array`:** Remember that `collection instanceof Array` returns `false` for both
  `HTMLCollection` and `NodeList`; use `Array.isArray()` to check converted collections.
* **Avoid Modifying DOM Collection Prototypes:** Refrain from attaching custom helper functions to
  `HTMLCollection.prototype` or `NodeList.prototype` to avoid runtime collisions with future Web APIs.
* **Cache `collection.length` in Legacy Loops:** When looping over large live collections with standard `for` loops,
  cache the `length` property locally if the DOM is not being modified to avoid repeated property lookups on every
  iteration.
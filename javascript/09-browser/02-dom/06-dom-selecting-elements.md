# Selecting DOM Elements

## Element Selection Architecture

Selecting elements from the Document Object Model is a fundamental requirement for interactive web applications.
JavaScript provides two distinct generations of element selection APIs: traditional direct-lookup methods (such as
`getElementById` and `getElementsByClassName`) and modern CSS-selector-based query methods (`querySelector` and
`querySelectorAll`). Understanding how these selection engines operate helps developers write efficient, maintainable
DOM code. Direct-lookup methods are optimized for specific attribute lookups, whereas CSS selector methods provide
greater flexibility by allowing complex document queries.

| API Generation               | Selector Type                       | Return Type                          | Live vs Static    |
|:-----------------------------|:------------------------------------|:-------------------------------------|:------------------|
| **Traditional API**          | Unique ID / Tag Name / Class Name   | Single `Element` or `HTMLCollection` | Live Collection   |
| **Selector API (Level 1/2)** | Any valid CSS1–CSS4 selector string | Single `Element` or `NodeList`       | Static Collection |

## Traditional Selection Methods

Traditional selection methods operate directly on the document tree or specific sub-elements to retrieve elements based
on explicit attribute criteria. Because `getElementsByClassName` and `getElementsByTagName` return live collections, any
subsequent additions or removals of matching elements in the DOM automatically update the collection in real time.

| Method                         | Syntax Example                               | Return Value               | Behavior Notes                            |
|:-------------------------------|:---------------------------------------------|:---------------------------|:------------------------------------------|
| **`getElementById()`**         | `document.getElementById('main-header')`     | Single `Element` or `null` | Fast direct ID lookup                     |
| **`getElementsByClassName()`** | `element.getElementsByClassName('nav-item')` | Live `HTMLCollection`      | Matches space-separated classes           |
| **`getElementsByTagName()`**   | `element.getElementsByTagName('button')`     | Live `HTMLCollection`      | Matches HTML tag names (case-insensitive) |
| **`getElementsByName()`**      | `document.getElementsByName('user-email')`   | Live `NodeList`            | Queries elements by `name` attribute      |

## Selector API Methods (`querySelector` & `querySelectorAll`)

The Selector API allows developers to locate elements using standard CSS selector syntax, including class names, IDs,
attribute selectors, pseudo-classes, and complex combinators. If the provided selector string is syntactically invalid,
both methods throw a `DOMException` of type `SyntaxError`.

| Method                   | Target Parameter              | Return Value                       | Operational Mechanics                                          |
|:-------------------------|:------------------------------|:-----------------------------------|:---------------------------------------------------------------|
| **`querySelector()`**    | Any valid CSS selector string | First matching `Element` or `null` | Performs depth-first pre-order traversal; stops at first match |
| **`querySelectorAll()`** | Any valid CSS selector string | Static `NodeList`                  | Evaluates entire subtree; collects all matching elements       |

```javascript
// Querying with complex CSS selectors
const activeListItem = document.querySelector('ul.nav-list > li.active');
const requiredInputs = document.querySelectorAll('form input[required]:not(:disabled)');
```

## Scope-Restricted Queries

Both traditional and modern selector APIs can be invoked directly on individual `Element` instances rather than the
global `document` object. This scopes the search exclusively to descendants of that specific element. Restricting query
scope improves execution performance and prevents accidental selections outside the intended UI component.

```javascript
// Scoped selection within a specific container
const cardContainer = document.querySelector('.card-component');

// Only searches inside cardContainer
const cardButton = cardContainer.querySelector('.submit-btn');
const cardImages = cardContainer.getElementsByTagName('img');
```

## Comparison: Live vs Static Collections

Understanding the difference between live `HTMLCollection` instances and static `NodeList` instances is essential when
modifying the DOM while iterating over selection results. Modifying element classes or removing nodes inside a standard
`for` loop over a live `HTMLCollection` can skip elements because the collection shrinks dynamically during iteration.

| Feature                 | Live Collection (`HTMLCollection`)               | Static Collection (`NodeList` from `querySelectorAll`) |
|:------------------------|:-------------------------------------------------|:-------------------------------------------------------|
| **Returned By**         | `getElementsByClassName`, `getElementsByTagName` | `querySelectorAll`                                     |
| **DOM Synchronization** | Updates automatically when the DOM changes       | Snapshot of the DOM at query time; does not update     |
| **Iteration Methods**   | Requires `for` loop or `Array.from()`            | Supports native `.forEach()` method directly           |
| **Performance Impact**  | Requires continuous DOM synchronization          | Fixed memory allocation; stable during DOM updates     |

## Use Cases

* **Component-Scoped Querying:** Scoping `querySelector` calls to a root component element to encapsulate DOM operations
  within a specific UI widget.
* **Form Field Retrieval:** Gathering all required input elements using `document.querySelectorAll('form :invalid')` for
  client-side form validation.
* **Dynamic Content Handling:** Using static `NodeList` snapshots when appending or removing elements to avoid infinite
  loops caused by mutating live collections.
* **Event Target Scoping:** Locating specific child nodes relative to a container element inside delegated event
  handlers.

## Best Practices

* **Default to `querySelector` and `querySelectorAll`:** Use CSS selector APIs as your standard approach for consistency
  and flexibility across complex queries.
* **Use `getElementById` for High-Frequency ID Lookups:** Prefer `getElementById` when performing performance-critical
  single-element lookups by ID, as browser engines optimize this path.
* **Scope Searches to Specific Containers:** Call `element.querySelector()` on a local parent container rather than
  querying the global `document` whenever possible.
* **Convert Live Collections Before Destructive Iteration:** Wrap live `HTMLCollection` instances in `Array.from()`
  before executing loops that add or remove DOM nodes.
* **Validate Selection Results Before Property Access:** Always check if `querySelector()` returned `null` before
  reading properties or calling methods on the result to avoid runtime `TypeError` exceptions.
* **Cache Reusable Queries:** Avoid calling query methods repeatedly inside requestAnimationFrame or scroll event
  handlers; store references to queried elements in local variables.
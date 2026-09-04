# DOM Prototypes and Object Hierarchy

## Prototype Chain Architecture of the DOM

Every DOM object in JavaScript is built upon an object-oriented prototype inheritance hierarchy. Rather than being plain
JavaScript objects, DOM nodes are instances of browser-native host interfaces. Understanding this prototype chain
reveals how properties, methods, and event handlers are inherited down to individual element nodes.

```
Object.prototype
└── EventTarget.prototype
    └── Node.prototype
        ├── Element.prototype
        │     └── HTMLElement.prototype
        │           ├── HTMLButtonElement.prototype
        │           ├── HTMLInputElement.prototype
        │           └── HTMLDivElement.prototype
        ├── Text.prototype
        ├── Comment.prototype
        └── Document.prototype
              └── HTMLDocument.prototype
```

Evaluating an element's prototype chain demonstrates that a standard `<button>` element inherits methods from
`HTMLButtonElement`, `HTMLElement`, `Element`, `Node`, `EventTarget`, and ultimately `Object`.

| Hierarchy Level           | Prototype Interface | Capabilities Inherited                                           |
|:--------------------------|:--------------------|:-----------------------------------------------------------------|
| **Base Event Layer**      | `EventTarget`       | `addEventListener()`, `removeEventListener()`, `dispatchEvent()` |
| **Tree Navigation Layer** | `Node`              | `parentNode`, `childNodes`, `appendChild()`, `removeChild()`     |
| **Element Core Layer**    | `Element`           | `querySelector()`, `getAttribute()`, `classList`, `closest()`    |
| **HTML Base Layer**       | `HTMLElement`       | `style`, `dataset`, `tabIndex`, `innerText`, `focus()`           |
| **Specific Tag Layer**    | `HTMLButtonElement` | `disabled`, `type`, `form`, `value`                              |

## Inspecting Prototype Chains Programmatically

You can inspect the prototype chain of any DOM node using `Object.getPrototypeOf()` or by checking instances against
their constructor interfaces using the `instanceof` operator. Inspecting prototypes helps clarify where specific
properties or methods reside. For example, `addEventListener` exists on `EventTarget.prototype`, whereas `children` is
defined via a getter on `Element.prototype`.

| Inspection Mechanism      | Expression Example                                   | Expected Result / Output                 |
|:--------------------------|:-----------------------------------------------------|:-----------------------------------------|
| **Prototype Retrieval**   | `Object.getPrototypeOf(button)`                      | `HTMLButtonElement.prototype`            |
| **Prototype Traversal**   | `Object.getPrototypeOf(HTMLButtonElement.prototype)` | `HTMLElement.prototype`                  |
| **Instance Verification** | `button instanceof EventTarget`                      | `true`                                   |
| **Interface Check**       | `'querySelector' in Node.prototype`                  | `false` (Defined on `Element.prototype`) |

## Property Descriptors and DOM Prototypes

Most DOM properties are not plain value properties stored on individual element instances; instead, they are implemented
as getter/setter pairs on their respective prototype objects. Because properties are defined on prototypes as accessors,
reading or setting a property like `element.innerHTML` triggers native C++ bindings in the browser engine rather than
simply setting a key on a JavaScript object.

| Property Name     | Defined On Prototype         | Accessor Mechanism                              |
|:------------------|:-----------------------------|:------------------------------------------------|
| **`textContent`** | `Node.prototype`             | Getter/Setter descriptor on `Node.prototype`    |
| **`innerHTML`**   | `Element.prototype`          | Getter/Setter descriptor on `Element.prototype` |
| **`classList`**   | `Element.prototype`          | Read-only getter returning `DOMTokenList`       |
| **`value`**       | `HTMLInputElement.prototype` | Getter/Setter descriptor managing control state |

## Extending DOM Prototypes (Polyfilling and Monkey Patching)

Because DOM interfaces are exposed as standard constructor functions in the global scope (`Element`, `Node`,
`HTMLElement`), developers can inspect or augment them. This capability is primarily used for feature detection,
polyfilling missing web standards, or decorating host objects with custom diagnostic logic. Modifying prototype methods
directly (monkey patching) should be approached with extreme care, as altering native prototypes across global execution
contexts can lead to subtle bugs or library collisions.

| Extension Pattern       | Target Prototype                        | Purpose / Operational Context                          |
|:------------------------|:----------------------------------------|:-------------------------------------------------------|
| **API Polyfill**        | `Element.prototype.closest`             | Supplying missing methods to older runtimes            |
| **Method Interception** | `Element.prototype.setAttribute`        | Logging or auditing DOM attribute mutations            |
| **Custom Element Base** | `class MyComponent extends HTMLElement` | Defining Web Components via standard class inheritance |

## Use Cases

* **Cross-Version API Polyfilling:** Adding modern DOM methods (such as `Element.prototype.replaceWith`) to legacy
  browser environments.
* **Custom Element Definition:** Extending `HTMLElement.prototype` through ES6 class syntax to register native Web
  Components via `customElements.define()`.
* **Centralized DOM Auditing:** Overriding `Element.prototype.appendChild` or `setAttribute` temporarily in test
  environments to monitor or log DOM mutations.
* **Accurate Runtime Type Checking:** Using `node instanceof HTMLInputElement` to safely narrow down types in dynamic UI
  render pipelines.

## Best Practices

* **Avoid Modifying Native Prototypes in Application Code:** Do not add non-standard custom utilities directly to
  `Element.prototype` or `Node.prototype` to avoid namespace collisions with future Web APIs.
* **Use `instanceof` for Reliable Type Checking:** Validate node types using `node instanceof HTMLElement` or
  `node instanceof Text` instead of relying solely on `nodeType` numerical constants or string checks.
* **Prefer Web Components Over Prototype Patching:** When creating custom DOM elements or components, extend
  `HTMLElement` through standard Web Components APIs rather than decorating existing host prototypes.
* **Check Feature Existence Before Polyfilling:** Always perform feature detection (`if (!Element.prototype.matches)`)
  before attaching a polyfill to a native prototype.
* **Beware of Host Object Differences:** Remember that while DOM objects inherit from `Object.prototype`, browser
  engines implement DOM prototypes in native code, which may enforce stricter type validation than plain JavaScript
  objects.
* **Leverage Native Class Inheritance:** Inherit cleanly from specific interfaces when building custom wrappers or UI
  components to preserve natural browser behavior and accessibility semantics.
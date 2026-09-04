# DOM Dataset API (`dataset`)

## Overview of HTML5 Data Attributes and `dataset`

HTML5 custom data attributes (prefixed with `data-*`) allow developers to attach arbitrary private data directly to HTML
elements without violating HTML validation standards. The DOM **Dataset API** provides a property on HTML elements (
`element.dataset`) that exposes a `DOMStringMap` object, allowing scripts to read, write, and delete custom data
attributes using standard object syntax. The `dataset` map maintains a direct, bi-directional binding with the element's
`data-*` HTML attributes in real time.

| Aspect               | `data-*` HTML Attribute                             | `element.dataset` Property                                  |
|:---------------------|:----------------------------------------------------|:------------------------------------------------------------|
| **Syntax Style**     | Kebab-case in markup (e.g., `data-user-role`)       | CamelCase property in JavaScript (e.g., `dataset.userRole`) |
| **Object Interface** | `getAttribute('data-user-role')` / `setAttribute()` | `DOMStringMap` live object property access                  |
| **Access Speed**     | Standard attribute lookup overhead                  | Direct object property getter/setter                        |
| **Primary Purpose**  | Initial static state storage in markup              | Dynamic script-based reading and state updates              |

## Name Conversion Rules (Kebab-case to CamelCase)

The Dataset API automatically converts attribute names between HTML's kebab-case syntax and JavaScript's camelCase
identifier rules.

| Transformation Step       | HTML Attribute Syntax   | JS `dataset` Property Syntax                       |
|:--------------------------|:------------------------|:---------------------------------------------------|
| **Strip Prefix**          | `data-user-id`          | `userId`                                           |
| **Convert Hyphens**       | `data-active-tab-index` | `activeTabIndex`                                   |
| **Preserved Uppercase**   | `data-URL`              | `url` (Lowercase conversion during markup parsing) |
| **Multi-dash Formatting** | `data-api-v2-key`       | `apiV2Key`                                         |

```html
<!-- HTML Source Markup -->
<div id="user-card"
     data-user-id="10942"
     data-is-admin="true"
     data-session-status="active">
</div>
```

```javascript
const userCard = document.querySelector('#user-card');

// Reading values via dataset (automatically converted from kebab-case)
console.log(userCard.dataset.userId);        // Output: "10942" (String type)
console.log(userCard.dataset.isAdmin);       // Output: "true" (String type)
console.log(userCard.dataset.sessionStatus); // Output: "active"
```

## Reading, Updating, and Deleting Attributes

Working with `dataset` properties modifies the underlying HTML attributes immediately, maintaining complete
synchronization with CSS attribute selectors and markup reflection.

| Operation           | Syntax Example                       | Underpinning HTML Mutation                       |
|:--------------------|:-------------------------------------|:-------------------------------------------------|
| **Read Property**   | `const id = element.dataset.id`      | Reads `data-id` attribute value                  |
| **Write / Create**  | `element.dataset.status = 'pending'` | Adds/updates `data-status="pending"` attribute   |
| **Delete Property** | `delete element.dataset.status`      | Removes `data-status` attribute entirely         |
| **Presence Check**  | `'status' in element.dataset`        | Evaluates whether `data-status` attribute exists |

```javascript
const button = document.querySelector('button');

// Creating new data attributes dynamically
button.dataset.clickCount = '5';
button.dataset.isLoading = 'false';

// Deleting data attributes
delete button.dataset.isLoading; // Removes 'data-is-loading' from HTML tag
```

## Data Types and Serialization Limitations

All data stored inside HTML attributes or accessed via `dataset` is stored as **strings**. The Dataset API does not
perform automatic type coercion for numbers, booleans, or objects.

| Original Input Type | Set Syntax                                     | Storage Format | Conversion Requirement                                   |
|:--------------------|:-----------------------------------------------|:---------------|:---------------------------------------------------------|
| **Number**          | `element.dataset.count = 42`                   | `"42"`         | Wrap in `Number(element.dataset.count)` or `parseInt()`  |
| **Boolean**         | `element.dataset.active = true`                | `"true"`       | Compare with string: `element.dataset.active === 'true'` |
| **Object / Array**  | `element.dataset.config = JSON.stringify(obj)` | JSON String    | Deserialize with `JSON.parse(element.dataset.config)`    |

```javascript
const widget = document.querySelector('.widget');

// Storing complex objects
const settings = {theme: 'dark', autoSave: true};
widget.dataset.settings = JSON.stringify(settings);

// Reading and deserializing complex objects
const loadedSettings = JSON.parse(widget.dataset.settings);
console.log(loadedSettings.theme); // Output: "dark"
```

## CSS Integration and Attribute Selectors

Data attributes managed via the Dataset API seamlessly integrate with CSS, enabling style hooks based on dynamic element
state without bloating the `class` list.

```css
/* CSS Styling based on dataset attributes */
.user-badge[data-status="online"] {
    background-color: #22c55e;
}

.user-badge[data-status="offline"] {
    background-color: #94a3b8;
}

/* Pseudo-element content extraction */
.tooltip::after {
    content: attr(data-tooltip-text);
}
```

## Use Cases

* **State-Driven UI Component Styling:** Toggling component states (e.g., `element.dataset.state = 'expanded'`) to
  trigger custom CSS styling via attribute selectors.
* **Event Delegation Metadata Hooks:** Storing item IDs, categories, or action names on buttons (e.g.,
  `data-action="delete"`) to handle routing in a centralized click listener.
* **CSS Tooltip Content Injection:** Populating custom CSS tooltip messages via `attr(data-tooltip)` pseudo-element
  rules.
* **Micro-Framework State Binding:** Attaching lightweight framework bindings or configuration settings directly to HTML
  containers during server-side rendering.

## Best Practices

* **Do Not Store Sensitive Data:** Avoid placing private tokens, passwords, or personally identifiable information (PII)
  inside `data-*` attributes, as they are fully visible in the DOM markup.
* **Explicitly Coerce Types When Reading:** Always convert numeric or boolean `dataset` strings (e.g.,
  `Number(el.dataset.page)`) before performing arithmetic or logical evaluations.
* **Keep Data Payload Sizes Small:** Store primary record keys or state indicators rather than massive JSON strings to
  prevent heavy memory serialization overhead in the DOM.
* **Use `dataset` Over `getAttribute('data-*')`:** Prefer `dataset.keyName` over manual `getAttribute('data-key-name')`
  calls for better readability and maintainability.
* **Safely Delete Attributes with `delete`:** Use the `delete element.dataset.prop` operator to completely remove data
  attributes from HTML tags rather than assigning `null` or `undefined` strings.
* **Avoid Key Name Collisions:** Maintain consistent camelCase naming conventions across JS files to prevent name
  overlap when working with shared component datasets.
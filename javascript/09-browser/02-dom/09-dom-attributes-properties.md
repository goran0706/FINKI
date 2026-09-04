# DOM Attributes vs Properties

## Overview of Attributes and Properties

When the browser parses HTML markup, it creates corresponding DOM element objects in memory. During this process,
standard HTML **attributes** written in the source code are parsed to initialize corresponding **properties** on the DOM
object instances. Though often used interchangeably, attributes and properties are distinct entities with different data
types, update behaviors, and API interfaces. Understanding this distinction is vital for handling form field state,
dynamically styling components, and tracking initial vs current element values.

| Feature / Aspect       | HTML Attribute                                       | DOM Property                                                   |
|:-----------------------|:-----------------------------------------------------|:---------------------------------------------------------------|
| **Storage Context**    | HTML source markup (`NamedNodeMap`)                  | JavaScript object property on the element instance             |
| **Data Type**          | Always a string (or `null` if absent)                | Accepts any JavaScript type (String, Boolean, Object, Number)  |
| **Case Sensitivity**   | Case-insensitive in HTML source                      | Case-sensitive in JavaScript execution contexts                |
| **Core API Interface** | `getAttribute()`, `setAttribute()`, `hasAttribute()` | Direct property access (e.g., `element.id`, `element.checked`) |

## Attribute Manipulation APIs

DOM elements expose explicit methods to inspect, write, verify, and remove HTML attributes directly within the element's
attribute node collection. Attribute names passed to these methods are automatically converted to lower-case in standard
HTML documents.

| Method                        | Parameters                | Return Value       | Operational Mechanics                              |
|:------------------------------|:--------------------------|:-------------------|:---------------------------------------------------|
| **`getAttribute(name)`**      | Attribute name string     | `string` or `null` | Returns raw string value defined in HTML markup    |
| **`setAttribute(name, val)`** | Name string, Value string | `undefined`        | Creates or updates target attribute in HTML source |
| **`hasAttribute(name)`**      | Attribute name string     | `boolean`          | Checks if attribute node exists on the element     |
| **`removeAttribute(name)`**   | Attribute name string     | `undefined`        | Removes target attribute node completely           |

```javascript
const input = document.querySelector('input');

// Working with HTML Attributes
input.setAttribute('type', 'text');
input.setAttribute('value', 'Initial Text');

console.log(input.getAttribute('value')); // Output: "Initial Text"
console.log(input.hasAttribute('disabled')); // Output: false
```

## Synchronization and Reflection

Most standard HTML attributes reflect directly to corresponding DOM properties, meaning changes to one frequently update
the other. However, this synchronization is not always 1:1 or bi-directional.

| Attribute / Property Pair         | Reflection Type             | Synchronization Behavior                                                 |
|:----------------------------------|:----------------------------|:-------------------------------------------------------------------------|
| **`id` / `element.id`**           | 1:1 Direct Reflection       | Updating property or attribute syncs both directions immediately         |
| **`class` / `element.className`** | Renamed Property Reflection | Property renamed to `className` to avoid JS reserved keyword             |
| **`value` / `element.value`**     | Non-Reflecting State        | Attribute holds **default** value; property holds **current** live value |
| **`href` / `element.href`**       | Normalized Reflection       | Attribute holds raw string; property returns fully resolved absolute URL |

### The `value` Attribute vs Property Example

The `value` property on form controls illustrates the key difference between initial HTML markup and dynamic DOM state.
Modifying the `value` property does not alter the underlying `value` attribute, allowing forms to reset back to their
original default state.

```javascript
const input = document.querySelector('#username');
// HTML: <input id="username" value="John">

input.value = 'Jane'; // User types or script updates live property

console.log(input.value); // "Jane" (Current user input state)
console.log(input.getAttribute('value')); // "John" (Initial HTML default value)
```

## Boolean Attributes and Properties

Boolean attributes (such as `disabled`, `checked`, `required`, and `readonly`) behave differently than string-based
attributes. In HTML, the mere presence of a boolean attribute signifies `true`, regardless of its string content.

| Operation                | Syntax Example                             | Resulting Property Value | Resulting HTML Attribute State                            |
|:-------------------------|:-------------------------------------------|:-------------------------|:----------------------------------------------------------|
| **Property Assignment**  | `button.disabled = true`                   | `true`                   | `<button disabled="">`                                    |
| **Property Assignment**  | `button.disabled = false`                  | `false`                  | Attribute removed from HTML                               |
| **Attribute Assignment** | `button.setAttribute('disabled', 'false')` | `true`                   | `<button disabled="false">` (Presence evaluates to true!) |
| **Attribute Removal**    | `button.removeAttribute('disabled')`       | `false`                  | Attribute removed from HTML                               |

```javascript
const checkbox = document.querySelector('input[type="checkbox"]');

// RECOMMENDED: Manipulate boolean state via DOM property
checkbox.checked = true;

// PITFALL: Setting attribute to string "false" still evaluates as true!
checkbox.setAttribute('checked', 'false');
console.log(checkbox.checked); // true! (because the attribute exists)
```

## Use Cases

* **Tracking Default Form Values:** Comparing `input.getAttribute('value')` with `input.value` to determine if a form
  field has been modified by the user.
* **Custom Styling and Data Hooks:** Storing non-standard metadata on elements using custom attributes (or `data-*`
  attributes) via `getAttribute()`.
* **Dynamic Form Control Disabling:** Toggling interactive element states cleanly by setting boolean DOM properties
  directly (e.g., `button.disabled = true`).
* **Inspecting Unresolved Resource Paths:** Reading raw relative path references using `getAttribute('src')` rather than
  the fully-resolved absolute URL returned by `image.src`.

## Best Practices

* **Prefer DOM Properties for Dynamic State:** Use direct property access (e.g., `element.value`, `element.checked`,
  `element.disabled`) when reading or modifying live element state.
* **Use `getAttribute()` for Raw HTML Values:** Use `getAttribute()` when you need the exact string value written in the
  original HTML source code (such as relative `href` links).
* **Avoid `setAttribute` for Boolean Properties:** Do not use `setAttribute('disabled', 'false')` to enable elements;
  assign `element.disabled = false` or use `removeAttribute('disabled')` instead.
* **Use `classList` for Managing CSS Classes:** Use `element.classList.add()` and `element.classList.remove()` instead
  of manually concatenating strings on `getAttribute('class')` or `element.className`.
* **Use `dataset` for Custom Attributes:** Prefix non-standard custom attributes with `data-` (e.g., `data-user-id`) and
  access them via the `element.dataset` API rather than raw attribute methods.
* **Remember Property Name Mapping:** Keep in mind that certain attributes map to different property names in
  JavaScript (e.g., `class` maps to `className`, `for` maps to `htmlFor`).
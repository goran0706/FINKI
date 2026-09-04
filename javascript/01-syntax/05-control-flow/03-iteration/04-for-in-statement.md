# for...in Statement

The `for...in` statement iterates over the **enumerable string-keyed properties** of an object. On each iteration, the
loop variable receives a property key rather than the property's value.

```javascript id="for-in-basic"
const user = {
    name: "Alice",
    age: 30,
    active: true
};

for (const key in user) {
    console.log(key);
}

// name
// age
// active
```

The fundamental distinction is:

```text
for...in → property keys
for...of  → iterable values
```

A `for...in` loop is therefore primarily an object-property enumeration mechanism rather than a general-purpose
collection iteration mechanism.

## Basic Syntax

The general syntax is:

```javascript id="for-in-syntax"
for (variable in object) {
    statement;
}
```

The loop evaluates the right-hand side and enumerates its enumerable string-keyed properties.

```javascript id="for-in-object"
const settings = {
    theme: "dark",
    language: "en",
    notifications: true
};

for (const property in settings) {
    console.log(property);
}
```

The variable receives the property name:

```text
theme
language
notifications
```

It does not automatically receive the corresponding value.

The value can be accessed explicitly:

```javascript id="for-in-value"
const settings = {
    theme: "dark",
    language: "en",
    notifications: true
};

for (const property in settings) {
    console.log(settings[property]);
}
```

This produces:

```text
dark
en
true
```

## Property Keys

`for...in` produces property keys as strings.

```javascript id="for-in-string-keys"
const object = {
    10: "ten",
    20: "twenty"
};

for (const key in object) {
    console.log(typeof key, key);
}

// string 10
// string 20
```

Even though the source uses numeric-looking property names, ordinary object property keys are strings or symbols, and
`for...in` only enumerates the string-keyed properties.

This means:

```javascript id="for-in-key-access"
const object = {
    10: "ten"
};

for (const key in object) {
    console.log(object[key]);
}
```

is the normal way to retrieve the corresponding property value.

## Enumerable Properties

Only properties whose `[[Enumerable]]` attribute is `true` are considered by `for...in`.

Ordinary object-literal properties are enumerable:

```javascript id="for-in-enumerable"
const object = {
    visible: 1,
    another: 2
};

for (const key in object) {
    console.log(key);
}
```

A property can explicitly be made non-enumerable:

```javascript id="for-in-non-enumerable"
const object = {
    visible: 1
};

Object.defineProperty(object, "hidden", {
    value: 2,
    enumerable: false
});

for (const key in object) {
    console.log(key);
}

// visible
```

The `hidden` property exists and can be accessed normally:

```javascript id="for-in-hidden-access"
console.log(object.hidden);

// 2
```

It simply does not participate in `for...in` enumeration.

## String-Keyed Properties

`for...in` enumerates string-keyed properties. Symbol-keyed properties are not included.

```javascript id="for-in-symbol"
const identifier = Symbol("identifier");

const object = {
    name: "Alice",
    [identifier]: 123
};

for (const key in object) {
    console.log(key);
}

// name
```

The symbol property still exists:

```javascript id="for-in-symbol-access"
console.log(object[identifier]);

// 123
```

It is merely outside the property set enumerated by `for...in`.

To enumerate symbol properties, use APIs designed for symbol-keyed properties:

```javascript id="object-symbols"
const symbols = Object.getOwnPropertySymbols(object);
```

## Own Properties

`for...in` can enumerate an object's own enumerable string-keyed properties.

```javascript id="for-in-own"
const object = {
    name: "Alice",
    age: 30
};

for (const key in object) {
    console.log(key);
}
```

However, `for...in` is not restricted to own properties.

Properties inherited through the prototype chain can also be enumerated if they are enumerable.

## Inherited Properties

An object can inherit enumerable properties from its prototype.

```javascript id="for-in-inherited"
const prototype = {
    inherited: true
};

const object = Object.create(prototype);

object.own = true;

for (const key in object) {
    console.log(key);
}

// own
// inherited
```

The `in` portion of `for...in` therefore has an important distinction from APIs such as `Object.keys()`.

`Object.keys()` returns own enumerable string-keyed properties.

`for...in` can traverse enumerable properties found through the prototype chain.

## Own Property Filtering

When only an object's own properties should be processed, explicitly filter inherited properties.

Modern JavaScript provides `Object.hasOwn()`:

```javascript id="for-in-has-own"
const prototype = {
    inherited: true
};

const object = Object.create(prototype);

object.own = true;

for (const key in object) {
    if (Object.hasOwn(object, key)) {
        console.log(key);
    }
}

// own
```

`Object.hasOwn()` tests whether the object itself owns the specified property.

This is preferable to assuming that every key returned by `for...in` belongs directly to the object.

## hasOwnProperty

Older code commonly uses `hasOwnProperty()`:

```javascript id="for-in-hasownproperty"
for (const key in object) {
    if (object.hasOwnProperty(key)) {
        console.log(key);
    }
}
```

However, this pattern is not universally safe because an object can define its own property named `hasOwnProperty` or
have a null prototype.

For example:

```javascript id="for-in-shadowed-hasownproperty"
const object = {
    hasOwnProperty: "not a function",
    value: 42
};
```

Calling:

```javascript
object.hasOwnProperty("value");
```

would fail because the object's property shadows the inherited method.

Prefer:

```javascript id="for-in-object-hasown"
if (Object.hasOwn(object, key)) {
    // ...
}
```

or, when compatibility with older environments is required:

```javascript id="for-in-object-prototype"
if (Object.prototype.hasOwnProperty.call(object, key)) {
    // ...
}
```

## Prototype Chain Traversal

The prototype chain is conceptually searched for enumerable properties.

```javascript id="for-in-prototype-chain"
const base = {
    baseProperty: 1
};

const middle = Object.create(base);

middle.middleProperty = 2;

const object = Object.create(middle);

object.ownProperty = 3;

for (const key in object) {
    console.log(key);
}
```

The resulting enumeration can include:

```text
ownProperty
middleProperty
baseProperty
```

The exact enumeration behavior depends on the object's property structure and the rules governing property enumeration.

The important semantic distinction is that `for...in` is capable of seeing beyond the object's own property set.

## Property Enumeration Order

JavaScript defines ordering rules for property enumeration, but code should not generally use `for...in` as a mechanism
for imposing application-level ordering semantics.

For ordinary own properties, the relevant ordering model broadly places:

1. Integer-index-like string keys in ascending numeric order.
2. Other string keys according to their insertion order.

For example:

```javascript id="for-in-order"
const object = {
    b: "B",
    2: "two",
    1: "one",
    a: "A"
};

for (const key in object) {
    console.log(key);
}
```

The integer-index-like keys are enumerated before the other string keys:

```text
1
2
b
a
```

Inherited properties introduce additional considerations because enumeration traverses the prototype chain and avoids
reporting certain already-visited property names.

Do not use `for...in` when application correctness depends on a custom ordering unless that ordering is explicitly
represented by an appropriate data structure.

## for...in with Arrays

Arrays are objects, so `for...in` can enumerate their enumerable properties.

```javascript id="for-in-array"
const values = ["a", "b", "c"];

for (const key in values) {
    console.log(key);
}

// 0
// 1
// 2
```

However, the loop variable contains the indexes as strings:

```javascript id="for-in-array-key-type"
for (const key in values) {
    console.log(typeof key);
}

// string
// string
// string
```

This makes `for...in` generally inappropriate for iterating array elements.

It also exposes the fact that arrays can contain additional enumerable properties:

```javascript id="for-in-array-extra"
const values = ["a", "b", "c"];

values.metadata = "example";

for (const key in values) {
    console.log(key);
}

// 0
// 1
// 2
// metadata
```

The additional property is not an array element, but `for...in` can still enumerate it.

For arrays, prefer `for...of` when values are required:

```javascript id="for-in-array-of"
for (const value of values) {
    console.log(value);
}
```

or an index-based `for` loop when indexes are required:

```javascript id="for-in-array-index"
for (let index = 0; index < values.length; index++) {
    console.log(values[index]);
}
```

## Sparse Arrays

`for...in` enumerates existing enumerable properties rather than iterating over every numeric position up to `length`.

```javascript id="for-in-sparse"
const values = [];

values[2] = "c";

for (const key in values) {
    console.log(key);
}

// 2
```

The absent indexes `0` and `1` are not properties and therefore are not enumerated.

This differs from the conceptual index range represented by the array's `length`.

## Array Prototype Properties

Inherited enumerable properties can also affect `for...in` over arrays.

```javascript id="for-in-array-prototype"
Array.prototype.customProperty = "example";

const values = [1, 2, 3];

for (const key in values) {
    console.log(key);
}
```

The inherited property can appear in the enumeration.

Modifying built-in prototypes is generally discouraged, but this example demonstrates why `for...in` should not be
treated as an array iteration mechanism.

## Object.keys ()

`Object.keys()` returns an array containing an object's own enumerable string-keyed property names.

```javascript id="object-keys"
const object = {
    name: "Alice",
    age: 30
};

for (const key of Object.keys(object)) {
    console.log(key);
}
```

This is often preferable to `for...in` when the intention is explicitly to enumerate only own properties.

The distinction is:

| Mechanism          | Own properties | Inherited properties | String keys | Symbol keys | Produces        |
|:-------------------|:--------------:|:--------------------:|:-----------:|:-----------:|:----------------|
| `for...in`         |      Yes       |         Yes          |     Yes     |     No      | Keys            |
| `Object.keys()`    |      Yes       |          No          |     Yes     |     No      | Array of keys   |
| `Object.values()`  |      Yes       |          No          |     Yes     |     No      | Array of values |
| `Object.entries()` |      Yes       |          No          |     Yes     |     No      | Key/value pairs |

For example:

```javascript id="for-in-object-keys"
const object = {
    name: "Alice",
    age: 30
};

for (const key of Object.keys(object)) {
    console.log(key, object[key]);
}
```

This gives explicit control over the own-property set being iterated.

## Object.entries ()

When both keys and values are needed, `Object.entries()` is often clearer:

```javascript id="for-in-entries"
const object = {
    name: "Alice",
    age: 30
};

for (const [key, value] of Object.entries(object)) {
    console.log(key, value);
}
```

This avoids manually performing:

```javascript id="for-in-manual-value"
object[key]
```

and explicitly communicates that both the key and value are required.

## for...in vs for...of

The two constructs serve different purposes.

```javascript id="for-in-vs-of"
const object = {
    a: 1,
    b: 2
};

for (const key in object) {
    console.log(key);
}

for (const value of Object.values(object)) {
    console.log(value);
}
```

`for...in` enumerates property keys.

`for...of` consumes an iterable and produces its values.

For arrays:

```javascript id="for-in-vs-of-array"
const values = [10, 20, 30];

for (const key in values) {
    console.log(key);
}

for (const value of values) {
    console.log(value);
}
```

The first loop produces:

```text
0
1
2
```

The second produces:

```text
10
20
30
```

The semantic distinction is therefore fundamental:

```text
for...in → object property enumeration
for...of  → iterable value iteration
```

## for...in vs for Statement

A traditional `for` loop is appropriate when explicit index or counter control is required.

```javascript id="for-vs-for-in"
const values = [10, 20, 30];

for (let index = 0; index < values.length; index++) {
    console.log(values[index]);
}
```

Unlike `for...in`, the `for` statement explicitly controls initialization, termination, and update.

Use `for...in` when the conceptual operation is property enumeration rather than index-based iteration.

## for...in vs Object.entries ()

These two patterns can produce similar results:

```javascript id="for-in-vs-entries"
const object = {
    name: "Alice",
    age: 30
};

for (const key in object) {
    if (Object.hasOwn(object, key)) {
        console.log(key, object[key]);
    }
}

for (const [key, value] of Object.entries(object)) {
    console.log(key, value);
}
```

The `Object.entries()` version explicitly restricts the enumeration to own enumerable string-keyed properties.

The `for...in` version is useful when prototype-chain enumeration is intentionally required or when working with objects
where inherited enumerable properties are part of the desired behavior.

## Dynamic Property Access

A common use of `for...in` is dynamically accessing properties.

```javascript id="for-in-dynamic"
const user = {
    name: "Alice",
    email: "alice@example.com",
    role: "admin"
};

for (const property in user) {
    console.log(`${property}: ${user[property]}`);
}
```

The bracket notation is required because the property name is stored in a variable.

```javascript id="for-in-bracket-access"
const key = "name";

console.log(user[key]);
```

Using:

```javascript id="for-in-dot-access"
user.key
```

would instead access a property literally named `"key"`.

## Property Existence During Enumeration

A property can be checked before accessing it:

```javascript id="for-in-property-check"
for (const key in object) {
    if (Object.hasOwn(object, key)) {
        const value = object[key];

        console.log(value);
    }
}
```

This is especially relevant when iterating objects whose prototypes are not fully controlled.

## break in for...in Loops

A `for...in` loop can be terminated with `break`.

```javascript id="for-in-break"
const object = {
    first: 1,
    second: 2,
    third: 3
};

for (const key in object) {
    if (key === "second") {
        break;
    }

    console.log(key);
}
```

Once `break` executes, the loop terminates immediately.

## continue in for...in Loops

`continue` skips the remainder of the current iteration and proceeds to the next property.

```javascript id="for-in-continue"
const object = {
    first: 1,
    second: 2,
    third: 3
};

for (const key in object) {
    if (key === "second") {
        continue;
    }

    console.log(key);
}
```

The property named `second` is skipped.

## Nested for...in Loops

`for...in` loops can be nested:

```javascript id="for-in-nested"
const object = {
    first: {
        value: 1,
        enabled: true
    },
    second: {
        value: 2,
        enabled: false
    }
};

for (const outerKey in object) {
    for (const innerKey in object[outerKey]) {
        console.log(outerKey, innerKey);
    }
}
```

As with other nested loops, the inner loop completes its enumeration for each iteration of the outer loop.

When inherited properties are not wanted, each level should apply the appropriate own-property check or use
`Object.entries()`.

## Destructuring with for...in

Because `for...in` produces property keys, destructuring the loop variable is generally not useful for obtaining
key/value pairs directly.

```javascript id="for-in-no-entry-destructuring"
for (const key in object) {
    const value = object[key];

    console.log(key, value);
}
```

When key/value destructuring is desired, use `Object.entries()`:

```javascript id="for-in-entry-destructuring"
for (const [key, value] of Object.entries(object)) {
    console.log(key, value);
}
```

This directly represents the desired data structure.

## Mutation During Enumeration

The object can technically be modified while it is being enumerated:

```javascript id="for-in-mutation"
const object = {
    first: 1,
    second: 2
};

for (const key in object) {
    if (key === "first") {
        object.third = 3;
    }

    console.log(key);
}
```

Code should not depend on newly added, deleted, or otherwise modified properties being processed in a particular
application-level way during the same enumeration.

Enumeration interacts with the object's property state and prototype chain, and mutations can make the resulting
traversal difficult to reason about.

Prefer iterating over a stable property set when mutation is necessary:

```javascript id="for-in-stable-keys"
const object = {
    first: 1,
    second: 2
};

for (const key of Object.keys(object)) {
    if (key === "first") {
        object.third = 3;
    }

    console.log(key);
}
```

Here the list of keys being traversed is materialized before the loop begins.

## Deleting Properties During Enumeration

Properties can also be deleted while iterating:

```javascript id="for-in-delete"
const object = {
    first: 1,
    second: 2,
    third: 3
};

for (const key in object) {
    if (key === "second") {
        delete object.second;
    }

    console.log(key);
}
```

Mutation during enumeration should generally be avoided when predictable traversal is important.

If the operation requires changing the object, first create a stable collection of the properties to process:

```javascript id="for-in-delete-stable"
for (const key of Object.keys(object)) {
    if (shouldDelete(key)) {
        delete object[key];
    }
}
```

## for...in with Null and Undefined

`for...in` does not provide a useful property set for `null` or `undefined`. Code should not rely on enumeration of
nullish values as a substitute for validating the input.

If an object is expected:

```javascript id="for-in-null-check"
if (object != null) {
    for (const key in object) {
        // ...
    }
}
```

Explicit validation is preferable when the function contract requires an object.

## Prototype Pollution Considerations

Because `for...in` can enumerate inherited properties, it requires particular care when processing objects originating
from external or untrusted data.

For example:

```javascript id="for-in-untrusted"
for (const key in input) {
    process(input[key]);
}
```

If `input` has an unexpected prototype containing enumerable properties, those properties can participate in the loop.

When processing untrusted object data, prefer own-property enumeration:

```javascript id="for-in-untrusted-safe"
for (const [key, value] of Object.entries(input)) {
    process(key, value);
}
```

or:

```javascript id="for-in-untrusted-hasown"
for (const key in input) {
    if (Object.hasOwn(input, key)) {
        process(input[key]);
    }
}
```

The appropriate choice depends on the application's object model and trust boundaries.

## for...in and Object.create (null)

Objects created with a null prototype have no inherited properties:

```javascript id="for-in-null-prototype"
const object = Object.create(null);

object.first = 1;
object.second = 2;

for (const key in object) {
    console.log(key);
}
```

Only the object's own enumerable properties participate.

Such objects can be useful as dictionary-like structures, although `Map` is often a better choice when the application
requires a general-purpose key/value collection.

## for...in and Map

`Map` should not be traversed with `for...in` to obtain its entries.

```javascript id="for-in-map"
const map = new Map([
    ["name", "Alice"],
    ["age", 30]
]);

for (const entry of map) {
    console.log(entry);
}
```

`Map` is iterable, so `for...of` is the appropriate mechanism:

```javascript id="for-of-map"
for (const [key, value] of map) {
    console.log(key, value);
}
```

A `Map` is not an ordinary object-property dictionary, and its entries are not exposed through `for...in`.

## for...in and Set

Likewise, `Set` should be iterated with `for...of`:

```javascript id="for-of-set"
const values = new Set([10, 20, 30]);

for (const value of values) {
    console.log(value);
}
```

`for...in` is designed for property enumeration, not for consuming iterable collection values.

## Use Cases

`for...in` is appropriate when the actual operation is enumeration of an object's property names.

For example, dynamically inspecting an object:

```javascript id="for-in-inspection"
const configuration = {
    host: "localhost",
    port: 3000,
    secure: true
};

for (const key in configuration) {
    if (Object.hasOwn(configuration, key)) {
        console.log(`${key} = ${configuration[key]}`);
    }
}
```

It can also be appropriate when inherited enumerable properties are intentionally part of the object model:

```javascript id="for-in-inheritance"
const defaults = {
    timeout: 5000
};

const configuration = Object.create(defaults);

configuration.retries = 3;

for (const key in configuration) {
    console.log(key, configuration[key]);
}
```

The inherited `timeout` property can be intentionally included in the traversal.

## Common Misuse

A frequent mistake is using `for...in` to iterate array values:

```javascript id="for-in-misuse-array"
const values = [10, 20, 30];

for (const value in values) {
    console.log(value);
}
```

This prints:

```text
0
1
2
```

not:

```text
10
20
30
```

Use:

```javascript id="for-in-correct-array"
for (const value of values) {
    console.log(value);
}
```

Another common mistake is assuming that `for...in` only returns own properties:

```javascript id="for-in-misuse-inherited"
for (const key in object) {
    process(object[key]);
}
```

If inherited enumerable properties are not intended, use:

```javascript id="for-in-correct-inherited"
for (const key in object) {
    if (Object.hasOwn(object, key)) {
        process(object[key]);
    }
}
```

## Algorithmic Considerations

The overall cost of a `for...in` loop depends on the number of enumerable properties encountered and the
object/prototype structure.

Conceptually, if `n` properties are enumerated and each property is processed in constant time, the loop performs
approximately `O(n)` work:

```javascript id="for-in-complexity"
for (const key in object) {
    process(object[key]);
}
```

However, the cost of property lookup, prototype traversal, and the work performed inside `process()` must be considered
separately.

Do not assume a particular implementation-level complexity for property enumeration beyond what the language semantics
guarantee.

## Best Practices

* **Use `for...in` for property enumeration:** Its primary purpose is enumerating an object's enumerable string-keyed
  properties.
* **Do not use `for...in` for array values:** Use `for...of`, array iteration methods, or a traditional `for` loop
  depending on whether you need values, transformations, or indexes.
* **Remember that keys are strings:** Even numeric-looking property names are delivered as strings.
* **Account for inherited properties:** `for...in` can enumerate enumerable properties from the prototype chain.
* **Use `Object.hasOwn()` when only own properties are valid:** Do not assume every key belongs directly to the object
  being processed.
* **Prefer `Object.entries()` when both keys and values are required:** It provides an explicit own-property key/value
  representation.
* **Prefer `Object.keys()` when only own keys are required:** It makes the intended property boundary explicit.
* **Do not rely on `for...in` for custom ordering:** If ordering is semantically important, use a data structure whose
  ordering semantics directly represent the requirement.
* **Avoid mutating the object during enumeration:** Adding, deleting, or changing properties while traversing makes the
  behavior harder to reason about.
* **Do not enumerate arrays with `for...in`:** Arrays are objects and can contain non-index enumerable properties and
  inherited properties.
* **Do not assume symbols are included:** `for...in` enumerates string-keyed properties, not symbol-keyed properties.
* **Be careful with untrusted objects:** Prototype-chain properties can affect enumeration. Use own-property enumeration
  when processing external data.
* **Use `Map` for dictionary-like key/value collections when appropriate:** `Map` provides explicit collection semantics
  and should be iterated with `for...of`.
* **Keep the loop body focused:** Property enumeration should perform a clearly defined operation rather than becoming a
  large block of unrelated control flow.
* **Use `const` for the loop variable when it is not reassigned:** The loop variable is normally only read during each
  iteration.
* **Prefer explicit enumeration APIs when they communicate intent better:** `Object.keys()`, `Object.values()`, and
  `Object.entries()` often make the desired property boundary clearer than `for...in`.
* **Treat prototype behavior as part of the contract:** If inherited enumerable properties are intentionally included,
  document that behavior rather than relying on it implicitly.

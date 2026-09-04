# Object Type Checking

JavaScript provides several mechanisms for identifying specific object types. Different techniques provide different
levels of reliability depending on inheritance, execution realm, and object customization.

## `typeof` Operator

The `typeof` operator evaluates an expression and returns a string representing its primitive type or whether it is an
object or function. While reliable for functions and primitive types, it lacks granularity for complex objects.

For objects like plain objects, arrays, dates, and regexes, as well as `null`, `typeof` simply returns `"object"`. For
functions and class constructors, it returns `"function"`.

```javascript
typeof {} === "object";            // true
typeof [] === "object";            // true (cannot distinguish arrays from plain objects)
typeof null === "object";          // true (legacy spec flaw)
typeof (() => {
}) === "function";  // true
```

## `instanceof` Operator

The `instanceof` operator tests whether an object's prototype chain contains the `.prototype` property of a specified
constructor function.

It is fully aware of prototype inheritance, meaning subclasses return `true` for their parent classes. However, it fails
across different execution realms such as iframes or Node.js `vm` contexts because each realm maintains its own distinct
constructor identities in memory.

```javascript
class Parent {
}

class Child extends Parent {
}

const childObj = new Child();

childObj instanceof Child;  // true
childObj instanceof Parent; // true (walks up the prototype chain)
childObj instanceof Object; // true

// Realm Issue Example:
// const iframeArray = window.frames[0].Array;
// const arr = new iframeArray();
// arr instanceof Array; // false (different Array.prototype references)
```

## `Array.isArray()`

`Array.isArray()` performs a reliable internal brand check via internal slot evaluation that correctly identifies arrays
regardless of execution realm or prototype mutations.

```javascript
Array.isArray([]);                  // true
Array.isArray(new Array());         // true
Array.isArray({length: 0});       // false (array-like object)

// Works seamlessly across execution realms / iframes
```

## `Object.prototype.toString.call()`

Calling `Object.prototype.toString()` with an explicit receiver using `.call()` or `.apply()` inspects the internal
class slot of an object and returns a standardized string tag.

This technique provides broad compatibility and reliably identifies arrays, dates, regular expressions, maps, sets, and
error instances without realm mismatch issues.

```javascript
const getTypeTag = (val) => Object.prototype.toString.call(val);

getTypeTag([]);             // "[object Array]"
getTypeTag(new Date());     // "[object Date]"
getTypeTag(/regex/);        // "[object RegExp]"
getTypeTag(new Map());      // "[object Map]"
getTypeTag(null);           // "[object Null]"
getTypeTag(undefined);      // "[object Undefined]"
```

## Constructor Property Inspection

The `.constructor` property references the function that originally created the instance.

This method is generally unreliable and fragile because the property can be explicitly overwritten, lost during
prototype replacement, or mutated.

```javascript
const obj = [];
obj.constructor === Array; // true

// Fragile:
function CustomType() {
}

CustomType.prototype = {}; // Replaces prototype without re-assigning constructor

const instance = new CustomType();
instance.constructor === CustomType; // false (falls back to Object)
instance.constructor === Object;     // true
```

## Custom Type Identification via `Symbol.toStringTag`

Objects can customize the string output of `Object.prototype.toString()` by defining a `Symbol.toStringTag` property on
their instance or prototype.

```javascript
class CustomClass {
    get [Symbol.toStringTag]() {
        return "CustomClass";
    }
}

const item = new CustomClass();
Object.prototype.toString.call(item); // "[object CustomClass]"
```

## Duck Typing and Feature Detection

Duck typing verifies whether an object implements specific properties or methods rather than checking its strict
structural type.

This approach is commonly used to identify Thenables and Promises by checking for a `then` function, or Iterables by
checking for an iterator symbol method.

```javascript
function isPromise(obj) {
    return obj !== null && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}

function isIterable(obj) {
    return obj !== null && typeof obj !== "undefined" && typeof obj[Symbol.iterator] === "function";
}

isPromise(Promise.resolve()); // true
isIterable([1, 2, 3]);        // true
isIterable("text");           // true
```

## Structural Comparison Summary

| Method                      | Realm Safe? | Prototype Chain Aware? | Works for Custom Tagging?  | Identifies `null`/`undefined`?     |
|:----------------------------|:------------|:-----------------------|:---------------------------|:-----------------------------------|
| `typeof`                    | Yes         | No                     | No                         | Returns `"object"` / `"undefined"` |
| `instanceof`                | No          | Yes                    | No                         | Throws `TypeError`                 |
| `Array.isArray()`           | Yes         | No                     | No                         | Returns `false`                    |
| `Object.prototype.toString` | Yes         | No                     | Yes (`Symbol.toStringTag`) | Yes                                |
| Duck Typing                 | Yes         | N/A                    | N/A                        | Safe with null guards              |

## Deep Object Type Check

```javascript
function getDeepType(value) {
    // 1. Guard against null (typeof null is "object" in legacy JS)
    if (value === null) {
        return "null";
    }

    // 2. Handle primitive types and functions via standard typeof
    const type = typeof value;
    if (type !== "object") {
        return type; // "string", "number", "boolean", "undefined", "symbol", "bigint", "function"
    }

    // 3. Inspect custom Symbol.toStringTag if defined on the object or its prototype
    const tag = value[Symbol.toStringTag];
    if (typeof tag === "string") {
        return tag;
    }

    // 4. Handle arrays safely across execution realms
    if (Array.isArray(value)) {
        return "Array";
    }

    // 5. Fallback to Object.prototype.toString.call() to extract internal class slots
    // e.g., "[object Date]" -> "Date", "[object Map]" -> "Map"
    const stringTag = Object.prototype.toString.call(value);
    const matchedType = stringTag.slice(8, -1);

    return matchedType;
}

// Test Cases & Edge Cases
console.log(getDeepType(null));                  // "null"
console.log(getDeepType(undefined));             // "undefined"
console.log(getDeepType(123));                   // "number"
console.log(getDeepType("hello"));               // "string"
console.log(getDeepType([]));                    // "Array"
console.log(getDeepType({}));                    // "Object"
console.log(getDeepType(new Date()));            // "Date"
console.log(getDeepType(/regex/));               // "RegExp"
console.log(getDeepType(new Map()));             // "Map"

class CustomItem {
    get [Symbol.toStringTag]() {
        return "CustomItemType";
    }
}

console.log(getDeepType(new CustomItem()));     // "CustomItemType"
```
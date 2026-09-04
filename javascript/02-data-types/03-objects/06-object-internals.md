# Object Internals

## Object Internals Concept

Object internals refer to the underlying JavaScript runtime mechanisms that govern how objects store properties, execute
behaviors, and manage access rules. Beyond user-visible key-value pairs, properties maintain internal flags and
descriptors that regulate visibility, mutability, and configurability.

These internal characteristics are controlled through:

* Property descriptors.
* Property flags.
* Object integrity levels.

## Property Descriptors

A property descriptor is an internal specification object defining the behavioral attributes of an object's property.
Descriptors fall into two distinct structural categories depending on how property access is handled:

| Descriptor Type      | Used For                                   |
|:---------------------|:-------------------------------------------|
| Data descriptors     | Properties storing values directly         |
| Accessor descriptors | Properties governed by getters and setters |

## Data Property Descriptors

Data properties store values directly in the property binding. Their internal descriptors are defined by four core
attributes:

| Attribute      | Purpose                                                          |
|:---------------|:-----------------------------------------------------------------|
| `value`        | Stores the actual property value                                 |
| `writable`     | Controls value modification permissions                          |
| `enumerable`   | Controls property visibility during iteration/enumeration        |
| `configurable` | Controls whether property descriptors can be modified or deleted |

```javascript
const obj = {};
Object.defineProperty(obj, 'id', {
    value: 42,
    writable: false,
    enumerable: true,
    configurable: false,
});

console.log(obj.id); // 42
obj.id = 99;          // silently ignored (non-strict) / throws (strict mode)
console.log(obj.id);  // 42
```

## Accessor Property Descriptors

Accessor properties bind property access to getter and setter functions rather than direct memory slots.

| Attribute      | Purpose                                                   |
|:---------------|:----------------------------------------------------------|
| `get`          | Function executed when reading the property               |
| `set`          | Function executed when writing to the property            |
| `enumerable`   | Controls property visibility during iteration/enumeration |
| `configurable` | Controls descriptor modification and deletion permissions |

Accessor descriptors omit `value` and `writable` in favor of `get` and `set` methods — a single descriptor object cannot
mix `value`/`writable` with `get`/`set`; attempting to do so throws a `TypeError`.

```javascript
const person = {};
Object.defineProperty(person, 'fullName', {
    get() {
        return `${this.first} ${this.last}`;
    },
    set(value) {
        [this.first, this.last] = value.split(' ');
    },
    enumerable: true,
    configurable: true,
});
```

## Property Flags

Property flags are boolean internal markers attached to properties that dictate their runtime behavior.

The primary property flags include:

* `writable`
* `enumerable`
* `configurable`

## writable Flag

The `writable` flag determines whether a data property's assigned value can be overwritten.

| Value   | Result                           |
|:--------|:---------------------------------|
| `true`  | Property value can be reassigned |
| `false` | Property value is read-only      |

Modifying a non-writable property in strict mode throws a `TypeError`; in non-strict (sloppy) mode, the assignment fails
silently and the value remains unchanged.

## enumerable Flag

The `enumerable` flag controls whether a property is exposed during object property enumeration loops and key extraction
methods.

Enumerable properties appear in operations such as:

* `for...in` loops.
* `Object.keys()` property extraction.
* JSON serialization (`JSON.stringify()`).

| Value   | Result                      |
|:--------|:----------------------------|
| `true`  | Included during enumeration |
| `false` | Omitted from enumeration    |

Properties created via normal assignment (`obj.x = 1`) or object literals default to `enumerable: true`; properties
defined via `Object.defineProperty()` default to `enumerable: false` unless set explicitly.

## configurable Flag

The `configurable` flag regulates whether a property can be deleted from an object or have its property descriptor
attributes altered.

| Value   | Result                                                  |
|:--------|:--------------------------------------------------------|
| `true`  | Property can be deleted and descriptor flags modified   |
| `false` | Property deletion and descriptor changes are restricted |

Setting `configurable: false` prevents a property from being converted between data and accessor types, and prevents
most further descriptor changes — with one narrow exception: a non-configurable *writable* data property can still have
its `value` changed (just not its `writable`/`enumerable`/`configurable` flags), and can still be made non-writable, but
never writable again once set to `false`.

## Object.defineProperty ()

`Object.defineProperty()` is a static utility method used to explicitly create or adjust a single property on a target
object using a specific descriptor configuration. It provides granular low-level control over property flags.

## Object.defineProperties ()

`Object.defineProperties()` expands property configuration capabilities by defining or updating multiple properties on
an object simultaneously using a map of property descriptors.

```javascript
const config = {};
Object.defineProperties(config, {
    version: {value: '1.0.0', writable: false, enumerable: true},
    debug: {value: false, writable: true, enumerable: true},
});
```

## Object.getOwnPropertyDescriptor () and Object.getOwnPropertyDescriptors ()

`Object.getOwnPropertyDescriptor(obj, key)` retrieves the internal descriptor configuration for a single own property,
allowing inspection of value bindings, getters, setters, and descriptor flags. `Object.getOwnPropertyDescriptors(obj)`
returns the descriptors for **every** own property at once, as a map keyed by property name — commonly used together
with `Object.defineProperties()` to correctly clone an object including its accessors and flags, which a plain
`Object.assign()` copy would lose (`Object.assign()` copies a getter's *return value*, not the getter itself).

```javascript
console.log(Object.getOwnPropertyDescriptor(config, 'version'));
// { value: '1.0.0', writable: false, enumerable: true, configurable: false }

const clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(config));
```

## Object.freeze ()

`Object.freeze()` applies the highest built-in runtime restriction level to an object. It makes an object entirely
immutable by preventing property additions, deletions, and value reassignments.

## Freeze Behavior

Calling `Object.freeze()` performs three distinct actions on the target object:

| Action                           | Result                                                    |
|:---------------------------------|:----------------------------------------------------------|
| Prevent extensions               | Yes (no new properties added)                             |
| Make properties non-writable     | Yes (existing values locked)                              |
| Make properties non-configurable | Yes (properties locked from deletion or re-configuration) |

```javascript
const settings = Object.freeze({theme: 'dark'});
settings.theme = 'light';   // fails silently / throws in strict mode
delete settings.theme;      // fails silently / throws in strict mode
console.log(settings.theme); // "dark"
```

## Object.seal ()

`Object.seal()` prevents properties from being added or deleted while keeping existing writable properties mutable.

| Operation              | Allowed |
|:-----------------------|:--------|
| Add properties         | No      |
| Delete properties      | No      |
| Update writable values | Yes     |

## Object.preventExtensions ()

`Object.preventExtensions()` restricts an object by preventing new properties from ever being added to it, though
existing properties can still be deleted or modified.

## Checking Integrity State

Each restriction level has a corresponding checker method to test whether it has already been applied:

| Method                     | Returns `true` when...                                 |
|:---------------------------|:-------------------------------------------------------|
| `Object.isExtensible(obj)` | New properties can still be added                      |
| `Object.isSealed(obj)`     | The object is sealed (or frozen, which implies sealed) |
| `Object.isFrozen(obj)`     | The object is fully frozen                             |

```javascript
const locked = Object.freeze({a: 1});
Object.isExtensible(locked); // false
Object.isSealed(locked);     // true — freeze implies seal
Object.isFrozen(locked);     // true
```

## Object Integrity Levels

JavaScript offers progressive levels of object protection depending on mutability requirements:

| Method              | Add Properties | Remove Properties | Modify Values |
|:--------------------|:---------------|:------------------|:--------------|
| Normal object       | Yes            | Yes               | Yes           |
| `preventExtensions` | No             | Yes               | Yes           |
| `seal`              | No             | No                | Yes           |
| `freeze`            | No             | No                | No            |

## Shallow Nature of Object Restrictions

All native object integrity methods (`freeze`, `seal`, `preventExtensions`) operate strictly as shallow mutations. They
only protect immediate top-level properties; referenced child objects remain fully mutable unless restricted
individually.

| Object State      | Nested Object |
|:------------------|:--------------|
| Frozen parent     | Still mutable |
| Sealed parent     | Still mutable |
| Restricted parent | Still mutable |

```javascript
const state = Object.freeze({user: {name: 'Alex'}});
state.user.name = 'Sam'; // succeeds — freeze() did not reach the nested object
```

A true deep freeze requires explicit recursion:

```javascript
function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach((key) => {
        const value = obj[key];
        if (value && typeof value === 'object') deepFreeze(value);
    });
    return Object.freeze(obj);
}
```

## Use Cases

Internal property management and integrity methods enable important API design patterns:

* **Protecting configuration objects:** Securing critical runtime or system settings against unintended modifications.
* **Creating immutable constants:** Guaranteeing data records maintain state consistency.
* **Library design:** Restricting key properties to safeguard core SDK APIs.
* **Debugging object behavior:** Inspecting hidden flags to diagnose iteration or assignment issues.

## Performance Considerations

Managing object descriptors affects engine-level hidden classes and shape optimizations.

| Factor                      | Description                                                                  |
|:----------------------------|:-----------------------------------------------------------------------------|
| Frequent descriptor changes | Modifying descriptors at runtime can deoptimize hidden classes in JS engines |
| Frozen structures           | Immutable shapes allow runtime engines to optimize lookup paths safely       |
| Large object graphs         | Recursively deep freezing large object graphs incurs traversal costs         |

## Best Practices

* **Use property descriptors when precise control is required:** Utilize `Object.defineProperty()` to create read-only
  or hidden properties.
* **Understand descriptor flags before modifying properties:** Always verify `writable`, `enumerable`, and
  `configurable` defaults to avoid unintended behavior.
* **Use `Object.freeze()` for immutable references:** Apply `freeze()` to lock configuration payloads, remembering that
  deep-freezing requires explicit recursion.
* **Choose the appropriate integrity level:** Select `preventExtensions`, `seal`, or `freeze` based on whether deletion
  or mutation needs to be permitted.
* **Avoid unnecessary object restrictions:** Reserve object integrity enforcement for public boundaries and frozen
  states where structural guarantees are required.
* **Check integrity state with `isFrozen`/`isSealed`/`isExtensible` before assuming it — don't just re-apply the
  restriction defensively.** Re-calling `Object.freeze()` on an already-frozen object is harmless but redundant;
  checking first documents intent and catches cases where an object was unexpectedly left mutable.
* **Use `Object.getOwnPropertyDescriptors()` (plural) when truly cloning an object, not `Object.assign()`.**
  `Object.assign()` invokes source getters and copies only their *return values*, silently converting accessor
  properties into plain data properties on the copy —
  `Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj))` preserves getters, setters, and flags intact.
* **Remember that `configurable: false` is a one-way door for `writable`.** A non-configurable property can still go
  from `writable: true` to `false`, but never back to `true` — plan descriptor flags with this asymmetry in mind rather
  than assuming they can be freely toggled later.
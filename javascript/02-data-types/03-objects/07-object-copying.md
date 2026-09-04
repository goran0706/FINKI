# Object Copying

## Object Copying Concept

Object copying is the process of creating a new object based on the properties of an existing object. Because objects in
JavaScript are reference types, assigning an object variable to another variable merely copies the memory reference
rather than duplicating the underlying value, making an explicit copying operation necessary to produce an independent
object.

| Operation         | Result             |
|:------------------|:-------------------|
| Object assignment | Copies reference   |
| Object copying    | Creates new object |

## Reference Assignment vs Copying

When an object is assigned to a new variable, both variables share a reference pointing to the exact same underlying
memory address. As a result, mutations performed through either variable directly affect the single shared object,
whereas an explicit object copying operation allocates a separate object instance in memory.

## Shallow Copy

A shallow copy duplicates an object's top-level properties into a new outer container while preserving direct references
to any nested objects or arrays. While primitive values are duplicated independently, nested reference types continue to
point to their original locations in memory.

## Shallow Copy Behavior

During a shallow copy operation, first-level primitive values are copied directly into the new object structure, whereas
nested object and array references are copied by address. Because the underlying nested structures remain shared,
modifications to nested properties reflect across both the original and copied instances.

| Value Type       | Copy Behavior    |
|:-----------------|:-----------------|
| Primitive values | Copied directly  |
| Object values    | Reference copied |
| Array values     | Reference copied |

```javascript
const original = {name: 'Widget', meta: {version: 1}};
const copy = {...original};

copy.name = 'Gadget';
console.log(original.name); // "Widget" — top-level primitive, unaffected

copy.meta.version = 2;
console.log(original.meta.version); // 2 — nested object shared, both affected
```

## Common Shallow Copy Methods

JavaScript provides multiple standard mechanisms for creating shallow copies of objects and collections. These
techniques replicate only the top-level enumerable properties, leaving nested structures shared.

| Method                                          | Behavior                     |
|:------------------------------------------------|:-----------------------------|
| Object spread (`...`)                           | Copies enumerable properties |
| `Object.assign()`                               | Copies enumerable properties |
| Array methods (`slice`, `concat`, `Array.from`) | Copy array elements          |

Object spread and `Object.assign()` are not fully interchangeable: spread only works inside an object literal and always
produces a brand-new object, while `Object.assign(target, ...sources)` mutates and returns the `target` you pass it —
using `{}` as the target is what makes it behave like spread. Both also copy a source getter's *return value*, not the
accessor itself, silently converting an accessor property into a plain data property on the copy —
`Object.getOwnPropertyDescriptors()` paired with `Object.defineProperties()` is required if getters/setters must survive
the copy.

## Deep Copy

A deep copy duplicates the complete object structure recursively, allocating new instances for every nested object,
array, or complex data property. This process fully severs shared memory references, ensuring that changes made anywhere
within the copied tree leave the original data structure entirely untouched.

## Deep Copy Behavior

Deep copying algorithms traverse the object graph to recursively instantiate copies of all nested values. This
guarantees full structural isolation between the original object and the generated duplicate.

| Value Type       | Copy Behavior       |
|:-----------------|:--------------------|
| Primitive values | Copied directly     |
| Nested objects   | New objects created |
| Arrays           | New arrays created  |

## Shallow Copy vs Deep Copy

Choosing between shallow and deep copying depends on whether nested sub-structures should maintain shared references or
achieve total memory independence.

| Feature                  | Shallow Copy | Deep Copy |
|:-------------------------|:-------------|:----------|
| Creates new outer object | Yes          | Yes       |
| Copies nested objects    | No           | Yes       |
| Shares references        | Yes          | No        |
| More expensive           | No           | Yes       |

## The `JSON.parse(JSON.stringify(obj))` Trick — and Why to Avoid It

Before `structuredClone()` existed, a common deep-copy shortcut was round-tripping an object through JSON serialization.
It's still seen in older code and worth naming specifically because of what it silently breaks:

| Data                | Result after `JSON.parse(JSON.stringify(x))`        |
|:--------------------|:----------------------------------------------------|
| `undefined` values  | Property is dropped entirely                        |
| Functions           | Property is dropped entirely                        |
| `Date` objects      | Converted to ISO date strings, not `Date` instances |
| `Map` / `Set`       | Converted to `{}` (empty object)                    |
| `NaN` / `Infinity`  | Converted to `null`                                 |
| Circular references | Throws a `TypeError`                                |

`structuredClone()` (covered below) handles every one of these cases correctly and should be preferred in any
environment where it's available.

## Structured Cloning

Structured cloning is a built-in browser and runtime copying algorithm—accessible via the `structuredClone()` global
function—that creates deep copies of supported JavaScript values. It seamlessly handles complex nested hierarchies,
circular references, and diverse built-in types (including `Date`, `Map`, `Set`, `RegExp`, and typed arrays) without
manual recursive mapping.

## Structured Clone Behavior

While structured cloning provides native deep copying for complex data graphs, it operates under strict compatibility
boundary rules. Functions, DOM nodes, property descriptors, and certain system-bound objects cannot be cloned because
they rely on external execution contexts — attempting to clone them throws a `DataCloneError`, rather than silently
dropping the unsupported value the way the JSON trick does.

| Feature                       | Behavior |
|:------------------------------|:---------|
| Creates deep copy             | Yes      |
| Handles nested objects        | Yes      |
| Preserves many built-in types | Yes      |
| Supports every value type     | No       |

## Deep Merge Concepts

Deep merging is the process of recursively combining multiple source objects into a target object while cloning nested
structures at every level. Unlike simple top-level property overwrites, deep merging evaluates nested key collisions
individually to preserve existing nested entries alongside new default settings, configuration overrides, or state
updates.

There is no built-in `Object` method for deep merging — `Object.assign()` and spread only merge at the top level,
silently overwriting an entire nested object rather than merging its keys:

```javascript
const defaults = {theme: {mode: 'light', fontSize: 14}};
const overrides = {theme: {fontSize: 18}};

console.log({...defaults, ...overrides});
// { theme: { fontSize: 18 } } — mode is gone; the whole nested object was replaced, not merged
```

Deep merging requires either a hand-written recursive function or a well-tested utility library (e.g., Lodash's
`merge`) — reaching for one of these, rather than assuming spread merges recursively, is the key thing to get right
here.

## Object Copying and References

Understanding how memory references propagate across copying operations is critical when managing application state. The
depth of a copy determines whether mutations to internal fields remain isolated or unexpectedly bleed into linked
objects throughout the application graph.

## Copying Objects with Circular References

Circular references occur when an object directly or indirectly contains a reference to itself within its property tree.
Basic recursive copying algorithms encounter infinite stack loops on circular structures unless they actively track
previously cloned objects using lookup maps. `structuredClone()` handles circular references correctly out of the box; a
hand-written recursive deep-clone function does not, unless it explicitly implements this tracking.

## Use Cases

Object copying operations underpin fundamental data isolation and state management patterns in JavaScript applications:

* **Preserving original data:** Creating defensive copies prior to executing destructive transformations.
* **Managing application state:** Enforcing immutability patterns to prevent unwanted side-effect mutations across
  components.
* **Combining configurations:** Merging base default options with custom runtime settings through deep or shallow
  assignment.
* **Working with complex structures:** Generating independent copies of deeply nested data arrays and state trees.

## Performance Considerations

Duplicating objects incurs computational overhead and memory allocations proportional to the depth and size of the data
structure.

| Factor            | Description                                                                      |
|:------------------|:---------------------------------------------------------------------------------|
| Object size       | Larger objects with high key counts require increased memory and processing time |
| Copy depth        | Deep recursive traversals are significantly more expensive than shallow copies   |
| Reference sharing | Shallow copying executes rapidly by avoiding recursive memory allocation         |

## Best Practices

* **Understand whether references should be shared:** Evaluate whether child data needs independent cloning or if shared
  memory references are structurally intended.
* **Use shallow copies for simple structures:** Apply object spread (`...`) or `Object.assign()` for single-level flat
  objects to minimize memory overhead.
* **Use deep copies when full independence is required:** Utilize `structuredClone()` when working with nested
  structures where child mutations must never affect the source object.
* **Choose the copying method based on data complexity:** Match the cloning strategy to the data type, using structured
  cloning for rich nested graphs and shallow spread operations for basic key-value dictionaries.
* **Avoid unnecessary copying:** Avoid duplicating large data structures in high-frequency execution paths to prevent
  garbage collection spikes.
* **Leverage native structured cloning for complex trees:** Use `structuredClone()` as the default modern approach for
  deep copying nested objects, arrays, maps, and sets without third-party utility overhead.
* **Guard against structured clone unsupported types:** Remember that `structuredClone()` throws errors when
  encountering functions, DOM nodes, or object prototypes, requiring explicit serialization fallbacks for these
  structures.
* **Track recursive object references manually in custom cloners:** Implement a `Map`-based reference tracker when
  writing custom deep clone utilities to safely handle circular references and prevent stack overflow errors.
* **Preserve prototype chains when required:** Recognize that `structuredClone()` and standard shallow spread operations
  (`...`) reset prototype chains to standard `Object.prototype`, and use custom instantiation logic if class instance
  methods must be retained.
* **Combine spread syntax with computed keys safely:** Use object spread syntax for shallow property overrides while
  ensuring that nested objects are explicitly cloned to avoid unintended mutation vectors.
* **Avoid deep cloning in high-frequency render loops:** Restrict heavy deep copying operations to state initialization
  or infrequent action handlers, preventing excessive garbage collection pauses during active UI animations.
* **Adopt immutable data patterns for predictable state:** Pair object copying strategies with state management
  libraries or patterns (such as Redux or functional reducers) to ensure historical state traces remain entirely pure.
* **Deep freeze test fixtures and configuration constants:** Apply `Object.freeze()` recursively or use immutable
  compilation flags on shared configuration dictionaries to catch accidental runtime mutation bugs early.
* **Sanitize cloned payloads before persistence:** Ensure sensitive internal metadata, temporary UI flags, or
  non-serializable fields are stripped out before passing cloned objects to storage APIs or network payloads.
* **Profile memory consumption of large deep clones:** Use browser memory profilers to monitor heap allocation spikes
  when duplicating large, deeply nested client-side state trees under heavy load.
* **Never assume `{ ...defaults, ...overrides }` merges nested objects — it replaces them entirely.** This is one of the
  most common real-world state bugs: a nested config object with only one changed key silently loses every sibling key
  it didn't explicitly restate. Reach for a real deep-merge utility whenever the source objects have nested structure,
  not just spread.
* **Avoid the legacy `JSON.parse(JSON.stringify(obj))` deep-copy trick now that `structuredClone()` is broadly
  available.** It silently drops `undefined` values and functions, converts `Date` to strings, breaks `Map`/`Set`, and
  turns `NaN`/`Infinity` into `null` — all without any error, making bugs from this pattern very easy to miss in review.
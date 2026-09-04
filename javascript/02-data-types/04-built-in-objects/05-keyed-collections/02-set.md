# Set

## Concept and ECMAScript Specification

The `Set` constructor creates collection objects that store unique values of any type, whether primitive values or
object references. According to the ECMA-262 specification, `Set` objects maintain an ordered list of elements in an
internal `[[SetData]]` slot. Elements within a `Set` are unique; duplicate values are automatically discarded during
insertion operations.

Uniqueness and value equality are evaluated using the `SameValueZero` specification algorithm. Under `SameValueZero`,
`NaN` is considered equal to `NaN` (so a `Set` can contain at most one `NaN` value), and `-0` is considered equal to
`+0`.

| Characteristic         | ECMAScript Specification Behavior                                                       |
|:-----------------------|:----------------------------------------------------------------------------------------|
| Function Invocation    | Calling `Set()` without `new` throws a `TypeError`                                      |
| Value Types            | Accepts any valid ECMAScript primitive or object instance                               |
| Uniqueness Equality    | Uses `SameValueZero` algorithm (`NaN` equals `NaN`, `-0` equals `+0`)                   |
| Iteration Order        | Guarantees element traversal strictly in insertion order                                |
| Complexity Requirement | Spec requires operations to execute in sublinear average time relative to element count |

## Instance Properties and Prototype Methods

`Set.prototype` provides instance methods to add values, remove elements, inspect existence, clear the collection, and
generate iterators over stored values.

| Property / Method            | Category                 | Specification Behavior                                                                |
|:-----------------------------|:-------------------------|:--------------------------------------------------------------------------------------|
| `size`                       | Instance Property Getter | Returns the total count of unique values stored in `[[SetData]]`                      |
| `add(value)`                 | Mutator Method           | Appends a value if not already present; returns the `Set` instance to enable chaining |
| `has(value)`                 | Accessor Method          | Returns `true` if the specified value exists within the collection; otherwise `false` |
| `delete(value)`              | Mutator Method           | Removes the value from the set; returns `true` if the element was present and removed |
| `clear()`                    | Mutator Method           | Removes all values from the set instance                                              |
| `values()` / `keys()`        | Iterator Generator       | Returns a new iterator object yielding elements in insertion order                    |
| `entries()`                  | Iterator Generator       | Returns an iterator yielding `[value, value]` tuples for compatibility with `Map`     |
| `forEach(callback, thisArg)` | Iteration Method         | Executes `callback` once per element in insertion order                               |

## Set Composition Methods

Standard ECMAScript set operations enable mathematical comparisons and combinations between two set instances or
set-like objects without manually iterating over elements.

| Method                       | Mathematical Operation | Specification Behavior                                                            |
|:-----------------------------|:-----------------------|:----------------------------------------------------------------------------------|
| `union(other)`               | $A \cup B$             | Returns a new `Set` containing elements present in either set                     |
| `intersection(other)`        | $A \cap B$             | Returns a new `Set` containing elements present in both sets                      |
| `difference(other)`          | $A \setminus B$        | Returns a new `Set` containing elements in this set that are not in the other set |
| `symmetricDifference(other)` | $A \Delta B$           | Returns a new `Set` containing elements in either set, but not in both            |
| `isSubsetOf(other)`          | $A \subseteq B$        | Returns `true` if all elements in this set are present in the other set           |
| `isSupersetOf(other)`        | $A \supseteq B$        | Returns `true` if this set contains all elements present in the other set         |
| `isDisjointFrom(other)`      | $A \cap B = \emptyset$ | Returns `true` if this set shares no common elements with the other set           |

## Use Cases

`Set` collections streamline uniqueness guarantees and membership evaluations across processing pipelines:

* **Eliminating duplicate values:** Deduplicating array elements efficiently via `Array.from(new Set(array))` or
  `[...new Set(array)]`.
* **Fast membership testing:** Executing $O(1)$ presence checks with `.has()` rather than performing linear $O(n)$
  searches via `Array.prototype.includes()`.
* **Relational data comparison:** Performing mathematical intersection or difference evaluations between collections
  using composition methods like `.intersection()`.

## Best Practices

* **Always instantiate Set using new:** Call `new Set()` explicitly to prevent runtime `TypeError` exceptions.
* **Prefer Set.prototype.has over Array.prototype.includes for frequent lookups:** Use `Set` when testing existence
  across large datasets to benefit from constant-time $O(1)$ average lookup efficiency.
* **Leverage native composition methods for set math:** Utilize `.union()`, `.intersection()`, and `.difference()`
  rather than writing manual iteration routines or custom filter logic.
* **Remember that object references compare by identity:** Ensure distinct objects are not expected to deduplicate based
  on property similarity; two separate objects with identical keys and values remain distinct entries inside a `Set`.
* **Be aware of SameValueZero uniqueness semantics:** Keep in mind that multiple `NaN` values collapse into a single
  entry and `-0` normalizes to `+0` within set storage.
* **Use spread syntax or Array.from for fast array deduplication:** Clean duplicate elements from arrays efficiently
  using `[...new Set(arr)]` or `Array.from(new Set(arr))`.
* **Pass iterable collections directly into the constructor:** Initialize sets with initial elements efficiently by
  passing an array or iterable (e.g., `new Set([1, 2, 3])`) rather than calling individual `.add()` methods separately.
* **Use `.size` instead of manual length counters:** Access `.size` directly to determine the number of unique elements
  stored in the set instance.
* **Chain `.add()` calls during set construction:** Leverage method chaining `set.add(v1).add(v2)` when appending
  multiple elements fluently.
* **Use `isDisjointFrom()` for efficient overlap checks:** Check whether two collections share zero common elements
  using `.isDisjointFrom(other)` instead of manually filtering intersections.
* **Iterate over sets with for...of loops:** Traverse unique values clearly using standard `for (const value of set)`
  loops in insertion order.
* **Use `.clear()` to empty sets instantly:** Reset collection instances using `.clear()` rather than re-instantiating
  new sets or iterating through individual deletions.
* **Validate set-like objects in composition methods:** Ensure that custom set-like arguments passed to methods like
  `union()` or `intersection()` adhere to expected iterable protocols to prevent runtime errors.
* **Avoid storing mutable objects without careful tracking:** Keep in mind that mutating properties of objects stored
  inside a set does not affect their unique presence or internal identity hash.
* **Prefer Sets to Arrays for distinct token collections:** Use `Set` instances when managing unique lists of active
  tags, permissions, or IDs to prevent accidental duplicate entries.
# Array

## Concept and ECMAScript Specification

The `Array` constructor creates array objects used to manage ordered, integer-indexed collections of values. According
to the ECMA-262 specification, an `Array` is an exotic object that overrides default internal property behavior to
maintain an auto-updating `length` property. The `length` property of an `Array` exotic object is guaranteed to be a
non-negative integer strictly greater than every own numeric property key, and setting `length` to a smaller value
automatically deletes all own elements whose numeric index is greater than or equal to the new length.

| Characteristic                    | ECMAScript Specification Behavior                                                             |
|:----------------------------------|:----------------------------------------------------------------------------------------------|
| Function / Constructor Invocation | `Array(...args)` and `new Array(...args)` behave identically during instantiation             |
| Exotic Object Property            | Overrides `[[DefineOwnProperty]]` to automatically enforce the `length` invariant             |
| Array Index Boundary              | Numeric keys are valid array indices if they are integers in the range $0 \le i < 2^{32} - 1$ |
| Maximum Array Length              | Constrained by specification to $2^{32} - 1$ elements ($4,294,967,295$)                       |

## Static Utility Methods

The `Array` constructor provides static methods to evaluate array status and convert array-like or iterable objects into
true `Array` instances.

| Method                              | Specification Behavior                                                                                   |
|:------------------------------------|:---------------------------------------------------------------------------------------------------------|
| `Array.isArray(value)`              | Determines whether the passed value is an `Array` exotic object via internal slot inspection             |
| `Array.from(items, mapFn, thisArg)` | Converts an iterable or array-like object into a new `Array` instance, with optional mapping             |
| `Array.of(...items)`                | Creates a new `Array` instance with a variable number of arguments, regardless of argument count or type |

## Prototype Mutator, Accessor, and Iteration Methods

`Array.prototype` contains methods categorized by operational behavior: mutator methods modify the existing array in
place, accessor methods return new values or shallow copies without mutation, and iteration methods execute callbacks
across elements.

| Category  | Prototype Methods                                                                                                                                                                                      |
|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Mutators  | `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `reverse()`, `sort()`, `fill()`, `copyWithin()`                                                                                                 |
| Accessors | `concat()`, `slice()`, `join()`, `indexOf()`, `lastIndexOf()`, `includes()`, `toSorted()`, `toSpliced()`, `toReversed()`, `with()`                                                                     |
| Iterators | `forEach()`, `map()`, `filter()`, `reduce()`, `reduceRight()`, `find()`, `findIndex()`, `findLast()`, `findLastIndex()`, `some()`, `every()`, `flat()`, `flatMap()`, `entries()`, `keys()`, `values()` |

## Use Cases

`Array` instances manage ordered state across data transformations and pipeline operations:

* **Transforming data streams:** Mapping, filtering, and reducing structured objects using functional prototype
  iteration methods.
* **Non-mutating state changes:** Utilizing modern copying methods like `toSorted()` or `with()` to update collection
  entries immutably.
* **Converting array-like structures:** Converting arguments or DOM collections into arrays using `Array.from()` for
  method processing.

## Best Practices

* **Prefer literal syntax over the constructor:** Use array literal syntax `[]` instead of `new Array()` to avoid
  ambiguous behavior when passing a single numeric argument.
* **Use Array.isArray instead of instanceof:** Use `Array.isArray()` to check for array instances across separate
  execution contexts or iframes where prototype references to differ.
* **Prefer non-mutating copy methods for state updates:** Utilize non-mutating methods like `toSorted()`,
  `toReversed()`, `toSpliced()`, and `with()` when working with immutable state management patterns.
* **Avoid sparse arrays:** Prevent the creation of sparse arrays with empty holes (e.g., via `delete arr[i]` or setting
  `length` manually) to avoid engine optimization penalties and inconsistent iterator behavior.
* **Cache array length in performance-critical loops:** Store `arr.length` in a local variable before iterating over
  massive arrays in tight loops to prevent redundant property lookup overhead.
* **Use `Array.from()` for mapping during conversion:** Pass a mapping function directly into
  `Array.from(iterable, mapFn)` to convert and transform iterables or array-like objects in a single efficient pass.
* **Be aware of lexicographical default sorting:** Always supply an explicit comparison callback function to `.sort()`
  and `.toSorted()` when sorting numbers to avoid unexpected string-based comparisons (e.g., `10` preceding `2`).
* **Choose appropriate iteration methods for readability:** Use `.map()`, `.filter()`, and `.reduce()` for declarative
  data pipelines, but prefer traditional `for...of` or standard loops when early exit or extreme performance is
  required.
* **Avoid mutating arrays during active iteration:** Refrain from shifting, popping, or splicing array elements inside
  callback loops like `.forEach()` or `.map()` to prevent skipping elements or corrupting indices.
* **Use `.at()` for convenient index access:** Access elements from the end of an array cleanly using `.at(-1)` instead
  of calculating manual offsets via `arr.length - 1`.
* **Flatten nested structures safely with `.flat()`:** Specify exact depth numbers when calling `.flat(depth)` to
  flatten multidimensional arrays intentionally rather than flattening deeply nested unintended structures.
* **Use `.some()` and `.every()` for efficient checks:** Short-circuit validation loops by using `.some()` or `.every()`
  instead of iterating over entire arrays when searching for condition matches.
* **Provide initial values to `.reduce()`:** Always supply an explicit initial accumulator value to `.reduce()` to
  prevent runtime `TypeError` exceptions when processing empty arrays.
* **Prefer `.find()` and `.findIndex()` over `.filter()[0]`:** Locate specific elements efficiently using `.find()` to
  stop searching immediately upon the first match instead of filtering entire arrays.
* **Copy arrays correctly to prevent shared mutations:** Create shallow clones of arrays using spread syntax `[...arr]`
  or `arr.slice()` before modifying or sorting data structures in place.
# Object Spread

## Object Spread Concept

Object spread is a syntax that expands the enumerable own properties of an existing object into a new object literal. It
provides a concise way to clone objects, combine multiple sources, or produce modified copies while preserving the
original structure.

| Feature                     | Behavior |
|:----------------------------|:---------|
| Creates new object          | Yes      |
| Copies properties           | Yes      |
| Copies inherited properties | No       |
| Performs deep copy          | No       |

## Spread Syntax Behavior

The object spread operator (`...`) extracts enumerable own properties and assigns them to the newly constructed object
container. Because it ignores non-enumerable and prototype properties, it serves primarily as a clean, declarative
syntax for shallow property duplication and object composition.

## Object Spread and Shallow Copying

When an object is duplicated using spread syntax, a new outer object is allocated in memory, but nested reference types
retain their original memory addresses. Changes made to nested objects or arrays will therefore affect both the copied
object and the original source instance.

| Value Type      | Result           |
|:----------------|:-----------------|
| Primitive value | Copied directly  |
| Object value    | Reference copied |
| Array value     | Reference copied |

## Combining Objects

Object spread can merge properties from multiple source objects into a unified destination object. During combination,
properties are evaluated from left to right, allowing downstream values to cleanly extend or augment upstream
properties.

## Property Overwriting

When merged source objects share duplicate property keys, the final value is determined by evaluation order. Properties
spread later in the expression overwrite matching key entries declared earlier, making spread ordering a common
technique for overriding default configuration settings.

## Object Spread vs Object.assign()

While object spread and `Object.assign()` share similar copying behaviors, object spread always evaluates within an
object literal to return a new instance without mutating source targets.

| Feature                      | Object Spread | Object.assign() |
|:-----------------------------|:--------------|:----------------|
| Creates new object           | Yes           | No by default   |
| Mutates target               | No            | Yes             |
| Shallow copy                 | Yes           | Yes             |
| Copies enumerable properties | Yes           | Yes             |

## Object Rest Properties

Object rest syntax (`...`) operates as the inverse of object spread during destructuring operations, gathering all
remaining, unextracted enumerable own properties into a fresh standalone object.

## Spread vs Rest

Despite utilizing the exact same triple-dot prefix (`...`), spread and rest patterns are distinguished by their
structural placement within JavaScript code.

| Feature        | Spread          | Rest                      |
|:---------------|:----------------|:--------------------------|
| Purpose        | Expands values  | Collects remaining values |
| Used in        | Object creation | Object destructuring      |
| Creates object | Yes             | Yes                       |

## Object Spread and Immutability

Object spread serves as a core pattern in functional programming and state management architectures by favoring
immutability. Rather than directly mutating an existing state object, developer patterns utilize spread expressions to
construct updated state snapshots safely.

## Updating Objects with Spread

Combining object spread with explicit property key declarations allows specific fields to be updated while leaving all
unreferenced properties intact. This pattern produces updated object representations without altering original instance
references.

## Limitations of Object Spread

Because object spread is strictly a shallow copying mechanism, it does not clone nested object hierarchies or complex
prototype chains. It cannot clone nested arrays, copy prototype inheritance chains, duplicate non-enumerable properties,
or preserve custom property descriptors.

## Spread and Property Descriptors

Object spread retrieves values through standard property access and assigns them as simple data properties on the target
object. Consequently, special property descriptors—such as getter/setter accessors or `writable`, `enumerable`, and
`configurable` flags—are not preserved during the spread operation.

## Use Cases

Object spread and rest patterns support several standard object manipulation workflows:

* **Creating object copies:** Producing clean, single-level shallow duplicates of objects.
* **Merging objects:** Combining disparate configuration objects or state fragments into a unified record.
* **Updating state:** Deriving updated state instances in immutable data pipelines.
* **Removing properties:** Utilizing destructuring rest syntax to extract and isolate unwanted properties.

## Performance Considerations

Executing object spread operations allocates new memory objects and iterates through enumerable keys, which introduces
overhead when executed repeatedly at scale.

| Factor      | Description                                                                                                     |
|:------------|:----------------------------------------------------------------------------------------------------------------|
| Object size | Larger objects with numerous keys require more iteration and property allocations                               |
| Copy depth  | Nested references remain shared, requiring secondary spread operations for nested updates                       |
| Frequency   | Excessive re-spreading inside tight loops or high-frequency render passes increases garbage collection overhead |

## Best Practices

* **Use object spread for shallow immutable updates:** Apply spread syntax to construct modified objects without
  mutating original data structures.
* **Remember that spread creates shallow copies:** Ensure nested reference isolation is handled separately if child
  objects require independent mutation.
* **Place overriding properties after defaults:** Position default configurations first in the spread order so custom
  overrides successfully replace matching keys.
* **Use rest properties to separate remaining data:** Use rest destructuring syntax to cleanly strip unnecessary fields
  while capturing remaining key-value pairs.
* **Choose deep copying methods when nested independence is required:** Use dedicated deep cloning mechanisms like
  `structuredClone()` when working with complex, deeply nested objects.
* **Be mindful of property evaluation order:** Remember that spread expressions evaluate strictly from left to right,
  meaning properties spread later will overwrite identical keys from preceding sources.
* **Avoid deep property updates with single-level spread:** Do not assume a single spread operation updates deeply
  nested properties; nested objects must be individually spread to maintain immutability across levels.
* **Leverage rest syntax for clean props omission:** Use object rest destructuring in component parameters or utility
  functions to filter out sensitive or unwanted properties before forwarding payloads.
* **Do not use spread syntax on null or undefined sources:** Ensure that variables passed into spread positions are
  guaranteed to be objects or empty inputs, as older runtimes or strict contexts can throw type errors on nullish
  values.
* **Be aware of non-enumerable key loss:** Recognize that object spread drops non-enumerable properties and symbol-based
  metadata, requiring explicit property definition if those attributes must be preserved.
* **Keep object shape transitions consistent:** Maintain stable property ordering where possible when spreading objects
  to optimize hidden class performance inside modern JavaScript engines.
* **Combine spread with computed property names carefully:** Ensure dynamic key expressions inside object literals are
  wrapped correctly to prevent syntax parsing errors during complex object composition.
* **Avoid spreading massive collections in performance-critical loops:** Restrict spread operations on large data
  dictionaries to initialization or infrequent action handlers to minimize memory churn and allocation overhead.
* **Use Object.assign only when mutable target reuse is explicitly intended:** Favor object spread syntax for clean
  immutable expressions unless legacy performance patterns or mutable target modifications are strictly required.
* **Validate inherited property expectations:** Remember that spread operations intentionally ignore prototype chains,
  meaning inherited methods or accessor properties will not be transferred to the new object.
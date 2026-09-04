# Prototype Fundamentals

## Prototype Concept

**Prototype:** An object that another object can inherit properties and methods from, serving as the foundation of
JavaScript inheritance through internal prototype links.

## Objects and Prototype Relationships

Objects combine own properties stored directly on the instance with inherited properties accessed through prototypes to
share behavior without duplication.

| Type                 | Description                              |
|:---------------------|:-----------------------------------------|
| Own properties       | Properties directly stored on the object |
| Inherited properties | Properties accessed through prototypes   |

## Prototype Inheritance

**Prototype Inheritance:** A mechanism where objects receive access to shared methods, property reuse, and behavior
delegation from other objects through the prototype chain.

## Prototype Chain

**Prototype Chain:** A sequence of linked objects searched by JavaScript during property lookups until a match is found
or the chain ends.

| Step | Action                                     |
|:-----|:-------------------------------------------|
| 1    | Check the object's own properties          |
| 2    | Search the object's prototype              |
| 3    | Continue through the prototype chain       |
| 4    | Return the first matching property         |
| 5    | Return `undefined` if no property is found |

## Prototype Property Shadowing

**Prototype Shadowing:** A situation where an object's own property has the same name as a property on its prototype,
causing the own property to be used while the prototype property is ignored for that lookup.

## `__proto__` vs `prototype`

While related, these properties serve entirely different parts of the prototype system.

| Feature      | `__proto__`                      | `prototype`                             |
|:-------------|:---------------------------------|:----------------------------------------|
| Belongs to   | Object instances                 | Constructor functions                   |
| Purpose      | References an object's prototype | Defines prototype for created instances |
| Used during  | Property lookup                  | Object creation                         |
| Modern usage | Avoid direct use                 | Used by constructors                    |

Modern JavaScript replaces direct `__proto__` usage with `Object.getPrototypeOf()` and `Object.setPrototypeOf()`.

## Prototype Delegation & Shared Behavior

Prototype delegation allows multiple objects to share single implementations stored on prototypes rather than
duplicating methods, improving memory efficiency.

## Prototype Chain Termination

The prototype chain eventually terminates at `null`, which stops the lookup process.

## Performance Considerations

| Factor            | Description                             |
|:------------------|:----------------------------------------|
| Chain depth       | Longer chains require more lookup steps |
| Prototype changes | Can affect engine optimization          |
| Shared methods    | Reduce memory usage                     |

## Use Cases

* **Sharing methods between objects:** Prototypes allow multiple objects to reuse behavior.
* **Building inheritance systems:** Objects can inherit functionality from other objects.
* **Understanding classes:** Classes internally rely on prototypes.
* **Reducing duplication:** Shared prototype methods avoid repeated storage.

## Best Practices

* **Prefer modern prototype APIs:** Use `Object.getPrototypeOf()` and `Object.setPrototypeOf()` instead of directly
  modifying `__proto__`.
* **Understand the difference between `__proto__` and `prototype`:** Recognize that they describe different parts of the
  prototype system.
* **Keep prototype chains simple:** Avoid complex inheritance structures that are difficult to maintain.
* **Use prototypes for shared behavior:** Apply them for reusable methods and properties.
* **Learn prototypes before classes:** Master underlying prototype behavior before relying on class syntax.
* **Avoid modifying prototype chains after object creation:** Mutating prototypes dynamically at runtime causes severe
  performance degradation as JavaScript engines deoptimize object shapes.
* **Use `Object.create()` for clean delegation setup:** Initialize new objects with a designated prototype reference
  securely without relying on legacy constructor hacks.
* **Be cautious of prototype property shadowing:** Ensure own properties do not unintentionally override critical
  prototype methods unless shadowing behavior is explicitly desired.
* **Check property existence accurately:** Use `Object.hasOwn()` instead of `hasOwnProperty()` to verify whether a
  property belongs directly to an instance rather than its prototype chain.
* **Keep prototype lookup paths shallow:** Limit chain depth to minimize property resolution overhead during
  high-frequency execution loops.
* **Avoid adding state directly to shared prototypes:** Store mutable instance data on the object itself rather than the
  prototype to prevent data sharing bugs across instances.
* **Prefer classes to manual prototype manipulation:** Use modern `class` syntax for readability and standard
  maintenance unless low-level prototype control is explicitly required.
* **Inspect prototype links safely:** Use `Reflect` APIs or `Object.getPrototypeOf()` rather than reading internal
  prototype references directly.
* **Do not pollute native global prototypes:** Avoid attaching custom methods to built-in objects (`Object.prototype`,
  `Array.prototype`) to prevent naming conflicts with libraries.
* **Cache frequently accessed prototype methods locally:** Extract methods from prototypes when performing intensive
  operations to avoid repeated property lookup costs.
* **Understand `constructor` property delegation:** Recognize that an object's prototype usually points back to its
  creating constructor function unless manually overridden.
* **Test prototype inheritance explicitly:** Verify that derived objects inherit shared methods and delegate behavior
  correctly under various instantiation patterns.
* **Avoid runtime prototype reassignment:** Keep object structures consistent throughout their lifecycle to maintain
  predictable compiler optimizations.
* **Use `Object.isPrototypeOf()` for relationship checks:** Verify whether an object exists within another object's
  prototype chain safely and reliably.
* **Document custom prototype architectures clearly:** Provide explicit comments when designing low-level delegation
  systems so team members understand the object graph.
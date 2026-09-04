# Prototype Methods

## Prototype Method Concept

**Prototype Method:** A method stored on an object's prototype that can be accessed by multiple instances through
prototype inheritance, eliminating duplicate function copies and ensuring memory efficiency.

| Location         | Responsibility              |
|:-----------------|:----------------------------|
| Instance object  | Stores unique data (`this`) |
| Prototype object | Stores reusable methods     |

## Instance Methods vs Prototype Methods

| Feature      | Instance Method                               | Prototype Method                             |
|:-------------|:----------------------------------------------|:---------------------------------------------|
| Storage      | Created inside constructor for every instance | Stored once on the prototype object          |
| Memory Usage | Higher (duplicated function per instance)     | Lower (shared function across all instances) |
| Access       | Direct property lookup                        | Inherited via prototype chain                |

## Method Lookup and `this`

When a prototype method is called, JavaScript searches through the prototype chain until it finds the method, executing
it with `this` bound to the calling object instance.

## Modifying and Extending Prototypes

Because prototypes are shared, modifications instantly affect all inherited instances. While adding methods to custom
prototypes is standard practice, modifying built-in native prototypes is strongly discouraged.

| Modification Target                                  | Risk / Consideration                                                      |
|:-----------------------------------------------------|:--------------------------------------------------------------------------|
| Custom prototypes                                    | Safe and expected for object behavior models                              |
| Built-in native prototypes (`Array.prototype`, etc.) | Can cause naming conflicts, compatibility issues, and unexpected behavior |

## Prototype Methods and Classes

JavaScript classes utilize prototype methods internally; any method defined inside a class body is placed directly onto
the class prototype to ensure shared execution.

| Feature           | Underlying Prototype Behavior         |
|:------------------|:--------------------------------------|
| Class method      | Stored on the prototype object        |
| Instance creation | Links instance to prototype via chain |
| Method call       | Executes via prototype lookup         |

## Performance Considerations

| Factor                     | Effect                                   |
|:---------------------------|:-----------------------------------------|
| Shared prototype methods   | Reduce memory usage across instances     |
| Deep prototype chains      | Increase lookup steps                    |
| Frequent prototype changes | May reduce engine optimization potential |

## Use Cases

* **Sharing behavior between objects:** Store common methods once and reuse them.
* **Creating object models:** Define behavior shared by related objects.
* **Building constructor patterns:** Separate instance initialization from reusable logic.
* **Understanding classes:** Explain how JavaScript classes store methods internally.

## Best Practices

* **Store shared methods on prototypes:** Avoid creating duplicate functions for every single instance to optimize
  memory.
* **Keep instance properties for object-specific data:** Store unique state on instances while keeping shared behavior
  on prototypes.
* **Avoid native prototype modifications:** Do not add custom methods to built-in objects to prevent cross-library
  conflicts.
* **Understand method lookup order:** Recognize that instance-level properties shadow prototype methods.
* **Prefer modern class syntax for clean prototype method definition:** Use standard class declarations instead of
  manual prototype assignments to ensure readable and maintainable codebases.
* **Avoid binding `this` inside prototype methods prematurely:** Let JavaScript handle context binding naturally at call
  time unless arrow functions or explicit binds are specifically required for callbacks.
* **Keep prototype methods stateless where possible:** Design methods to operate on passed arguments or instance
  properties rather than relying on mutable shared variables.
* **Do not store large data collections on prototypes:** Keep instance-specific arrays, objects, and unique states
  within constructor assignments to prevent unintended data sharing across instances.
* **Be careful when overriding prototype methods on instances:** Understand that assigning an own property matching a
  prototype method name shadows the shared behavior for that specific object.
* **Audit prototype method performance in hot loops:** Minimize deep prototype chain lookups in high-frequency execution
  paths by caching method references locally if necessary.
* **Use concise method syntax:** Define prototype methods using shorthand method definitions rather than explicit
  property function assignments for cleaner syntax and correct constructor handling.
* **Avoid dynamic prototype extension at runtime:** Define all shared methods during initial setup to prevent engine
  deoptimizations caused by changing object shapes.
* **Test prototype inheritance explicitly:** Verify that inherited instances can access and execute prototype methods
  correctly under various object creation patterns.
* **Do not mutate prototype methods after instantiation:** Ensure shared behaviors remain stable throughout the
  application lifecycle to avoid unpredictable execution bugs.
* **Use descriptive names for shared methods:** Choose clear, action-oriented names that communicate behavior accurately
  to other developers consuming the class or constructor model.
* **Document prototype method contracts clearly:** Outline expected parameters, return types, and side effects using
  JSDoc comments or TypeScript annotations above method definitions.
* **Understand internal constructor prototype links:** Recognize that an object's `.constructor.prototype` reference
  points directly to the shared prototype object where methods reside.
* **Avoid complex closure scopes inside prototype methods:** Keep method logic clean and independent of outer lexical
  scopes to maintain predictable garbage collection and memory usage.
* **Leverage `Object.hasOwn()` for checking own properties:** Distinguish between methods stored directly on an instance
  versus those inherited from its prototype chain safely.
* **Review memory footprints when scaling instances:** Monitor how many objects are instantiated to confirm that shared
  prototype methods are successfully saving memory compared to duplicate instance functions.
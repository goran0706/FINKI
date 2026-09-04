# Native Prototypes

## Native Prototype Concept

**Native Prototypes:** Built-in prototype objects provided by JavaScript that supply shared methods and behavior for
standard object types (`Object`, `Array`, `String`, `Function`, `Number`, `Boolean`).

| Native Prototype     | Primary Purpose                       | Common Methods                                |
|:---------------------|:--------------------------------------|:----------------------------------------------|
| `Object.prototype`   | Base prototype for most objects       | `toString()`, `valueOf()`, `hasOwnProperty()` |
| `Array.prototype`    | Shared methods for arrays             | `push()`, `pop()`, `map()`, `filter()`        |
| `String.prototype`   | Shared methods for strings via boxing | `toUpperCase()`, `includes()`, `slice()`      |
| `Function.prototype` | Shared behavior for functions         | `call()`, `apply()`, `bind()`                 |

## Built-in Prototype Chains

Built-in types follow a predictable inheritance flow ending at `Object.prototype` and ultimately `null`.

| Inheritance Level  | Purpose in Built-in Types                                       |
|:-------------------|:----------------------------------------------------------------|
| Instance object    | Stores individual data or primitive value                       |
| Built-in prototype | Provides type-specific shared methods (`Array.prototype`, etc.) |
| `Object.prototype` | Provides common object behavior                                 |
| `null`             | Terminates the prototype chain                                  |

## Extending Native Prototypes & Risks

While JavaScript allows adding methods directly to built-in prototypes, doing so is strongly discouraged due to
significant architectural and maintenance hazards.

| Risk Factor         | Description                                                             |
|:--------------------|:------------------------------------------------------------------------|
| Name conflicts      | Custom methods may collide with future JavaScript specification updates |
| Library conflicts   | Different scripts or packages might define the same method name         |
| Unexpected behavior | All instances globally receive the modification instantly               |

## Best Practices

* **Use built-in prototype methods:** Leverage optimized, standardized native methods instead of rewriting
  functionality.
* **Avoid modifying native prototypes:** Use standalone utility functions instead of monkey-patching built-in objects to
  prevent global conflicts.
* **Understand prototype sources:** Recognize that methods on primitives and collections originate from shared native
  prototypes.
* **Keep prototype chains stable:** Allow JavaScript engines to optimize native lookups without performance degradation
  caused by post-creation mutations.
* **Never monkey-patch built-in objects:** Refrain from adding custom methods to `Array.prototype`, `String.prototype`,
  or `Object.prototype` to ensure libraries and future ECMAScript specifications remain compatible.
* **Use standalone utility functions or helpers:** Implement custom operations on collections or primitives via pure
  helper functions rather than extending native types.
* **Be mindful of primitive boxing:** Understand that JavaScript temporarily boxes primitives into object wrappers when
  accessing native prototype methods.
* **Leverage modern standard library additions:** Rely on newly standardized built-in methods (such as
  `Array.prototype.at()` or `Object.hasOwn()`) rather than writing custom polyfills or patching native prototypes.
* **Protect against shared prototype pollution vectors:** Ensure deep cloning, merging, and parsing utilities strip or
  ignore modifications to native prototype chains.
* **Use `Reflect` or `Object` static methods safely:** Prefer static utility APIs (`Array.isArray()`, `Object.keys()`)
  over calling prototype methods directly on untrusted inputs.
* **Avoid relying on non-standard built-in extensions:** Stick strictly to features specified in the official ECMAScript
  standard across all target environments.
* **Test code behavior across different runtime versions:** Verify that native built-in methods behave consistently
  across various browser and Node.js engines.
* **Document utility wrappers clearly:** Explain the purpose of custom helper functions that process native types to
  maintain code readability across teams.
* **Avoid overriding existing native methods:** Never reassign or modify built-in methods like `Array.prototype.map` or
  `String.prototype.trim` to prevent unexpected application crashes.
* **Use iterators and modern loops safely:** Leverage standard iteration protocols (`for...of`, array methods) rather
  than custom extensions on native iterables.
* **Check method support before usage:** Utilize feature detection or standard polyfills if working in legacy
  environments lacking modern native methods.
* **Keep data manipulation logic pure:** Ensure utility functions operating on native types avoid mutating input arrays
  or strings unexpectedly.
* **Audit dependencies for native prototype tampering:** Inspect third-party packages to ensure they do not improperly
  modify global native prototypes during initialization.
* **Understand engine optimization impacts:** Recognize that consistent native types allow JavaScript engines to apply
  high-performance inline caching and JIT optimizations.
* **Review code style guidelines regularly:** Reinforce anti-monkey-patching rules within team engineering standards to
  maintain clean, robust codebases.
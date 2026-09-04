# Symbol

## Concept and ECMAScript Specification

The `Symbol` constructor creates primitive values guaranteed to be unique and immutable. According to the ECMA-262
specification, `Symbol` is a built-in primitive type introduced to serve as non-string object property keys. Symbols can
never be instantiated using the `new` operator; attempting to do so throws a `TypeError` because `Symbol` functions
strictly as a primitive factory rather than an object wrapper constructor. Every invocation of `Symbol()` produces a
distinct symbol value, even if supplied with the same descriptive string.

| Characteristic             | ECMAScript Specification Behavior                                                              |
|:---------------------------|:-----------------------------------------------------------------------------------------------|
| Function Invocation        | `Symbol(description)` returns a unique primitive symbol value                                  |
| Constructor Invocation     | Throws a `TypeError` when called with `new`                                                    |
| Key Uniqueness             | Guaranteed unique across the execution context unless registered in the Global Symbol Registry |
| Object Property Visibility | Ignored by standard iteration mechanisms like `for...in` and `Object.keys()`                   |

```javascript
const a = Symbol('id');
const b = Symbol('id');
console.log(a === b); // false — same description, different symbols

const obj = {};
obj[a] = 1;
console.log(Object.keys(obj));       // [] — symbol-keyed property is invisible here
console.log(obj[a]);                 // 1 — but still directly accessible if you hold the reference
```

## Global Symbol Registry

ECMAScript maintains an execution-context-wide Global Symbol Registry. The registry enables sharing symbols across
different code realms, such as separate frames or service workers, using key-string mapping lookup routines.

| Method               | Specification Behavior                                                                                                    |
|:---------------------|:--------------------------------------------------------------------------------------------------------------------------|
| `Symbol.for(key)`    | Searches the Global Symbol Registry for `key`; returns the existing symbol if found, or creates and registers a new one   |
| `Symbol.keyFor(sym)` | Retrieves the string key associated with a global symbol from the registry, or returns `undefined` if the symbol is local |

```javascript
const s1 = Symbol.for('app.config');
const s2 = Symbol.for('app.config');
console.log(s1 === s2); // true — same registry key returns the same symbol

console.log(Symbol.keyFor(s1));       // "app.config"
console.log(Symbol.keyFor(Symbol())); // undefined — not in the registry at all
```

**The core distinction driving every decision in this doc:** `Symbol('x')` is *guaranteed unique*, even against another
`Symbol('x')` — use it when you specifically need collision-proof isolation. `Symbol.for('x')` is *guaranteed shared* —
every call with the same string returns the identical symbol — use it only when independent parts of a system (different
bundles, iframes, or realms) need to deliberately agree on the same key without importing a shared module reference.

## Well-Known Symbols

Well-known symbols are static properties on the `Symbol` constructor representing built-in internal spec hooks.
Implementing these symbols on custom objects overrides default runtime algorithms and language behaviors.

| Symbol Property             | Specification Purpose                                                                                                |
|:----------------------------|:---------------------------------------------------------------------------------------------------------------------|
| `Symbol.iterator`           | Defines the default iteration algorithm invoked by `for...of` and spread syntax                                      |
| `Symbol.asyncIterator`      | Defines the default asynchronous iteration algorithm for `for await...of` loops                                      |
| `Symbol.hasInstance`        | Customizes the operational behavior of the `instanceof` operator                                                     |
| `Symbol.toPrimitive`        | Overrides default type coercion algorithms when converting an object to a primitive                                  |
| `Symbol.toStringTag`        | Supplies a string tag used by `Object.prototype.toString()` to format object descriptions                            |
| `Symbol.isConcatSpreadable` | Controls whether an array-like object is flattened by `Array.prototype.concat()`                                     |
| `Symbol.species`            | Lets a subclass specify which constructor built-in methods (`.map()`, `.filter()`) should use for their return value |

**Seeing them actually run** (most explanations stop at the table — here's each one doing something):

```javascript
// Symbol.iterator — makes an object work with for...of and spread
const range = {
    from: 1, to: 3,
    [Symbol.iterator]() {
        let current = this.from;
        const last = this.to;
        return {
            next: () => current <= last
                ? {value: current++, done: false}
                : {value: undefined, done: true}
        };
    },
};
console.log([...range]); // [1, 2, 3]

// Symbol.hasInstance — customizes instanceof
class Even {
    static [Symbol.hasInstance](num) {
        return Number.isInteger(num) && num % 2 === 0;
    }
}

console.log(4 instanceof Even); // true — 4 isn't really an "Even" object, this is pure interception

// Symbol.toPrimitive — controls what an object becomes in +, `${}`, comparisons
const money = {
    amount: 50,
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') return this.amount;
        if (hint === 'string') return `$${this.amount}`;
        return `Money(${this.amount})`; // hint === 'default'
    },
};
console.log(+money);        // 50
console.log(`${money}`);    // "$50"
console.log(money + '');    // "Money(50)"

// Symbol.toStringTag — fixes generic-looking Object.prototype.toString output
class Matrix {
    get [Symbol.toStringTag]() {
        return 'Matrix';
    }
}

console.log(Object.prototype.toString.call(new Matrix())); // "[object Matrix]"
// without it: "[object Object]" — indistinguishable from a plain object
```

## Use Cases

**Use a local `Symbol()` when:**

* Two or more independent pieces of code (your app code + a third-party library, or two unrelated mixins) need to attach
  metadata to the *same shared object* without any risk of picking the same property name. This is the textbook case —
  see the mixin example below.
* You need a property that's excluded from `JSON.stringify()`, `for...in`, and `Object.keys()` by default — useful for
  attaching internal bookkeeping (a cache, an internal state flag) to an object without polluting its "public"
  enumerable shape.
* You're implementing a well-known symbol (`Symbol.iterator`, `Symbol.toPrimitive`, etc.) to make a custom object
  participate in a native language mechanism — this is by far the most common real-world reason application code touches
  `Symbol` at all.

  ```javascript
  // Two independent, unrelated mixins writing to the same object safely
  function withCache(obj) {
      const cacheKey = Symbol('cache');
      obj[cacheKey] = new Map();
      return obj;
  }
  
  function withLog(obj) {
      const logKey = Symbol('log'); // even Symbol('cache') here would NOT collide with the one above
      obj[logKey] = [];
      return obj;
  }
  ```

**Use `Symbol.for()` (the global registry) when:**

* Multiple realms genuinely need to agree on a symbol without a shared import — for example, a browser extension's
  content script and page script communicating through `postMessage`, or two independently-loaded bundles of the same
  library version that must recognize each other's branded objects.
* This is a narrow case. If your code can just `import` a shared symbol constant from a common module, do that instead —
  `Symbol.for()` exists specifically for when you *can't* share a module reference, not as a default way to make a
  "named" symbol.

**Use `Symbol.iterator` / `Symbol.asyncIterator` when:**

* You're building a custom collection or data structure (a linked list, a range, a paginated data fetcher) that should
  work with `for...of`, spread syntax, or destructuring — implementing this symbol is what makes `[...myCollection]` and
  `for (const x of myCollection)` possible at all.

**Use `Symbol.hasInstance` when:**

* You need `instanceof` to check something other than the real prototype chain — for example, checking a value's *shape*
  or a runtime condition (as in the `Even` example above) rather than its constructor lineage. This is uncommon and
  mostly seen in validation libraries or duck-typing utilities.

**Use `Symbol.toPrimitive` when:**

* A custom class needs precise, hint-aware control over how it behaves in arithmetic, string interpolation, and
  comparisons — e.g., a `Money`, `Temperature`, or `Duration` value object where `+`, template literals, and `<`/`>`
  should each produce a different, deliberate representation rather than falling back to default `valueOf`/`toString`
  behavior.

**Use `Symbol.toStringTag` when:**

* You're authoring a library and want `Object.prototype.toString.call(instance)` to report something more useful than
  the generic `[object Object]` — mainly relevant for debugging output and for other code that does type-checking via
  this exact spec mechanism (some polyfills and utility libraries do).

**Don't reach for Symbol when:**

* You're trying to make a property "private." Symbols are only *hidden from casual enumeration* — they're fully
  discoverable via `Object.getOwnPropertySymbols()` or `Reflect.ownKeys()`. If real encapsulation is the goal, use a
  class private field (`#field`) or closure-based state instead — see Best Practices.
* You just want a unique string identifier or enum-like value for your own application logic with no property-key
  collision risk involved (e.g., a status code, a Redux action type). A plain string constant or `as const` union in
  TypeScript is simpler, serializes correctly, and doesn't carry Symbol's `JSON.stringify()`/coercion quirks for no
  benefit.

## Best Practices

* **Reach for a Symbol specifically when the risk is *property-key collision between independent code*, not merely when
  you want something to feel "special" or unique.** If the property is only ever touched by code you control end-to-end,
  a regular string key with a clear naming convention (`_internalCache`) is simpler and avoids every quirk below. The
  condition that justifies Symbol is: will code I don't control ever read/write properties on this same object.
* **Never attempt to call `Symbol` with `new`:** Invoke `Symbol()` directly as a function to produce primitive symbol
  instances — `new Symbol()` throws immediately by spec design, since `Symbol` is a primitive factory, not a
  wrapper-object constructor.
* **Default to a local `Symbol()`; use `Symbol.for()` only when a shared module import genuinely isn't possible (
  cross-realm, cross-bundle).** Reaching for the global registry as a general "named symbol" convenience defeats the
  actual purpose of Symbol's uniqueness guarantee and risks accidental cross-library collisions on the registry key
  string itself — registry keys are just strings, so they can collide the same way normal property names can.
* **Never treat symbols as a genuine privacy or security mechanism.** `Object.getOwnPropertySymbols()` and
  `Reflect.ownKeys()` fully expose them — use them only to avoid accidental collisions, not to hide data from a
  determined caller. If real privacy is the goal, use `#privateFields` (enforced by the engine, not just convention) or
  a closure.
* **Always pass a descriptive string to `Symbol('label')`.** The description does nothing functionally (it's not a key,
  doesn't affect equality) but is the only thing that shows up in `console.log`, error messages, and `.toString()`
  output — omitting it makes debugging a page of `Symbol()` noticeably harder.
* **Use well-known symbols to override language mechanics only when the object genuinely represents that concept — not
  as a shortcut to get "cute" syntax.** Implementing `Symbol.toPrimitive` on something that isn't really a scalar value
  (say, forcing a `User` object to coerce to a number) produces surprising, hard-to-debug behavior for anyone who
  encounters it in arithmetic or string context without expecting custom coercion.
* **Access symbol-keyed properties only through `Object.getOwnPropertySymbols()` or `Reflect.ownKeys()`** —
  `Object.keys()`, `for...in`, and `JSON.stringify()` will never surface them, by design; relying on any of those three
  to "eventually find" a symbol property is a bug, not a timing issue.
* **Cache frequently used symbols as module-level constants, never re-created inline per call.**
  `export const CACHE_KEY = Symbol('cache');` defined once and imported everywhere guarantees every consumer references
  the *same* symbol; calling `Symbol('cache')` fresh in multiple files produces different, non-equal symbols despite the
  identical description — this is one of the most common real bugs with Symbol usage.
* **Never expect implicit string coercion of a symbol.** `` `${mySymbol}` `` and `'' + mySymbol` both throw
  `TypeError: Cannot convert a Symbol value to a string` — this is intentional, to prevent symbols from being
  accidentally stringified and losing their identity. Use `.toString()` or `.description` explicitly when you need a
  readable form.
* **Verify `Symbol.keyFor()` input is actually a registry symbol before trusting its result.** Passing a local
  `Symbol()` (not created via `Symbol.for()`) returns `undefined`, not an error — a caller expecting a string back needs
  to handle this case explicitly rather than assuming every symbol has a registry key.
* **When implementing `Symbol.iterator` manually, return a strictly conforming iterator object** — a `next()` method
  returning `{ value, done }` on every call, including a final call after exhaustion that returns
  `{ value: undefined, done: true }` rather than throwing or returning `undefined` outright; non-conforming iterators
  break silently inside `for...of` and spread syntax in ways that are hard to trace back to the iterator implementation.
* **Prefer `Symbol.toStringTag` over overriding `toString()` itself when the only goal is fixing
  `Object.prototype.toString.call()` output.** It's a single-property change versus reimplementing the whole method, and
  it specifically targets the one mechanism (`Object.prototype.toString`) that type-checking utility libraries actually
  rely on — overriding `toString()` directly changes different, unrelated behavior (string coercion) that you may not
  intend to touch.
* **Validate incoming keys with `typeof key === 'symbol'` in any metaprogramming utility that accepts arbitrary property
  keys** — code that assumes all keys are strings will silently mishandle a symbol key (e.g., string-concatenating it
  into a log message throws per the coercion rule above) unless it branches on type first.
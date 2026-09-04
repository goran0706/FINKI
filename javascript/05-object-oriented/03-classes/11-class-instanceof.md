# `instanceof`

`instanceof` checks whether an object's prototype chain contains a given class's `prototype` object — it is a structural
check on the chain described in [Class Prototypes](10-class-prototypes.md), not a check against some hidden "type tag"
stored on the object. This mechanical detail explains both its usefulness and its real, occasionally surprising failure
modes.

## What `instanceof` Actually Checks

`obj instanceof ClassName` walks `obj`'s prototype chain, one link at a time, checking whether `ClassName.prototype`
appears anywhere in it.

```javascript
class Animal {
}

class Dog extends Animal {
}

const rex = new Dog();
console.log(rex instanceof Dog);    // true — Dog.prototype is directly linked
console.log(rex instanceof Animal); // true — Animal.prototype is further up the chain
console.log(rex instanceof Object); // true — every chain ends at Object.prototype
console.log(rex instanceof Array);  // false — Array.prototype is nowhere in this chain
```

Because this is a pure structural check, it has nothing to do with which constructor actually created the object — it
only cares about the current prototype chain, which is why manually reassigning a prototype can change `instanceof`
results after the fact.

```javascript
class Cat {
}

const notReallyADog = new Cat();
Object.setPrototypeOf(notReallyADog, Dog.prototype);

console.log(notReallyADog instanceof Dog); // true — the chain was manually altered
console.log(notReallyADog instanceof Cat); // false — no longer in this chain at all
```

## `instanceof` Across Realms — A Real, Common Failure

An "instance" created in one realm (a different `<iframe>`, a separate `vm` context in Node.js, or a worker thread) has
a *different* `Array.prototype`/`Error.prototype`/custom-class prototype object than the one in the realm checking it —
even though both objects behave identically. `instanceof` compares the actual prototype **object reference**, so this
fails silently.

```javascript
// Conceptually — this happens across a real iframe or vm.Context boundary:
// iframeWindow.Array !== window.Array, so:
const arrayFromIframe = iframeWindow.Array(1, 2, 3);
console.log(arrayFromIframe instanceof Array); // false, in the outer realm!
console.log(Array.isArray(arrayFromIframe));   // true — this check doesn't rely on prototype identity
```

This is why array-checking code should prefer `Array.isArray()` over `instanceof Array`, and why cross-realm error
handling (Node's `vm` module, worker `postMessage`) often needs `Object.prototype.toString.call(err)` or duck-typing
instead of `instanceof Error`.

## Customizing `instanceof` with `Symbol.hasInstance`

A class can override what `instanceof` means for it entirely, by defining a static `Symbol.hasInstance` method — this
replaces the default prototype-chain walk with arbitrary logic.

```javascript
class Even {
    static [Symbol.hasInstance](value) {
        return Number.isInteger(value) && value % 2 === 0;
    }
}

console.log(4 instanceof Even); // true — 4 was never "constructed" as an Even at all
console.log(3 instanceof Even); // false
```

This is powerful but should be used sparingly — it makes `instanceof` mean something other than "was this actually
constructed via this class or a subclass," which can surprise anyone reading code that assumes the default behavior.

## `instanceof` vs Duck Typing

`instanceof` requires the checked value to genuinely be linked into the right prototype chain. **Duck typing** —
checking whether an object merely *has* the expected shape (the right methods/properties), regardless of its actual
prototype — is often more robust, especially across module boundaries, mocked test objects, or cross-realm scenarios
where `instanceof` can't be relied on.

```javascript
// instanceof — requires actual prototype-chain membership
function processStrict(shape) {
    if (!(shape instanceof Circle)) throw new TypeError("Expected a Circle");
    return shape.area();
}

// duck typing — only requires the object behaves the right way
function processLoose(shape) {
    if (typeof shape.area !== "function") throw new TypeError("Expected something with .area()");
    return shape.area();
}
```

`processLoose` correctly accepts any object with an `.area()` method — including a plain object literal, a class
instance from a different realm, or a test mock — none of which would necessarily pass `instanceof Circle`.

## `instanceof` vs Private Brand Checks

For genuinely verifying that an object was constructed by *exactly* this class (not merely something with a matching
shape, and not defeatable by manually reassigning prototypes), a private field brand check (`#field in obj`, covered
in [Private Members](04-class-private-members.md)) is a stronger guarantee than `instanceof`, because private fields
cannot be faked by prototype manipulation the way a prototype chain can.

```javascript
class RealCircle {
    #brand = true;

    static isRealCircle(obj) {
        return #brand in obj; // true only for genuine RealCircle instances
    }
}

const fake = Object.create(RealCircle.prototype); // passes instanceof, but isn't a real instance
console.log(fake instanceof RealCircle);        // true — chain matches, but never went through the constructor
console.log(RealCircle.isRealCircle(fake));     // false — no private brand, correctly rejects it
```

## `instanceof` and Primitives

Primitive values are never `instanceof` anything, even their "matching" wrapper type — this is a frequent point of
confusion, since `typeof` and `instanceof` disagree here.

```javascript
console.log(typeof "hello");             // "string"
console.log("hello" instanceof String);  // false — primitive, not a String object

const wrapped = new String("hello");
console.log(typeof wrapped);             // "object"
console.log(wrapped instanceof String);  // true — this one really is a String object
```

This is a direct consequence of autoboxing (covered in the primitives series): `instanceof` only ever matches actual
objects with a real prototype chain, and a primitive string has no prototype chain of its own.

## Use Cases

* **Type-checking within a single, trusted realm and module graph:** Use `instanceof` as the default choice for
  verifying an argument's type inside application code that doesn't cross iframe, worker, or `vm` boundaries — the
  common case, where its simplicity outweighs the realm caveat.
* **Polymorphic dispatch based on class hierarchy:** Use `instanceof` in `catch` blocks or conditional branches to
  distinguish between different error subtypes or class hierarchies when handling a value that could be one of several
  related types (see the Error series for `instanceof`-based error handling).
* **Checking array-ness reliably across realms:** Use `Array.isArray()` instead of `instanceof Array` specifically
  because arrays are a common case that legitimately crosses realm boundaries (JSON-derived data, values from iframes or
  workers).
* **Validating objects that might come from mocks, other modules, or other realms:** Use duck typing (checking for
  expected methods/properties) instead of `instanceof` when the object's actual origin can't be guaranteed to share the
  same prototype reference — test doubles are a very common practical case here.
* **Verifying genuine construction provenance, not just shape:** Use a private brand check instead of `instanceof` when
  it matters that an object was truly built by this exact class's constructor, not merely assigned a matching prototype
  after the fact.
* **Customizing type-checking semantics for a class that doesn't map to "was constructed via `new`":** Use
  `Symbol.hasInstance` sparingly, for cases like validation classes or range/pattern matchers where "is an instance of"
  is being deliberately redefined as "matches this condition."

## Best Practices

* **Default to `instanceof` for ordinary type checks within a single realm — it's simpler and communicates intent
  clearly.** Reach for duck typing or brand checks only once a real reason to distrust `instanceof`'s prototype-identity
  assumption actually applies (cross-realm code, untrusted input, adversarial prototype manipulation) — don't add the
  extra complexity preemptively.
* **Always use `Array.isArray()` instead of `instanceof Array`, unconditionally.** This isn't a "sometimes" rule —
  arrays are common enough to cross realm boundaries (JSON parsing across workers, values from iframes) that
  `instanceof Array` is a real, recurring bug source, while `Array.isArray()` has no downside in the common case either.
* **Prefer duck typing over `instanceof` at module or API boundaries where callers might pass objects you don't control
  the construction of** — public library APIs, plugin systems, or anything accepting configuration objects — since a
  caller's object won't necessarily share your internal prototype reference even if it behaves correctly.
* **Reserve `Symbol.hasInstance` overrides for cases where redefining "instance of" is the actual intended feature, and
  document it clearly when you do.** An `instanceof` check silently meaning something other than "was constructed by
  this class" is a legitimate but non-obvious behavior that future maintainers need to be warned about directly in the
  code.
* **Use a private brand check instead of `instanceof` specifically when an object's authenticity (not just its shape or
  prototype) needs to be verified** — for example, validating a token object that a security-sensitive function will
  trust, where a manually reassigned prototype should not be sufficient to pass the check.
* **Never assume `instanceof` will work correctly for values crossing an iframe, worker, or `vm` boundary — verify this
  explicitly if the codebase touches any of these.** This is one of the most common real-world `instanceof` bugs, and
  it's invisible in local development if the code is never actually tested across a genuine realm boundary.
* **Remember that primitives are never `instanceof` their wrapper type — don't write validation logic assuming
  `"str" instanceof String` will ever be true.** Use `typeof value === "string"` for primitive checks, and reserve
  `instanceof String` for the rare case of actually needing to detect a boxed `String` object specifically.
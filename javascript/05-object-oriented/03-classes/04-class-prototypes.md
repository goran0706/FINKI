# Class Prototypes

`class` syntax is sugar over JavaScript's underlying prototype system — every class method (except static ones) is
actually stored on a shared object called the class's `prototype`, and every instance is linked to it. Understanding
this mechanism explains method sharing, memory behavior, and several things that otherwise seem like arbitrary class
rules.

## Where Class Methods Actually Live

Instance methods defined in a class body are **not** copied onto each instance — they're defined once on
`ClassName.prototype`, and every instance shares the same function object via the prototype chain.

```javascript
class Dog {
    constructor(name) {
        this.name = name; // instance property — unique per instance
    }

    bark() {
        return `${this.name} barks.`; // prototype method — shared by every instance
    }
}

const a = new Dog("Rex");
const b = new Dog("Fido");

console.log(a.bark === b.bark); // true — literally the same function object
console.log(a.hasOwnProperty("bark")); // false — not an own property of the instance
console.log(Dog.prototype.hasOwnProperty("bark")); // true — lives here instead
```

This is why prototype methods are memory-efficient compared to methods assigned as instance fields (like arrow function
class fields) — one function object exists regardless of how many instances are created.

## The Prototype Chain `class` Sets Up

`Object.getPrototypeOf(instance)` returns the class's `prototype` object — this is the actual link that method lookup
walks when you call `instance.method()`.

```javascript
class Dog {
    bark() {
        return "Woof";
    }
}

const rex = new Dog();
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true
```

When you call `rex.bark()`, the engine looks for an own property `bark` on `rex` first, doesn't find one, then follows
the internal prototype link to `Dog.prototype`, finds `bark` there, and calls it with `this` still bound to `rex`.

## `prototype` vs `__proto__` — Two Different Things With Confusingly Similar Names

`ClassName.prototype` is a property **on the class** — it's the object that becomes every instance's prototype.
`instance.__proto__` (legacy accessor, equivalent to `Object.getPrototypeOf(instance)`) is a property **on the
instance** — it's a reference to that same shared prototype object, accessed from the other direction.

```javascript
class Dog {
}

const rex = new Dog();

console.log(Dog.prototype);           // the shared prototype object
console.log(rex.__proto__);           // the SAME object, accessed from the instance
console.log(rex.__proto__ === Dog.prototype); // true
console.log(rex.prototype);           // undefined — instances don't have a `.prototype` property
```

`__proto__` is a legacy, deprecated accessor kept for web compatibility — `Object.getPrototypeOf(obj)` is the modern,
correct way to read the same thing, and `Object.create(proto)` or `class`/`extends` are the correct ways to set it,
rather than `obj.__proto__ = proto`.

## The Full Chain, Including `Object.prototype`

Every class's prototype chain eventually reaches `Object.prototype`, which is where universally available methods like
`.toString()` and `.hasOwnProperty()` actually live.

```javascript
class Dog {
}

const rex = new Dog();

console.log(Object.getPrototypeOf(Dog.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null — the chain terminates here
```

This is the same chain `instanceof` walks and the same reason every plain object, including class instances, inherits
methods like `.toString()` without ever defining them.

## Inheritance Extends the Prototype Chain

`class Dog extends Animal` links `Dog.prototype`'s own prototype to `Animal.prototype`

```javascript
class Animal {
    speak() {
        return "...";
    }
}

class Dog extends Animal {
    bark() {
        return "Woof";
    }
}

const rex = new Dog();
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true
console.log(Object.getPrototypeOf(rex) === Dog.prototype);              // true
```

So a `Dog` instance's chain is: `rex` → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`. Calling
`rex.speak()` walks past `Dog.prototype` (no `speak` there) and finds it on `Animal.prototype`.

## Static Members Live on a Parallel Chain

Static members follow the exact same mechanism, one level up: they live on the class function object itself, and
`extends` links the subclass's function object to the parent class's function object (not to `Animal.prototype`) — a
separate, parallel prototype chain from the instance one.

```javascript
class Animal {
    static kingdom = "Animalia";
}

class Dog extends Animal {
}

console.log(Object.getPrototypeOf(Dog) === Animal); // true — the STATIC chain
console.log(Dog.kingdom); // "Animalia" — inherited via this separate chain
```

## Adding Methods to a Prototype Manually

Because prototypes are just objects, methods can be added to them outside the class body — legal, but rarely the right
choice for your own classes (see Best Practices), though this is exactly how libraries and polyfills historically
extended built-ins.

```javascript
class Dog {
    constructor(name) {
        this.name = name;
    }
}

Dog.prototype.fetch = function () {
    return `${this.name} fetches the ball.`;
};

console.log(new Dog("Rex").fetch()); // "Rex fetches the ball."
```

## Checking Own vs Inherited Properties

Because instance properties (set via `this.x = ...`) and prototype methods live in different places, `Object.keys()`,
`for...in`, and `hasOwnProperty()`/`Object.hasOwn()` behave differently depending on which one they're checking.

```javascript
class Dog {
    constructor(name) {
        this.name = name;
    }

    bark() {
        return "Woof";
    }
}

const rex = new Dog("Rex");
console.log(Object.keys(rex));        // ["name"] — only own, enumerable properties
console.log("bark" in rex);           // true — `in` checks the whole prototype chain
console.log(Object.hasOwn(rex, "bark")); // false — bark is inherited, not own
```

Class prototype methods are also non-enumerable by default (unlike object-literal methods), which is why they never show
up in `Object.keys()` or `JSON.stringify()` output even without any special configuration.

## Prototype Pollution — A Real Risk With Shared Objects

Because every instance shares the *same* prototype object, mutating a prototype method's shared state (not the
instance's own data, but something attached to the function or prototype itself) affects every instance — and modifying
a built-in prototype (`Array.prototype`, `Object.prototype`) affects every object of that type across the entire
program, including third-party library internals.

```javascript
// Never do this — affects every array in the entire program, everywhere
Array.prototype.last = function () {
    return this[this.length - 1];
};

[1, 2, 3].last(); // works, but at the cost of a global collision risk
```

## Use Cases

* **Understanding memory behavior when choosing between prototype methods and instance fields:** Use this model to
  reason about why arrow-function class fields cost more memory per instance than ordinary prototype methods — the
  trade-off only makes sense once you know methods are normally shared, not duplicated.
* **Debugging unexpected `instanceof` or method-lookup failures:** Walk the actual prototype chain with
  `Object.getPrototypeOf()` when a method call behaves unexpectedly, rather than guessing — this reveals exactly where
  (or whether) a method is actually found.
* **Working with legacy pre-class code or polyfills:** Recognize `SomeConstructor.prototype.method = function() {}` as
  the manual equivalent of defining a method inside a `class` body, when reading or maintaining older codebases.
* **Auditing for prototype pollution risk in dependencies:** Check whether a library extends built-in prototypes
  (`Array.prototype`, `Object.prototype`) directly, since this is a known source of hard-to-trace bugs when two
  dependencies patch the same built-in differently.
* **Distinguishing own vs inherited data during serialization or cloning:** Use `Object.hasOwn()` or `Object.keys()`
  specifically (not `for...in`) when writing code that should only ever touch an instance's own data, not inherited
  prototype methods.

## Best Practices

* **Never modify a built-in prototype (`Array.prototype`, `Object.prototype`, `String.prototype`) in application code.**
  A single instance's worth of convenience isn't worth a program-wide collision risk with every other piece of code —
  including dependencies you don't control — that also touches these shared objects.
* **Define methods inside the class body rather than attaching them to `ClassName.prototype` manually afterward, except
  when working with generated or dynamically-composed classes where this pattern is unavoidable.** Class-body method
  definitions are clearer, keep all of a class's behavior in one visible place, and are non-enumerable by default
  without extra configuration.
* **Use `Object.getPrototypeOf()`, never `__proto__`, when inspecting or reasoning about an object's prototype in modern
  code.** `__proto__` is a legacy accessor retained only for backward compatibility; `Object.getPrototypeOf()`/
  `Object.setPrototypeOf()` are the standardized, unambiguous equivalents.
* **Remember that prototype methods are shared, not copied — never store per-instance mutable state directly on a method
  function itself (e.g., attaching a counter property to the method).** Any state that needs to vary per instance
  belongs on the instance (`this.someField`), not on the shared function object every instance points to.
* **Use `Object.hasOwn()` (or `Object.keys()`) rather than `for...in` when logic specifically needs an instance's own
  data, not inherited methods.** `for...in` walks the entire prototype chain and will include inherited enumerable
  properties, which is rarely what's intended when iterating "this object's own fields."
* **When debugging a missing or unexpected method, check the actual prototype chain before assuming a typo —
  `Object.getPrototypeOf()` chained repeatedly reveals exactly where lookup does or doesn't find something.** This is
  faster and more reliable than guessing based on the class hierarchy as written in source, especially if
  `Object.setPrototypeOf()` was used anywhere unexpectedly.
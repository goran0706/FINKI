# Prototype-Based Design

Prototype-Based Design is an object-oriented design model in which objects derive behavior and structure from other
objects through prototype relationships rather than requiring classes as the fundamental abstraction.

JavaScript is fundamentally prototype-based. Every ordinary object has an internal `[[Prototype]]` relationship, and
property lookup can continue through that prototype chain when a property is not found directly on the object.

Prototype-based design therefore treats objects themselves as the primary units of reuse and delegation. An object can
inherit behavior from another object, serve as a prototype for newly created objects, or be composed with other objects
through explicit prototype relationships.

The model is broader than Constructor Functions. Constructor Functions are one mechanism for creating objects whose
prototypes are associated with a constructor. Prototype-based design concerns the underlying object model itself and can
be used directly through `Object.create()`, object literals, prototype mutation, delegation, and other mechanisms.

## Core Model

The central idea is that an object can delegate property lookup to another object.

For example:

```js id="5r4j8p"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const user = Object.create(userPrototype);

user.name = "Alice";

user.greet();
```

`user` does not own `greet`. Property lookup finds it on `userPrototype`.

The relationship is therefore based on delegation rather than copying.

The object remains an independent object with its own state while inheriting access to behavior through its prototype.

## Prototype Relationship

Every ordinary JavaScript object has an internal `[[Prototype]]` relationship.

The relationship can be inspected with:

```js id="0f2y3w"
Object.getPrototypeOf(user);
```

and established during creation with:

```js id="q4g1z7"
const user = Object.create(userPrototype);
```

The prototype is another object or `null`.

A prototype is not a class. It is an object participating in property lookup and delegation.

## Property Lookup

When JavaScript evaluates:

```js id="7a5s8k"
user.greet;
```

it first checks whether `user` has an own property named `greet`.

If it does not, JavaScript continues through the object's prototype. If the prototype does not contain the property,
lookup continues through that object's prototype, continuing until the property is found or the chain reaches `null`.

This is the fundamental mechanism behind prototype inheritance.

For example:

```js id="4o8l0x"
const person = {
    describe() {
        return this.name;
    }
};

const employee = Object.create(person);
employee.name = "Alice";

employee.describe();
```

`describe` is inherited through delegation.

## Delegation

Prototype inheritance is fundamentally delegation.

The object receiving the property access does not necessarily contain the property itself. It can delegate the lookup to
its prototype.

This differs conceptually from copying properties from one object into another.

For example:

```js id="f5c2u8"
const prototype = {
    greet() {
        return "Hello";
    }
};

const object = Object.create(prototype);
```

`object` does not contain a copied `greet` function.

The function remains on `prototype`, and `object` delegates lookup to it.

## Behavior Sharing

Prototype-based design naturally allows many objects to share behavior.

```js id="7m1w9e"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const alice = Object.create(userPrototype);
const bob = Object.create(userPrototype);

alice.name = "Alice";
bob.name = "Bob";
```

Both objects resolve `greet` through the same prototype object.

This avoids duplicating the method implementation on each instance.

## State and Prototype Behavior

A common prototype-based design separates per-object state from shared behavior.

```js id="9l5x4q"
const accountPrototype = {
    deposit(amount) {
        this.balance += amount;
    },

    getBalance() {
        return this.balance;
    }
};

function createAccount(initialBalance) {
    const account = Object.create(accountPrototype);

    account.balance = initialBalance;

    return account;
}
```

`balance` belongs to each individual account, while the methods belong to the shared prototype.

This separation is not mandatory, but it is a common and useful organization.

## `Object.create`

`Object.create()` is the most direct standard mechanism for constructing an object with a specified prototype.

```js id="l1y9xk"
const animal = {
    speak() {
        return "sound";
    }
};

const dog = Object.create(animal);

dog.speak();
```

The first argument becomes the new object's prototype.

The second optional argument can define own properties:

```js id="a0w3hx"
const user = Object.create(
    userPrototype,
    {
        name: {
            value: "Alice",
            writable: true,
            enumerable: true,
            configurable: true
        }
    }
);
```

For ordinary construction, assigning properties after `Object.create()` is often easier to read.

## Prototype Chains

Objects can participate in multi-level prototype chains.

```js id="g3v8e4"
const animal = {
    breathe() {
        return "breathing";
    }
};

const mammal = Object.create(animal);

mammal.feed = function () {
    return "feeding";
};

const dog = Object.create(mammal);

dog.bark = function () {
    return "woof";
};
```

A `dog` object can access behavior defined on itself, `mammal`, and `animal`.

Prototype chains therefore provide a form of behavioral inheritance.

Long prototype chains should be used carefully because they make lookup and behavioral ownership harder to understand.

## Own Properties

An object can distinguish its own properties from inherited properties.

```js id="k8n5c0"
Object.hasOwn(user, "name");
```

This checks whether `name` is an own property of `user`.

By contrast:

```js id="z2p3cs"
"name" in user;
```

checks both the object and its prototype chain.

This distinction is important when designing objects that accept arbitrary keys, serialize data, or iterate over
properties.

## `hasOwnProperty`

Historically, code commonly used:

```js id="r2y7m4"
user.hasOwnProperty("name");
```

However, an object may shadow or replace `hasOwnProperty`, and objects created with a `null` prototype do not inherit
it.

The safer modern form is:

```js id="6w4v1j"
Object.hasOwn(user, "name");
```

This is particularly relevant in generic prototype-based code.

## `in` Operator

The `in` operator checks the entire prototype chain:

```js id="f6m2x9"
"greet" in user;
```

This returns `true` when `greet` is inherited.

That behavior is different from checking own properties.

Prototype-aware code should deliberately choose between:

```js id="7z8k1n"
Object.hasOwn(user, "greet");
```

and:

```js id="5y9m3v"
"greet" in user;
```

depending on whether inherited properties are intended to count.

## Property Shadowing

An own property can shadow an inherited property with the same name.

```js id="0f5n2d"
const prototype = {
    role: "user"
};

const object = Object.create(prototype);

object.role = "admin";
```

The own `role` property is found before the prototype's `role`.

The prototype remains unchanged:

```js id="j2q8xs"
prototype.role; // "user"
```

Shadowing is a normal part of prototype-based property lookup but can create subtle behavior when mutable inherited data
is involved.

## Methods and `this`

Prototype methods commonly depend on the receiver through `this`.

```js id="w8x1v0"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const user = Object.create(userPrototype);
user.name = "Alice";

user.greet();
```

Although `greet` is stored on the prototype, `this` refers to the object through which the method was called.

This allows one shared method implementation to operate on different objects.

The behavior changes when the method is detached:

```js id="n4h6q2"
const greet = user.greet;
```

Calling `greet()` separately does not preserve the original receiver automatically.

Prototype-based APIs should therefore account for normal JavaScript `this` semantics.

## Accessing the Prototype

JavaScript historically exposed the `__proto__` accessor:

```js id="r8p2k5"
user.__proto__;
```

Although still supported in many environments, `Object.getPrototypeOf()` and `Object.setPrototypeOf()` are the standard
APIs for explicit prototype manipulation.

Prefer:

```js id="q3f7m1"
Object.getPrototypeOf(user);
```

over relying on `__proto__` in application design.

## Setting a Prototype

An object's prototype can be changed with:

```js id="c5w9s2"
Object.setPrototypeOf(user, anotherPrototype);
```

This is valid but should generally be avoided for frequently used objects.

Changing the prototype after object creation can complicate reasoning about behavior and can have performance
consequences in JavaScript engines.

It is usually preferable to establish the intended prototype during object creation:

```js id="v2h8r6"
const user = Object.create(userPrototype);
```

## Prototype Mutation

Prototype objects themselves are mutable:

```js id="p7k4d1"
userPrototype.greet = function () {
    return `Hi, ${this.name}`;
};
```

Existing objects using that prototype immediately observe the new behavior.

This can be useful for controlled type extension, but it also means prototype mutation affects potentially large numbers
of objects.

Application code should therefore treat shared prototypes as shared mutable state unless they are deliberately made
immutable.

## Freezing Prototypes

A prototype can be frozen:

```js id="m9t2q4"
Object.freeze(userPrototype);
```

This prevents modification of the prototype's own properties.

It can be useful when the prototype represents a stable behavior contract.

Freezing does not recursively freeze objects referenced by the prototype's properties, and it does not make descendant
instances immutable.

## Null-Prototype Objects

An object can explicitly have no prototype:

```js id="h5v7c2"
const dictionary = Object.create(null);
```

Its prototype is:

```js id="j9s1x3"
Object.getPrototypeOf(dictionary) === null;
```

This means it does not inherit properties or methods from `Object.prototype`.

Null-prototype objects can be useful for dictionary-like data structures where inherited properties are undesirable.

They should not automatically be treated as general-purpose replacements for ordinary objects because they lack
inherited methods such as `toString`.

## Dictionaries and Maps

A null-prototype object can be used as a simple dictionary:

```js id="s4n8y6"
const dictionary = Object.create(null);

dictionary["user"] = 1;
dictionary["admin"] = 2;
```

However, `Map` is usually a better choice when the structure is fundamentally a key-value collection requiring arbitrary
keys, explicit collection operations, or predictable iteration semantics.

Prototype-based design should not be introduced merely because objects can technically serve as dictionaries.

## Object Literals and Prototypes

Object literals automatically inherit from `Object.prototype` unless another mechanism is used.

```js id="b3m6v9"
const user = {
    name: "Alice"
};
```

The object therefore participates in the standard object prototype chain.

An object literal can also provide a prototype explicitly through modern syntax:

```js id="y6c4w8"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const user = {
    __proto__: userPrototype,
    name: "Alice"
};
```

Although this special object-literal syntax is standardized, `Object.create()` is often clearer when the primary
intention is explicit prototype-based construction.

## Constructor Functions and Prototypes

Constructor Functions are one way to establish prototype relationships.

```js id="d8m1r4"
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};

const user = new User("Alice");
```

The `new` operation creates an object whose prototype is normally `User.prototype`.

The important point is that the prototype mechanism exists independently of Constructor Functions.

The same behavioral structure can be created directly:

```js id="e1k7p3"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const user = Object.create(userPrototype);
user.name = "Alice";
```

Constructor Functions provide one creation mechanism around the prototype model; they do not define the prototype model
itself.

## Classes and Prototypes

Classes are also integrated with the prototype model.

```js id="u4n9s5"
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

The method `greet` is normally placed on `User.prototype`.

```js id="v6j2c8"
User.prototype.greet;
```

Instances therefore still use prototype-based method lookup.

Classes provide a higher-level syntax and additional language semantics, but JavaScript remains fundamentally
prototype-based.

## Prototype-Based Inheritance

Prototype-based inheritance allows one object to inherit behavior from another.

```js id="x7q3m9"
const animal = {
    move() {
        return "moving";
    }
};

const dog = Object.create(animal);

dog.bark = function () {
    return "woof";
};
```

`dog` can use both its own behavior and inherited behavior.

This does not require a class hierarchy.

The relationship is between objects.

## Delegation Versus Classical Inheritance

Classical object-oriented models generally describe inheritance in terms of classes and instances.

Prototype-based design describes inheritance in terms of object relationships and delegation.

Instead of saying that `Dog` is a subclass of `Animal`, prototype-based code can directly express that one object
delegates to another:

```js id="n8b2v5"
const animal = {
    move() {
        return "moving";
    }
};

const dog = Object.create(animal);
```

This can be simpler when the application naturally models behavior reuse between concrete objects.

## Prototype Composition

Prototype relationships do not have to represent taxonomic inheritance.

An object can delegate to another object because the second object provides useful behavior, without claiming that the
first is conceptually a subtype.

For example:

```js id="q5w1e7"
const timestamped = {
    getTimestamp() {
        return this.timestamp;
    }
};

const entity = Object.create(timestamped);

entity.timestamp = Date.now();
```

The relationship is behavior reuse rather than necessarily a domain inheritance hierarchy.

This is one of the strengths of prototype-based design.

## Trait-Like Composition

Multiple independent behavior sources can be composed into a new prototype.

```js id="c8m4s6"
const printable = {
    print() {
        return String(this.value);
    }
};

const comparable = {
    equals(other) {
        return this.value === other.value;
    }
};

const valuePrototype = Object.assign({}, printable, comparable);

const value = Object.create(valuePrototype);
value.value = 42;
```

This copies properties into `valuePrototype`.

Alternatively, a prototype chain can be deliberately structured around one primary prototype and additional delegation
mechanisms.

Composition should be preferred over artificially deep inheritance hierarchies when behaviors are independent.

## Mixins

Mixins provide another form of prototype-oriented composition.

```js id="w2k6p8"
const TimestampMixin = {
    getTimestamp() {
        return this.timestamp;
    }
};

const LoggingMixin = {
    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
};

function applyMixins(target, ...mixins) {
    for (const mixin of mixins) {
        Object.assign(target, mixin);
    }

    return target;
}
```

Mixins copy behavior into the target rather than establishing a prototype relationship for each mixin.

This distinction matters because copied properties and delegated properties have different ownership and mutation
semantics.

## Delegation Versus Copying

Consider:

```js id="r4j8t1"
const prototype = {
    greet() {
        return "Hello";
    }
};

const delegated = Object.create(prototype);

const copied = Object.assign({}, prototype);
```

`delegated.greet` is resolved through the prototype.

`copied.greet` is an own property.

If `prototype.greet` is later changed, the delegated object observes the new property while the copied object retains
its copied function.

Prototype-based design therefore provides a dynamic relationship that property copying does not.

## Data on Prototypes

Putting mutable data directly on prototypes requires caution.

```js id="f3x9k2"
const prototype = {
    permissions: []
};
```

Every descendant object that does not shadow `permissions` can observe the same array.

This can accidentally create shared mutable state.

Prefer per-object ownership for mutable instance data:

```js id="z6p1m8"
const user = Object.create(prototype);
user.permissions = [];
```

Shared immutable data can be appropriate on a prototype when sharing is intentional.

## Getters and Setters

Prototypes can define accessors:

```js id="a9r5t7"
const personPrototype = {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};

const person = Object.create(personPrototype);

person.firstName = "Alice";
person.lastName = "Smith";

person.fullName;
```

The getter is shared through the prototype while `this` refers to the concrete object.

This allows prototypes to define behavior without duplicating accessor functions.

## Property Descriptors

Prototype-based design can use property descriptors to control behavior.

```js id="k1v7c4"
Object.defineProperty(userPrototype, "id", {
    configurable: false,
    enumerable: true,
    get() {
        return this._id;
    }
});
```

Descriptors can control:

* enumerability;
* configurability;
* writability;
* getter behavior;
* setter behavior.

This provides lower-level control over object APIs than ordinary assignment.

## Symbols

Symbols can be used as prototype properties without introducing ordinary string-key collisions.

```js id="p8s2n5"
const inspect = Symbol("inspect");

const prototype = {
    [inspect]() {
        return this.name;
    }
};
```

Symbols are useful when implementing protocols or internal conventions that should not collide easily with normal string
properties.

JavaScript's built-in protocols such as iteration rely heavily on symbol-keyed properties.

## Prototype-Based Protocols

JavaScript itself uses prototype-based objects to implement many behavioral protocols.

For example:

```js id="m3q9v6"
const iterable = {
    * [Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
};
```

The object participates in the iterable protocol through a symbol-keyed method.

Prototype-based design therefore extends beyond traditional inheritance. Objects can acquire protocol behavior through
their prototype relationships.

## Custom Collection Prototypes

A collection can define shared operations through a prototype:

```js id="n7c4x1"
const collectionPrototype = {
    add(value) {
        this.values.push(value);
    },

    size() {
        return this.values.length;
    }
};

function createCollection() {
    const collection = Object.create(collectionPrototype);

    collection.values = [];

    return collection;
}
```

The prototype defines the collection behavior while each instance owns its own storage.

## Private State

Prototype methods can operate on private state stored elsewhere, but prototypes themselves do not provide private
fields.

For example, closure-based factories can combine private state with shared prototypes only with additional machinery.

```js id="s5h8k2"
const methods = {
    getValue() {
        return this._value;
    }
};
```

Using an underscore does not make `_value` private.

When true language-level private state is required, classes with `#private` fields are usually clearer.

Prototype-based design should therefore not be confused with encapsulation. Prototype inheritance determines behavior
lookup; privacy is a separate concern.

## Prototype-Based Encapsulation

Encapsulation can still be achieved in prototype-oriented systems through:

* closures;
* module scope;
* `WeakMap`;
* `WeakSet`;
* private class fields when classes are used;
* controlled public properties;
* API boundaries.

The prototype itself is not a privacy mechanism.

## `WeakMap` and Prototype-Based Objects

A `WeakMap` can associate private state with prototype-created objects:

```js id="b7d3f9"
const privateState = new WeakMap();

const accountPrototype = {
    deposit(amount) {
        const state = privateState.get(this);
        state.balance += amount;
    },

    getBalance() {
        return privateState.get(this).balance;
    }
};

function createAccount(initialBalance) {
    const account = Object.create(accountPrototype);

    privateState.set(account, {
        balance: initialBalance
    });

    return account;
}
```

The prototype provides shared behavior while `WeakMap` stores state privately per object.

This is a more advanced technique and introduces additional indirection.

## Immutability

Prototype-based objects can be immutable.

```js id="y4f1k7"
const prototype = Object.freeze({
    describe() {
        return "immutable behavior";
    }
});

const object = Object.freeze(
    Object.create(prototype)
);
```

Freezing the prototype and freezing the instance are separate operations.

A mutable instance can safely inherit from an immutable prototype, and an immutable instance can inherit from a mutable
prototype, although the latter can make its effective behavior change over time.

For stable value objects, immutable prototypes and instances can be useful.

## Prototype Identity

Prototype identity is observable:

```js id="q2m8v4"
Object.getPrototypeOf(object) === prototype;
```

Changing the prototype changes the object's behavioral relationship.

This matters when prototype identity is part of an API contract or when code uses `instanceof` with
constructor-associated prototypes.

## `instanceof` and Prototypes

`instanceof` is fundamentally a prototype-chain operation.

```js id="d9x5s1"
function User() {
}

const user = new User();

user instanceof User;
```

The operation checks whether `User.prototype` appears in the prototype chain of `user`.

This is another reason why prototype relationships matter independently of constructor invocation.

## Prototype Identity and Type Identity

In prototype-oriented systems, type-like identity can be expressed through prototype relationships rather than explicit
classes.

```js id="g6n3w8"
const animal = {
    kind: "animal"
};

const dog = Object.create(animal);
```

The object inherits from `animal`, but this does not automatically provide nominal type identity.

JavaScript remains dynamically typed at runtime, and TypeScript's type system is separate from runtime prototype
relationships.

## TypeScript

TypeScript can describe objects created through prototype relationships.

```ts id="r8c2m5"
interface User {
    name: string;

    greet(): string;
}

const userPrototype: Omit<User, "name"> = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const user = Object.create(userPrototype) as User;

user.name = "Alice";
```

The type assertion may be necessary because TypeScript cannot always infer the complete resulting object shape from
dynamic prototype construction.

This is one reason class syntax can be more convenient in strongly typed TypeScript code.

## TypeScript Structural Typing

TypeScript's structural type system works naturally with prototype-based objects.

```ts id="v1m7q3"
interface Printable {
    print(): string;
}

const printablePrototype: Printable = {
    print() {
        return String(this.value);
    }
};
```

An object does not need to be declared as a particular class to satisfy the interface.

This aligns well with JavaScript's behavioral object model.

## Prototype-Based Inheritance in TypeScript

TypeScript can model prototype-based JavaScript, but it generally provides better ergonomics for class syntax.

Direct prototype manipulation can require assertions and explicit type annotations.

For application code with substantial inheritance hierarchies, classes may therefore be easier to maintain.

Prototype-based design remains useful when the runtime JavaScript model itself is the important abstraction.

## Null-Prototype Objects in TypeScript

A null-prototype object may require careful typing:

```ts id="s7k4n2"
const dictionary = Object.create(null) as Record<string, number>;

dictionary["count"] = 1;
```

The TypeScript type describes the intended property structure, while the runtime prototype remains `null`.

The type system does not automatically express every runtime prototype characteristic.

## Prototype Mutation and TypeScript

TypeScript's static model can become inaccurate when runtime prototypes are mutated dynamically.

For example:

```js id="m8p3r6"
User.prototype.newMethod = function () {
    // ...
};
```

If the corresponding type declaration does not include `newMethod`, TypeScript consumers may not recognize the property.

Prototype augmentation should therefore be deliberate and accompanied by appropriate type declarations when using
TypeScript.

## Testing Prototype-Based Designs

Tests should verify observable behavior and prototype relationships when those relationships are part of the design.

```js id="c4n7x9"
const prototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

const user = Object.create(prototype);
user.name = "Alice";

expect(user.greet()).toBe("Hello, Alice");
expect(Object.getPrototypeOf(user)).toBe(prototype);
```

When prototype identity is merely an implementation detail, tests should generally focus on behavior rather than
internal prototype structure.

## Serialization

Prototype relationships are generally not preserved by JSON serialization.

```js id="j6w2p8"
const user = Object.create(userPrototype);
user.name = "Alice";

const serialized = JSON.stringify(user);
const restored = JSON.parse(serialized);
```

`restored` is an ordinary object rather than an object whose prototype is automatically restored to `userPrototype`.

If prototype identity matters, the application needs an explicit rehydration mechanism.

## Rehydration

A prototype-based object can be reconstructed explicitly:

```js id="u5r9k3"
function restoreUser(data) {
    const user = Object.create(userPrototype);

    user.name = data.name;

    return user;
}
```

This establishes the desired runtime behavior after deserialization.

Persisted data should still be validated before being attached to a domain object.

## Security Considerations

Prototype-based code requires careful handling of untrusted property names and objects.

Historically, prototype pollution vulnerabilities have occurred when applications allow untrusted input to mutate object
prototypes or merge attacker-controlled properties into shared objects.

Operations involving arbitrary keys, recursive object merging, dynamic property assignment, and prototype manipulation
should therefore be designed defensively.

Do not treat prototype manipulation as harmless configuration plumbing.

## Performance

Prototype-based method sharing can reduce per-instance memory usage because behavior is stored once and delegated to by
many objects.

However, JavaScript engine performance depends on object shapes, property access patterns, prototype stability, and
other runtime optimizations.

Frequent changes to object structure or prototypes can make optimization more difficult.

In particular, repeatedly changing prototypes with:

```js id="f2k8m5"
Object.setPrototypeOf(object, prototype);
```

is generally less desirable than creating objects with their intended prototype from the beginning.

Correctness and stable object design should take precedence over speculative micro-optimization.

## Object Shape Stability

JavaScript engines often optimize objects based on stable property layouts.

A constructor or factory that consistently creates objects with the same properties in a predictable manner can be
easier for an engine to optimize.

Prototype-based design does not inherently prevent such optimization.

The problematic cases are usually unnecessary dynamic structural changes, inconsistent initialization, and frequent
prototype mutation.

## Memory Management

Prototype sharing can reduce duplicated method functions.

However, prototypes can also retain references to large objects if those objects are stored directly on the prototype.

For example:

```js id="n3q7w1"
const prototype = {
    cache: new Map()
};
```

creates shared state retained by the prototype.

If the cache should belong to each instance, it should instead be initialized on each object.

Memory ownership should therefore be explicit.

## Lifecycle

Prototype relationships do not define object lifecycle.

Objects created from the same prototype can have completely independent lifetimes.

```js id="x9m4k2"
const first = Object.create(prototype);
const second = Object.create(prototype);
```

Destroying or releasing one object does not normally affect the other.

However, shared resources referenced by the prototype have a common lifetime and therefore require explicit management.

## Concurrency and Shared Prototype State

JavaScript environments can still have concurrency concerns involving asynchronous operations and shared mutable state.

If mutable state is stored on a shared prototype:

```js id="h1v6q8"
const prototype = {
    state: {}
};
```

multiple instances may unintentionally operate on the same state.

Per-instance mutable state should normally be stored on the individual object.

Shared state should be intentional and protected by an appropriate ownership model.

## Refactoring Toward Prototype-Based Design

Prototype-based design can be introduced when multiple objects share behavior and that behavior should be delegated
rather than copied.

Before:

```js id="q8s3m5"
function createUser(name) {
    return {
        name,

        greet() {
            return `Hello, ${this.name}`;
        }
    };
}
```

The method is recreated for every object.

A shared prototype can centralize it:

```js id="t7k2p4"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

function createUser(name) {
    const user = Object.create(userPrototype);

    user.name = name;

    return user;
}
```

This refactoring is useful when prototype sharing is meaningful and when direct object delegation is preferable to
per-instance method allocation.

## Refactoring Away From Prototype Mutation

Code that dynamically modifies prototypes at runtime can often be refactored toward stable object creation.

Instead of:

```js id="e4m9s2"
const user = {};
Object.setPrototypeOf(user, userPrototype);
```

create the object with the intended prototype:

```js id="b8v5q1"
const user = Object.create(userPrototype);
```

This makes the object's structural relationship explicit at creation time.

## Refactoring Deep Prototype Chains

Deep prototype chains can become difficult to understand.

For example, behavior spread across many prototype levels can make it unclear where a method originates.

Possible refactorings include:

* flattening prototypes;
* composing behaviors;
* using explicit delegation;
* extracting reusable functions;
* using a class hierarchy when inheritance is genuinely hierarchical;
* using Strategy or other behavioral patterns when the variation is algorithmic rather than structural.

The goal is not to eliminate prototype chains, but to keep the behavioral ownership understandable.

## Prototype-Based Design and Composition

Prototype relationships are one form of composition.

An object can acquire behavior by delegating to another object rather than inheriting from a rigid hierarchy.

This can be particularly effective when behaviors are orthogonal.

For example, a domain object may need capabilities for:

* serialization;
* validation;
* logging;
* comparison;
* iteration.

Those capabilities do not necessarily form a meaningful inheritance hierarchy.

Composition or explicit delegation can model them more accurately.

## Prototype-Based Design and Delegation

Delegation is central to prototype-based design.

A prototype does not necessarily represent a parent in the conceptual sense. It can simply provide behavior that another
object delegates to.

This makes prototype relationships useful for behavioral reuse without requiring every relationship to represent an
`is-a` hierarchy.

The distinction becomes important when designing systems where composition is more appropriate than taxonomy.

## Prototype-Based Design and Object Capability

Objects can be treated as capabilities: possessing a reference to an object grants access to the behavior exposed by
that object.

Prototype-based composition can support this style by constructing objects that expose only the operations required by
consumers.

The security properties still depend on the actual operations and references exposed. Prototype inheritance itself does
not create a security boundary.

## Prototype-Based Design and Flyweight

Prototype-based objects can share behavior and immutable data through prototypes, but this does not automatically make
the design Flyweight.

Flyweight specifically concerns sharing intrinsic state among many logical objects while externalizing extrinsic state.

Prototype sharing is fundamentally about property delegation and behavior reuse.

The two mechanisms can be combined, but they solve different problems.

## Prototype-Based Design and Decorator

Decorator wraps an object with another object that implements the same conceptual contract and adds behavior.

Prototype-based design establishes property delegation through the prototype chain.

A Decorator can internally use prototypes, but prototype inheritance is not itself Decorator.

## Prototype-Based Design and Composite

Composite models recursive part-whole structures.

Prototype-based design models object behavior and property delegation.

A Composite implementation can use prototypes for shared node behavior, but the existence of a prototype relationship
does not imply a Composite.

## Prototype-Based Design and Strategy

Strategy encapsulates interchangeable algorithms.

Prototype-based design concerns how objects obtain behavior and properties.

A prototype can contain a Strategy, and a Strategy can itself be a prototype-based object, but the concepts remain
separate.

## Prototype-Based Design and Factory Functions

Factory Functions can create objects with explicit prototypes:

```js id="p6k3n8"
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

function createUser(name) {
    const user = Object.create(userPrototype);

    user.name = name;

    return user;
}
```

The Factory Function owns creation.

The prototype owns shared delegated behavior.

This is a common JavaScript combination.

## Prototype-Based Design and Constructor Functions

Constructor Functions are another creation mechanism built around prototypes.

```js id="z1r7m4"
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

The constructor initializes instance state while the prototype provides shared behavior.

Prototype-based design is therefore the broader mechanism, while Constructor Function is one particular construction
pattern that uses it.

## Prototype-Based Design and Classes

Classes provide syntax for defining constructor behavior and prototype methods.

```js id="n5q8c2"
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

The method is normally stored on `User.prototype`.

The choice between classes and direct prototype manipulation should be based on the desired abstraction and API rather
than on the mistaken assumption that classes eliminate prototypes.

## Common Misuse

One common misuse is creating unnecessarily deep prototype hierarchies simply because JavaScript supports them.

Another is storing mutable instance state on shared prototypes.

Another is changing prototypes dynamically after objects have already been created.

Another is using inheritance where composition would better represent independent capabilities.

Another is treating prototypes as privacy mechanisms.

Another is using prototype manipulation when a plain object, Factory Function, or class would communicate the design
more clearly.

## Prototype Hierarchy Explosion

A prototype chain can become difficult to maintain when every variation creates another level:

```js id="u8m2q5"
base
    -> specialized
    -> more
specialized
    -> even
more
specialized
```

Conceptual diagrams of prototype chains are intentionally avoided here; the important point is that excessive delegation
levels make behavior harder to locate.

When the hierarchy becomes large, consider whether the variation should instead be represented by composition, Strategy,
configuration, or separate objects.

## Shared Mutable State

The following design is dangerous when each object is expected to own its own collection:

```js id="c7n4p1"
const userPrototype = {
    permissions: []
};
```

A mutation such as:

```js id="y2m8s6"
user.permissions.push("admin");
```

can modify the shared prototype array when no own `permissions` property exists.

The safer design is:

```js id="k9f3v7"
function createUser() {
    const user = Object.create(userPrototype);

    user.permissions = [];

    return user;
}
```

Ownership should always be explicit.

## Prototype Mutation as Global Configuration

Modifying a widely shared prototype to configure application behavior can create hidden global coupling.

For example:

```js id="q4s8m1"
SomeType.prototype.timeout = 5000;
```

can affect every current and future instance relying on that property.

Configuration should generally be explicit through construction, dependency injection, or instance state.

## Prototype Pollution

Applications that merge untrusted objects into application objects must be careful with properties such as `__proto__`,
`constructor`, and `prototype`.

Generic object-merging utilities should not blindly copy attacker-controlled properties into objects or prototypes.

Use well-defined schemas and explicit property handling at trust boundaries.

Prototype-based design does not cause prototype pollution, but code that dynamically manipulates object properties and
prototypes can expose this class of vulnerability.

## Recognizing an Opportunity

Prototype-based design is appropriate when:

1. Multiple objects should share behavior through delegation.
2. The relationship between objects is naturally represented through prototypes.
3. Direct object-to-object inheritance is more appropriate than class hierarchy construction.
4. Shared behavior should be stored once.
5. Objects need different own state while using common behavior.
6. Dynamic delegation is useful.
7. The runtime prototype relationship itself is meaningful.
8. A system already uses prototype-oriented APIs or libraries.

It is less appropriate when prototype relationships are being used merely to imitate a class hierarchy without a clear
reason to manipulate prototypes directly.

## Benefits

Prototype-based design provides:

* direct use of JavaScript's native object model;
* behavior sharing without copying;
* flexible object composition;
* direct delegation between objects;
* runtime extensibility;
* simple object creation through `Object.create()`;
* support for dynamic object relationships;
* natural integration with JavaScript protocols;
* efficient sharing of common behavior;
* freedom from requiring classes as the fundamental abstraction.

It can also model relationships that are awkward to express through rigid class hierarchies.

## Costs

Prototype-based design introduces:

* more dynamic behavior;
* potentially subtle property lookup;
* complexity from deep prototype chains;
* risks from shared mutable prototype state;
* difficulty representing runtime prototype relationships in static type systems;
* potential confusion around `this`;
* risks from prototype mutation;
* additional security considerations around prototype pollution;
* less explicit structure than classes for some domain models.

Direct prototype manipulation is therefore a powerful mechanism, but it should be used where its flexibility provides
actual value.

## Decision Criteria

Use Prototype-Based Design when object-to-object delegation and shared behavior are central to the model.

Use Constructor Functions when the system specifically needs constructable functions with instance initialization and
prototype-based behavior.

Use Factory Functions when the primary concern is encapsulating object creation and implementation selection.

Use classes when a class-oriented syntax provides a clearer representation of the object model and inheritance
relationships.

Use composition when behaviors are independent capabilities rather than an inheritance hierarchy.

Use Flyweight when the primary problem is sharing intrinsic state across many logical objects.

Use Decorator when the primary problem is dynamically adding responsibilities through wrappers.

Use Strategy when the primary variation concerns interchangeable algorithms or policies.

## Summary

Prototype-Based Design treats objects and their prototype relationships as the fundamental mechanism for behavior reuse
and delegation. An object can own its own state while delegating property lookup to a prototype, allowing many objects
to share behavior without copying it into every instance.

JavaScript's `[[Prototype]]` mechanism, `Object.create()`, constructor `prototype` properties, object literals, and
class prototypes all participate in this model. Classes and Constructor Functions provide different syntactic and
construction abstractions, but neither replaces the underlying prototype mechanism.

The most important design concerns are delegation, prototype identity, property lookup, ownership of mutable state,
prototype mutation, prototype-chain depth, and the distinction between behavioral reuse and actual domain inheritance.

Prototype-based design is most effective when its direct object-to-object model provides something valuable: flexible
delegation, shared behavior, dynamic composition, or a natural representation of relationships between concrete objects.
It becomes problematic when prototypes are manipulated merely to simulate classical inheritance, when shared mutable
state is hidden on prototypes, or when increasingly complex prototype chains obscure behavioral ownership.

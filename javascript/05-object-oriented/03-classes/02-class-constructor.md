# Constructors

## Constructor Definition

**Constructor:** A special class element used during object construction to initialize a newly created instance and
establish its initial state.

A constructor is defined using the special `constructor` method name inside a class body.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}
```

The constructor is executed when the class is constructed using the `new` operator.

```javascript
const user = new User("Ada");

console.log(user.name); // "Ada"
```

## Constructor Syntax

A constructor uses method syntax and must be named `constructor`.

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
```

A constructor does not use the `function` keyword.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}
```

The following is invalid:

```javascript
class User {
    function

    constructor(name) {
    } // SyntaxError
}
```

A class can contain at most one constructor definition.

## Constructor Invocation

Constructors are invoked as part of class construction using `new`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("Ada");
```

The constructor is not normally called directly:

```javascript
user.constructor(); // Not a normal constructor invocation
```

The intended construction operation is:

```javascript
new User("Ada");
```

A class constructor cannot be called without `new`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

User("Ada"); // TypeError
```

## Constructor vs. Instance Method

| Feature      | Constructor                    | Instance Method                |
|:-------------|:-------------------------------|:-------------------------------|
| Name         | `constructor`                  | Arbitrary method name          |
| Invocation   | During `new`                   | Explicit method call           |
| Purpose      | Initialize constructed objects | Implement object behavior      |
| Location     | Class definition               | Class prototype                |
| Invocation   | `new User()`                   | `user.method()`                |
| Frequency    | During each construction       | Whenever explicitly called     |
| Return Rules | Special constructor semantics  | Ordinary function return rules |

```javascript
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

The constructor initializes the instance:

```javascript
const user = new User("Ada");
```

The method performs behavior later:

```javascript
user.greet();
```

## Default Constructor

If a class does not explicitly define a constructor, ECMAScript provides a default constructor.

```javascript
class User {
}
```

A base class with no constructor behaves as though construction simply initializes the instance without additional
constructor logic.

```javascript
const user = new User();

console.log(user instanceof User); // true
```

A derived class without an explicit constructor receives a default constructor that forwards its arguments to
`super()`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
}
```

The derived class can therefore be constructed normally:

```javascript
const admin = new Admin("Ada");

console.log(admin.name); // "Ada"
```

## Base Class Constructor

A class without `extends` is a base class.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}
```

Its constructor can directly initialize `this`.

```javascript
const user = new User("Ada");

console.log(user.name); // "Ada"
```

For a base class, `this` represents the object being constructed.

## Derived Class Constructor

A class declared using `extends` is a derived class.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
    constructor(name, permissions) {
        super(name);

        this.permissions = permissions;
    }
}
```

A derived constructor must establish `this` through `super()` before accessing `this`.

```javascript
class Admin extends User {
    constructor(name) {
        super(name);

        this.name = name;
    }
}
```

Accessing `this` before `super()` is invalid.

```javascript
class Admin extends User {
    constructor(name) {
        this.name = name; // ReferenceError

        super(name);
    }
}
```

## `super()` in Constructors

`super()` invokes the superclass constructor and initializes the derived constructor's `this` value.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
    constructor(name, role) {
        super(name);

        this.role = role;
    }
}
```

The normal sequence is:

| Step | Operation                                 |
|:-----|:------------------------------------------|
| 1    | Derived constructor begins                |
| 2    | `super()` invokes superclass construction |
| 3    | `this` becomes initialized                |
| 4    | Derived constructor continues             |
| 5    | Derived state can be initialized          |

The actual ECMAScript specification contains more detailed construction semantics, but this is the useful
developer-level model.

## Constructor Initialization

Constructors are commonly used to establish the initial state of an instance.

```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}
```

Each construction creates an independently initialized object.

```javascript
const first = new User("Ada", "ada@example.com");
const second = new User("Grace", "grace@example.com");
```

The instances contain separate state:

```javascript
first.name = "Updated";

console.log(first.name);  // "Updated"
console.log(second.name); // "Grace"
```

## Constructor Parameters

Constructor parameters provide the values required to initialize an instance.

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

const user = new User("Ada", 36);
```

Default parameters can be used:

```javascript
class User {
    constructor(name = "Anonymous") {
        this.name = name;
    }
}

const user = new User();

console.log(user.name); // "Anonymous"
```

Destructuring can also be used:

```javascript
class User {
    constructor({name, age}) {
        this.name = name;
        this.age = age;
    }
}

const user = new User({
    name: "Ada",
    age: 36
});
```

## Constructor Parameter Validation

Constructors can validate arguments before establishing object state.

```javascript
class User {
    constructor(name) {
        if (typeof name !== "string" || name.length === 0) {
            throw new TypeError("name must be a non-empty string");
        }

        this.name = name;
    }
}
```

Invalid construction fails immediately:

```javascript
new User(""); // TypeError
```

This is useful when the class requires invariants that must hold for every valid instance.

## Constructor and Instance Fields

Public instance fields can be declared directly in the class body.

```javascript
class User {
    active = true;

    constructor(name) {
        this.name = name;
    }
}
```

The field and constructor assignment both contribute to the instance state.

```javascript
const user = new User("Ada");

console.log(user.active); // true
console.log(user.name);   // "Ada"
```

Field initialization follows ECMAScript-defined initialization rules and should not be assumed to be identical to
ordinary assignments inside the constructor.

## Instance Field Initialization in Base Classes

For a base class, instance fields are initialized as part of instance construction before the constructor body executes.

```javascript
class User {
    name = "Anonymous";

    constructor() {
        console.log(this.name);
    }
}

new User(); // "Anonymous"
```

This means the constructor can observe fields declared earlier as part of the class definition.

## Instance Field Initialization in Derived Classes

For derived classes, instance fields are initialized after `super()` returns.

```javascript
class User {
    constructor() {
        console.log(this.name);
    }
}

class Admin extends User {
    name = "Ada";

    constructor() {
        super();

        console.log(this.name);
    }
}

new Admin();

// undefined
// Ada
```

The superclass constructor cannot observe derived fields that have not yet been initialized.

## Constructor Execution Order

For a derived class, the important initialization relationship is:

```text
Derived constructor
        │
        ▼
     super()
        │
        ▼
Base construction
        │
        ▼
Base instance initialization
        │
        ▼
Base constructor body
        │
        ▼
Return to derived construction
        │
        ▼
Derived instance field initialization
        │
        ▼
Derived constructor body continues
```

This ordering is especially important when a superclass constructor accesses properties or methods that may be
overridden by a subclass.

## Constructor Return Values

Constructors have special return semantics.

A base constructor normally returns the constructed instance automatically.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("Ada");

console.log(user instanceof User); // true
```

A base constructor can explicitly return an object.

```javascript
class User {
    constructor() {
        return {
            name: "Ada"
        };
    }
}

const user = new User();

console.log(user.name); // "Ada"
console.log(user instanceof User); // false
```

Returning an object from a base constructor replaces the normally constructed result.

Returning a primitive does not replace the constructed object.

```javascript
class User {
    constructor() {
        return 42;
    }
}

const user = new User();

console.log(user instanceof User); // true
```

## Derived Constructor Return Values

Derived constructors have additional restrictions because `this` is initialized through superclass construction.

A derived constructor cannot simply complete without either returning an appropriate object or obtaining its
`this` value through `super()`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
    constructor(name) {
        super(name);
    }
}
```

Returning an explicit object from a derived constructor is possible:

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
    constructor() {
        super();
        return {
            role: "admin"
        };
    }
}

const admin = new Admin();

console.log(admin.role); // "admin"
```

A derived constructor that neither calls `super()` nor returns an object results in an error.

## Constructor and `this`

Inside a base constructor, `this` refers to the object being initialized.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}
```

In a derived constructor, `this` is unavailable until `super()` has successfully initialized it.

```javascript
class Admin extends User {
    constructor(name) {
        super(name);

        this.role = "admin";
    }
}
```

This distinction is one of the most important differences between base and derived constructors.

## Constructor and Private Fields

Private fields can be initialized inside constructors.

```javascript
class User {
    #id;

    constructor(id) {
        this.#id = id;
    }

    getId() {
        return this.#id;
    }
}
```

The private field is then available to methods of the class:

```javascript
const user = new User(123);

console.log(user.getId()); // 123
```

External code cannot access the private field directly.

```javascript
user.#id; // SyntaxError
```

Private fields declared in the class body are initialized according to class field initialization semantics.

## Constructor and Inheritance

Constructors participate in inheritance but are not inherited as ordinary methods.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
}
```

`Admin` does not receive `User.prototype.constructor` as its constructor implementation.

Instead, a derived class without an explicit constructor receives a default derived constructor that delegates
construction to the superclass.

```javascript
const admin = new Admin("Ada");

console.log(admin.name); // "Ada"
```

## Constructor Property

The prototype normally contains a `constructor` property referring back to the class constructor.

```javascript
class User {
}

console.log(User.prototype.constructor === User); // true
```

An instance normally reaches this property through its prototype:

```javascript
const user = new User();

console.log(user.constructor === User); // true
```

This does not mean that `constructor` is the mechanism used to initialize the object when calling `new`.

The `constructor` property is a property of the prototype object.

```javascript
Object.hasOwn(User.prototype, "constructor"); // true
Object.hasOwn(user, "constructor"); // false
```

## Constructor Is Not a Normal Method

Although constructor syntax resembles method syntax, the constructor has special language semantics.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}
```

It cannot be invoked like an ordinary method to create or reinitialize an instance.

```javascript
const user = new User("Ada");

user.constructor("Grace");
```

Calling `constructor` through an instance is not a supported way to re-run class initialization and should not be used
as an object lifecycle mechanism.

## Constructor vs. Factory Method

A constructor is invoked through `new`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("Ada");
```

A factory method is an ordinary method that creates and returns an object.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }

    static create(name) {
        return new User(name);
    }
}

const user = User.create("Ada");
```

Factories are useful when object creation requires validation, preprocessing, multiple construction paths, or a semantic
API that is clearer than direct construction.

## Constructor vs. Static Factory

| Feature          | Constructor                   | Static Factory                     |
|:-----------------|:------------------------------|:-----------------------------------|
| Invocation       | `new User()`                  | `User.create()`                    |
| Language special | Yes                           | No                                 |
| Primary purpose  | Initialize construction       | Encapsulate construction           |
| Return behavior  | Special constructor semantics | Ordinary function return semantics |
| Async support    | No direct `await` in `new`    | Can be `async`                     |
| Multiple paths   | Usually one constructor       | Multiple named factories possible  |

For asynchronous creation:

```javascript
class User {
    constructor(data) {
        this.name = data.name;
    }

    static async createFromApi(url) {
        const response = await fetch(url);
        const data = await response.json();

        return new User(data);
    }
}
```

The constructor itself remains synchronous while the factory handles asynchronous work.

## Constructor Overloading

JavaScript does not provide constructor overloading by signature.

This is not valid:

```javascript
class User {
    constructor(name) {
    }

    constructor(name, age) {
    } // SyntaxError
}
```

Only one constructor definition can exist in a class.

Different construction forms must instead be implemented using optional parameters, parameter inspection, destructuring,
or factory methods.

```javascript
class User {
    constructor(name, age = undefined) {
        this.name = name;
        this.age = age;
    }
}
```

For more complex creation paths, static factories are generally clearer:

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    static fromName(name) {
        return new User(name);
    }

    static fromData({name, age}) {
        return new User(name, age);
    }
}
```

## Constructor Chaining

JavaScript constructors do not support automatic constructor chaining between unrelated classes.

Inheritance requires explicit superclass construction through `super()`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

class Admin extends User {
    constructor(name, role) {
        super(name);

        this.role = role;
    }
}
```

The derived constructor controls when superclass construction occurs.

## Constructor Side Effects

Constructors execute during every construction operation.

```javascript
class User {
    constructor(name) {
        console.log(`Creating ${name}`);

        this.name = name;
    }
}

const user = new User("Ada");
```

Because construction is normally expected to establish object state, unrelated side effects should be avoided when they
are not part of the object's construction semantics.

Avoid using constructors for operations such as:

```javascript
class User {
    constructor() {
        // Avoid unnecessary network requests,
        // timers, unrelated global state mutations,
        // or other external side effects.
    }
}
```

If asynchronous or externally dependent initialization is required, use an explicit factory or initialization workflow.

## Constructor Invariants

A constructor can establish invariants that should remain true for the lifetime of an instance.

```javascript
class Account {
    constructor(balance) {
        if (!Number.isFinite(balance) || balance < 0) {
            throw new RangeError("balance must be a non-negative number");
        }

        this.balance = balance;
    }
}
```

After successful construction, the instance satisfies the constructor's validation requirements.

This makes invalid object states harder to introduce.

## Constructor and Object Identity

Every successful construction normally produces a distinct object.

```javascript
class User {
}

const first = new User();
const second = new User();

console.log(first === second); // false
```

The instances can share prototype behavior while maintaining independent identity and own properties.

```javascript
console.log(
    Object.getPrototypeOf(first) === Object.getPrototypeOf(second)
); // true
```

## Constructor and Prototype

The constructor itself is a function object, while instance methods are normally defined on its prototype.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

The relationship is:

```text
User
 │
 └── prototype ─────► User.prototype
                         │
                         ├── constructor ─────► User
                         │
                         └── greet()
```

An instance references the prototype:

```javascript
const user = new User("Ada");

Object.getPrototypeOf(user) === User.prototype; // true
```

The constructor therefore participates in both object construction and the prototype-based object model.

## Constructor and `new.target`

The `new.target` meta-property identifies the constructor that was originally invoked by `new`.

```javascript
class User {
    constructor() {
        console.log(new.target);
    }
}

new User();
```

`new.target` is particularly useful when constructor behavior needs to distinguish direct construction from construction
through inheritance.

```javascript
class User {
    constructor() {
        console.log(new.target.name);
    }
}

class Admin extends User {
}

new User();  // User
new Admin(); // Admin
```

The value of `new.target` is determined by the original constructor call, not simply by the constructor whose body is
currently executing.

## Constructor and `super` with `new.target`

`new.target` is preserved through superclass construction.

```javascript
class User {
    constructor() {
        console.log(new.target.name);
    }
}

class Admin extends User {
}

new Admin(); // Admin
```

Although `User`'s constructor body executes, the original construction target is `Admin`.

This is important when designing base classes intended for inheritance.

## Constructor Errors

A constructor can throw an exception when construction cannot produce a valid object.

```javascript
class User {
    constructor(name) {
        if (typeof name !== "string") {
            throw new TypeError("name must be a string");
        }

        this.name = name;
    }
}
```

Construction then fails:

```javascript
new User(123); // TypeError
```

No successfully constructed instance is returned to the caller.

## Constructor and `return`

Constructor return behavior can be summarized as:

| Constructor Type | Return Value                   | Result                          |
|:-----------------|:-------------------------------|:--------------------------------|
| Base             | No explicit return             | Constructed instance            |
| Base             | Primitive                      | Constructed instance            |
| Base             | Object                         | Explicitly returned object      |
| Derived          | `super()` result               | Derived instance initialization |
| Derived          | Object                         | Explicitly returned object      |
| Derived          | No `super()`, no object return | Construction error              |

For normal application code, constructors should generally initialize state rather than replace the constructed object
with another object.

## Best Practices

* **Use the constructor to establish initial object state:** Keep construction focused on making the instance valid and
  usable.
* **Validate required constructor arguments:** Reject invalid input before storing it as instance state.
* **Keep constructors synchronous:** Use static factories or explicit initialization methods when asynchronous work is
  required.
* **Call `super()` before using `this` in derived constructors:** Derived constructors cannot access their `this`
  value before superclass construction.
* **Do not define multiple constructors:** ECMAScript allows only one constructor per class.
* **Use default parameters for simple optional arguments:** Avoid unnecessary argument inspection.
* **Use configuration objects for complex constructor input:** Named properties are generally clearer than long
  positional parameter lists.
* **Establish object invariants during construction:** Do not intentionally expose partially initialized instances.
* **Avoid unnecessary constructor side effects:** Construction should not unexpectedly modify unrelated application
  state.
* **Use static factory methods for alternative construction paths:** Factories can provide semantic names and support
  preprocessing or asynchronous operations.
* **Do not call `constructor` directly to reinitialize objects:** Constructors are part of the construction mechanism,
  not a general-purpose reset operation.
* **Do not rely on constructor properties for initialization:** `prototype.constructor` identifies the constructor
  property but does not perform construction.
* **Keep superclass construction explicit:** Use `super()` deliberately when inheritance is involved.
* **Understand field initialization order:** Class fields have defined initialization semantics that interact with
  constructors and inheritance.
* **Avoid returning replacement objects from constructors unless intentional:** Explicit object returns alter normal
  construction behavior.
* **Use `new.target` only when constructor identity matters:** Avoid adding metaprogramming complexity without a clear
  requirement.
* **Keep constructor logic proportional to the abstraction:** Complex construction logic often belongs in factories or
  dedicated domain operations rather than one large constructor.
* **Prefer composition when inheritance makes constructors difficult to reason about:** Deep constructor chains can
  create strong coupling between base and derived classes.
* **Remember that constructors do not provide compile-time type safety:** JavaScript remains dynamically typed unless a
  separate type system such as TypeScript is used.

## Constructor Mental Model

The fundamental construction model can be summarized as:

```text
new User(arguments)
       │
       ▼
Class Constructor
       │
       ├── Base Class
       │      │
       │      ├── Instance initialization
       │      └── Constructor body
       │
       └── Derived Class
              │
              ├── super()
              │      └── Base construction
              ├── Derived instance fields
              └── Derived constructor body
       │
       ▼
Constructed Result
```

The critical distinction is:

```text
Base Constructor
    └── `this` is available during construction

Derived Constructor
    └── `this` becomes available only after `super()`
```

## Constructor Fundamentals Summary

| Concept                | Fundamental Rule                                                     |
|:-----------------------|:---------------------------------------------------------------------|
| Definition             | Use the special `constructor` method inside a class                  |
| Invocation             | Class construction uses `new`                                        |
| Call without `new`     | Throws `TypeError`                                                   |
| Quantity               | A class can define at most one constructor                           |
| Default constructor    | Provided when a class does not explicitly define one                 |
| Base constructor       | Can directly access `this`                                           |
| Derived constructor    | Must initialize `this` through `super()` before using `this`         |
| Parameters             | Used to provide initial construction data                            |
| Instance state         | Commonly established during construction                             |
| Validation             | Can enforce object invariants                                        |
| Return value           | Has special construction semantics                                   |
| `new.target`           | Identifies the original constructor target                           |
| Inheritance            | Derived constructors use `super()` to invoke superclass construction |
| Async construction     | Use factories when construction requires asynchronous operations     |
| Prototype relationship | `Class.prototype.constructor` normally references the class          |

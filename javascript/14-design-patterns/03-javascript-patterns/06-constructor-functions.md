# Constructor Functions

Constructor Functions are a JavaScript object-creation pattern in which a function is designed to initialize a new
object when invoked with the `new` operator. The function acts as the constructor while its `prototype` provides shared
behavior for instances.

Constructor Functions are the traditional JavaScript mechanism for defining reusable object types before the
introduction of `class` syntax in ECMAScript 2015. Classes provide a more structured syntax over JavaScript's existing
prototype-based object model, while constructor functions expose that model more directly.

A constructor function is therefore not simply any function that happens to initialize an object. Its intended usage is
as a constructor, normally indicated by a capitalized function name and invocation with `new`.

## Intent

The intent of a Constructor Function is to define a reusable object-creation mechanism in which each invocation with
`new` creates a new object associated with the constructor's prototype and initializes that object's instance state.

For example:

```js
function User(name, email) {
    this.name = name;
    this.email = email;
}

const user = new User("Alice", "alice@example.com");
```

The constructor initializes the instance-specific state, while methods can be placed on `User.prototype` so they are
shared by all instances.

```js
User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

The resulting object has access to `greet()` through the prototype chain without storing a separate copy of the function
on every instance.

## The Problem

JavaScript objects can be created directly with object literals:

```js
const user = {
    name: "Alice",
    email: "alice@example.com"
};
```

This works well for individual objects but does not define a reusable object-creation mechanism.

A constructor function provides a repeatable creation operation:

```js
function User(name, email) {
    this.name = name;
    this.email = email;
}

const first = new User("Alice", "alice@example.com");
const second = new User("Bob", "bob@example.com");
```

Each invocation creates an independent instance while associating the instances with the same prototype.

This provides a reusable object model without requiring class syntax.

## Basic Constructor Function

The simplest form is:

```js
function User(name) {
    this.name = name;
}

const user = new User("Alice");
```

By convention, constructor functions use PascalCase:

```js
function User() {
}

function Account() {
}

function HttpClient() {
}
```

This convention communicates that the function is intended to be invoked with `new`.

JavaScript does not enforce this naming convention. A lowercase function can technically be used as a constructor, but
doing so makes the API easier to misuse.

## What `new` Does

The `new` operator performs several operations when used with a constructor function.

Conceptually, when:

```js
const user = new User("Alice");
```

is evaluated, JavaScript creates a new object, establishes that object's prototype using `User.prototype`, invokes
`User` with the new object as `this`, and returns the resulting object unless the constructor explicitly returns another
object.

The important observable consequences are:

```js
user instanceof User;
```

and:

```js
Object.getPrototypeOf(user) === User.prototype;
```

assuming the prototype has not subsequently been replaced or otherwise changed.

The constructor function therefore participates in both instance initialization and prototype-based behavior.

## Instance State

Properties assigned through `this` become properties of the newly created instance.

```js
function User(name, role) {
    this.name = name;
    this.role = role;
}

const user = new User("Alice", "admin");
```

The resulting object has its own:

```js
user.name;
user.role;
```

Each instance receives its own values:

```js
const alice = new User("Alice", "admin");
const bob = new User("Bob", "user");

alice.name !== bob.name;
```

Instance state should contain data that belongs specifically to that object.

## Prototype Methods

Methods shared by all instances should normally be placed on the constructor's prototype.

```js
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

Now:

```js
const alice = new User("Alice");
const bob = new User("Bob");

alice.greet();
bob.greet();
```

Both objects resolve `greet` through `User.prototype`.

The function itself is shared:

```js
alice.greet === bob.greet;
```

This is one of the primary reasons to use the prototype rather than defining methods inside the constructor.

## Methods Defined Inside the Constructor

A constructor can also create methods directly on every instance:

```js
function User(name) {
    this.name = name;

    this.greet = function () {
        return `Hello, ${this.name}`;
    };
}
```

This gives each instance its own function:

```js
const alice = new User("Alice");
const bob = new User("Bob");

alice.greet === bob.greet; // false
```

This may be intentional when each instance needs a unique closure or function identity, but it is usually unnecessary
for ordinary methods.

Prototype methods provide shared behavior without allocating a new method function for every instance.

## Closures and Constructor Functions

Constructor functions can use closures for internal implementation details, although this changes the characteristics of
the resulting object.

```js
function BankAccount(initialBalance) {
    let balance = initialBalance;

    this.deposit = function (amount) {
        balance += amount;
    };

    this.getBalance = function () {
        return balance;
    };
}
```

Here, `balance` is private through lexical closure rather than being an object property.

This provides encapsulation but creates a separate function closure for each instance.

There is therefore a trade-off between closure-based private state and prototype-based shared methods.

## Constructor Properties

Constructor functions can define properties directly on the instance:

```js
function User(name) {
    this.name = name;
}
```

They can also have properties on the constructor function itself:

```js
User.type = "domain-user";
```

These are different namespaces.

```js
user.name;
User.type;
```

`user.name` belongs to an instance, while `User.type` belongs to the constructor function object.

Static class members provide a more formal syntax for the same general distinction when using classes.

## The `prototype` Property

Every ordinary function has a `prototype` property, but its meaning is particularly important for constructor functions.

```js
function User(name) {
    this.name = name;
}

console.log(User.prototype);
```

Objects created with:

```js
new User("Alice");
```

normally inherit from `User.prototype`.

The prototype therefore acts as the shared behavior object for instances of the constructor.

For example:

```js
User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

An instance does not need its own `greet` property because property lookup continues through its prototype chain.

## Prototype Lookup

Consider:

```js
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};

const user = new User("Alice");
```

When:

```js
user.greet();
```

is evaluated, JavaScript first looks for `greet` on `user`. If it is not found there, lookup continues through the
object's prototype, which is `User.prototype`.

This is the fundamental relationship between constructor functions and prototype-based inheritance.

## `constructor` Property

By default, a constructor function's prototype contains a `constructor` property pointing back to the constructor.

```js
function User() {
}

User.prototype.constructor === User;
```

This property is commonly encountered when inspecting prototypes.

It should not be confused with the function invocation mechanism itself. JavaScript does not use the `constructor`
property to determine which function `new` should call. The relevant prototype is obtained from the constructor
function's `prototype` property.

## Replacing the Prototype

A common operation is replacing the entire prototype:

```js
function User(name) {
    this.name = name;
}

User.prototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};
```

This changes the prototype object.

One consequence is that the automatically provided `constructor` property is no longer present unless it is explicitly
restored:

```js
User.prototype = {
    constructor: User,

    greet() {
        return `Hello, ${this.name}`;
    }
};
```

In many cases, adding methods individually to the existing prototype avoids this issue:

```js
User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

## Instance Identity

Each invocation of a constructor function with `new` normally creates a distinct object.

```js
const first = new User("Alice");
const second = new User("Alice");

first === second; // false
```

The two instances can contain equivalent values while remaining different object identities.

This matters when constructor-created objects represent entities with independent mutable state.

## `instanceof`

Constructor Functions participate naturally in the `instanceof` operator.

```js
function User() {
}

const user = new User();

user instanceof User; // true
```

`instanceof` works by examining the prototype chain and determining whether `User.prototype` occurs in that chain.

This means the result depends on the current prototype relationship rather than simply on the object's historical
origin.

For example, changing prototypes can affect `instanceof` behavior.

## `Object.getPrototypeOf`

The actual prototype of an instance can be inspected directly:

```js
const user = new User("Alice");

Object.getPrototypeOf(user) === User.prototype;
```

This is generally a more direct way to inspect the prototype relationship than inferring it through constructor
metadata.

## Constructor Return Values

A constructor function can explicitly return a value.

Primitive return values are ignored when the function is invoked with `new`:

```js
function Example() {
    this.value = 1;
    return 42;
}

const example = new Example();

example.value; // 1
```

If the constructor explicitly returns an object, that object becomes the result of the `new` expression:

```js
function Example() {
    this.value = 1;

    return {
        value: 2
    };
}

const example = new Example();

example.value; // 2
```

This behavior is legal but can make constructor semantics surprising.

Constructors should generally initialize the instance rather than deliberately replace it with an unrelated object.

## Constructors Without `new`

A constructor function called normally does not receive the special initialization behavior provided by `new`.

```js
function User(name) {
    this.name = name;
}

User("Alice");
```

In strict mode, `this` is `undefined` inside the function and assigning `this.name` throws.

In non-strict code, `this` can resolve to a different object depending on the invocation context, potentially causing
accidental global or ambient mutation.

Constructor functions should therefore normally be treated as APIs requiring `new`.

## Enforcing Constructor Usage

A constructor can check whether it was invoked correctly.

```js
function User(name) {
    if (!(this instanceof User)) {
        throw new TypeError("User must be called with new");
    }

    this.name = name;
}
```

This was a common defensive technique in pre-class JavaScript.

Modern JavaScript can also use `new.target`:

```js
function User(name) {
    if (!new.target) {
        throw new TypeError("User must be called with new");
    }

    this.name = name;
}
```

`new.target` directly indicates whether the function was invoked through constructor semantics.

## `new.target`

`new.target` provides information about the constructor invocation.

```js
function User(name) {
    console.log(new.target);
    this.name = name;
}

new User("Alice");
```

When called with `new`, `new.target` refers to the constructor that was invoked through the constructor call.

It can also be useful when constructor functions participate in inheritance:

```js
function User(name) {
    if (new.target === User) {
        // Direct construction.
    }

    this.name = name;
}
```

This should be used for an actual construction invariant rather than merely because the feature exists.

## Constructor Inheritance

Constructor functions can participate in prototype-based inheritance.

```js
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};

function Admin(name) {
    User.call(this, name);
}
```

The child constructor must also establish the desired prototype relationship:

```js
Admin.prototype = Object.create(User.prototype);
Admin.prototype.constructor = Admin;
```

Methods specific to `Admin` can then be added:

```js
Admin.prototype.deleteUser = function () {
    return "User deleted";
};
```

Now:

```js
const admin = new Admin("Alice");

admin.greet();
admin.deleteUser();
```

The `Admin` prototype inherits from `User.prototype`.

## Calling the Parent Constructor

The parent constructor can be invoked explicitly:

```js
function Admin(name, permissions) {
    User.call(this, name);
    this.permissions = permissions;
}
```

`User.call(this, name)` executes `User` with the new `Admin` instance as its `this`.

This is the traditional constructor-function inheritance technique.

It should be distinguished from prototype inheritance itself. Calling the parent constructor initializes inherited
instance state; linking prototypes provides inherited behavior.

## Prototype-Based Inheritance

Constructor Function inheritance normally consists of two separate mechanisms.

The first is constructor invocation:

```js
User.call(this, name);
```

This initializes instance-specific state.

The second is prototype linkage:

```js
Admin.prototype = Object.create(User.prototype);
```

This establishes inherited behavior.

Both are required when reproducing the behavior commonly associated with classical inheritance.

## `Object.create`

`Object.create` is useful for establishing prototype relationships:

```js
Admin.prototype = Object.create(User.prototype);
```

It creates a new object whose internal prototype is `User.prototype`.

This is different from:

```js
Admin.prototype = new User();
```

The latter actually invokes the parent constructor and can unintentionally initialize parent instance state during
prototype setup.

`Object.create` is therefore normally preferable for establishing the prototype relationship itself.

## Classes and Constructor Functions

JavaScript classes provide a class-based syntax over the language's existing prototype-based object model.

A class:

```js
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

corresponds conceptually to the same broad object model as:

```js
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

The syntax and some semantics differ, but both use instances and prototypes.

Classes should therefore not be described as replacing JavaScript's prototype model. They provide a more structured
syntax for working with it.

## Constructor Functions Versus Classes

Constructor Functions provide direct access to the underlying function-and-prototype mechanism.

Classes provide:

* explicit class syntax;
* constructor declarations;
* method syntax;
* inheritance syntax through `extends`;
* `super`;
* private fields and methods;
* static members;
* stricter constructor invocation semantics.

Constructor Functions remain valid JavaScript and can be appropriate when direct manipulation of prototypes or
compatibility with older code is important.

For new code, classes are often clearer when the domain is naturally modeled using class-based object types. Constructor
Functions remain particularly relevant when working directly with prototype APIs or maintaining existing JavaScript
systems.

## Constructor Functions Versus Factory Functions

Constructor Functions and Factory Functions both encapsulate object creation, but they have different invocation and
object-model semantics.

A Constructor Function is normally invoked with `new`:

```js
const user = new User("Alice");
```

A Factory Function is normally invoked directly:

```js
const user = createUser("Alice");
```

A Constructor Function automatically establishes the new object's prototype from the constructor's `prototype` property.

A Factory Function can return any value and can choose any implementation.

A Constructor Function therefore has stronger built-in semantics around instance creation and prototype identity, while
a Factory Function provides greater freedom over what gets returned.

## Constructor Functions Versus Object Literals

Object literals create individual objects directly:

```js
const user = {
    name: "Alice"
};
```

Constructor Functions define a reusable creation mechanism:

```js
function User(name) {
    this.name = name;
}
```

Object literals are often preferable for simple data structures.

Constructor Functions become useful when repeated instances share behavior, when prototype-based inheritance is
required, or when a reusable construction contract is meaningful.

## Constructor Functions Versus Prototype

Prototype is the mechanism through which objects can inherit properties and behavior.

Constructor Functions use prototypes as part of their instance model.

The two concepts should not be treated as competing patterns.

A constructor function defines how instances are initialized, while its prototype can provide shared behavior.

## Constructor Functions Versus Singleton

A Constructor Function normally creates a new instance each time it is invoked with `new`:

```js
const first = new User();
const second = new User();

first !== second;
```

Singleton concerns restricting a type or service to one shared instance.

A constructor function therefore does not imply Singleton semantics.

A separate factory, module, registry, or lifecycle mechanism may choose to construct only one instance.

## Constructor Functions Versus Factory Method

A Constructor Function is not the GoF Factory Method pattern.

Constructor Functions define a JavaScript mechanism for creating instances through `new`.

Factory Method is a creational design pattern in which a method provides a polymorphic creation point, commonly allowing
subclasses to specialize which concrete product is created.

The existence of a constructor function does not imply Factory Method.

## Constructor Functions Versus Abstract Factory

Abstract Factory creates families of related objects through an abstract creation interface.

Constructor Functions generally create instances of one constructor-defined type.

For example:

```js
function Button(label) {
    this.label = label;
}
```

is a constructor function.

An object exposing multiple coordinated creation operations:

```js
const uiFactory = {
    createButton() {
    },
    createDialog() {
    },
    createMenu() {
    }
};
```

is closer to Abstract Factory.

The distinction is the scope of the creation abstraction.

## Constructor Functions Versus Builder

Builder separates complex object construction into a construction process.

Constructor Functions normally initialize an object directly from constructor arguments:

```js
const user = new User(name, email, role);
```

Builder becomes useful when construction involves many optional parameters, multiple construction stages, validation
across stages, or different representations of the construction process.

A constructor can internally use a Builder, but the two patterns solve different construction problems.

## Constructor Functions Versus Prototype

Prototype, as a creational pattern, concerns creating objects from existing prototype objects.

Constructor Functions create and initialize instances through constructor invocation.

Although Constructor Functions depend heavily on JavaScript's prototype mechanism, that does not make every constructor
use an implementation of the Prototype design pattern.

## Constructor Functions and Dependency Injection

Constructor Functions can receive dependencies as arguments:

```js
function OrderService(repository, paymentGateway) {
    this.repository = repository;
    this.paymentGateway = paymentGateway;
}
```

The instance is then created with explicit dependencies:

```js
const service = new OrderService(repository, paymentGateway);
```

This makes dependencies visible and testable.

A constructor should generally receive dependencies rather than resolving them from global state:

```js
function OrderService() {
    this.repository = container.resolve("repository");
}
```

The latter hides the dependency and couples the constructor to a service locator.

## Constructor Validation

Constructors are an appropriate place to reject invalid initial state.

```js
function User(name, email) {
    if (!name) {
        throw new TypeError("Name is required");
    }

    if (!email.includes("@")) {
        throw new TypeError("Invalid email");
    }

    this.name = name;
    this.email = email;
}
```

The constructor should establish the invariants required for a valid instance.

Subsequent business operations should remain responsible for maintaining those invariants after construction.

## Defensive Copies

If a constructor accepts mutable external data, it should establish the appropriate ownership semantics.

```js
function User(name, permissions) {
    this.name = name;
    this.permissions = [...permissions];
}
```

This prevents later mutations of the caller's original array from automatically changing the instance.

Whether copying is appropriate depends on the ownership contract. Sharing mutable state can be intentional, but it
should not happen accidentally.

## Constructor Defaults

Default values can be established during construction:

```js
function User(name, role = "user") {
    this.name = name;
    this.role = role;
}
```

Defaults should represent valid initial state rather than hiding missing required information.

If a value is required, silently inventing a default can be worse than rejecting invalid input.

## Private State

Traditional Constructor Functions did not have native private fields.

Several techniques were historically used.

Closure-based privacy:

```js
function Account(initialBalance) {
    let balance = initialBalance;

    this.deposit = function (amount) {
        balance += amount;
    };

    this.getBalance = function () {
        return balance;
    };
}
```

Naming conventions:

```js
function Account(balance) {
    this._balance = balance;
}
```

The underscore is only a convention and does not provide actual privacy.

Modern JavaScript also supports private class fields:

```js
class Account {
    #balance;

    constructor(initialBalance) {
        this.#balance = initialBalance;
    }
}
```

If native `#private` state is required, classes generally provide the clearer syntax. Constructor Functions should not
simulate privacy unnecessarily when the language's class syntax is already appropriate.

## Arrow Functions as Constructors

Arrow functions cannot be used with `new`.

```js
const User = name => {
    this.name = name;
};
```

This is not a Constructor Function.

Attempting:

```js
new User("Alice");
```

throws because arrow functions do not have the constructor behavior required by `new`.

Traditional function declarations and function expressions can be constructors when their semantics permit it.

## Bound Functions

Bound functions have more nuanced constructor behavior.

```js
function User(name) {
    this.name = name;
}

const BoundUser = User.bind(null);

const user = new BoundUser("Alice");
```

A bound function can still participate in construction when its target is constructable.

This is usually an advanced mechanism and should not be used merely to emulate ordinary constructor invocation.

## Async Constructor Functions

Constructor functions cannot themselves be declared `async`:

```js
async function User() {
}
```

An `async` function is not constructable with `new`.

If construction requires asynchronous work, common alternatives include an async factory:

```js
async function createUser(id) {
    const data = await loadUser(id);

    return new User(data.name);
}
```

or a synchronous constructor followed by an explicit asynchronous initialization operation.

Asynchronous construction should be designed carefully because partially initialized instances are difficult to reason
about.

## Resource Management

A constructor may acquire resources:

```js
function DatabaseClient(connection) {
    this.connection = connection;
}
```

If the constructor owns the resource, the resulting object should expose a clear lifecycle:

```js
DatabaseClient.prototype.close = function () {
    return this.connection.close();
};
```

The ownership contract should be explicit.

A constructor that acquires resources but provides no way to release them can create leaks.

## Lifecycle

Constructor Functions normally represent independent instance creation.

Each call:

```js
new User(...);
```

creates a new object identity.

If an application instead needs:

* one shared instance;
* cached instances;
* pooled instances;
* lazy instances;
* scoped instances;

those lifecycle policies should generally be implemented outside the constructor itself.

Separating object construction from instance-lifetime policy keeps the constructor's responsibility focused.

## Static-Like Behavior

Constructor functions themselves are objects and can therefore have properties and methods:

```js
function User(name) {
    this.name = name;
}

User.createGuest = function () {
    return new User("Guest");
};
```

This is conceptually similar to a static operation associated with the type.

Classes provide explicit `static` syntax:

```js
class User {
    static createGuest() {
        return new User("Guest");
    }
}
```

The underlying distinction remains between properties belonging to instances and properties belonging to the constructor
object.

## Factory Functions Built on Constructor Functions

A Factory Function can hide a Constructor Function:

```js
function User(name) {
    this.name = name;
}

function createUser(name) {
    return new User(name);
}
```

This combines both patterns.

The constructor defines the object implementation while the factory defines the public creation policy.

This is useful when the implementation may later change or when callers should not know about the constructor.

## Constructor Functions and Registries

Constructor functions can be stored in registries:

```js
const constructors = new Map();

constructors.set("user", User);
constructors.set("admin", Admin);

function create(type, ...args) {
    const Constructor = constructors.get(type);

    if (!Constructor) {
        throw new Error(`Unknown type: ${type}`);
    }

    return new Constructor(...args);
}
```

The registry controls constructor selection, while the constructors define object initialization.

As with any registry, registration order, duplicate keys, lifecycle, security, and test isolation become relevant.

## TypeScript

TypeScript supports Constructor Functions, although classes are generally the clearer syntax for defining typed
constructable object types.

A constructor function can be typed normally:

```ts
interface User {
    name: string;

    greet(): string;
}

function User(name: string): User {
    return {
        name,

        greet() {
            return `Hello, ${name}`;
        }
    };
}
```

However, this particular function is actually a factory because it returns an object rather than functioning as a `new`
constructor.

For a genuine Constructor Function:

```ts
interface User {
    name: string;

    greet(): string;
}

interface UserConstructor {
    new(name: string): User;
}

function User(this: User, name: string) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

Constructor signatures become especially useful when a constructor is passed around as a value.

## Constructor Types

TypeScript can explicitly represent constructable values:

```ts
type Constructor<T> = new (...args: any[]) => T;
```

A generic constructor type can then be used:

```ts
function create<T>(
    Constructor: new (...args: any[]) => T,
    ...args: any[]
): T {
    return new Constructor(...args);
}
```

This allows code to operate on constructors without depending on one specific implementation.

More precise constructor signatures should be preferred when the argument types are known.

## Structural Typing

TypeScript's structural type system means consumers often do not need to know which constructor created an object.

```ts
interface Logger {
    info(message: string): void;
}

function useLogger(logger: Logger) {
    logger.info("Application started");
}
```

The consumer depends on the object's behavior rather than its constructor identity.

This can reduce coupling and makes Constructor Functions compatible with interface-oriented design.

## Constructor Functions and Interfaces

TypeScript interfaces describe instance shapes:

```ts
interface User {
    name: string;
}
```

A separate constructor interface can describe the constructable side:

```ts
interface UserConstructor {
    new(name: string): User;
}
```

This distinction reflects an important property of JavaScript: a constructor function has both an instance-facing role
and a function-object role.

The instance has one shape; the constructor itself has another.

## Testing

Constructor Functions are straightforward to test when construction is deterministic.

```js
const user = new User("Alice");

expect(user.name).toBe("Alice");
expect(user instanceof User).toBe(true);
```

Prototype behavior can also be tested:

```js
expect(user.greet()).toBe("Hello, Alice");
expect(Object.getPrototypeOf(user)).toBe(User.prototype);
```

When constructors receive dependencies, tests can supply controlled substitutes:

```js
const service = new OrderService(fakeRepository, fakePaymentGateway);
```

Avoid testing implementation details such as exact prototype structure unless that structure is itself part of the
contract.

## Performance

Constructor Functions can be efficient for large populations of similar objects when shared methods are placed on the
prototype.

This avoids creating a separate function object for each instance.

```js
User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

By contrast:

```js
function User(name) {
    this.name = name;

    this.greet = function () {
        return `Hello, ${this.name}`;
    };
}
```

allocates a new function for every instance.

Performance should not be the only criterion. Closure-based methods may be justified when per-instance private state is
required.

## Memory Considerations

Prototype sharing can reduce memory consumption because instances reference shared method functions instead of storing
copies.

However, constructor design still determines the amount of per-instance state.

Large arrays, objects, closures, event subscriptions, caches, and resource handles stored directly on every instance can
dominate memory usage regardless of prototype sharing.

Memory optimization should therefore focus on the actual object graph rather than assuming that prototype-based
construction is automatically inexpensive.

## Mutability

Constructor-created objects are usually mutable unless the constructor explicitly establishes immutability.

```js
function User(name) {
    this.name = name;
}
```

allows:

```js
user.name = "Bob";
```

A constructor can instead freeze the object:

```js
function Config(options) {
    this.timeout = options.timeout;
    this.retries = options.retries;

    Object.freeze(this);
}
```

This only provides shallow immutability.

Whether instances should be mutable is a domain and API decision, not a requirement of Constructor Functions.

## Object Identity and Equality

Constructor Functions create object identities rather than value equality.

```js
const a = new User("Alice");
const b = new User("Alice");

a === b; // false
```

If the domain treats two values with the same contents as equivalent, explicit value-object semantics may be more
appropriate.

Constructor Functions are generally better suited to entities or stateful objects where identity matters.

## Serialization

Prototype methods are not serialized as part of ordinary JSON serialization.

```js
JSON.stringify(user);
```

typically serializes the object's own enumerable data properties but not methods inherited from the prototype.

After deserialization:

```js
const data = JSON.parse(serialized);
```

the resulting object is an ordinary object rather than automatically becoming a `User` instance.

Rehydration therefore requires explicit reconstruction:

```js
const user = new User(data.name);
```

This distinction matters when constructor-created objects cross persistence or transport boundaries.

## Rehydration

A constructor may be used to reconstruct an instance from persisted data:

```js
function User(name, role) {
    this.name = name;
    this.role = role;
}

function rehydrateUser(data) {
    return new User(data.name, data.role);
}
```

The rehydration process should distinguish trusted persisted state from ordinary external input.

Constructors should not assume that serialized data is automatically valid.

## Common Misuse

One common misuse is treating every function with `this` as a constructor.

A function becomes a Constructor Function through its intended use with `new` and the object-creation semantics
associated with that invocation.

Another misuse is putting every method directly on instances without considering prototype sharing.

Another is manually manipulating prototypes when ordinary classes would provide a clearer and safer abstraction.

Another is allowing constructors to perform extensive I/O, database access, network communication, or unrelated
application workflows. Constructors should normally establish object state rather than execute large business processes.

## Constructor Explosion

Constructors can become difficult to use when they require many positional arguments:

```js
new User(
    name,
    email,
    role,
    active,
    permissions,
    locale,
    timezone,
    preferences
);
```

This makes call sites difficult to read and increases the risk of argument-order errors.

An options object can make the API clearer:

```js
function User({
                  name,
                  email,
                  role = "user",
                  active = true
              }) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.active = active;
}
```

Alternatively, a Builder may be appropriate when construction is genuinely complex.

## Constructor Overloading

JavaScript does not provide traditional function overloading.

A constructor can inspect its arguments:

```js
function User(nameOrOptions, email) {
    if (typeof nameOrOptions === "string") {
        this.name = nameOrOptions;
        this.email = email;
        return;
    }

    this.name = nameOrOptions.name;
    this.email = nameOrOptions.email;
}
```

However, increasingly complex constructor signatures often indicate that separate factories, explicit creation
functions, or options objects would provide a clearer API.

## Constructor Chaining

Constructor functions can reuse common initialization logic:

```js
function User(name) {
    this.name = name;
}

function Admin(name, permissions) {
    User.call(this, name);
    this.permissions = permissions;
}
```

This allows the child constructor to reuse parent initialization.

However, constructor chaining and prototype inheritance are separate mechanisms and should be designed deliberately.

## Prototype Pollution Considerations

Because Constructor Functions rely on prototypes, code that accepts arbitrary property names or mutates prototypes
dynamically should be designed carefully.

Application code should avoid unnecessary mutation of shared prototypes:

```js
User.prototype.someMethod =
...
```

is reasonable during type definition, while uncontrolled runtime modification can make behavior difficult to reason
about.

Prototype manipulation can also become a security concern when untrusted input is allowed to influence object prototypes
or inherited properties.

## Architectural Use

Constructor Functions are most relevant in codebases that deliberately use prototype-based object models or need
compatibility with traditional JavaScript APIs.

They can be useful for:

* domain entities;
* reusable stateful objects;
* legacy JavaScript systems;
* libraries exposing constructor-based APIs;
* prototype-based inheritance hierarchies;
* objects requiring shared prototype behavior;
* APIs where `instanceof` and constructor identity are meaningful.

They are less compelling when a simpler factory function or plain object is sufficient.

## Refactoring Toward a Constructor Function

A Constructor Function can be introduced when many callers repeatedly create structurally identical objects and those
objects share behavior.

Before:

```js
const user = {
    name,
    greet() {
        return `Hello, ${this.name}`;
    }
};
```

A constructor-based design can centralize the type:

```js
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

Consumers then create instances consistently:

```js
const user = new User(name);
```

The refactoring is most useful when the object has meaningful identity, shared behavior, or prototype relationships.

## Refactoring Toward a Factory Function

A Constructor Function can be replaced with a Factory Function when consumers do not need constructor identity,
prototype inheritance, or direct `instanceof` semantics.

Before:

```js
function User(name) {
    this.name = name;
}

const user = new User("Alice");
```

After:

```js
function createUser(name) {
    return {
        name
    };
}

const user = createUser("Alice");
```

This can simplify the API and gives the creation function freedom to return different implementations.

The refactoring should not be performed merely because factories are syntactically simpler. It should reflect the
desired object contract.

## Refactoring Toward a Class

A Constructor Function can be migrated to a class when the codebase benefits from explicit class syntax.

Before:

```js
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

After:

```js
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

The conceptual object model remains prototype-based, but the source representation becomes more explicit.

This migration is generally straightforward when the constructor already follows conventional prototype-based design.

## Recognizing an Opportunity

Constructor Functions are appropriate when:

1. Multiple instances share a common prototype-based behavior model.
2. Instance initialization should be centralized.
3. Constructor identity is meaningful.
4. `instanceof` semantics are useful.
5. Prototype inheritance is intentionally part of the design.
6. The codebase already uses constructor-based APIs.
7. Compatibility with existing JavaScript libraries requires constructable functions.
8. Direct access to prototype mechanics is useful.

They are less appropriate when object creation is trivial, when implementation selection is the primary concern, or when
callers should not depend on constructor identity.

## Benefits

Constructor Functions provide:

* reusable object construction;
* explicit instance initialization;
* prototype-based method sharing;
* object identity;
* prototype inheritance;
* compatibility with traditional JavaScript;
* constructable APIs;
* support for `instanceof`;
* direct control over prototype relationships;
* straightforward dependency injection through constructor arguments.

They also provide a direct view of JavaScript's underlying prototype-based object model.

## Costs

Constructor Functions also introduce:

* reliance on `new`;
* possible misuse through ordinary function calls;
* more manual prototype management;
* verbose inheritance patterns;
* awkward private-state techniques in pre-class code;
* potential constructor argument complexity;
* subtle behavior around explicit object returns;
* increased complexity compared with object literals for simple data;
* less readable inheritance syntax than modern classes.

For new code, classes or Factory Functions may often provide a clearer API depending on the desired abstraction.

## Decision Criteria

Use a Constructor Function when the object should have a constructor-defined identity and a prototype-based behavior
model.

Use a Factory Function when the primary requirement is encapsulated creation and the returned representation should
remain flexible.

Use a class when the object model is class-oriented and the clarity of `class`, `constructor`, `extends`, `super`,
private fields, and static members is valuable.

Use Builder when construction itself is complex enough to require a dedicated assembly process.

Use Prototype when object creation is fundamentally based on cloning or deriving from an existing prototype object.

Use Abstract Factory when coordinated families of related objects must be created.

Use Factory Method when the problem specifically involves polymorphic creation through an overridable method structure.

## Summary

Constructor Functions are JavaScript functions intended to be invoked with `new` to create and initialize objects. The
`new` operation establishes the new object's prototype relationship, invokes the constructor with the new object as
`this`, and normally returns that object.

Their defining feature is the combination of constructor-based initialization and prototype-based behavior sharing.
Instance state is normally assigned through `this`, while shared methods belong on the constructor's `prototype`.

Constructor Functions are distinct from Factory Functions. A Factory Function is a general creation boundary that can
return any value or implementation, while a Constructor Function participates in JavaScript's constructable object and
prototype model.

Classes provide a more expressive modern syntax for many of the same underlying prototype-based concepts, but
Constructor Functions remain a valid and important part of JavaScript's object model, particularly when maintaining
legacy systems, interacting with constructor-based APIs, or working directly with prototypes.

The pattern should be used deliberately. Constructor Functions are valuable when constructor identity, prototype
sharing, or prototype-based inheritance are meaningful parts of the object contract. They are unnecessary when a plain
object or Factory Function provides a simpler and more appropriate abstraction.

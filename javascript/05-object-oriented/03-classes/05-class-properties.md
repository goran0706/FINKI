# Class Properties

## Class Property Syntax

**Class Properties:** Properties declared directly inside a class body. They can be instance properties or static
properties.

```javascript
class User {
    name;
    age = 25;
}
```

A class property can be declared without an initializer:

```javascript
class User {
    name;
    age;
}

const user = new User();

console.log(user.name); // undefined
console.log(user.age);  // undefined
```

The property still exists as an own property of the instance.

```javascript
console.log(Object.hasOwn(user, "name")); // true
console.log(Object.hasOwn(user, "age"));  // true
```

## Instance Properties

**Instance Property:** A property that exists independently on every instance created from the class.

```javascript
class User {
    name = "Unknown";
    active = true;
}

const user1 = new User();
const user2 = new User();

console.log(user1.name);   // "Unknown"
console.log(user2.name);   // "Unknown"

console.log(user1 === user2); // false
```

Each instance receives its own property.

```javascript
class User {
    settings = {};
}

const user1 = new User();
const user2 = new User();

console.log(user1.settings === user2.settings); // false
```

The initializer is evaluated separately for every new instance.

## Property Initializers

**Property Initializer:** An expression assigned to a class property when the instance is initialized.

```javascript
class User {
    name = "Unknown";
    age = 0;
    active = true;
}
```

Initializers can contain expressions:

```javascript
class User {
    id = crypto.randomUUID();
    createdAt = new Date();
    active = true;
}
```

They can also reference `this`:

```javascript
class User {
    firstName = "John";
    lastName = "Doe";

    fullName = `${this.firstName} ${this.lastName}`;
}

const user = new User();

console.log(user.fullName); // "John Doe"
```

Property initializers are evaluated in declaration order.

```javascript
class Example {
    first = 10;
    second = this.first + 5;
    third = this.second + 5;
}

const example = new Example();

console.log(example.first);  // 10
console.log(example.second); // 15
console.log(example.third);  // 20
```

A property cannot reliably depend on a property declared later.

```javascript
class Example {
    first = this.second;
    second = 10;
}

const example = new Example();

console.log(example.first);  // undefined
console.log(example.second); // 10
```

## Properties vs Constructor Assignment

Class properties can be declared directly in the class body:

```javascript
class User {
    name = "Unknown";
    active = true;
}
```

The same properties can also be assigned inside the constructor:

```javascript
class User {
    constructor() {
        this.name = "Unknown";
        this.active = true;
    }
}
```

Both create instance properties, but they are not semantically identical.

Class field declarations use the class field initialization mechanism, while assignments such as `this.name = ...` are
ordinary property assignments.

This distinction matters when inheritance, setters, property descriptors, or initialization order are involved.

```javascript
class Base {
    set name(value) {
        console.log("setter:", value);
    }
}

class Derived extends Base {
    name = "John";
}

new Derived(); // no setter call
```

A constructor assignment behaves differently:

```javascript
class Base {
    set name(value) {
        console.log("setter:", value);
    }
}

class Derived extends Base {
    constructor() {
        super();
        this.name = "John";
    }
}

new Derived(); // "setter: John"
```

## Constructor Parameters and Properties

**Constructor Parameters:** Values passed to `new` that can be used to initialize instance properties.

```javascript
class User {
    name;
    age;

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
```

A property declaration can document the instance shape while the constructor provides the actual values.

```javascript
class User {
    name;
    age;
    active;

    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.active = true;
    }
}
```

Property initializers cannot directly access constructor parameters:

```javascript
class User {
    name = nameParameter;

    constructor(nameParameter) {
        // ...
    }
}
```

The constructor parameter is scoped to the constructor and is not available to the class field initializer.

Use the constructor when initialization depends on constructor arguments:

```javascript
class User {
    name;

    constructor(name) {
        this.name = name;
    }
}
```

## Property Initialization Order

**Initialization Order:** Class fields are initialized in their declaration order.

```javascript
class User {
    firstName = "John";
    lastName = "Doe";
    fullName = `${this.firstName} ${this.lastName}`;
}

const user = new User();

console.log(user.fullName); // "John Doe"
```

Changing the order changes the result:

```javascript
class User {
    fullName = `${this.firstName} ${this.lastName}`;
    firstName = "John";
    lastName = "Doe";
}

const user = new User();

console.log(user.fullName); // "undefined undefined"
```

Each property initializer runs before the next property is initialized.

```javascript
class Example {
    a = 1;
    b = this.a + 1;
    c = this.b + 1;
}

const example = new Example();

console.log(example); // { a: 1, b: 2, c: 3 }
```

## Properties in Derived Classes

**Derived Class:** A class created using `extends`.

```javascript
class User {
    name = "Unknown";
}

class Admin extends User {
    role = "admin";
}
```

Instance properties of a derived class are initialized after `super()` returns.

```javascript
class User {
    name = "User";

    constructor() {
        console.log(this.name);
    }
}

class Admin extends User {
    role = "Admin";

    constructor() {
        super();

        console.log(this.role);
    }
}

new Admin();

// User
// Admin
```

The base constructor runs before the derived class's instance properties are initialized.

```javascript
class Base {
    constructor() {
        console.log(this.role);
    }
}

class Derived extends Base {
    role = "admin";
}

new Derived();

// undefined
```

The derived property does not exist yet when the base constructor executes.

## Property Ownership

**Own Property:** A property directly stored on an object rather than inherited through its prototype chain.

```javascript
class User {
    name = "John";

    getName() {
        return this.name;
    }
}

const user = new User();

console.log(Object.hasOwn(user, "name"));   // true
console.log(Object.hasOwn(user, "getName")); // false
```

The property is stored on the instance:

```javascript
console.log(user.name);
```

The method is stored on the prototype:

```javascript
console.log(User.prototype.getName);
```

This distinction is fundamental:

```text
Instance
    │
    ├── name
    ├── age
    └── other instance properties
    │
    ▼
User.prototype
    │
    └── getName()
```

## Property Descriptors

**Property Descriptor:** The metadata describing how an object property behaves.

Public class fields create properties that are writable, enumerable, and configurable.

```javascript
class User {
    name = "John";
}

const user = new User();

console.log(
    Object.getOwnPropertyDescriptor(user, "name")
);
```

Conceptually:

```
{
  value: "John",
  writable: true,
  enumerable: true,
  configurable: true
}
```

Therefore:

```javascript
user.name = "Jane";

delete user.name;

console.log(user.name); // undefined
```

And because the property is enumerable:

```javascript
class User {
    name = "John";
}

const user = new User();

console.log(Object.keys(user));
// ["name"]
```

## Computed Properties

**Computed Property Name:** A property name calculated from an expression.

```javascript
const propertyName = "name";

class User {
    [propertyName] = "John";
}

const user = new User();

console.log(user.name); // "John"
```

Template literals can also be used:

```javascript
const prefix = "user";

class User {
    [`${prefix}Id`] = 100;
}

const user = new User();

console.log(user.userId); // 100
```

The computed property name is determined when the class is defined.

```javascript
const propertyName = "name";

class User {
    [propertyName] = "John";
}
```

Every instance receives the same property name:

```javascript
const user1 = new User();
const user2 = new User();

console.log(Object.keys(user1)); // ["name"]
console.log(Object.keys(user2)); // ["name"]
```

## Static Properties

**Static Property:** A property stored on the class constructor rather than on each instance.

```javascript
class User {
    static type = "user";
}
```

Access static properties through the class:

```javascript
console.log(User.type); // "user"
```

They are not instance properties:

```javascript
const user = new User();

console.log(user.type); // undefined
```

Static properties exist once on the class:

```javascript
class User {
    static count = 0;
}

console.log(User.count); // 0
```

They are useful for class-level state or configuration:

```javascript
class User {
    static entityName = "users";
    static version = 1;
}
```

Access:

```javascript
console.log(User.entityName); // "users"
console.log(User.version);    // 1
```

## Instance vs Static Properties

| Property Type | Syntax                 | Stored On | Access      |
|:--------------|:-----------------------|:----------|:------------|
| Instance      | `name = "John"`        | Instance  | `user.name` |
| Static        | `static name = "John"` | Class     | `User.name` |

Example:

```javascript
class User {
    name = "John";
    static type = "user";
}

const user = new User();

console.log(user.name); // "John"
console.log(User.type);  // "user"
```

Do not confuse:

```javascript
user.name
```

with:

```javascript
User.name
```

They refer to different objects.

## Object Properties vs Class Properties

JavaScript objects can receive properties dynamically:

```javascript
const user = {};

user.name = "John";
user.age = 30;
```

Classes allow the expected instance properties to be declared as part of the class definition:

```javascript
class User {
    name;
    age;
}
```

This makes the intended instance structure explicit.

```javascript
class User {
    name;
    age;
    active;
}
```

The declaration does not prevent additional properties from being added:

```javascript
const user = new User();

user.name = "John";
user.age = 30;
user.active = true;
user.email = "john@example.com";

console.log(user.email);
```

JavaScript classes do not automatically enforce a fixed object shape.

## Property Shadowing

**Property Shadowing:** An own property hides a property with the same name found on the prototype chain.

```javascript
class User {
    get role() {
        return "user";
    }
}

const user = new User();

console.log(user.role); // "user"
```

An own property can shadow the inherited property:

```javascript
user.role = "admin";

console.log(user.role); // "admin"
```

The instance property takes precedence over the inherited property.

```text
user.role
   │
   ├── own property exists?
   │       │
   │       └── yes → use it
   │
   └── otherwise → search prototype
```

## Properties and Methods

Properties store object state.

Methods define behavior.

```javascript
class User {
    name = "John";

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

Here:

```javascript
name
```

is an instance property, while:

```javascript
greet()
```

is an instance method.

The property belongs to each instance:

```javascript
const user1 = new User();
const user2 = new User();

console.log(user1.name);
console.log(user2.name);
```

The method is shared through the prototype:

```javascript
console.log(user1.greet === user2.greet); // true
```

## Properties Containing Objects

**Object-Valued Property:** A property whose value is an object, array, function, or another reference type.

```javascript
class User {
    settings = {
        theme: "dark",
        notifications: true
    };
}
```

Each instance receives a separate object:

```javascript
const user1 = new User();
const user2 = new User();

user1.settings.theme = "light";

console.log(user1.settings.theme); // "light"
console.log(user2.settings.theme); // "dark"
```

Do not use a shared mutable object when each instance requires independent state.

Use:

```javascript
class User {
    settings = {};
}
```

rather than sharing one mutable object:

```javascript
const settings = {};

class User {
    settings = settings;
}
```

The second approach gives every instance a reference to the same object.

## Properties Containing Arrays

Arrays behave the same way:

```javascript
class User {
    permissions = [];
}

const user1 = new User();
const user2 = new User();

user1.permissions.push("read");

console.log(user1.permissions); // ["read"]
console.log(user2.permissions); // []
```

Each instance receives its own array because the initializer is evaluated for every instance.

## Public Properties

**Public Property:** A property accessible through normal object property access.

```javascript
class User {
    name = "John";
}

const user = new User();

console.log(user.name); // "John"

user.name = "Jane";

console.log(user.name); // "Jane"
```

Public properties are not encapsulated from external code.

```javascript
user.name = "Changed";
delete user.name;
```

Both operations are possible because public class fields are ordinary public properties with writable and configurable
behavior.

## Private Properties

**Private Property:** A class property declared with `#` that can only be accessed from code belonging to the class.

```javascript
class User {
    #password = "secret";

    checkPassword(password) {
        return this.#password === password;
    }
}
```

Accessing it from outside the class is invalid:

```javascript
const user = new User();

console.log(user.#password);
// SyntaxError
```

Private properties are different from public properties:

```javascript
class User {
    name = "John";
    #password = "secret";
}
```

The public property is externally accessible:

```javascript
console.log(user.name);
```

The private property is not:

```javascript
console.log(user.#password);
```

Use private properties when the class must enforce internal state boundaries.

## Property Initialization and `this`

**`this`:** The instance being initialized when an instance property initializer executes.

```javascript
class User {
    name = "John";
    greeting = `Hello ${this.name}`;
}

const user = new User();

console.log(user.greeting); // "Hello John"
```

The property initializer can access previously initialized instance properties:

```javascript
class User {
    firstName = "John";
    lastName = "Doe";

    fullName = `${this.firstName} ${this.lastName}`;
}
```

Methods can also access properties through `this`:

```javascript
class User {
    name = "John";

    getName() {
        return this.name;
    }
}
```

## Properties and Inheritance

Properties declared in a base class are initialized for derived instances as part of base-class initialization.

```javascript
class User {
    name = "John";
}

class Admin extends User {
    role = "admin";
}

const admin = new Admin();

console.log(admin.name); // "John"
console.log(admin.role); // "admin"
```

Both properties are own properties of the same instance:

```javascript
console.log(Object.hasOwn(admin, "name")); // true
console.log(Object.hasOwn(admin, "role")); // true
```

The properties are not inherited from `User.prototype`.

## Property Redefinition in Derived Classes

A derived class can declare a property with the same name as a base class property:

```javascript
class User {
    role = "user";
}

class Admin extends User {
    role = "admin";
}

const admin = new Admin();

console.log(admin.role); // "admin"
```

The derived field initialization replaces the value established by the base class.

## Properties Are Not Prototype Properties

A common misconception is that class properties are stored on the prototype.

They are not.

```javascript
class User {
    name = "John";

    greet() {
        return "Hello";
    }
}

const user = new User();

console.log(Object.hasOwn(user, "name")); // true
console.log(Object.hasOwn(user, "greet")); // false

console.log(Object.hasOwn(User.prototype, "name")); // false
console.log(Object.hasOwn(User.prototype, "greet")); // true
```

The structure is:

```text
User
 │
 └── prototype
       │
       └── greet()

user
 │
 └── name
```

## Property Names

Class properties can use valid identifier names:

```javascript
class User {
    name = "John";
    age = 30;
}
```

They can also use string property names:

```javascript
class User {
    "first-name" = "John";
}
```

Access such properties using bracket notation:

```javascript
const user = new User();

console.log(user["first-name"]); // "John"
```

Symbol property names are also possible:

```javascript
const id = Symbol("id");

class User {
    [id] = 100;
}

const user = new User();

console.log(user[id]); // 100
```

## Property Replacement

Public class properties can be reassigned after construction:

```javascript
class User {
    name = "John";
}

const user = new User();

user.name = "Jane";

console.log(user.name); // "Jane"
```

A property can also be replaced with a different type:

```javascript
user.name = 100;

console.log(user.name); // 100
```

JavaScript does not enforce the intended property type at runtime.

If a property must maintain an invariant, enforce it through class methods, accessors, private state, or explicit
validation.

## Properties and Getters

A property can expose computed behavior through a getter:

```javascript
class User {
    firstName = "John";
    lastName = "Doe";

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
```

Usage:

```javascript
const user = new User();

console.log(user.fullName); // "John Doe"
```

`fullName` is not an own data property:

```javascript
console.log(Object.hasOwn(user, "fullName")); // false
```

It is an accessor defined on the prototype.

```javascript
console.log(
    Object.getOwnPropertyDescriptor(User.prototype, "fullName")
);
```

This differs from:

```javascript
class User {
    firstName = "John";
    lastName = "Doe";

    fullName = `${this.firstName} ${this.lastName}`;
}
```

In the second version, `fullName` is an own data property initialized during construction.

## Properties and Setters

A setter can control assignments to a property:

```javascript
class User {
    #name = "";

    set name(value) {
        if (typeof value !== "string") {
            throw new TypeError("name must be a string");
        }

        this.#name = value;
    }

    get name() {
        return this.#name;
    }
}
```

Usage:

```javascript
const user = new User();

user.name = "John";

console.log(user.name); // "John"
```

This pattern is useful when property assignment requires validation or normalization.

## Static Property Initialization

Static properties are initialized when the class itself is evaluated.

```javascript
class User {
    static type = "user";
    static version = 1;
}

console.log(User.type);    // "user"
console.log(User.version); // 1
```

They are not initialized separately for every instance.

```javascript
const user1 = new User();
const user2 = new User();

console.log(User.type); // "user"
```

There is only one `User.type` property.

## Static Property Inheritance

Static properties participate in class inheritance through the constructor's prototype relationship.

```javascript
class User {
    static type = "user";
}

class Admin extends User {
}

console.log(Admin.type); // "user"
```

An inherited static property can be shadowed:

```javascript
class User {
    static type = "user";
}

class Admin extends User {
    static type = "admin";
}

console.log(User.type);  // "user"
console.log(Admin.type); // "admin"
```

## Common Mistakes

* **Using Instance Properties as Shared State:** Instance properties are created independently for each instance.

```javascript
class User {
    count = 0;
}
```

Each object has its own `count`.

* **Assuming Properties Live on the Prototype:** Public instance fields are own properties of instances.

```javascript
const user = new User();

console.log(Object.hasOwn(user, "name")); // true
```

* **Using Constructor Arguments in Field Initializers:** Constructor parameters are not in scope for field initializers.

```javascript
class User {
    name = nameParameter; // invalid reference

    constructor(nameParameter) {
    }
}
```

* **Depending on Later Properties:** Field initializers execute in declaration order.

```javascript
class User {
    fullName = this.name;
    name = "John";
}

console.log(new User().fullName); // undefined
```

* **Confusing Static and Instance Properties:**

```javascript
class User {
    name = "John";
    static type = "user";
}

const user = new User();

console.log(user.name); // "John"
console.log(User.type); // "user"
```

* **Sharing Mutable State Unintentionally:**

```javascript
const settings = {};

class User {
    settings = settings;
}
```

All instances reference the same object.

## Best Practices

* **Use instance properties for object-specific state:** Keep unique data on individual object instances.
* **Use private fields for internal details:** Enforce encapsulation and prevent external tampering.
* **Use getters and setters for controlled access:** Implement validation or computation during property reads and
  updates.
* **Keep getter and setter logic lightweight:** Avoid performing expensive asynchronous operations or heavy computations
  inside property accessors to prevent unexpected performance bottlenecks during standard reads and writes.
* **Pair setters with corresponding getters:** Maintain symmetric property interfaces by providing a getter whenever a
  setter is defined for a controlled property, unless write-only behavior is explicitly intended.
* **Use static fields for constants and shared caches:** Store immutable configuration values, lookup tables, or shared
  resource pools directly on the class using static definitions.
* **Avoid shadowing instance properties with static properties:** Ensure static field names do not collide with instance
  property names to prevent confusion and runtime context bugs.
* **Keep private fields strictly encapsulated:** Restrict `#` property access to internal class methods rather than
  exposing raw values through unnecessary public accessors.
* **Validate incoming values within setters defensively:** Check bounds, types, and domain rules inside setter blocks to
  reject invalid data before it corrupts internal state.
* **Use class field syntax for clean initial state:** Declare public and private instance fields directly at the class
  body level for improved readability over constructor assignments.
* **Avoid heavy side effects inside property accessors:** Ensure getters and setters read or write state cleanly without
  triggering unexpected network requests, logging storms, or UI updates.
* **Leverage static initialization blocks for complex setup:** Use `static { ... }` blocks when static fields require
  complex logic, try-catch handling, or environmental checks during class loading.
* **Document computed property behavior clearly:** Note any underlying calculations or data transformations inside JSDoc
  comments above getters to inform consumers of read performance implications.
* **Protect sensitive state with private properties:** Combine `#` fields with immutable data structures or frozen
  objects when exposing internal properties to prevent deep mutation.
* **Design properties for stable public contracts:** Treat public property names and accessor signatures as long-term
  API agreements to avoid breaking consuming modules during internal refactoring.
* **Use read-only getters for derived state:** Omit matching setters for properties that represent calculated values
  derived from other internal instance fields.
* **Minimize static mutable state:** Avoid modifying static properties globally across instances to prevent race
  conditions and unpredictable side effects in shared environments.
* **Audit object memory footprint when using private fields:** Keep property structures clean and avoid redundant
  storage allocations in high-volume object instantiation scenarios.
* **Test accessors and validation rules explicitly:** Write comprehensive unit test cases targeting edge conditions,
  boundary limits, and invalid inputs passed through property setters.
* **Keep property naming conventions consistent:** Maintain clear camelCase formatting across all public, private,
  static, and computed class properties across the codebase.
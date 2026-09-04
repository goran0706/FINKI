# Class Fundamentals

## Class Syntax & Definitions

**Class Syntax:** A language construct for defining a constructor, prototype methods, instance fields, static members,
private elements, and inheritance relationships using JavaScript's prototype-based object model.

| Definition Type   | Description                                                                                   |
|:------------------|:----------------------------------------------------------------------------------------------|
| Class Declaration | Defines a class using the `class` keyword and creates a lexical binding for the class         |
| Class Expression  | Defines a class as an expression that produces a class value, which can be assigned or passed |
| Named Class       | A class with an explicit name that is available within the class body                         |
| Anonymous Class   | A class expression without an explicit class name                                             |

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const UserClass = class {
    constructor(name) {
        this.name = name;
    }
};
```

Classes are first-class values and can be assigned to variables, passed as arguments, returned from functions, and
stored in object properties.

## Class Declaration

A class declaration creates a lexical binding for the class and can be referenced after the declaration has been
evaluated. Class declarations are subject to the temporal dead zone and cannot be accessed before their declaration is
evaluated.

```javascript
const user = new User(); // ReferenceError — TDZ
class User {
}
```

A class declaration does not create an instance — it creates the class constructor and its associated prototype.

## Class Expression

A class expression produces a class value that can be assigned to a variable or used directly as an expression,
optionally with an internal name available only inside the class body:

```javascript
const User = class UserClass {
    static create() {
        return new UserClass("Ada"); // internal name usable here
    }
};

const user = User.create();
// UserClass is not defined in the surrounding scope — only `User` is
```

## Class Body — Element Overview

A class body can contain a constructor, fields, methods, accessors, static members, private elements, and static
initialization blocks. A class body is always evaluated in strict mode.

| Class Element          | Syntax Example                              | Belongs To            |
|:-----------------------|:--------------------------------------------|:----------------------|
| Constructor            | `constructor() {}`                          | Instance construction |
| Instance Field         | `name = "Ada"`                              | Individual instance   |
| Instance Method        | `greet() {}`                                | Class prototype       |
| Getter / Setter        | `get name() {}` / `set name(v) {}`          | Class prototype       |
| Static Field / Method  | `static version = 1` / `static create() {}` | Class constructor     |
| Private Field / Method | `#name = "Ada"` / `#validate() {}`          | Instance private data |
| Static Private Field   | `static #count = 0`                         | Class private data    |
| Static Block           | `static {}`                                 | Class initialization  |

## Class Instance Architecture

A class definition creates a constructor function object and a prototype object used by instances created from the
class.

```javascript
class User {
    name = "Ada";

    greet() {
        return `Hello, ${this.name}`;
    }

    static create() {
        return new User();
    }
}
```

```text
User
 ├── static create()
 └── prototype
      └── greet()

user
 ├── name
 └── [[Prototype]] → User.prototype
```

| Component           | Location / Purpose                                                     |
|:--------------------|:-----------------------------------------------------------------------|
| Class Constructor   | The class value used with `new` to create instances                    |
| Instance Properties | Own properties stored directly on each instance                        |
| Instance Methods    | Properties of the class prototype shared by instances                  |
| Static Members      | Properties of the class constructor                                    |
| Private Elements    | Language-enforced private state associated with instances or the class |
| Prototype Chain     | Links instances and classes to inherited behavior                      |

## Instance Properties vs. Prototype Methods

Instance fields and prototype methods have different ownership semantics.

```javascript
class User {
    name = "Ada";

    greet() {
        return `Hello, ${this.name}`;
    }
}

const first = new User();
const second = new User();

Object.hasOwn(first, "name");            // true — field is own to each instance
Object.hasOwn(first, "greet");           // false — method is not own
Object.hasOwn(User.prototype, "greet");  // true — method lives on the shared prototype

first.greet === second.greet; // true — same function object, shared
```

## The `new` Operator Execution Flow

When a class is constructed with `new`, ECMAScript performs construction through the class constructor's internal
construction semantics.

A simplified model:

| Step | Action                                                         |
|:-----|:---------------------------------------------------------------|
| 1    | Creates the object used as the new instance                    |
| 2    | Establishes the appropriate prototype relationship             |
| 3    | Initializes the instance according to class semantics          |
| 4    | Executes the constructor                                       |
| 5    | Produces the constructed result according to constructor rules |

This simplified model is not the literal ECMAScript algorithm — derived classes, `super()`, private fields, field
initialization order, and explicit constructor returns each carry additional semantics beyond this outline.

## Constructors

A constructor is a special class element defined with the `constructor` method name, executed when the class is
constructed with `new`.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }
}

const user = new User("Ada");
```

A class can define at most one constructor. If a base class does not define one, ECMAScript provides a default
constructor, so a base class with no constructor can still be instantiated directly:

```javascript
class User {
}

const user = new User();
```

## Constructors vs. Methods

| Feature    | Constructor                             | Instance Method                 |
|:-----------|:----------------------------------------|:--------------------------------|
| Purpose    | Initialize a newly constructed instance | Implement instance behavior     |
| Execution  | Invoked during construction             | Invoked explicitly              |
| Invocation | `new User()`                            | `user.greet()`                  |
| Location   | Class constructor                       | Class prototype                 |
| Frequency  | Once per construction                   | Every time the method is called |
| `this`     | Represents the constructed instance     | Depends on the call site        |

## Classes Require `new`

Class constructors cannot be invoked as ordinary functions.

```javascript
class User {
}

User(); // TypeError

const user = new User(); // required
```

This differs from an ordinary function, which is callable with or without `new`:

```javascript
function User() {
}

User();      // valid
new User();  // valid
```

## Instance Fields

Public instance fields are declared directly in the class body, and each constructed instance receives its own copy.

```javascript
class User {
    name = "Anonymous";
    active = true;
}

const first = new User();
const second = new User();
first.name = "Ada";

console.log(first.name);  // "Ada"
console.log(second.name); // "Anonymous"
```

A field without an initializer is initialized to `undefined`, but is still an own property of the instance:

```javascript
class User {
    name;
}

const user = new User();
console.log(user.name);       // undefined
Object.hasOwn(user, "name");  // true
```

## Instance Field Initialization Order

Instance fields are initialized in declaration order — a field cannot rely on a later-declared field already being
initialized.

```javascript
class User {
    firstName = "Ada";
    lastName = "Lovelace";
    fullName = `${this.firstName} ${this.lastName}`; // fine — both fields already set above
}

console.log(new User().fullName); // "Ada Lovelace"
```

```javascript
class Example {
    first = this.second; // `second` isn't initialized yet
    second = 10;
}

const example = new Example();
console.log(example.first);  // undefined
console.log(example.second); // 10
```

## Instance Fields vs. Constructor Assignments

```javascript
// Field
class User {
    active = true;
}

// Constructor assignment
class User {
    constructor() {
        this.active = true;
    }
}
```

These forms are not universally interchangeable — class fields have their own initialization ordering rules,
particularly once inheritance is involved. Use fields for straightforward declared instance state, and constructors when
initialization requires constructor arguments or procedural logic.

## Instance Methods

Instance methods are defined without the `static` keyword and are normally stored on the class prototype, shared by
every instance rather than copied per instance.

```javascript
class User {
    greet() {
        return "Hello";
    }
}

const first = new User();
const second = new User();
first.greet === second.greet; // true — same shared function
first.greet();                 // accessed through the prototype chain
```

## Method Definitions

Methods use concise method syntax, and can also be asynchronous, generators, or asynchronous generators:

```javascript
class Example {
    async load() {
        return 42;
    }

    * values() {
        yield 1;
        yield 2;
    }

    async* stream() {
        yield 1;
        yield 2;
    }
}
```

## Getters and Setters

A getter defines behavior for reading a property; a setter defines behavior for assigning one. Both are accessed using
normal property syntax, not function-call syntax.

```javascript
class User {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

const user = new User("Ada", "Lovelace");
console.log(user.fullName); // accessed as a property, no parentheses
```

```javascript
class User {
    set name(value) {
        this._name = value.trim();
    }

    get name() {
        return this._name;
    }
}

user.name = " Ada "; // invokes the setter via normal assignment
```

## Static Members

Static members belong to the class constructor rather than individual instances, and are accessed through the class —
never through an instance.

```javascript
class User {
    static type = "user";

    static create(name) {
        return new User(name);
    }

    constructor(name) {
        this.name = name;
    }
}

console.log(User.type);
const user = User.create("Ada");

const instance = new User("Ada");
instance.type;   // undefined
instance.create; // undefined
```

## Static Methods

A static method is declared with the `static` keyword and is useful when an operation is associated with the class
itself rather than a particular instance — a common example is a factory method:

```javascript
class User {
    constructor(name) {
        this.name = name;
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new User(data.name);
    }
}
```

## Static Fields

Static fields belong to the class constructor and are not copied onto instances.

```javascript
class User {
    static type = "user";
    static count = 0;
}

console.log(User.type);
console.log(User.count);

const user = new User();
user.type;  // undefined
user.count; // undefined
```

## Static Initialization Blocks

A static initialization block executes during class evaluation, useful when static state requires initialization logic
that can't be expressed as a simple field initializer. Multiple static fields and blocks execute in declaration order.

```javascript
class Registry {
    static items = new Map();
    static {
        Registry.items.set("default", "value");
    }
}
```

```javascript
class Example {
    static first = 1;
    static {
        console.log("first block");
    }
    static second = 2;
    static {
        console.log("second block");
    }
}
```

## Private Elements

Private elements use the `#` syntax and can only be accessed from code with access to the corresponding private name —
not from outside the class, and not interchangeably with a `_name` naming convention.

```javascript
class User {
    #password;

    constructor(password) {
        this.#password = password;
    }

    checkPassword(password) {
        return this.#password === password;
    }
}

const user = new User("secret");
user.#password; // SyntaxError

class Loose {
    _password = "secret"; // public — merely a naming convention
}

loose._password; // accessible normally
```

## Private Fields

Private fields provide language-level encapsulation for instance state — they are not ordinary string-keyed properties,
so bracket notation can't reach them either.

```javascript
class Account {
    #balance = 0;

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}

const account = new Account();
account.#balance;        // SyntaxError
account["#balance"];     // undefined
```

## Private Methods

Private methods use the `#` prefix and are available only from code belonging to the class that declares them — never
exposed as public prototype properties.

```javascript
class User {
    #normalize(name) {
        return name.trim().toLowerCase();
    }

    constructor(name) {
        this.name = this.#normalize(name);
    }
}
```

## Private Static Members

Private static members belong to the class rather than individual instances, and cannot be accessed through an instance.

```javascript
class Counter {
    static #value = 0;

    static increment() {
        Counter.#value++;
        return Counter.#value;
    }
}

Counter.increment(); // 1
Counter.increment(); // 2
```

## Inheritance with `extends`

A class can inherit from another class using `extends`; the resulting instance can access both its own methods and
inherited ones through the prototype chain.

```javascript
class Animal {
    speak() {
        return "sound";
    }
}

class Dog extends Animal {
    bark() {
        return "woof";
    }
}

const dog = new Dog();
dog.bark();
dog.speak();
```

```text
dog
  ↓
Dog.prototype
  ↓
Animal.prototype
  ↓
Object.prototype
  ↓
null
```

## Derived Constructors

A class using `extends` is a derived class. If it defines a constructor, that constructor must call `super()` before
accessing `this` — a derived constructor does not receive an initialized `this` until superclass construction has
completed successfully.

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}
```

```javascript
class Dog extends Animal {
    constructor(name) {
        this.name = name; // ReferenceError — this before super()
        super(name);
    }
}
```

## Default Derived Constructor

If a derived class does not define a constructor, ECMAScript provides a default one that forwards its arguments to the
superclass.

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
}

const dog = new Dog("Rex");
console.log(dog.name); // "Rex"
```

## `super`

`super` provides access to superclass behavior — inside an instance method, `super.method()` calls the superclass's
version; inside a derived constructor, `super()` invokes the superclass constructor; inside a static method, `super`
accesses inherited static behavior.

```javascript
class Animal {
    speak() {
        return "sound";
    }

    static type() {
        return "animal";
    }
}

class Dog extends Animal {
    speak() {
        return `${super.speak()} + bark`;
    }

    constructor(name) {
        super(name);
    }

    static type() {
        return `${super.type()} -> dog`;
    }
}
```

`super` is a language-level construct with specific property-access and construction semantics — it is not simply an
alias for the parent class.

## Method Overriding

A subclass can define a method with the same name as an inherited one; the subclass's version is used when called on a
subclass instance, and the superclass's version remains reachable through `super`.

```javascript
class Animal {
    speak() {
        return "sound";
    }
}

class Dog extends Animal {
    speak() {
        return `${super.speak()} -> woof`;
    }
}

new Dog().speak(); // "sound -> woof"
```

## Inheritance of Static Members

Static members participate in the inheritance relationship between class constructors — inherited, not copied.

```javascript
class Animal {
    static type = "animal";
}

class Dog extends Animal {
}

console.log(Dog.type); // "animal" — inherited

Object.hasOwn(Animal, "type"); // true
Object.hasOwn(Dog, "type");    // false — not copied onto Dog
```

## `instanceof`

`instanceof` tests whether a constructor's `prototype` occurs in an object's prototype chain.

```javascript
class Animal {
}

class Dog extends Animal {
}

const dog = new Dog();
dog instanceof Dog;    // true
dog instanceof Animal; // true
dog instanceof Object; // true
```

Inheritance means an object can be an instance of multiple constructors in its prototype chain. `instanceof` is not a
general-purpose structural type check, and can be customized through `Symbol.hasInstance`.

## `this` in Class Methods

The value of `this` in an ordinary class method is determined by how the method is called, not where it's defined.

```javascript
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return this.name;
    }
}

const user = new User("Ada");
user.greet(); // "Ada" — called as user.greet()

const greet = user.greet;
greet(); // `this` is lost — the method doesn't retain its original instance
```

If a method must retain its instance context when passed as a callback, it can be explicitly bound, or defined as an
arrow-function instance field:

```javascript
class User {
    constructor(name) {
        this.name = name;
        this.greet = this.greet.bind(this);
    }

    greet() {
        return this.name;
    }
}
```

```javascript
class User {
    name = "Ada";
    greet = () => this.name; // arrow field — lexically bound `this`
}
```

Arrow-function fields create a separate function for every instance and should not be treated as equivalent to prototype
methods from a memory and identity perspective.

## Classes and Prototypes

Classes remain part of JavaScript's prototype-based object model — this relationship is fundamental to understanding how
classes actually work underneath the syntax.

```javascript
class User {
    greet() {
        return "Hello";
    }
}

User.prototype.greet; // the method lives here

const user = new User();
Object.getPrototypeOf(user) === User.prototype; // true
```

Classes provide class-oriented syntax while retaining JavaScript's prototype-based inheritance model.

## Class Properties and Ownership

The location of a member can be determined using property ownership checks — "class member" does not mean every member
is physically stored on the class constructor.

```javascript
class Example {
    field = 1;

    method() {
    }

    static staticField = 2;

    static staticMethod() {
    }
}

const instance = new Example();
Object.hasOwn(instance, "field");                 // true
Object.hasOwn(instance, "method");                // false
Object.hasOwn(Example.prototype, "method");       // true
Object.hasOwn(Example, "staticField");            // true
Object.hasOwn(Example, "staticMethod");           // true
```

## Computed Class Elements

Class element names — methods, fields, static members — can be computed using expressions in brackets.

```javascript
const methodName = "greet";

class User {
    [methodName]() {
        return "Hello";
    }
}

new User().greet(); // "Hello"

const fieldName = "name";

class User2 {
    [fieldName] = "Ada";
}
```

## Class Expressions as Values

Classes are runtime values and can be passed around like other values — useful for factories, dynamic implementations,
and APIs that accept constructors.

```javascript
function createClass() {
    return class {
        greet() {
            return "Hello";
        }
    };
}

const User = createClass();
new User().greet();
```

## Constructor Return Values

Constructors normally produce the constructed instance. A base-class constructor can explicitly return an object, which
replaces the constructed instance:

```javascript
class Example {
    constructor() {
        return {value: 42};
    }
}

const example = new Example();
console.log(example.value); // 42
```

Returning a primitive value does not replace the constructed object — it's silently ignored:

```javascript
class Example {
    constructor() {
        return 42;
    }
}

const example = new Example();
example instanceof Example; // true — the primitive return had no effect
```

Derived constructors have additional return restrictions, since initialization of `this` depends on superclass
construction.

## Class Declarations vs. Object Literals

```javascript
// Object literal — a single object, created directly
const user = {
    name: "Ada",
    greet() {
        return `Hello, ${this.name}`;
    },
};

// Class — a reusable constructor for many instances
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
```

Use an object literal when a single object is sufficient. Use a class when repeated construction, instance state,
prototype behavior, or class-level behavior is appropriate.

## Classes vs. Constructor Functions

JavaScript historically used constructor functions with prototypes to implement similar patterns:

```javascript
function User(name) {
    this.name = name;
}

User.prototype.greet = function () {
    return `Hello, ${this.name}`;
};
```

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

Classes and constructor functions should not be considered completely equivalent:

| Feature                | Class     | Constructor Function          |
|:-----------------------|:----------|:------------------------------|
| Requires `new`         | Yes       | Not necessarily               |
| Class body strict mode | Yes       | No automatic equivalent       |
| Private `#` elements   | Supported | Not through class syntax      |
| Class fields           | Supported | Not through function syntax   |
| `extends` syntax       | Supported | Manual prototype manipulation |
| `super`                | Supported | Not equivalent                |
| Prototype methods      | Supported | Supported                     |

## Public vs. Private Members

| Member Type           | Syntax                 | Accessible Externally | Typical Location / Semantics |
|:----------------------|:-----------------------|:----------------------|:-----------------------------|
| Public Field          | `name = value`         | Yes                   | Instance                     |
| Public Method         | `name() {}`            | Yes                   | Prototype                    |
| Public Static Field   | `static name = value`  | Yes                   | Class constructor            |
| Public Static Method  | `static name() {}`     | Yes                   | Class constructor            |
| Private Field         | `#name = value`        | No                    | Instance private state       |
| Private Method        | `#name() {}`           | No                    | Instance private state       |
| Private Static Field  | `static #name = value` | No                    | Class private state          |
| Private Static Method | `static #name() {}`    | No                    | Class private state          |

## Common Class Mistakes

* **Calling a class without `new`:** Class constructors cannot be invoked as ordinary functions.
* **Expecting instance methods to be own properties:** Normal instance methods are defined on the prototype.
* **Expecting static members on instances:** Static members belong to the class constructor.
* **Accessing `this` before `super()` in a derived constructor:** A derived constructor must initialize `this` through
  `super()` before accessing it.
* **Assuming `_property` is private:** An underscore is only a naming convention; use `#property` for language-level
  private elements.
* **Assuming class fields are stored on the prototype:** Public instance fields are own properties of each instance.
* **Assuming methods retain their original `this`:** Extracting a method changes how its `this` value is determined.
* **Assuming inherited static properties are copied:** Static inheritance occurs through the constructor inheritance
  relationship rather than by copying properties.
* **Assuming classes are unrelated to prototypes:** Class instances still use the prototype chain.
* **Assuming all class elements have identical initialization timing:** Constructors, instance fields, static fields,
  and static blocks have defined and different evaluation/initialization semantics.

## Best Practices

* **Use classes when instance state and behavior form a coherent abstraction:** Do not introduce a class when a simple
  object, function, or module is sufficient.
* **Keep constructors focused on establishing valid initial state:** Avoid unrelated work during construction.
* **Use instance fields for declared instance state:** Keep straightforward defaults close to the class definition.
* **Use prototype methods for shared behavior:** Prefer ordinary methods when per-instance function identity is not
  required.
* **Use static members for class-level behavior:** Factory methods and class-wide state are common examples.
* **Use private elements when encapsulation is part of the API design:** Prefer `#private` over underscore naming when
  external access must be prevented.
* **Prefer composition when inheritance does not represent a genuine subtype relationship:** Inheritance creates
  coupling between the base class and derived classes.
* **Avoid unnecessary inheritance hierarchies:** Keep prototype chains shallow and behavior focused.
* **Avoid arrow-function fields unless lexical `this` is specifically required:** They create a separate function for
  every instance.
* **Keep field initialization order explicit:** Do not make a field depend on a later field declaration.
* **Keep constructors synchronous and lightweight:** Use factories or explicit initialization workflows when object
  creation requires asynchronous operations.
* **Validate constructor inputs when invalid state must be prevented:** Establish the object's invariants during
  construction.
* **Use getters and setters when property access requires controlled behavior:** Do not use accessors merely to imitate
  ordinary fields.
* **Do not manipulate prototypes unnecessarily:** Prefer standard class syntax unless direct prototype manipulation is
  required for a specific low-level use case.
* **Treat public class members as API surface:** Changing fields, methods, accessors, or static members can affect
  consumers of the class.
* **Use private state for implementation details:** Avoid exposing internal state merely because it is convenient.
* **Prefer explicit class responsibilities:** Split classes that accumulate unrelated state and behavior.
* **Use static factory methods when construction requires semantic naming or preprocessing:** Keep construction logic
  understandable without overloading the constructor.
* **Do not assume classes provide nominal type safety:** Runtime JavaScript remains dynamically typed; `instanceof` is
  only one form of runtime relationship checking.
* **Understand prototype ownership before optimizing:** Instance fields, prototype methods, and static members have
  different ownership and memory characteristics.
* **Use the ECMAScript specification for semantic questions:** MDN provides practical explanations, while ECMA-262 is
  the normative definition of JavaScript language behavior.

## Fundamental Class Relationships

```text
Class Definition
       │
       ▼
Class Constructor ────────────────► Static Members
       │
       │ [[Prototype]]
       ▼
Class.prototype
       │
       │ [[Prototype]]
       ▼
Object.prototype

       ▲
       │ [[Prototype]]
       │
Instance
       │
       ├── Own Instance Fields
       └── Access to Prototype Methods
```

```text
Derived Instance
       │
       ▼
Derived.prototype
       │
       ▼
Base.prototype
       │
       ▼
Object.prototype
       │
       ▼
null
```

The key distinction:

* **Instance fields** belong to individual objects.
* **Instance methods** are normally shared through the prototype.
* **Static members** belong to the class constructor.
* **Private elements** provide language-enforced encapsulation.
* **Inheritance** connects prototype chains and class constructors.
* **Classes** provide syntax and semantics built on JavaScript's existing prototype-based object model.
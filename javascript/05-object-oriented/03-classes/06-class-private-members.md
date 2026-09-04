# Private Members

Private members are class members accessible only from within the class that declares them, providing **encapsulation**
by preventing external code and subclasses from directly touching implementation details. JavaScript provides true,
language-level privacy through the `#` prefix — not a naming convention.

```javascript
class BankAccount {
    #balance = 0;

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // 100
console.log(account.#balance);     // SyntaxError
```

The `#` is part of the member's name — `#name` and `name` are unrelated identifiers, unlike a convention such as
`_name`:

```javascript
class User {
    _password = "secret"; // public — accessible as user._password
    #password = "secret"; // private — language-enforced
}
```

| Syntax  | Privacy                                    |
|:--------|:-------------------------------------------|
| `name`  | Public                                     |
| `_name` | Public, conventionally treated as internal |
| `#name` | Truly private — enforced by the engine     |

Private members come in four forms, and each can also be `static`:

| Member         | Syntax                 |
|:---------------|:-----------------------|
| Private field  | `#field`               |
| Private method | `#method()`            |
| Private getter | `get #property()`      |
| Private setter | `set #property(value)` |

**The important conceptual split: *private* describes accessibility, *static* describes whether the member belongs to
the class or an instance, and field/method/getter/setter describe the member kind — these are three independent axes,
not one.**

## Private Fields

```javascript
class Counter {
    #count = 0;

    increment() {
        this.#count++;
    }

    get value() {
        return this.#count;
    }
}

const counter = new Counter();
counter.increment();
console.log(counter.value);  // 1
counter.#count = 100;        // SyntaxError — no external access
```

Each instance holds its own independent private field — `new Counter()` twice produces two separate `#count` values,
just like public fields.

## Private Methods

```javascript
class Order {
    #calculateSubtotal(items) {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    calculateTotal(items) {
        return this.#calculateSubtotal(items); // internal call — allowed
    }
}
```

`calculateTotal()` is the public interface; `#calculateSubtotal()` is an implementation detail the class is free to
change without breaking any external caller.

## Private Getters and Setters

```javascript
class Temperature {
    #celsius = 0;

    get #fahrenheit() {
        return this.#celsius * 9 / 5 + 32;
    }

    set #fahrenheit(value) {
        this.#celsius = (value - 32) * 5 / 9;
    }

    getFahrenheit() {
        return this.#fahrenheit;
    } // internal read
}
```

Private accessors follow identical privacy rules to private fields and methods — accessed like a normal property
internally, invisible externally.

## Private Static Members

A private static member belongs to the **class itself**, not to individual instances:

```javascript
class User {
    static #count = 0;

    constructor() {
        User.#count++;
    }

    static getCount() {
        return User.#count;
    }
}

new User();
new User();
console.log(User.getCount()); // 2

const u = new User();
u.#count;      // SyntaxError — not available on an instance
User.#count;   // SyntaxError outside the class body
```

## Private Members Are Not Ordinary Properties

Private fields don't create a normal named property, and aren't accessible via bracket notation or any string key:

```javascript
class User {
    #name = "Goran";
    role = "admin";
}

const user = new User();
console.log(Object.keys(user));                 // ["role"] — #name is absent
console.log(Object.getOwnPropertyNames(user));  // ["role"]
user["#name"];                                   // undefined
```

Private elements are also invisible to `Object.entries()`, `Object.values()`, and every standard reflection API — this
is intentional; they are language-level private elements, not properties with an obscured name.

## Private Members and Inheritance

Private members are **not inherited as accessible members**, and `super` cannot reach them either:

```javascript
class Parent {
    #value = 10;

    getValue() {
        return this.#value;
    }
}

class Child extends Parent {
    getParentValue() {
        return this.#value;
    }        // SyntaxError — Parent's #value, not Child's
    getViaSuper() {
        return super.#value;
    }        // SyntaxError — super can't access private members
    getViaMethod() {
        return this.getValue();
    }      // OK — goes through the parent's public method
}
```

A subclass declaring `#value` of its own does not share or override the parent's — they are **entirely independent
private names**, even with identical spelling:

```javascript
class A {
    #value = 1;

    getValue() {
        return this.#value;
    }
}

class B {
    #value = 2;

    getValue() {
        return this.#value;
    }
}

const b = new B();
A.prototype.getValue.call(b); // TypeError — b has no #value brand for class A
```

## Private Fields vs Closures

Private state predates the `#` syntax via closures:

```javascript
function createCounter() {
    let count = 0;
    return {
        increment() {
            count++;
        },
        get value() {
            return count;
        },
    };
}
```

Both approaches genuinely hide state — the difference is model fit, not privacy strength.

## Use Cases

* **Guarding invariants inside stateful classes:** Use `#` fields for internal state (a balance, a cache, a counter)
  whenever external code should only ever change that state through validated methods — a `BankAccount`'s `#balance`
  should never be settable except via `deposit()`/`withdraw()`, which can enforce non-negative constraints.
* **Hiding helper methods that aren't part of the contract:** Use `#method()` for internal computation steps
  (`#calculateSubtotal`, `#validateAmount`) that support a public method but would clutter or destabilize the public API
  if exposed — callers should only see `calculateTotal()`, not its internal steps, so the class is free to refactor
  those steps later without a breaking change.
* **Exposing a computed value without exposing its formula or backing state:** Use a private getter
  (`get #fahrenheit()`) when a derived value should only be reachable through a specific public method
  (`getFahrenheit()`), rather than letting consumers read the raw private field directly or bypass validation on write.
* **Class-level counters or singleton-style shared state:** Use `static #field` when state belongs to the class as a
  whole rather than any instance — an instance counter, a cached configuration, or a shared registry that every instance
  contributes to but none should individually own or expose.
* **Choose private fields (not closures) when the abstraction is naturally a class with multiple instances and methods
  that share behavior on the prototype.** Class privates get you real encapsulation *and* shared methods (defined once
  on the prototype) *and* familiar `class`/`new`/`extends` ergonomics.
* **Choose closures (not private fields) for one-off stateful objects, functional-style modules, or when no class
  hierarchy is needed at all.** A `createCounter()` factory returning a plain object with closed-over state is often
  simpler than a class when there's no inheritance, no shared prototype methods, and just a single object needed.

## Best Practices

* **Always use `#` for state that must never be mutated except through validated methods — never rely on `_` naming as
  if it were enforcement.** The `_` convention documents intent to future readers but provides zero runtime protection;
  if the actual requirement is "external code cannot touch this," only `#` delivers that guarantee.
* **Expose a minimal public API and keep everything else private by default — decide per-member whether outside code
  truly needs it, rather than defaulting to public.** Every public field or method is a commitment other code may come
  to depend on; a private one can be freely refactored, renamed, or removed since nothing outside the class can
  reference it.
* **When a subclass needs access to a parent's internal state, expose it through a protected-by-convention or public
  method on the parent — never try to work around the restriction.** `super.#value` and `this.#value` for a parent's
  private field are both hard `SyntaxError`s by design; if a subclass genuinely needs the value, the parent should
  provide a `getValue()` (or similarly named) accessor method instead of the field pretending to be inheritable.
* **Don't assume giving a private field the same name (`#value`) in a parent and child class creates any relationship
  between them — they are unconditionally separate private names.** This differs from public property overriding, where
  a subclass field or method genuinely shadows the parent's; treating same-named privates as if one "overrides" the
  other is a design mistake that produces confusing bugs when the two are actually tracked independently.
* **Don't use private class fields as a substitute for real access control across trust boundaries (e.g.,
  security-sensitive isolation between separately-loaded code).** `#` privacy is a language feature enforced by the
  engine within normal JS execution, not a security sandboxing mechanism — it protects against accidental misuse from
  other developers on the same codebase, not against a determined adversary with code-execution access in the same
  realm.
* **Prefer private instance fields with constructor initialization over assigning private state ad hoc in later
  methods.** Declaring `#count = 0;` at the class body level (rather than only inside the constructor) documents the
  field's existence and default value in one visible place, and works consistently even when a class has multiple
  constructors-via-overloading patterns or complex initialization logic.
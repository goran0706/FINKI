# Liskov Substitution Principle (LSP)

The **Liskov Substitution Principle (LSP)** states that objects of a subtype should be usable wherever objects of the
base type are expected without breaking the correctness of the program.

LSP is fundamentally about **behavioral substitutability**. It is not simply a rule about inheritance syntax. A subtype
may satisfy the structural shape of a base type while still violating the behavioral expectations established by that
type.

The central question is whether a subtype can be substituted for the abstraction it claims to implement without
requiring the client to know that a different subtype was supplied. If clients must add special cases, weaken
assumptions, catch unexpected exceptions, or otherwise change their behavior depending on the concrete subtype, the
abstraction may not represent a valid substitutable relationship.

## Subtyping

A subtype is a more specific type that can be used in place of a more general type. For example:

```js
class Animal {
    eat() {
        // ...
    }
}

class Dog extends Animal {
    bark() {
        // ...
    }
}
```

Code expecting an `Animal` should be able to work with a `Dog`:

```js
function feed(animal) {
    animal.eat();
}

feed(new Dog());
```

The subtype adds behavior without violating the behavior expected by the base abstraction. The important property is
therefore not that `Dog` inherits from `Animal`, but that `Dog` preserves the contract expected by consumers of
`Animal`.

Inheritance can establish a subtype relationship, but inheritance alone does not make that relationship valid.

## Behavioral Substitutability

LSP is concerned with behavior, not merely structure. Consider an abstraction such as:

```js
class FileStorage {
    save(file) {
        // ...
    }

    delete(file) {
        // ...
    }
}
```

A subtype may provide exactly the same methods:

```js
class ReadOnlyStorage extends FileStorage {
    save(file) {
        throw new Error("Read-only");
    }

    delete(file) {
        throw new Error("Read-only");
    }
}
```

Structurally, `ReadOnlyStorage` appears compatible with `FileStorage`. Behaviorally, it is not. A client expecting
storage that supports `save()` cannot safely substitute `ReadOnlyStorage`.

The problem is therefore not missing methods. The problem is that the subtype violates behavioral expectations
established by the abstraction.

## Contracts

LSP can be understood in terms of contracts. A type establishes expectations about valid inputs, valid outputs, state
transitions, exceptions, side effects, invariants, timing, lifecycle, and other observable properties of its operations.

A subtype must preserve those expectations sufficiently for existing clients to continue operating correctly.

For example:

```js
class PaymentGateway {
    charge(amount) {
        // Contract:
        // - amount must be positive
        // - successful charge completes payment
        // - failure is reported through the expected mechanism
    }
}
```

A subtype that silently changes these assumptions may violate substitutability even if its method signature remains
identical.

The contract is therefore broader than the method declaration. A method such as `charge(amount)` does not fully describe
what `charge()` means. The meaning includes what inputs are accepted, what successful execution guarantees, what
failures mean, and what observable effects occur.

## Preconditions

A **precondition** describes what must be true before an operation can be executed. A subtype should not require
stronger preconditions than its base type.

Suppose the base abstraction accepts any positive amount:

```js
class PaymentGateway {
    charge(amount) {
        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }

        // ...
    }
}
```

A subtype that additionally requires the amount to exceed 100 changes the contract:

```js
class RestrictedPaymentGateway extends PaymentGateway {
    charge(amount) {
        if (amount < 100) {
            throw new Error("Minimum amount is 100");
        }

        // ...
    }
}
```

A client that was validly using the base type can now fail when given the subtype. The subtype has **strengthened the
precondition** by accepting a smaller set of inputs than the base abstraction permits.

This is one of the clearest forms of LSP violation because substitution causes previously valid client behavior to
become invalid.

## Postconditions

A **postcondition** describes what must be true after an operation successfully completes. A subtype should preserve the
guarantees established by the base abstraction.

Suppose:

```js
class Repository {
    save(entity) {
        // Contract:
        // after successful return, entity is persisted
    }
}
```

A subtype that returns successfully without actually persisting the entity violates the expected postcondition:

```js
class FakeRepository extends Repository {
    save(entity) {
        // Does nothing
    }
}
```

The method signature is compatible, but the behavior is not. If the client is entitled to assume that successful
completion means the entity has been persisted, an implementation that merely discards the entity cannot be substituted
safely.

## Invariants

An **invariant** is a condition that must remain true throughout the valid lifetime of an object or abstraction.
Relevant invariants established by a base abstraction must be preserved by its subtypes.

For example:

```js
class BankAccount {
    constructor(balance) {
        if (balance < 0) {
            throw new Error("Invalid balance");
        }

        this.balance = balance;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }

        this.balance -= amount;
    }
}
```

A subtype that permits an invalid negative balance can violate the base abstraction's invariant:

```js
class SpecialAccount extends BankAccount {
    withdraw(amount) {
        this.balance -= amount;
    }
}
```

If clients rely on the invariant that `balance >= 0`, substituting `SpecialAccount` can break program correctness.

Invariants are particularly important because they may not be represented directly in a method signature. A type can
therefore appear completely compatible while allowing states that the original abstraction explicitly ruled out.

## The Contract of the Base Type

LSP depends on what the base type actually promises. Consider:

```js
class Collection {
    add(item) {
        // ...
    }

    remove(item) {
        // ...
    }

    contains(item) {
        // ...
    }
}
```

If the contract says that every collection supports mutation, then a read-only implementation is not substitutable.
However, if the abstraction were instead:

```js
class ReadOnlyCollection {
    contains(item) {
        // ...
    }
}
```

then a read-only implementation could satisfy that narrower contract.

This illustrates an important design principle: when a subtype cannot satisfy an abstraction's contract, the abstraction
may be too broad. The solution is often to redesign the abstraction rather than forcing the subtype to implement
behavior it cannot support.

## The Rectangle and Square Example

The classic LSP example involves rectangles and squares. Mathematically, a square is a special case of a rectangle. That
mathematical relationship does not automatically mean that a mutable software `Rectangle` abstraction can safely have
`Square` as a subtype.

Consider:

```js
class Rectangle {
    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}
```

A client may reasonably expect:

```js
function resize(rectangle) {
    rectangle.setWidth(10);
    rectangle.setHeight(5);

    return rectangle.getArea();
}
```

The expected result is `50`.

A square must preserve equal sides:

```js
class Square extends Rectangle {
    setWidth(width) {
        this.width = width;
        this.height = width;
    }

    setHeight(height) {
        this.width = height;
        this.height = height;
    }
}
```

Now:

```js
resize(new Square());
```

produces `25` rather than `50`.

The square is mathematically a rectangle, but it is not behaviorally substitutable for this mutable `Rectangle`
abstraction. The problem is the abstraction's contract, not mathematics.

## Why the Rectangle Example Matters

The rectangle and square example demonstrates a broader principle: an **is-a relationship in the real world does not
automatically imply a valid subtype relationship in software**.

Inheritance should represent a valid behavioral substitution relationship, not merely a taxonomic relationship.
`Dog is an Animal` may be a valid subtype relationship if the `Animal` contract is appropriately defined. Likewise,
`Square is a Rectangle` may be valid under one software abstraction and invalid under another.

The software contract determines substitutability.

## LSP and Inheritance

Inheritance is one mechanism through which LSP can be violated. Consider:

```js
class Bird {
    fly() {
        // ...
    }
}

class Penguin extends Bird {
    fly() {
        throw new Error("Penguins cannot fly");
    }
}
```

The inheritance hierarchy says that `Penguin` is a `Bird`, but the base contract says that a bird can fly. A penguin
cannot satisfy that contract.

The abstraction should instead reflect the actual behavioral capabilities:

```js
class Bird {
    eat() {
        // ...
    }
}

class FlyingBird extends Bird {
    fly() {
        // ...
    }
}

class Penguin extends Bird {
    swim() {
        // ...
    }
}

class Eagle extends FlyingBird {
    fly() {
        // ...
    }
}
```

Now the subtype hierarchy does not require a non-flying bird to satisfy a flying contract.

## LSP and Capability-Based Abstractions

A strong way to avoid LSP violations is to model abstractions around capabilities rather than broad categories that
contain incompatible behavior.

Instead of:

```js
class Bird {
    fly() {
    }

    swim() {
    }

    walk() {
    }
}
```

a design can separate capabilities:

```js
class FlyingAnimal {
    fly() {
    }
}

class SwimmingAnimal {
    swim() {
    }
}

class WalkingAnimal {
    walk() {
    }
}
```

In JavaScript, these capabilities can be expressed through interfaces in TypeScript, composition, object shapes,
dependency contracts, or other structural abstractions. The important property is that an implementation is required to
satisfy only behavior that actually belongs to its contract.

## LSP and Interface Design

LSP applies to interfaces just as it applies to classes. Consider:

```js
class DocumentStore {
    read(id) {
    }

    write(id, document) {
    }

    delete(id) {
    }
}
```

A read-only store may not be a valid implementation:

```js
class ReadOnlyDocumentStore extends DocumentStore {
    read(id) {
        // ...
    }

    write(id, document) {
        throw new Error("Not supported");
    }

    delete(id) {
        throw new Error("Not supported");
    }
}
```

A better design may separate the capabilities:

```js
class DocumentReader {
    read(id) {
        // ...
    }
}

class DocumentWriter {
    write(id, document) {
        // ...
    }
}

class DocumentDeleter {
    delete(id) {
        // ...
    }
}
```

Each abstraction now defines a narrower contract that its implementations can actually satisfy.

## LSP and Interface Segregation

LSP and the **Interface Segregation Principle (ISP)** frequently reinforce one another. A large interface increases the
likelihood that some implementation will be unable to honor its complete contract.

For example:

```js
class Worker {
    work() {
    }

    eat() {
    }
}
```

A machine might implement `work()` but not `eat()`. Creating an artificial implementation such as:

```js
class Robot extends Worker {
    work() {
    }

    eat() {
        throw new Error("Robots do not eat");
    }
}
```

does not solve the underlying design problem. A better abstraction separates the capabilities:

```js
class Workable {
    work() {
    }
}

class Eatable {
    eat() {
    }
}
```

Implementations can then satisfy the contracts they actually support. ISP therefore reduces opportunities for LSP
violations by preventing abstractions from accumulating unrelated obligations.

## LSP and the Open-Closed Principle

LSP and the **Open-Closed Principle (OCP)** are strongly connected. OCP encourages introducing abstractions that allow
new implementations to be added without modifying existing client logic. LSP establishes the requirement that those
implementations must actually satisfy the abstraction's behavioral contract.

An abstraction that accepts an implementation merely because it exposes the expected methods is not necessarily safely
extensible. A new implementation must preserve the assumptions made by existing clients.

OCP without LSP can therefore produce an extensible system that is structurally open but behaviorally unsafe. The new
implementation must not merely fit the interface; it must behave correctly when substituted.

## LSP and Dependency Inversion

The **Dependency Inversion Principle (DIP)** often causes high-level code to depend on abstractions. LSP determines
whether the concrete implementations behind those abstractions are actually interchangeable.

For example:

```js
class OrderService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    pay(order) {
        return this.paymentGateway.charge(order.total);
    }
}
```

If `PaymentGateway` represents a valid abstraction, every implementation supplied to `OrderService` must honor the
expected contract. An implementation that silently changes the meaning of `charge()` is not substitutable even if it
exposes the correct method.

DIP answers the question of what the high-level module should depend on. LSP answers whether implementations of that
dependency can actually be used interchangeably.

## LSP and Polymorphism

Polymorphism works correctly only when implementations preserve the contract.

Consider:

```js
function calculateTotal(pricingStrategy, cart) {
    return pricingStrategy.calculate(cart);
}
```

The caller does not know which strategy is being used. That is the purpose of polymorphism.

If one implementation behaves differently in a way that violates the abstraction:

```js
class FreePricing {
    calculate(cart) {
        return undefined;
    }
}
```

then the abstraction is unreliable. The caller should not need to add subtype-specific handling:

```js
if (pricingStrategy instanceof FreePricing) {
    // special handling
}
```

If special handling is necessary for normal operation because one implementation does not satisfy the common contract,
substitutability is questionable.

## Client Knowledge as a Warning Sign

A strong practical indicator of an LSP violation is when clients need to know the concrete subtype.

For example:

```js
function process(storage) {
    if (storage instanceof ReadOnlyStorage) {
        // do something different
    } else {
        storage.save(data);
    }
}
```

The client now knows that one subtype cannot satisfy the abstraction. The abstraction is leaking implementation-specific
behavior into its consumers.

A better design is often to expose a contract that accurately represents what all implementations can do. If some
clients need mutation and others only need reading, those clients should depend on abstractions corresponding to those
different capabilities.

## Unsupported Operations

Throwing an exception such as:

```js
throw new Error("Not supported");
```

is not automatically an LSP violation. The question is whether the operation is part of the contract that the client is
entitled to rely upon.

For example, an operation may explicitly allow failure:

```js
class Cache {
    get(key) {
        // May return null when key is absent.
    }
}
```

If the contract defines absence as a valid result, returning `null` is compatible behavior.

However, if an abstraction promises that every implementation supports an operation, an implementation that always
throws `"Not supported"` is not substitutable. The problem is not the existence of exceptions; the problem is that the
implementation violates an expectation established by the abstraction.

## Exceptions and LSP

Subtypes should not unexpectedly alter failure semantics. Suppose:

```js
class Parser {
    parse(input) {
        // throws ParseError for invalid syntax
    }
}
```

A subtype that instead returns invalid data, throws an unrelated exception, or silently ignores malformed input may
violate client expectations.

For example:

```js
class LenientParser extends Parser {
    parse(input) {
        return {};
    }
}
```

If callers rely on invalid input producing a parse failure, this implementation is not behaviorally equivalent.

Exception compatibility does not necessarily mean that every implementation must throw the exact same exception object.
It means that the implementation must preserve the failure semantics on which clients are entitled to rely.

## Error Semantics as Part of the Contract

A contract includes more than successful return values. It can also define which failures are possible, when they occur,
whether operations are atomic, whether state is changed before failure, and whether errors are recoverable.

For example:

```js
class Account {
    withdraw(amount) {
        if (amount > this.balance) {
            throw new InsufficientFundsError();
        }
    }
}
```

A subtype that deducts the money and then throws could violate the transaction semantics expected by clients. The client
may reasonably assume that a failed withdrawal does not alter the account balance.

Behavioral compatibility therefore includes failure behavior, not just successful results.

## LSP and Side Effects

Side effects are part of observable behavior.

Suppose an abstraction represents a read operation:

```js
class Repository {
    findById(id) {
        // returns entity without modifying repository state
    }
}
```

A subtype that deletes or modifies data during `findById()` is not behaviorally compatible.

Similarly, if a base abstraction guarantees idempotency, a subtype should preserve that property. If the abstraction
guarantees that an operation does not mutate its input, a subtype should not unexpectedly introduce such mutation.

The relevant question is what clients can observe and what the contract permits them to assume.

## LSP and Idempotency

Consider:

```js
class ResourceManager {
    enable(resource) {
        // Calling multiple times has the same final state.
    }
}
```

If a subtype increments a counter every time `enable()` is called:

```js
class SpecialResourceManager extends ResourceManager {
    enable(resource) {
        resource.counter++;
    }
}
```

it may violate the expected semantics. Calling the operation twice now produces a different observable result from
calling it once.

LSP therefore applies to semantic properties such as idempotency, atomicity, state transitions, and other guarantees
that may not appear in a method signature.

## LSP and Mutability

Mutability frequently creates LSP problems. An abstraction may expose operations that assume state can be changed:

```js
class Collection {
    add(item) {
    }

    remove(item) {
    }
}
```

A subtype representing an immutable collection cannot satisfy this contract simply by throwing exceptions. If clients
depend on `add()` and `remove()` as successful mutation operations, the immutable implementation is not substitutable.

A better design may separate mutable and immutable abstractions:

```js
class ReadOnlyCollection {
    contains(item) {
    }
}

class MutableCollection extends ReadOnlyCollection {
    add(item) {
    }

    remove(item) {
    }
}
```

The abstraction now reflects the capability that clients actually depend on.

## LSP and Return Types

A subtype should preserve the semantic expectations of returned values.

For example:

```js
class UserRepository {
    findById(id) {
        // returns User or null
    }
}
```

A subtype that returns an unrelated object with incompatible semantics is not substitutable merely because JavaScript
permits it.

The returned value must satisfy the expectations established by the abstraction. A subtype may return a more specific
value when that value remains valid wherever the base return value is expected, but it cannot change the meaning of the
result.

## LSP and Covariance

In languages with static type systems, return-type variance can formalize some aspects of substitutability.

Conceptually, a subtype may return a more specific result when that result remains valid wherever the base result is
expected:

```text
Base:
getUser() → User

Subtype:
getUser() → AdminUser
```

If `AdminUser` is itself a valid `User`, the narrower return type can preserve substitutability.

The important condition is behavioral compatibility, not simply syntactic compatibility. A more specific return type is
useful only when the returned object still satisfies the semantic contract of the base type.

## LSP and Contravariance

Parameter types are more subtle. A subtype should not require inputs that are more specific than the base contract
permits.

If the base abstraction accepts:

```text
Animal
```

a subtype should not require:

```text
Dog
```

when clients are allowed to provide any `Animal`.

Conceptually:

```text
Base:
process(Animal)

Subtype:
process(Dog)
```

The subtype has strengthened the input requirement. This is another expression of the precondition rule.

In statically typed languages, this is commonly discussed in terms of contravariance. In JavaScript, the same issue
exists semantically even when the language does not enforce the type relationship at runtime.

## Preconditions, Postconditions, and Invariants

The core contract rules can be summarized as follows:

| Contract element    | Subtype should              |
|:--------------------|:----------------------------|
| Preconditions       | Not strengthen them         |
| Postconditions      | Not weaken them             |
| Invariants          | Preserve them               |
| Observable behavior | Preserve required semantics |
| Failure behavior    | Remain compatible           |
| Side effects        | Respect expected guarantees |

These rules provide a useful formal mental model for evaluating substitutability.

## LSP and Design by Contract

LSP is closely related to **Design by Contract**. A contract can be understood as defining what must be true before an
operation, what the operation guarantees afterward, and what conditions remain invariant throughout the object's valid
lifetime.

For a valid subtype, preconditions should not become stronger, postconditions should not become weaker, and relevant
invariants should remain preserved.

This provides a rigorous explanation for why some apparently reasonable inheritance relationships fail. The subtype is
not necessarily wrong because it behaves differently; it is wrong when the difference invalidates behavior that clients
are entitled to expect from the base abstraction.

## LSP and Duck Typing

JavaScript commonly uses duck typing: if an object provides the expected behavior, it can be used.

For example:

```js
function printDocument(printer) {
    printer.print();
}
```

Any object with a compatible `print()` operation can be supplied. However, duck typing does not eliminate LSP. The
object must still satisfy the behavioral expectations associated with `print()`.

This object:

```js
const brokenPrinter = {
    print() {
        throw new Error("Printing disabled");
    }
};
```

may satisfy the structural expectation while violating the behavioral one.

Duck typing therefore makes LSP especially important in JavaScript. The absence of an explicit interface does not mean
the absence of a contract.

## LSP in JavaScript

JavaScript does not require objects to explicitly declare an inheritance relationship. Substitutability can therefore be
achieved through classes, prototypes, object literals, functions, modules, dependency injection, composition, or other
forms of structural abstraction.

For example:

```js
function render(renderer, document) {
    return renderer.render(document);
}
```

Implementations can be ordinary objects:

```js
const htmlRenderer = {
    render(document) {
        return "<html>...</html>";
    }
};

const markdownRenderer = {
    render(document) {
        return "# Document";
    }
};
```

Both can be substituted if they satisfy the expected `render()` contract. The contract exists even though neither object
explicitly declares that it implements an interface.

## LSP Without Inheritance

LSP does not require inheritance.

Consider:

```js
function sendNotification(sender, message) {
    return sender.send(message);
}
```

Different objects can satisfy the contract:

```js
const emailSender = {
    send(message) {
        // ...
    }
};

const smsSender = {
    send(message) {
        // ...
    }
};
```

The relationship is structural rather than nominal, but the same behavioral substitutability requirement applies. If
`smsSender.send()` violates assumptions made by callers about `send()`, it is not substitutable even though its object
shape is correct.

## LSP and Composition

Composition often makes LSP easier to maintain because components can be composed according to capabilities rather than
forced into questionable inheritance relationships.

For example:

```js
class OrderService {
    constructor(payment, notification) {
        this.payment = payment;
        this.notification = notification;
    }
}
```

The `payment` dependency must satisfy the payment contract, while the `notification` dependency must satisfy the
notification contract. There is no requirement that they belong to a common inheritance hierarchy.

Composition therefore avoids many problems caused by trying to encode domain variation as inheritance. It does not
eliminate the need for contracts, however. Every substituted dependency still has to honor the expectations of its
consumer.

## LSP and State Machines

LSP can also apply to state transitions.

Suppose:

```js
class Order {
    cancel() {
        if (this.status !== "pending") {
            throw new Error("Cannot cancel");
        }

        this.status = "cancelled";
    }
}
```

A subtype that allows cancellation from states where the base object would reject it may change the behavioral contract.
Likewise, a subtype that rejects a transition that clients reasonably expect to succeed can violate substitutability.

State-machine semantics are therefore part of the contract. Valid states, valid transitions, rejected transitions, and
the resulting state all contribute to observable behavior.

## LSP and Collections

Collections provide another common source of LSP problems.

Suppose:

```js
function addDefaults(collection) {
    collection.add("A");
    collection.add("B");
}
```

If the abstraction promises a mutable collection, passing an immutable implementation is invalid. The client is
explicitly depending on the mutation capability.

The broader lesson is that clients should depend on abstractions that express the behavior they actually require. A
function that mutates a collection should depend on a contract that includes mutation rather than a broader abstraction
that happens to contain both mutable and immutable implementations.

## LSP and Domain Modeling

Domain modeling often creates tempting inheritance hierarchies:

```text
Payment
├── CreditCardPayment
├── CashPayment
├── CryptoPayment
└── FreePayment
```

Whether these are valid subtypes depends on their contracts.

If every `Payment` must charge money, return a transaction ID, and support refunds, then `FreePayment` may not satisfy
the abstraction. The domain model may instead require several independent capabilities, such as charging, refunding, and
transaction tracking.

The important distinction is between a domain category and a software contract. A business concept may group several
variants together while those variants still do not share all of the behaviors required by a single software
abstraction.

## LSP and Domain Exceptions

Domain exceptions can also reveal invalid abstraction boundaries.

Suppose:

```js
class Payment {
    refund() {
        // ...
    }
}
```

If one subtype fundamentally cannot support refunds, repeatedly throwing:

```js
throw new Error("Refunds not supported");
```

is a signal that `refund()` may not belong in the common abstraction.

The capability can instead be separated:

```js
class RefundablePayment {
    refund() {
        // ...
    }
}
```

Only payment types that actually support refunds need to satisfy that contract.

The important point is not that every implementation must support every conceivable operation. The important point is
that every implementation of a particular abstraction must satisfy the behavior that abstraction promises.

## LSP and Null Objects

The **Null Object Pattern** can support substitutability when the null implementation intentionally satisfies the
abstraction's contract.

For example:

```js
class NullLogger {
    log(message) {
        // intentionally does nothing
    }
}
```

If the logger contract allows logging to be a no-op, `NullLogger` can be safely substituted. However, if callers require
that every `log()` call be persisted for compliance purposes, a null logger would violate the contract.

The pattern is therefore valid only when the null behavior satisfies the abstraction's semantics.

A Null Object is not automatically substitutable merely because it avoids returning errors. Its behavior must still be
permitted by the contract.

## LSP and Testing

LSP can be tested by verifying implementations against the same behavioral contract.

Suppose:

```js
function testPaymentGateway(gateway) {
    // common behavioral tests
}
```

Each implementation should pass the same relevant contract tests:

```js
testPaymentGateway(new CardGateway());
testPaymentGateway(new BankGateway());
testPaymentGateway(new CryptoGateway());
```

This approach is often called **contract testing**. The goal is to verify that implementations are actually
substitutable rather than merely structurally compatible.

Contract tests are particularly valuable when several implementations belong to the same application boundary, because
they make the expected behavior executable rather than leaving it entirely implicit in documentation.

## LSP and Property-Based Testing

For sufficiently complex abstractions, substitutability can be expressed as behavioral properties.

For example:

```text
For every valid order:
    calculateTotal(order) >= 0
```

If every pricing implementation must satisfy that property, it becomes part of the abstraction's behavioral contract.

Other properties may include idempotency, monotonicity, conservation, valid state transitions, non-negative balances,
and transactional guarantees.

Property-based testing can therefore provide strong evidence of behavioral substitutability by checking that different
implementations preserve properties across a broad set of valid inputs rather than merely passing a small collection of
example cases.

## LSP and Type Systems

Static type systems can detect some substitutability problems. They can identify incompatible method signatures, invalid
parameter types, incompatible return types, missing members, and certain variance errors.

However, type checking cannot establish the entire behavioral contract.

For example:

```ts
interface PaymentGateway {
    charge(amount: number): Promise<void>;
}
```

Both implementations may satisfy the interface:

```ts
class GoodGateway implements PaymentGateway {
    async charge(amount: number) {
        // actually charges
    }
}

class FakeGateway implements PaymentGateway {
    async charge(amount: number) {
        // does nothing
    }
}
```

The type system cannot determine whether the second implementation fulfills the semantic contract. Both implementations
have the required shape, but only one may satisfy the meaning assigned to `charge()`.

LSP therefore extends beyond static typing.

## LSP and Runtime Validation

In dynamically typed systems, runtime validation can help enforce parts of a contract.

For example:

```js
function processPayment(gateway, amount) {
    if (typeof gateway.charge !== "function") {
        throw new TypeError("Invalid payment gateway");
    }

    return gateway.charge(amount);
}
```

This verifies structural compatibility. It does not prove behavioral compatibility.

Runtime validation and LSP solve different parts of the problem. Runtime validation can establish that an object has the
required operation; LSP requires that the operation actually behaves according to the abstraction's contract.

## LSP and API Design

Public APIs should define contracts clearly enough that implementations can be substituted safely.

An API contract may need to clarify accepted input ranges, output semantics, failure behavior, side effects,
idempotency, ordering guarantees, concurrency assumptions, and lifecycle rules.

Ambiguous contracts make LSP difficult to enforce because clients cannot know what behavior they are entitled to rely
upon. If the contract is not explicit, different implementations can legitimately interpret the same method differently,
making substitutability impossible to reason about.

## LSP and Documentation

Documentation is part of a behavioral contract when clients are expected to rely upon the documented behavior.

Suppose an API documents:

```text
save()
Returns successfully only after the entity has been persisted.
```

An implementation that queues the entity for later persistence and immediately returns successfully changes the semantic
contract.

Likewise, documentation such as:

```text
delete()
is idempotent.
```

establishes a property that implementations must preserve.

Substitutability therefore depends partly on explicit documentation of behavior. A contract that exists only in the
implementation author's assumptions is difficult for independent implementations and consumers to honor consistently.

## LSP and Temporal Behavior

Some contracts include timing or lifecycle expectations.

For example:

```text
connect()
must complete before send() can be called.
```

A subtype that allows `send()` before `connect()` may be compatible if it preserves all observable semantics and does
not violate client assumptions. A subtype that requires additional lifecycle calls not required by the base abstraction
is more problematic:

```text
Base:
connect → send

Subtype:
connect → authenticate → initialize → send
```

If clients must know about the additional lifecycle requirements, the subtype is not safely substitutable.

Lifecycle requirements are therefore part of the contract whenever clients are expected to observe or depend upon them.

## LSP and Concurrency

Concurrency guarantees can also form part of a contract.

Suppose a repository guarantees:

```text
save() is atomic.
```

A subtype that partially writes state before failing may violate the abstraction.

Similarly, an abstraction promising thread-safe operations cannot be implemented by a subtype that introduces unsafe
shared state.

JavaScript applications may have different concurrency models depending on whether they use workers, shared memory,
asynchronous operations, external services, or other mechanisms, but the underlying principle is the same: observable
concurrency semantics are part of the contract when clients rely on them.

## LSP and Asynchronous APIs

Promise-based APIs have behavioral contracts too.

Suppose:

```js
class UserRepository {
    async findById(id) {
        // resolves with User or null
    }
}
```

A subtype that sometimes returns a synchronous value:

```js
class CachedUserRepository extends UserRepository {
    findById(id) {
        return cachedUser;
    }
}
```

may be problematic depending on the actual contract and consumer expectations. More importantly, an implementation that
changes rejection semantics, resolution values, cancellation behavior, ordering, or consistency guarantees may violate
substitutability.

Asynchronous behavior is part of the contract. The meaning of an operation includes not only what value eventually
appears, but also how success and failure are communicated and what lifecycle or ordering guarantees clients can rely
upon.

## LSP and Resource Management

Resource ownership can also be part of a contract.

Suppose:

```js
class File {
    close() {
        // releases resource
    }
}
```

A subtype that closes automatically after every operation may violate assumptions made by clients expecting the resource
to remain open. Likewise, a subtype that does not release resources when the contract requires it can violate
substitutability.

Observable lifecycle behavior matters whenever clients depend on ownership, cleanup, resource availability, or operation
ordering.

## Common LSP Violations

### Subclass That Throws for a Required Operation

```js
class ReadOnlyRepository extends Repository {
    save() {
        throw new Error("Not supported");
    }
}
```

If `save()` is part of the repository contract and clients are entitled to expect it to perform the operation, the
subtype is not substitutable.

### Subclass That Strengthens Preconditions

```js
class PremiumGateway extends PaymentGateway {
    charge(amount) {
        if (amount < 1000) {
            throw new Error("Minimum is 1000");
        }
    }
}
```

If the base contract accepts smaller positive amounts, the subtype strengthens the precondition and rejects inputs that
were previously valid.

### Subclass That Weakens Postconditions

```js
class DeferredRepository extends Repository {
    save(entity) {
        queueForLater(entity);
    }
}
```

If the base contract guarantees persistence after successful return, the subtype weakens the postcondition by returning
before that guarantee is true.

### Subclass That Breaks Invariants

```js
class UnsafeAccount extends BankAccount {
    withdraw(amount) {
        this.balance -= amount;
    }
}
```

If the base invariant requires a non-negative balance, the subtype violates it.

### Subclass Requiring Special Cases

```js
function process(repository) {
    if (repository instanceof ReadOnlyRepository) {
        return;
    }

    repository.save(entity);
}
```

The client must understand a concrete subtype because that subtype cannot satisfy the abstraction. This is a warning
that the abstraction may be incorrect.

### Subclass That Changes Meaning

```js
class Cache extends Repository {
    save(entity) {
        // stores only temporarily
    }
}
```

If `Repository.save()` means durable persistence, this implementation is not substitutable even though the operation has
the expected name.

## Fixing LSP Violations

There are several common ways to correct an LSP violation. The appropriate solution depends on whether the problem is an
overly broad abstraction, an invalid inheritance relationship, or behavior that belongs elsewhere.

### Narrow the Base Abstraction

Instead of defining one abstraction that promises capabilities not shared by every implementation:

```js
class Storage {
    read() {
    }

    write() {
    }

    delete() {
    }
}
```

define smaller contracts:

```js
class Reader {
    read() {
    }
}

class Writer {
    write() {
    }
}

class Deleter {
    delete() {
    }
}
```

This allows implementations to satisfy the capabilities they actually provide.

### Replace Inheritance with Composition

Instead of forcing an invalid subtype:

```js
class SpecialOrder extends Order {
    // incompatible behavior
}
```

compose the varying behavior:

```js
class Order {
    constructor(cancellationPolicy) {
        this.cancellationPolicy = cancellationPolicy;
    }

    cancel() {
        this.cancellationPolicy.cancel(this);
    }
}
```

The variation is now represented as a collaborator rather than a subtype. This avoids claiming that every `SpecialOrder`
is behaviorally interchangeable with every `Order`.

### Redesign the Contract

Sometimes the base abstraction promises too much.

For example:

```js
class Payment {
    charge() {
    }

    refund() {
    }
}
```

If not all payment types support refunds, separate the capability:

```js
class Payment {
    charge() {
    }
}

class RefundablePayment extends Payment {
    refund() {
    }
}
```

The common abstraction now contains only behavior that all implementations can honor.

### Move the Behavior to a Separate Service

If the behavior does not belong to the common abstraction, it can be moved elsewhere:

```js
class RefundService {
    refund(payment) {
        // ...
    }
}
```

The payment abstraction no longer needs to pretend that every implementation supports refunds.

## LSP and Refactoring

When refactoring an inheritance hierarchy, begin by identifying what the base abstraction actually promises and what
assumptions clients make about it. Then examine whether every subtype satisfies those assumptions.

Useful questions include:

* What does the base abstraction promise?
* What assumptions do clients make?
* Does every subtype satisfy those assumptions?
* Does any subtype strengthen input requirements?
* Does any subtype weaken output guarantees?
* Does any subtype break invariants?
* Do clients contain subtype checks?
* Do clients catch subtype-specific exceptions?
* Does any subtype require additional lifecycle steps?
* Could composition represent the variation more accurately?

If several answers indicate incompatibility, the inheritance hierarchy should be reconsidered rather than expanded with
additional exceptions and special cases.

## LSP and Legacy Systems

Legacy systems often contain inheritance hierarchies that developed incrementally. A base abstraction may begin with a
relatively small contract and gradually accumulate responsibilities as new subclasses are added.

Over time, clients may contain special cases such as:

```js
if (service instanceof LegacyService) {
    // special behavior
}

if (service instanceof SpecialService) {
    // another exception
}
```

These conditionals indicate that the abstraction may no longer provide a reliable behavioral contract.

A practical refactoring strategy is to identify the common capabilities actually required by clients and create narrower
abstractions around them. Existing implementations can then be adapted to those contracts without necessarily requiring
an immediate, disruptive rewrite of the entire hierarchy.

## LSP and Design Smells

Common warning signs include:

* subclasses that throw `"not supported"` for required operations,
* overridden methods with substantially different semantics,
* repeated `instanceof` checks,
* type-based branching,
* subtype-specific exception handling,
* clients that inspect concrete classes,
* subclasses requiring additional setup,
* subclasses rejecting inputs accepted by the base type,
* subclasses returning semantically different values,
* inheritance used solely for code reuse.

None of these proves an LSP violation individually. A subtype may legitimately reject an operation if that rejection is
part of the abstraction's contract, and an `instanceof` check may have legitimate uses outside ordinary polymorphic
behavior.

Together, however, these signs are strong evidence that the abstraction should be examined.

## LSP and Code Reuse

Inheritance should not be introduced merely to reuse implementation.

For example:

```js
class DatabaseLogger {
    log(message) {
    }
}

class FileLogger extends DatabaseLogger {
    log(message) {
        // writes to file
    }
}
```

If `FileLogger` is not behaviorally a `DatabaseLogger`, the inheritance relationship is misleading. The implementation
may be reusable without creating a subtype relationship.

Code reuse can instead be achieved through composition, delegation, extracted functions, modules, or other mechanisms.
**Code reuse is not sufficient justification for subtyping.**

## LSP and Inheritance for Convenience

A particularly dangerous pattern is:

```js
class UserRepository extends DatabaseRepository {
    // only because it gets useful methods
}
```

If the subclass does not actually satisfy the semantic contract of the base type, the hierarchy creates false
substitutability.

Composition avoids making that claim:

```js
class UserRepository {
    constructor(databaseRepository) {
        this.databaseRepository = databaseRepository;
    }
}
```

The repository can use the database implementation without claiming that every `UserRepository` is itself a
`DatabaseRepository`.

## LSP and Structural Reuse

In JavaScript, implementation reuse can often be achieved through composition, delegation, functions, mixins, modules,
and higher-order functions.

For example:

```js
class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    save(user) {
        return this.repository.save(user);
    }
}
```

The service delegates behavior rather than inheriting from the repository. The relationship between the two objects is
therefore one of collaboration rather than subtyping.

This distinction is important because implementation reuse and behavioral substitutability are different concerns. A
piece of code may be useful to another component without establishing that the consumer is a valid subtype of the reused
component.

## LSP and Testing Through Substitution

A practical test for LSP is to replace the implementation while keeping the client unchanged.

Start with:

```js
function checkout(paymentGateway, order) {
    paymentGateway.charge(order.total);
}
```

Then substitute implementations:

```js
checkout(new CardGateway(), order);
checkout(new BankGateway(), order);
checkout(new CryptoGateway(), order);
```

If the client must be changed for each implementation because the implementations expose incompatible semantics, the
abstraction may not be sufficiently behavioral or the implementations may not be substitutable.

The strength of the test is precisely that the client remains unchanged. Substitution should be transparent at the level
of behavior that the abstraction promises.

## LSP and Contract Tests

A reusable contract test can make the principle explicit:

```js
function verifyRepository(repository) {
    const entity = createEntity();

    repository.save(entity);

    const result = repository.findById(entity.id);

    if (result.id !== entity.id) {
        throw new Error("Repository contract violated");
    }
}
```

Each implementation should satisfy the same contract:

```js
verifyRepository(new PostgresRepository());
verifyRepository(new MongoRepository());
verifyRepository(new InMemoryRepository());
```

The specific implementation can differ internally. The externally observable contract should remain compatible.

A complete contract test suite will usually cover more than one successful operation. It may verify invalid inputs,
error semantics, idempotency, state transitions, persistence guarantees, ordering, cleanup, and other behavior that
clients depend upon.

## LSP and Abstraction Quality

A useful abstraction defines behavior shared by all valid implementations. A poor abstraction defines behavior that only
some implementations can provide.

For example, an abstraction containing `read`, `write`, `delete`, `transaction`, and `subscribe` may be too broad if
different implementations support only different subsets of those capabilities.

The problem is not that implementations differ internally. Different implementations are expected to differ. The problem
is that the abstraction promises behavior that some of them cannot honor.

A better design separates capabilities according to actual contracts. Each abstraction should represent a meaningful
behavioral boundary rather than an arbitrary collection of methods.

## LSP and the Real Meaning of "Is-A"

The phrase `"X is a Y"` is not sufficient to establish a subtype relationship.

A stronger test is:

> **Can every client that expects Y safely use X without knowing that X is an X?**

For example, `"Penguin is a Bird"` may be true biologically. But if `Bird` means `"an object that can fly"` in the
software contract, `Penguin` cannot satisfy that abstraction.

The problem is that the abstraction encoded an assumption that was not actually universal.

Software inheritance should therefore be based on behavioral meaning rather than natural-language classification alone.

## LSP and Capability Modeling

A better domain model often separates broad entities from optional capabilities.

Instead of defining a single `Bird` abstraction that promises flying, swimming, and walking, the model can treat these
as independent capabilities. A particular entity can then support the capabilities that actually apply to it.

This approach is especially useful when domain entities have independent behavioral dimensions. It prevents a broad base
type from accumulating operations that become problematic for particular subtypes.

Capability modeling is not merely a technique for avoiding inheritance. It is a way of making the behavioral contract
explicit.

## LSP and the Principle of Least Surprise

Substitutability is closely related to the **Principle of Least Surprise**. A client using an abstraction should not
encounter surprising behavior simply because a different implementation was supplied.

For example:

```js
function saveUser(repository, user) {
    repository.save(user);
}
```

A caller should not have to know that one repository silently discards the user, requires a special initialization call,
accepts only certain users, saves asynchronously despite a synchronous contract, or unexpectedly mutates the supplied
user.

If such behavior is required, the contract should explicitly define it or the abstraction should be redesigned.

The principle is not that every implementation must behave identically in every respect. Implementations can differ
substantially internally. They must remain compatible in the aspects that the abstraction exposes as guarantees.

## LSP and Stable Contracts

LSP becomes more important as an abstraction becomes more widely used.

A private internal abstraction may have a small number of consumers. A public library interface, SDK contract, plugin
boundary, or service API may have many independent consumers.

Breaking substitutability at such a boundary can affect a large portion of the system. Strong contracts therefore become
increasingly valuable as abstraction scope increases.

The wider the consumer base, the more dangerous it becomes to introduce implementation-specific assumptions into what is
supposed to be a common abstraction.

## LSP and Architectural Boundaries

LSP applies at architectural boundaries as well as class boundaries. Repositories, payment gateways, message brokers,
storage providers, notification providers, authentication providers, plugins, service implementations, and API adapters
can all have substitutable implementations.

For example, an application may depend on a `PaymentGateway` abstraction while different providers implement that
contract. Every implementation must preserve the behavior expected by the application, and the application should not
need provider-specific exceptions during ordinary operation.

The same reasoning applies whether the implementation is an in-process class, an external service adapter, or a remote
provider. The abstraction exists at the boundary where the client depends on behavior.

## LSP and Adapters

The **Adapter Pattern** is often used to make an external implementation satisfy an existing abstraction.

For example:

```js
class PaymentAdapter {
    constructor(provider) {
        this.provider = provider;
    }

    charge(amount) {
        return this.provider.makePayment(amount);
    }
}
```

The adapter is valid only if it maps the external provider's semantics into the application's expected contract. Merely
matching the method name is insufficient.

The adapter may need to preserve input semantics, output semantics, errors, state behavior, transaction guarantees,
idempotency, and other relevant properties. An adapter that translates method names but changes the meaning of the
operation is not a successful substitution layer.

## LSP and Anti-Corruption Layers

In larger architectures, external systems often use different domain semantics. An adapter or anti-corruption layer can
translate those semantics into the application's internal contract.

The important role of such a layer is not merely technical integration. It prevents the external system's assumptions
from becoming accidental requirements of the internal abstraction.

Without translation, an external implementation might technically fit the interface while violating its intended
behavior. The anti-corruption layer establishes a controlled semantic boundary between the two systems.

## LSP and SOLID

LSP is the third principle in SOLID:

* **S** — Single Responsibility Principle
* **O** — Open-Closed Principle
* **L** — Liskov Substitution Principle
* **I** — Interface Segregation Principle
* **D** — Dependency Inversion Principle

The principles reinforce one another, but they address different design questions.

SRP concerns cohesive responsibility and reasons for change. OCP concerns extension without inappropriate modification.
LSP concerns behavioral substitutability. ISP concerns keeping contracts focused on the behavior individual clients
actually require. DIP concerns depending on appropriate abstractions rather than concrete implementation details.

A focused abstraction makes it easier to define a meaningful contract. OCP can then use that abstraction for variation,
while LSP establishes that implementations of the abstraction must remain substitutable. ISP can reduce the abstraction
when it contains too many capabilities, and DIP can make high-level modules depend upon the resulting contracts.

This is not a mandatory sequence or dependency between the principles. They are complementary design concerns that often
expose the same underlying abstraction problems from different perspectives.

## Common Misinterpretations

### "LSP means every subclass must behave identically"

Incorrect. A subtype can provide specialized behavior. It simply must preserve the guarantees and expectations of the
abstraction.

Different implementations are expected to have different internal algorithms, performance characteristics, storage
mechanisms, or other implementation details. Those differences become an LSP problem only when they alter behavior that
the client is entitled to rely upon.

### "LSP means inheritance is always bad"

Incorrect. Inheritance can be appropriate when the subtype genuinely satisfies the behavioral contract of the base type.

The principle does not prohibit inheritance. It provides a criterion for deciding whether inheritance represents a valid
substitutable relationship.

### "If it compiles, it satisfies LSP"

Incorrect. Static compatibility does not guarantee semantic compatibility.

A type system can establish that an object has compatible members and types, but it generally cannot determine whether
an operation actually fulfills its documented behavioral meaning.

### "If it has the same methods, it is substitutable"

Incorrect. Method signatures establish only part of the contract.

The implementation must also preserve valid inputs, output semantics, failure behavior, state transitions, side effects,
invariants, lifecycle requirements, and other observable guarantees.

### "Throwing an exception always violates LSP"

Incorrect. Exceptions can be part of the contract.

The issue is whether the subtype introduces unexpected or incompatible failure behavior.

### "A subclass can strengthen validation rules"

Generally not when the base contract permits the broader input. Doing so strengthens preconditions and can break
clients.

A subtype can impose additional requirements only when those requirements are already part of the contract that clients
are expected to satisfy.

### "LSP applies only to classes"

Incorrect. It applies to any abstraction with substitutable implementations, including interfaces, functions, modules,
services, plugins, APIs, and adapters.

### "Composition makes LSP irrelevant"

Incorrect. Composition still requires substituted dependencies to honor their contracts.

Composition often makes the contracts smaller and more explicit, but it does not eliminate behavioral expectations.

### "LSP requires identical implementation"

Incorrect. Implementations can be completely different internally.

Only externally relevant behavior covered by the contract needs to remain compatible.

## Best Practices

* **Define behavioral contracts explicitly.** Document valid inputs, outputs, failures, side effects, invariants, state
  transitions, and lifecycle requirements where clients depend upon them.
* **Use inheritance only for genuine behavioral subtyping.** Do not use inheritance merely because a superclass contains
  useful implementation.
* **Do not strengthen preconditions in subtypes.** Accept at least the inputs that the base abstraction permits.
* **Do not weaken postconditions.** Preserve the guarantees made by the base abstraction.
* **Preserve invariants.** A subtype must not create states that the base abstraction promises cannot exist.
* **Avoid unsupported implementations for required operations.** If a subtype cannot provide an operation that the
  abstraction promises, reconsider the abstraction.
* **Prefer capability-oriented abstractions.** Define contracts around behavior that implementations genuinely share.
* **Keep interfaces narrow.** Smaller contracts make behavioral substitutability easier to maintain.
* **Avoid subtype-specific branches in clients.** Repeated `instanceof` checks or type-based branching often indicate a
  broken abstraction.
* **Use composition when inheritance creates awkward constraints.** Delegation and dependency injection often represent
  variation more accurately.
* **Treat errors as part of the contract.** Failure behavior is observable behavior.
* **Treat side effects and lifecycle semantics as part of the contract.** Substitutability includes more than return
  values.
* **Test implementations against shared contracts.** Contract tests can verify that multiple implementations remain
  substitutable.
* **Use the type system where available, but do not rely on it alone.** Structural type compatibility does not prove
  semantic compatibility.
* **Model domain capabilities explicitly.** Do not force entities into broad hierarchies merely because the
  relationships are true in the real world.
* **Keep stable abstractions semantically meaningful.** The abstraction should represent behavior that all valid
  implementations can honor.
* **Refactor invalid hierarchies rather than adding exceptions.** Repeated special cases are often evidence that the
  abstraction is wrong.

## Summary

The Liskov Substitution Principle is fundamentally about **behavioral substitutability**.

A subtype is valid when clients that depend on the base abstraction can use the subtype without needing to know that a
different implementation has been supplied. The subtype must preserve the behavioral guarantees of that abstraction,
including relevant preconditions, postconditions, invariants, failure semantics, side effects, state transitions,
lifecycle behavior, and other observable properties.

A valid subtype does not need to implement the same algorithm or produce identical internal behavior. It may specialize
the implementation substantially. What matters is whether the specialization remains compatible with the contract that
clients depend upon.

The most useful practical test is:

> **If I replace the expected abstraction with this implementation, can the existing client continue to behave correctly
without adding subtype-specific knowledge or special cases?**

If the answer is no, the problem may be an invalid inheritance relationship, an overly broad interface, an incorrectly
defined contract, an inappropriate abstraction, or a case where composition is more suitable than inheritance.

LSP therefore provides the behavioral foundation for safe polymorphism. An abstraction is useful as a substitution
boundary only when its implementations can actually honor the behavior that the abstraction promises.

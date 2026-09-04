# Why Design Patterns

Software systems repeatedly encounter the same categories of design problems. Objects need to be created without tightly
coupling clients to concrete implementations. Behavior needs to vary without continually modifying stable code.
Components need to communicate without becoming directly dependent on one another. Existing interfaces need to be
integrated with incompatible systems. Complex subsystems need simpler entry points.

Design patterns document proven ways of addressing these recurring problems. Their value is not that they make code
shorter or automatically better. Their value is that they make **design decisions explicit, reusable, and
communicable**.

## Recurring Design Problems

Many software systems are different at the business level but encounter similar structural problems. One application may
need interchangeable payment algorithms, another interchangeable shipping algorithms, and another interchangeable
serialization algorithms. Although the business domains differ, the underlying design problem can be the same: a stable
component depends on behavior that varies.

A recurring solution can therefore be described independently of the specific domain. That is the fundamental reason
patterns exist.

## Managing Change

One of the primary reasons to use design patterns is to control the impact of change. Software changes because
requirements change, business rules change, integrations change, technologies change, performance requirements change,
deployment environments change, new implementations are introduced, and existing implementations are replaced.

A tightly coupled design allows a change in one concern to propagate through unrelated parts of the system. For example:

```js
class OrderService {
    calculateTotal(order) {
        if (order.customer.type === "regular") {
            // ...
        } else if (order.customer.type === "premium") {
            // ...
        } else if (order.customer.type === "enterprise") {
            // ...
        }
    }
}
```

Adding another pricing policy requires modifying the service. If pricing is an independently varying concern, the design
can separate it from the stable order-processing logic.

The resulting design isolates the variation. This is one of the central purposes of patterns: **localize changes so that
a change in one design concern does not unnecessarily propagate into unrelated concerns**.

## Isolating What Varies

A recurring design heuristic behind many patterns is **encapsulate what varies**.

Suppose an application has a stable workflow consisting of loading an order, calculating its price, processing payment,
and sending confirmation, while payment processing varies between Stripe, PayPal, bank transfer, and mock payment
implementations.

The stable workflow should not necessarily contain every payment variation directly. Instead, payment behavior can be
separated behind an abstraction so that the stable workflow delegates payment processing to interchangeable
implementations.

This separation allows the varying concern to evolve independently. Patterns such as Strategy, Factory Method, Abstract
Factory, Bridge, State, and Template Method apply variations of this general idea.

## Reducing Coupling

Coupling describes how strongly software elements depend on one another. Consider:

```js
class ReportService {
    constructor() {
        this.database = new PostgreSQLDatabase();
    }
}
```

`ReportService` is directly coupled to `PostgreSQLDatabase`. Replacing the database requires changing the service.

A different design can introduce the dependency from outside:

```js
class ReportService {
    constructor(database) {
        this.database = database;
    }
}
```

The service can now depend on a database capability while different implementations can be supplied, such as PostgreSQL
or an in-memory implementation.

Patterns frequently provide structures for controlling this kind of coupling. However, **the objective is not zero
coupling**. A system with no relationships between components cannot perform useful work. The objective is to establish
**appropriate coupling at appropriate boundaries**.

## Separating Responsibilities

A component becomes difficult to maintain when unrelated responsibilities accumulate inside it. For example, an
`OrderService` containing pricing, tax calculation, payment processing, email formatting, PDF generation, and
persistence has multiple independent reasons to change.

Design patterns can provide structures for separating these responsibilities. Decorator can separate optional
responsibilities by composing behavior around an existing component. Chain of Responsibility can distribute request
handling among multiple handlers. Mediator can separate communication responsibilities from the participating objects.

The pattern is useful because it gives the responsibility separation a recognizable structure.

## Improving Extensibility

A design is extensible when new behavior can be introduced without requiring disproportionate modification to existing
code.

Suppose:

```js
function calculateShipping(order, type) {
    if (type === "standard") {
        // ...
    }

    if (type === "express") {
        // ...
    }

    if (type === "overnight") {
        // ...
    }
}
```

Each new shipping method requires modification of the function.

A Strategy-based design can move the varying algorithms outside the stable component:

```js
function calculateShipping(order, strategy) {
    return strategy(order);
}
```

New strategies can then be introduced independently:

```js
const standardShipping = order => {
    // ...
};

const expressShipping = order => {
    // ...
};

const overnightShipping = order => {
    // ...
};
```

Patterns can therefore help make extension points explicit. This relates directly to the **Open-Closed Principle**
because a stable abstraction can provide an extension point through which new implementations are introduced.

The pattern itself does not guarantee OCP compliance. The design must still define a meaningful boundary around the
variation.

## Making Dependencies Explicit

A design becomes easier to reason about when important dependencies are visible. Consider:

```js
class UserService {
    constructor() {
        this.repository = new UserRepository();
        this.mailer = new EmailService();
    }
}
```

The dependencies are hidden inside construction.

A dependency-injected design makes them explicit:

```js
class UserService {
    constructor(repository, mailer) {
        this.repository = repository;
        this.mailer = mailer;
    }
}
```

The dependency structure is now visible through the constructor. This can be particularly useful for testing, replacing
implementations, configuration, modularity, and architectural boundaries.

Patterns and pattern-like structures can help establish explicit dependency boundaries.

## Supporting Testability

Strongly coupled code is often difficult to test. For example:

```js
class OrderService {
    constructor() {
        this.payment = new PaymentGateway();
    }
}
```

A test cannot easily replace the gateway.

A more decoupled design can accept a collaborator:

```js
class OrderService {
    constructor(payment) {
        this.payment = payment;
    }
}
```

A test can now provide a controlled implementation:

```js
const payment = {
    charge() {
        return {success: true};
    }
};

const service = new OrderService(payment);
```

Patterns do not exist specifically to make code testable, but many patterns naturally create seams where implementations
can be replaced. Examples include Strategy, Factory Method, Adapter, Proxy, Command, dependency injection, and Observer.

The relevant benefit is the **separation of collaborators**, not the pattern name itself.

## Managing Object Creation

Direct construction can create unnecessary coupling. Consider:

```js
class NotificationService {
    send(message) {
        const notification = new EmailNotification();
        notification.send(message);
    }
}
```

The service knows exactly which implementation to construct.

If notification types vary between email, SMS, push, and webhook, object creation becomes a separate design concern. A
factory can isolate that decision:

```js
function createNotification(type) {
    switch (type) {
        case "email":
            return new EmailNotification();

        case "sms":
            return new SmsNotification();

        case "push":
            return new PushNotification();

        default:
            throw new Error(`Unsupported notification type: ${type}`);
    }
}
```

The client can then depend on the product abstraction rather than the construction details. This is the motivation
behind creational patterns.

## Controlling Interface Compatibility

Existing systems often expose interfaces that do not match the interface required by a client.

For example:

```js
class LegacyPayment {
    makePayment(amount) {
        // ...
    }
}
```

while the application expects:

```js
payment.charge(amount);
```

An Adapter can isolate the mismatch:

```js
class PaymentAdapter {
    constructor(legacyPayment) {
        this.legacyPayment = legacyPayment;
    }

    charge(amount) {
        return this.legacyPayment.makePayment(amount);
    }
}
```

The client depends on the expected interface while the adapter translates that interface to the legacy implementation.

The benefit is containment. The incompatibility remains inside the adapter instead of spreading through the application.

## Controlling Complexity

Large systems become difficult to understand when clients must know the internal structure of complex subsystems.

A client may otherwise need to coordinate database access, caching, authentication, validation, logging, configuration,
and messaging directly. A Facade can expose a simpler boundary while keeping the internal subsystem structure behind it.

The subsystem remains complex internally, but the client does not need to understand every component.

The pattern therefore controls **interface complexity**, not necessarily internal complexity.

## Supporting Interchangeable Behavior

Some systems require runtime selection between behaviors. For example, pricing may support regular, wholesale,
promotional, and subscription models.

Without separation, the client may accumulate conditionals:

```js
if (type === "regular") {
    // ...
} else if (type === "wholesale") {
    // ...
} else if (type === "promotional") {
    // ...
}
```

A Strategy structure makes the variation explicit and allows the client to delegate the variable behavior instead of
implementing every variation itself.

This is particularly useful when algorithms are independently developed, change independently, are selected at runtime,
or require independent testing.

## Supporting State-Dependent Behavior

Objects sometimes change their behavior according to their current state. For example, a connection may be disconnected,
connecting, connected, or failed.

A single class can contain all state-dependent behavior:

```js
if (state === "disconnected") {
    // ...
} else if (state === "connecting") {
    // ...
} else if (state === "connected") {
    // ...
}
```

As the number of states grows, this can become difficult to maintain.

The State pattern can move state-specific behavior into separate objects. The connection delegates behavior to its
current state, and each state encapsulates the rules associated with that condition.

The benefit is that state-specific rules become localized.

## Supporting Object Communication

Objects often need to communicate without becoming directly dependent on every other participant.

Without an abstraction, one sender may accumulate direct dependencies on many receivers. An Observer structure allows a
subject to publish changes without requiring direct knowledge of each observer's internal implementation.

Similarly, Mediator can centralize communication between participating objects. The design goal is not merely fewer
objects. It is **controlling the dependency graph**.

## Localizing Legacy and External Dependencies

External systems are often outside the application's control. Examples include third-party APIs, legacy services, vendor
SDKs, databases, operating-system interfaces, and external protocols.

Allowing their interfaces to propagate throughout the system creates widespread coupling.

An Adapter can create a local boundary between the application and the external system. The application uses its own
expected interface, while the adapter translates that interface into the external API.

The external dependency becomes localized. If the external API changes, the adapter can absorb much of the change.

This is especially valuable at architectural boundaries.

## Preserving Stable Client Interfaces

A pattern can allow internal implementation to change while keeping the client-facing interface stable.

For example, a client can depend on a Facade while the underlying subsystem implementation changes. The client can also
depend on a Strategy abstraction while the selected algorithm changes.

The stable boundary absorbs the implementation variation.

This is one of the strongest reasons to introduce an abstraction: **the abstraction creates a stable dependency point
while implementations remain replaceable**.

## Improving Separation of Concerns

Patterns frequently establish boundaries between concerns.

Decorator adds responsibilities through composition. Adapter translates an interface. Facade simplifies access to a
subsystem. Proxy controls access to another object. Strategy encapsulates an algorithm.

Each pattern addresses a different form of separation.

The benefit comes from placing a responsibility behind an explicit boundary.

## Making Design Intent Visible

Code can implement a design successfully while still being difficult to understand. Pattern terminology provides a
compact way to communicate intent.

For example, saying that payment uses Strategy immediately suggests that payment behavior varies, that the behavior is
encapsulated, that implementations are interchangeable, and that the client delegates the algorithm.

Likewise, saying that external API access is behind an Adapter communicates that the external interface differs from the
application's interface, that translation is localized, and that the application should not depend directly on the
external representation.

Pattern names therefore serve as **design vocabulary**.

## Reducing Cognitive Load

A well-known design structure can be easier to understand than an ad hoc structure.

Instead of describing an object as something that calls another object except under a particular condition, where
another object intercepts the operation and another may handle it, the design can be described as a Chain of
Responsibility when that pattern actually applies.

The shorter terminology provides a recognized conceptual model.

However, this benefit depends on the pattern being used correctly. If developers must first reverse-engineer an unusual
implementation before recognizing the supposed pattern, the vocabulary benefit is lost.

## Standardizing Design Communication

Large teams need a shared language for discussing architecture. Without common terminology, the same structural idea may
be described differently by different developers.

Patterns provide names for recurring designs such as Adapter, Bridge, Composite, Decorator, Facade, Proxy, Strategy,
Observer, Command, and State.

This allows discussions to happen at the design level rather than only at the implementation level. For example, "Put an
Adapter boundary around the vendor API" communicates a known category of solution more precisely than a lengthy
description of the implementation.

## Supporting Independent Evolution

A good design allows different parts of the system to evolve at different rates.

For example, business logic may remain stable while payment providers change. A payment abstraction can isolate the
providers from the business logic so that multiple implementations can evolve independently.

Similarly, an application can depend on a repository abstraction while PostgreSQL, MongoDB, and in-memory
implementations change independently.

This is particularly valuable when different concerns have different volatility.

## Protecting Architectural Boundaries

Patterns can help establish boundaries between architectural layers.

An Adapter can prevent infrastructure-specific interfaces from leaking into the domain. A Facade can provide a stable
subsystem boundary. A Factory can prevent infrastructure-specific construction from spreading through application code.
A Proxy can control access across a boundary.

Patterns therefore become useful not only at the class level but also at larger component boundaries.

## Patterns and the Cost of Change

A useful way to evaluate a design is to ask **what changes frequently and what should remain stable**.

Suppose order-processing rules are stable while the payment provider is volatile. A suitable abstraction can place the
payment concern behind a boundary, allowing the expected change to have a smaller impact radius.

The same reasoning applies when an application API is stable while a third-party service is volatile, or when a
client-facing interface is stable while an internal subsystem implementation changes.

The purpose is not merely to introduce indirection. It is to reduce the number of unrelated components affected by an
expected change.

## Patterns Do Not Eliminate Complexity

Patterns relocate and structure complexity. They do not make complexity disappear.

For example, without Strategy, one class may contain several algorithms. With Strategy, the algorithms are represented
by separate implementations behind a common behavioral boundary.

The algorithms still exist. The pattern changes where the complexity lives and how it is accessed.

This distinction matters because introducing a pattern always creates some additional structure. The goal is to place
complexity where it is easier to understand, isolate, test, and change.

## Patterns Can Increase Complexity

Every pattern has consequences. Introducing an abstraction can mean more interfaces, objects, indirection,
configuration, concepts, and files.

For a small and stable problem, this may be unnecessary. For a large or volatile problem, the same abstraction may be
valuable.

The relevant trade-offs are **flexibility versus complexity** and **decoupling versus indirection**. Patterns are
valuable when the flexibility or decoupling they provide justifies the additional complexity.

## Patterns and YAGNI

**YAGNI — You Aren't Gonna Need It** — is relevant to pattern selection. Do not introduce an abstraction solely because
future requirements might eventually need it.

For example, if the current requirement has one payment provider, creating a large hierarchy of abstractions and
factories solely because the system might someday support twelve providers is premature abstraction.

A better approach is to identify actual variation or a concrete architectural boundary. If variation later emerges, the
code can be refactored toward an appropriate pattern.

Patterns should solve demonstrated design problems rather than speculative ones.

## Patterns and Technical Debt

Patterns can prevent certain forms of technical debt by making architectural boundaries explicit.

For example, a direct vendor dependency can spread throughout application code. A local abstraction combined with an
Adapter can contain the vendor dependency at a defined boundary.

However, unnecessary patterns can themselves become technical debt. A complicated abstraction introduced for a problem
that never materializes must still be maintained.

Therefore, patterns can either reduce technical debt or become technical debt depending on whether the abstraction
corresponds to a real design requirement.

## Patterns and SOLID Principles

Patterns and SOLID address different levels of design.

SOLID provides general design principles. Patterns provide recurring structures that can help implement those
principles.

For example, Strategy separates varying behavior and can support OCP. Factory Method separates construction from usage
and can reduce concrete dependencies. Adapter isolates interface mismatch and can preserve client abstraction
boundaries. Decorator adds responsibilities through composition and can support extension without modifying the core
object.

The relationship is complementary. A pattern is not automatically a SOLID design.

## Patterns and Composition Over Inheritance

Many patterns were historically described using class inheritance. Modern JavaScript often favors composition.

For example, behavior can be composed directly:

```js
const withLogging = service => ({
    execute(...args) {
        console.log("Executing");
        return service.execute(...args);
    }
});

const withMetrics = service => ({
    execute(...args) {
        const result = service.execute(...args);
        recordMetrics();
        return result;
    }
});
```

This structure resembles Decorator, but no inheritance hierarchy is required.

The important principle is that **the design pattern is the conceptual solution; the programming language determines how
that solution is expressed**.

## Patterns and Simpler Alternatives

Before introducing a pattern, simpler alternatives should be considered.

Possible alternatives include:

* direct functions,
* direct object composition,
* simple modules,
* configuration objects,
* lookup tables,
* higher-order functions,
* small conditionals,
* simple dependency injection.

For example, a Strategy-like design may only require:

```js
const strategies = {
    regular: regularPricing,
    premium: premiumPricing
};
```

A class hierarchy may add no value.

Likewise, a Factory may be unnecessary if construction is already trivial and stable:

```js
const logger = new Logger();
```

Pattern selection should therefore follow the **simplest design that adequately addresses the problem**.

## When Patterns Are Particularly Valuable

Patterns are especially useful when one or more of the following conditions exist:

* behavior varies independently,
* object creation is complex or variable,
* multiple implementations share a behavioral contract,
* an external interface must be isolated,
* a subsystem is too complex for direct client interaction,
* responsibilities need to be distributed,
* objects need controlled communication,
* state-dependent behavior is growing,
* an operation needs to be represented independently of its execution,
* an object structure needs to support multiple operations,
* implementation dimensions need to vary independently.

These conditions indicate that a recurring design problem may be present. They do not automatically dictate a specific
pattern.

## When Patterns Are Usually Unnecessary

A pattern is often unnecessary when:

* there is no meaningful variation,
* the implementation is small and stable,
* direct composition is already clear,
* an abstraction has no independent responsibility,
* the pattern exists only to satisfy a theoretical future requirement,
* the abstraction makes the code harder to understand,
* the pattern adds indirection without reducing coupling,
* a simpler language feature solves the problem.

For example:

```js
function calculateTax(amount) {
    return amount * 0.18;
}
```

does not need a `TaxStrategy` class simply because Strategy exists.

The direct implementation is clearer when the behavior is stable and there is no meaningful need for substitution.

## Pattern Selection Should Follow Volatility

A useful design heuristic is to identify **volatility**. If something is likely to change independently, isolate it.

For example, if the checkout workflow is stable while the payment provider is volatile, an abstraction around payment
may be appropriate. If an application API is stable while a third-party service is volatile, an Adapter may be
appropriate. If a client interface is stable while a subsystem implementation changes, a Facade may be appropriate.

The exact pattern depends on the problem, but the underlying reasoning remains the same: **independent volatility can
justify an abstraction boundary**.

## Patterns as Risk Management

Patterns can be viewed as mechanisms for managing design risk.

If the risk is that a vendor API will change, an Adapter boundary can contain the impact. If algorithms change
independently, Strategy can isolate them. If object construction varies across configurations, Factory or Builder can
separate construction from usage. If clients become dependent on subsystem internals, Facade can provide a simpler
boundary. If state-specific behavior grows uncontrollably, State can localize the rules.

The pattern is valuable because it reduces the expected impact of a known design risk.

## Patterns and Architectural Evolution

Patterns are not limited to individual classes. The same design concepts can appear at larger scales.

An Adapter at class level can correspond conceptually to an integration or anti-corruption boundary at component level.
A Facade can appear as a subsystem API, service boundary, module boundary, or application gateway.

The scale changes, but the underlying concern remains: **control dependency and complexity through an explicit
boundary**.

Patterns can therefore contribute to architectural design as well as local object design.

## The Real Benefit: Controlled Change

The various benefits of patterns can be reduced to a common objective: **make important variations explicit and contain
their impact**.

This can produce several practical outcomes:

* variation becomes explicit,
* an abstraction boundary contains the variation,
* inappropriate coupling is reduced,
* changes become more localized,
* collaborators become easier to replace,
* extensions become easier to introduce,
* maintenance becomes more predictable.

Not every pattern provides every benefit. Many patterns derive their value from controlling how responsibilities and
changes propagate through a system.

## Patterns Are Communication Tools

A pattern is useful even before any code is written.

During design discussions, developers can reason about alternatives using established concepts. Asking whether a design
should use Strategy or State is really asking whether the system is selecting interchangeable algorithms or whether an
object's behavior changes according to its current state.

Similarly, asking whether a design is an Adapter or a Facade distinguishes between translating an incompatible interface
and simplifying access to a complex subsystem.

Pattern vocabulary makes these distinctions explicit.

## The Cost-Benefit Test

A practical pattern decision can be reduced to several questions:

* What problem exists?
* What is changing?
* What should remain stable?
* What dependency is undesirable?
* What responsibility should be isolated?
* What complexity will the abstraction remove?
* What complexity will the abstraction introduce?
* Would a simpler design solve the problem?
* Will the expected benefit justify the additional structure?

If the answer to the final question is no, the pattern should not be introduced.

## A Pattern Is Not the Goal

The final objective of software design is not to use more design patterns. It is to build a system whose
responsibilities, dependencies, and variation points are appropriately structured.

Patterns are tools for achieving that objective.

A simple design without patterns can be better than a heavily patterned design. A sophisticated system may require many
patterns. The number of patterns is not a measure of architectural quality.

## Summary

Design patterns are valuable because software repeatedly encounters recurring design problems.

They can help:

* isolate variation,
* reduce inappropriate coupling,
* separate responsibilities,
* improve extensibility,
* make dependencies explicit,
* improve testability,
* control object creation,
* contain external dependencies,
* translate incompatible interfaces,
* simplify complex subsystems,
* manage state-dependent behavior,
* coordinate object communication,
* preserve stable interfaces,
* protect architectural boundaries,
* communicate design intent,
* localize the impact of change.

Their central purpose is not abstraction for its own sake. The fundamental design question is **what is likely to
change, what should remain stable, and how can the design prevent that change from spreading unnecessarily?**

A design pattern is justified when it provides a clear, reusable structure for answering that question.

A pattern should therefore be introduced because a **real design problem warrants it**, not because the pattern exists.

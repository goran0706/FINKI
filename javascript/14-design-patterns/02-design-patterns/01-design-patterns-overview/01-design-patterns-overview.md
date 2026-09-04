# Design Patterns Overview

Design patterns are **reusable solutions to recurring software design problems**. A design pattern does not provide a
finished implementation. It describes a proven way of structuring objects, classes, responsibilities, and their
relationships to solve a particular category of design problem within a particular context.

A pattern therefore sits between design principles and concrete implementation. Principles such as SOLID establish
constraints and heuristics for producing maintainable designs, while patterns provide recurring structural and
behavioral arrangements that can be applied when those principles need to be realized in concrete designs.

A pattern is consequently not a piece of code to copy. It is a **design vocabulary and a solution structure**.

## What a Design Pattern Is

A design pattern captures a recurring relationship between a design problem, the context in which the problem occurs,
the forces or constraints affecting the design, a general solution structure, and the consequences of applying that
solution. The same pattern can therefore have many implementations.

For example, the Strategy pattern can be implemented using classes:

```js
class Checkout {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculateTotal(cart) {
        return this.pricingStrategy.calculate(cart);
    }
}
```

The important part is not the exact syntax. The important part is the design relationship: `Checkout` delegates variable
pricing behavior to an interchangeable pricing strategy. The implementation can use classes, objects, functions,
closures, modules, or other language mechanisms while preserving the same underlying design idea.

## Pattern vs Implementation

A pattern is an abstraction over implementations. Consider an object that needs a configurable algorithm. One
implementation could use classes:

```js
class Checkout {
    constructor(strategy) {
        this.strategy = strategy;
    }

    calculate(cart) {
        return this.strategy.calculate(cart);
    }
}
```

Another could use functions:

```js
function createCheckout(strategy) {
    return {
        calculate(cart) {
            return strategy(cart);
        }
    };
}
```

Both can express the same fundamental design relationship: a stable context depends on interchangeable behavior rather
than directly containing the varying algorithm.

The pattern therefore describes the relationship between a context and interchangeable behavior rather than prescribing
a specific class hierarchy or language construct. This distinction is particularly important in JavaScript because the
language provides multiple mechanisms for expressing the same design structure.

## Patterns Are Context-Dependent

A pattern is not universally applicable. A design becomes a candidate for a pattern when a recurring problem and its
associated constraints are present.

For example, Strategy is useful when an algorithm varies independently from the object using that behavior and the
client should remain independent of the concrete algorithm. It may be unnecessary when there is only one stable
algorithm:

```js
function calculate(cart) {
    // One stable implementation.
}
```

Introducing a strategy abstraction in that situation can add unnecessary indirection. The correct question is therefore
not which design pattern should be used, but **what design problem is being solved and whether a pattern provides an
appropriate solution**.

## The Components of a Pattern

A design pattern can be understood through several recurring elements: intent, context, problem, forces, solution,
participants, collaborations, and consequences. These elements explain not only what a pattern looks like, but why the
structure exists and when it is appropriate.

### Intent

The **intent** states what the pattern is fundamentally trying to accomplish. For example, the intent of Strategy is to
define a family of interchangeable algorithms and make them independently selectable.

Intent describes the problem at a high level without tying it to implementation details.

### Context

The **context** describes the situation in which the problem occurs. A pattern may be appropriate when behavior varies
independently from the object using that behavior, but the same pattern may be inappropriate when the behavior never
varies.

### Problem

The **problem** describes the recurring design difficulty. For example, a class may contain multiple algorithms and
become increasingly difficult to modify as those algorithms grow or change.

### Forces

**Forces** are the competing requirements, constraints, and trade-offs influencing the design. Examples include
extensibility, coupling, cohesion, performance, complexity, testability, runtime configurability, object creation,
dependency management, and API stability.

A pattern exists because a design problem usually has multiple forces that must be balanced rather than a single
requirement that can be satisfied independently.

### Solution

The **solution** describes the general arrangement of responsibilities and relationships. It does not prescribe one
exact implementation.

For example, a Strategy design separates a stable context from interchangeable implementations of variable behavior. The
exact participants and mechanisms can differ depending on the language and application.

### Participants

Participants are the conceptual elements involved in the pattern. Depending on the pattern, participants may be objects,
classes, interfaces, functions, modules, components, or collaborators.

A Strategy design commonly contains a context, a strategy abstraction or contract, and one or more concrete strategies,
although a particular implementation may express these concepts through functions or objects instead of classes.

### Collaborations

Collaborations describe how participants interact. In Strategy, for example, the context delegates the variable
operation to the selected strategy.

The pattern is defined not merely by the participants but by the relationships between them and the responsibilities
those relationships establish.

### Consequences

Every pattern has consequences. Applying a pattern can provide lower coupling, greater extensibility, improved
testability, separation of responsibilities, interchangeable behavior, controlled object creation, or reduced direct
dependencies.

It can also introduce additional abstractions, more objects, indirection, increased conceptual complexity, more files,
or additional runtime overhead in some implementations. A pattern is therefore a **trade-off**, not a free improvement.

## Patterns Solve Design Problems

Patterns generally address problems involving the organization of responsibilities and dependencies. Common problem
categories include object creation, structural composition, and behavioral organization.

Creational concerns ask how objects should be instantiated and how construction should be separated from usage.
Structural concerns ask how objects or components should be composed into larger structures. Behavioral concerns ask how
responsibilities, algorithms, and interactions should be organized.

This leads to the traditional high-level classification of **Creational**, **Structural**, and **Behavioral** patterns.
These categories are useful for organizing patterns, but they are not rigid theoretical boundaries. A pattern can
influence multiple aspects of a design.

## Creational Patterns

**Creational patterns** address object creation. The problem is often not simply:

```js
const service = new Service();
```

but rather who creates the object, which concrete implementation is created, when it is created, what dependencies it
requires, how construction can vary, and how construction can be separated from usage.

Creational patterns can decouple object construction from the code that consumes the resulting objects.

Examples include:

* Abstract Factory
* Builder
* Factory Method
* Object Pool
* Prototype
* Singleton

These patterns are covered individually in the creational-patterns section.

## Structural Patterns

**Structural patterns** address how objects and types are composed into larger structures. Typical concerns include
adapting incompatible interfaces, composing objects, adding responsibilities, simplifying complex subsystems,
controlling access, sharing data efficiently, and separating abstractions from implementations.

Examples include:

* Adapter
* Bridge
* Composite
* Decorator
* Facade
* Flyweight
* Private Class Data
* Proxy

The central concern is the structure of relationships rather than object creation itself.

## Behavioral Patterns

**Behavioral patterns** address algorithms, responsibilities, communication, and the distribution of behavior between
objects. Typical concerns include selecting algorithms, passing requests, notifying dependents, changing behavior
according to state, coordinating objects, traversing collections, encapsulating operations, and representing language
constructs.

Examples include:

* Chain of Responsibility
* Command
* Interpreter
* Iterator
* Mediator
* Memento
* Null Object
* Observer
* State
* Strategy
* Template Method
* Visitor

Behavioral patterns are primarily concerned with **who does what, when, and how collaborators communicate**.

## Patterns and Abstraction

Patterns frequently introduce abstractions to isolate variation. Consider:

```js
class ReportGenerator {
    generate(data) {
        // ...
    }
}
```

If the report format varies, the formatting behavior can be separated from the stable report-generation logic. Different
formatters can then provide PDF, HTML, CSV, or other formatting behavior.

This is one of the recurring themes across design patterns: identify what varies, separate it from what remains stable,
encapsulate the variation, and connect the stable and variable parts through an appropriate abstraction.

Different patterns apply this idea to different kinds of variation.

## Patterns and Coupling

Many patterns are fundamentally mechanisms for controlling coupling. Suppose a client directly constructs a concrete
dependency:

```js
class OrderService {
    constructor() {
        this.payment = new StripePayment();
    }
}
```

The client is directly coupled to `StripePayment`. A more flexible design can introduce the dependency from outside:

```js
class OrderService {
    constructor(payment) {
        this.payment = payment;
    }
}
```

The resulting structure allows `OrderService` to depend on a payment contract while different implementations can be
supplied, such as a production payment provider or a test implementation.

Patterns frequently establish structures like this. However, abstraction is not automatically beneficial. Excessive
abstraction can itself create unnecessary coupling between a system and its abstraction layer.

The objective is **appropriate coupling**, not zero coupling.

## Patterns and Cohesion

Patterns also influence **cohesion**. A design with high cohesion keeps closely related responsibilities together.

For example, a class containing payment processing, PDF generation, email delivery, and database persistence has
unrelated responsibilities. Applying a pattern without first identifying the responsibility boundaries will not
automatically fix the design.

Patterns work best when the underlying responsibilities have already been identified correctly. This is why design
patterns should be considered alongside design principles such as the Single Responsibility Principle, Open-Closed
Principle, Liskov Substitution Principle, Interface Segregation Principle, and Dependency Inversion Principle.

Patterns and principles operate at different levels of the design problem.

## Patterns and SOLID

SOLID principles describe desirable properties and constraints of object-oriented design. Design patterns provide
recurring structures that can help achieve those properties.

For example, Strategy encapsulates varying behavior and can support the Open-Closed Principle by allowing new behavior
to be introduced without modifying the stable context. It can also reduce conditional complexity and support Dependency
Inversion when the strategies are represented as appropriate abstractions.

Similarly, Factory Method separates object creation and can reduce direct construction dependencies, potentially
supporting the Open-Closed and Dependency Inversion principles.

A pattern does not automatically make a design SOLID. A badly implemented Strategy can still produce excessive coupling,
low cohesion, unnecessary abstractions, Liskov Substitution violations, or excessive complexity.

Patterns are tools for implementing designs. Principles remain criteria by which the resulting design should be
evaluated.

## Patterns and Composition

Patterns are not restricted to inheritance-based object-oriented designs. Many patterns can be expressed through
composition.

For example, Strategy can be represented directly with functions in JavaScript:

```js
const regularPricing = cart => {
    return cart.total;
};

const discountedPricing = cart => {
    return cart.total * 0.9;
};

function calculateTotal(cart, pricingStrategy) {
    return pricingStrategy(cart);
}
```

The essential relationship remains the same: `calculateTotal` delegates the varying algorithm to an interchangeable
strategy.

The design pattern is present at the level of **relationships and responsibilities**, even though there are no classes.

This is especially relevant to JavaScript because the language supports first-class functions, objects, prototypes,
classes, modules, closures, higher-order functions, and composition. A JavaScript implementation of a pattern therefore
does not necessarily resemble a traditional Java implementation of the same pattern.

## Patterns Are Not Frameworks

A framework is an implementation platform that provides reusable infrastructure and defines significant aspects of
application structure. A design pattern is a conceptual design solution.

A framework may internally use many design patterns, including Factory, Strategy, Observer, Decorator, Proxy, and
dependency injection structures, while presenting developers with a higher-level API.

Patterns therefore exist at a more abstract level than frameworks.

## Patterns Are Not Libraries

A library provides reusable implementation. For example:

```js
import something from "some-library";
```

A pattern provides a design concept that can be implemented or instantiated according to the application's requirements.

A useful distinction is:

* **Library:** reusable code.
* **Framework:** reusable infrastructure combined with application structure.
* **Pattern:** reusable design solution.

A pattern may lead to reusable code, but the pattern itself is not the code.

## Patterns Are Not Algorithms

An algorithm defines a computational procedure for transforming input into output. Examples include Binary Search, Merge
Sort, and Dijkstra's Algorithm.

A design pattern defines a structural or behavioral organization of software components. Examples include Strategy,
Observer, and Decorator.

The distinction is therefore between **how a computation is performed** and **how responsibilities and relationships are
organized to solve a recurring design problem**.

An algorithm can be encapsulated inside a design pattern. Strategy, for example, can encapsulate multiple sorting
algorithms. The algorithms and the Strategy pattern remain separate concepts.

## Patterns Are Not Rules

A pattern is not a rule that should always be applied. Statements such as "Always use Factory" or "Always use dependency
injection" are overly prescriptive.

A factory may be appropriate when object creation has become a separate design concern that benefits from isolation.
Dependency injection may be appropriate when externally supplied dependencies provide meaningful flexibility, testing
benefits, or lifecycle control.

The appropriate design depends on factors such as complexity, volatility, coupling, lifecycle, testing requirements,
runtime configuration, system boundaries, and maintenance requirements.

Patterns should be introduced when the problem justifies the abstraction.

## Pattern Vocabulary

One of the practical benefits of design patterns is that they establish a shared vocabulary. Instead of describing an
entire design as an object that wraps another object, implements the same interface, intercepts calls, and adds behavior
before delegating, developers can identify the design as a **Decorator**.

Similarly, developers can say that a design uses an Adapter, that varying behavior should be moved into a Strategy, that
construction should be isolated behind a Factory, that a subsystem should be exposed through a Facade, or that dependent
consumers should be notified through an Observer.

Pattern terminology therefore functions as a form of **design-level communication**.

The terminology is useful only when the implementation actually corresponds to the underlying pattern. Using pattern
names as arbitrary labels reduces their value.

## Pattern Classification

The repository organizes patterns into three primary categories.

### Creational Patterns

* Abstract Factory
* Builder
* Factory Method
* Object Pool
* Prototype
* Singleton

### Structural Patterns

* Adapter
* Bridge
* Composite
* Decorator
* Facade
* Flyweight
* Private Class Data
* Proxy

### Behavioral Patterns

* Chain of Responsibility
* Command
* Interpreter
* Iterator
* Mediator
* Memento
* Null Object
* Observer
* State
* Strategy
* Template Method
* Visitor

The categories provide organizational context rather than strict theoretical boundaries.

## Pattern Selection

Pattern selection should begin with the design problem. A practical process is to identify the design problem, determine
what varies, identify the constraints and forces, understand the dependencies and responsibilities, consider simpler
designs first, select a pattern if it addresses the actual problem, and then evaluate its consequences.

For example, if several algorithms vary independently, the relevant question is whether the algorithm should be
separated from the object that uses it. Strategy may then be an appropriate solution.

If two independently varying dimensions are tightly coupled, Bridge may be worth considering. If an existing component
has an incompatible interface, Adapter may be appropriate.

The pattern follows the problem. The problem should not be manufactured to justify the pattern.

## Pattern Selection by Design Concern

A useful first-level mapping is:

| Design concern                                                   | Possible pattern        |
|------------------------------------------------------------------|-------------------------|
| Complex object construction                                      | Builder                 |
| Selecting concrete products                                      | Factory Method          |
| Creating related product families                                | Abstract Factory        |
| Reusing or cloning existing object structures                    | Prototype               |
| Sharing expensive reusable instances                             | Object Pool             |
| Controlling a single shared instance                             | Singleton               |
| Converting an incompatible interface                             | Adapter                 |
| Separating independent abstraction and implementation dimensions | Bridge                  |
| Representing part-whole hierarchies                              | Composite               |
| Dynamically adding responsibilities                              | Decorator               |
| Simplifying access to a subsystem                                | Facade                  |
| Sharing intrinsic state                                          | Flyweight               |
| Controlling access to another object                             | Proxy                   |
| Passing a request through potential handlers                     | Chain of Responsibility |
| Encapsulating an operation as an object                          | Command                 |
| Traversing a collection without exposing representation          | Iterator                |
| Centralizing complex object communication                        | Mediator                |
| Capturing and restoring state                                    | Memento                 |
| Representing absence with an object                              | Null Object             |
| Notifying dependent objects                                      | Observer                |
| Changing behavior according to state                             | State                   |
| Encapsulating interchangeable algorithms                         | Strategy                |
| Defining an algorithm skeleton with variable steps               | Template Method         |
| Separating operations from object structures                     | Visitor                 |

This mapping is a starting point, not a decision procedure. Multiple patterns can solve related problems, and sometimes
no pattern is necessary.

## Pattern Combinations

Patterns are often combined. A real system may use a Factory to create a Strategy, a Service to consume that Strategy, a
Decorator to wrap the Service, and a Facade to expose the resulting subsystem through a simpler API.

There is nothing inherently wrong with combining patterns. The important question is whether each abstraction represents
a real design concern.

Pattern combinations become problematic when every small class is assigned a pattern merely because a pattern name
exists for it. Good architecture is not the architecture containing the largest number of patterns.

## Patterns and Refactoring

Patterns can emerge naturally through refactoring. A system may initially contain:

```js
function calculate(type, cart) {
    if (type === "regular") {
        // ...
    } else if (type === "discount") {
        // ...
    } else if (type === "premium") {
        // ...
    }
}
```

As the algorithms become independently variable, they can be extracted:

```js
const strategies = {
    regular: regularPricing,
    discount: discountedPricing,
    premium: premiumPricing
};

function calculate(type, cart) {
    return strategies[type](cart);
}
```

The resulting design expresses the essential Strategy relationship without necessarily requiring Strategy classes.

Patterns can therefore be viewed as **design structures that can emerge from refactoring**, rather than structures that
must always be designed upfront.

## Patterns and Overengineering

Pattern application has a cost. Consider a trivial operation:

```js
function add(a, b) {
    return a + b;
}
```

Creating an `AdditionStrategy`, `AdditionStrategyFactory`, `AdditionStrategyProvider`, `AdditionContext`, and
`AdditionConfiguration` would introduce abstraction without solving a meaningful design problem.

This is commonly called **pattern overuse** or **overengineering**.

Warning signs include:

* abstractions with only one implementation and no meaningful variation,
* interfaces that merely mirror one concrete class,
* factories that only call `new`,
* wrappers that add no meaningful behavior,
* excessive indirection,
* class hierarchies created solely to match a pattern structure,
* pattern names driving architecture instead of actual requirements.

A pattern should reduce a meaningful design problem, not create one.

## Patterns and Abstraction Cost

Every abstraction has a cost. A direct dependency such as:

```text
A → B
```

may become an abstraction layer between the two components, and further patterns may introduce factories, facades,
proxies, decorators, or additional dependency boundaries.

Each additional layer can provide a legitimate architectural benefit, but it can also make the system harder to
understand.

The relevant trade-offs are therefore **flexibility versus complexity** and **decoupling versus indirection**. Patterns
are valuable when the flexibility or decoupling they provide justifies the additional complexity.

## Patterns in JavaScript

JavaScript changes how many traditional patterns are implemented. Traditional object-oriented examples frequently rely
on interfaces, abstract classes, concrete classes, inheritance, and virtual methods. JavaScript provides alternatives
including objects, functions, closures, prototypes, classes, modules, higher-order functions, first-class functions, and
composition.

For example, Strategy can be expressed directly as functions:

```js
const strategies = {
    regular: cart => cart.total,
    discount: cart => cart.total * 0.9
};

function calculateTotal(cart, strategy) {
    return strategy(cart);
}
```

A Factory can be a function:

```js
function createLogger(type) {
    if (type === "console") {
        return consoleLogger();
    }

    if (type === "file") {
        return fileLogger();
    }

    throw new Error(`Unknown logger: ${type}`);
}
```

A module can provide encapsulation that would traditionally be expressed through a class hierarchy. A closure can
provide state encapsulation. Composition can replace inheritance.

Consequently, JavaScript pattern implementations should follow the language rather than mechanically reproduce examples
from class-oriented languages.

## Structural Typing and Duck Typing

JavaScript commonly relies on **duck typing**. A consumer may care about an object's capabilities rather than its
declared type:

```js
function render(renderer) {
    renderer.render();
}
```

Any object satisfying the expected behavioral contract can be passed:

```js
render({
    render() {
        console.log("Rendering");
    }
});
```

Many pattern relationships in JavaScript are therefore structural rather than nominal.

TypeScript makes this even more explicit through structural typing:

```ts
interface Logger {
    log(message: string): void;
}

function process(logger: Logger) {
    logger.log("Processing");
}
```

An object does not need to explicitly declare `implements Logger` to satisfy the interface structurally.

This makes pattern concepts particularly natural in JavaScript and TypeScript.

## Patterns and Runtime Behavior

A pattern describes design relationships, but implementation details can affect runtime characteristics. Adding layers
such as Proxy, Decorator, Facade, or Adapter can introduce additional function calls and object boundaries.

In most application code, these costs are insignificant compared with the maintainability benefits when the abstraction
is justified. In performance-critical code, however, the consequences should be measured rather than assumed.

The pattern itself does not guarantee particular performance characteristics.

## Patterns and Maintainability

A well-applied pattern can improve maintainability by making variation and responsibility explicit.

For example, a Checkout component may initially contain payment logic, discount logic, tax logic, shipping logic, and
notification logic. A more decomposed design can separate those concerns into appropriately scoped strategies, policies,
and services.

The resulting system may be easier to modify because each concern has a clearer boundary. However, decomposition should
follow actual volatility and responsibility boundaries. Splitting every operation into its own abstraction does not
inherently improve maintainability.

## Patterns and Testability

Patterns can improve testability by separating responsibilities and dependencies. For example:

```js
class OrderService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    checkout(order) {
        return this.paymentGateway.charge(order.total);
    }
}
```

A test can provide a test implementation:

```js
const paymentGateway = {
    charge(amount) {
        return {success: true, amount};
    }
};

const service = new OrderService(paymentGateway);
```

The underlying design is related to dependency inversion and dependency injection rather than to one specific GoF
pattern.

Patterns should therefore not be treated as isolated techniques. They participate in broader design structures.

## Pattern Misuse

Several recurring mistakes occur when applying patterns.

### Pattern First, Problem Second

The bad approach is to begin with a desired pattern and search for a problem that justifies it. A better approach is to
identify the actual variation or design difficulty first and then consider whether a pattern addresses it.

### Mechanical Translation

A common mistake is to copy a Java implementation into JavaScript with abstract classes, concrete subclasses,
interfaces, and inheritance even when JavaScript could express the same design more directly through functions or
composition.

The resulting code may technically implement the pattern while still being poor JavaScript.

### Pattern Everywhere

Not every `if` statement requires Strategy. Not every `new` expression requires Factory. Not every wrapper is a
Decorator. Not every singleton-looking object requires the Singleton pattern.

The pattern must correspond to an actual recurring design relationship.

### Confusing Similar Patterns

Some patterns solve closely related problems and may therefore look superficially similar.

* **Adapter:** changes or translates an interface so incompatible components can work together.
* **Decorator:** adds responsibilities while preserving the wrapped object's interface.
* **Proxy:** controls access to another object.
* **Facade:** provides a simplified interface to a subsystem.

The implementation may involve object wrapping in all four cases, but their intents and responsibilities differ.

### Treating Pattern Structures as Requirements

Pattern structures describe general solutions; they are not mandatory architecture templates. A real implementation can
omit participants that are unnecessary for the particular context.

For example, a Strategy implementation does not require three concrete strategy classes. It requires meaningful
interchangeable behavior.

## How to Evaluate a Pattern

When considering a pattern, ask:

* What problem does it solve?
* What is actually varying?
* What must remain stable?
* What dependencies exist?
* What assumptions do clients make?
* What coupling does the pattern remove?
* What abstraction does it introduce?
* What complexity does it add?
* What are the consequences if the system does not use it?
* Would a simpler design solve the problem?

If these questions do not reveal a meaningful design problem, introducing the pattern is probably unnecessary.

## Pattern Application Process

A disciplined pattern-selection process begins by identifying the problem, responsibilities, variation, dependencies,
constraints, and forces. A simple direct design should then be considered before candidate patterns are evaluated.

If a pattern is selected, the smallest appropriate abstraction should be implemented and its consequences evaluated. If
the abstraction later proves unnecessary, it should be removed through refactoring.

The objective is not to maximize pattern usage. The objective is to produce a design whose structure makes important
decisions and variations explicit.

## Patterns as Design Knowledge

The primary value of a pattern is the design knowledge encoded in it. A pattern captures the relationship between a
problem, its context, the forces acting on the design, a general solution, and the consequences of that solution.

This allows developers to reason about a design using established concepts instead of rediscovering the same structures
independently.

Patterns therefore form a vocabulary for discussing software architecture at the design level.

## Relationship to the Pattern Catalog

This document provides the conceptual foundation for the individual pattern categories.

Creational patterns focus on object construction and lifecycle. Structural patterns focus on object and component
composition. Behavioral patterns focus on responsibilities, algorithms, and communication.

Each individual pattern should be understood in terms of its intent, problem, context, structure, participants,
collaborations, implementation, consequences, trade-offs, use cases, and misuse.

The individual pattern files focus on their specific design problems and solutions rather than repeating the general
definition of design patterns.

## Summary

A design pattern is a reusable description of a recurring software design solution. Patterns describe design structures
rather than finished implementations, address recurring problems within particular contexts, identify forces and
trade-offs, and organize responsibilities and relationships.

Patterns can reduce coupling, isolate variation, and support principles such as SOLID, but they are not algorithms,
libraries, frameworks, or mandatory rules. They can be implemented differently across programming languages and are
especially flexible in JavaScript because of functions, objects, prototypes, closures, modules, and composition.

Patterns should be selected because a real design problem exists. The fundamental workflow is to identify the problem
and its context, understand the constraints and variation, consider the responsibilities and dependencies, evaluate
simpler alternatives, apply an appropriate pattern when justified, and evaluate its consequences.

A pattern is successful when it improves the design for the problem at hand—not when the code merely resembles a pattern
structure.

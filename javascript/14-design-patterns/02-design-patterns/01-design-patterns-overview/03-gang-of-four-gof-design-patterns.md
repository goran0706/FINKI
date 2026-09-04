# Gang of Four (GoF) Design Patterns

The **Gang of Four (GoF) design patterns** are a catalog of 23 object-oriented software design patterns documented in
the book *Design Patterns: Elements of Reusable Object-Oriented Software*, published in 1994 by **Erich Gamma, Richard
Helm, Ralph Johnson, and John Vlissides**.

The four authors are commonly referred to as the **Gang of Four**, abbreviated **GoF**. The catalog became one of the
most influential references for object-oriented software design because it established a shared vocabulary for recurring
design problems and documented reusable structures for addressing them.

The 23 patterns are divided into three categories:

| Category   | Patterns                                                                                                                        |
|------------|---------------------------------------------------------------------------------------------------------------------------------|
| Creational | Abstract Factory, Builder, Factory Method, Prototype, Singleton                                                                 |
| Structural | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy                                                                 |
| Behavioral | Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor |

The catalog is a **classification of reusable design solutions**, not a complete list of all software design patterns.

## The GoF Book

The GoF catalog comes from *Design Patterns: Elements of Reusable Object-Oriented Software*. The book was published in
1994 by Addison-Wesley.

Its authors were:

* Erich Gamma
* Richard Helm
* Ralph Johnson
* John Vlissides

The book consolidated and formalized a large body of object-oriented design knowledge into a single catalog. The
patterns were not invented from nothing by the four authors. Many represented design practices and ideas that already
existed in software engineering. The contribution of the book was to systematically document, name, classify, and
explain them.

## Why the GoF Catalog Matters

The primary importance of the GoF catalog is not that every modern system should implement all 23 patterns. Its
importance is that it established a widely recognized **design vocabulary**.

For example, saying **"Use an Adapter"** communicates that an existing interface is incompatible with the interface
expected by a client and that an intermediary should translate between those interfaces. Similarly, **"Use Strategy"**
suggests that a family of algorithms varies independently from the object that uses them and that those algorithms
should be encapsulated behind a common abstraction.

The names allow developers to discuss design structures without describing every relationship from scratch. This makes
design discussions more precise because the pattern name provides shorthand for a known combination of intent,
relationships, responsibilities, and trade-offs.

## The Three GoF Categories

The GoF catalog divides the patterns into **Creational**, **Structural**, and **Behavioral** categories. These
categories represent broad areas of design concern rather than strict architectural boundaries.

### Creational Patterns

Creational patterns concern **object creation mechanisms**. They address questions such as how objects should be
created, which component should create them, how clients can avoid depending directly on concrete classes, how object
construction can vary, and how complex construction can be controlled.

The five GoF creational patterns are:

1. Abstract Factory
2. Builder
3. Factory Method
4. Prototype
5. Singleton

### Structural Patterns

Structural patterns concern **the composition of classes and objects**. They address questions such as how incompatible
interfaces can work together, how objects can be composed into larger structures, how responsibilities can be added
dynamically, how access to an object can be controlled, and how complex subsystems can be simplified.

The seven GoF structural patterns are:

1. Adapter
2. Bridge
3. Composite
4. Decorator
5. Facade
6. Flyweight
7. Proxy

### Behavioral Patterns

Behavioral patterns concern **algorithms, responsibilities, and communication between objects**. They address questions
such as how responsibilities should be distributed, how objects should communicate, how algorithms can vary
independently, how behavior should change according to state, and how operations can be represented independently from
the objects that execute them.

The eleven GoF behavioral patterns are:

1. Chain of Responsibility
2. Command
3. Interpreter
4. Iterator
5. Mediator
6. Memento
7. Observer
8. State
9. Strategy
10. Template Method
11. Visitor

## The 23 GoF Patterns

### Abstract Factory

**Category:** Creational

**Intent:** Provide an interface for creating families of related or dependent objects without specifying their concrete
classes.

The pattern is useful when products must be created as compatible families. Typical application domains include UI
component families, database-driver families, platform-specific components, and cloud-provider-specific resources.

Detailed implementation belongs in the dedicated Abstract Factory file.

### Builder

**Category:** Creational

**Intent:** Separate the construction of a complex object from its representation so that the same construction process
can create different representations.

Builder is useful when construction involves many configuration steps, optional components, validation, multiple
representations, or ordered construction operations. The essential concern is **complex construction**, not simply
avoiding a long constructor.

### Factory Method

**Category:** Creational

**Intent:** Define an interface for creating an object while allowing subclasses or implementations to determine which
concrete object is created.

The pattern separates object creation from the rest of the creator's logic. Factory Method is distinct from a generic
factory function. The GoF pattern has a more specific relationship involving a creation method and the creator
abstraction.

### Prototype

**Category:** Creational

**Intent:** Create new objects by copying an existing prototype.

The pattern is useful when object creation is expensive, an object's configuration should be copied, the concrete type
should be determined dynamically, or instances are easier to clone than construct from scratch.

JavaScript's native prototype system is related to the term "prototype," but JavaScript's prototype-based object model
should not automatically be equated with the GoF Prototype pattern.

### Singleton

**Category:** Creational

**Intent:** Ensure a class has only one instance and provide a global point of access to it.

The pattern controls instance creation and access. However, Singleton introduces global shared state and therefore has
significant trade-offs involving coupling, lifecycle, testing, and concurrency.

The existence of a single object in a program does not automatically mean the GoF Singleton pattern is being used.

## Structural Patterns

### Adapter

**Category:** Structural

**Intent:** Convert the interface of a class into another interface expected by clients.

Adapter isolates interface incompatibility. Typical applications include legacy APIs, third-party SDKs, external
services, and incompatible internal components.

### Bridge

**Category:** Structural

**Intent:** Decouple an abstraction from its implementation so that the two can vary independently.

Bridge is particularly useful when there are two independent dimensions of variation. For example, a rendering system
might vary independently across different shapes and rendering technologies. Without separation, the combinations of
those dimensions can produce a growing class matrix. Bridge separates the dimensions so that each can evolve
independently.

### Composite

**Category:** Structural

**Intent:** Compose objects into tree structures and allow clients to treat individual objects and compositions
uniformly.

Typical examples include file systems, UI component trees, document structures, organization hierarchies, and expression
trees. The central concept is **part-whole composition**.

### Decorator

**Category:** Structural

**Intent:** Attach additional responsibilities to an object dynamically.

Decorators preserve a compatible interface while adding behavior. Typical uses include logging, caching, authorization,
metrics, compression, and validation.

Decorator is composition-based and is particularly useful when responsibilities can be combined dynamically.

### Facade

**Category:** Structural

**Intent:** Provide a unified and simplified interface to a set of interfaces in a subsystem.

The Facade reduces the amount of subsystem knowledge required by clients. It does not necessarily hide every subsystem
operation. Instead, it provides a simpler entry point for common use cases.

### Flyweight

**Category:** Structural

**Intent:** Use sharing to support large numbers of fine-grained objects efficiently.

The pattern separates state into **intrinsic state**, which can be shared, and **extrinsic state**, which is supplied by
the client or surrounding context.

Flyweight is useful when large numbers of similar objects would otherwise duplicate shared state. Memory optimization is
the primary motivation.

### Proxy

**Category:** Structural

**Intent:** Provide a surrogate or placeholder for another object to control access to it.

A proxy can provide access control, lazy initialization, remote access, caching, logging, request validation, or
resource management. The defining characteristic is **controlled access to another object**.

## Behavioral Patterns

### Chain of Responsibility

**Category:** Behavioral

**Intent:** Pass a request along a chain of handlers until one handles it.

Each handler can either handle the request or delegate it to the next handler. The sender does not need to know which
handler ultimately processes the request.

### Command

**Category:** Behavioral

**Intent:** Encapsulate a request as an object, allowing the request to be parameterized, stored, queued, logged, or
otherwise manipulated independently of its execution.

Commands can support queues, undo/redo, transactions, logging, scheduling, and macro operations. The important design
decision is separating the representation of an operation from the object that performs it.

### Interpreter

**Category:** Behavioral

**Intent:** Define a representation for a language's grammar and provide an interpreter for sentences in that language.

Interpreter is particularly applicable when a simple language or grammar must be evaluated. Examples include filtering
expressions, rule languages, query fragments, configuration expressions, and domain-specific languages.

It is less appropriate for large or sophisticated programming languages, where dedicated parsing and execution
infrastructure is generally more appropriate.

### Iterator

**Category:** Behavioral

**Intent:** Provide a way to access the elements of an aggregate object sequentially without exposing its underlying
representation.

JavaScript has native iteration protocols:

```js
const iterator = collection[Symbol.iterator]();

iterator.next();
```

Therefore, JavaScript's built-in iterators can directly express the underlying design concept. The GoF pattern remains
useful as a conceptual model even when the language provides native support.

### Mediator

**Category:** Behavioral

**Intent:** Define an object that encapsulates how a set of objects interact, reducing direct dependencies between the
participants.

Without a mediator, participants may accumulate direct dependencies on one another. A mediator centralizes their
coordination so that participants communicate through the mediator rather than maintaining a dense network of direct
relationships.

The trade-off is that the mediator itself can become overly complex if it accumulates too much application logic.

### Memento

**Category:** Behavioral

**Intent:** Capture and externalize an object's internal state so that it can later be restored without violating
encapsulation.

Typical uses include undo systems, snapshots, state restoration, transactional rollback, and editors. The important
concern is preserving state without exposing the internal representation unnecessarily.

### Observer

**Category:** Behavioral

**Intent:** Define a one-to-many dependency so that when one object changes state, its dependents are notified
automatically.

The pattern establishes a notification relationship. Typical applications include event systems, UI updates, reactive
systems, domain events, and publish/subscribe mechanisms.

The exact implementation can use callbacks, event emitters, message brokers, or other mechanisms.

### State

**Category:** Behavioral

**Intent:** Allow an object to alter its behavior when its internal state changes so that the object appears to change
its class.

State differs from Strategy primarily in intent. Strategy selects among interchangeable behaviors, whereas State
represents behavior that changes according to the object's current state.

Both can use similar implementation structures, but they represent different design problems.

### Strategy

**Category:** Behavioral

**Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable.

Strategy is useful when an algorithm varies independently from the object using it. JavaScript can express Strategy
directly with functions:

```js
function calculateTotal(cart, pricingStrategy) {
    return pricingStrategy(cart);
}
```

A class hierarchy is not required.

### Template Method

**Category:** Behavioral

**Intent:** Define the skeleton of an algorithm in a base class while allowing subclasses to redefine certain steps
without changing the algorithm's structure.

Template Method therefore relies heavily on inheritance in its traditional GoF form. This distinguishes it from
Strategy, which uses composition and interchangeable behavior rather than inheritance and a fixed algorithm skeleton.

### Visitor

**Category:** Behavioral

**Intent:** Represent an operation to be performed on elements of an object structure so that new operations can be
defined without changing the element classes.

Visitor is particularly useful when the object structure is stable but operations performed on that structure change
frequently. The pattern can reduce the cost of adding new operations while increasing complexity around adding new
element types.

## Pattern Relationships

The GoF patterns are not isolated techniques. Several patterns are closely related and can have similar implementation
structures while addressing different problems.

Strategy and State can both encapsulate behavior behind interchangeable objects. The distinction is primarily intent:
**Strategy asks which algorithm should be used, while State asks which behavior should apply given the current state.**

Adapter and Facade can both wrap other objects or systems, but their purposes differ. **Adapter translates an
incompatible interface, while Facade simplifies a complex interface.**

Decorator and Proxy can both wrap an object while preserving a compatible interface, but **Decorator adds
responsibilities whereas Proxy controls access**.

These distinctions matter because pattern identification should be based on intent and context rather than superficial
structural similarity.

## Creational Pattern Relationships

The GoF creational patterns address different aspects of construction:

| Pattern          | Primary concern                              |
|------------------|----------------------------------------------|
| Abstract Factory | Create related product families              |
| Builder          | Construct complex objects step by step       |
| Factory Method   | Delegate product creation to a method        |
| Prototype        | Create objects by cloning existing instances |
| Singleton        | Control creation so only one instance exists |

They should not be treated as interchangeable forms of a generic factory. Each addresses a different creation problem.

## Structural Pattern Relationships

Structural patterns can be differentiated by the relationship they establish:

| Pattern   | Primary concern                           |
|-----------|-------------------------------------------|
| Adapter   | Interface conversion                      |
| Bridge    | Abstraction and implementation separation |
| Composite | Part-whole hierarchy                      |
| Decorator | Dynamic responsibility addition           |
| Facade    | Subsystem simplification                  |
| Flyweight | State sharing                             |
| Proxy     | Access control                            |

Several patterns involve wrappers, but wrapping an object is not sufficient to identify the pattern. The purpose of the
wrapper determines the pattern.

## Behavioral Pattern Relationships

Behavioral patterns can be distinguished by what they organize:

| Pattern                 | Primary concern                   |
|-------------------------|-----------------------------------|
| Chain of Responsibility | Request handling                  |
| Command                 | Operations as objects             |
| Interpreter             | Language interpretation           |
| Iterator                | Collection traversal              |
| Mediator                | Object coordination               |
| Memento                 | State capture                     |
| Observer                | Change notification               |
| State                   | State-dependent behavior          |
| Strategy                | Interchangeable algorithms        |
| Template Method         | Algorithm skeleton                |
| Visitor                 | Operations over object structures |

This classification helps identify candidate patterns based on the actual design problem.

## Pattern Intent Is More Important Than Structure

Two patterns can have similar implementation structures but different intents. A wrapper around another object, for
example, could represent an Adapter, Decorator, Proxy, or Facade depending on what the wrapper is intended to
accomplish.

Pattern identification should therefore follow the relationship between the **problem, intent, participants, and
resulting responsibilities** rather than simply matching implementation shapes to pattern names.

This prevents superficial pattern matching, where a developer identifies a pattern solely because the code happens to
resemble one of its traditional class diagrams.

## GoF Patterns and Inheritance

The original catalog was strongly influenced by class-based object-oriented programming. Several patterns make
substantial use of inheritance, particularly Factory Method and Template Method. Others can use inheritance but do not
fundamentally require it, including Adapter, Composite, Decorator, Strategy, and State.

Modern software frequently prefers composition where it provides better flexibility and lower coupling. JavaScript makes
this especially relevant because behavior can be represented directly through functions, objects, closures, modules,
composition, prototypes, and classes.

A modern JavaScript implementation should therefore preserve the **design intent** of a GoF pattern rather than
mechanically reproduce its original class-oriented structure.

## GoF Patterns and JavaScript

The GoF catalog predates modern JavaScript by several years and was written primarily in the context of class-based
object-oriented languages.

JavaScript provides language features that can express many of the same concepts more directly. Strategy, for example,
can be implemented using functions or a lookup table:

```js
const strategies = {
    standard: order => calculateStandard(order),
    premium: order => calculatePremium(order)
};

function checkout(order, strategy) {
    return strategies[strategy](order);
}
```

A traditional class-oriented implementation might instead define:

```js
class StandardStrategy {
    execute(order) {
        return calculateStandard(order);
    }
}

class PremiumStrategy {
    execute(order) {
        return calculatePremium(order);
    }
}
```

Both can express the same underlying strategy relationship. The first may be more idiomatic when behavior is naturally
represented as a function.

## Native Language Features Can Replace Pattern Implementations

Modern languages frequently provide language constructs that directly address problems for which patterns were
historically useful.

JavaScript provides:

* First-class functions
* Closures
* Modules
* Promises
* `async`/`await`
* Iterators
* Generators
* Proxies
* Private class fields
* Symbols
* WeakMaps

Some of these reduce the need for traditional pattern implementations.

For example, JavaScript's `Proxy` object provides a native mechanism for implementing proxy-like behavior:

```js
const proxy = new Proxy(target, {
    get(target, property) {
        return target[property];
    }
});
```

Likewise, native iterators and generators can directly express iteration abstractions.

This does not make the GoF concepts obsolete. It means that the language may provide the mechanism directly, allowing
the developer to express the underlying design with less ceremony.

## GoF Patterns Are Not a Complete Pattern Catalog

The 23 GoF patterns are not the complete set of design patterns. Other pattern catalogs and pattern families exist,
including:

* Architectural patterns
* Enterprise application patterns
* Concurrency patterns
* Integration patterns
* Distributed-system patterns
* Language-specific patterns
* UI patterns
* Functional programming patterns
* JavaScript patterns
* Performance patterns

The GoF catalog is best understood as a foundational catalog of **object-oriented design patterns**, not as a universal
taxonomy of all reusable software designs.

## GoF Patterns and Architectural Patterns

The scope of GoF patterns is generally smaller than architectural patterns.

A GoF pattern might organize objects, classes, responsibilities, and collaborations. An architectural pattern might
organize applications, components, services, layers, deployment boundaries, data flow, and communication boundaries.

For example, Strategy is a GoF design pattern, whereas Layered Architecture is an architectural pattern. They operate at
different levels and can nevertheless be combined.

A service-oriented architecture may internally use Adapter, Facade, Strategy, Factory, Observer, or Command. The
architectural structure and internal design patterns are complementary rather than competing classifications.

## GoF Patterns and Design Principles

The GoF patterns should be understood together with general design principles.

For example, Strategy, Decorator, and Factory Method can provide structures that support the Open-Closed Principle.
Strategy, Abstract Factory, Bridge, and Adapter can help establish dependency boundaries related to Dependency
Inversion. Command, Strategy, and Decorator can help isolate distinct responsibilities in accordance with the Single
Responsibility Principle.

These relationships are not one-to-one. A pattern may support multiple design principles, and a principle can be
realized without any GoF pattern.

## GoF Patterns and Refactoring

Patterns can be introduced through refactoring. A codebase may initially contain a recurring problem without an explicit
abstraction, and refactoring can transform that structure into a recognizable pattern.

For example, a large conditional containing multiple independently varying algorithms may be refactored into a Strategy
structure. Repeated construction logic may motivate a Factory, while scattered translation logic for an external API may
be isolated behind an Adapter.

Patterns can therefore represent **stable destinations of refactoring**, not only structures designed from the
beginning.

## Pattern Names Should Communicate Intent

A class should not be called `Strategy`, `Factory`, `Manager`, `Handler`, or `Adapter` simply because the name sounds
architectural. The implementation should actually express the corresponding design intent.

For example, `PaymentStrategy` should represent interchangeable payment behavior. If it is simply a service containing
payment logic, calling it a Strategy does not make it one.

Pattern terminology should describe genuine design relationships.

## The GoF Catalog as a Vocabulary

The most durable contribution of the GoF catalog is its vocabulary.

A team can communicate at several levels. At the implementation level, developers might say that one object delegates to
another. At the design level, they might say that the object uses Strategy. At the architectural level, they might say
that the payment implementation is isolated behind an abstraction.

The pattern name provides a compact shorthand for a known design structure. This allows discussions to focus on why the
pattern is appropriate, what trade-offs it introduces, where the abstraction boundary belongs, and what alternatives
exist rather than repeatedly describing the basic structure.

## Pattern Classification Is Not a Prescription

The GoF categories should not be interpreted as architectural rules.

Not every object-creation problem requires a creational pattern, and not every behavioral problem requires a behavioral
pattern. The classification is primarily organizational: it helps developers search for relevant design solutions.

A design should still begin with the actual problem rather than with the desire to apply a particular category of
pattern.

## Common Misinterpretations

### GoF Means All Design Patterns

It does not. GoF refers specifically to the catalog documented by the four authors and commonly means the 23 patterns in
that catalog. There are many other pattern catalogs and pattern families.

### Every Pattern Must Use Classes

It does not. The original catalog is strongly object-oriented, but modern languages can express the same concepts using
functions, objects, composition, modules, closures, and language-level features.

### Pattern Names Define Architecture

They do not. A system can contain Strategy, Adapter, and Factory without having a coherent architecture. Patterns solve
specific design problems, while architecture defines larger system structure.

### More Patterns Mean Better Design

They do not. Patterns introduce abstractions and therefore introduce complexity. A simpler design is preferable when it
adequately solves the problem.

### GoF Patterns Are Outdated

This is an oversimplification. Some implementation techniques described in the original book are less necessary when
modern languages provide equivalent language features. The underlying design problems remain common.

Interchangeable algorithms, interface adaptation, object composition, controlled access, state-dependent behavior, and
object creation remain fundamental software design concerns. Modern languages simply provide different mechanisms for
addressing them.

## A Practical GoF Selection Model

A practical way to approach the catalog is to classify the problem first.

If the main problem concerns **object creation**, consider creational patterns. If it concerns **object or component
structure**, consider structural patterns. If it concerns **behavior or communication**, consider behavioral patterns.

Then identify the more specific concern:

| Category  | Problem                    | Candidate pattern       |
|-----------|----------------------------|-------------------------|
| Creation  | Complex construction       | Builder                 |
| Creation  | Product families           | Abstract Factory        |
| Creation  | Creation delegation        | Factory Method          |
| Creation  | Cloning                    | Prototype               |
| Creation  | Single instance            | Singleton               |
| Structure | Interface mismatch         | Adapter                 |
| Structure | Independent dimensions     | Bridge                  |
| Structure | Tree structure             | Composite               |
| Structure | Added responsibilities     | Decorator               |
| Structure | Simplified subsystem       | Facade                  |
| Structure | Shared state               | Flyweight               |
| Structure | Controlled access          | Proxy                   |
| Behavior  | Request chain              | Chain of Responsibility |
| Behavior  | Encapsulated operation     | Command                 |
| Behavior  | Language grammar           | Interpreter             |
| Behavior  | Traversal                  | Iterator                |
| Behavior  | Centralized coordination   | Mediator                |
| Behavior  | State snapshots            | Memento                 |
| Behavior  | Notification               | Observer                |
| Behavior  | State-dependent behavior   | State                   |
| Behavior  | Interchangeable algorithms | Strategy                |
| Behavior  | Algorithm skeleton         | Template Method         |
| Behavior  | Operations over structures | Visitor                 |

This is a candidate-selection aid, not a mandatory decision tree. The actual problem, forces, constraints, and
trade-offs still determine whether a pattern is appropriate.

## GoF Pattern Trade-offs

Every GoF pattern has consequences.

Typical benefits include:

* Reduced coupling
* Better separation of concerns
* Encapsulated variation
* Improved extensibility
* Explicit responsibilities
* Reusable design vocabulary

Typical costs include:

* More abstractions
* More indirection
* More objects
* More code
* Greater conceptual overhead
* Additional maintenance

The correct evaluation is therefore whether the pattern solves a real problem well enough to justify its complexity.

## The GoF Catalog in Modern Software

Modern software development has changed significantly since 1994. Contemporary systems frequently use functional
programming, dependency injection, modules, event-driven systems, reactive programming, distributed systems,
microservices, cloud infrastructure, message brokers, and serverless architectures.

These introduce design problems beyond the scope of the original GoF catalog. Nevertheless, many GoF concepts remain
embedded within modern systems.

For example, an event-driven system may contain an Observer-like notification mechanism, an API integration may use an
Adapter, a service gateway may provide a Facade, a request-processing pipeline may resemble Chain of Responsibility, a
configurable algorithm may use Strategy, and a command queue may use Command.

The names and implementations may change, but the underlying design problems remain.

## GoF Patterns in JavaScript Architecture

In JavaScript applications, GoF patterns often appear in a less explicit form.

For example, an array of functions can express a Chain of Responsibility-like structure without defining `Handler`
classes:

```js
const handlers = [
    authenticate,
    authorize,
    validate,
    execute
];
```

A lookup table can express a Strategy-like design:

```js
const formatter = formatters[format];
```

An object that translates one client's operation into another client's API can express an Adapter without a dedicated
class:

```js
const adaptedClient = {
    request: (...args) => legacyClient.send(...args)
};
```

The absence of class names does not mean the design concept is absent. Pattern identification should be based on the
relationships and intent.

## The 23 Patterns at a Glance

| Category   | Pattern                 | Primary concern                            |
|------------|-------------------------|--------------------------------------------|
| Creational | Abstract Factory        | Related object families                    |
| Creational | Builder                 | Complex object construction                |
| Creational | Factory Method          | Delegated object creation                  |
| Creational | Prototype               | Object cloning                             |
| Creational | Singleton               | Controlled single instance                 |
| Structural | Adapter                 | Interface conversion                       |
| Structural | Bridge                  | Independent abstraction and implementation |
| Structural | Composite               | Part-whole hierarchy                       |
| Structural | Decorator               | Dynamic responsibility addition            |
| Structural | Facade                  | Subsystem simplification                   |
| Structural | Flyweight               | Shared object state                        |
| Structural | Proxy                   | Controlled access                          |
| Behavioral | Chain of Responsibility | Request delegation                         |
| Behavioral | Command                 | Encapsulated operations                    |
| Behavioral | Interpreter             | Language interpretation                    |
| Behavioral | Iterator                | Collection traversal                       |
| Behavioral | Mediator                | Centralized object communication           |
| Behavioral | Memento                 | State capture and restoration              |
| Behavioral | Observer                | Change notification                        |
| Behavioral | State                   | State-dependent behavior                   |
| Behavioral | Strategy                | Interchangeable algorithms                 |
| Behavioral | Template Method         | Algorithm skeleton                         |
| Behavioral | Visitor                 | Operations over object structures          |

## How to Study the GoF Patterns

The patterns are easier to understand when studied by design problem rather than memorized as names.

A useful progression is:

1. Understand the design problem.
2. Identify the variation or dependency.
3. Understand the pattern's intent.
4. Study its participants and relationships.
5. Examine alternative implementations.
6. Understand its trade-offs.
7. Compare it with similar patterns.
8. Apply it only when the problem warrants it.

The objective is not to memorize 23 diagrams. The objective is to recognize recurring design problems and understand the
structures available for addressing them.

## GoF Patterns and Pattern Literacy

Pattern literacy means being able to recognize and reason about recurring design structures.

When encountering a client that interacts with a wrapper which in turn interacts with an existing component, a developer
should ask whether the wrapper is translating an interface, controlling access, adding responsibility, or simplifying a
subsystem. Those questions may lead to Adapter, Proxy, Decorator, or Facade respectively.

Similarly, when encountering an object that delegates to variable algorithms, the developer should determine whether the
design represents Strategy, State, or Template Method. The distinction comes from intent and context, not from class
names.

## GoF Patterns Are Design Knowledge, Not Code Templates

The original GoF patterns should not be treated as code templates.

A traditional Strategy structure may be represented by a context and several concrete strategy classes, but the same
design can be expressed in JavaScript with a function:

```js
function calculate(cart, strategy) {
    return strategy(cart);
}
```

The pattern is expressed through the delegation relationship rather than through a mandatory set of classes.

The design should therefore preserve the **essential structure** while eliminating unnecessary ceremony.

## Relationship to the Pattern Files

The GoF catalog provides the classification and shared vocabulary. The individual pattern files provide the detailed
treatment.

The catalog file establishes what the GoF catalog is, why its classification exists, what the 23 patterns are, and what
problem each pattern addresses. Individual pattern files can then provide detailed intent, problem statements,
structure, participants, JavaScript implementations, TypeScript implementations where relevant, trade-offs,
alternatives, and misuse.

This separation prevents the catalog file from duplicating the implementation material of every individual pattern.

## Summary

The Gang of Four catalog is a foundational catalog of 23 object-oriented design patterns documented in *Design Patterns:
Elements of Reusable Object-Oriented Software* by Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides.

The patterns are classified into three categories:

| Category   | Concern                    |
|------------|----------------------------|
| Creational | Object creation            |
| Structural | Object composition         |
| Behavioral | Behavior and communication |

The 23 patterns are:

**Creational:** Abstract Factory, Builder, Factory Method, Prototype, Singleton.

**Structural:** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.

**Behavioral:** Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy,
Template Method, Visitor.

The most important thing to retain is not the list itself. The GoF catalog provides a vocabulary for recurring design
problems: how objects should be created, how objects should be composed, and how responsibilities and communication
should be organized.

The patterns are not mandatory architectures, universal solutions, or code templates. They are reusable design
structures whose value depends on context.

Modern JavaScript often expresses these patterns through functions, objects, closures, modules, composition, and native
language features rather than reproducing the original class-oriented implementations.

The enduring value of the GoF catalog is therefore its **design vocabulary**. Recognize the problem, understand the
forces, select an appropriate design, use a pattern when it provides a justified solution, and evaluate the resulting
trade-offs.

The pattern is a means of structuring a solution. **The design problem remains the primary concern.**

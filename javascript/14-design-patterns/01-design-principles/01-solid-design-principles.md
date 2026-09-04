# SOLID Design Principles

**SOLID:** A set of five object-oriented design principles intended to improve the maintainability, extensibility,
flexibility, and understandability of software systems.

The five principles are:

| Principle | Name                            | Primary Concern                      |
|:----------|:--------------------------------|:-------------------------------------|
| **S**     | Single Responsibility Principle | Responsibility and cohesion          |
| **O**     | Open-Closed Principle           | Extension without modification       |
| **L**     | Liskov Substitution Principle   | Behavioral substitutability          |
| **I**     | Interface Segregation Principle | Focused interfaces                   |
| **D**     | Dependency Inversion Principle  | Dependency direction and abstraction |

SOLID principles are not rigid rules, language features, or formal requirements that every class must satisfy. They are
design heuristics for reasoning about responsibilities, abstractions, dependencies, and behavioral contracts. Their
purpose is to help identify structures that make software unnecessarily difficult to understand, modify, extend, test,
or replace.

The principles are primarily concerned with relationships within and between software components. They address how
responsibilities are organized, how behavior is extended, how implementations relate to abstractions, how interfaces are
exposed to consumers, and how dependencies are established.

## Purpose of SOLID

SOLID principles aim to make software easier to understand, modify, extend, test, reuse, maintain, and refactor. They
are particularly useful when a system contains substantial business logic, multiple implementations, significant
dependencies, or requirements that are expected to evolve over time.

A system that follows SOLID principles is not automatically well designed. SOLID addresses specific dimensions of
software design, but it does not replace architectural principles, domain modeling, algorithmic analysis, data-structure
selection, cohesion and coupling analysis, performance considerations, or engineering judgment.

The principles are most useful when considered together because the design problems they address are often related. For
example, separating responsibilities may produce clearer component boundaries, which can then make dependency
relationships easier to control. Similarly, dependency inversion can make implementations replaceable, but introducing
abstractions without an actual need for substitution can increase complexity instead of reducing it.

SOLID should therefore be treated as a collection of complementary design heuristics rather than as a mandatory sequence
of rules.

## Cohesion and Coupling

SOLID is closely related to two fundamental properties of software design: cohesion and coupling.

**Cohesion** describes how strongly the responsibilities and elements within a component belong together. A highly
cohesive component has a focused purpose, and the operations it contains contribute meaningfully to that purpose.

**Coupling** describes the degree of dependency between components. Highly coupled components depend heavily on one
another, making changes more likely to propagate across component boundaries. Lower coupling generally makes it easier
to modify or replace one component without unnecessarily affecting others.

The five SOLID principles approach these concerns from different perspectives:

| Principle | Primary Relationship        |
|:----------|:----------------------------|
| SRP       | Responsibility and cohesion |
| OCP       | Change and extension        |
| LSP       | Behavioral compatibility    |
| ISP       | Consumer dependencies       |
| DIP       | Dependency direction        |

The principles should not be interpreted as mechanisms for maximizing cohesion or minimizing coupling at all costs. Some
dependencies are natural and useful, and some responsibilities legitimately belong together. The objective is to
establish boundaries that are appropriate for the problem rather than to eliminate every dependency or split every
component into smaller pieces.

## Responsibility

A responsibility represents something that a module, class, component, or abstraction is responsible for doing or
knowing. A responsibility is therefore a conceptual concern rather than a single method, statement, or piece of
implementation.

For example, an application service may be responsible for coordinating order creation:

```javascript id="8v4n2c"
class OrderService {
    createOrder(order) {
        // coordinate order creation
    }
}
```

The service can contain multiple operations while still having a coherent responsibility. Conversely, a class can
contain only a small number of methods while combining several unrelated responsibilities.

```javascript id="j6m2sp"
class UserManager {
    createUser() {
    }

    sendEmail() {
    }

    generateReport() {
    }

    saveFile() {
    }
}
```

This class combines user management, communication, reporting, and file persistence. Those concerns can evolve
independently and therefore represent different reasons for change.

The number of methods in a class is consequently not a reliable measure of whether the class has a single
responsibility. Responsibility must be evaluated in terms of the conceptual purpose of the component and the forces that
cause it to change.

## Abstraction

An abstraction defines a contract or capability without requiring consumers to depend directly on implementation
details. It allows a component to express what it needs or provides while leaving the specific implementation behind a
boundary.

In object-oriented systems, abstractions can be represented by:

* interfaces
* abstract classes
* protocols
* contracts
* function signatures
* module boundaries
* dependency boundaries

An abstraction is useful when it represents a meaningful and relatively stable concept. The existence of an interface or
abstract type does not itself improve a design. An abstraction that merely duplicates a concrete implementation can
introduce additional indirection without providing a useful boundary.

For example, a payment processor can represent an abstraction around the operation required by application logic:

```javascript id="m8h3yq"
class PaymentProcessor {
    process(payment) {
        // implementation
    }
}
```

The important design question is not whether an abstraction exists, but whether the abstraction represents a meaningful
contract that consumers can depend upon independently of a particular implementation.

## Dependency

A dependency exists when one component relies on another component to perform part of its work.

```javascript id="x9r4kf"
class OrderService {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
}
```

`OrderService` depends on `paymentService` because it cannot perform its operation without that dependency.

Dependencies are not inherently problematic. Software components necessarily depend on other components. The design
concern is whether those dependencies are appropriate, explicit, stable, and directed in a way that limits unnecessary
change propagation.

A dependency becomes particularly significant when a high-level component depends directly on a volatile implementation
detail. If changing a database, external API, framework, or third-party SDK requires modifications to business logic,
the dependency structure may be exposing implementation details across an inappropriate boundary.

SOLID principles provide several ways to reason about these dependency relationships.

## Change

A central concern of SOLID is the relationship between software structure and change.

Software changes because of:

* new requirements
* changed business rules
* new integrations
* new implementations
* bug fixes
* performance requirements
* technology changes
* regulatory requirements
* changing external systems

A design is easier to maintain when a change can be localized to the components responsible for that concern. If
unrelated components must also be modified whenever one concern changes, the design contains unnecessary coupling or
insufficient separation.

For example, if changing an email provider requires modifications to business logic, persistence code, and unrelated
domain classes, the email implementation has leaked into areas that should not depend on it.

SOLID does not attempt to prevent change. It attempts to organize software so that expected changes can be made with an
appropriate and predictable scope of modification.

## Reasons to Change

A component may have several independent reasons to change when it combines concerns that evolve separately.

Consider an invoice component that performs business calculations, persistence, communication, and document generation:

```javascript id="p7c2wa"
class Invoice {
    calculateTotal() {
    }

    saveToDatabase() {
    }

    sendEmail() {
    }

    generatePdf() {
    }
}
```

The calculation rules may change because of a business requirement, while the database schema may change because of a
persistence concern. The PDF format may change independently of both, and the email provider may be replaced without
requiring changes to any of those other responsibilities.

When these concerns are combined in the same component, a change in one area can unnecessarily affect the others.
Separating responsibilities reduces the number of independent reasons for a component to change and therefore supports
the Single Responsibility Principle.

The important distinction is between a component having multiple operations and having multiple independent reasons to
change. Multiple operations can belong to one coherent responsibility; unrelated reasons for change indicate a stronger
case for separation.

## Stable and Volatile Dependencies

Not all dependencies have the same design cost. A dependency on stable domain logic is generally less problematic than a
dependency on an implementation that is volatile or outside the application's control.

Examples of potentially volatile dependencies include:

* external APIs
* databases
* file systems
* message brokers
* cloud services
* third-party SDKs
* UI frameworks

A dependency becomes particularly important when changes to the dependency are likely to force changes in components
that should otherwise remain stable.

SOLID principles often encourage isolating volatile implementation details behind stable contracts. This allows
high-level logic to depend on concepts that are less likely to change while infrastructure and external integrations
remain replaceable.

This does not mean every external dependency requires an abstraction. The cost of introducing and maintaining the
abstraction must be justified by actual volatility, testing requirements, architectural boundaries, or expected
variation.

## Change Amplification

Change amplification occurs when a single conceptual change requires modifications across multiple unrelated components.

For example, if changing a payment provider requires changes to order processing, invoicing, checkout, reporting, and
notification components, the provider-specific implementation has become coupled to a large portion of the application.

A better dependency structure can isolate the provider-specific behavior behind a payment abstraction. Consumers can
then depend on the operations they require rather than directly depending on a particular provider.

The objective is not to guarantee that a change affects only one file. A legitimate change may require modifications to
several components. The objective is to prevent unrelated components from being modified merely because they happen to
depend on the same implementation detail.

## SOLID and Object-Oriented Design

SOLID originated in the context of object-oriented design, but its underlying ideas are broader than classes and
inheritance.

The principles can be applied to:

* classes
* objects
* modules
* packages
* services
* components
* libraries
* application layers

For example, the Single Responsibility Principle can apply to a module containing multiple functions just as it can
apply to a class. Similarly, Dependency Inversion can influence service-level architecture even when the implementation
does not use traditional object-oriented interfaces.

The principles therefore describe relationships in software design rather than requiring a particular programming
language mechanism.

## SOLID Is Not a Checklist

SOLID should not be applied as a mechanical checklist.

A class with one responsibility is not automatically well designed. An abstraction is not automatically better than a
concrete dependency. More interfaces do not automatically produce better architecture, and more classes do not
automatically produce better separation.

A design can technically satisfy a simplistic interpretation of all five principles while still being unnecessarily
complex and difficult to understand.

The objective is not to maximize SOLID compliance. The objective is to establish responsibilities, dependencies,
contracts, and extension points that are appropriate for the system's expected change and complexity.

## SOLID and Overengineering

Applying SOLID too aggressively can result in overengineering.

For example, a simple repository may be surrounded by multiple abstractions:

```javascript id="w3q7vn"
class UserRepositoryInterface {
}

class UserRepositoryFactory {
}

class UserRepositoryProvider {
}

class UserRepositoryAdapter {
}

class UserRepositoryManager {
}
```

If the system only requires a simple in-memory collection with no meaningful variation or external boundary, these
abstractions provide little value. They increase indirection without solving a real design problem.

Useful reasons to introduce an abstraction include:

* multiple implementations are required
* an implementation is expected to change
* a dependency is difficult to test
* a boundary needs to be enforced
* a stable contract is required
* a subsystem must be isolated
* dependency direction needs to be controlled

The existence of only one implementation does not automatically mean an abstraction is unnecessary, just as the
existence of multiple implementations does not automatically mean an abstraction is well designed. The abstraction
should represent a meaningful contract and solve an actual design problem.

## SOLID and Maintainability

Maintainability is influenced by how easily developers can understand, modify, test, and evolve a system.

SOLID can contribute to maintainability by reducing:

* unrelated responsibilities
* unnecessary dependencies
* implementation coupling
* fragile inheritance hierarchies
* oversized interfaces
* tightly coupled infrastructure

However, maintainability also depends on factors outside SOLID, including:

* naming
* code organization
* testing
* documentation
* algorithms
* data structures
* architecture
* observability
* deployment strategy

SOLID is therefore one part of a larger design discipline. A system can have excellent SOLID boundaries and still be
difficult to maintain because of poor naming, inadequate testing, inappropriate architecture, inefficient algorithms, or
excessive operational complexity.

## SOLID and Testability

Good dependency boundaries often improve testability because they allow a component to receive controlled
implementations of its dependencies.

For example:

```javascript id="s5n1xj"
class OrderService {
    constructor(paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }

    checkout(order) {
        return this.paymentProcessor.process(order);
    }
}
```

A test can provide a controlled implementation:

```javascript id="r9m4kd"
const paymentProcessor = {
    process() {
        return {success: true};
    }
};

const service = new OrderService(paymentProcessor);
```

The service does not need to know which concrete payment implementation is being used. Its dependency is supplied
externally, which makes the behavior easier to control during testing.

This is one practical consequence of explicit dependency injection and appropriate dependency boundaries. However,
testability alone is not sufficient justification for introducing an abstraction. Test doubles can themselves become a
source of coupling when the abstraction is designed around testing rather than around the actual behavior required by
the system.

## SOLID and Inheritance

The Liskov Substitution Principle specifically addresses behavioral relationships between abstractions and their
subtypes.

A subtype should preserve the behavioral contract expected by consumers of the base abstraction. Inheritance therefore
requires more than shared implementation or similar data. The subtype must remain valid anywhere the abstraction is
expected.

For example:

```javascript id="v6z8qx"
function processPayment(paymentProcessor, payment) {
    return paymentProcessor.process(payment);
}
```

If consumers rely on `process()` accepting certain inputs, producing certain results, and maintaining particular
behavioral guarantees, every valid implementation must honor those expectations.

Inheritance that merely reuses implementation while changing important behavioral assumptions can violate LSP.

Inheritance is therefore not inherently bad, but it should represent a valid subtype relationship rather than merely
serve as a mechanism for sharing code.

## SOLID and Composition

SOLID principles often work well with composition because composition allows behavior and dependencies to be assembled
explicitly.

Instead of creating increasingly specialized inheritance hierarchies:

```javascript id="a4w8sz"
class AdvancedOrderService extends BaseOrderService {
    // increasingly specialized behavior
}
```

behavior can be composed from focused components:

```javascript id="n3q6vx"
class OrderService {
    constructor(
        validator,
        calculator,
        paymentProcessor,
        repository
    ) {
        this.validator = validator;
        this.calculator = calculator;
        this.paymentProcessor = paymentProcessor;
        this.repository = repository;
    }
}
```

The second design makes the service's collaborators explicit and allows each concern to be replaced independently.

This does not mean composition is always preferable to inheritance. Inheritance can be appropriate when a genuine
subtype relationship exists and the inherited contract is stable. The relevant distinction is whether the chosen
relationship accurately represents the domain and behavioral constraints of the system.

## SOLID and Interfaces

An interface should represent a meaningful contract for its consumers.

A large interface can force consumers to depend on operations they do not require. For example:

```javascript id="q2k8ym"
class Worker {
    work() {
    }

    eat() {
    }
}
```

If a consumer only requires `work()`, forcing it to depend on the complete `Worker` contract introduces unnecessary
coupling.

The Interface Segregation Principle addresses this problem by encouraging contracts that are focused around the
capabilities actually required by their consumers.

The objective is not to make every interface as small as possible. Arbitrarily splitting interfaces can create
fragmentation and make the system harder to understand. The objective is to avoid forcing consumers to depend on
operations that are irrelevant to them.

## SOLID and Dependency Direction

Dependency direction determines which components know about and depend upon which other components.

A business component that directly constructs or depends on a particular database implementation is coupled to that
infrastructure. Changes to the infrastructure can therefore propagate into high-level policy.

Dependency inversion establishes a different relationship by allowing high-level policy to depend on an abstraction
representing the operations it requires. A concrete infrastructure implementation can then satisfy that abstraction.

The important property is not simply that an interface exists. The important property is that the dependency direction
supports the stability of high-level policy instead of allowing volatile implementation details to dictate its
structure.

## SOLID and Architecture

SOLID principles can influence architectural boundaries, but they do not prescribe a complete architecture.

They can help determine:

* where responsibilities belong
* which abstractions should exist
* which dependencies should cross boundaries
* which implementations should remain replaceable
* which contracts should be exposed

For example, an architecture may isolate domain logic from infrastructure so that business rules do not depend directly
on databases, message brokers, or external APIs. SOLID principles can help determine the responsibility and dependency
relationships within those boundaries.

The principles can therefore influence architectural structure while remaining distinct from architectural styles
themselves. SOLID can be applied within monoliths, modular applications, libraries, distributed systems, and services.

## Applying SOLID Together

The five principles address different but related design concerns, so a single design problem can involve several
principles simultaneously.

A component that combines unrelated responsibilities may present an SRP problem. Once those responsibilities are
separated, the resulting components may require focused contracts, making ISP relevant. If high-level policy still
depends directly on infrastructure, DIP may provide a more appropriate dependency boundary. If the design supports
interchangeable implementations, LSP becomes relevant to whether those implementations can safely substitute for one
another. OCP becomes relevant when the system needs to support expected variations without repeatedly modifying stable
behavior.

These principles do not have to be applied in a fixed order, and applying one principle does not automatically require
applying all the others. The appropriate principle depends on the specific design pressure being addressed.

## SOLID Trade-Offs

SOLID principles introduce trade-offs because stronger separation and abstraction often require additional structure.

| Benefit                     | Potential Cost         |
|:----------------------------|:-----------------------|
| Smaller responsibilities    | More components        |
| Lower coupling              | More abstractions      |
| Replaceable implementations | Additional indirection |
| Focused interfaces          | More interface types   |
| Flexible extension          | More design complexity |
| Dependency injection        | More configuration     |
| Composition                 | More explicit wiring   |

The correct design depends on the expected volatility, complexity, scale, and lifetime of the system.

Reducing coupling may require additional abstraction. Separating responsibilities may increase the number of components.
Dependency injection may require additional configuration. These costs are justified only when the resulting
flexibility, isolation, or maintainability provides enough value to offset the additional complexity.

## SOLID and Simplicity

SOLID should support simplicity rather than undermine it.

A simple implementation such as:

```javascript id="u7n5kc"
function calculateTotal(items) {
    return items.reduce((total, item) => total + item.price, 0);
}
```

does not need an elaborate object hierarchy merely to demonstrate SOLID principles.

Likewise, introducing an abstraction solely because "DIP requires it" can make a system harder to understand. If a
dependency is stable, local, and unlikely to vary, direct dependency may be the simpler and more appropriate design.

Good design is not the design containing the greatest number of abstractions. It is the design whose structure
appropriately reflects the problem and its expected evolution.

## SOLID and Refactoring

SOLID principles are useful as refactoring heuristics because certain design smells often indicate that
responsibilities, dependencies, or contracts need to be reconsidered.

| Code Smell                                            | Potential Principle |
|:------------------------------------------------------|:--------------------|
| Large class with unrelated responsibilities           | SRP                 |
| Frequent modification of stable code for new variants | OCP                 |
| Subclass breaks assumptions of base type              | LSP                 |
| Large interfaces with unused operations               | ISP                 |
| High-level logic directly depends on infrastructure   | DIP                 |

The principle does not automatically prescribe the refactoring. A large class, for example, does not necessarily require
decomposition. The developer must first determine whether the class actually contains independent responsibilities and
whether separating them would improve the design.

SOLID provides a way to reason about the underlying design problem rather than a fixed set of mechanical refactoring
recipes.

## SOLID and Design Smells

Violations of SOLID principles often manifest as recognizable design smells.

Examples include:

* God objects
* rigid inheritance hierarchies
* shotgun surgery
* excessive coupling
* inappropriate abstractions
* fat interfaces
* hidden dependencies
* duplicated business rules
* infrastructure leaking into domain logic
* implementations that cannot safely substitute for their abstractions

These smells are indicators rather than formal proof of a SOLID violation. A God object may indicate an SRP problem, but
its underlying cause still needs to be analyzed. Similarly, a large interface may be appropriate when its operations
genuinely form one coherent contract for its consumers.

Design smells should therefore trigger investigation rather than automatic application of a particular principle.

## SOLID in JavaScript

JavaScript does not require traditional class-based object-oriented programming to apply SOLID principles.

The principles can be implemented using:

* classes
* objects
* functions
* modules
* closures
* composition
* higher-order functions
* dependency injection
* factory functions

For example, Dependency Inversion can be implemented without an `interface` keyword:

```javascript id="c5v9tr"
function createOrderService(paymentProcessor) {
    return {
        checkout(order) {
            return paymentProcessor.process(order);
        }
    };
}
```

The service depends on a behavioral contract rather than a specific implementation. JavaScript's dynamic and structural
nature allows that contract to be expressed through the operations the dependency is expected to provide.

This is still an application of dependency inversion even though the language does not require an explicit interface
declaration.

## SOLID Does Not Require Classes

SOLID principles describe design relationships rather than syntax.

A functional implementation can still have:

* focused responsibilities
* substitutable abstractions
* segregated contracts
* inverted dependencies
* extension points

For example:

```javascript id="h8m2qy"
const createNotifier = (send) => ({
    notify(message) {
        return send(message);
    }
});
```

The `send` dependency is supplied externally rather than constructed internally. The function therefore has an explicit
dependency boundary without requiring a class or interface declaration.

The same design principle can exist regardless of whether the implementation uses classes, functions, modules, objects,
or other language constructs.

## SOLID and Dependency Injection

Dependency Injection is commonly used to implement Dependency Inversion.

Instead of constructing a concrete dependency internally:

```javascript id="w6f3qp"
class OrderService {
    constructor() {
        this.paymentProcessor = new StripePaymentProcessor();
    }
}
```

the dependency can be supplied externally:

```javascript id="b2r7mc"
class OrderService {
    constructor(paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }
}
```

The second design separates the service from the construction of its payment processor. The service receives an object
that satisfies the behavioral contract it requires.

Dependency Injection is a technique.

Dependency Inversion is a design principle.

They should not be treated as synonyms. Dependency Injection can support Dependency Inversion, but injecting a concrete
implementation does not automatically constitute dependency inversion. The direction and abstraction of the dependency
still matter.

## SOLID and Design Patterns

Design patterns and SOLID principles operate at different levels.

**SOLID principles** describe desirable properties of design relationships.

**Design patterns** provide reusable structures for solving recurring design problems.

Patterns can help implement SOLID principles.

| Pattern              | Common SOLID Relationship  |
|:---------------------|:---------------------------|
| Strategy             | OCP, DIP                   |
| Factory Method       | OCP, DIP                   |
| Abstract Factory     | OCP, DIP                   |
| Adapter              | OCP, LSP                   |
| Decorator            | OCP                        |
| Facade               | SRP, dependency management |
| Observer             | OCP, dependency decoupling |
| Dependency Injection | DIP                        |

These relationships are not automatic. A Strategy implementation does not inherently satisfy OCP or DIP, and an Adapter
does not automatically satisfy LSP. The way the pattern is applied determines whether it actually produces the desired
design properties.

A pattern should therefore not be introduced merely because it appears to support a SOLID principle. The underlying
design problem should justify the pattern.

## SOLID and Design Principles

SOLID is not an isolated collection of five rules. It interacts with broader design principles such as:

* separation of concerns
* information hiding
* encapsulation
* composition over inheritance
* programming to abstractions
* least knowledge
* high cohesion
* low coupling
* explicit dependencies

These principles overlap in some areas but are not interchangeable.

For example, encapsulation controls access to implementation details, while dependency inversion concerns the direction
in which components depend on abstractions and implementations. Composition over inheritance is a design preference that
can help avoid inappropriate inheritance relationships, while LSP determines whether an inheritance relationship is
behaviorally valid.

A well-designed system combines these principles according to its requirements rather than attempting to apply every
principle uniformly.

## When SOLID Matters Most

SOLID becomes particularly valuable when software has:

* significant business logic
* multiple implementations
* long expected maintenance periods
* frequent requirement changes
* complex dependencies
* large development teams
* independently evolving components
* extensive automated testing
* multiple integration boundaries

These conditions increase the cost of poor separation and uncontrolled dependencies. In such systems, clearly defined
responsibilities, contracts, and dependency boundaries can significantly reduce the impact of change.

For very small or short-lived programs, aggressively applying every principle can instead produce unnecessary
abstraction and indirection.

## When Not to Apply SOLID Aggressively

SOLID should not be used to justify abstractions without meaningful design pressure.

Avoid introducing unnecessary interfaces, factories, wrappers, or class hierarchies when:

* there is only one stable implementation
* no meaningful variation exists
* the abstraction provides no useful boundary
* the abstraction merely mirrors the implementation
* the additional indirection makes the code harder to understand
* the system is small enough that direct dependencies are appropriate

The absence of an abstraction is not automatically a design flaw.

A direct dependency can be the correct design when the dependency is stable and the boundary does not need to support
substitution, isolation, or independent evolution.

## Principle Interactions

The five principles address different but related concerns.

### SRP and OCP

A component with a focused responsibility is generally easier to extend because its behavior is less entangled with
unrelated concerns. When responsibilities are properly separated, changes to one concern are less likely to require
modifications to components responsible for other concerns.

### OCP and LSP

Extension through polymorphism depends on implementations remaining valid substitutes for the abstraction they extend.
If an extension changes behavioral assumptions in ways that break existing consumers, the design cannot safely achieve
extension through that abstraction.

### OCP and DIP

Dependency inversion can establish stable abstractions around volatile implementations. When high-level policy depends
on those abstractions rather than concrete details, new implementations can often be introduced without modifying the
high-level policy itself.

### ISP and DIP

Focused interfaces prevent consumers from depending on operations they do not require. This makes dependency inversion
more precise because a component can depend on the specific contract representing its needs rather than on a broad
abstraction containing unrelated capabilities.

### SRP and ISP

Both principles encourage focused boundaries, but they operate at different levels.

SRP focuses on the responsibilities of a component and the reasons that component changes. ISP focuses on the contracts
exposed to consumers and whether those consumers are forced to depend on operations they do not need.

## SOLID as a Heuristic

SOLID principles are most useful when treated as questions to ask about a design rather than as labels to apply to code.

**SRP:** Does this component have multiple independent reasons to change?

**OCP:** Can expected variations be introduced without repeatedly modifying stable behavior?

**LSP:** Can this subtype genuinely be used wherever its abstraction is expected without violating behavioral
expectations?

**ISP:** Are consumers forced to depend on operations they do not need?

**DIP:** Does high-level policy depend unnecessarily on low-level implementation details?

These questions encourage analysis of the actual design pressures rather than mechanical compliance.

## Common Misinterpretations

### SRP Means One Method Per Class

SRP does not require every class to contain a single method. A class can contain many methods while representing one
coherent responsibility.

The relevant question is whether the operations belong to the same conceptual responsibility and are subject to the same
reasons for change.

### OCP Means Never Modify Existing Code

OCP does not literally prohibit modification.

It means that a design should be structured so that expected extensions can be introduced without repeatedly modifying
stable behavior. Existing code may still require modification when requirements change, when defects are discovered, or
when the original abstraction was incorrect.

### LSP Means Every Subclass Must Work Identically

LSP does not require identical implementation or identical internal behavior.

It requires behavioral compatibility with the contract established by the abstraction. A subtype may behave differently
internally and may provide stronger guarantees, provided it does not violate the expectations of existing consumers.

### ISP Means Every Interface Must Be Tiny

ISP does not require arbitrarily small interfaces.

Interfaces should be appropriately focused around the needs of their consumers. Splitting a coherent interface into
numerous microscopic contracts can introduce unnecessary fragmentation and complexity.

### DIP Means Always Use Interfaces

DIP does not require an explicit language-level interface.

The principle concerns dependency direction and abstraction. In JavaScript, a function parameter, object contract,
module boundary, or other behavioral abstraction can serve as the relevant dependency boundary.

### SOLID Means More Classes

SOLID can lead to additional components, but class count is not a design objective.

Creating unnecessary classes, wrappers, interfaces, and factories can make a system less understandable while providing
no meaningful design benefit.

## Best Practices

* **Treat SOLID as a set of design heuristics rather than rigid rules.** Apply the principles where they address an
  actual design problem.

* **Optimize for appropriate cohesion and coupling.** Focused responsibilities and controlled dependencies matter more
  than mechanically satisfying individual principles.

* **Design around expected change.** Separate responsibilities and introduce abstractions where requirements are likely
  to vary independently.

* **Keep abstractions purposeful.** An abstraction should establish a meaningful contract or boundary rather than exist
  solely to satisfy DIP or OCP.

* **Prefer composition when it produces clearer dependencies.** Composition often makes behavior and dependencies more
  explicit than deep inheritance hierarchies.

* **Use inheritance only when substitutability is valid.** Shared implementation is not sufficient justification for an
  inheritance relationship.

* **Keep interfaces consumer-focused.** Consumers should not depend on operations they do not require.

* **Make dependencies explicit.** Constructor injection, function parameters, and other forms of explicit dependency
  injection make component relationships easier to understand and test.

* **Separate dependency inversion from dependency injection.** Dependency Injection is an implementation technique;
  Dependency Inversion is a design principle.

* **Do not confuse abstraction with indirection.** Adding another interface or wrapper does not automatically improve
  the design.

* **Avoid speculative abstractions.** Do not create extension points for variations that have no reasonable likelihood
  of occurring.

* **Use SOLID to guide refactoring.** Existing design smells can reveal where responsibilities, contracts, or
  dependencies need to be reorganized.

* **Consider the entire system.** A locally well-designed component can still participate in a poorly designed
  architecture.

* **Prioritize clarity.** A theoretically more flexible design is not necessarily better if its structure is
  significantly harder to understand.

* **Apply principles according to system scale.** The appropriate amount of abstraction for a small utility differs from
  that of a long-lived enterprise system.

* **Do not optimize for SOLID compliance.** The objective is maintainable, understandable, change-tolerant software, not
  maximum adherence to five named principles.

## Summary

SOLID is a collection of five object-oriented design principles:

* **S** — Single Responsibility Principle
* **O** — Open-Closed Principle
* **L** — Liskov Substitution Principle
* **I** — Interface Segregation Principle
* **D** — Dependency Inversion Principle

The principles address different aspects of software design. SRP concerns the organization of responsibilities and
reasons for change. OCP concerns controlled extension of stable behavior. LSP concerns behavioral substitutability. ISP
concerns the contracts exposed to consumers. DIP concerns abstraction and dependency direction.

SOLID does not require classes, interfaces, inheritance, dependency injection, or any other particular language
mechanism. The principles describe design relationships and can therefore be expressed through classes, functions,
modules, objects, composition, and other programming constructs.

SOLID is also not a measure of software quality by itself. A design can contain unnecessary abstractions while appearing
highly compliant with the principles, just as a simple and direct implementation can be well designed without
introducing elaborate abstractions.

The practical objective is to create software in which responsibilities are coherent, dependencies are appropriately
controlled, abstractions represent meaningful contracts, implementations can be substituted safely where required, and
expected changes can be localized without introducing unnecessary complexity.

SOLID is most effective when used pragmatically: identify the actual source of design pressure, determine which
principle provides a useful way to reason about it, and introduce only the structure necessary to solve the problem.

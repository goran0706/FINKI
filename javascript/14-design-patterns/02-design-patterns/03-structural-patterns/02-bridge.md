# Bridge

## Intent

**Bridge separates an abstraction from its implementation so that the two can vary independently.**

The pattern introduces an abstraction layer that delegates implementation-specific behavior to a separate implementation
hierarchy. Changes to the abstraction do not require changes to the implementation, and different implementations can be
combined with the same abstraction.

Bridge is therefore a pattern for managing **independent dimensions of variation**.

The central design decision is to avoid encoding two independently changing dimensions into a single inheritance
hierarchy.

## The Problem

Consider a rendering system that supports multiple shapes and multiple rendering technologies.

A naive inheritance design might create a separate class for every combination:

```js
class CircleCanvas {
}

class CircleSvg {
}

class RectangleCanvas {
}

class RectangleSvg {
}
```

As the number of shapes and rendering implementations grows, the number of combinations grows as well.

If there are:

* 5 shapes;
* 4 rendering implementations;

a combination-based hierarchy potentially requires 20 concrete classes.

Adding another shape requires implementations for every renderer. Adding another renderer requires implementations for
every shape.

The problem is not merely class count. The abstraction and implementation dimensions have become coupled.

Bridge separates them.

## Two Dimensions of Variation

The defining characteristic of Bridge is the existence of **two independently varying dimensions**.

For example:

**Abstraction dimension**

* Circle
* Rectangle
* Triangle

**Implementation dimension**

* Canvas renderer
* SVG renderer
* WebGL renderer

Instead of representing every combination as a separate class, the abstraction delegates to an implementation object.

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }
}

class Circle extends Shape {
    draw() {
        this.renderer.drawCircle();
    }
}

class Rectangle extends Shape {
    draw() {
        this.renderer.drawRectangle();
    }
}
```

The implementation side is separate:

```js
class CanvasRenderer {
    drawCircle() {
        // Canvas-specific implementation
    }

    drawRectangle() {
        // Canvas-specific implementation
    }
}

class SvgRenderer {
    drawCircle() {
        // SVG-specific implementation
    }

    drawRectangle() {
        // SVG-specific implementation
    }
}
```

The dimensions can then be combined independently:

```js
const circle = new Circle(new CanvasRenderer());
const rectangle = new Rectangle(new SvgRenderer());

circle.draw();
rectangle.draw();
```

The important property is not merely delegation. It is **independent variation of the abstraction and implementation
dimensions**.

## Abstraction

The abstraction represents the higher-level concept that clients use.

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {
        throw new Error("Not implemented");
    }
}
```

Concrete abstractions specialize the high-level behavior:

```js
class Circle extends Shape {
    draw() {
        this.renderer.drawCircle();
    }
}
```

The abstraction does not implement every low-level detail itself. It delegates implementation-specific work to the
implementation side.

## Refined Abstraction

The GoF Bridge structure also permits refined abstractions.

A refined abstraction extends the high-level interface while continuing to use the implementation abstraction.

```js
class InteractiveCircle extends Circle {
    select() {
        this.renderer.highlightCircle();
    }
}
```

The implementation does not need to become part of the abstraction hierarchy.

This is important because the abstraction can evolve independently from the implementation hierarchy.

## Implementation

The implementation defines the operations required by the abstraction.

```js
class Renderer {
    drawCircle() {
        throw new Error("Not implemented");
    }

    drawRectangle() {
        throw new Error("Not implemented");
    }

    highlightCircle() {
        throw new Error("Not implemented");
    }
}
```

Concrete implementations provide technology-specific behavior:

```js
class CanvasRenderer extends Renderer {
    drawCircle() {
        // Canvas implementation
    }

    drawRectangle() {
        // Canvas implementation
    }

    highlightCircle() {
        // Canvas implementation
    }
}
```

Another implementation can satisfy the same implementation contract:

```js
class SvgRenderer extends Renderer {
    drawCircle() {
        // SVG implementation
    }

    drawRectangle() {
        // SVG implementation
    }

    highlightCircle() {
        // SVG implementation
    }
}
```

The abstraction depends on the implementation interface rather than a particular implementation.

## The Bridge

The bridge is the composition relationship between the abstraction and implementation.

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {
        throw new Error("Not implemented");
    }
}
```

The `renderer` reference is the bridge between the two hierarchies.

This relationship is established through composition rather than inheritance.

The abstraction therefore does not need to inherit from a particular renderer, and the renderer does not need to inherit
from a particular shape.

## Composition Instead of Cartesian Inheritance

The primary structural advantage of Bridge is replacing a Cartesian-product inheritance hierarchy with composition.

Without Bridge, independently varying dimensions tend to produce combinations:

```text
Abstraction × Implementation
```

With Bridge, they become independently representable objects:

```text
Abstraction + Implementation
```

The important difference is that the system no longer needs a concrete type for every possible combination.

For example:

```js
const circleOnCanvas = new Circle(new CanvasRenderer());
const circleOnSvg = new Circle(new SvgRenderer());

const rectangleOnCanvas = new Rectangle(new CanvasRenderer());
const rectangleOnSvg = new Rectangle(new SvgRenderer());
```

The combinations are runtime compositions rather than classes.

## Runtime Selection

Because the implementation is supplied as an object, the implementation can be selected at runtime.

```js
function createRenderer(type) {
    switch (type) {
        case "canvas":
            return new CanvasRenderer();

        case "svg":
            return new SvgRenderer();

        default:
            throw new Error(`Unsupported renderer: ${type}`);
    }
}

const renderer = createRenderer("svg");
const shape = new Circle(renderer);

shape.draw();
```

Bridge itself does not require runtime selection. A factory, dependency injection container, configuration system, or
application composition root can choose the implementation.

The important property is that the abstraction does not need to know which concrete implementation was selected.

## Dependency Direction

The abstraction depends on the implementation contract:

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {
        this.renderer.drawCircle();
    }
}
```

It does not directly instantiate a concrete renderer:

```js
class BadShape {
    constructor() {
        this.renderer = new CanvasRenderer();
    }
}
```

Direct construction couples the abstraction to one implementation and defeats much of the purpose of the bridge.

The composition root should normally determine which implementation is used.

## Bridge with JavaScript Interfaces

JavaScript does not provide native interface declarations, so the implementation contract can be expressed through
convention, abstract base classes, or TypeScript interfaces.

A JavaScript implementation contract can be documented through an abstract class:

```js
class Renderer {
    drawCircle() {
        throw new Error("Not implemented");
    }

    drawRectangle() {
        throw new Error("Not implemented");
    }
}
```

The concrete implementations satisfy the expected protocol.

In TypeScript, the relationship can be made explicit.

```ts
interface Renderer {
    drawCircle(): void;

    drawRectangle(): void;
}

abstract class Shape {
    constructor(
        protected readonly renderer: Renderer
    ) {
    }

    abstract draw(): void;
}
```

A concrete abstraction can then use the implementation interface:

```ts
class Circle extends Shape {
    draw(): void {
        this.renderer.drawCircle();
    }
}
```

## Bridge in TypeScript

TypeScript makes Bridge especially clear because the two contracts can be represented separately.

```ts
interface Renderer {
    drawCircle(): void;

    drawRectangle(): void;
}

interface Shape {
    draw(): void;
}

class Circle implements Shape {
    constructor(
        private readonly renderer: Renderer
    ) {
    }

    draw(): void {
        this.renderer.drawCircle();
    }
}
```

Concrete implementations satisfy `Renderer`:

```ts
class CanvasRenderer implements Renderer {
    drawCircle(): void {
        // Canvas
    }

    drawRectangle(): void {
        // Canvas
    }
}

class SvgRenderer implements Renderer {
    drawCircle(): void {
        // SVG
    }

    drawRectangle(): void {
        // SVG
    }
}
```

The two dimensions can vary independently.

## Bridge with Functional Implementations

The implementation side does not necessarily need classes.

JavaScript's structural and functional nature allows the implementation to be represented by an object containing
functions.

```js
const canvasRenderer = {
    drawCircle() {
        // Canvas
    },

    drawRectangle() {
        // Canvas
    }
};

const svgRenderer = {
    drawCircle() {
        // SVG
    },

    drawRectangle() {
        // SVG
    }
};
```

The abstraction can use either:

```js
class Circle {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {
        this.renderer.drawCircle();
    }
}
```

This is still Bridge because the essential structure is the separation between abstraction and implementation.

## Bridge with Closures

A functional abstraction can also capture its implementation dependency through a closure.

```js
function createCircle(renderer) {
    return {
        draw() {
            renderer.drawCircle();
        }
    };
}
```

The implementation remains independently replaceable:

```js
const circle = createCircle(svgRenderer);
```

A GoF pattern does not require a particular class syntax. What matters is the underlying structural relationship.

## Bridge for Platform Independence

One common use of Bridge is separating platform-independent logic from platform-specific implementation.

For example:

```js
class Dialog {
    constructor(platform) {
        this.platform = platform;
    }

    open() {
        this.platform.createWindow();
        this.platform.showWindow();
    }
}
```

Platform implementations can vary:

```js
class WindowsPlatform {
    createWindow() {
        // Windows-specific behavior
    }

    showWindow() {
        // Windows-specific behavior
    }
}

class MacPlatform {
    createWindow() {
        // macOS-specific behavior
    }

    showWindow() {
        // macOS-specific behavior
    }
}
```

The dialog abstraction can evolve independently of platform implementations.

## Bridge for Persistence

Bridge can separate a domain-level persistence abstraction from storage implementations.

```js
class DocumentStore {
    constructor(storage) {
        this.storage = storage;
    }

    save(document) {
        return this.storage.write(document);
    }

    load(id) {
        return this.storage.read(id);
    }
}
```

Implementations can target different technologies:

```js
class FileStorage {
    write(document) {
        // File system
    }

    read(id) {
        // File system
    }
}

class DatabaseStorage {
    write(document) {
        // Database
    }

    read(id) {
        // Database
    }
}
```

The high-level persistence abstraction remains independent of the storage technology.

Whether this should be called Bridge depends on the design intent. If the storage implementations are intentionally
modeled as an independently varying implementation dimension, Bridge is an appropriate description. If the object is
simply translating an external API, Adapter may be the better pattern.

## Bridge for Messaging

A messaging abstraction can similarly be separated from transport implementations.

```js
class MessagePublisher {
    constructor(transport) {
        this.transport = transport;
    }

    publish(topic, message) {
        return this.transport.send(topic, message);
    }
}
```

Different transports can implement the required contract:

```js
class KafkaTransport {
    send(topic, message) {
        // Kafka
    }
}

class RabbitMQTransport {
    send(topic, message) {
        // RabbitMQ
    }
}
```

The publisher abstraction and transport implementation can evolve independently.

## Bridge and Runtime Configuration

Bridge works naturally with configuration-driven implementation selection.

```js
function createMessagePublisher(config) {
    const transport =
        config.transport === "kafka"
            ? new KafkaTransport()
            : new RabbitMQTransport();

    return new MessagePublisher(transport);
}
```

The factory is responsible for composition. The publisher remains unaware of the configuration mechanism and concrete
transport selection.

## Bridge and Dependency Injection

Dependency injection is a natural mechanism for supplying the implementation side.

```js
class ReportGenerator {
    constructor(formatter) {
        this.formatter = formatter;
    }

    generate(report) {
        return this.formatter.format(report);
    }
}
```

The formatter implementation can be injected:

```js
const generator = new ReportGenerator(
    new PdfFormatter()
);
```

or:

```js
const generator = new ReportGenerator(
    new HtmlFormatter()
);
```

Dependency injection does not make a design a Bridge by itself. Bridge is present when the injected dependency
represents an independently varying implementation dimension of the abstraction.

## Bridge and Open/Closed Design

Bridge supports the Open/Closed Principle by allowing new abstraction variants and implementation variants to be
introduced independently.

A new abstraction:

```js
class Triangle extends Shape {
    draw() {
        this.renderer.drawTriangle();
    }
}
```

can be introduced without modifying existing abstraction classes.

A new implementation:

```js
class WebGLRenderer extends Renderer {
    drawCircle() {
        // WebGL
    }

    drawRectangle() {
        // WebGL
    }
}
```

can be introduced without creating a new class for every existing shape.

However, adding a new operation to the implementation interface can require changes to every concrete implementation.

Bridge therefore does not eliminate all forms of coupling. It changes where the coupling exists and which dimension can
vary independently.

## Operation Stability

The implementation interface should contain operations that are meaningful across the abstraction variants.

For example:

```js
interface
Renderer
{
    drawCircle();
    drawRectangle();
}
```

works when every renderer genuinely needs to know how to render those shapes.

But if the abstraction side has dozens of highly specialized operations that every implementation must support, the
implementation interface can become difficult to maintain.

Bridge works best when the implementation contract represents a coherent implementation dimension.

## Bridge and Granularity

The abstraction and implementation boundaries should be chosen according to meaningful variation.

A bridge between two classes merely because one class calls another is not enough.

For example:

```js
class OrderService {
    constructor(database) {
        this.database = database;
    }
}
```

does not automatically constitute Bridge.

It may simply be dependency injection.

Bridge becomes relevant when the service abstraction and database implementation represent two deliberately separated
dimensions that need to evolve independently.

## Bridge and Abstraction Stability

The abstraction should represent concepts meaningful to its clients rather than mirroring the implementation API.

For example:

```js
class Image {
    resize(width, height) {
        this.renderer.resizeImage(width, height);
    }
}
```

is an abstraction if clients care about images while the renderer cares about the underlying technology.

A poor bridge would expose implementation concepts directly:

```js
image.renderer.executeNativeCommand(...);
```

This causes the abstraction to leak its implementation dimension back to clients.

## Bridge and Encapsulation

The implementation should remain behind the abstraction.

Clients should interact with:

```js
shape.draw();
```

rather than:

```js
shape.renderer.drawCircle();
```

The latter exposes the implementation hierarchy and weakens the separation that Bridge was intended to establish.

The abstraction owns the high-level interface. The implementation owns implementation-specific behavior.

## Bridge vs Adapter

Adapter and Bridge both involve two interfaces or object roles, but their purposes are fundamentally different.

**Adapter makes an existing incompatible interface usable through another interface.**

**Bridge separates two dimensions of a design so that they can evolve independently.**

Adapter is commonly introduced after incompatible components already exist.

Bridge is generally introduced as a structural design decision to prevent abstraction and implementation from becoming
coupled.

For example:

```js
class PaymentAdapter {
    processPayment(payment) {
        return externalProvider.createPaymentIntent(
            translate(payment)
        );
    }
}
```

is Adapter because the purpose is to reconcile incompatible APIs.

By contrast:

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }

    draw() {
        this.renderer.drawCircle();
    }
}
```

can be Bridge when shapes and rendering technologies are deliberately independent variation dimensions.

The presence of composition alone does not distinguish the patterns. **Intent and the dimensions of variation do.**

## Bridge vs Strategy

Bridge and Strategy both use composition and delegation, and their structures can therefore look similar.

Strategy encapsulates an interchangeable algorithm.

```js
class Checkout {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculate(order) {
        return this.pricingStrategy.calculate(order);
    }
}
```

There is generally one primary abstraction whose behavior varies by selecting an algorithm.

Bridge has two independently evolving dimensions.

```js
class Shape {
    constructor(renderer) {
        this.renderer = renderer;
    }
}
```

The abstraction hierarchy and implementation hierarchy both have independent variation.

A useful distinction is:

* Strategy varies **how an operation is performed**.
* Bridge separates **what abstraction exists from how that abstraction is implemented**.

The structures can overlap. The design intent determines the more appropriate classification.

## Bridge vs State

State changes an object's behavior according to its current state.

```js
class Connection {
    constructor(state) {
        this.state = state;
    }

    connect() {
        this.state.connect(this);
    }
}
```

The state objects represent behavioral states of the context.

Bridge does not represent lifecycle states. Its implementation object represents an independently varying implementation
dimension.

## Bridge vs Abstract Factory

Abstract Factory creates families of related objects.

Bridge does not primarily solve object-family creation. It solves separation of abstraction and implementation.

A factory may be used to construct a bridge configuration:

```js
const renderer = rendererFactory.create(config);
const shape = new Circle(renderer);
```

The factory and Bridge solve different concerns.

## Bridge vs Template Method

Template Method uses inheritance to define an algorithm structure while allowing subclasses to vary selected steps.

Bridge uses composition to separate abstraction from implementation.

Template Method therefore couples the variation mechanism to inheritance, while Bridge explicitly separates the two
dimensions through composition.

## Bridge and the JavaScript Prototype System

Bridge is unrelated to JavaScript's prototype chain.

JavaScript objects have prototypes for property and method lookup:

```js
const object = Object.create(proto);
```

That mechanism is not the Bridge pattern.

Bridge concerns the architectural relationship between an abstraction and an implementation.

The fact that JavaScript uses prototypes does not make prototype-based objects examples of Bridge.

## Bridge and Inheritance

Bridge is often introduced specifically to avoid excessive inheritance combinations.

Suppose the design has two dimensions:

* document type;
* output format.

An inheritance-based solution might create:

```js
class InvoicePdf {
}

class InvoiceHtml {
}

class ReportPdf {
}

class ReportHtml {
}
```

Bridge separates the dimensions:

```js
class Document {
    constructor(formatter) {
        this.formatter = formatter;
    }
}

class Invoice extends Document {
}

class Report extends Document {
}
```

The formatter hierarchy is independent:

```js
class PdfFormatter {
}

class HtmlFormatter {
}
```

This is the central structural transformation provided by Bridge.

## Bridge and Multiple Inheritance

The classical motivation for Bridge is particularly strong in languages where designers might otherwise use multiple
inheritance to combine independent hierarchies.

JavaScript has no multiple class inheritance.

Nevertheless, the underlying design problem still exists. JavaScript developers can accidentally create the same
Cartesian-product problem through classes, mixins, conditional logic, or nested abstractions.

Composition remains the appropriate mechanism for separating independent dimensions.

## Bridge and Mixins

Mixins can sometimes provide behavior from multiple sources:

```js
const Timestamped = Base => class extends Base {
    getTimestamp() {
        return Date.now();
    }
};
```

This is not automatically Bridge.

Mixins compose behavior into a single hierarchy. Bridge explicitly separates abstraction and implementation so the two
dimensions can vary independently.

If the design requires combinations of independent abstractions and implementations, composition is generally clearer
than creating increasingly complex mixin combinations.

## Bridge and Dependency Ownership

The abstraction should not generally own the lifecycle of an implementation unless that is part of the design.

For example:

```js
class Report {
    constructor(formatter) {
        this.formatter = formatter;
    }
}
```

If the formatter is shared infrastructure, the report should not arbitrarily destroy it.

Lifecycle ownership should be determined separately from the bridge relationship.

This is particularly important when implementations hold:

* network connections;
* database clients;
* worker resources;
* file handles;
* browser resources;
* native resources.

## Bridge and Statefulness

The implementation side may be stateless or stateful.

```js
class PdfFormatter {
    format(document) {
        // ...
    }
}
```

or:

```js
class StatefulRenderer {
    constructor(context) {
        this.context = context;
    }

    drawCircle() {
        // Uses renderer state
    }
}
```

Bridge does not impose a particular state-management model.

However, if implementation instances are shared, their state must be safe for all abstractions using them.

## Bridge and Immutability

Immutable abstraction objects can still use mutable implementations, and mutable abstractions can use immutable
implementations.

For example:

```js
class Circle {
    constructor(renderer, radius) {
        this.renderer = renderer;
        this.radius = radius;
    }

    draw() {
        return this.renderer.drawCircle(this.radius);
    }
}
```

The bridge relationship is independent of whether either side is mutable.

## Bridge and Performance

Bridge introduces an additional level of indirection.

A call may travel through the abstraction before reaching the implementation:

```js
shape.draw();
```

which delegates to:

```js
renderer.drawCircle();
```

In normal application code, this overhead is usually negligible compared with the benefits of independent variation.

Performance can matter in extremely hot paths, but removing Bridge solely to eliminate one method call should be
justified by measurement rather than assumption.

## Testing Bridge Designs

Bridge makes the abstraction and implementation dimensions independently testable.

The abstraction can be tested with a test implementation:

```js
class TestRenderer {
    drawCircle() {
        this.called = true;
    }
}

const renderer = new TestRenderer();
const circle = new Circle(renderer);

circle.draw();

console.assert(renderer.called === true);
```

The implementation can also be tested independently.

This reduces the need for every abstraction test to exercise a real platform, renderer, storage engine, or external
system.

## Contract Testing

The implementation side can have a common contract.

```js
function testRendererContract(createRenderer) {
    const renderer = createRenderer();

    renderer.drawCircle();
    renderer.drawRectangle();
}
```

Every concrete renderer can then be tested against the same behavioral expectations.

This is especially useful when many implementations must remain compatible with the abstraction.

## Adding New Abstractions

One of the main benefits of Bridge is the ability to add abstraction variants without creating implementation-specific
subclasses.

```js
class Triangle extends Shape {
    draw() {
        this.renderer.drawTriangle();
    }
}
```

Existing renderers must support the new operation if the implementation contract requires it.

If adding a new abstraction frequently requires modifying every implementation, the implementation interface may need
reconsideration.

Bridge does not make every dimension completely independent from every operation. It establishes a controlled dependency
between the two.

## Adding New Implementations

Adding an implementation should not require changes to the abstraction hierarchy.

```js
class WebGLRenderer extends Renderer {
    drawCircle() {
        // WebGL
    }

    drawRectangle() {
        // WebGL
    }
}
```

Existing abstractions can immediately use it:

```js
const circle = new Circle(
    new WebGLRenderer()
);
```

This is one of the clearest benefits of the pattern.

## Migration to Bridge

Bridge is often introduced when an inheritance hierarchy has begun to exhibit combinatorial growth.

Suppose the system contains:

```js
class PdfInvoice {
}

class HtmlInvoice {
}

class PdfReport {
}

class HtmlReport {
}
```

A refactoring can identify the independent dimensions:

```js
class Invoice {
}

class Report {
}
```

and:

```js
class PdfFormatter {
}

class HtmlFormatter {
}
```

The abstraction then delegates to the formatter.

The migration should preserve the existing behavior while moving the independent implementation dimension behind
composition.

## Recognizing a Bridge Refactoring

A Bridge refactoring is a strong candidate when:

* a hierarchy contains repeated combinations of two dimensions;
* adding one variation requires adding several classes;
* abstraction classes contain implementation-specific conditionals;
* platform-specific logic is embedded in domain abstractions;
* multiple implementations need to support the same abstraction;
* the two dimensions are expected to evolve independently.

A useful diagnostic question is:

**If I add another abstraction variant, must I create or modify classes for every implementation variant?**

If the answer is repeatedly yes, Bridge may be appropriate.

## Common Misuse

### Calling Every Composition Relationship Bridge

Composition alone does not establish Bridge.

A class receiving a dependency is not automatically an example of Bridge.

There must be meaningful independent variation between abstraction and implementation.

### Using Bridge for Simple Dependency Injection

This:

```js
class Service {
    constructor(repository) {
        this.repository = repository;
    }
}
```

may simply be dependency injection.

If there is no independently varying abstraction/implementation hierarchy, calling it Bridge adds little value.

### Using Bridge for Interface Compatibility

If the main problem is that an existing object exposes the wrong interface, Adapter is more appropriate.

### Creating an Artificial Implementation Hierarchy

Do not create a separate implementation abstraction merely to satisfy the pattern.

If there is only one implementation and no realistic independent variation, a bridge may introduce unnecessary
complexity.

### Excessive Abstraction

A bridge can become difficult to understand when the abstraction and implementation interfaces are both large and
unstable.

The implementation contract should represent a coherent dimension of variation.

### Leaking the Implementation

Clients should not need to know which implementation is behind the abstraction.

Bad:

```js
shape.renderer.drawCircle();
```

Better:

```js
shape.draw();
```

The abstraction should remain the client-facing contract.

## Refactoring Toward Bridge

A practical refactoring process is:

1. Identify the two dimensions that vary independently.
2. Identify classes representing combinations of those dimensions.
3. Extract the implementation-specific operations into an implementation contract.
4. Create concrete implementation objects.
5. Store the implementation in the abstraction through composition.
6. Delegate implementation-specific work through that contract.
7. Remove implementation-specific inheritance from the abstraction hierarchy.
8. Verify that new abstraction and implementation variants can be introduced independently.

The important step is identifying genuine independent dimensions before introducing the bridge.

## Refactoring Away from Bridge

A Bridge should be reconsidered when the supposed dimensions no longer vary independently.

For example, if there is only one implementation and no realistic possibility of another, maintaining a separate
implementation hierarchy may be unnecessary.

Likewise, if the abstraction and implementation always change together and have no meaningful independent lifecycle or
evolution, a simpler design may be preferable.

Possible simplifications include:

* direct composition without a formal bridge abstraction;
* a single concrete class;
* a simple strategy;
* a direct dependency;
* a function;
* a facade;
* an adapter.

The goal is not to preserve the pattern. The goal is to preserve a useful separation of concerns.

## Architectural Boundaries

Bridge is useful when an architectural abstraction must remain independent from one of several implementation
technologies.

Examples include:

* domain model and persistence technology;
* UI abstraction and platform implementation;
* message abstraction and transport;
* document abstraction and rendering format;
* storage abstraction and storage engine;
* application service and infrastructure mechanism.

The distinction from Adapter remains important.

If the abstraction is deliberately designed first and several implementation mechanisms are expected to evolve
independently, Bridge is a strong fit.

If an existing external API must be made compatible with an existing application contract, Adapter is generally the more
precise pattern.

## Bridge and Ports and Adapters Architecture

Bridge and ports-and-adapters architecture can coexist, but they describe different levels of design.

A port defines an application-facing contract:

```js
class PaymentPort {
    charge(payment) {
        // Contract
    }
}
```

An adapter translates an external system into that port.

Bridge may be used internally when the application abstraction and implementation mechanisms themselves constitute
independently varying dimensions.

Therefore, not every infrastructure adapter is a Bridge. Architectural terminology should remain precise.

## Bridge and Factories

Factories are often useful for constructing the correct bridge configuration.

```js
function createReport(format) {
    const formatter =
        format === "pdf"
            ? new PdfFormatter()
            : new HtmlFormatter();

    return new Report(formatter);
}
```

The factory selects and constructs the implementation.

The Bridge separates the report abstraction from the formatter implementation.

These responsibilities should not be conflated.

## Bridge and Abstract Factory

Abstract Factory can create families of compatible bridge implementations.

For example:

```js
class PlatformFactory {
    createWindow() {
    }

    createButton() {
    }

    createMenu() {
    }
}
```

A platform-specific factory can provide a consistent family of implementations.

Bridge can then separate the high-level UI abstraction from the platform implementation.

The patterns can therefore cooperate rather than compete.

## Bridge and Service Architecture

A service abstraction can be separated from transport or infrastructure implementations.

For example:

```js
class NotificationService {
    constructor(provider) {
        this.provider = provider;
    }

    notify(message) {
        return this.provider.send(message);
    }
}
```

Different providers can implement the delivery mechanism.

However, the design should only be called Bridge when the provider dimension is intentionally separated as an
independently evolving implementation dimension. Otherwise, this may simply be dependency injection or Strategy.

## Bridge and Distributed Systems

Bridge itself does not imply remote communication.

The implementation may be:

* local;
* remote;
* asynchronous;
* synchronous;
* in-process;
* network-backed.

A remote implementation does not make the design Bridge automatically.

For example, a local abstraction delegating to a remote transport may also involve Proxy or Adapter depending on the
semantics.

The pattern classification should be based on the separation of abstraction and implementation, not on deployment
topology.

## Benefits

Bridge provides:

* independent evolution of abstraction and implementation;
* reduced combinatorial class growth;
* replacement of inheritance combinations with composition;
* clearer separation of platform-specific behavior;
* improved testability;
* runtime implementation selection;
* reduced coupling to concrete implementations;
* easier addition of new implementation variants;
* easier addition of new abstraction variants;
* better containment of implementation-specific concerns.

## Costs

Bridge introduces:

* additional abstraction;
* additional indirection;
* more types or objects;
* an implementation contract that must be maintained;
* additional design complexity;
* potential difficulty identifying the correct dimensions;
* coupling between the abstraction contract and implementation contract;
* more complicated object construction.

Bridge is most valuable when the dimensions genuinely vary independently. If they do not, the separation can become
unnecessary architecture.

## Decision Criteria

Bridge is a strong candidate when most of these conditions hold:

| Question                                                                     | Bridge signal |
|------------------------------------------------------------------------------|---------------|
| Are there two meaningful dimensions of variation?                            | Yes           |
| Do both dimensions need to evolve independently?                             | Yes           |
| Would inheritance create combinations of the dimensions?                     | Yes           |
| Can the implementation be expressed through a stable contract?               | Yes           |
| Should clients depend on the abstraction rather than implementation details? | Yes           |
| Should implementations be replaceable without changing abstractions?         | Yes           |
| Is the separation valuable enough to justify another abstraction boundary?   | Yes           |

If the main problem is interface incompatibility, use Adapter.

If the main problem is interchangeable algorithms, consider Strategy.

If the main problem is simplifying a complex subsystem, consider Facade.

If the main problem is adding responsibilities while preserving an interface, consider Decorator.

## Summary

Bridge separates an abstraction from its implementation so that both can vary independently.

Its defining characteristic is **two independently changing dimensions**, not merely composition, delegation, dependency
injection, or the existence of multiple implementations.

The abstraction exposes the client-facing behavior. The implementation hierarchy contains technology- or
mechanism-specific behavior. The bridge between them is normally established through composition.

Bridge is particularly useful when inheritance would otherwise produce a combinatorial explosion of classes representing
every abstraction/implementation combination.

The decisive question is:

**Do I have two dimensions that should evolve independently, and would coupling them force me to create combinations of
those dimensions?**

If yes, Bridge is a strong candidate. If the problem is instead adapting an existing incompatible interface, the
appropriate pattern is Adapter.

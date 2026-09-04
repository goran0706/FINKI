# Template Method

## Intent

**Template Method defines the skeleton of an algorithm in a base class while allowing subclasses to redefine selected
steps without changing the overall algorithm structure.**

The pattern separates **algorithm structure** from **variable implementation steps**. The base class controls the
sequence and invariant parts of the operation, while subclasses provide or customize specific steps.

Template Method is primarily an inheritance-based mechanism. A superclass owns the algorithm's control flow, and
subclasses specialize designated operations. In modern JavaScript and TypeScript, the same design can sometimes be
expressed through composition or functions, but those alternatives should not automatically be called Template Method.
The defining characteristic is that a common algorithm skeleton is established while controlled extension points are
provided for subclasses.

## Problem

Several related classes need to perform the same overall operation, but certain steps differ between implementations.

Without a shared algorithm structure, each class may implement the complete operation independently:

```js
class CsvProcessor {
    process() {
        this.open();
        this.read();
        this.parse();
        this.validate();
        this.save();
        this.close();
    }

    // ...
}

class JsonProcessor {
    process() {
        this.open();
        this.read();
        this.parse();
        this.validate();
        this.save();
        this.close();
    }

    // ...
}
```

The implementations may initially look harmless, but the duplication creates several problems. The ordering of steps can
diverge, fixes must be applied to multiple classes, and subclasses can accidentally omit or reorder operations that are
supposed to remain invariant.

The deeper problem is that the system has a **common algorithmic structure with controlled variation**, but that
structure has not been given a single owner.

Template Method moves that structure into a base class:

```js
class DataProcessor {
    process() {
        this.open();
        this.read();
        this.parse();
        this.validate();
        this.save();
        this.close();
    }

    open() {
    }

    read() {
    }

    parse() {
    }

    validate() {
    }

    save() {
    }

    close() {
    }
}
```

Subclasses then specialize the steps that actually vary.

## Structure

A Template Method implementation normally contains three conceptual elements.

### Abstract Class

The abstract class owns the algorithm skeleton. It defines the Template Method and determines the order in which
operations occur.

The algorithm skeleton should contain the steps whose ordering and coordination are part of the invariant behavior.

In TypeScript, this can be represented explicitly:

```ts
abstract class DataProcessor {
    process(): void {
        this.open();
        this.read();
        this.parse();
        this.validate();
        this.save();
        this.close();
    }

    protected abstract open(): void;

    protected abstract read(): void;

    protected abstract parse(): void;

    protected abstract validate(): void;

    protected abstract save(): void;

    protected close(): void {
    }
}
```

The important property is that subclasses do not redefine `process()` merely to change one implementation detail. They
implement the designated extension points.

### Template Method

The Template Method is the operation containing the algorithm's fixed sequence.

```js
process()
{
    this.open();
    this.read();
    this.parse();
    this.validate();
    this.save();
    this.close();
}
```

The Template Method should normally have a stable structure. Its purpose is to prevent subclasses from having to
reconstruct the algorithm themselves.

A Template Method does not have to be literally named `process`. Names such as `execute`, `run`, `build`, `handle`,
`generate`, `export`, or `perform` can serve the same role.

### Primitive Operations

Primitive operations are the individual steps used by the Template Method.

Some are abstract and must be implemented by subclasses:

```ts
protected abstract
parse()
:
void;
```

Others can have default implementations:

```ts
protected
validate()
:
void {
    // Default validation
}
```

Others can be optional hooks:

```ts
protected
beforeSave()
:
void {}
```

The base class therefore controls which parts of the algorithm are fixed and which parts are extensible.

## Algorithm Skeleton

The central concept in Template Method is the **algorithm skeleton**.

The skeleton represents the sequence and coordination rules that should remain consistent across implementations.

For example:

```js
class ReportGenerator {
    generate() {
        this.loadData();
        this.transformData();
        this.render();
        this.writeOutput();
    }

    loadData() {
    }

    transformData() {
    }

    render() {
    }

    writeOutput() {
    }
}
```

The subclasses are responsible for the variable operations, but they do not decide that `writeOutput()` should happen
before `render()`.

This distinction is important because Template Method is not merely about sharing code. It establishes **control over
algorithm structure**.

A useful design question is:

> Which parts of this operation must always happen in this order, regardless of the implementation?

Those parts belong in the Template Method.

The next question is:

> Which individual steps vary between implementations?

Those steps become overridable operations or hooks.

## Fixed Steps and Variable Steps

A good Template Method explicitly distinguishes invariant operations from extension points.

```ts
abstract class Importer {
    import(): void {
        this.connect();
        const source = this.readSource();
        const records = this.parse(source);
        this.validate(records);
        this.persist(records);
        this.disconnect();
    }

    protected connect(): void {
        // Shared behavior
    }

    protected abstract readSource(): string;

    protected abstract parse(source: string): unknown[];

    protected validate(records: unknown[]): void {
        // Shared validation
    }

    protected abstract persist(records: unknown[]): void;

    protected disconnect(): void {
        // Shared cleanup
    }
}
```

Here the connection and cleanup behavior is shared, parsing and persistence vary, and the ordering is controlled by the
base class.

This gives the hierarchy a clear responsibility:

* The base class owns **when** operations happen.
* Subclasses own **how** designated operations happen.

That division is one of the defining properties of Template Method.

## Hook Methods

A hook is an extension point with a default implementation.

```js
class Exporter {
    export() {
        this.prepare();
        this.writeHeader();
        this.writeBody();
        this.writeFooter();

        if (this.shouldCompress()) {
            this.compress();
        }
    }

    prepare() {
    }

    writeHeader() {
    }

    writeBody() {
    }

    writeFooter() {
    }

    shouldCompress() {
        return false;
    }

    compress() {
    }
}
```

A hook does not necessarily represent a required operation. It can allow subclasses to influence a decision or inject
optional behavior.

Hooks are particularly useful when the base algorithm should remain fixed but certain implementations need additional
behavior.

However, excessive hooks can make a base class difficult to understand. Every hook becomes another extension point whose
interaction with the rest of the algorithm must be reasoned about.

## Abstract Operations

Abstract operations represent required variation.

```ts
abstract class PaymentProcessor {
    process(): void {
        this.validate();
        const payment = this.createPayment();
        this.authorize(payment);
        this.capture(payment);
    }

    protected abstract validate(): void;

    protected abstract createPayment(): Payment;

    protected abstract authorize(payment: Payment): void;

    protected abstract capture(payment: Payment): void;
}
```

A concrete subclass must implement those operations.

Abstract operations are appropriate when the base class cannot provide a meaningful default implementation and every
concrete implementation must supply the behavior.

Default implementations are preferable when a sensible shared behavior exists.

## Protected Extension Points

Template Method commonly relies on `protected` methods because the operations are intended to be used by the base class
and specialized by subclasses rather than exposed as public API.

```ts
abstract class DocumentProcessor {
    public process(): void {
        this.load();
        this.transform();
        this.save();
    }

    protected abstract load(): void;

    protected abstract transform(): void;

    protected save(): void {
        console.log("Saving document");
    }
}
```

The public API exposes the high-level operation:

```ts
processor.process();
```

The implementation details remain internal to the hierarchy.

This is an important encapsulation boundary. Callers should generally invoke the Template Method rather than directly
invoking individual primitive operations.

## Preventing Template Method Override

In languages with stronger language-level support, a Template Method can sometimes be made non-overridable. JavaScript
and TypeScript do not provide a direct `final` method equivalent for classes.

The design can nevertheless discourage overriding by keeping the Template Method public and the extension points
protected:

```ts
abstract class Processor {
    process(): void {
        this.initialize();
        this.execute();
        this.cleanup();
    }

    protected abstract initialize(): void;

    protected abstract execute(): void;

    protected abstract cleanup(): void;
}
```

TypeScript's `protected` modifier restricts normal external access, but it does not prevent a subclass from overriding
the method.

Therefore, the design relies partly on convention and API structure.

If preventing algorithm override is a strict requirement, composition may be a better fit than inheritance.

## Template Method with JavaScript Classes

JavaScript does not require a formal abstract class to implement the pattern.

A base class can provide the skeleton and subclasses can override methods:

```js
class FileProcessor {
    process(file) {
        this.open(file);
        const content = this.read(file);
        const result = this.parse(content);
        this.save(result);
        this.close(file);
    }

    open(file) {
        console.log(`Opening ${file}`);
    }

    read(file) {
        throw new Error("read() must be implemented");
    }

    parse(content) {
        throw new Error("parse() must be implemented");
    }

    save(result) {
        console.log("Saving result");
    }

    close(file) {
        console.log(`Closing ${file}`);
    }
}
```

A concrete implementation specializes the required operations:

```js
class JsonFileProcessor extends FileProcessor {
    read(file) {
        return fs.readFileSync(file, "utf8");
    }

    parse(content) {
        return JSON.parse(content);
    }
}
```

The algorithm remains owned by `FileProcessor`.

## Template Method with TypeScript

TypeScript is particularly useful for documenting Template Method contracts.

```ts
abstract class FileProcessor<T> {
    process(file: string): T {
        this.open(file);

        const content = this.read(file);
        const result = this.parse(content);

        this.save(result);
        this.close(file);

        return result;
    }

    protected open(file: string): void {
    }

    protected abstract read(file: string): string;

    protected abstract parse(content: string): T;

    protected save(result: T): void {
    }

    protected close(file: string): void {
    }
}
```

A concrete implementation can specialize the generic result type:

```ts
class JsonProcessor extends FileProcessor<Record<string, unknown>> {
    protected read(file: string): string {
        return fs.readFileSync(file, "utf8");
    }

    protected parse(content: string): Record<string, unknown> {
        return JSON.parse(content);
    }
}
```

The generic type makes the relationship between the variable step and the overall operation explicit.

## Inheritance as the Variation Mechanism

Template Method uses inheritance to vary selected operations.

The base class establishes the stable algorithm, while subclasses specialize its variation points.

This creates a strong coupling between the subclass and the base class. A subclass does not merely implement an
interface; it participates in an algorithm whose control flow it does not own.

That distinction matters when evaluating whether inheritance is appropriate.

Template Method is a good fit when the variation points naturally belong to a common abstraction and the algorithm
structure is stable enough to justify a shared superclass.

If the implementations need to vary independently, be selected dynamically, or be composed at runtime, composition-based
designs may be more appropriate.

## Runtime Polymorphism

Template Method relies on dynamic dispatch.

When the base class executes:

```js
this.parse(data);
```

the actual implementation can come from the concrete subclass.

The base class therefore controls the call site while polymorphism determines the implementation.

This is sometimes called a **Hollywood Principle** relationship: the base algorithm controls the lifecycle and calls
subclass-provided operations rather than requiring subclasses to orchestrate the lifecycle themselves.

The practical consequence is that subclasses participate in a controlled lifecycle rather than owning the entire
workflow.

## Inversion of Control

Template Method is a form of inversion of control.

A conventional subclass might implement the complete operation:

```js
class Processor {
    process() {
        // Entire algorithm controlled here
    }
}
```

With Template Method, the superclass controls the algorithm and invokes specialized operations:

```js
class Processor {
    process() {
        this.stepA();
        this.stepB();
        this.stepC();
    }

    stepA() {
    }

    stepB() {
    }

    stepC() {
    }
}
```

The subclass supplies behavior, but the superclass determines when that behavior executes.

This is stronger than ordinary method overriding because the overriding method is being invoked as part of a larger
algorithm owned by the base class.

## Multiple Extension Points

A Template Method can contain several primitive operations and hooks.

```js
class OrderProcessor {
    process(order) {
        this.validate(order);
        this.calculateTotals(order);
        this.applyDiscounts(order);
        this.persist(order);
        this.publish(order);
    }

    validate(order) {
    }

    calculateTotals(order) {
    }

    applyDiscounts(order) {
    }

    persist(order) {
    }

    publish(order) {
    }
}
```

This can be appropriate when the entire workflow is genuinely stable.

However, a growing number of extension points can indicate that the base class is trying to model too many independent
dimensions of variation.

A hierarchy with ten or twenty hooks may technically implement Template Method while being architecturally difficult to
maintain.

At that point, the varying operations may need to become separate collaborators.

## Hook Ordering

The ordering of extension points is part of the Template Method contract.

Consider:

```js
class Processor {
    process() {
        this.before();
        this.execute();
        this.after();
    }

    before() {
    }

    execute() {
    }

    after() {
    }
}
```

A subclass cannot generally treat these operations as independent. Their order has semantic meaning.

Changing the order can therefore be a breaking change even if the public method signature remains unchanged.

This is one reason Template Method base classes require careful maintenance. The superclass owns a behavioral contract
that extends beyond its visible method signatures.

## Hooks with Conditional Execution

Hooks can participate in conditional parts of the algorithm.

```js
class ReportProcessor {
    process(report) {
        this.load(report);

        if (this.shouldTransform(report)) {
            this.transform(report);
        }

        this.save(report);
    }

    load(report) {
    }

    shouldTransform(report) {
        return true;
    }

    transform(report) {
    }

    save(report) {
    }
}
```

The base class controls the conditional structure while subclasses can influence whether a step occurs.

This is useful when the condition itself is a legitimate variation point.

It becomes problematic when subclasses can indirectly disable large portions of the algorithm, because the resulting
behavior becomes difficult to reason about.

## State and Template Method

A Template Method may operate on mutable state owned by the base class.

```js
class Parser {
    process(input) {
        this.input = input;
        this.prepare();
        this.parse();
        this.validate();
        return this.result;
    }

    prepare() {
    }

    parse() {
    }

    validate() {
    }
}
```

This can be convenient, but it creates hidden coupling between steps.

The subclass implementation of `parse()` may depend on fields established by `prepare()`, while `validate()` may depend
on state produced by `parse()`.

When state dependencies become extensive, explicit parameters and return values can make the algorithm easier to
understand:

```ts
abstract class Processor {
    process(input: string): Result {
        const prepared = this.prepare(input);
        const parsed = this.parse(prepared);
        const validated = this.validate(parsed);

        return this.save(validated);
    }

    protected prepare(input: string): string {
        return input;
    }

    protected abstract parse(input: string): Parsed;

    protected validate(parsed: Parsed): Validated {
        return parsed as Validated;
    }

    protected abstract save(result: Validated): Result;
}
```

Explicit data flow reduces hidden dependencies between extension points.

## Resource Management

Template Method is useful when resource lifecycle is invariant.

```js
class ResourceProcessor {
    process(resource) {
        this.open(resource);

        try {
            return this.execute(resource);
        } finally {
            this.close(resource);
        }
    }

    open(resource) {
    }

    execute(resource) {
        throw new Error("execute() must be implemented");
    }

    close(resource) {
    }
}
```

The base class guarantees that cleanup occurs even when the variable operation fails.

This is one of the stronger applications of Template Method because the lifecycle itself is an invariant that subclasses
should not have to reproduce.

The same approach can be useful for transactions, locks, temporary resources, tracing scopes, metrics, and other
lifecycle-sensitive operations.

## Error Handling

The base algorithm can also establish common error-handling semantics.

```js
class JobProcessor {
    process(job) {
        this.before(job);

        try {
            const result = this.execute(job);
            this.afterSuccess(job, result);
            return result;
        } catch (error) {
            this.onError(job, error);
            throw error;
        } finally {
            this.after(job);
        }
    }

    before(job) {
    }

    execute(job) {
        throw new Error("execute() must be implemented");
    }

    afterSuccess(job, result) {
    }

    onError(job, error) {
    }

    after(job) {
    }
}
```

The superclass controls the lifecycle and ensures that success, failure, and cleanup behavior occur consistently.

This is particularly valuable when the error-handling policy is part of the invariant algorithm rather than an
implementation-specific concern.

## Asynchronous Template Methods

Template Method works with asynchronous operations.

```js
class DataProcessor {
    async process(input) {
        await this.initialize();

        const data = await this.load(input);
        const result = await this.transform(data);

        await this.save(result);
        await this.cleanup();
    }

    async initialize() {
    }

    async load(input) {
        throw new Error("load() must be implemented");
    }

    async transform(data) {
        throw new Error("transform() must be implemented");
    }

    async save(result) {
    }

    async cleanup() {
    }
}
```

The same structural principle applies: the base class controls the sequence while subclasses implement variable steps.

Asynchronous Template Methods must make failure and cancellation behavior explicit. A subclass that throws or rejects
from an extension point is participating in the base class's control flow, so the superclass must define whether
failures propagate, are transformed, retried, or trigger cleanup.

## Cancellation

If the algorithm supports cancellation, the cancellation contract should be established at the Template Method level.

```ts
abstract class Processor {
    async process(
        input: string,
        signal?: AbortSignal
    ): Promise<Result> {
        this.throwIfAborted(signal);

        const data = await this.load(input, signal);

        this.throwIfAborted(signal);

        const result = await this.transform(data, signal);

        this.throwIfAborted(signal);

        return this.save(result, signal);
    }

    protected throwIfAborted(signal?: AbortSignal): void {
        if (signal?.aborted) {
            throw new DOMException("Aborted", "AbortError");
        }
    }

    protected abstract load(
        input: string,
        signal?: AbortSignal
    ): Promise<Data>;

    protected abstract transform(
        data: Data,
        signal?: AbortSignal
    ): Promise<Result>;

    protected abstract save(
        result: Result,
        signal?: AbortSignal
    ): Promise<Result>;
}
```

The base algorithm can therefore define where cancellation boundaries exist instead of requiring every implementation to
establish them independently.

## Template Method and Strategy

Template Method and Strategy both address algorithmic variation, but they place control in different locations.

**Template Method uses inheritance to vary individual steps inside a fixed algorithm skeleton. Strategy uses composition
to replace an entire algorithm or policy.**

With Template Method, the base class owns the workflow:

```ts
abstract class ReportGenerator {
    generate(): void {
        this.load();
        this.transform();
        this.render();
    }

    protected abstract load(): void;

    protected abstract transform(): void;

    protected abstract render(): void;
}
```

With Strategy, the context delegates the algorithm to a separate collaborator:

```ts
interface Formatter {
    format(data: Data): string;
}

class ReportGenerator {
    constructor(private formatter: Formatter) {
    }

    generate(data: Data): string {
        return this.formatter.format(data);
    }
}
```

Template Method is appropriate when the **overall algorithm is fixed but selected steps vary**.

Strategy is appropriate when the **algorithm itself is replaceable**.

If different implementations need different sequencing rather than merely different step implementations, Strategy or
another composition-based design is often a better fit.

## Template Method and Factory Method

Template Method is frequently used together with Factory Method.

A Template Method may define the algorithm while one of its primitive operations creates an object:

```ts
abstract class ReportProcessor {
    process(): void {
        const report = this.createReport();
        this.populate(report);
        this.validate(report);
        this.publish(report);
    }

    protected abstract createReport(): Report;

    protected abstract populate(report: Report): void;

    protected validate(report: Report): void {
    }

    protected publish(report: Report): void {
    }
}
```

Here `createReport()` is a factory operation embedded inside a larger Template Method.

The concepts should remain distinct.

**Factory Method concerns how a product is created. Template Method concerns how a larger algorithm is structured.**

A Template Method may contain a factory method, but a factory method by itself does not constitute Template Method.

## Template Method and Adapter

Adapter changes an existing interface so that one component can work with another expected interface.

Template Method does not primarily reconcile incompatible interfaces. It establishes an algorithm skeleton and extension
points.

An Adapter answers:

> How can this existing component satisfy the interface this client expects?

Template Method answers:

> How can related implementations perform the same overall algorithm while varying selected steps?

These are different responsibilities.

## Template Method and Decorator

Decorator adds behavior by wrapping an object with another object implementing the same contract.

Template Method uses inheritance to vary steps within a superclass-defined algorithm.

Decorator can dynamically compose behavior:

```js
const service = new LoggingDecorator(
    new CachingDecorator(
        new Service()
    )
);
```

Template Method instead establishes the control flow in a base class:

```js
class Service {
    execute() {
        this.validate();
        this.perform();
        this.audit();
    }
}
```

Decorator changes behavior through composition around an object. Template Method changes selected behavior through
subclass specialization inside an algorithm.

## Template Method and Bridge

Bridge separates an abstraction from an implementation so both dimensions can vary independently.

Template Method does not primarily separate two independent dimensions. It establishes a common algorithm and allows
subclasses to specialize its steps.

If the abstraction and implementation need to evolve independently, Bridge or composition is generally more appropriate.

## Template Method and State

State changes an object's behavior according to its current state.

Template Method defines a stable algorithm with overridable steps.

A state object can determine which behavior applies because the Context is currently in a particular state. A Template
Method subclass represents a different implementation of a common algorithm.

If behavior changes because an object transitions between states during its lifetime, State is the more direct concept.

If behavior differs because separate implementations need different versions of a stable algorithm, Template Method may
be appropriate.

## Template Method and Chain of Responsibility

Chain of Responsibility distributes responsibility across a sequence of handlers.

Template Method establishes a fixed algorithmic sequence.

A Template Method can invoke several handlers, but the defining concern is still the algorithm skeleton. Chain of
Responsibility is appropriate when responsibility for handling a request may move between handlers.

The distinction is therefore between **fixed algorithm structure** and **responsibility selection or propagation**.

## Template Method and Command

Command encapsulates a request as an object.

Template Method defines how an operation executes.

A command can internally use a Template Method, but the concepts solve different problems. Command is concerned with
representing an operation so it can be passed, queued, logged, retried, scheduled, or undone. Template Method is
concerned with structuring the implementation of an operation.

## Template Method and Visitor

Visitor separates operations from an object structure.

Template Method can structure one operation, but it does not provide the same mechanism for adding many independent
operations across a stable element hierarchy.

If the primary requirement is adding new operations without changing element classes, Visitor may be more appropriate.

## Template Method and Functional Composition

JavaScript makes composition particularly convenient:

```js
function process(input, {
    load,
    transform,
    save
}) {
    const data = load(input);
    const result = transform(data);

    return save(result);
}
```

This has some of the same structural characteristics as Template Method, because the function owns the workflow while
callers supply variable steps.

However, it is not necessarily the GoF Template Method pattern because there is no inheritance-based class hierarchy.

The broader design principle is **fixed algorithm structure with replaceable steps**. Template Method is the
inheritance-based realization of that principle.

## Composition as an Alternative

Inheritance is not mandatory when the actual requirement is simply to centralize workflow.

Composition can express the same dependency explicitly:

```ts
interface Steps {
    load(input: string): Promise<Data>;

    transform(data: Data): Promise<Result>;

    save(result: Result): Promise<void>;
}

class Processor {
    constructor(private readonly steps: Steps) {
    }

    async process(input: string): Promise<void> {
        const data = await this.steps.load(input);
        const result = await this.steps.transform(data);

        await this.steps.save(result);
    }
}
```

This design allows implementations to be selected dynamically and reused independently.

The trade-off is that the extension points are now explicit collaborators rather than subclass methods.

Composition is often preferable when the varying behavior has an independent lifecycle, can be shared by unrelated
classes, or must be selected at runtime.

## Subclass Coupling

Template Method creates a strong relationship between the base class and subclasses.

A subclass depends on:

* the names of extension points;
* the arguments supplied to those points;
* the order in which they execute;
* the state established before they execute;
* the assumptions made after they return;
* the error behavior of the surrounding algorithm;
* the lifecycle established by the superclass.

Consequently, changing the Template Method can affect every subclass even when no public method signature changes.

This is one of the primary costs of the pattern.

## Fragile Base Class Problem

Template Method is particularly exposed to the **fragile base class problem**.

A seemingly harmless change in the superclass can break subclasses.

For example:

```js
process()
{
    this.load();
    this.validate();
    this.transform();
    this.save();
}
```

Changing the sequence to:

```js
process()
{
    this.load();
    this.transform();
    this.validate();
    this.save();
}
```

may break subclasses that implicitly depended on validation occurring before transformation.

Likewise, introducing a new hook can affect subclasses that were never designed to handle it.

The more subclass implementations depend on implicit behavior, the more carefully the base class must evolve.

## Extension Point Design

Extension points should be deliberately chosen.

A good extension point represents a meaningful unit of variation:

```js
protected
abstract
serialize(value)
:
string;
```

A poor extension point exposes an implementation detail:

```js
protected
setInternalBufferPosition(position)
:
void;
```

The former represents a domain-level variation. The latter exposes internal mechanics that may not remain stable.

Template Method becomes more maintainable when its extension points correspond to stable conceptual responsibilities.

## Granularity of Template Steps

Template steps should generally be large enough to represent meaningful behavior but small enough to isolate genuine
variation.

Overly coarse steps reduce reuse:

```js
this.executeEverything();
```

Overly fine-grained steps produce excessive hooks:

```js
this.stepA();
this.stepB();
this.stepC();
this.stepD();
this.stepE();
this.stepF();
this.stepG();
```

A useful Template Method usually has a small number of semantically meaningful operations.

The exact number is less important than whether each operation represents an intentional variation point.

## Shared Invariants

One of the strongest reasons to use Template Method is to protect invariants.

Suppose every payment workflow must:

1. validate the request;
2. reserve required resources;
3. perform the payment operation;
4. record the result;
5. release resources.

If each subclass owns the entire workflow, one implementation may accidentally omit resource release.

A Template Method can centralize that invariant:

```js
class PaymentProcessor {
    process(payment) {
        this.validate(payment);
        this.reserve(payment);

        try {
            const result = this.execute(payment);
            this.record(result);
            return result;
        } finally {
            this.release(payment);
        }
    }

    validate(payment) {
    }

    reserve(payment) {
    }

    execute(payment) {
        throw new Error("execute() must be implemented");
    }

    record(result) {
    }

    release(payment) {
    }
}
```

The superclass owns the lifecycle guarantee while subclasses provide the variable operation.

## Template Method and the Open/Closed Principle

Template Method can support the Open/Closed Principle by allowing new algorithm variants to be introduced through
subclasses without modifying the algorithm skeleton.

```js
class JsonProcessor extends Processor {
    parse(input) {
        return JSON.parse(input);
    }
}

class XmlProcessor extends Processor {
    parse(input) {
        return parseXml(input);
    }
}
```

The base algorithm remains unchanged.

However, this benefit depends on the variation actually fitting the predefined extension points. If every new
implementation requires modifying the base class, the hierarchy is not providing meaningful closed extension.

## Dependency Injection

Template Method and dependency injection can coexist.

A base class can receive shared dependencies:

```ts
abstract class Processor {
    constructor(
        protected readonly logger: Logger
    ) {
    }

    process(): void {
        this.logger.info("Starting");
        this.execute();
        this.logger.info("Finished");
    }

    protected abstract execute(): void;
}
```

Subclasses then implement the varying behavior while the base class owns the common lifecycle.

Dependency injection does not make the design a Strategy. The distinction depends on whether the variable behavior is
represented as subclass specialization or as an independently injected algorithm object.

## Factories and Template Method

A factory can create concrete Template Method implementations:

```ts
function createProcessor(type: string): Processor {
    switch (type) {
        case "json":
            return new JsonProcessor();
        case "xml":
            return new XmlProcessor();
        default:
            throw new Error(`Unsupported processor: ${type}`);
    }
}
```

The factory controls which subclass is instantiated. Template Method controls how the selected subclass executes its
algorithm.

These mechanisms can therefore work together without being conceptually identical.

## Testing

Template Method implementations should be tested at two levels.

The base algorithm should be tested for invariant behavior:

* correct operation ordering;
* required steps always executing;
* cleanup occurring after success and failure;
* hooks receiving the correct data;
* errors propagating according to the contract;
* cancellation occurring at the intended boundaries.

Concrete subclasses should be tested for their specialized operations.

A recording subclass can make ordering observable:

```js
class TestProcessor extends Processor {
    events = [];

    load() {
        this.events.push("load");
    }

    transform() {
        this.events.push("transform");
    }

    save() {
        this.events.push("save");
    }
}
```

The test can then verify the algorithm's invariant sequence without depending on production side effects.

## Testing Extension Contracts

Because subclasses depend on the base-class lifecycle, tests should also verify extension contracts.

For example, if `transform()` is documented as receiving validated data, a regression test should ensure that validation
still precedes transformation.

This is particularly important when a hierarchy contains many implementations maintained by different teams.

Contract-oriented tests can protect the assumptions shared by the superclass and subclasses.

## Performance

Template Method usually has negligible performance overhead compared with the operations performed by the algorithm.

The main cost is dynamic method dispatch and the additional abstraction associated with the class hierarchy.

Performance problems are more likely to result from the actual hooks, allocations, I/O, serialization, or asynchronous
operations than from the Template Method mechanism itself.

If extremely performance-sensitive code uses many tiny virtual method calls in a hot loop, a flatter or data-oriented
design may be preferable. This should be demonstrated by profiling rather than assumed from the pattern alone.

## Concurrency and Reentrancy

Template Method implementations must define whether instances are reusable and whether concurrent execution is
supported.

A stateful base class can become unsafe:

```js
class Processor {
    process(input) {
        this.input = input;
        this.prepare();
        this.execute();
        return this.result;
    }
}
```

Concurrent calls on the same instance can overwrite shared state.

Prefer local variables when possible:

```js
class Processor {
    process(input) {
        const prepared = this.prepare(input);
        return this.execute(prepared);
    }

    prepare(input) {
        return input;
    }

    execute(input) {
        throw new Error("execute() must be implemented");
    }
}
```

Stateless Template Methods are generally easier to reuse safely.

## Lifecycle Ownership

The base class should clearly own lifecycle operations that are invariant.

For example:

```js
class ConnectionProcessor {
    async process() {
        const connection = await this.connect();

        try {
            return await this.execute(connection);
        } finally {
            await this.disconnect(connection);
        }
    }

    async connect() {
        throw new Error("connect() must be implemented");
    }

    async execute(connection) {
        throw new Error("execute() must be implemented");
    }

    async disconnect(connection) {
    }
}
```

This prevents each subclass from having to reproduce connection management and makes cleanup part of the algorithm's
invariant structure.

Lifecycle ownership should not be divided ambiguously between superclass and subclass.

## Serialization and Persistence

A Template Method can structure serialization or persistence workflows:

```js
class Repository {
    save(entity) {
        const validated = this.validate(entity);
        const record = this.serialize(validated);
        const stored = this.persist(record);

        return this.deserialize(stored);
    }

    validate(entity) {
        return entity;
    }

    serialize(entity) {
        throw new Error("serialize() must be implemented");
    }

    persist(record) {
        throw new Error("persist() must be implemented");
    }

    deserialize(record) {
        return record;
    }
}
```

This can be appropriate when the lifecycle is genuinely shared while storage representation varies.

However, if storage mechanisms themselves are independent infrastructure components, a repository using injected
strategies or ports may provide better separation.

## Plugin-Like Extension

Template Method can provide controlled subclass extension points in frameworks.

A framework may own the lifecycle:

```js
class Application {
    run() {
        this.initialize();
        this.execute();
        this.shutdown();
    }

    initialize() {
    }

    execute() {
    }

    shutdown() {
    }
}
```

Applications subclass the framework and provide implementation-specific behavior.

This resembles framework lifecycle hooks and is one of the practical reasons Template Method remains relevant despite
modern preference for composition.

The framework effectively controls the lifecycle while application code supplies designated extension points.

## When Template Method Becomes a Framework Problem

A Template Method hierarchy can evolve into a miniature framework.

This happens when the superclass accumulates:

* many hooks;
* lifecycle callbacks;
* configuration flags;
* conditional branches;
* shared mutable state;
* hook-specific contracts;
* ordering dependencies;
* subclass-specific exceptions;
* undocumented assumptions.

At that point, understanding a concrete implementation requires reading both the subclass and a large portion of the
superclass.

This is a sign that the abstraction may be too broad.

The appropriate response is often to extract independent collaborators rather than adding more hooks.

## Refactoring Toward Template Method

Template Method is a useful refactoring when several subclasses contain duplicated algorithm structure.

Suppose multiple classes contain nearly identical methods:

```js
class JsonProcessor {
    process(input) {
        const data = load(input);
        const parsed = JSON.parse(data);
        validate(parsed);
        save(parsed);
    }
}

class XmlProcessor {
    process(input) {
        const data = load(input);
        const parsed = parseXml(data);
        validate(parsed);
        save(parsed);
    }
}
```

The duplicated sequence can become a Template Method:

```js
class Processor {
    process(input) {
        const data = this.load(input);
        const parsed = this.parse(data);

        this.validate(parsed);
        this.save(parsed);

        return parsed;
    }

    load(input) {
        return load(input);
    }

    parse(data) {
        throw new Error("parse() must be implemented");
    }

    validate(data) {
        validate(data);
    }

    save(data) {
        save(data);
    }
}
```

The refactoring is justified when the duplicated sequence is genuinely invariant.

If the implementations only happen to resemble each other today but are expected to evolve independently, forcing them
into one hierarchy may create inappropriate coupling.

## Recognizing an Opportunity

Template Method is a candidate when several implementations exhibit most of the following characteristics:

* the same high-level operation exists across classes;
* the steps occur in substantially the same order;
* some steps have different implementations;
* certain steps are invariant;
* the algorithm has meaningful lifecycle or ordering rules;
* subclasses naturally represent specialized forms of the same abstraction;
* controlling the workflow centrally is valuable.

The strongest signal is not code duplication alone. It is **duplicated algorithm structure with stable ordering and
localized variation**.

## Common Misuse

### Using Template Method for Unrelated Classes

Classes that happen to have similarly named methods do not necessarily belong in one Template Method hierarchy.

Similarity of syntax is not sufficient. There should be a meaningful common algorithm and abstraction.

### Using Inheritance Only to Share Utility Methods

If subclasses exist merely to reuse helper methods, Template Method may be the wrong abstraction.

A utility module, shared service, composition, or injected collaborator may be more appropriate.

### Too Many Hooks

A base class with dozens of hooks often indicates that independent responsibilities have been forced into one hierarchy.

Extracting collaborators can reduce coupling and make variation explicit.

### Overriding the Template Method

If subclasses routinely override the Template Method itself, the superclass is no longer reliably controlling the
algorithm.

This is a strong signal that the hierarchy may not actually represent Template Method effectively.

### Hidden Hook Contracts

Hooks whose behavior depends on undocumented state or execution order create fragile subclasses.

The contract of each extension point should be explicit.

### Using Template Method When Runtime Selection Is Required

If the algorithm must be selected dynamically based on configuration, user input, tenant, request type, or runtime
capability, Strategy or another composition-based design may be more appropriate.

Subclass selection is usually less flexible than object composition.

### Treating Every Callback-Based Workflow as Template Method

Callbacks can create fixed workflows with variable steps, but the GoF Template Method specifically concerns a
superclass-defined algorithm with subclass-overridable operations.

Functional composition may express the same design principle without being the same pattern.

## Modern JavaScript Considerations

Modern JavaScript reduces the need for inheritance-based Template Method in many situations.

Higher-order functions, closures, modules, dependency injection, object composition, and first-class functions can all
express controlled algorithm variation without a class hierarchy.

For example:

```js
function process(input, steps) {
    const loaded = steps.load(input);
    const transformed = steps.transform(loaded);
    return steps.save(transformed);
}
```

This can be easier to test and compose than inheritance.

Template Method remains useful when the implementation hierarchy itself represents a meaningful domain relationship and
the superclass genuinely owns invariant lifecycle or algorithmic behavior.

The question should therefore not be whether Template Method is an old pattern, but whether **inheritance is the right
mechanism for the particular variation**.

## Template Method with Private Fields

JavaScript private fields can be used for state that must remain inaccessible to subclasses:

```js
class Processor {
    #startedAt;

    process() {
        this.#startedAt = Date.now();

        try {
            return this.execute();
        } finally {
            this.cleanup();
        }
    }

    execute() {
        throw new Error("execute() must be implemented");
    }

    cleanup() {
    }
}
```

This can be useful when the base class owns internal invariants that subclasses should not manipulate directly.

However, native private fields cannot be accessed by subclasses. If an extension point genuinely needs shared protected
state, the design must instead expose controlled methods or use another state-management approach.

## TypeScript Visibility and Contracts

TypeScript's visibility modifiers can communicate the intended hierarchy boundary:

```ts
abstract class Processor {
    public process(): void {
        this.prepare();
        this.execute();
        this.cleanup();
    }

    protected prepare(): void {
    }

    protected abstract execute(): void;

    protected cleanup(): void {
    }
}
```

`public` identifies the externally callable operation. `protected` identifies subclass extension points. `private`
identifies implementation details that even subclasses should not access.

This makes the architecture of the Template Method explicit in the type system.

## Dependency Direction

A Template Method creates a dependency from the subclass implementation toward the superclass abstraction.

The superclass defines the lifecycle and invokes subclass behavior.

This is appropriate when the base abstraction represents the stable conceptual contract.

It becomes problematic when the base class must understand details of every concrete implementation. If the superclass
starts accumulating conditionals such as:

```js
if (this.type === "json") {
    // JSON-specific behavior
} else if (this.type === "xml") {
    // XML-specific behavior
}
```

the hierarchy is likely moving in the wrong direction.

The base class should define the stable abstraction rather than encode knowledge of each concrete variant.

## Architectural Use

Template Method can appear at several architectural levels.

At the class level, it can define a reusable lifecycle for a family of related components.

At the framework level, it can define application or plugin lifecycles.

At the infrastructure level, it can centralize resource management around operations that vary by implementation.

At the domain level, it can model a stable business process whose specific steps vary by subtype.

At the application level, it can structure a workflow with invariant stages and specialized operations.

The pattern becomes less suitable when the variation crosses independent architectural boundaries. In those cases,
explicit ports, adapters, strategies, services, or workflow components usually provide clearer dependency relationships.

## Transaction Boundaries

Template Method can centralize transaction boundaries:

```ts
abstract class TransactionalOperation {
    async execute(): Promise<void> {
        const transaction = await this.begin();

        try {
            await this.perform(transaction);
            await this.commit(transaction);
        } catch (error) {
            await this.rollback(transaction);
            throw error;
        }
    }

    protected abstract begin(): Promise<Transaction>;

    protected abstract perform(
        transaction: Transaction
    ): Promise<void>;

    protected abstract commit(
        transaction: Transaction
    ): Promise<void>;

    protected abstract rollback(
        transaction: Transaction
    ): Promise<void>;
}
```

This makes transaction lifecycle part of the invariant algorithm.

However, transaction management is often infrastructure-specific. If multiple unrelated workflows require the same
transaction policy, an explicit transaction abstraction or infrastructure middleware may be more reusable than a
Template Method hierarchy.

## Observability

The base algorithm can establish common observability behavior:

```js
class Operation {
    async execute(input) {
        const start = performance.now();

        try {
            const result = await this.perform(input);

            this.recordSuccess(performance.now() - start);
            return result;
        } catch (error) {
            this.recordFailure(error);
            throw error;
        }
    }

    async perform(input) {
        throw new Error("perform() must be implemented");
    }

    recordSuccess(duration) {
    }

    recordFailure(error) {
    }
}
```

This ensures that every subclass participates in the same lifecycle-level instrumentation.

The same mechanism can support logging, metrics, tracing, auditing, and timing when these concerns are genuinely
invariant around the operation.

If observability is needed across unrelated components, middleware or decorators may provide better reuse.

## Security Boundaries

Template Method can enforce security-related lifecycle steps:

```js
class SecureOperation {
    execute(request) {
        this.authenticate(request);
        this.authorize(request);

        const result = this.perform(request);

        this.audit(request, result);

        return result;
    }

    authenticate(request) {
    }

    authorize(request) {
    }

    perform(request) {
        throw new Error("perform() must be implemented");
    }

    audit(request, result) {
    }
}
```

This can make security ordering explicit.

However, security-sensitive operations should not rely solely on subclass discipline. If a security invariant must never
be bypassed, the design should minimize the number of ways a concrete implementation can circumvent the protected
lifecycle.

## Benefits

Template Method provides several important benefits.

* It centralizes invariant algorithm structure.
* It prevents duplication of common workflow logic.
* It allows controlled specialization of individual steps.
* It establishes a consistent lifecycle across implementations.
* It can enforce ordering, cleanup, and error-handling invariants.
* It supports the Open/Closed Principle when variation fits predefined extension points.
* It allows common behavior and specialized behavior to coexist naturally.
* It can provide useful framework and lifecycle extension mechanisms.
* It makes the relationship between stable algorithm structure and variable implementation explicit.

## Costs

Template Method also introduces significant costs.

* It creates inheritance coupling.
* Changes to the base class can affect every subclass.
* Subclasses depend on implicit ordering and lifecycle contracts.
* Runtime selection of implementations is less flexible than composition.
* Deep hierarchies can become difficult to understand.
* Excessive hooks can turn the base class into a miniature framework.
* Shared mutable state can create hidden dependencies between steps.
* Testing may require understanding both superclass and subclass behavior.
* The pattern can encourage inheritance where composition would be simpler.
* Independent reuse of individual steps can be harder than with separate strategy objects.

## Decision Criteria

Template Method is a strong choice when all of the following are substantially true:

1. There is a stable algorithm skeleton.
2. The ordering of major operations is part of the invariant.
3. Multiple implementations share that algorithm.
4. Only selected steps need specialization.
5. The implementations form a meaningful inheritance relationship.
6. Centralized control over lifecycle or sequencing is valuable.
7. The extension points can be defined clearly and remain relatively stable.

Prefer Strategy or another composition-based design when the complete algorithm should be interchangeable.

Prefer Adapter when the primary problem is interface incompatibility.

Prefer Decorator when behavior should be added around an existing component.

Prefer State when behavior changes according to an object's current state.

Prefer Chain of Responsibility when responsibility should move through a sequence of handlers.

Prefer Bridge when two dimensions of variation need to evolve independently.

Prefer composition when the varying behavior needs independent reuse, runtime replacement, or independent lifecycle
management.

## Refactoring Warning Signs

A Template Method hierarchy should be reconsidered when:

* subclasses override the Template Method itself;
* subclasses require many unrelated hooks;
* the base class contains type-specific conditionals;
* subclasses depend heavily on undocumented superclass state;
* changing the superclass frequently breaks subclasses;
* different subclasses need substantially different algorithm ordering;
* the hierarchy exists primarily for code reuse;
* composition would allow independent reuse of the variable operations;
* the superclass has become responsible for unrelated concerns.

These are not automatic reasons to remove Template Method, but they indicate that the abstraction may no longer
correspond to the actual variation in the system.

## Summary

Template Method defines a **stable algorithm skeleton in a base class while allowing subclasses to customize selected
steps**. The superclass owns the workflow, sequencing, and invariant lifecycle; subclasses provide the variable
operations.

Its defining mechanism is inheritance-based inversion of control. The base class calls subclass-provided operations as
part of an algorithm whose structure remains under superclass control.

The most important distinction is between **algorithm structure** and **algorithm implementation**. Template Method is
appropriate when the structure is stable and individual steps vary. Strategy is more appropriate when the algorithm
itself should be interchangeable.

Template Method is particularly effective for stable lifecycles, framework hooks, resource management, transaction
boundaries, and workflows where ordering is an invariant. Its principal cost is inheritance coupling: subclasses depend
not only on method signatures but also on the superclass's sequencing, state, lifecycle, and behavioral contracts.

In modern JavaScript and TypeScript, composition and higher-order functions frequently provide a more flexible
alternative. Template Method remains justified when a meaningful superclass genuinely owns the invariant algorithm and
subclass specialization is the intended extension mechanism.

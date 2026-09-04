# Visitor

## Intent

**Visitor represents an operation that can be performed across the elements of an object structure while keeping that
operation separate from the element classes.**

The pattern is useful when the object structure is relatively stable but the number or variety of operations performed
over that structure continues to grow.

Instead of adding every new operation to every element class, Visitor moves the operations into separate visitor
objects. The elements expose a controlled way for a visitor to operate on them, commonly through an `accept` method.

The defining concern is therefore **separating operations from a stable object structure**.

Visitor is particularly associated with heterogeneous object structures such as syntax trees, document models, compiler
representations, and domain object hierarchies.

## Problem

Suppose a document contains several different element types:

```ts
interface DocumentElement {
    render(): string;
}

class Paragraph implements DocumentElement {
    constructor(public readonly text: string) {
    }

    render(): string {
        return `<p>${this.text}</p>`;
    }
}

class Image implements DocumentElement {
    constructor(
        public readonly source: string,
        public readonly alt: string
    ) {
    }

    render(): string {
        return `<img src="${this.source}" alt="${this.alt}">`;
    }
}
```

The system may eventually need many operations:

* rendering;
* text extraction;
* accessibility analysis;
* indexing;
* validation;
* serialization;
* statistics;
* search;
* transformation.

Without Visitor, each new operation may require adding another method to every element:

```ts
interface DocumentElement {
    render(): string;

    extractText(): string;

    validate(): ValidationResult;

    collectStatistics(): Statistics;
}
```

As the number of operations grows, the element classes accumulate unrelated responsibilities.

Visitor reverses this relationship. The element classes remain responsible for representing the structure, while
visitors represent operations performed over that structure.

## Structure

A conventional Visitor implementation contains several conceptual participants.

### Element

An Element represents a node in the object structure.

```ts
interface Element {
    accept(visitor: Visitor): void;
}
```

Concrete elements implement `accept`.

### Concrete Element

A Concrete Element represents a specific type of element that the visitor needs to distinguish.

```ts
class Paragraph implements Element {
    constructor(public readonly text: string) {
    }

    accept(visitor: Visitor): void {
        visitor.visitParagraph(this);
    }
}
```

Another element can dispatch to a different visitor operation:

```ts
class Image implements Element {
    constructor(
        public readonly source: string,
        public readonly alt: string
    ) {
    }

    accept(visitor: Visitor): void {
        visitor.visitImage(this);
    }
}
```

### Visitor

The Visitor defines the operations corresponding to the supported element types.

```ts
interface Visitor {
    visitParagraph(paragraph: Paragraph): void;

    visitImage(image: Image): void;
}
```

### Concrete Visitor

A Concrete Visitor implements one particular operation across the element structure.

```ts
class TextExtractor implements Visitor {
    private result = "";

    visitParagraph(paragraph: Paragraph): void {
        this.result += paragraph.text;
    }

    visitImage(image: Image): void {
        this.result += image.alt;
    }

    getText(): string {
        return this.result;
    }
}
```

A different visitor can implement another operation without modifying the element classes:

```ts
class AccessibilityChecker implements Visitor {
    errors: string[] = [];

    visitParagraph(paragraph: Paragraph): void {
        if (!paragraph.text.trim()) {
            this.errors.push("Paragraph is empty");
        }
    }

    visitImage(image: Image): void {
        if (!image.alt.trim()) {
            this.errors.push("Image is missing alternative text");
        }
    }
}
```

## Double Dispatch

The classic Visitor implementation uses **double dispatch**.

The first dispatch selects the concrete element's `accept` method:

```ts
element.accept(visitor);
```

The concrete element then selects the visitor method corresponding to its own type:

```ts
accept(visitor
:
Visitor
):
void {
    visitor.visitParagraph(this);
}
```

This gives the visitor access to the concrete element type without requiring the visitor to perform explicit type
checks.

The two dispatch decisions are conceptually:

1. Which concrete element received the operation?
2. Which visitor operation corresponds to that concrete element?

This is the core mechanism that allows one visitor interface to define type-specific operations across a heterogeneous
structure.

## Why Double Dispatch Matters

A single dynamic dispatch is not enough when the visitor needs behavior based on both the visitor type and the element
type.

Consider:

```ts
visitor.visitParagraph(this);
```

The concrete element determines which visitor method is called.

The visitor then determines what operation that method performs.

This allows multiple operations to be represented as separate visitor implementations without placing those operations
inside the element hierarchy.

## Stable Element Hierarchy

Visitor works best when the element hierarchy changes less frequently than the operations performed over it.

For example, a compiler might have a relatively stable set of expression and statement node types while continuously
adding operations such as:

* semantic analysis;
* code generation;
* optimization;
* formatting;
* documentation generation;
* dependency analysis.

Adding a new operation can then be accomplished by adding another visitor.

The trade-off is that adding a new element type requires changes to the Visitor interface and usually every Concrete
Visitor.

Visitor therefore makes one axis of change easier and another axis more expensive.

## The Fundamental Trade-Off

Visitor favors:

**Adding new operations over a stable set of element types.**

Traditional polymorphism favors:

**Adding new element types while keeping existing operations stable.**

This is one of the most important reasons to use or reject Visitor.

If new element types are expected constantly, requiring every visitor to implement another method can become expensive.

If new operations are constantly being introduced while the element structure remains stable, Visitor can provide
substantial organizational benefits.

## Object Structure

Visitor is normally applied to an object structure containing multiple elements.

The structure can be a collection:

```ts
class Document {
    constructor(
        readonly elements: DocumentElement[]
    ) {
    }

    accept(visitor: Visitor): void {
        for (const element of this.elements) {
            element.accept(visitor);
        }
    }
}
```

The structure can also be recursive:

```ts
class Section implements Element {
    constructor(
        readonly children: Element[]
    ) {
    }

    accept(visitor: Visitor): void {
        visitor.visitSection(this);

        for (const child of this.children) {
            child.accept(visitor);
        }
    }
}
```

Visitor does not inherently define how traversal occurs. The object structure or another traversal mechanism can control
that aspect.

This distinction is important because **Visitor represents the operation; it does not necessarily represent traversal**.

## Visitor and Iterator

Visitor and Iterator are often used together, but they solve different problems.

**Iterator controls traversal. Visitor controls an operation over visited elements.**

An Iterator answers:

> How do I traverse these elements without exposing their representation?

A Visitor answers:

> What operation should I perform for each concrete element type?

For example:

```ts
for (const element of document) {
    element.accept(visitor);
}
```

The iterable determines traversal, while the visitor determines type-specific behavior.

A tree can therefore use an Iterator to perform depth-first traversal and a Visitor to perform analysis on each node.

Neither pattern requires the other.

## Visitor and Composite

Composite represents recursive part-whole structures and allows individual objects and compositions to be treated
uniformly.

Visitor can operate over a Composite structure.

For example:

```ts
class Directory implements Element {
    constructor(
        readonly children: Element[]
    ) {
    }

    accept(visitor: Visitor): void {
        visitor.visitDirectory(this);

        for (const child of this.children) {
            child.accept(visitor);
        }
    }
}
```

Composite defines the structure and uniform treatment of leaves and composites.

Visitor defines operations over that structure.

The two patterns are therefore complementary rather than interchangeable.

## Visitor and Interpreter

Interpreter represents grammar expressions and provides interpretation behavior for those expressions.

A Visitor can be used to implement operations over an expression tree:

```ts
interface ExpressionVisitor<T> {
    visitLiteral(expression: Literal): T;

    visitBinary(expression: BinaryExpression): T;
}
```

The distinction remains important.

**Interpreter is concerned with representing and interpreting a grammar. Visitor is concerned with separating operations
from an object structure.**

An expression tree can use both patterns. It can also use neither.

## Visitor and Strategy

Strategy encapsulates an interchangeable algorithm or policy.

Visitor does not primarily represent alternative algorithms for one operation. Instead, each Concrete Visitor normally
represents an operation applied across a set of element types.

A Strategy might represent:

```ts
interface CompressionStrategy {
    compress(data: Data): Buffer;
}
```

A Visitor might represent:

```ts
interface DocumentVisitor {
    visitParagraph(paragraph: Paragraph): void;

    visitImage(image: Image): void;
}
```

Strategy varies an algorithm.

Visitor varies an operation across a known set of element types.

## Visitor and State

State changes an object's behavior according to its current state.

Visitor does not change the object's behavior based on internal state. It introduces an external operation that can
inspect or process an element.

A state object owns behavior associated with a state.

A visitor owns an operation associated with an element structure.

## Visitor and Command

Command encapsulates a request as an object.

A visitor can represent an operation over a structure, while a command represents an executable request.

A visitor is commonly used for type-specific processing across many elements. A command is commonly used when an
operation needs to be queued, logged, retried, scheduled, composed, or undone.

The concepts can coexist.

## Visitor and Template Method

Template Method defines an algorithm skeleton and allows subclasses to customize selected steps.

Visitor does not primarily define a shared algorithm through inheritance. It moves operations into separate visitor
objects.

A Template Method might define:

```ts
abstract class Processor {
    process(): void {
        this.load();
        this.transform();
        this.save();
    }

    protected abstract load(): void;

    protected abstract transform(): void;

    protected abstract save(): void;
}
```

A Visitor might define:

```ts
interface Visitor {
    visitA(element: A): void;

    visitB(element: B): void;
}
```

Template Method organizes implementation variation within a class hierarchy.

Visitor organizes operations across an element hierarchy.

## Accept Method

The `accept` method is the usual entry point into Visitor dispatch.

```ts
class Paragraph implements Element {
    accept(visitor: Visitor): void {
        visitor.visitParagraph(this);
    }
}
```

Its purpose is not simply to expose the visitor to the element.

It performs the type-specific dispatch necessary for the Visitor mechanism.

The implementation should generally remain simple. Complicated logic inside `accept` often indicates that the element is
taking over responsibilities that belong elsewhere.

## Visitor Return Values

Visitors do not have to return `void`.

A generic visitor can produce a result:

```ts
interface Visitor<TResult> {
    visitNumber(value: NumberLiteral): TResult;

    visitBinary(value: BinaryExpression): TResult;
}
```

An evaluator might then return a value:

```ts
class Evaluator implements Visitor<number> {
    visitNumber(value: NumberLiteral): number {
        return value.value;
    }

    visitBinary(value: BinaryExpression): number {
        const left = value.left.accept(this);
        const right = value.right.accept(this);

        return left + right;
    }
}
```

This is particularly useful for expression trees, transformations, validation, analysis, and code generation.

The result type can also be generic:

```ts
interface Visitor<T> {
    visitParagraph(element: Paragraph): T;

    visitImage(element: Image): T;
}
```

Different visitors can then produce different result types.

## Generic Accept

TypeScript can express the result-producing form directly:

```ts
interface Element {
    accept<T>(visitor: Visitor<T>): T;
}

interface Visitor<T> {
    visitParagraph(element: Paragraph): T;

    visitImage(element: Image): T;
}
```

Concrete elements implement:

```ts
class Paragraph implements Element {
    constructor(readonly text: string) {
    }

    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitParagraph(this);
    }
}
```

This avoids forcing every visitor to mutate internal state merely to return a result.

## Recursive Visitors

Visitors are especially useful for recursive structures.

Consider an expression hierarchy:

```ts
interface Expression {
    accept<T>(visitor: ExpressionVisitor<T>): T;
}

class Literal implements Expression {
    constructor(readonly value: number) {
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitLiteral(this);
    }
}

class Add implements Expression {
    constructor(
        readonly left: Expression,
        readonly right: Expression
    ) {
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitAdd(this);
    }
}
```

An evaluator can recursively visit child expressions:

```ts
class Evaluator implements ExpressionVisitor<number> {
    visitLiteral(expression: Literal): number {
        return expression.value;
    }

    visitAdd(expression: Add): number {
        return (
            expression.left.accept(this) +
            expression.right.accept(this)
        );
    }
}
```

The recursive structure belongs to the elements, while the evaluation operation belongs to the visitor.

## Traversal Responsibility

Visitor does not require recursive traversal to be implemented inside `accept`.

An alternative is to keep traversal external:

```ts
function visitAll(
    elements: Iterable<Element>,
    visitor: Visitor
): void {
    for (const element of elements) {
        element.accept(visitor);
    }
}
```

For trees, traversal can likewise be handled by a dedicated traversal mechanism.

This separation is often useful when the same object structure requires multiple traversal orders.

The design should make clear whether `accept` means only "dispatch this visitor to this element" or also means "visit
the complete subtree rooted here."

Both approaches are possible, but mixing conventions inside one hierarchy creates confusion.

## Pre-Order and Post-Order Operations

Recursive visitors sometimes need operations before or after children.

For example, a composite element can call the visitor before traversing children:

```ts
accept<T>(visitor
:
Visitor<T>
):
T
{
    visitor.visitSection(this);

    for (const child of this.children) {
        child.accept(visitor);
    }

    return visitor.leaveSection(this);
}
```

A more explicit visitor contract can distinguish entry and exit:

```ts
interface Visitor {
    enterSection(section: Section): void;

    leaveSection(section: Section): void;
}
```

This can be useful for:

* nesting-aware formatting;
* scope management;
* hierarchical validation;
* code generation;
* indentation;
* resource accounting.

However, the visitor contract should not become unnecessarily complicated merely to support traversal mechanics that
belong in an Iterator or traversal abstraction.

## Mutable Visitor State

A visitor may maintain state while processing an object structure.

```ts
class StatisticsVisitor implements Visitor {
    paragraphs = 0;
    images = 0;

    visitParagraph(): void {
        this.paragraphs++;
    }

    visitImage(): void {
        this.images++;
    }
}
```

This is straightforward for aggregation.

The visitor's mutable state must nevertheless have clear ownership and lifecycle.

A visitor instance should generally represent one operation over one logical traversal unless it is explicitly designed
for reuse.

## Stateless Visitors

Some visitors can be stateless:

```ts
class ValidationVisitor implements Visitor<ValidationResult> {
    visitParagraph(paragraph: Paragraph): ValidationResult {
        return validateParagraph(paragraph);
    }

    visitImage(image: Image): ValidationResult {
        return validateImage(image);
    }
}
```

Stateless visitors are easier to reuse and test.

When aggregation is required, immutable result accumulation or explicit context objects can sometimes avoid hidden
mutable state.

## Visitor Context

Complex operations may require shared context:

```ts
interface VisitContext {
    readonly options: Options;
    readonly diagnostics: Diagnostic[];
}
```

The context can be passed explicitly:

```ts
interface Visitor {
    visitParagraph(
        paragraph: Paragraph,
        context: VisitContext
    ): void;

    visitImage(
        image: Image,
        context: VisitContext
    ): void;
}
```

Explicit context is generally easier to reason about than storing all traversal state in mutable visitor fields.

The context should contain information genuinely shared across the operation rather than becoming a miscellaneous
dependency container.

## Asynchronous Visitors

Visitors can perform asynchronous operations:

```ts
interface AsyncVisitor<T> {
    visitUser(user: User): Promise<T>;

    visitOrder(order: Order): Promise<T>;
}
```

Elements can then dispatch asynchronously:

```ts
class User implements Element {
    async accept<T>(visitor: AsyncVisitor<T>): Promise<T> {
        return visitor.visitUser(this);
    }
}
```

Traversal must then define whether elements are processed sequentially or concurrently.

Sequential processing:

```ts
for (const element of elements) {
    await element.accept(visitor);
}
```

Concurrent processing:

```ts
await Promise.all(
    elements.map(element => element.accept(visitor))
);
```

These are not equivalent.

Concurrency can affect ordering, resource consumption, failure behavior, rate limits, and side effects. The traversal
contract should therefore make the execution model explicit.

## Error Handling

A visitor should have a defined failure policy.

For synchronous visitors, an exception can propagate naturally:

```ts
element.accept(visitor);
```

For asynchronous visitors, rejected promises can propagate:

```ts
await element.accept(visitor);
```

A traversal utility may instead collect errors:

```ts
interface VisitResult {
    errors: Error[];
}
```

The choice depends on whether one invalid element should stop the entire operation or whether the operation is intended
to analyze the complete structure.

Validation and static analysis commonly benefit from error aggregation.

Operations with transactional side effects may instead require immediate failure.

## Visitor and Side Effects

Visitors can be pure:

```ts
class TextVisitor implements Visitor<string> {
    visitParagraph(paragraph: Paragraph): string {
        return paragraph.text;
    }
}
```

Or they can perform side effects:

```ts
class IndexingVisitor implements Visitor<void> {
    visitParagraph(paragraph: Paragraph): void {
        index(paragraph.text);
    }

    visitImage(image: Image): void {
        index(image.alt);
    }
}
```

The distinction should be intentional.

Visitors with significant side effects can become harder to test and reason about, particularly when traversal order
matters.

For pure transformations and analysis, returning values is often preferable.

## Transforming Structures

Visitor can produce a new structure rather than merely inspect one.

```ts
class NormalizingVisitor implements Visitor<Element> {
    visitParagraph(paragraph: Paragraph): Element {
        return new Paragraph(paragraph.text.trim());
    }

    visitImage(image: Image): Element {
        return new Image(
            image.source.trim(),
            image.alt.trim()
        );
    }
}
```

For recursive structures, the visitor can construct transformed children and return new composite nodes.

However, if structural transformation is the dominant operation, a dedicated transformation API or functional tree
transformation may be clearer than introducing a full Visitor hierarchy.

## Immutable Object Structures

Visitor works naturally with immutable elements.

```ts
class NumberLiteral implements Expression {
    constructor(readonly value: number) {
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNumberLiteral(this);
    }
}
```

The visitor can inspect the immutable object without modifying it.

This is especially useful for abstract syntax trees and persistent domain structures where operations should not mutate
the source representation.

## Mutable Object Structures

Visitor can also work with mutable elements:

```ts
class User {
    constructor(
        public name: string,
        public active: boolean
    ) {
    }

    accept(visitor: Visitor): void {
        visitor.visitUser(this);
    }
}
```

A visitor can modify the element:

```ts
class DeactivationVisitor implements Visitor {
    visitUser(user: User): void {
        user.active = false;
    }
}
```

This increases coupling between the operation and the element's mutable representation.

Mutation should be explicit because a visitor that appears to perform analysis may unexpectedly alter the structure.

## Encapsulation

Visitor requires enough access to an element for the operation to perform its work.

This can create tension with encapsulation.

One approach is to expose a controlled public interface:

```ts
class Account {
    accept(visitor: AccountVisitor): void {
        visitor.visitAccount(this);
    }

    getBalance(): number {
        return this.balance;
    }

    private balance = 0;
}
```

The visitor can operate through public methods rather than accessing internal fields.

Another approach is to use carefully designed access methods intended specifically for structural operations.

The important point is that Visitor should not become an excuse for exposing every internal field of the element
hierarchy.

## Visitor and Private State

Native JavaScript private fields present a particular consideration:

```js
class Account {
    #balance = 0;

    accept(visitor) {
        return visitor.visitAccount(this);
    }
}
```

A visitor cannot directly access `#balance`.

This is usually beneficial for encapsulation.

If the visitor requires access to internal state, the class should expose an intentional operation or representation
rather than circumventing the private boundary.

In some cases this limitation is evidence that the visitor is too tightly coupled to the element's internal
representation.

## TypeScript Discriminated Unions

Modern TypeScript can sometimes replace classic Visitor with discriminated unions.

```ts
type Expression =
    | { kind: "literal"; value: number }
    | { kind: "add"; left: Expression; right: Expression };
```

Operations can then use narrowing:

```ts
function evaluate(expression: Expression): number {
    switch (expression.kind) {
        case "literal":
            return expression.value;

        case "add":
            return (
                evaluate(expression.left) +
                evaluate(expression.right)
            );
    }
}
```

This can be simpler than a class-based Visitor.

It also changes the trade-off.

Adding a new operation is easy because another function can be written. Adding a new element variant requires updating
every exhaustive operation.

This is structurally similar to the Visitor trade-off, but the mechanism is algebraic data modeling and type narrowing
rather than double dispatch.

## Functional Visitor Alternatives

JavaScript functions can provide visitor-like behavior without a class hierarchy:

```ts
function evaluate(expression: Expression): number {
    switch (expression.kind) {
        case "literal":
            return expression.value;

        case "add":
            return evaluate(expression.left) +
                evaluate(expression.right);
    }
}
```

Another approach is a handler map:

```ts
const handlers = {
    literal(expression: Literal) {
        return expression.value;
    },

    add(expression: Add) {
        return evaluate(expression.left) +
            evaluate(expression.right);
    }
};
```

These alternatives can be preferable when the data model is naturally represented as plain objects.

The GoF Visitor pattern is most compelling when the element hierarchy is class-based and the operations benefit from
explicit double dispatch and separate visitor implementations.

## Visitor with Classes and Prototypes

JavaScript's prototype-based object model does not require Visitor to use classical inheritance.

The important requirements are:

* distinguishable element types;
* a stable element protocol;
* a mechanism for dispatching an operation based on the concrete element;
* separate operation implementations.

The implementation can therefore use classes, prototypes, factory-created objects, or other object representations.

The pattern is about the separation of operations from elements, not about the specific syntax used to construct them.

## Adding a New Operation

One of Visitor's strongest advantages is adding an operation.

Suppose the structure contains:

```ts
interface Element {
    accept<T>(visitor: Visitor<T>): T;
}
```

A new operation can be represented by another visitor:

```ts
class SearchIndexVisitor implements Visitor<void> {
    visitParagraph(paragraph: Paragraph): void {
        indexText(paragraph.text);
    }

    visitImage(image: Image): void {
        indexText(image.alt);
    }
}
```

The existing elements do not need to change.

This is the central extensibility benefit of Visitor.

## Adding a New Element Type

Adding an element is more expensive.

Suppose a new `Video` element is introduced:

```ts
class Video implements Element {
    accept<T>(visitor: Visitor<T>): T {
        return visitor.visitVideo(this);
    }
}
```

The Visitor interface must now include:

```ts
visitVideo(video
:
Video
):
T;
```

Every concrete visitor may need to implement that method.

This is the fundamental cost of the pattern.

A Visitor hierarchy therefore works best when element types are relatively stable.

## Default Visitor Methods

Some systems use default behavior for visitor methods:

```ts
interface Visitor {
    visitParagraph(paragraph: Paragraph): void;

    visitImage(image: Image): void;

    visitVideo(video: Video): void

{
    // Default behavior
}
}
```

This reduces the immediate cost of adding new elements.

However, defaults can hide incomplete implementations.

If every visitor must consciously handle every element type, requiring the method can provide stronger guarantees.

The appropriate choice depends on whether omission is meaningful or safe.

## Extensible Visitor Hierarchies

Visitor can itself have specialized visitors:

```ts
interface Visitor {
    visitParagraph(paragraph: Paragraph): void;

    visitImage(image: Image): void;
}

abstract class BaseVisitor implements Visitor {
    visitParagraph(paragraph: Paragraph): void {
    }

    visitImage(image: Image): void {
    }
}
```

Concrete visitors can override only the operations they need.

This can be convenient, but it weakens exhaustiveness guarantees.

A default no-op method can cause a newly introduced element to silently receive no behavior.

In correctness-sensitive systems, explicit implementation is often preferable.

## Visitor and Dependency Inversion

Visitor changes the dependency relationship between operations and data structures.

Instead of placing every operation inside the element classes, the element exposes a stable operation-dispatch protocol
while concrete operations live externally.

This can improve separation of concerns when operations are numerous and independently evolving.

However, the visitor still depends strongly on the concrete element types.

Visitor therefore does not eliminate coupling. It **reorganizes coupling around the axis of change that matters most**.

## Testing

Visitors are generally straightforward to unit test because each visitor represents a distinct operation.

For example:

```ts
const visitor = new TextExtractor();

paragraph.accept(visitor);
image.accept(visitor);

expect(visitor.getText()).toBe(
    "Paragraph textAlternative text"
);
```

Tests should verify:

* correct behavior for each concrete element;
* result accumulation;
* handling of empty or malformed elements;
* error behavior;
* traversal assumptions;
* side effects where applicable.

Element tests should verify that `accept` dispatches to the correct visitor operation.

Traversal tests should verify traversal order separately when traversal is external to the visitor.

## Testing Double Dispatch

The dispatch contract can be tested with a recording visitor:

```ts
class RecordingVisitor implements Visitor {
    events: string[] = [];

    visitParagraph(): void {
        this.events.push("paragraph");
    }

    visitImage(): void {
        this.events.push("image");
    }
}
```

Then:

```ts
const visitor = new RecordingVisitor();

paragraph.accept(visitor);
image.accept(visitor);
```

The resulting events demonstrate that each concrete element dispatches to the correct visitor method.

This is especially useful when the element hierarchy is large.

## Performance

Visitor introduces method dispatch and often additional object allocations for visitor instances.

In most application code, these costs are insignificant compared with I/O, parsing, serialization, or other substantive
operations.

For extremely large object structures, visitor performance can nevertheless be influenced by:

* method-call frequency;
* recursion depth;
* allocation of temporary results;
* visitor state;
* cache locality;
* traversal strategy;
* repeated passes over the same structure.

If several visitors independently traverse a large structure, repeated traversal can become a meaningful cost.

In such cases, combining compatible analyses into one pass or introducing an intermediate representation may be
appropriate.

## Multiple Visitors and Repeated Traversal

A structure may be processed by many visitors:

```ts
document.accept(validationVisitor);
document.accept(indexingVisitor);
document.accept(statisticsVisitor);
document.accept(renderingVisitor);
```

This is one of Visitor's strengths from an organizational perspective.

However, every visitor may require another traversal.

For a small object structure, this is usually irrelevant.

For very large trees, repeated traversal can dominate execution time.

Possible alternatives include:

* combining independent operations;
* caching derived results;
* maintaining indexes;
* preprocessing the structure;
* using a single traversal with multiple operations;
* compiling operations into a more efficient representation.

The correct solution depends on workload rather than the pattern alone.

## Visitor and Caching

A visitor may cache results:

```ts
class CostVisitor implements Visitor<number> {
    private cache = new WeakMap<object, number>();

    visitNode(node: Node): number {
        const cached = this.cache.get(node);

        if (cached !== undefined) {
            return cached;
        }

        const cost = calculateCost(node);
        this.cache.set(node, cost);

        return cost;
    }
}
```

This can be useful when the same nodes are encountered repeatedly.

Caching introduces additional concerns around mutation and invalidation. If the object structure is mutable, cached
visitor results can become stale.

Immutable structures make such caching considerably easier to reason about.

## Recursive Depth

Recursive visitors can encounter call-stack limitations on deeply nested structures.

For example:

```ts
class Evaluator implements Visitor<number> {
    visitBinary(expression: BinaryExpression): number {
        return (
            expression.left.accept(this) +
            expression.right.accept(this)
        );
    }
}
```

A deeply nested tree can cause excessive recursion.

An explicit traversal stack may be preferable for unbounded or attacker-controlled structures.

This is especially relevant for parsers, compilers, configuration formats, and externally supplied document structures.

## Security Considerations

Visitor implementations operating on untrusted structures should consider:

* maximum traversal depth;
* maximum node count;
* resource consumption;
* maliciously large structures;
* unexpected element combinations;
* recursive cycles;
* expensive operations;
* uncontrolled external calls.

Visitor does not inherently protect against cyclic structures.

If the object graph can contain cycles, traversal must track visited objects when necessary:

```ts
const visited = new WeakSet<object>();

function visit(node: Node): void {
    if (visited.has(node)) {
        return;
    }

    visited.add(node);

    // Process node.
}
```

Whether cycles are valid should be determined by the domain model rather than assumed.

## Serialization

Visitors can provide serialization operations:

```ts
class JsonVisitor implements Visitor<string> {
    visitParagraph(paragraph: Paragraph): string {
        return JSON.stringify({
            type: "paragraph",
            text: paragraph.text
        });
    }

    visitImage(image: Image): string {
        return JSON.stringify({
            type: "image",
            source: image.source,
            alt: image.alt
        });
    }
}
```

However, serialization often becomes easier to maintain when the data model itself has an explicit serialization
boundary.

Visitor is particularly useful when multiple output representations are required and the structure is stable.

## Code Generation

Compiler and language tooling are classic Visitor use cases.

An expression or syntax tree may support visitors for:

* evaluation;
* type checking;
* optimization;
* source formatting;
* code generation;
* dependency analysis;
* static diagnostics.

The syntax tree remains the structural representation, while each visitor represents a distinct analysis or
transformation.

This is a strong match for Visitor because compiler node types tend to be relatively stable compared with the number of
operations performed over them.

## Domain Models

Visitor can be used in domain models containing a stable set of distinct entity types.

For example, a financial reporting structure might contain several transaction variants:

```ts
interface TransactionVisitor<T> {
    visitDeposit(transaction: Deposit): T;

    visitWithdrawal(transaction: Withdrawal): T;

    visitTransfer(transaction: Transfer): T;
}
```

Visitors can then represent:

* reporting;
* compliance analysis;
* accounting calculations;
* export;
* auditing.

The approach is most appropriate when those operations evolve independently while the transaction types remain stable.

If transaction types change constantly, a different design may be more suitable.

## Architectural Boundaries

Visitor can be useful inside a bounded subsystem where the object structure is owned and relatively stable.

It is generally less appropriate as a mechanism for crossing broad architectural boundaries.

At service or system boundaries, explicit contracts, commands, events, APIs, or DTOs usually provide clearer
dependencies.

Visitor is primarily an in-process structural design pattern.

## Common Misuse

### Using Visitor for a Small Stable Structure

If there are only one or two operations and a small set of element types, Visitor may add unnecessary machinery.

Ordinary polymorphism or simple functions can be clearer.

### Using Visitor When Element Types Change Frequently

If new element types are constantly introduced, every visitor becomes a maintenance burden.

The pattern is optimized for the opposite change direction.

### Using Visitor as a Generic Traversal Mechanism

Visitor does not inherently solve traversal.

Iterator, recursive functions, or dedicated traversal abstractions may be better suited to traversal itself.

### Putting Business Logic into `accept`

The `accept` method should generally perform dispatch:

```ts
accept(visitor)
{
    return visitor.visitParagraph(this);
}
```

It should not become a large operation containing business rules.

### Exposing Internal Representation

If visitors require access to every internal field, the element classes may have lost meaningful encapsulation.

The visitor should operate through an intentional element contract.

### Excessive Visitor Interfaces

A system can become difficult to navigate if every small operation receives its own visitor hierarchy.

The abstraction should provide enough value to justify the dispatch mechanism.

### Using Visitor for One Algorithm

If only one algorithm exists and it belongs naturally to the element, ordinary polymorphism may be simpler.

Visitor becomes more compelling as the number of independent operations increases.

## Refactoring Toward Visitor

Visitor is often introduced when element classes contain many unrelated operations.

Suppose:

```ts
class Paragraph {
    render(): string {
    }

    extractText(): string {
    }

    validate(): ValidationResult {
    }

    calculateStatistics(): Statistics {
    }
}
```

As operations multiply, the class becomes responsible for increasingly unrelated concerns.

The operations can be extracted into visitors:

```ts
interface ParagraphVisitor<T> {
    visitParagraph(paragraph: Paragraph): T;
}
```

The paragraph then exposes:

```ts
class Paragraph {
    accept<T>(visitor: ParagraphVisitor<T>): T {
        return visitor.visitParagraph(this);
    }
}
```

The individual operations can then become independent visitors.

This refactoring is most valuable when the element hierarchy is stable and the operations are proliferating.

## Recognizing an Opportunity

Visitor is a candidate when:

* there is a stable hierarchy of distinct element types;
* many unrelated operations need to operate over those elements;
* those operations change independently;
* adding operations currently requires modifying many element classes;
* operations need behavior specific to concrete element types;
* keeping the element classes focused is valuable;
* the cost of modifying all visitors when adding a new element is acceptable.

The strongest signal is **operation proliferation across a relatively stable element hierarchy**.

## Benefits

Visitor provides several important benefits:

* It separates operations from element representations.
* New operations can often be added without modifying existing elements.
* Each operation can have its own class and dependencies.
* Type-specific behavior is explicit.
* Complex operations can be kept out of domain or structural classes.
* Visitors can maintain operation-specific state.
* Different visitors can produce different result types.
* It works well with stable heterogeneous object structures.
* It supports analysis, validation, transformation, serialization, and code generation.
* It can centralize cross-cutting operations without turning element classes into large service objects.

## Costs

Visitor introduces significant trade-offs:

* Adding a new element type can require changes to every visitor.
* The Visitor interface becomes coupled to all concrete element types.
* Double dispatch adds structural complexity.
* The element hierarchy must expose enough information for visitors to operate.
* Visitors can become large when the element hierarchy grows.
* Multiple visitors can require repeated traversal.
* Recursive visitors can encounter stack-depth limitations.
* Mutable visitor state can complicate reuse and concurrency.
* Modern TypeScript discriminated unions and functions can sometimes express the same problem more simply.
* Visitor is less attractive when the object structure itself is highly dynamic.

## Decision Criteria

Visitor is a strong choice when:

1. The element hierarchy is relatively stable.
2. The number of operations over that hierarchy is growing.
3. Operations need concrete-element-specific behavior.
4. Operations should remain separate from structural representation.
5. New operations are expected more frequently than new element types.
6. The object structure benefits from a stable dispatch contract.
7. The additional complexity of double dispatch is justified.

Prefer ordinary polymorphism when behavior naturally belongs to the elements and the number of operations is small.

Prefer Strategy when the primary variation is between interchangeable algorithms rather than operations over
heterogeneous elements.

Prefer Iterator when the primary concern is traversal.

Prefer Composite when the primary concern is recursive part-whole structure.

Prefer Interpreter when the primary concern is representing and evaluating a grammar.

Prefer discriminated unions and functions when the data is naturally modeled as immutable tagged values and exhaustive
type narrowing provides a simpler solution.

## Summary

Visitor separates **operations from a stable object structure**. Concrete elements expose an `accept` method, which
dispatches to the appropriate visitor operation. Concrete visitors then implement individual operations across the
element hierarchy.

Its defining mechanism is double dispatch: the concrete element determines which visitor operation is invoked, allowing
the operation to remain external to the element class.

The fundamental trade-off is between two axes of change. Visitor makes **adding new operations easier**, but makes
**adding new element types more expensive** because every visitor may need to change.

Visitor is particularly effective for abstract syntax trees, compiler structures, document models, hierarchical domain
structures, and other heterogeneous representations where the structure is relatively stable but analysis, validation,
transformation, rendering, or other operations continue to grow.

Visitor should not be confused with Iterator, which controls traversal; Composite, which models recursive part-whole
structure; Interpreter, which represents and evaluates grammar; or Strategy, which encapsulates interchangeable
algorithms.

In modern JavaScript and TypeScript, discriminated unions, functions, pattern matching techniques, and explicit
traversal can often replace the classic class-based implementation. The underlying design decision remains the same:
**when a stable set of element types must support many independently evolving operations, separating those operations
from the elements can provide a cleaner architecture.**

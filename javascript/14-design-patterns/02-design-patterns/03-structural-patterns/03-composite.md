# Composite

## Intent

**Composite composes objects into tree structures to represent part-whole hierarchies and lets clients treat individual
objects and compositions uniformly.**

The pattern defines a common component contract shared by both individual objects and containers of objects. A composite
can contain other components, including other composites, which allows arbitrarily deep recursive structures.

The essential property of Composite is **recursive composition around a common abstraction**.

A client can therefore operate on a leaf:

```js id="c4p6bw"
file.open();
```

or on a composite:

```js id="f5v2sk"
directory.open();
```

through the same conceptual interface.

## The Problem

Many domains naturally contain hierarchical structures.

Examples include:

* file systems;
* organizational structures;
* UI component trees;
* document structures;
* scene graphs;
* menus;
* permissions;
* expression trees;
* abstract syntax trees;
* nested configuration;
* geographic hierarchies.

Consider a file system:

```js id="h7q1sv"
class File {
    getSize() {
        return 10;
    }
}

class Directory {
    constructor(children) {
        this.children = children;
    }

    getSize() {
        return this.children.reduce(
            (total, child) => total + child.getSize(),
            0
        );
    }
}
```

Both `File` and `Directory` expose `getSize()`.

A directory can contain files and other directories:

```js id="n2v8kq"
const root = new Directory([
    new File(),
    new Directory([
        new File(),
        new File()
    ])
]);

root.getSize();
```

The recursive structure is the defining characteristic.

## Component

The **Component** is the common abstraction shared by leaves and composites.

```js id="x9g1fc"
class Component {
    operation() {
        throw new Error("Not implemented");
    }
}
```

The component contract should contain operations that make meaningful sense across the hierarchy.

For example:

```js id="s6m4ap"
class FileSystemNode {
    getSize() {
        throw new Error("Not implemented");
    }
}
```

Both files and directories can then satisfy the contract.

## Leaf

A **Leaf** represents an individual object that has no children.

```js id="k3j8mz"
class File extends FileSystemNode {
    constructor(name, size) {
        super();
        this.name = name;
        this.size = size;
    }

    getSize() {
        return this.size;
    }
}
```

A leaf terminates the recursive structure.

It does not need to know that it participates in a composite hierarchy.

## Composite

A **Composite** contains child components.

```js id="q7f2xa"
class Directory extends FileSystemNode {
    constructor(name) {
        super();
        this.name = name;
        this.children = [];
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        this.children = this.children.filter(
            item => item !== child
        );
    }

    getSize() {
        return this.children.reduce(
            (total, child) => total + child.getSize(),
            0
        );
    }
}
```

The children use the same component abstraction as the composite itself.

That is what makes recursion possible.

## Recursive Composition

A composite can contain another composite:

```js id="j8f4qm"
const root = new Directory("root");

const src = new Directory("src");
const tests = new Directory("tests");

src.add(new File("index.js", 100));
src.add(new File("app.js", 200));

tests.add(new File("app.test.js", 150));

root.add(src);
root.add(tests);
root.add(new File("package.json", 50));
```

The resulting structure can be arbitrarily deep without requiring a new class for every hierarchy level.

The same operation can then be applied to the root:

```js id="2f5v7x"
root.getSize();
```

The composite recursively delegates the operation to its children.

## Uniform Treatment

The client does not need separate logic for leaves and composites when the operation belongs to the common contract.

```js id="y4k9rz"
function printSize(node) {
    console.log(node.getSize());
}

printSize(new File("a.txt", 100));
printSize(root);
```

The client interacts with the `FileSystemNode` abstraction rather than inspecting the concrete type.

This uniformity is the primary usability benefit of Composite.

## Tree Structure

Composite naturally represents recursive trees.

A tree consists of:

* a root component;
* zero or more children;
* leaves that contain no children;
* composites that contain other components.

The structure is recursive because a composite's children are components, and a component may itself be a composite.

The pattern does not require a binary tree. A composite may contain zero, one, or many children.

## Child Management

Composites generally provide operations for managing children.

```js id="n5c2wt"
class Group extends Component {
    constructor(children = []) {
        super();
        this.children = [...children];
    }

    add(child) {
        this.children.push(child);
        return this;
    }

    remove(child) {
        const index = this.children.indexOf(child);

        if (index !== -1) {
            this.children.splice(index, 1);
        }

        return this;
    }

    getChildren() {
        return [...this.children];
    }
}
```

The exact child-management API depends on the domain.

Possible operations include:

* `add()`;
* `remove()`;
* `replace()`;
* `insert()`;
* `clear()`;
* `children()`;
* `getChildren()`.

Not every Composite needs every operation.

## Transparent vs Safe Composite Interfaces

There are two common approaches to the Component interface.

A **transparent** Composite exposes child-management operations through the common Component interface:

```js id="g6kq8p"
class Component {
    operation() {
    }

    add(component) {
    }

    remove(component) {
    }
}
```

Leaves then need to define what happens when `add()` or `remove()` is called.

A **safe** Composite keeps child-management operations on the Composite itself:

```js id="e3m9az"
class Composite extends Component {
    add(component) {
        // ...
    }
}
```

Leaves do not expose operations that make no sense for them.

The safe approach generally produces a cleaner API because leaf objects do not need meaningless methods.

The transparent approach provides a more uniform interface but can require runtime errors or no-op implementations for
unsupported operations.

## Transparent Composite

A transparent design might look like:

```js id="u4t7wd"
class Component {
    operation() {
        throw new Error("Not implemented");
    }

    add() {
        throw new Error("Cannot add children");
    }

    remove() {
        throw new Error("Cannot remove children");
    }
}

class Leaf extends Component {
    operation() {
        return "leaf";
    }
}

class Composite extends Component {
    constructor() {
        super();
        this.children = [];
    }

    operation() {
        return this.children.map(child => child.operation());
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        this.children = this.children.filter(
            item => item !== child
        );
    }
}
```

The client can depend on one broad interface.

The drawback is that the interface advertises operations that do not make semantic sense for every component.

## Safe Composite

A safe design keeps structural operations on the composite:

```js id="m8w3fs"
class Component {
    operation() {
        throw new Error("Not implemented");
    }
}

class Leaf extends Component {
    operation() {
        return "leaf";
    }
}

class Composite extends Component {
    constructor(children = []) {
        super();
        this.children = [...children];
    }

    add(child) {
        this.children.push(child);
    }

    remove(child) {
        this.children = this.children.filter(
            item => item !== child
        );
    }

    operation() {
        return this.children.map(child => child.operation());
    }
}
```

This keeps the common contract focused on operations that apply to all components.

The trade-off is that code which needs to construct or modify the tree may need to know whether a component is a
composite.

## Choosing the Interface

The choice between transparent and safe Composite should be based on the domain contract rather than on strict adherence
to the original GoF structure.

Use a common child-management interface when all component types meaningfully support the same structural operations.

Use a restricted composite interface when only composites can contain children and exposing `add()` or `remove()` on
leaves would create invalid operations.

The important invariant is that the component abstraction remains coherent.

## Recursive Operations

Composite operations are often recursive.

For example:

```js id="a6v3s1"
class Group {
    constructor(children = []) {
        this.children = children;
    }

    render() {
        for (const child of this.children) {
            child.render();
        }
    }
}
```

A leaf renders itself:

```js id="m2n8cy"
class Shape {
    render() {
        // Render this shape
    }
}
```

A group renders all descendants by delegating to each child.

This naturally supports arbitrary nesting.

## Aggregation

A common Composite operation aggregates child results.

```js id="f7q2nc"
class Folder {
    constructor(children = []) {
        this.children = children;
    }

    getTotalSize() {
        return this.children.reduce(
            (total, child) =>
                total + child.getTotalSize(),
            0
        );
    }
}

class File {
    constructor(size) {
        this.size = size;
    }

    getTotalSize() {
        return this.size;
    }
}
```

A leaf returns its own value.

A composite combines the values of its descendants.

This pattern is useful for operations such as:

* total size;
* total cost;
* total duration;
* descendant count;
* aggregate permissions;
* validation results;
* rendered output;
* calculated scores.

## Command Propagation

Composite can propagate an operation through a hierarchy.

```js id="r5n1zk"
class UiComponent {
    render() {
        // ...
    }
}

class Panel extends UiComponent {
    constructor(children = []) {
        super();
        this.children = children;
    }

    render() {
        for (const child of this.children) {
            child.render();
        }
    }
}
```

Calling:

```js id="8v5jwm"
panel.render();
```

causes the operation to propagate recursively through the tree.

This is common in UI trees, scene graphs, document models, and other hierarchical systems.

## Composite with Return Values

Not every recursive operation is a command.

A composite can return transformed or aggregated data:

```js id="x2k6hf"
class Group {
    constructor(children = []) {
        this.children = children;
    }

    calculate() {
        return this.children.reduce(
            (total, child) =>
                total + child.calculate(),
            0
        );
    }
}

class Item {
    constructor(value) {
        this.value = value;
    }

    calculate() {
        return this.value;
    }
}
```

The component contract should define whether the operation returns:

* nothing;
* a value;
* an aggregate;
* a transformed representation;
* a promise;
* a domain-specific result.

## Asynchronous Composite Operations

Composite can propagate asynchronous operations as well.

```js id="v4c1ms"
class Directory {
    constructor(children = []) {
        this.children = children;
    }

    async load() {
        await Promise.all(
            this.children.map(child => child.load())
        );
    }
}

class File {
    async load() {
        // Load file
    }
}
```

Concurrency semantics must be intentional.

`Promise.all()` executes child operations concurrently, while sequential iteration may be required when ordering or
resource constraints matter.

Composite does not prescribe the concurrency model.

## Error Propagation

Composite operations need an explicit error policy.

A simple implementation may allow child errors to propagate:

```js id="c5x9ra"
class Group {
    constructor(children = []) {
        this.children = children;
    }

    async execute() {
        for (const child of this.children) {
            await child.execute();
        }
    }
}
```

An error terminates the operation.

Other domains may require:

* collecting all errors;
* continuing after failures;
* partial success;
* rollback;
* compensation;
* best-effort execution.

These are behavioral policies of the specific Composite implementation, not intrinsic properties of the pattern.

## Ordering

Child order can be semantically significant.

For example:

```js id="v1c8qk"
class Pipeline {
    constructor(stages = []) {
        this.stages = stages;
    }

    async execute(input) {
        let value = input;

        for (const stage of this.stages) {
            value = await stage.execute(value);
        }

        return value;
    }
}
```

This is hierarchical composition, but it relies on ordered children.

Other composites may treat children as an unordered collection.

The component contract should make ordering semantics explicit where they matter.

## Parent References

A composite may maintain a reference to its parent:

```js id="e7q2vt"
class Node {
    constructor(parent = null) {
        this.parent = parent;
    }
}
```

This can support:

* upward navigation;
* context lookup;
* event propagation;
* path calculation;
* tree restructuring.

However, parent references create bidirectional relationships and complicate ownership, cloning, serialization, and
garbage collection considerations.

They should be introduced only when the domain requires upward navigation.

## Ownership of Children

A Composite often owns its child collection, but ownership semantics vary.

Strong ownership means the composite controls the lifecycle of its children.

Shared ownership means a component can appear in multiple composites.

These models have different implications.

If a node can belong to only one parent, the Composite can enforce that invariant:

```js id="n8p4zr"
class Node {
    constructor() {
        this.parent = null;
    }

    attachTo(parent) {
        if (this.parent) {
            throw new Error("Node already has a parent");
        }

        this.parent = parent;
    }
}
```

If components may be shared, the structure is no longer necessarily a conventional tree and may instead form a directed
graph.

## Tree vs Graph

Composite represents a tree-like structure.

A conventional tree assumes:

* one root;
* each child has at most one parent;
* no cycles.

If the same object can appear under multiple parents:

```js id="j4w7ps"
const shared = new Component();

const first = new Composite([shared]);
const second = new Composite([shared]);
```

the structure becomes a graph rather than a strict tree.

If cycles are possible:

```js id="c6q3mw"
a.add(b);
b.add(a);
```

recursive operations can become non-terminating.

Composite implementations should therefore establish structural invariants appropriate to the domain.

## Cycle Prevention

When arbitrary components can be attached to one another, cycle prevention may be necessary.

A recursive traversal can detect cycles:

```js id="h5z9pd"
function visit(node, visited = new Set()) {
    if (visited.has(node)) {
        throw new Error("Cycle detected");
    }

    visited.add(node);

    for (const child of node.children ?? []) {
        visit(child, visited);
    }

    visited.delete(node);
}
```

Whether cycle detection is necessary depends on the domain.

A file system hierarchy should not contain cycles through ordinary parent-child relationships, while a graph model may
intentionally allow them.

Composite should not be confused with a general-purpose graph abstraction.

## TypeScript Representation

TypeScript can make the common component contract explicit:

```ts id="s7x3nm"
interface Component {
    operation(): void;
}
```

A leaf implements the contract:

```ts id="m9k4vt"
class Leaf implements Component {
    operation(): void {
        console.log("Leaf");
    }
}
```

A composite implements the same contract and stores components:

```ts id="r2c6yw"
class Composite implements Component {
    constructor(
        private readonly children: Component[] = []
    ) {
    }

    add(child: Component): void {
        this.children.push(child);
    }

    operation(): void {
        for (const child of this.children) {
            child.operation();
        }
    }
}
```

The recursive type relationship is expressed directly through `Component[]`.

## Recursive Type Definitions

TypeScript can also represent recursive structural data:

```ts id="t5g1qn"
interface Node {
    name: string;
    children?: Node[];
}
```

However, this alone does not constitute the Composite pattern.

A recursive data structure is merely a recursive data structure.

Composite adds a behavioral abstraction in which both individual and composed objects conform to a common component
contract.

## Generic Composite

A generic composite can model a reusable hierarchy:

```ts id="w4p7ka"
interface Node<T> {
    value(): T;
}

class Leaf<T> implements Node<T> {
    constructor(
        private readonly value_: T
    ) {
    }

    value(): T {
        return this.value_;
    }
}

class Composite<T> implements Node<T> {
    constructor(
        private readonly children: Node<T>[]
    ) {
    }

    value(combine: (values: T[]) => T): T {
        return combine(
            this.children.map(child => child.value())
        );
    }
}
```

The generic design is useful when the component operation produces a domain-specific result.

However, generic abstractions should not be introduced merely to make a Composite framework-like. Domain-specific
contracts are often easier to understand.

## Composite with Different Leaf Types

A hierarchy may contain multiple kinds of leaves.

```js id="b8q2ls"
class TextNode {
    render() {
        return "text";
    }
}

class ImageNode {
    render() {
        return "<image>";
    }
}

class Group {
    constructor(children = []) {
        this.children = children;
    }

    render() {
        return this.children
            .map(child => child.render())
            .join("");
    }
}
```

The composite does not need to know the concrete leaf type as long as each child satisfies the component contract.

This is one of the main benefits of polymorphic composition.

## Composite with Different Composite Types

A hierarchy can also contain multiple composite types.

```js id="q1n6wv"
class Row {
    constructor(children = []) {
        this.children = children;
    }

    render() {
        return this.children
            .map(child => child.render())
            .join("");
    }
}

class Column {
    constructor(children = []) {
        this.children = children;
    }

    render() {
        return this.children
            .map(child => child.render())
            .join("");
    }
}
```

Both can contain components while providing different structural semantics.

A common component contract allows them to participate in the same hierarchy.

## Composite and Visitor

Composite and Visitor frequently appear together.

Composite defines the hierarchical object structure.

Visitor separates operations from the objects being traversed.

For example, a document tree might contain:

```js id="f8k3vc"
class TextNode {
}

class ImageNode {
}

class Paragraph {
}

class Document {
}
```

Different operations may need to traverse that structure:

* rendering;
* validation;
* indexing;
* serialization;
* analysis.

Embedding every operation directly into every node can produce large interfaces.

Visitor can centralize operations while Composite provides the recursive structure.

The patterns solve different problems and can complement each other.

## Composite and Iterator

Composite defines how objects are recursively composed.

Iterator defines how clients traverse a collection without exposing its representation.

A Composite can expose an iterator:

```js id="d2m7xf"
class Group {
    constructor(children = []) {
        this.children = children;
    }

    * [Symbol.iterator]() {
        yield* this.children;
    }
}
```

For recursive traversal, a depth-first iterator can be implemented:

```js id="a9c5jk"
class Group {
    constructor(children = []) {
        this.children = children;
    }

    * [Symbol.iterator]() {
        for (const child of this.children) {
            yield child;

            if (child[Symbol.iterator]) {
                yield* child;
            }
        }
    }
}
```

The Composite defines the hierarchy. The Iterator defines traversal behavior.

## Composite and Command

Composite can contain commands and execute them as a group.

```js id="u7n4zx"
class CommandGroup {
    constructor(commands = []) {
        this.commands = commands;
    }

    execute() {
        for (const command of this.commands) {
            command.execute();
        }
    }
}

class SaveCommand {
    execute() {
        // ...
    }
}

class DeleteCommand {
    execute() {
        // ...
    }
}
```

The group treats an individual command and a group of commands uniformly.

This is a common use of Composite in command processing.

## Composite and Decorator

Decorator and Composite both wrap or contain other objects, but their structures are fundamentally different.

Decorator normally has one wrapped component and adds behavior while preserving the component interface:

```js id="v6q3nw"
class LoggingComponent {
    constructor(component) {
        this.component = component;
    }

    operation() {
        console.log("operation");
        return this.component.operation();
    }
}
```

Composite contains multiple components and represents a part-whole hierarchy:

```js id="k9w2fj"
class Composite {
    constructor(children = []) {
        this.children = children;
    }

    operation() {
        for (const child of this.children) {
            child.operation();
        }
    }
}
```

The defining distinction is **one wrapped component with added behavior versus recursive aggregation of multiple
components into a whole**.

## Composite and Proxy

Proxy also wraps another object, but its purpose is to control access to that object.

Examples include:

* lazy loading;
* authorization;
* remote access;
* caching;
* access logging.

Composite is not primarily an access-control mechanism. It represents a hierarchy of components.

A composite can contain many children, while a proxy typically represents one subject.

## Composite and Chain of Responsibility

Chain of Responsibility passes a request through a sequence of handlers until one or more handlers process it.

A composite represents a hierarchy and generally propagates an operation across its children.

A chain is fundamentally about **request handling flow**.

A composite is fundamentally about **part-whole structure**.

A composite may internally use a chain, and a chain may contain composite handlers, but the concepts should remain
distinct.

## Composite and Builder

Builder constructs complex objects step by step.

Composite represents the resulting hierarchical object structure.

A builder may construct a Composite:

```js id="s3c7mt"
const menu = new MenuBuilder()
    .addItem("Home")
    .addGroup("Settings", group => {
        group.addItem("Profile");
        group.addItem("Security");
    })
    .build();
```

The builder solves construction. Composite solves representation and uniform behavior of the hierarchy.

## Composite and Tree Data Structures

Not every tree is a Composite.

For example:

```js id="j7f4zc"
const node = {
    value: 10,
    children: []
};
```

is simply a tree node.

Composite becomes relevant when individual objects and composed objects share a meaningful behavioral abstraction.

The distinction is therefore between **recursive data representation** and **polymorphic part-whole behavior**.

## Composite and Domain Models

Composite is useful when the domain itself contains meaningful whole-part relationships.

Examples include:

```js id="e6r2vq"
class Product {
}

class Bundle {
    constructor(items = []) {
        this.items = items;
    }
}
```

If both `Product` and `Bundle` need to participate in the same domain operation, such as calculating price, Composite
can provide the common contract:

```js id="n8p3yf"
class Item {
    getPrice() {
        throw new Error("Not implemented");
    }
}

class Product extends Item {
    constructor(price) {
        super();
        this.price = price;
    }

    getPrice() {
        return this.price;
    }
}

class Bundle extends Item {
    constructor(items = []) {
        super();
        this.items = items;
    }

    getPrice() {
        return this.items.reduce(
            (total, item) => total + item.getPrice(),
            0
        );
    }
}
```

The client can treat an individual product and a bundle uniformly.

## Composite and UI Systems

UI systems are a natural application of Composite.

A leaf component may render an individual element:

```js id="r4c9tz"
class Button {
    render() {
        // Render button
    }
}
```

A container can render its children:

```js id="m5w8qp"
class Panel {
    constructor(children = []) {
        this.children = children;
    }

    render() {
        for (const child of this.children) {
            child.render();
        }
    }
}
```

A panel can contain buttons and other panels.

This produces a recursive component hierarchy where clients can invoke the same operation on any component.

## Composite and Event Propagation

Composite structures often participate in event propagation.

```js id="q8m4vx"
class Component {
    handle(event) {
        // ...
    }
}

class Container extends Component {
    constructor(children = []) {
        super();
        this.children = children;
    }

    handle(event) {
        for (const child of this.children) {
            child.handle(event);
        }
    }
}
```

Real event systems often require additional semantics such as:

* capture;
* bubbling;
* stopping propagation;
* event ownership;
* ordering;
* target selection.

Those semantics should be modeled explicitly rather than assumed to follow automatically from Composite.

## Composite and Permissions

Permissions can form hierarchical structures.

```js id="c2r6yk"
class Permission {
    allows(action) {
        return false;
    }
}

class PermissionGroup extends Permission {
    constructor(permissions = []) {
        super();
        this.permissions = permissions;
    }

    allows(action) {
        return this.permissions.some(
            permission => permission.allows(action)
        );
    }
}
```

The composite can aggregate child permissions.

The exact aggregation semantics matter. `some()` represents an OR relationship, while `every()` represents an AND
relationship.

Composite supplies the recursive structure; the domain determines the aggregation rule.

## Composite and Expression Trees

Expression trees are another natural example.

```js id="x5v9mc"
class Literal {
    constructor(value) {
        this.value = value;
    }

    evaluate() {
        return this.value;
    }
}

class Add {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    evaluate() {
        return this.left.evaluate() +
            this.right.evaluate();
    }
}
```

An expression can therefore contain other expressions recursively.

```js id="p8q4vs"
const expression = new Add(
    new Literal(10),
    new Add(
        new Literal(20),
        new Literal(30)
    )
);

expression.evaluate();
```

Both literals and compound expressions expose `evaluate()`.

## Composite and Abstract Syntax Trees

Abstract syntax trees have recursive structure and can use Composite-like design.

```js id="n6c2rz"
class NumberLiteral {
    evaluate() {
        return 10;
    }
}

class BinaryExpression {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    evaluate() {
        const left = this.left.evaluate();
        const right = this.right.evaluate();

        if (this.operator === "+") {
            return left + right;
        }

        throw new Error("Unsupported operator");
    }
}
```

Compiler and interpreter systems often combine recursive structures with Visitor, Iterator, and other traversal
mechanisms.

## Immutability

Composite structures can be mutable or immutable.

A mutable composite:

```js id="h3v8qs"
class Group {
    constructor(children = []) {
        this.children = children;
    }

    add(child) {
        this.children.push(child);
    }
}
```

An immutable composite can return a new instance:

```js id="w9k2jd"
class Group {
    constructor(children = []) {
        this.children = Object.freeze([...children]);
        Object.freeze(this);
    }

    add(child) {
        return new Group([
            ...this.children,
            child
        ]);
    }
}
```

Immutable Composite structures can simplify concurrency, caching, change tracking, and reasoning about historical
versions, but they may increase allocation costs.

## Structural Equality

Composite objects may need structural equality.

Two independently constructed hierarchies can contain equivalent values without sharing object identity.

```js id="q5r8mx"
function equals(a, b) {
    if (a.constructor !== b.constructor) {
        return false;
    }

    if (a instanceof File) {
        return (
            a.name === b.name &&
            a.size === b.size
        );
    }

    if (a instanceof Directory) {
        return (
            a.name === b.name &&
            a.children.length === b.children.length &&
            a.children.every(
                (child, index) =>
                    equals(child, b.children[index])
            )
        );
    }

    return false;
}
```

Structural equality is not part of Composite itself, but recursive object structures often require it.

## Serialization

Composite structures can often be serialized recursively.

```js id="v8m3cy"
function serialize(node) {
    if (node instanceof File) {
        return {
            type: "file",
            name: node.name,
            size: node.size
        };
    }

    if (node instanceof Directory) {
        return {
            type: "directory",
            name: node.name,
            children: node.children.map(serialize)
        };
    }

    throw new Error("Unknown node");
}
```

Deserialization should restore valid component types and enforce structural invariants.

If parent references or cycles exist, naive recursive serialization can fail or produce incorrect representations.

## Lazy Children

Large Composite structures may benefit from lazy child loading.

```js id="r6n2wx"
class LazyDirectory {
    constructor(loader) {
        this.loader = loader;
        this.children = null;
    }

    async getChildren() {
        if (!this.children) {
            this.children = await this.loader();
        }

        return this.children;
    }
}
```

Lazy loading is not intrinsic to Composite. It is an additional implementation strategy.

When lazy loading is used, the component contract must make asynchronous behavior explicit.

## Caching Aggregates

Recursive operations can become expensive when repeatedly evaluated.

A composite can cache aggregate results:

```js id="m7q4zp"
class Folder {
    constructor(children = []) {
        this.children = children;
        this.cachedSize = null;
    }

    getSize() {
        if (this.cachedSize !== null) {
            return this.cachedSize;
        }

        this.cachedSize = this.children.reduce(
            (total, child) => total + child.getSize(),
            0
        );

        return this.cachedSize;
    }
}
```

Mutation invalidates the cache:

```js id="k3v8fd"
add(child)
{
    this.children.push(child);
    this.cachedSize = null;
}
```

Caching becomes more complicated when descendants can mutate independently.

If aggregate caching is important, the hierarchy may need explicit invalidation or immutable nodes.

## Deep Traversal

A Composite does not require a particular traversal algorithm.

Depth-first traversal is common:

```js id="x4q9mc"
function* depthFirst(node) {
    yield node;

    if (node.children) {
        for (const child of node.children) {
            yield* depthFirst(child);
        }
    }
}
```

Breadth-first traversal can instead use a queue:

```js id="t8m2vn"
function* breadthFirst(root) {
    const queue = [root];

    while (queue.length > 0) {
        const node = queue.shift();

        yield node;

        if (node.children) {
            queue.push(...node.children);
        }
    }
}
```

Traversal strategy is separate from the Composite pattern itself.

## Stack Safety

Deep hierarchies can cause recursive JavaScript functions to exceed the call stack.

For example:

```js id="v3n7qx"
function calculate(node) {
    return node.children.reduce(
        (total, child) =>
            total + calculate(child),
        0
    );
}
```

For very deep structures, an explicit stack may be safer:

```js id="a6w1kc"
function calculate(root) {
    let total = 0;
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();

        total += node.value();

        if (node.children) {
            stack.push(...node.children);
        }
    }

    return total;
}
```

Composite does not require recursive function calls. The hierarchy is recursive; the implementation of traversal can be
recursive or iterative.

## Performance

Composite introduces an object hierarchy and recursive delegation.

Performance considerations include:

* traversal cost;
* allocation of child arrays;
* recursive call depth;
* repeated aggregate calculations;
* parent references;
* mutation and cache invalidation;
* lazy loading;
* synchronization of shared structures.

For most domain hierarchies, the abstraction cost is negligible compared with the clarity it provides.

For extremely large trees, representation and traversal strategy may become significant architectural concerns.

## Memory Considerations

Every component in a Composite is an object with associated memory overhead.

A large tree can therefore consume substantial memory.

Possible techniques include:

* compact data representations;
* immutable structural sharing;
* lazy nodes;
* indexed storage;
* iterative traversal;
* externalized metadata.

These are optimization strategies rather than requirements of the pattern.

## Concurrency

JavaScript applications can encounter concurrent asynchronous operations over the same Composite structure.

For example:

```js id="e8q3nk"
await Promise.all([
    tree.load(),
    tree.validate(),
    tree.render()
]);
```

If the tree is mutable and these operations can modify it, race conditions may occur.

Immutable Composite structures can simplify concurrent reads because the hierarchy cannot change during traversal.

If mutation is required, ownership and synchronization rules should be explicit.

## Testing Composite Structures

Composite tests should cover both leaves and nested composites.

A basic test can verify leaf behavior:

```js id="s9f4mw"
const file = new File("a.txt", 100);

console.assert(file.getSize() === 100);
```

A composite test can verify aggregation:

```js id="q6v2zt"
const directory = new Directory("root");

directory.add(new File("a.txt", 100));
directory.add(new File("b.txt", 200));

console.assert(directory.getSize() === 300);
```

A recursive test should verify nested composition:

```js id="p3n8yc"
const root = new Directory("root");
const nested = new Directory("nested");

nested.add(new File("a.txt", 100));
root.add(nested);
root.add(new File("b.txt", 200));

console.assert(root.getSize() === 300);
```

Important edge cases include:

* empty composites;
* one-child composites;
* deeply nested structures;
* duplicate children;
* invalid children;
* removal;
* reparenting;
* cycles;
* asynchronous failures;
* mutation during traversal.

## Common Misuse

### Using Composite Without a Part-Whole Relationship

A collection of objects is not automatically a Composite.

If the objects do not form a meaningful hierarchical whole-part relationship, a normal collection is usually sufficient.

### Calling Every Recursive Structure Composite

A recursive data structure does not automatically implement the Composite pattern.

The defining property is a common behavioral abstraction shared by individual and composed objects.

### Exposing an Unstable Common Interface

If leaves and composites have fundamentally different behavior, forcing them into one interface can create an
abstraction that satisfies neither well.

Uniformity should be meaningful, not artificial.

### Making Leaves Support Invalid Operations

A transparent interface can lead to methods such as:

```js id="r8w3mq"
leaf.add(child);
```

when a leaf cannot contain children.

If such operations are semantically invalid, a safe Composite interface may be preferable.

### Embedding Every Operation in the Component

A component interface can become enormous if every tree operation is added directly:

```js id="k5p9dx"
render()
validate()
serialize()
export
()
index()
search()
calculate()
persist()
authorize()
```

At some point, Visitor, external services, or other operation-specific abstractions may provide better separation.

### Ignoring Structural Invariants

Allowing arbitrary cycles, multiple parents, invalid child types, or inconsistent ownership can make recursive
operations unreliable.

The Composite should enforce the invariants required by the domain.

## Refactoring Toward Composite

A common refactoring process is:

1. Identify a recurring part-whole hierarchy.
2. Identify operations that should apply to both individual parts and wholes.
3. Define the smallest meaningful common component contract.
4. Implement leaf objects against that contract.
5. Implement composites containing components.
6. Move recursive aggregation or propagation into the composite.
7. Replace client-side type checks with polymorphic component operations where appropriate.
8. Enforce hierarchy and ownership invariants.

A particularly strong signal is repeated client logic such as:

```js id="w2k7pn"
if (node.children) {
    for (const child of node.children) {
        // ...
    }
} else {
    // ...
}
```

If this distinction is repeated throughout the system, the behavior may belong in a common component abstraction.

## Refactoring Away from Composite

Composite should be reconsidered when the hierarchy is not actually part of the domain model or when leaves and
composites have fundamentally different contracts.

If clients constantly need to determine whether an object is a leaf or composite, the common abstraction may not be
providing meaningful uniformity.

A simpler representation may be preferable when:

* the hierarchy is purely data;
* only one operation exists;
* recursion is incidental;
* child management is centralized elsewhere;
* the common interface has many exceptions;
* the tree is merely an internal implementation detail.

In such cases, a dedicated tree data structure or plain recursive data representation may be clearer.

## Architectural Considerations

Composite is particularly useful when hierarchical structures cross architectural boundaries.

Examples include:

* document models;
* UI component hierarchies;
* authorization structures;
* workflow trees;
* expression models;
* resource hierarchies.

The component abstraction should represent a domain concept rather than an arbitrary technical container.

A Composite should also avoid becoming a general-purpose service locator for its children. Child ownership, traversal,
and domain behavior should remain explicit.

## Composite and Dependency Injection

Dependency injection can supply dependencies to both leaves and composites:

```js id="f4n8wy"
class File {
    constructor(storage) {
        this.storage = storage;
    }
}

class Directory {
    constructor(children) {
        this.children = children;
    }
}
```

DI does not make the structure Composite.

Composite concerns the recursive relationship between components.

Dependency injection concerns how dependencies are supplied.

The two mechanisms can coexist.

## Composite and Factories

Factories are often useful for constructing hierarchical structures.

```js id="q8v3md"
function createNode(data) {
    if (data.type === "file") {
        return new File(data.name, data.size);
    }

    if (data.type === "directory") {
        return new Directory(
            data.children.map(createNode)
        );
    }

    throw new Error(`Unknown node type: ${data.type}`);
}
```

The factory creates the Composite hierarchy.

Composite defines how the resulting objects behave uniformly.

## Composite and Builder

Builder is useful when constructing large or complex hierarchies incrementally.

```js id="m6q2xc"
const document = new DocumentBuilder()
    .addParagraph("Introduction")
    .addSection("Details", section => {
        section.addParagraph("...");
    })
    .build();
```

The builder handles construction.

The resulting document can use Composite to represent and operate on the hierarchy.

## Composite and Serialization Formats

A Composite can map naturally to JSON:

```js id="p7w4zn"
{
    "type"
:
    "directory",
        "name"
:
    "root",
        "children"
:
    [
        {
            "type": "file",
            "name": "a.txt",
            "size": 100
        }
    ]
}
```

However, the serialized format is not itself the Composite pattern.

The pattern exists in the object model and its polymorphic recursive behavior.

## Benefits

Composite provides:

* natural representation of hierarchical structures;
* uniform treatment of leaves and composites;
* recursive composition;
* recursive operation propagation;
* reduced client-side type checking;
* support for arbitrary hierarchy depth;
* easy addition of new leaf types;
* easy addition of new composite types;
* reusable tree operations;
* natural aggregation of child results.

## Costs

Composite introduces:

* additional abstraction;
* recursive object relationships;
* more complex ownership rules;
* potential ambiguity between leaves and composites;
* structural validation requirements;
* possible traversal costs;
* potential stack-depth issues;
* more complicated mutation semantics;
* potentially large object graphs;
* difficulty when operations do not apply uniformly.

The pattern is most valuable when the hierarchy itself is meaningful and individual objects and compositions genuinely
share behavior.

## Decision Criteria

Composite is a strong candidate when most of these conditions hold:

| Question                                                               | Composite signal |
|------------------------------------------------------------------------|------------------|
| Does the domain contain a meaningful part-whole hierarchy?             | Yes              |
| Can a whole contain other components recursively?                      | Yes              |
| Do leaves and composites share meaningful operations?                  | Yes              |
| Should clients treat an individual object and a composition uniformly? | Yes              |
| Are recursive operations common?                                       | Yes              |
| Would client-side leaf/composite branching otherwise be repeated?      | Yes              |
| Is the hierarchy itself part of the domain model?                      | Yes              |

If the hierarchy is merely a collection or recursive data structure without a common behavioral contract, Composite may
be unnecessary.

## Summary

Composite represents part-whole hierarchies by giving leaves and composites a common component abstraction.

A leaf represents an individual object. A composite contains components and delegates or aggregates operations across
them. Because composites contain components rather than only leaves, the structure can recurse to arbitrary depth.

The defining property is **uniform treatment of individual objects and recursively composed objects**.

Composite should not be confused with any arbitrary tree, collection, recursive data structure, or wrapper. Decorator
adds behavior around a component, Proxy controls access to a subject, Iterator controls traversal, and Builder
constructs complex structures. Composite specifically models a hierarchical whole composed of components that share a
common behavioral contract.

The decisive question is:

**Does the domain contain a recursive part-whole hierarchy in which both individual parts and composed wholes should be
treated through the same meaningful abstraction?**

If yes, Composite is an appropriate pattern.

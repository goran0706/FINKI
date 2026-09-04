# Iterator

Iterator is a behavioral design pattern that provides a way to access the elements of an aggregate object sequentially
without exposing the aggregate's underlying representation.

The pattern separates **traversal logic** from **the collection being traversed**. A client can request an iterator and
use a common traversal protocol without needing to know whether the underlying aggregate is an array, tree, graph,
linked structure, database-backed collection, generated sequence, or another representation.

JavaScript already provides a standardized iterator protocol through `Symbol.iterator` and `next()`. Consequently, many
applications use Iterator implicitly through `for...of`, spread syntax, destructuring, and other language features
rather than implementing an explicit GoF-style iterator hierarchy.

## Intent

Iterator provides sequential access to the elements of an aggregate object without exposing its underlying
representation.

The central separation is between **what a collection contains** and **how a traversal moves through that collection**.

A collection can therefore expose an iteration interface while keeping its internal representation private.

## The Problem

A collection may have an internal representation that clients should not depend on.

Consider a collection implemented with an array:

```js
class UserCollection {
    constructor(users) {
        this.users = users;
    }
}
```

A client could directly access the representation:

```js
for (const user of collection.users) {
    console.log(user);
}
```

This creates a dependency on the fact that the collection uses an array and exposes its storage.

If the implementation changes to a different representation, clients may need to change as well.

Iterator introduces a traversal abstraction:

```js
const iterator = collection.iterator();

let result = iterator.next();

while (!result.done) {
    console.log(result.value);
    result = iterator.next();
}
```

The client depends on the traversal protocol rather than the collection's internal storage.

## Aggregate

The Aggregate is the collection or object structure whose elements are being traversed.

A simple aggregate can provide an iterator:

```js
class UserCollection {
    constructor(users) {
        this.users = users;
    }

    iterator() {
        return new UserIterator(this);
    }
}
```

The aggregate controls which iterator implementation represents its traversal.

The aggregate does not necessarily need to expose its internal representation to the client.

## Iterator

The Iterator defines the traversal protocol.

A traditional representation might expose:

```js
class Iterator {
    next() {
        throw new Error("Not implemented");
    }

    hasNext() {
        throw new Error("Not implemented");
    }
}
```

JavaScript's native iterator protocol instead uses an object whose `next()` method returns an iteration result:

```js
{
    value: element,
        done
:
    false
}
```

and eventually:

```js
{
    value: undefined,
        done
:
    true
}
```

The native protocol is therefore already a concrete language-level implementation of the core Iterator concept.

## Concrete Iterator

A concrete iterator maintains traversal state.

```js
class UserIterator {
    constructor(collection) {
        this.collection = collection;
        this.index = 0;
    }

    next() {
        if (this.index >= this.collection.users.length) {
            return {
                value: undefined,
                done: true
            };
        }

        return {
            value: this.collection.users[this.index++],
            done: false
        };
    }
}
```

The iterator owns the current traversal position.

This allows multiple iterators to traverse the same aggregate independently.

## Independent Traversal State

Consider two iterators over the same collection:

```js
const first = collection.iterator();
const second = collection.iterator();

console.log(first.next());
console.log(first.next());

console.log(second.next());
```

The first iterator has its own position, while the second begins independently.

Traversal state therefore belongs to the iterator rather than the aggregate when independent concurrent traversals are
required.

This is an important distinction from storing a single cursor directly on the collection.

## JavaScript Iterator Protocol

JavaScript defines a standard iterator protocol.

An iterator object provides a `next()` method:

```js
const iterator = {
    next() {
        return {
            value: 42,
            done: false
        };
    }
};
```

A complete iterator eventually returns `done: true`.

```js
const iterator = {
    index: 0,

    next() {
        if (this.index >= 3) {
            return {
                value: undefined,
                done: true
            };
        }

        return {
            value: this.index++,
            done: false
        };
    }
};
```

The protocol allows JavaScript language features to consume the iterator without knowing its implementation.

## Iterable Objects

An iterable object implements `[Symbol.iterator]()`.

```js
class UserCollection {
    constructor(users) {
        this.users = users;
    }

    [Symbol.iterator]() {
        return this.users[Symbol.iterator]();
    }
}
```

The collection can now be consumed by `for...of`:

```js
for (const user of collection) {
    console.log(user);
}
```

The client does not need to call `next()` directly.

The `[Symbol.iterator]()` method provides the iterator for a new traversal.

## `for...of`

`for...of` uses the iterable protocol.

```js
for (const item of collection) {
    console.log(item);
}
```

Conceptually, JavaScript obtains an iterator and repeatedly invokes `next()` until the iterator reports completion.

The syntax hides the traversal mechanics while preserving the iterator abstraction.

This is one reason Iterator is especially natural in JavaScript.

## Spread Syntax

Iterable objects can be expanded with spread syntax:

```js
const users = [...collection];
```

The operation consumes the collection through its iterator.

The collection therefore controls how its elements are exposed for iteration without requiring the client to know its
internal representation.

## Destructuring

Destructuring can also consume iterables:

```js
const [first, second] = collection;
```

The underlying mechanism is still the iterator protocol.

This means that implementing `[Symbol.iterator]()` can automatically integrate a custom aggregate with several native
JavaScript features.

## Generators

Generators provide a concise way to implement iterators.

```js
class UserCollection {
    constructor(users) {
        this.users = users;
    }

    * [Symbol.iterator]() {
        for (const user of this.users) {
            yield user;
        }
    }
}
```

The generator automatically maintains traversal state.

The client can use:

```js
for (const user of collection) {
    console.log(user);
}
```

The implementation is substantially smaller than a manually maintained `next()` method.

## Generator vs Iterator

A generator is a language mechanism for producing iterators.

Iterator is the behavioral abstraction of sequential traversal.

Therefore:

```js
function* values() {
    yield 1;
    yield 2;
    yield 3;
}
```

uses a generator to implement an iterator.

Generators are not a replacement for the conceptual pattern. They are one of the primary mechanisms JavaScript provides
for implementing it.

## Custom Collection Representation

Iterator becomes particularly useful when the collection is not naturally represented as a simple array.

For example, a linked structure can expose iteration without exposing its nodes:

```js
class LinkedCollection {
    constructor(head) {
        this.head = head;
    }

    * [Symbol.iterator]() {
        let current = this.head;

        while (current) {
            yield current.value;
            current = current.next;
        }
    }
}
```

Clients can simply write:

```js
for (const value of collection) {
    console.log(value);
}
```

The traversal algorithm knows about linked nodes; the client does not.

## Tree Traversal

Iterator can encapsulate traversal of a tree.

```js
class Tree {
    constructor(root) {
        this.root = root;
    }

    * [Symbol.iterator]() {
        yield* traverse(this.root);
    }
}
```

The traversal function can implement depth-first traversal:

```js
function* traverse(node) {
    if (!node) {
        return;
    }

    yield node.value;

    yield* traverse(node.left);
    yield* traverse(node.right);
}
```

The client does not need to know whether traversal is preorder, inorder, postorder, or another strategy.

## Traversal Order

A collection may support multiple traversal orders.

For example:

```js
class Tree {
    constructor(root) {
        this.root = root;
    }

    * preOrder() {
        yield* traversePreOrder(this.root);
    }

    * inOrder() {
        yield* traverseInOrder(this.root);
    }

    * postOrder() {
        yield* traversePostOrder(this.root);
    }
}
```

The traversal algorithm becomes an explicit choice.

```js
for (const value of tree.preOrder()) {
    console.log(value);
}
```

This is useful when the same aggregate supports multiple meaningful traversal semantics.

## Separate Iterator Objects

Instead of exposing traversal methods directly, separate iterator objects can represent each traversal.

```js
class InOrderIterator {
    constructor(root) {
        this.stack = [];
        this.current = root;
    }

    next() {
        while (this.current) {
            this.stack.push(this.current);
            this.current = this.current.left;
        }

        if (this.stack.length === 0) {
            return {
                value: undefined,
                done: true
            };
        }

        const node = this.stack.pop();
        this.current = node.right;

        return {
            value: node.value,
            done: false
        };
    }
}
```

This approach is useful when traversal has substantial state or multiple traversal algorithms must coexist
independently.

## Iterator State

An iterator may maintain:

* current index
* current node
* traversal stack
* traversal queue
* cursor position
* pagination state
* filtering state
* transformation state

The state belongs to the traversal rather than necessarily to the aggregate.

This allows several traversals over the same aggregate to proceed independently.

## Lazy Traversal

Iterators are naturally suited to lazy evaluation.

A generator does not need to produce every element immediately:

```js
function* numbers() {
    let value = 0;

    while (true) {
        yield value++;
    }
}
```

The consumer can request only the elements it needs:

```js
const iterator = numbers();

console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
```

The infinite sequence is possible because values are generated on demand rather than materialized into an array.

## Infinite Sequences

Iterators can represent sequences that have no natural end.

```js
function* ids() {
    let id = 1;

    while (true) {
        yield id++;
    }
}
```

Consumers must impose their own termination condition.

```js
for (const id of ids()) {
    if (id > 10) {
        break;
    }

    console.log(id);
}
```

This is a significant difference between iterators and fully materialized collections.

## Lazy Computation

An iterator can defer expensive computation.

```js
function* expensiveValues(values) {
    for (const value of values) {
        yield expensiveCalculation(value);
    }
}
```

The calculation happens only when the consumer requests the corresponding element.

This can reduce memory usage and avoid unnecessary work.

Lazy execution also means errors and side effects may occur during traversal rather than when the iterator is created.

## Filtering

Iterator-based traversal can filter values lazily.

```js
function* filter(iterable, predicate) {
    for (const value of iterable) {
        if (predicate(value)) {
            yield value;
        }
    }
}
```

Usage:

```js
const activeUsers = filter(
    users,
    user => user.active
);
```

The resulting iterable does not need to allocate an intermediate array.

## Mapping

Mapping can also be lazy:

```js
function* map(iterable, transform) {
    for (const value of iterable) {
        yield transform(value);
    }
}
```

This allows iterator pipelines:

```js
const names = map(
    filter(users, user => user.active),
    user => user.name
);
```

The computation occurs as the resulting iterator is consumed.

This resembles functional collection processing, but the defining Iterator concern remains traversal.

## Iterator Pipelines

Iterator transformations can be composed.

```js
const result = map(
    filter(
        users,
        user => user.active
    ),
    user => user.name
);
```

Each iterator can request values from the previous iterator.

This provides lazy pipelines without materializing intermediate collections.

The pattern should not be confused with Chain of Responsibility or Decorator merely because operations are chained.
Iterator pipelines transform or select elements during traversal; Chain of Responsibility distributes request handling;
Decorator wraps a component to add responsibilities.

## Early Termination

Consumers can stop iteration before the aggregate is exhausted.

```js
for (const user of users) {
    if (user.id === targetId) {
        break;
    }
}
```

This is particularly valuable for lazy iterators because unnecessary work is avoided.

A search over a large or infinite sequence can terminate as soon as the desired value is found.

## Iterator Return Values

JavaScript's iterator protocol allows `next()` to return a final value:

```js
function* example() {
    yield 1;
    yield 2;
    return 42;
}
```

Direct iteration generally ignores the final return value:

```js
for (const value of example()) {
    console.log(value);
}
```

Direct `next()` calls can observe it:

```js
const iterator = example();

iterator.next();
iterator.next();
iterator.next();
```

This capability exists in the JavaScript iterator protocol but is not generally required for ordinary collection
traversal.

## Iterator Closing

Iterators can optionally define a `return()` method.

```js
const iterator = {
    next() {
        return {
            value: 1,
            done: false
        };
    },

    return() {
        console.log("cleanup");
        return {
            value: undefined,
            done: true
        };
    }
};
```

This allows an iterator to release resources when iteration terminates early.

Generators support this mechanism automatically through their execution semantics.

## Resource Management

An iterator may represent a resource-backed sequence.

Examples include:

* database cursors
* file streams
* network streams
* paginated APIs
* external service cursors

In these cases, traversal is not merely an in-memory operation.

The iterator may need to release resources when iteration completes or is terminated early.

For resource-owning iterators, lifecycle semantics must be explicit.

## Async Iteration

JavaScript also provides an asynchronous iterator protocol through `Symbol.asyncIterator`.

```js
class EventStream {
    constructor(source) {
        this.source = source;
    }

    async* [Symbol.asyncIterator]() {
        for await (const event of this.source) {
            yield event;
        }
    }
}
```

The consumer can use:

```js
for await (const event of stream) {
    console.log(event);
}
```

Async iteration is useful when values arrive asynchronously rather than being immediately available.

## Async Iterator Protocol

An asynchronous iterator provides `next()` returning a Promise:

```js
const iterator = {
    async next() {
        return {
            value: await loadNextValue(),
            done: false
        };
    }
};
```

The consumer awaits each result.

This makes the Iterator concept applicable to asynchronous data sources while preserving the separation between
traversal and representation.

## Pagination

An async iterator can hide pagination mechanics.

```js
async function* usersFromApi(api) {
    let page = 1;

    while (true) {
        const result = await api.getUsers({
            page
        });

        for (const user of result.items) {
            yield user;
        }

        if (!result.nextPage) {
            break;
        }

        page = result.nextPage;
    }
}
```

The consumer sees a logical sequence:

```js
for await (const user of usersFromApi(api)) {
    process(user);
}
```

The pagination protocol is encapsulated by the iterator.

## Streaming

Iterators can expose streams of values incrementally.

```js
async function* readMessages(socket) {
    while (true) {
        const message = await socket.read();

        if (message === null) {
            return;
        }

        yield message;
    }
}
```

This avoids loading the entire stream into memory.

Backpressure can also emerge naturally because the producer can wait for the consumer to request the next value.

## Backpressure

In asynchronous systems, iterator consumption can provide a natural demand boundary.

```js
for await (const item of stream) {
    await process(item);
}
```

The next item is not requested until processing completes.

This can prevent an eager producer from overwhelming the consumer.

However, actual backpressure semantics depend on the underlying data source. An async iterator alone does not guarantee
that an external producer will stop buffering data.

## Multiple Iterators

A collection can support independent iterators:

```js
const first = collection[Symbol.iterator]();
const second = collection[Symbol.iterator]();
```

Each iterator maintains its own traversal state.

This is important when different consumers need to traverse the same aggregate simultaneously.

The collection should generally return a new iterator for each traversal unless shared traversal is intentional.

## Reusable vs Single-Use Iterables

An iterable collection usually creates a new iterator each time:

```js
for (const item of collection) {
    // first traversal
}

for (const item of collection) {
    // second traversal
}
```

A generator object, by contrast, represents a particular execution and is generally single-use.

```js
const iterator = numbers();

for (const value of iterator) {
    console.log(value);
}

for (const value of iterator) {
    console.log(value);
}
```

The second traversal does not restart the generator.

This distinction matters when designing APIs. An iterable aggregate and an iterator are not necessarily the same object.

## Iterable vs Iterator

An iterable provides a way to obtain an iterator.

```js
const iterable = {
    [Symbol.iterator]() {
        return iterator;
    }
};
```

An iterator provides `next()`.

```js
const iterator = {
    next() {
        return {
            value: 1,
            done: false
        };
    }
};
```

A common design is therefore:

```text id="a2x4j1"
Aggregate → Iterable → Iterator
```

The aggregate exposes the ability to begin traversal. The iterator represents the traversal itself.

## Iterator Identity

An iterator represents traversal state, not necessarily the collection.

Two iterators over the same collection can have different positions.

```js
const first = collection[Symbol.iterator]();
const second = collection[Symbol.iterator]();

first.next();
second.next();
second.next();
```

The traversal states are independent.

This distinction becomes important when iterators are stored, passed between functions, or used concurrently.

## Mutation During Iteration

Mutation of an aggregate while it is being traversed can create difficult semantics.

```js
for (const item of collection) {
    collection.remove(item);
}
```

The result depends on the collection's iterator implementation.

Possible semantics include:

* newly added elements are visible
* newly added elements are ignored
* removed elements are skipped
* removed elements remain visible
* iteration throws
* iteration uses a snapshot
* behavior is unspecified

A collection should define meaningful mutation semantics when iteration and mutation can overlap.

## Snapshot Iterators

A collection can iterate over a snapshot.

```js
class Collection {
    constructor(items) {
        this.items = items;
    }

    * [Symbol.iterator]() {
        const snapshot = [...this.items];

        for (const item of snapshot) {
            yield item;
        }
    }
}
```

This provides stable traversal at the cost of additional memory and snapshot creation time.

Snapshot semantics are useful when the collection may change during traversal.

## Live Iterators

A live iterator observes the underlying collection as traversal proceeds.

```js
class Collection {
    constructor(items) {
        this.items = items;
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.items.length; i++) {
            yield this.items[i];
        }
    }
}
```

Changes to the collection can affect future values.

Live traversal can be efficient but requires carefully defined mutation semantics.

## Iterator and Composite

Composite represents hierarchical part-whole structures.

Iterator represents traversal over an aggregate.

The two patterns frequently work together.

A Composite tree can expose an iterator for traversal:

```js
for (const node of tree) {
    console.log(node);
}
```

Composite defines the recursive object structure and uniform treatment of components. Iterator defines how clients
traverse that structure.

A tree therefore does not automatically imply Iterator, and an iterator does not imply Composite.

## Iterator and Visitor

Visitor and Iterator often operate together.

Iterator determines **which elements are visited and in what order**.

Visitor determines **what operation is performed on each element**.

For example:

```js
for (const node of tree) {
    node.accept(visitor);
}
```

The iterator controls traversal. Visitor controls the operation.

This separation can be particularly useful when a tree has multiple traversal strategies and multiple operations.

## Iterator and Strategy

A traversal algorithm can be encapsulated as a Strategy.

For example, a tree may support different traversal policies:

```js
class DepthFirstStrategy {
    * traverse(root) {
        yield* traverseDepthFirst(root);
    }
}
```

The iterator can then use the selected strategy.

Strategy represents interchangeable algorithms. Iterator represents the traversal interface exposed to consumers.

## Iterator and Generator

Generators provide a language-level mechanism for implementing iterators.

The following is an iterator:

```js
function* values() {
    yield 1;
    yield 2;
}
```

The generator function itself is not the iterator. Calling it produces a generator object that implements the iterator
protocol.

This distinction is useful when reasoning about API design:

```js
const iterator = values();
iterator.next();
```

The generated object owns the traversal state.

## Iterator and Array Methods

JavaScript arrays already support iteration.

```js
for (const item of items) {
    console.log(item);
}
```

They also provide higher-level operations:

```js
items.map(transform);
items.filter(predicate);
items.find(predicate);
```

These APIs may make a custom Iterator implementation unnecessary when the collection is already an array.

A custom iterator becomes more useful when traversal semantics differ from ordinary array iteration or when the
underlying representation should remain hidden.

## Iterator vs Collection API

A collection can expose methods such as:

```js
collection.get(index);
collection.size();
```

without providing an Iterator.

An index-based API exposes positional access.

Iterator instead exposes sequential traversal.

The distinction matters when the underlying collection does not have meaningful numeric indices or when indexed access
would expose implementation details.

## Iterator vs Query API

A collection may expose a query:

```js
collection.find(predicate);
```

This provides a particular operation.

Iterator provides general sequential access from which many operations can be built.

For example:

```js
for (const item of collection) {
    if (predicate(item)) {
        return item;
    }
}
```

The iterator is therefore a lower-level traversal abstraction than a specialized query method.

## Iterator vs Materialization

An array represents a materialized collection.

```js
const values = loadAllValues();
```

An iterator can represent the same logical sequence lazily:

```js
const values = loadValuesLazily();
```

The iterator may avoid allocating memory for all elements at once.

Materialization can be preferable when random access, repeated traversal, or stable snapshots are required.

Lazy iteration can be preferable when the collection is large, expensive to compute, or potentially unbounded.

## Random Access

Iterator is fundamentally sequential.

An iterator normally exposes the next element rather than arbitrary indexed access.

If clients require:

```js
collection.get(100000);
```

an indexable collection may be a better abstraction.

A specialized iterator can sometimes support additional operations such as `seek()`, but doing so moves beyond the
minimal Iterator abstraction and introduces representation-specific semantics.

## Bidirectional Iteration

Some collections require movement in both directions.

A custom iterator can expose:

```js
next();
previous();
```

or another traversal protocol.

JavaScript's standard iterator protocol is forward-oriented. Bidirectional traversal therefore generally requires an
application-specific abstraction.

The additional operations should only be exposed when the collection semantics genuinely require them.

## Stateful Iterators

An iterator may contain significant internal state.

For example, breadth-first traversal can maintain a queue:

```js
class BreadthFirstIterator {
    constructor(root) {
        this.queue = root ? [root] : [];
    }

    next() {
        if (this.queue.length === 0) {
            return {
                value: undefined,
                done: true
            };
        }

        const node = this.queue.shift();

        if (node.left) {
            this.queue.push(node.left);
        }

        if (node.right) {
            this.queue.push(node.right);
        }

        return {
            value: node.value,
            done: false
        };
    }
}
```

The traversal state is encapsulated entirely by the iterator.

For performance-sensitive implementations, a more efficient queue structure may be preferable to repeatedly calling
`shift()`.

## Iterator Ownership

The iterator should have clear ownership of its traversal state.

A collection should not generally store a mutable shared cursor if independent traversals are expected.

For example, this design is problematic:

```js
class Collection {
    constructor(items) {
        this.items = items;
        this.index = 0;
    }

    next() {
        return this.items[this.index++];
    }
}
```

Two consumers cannot safely traverse independently.

Returning separate iterators avoids this coupling.

## Resource Cleanup

Resource-backed iterators require explicit cleanup semantics.

A consumer may terminate early:

```js
for (const row of cursor) {
    if (shouldStop(row)) {
        break;
    }
}
```

If the cursor owns a resource, the implementation must ensure that the underlying resource can be released.

JavaScript's iterator protocol supports `return()` for this purpose, and generators participate in this cleanup
behavior.

Resource ownership should nevertheless be documented rather than assumed.

## Errors During Iteration

Errors may occur when obtaining the next element.

```js
for await (const item of stream) {
    process(item);
}
```

A network failure may occur during a later `next()` call rather than when the iterator is created.

Consumers should therefore treat iteration as potentially fallible when the underlying source is asynchronous or
external.

A retrying iterator must also define whether retrying repeats the same element, resumes after the failed element, or
restarts the traversal.

## Async Errors

Async iteration can reject while producing a value:

```js
async function* stream() {
    yield await loadFirst();

    yield await loadSecond();
}
```

Consumers can handle failures normally:

```js
try {
    for await (const item of stream()) {
        process(item);
    }
} catch (error) {
    handle(error);
}
```

The iterator abstraction does not prescribe retry or recovery semantics.

## Cancellation

Long-running asynchronous iteration may need cancellation.

```js
const controller = new AbortController();

for await (const item of readStream({
    signal: controller.signal
})) {
    if (shouldStop(item)) {
        controller.abort();
        break;
    }
}
```

Cancellation should propagate to the underlying source when possible.

An iterator that merely stops producing values without cancelling the underlying resource may still leak work or
resources.

## TypeScript

TypeScript provides built-in types for iterators and iterables.

```ts
class UserCollection implements Iterable<User> {
    constructor(
        private readonly users: User[]
    ) {
    }

    [Symbol.iterator](): Iterator<User> {
        return this.users[Symbol.iterator]();
    }
}
```

A custom iterator can implement `Iterator<T>`:

```ts
class UserIterator implements Iterator<User> {
    private index = 0;

    constructor(
        private readonly users: User[]
    ) {
    }

    next(): IteratorResult<User> {
        if (this.index >= this.users.length) {
            return {
                value: undefined,
                done: true
            };
        }

        return {
            value: this.users[this.index++],
            done: false
        };
    }
}
```

The standard types make custom traversal protocols unnecessary in many cases.

## Generic Iterators

Generic abstractions can support arbitrary element types.

```ts
function collect<T>(iterator: Iterator<T>): T[] {
    const result: T[] = [];

    while (true) {
        const next = iterator.next();

        if (next.done) {
            return result;
        }

        result.push(next.value);
    }
}
```

The function can operate on any iterator without knowing its element type.

## Async Iterators in TypeScript

TypeScript provides `AsyncIterator<T>` and `AsyncIterable<T>`.

```ts
async function* users(): AsyncIterable<User> {
    yield await loadUser(1);
    yield await loadUser(2);
}
```

The consumer can use:

```ts
for await (const user of users()) {
    console.log(user);
}
```

This gives asynchronous data sources the same high-level traversal syntax as synchronous collections.

## Testing Iterators

Iterator tests should verify traversal semantics.

```js
const iterator = collection[Symbol.iterator]();

console.assert(iterator.next().value === first);
console.assert(iterator.next().value === second);
console.assert(iterator.next().done === true);
```

For custom traversal algorithms, tests should verify:

* traversal order
* termination
* empty collections
* single-element collections
* nested structures
* mutation behavior
* repeated independent traversals
* early termination
* error behavior
* resource cleanup where applicable

## Testing Multiple Iterators

Independent iterator state should be tested explicitly.

```js
const first = collection[Symbol.iterator]();
const second = collection[Symbol.iterator]();

first.next();
second.next();

console.assert(
    first.next().value === second.next().value
);
```

More complex cases should verify that advancing one iterator does not unexpectedly advance another.

## Performance

Iterator-based traversal can reduce memory usage by avoiding materialization.

```js
function* values() {
    for (const value of source()) {
        yield transform(value);
    }
}
```

Only the current value and traversal state need to remain in memory.

However, iterators introduce function calls, state management, and potentially generator overhead.

For small arrays, direct array operations may be simpler and faster.

Performance should therefore be evaluated against the actual workload rather than assuming that laziness is always
faster.

## Memory Usage

Lazy iteration can dramatically reduce memory consumption for large sequences.

Instead of:

```js
const values = loadOneMillionValues();
```

the application can consume:

```js
for (const value of loadValues()) {
    process(value);
}
```

Only a bounded amount of data may need to be held at any one time.

The exact memory characteristics depend on the source and buffering strategy.

## Iterator Pipelines and Allocation

Iterator pipelines can avoid intermediate arrays:

```js
const result = map(
    filter(
        values,
        predicate
    ),
    transform
);
```

The alternative might create multiple arrays:

```js
const result = values
    .filter(predicate)
    .map(transform);
```

The iterator version can be more memory-efficient, particularly for large sequences.

However, JavaScript engines optimize common array operations heavily, so the iterator form should not automatically be
assumed to be faster.

## Common Misuse

A common misuse is implementing a custom iterator for a collection that already has an appropriate native
representation.

```js
class ArrayIterator {
    constructor(array) {
        this.array = array;
        this.index = 0;
    }

    next() {
        // Reimplements Array's existing iterator.
    }
}
```

This adds complexity without providing a meaningful abstraction.

Another misuse is exposing the iterator solely because a class is expected to use a design pattern.

If the collection can simply return an existing iterator, that is usually preferable.

## Iterator Overengineering

A simple generator may be sufficient:

```js
*
[Symbol.iterator]()
{
    yield * this.items;
}
```

Creating a hierarchy such as:

```text id="r0z8hl"
AbstractIterator
ConcreteIterator
IteratorFactory
IteratorState
TraversalController
```

is usually unjustified in modern JavaScript unless the domain genuinely requires separate traversal abstractions.

The GoF structure should not be reproduced mechanically when the language already provides the required protocol.

## Hidden Materialization

An API can appear lazy while actually materializing the entire collection.

```js
*
[Symbol.iterator]()
{
    const values = [...loadAllValues()];

    yield * values;
}
```

This still allocates the entire result before iteration begins.

True lazy iteration requires that values be obtained progressively.

## Repeated Traversal

A collection intended to support repeated traversal should return a fresh iterator.

```js
[Symbol.iterator]()
{
    return this.createIterator();
}
```

Returning the same iterator instance can accidentally make the collection single-use.

For example:

```js
[Symbol.iterator]()
{
    return this.iterator;
}
```

means different consumers share traversal state.

That may be intentional for streams, but it is usually incorrect for ordinary collections.

## Iterator and Mutation

A collection that allows mutation during traversal should define its semantics rather than relying on accidental
behavior.

Possible approaches include:

```js
const snapshot = collection.snapshot();

for (const item of snapshot) {
    collection.remove(item);
}
```

or explicitly prohibiting mutation during iteration.

The correct choice depends on domain requirements.

## Refactoring Toward Iterator

Iterator is a useful refactoring when clients repeatedly duplicate traversal logic.

Suppose several consumers directly access internal nodes:

```js
let node = tree.root;

while (node) {
    process(node);
    node = node.next;
}
```

Another consumer duplicates the same knowledge:

```js
let node = tree.root;

while (node) {
    validate(node);
    node = node.next;
}
```

The traversal knowledge can be centralized:

```js
class Tree {
    * [Symbol.iterator]() {
        let node = this.root;

        while (node) {
            yield node;
            node = node.next;
        }
    }
}
```

Consumers now depend only on the iteration protocol:

```js
for (const node of tree) {
    process(node);
}
```

The collection can change its internal representation without forcing every consumer to rewrite traversal logic.

## Recognizing an Iterator Opportunity

Iterator is appropriate when:

* clients need sequential access to a collection
* collection representation should remain private
* multiple traversal algorithms exist
* traversal state should be independent between consumers
* traversal should be lazy
* data is generated incrementally
* the source is asynchronous
* a large collection should not be materialized
* traversal logic is duplicated across clients
* a collection needs to integrate with JavaScript iteration syntax

The strongest signal is that clients know too much about how a collection is traversed.

## Architectural Considerations

Iterator provides a narrow abstraction between a collection and its consumers.

The aggregate owns or exposes the sequence semantics. The iterator owns traversal state. Consumers operate through the
traversal protocol rather than depending on representation details.

This can reduce coupling at collection boundaries and can make traversal algorithms independently replaceable.

Iterator does not automatically solve filtering, mapping, querying, persistence, concurrency, caching, or
synchronization. Those concerns may be layered around traversal when necessary.

## Benefits

Iterator provides several important benefits:

* hides collection representation
* separates traversal from collection implementation
* supports independent traversal state
* allows multiple traversal strategies
* supports lazy evaluation
* avoids unnecessary materialization
* supports potentially infinite sequences
* integrates naturally with JavaScript language features
* supports synchronous and asynchronous traversal
* can encapsulate complex traversal algorithms
* provides a uniform interface for heterogeneous aggregate implementations

## Costs

Iterator also introduces costs:

* additional traversal state
* additional abstraction
* possible generator or iterator overhead
* more complicated mutation semantics
* lifecycle concerns for resource-backed iterators
* asynchronous error and cancellation concerns
* potentially harder debugging because computation is deferred
* additional complexity when traversal semantics are unusual

For ordinary arrays, the native iteration facilities are usually sufficient.

## Decision Criteria

Use Iterator when clients need to traverse an aggregate without depending on its internal representation.

Use a custom iterator when traversal itself has meaningful domain or algorithmic complexity, when lazy evaluation
matters, when the source is generated or asynchronous, or when multiple traversal strategies need to be exposed.

Do not implement a custom Iterator merely to reproduce array iteration.

The key question is:

**Does the application need to separate sequential traversal from the aggregate's internal representation or traversal
algorithm?**

If yes, Iterator may provide the appropriate abstraction.

If the collection is already an array or another native iterable and its existing iteration semantics are sufficient,
use the native protocol directly.

## Summary

Iterator provides sequential access to an aggregate without exposing its underlying representation.

The aggregate provides or owns the iterable abstraction, while an iterator represents a particular traversal and
maintains its traversal state.

JavaScript has native support for the pattern through `Symbol.iterator`, `Iterator`, `for...of`, spread syntax,
destructuring, and generators. Asynchronous sources use `Symbol.asyncIterator`, `AsyncIterator`, `for await...of`, and
async generators.

Iterator is particularly valuable for trees, linked structures, generated sequences, large collections, streams,
paginated APIs, and other sources where traversal should be separated from representation or performed lazily.

Iterator frequently works with Composite and Visitor: Composite can define the structure being traversed, Iterator can
define how it is traversed, and Visitor can define what operation is performed on each element.

The defining idea remains: **encapsulate traversal so that clients can access elements sequentially without depending on
how the aggregate stores or traverses them.**

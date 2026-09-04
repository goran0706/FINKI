# Iterators and Iterables in JavaScript / ECMAScript

## Introduction and Core Architectural Concept

In ECMAScript, the iteration mechanism provides a unified interface for traversing data structures sequentially. Before
the introduction of the Iteration Protocol, iterating over data structures required specialized loops with varying index
tracking and state management logic.

The ECMAScript specification standardizes iteration through two distinct decoupled protocols:

* **The Iterable Protocol:** Defines how an object makes its elements accessible to iteration mechanisms.
* **The Iterator Protocol:** Defines how sequence generation and state traversal are actually performed.

## ECMAScript Specification Requirements

### The Iterable Protocol

An object is compliant with the Iterable Protocol if it defines a method whose property key is `Symbol.iterator`.

* **Key:** `Symbol.iterator` (Well-Known Symbol in specification notation).
* **Signature:** `[Symbol.iterator]()`
* **Behavior:** Must be a zero-argument function returning an object that implements the Iterator Protocol.

### The Iterator Protocol

An object is compliant with the Iterator Protocol if it implements a `.next()` method adhering to the following
contract:

* **Signature:** `next([value])`
* **Return Value:** Returns an IteratorResult object containing `value` (the current element or `undefined`) and
  `done` (a boolean indicating if the sequence has finished).

## The Iterator Interface Lifecycle Methods

Beyond `.next()`, the specification allows optional lifecycle hooks on the Iterator interface for handling early loop
exit and error scenarios:

| Method     | Signature         | Specification Role & Execution Context                                                                     |
|:-----------|:------------------|:-----------------------------------------------------------------------------------------------------------|
| `next()`   | `next([value])`   | Advances sequence position by one step and returns current `IteratorResult`.                               |
| `return()` | `return([value])` | Invoked automatically when loop exits prematurely (e.g., `break`, `return`, `throw`). Cleans up resources. |
| `throw()`  | `throw([error])`  | Signals an exception condition to the iterator. Primarily used by generator-backed iterators.              |

## Native Iterables and Consumer Operations

### Built-in Iterables

The following standard ECMAScript objects implement `Symbol.iterator` natively on their prototype chains:

* Array prototype
* String prototype
* Map prototype
* Set prototype
* TypedArray prototype
* `arguments` object and `NodeList` DOM collections

### Language Constructs Expecting Iterables

Many native syntaxes expect an iterable and call `[Symbol.iterator]()` implicitly under the hood:

* `for...of` loops
* Spread syntax
* Array destructuring
* Yield delegation operator
* Native constructors like `Map`, `Set`, `Promise.all`, and `Array.from`

## Best Practices and Edge Cases

* **Implement Well-Formed Iterators:** Custom iterators should always implement `[Symbol.iterator]()` returning
  themselves so they can be passed into functions expecting an iterable.
* **Handle Resource Cleanup with return:** Always implement `.return()` if your iterator manages open sockets, database
  cursors, or file handles to guarantee closure when loops exit early.
* **Avoid State Mutation Collisions:** If `[Symbol.iterator]()` returns `this` directly on a stateful object, running
  concurrent loops on the same instance will cause state corruption. Fresh state should be allocated inside
  `[Symbol.iterator]()`.
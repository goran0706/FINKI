# JavaScript Language Characteristics

## Dynamic Typing

Data types are associated with runtime values rather than variable declarations. A variable can safely hold a value of
any type, and its type can change dynamically at execution time.

## Weak Typing (Loosely Typed)

The language performs automatic implicit type conversion (coercion) during operations involving incompatible data types
instead of throwing immediate compile-time or execution type-mismatch errors.

## Single-Threaded Execution Model

JavaScript executes program instructions within a single call stack on a single main thread at any given time,
preventing structural race conditions on shared memory environments in user-land code.

## Interpreted / JIT-Compiled

No separate compile step before execution; code runs via an engine (e.g., V8) that combines interpretation with
just-in-time compilation for performance.

## Event-Driven, Non-Blocking I/O

Uses an event loop to handle asynchronous operations (I/O, timers, network calls) without blocking the main thread,
enabling concurrency despite being single-threaded.

## Prototype-Based Object Orientation

Objects inherit directly from other objects via a prototype chain, rather than from classes (ES6 `class` syntax is
syntactic sugar over this).

## First-Class Functions

Functions are treated as values — they can be assigned to variables, passed as arguments, and returned from other
functions.

## Automatic Memory Management

Memory is allocated and reclaimed automatically via garbage collection, rather than manual allocation/deallocation.

## Multi-Paradigm

Supports procedural, object-oriented, and functional programming styles without enforcing one.

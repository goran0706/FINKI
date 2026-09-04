# Generators in JavaScript / ECMAScript

## Introduction and Architectural Overview

Generators provide coroutine-like semantics in JavaScript. Unlike standard ECMAScript functions—which execute according
to a run-to-completion model—a Generator Function can suspend its execution context mid-procedure, return an
intermediate value, and subsequently resume execution from the exact point of suspension.

Generators form the underlying building block for cooperative multitasking, state machines, complex async control flows,
and lazy sequence production.

## ECMAScript Specification Architecture

### The Generator Function and Exotic Objects

* Syntactically declared using generator function syntax.
* Invoking a generator function does not execute its function body immediately.
* Instead, it creates and returns an exotic object conforming to the Generator interface, which inherits from the
  generator prototype.

### Execution States of a Generator

An ECMAScript generator transitions through four primary specification states:

* **Suspended-Start:** Initial state immediately upon instantiation before `.next()` is called.
* **Executing:** Generator frame is active on the call stack executing code.
* **Suspended-Yield:** Generator hit a yield boundary, saved its execution context, and yielded control back to caller.
* **Completed:** Function body executed to completion or exited via return.

## Methods on Generator Prototype

The generator prototype object provides three control methods:

| Method     | Signature       | Internal Specification Mechanics                                                             |
|:-----------|:----------------|:---------------------------------------------------------------------------------------------|
| `next()`   | `next(value)`   | Resumes execution. If a value is provided, it replaces the yield expression where suspended. |
| `return()` | `return(value)` | Forces the generator to complete immediately. Runs active `finally` blocks before exiting.   |
| `throw()`  | `throw(error)`  | Injects an exception into the generator's context at the current suspension point.           |

## Control Flow Operators

### The yield Keyword

* Suspends execution and outputs a value.
* Evaluates as an input value when resumed via `.next(inputValue)`.

### The yield delegation Operator

The yield delegation operator delegates yield operations to another iterable or generator sequence:

* Iterates through the target iterable automatically.
* Forwards `.next()`, `.throw()`, and `.return()` calls down to the delegated iterator.
* Captures the final return value of the delegated generator.

## Best Practices

* **Use Generators for Memory-Efficient Pipelines:** Use generators to process large datasets or stream data in chunks
  without buffering everything into memory at once.
* **Wrap Injected Yields in Error Handlers:** Always enclose yield points inside try-catch blocks if your control layer
  relies on `.throw()` to signal failures.
* **Differentiate Yield Value vs Return Value:** Remember that `for...of` loops ignore the final return value of a
  generator. Use yield to output operational sequence elements.
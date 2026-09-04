# Atomics

## Concept and ECMAScript Specification

The `Atomics` namespace object provides atomic operations as static methods to perform thread-safe memory manipulation
on `SharedArrayBuffer` instances. According to the ECMA-262 specification, `Atomics` is a built-in global namespace
object—similar to `Math` or `JSON`—and is not a constructor function. It lacks a `[[Call]]` internal method and cannot
be invoked or instantiated using `new`; attempting to do so throws a `TypeError`.

When multiple concurrent agents (such as Web Workers) share memory via integer-based `TypedArray` views attached to a
`SharedArrayBuffer`, standard memory reads and writes can cause data races. `Atomics` operations enforce atomic
read-modify-write semantics, barrier synchronization, and execution ordering across hardware CPU threads.

| Characteristic            | ECMAScript Specification Behavior                                                                                                                                                          |
|:--------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Invocation Attempts       | Throws a `TypeError` when called as a function or constructor                                                                                                                              |
| Prototype Inheritance     | `Atomics` inherits directly from `Object.prototype`                                                                                                                                        |
| View Constraints          | Operations are strictly constrained to integer `TypedArray` views (`Int8Array`, `Uint8Array`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `BigInt64Array`, `BigUint64Array`) |
| Shared Memory Requirement | Memory mutators and wait/notify synchronization require backing by a `SharedArrayBuffer`                                                                                                   |

## Atomic Read-Modify-Write Methods

`Atomics` static methods perform indivisible arithmetic and bitwise operations, ensuring no concurrent agent can read or
modify target memory locations during execution.

| Method                                                                        | Specification Behavior                                                                             |
|:------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| `Atomics.add(typedArray, index, value)`                                       | Adds `value` to the element at `index`; returns the old value before addition                      |
| `Atomics.sub(typedArray, index, value)`                                       | Subtracts `value` from the element at `index`; returns the old value before subtraction            |
| `Atomics.and(typedArray, index, value)`                                       | Computes bitwise AND with `value` at `index`; returns the old value                                |
| `Atomics.or(typedArray, index, value)`                                        | Computes bitwise OR with `value` at `index`; returns the old value                                 |
| `Atomics.xor(typedArray, index, value)`                                       | Computes bitwise XOR with `value` at `index`; returns the old value                                |
| `Atomics.exchange(typedArray, index, value)`                                  | Sets element at `index` to `value`; returns the old value                                          |
| `Atomics.compareExchange(typedArray, index, expectedValue, replacementValue)` | Replaces element at `index` with `replacementValue` if equal to `expectedValue`; returns old value |

## Load, Store, and Thread Synchronization Utilities

`Atomics` provides explicit synchronization primitives to prevent compiler reordering and block worker execution threads
safely.

| Method                                                    | Specification Behavior                                                                                                       |
|:----------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------|
| `Atomics.load(typedArray, index)`                         | Atomically reads and returns the element at `index`                                                                          |
| `Atomics.store(typedArray, index, value)`                 | Atomically stores `value` at `index`; returns the stored value                                                               |
| `Atomics.isLockFree(size)`                                | Static method returning `true` if an $N$-byte hardware atomic operation runs without OS mutex locks                          |
| `Atomics.wait(typedArray, index, value [, timeout])`      | Verifies if `index` holds `value`; if true, suspends agent execution until notified or timed out (disallowed on main thread) |
| `Atomics.waitAsync(typedArray, index, value [, timeout])` | Non-blocking version of `wait()` returning a Promise; safe for use on the main browser thread                                |
| `Atomics.notify(typedArray, index [, count])`             | Wakes up `count` agents suspended in a `wait()` queue at `index`; returns count of awakened agents                           |

## Use Cases

`Atomics` primitives power concurrent lock mechanisms and cross-thread communication algorithms:

* **Building mutexes and spinlocks:** Implementing mutual exclusion locks across Web Workers using
  `Atomics.compareExchange()` to guard critical shared sections.
* **Producer-consumer queues:** Synchronizing shared ring buffers between main threads and dedicated audio or physics
  worker pipelines using `Atomics.wait()` and `Atomics.notify()`.
* **Lock-free state flags:** Updating cross-thread application counters or status flags safely without full lock
  overhead via `Atomics.add()`.

## Best Practices

* **Never attempt to instantiate Atomics:** Access methods directly as static properties on `Atomics` without `new`.
* **Do not execute `Atomics.wait` on the main thread:** Never invoke `Atomics.wait()` on the main window thread, as it
  throws a `TypeError` to prevent blocking the UI event loop; use `Atomics.waitAsync()` instead.
* **Use integer typed arrays only:** Ensure target typed array views are integer-based (`Int32Array`, `BigInt64Array`,
  etc.); passing noninteger views like `Float32Array` or `Float64Array` will throw a `TypeError`.
* **Validate index boundaries:** Always ensure the target index falls within the bounds of the passed `TypedArray` to
  prevent `RangeError` exceptions.
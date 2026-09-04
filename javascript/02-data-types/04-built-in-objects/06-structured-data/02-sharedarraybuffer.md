# SharedArrayBuffer

## Concept and ECMAScript Specification

The `SharedArrayBuffer` constructor creates objects used to represent a generic, fixed-length or growable raw binary
data buffer, similar to `ArrayBuffer`. According to the ECMA-262 specification, `SharedArrayBuffer` memory blocks are
shared across multiple execution agents (such as the main thread and Web Workers) via structured cloning.

Unlike standard `ArrayBuffer` instances, a `SharedArrayBuffer` cannot be detached or transferred; instead, posting a
`SharedArrayBuffer` transmits a reference to the same underlying shared data block. Because concurrent updates from
multiple threads can create race conditions, access to shared memory relies on explicit synchronization using the
`Atomics` namespace object.

| Characteristic      | ECMAScript Specification Behavior                                                 |
|:--------------------|:----------------------------------------------------------------------------------|
| Function Invocation | Calling `SharedArrayBuffer()` without `new` throws a `TypeError`                  |
| Direct Value Access | Disallowed; contents can only be accessed via `TypedArray` views or `DataView`    |
| Transferability     | Non-transferable; structured cloning shares the underlying memory block reference |
| Memory Concurrency  | Requires `Atomics` operations for thread-safe operations                          |

## Instance Properties and Prototype Methods

`SharedArrayBuffer.prototype` provides instance methods and getters to inspect allocation limits, evaluate growable
capacities, or expand memory allocations.

| Property / Method   | Category                 | Specification Behavior                                                               |
|:--------------------|:-------------------------|:-------------------------------------------------------------------------------------|
| `byteLength`        | Instance Property Getter | Returns the byte size of the shared buffer instance                                  |
| `maxByteLength`     | Instance Property Getter | Returns the maximum byte length limit if instantiated as growable                    |
| `growable`          | Instance Property Getter | Returns `true` if the shared buffer was initialized as growable; otherwise `false`   |
| `slice(begin, end)` | Instance Method          | Returns a new non-shared `ArrayBuffer` containing a copy of the specified byte range |
| `grow(newLength)`   | Instance Method          | Expands the shared memory buffer to `newLength` bytes (`TypeError` if not growable)  |

## Use Cases

`SharedArrayBuffer` instances support multithreaded concurrent computing and shared memory protocols:

* **Worker thread memory sharing:** Sharing worker state directly across Web Workers without payload serialization
  overhead.
* **High-performance WebAssembly memory:** Serving as the backing storage layer for shared WebAssembly memory
  instances (`WebAssembly.Memory`).
* **Real-time audio and canvas rendering:** Modifying shared pixel buffers or audio frames concurrently across dedicated
  worker threads.

## Best Practices

* **Always instantiate SharedArrayBuffer using new:** Call `new SharedArrayBuffer(byteLength)` explicitly to avoid
  runtime `TypeError` exceptions.
* **Synchronize shared memory access with Atomics:** Never read or write shared memory locations directly across
  multiple threads without applying `Atomics` methods (such as `Atomics.load()`, `Atomics.store()`, or `Atomics.wait()`)
  to prevent race conditions.
* **Verify Cross-Origin Isolation headers:** Ensure host web servers emit proper Cross-Origin Opener Policy (`COOP`) and
  Cross-Origin Embedder Policy (`COEP`) HTTP response headers, as browser environments gate global access to
  `SharedArrayBuffer` behind cross-origin isolation requirements.
* **Specify maxByteLength for growable shared buffers:** Pass `{ maxByteLength: limit }` in options when creating shared
  buffers that need to expand over time without reallocating underlying buffers.
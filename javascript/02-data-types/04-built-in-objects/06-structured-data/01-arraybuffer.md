# ArrayBuffer

## Concept and ECMAScript Specification

The `ArrayBuffer` constructor creates objects used to represent generic, fixed-length raw binary data buffers. According
to the ECMA-262 specification, an `ArrayBuffer` is a byte array whose content cannot be read or written directly;
instead, developers must create a typed array view (`Uint8Array`, `Float64Array`, etc.) or a `DataView` object to read
and modify the underlying memory.

`ArrayBuffer` allocations reserve a contiguous block of memory in the ECMAScript host environment. The length of an
`ArrayBuffer` is specified at creation time and cannot be resized unless initialized as a resizable buffer using
optional constructor parameters.

| Characteristic            | ECMAScript Specification Behavior                                                      |
|:--------------------------|:---------------------------------------------------------------------------------------|
| Function Invocation       | Calling `ArrayBuffer()` without `new` throws a `TypeError`                             |
| Direct Value Manipulation | Disallowed; contents can only be accessed via `TypedArray` views or `DataView`         |
| Maximum Byte Allocation   | Constrained by `Number.MAX_SAFE_INTEGER` and host engine memory limits                 |
| Detached State            | Buffers transferred via structured clone algorithms become detached (zero byte length) |

## Static Utility Methods

The `ArrayBuffer` constructor includes static reflection methods to verify instance identities.

| Static Method               | Specification Operational Behavior                                                                              |
|:----------------------------|:----------------------------------------------------------------------------------------------------------------|
| `ArrayBuffer.isView(value)` | Returns `true` if `value` is an `ArrayBuffer` view (a `TypedArray` instance or a `DataView`); otherwise `false` |

## Instance Properties and Prototype Methods

`ArrayBuffer.prototype` provides instance methods and getters to inspect allocation metadata, slice memory copies, or
resize buffer limits.

| Property / Method   | Category                 | Specification Behavior                                                                      |
|:--------------------|:-------------------------|:--------------------------------------------------------------------------------------------|
| `byteLength`        | Instance Property Getter | Returns the byte length of the `ArrayBuffer`; returns `0` if the buffer is detached         |
| `maxByteLength`     | Instance Property Getter | Returns the maximum byte length limit if resizable; equals `byteLength` if fixed-size       |
| `resizable`         | Instance Property Getter | Returns `true` if the buffer was instantiated as resizable; otherwise `false`               |
| `detached`          | Instance Property Getter | Returns `true` if the buffer has been detached/transferred; otherwise `false`               |
| `slice(begin, end)` | Instance Method          | Returns a new `ArrayBuffer` containing a copy of the specified byte range                   |
| `resize(newLength)` | Instance Method          | Resizes the buffer to `newLength` bytes if instantiated as resizable (`TypeError` if fixed) |

## Use Cases

`ArrayBuffer` objects manage binary data memory across high-performance and networking contexts:

* **Network I/O processing:** Storing raw binary payloads fetched via `fetch()` or received over `WebSocket`
  connections.
* **Inter-thread data transfers:** Transferring zero-copy binary ownership to Web Workers via postMessage transfer
  lists.
* **Low-level file processing:** Managing binary data loaded from local files via the `FileReader` API.

## Best Practices

* **Always instantiate ArrayBuffer using new:** Call `new ArrayBuffer(byteLength)` explicitly to avoid runtime
  `TypeError` exceptions.
* **Use TypedArray or DataView to inspect contents:** Never attempt to access raw indices directly on `ArrayBuffer`
  instances; initialize a `TypedArray` or `DataView` overlay.
* **Check detached status before operating on transferred buffers:** Verify `buffer.detached` or check if
  `byteLength === 0` to prevent operating on buffers whose memory was transferred elsewhere.
* **Specify maxByteLength for dynamic binary allocations:** Pass `{ maxByteLength: limit }` in options when creating
  buffers that require expanding without re-allocating new memory instances.
* **Be aware of memory constraints when allocating huge buffers:** Validate expected allocation sizes before
  instantiating massive `ArrayBuffer` objects to prevent host engine out-of-memory crashes.
* **Use transfer lists for zero-copy worker communication:** Pass buffers directly into the transfer array of
  `postMessage(data, [buffer])` to transfer ownership instantly without duplicating memory.
* **Validate slice boundaries to prevent range errors:** Ensure that `begin` and `end` arguments passed to `.slice()`
  fall within valid byte offsets of the active buffer allocation.
* **Handle resize exceptions on fixed-size buffers:** Wrap `.resize()` calls in try/catch blocks or check `.resizable`
  before expanding buffers to prevent runtime errors on fixed allocations.
* **Use `ArrayBuffer.isView()` for reliable type guards:** Confirm whether incoming variables are valid memory views
  using `ArrayBuffer.isView()` before wrapping or parsing raw bytes.
* **Prefer `.slice()` over manual byte copying:** Use built-in buffer slicing to duplicate memory regions efficiently
  instead of writing manual iteration loops over typed array views.
* **Understand the permanence of buffer detachment:** Keep in mind that once an `ArrayBuffer` is detached via transfer
  or explicit ownership loss, its memory cannot be reattached or restored.
* **Align views correctly over shared buffers:** Ensure view byte offsets align with element byte sizes when wrapping
  multiple typed arrays over a single `ArrayBuffer`.
* **Use `SharedArrayBuffer` with caution in multi-threaded contexts:** Coordinate concurrent memory access carefully
  using `Atomics` when sharing buffers across multiple Web Workers.
* **Dispose of large buffers promptly by clearing references:** Nullify references to heavy array buffers when no longer
  needed to assist garbage collection in memory-intensive applications.
* **Keep track of buffer byte lengths explicitly:** Maintain strict byte-offset bookkeeping when packing heterogeneous
  binary formats into a single continuous `ArrayBuffer`.
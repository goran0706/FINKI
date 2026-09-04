# TypedArray

## Concept and ECMAScript Specification

The `TypedArray` object represents an array-like view of an underlying binary data buffer. According to the ECMA-262
specification, `TypedArray` is not an explicit global constructor or concrete entity available directly on the global
object; rather, it serves as an abstract superclass for a family of specific typed array constructors (such as
`Int8Array` or `Float64Array`). Every concrete `TypedArray` instance is an exotic object whose indexed elements map
directly to contiguous memory locations inside an underlying `ArrayBuffer` or `SharedArrayBuffer` instance.

| Concrete TypedArray Class | Element Type                     | Value Range                                     | Bit Size |
|:--------------------------|:---------------------------------|:------------------------------------------------|:---------|
| `Int8Array`               | 8-bit Signed Integer             | $-128$ to $127$                                 | 8        |
| `Uint8Array`              | 8-bit Unsigned Integer           | $0$ to $255$                                    | 8        |
| `Uint8ClampedArray`       | 8-bit Unsigned Integer (Clamped) | $0$ to $255$                                    | 8        |
| `Int16Array`              | 16-bit Signed Integer            | $-32,768$ to $32,767$                           | 16       |
| `Uint16Array`             | 16-bit Unsigned Integer          | $0$ to $65,535$                                 | 16       |
| `Int32Array`              | 32-bit Signed Integer            | $-2,147,483,648$ to $2,147,483,647$             | 32       |
| `Uint32Array`             | 32-bit Unsigned Integer          | $0$ to $4,294,967,295$                          | 32       |
| `Float32Array`            | 32-bit IEEE 754 Floating Point   | $1.2 \times 10^{-38}$ to $3.4 \times 10^{38}$   | 32       |
| `Float64Array`            | 64-bit IEEE 754 Floating Point   | $5.0 \times 10^{-324}$ to $1.8 \times 10^{308}$ | 64       |
| `BigInt64Array`           | 64-bit Signed BigInt             | $-2^{63}$ to $2^{63} - 1$                       | 64       |
| `BigUint64Array`          | 64-bit Unsigned BigInt           | $0$ to $2^{64} - 1$                             | 64       |

## Shared Instance Properties and Static Utilities

Concrete `TypedArray` constructors inherit shared static utilities and instance properties that provide metadata
regarding the underlying memory buffer and element byte sizes.

| Property / Method                | Category                        | Specification Operational Behavior                                                |
|:---------------------------------|:--------------------------------|:----------------------------------------------------------------------------------|
| `BYTES_PER_ELEMENT`              | Constructor / Instance Property | Number of bytes required to represent a single element in the typed array view    |
| `buffer`                         | Instance Property               | Reference to the underlying `ArrayBuffer` or `SharedArrayBuffer` instance         |
| `byteOffset`                     | Instance Property               | The offset in bytes from the start of the underlying buffer where the view begins |
| `byteLength`                     | Instance Property               | The total length in bytes of the typed array view                                 |
| `length`                         | Instance Property               | The total number of elements contained within the typed array view                |
| `TypedArray.from(source, mapFn)` | Static Method                   | Creates a new typed array from an array-like or iterable object                   |
| `TypedArray.of(...items)`        | Static Method                   | Creates a new typed array with a variable number of arguments as elements         |

## Buffer Manipulation and Prototype Methods

`TypedArray.prototype` methods closely mirror standard `Array.prototype` methods, providing element iteration,
filtering, sorting, and extraction routines without changing the length or byte allocation of the view.

| Method                 | Specification Behavior                                                                               |
|:-----------------------|:-----------------------------------------------------------------------------------------------------|
| `set(array, offset)`   | Copies elements into the typed array from an input array or typed array starting at an offset        |
| `subarray(begin, end)` | Returns a new typed array view sharing the same underlying buffer with modified bounds               |
| `slice(begin, end)`    | Returns a new typed array containing a shallow copy of a section of the buffer memory                |
| Standard Array Methods | Implements `map()`, `filter()`, `reduce()`, `forEach()`, `sort()`, `reverse()`, `find()`, and others |

## Use Cases

`TypedArray` instances enable direct binary memory management and high-performance calculations:

* **WebGL and WebGPU data transfer:** Packing vertex attributes, matrix calculations, and color arrays into raw binary
  layouts for GPU processing.
* **Network protocol binary parsing:** Reading raw binary packets, WebSocket frames, or WebAssembly memory exports
  safely.
* **Canvas image processing:** Manipulating raw RGBA pixel arrays directly via `Uint8ClampedArray` memory views.

## Best Practices

* **Use Uint8ClampedArray for pixel buffer manipulations:** Prefer `Uint8ClampedArray` when processing image color
  channels to ensure out-of-bounds values automatically clamp between 0 and 255 rather than wrapping around.
* **Prefer subarray to slice for zero-copy memory operations:** Use `subarray()` to create window views over existing
  memory buffers without allocating new buffer memory or copying bytes.
* **Ensure alignment when accessing multibyte typed arrays:** Align `byteOffset` values to multiples of
  `BYTES_PER_ELEMENT` when initializing typed arrays over custom buffers to avoid hardware alignment issues or
  performance penalties.
* **Check for BigInt compatibility when using 64-bit views:** Remember that `BigInt64Array` and `BigUint64Array` yield
  `BigInt` primitives rather than standard numbers, requiring appropriate type operations.
* **Validate buffer byte lengths before casting views:** Ensure that the length of an incoming `ArrayBuffer` matches
  expected data layouts before wrapping it in a typed array constructor to prevent range errors or unexpected
  truncation.
* **Beware of endianness assumptions in binary data:** Keep platform endianness in mind or use `DataView` when parsing
  multi-byte binary structures that require explicit byte-order handling.
* **Use `DataView` for heterogeneous buffer layouts:** Switch from typed array views to `DataView` when packing or
  unpacking records containing mixed integer and floating-point data types at arbitrary offsets.
* **Avoid overflowing typed array boundaries:** Guard against silent numeric wrapping by clamping or validating input
  values before assignment into fixed-width integer typed arrays.
* **Be mindful of shared memory concurrency hazards:** Use atomic operations (`Atomics`) when reading and writing data
  across multiple threads through `SharedArrayBuffer` instances.
* **Reuse typed array instances in performance loops:** Pre-allocate buffers and views outside high-frequency rendering
  or network polling loops to reduce garbage collection pressure.
* **Leverage `.set()` for bulk memory copying:** Use the `.set()` method instead of manual iteration loops when copying
  blocks of data between typed arrays for maximum engine optimization.
* **Check for TypedArray constructor requirements:** Always instantiate concrete typed array views using the `new`
  keyword, as calling them without `new` throws an immediate `TypeError`.
* **Understand the impact of detached array buffers:** Account for detached buffers when passing or transferring
  `ArrayBuffer` objects across execution contexts via `postMessage`.
* **Use appropriate numeric types to conserve memory:** Select smaller integer types (such as `Int8Array` or
  `Int16Array`) over standard `Float64Array` or `Int32Array` when storing dense numeric datasets to optimize memory
  footprints.
* **Inspect underlying buffer ownership safely:** Validate that buffer references are attached and valid before
  executing intensive binary parsing or mutation pipelines.
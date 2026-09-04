# JavaScript ArrayBuffer

## Overview of ArrayBuffer

`ArrayBuffer` is a fixed-length, raw binary data buffer — a contiguous block of memory with no inherent structure or
interpretation. On its own, an `ArrayBuffer` cannot be read or written directly; it must be accessed through a **view
** (`TypedArray` or `DataView`), which interprets the raw bytes as a specific numeric type. This separation between
storage (`ArrayBuffer`) and interpretation (views) is the foundation of all binary data handling in JavaScript.

| Trait                | Description                                                                              |
|:---------------------|:-----------------------------------------------------------------------------------------|
| **Fixed Length**     | Size is set at creation and cannot be resized (unless created as resizable, see below)   |
| **No Direct Access** | Bytes are only readable/writable through a `TypedArray` or `DataView` view               |
| **Zero-Initialized** | All bytes start at `0` when the buffer is created                                        |
| **Transferable**     | Can be moved (not copied) between Web Workers via `postMessage()` for zero-copy transfer |

## Creating an ArrayBuffer

```javascript
// Allocates 16 bytes, all initialized to zero
const buffer = new ArrayBuffer(16);

console.log(buffer.byteLength); // 16
console.log(buffer instanceof ArrayBuffer); // true

// The buffer itself holds no readable data yet — it needs a view
console.log(buffer[0]); // undefined (direct indexing does NOT work)
```

## Views: TypedArrays

A `TypedArray` interprets the raw bytes of an `ArrayBuffer` as a sequence of numbers of a specific type and size.
Multiple typed array constructors exist, each mapping to a different numeric format.

| Typed Array             | Bytes per Element | Value Range                                       | Common Use                                                     |
|:------------------------|:------------------|:--------------------------------------------------|:---------------------------------------------------------------|
| **`Int8Array`**         | 1                 | -128 to 127                                       | Signed byte-level data                                         |
| **`Uint8Array`**        | 1                 | 0 to 255                                          | Raw bytes, image pixel data, binary I/O                        |
| **`Uint8ClampedArray`** | 1                 | 0 to 255 (clamps instead of wrapping on overflow) | Canvas pixel data (`ImageData`)                                |
| **`Int16Array`**        | 2                 | -32,768 to 32,767                                 | Audio sample data                                              |
| **`Uint16Array`**       | 2                 | 0 to 65,535                                       | UTF-16 code units, color channels                              |
| **`Int32Array`**        | 4                 | -2,147,483,648 to 2,147,483,647                   | General-purpose signed integers                                |
| **`Uint32Array`**       | 4                 | 0 to 4,294,967,295                                | File sizes, hash values, unsigned counters                     |
| **`Float32Array`**      | 4                 | ~1.2×10⁻³⁸ to ~3.4×10³⁸ (single precision)        | 3D graphics vertices, WebGL data                               |
| **`Float64Array`**      | 8                 | Standard JS `Number` precision (double)           | High-precision numeric computation                             |
| **`BigInt64Array`**     | 8                 | Full 64-bit signed integer range                  | Large integer IDs, timestamps beyond `Number.MAX_SAFE_INTEGER` |
| **`BigUint64Array`**    | 8                 | Full 64-bit unsigned integer range                | Large unsigned integer identifiers                             |

```javascript
const buffer = new ArrayBuffer(8);

// Multiple views over the SAME underlying memory
const int8View = new Int8Array(buffer);
const int32View = new Int32Array(buffer);
const float64View = new Float64Array(buffer);

int8View[0] = 65;
console.log(int8View);  // Int8Array(8) [65, 0, 0, 0, 0, 0, 0, 0]

// Views share memory — writing through one view is visible through another
int32View[0] = 1000;
console.log(int8View);  // The first 4 bytes now reflect 1000 in little-endian byte layout
```

### Creating Typed Arrays Without an Explicit Buffer

```javascript
// Directly allocates its own internal ArrayBuffer
const numbers = new Uint32Array(5);        // 5 elements, 20 bytes total
const fromArray = new Uint8Array([1, 2, 3]); // from a plain array of values
const fromLength = new Float32Array(10);     // 10 elements, zero-initialized

console.log(numbers.buffer.byteLength); // 20 (5 elements × 4 bytes)
```

### Viewing a Subset of a Buffer (Offset and Length)

```javascript
const buffer = new ArrayBuffer(16);

// View starting at byte offset 4, containing 2 elements of Int32 (8 bytes)
const partialView = new Int32Array(buffer, 4, 2);

console.log(partialView.byteOffset); // 4
console.log(partialView.length);     // 2
console.log(partialView.byteLength); // 8
```

## Views: DataView (Mixed-Type, Endian-Aware Access)

While `TypedArray` interprets an entire buffer as one uniform type, `DataView` allows reading and writing individual
values of **different types** at **arbitrary byte offsets**, with explicit control over byte order (endianness) —
essential for parsing binary file formats and network protocols.

```javascript
const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);

// Writing a 32-bit unsigned integer at offset 0, big-endian
view.setUint32(0, 305419896, false);

// Writing a 16-bit signed integer at offset 4, little-endian
view.setInt16(4, -1000, true);

// Reading back
console.log(view.getUint32(0, false)); // 305419896
console.log(view.getInt16(4, true));   // -1000
```

| `DataView` Method                     | Reads/Writes                               | Byte Size |
|:--------------------------------------|:-------------------------------------------|:----------|
| **`getInt8()` / `setInt8()`**         | Signed 8-bit integer                       | 1         |
| **`getUint8()` / `setUint8()`**       | Unsigned 8-bit integer                     | 1         |
| **`getInt16()` / `setInt16()`**       | Signed 16-bit integer                      | 2         |
| **`getUint32()` / `setUint32()`**     | Unsigned 32-bit integer                    | 4         |
| **`getFloat32()` / `setFloat32()`**   | 32-bit IEEE 754 float                      | 4         |
| **`getFloat64()` / `setFloat64()`**   | 64-bit IEEE 754 float (standard JS Number) | 8         |
| **`getBigInt64()` / `setBigInt64()`** | Signed 64-bit BigInt                       | 8         |

Every `get`/`set` method accepts an optional final boolean argument: `littleEndian`. Omitting it (or passing `false`)
defaults to **big-endian**, which is the opposite default from most native binary formats — this is a frequent source of
bugs.

```javascript
// Parsing a binary file header: [4-byte magic number][2-byte version][4-byte length]
function parseHeader(buffer) {
    const view = new DataView(buffer);

    return {
        magicNumber: view.getUint32(0, false),  // big-endian
        version: view.getUint16(4, true),        // little-endian
        length: view.getUint32(6, true)          // little-endian
    };
}
```

## TypedArray vs DataView

| Feature                | `TypedArray`                                              | `DataView`                                            |
|:-----------------------|:----------------------------------------------------------|:------------------------------------------------------|
| **Data Type**          | Fixed, single type across the whole view                  | Mixed types at arbitrary offsets                      |
| **Endianness Control** | Always native platform endianness (implicit)              | Explicit, per-read/write control                      |
| **Performance**        | Faster for bulk, uniform numeric operations               | Slower per-access, but far more flexible              |
| **Typical Use**        | Pixel data, audio samples, WebGL buffers, math-heavy code | Parsing binary file formats, network protocol packets |

## Converting Between ArrayBuffer, TypedArray, and String

```javascript
// String -> ArrayBuffer (via TextEncoder)
function stringToBuffer(str) {
    return new TextEncoder().encode(str).buffer;
}

// ArrayBuffer -> String (via TextDecoder)
function bufferToString(buffer) {
    return new TextDecoder().decode(buffer);
}

// ArrayBuffer -> Base64
function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
}

// Base64 -> ArrayBuffer
function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}
```

## Copying and Slicing Buffers

```javascript
const original = new ArrayBuffer(8);
new Uint8Array(original).set([1, 2, 3, 4, 5, 6, 7, 8]);

// slice() creates a NEW, independent buffer with copied bytes
const copy = original.slice(2, 6);
console.log(new Uint8Array(copy)); // Uint8Array(4) [3, 4, 5, 6]

// Modifying the copy does NOT affect the original
new Uint8Array(copy)[0] = 99;
console.log(new Uint8Array(original)[2]); // still 3, unaffected
```

> Unlike `TypedArray` views (which share memory with their source buffer), `ArrayBuffer.prototype.slice()` performs an
> actual byte-for-byte copy into a brand-new, independent buffer.

## Resizable ArrayBuffers (Modern Addition)

Standard `ArrayBuffer` instances have a fixed size for their lifetime. Modern JavaScript adds an optional
`maxByteLength`, allowing a buffer to grow in place without reallocation, up to a declared ceiling.

```javascript
const resizable = new ArrayBuffer(8, {maxByteLength: 64});

console.log(resizable.resizable);     // true
console.log(resizable.maxByteLength); // 64

resizable.resize(32); // grows the buffer to 32 bytes, in place
console.log(resizable.byteLength);    // 32
```

## Transferring Buffers to Web Workers

Passing a large `ArrayBuffer` to `postMessage()` normally clones the entire buffer, which is expensive for large
payloads. Marking it as a **transferable object** moves ownership instead of copying, making the operation effectively
instantaneous regardless of size.

```javascript
// Main thread
const buffer = new ArrayBuffer(1024 * 1024 * 50); // 50MB

worker.postMessage({buffer}, [buffer]); // second arg: transfer list

console.log(buffer.byteLength); // 0 — the buffer is now DETACHED on this thread
```

```javascript
// worker.js
self.onmessage = (event) => {
    const {buffer} = event.data;
    console.log('Worker received buffer of size:', buffer.byteLength);
};
```

> After transfer, the original `ArrayBuffer` becomes **detached** — its `byteLength` becomes `0` and any attempt to read
> it fails silently or returns empty results. The sending context permanently loses access.

## Use Cases

* **Binary File Format Parsing:** Using `DataView` to read structured headers (image formats, audio formats, custom
  protocols) with mixed-width, mixed-endianness fields.
* **WebGL and Graphics Buffers:** Feeding `Float32Array` vertex/color data directly into GPU buffers for 3D rendering.
* **Cryptography and Hashing:** Supplying byte buffers to `crypto.subtle.digest()` or encryption APIs, which operate
  exclusively on binary data.
* **High-Performance Networking:** Encoding/decoding compact binary WebSocket messages instead of verbose JSON for
  latency-sensitive applications.
* **Audio Processing:** Manipulating raw PCM sample data via `Float32Array` in the Web Audio API's `AudioBuffer`.
* **Zero-Copy Worker Communication:** Transferring large binary payloads (image data, ML model weights) between the main
  thread and Web Workers without cloning overhead.

## Best Practices

* **Always Specify Endianness Explicitly:** Pass the `littleEndian` boolean argument explicitly in every `DataView` read
  and write method to prevent cross-platform byte order bugs.
* **Prefer TypedArrays for Uniform Buffers:** Use specialized `TypedArray` views (`Uint8Array`, `Float32Array`) rather
  than `DataView` when working with homogenous sequences of numbers for cleaner code and better performance.
* **Use `DataView` for Heterogeneous Protocols:** Choose `DataView` specifically when parsing binary packets, file
  headers, or mixed layouts containing varying data types at arbitrary offsets.
* **Keep Memory Aliasing in Mind:** Exercise caution when creating multiple views over a single `ArrayBuffer`,
  remembering that writes through one typed view immediately alter the shared underlying bytes.
* **Clone via Buffer Slicing:** Call `.slice()` on the `ArrayBuffer` itself rather than instantiating a new view when
  you need a true, decoupled byte copy of data.
* **Transfer Large Payloads to Web Workers:** Pass high-volume `ArrayBuffer` instances in the `postMessage` transfer
  list to execute zero-copy migrations and eliminate main-thread blocking.
* **Guard Against Detached Buffers:** Verify that `buffer.byteLength > 0` before operating on any buffer that has been
  passed to a Web Worker to prevent runtime errors on detached memory.
* **Use `TextEncoder` and `TextDecoder` for Strings:** Avoid manual character-code conversion loops when translating
  text strings to binary data buffers by relying on built-in native streaming codecs.
* **Leverage Resizable Buffers Wisely:** Utilize `maxByteLength` during `ArrayBuffer` creation only when dynamic
  in-place growth is required to avoid unnecessary memory reallocations.
* **Validate Byte Offsets and Lengths:** Ensure that custom view offsets and element counts do not exceed the parent
  buffer's total byte length to throw safe bounds errors.
* **Clean Up TypedArray References:** Nullify references to large typed arrays or buffers once heavy data processing
  loops complete to accelerate garbage collection.
* **Align Binary Boundaries Correctly:** Ensure multi-byte reads (`Uint32Array`, `Float64Array`) align cleanly with
  proper byte offsets to avoid platform-specific memory access penalties.
* **Avoid Base64 for Large Array Buffers:** Convert directly via binary blobs or streaming arrays rather than bloated
  base64 strings when transferring raw buffers across network interfaces.
* **Handle Uint8ClampedArray Overflow Safely:** Remember that `Uint8ClampedArray` constrains values between 0 and 255
  rather than wrapping around, making it ideal for pixel manipulation pipelines.
* **Test Endian Consistency across Architectures:** Verify multi-byte parsing logic on both big-endian and little-endian
  server environments when handling external binary payloads.
* **Use TypedArray.set() for Bulk Copying:** Prefer `.set()` over manual iteration loops when copying data between typed
  array instances for optimized memory throughput.
* **Pre-Allocate Fixed-Length Buffers:** Size typed arrays upfront when the maximum dataset size is known to prevent
  continuous internal resizing overhead.
* **Inspect Buffer Instances Safely:** Use `ArrayBuffer.isView()` to validate unknown parameters before extracting
  underlying binary buffers in generic utility functions.
* **Profile Memory Consumption under Load:** Monitor heap allocations closely when processing intensive audio buffers or
  WebGL attribute arrays in client-side applications.
* **Dispose of Worker Transfer Resources:** Ensure downstream workers properly consume transferred buffers immediately
  to prevent memory leaks in multi-threaded workflows.

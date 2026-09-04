# DataView

## Concept and ECMAScript Specification

The `DataView` constructor creates low-level view interfaces for reading and writing multiple numeric types in an
`ArrayBuffer` or `SharedArrayBuffer` without considering the host platform's native endianness. According to the
ECMA-262 specification, `DataView` instances provide explicit, byte-level control over binary data layout, allowing
developers to choose between Big-Endian and Little-Endian byte order for multibyte values.

Unlike `TypedArray` views—which enforce a uniform element type and align memory operations to the target CPU
architecture—`DataView` allows arbitrary, unaligned reads and writes across varying numeric widths (`Int8`, `Int16`,
`Int32`, `Float16`, `Float32`, `Float64`, `BigInt64`, etc.) at explicit byte offsets.

| Characteristic      | ECMAScript Specification Behavior                                                           |
|:--------------------|:--------------------------------------------------------------------------------------------|
| Function Invocation | Calling `DataView()` without `new` throws a `TypeError`                                     |
| Endianness          | Defaults to Big-Endian (network byte order); Little-Endian specified via boolean parameters |
| Memory Alignment    | Supports unaligned byte-offset access across underlying buffer memory                       |
| Element Uniformity  | Polymorphic; distinct data types can be read or written at any valid byte offset            |

## Instance Properties and Prototype Getter Methods

`DataView.prototype` exposes getters for memory metadata alongside explicit numeric getter methods that accept a byte
offset and an optional `littleEndian` boolean flag.

| Property / Method Category | Prototype Property / Method                                                                                                                                                                                                   | Specification Behavior                                                                                     |
|:---------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------|
| Memory Metadata            | `buffer`, `byteLength`, `byteOffset`                                                                                                                                                                                          | Read-only getters exposing the underlying buffer reference, total view byte span, and starting byte offset |
| Integer Getters            | `getInt8(byteOffset)`<br>`getUint8(byteOffset)`<br>`getInt16(byteOffset [, littleEndian])`<br>`getUint16(byteOffset [, littleEndian])`<br>`getInt32(byteOffset [, littleEndian])`<br>`getUint32(byteOffset [, littleEndian])` | Reads signed or unsigned 8-bit, 16-bit, or 32-bit integers from the specified offset                       |
| Floating-Point Getters     | `getFloat16(byteOffset [, littleEndian])`<br>`getFloat32(byteOffset [, littleEndian])`<br>`getFloat64(byteOffset [, littleEndian])`                                                                                           | Reads 16-bit, 32-bit, or 64-bit IEEE 754 floating-point numbers from the specified offset                  |
| BigInt Getters             | `getBigInt64(byteOffset [, littleEndian])`<br>`getBigUint64(byteOffset [, littleEndian])`                                                                                                                                     | Reads 64-bit signed or unsigned BigInt values from the specified offset                                    |

## Prototype Setter Methods

`DataView.prototype` provides setter methods paired with getter methods to write primitive values into buffer memory at
specified byte offsets.

| Setter Method          | Parameters &#124; Specification Behavior                                    | Description                                                                                                                      |
|:-----------------------|:----------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|
| Integer Setters        | `setInt8`, `setUint8`<br>`setInt16`, `setUint16`<br>`setInt32`, `setUint32` | `(byteOffset, value [, littleEndian])` &#124; Converts value to integer type and writes it to buffer memory at `byteOffset`      |
| Floating-Point Setters | `setFloat16`<br>`setFloat32`<br>`setFloat64`                                | `(byteOffset, value [, littleEndian])` &#124; Writes a 16-bit, 32-bit, or 64-bit IEEE 754 float to buffer memory at `byteOffset` |
| BigInt Setters         | `setBigInt64`<br>`setBigUint64`                                             | `(byteOffset, value [, littleEndian])` &#124; Converts value to 64-bit `BigInt` and writes it to buffer memory at `byteOffset`   |

## Use Cases

`DataView` enables exact binary protocol parsing and multi-type memory serialization:

* **Parsing file headers and network protocols:** Reading structured binary file formats (e.g., PNG, WAV, MP4)
  containing mixed-type fields and explicit endianness specifications.
* **Heterogeneous memory buffers:** Serializing structured C/C++ structs containing mixed data types (e.g., an 8-bit
  flag, followed by a 32-bit float, followed by a 16-bit integer).
* **Cross-platform binary interoperability:** Ensuring binary data sent between heterogeneous client and server hardware
  maintains predictable byte order regardless of processor architecture.

## Best Practices

* **Always instantiate DataView using new:** Call `new DataView(buffer [, byteOffset [, byteLength]])` explicitly to
  avoid runtime `TypeError` exceptions.
* **Explicitly pass the littleEndian argument:** Always specify `true` or `false` for the `littleEndian` parameter on
  multibyte methods rather than relying on the default (`false`), ensuring explicit code intent.
* **Check byteOffset limits to avoid RangeError:** Ensure `byteOffset + byteSize` does not exceed `dataView.byteLength`;
  out-of-bounds reads or writes throw a `RangeError`.
* **Prefer TypedArray for homogeneous data:** Use typed arrays (such as `Float32Array` or `Uint8Array`) when processing
  uniform sequences of a single data type to benefit from engine optimizations.
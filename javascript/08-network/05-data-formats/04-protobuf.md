# Protocol Buffers Binary Serialization Specification

Protocol Buffers (Protobuf) is a language-neutral, platform-neutral binary serialization framework developed by Google.
Unlike self-describing text formats like JSON or XML, Protobuf requires predefined schemas written in `.proto` files.
Fields are assigned unique integer tags instead of string names, and the Protobuf compiler generates strongly-typed data
access classes across various programming languages. During serialization, field tags and values are packed into compact
binary byte streams using Tag-Length-Value (TLV) encoding patterns and variable-length integer (varint) representations.

## Wire Format & Encoding Mechanics

Protobuf eliminates payload redundancy by omitting field name strings from the wire format entirely. Each field header
packs both the field's tag number and its wire type into a single byte or varint. Numerical wire types define how the
subsequent byte stream must be read, supporting packed representations for array data structures to maximize network
throughput:

| Wire Type          | ID | Represented Data Types                                       | Encoding Mechanism                                 |
|:-------------------|:---|:-------------------------------------------------------------|:---------------------------------------------------|
| `Varint`           | 0  | `int32`, `int64`, `uint32`, `bool`, `enum`                   | Variable-length encoding using 7 bits per byte.    |
| `Bit64`            | 1  | `fixed64`, `sfixed64`, `double`                              | Fixed 8-byte little-endian binary sequence.        |
| `Length-delimited` | 2  | `string`, `bytes`, embedded messages, packed repeated fields | Varint length prefix followed by raw byte payload. |
| `Bit32`            | 5  | `fixed32`, `sfixed32`, `float`                               | Fixed 4-byte little-endian binary sequence.        |

## Protobuf Serialization Sequence

Transforming a populated data object into a Protobuf binary payload relies on field tags and specialized encoding
routines:

1. **Schema Definition:** Define message structures and assign incremental field tag numbers within a `.proto` schema
   file.
2. **Code Generation:** Compile the schema using `protoc` to generate language-specific data classes equipped with
   native serialization methods.
3. **Object Population:** Instantiate and populate the message object with typed application field values in runtime
   memory.
4. **Binary Encoding:** Encode field tags and values into contiguous binary bytes, applying ZigZag transformation to
   signed integer values and varint packing where applicable.

## Best Practices

* **Preserve Tag Assignment Numbers:** Never change existing field tag numbers within `.proto` files to maintain
  backward and forward compatibility across API versions.
* **Utilize Reserved Fields:** Mark deleted field names and tag numbers as `reserved` to prevent future developer
  updates from accidentally reusing obsolete tags.
* **Leverage Packed Options for Arrays:** Enable `packed = true` on primitive repeated fields to eliminate repeated
  field tag overhead in array payloads.
* **Avoid Deep Message Nesting:** Limit sub-message nesting depth to reduce call stack allocation overhead and header
  evaluation complexity during parsing.
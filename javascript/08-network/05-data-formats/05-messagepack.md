# MessagePack Binary Format Specification

MessagePack is an efficient, schema-less binary serialization format designed to replace JSON in high-throughput
applications. Often described as "like JSON, but fast and small," MessagePack maintains JSON's flexible object-and-array
data model without requiring formal `.proto` schema definitions. It achieves compact byte sizes by replacing plain-text
keys, structural delimiters (braces, brackets, quotes), and numeric characters with compact binary type indicators and
variable-width integer representations.

## Binary Layout & Type System

MessagePack uses byte prefix codes to identify payload data types and value lengths instantly. Small integers (0 to 127
and -32 to -1) are packed directly inside a single byte prefix called Fixint, completely eliminating field type
overhead. Strings, arrays, and map objects use variable-width length headers, allowing parsers to skip bytes and extract
data structures without performing extensive character scanning.

| Format Family      | Byte Prefix Range | Data / Size Range                   | Efficiency Feature                                        |
|:-------------------|:------------------|:------------------------------------|:----------------------------------------------------------|
| `Positive FixInt`  | `0x00 - 0x7F`     | Integers from 0 to 127              | Stores integer value directly within the prefix byte.     |
| `FixMap`           | `0x80 - 0x8F`     | Maps containing up to 15 elements   | Packs map key-value count inside the prefix byte.         |
| `FixArray`         | `0x90 - 0x9F`     | Arrays containing up to 15 elements | Packs array element count inside the prefix byte.         |
| `FixStr`           | `0xA0 - 0xBF`     | Strings up to 31 bytes in length    | Packs string length directly inside the prefix byte.      |
| `Extension Format` | `0xC7 - 0xC9`     | Custom typed binary data blocks     | Enables domain-specific type definitions like timestamps. |

## MessagePack Processing Sequence

Encoding and decoding MessagePack binary streams involves evaluating type prefixes and reading packed bytes:

1. **Property Inspection:** Inspect in-memory object properties, values, and collection lengths during application
   execution.
2. **Prefix Selection:** Select optimal type prefix bytes corresponding to data types and array lengths.
3. **Stream Writing:** Write prefix bytes followed by raw binary payload bytes into a contiguous memory stream.
4. **Stream Unpacking:** Read incoming prefix bytes to determine data type and byte length, reconstructing native
   objects without string parsing.

## Best Practices

* **Leverage Extension Types:** Use MessagePack Extension types to encode application-specific objects like
  high-precision timestamps or UUIDs directly into binary streams.
* **Pre-allocate Buffer Memories:** Allocate fixed-size destination buffers when packing known object structures to
  reduce memory allocations in high-performance pipelines.
* **Validate Payload Byte Boundaries:** Verify length headers against total remaining buffer sizes during unpacking to
  guard against buffer over-read vulnerabilities.
* **Prefer MessagePack for Dynamic Payload Pipelines:** Deploy MessagePack instead of Protobuf when system architectures
  require schema flexibility alongside low network latency.
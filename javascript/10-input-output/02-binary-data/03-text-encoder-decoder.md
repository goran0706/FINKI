# JavaScript TextEncoder and TextDecoder API

## Overview of Text Encoding

`TextEncoder` and `TextDecoder` convert between JavaScript strings (UTF-16 internally) and raw binary data (
`Uint8Array`), using the UTF-8 encoding by default. They are the standard bridge between text and binary APIs — required
whenever a string needs to become bytes (for hashing, compression, `ArrayBuffer`-based transmission) or bytes need to
become a readable string (parsing binary streams, decoding network responses).

| API               | Direction      | Input Type                   | Output Type  |
|:------------------|:---------------|:-----------------------------|:-------------|
| **`TextEncoder`** | String → Bytes | `string`                     | `Uint8Array` |
| **`TextDecoder`** | Bytes → String | `ArrayBuffer` / `TypedArray` | `string`     |

## `TextEncoder`: String to Bytes

`TextEncoder` always encodes to UTF-8 — it does not support other output encodings by design, since UTF-8 is the
universal interchange format for the web.

```javascript
const encoder = new TextEncoder();

const bytes = encoder.encode('Hello, world!');
console.log(bytes);        // Uint8Array(13) [72, 101, 108, 108, 111, ...]
console.log(bytes.length); // 13 (byte length, not character count)

// Multi-byte characters take more bytes than characters
const emoji = encoder.encode('👍');
console.log(emoji.length); // 4 bytes for a single emoji character
```

| Method                              | Return Value               | Description                                                              |
|:------------------------------------|:---------------------------|:-------------------------------------------------------------------------|
| **`encoder.encode(str)`**           | New `Uint8Array`           | Allocates and returns a fresh byte array                                 |
| **`encoder.encodeInto(str, dest)`** | `{ read, written }` object | Writes directly into an existing `Uint8Array`, avoiding a new allocation |

```javascript
// encodeInto avoids allocating a new buffer, useful in hot loops
const destination = new Uint8Array(32);
const result = encoder.encode('Streaming data', destination);
```

Wait — `encodeInto` takes the destination buffer directly:

```javascript
const buffer = new Uint8Array(64);
const {read, written} = encoder.encodeInto('Streaming payload', buffer);

console.log('Characters read:', read);
console.log('Bytes written:', written);
```

## `TextDecoder`: Bytes to String

`TextDecoder` supports a wide range of input encodings (`utf-8`, `utf-16le`, `iso-8859-1`, `windows-1252`, and many
others), defaulting to `'utf-8'` when no label is provided.

```javascript
const decoder = new TextDecoder(); // defaults to 'utf-8'

const bytes = new Uint8Array([72, 101, 108, 108, 111]);
const text = decoder.decode(bytes);
console.log(text); // "Hello"

// Explicit encoding label
const latin1Decoder = new TextDecoder('iso-8859-1');
const decodedLatin1 = latin1Decoder.decode(someLegacyBuffer);
```

| Constructor Option      | Type      | Default   | Description                                                                       |
|:------------------------|:----------|:----------|:----------------------------------------------------------------------------------|
| **`label`**             | `string`  | `'utf-8'` | The character encoding to decode from                                             |
| **`options.fatal`**     | `boolean` | `false`   | Throws `TypeError` on malformed input instead of inserting replacement characters |
| **`options.ignoreBOM`** | `boolean` | `false`   | Whether to skip stripping a leading byte-order mark                               |

```javascript
// Strict mode: throws on invalid byte sequences instead of silently inserting U+FFFD
const strictDecoder = new TextDecoder('utf-8', {fatal: true});

try {
    strictDecoder.decode(new Uint8Array([0xff, 0xfe, 0x00])); // invalid UTF-8
} catch (error) {
    console.error('Malformed byte sequence:', error.message);
}
```

## Streaming Decoding

Both `encode`/`decode` can operate incrementally on chunked data (e.g., from a `ReadableStream`), which matters because
multi-byte UTF-8 characters can be split across chunk boundaries.

```javascript
async function decodeStream(readableStream) {
    const decoder = new TextDecoder('utf-8');
    const reader = readableStream.getReader();
    let result = '';

    while (true) {
        const {value, done} = await reader.read();
        if (done) {
            // Flush any remaining buffered bytes at the end
            result += decoder.decode();
            break;
        }
        // stream: true preserves partial multi-byte sequences across chunks
        result += decoder.decode(value, {stream: true});
    }

    return result;
}
```

| `decode()` Option             | Purpose                                                                                |
|:------------------------------|:---------------------------------------------------------------------------------------|
| **`stream: true`**            | Buffers incomplete multi-byte sequences at chunk boundaries instead of corrupting them |
| **`stream: false`** (default) | Treats the input as complete; any trailing incomplete sequence is replaced/discarded   |

> Omitting `{ stream: true }` when decoding chunked binary data is a common bug source — a multi-byte character split
> across two chunks gets corrupted into replacement characters (`�`) instead of being reassembled correctly.

## Common Use Cases

### Hashing a String with Web Crypto

The Web Crypto API operates on `ArrayBuffer`/`TypedArray`, not strings, so `TextEncoder` is the required bridge.

```javascript
async function sha256(message) {
    const bytes = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

sha256('hello world').then((hash) => console.log(hash));
```

### Decoding a Fetch Response Manually

```javascript
async function decodeResponseManually(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer);
}
```

### Measuring Actual Byte Size of a String

`.length` on a JavaScript string counts UTF-16 code units, not bytes — for byte-accurate size checks (payload limits,
storage quotas), encode first.

```javascript
function getByteLength(str) {
    return new TextEncoder().encode(str).length;
}

console.log('café'.length);                 // 4 (characters)
console.log(getByteLength('café'));          // 5 (bytes — 'é' takes 2 bytes in UTF-8)
```

### Building a Binary Payload Mixing Text and Numbers

```javascript
function buildPacket(command, payload) {
    const commandBytes = new TextEncoder().encode(command);
    const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));

    const packet = new Uint8Array(4 + commandBytes.length + payloadBytes.length);
    const view = new DataView(packet.buffer);

    view.setUint32(0, payloadBytes.length); // length prefix
    packet.set(commandBytes, 4);
    packet.set(payloadBytes, 4 + commandBytes.length);

    return packet;
}
```

## Node.js Equivalents

`TextEncoder`/`TextDecoder` are globally available in Node.js as well (since v11), but Node also offers `Buffer`, which
natively supports many more encodings and integrates directly with the `fs` and stream APIs.

```javascript
// Node.js: TextEncoder/TextDecoder (Web-standard, cross-runtime)
const {TextEncoder, TextDecoder} = require('util');

// Node.js: Buffer (Node-specific, more encoding options)
const buf = Buffer.from('Hello', 'utf-8');
console.log(buf.toString('base64')); // "SGVsbG8="
console.log(buf.toString('hex'));    // "48656c6c6f"
```

| Context                          | Preferred API                 | Reason                                                                      |
|:---------------------------------|:------------------------------|:----------------------------------------------------------------------------|
| **Browser**                      | `TextEncoder` / `TextDecoder` | Only option; no `Buffer` global exists                                      |
| **Node.js, cross-platform code** | `TextEncoder` / `TextDecoder` | Portable to browser environments and Web Workers                            |
| **Node.js, Node-only code**      | `Buffer`                      | Broader encoding support (`base64`, `hex`, `latin1`) and stream integration |

## Encoding Comparison Table

| Encoding Label                    | Supported By `TextEncoder`? | Supported By `TextDecoder`? | Typical Use                        |
|:----------------------------------|:----------------------------|:----------------------------|:-----------------------------------|
| **`utf-8`**                       | **Yes** (only option)       | **Yes** (default)           | Universal web standard             |
| **`utf-16le`**                    | **No**                      | **Yes**                     | Legacy Windows text files          |
| **`iso-8859-1` / `windows-1252`** | **No**                      | **Yes**                     | Legacy Western European text files |
| **`shift_jis`, `euc-kr`, etc.**   | **No**                      | **Yes**                     | Legacy CJK-encoded documents       |

## Best Practices

* **Always Specify `{ stream: true }` in Chunked Reads:** Pass the streaming flag when decoding incremental text buffers
  from streams or sockets to prevent split multi-byte characters from turning into replacement symbols (``).
* **Remember `TextEncoder` Outputs UTF-8 Exclusively:** Acknowledge that the web-standard encoder does not accept custom
  encoding targets, requiring Node.js `Buffer` or external utilities for non-UTF formats.
* **Measure Byte Length Accurately:** Use `new TextEncoder().encode(str).length` instead of `.length` when enforcing
  strict server payload byte limitations for internationalized strings.
* **Enable Fatal Mode for Untrusted Inputs:** Configure `new TextDecoder('utf-8', { fatal: true })` when parsing
  sensitive user-supplied binary files to instantly catch and reject malformed character payloads.
* **Reuse Decoder and Encoder Instances:** Cache encoder and decoder object references globally across modular functions
  to avoid unnecessary garbage collection overhead in hot processing loops.
* **Prefer Standard APIs for Isomorphic Code:** Choose `TextEncoder` and `TextDecoder` over Node-specific `Buffer`
  constructors when building libraries designed to execute natively across browsers and modern server runtimes.
* **Flush Remaining Decoder Streams:** Execute a final call to `decoder.decode()` without parameters once a readable
  stream finishes to extract any buffered trailing bytes.
* **Use `encodeInto` for High-Performance Hot Paths:** Pass pre-allocated destination arrays to `encoder.encodeInto()`
  to bypass dynamic memory allocations during frequent string-to-byte translations.
* **Handle Fallback Encodings Explicitly:** Provide exact legacy codec strings (e.g., `'windows-1252'`, `'shift_jis'`)
  when instantiating decoders for outdated files or external legacy integrations.
* **Validate Decoded Strings Against Null Bytes:** Inspect strings decoded from untrusted binary buffers for unexpected
  control characters or injection sequences before application rendering.
* **Dispose of Temporary Byte Arrays:** Nullify references to large intermediate `Uint8Array` allocations produced by
  text encoders once downstream transmissions finish.
* **Test International Character Boundaries:** Verify that multi-byte Unicode strings (emojis, Cyrillic, CJK characters)
  serialize and deserialize correctly across chunked boundaries under test throttling.
* **Avoid Silent Replacement Discards:** Monitor application logs for unexpected replacement characters appearing from
  non-fatal decodes to catch silent data corruption early.
* **Align Buffer Views Correctly:** Ensure destination byte arrays passed to text translation functions match proper
  byte alignments to prevent underlying type errors.
* **Cache Text Encoding Results Sparingly:** Store encoded byte arrays only when static string content remains immutable
  throughout application execution states.
* **Handle Stream Abort Signals Gracefully:** Wrap stream decoding loops inside robust cleanup blocks to release active
  readers immediately if network connections drop.
* **Verify BOM Stripping Behavior:** Control the `ignoreBOM` option explicitly when decoding files where leading byte
  order marks must be preserved or stripped.
* **Use TextDecoder for Fetch Streams:** Pipe raw body streams directly into custom streaming decoders to process large
  textual downloads incrementally without memory spikes.
* **Profile Memory Allocation Under Load:** Monitor browser heap metrics when running continuous text encoding
  operations inside real-time collaborative web applications.
* **Document Custom Encoding Constraints:** Add clear comments in codebase modules specifying why particular legacy
  decoders or strict error-handling modes are enforced.

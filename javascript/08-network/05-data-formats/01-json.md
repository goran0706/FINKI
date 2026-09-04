# JSON (JavaScript Object Notation) Specification

JavaScript Object Notation (JSON) is a lightweight, text-based, language-independent data-interchange format
standardized under IETF RFC 8259 and ECMA-404. Built upon a subset of the JavaScript programming language (ECMAScript
Standard ECMA-262), JSON defines a portable structural syntax for representing structured data as key-value pairs and
ordered lists. Modern distributed systems, web APIs (REST, GraphQL), and application configuration pipelines rely on
JSON as a primary wire format due to its human readability and native, high-performance parsing across nearly all modern
programming platforms.

| Data Type | Literal Syntax Example | Structural Description                                                                |
|:----------|:-----------------------|:--------------------------------------------------------------------------------------|
| `Object`  | `{"key": "value"}`     | Unordered collection of zero or more key-value pairs enclosed in curly braces (`{}`). |
| `Array`   | `["apple", "banana"]`  | Ordered sequence of zero or more values enclosed in square brackets (`[]`).           |
| `String`  | `"hello world"`        | Sequence of zero or more Unicode characters enclosed in double quotes (`"`).          |
| `Number`  | `42` / `-3.14e10`      | Base-10 double-precision floating-point number without leading zeros.                 |
| `Boolean` | `true` / `false`       | Lowercase literal boolean values representing truth states.                           |
| `Null`    | `null`                 | Lowercase literal representing an empty, absent, or null value.                       |

## Syntax & Structural Rules

The JSON data format mandates strict lexical tokens to ensure deterministic parsing and cross-platform compatibility.
According to the specification, all string keys inside an object must be enclosed in double quotes (`"`), single
quotes (`'`) are invalid syntax, and trailing commas after the final element in an array or object are strictly
prohibited. Whitespace (spaces, horizontal tabs, line feeds, and carriage returns) is permitted before or after any
token, but JSON payloads must be encoded using UTF-8 to guarantee universal interoperability over network transports:

1. **Structural Token Formatting:** Delimit object properties using colons (`:`) and separate adjacent array items or
   object pairs using single commas (`,`).
2. **Character Escaping:** Escape reserved string characters using a backslash (`\`), including double quotes (`\"`),
   backslashes (`\\`), control characters (`\b`, `\f`, `\n`, `\r`, `\t`), and arbitrary Unicode code points (`\uXXXX`).
3. **Numeric Encoding:** Format numeric values as standard integer or floating-point representations, optionally using
   scientific E-notation (e.g., `1.5e-3`), while excluding non-standard literals like `NaN`, `Infinity`, or hexadecimal
   prefixes (`0x`).
4. **Payload Termination:** Ensure root payloads consist of a single top-level JSON value—typically a JSON Object or
   Array—without trailing unescaped characters outside whitespace boundaries.

## Serialization & Deserialization Mechanics

Data interchange between runtime environments and wire formats occurs through two complementary processes: *
*Serialization** (converting in-memory data structures into a string payload) and **Deserialization** (reconstructing
in-memory data structures from a string payload). At the engine level, deserialization executes in two distinct phases:
**Tokenization** (lexical analysis breaking the raw UTF-8 string into discrete language tokens) followed by **Parsing
** (syntactic analysis validating tokens against grammar rules to build runtime objects). In JavaScript environments,
these operations are exposed via `JSON.stringify()` and `JSON.parse()`:

```javascript
// Serialization: Memory Object -> JSON String (Wire Format)
const payload = {
    id: 1001,
    username: "alex_dev",
    roles: ["admin", "developer"],
    active: true
};

const jsonString = JSON.stringify(payload, null, 2);

// Deserialization: JSON String -> Engine Tokenization & Parsing -> Memory Object
try {
    const parsedData = JSON.parse(jsonString);
    console.log(`User initialized: ${parsedData.username}`);
} catch (error) {
    console.error('SyntaxError during JSON deserialization:', error.message);
}
```

## Best Practices

* **Never Use Unsafe Evaluation:** Always utilize standard `JSON.parse()` methods instead of JavaScript `eval()`
  functions to process incoming payload streams, preventing arbitrary code execution and XSS vectors.
* **Enforce Schema Validation:** Validate incoming and outgoing JSON documents against formal contracts (such as JSON
  Schema specifications) to enforce structural types and filter unexpected fields.
* **Handle 64-Bit Integer Precision Limits:** Encode large integers exceeding IEEE 754 safe integer
  limits ($ -2^{53} + 1 $ to $ 2^{53} - 1 $, e.g., 64-bit database keys) as strings (`"18446744073709551615"`) to
  prevent truncation during numeric parsing.
* **Set Recursion & Depth Safeguards:** Enforce strict payload size limits and maximum nesting depth thresholds in
  backend parsing pipelines to mitigate denial-of-service (DoS) stack overflow attacks.
* **Strip Sensitive Memory References:** Implement custom replacer functions or sanitization loops prior to
  serialization to avoid exposing internal system metadata, tokens, or circular object references.
* **Reject trailing commas strictly:** Ensure custom JSON parsers or pre-processing steps reject trailing commas to
  maintain strict adherence to ECMA-404 compliance.
* **Validate UTF-8 string encoding:** Confirm that incoming binary payload buffers are properly decoded to valid UTF-8
  strings before initiating JSON parsing routines.
* **Handle circular reference exceptions:** Detect or prune circular object structures before passing objects to
  `JSON.stringify()` to prevent runtime `TypeError` crashes.
* **Sanitize serialized property keys:** Avoid using untrusted or raw user inputs as dynamic object keys without
  sanitization to prevent injection vulnerabilities in downstream parsers.
* **Implement streaming JSON parsers for large payloads:** Utilize dedicated stream-based parsing libraries (e.g.,
  StreamJson) when processing multi-megabyte JSON documents to conserve server memory.
* **Catch syntax errors gracefully:** Always wrap `JSON.parse()` calls in try-catch blocks to handle malformed wire
  formats without crashing the application event loop.
* **Optimize stringification performance:** Avoid serializing massive, deeply nested objects inside performance-critical
  hot loops or render cycles.
* **Escape control characters properly:** Ensure custom serialization logic correctly handles backslashes, quotes, and
  control codes according to RFC 8259 specifications.
* **Mime-type application/json enforcement:** Set correct HTTP headers (`Content-Type: application/json`) on API
  responses to ensure clients interpret payloads correctly.
* **Avoid storing secrets in JSON logs:** Strip confidential variables and authorization tokens before writing raw JSON
  payloads to text log files.
* **Standardize date time representations:** Serialize JavaScript `Date` objects consistently as ISO 8601 string
  formats (e.g., `toISOString()`) during payload generation.
* **Normalize key casing conventions:** Adopt a consistent casing standard (e.g., camelCase or snake_case) across all
  API JSON contracts to simplify client integration.
* **Discard unknown extension properties:** Configure JSON deserializers to ignore unrecognized fields gracefully to
  ensure backward compatibility during API schema evolution.
* **Limit array length allocations:** Validate array dimensions during deserialization to protect backend memory
  reserves against memory exhaustion attacks.
* **Test parser limits with fuzz data:** Run automated fuzz testing against JSON ingestion endpoints to verify stability
  under malformed or malicious payload inputs.
* **Review numeric precision libraries:** Use specialized libraries (like BigInt or decimal.js) when handling
  high-precision financial numbers transferred via JSON.
* **Document payload schema versions:** Include schema version identifiers within top-level API response objects to
  manage structural updates smoothly over time.
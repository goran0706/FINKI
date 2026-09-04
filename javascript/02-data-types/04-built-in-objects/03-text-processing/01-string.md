# String

## Concept and ECMAScript Specification

The `String` constructor is a built-in wrapper used to represent and manipulate sequences of textual data. According to
the ECMA-262 specification, a String primitive is a finite-ordered sequence of zero or more 16-bit unsigned integer
values (UTF-16 code units). `String` can be invoked as a standard function to perform explicit type coercion via the
`ToString` abstract operation or as a constructor using `new` to instantiate a `String` object wrapper.

| Characteristic         | ECMAScript Specification Behavior                                               |
|:-----------------------|:--------------------------------------------------------------------------------|
| Function Invocation    | `String(value)` executes `ToString(value)` and returns a primitive string       |
| Constructor Invocation | `new String(value)` allocates an object with a `[[StringData]]` internal slot   |
| Value Representation   | Sequence of 16-bit code units indexed from `0` up to `length - 1`               |
| Primitive Immutability | All string primitives are immutable once created; operations return new strings |

## Static Methods

The `String` constructor provides static factory methods to generate string instances directly from raw numeric
character code sequences or raw template string representations.

| Static Method                            | Specification Behavior                                                                           |
|:-----------------------------------------|:-------------------------------------------------------------------------------------------------|
| `String.fromCharCode(...codeUnits)`      | Returns a string created from the specified sequence of UTF-16 code units                        |
| `String.fromCodePoint(...codePoints)`    | Returns a string created from the specified sequence of Unicode code points                      |
| `String.raw(template, ...substitutions)` | Tag function returning raw string forms of template literals without processing escape sequences |

## Prototype Inspection and Manipulation Methods

`String.prototype` provides instance methods for searching, extracting, transforming, and comparing character sequences
across single or multiple code unit spans.

| Method Category      | Standard Prototype Methods                                                                                                                                                                         |
|:---------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Code Unit Access     | `charAt(index)`, `charCodeAt(index)`, `codePointAt(index)`                                                                                                                                         |
| Search & Inspection  | `includes(searchString)`, `startsWith(searchString)`, `endsWith(searchString)`, `indexOf(searchString)`, `lastIndexOf(searchString)`                                                               |
| Extraction & Slicing | `slice(start, end)`, `substring(start, end)`, `split(separator, limit)`                                                                                                                            |
| Transformation       | `concat(...strings)`, `padEnd(targetLength)`, `padStart(targetLength)`, `repeat(count)`, `replace(pattern, replacement)`, `replaceAll(pattern, replacement)`, `trim()`, `trimStart()`, `trimEnd()` |
| Case Conversion      | `toLowerCase()`, `toUpperCase()`, `toLocaleLowerCase()`, `toLocaleUpperCase()`                                                                                                                     |

## Use Cases

`String` methods and properties underpin text manipulation and protocol parsing tasks across applications:

* **Normalizing user text inputs:** Sanitizing user inputs using `trim()` and enforcing consistent casing with
  `toLowerCase()`.
* **Parsing structured text streams:** Extracting substring segments with `slice()` or breaking delimited text into
  arrays via `split()`.
* **Unicode code point validation:** Handling multibyte emoji or non-BMP Unicode characters correctly using
  `codePointAt()` and `fromCodePoint()`.

## Best Practices

* **Never use new String(value):** Call `String(value)` directly as a function for type conversion; avoid object
  wrappers because they evaluate as truthy objects and add memory overhead.
* **Prefer slice to substring:** Use `slice()` for substring extraction because it supports negative indices and
  exhibits consistent behavior across engines.
* **Use code point methods for Unicode safety:** Use `codePointAt()` and `String.fromCodePoint()` rather than
  `charCodeAt()` and `fromCharCode()` when dealing with multibyte surrogate pairs such as emojis.
* **Prefer replaceAll for global string substitution:** Use `replaceAll()` or a regular expression with the global `g`
  flag when replacing all occurrences of a substring.
* **Avoid treating strings as mutable arrays:** Remember that string primitives are immutable; operations that modify
  text always return newly allocated strings rather than mutating the original variable in place.
* **Be cautious with string length when counting characters:** Recognize that string `length` measures 16-bit code units
  rather than grapheme clusters or Unicode code points, requiring specialized libraries or Intl segmenters for
  multi-code-point emojis.
* **Use template literals over string concatenation:** Prefer backtick template literals for readable interpolation and
  multi-line strings instead of chaining multiple `+` operators or `concat()` calls.
* **Sanitize template strings with `String.raw()` carefully:** Use `String.raw()` as a template tag when you need
  unescaped backslashes or raw escape sequences preserved exactly as typed in source code.
* **Normalize unicode input strings:** Apply `.normalize('NFC')` or `.normalize('NFD')` when comparing or storing
  user-entered text containing diacritics and combining character sequences to guarantee reliable equivalence checks.
* **Prefer `includes()`, `startsWith()`, and `endsWith()`:** Use modern ES6 search methods instead of checking whether
  `indexOf()` returns `-1` to improve intent clarity and code readability.
* **Handle case-insensitive comparisons securely:** Use `.toLocaleLowerCase()` or `.toLocaleUpperCase()` with explicit
  locale identifiers rather than standard case methods when sorting or comparing language-specific text.
* **Avoid massive string concatenation in loops:** Use an array to collect string segments and join them via
  `Array.prototype.join('')` when building large strings iteratively to prevent excessive intermediate memory garbage
  collection.
* **Validate string indices before slicing:** Ensure slice bounds and search index offsets fall within valid ranges to
  prevent unintended empty string returns or incorrect substring extractions.
* **Use `trimStart()` and `trimEnd()` for precise whitespace control:** Apply specific whitespace trimming methods when
  parsing configuration files or code tokens where leading or trailing spaces matter selectively.
* **Cache regular expressions for repetitive replacements:** Compile regex patterns outside high-frequency loops when
  passing patterns into `replace()` or `replaceAll()` to avoid redundant parser overhead.
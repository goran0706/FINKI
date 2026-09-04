# RegExp

## Concept and ECMAScript Specification

The `RegExp` constructor creates regular expression objects used for matching text patterns. According to the ECMA-262
specification, a `RegExp` instance wraps a compiled pattern and set of flags. `RegExp` can be instantiated via literal
syntax (e.g., `/pattern/flags`) or by invoking the `RegExp` constructor function. When `RegExp` is called as a function
without `new`, it performs identical object creation or pattern compilation as when called with `new`, unless the first
argument is already a `RegExp` instance and no flags are supplied, in which case that instance is returned directly.

| Characteristic         | ECMAScript Specification Behavior                                                            |
|:-----------------------|:---------------------------------------------------------------------------------------------|
| Literal Syntax         | `/pattern/flags` compiles the regular expression at script parse time                        |
| Constructor Invocation | `new RegExp(pattern, flags)` compiles the pattern at runtime using string dynamic evaluation |
| Internal Slots         | Wraps `[[RegExpMatcher]]` internal algorithm slot and `lastIndex` state property             |
| Global Match State     | Stateful matching tracking via `lastIndex` when global `g` or sticky `y` flags are enabled   |

## Regular Expression Flags

ECMAScript standardizes specific single-character flags that alter pattern matching algorithms, multiline evaluation,
Unicode handling, and search boundaries.

| Flag | Name         | Specification Operational Behavior                                                                       |
|:-----|:-------------|:---------------------------------------------------------------------------------------------------------|
| `g`  | Global       | Causes search execution to continue past the first match, updating `lastIndex`                           |
| `i`  | Ignore Case  | Disables case sensitivity during character matching algorithms                                           |
| `m`  | Multiline    | Treats start `^` and end `$` anchors as matching line boundaries (`\n`, `\r`) rather than string edges   |
| `s`  | Dot All      | Allows the wildcard dot character `.` to match line terminator characters                                |
| `u`  | Unicode      | Enables full Unicode matching algorithms, treating surrogate pairs as single code points                 |
| `v`  | Unicode Sets | Upgrades `u` flag with set notation operations (difference, intersection) and character class properties |
| `y`  | Sticky       | Matches only starting at the exact index specified by the `lastIndex` property                           |
| `d`  | Indices      | Generates start and end substring index bounds for matched capture groups inside `.indices`              |

## Prototype Methods and Inspection Properties

Methods on `RegExp.prototype` execute search algorithms against string targets. `RegExp` instances also expose read-only
state flags and configurable properties.

| Method / Property | Category          | Specification Behavior                                                                   |
|:------------------|:------------------|:-----------------------------------------------------------------------------------------|
| `exec(string)`    | Prototype Method  | Executes matching algorithm; returns a match array with capture groups or `null`         |
| `test(string)`    | Prototype Method  | Returns `true` if a pattern match exists within target string; otherwise `false`         |
| `lastIndex`       | Instance Property | Integer property defining the character index at which to start the next match operation |
| `source`          | Prototype Getter  | Returns a string representation of the pattern text                                      |
| `flags`           | Prototype Getter  | Returns a string listing the active flag characters sorted alphabetically                |

## Use Cases

`RegExp` instances provide text evaluation and pattern replacement capabilities across application boundaries:

* **Validating input syntax:** Verifying that user input strings conform to required structural formats using `test()`.
* **Extracting structured tokens:** Parsing formatted log entries or data streams into capture groups using `exec()`.
* **Global pattern substitution:** Replacing structural tokens across target strings by combining `RegExp` instances
  with `String.prototype.replace()`.

## Best Practices

* **Always reset lastIndex when reusing global RegExp instances:** Reset `regexp.lastIndex = 0` manually when performing
  repeated global (`g`) or sticky (`y`) searches on different target strings to prevent stale offset skips.
* **Enable the u or v flag for Unicode text processing:** Always include the `u` or `v` flag when matching text
  containing multibyte characters or emojis to prevent surrogate pair splitting.
* **Prefer literal syntax for static patterns:** Instantiate regular expressions using literal syntax `/pattern/` for
  static expressions so the pattern is compiled once during script evaluation rather than on every invocation.
* **Escape dynamic inputs passed to the RegExp constructor:** Sanitize dynamic string variables passed into
  `new RegExp(str)` using escape routines to prevent regular expression injection vulnerabilities.
* **Avoid catastrophic backtracking in complex patterns:** Structure regular expressions carefully to prevent
  exponential execution time degradation and CPU lockups caused by overlapping quantifiers and ambiguous alternations.
* **Use non-capturing groups when capture groups are unnecessary:** Prefer `(?:pattern)` over `(pattern)` to optimize
  matching performance and reduce memory allocations when captured indices are not required.
* **Prefer `String.prototype.search()` or `includes()` for simple checks:** Avoid using complex regular expression
  objects when simple string methods like `includes()`, `startsWith()`, or `indexOf()` satisfy the search requirement.
* **Cache compiled regular expressions outside function bodies:** Declare regular expression literals outside
  high-frequency event handlers or loops to prevent redundant re-compilation overhead on every execution pass.
* **Use named capture groups for better readability:** Leverage named capturing groups (`(?<name>...)`) to make regular
  expression extraction logic more maintainable and self-documenting compared to numeric index lookups.
* **Be cautious with dot wildcard usage:** Avoid overusing the dot character `.` without the `s` flag or explicit
  character classes, as it unintentionally excludes line terminators unless specified.
* **Leverage the `d` flag for range inspection:** Use the indices flag `d` when you need exact start and end coordinate
  bounds of matches and capture groups for syntax highlighters or text editors.
* **Test regular expressions against edge-case inputs:** Validate regex patterns thoroughly against empty strings,
  massive inputs, and malformed text data to prevent unexpected runtime execution failures.
* **Use character classes instead of massive alternations:** Prefer optimized character classes (`[a-z0-9]`) rather than
  bloated alternation chains (`a|b|c|...|z`) for cleaner and faster matching engines.
* **Avoid sticky flag mismatch traps:** Keep in mind that using the sticky (`y`) flag requires the match to begin
  precisely at `lastIndex`, causing silent test failures if offsets do not align.
* **Keep regular expression documentation updated:** Add clear inline comment explanations or pattern breakdowns for
  intricate regular expressions to simplify future code reviews and maintenance.
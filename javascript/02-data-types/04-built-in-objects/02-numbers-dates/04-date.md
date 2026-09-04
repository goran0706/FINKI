# Date

## Concept and ECMAScript Specification

The `Date` constructor creates instances that represent a single moment in time in a platform-independent format.
According to the ECMA-262 specification, `Date` objects wrap an internal time value stored as an integer representing
milliseconds elapsed since 00:00:00 UTC on 1 January 1970 (the ECMAScript epoch). The maximum representable time range
is $\pm 100,000,000$ days relative to the epoch (covering $-8,640,000,000,000,000$ to $+8,640,000,000,000,000$
milliseconds). Calling `Date()` as a standard function ignores all arguments and returns a string representation of the
current local date and time. Invoking `Date` as a constructor via `new Date()` allocates a `Date` object wrapping the
specified time value.

| Characteristic         | ECMAScript Specification Behavior                                                                        |
|:-----------------------|:---------------------------------------------------------------------------------------------------------|
| Function Invocation    | `Date()` returns a primitive string representation of the current system time                            |
| Constructor Invocation | `new Date()` allocates an object with a `[[DateValue]]` internal slot containing a millisecond time clip |
| Invalid Dates          | Wrapped time values outside valid boundaries or parsed from malformed inputs result in `NaN`             |
| Prototype Inheritance  | `Date.prototype` inherits directly from `Object.prototype`                                               |

## Static Parsing and Epoch Methods

The `Date` constructor provides static reflection and parsing utility methods to generate timestamp integers directly
without necessitating the instantiation of intermediary `Date` instances.

| Static Method                         | Specification Behavior                                                                                       |
|:--------------------------------------|:-------------------------------------------------------------------------------------------------------------|
| `Date.now()`                          | Returns the numeric timestamp corresponding to the current Universal Coordinated Time (UTC) execution moment |
| `Date.parse(dateString)`              | Parses a string representation of a date and returns its corresponding millisecond timestamp                 |
| `Date.UTC(year, monthIndex, ...args)` | Accepts component values as UTC fields and returns the calculated millisecond timestamp                      |

## Instance Accessors and Formatting Methods

`Date.prototype` includes getter and setter methods to access date components in either local platform time or UTC.
Formatting methods convert the underlying millisecond timestamp into localized or standardized ISO text streams.

| Method Category        | Standard Prototype Methods                                                                                                                        |
|:-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| Local Accessors        | `getFullYear()`, `getMonth()`, `getDate()`, `getDay()`, `getHours()`, `getMinutes()`, `getSeconds()`, `getMilliseconds()`                         |
| UTC Accessors          | `getUTCFullYear()`, `getUTCMonth()`, `getUTCDate()`, `getUTCDay()`, `getUTCHours()`, `getUTCMinutes()`, `getUTCSeconds()`, `getUTCMilliseconds()` |
| Setter Operations      | `setFullYear()`, `setMonth()`, `setDate()`, `setHours()`, `setMinutes()`, `setSeconds()`, `setMilliseconds()` (and UTC counterparts)              |
| Standard Serialization | `toISOString()`, `toJSON()`, `toString()`, `toUTCString()`, `valueOf()`                                                                           |

## Use Cases

`Date` instances and static millisecond calculations fulfill temporal processing roles across web applications:

* **High-level duration tracking:** Calculating execution deltas by comparing millisecond timestamps derived from
  `Date.now()`.
* **Standardized API payload transport:** Formatting absolute time instances into ISO-8601 strings using
  `Date.prototype.toISOString()` for backend interchange.
* **Localized date display:** Generating formatted human-readable date strings compliant with local user platform
  conventions.

## Best Practices

* **Always use new Date() to create date instances:** Avoid calling `Date()` without `new` when an object instance is
  needed, as function calls ignore inputs and return string primitives.
* **Prefer Date.now() for timing calculations:** Retrieve timestamps via `Date.now()` directly instead of instantiating
  `new Date().getTime()` to reduce redundant garbage collection allocations.
* **Avoid string parsing with Date.parse():** Refrain from parsing non-standard date strings with `Date.parse()` due to
  implementation variations across runtime engines; use ISO-8601 formatted strings (`YYYY-MM-DDTHH:mm:ss.sssZ`)
  explicitly.
* **Account for zero-indexed month parameters:** Remember that month components are zero-indexed (`0` represents
  January, `11` represents December) when calling `Date` constructors or setters to prevent offset errors.
* **Prefer Intl.DateTimeFormat for localization:** Use `Intl.DateTimeFormat` rather than reliance on
  `Date.prototype.toString()` variants when rendering localized time values across international regions.
* **Validate date instances before performing arithmetic:** Check whether a `Date` object holds an invalid time value
  using `isNaN(date.getTime())` to prevent silent corruption during temporal calculations.
* **Treat Date instances as mutable carefully:** Avoid unexpected side effects in shared state architectures by cloning
  `Date` objects (`new Date(target.getTime())`) before applying mutating setter methods.
* **Use UTC methods when handling server-side timezones:** Standardize database timestamps and API persistence logic
  around UTC accessors (`getUTCHours()`, `toISOString()`) to avoid local timezone offset discrepancies.
* **Avoid relying on automatic two-digit year parsing:** Provide fully specified four-digit years when constructing
  `Date` instances to prevent legacy ambiguity adjustments in older engine implementations.
* **Use Temporal API alternatives when available:** Transition codebases to the modern Temporal proposal if targeting
  environments with native support to handle calendar systems and time zones without legacy Date object bugs.
* **Be mindful of leap seconds and daylight saving shifts:** Account for local timezone clock shifts and irregular
  calendar boundaries when executing high-precision date addition or subtraction loops.
* **Compare timestamps instead of Date object references:** Use `.getTime()` or unary operators (`+date`) when checking
  date equality or sorting arrays to compare underlying millisecond values accurately.
* **Pass ISO strings rather than local formats to constructors:** Ensure date strings passed into `new Date(str)`
  conform strictly to ISO-8601 specifications to guarantee consistent parsing results across different browsers and Node
  versions.
* **Keep timezone offsets explicit in string inputs:** Always append the `Z` specifier or an explicit UTC offset to date
  strings when parsing universal timestamps to avoid local browser interpretation drift.
* **Avoid manual timezone math computations:** Delegate complex timezone conversions and interval offsets to specialized
  internationalization or date-time formatting utilities rather than manual arithmetic.
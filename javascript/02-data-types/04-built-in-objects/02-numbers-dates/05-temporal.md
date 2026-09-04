# Temporal

## Concept and ECMAScript Specification

The `Temporal` namespace object provides a modern, comprehensive date-time API in ECMAScript designed as a full
replacement for the legacy `Date` object. According to the ECMA-262 specification, `Temporal` is a global namespace
object—similar to `Math` or `Intl`—and cannot be invoked as a function or instantiated using the `new` operator.
Attempting to call `Temporal()` or `new Temporal()` throws a `TypeError`.

`Temporal` addresses structural flaws in legacy date handling by introducing dedicated, strongly typed, immutable
objects for distinct temporal domains—separating exact instants in time, wall-clock dates/times, time zones, and
durations.

| Characteristic       | ECMAScript Specification Behavior                                                               |
|:---------------------|:------------------------------------------------------------------------------------------------|
| Namespace Structure  | Non-constructor namespace object; properties are static constructors and utility modules        |
| Mutability           | All `Temporal` instances are strictly immutable; operations return new object instances         |
| Implemented Standard | Full compliance with ISO 8601, RFC 9557, and IANA Time Zone Database (TZDB) standards           |
| Time Resolution      | Nanosecond-level accuracy (using high-precision `BigInt` nanosecond representations internally) |

## Core Temporal Data Types

The `Temporal` namespace exposes specific classes categorized into exact time instances, wall-clock (plain) concepts,
and duration mechanisms.

| Class Type                | Specification Representation                                                           | Example String Representation               |
|:--------------------------|:---------------------------------------------------------------------------------------|:--------------------------------------------|
| `Temporal.Instant`        | A fixed point in time independently of time zone or calendar (UTC timestamp)           | `"2026-07-26T12:15:00Z"`                    |
| `Temporal.ZonedDateTime`  | A specific moment bound to a geographic IANA time zone and calendar system             | `"2026-07-26T12:15:00+02:00[Europe/Paris]"` |
| `Temporal.PlainDateTime`  | Wall-clock date and time without an associated time zone                               | `"2026-07-26T12:15:00"`                     |
| `Temporal.PlainDate`      | Calendar date without a time or time zone component                                    | `"2026-07-26"`                              |
| `Temporal.PlainTime`      | Wall-clock time without a date or time zone component                                  | `"12:15:00"`                                |
| `Temporal.PlainYearMonth` | A year and month combination (useful for calendar grids)                               | `"2026-07"`                                 |
| `Temporal.PlainMonthDay`  | A month and day combination (useful for annual recurring events like anniversaries)    | `"07-26"`                                   |
| `Temporal.Duration`       | Represents a span of time (e.g., 2 hours and 30 minutes) used in arithmetic operations | `"PT2H30M"`                                 |

## The `Temporal.Now` Namespace

Current system time is retrieved through static methods on the `Temporal.Now` utility namespace. These methods return
localized or exact temporal instances reflecting current environment execution state.

| Method                                    | Specification Behavior                                                                                         |
|:------------------------------------------|:---------------------------------------------------------------------------------------------------------------|
| `Temporal.Now.instant()`                  | Returns the current system exact time as a `Temporal.Instant` instance                                         |
| `Temporal.Now.zonedDateTimeISO(timeZone)` | Returns the current date and time in the specified time zone (or system default) as a `Temporal.ZonedDateTime` |
| `Temporal.Now.plainDateISO(timeZone)`     | Returns the current local calendar date as a `Temporal.PlainDate` instance                                     |
| `Temporal.Now.plainDateTimeISO(timeZone)` | Returns the current local wall-clock date and time as a `Temporal.PlainDateTime` instance                      |
| `Temporal.Now.timeZoneId()`               | Returns the system's current default IANA time zone identifier string                                          |

## Common Methods and Operations

`Temporal` types expose standardized instance methods for immutable updates, calendar arithmetic, rounding, and
comparison checks.

| Method Pattern                           | Specification Behavior                                                                    |
|:-----------------------------------------|:------------------------------------------------------------------------------------------|
| `.from(item)`                            | Static factory method creating a `Temporal` object from ISO 8601 strings or property bags |
| `.with(fields)`                          | Instance method returning a copy with specified fields modified                           |
| `.add(duration)` / `.subtract(duration)` | Immutably adds or subtracts a `Temporal.Duration` or duration specification object        |
| `.until(other)` / `.since(other)`        | Computes the precise duration difference between two temporal instances                   |
| `.equals(other)`                         | Compares two instances for value equality                                                 |
| `compare(one, two)`                      | Static comparison function designed for sorting routines                                  |

## Use Cases

The `Temporal` namespace solves historical defects present in legacy date handling across modern JavaScript
applications:

* **DST-safe arithmetic:** Adding durations across Daylight Saving Time transitions using `Temporal.ZonedDateTime`
  without offset calculation errors.
* **Time zone conversions:** Converting UTC timestamps (`Temporal.Instant`) into local wall-clock times bound to target
  IANA identifiers like `"America/New_York"`.
* **Calendar date processing:** Representing birthdates or schedule dates independently of local user time zones using
  `Temporal.PlainDate` to prevent off-by-one day bugs.

## Best Practices

* **Never attempt to call Temporal with new:** Access constructors and utility methods directly on static
  sub-namespaces (e.g., `Temporal.PlainDate.from()`).
* **Use Plain Date/Time types for wall-clock concepts:** Prefer `Temporal.PlainDate` or `Temporal.PlainTime` when
  representing local concepts like store operating hours or calendar dates without time zone offsets.
* **Use ZonedDateTime for scheduling future events:** Store future scheduled events using `Temporal.ZonedDateTime` to
  ensure local wall-clock correctness even if historical or regional time zone rules shift.
* **Prefer Temporal.Instant for UTC logs and timestamps:** Standardize database timestamps and audit logs on
  `Temporal.Instant` for unambiguous point-in-time tracking.
* **Leverage built-in Duration objects for arithmetic:** Perform time math via `.add()` and `.subtract()` with
  `Temporal.Duration` instances rather than converting values to raw millisecond calculations.
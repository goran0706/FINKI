# Intl

## Concept and ECMAScript Specification

The `Intl` namespace object is the standard entry point for the ECMA-402 Internationalization API Specification.
According to ECMA-402, `Intl` is a built-in global namespace object—similar to `Math`—and is not a constructor function.
It lacks a `[[Call]]` internal method and cannot be invoked or instantiated using the `new` operator; attempting to do
so throws a `TypeError`. The `Intl` object houses static constructor constructors and helper methods that provide
language-sensitive string comparison, number formatting, date and time formatting, plural rule evaluation, and segment
chunking.

| Characteristic        | ECMAScript / ECMA-402 Specification Behavior                                     |
|:----------------------|:---------------------------------------------------------------------------------|
| Invocation Attempts   | Throws a `TypeError` when called as a function or constructor                    |
| Prototype Inheritance | `Intl` inherits directly from `Object.prototype`                                 |
| Locale Resolution     | Implements BCP 47 language tag lookup and negotiation algorithms                 |
| Execution Environment | Relies on underlying host ICU (International Components for Unicode) data tables |

## Core Constructor Objects

The `Intl` namespace exposes specific constructors designed for internationalization, formatting, and text segmentation
tasks across distinct locales.

| Constructor               | Specification Purpose                                                                     |
|:--------------------------|:------------------------------------------------------------------------------------------|
| `Intl.Collator`           | Enables locale-sensitive string comparison and sorting algorithms                         |
| `Intl.DateTimeFormat`     | Formats date and time values according to language and regional conventions               |
| `Intl.NumberFormat`       | Formats numbers, currencies, percentages, and measurement units                           |
| `Intl.PluralRules`        | Evaluates plural language categories for cardinal and ordinal numbers                     |
| `Intl.RelativeTimeFormat` | Formats relative time spans (e.g., "3 days ago", "in 2 minutes")                          |
| `Intl.ListFormat`         | Formats lists of items into natural language conjunctions or disjunctions                 |
| `Intl.Segmenter`          | Performs locale-sensitive text segmentation across grapheme, word, or sentence boundaries |
| `Intl.DisplayNames`       | Provides localized names for language codes, regions, currencies, and script tags         |

## Static Utility Methods

The `Intl` object provides static methods to inspect supported locales across host environments and query canonical
language tags.

| Method                              | Specification Behavior                                                                                                 |
|:------------------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| `Intl.getCanonicalLocales(locales)` | Returns an Array containing canonicalized BCP 47 language tag strings                                                  |
| `Intl.supportedValuesOf(key)`       | Returns a sorted Array of unique supported values for a given feature key (e.g., `"currency"`, `"timeZone"`, `"unit"`) |

## Use Cases

`Intl` APIs deliver locale-aware formatting across user interfaces and application data layers:

* **Currency and unit formatting:** Rendering localized monetary values using `Intl.NumberFormat` with strict currency
  parameters.
* **Locale-aware string sorting:** Sorting lists of strings accurately according to language-specific alphabetization
  rules via `Intl.Collator`.
* **Grapheme cluster segmentation:** Splitting complex text sequences containing multibyte characters or emojis
  correctly using `Intl.Segmenter`.

## Best Practices

* **Never attempt to instantiate Intl:** Access constructors and utility methods directly as static properties on `Intl`
  without using `new`.
* **Reuse Intl instances for performance:** Cache and reuse `Intl` formatter instances (such as `Intl.NumberFormat`)
  when processing large datasets, as instance initialization incurs higher overhead than re-running `.format()`.
* **Supply explicit fallback locales:** Pass explicit BCP 47 language tags (or ordered arrays of tags) rather than
  relying on host system defaults to ensure deterministic formatting output across environments.
* **Prefer Intl over custom string formatting:** Utilize native `Intl` constructors for dates, numbers, and lists
  instead of custom regular expression replacers to handle complex internationalization edge cases safely.
* **Cache compiled collators for sorting massive arrays:** Initialize `Intl.Collator` once outside sorting callback
  loops to optimize performance when processing large data grids or lists.
* **Validate BCP 47 tags with `Intl.getCanonicalLocales`:** Clean and normalize user-provided language tags before
  passing them into internationalization constructors to prevent formatting exceptions.
* **Use `Intl.Segmenter` for accurate character counts:** Prefer `Intl.Segmenter` over string `.length` or regex
  matching when counting true user-perceived grapheme clusters or handling complex emoji sequences.
* **Leverage `Intl.supportedValuesOf()` for dynamic UI choices:** Query supported calendars, time zones, or currencies
  dynamically at runtime rather than hardcoding static lists across multi-region applications.
* **Handle missing ICU data gracefully:** Provide safe fallback paths or default strings when running in minimal
  container environments that lack complete internationalization data tables.
* **Format relative times with `Intl.RelativeTimeFormat`:** Avoid manual timestamp math translation strings by using
  `Intl.RelativeTimeFormat` to support localized grammatical rules and padding naturally.
* **Specify currency display styles explicitly:** Choose between narrow symbols, codes, or full names using
  `currencyDisplay` options in `Intl.NumberFormat` to match strict UI design layouts.
* **Use `Intl.DisplayNames` for country and language selectors:** Render localized native names for dropdown menus using
  `Intl.DisplayNames` instead of mapping manual translation dictionaries.
* **Keep time zone parameters explicit in `DateTimeFormat`:** Provide a target `timeZone` property within the options
  object to ensure server-side rendering matches client expectations consistently.
* **Use `Intl.ListFormat` for natural conjunctions:** Format arrays of items with appropriate localized punctuation (
  e.g., "A, B, and C" versus "A, B y C") automatically using `Intl.ListFormat`.
* **Avoid relying on unspoken default browser locales:** Always design localized inputs and views to accept explicit
  regional settings, preventing unpredictable rendering variations in headless testing environments.
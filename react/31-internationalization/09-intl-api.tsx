/**
 * Intl API
 * ========
 *
 * The ECMAScript Internationalization API (`Intl`) provides locale-sensitive operations for
 * formatting and processing dates, numbers, currencies, lists, relative time, plural categories,
 * language-sensitive comparisons, display names, locale identifiers, and text segmentation.
 *
 * Most `Intl` APIs follow the same pattern: create an operation-specific formatter or utility with
 * a locale and options, then use its methods to produce locale-aware results.
 */

// ---------------------------------------------------------------------
// 1. Import React types and hooks
// ---------------------------------------------------------------------

import { useMemo, useState, type ChangeEvent, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 2. Define supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE" | "fr-FR";

const supportedLocales: readonly SupportedLocale[] = ["en-US", "de-DE", "fr-FR"];

// ---------------------------------------------------------------------
// 3. Define locale labels
// ---------------------------------------------------------------------

const localeLabels: Record<SupportedLocale, string> = {
  "en-US": "English (United States)",
  "de-DE": "Deutsch (Deutschland)",
  "fr-FR": "Français (France)",
};

// ---------------------------------------------------------------------
// 4. Create a basic number formatter
// ---------------------------------------------------------------------

const basicNumberFormatter = new Intl.NumberFormat("en-US");

console.log(basicNumberFormatter.format(1234567.89));

// The formatter converts the numeric value into a locale-sensitive string.
// The exact separators depend on the selected locale and formatting options.

// ---------------------------------------------------------------------
// 5. Compare number formatting across locales
// ---------------------------------------------------------------------

const numberToFormat = 1234567.89;

console.log(new Intl.NumberFormat("en-US").format(numberToFormat));
console.log(new Intl.NumberFormat("de-DE").format(numberToFormat));
console.log(new Intl.NumberFormat("fr-FR").format(numberToFormat));

// The same numeric value can use different grouping and decimal conventions.

// ---------------------------------------------------------------------
// 6. Create a date formatter
// ---------------------------------------------------------------------

const date = new Date("2026-09-29T12:00:00Z");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

console.log(dateFormatter.format(date));

// DateTimeFormat formats a Date according to locale-sensitive date conventions.

// ---------------------------------------------------------------------
// 7. Create a time formatter
// ---------------------------------------------------------------------

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(timeFormatter.format(date));

// Specifying a time zone makes the intended zone explicit instead of relying on the
// environment's local time zone.

// ---------------------------------------------------------------------
// 8. Format date and time together
// ---------------------------------------------------------------------

const dateTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(dateTimeFormatter.format(date));

// Date and time styles can be combined in one formatter.

// ---------------------------------------------------------------------
// 9. Use NumberFormat for decimal values
// ---------------------------------------------------------------------

const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

console.log(decimalFormatter.format(42));

// NumberFormat can control the number of displayed fractional digits.

// ---------------------------------------------------------------------
// 10. Format percentages
// ---------------------------------------------------------------------

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

console.log(percentageFormatter.format(0.875));

// Percentage formatting expects a fraction such as 0.875 and displays it as 87.5%.

// ---------------------------------------------------------------------
// 11. Format currencies
// ---------------------------------------------------------------------

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(currencyFormatter.format(1299.99));

// Currency formatting applies locale-specific currency symbols, placement, grouping,
// decimal conventions, and currency-specific fraction behavior.

// ---------------------------------------------------------------------
// 12. Format the same currency in different locales
// ---------------------------------------------------------------------

console.log(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(1299.99),
);

console.log(
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(1299.99),
);

console.log(
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(1299.99),
);

// The currency code identifies the monetary unit; the locale controls its presentation.

// ---------------------------------------------------------------------
// 13. Format compact numbers
// ---------------------------------------------------------------------

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

console.log(compactFormatter.format(1250000));

// Compact notation produces shorter locale-sensitive representations such as 1.3M.

// ---------------------------------------------------------------------
// 14. Format units
// ---------------------------------------------------------------------

const distanceFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "long",
});

console.log(distanceFormatter.format(42));

// NumberFormat can format supported units using locale-sensitive terminology.

// ---------------------------------------------------------------------
// 15. Use ListFormat
// ---------------------------------------------------------------------

const fruits = ["apples", "bananas", "cherries"];

const listFormatter = new Intl.ListFormat("en-US", {
  style: "long",
  type: "conjunction",
});

console.log(listFormatter.format(fruits));

// ListFormat handles locale-specific conjunctions and separators instead of manually
// joining strings with commas and "and".

// ---------------------------------------------------------------------
// 16. Format a disjunction
// ---------------------------------------------------------------------

const choiceFormatter = new Intl.ListFormat("en-US", {
  style: "long",
  type: "disjunction",
});

console.log(choiceFormatter.format(["email", "phone", "chat"]));

// A disjunction represents alternatives such as "email, phone, or chat".

// ---------------------------------------------------------------------
// 17. Format list units
// ---------------------------------------------------------------------

const measurementListFormatter = new Intl.ListFormat("en-US", {
  style: "short",
  type: "unit",
});

console.log(measurementListFormatter.format(["10 km", "20 min", "30 m"]));

// The unit type formats a sequence as a list of units rather than a grammatical
// conjunction or disjunction.

// ---------------------------------------------------------------------
// 18. Create a Collator
// ---------------------------------------------------------------------

const collator = new Intl.Collator("en-US");

console.log(collator.compare("apple", "banana"));

// Collator.compare() returns a negative number, zero, or a positive number.
// The exact numeric value should not be treated as a specific constant.

// ---------------------------------------------------------------------
// 19. Sort strings with Collator
// ---------------------------------------------------------------------

const names = ["Émile", "Alice", "Zoë", "Bob"];

const sortedNames = [...names].sort(new Intl.Collator("en-US").compare);

console.log(sortedNames);

// Collator provides locale-sensitive comparison rules suitable for sorting and searching.

// ---------------------------------------------------------------------
// 20. Use numeric collation
// ---------------------------------------------------------------------

const numericCollator = new Intl.Collator("en-US", {
  numeric: true,
});

const versions = ["item 10", "item 2", "item 1"];

console.log([...versions].sort(numericCollator.compare));

// Numeric collation treats embedded numbers according to numeric ordering rather than
// simple lexicographic ordering.

// ---------------------------------------------------------------------
// 21. Create PluralRules
// ---------------------------------------------------------------------

const pluralRules = new Intl.PluralRules("en-US");

console.log(pluralRules.select(1));
console.log(pluralRules.select(2));

// PluralRules returns a category such as "one" or "other".
// Different languages can have different plural categories.

// ---------------------------------------------------------------------
// 22. Use ordinal plural rules
// ---------------------------------------------------------------------

const ordinalRules = new Intl.PluralRules("en-US", {
  type: "ordinal",
});

console.log(ordinalRules.select(1));
console.log(ordinalRules.select(2));
console.log(ordinalRules.select(3));
console.log(ordinalRules.select(4));

// Cardinal rules describe quantities; ordinal rules describe positions such as 1st, 2nd,
// 3rd, and 4th.

// ---------------------------------------------------------------------
// 23. Create RelativeTimeFormat
// ---------------------------------------------------------------------

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
});

console.log(relativeTimeFormatter.format(-1, "day"));
console.log(relativeTimeFormatter.format(2, "day"));

// Negative values normally represent past relative time and positive values represent
// future relative time.

// ---------------------------------------------------------------------
// 24. Use automatic relative-time wording
// ---------------------------------------------------------------------

const automaticRelativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

console.log(automaticRelativeTimeFormatter.format(-1, "day"));
console.log(automaticRelativeTimeFormatter.format(1, "day"));

// numeric: "auto" allows locale-specific special terms such as "yesterday" or "tomorrow".

// ---------------------------------------------------------------------
// 25. Create DisplayNames
// ---------------------------------------------------------------------

const languageDisplayNames = new Intl.DisplayNames("en-US", {
  type: "language",
});

console.log(languageDisplayNames.of("de"));
console.log(languageDisplayNames.of("fr"));

// DisplayNames converts language identifiers into localized human-readable names.

// ---------------------------------------------------------------------
// 26. Display region names
// ---------------------------------------------------------------------

const regionDisplayNames = new Intl.DisplayNames("en-US", {
  type: "region",
});

console.log(regionDisplayNames.of("US"));
console.log(regionDisplayNames.of("DE"));

// Region identifiers such as "US" and "DE" can be displayed in the selected locale.

// ---------------------------------------------------------------------
// 27. Localize display names
// ---------------------------------------------------------------------

const germanRegionNames = new Intl.DisplayNames("de-DE", {
  type: "region",
});

console.log(germanRegionNames.of("US"));
console.log(germanRegionNames.of("FR"));

// The same identifier can receive a different human-readable name depending on locale.

// ---------------------------------------------------------------------
// 28. Use Intl.Locale
// ---------------------------------------------------------------------

const locale = new Intl.Locale("de-DE");

console.log(locale.language);
console.log(locale.region);

// Intl.Locale represents and provides information about a Unicode BCP 47 locale identifier.

// ---------------------------------------------------------------------
// 29. Inspect locale components
// ---------------------------------------------------------------------

const detailedLocale = new Intl.Locale("sr-Latn-RS");

console.log(detailedLocale.language);
console.log(detailedLocale.script);
console.log(detailedLocale.region);

// A locale can contain language, script, region, and other subtags.

// ---------------------------------------------------------------------
// 30. Canonicalize locale identifiers
// ---------------------------------------------------------------------

const canonicalLocales = Intl.getCanonicalLocales(["EN-us", "de-de"]);

console.log(canonicalLocales);

// getCanonicalLocales() returns canonicalized locale identifiers.

// ---------------------------------------------------------------------
// 31. Detect supported locales for an operation
// ---------------------------------------------------------------------

const supportedDateLocales = Intl.DateTimeFormat.supportedLocalesOf(["en-US", "de-DE", "fr-FR"]);

console.log(supportedDateLocales);

// supportedLocalesOf() reports requested locales supported for the specific Intl operation.
// Support is operation-specific rather than one universal list for every Intl feature.

// ---------------------------------------------------------------------
// 32. Inspect resolved formatter options
// ---------------------------------------------------------------------

const resolvedNumberFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(resolvedNumberFormatter.resolvedOptions());

// resolvedOptions() exposes the effective locale and formatter configuration chosen by the runtime.

// ---------------------------------------------------------------------
// 33. Inspect resolved DateTimeFormat options
// ---------------------------------------------------------------------

const resolvedDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

console.log(resolvedDateFormatter.resolvedOptions());

// resolvedOptions() is useful when inspecting which locale and options the formatter actually uses.

// ---------------------------------------------------------------------
// 34. Use formatToParts
// ---------------------------------------------------------------------

const partsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const numberParts = partsFormatter.formatToParts(1234.56);

console.log(numberParts);

// formatToParts() returns structured pieces instead of only one final string.

// ---------------------------------------------------------------------
// 35. Render formatted parts selectively
// ---------------------------------------------------------------------

const dateParts = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).formatToParts(date);

console.log(
  dateParts
    .filter((part) => part.type !== "literal")
    .map((part) => `${part.type}=${part.value}`)
    .join(" | "),
);

// Structured parts can be inspected or combined with application-specific markup.

// ---------------------------------------------------------------------
// 36. Avoid manually parsing localized strings
// ---------------------------------------------------------------------

const localizedPrice = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
}).format(1234.56);

console.log(localizedPrice);

// Localized output is presentation data. Applications should not depend on parsing the
// formatted string back into its original numeric representation.

// ---------------------------------------------------------------------
// 37. Use a formatter for repeated operations
// ---------------------------------------------------------------------

const repeatedNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const values = [10.25, 20.5, 30.75];

console.log(values.map((value) => repeatedNumberFormatter.format(value)));

// Creating one formatter and reusing it makes the formatting intent explicit and avoids
// repeatedly constructing equivalent formatter objects.

// ---------------------------------------------------------------------
// 38. Memoize formatters in React
// ---------------------------------------------------------------------

interface NumberDisplayProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const NumberDisplay: FC<NumberDisplayProps> = ({ locale, value }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  return <output>{formatter.format(value)}</output>;
};

// The formatter is recreated when its locale changes rather than on every render.

// ---------------------------------------------------------------------
// 39. Memoize multiple formatters
// ---------------------------------------------------------------------

interface FormattedSummaryProps {
  readonly locale: SupportedLocale;
  readonly amount: number;
  readonly date: Date;
}

const FormattedSummary: FC<FormattedSummaryProps> = ({ locale, amount, date }): ReactElement => {
  const formatters = useMemo(
    () => ({
      number: new Intl.NumberFormat(locale),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
      date: new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
      }),
    }),
    [locale],
  );

  return (
    <div>
      <p>Number: {formatters.number.format(amount)}</p>
      <p>Currency: {formatters.currency.format(amount)}</p>
      <p>Date: {formatters.date.format(date)}</p>
    </div>
  );
};

// Multiple formatters can share the same locale and be recreated together when that locale changes.

// ---------------------------------------------------------------------
// 40. Keep locale separate from formatting options
// ---------------------------------------------------------------------

interface PriceProps {
  readonly locale: SupportedLocale;
  readonly currency: string;
  readonly value: number;
}

const Price: FC<PriceProps> = ({ locale, currency, value }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.format(value)}</output>;
};

// The locale determines regional presentation conventions.
// The currency determines the monetary unit being represented.

// ---------------------------------------------------------------------
// 41. Use locale arrays for fallback negotiation
// ---------------------------------------------------------------------

const preferredLocales = ["fr-CA", "fr-FR", "en-US"];

const negotiatedFormatter = new Intl.NumberFormat(preferredLocales);

console.log(negotiatedFormatter.resolvedOptions().locale);

// Intl constructors accept locale lists and negotiate an appropriate supported locale.

// ---------------------------------------------------------------------
// 42. Use navigator.languages in a browser
// ---------------------------------------------------------------------

const browserPreferredLocales = typeof navigator !== "undefined" ? navigator.languages : [];

console.log(browserPreferredLocales);

// navigator.languages represents the browser's ordered language preferences.
// Guarding the browser global keeps this module safe to evaluate outside a browser.

// ---------------------------------------------------------------------
// 43. Prefer an explicit application locale
// ---------------------------------------------------------------------

const applicationLocale: SupportedLocale = "en-US";

const applicationFormatter = new Intl.NumberFormat(applicationLocale);

console.log(applicationFormatter.format(123456.78));

// Applications normally maintain an explicit UI locale rather than allowing every component
// to independently choose its own locale.

// ---------------------------------------------------------------------
// 44. Format with a specific calendar
// ---------------------------------------------------------------------

const calendarFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  calendar: "gregory",
});

console.log(calendarFormatter.format(date));

// Intl date formatting can use locale-sensitive calendar systems when supported by the runtime.

// ---------------------------------------------------------------------
// 45. Format with a specific numbering system
// ---------------------------------------------------------------------

const arabicDigitsFormatter = new Intl.NumberFormat("ar-EG", {
  numberingSystem: "arab",
});

console.log(arabicDigitsFormatter.format(123456.78));

// Numbering systems affect the representation of digits and other numeric symbols.

// ---------------------------------------------------------------------
// 46. Format without assuming a specific digit system
// ---------------------------------------------------------------------

const localeNumberFormatter = new Intl.NumberFormat("ar-EG");

console.log(localeNumberFormatter.format(123456.78));

// The locale can provide its own default numbering conventions.
// Explicit options can override those defaults when appropriate.

// ---------------------------------------------------------------------
// 47. Use ListFormat with localized values
// ---------------------------------------------------------------------

const localizedListExamples: Record<SupportedLocale, readonly string[]> = {
  "en-US": ["Apple", "Banana", "Cherry"],
  "de-DE": ["Apfel", "Banane", "Kirsche"],
  "fr-FR": ["Pomme", "Banane", "Cerise"],
};

const localizedListFormatter = new Intl.ListFormat("fr-FR", {
  type: "conjunction",
  style: "long",
});

console.log(localizedListFormatter.format(localizedListExamples["fr-FR"]));

// Intl formats the grammatical relationship between the supplied values.
// It does not translate the values themselves.

// ---------------------------------------------------------------------
// 48. Separate translation from Intl formatting
// ---------------------------------------------------------------------

const translatedMessage = "You have";
const itemCount = new Intl.NumberFormat("en-US").format(3);

console.log(`${translatedMessage} ${itemCount} items`);

// Application translations provide human-authored text.
// Intl formats structured values such as numbers, dates, and times.

// ---------------------------------------------------------------------
// 49. Use PluralRules with translated messages
// ---------------------------------------------------------------------

const count = 2;
const category = new Intl.PluralRules("en-US").select(count);

const messages = {
  one: "item",
  other: "items",
};

console.log(`${count} ${messages[category]}`);

// PluralRules selects a grammatical category.
// A translation system can then provide the corresponding localized message.

// ---------------------------------------------------------------------
// 50. Do not assume English plural categories
// ---------------------------------------------------------------------

const englishCategories = new Intl.PluralRules("en-US").resolvedOptions();
const arabicCategories = new Intl.PluralRules("ar").resolvedOptions();

console.log(englishCategories);
console.log(arabicCategories);

// Languages can have substantially different plural systems.
// Translation resources should be designed around the target language's categories.

// ---------------------------------------------------------------------
// 51. Format relative time in a reusable function
// ---------------------------------------------------------------------

const formatRelativeTime = (locale: SupportedLocale, value: number, unit: Intl.RelativeTimeFormatUnit): string => {
  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(value, unit);
};

console.log(formatRelativeTime("en-US", -1, "day"));
console.log(formatRelativeTime("de-DE", 2, "day"));

// RelativeTimeFormat handles the localized wording and grammatical form for the supplied value.

// ---------------------------------------------------------------------
// 52. Format localized language names
// ---------------------------------------------------------------------

const formatLanguageName = (locale: SupportedLocale, languageCode: string): string => {
  return (
    new Intl.DisplayNames(locale, {
      type: "language",
    }).of(languageCode) ?? languageCode
  );
};

console.log(formatLanguageName("en-US", "de"));
console.log(formatLanguageName("de-DE", "de"));
console.log(formatLanguageName("fr-FR", "de"));

// DisplayNames is useful for locale selectors because language identifiers can be shown
// using human-readable names in the currently selected UI language.

// ---------------------------------------------------------------------
// 53. Build a locale selector
// ---------------------------------------------------------------------

interface LocaleSelectorProps {
  readonly locale: SupportedLocale;
  readonly onChange: (locale: SupportedLocale) => void;
}

const LocaleSelector: FC<LocaleSelectorProps> = ({ locale, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as SupportedLocale);
  };

  return (
    <label>
      Language
      <select value={locale} onChange={handleChange}>
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeLabels[supportedLocale]}
          </option>
        ))}
      </select>
    </label>
  );
};

// The selected locale can be passed into every Intl formatter used by the UI.

// ---------------------------------------------------------------------
// 54. Build a localized data summary
// ---------------------------------------------------------------------

interface LocalizedDataProps {
  readonly locale: SupportedLocale;
}

const LocalizedData: FC<LocalizedDataProps> = ({ locale }): ReactElement => {
  const amount = 1234567.89;
  const eventDate = new Date("2026-09-29T12:00:00Z");

  const formatters = useMemo(
    () => ({
      number: new Intl.NumberFormat(locale),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
      date: new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
      relative: new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
      list: new Intl.ListFormat(locale, {
        type: "conjunction",
        style: "long",
      }),
    }),
    [locale],
  );

  return (
    <section>
      <p>Number: {formatters.number.format(amount)}</p>
      <p>Currency: {formatters.currency.format(amount)}</p>
      <p>Date: {formatters.date.format(eventDate)}</p>
      <p>Relative: {formatters.relative.format(-1, "day")}</p>
      <p>List: {formatters.list.format(["Apple", "Banana", "Cherry"])}</p>
    </section>
  );
};

// All structured values use the same application locale.
// The strings supplied to ListFormat remain application content and are not translated by Intl.

// ---------------------------------------------------------------------
// 55. Keep locale state in the application
// ---------------------------------------------------------------------

const LocaleStateExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <div>
      <LocaleSelector locale={locale} onChange={setLocale} />
      <LocalizedData locale={locale} />
    </div>
  );
};

// Changing the locale state causes components that consume it to render using the new locale.

// ---------------------------------------------------------------------
// 56. Use locale-aware sorting in React
// ---------------------------------------------------------------------

interface LocalizedListProps {
  readonly locale: SupportedLocale;
}

const LocalizedList: FC<LocalizedListProps> = ({ locale }): ReactElement => {
  const values = ["äpfel", "Apfel", "banana", "Öl"];

  const sortedValues = useMemo(() => [...values].sort(new Intl.Collator(locale).compare), [locale]);

  return (
    <ul>
      {sortedValues.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
};

// Sorting should use the same locale semantics as the rest of the relevant user interface.

// ---------------------------------------------------------------------
// 57. Use formatToParts for accessible markup
// ---------------------------------------------------------------------

interface CurrencyPartsProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const CurrencyParts: FC<CurrencyPartsProps> = ({ locale, value }): ReactElement => {
  const parts = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }).formatToParts(value),
    [locale, value],
  );

  return (
    <span>
      {parts.map((part, index) => (
        <span key={`${part.type}-${index}`}>{part.value}</span>
      ))}
    </span>
  );
};

// formatToParts() can be useful when different portions of a formatted value need
// separate markup or behavior.

// ---------------------------------------------------------------------
// 58. Use a locale as the source for formatter configuration
// ---------------------------------------------------------------------

interface FormatterOptionsExampleProps {
  readonly locale: SupportedLocale;
}

const FormatterOptionsExample: FC<FormatterOptionsExampleProps> = ({ locale }): ReactElement => {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  };

  const formatter = useMemo(() => new Intl.NumberFormat(locale, options), [locale]);

  return <output>{formatter.format(1499.5)}</output>;
};

// Formatting options describe how the value should be presented.
// They should not be confused with the locale itself.

// ---------------------------------------------------------------------
// 59. Avoid locale-sensitive string construction
// ---------------------------------------------------------------------

const unsafeManualPrice = `€ ${1234.56}`;

console.log(unsafeManualPrice);

// Manually adding currency symbols or separators does not provide locale-aware formatting.

// ---------------------------------------------------------------------
// 60. Avoid manual date formatting
// ---------------------------------------------------------------------

const manualDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

console.log(manualDate);

// Manual date construction can ignore locale conventions, calendar settings, and other
// formatting requirements.

// ---------------------------------------------------------------------
// 61. Use Intl instead of toFixed for localized presentation
// ---------------------------------------------------------------------

const rawFixedNumber = (1234.5).toFixed(2);
const localizedFixedNumber = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(1234.5);

console.log(rawFixedNumber);
console.log(localizedFixedNumber);

// toFixed() controls decimal precision but does not perform locale-sensitive formatting.

// ---------------------------------------------------------------------
// 62. Keep data types separate from presentation strings
// ---------------------------------------------------------------------

const productPrice = 1299.99;

const formattedProductPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(productPrice);

console.log(productPrice);
console.log(formattedProductPrice);

// Keep the original number as numeric data.
// Convert it to a localized string only when producing presentation output.

// ---------------------------------------------------------------------
// 63. Use explicit time zones for deterministic output
// ---------------------------------------------------------------------

const deterministicDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(deterministicDateFormatter.format(date));

// Explicit time zones are useful when output must represent a specific zone rather than
// whichever zone happens to be configured on the user's device.

// ---------------------------------------------------------------------
// 64. Remember that formatter output can vary
// ---------------------------------------------------------------------

const output = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(1234.5);

console.log(output);

// Locale-sensitive output can vary with locale data and implementation details.
// Tests should avoid assuming that every formatting environment produces identical strings
// unless the environment and expected locale data are deliberately controlled.

// ---------------------------------------------------------------------
// 65. Test structured Intl behavior
// ---------------------------------------------------------------------

const testFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const testParts = testFormatter.formatToParts(1234.5);

console.log(testParts.some((part) => part.type === "currency"));
console.log(testParts.some((part) => part.type === "integer"));

// Structured output can be easier to test semantically than relying only on one exact string.

// ---------------------------------------------------------------------
// 66. Reuse locale-aware utilities
// ---------------------------------------------------------------------

const createFormatters = (locale: SupportedLocale) => ({
  number: new Intl.NumberFormat(locale),
  currency: new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }),
  date: new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }),
  list: new Intl.ListFormat(locale, {
    type: "conjunction",
  }),
  relative: new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }),
  collator: new Intl.Collator(locale),
});

// A centralized factory can keep formatter configuration consistent across related UI code.

// ---------------------------------------------------------------------
// 67. Use the formatter factory
// ---------------------------------------------------------------------

const exampleFormatters = createFormatters("en-US");

console.log(exampleFormatters.number.format(12345.67));
console.log(exampleFormatters.currency.format(12345.67));
console.log(exampleFormatters.date.format(date));
console.log(exampleFormatters.list.format(["one", "two", "three"]));
console.log(exampleFormatters.relative.format(-2, "day"));

// Each formatter still performs one specific internationalization operation.

// ---------------------------------------------------------------------
// 68. Build an integrated Intl example
// ---------------------------------------------------------------------

const IntlApiExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const formatters = useMemo(
    () => ({
      number: new Intl.NumberFormat(locale),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
      date: new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
      relative: new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
      list: new Intl.ListFormat(locale, {
        style: "long",
        type: "conjunction",
      }),
      collator: new Intl.Collator(locale, {
        numeric: true,
      }),
      languageNames: new Intl.DisplayNames(locale, {
        type: "language",
      }),
    }),
    [locale],
  );

  const products = ["item 10", "item 2", "item 1"];
  const sortedProducts = [...products].sort(formatters.collator.compare);

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  const eventDate = new Date("2026-09-29T12:00:00Z");

  return (
    <section>
      <h2>Intl API</h2>

      <label>
        Locale
        <select value={locale} onChange={handleLocaleChange}>
          {supportedLocales.map((supportedLocale) => (
            <option key={supportedLocale} value={supportedLocale}>
              {localeLabels[supportedLocale]}
            </option>
          ))}
        </select>
      </label>

      <dl>
        <dt>Number</dt>
        <dd>{formatters.number.format(1234567.89)}</dd>

        <dt>Currency</dt>
        <dd>{formatters.currency.format(1299.99)}</dd>

        <dt>Date</dt>
        <dd>{formatters.date.format(eventDate)}</dd>

        <dt>Relative time</dt>
        <dd>{formatters.relative.format(-1, "day")}</dd>

        <dt>List</dt>
        <dd>{formatters.list.format(["Apple", "Banana", "Cherry"])}</dd>

        <dt>Language name</dt>
        <dd>{formatters.languageNames.of("de")}</dd>
      </dl>

      <h3>Locale-aware sorting</h3>

      <ul>
        {sortedProducts.map((product) => (
          <li key={product}>{product}</li>
        ))}
      </ul>
    </section>
  );
};

// This example keeps the locale in React state and derives all Intl formatters from that state.
// A locale change therefore updates every locale-sensitive operation together.

// ---------------------------------------------------------------------
// 69. Understand the Intl API as a collection of specialized tools
// ---------------------------------------------------------------------

// Intl.DateTimeFormat      -> dates and times
// Intl.NumberFormat        -> numbers, currencies, percentages, and units
// Intl.ListFormat          -> localized lists
// Intl.RelativeTimeFormat  -> relative time
// Intl.Collator             -> locale-sensitive comparison and sorting
// Intl.PluralRules          -> plural categories
// Intl.DisplayNames         -> localized names for language, region, script, and related identifiers
// Intl.Locale               -> locale identifiers and locale information
// Intl.Segmenter            -> locale-sensitive text segmentation
// Intl.getCanonicalLocales  -> canonical locale identifiers
// Intl.supportedValuesOf    -> supported Intl values for selected categories

// The APIs are specialized rather than one generic formatter for every internationalization task.

// ---------------------------------------------------------------------
// 70. Distinguish Intl from translation systems
// ---------------------------------------------------------------------

const formattedCount = new Intl.NumberFormat("en-US").format(5);
const translatedText = "You have";

console.log(`${translatedText} ${formattedCount} items`);

// Intl formats structured values according to locale conventions.
// A translation system supplies application-authored language content.
// Production internationalized applications commonly use both.

// ---------------------------------------------------------------------
// 71. Choose the correct Intl API
// ---------------------------------------------------------------------

const apiExamples = {
  date: new Intl.DateTimeFormat("en-US").format(date),
  number: new Intl.NumberFormat("en-US").format(1234.56),
  currency: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(1234.56),
  list: new Intl.ListFormat("en-US").format(["A", "B", "C"]),
  relative: new Intl.RelativeTimeFormat("en-US").format(-1, "day"),
  plural: new Intl.PluralRules("en-US").select(2),
  compare: new Intl.Collator("en-US").compare("a", "b"),
  language: new Intl.DisplayNames("en-US", {
    type: "language",
  }).of("de"),
};

console.log(apiExamples);

// Selecting the operation-specific Intl API keeps internationalization behavior explicit
// and avoids implementing locale-sensitive rules manually.

// ---------------------------------------------------------------------
// 72. Use Intl as a presentation boundary
// ---------------------------------------------------------------------

interface OrderSummaryProps {
  readonly locale: SupportedLocale;
  readonly total: number;
  readonly createdAt: Date;
}

const OrderSummary: FC<OrderSummaryProps> = ({ locale, total, createdAt }): ReactElement => {
  const formatter = useMemo(
    () => ({
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
      date: new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
      }),
    }),
    [locale],
  );

  return (
    <article>
      <p>Total: {formatter.currency.format(total)}</p>
      <p>Created: {formatter.date.format(createdAt)}</p>
    </article>
  );
};

// The component receives typed application data and converts it to localized presentation
// only at the rendering boundary.

// ---------------------------------------------------------------------
// 73. Handle unsupported DisplayNames results
// ---------------------------------------------------------------------

const displayName = new Intl.DisplayNames("en-US", {
  type: "language",
}).of("xx");

console.log(displayName ?? "Unknown language");

// APIs that return optional values should be handled without assuming that every requested
// identifier produces a display name.

// ---------------------------------------------------------------------
// 74. Handle locale-sensitive comparison correctly
// ---------------------------------------------------------------------

const comparison = new Intl.Collator("de-DE").compare("ä", "z");

if (comparison < 0) {
  console.log("The first value sorts before the second.");
} else if (comparison > 0) {
  console.log("The first value sorts after the second.");
} else {
  console.log("The values compare as equivalent.");
}

// Compare the sign of Collator.compare(), not a particular negative or positive number.

// ---------------------------------------------------------------------
// 75. Keep locale and language distinct concepts
// ---------------------------------------------------------------------

const languageOnly = new Intl.Locale("en");
const regionalEnglish = new Intl.Locale("en-US");

console.log(languageOnly.toString());
console.log(regionalEnglish.toString());

// "en" identifies a language while "en-US" identifies a language with a regional variant.
// Applications should use the level of locale specificity required by their behavior.

// ---------------------------------------------------------------------
// 76. Use locale-sensitive formatting instead of hardcoded conventions
// ---------------------------------------------------------------------

const invoiceAmount = 9876.54;
const invoiceDate = new Date("2026-09-29T12:00:00Z");

const invoiceFormatter = {
  amount: new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }),
  date: new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "UTC",
  }),
};

console.log(invoiceFormatter.amount.format(invoiceAmount));
console.log(invoiceFormatter.date.format(invoiceDate));

// Locale-sensitive formatters keep regional conventions in the Intl layer instead of
// scattering manual formatting rules throughout the application.

// ---------------------------------------------------------------------
// 77. Avoid constructing formatters unnecessarily during render
// ---------------------------------------------------------------------

const OptimizedPrice: FC<PriceProps> = ({ locale, currency, value }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.format(value)}</output>;
};

// For components that render frequently, memoizing formatter construction can make the
// formatting dependency explicit and avoid unnecessary formatter creation.

// ---------------------------------------------------------------------
// 78. Understand formatter dependencies
// ---------------------------------------------------------------------

// A formatter should be recreated when any configuration that affects its behavior changes:
//
// locale       -> regional and language conventions
// currency     -> monetary unit
// options      -> formatting behavior
// timeZone     -> date/time zone representation
//
// React dependencies should therefore reflect the formatter configuration.

// ---------------------------------------------------------------------
// 79. Integrate locale state with several Intl operations
// ---------------------------------------------------------------------

const InternationalizedDashboard: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const formatter = useMemo(
    () => ({
      number: new Intl.NumberFormat(locale),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
      }),
      date: new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
      }),
      list: new Intl.ListFormat(locale, {
        type: "conjunction",
      }),
      relative: new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    }),
    [locale],
  );

  return (
    <main>
      <label>
        Display language
        <select value={locale} onChange={(event) => setLocale(event.target.value as SupportedLocale)}>
          {supportedLocales.map((supportedLocale) => (
            <option key={supportedLocale} value={supportedLocale}>
              {localeLabels[supportedLocale]}
            </option>
          ))}
        </select>
      </label>

      <dl>
        <dt>Visitors</dt>
        <dd>{formatter.number.format(1234567)}</dd>

        <dt>Revenue</dt>
        <dd>{formatter.currency.format(98765.43)}</dd>

        <dt>Updated</dt>
        <dd>{formatter.relative.format(-1, "hour")}</dd>

        <dt>Release date</dt>
        <dd>{formatter.date.format(new Date("2026-09-29T12:00:00Z"))}</dd>

        <dt>Categories</dt>
        <dd>{formatter.list.format(["Products", "Orders", "Customers"])}</dd>
      </dl>
    </main>
  );
};

// The locale is one application-level input shared by several specialized Intl operations.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default InternationalizedDashboard;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Intl` is the ECMAScript Internationalization API for locale-sensitive operations.
// - `Intl.DateTimeFormat` formats dates and times according to locale and options.
// - `Intl.NumberFormat` formats numbers, currencies, percentages, and supported units.
// - `Intl.ListFormat` formats lists using locale-specific separators and conjunctions.
// - `Intl.RelativeTimeFormat` formats values such as yesterday, today, and future dates.
// - `Intl.Collator` provides locale-sensitive string comparison and sorting.
// - `Intl.PluralRules` selects language-specific plural categories.
// - `Intl.DisplayNames` converts language, region, script, and related identifiers into localized names.
// - `Intl.Locale` represents and exposes information about BCP 47 locale identifiers.
// - `Intl.getCanonicalLocales()` canonicalizes locale identifiers.
// - `supportedLocalesOf()` reports requested locales supported by a specific Intl operation.
// - `formatToParts()` exposes structured pieces of formatted output for custom rendering.
// - Formatter instances should be configured with the locale and operation-specific options.
// - React applications can keep the active locale in state and derive Intl formatters from it.
// - Intl formats structured values; application translation systems provide translated application text.
// - Locale-sensitive formatting should replace manually implemented date, number, list, and sorting rules.

/**
 * Number Localization
 * ====================
 *
 * Number localization is the process of presenting numeric values according to locale-specific
 * conventions such as decimal separators, grouping separators, digit systems, percentages, units,
 * compact notation, signs, and significant-digit rules.
 *
 * The `Intl.NumberFormat` API provides locale-sensitive numeric formatting while keeping the
 * underlying value as a JavaScript number.
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

const localeLabels: Record<SupportedLocale, string> = {
  "en-US": "English (United States)",
  "de-DE": "Deutsch (Deutschland)",
  "fr-FR": "Français (France)",
};

// ---------------------------------------------------------------------
// 3. Format a basic number
// ---------------------------------------------------------------------

const value = 1234567.89;

const defaultFormatter = new Intl.NumberFormat("en-US");

console.log(defaultFormatter.format(value));

// NumberFormat converts a number into a locale-sensitive string.

// ---------------------------------------------------------------------
// 4. Compare number formatting across locales
// ---------------------------------------------------------------------

console.log(new Intl.NumberFormat("en-US").format(value));
console.log(new Intl.NumberFormat("de-DE").format(value));
console.log(new Intl.NumberFormat("fr-FR").format(value));

// The numeric value remains the same while its presentation changes with the locale.

// ---------------------------------------------------------------------
// 5. Use grouping separators
// ---------------------------------------------------------------------

const groupedFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
});

console.log(groupedFormatter.format(123456789));

// Grouping improves readability for large numbers.
// The actual grouping characters are determined by the locale.

// ---------------------------------------------------------------------
// 6. Disable grouping
// ---------------------------------------------------------------------

const ungroupedFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: false,
});

console.log(ungroupedFormatter.format(123456789));

// useGrouping can be disabled when compact or ungrouped presentation is required.

// ---------------------------------------------------------------------
// 7. Control minimum fraction digits
// ---------------------------------------------------------------------

const minimumFractionFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});

console.log(minimumFractionFormatter.format(42));
console.log(minimumFractionFormatter.format(42.5));

// Missing fractional digits are added until the minimum is satisfied.

// ---------------------------------------------------------------------
// 8. Control maximum fraction digits
// ---------------------------------------------------------------------

const maximumFractionFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

console.log(maximumFractionFormatter.format(42.567));

// Values with more fractional digits are rounded according to the formatter's rules.

// ---------------------------------------------------------------------
// 9. Set both fraction limits
// ---------------------------------------------------------------------

const fractionFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

console.log(fractionFormatter.format(42));
console.log(fractionFormatter.format(42.567));

// Setting both limits is useful when a fixed number of decimal places is required.

// ---------------------------------------------------------------------
// 10. Format percentages
// ---------------------------------------------------------------------

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
});

console.log(percentageFormatter.format(0.75));

// Percentage formatting interprets 0.75 as 75%, not as the literal number 0.75%.

// ---------------------------------------------------------------------
// 11. Control percentage precision
// ---------------------------------------------------------------------

const precisePercentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

console.log(precisePercentageFormatter.format(0.756));

// Fraction-digit options control the precision of the formatted percentage.

// ---------------------------------------------------------------------
// 12. Format percentages across locales
// ---------------------------------------------------------------------

console.log(
  new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(0.875),
);

console.log(
  new Intl.NumberFormat("de-DE", {
    style: "percent",
  }).format(0.875),
);

console.log(
  new Intl.NumberFormat("fr-FR", {
    style: "percent",
  }).format(0.875),
);

// Locale-sensitive formatting controls separators, spacing, and other presentation conventions.

// ---------------------------------------------------------------------
// 13. Format currency values
// ---------------------------------------------------------------------

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(currencyFormatter.format(1299.99));

// The currency option identifies the monetary unit while the locale controls presentation.

// ---------------------------------------------------------------------
// 14. Format different currencies
// ---------------------------------------------------------------------

const currencies = ["USD", "EUR", "GBP"] as const;

for (const currency of currencies) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  console.log(currency, formatter.format(1299.99));
}

// Currency codes use ISO 4217 identifiers supported by the runtime.

// ---------------------------------------------------------------------
// 15. Format the same currency across locales
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

// The same currency can be displayed differently because currency and locale are separate inputs.

// ---------------------------------------------------------------------
// 16. Use currencyDisplay
// ---------------------------------------------------------------------

const currencyDisplayOptions: readonly Intl.NumberFormatOptions["currencyDisplay"][] = ["symbol", "code", "name"];

for (const currencyDisplay of currencyDisplayOptions) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay,
  });

  console.log(currencyDisplay, formatter.format(1299.99));
}

// currencyDisplay controls whether the currency appears as a symbol, code, or localized name.

// ---------------------------------------------------------------------
// 17. Use currencySign
// ---------------------------------------------------------------------

const accountingFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencySign: "accounting",
});

console.log(accountingFormatter.format(-1299.99));

// Accounting notation can use locale-specific conventions for negative monetary values.

// ---------------------------------------------------------------------
// 18. Format units
// ---------------------------------------------------------------------

const kilometerFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
});

console.log(kilometerFormatter.format(42));

// Unit formatting attaches locale-sensitive unit presentation to a numeric value.

// ---------------------------------------------------------------------
// 19. Use a long unit display
// ---------------------------------------------------------------------

const longUnitFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "long",
});

console.log(longUnitFormatter.format(42));

// unitDisplay can use long, short, or narrow representations.

// ---------------------------------------------------------------------
// 20. Use a short unit display
// ---------------------------------------------------------------------

const shortUnitFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "short",
});

console.log(shortUnitFormatter.format(42));

// Short units are useful when space is limited.

// ---------------------------------------------------------------------
// 21. Use a narrow unit display
// ---------------------------------------------------------------------

const narrowUnitFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "narrow",
});

console.log(narrowUnitFormatter.format(42));

// Narrow units are designed for compact presentation.

// ---------------------------------------------------------------------
// 22. Format speed
// ---------------------------------------------------------------------

const speedFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer-per-hour",
  unitDisplay: "long",
});

console.log(speedFormatter.format(90));

// Intl supports compound units provided by the NumberFormat specification and runtime.

// ---------------------------------------------------------------------
// 23. Format temperature
// ---------------------------------------------------------------------

const temperatureFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "celsius",
  unitDisplay: "short",
});

console.log(temperatureFormatter.format(21));

// Unit formatting is locale-sensitive, but the numeric measurement itself is not converted.

// ---------------------------------------------------------------------
// 24. Distinguish formatting from conversion
// ---------------------------------------------------------------------

const celsius = 21;

const formattedCelsius = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "celsius",
}).format(celsius);

console.log(formattedCelsius);

// Intl.NumberFormat formats the supplied value.
// It does not convert Celsius to Fahrenheit or kilometers to miles.

// ---------------------------------------------------------------------
// 25. Format compact numbers
// ---------------------------------------------------------------------

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});

console.log(compactFormatter.format(1250000));

// Compact notation creates shorter representations such as 1.3M according to locale rules.

// ---------------------------------------------------------------------
// 26. Use compact long notation
// ---------------------------------------------------------------------

const compactLongFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "long",
});

console.log(compactLongFormatter.format(1250000));

// compactDisplay controls whether compact notation uses shorter or longer wording.

// ---------------------------------------------------------------------
// 27. Use compact notation across locales
// ---------------------------------------------------------------------

console.log(
  new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(1250000),
);

console.log(
  new Intl.NumberFormat("de-DE", {
    notation: "compact",
  }).format(1250000),
);

console.log(
  new Intl.NumberFormat("fr-FR", {
    notation: "compact",
  }).format(1250000),
);

// Compact notation is locale-sensitive just like ordinary number formatting.

// ---------------------------------------------------------------------
// 28. Use decimal notation
// ---------------------------------------------------------------------

const decimalFormatter = new Intl.NumberFormat("en-US", {
  notation: "standard",
});

console.log(decimalFormatter.format(1234567.89));

// Standard notation is the normal decimal representation.

// ---------------------------------------------------------------------
// 29. Use scientific notation
// ---------------------------------------------------------------------

const scientificFormatter = new Intl.NumberFormat("en-US", {
  notation: "scientific",
});

console.log(scientificFormatter.format(1234567.89));

// Scientific notation represents the value using a coefficient and exponent.

// ---------------------------------------------------------------------
// 30. Use engineering notation
// ---------------------------------------------------------------------

const engineeringFormatter = new Intl.NumberFormat("en-US", {
  notation: "engineering",
});

console.log(engineeringFormatter.format(1234567.89));

// Engineering notation uses exponents that are multiples of three.

// ---------------------------------------------------------------------
// 31. Control significant digits
// ---------------------------------------------------------------------

const significantDigitsFormatter = new Intl.NumberFormat("en-US", {
  minimumSignificantDigits: 4,
  maximumSignificantDigits: 4,
});

console.log(significantDigitsFormatter.format(1234.567));
console.log(significantDigitsFormatter.format(0.01234567));

// Significant-digit options control precision based on significant digits rather than
// a fixed number of digits after the decimal point.

// ---------------------------------------------------------------------
// 32. Use minimum significant digits
// ---------------------------------------------------------------------

const minimumSignificantDigitsFormatter = new Intl.NumberFormat("en-US", {
  minimumSignificantDigits: 3,
});

console.log(minimumSignificantDigitsFormatter.format(12));

// Additional digits can be displayed to satisfy the requested minimum precision.

// ---------------------------------------------------------------------
// 33. Format positive and negative signs
// ---------------------------------------------------------------------

const signFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "always",
});

console.log(signFormatter.format(42));
console.log(signFormatter.format(-42));
console.log(signFormatter.format(0));

// signDisplay controls when an explicit plus or minus sign is shown.

// ---------------------------------------------------------------------
// 34. Hide positive signs
// ---------------------------------------------------------------------

const negativeOnlySignFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "exceptZero",
});

console.log(negativeOnlySignFormatter.format(42));
console.log(negativeOnlySignFormatter.format(-42));
console.log(negativeOnlySignFormatter.format(0));

// exceptZero displays signs for positive and negative values but not zero.

// ---------------------------------------------------------------------
// 35. Handle negative zero
// ---------------------------------------------------------------------

const negativeZeroFormatter = new Intl.NumberFormat("en-US", {
  signDisplay: "always",
});

console.log(negativeZeroFormatter.format(-0));

// JavaScript distinguishes positive and negative zero.
// Intl.NumberFormat can expose that distinction depending on signDisplay.

// ---------------------------------------------------------------------
// 36. Format NaN
// ---------------------------------------------------------------------

const nanFormatter = new Intl.NumberFormat("en-US");

console.log(nanFormatter.format(Number.NaN));

// Intl provides a locale-sensitive representation for NaN.

// ---------------------------------------------------------------------
// 37. Format Infinity
// ---------------------------------------------------------------------

const infinityFormatter = new Intl.NumberFormat("en-US");

console.log(infinityFormatter.format(Infinity));
console.log(infinityFormatter.format(-Infinity));

// Infinity is also formatted according to locale conventions.

// ---------------------------------------------------------------------
// 38. Use notation with significant digits
// ---------------------------------------------------------------------

const compactPrecisionFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumSignificantDigits: 3,
});

console.log(compactPrecisionFormatter.format(1234567));

// Different formatting options can be combined when their semantics are compatible.

// ---------------------------------------------------------------------
// 39. Use rounding modes
// ---------------------------------------------------------------------

const roundingModeFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  roundingMode: "halfExpand",
});

console.log(roundingModeFormatter.format(2.5));
console.log(roundingModeFormatter.format(2.4));

// Modern Intl implementations expose explicit rounding behavior through NumberFormat options.

// ---------------------------------------------------------------------
// 40. Control rounding increment
// ---------------------------------------------------------------------

const incrementFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  roundingIncrement: 5,
});

console.log(incrementFormatter.format(1.23));
console.log(incrementFormatter.format(1.27));

// roundingIncrement rounds to specified increments within the constraints allowed by Intl.NumberFormat.

// ---------------------------------------------------------------------
// 41. Use trailingZeroDisplay
// ---------------------------------------------------------------------

const trailingZeroFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  trailingZeroDisplay: "stripIfInteger",
});

console.log(trailingZeroFormatter.format(12));
console.log(trailingZeroFormatter.format(12.5));

// trailingZeroDisplay can remove fraction zeros when the formatted value is an integer.

// ---------------------------------------------------------------------
// 42. Format integer values
// ---------------------------------------------------------------------

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

console.log(integerFormatter.format(1234.56));

// Setting maximumFractionDigits to zero produces a whole-number presentation after rounding.

// ---------------------------------------------------------------------
// 43. Use minimum integer digits
// ---------------------------------------------------------------------

const minimumIntegerFormatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 4,
});

console.log(minimumIntegerFormatter.format(42));

// minimumIntegerDigits pads the integer portion to the requested minimum length.

// ---------------------------------------------------------------------
// 44. Format with a specific numbering system
// ---------------------------------------------------------------------

const arabicDigitsFormatter = new Intl.NumberFormat("ar-EG", {
  numberingSystem: "arab",
});

console.log(arabicDigitsFormatter.format(123456.78));

// A numbering system controls how numeric digits and related symbols are represented.

// ---------------------------------------------------------------------
// 45. Use locale-default numbering conventions
// ---------------------------------------------------------------------

const arabicLocaleFormatter = new Intl.NumberFormat("ar-EG");

console.log(arabicLocaleFormatter.format(123456.78));

// When numberingSystem is omitted, the locale's default numbering system is used.

// ---------------------------------------------------------------------
// 46. Inspect resolved options
// ---------------------------------------------------------------------

const resolvedFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(resolvedFormatter.resolvedOptions());

// resolvedOptions() exposes the effective configuration selected by the runtime.

// ---------------------------------------------------------------------
// 47. Use formatToParts
// ---------------------------------------------------------------------

const partsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const numberParts = partsFormatter.formatToParts(1234.56);

console.log(numberParts);

// formatToParts() returns semantic pieces such as currency, integer, group, decimal,
// and fraction instead of only one final string.

// ---------------------------------------------------------------------
// 48. Inspect number parts
// ---------------------------------------------------------------------

for (const part of numberParts) {
  console.log(part.type, part.value);
}

// Structured parts can be inspected without trying to parse the localized string.

// ---------------------------------------------------------------------
// 49. Render selected number parts
// ---------------------------------------------------------------------

const selectedParts = numberParts
  .filter((part) => part.type !== "group")
  .map((part) => `${part.type}=${part.value}`)
  .join(" | ");

console.log(selectedParts);

// formatToParts() is useful when specific portions of a formatted number need separate markup.

// ---------------------------------------------------------------------
// 50. Use a locale list for fallback
// ---------------------------------------------------------------------

const negotiatedNumberFormatter = new Intl.NumberFormat(["fr-CA", "fr-FR", "en-US"]);

console.log(negotiatedNumberFormatter.format(1234567.89));

// Intl constructors can negotiate among multiple preferred locales.

// ---------------------------------------------------------------------
// 51. Check supported locales
// ---------------------------------------------------------------------

const supportedNumberLocales = Intl.NumberFormat.supportedLocalesOf(["en-US", "de-DE", "fr-FR"]);

console.log(supportedNumberLocales);

// supportedLocalesOf() reports which requested locales are supported for NumberFormat.

// ---------------------------------------------------------------------
// 52. Keep the number as numeric data
// ---------------------------------------------------------------------

const price = 1299.99;

const formattedPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(price);

console.log(price);
console.log(formattedPrice);

// Keep numeric values as numbers in application state and data models.
// Convert them to strings only at the presentation boundary.

// ---------------------------------------------------------------------
// 53. Avoid manually adding separators
// ---------------------------------------------------------------------

const manuallyGrouped = "1,234,567.89";

console.log(manuallyGrouped);

// Hardcoded separators only match a particular presentation convention.

// ---------------------------------------------------------------------
// 54. Avoid manually adding currency symbols
// ---------------------------------------------------------------------

const manuallyFormattedCurrency = `€ ${1299.99}`;

console.log(manuallyFormattedCurrency);

// Currency symbols, spacing, and placement vary across locales.

// ---------------------------------------------------------------------
// 55. Do not parse localized numbers
// ---------------------------------------------------------------------

const localizedNumber = new Intl.NumberFormat("de-DE").format(1234567.89);

console.log(localizedNumber);

// A localized number string is presentation output and should not be treated as
// a stable serialization format.

// ---------------------------------------------------------------------
// 56. Separate conversion from formatting
// ---------------------------------------------------------------------

const meters = 1500;
const kilometers = meters / 1000;

const localizedDistance = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "kilometer",
}).format(kilometers);

console.log(localizedDistance);

// Unit conversion is application logic.
// Intl.NumberFormat handles the presentation of the resulting value.

// ---------------------------------------------------------------------
// 57. Create a reusable number formatter
// ---------------------------------------------------------------------

const formatNumber = (locale: SupportedLocale, valueToFormat: number): string => {
  return new Intl.NumberFormat(locale).format(valueToFormat);
};

console.log(formatNumber("en-US", 1234567.89));
console.log(formatNumber("de-DE", 1234567.89));

// Small formatting utilities can centralize locale-aware presentation behavior.

// ---------------------------------------------------------------------
// 58. Create a reusable currency formatter
// ---------------------------------------------------------------------

const formatCurrency = (locale: SupportedLocale, currency: string, valueToFormat: number): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(valueToFormat);
};

console.log(formatCurrency("en-US", "USD", 1299.99));
console.log(formatCurrency("de-DE", "EUR", 1299.99));

// Currency remains a separate input from locale.

// ---------------------------------------------------------------------
// 59. Memoize NumberFormat in React
// ---------------------------------------------------------------------

interface LocalizedNumberProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const LocalizedNumber: FC<LocalizedNumberProps> = ({ locale, value: valueToFormat }): ReactElement => {
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  return <output>{formatter.format(valueToFormat)}</output>;
};

// Memoization avoids recreating the formatter when only unrelated component state changes.

// ---------------------------------------------------------------------
// 60. Memoize a currency formatter in React
// ---------------------------------------------------------------------

interface LocalizedCurrencyProps {
  readonly locale: SupportedLocale;
  readonly currency: string;
  readonly value: number;
}

const LocalizedCurrency: FC<LocalizedCurrencyProps> = ({ locale, currency, value: valueToFormat }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.format(valueToFormat)}</output>;
};

// Every formatter configuration that affects output belongs in the memoization dependencies.

// ---------------------------------------------------------------------
// 61. Build a locale-aware number preview
// ---------------------------------------------------------------------

interface NumberPreviewProps {
  readonly locale: SupportedLocale;
}

const NumberPreview: FC<NumberPreviewProps> = ({ locale }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  return <output>{formatter.format(1234567.89)}</output>;
};

// The same numeric value can be presented according to different locale conventions.

// ---------------------------------------------------------------------
// 62. Build a localized percentage component
// ---------------------------------------------------------------------

interface PercentageProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const Percentage: FC<PercentageProps> = ({ locale, value: percentageValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 1,
      }),
    [locale],
  );

  return <output>{formatter.format(percentageValue)}</output>;
};

// Percentage values should remain fractions in application data when they are passed
// directly to NumberFormat with style: "percent".

// ---------------------------------------------------------------------
// 63. Build a localized unit component
// ---------------------------------------------------------------------

interface UnitValueProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: Intl.NumberFormatOptions["unit"];
}

const UnitValue: FC<UnitValueProps> = ({ locale, value: unitValue, unit }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: "long",
      }),
    [locale, unit],
  );

  return <output>{formatter.format(unitValue)}</output>;
};

// The unit is part of the formatting configuration and should be included in dependencies.

// ---------------------------------------------------------------------
// 64. Format accounting values
// ---------------------------------------------------------------------

interface AccountingValueProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const AccountingValue: FC<AccountingValueProps> = ({ locale, value: accountingValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        currencySign: "accounting",
      }),
    [locale],
  );

  return <output>{formatter.format(accountingValue)}</output>;
};

// Accounting presentation is locale-sensitive and should be delegated to Intl.

// ---------------------------------------------------------------------
// 65. Build a localized compact value
// ---------------------------------------------------------------------

interface CompactValueProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const CompactValue: FC<CompactValueProps> = ({ locale, value: compactValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [locale],
  );

  return <output>{formatter.format(compactValue)}</output>;
};

// Compact notation is useful for dashboards and other interfaces with limited space.

// ---------------------------------------------------------------------
// 66. Use locale-specific number formatting in a list
// ---------------------------------------------------------------------

interface NumberListProps {
  readonly locale: SupportedLocale;
  readonly values: readonly number[];
}

const NumberList: FC<NumberListProps> = ({ locale, values }): ReactElement => {
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  return (
    <ul>
      {values.map((item) => (
        <li key={item}>{formatter.format(item)}</li>
      ))}
    </ul>
  );
};

// One formatter can be reused for every value that shares the same configuration.

// ---------------------------------------------------------------------
// 67. Format financial data without changing the data model
// ---------------------------------------------------------------------

interface FinancialValueProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const FinancialValue: FC<FinancialValueProps> = ({ locale, value: financialValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  return <output>{formatter.format(financialValue)}</output>;
};

// The component receives a number and produces localized presentation without modifying the number.

// ---------------------------------------------------------------------
// 68. Keep formatter configuration stable
// ---------------------------------------------------------------------

interface StableFormatterProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const StableFormatter: FC<StableFormatterProps> = ({ locale, value: stableValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "decimal",
        maximumFractionDigits: 2,
        useGrouping: true,
      }),
    [locale],
  );

  return <output>{formatter.format(stableValue)}</output>;
};

// Stable configuration makes the formatter's dependencies explicit and predictable.

// ---------------------------------------------------------------------
// 69. Format values using multiple styles
// ---------------------------------------------------------------------

interface NumberStylesProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const NumberStyles: FC<NumberStylesProps> = ({ locale, value: styleValue }): ReactElement => {
  const formatters = useMemo(
    () => ({
      decimal: new Intl.NumberFormat(locale),
      percent: new Intl.NumberFormat(locale, {
        style: "percent",
      }),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
      compact: new Intl.NumberFormat(locale, {
        notation: "compact",
      }),
    }),
    [locale],
  );

  return (
    <dl>
      <dt>Decimal</dt>
      <dd>{formatters.decimal.format(styleValue)}</dd>

      <dt>Percent</dt>
      <dd>{formatters.percent.format(styleValue)}</dd>

      <dt>Currency</dt>
      <dd>{formatters.currency.format(styleValue)}</dd>

      <dt>Compact</dt>
      <dd>{formatters.compact.format(styleValue)}</dd>
    </dl>
  );
};

// Different presentation contexts can use different NumberFormat configurations
// while receiving the same underlying numeric value.

// ---------------------------------------------------------------------
// 70. Build an integrated number-localization component
// ---------------------------------------------------------------------

const NumberLocalizationExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const formatter = useMemo(
    () => ({
      number: new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
      percent: new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 1,
      }),
      compact: new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
      distance: new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "kilometer",
        unitDisplay: "long",
      }),
    }),
    [locale],
  );

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  return (
    <main>
      <h2>Number Localization</h2>

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
        <dd>{formatter.number.format(1234567.89)}</dd>

        <dt>Currency</dt>
        <dd>{formatter.currency.format(1299.99)}</dd>

        <dt>Percentage</dt>
        <dd>{formatter.percent.format(0.875)}</dd>

        <dt>Compact</dt>
        <dd>{formatter.compact.format(1250000)}</dd>

        <dt>Distance</dt>
        <dd>{formatter.distance.format(42)}</dd>
      </dl>
    </main>
  );
};

// One locale state drives several NumberFormat instances with different presentation purposes.

// ---------------------------------------------------------------------
// 71. Format a ratio as a percentage
// ---------------------------------------------------------------------

const completionRatio = 0.875;

const completionFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

console.log(completionFormatter.format(completionRatio));

// Store the ratio as a number and format it as a percentage only when presenting it.

// ---------------------------------------------------------------------
// 72. Format a score with controlled precision
// ---------------------------------------------------------------------

const score = 98.4567;

const scoreFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

console.log(scoreFormatter.format(score));

// Precision rules can be selected independently from locale conventions.

// ---------------------------------------------------------------------
// 73. Format a quantity with localized units
// ---------------------------------------------------------------------

const quantityFormatter = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "liter",
  unitDisplay: "long",
});

console.log(quantityFormatter.format(12.5));

// Intl supplies locale-sensitive unit wording and punctuation.

// ---------------------------------------------------------------------
// 74. Format a large dashboard metric
// ---------------------------------------------------------------------

const dashboardMetric = 9876543;

const dashboardFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

console.log(dashboardFormatter.format(dashboardMetric));

// Compact formatting can reduce visual width while preserving the approximate magnitude.

// ---------------------------------------------------------------------
// 75. Use formatToParts for custom markup
// ---------------------------------------------------------------------

interface NumberPartsProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const NumberParts: FC<NumberPartsProps> = ({ locale, value: partsValue }): ReactElement => {
  const parts = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }).formatToParts(partsValue),
    [locale, partsValue],
  );

  return (
    <span>
      {parts.map((part, index) => (
        <span key={`${part.type}-${index}`}>{part.value}</span>
      ))}
    </span>
  );
};

// formatToParts() can expose semantic pieces without manually recreating locale-specific
// grouping, decimal separators, currency placement, or spacing.

// ---------------------------------------------------------------------
// 76. Compare formatter output semantically
// ---------------------------------------------------------------------

const semanticParts = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).formatToParts(1234.56);

const containsCurrency = semanticParts.some((part) => part.type === "currency");

const containsInteger = semanticParts.some((part) => part.type === "integer");

console.log(containsCurrency);
console.log(containsInteger);

// Structured parts can make tests less dependent on one exact localized string.

// ---------------------------------------------------------------------
// 77. Use explicit locale configuration for deterministic examples
// ---------------------------------------------------------------------

const deterministicNumberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

console.log(deterministicNumberFormatter.format(1234.5));

// Explicit locale and options make examples easier to reason about and test.

// ---------------------------------------------------------------------
// 78. Keep localization at the presentation boundary
// ---------------------------------------------------------------------

interface MetricProps {
  readonly locale: SupportedLocale;
  readonly value: number;
}

const Metric: FC<MetricProps> = ({ locale, value: metricValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2,
      }),
    [locale],
  );

  return <output>{formatter.format(metricValue)}</output>;
};

// Domain logic can continue operating on numbers while the UI handles localized formatting.

// ---------------------------------------------------------------------
// 79. Understand the NumberFormat boundary
// ---------------------------------------------------------------------

// Input data:
//   number
//
// Formatting configuration:
//   locale
//   style
//   currency
//   unit
//   notation
//   precision
//   sign behavior
//   numbering system
//
// Output:
//   locale-sensitive human-readable string
//
// NumberFormat determines presentation.
// It does not perform business calculations, unit conversion, currency conversion,
// or translation of arbitrary application text.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default NumberLocalizationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Intl.NumberFormat` provides locale-sensitive numeric formatting.
// - The underlying numeric value should remain a number rather than a localized string.
// - Locale controls conventions such as grouping, decimal separators, symbols, spacing, and digit systems.
// - `style: "percent"` formats fractional values as percentages.
// - `style: "currency"` formats monetary values using a specified currency code.
// - `style: "unit"` formats supported measurements using locale-sensitive unit presentation.
// - `notation: "compact"` creates shorter representations for large values.
// - `notation: "scientific"` and `notation: "engineering"` provide specialized numeric notation.
// - Fraction-digit and significant-digit options control numeric precision.
// - `signDisplay` controls when positive and negative signs are displayed.
// - Currency and locale are separate concerns: the currency identifies the monetary unit and the locale controls presentation.
// - NumberFormat formats units but does not perform unit conversion.
// - NumberFormat formats currencies but does not perform currency conversion.
// - `formatToParts()` exposes structured pieces of formatted numeric output.
// - `resolvedOptions()` exposes the effective formatter configuration.
// - Locale arrays allow Intl to negotiate among multiple preferred locales.
// - React components can memoize formatters using locale and other formatter configuration as dependencies.
// - Localized numeric strings are presentation output and should not be used as stable serialization formats.
// - Intl.NumberFormat should replace manually implemented locale-specific numeric formatting rules.

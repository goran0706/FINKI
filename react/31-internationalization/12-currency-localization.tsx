/**
 * Currency Localization
 * ======================
 *
 * Currency localization is the process of presenting monetary values according to a locale's
 * conventions for currency symbols, currency codes, names, decimal precision, grouping, spacing,
 * and placement.
 *
 * The `Intl.NumberFormat` API provides locale-sensitive currency formatting while keeping the
 * monetary amount and currency code as separate pieces of application data.
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
// 3. Define supported currencies
// ---------------------------------------------------------------------

type SupportedCurrency = "USD" | "EUR" | "GBP";

const supportedCurrencies: readonly SupportedCurrency[] = ["USD", "EUR", "GBP"];

// Currency codes identify the monetary unit.
// The locale determines how that currency is presented.

// ---------------------------------------------------------------------
// 4. Format a basic currency value
// ---------------------------------------------------------------------

const amount = 1299.99;

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(usdFormatter.format(amount));

// style: "currency" enables currency-specific formatting.
// currency identifies the ISO 4217 currency code.

// ---------------------------------------------------------------------
// 5. Format the same currency across locales
// ---------------------------------------------------------------------

console.log(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount),
);

console.log(
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount),
);

console.log(
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount),
);

// The currency remains EUR while the locale changes its presentation.

// ---------------------------------------------------------------------
// 6. Format different currencies with one locale
// ---------------------------------------------------------------------

for (const currency of supportedCurrencies) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  console.log(currency, formatter.format(amount));
}

// A single locale can format multiple currencies.

// ---------------------------------------------------------------------
// 7. Use currencyDisplay: symbol
// ---------------------------------------------------------------------

const symbolFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "symbol",
});

console.log(symbolFormatter.format(amount));

// symbol uses the currency's locale-appropriate symbol or symbol-like representation.

// ---------------------------------------------------------------------
// 8. Use currencyDisplay: code
// ---------------------------------------------------------------------

const codeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "code",
});

console.log(codeFormatter.format(amount));

// code displays the ISO currency code, such as USD.

// ---------------------------------------------------------------------
// 9. Use currencyDisplay: name
// ---------------------------------------------------------------------

const nameFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "name",
});

console.log(nameFormatter.format(amount));

// name displays a localized currency name.

// ---------------------------------------------------------------------
// 10. Use currencyDisplay: narrowSymbol
// ---------------------------------------------------------------------

const narrowSymbolFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

console.log(narrowSymbolFormatter.format(amount));

// narrowSymbol requests a more compact currency symbol when the locale provides one.

// ---------------------------------------------------------------------
// 11. Compare currency displays
// ---------------------------------------------------------------------

const currencyDisplays: readonly Intl.NumberFormatOptions["currencyDisplay"][] = [
  "symbol",
  "narrowSymbol",
  "code",
  "name",
];

for (const currencyDisplay of currencyDisplays) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay,
  });

  console.log(currencyDisplay, formatter.format(amount));
}

// currencyDisplay changes presentation without changing the underlying monetary value.

// ---------------------------------------------------------------------
// 12. Use currencySign: standard
// ---------------------------------------------------------------------

const standardSignFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencySign: "standard",
});

console.log(standardSignFormatter.format(-amount));

// standard uses the locale's normal negative-currency convention.

// ---------------------------------------------------------------------
// 13. Use currencySign: accounting
// ---------------------------------------------------------------------

const accountingFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencySign: "accounting",
});

console.log(accountingFormatter.format(-amount));

// accounting can use accounting-specific negative notation, such as parentheses.

// ---------------------------------------------------------------------
// 14. Compare accounting conventions across locales
// ---------------------------------------------------------------------

console.log(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: "accounting",
  }).format(-amount),
);

console.log(
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    currencySign: "accounting",
  }).format(-amount),
);

console.log(
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    currencySign: "accounting",
  }).format(-amount),
);

// Accounting notation itself is also locale-sensitive.

// ---------------------------------------------------------------------
// 15. Control currency fraction digits
// ---------------------------------------------------------------------

const fixedCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

console.log(fixedCurrencyFormatter.format(42));
console.log(fixedCurrencyFormatter.format(42.5));

// Fraction-digit options can control the displayed precision.

// ---------------------------------------------------------------------
// 16. Use zero currency fraction digits
// ---------------------------------------------------------------------

const wholeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

console.log(wholeCurrencyFormatter.format(1299.99));

// Currency formatting can intentionally display a whole-number presentation.
// The underlying value is still 1299.99.

// ---------------------------------------------------------------------
// 17. Respect currency-specific default precision
// ---------------------------------------------------------------------

const jpyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "JPY",
});

const kwdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KWD",
});

console.log(jpyFormatter.format(1299.99));
console.log(kwdFormatter.format(1299.99));

// Currency formatting uses the currency's standard fraction-digit information by default.
// Different currencies can therefore have different default decimal precision.

// ---------------------------------------------------------------------
// 18. Do not assume every currency has two decimal places
// ---------------------------------------------------------------------

const currencyPrecisionExamples = ["JPY", "USD", "KWD"] as const;

for (const currency of currencyPrecisionExamples) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  console.log(currency, formatter.format(1234.567));
}

// Applications should not hardcode a universal two-decimal rule for every currency.

// ---------------------------------------------------------------------
// 19. Format currency names
// ---------------------------------------------------------------------

const currencyNameFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "name",
});

console.log(currencyNameFormatter.format(42));

// Currency names are localized by Intl.

// ---------------------------------------------------------------------
// 20. Format currency names in German
// ---------------------------------------------------------------------

const germanCurrencyNameFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "name",
});

console.log(germanCurrencyNameFormatter.format(42));

// The currency name can change language and grammatical form with the locale.

// ---------------------------------------------------------------------
// 21. Format currency names in French
// ---------------------------------------------------------------------

const frenchCurrencyNameFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "name",
});

console.log(frenchCurrencyNameFormatter.format(42));

// Intl handles locale-specific currency wording rather than requiring hardcoded labels.

// ---------------------------------------------------------------------
// 22. Use signDisplay
// ---------------------------------------------------------------------

const explicitSignFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
});

console.log(explicitSignFormatter.format(42));
console.log(explicitSignFormatter.format(-42));

// signDisplay can request explicit positive and negative signs.

// ---------------------------------------------------------------------
// 23. Hide the sign for zero
// ---------------------------------------------------------------------

const exceptZeroFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "exceptZero",
});

console.log(exceptZeroFormatter.format(42));
console.log(exceptZeroFormatter.format(-42));
console.log(exceptZeroFormatter.format(0));

// exceptZero displays signs for non-zero values but not zero.

// ---------------------------------------------------------------------
// 24. Format a zero monetary amount
// ---------------------------------------------------------------------

const zeroCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(zeroCurrencyFormatter.format(0));

// Zero remains a numeric value and receives normal currency formatting.

// ---------------------------------------------------------------------
// 25. Format a negative monetary amount
// ---------------------------------------------------------------------

const negativeCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(negativeCurrencyFormatter.format(-1299.99));

// Negative currency formatting follows the locale's conventions.

// ---------------------------------------------------------------------
// 26. Format a positive monetary amount
// ---------------------------------------------------------------------

const positiveCurrencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

console.log(positiveCurrencyFormatter.format(1299.99));

// Positive currency formatting also follows locale-specific placement and spacing rules.

// ---------------------------------------------------------------------
// 27. Format a large monetary value
// ---------------------------------------------------------------------

const largeAmount = 123456789.99;

const largeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(largeCurrencyFormatter.format(largeAmount));

// Grouping separators are supplied by Intl rather than manually inserted.

// ---------------------------------------------------------------------
// 28. Format a small monetary value
// ---------------------------------------------------------------------

const smallAmount = 0.99;

const smallCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(smallCurrencyFormatter.format(smallAmount));

// Currency formatting handles small values according to the currency's precision rules.

// ---------------------------------------------------------------------
// 29. Use formatToParts
// ---------------------------------------------------------------------

const partsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const currencyParts = partsFormatter.formatToParts(1234.56);

console.log(currencyParts);

// formatToParts() exposes structured pieces of the formatted currency value.

// ---------------------------------------------------------------------
// 30. Inspect currency parts
// ---------------------------------------------------------------------

for (const part of currencyParts) {
  console.log(part.type, part.value);
}

// Parts can include currency, integer, group, decimal, fraction, and literal components.

// ---------------------------------------------------------------------
// 31. Find the currency part
// ---------------------------------------------------------------------

const currencyPart = currencyParts.find((part) => part.type === "currency");

console.log(currencyPart);

// Structured parts can be inspected without parsing the localized string manually.

// ---------------------------------------------------------------------
// 32. Render currency parts separately
// ---------------------------------------------------------------------

interface CurrencyPartsProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly value: number;
}

const CurrencyParts: FC<CurrencyPartsProps> = ({ locale, currency, value: currencyValue }): ReactElement => {
  const parts = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).formatToParts(currencyValue),
    [locale, currency, currencyValue],
  );

  return (
    <span>
      {parts.map((part, index) => (
        <span key={`${part.type}-${index}`}>{part.value}</span>
      ))}
    </span>
  );
};

// formatToParts() allows structured rendering while preserving Intl's locale-specific ordering.

// ---------------------------------------------------------------------
// 33. Format a currency range
// ---------------------------------------------------------------------

const minimumPrice = 19.99;
const maximumPrice = 49.99;

const rangeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(rangeFormatter.formatRange(minimumPrice, maximumPrice));

// NumberFormat can format numeric ranges using locale-sensitive conventions.

// ---------------------------------------------------------------------
// 34. Format a currency range in another locale
// ---------------------------------------------------------------------

const germanRangeFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(germanRangeFormatter.formatRange(minimumPrice, maximumPrice));

// The same numeric interval can use different currency presentation rules by locale.

// ---------------------------------------------------------------------
// 35. Format currency range parts
// ---------------------------------------------------------------------

const currencyRangeParts = rangeFormatter.formatRangeToParts(minimumPrice, maximumPrice);

console.log(currencyRangeParts);

// formatRangeToParts() exposes the structured pieces of a localized currency range.

// ---------------------------------------------------------------------
// 36. Use a currency code for unambiguous output
// ---------------------------------------------------------------------

const unambiguousCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "code",
});

console.log(unambiguousCurrencyFormatter.format(1299.99));

// Currency codes can make the monetary unit explicit when a symbol could be ambiguous.

// ---------------------------------------------------------------------
// 37. Use currency names for descriptive output
// ---------------------------------------------------------------------

const descriptiveCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "name",
});

console.log(descriptiveCurrencyFormatter.format(1299.99));

// Currency names can be useful when the user benefits from an explicit textual currency label.

// ---------------------------------------------------------------------
// 38. Keep currency and locale independent
// ---------------------------------------------------------------------

const money = {
  amount: 1299.99,
  currency: "EUR" as SupportedCurrency,
};

const localizedMoney = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: money.currency,
}).format(money.amount);

console.log(money);
console.log(localizedMoney);

// The monetary data contains an amount and currency.
// Locale is a presentation concern applied separately.

// ---------------------------------------------------------------------
// 39. Do not store formatted currency strings
// ---------------------------------------------------------------------

const storedMoney = {
  amount: 1299.99,
  currency: "EUR" as SupportedCurrency,
};

console.log(storedMoney);

// Structured monetary data remains usable for calculations, comparisons, and reformatting.

// ---------------------------------------------------------------------
// 40. Avoid manually adding currency symbols
// ---------------------------------------------------------------------

const manuallyFormattedMoney = `$${1299.99}`;

console.log(manuallyFormattedMoney);

// Hardcoded symbols do not account for currency placement, spacing, or locale conventions.

// ---------------------------------------------------------------------
// 41. Avoid manually adding separators
// ---------------------------------------------------------------------

const manuallyGroupedMoney = "1,299.99 USD";

console.log(manuallyGroupedMoney);

// Manual grouping can become incorrect when the locale uses different separators or ordering.

// ---------------------------------------------------------------------
// 42. Avoid parsing localized currency strings
// ---------------------------------------------------------------------

const localizedCurrencyString = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
}).format(1299.99);

console.log(localizedCurrencyString);

// A localized currency string is presentation output, not a stable data format.

// ---------------------------------------------------------------------
// 43. Separate currency conversion from currency formatting
// ---------------------------------------------------------------------

const usdAmount = 100;
const conversionRate = 0.92;
const eurAmount = usdAmount * conversionRate;

const convertedCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(convertedCurrencyFormatter.format(eurAmount));

// Currency conversion is application or financial-domain logic.
// NumberFormat only presents the resulting amount.

// ---------------------------------------------------------------------
// 44. Do not treat exchange rates as formatting configuration
// ---------------------------------------------------------------------

const financialData = {
  amount: 100,
  currency: "USD" as SupportedCurrency,
  exchangeRateToEur: 0.92,
};

console.log(financialData);

// Exchange rates belong to financial data or domain logic, not Intl.NumberFormat.

// ---------------------------------------------------------------------
// 45. Create a reusable currency formatter
// ---------------------------------------------------------------------

const formatCurrency = (locale: SupportedLocale, currency: SupportedCurrency, valueToFormat: number): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(valueToFormat);
};

console.log(formatCurrency("en-US", "USD", 1299.99));
console.log(formatCurrency("de-DE", "EUR", 1299.99));

// A reusable formatter function can centralize common currency presentation logic.

// ---------------------------------------------------------------------
// 46. Create a formatter with accounting support
// ---------------------------------------------------------------------

const formatAccountingCurrency = (
  locale: SupportedLocale,
  currency: SupportedCurrency,
  valueToFormat: number,
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencySign: "accounting",
  }).format(valueToFormat);
};

console.log(formatAccountingCurrency("en-US", "USD", -1299.99));

// Specialized formatting utilities can expose only the options the application needs.

// ---------------------------------------------------------------------
// 47. Memoize a currency formatter in React
// ---------------------------------------------------------------------

interface LocalizedCurrencyProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly value: number;
}

const LocalizedCurrency: FC<LocalizedCurrencyProps> = ({ locale, currency, value: currencyValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.format(currencyValue)}</output>;
};

// Formatter configuration belongs in the dependency list because it affects the output.

// ---------------------------------------------------------------------
// 48. Memoize an accounting formatter in React
// ---------------------------------------------------------------------

interface AccountingCurrencyProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly value: number;
}

const AccountingCurrency: FC<AccountingCurrencyProps> = ({
  locale,
  currency,
  value: accountingValue,
}): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencySign: "accounting",
      }),
    [locale, currency],
  );

  return <output>{formatter.format(accountingValue)}</output>;
};

// The locale and currency both determine the formatter configuration.

// ---------------------------------------------------------------------
// 49. Build a currency selector
// ---------------------------------------------------------------------

interface CurrencySelectorProps {
  readonly currency: SupportedCurrency;
  readonly onChange: (currency: SupportedCurrency) => void;
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ currency, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as SupportedCurrency);
  };

  return (
    <label>
      Currency
      <select value={currency} onChange={handleChange}>
        {supportedCurrencies.map((supportedCurrency) => (
          <option key={supportedCurrency} value={supportedCurrency}>
            {supportedCurrency}
          </option>
        ))}
      </select>
    </label>
  );
};

// Currency selection changes the monetary unit being formatted.

// ---------------------------------------------------------------------
// 50. Build a locale selector
// ---------------------------------------------------------------------

interface CurrencyLocaleSelectorProps {
  readonly locale: SupportedLocale;
  readonly onChange: (locale: SupportedLocale) => void;
}

const CurrencyLocaleSelector: FC<CurrencyLocaleSelectorProps> = ({ locale, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as SupportedLocale);
  };

  return (
    <label>
      Locale
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

// Locale selection changes how the selected currency is presented.

// ---------------------------------------------------------------------
// 51. Build a localized price component
// ---------------------------------------------------------------------

interface PriceProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly amount: number;
}

const Price: FC<PriceProps> = ({ locale, currency, amount: priceAmount }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.format(priceAmount)}</output>;
};

// Price data remains numeric while its visual representation is localized.

// ---------------------------------------------------------------------
// 52. Build a localized balance component
// ---------------------------------------------------------------------

interface BalanceProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly balance: number;
}

const Balance: FC<BalanceProps> = ({ locale, currency, balance }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencySign: "accounting",
      }),
    [locale, currency],
  );

  return <output>{formatter.format(balance)}</output>;
};

// Accounting notation can be useful for financial statements and balance displays.

// ---------------------------------------------------------------------
// 53. Format a localized invoice amount
// ---------------------------------------------------------------------

interface InvoiceAmountProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly subtotal: number;
  readonly tax: number;
}

const InvoiceAmount: FC<InvoiceAmountProps> = ({ locale, currency, subtotal, tax }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  const total = subtotal + tax;

  return (
    <dl>
      <dt>Subtotal</dt>
      <dd>{formatter.format(subtotal)}</dd>

      <dt>Tax</dt>
      <dd>{formatter.format(tax)}</dd>

      <dt>Total</dt>
      <dd>{formatter.format(total)}</dd>
    </dl>
  );
};

// Calculations happen on numeric values before the final localized formatting step.

// ---------------------------------------------------------------------
// 54. Format a localized price range
// ---------------------------------------------------------------------

interface PriceRangeProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly minimum: number;
  readonly maximum: number;
}

const PriceRange: FC<PriceRangeProps> = ({ locale, currency, minimum, maximum }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <span>{formatter.formatRange(minimum, maximum)}</span>;
};

// NumberFormat can produce a locale-sensitive representation of the range.

// ---------------------------------------------------------------------
// 55. Use currency formatting with accessible output
// ---------------------------------------------------------------------

interface AccessiblePriceProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly value: number;
}

const AccessiblePrice: FC<AccessiblePriceProps> = ({ locale, currency, value: accessibleValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "name",
      }),
    [locale, currency],
  );

  return <span>{formatter.format(accessibleValue)}</span>;
};

// A currency name can make the monetary unit explicit in contexts where a symbol alone
// may not provide enough information.

// ---------------------------------------------------------------------
// 56. Use code display for administrative interfaces
// ---------------------------------------------------------------------

interface CurrencyCodeValueProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly value: number;
}

const CurrencyCodeValue: FC<CurrencyCodeValueProps> = ({ locale, currency, value: codeValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }),
    [locale, currency],
  );

  return <output>{formatter.format(codeValue)}</output>;
};

// Currency codes can be preferable when exact currency identification matters.

// ---------------------------------------------------------------------
// 57. Keep display precision separate from stored precision
// ---------------------------------------------------------------------

const storedAmount = 1299.987654;

const displayFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

console.log(storedAmount);
console.log(displayFormatter.format(storedAmount));

// Formatting precision changes presentation, not the stored numeric value.

// ---------------------------------------------------------------------
// 58. Avoid rounding data just for display
// ---------------------------------------------------------------------

const preciseAmount = 1299.987654;
const roundedForDisplay = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
}).format(preciseAmount);

console.log(preciseAmount);
console.log(roundedForDisplay);

// The formatted result may be rounded while the original value remains unchanged.

// ---------------------------------------------------------------------
// 59. Use explicit locale and currency for deterministic output
// ---------------------------------------------------------------------

const deterministicCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(deterministicCurrencyFormatter.format(1299.99));

// Explicit configuration makes examples and tests independent of the runtime's default locale.

// ---------------------------------------------------------------------
// 60. Inspect effective currency options
// ---------------------------------------------------------------------

const resolvedCurrencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

console.log(resolvedCurrencyFormatter.resolvedOptions());

// resolvedOptions() exposes the effective locale, currency, fraction digits, and other settings.

// ---------------------------------------------------------------------
// 61. Use supportedLocalesOf
// ---------------------------------------------------------------------

const supportedCurrencyLocales = Intl.NumberFormat.supportedLocalesOf(["en-US", "de-DE", "fr-FR"]);

console.log(supportedCurrencyLocales);

// supportedLocalesOf() reports which requested locales are supported by NumberFormat.

// ---------------------------------------------------------------------
// 62. Use a locale fallback list
// ---------------------------------------------------------------------

const fallbackCurrencyFormatter = new Intl.NumberFormat(["fr-CA", "fr-FR", "en-US"], {
  style: "currency",
  currency: "EUR",
});

console.log(fallbackCurrencyFormatter.format(1299.99));

// Multiple locale preferences allow Intl to negotiate an appropriate locale.

// ---------------------------------------------------------------------
// 63. Use Intl.Locale as a locale input
// ---------------------------------------------------------------------

const locale = new Intl.Locale("de-DE");

const localeCurrencyFormatter = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "EUR",
});

console.log(localeCurrencyFormatter.format(1299.99));

// NumberFormat accepts an Intl.Locale instance as a locale input.

// ---------------------------------------------------------------------
// 64. Format a list of prices
// ---------------------------------------------------------------------

interface PriceListProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly prices: readonly number[];
}

const PriceList: FC<PriceListProps> = ({ locale, currency, prices }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return (
    <ul>
      {prices.map((priceValue, index) => (
        <li key={`${priceValue}-${index}`}>{formatter.format(priceValue)}</li>
      ))}
    </ul>
  );
};

// One formatter can be reused for every price sharing the same locale and currency.

// ---------------------------------------------------------------------
// 65. Format multiple monetary fields
// ---------------------------------------------------------------------

interface MonetarySummaryProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly subtotal: number;
  readonly discount: number;
  readonly shipping: number;
}

const MonetarySummary: FC<MonetarySummaryProps> = ({
  locale,
  currency,
  subtotal,
  discount,
  shipping,
}): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  const total = subtotal - discount + shipping;

  return (
    <dl>
      <dt>Subtotal</dt>
      <dd>{formatter.format(subtotal)}</dd>

      <dt>Discount</dt>
      <dd>{formatter.format(discount)}</dd>

      <dt>Shipping</dt>
      <dd>{formatter.format(shipping)}</dd>

      <dt>Total</dt>
      <dd>{formatter.format(total)}</dd>
    </dl>
  );
};

// Monetary calculations should use numeric values before localization is applied.

// ---------------------------------------------------------------------
// 66. Handle negative financial values
// ---------------------------------------------------------------------

interface FinancialChangeProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly value: number;
}

const FinancialChange: FC<FinancialChangeProps> = ({ locale, currency, value: changeValue }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        signDisplay: "always",
      }),
    [locale, currency],
  );

  return <output>{formatter.format(changeValue)}</output>;
};

// signDisplay can make positive and negative financial changes visually explicit.

// ---------------------------------------------------------------------
// 67. Format a financial percentage separately
// ---------------------------------------------------------------------

interface FinancialChangeWithPercentageProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
  readonly amount: number;
  readonly percentage: number;
}

const FinancialChangeWithPercentage: FC<FinancialChangeWithPercentageProps> = ({
  locale,
  currency,
  amount: financialAmount,
  percentage,
}): ReactElement => {
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        signDisplay: "always",
      }),
    [locale, currency],
  );

  const percentageFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 1,
        signDisplay: "always",
      }),
    [locale],
  );

  return (
    <dl>
      <dt>Amount</dt>
      <dd>{currencyFormatter.format(financialAmount)}</dd>

      <dt>Percentage</dt>
      <dd>{percentageFormatter.format(percentage)}</dd>
    </dl>
  );
};

// Currency and percentage are different presentation styles even when they describe the same change.

// ---------------------------------------------------------------------
// 68. Keep currency codes strongly typed
// ---------------------------------------------------------------------

interface Money {
  readonly amount: number;
  readonly currency: SupportedCurrency;
}

const accountBalance: Money = {
  amount: 1299.99,
  currency: "EUR",
};

console.log(accountBalance);

// A constrained currency union prevents arbitrary strings from being passed where supported
// application currencies are required.

// ---------------------------------------------------------------------
// 69. Build a localized currency preview
// ---------------------------------------------------------------------

interface CurrencyPreviewProps {
  readonly locale: SupportedLocale;
  readonly currency: SupportedCurrency;
}

const CurrencyPreview: FC<CurrencyPreviewProps> = ({ locale, currency }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.format(1299.99)}</output>;
};

// The component can switch either locale or currency without changing the underlying amount.

// ---------------------------------------------------------------------
// 70. Build an integrated currency-localization component
// ---------------------------------------------------------------------

const CurrencyLocalizationExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");

  const formatter = useMemo(
    () => ({
      standard: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
      accounting: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencySign: "accounting",
      }),
      code: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "code",
      }),
      name: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: "name",
      }),
    }),
    [locale, currency],
  );

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setCurrency(event.target.value as SupportedCurrency);
  };

  const amountToDisplay = 1299.99;

  return (
    <main>
      <h2>Currency Localization</h2>

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

      <label>
        Currency
        <select value={currency} onChange={handleCurrencyChange}>
          {supportedCurrencies.map((supportedCurrency) => (
            <option key={supportedCurrency} value={supportedCurrency}>
              {supportedCurrency}
            </option>
          ))}
        </select>
      </label>

      <dl>
        <dt>Standard</dt>
        <dd>{formatter.standard.format(amountToDisplay)}</dd>

        <dt>Accounting</dt>
        <dd>{formatter.accounting.format(-amountToDisplay)}</dd>

        <dt>Code</dt>
        <dd>{formatter.code.format(amountToDisplay)}</dd>

        <dt>Name</dt>
        <dd>{formatter.name.format(amountToDisplay)}</dd>
      </dl>
    </main>
  );
};

// Locale and currency are independent state values that jointly determine the presentation.

// ---------------------------------------------------------------------
// 71. Format a price range component
// ---------------------------------------------------------------------

const LocalizedPriceRange: FC<PriceRangeProps> = ({ locale, currency, minimum, maximum }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  return <output>{formatter.formatRange(minimum, maximum)}</output>;
};

// Range formatting avoids manually concatenating two localized currency strings.

// ---------------------------------------------------------------------
// 72. Format currency without changing the amount
// ---------------------------------------------------------------------

const originalAmount = 1499.5;

const firstRepresentation = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(originalAmount);

const secondRepresentation = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "USD",
}).format(originalAmount);

console.log(originalAmount);
console.log(firstRepresentation);
console.log(secondRepresentation);

// Different representations can be produced from the same unchanged numeric amount.

// ---------------------------------------------------------------------
// 73. Format a currency using an explicit time-independent configuration
// ---------------------------------------------------------------------

const stableCurrencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

console.log(stableCurrencyFormatter.format(1499.5));

// Currency formatting is not affected by the current date or time.

// ---------------------------------------------------------------------
// 74. Keep calculations outside the formatter
// ---------------------------------------------------------------------

const itemPrice = 49.99;
const quantity = 3;
const itemTotal = itemPrice * quantity;

const itemTotalFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

console.log(itemTotalFormatter.format(itemTotal));

// Arithmetic should operate on numeric data.
// Formatting should happen after the calculation.

// ---------------------------------------------------------------------
// 75. Use a domain object for monetary values
// ---------------------------------------------------------------------

interface MonetaryValue {
  readonly amount: number;
  readonly currency: SupportedCurrency;
}

const productPrice: MonetaryValue = {
  amount: 49.99,
  currency: "USD",
};

console.log(productPrice);

// A domain object can keep the amount and its currency together while leaving locale
// as a presentation concern.

// ---------------------------------------------------------------------
// 76. Format a domain monetary value
// ---------------------------------------------------------------------

const formatMoney = (locale: SupportedLocale, moneyValue: MonetaryValue): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: moneyValue.currency,
  }).format(moneyValue.amount);
};

console.log(formatMoney("en-US", productPrice));
console.log(formatMoney("de-DE", productPrice));

// The same monetary value can be presented for different locales.

// ---------------------------------------------------------------------
// 77. Avoid using locale as currency identity
// ---------------------------------------------------------------------

const germanUserMoney: MonetaryValue = {
  amount: 100,
  currency: "USD",
};

console.log(formatMoney("de-DE", germanUserMoney));

// A user's locale does not determine the currency of every monetary value.
// Currency must come from the application's monetary data or explicit business rules.

// ---------------------------------------------------------------------
// 78. Understand the NumberFormat boundary
// ---------------------------------------------------------------------

// Input data:
//   amount
//   currency
//
// Presentation configuration:
//   locale
//   currencyDisplay
//   currencySign
//   fraction digits
//   sign behavior
//
// Output:
//   locale-sensitive currency string
//
// NumberFormat handles presentation.
// It does not perform currency conversion, determine exchange rates, or calculate totals.

// ---------------------------------------------------------------------
// 79. Keep localization at the presentation boundary
// ---------------------------------------------------------------------

interface MoneyDisplayProps {
  readonly locale: SupportedLocale;
  readonly money: MonetaryValue;
}

const MoneyDisplay: FC<MoneyDisplayProps> = ({ locale, money }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: money.currency,
      }),
    [locale, money.currency],
  );

  return <output>{formatter.format(money.amount)}</output>;
};

// The data model remains locale-independent while the UI produces localized presentation.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default CurrencyLocalizationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Currency localization presents monetary values according to locale-specific conventions.
// - `Intl.NumberFormat` with `style: "currency"` is the primary currency-formatting API.
// - The currency code identifies the monetary unit while the locale controls its presentation.
// - Currency placement, spacing, grouping, symbols, and currency names can vary by locale.
// - `currencyDisplay` supports symbol, narrow symbol, code, and localized name representations.
// - `currencySign` supports standard and accounting-style negative currency presentation.
// - Currency-specific default fraction digits should not be assumed to be universally two.
// - Explicit fraction-digit options can control the precision shown to the user.
// - `signDisplay` can control whether positive and negative signs are displayed.
// - `formatToParts()` exposes structured components of localized currency output.
// - `formatRange()` can produce a locale-sensitive representation of a monetary range.
// - `resolvedOptions()` exposes the effective formatter configuration.
// - Locale and currency are separate concerns and should remain separate in application data.
// - Monetary amounts should remain numeric rather than being stored as localized strings.
// - Currency conversion and exchange-rate calculations are domain logic, not NumberFormat responsibilities.
// - Calculations should be performed on numeric values before the final formatting step.
// - Currency codes can be strongly typed in TypeScript when an application supports a known set of currencies.
// - React components can memoize currency formatters using locale and currency as dependencies.
// - Localized currency strings are presentation output and should not be used as stable serialization formats.

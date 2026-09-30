/**
 * Relative Time
 * =============
 *
 * Relative-time localization presents temporal distances such as "yesterday", "in 3 days",
 * or "5 minutes ago" according to the conventions of a locale. The `Intl.RelativeTimeFormat`
 * API provides locale-sensitive wording, numeric formatting, and direction handling without
 * requiring applications to manually construct language-specific phrases.
 *
 * Relative time is presentation logic: the application supplies a signed numeric difference
 * and a unit such as `second`, `minute`, `hour`, `day`, `week`, `month`, or `year`.
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

// RelativeTimeFormat localizes the final presentation according to the selected locale.

// ---------------------------------------------------------------------
// 3. Define supported relative-time units
// ---------------------------------------------------------------------

type RelativeTimeUnit = "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year";

const supportedUnits: readonly RelativeTimeUnit[] = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "quarter",
  "year",
];

// The unit describes what the numeric value represents.
// It does not determine the actual difference between two timestamps.

// ---------------------------------------------------------------------
// 4. Create a basic RelativeTimeFormat instance
// ---------------------------------------------------------------------

const englishRelativeTime = new Intl.RelativeTimeFormat("en-US");

console.log(englishRelativeTime.format(-1, "day"));
console.log(englishRelativeTime.format(2, "day"));

// Negative values describe time in the past.
// Positive values describe time in the future.

// ---------------------------------------------------------------------
// 5. Format a past value
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-5, "minute"));

// The sign of the numeric value determines the temporal direction.

// ---------------------------------------------------------------------
// 6. Format a future value
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(3, "hour"));

// Positive relative values represent future time.

// ---------------------------------------------------------------------
// 7. Format zero
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(0, "day"));

// Zero represents the current relative position for the selected unit.

// ---------------------------------------------------------------------
// 8. Format seconds
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-10, "second"));
console.log(englishRelativeTime.format(30, "second"));

// The unit controls the temporal noun or unit used in the localized output.

// ---------------------------------------------------------------------
// 9. Format minutes
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-5, "minute"));
console.log(englishRelativeTime.format(5, "minute"));

// RelativeTimeFormat handles singular and plural wording for the configured locale.

// ---------------------------------------------------------------------
// 10. Format hours
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-1, "hour"));
console.log(englishRelativeTime.format(4, "hour"));

// The same API works for different supported units.

// ---------------------------------------------------------------------
// 11. Format days
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-1, "day"));
console.log(englishRelativeTime.format(2, "day"));

// Day-based relative time is commonly used for dates such as yesterday and tomorrow.

// ---------------------------------------------------------------------
// 12. Format weeks
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-1, "week"));
console.log(englishRelativeTime.format(2, "week"));

// Weeks can be used when the application's temporal model works at that granularity.

// ---------------------------------------------------------------------
// 13. Format months
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-1, "month"));
console.log(englishRelativeTime.format(3, "month"));

// Months are calendar-relative units rather than fixed durations of a constant number of days.

// ---------------------------------------------------------------------
// 14. Format quarters
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-1, "quarter"));
console.log(englishRelativeTime.format(2, "quarter"));

// Quarter is a supported RelativeTimeFormat unit in modern ECMAScript implementations.

// ---------------------------------------------------------------------
// 15. Format years
// ---------------------------------------------------------------------

console.log(englishRelativeTime.format(-1, "year"));
console.log(englishRelativeTime.format(2, "year"));

// Years are useful for long-lived relative dates such as publication or account history.

// ---------------------------------------------------------------------
// 16. Use numeric: always
// ---------------------------------------------------------------------

const alwaysNumericFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
});

console.log(alwaysNumericFormatter.format(-1, "day"));
console.log(alwaysNumericFormatter.format(1, "day"));

// `numeric: "always"` always uses numeric relative expressions.

// ---------------------------------------------------------------------
// 17. Use numeric: auto
// ---------------------------------------------------------------------

const automaticNumericFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

console.log(automaticNumericFormatter.format(-1, "day"));
console.log(automaticNumericFormatter.format(0, "day"));
console.log(automaticNumericFormatter.format(1, "day"));

// `numeric: "auto"` allows locale-specific special forms such as "yesterday", "today",
// and "tomorrow" when they exist for the requested unit and locale.

// ---------------------------------------------------------------------
// 18. Compare numeric modes
// ---------------------------------------------------------------------

console.log(alwaysNumericFormatter.format(-1, "day"));

console.log(automaticNumericFormatter.format(-1, "day"));

// The same numeric value can produce different output depending on the numeric option.

// ---------------------------------------------------------------------
// 19. Use always for machine-like relative values
// ---------------------------------------------------------------------

const machineLikeRelativeTime = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
});

console.log(machineLikeRelativeTime.format(-2, "hour"));

// Numeric output can be preferable when the interface consistently displays explicit quantities.

// ---------------------------------------------------------------------
// 20. Use auto for human-oriented relative dates
// ---------------------------------------------------------------------

const humanRelativeTime = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

console.log(humanRelativeTime.format(-1, "day"));
console.log(humanRelativeTime.format(1, "day"));

// Auto mode can produce more natural short date descriptions.

// ---------------------------------------------------------------------
// 21. Format relative time in German
// ---------------------------------------------------------------------

const germanRelativeTime = new Intl.RelativeTimeFormat("de-DE", {
  numeric: "auto",
});

console.log(germanRelativeTime.format(-1, "day"));
console.log(germanRelativeTime.format(2, "day"));

// The same numeric input is localized using German grammatical conventions.

// ---------------------------------------------------------------------
// 22. Format relative time in French
// ---------------------------------------------------------------------

const frenchRelativeTime = new Intl.RelativeTimeFormat("fr-FR", {
  numeric: "auto",
});

console.log(frenchRelativeTime.format(-1, "day"));
console.log(frenchRelativeTime.format(2, "day"));

// RelativeTimeFormat changes the language without changing the underlying numeric value.

// ---------------------------------------------------------------------
// 23. Use style: long
// ---------------------------------------------------------------------

const longRelativeTime = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
  style: "long",
});

console.log(longRelativeTime.format(-3, "day"));

// Long style uses the full form of the relative unit.

// ---------------------------------------------------------------------
// 24. Use style: short
// ---------------------------------------------------------------------

const shortRelativeTime = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
  style: "short",
});

console.log(shortRelativeTime.format(-3, "day"));

// Short style uses abbreviated unit forms when the locale provides them.

// ---------------------------------------------------------------------
// 25. Use style: narrow
// ---------------------------------------------------------------------

const narrowRelativeTime = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
  style: "narrow",
});

console.log(narrowRelativeTime.format(-3, "day"));

// Narrow style is intended for compact interfaces where space is limited.

// ---------------------------------------------------------------------
// 26. Compare relative-time styles
// ---------------------------------------------------------------------

const relativeTimeStyles: readonly Intl.RelativeTimeFormatOptions["style"][] = ["long", "short", "narrow"];

for (const style of relativeTimeStyles) {
  const formatter = new Intl.RelativeTimeFormat("en-US", {
    numeric: "always",
    style,
  });

  console.log(style, formatter.format(-3, "day"));
}

// Style changes presentation without changing the underlying temporal value.

// ---------------------------------------------------------------------
// 27. Use formatToParts
// ---------------------------------------------------------------------

const partsFormatter = new Intl.RelativeTimeFormat("en-US", {
  numeric: "always",
});

const relativeParts = partsFormatter.formatToParts(-3, "day");

console.log(relativeParts);

// `formatToParts()` exposes structured components of the localized relative-time result.

// ---------------------------------------------------------------------
// 28. Inspect relative-time parts
// ---------------------------------------------------------------------

for (const part of relativeParts) {
  console.log(part.type, part.value);
}

// Parts can be inspected without parsing the localized string manually.

// ---------------------------------------------------------------------
// 29. Find the integer part
// ---------------------------------------------------------------------

const integerPart = relativeParts.find((part) => part.type === "integer");

console.log(integerPart);

// Structured parts allow applications to identify numeric portions of the output.

// ---------------------------------------------------------------------
// 30. Find the relative-time literal
// ---------------------------------------------------------------------

const literalParts = relativeParts.filter((part) => part.type === "literal");

console.log(literalParts);

// Literal parts contain locale-generated text and spacing that should not be reconstructed manually.

// ---------------------------------------------------------------------
// 31. Render relative-time parts
// ---------------------------------------------------------------------

interface RelativeTimePartsProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
}

const RelativeTimeParts: FC<RelativeTimePartsProps> = ({ locale, value, unit }): ReactElement => {
  const parts = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "always",
      }).formatToParts(value, unit),
    [locale, value, unit],
  );

  return (
    <span>
      {parts.map((part, index) => (
        <span key={`${part.type}-${index}`}>{part.value}</span>
      ))}
    </span>
  );
};

// Structured parts can be rendered while preserving the locale's ordering and wording.

// ---------------------------------------------------------------------
// 32. Inspect resolved options
// ---------------------------------------------------------------------

const resolvedFormatter = new Intl.RelativeTimeFormat("de-DE", {
  numeric: "auto",
  style: "short",
});

console.log(resolvedFormatter.resolvedOptions());

// resolvedOptions() exposes the effective locale, numeric mode, style, and other configuration.

// ---------------------------------------------------------------------
// 33. Use locale fallback
// ---------------------------------------------------------------------

const fallbackFormatter = new Intl.RelativeTimeFormat(["fr-CA", "fr-FR", "en-US"], {
  numeric: "auto",
});

console.log(fallbackFormatter.resolvedOptions().locale);

// Multiple requested locales allow the Intl implementation to negotiate a supported locale.

// ---------------------------------------------------------------------
// 34. Use Intl.Locale
// ---------------------------------------------------------------------

const germanLocale = new Intl.Locale("de-DE");
const localeFormatter = new Intl.RelativeTimeFormat(germanLocale, {
  numeric: "auto",
});

console.log(localeFormatter.format(-1, "day"));

// RelativeTimeFormat accepts an Intl.Locale instance as a locale input.

// ---------------------------------------------------------------------
// 35. Check supported locales
// ---------------------------------------------------------------------

const supportedRelativeTimeLocales = Intl.RelativeTimeFormat.supportedLocalesOf(["en-US", "de-DE", "fr-FR"]);

console.log(supportedRelativeTimeLocales);

// supportedLocalesOf() identifies requested locales supported by the implementation.

// ---------------------------------------------------------------------
// 36. Create a reusable formatter function
// ---------------------------------------------------------------------

const formatRelativeTime = (locale: SupportedLocale, value: number, unit: RelativeTimeUnit): string => {
  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(value, unit);
};

console.log(formatRelativeTime("en-US", -1, "day"));
console.log(formatRelativeTime("de-DE", 2, "week"));

// A reusable function can centralize the application's default relative-time options.

// ---------------------------------------------------------------------
// 37. Create a formatter with configurable style
// ---------------------------------------------------------------------

const formatRelativeTimeWithStyle = (
  locale: SupportedLocale,
  value: number,
  unit: RelativeTimeUnit,
  style: "long" | "short" | "narrow",
): string => {
  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style,
  }).format(value, unit);
};

console.log(formatRelativeTimeWithStyle("en-US", -3, "hour", "short"));

// Style can be exposed as an application-level presentation option.

// ---------------------------------------------------------------------
// 38. Keep the value signed
// ---------------------------------------------------------------------

interface RelativeTimeValue {
  readonly value: number;
  readonly unit: RelativeTimeUnit;
}

const pastEvent: RelativeTimeValue = {
  value: -2,
  unit: "day",
};

const futureEvent: RelativeTimeValue = {
  value: 3,
  unit: "day",
};

console.log(pastEvent);
console.log(futureEvent);

// A signed relative value keeps temporal direction explicit.

// ---------------------------------------------------------------------
// 39. Do not encode direction in the unit
// ---------------------------------------------------------------------

const relativeValue: RelativeTimeValue = {
  value: -5,
  unit: "minute",
};

console.log(formatRelativeTime("en-US", relativeValue.value, relativeValue.unit));

// The unit describes the scale; the sign describes past or future.

// ---------------------------------------------------------------------
// 40. Keep relative time separate from absolute time
// ---------------------------------------------------------------------

const eventTimestamp = "2026-09-29T12:00:00Z";

console.log(eventTimestamp);

// An ISO timestamp is an absolute point in time.
// RelativeTimeFormat is applied later when that point is compared with another time.

// ---------------------------------------------------------------------
// 41. Calculate a difference before formatting
// ---------------------------------------------------------------------

const now = new Date("2026-09-29T12:00:00Z");
const eventDate = new Date("2026-09-27T12:00:00Z");

const millisecondsDifference = eventDate.getTime() - now.getTime();

const daysDifference = millisecondsDifference / (24 * 60 * 60 * 1000);

console.log(daysDifference);

// RelativeTimeFormat does not calculate the difference between timestamps.
// The application must provide the numeric relative value.

// ---------------------------------------------------------------------
// 42. Round a temporal difference
// ---------------------------------------------------------------------

const roundedDaysDifference = Math.round(daysDifference);

console.log(roundedDaysDifference);

// The application chooses how to convert a duration into a display unit.
// Rounding is domain or presentation logic outside RelativeTimeFormat.

// ---------------------------------------------------------------------
// 43. Build a unit-selection helper
// ---------------------------------------------------------------------

interface RelativeDifference {
  readonly value: number;
  readonly unit: RelativeTimeUnit;
}

const chooseRelativeUnit = (milliseconds: number): RelativeDifference => {
  const absoluteMilliseconds = Math.abs(milliseconds);
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (absoluteMilliseconds < minute) {
    return {
      value: Math.round(milliseconds / second),
      unit: "second",
    };
  }

  if (absoluteMilliseconds < hour) {
    return {
      value: Math.round(milliseconds / minute),
      unit: "minute",
    };
  }

  if (absoluteMilliseconds < day) {
    return {
      value: Math.round(milliseconds / hour),
      unit: "hour",
    };
  }

  return {
    value: Math.round(milliseconds / day),
    unit: "day",
  };
};

console.log(chooseRelativeUnit(90 * 1000));

console.log(chooseRelativeUnit(-3 * 60 * 60 * 1000));

// Unit selection determines which scale is most appropriate for a relative-time display.

// ---------------------------------------------------------------------
// 44. Format a timestamp as relative time
// ---------------------------------------------------------------------

const formatTimestampRelativeTo = (locale: SupportedLocale, timestamp: Date, reference: Date): string => {
  const difference = timestamp.getTime() - reference.getTime();
  const relativeDifference = chooseRelativeUnit(difference);

  return formatRelativeTime(locale, relativeDifference.value, relativeDifference.unit);
};

console.log(formatTimestampRelativeTo("en-US", new Date("2026-09-28T12:00:00Z"), new Date("2026-09-29T12:00:00Z")));

// The timestamp is converted into a signed difference before localization.

// ---------------------------------------------------------------------
// 45. Keep timestamps in a stable format
// ---------------------------------------------------------------------

const notificationCreatedAt = "2026-09-29T10:30:00Z";

console.log(notificationCreatedAt);

// Store a stable timestamp or numeric instant rather than a pre-localized relative string.

// ---------------------------------------------------------------------
// 46. Do not store "yesterday" as application data
// ---------------------------------------------------------------------

const storedNotification = {
  createdAt: "2026-09-28T10:30:00Z",
};

console.log(storedNotification);

// "Yesterday" depends on the reference time, locale, and display rules.
// The application should store the underlying timestamp instead.

// ---------------------------------------------------------------------
// 47. Recalculate relative time as time passes
// ---------------------------------------------------------------------

const referenceTime = new Date("2026-09-29T12:00:00Z");
const laterReferenceTime = new Date("2026-09-29T12:30:00Z");
const createdAt = new Date("2026-09-29T12:00:00Z");

console.log(formatTimestampRelativeTo("en-US", createdAt, referenceTime));

console.log(formatTimestampRelativeTo("en-US", createdAt, laterReferenceTime));

// Relative time is dynamic because the reference time changes.

// ---------------------------------------------------------------------
// 48. Use React state for a relative-time reference
// ---------------------------------------------------------------------

interface RelativeClockProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
}

const RelativeClock: FC<RelativeClockProps> = ({ locale, value, unit }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <output>{formatter.format(value, unit)}</output>;
};

// The formatter is recreated only when its locale changes.

// ---------------------------------------------------------------------
// 49. Build a relative-time display component
// ---------------------------------------------------------------------

interface RelativeTimeProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
  readonly style?: "long" | "short" | "narrow";
}

const RelativeTime: FC<RelativeTimeProps> = ({ locale, value, unit, style = "long" }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style,
      }),
    [locale, style],
  );

  return <time>{formatter.format(value, unit)}</time>;
};

// The component keeps the signed value and unit as data and delegates wording to Intl.

// ---------------------------------------------------------------------
// 50. Build a relative-time label
// ---------------------------------------------------------------------

interface RelativeTimeLabelProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
  readonly label: string;
}

const RelativeTimeLabel: FC<RelativeTimeLabelProps> = ({ locale, value, unit, label }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <span aria-label={label}>{formatter.format(value, unit)}</span>;
};

// An accessible name can be supplied when surrounding context does not make the meaning clear.

// ---------------------------------------------------------------------
// 51. Build a locale selector
// ---------------------------------------------------------------------

interface RelativeLocaleSelectorProps {
  readonly locale: SupportedLocale;
  readonly onChange: (locale: SupportedLocale) => void;
}

const RelativeLocaleSelector: FC<RelativeLocaleSelectorProps> = ({ locale, onChange }): ReactElement => {
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

// Locale changes affect both wording and grammatical conventions.

// ---------------------------------------------------------------------
// 52. Build a unit selector
// ---------------------------------------------------------------------

interface RelativeUnitSelectorProps {
  readonly unit: RelativeTimeUnit;
  readonly onChange: (unit: RelativeTimeUnit) => void;
}

const RelativeUnitSelector: FC<RelativeUnitSelectorProps> = ({ unit, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as RelativeTimeUnit);
  };

  return (
    <label>
      Unit
      <select value={unit} onChange={handleChange}>
        {supportedUnits.map((supportedUnit) => (
          <option key={supportedUnit} value={supportedUnit}>
            {supportedUnit}
          </option>
        ))}
      </select>
    </label>
  );
};

// The unit is part of the relative temporal value, not part of the locale.

// ---------------------------------------------------------------------
// 53. Build a relative-value input
// ---------------------------------------------------------------------

interface RelativeValueInputProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

const RelativeValueInput: FC<RelativeValueInputProps> = ({ value, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue = Number(event.target.value);

    if (Number.isFinite(nextValue)) {
      onChange(nextValue);
    }
  };

  return (
    <label>
      Value
      <input type="number" value={value} onChange={handleChange} />
    </label>
  );
};

// The signed numeric input controls temporal direction and magnitude.

// ---------------------------------------------------------------------
// 54. Build a configurable relative-time component
// ---------------------------------------------------------------------

interface ConfigurableRelativeTimeProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
  readonly numeric: "always" | "auto";
  readonly style: "long" | "short" | "narrow";
}

const ConfigurableRelativeTime: FC<ConfigurableRelativeTimeProps> = ({
  locale,
  value,
  unit,
  numeric,
  style,
}): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric,
        style,
      }),
    [locale, numeric, style],
  );

  return <output>{formatter.format(value, unit)}</output>;
};

// Formatter options are configuration values and belong in the memoization dependencies.

// ---------------------------------------------------------------------
// 55. Use relative time for notifications
// ---------------------------------------------------------------------

interface NotificationTimeProps {
  readonly locale: SupportedLocale;
  readonly ageInMinutes: number;
}

const NotificationTime: FC<NotificationTimeProps> = ({ locale, ageInMinutes }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style: "short",
      }),
    [locale],
  );

  return <time>{formatter.format(-ageInMinutes, "minute")}</time>;
};

// The data model stores an age in minutes while Intl provides the localized presentation.

// ---------------------------------------------------------------------
// 56. Use relative time for publication dates
// ---------------------------------------------------------------------

interface PublicationTimeProps {
  readonly locale: SupportedLocale;
  readonly daysAgo: number;
}

const PublicationTime: FC<PublicationTimeProps> = ({ locale, daysAgo }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <time>{formatter.format(-daysAgo, "day")}</time>;
};

// Relative time is useful when the exact publication date is less important than temporal recency.

// ---------------------------------------------------------------------
// 57. Use relative time for deadlines
// ---------------------------------------------------------------------

interface DeadlineTimeProps {
  readonly locale: SupportedLocale;
  readonly daysUntil: number;
}

const DeadlineTime: FC<DeadlineTimeProps> = ({ locale, daysUntil }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <time>{formatter.format(daysUntil, "day")}</time>;
};

// Positive values can represent future deadlines when the difference is calculated accordingly.

// ---------------------------------------------------------------------
// 58. Use relative time for activity status
// ---------------------------------------------------------------------

interface ActivityTimeProps {
  readonly locale: SupportedLocale;
  readonly minutesSinceActivity: number;
}

const ActivityTime: FC<ActivityTimeProps> = ({ locale, minutesSinceActivity }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style: "short",
      }),
    [locale],
  );

  return <time>{formatter.format(-minutesSinceActivity, "minute")}</time>;
};

// Relative activity labels can be derived from an underlying timestamp or elapsed duration.

// ---------------------------------------------------------------------
// 59. Use an absolute date alongside relative time
// ---------------------------------------------------------------------

interface RelativeAndAbsoluteTimeProps {
  readonly locale: SupportedLocale;
  readonly timestamp: Date;
  readonly relativeValue: number;
  readonly relativeUnit: RelativeTimeUnit;
}

const RelativeAndAbsoluteTime: FC<RelativeAndAbsoluteTimeProps> = ({
  locale,
  timestamp,
  relativeValue,
  relativeUnit,
}): ReactElement => {
  const relativeFormatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  const absoluteFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  return (
    <time dateTime={timestamp.toISOString()}>
      <span>{relativeFormatter.format(relativeValue, relativeUnit)}</span>
      <span> ({absoluteFormatter.format(timestamp)})</span>
    </time>
  );
};

// Relative and absolute representations can complement each other.
// The absolute timestamp remains available for users who need exact timing.

// ---------------------------------------------------------------------
// 60. Keep the machine-readable time in dateTime
// ---------------------------------------------------------------------

const timestampForMarkup = new Date("2026-09-29T12:00:00Z");

const relativeMarkup = <time dateTime={timestampForMarkup.toISOString()}>yesterday</time>;

console.log(relativeMarkup);

// The `dateTime` attribute can retain an exact machine-readable timestamp while the text is localized.

// ---------------------------------------------------------------------
// 61. Avoid putting localized text into dateTime
// ---------------------------------------------------------------------

const invalidDateTimePattern = {
  text: "yesterday",
  dateTime: timestampForMarkup.toISOString(),
};

console.log(invalidDateTimePattern);

// A localized phrase such as "yesterday" is presentation text.
// The machine-readable value should remain an ISO timestamp or another appropriate date-time value.

// ---------------------------------------------------------------------
// 62. Handle "just now" as an application decision
// ---------------------------------------------------------------------

const formatRecentActivity = (locale: SupportedLocale, secondsAgo: number): string => {
  if (secondsAgo < 5) {
    return locale === "de-DE" ? "gerade eben" : locale === "fr-FR" ? "à l'instant" : "just now";
  }

  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "short",
  }).format(-secondsAgo, "second");
};

console.log(formatRecentActivity("en-US", 2));
console.log(formatRecentActivity("de-DE", 30));

// Product-specific phrases such as "just now" may require explicit translation resources.
// RelativeTimeFormat handles the standardized relative-time units, not arbitrary application wording.

// ---------------------------------------------------------------------
// 63. Keep custom thresholds outside Intl
// ---------------------------------------------------------------------

interface RelativeTimeThresholds {
  readonly seconds: number;
  readonly minutes: number;
  readonly hours: number;
  readonly days: number;
}

const defaultThresholds: RelativeTimeThresholds = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 7,
};

console.log(defaultThresholds);

// Choosing when to switch from seconds to minutes or from days to weeks is an application policy.

// ---------------------------------------------------------------------
// 64. Create a threshold-based formatter
// ---------------------------------------------------------------------

const formatWithThresholds = (locale: SupportedLocale, secondsDifference: number): string => {
  const absoluteSeconds = Math.abs(secondsDifference);

  if (absoluteSeconds < defaultThresholds.seconds) {
    return new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
    }).format(secondsDifference, "second");
  }

  if (absoluteSeconds < defaultThresholds.seconds * defaultThresholds.minutes) {
    return new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
    }).format(Math.round(secondsDifference / 60), "minute");
  }

  if (absoluteSeconds < defaultThresholds.seconds * defaultThresholds.minutes * defaultThresholds.hours) {
    return new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
    }).format(Math.round(secondsDifference / 3600), "hour");
  }

  return new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(Math.round(secondsDifference / 86400), "day");
};

console.log(formatWithThresholds("en-US", -30));
console.log(formatWithThresholds("en-US", -1800));
console.log(formatWithThresholds("en-US", -7200));

// Thresholds determine the selected unit; RelativeTimeFormat determines how that unit is localized.

// ---------------------------------------------------------------------
// 65. Do not confuse duration with calendar-relative time
// ---------------------------------------------------------------------

const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;

console.log(thirtyDaysInMilliseconds);

// A fixed duration of 30 days is not necessarily the same concept as "one month".
// Calendar-relative units such as months and years should be derived according to application semantics.

// ---------------------------------------------------------------------
// 66. Use explicit units when calendar semantics matter
// ---------------------------------------------------------------------

const billingPeriod = {
  value: 1,
  unit: "month" as const,
};

console.log(formatRelativeTime("en-US", billingPeriod.value, billingPeriod.unit));

// If the domain model says "one month", preserve that semantic unit rather than converting it
// to an arbitrary number of days.

// ---------------------------------------------------------------------
// 67. Build a relative-time message component
// ---------------------------------------------------------------------

interface RelativeMessageProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
  readonly prefix?: string;
}

const RelativeMessage: FC<RelativeMessageProps> = ({ locale, value, unit, prefix = "" }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return (
    <span>
      {prefix}
      {formatter.format(value, unit)}
    </span>
  );
};

// Application-specific surrounding text can be composed around the localized relative expression.

// ---------------------------------------------------------------------
// 68. Build a relative-time list
// ---------------------------------------------------------------------

interface RelativeTimeListProps {
  readonly locale: SupportedLocale;
  readonly values: readonly RelativeTimeValue[];
}

const RelativeTimeList: FC<RelativeTimeListProps> = ({ locale, values }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return (
    <ul>
      {values.map((item, index) => (
        <li key={`${item.value}-${item.unit}-${index}`}>{formatter.format(item.value, item.unit)}</li>
      ))}
    </ul>
  );
};

// One formatter can be reused for multiple values with the same locale and options.

// ---------------------------------------------------------------------
// 69. Build a relative-time preview
// ---------------------------------------------------------------------

interface RelativePreviewProps {
  readonly locale: SupportedLocale;
}

const RelativePreview: FC<RelativePreviewProps> = ({ locale }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return (
    <ul>
      <li>{formatter.format(-1, "day")}</li>
      <li>{formatter.format(0, "day")}</li>
      <li>{formatter.format(1, "day")}</li>
      <li>{formatter.format(-2, "week")}</li>
      <li>{formatter.format(3, "month")}</li>
    </ul>
  );
};

// A preview can demonstrate how the same temporal values are localized differently.

// ---------------------------------------------------------------------
// 70. Use relative time with a stable timestamp
// ---------------------------------------------------------------------

interface TimestampRelativeProps {
  readonly locale: SupportedLocale;
  readonly timestamp: string;
  readonly reference: string;
}

const TimestampRelative: FC<TimestampRelativeProps> = ({ locale, timestamp, reference }): ReactElement => {
  const relative = useMemo(() => {
    const timestampDate = new Date(timestamp);
    const referenceDate = new Date(reference);
    const difference = timestampDate.getTime() - referenceDate.getTime();

    return chooseRelativeUnit(difference);
  }, [timestamp, reference]);

  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <time dateTime={timestamp}>{formatter.format(relative.value, relative.unit)}</time>;
};

// ISO timestamps provide stable data while the relative representation is derived at render time.

// ---------------------------------------------------------------------
// 71. Build a locale-aware activity component
// ---------------------------------------------------------------------

interface ActivityProps {
  readonly locale: SupportedLocale;
  readonly createdAt: string;
  readonly referenceTime: string;
}

const Activity: FC<ActivityProps> = ({ locale, createdAt, referenceTime }): ReactElement => {
  const relative = useMemo(() => {
    const createdDate = new Date(createdAt);
    const referenceDate = new Date(referenceTime);
    const difference = createdDate.getTime() - referenceDate.getTime();

    return chooseRelativeUnit(difference);
  }, [createdAt, referenceTime]);

  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style: "short",
      }),
    [locale],
  );

  return <time dateTime={createdAt}>{formatter.format(relative.value, relative.unit)}</time>;
};

// The timestamp remains the source of truth while the relative value is derived from it.

// ---------------------------------------------------------------------
// 72. Build a locale-aware deadline component
// ---------------------------------------------------------------------

interface DeadlineProps {
  readonly locale: SupportedLocale;
  readonly deadline: string;
  readonly referenceTime: string;
}

const Deadline: FC<DeadlineProps> = ({ locale, deadline, referenceTime }): ReactElement => {
  const relative = useMemo(() => {
    const deadlineDate = new Date(deadline);
    const referenceDate = new Date(referenceTime);
    const difference = deadlineDate.getTime() - referenceDate.getTime();

    return chooseRelativeUnit(difference);
  }, [deadline, referenceTime]);

  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <time dateTime={deadline}>{formatter.format(relative.value, relative.unit)}</time>;
};

// A deadline naturally uses a positive difference for future time and a negative difference for past time.

// ---------------------------------------------------------------------
// 73. Build a reusable relative-time hook
// ---------------------------------------------------------------------

const useRelativeTimeFormatter = (
  locale: SupportedLocale,
  options: Intl.RelativeTimeFormatOptions = {},
): Intl.RelativeTimeFormat => {
  return useMemo(() => new Intl.RelativeTimeFormat(locale, options), [locale, options]);
};

// Passing an object literal as `options` on every render would invalidate this memoization.
// Callers should provide a stable options object when using this pattern.

// ---------------------------------------------------------------------
// 74. Prefer explicit formatter options in hooks
// ---------------------------------------------------------------------

const useRelativeFormatter = (
  locale: SupportedLocale,
  numeric: "always" | "auto",
  style: "long" | "short" | "narrow",
): Intl.RelativeTimeFormat => {
  return useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric,
        style,
      }),
    [locale, numeric, style],
  );
};

// Primitive dependencies make formatter memoization predictable.

// ---------------------------------------------------------------------
// 75. Use the hook in a component
// ---------------------------------------------------------------------

interface HookRelativeTimeProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
}

const HookRelativeTime: FC<HookRelativeTimeProps> = ({ locale, value, unit }): ReactElement => {
  const formatter = useRelativeFormatter(locale, "auto", "long");

  return <output>{formatter.format(value, unit)}</output>;
};

// The hook encapsulates formatter construction while the component supplies the temporal data.

// ---------------------------------------------------------------------
// 76. Build an integrated relative-time example
// ---------------------------------------------------------------------

const RelativeTimeExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [value, setValue] = useState(-1);
  const [unit, setUnit] = useState<RelativeTimeUnit>("day");

  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
        style: "long",
      }),
    [locale],
  );

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue = Number(event.target.value);

    if (Number.isFinite(nextValue)) {
      setValue(nextValue);
    }
  };

  const handleUnitChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setUnit(event.target.value as RelativeTimeUnit);
  };

  return (
    <main>
      <h2>Relative Time</h2>

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
        Value
        <input type="number" value={value} onChange={handleValueChange} />
      </label>

      <label>
        Unit
        <select value={unit} onChange={handleUnitChange}>
          {supportedUnits.map((supportedUnit) => (
            <option key={supportedUnit} value={supportedUnit}>
              {supportedUnit}
            </option>
          ))}
        </select>
      </label>

      <output>{formatter.format(value, unit)}</output>
    </main>
  );
};

// The integrated flow is:
// signed numeric value → temporal unit → locale-aware formatter → localized relative expression.

// ---------------------------------------------------------------------
// 77. Understand what RelativeTimeFormat does not do
// ---------------------------------------------------------------------

// RelativeTimeFormat does not:
// - calculate a difference between two timestamps;
// - choose the application's preferred unit;
// - decide when to switch from minutes to hours;
// - decide whether an old date should use an absolute date;
// - perform timezone conversion;
// - determine the current time;
// - translate arbitrary application messages.
//
// The application supplies the temporal value and presentation policy.

// ---------------------------------------------------------------------
// 78. Keep temporal calculations outside localization
// ---------------------------------------------------------------------

const startTime = new Date("2026-09-29T10:00:00Z");
const endTime = new Date("2026-09-29T13:00:00Z");

const elapsedHours = (endTime.getTime() - startTime.getTime()) / (60 * 60 * 1000);

console.log(elapsedHours);

// Temporal arithmetic produces the value.
// RelativeTimeFormat turns that value into localized presentation.

// ---------------------------------------------------------------------
// 79. Keep localization at the presentation boundary
// ---------------------------------------------------------------------

interface LocalizedRelativeValueProps {
  readonly locale: SupportedLocale;
  readonly value: number;
  readonly unit: RelativeTimeUnit;
}

const LocalizedRelativeValue: FC<LocalizedRelativeValueProps> = ({ locale, value, unit }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  return <output>{formatter.format(value, unit)}</output>;
};

// The underlying relative value remains locale-independent.
// Only its final presentation is localized.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default RelativeTimeExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Relative-time localization presents temporal differences according to locale-specific conventions.
// - `Intl.RelativeTimeFormat` is the standard Intl API for localized relative-time expressions.
// - `format()` accepts a signed numeric value and a temporal unit.
// - Negative values represent past-relative values and positive values represent future-relative values.
// - Zero represents the current relative position for the selected unit.
// - Supported units include seconds, minutes, hours, days, weeks, months, quarters, and years.
// - `numeric: "always"` requests explicit numeric relative expressions.
// - `numeric: "auto"` allows locale-specific special forms such as yesterday, today, and tomorrow.
// - `style` supports long, short, and narrow relative-time presentation.
// - `formatToParts()` exposes structured pieces of localized relative-time output.
// - `resolvedOptions()` exposes the effective formatter configuration.
// - `supportedLocalesOf()` identifies requested locales supported by the implementation.
// - RelativeTimeFormat localizes a supplied value; it does not calculate differences between timestamps.
// - Applications must decide how to calculate temporal differences and which unit to display.
// - Unit-selection thresholds are application policy and should remain separate from localization.
// - Calendar-relative units such as months and years should not automatically be treated as fixed durations.
// - Stable timestamps should remain the source of truth rather than storing localized phrases such as "yesterday".
// - Relative-time output can change as the reference time advances and should therefore be recalculated when appropriate.
// - Absolute timestamps can be retained alongside relative text when exact timing is useful.
// - The `dateTime` attribute can preserve a machine-readable timestamp while the visible text is localized.
// - React components can memoize RelativeTimeFormat instances using their locale and primitive options.
// - Number formatting and temporal arithmetic remain separate concerns from relative-time localization.
// - RelativeTimeFormat should be treated as a presentation-layer API rather than a temporal calculation engine.

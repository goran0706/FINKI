/**
 * Date Localization
 * ==================
 *
 * Date localization is the process of presenting dates and times according to a user's locale,
 * calendar, time zone, and regional formatting conventions. The `Intl.DateTimeFormat` API provides
 * locale-sensitive formatting without requiring applications to manually implement date patterns.
 *
 * A JavaScript `Date` represents an instant in time, while `Intl.DateTimeFormat` determines how that
 * instant is presented through a locale, time zone, calendar, and formatting options.
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
// 3. Create a Date instance
// ---------------------------------------------------------------------

const date = new Date("2026-09-29T12:00:00Z");

console.log(date);

// A Date represents an instant in time.
// Its displayed calendar date and clock time depend on the time zone used for formatting.

// ---------------------------------------------------------------------
// 4. Format a date with the default locale
// ---------------------------------------------------------------------

const defaultFormatter = new Intl.DateTimeFormat();

console.log(defaultFormatter.format(date));

// Without an explicit locale or time zone, the result depends on the runtime environment.

// ---------------------------------------------------------------------
// 5. Format a date with an explicit locale
// ---------------------------------------------------------------------

const englishFormatter = new Intl.DateTimeFormat("en-US");

console.log(englishFormatter.format(date));

// Providing a locale makes the formatting convention explicit.

// ---------------------------------------------------------------------
// 6. Compare date formatting across locales
// ---------------------------------------------------------------------

console.log(new Intl.DateTimeFormat("en-US").format(date));
console.log(new Intl.DateTimeFormat("de-DE").format(date));
console.log(new Intl.DateTimeFormat("fr-FR").format(date));

// The same instant can be displayed using different regional date conventions.

// ---------------------------------------------------------------------
// 7. Use dateStyle
// ---------------------------------------------------------------------

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

console.log(longDateFormatter.format(date));

// dateStyle provides predefined combinations of date components.
// Supported styles are "full", "long", "medium", and "short".

// ---------------------------------------------------------------------
// 8. Use the full date style
// ---------------------------------------------------------------------

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
});

console.log(fullDateFormatter.format(date));

// The exact representation of a style is locale-dependent.

// ---------------------------------------------------------------------
// 9. Use the medium date style
// ---------------------------------------------------------------------

const mediumDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

console.log(mediumDateFormatter.format(date));

// Medium formatting provides a shorter representation than the long style.

// ---------------------------------------------------------------------
// 10. Use the short date style
// ---------------------------------------------------------------------

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
});

console.log(shortDateFormatter.format(date));

// Short formatting is useful when compact date presentation is appropriate.

// ---------------------------------------------------------------------
// 11. Format individual date components
// ---------------------------------------------------------------------

const componentFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

console.log(componentFormatter.format(date));

// Individual components provide more control than dateStyle.

// ---------------------------------------------------------------------
// 12. Format a numeric date
// ---------------------------------------------------------------------

const numericDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

console.log(numericDateFormatter.format(date));

// Numeric components can be selected independently when a particular level of detail is required.

// ---------------------------------------------------------------------
// 13. Format only the year and month
// ---------------------------------------------------------------------

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
});

console.log(monthFormatter.format(date));

// Only the requested components are included in the result.

// ---------------------------------------------------------------------
// 14. Format the weekday
// ---------------------------------------------------------------------

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
});

console.log(weekdayFormatter.format(date));

// Weekday formatting is locale-sensitive and can use "long", "short", or "narrow" forms.

// ---------------------------------------------------------------------
// 15. Format a short weekday
// ---------------------------------------------------------------------

const shortWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

console.log(shortWeekdayFormatter.format(date));

// Component options can be combined to create application-specific date presentations.

// ---------------------------------------------------------------------
// 16. Format a time
// ---------------------------------------------------------------------

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(timeFormatter.format(date));

// timeStyle provides predefined combinations of time components.
// The time zone is specified explicitly so the output is deterministic.

// ---------------------------------------------------------------------
// 17. Format date and time together
// ---------------------------------------------------------------------

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(dateTimeFormatter.format(date));

// dateStyle and timeStyle can be combined.
// They should not be combined with individual component options such as year or hour.

// ---------------------------------------------------------------------
// 18. Format hours and minutes explicitly
// ---------------------------------------------------------------------

const hourMinuteFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

console.log(hourMinuteFormatter.format(date));

// Individual time components provide fine-grained control over the output.

// ---------------------------------------------------------------------
// 19. Format seconds
// ---------------------------------------------------------------------

const secondsFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
});

console.log(secondsFormatter.format(date));

// Seconds can be included when the application's domain requires that precision.

// ---------------------------------------------------------------------
// 20. Format fractional seconds
// ---------------------------------------------------------------------

const fractionalSecondsFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  timeZone: "UTC",
});

console.log(fractionalSecondsFormatter.format(date));

// fractionalSecondDigits can display one, two, or three fractional-second digits.

// ---------------------------------------------------------------------
// 21. Use a 12-hour clock
// ---------------------------------------------------------------------

const twelveHourFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

console.log(twelveHourFormatter.format(date));

// hour12 requests a 12-hour representation when supported by the locale.

// ---------------------------------------------------------------------
// 22. Use a 24-hour clock
// ---------------------------------------------------------------------

const twentyFourHourFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

console.log(twentyFourHourFormatter.format(date));

// hour12: false requests a 24-hour representation.

// ---------------------------------------------------------------------
// 23. Format a named time zone
// ---------------------------------------------------------------------

const newYorkFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/New_York",
});

console.log(newYorkFormatter.format(date));

// The same instant can produce a different local date or time when another time zone is selected.

// ---------------------------------------------------------------------
// 24. Format the same instant in another time zone
// ---------------------------------------------------------------------

const tokyoFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

console.log(tokyoFormatter.format(date));

// Time zones change the local representation of an instant.
// The underlying instant represented by `date` does not change.

// ---------------------------------------------------------------------
// 25. Compare several time zones
// ---------------------------------------------------------------------

const timeZones = ["UTC", "America/New_York", "Europe/Berlin", "Asia/Tokyo"] as const;

for (const timeZone of timeZones) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });

  console.log(timeZone, formatter.format(date));
}

// Time-zone identifiers use the IANA time zone database names supported by the runtime.

// ---------------------------------------------------------------------
// 26. Use timeZoneName
// ---------------------------------------------------------------------

const timeZoneNameFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/New_York",
  timeZoneName: "short",
});

console.log(timeZoneNameFormatter.format(date));

// A time zone name can be included when the user needs context about the displayed time.

// ---------------------------------------------------------------------
// 27. Use a long time-zone name
// ---------------------------------------------------------------------

const longTimeZoneNameFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  timeZone: "America/New_York",
  timeZoneName: "long",
});

console.log(longTimeZoneNameFormatter.format(date));

// Long time-zone names provide more descriptive output than short abbreviations.

// ---------------------------------------------------------------------
// 28. Keep the instant and time zone conceptually separate
// ---------------------------------------------------------------------

const instant = new Date("2026-09-29T23:30:00Z");

const utcRepresentation = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
}).format(instant);

const tokyoRepresentation = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
}).format(instant);

console.log(utcRepresentation);
console.log(tokyoRepresentation);

// Both strings represent the same instant.
// Only the time-zone representation differs.

// ---------------------------------------------------------------------
// 29. Avoid manual date formatting
// ---------------------------------------------------------------------

const manualDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

console.log(manualDate);

// Manual formatting does not automatically follow locale-specific conventions.

// ---------------------------------------------------------------------
// 30. Use locale-sensitive formatting instead
// ---------------------------------------------------------------------

const localizedDate = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
}).format(date);

console.log(localizedDate);

// Intl.DateTimeFormat applies the locale's date ordering, names, punctuation, and conventions.

// ---------------------------------------------------------------------
// 31. Use locale arrays for fallback
// ---------------------------------------------------------------------

const fallbackFormatter = new Intl.DateTimeFormat(["fr-CA", "fr-FR", "en-US"], {
  dateStyle: "long",
});

console.log(fallbackFormatter.format(date));

// Multiple locale identifiers allow Intl to negotiate among preferred locales.

// ---------------------------------------------------------------------
// 32. Use an Intl.Locale as the locale source
// ---------------------------------------------------------------------

const locale = new Intl.Locale("de-DE");

const localeFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: "long",
});

console.log(localeFormatter.format(date));

// Intl.DateTimeFormat accepts locale identifiers and Intl.Locale instances.

// ---------------------------------------------------------------------
// 33. Inspect resolved options
// ---------------------------------------------------------------------

const resolvedFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(resolvedFormatter.resolvedOptions());

// resolvedOptions() exposes the effective locale, calendar, time zone, and formatting configuration.

// ---------------------------------------------------------------------
// 34. Format date parts
// ---------------------------------------------------------------------

const dateParts = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).formatToParts(date);

console.log(dateParts);

// formatToParts() returns structured pieces instead of only one final string.

// ---------------------------------------------------------------------
// 35. Inspect individual date parts
// ---------------------------------------------------------------------

for (const part of dateParts) {
  console.log(part.type, part.value);
}

// Each part identifies its semantic type, such as year, month, day, or literal.

// ---------------------------------------------------------------------
// 36. Render selected date parts
// ---------------------------------------------------------------------

const selectedDateParts = dateParts
  .filter((part) => part.type !== "literal")
  .map((part) => `${part.type}=${part.value}`)
  .join(" | ");

console.log(selectedDateParts);

// Structured parts can be used when application markup needs access to individual components.

// ---------------------------------------------------------------------
// 37. Format a date range
// ---------------------------------------------------------------------

const rangeStart = new Date("2026-09-01T12:00:00Z");
const rangeEnd = new Date("2026-09-15T12:00:00Z");

const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

console.log(rangeFormatter.formatRange(rangeStart, rangeEnd));

// formatRange() produces a locale-sensitive representation of the interval and can
// avoid unnecessarily repeating shared date components.

// ---------------------------------------------------------------------
// 38. Format a date-time range
// ---------------------------------------------------------------------

const meetingStart = new Date("2026-09-29T09:00:00Z");
const meetingEnd = new Date("2026-09-29T10:30:00Z");

const meetingRangeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(meetingRangeFormatter.formatRange(meetingStart, meetingEnd));

// DateTimeFormat can format ranges containing both date and time components.

// ---------------------------------------------------------------------
// 39. Format range parts
// ---------------------------------------------------------------------

const rangeParts = rangeFormatter.formatRangeToParts(rangeStart, rangeEnd);

console.log(rangeParts);

// formatRangeToParts() exposes the structured components of a localized date range.

// ---------------------------------------------------------------------
// 40. Identify range source parts
// ---------------------------------------------------------------------

for (const part of rangeParts) {
  console.log(part.type, part.source, part.value);
}

// Range parts can identify whether a value belongs to the start range, end range,
// or shared portion of the formatted result.

// ---------------------------------------------------------------------
// 41. Format only a month
// ---------------------------------------------------------------------

const yearMonthFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  timeZone: "UTC",
});

console.log(yearMonthFormatter.format(date));

// Month-level formatting is useful for reports, billing periods, and archive navigation.

// ---------------------------------------------------------------------
// 42. Format only a day and month
// ---------------------------------------------------------------------

const dayMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

console.log(dayMonthFormatter.format(date));

// Only the requested components are included.

// ---------------------------------------------------------------------
// 43. Format an event label
// ---------------------------------------------------------------------

const eventFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const eventLabel = eventFormatter.format(date);

console.log(`Event date: ${eventLabel}`);

// Intl handles the localized date representation while the application provides surrounding text.

// ---------------------------------------------------------------------
// 44. Format a publication timestamp
// ---------------------------------------------------------------------

const publicationFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const publicationDate = publicationFormatter.format(date);

console.log(`Published: ${publicationDate}`);

// The underlying Date remains a Date; localization is applied only when presenting it.

// ---------------------------------------------------------------------
// 45. Use a user's locale in a React component
// ---------------------------------------------------------------------

interface LocalizedDateProps {
  readonly locale: SupportedLocale;
  readonly value: Date;
}

const LocalizedDate: FC<LocalizedDateProps> = ({ locale, value }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
    [locale],
  );

  return <time dateTime={value.toISOString()}>{formatter.format(value)}</time>;
};

// The locale is a component input, so changing it causes the localized representation to update.

// ---------------------------------------------------------------------
// 46. Use a time element
// ---------------------------------------------------------------------

const TimeElementExample: FC = (): ReactElement => {
  const value = new Date("2026-09-29T12:00:00Z");

  return (
    <time dateTime={value.toISOString()}>
      {new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(value)}
    </time>
  );
};

// The datetime attribute provides a machine-readable representation while the text provides
// localized human-readable presentation.

// ---------------------------------------------------------------------
// 47. Keep the machine-readable value stable
// ---------------------------------------------------------------------

const stableDate = new Date("2026-09-29T12:00:00Z");

const machineReadableValue = stableDate.toISOString();
const humanReadableValue = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(stableDate);

console.log(machineReadableValue);
console.log(humanReadableValue);

// Machine-readable and human-readable representations serve different purposes.
// Localization should normally affect the presentation, not the underlying data.

// ---------------------------------------------------------------------
// 48. Format with a specific calendar
// ---------------------------------------------------------------------

const gregorianFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  calendar: "gregory",
  timeZone: "UTC",
});

console.log(gregorianFormatter.format(date));

// The calendar option controls the calendar used for date presentation.

// ---------------------------------------------------------------------
// 49. Format with a non-Gregorian calendar
// ---------------------------------------------------------------------

const japaneseCalendarFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  calendar: "japanese",
  timeZone: "UTC",
});

console.log(japaneseCalendarFormatter.format(date));

// Intl supports calendar-sensitive presentation when the runtime provides the required locale data.

// ---------------------------------------------------------------------
// 50. Use a numbering system
// ---------------------------------------------------------------------

const arabicNumberingFormatter = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
  numberingSystem: "arab",
  timeZone: "UTC",
});

console.log(arabicNumberingFormatter.format(date));

// Numbering-system options can influence how numeric components are displayed.

// ---------------------------------------------------------------------
// 51. Distinguish locale from time zone
// ---------------------------------------------------------------------

const localeAndZoneFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/New_York",
});

console.log(localeAndZoneFormatter.format(date));

// The locale controls language and regional presentation conventions.
// The time zone controls which local date and time correspond to the instant.

// ---------------------------------------------------------------------
// 52. Use the user's local time zone intentionally
// ---------------------------------------------------------------------

const localTimeZoneFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

console.log(localTimeZoneFormatter.format(date));

// Omitting timeZone allows the runtime's local time zone to determine the representation.
// This is appropriate when the application intends to show the user's local time.

// ---------------------------------------------------------------------
// 53. Use UTC intentionally
// ---------------------------------------------------------------------

const utcFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(utcFormatter.format(date));

// UTC is useful when the application explicitly needs a shared, zone-independent display.

// ---------------------------------------------------------------------
// 54. Choose the time zone based on the domain
// ---------------------------------------------------------------------

interface ScheduledEventProps {
  readonly locale: SupportedLocale;
  readonly timeZone: string;
  readonly startsAt: Date;
}

const ScheduledEvent: FC<ScheduledEventProps> = ({ locale, timeZone, startsAt }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone,
      }),
    [locale, timeZone],
  );

  return <time dateTime={startsAt.toISOString()}>{formatter.format(startsAt)}</time>;
};

// The correct time zone depends on the meaning of the event.
// A user's local zone and an event's venue zone are not necessarily the same.

// ---------------------------------------------------------------------
// 55. Format an event in its venue time zone
// ---------------------------------------------------------------------

const venueEvent = new Date("2026-09-29T18:00:00Z");

const venueFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Berlin",
});

console.log(venueFormatter.format(venueEvent));

// If an event occurs at a physical location, the venue's time zone may be more meaningful
// than the viewer's current time zone.

// ---------------------------------------------------------------------
// 56. Format a remote meeting in the viewer's zone
// ---------------------------------------------------------------------

const meeting = new Date("2026-09-29T18:00:00Z");

const viewerFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

console.log(viewerFormatter.format(meeting));

// For a remote meeting, displaying the instant in the viewer's local time zone can be appropriate.

// ---------------------------------------------------------------------
// 57. Format a recurring calendar date
// ---------------------------------------------------------------------

const recurringDate = new Date("2026-09-29T00:00:00Z");

const recurringDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

console.log(recurringDateFormatter.format(recurringDate));

// Recurring calendar labels can omit the year when the year is not relevant to the UI.

// ---------------------------------------------------------------------
// 58. Use memoization for repeated React formatting
// ---------------------------------------------------------------------

interface EventDateProps {
  readonly locale: SupportedLocale;
  readonly startsAt: Date;
}

const EventDate: FC<EventDateProps> = ({ locale, startsAt }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }),
    [locale],
  );

  return <time dateTime={startsAt.toISOString()}>{formatter.format(startsAt)}</time>;
};

// Reusing a formatter is useful when a component renders frequently with the same configuration.

// ---------------------------------------------------------------------
// 59. Memoize when the time zone is dynamic
// ---------------------------------------------------------------------

interface ZonedDateProps {
  readonly locale: SupportedLocale;
  readonly timeZone: string;
  readonly value: Date;
}

const ZonedDate: FC<ZonedDateProps> = ({ locale, timeZone, value }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone,
      }),
    [locale, timeZone],
  );

  return <time dateTime={value.toISOString()}>{formatter.format(value)}</time>;
};

// Every formatter configuration that affects output should be represented in the memoization dependencies.

// ---------------------------------------------------------------------
// 60. Localize a date range in React
// ---------------------------------------------------------------------

interface DateRangeProps {
  readonly locale: SupportedLocale;
  readonly start: Date;
  readonly end: Date;
}

const DateRange: FC<DateRangeProps> = ({ locale, start, end }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
    [locale],
  );

  return <span>{formatter.formatRange(start, end)}</span>;
};

// formatRange() lets the locale determine how the range should be represented.

// ---------------------------------------------------------------------
// 61. Handle a single-day range
// ---------------------------------------------------------------------

const sameDayStart = new Date("2026-09-29T09:00:00Z");
const sameDayEnd = new Date("2026-09-29T17:00:00Z");

const sameDayFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(sameDayFormatter.formatRange(sameDayStart, sameDayEnd));

// When the requested precision makes shared components identical, formatRange() can avoid
// repeating those components unnecessarily.

// ---------------------------------------------------------------------
// 62. Format an inclusive date interval
// ---------------------------------------------------------------------

const intervalStart = new Date("2026-09-01T00:00:00Z");
const intervalEnd = new Date("2026-09-30T00:00:00Z");

const intervalFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

console.log(intervalFormatter.formatRange(intervalStart, intervalEnd));

// The meaning of whether an interval endpoint is inclusive or exclusive belongs to application
// domain logic; Intl only formats the supplied endpoints.

// ---------------------------------------------------------------------
// 63. Format an invalid date safely
// ---------------------------------------------------------------------

const invalidDate = new Date("not-a-real-date");

console.log(Number.isNaN(invalidDate.getTime()));

// Date validation should happen before passing potentially invalid values to formatting logic.

// ---------------------------------------------------------------------
// 64. Validate a date before formatting
// ---------------------------------------------------------------------

const formatValidDate = (value: Date, locale: SupportedLocale): string => {
  if (Number.isNaN(value.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(value);
};

console.log(formatValidDate(date, "en-US"));
console.log(formatValidDate(invalidDate, "en-US"));

// Validation belongs to application logic; DateTimeFormat is responsible for formatting valid values.

// ---------------------------------------------------------------------
// 65. Avoid parsing localized strings
// ---------------------------------------------------------------------

const localizedString = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
}).format(date);

console.log(localizedString);

// A localized date string is presentation output.
// It should not be treated as a stable interchange format.

// ---------------------------------------------------------------------
// 66. Keep ISO data separate from localized output
// ---------------------------------------------------------------------

const storedDate = "2026-09-29T12:00:00.000Z";
const parsedDate = new Date(storedDate);

const storedDateForDisplay = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(parsedDate);

console.log(storedDate);
console.log(storedDateForDisplay);

// Store or transmit a stable date/time representation, then localize it at the presentation boundary.

// ---------------------------------------------------------------------
// 67. Do not use localized strings as application state
// ---------------------------------------------------------------------

const applicationDate = new Date("2026-09-29T12:00:00Z");

const applicationDateState = {
  value: applicationDate,
  locale: "en-US" as SupportedLocale,
};

console.log(applicationDateState);

// The Date value remains structured data while locale determines its presentation.

// ---------------------------------------------------------------------
// 68. Build a localized date selector
// ---------------------------------------------------------------------

interface DateLocaleSelectorProps {
  readonly locale: SupportedLocale;
  readonly onChange: (locale: SupportedLocale) => void;
}

const DateLocaleSelector: FC<DateLocaleSelectorProps> = ({ locale, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as SupportedLocale);
  };

  return (
    <label>
      Date locale
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

// Locale selection changes presentation without changing the underlying date.

// ---------------------------------------------------------------------
// 69. Build a localized date preview
// ---------------------------------------------------------------------

interface DatePreviewProps {
  readonly locale: SupportedLocale;
}

const DatePreview: FC<DatePreviewProps> = ({ locale }): ReactElement => {
  const value = new Date("2026-09-29T12:00:00Z");

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "UTC",
      }),
    [locale],
  );

  return <time dateTime={value.toISOString()}>{formatter.format(value)}</time>;
};

// The same Date can be rendered differently as the locale changes.

// ---------------------------------------------------------------------
// 70. Build an integrated date-localization component
// ---------------------------------------------------------------------

const DateLocalizationExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const start = new Date("2026-09-29T09:00:00Z");
  const end = new Date("2026-09-29T10:30:00Z");

  const formatters = useMemo(
    () => ({
      date: new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeZone: "UTC",
      }),
      dateTime: new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }),
      month: new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        timeZone: "UTC",
      }),
      range: new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "UTC",
      }),
    }),
    [locale],
  );

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  return (
    <main>
      <h2>Date Localization</h2>

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
        <dt>Date</dt>
        <dd>
          <time dateTime={start.toISOString()}>{formatters.date.format(start)}</time>
        </dd>

        <dt>Date and time</dt>
        <dd>
          <time dateTime={start.toISOString()}>{formatters.dateTime.format(start)}</time>
        </dd>

        <dt>Month</dt>
        <dd>{formatters.month.format(start)}</dd>

        <dt>Range</dt>
        <dd>{formatters.range.formatRange(start, end)}</dd>
      </dl>
    </main>
  );
};

// A single locale state can drive all date and time formatters used by the component.

// ---------------------------------------------------------------------
// 71. Use the correct time zone for a user-local date
// ---------------------------------------------------------------------

interface UserLocalDateProps {
  readonly locale: SupportedLocale;
  readonly value: Date;
}

const UserLocalDate: FC<UserLocalDateProps> = ({ locale, value }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  return <time dateTime={value.toISOString()}>{formatter.format(value)}</time>;
};

// Omitting timeZone intentionally uses the runtime's local time zone.
// This is different from explicitly formatting the instant in UTC.

// ---------------------------------------------------------------------
// 72. Use the venue time zone for an event
// ---------------------------------------------------------------------

interface VenueDateProps {
  readonly locale: SupportedLocale;
  readonly value: Date;
  readonly venueTimeZone: string;
}

const VenueDate: FC<VenueDateProps> = ({ locale, value, venueTimeZone }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: venueTimeZone,
      }),
    [locale, venueTimeZone],
  );

  return <time dateTime={value.toISOString()}>{formatter.format(value)}</time>;
};

// The locale and time zone are independent inputs.
// A German-speaking user can still view an event in New York's time zone.

// ---------------------------------------------------------------------
// 73. Use a stable time zone for server-generated output
// ---------------------------------------------------------------------

const serverSafeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(serverSafeFormatter.format(date));

// Explicit time zones avoid accidental dependence on the machine's local time zone
// when deterministic server output is required.

// ---------------------------------------------------------------------
// 74. Be careful with server and client rendering
// ---------------------------------------------------------------------

const deterministicFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const deterministicOutput = deterministicFormatter.format(date);

console.log(deterministicOutput);

// Server-rendered and client-rendered localized output can differ if they use different
// locale or time-zone defaults. Explicit configuration can reduce such differences.

// ---------------------------------------------------------------------
// 75. Use formatToParts for custom semantic markup
// ---------------------------------------------------------------------

interface DatePartsProps {
  readonly locale: SupportedLocale;
  readonly value: Date;
}

const DateParts: FC<DatePartsProps> = ({ locale, value }): ReactElement => {
  const parts = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
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

// Structured parts can be wrapped in markup without manually reconstructing locale-specific
// punctuation or ordering.

// ---------------------------------------------------------------------
// 76. Avoid hardcoded localized punctuation
// ---------------------------------------------------------------------

const formatterForParts = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const parts = formatterForParts.formatToParts(date);

console.log(parts);

// The application should generally let Intl determine punctuation and component ordering.

// ---------------------------------------------------------------------
// 77. Format dates for different application contexts
// ---------------------------------------------------------------------

const contextFormatters = {
  calendar: new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }),
  details: new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }),
  compact: new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeZone: "UTC",
  }),
};

console.log(contextFormatters.calendar.format(date));
console.log(contextFormatters.details.format(date));
console.log(contextFormatters.compact.format(date));

// Different UI contexts can use different formatting options while sharing the same locale.

// ---------------------------------------------------------------------
// 78. Choose precision based on meaning
// ---------------------------------------------------------------------

const dayPrecisionFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const minutePrecisionFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

console.log(dayPrecisionFormatter.format(date));
console.log(minutePrecisionFormatter.format(date));

// Date precision should reflect the meaning of the value.
// A birthday and a scheduled meeting do not necessarily need the same level of precision.

// ---------------------------------------------------------------------
// 79. Understand the DateTimeFormat boundary
// ---------------------------------------------------------------------

// Input data:
//   Date / supported date-time object
//
// Localization configuration:
//   locale
//   calendar
//   timeZone
//   formatting options
//
// Output:
//   locale-sensitive human-readable text
//
// The formatter should not be responsible for deciding what the date means.
// Application logic should provide the correct instant, calendar context, and time zone.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default DateLocalizationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Intl.DateTimeFormat` provides locale-sensitive date and time formatting.
// - A `Date` represents an instant; locale and time zone determine how that instant is displayed.
// - `dateStyle` and `timeStyle` provide predefined formatting combinations.
// - Individual options such as year, month, day, hour, minute, and second provide finer control.
// - Locale and time zone are separate concepts and should be configured independently.
// - Omitting `timeZone` uses the runtime's local time zone.
// - Explicit time zones such as `UTC` or IANA identifiers make the intended zone clear.
// - `formatToParts()` exposes structured pieces of localized date output.
// - `formatRange()` formats date and time intervals according to locale conventions.
// - `formatRangeToParts()` exposes structured pieces of a localized range.
// - Calendar and numbering-system options can affect date presentation.
// - Localized strings should be treated as presentation output, not stable application data.
// - Stable machine-readable values should remain separate from localized display strings.
// - React components can memoize formatters using locale, time zone, and other formatter configuration as dependencies.
// - The correct time zone depends on the meaning of the date, such as the user's local zone or an event's venue zone.
// - Applications should use Intl instead of manually implementing locale-specific date patterns.

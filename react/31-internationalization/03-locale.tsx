/**
 * Locale
 * ======
 *
 * A locale is an identifier that describes language and regional conventions used
 * when presenting information to users. Locale data can influence text direction,
 * calendars, numbering systems, date and time formatting, sorting, and other
 * language- and region-sensitive behavior.
 *
 * The Intl.Locale API provides a structured representation of a Unicode locale
 * identifier and exposes information about its language, script, region, and
 * locale-related extensions.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What a locale represents
// ---------------------------------------------------------------------

export const LocaleConcept: FC = (): ReactElement => {
  return (
    <section>
      <h1>Locale</h1>

      <p>A locale describes language and regional conventions used when presenting information.</p>
    </section>
  );
};

// A locale is more than a language name.
// It can include regional and other formatting-related information.

// ---------------------------------------------------------------------
// 2. Locale identifiers
// ---------------------------------------------------------------------

export const LocaleIdentifiers: FC = (): ReactElement => {
  return (
    <ul>
      <li>
        <code>en-US</code>
      </li>

      <li>
        <code>en-GB</code>
      </li>

      <li>
        <code>de-DE</code>
      </li>

      <li>
        <code>ja-JP</code>
      </li>
    </ul>
  );
};

// Locale identifiers commonly use BCP 47 language tags.

// ---------------------------------------------------------------------
// 3. Language subtag
// ---------------------------------------------------------------------

export const LanguageSubtag: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US");

  return <p>Language: {locale.language}</p>;
};

// The language subtag identifies the language associated with the locale.

// ---------------------------------------------------------------------
// 4. Region subtag
// ---------------------------------------------------------------------

export const RegionSubtag: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US");

  return <p>Region: {locale.region}</p>;
};

// The region subtag usually identifies a country or geographic region.

// ---------------------------------------------------------------------
// 5. Language and region are different
// ---------------------------------------------------------------------

export const LanguageAndRegion: FC = (): ReactElement => {
  const locales = [new Intl.Locale("en-US"), new Intl.Locale("en-GB")];

  return (
    <ul>
      {locales.map((locale) => (
        <li key={locale.toString()}>{locale.toString()}</li>
      ))}
    </ul>
  );
};

// The same language can have different regional conventions.

// ---------------------------------------------------------------------
// 6. Script subtag
// ---------------------------------------------------------------------

export const ScriptSubtag: FC = (): ReactElement => {
  const locale = new Intl.Locale("sr-Latn-RS");

  return (
    <dl>
      <dt>Language</dt>

      <dd>{locale.language}</dd>

      <dt>Script</dt>

      <dd>{locale.script}</dd>

      <dt>Region</dt>

      <dd>{locale.region}</dd>
    </dl>
  );
};

// A locale can explicitly identify the writing script in addition to language and region.

// ---------------------------------------------------------------------
// 7. Base locale information
// ---------------------------------------------------------------------

export const BaseName: FC = (): ReactElement => {
  const locale = new Intl.Locale("sr-Latn-RS");

  return <p>{locale.baseName}</p>;
};

// baseName contains the core locale information without Unicode extension data.

// ---------------------------------------------------------------------
// 8. Complete locale identifier
// ---------------------------------------------------------------------

export const CompleteLocaleIdentifier: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US-u-ca-gregory");

  return <p>{locale.toString()}</p>;
};

// toString() returns the locale's complete locale identifier.

// ---------------------------------------------------------------------
// 9. Intl.Locale constructor
// ---------------------------------------------------------------------

export const LocaleConstructor: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return <p>{locale.toString()}</p>;
};

// Intl.Locale creates a structured representation of a Unicode locale identifier.
// ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale?utm_source=chatgpt.com))

// ---------------------------------------------------------------------
// 10. Locale objects are not translation dictionaries
// ---------------------------------------------------------------------

export const LocaleIsNotTranslation: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <section>
      <p>Locale: {locale.toString()}</p>

      <p>Translation resources are separate application data.</p>
    </section>
  );
};

// Intl.Locale describes locale information.
// It does not contain an application's translated interface messages.

// ---------------------------------------------------------------------
// 11. Locale language
// ---------------------------------------------------------------------

export const LocaleLanguage: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return <p>{locale.language}</p>;
};

// language returns the language subtag provided by the locale identifier.

// ---------------------------------------------------------------------
// 12. Locale region
// ---------------------------------------------------------------------

export const LocaleRegion: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return <p>{locale.region}</p>;
};

// region returns the region subtag when one is present.

// ---------------------------------------------------------------------
// 13. Locale script
// ---------------------------------------------------------------------

export const LocaleScript: FC = (): ReactElement => {
  const locale = new Intl.Locale("sr-Latn-RS");

  return <p>{locale.script}</p>;
};

// script returns the script subtag when one is present.

// ---------------------------------------------------------------------
// 14. Locale variants
// ---------------------------------------------------------------------

export const LocaleVariants: FC = (): ReactElement => {
  const locale = new Intl.Locale("sl-rozaj");

  return <p>{locale.variants.join(", ")}</p>;
};

// A locale can contain variant subtags that provide additional language or regional distinctions.

// ---------------------------------------------------------------------
// 15. Calendar property
// ---------------------------------------------------------------------

export const LocaleCalendar: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US-u-ca-gregory");

  return <p>Calendar: {locale.calendar}</p>;
};

// The calendar property reflects a calendar specified in the locale identifier.
// It is undefined when no calendar extension was provided.

// ---------------------------------------------------------------------
// 16. Numbering system property
// ---------------------------------------------------------------------

export const LocaleNumberingSystem: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG-u-nu-arab");

  return <p>Numbering system: {locale.numberingSystem}</p>;
};

// The numberingSystem property reflects a numbering-system extension when one was specified.

// ---------------------------------------------------------------------
// 17. Hour cycle property
// ---------------------------------------------------------------------

export const LocaleHourCycle: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US-u-hc-h23");

  return <p>Hour cycle: {locale.hourCycle}</p>;
};

// The hourCycle property reflects the requested hour-cycle extension.

// ---------------------------------------------------------------------
// 18. Unicode extension keys
// ---------------------------------------------------------------------

export const UnicodeExtensions: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US-u-ca-gregory-nu-latn-hc-h23");

  return (
    <dl>
      <dt>Calendar</dt>

      <dd>{locale.calendar}</dd>

      <dt>Numbering system</dt>

      <dd>{locale.numberingSystem}</dd>

      <dt>Hour cycle</dt>

      <dd>{locale.hourCycle}</dd>
    </dl>
  );
};

// Unicode extension keys allow locale identifiers to express additional preferences.

// ---------------------------------------------------------------------
// 19. Locale properties reflect supplied information
// ---------------------------------------------------------------------

export const LocalePropertyDefaults: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US");

  return (
    <section>
      <p>Calendar property: {locale.calendar ?? "not specified"}</p>

      <p>Numbering system: {locale.numberingSystem ?? "not specified"}</p>
    </section>
  );
};

// Intl.Locale does not automatically populate every locale property with its
// runtime default. The property can be undefined when it was not specified.
// ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Internationalization?utm_source=chatgpt.com))

// ---------------------------------------------------------------------
// 20. Resolved locale defaults
// ---------------------------------------------------------------------

export const ResolvedLocaleDefaults: FC = (): ReactElement => {
  const formatter = new Intl.DateTimeFormat("en-US");
  const options = formatter.resolvedOptions();

  return (
    <dl>
      <dt>Locale</dt>

      <dd>{options.locale}</dd>

      <dt>Calendar</dt>

      <dd>{options.calendar}</dd>

      <dt>Numbering system</dt>

      <dd>{options.numberingSystem}</dd>
    </dl>
  );
};

// Intl.Locale describes the identifier.
// Intl formatting APIs can resolve defaults for the operation they perform.
// ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions?utm_source=chatgpt.com))

// ---------------------------------------------------------------------
// 21. toString()
// ---------------------------------------------------------------------

export const LocaleToString: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return <p>{locale.toString()}</p>;
};

// toString() returns the locale identifier represented by the Locale object.

// ---------------------------------------------------------------------
// 22. Locale comparison
// ---------------------------------------------------------------------

export const LocaleComparison: FC = (): ReactElement => {
  const first = new Intl.Locale("en-US");
  const second = new Intl.Locale("en-GB");

  return <p>{first.toString() === second.toString() ? "Same locale" : "Different locales"}</p>;
};

// Locale identifiers can represent different regional conventions even when
// they share the same language.

// ---------------------------------------------------------------------
// 23. Canonicalizing locale identifiers
// ---------------------------------------------------------------------

export const CanonicalLocales: FC = (): ReactElement => {
  const locales = Intl.getCanonicalLocales(["EN-us", "de-de"]);

  return (
    <ul>
      {locales.map((locale) => (
        <li key={locale}>{locale}</li>
      ))}
    </ul>
  );
};

// Intl.getCanonicalLocales() returns canonical Unicode locale identifiers.

// ---------------------------------------------------------------------
// 24. Constructing from canonical identifiers
// ---------------------------------------------------------------------

export const CanonicalLocaleObject: FC = (): ReactElement => {
  const [locale] = Intl.getCanonicalLocales("EN-us");
  const localeObject = new Intl.Locale(locale);

  return <p>{localeObject.toString()}</p>;
};

// Canonicalization can be useful when normalizing locale identifiers at application boundaries.

// ---------------------------------------------------------------------
// 25. Locale maximization
// ---------------------------------------------------------------------

export const MaximizeLocale: FC = (): ReactElement => {
  const locale = new Intl.Locale("en");
  const maximized = locale.maximize();

  return <p>{maximized.toString()}</p>;
};

// maximize() adds likely language, script, and region information according to locale data.

// ---------------------------------------------------------------------
// 26. Locale minimization
// ---------------------------------------------------------------------

export const MinimizeLocale: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-Latn-US");
  const minimized = locale.minimize();

  return <p>{minimized.toString()}</p>;
};

// minimize() attempts to remove redundant language, script, and region information.

// ---------------------------------------------------------------------
// 27. Maximization does not mean translation
// ---------------------------------------------------------------------

export const MaximizeDoesNotTranslate: FC = (): ReactElement => {
  const locale = new Intl.Locale("en").maximize();

  return (
    <section>
      <p>Locale: {locale.toString()}</p>

      <p>Maximization changes locale metadata, not application language content.</p>
    </section>
  );
};

// Locale manipulation changes locale identifiers.
// It does not translate user-facing messages.

// ---------------------------------------------------------------------
// 28. Locale text direction
// ---------------------------------------------------------------------

export const LocaleTextDirection: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG");

  return <p>Direction: {locale.getTextInfo().direction}</p>;
};

// getTextInfo() exposes locale-specific text-direction information.
// ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale?utm_source=chatgpt.com))

// ---------------------------------------------------------------------
// 29. Left-to-right locales
// ---------------------------------------------------------------------

export const LeftToRightLocale: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US");

  return <p dir={locale.getTextInfo().direction}>Left-to-right content.</p>;
};

// The direction can be applied to an element containing localized content.

// ---------------------------------------------------------------------
// 30. Right-to-left locales
// ---------------------------------------------------------------------

export const RightToLeftLocale: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG");

  return <p dir={locale.getTextInfo().direction}>محتوى من اليمين إلى اليسار</p>;
};

// Right-to-left languages require direction-aware presentation.

// ---------------------------------------------------------------------
// 31. Locale calendars
// ---------------------------------------------------------------------

export const LocaleCalendars: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG");

  return (
    <ul>
      {locale.getCalendars().map((calendar) => (
        <li key={calendar}>{calendar}</li>
      ))}
    </ul>
  );
};

// getCalendars() returns calendar identifiers associated with the locale.

// ---------------------------------------------------------------------
// 32. Locale numbering systems
// ---------------------------------------------------------------------

export const LocaleNumberingSystems: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG");

  return (
    <ul>
      {locale.getNumberingSystems().map((numberingSystem) => (
        <li key={numberingSystem}>{numberingSystem}</li>
      ))}
    </ul>
  );
};

// getNumberingSystems() returns numbering-system identifiers associated with the locale.

// ---------------------------------------------------------------------
// 33. Locale hour cycles
// ---------------------------------------------------------------------

export const LocaleHourCycles: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US");

  return (
    <ul>
      {locale.getHourCycles().map((hourCycle) => (
        <li key={hourCycle}>{hourCycle}</li>
      ))}
    </ul>
  );
};

// getHourCycles() reports preferred hour-cycle identifiers for the locale.

// ---------------------------------------------------------------------
// 34. Locale collations
// ---------------------------------------------------------------------

export const LocaleCollations: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <ul>
      {locale.getCollations().map((collation) => (
        <li key={collation}>{collation}</li>
      ))}
    </ul>
  );
};

// getCollations() reports locale-related collation preferences.

// ---------------------------------------------------------------------
// 35. Locale time zones
// ---------------------------------------------------------------------

export const LocaleTimeZones: FC = (): ReactElement => {
  const locale = new Intl.Locale("US");

  return (
    <ul>
      {locale
        .getTimeZones()
        .slice(0, 3)
        .map((timeZone) => (
          <li key={timeZone}>{timeZone}</li>
        ))}
    </ul>
  );
};

// getTimeZones() exposes time-zone identifiers associated with the locale's region
// when locale data provides them.

// ---------------------------------------------------------------------
// 36. Locale week information
// ---------------------------------------------------------------------

export const LocaleWeekInfo: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-GB");
  const weekInfo = locale.getWeekInfo();

  return (
    <dl>
      <dt>First day</dt>

      <dd>{weekInfo.firstDay}</dd>

      <dt>Weekend</dt>

      <dd>{weekInfo.weekend.join(", ")}</dd>

      <dt>Minimal days</dt>

      <dd>{weekInfo.minimalDays}</dd>
    </dl>
  );
};

// getWeekInfo() exposes locale-specific first-day, weekend, and minimal-days data.
// It is newly available across current browsers from July 2026, so applications
// supporting older browsers should account for compatibility.
// ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo?utm_source=chatgpt.com))

// ---------------------------------------------------------------------
// 37. Week information is locale-sensitive
// ---------------------------------------------------------------------

export const LocaleWeekDifference: FC = (): ReactElement => {
  const us = new Intl.Locale("en-US").getWeekInfo();
  const gb = new Intl.Locale("en-GB").getWeekInfo();

  return (
    <section>
      <p>en-US first day: {us.firstDay}</p>

      <p>en-GB first day: {gb.firstDay}</p>
    </section>
  );
};

// Calendar-related assumptions such as the first day of the week should not
// be hard-coded when the application is intended to support multiple locales.

// ---------------------------------------------------------------------
// 38. Locale-aware date formatting
// ---------------------------------------------------------------------

export const LocaleDateFormatting: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(date)}
    </p>
  );
};

// Intl formatting APIs accept locale identifiers and Intl.Locale objects.

// ---------------------------------------------------------------------
// 39. Locale-aware number formatting
// ---------------------------------------------------------------------

export const LocaleNumberFormatting: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return <p>{new Intl.NumberFormat(locale).format(1234567.89)}</p>;
};

// The same numeric value can be displayed according to different locale conventions.

// ---------------------------------------------------------------------
// 40. Locale-aware currency formatting
// ---------------------------------------------------------------------

export const LocaleCurrencyFormatting: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <p>
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }).format(1299.99)}
    </p>
  );
};

// The locale controls presentation while the currency code identifies the monetary unit.

// ---------------------------------------------------------------------
// 41. Resolved formatting locale
// ---------------------------------------------------------------------

export const ResolvedFormattingLocale: FC = (): ReactElement => {
  const formatter = new Intl.NumberFormat("de-XX");
  const options = formatter.resolvedOptions();

  return <p>{options.locale}</p>;
};

// Formatting APIs negotiate requested locales and expose the actually selected
// locale through resolvedOptions().
// ([developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/resolvedOptions?utm_source=chatgpt.com))

// ---------------------------------------------------------------------
// 42. Supported locale detection
// ---------------------------------------------------------------------

export const SupportedLocaleDetection: FC = (): ReactElement => {
  const supported = Intl.DateTimeFormat.supportedLocalesOf(["de-DE", "fr-FR", "ja-JP"]);

  return (
    <ul>
      {supported.map((locale) => (
        <li key={locale}>{locale}</li>
      ))}
    </ul>
  );
};

// supportedLocalesOf() can determine which requested locales a specific Intl
// service supports without formatting a value.

// ---------------------------------------------------------------------
// 43. Locale negotiation
// ---------------------------------------------------------------------

export const LocaleNegotiation: FC = (): ReactElement => {
  const requested = ["de-AT", "de", "en-US"];
  const supported = ["en-US", "de-DE"];

  const selected = Intl.DateTimeFormat.supportedLocalesOf(requested)[0] ?? supported[0];

  return <p>Selected locale: {selected}</p>;
};

// Locale negotiation chooses from requested preferences according to the
// capabilities of the formatting service.
// A production application should define its complete fallback policy.

// ---------------------------------------------------------------------
// 44. Locale matching
// ---------------------------------------------------------------------

export const LocaleMatching: FC = (): ReactElement => {
  const formatter = new Intl.DateTimeFormat(["de-DE", "en-US"], {
    localeMatcher: "best fit",
  });

  return <p>{formatter.resolvedOptions().locale}</p>;
};

// Intl formatting constructors can negotiate requested locales.
// The localeMatcher option can select "lookup" or "best fit".

// ---------------------------------------------------------------------
// 45. Lookup versus best fit
// ---------------------------------------------------------------------

export const LocaleMatcherOptions: FC = (): ReactElement => {
  return (
    <ul>
      <li>
        <code>lookup</code> follows the specified lookup matching algorithm.
      </li>

      <li>
        <code>best fit</code> allows implementation-defined best-fit matching.
      </li>
    </ul>
  );
};

// Locale matching determines how requested locales are matched against supported locales.

// ---------------------------------------------------------------------
// 46. Browser locale preference
// ---------------------------------------------------------------------

export const BrowserLocalePreference: FC = (): ReactElement => {
  const preferredLocales = typeof navigator === "undefined" ? [] : navigator.languages;

  return (
    <ul>
      {preferredLocales.map((locale) => (
        <li key={locale}>{locale}</li>
      ))}
    </ul>
  );
};

// Browser language preferences can inform application locale negotiation.
// They should not automatically override an application's supported-locale policy.

// ---------------------------------------------------------------------
// 47. Runtime locale selection
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE";

export const RuntimeLocaleSelection: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <label htmlFor="locale-selection">Language</label>

      <select
        id="locale-selection"
        value={locale}
        onChange={(event) => {
          setLocale(event.target.value as SupportedLocale);
        }}
      >
        <option value="en-US">English</option>

        <option value="de-DE">Deutsch</option>
      </select>

      <p>Active locale: {locale}</p>
    </section>
  );
};

// The active locale is application state.
// The locale can then be supplied to translation and formatting systems.

// ---------------------------------------------------------------------
// 48. Locale state should use stable identifiers
// ---------------------------------------------------------------------

export const StableLocaleState: FC = (): ReactElement => {
  const [locale] = useState<SupportedLocale>("en-US");

  return <p>{locale}</p>;
};

// Store the locale identifier rather than a translated label such as "English".

// ---------------------------------------------------------------------
// 49. Locale state is not translation state
// ---------------------------------------------------------------------

export const LocaleAndMessages: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  const messages = {
    "en-US": "Save changes",
    "de-DE": "Änderungen speichern",
  } satisfies Record<SupportedLocale, string>;

  return <button type="button">{messages[locale]}</button>;
};

// Locale identifies which localized resources should be used.
// The resources themselves contain the translated content.

// ---------------------------------------------------------------------
// 50. Locale-specific application configuration
// ---------------------------------------------------------------------

type LocaleConfig = {
  readonly locale: SupportedLocale;
  readonly direction: "ltr" | "rtl";
};

const localeConfig: Record<SupportedLocale, LocaleConfig> = {
  "en-US": {
    locale: "en-US",
    direction: "ltr",
  },
  "de-DE": {
    locale: "de-DE",
    direction: "ltr",
  },
};

export const LocaleConfiguration: FC = (): ReactElement => {
  const config = localeConfig["de-DE"];

  return (
    <main dir={config.direction}>
      <p>{config.locale}</p>
    </main>
  );
};

// Application-level locale configuration can group values that must change
// together when the active locale changes.

// ---------------------------------------------------------------------
// 51. Locale-specific direction
// ---------------------------------------------------------------------

type Direction = "ltr" | "rtl";

const getDirection = (locale: string): Direction => {
  return new Intl.Locale(locale).getTextInfo().direction;
};

export const LocaleDirectionHelper: FC = (): ReactElement => {
  const locale = "ar-EG";
  const direction = getDirection(locale);

  return (
    <main dir={direction}>
      <p>Direction: {direction}</p>
    </main>
  );
};

// Direction can be derived from locale information rather than hard-coded
// independently of the selected locale.

// ---------------------------------------------------------------------
// 52. Locale and document direction
// ---------------------------------------------------------------------

export const LocaleDocumentDirection: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG");

  return (
    <section dir={locale.getTextInfo().direction}>
      <h2>Localized content</h2>

      <p>The container direction follows the selected locale.</p>
    </section>
  );
};

// Direction should be applied at an appropriate document or application boundary.

// ---------------------------------------------------------------------
// 53. Locale and HTML language
// ---------------------------------------------------------------------

export const LocaleLanguageAttribute: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <section lang={locale.language}>
      <h2>Lokalisierter Inhalt</h2>
    </section>
  );
};

// The HTML lang attribute identifies the language of the content.
// A complete locale identifier can still be retained separately by the application.

// ---------------------------------------------------------------------
// 54. Locale and language-only metadata
// ---------------------------------------------------------------------

export const LocaleLanguageMetadata: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return <p>Language metadata: {locale.language}</p>;
};

// Some HTML language metadata concerns language rather than the application's
// full locale negotiation state.

// ---------------------------------------------------------------------
// 55. Locale-aware relative time
// ---------------------------------------------------------------------

export const LocaleRelativeTime: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <p>
      {new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }).format(-1, "day")}
    </p>
  );
};

// Locale-aware APIs can consume Intl.Locale objects directly.

// ---------------------------------------------------------------------
// 56. Locale-aware collation
// ---------------------------------------------------------------------

export const LocaleCollation: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");
  const names = ["Zoe", "Änne", "Anna"];

  const sorted = [...names].sort(new Intl.Collator(locale).compare);

  return (
    <ul>
      {sorted.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

// Locale-aware collation should be used when sorting human-language text.

// ---------------------------------------------------------------------
// 57. Locale information versus formatting defaults
// ---------------------------------------------------------------------

export const LocaleInformationVsDefaults: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US");
  const formatter = new Intl.DateTimeFormat(locale);

  return (
    <section>
      <p>Locale calendar property: {locale.calendar ?? "not specified"}</p>

      <p>Formatter calendar: {formatter.resolvedOptions().calendar}</p>
    </section>
  );
};

// The Locale object represents information supplied in its identifier.
// A formatting API resolves the defaults appropriate for its operation.

// ---------------------------------------------------------------------
// 58. Locale and numbering-system formatting
// ---------------------------------------------------------------------

export const LocaleNumberingSystemFormatting: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG-u-nu-arab");

  return <p>{new Intl.NumberFormat(locale).format(123456.78)}</p>;
};

// Unicode locale extensions can influence the behavior of compatible Intl formatters.

// ---------------------------------------------------------------------
// 59. Locale and calendar formatting
// ---------------------------------------------------------------------

export const LocaleCalendarFormatting: FC = (): ReactElement => {
  const locale = new Intl.Locale("ja-JP-u-ca-japanese");
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(date)}
    </p>
  );
};

// Calendar preferences can affect how dates are represented by locale-aware formatters.

// ---------------------------------------------------------------------
// 60. Explicit formatter options can override locale preferences
// ---------------------------------------------------------------------

export const ExplicitFormatterOptions: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US-u-hc-h12");

  return (
    <p>
      {new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        hour12: false,
        timeZone: "UTC",
      }).format(new Date("2026-09-29T12:00:00Z"))}
    </p>
  );
};

// Formatter options can explicitly control aspects that would otherwise be
// influenced by locale preferences.

// ---------------------------------------------------------------------
// 61. Locale extension versus formatter option
// ---------------------------------------------------------------------

export const LocaleExtensionPrecedence: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US-u-ca-islamic");

  const formatter = new Intl.DateTimeFormat(locale, {
    calendar: "gregory",
    timeZone: "UTC",
  });

  return <p>{formatter.resolvedOptions().calendar}</p>;
};

// When both a Unicode extension and an explicit formatter option specify
// the same formatting aspect, the formatter option takes precedence.

// ---------------------------------------------------------------------
// 62. Locale as a reusable value
// ---------------------------------------------------------------------

const applicationLocale = new Intl.Locale("en-US");

export const ReusableLocale: FC = (): ReactElement => {
  return <p>{applicationLocale.toString()}</p>;
};

// A Locale object can be created once and passed to multiple Intl APIs.

// ---------------------------------------------------------------------
// 63. Avoid recreating locale state unnecessarily
// ---------------------------------------------------------------------

export const StableLocaleValue: FC = (): ReactElement => {
  const [locale] = useState(() => new Intl.Locale("en-US"));

  return <p>{locale.toString()}</p>;
};

// When a Locale object is part of React state, lazy initialization avoids
// recreating the initial object on every render.

// ---------------------------------------------------------------------
// 64. Locale parsing
// ---------------------------------------------------------------------

export const LocaleParsing: FC = (): ReactElement => {
  const locale = new Intl.Locale("zh-Hant-TW");

  return (
    <dl>
      <dt>Language</dt>

      <dd>{locale.language}</dd>

      <dt>Script</dt>

      <dd>{locale.script}</dd>

      <dt>Region</dt>

      <dd>{locale.region}</dd>
    </dl>
  );
};

// Intl.Locale parses the structure of a Unicode locale identifier into accessible properties.

// ---------------------------------------------------------------------
// 65. Locale composition
// ---------------------------------------------------------------------

export const LocaleComposition: FC = (): ReactElement => {
  const locale = new Intl.Locale("zh", {
    script: "Hant",
    region: "TW",
  });

  return <p>{locale.toString()}</p>;
};

// The constructor can receive the base language together with additional locale options.

// ---------------------------------------------------------------------
// 66. Locale construction with extensions
// ---------------------------------------------------------------------

export const LocaleConstructionWithExtensions: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-US", {
    hourCycle: "h23",
    calendar: "gregory",
  });

  return <p>{locale.toString()}</p>;
};

// Locale options can add Unicode extension preferences to the resulting identifier.

// ---------------------------------------------------------------------
// 67. Locale immutability by convention
// ---------------------------------------------------------------------

export const LocaleTransformation: FC = (): ReactElement => {
  const locale = new Intl.Locale("en");

  const maximized = locale.maximize();

  return (
    <section>
      <p>Original: {locale.toString()}</p>

      <p>Maximized: {maximized.toString()}</p>
    </section>
  );
};

// Locale transformation methods return Locale objects representing the transformed
// identifier rather than requiring mutation of the original object.

// ---------------------------------------------------------------------
// 68. Locale and application persistence
// ---------------------------------------------------------------------

export const PersistedLocaleConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>A selected locale can be persisted as a stable locale identifier.</p>

      <p>The identifier should be validated against the application's supported locale set when it is read back.</p>
    </section>
  );
};

// Persisted locale values are application input and should not automatically
// be trusted as supported configuration.

// ---------------------------------------------------------------------
// 69. Validate supported locale values
// ---------------------------------------------------------------------

const supportedLocaleSet = new Set<SupportedLocale>(["en-US", "de-DE"]);

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return supportedLocaleSet.has(value as SupportedLocale);
};

export const SupportedLocaleGuard: FC = (): ReactElement => {
  const value = "de-DE";

  return <p>{isSupportedLocale(value) ? `Supported: ${value}` : "Unsupported locale"}</p>;
};

// Runtime locale values should be checked before being used as application configuration.

// ---------------------------------------------------------------------
// 70. Locale selection from external input
// ---------------------------------------------------------------------

export const ExternalLocaleInput: FC = (): ReactElement => {
  const requestedLocale = "de-DE";

  const locale = isSupportedLocale(requestedLocale) ? requestedLocale : "en-US";

  return <p>{locale}</p>;
};

// Locale values can originate from URLs, storage, cookies, user settings,
// or server responses, so applications should validate them.

// ---------------------------------------------------------------------
// 71. Locale and URL parameters
// ---------------------------------------------------------------------

export const LocaleFromUrlConcept: FC = (): ReactElement => {
  return (
    <p>
      A route such as <code>/de-DE/account</code> can carry a locale identifier.
    </p>
  );
};

// A locale can be part of routing state when an application uses localized URLs.
// Routing and locale validation remain separate responsibilities.

// ---------------------------------------------------------------------
// 72. Locale and server configuration
// ---------------------------------------------------------------------

export const ServerLocaleConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>A server can select the initial locale before rendering the page.</p>

      <p>The client should receive consistent locale information for hydration.</p>
    </section>
  );
};

// Server-rendered and client-rendered locale-sensitive output should use compatible
// locale configuration to avoid inconsistent initial UI.

// ---------------------------------------------------------------------
// 73. Locale and accessibility
// ---------------------------------------------------------------------

export const LocaleAccessibility: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <main lang={locale.language}>
      <h1>Kontoeinstellungen</h1>

      <button type="button">Änderungen speichern</button>
    </main>
  );
};

// Locale selection affects language metadata and user-facing accessible content.
// The selected locale must be reflected consistently in the rendered interface.

// ---------------------------------------------------------------------
// 74. Locale and right-to-left accessibility
// ---------------------------------------------------------------------

export const LocaleRtlAccessibility: FC = (): ReactElement => {
  const locale = new Intl.Locale("ar-EG");

  return (
    <main dir={locale.getTextInfo().direction} lang={locale.language}>
      <h1>إعدادات الحساب</h1>
    </main>
  );
};

// Language and direction metadata help user agents and assistive technologies
// interpret localized content correctly.

// ---------------------------------------------------------------------
// 75. Locale-aware component boundary
// ---------------------------------------------------------------------

type LocaleDisplayProps = {
  readonly locale: Intl.Locale;
};

export const LocaleDisplay: FC<LocaleDisplayProps> = ({ locale }): ReactElement => {
  return (
    <dl>
      <dt>Language</dt>

      <dd>{locale.language}</dd>

      <dt>Region</dt>

      <dd>{locale.region ?? "Not specified"}</dd>
    </dl>
  );
};

// Passing a Locale object as a prop keeps locale interpretation separate from
// the component responsible for displaying its information.

// ---------------------------------------------------------------------
// 76. Locale-aware formatting boundary
// ---------------------------------------------------------------------

type PriceProps = {
  readonly locale: Intl.Locale;
  readonly amount: number;
};

export const LocaleAwarePrice: FC<PriceProps> = ({ locale, amount }): ReactElement => {
  const currency = locale.region === "US" ? "USD" : "EUR";

  return (
    <span>
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount)}
    </span>
  );
};

// The component receives canonical numeric data and a locale,
// then performs locale-sensitive formatting at the presentation boundary.

// ---------------------------------------------------------------------
// 77. Avoid deriving currency only from locale
// ---------------------------------------------------------------------

export const ExplicitCurrency: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");
  const currency = "USD";

  return (
    <p>
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(1299.99)}
    </p>
  );
};

// A locale and a currency are separate concepts.
// The user's locale does not necessarily determine the currency of a transaction.

// ---------------------------------------------------------------------
// 78. Locale-sensitive formatting should be explicit
// ---------------------------------------------------------------------

export const ExplicitLocaleFormatting: FC = (): ReactElement => {
  const locale = new Intl.Locale("en-GB");
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(date)}
    </p>
  );
};

// Explicit locale and time-zone choices make formatting behavior easier to reason about,
// test, and reproduce.

// ---------------------------------------------------------------------
// 79. Locale testing
// ---------------------------------------------------------------------

export const LocaleTesting: FC = (): ReactElement => {
  return (
    <ul>
      <li>Test supported language and region combinations.</li>

      <li>Test right-to-left locales where supported.</li>

      <li>Test locale-sensitive dates and numbers.</li>

      <li>Test fallback behavior.</li>

      <li>Test long and short localized strings.</li>

      <li>Test server and client locale consistency.</li>
    </ul>
  );
};

// Locale behavior should be tested using the actual supported locale set,
// including formatting and layout differences.

// ---------------------------------------------------------------------
// 80. Integrated locale example
// ---------------------------------------------------------------------

type ExampleLocale = "en-US" | "de-DE" | "ar-EG";

type LocaleExampleProps = {
  readonly locale: ExampleLocale;
};

const localeMessages: Record<
  ExampleLocale,
  {
    readonly title: string;
    readonly description: string;
  }
> = {
  "en-US": {
    title: "Account settings",
    description: "Manage your account.",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    description: "Verwalten Sie Ihr Konto.",
  },
  "ar-EG": {
    title: "إعدادات الحساب",
    description: "إدارة حسابك.",
  },
};

export const LocaleExample: FC<LocaleExampleProps> = ({ locale }): ReactElement => {
  const localeObject = new Intl.Locale(locale);
  const messages = localeMessages[locale];
  const direction = localeObject.getTextInfo().direction;
  const date = new Date("2026-09-29T12:00:00Z");

  const formattedDate = new Intl.DateTimeFormat(localeObject, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);

  const formattedAmount = new Intl.NumberFormat(localeObject, {
    style: "currency",
    currency: locale === "ar-EG" ? "EGP" : locale === "de-DE" ? "EUR" : "USD",
  }).format(1299.99);

  return (
    <main dir={direction} lang={localeObject.language}>
      <h1>{messages.title}</h1>

      <p>{messages.description}</p>

      <dl>
        <dt>Date</dt>

        <dd>{formattedDate}</dd>

        <dt>Amount</dt>

        <dd>{formattedAmount}</dd>
      </dl>
    </main>
  );
};

export default LocaleExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A locale identifies language and regional conventions used by an application.
// - Locale identifiers commonly use BCP 47 language tags.
// - A locale can contain language, script, region, variant, and Unicode extension subtags.
// - Intl.Locale provides a structured representation of a Unicode locale identifier.
// - language, script, region, variants, calendar, numberingSystem, and hourCycle expose locale information supplied by the identifier.
// - Intl.Locale properties do not necessarily contain runtime defaults when those values were not explicitly supplied.
// - Intl formatting APIs resolve operation-specific defaults through methods such as resolvedOptions().
// - toString() returns the complete locale identifier represented by the Locale object.
// - Intl.getCanonicalLocales() provides canonical locale identifiers.
// - maximize() adds likely language, script, and region information.
// - minimize() attempts to remove information that can be inferred from the locale.
// - Locale transformations affect locale identifiers and do not translate application content.
// - getTextInfo() provides locale-specific writing-direction information.
// - getCalendars(), getNumberingSystems(), getHourCycles(), getCollations(), and getTimeZones() expose locale-related information.
// - getWeekInfo() provides locale-specific first-day, weekend, and minimal-days information.
// - Locale-sensitive formatting should use the Intl APIs rather than manually constructing localized strings.
// - DateTimeFormat, NumberFormat, RelativeTimeFormat, Collator, and related Intl APIs can consume locale information.
// - Explicit formatter options can override corresponding locale preferences.
// - Locale negotiation chooses an available locale from the user's requested preferences and the application's supported locales.
// - Browser language preferences can inform locale selection but should not be treated as the application's supported-locale policy.
// - Application locale state should use stable locale identifiers rather than translated display labels.
// - Locale configuration and translation resources are separate concerns.
// - A locale can influence text direction, but language, direction, formatting, and translation remain distinct concepts.
// - Locale values originating from external input should be validated against the application's supported locale set.
// - Locale and currency are separate concepts; a user's locale does not necessarily determine the currency of a transaction.
// - Locale-sensitive rendering should be consistent between server and client when server-side rendering is used.
// - Locale testing should include formatting, fallback behavior, direction, accessibility metadata, and supported locale combinations.

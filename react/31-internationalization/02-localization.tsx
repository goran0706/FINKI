/**
 * Localization
 * =============
 *
 * Localization (l10n) is the process of adapting an application for a particular
 * language, locale, culture, and regional context. It includes translating user-facing
 * content and presenting dates, numbers, currencies, lists, and other information
 * according to the conventions expected by the target audience.
 *
 * Localization is broader than translating visible words. A localized interface
 * must also account for text length, formatting conventions, writing direction,
 * accessible names, validation messages, and other user-facing details.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What localization means
// ---------------------------------------------------------------------

export const LocalizationConcept: FC = (): ReactElement => {
  return (
    <section>
      <h1>Localization</h1>

      <p>
        Localization adapts an application to the language, locale, and conventions expected by a particular audience.
      </p>
    </section>
  );
};

// Localization is commonly abbreviated as l10n.
// The "10" represents the number of letters between "l" and "n".

// ---------------------------------------------------------------------
// 2. Localization is more than translation
// ---------------------------------------------------------------------

export const LocalizationBeyondTranslation: FC = (): ReactElement => {
  return (
    <section>
      <ul>
        <li>Translate user-facing messages.</li>

        <li>Format dates and times.</li>

        <li>Format numbers and currencies.</li>

        <li>Adapt writing direction.</li>

        <li>Support locale-specific conventions.</li>
      </ul>
    </section>
  );
};

// Translation handles language-dependent text.
// Localization also handles presentation and cultural conventions associated with a locale.

// ---------------------------------------------------------------------
// 3. Localization versus internationalization
// ---------------------------------------------------------------------

export const LocalizationAndInternationalization: FC = (): ReactElement => {
  return (
    <section>
      <p>Internationalization prepares software to support different languages and locales.</p>

      <p>Localization adapts that software for a particular target locale.</p>
    </section>
  );
};

// Internationalization is the architectural preparation.
// Localization is the locale-specific adaptation.

// ---------------------------------------------------------------------
// 4. Locale
// ---------------------------------------------------------------------

export const LocalizationLocale: FC = (): ReactElement => {
  return (
    <section>
      <p>
        Example locale: <code>en-US</code>
      </p>

      <p>
        Another locale: <code>de-DE</code>
      </p>
    </section>
  );
};

// A locale identifies language and regional conventions.
// The same language can have different regional conventions.

// ---------------------------------------------------------------------
// 5. Language and region can differ
// ---------------------------------------------------------------------

export const LanguageAndRegion: FC = (): ReactElement => {
  return (
    <section>
      <p>
        <code>en-US</code> and <code>en-GB</code> both use English, but can use different regional conventions.
      </p>
    </section>
  );
};

// Localization should not assume that a language corresponds to only one region.

// ---------------------------------------------------------------------
// 6. Translation resources
// ---------------------------------------------------------------------

const resources = {
  "en-US": {
    title: "Account settings",
    save: "Save changes",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    save: "Änderungen speichern",
  },
} as const;

export const TranslationResources: FC = (): ReactElement => {
  return (
    <section>
      <h2>{resources["en-US"].title}</h2>

      <button type="button">{resources["en-US"].save}</button>
    </section>
  );
};

// Translation resources keep localized messages outside component logic.

// ---------------------------------------------------------------------
// 7. Selecting a resource
// ---------------------------------------------------------------------

type SupportedLocale = keyof typeof resources;

export const ResourceSelection: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const messages = resources[locale];

  return (
    <section>
      <h2>{messages.title}</h2>

      <button type="button">{messages.save}</button>
    </section>
  );
};

// The active locale determines which localized resource is selected.

// ---------------------------------------------------------------------
// 8. Changing the locale
// ---------------------------------------------------------------------

export const LocaleSwitcher: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const messages = resources[locale];

  return (
    <section>
      <label htmlFor="language">Language</label>

      <select
        id="language"
        value={locale}
        onChange={(event) => {
          setLocale(event.target.value as SupportedLocale);
        }}
      >
        <option value="en-US">English</option>

        <option value="de-DE">Deutsch</option>
      </select>

      <h2>{messages.title}</h2>

      <button type="button">{messages.save}</button>
    </section>
  );
};

// Locale switching changes the resource used for subsequent rendering.

// ---------------------------------------------------------------------
// 9. Locale fallback
// ---------------------------------------------------------------------

const fallbackResources: Record<string, { readonly welcome: string }> = {
  "en-US": {
    welcome: "Welcome",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

export const LocaleFallback: FC = (): ReactElement => {
  const requestedLocale = "fr-FR";

  const messages = fallbackResources[requestedLocale] ?? fallbackResources["en-US"];

  return <p>{messages.welcome}</p>;
};

// A localization system needs an explicit strategy for unsupported locales.
// Falling back to a known locale prevents missing interface content.

// ---------------------------------------------------------------------
// 10. Fallback should be deliberate
// ---------------------------------------------------------------------

export const DeliberateFallback: FC = (): ReactElement => {
  return (
    <section>
      <p>Missing translations should follow a defined fallback policy.</p>

      <p>The policy should not depend on accidental object lookup behavior.</p>
    </section>
  );
};

// A fallback may use a default locale, a language-level resource, or another
// application-specific strategy.

// ---------------------------------------------------------------------
// 11. Language-level fallback
// ---------------------------------------------------------------------

export const LanguageFallback: FC = (): ReactElement => {
  const requestedLocale = "de-AT";
  const language = requestedLocale.split("-")[0];

  return (
    <p>
      Requested locale: {requestedLocale}; language: {language}
    </p>
  );
};

// A system can fall back from a regional locale to a broader language resource
// when an exact regional resource is unavailable.

// ---------------------------------------------------------------------
// 12. Translation keys
// ---------------------------------------------------------------------

const translationKeys = {
  pageTitle: "account.settings.title",
  saveButton: "account.settings.save",
} as const;

export const TranslationKeys: FC = (): ReactElement => {
  return (
    <section>
      <p>{translationKeys.pageTitle}</p>

      <p>{translationKeys.saveButton}</p>
    </section>
  );
};

// Stable translation keys decouple application code from the source-language wording.

// ---------------------------------------------------------------------
// 13. Meaningful translation keys
// ---------------------------------------------------------------------

const meaningfulKeys = {
  checkoutSubmit: "checkout.submit",
  profileSave: "profile.save",
} as const;

export const MeaningfulTranslationKeys: FC = (): ReactElement => {
  return (
    <section>
      <p>{meaningfulKeys.checkoutSubmit}</p>

      <p>{meaningfulKeys.profileSave}</p>
    </section>
  );
};

// Meaningful keys communicate the purpose and context of a message.

// ---------------------------------------------------------------------
// 14. Avoid using translated text as logic
// ---------------------------------------------------------------------

export const StableApplicationState: FC = (): ReactElement => {
  const action = "save";

  return <button type="button">{action === "save" ? "Save changes" : "Cancel"}</button>;
};

// Application logic should use stable identifiers or domain values,
// not compare localized strings such as "Save" or "Speichern".

// ---------------------------------------------------------------------
// 15. Complete message translation
// ---------------------------------------------------------------------

export const CompleteMessage: FC = (): ReactElement => {
  const name = "John Doe";

  return <p>{`Welcome, ${name}.`}</p>;
};

// Translators may need to change word order or grammatical structure.
// Localization systems should therefore support complete message translation.

// ---------------------------------------------------------------------
// 16. Message interpolation
// ---------------------------------------------------------------------

type MessageValues = {
  readonly name: string;
};

const createWelcomeMessage = ({ name }: MessageValues): string => {
  return `Welcome, ${name}.`;
};

export const MessageInterpolation: FC = (): ReactElement => {
  return <p>{createWelcomeMessage({ name: "John Doe" })}</p>;
};

// Dynamic values can be inserted into a localized message through interpolation.

// ---------------------------------------------------------------------
// 17. Avoid sentence fragments
// ---------------------------------------------------------------------

export const SentenceFragmentProblem: FC = (): ReactElement => {
  const name = "John Doe";

  return <p>Hello {name}</p>;
};

// Splitting a sentence into separately translated fragments can make grammatical
// reordering difficult for languages with different sentence structures.

// ---------------------------------------------------------------------
// 18. Localize button labels
// ---------------------------------------------------------------------

export const LocalizedButton: FC = (): ReactElement => {
  const label = resources["en-US"].save;

  return <button type="button">{label}</button>;
};

// Button labels are user-facing text and must be included in localization resources.

// ---------------------------------------------------------------------
// 19. Localize navigation
// ---------------------------------------------------------------------

export const LocalizedNavigation: FC = (): ReactElement => {
  const messages = {
    home: "Home",
    products: "Products",
    account: "Account",
  };

  return (
    <nav aria-label="Primary">
      <a href="/">{messages.home}</a>

      <a href="/products">{messages.products}</a>

      <a href="/account">{messages.account}</a>
    </nav>
  );
};

// Navigation labels, link text, and landmark names are part of the localized UI.

// ---------------------------------------------------------------------
// 20. Localize headings
// ---------------------------------------------------------------------

export const LocalizedHeading: FC = (): ReactElement => {
  return (
    <section>
      <h1>Account settings</h1>

      <p>Update your account information.</p>
    </section>
  );
};

// Headings should be translated along with the content they introduce.

// ---------------------------------------------------------------------
// 21. Localize accessible names
// ---------------------------------------------------------------------

export const LocalizedAccessibleName: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// Accessible names are user-facing content and should be localized.
// Localization must not remove or replace accessibility semantics.

// ---------------------------------------------------------------------
// 22. Localize descriptions
// ---------------------------------------------------------------------

export const LocalizedDescription: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="password">Password</label>

      <input id="password" type="password" aria-describedby="password-help" />

      <p id="password-help">Use at least eight characters.</p>
    </form>
  );
};

// Supporting descriptions and instructions must be localized as well as labels.

// ---------------------------------------------------------------------
// 23. Localize validation messages
// ---------------------------------------------------------------------

export const LocalizedValidation: FC = (): ReactElement => {
  return <p role="alert">Enter a valid email address.</p>;
};

// Validation messages are part of the user's task and must be understandable
// in the active language.

// ---------------------------------------------------------------------
// 24. Localize status messages
// ---------------------------------------------------------------------

export const LocalizedStatus: FC = (): ReactElement => {
  return <p role="status">Settings saved.</p>;
};

// Asynchronous status messages should be localized without losing their
// appropriate semantic role.

// ---------------------------------------------------------------------
// 25. Localize placeholders carefully
// ---------------------------------------------------------------------

export const LocalizedPlaceholder: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="search">Search</label>

      <input id="search" name="search" placeholder="Search products" />
    </form>
  );
};

// A placeholder is user-facing text and may need localization.
// It should not replace a proper accessible label.

// ---------------------------------------------------------------------
// 26. Localize document titles
// ---------------------------------------------------------------------

export const LocalizedTitleConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Account settings</p>
    </section>
  );
};

// Browser document titles are also user-facing content and should be localized
// when the surrounding application supports multiple languages.

// ---------------------------------------------------------------------
// 27. Localize empty states
// ---------------------------------------------------------------------

export const LocalizedEmptyState: FC = (): ReactElement => {
  return (
    <section>
      <h2>Search results</h2>

      <p>No matching results were found.</p>

      <button type="button">Clear search</button>
    </section>
  );
};

// Empty-state explanations and recovery actions should be localized together.

// ---------------------------------------------------------------------
// 28. Localize loading states
// ---------------------------------------------------------------------

export const LocalizedLoadingState: FC = (): ReactElement => {
  return <p role="status">Loading results...</p>;
};

// Loading messages are user-facing content and should use the active locale.

// ---------------------------------------------------------------------
// 29. Localize error states
// ---------------------------------------------------------------------

export const LocalizedErrorState: FC = (): ReactElement => {
  return (
    <section>
      <h2>Unable to load results</h2>

      <p>Try again later.</p>

      <button type="button">Retry</button>
    </section>
  );
};

// Error explanations and recovery actions must remain understandable after localization.

// ---------------------------------------------------------------------
// 30. Text expansion
// ---------------------------------------------------------------------

export const TextExpansion: FC = (): ReactElement => {
  return (
    <button type="button" className="flexible-button">
      Save changes
    </button>
  );
};

// Translated strings can be longer than their source strings.
// Layouts should allow content to expand instead of assuming one fixed text length.

// ---------------------------------------------------------------------
// 31. Avoid fixed text widths
// ---------------------------------------------------------------------

export const FlexibleLocalizedLayout: FC = (): ReactElement => {
  return (
    <div className="localized-content">
      <p>Localized content should be allowed to wrap naturally.</p>
    </div>
  );
};

// Fixed widths and aggressive text truncation can hide translated content.

// ---------------------------------------------------------------------
// 32. Test long translations
// ---------------------------------------------------------------------

export const LongTranslationTesting: FC = (): ReactElement => {
  return (
    <section>
      <h2>This heading represents a longer translated version of the source text.</h2>

      <p>Test realistic translated strings rather than only short development placeholders.</p>
    </section>
  );
};

// Localization testing should include strings that expose wrapping, overflow,
// clipping, and control-sizing problems.

// ---------------------------------------------------------------------
// 33. Text direction
// ---------------------------------------------------------------------

export const LocalizedDirection: FC = (): ReactElement => {
  return (
    <main dir="rtl">
      <h1>Example content</h1>

      <p>Direction can change according to the language and writing system.</p>
    </main>
  );
};

// Some localized interfaces use right-to-left direction.
// Direction is a document and layout concern, not merely a translation concern.

// ---------------------------------------------------------------------
// 34. Logical CSS properties
// ---------------------------------------------------------------------

export const LogicalProperties: FC = (): ReactElement => {
  return <div className="logical-layout">Example content</div>;
};

// Prefer CSS logical properties such as margin-inline-start and
// padding-inline-end when layout should adapt to writing direction.

// ---------------------------------------------------------------------
// 35. Avoid directional assumptions
// ---------------------------------------------------------------------

export const DirectionIndependentLayout: FC = (): ReactElement => {
  return (
    <section>
      <p>The interface should not assume that left is always the start of a localized layout.</p>
    </section>
  );
};

// Physical left/right assumptions can become incorrect when the interface
// supports right-to-left writing.

// ---------------------------------------------------------------------
// 36. Date localization
// ---------------------------------------------------------------------

export const LocalizedDate: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("de-DE", {
        dateStyle: "long",
      }).format(date)}
    </p>
  );
};

// Intl.DateTimeFormat formats dates and times according to a locale and options.
// :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 37. Time-zone awareness
// ---------------------------------------------------------------------

export const LocalizedDateTime: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(date)}
    </p>
  );
};

// Locale controls presentation conventions; timeZone controls which time zone
// is used when formatting a date-time value.

// ---------------------------------------------------------------------
// 38. Number localization
// ---------------------------------------------------------------------

export const LocalizedNumber: FC = (): ReactElement => {
  const value = 1234567.89;

  return <p>{new Intl.NumberFormat("de-DE").format(value)}</p>;
};

// Intl.NumberFormat applies locale-sensitive number formatting.
// :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 39. Currency localization
// ---------------------------------------------------------------------

export const LocalizedCurrency: FC = (): ReactElement => {
  const amount = 1299.99;

  return (
    <p>
      {new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(amount)}
    </p>
  );
};

// Currency presentation depends on both the currency code and the locale.
// :contentReference[oaicite:2]{index=2}

// ---------------------------------------------------------------------
// 40. Percent localization
// ---------------------------------------------------------------------

export const LocalizedPercent: FC = (): ReactElement => {
  const completion = 0.875;

  return (
    <p>
      {new Intl.NumberFormat("en-US", {
        style: "percent",
      }).format(completion)}
    </p>
  );
};

// Percent formatting handles locale-sensitive presentation instead of requiring
// manual multiplication and string construction.

// ---------------------------------------------------------------------
// 41. Unit localization
// ---------------------------------------------------------------------

export const LocalizedUnit: FC = (): ReactElement => {
  const distance = 12.5;

  return (
    <p>
      {new Intl.NumberFormat("en-US", {
        style: "unit",
        unit: "kilometer",
        unitDisplay: "long",
      }).format(distance)}
    </p>
  );
};

// Intl.NumberFormat can also format supported units according to locale conventions.

// ---------------------------------------------------------------------
// 42. Relative time localization
// ---------------------------------------------------------------------

export const LocalizedRelativeTime: FC = (): ReactElement => {
  const formatter = new Intl.RelativeTimeFormat("en-US", {
    numeric: "auto",
  });

  return <p>{formatter.format(-1, "day")}</p>;
};

// Relative-time wording and pluralization are locale-sensitive.
// Intl.RelativeTimeFormat handles these conventions.

// ---------------------------------------------------------------------
// 43. List localization
// ---------------------------------------------------------------------

export const LocalizedList: FC = (): ReactElement => {
  const formatter = new Intl.ListFormat("en-US", {
    style: "long",
    type: "conjunction",
  });

  return <p>{formatter.format(["apples", "bananas", "oranges"])}</p>;
};

// Intl.ListFormat produces locale-aware list separators and conjunctions.

// ---------------------------------------------------------------------
// 44. Pluralization
// ---------------------------------------------------------------------

export const LocalizedPluralization: FC = (): ReactElement => {
  const count = 3;
  const category = new Intl.PluralRules("en-US").select(count);

  return <p>{category === "one" ? `${count} item` : `${count} items`}</p>;
};

// Plural categories are language-dependent.
// An English singular/plural condition should not be generalized to every locale.

// ---------------------------------------------------------------------
// 45. Locale-sensitive sorting
// ---------------------------------------------------------------------

export const LocalizedSorting: FC = (): ReactElement => {
  const names = ["Zoe", "Åsa", "Ana"];

  const sorted = [...names].sort(new Intl.Collator("de-DE").compare);

  return (
    <ul>
      {sorted.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

// Human-language sorting should use locale-aware collation when linguistic
// ordering matters.

// ---------------------------------------------------------------------
// 46. Intl.Locale
// ---------------------------------------------------------------------

export const LocaleInformation: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <dl>
      <dt>Language</dt>

      <dd>{locale.language}</dd>

      <dt>Region</dt>

      <dd>{locale.region}</dd>
    </dl>
  );
};

// Intl.Locale provides structured information about a locale identifier.

// ---------------------------------------------------------------------
// 47. Locale canonicalization
// ---------------------------------------------------------------------

export const CanonicalLocale: FC = (): ReactElement => {
  const [locale] = useState(Intl.getCanonicalLocales("EN-us")[0]);

  return <p>{locale}</p>;
};

// Locale identifiers can have canonical representations.
// Intl.getCanonicalLocales() provides standardized canonicalization behavior.

// ---------------------------------------------------------------------
// 48. Supported locales
// ---------------------------------------------------------------------

export const SupportedLocales: FC = (): ReactElement => {
  const supported = Intl.DateTimeFormat.supportedLocalesOf(["de-DE", "fr-FR", "ja-JP"]);

  return (
    <ul>
      {supported.map((locale) => (
        <li key={locale}>{locale}</li>
      ))}
    </ul>
  );
};

// supportedLocalesOf() identifies requested locales supported by a particular
// Intl service without requiring the application to assume every runtime has
// identical locale support.

// ---------------------------------------------------------------------
// 49. User language preferences
// ---------------------------------------------------------------------

export const UserLanguagePreferences: FC = (): ReactElement => {
  return (
    <section>
      <p>A browser can expose the user's preferred language list through navigator.languages.</p>
    </section>
  );
};

// Browsers expose language preferences through navigator.language and
// navigator.languages. Applications can use these values during locale negotiation.
// :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 50. Locale negotiation
// ---------------------------------------------------------------------

export const LocaleNegotiation: FC = (): ReactElement => {
  const requestedLocales = ["de-AT", "de", "en-US"];
  const supportedLocales = ["en-US", "de-DE"];

  const selectedLocale =
    requestedLocales.find((requested) =>
      supportedLocales.some((supported) => supported.toLowerCase() === requested.toLowerCase()),
    ) ?? "en-US";

  return <p>Selected locale: {selectedLocale}</p>;
};

// Locale negotiation chooses an available application locale from requested
// preferences. A production implementation should use a well-defined matching strategy.

// ---------------------------------------------------------------------
// 51. Do not equate browser locale with application locale
// ---------------------------------------------------------------------

export const ApplicationLocalePolicy: FC = (): ReactElement => {
  return (
    <section>
      <p>
        The browser's preferred language can inform locale selection, but the application still needs its own
        supported-locale policy.
      </p>
    </section>
  );
};

// An application may support fewer locales than the browser exposes.
// Preference detection and application support are separate concerns.

// ---------------------------------------------------------------------
// 52. Localization and domain values
// ---------------------------------------------------------------------

type Product = {
  readonly name: string;
  readonly price: number;
};

const product: Product = {
  name: "Example product",
  price: 1299.99,
};

export const LocaleNeutralDomainValue: FC = (): ReactElement => {
  return <p>{product.name}</p>;
};

// Domain data should normally remain independent of presentation locale.

// ---------------------------------------------------------------------
// 53. Format at the presentation boundary
// ---------------------------------------------------------------------

export const PresentationFormatting: FC = (): ReactElement => {
  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  return (
    <p>
      {product.name}: {formattedPrice}
    </p>
  );
};

// Keep the numeric domain value intact and format it only when displaying it.

// ---------------------------------------------------------------------
// 54. Do not store formatted data as canonical data
// ---------------------------------------------------------------------

export const CanonicalDataBoundary: FC = (): ReactElement => {
  const amount = 1299.99;

  return (
    <section>
      <p>Canonical amount: {amount}</p>

      <p>
        Displayed amount:{" "}
        {new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(amount)}
      </p>
    </section>
  );
};

// A formatted string is presentation output.
// The underlying value should remain available for calculations and reformatting.

// ---------------------------------------------------------------------
// 55. Locale-specific text length
// ---------------------------------------------------------------------

export const LocaleTextLength: FC = (): ReactElement => {
  return (
    <div className="localized-card">
      <h2>Account settings</h2>

      <button type="button">Save changes</button>
    </div>
  );
};

// UI components should be resilient to text expansion and contraction.

// ---------------------------------------------------------------------
// 56. Avoid truncating translated messages
// ---------------------------------------------------------------------

export const AvoidTranslationTruncation: FC = (): ReactElement => {
  return (
    <p>Localized content should remain available even when the translation requires more space than the source text.</p>
  );
};

// Fixed-height containers, forced single-line text, and aggressive ellipsis can
// make localized content inaccessible or incomplete.

// ---------------------------------------------------------------------
// 57. Localized dates should not be manually assembled
// ---------------------------------------------------------------------

export const NoManualDateAssembly: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)}
    </p>
  );
};

// Manual date strings encode assumptions about ordering and punctuation.
// Intl.DateTimeFormat handles locale-specific conventions.

// ---------------------------------------------------------------------
// 58. Localized numbers should not be manually assembled
// ---------------------------------------------------------------------

export const NoManualNumberAssembly: FC = (): ReactElement => {
  const value = 1234567.89;

  return <p>{new Intl.NumberFormat("fr-FR").format(value)}</p>;
};

// Decimal marks, grouping separators, digit systems, and other conventions
// vary between locales. Intl.NumberFormat handles these rules.

// ---------------------------------------------------------------------
// 59. Formatting output can vary
// ---------------------------------------------------------------------

export const FormattingOutputVariation: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(date)}
    </p>
  );
};

// Locale-sensitive output should generally be tested semantically rather than
// assuming one exact string representation across every implementation.
// Intl output can contain implementation-permitted formatting differences.

// ---------------------------------------------------------------------
// 60. Localization and accessibility
// ---------------------------------------------------------------------

export const LocalizationAccessibility: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Open settings">
      Settings
    </button>
  );
};

// Localization must preserve accessible names, labels, descriptions, and states.
// A translated interface must remain accessible in every supported locale.

// ---------------------------------------------------------------------
// 61. Localize error summaries
// ---------------------------------------------------------------------

export const LocalizedErrorSummary: FC = (): ReactElement => {
  return (
    <section>
      <h2>Please correct the following errors</h2>

      <ul>
        <li>Enter a valid email address.</li>

        <li>Enter your name.</li>
      </ul>
    </section>
  );
};

// Error summaries, individual error messages, and correction instructions
// are all part of the localized form experience.

// ---------------------------------------------------------------------
// 62. Localize navigation state
// ---------------------------------------------------------------------

export const LocalizedCurrentPage: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/account" aria-current="page">
        Account
      </a>
    </nav>
  );
};

// The accessible name of the navigation and the link text can both require localization.

// ---------------------------------------------------------------------
// 63. Localize dialog controls
// ---------------------------------------------------------------------

export const LocalizedDialogControls: FC = (): ReactElement => {
  return (
    <dialog open>
      <h2>Confirm deletion</h2>

      <button type="button">Cancel</button>

      <button type="button">Delete</button>
    </dialog>
  );
};

// Dialog titles, descriptions, and action labels are user-facing localized content.

// ---------------------------------------------------------------------
// 64. Localization and form data
// ---------------------------------------------------------------------

export const LocalizedFormData: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <form>
      <label htmlFor="name">Name</label>

      <input
        id="name"
        name="name"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </form>
  );
};

// User-entered data should not be translated simply because the interface language changes.
// Input values represent user or domain data rather than interface resources.

// ---------------------------------------------------------------------
// 65. Localized input instructions
// ---------------------------------------------------------------------

export const LocalizedInputInstructions: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="date">Date of birth</label>

      <input id="date" name="date" type="date" />

      <p>Select your date of birth.</p>
    </form>
  );
};

// Instructions and supporting text should match the conventions expected by
// the localized interface.

// ---------------------------------------------------------------------
// 66. Localization and HTML language metadata
// ---------------------------------------------------------------------

export const DocumentLanguageConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>The document language should correspond to the language of the content being presented.</p>
    </section>
  );
};

// Language metadata helps user agents and assistive technologies interpret
// the language of web content. W3C internationalization guidance treats language
// and direction metadata as an important part of web localization.
// :contentReference[oaicite:4]{index=4}

// ---------------------------------------------------------------------
// 67. Localization and mixed-language content
// ---------------------------------------------------------------------

export const MixedLanguageContent: FC = (): ReactElement => {
  return (
    <p>
      Search for <span lang="fr">bonjour</span> in the example.
    </p>
  );
};

// A localized page can contain content in another language.
// Language metadata can identify the language of that embedded string.

// ---------------------------------------------------------------------
// 68. Localization and writing direction
// ---------------------------------------------------------------------

export const WritingDirectionConcept: FC = (): ReactElement => {
  return (
    <section dir="rtl">
      <p>Example right-to-left content.</p>
    </section>
  );
};

// Language and direction are related but distinct pieces of metadata.
// Not every language uses the same writing direction.

// ---------------------------------------------------------------------
// 69. Localization and server rendering
// ---------------------------------------------------------------------

export const ServerRenderingLocale: FC = (): ReactElement => {
  return (
    <section>
      <p>Server-rendered localized output should use the same locale assumptions as the client-rendered application.</p>
    </section>
  );
};

// If server and client render different locale-sensitive strings, the initial
// UI can differ during hydration.

// ---------------------------------------------------------------------
// 70. Deterministic formatting
// ---------------------------------------------------------------------

export const DeterministicFormatting: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(date)}
    </p>
  );
};

// Explicit locale and time-zone configuration can make output predictable when
// deterministic rendering or testing is required.

// ---------------------------------------------------------------------
// 71. Localization resource loading
// ---------------------------------------------------------------------

export const ResourceLoading: FC = (): ReactElement => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section>
      {!loaded && <p role="status">Loading language resources...</p>}

      <button
        type="button"
        onClick={() => {
          setLoaded(true);
        }}
      >
        Load language
      </button>
    </section>
  );
};

// Localization resources can be loaded asynchronously.
// The UI needs a defined state while those resources are unavailable.

// ---------------------------------------------------------------------
// 72. Missing translation handling
// ---------------------------------------------------------------------

export const MissingTranslation: FC = (): ReactElement => {
  const translation = undefined;
  const fallback = "Save changes";

  return <button type="button">{translation ?? fallback}</button>;
};

// Missing translations should have predictable handling instead of exposing
// implementation keys such as "actions.save" to users.

// ---------------------------------------------------------------------
// 73. Translation completeness
// ---------------------------------------------------------------------

export const TranslationCompleteness: FC = (): ReactElement => {
  const english = {
    title: "Settings",
    save: "Save changes",
  };

  const german = {
    title: "Einstellungen",
  };

  return (
    <section>
      <p>{english.title}</p>

      <p>{german.title}</p>

      <p>Missing resource keys should be detected during development or build validation.</p>
    </section>
  );
};

// Resource validation can detect missing keys before users encounter incomplete translations.

// ---------------------------------------------------------------------
// 74. Translation resource types
// ---------------------------------------------------------------------

type Messages = {
  readonly title: string;
  readonly save: string;
};

const typedEnglishMessages: Messages = {
  title: "Settings",
  save: "Save changes",
};

export const TypedTranslationResource: FC = (): ReactElement => {
  return (
    <section>
      <h2>{typedEnglishMessages.title}</h2>

      <button type="button">{typedEnglishMessages.save}</button>
    </section>
  );
};

// Shared resource types can help keep locale dictionaries structurally consistent.

// ---------------------------------------------------------------------
// 75. Keep resource shapes consistent
// ---------------------------------------------------------------------

const typedGermanMessages: Messages = {
  title: "Einstellungen",
  save: "Änderungen speichern",
};

export const ConsistentResourceShape: FC = (): ReactElement => {
  return <button type="button">{typedGermanMessages.save}</button>;
};

// A shared resource shape makes missing expected messages visible to TypeScript
// when resources are statically defined.

// ---------------------------------------------------------------------
// 76. Localized component props
// ---------------------------------------------------------------------

type LocalizedButtonProps = {
  readonly label: string;
};

export const LocalizedButtonComponent: FC<LocalizedButtonProps> = ({ label }): ReactElement => {
  return <button type="button">{label}</button>;
};

// A reusable component does not need to know whether its label came from
// English, German, or another localization resource.

// ---------------------------------------------------------------------
// 77. Keep reusable components locale-neutral
// ---------------------------------------------------------------------

export const LocaleNeutralComponent: FC = (): ReactElement => {
  const label = typedGermanMessages.save;

  return <LocalizedButtonComponent label={label} />;
};

// Localization can occur at the application boundary while reusable components
// remain focused on rendering and behavior.

// ---------------------------------------------------------------------
// 78. Test localization with multiple locales
// ---------------------------------------------------------------------

export const LocalizationTesting: FC = (): ReactElement => {
  return (
    <ul>
      <li>Test every supported locale.</li>

      <li>Test long translated strings.</li>

      <li>Test dates, numbers, and currencies.</li>

      <li>Test accessible names and validation messages.</li>

      <li>Test right-to-left layouts where applicable.</li>
    </ul>
  );
};

// Localization testing must evaluate both language content and the UI behavior
// caused by different locale data.

// ---------------------------------------------------------------------
// 79. Localization quality checklist
// ---------------------------------------------------------------------

export const LocalizationChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>User-facing strings come from localization resources.</li>

      <li>Translation keys are stable and meaningful.</li>

      <li>Missing translations have a defined fallback.</li>

      <li>Dates and numbers use locale-aware formatting.</li>

      <li>Currency uses an explicit currency code.</li>

      <li>Accessible names and descriptions are localized.</li>

      <li>Layout tolerates text expansion.</li>

      <li>Writing direction is handled where required.</li>

      <li>Multiple supported locales are tested.</li>
    </ul>
  );
};

// Localization quality requires both linguistic correctness and technical correctness.

// ---------------------------------------------------------------------
// 80. Integrated localization example
// ---------------------------------------------------------------------

type ExampleLocale = "en-US" | "de-DE";

type ExampleMessages = {
  readonly title: string;
  readonly description: string;
  readonly save: string;
  readonly saved: string;
  readonly language: string;
};

const exampleMessages: Record<ExampleLocale, ExampleMessages> = {
  "en-US": {
    title: "Account settings",
    description: "Update your account information.",
    save: "Save changes",
    saved: "Settings saved.",
    language: "Language",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    description: "Aktualisieren Sie Ihre Kontoinformationen.",
    save: "Änderungen speichern",
    saved: "Einstellungen gespeichert.",
    language: "Sprache",
  },
};

export const LocalizationExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<ExampleLocale>("en-US");
  const [saved, setSaved] = useState(false);
  const messages = exampleMessages[locale];

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "de-DE" ? "EUR" : "USD",
  }).format(1299.99);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date("2026-09-29T12:00:00Z"));

  return (
    <main>
      <label htmlFor="locale">{messages.language}</label>

      <select
        id="locale"
        value={locale}
        onChange={(event) => {
          setLocale(event.target.value as ExampleLocale);
          setSaved(false);
        }}
      >
        <option value="en-US">English</option>

        <option value="de-DE">Deutsch</option>
      </select>

      <section>
        <h1>{messages.title}</h1>

        <p>{messages.description}</p>

        <dl>
          <dt>Date</dt>

          <dd>{formattedDate}</dd>

          <dt>Price</dt>

          <dd>{formattedAmount}</dd>
        </dl>

        <button
          type="button"
          onClick={() => {
            setSaved(true);
          }}
        >
          {messages.save}
        </button>

        {saved && <p role="status">{messages.saved}</p>}
      </section>
    </main>
  );
};

export default LocalizationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Localization adapts an application to a particular language, locale, and regional context.
// - Localization is broader than translation because it also covers formatting, direction, layout, and cultural conventions.
// - Internationalization prepares an application so localization can be performed systematically.
// - A locale represents language and regional conventions used by the application.
// - Translation resources should keep localized messages separate from component logic.
// - Stable translation keys prevent application code from depending on source-language wording.
// - Complete messages should be translated rather than assembled from language-specific fragments.
// - Dynamic values can be interpolated into localized messages.
// - Application logic should use stable identifiers instead of comparing translated strings.
// - Unsupported locales should have an explicit fallback strategy.
// - Regional locales can sometimes fall back to broader language resources when an exact resource is unavailable.
// - User-facing buttons, headings, navigation labels, accessible names, descriptions, placeholders, validation messages, status messages, and error messages all require localization when appropriate.
// - Translated text can be substantially longer or shorter than source text, so layouts should tolerate text expansion.
// - Fixed widths, fixed heights, and aggressive truncation can create localization problems.
// - Right-to-left languages require direction-aware layout rather than hard-coded left/right assumptions.
// - CSS logical properties help layouts adapt to different writing directions.
// - Intl.DateTimeFormat provides locale-sensitive date and time formatting.
// - Intl.NumberFormat provides locale-sensitive number, currency, percent, and unit formatting.
// - Intl.RelativeTimeFormat provides locale-sensitive relative-time wording.
// - Intl.ListFormat provides locale-sensitive list formatting.
// - Intl.PluralRules provides locale-sensitive plural categories.
// - Intl.Collator provides locale-aware string comparison and sorting.
// - Intl.Locale provides structured information about locale identifiers.
// - Intl.getCanonicalLocales() provides canonical locale identifiers.
// - Intl service methods can be used to determine which requested locales are supported.
// - Browser language preferences can inform locale negotiation but should not be confused with the application's supported-locale policy.
// - Domain values should remain locale-neutral while the presentation layer formats them for the active locale.
// - Formatted strings are presentation output and should not replace canonical domain data.
// - Locale-sensitive server and client rendering should use consistent configuration to avoid mismatched initial output.
// - Localization resources may be loaded asynchronously and need a defined loading state.
// - Missing translations should be detected and handled deliberately.
// - Shared resource types can help maintain consistent translation structures.
// - Reusable presentation components can remain locale-neutral by receiving already-localized values through props.
// - Localization testing should cover every supported locale, realistic translated strings, formatting, accessibility, text expansion, and writing direction where applicable.

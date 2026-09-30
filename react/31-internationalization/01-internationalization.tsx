/**
 * Internationalization
 * =====================
 *
 * Internationalization (i18n) is the process of designing and implementing software
 * so it can support different languages, locales, writing systems, cultural conventions,
 * and regional requirements without requiring the application itself to be fundamentally rewritten.
 *
 * A well-internationalized React application separates translatable content and locale-sensitive
 * presentation from application logic so the same interface can adapt to different users and regions.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What internationalization means
// ---------------------------------------------------------------------

export const InternationalizationConcept: FC = (): ReactElement => {
  return (
    <section>
      <h1>Internationalization</h1>

      <p>
        Internationalization prepares an application to support different languages, locales, writing systems, and
        regional conventions.
      </p>
    </section>
  );
};

// Internationalization is commonly abbreviated as i18n.
// The "18" represents the number of letters between "i" and "n".

// ---------------------------------------------------------------------
// 2. Internationalization versus localization
// ---------------------------------------------------------------------

export const InternationalizationAndLocalization: FC = (): ReactElement => {
  return (
    <section>
      <h2>i18n and l10n</h2>

      <p>
        Internationalization prepares the software for adaptation. Localization adapts the software for a particular
        language or locale.
      </p>
    </section>
  );
};

// Internationalization is primarily an engineering concern.
// Localization is the process of adapting the prepared application to a target locale.

// ---------------------------------------------------------------------
// 3. Why internationalization matters
// ---------------------------------------------------------------------

export const WhyInternationalizationMatters: FC = (): ReactElement => {
  return (
    <section>
      <h2>Why prepare for multiple locales?</h2>

      <ul>
        <li>Different languages can require different amounts of space.</li>

        <li>Different locales use different date conventions.</li>

        <li>Number and currency formatting varies by locale.</li>

        <li>Some languages use right-to-left writing.</li>

        <li>Text may change grammatical structure between languages.</li>
      </ul>
    </section>
  );
};

// Internationalization affects both visible content and application architecture.
// It should therefore be considered before translating an already-built interface.

// ---------------------------------------------------------------------
// 4. Hard-coded user-facing text
// ---------------------------------------------------------------------

export const HardCodedText: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Hard-coded text is not inherently incorrect.
// The problem occurs when user-facing strings are scattered through application logic
// and cannot be systematically replaced or translated.

// ---------------------------------------------------------------------
// 5. Centralized messages
// ---------------------------------------------------------------------

const messages = {
  save: "Save changes",
  cancel: "Cancel",
} as const;

export const CentralizedMessages: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">{messages.save}</button>

      <button type="button">{messages.cancel}</button>
    </div>
  );
};

// Centralizing messages creates a boundary between application code and user-facing text.
// A production application can replace these messages with locale-specific resources.

// ---------------------------------------------------------------------
// 6. Translation resources
// ---------------------------------------------------------------------

const englishMessages = {
  welcome: "Welcome",
  save: "Save changes",
} as const;

const germanMessages = {
  welcome: "Willkommen",
  save: "Änderungen speichern",
} as const;

export const TranslationResources: FC = (): ReactElement => {
  return (
    <section>
      <p>{englishMessages.welcome}</p>

      <button type="button">{germanMessages.save}</button>
    </section>
  );
};

// Translation resources associate stable application concepts with localized strings.
// The application should select one resource set according to the active locale.

// ---------------------------------------------------------------------
// 7. Locale
// ---------------------------------------------------------------------

export const LocaleConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>
        A locale identifies language and regional conventions used to interpret and present locale-sensitive
        information.
      </p>

      <p>
        Examples include <code>en-US</code>, <code>de-DE</code>, and <code>ar-EG</code>.
      </p>
    </section>
  );
};

// A locale can influence language, date formatting, number formatting, sorting,
// text direction, and other culturally dependent behavior.

// ---------------------------------------------------------------------
// 8. Language is not the same as locale
// ---------------------------------------------------------------------

export const LanguageAndLocale: FC = (): ReactElement => {
  return (
    <section>
      <p>Language identifies the language used for communication.</p>

      <p>Locale also carries regional conventions that can affect formatting and other locale-sensitive behavior.</p>
    </section>
  );
};

// For example, English can be associated with different regional conventions,
// such as en-US and en-GB.

// ---------------------------------------------------------------------
// 9. Locale-sensitive formatting
// ---------------------------------------------------------------------

export const LocaleSensitiveFormatting: FC = (): ReactElement => {
  const amount = 1234567.89;

  return (
    <section>
      <p>{new Intl.NumberFormat("en-US").format(amount)}</p>

      <p>{new Intl.NumberFormat("de-DE").format(amount)}</p>
    </section>
  );
};

// Locale-sensitive APIs should be used instead of manually inserting separators,
// decimal marks, currency symbols, or date components.

// ---------------------------------------------------------------------
// 10. Avoid manual date formatting
// ---------------------------------------------------------------------

export const AvoidManualDateFormatting: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(date)}
    </p>
  );
};

// Manual string concatenation such as "09/29/2026" assumes one formatting convention.
// Intl.DateTimeFormat delegates presentation to the selected locale.

// ---------------------------------------------------------------------
// 11. Avoid manual number formatting
// ---------------------------------------------------------------------

export const AvoidManualNumberFormatting: FC = (): ReactElement => {
  const value = 1234567.89;

  return <p>{new Intl.NumberFormat("de-DE").format(value)}</p>;
};

// Do not assume that every locale uses the same decimal separator or grouping separator.

// ---------------------------------------------------------------------
// 12. Avoid concatenating translated sentences
// ---------------------------------------------------------------------

export const AvoidSentenceConcatenation: FC = (): ReactElement => {
  const name = "John Doe";

  return <p>Welcome, {name}.</p>;
};

// A simplistic concatenation strategy can become problematic when translation
// requires a different word order or grammatical structure.

// ---------------------------------------------------------------------
// 13. Translate complete messages
// ---------------------------------------------------------------------

export const CompleteMessageTranslation: FC = (): ReactElement => {
  const message = "Welcome, John Doe.";

  return <p>{message}</p>;
};

// Translation resources should represent meaningful messages rather than forcing
// translators to reconstruct sentences from unrelated fragments.

// ---------------------------------------------------------------------
// 14. Message interpolation
// ---------------------------------------------------------------------

type MessageValues = {
  readonly name: string;
};

const welcomeMessage = ({ name }: MessageValues): string => {
  return `Welcome, ${name}.`;
};

export const MessageInterpolation: FC = (): ReactElement => {
  return <p>{welcomeMessage({ name: "John Doe" })}</p>;
};

// Interpolation allows dynamic values to be inserted into a translated message.
// Translation systems generally provide their own interpolation mechanisms.

// ---------------------------------------------------------------------
// 15. Do not translate variable values blindly
// ---------------------------------------------------------------------

export const DynamicValueBoundary: FC = (): ReactElement => {
  const username = "John Doe";

  return <p>{username}</p>;
};

// User-generated or domain-specific values are not automatically translation resources.
// The surrounding message and the dynamic value should be treated separately.

// ---------------------------------------------------------------------
// 16. Translation keys
// ---------------------------------------------------------------------

const translationKeys = {
  welcomeTitle: "welcome.title",
  saveButton: "actions.save",
} as const;

export const TranslationKeys: FC = (): ReactElement => {
  return (
    <section>
      <p>{translationKeys.welcomeTitle}</p>

      <button type="button">{translationKeys.saveButton}</button>
    </section>
  );
};

// Translation keys provide stable identifiers for localized messages.
// They should represent application meaning rather than accidental source-language wording.

// ---------------------------------------------------------------------
// 17. Meaningful translation keys
// ---------------------------------------------------------------------

const meaningfulKeys = {
  checkoutSubmit: "checkout.submit",
  profileSave: "profile.save",
} as const;

export const MeaningfulTranslationKeys: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">{meaningfulKeys.checkoutSubmit}</button>

      <button type="button">{meaningfulKeys.profileSave}</button>
    </div>
  );
};

// Keys such as "button1" or "text2" provide little context.
// Domain-oriented keys are easier to maintain when an application grows.

// ---------------------------------------------------------------------
// 18. Keep source text out of logic
// ---------------------------------------------------------------------

export const MessageBoundary: FC = (): ReactElement => {
  const saveLabel = "Save changes";

  return <button type="button">{saveLabel}</button>;
};

// Separating message data from rendering logic makes it easier to replace
// the message source without changing the component's behavior.

// ---------------------------------------------------------------------
// 19. Locale as application state
// ---------------------------------------------------------------------

export const LocaleState: FC = (): ReactElement => {
  const [locale, setLocale] = useState("en-US");

  return (
    <section>
      <p>Current locale: {locale}</p>

      <button
        type="button"
        onClick={() => {
          setLocale("de-DE");
        }}
      >
        Use German
      </button>
    </section>
  );
};

// Locale can be represented as application state when the user can change
// the active locale during the lifetime of the application.

// ---------------------------------------------------------------------
// 20. Locale selection affects rendering
// ---------------------------------------------------------------------

const localizedGreetings: Record<string, string> = {
  "en-US": "Welcome",
  "de-DE": "Willkommen",
};

export const LocaleDependentRendering: FC = (): ReactElement => {
  const [locale, setLocale] = useState("en-US");

  return (
    <section>
      <p>{localizedGreetings[locale]}</p>

      <button
        type="button"
        onClick={() => {
          setLocale("de-DE");
        }}
      >
        Deutsch
      </button>
    </section>
  );
};

// Changing the locale should cause user-facing localized content to be rendered
// from the corresponding resource set.

// ---------------------------------------------------------------------
// 21. Locale state should have a defined fallback
// ---------------------------------------------------------------------

const greetingsByLocale: Record<string, string> = {
  "en-US": "Welcome",
  "de-DE": "Willkommen",
};

export const LocaleFallback: FC = (): ReactElement => {
  const locale = "fr-FR";
  const greeting = greetingsByLocale[locale] ?? greetingsByLocale["en-US"];

  return <p>{greeting}</p>;
};

// Applications should define behavior for unsupported or unavailable locales.
// A fallback prevents an unknown locale from producing missing interface text.

// ---------------------------------------------------------------------
// 22. Separate locale from translation resources
// ---------------------------------------------------------------------

type Locale = "en-US" | "de-DE";

const localizedContent: Record<Locale, { readonly greeting: string }> = {
  "en-US": {
    greeting: "Welcome",
  },
  "de-DE": {
    greeting: "Willkommen",
  },
};

export const LocaleResourceRelationship: FC = (): ReactElement => {
  const locale: Locale = "en-US";

  return <p>{localizedContent[locale].greeting}</p>;
};

// The locale identifies which resource set is active.
// The resource set contains the localized messages and other locale-specific content.

// ---------------------------------------------------------------------
// 23. Locale context
// ---------------------------------------------------------------------

type LocaleContextValue = {
  readonly locale: Locale;
};

const exampleLocaleContextValue: LocaleContextValue = {
  locale: "en-US",
};

export const LocaleContextConcept: FC = (): ReactElement => {
  return <p>Active locale: {exampleLocaleContextValue.locale}</p>;
};

// React Context can make locale information available to deeply nested components.
// A production implementation would normally provide both locale state and localization services.

// ---------------------------------------------------------------------
// 24. Locale provider responsibility
// ---------------------------------------------------------------------

export const LocaleProviderResponsibility: FC = (): ReactElement => {
  return (
    <section>
      <p>The locale provider owns the active locale.</p>

      <p>Descendants consume locale-aware services and messages.</p>
    </section>
  );
};

// A provider can establish a single localization boundary instead of requiring
// unrelated components to manage the locale independently.

// ---------------------------------------------------------------------
// 25. Locale-independent components
// ---------------------------------------------------------------------

type SaveButtonProps = {
  readonly label: string;
};

export const LocaleIndependentButton: FC<SaveButtonProps> = ({ label }): ReactElement => {
  return <button type="button">{label}</button>;
};

// Presentational components do not need to know where their localized text came from.
// They can receive already-localized values through props.

// ---------------------------------------------------------------------
// 26. Keep localization concerns at a clear boundary
// ---------------------------------------------------------------------

export const LocalizationBoundary: FC = (): ReactElement => {
  const saveLabel = "Save changes";

  return <LocaleIndependentButton label={saveLabel} />;
};

// A clear boundary prevents localization logic from becoming scattered across
// otherwise reusable presentation components.

// ---------------------------------------------------------------------
// 27. Internationalization and component sizing
// ---------------------------------------------------------------------

export const FlexibleTextLayout: FC = (): ReactElement => {
  return (
    <button type="button" className="flexible-button">
      Save changes
    </button>
  );
};

// CSS should allow translated text to expand.
// Fixed widths based on one language can cause clipping or overflow in another.

// ---------------------------------------------------------------------
// 28. Avoid assuming English word lengths
// ---------------------------------------------------------------------

export const VariableTextLength: FC = (): ReactElement => {
  return <p>Localized text may be shorter or substantially longer than the source text.</p>;
};

// Layouts should be tested with realistic translations, not only with the source language.

// ---------------------------------------------------------------------
// 29. Avoid embedding text in images
// ---------------------------------------------------------------------

export const AvoidTextInImages: FC = (): ReactElement => {
  return (
    <section>
      <img src="/example-banner.jpg" alt="Example promotional banner" />

      <p>Example promotional message.</p>
    </section>
  );
};

// Text embedded in images is harder to translate, resize, restyle, and make accessible.
// Prefer real text whenever the content is textual.

// ---------------------------------------------------------------------
// 30. Internationalization and accessibility
// ---------------------------------------------------------------------

export const InternationalizationAndAccessibility: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Localization must preserve accessible names, labels, descriptions, and instructions.
// A translated interface still needs the same accessibility semantics.

// ---------------------------------------------------------------------
// 31. Localize accessible names
// ---------------------------------------------------------------------

export const LocalizedAccessibleName: FC = (): ReactElement => {
  const label = "Close dialog";

  return (
    <button type="button" aria-label={label}>
      ×
    </button>
  );
};

// Accessible names are user-facing strings too.
// They must be translated when the interface is translated.

// ---------------------------------------------------------------------
// 32. Localize form instructions
// ---------------------------------------------------------------------

export const LocalizedFormInstruction: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" aria-describedby="email-help" />

      <p id="email-help">Enter an address such as user@example.com.</p>
    </form>
  );
};

// Labels, descriptions, validation messages, and instructions are all part of
// the localized user experience.

// ---------------------------------------------------------------------
// 33. Text direction
// ---------------------------------------------------------------------

export const DirectionAwareMarkup: FC = (): ReactElement => {
  return (
    <main dir="ltr">
      <h1>Example content</h1>
    </main>
  );
};

// Internationalization must account for languages whose primary writing direction
// differs from left-to-right languages.

// ---------------------------------------------------------------------
// 34. Use logical CSS properties
// ---------------------------------------------------------------------

export const LogicalCSSConcept: FC = (): ReactElement => {
  return <div className="logical-spacing">Example content</div>;
};

// Prefer logical properties such as margin-inline-start and padding-inline-end
// when the layout should adapt to writing direction.

// ---------------------------------------------------------------------
// 35. Avoid directional assumptions in JavaScript
// ---------------------------------------------------------------------

export const DirectionIndependentData: FC = (): ReactElement => {
  return (
    <p>
      Layout direction should be controlled by locale and writing-system requirements rather than hard-coded application
      assumptions.
    </p>
  );
};

// Direction should be treated as presentation and document configuration,
// not as a permanent property of a component's business logic.

// ---------------------------------------------------------------------
// 36. Pluralization is locale-sensitive
// ---------------------------------------------------------------------

export const PluralizationConcept: FC = (): ReactElement => {
  const count = 2;

  return <p>{count === 1 ? `${count} item` : `${count} items`}</p>;
};

// This simple English rule should not be generalized to every language.
// Proper pluralization should use locale-aware plural rules or a localization library.

// ---------------------------------------------------------------------
// 37. Intl.PluralRules
// ---------------------------------------------------------------------

export const PluralRulesExample: FC = (): ReactElement => {
  const count = 2;
  const category = new Intl.PluralRules("en-US").select(count);

  return <p>{category}</p>;
};

// Intl.PluralRules determines the plural category for a number according to a locale.

// ---------------------------------------------------------------------
// 38. Date formatting belongs to localization
// ---------------------------------------------------------------------

export const DateFormattingBoundary: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(date)}
    </p>
  );
};

// Store dates as appropriate domain values and format them for presentation
// according to the active locale.

// ---------------------------------------------------------------------
// 39. Number formatting belongs to localization
// ---------------------------------------------------------------------

export const NumberFormattingBoundary: FC = (): ReactElement => {
  const value = 9876543.21;

  return <p>{new Intl.NumberFormat("en-US").format(value)}</p>;
};

// Formatting should be performed at the presentation boundary rather than
// converting numbers into locale-specific strings throughout the application.

// ---------------------------------------------------------------------
// 40. Currency formatting belongs to localization
// ---------------------------------------------------------------------

export const CurrencyFormattingBoundary: FC = (): ReactElement => {
  const amount = 1299.99;

  return (
    <p>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)}
    </p>
  );
};

// Currency formatting combines a numeric value with a currency code and locale.
// The displayed result depends on both.

// ---------------------------------------------------------------------
// 41. Sorting is locale-sensitive
// ---------------------------------------------------------------------

export const LocaleSensitiveSorting: FC = (): ReactElement => {
  const names = ["Zoe", "Åsa", "Ana"];

  const sortedNames = [...names].sort(new Intl.Collator("en-US").compare);

  return (
    <ul>
      {sortedNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

// String ordering should not automatically rely on JavaScript's default code-unit
// ordering when human-language collation is required.

// ---------------------------------------------------------------------
// 42. Internationalization and input values
// ---------------------------------------------------------------------

export const InternationalizedInput: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <input
      aria-label="Search"
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
    />
  );
};

// User input should generally be stored as the user's entered data.
// Localization should not silently destroy or reinterpret the original value.

// ---------------------------------------------------------------------
// 43. Do not assume numeric input syntax
// ---------------------------------------------------------------------

export const NumericInputConcept: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="amount">Amount</label>

      <input id="amount" name="amount" type="number" />
    </form>
  );
};

// Numeric input behavior and localized number parsing are separate concerns.
// Do not assume that a displayed localized number string is directly usable
// as an internal numeric representation.

// ---------------------------------------------------------------------
// 44. Locale-aware language metadata
// ---------------------------------------------------------------------

export const LanguageMetadata: FC = (): ReactElement => {
  return (
    <html lang="en">
      <body>
        <p>Example content</p>
      </body>
    </html>
  );
};

// The document language should reflect the language of the document.
// In a React application, this is normally controlled at the document or application shell level.

// ---------------------------------------------------------------------
// 45. Language metadata can change
// ---------------------------------------------------------------------

export const DynamicLanguageMetadata: FC = (): ReactElement => {
  const locale = "de-DE";
  const language = locale.split("-")[0];

  return (
    <section>
      <p>Active language: {language}</p>
    </section>
  );
};

// If the application changes the document language dynamically, the document-level
// language metadata should be updated consistently with the rendered content.

// ---------------------------------------------------------------------
// 46. Locale configuration object
// ---------------------------------------------------------------------

type LocaleConfig = {
  readonly locale: string;
  readonly direction: "ltr" | "rtl";
};

const englishConfig: LocaleConfig = {
  locale: "en-US",
  direction: "ltr",
};

export const LocaleConfiguration: FC = (): ReactElement => {
  return (
    <section dir={englishConfig.direction}>
      <p>Locale: {englishConfig.locale}</p>
    </section>
  );
};

// Locale configuration can group related presentation requirements such as locale,
// language, and writing direction.

// ---------------------------------------------------------------------
// 47. Keep domain data locale-neutral
// ---------------------------------------------------------------------

type Product = {
  readonly name: string;
  readonly price: number;
};

const product: Product = {
  name: "Example product",
  price: 1299.99,
};

export const LocaleNeutralDomainData: FC = (): ReactElement => {
  return (
    <p>
      {product.name}: {product.price}
    </p>
  );
};

// Domain data should generally store semantic values rather than presentation strings.
// The presentation layer can localize those values when rendering them.

// ---------------------------------------------------------------------
// 48. Separate data from presentation
// ---------------------------------------------------------------------

export const LocalizedProductPresentation: FC = (): ReactElement => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <p>
      {product.name}: {formattedPrice}
    </p>
  );
};

// Keeping raw values separate from formatted output makes the data reusable
// across locales and presentation contexts.

// ---------------------------------------------------------------------
// 49. Avoid storing formatted values as canonical data
// ---------------------------------------------------------------------

const rawAmount = 1299.99;
const formattedAmount = new Intl.NumberFormat("de-DE").format(rawAmount);

export const FormattedValueBoundary: FC = (): ReactElement => {
  return <p>{formattedAmount}</p>;
};

// A formatted string is presentation output.
// It should not replace the underlying numeric value when the application still
// needs numeric operations or formatting for another locale.

// ---------------------------------------------------------------------
// 50. Locale-sensitive formatting should be deterministic
// ---------------------------------------------------------------------

export const DeterministicLocaleFormatting: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <p>
      {new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        dateStyle: "medium",
      }).format(date)}
    </p>
  );
};

// When exact output matters for tests or server/client consistency, explicitly
// define relevant locale and time-zone options rather than relying on environment defaults.

// ---------------------------------------------------------------------
// 51. Server and client locale consistency
// ---------------------------------------------------------------------

export const ServerClientLocaleConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Server and client rendering should agree on the locale-sensitive values used to produce the initial UI.</p>
    </section>
  );
};

// Locale-sensitive formatting can depend on the execution environment.
// SSR applications should establish a consistent locale and formatting configuration.

// ---------------------------------------------------------------------
// 52. Hydration and localized output
// ---------------------------------------------------------------------

export const HydrationLocaleConcept: FC = (): ReactElement => {
  return <p>Locale-sensitive output should be deterministic between server rendering and client hydration.</p>;
};

// Rendering different locale-dependent strings on the server and client can
// produce hydration mismatches and visible content changes.

// ---------------------------------------------------------------------
// 53. Avoid using the browser locale accidentally
// ---------------------------------------------------------------------

export const ExplicitLocaleFormatting: FC = (): ReactElement => {
  const number = 123456.78;

  return <p>{new Intl.NumberFormat("en-US").format(number)}</p>;
};

// Explicit locale configuration is useful when the application has already
// determined the active locale and needs deterministic presentation.

// ---------------------------------------------------------------------
// 54. Intl APIs use locale data
// ---------------------------------------------------------------------

export const IntlAPIs: FC = (): ReactElement => {
  const date = new Date("2026-09-29T12:00:00Z");

  return (
    <section>
      <p>{new Intl.DateTimeFormat("de-DE").format(date)}</p>

      <p>{new Intl.NumberFormat("de-DE").format(123456.78)}</p>
    </section>
  );
};

// ECMAScript Internationalization APIs provide locale-aware formatting and
// comparison functionality without requiring manual formatting rules.

// ---------------------------------------------------------------------
// 55. Locale-aware relative time
// ---------------------------------------------------------------------

export const RelativeTimeConcept: FC = (): ReactElement => {
  const formatter = new Intl.RelativeTimeFormat("en-US", {
    numeric: "auto",
  });

  return <p>{formatter.format(-1, "day")}</p>;
};

// Relative-time wording is also locale-sensitive and should not be built
// by manually concatenating numbers and words.

// ---------------------------------------------------------------------
// 56. Locale-aware display names
// ---------------------------------------------------------------------

export const DisplayNamesConcept: FC = (): ReactElement => {
  const formatter = new Intl.DisplayNames("en-US", {
    type: "language",
  });

  return <p>{formatter.of("de")}</p>;
};

// Intl.DisplayNames can provide localized names for supported categories such as
// languages, regions, currencies, and other standardized identifiers.

// ---------------------------------------------------------------------
// 57. Translation resources should be immutable
// ---------------------------------------------------------------------

const immutableMessages = {
  welcome: "Welcome",
  logout: "Log out",
} as const;

export const ImmutableTranslationResources: FC = (): ReactElement => {
  return (
    <nav>
      <span>{immutableMessages.welcome}</span>

      <button type="button">{immutableMessages.logout}</button>
    </nav>
  );
};

// Translation resources are configuration-like data and should not be mutated
// during rendering.

// ---------------------------------------------------------------------
// 58. Locale-specific resource selection
// ---------------------------------------------------------------------

const resources = {
  "en-US": {
    welcome: "Welcome",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
} as const;

type SupportedLocale = keyof typeof resources;

export const ResourceSelection: FC = (): ReactElement => {
  const locale: SupportedLocale = "en-US";

  return <p>{resources[locale].welcome}</p>;
};

// TypeScript can model a finite set of supported locales and prevent invalid
// locale identifiers from being passed to a statically defined resource map.

// ---------------------------------------------------------------------
// 59. Unsupported locales need fallback behavior
// ---------------------------------------------------------------------

const supportedResources: Record<string, { readonly welcome: string }> = {
  "en-US": {
    welcome: "Welcome",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

export const UnsupportedLocaleHandling: FC = (): ReactElement => {
  const requestedLocale = "fr-FR";
  const resource = supportedResources[requestedLocale] ?? supportedResources["en-US"];

  return <p>{resource.welcome}</p>;
};

// Locale negotiation and fallback are separate from the translation mechanism.
// The application needs a defined policy for unsupported locales.

// ---------------------------------------------------------------------
// 60. Locale fallback hierarchy
// ---------------------------------------------------------------------

export const LocaleFallbackHierarchy: FC = (): ReactElement => {
  const requestedLocale = "de-AT";
  const language = requestedLocale.split("-")[0];

  return (
    <p>
      Requested locale: {requestedLocale}; language fallback: {language}
    </p>
  );
};

// A localization system may define fallback rules from a regional locale
// to a broader language resource when an exact resource is unavailable.

// ---------------------------------------------------------------------
// 61. Translation completeness
// ---------------------------------------------------------------------

const completeResource = {
  title: "Settings",
  save: "Save changes",
};

const incompleteResource = {
  title: "Einstellungen",
};

export const TranslationCompleteness: FC = (): ReactElement => {
  return (
    <section>
      <p>{completeResource.title}</p>

      <p>{incompleteResource.title}</p>
    </section>
  );
};

// Missing translations should be detectable during development or build validation.
// Silent fallback behavior can otherwise hide incomplete localization work.

// ---------------------------------------------------------------------
// 62. Avoid source-language fallback without a policy
// ---------------------------------------------------------------------

export const TranslationFallbackPolicy: FC = (): ReactElement => {
  return (
    <section>
      <p>Translation fallback behavior should be deliberate and consistent.</p>
    </section>
  );
};

// An application should decide whether missing messages fall back to a default
// locale, display a development marker, or use another explicit strategy.

// ---------------------------------------------------------------------
// 63. Translation loading
// ---------------------------------------------------------------------

export const TranslationLoadingState: FC = (): ReactElement => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section>
      {!loaded && <p role="status">Loading translations...</p>}

      <button
        type="button"
        onClick={() => {
          setLoaded(true);
        }}
      >
        Load translations
      </button>
    </section>
  );
};

// Translation resources may be loaded asynchronously.
// The application should provide a clear loading state when localized content
// is unavailable during initialization.

// ---------------------------------------------------------------------
// 64. Do not render untranslated keys accidentally
// ---------------------------------------------------------------------

export const TranslationFailureBoundary: FC = (): ReactElement => {
  const message = "Save changes";

  return <button type="button">{message}</button>;
};

// Translation keys are implementation identifiers.
// They should not accidentally become the visible interface when resource lookup fails.

// ---------------------------------------------------------------------
// 65. Localization and validation messages
// ---------------------------------------------------------------------

export const LocalizedValidationMessage: FC = (): ReactElement => {
  const message = "Enter a valid email address.";

  return <p role="alert">{message}</p>;
};

// Validation messages are user-facing content and require the same localization
// treatment as labels, buttons, headings, and navigation.

// ---------------------------------------------------------------------
// 66. Localization and empty states
// ---------------------------------------------------------------------

export const LocalizedEmptyState: FC = (): ReactElement => {
  return (
    <section>
      <h2>Search results</h2>

      <p>No matching results were found.</p>
    </section>
  );
};

// Empty-state text, recovery actions, and supporting instructions are also
// part of the localized interface.

// ---------------------------------------------------------------------
// 67. Localization and notifications
// ---------------------------------------------------------------------

export const LocalizedNotification: FC = (): ReactElement => {
  return <p role="status">Settings saved.</p>;
};

// Status messages and notifications should be localized while preserving
// their semantic roles and appropriate announcement behavior.

// ---------------------------------------------------------------------
// 68. Localization and placeholders
// ---------------------------------------------------------------------

export const LocalizedPlaceholder: FC = (): ReactElement => {
  return <input aria-label="Search" placeholder="Search products" />;
};

// Placeholders are user-facing strings and should be translated when used.
// They should not replace proper labels.

// ---------------------------------------------------------------------
// 69. Localization and document titles
// ---------------------------------------------------------------------

export const LocalizedDocumentTitle: FC = (): ReactElement => {
  return (
    <section>
      <p>Document title: Account settings</p>
    </section>
  );
};

// Browser titles are user-facing content and should be localized when the
// surrounding application supports multiple languages.

// ---------------------------------------------------------------------
// 70. Localization and metadata
// ---------------------------------------------------------------------

export const LocalizedMetadata: FC = (): ReactElement => {
  return (
    <section>
      <p>Page metadata can require localization alongside visible content.</p>
    </section>
  );
};

// Depending on the application and framework, titles, descriptions, and other
// metadata may need to be generated from the active locale.

// ---------------------------------------------------------------------
// 71. Translation functions
// ---------------------------------------------------------------------

type Translate = (key: string) => string;

const translate: Translate = (key) => {
  const dictionary: Record<string, string> = {
    "actions.save": "Save changes",
  };

  return dictionary[key] ?? key;
};

export const TranslationFunction: FC = (): ReactElement => {
  return <button type="button">{translate("actions.save")}</button>;
};

// A translation function creates a stable abstraction between components and
// the underlying translation resource.

// ---------------------------------------------------------------------
// 72. Translation functions with values
// ---------------------------------------------------------------------

type TranslateWithValues = (key: string, values: Record<string, string | number>) => string;

const translateWithValues: TranslateWithValues = (key, values) => {
  if (key === "welcome") {
    return `Welcome, ${values.name}.`;
  }

  return key;
};

export const TranslationInterpolationFunction: FC = (): ReactElement => {
  return <p>{translateWithValues("welcome", { name: "John Doe" })}</p>;
};

// Translation systems commonly support interpolation so translators can control
// sentence structure while applications provide dynamic values.

// ---------------------------------------------------------------------
// 73. Keep translation keys stable
// ---------------------------------------------------------------------

export const StableTranslationKey: FC = (): ReactElement => {
  return <button type="button">{translate("actions.save")}</button>;
};

// Translation keys should normally remain stable when the source wording changes.
// The localized resource can change without requiring component code changes.

// ---------------------------------------------------------------------
// 74. Avoid using translated text as identifiers
// ---------------------------------------------------------------------

export const SemanticIdentifier: FC = (): ReactElement => {
  const action = "save";

  return <button type="button">{translate(`actions.${action}`)}</button>;
};

// Application logic should use stable semantic identifiers rather than comparing
// localized strings such as "Save" or "Speichern".

// ---------------------------------------------------------------------
// 75. Translation versus formatting
// ---------------------------------------------------------------------

export const TranslationAndFormatting: FC = (): ReactElement => {
  const amount = 1299.99;

  return (
    <p>
      Save{" "}
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)}
    </p>
  );
};

// Translation and locale-sensitive formatting solve different problems.
// A message system handles language-dependent text while Intl handles many
// standardized locale-sensitive formatting operations.

// ---------------------------------------------------------------------
// 76. Translation versus business logic
// ---------------------------------------------------------------------

export const BusinessLogicBoundary: FC = (): ReactElement => {
  const canSave = true;
  const message = canSave ? translate("actions.save") : "Unavailable";

  return (
    <button type="button" disabled={!canSave}>
      {message}
    </button>
  );
};

// Business logic determines application state.
// Localization determines how that state is communicated to the user.

// ---------------------------------------------------------------------
// 77. Testing multiple locales
// ---------------------------------------------------------------------

export const LocaleTestingConcept: FC = (): ReactElement => {
  return (
    <ul>
      <li>Test the default locale.</li>

      <li>Test translated locales.</li>

      <li>Test longer translated strings.</li>

      <li>Test right-to-left locales where supported.</li>

      <li>Test locale-sensitive dates and numbers.</li>
    </ul>
  );
};

// Localization testing should exercise both linguistic content and the layout
// and behavior consequences of changing the locale.

// ---------------------------------------------------------------------
// 78. Test with realistic translations
// ---------------------------------------------------------------------

export const RealisticTranslationTesting: FC = (): ReactElement => {
  return (
    <section>
      <p>Translated strings should be tested in their actual UI contexts.</p>

      <p>Test wrapping, truncation, overflow, alignment, and control sizing.</p>
    </section>
  );
};

// Testing only short placeholder translations can conceal layout problems that
// appear with real translated content.

// ---------------------------------------------------------------------
// 79. Internationalization architecture
// ---------------------------------------------------------------------

export const InternationalizationArchitecture: FC = (): ReactElement => {
  return (
    <ol>
      <li>Determine the active locale.</li>

      <li>Load the corresponding resources.</li>

      <li>Provide localization services to the application.</li>

      <li>Translate user-facing messages.</li>

      <li>Format locale-sensitive values.</li>

      <li>Apply the appropriate writing direction.</li>
    </ol>
  );
};

// A consistent architecture prevents each component from independently solving
// locale detection, translation, formatting, and direction handling.

// ---------------------------------------------------------------------
// 80. Integrated internationalized example
// ---------------------------------------------------------------------

type ExampleLocale = "en-US" | "de-DE";

const exampleResources: Record<
  ExampleLocale,
  {
    readonly title: string;
    readonly description: string;
    readonly save: string;
    readonly saved: string;
  }
> = {
  "en-US": {
    title: "Account settings",
    description: "Update your account information.",
    save: "Save changes",
    saved: "Settings saved.",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    description: "Aktualisieren Sie Ihre Kontoinformationen.",
    save: "Änderungen speichern",
    saved: "Einstellungen gespeichert.",
  },
};

export const InternationalizedExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<ExampleLocale>("en-US");
  const [saved, setSaved] = useState(false);
  const messages = exampleResources[locale];

  return (
    <main>
      <label htmlFor="locale">Language</label>

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

export default InternationalizedExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Internationalization prepares software to support multiple languages, locales, writing systems, and regional conventions.
// - Localization adapts an internationalized application to a particular language or locale.
// - A locale includes language and regional conventions that influence presentation.
// - User-facing strings should have a clear boundary from application logic.
// - Translation resources associate stable message identifiers with localized text.
// - Translation keys should represent stable application meaning rather than source-language wording.
// - Complete messages should be translated rather than reconstructed from language-specific fragments.
// - Dynamic values should be interpolated into localized messages without assuming one language's word order.
// - Locale state can control which translation resources and formatting rules are active.
// - Unsupported locales should have an explicit fallback strategy.
// - Translation resources should be treated as configuration-like data rather than mutable application state.
// - Components can remain locale-independent by receiving already-localized values through props.
// - Layouts should accommodate translated text that is shorter or longer than the source language.
// - User-facing text embedded in images is difficult to translate and should generally be avoided.
// - Accessible names, labels, descriptions, validation messages, placeholders, and status messages are also user-facing content and must be localized when appropriate.
// - Internationalization must account for right-to-left languages and writing direction.
// - Logical CSS properties help layouts adapt to different writing directions.
// - Pluralization rules are language-sensitive and should not be reduced to an English-specific singular/plural condition.
// - Intl.PluralRules provides locale-aware plural categories.
// - Intl.DateTimeFormat should be preferred over manually constructing localized date strings.
// - Intl.NumberFormat should be preferred over manually constructing localized number strings.
// - Intl.RelativeTimeFormat provides locale-aware relative-time formatting.
// - Intl.DisplayNames provides localized names for supported standardized identifiers.
// - Intl.Collator provides locale-aware string comparison and collation.
// - Domain data should remain locale-neutral while presentation formats values for the active locale.
// - Formatted strings are presentation output and should not replace canonical domain values.
// - Explicit locale and time-zone configuration can make locale-sensitive rendering deterministic.
// - Server-rendered and client-rendered locale-sensitive output should use consistent configuration to avoid hydration mismatches.
// - Translation loading requires an explicit loading strategy when resources are asynchronous.
// - Missing translations should be detectable rather than silently exposing translation keys to users.
// - Translation functions provide a stable abstraction between components and localization resources.
// - Application logic should use semantic identifiers rather than comparing localized strings.
// - Translation and locale-sensitive formatting solve different problems and can be combined at the presentation boundary.
// - Internationalization testing should include multiple locales, realistic translations, locale-sensitive formatting, and writing-direction changes where applicable.
// - A consistent internationalization architecture separates locale selection, resource loading, translation, formatting, and direction handling.

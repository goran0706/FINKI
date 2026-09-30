/**
 * Translation Resources
 * =====================
 *
 * Translation resources are structured collections of localized messages that an
 * application can select according to the active locale. Keeping these resources
 * separate from components and application logic makes localized content easier
 * to maintain, validate, load, test, and extend.
 *
 * A translation resource normally maps stable message keys to user-facing
 * strings, while locale-sensitive formatting of dates, numbers, currencies, and
 * similar structured values is handled separately by the Intl APIs.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic translation resource
// ---------------------------------------------------------------------

const messages = {
  welcome: "Welcome",
  save: "Save",
  cancel: "Cancel",
};

export const BasicTranslationResource: FC = (): ReactElement => {
  return (
    <section>
      <p>{messages.welcome}</p>
      <button type="button">{messages.save}</button>
      <button type="button">{messages.cancel}</button>
    </section>
  );
};

// A translation resource maps stable message keys to localized values.

// ---------------------------------------------------------------------
// 2. Locale-specific resources
// ---------------------------------------------------------------------

const localeResources = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
  },
  "de-DE": {
    welcome: "Willkommen",
    save: "Speichern",
  },
};

export const LocaleSpecificResources: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <p>{localeResources[locale].welcome}</p>
      <button type="button">{localeResources[locale].save}</button>
    </section>
  );
};

// A locale-specific resource contains the messages for one supported locale.

// ---------------------------------------------------------------------
// 3. Resource object structure
// ---------------------------------------------------------------------

type Messages = {
  readonly welcome: string;
  readonly save: string;
  readonly cancel: string;
};

const typedResources: Record<string, Messages> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const TypedResourceStructure: FC = (): ReactElement => {
  return <p>{typedResources["de-DE"].welcome}</p>;
};

// A shared message type can describe the structure expected from every locale.

// ---------------------------------------------------------------------
// 4. Supported locale type
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE";

const supportedResources: Record<SupportedLocale, Messages> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const SupportedLocaleResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{supportedResources[locale].welcome}</p>;
};

// A union type restricts application code to the locales the application supports.

// ---------------------------------------------------------------------
// 5. Resource completeness with Record
// ---------------------------------------------------------------------

type CompleteMessages = {
  readonly title: string;
  readonly description: string;
};

const completeResources: Record<SupportedLocale, CompleteMessages> = {
  "en-US": {
    title: "Account settings",
    description: "Manage your account.",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    description: "Verwalten Sie Ihr Konto.",
  },
};

export const CompleteResourceStructure: FC = (): ReactElement => {
  return (
    <section>
      <h1>{completeResources["de-DE"].title}</h1>

      <p>{completeResources["de-DE"].description}</p>
    </section>
  );
};

// Record requires every SupportedLocale key to provide a complete resource.

// ---------------------------------------------------------------------
// 6. satisfies for resource validation
// ---------------------------------------------------------------------

const validatedResources = {
  "en-US": {
    title: "Profile",
    description: "Manage your profile.",
  },
  "de-DE": {
    title: "Profil",
    description: "Verwalten Sie Ihr Profil.",
  },
} satisfies Record<SupportedLocale, CompleteMessages>;

export const SatisfiesResourceValidation: FC = (): ReactElement => {
  return <h1>{validatedResources["de-DE"].title}</h1>;
};

// satisfies validates the resource against the expected structure without
// replacing the inferred type of the resource.

// ---------------------------------------------------------------------
// 7. Stable translation keys
// ---------------------------------------------------------------------

const stableKeyResources = {
  "en-US": {
    accountSettingsTitle: "Account settings",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
  },
};

export const StableTranslationKeys: FC = (): ReactElement => {
  return <h1>{stableKeyResources["de-DE"].accountSettingsTitle}</h1>;
};

// The key remains stable while the localized value changes.

// ---------------------------------------------------------------------
// 8. Avoid source text as a key
// ---------------------------------------------------------------------

const sourceTextKeys = {
  "en-US": {
    "Save changes": "Save changes",
  },
  "de-DE": {
    "Save changes": "Änderungen speichern",
  },
};

export const AvoidSourceTextKeys: FC = (): ReactElement => {
  return <button type="button">{sourceTextKeys["de-DE"]["Save changes"]}</button>;
};

// Using source text as a key couples the resource structure to one language.
// Semantic keys are more stable when source wording changes.

// ---------------------------------------------------------------------
// 9. Semantic resource keys
// ---------------------------------------------------------------------

const semanticResources = {
  "en-US": {
    saveAccountChanges: "Save changes",
  },
  "de-DE": {
    saveAccountChanges: "Änderungen speichern",
  },
};

export const SemanticResourceKeys: FC = (): ReactElement => {
  return <button type="button">{semanticResources["de-DE"].saveAccountChanges}</button>;
};

// A semantic key describes the purpose of the message rather than its wording.

// ---------------------------------------------------------------------
// 10. Resource namespaces
// ---------------------------------------------------------------------

const namespacedResources = {
  navigation: {
    home: "Home",
    profile: "Profile",
  },
  account: {
    title: "Account settings",
    save: "Save changes",
  },
};

export const ResourceNamespaces: FC = (): ReactElement => {
  return (
    <section>
      <nav>
        <a href="/">{namespacedResources.navigation.home}</a>

        <a href="/profile">{namespacedResources.navigation.profile}</a>
      </nav>

      <h1>{namespacedResources.account.title}</h1>
    </section>
  );
};

// Namespaces group related keys and reduce collisions in larger resource sets.

// ---------------------------------------------------------------------
// 11. Typed namespaces
// ---------------------------------------------------------------------

type ApplicationMessages = {
  readonly navigation: {
    readonly home: string;
    readonly profile: string;
  };
  readonly account: {
    readonly title: string;
    readonly save: string;
  };
};

const typedApplicationResources: Record<SupportedLocale, ApplicationMessages> = {
  "en-US": {
    navigation: {
      home: "Home",
      profile: "Profile",
    },
    account: {
      title: "Account settings",
      save: "Save changes",
    },
  },
  "de-DE": {
    navigation: {
      home: "Startseite",
      profile: "Profil",
    },
    account: {
      title: "Kontoeinstellungen",
      save: "Änderungen speichern",
    },
  },
};

export const TypedNamespaces: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const resource = typedApplicationResources[locale];

  return (
    <section>
      <a href="/">{resource.navigation.home}</a>

      <h1>{resource.account.title}</h1>
    </section>
  );
};

// Nested types can model the same namespaces across every supported locale.

// ---------------------------------------------------------------------
// 12. Resource lookup
// ---------------------------------------------------------------------

const getResource = (locale: SupportedLocale): ApplicationMessages => {
  return typedApplicationResources[locale];
};

export const ResourceLookup: FC = (): ReactElement => {
  const resource = getResource("de-DE");

  return <h1>{resource.account.title}</h1>;
};

// A lookup function can centralize how locale resources are selected.

// ---------------------------------------------------------------------
// 13. Resource lookup with a fallback
// ---------------------------------------------------------------------

const fallbackResources: Partial<Record<SupportedLocale, ApplicationMessages>> = {
  "en-US": typedApplicationResources["en-US"],
  "de-DE": {
    navigation: {
      home: "Startseite",
      profile: "Profil",
    },
    account: {
      title: "Kontoeinstellungen",
      save: "Änderungen speichern",
    },
  },
};

const getResourceWithFallback = (locale: SupportedLocale): ApplicationMessages => {
  return fallbackResources[locale] ?? fallbackResources["en-US"]!;
};

export const ResourceFallback: FC = (): ReactElement => {
  return <p>{getResourceWithFallback("de-DE").account.title}</p>;
};

// A fallback resource can provide a complete default when a requested locale
// resource is unavailable.

// ---------------------------------------------------------------------
// 14. Avoid partial fallback assumptions
// ---------------------------------------------------------------------

type PartialMessages = Partial<Messages>;

const partialResources: Record<SupportedLocale, PartialMessages> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

export const PartialResource: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const save = partialResources[locale].save ?? partialResources["en-US"].save ?? "Save";

  return <button type="button">{save}</button>;
};

// Partial resources require an explicit policy for missing individual messages.

// ---------------------------------------------------------------------
// 15. Resource-level fallback
// ---------------------------------------------------------------------

const completeLocaleResources: Record<SupportedLocale, Messages> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

const selectCompleteResource = (locale: SupportedLocale): Messages => {
  return completeLocaleResources[locale] ?? completeLocaleResources["en-US"];
};

export const CompleteResourceFallback: FC = (): ReactElement => {
  return <p>{selectCompleteResource("de-DE").welcome}</p>;
};

// A complete fallback resource is simpler to reason about than independently
// falling back every message key.

// ---------------------------------------------------------------------
// 16. Resource key type
// ---------------------------------------------------------------------

type MessageKey = keyof Messages;

const getMessage = (locale: SupportedLocale, key: MessageKey): string => {
  return completeLocaleResources[locale][key];
};

export const ResourceKeyLookup: FC = (): ReactElement => {
  return <p>{getMessage("de-DE", "welcome")}</p>;
};

// keyof can derive valid message keys directly from the resource type.

// ---------------------------------------------------------------------
// 17. Typed translation function
// ---------------------------------------------------------------------

const translate = (locale: SupportedLocale, key: keyof Messages): string => {
  return completeLocaleResources[locale][key];
};

export const TypedTranslateFunction: FC = (): ReactElement => {
  return <button type="button">{translate("de-DE", "save")}</button>;
};

// A typed translation function prevents unsupported message keys at compile time.

// ---------------------------------------------------------------------
// 18. Bound translator
// ---------------------------------------------------------------------

const createTranslator = (locale: SupportedLocale) => {
  return (key: keyof Messages): string => {
    return completeLocaleResources[locale][key];
  };
};

export const BoundResourceTranslator: FC = (): ReactElement => {
  const t = createTranslator("de-DE");

  return (
    <section>
      <p>{t("welcome")}</p>
      <button type="button">{t("save")}</button>
    </section>
  );
};

// Binding the locale once can make repeated resource lookups concise.

// ---------------------------------------------------------------------
// 19. Resource values are user-facing content
// ---------------------------------------------------------------------

const userFacingResources = {
  "en-US": {
    title: "Account settings",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
  },
};

export const UserFacingResource: FC = (): ReactElement => {
  return <h1>{userFacingResources["de-DE"].title}</h1>;
};

// Resource values contain the text users actually see or hear through the interface.

// ---------------------------------------------------------------------
// 20. Resource values are not business data
// ---------------------------------------------------------------------

type OrderStatus = "pending" | "complete";

const orderStatusResources: Record<SupportedLocale, Record<OrderStatus, string>> = {
  "en-US": {
    pending: "Pending",
    complete: "Complete",
  },
  "de-DE": {
    pending: "Ausstehend",
    complete: "Abgeschlossen",
  },
};

export const ResourceAndBusinessData: FC = (): ReactElement => {
  const status: OrderStatus = "pending";
  const locale: SupportedLocale = "de-DE";

  return <p>{orderStatusResources[locale][status]}</p>;
};

// Stable domain values should remain separate from their localized representations.

// ---------------------------------------------------------------------
// 21. Translation resources and structured values
// ---------------------------------------------------------------------

const structuredValueResources = {
  "en-US": {
    lastUpdated: "Last updated:",
  },
  "de-DE": {
    lastUpdated: "Zuletzt aktualisiert:",
  },
};

export const ResourceWithStructuredValue: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const date = new Date("2026-09-29T12:00:00Z");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);

  return (
    <p>
      {structuredValueResources[locale].lastUpdated} {formattedDate}
    </p>
  );
};

// Translation resources provide the surrounding message while Intl formats the date value.

// ---------------------------------------------------------------------
// 22. Resource and number formatting
// ---------------------------------------------------------------------

const numberResources = {
  "en-US": {
    total: "Total:",
  },
  "de-DE": {
    total: "Gesamt:",
  },
};

export const ResourceWithNumberFormatting: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const amount = 1234567.89;

  const formattedAmount = new Intl.NumberFormat(locale).format(amount);

  return (
    <p>
      {numberResources[locale].total} {formattedAmount}
    </p>
  );
};

// Numeric data should remain numeric until it reaches the formatting boundary.

// ---------------------------------------------------------------------
// 23. Resource and currency formatting
// ---------------------------------------------------------------------

const priceResources = {
  "en-US": {
    price: "Price:",
  },
  "de-DE": {
    price: "Preis:",
  },
};

export const ResourceWithCurrency: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const price = 1299.99;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);

  return (
    <p>
      {priceResources[locale].price} {formattedPrice}
    </p>
  );
};

// The translation resource provides language content while Intl.NumberFormat
// handles locale-sensitive currency presentation. :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 24. Resource and relative time
// ---------------------------------------------------------------------

const relativeTimeResources = {
  "en-US": {
    updated: "Updated",
  },
  "de-DE": {
    updated: "Aktualisiert",
  },
};

export const ResourceWithRelativeTime: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  const relativeTime = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(-1, "day");

  return (
    <p>
      {relativeTimeResources[locale].updated}: {relativeTime}
    </p>
  );
};

// Relative-time wording belongs to locale-sensitive formatting rather than static
// translation resources when it is generated from structured time data.

// ---------------------------------------------------------------------
// 25. Interpolated resource values
// ---------------------------------------------------------------------

const greetingResources = {
  "en-US": {
    greeting: "Hello, {name}!",
  },
  "de-DE": {
    greeting: "Hallo, {name}!",
  },
};

const interpolate = (message: string, values: Record<string, string>): string => {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
};

export const InterpolatedResourceValue: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const message = greetingResources[locale].greeting;

  return (
    <p>
      {interpolate(message, {
        name: "John Doe",
      })}
    </p>
  );
};

// Resources can contain placeholders for runtime values.

// ---------------------------------------------------------------------
// 26. Complete sentence resources
// ---------------------------------------------------------------------

const sentenceResources = {
  "en-US": {
    notification: "{name} sent you a message.",
  },
  "de-DE": {
    notification: "{name} hat Ihnen eine Nachricht gesendet.",
  },
};

export const CompleteSentenceResource: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{interpolate(sentenceResources[locale].notification, { name: "John Doe" })}</p>;
};

// Keeping the complete sentence in the resource lets each language control its grammar and word order.

// ---------------------------------------------------------------------
// 27. Avoid sentence fragments in resources
// ---------------------------------------------------------------------

const fragmentResources = {
  "en-US": {
    greeting: "Hello",
    userName: "John Doe",
  },
  "de-DE": {
    greeting: "Hallo",
    userName: "John Doe",
  },
};

export const AvoidFragmentedResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <p>
      {fragmentResources[locale].greeting} {fragmentResources[locale].userName}
    </p>
  );
};

// Splitting a sentence into independently translated fragments can prevent
// translators from adapting grammar and word order naturally.

// ---------------------------------------------------------------------
// 28. Resource context
// ---------------------------------------------------------------------

const contextualResources = {
  "en-US": {
    recordNoun: "Record",
    recordVerb: "Record",
  },
  "de-DE": {
    recordNoun: "Datensatz",
    recordVerb: "Aufnehmen",
  },
};

export const ContextualResourceKeys: FC = (): ReactElement => {
  return (
    <div>
      <p>{contextualResources["de-DE"].recordNoun}</p>
      <button type="button">{contextualResources["de-DE"].recordVerb}</button>
    </div>
  );
};

// Separate keys can provide context when the same source concept requires different translations.

// ---------------------------------------------------------------------
// 29. Resource descriptions
// ---------------------------------------------------------------------

type ResourceMessage = {
  readonly value: string;
  readonly description: string;
};

const describedResources: Record<
  SupportedLocale,
  {
    readonly saveButton: ResourceMessage;
  }
> = {
  "en-US": {
    saveButton: {
      value: "Save",
      description: "Button that saves the current account changes.",
    },
  },
  "de-DE": {
    saveButton: {
      value: "Speichern",
      description: "Schaltfläche zum Speichern der aktuellen Kontodaten.",
    },
  },
};

export const ResourceDescriptions: FC = (): ReactElement => {
  return <button type="button">{describedResources["de-DE"].saveButton.value}</button>;
};

// Metadata can provide translators with context without changing the user-facing message.

// ---------------------------------------------------------------------
// 30. Resource comments and developer context
// ---------------------------------------------------------------------

const resourceEntry = {
  value: "Save",
  description: "Saves the current account changes.",
};

export const ResourceDeveloperContext: FC = (): ReactElement => {
  return <button type="button">{resourceEntry.value}</button>;
};

// Developer context should explain what a message means or where it is used,
// rather than prescribing how the translator must phrase it.

// ---------------------------------------------------------------------
// 31. Plural resource categories
// ---------------------------------------------------------------------

type ItemMessages = {
  readonly one: string;
  readonly other: string;
};

const itemResources: Record<SupportedLocale, ItemMessages> = {
  "en-US": {
    one: "{count} item",
    other: "{count} items",
  },
  "de-DE": {
    one: "{count} Artikel",
    other: "{count} Artikel",
  },
};

export const PluralResource: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const count = 3;
  const category = new Intl.PluralRules(locale).select(count);

  const message = category === "one" ? itemResources[locale].one : itemResources[locale].other;

  return (
    <p>
      {interpolate(message, {
        count: String(count),
      })}
    </p>
  );
};

// Plural categories belong to the target locale's grammatical rules.
// Resource structures may need more than singular and plural depending on the language.

// ---------------------------------------------------------------------
// 32. Resource categories should match locale rules
// ---------------------------------------------------------------------

const arabicItemResources = {
  zero: "{count} عناصر",
  one: "عنصر واحد",
  two: "عنصران",
  few: "{count} عناصر",
  many: "{count} عنصرًا",
  other: "{count} عنصر",
};

export const LocalePluralCategories: FC = (): ReactElement => {
  const locale = "ar-EG";
  const count = 2;
  const category = new Intl.PluralRules(locale).select(count);

  return <p>{category === "two" ? arabicItemResources.two : arabicItemResources.other}</p>;
};

// Translation resources should reflect the plural categories required by each locale.
// Intl.PluralRules can determine the category for a numeric value.

// ---------------------------------------------------------------------
// 33. Resource completeness for plural messages
// ---------------------------------------------------------------------

type EnglishPluralMessages = {
  readonly one: string;
  readonly other: string;
};

const pluralResources: Record<SupportedLocale, EnglishPluralMessages> = {
  "en-US": {
    one: "{count} item",
    other: "{count} items",
  },
  "de-DE": {
    one: "{count} Artikel",
    other: "{count} Artikel",
  },
};

export const CompletePluralResources: FC = (): ReactElement => {
  return <p>{pluralResources["de-DE"].other}</p>;
};

// Typed plural resources make required categories explicit for the resource structure.

// ---------------------------------------------------------------------
// 34. Resource for validation messages
// ---------------------------------------------------------------------

const validationResources = {
  "en-US": {
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
  },
  "de-DE": {
    required: "Dieses Feld ist erforderlich.",
    invalidEmail: "Geben Sie eine gültige E-Mail-Adresse ein.",
  },
};

export const ValidationResources: FC = (): ReactElement => {
  return (
    <ul>
      <li>{validationResources["de-DE"].required}</li>
      <li>{validationResources["de-DE"].invalidEmail}</li>
    </ul>
  );
};

// Validation feedback is user-facing content and belongs in translation resources.

// ---------------------------------------------------------------------
// 35. Resource for status messages
// ---------------------------------------------------------------------

const statusResources = {
  "en-US": {
    saved: "Changes saved.",
    loading: "Loading...",
  },
  "de-DE": {
    saved: "Änderungen gespeichert.",
    loading: "Wird geladen...",
  },
};

export const StatusResources: FC = (): ReactElement => {
  return (
    <div>
      <p role="status">{statusResources["de-DE"].loading}</p>

      <p role="status">{statusResources["de-DE"].saved}</p>
    </div>
  );
};

// Loading and success messages should be localized along with ordinary interface text.

// ---------------------------------------------------------------------
// 36. Resource for accessible names
// ---------------------------------------------------------------------

const accessibilityResources = {
  "en-US": {
    close: "Close",
    mainNavigation: "Main navigation",
  },
  "de-DE": {
    close: "Schließen",
    mainNavigation: "Hauptnavigation",
  },
};

export const AccessibilityResources: FC = (): ReactElement => {
  return (
    <nav aria-label={accessibilityResources["de-DE"].mainNavigation}>
      <button type="button" aria-label={accessibilityResources["de-DE"].close}>
        ×
      </button>
    </nav>
  );
};

// Accessible names are part of the localized interface and should be represented in resources.

// ---------------------------------------------------------------------
// 37. Resource for empty states
// ---------------------------------------------------------------------

const emptyStateResources = {
  "en-US": {
    noResults: "No results found.",
  },
  "de-DE": {
    noResults: "Keine Ergebnisse gefunden.",
  },
};

export const EmptyStateResources: FC = (): ReactElement => {
  return <p>{emptyStateResources["de-DE"].noResults}</p>;
};

// Empty-state content is user-facing content and belongs in localized resources.

// ---------------------------------------------------------------------
// 38. Resource for errors
// ---------------------------------------------------------------------

const errorResources = {
  "en-US": {
    unexpected: "Something went wrong.",
    network: "The network request failed.",
  },
  "de-DE": {
    unexpected: "Etwas ist schiefgelaufen.",
    network: "Die Netzwerkanfrage ist fehlgeschlagen.",
  },
};

export const ErrorResources: FC = (): ReactElement => {
  return <p role="alert">{errorResources["de-DE"].network}</p>;
};

// User-facing error messages should be localized without exposing unnecessary implementation details.

// ---------------------------------------------------------------------
// 39. Error codes remain stable
// ---------------------------------------------------------------------

type ErrorCode = "NETWORK_ERROR" | "UNAUTHORIZED";

const localizedErrors: Record<SupportedLocale, Record<ErrorCode, string>> = {
  "en-US": {
    NETWORK_ERROR: "The network request failed.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
  },
  "de-DE": {
    NETWORK_ERROR: "Die Netzwerkanfrage ist fehlgeschlagen.",
    UNAUTHORIZED: "Sie sind nicht berechtigt, diese Aktion auszuführen.",
  },
};

export const StableErrorCodes: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const errorCode: ErrorCode = "NETWORK_ERROR";

  return <p role="alert">{localizedErrors[locale][errorCode]}</p>;
};

// Stable error codes can drive application logic while resources provide localized descriptions.

// ---------------------------------------------------------------------
// 40. Resource for form labels
// ---------------------------------------------------------------------

const formResources = {
  "en-US": {
    email: "Email address",
    password: "Password",
  },
  "de-DE": {
    email: "E-Mail-Adresse",
    password: "Passwort",
  },
};

export const FormResources: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">{formResources["de-DE"].email}</label>

      <input id="email" type="email" />

      <label htmlFor="password">{formResources["de-DE"].password}</label>

      <input id="password" type="password" />
    </form>
  );
};

// Form labels are localized resources, while input values remain application data.

// ---------------------------------------------------------------------
// 41. Resource for placeholders
// ---------------------------------------------------------------------

const placeholderResources = {
  "en-US": {
    search: "Search",
  },
  "de-DE": {
    search: "Suchen",
  },
};

export const PlaceholderResources: FC = (): ReactElement => {
  return <input type="search" placeholder={placeholderResources["de-DE"].search} />;
};

// Placeholder text is also user-facing content and may require localization.

// ---------------------------------------------------------------------
// 42. Resource for navigation
// ---------------------------------------------------------------------

const navigationResources = {
  "en-US": {
    home: "Home",
    settings: "Settings",
  },
  "de-DE": {
    home: "Startseite",
    settings: "Einstellungen",
  },
};

export const NavigationResources: FC = (): ReactElement => {
  return (
    <nav>
      <a href="/">{navigationResources["de-DE"].home}</a>

      <a href="/settings">{navigationResources["de-DE"].settings}</a>
    </nav>
  );
};

// Navigation labels are localized resource values.

// ---------------------------------------------------------------------
// 43. Resource for document metadata
// ---------------------------------------------------------------------

const documentResources = {
  "en-US": {
    profileTitle: "Profile",
  },
  "de-DE": {
    profileTitle: "Profil",
  },
};

export const DocumentMetadataResources: FC = (): ReactElement => {
  return <h1>{documentResources["de-DE"].profileTitle}</h1>;
};

// Browser document metadata such as the page title can also require localized content.

// ---------------------------------------------------------------------
// 44. Resource and HTML language metadata
// ---------------------------------------------------------------------

const languageResources = {
  "en-US": {
    title: "Account settings",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
  },
};

export const LanguageMetadataResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <section lang={locale.split("-")[0]}>
      <h1>{languageResources[locale].title}</h1>
    </section>
  );
};

// The language metadata of rendered content should correspond to the localized content.

// ---------------------------------------------------------------------
// 45. Resource and writing direction
// ---------------------------------------------------------------------

const rtlResources = {
  "en-US": {
    title: "Account settings",
  },
  "ar-EG": {
    title: "إعدادات الحساب",
  },
};

export const DirectionalResources: FC = (): ReactElement => {
  const locale = "ar-EG";

  return (
    <main lang="ar" dir="rtl">
      <h1>{rtlResources[locale].title}</h1>
    </main>
  );
};

// Localized resources may require a corresponding text direction in the rendered UI.

// ---------------------------------------------------------------------
// 46. Resource and locale metadata
// ---------------------------------------------------------------------

type LocaleResource = {
  readonly locale: SupportedLocale;
  readonly messages: Messages;
};

const resource: LocaleResource = {
  locale: "de-DE",
  messages: {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const ResourceMetadata: FC = (): ReactElement => {
  return (
    <p>
      {resource.locale}: {resource.messages.welcome}
    </p>
  );
};

// Keeping the locale associated with its resource can make resource management explicit.

// ---------------------------------------------------------------------
// 47. Resource factory
// ---------------------------------------------------------------------

const createResource = (locale: SupportedLocale, messages: Messages): LocaleResource => {
  return {
    locale,
    messages,
  };
};

export const ResourceFactory: FC = (): ReactElement => {
  const germanResource = createResource("de-DE", {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  });

  return <p>{germanResource.messages.welcome}</p>;
};

// A factory can centralize construction and validation of resource objects.

// ---------------------------------------------------------------------
// 48. Resource loading concept
// ---------------------------------------------------------------------

export const ResourceLoadingConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>An application can load only the translation resources required by the active locale or feature.</p>

      <p>Loading state and failure state should be handled explicitly.</p>
    </section>
  );
};

// Translation resources can be loaded independently when an application has many locales or features.

// ---------------------------------------------------------------------
// 49. Resource loading state
// ---------------------------------------------------------------------

const loadingResources = {
  "en-US": {
    loading: "Loading translations...",
  },
  "de-DE": {
    loading: "Übersetzungen werden geladen...",
  },
};

export const ResourceLoadingState: FC = (): ReactElement => {
  return <p role="status">{loadingResources["de-DE"].loading}</p>;
};

// Resource-loading states are themselves localized content.

// ---------------------------------------------------------------------
// 50. Resource loading error
// ---------------------------------------------------------------------

const loadingErrorResources = {
  "en-US": {
    failed: "Translations could not be loaded.",
  },
  "de-DE": {
    failed: "Übersetzungen konnten nicht geladen werden.",
  },
};

export const ResourceLoadingError: FC = (): ReactElement => {
  return <p role="alert">{loadingErrorResources["de-DE"].failed}</p>;
};

// Resource-loading failures need a user-facing fallback message.

// ---------------------------------------------------------------------
// 51. Resource validation
// ---------------------------------------------------------------------

const requiredMessageKeys = ["welcome", "save", "cancel"] as const;

const isCompleteResource = (resource: Partial<Messages>): resource is Messages => {
  return requiredMessageKeys.every((key) => typeof resource[key] === "string");
};

export const ResourceValidation: FC = (): ReactElement => {
  const resource: Partial<Messages> = {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  };

  return <p>{isCompleteResource(resource) ? "Complete" : "Incomplete"}</p>;
};

// Runtime validation can detect incomplete resources loaded from external files or services.

// ---------------------------------------------------------------------
// 52. Resource validation and external data
// ---------------------------------------------------------------------

const externalResource: unknown = {
  welcome: "Welcome",
  save: "Save",
  cancel: "Cancel",
};

export const ExternalResourceValidation: FC = (): ReactElement => {
  const valid = typeof externalResource === "object" && externalResource !== null;

  return <p>{valid ? "Resource received" : "Invalid resource"}</p>;
};

// Data loaded from outside the TypeScript program should be validated at runtime.
// TypeScript types alone do not validate runtime data.

// ---------------------------------------------------------------------
// 53. Resource versioning
// ---------------------------------------------------------------------

type ResourceMetadataWithVersion = {
  readonly locale: SupportedLocale;
  readonly version: number;
  readonly messages: Messages;
};

const versionedResource: ResourceMetadataWithVersion = {
  locale: "de-DE",
  version: 1,
  messages: {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const VersionedResource: FC = (): ReactElement => {
  return (
    <p>
      {versionedResource.locale} / v{versionedResource.version}
    </p>
  );
};

// Metadata such as a resource version can help manage independently loaded resource sets.

// ---------------------------------------------------------------------
// 54. Resource organization by feature
// ---------------------------------------------------------------------

type FeatureResources = {
  readonly account: Messages;
  readonly navigation: {
    readonly home: string;
    readonly profile: string;
  };
};

const featureResources: Record<SupportedLocale, FeatureResources> = {
  "en-US": {
    account: {
      welcome: "Welcome",
      save: "Save",
      cancel: "Cancel",
    },
    navigation: {
      home: "Home",
      profile: "Profile",
    },
  },
  "de-DE": {
    account: {
      welcome: "Willkommen",
      save: "Speichern",
      cancel: "Abbrechen",
    },
    navigation: {
      home: "Startseite",
      profile: "Profil",
    },
  },
};

export const FeatureResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <section>
      <h1>{featureResources[locale].account.welcome}</h1>

      <nav>
        <a href="/">{featureResources[locale].navigation.home}</a>
      </nav>
    </section>
  );
};

// Feature-oriented resource organization can keep large resource sets manageable.

// ---------------------------------------------------------------------
// 55. Resource composition
// ---------------------------------------------------------------------

const commonResources = {
  cancel: "Cancel",
};

const accountFeatureResources = {
  title: "Account settings",
  save: "Save changes",
};

const composedEnglishResources = {
  ...commonResources,
  ...accountFeatureResources,
};

export const ComposedResource: FC = (): ReactElement => {
  return (
    <section>
      <h1>{composedEnglishResources.title}</h1>
      <button type="button">{composedEnglishResources.save}</button>
      <button type="button">{composedEnglishResources.cancel}</button>
    </section>
  );
};

// Resources can be composed from feature or shared resource sections,
// provided the resulting structure remains unambiguous.

// ---------------------------------------------------------------------
// 56. Resource key collisions
// ---------------------------------------------------------------------

const accountNamespace = {
  save: "Save changes",
};

const profileNamespace = {
  save: "Save profile",
};

export const ResourceKeyCollisions: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">{accountNamespace.save}</button>

      <button type="button">{profileNamespace.save}</button>
    </div>
  );
};

// Namespaces can distinguish messages that use the same short source word in different contexts.

// ---------------------------------------------------------------------
// 57. Resource identity and locale
// ---------------------------------------------------------------------

const resourceByLocale: Record<SupportedLocale, Messages> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const ResourceIdentity: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const resource = resourceByLocale[locale];

  return (
    <p>
      {locale}: {resource.welcome}
    </p>
  );
};

// The locale identifies which resource is selected.

// ---------------------------------------------------------------------
// 58. Resource fallback chain
// ---------------------------------------------------------------------

const resourceFallbackChain: Record<SupportedLocale, readonly SupportedLocale[]> = {
  "en-US": ["en-US"],
  "de-DE": ["de-DE", "en-US"],
};

export const ResourceFallbackChain: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{resourceFallbackChain[locale].join(" → ")}</p>;
};

// A fallback chain makes resource selection behavior explicit.

// ---------------------------------------------------------------------
// 59. Resource immutability
// ---------------------------------------------------------------------

const immutableResource = {
  welcome: "Welcome",
  save: "Save",
  cancel: "Cancel",
} as const;

export const ImmutableResource: FC = (): ReactElement => {
  return <p>{immutableResource.welcome}</p>;
};

// Translation resources are commonly treated as configuration data and should not
// be mutated by rendering code.

// ---------------------------------------------------------------------
// 60. Resource as read-only application configuration
// ---------------------------------------------------------------------

type ReadonlyMessages = {
  readonly welcome: string;
  readonly save: string;
};

const readonlyResource: ReadonlyMessages = {
  welcome: "Welcome",
  save: "Save",
};

export const ReadonlyResource: FC = (): ReactElement => {
  return (
    <section>
      <p>{readonlyResource.welcome}</p>
      <button type="button">{readonlyResource.save}</button>
    </section>
  );
};

// readonly communicates that rendering code should consume the resource rather than modify it.

// ---------------------------------------------------------------------
// 61. Resource and React component boundaries
// ---------------------------------------------------------------------

type MessageProps = {
  readonly message: string;
};

export const LocalizedMessage: FC<MessageProps> = ({ message }): ReactElement => {
  return <span>{message}</span>;
};

export const ResourceComponentBoundary: FC = (): ReactElement => {
  const message = resourceByLocale["de-DE"].welcome;

  return <LocalizedMessage message={message} />;
};

// Presentational components can receive localized values without knowing resource structure.

// ---------------------------------------------------------------------
// 62. Resource selection before rendering
// ---------------------------------------------------------------------

type LocalizedHeaderProps = {
  readonly locale: SupportedLocale;
};

export const ResourceSelectionBoundary: FC<LocalizedHeaderProps> = ({ locale }): ReactElement => {
  const resource = resourceByLocale[locale];

  return (
    <header>
      <h1>{resource.welcome}</h1>
    </header>
  );
};

// Resource selection can occur at a boundary before localized content reaches presentational components.

// ---------------------------------------------------------------------
// 63. Resource and domain separation
// ---------------------------------------------------------------------

type Account = {
  readonly displayName: string;
};

const account: Account = {
  displayName: "John Doe",
};

const accountResources = {
  "en-US": {
    welcome: "Welcome",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

export const ResourceDomainSeparation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <p>
      {accountResources[locale].welcome}, {account.displayName}.
    </p>
  );
};

// User data remains domain data while the surrounding message comes from the resource.

// ---------------------------------------------------------------------
// 64. Resource and formatted domain data
// ---------------------------------------------------------------------

type AccountBalance = {
  readonly amount: number;
};

const balance: AccountBalance = {
  amount: 1299.99,
};

const balanceResources = {
  "en-US": {
    balance: "Balance:",
  },
  "de-DE": {
    balance: "Kontostand:",
  },
};

export const ResourceFormattedDomainData: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <p>
      {balanceResources[locale].balance}{" "}
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }).format(balance.amount)}
    </p>
  );
};

// Structured domain data and translated labels remain separate until presentation.

// ---------------------------------------------------------------------
// 65. Resource and localized lists
// ---------------------------------------------------------------------

const listResources = {
  "en-US": {
    members: ["John Doe", "Jane Doe", "Alex Doe"],
  },
  "de-DE": {
    members: ["John Doe", "Jane Doe", "Alex Doe"],
  },
};

export const ResourceLocalizedList: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  const formattedMembers = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(listResources[locale].members);

  return <p>{formattedMembers}</p>;
};

// Locale-sensitive list formatting belongs to Intl while the resource can provide
// the surrounding translated message or localized data labels. :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 66. Resource and collation
// ---------------------------------------------------------------------

const names = ["Zoe", "Änne", "Anna"];

export const ResourceCollation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  const sortedNames = [...names].sort(new Intl.Collator(locale).compare);

  return (
    <ul>
      {sortedNames.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

// Translation resources should not be used to implement locale-sensitive sorting.
// Collation is handled by the Intl APIs.

// ---------------------------------------------------------------------
// 67. Resource and text direction metadata
// ---------------------------------------------------------------------

type DirectionalResource = {
  readonly locale: "en-US" | "ar-EG";
  readonly direction: "ltr" | "rtl";
  readonly title: string;
};

const directionalResources: Record<DirectionalResource["locale"], DirectionalResource> = {
  "en-US": {
    locale: "en-US",
    direction: "ltr",
    title: "Account settings",
  },
  "ar-EG": {
    locale: "ar-EG",
    direction: "rtl",
    title: "إعدادات الحساب",
  },
};

export const DirectionalResourceMetadata: FC = (): ReactElement => {
  const resource = directionalResources["ar-EG"];

  return (
    <main lang="ar" dir={resource.direction}>
      <h1>{resource.title}</h1>
    </main>
  );
};

// Language and direction metadata should correspond to the content being rendered.
// W3C's current internationalization work explicitly addresses language and direction metadata. :contentReference[oaicite:2]{index=2}

// ---------------------------------------------------------------------
// 68. Resource and locale negotiation
// ---------------------------------------------------------------------

const supportedLocales: readonly SupportedLocale[] = ["en-US", "de-DE"];

const selectSupportedLocale = (requested: readonly string[]): SupportedLocale => {
  for (const candidate of requested) {
    if (supportedLocales.includes(candidate as SupportedLocale)) {
      return candidate as SupportedLocale;
    }
  }

  return "en-US";
};

export const ResourceLocaleNegotiation: FC = (): ReactElement => {
  const locale = selectSupportedLocale(["fr-FR", "de-DE", "en-US"]);

  return <p>{locale}</p>;
};

// Resource selection should operate on the application's supported locale set,
// not on arbitrary locale values supplied by the environment.

// ---------------------------------------------------------------------
// 69. Resource loading by locale
// ---------------------------------------------------------------------

const resourcePaths: Record<SupportedLocale, string> = {
  "en-US": "/locales/en-US.json",
  "de-DE": "/locales/de-DE.json",
};

export const ResourcePaths: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <code>{resourcePaths[locale]}</code>;
};

// Applications may associate each supported locale with an independently loaded resource.

// ---------------------------------------------------------------------
// 70. Resource loading by feature
// ---------------------------------------------------------------------

const featureResourcePaths = {
  account: {
    "en-US": "/locales/en-US/account.json",
    "de-DE": "/locales/de-DE/account.json",
  },
  navigation: {
    "en-US": "/locales/en-US/navigation.json",
    "de-DE": "/locales/de-DE/navigation.json",
  },
};

export const FeatureResourcePaths: FC = (): ReactElement => {
  return (
    <ul>
      <li>{featureResourcePaths.account["de-DE"]}</li>
      <li>{featureResourcePaths.navigation["de-DE"]}</li>
    </ul>
  );
};

// Feature-based loading can keep unrelated translation resources separate.

// ---------------------------------------------------------------------
// 71. Resource loading should preserve locale identity
// ---------------------------------------------------------------------

type LoadedResource = {
  readonly locale: SupportedLocale;
  readonly messages: Messages;
};

const loadedResource: LoadedResource = {
  locale: "de-DE",
  messages: {
    welcome: "Willkommen",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const LoadedResourceIdentity: FC = (): ReactElement => {
  return (
    <p>
      {loadedResource.locale}: {loadedResource.messages.welcome}
    </p>
  );
};

// Loaded resources should retain their locale identity so the application can verify
// that the resource corresponds to the requested locale.

// ---------------------------------------------------------------------
// 72. Resource completeness across locales
// ---------------------------------------------------------------------

type RequiredResource = {
  readonly home: string;
  readonly settings: string;
  readonly profile: string;
};

const completeNavigationResources: Record<SupportedLocale, RequiredResource> = {
  "en-US": {
    home: "Home",
    settings: "Settings",
    profile: "Profile",
  },
  "de-DE": {
    home: "Startseite",
    settings: "Einstellungen",
    profile: "Profil",
  },
};

export const ResourceCompletenessAcrossLocales: FC = (): ReactElement => {
  return (
    <nav>
      <a href="/">{completeNavigationResources["de-DE"].home}</a>

      <a href="/settings">{completeNavigationResources["de-DE"].settings}</a>
    </nav>
  );
};

// A shared resource type can require the same key structure across supported locales.

// ---------------------------------------------------------------------
// 73. Resource extension
// ---------------------------------------------------------------------

type BaseMessages = {
  readonly cancel: string;
};

type AccountMessages = BaseMessages & {
  readonly save: string;
  readonly title: string;
};

const accountResource: AccountMessages = {
  cancel: "Cancel",
  save: "Save changes",
  title: "Account settings",
};

export const ExtendedResourceType: FC = (): ReactElement => {
  return (
    <section>
      <h1>{accountResource.title}</h1>
      <button type="button">{accountResource.save}</button>
      <button type="button">{accountResource.cancel}</button>
    </section>
  );
};

// Resource types can be composed when multiple features share common message structures.

// ---------------------------------------------------------------------
// 74. Resource key extraction
// ---------------------------------------------------------------------

type ResourceKeys = keyof typeof accountResource;

export const ExtractedResourceKeys: FC = (): ReactElement => {
  const key: ResourceKeys = "save";

  return <p>{key}</p>;
};

// TypeScript can derive valid resource keys from the resource structure itself.

// ---------------------------------------------------------------------
// 75. Resource key validation
// ---------------------------------------------------------------------

const hasMessageKey = (resource: Partial<Messages>, key: keyof Messages): boolean => {
  return typeof resource[key] === "string";
};

export const ResourceKeyValidation: FC = (): ReactElement => {
  const resource: Partial<Messages> = {
    welcome: "Welcome",
  };

  return <p>{hasMessageKey(resource, "welcome") ? "Available" : "Missing"}</p>;
};

// Individual resource keys can be validated when resources are partial or dynamically loaded.

// ---------------------------------------------------------------------
// 76. Resource and locale-specific grammar
// ---------------------------------------------------------------------

const grammarResources = {
  "en-US": {
    sentence: "John Doe is ready.",
  },
  "de-DE": {
    sentence: "John Doe ist bereit.",
  },
};

export const LocaleSpecificGrammar: FC = (): ReactElement => {
  return <p>{grammarResources["de-DE"].sentence}</p>;
};

// Resources must allow each language to express its own grammar rather than forcing
// every locale into the source language's sentence structure.

// ---------------------------------------------------------------------
// 77. Resource and text expansion
// ---------------------------------------------------------------------

const expansionResources = {
  "en-US": {
    action: "Save",
  },
  "de-DE": {
    action: "Änderungen speichern",
  },
};

export const ResourceTextExpansion: FC = (): ReactElement => {
  return <button type="button">{expansionResources["de-DE"].action}</button>;
};

// Layouts should tolerate translations that occupy more or less space than the source text.

// ---------------------------------------------------------------------
// 78. Resource testing
// ---------------------------------------------------------------------

export const ResourceTesting: FC = (): ReactElement => {
  return (
    <ul>
      <li>Verify every supported locale has required keys.</li>

      <li>Verify interpolation placeholders are valid.</li>

      <li>Verify fallback behavior for missing resources.</li>

      <li>Verify plural categories for supported languages.</li>

      <li>Verify long translations do not break layout.</li>

      <li>Verify localized accessible names and descriptions.</li>
    </ul>
  );
};

// Translation-resource tests should verify both data completeness and rendered behavior.

// ---------------------------------------------------------------------
// 79. Resource source of truth
// ---------------------------------------------------------------------

const sourceOfTruthResources = {
  "en-US": {
    title: "Account settings",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
  },
} as const;

export const ResourceSourceOfTruth: FC = (): ReactElement => {
  return <h1>{sourceOfTruthResources["de-DE"].title}</h1>;
};

// Components should consume the resource rather than duplicating its translated values.

// ---------------------------------------------------------------------
// 80. Integrated translation-resource example
// ---------------------------------------------------------------------

type ExampleLocale = "en-US" | "de-DE";

type ExampleResource = {
  readonly navigation: {
    readonly home: string;
    readonly settings: string;
  };
  readonly account: {
    readonly title: string;
    readonly description: string;
    readonly save: string;
    readonly cancel: string;
    readonly greeting: string;
  };
  readonly validation: {
    readonly required: string;
  };
};

const exampleResources: Record<ExampleLocale, ExampleResource> = {
  "en-US": {
    navigation: {
      home: "Home",
      settings: "Settings",
    },
    account: {
      title: "Account settings",
      description: "Manage your account.",
      save: "Save changes",
      cancel: "Cancel",
      greeting: "Hello, {name}!",
    },
    validation: {
      required: "This field is required.",
    },
  },
  "de-DE": {
    navigation: {
      home: "Startseite",
      settings: "Einstellungen",
    },
    account: {
      title: "Kontoeinstellungen",
      description: "Verwalten Sie Ihr Konto.",
      save: "Änderungen speichern",
      cancel: "Abbrechen",
      greeting: "Hallo, {name}!",
    },
    validation: {
      required: "Dieses Feld ist erforderlich.",
    },
  },
};

type TranslationResourceExampleProps = {
  readonly locale: ExampleLocale;
  readonly userName: string;
};

export const TranslationResourceExample: FC<TranslationResourceExampleProps> = ({ locale, userName }): ReactElement => {
  const resource = exampleResources[locale];

  return (
    <main lang={locale.split("-")[0]}>
      <nav aria-label={resource.navigation.settings}>
        <a href="/">{resource.navigation.home}</a>

        <a href="/settings">{resource.navigation.settings}</a>
      </nav>

      <h1>{resource.account.title}</h1>

      <p>{resource.account.description}</p>

      <p>
        {interpolate(resource.account.greeting, {
          name: userName,
        })}
      </p>

      <div>
        <button type="button">{resource.account.save}</button>

        <button type="button">{resource.account.cancel}</button>
      </div>
    </main>
  );
};

export default TranslationResourceExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Translation resources are structured collections of localized messages selected by locale.
// - A resource normally maps stable message keys to user-facing localized values.
// - Locale-specific resources can be represented as a Record keyed by supported locale identifiers.
// - TypeScript can enforce resource completeness across supported locales.
// - satisfies can validate resource structure while preserving the resource's inferred type.
// - Semantic translation keys are more stable than using source-language text as keys.
// - Namespaces and feature-based organization help manage large translation-resource sets.
// - Resource lookup should be separate from business logic.
// - Domain values such as status codes, error codes, numbers, dates, and currencies should remain locale-neutral.
// - Translation resources provide language content while Intl APIs provide locale-sensitive formatting for structured data.
// - Complete messages should be stored when grammar or word order can differ between languages.
// - Interpolation allows runtime values to be inserted into localized messages.
// - Pluralized resources must account for the grammatical categories required by the target locale.
// - Accessible names, labels, descriptions, validation messages, status messages, and placeholders can all belong in translation resources.
// - Fallback behavior should be explicit and should distinguish missing resources from intentionally empty values.
// - Dynamically loaded resources should retain their locale identity and be validated at runtime when they originate outside the TypeScript program.
// - Resource loading can be organized by locale and feature.
// - Read-only resource structures help prevent rendering code from mutating translation configuration.
// - Resource organization should allow translations to preserve the grammar and meaning of each target language.
// - Localized content can expand or change writing direction, so UI layout and direction metadata must accommodate the selected resource.
// - Resource tests should verify completeness, interpolation, pluralization, fallback behavior, accessibility content, and layout-sensitive translations.
// - A clear separation between resources, locale selection, domain data, formatting, and rendering keeps localization architecture maintainable.

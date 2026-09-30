/**
 * Translations
 * ============
 *
 * A translation is localized content that communicates the same application
 * meaning in another language. Translation resources should contain user-facing
 * messages separately from application logic so that changing the active locale
 * changes presentation without changing the behavior of the application.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic translation
// ---------------------------------------------------------------------

export const BasicTranslation: FC = (): ReactElement => {
  const message = "Welcome";

  return <p>{message}</p>;
};

// A translation is user-facing language content.
// The application should not depend on the translated wording to perform logic.

// ---------------------------------------------------------------------
// 2. Translation resources
// ---------------------------------------------------------------------

const messages = {
  "en-US": {
    welcome: "Welcome",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

export const TranslationResources: FC = (): ReactElement => {
  const locale = "de-DE";

  return <p>{messages[locale].welcome}</p>;
};

// Translation resources map stable application keys to localized messages.

// ---------------------------------------------------------------------
// 3. Translation keys
// ---------------------------------------------------------------------

const translationKeys = {
  welcome: "Welcome",
  saveChanges: "Save changes",
  cancel: "Cancel",
};

export const TranslationKeys: FC = (): ReactElement => {
  return (
    <ul>
      <li>{translationKeys.welcome}</li>
      <li>{translationKeys.saveChanges}</li>
      <li>{translationKeys.cancel}</li>
    </ul>
  );
};

// Translation keys identify application messages.
// They should describe the meaning or purpose of a message rather than its current wording.

// ---------------------------------------------------------------------
// 4. Stable keys across locales
// ---------------------------------------------------------------------

const localizedMessages = {
  "en-US": {
    saveChanges: "Save changes",
  },
  "de-DE": {
    saveChanges: "Änderungen speichern",
  },
};

export const StableTranslationKey: FC = (): ReactElement => {
  const locale = "de-DE";

  return <button type="button">{localizedMessages[locale].saveChanges}</button>;
};

// The key remains saveChanges even though the translated value changes.

// ---------------------------------------------------------------------
// 5. Avoid English text as a key
// ---------------------------------------------------------------------

const poorTranslationResources = {
  "en-US": {
    "Save changes": "Save changes",
  },
  "de-DE": {
    "Save changes": "Änderungen speichern",
  },
};

export const AvoidTextAsKey: FC = (): ReactElement => {
  return <p>{poorTranslationResources["de-DE"]["Save changes"]}</p>;
};

// Using source text as a key couples resource identifiers to one language.
// Stable semantic keys make source-text changes independent from resource identifiers.

// ---------------------------------------------------------------------
// 6. Semantic translation keys
// ---------------------------------------------------------------------

const semanticMessages = {
  "en-US": {
    accountSettingsTitle: "Account settings",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
  },
};

export const SemanticTranslationKey: FC = (): ReactElement => {
  return <h1>{semanticMessages["en-US"].accountSettingsTitle}</h1>;
};

// A semantic key communicates the purpose of the message without encoding its wording.

// ---------------------------------------------------------------------
// 7. Locale-specific resources
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE";

type Messages = {
  readonly welcome: string;
  readonly save: string;
  readonly cancel: string;
};

const resources: Record<SupportedLocale, Messages> = {
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

export const TypedTranslationResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const message = resources[locale];

  return (
    <div>
      <p>{message.welcome}</p>
      <button type="button">{message.save}</button>
      <button type="button">{message.cancel}</button>
    </div>
  );
};

// TypeScript can ensure that every supported locale provides the expected message structure.

// ---------------------------------------------------------------------
// 8. Resource completeness
// ---------------------------------------------------------------------

type CompleteMessages = {
  readonly title: string;
  readonly description: string;
};

const completeResources = {
  "en-US": {
    title: "Profile",
    description: "Manage your profile.",
  },
  "de-DE": {
    title: "Profil",
    description: "Verwalten Sie Ihr Profil.",
  },
} satisfies Record<SupportedLocale, CompleteMessages>;

export const TranslationCompleteness: FC = (): ReactElement => {
  return (
    <section>
      <h1>{completeResources["de-DE"].title}</h1>
      <p>{completeResources["de-DE"].description}</p>
    </section>
  );
};

// satisfies checks that the resource structure conforms to the required type
// while preserving useful information about the resource itself.

// ---------------------------------------------------------------------
// 9. Selecting a translation
// ---------------------------------------------------------------------

export const SelectTranslation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const message = resources[locale].welcome;

  return <p>{message}</p>;
};

// Translation lookup normally follows the currently selected application locale.

// ---------------------------------------------------------------------
// 10. Translation lookup helper
// ---------------------------------------------------------------------

const getMessages = (locale: SupportedLocale): Messages => {
  return resources[locale];
};

export const TranslationLookupHelper: FC = (): ReactElement => {
  const message = getMessages("en-US");

  return <p>{message.welcome}</p>;
};

// A lookup helper can centralize resource selection and provide a typed boundary.

// ---------------------------------------------------------------------
// 11. Translation function
// ---------------------------------------------------------------------

const translate = (locale: SupportedLocale, key: keyof Messages): string => {
  return resources[locale][key];
};

export const TranslationFunction: FC = (): ReactElement => {
  return <p>{translate("de-DE", "welcome")}</p>;
};

// A translation function can provide a single API for retrieving localized messages.

// ---------------------------------------------------------------------
// 12. Translation function with a stable locale
// ---------------------------------------------------------------------

const createTranslator = (locale: SupportedLocale) => {
  return (key: keyof Messages): string => {
    return resources[locale][key];
  };
};

export const BoundTranslator: FC = (): ReactElement => {
  const t = createTranslator("de-DE");

  return <button type="button">{t("save")}</button>;
};

// Binding the locale once can simplify repeated lookups within a component or module.

// ---------------------------------------------------------------------
// 13. Translation is not formatting
// ---------------------------------------------------------------------

export const TranslationVsFormatting: FC = (): ReactElement => {
  const message = resources["en-US"].welcome;
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(1299.99);

  return (
    <p>
      {message}: {amount}
    </p>
  );
};

// Translation supplies language content.
// Intl APIs handle locale-sensitive formatting of dates, numbers, currencies, and similar values.

// ---------------------------------------------------------------------
// 14. Translation should not contain raw application data
// ---------------------------------------------------------------------

type User = {
  readonly name: string;
};

const user: User = {
  name: "John Doe",
};

export const TranslationWithApplicationData: FC = (): ReactElement => {
  return (
    <p>
      {resources["en-US"].welcome}, {user.name}.
    </p>
  );
};

// Application data should remain data.
// Translation resources should provide the surrounding localized message.

// ---------------------------------------------------------------------
// 15. Interpolated translations
// ---------------------------------------------------------------------

type GreetingMessages = {
  readonly greeting: string;
};

const greetingResources: Record<SupportedLocale, GreetingMessages> = {
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

export const InterpolatedTranslation: FC = (): ReactElement => {
  const locale: SupportedLocale = "en-US";
  const message = greetingResources[locale].greeting;

  return <p>{interpolate(message, { name: "John Doe" })}</p>;
};

// Interpolation inserts runtime values into a localized message without changing the translation key.

// ---------------------------------------------------------------------
// 16. Avoid concatenating translated fragments
// ---------------------------------------------------------------------

const fragmentMessages = {
  "en-US": {
    hello: "Hello",
    user: "John Doe",
  },
  "de-DE": {
    hello: "Hallo",
    user: "John Doe",
  },
};

export const AvoidTranslationFragments: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <p>
      {fragmentMessages[locale].hello} {fragmentMessages[locale].user}
    </p>
  );
};

// Concatenating translated fragments assumes that every language uses the same
// sentence structure, which is not generally true.

// ---------------------------------------------------------------------
// 17. Translate the complete message
// ---------------------------------------------------------------------

const completeGreetingMessages = {
  "en-US": {
    greeting: "Hello, {name}!",
  },
  "de-DE": {
    greeting: "Hallo, {name}!",
  },
};

export const CompleteTranslatedMessage: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{interpolate(completeGreetingMessages[locale].greeting, { name: "John Doe" })}</p>;
};

// Translators should be able to control the complete sentence structure.

// ---------------------------------------------------------------------
// 18. Rich content inside translations
// ---------------------------------------------------------------------

const richMessage = {
  prefix: "Read our",
  linkLabel: "privacy policy",
  suffix: "for more information.",
};

export const RichTranslationContent: FC = (): ReactElement => {
  return (
    <p>
      {richMessage.prefix} <a href="/privacy">{richMessage.linkLabel}</a> {richMessage.suffix}
    </p>
  );
};

// When a translation contains interactive content, the resource structure
// must allow the target language to control the surrounding sentence naturally.

// ---------------------------------------------------------------------
// 19. Translation with React nodes
// ---------------------------------------------------------------------

type RichMessageProps = {
  readonly link: ReactElement;
};

export const TranslationWithReactNodes: FC<RichMessageProps> = ({ link }): ReactElement => {
  return <p>Read our {link}.</p>;
};

// A React component can compose translated text with React elements,
// but translation systems should support the target language's sentence structure.

// ---------------------------------------------------------------------
// 20. Translating labels
// ---------------------------------------------------------------------

const labelMessages = {
  "en-US": {
    email: "Email address",
  },
  "de-DE": {
    email: "E-Mail-Adresse",
  },
};

export const TranslatedLabel: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <label htmlFor="email">{labelMessages[locale].email}</label>;
};

// Form labels are user-facing content and should be translated.

// ---------------------------------------------------------------------
// 21. Translating accessible names
// ---------------------------------------------------------------------

const accessibleMessages = {
  "en-US": {
    close: "Close",
  },
  "de-DE": {
    close: "Schließen",
  },
};

export const TranslatedAccessibleName: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <button type="button" aria-label={accessibleMessages[locale].close}>
      ×
    </button>
  );
};

// Accessible names are user-facing language and must be localized when the interface is localized.

// ---------------------------------------------------------------------
// 22. Translating validation messages
// ---------------------------------------------------------------------

const validationMessages = {
  "en-US": {
    required: "This field is required.",
  },
  "de-DE": {
    required: "Dieses Feld ist erforderlich.",
  },
};

export const TranslatedValidationMessage: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p role="alert">{validationMessages[locale].required}</p>;
};

// Validation messages are part of the user interface and should use the active locale.

// ---------------------------------------------------------------------
// 23. Translating status messages
// ---------------------------------------------------------------------

const statusMessages = {
  "en-US": {
    saved: "Changes saved.",
  },
  "de-DE": {
    saved: "Änderungen gespeichert.",
  },
};

export const TranslatedStatusMessage: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p role="status">{statusMessages[locale].saved}</p>;
};

// Status messages should be localized just like visible labels and headings.

// ---------------------------------------------------------------------
// 24. Translating placeholders
// ---------------------------------------------------------------------

const placeholderMessages = {
  "en-US": {
    search: "Search",
  },
  "de-DE": {
    search: "Suchen",
  },
};

export const TranslatedPlaceholder: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <input type="search" placeholder={placeholderMessages[locale].search} />;
};

// Placeholders are user-facing text and should be translated when they are used.

// ---------------------------------------------------------------------
// 25. Translating document titles
// ---------------------------------------------------------------------

const titleMessages = {
  "en-US": {
    profile: "Profile",
  },
  "de-DE": {
    profile: "Profil",
  },
};

export const TranslatedDocumentTitle: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <h1>{titleMessages[locale].profile}</h1>;
};

// Document titles are also user-facing content.
// A real application can synchronize the browser document title with the active translation.

// ---------------------------------------------------------------------
// 26. Translation and business logic
// ---------------------------------------------------------------------

const orderStatus = "pending" as const;

const orderStatusMessages = {
  "en-US": {
    pending: "Pending",
  },
  "de-DE": {
    pending: "Ausstehend",
  },
};

export const TranslationAndBusinessLogic: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{orderStatusMessages[locale][orderStatus]}</p>;
};

// Business logic should use stable values such as "pending".
// Translated text should only represent that value to the user.

// ---------------------------------------------------------------------
// 27. Never compare translated text for logic
// ---------------------------------------------------------------------

export const AvoidTranslatedLogic: FC = (): ReactElement => {
  const status = "pending";
  const isPending = status === "pending";

  return <p>{isPending ? "Pending" : "Complete"}</p>;
};

// Logic should compare stable identifiers rather than translated strings.

// ---------------------------------------------------------------------
// 28. Translation keys are not business identifiers
// ---------------------------------------------------------------------

type OrderStatus = "pending" | "complete";

const orderMessages: Record<SupportedLocale, Record<OrderStatus, string>> = {
  "en-US": {
    pending: "Pending",
    complete: "Complete",
  },
  "de-DE": {
    pending: "Ausstehend",
    complete: "Abgeschlossen",
  },
};

export const TranslationAndDomainValues: FC = (): ReactElement => {
  const status: OrderStatus = "complete";
  const locale: SupportedLocale = "de-DE";

  return <p>{orderMessages[locale][status]}</p>;
};

// Domain values and translated presentation values should remain separate.

// ---------------------------------------------------------------------
// 29. Translation fallbacks
// ---------------------------------------------------------------------

const fallbackResources: Record<SupportedLocale, Partial<Messages>> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

const getMessageWithFallback = (locale: SupportedLocale, key: keyof Messages): string => {
  return fallbackResources[locale][key] ?? fallbackResources["en-US"][key] ?? key;
};

export const TranslationFallback: FC = (): ReactElement => {
  return <p>{getMessageWithFallback("de-DE", "save")}</p>;
};

// A fallback policy can use another locale when the requested resource is incomplete.
// The fallback should be deliberate and consistent across the application.

// ---------------------------------------------------------------------
// 30. Missing translation fallback
// ---------------------------------------------------------------------

const getRequiredMessage = (locale: SupportedLocale, key: keyof Messages): string => {
  const message = fallbackResources[locale][key] ?? fallbackResources["en-US"][key];

  if (message === undefined) {
    throw new Error(`Missing translation: ${String(key)}`);
  }

  return message;
};

export const MissingTranslation: FC = (): ReactElement => {
  return <p>{getRequiredMessage("de-DE", "save")}</p>;
};

// Missing translations should be detectable rather than silently becoming empty UI.

// ---------------------------------------------------------------------
// 31. Translation fallback versus empty string
// ---------------------------------------------------------------------

const emptyStringResources = {
  "en-US": {
    title: "Profile",
  },
  "de-DE": {
    title: "",
  },
};

export const EmptyTranslationValue: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{emptyStringResources[locale].title || "Profile"}</p>;
};

// An empty string may be an intentional translation.
// Production fallback logic should distinguish missing resources from intentionally empty content.

// ---------------------------------------------------------------------
// 32. Translation resources can be split by feature
// ---------------------------------------------------------------------

const accountMessages = {
  title: "Account settings",
  save: "Save changes",
};

const navigationMessages = {
  home: "Home",
  profile: "Profile",
};

export const FeatureTranslationResources: FC = (): ReactElement => {
  return (
    <nav>
      <a href="/">{navigationMessages.home}</a>
      <a href="/profile">{navigationMessages.profile}</a>
    </nav>
  );
};

// Larger applications can organize resources by feature or namespace.

// ---------------------------------------------------------------------
// 33. Namespaces
// ---------------------------------------------------------------------

const namespacedMessages = {
  account: {
    title: "Account settings",
  },
  navigation: {
    home: "Home",
  },
};

export const TranslationNamespaces: FC = (): ReactElement => {
  return (
    <section>
      <h1>{namespacedMessages.account.title}</h1>
      <a href="/">{namespacedMessages.navigation.home}</a>
    </section>
  );
};

// Namespaces group related translation keys and can reduce collisions in large resource sets.

// ---------------------------------------------------------------------
// 34. Translation resource organization
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

const applicationMessages: Record<SupportedLocale, ApplicationMessages> = {
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

export const OrganizedTranslationResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <section>
      <nav>
        <a href="/">{applicationMessages[locale].navigation.home}</a>
      </nav>

      <h1>{applicationMessages[locale].account.title}</h1>

      <button type="button">{applicationMessages[locale].account.save}</button>
    </section>
  );
};

// A typed resource structure can keep feature relationships explicit.

// ---------------------------------------------------------------------
// 35. Translation key naming
// ---------------------------------------------------------------------

const descriptiveKeys = {
  accountSettingsTitle: "Account settings",
  saveAccountChanges: "Save changes",
  cancelAccountChanges: "Cancel",
};

export const DescriptiveTranslationKeys: FC = (): ReactElement => {
  return (
    <ul>
      <li>{descriptiveKeys.accountSettingsTitle}</li>
      <li>{descriptiveKeys.saveAccountChanges}</li>
      <li>{descriptiveKeys.cancelAccountChanges}</li>
    </ul>
  );
};

// Key naming should make the intended message role understandable to developers.

// ---------------------------------------------------------------------
// 36. Avoid overly generic keys
// ---------------------------------------------------------------------

const contextualKeys = {
  accountSaveButton: "Save",
  profileSaveButton: "Save",
};

export const ContextualTranslationKeys: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">{contextualKeys.accountSaveButton}</button>

      <button type="button">{contextualKeys.profileSaveButton}</button>
    </div>
  );
};

// Context can matter because identical source words may require different translations
// depending on their grammatical or UI context.

// ---------------------------------------------------------------------
// 37. Translation context
// ---------------------------------------------------------------------

const contextualMessages = {
  "en-US": {
    record: {
      noun: "Record",
      verb: "Record",
    },
  },
  "de-DE": {
    record: {
      noun: "Datensatz",
      verb: "Aufnehmen",
    },
  },
};

export const TranslationContext: FC = (): ReactElement => {
  return <p>{contextualMessages["de-DE"].record.noun}</p>;
};

// Translation resources may need explicit context when the same source concept
// can be translated differently depending on its grammatical or semantic role.

// ---------------------------------------------------------------------
// 38. Translation comments for translators
// ---------------------------------------------------------------------

type TranslatorResource = {
  readonly saveButton: {
    readonly value: string;
    readonly description: string;
  };
};

const translatorResource: TranslatorResource = {
  saveButton: {
    value: "Save",
    description: "Button that saves the current account changes.",
  },
};

export const TranslationDescription: FC = (): ReactElement => {
  return <button type="button">{translatorResource.saveButton.value}</button>;
};

// Translation tooling can associate developer context with a message.
// Context should explain meaning rather than prescribe a particular translation.

// ---------------------------------------------------------------------
// 39. Avoid embedding grammar in application logic
// ---------------------------------------------------------------------

export const AvoidGrammarLogic: FC = (): ReactElement => {
  const count = 3;

  return <p>{count} items</p>;
};

// Do not construct localized grammar by manually adding suffixes or fragments.
// Pluralization and grammatical rules should be delegated to a locale-aware message system.

// ---------------------------------------------------------------------
// 40. Pluralized translation concept
// ---------------------------------------------------------------------

const itemMessages = {
  "en-US": {
    one: "{count} item",
    other: "{count} items",
  },
  "de-DE": {
    one: "{count} Artikel",
    other: "{count} Artikel",
  },
};

export const PluralizedTranslation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const count = 3;

  const category = new Intl.PluralRules(locale).select(count);
  const message = category === "one" ? itemMessages[locale].one : itemMessages[locale].other;

  return (
    <p>
      {interpolate(message, {
        count: String(count),
      })}
    </p>
  );
};

// Pluralization rules differ between languages.
// A translation resource should provide the forms required by the target locale.

// ---------------------------------------------------------------------
// 41. Translation and number formatting
// ---------------------------------------------------------------------

export const TranslationWithNumberFormatting: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const count = 1234567;

  const message = "Total:";
  const formattedCount = new Intl.NumberFormat(locale).format(count);

  return (
    <p>
      {message} {formattedCount}
    </p>
  );
};

// The translated message and the formatted numeric value have separate responsibilities.

// ---------------------------------------------------------------------
// 42. Translation and date formatting
// ---------------------------------------------------------------------

export const TranslationWithDateFormatting: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const date = new Date("2026-09-29T12:00:00Z");

  const message = "Last updated:";
  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);

  return (
    <p>
      {message} {formattedDate}
    </p>
  );
};

// Dates should remain date values until the presentation layer formats them.

// ---------------------------------------------------------------------
// 43. Translation should not replace structured data
// ---------------------------------------------------------------------

type Product = {
  readonly name: string;
  readonly price: number;
};

const product: Product = {
  name: "Example product",
  price: 1299.99,
};

export const StructuredApplicationData: FC = (): ReactElement => {
  const locale: SupportedLocale = "en-US";

  return (
    <article>
      <h2>{product.name}</h2>
      <p>
        {new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
      </p>
    </article>
  );
};

// Store canonical values in application state and localize them only when presenting them.

// ---------------------------------------------------------------------
// 44. Translation and rich data
// ---------------------------------------------------------------------

const notificationMessages = {
  "en-US": {
    notification: "{name} sent you a message.",
  },
  "de-DE": {
    notification: "{name} hat Ihnen eine Nachricht gesendet.",
  },
};

export const TranslationWithRichData: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{interpolate(notificationMessages[locale].notification, { name: "John Doe" })}</p>;
};

// Runtime values should be inserted into a complete localized message.

// ---------------------------------------------------------------------
// 45. Translation resource loading
// ---------------------------------------------------------------------

export const TranslationResourceLoading: FC = (): ReactElement => {
  return (
    <section>
      <p>Translation resources may be loaded when a locale or feature is requested.</p>

      <p>The UI should define an explicit loading and failure state.</p>
    </section>
  );
};

// Large applications can avoid loading every locale resource into the initial bundle.

// ---------------------------------------------------------------------
// 46. Translation loading state
// ---------------------------------------------------------------------

const loadingMessages = {
  "en-US": {
    loading: "Loading translations...",
  },
  "de-DE": {
    loading: "Übersetzungen werden geladen...",
  },
};

export const TranslationLoadingState: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p role="status">{loadingMessages[locale].loading}</p>;
};

// Loading states should themselves be localized.

// ---------------------------------------------------------------------
// 47. Translation loading error
// ---------------------------------------------------------------------

const errorMessages = {
  "en-US": {
    translationLoadFailed: "Translations could not be loaded.",
  },
  "de-DE": {
    translationLoadFailed: "Übersetzungen konnten nicht geladen werden.",
  },
};

export const TranslationLoadingError: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p role="alert">{errorMessages[locale].translationLoadFailed}</p>;
};

// Resource-loading failures are user-facing states and require localized messaging.

// ---------------------------------------------------------------------
// 48. Translation completeness validation
// ---------------------------------------------------------------------

const requiredKeys = ["welcome", "save", "cancel"] as const;

const hasRequiredTranslations = (resource: Partial<Messages>): boolean => {
  return requiredKeys.every((key) => typeof resource[key] === "string");
};

export const TranslationResourceValidation: FC = (): ReactElement => {
  const complete = hasRequiredTranslations(resources["de-DE"]);

  return <p>{complete ? "Complete" : "Incomplete"}</p>;
};

// Resource validation can detect missing keys before incomplete translations reach users.

// ---------------------------------------------------------------------
// 49. Translation key extraction
// ---------------------------------------------------------------------

const usedKeys = ["welcome", "save", "cancel"] as const;

export const TranslationKeyCollection: FC = (): ReactElement => {
  return (
    <ul>
      {usedKeys.map((key) => (
        <li key={key}>{key}</li>
      ))}
    </ul>
  );
};

// Translation tooling can derive resource requirements from stable message keys.

// ---------------------------------------------------------------------
// 50. Translation resources should preserve meaning
// ---------------------------------------------------------------------

const meaningPreservingMessages = {
  "en-US": {
    deleteAccount: "Delete account",
  },
  "de-DE": {
    deleteAccount: "Konto löschen",
  },
};

export const MeaningPreservingTranslation: FC = (): ReactElement => {
  return <button type="button">{meaningPreservingMessages["de-DE"].deleteAccount}</button>;
};

// A translation should preserve the intended meaning and action of the source message.

// ---------------------------------------------------------------------
// 51. Translation is not word substitution
// ---------------------------------------------------------------------

export const TranslationIsNotWordSubstitution: FC = (): ReactElement => {
  return (
    <section>
      <p>A translation adapts meaning and grammar to the target language.</p>

      <p>It is not necessarily a word-for-word substitution.</p>
    </section>
  );
};

// Target languages can differ in word order, grammar, inflection, and sentence structure.

// ---------------------------------------------------------------------
// 52. Avoid hard-coded translated content in components
// ---------------------------------------------------------------------

export const AvoidHardCodedTranslation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <h1>{resources[locale].welcome}</h1>;
};

// Keeping translations in resources prevents localized content from being scattered across components.

// ---------------------------------------------------------------------
// 53. Keep components locale-neutral
// ---------------------------------------------------------------------

type WelcomeProps = {
  readonly message: string;
};

export const LocaleNeutralComponent: FC<WelcomeProps> = ({ message }): ReactElement => {
  return <h1>{message}</h1>;
};

// A reusable component can receive already localized content instead of knowing
// which language or translation resource produced it.

// ---------------------------------------------------------------------
// 54. Translation at the presentation boundary
// ---------------------------------------------------------------------

type GreetingProps = {
  readonly locale: SupportedLocale;
};

export const TranslationAtPresentationBoundary: FC<GreetingProps> = ({ locale }): ReactElement => {
  const message = resources[locale].welcome;

  return <h1>{message}</h1>;
};

// Translation can happen close to rendering while domain data remains locale-neutral.

// ---------------------------------------------------------------------
// 55. Translation and component composition
// ---------------------------------------------------------------------

type AccountHeaderProps = {
  readonly title: string;
  readonly description: string;
};

export const AccountHeader: FC<AccountHeaderProps> = ({ title, description }): ReactElement => {
  return (
    <header>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
};

export const LocalizedAccountHeader: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <AccountHeader title={applicationMessages[locale].account.title} description="Verwalten Sie Ihr Konto." />;
};

// Translation can be resolved before passing content into a reusable presentational component.

// ---------------------------------------------------------------------
// 56. Translation and links
// ---------------------------------------------------------------------

const linkMessages = {
  "en-US": {
    help: "Help",
  },
  "de-DE": {
    help: "Hilfe",
  },
};

export const TranslatedLink: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <a href="/help">{linkMessages[locale].help}</a>;
};

// Link destinations are application data while link labels are translated content.

// ---------------------------------------------------------------------
// 57. Translation and navigation
// ---------------------------------------------------------------------

const navigationLabels = {
  "en-US": {
    home: "Home",
    settings: "Settings",
  },
  "de-DE": {
    home: "Startseite",
    settings: "Einstellungen",
  },
};

export const TranslatedNavigation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <nav aria-label="Main navigation">
      <a href="/">{navigationLabels[locale].home}</a>
      <a href="/settings">{navigationLabels[locale].settings}</a>
    </nav>
  );
};

// Navigation labels are localized content.
// The accessible name of the navigation landmark should also be localized in a complete implementation.

// ---------------------------------------------------------------------
// 58. Translating landmark names
// ---------------------------------------------------------------------

const landmarkMessages = {
  "en-US": {
    mainNavigation: "Main navigation",
  },
  "de-DE": {
    mainNavigation: "Hauptnavigation",
  },
};

export const TranslatedLandmarkName: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <nav aria-label={landmarkMessages[locale].mainNavigation}>
      <a href="/">{navigationLabels[locale].home}</a>
    </nav>
  );
};

// Accessible landmark names are part of the localized interface.

// ---------------------------------------------------------------------
// 59. Translation and empty states
// ---------------------------------------------------------------------

const emptyStateMessages = {
  "en-US": {
    noResults: "No results found.",
  },
  "de-DE": {
    noResults: "Keine Ergebnisse gefunden.",
  },
};

export const TranslatedEmptyState: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{emptyStateMessages[locale].noResults}</p>;
};

// Empty, loading, success, and error states all contain user-facing content that may require translation.

// ---------------------------------------------------------------------
// 60. Translation and button actions
// ---------------------------------------------------------------------

const actionMessages = {
  "en-US": {
    submit: "Submit",
    reset: "Reset",
  },
  "de-DE": {
    submit: "Absenden",
    reset: "Zurücksetzen",
  },
};

export const TranslatedActions: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <div>
      <button type="submit">{actionMessages[locale].submit}</button>

      <button type="reset">{actionMessages[locale].reset}</button>
    </div>
  );
};

// Button labels should describe the action in the selected language.

// ---------------------------------------------------------------------
// 61. Translation and confirmation messages
// ---------------------------------------------------------------------

const confirmationMessages = {
  "en-US": {
    deleted: "The item was deleted.",
  },
  "de-DE": {
    deleted: "Das Element wurde gelöscht.",
  },
};

export const TranslatedConfirmation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p role="status">{confirmationMessages[locale].deleted}</p>;
};

// Confirmation messages are localized status content.

// ---------------------------------------------------------------------
// 62. Translation and error messages
// ---------------------------------------------------------------------

const genericErrorMessages = {
  "en-US": {
    unexpected: "Something went wrong.",
  },
  "de-DE": {
    unexpected: "Etwas ist schiefgelaufen.",
  },
};

export const TranslatedError: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p role="alert">{genericErrorMessages[locale].unexpected}</p>;
};

// User-facing errors should be localized without exposing unnecessary implementation details.

// ---------------------------------------------------------------------
// 63. Translation and technical errors
// ---------------------------------------------------------------------

type ErrorCode = "NETWORK_ERROR" | "UNAUTHORIZED";

const errorCodeMessages: Record<SupportedLocale, Record<ErrorCode, string>> = {
  "en-US": {
    NETWORK_ERROR: "The network request failed.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
  },
  "de-DE": {
    NETWORK_ERROR: "Die Netzwerkanfrage ist fehlgeschlagen.",
    UNAUTHORIZED: "Sie sind nicht berechtigt, diese Aktion auszuführen.",
  },
};

export const TechnicalErrorTranslation: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const errorCode: ErrorCode = "NETWORK_ERROR";

  return <p role="alert">{errorCodeMessages[locale][errorCode]}</p>;
};

// Stable error codes can drive application behavior while translated messages
// provide the user-facing representation.

// ---------------------------------------------------------------------
// 64. Translation resource versioning
// ---------------------------------------------------------------------

type ResourceMetadata = {
  readonly locale: SupportedLocale;
  readonly version: number;
};

const resourceMetadata: ResourceMetadata = {
  locale: "de-DE",
  version: 1,
};

export const TranslationResourceMetadata: FC = (): ReactElement => {
  return (
    <p>
      {resourceMetadata.locale} / v{resourceMetadata.version}
    </p>
  );
};

// Resource metadata can help applications manage independently loaded translation resources.

// ---------------------------------------------------------------------
// 65. Translation resource identity
// ---------------------------------------------------------------------

export const TranslationResourceIdentity: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>Resource identity: {locale}</p>;
};

// The locale is a stable identity for selecting the corresponding translation resource.

// ---------------------------------------------------------------------
// 66. Translation and locale fallback chain
// ---------------------------------------------------------------------

const localeFallbacks: Record<SupportedLocale, readonly SupportedLocale[]> = {
  "en-US": ["en-US"],
  "de-DE": ["de-DE", "en-US"],
};

export const TranslationFallbackChain: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <p>{localeFallbacks[locale].join(" → ")}</p>;
};

// A fallback chain can explicitly describe which resources should be attempted in order.

// ---------------------------------------------------------------------
// 67. Translation and language-level fallback
// ---------------------------------------------------------------------

const languageFallbacks = {
  "de-AT": ["de-AT", "de", "en-US"],
  "en-GB": ["en-GB", "en", "en-US"],
};

export const LanguageLevelFallback: FC = (): ReactElement => {
  return <p>{languageFallbacks["de-AT"].join(" → ")}</p>;
};

// A locale negotiation strategy can fall back from a regional locale to a language
// and then to an application default, when those resources exist.

// ---------------------------------------------------------------------
// 68. Translation resource boundaries
// ---------------------------------------------------------------------

export const TranslationResourceBoundary: FC = (): ReactElement => {
  return (
    <section>
      <p>Locale selection determines which resource is requested.</p>

      <p>Resource lookup determines which message is returned.</p>

      <p>Rendering determines where that message appears.</p>
    </section>
  );
};

// Separating these responsibilities keeps localization architecture easier to test and maintain.

// ---------------------------------------------------------------------
// 69. Translation testing
// ---------------------------------------------------------------------

export const TranslationTesting: FC = (): ReactElement => {
  return (
    <ul>
      <li>Test every supported locale.</li>

      <li>Test required translation keys.</li>

      <li>Test missing-resource behavior.</li>

      <li>Test interpolation values.</li>

      <li>Test plural and grammatical variants.</li>

      <li>Test long translations and layout behavior.</li>
    </ul>
  );
};

// Translation testing should verify both resource correctness and rendered behavior.

// ---------------------------------------------------------------------
// 70. Translation length
// ---------------------------------------------------------------------

const longTranslation = {
  "en-US": "Save changes",
  "de-DE": "Änderungen speichern",
};

export const TranslationLength: FC = (): ReactElement => {
  return <button type="button">{longTranslation["de-DE"]}</button>;
};

// Translated text can be shorter or longer than the source.
// Layouts should not assume that every translation has the same length.

// ---------------------------------------------------------------------
// 71. Translation and truncation
// ---------------------------------------------------------------------

export const TranslationTruncation: FC = (): ReactElement => {
  return <p className="localized-text">Localized content should remain readable when the target language expands.</p>;
};

// Avoid fixed-width assumptions that cause localized content to be clipped or hidden.

// ---------------------------------------------------------------------
// 72. Translation and text direction
// ---------------------------------------------------------------------

const directionMessages = {
  "en-US": {
    title: "Account settings",
  },
  "ar-EG": {
    title: "إعدادات الحساب",
  },
};

export const TranslationTextDirection: FC = (): ReactElement => {
  const locale = "ar-EG";

  return (
    <main lang="ar" dir="rtl">
      <h1>{directionMessages[locale].title}</h1>
    </main>
  );
};

// Translation can change the writing direction required by the rendered content.

// ---------------------------------------------------------------------
// 73. Translation and HTML language metadata
// ---------------------------------------------------------------------

const languageMessages = {
  "en-US": {
    title: "Account settings",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
  },
};

export const TranslationLanguageMetadata: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <section lang={locale.split("-")[0]}>
      <h1>{languageMessages[locale].title}</h1>
    </section>
  );
};

// The rendered language should be communicated through appropriate HTML language metadata.

// ---------------------------------------------------------------------
// 74. Translation and machine-readable values
// ---------------------------------------------------------------------

const statusValues = {
  pending: "pending",
  complete: "complete",
} as const;

export const MachineReadableStatus: FC = (): ReactElement => {
  const status = statusValues.pending;

  return <span data-status={status}>{orderMessages["en-US"][status]}</span>;
};

// Machine-readable attributes and application state should use stable values,
// while visible text can be translated.

// ---------------------------------------------------------------------
// 75. Translation and URLs
// ---------------------------------------------------------------------

const localizedRoutes = {
  "en-US": "/account",
  "de-DE": "/konto",
};

export const LocalizedUrlConcept: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <a href={localizedRoutes[locale]}>{languageMessages[locale].title}</a>;
};

// Applications may localize URL paths, but route design and translation resources
// remain separate concerns.

// ---------------------------------------------------------------------
// 76. Translation and accessibility descriptions
// ---------------------------------------------------------------------

const descriptionMessages = {
  "en-US": {
    accountDescription: "Manage your account information.",
  },
  "de-DE": {
    accountDescription: "Verwalten Sie Ihre Kontoinformationen.",
  },
};

export const TranslatedDescription: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <section aria-describedby="account-description">
      <p id="account-description">{descriptionMessages[locale].accountDescription}</p>
    </section>
  );
};

// Descriptions associated with accessible elements are also localized user-facing content.

// ---------------------------------------------------------------------
// 77. Translation and date-relative wording
// ---------------------------------------------------------------------

const relativeMessages = {
  "en-US": {
    updated: "Updated",
  },
  "de-DE": {
    updated: "Aktualisiert",
  },
};

export const TranslationWithRelativeTime: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const relativeTime = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(-1, "day");

  return (
    <p>
      {relativeMessages[locale].updated}: {relativeTime}
    </p>
  );
};

// Translation supplies the surrounding message while Intl supplies locale-aware relative-time wording.

// ---------------------------------------------------------------------
// 78. Translation resource immutability
// ---------------------------------------------------------------------

const immutableResources = {
  "en-US": {
    welcome: "Welcome",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
} as const;

export const ImmutableTranslationResources: FC = (): ReactElement => {
  return <p>{immutableResources["de-DE"].welcome}</p>;
};

// Translation resources are commonly treated as configuration data and should not
// be mutated by rendering code.

// ---------------------------------------------------------------------
// 79. Translation and React rendering
// ---------------------------------------------------------------------

type LocalizedMessageProps = {
  readonly locale: SupportedLocale;
  readonly messageKey: keyof Messages;
};

export const LocalizedMessage: FC<LocalizedMessageProps> = ({ locale, messageKey }): ReactElement => {
  return <span>{resources[locale][messageKey]}</span>;
};

// A reusable localized-message component can receive the locale and stable message key as props.

// ---------------------------------------------------------------------
// 80. Integrated translation example
// ---------------------------------------------------------------------

type ExampleLocale = "en-US" | "de-DE";

type ExampleMessages = {
  readonly title: string;
  readonly description: string;
  readonly save: string;
  readonly cancel: string;
  readonly greeting: string;
};

const exampleResources: Record<ExampleLocale, ExampleMessages> = {
  "en-US": {
    title: "Account settings",
    description: "Manage your account.",
    save: "Save changes",
    cancel: "Cancel",
    greeting: "Hello, {name}!",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    description: "Verwalten Sie Ihr Konto.",
    save: "Änderungen speichern",
    cancel: "Abbrechen",
    greeting: "Hallo, {name}!",
  },
};

type TranslationExampleProps = {
  readonly locale: ExampleLocale;
  readonly userName: string;
};

export const TranslationExample: FC<TranslationExampleProps> = ({ locale, userName }): ReactElement => {
  const messages = exampleResources[locale];

  return (
    <main lang={locale.split("-")[0]}>
      <h1>{messages.title}</h1>

      <p>{messages.description}</p>

      <p>
        {interpolate(messages.greeting, {
          name: userName,
        })}
      </p>

      <div>
        <button type="button">{messages.save}</button>

        <button type="button">{messages.cancel}</button>
      </div>
    </main>
  );
};

export default TranslationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A translation is localized content that communicates application meaning in another language.
// - Translation resources should be separated from application logic.
// - Stable translation keys identify messages independently from their current wording.
// - Semantic keys are generally more maintainable than using source text as resource keys.
// - TypeScript can enforce consistent translation-resource structures across supported locales.
// - A translation function can provide a typed boundary for message lookup.
// - Interpolation inserts runtime values into complete localized messages.
// - Complete messages allow each language to control its own sentence structure.
// - Translated fragments should not be concatenated when the target language may require different grammar or word order.
// - Accessible names, labels, validation messages, status messages, placeholders, navigation labels, and descriptions are user-facing content and may require translation.
// - Domain values, error codes, numeric values, dates, currencies, and other structured data should remain separate from translated presentation text.
// - Translated strings should never be used as business-logic identifiers.
// - Pluralization and grammatical differences should be handled by locale-aware message mechanisms rather than manual string concatenation.
// - Intl APIs handle locale-sensitive formatting, while translation resources provide language content.
// - Translation resources can be organized by locale, feature, or namespace.
// - Fallback behavior should be explicit and consistent.
// - Missing translations should be detectable rather than silently producing incomplete UI.
// - Translation resources may be loaded independently when applications support many locales or features.
// - Translation testing should cover supported locales, required keys, interpolation, pluralization, fallback behavior, and layout changes.
// - Localized content can expand or change writing direction, so components should not assume fixed text length or direction.
// - HTML language and direction metadata should correspond to the language and writing direction of rendered content.
// - Reusable React components can remain locale-neutral by receiving already localized content or stable locale/message inputs.
// - Translation belongs at the presentation boundary while application state should remain locale-neutral.

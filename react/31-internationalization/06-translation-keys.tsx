/**
 * Translation Keys
 * ================
 *
 * Translation keys are stable identifiers used to retrieve localized messages from
 * translation resources. A well-designed key describes the meaning or purpose of a
 * message rather than storing source-language text as the identifier.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic translation key
// ---------------------------------------------------------------------

const messages = {
  save: "Save",
  cancel: "Cancel",
  welcome: "Welcome",
};

export const BasicTranslationKey: FC = (): ReactElement => {
  return (
    <section>
      <p>{messages.welcome}</p>
      <button type="button">{messages.save}</button>
      <button type="button">{messages.cancel}</button>
    </section>
  );
};

// The key identifies which message should be retrieved.

// ---------------------------------------------------------------------
// 2. Locale-specific translation keys
// ---------------------------------------------------------------------

const resources = {
  "en-US": {
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const LocaleTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <button type="button">{resources[locale].save}</button>

      <button type="button">{resources[locale].cancel}</button>
    </div>
  );
};

// The same key can identify the same concept across different locales.

// ---------------------------------------------------------------------
// 3. Stable keys across translations
// ---------------------------------------------------------------------

const stableResources = {
  "en-US": {
    accountSettingsTitle: "Account settings",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
  },
};

export const StableTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <h1>{stableResources[locale].accountSettingsTitle}</h1>;
};

// The key stays the same while only the localized value changes.

// ---------------------------------------------------------------------
// 4. Avoid source-language keys
// ---------------------------------------------------------------------

const sourceLanguageKeys = {
  "en-US": {
    "Save changes": "Save changes",
  },
  "de-DE": {
    "Save changes": "Änderungen speichern",
  },
};

export const SourceLanguageKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <button type="button">{sourceLanguageKeys[locale]["Save changes"]}</button>;
};

// Using source-language text as a key couples the identifier to one language.

// ---------------------------------------------------------------------
// 5. Semantic keys
// ---------------------------------------------------------------------

const semanticKeys = {
  "en-US": {
    saveAccountChanges: "Save changes",
  },
  "de-DE": {
    saveAccountChanges: "Änderungen speichern",
  },
};

export const SemanticTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <button type="button">{semanticKeys[locale].saveAccountChanges}</button>;
};

// A semantic key describes the purpose of the message rather than its wording.

// ---------------------------------------------------------------------
// 6. Keys should describe meaning
// ---------------------------------------------------------------------

const meaningBasedKeys = {
  "en-US": {
    accountSettingsTitle: "Account settings",
    accountSettingsDescription: "Manage your account.",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
    accountSettingsDescription: "Verwalten Sie Ihr Konto.",
  },
};

export const MeaningBasedKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <h1>{meaningBasedKeys[locale].accountSettingsTitle}</h1>

      <p>{meaningBasedKeys[locale].accountSettingsDescription}</p>
    </section>
  );
};

// Meaning-based keys remain useful even when the wording of a translation changes.

// ---------------------------------------------------------------------
// 7. Keys should describe usage context
// ---------------------------------------------------------------------

const contextualKeys = {
  "en-US": {
    profileSaveButton: "Save",
    profileSaveStatus: "Profile saved.",
  },
  "de-DE": {
    profileSaveButton: "Speichern",
    profileSaveStatus: "Profil gespeichert.",
  },
};

export const ContextualTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <button type="button">{contextualKeys[locale].profileSaveButton}</button>

      <p role="status">{contextualKeys[locale].profileSaveStatus}</p>
    </section>
  );
};

// Context can distinguish messages that have different purposes even when their
// source-language wording is similar.

// ---------------------------------------------------------------------
// 8. Avoid overly generic keys
// ---------------------------------------------------------------------

const genericKeys = {
  "en-US": {
    save: "Save",
  },
  "de-DE": {
    save: "Speichern",
  },
};

export const GenericTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <button type="button">{genericKeys[locale].save}</button>;
};

// A short key can be appropriate when its meaning is unambiguous within a namespace.

// ---------------------------------------------------------------------
// 9. Namespaced keys
// ---------------------------------------------------------------------

const namespacedResources = {
  "en-US": {
    account: {
      save: "Save",
    },
    profile: {
      save: "Save",
    },
  },
  "de-DE": {
    account: {
      save: "Speichern",
    },
    profile: {
      save: "Speichern",
    },
  },
};

export const NamespacedTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <button type="button">{namespacedResources[locale].account.save}</button>

      <button type="button">{namespacedResources[locale].profile.save}</button>
    </section>
  );
};

// Namespaces prevent unrelated messages from sharing ambiguous keys.

// ---------------------------------------------------------------------
// 10. Flat namespaced keys
// ---------------------------------------------------------------------

const flatNamespacedResources = {
  "en-US": {
    account_save: "Save",
    profile_save: "Save",
  },
  "de-DE": {
    account_save: "Speichern",
    profile_save: "Speichern",
  },
};

export const FlatNamespacedKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <button type="button">{flatNamespacedResources[locale].account_save}</button>

      <button type="button">{flatNamespacedResources[locale].profile_save}</button>
    </div>
  );
};

// A flat naming convention can encode the same namespace relationship in one key.

// ---------------------------------------------------------------------
// 11. Keys for navigation
// ---------------------------------------------------------------------

const navigationKeys = {
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

export const NavigationTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <nav>
      <a href="/">{navigationKeys[locale].home}</a>

      <a href="/settings">{navigationKeys[locale].settings}</a>

      <a href="/profile">{navigationKeys[locale].profile}</a>
    </nav>
  );
};

// Navigation messages should have keys that describe their navigation purpose.

// ---------------------------------------------------------------------
// 12. Keys for accessible names
// ---------------------------------------------------------------------

const accessibilityKeys = {
  "en-US": {
    closeDialog: "Close dialog",
    mainNavigation: "Main navigation",
  },
  "de-DE": {
    closeDialog: "Dialog schließen",
    mainNavigation: "Hauptnavigation",
  },
};

export const AccessibilityTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <nav aria-label={accessibilityKeys[locale].mainNavigation}>
      <button type="button" aria-label={accessibilityKeys[locale].closeDialog}>
        ×
      </button>
    </nav>
  );
};

// Accessible names are user-facing text and therefore need translation keys.

// ---------------------------------------------------------------------
// 13. Keys for form labels
// ---------------------------------------------------------------------

const formKeys = {
  "en-US": {
    emailLabel: "Email address",
    passwordLabel: "Password",
  },
  "de-DE": {
    emailLabel: "E-Mail-Adresse",
    passwordLabel: "Passwort",
  },
};

export const FormTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <form>
      <label htmlFor="email">{formKeys[locale].emailLabel}</label>

      <input id="email" type="email" />

      <label htmlFor="password">{formKeys[locale].passwordLabel}</label>

      <input id="password" type="password" />
    </form>
  );
};

// Form labels should use stable keys rather than hard-coded source-language text.

// ---------------------------------------------------------------------
// 14. Keys for validation messages
// ---------------------------------------------------------------------

const validationKeys = {
  "en-US": {
    requiredField: "This field is required.",
    invalidEmail: "Enter a valid email address.",
  },
  "de-DE": {
    requiredField: "Dieses Feld ist erforderlich.",
    invalidEmail: "Geben Sie eine gültige E-Mail-Adresse ein.",
  },
};

export const ValidationTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <ul>
      <li>{validationKeys[locale].requiredField}</li>
      <li>{validationKeys[locale].invalidEmail}</li>
    </ul>
  );
};

// Validation messages are localized through the same key-based resource model.

// ---------------------------------------------------------------------
// 15. Keys for status messages
// ---------------------------------------------------------------------

const statusKeys = {
  "en-US": {
    loadingData: "Loading data...",
    dataSaved: "Changes saved.",
  },
  "de-DE": {
    loadingData: "Daten werden geladen...",
    dataSaved: "Änderungen gespeichert.",
  },
};

export const StatusTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <p role="status">{statusKeys[locale].loadingData}</p>

      <p role="status">{statusKeys[locale].dataSaved}</p>
    </div>
  );
};

// Status messages need stable keys because the surrounding application logic
// should not depend on the localized wording.

// ---------------------------------------------------------------------
// 16. Keys for error messages
// ---------------------------------------------------------------------

type ErrorCode = "NETWORK_ERROR" | "UNAUTHORIZED";

const errorMessages = {
  "en-US": {
    NETWORK_ERROR: "The network request failed.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
  },
  "de-DE": {
    NETWORK_ERROR: "Die Netzwerkanfrage ist fehlgeschlagen.",
    UNAUTHORIZED: "Sie sind nicht berechtigt, diese Aktion auszuführen.",
  },
};

export const ErrorTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";
  const errorCode: ErrorCode = "NETWORK_ERROR";

  return <p role="alert">{errorMessages[locale][errorCode]}</p>;
};

// Stable error codes can be used by application logic while translation keys
// provide the corresponding user-facing message.

// ---------------------------------------------------------------------
// 17. Domain values and translation keys
// ---------------------------------------------------------------------

type OrderStatus = "pending" | "complete";

const orderStatusMessages = {
  "en-US": {
    pending: "Pending",
    complete: "Complete",
  },
  "de-DE": {
    pending: "Ausstehend",
    complete: "Abgeschlossen",
  },
};

export const DomainValueTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";
  const status: OrderStatus = "pending";

  return <p>{orderStatusMessages[locale][status]}</p>;
};

// Domain values remain stable while their display text is localized.

// ---------------------------------------------------------------------
// 18. Keys should not encode translated wording
// ---------------------------------------------------------------------

const wordingIndependentKeys = {
  "en-US": {
    accountSettingsTitle: "Account settings",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
  },
};

export const WordingIndependentKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <h1>{wordingIndependentKeys[locale].accountSettingsTitle}</h1>;
};

// A key should survive a source-language copy edit without requiring a key migration.

// ---------------------------------------------------------------------
// 19. Keys should not contain dynamic values
// ---------------------------------------------------------------------

const userResources = {
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

export const DynamicValueTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <p>
      {interpolate(userResources[locale].greeting, {
        name: "John Doe",
      })}
    </p>
  );
};

// Dynamic values belong in message parameters rather than being embedded in the key.

// ---------------------------------------------------------------------
// 20. Keys for complete messages
// ---------------------------------------------------------------------

const messageKeys = {
  "en-US": {
    welcomeUser: "Welcome, {name}!",
  },
  "de-DE": {
    welcomeUser: "Willkommen, {name}!",
  },
};

export const CompleteMessageKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <p>
      {interpolate(messageKeys[locale].welcomeUser, {
        name: "John Doe",
      })}
    </p>
  );
};

// A complete message gives each language control over word order and grammar.

// ---------------------------------------------------------------------
// 21. Avoid concatenating translated fragments
// ---------------------------------------------------------------------

const fragmentedKeys = {
  "en-US": {
    greeting: "Hello",
    suffix: "!",
  },
  "de-DE": {
    greeting: "Hallo",
    suffix: "!",
  },
};

export const FragmentedTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <p>
      {fragmentedKeys[locale].greeting} John Doe
      {fragmentedKeys[locale].suffix}
    </p>
  );
};

// Sentence fragments can prevent translators from changing word order naturally.

// ---------------------------------------------------------------------
// 22. Context-specific keys
// ---------------------------------------------------------------------

const contextSpecificKeys = {
  "en-US": {
    deleteAccountButton: "Delete account",
    deleteAccountConfirmation: "Delete your account?",
  },
  "de-DE": {
    deleteAccountButton: "Konto löschen",
    deleteAccountConfirmation: "Konto löschen?",
  },
};

export const ContextSpecificKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <button type="button">{contextSpecificKeys[locale].deleteAccountButton}</button>

      <p>{contextSpecificKeys[locale].deleteAccountConfirmation}</p>
    </section>
  );
};

// Different UI contexts can require separate keys even when the messages are related.

// ---------------------------------------------------------------------
// 23. Avoid ambiguous shared keys
// ---------------------------------------------------------------------

const ambiguousKeys = {
  "en-US": {
    title: "Title",
  },
  "de-DE": {
    title: "Titel",
  },
};

export const AmbiguousSharedKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <h1>{ambiguousKeys[locale].title}</h1>;
};

// A generic key such as "title" can become ambiguous as an application grows.

// ---------------------------------------------------------------------
// 24. Feature-specific keys
// ---------------------------------------------------------------------

const featureKeys = {
  "en-US": {
    account: {
      settingsTitle: "Account settings",
    },
    billing: {
      settingsTitle: "Billing settings",
    },
  },
  "de-DE": {
    account: {
      settingsTitle: "Kontoeinstellungen",
    },
    billing: {
      settingsTitle: "Abrechnungseinstellungen",
    },
  },
};

export const FeatureSpecificKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <h1>{featureKeys[locale].account.settingsTitle}</h1>

      <h2>{featureKeys[locale].billing.settingsTitle}</h2>
    </section>
  );
};

// Feature namespaces allow the same local key to have different meanings safely.

// ---------------------------------------------------------------------
// 25. Keys for placeholders
// ---------------------------------------------------------------------

const placeholderKeys = {
  "en-US": {
    searchPlaceholder: "Search",
  },
  "de-DE": {
    searchPlaceholder: "Suchen",
  },
};

export const PlaceholderTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <input type="search" placeholder={placeholderKeys[locale].searchPlaceholder} />;
};

// Placeholder text is user-facing content and should not be hard-coded in the component.

// ---------------------------------------------------------------------
// 26. Keys for empty states
// ---------------------------------------------------------------------

const emptyStateKeys = {
  "en-US": {
    noSearchResults: "No results found.",
  },
  "de-DE": {
    noSearchResults: "Keine Ergebnisse gefunden.",
  },
};

export const EmptyStateTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <p>{emptyStateKeys[locale].noSearchResults}</p>;
};

// Empty-state messages are ordinary translation-key values.

// ---------------------------------------------------------------------
// 27. Keys for document titles
// ---------------------------------------------------------------------

const documentTitleKeys = {
  "en-US": {
    profilePageTitle: "Profile",
  },
  "de-DE": {
    profilePageTitle: "Profil",
  },
};

export const DocumentTitleTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <h1>{documentTitleKeys[locale].profilePageTitle}</h1>;
};

// Page titles and other document metadata can also be driven by translation keys.

// ---------------------------------------------------------------------
// 28. Keys for descriptions
// ---------------------------------------------------------------------

const descriptionKeys = {
  "en-US": {
    accountSettingsDescription: "Manage your account settings.",
  },
  "de-DE": {
    accountSettingsDescription: "Verwalten Sie Ihre Kontoeinstellungen.",
  },
};

export const DescriptionTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <p>{descriptionKeys[locale].accountSettingsDescription}</p>;
};

// Descriptions should have keys that communicate their relationship to the UI element.

// ---------------------------------------------------------------------
// 29. Keys for reusable actions
// ---------------------------------------------------------------------

const actionKeys = {
  "en-US": {
    save: "Save",
    cancel: "Cancel",
    close: "Close",
  },
  "de-DE": {
    save: "Speichern",
    cancel: "Abbrechen",
    close: "Schließen",
  },
};

export const ReusableActionKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <button type="button">{actionKeys[locale].save}</button>

      <button type="button">{actionKeys[locale].cancel}</button>
    </div>
  );
};

// Truly generic actions can be shared when their meaning and usage are consistent.

// ---------------------------------------------------------------------
// 30. When not to reuse a key
// ---------------------------------------------------------------------

const separateContextKeys = {
  "en-US": {
    closeDialog: "Close",
    closeMenu: "Close",
  },
  "de-DE": {
    closeDialog: "Schließen",
    closeMenu: "Schließen",
  },
};

export const SeparateContextKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <button type="button">{separateContextKeys[locale].closeDialog}</button>

      <button type="button">{separateContextKeys[locale].closeMenu}</button>
    </div>
  );
};

// Separate keys can preserve context even when two messages currently translate identically.

// ---------------------------------------------------------------------
// 31. Translation key type
// ---------------------------------------------------------------------

type Messages = {
  readonly welcome: string;
  readonly save: string;
  readonly cancel: string;
};

type MessageKey = keyof Messages;

const typedMessages: Messages = {
  welcome: "Welcome",
  save: "Save",
  cancel: "Cancel",
};

export const TranslationKeyType: FC = (): ReactElement => {
  const key: MessageKey = "save";

  return <p>{typedMessages[key]}</p>;
};

// keyof can derive a union of valid translation keys from a TypeScript type.

// ---------------------------------------------------------------------
// 32. Typed locale resources
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE";

const typedResources: Record<SupportedLocale, Messages> = {
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

export const TypedLocaleResources: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const key: keyof Messages = "save";

  return <p>{typedResources[locale][key]}</p>;
};

// Combining locale and key types provides compile-time constraints for resource lookup.

// ---------------------------------------------------------------------
// 33. Typed translation function
// ---------------------------------------------------------------------

const translate = (locale: SupportedLocale, key: keyof Messages): string => {
  return typedResources[locale][key];
};

export const TypedTranslationFunction: FC = (): ReactElement => {
  return <button type="button">{translate("de-DE", "save")}</button>;
};

// A typed translation function restricts callers to supported locales and message keys.

// ---------------------------------------------------------------------
// 34. Bound translation function
// ---------------------------------------------------------------------

const createTranslator = (locale: SupportedLocale) => {
  return (key: keyof Messages): string => {
    return typedResources[locale][key];
  };
};

export const BoundTranslationFunction: FC = (): ReactElement => {
  const t = createTranslator("de-DE");

  return (
    <section>
      <p>{t("welcome")}</p>
      <button type="button">{t("save")}</button>
    </section>
  );
};

// Binding the locale allows components to request messages without repeatedly passing the locale.

// ---------------------------------------------------------------------
// 35. Deriving keys from a resource
// ---------------------------------------------------------------------

const derivedResource = {
  welcome: "Welcome",
  save: "Save",
  cancel: "Cancel",
} as const;

type DerivedKey = keyof typeof derivedResource;

export const DerivedTranslationKeys: FC = (): ReactElement => {
  const key: DerivedKey = "welcome";

  return <p>{derivedResource[key]}</p>;
};

// TypeScript can derive key unions directly from an existing resource object.

// ---------------------------------------------------------------------
// 36. Validating resource keys with satisfies
// ---------------------------------------------------------------------

type RequiredMessages = {
  readonly welcome: string;
  readonly save: string;
  readonly cancel: string;
};

const validatedResources = {
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
} satisfies Record<SupportedLocale, RequiredMessages>;

export const ValidatedTranslationKeys: FC = (): ReactElement => {
  return <p>{validatedResources["de-DE"].welcome}</p>;
};

// satisfies checks that every locale has the required key structure.

// ---------------------------------------------------------------------
// 37. Missing translation keys
// ---------------------------------------------------------------------

const fallbackMessages = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
  },
  "de-DE": {
    welcome: "Willkommen",
  },
};

export const MissingTranslationKey: FC = (): ReactElement => {
  const locale = "de-DE";

  const save = fallbackMessages[locale].save ?? fallbackMessages["en-US"].save ?? "Save";

  return <button type="button">{save}</button>;
};

// Missing keys require an explicit fallback policy rather than silently producing undefined.

// ---------------------------------------------------------------------
// 38. Key fallback versus locale fallback
// ---------------------------------------------------------------------

const localeFallbackResources = {
  "en-US": {
    save: "Save",
  },
  "de-DE": {
    save: "Speichern",
  },
};

export const LocaleFallbackTranslationKey: FC = (): ReactElement => {
  const requestedLocale: SupportedLocale = "de-DE";
  const fallbackLocale: SupportedLocale = "en-US";

  const message = localeFallbackResources[requestedLocale].save ?? localeFallbackResources[fallbackLocale].save;

  return <button type="button">{message}</button>;
};

// Locale fallback selects another resource for the same key;
// key fallback handles a missing key within the selected resource.

// ---------------------------------------------------------------------
// 39. Key naming consistency
// ---------------------------------------------------------------------

const consistentlyNamedKeys = {
  accountSettingsTitle: "Account settings",
  accountSettingsDescription: "Manage your account.",
  accountSettingsSave: "Save changes",
};

export const ConsistentKeyNaming: FC = (): ReactElement => {
  return (
    <section>
      <h1>{consistentlyNamedKeys.accountSettingsTitle}</h1>

      <p>{consistentlyNamedKeys.accountSettingsDescription}</p>

      <button type="button">{consistentlyNamedKeys.accountSettingsSave}</button>
    </section>
  );
};

// Consistent naming makes related keys easier to discover and maintain.

// ---------------------------------------------------------------------
// 40. Key naming should avoid implementation details
// ---------------------------------------------------------------------

const implementationIndependentKeys = {
  accountSettingsTitle: "Account settings",
  accountSettingsDescription: "Manage your account.",
};

export const ImplementationIndependentKeys: FC = (): ReactElement => {
  return (
    <section>
      <h1>{implementationIndependentKeys.accountSettingsTitle}</h1>

      <p>{implementationIndependentKeys.accountSettingsDescription}</p>
    </section>
  );
};

// Keys should describe application meaning rather than details such as CSS classes or component names.

// ---------------------------------------------------------------------
// 41. Avoid component-name keys
// ---------------------------------------------------------------------

const componentIndependentKeys = {
  accountSettingsTitle: "Account settings",
};

export const ComponentIndependentKeys: FC = (): ReactElement => {
  return <h1>{componentIndependentKeys.accountSettingsTitle}</h1>;
};

// A key tied to a component name becomes fragile when the UI is reorganized.

// ---------------------------------------------------------------------
// 42. Keys and resource organization
// ---------------------------------------------------------------------

const organizedResources = {
  "en-US": {
    account: {
      title: "Account settings",
      description: "Manage your account.",
    },
    navigation: {
      home: "Home",
    },
  },
  "de-DE": {
    account: {
      title: "Kontoeinstellungen",
      description: "Verwalten Sie Ihr Konto.",
    },
    navigation: {
      home: "Startseite",
    },
  },
};

export const OrganizedTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <h1>{organizedResources[locale].account.title}</h1>

      <a href="/">{organizedResources[locale].navigation.home}</a>
    </section>
  );
};

// Key organization should reflect meaningful application boundaries.

// ---------------------------------------------------------------------
// 43. Keys for pluralized messages
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

export const PluralTranslationKeys: FC = (): ReactElement => {
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

// Plural message keys represent grammatical categories rather than hard-coded numeric conditions.

// ---------------------------------------------------------------------
// 44. Keys should not encode counts
// ---------------------------------------------------------------------

const countIndependentResources = {
  "en-US": {
    itemCount: "{count} items",
  },
  "de-DE": {
    itemCount: "{count} Artikel",
  },
};

export const CountIndependentKeys: FC = (): ReactElement => {
  const locale = "de-DE";
  const count = 5;

  return <p>{interpolate(countIndependentResources[locale].itemCount, { count: String(count) })}</p>;
};

// Dynamic counts belong in message values rather than creating a separate key for each number.

// ---------------------------------------------------------------------
// 45. Keys for dates and structured values
// ---------------------------------------------------------------------

const dateKeys = {
  "en-US": {
    lastUpdated: "Last updated:",
  },
  "de-DE": {
    lastUpdated: "Zuletzt aktualisiert:",
  },
};

export const DateTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";
  const date = new Date("2026-09-29T12:00:00Z");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);

  return (
    <p>
      {dateKeys[locale].lastUpdated} {formattedDate}
    </p>
  );
};

// The key provides translated text while Intl formats the structured date value.

// ---------------------------------------------------------------------
// 46. Keys for formatted currency
// ---------------------------------------------------------------------

const currencyKeys = {
  "en-US": {
    price: "Price:",
  },
  "de-DE": {
    price: "Preis:",
  },
};

export const CurrencyTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";
  const amount = 1299.99;

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return (
    <p>
      {currencyKeys[locale].price} {formattedAmount}
    </p>
  );
};

// Structured currency data should not be embedded into translation keys.

// ---------------------------------------------------------------------
// 47. Keys for relative time
// ---------------------------------------------------------------------

const relativeTimeKeys = {
  "en-US": {
    updated: "Updated",
  },
  "de-DE": {
    updated: "Aktualisiert",
  },
};

export const RelativeTimeTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  const relativeTime = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(-1, "day");

  return (
    <p>
      {relativeTimeKeys[locale].updated}: {relativeTime}
    </p>
  );
};

// Relative time should be generated from structured data with locale-sensitive formatting.

// ---------------------------------------------------------------------
// 48. Keys for lists
// ---------------------------------------------------------------------

const memberKeys = {
  "en-US": {
    members: ["John Doe", "Jane Doe", "Alex Doe"],
  },
  "de-DE": {
    members: ["John Doe", "Jane Doe", "Alex Doe"],
  },
};

export const ListTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  const members = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(memberKeys[locale].members);

  return <p>{members}</p>;
};

// Locale-sensitive list grammar belongs to Intl rather than translation-key construction.

// ---------------------------------------------------------------------
// 49. Keys for writing direction
// ---------------------------------------------------------------------

const directionKeys = {
  "en-US": {
    title: "Account settings",
  },
  "ar-EG": {
    title: "إعدادات الحساب",
  },
};

export const DirectionTranslationKeys: FC = (): ReactElement => {
  const locale = "ar-EG";

  return (
    <main lang="ar" dir="rtl">
      <h1>{directionKeys[locale].title}</h1>
    </main>
  );
};

// A translation key selects the localized content; direction metadata is handled separately.

// ---------------------------------------------------------------------
// 50. Keys and business logic
// ---------------------------------------------------------------------

type AccountAction = "save" | "cancel";

const actionMessages = {
  "en-US": {
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

export const TranslationKeysAndBusinessLogic: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const action: AccountAction = "save";

  return <button type="button">{actionMessages[locale][action]}</button>;
};

// Business logic should operate on stable identifiers rather than localized strings.

// ---------------------------------------------------------------------
// 51. Do not branch on translated text
// ---------------------------------------------------------------------

const translatedActions = {
  "en-US": {
    save: "Save",
  },
  "de-DE": {
    save: "Speichern",
  },
};

export const AvoidTranslatedTextLogic: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const action: AccountAction = "save";

  const label = translatedActions[locale][action];

  return <button type="button">{label}</button>;
};

// Application logic should branch on action identifiers, not on values such as "Save" or "Speichern".

// ---------------------------------------------------------------------
// 52. Key lookup helper
// ---------------------------------------------------------------------

const getMessage = (locale: SupportedLocale, key: keyof Messages): string => {
  return typedResources[locale][key];
};

export const TranslationKeyLookup: FC = (): ReactElement => {
  return <p>{getMessage("de-DE", "welcome")}</p>;
};

// A helper can centralize translation-resource access.

// ---------------------------------------------------------------------
// 53. Key lookup with interpolation
// ---------------------------------------------------------------------

const greetingMessages = {
  "en-US": {
    greeting: "Hello, {name}!",
  },
  "de-DE": {
    greeting: "Hallo, {name}!",
  },
};

const translateGreeting = (locale: SupportedLocale, name: string): string => {
  return interpolate(greetingMessages[locale].greeting, { name });
};

export const TranslationKeyInterpolation: FC = (): ReactElement => {
  return <p>{translateGreeting("de-DE", "John Doe")}</p>;
};

// Interpolation values are supplied separately from the stable translation key.

// ---------------------------------------------------------------------
// 54. Keys for confirmation messages
// ---------------------------------------------------------------------

const confirmationKeys = {
  "en-US": {
    deleteAccountConfirmation: "Delete your account?",
    deleteAccountAction: "Delete account",
  },
  "de-DE": {
    deleteAccountConfirmation: "Konto löschen?",
    deleteAccountAction: "Konto löschen",
  },
};

export const ConfirmationTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <p>{confirmationKeys[locale].deleteAccountConfirmation}</p>

      <button type="button">{confirmationKeys[locale].deleteAccountAction}</button>
    </section>
  );
};

// Related messages can still use distinct keys when their roles differ.

// ---------------------------------------------------------------------
// 55. Keys for accessibility descriptions
// ---------------------------------------------------------------------

const descriptionResourceKeys = {
  "en-US": {
    passwordRequirements: "Use at least eight characters.",
  },
  "de-DE": {
    passwordRequirements: "Verwenden Sie mindestens acht Zeichen.",
  },
};

export const AccessibilityDescriptionKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return <p id="password-requirements">{descriptionResourceKeys[locale].passwordRequirements}</p>;
};

// Help text and accessible descriptions are user-facing content and should have stable keys.

// ---------------------------------------------------------------------
// 56. Key migration
// ---------------------------------------------------------------------

const migratedKeys = {
  "en-US": {
    accountSettingsTitle: "Account settings",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
  },
};

export const StableKeyDuringCopyEdit: FC = (): ReactElement => {
  return <h1>{migratedKeys["en-US"].accountSettingsTitle}</h1>;
};

// A source-language copy edit can change the value without changing the stable key.

// ---------------------------------------------------------------------
// 57. Key reuse and meaning
// ---------------------------------------------------------------------

const reusableKeys = {
  "en-US": {
    cancel: "Cancel",
  },
  "de-DE": {
    cancel: "Abbrechen",
  },
};

export const MeaningfulKeyReuse: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <button type="button">{reusableKeys[locale].cancel}</button>

      <button type="button">{reusableKeys[locale].cancel}</button>
    </div>
  );
};

// A key can be reused when the message has the same meaning and translation context.

// ---------------------------------------------------------------------
// 58. Key duplication and context
// ---------------------------------------------------------------------

const contextAwareResources = {
  "en-US": {
    dialogCancel: "Cancel",
    formCancel: "Cancel",
  },
  "de-DE": {
    dialogCancel: "Abbrechen",
    formCancel: "Abbrechen",
  },
};

export const ContextAwareKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <button type="button">{contextAwareResources[locale].dialogCancel}</button>

      <button type="button">{contextAwareResources[locale].formCancel}</button>
    </div>
  );
};

// Separate keys preserve the option to translate or change contexts independently later.

// ---------------------------------------------------------------------
// 59. Key structure should remain manageable
// ---------------------------------------------------------------------

const manageableKeys = {
  "en-US": {
    account: {
      title: "Account settings",
    },
    navigation: {
      settings: "Settings",
    },
  },
  "de-DE": {
    account: {
      title: "Kontoeinstellungen",
    },
    navigation: {
      settings: "Einstellungen",
    },
  },
};

export const ManageableKeyStructure: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <h1>{manageableKeys[locale].account.title}</h1>

      <a href="/settings">{manageableKeys[locale].navigation.settings}</a>
    </section>
  );
};

// Key hierarchies should reflect meaningful domains without becoming unnecessarily deep.

// ---------------------------------------------------------------------
// 60. Key naming conventions
// ---------------------------------------------------------------------

const namingConventionKeys = {
  accountSettingsTitle: "Account settings",
  accountSettingsSaveButton: "Save changes",
  accountSettingsCancelButton: "Cancel",
};

export const KeyNamingConventions: FC = (): ReactElement => {
  return (
    <section>
      <h1>{namingConventionKeys.accountSettingsTitle}</h1>

      <button type="button">{namingConventionKeys.accountSettingsSaveButton}</button>

      <button type="button">{namingConventionKeys.accountSettingsCancelButton}</button>
    </section>
  );
};

// A consistent convention makes keys predictable for developers and tooling.

// ---------------------------------------------------------------------
// 61. Key names and UI role
// ---------------------------------------------------------------------

const roleAwareKeys = {
  "en-US": {
    profileTitle: "Profile",
    profileDescription: "Manage your profile.",
    profileSaveButton: "Save profile",
  },
  "de-DE": {
    profileTitle: "Profil",
    profileDescription: "Verwalten Sie Ihr Profil.",
    profileSaveButton: "Profil speichern",
  },
};

export const RoleAwareTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <section>
      <h1>{roleAwareKeys[locale].profileTitle}</h1>

      <p>{roleAwareKeys[locale].profileDescription}</p>

      <button type="button">{roleAwareKeys[locale].profileSaveButton}</button>
    </section>
  );
};

// Keys can encode enough context to distinguish titles, descriptions, and actions.

// ---------------------------------------------------------------------
// 62. Key naming and refactoring
// ---------------------------------------------------------------------

const refactorFriendlyKeys = {
  accountSettingsTitle: "Account settings",
};

export const RefactorFriendlyKeys: FC = (): ReactElement => {
  return <h1>{refactorFriendlyKeys.accountSettingsTitle}</h1>;
};

// Keys based on application meaning can survive component and layout refactoring.

// ---------------------------------------------------------------------
// 63. Key naming and resource validation
// ---------------------------------------------------------------------

type KeyedMessages = {
  readonly accountSettingsTitle: string;
  readonly accountSettingsDescription: string;
};

const keyedResources = {
  "en-US": {
    accountSettingsTitle: "Account settings",
    accountSettingsDescription: "Manage your account.",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
    accountSettingsDescription: "Verwalten Sie Ihr Konto.",
  },
} satisfies Record<SupportedLocale, KeyedMessages>;

export const ValidatedKeyStructure: FC = (): ReactElement => {
  return <p>{keyedResources["de-DE"].accountSettingsDescription}</p>;
};

// A shared key type can validate that every locale implements the same required key structure.

// ---------------------------------------------------------------------
// 64. Key extraction from resources
// ---------------------------------------------------------------------

const resourceForKeyExtraction = {
  accountSettingsTitle: "Account settings",
  accountSettingsDescription: "Manage your account.",
};

type ExtractedKeys = keyof typeof resourceForKeyExtraction;

export const ExtractedKeysExample: FC = (): ReactElement => {
  const key: ExtractedKeys = "accountSettingsTitle";

  return <p>{resourceForKeyExtraction[key]}</p>;
};

// Key unions can be derived automatically instead of manually duplicating every key.

// ---------------------------------------------------------------------
// 65. Key-based component props
// ---------------------------------------------------------------------

type TranslationKey = keyof Messages;

type TranslationProps = {
  readonly messageKey: TranslationKey;
};

export const TranslationByKey: FC<TranslationProps> = ({ messageKey }): ReactElement => {
  return <p>{typedMessages[messageKey]}</p>;
};

// Components can receive stable translation keys instead of receiving hard-coded localized strings.

// ---------------------------------------------------------------------
// 66. Locale-aware key-based component
// ---------------------------------------------------------------------

type LocalizedMessageProps = {
  readonly locale: SupportedLocale;
  readonly messageKey: keyof Messages;
};

export const LocaleAwareTranslation: FC<LocalizedMessageProps> = ({ locale, messageKey }): ReactElement => {
  return <p>{typedResources[locale][messageKey]}</p>;
};

// The component can remain independent of the actual language-specific wording.

// ---------------------------------------------------------------------
// 67. Keys and translation-resource loading
// ---------------------------------------------------------------------

const resourcePaths = {
  "en-US": "/locales/en-US.json",
  "de-DE": "/locales/de-DE.json",
} satisfies Record<SupportedLocale, string>;

export const KeyedResourceLoading: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <code>{resourcePaths[locale]}</code>;
};

// Stable locale identifiers can determine which resource file or payload should be loaded.

// ---------------------------------------------------------------------
// 68. Keys and missing-resource handling
// ---------------------------------------------------------------------

const loadedResources: Partial<Record<SupportedLocale, Messages>> = {
  "en-US": {
    welcome: "Welcome",
    save: "Save",
    cancel: "Cancel",
  },
};

export const MissingResourceHandling: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const resource = loadedResources[locale] ?? loadedResources["en-US"];

  return <p>{resource?.welcome ?? "Welcome"}</p>;
};

// Resource selection and key lookup should define what happens when the requested locale is unavailable.

// ---------------------------------------------------------------------
// 69. Keys and runtime data
// ---------------------------------------------------------------------

const runtimeResource: unknown = {
  accountSettingsTitle: "Account settings",
};

const isObjectWithTitle = (value: unknown): value is { accountSettingsTitle: string } => {
  return (
    typeof value === "object" &&
    value !== null &&
    "accountSettingsTitle" in value &&
    typeof value.accountSettingsTitle === "string"
  );
};

export const RuntimeKeyValidation: FC = (): ReactElement => {
  return <p>{isObjectWithTitle(runtimeResource) ? runtimeResource.accountSettingsTitle : "Invalid resource"}</p>;
};

// TypeScript types do not validate untrusted runtime translation data.

// ---------------------------------------------------------------------
// 70. Keys and resource completeness
// ---------------------------------------------------------------------

type CompleteKeyedResource = {
  readonly welcome: string;
  readonly save: string;
  readonly cancel: string;
};

const completeKeyedResources: Record<SupportedLocale, CompleteKeyedResource> = {
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

export const CompleteKeyedResources: FC = (): ReactElement => {
  return (
    <section>
      <p>{completeKeyedResources["de-DE"].welcome}</p>

      <button type="button">{completeKeyedResources["de-DE"].save}</button>
    </section>
  );
};

// Requiring all keys across all supported locales reduces accidental missing translations.

// ---------------------------------------------------------------------
// 71. Keys and plural categories
// ---------------------------------------------------------------------

const pluralCategories = {
  "en-US": {
    one: "{count} item",
    other: "{count} items",
  },
  "de-DE": {
    one: "{count} Artikel",
    other: "{count} Artikel",
  },
};

export const PluralCategoryKeys: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";
  const count = 1;
  const category = new Intl.PluralRules(locale).select(count);

  return <p>{interpolate(pluralCategories[locale][category === "one" ? "one" : "other"], { count: String(count) })}</p>;
};

// Plural categories are locale-sensitive and should not be reduced to a universal singular/plural assumption.

// ---------------------------------------------------------------------
// 72. Keys and message metadata
// ---------------------------------------------------------------------

type MessageDefinition = {
  readonly value: string;
  readonly description: string;
};

const messageDefinitions = {
  saveAccountChanges: {
    value: "Save changes",
    description: "Button that saves the current account changes.",
  },
} satisfies Record<string, MessageDefinition>;

export const MessageKeyMetadata: FC = (): ReactElement => {
  return <button type="button">{messageDefinitions.saveAccountChanges.value}</button>;
};

// Message metadata can give translators context while the key remains a stable identifier.

// ---------------------------------------------------------------------
// 73. Keys and descriptions for translators
// ---------------------------------------------------------------------

const translatorContext = {
  saveAccountChanges: {
    value: "Save changes",
    description: "Action that submits the account settings form.",
  },
};

export const TranslatorContext: FC = (): ReactElement => {
  return <button type="button">{translatorContext.saveAccountChanges.value}</button>;
};

// Translator context should explain meaning and usage rather than prescribe an exact translation.

// ---------------------------------------------------------------------
// 74. Keys for complete UI states
// ---------------------------------------------------------------------

const uiStateKeys = {
  "en-US": {
    loading: "Loading...",
    empty: "No results found.",
    error: "Something went wrong.",
    success: "Changes saved.",
  },
  "de-DE": {
    loading: "Wird geladen...",
    empty: "Keine Ergebnisse gefunden.",
    error: "Etwas ist schiefgelaufen.",
    success: "Änderungen gespeichert.",
  },
};

export const UIStateTranslationKeys: FC = (): ReactElement => {
  const locale = "de-DE";

  return (
    <div>
      <p role="status">{uiStateKeys[locale].loading}</p>

      <p>{uiStateKeys[locale].empty}</p>
    </div>
  );
};

// UI states should have stable identifiers so state management does not depend on translated text.

// ---------------------------------------------------------------------
// 75. Keys and testability
// ---------------------------------------------------------------------

const testableResources = {
  "en-US": {
    accountSettingsTitle: "Account settings",
  },
  "de-DE": {
    accountSettingsTitle: "Kontoeinstellungen",
  },
};

export const TestableTranslationKeys: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <h1>{testableResources[locale].accountSettingsTitle}</h1>;
};

// Stable keys make resource completeness and locale-specific rendering easier to test.

// ---------------------------------------------------------------------
// 76. Keys should remain locale-neutral
// ---------------------------------------------------------------------

const localeNeutralKeys = {
  "en-US": {
    accountSettings: "Account settings",
  },
  "de-DE": {
    accountSettings: "Kontoeinstellungen",
  },
};

export const LocaleNeutralKeys: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return <h1>{localeNeutralKeys[locale].accountSettings}</h1>;
};

// The key identifies the message independently of the language selected at runtime.

// ---------------------------------------------------------------------
// 77. Key aliases should be intentional
// ---------------------------------------------------------------------

const aliasResources = {
  "en-US": {
    save: "Save",
    submit: "Save",
  },
  "de-DE": {
    save: "Speichern",
    submit: "Speichern",
  },
};

export const IntentionalKeyAliases: FC = (): ReactElement => {
  const locale: SupportedLocale = "de-DE";

  return (
    <div>
      <button type="button">{aliasResources[locale].save}</button>

      <button type="submit">{aliasResources[locale].submit}</button>
    </div>
  );
};

// Two keys can currently share a translation while remaining independent when their contexts differ.

// ---------------------------------------------------------------------
// 78. Keys and localization boundaries
// ---------------------------------------------------------------------

type LocalizedLabelProps = {
  readonly locale: SupportedLocale;
};

const localizedLabels = {
  "en-US": {
    profile: "Profile",
  },
  "de-DE": {
    profile: "Profil",
  },
};

export const LocalizationBoundary: FC<LocalizedLabelProps> = ({ locale }): ReactElement => {
  return <span>{localizedLabels[locale].profile}</span>;
};

// A localized component boundary can receive a locale and resolve its own stable message key.

// ---------------------------------------------------------------------
// 79. Integrated translation-key example
// ---------------------------------------------------------------------

type ExampleLocale = "en-US" | "de-DE";

type ExampleMessages = {
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

const exampleResources: Record<ExampleLocale, ExampleMessages> = {
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

type TranslationKeyExampleProps = {
  readonly locale: ExampleLocale;
  readonly userName: string;
};

export const TranslationKeyExample: FC<TranslationKeyExampleProps> = ({ locale, userName }): ReactElement => {
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

      <button type="button">{resource.account.save}</button>

      <button type="button">{resource.account.cancel}</button>
    </main>
  );
};

export default TranslationKeyExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Translation keys are stable identifiers used to retrieve localized messages.
// - Keys should describe meaning, purpose, or context rather than source-language wording.
// - The same key normally maps to different localized values for different locales.
// - Source-language strings should generally not be used as translation keys.
// - Namespaces help prevent collisions and preserve context.
// - Generic keys are appropriate only when their meaning is unambiguous and reusable.
// - Context-specific keys allow messages with different purposes to evolve independently.
// - Translation keys should not contain dynamic values such as names or counts.
// - Dynamic values belong in interpolation parameters or structured application data.
// - Complete messages allow each language to control grammar and word order.
// - Business logic should use stable domain values rather than localized strings.
// - Error codes and domain statuses can map to localized messages without becoming translation keys themselves.
// - TypeScript keyof, Record, and satisfies can provide compile-time guarantees around translation-key structures.
// - Missing keys and missing locales require explicit fallback behavior.
// - Plural message keys should reflect locale-specific grammatical categories.
// - Dates, numbers, currencies, relative time, lists, and similar structured values should be formatted separately from translation-key selection.
// - Accessible names, form labels, descriptions, validation messages, status messages, and placeholders are user-facing content that can use translation keys.
// - Consistent key naming makes resources easier to discover, validate, refactor, and test.
// - Keys should remain independent of component names, CSS classes, and other implementation details.
// - A well-designed key identifies the message independently of the locale and UI implementation.

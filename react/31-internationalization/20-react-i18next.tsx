/**
 * React i18next
 * =============
 *
 * react-i18next integrates i18next with React by providing translations through React context
 * and exposing hooks and components for localized content. It separates translation resources,
 * locale management, interpolation, pluralization, and React rendering from application components.
 */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type ReactElement,
  type ReactNode,
} from "react";
import i18next, { type i18n, type TFunction } from "i18next";
import { I18nextProvider, Trans, initReactI18next, useTranslation } from "react-i18next";

// ---------------------------------------------------------------------
// 1. Supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en" | "de" | "fr" | "ar";

const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en", "de", "fr", "ar"];

const DEFAULT_LOCALE: SupportedLocale = "en";

console.log(SUPPORTED_LOCALES); // ["en", "de", "fr", "ar"]

// ---------------------------------------------------------------------
// 2. Translation resources
// ---------------------------------------------------------------------

const resources = {
  en: {
    translation: {
      app: {
        title: "Example Application",
        welcome: "Welcome, {{name}}.",
        description: "This is an example localized application.",
      },
      navigation: {
        home: "Home",
        products: "Products",
        settings: "Settings",
      },
      actions: {
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",
      },
      cart: {
        item_one: "{{count}} item",
        item_other: "{{count}} items",
      },
      account: {
        greeting: "Hello, {{name}}!",
      },
    },
  },
  de: {
    translation: {
      app: {
        title: "Beispielanwendung",
        welcome: "Willkommen, {{name}}.",
        description: "Dies ist eine lokalisierte Beispielanwendung.",
      },
      navigation: {
        home: "Startseite",
        products: "Produkte",
        settings: "Einstellungen",
      },
      actions: {
        save: "Speichern",
        cancel: "Abbrechen",
        submit: "Absenden",
      },
      cart: {
        item_one: "{{count}} Artikel",
        item_other: "{{count}} Artikel",
      },
      account: {
        greeting: "Hallo, {{name}}!",
      },
    },
  },
  fr: {
    translation: {
      app: {
        title: "Application exemple",
        welcome: "Bienvenue, {{name}}.",
        description: "Ceci est une application exemple localisée.",
      },
      navigation: {
        home: "Accueil",
        products: "Produits",
        settings: "Paramètres",
      },
      actions: {
        save: "Enregistrer",
        cancel: "Annuler",
        submit: "Envoyer",
      },
      cart: {
        item_one: "{{count}} article",
        item_other: "{{count}} articles",
      },
      account: {
        greeting: "Bonjour, {{name}} !",
      },
    },
  },
  ar: {
    translation: {
      app: {
        title: "تطبيق نموذجي",
        welcome: "مرحبًا، {{name}}.",
        description: "هذا تطبيق نموذجي متعدد اللغات.",
      },
      navigation: {
        home: "الرئيسية",
        products: "المنتجات",
        settings: "الإعدادات",
      },
      actions: {
        save: "حفظ",
        cancel: "إلغاء",
        submit: "إرسال",
      },
      cart: {
        item_zero: "لا توجد عناصر",
        item_one: "عنصر واحد",
        item_two: "عنصران",
        item_few: "{{count}} عناصر",
        item_many: "{{count}} عنصرًا",
        item_other: "{{count}} عنصر",
      },
      account: {
        greeting: "مرحبًا، {{name}}!",
      },
    },
  },
} as const;

// Translation resources contain localized content.
// Application code should reference translation keys rather than hard-code translated strings.

// ---------------------------------------------------------------------
// 3. Initializing i18next
// ---------------------------------------------------------------------

const i18n: i18n = i18next.createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
});

// `initReactI18next` connects the i18next instance to React.
// React components can then consume the same instance through I18nextProvider.

// ---------------------------------------------------------------------
// 4. React provider
// ---------------------------------------------------------------------

interface TranslationProviderProps {
  readonly children: ReactNode;
}

export const TranslationProvider: FC<TranslationProviderProps> = ({ children }): ReactElement => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

// The provider makes the configured i18next instance available to descendant React components.

// ---------------------------------------------------------------------
// 5. Basic useTranslation usage
// ---------------------------------------------------------------------

export const BasicTranslation: FC = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <section>
      <h2>{t("app.title")}</h2>
      <p>{t("app.description")}</p>
    </section>
  );
};

// `useTranslation` returns the translation function and i18next-related state for the component.

// ---------------------------------------------------------------------
// 6. Translation keys
// ---------------------------------------------------------------------

export const TranslationKeyExample: FC = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("navigation.home")}>
      <a href="/">{t("navigation.home")}</a>
      <a href="/products">{t("navigation.products")}</a>
      <a href="/settings">{t("navigation.settings")}</a>
    </nav>
  );
};

// Dot-separated keys provide a stable lookup path into nested translation resources.

// ---------------------------------------------------------------------
// 7. Interpolation
// ---------------------------------------------------------------------

interface WelcomeProps {
  readonly name: string;
}

export const WelcomeMessage: FC<WelcomeProps> = ({ name }): ReactElement => {
  const { t } = useTranslation();

  return <p>{t("app.welcome", { name })}</p>;
};

console.log(i18n.t("app.welcome", { name: "Example" }));
// "Welcome, Example."

// Interpolation inserts runtime values into translated messages.
// The surrounding sentence remains locale-specific.

// ---------------------------------------------------------------------
// 8. Interpolation should not build translated sentences manually
// ---------------------------------------------------------------------

export const ManualSentenceConstruction: FC<WelcomeProps> = ({ name }): ReactElement => {
  const { t } = useTranslation();

  return <p>{t("account.greeting", { name })}</p>;
};

// The translation resource controls word order, punctuation, and surrounding text.
// Do not assemble localized sentences from individually translated fragments.

// ---------------------------------------------------------------------
// 9. Escaping interpolated values
// ---------------------------------------------------------------------

const interpolationExample = i18n.t("app.welcome", {
  name: "<Example>",
});

console.log(interpolationExample);

// i18next interpolation escapes values by default.
// This example intentionally configures `escapeValue: false` because React already
// escapes values rendered as text nodes. Raw HTML must not be introduced through interpolation.

// ---------------------------------------------------------------------
// 10. React escaping versus HTML interpolation
// ---------------------------------------------------------------------

export const SafeTextInterpolation: FC = (): ReactElement => {
  const { t } = useTranslation();

  return <p>{t("app.welcome", { name: "<Example>" })}</p>;
};

// React renders the translated result as text.
// It does not interpret the interpolated value as HTML.

// ---------------------------------------------------------------------
// 11. useTranslation namespace parameter
// ---------------------------------------------------------------------

export const NamespaceExample: FC = (): ReactElement => {
  const { t } = useTranslation("translation");

  return <h2>{t("app.title")}</h2>;
};

// Namespaces become useful when translation resources are divided into logical resource groups.

// ---------------------------------------------------------------------
// 12. Namespace resource structure
// ---------------------------------------------------------------------

const namespacedResources = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
    },
    products: {
      title: "Products",
      empty: "No products found.",
    },
  },
  de: {
    common: {
      save: "Speichern",
      cancel: "Abbrechen",
    },
    products: {
      title: "Produkte",
      empty: "Keine Produkte gefunden.",
    },
  },
} as const;

console.log(namespacedResources.en.products.title); // "Products"

// A namespace separates resource domains without changing the locale itself.

// ---------------------------------------------------------------------
// 13. Namespace configuration
// ---------------------------------------------------------------------

const namespaceInstance: i18n = i18next.createInstance();

void namespaceInstance.use(initReactI18next).init({
  resources: {
    en: namespacedResources.en,
    de: namespacedResources.de,
  },
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
});

// `defaultNS` determines which namespace is used when a translation key does not specify one.

// ---------------------------------------------------------------------
// 14. Explicit namespace lookup
// ---------------------------------------------------------------------

const namespaceTranslation = namespaceInstance.t("products:title");

console.log(namespaceTranslation); // "Products"

// A namespace can also be specified directly in a translation key.

// ---------------------------------------------------------------------
// 15. Multiple namespaces
// ---------------------------------------------------------------------

export const MultipleNamespaceExample: FC = (): ReactElement => {
  const { t } = useTranslation(["common", "products"]);

  return (
    <section>
      <button type="button">{t("common:save")}</button>

      <h2>{t("products:title")}</h2>
    </section>
  );
};

// Components can consume multiple namespaces when they need translations from different resource domains.

// ---------------------------------------------------------------------
// 16. Changing the language
// ---------------------------------------------------------------------

const changeLanguage = async (locale: SupportedLocale): Promise<void> => {
  await i18n.changeLanguage(locale);
};

void changeLanguage("de");

// `changeLanguage` updates the i18next language and causes subscribed React components
// to render with the corresponding translations.

// ---------------------------------------------------------------------
// 17. Current language
// ---------------------------------------------------------------------

console.log(i18n.language);

// `i18n.language` represents the currently resolved language.
// The exact value can include a regional variant when the application uses one.

// ---------------------------------------------------------------------
// 18. Language selector
// ---------------------------------------------------------------------

export const LanguageSelector: FC = (): ReactElement => {
  const { i18n: instance } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    void instance.changeLanguage(event.target.value);
  };

  return (
    <label>
      Language
      <select value={instance.language} onChange={handleChange}>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
};

// The selector changes the i18next language rather than maintaining a second,
// independent translation locale state.

// ---------------------------------------------------------------------
// 19. Language selection and React state
// ---------------------------------------------------------------------

export const LocalizedLanguageSelector: FC = (): ReactElement => {
  const { i18n: instance } = useTranslation();
  const [selection, setSelection] = useState(instance.language);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextLocale = event.target.value;

    setSelection(nextLocale);
    void instance.changeLanguage(nextLocale);
  };

  return (
    <label>
      Language
      <select value={selection} onChange={handleChange}>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
};

// If local state mirrors i18next language, both values must be kept synchronized.
// In many applications, reading the current i18next language directly is simpler.

// ---------------------------------------------------------------------
// 20. Fallback language
// ---------------------------------------------------------------------

const fallbackInstance: i18n = i18next.createInstance();

void fallbackInstance.init({
  resources: {
    en: {
      translation: {
        greeting: "Hello",
      },
    },
    de: {
      translation: {},
    },
  },
  lng: "de",
  fallbackLng: "en",
});

console.log(fallbackInstance.t("greeting")); // "Hello"

// When a key is unavailable in the active language, fallbackLng can provide another language.

// ---------------------------------------------------------------------
// 21. Key fallback
// ---------------------------------------------------------------------

const missingKey = i18n.t("app.unknown", {
  defaultValue: "Example fallback",
});

console.log(missingKey); // "Example fallback"

// A defaultValue can provide a local fallback for an individual translation lookup.

// ---------------------------------------------------------------------
// 22. Missing translation handling
// ---------------------------------------------------------------------

export const MissingTranslationExample: FC = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <p>
      {t("app.unknown", {
        defaultValue: "Example fallback",
      })}
    </p>
  );
};

// Missing-key behavior should be deliberate.
// Production applications can also configure i18next's missing-key reporting mechanisms.

// ---------------------------------------------------------------------
// 23. Pluralization
// ---------------------------------------------------------------------

export const ItemCount: FC<{
  readonly count: number;
}> = ({ count }): ReactElement => {
  const { t } = useTranslation();

  return <p>{t("cart.item", { count })}</p>;
};

// i18next uses plural rules associated with the active language.
// The resource contains the plural variants rather than the component selecting them manually.

// ---------------------------------------------------------------------
// 24. English plural forms
// ---------------------------------------------------------------------

const englishCounts = [0, 1, 2, 5] as const;

for (const count of englishCounts) {
  console.log(
    i18n.t("cart.item", {
      lng: "en",
      count,
    }),
  );
}

// The translation key remains the same while the plural form changes according to the count.

// ---------------------------------------------------------------------
// 25. Arabic plural forms
// ---------------------------------------------------------------------

const arabicCounts = [0, 1, 2, 3, 11, 100] as const;

for (const count of arabicCounts) {
  console.log(
    i18n.t("cart.item", {
      lng: "ar",
      count,
    }),
  );
}

// Languages can have different plural categories.
// The component should provide the count; the translation system selects the form.

// ---------------------------------------------------------------------
// 26. Zero is a translation concern
// ---------------------------------------------------------------------

export const ZeroItems: FC = (): ReactElement => {
  const { t } = useTranslation();

  return <p>{t("cart.item", { count: 0 })}</p>;
};

// Zero may require a language-specific plural category or a special message.
// Do not assume every language uses the same zero-versus-one-versus-many rules.

// ---------------------------------------------------------------------
// 27. Contextual translation keys
// ---------------------------------------------------------------------

const contextualResources = {
  en: {
    translation: {
      button: {
        save: "Save",
        cancel: "Cancel",
      },
    },
  },
  de: {
    translation: {
      button: {
        save: "Speichern",
        cancel: "Abbrechen",
      },
    },
  },
} as const;

console.log(contextualResources.en.translation.button.save);

// Translation keys should describe stable application concepts rather than the current wording.

// ---------------------------------------------------------------------
// 28. Avoid source-language keys
// ---------------------------------------------------------------------

const semanticKey = "actions.save";

console.log(semanticKey);

// Semantic keys such as "actions.save" remain stable if the English wording changes.
// Source-language strings used as keys couple resource identity to one language.

// ---------------------------------------------------------------------
// 29. Translation key composition
// ---------------------------------------------------------------------

const getActionKey = (action: "save" | "cancel" | "submit"): string => {
  return `actions.${action}`;
};

console.log(getActionKey("save")); // "actions.save"

// Small, controlled key composition can be useful when the set of keys is constrained.
// Arbitrary user-provided strings should not become translation keys.

// ---------------------------------------------------------------------
// 30. Translation with components
// ---------------------------------------------------------------------

export const RichTranslation: FC = (): ReactElement => {
  const { t } = useTranslation();

  const message = t("app.description");

  return <p>{message}</p>;
};

// Plain `t` calls are appropriate when the translated result is plain text.

// ---------------------------------------------------------------------
// 31. Trans component
// ---------------------------------------------------------------------

export const TransComponentExample: FC = (): ReactElement => {
  return (
    <p>
      <Trans i18nKey="app.welcome" values={{ name: "Example" }} />
    </p>
  );
};

// `Trans` is useful when translated content needs React elements or structured markup.

// ---------------------------------------------------------------------
// 32. Trans with formatting elements
// ---------------------------------------------------------------------

export const TransMarkupExample: FC = (): ReactElement => {
  return (
    <Trans
      i18nKey="app.description"
      components={{
        strong: <strong />,
      }}
    />
  );
};

// The translation resource must define the corresponding structured content.
// Component-based translations should remain intentional and limited to meaningful markup.

// ---------------------------------------------------------------------
// 33. Trans with interpolation
// ---------------------------------------------------------------------

export const TransInterpolationExample: FC<WelcomeProps> = ({ name }): ReactElement => {
  return <Trans i18nKey="app.welcome" values={{ name }} />;
};

// Runtime values are supplied separately from the translation resource.

// ---------------------------------------------------------------------
// 34. Translation components and links
// ---------------------------------------------------------------------

export const TransLinkExample: FC = (): ReactElement => {
  return (
    <Trans
      i18nKey="app.description"
      components={{
        link: <a href="/products" />,
      }}
    />
  );
};

// Structured translations can contain links or emphasis when the translated sentence
// requires control over the placement of those elements.

// ---------------------------------------------------------------------
// 35. Avoid translating arbitrary HTML
// ---------------------------------------------------------------------

export const UnsafeMarkupPattern: FC = (): ReactElement => {
  const { t } = useTranslation();

  const translatedMarkup = t("app.description");

  return <p>{translatedMarkup}</p>;
};

// Rendering translated strings as React text avoids interpreting translation content as HTML.
// Raw HTML from translation resources should not be introduced without an explicit security model.

// ---------------------------------------------------------------------
// 36. Translation function outside React
// ---------------------------------------------------------------------

const translateOutsideComponent = (translate: TFunction): string => {
  return translate("app.title");
};

console.log(translateOutsideComponent(i18n.t.bind(i18n)));

// Translation functions can be passed to non-React helpers when the current i18next
// instance is deliberately supplied as a dependency.

// ---------------------------------------------------------------------
// 37. Prefer dependency injection for helpers
// ---------------------------------------------------------------------

interface TranslationHelper {
  readonly t: TFunction;
}

const createGreeting = (helper: TranslationHelper, name: string): string => {
  return helper.t("account.greeting", { name });
};

console.log(createGreeting({ t: i18n.t.bind(i18n) }, "Example"));

// Passing translation capabilities explicitly keeps helpers independent from React context.

// ---------------------------------------------------------------------
// 38. Locale-aware formatter with translation
// ---------------------------------------------------------------------

const formatLocalizedCount = (locale: SupportedLocale, count: number): string => {
  return new Intl.NumberFormat(locale).format(count);
};

export const LocalizedCount: FC<{
  readonly count: number;
}> = ({ count }): ReactElement => {
  const { i18n: instance } = useTranslation();

  return <span>{formatLocalizedCount(instance.language as SupportedLocale, count)}</span>;
};

// i18next supplies translated messages while Intl APIs handle locale-sensitive
// formatting such as numbers, dates, and currencies.

// ---------------------------------------------------------------------
// 39. Translation and number formatting together
// ---------------------------------------------------------------------

export const LocalizedItemsSummary: FC<{
  readonly count: number;
}> = ({ count }): ReactElement => {
  const { t, i18n: instance } = useTranslation();

  const locale = instance.language as SupportedLocale;
  const formattedCount = new Intl.NumberFormat(locale).format(count);

  return <p>{t("cart.item", { count: formattedCount })}</p>;
};

// Be careful: plural selection should normally receive the semantic numeric count.
// Formatting the count before passing it to a pluralized translation can interfere
// with plural-rule selection. This example is therefore only appropriate for
// translation resources that do not depend on i18next's numeric plural selection.

// ---------------------------------------------------------------------
// 40. Correct pluralization with formatted display values
// ---------------------------------------------------------------------

const getLocalizedItemMessage = (translate: TFunction, locale: SupportedLocale, count: number): string => {
  const translated = translate("cart.item", { count });
  const formattedCount = new Intl.NumberFormat(locale).format(count);

  return translated.replace(String(count), formattedCount);
};

console.log(getLocalizedItemMessage(i18n.t.bind(i18n), "de", 1234));

// The semantic count is supplied to i18next for plural selection.
// The displayed number can then be localized separately.

// ---------------------------------------------------------------------
// 41. Date formatting with translation
// ---------------------------------------------------------------------

export const LocalizedDateMessage: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  const { t, i18n: instance } = useTranslation();
  const locale = instance.language as SupportedLocale;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);

  return (
    <p>
      {t("app.description")} — {formattedDate}
    </p>
  );
};

// Translated text and formatted date data remain separate responsibilities.

// ---------------------------------------------------------------------
// 42. Translation resources by namespace
// ---------------------------------------------------------------------

interface ResourceNamespaces {
  readonly common: Record<string, string>;
  readonly products: Record<string, string>;
}

const exampleNamespaceResources: Record<SupportedLocale, ResourceNamespaces> = {
  en: {
    common: {
      save: "Save",
    },
    products: {
      title: "Products",
    },
  },
  de: {
    common: {
      save: "Speichern",
    },
    products: {
      title: "Produkte",
    },
  },
  fr: {
    common: {
      save: "Enregistrer",
    },
    products: {
      title: "Produits",
    },
  },
  ar: {
    common: {
      save: "حفظ",
    },
    products: {
      title: "المنتجات",
    },
  },
};

console.log(exampleNamespaceResources.de.products.title);

// Namespaces are useful for organizing larger translation resources.

// ---------------------------------------------------------------------
// 43. Lazy loading concept
// ---------------------------------------------------------------------

interface TranslationLoader {
  readonly load: (locale: SupportedLocale) => Promise<unknown>;
}

const exampleLoader: TranslationLoader = {
  load: async (locale) => ({
    locale,
    loaded: true,
  }),
};

void exampleLoader.load("de");

// i18next can be configured with backends that load resources asynchronously.
// Lazy loading keeps the initial resource set smaller when an application has many locales.

// ---------------------------------------------------------------------
// 44. Loading state
// ---------------------------------------------------------------------

export const TranslationLoadingExample: FC = (): ReactElement => {
  const { ready } = useTranslation();

  if (!ready) {
    return <p>Loading translations...</p>;
  }

  return <BasicTranslation />;
};

// Depending on the configuration and resource-loading strategy,
// a component can render while required namespaces or resources are still loading.

// ---------------------------------------------------------------------
// 45. Suspense integration
// ---------------------------------------------------------------------

export const SuspenseTranslationExample: FC = (): ReactElement => {
  return <BasicTranslation />;
};

// react-i18next can integrate with React Suspense for asynchronous translation loading.
// Whether Suspense is used is an application configuration decision.

// ---------------------------------------------------------------------
// 46. Translation context
// ---------------------------------------------------------------------

interface LocaleContextValue {
  readonly locale: SupportedLocale;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
});

export const LocaleContextProvider: FC<{
  readonly locale: SupportedLocale;
  readonly children: ReactNode;
}> = ({ locale, children }): ReactElement => {
  const value = useMemo(() => ({ locale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const LocaleContextConsumer: FC = (): ReactElement => {
  const { locale } = useContext(LocaleContext);

  return <p>{locale}</p>;
};

// Application-specific locale context can hold domain state,
// while i18next remains responsible for translation resources and lookup.

// ---------------------------------------------------------------------
// 47. Avoid duplicate locale authorities
// ---------------------------------------------------------------------

const applicationLocale = "de";
const translationLocale = i18n.language;

console.log(applicationLocale);
console.log(translationLocale);

// In a real application, locale state should have a clear owner.
// Two independent locale sources can become inconsistent.

// ---------------------------------------------------------------------
// 48. Synchronizing application locale with i18next
// ---------------------------------------------------------------------

const setApplicationLocale = async (locale: SupportedLocale): Promise<void> => {
  await i18n.changeLanguage(locale);
};

// The application can use a single locale-changing operation to update i18next
// and any related application state that must change with it.

// ---------------------------------------------------------------------
// 49. Direction from locale
// ---------------------------------------------------------------------

const getDirection = (locale: SupportedLocale): "ltr" | "rtl" => {
  return locale === "ar" ? "rtl" : "ltr";
};

console.log(getDirection("en")); // "ltr"
console.log(getDirection("ar")); // "rtl"

// Locale-aware direction belongs to the document or interface layer,
// not to individual translation strings.

// ---------------------------------------------------------------------
// 50. Direction-aware translated component
// ---------------------------------------------------------------------

export const DirectionAwareTranslation: FC = (): ReactElement => {
  const { t, i18n: instance } = useTranslation();
  const locale = instance.language as SupportedLocale;

  return (
    <section lang={locale} dir={getDirection(locale)}>
      <h2>{t("app.title")}</h2>
      <p>{t("app.description")}</p>
    </section>
  );
};

// Changing the locale can therefore update both translated content and text direction.

// ---------------------------------------------------------------------
// 51. Language switcher with direction
// ---------------------------------------------------------------------

export const DirectionAwareLanguageSwitcher: FC = (): ReactElement => {
  const { i18n: instance } = useTranslation();

  const locale = instance.language as SupportedLocale;
  const direction = getDirection(locale);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    void instance.changeLanguage(event.target.value);
  };

  return (
    <div lang={locale} dir={direction}>
      <label>
        Language
        <select value={locale} onChange={handleChange}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </label>
    </div>
  );
};

// The selector remains a normal form control even when the interface direction changes.

// ---------------------------------------------------------------------
// 52. Translation readiness
// ---------------------------------------------------------------------

export const TranslationReadiness: FC = (): ReactElement => {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <p>Loading...</p>;
  }

  return <p>{t("app.title")}</p>;
};

// Readiness is relevant when resources can be loaded asynchronously.

// ---------------------------------------------------------------------
// 53. Translation existence checks
// ---------------------------------------------------------------------

const hasTranslation = (key: string): boolean => {
  return i18n.exists(key);
};

console.log(hasTranslation("app.title")); // true
console.log(hasTranslation("app.unknown")); // false

// Existence checks can support optional content, diagnostics, or migration logic.

// ---------------------------------------------------------------------
// 54. Optional translation
// ---------------------------------------------------------------------

export const OptionalTranslation: FC = (): ReactElement => {
  const { t, i18n: instance } = useTranslation();

  if (!instance.exists("app.optional")) {
    return <></>;
  }

  return <p>{t("app.optional")}</p>;
};

// Optional content should be explicitly modeled rather than relying on accidental missing-key output.

// ---------------------------------------------------------------------
// 55. Translation debugging
// ---------------------------------------------------------------------

const debugTranslation = (key: string): void => {
  console.log({
    key,
    language: i18n.language,
    exists: i18n.exists(key),
    value: i18n.t(key),
  });
};

debugTranslation("app.title");

// Debug information can help identify missing resources or incorrect language configuration.

// ---------------------------------------------------------------------
// 56. Key prefix
// ---------------------------------------------------------------------

export const KeyPrefixExample: FC = (): ReactElement => {
  const { t } = useTranslation("translation", {
    keyPrefix: "navigation",
  });

  return (
    <nav>
      <a href="/">{t("home")}</a>
      <a href="/products">{t("products")}</a>
    </nav>
  );
};

// A key prefix can reduce repetition when a component works inside one resource subtree.

// ---------------------------------------------------------------------
// 57. Translation function with default value
// ---------------------------------------------------------------------

export const DefaultValueExample: FC = (): ReactElement => {
  const { t } = useTranslation();

  return (
    <p>
      {t("app.optional", {
        defaultValue: "Example content",
      })}
    </p>
  );
};

// defaultValue is useful when a deliberate fallback is appropriate for a specific lookup.

// ---------------------------------------------------------------------
// 58. Interpolation formatting belongs outside translation keys
// ---------------------------------------------------------------------

interface PriceMessageProps {
  readonly amount: number;
  readonly currency: string;
}

export const PriceMessage: FC<PriceMessageProps> = ({ amount, currency }): ReactElement => {
  const { t, i18n: instance } = useTranslation();
  const locale = instance.language as SupportedLocale;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return (
    <p>
      {t("app.description")} — {formattedPrice}
    </p>
  );
};

// The translation controls sentence structure while Intl controls monetary formatting.

// ---------------------------------------------------------------------
// 59. Translation resource validation concept
// ---------------------------------------------------------------------

interface TranslationResourceShape {
  readonly app: {
    readonly title: string;
    readonly welcome: string;
    readonly description: string;
  };
}

const isTranslationResource = (value: unknown): value is TranslationResourceShape => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const resource = value as Partial<TranslationResourceShape>;

  return (
    typeof resource.app?.title === "string" &&
    typeof resource.app?.welcome === "string" &&
    typeof resource.app?.description === "string"
  );
};

console.log(isTranslationResource(resources.en.translation)); // true

// Runtime validation is useful when translation resources come from external files,
// APIs, or other data sources that TypeScript cannot verify at runtime.

// ---------------------------------------------------------------------
// 60. TypeScript resource validation versus runtime validation
// ---------------------------------------------------------------------

const typedResource: TranslationResourceShape = {
  app: {
    title: "Example",
    welcome: "Welcome, {{name}}.",
    description: "Example description.",
  },
};

console.log(typedResource.app.title);

// TypeScript validates values known at compile time.
// Runtime validation remains necessary for untrusted or dynamically loaded data.

// ---------------------------------------------------------------------
// 61. Translation key typing concept
// ---------------------------------------------------------------------

type TranslationKey =
  | "app.title"
  | "app.welcome"
  | "app.description"
  | "navigation.home"
  | "navigation.products"
  | "navigation.settings"
  | "actions.save"
  | "actions.cancel"
  | "actions.submit"
  | "cart.item"
  | "account.greeting";

const typedKey: TranslationKey = "app.title";

console.log(typedKey);

// Explicit key unions can provide compile-time protection in small applications.
// Large applications often generate translation types from their resource schema.

// ---------------------------------------------------------------------
// 62. Typed translation helper
// ---------------------------------------------------------------------

const typedTranslate = (translate: TFunction, key: TranslationKey): string => {
  return translate(key);
};

console.log(typedTranslate(i18n.t.bind(i18n), "app.title"));

// A typed wrapper can constrain the keys accepted by application-specific helpers.

// ---------------------------------------------------------------------
// 63. React component using a typed key
// ---------------------------------------------------------------------

interface TranslationKeyProps {
  readonly translationKey: TranslationKey;
}

export const TypedTranslation: FC<TranslationKeyProps> = ({ translationKey }): ReactElement => {
  const { t } = useTranslation();

  return <span>{t(translationKey)}</span>;
};

// The component cannot receive an arbitrary key when its prop is constrained to TranslationKey.

// ---------------------------------------------------------------------
// 64. Translation namespaces as feature boundaries
// ---------------------------------------------------------------------

const featureNamespaces = ["common", "products", "account", "settings"] as const;

type FeatureNamespace = (typeof featureNamespaces)[number];

console.log(featureNamespaces);
console.log(null as FeatureNamespace | null);

// Namespaces can follow application feature boundaries,
// making resource ownership and loading strategy easier to manage.

// ---------------------------------------------------------------------
// 65. Feature translation component
// ---------------------------------------------------------------------

export const ProductsTranslation: FC = (): ReactElement => {
  const { t } = useTranslation("products");

  return (
    <section>
      <h2>{t("title")}</h2>
    </section>
  );
};

// A feature component can request only the namespace it needs.

// ---------------------------------------------------------------------
// 66. Namespace loading strategy
// ---------------------------------------------------------------------

interface NamespaceLoaderProps {
  readonly namespace: string;
}

export const NamespaceLoadingBoundary: FC<NamespaceLoaderProps> = ({ namespace }): ReactElement => {
  const { ready } = useTranslation(namespace);

  if (!ready) {
    return <p>Loading {namespace} translations...</p>;
  }

  return <ProductsTranslation />;
};

// When namespaces are loaded asynchronously, components can expose an appropriate loading state.

// ---------------------------------------------------------------------
// 67. Translation component composition
// ---------------------------------------------------------------------

export const LocalizedAccountSection: FC<WelcomeProps> = ({ name }): ReactElement => {
  const { t } = useTranslation();

  return (
    <section>
      <h2>{t("app.title")}</h2>
      <p>{t("account.greeting", { name })}</p>
    </section>
  );
};

// Components should request the translations they need rather than receiving
// every translated string from a distant parent by default.

// ---------------------------------------------------------------------
// 68. Passing translated strings as props
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly label: string;
}

export const LocalizedButton: FC<ButtonProps> = ({ label }): ReactElement => {
  return <button type="button">{label}</button>;
};

export const LocalizedButtonUsage: FC = (): ReactElement => {
  const { t } = useTranslation();

  return <LocalizedButton label={t("actions.save")} />;
};

// Passing translated text as a prop can be useful when a component is intentionally
// presentation-only and should not know about the translation system.

// ---------------------------------------------------------------------
// 69. React memoization and translation
// ---------------------------------------------------------------------

export const MemoizedLocalizedContent: FC = (): ReactElement => {
  const { t } = useTranslation();

  const title = useMemo(() => t("app.title"), [t]);

  return <h2>{title}</h2>;
};

// Translation functions and locale changes participate in rendering.
// Do not memoize translated output independently of the values that determine it.

// ---------------------------------------------------------------------
// 70. Locale-dependent derived data
// ---------------------------------------------------------------------

export const LocaleDependentOptions: FC = (): ReactElement => {
  const { i18n: instance } = useTranslation();
  const locale = instance.language as SupportedLocale;

  const options = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        code: country.code,
        label:
          new Intl.DisplayNames(locale, {
            type: "region",
          }).of(country.code) ?? country.code,
      })),
    [locale],
  );

  return (
    <select>
      {options.map((option) => (
        <option key={option.code} value={option.code}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Locale-dependent derived values should be recalculated when the locale changes.

// ---------------------------------------------------------------------
// 71. React tree with I18nextProvider
// ---------------------------------------------------------------------

export const TranslationApplication: FC = (): ReactElement => {
  return (
    <TranslationProvider>
      <main>
        <LanguageSelector />
        <BasicTranslation />
        <WelcomeMessage name="Example" />
        <ItemCount count={3} />
      </main>
    </TranslationProvider>
  );
};

// I18nextProvider supplies the configured i18next instance to the React subtree.

// ---------------------------------------------------------------------
// 72. Provider instance ownership
// ---------------------------------------------------------------------

interface AppWithTranslationProps {
  readonly translationInstance: i18n;
  readonly children: ReactNode;
}

export const AppWithTranslation: FC<AppWithTranslationProps> = ({ translationInstance, children }): ReactElement => {
  return <I18nextProvider i18n={translationInstance}>{children}</I18nextProvider>;
};

// Passing the instance explicitly makes provider ownership visible and testable.

// ---------------------------------------------------------------------
// 73. Isolated i18next instances
// ---------------------------------------------------------------------

const createTranslationInstance = (locale: SupportedLocale): i18n => {
  const instance = i18next.createInstance();

  void instance.init({
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
    },
  });

  return instance;
};

const isolatedInstance = createTranslationInstance("de");

console.log(isolatedInstance.language); // "de"

// createInstance is useful when an application needs independent i18next instances,
// such as isolated application roots or tests.

// ---------------------------------------------------------------------
// 74. Testing with an isolated instance
// ---------------------------------------------------------------------

const testInstance = createTranslationInstance("fr");

console.log(testInstance.t("app.title")); // "Application exemple"

// Isolated instances prevent tests from depending on mutable global translation state.

// ---------------------------------------------------------------------
// 75. Translation component testability
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly translate: TFunction;
  readonly name: string;
}

export const TestableGreeting: FC<GreetingProps> = ({ translate, name }): ReactElement => {
  return <p>{translate("account.greeting", { name })}</p>;
};

// Components that receive translation capabilities explicitly can be tested without
// requiring a specific global i18next instance.

// ---------------------------------------------------------------------
// 76. Translation and routing
// ---------------------------------------------------------------------

interface LocalizedRouteLabelProps {
  readonly routeKey: TranslationKey;
}

export const LocalizedRouteLabel: FC<LocalizedRouteLabelProps> = ({ routeKey }): ReactElement => {
  const { t } = useTranslation();

  return <span>{t(routeKey)}</span>;
};

// Route identity and translated labels should remain separate.
// The translated label is presentation; the route identity remains application data.

// ---------------------------------------------------------------------
// 77. Translation and accessibility
// ---------------------------------------------------------------------

export const AccessibleLocalizedButton: FC = (): ReactElement => {
  const { t } = useTranslation();

  return <button type="button">{t("actions.save")}</button>;
};

// Localizing visible text also localizes the accessible name when the text supplies it.
// The underlying semantic element remains unchanged.

// ---------------------------------------------------------------------
// 78. Integrated react-i18next example
// ---------------------------------------------------------------------

export const IntegratedReactI18nextExample: FC = (): ReactElement => {
  const { t, i18n: instance } = useTranslation();
  const locale = instance.language as SupportedLocale;
  const [count, setCount] = useState(1);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    void instance.changeLanguage(event.target.value);
  };

  return (
    <section lang={locale} dir={getDirection(locale)}>
      <label>
        Language
        <select value={locale} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </label>

      <h2>{t("app.title")}</h2>

      <p>{t("app.welcome", { name: "Example" })}</p>

      <p>{t("cart.item", { count })}</p>

      <button type="button" onClick={() => setCount((current) => current + 1)}>
        {t("actions.submit")}
      </button>

      <button type="button" onClick={() => setCount(1)}>
        {t("actions.reset", {
          defaultValue: "Reset",
        })}
      </button>
    </section>
  );
};

// The integrated example combines translation lookup, interpolation,
// pluralization, language switching, direction, and React state.

// ---------------------------------------------------------------------
// 79. Architecture checklist
// ---------------------------------------------------------------------

const reactI18nextPrinciples = [
  "Keep translation resources separate from React components.",
  "Use stable semantic translation keys.",
  "Use useTranslation for component-level translation access.",
  "Use Trans when translated content needs structured React elements.",
  "Use interpolation for runtime values inside translated messages.",
  "Let i18next handle plural rules for the active language.",
  "Use namespaces to organize larger translation resources.",
  "Use fallback languages deliberately.",
  "Use Intl APIs for dates, numbers, currencies, and other locale-sensitive formatting.",
  "Keep locale state synchronized with the translation instance.",
  "Treat translation resources as external data when they are loaded dynamically.",
  "Keep direction and language metadata synchronized with the active locale.",
] as const;

console.log(reactI18nextPrinciples);

// React components describe UI structure; i18next manages translation resources and lookup;
// Intl APIs handle locale-sensitive formatting that is not ordinary translated text.

// ---------------------------------------------------------------------
// 80. Default export
// ---------------------------------------------------------------------

export default TranslationApplication;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - react-i18next connects i18next translation resources and locale state to React components.
// - I18nextProvider makes a configured i18next instance available through React context.
// - useTranslation provides the translation function and i18next state to components.
// - Translation keys should represent stable application concepts rather than source-language text.
// - Interpolation inserts runtime values while preserving locale-specific sentence structure.
// - Pluralization should receive semantic numeric counts so i18next can select the appropriate plural category.
// - Trans is useful when translated content needs structured React elements such as links or emphasis.
// - Namespaces organize translation resources and can align with application feature boundaries.
// - Fallback languages and default values provide deliberate behavior for missing translations.
// - Translation resources loaded dynamically should be treated as runtime data and validated when appropriate.
// - Intl APIs should handle locale-sensitive dates, numbers, currencies, and similar formatting.
// - Locale changes can affect translated content, formatting, and text direction together.
// - Application locale state should have a clear source of truth rather than competing with an independent translation locale.
// - Translation strings should be rendered as text unless structured markup is intentionally required.
// - Isolated i18next instances can make tests and independently managed React roots easier to control.
// - Accessibility semantics remain important when translated labels, names, and messages are rendered.

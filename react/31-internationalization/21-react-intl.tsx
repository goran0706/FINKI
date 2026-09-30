/**
 * React Intl
 * ==========
 *
 * React Intl integrates the ECMAScript Internationalization API and ICU Message Format
 * with React. It provides a provider-based architecture, declarative formatting components,
 * message descriptors, and an imperative `intl` API for locale-sensitive application content.
 */

import {
  createIntl,
  createIntlCache,
  defineMessage,
  defineMessages,
  FormattedDate,
  FormattedDateParts,
  FormattedDisplayName,
  FormattedList,
  FormattedListParts,
  FormattedMessage,
  FormattedNumber,
  FormattedNumberParts,
  FormattedPlural,
  FormattedRelativeTime,
  FormattedTime,
  IntlProvider,
  RawIntlProvider,
  useIntl,
} from "react-intl";
import { useMemo, useState, type ChangeEvent, type FC, type ReactElement, type ReactNode } from "react";
import type { IntlShape, MessageDescriptor } from "react-intl";

// ---------------------------------------------------------------------
// 1. Supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en" | "de" | "fr" | "ar";

const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en", "de", "fr", "ar"];

const DEFAULT_LOCALE: SupportedLocale = "en";

console.log(SUPPORTED_LOCALES); // ["en", "de", "fr", "ar"]

// A locale identifies the language and, when needed, regional conventions
// used when formatting messages, numbers, dates, currencies, and other values.

// ---------------------------------------------------------------------
// 2. Translation messages
// ---------------------------------------------------------------------

const messages = {
  en: {
    "app.title": "Example Application",
    "app.description": "This is an example localized application.",
    "app.welcome": "Welcome, {name}.",
    "navigation.home": "Home",
    "navigation.products": "Products",
    "navigation.settings": "Settings",
    "actions.save": "Save",
    "actions.cancel": "Cancel",
    "actions.submit": "Submit",
    "cart.items": "{count, plural, =0 {No items} one {# item} other {# items}}",
    "account.greeting": "Hello, {name}!",
  },
  de: {
    "app.title": "Beispielanwendung",
    "app.description": "Dies ist eine lokalisierte Beispielanwendung.",
    "app.welcome": "Willkommen, {name}.",
    "navigation.home": "Startseite",
    "navigation.products": "Produkte",
    "navigation.settings": "Einstellungen",
    "actions.save": "Speichern",
    "actions.cancel": "Abbrechen",
    "actions.submit": "Absenden",
    "cart.items": "{count, plural, =0 {Keine Artikel} one {# Artikel} other {# Artikel}}",
    "account.greeting": "Hallo, {name}!",
  },
  fr: {
    "app.title": "Application exemple",
    "app.description": "Ceci est une application exemple localisée.",
    "app.welcome": "Bienvenue, {name}.",
    "navigation.home": "Accueil",
    "navigation.products": "Produits",
    "navigation.settings": "Paramètres",
    "actions.save": "Enregistrer",
    "actions.cancel": "Annuler",
    "actions.submit": "Envoyer",
    "cart.items": "{count, plural, =0 {Aucun article} one {# article} other {# articles}}",
    "account.greeting": "Bonjour, {name} !",
  },
  ar: {
    "app.title": "تطبيق نموذجي",
    "app.description": "هذا تطبيق نموذجي متعدد اللغات.",
    "app.welcome": "مرحبًا، {name}.",
    "navigation.home": "الرئيسية",
    "navigation.products": "المنتجات",
    "navigation.settings": "الإعدادات",
    "actions.save": "حفظ",
    "actions.cancel": "إلغاء",
    "actions.submit": "إرسال",
    "cart.items":
      "{count, plural, =0 {لا توجد عناصر} =1 {عنصر واحد} =2 {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}",
    "account.greeting": "مرحبًا، {name}!",
  },
} as const;

// React Intl receives a message catalog for the active locale.
// Message IDs remain stable while the localized message text changes.

// ---------------------------------------------------------------------
// 3. Message descriptors
// ---------------------------------------------------------------------

const titleMessage: MessageDescriptor = {
  id: "app.title",
  defaultMessage: "Example Application",
  description: "Application title",
};

console.log(titleMessage.id); // "app.title"

// A message descriptor identifies a message and provides its default source text.
// `defaultMessage` should normally be written in the application's default locale.

// ---------------------------------------------------------------------
// 4. defineMessage
// ---------------------------------------------------------------------

const welcomeMessage = defineMessage({
  id: "app.welcome",
  defaultMessage: "Welcome, {name}.",
  description: "Greeting shown on the application home screen",
});

console.log(welcomeMessage.id); // "app.welcome"

// `defineMessage` creates a descriptor while keeping message metadata close to the source.

// ---------------------------------------------------------------------
// 5. defineMessages
// ---------------------------------------------------------------------

const applicationMessages = defineMessages({
  title: {
    id: "app.title",
    defaultMessage: "Example Application",
    description: "Application title",
  },
  description: {
    id: "app.description",
    defaultMessage: "This is an example localized application.",
    description: "Application description",
  },
  save: {
    id: "actions.save",
    defaultMessage: "Save",
    description: "Save action",
  },
});

console.log(applicationMessages.title.id); // "app.title"

// `defineMessages` groups related descriptors and can support message extraction tooling.

// ---------------------------------------------------------------------
// 6. IntlProvider
// ---------------------------------------------------------------------

interface TranslationProviderProps {
  readonly locale: SupportedLocale;
  readonly children: ReactNode;
}

export const TranslationProvider: FC<TranslationProviderProps> = ({ locale, children }): ReactElement => {
  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  );
};

// IntlProvider supplies locale, messages, formatting configuration, and error handling
// to the React subtree below it.

// ---------------------------------------------------------------------
// 7. Basic FormattedMessage
// ---------------------------------------------------------------------

export const BasicMessage: FC = (): ReactElement => {
  return (
    <h2>
      <FormattedMessage id="app.title" defaultMessage="Example Application" />
    </h2>
  );
};

// FormattedMessage is the declarative React API for localized message rendering.

// ---------------------------------------------------------------------
// 8. FormattedMessage with a descriptor
// ---------------------------------------------------------------------

export const DescriptorMessage: FC = (): ReactElement => {
  return (
    <h2>
      <FormattedMessage {...titleMessage} />
    </h2>
  );
};

// A descriptor can be reused between imperative and declarative formatting APIs.

// ---------------------------------------------------------------------
// 9. Message interpolation
// ---------------------------------------------------------------------

export const WelcomeMessage: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  return (
    <p>
      <FormattedMessage id="app.welcome" defaultMessage="Welcome, {name}." values={{ name }} />
    </p>
  );
};

// ICU placeholders receive runtime values through the `values` prop.
// The translated sentence controls the position of the interpolated value.

// ---------------------------------------------------------------------
// 10. Message descriptions
// ---------------------------------------------------------------------

const describedMessage = defineMessage({
  id: "account.greeting",
  defaultMessage: "Hello, {name}!",
  description: "Short greeting shown above the account area",
});

console.log(describedMessage.description);

// Descriptions give translators context without becoming visible application content.

// ---------------------------------------------------------------------
// 11. ICU plural syntax
// ---------------------------------------------------------------------

export const ItemCount: FC<{
  readonly count: number;
}> = ({ count }): ReactElement => {
  return (
    <p>
      <FormattedMessage
        id="cart.items"
        defaultMessage="{count, plural, =0 {No items} one {# item} other {# items}}"
        values={{ count }}
      />
    </p>
  );
};

// Plural rules belong to the message syntax.
// The component supplies the count; the locale determines the applicable plural category.

// ---------------------------------------------------------------------
// 12. Exact plural matches
// ---------------------------------------------------------------------

export const ExactPluralExample: FC<{
  readonly count: number;
}> = ({ count }): ReactElement => {
  return (
    <FormattedMessage
      id="cart.items"
      defaultMessage="{count, plural, =0 {No items} one {# item} other {# items}}"
      values={{ count }}
    />
  );
};

// `=0` is an exact-value branch.
// Exact branches can override the general plural category for a particular number.

// ---------------------------------------------------------------------
// 13. Ordinal messages
// ---------------------------------------------------------------------

export const OrdinalMessage: FC<{
  readonly position: number;
}> = ({ position }): ReactElement => {
  return (
    <FormattedMessage
      id="ranking.position"
      defaultMessage="{position, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}"
      values={{ position }}
    />
  );
};

// `selectordinal` applies ordinal plural rules rather than cardinal plural rules.

// ---------------------------------------------------------------------
// 14. Select messages
// ---------------------------------------------------------------------

export const SelectMessage: FC<{
  readonly status: "active" | "inactive";
}> = ({ status }): ReactElement => {
  return (
    <FormattedMessage
      id="account.status"
      defaultMessage="{status, select, active {Account is active.} inactive {Account is inactive.} other {Account status is unknown.}}"
      values={{ status }}
    />
  );
};

// `select` chooses a branch based on a string value rather than a plural category.

// ---------------------------------------------------------------------
// 15. Nested ICU messages
// ---------------------------------------------------------------------

export const NestedMessage: FC<{
  readonly count: number;
  readonly name: string;
}> = ({ count, name }): ReactElement => {
  return (
    <FormattedMessage
      id="account.summary"
      defaultMessage="{name} has {count, plural, one {# notification} other {# notifications}}."
      values={{ name, count }}
    />
  );
};

// ICU Message Format allows multiple arguments and formatting constructs in one message.

// ---------------------------------------------------------------------
// 16. Number interpolation
// ---------------------------------------------------------------------

export const NumberMessage: FC<{
  readonly amount: number;
}> = ({ amount }): ReactElement => {
  return <FormattedMessage id="cart.total" defaultMessage="Total: {amount, number}." values={{ amount }} />;
};

// The `number` argument delegates numeric formatting to the active locale.

// ---------------------------------------------------------------------
// 17. Date interpolation
// ---------------------------------------------------------------------

export const DateMessage: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  return <FormattedMessage id="event.date" defaultMessage="Event date: {date, date, medium}." values={{ date }} />;
};

// ICU message arguments can format values using named date formats.

// ---------------------------------------------------------------------
// 18. Time interpolation
// ---------------------------------------------------------------------

export const TimeMessage: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  return <FormattedMessage id="event.time" defaultMessage="Event time: {date, time, short}." values={{ date }} />;
};

// Date and time formatting remains locale-sensitive while the surrounding sentence is translated.

// ---------------------------------------------------------------------
// 19. FormattedNumber
// ---------------------------------------------------------------------

export const NumberExample: FC = (): ReactElement => {
  return (
    <p>
      <FormattedNumber value={1234567.89} />
    </p>
  );
};

// FormattedNumber uses the active locale's NumberFormat behavior.

// ---------------------------------------------------------------------
// 20. FormattedNumber currency
// ---------------------------------------------------------------------

export const CurrencyExample: FC<{
  readonly amount: number;
}> = ({ amount }): ReactElement => {
  return <FormattedNumber value={amount} style="currency" currency="USD" />;
};

// Currency formatting handles locale-specific grouping, decimal separators,
// currency placement, and other presentation conventions.

// ---------------------------------------------------------------------
// 21. FormattedNumber percent
// ---------------------------------------------------------------------

export const PercentageExample: FC<{
  readonly value: number;
}> = ({ value }): ReactElement => {
  return <FormattedNumber value={value} style="percent" />;
};

// A percent value of `0.25` represents 25%.
// The formatter performs the locale-sensitive presentation.

// ---------------------------------------------------------------------
// 22. FormattedNumber units
// ---------------------------------------------------------------------

export const UnitExample: FC<{
  readonly value: number;
}> = ({ value }): ReactElement => {
  return <FormattedNumber value={value} style="unit" unit="kilometer" unitDisplay="long" />;
};

// Unit formatting localizes the representation of a measurement.

// ---------------------------------------------------------------------
// 23. FormattedNumber options
// ---------------------------------------------------------------------

export const NumberOptionsExample: FC = (): ReactElement => {
  return <FormattedNumber value={1234.5678} minimumFractionDigits={2} maximumFractionDigits={2} />;
};

// React Intl forwards supported NumberFormat options to the underlying formatter.

// ---------------------------------------------------------------------
// 24. FormattedNumberParts
// ---------------------------------------------------------------------

export const NumberPartsExample: FC = (): ReactElement => {
  return (
    <FormattedNumberParts value={1234567.89}>
      {(parts) => (
        <span>
          {parts.map((part, index) => (
            <span key={`${part.type}-${index}`}>{part.value}</span>
          ))}
        </span>
      )}
    </FormattedNumberParts>
  );
};

// Parts expose the semantic pieces produced by Intl.NumberFormat.
// They can be rendered individually when specialized presentation is required.

// ---------------------------------------------------------------------
// 25. FormattedDate
// ---------------------------------------------------------------------

export const DateExample: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  return <FormattedDate value={date} year="numeric" month="long" day="numeric" />;
};

// FormattedDate provides declarative access to Intl.DateTimeFormat.

// ---------------------------------------------------------------------
// 26. FormattedTime
// ---------------------------------------------------------------------

export const TimeExample: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  return <FormattedTime value={date} hour="numeric" minute="numeric" />;
};

// FormattedTime specializes the date-time formatter for time-oriented output.

// ---------------------------------------------------------------------
// 27. FormattedDateParts
// ---------------------------------------------------------------------

export const DatePartsExample: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  return (
    <FormattedDateParts value={date} year="numeric" month="long" day="numeric">
      {(parts) => (
        <span>
          {parts.map((part, index) => (
            <span key={`${part.type}-${index}`}>{part.value}</span>
          ))}
        </span>
      )}
    </FormattedDateParts>
  );
};

// Parts allow application-specific rendering while retaining locale-specific ordering.

// ---------------------------------------------------------------------
// 28. Date ranges
// ---------------------------------------------------------------------

export const DateRangeExample: FC = (): ReactElement => {
  const start = new Date("2026-09-01T00:00:00Z");
  const end = new Date("2026-09-07T00:00:00Z");

  return (
    <span>
      <FormattedDate value={start} dateStyle="medium" />
      {" – "}
      <FormattedDate value={end} dateStyle="medium" />
    </span>
  );
};

// Separate FormattedDate components can represent a range when broad runtime compatibility
// is more important than the specialized range formatter.

// ---------------------------------------------------------------------
// 29. FormattedRelativeTime
// ---------------------------------------------------------------------

export const RelativeTimeExample: FC = (): ReactElement => {
  return <FormattedRelativeTime value={-1} unit="day" numeric="auto" />;
};

// FormattedRelativeTime uses locale-sensitive relative-time terminology such as "yesterday".

// ---------------------------------------------------------------------
// 30. Relative time updates
// ---------------------------------------------------------------------

export const UpdatingRelativeTime: FC = (): ReactElement => {
  return <FormattedRelativeTime value={-45} unit="second" updateIntervalInSeconds={1} />;
};

// updateIntervalInSeconds allows the component to refresh as relative time changes.
// Automatic updating is intended for short units such as seconds, minutes, and hours.

// ---------------------------------------------------------------------
// 31. FormattedPlural
// ---------------------------------------------------------------------

export const PluralCategoryExample: FC<{
  readonly count: number;
}> = ({ count }): ReactElement => {
  return <FormattedPlural value={count} one={<span>one</span>} other={<span>other</span>} />;
};

// FormattedPlural exposes the plural category directly.
// For complete multilingual messages, FormattedMessage with ICU plural syntax is usually more expressive.

// ---------------------------------------------------------------------
// 32. FormattedList
// ---------------------------------------------------------------------

export const ListExample: FC = (): ReactElement => {
  return <FormattedList value={["Apples", "Oranges", "Bananas"]} type="conjunction" />;
};

// List formatting uses locale-specific conjunctions, punctuation, and ordering conventions.

// ---------------------------------------------------------------------
// 33. FormattedList disjunction
// ---------------------------------------------------------------------

export const DisjunctionListExample: FC = (): ReactElement => {
  return <FormattedList value={["Email", "Phone", "Chat"]} type="disjunction" />;
};

// A disjunction represents alternatives such as "Email, Phone, or Chat".

// ---------------------------------------------------------------------
// 34. FormattedListParts
// ---------------------------------------------------------------------

export const ListPartsExample: FC = (): ReactElement => {
  return (
    <FormattedListParts value={["A", "B", "C"]} type="conjunction">
      {(parts) => (
        <span>
          {parts.map((part, index) => (
            <span key={`${part.type}-${index}`}>{part.value}</span>
          ))}
        </span>
      )}
    </FormattedListParts>
  );
};

// List parts expose the semantic pieces produced by Intl.ListFormat.

// ---------------------------------------------------------------------
// 35. FormattedDisplayName
// ---------------------------------------------------------------------

export const DisplayNameExample: FC = (): ReactElement => {
  return (
    <p>
      <FormattedDisplayName type="language" value="de" />
    </p>
  );
};

// Display names allow values such as language, region, script, or currency codes
// to be presented using the active locale.

// ---------------------------------------------------------------------
// 36. Displaying a region
// ---------------------------------------------------------------------

export const RegionNameExample: FC = (): ReactElement => {
  return (
    <p>
      <FormattedDisplayName type="region" value="DE" />
    </p>
  );
};

// The result is localized rather than being a hard-coded country or region name.

// ---------------------------------------------------------------------
// 37. useIntl
// ---------------------------------------------------------------------

export const UseIntlExample: FC = (): ReactElement => {
  const intl = useIntl();

  return <p>{intl.formatNumber(1234567.89)}</p>;
};

// useIntl provides the imperative IntlShape for function components.

// ---------------------------------------------------------------------
// 38. Imperative message formatting
// ---------------------------------------------------------------------

export const ImperativeMessage: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  const intl = useIntl();

  const message = intl.formatMessage(
    {
      id: "app.welcome",
      defaultMessage: "Welcome, {name}.",
    },
    { name },
  );

  return <p>{message}</p>;
};

// The imperative API is useful when a formatted string is needed rather than
// a dedicated React formatting component.

// ---------------------------------------------------------------------
// 39. Formatting attributes
// ---------------------------------------------------------------------

export const AccessibleLabelExample: FC = (): ReactElement => {
  const intl = useIntl();

  const label = intl.formatMessage({
    id: "actions.save",
    defaultMessage: "Save",
  });

  return (
    <button type="button" aria-label={label}>
      {label}
    </button>
  );
};

// The imperative API is particularly useful for attributes such as aria-label and title,
// where a React element cannot be inserted directly.

// ---------------------------------------------------------------------
// 40. Formatted title attribute
// ---------------------------------------------------------------------

export const TitleAttributeExample: FC = (): ReactElement => {
  const intl = useIntl();

  return (
    <button
      type="button"
      title={intl.formatMessage({
        id: "actions.save",
        defaultMessage: "Save",
      })}
    >
      <FormattedMessage id="actions.save" defaultMessage="Save" />
    </button>
  );
};

// The same message can be rendered declaratively and formatted imperatively for an attribute.

// ---------------------------------------------------------------------
// 41. Formatting numbers imperatively
// ---------------------------------------------------------------------

export const ImperativeNumber: FC = (): ReactElement => {
  const intl = useIntl();

  const formatted = intl.formatNumber(1234567.89, {
    maximumFractionDigits: 2,
  });

  return <output>{formatted}</output>;
};

// Imperative formatting is useful when the formatted result must be stored or composed as text.

// ---------------------------------------------------------------------
// 42. Formatting dates imperatively
// ---------------------------------------------------------------------

export const ImperativeDate: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  const intl = useIntl();

  return (
    <time dateTime={date.toISOString()}>
      {intl.formatDate(date, {
        dateStyle: "medium",
      })}
    </time>
  );
};

// The semantic machine-readable value remains an ISO timestamp,
// while the visible representation is localized.

// ---------------------------------------------------------------------
// 43. Formatting relative time imperatively
// ---------------------------------------------------------------------

export const ImperativeRelativeTime: FC = (): ReactElement => {
  const intl = useIntl();

  return (
    <span>
      {intl.formatRelativeTime(-2, "day", {
        numeric: "auto",
      })}
    </span>
  );
};

// Imperative relative-time formatting is useful when the result participates in another API call.

// ---------------------------------------------------------------------
// 44. Formatting a list imperatively
// ---------------------------------------------------------------------

export const ImperativeList: FC = (): ReactElement => {
  const intl = useIntl();

  const formatted = intl.formatList(["Email", "Phone", "Chat"], { type: "conjunction" });

  return <p>{formatted}</p>;
};

// The imperative API exposes the same locale-sensitive ListFormat behavior as FormattedList.

// ---------------------------------------------------------------------
// 45. Formatting display names imperatively
// ---------------------------------------------------------------------

export const ImperativeDisplayName: FC = (): ReactElement => {
  const intl = useIntl();

  return (
    <span>
      {intl.formatDisplayName("EUR", {
        type: "currency",
      })}
    </span>
  );
};

// Display-name formatting can be used whenever the localized string is needed directly.

// ---------------------------------------------------------------------
// 46. formatToParts with useIntl
// ---------------------------------------------------------------------

export const ImperativeNumberParts: FC = (): ReactElement => {
  const intl = useIntl();

  const parts = intl.formatNumberToParts(1234567.89);

  return (
    <span>
      {parts.map((part, index) => (
        <span key={`${part.type}-${index}`}>{part.value}</span>
      ))}
    </span>
  );
};

// The imperative parts API enables customized rendering while preserving locale-specific formatting.

// ---------------------------------------------------------------------
// 47. Locale access
// ---------------------------------------------------------------------

export const CurrentLocale: FC = (): ReactElement => {
  const intl = useIntl();

  return <p>{intl.locale}</p>;
};

// The IntlShape exposes the locale currently associated with the provider.

// ---------------------------------------------------------------------
// 48. Locale and text direction
// ---------------------------------------------------------------------

const getDirection = (locale: SupportedLocale): "ltr" | "rtl" => {
  return locale === "ar" ? "rtl" : "ltr";
};

export const DirectionAwareContent: FC = (): ReactElement => {
  const intl = useIntl();
  const locale = intl.locale as SupportedLocale;

  return (
    <section lang={locale} dir={getDirection(locale)}>
      <FormattedMessage id="app.description" defaultMessage="This is an example localized application." />
    </section>
  );
};

// Locale-sensitive text direction is an interface concern and should be synchronized
// with the active locale when the supported languages require different directions.

// ---------------------------------------------------------------------
// 49. Language selector
// ---------------------------------------------------------------------

interface LanguageSelectorProps {
  readonly locale: SupportedLocale;
  readonly onLocaleChange: (locale: SupportedLocale) => void;
}

export const LanguageSelector: FC<LanguageSelectorProps> = ({ locale, onLocaleChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onLocaleChange(event.target.value as SupportedLocale);
  };

  return (
    <label>
      Language
      <select value={locale} onChange={handleChange}>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
};

// The provider locale is application state.
// Changing it causes the IntlProvider subtree to receive the new formatting context.

// ---------------------------------------------------------------------
// 50. Locale switching
// ---------------------------------------------------------------------

export const LocaleSwitcher: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);

  return (
    <TranslationProvider locale={locale}>
      <main lang={locale} dir={getDirection(locale)}>
        <LanguageSelector locale={locale} onLocaleChange={setLocale} />
        <BasicMessage />
      </main>
    </TranslationProvider>
  );
};

// Locale changes are represented by rendering IntlProvider with a different locale and message catalog.

// ---------------------------------------------------------------------
// 51. Locale-specific messages
// ---------------------------------------------------------------------

export const LocaleSpecificMessages: FC = (): ReactElement => {
  const intl = useIntl();

  const descriptor: MessageDescriptor = {
    id: "app.title",
    defaultMessage: "Example Application",
  };

  return <p>{intl.formatMessage(descriptor)}</p>;
};

// The same descriptor can produce different output depending on the active messages and locale.

// ---------------------------------------------------------------------
// 52. Message fallback
// ---------------------------------------------------------------------

export const MessageFallback: FC = (): ReactElement => {
  return <FormattedMessage id="app.missing" defaultMessage="Example fallback" />;
};

// React Intl attempts the translated message first and can fall back to defaultMessage
// when the translation is unavailable.

// ---------------------------------------------------------------------
// 53. defaultLocale
// ---------------------------------------------------------------------

export const DefaultLocaleExample: FC = (): ReactElement => {
  return (
    <IntlProvider locale="de" messages={{}} defaultLocale="en">
      <FormattedMessage id="app.fallback" defaultMessage="Welcome, {name}." values={{ name: "Example" }} />
    </IntlProvider>
  );
};

// defaultLocale identifies the locale in which defaultMessage values are written.
// This helps keep fallback formatting internally consistent.

// ---------------------------------------------------------------------
// 54. Missing-message error handling
// ---------------------------------------------------------------------

export const ErrorHandlingExample: FC = (): ReactElement => {
  return (
    <IntlProvider
      locale="en"
      messages={{}}
      onError={(error) => {
        console.error("React Intl error:", error);
      }}
    >
      <FormattedMessage id="app.missing" defaultMessage="Example fallback" />
    </IntlProvider>
  );
};

// onError allows an application to integrate React Intl diagnostics with its own logging system.

// ---------------------------------------------------------------------
// 55. Custom formats
// ---------------------------------------------------------------------

const formats = {
  number: {
    currency: {
      style: "currency" as const,
      currency: "USD",
    },
  },
  date: {
    short: {
      year: "numeric" as const,
      month: "short" as const,
      day: "numeric" as const,
    },
  },
};

export const CustomFormatsExample: FC = (): ReactElement => {
  return (
    <IntlProvider locale="en" messages={messages.en} formats={formats}>
      <p>
        <FormattedNumber value={1234.56} format="currency" />
      </p>
    </IntlProvider>
  );
};

// Named formats centralize repeated formatting configurations.

// ---------------------------------------------------------------------
// 56. Custom date format
// ---------------------------------------------------------------------

export const CustomDateFormat: FC<{
  readonly date: Date;
}> = ({ date }): ReactElement => {
  return (
    <IntlProvider locale="en" messages={messages.en} formats={formats}>
      <FormattedDate value={date} format="short" />
    </IntlProvider>
  );
};

// Named date formats can keep formatting conventions consistent across a feature or application.

// ---------------------------------------------------------------------
// 57. Rich text messages
// ---------------------------------------------------------------------

export const RichTextMessage: FC = (): ReactElement => {
  return (
    <FormattedMessage
      id="app.rich"
      defaultMessage="Read <strong>important</strong> information."
      values={{
        strong: (chunks) => <strong>{chunks}</strong>,
      }}
    />
  );
};

// ICU rich-text tags map to functions that return React nodes.
// The translated sentence controls where the markup appears.

// ---------------------------------------------------------------------
// 58. Rich text links
// ---------------------------------------------------------------------

export const RichLinkMessage: FC = (): ReactElement => {
  return (
    <FormattedMessage
      id="app.link"
      defaultMessage="Open the <link>products page</link>."
      values={{
        link: (chunks) => <a href="/products">{chunks}</a>,
      }}
    />
  );
};

// Translators can control the placement of the link text within the localized sentence.

// ---------------------------------------------------------------------
// 59. Rich text and React fragments
// ---------------------------------------------------------------------

export const RichFragmentMessage: FC = (): ReactElement => {
  return (
    <FormattedMessage
      id="app.rich.fragment"
      defaultMessage="This is <strong>important</strong>."
      values={{
        strong: (chunks) => <strong>{chunks}</strong>,
      }}
    />
  );
};

// Rich messages may produce multiple React nodes.
// The surrounding component should provide the appropriate semantic container when needed.

// ---------------------------------------------------------------------
// 60. defaultRichTextElements
// ---------------------------------------------------------------------

export const DefaultRichTextExample: FC = (): ReactElement => {
  return (
    <IntlProvider
      locale="en"
      messages={{
        "app.rich.default": "This is <strong>important</strong>.",
      }}
      defaultRichTextElements={{
        strong: (chunks) => <strong>{chunks}</strong>,
      }}
    >
      <FormattedMessage id="app.rich.default" defaultMessage="This is <strong>important</strong>." />
    </IntlProvider>
  );
};

// defaultRichTextElements can centralize common rich-text behavior such as design-system elements.

// ---------------------------------------------------------------------
// 61. Message extraction metadata
// ---------------------------------------------------------------------

const extractableMessage = defineMessage({
  id: "products.empty",
  defaultMessage: "No products found.",
  description: "Shown when the product list contains no results",
});

console.log(extractableMessage);

// Message descriptors can be consumed by FormatJS extraction tooling.
// Extraction is a build-time workflow, not a runtime translation mechanism.

// ---------------------------------------------------------------------
// 62. Message IDs should be stable
// ---------------------------------------------------------------------

const stableMessageId = "products.empty";

console.log(stableMessageId);

// IDs should represent stable message identity rather than translated wording.

// ---------------------------------------------------------------------
// 63. Avoid source-language message IDs
// ---------------------------------------------------------------------

const semanticMessageId = "actions.save";

console.log(semanticMessageId);

// Semantic IDs allow source text to change without requiring the identifier to change.

// ---------------------------------------------------------------------
// 64. Message catalogs by locale
// ---------------------------------------------------------------------

type MessageCatalog = Record<string, string>;

const catalogs: Record<SupportedLocale, MessageCatalog> = {
  en: messages.en,
  de: messages.de,
  fr: messages.fr,
  ar: messages.ar,
};

console.log(catalogs.de["app.title"]);

// Keeping catalogs separately by locale makes locale switching explicit.

// ---------------------------------------------------------------------
// 65. Locale provider with memoized catalog selection
// ---------------------------------------------------------------------

export const MemoizedTranslationProvider: FC<TranslationProviderProps> = ({ locale, children }): ReactElement => {
  const localeMessages = useMemo(() => catalogs[locale], [locale]);

  return (
    <IntlProvider locale={locale} messages={localeMessages} defaultLocale={DEFAULT_LOCALE}>
      {children}
    </IntlProvider>
  );
};

// The catalog selection is derived directly from the locale.
// Memoization can avoid recreating derived values when the locale is unchanged.

// ---------------------------------------------------------------------
// 66. createIntlCache
// ---------------------------------------------------------------------

const intlCache = createIntlCache();

console.log(intlCache);

// createIntlCache provides an in-memory cache for Intl constructors and related formatting data.

// ---------------------------------------------------------------------
// 67. createIntl
// ---------------------------------------------------------------------

const imperativeIntl = createIntl(
  {
    locale: "en",
    messages: messages.en,
    defaultLocale: DEFAULT_LOCALE,
  },
  intlCache,
);

console.log(imperativeIntl.formatNumber(1234567.89));

// createIntl creates an IntlShape without requiring React context.

// ---------------------------------------------------------------------
// 68. createIntl outside React
// ---------------------------------------------------------------------

const formatOutsideReact = (intl: IntlShape): string => {
  return intl.formatMessage({
    id: "app.title",
    defaultMessage: "Example Application",
  });
};

console.log(formatOutsideReact(imperativeIntl));

// createIntl is useful for non-React environments such as server code, tests, and utilities.

// ---------------------------------------------------------------------
// 69. Reusing the intl instance
// ---------------------------------------------------------------------

const reusableIntl = createIntl(
  {
    locale: "de",
    messages: messages.de,
    defaultLocale: DEFAULT_LOCALE,
  },
  intlCache,
);

const firstValue = reusableIntl.formatNumber(1000);
const secondValue = reusableIntl.formatDate(new Date("2026-09-01T00:00:00Z"));

console.log(firstValue);
console.log(secondValue);

// An IntlShape should be reused for a given locale and message configuration
// rather than recreated unnecessarily for every formatting operation.

// ---------------------------------------------------------------------
// 70. RawIntlProvider
// ---------------------------------------------------------------------

export const RawProviderExample: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const intl = createIntl(
    {
      locale: "en",
      messages: messages.en,
      defaultLocale: DEFAULT_LOCALE,
    },
    intlCache,
  );

  return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
};

// RawIntlProvider exposes an already-created IntlShape directly to the React tree.

// ---------------------------------------------------------------------
// 71. Formatting outside React for metadata
// ---------------------------------------------------------------------

const pageTitle = imperativeIntl.formatMessage({
  id: "app.title",
  defaultMessage: "Example Application",
});

console.log(pageTitle);

// Imperative formatting is appropriate for metadata and other values that are not rendered as React nodes.

// ---------------------------------------------------------------------
// 72. Formatting aria attributes outside JSX content
// ---------------------------------------------------------------------

export const ImperativeAccessibilityLabel: FC = (): ReactElement => {
  const intl = useIntl();

  const label = intl.formatMessage({
    id: "navigation.settings",
    defaultMessage: "Settings",
  });

  return (
    <button type="button" aria-label={label}>
      {label}
    </button>
  );
};

// Accessible names, titles, and similar attributes commonly require a string,
// making the imperative API appropriate.

// ---------------------------------------------------------------------
// 73. Locale-sensitive currency
// ---------------------------------------------------------------------

export const LocalizedCurrency: FC<{
  readonly amount: number;
  readonly currency: string;
}> = ({ amount, currency }): ReactElement => {
  const intl = useIntl();

  return (
    <span>
      {intl.formatNumber(amount, {
        style: "currency",
        currency,
      })}
    </span>
  );
};

// React Intl delegates currency formatting to the active locale and Intl.NumberFormat.

// ---------------------------------------------------------------------
// 74. Locale-sensitive list
// ---------------------------------------------------------------------

export const LocalizedList: FC<{
  readonly values: readonly string[];
}> = ({ values }): ReactElement => {
  const intl = useIntl();

  return (
    <span>
      {intl.formatList(values, {
        type: "conjunction",
      })}
    </span>
  );
};

// Joining localized lists manually with commas can produce incorrect grammar and punctuation.
// Intl.ListFormat handles those locale-specific conventions.

// ---------------------------------------------------------------------
// 75. Locale-sensitive display name
// ---------------------------------------------------------------------

export const LocalizedCurrencyName: FC<{
  readonly currency: string;
}> = ({ currency }): ReactElement => {
  const intl = useIntl();

  return (
    <span>
      {intl.formatDisplayName(currency, {
        type: "currency",
      })}
    </span>
  );
};

// Display-name formatting avoids maintaining translated names for standard language,
// region, script, and currency identifiers manually.

// ---------------------------------------------------------------------
// 76. Locale-sensitive relative activity
// ---------------------------------------------------------------------

export const RecentActivity: FC = (): ReactElement => {
  const intl = useIntl();

  return (
    <time>
      {intl.formatRelativeTime(-5, "minute", {
        numeric: "auto",
      })}
    </time>
  );
};

// Relative-time formatting keeps terms such as "yesterday" or equivalent localized forms
// under the control of the active locale.

// ---------------------------------------------------------------------
// 77. Translation provider composition
// ---------------------------------------------------------------------

export const LocalizedApplication: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en");

  return (
    <TranslationProvider locale={locale}>
      <main lang={locale} dir={getDirection(locale)}>
        <LanguageSelector locale={locale} onLocaleChange={setLocale} />

        <h1>
          <FormattedMessage id="app.title" defaultMessage="Example Application" />
        </h1>

        <WelcomeMessage name="Example" />

        <ItemCount count={3} />

        <p>
          <FormattedNumber value={1234.56} style="currency" currency="USD" />
        </p>

        <p>
          <FormattedDate value={new Date("2026-09-01T00:00:00Z")} dateStyle="medium" />
        </p>
      </main>
    </TranslationProvider>
  );
};

// A complete React Intl integration combines a locale state source,
// IntlProvider, translated messages, and locale-sensitive formatting components.

// ---------------------------------------------------------------------
// 78. Typed message descriptors
// ---------------------------------------------------------------------

const typedWelcomeMessage = defineMessage({
  id: "app.typed.welcome",
  defaultMessage: "Welcome, {name}.",
});

export const TypedDescriptorExample: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  return <FormattedMessage {...typedWelcomeMessage} values={{ name }} />;
};

// Keeping descriptors as constants allows message metadata and expected ICU arguments
// to remain associated with the message definition.

// ---------------------------------------------------------------------
// 79. React Intl architecture checklist
// ---------------------------------------------------------------------

const reactIntlPrinciples = [
  "Use IntlProvider to establish locale and message context.",
  "Use FormattedMessage for declarative localized messages.",
  "Use ICU Message Format for interpolation, selection, and pluralization.",
  "Use FormattedNumber, FormattedDate, and related components for locale-sensitive values.",
  "Use useIntl when a formatted string is needed imperatively inside a component.",
  "Use createIntl for formatting outside the React lifecycle.",
  "Use RawIntlProvider when supplying an explicitly created IntlShape.",
  "Keep message IDs stable and semantic.",
  "Provide defaultMessage values in the application's default locale.",
  "Use message descriptions to give translators contextual information.",
  "Use rich-text messages only when translated content genuinely needs structured elements.",
  "Keep locale, message catalogs, and text direction synchronized.",
  "Use Intl formatting rather than manually constructing localized numbers, dates, lists, or currencies.",
] as const;

console.log(reactIntlPrinciples);

// React Intl separates translated message content from locale-sensitive formatting,
// while React components provide a declarative interface to both.

// ---------------------------------------------------------------------
// 80. Default export
// ---------------------------------------------------------------------

export default LocalizedApplication;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React Intl integrates React with the ECMAScript Internationalization API and ICU Message Format.
// - IntlProvider supplies locale, messages, formatting configuration, and error handling to a React subtree.
// - FormattedMessage provides declarative localized message rendering.
// - MessageDescriptor values identify messages and provide default source text and translator context.
// - defineMessage and defineMessages keep message metadata close to application source code.
// - ICU interpolation preserves locale-specific sentence structure while inserting runtime values.
// - ICU plural, ordinal, and select syntax allows message behavior to vary by locale and runtime data.
// - FormattedNumber, FormattedDate, FormattedTime, FormattedRelativeTime, FormattedList, and FormattedDisplayName provide declarative locale-sensitive formatting.
// - FormattedNumberParts, FormattedDateParts, and FormattedListParts expose formatter output as semantic parts for custom rendering.
// - useIntl provides imperative formatting inside React components.
// - Imperative formatting is particularly useful for attributes such as aria-label and title.
// - createIntl creates an IntlShape for formatting outside React, while createIntlCache provides reusable formatter caching.
// - RawIntlProvider can expose an explicitly created IntlShape to a React subtree.
// - defaultMessage provides a fallback message and should normally be written in the application's default locale.
// - defaultLocale identifies the locale of defaultMessage values and helps keep fallback formatting coherent.
// - Message IDs should remain stable and should represent application concepts rather than source-language wording.
// - Rich-text messages can place React elements inside translated content through ICU tags and value callbacks.
// - Locale state should control the active message catalog, formatting behavior, language metadata, and text direction together.
// - React Intl should handle localization concerns while application components retain responsibility for semantic UI structure.

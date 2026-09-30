/**
 * Pluralization
 * =============
 *
 * Pluralization is the process of selecting language-specific message forms according to a numeric
 * value. The `Intl.PluralRules` API uses locale-aware plural categories such as `one`, `two`, `few`,
 * `many`, and `other`, allowing applications to choose grammatically appropriate messages without
 * hardcoding English-style singular and plural rules.
 *
 * Plural categories are defined by locale-specific rules from the Unicode CLDR data. The category
 * names are standardized, but their numeric ranges differ between languages. `Intl.PluralRules`
 * supports both cardinal values such as "1 item" and ordinal values such as "1st item".
 */

// ---------------------------------------------------------------------
// 1. Import React types and hooks
// ---------------------------------------------------------------------

import { useMemo, useState, type ChangeEvent, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 2. Define supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "fr-FR" | "de-DE" | "ar-EG";

const supportedLocales: readonly SupportedLocale[] = ["en-US", "fr-FR", "de-DE", "ar-EG"];

const localeLabels: Record<SupportedLocale, string> = {
  "en-US": "English (United States)",
  "fr-FR": "Français (France)",
  "de-DE": "Deutsch (Deutschland)",
  "ar-EG": "العربية (مصر)",
};

// Plural categories are locale-dependent, so applications should not assume that every locale
// has only "one" and "other" categories. CLDR defines categories such as zero, one, two, few,
// many, and other. "other" is the required general category. :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 3. Create basic plural rules
// ---------------------------------------------------------------------

const englishPluralRules = new Intl.PluralRules("en-US");

console.log(englishPluralRules.select(1));
console.log(englishPluralRules.select(2));

// `select()` returns the plural category for a number according to the configured locale.
// English cardinal rules return "one" for 1 and "other" for the remaining cardinal values.
// :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 4. Select the English singular category
// ---------------------------------------------------------------------

console.log(englishPluralRules.select(1));

// The category name "one" does not mean that every language uses it only for the numeric value 1.
// It represents the locale-specific form associated with that category. :contentReference[oaicite:2]{index=2}

// ---------------------------------------------------------------------
// 5. Select the English plural category
// ---------------------------------------------------------------------

console.log(englishPluralRules.select(2));
console.log(englishPluralRules.select(10));

// English uses "other" for these cardinal values.

// ---------------------------------------------------------------------
// 6. Handle zero in English
// ---------------------------------------------------------------------

console.log(englishPluralRules.select(0));

// English categorizes 0 as "other" for cardinal plural rules.

// ---------------------------------------------------------------------
// 7. Handle negative values
// ---------------------------------------------------------------------

console.log(englishPluralRules.select(-1));
console.log(englishPluralRules.select(-2));

// PluralRules accepts numeric values and applies the locale's plural-selection rules.

// ---------------------------------------------------------------------
// 8. Handle decimal values
// ---------------------------------------------------------------------

console.log(englishPluralRules.select(1.5));
console.log(englishPluralRules.select(2.5));

// Decimal values can participate in locale-specific plural rules.
// Applications should not assume that integer rules can simply be reused for fractions.

// ---------------------------------------------------------------------
// 9. Create French plural rules
// ---------------------------------------------------------------------

const frenchPluralRules = new Intl.PluralRules("fr-FR");

console.log(frenchPluralRules.select(0));
console.log(frenchPluralRules.select(1));
console.log(frenchPluralRules.select(2));

// French has plural behavior that differs from English.
// For example, CLDR places 0 and 1 in the "one" category for French cardinals. :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 10. Create German plural rules
// ---------------------------------------------------------------------

const germanPluralRules = new Intl.PluralRules("de-DE");

console.log(germanPluralRules.select(0));
console.log(germanPluralRules.select(1));
console.log(germanPluralRules.select(2));

// German uses "one" for 1 and "other" for the other cardinal values.

// ---------------------------------------------------------------------
// 11. Create Arabic plural rules
// ---------------------------------------------------------------------

const arabicPluralRules = new Intl.PluralRules("ar-EG");

console.log(arabicPluralRules.select(0));
console.log(arabicPluralRules.select(1));
console.log(arabicPluralRules.select(2));
console.log(arabicPluralRules.select(3));
console.log(arabicPluralRules.select(11));

// Arabic demonstrates why a generic singular/plural boolean is insufficient.
// Its cardinal rules can distinguish zero, one, two, few, many, and other. :contentReference[oaicite:4]{index=4}

// ---------------------------------------------------------------------
// 12. Define the plural category type
// ---------------------------------------------------------------------

type PluralCategory = Intl.LDMLPluralRule;

// `Intl.LDMLPluralRule` represents the standardized plural-category strings returned by
// Intl.PluralRules, including zero, one, two, few, many, and other.

// ---------------------------------------------------------------------
// 13. Define cardinal categories explicitly
// ---------------------------------------------------------------------

const cardinalCategories: readonly PluralCategory[] = ["zero", "one", "two", "few", "many", "other"];

// Not every locale uses every category.
// The runtime selects only categories relevant to the configured locale.

// ---------------------------------------------------------------------
// 14. Check whether a category is used
// ---------------------------------------------------------------------

const arabicCategories = arabicPluralRules.resolvedOptions().pluralCategories;

console.log(arabicCategories);

// `resolvedOptions().pluralCategories` exposes the plural categories used by the formatter.
// The exact list depends on the locale and plural-rule type.

// ---------------------------------------------------------------------
// 15. Use a plural category to select a message
// ---------------------------------------------------------------------

const englishMessages: Record<"one" | "other", string> = {
  one: "1 item",
  other: "{count} items",
};

const count = 3;
const category = englishPluralRules.select(count);

const englishMessage = englishMessages[category];

console.log(englishMessage.replace("{count}", String(count)));

// PluralRules chooses the category; application code maps that category to localized message text.

// ---------------------------------------------------------------------
// 16. Create a reusable English pluralizer
// ---------------------------------------------------------------------

const formatEnglishItems = (itemCount: number): string => {
  const category = englishPluralRules.select(itemCount);
  const message = englishMessages[category];

  return message.replace("{count}", String(itemCount));
};

console.log(formatEnglishItems(1));
console.log(formatEnglishItems(5));

// The number itself remains numeric until the final message is created.

// ---------------------------------------------------------------------
// 17. Use a category-keyed message resource
// ---------------------------------------------------------------------

interface EnglishItemMessages {
  readonly one: string;
  readonly other: string;
}

const itemMessages: EnglishItemMessages = {
  one: "{count} item",
  other: "{count} items",
};

console.log(itemMessages.one);
console.log(itemMessages.other);

// Typed message resources make the supported plural forms explicit.

// ---------------------------------------------------------------------
// 18. Resolve a message from a plural category
// ---------------------------------------------------------------------

const resolveItemMessage = (itemCount: number, messages: EnglishItemMessages): string => {
  const category = englishPluralRules.select(itemCount);
  return messages[category].replace("{count}", String(itemCount));
};

console.log(resolveItemMessage(1, itemMessages));
console.log(resolveItemMessage(4, itemMessages));

// Message resolution is separate from plural-rule selection.

// ---------------------------------------------------------------------
// 19. Do not use a boolean singular check
// ---------------------------------------------------------------------

const incorrectSingularCheck = (itemCount: number): string => {
  return itemCount === 1 ? `${itemCount} item` : `${itemCount} items`;
};

console.log(incorrectSingularCheck(1));
console.log(incorrectSingularCheck(2));

// This may work for simple English messages but does not generalize to other locales.

// ---------------------------------------------------------------------
// 20. Use Intl.PluralRules instead of language assumptions
// ---------------------------------------------------------------------

const formatLocalizedItemCount = (locale: SupportedLocale, itemCount: number): string => {
  const rules = new Intl.PluralRules(locale);
  const category = rules.select(itemCount);

  if (locale === "en-US" || locale === "de-DE") {
    const messages: Record<"one" | "other", string> = {
      one: "{count} item",
      other: "{count} items",
    };

    return messages[category as "one" | "other"].replace("{count}", String(itemCount));
  }

  if (locale === "fr-FR") {
    const messages: Record<"one" | "other", string> = {
      one: "{count} article",
      other: "{count} articles",
    };

    return messages[category as "one" | "other"].replace("{count}", String(itemCount));
  }

  return String(itemCount);
};

// The plural rule must be paired with message resources written for the same locale.

// ---------------------------------------------------------------------
// 21. Keep message resources locale-specific
// ---------------------------------------------------------------------

interface MessageResource {
  readonly one: string;
  readonly other: string;
}

const localizedItemMessages: Record<"en-US" | "de-DE" | "fr-FR", MessageResource> = {
  "en-US": {
    one: "{count} item",
    other: "{count} items",
  },
  "de-DE": {
    one: "{count} Artikel",
    other: "{count} Artikel",
  },
  "fr-FR": {
    one: "{count} article",
    other: "{count} articles",
  },
};

// The message wording belongs to the locale's translation resource, not to the plural algorithm.

// ---------------------------------------------------------------------
// 22. Use plural categories as resource keys
// ---------------------------------------------------------------------

interface EnglishNotificationMessages {
  readonly one: string;
  readonly other: string;
}

const notificationMessages: EnglishNotificationMessages = {
  one: "You have {count} notification.",
  other: "You have {count} notifications.",
};

const notificationCount = 5;
const notificationCategory = englishPluralRules.select(notificationCount);

console.log(notificationMessages[notificationCategory as keyof EnglishNotificationMessages]);

// Category keys connect the locale-aware rule to the corresponding translation.

// ---------------------------------------------------------------------
// 23. Replace a count placeholder
// ---------------------------------------------------------------------

const interpolateCount = (message: string, itemCount: number): string => {
  return message.replace("{count}", String(itemCount));
};

console.log(interpolateCount("You have {count} items.", 5));

// Interpolation inserts the numeric value into the already selected localized message.

// ---------------------------------------------------------------------
// 24. Keep interpolation separate from plural selection
// ---------------------------------------------------------------------

const formatNotification = (notificationCountValue: number): string => {
  const category = englishPluralRules.select(notificationCountValue);
  const message = notificationMessages[category];

  return interpolateCount(message, notificationCountValue);
};

console.log(formatNotification(1));
console.log(formatNotification(5));

// Separating selection and interpolation makes each operation easier to test and reuse.

// ---------------------------------------------------------------------
// 25. Support zero explicitly
// ---------------------------------------------------------------------

type EnglishExtendedCategory = "one" | "other";

const englishZeroMessages: Record<EnglishExtendedCategory, string> = {
  one: "{count} item",
  other: "No items or {count} items",
};

console.log(interpolateCount(englishZeroMessages[englishPluralRules.select(0)], 0));

// English's plural rules do not provide a distinct "zero" category.
// A product-specific zero message can still be handled before or after plural selection.

// ---------------------------------------------------------------------
// 26. Prefer explicit zero messaging when the product requires it
// ---------------------------------------------------------------------

const formatMessagesWithZero = (itemCount: number): string => {
  if (itemCount === 0) {
    return "No items";
  }

  const category = englishPluralRules.select(itemCount);
  const message = itemMessages[category];

  return interpolateCount(message, itemCount);
};

console.log(formatMessagesWithZero(0));
console.log(formatMessagesWithZero(1));
console.log(formatMessagesWithZero(2));

// A zero message is a product-language decision, while Intl.PluralRules determines grammatical
// plural categories.

// ---------------------------------------------------------------------
// 27. Understand cardinal pluralization
// ---------------------------------------------------------------------

const cardinalRules = new Intl.PluralRules("en-US", {
  type: "cardinal",
});

console.log(cardinalRules.select(1));
console.log(cardinalRules.select(2));

// Cardinal pluralization describes quantities such as "1 file" and "2 files".
// Cardinal is the default `Intl.PluralRules` type. :contentReference[oaicite:5]{index=5}

// ---------------------------------------------------------------------
// 28. Explicitly select ordinal rules
// ---------------------------------------------------------------------

const ordinalRules = new Intl.PluralRules("en-US", {
  type: "ordinal",
});

console.log(ordinalRules.select(1));
console.log(ordinalRules.select(2));
console.log(ordinalRules.select(3));
console.log(ordinalRules.select(4));

// Ordinal rules describe positions such as 1st, 2nd, 3rd, and 4th.
// Cardinal and ordinal rules are different rule systems.

// ---------------------------------------------------------------------
// 29. Format English ordinal messages
// ---------------------------------------------------------------------

const englishOrdinalMessages: Record<PluralCategory, string> = {
  one: "{count}st",
  two: "{count}nd",
  few: "{count}rd",
  other: "{count}th",
  zero: "{count}th",
  many: "{count}th",
};

const formatEnglishOrdinal = (ordinalValue: number): string => {
  const category = ordinalRules.select(ordinalValue);
  return interpolateCount(englishOrdinalMessages[category], ordinalValue);
};

console.log(formatEnglishOrdinal(1));
console.log(formatEnglishOrdinal(2));
console.log(formatEnglishOrdinal(3));
console.log(formatEnglishOrdinal(4));

// The ordinal categories are not interchangeable with cardinal categories.

// ---------------------------------------------------------------------
// 30. Compare cardinal and ordinal selection
// ---------------------------------------------------------------------

console.log(cardinalRules.select(1));
console.log(ordinalRules.select(1));

console.log(cardinalRules.select(2));
console.log(ordinalRules.select(2));

// The same number can belong to different categories depending on the rule type.

// ---------------------------------------------------------------------
// 31. Use ordinal rules in a ranking message
// ---------------------------------------------------------------------

const rankingMessages: Record<PluralCategory, string> = {
  one: "{count}st place",
  two: "{count}nd place",
  few: "{count}rd place",
  other: "{count}th place",
  zero: "{count}th place",
  many: "{count}th place",
};

const formatRanking = (position: number): string => {
  const category = ordinalRules.select(position);
  return interpolateCount(rankingMessages[category], position);
};

console.log(formatRanking(1));
console.log(formatRanking(2));
console.log(formatRanking(3));
console.log(formatRanking(11));

// Ordinal resources must reflect the grammatical conventions of the target locale.

// ---------------------------------------------------------------------
// 32. Use Arabic cardinal categories
// ---------------------------------------------------------------------

const arabicCategoryExamples = [0, 1, 2, 3, 11, 100] as const;

for (const value of arabicCategoryExamples) {
  console.log(value, arabicPluralRules.select(value));
}

// Arabic demonstrates why translation systems need more than singular/plural branching.
// :contentReference[oaicite:6]{index=6}

// ---------------------------------------------------------------------
// 33. Create Arabic plural resources
// ---------------------------------------------------------------------

interface ArabicCountMessages {
  readonly zero: string;
  readonly one: string;
  readonly two: string;
  readonly few: string;
  readonly many: string;
  readonly other: string;
}

const arabicCountMessages: ArabicCountMessages = {
  zero: "{count} عناصر",
  one: "عنصر واحد",
  two: "عنصران",
  few: "{count} عناصر",
  many: "{count} عنصرًا",
  other: "{count} عنصر",
};

// The example demonstrates the resource shape required when a locale distinguishes several
// plural categories. Exact wording should come from professionally maintained translations.

// ---------------------------------------------------------------------
// 34. Resolve an Arabic plural category
// ---------------------------------------------------------------------

const resolveArabicCategory = (value: number): PluralCategory => {
  return arabicPluralRules.select(value);
};

console.log(resolveArabicCategory(0));
console.log(resolveArabicCategory(1));
console.log(resolveArabicCategory(2));
console.log(resolveArabicCategory(3));

// The runtime supplies the category; the translation resource supplies the localized wording.

// ---------------------------------------------------------------------
// 35. Use a complete plural resource
// ---------------------------------------------------------------------

const formatArabicCount = (value: number): string => {
  const category = arabicPluralRules.select(value);
  const message = arabicCountMessages[category];

  return interpolateCount(message, value);
};

console.log(formatArabicCount(0));
console.log(formatArabicCount(1));
console.log(formatArabicCount(2));
console.log(formatArabicCount(5));

// Every category used by the locale should have an appropriate localized message.

// ---------------------------------------------------------------------
// 36. Understand that "other" is always available
// ---------------------------------------------------------------------

const fallbackMessages: Record<PluralCategory, string> = {
  zero: "{count} items",
  one: "{count} item",
  two: "{count} items",
  few: "{count} items",
  many: "{count} items",
  other: "{count} items",
};

const fallbackCategory = englishPluralRules.select(100);

console.log(fallbackMessages[fallbackCategory]);

// "other" is the required general plural category in CLDR.
// :contentReference[oaicite:7]{index=7}

// ---------------------------------------------------------------------
// 37. Do not assume category names describe exact numbers
// ---------------------------------------------------------------------

const frenchExamples = [0, 1, 2, 21] as const;

for (const value of frenchExamples) {
  console.log(value, frenchPluralRules.select(value));
}

// A category such as "one" is a grammatical category, not simply an alias for `value === 1`.
// :contentReference[oaicite:8]{index=8}

// ---------------------------------------------------------------------
// 38. Test a plural-rule boundary
// ---------------------------------------------------------------------

const englishBoundaryValues = [0, 1, 2, 10, 11, 21] as const;

for (const value of englishBoundaryValues) {
  console.log(value, englishPluralRules.select(value));
}

// Boundary tests help reveal assumptions that would otherwise remain hidden in hardcoded rules.

// ---------------------------------------------------------------------
// 39. Test fractional values
// ---------------------------------------------------------------------

const fractionalValues = [1, 1.0, 1.1, 2.0, 2.1] as const;

for (const value of fractionalValues) {
  console.log(value, englishPluralRules.select(value));
}

// Fractional plural behavior is locale-dependent and should not be inferred from integer behavior.
// CLDR explicitly accounts for differences involving fractions. :contentReference[oaicite:9]{index=9}

// ---------------------------------------------------------------------
// 40. Use minimumFractionDigits in plural rules
// ---------------------------------------------------------------------

const decimalPluralRules = new Intl.PluralRules("en-US", {
  minimumFractionDigits: 2,
});

console.log(decimalPluralRules.select(1));
console.log(decimalPluralRules.select(1.1));
console.log(decimalPluralRules.select(1.11));

// PluralRules accepts Intl.NumberFormat-style digit options that can affect how a number is
// considered by the plural-rule selection.

// ---------------------------------------------------------------------
// 41. Inspect plural-rule options
// ---------------------------------------------------------------------

console.log(decimalPluralRules.resolvedOptions());

// resolvedOptions() exposes the effective locale, type, categories, and relevant numeric options.

// ---------------------------------------------------------------------
// 42. Use locale fallback
// ---------------------------------------------------------------------

const fallbackRules = new Intl.PluralRules(["fr-CA", "fr-FR", "en-US"]);

console.log(fallbackRules.resolvedOptions().locale);

// Intl can negotiate among a list of requested locales.

// ---------------------------------------------------------------------
// 43. Use Intl.Locale with PluralRules
// ---------------------------------------------------------------------

const germanLocale = new Intl.Locale("de-DE");
const germanLocaleRules = new Intl.PluralRules(germanLocale);

console.log(germanLocaleRules.select(1));
console.log(germanLocaleRules.select(2));

// An Intl.Locale object can be passed to the PluralRules constructor.

// ---------------------------------------------------------------------
// 44. Inspect supported plural-rule locales
// ---------------------------------------------------------------------

const supportedPluralLocales = Intl.PluralRules.supportedLocalesOf(["en-US", "fr-FR", "de-DE", "ar-EG"]);

console.log(supportedPluralLocales);

// supportedLocalesOf() identifies requested locales supported by the implementation.

// ---------------------------------------------------------------------
// 45. Create a reusable plural-rule factory
// ---------------------------------------------------------------------

const createPluralRules = (locale: SupportedLocale, type: "cardinal" | "ordinal" = "cardinal"): Intl.PluralRules => {
  return new Intl.PluralRules(locale, { type });
};

console.log(createPluralRules("en-US").select(1));
console.log(createPluralRules("en-US", "ordinal").select(1));

// A factory centralizes construction while keeping locale and rule type explicit.

// ---------------------------------------------------------------------
// 46. Create a reusable message resolver
// ---------------------------------------------------------------------

const resolvePluralMessage = (
  rules: Intl.PluralRules,
  value: number,
  messages: Record<PluralCategory, string>,
): string => {
  const category = rules.select(value);
  return interpolateCount(messages[category], value);
};

console.log(resolvePluralMessage(englishPluralRules, 1, fallbackMessages));

console.log(resolvePluralMessage(englishPluralRules, 5, fallbackMessages));

// Selection and interpolation can be encapsulated in a reusable utility.

// ---------------------------------------------------------------------
// 47. Keep resources immutable
// ---------------------------------------------------------------------

const immutableEnglishMessages = {
  one: "{count} item",
  other: "{count} items",
} as const;

console.log(immutableEnglishMessages);

// `as const` preserves the literal keys and values of a translation resource.

// ---------------------------------------------------------------------
// 48. Type a locale resource
// ---------------------------------------------------------------------

type EnglishPluralMessages = {
  readonly one: string;
  readonly other: string;
};

const typedEnglishMessages: EnglishPluralMessages = {
  one: "{count} item",
  other: "{count} items",
};

console.log(typedEnglishMessages);

// Explicit types document which plural categories the resource intentionally supports.

// ---------------------------------------------------------------------
// 49. Avoid incomplete resources for multi-form locales
// ---------------------------------------------------------------------

const arabicCategoryList = arabicPluralRules.resolvedOptions().pluralCategories;

console.log(arabicCategoryList);

// A resource for Arabic should account for the categories actually used by its plural rules,
// rather than assuming that "one" and "other" are sufficient.

// ---------------------------------------------------------------------
// 50. Build a generic pluralized message component
// ---------------------------------------------------------------------

interface PluralizedMessageProps {
  readonly locale: SupportedLocale;
  readonly count: number;
  readonly messages: Record<PluralCategory, string>;
}

const PluralizedMessage: FC<PluralizedMessageProps> = ({ locale, count: messageCount, messages }): ReactElement => {
  const rules = useMemo(() => new Intl.PluralRules(locale), [locale]);

  const category = rules.select(messageCount);
  const message = messages[category];

  return <span>{interpolateCount(message, messageCount)}</span>;
};

// The component keeps plural-rule selection inside the presentation layer.

// ---------------------------------------------------------------------
// 51. Build an English item component
// ---------------------------------------------------------------------

interface EnglishItemCountProps {
  readonly count: number;
}

const EnglishItemCount: FC<EnglishItemCountProps> = ({ count: itemCount }): ReactElement => {
  const rules = useMemo(() => new Intl.PluralRules("en-US"), []);

  const category = rules.select(itemCount);

  const messages: Record<"one" | "other", string> = {
    one: "{count} item",
    other: "{count} items",
  };

  return <span>{interpolateCount(messages[category as "one" | "other"], itemCount)}</span>;
};

// A locale-specific component can use the smallest resource shape necessary for that locale.

// ---------------------------------------------------------------------
// 52. Build a localized notification component
// ---------------------------------------------------------------------

interface LocalizedNotificationCountProps {
  readonly locale: SupportedLocale;
  readonly count: number;
}

const LocalizedNotificationCount: FC<LocalizedNotificationCountProps> = ({
  locale,
  count: notificationCountValue,
}): ReactElement => {
  const rules = useMemo(() => new Intl.PluralRules(locale), [locale]);

  const category = rules.select(notificationCountValue);

  if (locale === "en-US") {
    const messages: Record<"one" | "other", string> = {
      one: "You have {count} notification.",
      other: "You have {count} notifications.",
    };

    return <span>{interpolateCount(messages[category as "one" | "other"], notificationCountValue)}</span>;
  }

  return <span>{notificationCountValue}</span>;
};

// In a real application, locale-specific resources should normally be loaded from translation
// resources rather than embedded directly in a component.

// ---------------------------------------------------------------------
// 53. Keep pluralization out of numeric formatting
// ---------------------------------------------------------------------

const countFormatter = new Intl.NumberFormat("en-US");

const formattedCount = countFormatter.format(1234567);
const countCategory = englishPluralRules.select(1234567);

console.log(formattedCount);
console.log(countCategory);

// NumberFormat formats the number.
// PluralRules determines the grammatical category.

// ---------------------------------------------------------------------
// 54. Combine NumberFormat and PluralRules
// ---------------------------------------------------------------------

const formatLocalizedCount = (locale: SupportedLocale, value: number): string => {
  const numberFormatter = new Intl.NumberFormat(locale);
  const pluralRules = new Intl.PluralRules(locale);
  const category = pluralRules.select(value);

  if (category === "one") {
    return `${numberFormatter.format(value)} item`;
  }

  return `${numberFormatter.format(value)} items`;
};

console.log(formatLocalizedCount("en-US", 1234));
console.log(formatLocalizedCount("en-US", 1234567));

// Number formatting and plural selection solve different parts of the localization problem.

// ---------------------------------------------------------------------
// 55. Format the number before interpolation
// ---------------------------------------------------------------------

const localizedNumber = new Intl.NumberFormat("en-US").format(1234567);
const localizedCategory = englishPluralRules.select(1234567);

console.log(localizedNumber);
console.log(localizedCategory);

// The number can be localized separately from the message's grammatical form.

// ---------------------------------------------------------------------
// 56. Do not use a formatted string for plural selection
// ---------------------------------------------------------------------

const rawCount = 1234567;
const formattedCountForDisplay = new Intl.NumberFormat("de-DE").format(rawCount);

console.log(rawCount);
console.log(formattedCountForDisplay);
console.log(germanPluralRules.select(rawCount));

// PluralRules expects the numeric value.
// A localized string such as "1.234.567" is presentation output, not the plural-selection input.

// ---------------------------------------------------------------------
// 57. Support pluralized units
// ---------------------------------------------------------------------

const hourRules = new Intl.PluralRules("en-US");

const formatHours = (hours: number): string => {
  const category = hourRules.select(hours);
  const unit = category === "one" ? "hour" : "hours";

  return `${hours} ${unit}`;
};

console.log(formatHours(1));
console.log(formatHours(3));

// CLDR plural categories are also used for localized units such as hours.
// :contentReference[oaicite:10]{index=10}

// ---------------------------------------------------------------------
// 58. Do not manually add "s" in a multilingual application
// ---------------------------------------------------------------------

const englishOnlyHours = (hours: number): string => {
  return hours === 1 ? `${hours} hour` : `${hours} hours`;
};

console.log(englishOnlyHours(1));
console.log(englishOnlyHours(2));

// This is acceptable for intentionally English-only code but does not generalize to other languages.

// ---------------------------------------------------------------------
// 59. Use a plural resource for units
// ---------------------------------------------------------------------

const hourMessages: Record<"one" | "other", string> = {
  one: "{count} hour",
  other: "{count} hours",
};

const formatHoursFromResource = (hours: number): string => {
  const category = hourRules.select(hours);
  return interpolateCount(hourMessages[category as "one" | "other"], hours);
};

console.log(formatHoursFromResource(1));
console.log(formatHoursFromResource(5));

// Resource-driven pluralization is easier to translate than hardcoded string concatenation.

// ---------------------------------------------------------------------
// 60. Use pluralization for UI labels
// ---------------------------------------------------------------------

const fileMessages: Record<"one" | "other", string> = {
  one: "{count} file",
  other: "{count} files",
};

const formatFiles = (fileCount: number): string => {
  const category = englishPluralRules.select(fileCount);

  return interpolateCount(fileMessages[category as "one" | "other"], fileCount);
};

console.log(formatFiles(1));
console.log(formatFiles(8));

// The same pattern works for many count-based UI messages.

// ---------------------------------------------------------------------
// 61. Use pluralization for search results
// ---------------------------------------------------------------------

const searchResultMessages: Record<"one" | "other", string> = {
  one: "{count} result",
  other: "{count} results",
};

const formatSearchResults = (resultCount: number): string => {
  const category = englishPluralRules.select(resultCount);

  return interpolateCount(searchResultMessages[category as "one" | "other"], resultCount);
};

console.log(formatSearchResults(1));
console.log(formatSearchResults(20));

// Pluralization should describe the grammatical message, not just alter a noun mechanically.

// ---------------------------------------------------------------------
// 62. Use pluralization for cart items
// ---------------------------------------------------------------------

const cartMessages: Record<"one" | "other", string> = {
  one: "{count} item in your cart",
  other: "{count} items in your cart",
};

const formatCartCount = (cartCount: number): string => {
  const category = englishPluralRules.select(cartCount);

  return interpolateCount(cartMessages[category as "one" | "other"], cartCount);
};

console.log(formatCartCount(1));
console.log(formatCartCount(4));

// Complete phrases can be pluralized rather than modifying only a noun.

// ---------------------------------------------------------------------
// 63. Use pluralization for comments
// ---------------------------------------------------------------------

const commentMessages: Record<"one" | "other", string> = {
  one: "{count} comment",
  other: "{count} comments",
};

const formatCommentCount = (commentCount: number): string => {
  const category = englishPluralRules.select(commentCount);

  return interpolateCount(commentMessages[category as "one" | "other"], commentCount);
};

console.log(formatCommentCount(1));
console.log(formatCommentCount(12));

// Translation resources can contain complete messages rather than isolated word fragments.

// ---------------------------------------------------------------------
// 64. Keep messages semantically complete
// ---------------------------------------------------------------------

const completeMessages: Record<"one" | "other", string> = {
  one: "There is {count} message.",
  other: "There are {count} messages.",
};

const formatCompleteMessage = (messageCountValue: number): string => {
  const category = englishPluralRules.select(messageCountValue);

  return interpolateCount(completeMessages[category as "one" | "other"], messageCountValue);
};

console.log(formatCompleteMessage(1));
console.log(formatCompleteMessage(4));

// Translators may need to change more than the noun when a number changes.

// ---------------------------------------------------------------------
// 65. Do not assume noun-only changes
// ---------------------------------------------------------------------

const nounOnlyMessages: Record<"one" | "other", string> = {
  one: "{count} user is online.",
  other: "{count} users are online.",
};

console.log(nounOnlyMessages.one);
console.log(nounOnlyMessages.other);

// A plural form may require changes to verbs, pronouns, adjectives, or other parts of a sentence.
// CLDR uses minimal pairs to identify these required grammatical changes. :contentReference[oaicite:11]{index=11}

// ---------------------------------------------------------------------
// 66. Test plural resources by category
// ---------------------------------------------------------------------

const testPluralResource = (
  rules: Intl.PluralRules,
  messages: Record<PluralCategory, string>,
  values: readonly number[],
): void => {
  for (const value of values) {
    const category = rules.select(value);
    console.log(value, category, interpolateCount(messages[category], value));
  }
};

testPluralResource(englishPluralRules, fallbackMessages, [0, 1, 2, 5]);

// Testing representative category boundaries helps verify translation resources.

// ---------------------------------------------------------------------
// 67. Test every category reported by the runtime
// ---------------------------------------------------------------------

const testSupportedCategories = (rules: Intl.PluralRules, messages: Record<PluralCategory, string>): void => {
  for (const category of rules.resolvedOptions().pluralCategories) {
    console.log(category, messages[category]);
  }
};

testSupportedCategories(arabicPluralRules, arabicCountMessages);

// This checks that every category exposed by the configured locale has a corresponding message.

// ---------------------------------------------------------------------
// 68. Select a plural category for a range
// ---------------------------------------------------------------------

const englishRangeRules = new Intl.PluralRules("en-US");

console.log(englishRangeRules.selectRange(1, 3));
console.log(englishRangeRules.selectRange(5, 10));

// `selectRange()` returns the plural category appropriate for a numeric range.
// It is distinct from selecting the category of either endpoint independently. :contentReference[oaicite:12]{index=12}

// ---------------------------------------------------------------------
// 69. Create a range message
// ---------------------------------------------------------------------

const rangeMessages: Record<PluralCategory, string> = {
  zero: "{start}–{end} items",
  one: "{start}–{end} item",
  two: "{start}–{end} items",
  few: "{start}–{end} items",
  many: "{start}–{end} items",
  other: "{start}–{end} items",
};

const formatRangeMessage = (start: number, end: number): string => {
  const category = englishRangeRules.selectRange(start, end);
  const message = rangeMessages[category];

  return message.replace("{start}", String(start)).replace("{end}", String(end));
};

console.log(formatRangeMessage(1, 3));
console.log(formatRangeMessage(5, 10));

// Range pluralization is useful when a message describes a numeric interval.

// ---------------------------------------------------------------------
// 70. Keep range selection separate from range formatting
// ---------------------------------------------------------------------

const rangeNumberFormatter = new Intl.NumberFormat("en-US");

const rangeStart = 1;
const rangeEnd = 10;
const rangeCategory = englishRangeRules.selectRange(rangeStart, rangeEnd);

console.log(rangeNumberFormatter.format(rangeStart));
console.log(rangeNumberFormatter.format(rangeEnd));
console.log(rangeCategory);

// NumberFormat formats the endpoints while PluralRules selects the grammatical range category.

// ---------------------------------------------------------------------
// 71. Memoize PluralRules in React
// ---------------------------------------------------------------------

interface PluralRuleDisplayProps {
  readonly locale: SupportedLocale;
  readonly count: number;
}

const PluralRuleDisplay: FC<PluralRuleDisplayProps> = ({ locale, count }): ReactElement => {
  const rules = useMemo(() => new Intl.PluralRules(locale), [locale]);

  return <output>{rules.select(count)}</output>;
};

// The formatter depends on the locale, so the locale belongs in the memoization dependency list.

// ---------------------------------------------------------------------
// 72. Build a localized count component
// ---------------------------------------------------------------------

interface LocalizedCountProps {
  readonly locale: SupportedLocale;
  readonly count: number;
  readonly messages: Record<PluralCategory, string>;
}

const LocalizedCount: FC<LocalizedCountProps> = ({ locale, count, messages }): ReactElement => {
  const rules = useMemo(() => new Intl.PluralRules(locale), [locale]);

  const category = rules.select(count);

  return <output>{interpolateCount(messages[category], count)}</output>;
};

// The count remains numeric while PluralRules determines the message category.

// ---------------------------------------------------------------------
// 73. Build a locale selector
// ---------------------------------------------------------------------

interface PluralLocaleSelectorProps {
  readonly locale: SupportedLocale;
  readonly onChange: (locale: SupportedLocale) => void;
}

const PluralLocaleSelector: FC<PluralLocaleSelectorProps> = ({ locale, onChange }): ReactElement => {
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

// A locale selector can change the plural rules and the corresponding translation resources.

// ---------------------------------------------------------------------
// 74. Define application messages by locale
// ---------------------------------------------------------------------

interface ApplicationPluralMessages {
  readonly one: string;
  readonly other: string;
}

const applicationPluralMessages: Record<"en-US" | "de-DE" | "fr-FR", ApplicationPluralMessages> = {
  "en-US": {
    one: "{count} item",
    other: "{count} items",
  },
  "de-DE": {
    one: "{count} Artikel",
    other: "{count} Artikel",
  },
  "fr-FR": {
    one: "{count} article",
    other: "{count} articles",
  },
};

// Translation resources should be organized around the locale and its actual plural categories.

// ---------------------------------------------------------------------
// 75. Resolve application messages
// ---------------------------------------------------------------------

const formatApplicationCount = (locale: "en-US" | "de-DE" | "fr-FR", countValue: number): string => {
  const rules = new Intl.PluralRules(locale);
  const category = rules.select(countValue);
  const messages = applicationPluralMessages[locale];

  return interpolateCount(messages[category as "one" | "other"], countValue);
};

console.log(formatApplicationCount("en-US", 1));
console.log(formatApplicationCount("de-DE", 2));
console.log(formatApplicationCount("fr-FR", 5));

// The locale selects both the plural rule and the corresponding translation resource.

// ---------------------------------------------------------------------
// 76. Build an integrated pluralization example
// ---------------------------------------------------------------------

const PluralizationExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [count, setCount] = useState(1);

  const rules = useMemo(() => new Intl.PluralRules(locale), [locale]);

  const category = rules.select(count);

  const messages: Record<SupportedLocale, Partial<Record<PluralCategory, string>>> = {
    "en-US": {
      one: "You have {count} notification.",
      other: "You have {count} notifications.",
    },
    "de-DE": {
      one: "Du hast {count} Benachrichtigung.",
      other: "Du hast {count} Benachrichtigungen.",
    },
    "fr-FR": {
      one: "Vous avez {count} notification.",
      other: "Vous avez {count} notifications.",
    },
    "ar-EG": {
      zero: "لا توجد إشعارات",
      one: "لديك إشعار واحد",
      two: "لديك إشعاران",
      few: "لديك {count} إشعارات",
      many: "لديك {count} إشعارًا",
      other: "لديك {count} إشعار",
    },
  };

  const selectedMessage = messages[locale][category] ?? messages[locale].other ?? "Localized message unavailable.";

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  const handleCountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextCount = Number(event.target.value);

    if (Number.isFinite(nextCount) && nextCount >= 0) {
      setCount(nextCount);
    }
  };

  return (
    <main>
      <h2>Pluralization</h2>

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
        Count
        <input type="number" min="0" value={count} onChange={handleCountChange} />
      </label>

      <dl>
        <dt>Plural category</dt>
        <dd>{category}</dd>

        <dt>Message</dt>
        <dd>{interpolateCount(selectedMessage, count)}</dd>
      </dl>
    </main>
  );
};

// The integrated example demonstrates the complete flow:
// numeric value → locale-specific plural category → locale-specific message → interpolation.

// ---------------------------------------------------------------------
// 77. Handle missing resource categories
// ---------------------------------------------------------------------

const resolveWithFallback = (
  rules: Intl.PluralRules,
  value: number,
  messages: Partial<Record<PluralCategory, string>>,
): string => {
  const category = rules.select(value);

  return messages[category] ?? messages.other ?? "Localized message unavailable.";
};

console.log(
  resolveWithFallback(englishPluralRules, 5, {
    one: "{count} item",
    other: "{count} items",
  }),
);

// Fallback handling prevents an undefined message when an incomplete resource is encountered.
// Production systems should validate translation resources rather than silently hiding missing forms.

// ---------------------------------------------------------------------
// 78. Understand the pluralization pipeline
// ---------------------------------------------------------------------

// 1. Keep the original numeric value.
// 2. Determine the active locale.
// 3. Create or reuse Intl.PluralRules for that locale.
// 4. Select the plural category.
// 5. Look up the corresponding translated message.
// 6. Format the number for display when necessary.
// 7. Interpolate the formatted value into the message.
//
// Pluralization determines grammatical form; number formatting determines numeric presentation.

// ---------------------------------------------------------------------
// 79. Keep pluralization and translation data separate
// ---------------------------------------------------------------------

interface PluralizedNotification {
  readonly count: number;
  readonly locale: SupportedLocale;
}

const notification: PluralizedNotification = {
  count: 7,
  locale: "en-US",
};

console.log(notification);

// Application data stores the numeric value and locale.
// Translation resources provide the language-specific message forms.
// Intl.PluralRules connects the numeric value to the correct plural category.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default PluralizationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Pluralization selects language-specific message forms based on numeric values.
// - `Intl.PluralRules` provides locale-aware plural-category selection.
// - `select()` returns the category for a single numeric value.
// - `selectRange()` returns the category appropriate for a numeric range.
// - Plural categories include `zero`, `one`, `two`, `few`, `many`, and `other`.
// - Not every locale uses every plural category.
// - The meaning of a category such as `one` is locale-dependent and is not simply `value === 1`.
// - `other` is the required general plural category in CLDR.
// - Cardinal rules describe quantities such as "1 item" and "2 items".
// - Ordinal rules describe positions such as "1st", "2nd", and "3rd".
// - Cardinal and ordinal plural rules are separate rule systems.
// - Fractional values can follow locale-specific plural rules and should not be treated as integers automatically.
// - `resolvedOptions().pluralCategories` exposes the categories used by the configured rule set.
// - `supportedLocalesOf()` can identify supported requested locales.
// - Translation resources should provide the message forms required by the locale's plural categories.
// - Complete localized messages are preferable to mechanically adding suffixes to nouns.
// - Pluralization may require changes to nouns, verbs, pronouns, or other parts of a sentence.
// - CLDR plural categories are based on grammatical changes required by numeric substitutions.
// - Number formatting and plural selection solve different localization problems.
// - The numeric value should remain numeric until it reaches the presentation layer.
// - React components can memoize `Intl.PluralRules` using the locale as a dependency.
// - Locale-specific translation resources should be kept separate from the plural-selection algorithm.
// - Pluralization is not the same as currency conversion, number formatting, or translation itself.

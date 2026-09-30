/**
 * Locale Detection
 * ================
 *
 * Locale detection determines which locale an application should use when the user has
 * not explicitly selected one. Browser language preferences, server-provided information,
 * persisted preferences, URL state, and application-supported locales can all participate
 * in detection, but the detected value should ultimately be resolved to a locale the
 * application actually supports.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { useEffect, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE" | "fr-FR";

const supportedLocales: readonly SupportedLocale[] = ["en-US", "de-DE", "fr-FR"];

// Detection should resolve to a locale that the application actually supports.

// ---------------------------------------------------------------------
// 2. A default locale
// ---------------------------------------------------------------------

const defaultLocale: SupportedLocale = "en-US";

export const DefaultLocale: FC = (): ReactElement => {
  return <p>Default locale: {defaultLocale}</p>;
};

// A default locale provides a deterministic result when no usable preference is available.

// ---------------------------------------------------------------------
// 3. navigator.language
// ---------------------------------------------------------------------

export const NavigatorLanguage: FC = (): ReactElement => {
  const language = typeof navigator !== "undefined" ? navigator.language : "en-US";

  return <p>Browser language: {language}</p>;
};

// navigator.language exposes the browser's preferred language as a BCP 47 language tag.

// ---------------------------------------------------------------------
// 4. navigator.languages
// ---------------------------------------------------------------------

export const NavigatorLanguages: FC = (): ReactElement => {
  const languages = typeof navigator !== "undefined" ? navigator.languages : [];

  return (
    <ul>
      {languages.map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
  );
};

// navigator.languages provides the user's preferred language list in preference order.

// ---------------------------------------------------------------------
// 5. Prefer navigator.languages
// ---------------------------------------------------------------------

const getBrowserLanguages = (): readonly string[] => {
  if (typeof navigator === "undefined") {
    return [];
  }

  return navigator.languages.length > 0 ? navigator.languages : [navigator.language];
};

export const BrowserLanguagePreferences: FC = (): ReactElement => {
  const languages = getBrowserLanguages();

  return <p>{languages.join(", ")}</p>;
};

// The languages list is useful because it represents more than the user's first preference.

// ---------------------------------------------------------------------
// 6. Browser detection must run in the browser
// ---------------------------------------------------------------------

const detectBrowserLanguage = (): string | null => {
  if (typeof navigator === "undefined") {
    return null;
  }

  return navigator.language || null;
};

export const BrowserOnlyDetection: FC = (): ReactElement => {
  const language = detectBrowserLanguage();

  return <p>{language ?? "Browser locale unavailable"}</p>;
};

// Browser globals such as navigator should not be accessed unconditionally during SSR.

// ---------------------------------------------------------------------
// 7. Server rendering and initial locale
// ---------------------------------------------------------------------

type ServerLocaleProps = {
  readonly initialLocale: SupportedLocale;
};

export const ServerProvidedLocale: FC<ServerLocaleProps> = ({ initialLocale }): ReactElement => {
  return <p>Initial locale: {initialLocale}</p>;
};

// A server-rendered application can provide an initial locale so the first render does not
// need to wait for browser-only detection.

// ---------------------------------------------------------------------
// 8. Client detection after hydration
// ---------------------------------------------------------------------

export const ClientLocaleDetection: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    const detected = detectBrowserLanguage();

    if (detected === "de-DE") {
      setLocale("de-DE");
    }
  }, []);

  return <p>Locale: {locale}</p>;
};

// Browser-dependent detection can run after the component mounts.

// ---------------------------------------------------------------------
// 9. Locale canonicalization
// ---------------------------------------------------------------------

const canonicalizeLocale = (locale: string): string | null => {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? null;
  } catch {
    return null;
  }
};

export const CanonicalLocale: FC = (): ReactElement => {
  const locale = canonicalizeLocale("de-de");

  return <p>Canonical locale: {locale ?? "Invalid locale"}</p>;
};

// Canonicalization normalizes valid locale identifiers and rejects invalid ones.

// ---------------------------------------------------------------------
// 10. Invalid locale input
// ---------------------------------------------------------------------

const safeCanonicalizeLocale = (locale: unknown): string | null => {
  if (typeof locale !== "string") {
    return null;
  }

  return canonicalizeLocale(locale);
};

export const SafeLocaleDetection: FC = (): ReactElement => {
  const locale = safeCanonicalizeLocale("en-US");

  return <p>Locale: {locale ?? "Unavailable"}</p>;
};

// Locale data can come from external sources, so runtime validation is still necessary.

// ---------------------------------------------------------------------
// 11. Exact supported-locale matching
// ---------------------------------------------------------------------

const findExactLocale = (locale: string): SupportedLocale | null => {
  const canonical = canonicalizeLocale(locale);

  if (!canonical) {
    return null;
  }

  return supportedLocales.find((supportedLocale) => supportedLocale === canonical) ?? null;
};

export const ExactLocaleMatching: FC = (): ReactElement => {
  const locale = findExactLocale("de-DE");

  return <p>Matched locale: {locale ?? "No exact match"}</p>;
};

// Exact matching selects a locale only when the complete locale identifier is supported.

// ---------------------------------------------------------------------
// 12. Language-only matching
// ---------------------------------------------------------------------

const findLanguageMatch = (locale: string): SupportedLocale | null => {
  const canonical = canonicalizeLocale(locale);

  if (!canonical) {
    return null;
  }

  const language = new Intl.Locale(canonical).language;

  return supportedLocales.find((supportedLocale) => new Intl.Locale(supportedLocale).language === language) ?? null;
};

export const LanguageOnlyMatching: FC = (): ReactElement => {
  const locale = findLanguageMatch("de-AT");

  return <p>Language match: {locale ?? "No language match"}</p>;
};

// Language-only matching can provide an application-defined fallback such as de-AT -> de-DE.

// ---------------------------------------------------------------------
// 13. Exact match before language match
// ---------------------------------------------------------------------

const resolveSupportedLocale = (locale: string): SupportedLocale | null => {
  return findExactLocale(locale) ?? findLanguageMatch(locale);
};

export const ExactThenLanguageMatch: FC = (): ReactElement => {
  const locale = resolveSupportedLocale("de-DE");

  return <p>Resolved locale: {locale ?? "No supported locale"}</p>;
};

// A common application strategy is to prefer the exact locale before falling back by language.

// ---------------------------------------------------------------------
// 14. Browser preference matching
// ---------------------------------------------------------------------

const detectSupportedBrowserLocale = (): SupportedLocale => {
  const languages = getBrowserLanguages();

  for (const language of languages) {
    const match = resolveSupportedLocale(language);

    if (match) {
      return match;
    }
  }

  return defaultLocale;
};

export const SupportedBrowserLocale: FC = (): ReactElement => {
  const locale = detectSupportedBrowserLocale();

  return <p>Detected locale: {locale}</p>;
};

// The first browser preference that maps to a supported application locale is selected.

// ---------------------------------------------------------------------
// 15. Browser preference order matters
// ---------------------------------------------------------------------

const exampleBrowserPreferences = ["ja-JP", "de-AT", "en-US"];

const resolveBrowserPreferences = (languages: readonly string[]): SupportedLocale => {
  for (const language of languages) {
    const match = resolveSupportedLocale(language);

    if (match) {
      return match;
    }
  }

  return defaultLocale;
};

export const BrowserPreferenceOrder: FC = (): ReactElement => {
  const locale = resolveBrowserPreferences(exampleBrowserPreferences);

  return <p>Resolved locale: {locale}</p>;
};

// Detection should respect the order of the user's preferences rather than choosing arbitrarily.

// ---------------------------------------------------------------------
// 16. Intl locale negotiation
// ---------------------------------------------------------------------

const negotiateIntlLocale = (requestedLocales: readonly string[]): string => {
  return new Intl.DateTimeFormat(requestedLocales).resolvedOptions().locale;
};

export const IntlLocaleNegotiation: FC = (): ReactElement => {
  const locale = negotiateIntlLocale(["de-AT", "en-US"]);

  return <p>Intl-selected locale: {locale}</p>;
};

// Intl constructors can negotiate requested locales against the locales supported by the runtime.

// ---------------------------------------------------------------------
// 17. supportedLocalesOf
// ---------------------------------------------------------------------

const getSupportedIntlLocales = (requestedLocales: readonly string[]): readonly string[] => {
  return Intl.DateTimeFormat.supportedLocalesOf(requestedLocales);
};

export const SupportedIntlLocales: FC = (): ReactElement => {
  const locales = getSupportedIntlLocales(["en-US", "de-DE", "fr-FR"]);

  return <p>{locales.join(", ")}</p>;
};

// supportedLocalesOf reports requested locales supported by a particular Intl operation.

// ---------------------------------------------------------------------
// 18. Application support versus Intl support
// ---------------------------------------------------------------------

const applicationSupports = (locale: string): boolean => {
  return resolveSupportedLocale(locale) !== null;
};

export const ApplicationLocaleSupport: FC = (): ReactElement => {
  return <p>{applicationSupports("de-DE") ? "German is supported." : "German is not supported."}</p>;
};

// An application may support fewer locales than the browser's Intl implementation.

// ---------------------------------------------------------------------
// 19. Do not use Intl support as application support
// ---------------------------------------------------------------------

const runtimeLocaleSupport = (locale: string): boolean => {
  return Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0;
};

export const RuntimeVsApplicationSupport: FC = (): ReactElement => {
  const runtimeSupports = runtimeLocaleSupport("ja-JP");
  const applicationSupportsJapanese = applicationSupports("ja-JP");

  return (
    <p>
      Runtime: {runtimeSupports ? "yes" : "no"}; application: {applicationSupportsJapanese ? "yes" : "no"}
    </p>
  );
};

// The runtime may format a locale that the application's translation resources do not provide.

// ---------------------------------------------------------------------
// 20. URL locale detection
// ---------------------------------------------------------------------

const detectUrlLocale = (url: string): SupportedLocale | null => {
  try {
    const locale = new URL(url).searchParams.get("locale");

    return locale ? resolveSupportedLocale(locale) : null;
  } catch {
    return null;
  }
};

export const UrlLocaleDetection: FC = (): ReactElement => {
  const locale = detectUrlLocale("https://example.com/settings?locale=de-DE");

  return <p>URL locale: {locale ?? "None"}</p>;
};

// An explicit locale in the URL can be treated as a user-visible locale selection.

// ---------------------------------------------------------------------
// 21. URL locale precedence
// ---------------------------------------------------------------------

type DetectionSource = "url" | "user" | "server" | "browser" | "default";

const detectionPrecedence: readonly DetectionSource[] = ["url", "user", "server", "browser", "default"];

export const DetectionPrecedence: FC = (): ReactElement => {
  return <p>{detectionPrecedence.join(" → ")}</p>;
};

// The precedence shown here is an application policy, not a universal browser rule.

// ---------------------------------------------------------------------
// 22. Explicit user preference
// ---------------------------------------------------------------------

const userPreference: SupportedLocale | null = "de-DE";

export const UserLocalePreference: FC = (): ReactElement => {
  return <p>User preference: {userPreference ?? "None"}</p>;
};

// An explicit user choice is generally more intentional than an automatically detected preference.

// ---------------------------------------------------------------------
// 23. localStorage locale preference
// ---------------------------------------------------------------------

const readStoredLocale = (): SupportedLocale | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem("locale");

  return stored ? resolveSupportedLocale(stored) : null;
};

export const StoredLocalePreference: FC = (): ReactElement => {
  const locale = readStoredLocale();

  return <p>Stored locale: {locale ?? "None"}</p>;
};

// Persisted preferences are browser-only state and should be read after SSR-safe rendering when necessary.

// ---------------------------------------------------------------------
// 24. Avoid trusting persisted locale values
// ---------------------------------------------------------------------

const getSafeStoredLocale = (): SupportedLocale | null => {
  try {
    return readStoredLocale();
  } catch {
    return null;
  }
};

export const SafeStoredLocale: FC = (): ReactElement => {
  const locale = getSafeStoredLocale();

  return <p>Stored locale: {locale ?? "None"}</p>;
};

// Storage access can fail, and its contents should never be assumed to be valid application data.

// ---------------------------------------------------------------------
// 25. Server-provided locale
// ---------------------------------------------------------------------

type DetectionProps = {
  readonly serverLocale?: string;
};

export const ServerLocaleDetection: FC<DetectionProps> = ({ serverLocale }): ReactElement => {
  const locale = serverLocale ? resolveSupportedLocale(serverLocale) : null;

  return <p>Server locale: {locale ?? "None"}</p>;
};

// A server can determine an initial locale before JavaScript runs in the browser.

// ---------------------------------------------------------------------
// 26. Accept-Language is a server-side input
// ---------------------------------------------------------------------

type RequestHeaders = {
  readonly "accept-language"?: string;
};

const parseFirstLanguage = (header: string | undefined): string | null => {
  if (!header) {
    return null;
  }

  return (
    header
      .split(",")
      .map((part) => part.split(";")[0]?.trim())
      .find(Boolean) ?? null
  );
};

export const AcceptLanguageExample: FC = (): ReactElement => {
  const headers: RequestHeaders = {
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8",
  };

  const language = parseFirstLanguage(headers["accept-language"]);

  return <p>Requested language: {language ?? "None"}</p>;
};

// Accept-Language is an HTTP request header and is normally handled by the server or edge layer.

// ---------------------------------------------------------------------
// 27. Accept-Language is only a preference signal
// ---------------------------------------------------------------------

const serverLocaleFromHeader = (header: string | undefined): SupportedLocale => {
  const language = parseFirstLanguage(header);

  return language ? (resolveSupportedLocale(language) ?? defaultLocale) : defaultLocale;
};

export const AcceptLanguageResolution: FC = (): ReactElement => {
  const locale = serverLocaleFromHeader("fr-CA,fr;q=0.9,en-US;q=0.8");

  return <p>Server-resolved locale: {locale}</p>;
};

// A request header can inform detection, but the application still needs its own supported-locale policy.

// ---------------------------------------------------------------------
// 28. Explicit locale should override automatic detection
// ---------------------------------------------------------------------

type LocaleSources = {
  readonly urlLocale?: string;
  readonly userLocale?: string;
  readonly serverLocale?: string;
};

const resolveFromSources = ({ urlLocale, userLocale, serverLocale }: LocaleSources): SupportedLocale => {
  return (
    (urlLocale ? resolveSupportedLocale(urlLocale) : null) ??
    (userLocale ? resolveSupportedLocale(userLocale) : null) ??
    (serverLocale ? resolveSupportedLocale(serverLocale) : null) ??
    detectSupportedBrowserLocale()
  );
};

export const ExplicitLocalePrecedence: FC = (): ReactElement => {
  const locale = resolveFromSources({
    urlLocale: "de-DE",
    userLocale: "fr-FR",
    serverLocale: "en-US",
  });

  return <p>Selected locale: {locale}</p>;
};

// The order of sources should be an explicit application policy.

// ---------------------------------------------------------------------
// 29. User preference versus browser preference
// ---------------------------------------------------------------------

const resolveUserOrBrowserLocale = (userLocale: string | null): SupportedLocale => {
  return (userLocale ? resolveSupportedLocale(userLocale) : null) ?? detectSupportedBrowserLocale();
};

export const UserBeforeBrowser: FC = (): ReactElement => {
  const locale = resolveUserOrBrowserLocale("fr-FR");

  return <p>Locale: {locale}</p>;
};

// Once the user explicitly chooses a language, later browser preferences should not silently replace it.

// ---------------------------------------------------------------------
// 30. Detection should not use geolocation
// ---------------------------------------------------------------------

const detectionSignals = [
  "explicit user choice",
  "URL locale",
  "server-provided locale",
  "browser language preferences",
];

export const LocaleDetectionSignals: FC = (): ReactElement => {
  return (
    <ul>
      {detectionSignals.map((signal) => (
        <li key={signal}>{signal}</li>
      ))}
    </ul>
  );
};

// Geographic location is not equivalent to language preference and should not be treated as locale detection.

// ---------------------------------------------------------------------
// 31. Time zone is not locale
// ---------------------------------------------------------------------

const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const TimeZoneIsNotLocale: FC = (): ReactElement => {
  return <p>Time zone: {getTimeZone()}</p>;
};

// Time zone and locale are separate concepts; one should not be used as a substitute for the other.

// ---------------------------------------------------------------------
// 32. Language is not always region
// ---------------------------------------------------------------------

const localeExamples = ["en-US", "en-GB", "fr-FR", "fr-CA"];

export const LanguageAndRegion: FC = (): ReactElement => {
  return (
    <ul>
      {localeExamples.map((locale) => (
        <li key={locale}>{locale}</li>
      ))}
    </ul>
  );
};

// Different regions can use the same language while following different formatting conventions.

// ---------------------------------------------------------------------
// 33. Intl.Locale for locale inspection
// ---------------------------------------------------------------------

export const LocaleInspection: FC = (): ReactElement => {
  const locale = new Intl.Locale("de-DE");

  return (
    <p>
      Language: {locale.language}; region: {locale.region}
    </p>
  );
};

// Intl.Locale can inspect the language and region subtags of a locale identifier.

// ---------------------------------------------------------------------
// 34. Language-only fallback
// ---------------------------------------------------------------------

const getLanguageSubtag = (locale: string): string | null => {
  const canonical = canonicalizeLocale(locale);

  return canonical ? new Intl.Locale(canonical).language : null;
};

export const LanguageSubtagFallback: FC = (): ReactElement => {
  const language = getLanguageSubtag("fr-CA");

  return <p>Language: {language ?? "Unknown"}</p>;
};

// A language subtag can be used for an application-defined fallback policy.

// ---------------------------------------------------------------------
// 35. Locale fallback chain
// ---------------------------------------------------------------------

const buildLocaleFallbacks = (locale: string): string[] => {
  const canonical = canonicalizeLocale(locale);

  if (!canonical) {
    return [];
  }

  const parsed = new Intl.Locale(canonical);
  const fallbacks = [canonical];

  if (parsed.region) {
    fallbacks.push(parsed.language);
  }

  return [...new Set(fallbacks)];
};

export const LocaleFallbackChain: FC = (): ReactElement => {
  const fallbacks = buildLocaleFallbacks("de-DE");

  return <p>{fallbacks.join(" → ")}</p>;
};

// Fallback chains can progressively reduce locale specificity.

// ---------------------------------------------------------------------
// 36. Do not assume every fallback is supported
// ---------------------------------------------------------------------

const supportedFallbacks = (locale: string): readonly SupportedLocale[] => {
  return buildLocaleFallbacks(locale)
    .map((candidate) => resolveSupportedLocale(candidate))
    .filter((candidate): candidate is SupportedLocale => candidate !== null);
};

export const SupportedFallbackChain: FC = (): ReactElement => {
  const locales = supportedFallbacks("fr-CA");

  return <p>{locales.join(" → ") || "No supported fallback"}</p>;
};

// A fallback candidate still needs to be checked against application-supported locales.

// ---------------------------------------------------------------------
// 37. Canonicalize before comparing
// ---------------------------------------------------------------------

const sameLocale = (first: string, second: string): boolean => {
  const firstCanonical = canonicalizeLocale(first);
  const secondCanonical = canonicalizeLocale(second);

  return firstCanonical !== null && firstCanonical === secondCanonical;
};

export const CanonicalLocaleComparison: FC = (): ReactElement => {
  return <p>{sameLocale("de-de", "de-DE") ? "Same locale" : "Different locales"}</p>;
};

// Locale strings should be canonicalized before exact comparisons when inputs are external.

// ---------------------------------------------------------------------
// 38. Detecting a browser locale with a safe fallback
// ---------------------------------------------------------------------

const detectLocale = (): SupportedLocale => {
  if (typeof navigator === "undefined") {
    return defaultLocale;
  }

  for (const language of navigator.languages) {
    const match = resolveSupportedLocale(language);

    if (match) {
      return match;
    }
  }

  const language = resolveSupportedLocale(navigator.language);

  return language ?? defaultLocale;
};

export const SafeBrowserDetection: FC = (): ReactElement => {
  return <p>Detected locale: {detectLocale()}</p>;
};

// The detector handles missing browser APIs, invalid values, unsupported locales, and fallback.

// ---------------------------------------------------------------------
// 39. Locale detection hook
// ---------------------------------------------------------------------

const useDetectedLocale = (): SupportedLocale => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  return locale;
};

export const UseDetectedLocale: FC = (): ReactElement => {
  const locale = useDetectedLocale();

  return <p>Detected locale: {locale}</p>;
};

// A hook can encapsulate browser-only locale detection for React components.

// ---------------------------------------------------------------------
// 40. Avoid browser access during initial render
// ---------------------------------------------------------------------

export const HydrationSafeDetection: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  return <p>Locale: {locale}</p>;
};

// Keeping browser detection in an effect can prevent direct browser-global access during SSR.

// ---------------------------------------------------------------------
// 41. Initial server locale plus browser fallback
// ---------------------------------------------------------------------

type InitialLocaleProps = {
  readonly initialLocale?: SupportedLocale;
};

export const InitialLocaleDetection: FC<InitialLocaleProps> = ({ initialLocale = defaultLocale }): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    const detected = detectLocale();

    if (detected !== initialLocale) {
      setLocale(detected);
    }
  }, [initialLocale]);

  return <p>Locale: {locale}</p>;
};

// A server-provided initial locale can give the component a deterministic first render.

// ---------------------------------------------------------------------
// 42. Avoid unnecessary locale replacement
// ---------------------------------------------------------------------

export const PreserveInitialLocale: FC<InitialLocaleProps> = ({ initialLocale = defaultLocale }): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    const detected = detectLocale();

    if (detected === initialLocale) {
      return;
    }

    setLocale(detected);
  }, [initialLocale]);

  return <p>Locale: {locale}</p>;
};

// A detection policy should define whether automatic browser detection may replace a server choice.

// ---------------------------------------------------------------------
// 43. Listen for language changes
// ---------------------------------------------------------------------

const listenForLanguageChanges = (callback: () => void): (() => void) => {
  window.addEventListener("languagechange", callback);

  return () => {
    window.removeEventListener("languagechange", callback);
  };
};

export const LanguageChangeListener: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    const updateLocale = (): void => {
      setLocale(detectLocale());
    };

    updateLocale();

    return listenForLanguageChanges(updateLocale);
  }, []);

  return <p>Locale: {locale}</p>;
};

// Browsers can fire languagechange when the user's preferred languages change.

// ---------------------------------------------------------------------
// 44. Do not constantly overwrite explicit choices
// ---------------------------------------------------------------------

type PreferenceState = {
  readonly locale: SupportedLocale | null;
  readonly source: "explicit" | "detected";
};

export const ExplicitPreferenceState: FC = (): ReactElement => {
  const state: PreferenceState = {
    locale: "de-DE",
    source: "explicit",
  };

  return (
    <p>
      {state.locale} ({state.source})
    </p>
  );
};

// Tracking the source of a locale decision helps prevent automatic detection from overriding intent.

// ---------------------------------------------------------------------
// 45. Detection source metadata
// ---------------------------------------------------------------------

type LocaleDecision = {
  readonly locale: SupportedLocale;
  readonly source: DetectionSource;
};

const detectWithSource = (): LocaleDecision => {
  const browserLocale = detectLocale();

  return {
    locale: browserLocale,
    source: "browser",
  };
};

export const LocaleDecisionMetadata: FC = (): ReactElement => {
  const decision = detectWithSource();

  return (
    <p>
      {decision.locale} ({decision.source})
    </p>
  );
};

// Keeping the source alongside the locale makes precedence and debugging easier to reason about.

// ---------------------------------------------------------------------
// 46. Detection should be deterministic
// ---------------------------------------------------------------------

const deterministicDetection = (languages: readonly string[]): SupportedLocale => {
  return resolveBrowserPreferences(languages);
};

export const DeterministicDetection: FC = (): ReactElement => {
  const locale = deterministicDetection(["es-ES", "fr-CA", "en-US"]);

  return <p>Detected locale: {locale}</p>;
};

// A pure detection function is easy to test because the same inputs always produce the same result.

// ---------------------------------------------------------------------
// 47. Test exact locale preference
// ---------------------------------------------------------------------

const exactPreferenceTest = deterministicDetection(["de-DE", "en-US"]);

export const ExactPreferenceTest: FC = (): ReactElement => {
  return <p>Expected locale: {exactPreferenceTest}</p>;
};

// Exact supported preferences should be selected before later fallback preferences.

// ---------------------------------------------------------------------
// 48. Test unsupported preference
// ---------------------------------------------------------------------

const unsupportedPreferenceTest = deterministicDetection(["ja-JP", "fr-FR"]);

export const UnsupportedPreferenceTest: FC = (): ReactElement => {
  return <p>Fallback locale: {unsupportedPreferenceTest}</p>;
};

// Unsupported preferences should not cause the application to select an unavailable resource.

// ---------------------------------------------------------------------
// 49. Test regional fallback
// ---------------------------------------------------------------------

const regionalFallbackTest = deterministicDetection(["de-AT", "fr-FR"]);

export const RegionalFallbackTest: FC = (): ReactElement => {
  return <p>Regional fallback: {regionalFallbackTest}</p>;
};

// An application can deliberately map a regional variant to a supported locale of the same language.

// ---------------------------------------------------------------------
// 50. Test invalid locale input
// ---------------------------------------------------------------------

const invalidLocaleTest = resolveSupportedLocale("not-a-locale");

export const InvalidLocaleTest: FC = (): ReactElement => {
  return <p>{invalidLocaleTest ?? "Fell back to default"}</p>;
};

// Invalid external input should fail safely instead of breaking locale detection.

// ---------------------------------------------------------------------
// 51. Locale detection should not throw
// ---------------------------------------------------------------------

const safeDetectLocale = (languages: readonly string[]): SupportedLocale => {
  try {
    return resolveBrowserPreferences(languages);
  } catch {
    return defaultLocale;
  }
};

export const NonThrowingDetection: FC = (): ReactElement => {
  const locale = safeDetectLocale(["de-DE", "en-US"]);

  return <p>Locale: {locale}</p>;
};

// Detection is infrastructure logic and should have a deterministic failure path.

// ---------------------------------------------------------------------
// 52. Locale detection and document language
// ---------------------------------------------------------------------

type LocalizedDocumentProps = {
  readonly locale: SupportedLocale;
};

export const DocumentLanguage: FC<LocalizedDocumentProps> = ({ locale }): ReactElement => {
  const language = new Intl.Locale(locale).language;

  return (
    <main lang={language}>
      <p>Detected locale: {locale}</p>
    </main>
  );
};

// The resolved locale can inform language metadata for rendered content.

// ---------------------------------------------------------------------
// 53. Locale detection and text direction
// ---------------------------------------------------------------------

const getDirection = (locale: SupportedLocale): "ltr" | "rtl" => {
  const language = new Intl.Locale(locale).language;

  return language === "ar" || language === "he" ? "rtl" : "ltr";
};

export const DetectedTextDirection: FC<LocalizedDocumentProps> = ({ locale }): ReactElement => {
  return (
    <main dir={getDirection(locale)}>
      <p>Locale: {locale}</p>
    </main>
  );
};

// Locale detection can participate in direction selection, but direction remains a separate concern.

// ---------------------------------------------------------------------
// 54. Locale detection and formatting
// ---------------------------------------------------------------------

export const DetectedLocaleFormatting: FC = (): ReactElement => {
  const locale = detectLocale();
  const number = new Intl.NumberFormat(locale).format(1234567.89);

  return <p>{number}</p>;
};

// Once resolved, the locale can be passed to Intl formatters for locale-sensitive presentation.

// ---------------------------------------------------------------------
// 55. Locale detection and translation resources
// ---------------------------------------------------------------------

const detectedMessages: Record<SupportedLocale, string> = {
  "en-US": "Welcome",
  "de-DE": "Willkommen",
  "fr-FR": "Bienvenue",
};

export const DetectedTranslationResource: FC = (): ReactElement => {
  const locale = detectLocale();

  return <p>{detectedMessages[locale]}</p>;
};

// Detection selects the locale; translation resources provide the corresponding user-facing message.

// ---------------------------------------------------------------------
// 56. Detection should not expose unsupported resources
// ---------------------------------------------------------------------

const getDetectedMessage = (locale: string): string => {
  const supported = resolveSupportedLocale(locale);

  return supported ? detectedMessages[supported] : detectedMessages[defaultLocale];
};

export const SafeDetectedMessage: FC = (): ReactElement => {
  return <p>{getDetectedMessage("de-DE")}</p>;
};

// Resource access should remain guarded by the same supported-locale policy used during detection.

// ---------------------------------------------------------------------
// 57. Explicit locale from a URL
// ---------------------------------------------------------------------

const resolveUrlOrBrowserLocale = (url: string): SupportedLocale => {
  return detectUrlLocale(url) ?? detectLocale();
};

export const UrlBeforeBrowserDetection: FC = (): ReactElement => {
  const locale = resolveUrlOrBrowserLocale("https://example.com/?locale=fr-FR");

  return <p>Locale: {locale}</p>;
};

// An explicit URL locale can take precedence over automatic browser detection when the application chooses that policy.

// ---------------------------------------------------------------------
// 58. Detection pipeline
// ---------------------------------------------------------------------

type DetectionInput = {
  readonly urlLocale?: string;
  readonly storedLocale?: string;
  readonly serverLocale?: string;
  readonly browserLanguages: readonly string[];
};

const detectFromPipeline = ({
  urlLocale,
  storedLocale,
  serverLocale,
  browserLanguages,
}: DetectionInput): SupportedLocale => {
  return (
    (urlLocale ? resolveSupportedLocale(urlLocale) : null) ??
    (storedLocale ? resolveSupportedLocale(storedLocale) : null) ??
    (serverLocale ? resolveSupportedLocale(serverLocale) : null) ??
    resolveBrowserPreferences(browserLanguages)
  );
};

export const DetectionPipeline: FC = (): ReactElement => {
  const locale = detectFromPipeline({
    urlLocale: undefined,
    storedLocale: "fr-FR",
    serverLocale: "en-US",
    browserLanguages: ["de-DE", "en-US"],
  });

  return <p>Pipeline result: {locale}</p>;
};

// A centralized pipeline makes detection precedence explicit and testable.

// ---------------------------------------------------------------------
// 59. Keep detection separate from translation
// ---------------------------------------------------------------------

const detectApplicationLocale = (languages: readonly string[]): SupportedLocale => {
  return resolveBrowserPreferences(languages);
};

const getWelcomeMessage = (locale: SupportedLocale): string => {
  return detectedMessages[locale];
};

export const DetectionAndTranslationSeparation: FC = (): ReactElement => {
  const locale = detectApplicationLocale(["de-DE", "en-US"]);

  return <p>{getWelcomeMessage(locale)}</p>;
};

// Detection determines a locale; translation lookup should remain a separate responsibility.

// ---------------------------------------------------------------------
// 60. Integrated locale detection
// ---------------------------------------------------------------------

type IntegratedLocaleDetectionProps = {
  readonly initialLocale?: SupportedLocale;
};

const useApplicationLocale = (initialLocale: SupportedLocale): SupportedLocale => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    const storedLocale = getSafeStoredLocale();

    if (storedLocale) {
      setLocale(storedLocale);
      return;
    }

    setLocale(detectLocale());
  }, []);

  return locale;
};

const integratedResources: Record<
  SupportedLocale,
  {
    readonly title: string;
    readonly description: string;
    readonly save: string;
  }
> = {
  "en-US": {
    title: "Account settings",
    description: "Manage your account.",
    save: "Save changes",
  },
  "de-DE": {
    title: "Kontoeinstellungen",
    description: "Verwalten Sie Ihr Konto.",
    save: "Änderungen speichern",
  },
  "fr-FR": {
    title: "Paramètres du compte",
    description: "Gérez votre compte.",
    save: "Enregistrer les modifications",
  },
};

export const LocaleDetectionExample: FC<IntegratedLocaleDetectionProps> = ({
  initialLocale = defaultLocale,
}): ReactElement => {
  const locale = useApplicationLocale(initialLocale);
  const resource = integratedResources[locale];
  const language = new Intl.Locale(locale).language;

  return (
    <main lang={language}>
      <h1>{resource.title}</h1>

      <p>{resource.description}</p>

      <p>Detected locale: {locale}</p>

      <button type="button">{resource.save}</button>
    </main>
  );
};

export default LocaleDetectionExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Locale detection determines which supported locale an application should use.
// - navigator.language exposes the browser's primary preferred language.
// - navigator.languages exposes the browser's preferred language list in preference order.
// - Browser globals should be accessed carefully when an application can render on the server.
// - A server-provided initial locale can avoid unnecessary browser-only detection during the first render.
// - Locale identifiers should be canonicalized and validated before being used.
// - Exact locale matching can be followed by an application-defined language-only fallback.
// - Browser or runtime Intl support does not mean the application has translation resources for that locale.
// - Intl constructors can negotiate requested locales against the locales supported by the runtime.
// - Explicit user choices should normally be distinguished from automatically detected preferences.
// - URL, stored, server, and browser locale sources should have an explicit precedence policy.
// - Accept-Language is an HTTP preference signal that is normally handled by the server or edge layer.
// - Geographic location and time zone are not substitutes for a user's language or locale preference.
// - A locale can contain language, region, script, and other subtags, so language and region should not be treated as interchangeable.
// - Intl.Locale can inspect and work with locale subtags.
// - Fallback chains should only select locales that the application actually supports.
// - Language changes can be observed through the browser's languagechange event.
// - Locale detection should have deterministic fallback behavior and should not throw on malformed external input.
// - The resolved locale can be used for translation resources, Intl formatting, language metadata, and direction handling.
// - Detection and translation lookup are separate responsibilities.
// - A centralized detection pipeline makes precedence, fallback, and testing easier to reason about.

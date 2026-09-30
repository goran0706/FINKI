/**
 * Locale Switching
 * =================
 *
 * Locale switching allows an application to change its active locale in response to an
 * explicit user choice or another application-controlled event. A locale switch should
 * update the source of localized messages and formatting consistently while preserving
 * the user's selection according to the application's persistence and routing strategy.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { useEffect, useState, type ChangeEvent, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE" | "fr-FR";

const supportedLocales: readonly SupportedLocale[] = ["en-US", "de-DE", "fr-FR"];

// Locale switching should only select locales for which the application has support.

// ---------------------------------------------------------------------
// 2. Active locale
// ---------------------------------------------------------------------

export const ActiveLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <p>Current locale: {locale}</p>

      <button
        type="button"
        onClick={() => {
          setLocale("de-DE");
        }}
      >
        Switch to German
      </button>
    </section>
  );
};

// The active locale is application state when the user can change it at runtime.

// ---------------------------------------------------------------------
// 3. Locale selector
// ---------------------------------------------------------------------

const localeNames: Record<SupportedLocale, string> = {
  "en-US": "English",
  "de-DE": "German",
  "fr-FR": "French",
};

type LocaleSelectorProps = {
  readonly locale: SupportedLocale;
  readonly onLocaleChange: (locale: SupportedLocale) => void;
};

export const LocaleSelector: FC<LocaleSelectorProps> = ({ locale, onLocaleChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onLocaleChange(event.target.value as SupportedLocale);
  };

  return (
    <label>
      Language
      <select value={locale} onChange={handleChange}>
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeNames[supportedLocale]}
          </option>
        ))}
      </select>
    </label>
  );
};

// A select control provides an explicit, accessible mechanism for changing the active locale.

// ---------------------------------------------------------------------
// 4. Keep locale state in the parent
// ---------------------------------------------------------------------

export const ParentLocaleState: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>Selected locale: {locale}</p>
    </section>
  );
};

// The component that owns locale state can pass the current value and state updater to the selector.

// ---------------------------------------------------------------------
// 5. Render localized messages from the active locale
// ---------------------------------------------------------------------

const messages: Record<
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

export const LocalizedMessages: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const resource = messages[locale];

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{resource.title}</h1>

      <p>{resource.description}</p>

      <button type="button">{resource.save}</button>
    </section>
  );
};

// Changing the locale changes the resource from which user-facing messages are read.

// ---------------------------------------------------------------------
// 6. Locale switching updates Intl formatting
// ---------------------------------------------------------------------

export const LocalizedNumber: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const amount = 1234567.89;

  const formattedAmount = new Intl.NumberFormat(locale).format(amount);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{formattedAmount}</p>
    </section>
  );
};

// The active locale should normally be passed to Intl formatters as well as translation lookup.

// ---------------------------------------------------------------------
// 7. Locale switching updates date formatting
// ---------------------------------------------------------------------

export const LocalizedDate: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const date = new Date("2026-09-29T12:00:00Z");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{formattedDate}</p>
    </section>
  );
};

// Locale-sensitive dates should be reformatted when the active locale changes.

// ---------------------------------------------------------------------
// 8. Locale switching updates currency formatting
// ---------------------------------------------------------------------

export const LocalizedCurrency: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const amount = 1299.99;

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{formattedCurrency}</p>
    </section>
  );
};

// Currency formatting combines a numeric value and currency code with locale-sensitive presentation.

// ---------------------------------------------------------------------
// 9. Locale switching updates relative time
// ---------------------------------------------------------------------

export const LocalizedRelativeTime: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const relativeTime = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(-1, "day");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{relativeTime}</p>
    </section>
  );
};

// Relative-time output should also be recreated with the active locale.

// ---------------------------------------------------------------------
// 10. Locale switching updates list formatting
// ---------------------------------------------------------------------

export const LocalizedList: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const names = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(["John Doe", "Jane Doe", "Alex Doe"]);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{names}</p>
    </section>
  );
};

// Locale switching can change conjunctions, punctuation, and other list-formatting conventions.

// ---------------------------------------------------------------------
// 11. Locale switching updates collation
// ---------------------------------------------------------------------

const namesToSort = ["Åke", "André", "Änne", "Zoe"];

export const LocalizedSorting: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const sortedNames = [...namesToSort].sort(new Intl.Collator(locale).compare);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <ul>
        {sortedNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
};

// Locale-sensitive sorting should use a collation strategy appropriate to the active locale.

// ---------------------------------------------------------------------
// 12. Locale switching and document language
// ---------------------------------------------------------------------

const getLanguage = (locale: SupportedLocale): string => {
  return new Intl.Locale(locale).language;
};

export const DocumentLanguage: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <main lang={getLanguage(locale)}>
        <p>Language: {getLanguage(locale)}</p>
      </main>
    </section>
  );
};

// Rendered content should expose the appropriate language metadata after a locale switch.

// ---------------------------------------------------------------------
// 13. Locale switching and text direction
// ---------------------------------------------------------------------

type Direction = "ltr" | "rtl";

const getDirection = (locale: string): Direction => {
  const language = new Intl.Locale(locale).language;

  return language === "ar" || language === "he" ? "rtl" : "ltr";
};

export const LocaleDirection: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <main dir={getDirection(locale)}>
        <p>Current direction: {getDirection(locale)}</p>
      </main>
    </section>
  );
};

// Locale switching can require direction changes when the selected locale uses another writing direction.

// ---------------------------------------------------------------------
// 14. Store the locale in state, not translated text
// ---------------------------------------------------------------------

type Action = "save" | "cancel";

const actionMessages: Record<SupportedLocale, Record<Action, string>> = {
  "en-US": {
    save: "Save",
    cancel: "Cancel",
  },
  "de-DE": {
    save: "Speichern",
    cancel: "Abbrechen",
  },
  "fr-FR": {
    save: "Enregistrer",
    cancel: "Annuler",
  },
};

export const StableLocaleState: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [action] = useState<Action>("save");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <button type="button">{actionMessages[locale][action]}</button>
    </section>
  );
};

// Application state should store stable identifiers while localized text remains a presentation concern.

// ---------------------------------------------------------------------
// 15. Avoid switching based on translated labels
// ---------------------------------------------------------------------

const localizedActionLabels: Record<SupportedLocale, Record<Action, string>> = actionMessages;

export const AvoidTranslatedLabelLogic: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const action: Action = "save";

  const label = localizedActionLabels[locale][action];

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <button type="button">{label}</button>
    </section>
  );
};

// Logic should continue to operate on "save" rather than comparing localized labels such as "Save" or "Speichern".

// ---------------------------------------------------------------------
// 16. Controlled locale selector
// ---------------------------------------------------------------------

type ControlledLocaleSelectorProps = {
  readonly value: SupportedLocale;
  readonly onChange: (value: SupportedLocale) => void;
};

export const ControlledLocaleSelector: FC<ControlledLocaleSelectorProps> = ({ value, onChange }): ReactElement => {
  return (
    <select
      value={value}
      onChange={(event) => {
        onChange(event.target.value as SupportedLocale);
      }}
    >
      {supportedLocales.map((locale) => (
        <option key={locale} value={locale}>
          {localeNames[locale]}
        </option>
      ))}
    </select>
  );
};

// A controlled selector receives its current locale from React state and reports changes upward.

// ---------------------------------------------------------------------
// 17. Validate locale changes
// ---------------------------------------------------------------------

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return supportedLocales.includes(value as SupportedLocale);
};

export const ValidatedLocaleChange: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;

    if (isSupportedLocale(value)) {
      setLocale(value);
    }
  };

  return (
    <select value={locale} onChange={handleLocaleChange}>
      {supportedLocales.map((supportedLocale) => (
        <option key={supportedLocale} value={supportedLocale}>
          {localeNames[supportedLocale]}
        </option>
      ))}
    </select>
  );
};

// Runtime values from form controls should be validated before becoming typed application state.

// ---------------------------------------------------------------------
// 18. Persist the selected locale
// ---------------------------------------------------------------------

const localeStorageKey = "locale";

const storeLocale = (locale: SupportedLocale): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(localeStorageKey, locale);
  }
};

export const PersistentLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    storeLocale(nextLocale);
  };

  return <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />;
};

// Persisting the selection can allow the same locale to be restored on later visits.

// ---------------------------------------------------------------------
// 19. Read the persisted locale safely
// ---------------------------------------------------------------------

const readStoredLocale = (): SupportedLocale | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(localeStorageKey);

    return value && isSupportedLocale(value) ? value : null;
  } catch {
    return null;
  }
};

export const RestoreStoredLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  useEffect(() => {
    const storedLocale = readStoredLocale();

    if (storedLocale) {
      setLocale(storedLocale);
    }
  }, []);

  return <p>Locale: {locale}</p>;
};

// Stored data is external runtime input and must be checked before it is used as a locale.

// ---------------------------------------------------------------------
// 20. Persist after switching
// ---------------------------------------------------------------------

export const PersistAfterSwitch: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  useEffect(() => {
    storeLocale(locale);
  }, [locale]);

  return <LocaleSelector locale={locale} onLocaleChange={setLocale} />;
};

// Persisting from an effect keeps storage synchronized with the current locale state.

// ---------------------------------------------------------------------
// 21. Locale switching with a fallback
// ---------------------------------------------------------------------

const getStoredOrDefaultLocale = (): SupportedLocale => {
  return readStoredLocale() ?? "en-US";
};

export const StoredLocaleWithFallback: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  useEffect(() => {
    setLocale(getStoredOrDefaultLocale());
  }, []);

  return <p>Locale: {locale}</p>;
};

// An unavailable or invalid stored value should fall back to a known supported locale.

// ---------------------------------------------------------------------
// 22. Do not persist invalid locale values
// ---------------------------------------------------------------------

const persistValidatedLocale = (value: string): boolean => {
  if (!isSupportedLocale(value)) {
    return false;
  }

  storeLocale(value);
  return true;
};

export const ValidateBeforePersistence: FC = (): ReactElement => {
  const [message, setMessage] = useState("No locale selected.");

  const handleLocaleChange = (locale: SupportedLocale): void => {
    if (persistValidatedLocale(locale)) {
      setMessage(`Saved ${locale}.`);
    }
  };

  return (
    <section>
      <LocaleSelector locale="en-US" onLocaleChange={handleLocaleChange} />

      <p>{message}</p>
    </section>
  );
};

// Validation should happen before values are written to persistent storage.

// ---------------------------------------------------------------------
// 23. Locale switching and URL state
// ---------------------------------------------------------------------

const createLocaleUrl = (locale: SupportedLocale): string => {
  const url = new URL("https://example.com/settings");

  url.searchParams.set("locale", locale);

  return url.toString();
};

export const LocaleInUrl: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{createLocaleUrl(locale)}</p>
    </section>
  );
};

// A URL can represent the selected locale when locale-specific URLs are part of the application's routing design.

// ---------------------------------------------------------------------
// 24. Locale switching and URL replacement
// ---------------------------------------------------------------------

const updateUrlLocale = (locale: SupportedLocale): void => {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("locale", locale);
  window.history.replaceState(null, "", url);
};

export const ReplaceUrlLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    updateUrlLocale(nextLocale);
  };

  return <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />;
};

// replaceState can update URL state without creating another browser history entry.

// ---------------------------------------------------------------------
// 25. Locale switching and browser history
// ---------------------------------------------------------------------

const pushUrlLocale = (locale: SupportedLocale): void => {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("locale", locale);
  window.history.pushState(null, "", url);
};

export const PushUrlLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    pushUrlLocale(nextLocale);
  };

  return <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />;
};

// pushState can make locale changes part of browser history when that behavior is desired.

// ---------------------------------------------------------------------
// 26. Locale switching should have one source of truth
// ---------------------------------------------------------------------

type LocaleState = {
  readonly locale: SupportedLocale;
};

export const SingleLocaleSource: FC = (): ReactElement => {
  const [state, setState] = useState<LocaleState>({
    locale: "en-US",
  });

  return (
    <section>
      <LocaleSelector
        locale={state.locale}
        onLocaleChange={(locale) => {
          setState({ locale });
        }}
      />

      <p>Locale: {state.locale}</p>
    </section>
  );
};

// Keeping one authoritative locale state avoids contradictory locale values in different components.

// ---------------------------------------------------------------------
// 27. Avoid duplicated locale state
// ---------------------------------------------------------------------

export const AvoidDuplicatedLocaleState: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const resource = messages[locale];

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{resource.title}</h1>
    </section>
  );
};

// Derived values such as the selected resource should normally be computed from the active locale instead of stored separately.

// ---------------------------------------------------------------------
// 28. Context can provide locale state
// ---------------------------------------------------------------------

type LocaleContextValue = {
  readonly locale: SupportedLocale;
  readonly setLocale: (locale: SupportedLocale) => void;
};

// A context value can expose locale state to components that are far apart in the tree.

// The context itself would be created at the application's provider boundary.

// ---------------------------------------------------------------------
// 29. Locale provider concept
// ---------------------------------------------------------------------

type LocaleProviderProps = {
  readonly locale: SupportedLocale;
  readonly children: React.ReactNode;
};

export const LocaleProviderConcept: FC<LocaleProviderProps> = ({ locale, children }): ReactElement => {
  return <div data-locale={locale}>{children}</div>;
};

// A provider can establish locale state and make it available to descendants through a context or i18n library.

// ---------------------------------------------------------------------
// 30. Pass locale explicitly when context is unnecessary
// ---------------------------------------------------------------------

type LocalizedContentProps = {
  readonly locale: SupportedLocale;
};

export const ExplicitLocaleProp: FC<LocalizedContentProps> = ({ locale }): ReactElement => {
  return <h1>{messages[locale].title}</h1>;
};

// Explicit props can be simpler and more transparent when only a small part of the tree needs the locale.

// ---------------------------------------------------------------------
// 31. Locale switching should update all localized content
// ---------------------------------------------------------------------

export const CompleteLocalizedView: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const resource = messages[locale];
  const number = new Intl.NumberFormat(locale).format(1234567.89);
  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date("2026-09-29T12:00:00Z"));

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{resource.title}</h1>

      <p>{resource.description}</p>

      <p>{number}</p>

      <p>{date}</p>

      <button type="button">{resource.save}</button>
    </section>
  );
};

// A locale switch should affect translation resources and locale-sensitive formatting consistently.

// ---------------------------------------------------------------------
// 32. Loading a locale resource
// ---------------------------------------------------------------------

type TranslationResource = {
  readonly title: string;
  readonly description: string;
  readonly save: string;
};

const loadedResources: Partial<Record<SupportedLocale, TranslationResource>> = {
  "en-US": messages["en-US"],
  "de-DE": messages["de-DE"],
};

export const LoadedLocaleResource: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const resource = loadedResources[locale];

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      {resource ? <h1>{resource.title}</h1> : <p role="status">Translation resource unavailable.</p>}
    </section>
  );
};

// A locale switch can require loading a resource before localized content can be rendered.

// ---------------------------------------------------------------------
// 33. Loading state during locale switching
// ---------------------------------------------------------------------

type LoadingState = {
  readonly locale: SupportedLocale;
  readonly status: "ready" | "loading";
};

export const LocaleLoadingState: FC = (): ReactElement => {
  const [state, setState] = useState<LoadingState>({
    locale: "en-US",
    status: "ready",
  });

  const switchLocale = (locale: SupportedLocale): void => {
    setState({
      locale,
      status: "loading",
    });

    window.setTimeout(() => {
      setState({
        locale,
        status: "ready",
      });
    }, 300);
  };

  return (
    <section>
      <LocaleSelector locale={state.locale} onLocaleChange={switchLocale} />

      {state.status === "loading" ? (
        <p role="status">Loading translations...</p>
      ) : (
        <h1>{messages[state.locale].title}</h1>
      )}
    </section>
  );
};

// When resources are asynchronous, the UI should represent the loading state explicitly.

// ---------------------------------------------------------------------
// 34. Keep the previous locale while loading
// ---------------------------------------------------------------------

type AsyncLocaleState = {
  readonly activeLocale: SupportedLocale;
  readonly requestedLocale: SupportedLocale;
  readonly loading: boolean;
};

export const PreservePreviousLocale: FC = (): ReactElement => {
  const [state, setState] = useState<AsyncLocaleState>({
    activeLocale: "en-US",
    requestedLocale: "en-US",
    loading: false,
  });

  const requestLocale = (requestedLocale: SupportedLocale): void => {
    setState((current) => ({
      ...current,
      requestedLocale,
      loading: true,
    }));

    window.setTimeout(() => {
      setState({
        activeLocale: requestedLocale,
        requestedLocale,
        loading: false,
      });
    }, 300);
  };

  return (
    <section>
      <LocaleSelector locale={state.requestedLocale} onLocaleChange={requestLocale} />

      {state.loading && <p role="status">Loading...</p>}

      <h1>{messages[state.activeLocale].title}</h1>
    </section>
  );
};

// Keeping the previous content visible can avoid replacing usable content with an empty loading state.

// ---------------------------------------------------------------------
// 35. Avoid race conditions in asynchronous switching
// ---------------------------------------------------------------------

let requestSequence = 0;

const getNextRequestId = (): number => {
  requestSequence += 1;
  return requestSequence;
};

export const LocaleSwitchRequestId: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [loading, setLoading] = useState(false);

  const switchLocale = (nextLocale: SupportedLocale): void => {
    const requestId = getNextRequestId();

    setLoading(true);

    window.setTimeout(() => {
      if (requestId !== requestSequence) {
        return;
      }

      setLocale(nextLocale);
      setLoading(false);
    }, 300);
  };

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={switchLocale} />

      {loading && <p role="status">Loading...</p>}

      <h1>{messages[locale].title}</h1>
    </section>
  );
};

// If locale resources load asynchronously, stale requests should not overwrite a newer selection.

// ---------------------------------------------------------------------
// 36. Disable repeated switching while loading
// ---------------------------------------------------------------------

type SwitchingSelectorProps = {
  readonly locale: SupportedLocale;
  readonly loading: boolean;
  readonly onLocaleChange: (locale: SupportedLocale) => void;
};

export const LoadingAwareSelector: FC<SwitchingSelectorProps> = ({ locale, loading, onLocaleChange }): ReactElement => {
  return (
    <label>
      Language
      <select
        value={locale}
        disabled={loading}
        onChange={(event) => {
          const value = event.target.value;

          if (isSupportedLocale(value)) {
            onLocaleChange(value);
          }
        }}
      >
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeNames[supportedLocale]}
          </option>
        ))}
      </select>
    </label>
  );
};

// Disabling a selector during a short loading transition can simplify request coordination.

// ---------------------------------------------------------------------
// 37. Locale switching and accessibility
// ---------------------------------------------------------------------

export const AccessibleLocaleSwitcher: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <h2>Language</h2>

      <label>
        Select language
        <select
          value={locale}
          onChange={(event) => {
            const value = event.target.value;

            if (isSupportedLocale(value)) {
              setLocale(value);
            }
          }}
        >
          {supportedLocales.map((supportedLocale) => (
            <option key={supportedLocale} value={supportedLocale}>
              {localeNames[supportedLocale]}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
};

// The locale control should have an accessible name and should remain usable with the keyboard.

// ---------------------------------------------------------------------
// 38. Announce a completed locale switch
// ---------------------------------------------------------------------

const switchMessages: Record<SupportedLocale, string> = {
  "en-US": "Language changed to English.",
  "de-DE": "Sprache auf Deutsch geändert.",
  "fr-FR": "Langue changée en français.",
};

export const LocaleSwitchAnnouncement: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [announcement, setAnnouncement] = useState("");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    setAnnouncement(switchMessages[nextLocale]);
  };

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />

      <p role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};

// An application can expose a concise status announcement when a locale switch changes important UI content.

// ---------------------------------------------------------------------
// 39. Update document title when locale changes
// ---------------------------------------------------------------------

const pageTitles: Record<SupportedLocale, string> = {
  "en-US": "Account settings",
  "de-DE": "Kontoeinstellungen",
  "fr-FR": "Paramètres du compte",
};

export const LocalizedDocumentTitle: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  useEffect(() => {
    document.title = pageTitles[locale];
  }, [locale]);

  return <LocaleSelector locale={locale} onLocaleChange={setLocale} />;
};

// Document metadata that is user-facing should be updated when the active locale changes.

// ---------------------------------------------------------------------
// 40. Keep translation keys stable during switching
// ---------------------------------------------------------------------

type SettingsKey = "title" | "description" | "save";

const getSettingsMessage = (locale: SupportedLocale, key: SettingsKey): string => {
  return messages[locale][key];
};

export const StableTranslationLookup: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{getSettingsMessage(locale, "title")}</h1>

      <p>{getSettingsMessage(locale, "description")}</p>
    </section>
  );
};

// The translation key remains constant while only the locale argument changes.

// ---------------------------------------------------------------------
// 41. Locale switching does not change domain data
// ---------------------------------------------------------------------

type User = {
  readonly name: string;
  readonly accountId: string;
};

const user: User = {
  name: "John Doe",
  accountId: "example-account",
};

export const LocaleIndependentData: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{user.name}</p>

      <p>{user.accountId}</p>
    </section>
  );
};

// Switching presentation language should not mutate unrelated domain data.

// ---------------------------------------------------------------------
// 42. Locale switching and numeric data
// ---------------------------------------------------------------------

export const LocaleIndependentNumber: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const value = 1234567.89;

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{new Intl.NumberFormat(locale).format(value)}</p>

      <p>Raw value: {value}</p>
    </section>
  );
};

// The underlying numeric value remains the same; only its presentation changes with the locale.

// ---------------------------------------------------------------------
// 43. Locale switching and dates
// ---------------------------------------------------------------------

export const LocaleIndependentDate: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const timestamp = Date.parse("2026-09-29T12:00:00Z");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeZone: "UTC",
        }).format(timestamp)}
      </p>
    </section>
  );
};

// Store dates as data and format them with the active locale at presentation time.

// ---------------------------------------------------------------------
// 44. Locale switching and currency codes
// ---------------------------------------------------------------------

type Money = {
  readonly amount: number;
  readonly currency: string;
};

const price: Money = {
  amount: 1299.99,
  currency: "EUR",
};

export const LocaleIndependentCurrency: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>
        {new Intl.NumberFormat(locale, {
          style: "currency",
          currency: price.currency,
        }).format(price.amount)}
      </p>
    </section>
  );
};

// The currency code is domain data; locale controls how that currency is presented.

// ---------------------------------------------------------------------
// 45. Locale switching and pluralization
// ---------------------------------------------------------------------

const itemMessages: Record<
  SupportedLocale,
  {
    readonly one: string;
    readonly other: string;
  }
> = {
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

const interpolate = (message: string, values: Record<string, string>): string => {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
};

export const LocalePluralization: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const count = 3;
  const category = new Intl.PluralRules(locale).select(count);
  const key = category === "one" ? "one" : "other";

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>
        {interpolate(itemMessages[locale][key], {
          count: String(count),
        })}
      </p>
    </section>
  );
};

// Plural selection should use the active locale because grammatical categories differ between languages.

// ---------------------------------------------------------------------
// 46. Locale switching and memoized formatting
// ---------------------------------------------------------------------

const formatNumber = (locale: SupportedLocale, value: number): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const LocaleFormattingFunction: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{formatNumber(locale, 1234567.89)}</p>
    </section>
  );
};

// If formatting is extracted or memoized, the locale must remain an input to the formatting operation.

// ---------------------------------------------------------------------
// 47. Locale is a dependency of locale-sensitive computation
// ---------------------------------------------------------------------

type FormattedValueProps = {
  readonly locale: SupportedLocale;
  readonly value: number;
};

export const LocaleDependentComputation: FC<FormattedValueProps> = ({ locale, value }): ReactElement => {
  const formatted = new Intl.NumberFormat(locale).format(value);

  return <p>{formatted}</p>;
};

// Any memoized or cached locale-sensitive computation must be invalidated when its locale changes.

// ---------------------------------------------------------------------
// 48. Avoid a stale formatter
// ---------------------------------------------------------------------

export const FreshFormatter: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const formatter = new Intl.NumberFormat(locale);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{formatter.format(1234567.89)}</p>
    </section>
  );
};

// Constructing the formatter from the current locale ensures the formatter reflects the current selection.

// ---------------------------------------------------------------------
// 49. Cache formatters by locale
// ---------------------------------------------------------------------

const numberFormatters = new Map<SupportedLocale, Intl.NumberFormat>();

const getNumberFormatter = (locale: SupportedLocale): Intl.NumberFormat => {
  const existing = numberFormatters.get(locale);

  if (existing) {
    return existing;
  }

  const formatter = new Intl.NumberFormat(locale);

  numberFormatters.set(locale, formatter);

  return formatter;
};

export const CachedLocaleFormatter: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{getNumberFormatter(locale).format(1234567.89)}</p>
    </section>
  );
};

// Caching can reuse formatters, but the locale must be part of the cache key.

// ---------------------------------------------------------------------
// 50. Locale switching and component props
// ---------------------------------------------------------------------

type LocalizedPanelProps = {
  readonly locale: SupportedLocale;
};

export const LocalizedPanel: FC<LocalizedPanelProps> = ({ locale }): ReactElement => {
  const resource = messages[locale];

  return (
    <section>
      <h2>{resource.title}</h2>

      <p>{resource.description}</p>
    </section>
  );
};

export const LocalePropSwitching: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <LocalizedPanel locale={locale} />
    </section>
  );
};

// Passing the active locale as a prop makes the dependency explicit.

// ---------------------------------------------------------------------
// 51. Locale switching and component keys
// ---------------------------------------------------------------------

export const LocaleAsComponentKey: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <LocalizedPanel key={locale} locale={locale} />
    </section>
  );
};

// Using the locale as a key intentionally remounts the component when the locale changes.
// This is only appropriate when resetting that component's local state is actually desired.

// ---------------------------------------------------------------------
// 52. Do not use a locale key without understanding remounting
// ---------------------------------------------------------------------

type StatefulPanelProps = {
  readonly locale: SupportedLocale;
};

const StatefulPanel: FC<StatefulPanelProps> = ({ locale }): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <section>
      <h2>{messages[locale].title}</h2>

      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </section>
  );
};

export const LocaleKeyStateReset: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <StatefulPanel key={locale} locale={locale} />
    </section>
  );
};

// A key change remounts the component and therefore resets its local state;
// it should not be used merely because the locale changed.

// ---------------------------------------------------------------------
// 53. Locale switching and forms
// ---------------------------------------------------------------------

export const LocalizedForm: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <form>
        <label htmlFor="email">
          {locale === "en-US" ? "Email address" : locale === "de-DE" ? "E-Mail-Adresse" : "Adresse e-mail"}
        </label>

        <input id="email" type="email" />

        <button type="submit">{messages[locale].save}</button>
      </form>
    </section>
  );
};

// Locale switching should update user-facing form labels without discarding unrelated form data.

// ---------------------------------------------------------------------
// 54. Keep form values independent from locale
// ---------------------------------------------------------------------

type FormState = {
  readonly email: string;
};

export const LocaleIndependentFormState: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [form, setForm] = useState<FormState>({
    email: "",
  });

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <label htmlFor="email-address">
        {locale === "en-US" ? "Email address" : locale === "de-DE" ? "E-Mail-Adresse" : "Adresse e-mail"}
      </label>

      <input
        id="email-address"
        value={form.email}
        onChange={(event) => {
          setForm({
            email: event.target.value,
          });
        }}
      />
    </section>
  );
};

// User-entered domain values should normally survive a presentation-language change.

// ---------------------------------------------------------------------
// 55. Locale switching and validation messages
// ---------------------------------------------------------------------

const requiredMessages: Record<SupportedLocale, string> = {
  "en-US": "This field is required.",
  "de-DE": "Dieses Feld ist erforderlich.",
  "fr-FR": "Ce champ est obligatoire.",
};

export const LocalizedValidation: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [showError, setShowError] = useState(false);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <button
        type="button"
        onClick={() => {
          setShowError(true);
        }}
      >
        Validate
      </button>

      {showError && <p role="alert">{requiredMessages[locale]}</p>}
    </section>
  );
};

// Validation state can remain unchanged while its user-facing message is rendered in the active locale.

// ---------------------------------------------------------------------
// 56. Locale switching and error codes
// ---------------------------------------------------------------------

type ErrorCode = "required" | "network";

const errorMessages: Record<SupportedLocale, Record<ErrorCode, string>> = {
  "en-US": {
    required: "This field is required.",
    network: "The network request failed.",
  },
  "de-DE": {
    required: "Dieses Feld ist erforderlich.",
    network: "Die Netzwerkanfrage ist fehlgeschlagen.",
  },
  "fr-FR": {
    required: "Ce champ est obligatoire.",
    network: "La requête réseau a échoué.",
  },
};

export const LocalizedErrorCode: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const errorCode: ErrorCode = "network";

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p role="alert">{errorMessages[locale][errorCode]}</p>
    </section>
  );
};

// Stable error codes allow locale switching without changing the underlying error state.

// ---------------------------------------------------------------------
// 57. Locale switching and navigation
// ---------------------------------------------------------------------

export const LocalizedNavigation: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const navigation =
    locale === "en-US"
      ? {
          home: "Home",
          settings: "Settings",
        }
      : locale === "de-DE"
        ? {
            home: "Startseite",
            settings: "Einstellungen",
          }
        : {
            home: "Accueil",
            settings: "Paramètres",
          };

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <nav aria-label={navigation.settings}>
        <a href="/">{navigation.home}</a>

        <a href="/settings">{navigation.settings}</a>
      </nav>
    </section>
  );
};

// Navigation labels should update when the active locale changes.

// ---------------------------------------------------------------------
// 58. Locale switching and navigation URLs
// ---------------------------------------------------------------------

const localizedPath = (locale: SupportedLocale, path: string): string => {
  return `/${locale}${path}`;
};

export const LocalizedNavigationUrls: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <nav>
        <a href={localizedPath(locale, "/")}>Home</a>

        <a href={localizedPath(locale, "/settings")}>Settings</a>
      </nav>
    </section>
  );
};

// If the routing strategy includes locale-prefixed paths, switching the locale should update the route consistently.

// ---------------------------------------------------------------------
// 59. Preserve the current route during switching
// ---------------------------------------------------------------------

const switchRouteLocale = (currentPath: string, locale: SupportedLocale): string => {
  const normalizedPath = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;

  return `/${locale}${normalizedPath}`;
};

export const PreserveRouteDuringSwitch: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const currentPath = "/settings";

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{switchRouteLocale(currentPath, locale)}</p>
    </section>
  );
};

// A locale switch can preserve the current route while changing only its locale component.

// ---------------------------------------------------------------------
// 60. Locale switching and browser history policy
// ---------------------------------------------------------------------

type HistoryPolicy = "replace" | "push";

const localeHistoryPolicy: HistoryPolicy = "replace";

export const LocaleHistoryPolicy: FC = (): ReactElement => {
  return <p>History policy: {localeHistoryPolicy}</p>;
};

// Whether a locale switch creates a history entry is an application routing decision.

// ---------------------------------------------------------------------
// 61. Locale switching and server-rendered applications
// ---------------------------------------------------------------------

type ServerRenderedLocaleProps = {
  readonly initialLocale: SupportedLocale;
};

export const ServerRenderedLocale: FC<ServerRenderedLocaleProps> = ({ initialLocale }): ReactElement => {
  const [locale, setLocale] = useState(initialLocale);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{messages[locale].title}</h1>
    </section>
  );
};

// A server-rendered application can initialize client locale state from the server-resolved locale.

// ---------------------------------------------------------------------
// 62. Avoid unnecessary locale flicker
// ---------------------------------------------------------------------

export const InitialLocaleWithoutFlicker: FC<ServerRenderedLocaleProps> = ({ initialLocale }): ReactElement => {
  const [locale, setLocale] = useState(initialLocale);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{messages[locale].description}</p>
    </section>
  );
};

// Starting with the locale used for the initial render avoids rendering one locale and immediately replacing it with another.

// ---------------------------------------------------------------------
// 63. Detect and switch only when appropriate
// ---------------------------------------------------------------------

type LocaleSource = "initial" | "user";

type LocaleSelection = {
  readonly locale: SupportedLocale;
  readonly source: LocaleSource;
};

export const LocaleSelectionSource: FC = (): ReactElement => {
  const [selection, setSelection] = useState<LocaleSelection>({
    locale: "en-US",
    source: "initial",
  });

  return (
    <section>
      <LocaleSelector
        locale={selection.locale}
        onLocaleChange={(locale) => {
          setSelection({
            locale,
            source: "user",
          });
        }}
      />

      <p>
        {selection.locale} ({selection.source})
      </p>
    </section>
  );
};

// Tracking how the locale was selected can help prevent automatic mechanisms from overriding explicit user choices.

// ---------------------------------------------------------------------
// 64. Locale switching should be reversible
// ---------------------------------------------------------------------

export const ReversibleLocaleSwitch: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setLocale("en-US");
        }}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => {
          setLocale("de-DE");
        }}
      >
        German
      </button>

      <button
        type="button"
        onClick={() => {
          setLocale("fr-FR");
        }}
      >
        French
      </button>

      <p>{messages[locale].title}</p>
    </section>
  );
};

// Users should be able to move between supported locales without destructive side effects.

// ---------------------------------------------------------------------
// 65. Locale switching should not mutate translation resources
// ---------------------------------------------------------------------

const immutableResources: Readonly<Record<SupportedLocale, Readonly<TranslationResource>>> = messages;

export const ImmutableTranslationResources: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{immutableResources[locale].title}</h1>
    </section>
  );
};

// Switching locales selects another resource; it should not mutate the resource objects themselves.

// ---------------------------------------------------------------------
// 66. Locale switching and resource identity
// ---------------------------------------------------------------------

const getResource = (locale: SupportedLocale): TranslationResource => {
  return immutableResources[locale];
};

export const LocaleResourceIdentity: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const resource = getResource(locale);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>Resource title: {resource.title}</p>
    </section>
  );
};

// Resource selection should be derived from the current locale rather than copied into independent mutable state.

// ---------------------------------------------------------------------
// 67. Locale switching and memoization dependencies
// ---------------------------------------------------------------------

type LocalizedNumberProps = {
  readonly locale: SupportedLocale;
  readonly value: number;
};

const LocalizedNumberValue: FC<LocalizedNumberProps> = ({ locale, value }): ReactElement => {
  const formatted = new Intl.NumberFormat(locale).format(value);

  return <p>{formatted}</p>;
};

export const LocaleMemoizationDependency: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <LocalizedNumberValue locale={locale} value={1234567.89} />
    </section>
  );
};

// Locale-sensitive derived values must be recalculated when the locale changes.

// ---------------------------------------------------------------------
// 68. Locale switching and asynchronous persistence
// ---------------------------------------------------------------------

const persistLocaleAsync = async (locale: SupportedLocale): Promise<void> => {
  await Promise.resolve();

  if (typeof window !== "undefined") {
    window.localStorage.setItem(localeStorageKey, locale);
  }
};

export const AsyncLocalePersistence: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    void persistLocaleAsync(nextLocale);
  };

  return <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />;
};

// Persistence can happen asynchronously without making the UI wait before reflecting the user's selection.

// ---------------------------------------------------------------------
// 69. Locale switching and server synchronization
// ---------------------------------------------------------------------

const updateServerLocale = async (locale: SupportedLocale): Promise<void> => {
  await Promise.resolve(locale);
};

export const ServerSynchronizedLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    void updateServerLocale(nextLocale);
  };

  return <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />;
};

// If the selected locale is synchronized with a server-side preference, the UI can update immediately while persistence happens separately.

// ---------------------------------------------------------------------
// 70. Avoid blocking the locale switch unnecessarily
// ---------------------------------------------------------------------

export const ImmediateLocaleUpdate: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    void persistLocaleAsync(nextLocale);
  };

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />

      <h1>{messages[locale].title}</h1>
    </section>
  );
};

// The local UI state can change immediately rather than waiting for persistence to complete.

// ---------------------------------------------------------------------
// 71. Locale switching and failure to persist
// ---------------------------------------------------------------------

const tryPersistLocale = async (locale: SupportedLocale): Promise<boolean> => {
  try {
    await persistLocaleAsync(locale);
    return true;
  } catch {
    return false;
  }
};

export const LocalePersistenceFailure: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [persistenceFailed, setPersistenceFailed] = useState(false);

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);

    void tryPersistLocale(nextLocale).then((success) => {
      setPersistenceFailed(!success);
    });
  };

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={handleLocaleChange} />

      {persistenceFailed && <p role="status">Your language preference could not be saved.</p>}
    </section>
  );
};

// A persistence failure does not necessarily mean the current in-memory locale switch should be reverted.

// ---------------------------------------------------------------------
// 72. Locale switching and concurrent requests
// ---------------------------------------------------------------------

type LocaleRequest = {
  readonly id: number;
  readonly locale: SupportedLocale;
};

const isLatestRequest = (request: LocaleRequest, latestId: number): boolean => {
  return request.id === latestId;
};

export const LatestLocaleRequest: FC = (): ReactElement => {
  const request: LocaleRequest = {
    id: 1,
    locale: "de-DE",
  };

  return (
    <p>
      Request {request.id}: {request.locale} — {isLatestRequest(request, 1) ? "latest" : "stale"}
    </p>
  );
};

// When several locale resources can load concurrently, only the latest requested locale should update the active state.

// ---------------------------------------------------------------------
// 73. Locale switching and error recovery
// ---------------------------------------------------------------------

type ResourceState = {
  readonly locale: SupportedLocale;
  readonly status: "ready" | "error";
};

export const LocaleResourceRecovery: FC = (): ReactElement => {
  const [state, setState] = useState<ResourceState>({
    locale: "en-US",
    status: "ready",
  });

  const switchLocale = (locale: SupportedLocale): void => {
    setState({
      locale,
      status: "ready",
    });
  };

  return (
    <section>
      <LocaleSelector locale={state.locale} onLocaleChange={switchLocale} />

      {state.status === "error" ? (
        <p role="alert">Translation resource failed to load.</p>
      ) : (
        <h1>{messages[state.locale].title}</h1>
      )}
    </section>
  );
};

// A resource-loading failure should have an explicit recovery or fallback path.

// ---------------------------------------------------------------------
// 74. Locale switching and fallback resource
// ---------------------------------------------------------------------

const getResourceWithFallback = (locale: SupportedLocale): TranslationResource => {
  return messages[locale] ?? messages["en-US"];
};

export const LocaleResourceFallback: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <h1>{getResourceWithFallback(locale).title}</h1>
    </section>
  );
};

// A fallback resource can prevent missing data from producing unusable UI.

// ---------------------------------------------------------------------
// 75. Locale switching and language names
// ---------------------------------------------------------------------

const getLocalizedLanguageName = (locale: SupportedLocale, language: SupportedLocale): string => {
  return (
    new Intl.DisplayNames([locale], {
      type: "language",
    }).of(new Intl.Locale(language).language) ?? language
  );
};

export const LocalizedLanguageNames: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <ul>
        {supportedLocales.map((supportedLocale) => (
          <li key={supportedLocale}>{getLocalizedLanguageName(locale, supportedLocale)}</li>
        ))}
      </ul>
    </section>
  );
};

// Language names can themselves be localized so that the selector remains understandable in the active interface language.

// ---------------------------------------------------------------------
// 76. Locale switching and option labels
// ---------------------------------------------------------------------

export const LocalizedSelectorLabels: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  return (
    <label>
      {locale === "en-US" ? "Language" : locale === "de-DE" ? "Sprache" : "Langue"}
      <select
        value={locale}
        onChange={(event) => {
          const value = event.target.value;

          if (isSupportedLocale(value)) {
            setLocale(value);
          }
        }}
      >
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {getLocalizedLanguageName(locale, supportedLocale)}
          </option>
        ))}
      </select>
    </label>
  );
};

// The selector itself can remain localized as the active interface language changes.

// ---------------------------------------------------------------------
// 77. Locale switching and default selection
// ---------------------------------------------------------------------

const defaultSelectedLocale: SupportedLocale = "en-US";

export const DefaultSelection: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(defaultSelectedLocale);

  return <LocaleSelector locale={locale} onLocaleChange={setLocale} />;
};

// The default selection should always be a locale supported by the application.

// ---------------------------------------------------------------------
// 78. Locale switching and reset behavior
// ---------------------------------------------------------------------

export const ResetToDefaultLocale: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("de-DE");

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <button
        type="button"
        onClick={() => {
          setLocale(defaultSelectedLocale);
        }}
      >
        Reset language
      </button>
    </section>
  );
};

// An application can provide a reset action that returns the locale to its defined default.

// ---------------------------------------------------------------------
// 79. Locale switching should preserve application semantics
// ---------------------------------------------------------------------

type Order = {
  readonly status: "pending" | "complete";
  readonly total: number;
};

const order: Order = {
  status: "pending",
  total: 1299.99,
};

export const PreserveApplicationSemantics: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const status =
    order.status === "pending"
      ? locale === "en-US"
        ? "Pending"
        : locale === "de-DE"
          ? "Ausstehend"
          : "En attente"
      : locale === "en-US"
        ? "Complete"
        : locale === "de-DE"
          ? "Abgeschlossen"
          : "Terminée";

  const total = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(order.total);

  return (
    <section>
      <LocaleSelector locale={locale} onLocaleChange={setLocale} />

      <p>{status}</p>

      <p>{total}</p>
    </section>
  );
};

// The order's status and amount remain the same while their presentation changes with the locale.

// ---------------------------------------------------------------------
// 80. Integrated locale-switching example
// ---------------------------------------------------------------------

type LocaleSwitchExampleProps = {
  readonly initialLocale?: SupportedLocale;
};

const exampleMessages: Record<
  SupportedLocale,
  {
    readonly navigationLabel: string;
    readonly home: string;
    readonly settings: string;
    readonly title: string;
    readonly description: string;
    readonly emailLabel: string;
    readonly save: string;
    readonly switchLanguage: string;
    readonly saved: string;
  }
> = {
  "en-US": {
    navigationLabel: "Main navigation",
    home: "Home",
    settings: "Settings",
    title: "Account settings",
    description: "Manage your account.",
    emailLabel: "Email address",
    save: "Save changes",
    switchLanguage: "Language",
    saved: "Changes saved.",
  },
  "de-DE": {
    navigationLabel: "Hauptnavigation",
    home: "Startseite",
    settings: "Einstellungen",
    title: "Kontoeinstellungen",
    description: "Verwalten Sie Ihr Konto.",
    emailLabel: "E-Mail-Adresse",
    save: "Änderungen speichern",
    switchLanguage: "Sprache",
    saved: "Änderungen gespeichert.",
  },
  "fr-FR": {
    navigationLabel: "Navigation principale",
    home: "Accueil",
    settings: "Paramètres",
    title: "Paramètres du compte",
    description: "Gérez votre compte.",
    emailLabel: "Adresse e-mail",
    save: "Enregistrer les modifications",
    switchLanguage: "Langue",
    saved: "Modifications enregistrées.",
  },
};

export const LocaleSwitchingExample: FC<LocaleSwitchExampleProps> = ({ initialLocale = "en-US" }): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);
  const [saved, setSaved] = useState(false);
  const resource = exampleMessages[locale];

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
    setSaved(false);
  };

  return (
    <main lang={new Intl.Locale(locale).language}>
      <label>
        {resource.switchLanguage}
        <select
          value={locale}
          onChange={(event) => {
            const value = event.target.value;

            if (isSupportedLocale(value)) {
              handleLocaleChange(value);
            }
          }}
        >
          {supportedLocales.map((supportedLocale) => (
            <option key={supportedLocale} value={supportedLocale}>
              {getLocalizedLanguageName(locale, supportedLocale)}
            </option>
          ))}
        </select>
      </label>

      <nav aria-label={resource.navigationLabel}>
        <a href="/">{resource.home}</a>

        <a href="/settings">{resource.settings}</a>
      </nav>

      <h1>{resource.title}</h1>

      <p>{resource.description}</p>

      <label htmlFor="account-email">{resource.emailLabel}</label>

      <input id="account-email" type="email" />

      <p>
        {new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "EUR",
        }).format(1299.99)}
      </p>

      <p>
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeZone: "UTC",
        }).format(new Date("2026-09-29T12:00:00Z"))}
      </p>

      <button
        type="button"
        onClick={() => {
          setSaved(true);
        }}
      >
        {resource.save}
      </button>

      {saved && (
        <p role="status" aria-live="polite">
          {resource.saved}
        </p>
      )}
    </main>
  );
};

export default LocaleSwitchingExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Locale switching changes the active locale used by the application's presentation layer.
// - The active locale should be restricted to locales that the application actually supports.
// - A controlled selector provides an explicit mechanism for changing the locale.
// - Locale state should have one authoritative source rather than being duplicated across components.
// - Translation resources should be selected from the active locale rather than mutated during switching.
// - Intl formatters such as NumberFormat, DateTimeFormat, RelativeTimeFormat, ListFormat, and Collator should receive the active locale.
// - Locale-sensitive computations and cached formatters must account for locale changes.
// - Application logic should use stable domain identifiers rather than translated strings.
// - User-entered values and domain data should normally remain unchanged when only the presentation locale changes.
// - Persisted locale values are external runtime data and must be validated before use.
// - A locale can be represented in URL state when the application's routing strategy requires it.
// - URL replacement and history behavior are separate routing decisions.
// - Server-rendered applications can provide an initial locale to avoid unnecessary locale flicker during hydration.
// - Asynchronous translation resources require explicit loading, failure, fallback, and stale-request handling.
// - A newer locale request should not be overwritten by an older asynchronous request.
// - Locale switching can require updating language metadata, text direction, document titles, accessible labels, and other user-facing content.
// - A locale change should not automatically remount components unless resetting their local state is intentional.
// - Translation keys remain stable across locale changes; only their localized values change.
// - Explicit user selections should be distinguished from automatically detected locale values when persistence or precedence matters.
// - Locale switching should be reversible and should preserve application semantics while changing presentation.

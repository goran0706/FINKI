/**
 * Internationalized Forms
 * ========================
 *
 * Internationalized forms account for differences in language, names, addresses, dates,
 * numbers, currencies, phone numbers, input direction, and browser-assisted form filling.
 * A robust form preserves the user's original data while adapting labels, formatting,
 * validation messages, and field structure to the user's locale and the relevant country.
 */

import { useMemo, useState, type ChangeEvent, type FormEvent, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Locale types
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE" | "fr-FR" | "ar";

const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en-US", "de-DE", "fr-FR", "ar"];

const DEFAULT_LOCALE: SupportedLocale = "en-US";

console.log(SUPPORTED_LOCALES); // ["en-US", "de-DE", "fr-FR", "ar"]

// ---------------------------------------------------------------------
// 2. Country types
// ---------------------------------------------------------------------

type CountryCode = "US" | "DE" | "FR" | "MK" | "EG";

interface CountryOption {
  readonly code: CountryCode;
  readonly name: string;
}

const COUNTRIES: readonly CountryOption[] = [
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "MK", name: "North Macedonia" },
  { code: "EG", name: "Egypt" },
];

// Country and locale are related concepts, but they are not interchangeable.
// A locale describes language and regional conventions; a country identifies a territory.

// ---------------------------------------------------------------------
// 3. Localized messages
// ---------------------------------------------------------------------

interface FormMessages {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly postalCode: string;
  readonly country: string;
  readonly amount: string;
  readonly date: string;
  readonly submit: string;
  readonly required: string;
  readonly invalidEmail: string;
  readonly invalidAmount: string;
  readonly invalidDate: string;
}

const MESSAGES: Record<SupportedLocale, FormMessages> = {
  "en-US": {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    postalCode: "Postal code",
    country: "Country",
    amount: "Amount",
    date: "Date",
    submit: "Submit",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    invalidAmount: "Enter a valid amount.",
    invalidDate: "Enter a valid date.",
  },
  "de-DE": {
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    city: "Stadt",
    postalCode: "Postleitzahl",
    country: "Land",
    amount: "Betrag",
    date: "Datum",
    submit: "Absenden",
    required: "Dieses Feld ist erforderlich.",
    invalidEmail: "Geben Sie eine gültige E-Mail-Adresse ein.",
    invalidAmount: "Geben Sie einen gültigen Betrag ein.",
    invalidDate: "Geben Sie ein gültiges Datum ein.",
  },
  "fr-FR": {
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    address: "Adresse",
    city: "Ville",
    postalCode: "Code postal",
    country: "Pays",
    amount: "Montant",
    date: "Date",
    submit: "Envoyer",
    required: "Ce champ est obligatoire.",
    invalidEmail: "Saisissez une adresse e-mail valide.",
    invalidAmount: "Saisissez un montant valide.",
    invalidDate: "Saisissez une date valide.",
  },
  ar: {
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    city: "المدينة",
    postalCode: "الرمز البريدي",
    country: "الدولة",
    amount: "المبلغ",
    date: "التاريخ",
    submit: "إرسال",
    required: "هذا الحقل مطلوب.",
    invalidEmail: "أدخل عنوان بريد إلكتروني صالحًا.",
    invalidAmount: "أدخل مبلغًا صالحًا.",
    invalidDate: "أدخل تاريخًا صالحًا.",
  },
};

// Form labels and validation messages are content that belongs in translation resources.
// Locale-sensitive data formatting is handled separately by Intl APIs.

// ---------------------------------------------------------------------
// 4. Locale direction
// ---------------------------------------------------------------------

const RTL_LOCALES: readonly SupportedLocale[] = ["ar"];

const getDirection = (locale: SupportedLocale): "ltr" | "rtl" => {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
};

console.log(getDirection("en-US")); // "ltr"
console.log(getDirection("ar")); // "rtl"

// ---------------------------------------------------------------------
// 5. Basic form state
// ---------------------------------------------------------------------

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: CountryCode;
  amount: string;
  date: string;
}

const INITIAL_FORM_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "US",
  amount: "",
  date: "",
};

console.log(INITIAL_FORM_VALUES.country); // "US"

// Form state should preserve user-entered values as data.
// Do not replace raw user input with a localized display string unless the field
// is explicitly designed around localized editing behavior.

// ---------------------------------------------------------------------
// 6. Locale-aware number formatting
// ---------------------------------------------------------------------

const formatNumber = (value: number, locale: SupportedLocale): string => {
  return new Intl.NumberFormat(locale).format(value);
};

console.log(formatNumber(1234567.89, "en-US")); // "1,234,567.89"
console.log(formatNumber(1234567.89, "de-DE")); // "1.234.567,89"

// Intl.NumberFormat produces locale-sensitive presentation for numeric data.
// :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 7. Currency formatting
// ---------------------------------------------------------------------

const formatCurrency = (value: number, locale: SupportedLocale, currency: string): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

console.log(formatCurrency(1234.5, "en-US", "USD"));
console.log(formatCurrency(1234.5, "de-DE", "EUR"));

// The currency code is data; the placement and presentation of the currency
// are determined by the formatter and locale.

// ---------------------------------------------------------------------
// 8. Localized date formatting
// ---------------------------------------------------------------------

const formatDate = (date: Date, locale: SupportedLocale): string => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);
};

const exampleDate = new Date("2026-09-29T12:00:00Z");

console.log(formatDate(exampleDate, "en-US"));
console.log(formatDate(exampleDate, "de-DE"));
console.log(formatDate(exampleDate, "fr-FR"));

// Date presentation should be localized separately from the underlying timestamp.
// Intl.DateTimeFormat applies locale-sensitive date conventions. :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 9. Input values versus formatted values
// ---------------------------------------------------------------------

const rawAmount = "1234.50";
const numericAmount = Number(rawAmount);

console.log(rawAmount); // "1234.50"
console.log(formatCurrency(numericAmount, "en-US", "USD"));

// A text input can preserve the user's raw representation while the application
// separately parses and formats the semantic numeric value.

// ---------------------------------------------------------------------
// 10. Locale-aware form container
// ---------------------------------------------------------------------

interface LocalizedFormProps {
  readonly locale: SupportedLocale;
}

export const LocalizedFormContainer: FC<LocalizedFormProps> = ({ locale }): ReactElement => {
  const messages = MESSAGES[locale];

  return (
    <form lang={locale} dir={getDirection(locale)}>
      <label>
        {messages.firstName}
        <input name="firstName" type="text" autoComplete="given-name" />
      </label>
    </form>
  );
};

// The lang attribute identifies the language of the form content.
// Direction can be changed at the form boundary when the locale requires RTL.

// ---------------------------------------------------------------------
// 11. Native labels remain important
// ---------------------------------------------------------------------

export const LocalizedLabelExample: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email</label>

      <input id="email" name="email" type="email" autoComplete="email" />
    </form>
  );
};

// Localization does not replace ordinary form semantics.
// A visible label should remain programmatically associated with its control.

// ---------------------------------------------------------------------
// 12. Autocomplete metadata
// ---------------------------------------------------------------------

export const AddressAutocompleteExample: FC = (): ReactElement => {
  return (
    <form autoComplete="shipping">
      <label htmlFor="first-name">First name</label>
      <input id="first-name" name="firstName" autoComplete="given-name" />

      <label htmlFor="last-name">Last name</label>
      <input id="last-name" name="lastName" autoComplete="family-name" />

      <label htmlFor="street-address">Address</label>
      <input id="street-address" name="address" autoComplete="street-address" />

      <label htmlFor="postal-code">Postal code</label>
      <input id="postal-code" name="postalCode" autoComplete="postal-code" />
    </form>
  );
};

// autocomplete tokens communicate the semantic kind of information expected
// by the browser and assist users with stored form data. :contentReference[oaicite:2]{index=2}

// ---------------------------------------------------------------------
// 13. Language autocomplete
// ---------------------------------------------------------------------

export const LanguageAutocompleteExample: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="preferred-language">Preferred language</label>

      <input id="preferred-language" name="language" autoComplete="language" />
    </form>
  );
};

// The autocomplete "language" token represents a preferred language
// expressed as a BCP 47 language tag. :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 14. Country selection
// ---------------------------------------------------------------------

interface CountrySelectProps {
  readonly value: CountryCode;
  readonly onChange: (country: CountryCode) => void;
  readonly label: string;
}

export const CountrySelect: FC<CountrySelectProps> = ({ value, onChange, label }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as CountryCode);
  };

  return (
    <label>
      {label}
      <select name="country" value={value} autoComplete="country" onChange={handleChange}>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </label>
  );
};

// Country selection should use stable country codes as submitted values.
// The visible country names can be localized independently.

// ---------------------------------------------------------------------
// 15. Localized country names
// ---------------------------------------------------------------------

const getLocalizedCountryName = (countryCode: CountryCode, locale: SupportedLocale): string => {
  return (
    new Intl.DisplayNames(locale, {
      type: "region",
    }).of(countryCode) ?? countryCode
  );
};

console.log(getLocalizedCountryName("DE", "en-US")); // "Germany"
console.log(getLocalizedCountryName("DE", "de-DE")); // "Deutschland"
console.log(getLocalizedCountryName("DE", "fr-FR")); // "Allemagne"

// Display names can localize country names without changing their stable codes.

// ---------------------------------------------------------------------
// 16. Localized country selector
// ---------------------------------------------------------------------

export const LocalizedCountrySelect: FC<
  CountrySelectProps & {
    readonly locale: SupportedLocale;
  }
> = ({ value, onChange, label, locale }): ReactElement => {
  const countries = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        ...country,
        name: getLocalizedCountryName(country.code, locale),
      })),
    [locale],
  );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as CountryCode);
  };

  return (
    <label>
      {label}
      <select name="country" value={value} autoComplete="country" onChange={handleChange}>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </label>
  );
};

// Stable submitted values and localized visible labels are separate concerns.

// ---------------------------------------------------------------------
// 17. Name fields are culturally variable
// ---------------------------------------------------------------------

interface NameFieldsProps {
  readonly messages: FormMessages;
}

export const NameFields: FC<NameFieldsProps> = ({ messages }): ReactElement => {
  return (
    <>
      <label>
        {messages.firstName}
        <input name="firstName" type="text" autoComplete="given-name" />
      </label>

      <label>
        {messages.lastName}
        <input name="lastName" type="text" autoComplete="family-name" />
      </label>
    </>
  );
};

// Do not assume every culture uses the same name structure.
// Some forms may need additional fields or a single full-name field depending
// on the application's target populations and data requirements.

// ---------------------------------------------------------------------
// 18. Avoid artificial name restrictions
// ---------------------------------------------------------------------

const isReasonableName = (value: string): boolean => {
  return value.trim().length > 0;
};

console.log(isReasonableName("Ana María")); // true
console.log(isReasonableName("山田")); // true
console.log(isReasonableName("محمد")); // true

// Avoid validation rules that assume names contain only ASCII letters,
// one space, or a particular first-name/last-name structure.

// ---------------------------------------------------------------------
// 19. Name input attributes
// ---------------------------------------------------------------------

export const NameInputExample: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Full name
        <input name="name" type="text" autoComplete="name" autoCapitalize="words" />
      </label>
    </form>
  );
};

// The autocomplete "name" token communicates that the field represents
// a person's full name. :contentReference[oaicite:4]{index=4}

// ---------------------------------------------------------------------
// 20. Address structure varies by country
// ---------------------------------------------------------------------

interface AddressFieldsProps {
  readonly messages: FormMessages;
}

export const AddressFields: FC<AddressFieldsProps> = ({ messages }): ReactElement => {
  return (
    <>
      <label>
        {messages.address}
        <input name="address" autoComplete="street-address" />
      </label>

      <label>
        {messages.city}
        <input name="city" autoComplete="address-level2" />
      </label>

      <label>
        {messages.postalCode}
        <input name="postalCode" autoComplete="postal-code" />
      </label>
    </>
  );
};

// Address components differ between countries.
// A single fixed field order should not be treated as a universal postal standard.
// :contentReference[oaicite:5]{index=5}

// ---------------------------------------------------------------------
// 21. Country-specific address layouts
// ---------------------------------------------------------------------

interface AddressLayoutProps {
  readonly country: CountryCode;
  readonly messages: FormMessages;
}

export const AddressLayout: FC<AddressLayoutProps> = ({ country, messages }): ReactElement => {
  if (country === "US") {
    return (
      <>
        <label>
          {messages.address}
          <input name="street" autoComplete="street-address" />
        </label>

        <label>
          {messages.city}
          <input name="city" autoComplete="address-level2" />
        </label>

        <label>
          {messages.postalCode}
          <input name="postalCode" autoComplete="postal-code" />
        </label>
      </>
    );
  }

  return (
    <>
      <label>
        {messages.address}
        <input name="street" autoComplete="street-address" />
      </label>

      <label>
        {messages.postalCode}
        <input name="postalCode" autoComplete="postal-code" />
      </label>

      <label>
        {messages.city}
        <input name="city" autoComplete="address-level2" />
      </label>
    </>
  );
};

// Different countries can require different address components and ordering.
// W3C explicitly recommends supporting local address formats rather than
// assuming one universal structure. :contentReference[oaicite:6]{index=6}

// ---------------------------------------------------------------------
// 22. Administrative address levels
// ---------------------------------------------------------------------

export const AdministrativeAddressExample: FC = (): ReactElement => {
  return (
    <form>
      <label>
        State or region
        <input name="region" autoComplete="address-level1" />
      </label>

      <label>
        City
        <input name="city" autoComplete="address-level2" />
      </label>
    </form>
  );
};

// address-level1 is the broadest administrative subdivision below the country.
// Lower levels represent progressively more specific administrative areas.
// :contentReference[oaicite:7]{index=7}

// ---------------------------------------------------------------------
// 23. Postal code is not universally numeric
// ---------------------------------------------------------------------

const postalCodes = ["10001", "10115", "75008", "1000"] as const;

console.log(postalCodes);

// Postal codes should generally be modeled as strings.
// Numeric conversion can remove leading zeroes and incorrectly restrict formats.

// ---------------------------------------------------------------------
// 24. Postal code input
// ---------------------------------------------------------------------

export const PostalCodeInput: FC<{
  readonly label: string;
}> = ({ label }): ReactElement => {
  return (
    <label>
      {label}
      <input name="postalCode" type="text" inputMode="text" autoComplete="postal-code" />
    </label>
  );
};

// Postal codes can contain letters, spaces, hyphens, and leading zeroes.
// Validation rules should follow the selected country's actual requirements.

// ---------------------------------------------------------------------
// 25. Phone numbers are structured strings
// ---------------------------------------------------------------------

const phoneNumber = "+389 70 123 456";

console.log(phoneNumber);

// Telephone numbers should not be stored as JavaScript numeric values.
// Numeric types cannot preserve formatting characters and may lose leading digits.

// ---------------------------------------------------------------------
// 26. Telephone input
// ---------------------------------------------------------------------

export const TelephoneInput: FC<{
  readonly label: string;
}> = ({ label }): ReactElement => {
  return (
    <label>
      {label}
      <input name="phone" type="tel" autoComplete="tel" inputMode="tel" />
    </label>
  );
};

// type="tel" communicates the semantic purpose of the field and can allow
// browsers and devices to provide an appropriate input interface.

// ---------------------------------------------------------------------
// 27. Phone normalization
// ---------------------------------------------------------------------

const normalizePhone = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

console.log(normalizePhone("+389   70   123 456"));
// "+389 70 123 456"

// Normalization should not be confused with full international phone-number
// validation. Real applications should use appropriate telephone-number rules
// or libraries when validation is required.

// ---------------------------------------------------------------------
// 28. Email addresses
// ---------------------------------------------------------------------

export const EmailInput: FC<{
  readonly label: string;
}> = ({ label }): ReactElement => {
  return (
    <label>
      {label}
      <input name="email" type="email" autoComplete="email" inputMode="email" />
    </label>
  );
};

// Email addresses are not ordinary localized display strings.
// Do not automatically translate or case-transform the user's email address.

// ---------------------------------------------------------------------
// 29. Email validation
// ---------------------------------------------------------------------

const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

console.log(isValidEmail("person@example.com")); // true
console.log(isValidEmail("invalid")); // false

// This is intentionally a minimal application-level check.
// Email validation should not attempt to encode every possible address syntax.

// ---------------------------------------------------------------------
// 30. Date input semantics
// ---------------------------------------------------------------------

export const DateInputExample: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Date
        <input name="date" type="date" autoComplete="bday" />
      </label>
    </form>
  );
};

// Native date controls have locale-sensitive presentation while their value
// is exposed in a standardized form suitable for application processing.
// The visible control UI should not be assumed to look identical across browsers.

// ---------------------------------------------------------------------
// 31. Date strings should not be parsed as locale display strings
// ---------------------------------------------------------------------

const dateInputValue = "2026-09-29";

console.log(dateInputValue); // "2026-09-29"

// A native date input value uses a machine-oriented representation.
// Do not interpret "29.09.2026" or "09/29/2026" by assuming one locale.

// ---------------------------------------------------------------------
// 32. Formatting a submitted date
// ---------------------------------------------------------------------

const formatSubmittedDate = (value: string, locale: SupportedLocale): string => {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
};

console.log(formatSubmittedDate("2026-09-29", "en-US"));
console.log(formatSubmittedDate("2026-09-29", "de-DE"));

// The stored date value remains stable while presentation is localized.

// ---------------------------------------------------------------------
// 33. Number input localization
// ---------------------------------------------------------------------

export const NumberInputExample: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Amount
        <input name="amount" type="number" inputMode="decimal" />
      </label>
    </form>
  );
};

// Native number inputs have locale-dependent UI behavior in some browsers.
// Their exact accepted text representation should not be assumed to be identical
// across locales or browser implementations. :contentReference[oaicite:8]{index=8}

// ---------------------------------------------------------------------
// 34. Text input for locale-specific decimal editing
// ---------------------------------------------------------------------

export const LocalizedDecimalTextInput: FC = (): ReactElement => {
  return (
    <label>
      Amount
      <input name="amount" type="text" inputMode="decimal" dir="auto" />
    </label>
  );
};

// A text input can be appropriate when the application explicitly wants to
// implement locale-aware parsing and formatting itself.
// This requires a well-defined parsing strategy rather than simply replacing
// punctuation characters.

// ---------------------------------------------------------------------
// 35. Parsing localized decimal input
// ---------------------------------------------------------------------

const parseLocalizedDecimal = (value: string, locale: SupportedLocale): number | undefined => {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);

  const group = parts.find((part) => part.type === "group")?.value ?? ",";
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";

  const normalized = value.replaceAll(group, "").replace(decimal, ".").trim();

  const number = Number(normalized);

  return Number.isFinite(number) ? number : undefined;
};

console.log(parseLocalizedDecimal("1,234.50", "en-US")); // 1234.5
console.log(parseLocalizedDecimal("1.234,50", "de-DE")); // 1234.5

// Locale-aware parsing is more involved than formatting because user input
// can contain grouping characters, whitespace, signs, and other conventions.

// ---------------------------------------------------------------------
// 36. Formatting an editing value
// ---------------------------------------------------------------------

const formatEditableAmount = (value: number, locale: SupportedLocale): string => {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
};

console.log(formatEditableAmount(1234.5, "en-US"));
console.log(formatEditableAmount(1234.5, "de-DE"));

// Formatting is straightforward after the semantic number has been parsed.
// Editing behavior should avoid unexpectedly changing the user's cursor position.

// ---------------------------------------------------------------------
// 37. Do not format on every keystroke without a policy
// ---------------------------------------------------------------------

const editingValues = ["", "-", "1", "1.", "1.2"] as const;

console.log(editingValues);

// Intermediate input states can be temporarily invalid as complete numbers.
// A controlled numeric field therefore needs an editing model that can represent
// transient strings instead of forcing every keystroke through Number().

// ---------------------------------------------------------------------
// 38. Currency input versus currency display
// ---------------------------------------------------------------------

interface MoneyValue {
  readonly amount: number;
  readonly currency: string;
}

const money: MoneyValue = {
  amount: 1234.5,
  currency: "EUR",
};

console.log(money);

// Store the numeric amount and currency code separately.
// The formatted currency string is a presentation result.

// ---------------------------------------------------------------------
// 39. Currency field
// ---------------------------------------------------------------------

interface CurrencyFieldProps {
  readonly locale: SupportedLocale;
  readonly currency: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly label: string;
}

export const CurrencyField: FC<CurrencyFieldProps> = ({ locale, currency, value, onChange, label }): ReactElement => {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }),
    [locale, currency],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  const parsedValue = parseLocalizedDecimal(value, locale);

  return (
    <div>
      <label>
        {label}
        <input name="amount" type="text" inputMode="decimal" value={value} onChange={handleChange} />
      </label>

      {parsedValue !== undefined && <output>{formatter.format(parsedValue)}</output>}
    </div>
  );
};

// The input stores the editing string; the output displays the parsed semantic value.
// This separation avoids conflating editing state with presentation formatting.

// ---------------------------------------------------------------------
// 40. Locale-aware decimal separators
// ---------------------------------------------------------------------

const decimalSeparators = SUPPORTED_LOCALES.map((locale) => {
  const parts = new Intl.NumberFormat(locale).formatToParts(1.5);

  return {
    locale,
    decimal: parts.find((part) => part.type === "decimal")?.value,
  };
});

console.log(decimalSeparators);

// Decimal separators are locale-dependent.
// Applications should not assume "." is the user's displayed decimal separator.

// ---------------------------------------------------------------------
// 41. Date order is locale-dependent
// ---------------------------------------------------------------------

const dateExamples = SUPPORTED_LOCALES.map((locale) => ({
  locale,
  value: new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(exampleDate),
}));

console.log(dateExamples);

// Date ordering and punctuation are presentation details supplied by Intl.

// ---------------------------------------------------------------------
// 42. Validation messages are localized
// ---------------------------------------------------------------------

const getRequiredMessage = (locale: SupportedLocale): string => {
  return MESSAGES[locale].required;
};

console.log(getRequiredMessage("en-US"));
console.log(getRequiredMessage("de-DE"));
console.log(getRequiredMessage("ar"));

// Validation logic and validation message content should remain separate.

// ---------------------------------------------------------------------
// 43. Validation result type
// ---------------------------------------------------------------------

interface FieldErrors {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly amount?: string;
  readonly date?: string;
}

const validateForm = (values: FormValues, locale: SupportedLocale): FieldErrors => {
  const messages = MESSAGES[locale];
  const errors: Record<string, string> = {};

  if (!values.firstName.trim()) {
    errors.firstName = messages.required;
  }

  if (!values.lastName.trim()) {
    errors.lastName = messages.required;
  }

  if (!values.email.trim()) {
    errors.email = messages.required;
  } else if (!isValidEmail(values.email)) {
    errors.email = messages.invalidEmail;
  }

  if (values.amount.trim()) {
    const amount = parseLocalizedDecimal(values.amount, locale);

    if (amount === undefined) {
      errors.amount = messages.invalidAmount;
    }
  }

  if (!values.date.trim()) {
    errors.date = messages.required;
  }

  return errors;
};

console.log(validateForm(INITIAL_FORM_VALUES, "en-US"));

// Validation checks data; localization supplies the user-facing explanation.

// ---------------------------------------------------------------------
// 44. Server-side validation remains necessary
// ---------------------------------------------------------------------

const submittedValues = {
  email: "person@example.com",
};

console.log(submittedValues);

// Client-side validation improves interaction but does not establish trust.
// Submitted form data must be validated again by the server.
// MDN explicitly recommends server-side validation in addition to client-side
// constraint validation. :contentReference[oaicite:9]{index=9}

// ---------------------------------------------------------------------
// 45. Constraint validation
// ---------------------------------------------------------------------

export const ConstraintValidationExample: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// Native constraint validation can provide browser-level checks.
// Its messages and UI are browser-controlled, so applications should not assume
// they will have identical wording across locales and browsers.

// ---------------------------------------------------------------------
// 46. Custom localized validation messages
// ---------------------------------------------------------------------

interface LocalizedErrorProps {
  readonly message: string | undefined;
}

export const LocalizedError: FC<LocalizedErrorProps> = ({ message }): ReactElement | null => {
  if (!message) {
    return null;
  }

  return <p role="alert">{message}</p>;
};

// Custom application validation messages can be translated consistently
// with the rest of the interface.

// ---------------------------------------------------------------------
// 47. Associating errors with controls
// ---------------------------------------------------------------------

export const AccessibleLocalizedError: FC<
  LocalizedErrorProps & {
    readonly inputId: string;
  }
> = ({ message, inputId }): ReactElement | null => {
  if (!message) {
    return null;
  }

  return <p id={`${inputId}-error`}>{message}</p>;
};

// The corresponding input can reference the error with aria-describedby.
// Localization should not break the programmatic relationship between controls
// and their error descriptions.

// ---------------------------------------------------------------------
// 48. Localized required indicator
// ---------------------------------------------------------------------

interface RequiredFieldProps {
  readonly label: string;
  readonly required: boolean;
}

export const RequiredFieldLabel: FC<RequiredFieldProps> = ({ label, required }): ReactElement => {
  return (
    <span>
      {label}
      {required && " *"}
    </span>
  );
};

// The visual marker is not itself the validation mechanism.
// The control should still use the appropriate required semantics.

// ---------------------------------------------------------------------
// 49. Required input semantics
// ---------------------------------------------------------------------

export const RequiredInputExample: FC = (): ReactElement => {
  return (
    <label>
      First name
      <input name="firstName" required autoComplete="given-name" />
    </label>
  );
};

// The required attribute communicates that the field must have a value.

// ---------------------------------------------------------------------
// 50. Locale-aware input direction
// ---------------------------------------------------------------------

export const DirectionAwareInput: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  return (
    <label lang={locale} dir={getDirection(locale)}>
      {MESSAGES[locale].address}
      <input name="address" dir="auto" autoComplete="street-address" />
    </label>
  );
};

// dir="auto" can be useful for user-entered text whose direction is not known
// in advance. The surrounding form can still establish the interface direction.

// ---------------------------------------------------------------------
// 51. Mixed-direction names
// ---------------------------------------------------------------------

export const MixedDirectionNameInput: FC = (): ReactElement => {
  return (
    <label>
      Display name
      <input name="displayName" type="text" dir="auto" autoComplete="name" />
    </label>
  );
};

// User-entered names can contain scripts with different writing directions.
// Do not force all user content into the direction of the interface.

// ---------------------------------------------------------------------
// 52. Textareas and localized text
// ---------------------------------------------------------------------

export const LocalizedTextarea: FC = (): ReactElement => {
  return (
    <label>
      Message
      <textarea name="message" rows={5} dir="auto" />
    </label>
  );
};

// Textareas containing user-authored multilingual content can benefit from
// direction detection when the appropriate base direction is not known.

// ---------------------------------------------------------------------
// 53. Input language metadata
// ---------------------------------------------------------------------

export const InputLanguageExample: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  return (
    <label lang={locale}>
      {MESSAGES[locale].firstName}
      <input name="firstName" lang={locale} autoComplete="given-name" />
    </label>
  );
};

// lang metadata can help user agents and assistive technologies understand
// the language associated with form content.

// ---------------------------------------------------------------------
// 54. Form-level language
// ---------------------------------------------------------------------

export const FormLanguageExample: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  return (
    <form lang={locale} dir={getDirection(locale)}>
      <label>
        {MESSAGES[locale].email}
        <input name="email" type="email" autoComplete="email" />
      </label>
    </form>
  );
};

// Setting language and direction at a meaningful container reduces unnecessary
// repetition while allowing specific fields to override them when required.

// ---------------------------------------------------------------------
// 55. Localized submit button
// ---------------------------------------------------------------------

export const LocalizedSubmitButton: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  return <button type="submit">{MESSAGES[locale].submit}</button>;
};

// The submitted data should remain independent of the translated button label.

// ---------------------------------------------------------------------
// 56. Form submission data
// ---------------------------------------------------------------------

const formData = new FormData();

formData.set("firstName", "Ana");
formData.set("lastName", "María");
formData.set("email", "person@example.com");
formData.set("country", "FR");

console.log(formData.get("country")); // "FR"

// Stable machine-oriented field names and country codes simplify server processing.

// ---------------------------------------------------------------------
// 57. Form submission handler
// ---------------------------------------------------------------------

interface SubmitExampleProps {
  readonly locale: SupportedLocale;
}

export const SubmitExample: FC<SubmitExampleProps> = ({ locale }): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log({
      locale,
      firstName: data.get("firstName"),
      email: data.get("email"),
      country: data.get("country"),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {MESSAGES[locale].firstName}
        <input name="firstName" required autoComplete="given-name" />
      </label>

      <label>
        {MESSAGES[locale].email}
        <input name="email" type="email" required autoComplete="email" />
      </label>

      <button type="submit">{MESSAGES[locale].submit}</button>
    </form>
  );
};

// The locale can be submitted as contextual metadata when the server needs
// to interpret locale-sensitive input according to the same user setting.

// ---------------------------------------------------------------------
// 58. Locale should not be the only source of country
// ---------------------------------------------------------------------

interface UserAddress {
  readonly locale: SupportedLocale;
  readonly country: CountryCode;
}

const userAddress: UserAddress = {
  locale: "en-US",
  country: "DE",
};

console.log(userAddress);

// A user can use an English interface while entering a German address.
// Locale and country should therefore be modeled independently.

// ---------------------------------------------------------------------
// 59. Country-specific validation
// ---------------------------------------------------------------------

const validatePostalCode = (postalCode: string, country: CountryCode): boolean => {
  const value = postalCode.trim();

  if (country === "US") {
    return /^\d{5}(-\d{4})?$/.test(value);
  }

  if (country === "DE") {
    return /^\d{5}$/.test(value);
  }

  if (country === "FR") {
    return /^\d{5}$/.test(value);
  }

  return value.length > 0;
};

console.log(validatePostalCode("10001", "US")); // true
console.log(validatePostalCode("10115", "DE")); // true

// Country-specific validation should be driven by the selected country,
// not merely by the language of the interface.

// ---------------------------------------------------------------------
// 60. Validation should not over-restrict user data
// ---------------------------------------------------------------------

const normalizeWhitespace = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

console.log(normalizeWhitespace("  Ana   María  "));
// "Ana María"

// Normalization can remove accidental surrounding or repeated whitespace,
// but applications should avoid destructive transformations that alter meaningful data.

// ---------------------------------------------------------------------
// 61. Do not silently rewrite user-entered names
// ---------------------------------------------------------------------

const userName = "de la Cruz";

console.log(userName);

// A form should not automatically convert names to uppercase, lowercase,
// title case, or another culturally assumed representation.

// ---------------------------------------------------------------------
// 62. Localized field ordering
// ---------------------------------------------------------------------

const getFieldOrder = (country: CountryCode): readonly string[] => {
  if (country === "US") {
    return ["address", "city", "region", "postalCode"];
  }

  if (country === "DE") {
    return ["address", "postalCode", "city"];
  }

  return ["address", "postalCode", "city"];
};

console.log(getFieldOrder("US"));
console.log(getFieldOrder("DE"));

// Field order is a presentation concern that can adapt to local conventions.

// ---------------------------------------------------------------------
// 63. Country-aware address component
// ---------------------------------------------------------------------

interface CountryAddressProps {
  readonly locale: SupportedLocale;
  readonly country: CountryCode;
}

export const CountryAwareAddress: FC<CountryAddressProps> = ({ locale, country }): ReactElement => {
  const messages = MESSAGES[locale];

  return (
    <fieldset>
      <legend>{messages.address}</legend>

      <label>
        {messages.address}
        <input name="address" autoComplete="street-address" />
      </label>

      {country === "US" && (
        <label>
          State or region
          <input name="region" autoComplete="address-level1" />
        </label>
      )}

      <label>
        {messages.postalCode}
        <input name="postalCode" autoComplete="postal-code" />
      </label>

      <label>
        {messages.city}
        <input name="city" autoComplete="address-level2" />
      </label>
    </fieldset>
  );
};

// The exact fields should be driven by the countries the application supports,
// rather than by assumptions about a single address format.

// ---------------------------------------------------------------------
// 64. Date of birth
// ---------------------------------------------------------------------

export const DateOfBirthField: FC<{
  readonly label: string;
}> = ({ label }): ReactElement => {
  return (
    <label>
      {label}
      <input name="birthDate" type="date" autoComplete="bday" />
    </label>
  );
};

// autocomplete="bday" identifies a full birth date.
// The date remains a data value while its presentation can be localized.

// ---------------------------------------------------------------------
// 65. Separate date components
// ---------------------------------------------------------------------

export const DateComponentsExample: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Date</legend>

      <label>
        Day
        <input name="day" inputMode="numeric" />
      </label>

      <label>
        Month
        <input name="month" inputMode="numeric" />
      </label>

      <label>
        Year
        <input name="year" inputMode="numeric" />
      </label>
    </fieldset>
  );
};

// Separate date fields can be appropriate for some application requirements,
// but the labels and ordering should be adapted to the target locale or region.

// ---------------------------------------------------------------------
// 66. Localized field order from configuration
// ---------------------------------------------------------------------

interface DateField {
  readonly id: "day" | "month" | "year";
  readonly label: string;
}

const DATE_FIELDS: Record<SupportedLocale, readonly DateField[]> = {
  "en-US": [
    { id: "month", label: "Month" },
    { id: "day", label: "Day" },
    { id: "year", label: "Year" },
  ],
  "de-DE": [
    { id: "day", label: "Tag" },
    { id: "month", label: "Monat" },
    { id: "year", label: "Jahr" },
  ],
  "fr-FR": [
    { id: "day", label: "Jour" },
    { id: "month", label: "Mois" },
    { id: "year", label: "Année" },
  ],
  ar: [
    { id: "day", label: "اليوم" },
    { id: "month", label: "الشهر" },
    { id: "year", label: "السنة" },
  ],
};

console.log(DATE_FIELDS["en-US"]);
console.log(DATE_FIELDS["de-DE"]);

// Explicit configuration is preferable to scattering locale-specific ordering
// conditions throughout the component tree.

// ---------------------------------------------------------------------
// 67. Localized date component
// ---------------------------------------------------------------------

export const LocalizedDateFields: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  return (
    <fieldset>
      <legend>{MESSAGES[locale].date}</legend>

      {DATE_FIELDS[locale].map((field) => (
        <label key={field.id}>
          {field.label}
          <input name={field.id} inputMode="numeric" />
        </label>
      ))}
    </fieldset>
  );
};

// This pattern keeps the field structure explicit while allowing the order
// and labels to vary by locale.

// ---------------------------------------------------------------------
// 68. Locale-aware placeholders
// ---------------------------------------------------------------------

export const LocalizedPlaceholder: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  const placeholder = locale === "de-DE" ? "name@example.de" : "name@example.com";

  return (
    <label>
      {MESSAGES[locale].email}
      <input name="email" type="email" placeholder={placeholder} autoComplete="email" />
    </label>
  );
};

// Placeholder text is supplementary guidance, not a replacement for a visible label.
// Examples should use the conventions relevant to the intended audience.

// ---------------------------------------------------------------------
// 69. Avoid using placeholders as labels
// ---------------------------------------------------------------------

export const ProperlyLabeledInput: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input name="email" type="email" autoComplete="email" />
    </label>
  );
};

// A localized form should retain explicit labels even when placeholders are localized.

// ---------------------------------------------------------------------
// 70. Localized input mode
// ---------------------------------------------------------------------

export const LocalizedNumericInput: FC = (): ReactElement => {
  return (
    <label>
      Amount
      <input name="amount" type="text" inputMode="decimal" />
    </label>
  );
};

// inputMode is a hint about the expected input interface.
// It does not itself implement locale-aware parsing or validation.

// ---------------------------------------------------------------------
// 71. Localized form state
// ---------------------------------------------------------------------

const updateFormField = <K extends keyof FormValues>(
  values: FormValues,
  field: K,
  value: FormValues[K],
): FormValues => {
  return {
    ...values,
    [field]: value,
  };
};

const updatedValues = updateFormField(INITIAL_FORM_VALUES, "country", "DE");

console.log(updatedValues.country); // "DE"

// Generic field updates preserve the distinction between field names and their value types.

// ---------------------------------------------------------------------
// 72. Controlled internationalized form
// ---------------------------------------------------------------------

export const ControlledInternationalizedForm: FC<{
  readonly initialLocale?: SupportedLocale;
}> = ({ initialLocale = DEFAULT_LOCALE }): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);
  const [values, setValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});

  const messages = MESSAGES[locale];
  const direction = getDirection(locale);

  const handleFieldChange = (field: keyof FormValues, value: string): void => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nextErrors = validateForm(values, locale);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    console.log({
      ...values,
      locale,
    });
  };

  return (
    <form lang={locale} dir={direction} onSubmit={handleSubmit}>
      <label>
        Language
        <select value={locale} onChange={(event) => setLocale(event.target.value as SupportedLocale)}>
          {SUPPORTED_LOCALES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        {messages.firstName}
        <input
          name="firstName"
          value={values.firstName}
          autoComplete="given-name"
          onChange={(event) => handleFieldChange("firstName", event.target.value)}
        />
      </label>

      {errors.firstName && <p role="alert">{errors.firstName}</p>}

      <label>
        {messages.lastName}
        <input
          name="lastName"
          value={values.lastName}
          autoComplete="family-name"
          onChange={(event) => handleFieldChange("lastName", event.target.value)}
        />
      </label>

      {errors.lastName && <p role="alert">{errors.lastName}</p>}

      <label>
        {messages.email}
        <input
          name="email"
          type="email"
          value={values.email}
          autoComplete="email"
          onChange={(event) => handleFieldChange("email", event.target.value)}
        />
      </label>

      {errors.email && <p role="alert">{errors.email}</p>}

      <label>
        {messages.country}
        <select
          name="country"
          value={values.country}
          autoComplete="country"
          onChange={(event) => handleFieldChange("country", event.target.value)}
        >
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {getLocalizedCountryName(country.code, locale)}
            </option>
          ))}
        </select>
      </label>

      <label>
        {messages.address}
        <input
          name="address"
          value={values.address}
          dir="auto"
          autoComplete="street-address"
          onChange={(event) => handleFieldChange("address", event.target.value)}
        />
      </label>

      <label>
        {messages.amount}
        <input
          name="amount"
          type="text"
          inputMode="decimal"
          value={values.amount}
          onChange={(event) => handleFieldChange("amount", event.target.value)}
        />
      </label>

      {errors.amount && <p role="alert">{errors.amount}</p>}

      <label>
        {messages.date}
        <input
          name="date"
          type="date"
          value={values.date}
          onChange={(event) => handleFieldChange("date", event.target.value)}
        />
      </label>

      {errors.date && <p role="alert">{errors.date}</p>}

      <button type="submit">{messages.submit}</button>
    </form>
  );
};

// The form keeps locale, raw editing values, semantic country codes,
// and validation results as separate pieces of state.

// ---------------------------------------------------------------------
// 73. Preserve raw values during locale changes
// ---------------------------------------------------------------------

const rawInput = "1.234,50";

const localeIndependentValue = {
  rawInput,
  locale: "de-DE" as SupportedLocale,
};

console.log(localeIndependentValue);

// Changing the interface locale should not silently reinterpret an existing
// editing string without an explicit parsing and migration policy.

// ---------------------------------------------------------------------
// 74. Reformatting after locale changes
// ---------------------------------------------------------------------

const semanticAmount = 1234.5;

const localizedAmounts = SUPPORTED_LOCALES.map((locale) => ({
  locale,
  value: formatNumber(semanticAmount, locale),
}));

console.log(localizedAmounts);

// Once an input has been parsed into semantic data, the same value can be
// presented using another locale without changing the underlying amount.

// ---------------------------------------------------------------------
// 75. Avoid ambiguous numeric persistence
// ---------------------------------------------------------------------

interface StoredOrder {
  readonly amount: number;
  readonly currency: string;
}

const storedOrder: StoredOrder = {
  amount: 1234.5,
  currency: "EUR",
};

console.log(storedOrder);

// Persist structured values rather than localized strings such as "1.234,50 €".
// Localized strings are presentation output, not reliable storage formats.

// ---------------------------------------------------------------------
// 76. Localized form submission model
// ---------------------------------------------------------------------

interface SubmittedForm {
  readonly locale: SupportedLocale;
  readonly country: CountryCode;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly amount?: number;
  readonly date?: string;
}

const submittedForm: SubmittedForm = {
  locale: "de-DE",
  country: "DE",
  firstName: "Example",
  lastName: "Person",
  email: "person@example.com",
  amount: 1234.5,
  date: "2026-09-29",
};

console.log(submittedForm);

// The submitted model contains semantic values.
// The server can apply business rules independently of how those values were displayed.

// ---------------------------------------------------------------------
// 77. Form localization checklist
// ---------------------------------------------------------------------

const internationalizedFormPrinciples = [
  "Translate labels, instructions, and validation messages.",
  "Use semantic autocomplete tokens.",
  "Treat locale and country as separate concepts.",
  "Support local name and address conventions.",
  "Represent postal codes and phone numbers as strings.",
  "Use Intl for localized number and date presentation.",
  "Keep raw editing state separate from formatted output.",
  "Do not over-restrict names or other culturally variable text.",
  "Support RTL input and multilingual user content.",
  "Validate submitted data on the server.",
] as const;

console.log(internationalizedFormPrinciples);

// These principles cover the main separation between localization,
// semantic form metadata, user input, and application data.

// ---------------------------------------------------------------------
// 78. Integrated localized form preview
// ---------------------------------------------------------------------

export const InternationalizedFormPreview: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [country, setCountry] = useState<CountryCode>("US");

  const messages = MESSAGES[locale];

  return (
    <section lang={locale} dir={getDirection(locale)}>
      <h2>{messages.submit}</h2>

      <label>
        Language
        <select value={locale} onChange={(event) => setLocale(event.target.value as SupportedLocale)}>
          {SUPPORTED_LOCALES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <LocalizedCountrySelect locale={locale} value={country} label={messages.country} onChange={setCountry} />

      <NameFields messages={messages} />

      <CountryAwareAddress locale={locale} country={country} />

      <label>
        {messages.email}
        <input name="email" type="email" autoComplete="email" />
      </label>

      <label>
        {messages.phone}
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" />
      </label>

      <button type="button">{messages.submit}</button>
    </section>
  );
};

// The integrated example combines translated content, locale direction,
// localized country names, autocomplete metadata, and country-sensitive structure.

// ---------------------------------------------------------------------
// 79. Final architecture
// ---------------------------------------------------------------------

interface InternationalizedFormArchitecture {
  readonly locale: SupportedLocale;
  readonly country: CountryCode;
  readonly messages: FormMessages;
  readonly values: FormValues;
}

const architectureExample: InternationalizedFormArchitecture = {
  locale: "en-US",
  country: "DE",
  messages: MESSAGES["en-US"],
  values: INITIAL_FORM_VALUES,
};

console.log(architectureExample);

// A maintainable internationalized form separates:
// locale configuration,
// country configuration,
// translated content,
// raw editing values,
// semantic submitted values,
// localized presentation,
// and validation rules.

// ---------------------------------------------------------------------
// 80. Default export
// ---------------------------------------------------------------------

export default ControlledInternationalizedForm;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Internationalized forms must account for language, locale, country, direction, and local conventions.
// - Locale and country are related but distinct pieces of form state.
// - Labels, instructions, and validation messages should come from localized resources.
// - Names and addresses should not be constrained by assumptions from one culture.
// - Address field order and available components can vary by country.
// - Postal codes and telephone numbers should generally be represented as strings.
// - autocomplete tokens provide semantic hints that help browsers assist with form filling.
// - Intl.NumberFormat and Intl.DateTimeFormat provide locale-sensitive number and date presentation.
// - Raw editing values should remain separate from localized display formatting.
// - Localized decimal parsing requires an explicit strategy when custom text editing is used.
// - Native date and number controls have browser- and locale-dependent behavior that should not be assumed to be identical everywhere.
// - User-entered multilingual text may require appropriate direction handling.
// - Locale changes should not silently corrupt or reinterpret existing form values.
// - Client-side validation improves interaction but does not replace server-side validation.
// - Submitted data should use stable semantic values rather than localized display strings.
// - Internationalized forms should preserve both local conventions and the semantic structure required by the application.

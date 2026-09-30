/**
 * Bidirectional Text
 * ===================
 *
 * Bidirectional (bidi) text occurs when left-to-right and right-to-left scripts appear
 * together in the same document, such as Arabic text containing an English name, URL,
 * number, or product identifier. Unicode defines a bidirectional algorithm that determines
 * how directional characters are visually ordered while preserving their logical source order.
 *
 * HTML provides `dir`, `dir="auto"`, and the `<bdi>` and `<bdo>` elements for controlling
 * bidirectional text. Correct bidi handling is especially important for user-generated
 * content and mixed-language strings containing technical values.
 */

// ---------------------------------------------------------------------
// 1. Import React types and hooks
// ---------------------------------------------------------------------

import { useState, type ChangeEvent, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 2. Define text directions
// ---------------------------------------------------------------------

type TextDirection = "ltr" | "rtl";

const directions: readonly TextDirection[] = ["ltr", "rtl"];

console.log(directions);

// `ltr` means left to right and `rtl` means right to left.

// ---------------------------------------------------------------------
// 3. Understand logical text order
// ---------------------------------------------------------------------

const logicalArabicText = "مرحبا بالعالم";

console.log(logicalArabicText);

// Source strings should remain in their logical character order.
// The browser determines their visual presentation from direction and the Unicode bidi algorithm.

// ---------------------------------------------------------------------
// 4. Use an LTR paragraph
// ---------------------------------------------------------------------

const LtrParagraph: FC = (): ReactElement => {
  return <p dir="ltr">This paragraph flows from left to right.</p>;
};

// `dir="ltr"` establishes the paragraph's base direction.

// ---------------------------------------------------------------------
// 5. Use an RTL paragraph
// ---------------------------------------------------------------------

const RtlParagraph: FC = (): ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      هذا النص يتدفق من اليمين إلى اليسار.
    </p>
  );
};

// `dir="rtl"` establishes a right-to-left base direction for the paragraph.

// ---------------------------------------------------------------------
// 6. Mix Arabic and English
// ---------------------------------------------------------------------

const ArabicWithEnglish: FC = (): ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      مرحباً، welcome to the application.
    </p>
  );
};

// Mixed-direction content is handled by the browser's bidirectional text processing.

// ---------------------------------------------------------------------
// 7. Mix English and Arabic
// ---------------------------------------------------------------------

const EnglishWithArabic: FC = (): ReactElement => {
  return <p dir="ltr">Welcome, مرحباً بكم.</p>;
};

// The base direction can be LTR even when RTL text appears inside the paragraph.

// ---------------------------------------------------------------------
// 8. Understand the base direction
// ---------------------------------------------------------------------

const BaseDirectionExample: FC = (): ReactElement => {
  return (
    <section dir="rtl">
      <h2>عنوان القسم</h2>
      <p>هذا النص يرث الاتجاه من القسم.</p>
    </section>
  );
};

// The base direction establishes the default directional context for descendant content.

// ---------------------------------------------------------------------
// 9. Override an inherited direction
// ---------------------------------------------------------------------

const NestedDirectionExample: FC = (): ReactElement => {
  return (
    <section dir="rtl" lang="ar">
      <p>هذا النص عربي.</p>

      <p dir="ltr" lang="en">
        This paragraph explicitly uses LTR direction.
      </p>
    </section>
  );
};

// A descendant can establish a different base direction when its content requires it.

// ---------------------------------------------------------------------
// 10. Use dir="auto"
// ---------------------------------------------------------------------

const AutoDirectionExample: FC = (): ReactElement => {
  return <p dir="auto">User-provided text appears here.</p>;
};

// `dir="auto"` lets the user agent determine the direction from the text.

// ---------------------------------------------------------------------
// 11. Use dir="auto" for user-generated content
// ---------------------------------------------------------------------

interface UserContentProps {
  readonly content: string;
}

const UserContent: FC<UserContentProps> = ({ content }): ReactElement => {
  return <p dir="auto">{content}</p>;
};

// Automatic direction is useful when the application does not know which script the user will enter.

// ---------------------------------------------------------------------
// 12. Understand auto direction
// ---------------------------------------------------------------------

const AutoDirectionContent: FC = (): ReactElement => {
  return (
    <div>
      <p dir="auto">Alice كتب هذا التعليق.</p>
      <p dir="auto">هذا التعليق كتبه Alice.</p>
    </div>
  );
};

// Automatic direction uses the text's directional characters to establish its base direction.
// It is not a general-purpose language detector.

// ---------------------------------------------------------------------
// 13. Use the bdi element
// ---------------------------------------------------------------------

const BdiExample: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      مرحباً <bdi>John Doe</bdi>
    </p>
  );
};

// `<bdi>` isolates the direction of its contents from the surrounding bidirectional context.

// ---------------------------------------------------------------------
// 14. Use bdi for user names
// ---------------------------------------------------------------------

interface UserNameProps {
  readonly name: string;
}

const IsolatedUserName: FC<UserNameProps> = ({ name }): ReactElement => {
  return <bdi dir="auto">{name}</bdi>;
};

// A user name may contain either LTR or RTL text, so it can be isolated with automatic direction.

// ---------------------------------------------------------------------
// 15. Compare bdi with ordinary text
// ---------------------------------------------------------------------

const BdiComparison: FC = (): ReactElement => {
  return (
    <div dir="rtl">
      <p>User: John Doe</p>

      <p>
        User: <bdi>John Doe</bdi>
      </p>
    </div>
  );
};

// Isolating an embedded value prevents its directional behavior from unexpectedly affecting surrounding text.

// ---------------------------------------------------------------------
// 16. Use bdi in a list
// ---------------------------------------------------------------------

interface UserListProps {
  readonly users: readonly string[];
}

const UserList: FC<UserListProps> = ({ users }): ReactElement => {
  return (
    <ul dir="rtl">
      {users.map((user) => (
        <li key={user}>
          <bdi dir="auto">{user}</bdi>
        </li>
      ))}
    </ul>
  );
};

// Lists containing unknown-direction user values are good candidates for bidi isolation.

// ---------------------------------------------------------------------
// 17. Use bdi for comments
// ---------------------------------------------------------------------

interface CommentProps {
  readonly author: string;
  readonly message: string;
}

const Comment: FC<CommentProps> = ({ author, message }): ReactElement => {
  return (
    <article>
      <p>
        <bdi dir="auto">{author}</bdi>
      </p>

      <p dir="auto">{message}</p>
    </article>
  );
};

// The author and message have independent directional requirements.

// ---------------------------------------------------------------------
// 18. Use bdi for search results
// ---------------------------------------------------------------------

interface SearchResult {
  readonly id: string;
  readonly title: string;
  readonly author: string;
}

const SearchResults: FC<{
  readonly results: readonly SearchResult[];
}> = ({ results }): ReactElement => {
  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>
          <bdi dir="auto">{result.title}</bdi>
          {" — "}
          <bdi dir="auto">{result.author}</bdi>
        </li>
      ))}
    </ul>
  );
};

// Isolating independently sourced strings prevents one result's direction from influencing another.

// ---------------------------------------------------------------------
// 19. Use the bdo element
// ---------------------------------------------------------------------

const BdoExample: FC = (): ReactElement => {
  return (
    <p>
      <bdo dir="rtl">abc</bdo>
    </p>
  );
};

// `<bdo>` explicitly overrides the bidirectional algorithm for its contents.

// ---------------------------------------------------------------------
// 20. Understand bdo versus bdi
// ---------------------------------------------------------------------

const BdiAndBdo: FC = (): ReactElement => {
  return (
    <div>
      <p>
        <bdi>abc</bdi>
      </p>

      <p>
        <bdo dir="rtl">abc</bdo>
      </p>
    </div>
  );
};

// `<bdi>` isolates content while allowing its direction to be determined.
// `<bdo>` explicitly forces the direction of its content.

// ---------------------------------------------------------------------
// 21. Avoid bdo for ordinary RTL interfaces
// ---------------------------------------------------------------------

const OrdinaryRtlContent: FC = (): ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      هذا محتوى عربي عادي.
    </p>
  );
};

// Normal RTL content should use `dir="rtl"` rather than overriding individual character ordering.

// ---------------------------------------------------------------------
// 22. Do not reverse RTL strings manually
// ---------------------------------------------------------------------

const originalMessage = "مرحبا";

console.log(originalMessage);

// RTL strings should not be reversed character-by-character in application code.
// The visual order is handled by the browser.

// ---------------------------------------------------------------------
// 23. Preserve logical source order
// ---------------------------------------------------------------------

const logicalMixedMessage = "مرحبا John Doe";

console.log(logicalMixedMessage);

// Keep mixed-direction text in the order that represents its logical meaning.

// ---------------------------------------------------------------------
// 24. Isolate email addresses
// ---------------------------------------------------------------------

const EmailInRtl: FC = (): ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      البريد الإلكتروني: <bdi dir="ltr">john@example.com</bdi>
    </p>
  );
};

// Email addresses have an established LTR structure and can be explicitly isolated in RTL text.

// ---------------------------------------------------------------------
// 25. Isolate URLs
// ---------------------------------------------------------------------

const UrlInRtl: FC = (): ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      الموقع: <bdi dir="ltr">https://example.com</bdi>
    </p>
  );
};

// URLs should be kept in their conventional logical form rather than manually reordered.

// ---------------------------------------------------------------------
// 26. Isolate technical identifiers
// ---------------------------------------------------------------------

const IdentifierInRtl: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      المعرّف: <bdi dir="ltr">user_123</bdi>
    </p>
  );
};

// IDs and other machine-oriented identifiers often benefit from explicit LTR isolation.

// ---------------------------------------------------------------------
// 27. Isolate file paths
// ---------------------------------------------------------------------

const FilePathInRtl: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      المسار: <bdi dir="ltr">/home/example/config.json</bdi>
    </p>
  );
};

// File paths use a left-to-right notation even when surrounded by RTL prose.

// ---------------------------------------------------------------------
// 28. Isolate source code
// ---------------------------------------------------------------------

const CodeInRtl: FC = (): ReactElement => {
  return (
    <pre dir="rtl">
      <code dir="ltr">const value = 42;</code>
    </pre>
  );
};

// Source code should retain its conventional LTR presentation inside an RTL interface.

// ---------------------------------------------------------------------
// 29. Isolate product identifiers
// ---------------------------------------------------------------------

const ProductIdentifier: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      المنتج: <bdi dir="ltr">ABC-123</bdi>
    </p>
  );
};

// Product codes can contain letters, numbers, and punctuation whose visual order matters.

// ---------------------------------------------------------------------
// 30. Isolate telephone numbers
// ---------------------------------------------------------------------

const TelephoneNumber: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      الهاتف: <bdi dir="ltr">+1 555 0100</bdi>
    </p>
  );
};

// A telephone number can be isolated from surrounding RTL punctuation and text.

// ---------------------------------------------------------------------
// 31. Handle mixed-direction labels
// ---------------------------------------------------------------------

const MixedLabel: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      الحساب: <bdi dir="ltr">John Doe</bdi> نشط
    </p>
  );
};

// Each independently meaningful value can be isolated within the surrounding RTL sentence.

// ---------------------------------------------------------------------
// 32. Handle mixed-direction UI values
// ---------------------------------------------------------------------

interface AccountSummaryProps {
  readonly userName: string;
  readonly accountId: string;
}

const AccountSummary: FC<AccountSummaryProps> = ({ userName, accountId }): ReactElement => {
  return (
    <section dir="rtl">
      <p>
        المستخدم: <bdi dir="auto">{userName}</bdi>
      </p>

      <p>
        المعرّف: <bdi dir="ltr">{accountId}</bdi>
      </p>
    </section>
  );
};

// The direction of each value can be chosen according to the value's semantics.

// ---------------------------------------------------------------------
// 33. Understand neutral characters
// ---------------------------------------------------------------------

const neutralCharacters = ["(", ")", ":", "/", "-", "."];

console.log(neutralCharacters);

// Some punctuation characters are directionally neutral and receive their placement from surrounding context.

// ---------------------------------------------------------------------
// 34. Understand strong directional characters
// ---------------------------------------------------------------------

const directionalExamples = ["A", "B", "م", "ن"];

console.log(directionalExamples);

// Latin letters are strongly LTR and Arabic letters are strongly RTL for bidi processing.

// ---------------------------------------------------------------------
// 35. Understand numbers in bidi text
// ---------------------------------------------------------------------

const ArabicNumberExample: FC = (): ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      العدد هو 125.
    </p>
  );
};

// Numbers participate in bidi processing and can appear inside RTL text without reversing their digits.

// ---------------------------------------------------------------------
// 36. Isolate numbers when context is complex
// ---------------------------------------------------------------------

const IsolatedNumber: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      الرمز: <bdi dir="ltr">125</bdi>
    </p>
  );
};

// Isolation can make independently meaningful numeric values more predictable in complex mixed text.

// ---------------------------------------------------------------------
// 37. Use language metadata
// ---------------------------------------------------------------------

const LanguageMetadata: FC = (): ReactElement => {
  return (
    <div>
      <p lang="en" dir="ltr">
        English text
      </p>

      <p lang="ar" dir="rtl">
        نص عربي
      </p>
    </div>
  );
};

// `lang` identifies the language while `dir` establishes its directional context.

// ---------------------------------------------------------------------
// 38. Keep lang and dir independent
// ---------------------------------------------------------------------

const IndependentLanguageDirection: FC = (): ReactElement => {
  return (
    <p lang="en" dir="rtl">
      English text displayed in an RTL context.
    </p>
  );
};

// Language and direction are related concepts but are not interchangeable.

// ---------------------------------------------------------------------
// 39. Use an RTL container with LTR technical content
// ---------------------------------------------------------------------

const RtlTechnicalPanel: FC = (): ReactElement => {
  return (
    <section dir="rtl" lang="ar">
      <h2>تفاصيل الطلب</h2>
      <p>
        رقم الطلب: <bdi dir="ltr">ORD-1024</bdi>
      </p>
    </section>
  );
};

// A component can have an RTL base direction while isolating technical values that use LTR notation.

// ---------------------------------------------------------------------
// 40. Use logical CSS properties
// ---------------------------------------------------------------------

const LogicalBidiLayout: FC = (): ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        paddingInline: "1rem",
        marginInline: "auto",
        borderInlineStart: "4px solid currentColor",
      }}
    >
      محتوى الواجهة
    </div>
  );
};

// Logical CSS properties adapt to the current inline direction.

// ---------------------------------------------------------------------
// 41. Use logical text alignment
// ---------------------------------------------------------------------

const LogicalTextAlignment: FC = (): ReactElement => {
  return (
    <p
      dir="rtl"
      style={{
        textAlign: "start",
      }}
    >
      يبدأ النص من جهة بداية الاتجاه.
    </p>
  );
};

// `start` and `end` follow the writing direction instead of assuming physical left and right.

// ---------------------------------------------------------------------
// 42. Avoid physical left/right assumptions
// ---------------------------------------------------------------------

const DirectionIndependentBox: FC = (): ReactElement => {
  return (
    <div
      style={{
        marginInlineStart: "1rem",
        paddingInlineEnd: "1rem",
      }}
    >
      Direction-independent content
    </div>
  );
};

// Logical properties allow the same component to work in both LTR and RTL contexts.

// ---------------------------------------------------------------------
// 43. Use direction with flexbox
// ---------------------------------------------------------------------

const BidiFlexLayout: FC = (): ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        gap: "1rem",
      }}
    >
      <span>الأول</span>
      <span>الثاني</span>
      <span>الثالث</span>
    </div>
  );
};

// Direction participates in the layout behavior of horizontally flowing flex content.

// ---------------------------------------------------------------------
// 44. Avoid manually reversing flex children
// ---------------------------------------------------------------------

const NaturalDirectionalLayout: FC = (): ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        gap: "1rem",
      }}
    >
      <span>الاسم</span>
      <span>القيمة</span>
    </div>
  );
};

// Establish the intended direction rather than maintaining separate reversed child orders.

// ---------------------------------------------------------------------
// 45. Use direction on form controls
// ---------------------------------------------------------------------

const BidiForm: FC = (): ReactElement => {
  return (
    <form dir="rtl">
      <label>
        الاسم
        <input name="name" />
      </label>

      <label>
        البريد الإلكتروني
        <input name="email" type="email" dir="ltr" />
      </label>
    </form>
  );
};

// A form can be RTL while individual fields use an appropriate direction for their value.

// ---------------------------------------------------------------------
// 46. Use auto direction in textareas
// ---------------------------------------------------------------------

const BidiTextarea: FC = (): ReactElement => {
  return <textarea dir="auto" aria-label="Message" />;
};

// Unknown-direction user input can use `dir="auto"`.

// ---------------------------------------------------------------------
// 47. Use a known direction in inputs
// ---------------------------------------------------------------------

const KnownDirectionInput: FC<{
  readonly direction: TextDirection;
}> = ({ direction }): ReactElement => {
  return <input dir={direction} aria-label="Localized value" />;
};

// If the application knows the expected direction, it can provide it explicitly.

// ---------------------------------------------------------------------
// 48. Handle bidirectional placeholders
// ---------------------------------------------------------------------

const BidiPlaceholder: FC = (): ReactElement => {
  return <input dir="rtl" placeholder="ابحث عن منتج" aria-label="بحث" />;
};

// Placeholder text participates in the control's directional context.

// ---------------------------------------------------------------------
// 49. Keep technical input LTR
// ---------------------------------------------------------------------

const TechnicalInput: FC = (): ReactElement => {
  return (
    <label dir="rtl">
      عنوان الموقع
      <input dir="ltr" defaultValue="https://example.com" />
    </label>
  );
};

// Technical values can use an explicit direction even when the surrounding form is RTL.

// ---------------------------------------------------------------------
// 50. Use bdi in data tables
// ---------------------------------------------------------------------

const BidiTable: FC = (): ReactElement => {
  const entries = [
    {
      id: "1",
      name: "John Doe",
    },
    {
      id: "2",
      name: "أحمد",
    },
  ];

  return (
    <table dir="rtl">
      <thead>
        <tr>
          <th>الاسم</th>
          <th>المعرّف</th>
        </tr>
      </thead>

      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td>
              <bdi dir="auto">{entry.name}</bdi>
            </td>
            <td>
              <bdi dir="ltr">{entry.id}</bdi>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Independent table values can be isolated according to their content.

// ---------------------------------------------------------------------
// 51. Handle bidirectional breadcrumbs
// ---------------------------------------------------------------------

const BidiBreadcrumbs: FC = (): ReactElement => {
  return (
    <nav dir="rtl" aria-label="مسار التنقل">
      <ol>
        <li>الرئيسية</li>
        <li>المنتجات</li>
        <li>
          <bdi dir="auto">Product 123</bdi>
        </li>
      </ol>
    </nav>
  );
};

// Breadcrumb labels can contain values whose direction differs from the navigation shell.

// ---------------------------------------------------------------------
// 52. Handle bidirectional notifications
// ---------------------------------------------------------------------

interface NotificationProps {
  readonly userName: string;
  readonly action: string;
}

const Notification: FC<NotificationProps> = ({ userName, action }): ReactElement => {
  return (
    <p dir="rtl">
      <bdi dir="auto">{userName}</bdi> {action}
    </p>
  );
};

// Isolating the variable user value keeps it from affecting the directional behavior of the sentence.

// ---------------------------------------------------------------------
// 53. Handle bidirectional lists
// ---------------------------------------------------------------------

const BidiDirectory: FC = (): ReactElement => {
  const names = ["John Doe", "أحمد علي", "Alice Smith", "محمد حسن"];

  return (
    <ul>
      {names.map((name) => (
        <li key={name}>
          <bdi dir="auto">{name}</bdi>
        </li>
      ))}
    </ul>
  );
};

// Lists containing names from multiple writing systems should isolate each independently sourced name.

// ---------------------------------------------------------------------
// 54. Handle bidirectional search results
// ---------------------------------------------------------------------

const BidiSearchResults: FC = (): ReactElement => {
  const results = [
    {
      id: "1",
      title: "React",
    },
    {
      id: "2",
      title: "تطوير الويب",
    },
  ];

  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>
          <bdi dir="auto">{result.title}</bdi>
        </li>
      ))}
    </ul>
  );
};

// Search results can contain arbitrary language content, making isolation useful.

// ---------------------------------------------------------------------
// 55. Keep content logical when concatenating
// ---------------------------------------------------------------------

const createMessage = (userName: string): string => {
  return `Welcome, ${userName}.`;
};

console.log(createMessage("John Doe"));

// Logical strings should be constructed from logical text rather than manually arranging visual positions.

// ---------------------------------------------------------------------
// 56. Avoid string reversal as a bidi solution
// ---------------------------------------------------------------------

const unsafeVisualWorkaround = (value: string): string => {
  return [...value].reverse().join("");
};

console.log(unsafeVisualWorkaround("abc"));

// Reversing characters changes the logical data and is not a valid general solution for bidi presentation.

// ---------------------------------------------------------------------
// 57. Use markup to isolate values
// ---------------------------------------------------------------------

const IsolatedMessage: FC<UserNameProps> = ({ name }): ReactElement => {
  return (
    <p dir="rtl">
      مرحباً <bdi dir="auto">{name}</bdi>
    </p>
  );
};

// Markup preserves the logical data while giving the browser an explicit isolation boundary.

// ---------------------------------------------------------------------
// 58. Keep machine values separate from prose
// ---------------------------------------------------------------------

interface OrderSummaryProps {
  readonly orderId: string;
  readonly customerName: string;
}

const OrderSummary: FC<OrderSummaryProps> = ({ orderId, customerName }): ReactElement => {
  return (
    <section dir="rtl">
      <p>
        العميل: <bdi dir="auto">{customerName}</bdi>
      </p>

      <p>
        رقم الطلب: <bdi dir="ltr">{orderId}</bdi>
      </p>
    </section>
  );
};

// Separating prose from machine-oriented values makes the directional intent explicit.

// ---------------------------------------------------------------------
// 59. Understand directional isolation boundaries
// ---------------------------------------------------------------------

const IsolatedBoundary: FC = (): ReactElement => {
  return (
    <p dir="rtl">
      قبل <bdi dir="ltr">ABC-123</bdi> بعد
    </p>
  );
};

// The isolated value cannot directly affect the surrounding bidi ordering.

// ---------------------------------------------------------------------
// 60. Use nested direction deliberately
// ---------------------------------------------------------------------

const NestedBidiBoundary: FC = (): ReactElement => {
  return (
    <div dir="rtl">
      <p>
        عربي <span dir="ltr">English</span>
      </p>
    </div>
  );
};

// A nested direction establishes a new directional context for the element and its descendants.

// ---------------------------------------------------------------------
// 61. Prefer bdi for unknown inline direction
// ---------------------------------------------------------------------

const UnknownInlineDirection: FC<{
  readonly value: string;
}> = ({ value }): ReactElement => {
  return (
    <span>
      <bdi dir="auto">{value}</bdi>
    </span>
  );
};

// `<bdi>` is specifically designed for isolating inline content with potentially different direction.

// ---------------------------------------------------------------------
// 62. Prefer dir over CSS direction for semantic text
// ---------------------------------------------------------------------

const SemanticBidiDirection: FC = (): ReactElement => {
  return (
    <article dir="rtl">
      <p>هذا اتجاه دلالي للمحتوى.</p>
    </article>
  );
};

// The HTML `dir` attribute communicates text direction as document information.

// ---------------------------------------------------------------------
// 63. Use CSS direction for presentation when appropriate
// ---------------------------------------------------------------------

const CssDirection: FC = (): ReactElement => {
  return (
    <div
      style={{
        direction: "rtl",
      }}
    >
      محتوى RTL
    </div>
  );
};

// CSS `direction` can control presentation, but semantic text direction is generally better expressed with `dir`.

// ---------------------------------------------------------------------
// 64. Keep direction derived from locale
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "ar" | "he" | "fa";

const directionByLocale: Record<SupportedLocale, TextDirection> = {
  "en-US": "ltr",
  ar: "rtl",
  he: "rtl",
  fa: "rtl",
};

const getDirection = (locale: SupportedLocale): TextDirection => {
  return directionByLocale[locale];
};

console.log(getDirection("ar"));

// Direction can be derived from locale configuration rather than duplicated as unrelated state.

// ---------------------------------------------------------------------
// 65. Build a locale-aware bidi container
// ---------------------------------------------------------------------

interface LocaleContainerProps {
  readonly locale: SupportedLocale;
  readonly children: ReactNode;
}

const LocaleContainer: FC<LocaleContainerProps> = ({ locale, children }): ReactElement => {
  return (
    <div lang={locale} dir={getDirection(locale)}>
      {children}
    </div>
  );
};

// A locale-aware container can establish both language and base direction for its descendants.

// ---------------------------------------------------------------------
// 66. Switch between LTR and RTL
// ---------------------------------------------------------------------

const BidiLocaleSwitcher: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("ar");

  const direction = getDirection(locale);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  return (
    <main
      lang={locale}
      dir={direction}
      style={{
        paddingBlock: "2rem",
        paddingInline: "1.5rem",
      }}
    >
      <label>
        Language
        <select value={locale} onChange={handleChange}>
          <option value="en-US">English</option>
          <option value="ar">العربية</option>
          <option value="he">עברית</option>
          <option value="fa">فارسی</option>
        </select>
      </label>

      <p>Current direction: {direction}</p>

      <p>
        <bdi dir="auto">John Doe</bdi>
      </p>
    </main>
  );
};

// Changing the locale can change the base direction while isolated values retain their own direction.

// ---------------------------------------------------------------------
// 67. Keep document direction synchronized
// ---------------------------------------------------------------------

const DocumentDirection: FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): ReactElement => {
  const direction = getDirection(locale);

  return (
    <output lang={locale} dir={direction}>
      {direction}
    </output>
  );
};

// A component can expose the calculated direction while a higher-level application layer synchronizes the document.

// ---------------------------------------------------------------------
// 68. Preserve previous document state when synchronizing
// ---------------------------------------------------------------------

interface DocumentLocaleControllerProps {
  readonly locale: SupportedLocale;
}

const DocumentLocaleController: FC<DocumentLocaleControllerProps> = ({ locale }): ReactElement => {
  const direction = getDirection(locale);

  console.log({
    locale,
    direction,
  });

  return (
    <output>
      {locale} ({direction})
    </output>
  );
};

// A real document controller should save existing document attributes before replacing them and restore them during cleanup.

// ---------------------------------------------------------------------
// 69. Handle arbitrary user text
// ---------------------------------------------------------------------

interface ArbitraryTextProps {
  readonly text: string;
}

const ArbitraryText: FC<ArbitraryTextProps> = ({ text }): ReactElement => {
  return <div dir="auto">{text}</div>;
};

// `dir="auto"` is appropriate when arbitrary user text may contain different writing directions.

// ---------------------------------------------------------------------
// 70. Isolate arbitrary inline values
// ---------------------------------------------------------------------

const ArbitraryInlineValue: FC<{
  readonly value: string;
}> = ({ value }): ReactElement => {
  return (
    <p dir="rtl">
      القيمة: <bdi dir="auto">{value}</bdi>
    </p>
  );
};

// Isolation is especially useful when arbitrary inline content is inserted into surrounding prose.

// ---------------------------------------------------------------------
// 71. Combine bdi with semantic HTML
// ---------------------------------------------------------------------

const SemanticUserEntry: FC = (): ReactElement => {
  return (
    <article>
      <header>
        <h2>
          <bdi dir="auto">User profile</bdi>
        </h2>
      </header>

      <p dir="auto">User-generated description.</p>
    </article>
  );
};

// Bidi handling can be applied without replacing semantic HTML structures.

// ---------------------------------------------------------------------
// 72. Keep accessibility text logical
// ---------------------------------------------------------------------

const AccessibleBidiLabel: FC = (): ReactElement => {
  return (
    <button type="button">
      <span aria-hidden="true">★</span> <bdi dir="auto">المفضلة</bdi>
    </button>
  );
};

// Accessible names should contain meaningful logical text rather than visually reordered character sequences.

// ---------------------------------------------------------------------
// 73. Keep generated labels direction-aware
// ---------------------------------------------------------------------

interface GeneratedLabelProps {
  readonly label: string;
}

const GeneratedLabel: FC<GeneratedLabelProps> = ({ label }): ReactElement => {
  return (
    <label>
      <bdi dir="auto">{label}</bdi>
      <input />
    </label>
  );
};

// Generated labels may come from translations or user-provided content and can require isolation.

// ---------------------------------------------------------------------
// 74. Use bidi isolation in notifications
// ---------------------------------------------------------------------

const UserNotification: FC<{
  readonly userName: string;
}> = ({ userName }): ReactElement => {
  return (
    <div dir="rtl">
      <p>
        قام <bdi dir="auto">{userName}</bdi> بتحديث الملف الشخصي.
      </p>
    </div>
  );
};

// Isolating the user name keeps its directional behavior independent from the surrounding Arabic sentence.

// ---------------------------------------------------------------------
// 75. Avoid direction-dependent string concatenation
// ---------------------------------------------------------------------

const concatenatedNotification = (userName: string): string => {
  return `User ${userName} updated the profile.`;
};

console.log(concatenatedNotification("John Doe"));

// String concatenation should create logical content; directional presentation belongs to markup and text direction.

// ---------------------------------------------------------------------
// 76. Use markup for directional boundaries
// ---------------------------------------------------------------------

const MarkupBoundary: FC<{
  readonly userName: string;
}> = ({ userName }): ReactElement => {
  return (
    <p dir="rtl">
      تم تحديث الملف بواسطة <bdi dir="auto">{userName}</bdi>.
    </p>
  );
};

// Markup provides a directional boundary without modifying the underlying user value.

// ---------------------------------------------------------------------
// 77. Build a complete bidi example
// ---------------------------------------------------------------------

const BidirectionalTextDemo: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("ar");

  const direction = getDirection(locale);

  return (
    <main
      lang={locale}
      dir={direction}
      style={{
        maxWidth: "40rem",
        marginInline: "auto",
        paddingBlock: "2rem",
        paddingInline: "1.5rem",
      }}
    >
      <label>
        Language
        <select
          value={locale}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setLocale(event.target.value as SupportedLocale);
          }}
        >
          <option value="en-US">English</option>
          <option value="ar">العربية</option>
          <option value="he">עברית</option>
          <option value="fa">فارسی</option>
        </select>
      </label>

      <h1>
        <bdi dir="auto">John Doe</bdi>
      </h1>

      <p>
        <bdi dir="ltr">john@example.com</bdi>
      </p>

      <p>
        <bdi dir="ltr">ORD-1024</bdi>
      </p>

      <p dir="auto">User-generated text appears here.</p>
    </main>
  );
};

// The integrated example combines locale direction, automatic direction, and isolated technical values.

// ---------------------------------------------------------------------
// 78. Validate direction values at runtime
// ---------------------------------------------------------------------

const isTextDirection = (value: string): value is TextDirection => {
  return value === "ltr" || value === "rtl";
};

console.log(isTextDirection("rtl"));
console.log(isTextDirection("vertical"));

// Runtime validation is useful when direction values originate outside TypeScript's type system.

// ---------------------------------------------------------------------
// 79. Keep bidi handling systematic
// ---------------------------------------------------------------------

const bidiChecklist = [
  "Establish the correct base direction",
  "Use lang to identify language",
  'Use dir="auto" for unknown-direction text',
  "Use bdi for isolated user values",
  "Use bdo only when explicit direction override is required",
  "Keep URLs and identifiers in their logical form",
  "Prefer logical CSS properties",
  "Do not reverse Unicode strings manually",
];

console.log(bidiChecklist);

// Bidi support is a combination of correct text direction, isolation, semantic markup, and direction-aware layout.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default BidirectionalTextDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Bidirectional text occurs when LTR and RTL scripts appear together in the same content.
// - The Unicode bidirectional algorithm determines the visual ordering of mixed-direction text.
// - Logical source order should be preserved; application code should not reverse RTL strings manually.
// - `dir="ltr"` establishes a left-to-right base direction.
// - `dir="rtl"` establishes a right-to-left base direction.
// - `dir="auto"` lets the user agent determine the base direction from the text.
// - `lang` identifies language and does not itself establish text direction.
// - Direction normally inherits from an ancestor unless a descendant establishes another direction.
// - The `<bdi>` element isolates its contents from the surrounding bidirectional context.
// - `<bdi dir="auto">` is useful for user-provided values whose direction is unknown.
// - The `<bdo>` element explicitly overrides the bidirectional algorithm for its contents.
// - `bdo` should not be used as the normal mechanism for implementing an RTL interface.
// - User names, search results, comments, and other arbitrary inline values are common candidates for `bdi`.
// - URLs, email addresses, file paths, identifiers, product codes, and source code commonly use LTR notation.
// - Technical values can be isolated with `bdi` or given an explicit `dir="ltr"` when appropriate.
// - Numbers participate in bidirectional text processing and should not be manually reordered.
// - Neutral punctuation can receive its visual placement from surrounding directional context.
// - Mixed-language content can use an RTL or LTR base direction while embedded content retains its own directional behavior.
// - `dir="auto"` is a directional heuristic, not a general-purpose language detector.
// - Semantic language metadata should be supplied with `lang` independently of direction.
// - HTML `dir` is generally preferable when text direction is semantic document information.
// - CSS `direction` can be used when direction is specifically part of presentation behavior.
// - CSS logical properties such as `margin-inline` and `padding-inline` make layouts less dependent on physical left and right.
// - `text-align: start` and `text-align: end` adapt to the current inline direction.
// - RTL support should not require separate reversed DOM structures when direction-aware markup and CSS can express the intended layout.
// - Bidi isolation is particularly important when arbitrary user content is inserted into surrounding prose.
// - Direction can be derived from locale configuration rather than maintained as conflicting independent state.
// - Changing the active locale can require changing the application's base direction.
// - Direction-aware components can accept an explicit direction when they must operate independently of the surrounding document.
// - Correct bidi handling preserves logical data while allowing the browser to produce the appropriate visual presentation.

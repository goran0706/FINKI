/**
 * Right-to-Left
 * =============
 *
 * Right-to-left (RTL) interfaces are used by languages such as Arabic, Hebrew, Persian,
 * and Urdu. HTML provides the `dir` attribute for establishing the base text direction,
 * while React can apply that direction dynamically when the application's locale changes.
 *
 * RTL support affects text flow and also interacts with layout, alignment, tables, forms,
 * navigation, icons, spacing, and other visual patterns. The HTML `dir` attribute should
 * generally be preferred for semantic text direction, while CSS direction-related
 * properties are useful for specific presentation requirements.
 */

// ---------------------------------------------------------------------
// 1. Define supported directions
// ---------------------------------------------------------------------

type TextDirection = "ltr" | "rtl";

const textDirections: readonly TextDirection[] = ["ltr", "rtl"];

console.log(textDirections);

// An application can represent direction explicitly as part of its locale configuration.

// ---------------------------------------------------------------------
// 2. Define supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "ar" | "he" | "fa";

const localeDirections: Record<SupportedLocale, TextDirection> = {
  "en-US": "ltr",
  ar: "rtl",
  he: "rtl",
  fa: "rtl",
};

console.log(localeDirections);

// Locale and direction are related but are separate concepts.
// A locale identifies language and regional conventions; direction identifies text flow.

// ---------------------------------------------------------------------
// 3. Resolve a direction from a locale
// ---------------------------------------------------------------------

const getDirection = (locale: SupportedLocale): TextDirection => {
  return localeDirections[locale];
};

console.log(getDirection("en-US"));
console.log(getDirection("ar"));

// Keeping the mapping in one place avoids scattering RTL checks throughout the UI.

// ---------------------------------------------------------------------
// 4. Use dir="ltr"
// ---------------------------------------------------------------------

const LeftToRightExample = (): React.ReactElement => {
  return <p dir="ltr">This text flows from left to right.</p>;
};

// `dir="ltr"` explicitly establishes a left-to-right base direction.

// ---------------------------------------------------------------------
// 5. Use dir="rtl"
// ---------------------------------------------------------------------

const RightToLeftExample = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      هذا النص يتدفق من اليمين إلى اليسار.
    </p>
  );
};

// `dir="rtl"` establishes a right-to-left base direction.
// The `lang` attribute identifies the language independently of its direction.

// ---------------------------------------------------------------------
// 6. Do not infer direction from lang automatically
// ---------------------------------------------------------------------

const LanguageAndDirection = (): React.ReactElement => {
  return (
    <div>
      <p lang="ar" dir="rtl">
        نص عربي
      </p>
      <p lang="en" dir="ltr">
        English text
      </p>
    </div>
  );
};

// `lang` identifies language; it does not itself establish the base text direction.

// ---------------------------------------------------------------------
// 7. Use dir on a document-level container
// ---------------------------------------------------------------------

interface DirectionalDocumentProps {
  readonly direction: TextDirection;
  readonly children: React.ReactNode;
}

const DirectionalDocument: React.FC<DirectionalDocumentProps> = ({ direction, children }): React.ReactElement => {
  return <main dir={direction}>{children}</main>;
};

// A high-level container can establish direction for the content below it.

// ---------------------------------------------------------------------
// 8. Let direction inherit
// ---------------------------------------------------------------------

const InheritedDirection = (): React.ReactElement => {
  return (
    <section dir="rtl" lang="ar">
      <h2>عنوان</h2>
      <p>هذا النص يرث اتجاه الحاوية.</p>
    </section>
  );
};

// Elements without their own `dir` generally inherit direction from their parent.

// ---------------------------------------------------------------------
// 9. Override direction for a nested section
// ---------------------------------------------------------------------

const NestedDirection = (): React.ReactElement => {
  return (
    <section dir="rtl" lang="ar">
      <p>هذا النص من اليمين إلى اليسار.</p>

      <p dir="ltr" lang="en">
        This paragraph explicitly uses left-to-right direction.
      </p>
    </section>
  );
};

// A nested element can explicitly change the base direction for its own content.

// ---------------------------------------------------------------------
// 10. Use direction with Arabic content
// ---------------------------------------------------------------------

const ArabicContent = (): React.ReactElement => {
  return (
    <article dir="rtl" lang="ar">
      <h2>مرحباً بك</h2>
      <p>هذا مثال على محتوى عربي داخل واجهة من اليمين إلى اليسار.</p>
    </article>
  );
};

// Arabic is normally written right to left and should be presented with an appropriate base direction.

// ---------------------------------------------------------------------
// 11. Use direction with Hebrew content
// ---------------------------------------------------------------------

const HebrewContent = (): React.ReactElement => {
  return (
    <article dir="rtl" lang="he">
      <h2>ברוכים הבאים</h2>
      <p>זהו טקסט בעברית בכיוון מימין לשמאל.</p>
    </article>
  );
};

// Hebrew is also commonly presented with a right-to-left base direction.

// ---------------------------------------------------------------------
// 12. Use direction with Persian content
// ---------------------------------------------------------------------

const PersianContent = (): React.ReactElement => {
  return (
    <article dir="rtl" lang="fa">
      <h2>خوش آمدید</h2>
      <p>این یک نمونه از متن فارسی است.</p>
    </article>
  );
};

// Persian uses a right-to-left writing direction.

// ---------------------------------------------------------------------
// 13. Use direction with mixed language content
// ---------------------------------------------------------------------

const MixedLanguageContent = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      مرحباً، this sentence contains Arabic and English.
    </p>
  );
};

// The overall base direction can be RTL while embedded Latin text remains readable in its own direction.

// ---------------------------------------------------------------------
// 14. Keep embedded English readable
// ---------------------------------------------------------------------

const EmbeddedEnglish = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      افتح صفحة example.com لمتابعة التفاصيل.
    </p>
  );
};

// Latin-script text has its own directional behavior inside an RTL context.

// ---------------------------------------------------------------------
// 15. Keep numbers readable in RTL content
// ---------------------------------------------------------------------

const ArabicWithNumber = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      السعر هو 125 ديناراً.
    </p>
  );
};

// Numbers can appear inside RTL text without manually reversing their characters.

// ---------------------------------------------------------------------
// 16. Use dir="auto" for unknown direction
// ---------------------------------------------------------------------

const UnknownDirection = (): React.ReactElement => {
  return <p dir="auto">User-provided content appears here.</p>;
};

// `dir="auto"` lets the user agent determine the base direction from the text.

// ---------------------------------------------------------------------
// 17. Use dir="auto" for user-generated content
// ---------------------------------------------------------------------

interface UserCommentProps {
  readonly comment: string;
}

const UserComment: React.FC<UserCommentProps> = ({ comment }): React.ReactElement => {
  return <p dir="auto">{comment}</p>;
};

// `dir="auto"` is useful when the application does not know the direction of external text in advance.

// ---------------------------------------------------------------------
// 18. Understand that dir="auto" is a heuristic
// ---------------------------------------------------------------------

const AutoDirectionExample = (): React.ReactElement => {
  return (
    <div>
      <p dir="auto">Alice كتب هذا التعليق.</p>
      <p dir="auto">هذا التعليق كتبه Alice.</p>
    </div>
  );
};

// Automatic direction is determined from directional characters rather than full language detection.

// ---------------------------------------------------------------------
// 19. Use bdi for isolated user text
// ---------------------------------------------------------------------

const IsolatedUserName = (): React.ReactElement => {
  return (
    <p dir="rtl">
      مرحباً <bdi>{`John Doe`}</bdi>
    </p>
  );
};

// `<bdi>` isolates the embedded text's direction from surrounding text.

// ---------------------------------------------------------------------
// 20. Use dir="auto" with bdi
// ---------------------------------------------------------------------

interface UserNameProps {
  readonly name: string;
}

const UserName: React.FC<UserNameProps> = ({ name }): React.ReactElement => {
  return <bdi dir="auto">{name}</bdi>;
};

// A user-provided name can have unknown direction, so automatic direction is appropriate for the isolated value.

// ---------------------------------------------------------------------
// 21. Keep language metadata with text
// ---------------------------------------------------------------------

const LocalizedMessage = (): React.ReactElement => {
  return (
    <p lang="ar" dir="rtl">
      هذه رسالة عربية.
    </p>
  );
};

// Language metadata and text direction provide complementary information.

// ---------------------------------------------------------------------
// 22. Use direction on headings
// ---------------------------------------------------------------------

const RTLHeading = (): React.ReactElement => {
  return (
    <section dir="rtl" lang="ar">
      <h2>الإعدادات</h2>
      <p>إدارة إعدادات الحساب.</p>
    </section>
  );
};

// Semantic elements such as headings inherit the surrounding direction.

// ---------------------------------------------------------------------
// 23. Use direction on navigation
// ---------------------------------------------------------------------

const RTLNavigation = (): React.ReactElement => {
  return (
    <nav dir="rtl" aria-label="التنقل الرئيسي">
      <a href="#home">الرئيسية</a>
      <a href="#products">المنتجات</a>
      <a href="#contact">اتصل بنا</a>
    </nav>
  );
};

// Navigation content can inherit RTL direction from the navigation container.

// ---------------------------------------------------------------------
// 24. Use direction on forms
// ---------------------------------------------------------------------

const RTLForm = (): React.ReactElement => {
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

// An RTL form can contain individual fields that are more naturally represented LTR.

// ---------------------------------------------------------------------
// 25. Keep email addresses LTR
// ---------------------------------------------------------------------

const EmailAddress = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      البريد الإلكتروني: <span dir="ltr">john@example.com</span>
    </p>
  );
};

// Email addresses are conventionally written left to right even inside an RTL interface.

// ---------------------------------------------------------------------
// 26. Keep URLs LTR
// ---------------------------------------------------------------------

const WebsiteUrl = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      الموقع:{" "}
      <a href="https://example.com" dir="ltr">
        example.com
      </a>
    </p>
  );
};

// URLs should not be manually reversed to make them fit an RTL layout.

// ---------------------------------------------------------------------
// 27. Keep code LTR
// ---------------------------------------------------------------------

const CodeExample = (): React.ReactElement => {
  return (
    <pre dir="ltr">
      <code>const value = 42;</code>
    </pre>
  );
};

// Source code uses syntax conventions that are normally represented left to right.

// ---------------------------------------------------------------------
// 28. Keep file paths LTR
// ---------------------------------------------------------------------

const FilePathExample = (): React.ReactElement => {
  return (
    <p dir="rtl">
      المسار: <code dir="ltr">/home/example/app/config.json</code>
    </p>
  );
};

// Technical identifiers are often easier to read with an explicit LTR direction.

// ---------------------------------------------------------------------
// 29. Keep identifiers LTR
// ---------------------------------------------------------------------

const IdentifierExample = (): React.ReactElement => {
  return (
    <p dir="rtl">
      المعرّف: <code dir="ltr">user_123</code>
    </p>
  );
};

// IDs, tokens, and similar machine-readable strings should retain their conventional direction.

// ---------------------------------------------------------------------
// 30. Use direction for tables
// ---------------------------------------------------------------------

const RTLTable = (): React.ReactElement => {
  return (
    <table dir="rtl">
      <thead>
        <tr>
          <th>الاسم</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>نشط</td>
        </tr>
      </tbody>
    </table>
  );
};

// Direction affects the flow and ordering of table content.

// ---------------------------------------------------------------------
// 31. Override a table cell when necessary
// ---------------------------------------------------------------------

const MixedDirectionTable = (): React.ReactElement => {
  return (
    <table dir="rtl">
      <thead>
        <tr>
          <th>الاسم</th>
          <th>المعرّف</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td dir="ltr">user_123</td>
        </tr>
      </tbody>
    </table>
  );
};

// Individual cells can establish a different base direction when their content requires it.

// ---------------------------------------------------------------------
// 32. Use direction with CSS grid
// ---------------------------------------------------------------------

const RTLGrid = (): React.ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
    >
      <div>الأول</div>
      <div>الثاني</div>
      <div>الثالث</div>
    </div>
  );
};

// The base direction also influences the flow of grid content.

// ---------------------------------------------------------------------
// 33. Use direction with flex layouts
// ---------------------------------------------------------------------

const RTLFlex = (): React.ReactElement => {
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

// Direction can influence the ordering of horizontally flowing flex content.

// ---------------------------------------------------------------------
// 34. Do not manually reverse every flex layout
// ---------------------------------------------------------------------

const DirectionalLayout = (): React.ReactElement => {
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

// Let the direction system establish the appropriate flow instead of duplicating RTL-specific markup.

// ---------------------------------------------------------------------
// 35. Use CSS logical properties
// ---------------------------------------------------------------------

const LogicalSpacing = (): React.ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        paddingInlineStart: "1rem",
        paddingInlineEnd: "2rem",
        marginBlock: "1rem",
      }}
    >
      محتوى عربي
    </div>
  );
};

// Logical properties describe relationships such as inline-start and inline-end rather than physical sides.

// ---------------------------------------------------------------------
// 36. Prefer logical margins
// ---------------------------------------------------------------------

const LogicalMargins = (): React.ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        marginInlineStart: "1rem",
      }}
    >
      عنصر RTL
    </div>
  );
};

// `margin-inline-start` adapts to the element's writing direction.

// ---------------------------------------------------------------------
// 37. Prefer logical padding
// ---------------------------------------------------------------------

const LogicalPadding = (): React.ReactElement => {
  return (
    <button
      dir="rtl"
      style={{
        paddingInline: "1rem",
        paddingBlock: "0.5rem",
      }}
    >
      حفظ
    </button>
  );
};

// Logical properties reduce the need for separate LTR and RTL declarations.

// ---------------------------------------------------------------------
// 38. Prefer logical borders
// ---------------------------------------------------------------------

const LogicalBorder = (): React.ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        borderInlineStart: "4px solid currentColor",
        paddingInlineStart: "1rem",
      }}
    >
      ملاحظة
    </div>
  );
};

// Logical border properties follow the inline direction.

// ---------------------------------------------------------------------
// 39. Prefer text-align: start
// ---------------------------------------------------------------------

const StartAlignedText = (): React.ReactElement => {
  return (
    <p
      dir="rtl"
      style={{
        textAlign: "start",
      }}
    >
      هذا النص يبدأ من جهة بداية اتجاه الكتابة.
    </p>
  );
};

// `start` follows the inline direction instead of always meaning the physical left side.

// ---------------------------------------------------------------------
// 40. Prefer text-align: end
// ---------------------------------------------------------------------

const EndAlignedText = (): React.ReactElement => {
  return (
    <p
      dir="rtl"
      style={{
        textAlign: "end",
      }}
    >
      هذا النص ينتهي عند جهة نهاية اتجاه الكتابة.
    </p>
  );
};

// Logical alignment avoids hard-coding left and right for bidirectional interfaces.

// ---------------------------------------------------------------------
// 41. Avoid hard-coded left alignment
// ---------------------------------------------------------------------

const AvoidPhysicalAlignment = (): React.ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        textAlign: "start",
      }}
    >
      محتوى الواجهة
    </div>
  );
};

// Physical `left` and `right` values often require RTL-specific overrides.
// Logical alignment usually expresses the intent more directly.

// ---------------------------------------------------------------------
// 42. Use logical positioning
// ---------------------------------------------------------------------

const LogicalPositioning = (): React.ReactElement => {
  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        paddingInlineEnd: "3rem",
      }}
    >
      محتوى
    </div>
  );
};

// Layout should describe semantic relationships rather than assume a fixed physical side.

// ---------------------------------------------------------------------
// 43. Understand start and end
// ---------------------------------------------------------------------

const StartEndExplanation = (): React.ReactElement => {
  return (
    <div dir="rtl">
      <p>In RTL text, inline-start is the right side.</p>
      <p dir="ltr">In LTR text, inline-start is the left side.</p>
    </div>
  );
};

// Logical start and end depend on the writing direction.

// ---------------------------------------------------------------------
// 44. Use CSS direction when presentation requires it
// ---------------------------------------------------------------------

const CssDirectionExample = (): React.ReactElement => {
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

// CSS `direction` can control text and certain layout behavior.
// HTML `dir` is generally preferable when the direction is semantic.

// ---------------------------------------------------------------------
// 45. Prefer HTML dir for semantic direction
// ---------------------------------------------------------------------

const SemanticDirection = (): React.ReactElement => {
  return (
    <section dir="rtl">
      <p>هذا الاتجاه جزء من معنى المحتوى.</p>
    </section>
  );
};

// HTML `dir` communicates direction at the document markup level and is preferred when possible.

// ---------------------------------------------------------------------
// 46. Use CSS direction for component-specific presentation
// ---------------------------------------------------------------------

const ComponentPresentation = (): React.ReactElement => {
  return (
    <div
      style={{
        direction: "rtl",
        display: "grid",
      }}
    >
      محتوى مكوّن
    </div>
  );
};

// CSS can still be useful when direction is part of a component's presentation behavior.

// ---------------------------------------------------------------------
// 47. Avoid unicode-bidi overrides for ordinary RTL layouts
// ---------------------------------------------------------------------

const OrdinaryRtlText = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      هذا النص لا يحتاج إلى تجاوز خوارزمية الاتجاه ثنائي الاتجاه.
    </p>
  );
};

// Ordinary RTL content should normally rely on the Unicode bidirectional algorithm.

// ---------------------------------------------------------------------
// 48. Understand unicode-bidi as an advanced control
// ---------------------------------------------------------------------

const UnicodeBidiExample = (): React.ReactElement => {
  return (
    <span
      style={{
        direction: "rtl",
        unicodeBidi: "embed",
      }}
    >
      نص RTL
    </span>
  );
};

// `unicode-bidi` controls how an element participates in bidirectional text.
// It is an advanced mechanism rather than the normal way to establish page direction.

// ---------------------------------------------------------------------
// 49. Avoid bidi-override for normal content
// ---------------------------------------------------------------------

const NormalBidiFlow = (): React.ReactElement => {
  return <p dir="rtl">النص العربي يتبع خوارزمية Unicode الطبيعية.</p>;
};

// `bidi-override` can force character ordering and should not be used simply to create an RTL interface.

// ---------------------------------------------------------------------
// 50. Use dir for an RTL application shell
// ---------------------------------------------------------------------

interface ApplicationShellProps {
  readonly direction: TextDirection;
  readonly children: React.ReactNode;
}

const ApplicationShell: React.FC<ApplicationShellProps> = ({ direction, children }): React.ReactElement => {
  return <div dir={direction}>{children}</div>;
};

// A single application shell can establish direction for a large portion of the interface.

// ---------------------------------------------------------------------
// 51. Derive direction from application locale
// ---------------------------------------------------------------------

interface LocalizedShellProps {
  readonly locale: SupportedLocale;
  readonly children: React.ReactNode;
}

const LocalizedShell: React.FC<LocalizedShellProps> = ({ locale, children }): React.ReactElement => {
  const direction = getDirection(locale);

  return (
    <div dir={direction} lang={locale}>
      {children}
    </div>
  );
};

// The application can derive both language metadata and direction from locale configuration.

// ---------------------------------------------------------------------
// 52. Use locale state to switch direction
// ---------------------------------------------------------------------

const LocaleDirectionSwitcher: React.FC = (): React.ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const direction = getDirection(locale);

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  return (
    <main dir={direction} lang={locale}>
      <label>
        Locale
        <select value={locale} onChange={handleLocaleChange}>
          <option value="en-US">English</option>
          <option value="ar">العربية</option>
          <option value="he">עברית</option>
          <option value="fa">فارسی</option>
        </select>
      </label>

      <p>Current locale: {locale}</p>
    </main>
  );
};

// Changing the locale can change the base direction of the application shell.

// ---------------------------------------------------------------------
// 53. Keep direction state derived when possible
// ---------------------------------------------------------------------

interface DirectionStateProps {
  readonly locale: SupportedLocale;
}

const DerivedDirection: React.FC<DirectionStateProps> = ({ locale }): React.ReactElement => {
  const direction = getDirection(locale);

  return (
    <div dir={direction}>
      <p>Direction: {direction}</p>
    </div>
  );
};

// Direction is derived from locale instead of being stored as a second independent state value.

// ---------------------------------------------------------------------
// 54. Avoid conflicting locale and direction state
// ---------------------------------------------------------------------

interface ConsistentLocaleState {
  readonly locale: SupportedLocale;
}

const consistentLocaleState: ConsistentLocaleState = {
  locale: "ar",
};

console.log(getDirection(consistentLocaleState.locale));

// Independent locale and direction state can become inconsistent.
// Deriving direction from locale removes that synchronization problem.

// ---------------------------------------------------------------------
// 55. Keep a direction-aware component reusable
// ---------------------------------------------------------------------

interface DirectionalPanelProps {
  readonly direction: TextDirection;
  readonly title: string;
  readonly children: React.ReactNode;
}

const DirectionalPanel: React.FC<DirectionalPanelProps> = ({ direction, title, children }): React.ReactElement => {
  return (
    <section dir={direction}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

// Reusable components can accept direction when they need to render independently of a global locale.

// ---------------------------------------------------------------------
// 56. Support an explicit LTR exception
// ---------------------------------------------------------------------

const LtrException = (): React.ReactElement => {
  return (
    <section dir="rtl" lang="ar">
      <p>هذا النص عربي.</p>

      <div dir="ltr">
        <code>const result = value + 1;</code>
      </div>
    </section>
  );
};

// An explicit LTR boundary is useful for content with an established left-to-right convention.

// ---------------------------------------------------------------------
// 57. Use LTR for technical controls
// ---------------------------------------------------------------------

const TechnicalControl = (): React.ReactElement => {
  return (
    <div dir="rtl">
      <label>
        API endpoint
        <input dir="ltr" defaultValue="https://example.com/api" />
      </label>
    </div>
  );
};

// Technical values can have a natural direction independent of the surrounding interface.

// ---------------------------------------------------------------------
// 58. Keep telephone numbers predictable
// ---------------------------------------------------------------------

const TelephoneNumber = (): React.ReactElement => {
  return (
    <p dir="rtl">
      الهاتف: <span dir="ltr">+1 555 0100</span>
    </p>
  );
};

// Telephone numbers are commonly represented with an explicit LTR direction.

// ---------------------------------------------------------------------
// 59. Keep dates and codes readable
// ---------------------------------------------------------------------

const TechnicalValues = (): React.ReactElement => {
  return (
    <div dir="rtl">
      <p>
        التاريخ: <span dir="ltr">2026-09-29</span>
      </p>

      <p>
        الرمز: <code dir="ltr">INV-1024</code>
      </p>
    </div>
  );
};

// Machine-oriented values can be isolated with LTR direction when that matches their notation.

// ---------------------------------------------------------------------
// 60. Avoid manually reversing text
// ---------------------------------------------------------------------

const NeverReverseCharacters = (): React.ReactElement => {
  return (
    <p dir="rtl" lang="ar">
      مرحباً بالعالم
    </p>
  );
};

// RTL support should establish direction rather than reversing the characters in the source string.

// ---------------------------------------------------------------------
// 61. Keep source strings in logical order
// ---------------------------------------------------------------------

const logicalArabicMessage = "مرحباً بالعالم";

console.log(logicalArabicMessage);

// Translation resources should store strings in their natural logical character order.

// ---------------------------------------------------------------------
// 62. Use direction instead of duplicated RTL strings
// ---------------------------------------------------------------------

const DirectionAwareMessage = ({ direction }: { readonly direction: TextDirection }): React.ReactElement => {
  return <p dir={direction}>Direction-aware content</p>;
};

// Direction is presentation metadata; it should not require duplicating the content itself.

// ---------------------------------------------------------------------
// 63. Use document direction when controlling the whole document
// ---------------------------------------------------------------------

const setDocumentDirection = (direction: TextDirection): void => {
  document.documentElement.dir = direction;
};

console.log(setDocumentDirection);

// `document.documentElement.dir` reflects the HTML document's direction.
// This operation must run in a browser environment.

// ---------------------------------------------------------------------
// 64. Set document language and direction together
// ---------------------------------------------------------------------

const setDocumentLocale = (locale: SupportedLocale): void => {
  const root = document.documentElement;

  root.lang = locale;
  root.dir = getDirection(locale);
};

console.log(setDocumentLocale);

// Language and direction can be updated together when the application changes its active locale.

// ---------------------------------------------------------------------
// 65. Apply document direction from React
// ---------------------------------------------------------------------

const DocumentDirectionController: React.FC<{
  readonly locale: SupportedLocale;
}> = ({ locale }): React.ReactElement => {
  const direction = getDirection(locale);

  React.useEffect(() => {
    const root = document.documentElement;

    root.lang = locale;
    root.dir = direction;

    return () => {
      root.lang = "";
      root.dir = "ltr";
    };
  }, [locale, direction]);

  return <output>{direction}</output>;
};

// Effects are appropriate when React state must synchronize with the external document element.

// ---------------------------------------------------------------------
// 66. Keep document synchronization in one component
// ---------------------------------------------------------------------

interface DocumentLocaleProps {
  readonly locale: SupportedLocale;
}

const DocumentLocale: React.FC<DocumentLocaleProps> = ({ locale }): React.ReactElement => {
  const direction = getDirection(locale);

  React.useEffect(() => {
    const root = document.documentElement;
    const previousLanguage = root.lang;
    const previousDirection = root.dir;

    root.lang = locale;
    root.dir = direction;

    return () => {
      root.lang = previousLanguage;
      root.dir = previousDirection;
    };
  }, [locale, direction]);

  return <span hidden />;
};

// Centralizing document synchronization avoids multiple components competing to control the root direction.

// ---------------------------------------------------------------------
// 67. Use direction in component APIs when necessary
// ---------------------------------------------------------------------

interface DirectionAwareContentProps {
  readonly direction: TextDirection;
  readonly children: React.ReactNode;
}

const DirectionAwareContent: React.FC<DirectionAwareContentProps> = ({ direction, children }): React.ReactElement => {
  return <div dir={direction}>{children}</div>;
};

// Components that render independent content can expose direction as an explicit API.

// ---------------------------------------------------------------------
// 68. Do not hard-code RTL-only assumptions
// ---------------------------------------------------------------------

const DirectionIndependentLayout = (): React.ReactElement => {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        paddingInline: "1rem",
      }}
    >
      <span>Label</span>
      <span>Value</span>
    </div>
  );
};

// Logical CSS properties allow the same component to adapt to both LTR and RTL contexts.

// ---------------------------------------------------------------------
// 69. Build a direction-independent card
// ---------------------------------------------------------------------

interface CardProps {
  readonly title: string;
  readonly description: string;
}

const DirectionIndependentCard: React.FC<CardProps> = ({ title, description }): React.ReactElement => {
  return (
    <article
      style={{
        paddingBlock: "1rem",
        paddingInline: "1.5rem",
        borderInlineStart: "4px solid currentColor",
      }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
};

// The component does not need separate LTR and RTL implementations.

// ---------------------------------------------------------------------
// 70. Keep icon meaning independent of physical position
// ---------------------------------------------------------------------

const DirectionalAction = (): React.ReactElement => {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span aria-hidden="true">→</span>
      متابعة
    </button>
  );
};

// Direction-sensitive icons may need semantic consideration rather than blindly mirroring every symbol.

// ---------------------------------------------------------------------
// 71. Distinguish directional icons from semantic icons
// ---------------------------------------------------------------------

const SemanticIconExample = (): React.ReactElement => {
  return (
    <button type="button">
      <span aria-hidden="true">★</span>
      المفضلة
    </button>
  );
};

// Not every icon represents physical direction.
// Directional symbols and semantic symbols should be treated differently.

// ---------------------------------------------------------------------
// 72. Use dir on user-entered text when known
// ---------------------------------------------------------------------

interface MessageInputProps {
  readonly direction: TextDirection;
}

const MessageInput: React.FC<MessageInputProps> = ({ direction }): React.ReactElement => {
  return <textarea dir={direction} aria-label="Message" />;
};

// When the expected direction is known, an input can receive that direction explicitly.

// ---------------------------------------------------------------------
// 73. Use dir="auto" for unknown user-entered text
// ---------------------------------------------------------------------

const UnknownMessageInput = (): React.ReactElement => {
  return <textarea dir="auto" aria-label="Message" />;
};

// `dir="auto"` is useful when the application cannot know the direction of the user's text in advance.

// ---------------------------------------------------------------------
// 74. Keep placeholder text compatible with direction
// ---------------------------------------------------------------------

const DirectionalSearchInput = (): React.ReactElement => {
  return <input type="search" dir="rtl" placeholder="ابحث" aria-label="بحث" />;
};

// Form controls participate in the surrounding direction unless their own direction is specified.

// ---------------------------------------------------------------------
// 75. Build a localized shell
// ---------------------------------------------------------------------

interface LocalizedApplicationProps {
  readonly locale: SupportedLocale;
}

const LocalizedApplication: React.FC<LocalizedApplicationProps> = ({ locale }): React.ReactElement => {
  const direction = getDirection(locale);

  return (
    <main
      dir={direction}
      lang={locale}
      style={{
        minHeight: "100vh",
        paddingBlock: "2rem",
        paddingInline: "1.5rem",
      }}
    >
      <h1>{locale}</h1>

      <p>Direction: {direction}</p>
    </main>
  );
};

// A localized application shell can establish language, direction, and logical layout together.

// ---------------------------------------------------------------------
// 76. Build a complete locale-aware example
// ---------------------------------------------------------------------

const RightToLeftDemo: React.FC = (): React.ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("ar");

  const direction = getDirection(locale);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  return (
    <main
      dir={direction}
      lang={locale}
      style={{
        maxWidth: "40rem",
        marginInline: "auto",
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

      <section>
        <h1>
          {locale === "ar" ? "مرحباً بك" : locale === "he" ? "ברוכים הבאים" : locale === "fa" ? "خوش آمدید" : "Welcome"}
        </h1>

        <p>Direction: {direction}</p>

        <p>example.com</p>

        <code dir="ltr">user_123</code>
      </section>
    </main>
  );
};

// The integrated example derives direction from locale and lets the markup inherit that direction.

// ---------------------------------------------------------------------
// 77. Keep the direction model small
// ---------------------------------------------------------------------

interface LocaleConfiguration {
  readonly locale: SupportedLocale;
  readonly direction: TextDirection;
}

const createLocaleConfiguration = (locale: SupportedLocale): LocaleConfiguration => {
  return {
    locale,
    direction: getDirection(locale),
  };
};

console.log(createLocaleConfiguration("ar"));

// A small locale configuration object can provide the values needed by the UI layer.

// ---------------------------------------------------------------------
// 78. Validate direction configuration
// ---------------------------------------------------------------------

const isTextDirection = (value: string): value is TextDirection => {
  return value === "ltr" || value === "rtl";
};

console.log(isTextDirection("rtl"));
console.log(isTextDirection("vertical"));

// Runtime validation is useful when locale configuration originates outside TypeScript's type system.

// ---------------------------------------------------------------------
// 79. Keep RTL support systematic
// ---------------------------------------------------------------------

const rtlImplementationChecklist = [
  "Set the appropriate HTML dir attribute",
  "Set the appropriate language metadata",
  "Use logical CSS properties",
  "Use logical text alignment",
  "Isolate technical LTR values when appropriate",
  "Avoid manually reversing characters",
];

console.log(rtlImplementationChecklist);

// RTL support is a layout and text-direction concern that should be handled consistently across the interface.

// ---------------------------------------------------------------------
// 80. Export the integrated example
// ---------------------------------------------------------------------

export default RightToLeftDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - RTL interfaces are commonly used for languages such as Arabic, Hebrew, Persian, and Urdu.
// - The HTML `dir` attribute establishes an element's base text direction.
// - `dir="ltr"` establishes left-to-right direction.
// - `dir="rtl"` establishes right-to-left direction.
// - `dir="auto"` lets the user agent determine the base direction from the element's text.
// - `lang` identifies the language but does not itself establish text direction.
// - Direction generally inherits from the parent when an element does not specify its own `dir`.
// - Nested elements can explicitly override the inherited direction.
// - The document root can establish direction for an entire application.
// - React can derive direction from the application's active locale.
// - Direction should generally be derived from locale rather than stored as conflicting independent state.
// - User-generated content with unknown direction can use `dir="auto"`.
// - The `<bdi>` element isolates an inline value whose direction may differ from surrounding content.
// - RTL does not mean every embedded value must be displayed right to left.
// - English text, URLs, email addresses, source code, identifiers, and similar technical values often need explicit LTR treatment.
// - Numbers can appear naturally inside RTL text without manually reversing their characters.
// - Tables and horizontal layouts can be affected by the document's direction.
// - CSS logical properties such as `margin-inline-start` and `padding-inline` adapt to text direction.
// - `text-align: start` and `text-align: end` express alignment relative to writing direction.
// - Logical CSS properties reduce the need for separate physical left/right RTL overrides.
// - HTML `dir` is generally preferable to CSS `direction` when direction is semantic document information.
// - CSS `direction` can still be useful for component-specific presentation behavior.
// - The Unicode bidirectional algorithm handles much of the interaction between LTR and RTL text automatically.
// - `unicode-bidi` is an advanced mechanism for controlling bidirectional embedding and should not replace ordinary `dir` usage.
// - `bidi-override` should not be used simply to implement an RTL interface.
// - RTL support should not be implemented by reversing characters in strings.
// - Translation strings should remain in their natural logical character order.
// - Forms can inherit RTL direction while individual technical fields can explicitly use LTR.
// - Component APIs can accept a direction when a component must render independently of the surrounding document.
// - Direction-independent components should prefer logical layout properties over physical left/right assumptions.
// - Directional icons require different consideration from semantic icons.
// - A locale change can require both language and document direction to change.
// - When React state must update the actual document element, synchronization belongs in an effect.
// - RTL support should be treated as a systematic layout and text-direction requirement rather than a collection of isolated overrides.

/**
 * Semantic HTML
 * =============
 *
 * Semantic HTML uses elements according to their intended meaning and purpose rather than
 * choosing elements only for their default visual appearance. Semantic structure gives browsers,
 * assistive technologies, and other tools meaningful information about the relationships between
 * parts of a document.
 *
 * Semantic HTML is an important accessibility foundation because native elements provide built-in
 * semantics and, for interactive elements, appropriate browser behavior. It also makes document
 * structure easier to understand and maintain.
 */

import { type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What semantic HTML means
// ---------------------------------------------------------------------

// Semantic HTML means choosing an element because of what the content or
// interaction means.
//
// Examples:
//
// <main>     -> primary content
// <nav>      -> navigation links
// <article>  -> self-contained content
// <button>   -> an action
// <a>        -> navigation to another resource or location
// <h2>       -> a heading
//
// The element communicates meaning independently of its visual styling.

// ---------------------------------------------------------------------
// 2. Semantic versus presentational markup
// ---------------------------------------------------------------------

export interface MarkupComparison {
  readonly semantic: string;
  readonly presentational: string;
  readonly purpose: string;
}

export const markupComparison: MarkupComparison = {
  semantic: "<button>Save</button>",
  presentational: '<div class="button">Save</div>',
  purpose: "Describe the control according to what it does.",
};

// CSS controls presentation.
//
// HTML communicates structure and meaning.
//
// A class name such as "button" does not give a div the native semantics
// and behavior of an actual button.

// ---------------------------------------------------------------------
// 3. Why semantic HTML matters for accessibility
// ---------------------------------------------------------------------

export const semanticHtmlBenefits = [
  "Communicates document structure",
  "Provides native semantics",
  "Provides built-in browser behavior for native controls",
  "Helps assistive technologies interpret content",
  "Makes keyboard interaction easier when native controls are used",
  "Makes the DOM easier to understand and maintain",
] as const;

// Assistive technologies can use semantic information exposed by the
// browser to help users navigate and interact with a page.

// ---------------------------------------------------------------------
// 4. The right element for the right job
// ---------------------------------------------------------------------

export interface ElementPurpose {
  readonly element: string;
  readonly purpose: string;
}

export const elementPurposes: readonly ElementPurpose[] = [
  {
    element: "button",
    purpose: "Perform an action.",
  },
  {
    element: "a",
    purpose: "Navigate to another URL or document location.",
  },
  {
    element: "nav",
    purpose: "Contain a major set of navigation links.",
  },
  {
    element: "main",
    purpose: "Contain the primary content of the document.",
  },
  {
    element: "article",
    purpose: "Represent self-contained content that can stand independently.",
  },
  {
    element: "section",
    purpose: "Group related content into a thematic section.",
  },
];

// Choosing the native element that matches the intended purpose gives the
// browser more information without requiring additional ARIA.

// ---------------------------------------------------------------------
// 5. Generic div elements
// ---------------------------------------------------------------------

export const genericContainerExample = (
  <div>
    <div>Example heading</div>
    <div>Example content</div>
  </div>
);

// A div is a generic container.
//
// It has no heading semantics merely because its content looks like a
// heading.
//
// It has no navigation semantics merely because it contains links.
//
// It has no button behavior merely because a class name says "button".

// ---------------------------------------------------------------------
// 6. Semantic replacement for generic containers
// ---------------------------------------------------------------------

export const semanticContainerExample = (
  <article>
    <h2>Example heading</h2>
    <p>Example content</p>
  </article>
);

// The semantic version communicates that the content is an article with
// a heading and paragraph.

// ---------------------------------------------------------------------
// 7. Document landmarks
// ---------------------------------------------------------------------

export const landmarkElements = ["header", "nav", "main", "aside", "footer"] as const;

// Landmarks identify important regions of a page.
//
// Assistive technologies can expose these regions as navigation targets.

// ---------------------------------------------------------------------
// 8. Header
// ---------------------------------------------------------------------

export const HeaderExample = (): ReactElement => {
  return (
    <header>
      <h1>Example site</h1>
      <p>Example site description.</p>
    </header>
  );
};

// A header can introduce a page or a section.
//
// A document-level header can expose a banner landmark through native
// HTML semantics.

// ---------------------------------------------------------------------
// 9. Navigation
// ---------------------------------------------------------------------

export const NavigationExample = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        <li>
          <a href="/example">Home</a>
        </li>
        <li>
          <a href="/example/about">About</a>
        </li>
        <li>
          <a href="/example/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

// nav identifies a section containing navigation links.
//
// When multiple navigation landmarks exist, an accessible label can
// distinguish their purposes.

// ---------------------------------------------------------------------
// 10. Main content
// ---------------------------------------------------------------------

export const MainExample = (): ReactElement => {
  return (
    <main>
      <h1>Example page</h1>
      <p>Primary page content.</p>
    </main>
  );
};

// main identifies the primary content of the document.
//
// A document should normally have one main landmark representing its
// primary content.

// ---------------------------------------------------------------------
// 11. Aside
// ---------------------------------------------------------------------

export const AsideExample = (): ReactElement => {
  return (
    <aside>
      <h2>Related information</h2>
      <p>Additional content related to the surrounding content.</p>
    </aside>
  );
};

// aside represents content that is tangentially related to the surrounding
// content, such as related links or supplementary information.

// ---------------------------------------------------------------------
// 12. Footer
// ---------------------------------------------------------------------

export const FooterExample = (): ReactElement => {
  return (
    <footer>
      <p>Example site footer.</p>
    </footer>
  );
};

// A footer can contain information about the nearest sectioning content or
// the document as a whole.

// ---------------------------------------------------------------------
// 13. A complete semantic page
// ---------------------------------------------------------------------

export const SemanticPage = (): ReactElement => {
  return (
    <>
      <header>
        <h1>Example site</h1>
      </header>

      <nav aria-label="Primary navigation">
        <ul>
          <li>
            <a href="/example">Home</a>
          </li>
          <li>
            <a href="/example/about">About</a>
          </li>
        </ul>
      </nav>

      <main>
        <article>
          <h2>Example article</h2>
          <p>Example article content.</p>
        </article>

        <aside>
          <h2>Related information</h2>
          <p>Supplementary content.</p>
        </aside>
      </main>

      <footer>
        <p>Example site footer.</p>
      </footer>
    </>
  );
};

// This structure gives the document meaningful regions without manually
// assigning equivalent ARIA roles to each element.

// ---------------------------------------------------------------------
// 14. Headings provide document structure
// ---------------------------------------------------------------------

export const headingHierarchy = (
  <>
    <h1>Example page</h1>
    <h2>First section</h2>
    <h3>First subsection</h3>
    <h3>Second subsection</h3>
    <h2>Second section</h2>
  </>
);

// Heading elements communicate the hierarchy of the content.
//
// Screen readers commonly provide mechanisms for navigating by headings,
// so headings should represent actual sections rather than visual styling.

// ---------------------------------------------------------------------
// 15. Heading levels are not font sizes
// ---------------------------------------------------------------------

export const incorrectHeadingUsage = (
  <>
    <h1>Small piece of text</h1>
    <h4>Large visual heading</h4>
  </>
);

// Heading levels should not be selected merely because their default
// browser styles have the desired size.
//
// CSS should control visual appearance.
//
// HTML heading levels should represent document hierarchy.

// ---------------------------------------------------------------------
// 16. Logical heading hierarchy
// ---------------------------------------------------------------------

export const logicalHeadingHierarchy = (
  <>
    <h1>Example page</h1>

    <section>
      <h2>Account</h2>
      <p>Account information.</p>

      <section>
        <h3>Contact information</h3>
        <p>Contact information details.</p>
      </section>
    </section>

    <section>
      <h2>Preferences</h2>
      <p>Preference information.</p>
    </section>
  </>
);

// Heading levels should reflect the nesting of sections.
//
// A heading should not be chosen simply to make text appear larger or
// smaller.

// ---------------------------------------------------------------------
// 17. Heading levels and skipping
// ---------------------------------------------------------------------

export const headingLevels = {
  valid: ["h1", "h2", "h3"],
  problematic: ["h1", "h3"],
} as const;

// Heading levels should generally progress logically through the
// document hierarchy.
//
// The important question is the structure represented by the headings,
// not the visual size of the text.

// ---------------------------------------------------------------------
// 18. Section
// ---------------------------------------------------------------------

export const SectionExample = (): ReactElement => {
  return (
    <section aria-labelledby="account-heading">
      <h2 id="account-heading">Account</h2>
      <p>Account information.</p>
    </section>
  );
};

// section represents a thematic grouping of content.
//
// A section should normally have a heading.
//
// Giving a section an accessible name can expose it as a named region
// when that landmark is useful.

// ---------------------------------------------------------------------
// 19. Section versus div
// ---------------------------------------------------------------------

export interface SectionComparison {
  readonly section: string;
  readonly div: string;
}

export const sectionComparison: SectionComparison = {
  section: "A thematic grouping of related content.",
  div: "A generic container with no inherent semantic meaning.",
};

// Do not replace every div with section.
//
// section communicates a meaningful grouping, while div is appropriate
// when no more specific semantic element applies.

// ---------------------------------------------------------------------
// 20. Named sections
// ---------------------------------------------------------------------

export const NamedSection = (): ReactElement => {
  return (
    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>

      <ul>
        <li>Example feature one</li>
        <li>Example feature two</li>
        <li>Example feature three</li>
      </ul>
    </section>
  );
};

// aria-labelledby associates the section with its visible heading.
//
// This is useful when the section needs to be exposed as a named region.

// ---------------------------------------------------------------------
// 21. Article
// ---------------------------------------------------------------------

export const ArticleExample = (): ReactElement => {
  return (
    <article>
      <h2>Example article</h2>
      <p>Article content.</p>
    </article>
  );
};

// article represents self-contained content that could stand independently
// from the surrounding page content.

// Examples can include:
//
// - an article
// - a forum post
// - a comment
// - a news item
// - a product review

// ---------------------------------------------------------------------
// 22. Article versus section
// ---------------------------------------------------------------------

export interface ArticleSectionComparison {
  readonly article: string;
  readonly section: string;
}

export const articleSectionComparison: ArticleSectionComparison = {
  article: "Self-contained content that can stand independently.",
  section: "A thematic grouping of related content.",
};

// Both elements can contain headings and other semantic content.
//
// The distinction is based on the meaning and purpose of the content.

// ---------------------------------------------------------------------
// 23. Lists
// ---------------------------------------------------------------------

export const ListExample = (): ReactElement => {
  return (
    <ul>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ul>
  );
};

// Use ul for an unordered list.
//
// Each direct list item should be represented with li.

// ---------------------------------------------------------------------
// 24. Ordered lists
// ---------------------------------------------------------------------

export const OrderedListExample = (): ReactElement => {
  return (
    <ol>
      <li>Open the settings.</li>
      <li>Choose the account option.</li>
      <li>Save the changes.</li>
    </ol>
  );
};

// Use ol when the order of the items has meaning.

// ---------------------------------------------------------------------
// 25. Description lists
// ---------------------------------------------------------------------

export const DescriptionListExample = (): ReactElement => {
  return (
    <dl>
      <div>
        <dt>Name</dt>
        <dd>John Doe</dd>
      </div>

      <div>
        <dt>Email</dt>
        <dd>john.doe@example.com</dd>
      </div>
    </dl>
  );
};

// dl, dt, and dd provide semantics for groups of terms and descriptions.
//
// The elements can be useful for metadata, definitions, and key-value
// information.

// ---------------------------------------------------------------------
// 26. Paragraphs
// ---------------------------------------------------------------------

export const ParagraphExample = (): ReactElement => {
  return (
    <section>
      <h2>Introduction</h2>
      <p>
        Semantic HTML gives content a meaningful structure that can be interpreted by browsers and assistive
        technologies.
      </p>
      <p>Structure should describe the content rather than its visual appearance.</p>
    </section>
  );
};

// Use p for paragraphs rather than using div or br elements to create
// paragraph-like spacing.

// ---------------------------------------------------------------------
// 27. Line breaks are not paragraphs
// ---------------------------------------------------------------------

export const IncorrectParagraphStructure = (): ReactElement => {
  return (
    <div>
      First paragraph.
      <br />
      <br />
      Second paragraph.
    </div>
  );
};

// br represents a line break.
//
// It should not be used repeatedly to create document structure or
// spacing between paragraphs.

// ---------------------------------------------------------------------
// 28. Strong and emphasis
// ---------------------------------------------------------------------

export const TextSemanticsExample = (): ReactElement => {
  return (
    <p>
      <strong>Important:</strong> Save the changes before leaving.
      <br />
      Read the <em>entire</em> message before continuing.
    </p>
  );
};

// strong communicates strong importance.
//
// em communicates emphasis.
//
// These elements provide meaning rather than merely changing font weight
// or style.

// ---------------------------------------------------------------------
// 29. Visual styling is not semantic structure
// ---------------------------------------------------------------------

export const VisualStylingExample = (): ReactElement => {
  return (
    <p>
      <span style={{ fontWeight: "bold" }}>Important:</span> Save the changes before leaving.
    </p>
  );
};

// CSS can make text look bold, but visual styling alone does not express
// the same semantic meaning as strong.

// ---------------------------------------------------------------------
// 30. Links are navigation
// ---------------------------------------------------------------------

export const LinkExample = (): ReactElement => {
  return (
    <p>
      Read the <a href="/example/accessibility">accessibility information</a>.
    </p>
  );
};

// A link identifies navigation to another resource or location.
//
// The browser provides native link behavior, including keyboard access.

// ---------------------------------------------------------------------
// 31. Buttons are actions
// ---------------------------------------------------------------------

export const ButtonExample = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// A button represents an action.
//
// Native buttons provide keyboard and interaction behavior that should not
// need to be recreated manually.

// ---------------------------------------------------------------------
// 32. Do not use div as a button
// ---------------------------------------------------------------------

export const IncorrectButton = (): ReactElement => {
  return <div>Save changes</div>;
};

// This div is not a button.
//
// Adding a class named "button" changes appearance only.
//
// Adding an onClick handler also does not automatically reproduce all of
// the semantics and keyboard behavior of a native button.

// ---------------------------------------------------------------------
// 33. Native button versus custom button
// ---------------------------------------------------------------------

export const NativeButton = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Prefer native controls when they provide the required behavior.
//
// Custom interactive elements require careful handling of semantics,
// keyboard interaction, focus, states, and activation behavior.

// ---------------------------------------------------------------------
// 34. Form semantics
// ---------------------------------------------------------------------

export const FormExample = (): ReactElement => {
  return (
    <form>
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </div>

      <button type="submit">Continue</button>
    </form>
  );
};

// form identifies a collection of controls used to submit or otherwise
// process user-provided information.
//
// label associates human-readable text with the input.

// ---------------------------------------------------------------------
// 35. Label and input association
// ---------------------------------------------------------------------

export const LabelAssociationExample = (): ReactElement => {
  return (
    <div>
      <label htmlFor="name">Full name</label>
      <input id="name" name="name" type="text" />
    </div>
  );
};

// htmlFor on the label corresponds to the input id.
//
// This creates a programmatic relationship between the label and control.

// ---------------------------------------------------------------------
// 36. Tables
// ---------------------------------------------------------------------

export const TableExample = (): ReactElement => {
  return (
    <table>
      <caption>Example account information</caption>

      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>John Doe</td>
          <td>Active</td>
        </tr>
      </tbody>
    </table>
  );
};

// Use table for tabular data.
//
// th identifies header cells.
//
// scope can clarify whether a header applies to a column or row.

// ---------------------------------------------------------------------
// 37. Caption
// ---------------------------------------------------------------------

export const TableCaptionExample = (): ReactElement => {
  return (
    <table>
      <caption>Example account information</caption>

      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john.doe@example.com</td>
        </tr>
      </tbody>
    </table>
  );
};

// caption provides a title or description for the table itself.

// ---------------------------------------------------------------------
// 38. Figure and figcaption
// ---------------------------------------------------------------------

export const FigureExample = (): ReactElement => {
  return (
    <figure>
      <img src="/example-image.jpg" alt="Example product displayed from the front" />
      <figcaption>Example product photograph.</figcaption>
    </figure>
  );
};

// figure represents self-contained content such as an illustration,
// diagram, photograph, or code example.
//
// figcaption provides a caption for the figure.

// ---------------------------------------------------------------------
// 39. Time
// ---------------------------------------------------------------------

export const TimeExample = (): ReactElement => {
  return (
    <p>
      Published on <time dateTime="2026-09-29">September 29, 2026</time>.
    </p>
  );
};

// time can provide machine-readable date or time information through
// dateTime while retaining human-readable text.

// ---------------------------------------------------------------------
// 40. Search
// ---------------------------------------------------------------------

export const SearchExample = (): ReactElement => {
  return (
    <search>
      <form>
        <label htmlFor="site-search">Search</label>
        <input id="site-search" name="q" type="search" />
        <button type="submit">Search</button>
      </form>
    </search>
  );
};

// search identifies a region containing controls related to searching.
//
// Use the native semantic element when the environment supports the
// element as intended.

// ---------------------------------------------------------------------
// 41. Navigation should contain navigation
// ---------------------------------------------------------------------

export const NavigationListExample = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        <li>
          <a href="/example">Home</a>
        </li>
        <li>
          <a href="/example/products">Products</a>
        </li>
        <li>
          <a href="/example/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

// nav should describe a major navigation area rather than being used as a
// generic container around unrelated content.

// ---------------------------------------------------------------------
// 42. Multiple navigation regions
// ---------------------------------------------------------------------

export const MultipleNavigationExample = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary navigation">
        <a href="/example">Home</a>
        <a href="/example/products">Products</a>
      </nav>

      <footer>
        <nav aria-label="Footer navigation">
          <a href="/example/privacy">Privacy</a>
          <a href="/example/contact">Contact</a>
        </nav>
      </footer>
    </>
  );
};

// When multiple nav landmarks have different purposes, labels help users
// distinguish them.

// ---------------------------------------------------------------------
// 43. Main content should be easy to identify
// ---------------------------------------------------------------------

export const MainWithId = (): ReactElement => {
  return (
    <main id="main-content">
      <h1>Example page</h1>
      <p>Primary content.</p>
    </main>
  );
};

// Giving main an id also makes it possible to target it from a skip link.

// ---------------------------------------------------------------------
// 44. Skip link foundation
// ---------------------------------------------------------------------

export const SkipLinkExample = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <h1>Example site</h1>
      </header>

      <nav aria-label="Primary navigation">
        <a href="/example">Home</a>
        <a href="/example/about">About</a>
      </nav>

      <main id="main-content">
        <h2>Example content</h2>
        <p>Primary page content.</p>
      </main>
    </>
  );
};

// A skip link can allow keyboard users to bypass repeated navigation and
// reach the main content directly.

// ---------------------------------------------------------------------
// 45. Source order matters
// ---------------------------------------------------------------------

export const LogicalSourceOrder = (): ReactElement => {
  return (
    <main>
      <h1>Example page</h1>

      <section>
        <h2>Primary information</h2>
        <p>Information users need first.</p>
      </section>

      <section>
        <h2>Additional information</h2>
        <p>Supplementary information.</p>
      </section>
    </main>
  );
};

// CSS can change visual placement.
//
// The DOM order should still make sense when read sequentially and when
// navigated using assistive technology.

// ---------------------------------------------------------------------
// 46. CSS should handle presentation
// ---------------------------------------------------------------------

export const PresentationExample = (): ReactElement => {
  return (
    <article>
      <h2>Example heading</h2>
      <p>Example content.</p>
    </article>
  );
};

// Use CSS for:
//
// - font size
// - spacing
// - colors
// - layout
// - borders
// - visual decoration
//
// Use semantic HTML for:
//
// - headings
// - navigation
// - articles
// - lists
// - buttons
// - links
// - forms

// ---------------------------------------------------------------------
// 47. Semantic HTML does not mean no CSS
// ---------------------------------------------------------------------

export interface StyledSemanticComponentProps {
  readonly title: string;
}

export const StyledSemanticComponent = ({ title }: StyledSemanticComponentProps): ReactElement => {
  return (
    <section className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-content">Example content.</p>
    </section>
  );
};

// Semantic HTML and CSS have different responsibilities.
//
// Semantic elements can be styled freely without losing their underlying
// meaning.

// ---------------------------------------------------------------------
// 48. ARIA should not replace native HTML unnecessarily
// ---------------------------------------------------------------------

export const NativeNavigation = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <a href="/example">Home</a>
      <a href="/example/about">About</a>
    </nav>
  );
};

// Prefer native semantic HTML when it already provides the required
// semantics.
//
// ARIA is useful when native HTML cannot express the required semantic
// relationship or state.

// ---------------------------------------------------------------------
// 49. Redundant ARIA can add complexity
// ---------------------------------------------------------------------

export const UnnecessaryRoleExample = (): ReactElement => {
  return (
    <button type="button" role="button">
      Save
    </button>
  );
};

// The explicit role is unnecessary because button already has button
// semantics.
//
// Unnecessary ARIA makes markup harder to reason about and can create
// conflicts when used incorrectly.

// ---------------------------------------------------------------------
// 50. Semantic HTML and accessibility trees
// ---------------------------------------------------------------------

export interface AccessibilityTreeInformation {
  readonly sourceElement: string;
  readonly semanticMeaning: string;
}

export const accessibilityTreeExamples: readonly AccessibilityTreeInformation[] = [
  {
    sourceElement: "<button>Save</button>",
    semanticMeaning: "Button named Save.",
  },
  {
    sourceElement: "<nav>...</nav>",
    semanticMeaning: "Navigation landmark.",
  },
  {
    sourceElement: "<main>...</main>",
    semanticMeaning: "Main landmark.",
  },
  {
    sourceElement: "<h2>Account</h2>",
    semanticMeaning: "Level-two heading named Account.",
  },
];

// Browsers expose semantic information through platform accessibility
// interfaces that assistive technologies can consume.

// ---------------------------------------------------------------------
// 51. Semantic HTML and screen reader navigation
// ---------------------------------------------------------------------

export const screenReaderNavigationTargets = [
  "Headings",
  "Landmarks",
  "Links",
  "Buttons",
  "Form controls",
  "Lists",
] as const;

// Screen readers commonly provide navigation mechanisms based on these
// semantic structures.
//
// Poorly structured content removes useful navigation information.

// ---------------------------------------------------------------------
// 52. Nested semantic structure
// ---------------------------------------------------------------------

export const NestedSemanticStructure = (): ReactElement => {
  return (
    <main>
      <h1>Example page</h1>

      <article>
        <h2>Example article</h2>

        <section>
          <h3>First topic</h3>
          <p>First topic content.</p>
        </section>

        <section>
          <h3>Second topic</h3>
          <p>Second topic content.</p>
        </section>
      </article>
    </main>
  );
};

// Semantic elements can be nested when their meanings and relationships
// match the content structure.

// ---------------------------------------------------------------------
// 53. Header inside an article
// ---------------------------------------------------------------------

export const ArticleHeaderExample = (): ReactElement => {
  return (
    <article>
      <header>
        <h2>Example article</h2>
        <p>By John Doe</p>
      </header>

      <p>Article content.</p>
    </article>
  );
};

// header can introduce the nearest sectioning content.
//
// A header inside an article is different from the document-level header.

// ---------------------------------------------------------------------
// 54. Footer inside an article
// ---------------------------------------------------------------------

export const ArticleFooterExample = (): ReactElement => {
  return (
    <article>
      <h2>Example article</h2>
      <p>Article content.</p>

      <footer>
        <p>Written by John Doe.</p>
      </footer>
    </article>
  );
};

// footer can provide information about the nearest sectioning content,
// such as authorship or related metadata.

// ---------------------------------------------------------------------
// 55. Avoid meaningless section wrappers
// ---------------------------------------------------------------------

export const UnnecessarySection = (): ReactElement => {
  return (
    <section>
      <p>One unrelated paragraph.</p>
    </section>
  );
};

// A section is not simply a semantic replacement for every div.
//
// If there is no meaningful thematic grouping, a generic container may be
// more appropriate.

// ---------------------------------------------------------------------
// 56. Use article when content is independently meaningful
// ---------------------------------------------------------------------

export const ArticleList = (): ReactElement => {
  return (
    <section aria-labelledby="articles-heading">
      <h2 id="articles-heading">Articles</h2>

      <article>
        <h3>First article</h3>
        <p>First article summary.</p>
      </article>

      <article>
        <h3>Second article</h3>
        <p>Second article summary.</p>
      </article>
    </section>
  );
};

// The section groups the collection.
//
// Each article represents an independently meaningful item.

// ---------------------------------------------------------------------
// 57. Accessibility of semantic links
// ---------------------------------------------------------------------

export const DescriptiveLinks = (): ReactElement => {
  return (
    <nav aria-label="Related information">
      <ul>
        <li>
          <a href="/example/accessibility">Read the accessibility information</a>
        </li>
        <li>
          <a href="/example/security">Read the security information</a>
        </li>
      </ul>
    </nav>
  );
};

// Link text should communicate the destination or purpose.
//
// Generic text such as "click here" provides little information when
// links are encountered outside their surrounding paragraph.

// ---------------------------------------------------------------------
// 58. Semantic HTML and responsive design
// ---------------------------------------------------------------------

export const ResponsiveSemanticLayout = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example product</h1>
      </header>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading">Overview</h2>
        <p>Example product information.</p>
      </section>

      <section aria-labelledby="details-heading">
        <h2 id="details-heading">Details</h2>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>Available</dd>
          </div>
        </dl>
      </section>
    </main>
  );
};

// Semantic structure is independent of whether the layout is rendered as
// one column, multiple columns, or another responsive arrangement.

// ---------------------------------------------------------------------
// 59. Semantic HTML and SEO
// ---------------------------------------------------------------------

export const SearchEngineFriendlyStructure = (): ReactElement => {
  return (
    <article>
      <h1>Example product guide</h1>

      <p>Learn about the features and usage of the example product.</p>

      <h2>Features</h2>
      <ul>
        <li>Example feature one</li>
        <li>Example feature two</li>
      </ul>
    </article>
  );
};

// Semantic structure can also help machines interpret page content.
//
// Accessibility and SEO have overlapping structural benefits, but semantic
// HTML should be chosen for correct meaning rather than search ranking
// manipulation.

// ---------------------------------------------------------------------
// 60. Validate the resulting structure
// ---------------------------------------------------------------------

export const semanticValidationChecklist = [
  "Headings represent real content hierarchy.",
  "Navigation is represented by nav.",
  "Primary content is represented by main.",
  "Self-contained content uses article when appropriate.",
  "Thematic groups use section when appropriate.",
  "Supplementary content uses aside when appropriate.",
  "Lists use ul, ol, or dl according to their meaning.",
  "Links use a for navigation.",
  "Actions use button.",
  "Forms use form and associated labels.",
  "Tables use table semantics for tabular data.",
  "Source order remains logical.",
] as const;

// Semantic HTML should be evaluated by inspecting the resulting document
// structure, not merely by checking whether certain element names appear
// somewhere in the source.

// ---------------------------------------------------------------------
// 61. Integrated accessible page
// ---------------------------------------------------------------------

export interface AccessiblePageProps {
  readonly userName: string;
}

export const AccessiblePage = ({ userName }: AccessiblePageProps): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <h1>Example site</h1>

        <nav aria-label="Primary navigation">
          <ul>
            <li>
              <a href="/example">Home</a>
            </li>
            <li>
              <a href="/example/profile">Profile</a>
            </li>
            <li>
              <a href="/example/settings">Settings</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        <article>
          <header>
            <h2>Welcome, {userName}</h2>
            <p>Your account overview.</p>
          </header>

          <section aria-labelledby="account-heading">
            <h3 id="account-heading">Account</h3>

            <dl>
              <div>
                <dt>Name</dt>
                <dd>{userName}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>john.doe@example.com</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="actions-heading">
            <h3 id="actions-heading">Actions</h3>

            <ul>
              <li>
                <a href="/example/profile">Edit profile</a>
              </li>
              <li>
                <button type="button">Sign out</button>
              </li>
            </ul>
          </section>
        </article>

        <aside aria-labelledby="related-heading">
          <h2 id="related-heading">Related information</h2>
          <p>Example supplementary content.</p>
        </aside>
      </main>

      <footer>
        <p>Example site footer.</p>
      </footer>
    </>
  );
};

// This example combines:
//
// - a skip link
// - document-level header
// - labeled navigation
// - main content
// - article structure
// - nested sections
// - logical headings
// - description lists
// - native links
// - a native button
// - supplementary content
// - document footer
//
// The exact structure should always follow the actual meaning of the
// application's content.

// ---------------------------------------------------------------------
// 62. Semantic HTML checklist
// ---------------------------------------------------------------------

export const semanticHtmlChecklist = [
  "Choose HTML elements according to their meaning and purpose.",
  "Use headings to represent actual content hierarchy.",
  "Use main for the primary page content.",
  "Use nav for major navigation areas.",
  "Use article for self-contained content.",
  "Use section for meaningful thematic groups.",
  "Use aside for related supplementary content.",
  "Use header and footer according to the section or document they introduce or conclude.",
  "Use ul, ol, and dl according to the type of list.",
  "Use a for navigation.",
  "Use button for actions.",
  "Use native form controls and associated labels.",
  "Use table semantics for tabular data.",
  "Use CSS for visual presentation instead of semantic elements for styling.",
  "Keep source order logical.",
  "Use ARIA only when native HTML does not already provide the required semantics.",
  "Label repeated landmark types when users need to distinguish them.",
  "Inspect the resulting accessibility tree and test important interactions.",
] as const;

// Semantic HTML provides the foundation, but the resulting interface
// should still be evaluated for keyboard access, focus, naming, states,
// content, and complete accessibility behavior.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Semantic HTML means choosing elements according to their intended meaning and purpose.
// - Semantic structure gives browsers and assistive technologies information about relationships within a document.
// - Native HTML should generally be preferred when it already provides the required semantics and behavior.
// - div is a generic container and should not be used as a substitute for every semantic element.
// - main identifies the primary content of a document.
// - nav identifies a major navigation area.
// - article represents self-contained content that can stand independently.
// - section groups related content into a meaningful thematic section.
// - aside represents supplementary content related to surrounding content.
// - header and footer can describe the beginning and end of a document or section.
// - Headings h1 through h6 communicate document hierarchy and should represent actual headings rather than visual font sizes.
// - CSS should control visual presentation instead of choosing heading levels or semantic elements for their default appearance.
// - Heading structure should reflect the organization of the content.
// - Lists should use ul, ol, or dl according to the relationship between their items.
// - Links represent navigation, while buttons represent actions.
// - A native button provides built-in semantics and keyboard behavior that a div does not automatically provide.
// - Form controls should have programmatically associated labels.
// - Tables should use table semantics, including appropriate header cells and captions when useful.
// - Source order should remain logical because visual CSS positioning does not change the underlying document order.
// - A skip link can provide keyboard users with a direct route to the main content.
// - Multiple navigation regions should be given useful accessible labels when users need to distinguish their purposes.
// - A section can be given an accessible name with aria-labelledby when it needs to function as a named region.
// - ARIA should not unnecessarily duplicate native HTML semantics.
// - Semantic HTML can improve accessibility, maintainability, and machine-readable document structure.
// - Semantic HTML alone does not guarantee complete accessibility; keyboard behavior, focus, names, states, content, and testing still need to be considered.
// - Accessibility should be evaluated using the resulting interface and accessibility tree rather than only inspecting whether semantic element names appear in source code.

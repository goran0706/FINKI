# Introduction to HTML

---

# 1. HTML Document Structure

## 1.1 The DOCTYPE Declaration

The **DOCTYPE** (Document Type Declaration) is the first line of every HTML document. It instructs the browser which
version of HTML the document uses and triggers **standards mode** rendering (versus the legacy "quirks mode").

**HTML5 DOCTYPE (current standard):**

```html
<!DOCTYPE html>
```

This simple declaration is all that's needed for modern HTML5 documents. It is case-insensitive but conventionally
written in uppercase for visibility.

### Why DOCTYPE Matters: Standards Mode vs Quirks Mode

**Standards Mode** (triggered by correct DOCTYPE):

- Browser renders according to modern web standards (CSS 2.1, HTML5 spec)
- Consistent behavior across browsers
- Proper box model, layout calculations, rendering
- All modern web features work as specified

**Quirks Mode** (triggered by missing/incorrect DOCTYPE):

- Browser emulates outdated 1990s behavior for backward compatibility
- Different CSS box model (content-box without padding/border awareness)
- Non-standard element sizing and positioning
- Inconsistent rendering across browsers
- Many modern CSS features disabled or behaving incorrectly

**Without a DOCTYPE, browsers enter quirks mode and pages render unpredictably.**

### DOCTYPE History (for reference)

Earlier HTML versions required lengthy DTD references:

```html
<!-- HTML 4.01 Strict -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">

<!-- XHTML 1.0 Strict -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

These are **obsolete**. Always use the HTML5 DOCTYPE. The W3C designed HTML5's simple DOCTYPE to be backward-compatible
with older browsers that recognize any string starting with `<!DOCTYPE html>` as valid, ensuring universal support.

---

## 1.2 The Root, Head, and Body Elements

Every HTML document has three primary structural containers that define a hierarchical tree.

**Complete minimal document structure:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
<!-- Visible content goes here -->
</body>
</html>
```

### The `<html>` Element

The **root element** that wraps all other HTML content. Required in every document.

**Attributes:**

- **`lang`** (language code): Specifies the document's primary language using **BCP 47 language tags**. This attribute
  is **required for accessibility and SEO**.

```html

<html lang="en">           <!-- English -->
<html lang="es">           <!-- Spanish -->
<html lang="fr">           <!-- French -->
<html lang="zh-Hans">      <!-- Simplified Chinese -->
<html lang="pt-BR">        <!-- Brazilian Portuguese -->
```

**Why `lang` matters:**

- Screen readers pronounce content correctly (proper accent/inflection)
- Search engines serve content to relevant audiences
- Browsers enable spell-checking in the correct language
- Browsers can apply language-specific typography rules (hyphenation, line breaking)

**For multilingual pages**, specify language on specific elements:

```html

<html lang="en">
<body>
<p>This is English.</p>
<p lang="es">Esto es español.</p>
<p lang="fr">Ceci est français.</p>
</body>
</html>
```

### The `<head>` Element

The **metadata container** that holds information about the document. Content inside `<head>` is **not displayed** on
the page; it provides machine-readable information to browsers, search engines, and assistive technologies.

**Purpose**: Tells the browser and tools how to process and present the document.

**Head must contain** (or should contain for modern documents):

- Character encoding declaration (`<meta charset>`)
- Viewport configuration (`<meta name="viewport">`)
- Document title (`<title>`)
- Links to external stylesheets (`<link rel="stylesheet">`)
- Meta tags for SEO, social sharing, and browser behavior
- Scripts that should load before page rendering (though modern practice is to load scripts at the end of `<body>`)

**Head may also contain**:

- Favicon link (`<link rel="icon">`)
- Base URL for relative links (`<base>`)
- Style definitions (`<style>`)
- Script definitions (`<script>`)
- Web app manifest (`<link rel="manifest">`)
- Preload and prefetch hints (`<link rel="preload">`)

### The `<body>` Element

The **content container** that holds all visible content—text, images, videos, forms, navigation, and every element the
user sees and interacts with.

**Only one `<body>` element per document.** All interactive and visual content belongs here.

---

## 1.3 Essential Head Elements: Charset, Viewport, Title

Three meta elements are **critical** in every HTML5 document's `<head>` section. Missing any of these creates
accessibility, usability, or compatibility problems.

### Character Encoding: `<meta charset>`

```html

<meta charset="UTF-8">
```

Declares the **character encoding** (how text is interpreted). Must be the **first element** in `<head>` (within the
first 1024 bytes) to ensure the browser applies it before parsing other head elements.

**UTF-8 is the universal standard**—use it for all modern documents. UTF-8 supports:

- All languages and scripts (Latin, Cyrillic, Arabic, Chinese, emoji, etc.)
- Backward compatibility with ASCII
- Efficient file size (most common characters use 1 byte)

**Without charset declaration**, browsers may misinterpret:

- Accented characters (é, ñ, ü)
- Non-Latin scripts (中文, العربية, Русский)
- Emojis (😀, 🎉)
- Special symbols (€, £, ©)

**Common mistakes:**

- Placing it after other head elements (won't work properly)
- Using legacy encodings (ISO-8859-1, Windows-1252) - avoid these
- Conflicting charset declarations (server header vs meta tag - meta tag wins)

```html
<!-- ✓ CORRECT: First element in head -->
<head>
    <meta charset="UTF-8">
    <title>Page</title>
    <meta name="viewport" content="...">
</head>

<!-- ✗ WRONG: Charset after title -->
<head>
    <title>Page</title>
    <meta charset="UTF-8">  <!-- Too late! -->
</head>
```

### Viewport Configuration: `<meta name="viewport">`

```html

<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Controls how mobile browsers render and scale the page. **Critical for responsive design and mobile usability.**

Without this tag, mobile browsers assume the page is designed for desktop (typically 980px wide) and zoom out to fit it
on the small screen, making text unreadably small.

**Viewport attributes:**

| Attribute       | Value                    | Purpose             | Notes                                     |
|-----------------|--------------------------|---------------------|-------------------------------------------|
| `width`         | `device-width` OR pixels | Sets viewport width | Use `device-width` for responsive design  |
| `initial-scale` | `1.0` (typical)          | Initial zoom level  | `1.0` = 100% (no zoom)                    |
| `maximum-scale` | `5.0` (example)          | Maximum user zoom   | Avoid setting < 2.0 (harms accessibility) |
| `minimum-scale` | `1.0` (typical)          | Minimum user zoom   | Usually 1.0                               |
| `user-scalable` | `yes` (default) OR `no`  | Allow pinch zoom    | **Never use `no`** (violates WCAG)        |

**Recommended viewport (best practice):**

```html

<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

This tells mobile browsers: "This page is designed to adapt to the device width; render it at 100% scale without zoom."

**Edge cases:**

```html
<!-- For fixed-width desktop-only pages (not recommended) -->
<meta name="viewport" content="width=1200px">

<!-- For pages that shouldn't zoom (rare, accessibility concern) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<!-- ⚠️ AVOID: Disabling user zoom violates accessibility standards -->
```

**Why viewport matters for mobile:**

- Ensures responsive layouts work correctly
- Enables proper text sizing (readable without pinch-zooming)
- Allows buttons/links to be easily tappable (touch targets)
- Prevents awkward horizontal scrolling on narrow screens

### Document Title: `<title>`

```html
<title>Introduction to HTML - Complete Guide</title>
```

The page title serves **multiple critical functions**:

1. **Browser tab/window**: Displayed in the browser tab (user's primary navigation aid)
2. **Search engine results**: Appears as the clickable headline in Google, Bing, etc.
3. **Bookmarks/favorites**: Shown when users bookmark or save the page
4. **Browser history**: Listed in back button menus and history pages
5. **Screen readers**: Read aloud when page loads (first thing assistive tech announces)
6. **Social media**: Used as fallback if Open Graph tags missing
7. **SEO**: Primary signal to search engines about page topic

**Title best practices:**

| Practice              | Guideline                                                    | Example                                                                                     |
|-----------------------|--------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **Length**            | 50-60 characters max (search results truncate longer titles) | ❌ Too long: "Complete Beginner's Guide to HTML5 Semantic Elements and Modern Web Standards" |
|                       |                                                              | ✓ Better: "HTML5 Semantic Elements Guide"                                                   |
| **Keyword placement** | Important keywords first                                     | ❌ "Guide - HTML Tutorial"                                                                   |
|                       |                                                              | ✓ "HTML Tutorial Guide"                                                                     |
| **Uniqueness**        | Different for every page                                     | ❌ All pages titled "Home"                                                                   |
|                       |                                                              | ✓ "About Us - Company Name", "Contact - Company Name"                                       |
| **Branding**          | Include company/site name at end                             | ✓ "HTML Tutorial - DevLearn Academy"                                                        |
|                       |                                                              | ✓ "Contact Us - DevLearn Academy"                                                           |
| **Clarity**           | Descriptive, explains page content                           | ❌ "Page 1", "Untitled Document"                                                             |
|                       |                                                              | ✓ "HTML Document Structure Guide"                                                           |

**Title examples for different page types:**

```html
<!-- Homepage -->
<title>DevLearn Academy - Learn Web Development Online</title>

<!-- Blog post -->
<title>How to Use CSS Grid Layout - DevLearn Blog</title>

<!-- Product page -->
<title>Pro Code Editor - Professional IDE - DevLearn</title>

<!-- Documentation -->
<title>HTML Reference | MDN Web Docs</title>

<!-- Search results page -->
<title>Search Results: "CSS tutorials" - YouTube</title>
```

**Common title mistakes:**

```html
<!-- ✗ Too long -->
<title>The Complete Beginner's Guide to Learning HTML5 Semantic Elements with Examples and Best Practices for Modern Web
    Development</title>

<!-- ✗ Not descriptive -->
<title>Website</title>

<!-- ✗ No branding -->
<title>About</title>

<!-- ✓ Good length, keywords first, branded -->
<title>About Us - DevLearn Academy</title>
```

---

## 1.4 Heading Hierarchy: `<h1>` through `<h6>`

HTML provides **six heading levels** (`<h1>` through `<h6>`) that establish document structure and content hierarchy.
Headings are critical for:

- **Accessibility**: Screen readers use headings to build a page outline, allowing users to navigate by jumping from
  section to section
- **SEO**: Search engines determine page topic and structure from headings
- **Usability**: Sighted users scan headings to understand page organization
- **Styling**: Headings provide semantic hooks for CSS

### The Document Outline

Headings create a **logical outline** of your document structure, similar to a book's table of contents.

```html
<h1>Complete HTML Guide</h1>
<h2>Introduction</h2>
<h3>Why Learn HTML</h3>
<h3>What You'll Learn</h3>
<h2>Document Structure</h2>
<h3>The HEAD Element</h3>
<h3>The BODY Element</h3>
<h4>Text Content</h4>
<h4>Media Content</h4>
<h3>Semantic Elements</h3>
```

**Screen readers announce the outline to users:**

- Users can jump between sections
- Users understand the page structure
- Users know how deep they are in the hierarchy

### Heading Rules

#### Rule 1: One `<h1>` Per Page

The `<h1>` represents the **primary topic** of the page and should appear **exactly once**.

```html
<!-- ✓ CORRECT: One h1 -->
<h1>Getting Started with HTML</h1>
<p>Introduction text...</p>
<h2>Basic Syntax</h2>

<!-- ✗ WRONG: Multiple h1s confuse screen readers and search engines -->
<h1>Getting Started with HTML</h1>
<h1>Why HTML Matters</h1>
<h1>HTML Best Practices</h1>
```

**Why only one h1?**

- Search engines treat h1 as the main topic (ranking signal)
- Screen readers expect one primary heading per page
- Multiple h1s suggest poor content organization

**Exception**: HTML5's sectioning elements (article, section) can have their own h1 if the section is self-contained:

```html
<!-- This is allowed but use cautiously -->
<article>
    <h1>Article Title</h1>
    <p>Article content...</p>
</article>

<article>
    <h1>Another Article</h1>
    <p>Another article's content...</p>
</article>
```

#### Rule 2: Don't Skip Heading Levels

Headings must **not skip levels** when descending. You can skip when ascending.

```html
<!-- ✓ CORRECT: No skipping -->
<h1>Main Topic</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h3>Subsection 1.2</h3>
<h2>Section 2</h2>  <!-- Back to h2: jumping up is allowed -->

<!-- ✗ WRONG: Skipping from h2 to h4 -->
<h1>Main Topic</h1>
<h2>Section 1</h2>
<h4>Skipped h3!</h4>  <!-- Breaks outline, confuses screen readers -->
<h2>Section 2</h2>

<!-- ✗ WRONG: Skipping from h1 to h3 -->
<h1>Main Topic</h1>
<h3>Skipped h2!</h3>  <!-- Outline is broken -->
```

**Why this matters**: Screen readers expect a continuous outline. Skipped levels create confusion about page
organization and nesting depth.

#### Rule 3: Choose Heading Level by Semantic Meaning, Not Appearance

**Never choose a heading level based on how it looks visually.** If you need smaller text, use CSS. Heading level exists
for semantic meaning and structure.

```html
<!-- ✗ WRONG: Choosing h6 because it looks small -->
<h1>Main Title</h1>
<h6>Subtitle (visually smaller)</h6>

<!-- ✓ CORRECT: Using h2 for semantic hierarchy, CSS for sizing -->
<h1>Main Title</h1>
<h2>Subtitle</h2>

<style>
    h2 {
        font-size: 0.9em;
    }

    /* Make it visually small via CSS */
</style>
```

### Common Heading Mistakes

```html
<!-- ✗ Using h1 for non-primary content -->
<h1>Logo</h1>
<p>Welcome to our site</p>

<!-- ✓ Only one h1 for main topic -->
<h1>Welcome to Our Site</h1>
<p>Content...</p>

<!-- ✗ Using headings for visual emphasis (bold text) -->
<h2>Important Note:</h2> This feature is new.

<!-- ✓ Using semantic text elements + CSS -->
<strong>Important Note:</strong> This feature is new.
```

---

## 1.5 Complete HTML5 Document Template

Here's a production-ready HTML5 document structure with best practices:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Character encoding MUST be first -->
    <meta charset="UTF-8">

    <!-- Viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Page title (appears in tab, search results, bookmarks) -->
    <title>Page Title - Site Name</title>

    <!-- Description for search results (150-160 characters) -->
    <meta name="description" content="Brief description of page content for search engines and social media.">

    <!-- Favicon (browser tab icon) -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="/styles/main.css">
</head>

<body>
<!-- Page content -->
<header>
    <nav>
        <h1>Site Name</h1>
        <!-- Navigation links -->
    </nav>
</header>

<main>
    <h2>Page Content</h2>
    <!-- Main content -->
</main>

<footer>
    <p>&copy; 2024 Site Name. All rights reserved.</p>
</footer>

<!-- Scripts at end of body for performance -->
<script src="/scripts/main.js"></script>
</body>
</html>
```

---

## 1.6 How Browsers Parse and Render HTML

Understanding the **parsing process** helps you write better HTML and debug issues.

### Browser Parsing Steps

1. **Bytes downloaded** from server
2. **Decoded** using charset (UTF-8 by default)
3. **Tokenized** into tags, attributes, text nodes
4. **Parsed** into DOM tree (document object model)
5. **Rendered** to screen based on CSS and JavaScript

**Critical point**: If charset is declared late (not first in head), the browser may have already misinterpreted text in
the head, causing errors.

### HTML Error Correction

Browsers are **forgiving** and automatically fix many HTML errors:

```html
<!-- Browser automatically closes unclosed tags -->
<p>Paragraph text
<p>Another paragraph  <!-- First <p> auto-closed -->

    <!-- Browser adds required elements -->
    <html>
    <title>Page</title>
    <p>Content</p>
    </html>
    <!-- Browser adds <head> and <body> automatically -->

    <!-- Browser reorders misplaced elements -->
    <body>
    <title>Page</title>  <!-- Should be in head, browser moves it -->
    <p>Content</p>
    </body>
```

This is why old pages work even with poor HTML—but **don't rely on error correction**. Write valid HTML.

### Rendering vs Parsing

- **Parsing**: Converting HTML to DOM (happens sequentially, can be blocked)
- **Rendering**: Converting DOM to visual display (happens as content loads)

This is why `<meta charset>` must be early and `<script>` tags should be at the end of `<body>`—to prevent blocking page
display.

---

## Summary: Section 1 Key Takeaways

- ✅ **Always include**: `<!DOCTYPE html>` (first line)
- ✅ **Always include in `<head>`**: charset, viewport, title
- ✅ **One `<h1>` per page** for semantic clarity
- ✅ **Don't skip heading levels** (h1 → h2 → h3, not h1 → h3)
- ✅ **Choose heading level by meaning**, not appearance
- ✅ **Use `lang` attribute** on `<html>` for accessibility and SEO
- ✅ **Put charset first in head** (within first 1024 bytes)
- ✅ **Make titles 50-60 characters**, keywords first, branded
- ❌ **Never do**: Missing DOCTYPE, missing viewport, multiple h1s, skipped heading levels, choosing headings by size

---

## Links & Resources

- [MDN: HTML Document Structure](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)
- [W3C: HTML Living Standard](https://html.spec.whatwg.org/)
- [MDN: Document Type Definition](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)
- [BCP 47 Language Tags](https://www.ietf.org/rfc/bcp/bcp47.txt)
- [WCAG 2.1: Heading Structure](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [HTML Validator](https://validator.w3.org/)

---

# 2. Core HTML Syntax

## 2.1 Elements: The Building Blocks of HTML

An **HTML element** is a structural component that defines a piece of content and its purpose. Elements consist of
tags (opening and closing) and the content between them.

### Anatomy of an HTML Element

```html
<p>This is a paragraph.</p>
↑             ↑          ↑
opening tag  content  closing tag
```

- **Opening tag**: `<tagname>` - marks the start of an element
- **Content**: Text or other elements inside the element
- **Closing tag**: `</tagname>` - marks the end of an element (forward slash required)
- **Element**: The complete opening tag + content + closing tag

### Element Categories

#### Container Elements (Paired Tags)

Elements that hold other content and require both opening and closing tags.

```html
<p>Paragraph text</p>
<div>Generic container</div>
<header>Page header</header>
<article>Article content</article>
<section>Section content</section>
```

Container elements:

- **Must have closing tags** - `<p>text</p>` not `<p>text`
- **Can nest other elements** - `<div><p>text</p></div>`
- **Have content** - text, other elements, or may be empty
- **Affect document outline** - create logical structure

#### Void Elements (Self-Closing)

Elements that represent a single piece of data or function and **cannot contain content**. They do not have closing
tags.

```html
<br>          <!-- Line break -->
<hr>          <!-- Horizontal rule -->
<img src="photo.jpg" alt="Photo">
<input type="text">
<meta charset="UTF-8">
<link rel="stylesheet" href="styles.css">
<source src="video.mp4" type="video/mp4">
<area shape="rect" coords="0,0,100,100" href="#">
<col width="100">
<embed src="plugin.swf">
```

**List of void elements in HTML5:**

- `<area>` - image map region
- `<base>` - document base URL
- `<br>` - line break
- `<col>` - table column
- `<embed>` - external content (plugins)
- `<hr>` - horizontal rule
- `<img>` - image
- `<input>` - form input
- `<link>` - external resource (stylesheets, icons)
- `<meta>` - metadata
- `<param>` - plugin parameters (deprecated)
- `<source>` - media source (audio/video)
- `<track>` - media captions/subtitles
- `<wbr>` - word break opportunity

**Void element syntax rules:**

- In HTML5: Can be written as `<br>` or `<br />` (both valid, slash is optional)
- Never include closing tags: `<img>` ✓ but `<img></img>` ✗
- Cannot contain content
- Self-closing (implicitly close themselves)

```html
<!-- ✓ CORRECT: No closing tag, no content -->
<img src="photo.jpg" alt="Photo">
<input type="text">
<br>

<!-- ✗ WRONG: Void elements don't have closing tags -->
<img src="photo.jpg"></img>
<input type="text"></input>
<br></br>

<!-- ✗ WRONG: Can't add content to void elements -->
<input type="text">Click me</input>
```

---

## 2.2 Tags: Opening, Closing, and Void

Tags are the **markup syntax** that define where elements begin and end.

### Opening Tags

```html
<p>
<div class="container">
    <a href="https://example.com">
```

- Written as `<tagname>` with angle brackets
- May include attributes: `<tagname attribute="value">`
- Mark the **start** of an element

### Closing Tags

```html
</p>
</div>
</a>
```

- Written as `</tagname>` with forward slash before the tag name
- Mirror opening tags exactly (same name, same case)
- Mark the **end** of an element
- Void elements do **not** have closing tags

### Void Tags

```html
<img src="photo.jpg" alt="Photo">
<input type="text">
<meta charset="UTF-8">
<link rel="stylesheet" href="styles.css">
```

- Single, self-contained tag
- No closing tag needed or allowed
- Cannot contain content
- Represent single data points or functions

### Tag Syntax Rules

**Case Sensitivity:**

- HTML tag names are **case-insensitive** - `<P>`, `<p>`, `<P>` are identical
- **Convention**: Use lowercase (readability, consistency with modern best practices)
- **Content** inside tags is case-sensitive: `<p>Hello</p>` vs `<p>HELLO</p>` render differently

```html
<!-- All equivalent (but avoid UPPERCASE for consistency) -->
<p>Paragraph</p>
<P>Paragraph</P>
<P>Paragraph</p>
```

**Spacing and Formatting:**

- Tag names cannot contain spaces: `<p class>` ✗ must be `<p class="value">`
- Tags can span multiple lines (though not recommended):

```html
<!-- Valid but hard to read -->
<div
        class="container"
        id="main">
    Content
</div>

<!-- Better: single line or properly indented -->
<div class="container" id="main">
    Content
</div>
```

**Closing Tag Requirements:**

- Opening tag: `<tagname>` - required for container elements
- Closing tag: `</tagname>` - **mandatory** for all container elements
- Missing closing tags cause **parsing errors** and broken layouts:

```html
<!-- ✗ Missing closing tag: Next element starts before </p> -->
<p>First paragraph
<p>Second paragraph</p>
</p>

<!-- ✓ Correct: All elements properly closed -->
<p>First paragraph</p>
<p>Second paragraph</p>
```

---

## 2.3 Attributes: Names, Values, and Quoting

**Attributes** provide additional information about elements, controlling their behavior, appearance, or meaning.

### Attribute Syntax

```html
<img src="photo.jpg" alt="Mountain landscape" width="800" height="600">
↑                 ↑                      ↑              ↑
attribute name   attribute value         attribute    attribute
```

**Anatomy:**

- **Attribute name**: Identifier (e.g., `src`, `alt`, `class`, `id`)
- **Equals sign**: `=` separates name from value
- **Attribute value**: The data assigned to the attribute (quoted)

### Quoting Rules

Attribute values **should be quoted**. Double quotes are the standard; single quotes are also valid.

```html
<!-- ✓ RECOMMENDED: Double quotes -->
<input type="text" class="form-control" id="username">
<a href="https://example.com">Link</a>

<!-- ✓ ACCEPTABLE: Single quotes (less common) -->
<input type='text' class='form-control' id='username'>

<!-- ⚠️ UNQUOTED VALUES: Only for simple values with no spaces -->
<input type=text>                    <!-- Works, but avoid -->
<input type=text class=form-control> <!-- Works, but avoid -->

<!-- ✗ WRONG: Unquoted values with spaces fail -->
<input class=form control>  <!-- Broken! class=form, then "control" is dangling -->
<p title=hello world>Text</p>  <!-- Broken! title=hello, "world" is separate -->
```

**Best practice:** Always quote attribute values for consistency and to avoid edge case errors.

```html
<!-- ✓ CORRECT: Quoted values, consistent style -->
<img src="photo.jpg" alt="Photo" width="800" height="600">

<!-- ✗ INCONSISTENT: Mix of quoted and unquoted -->
<img src="photo.jpg" alt=Photo width="800" height=600>
```

**Special characters in attribute values:**

If the attribute value contains the quote character itself, use the opposite quote type or escape:

```html
<!-- ✓ Mixing quotes -->
<div title='He said "hello"'>Hover me</div>
<div title="It's working">Hover me</div>

<!-- ✓ HTML entities for escaping -->
<div title="He said &quot;hello&quot;">Hover me</div>
<div title="It&apos;s working">Hover me</div>
```

### Boolean Attributes

Some attributes are **boolean**—their presence indicates true, their absence indicates false. The value is optional.

```html
<!-- All three are equivalent (pick one style) -->
<input type="checkbox" checked>
<input type="checkbox" checked="">
<input type="checkbox" checked="checked">

<!-- Attribute absent = false (unchecked) -->
<input type="checkbox">
```

**Common boolean attributes:**

- `checked` - checkbox/radio is selected
- `disabled` - form element is disabled
- `readonly` - form element is read-only (can't be edited)
- `required` - form field must not be empty
- `selected` - option is selected in a dropdown
- `autofocus` - element gets focus when page loads
- `autoplay` - media plays automatically
- `controls` - media controls displayed
- `loop` - media repeats
- `muted` - media is muted
- `hidden` - element is hidden from display

**Modern best practice:** Omit the value for boolean attributes:

```html
<!-- ✓ Modern style (recommended) -->
<input type="checkbox" checked>
<button disabled>Click me</button>
<video autoplay muted loop></video>

<!-- ✓ Also valid (older style) -->
<input type="checkbox" checked="checked">
<button disabled="disabled">Click me</button>
```

### Global Attributes

These attributes can be applied to **any HTML element**. They provide functionality or metadata that applies
universally.

#### Critical Global Attributes

| Attribute         | Purpose                                                     | Example                                               |
|-------------------|-------------------------------------------------------------|-------------------------------------------------------|
| `id`              | Unique identifier for one element per page                  | `<p id="intro">`                                      |
| `class`           | Classification for styling/scripting (multiple allowed)     | `<div class="card featured">`                         |
| `style`           | Inline CSS (avoid when possible)                            | `<p style="color: blue;">`                            |
| `title`           | Tooltip text (shown on hover)                               | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `lang`            | Element's language (for spell-check, pronunciation)         | `<p lang="es">Hola</p>`                               |
| `dir`             | Text direction (`ltr` left-to-right, `rtl` right-to-left)   | `<p dir="rtl">مرحبا</p>`                              |
| `hidden`          | Hides element from display                                  | `<p hidden>Not shown</p>`                             |
| `data-*`          | Custom data attributes for JavaScript                       | `<button data-user-id="123">Delete</button>`          |
| `tabindex`        | Keyboard navigation order                                   | `<button tabindex="1">First</button>`                 |
| `contenteditable` | Makes element's content editable by users                   | `<p contenteditable="true">Edit me</p>`               |
| `translate`       | Indicates if content should be translated (`yes`/`no`)      | `<span translate="no">HTML</span>`                    |
| `spellcheck`      | Enable/disable spell-checking (`true`/`false`)              | `<textarea spellcheck="true"></textarea>`             |
| `draggable`       | Indicates if element can be dragged (`true`/`false`/`auto`) | `<div draggable="true">Drag me</div>`                 |

#### Using Global Attributes

```html
<!-- ID: Unique per page, used for CSS targeting and links -->
<h2 id="section-two">Section Two</h2>
<a href="#section-two">Jump to Section Two</a>

<!-- Class: Multiple, used for styling and grouping -->
<article class="post featured recent">
    <h3>Latest Article</h3>
</article>

<!-- Data attributes: Store custom data for JavaScript -->
<button data-user-id="456" data-action="delete">
    Delete User
</button>
<script>
    document.querySelector('button').addEventListener('click', (e) => {
        const userId = e.target.dataset.userId;  // "456"
        const action = e.target.dataset.action;  // "delete"
    });
</script>

<!-- Lang: Specify language for spell-check and screen readers -->
<p>Welcome to our site.</p>
<p lang="fr">Bienvenue sur notre site.</p>
<p lang="es">Bienvenido a nuestro sitio.</p>

<!-- Dir: Control text direction (left-to-right vs right-to-left) -->
<p dir="rtl">مرحبا بك في موقعنا</p>

<!-- Title: Tooltip on hover -->
<abbr title="HyperText Markup Language">HTML</abbr>
```

---

## 2.4 Nesting: Parent, Child, and Sibling Relationships

HTML elements exist in a **hierarchical tree structure**. Elements can contain other elements, creating parent-child
relationships.

### Tree Terminology

```html

<article> ← Parent element (ancestor)
    <h2>Article Title</h2> ← Child element (descendant of article)
    <p>First paragraph.</p> ← Child element (sibling to h2 and other p)
    <p>Second paragraph.</p> ← Child element (sibling to h2 and other p)
    <section> ← Child element (nested deeper)
        <h3>Subsection</h3> ← Descendant of article and section
        <p>Content</p> ← Descendant of article and section
    </section>
</article>
```

**Terminology:**

- **Parent**: The element that contains others (`<article>`)
- **Child**: Elements directly inside a parent (`<h2>`, `<p>`, `<section>`)
- **Sibling**: Elements at the same nesting level (`<p>` and `<p>` are siblings)
- **Descendant**: Any element nested inside (children, grandchildren, etc.)
- **Ancestor**: Any element above in the hierarchy (parent, grandparent, etc.)

### Proper Nesting Rules

Elements must be **closed in reverse order** they were opened. Tags cannot overlap.

```html
<!-- ✓ CORRECT: Properly nested -->
<article>
    <p>This paragraph <strong>has bold text</strong> inside.</p>
</article>

<!-- ✓ CORRECT: Nesting creates hierarchy -->
<section>
    <article>
        <h2>Title</h2>
        <p>Content</p>
    </article>
</section>

<!-- ✗ WRONG: Overlapping tags (strong opens, p closes before strong closes) -->
<article>
    <p>This paragraph <strong>has bold text</p></strong>
</article>

<!-- ✗ WRONG: Closing in wrong order -->
<div><p>Content</div></p>  <!-- p closes before div closes -->
```

### Block vs Inline Nesting Restrictions

**Block-level elements** can contain both block and inline elements:

```html

<div> ← Block container
    <p>Paragraph</p> ← Block element inside div ✓
    <section>Section</section>
    ← Block element inside div ✓
    <strong>Inline</strong> ← Inline element inside div ✓
</div>
```

**Inline elements** should only contain other inline elements, not block elements:

```html
<!-- ✓ CORRECT: Inline contains only inline -->
<strong>Bold text with <em>italic</em> inside</strong>

<!-- ⚠️ PROBLEMATIC: Inline containing block (browsers may re-wrap) -->
<strong><p>Paragraph inside strong</p></strong>
<!-- Browser may render as:
  <p><strong>Paragraph inside strong</strong></p>
  Moving the p outside the strong element -->
```

**Exception**: The `<a>` (anchor/link) element can wrap block elements in HTML5:

```html
<!-- ✓ NOW ALLOWED in HTML5 -->
<a href="/page">
    <article>
        <h2>Article Title</h2>
        <p>Click anywhere in this article to read more</p>
    </article>
</a>
```

### Common Nesting Mistakes

```html
<!-- ✗ Missing closing tags (implicitly closes) -->
<p>First paragraph
<p>Second paragraph</p>
<!-- Browser interprets as:
  <p>First paragraph</p>
  <p>Second paragraph</p> -->

<!-- ✗ Closing in wrong order -->
<div><p>Text</div></p>

<!-- ✗ Inline contains block -->
<em>
    <div>This is problematic</div>
</em>

<!-- ✓ Correct structure -->
<div><p>Text</p></div>
<em>Inline only</em>
<div>
    <section><p>Nested blocks work fine</p></section>
</div>
```

---

## 2.5 The DOM: How Browsers Represent HTML

The **Document Object Model (DOM)** is the browser's internal representation of an HTML document as a
**tree of objects**. It's the living, interactive version of your HTML.

### HTML to DOM Transformation

When a browser loads an HTML document:

1. **Parse HTML** into tokens
2. **Build DOM tree** with Element nodes, Text nodes, Comment nodes
3. **Store as JavaScript objects** that can be inspected and modified
4. **Render to screen** based on CSS

**HTML source:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sample Page</title>
</head>
<body>
<h1>Welcome</h1>
<p>This is a paragraph.</p>
</body>
</html>
```

**Resulting DOM tree:**

```
Document
  ├── <!DOCTYPE html>
  └── html (lang="en")
      ├── head
      │   └── title
      │       └── #text: "Sample Page"
      └── body
          ├── h1
          │   └── #text: "Welcome"
          └── p
              └── #text: "This is a paragraph."
```

**DOM nodes:**

- **Element nodes**: `<html>`, `<head>`, `<body>`, `<p>`, etc.
- **Text nodes**: `#text` - the actual text content
- **Comment nodes**: `<!-- comment -->`
- **Document node**: Root of the entire tree

### DOM vs HTML: Key Differences

The DOM is **different from HTML source** in important ways:

| Aspect         | HTML                        | DOM                                                               |
|----------------|-----------------------------|-------------------------------------------------------------------|
| **Format**     | Text in file                | JavaScript objects in memory                                      |
| **Mutability** | Static (file-based)         | Live and changeable                                               |
| **Errors**     | Parsed/corrected by browser | Reflects current state                                            |
| **Content**    | What you write              | What browser created (after error correction, JavaScript changes) |
| **Access**     | Read from file              | Access via JavaScript APIs                                        |

**Example: Browser error correction**

HTML source:

```html
<p>Paragraph text
<p>Another paragraph</p>
```

Browser-created DOM:

```html
<p>Paragraph text</p>
<p>Another paragraph</p>
```

The browser automatically **closed the first `<p>`** even though you didn't write the closing tag. The DOM reflects what
the browser created, not what you wrote.

### Why the DOM Matters

- **CSS selectors** target DOM elements (not HTML source)
- **JavaScript manipulation** changes the DOM, not HTML source
- **Screen readers** traverse the DOM to present content
- **Browser DevTools** show the DOM (not raw HTML source)
- **Dynamic content** changes only the DOM

```html
<!-- HTML source -->
<button>Click me</button>

<!-- JavaScript changes the DOM -->
<script>
    document.querySelector('button').textContent = 'Clicked!';
    document.querySelector('button').style.color = 'red';
    document.querySelector('button').classList.add('pressed');
</script>

<!-- DOM now shows:
  <button class="pressed" style="color: red;">Clicked!</button>
-->
<!-- But HTML source file is still unchanged -->
```

### Accessing the DOM

Browser DevTools show the DOM (what the browser created):

1. **Right-click** → **Inspect** or **Inspect Element**
2. DevTools shows the **DOM tree** (not the original HTML file)
3. Change the DOM in DevTools to test, but it doesn't change the file
4. Refresh the page to reload the original HTML

---

## 2.6 HTML Parsing and Error Handling

Browsers follow specific **parsing rules** defined in the HTML specification. Understanding these rules explains why
broken HTML sometimes works.

### Parsing Algorithm

The browser uses a **state machine parser** that:

1. **Tokenizes** HTML into tags, text, etc.
2. **Reconstructs** formatting (closes implicitly opened elements)
3. **Corrects errors** (closes missing tags, reorders elements)
4. **Builds DOM tree** based on corrected structure

### Browser Error Correction (Tag Soup Tolerance)

HTML is designed to be **forgiving**. Browsers automatically fix many errors:

```html
<!-- ✗ Unclosed <p> -->
<p>Paragraph
<p>Another paragraph</p>

<!-- Browser corrects to: -->
<p>Paragraph</p>
<p>Another paragraph</p>
```

```html
<!-- ✗ Missing <body> -->
<html>
<title>Page</title>
<p>Content</p>
</html>

<!-- Browser adds missing elements: -->
<html>
<head><title>Page</title></head>
<body><p>Content</p></body>
</html>
```

```html
<!-- ✗ Misplaced <title> (should be in head) -->
<body>
<title>Page</title>
<p>Content</p>
</body>

<!-- Browser moves <title> to head: -->
<html>
<head><title>Page</title></head>
<body><p>Content</p></body>
</html>
```

### When Error Correction Fails

Some errors are **not corrected** and cause layout/functionality breaks:

```html
<!-- ✗ Overlapping tags: browser tries to fix but may not succeed -->
<div><p>Text</div></p>
<!-- May render as:
  <div><p>Text</p></div><p></p>
  or cause unexpected nesting -->

<!-- ✗ Content outside <body> (after body closes) -->
<html>
<body></body>
<p>This paragraph is outside body</p>
</html>
<!-- Most browsers move it inside body, but it's wrong -->
```

### Whitespace Handling in HTML

HTML **collapses whitespace** in normal text content:

```html
<!-- All equivalent: whitespace collapses to single space -->
<p>Hello world</p>
<p>Hello
    world</p>
<p>Hello
    world</p>

<!-- Renders as: "Hello world" (single space) -->
```

**Exceptions where whitespace matters:**

- `<pre>` element: Preserves all whitespace exactly
- `<code>` in `<pre>`: Code formatting preserved
- CSS `white-space` property: Can change whitespace behavior
- Text nodes: Newlines/spaces between tags are whitespace text nodes

```html
<!-- In <pre>, whitespace is preserved -->
<pre>
  function hello() {
    console.log("Hello");
  }
</pre>

<!-- Renders with exact spacing and indentation -->

<!-- In normal elements, whitespace collapses -->
<p>
    function hello() {
    console.log("Hello");
    }
</p>

<!-- Renders as: "function hello() { console.log("Hello"); }" (single line) -->
```

---

## 2.7 HTML5 Parsing Rules vs XML Parsing

**HTML** and **XML** use different parsing rules. This matters because XHTML tried to be both.

### HTML Parsing (Forgiving, Error-Tolerant)

- Automatically closes unclosed tags
- Reorders misplaced elements
- Adds missing required elements
- Works even with broken markup

### XML Parsing (Strict)

- **Fails** if any tag is unclosed
- **Fails** if tags are mismatched
- **Fails** if rules violated
- No error correction

**HTML5 is HTML**, not XML, so browsers use forgiving HTML parsing rules.

```html
<!-- Valid HTML5: Browser auto-closes <p> -->
<p>Paragraph

    <!-- Not valid XML: Would fail to parse -->
<p>Paragraph</p>  <!-- Must explicitly close -->
```

---

## Summary: Section 2 Key Takeaways

- ✅ **Elements** = opening tag + content + closing tag
- ✅ **Container elements** have both opening and closing tags
- ✅ **Void elements** (`<br>`, `<img>`, `<input>`) have no closing tag
- ✅ **Attributes** provide additional information (always quote values)
- ✅ **Boolean attributes** can omit the value: `checked` not `checked="checked"`
- ✅ **Global attributes** (id, class, data-*, lang, dir, etc.) work on any element
- ✅ **Proper nesting** required: close tags in reverse order
- ✅ **DOM** is what browser creates (may differ from source HTML due to error correction)
- ✅ **HTML parsing** is forgiving and autocorrects errors
- ✅ **Whitespace collapses** except in `<pre>` and with CSS

- ❌ **Never**: Unclosed container tags, overlapping tags, omit quotes on attribute values, break nesting rules
- ❌ **Never**: Inline elements containing block elements (except `<a>` in HTML5)
- ❌ **Never**: Rely on error correction (write valid HTML)

---

## Links & Resources

- [MDN: Elements](https://developer.mozilla.org/en-US/docs/Glossary/Element)
- [MDN: Attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute)
- [MDN: The DOM Explained](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [WHATWG: HTML Living Standard - Parsing](https://html.spec.whatwg.org/multipage/parsing.html)
- [HTML Validator](https://validator.w3.org/)
- [HTML Void Elements List](https://www.w3.org/TR/html401/index/elements.html)

---

# 3. Structural vs Semantic HTML

## 3.1 What is Structural HTML?

**Structural HTML** refers to elements that define the physical layout and organization of content **without conveying
inherent meaning**. These are generic containers whose purpose must be inferred from context, class names, or CSS.

Before HTML5 introduced semantic elements (2012), developers built entire page layouts using only `<div>` and `<span>`,
relying on class names and CSS to indicate purpose.

### Pre-HTML5 Approach (Generic Containers Only)

```html
<!-- No meaning from markup—purpose unclear without reading classes -->
<div class="header">
    <div class="navigation">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </div>
</div>

<div class="main-content">
    <div class="article">
        <h2>Article Title</h2>
        <p>Article content...</p>
    </div>
</div>

<div class="footer">
    <p>&copy; 2024 Company Name</p>
</div>
```

**Problems with this approach:**

- **No semantic meaning**: Browsers, search engines, and screen readers see only generic `<div>` elements
- **Relies on class names**: Understanding requires reading CSS/JavaScript, not HTML alone
- **Accessibility issues**: Screen readers can't identify page regions or structure
- **SEO problems**: Search engines can't identify primary content, navigation, footer
- **Maintenance burden**: New developers must reverse-engineer class names to understand structure

---

## 3.2 What is Semantic HTML and Why It Matters

**Semantic HTML** uses elements that clearly describe their meaning and purpose. Instead of generic `<div>` containers,
semantic elements explicitly identify what type of content they contain.

### HTML5 Semantic Approach (Recommended)

```html
<!-- Clear meaning from markup alone—structure is self-documenting -->
<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h2>Article Title</h2>
        <p>Article content...</p>
    </article>
</main>

<footer>
    <p>&copy; 2024 Company Name</p>
</footer>
```

**Benefits of semantic HTML:**

- **Self-documenting**: Meaning is clear from element names alone
- **Accessibility**: Screen readers announce region types and structure
- **SEO**: Search engines identify primary content and page organization
- **Maintainability**: New developers understand structure without reading CSS
- **Standards compliance**: Follows web standards and best practices
- **Future-proofing**: Browsers and tools can leverage semantic meaning

### Three Reasons Semantic HTML Matters

#### 1. Accessibility: Screen Reader Navigation

Screen readers build a **page outline** from semantic elements. Users can jump between sections without tabbing through
every link and button.

```html
<!-- Semantic structure enables navigation by landmarks -->
<header>Page header</header>
<nav>Main navigation - users can jump here</nav>
<main>Primary content area - users can jump here</main>
<aside>Related content - users can jump here</aside>
<footer>Footer info - users can jump here</footer>

<!-- Without semantic elements, screen readers can't identify regions -->
<div class="header">...</div>
<div class="navigation">...</div>
<div class="main">...</div>
```

**Screen reader user's experience:**

- Lists all page landmarks ("Jump to main content", "Jump to navigation", "Jump to footer")
- Jumps directly to relevant section
- Skips repetitive header/navigation on subsequent pages
- Understands page structure and content priority

#### 2. SEO: Search Engine Understanding

Search engines determine page topic and content priority from semantic structure.

```html
<!-- Search engines recognize this structure -->
<h1>Main Topic</h1>
<article>
    <h2>Article Title</h2>
    <p>Primary content...</p>
</article>
<aside>
    <h3>Related Links</h3>
    <!-- Secondary content -->
</aside>

<!-- Without semantic elements, search engines guess at content priority -->
<div class="h1">Main Topic</div>
<div class="article">
    <div class="h2">Article Title</div>
    <p>Primary content...</p>
</div>
<div class="sidebar">
    <div class="h3">Related Links</div>
</div>
```

**SEO benefits:**

- Primary content (`<article>`, `<main>`) gets higher ranking weight
- Page topic (`<h1>`) identified accurately
- Related content (`<aside>`) properly weighted as secondary
- Content structure influences featured snippets in search results

#### 3. Maintainability: Self-Documenting Code

Semantic elements make code understandable without referencing CSS or reading class names.

```html
<!-- Semantic: Clear at a glance -->
<header>
    <h1>Site Title</h1>
    <nav>Navigation</nav>
</header>
<main>
    <article>
        <h2>Article Title</h2>
        <p>Content</p>
    </article>
</main>
<footer>Footer</footer>

<!-- Structural: Requires knowledge of CSS classes -->
<div class="site-header">
    <h1>Site Title</h1>
    <div class="main-nav">Navigation</div>
</div>
<div class="content-wrapper">
    <div class="post featured">
        <h2>Article Title</h2>
        <p>Content</p>
    </div>
</div>
<div class="site-footer">Footer</div>
```

---

## 3.3 Structural Elements: When Generic Containers Are Needed

While semantic elements are preferred, **generic structural elements** are sometimes necessary when no semantic element
fits the purpose.

### `<div>` — Block-Level Generic Container

The `<div>` element is a **block-level generic container** with no semantic meaning. Use it only when no semantic HTML
element applies.

**Appropriate uses:**

- Wrapper for CSS layout (grid container, flex container)
- Grouping related content when semantic element doesn't apply
- Layout structures not covered by semantic elements

```html
<!-- ✓ Appropriate: Using div for CSS grid layout -->
<div class="grid-container">
    <article>Article 1</article>
    <article>Article 2</article>
    <article>Article 3</article>
</div>

<!-- ✓ Appropriate: Using div for flex layout -->
<div class="flex-row">
    <aside>Sidebar</aside>
    <main>Main content</main>
</div>

<!-- ✗ Inappropriate: Should use semantic elements -->
<div class="header">...</div>      <!-- Use <header> -->
<div class="navigation">...</div>  <!-- Use <nav> -->
<div class="main-content">...</div> <!-- Use <main> -->
<div class="sidebar">...</div>     <!-- Use <aside> -->
<div class="footer">...</div>      <!-- Use <footer> -->
```

### `<span>` — Inline Generic Container

The `<span>` element is an **inline generic container** with no semantic meaning. Use it only for inline
styling/scripting when no semantic element applies.

**Appropriate uses:**

- Applying CSS to part of text (changing color, font, background)
- Grouping inline content for JavaScript manipulation
- Styling inline text without semantic meaning

```html
<!-- ✓ Appropriate: Styling specific words -->
<p>This is <span class="highlight">important</span> text.</p>

<!-- ✓ Appropriate: JavaScript targeting -->
<p>Price: <span id="price">$19.99</span></p>
<script>
    document.getElementById('price').textContent = '$9.99';
</script>

<!-- ✗ Inappropriate: Should use semantic text elements -->
<span class="strong">Important</span>     <!-- Use <strong> -->
<span class="emphasis">Stressed</span>   <!-- Use <em> -->
<span class="code">function()</span>     <!-- Use <code> -->
<span class="abbr" title="HyperText Markup Language">HTML</span> <!-- Use <abbr> -->
```

**When to use div vs span:**

- **`<div>`**: Block-level (creates line break), for layout and grouping blocks
- **`<span>`**: Inline (no line break), for styling/scripting inline content

---

## 3.4 Semantic Elements: Full Reference

HTML5 semantic elements explicitly describe their content type and purpose. Use these instead of generic `<div>`
whenever applicable.

### Document Structure (Page-Level Landmarks)

These elements organize the overall page structure and create **page landmarks** for navigation.

| Element     | Purpose                                                        | Usage                               | Implicit Role              |
|-------------|----------------------------------------------------------------|-------------------------------------|----------------------------|
| `<header>`  | Introductory content, site logo, main navigation               | Top of page or section              | `banner` (page-level)      |
| `<nav>`     | Navigation links (primary menu, breadcrumbs, pagination)       | Anywhere; multiple allowed          | `navigation`               |
| `<main>`    | Primary/unique content of page (one per page)                  | Unique content area                 | `main`                     |
| `<article>` | Self-contained content (blog post, news article, forum post)   | Anywhere; multiple allowed          | `article`                  |
| `<section>` | Thematic grouping of content with heading                      | Inside articles/pages               | `region`                   |
| `<aside>`   | Tangentially related content (sidebar, related links, callout) | Anywhere; related to nearby content | `complementary`            |
| `<footer>`  | Closing info (copyright, contact, secondary nav)               | Bottom of page or section           | `contentinfo` (page-level) |

### Text Content (Semantic Text Elements)

These elements describe the semantic meaning of text content.

| Element        | Purpose                                  | Example                                               |
|----------------|------------------------------------------|-------------------------------------------------------|
| `<h1>`-`<h6>`  | Headings (hierarchical structure)        | `<h1>Main Topic</h1>`                                 |
| `<p>`          | Paragraph                                | `<p>Text paragraph</p>`                               |
| `<strong>`     | Strong importance (typically bold)       | `<strong>Important</strong>`                          |
| `<em>`         | Emphasis/stress (typically italic)       | `<em>stressed word</em>`                              |
| `<blockquote>` | Extended quotation with citation         | `<blockquote cite="URL">Quote</blockquote>`           |
| `<code>`       | Code snippet                             | `<code>function()</code>`                             |
| `<pre>`        | Preformatted text (preserves whitespace) | `<pre>Code with spacing</pre>`                        |
| `<cite>`       | Title of creative work                   | `<cite>The Great Gatsby</cite>`                       |
| `<abbr>`       | Abbreviation/acronym                     | `<abbr title="HyperText Markup Language">HTML</abbr>` |
| `<time>`       | Date/time (machine-readable)             | `<time datetime="2024-03-18">March 18, 2024</time>`   |
| `<mark>`       | Highlighted/marked text                  | Search results: `<mark>keyword</mark>`                |
| `<small>`      | Fine print, caveats                      | `<small>*Terms apply</small>`                         |
| `<del>`        | Deleted text (tracked changes)           | `<del>Old text</del>`                                 |
| `<ins>`        | Inserted text (tracked changes)          | `<ins>New text</ins>`                                 |
| `<s>`          | Strikethrough (no longer relevant)       | `<s>$29.99</s> $19.99`                                |
| `<dfn>`        | Definition/first use of term             | `<dfn>HTML</dfn> is markup language`                  |
| `<kbd>`        | User input (keyboard)                    | `Press <kbd>Ctrl</kbd>+<kbd>C</kbd>`                  |
| `<samp>`       | Computer output/sample                   | `<samp>$ command output</samp>`                       |
| `<var>`        | Variable/placeholder                     | `Solve for <var>x</var>`                              |
| `<sup>`        | Superscript                              | `E=mc<sup>2</sup>`                                    |
| `<sub>`        | Subscript                                | `H<sub>2</sub>O`                                      |
| `<bdo>`        | Bidirectional override (right-to-left)   | `<bdo dir="rtl">English text</bdo>`                   |
| `<q>`          | Inline quotation                         | `He said <q>hello</q> to me.`                         |

### Lists

| Element | Purpose                                  | Usage                                        |
|---------|------------------------------------------|----------------------------------------------|
| `<ul>`  | Unordered list (bullets)                 | Items with no order                          |
| `<ol>`  | Ordered list (numbered)                  | Items with sequence/priority                 |
| `<li>`  | List item                                | Must be child of `<ul>`, `<ol>`, or `<menu>` |
| `<dl>`  | Description list (terms and definitions) | Glossaries, name-value pairs                 |
| `<dt>`  | Description term                         | Term being defined                           |
| `<dd>`  | Description definition                   | Definition or description                    |

### Media and Embedding

| Element        | Purpose                                          |
|----------------|--------------------------------------------------|
| `<img>`        | Image with alt text                              |
| `<video>`      | Video content                                    |
| `<audio>`      | Audio content                                    |
| `<figure>`     | Self-contained illustration/diagram with caption |
| `<figcaption>` | Caption for `<figure>`                           |
| `<picture>`    | Responsive image with art direction              |
| `<source>`     | Media source (audio/video alternative formats)   |
| `<track>`      | Media captions/subtitles                         |
| `<map>`        | Image map (clickable regions)                    |
| `<area>`       | Clickable region in image map                    |

---

## 3.5 Block vs Inline Elements

Every HTML element has a default **display behavior** that determines how it participates in page flow.

### Block-Level Elements

Block elements **start on a new line** and stretch to fill available width.

```html
<!-- Each block element on its own line -->
<h1>Heading</h1>
<p>First paragraph.</p>
<p>Second paragraph.</p>
<section>Section content</section>
```

**Renders as:**

```
┌─────────────────────┐
│ Heading             │
├─────────────────────┤
│ First paragraph.    │
├─────────────────────┤
│ Second paragraph.   │
├─────────────────────┤
│ Section content     │
└─────────────────────┘
```

**Block element characteristics:**

- Start on a new line (push content below down)
- Stretch to full container width
- Respect width, height, margin, padding, border
- Stack vertically
- Full box model applies

**Common block elements:**

- `<div>`, `<p>`, `<h1>`-`<h6>`
- `<ul>`, `<ol>`, `<li>`, `<dl>`
- `<blockquote>`, `<pre>`
- `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- `<form>`, `<table>`, `<fieldset>`

### Inline Elements

Inline elements **flow within text** and only take as much width as needed.

```html
<!-- Inline elements sit side-by-side in text flow -->
<p>This has <strong>bold</strong> and <em>italic</em> text inline.</p>
```

**Renders as:**

```
This has bold and italic text inline.
        ^^^^       ^^^^^^
    (side by side, not stacked)
```

**Inline element characteristics:**

- Stay within text flow (no line breaks)
- Only take width needed for content
- Top/bottom margin ignored (padding/border show but don't affect spacing)
- Left/right margin and padding respected
- Partial box model (no top/bottom margin, limited sizing)

**Common inline elements:**

- `<span>`, `<a>`, `<strong>`, `<em>`
- `<abbr>`, `<cite>`, `<code>`, `<mark>`
- `<img>`, `<button>`
- `<input>`, `<label>`, `<select>`, `<textarea>`

### Inline-Block Elements

Inline-block elements **flow inline** (side-by-side) but respects **ful box model** (width, height, margin).

```css
/* Make inline element accept width/height */
span {
    display: inline-block;
    width: 100px;
    height: 50px;
    margin: 10px;
}
```

### Overriding Display Behavior with CSS

Elements can change their display behavior using CSS:

```css
/* Make block element inline */
p {
    display: inline;
}

/* Paragraphs now flow inline */

/* Make inline element block */
span {
    display: block;
}

/* Spans now stack like divs */

/* Make inline element accept sizing */
a {
    display: inline-block;
    width: 200px;
}
```

---

## 3.6 Div vs Span: When to Use Generic Containers

Both `<div>` and `<span>` are generic containers with no semantic meaning. Choose based on display type and purpose.

### `<div>` — Block Generic Container

```html
<!-- ✓ Appropriate: CSS layout wrapper -->
<div class="card">
    <img src="image.jpg" alt="Product">
    <h3>Product Name</h3>
    <p>Description</p>
    <button>Buy Now</button>
</div>

<!-- ✓ Appropriate: Grouping content for styling -->
<div class="highlight-box">
    <h3>Important Notice</h3>
    <p>This is an important message.</p>
</div>

<!-- ✗ Inappropriate: Use semantic element instead -->
<div class="main-content">
    <!-- Should be <main> -->
</div>

<div class="header">
    <!-- Should be <header> -->
</div>

<div class="article">
    <!-- Should be <article> -->
</div>
```

### `<span>` — Inline Generic Container

```html
<!-- ✓ Appropriate: Styling specific words -->
<p>The word <span class="highlight">important</span> is highlighted.</p>

<!-- ✓ Appropriate: JavaScript targeting -->
<button>Price: <span id="price">$19.99</span></button>

<!-- ✗ Inappropriate: Use semantic text elements -->
<span class="bold">Text</span>     <!-- Use <strong> -->
<span class="italic">Text</span>   <!-- Use <em> -->
<span class="code">function</span> <!-- Use <code> -->
```

### Decision Tree: Div vs Span vs Semantic Element

```
Is the element's purpose semantic (clear meaning)?
│
├─ YES → Use semantic element
│        ├─ Page structure? → <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>
│        ├─ Text meaning? → <strong>, <em>, <cite>, <code>, <abbr>, etc.
│        ├─ List? → <ul>, <ol>, <dl>
│        └─ Media? → <img>, <video>, <audio>, <figure>, etc.
│
└─ NO → Use generic container
         │
         └─ What kind of content?
            ├─ Block (new line, full width) → Use <div>
            │  ├─ CSS layout wrapper?
            │  ├─ Layout grid container?
            │  └─ Grouping block content?
            │
            └─ Inline (flows with text) → Use <span>
               ├─ Styling inline text?
               └─ JavaScript targeting inline content?
```

---

## 3.7 Global Attributes: Essential for All Elements

**Global attributes** can be applied to any HTML element. They provide functionality that works universally.

### Most Important Global Attributes

#### `id` — Unique Identifier

```html
<h2 id="introduction">Introduction Section</h2>
<p id="main-paragraph">First paragraph</p>

<!-- Link to element with id -->
<a href="#introduction">Jump to Introduction</a>

<!-- CSS targeting -->
<style>
    #introduction {
        color: blue;
    }
</style>

<!-- JavaScript targeting -->
<script>
    document.getElementById('introduction').textContent = 'New Title';
</script>
```

**Rules for id:**

- Must be unique per page (no two elements share same id)
- Used for CSS targeting, links, JavaScript
- Used as anchor for fragment identifiers (#section)

#### `class` — Classification/Grouping

```html
<!-- Single class -->
<article class="featured">Featured article</article>

<!-- Multiple classes (space-separated) -->
<div class="card featured recent">
    <h3>Article</h3>
    <p>Multiple classes for styling and JavaScript</p>
</div>

<!-- CSS targeting -->
<style>
    .featured {
        border: 3px solid gold;
    }

    .card {
        background: white;
        padding: 20px;
    }

    .featured.recent {
        font-size: 1.1em;
    }
</style>

<!-- JavaScript targeting -->
<script>
    document.querySelectorAll('.featured').forEach(el => {
        el.style.color = 'gold';
    });
</script>
```

**Rules for class:**

- Multiple classes allowed (space-separated)
- Many elements can share same class
- Used for CSS styling, JavaScript selection, grouping
- Reusable across pages

#### `data-*` — Custom Data Attributes

```html
<!-- Storing custom data for JavaScript -->
<button data-user-id="456" data-action="delete">
    Delete User
</button>

<!-- Accessing in JavaScript -->
<script>
    document.querySelector('button').addEventListener('click', (e) => {
        const userId = e.target.dataset.userId;      // "456"
        const action = e.target.dataset.action;      // "delete"
        console.log(`${action} user ${userId}`);
    });
</script>

<!-- Multiple data attributes -->
<div data-product-id="789"
     data-price="29.99"
     data-in-stock="true">
    Product
</div>
```

**Rules for data-*:**

- Attribute name: `data-` followed by lowercase name (hyphens allowed)
- Accessed in JavaScript via `element.dataset.attributeName`
- Hyphens in HTML converted to camelCase in JavaScript: `data-user-id` → `dataset.userId`

#### `lang` — Language

```html
<!-- Page language (in <html> tag) -->
<html lang="en">

<!-- Element-specific language -->
<p>This is English.</p>
<p lang="es">Esto es español.</p>
<p lang="fr">Ceci est français.</p>

<!-- Use case: Abbreviation with language-specific expansion -->
<abbr lang="es" title="Señora">Sra.</abbr>
<abbr lang="en" title="Mister">Mr.</abbr>
```

**Why lang matters:**

- Screen readers pronounce content with correct accent
- Spell-checkers use correct language
- Browsers apply language-specific typography (hyphenation, line breaking)
- SEO: Helps search engines serve to correct region

#### `title` — Tooltip Text

```html
<!-- Tooltip on hover -->
<abbr title="HyperText Markup Language">HTML</abbr>

<!-- Link with description -->
<a href="/page" title="Click to learn more about X">Read more</a>

<!-- Image with details -->
<img src="photo.jpg" alt="Photo" title="Photo of the team in 2024">
```

**Note:** `title` is a fallback for accessibility; don't rely on it as primary information since it's invisible until
hover.

#### `hidden` — Hide Element

```html
<!-- Element is hidden from display -->
<p hidden>This paragraph is not visible</p>

<!-- Show with JavaScript -->
<button onclick="document.querySelector('p[hidden]').hidden = false">
    Show
</button>

<!-- Equivalent to CSS display: none -->
```

#### Other Important Global Attributes

| Attribute         | Purpose                           | Example                                   |
|-------------------|-----------------------------------|-------------------------------------------|
| `style`           | Inline CSS (avoid when possible)  | `<p style="color: blue;">`                |
| `dir`             | Text direction (ltr/rtl)          | `<p dir="rtl">مرحبا</p>`                  |
| `contenteditable` | Make content user-editable        | `<p contenteditable="true">Edit me</p>`   |
| `tabindex`        | Keyboard navigation order         | `<button tabindex="1">First</button>`     |
| `translate`       | Translation hint (yes/no)         | `<span translate="no">HTML</span>`        |
| `spellcheck`      | Spell-check enabled (true/false)  | `<textarea spellcheck="true"></textarea>` |
| `draggable`       | Element is draggable (true/false) | `<div draggable="true">Drag me</div>`     |

---

## 3.8 Common Mistakes: Structural vs Semantic HTML

### Mistake 1: Overusing `<div>`

```html
<!-- ✗ DIV SOUP: Too many generic divs -->
<div class="container">
    <div class="header">
        <div class="logo">Logo</div>
        <div class="nav">
            <div class="nav-item">Home</div>
            <div class="nav-item">About</div>
        </div>
    </div>
    <div class="content">
        <div class="article">
            <div class="title">Title</div>
            <div class="body">Content</div>
        </div>
    </div>
    <div class="footer">Copyright</div>
</div>

<!-- ✓ SEMANTIC: Use appropriate elements -->
<header>
    <h1>Logo</h1>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>
<main>
    <article>
        <h2>Title</h2>
        <p>Content</p>
    </article>
</main>
<footer>Copyright</footer>
```

### Mistake 2: Confusing `<section>` and `<article>`

```html
<!-- ✗ WRONG: Using section for self-contained content -->
<section>
    <h2>Blog Post Title</h2>
    <p>This is a complete blog post that could be syndicated independently.</p>
</section>

<!-- ✓ CORRECT: Use article for self-contained content -->
<article>
    <h2>Blog Post Title</h2>
    <p>This is a complete blog post that could be syndicated independently.</p>
</article>

<!-- ✓ CORRECT: Use section for thematic grouping -->
<article>
    <h2>Article Title</h2>
    <section>
        <h3>First Topic</h3>
        <p>Content about first topic...</p>
    </section>
    <section>
        <h3>Second Topic</h3>
        <p>Content about second topic...</p>
    </section>
</article>
```

**Section vs Article:**

- **`<article>`**: Self-contained, independently valuable content (blog post, news article, comment)
- **`<section>`**: Thematic grouping within a larger context (chapters in a book, topics in an article)

### Mistake 3: Using Semantic Elements Without Heading

```html
<!-- ✗ WEAK: Semantic element with no heading (creates orphan section) -->
<article>
    No heading here, just content
</article>

<!-- ✓ BETTER: Semantic element with heading -->
<article>
    <h2>Article Title</h2>
    <p>Content...</p>
</article>

<!-- Note: Not always required, but headings help structure -->
<aside>Related links can work without heading</aside>
```

### Mistake 4: Using `<strong>` and `<b>` Incorrectly

```html
<!-- ✗ WRONG: Using <b> for semantic importance -->
<b>Warning:</b> This action cannot be undone.

<!-- ✓ CORRECT: Using <strong> for semantic importance -->
<strong>Warning:</strong> This action cannot be undone.

<!-- ✓ CORRECT: Using <b> for visual markup without meaning -->
The term <b>HTML</b> appears in this text.
<!-- vs -->
This is <strong>important</strong> information.
```

**Distinction:**

- **`<strong>`**: Strong importance/urgency (semantic)
- **`<b>`**: Bold for visual effect without special meaning (visual only)

### Mistake 5: Using `<em>` and `<i>` Incorrectly

```html
<!-- ✗ WRONG: Using <i> for stress emphasis -->
I <i>really</i> don't like this.

<!-- ✓ CORRECT: Using <em> for stress emphasis -->
I <em>really</em> don't like this.

<!-- ✓ CORRECT: Using <i> for alternate voice/mood -->
The ship's captain said, <i>All hands on deck!</i>

<!-- ✓ CORRECT: Using <i> for foreign words -->
The phrase <i>café au lait</i> is French.
```

**Distinction:**

- **`<em>`**: Stressed emphasis (changes meaning, "really" vs "really")
- **`<i>`**: Alternate voice, mood, or technical term (italic styling without stress change)

---

## 3.9 Semantic HTML and Accessibility

Semantic HTML elements have **implicit ARIA roles**, which assistive technologies automatically recognize.

### Landmark Roles (Automatic)

When you use semantic elements, they automatically have ARIA roles:

```html

<header>          <!-- Implicit role: banner (page-level) -->
    <nav>             <!-- Implicit role: navigation -->
        <main>            <!-- Implicit role: main -->
            <article>         <!-- Implicit role: article -->
                <section>         <!-- Implicit role: region -->
                    <aside>           <!-- Implicit role: complementary -->
                        <footer>          <!-- Implicit role: content info (page-level) -->
```

Screen readers announce these landmarks and allow users to jump between them:

- "Banner landmark"
- "Navigation landmark"
- "Main landmark"
- "Complementary landmark"
- "Content info landmark"

### Semantic HTML vs ARIA

**Rule 1: Use semantic HTML before ARIA**

```html
<!-- ✓ CORRECT: Semantic HTML (preferred) -->
<button>Click me</button>
<strong>Important</strong>
<em>Stressed</em>

<!-- ⚠️ UNNECESSARY: ARIA role on semantic element -->
<button role="button">Click me</button>  <!-- Already has role -->
<strong role="strong">Important</strong> <!-- Redundant -->

<!-- ✗ WRONG: Using div with ARIA instead of semantic -->
<div role="button">Click me</div>       <!-- Use <button> instead -->
<div role="main">Content</div>          <!-- Use <main> instead -->
```

**Rule 2: ARIA only when semantic HTML insufficient**

```html
<!-- Semantic HTML solution preferred: -->
<article>Content</article>

<!-- ARIA solution only when needed: -->
<div role="article">Content</div>  <!-- Use article, not div+role -->
```

---

## Summary: Section 3 Key Takeaways

- ✅ **Semantic HTML** is always preferred over structural HTML
- ✅ **One semantic element per purpose**: Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`,
  `<footer>`
- ✅ **Only use `<div>` when no semantic element fits** (CSS layout wrapper)
- ✅ **Only use `<span>` for inline styling** when no semantic element fits
- ✅ **Block elements** start new line, stretch to full width
- ✅ **Inline elements** flow with text, only take needed width
- ✅ **Don't confuse**: `<article>` (self-contained) vs `<section>` (thematic grouping)
- ✅ **Use global attributes**: `id`, `class`, `data-*`, `lang`, `title`
- ✅ **Semantic HTML = automatic accessibility**: Landmark roles, heading outline, screen reader navigation

- ❌ **Never**: Use `<div class="header">` instead of `<header>`
- ❌ **Never**: Use `<div role="main">` instead of `<main>`
- ❌ **Never**: Confuse `<strong>` (importance) with `<b>` (visual)
- ❌ **Never**: Confuse `<em>` (stress) with `<i>` (alternate voice)

---

## Links & Resources

- [MDN: Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [MDN: HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [HTML Living Standard - Sections and Outlines](https://html.spec.whatwg.org/multipage/sections.html)
- [WCAG 2.1: Content Structure](https://www.w3.org/WAI/tutorials/page-structure/)

---

# 4. HTML5 Landmark Elements

## 4.1 Overview: Page Landmarks and Navigation

**Landmark elements** are semantic HTML5 elements that define major regions of a page. They create an **invisible
structure** that assistive technologies use for navigation and users rely on for understanding page organization.

Each landmark has an **implicit ARIA role** that screen readers announce, allowing users to jump between major page
sections without tabbing through every element.

### Landmark Navigation in Action

Screen reader users can:

- List all landmarks on the page: "Banner, Navigation, Main, Complementary, Contentinfo"
- Jump to specific landmarks: "Jump to main content", "Jump to navigation", "Jump to complementary"
- Navigate by landmarks: Move between major sections quickly
- Skip repetitive content: Jump to main content on subsequent pages without hearing header/nav again

### Why Landmarks Matter

| Benefit           | Impact                                                                 |
|-------------------|------------------------------------------------------------------------|
| **Accessibility** | Screen reader users navigate efficiently by jumping between regions    |
| **SEO**           | Search engines identify primary content and page structure             |
| **Mobile UX**     | Landmarks can power "skip to content" buttons and navigation shortcuts |
| **Code Clarity**  | Page structure is self-documenting                                     |
| **Maintenance**   | New developers understand layout without reading CSS                   |

---

## 4.2 Header: `<header>`

The `<header>` element represents **introductory content** for its nearest ancestor sectioning element or the page
itself.

### Page-Level Header

```html
<!-- Page header: Introductory content for the entire page -->
<header>
    <h1>Site Name</h1>
    <p>Site tagline or description</p>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>
</header>

<main>
    <!-- Page content -->
</main>

<footer>
    <!-- Page footer -->
</footer>
```

**Implicit ARIA role**: `banner` (when it's the page-level header)

**Common contents:**

- Site logo or h1 with site name
- Tagline or mission statement
- Primary navigation menu
- Search functionality
- Introductory messaging

### Section-Level Header

Sections (`<article>`, `<section>`) can have their own `<header>`:

```html

<article>
    <header>
        <h2>Article Title</h2>
        <p>By Author Name | Published March 18, 2024</p>
    </header>
    <p>Article content...</p>
</article>

<section>
    <header>
        <h3>Section Title</h3>
        <p>Section introduction</p>
    </header>
    <!-- Section content -->
</section>
```

**Implicit ARIA role**: `region` (when inside a sectioning element)

### Multiple Headers

A page can have multiple `<header>` elements—one page-level (usually in `<body>` directly), others inside sections:

```html
<!-- Page-level header -->
<header>
    <h1>Site Name</h1>
    <nav>...</nav>
</header>

<!-- Article with its own header -->
<article>
    <header>
        <h2>Article Title</h2>
        <p>By Author | Published Date</p>
    </header>
    <p>Content...</p>
</article>

<!-- Another article with its own header -->
<article>
    <header>
        <h2>Another Article Title</h2>
        <p>By Another Author | Published Date</p>
    </header>
    <p>Content...</p>
</article>
```

### `<header>` vs `<head>`

**Never confuse these—they're completely different:**

| Element    | Location                         | Purpose              | Content                                         |
|------------|----------------------------------|----------------------|-------------------------------------------------|
| `<head>`   | Inside `<html>`, before `<body>` | Metadata             | charset, title, stylesheets, scripts, meta tags |
| `<header>` | Inside `<body>`                  | Introductory content | Site logo, navigation, tagline                  |

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Not displayed; holds metadata -->
    <title>Page Title</title>
    <meta charset="UTF-8">
</head>
<body>
<header>
    <!-- Displayed; introductory content for page -->
    <h1>Site Name</h1>
    <nav>...</nav>
</header>
</body>
</html>
```

---

## 4.3 Navigation: `<nav>`

The `<nav>` element represents a section containing **navigation links** to major parts of the site or document.

### Primary Navigation

```html

<header>
    <h1>Site Name</h1>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
    </nav>
</header>
```

**Use**: Major navigation menus for site structure.

### Multiple Navigation Sections

A page can have multiple `<nav>` elements for different navigation types:

```html
<!-- Primary navigation: Main menu -->
<header>
    <nav aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/products">Products</a>
    </nav>
</header>

<main>
    <article>
        <h2>Article Title</h2>
        <p>Content...</p>
    </article>
</main>

<!-- Secondary navigation: Pagination -->
<nav aria-label="Pagination">
    <a href="?page=1">Previous</a>
    <span>Page 2 of 5</span>
    <a href="?page=3">Next</a>
</nav>

<!-- Footer navigation: Links to site sections -->
<footer>
    <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/sitemap">Sitemap</a>
    </nav>
</footer>
```

### When NOT to Use `<nav>`

Not every group of links needs `<nav>`. Reserve it for **major navigation**:

```html
<!-- ✓ Use <nav>: Major navigation menu -->
<nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>

<!-- ✗ Don't use <nav>: Links within content -->
<p>Related articles:
    <a href="/article1">Article 1</a>,
    <a href="/article2">Article 2</a>
</p>

<!-- ✗ Don't use <nav>: Single link in footer -->
<footer>
    <a href="/privacy">Privacy Policy</a>
</footer>

<!-- ✓ Use <nav>: Group of footer links -->
<footer>
    <nav>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms</a>
        <a href="/sitemap">Sitemap</a>
    </nav>
</footer>
```

### Implicit ARIA Role

`<nav>` has implicit role: `navigation`

### Using `aria-label` with Multiple Navs

When you have multiple `<nav>` elements, use `aria-label` to distinguish them:

```html

<nav aria-label="Primary navigation">...</nav>
<nav aria-label="Breadcrumb navigation">...</nav>
<nav aria-label="Pagination navigation">...</nav>
<nav aria-label="Footer navigation">...</nav>
```

Screen readers announce:

- "Primary navigation landmark"
- "Breadcrumb navigation landmark"
- "Pagination navigation landmark"
- "Footer navigation landmark"

---

## 4.4 Main: `<main>`

The `<main>` element represents the **primary, unique content** of the page. There should be **only one `<main>` element
per page**.

### Purpose and Usage

```html

<header>
    <h1>Site Name</h1>
    <nav>...</nav>
</header>

<!-- Only one <main> per page -->
<main>
    <h2>Page Heading</h2>
    <p>Primary content goes here...</p>
    <article>Article content...</article>
</main>

<footer>...</footer>
```

**Implicit ARIA role**: `main`

### What Belongs in `<main>`

Content that is **unique to this page**:

- Page title and primary content
- Articles and blog posts
- Product details
- Search results
- User-generated content
- Page-specific forms

### What Does NOT Belong in `<main>`

Repeated content across pages:

- Site header and logo (put in `<header>`)
- Navigation menus (put in `<nav>`)
- Search boxes (unless page's primary purpose is search)
- Sidebar content (put in `<aside>`)
- Footer information (put in `<footer>`)

```html
<!-- ✓ Correct structure -->
<header>...</header>        <!-- Repeated -->
<nav>...</nav>              <!-- Repeated -->
<main>Primary content</main> <!-- Unique to page -->
<aside>Sidebar</aside>       <!-- Related but secondary -->
<footer>...</footer>         <!-- Repeated -->

<!-- ✗ Wrong: Putting repeated content in main -->
<main>
    <header>...</header>       <!-- Should be outside main -->
    <nav>...</nav>             <!-- Should be outside main -->
    Page content...
    <footer>...</footer>        <!-- Should be outside main -->
</main>
```

### Only One `<main>` Per Page

```html
<!-- ✓ CORRECT: Single main element -->
<main>
    <h2>Unique Content Section 1</h2>
    <p>Content...</p>
</main>

<!-- ✗ WRONG: Multiple main elements -->
<main>
    <section>Section 1</section>
</main>
<main>
    <section>Section 2</section>
</main>

<!-- ✓ If really needed: Use CSS hidden on alternatives -->
<main id="main-en">English content</main>
<main id="main-es" hidden>Spanish content</main>
```

---

## 4.5 Article: `<article>`

The `<article>` element represents **self-contained content** that could be redistributed independently—blog posts, news
articles, forum posts, comments, product cards.

### Self-Contained Content Test

Ask: "Could this content be syndicated independently (email, RSS, another site) and still make sense?"

```html
<!-- ✓ ARTICLE: Blog post (self-contained, independently valuable) -->
<article>
    <h2>How to Learn HTML</h2>
    <p>By Jane Doe | Published March 18, 2024</p>
    <p>This is a complete article about learning HTML.
        It explains concepts, provides examples, and would make
        sense on its own in an RSS feed or email.</p>
</article>

<!-- ✓ ARTICLE: News article -->
<article>
    <h2>Web Standards Update</h2>
    <p>WHATWG announced new HTML features...</p>
</article>

<!-- ✓ ARTICLE: Product card -->
<article>
    <img src="product.jpg" alt="Product name">
    <h3>Product Name</h3>
    <p>$29.99</p>
    <button>Add to Cart</button>
</article>

<!-- ✓ ARTICLE: Comment/forum post -->
<article>
    <h3>User Comment</h3>
    <p>By Username | March 18, 2024</p>
    <p>This is a user comment that could be extracted
        separately and still make sense.</p>
</article>

<!-- ✗ NOT ARTICLE: Sidebar content (related but secondary) -->
<aside>
    <h3>Related Articles</h3>
    <ul>
        <li><a href="/article1">Article 1</a></li>
        <li><a href="/article2">Article 2</a></li>
    </ul>
</aside>
```

### Nested Articles

Articles can contain other articles (useful for blog comments within an article):

```html

<article>
    <h2>Blog Post Title</h2>
    <p>Blog post content...</p>

    <section>
        <h3>Comments</h3>

        <!-- Nested articles for comments -->
        <article>
            <h4>Comment by User1</h4>
            <p>This is a comment...</p>
        </article>

        <article>
            <h4>Comment by User2</h4>
            <p>This is another comment...</p>
        </article>
    </section>
</article>
```

### Implicit ARIA Role

`<article>` has implicit role: `article`

---

## 4.6 Section: `<section>`

The `<section>` element represents a **thematic grouping of content** with a heading. Use it to divide document/article
into logical parts.

### Purpose: Thematic Grouping

```html

<article>
    <h1>Complete Guide to HTML</h1>

    <!-- Section 1 -->
    <section>
        <h2>Introduction</h2>
        <p>What is HTML...</p>
    </section>

    <!-- Section 2 -->
    <section>
        <h2>Basic Syntax</h2>
        <p>HTML syntax rules...</p>
    </section>

    <!-- Section 3 -->
    <section>
        <h2>Semantic Elements</h2>
        <p>Using semantic elements...</p>
    </section>
</article>
```

### Section vs Article

| Element     | Purpose                | Relationship         | Independently Valuable    |
|-------------|------------------------|----------------------|---------------------------|
| `<article>` | Self-contained content | Standalone           | Yes, can be redistributed |
| `<section>` | Thematic grouping      | Part of larger whole | No, depends on context    |

```html
<!-- ✓ SECTION: Part of article, depends on context -->
<article>
    <h2>Article Title</h2>
    <section>
        <h3>Topic 1</h3>
        <!-- Makes sense only within this article -->
    </section>
    <section>
        <h3>Topic 2</h3>
        <!-- Makes sense only within this article -->
    </section>
</article>

<!-- ✓ ARTICLE: Standalone, independently valuable -->
<article>
    <h2>Complete Blog Post</h2>
    <p>This entire article makes sense on its own,
        could be syndicated to RSS feed, email, etc.</p>
</article>
```

### Section Must Have Heading

Sections should have a heading to define the topic:

```html
<!-- ✓ GOOD: Section with heading -->
<section>
    <h2>Getting Started</h2>
    <p>Content about getting started...</p>
</section>

<!-- ⚠️ WEAK: Section without heading (orphan section) -->
<section>
    <p>Content with unclear topic...</p>
</section>

<!-- Better alternative if no heading needed: Use <div> -->
<div class="wrapper">
    <p>Layout wrapper without semantic meaning...</p>
</div>
```

### Implicit ARIA Role

`<section>` has implicit role: `region` (when labeled/titled)

---

## 4.7 Aside: `<aside>`

The `<aside>` element represents content that is **tangentially related** to the surrounding content but separate from
the main flow.

### Common Uses

```html
<!-- ✓ Sidebar -->
<main>
    <article>
        <h2>Main Article</h2>
        <p>Article content...</p>
    </article>
</main>

<aside>
    <h3>Related Articles</h3>
    <ul>
        <li><a href="/article1">Related Article 1</a></li>
        <li><a href="/article2">Related Article 2</a></li>
    </ul>
</aside>

<!-- ✓ Pull quote -->
<article>
    <h2>Article Title</h2>
    <p>Article content...</p>

    <aside>
        <blockquote>
            <p>An important quote from the article.</p>
            <cite>— Source</cite>
        </blockquote>
    </aside>

    <p>More article content...</p>
</article>

<!-- ✓ Author bio -->
<article>
    <h2>Article Title</h2>
    <p>Article content...</p>

    <aside>
        <h3>About the Author</h3>
        <img src="author.jpg" alt="Author">
        <p>Author biography...</p>
    </aside>
</article>

<!-- ✓ Callout/note box -->
<main>
    <p>Main content...</p>

    <aside>
        <h3>Important Note</h3>
        <p>This is additional information tangential to main content.</p>
    </aside>

    <p>More main content...</p>
    </aside>
```

### Important Distinction: Aside vs Right Sidebar

The `<aside>` element is **semantic**, not visual. It indicates the content is tangentially related—not that it appears
on the right side.

```html
<!-- ✓ Semantic: <aside> indicates relationship -->
<main>Main content</main>
<aside>Tangentially related content</aside>

<!-- With CSS, aside can appear anywhere: -->
<style>
    aside {
        float: right; /* Right sidebar */
        /* or */
        order: -1; /* Left sidebar */
        /* or */
        position: absolute; /* Anywhere */
    }
</style>

<!-- ✗ Appearance alone doesn't make it <aside>: -->
<div style="float: right;">This is visually right, but structurally it's primary content</div>
```

### Implicit ARIA Role

`<aside>` has implicit role: `complementary`

---

## 4.8 Footer: `<footer>`

The `<footer>` element represents **closing information** for its nearest ancestor sectioning element or the page
itself.

### Page-Level Footer

```html

<body>
<header>...</header>
<nav>...</nav>
<main>...</main>

<!-- Page footer: Closing info for entire page -->
<footer>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
    <nav>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/sitemap">Sitemap</a>
    </nav>
</footer>
</body>
```

**Implicit ARIA role**: `contentinfo` (when it's the page-level footer)

**Common contents:**

- Copyright information
- Contact information
- Secondary navigation
- Legal links (privacy, terms)
- Sitemap
- Credits and attributions

### Section-Level Footer

Sections can have their own `<footer>`:

```html

<article>
    <h2>Article Title</h2>
    <p>Article content...</p>

    <!-- Article footer: Meta info for this article -->
    <footer>
        <p>Published March 18, 2024 | Category: Web Design</p>
        <p>Tags: HTML, Semantic, Web Standards</p>
    </footer>
</article>

<section>
    <h2>Section Title</h2>
    <p>Section content...</p>

    <!-- Section footer -->
    <footer>
        <p>Last updated March 18, 2024</p>
    </footer>
</section>
```

### Multiple Footers

Like headers, pages can have multiple footers—one at page level, others at section level:

```html
<!-- Page structure -->
<header>Page header</header>
<main>
    <article>
        <h2>Article</h2>
        <p>Content</p>
        <footer>Article-specific footer</footer>  <!-- Section footer -->
    </article>
</main>
<footer>Page footer</footer>  <!-- Page footer -->
```

---

## 4.9 Landmark Nesting Rules

Landmarks can be **nested inside each other** following these guidelines:

### Valid Nesting

```html
<!-- ✓ Valid: Header in body, contains nav -->
<header>
    <h1>Site Name</h1>
    <nav>Navigation</nav>
</header>

<!-- ✓ Valid: Article contains section -->
<article>
    <h2>Title</h2>
    <section>
        <h3>Section 1</h3>
    </section>
    <section>
        <h3>Section 2</h3>
    </section>
</article>

<!-- ✓ Valid: Main contains article, article contains section -->
<main>
    <article>
        <h2>Title</h2>
        <section>
            <h3>Subsection</h3>
        </section>
    </article>
</main>

<!-- ✓ Valid: Article contains nested article (comments) -->
<article>
    <h2>Blog Post</h2>
    <p>Content</p>
    <article>
        <h3>Comment 1</h3>
    </article>
    <article>
        <h3>Comment 2</h3>
    </article>
</article>
```

### Common Nesting Patterns

#### Pattern 1: Basic Page Layout

```html

<header>
    <h1>Site Name</h1>
    <nav>Primary Navigation</nav>
</header>

<main>
    <h2>Page Content</h2>
    <article>Article content</article>
</main>

<aside>Related content</aside>

<footer>
    <nav>Footer navigation</nav>
    <p>Copyright info</p>
</footer>
```

#### Pattern 2: Multi-Section Article

```html

<article>
    <header>
        <h1>Article Title</h1>
        <p>By Author | Date</p>
    </header>

    <section>
        <h2>Introduction</h2>
        <p>Intro content...</p>
    </section>

    <section>
        <h2>Main Topic</h2>
        <p>Main content...</p>
    </section>

    <section>
        <h2>Conclusion</h2>
        <p>Conclusion...</p>
    </section>

    <footer>
        <p>Published: March 18, 2024</p>
        <p>Tags: HTML, Web</p>
    </footer>
</article>
```

#### Pattern 3: Multiple Articles with Sidebar

```html

<main>
    <h1>Blog</h1>

    <article>
        <h2>First Post</h2>
        <p>Content...</p>
    </article>

    <article>
        <h2>Second Post</h2>
        <p>Content...</p>
    </article>

    <article>
        <h2>Third Post</h2>
        <p>Content...</p>
    </article>
</main>

<aside>
    <h3>Recent Posts</h3>
    <!-- Sidebar content -->
</aside>
```

---

## 4.10 Complete Page Example: Using All Landmarks

Here's a complete page using all landmark elements correctly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Development Guide</title>
</head>
<body>

<!-- Page header -->
<header>
    <h1>Web Development Academy</h1>
    <p>Learn modern web development from basics to advanced</p>
</header>

<!-- Primary navigation -->
<nav aria-label="Primary navigation">
    <a href="/">Home</a>
    <a href="/courses">Courses</a>
    <a href="/blog">Blog</a>
    <a href="/contact">Contact</a>
</nav>

<!-- Main content -->
<main>
    <h2>Latest Article</h2>

    <!-- Self-contained article -->
    <article>
        <header>
            <h2>Getting Started with HTML</h2>
            <p>By Jane Doe | Published March 18, 2024</p>
        </header>

        <!-- Article divided into sections -->
        <section>
            <h3>What is HTML?</h3>
            <p>HTML is the standard markup language...</p>
        </section>

        <section>
            <h3>Basic Structure</h3>
            <p>Every HTML document starts with...</p>
        </section>

        <section>
            <h3>Common Elements</h3>
            <p>The most important elements are...</p>
        </section>

        <!-- Article footer with metadata -->
        <footer>
            <p>Category: Web Development</p>
            <p>Tags: HTML, Beginner, Web</p>
        </footer>
    </article>

</main>

<!-- Complementary content -->
<aside>
    <h3>Related Articles</h3>
    <ul>
        <li><a href="/css-guide">CSS Guide</a></li>
        <li><a href="/js-basics">JavaScript Basics</a></li>
        <li><a href="/web-standards">Web Standards</a></li>
    </ul>

    <h3>About the Author</h3>
    <img src="jane.jpg" alt="Jane Doe">
    <p>Jane Doe is a web developer with 10 years of experience...</p>
</aside>

<!-- Pagination navigation -->
<nav aria-label="Pagination">
    <a href="?page=1">Previous</a>
    <span>Page 2 of 10</span>
    <a href="?page=3">Next</a>
</nav>

<!-- Page footer -->
<footer>
    <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/sitemap">Sitemap</a>
    </nav>
    <p>&copy; 2024 Web Development Academy. All rights reserved.</p>
</footer>

</body>
</html>
```

---

## 4.11 Common Mistakes with Landmark Elements

### Mistake 1: Multiple `<main>` Elements

```html
<!-- ✗ WRONG: Two main elements (only one per page) -->
<main>
    <h2>Section 1</h2>
    <p>Content...</p>
</main>

<main>
    <h2>Section 2</h2>
    <p>Content...</p>
</main>

<!-- ✓ CORRECT: One main with multiple sections -->
<main>
    <section>
        <h2>Section 1</h2>
        <p>Content...</p>
    </section>

    <section>
        <h2>Section 2</h2>
        <p>Content...</p>
    </section>
</main>
```

### Mistake 2: Missing Headings in Sections

```html
<!-- ⚠️ WEAK: Section without heading -->
<section>
    <p>Content with unclear purpose...</p>
</section>

<!-- ✓ BETTER: Section with heading -->
<section>
    <h2>Topic Name</h2>
    <p>Content about the topic...</p>
</section>

<!-- Alternative: If no heading needed, use div -->
<div class="wrapper">
    <p>Layout wrapper, not semantic section...</p>
</div>
```

### Mistake 3: Using `<nav>` for Non-Navigation Links

```html
<!-- ✗ WRONG: Small link group in nav -->
<nav>
    <a href="/privacy">Privacy</a>
</nav>

<!-- ✓ CORRECT: Single link or small group doesn't need nav -->
<a href="/privacy">Privacy Policy</a>

<!-- ✓ CORRECT: Multiple navigation links use nav -->
<nav>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
    <a href="/sitemap">Sitemap</a>
</nav>
```

### Mistake 4: Misplacing Repeated Content in `<main>`

```html
<!-- ✗ WRONG: Repeated content in main -->
<main>
    <header>Site header</header>  <!-- Repeated on every page -->
    <nav>Navigation</nav>          <!-- Repeated on every page -->
    Page-specific content
    <footer>Footer</footer>        <!-- Repeated on every page -->
</main>

<!-- ✓ CORRECT: Repeated content outside main -->
<header>Site header</header>
<nav>Navigation</nav>
<main>Page-specific content</main>
<aside>Related content</aside>
<footer>Footer</footer>
```

### Mistake 5: Confusing Article and Section

```html
<!-- ✗ WRONG: Using section for self-contained blog post -->
<section>
    <h2>Blog Post Title</h2>
    <p>Complete, self-contained blog post.</p>
    <!-- This could be syndicated to RSS independently -->
</section>

<!-- ✓ CORRECT: Using article for self-contained content -->
<article>
    <h2>Blog Post Title</h2>
    <p>Complete, self-contained blog post.</p>
</article>

<!-- ✓ CORRECT: Using section for part of larger content -->
<article>
    <h2>Blog Post Title</h2>
    <section>
        <h3>Topic 1 (part of larger article)</h3>
        <p>Content...</p>
    </section>
    <section>
        <h3>Topic 2 (part of larger article)</h3>
        <p>Content...</p>
    </section>
</article>
```

---

## Summary: Section 4 Key Takeaways

- ✅ **Landmarks define page structure** for accessibility and SEO
- ✅ **One `<main>` per page** for primary unique content
- ✅ **Multiple `<header>` and `<footer>` allowed** (page-level and section-level)
- ✅ **Multiple `<nav>` allowed** (distinguish with `aria-label`)
- ✅ **`<article>`** = self-contained, independently valuable
- ✅ **`<section>`** = thematic grouping, depends on context
- ✅ **`<aside>`** = tangentially related, secondary content
- ✅ **Use `aria-label`** to distinguish multiple elements of same type
- ✅ **Landmarks create implicit ARIA roles** for assistive technologies
- ✅ **Proper nesting** follows semantic relationships
- ❌ **Never**: Multiple `<main>` elements on one page
- ❌ **Never**: Put repeated content inside `<main>`
- ❌ **Never**: Use `<section>` without heading
- ❌ **Never**: Confuse `<article>` (self-contained) with `<section>` (thematic grouping)
- ❌ **Never**: Forget to distinguish multiple navs with `aria-label`

---

## Links & Resources

- [MDN: HTML Landmarks](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
- [ARIA Authoring Practices: Landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- [WCAG: Page Structure](https://www.w3.org/WAI/tutorials/page-structure/)
- [HTML Living Standard: Sections and Outlines](https://html.spec.whatwg.org/multipage/sections.html)
- [WebAIM: Skip Links](https://webaim.org/articles/skipnav/)

---

# 5. Text Elements

## 5.1 Structural Text Markup: Block-Level Content Division

These elements divide text content into **block-level** semantic units.

### Paragraph: `<p>`

The `<p>` element represents a **paragraph** of text.

```html
<p>This is a paragraph of text.</p>
<p>This is another paragraph.</p>
<p>Paragraphs are automatically separated by whitespace.</p>
```

**Browser rendering**: Adds default margins above and below (typically `1em`). Multiple spaces/newlines in source are
collapsed to single space.

**What belongs in `<p>`:**

- Text paragraphs
- Short blocks of text content
- Can contain inline elements: `<p>Text with <strong>emphasis</strong></p>`

**What doesn't belong in `<p>`:**

- Block-level elements: `<div>`, `<section>`, `<blockquote>`, etc.
- List items (use `<li>`)
- Headings (use `<h1>`-`<h6>`)

```html
<!-- ✓ CORRECT: Paragraph with inline elements -->
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>

<!-- ✗ WRONG: Block elements inside paragraph -->
<p>
<div>Nested div (invalid)</div>
</p>

<!-- ✓ CORRECT: Multiple paragraphs -->
<p>First paragraph.</p>
<p>Second paragraph.</p>
<p>Third paragraph.</p>
```

### Line Break: `<br>`

The `<br>` (void element) forces a **line break** without creating a new paragraph.

```html
<!-- Line break within paragraph -->
<p>
    Line one<br>
    Line two<br>
    Line three
</p>

<!-- Common use: Poetry, addresses, formatting -->
<address>
    123 Main Street<br>
    New York, NY 10001<br>
    USA
</address>
```

**When to use `<br>`:**

- Poetry or line-based content
- Addresses
- Preformatted text (better: use `<pre>`)
- Rare cases where line breaks are semantic

**When NOT to use `<br>`:**

- Never for spacing (use CSS margins instead)
- Never for multiple paragraphs (use `<p>` elements)
- Never to create visual separation (use `<hr>` or CSS)

```html
<!-- ✗ WRONG: Using br for spacing -->
<p>Paragraph 1</p>
<br><br><br>  <!-- Bad spacing hack -->
<p>Paragraph 2</p>

<!-- ✓ CORRECT: Use CSS margins -->
<p>Paragraph 1</p>
<p>Paragraph 2</p>
<style>
    p {
        margin: 1em 0;
    }
</style>
```

### Horizontal Rule: `<hr>`

The `<hr>` (void element) represents a **thematic break** or scene change in text.

```html

<section>
    <h2>Act I</h2>
    <p>First act content...</p>
</section>

<hr>  <!-- Thematic break between acts -->

<section>
    <h2>Act II</h2>
    <p>Second act content...</p>
</section>
```

**Semantic meaning**: Indicates a shift in topic or scene, not just a visual line.

**Don't use for decoration** (use CSS borders instead):

```html
<!-- ✗ WRONG: Using hr for visual separation -->
<p>Content</p>
<hr>
<p>More content</p>

<!-- ✓ BETTER: CSS border if visual separation needed -->
<div class="divider">
    <p>Content</p>
    <p>More content</p>
</div>
<style>
    .divider {
        border-top: 1px solid #ccc;
        padding-top: 1em;
    }
</style>
```

### Preformatted Text: `<pre>`

The `<pre>` element preserves **whitespace and line breaks** exactly as written. Uses monospace font by default.

```html
<!-- Preserves exact spacing and layout -->
<pre>
function greet(name) {
  console.log("Hello, " + name);
}
</pre>

<!-- Art or diagrams -->
<pre>
    ^
    |
    |     *
    |    * *
    |   *   *
  --+------+------>
    |
</pre>

<!-- Code with indentation preserved -->
<pre>
if (condition) {
  doSomething();
  if (nested) {
    doMore();
  }
}
</pre>
```

**Important**: Whitespace inside `<pre>` is significant. Indenting content for readability in source affects display.

```html
<!-- ✓ Content properly indented in output -->
<pre>
Line 1
  Line 2 (indented)
    Line 3 (more indented)
</pre>

<!-- ✗ Source indentation affects output -->
<pre>
  Line 1 (starts with spaces)
  Line 2
</pre>
<!-- Displays with leading spaces -->
```

**Combining `<pre>` with `<code>`:**

```html
<!-- For code blocks, combine pre + code -->
<pre><code>
function example() {
  return "code";
}
</code></pre>

<!-- CSS syntax highlighting example -->
<pre><code class="language-javascript">
function greet(name) {
  console.log("Hello, " + name);
}
</code></pre>
```

### Block Quotation: `<blockquote>`

The `<blockquote>` element represents an **extended quotation** from another source.

```html
<!-- Extended quotation with citation -->
<blockquote cite="https://example.com/article">
    <p>This is a longer quotation that might span multiple paragraphs and comes from an external source.</p>
    <p>The blockquote element groups the entire quote together.</p>
</blockquote>

<!-- Blockquote with attribution -->
<blockquote>
    <p>The only way to do great work is to love what you do.</p>
    <cite>— Steve Jobs</cite>
</blockquote>

<!-- Blockquote can contain multiple paragraphs -->
<blockquote>
    <p>First paragraph of quote.</p>
    <p>Second paragraph of quote.</p>
    <p>Third paragraph of quote.</p>
    <footer>
        <cite>Source Title</cite> by Author Name
    </footer>
</blockquote>
```

**The `cite` attribute:**

- URL to the source (not displayed, but machine-readable)
- Not for author/source name (use `<cite>` element for that)

```html
<!-- cite attribute holds URL -->
<blockquote cite="https://example.com/article">
    <p>Quote from the article</p>
    <p>The cite attribute has the URL</p>
</blockquote>

<!-- cite element has author/source name -->
<blockquote>
    <p>Quote text</p>
    <footer>
        Source: <cite>Article Title</cite>
    </footer>
</blockquote>
```

**Nesting blockquotes:**

```html
<!-- Quote containing a nested quote -->
<blockquote>
    <p>Original quote: "As Einstein said, <q>Imagination is more important than knowledge.</q>"</p>
    <cite>— Reference source</cite>
</blockquote>
```

---

## 5.2 Semantic Inline Markup: Text Meaning and Emphasis

These elements convey **semantic meaning** about inline text content.

### Strong Importance: `<strong>`

The `<strong>` element indicates **strong importance, urgency, or seriousness**.

```html
<!-- Warning or urgent message -->
<p><strong>Warning:</strong> This action cannot be undone.</p>

<!-- Important information -->
<p>The deadline is <strong>March 31, 2024</strong>—do not miss it.</p>

<!-- Life-critical information -->
<p><strong>Allergies:</strong> Peanuts, shellfish</p>

<!-- Screen readers may add emphasis when reading aloud -->
<p>This is <strong>very important</strong> information.</p>
```

**Rendering**: Bold by default, but semantics matter—it's about importance, not just bold.

**Nesting `<strong>` for emphasis:**

```html
<!-- Gradation of importance -->
<p>This is important, <strong>this is more important</strong>,
    and <strong><strong>this is critically important</strong></strong>.</p>
```

### Emphasis: `<em>`

The `<em>` element indicates **stress emphasis**—emphasis that changes the meaning of a sentence.

```html
<!-- Stress changes meaning -->
<p>I <em>love</em> chocolate.</p>  <!-- Different from... -->
<p>I love <em>chocolate</em>.</p>  <!-- ...this emphasis -->

<!-- Stressed word in speech -->
<p>This is a <em>terrible</em> idea.</p>  <!-- Emphasis on terrible -->

<!-- Emotional stress -->
<p>I <em>can't</em> believe you did that.</p>  <!-- Stress on can't -->
```

**Rendering**: Italic by default, but semantics matter—it's about stress emphasis that changes meaning.

### Strong vs Bold: The Distinction

| Element    | Meaning                                        | Use                                                  | Screen Reader             | Visual |
|------------|------------------------------------------------|------------------------------------------------------|---------------------------|--------|
| `<strong>` | **Semantic**: Important, urgent, serious       | Warning, critical info, strong assertions            | May add prosodic emphasis | Bold   |
| `<b>`      | **Visual only**: Bold without semantic meaning | Foreign words, technical terms, keyword highlighting | No special handling       | Bold   |

```html
<!-- STRONG: Importance (semantic) -->
<strong>Warning:</strong> Do not exceed dose.

<!-- B: Highlighting without importance (visual) -->
The term <b>HTML</b> appears frequently in web development.

<!-- STRONG: Urgency -->
You have <strong>one hour</strong> to submit.

<!-- B: Alternate voice (like labeled instructions) -->
<b>User:</b> Enter your name
<b>System:</b> Hello, [name]
```

### Emphasis vs Italic: The Distinction

| Element | Meaning                                          | Use                                    | Changes Meaning              | Visual |
|---------|--------------------------------------------------|----------------------------------------|------------------------------|--------|
| `<em>`  | **Semantic**: Stress emphasis                    | Changing tone/meaning of sentence      | YES - stress changes meaning | Italic |
| `<i>`   | **Visual only**: Italic without semantic meaning | Foreign words, titles, alternate voice | NO - doesn't change meaning  | Italic |

```html
<!-- EM: Stress emphasis (changes meaning) -->
I <em>really</em> want to go.      <!-- Different from: -->
I really <em>want</em> to go.      <!-- ...different meaning -->

<!-- I: Foreign words (no emphasis) -->
The phrase <i>café au lait</i> is French.

<!-- I: Titles (no emphasis) -->
I'm reading <i>The Great Gatsby</i>.

<!-- I: Alternate voice or mood (no emphasis) -->
The teacher said, <i>Everyone get your books.</i>
```

### Abbreviation: `<abbr>`

The `<abbr>` element marks an **abbreviation or acronym**.

```html
<!-- Abbreviation with expansion -->
<abbr title="HyperText Markup Language">HTML</abbr>

<!-- Acronym -->
<abbr title="Cascading Style Sheets">CSS</abbr>

<!-- In context -->
<p>The <abbr title="World Wide Web Consortium">W3C</abbr>
    maintains web standards.</p>

<!-- Multiple uses in document -->
<p><abbr title="HyperText Markup Language">HTML</abbr> is essential
    for web development. Learn <abbr title="HyperText Markup Language">HTML</abbr> first.</p>
```

**Browser behavior**: Some browsers underline `<abbr>` elements; the `title` attribute shows on hover.

### Citation: `<cite>`

The `<cite>` element marks the **title of a creative work** (book, film, article, song, etc.).

```html
<!-- Book title -->
I recommend <cite>The Great Gatsby</cite> by F. Scott Fitzgerald.

<!-- Article title -->
According to <cite>The State of CSS 2024</cite>, Grid adoption is increasing.

<!-- Film title -->
Have you watched <cite>The Matrix</cite>?

<!-- Song title -->
My favorite song is <cite>Bohemian Rhapsody</cite> by Queen.

<!-- Website/blog -->
As mentioned in <cite>CSS-Tricks</cite>, this is a common pattern.
```

**Not for author/source name** (use text or `<author>` for that):

```html
<!-- ✓ CORRECT: cite for title -->
<blockquote cite="https://example.com">
    <p>Quote text</p>
    <footer>Source: <cite>Article Title</cite> by Jane Doe</footer>
</blockquote>

<!-- ✗ WRONG: Using cite for author name -->
<p>According to <cite>Jane Doe</cite>, this is true.</p>
<!-- Should be: -->
<p>According to Jane Doe, this is true.</p>
```

### Code: `<code>`

The `<code>` element represents a **code fragment**.

```html
<!-- Inline code -->
<p>Use the <code>console.log()</code> function to debug.</p>

<!-- Code in sentence -->
<p>The <code>display: flex</code> property creates a flex container.</p>

<!-- Multiple code snippets -->
<p>Compare <code>let</code> and <code>const</code> in JavaScript.</p>

<!-- Inside pre for code blocks -->
<pre><code>
function hello() {
  console.log("Hello, World!");
}
</code></pre>
```

**Rendering**: Monospace font by default.

### Mark: `<mark>`

The `<mark>` element highlights text as **relevant to the current context** (search results, user-highlighted text).

```html
<!-- Search result highlighting -->
Search results for "
<mark>web development</mark>":
Results shown with the
<mark>web development</mark> highlighted.

<!-- User-marked passage -->
<p>This paragraph is important. I'm highlighting
    <mark>this specific phrase</mark>
    for reference.
</p>

<!-- Highlighting during revision -->
<p>The document has been updated.
    <mark>This section</mark>
    is new and should be reviewed carefully.
</p>
```

**Rendering**: Yellow background by default (customizable with CSS).

### Time: `<time>`

The `<time>` element represents a **date or time** with machine-readable format.

```html
<!-- Date only -->
<time datetime="2024-03-18">March 18, 2024</time>

<!-- Time only -->
<time datetime="14:30">2:30 PM</time>

<!-- Date and time -->
<time datetime="2024-03-18T14:30:00">March 18, 2024 at 2:30 PM</time>

<!-- With timezone -->
<time datetime="2024-03-18T14:30:00-04:00">March 18, 2024 at 2:30 PM EDT</time>

<!-- Duration -->
The event lasts
<time datetime="PT2H30M">2 hours 30 minutes</time>.

<!-- In context -->
<p>The event is on
    <time datetime="2024-04-15">April 15</time>
    .
</p>

<!-- Article publication -->
<article>
    <h2>Article Title</h2>
    <p>Published
        <time datetime="2024-03-18">March 18, 2024</time>
    </p>
</article>
```

**The `datetime` attribute:**

- Machine-readable format (ISO 8601)
- Not displayed to users (only content is displayed)
- Enables search engines and tools to understand dates

---

## 5.3 Deleted and Inserted Text: Tracked Changes

These elements mark text that has been **deleted or inserted**, useful for showing revisions.

### Deleted Text: `<del>`

The `<del>` element marks text that has been **deleted or is no longer accurate**.

```html
<!-- Price change showing old price struck -->
<p>Original price:
    <del>$29.99</del>
    Now: $19.99
</p>

<!-- Revision tracking -->
<p>The meeting is on
    <del>Monday</del>
    <ins>Tuesday</ins>
    at 2 PM.
</p>

<!-- Document revision -->
<article>
    <p>The project timeline is
        <del>6 months</del>
        <ins>8 months</ins>
        .
    </p>
</article>

<!-- Cite and datetime for tracking changes -->
<p>The deadline is
    <del cite="https://example.com/change-log" datetime="2024-03-10">March 18</del>
    <ins cite="https://example.com/change-log" datetime="2024-03-10">April 1</ins>
    .
</p>
```

**Rendering**: Strikethrough by default.

### Inserted Text: `<ins>`

The `<ins>` element marks text that has been **inserted or added**.

```html
<!-- New information added -->
<p>The requirements include: performance,
    <ins>accessibility</ins>
    , and maintainability.
</p>

<!-- Revision with tracking -->
<p>The new feature
    <ins>allows users to customize themes</ins>
    .
</p>

<!-- With metadata -->
<ins datetime="2024-03-15" cite="https://example.com/changelog">
    This section was added on March 15.
</ins>
```

**Rendering**: Underline by default.

### Combined Deletion and Insertion

```html
<!-- Show what was removed and what was added -->
<p>The deadline is
    <del>March 18</del>
    <ins>April 1</ins>
    .
</p>

<!-- More complex revision -->
<p>The project will
    <del>take 6 months</del>
    <ins>require 8 months</ins>
    to complete.
</p>

<!-- Styled with attributes -->
<p>
    <del datetime="2024-03-10">Old text</del>
    <ins datetime="2024-03-15">New text</ins>
</p>
```

---

## 5.4 Strikethrough, Small, and Other Text Elements

### Strikethrough: `<s>`

The `<s>` element marks text that is **no longer accurate or relevant** (but not deleted—use `<del>` for deletions).

```html
<!-- No longer true/relevant -->
<p><s>Our website is under construction.</s> We're now live!</p>

<!-- Pricing showing no longer valid price -->
<p>Save now! <s>$49.99</s> $29.99</p>

<!-- Outdated information -->
<p><s>Support for Internet Explorer ended</s> is coming.</p>
```

**Difference from `<del>`:**

- **`<del>`**: Text was removed (document revision tracking)
- **`<s>`**: Text is no longer accurate/relevant (but not a revision)

```html
<!-- DEL: Revision tracking (someone removed this) -->
<del>This feature is deprecated.</del>

<!-- S: No longer accurate (but not a tracked change) -->
<s>This feature is the latest version.</s> Version 2 is now available.
```

### Small Text: `<small>`

The `<small>` element represents **fine print, caveats, or side comments**.

```html
<!-- Legal disclaimers -->
<p>Sign up for our newsletter
    <small>*We respect your privacy and never share your email.</small></p>

<!-- Pricing fine print -->
<p>Only $9.99/month <small>*Plus applicable taxes</small></p>

<!-- Copyright notice -->
<footer>
    <p>&copy; 2024 Company Name
        <small>All rights reserved</small></p>
</footer>

<!-- Side comments in text -->
<p>The project is on track <small>(as of last week)</small>
    to launch in Q2.</p>
```

**Rendering**: Smaller font by default, but semantics matter—it's about de-emphasized information.

---

## 5.5 Advanced Text Elements

### Definition: `<dfn>`

The `<dfn>` element marks the **first mention or definition of a term**.

```html
<!-- First use of a term being defined -->
<p><dfn>HTML</dfn> is the standard markup language for web pages.</p>

<!-- Definition in context -->
<p>In web development, <dfn>responsive design</dfn> means creating
    layouts that adapt to different screen sizes.</p>

<!-- With abbreviation -->
<p><dfn><abbr title="HyperText Markup Language">HTML</abbr></dfn>
    is essential for web development.</p>

<!-- Full definition -->
<p><dfn title="Application Programming Interface">API</dfn> is an interface
    for software to interact with other software.</p>
```

**Convention**: Use `<dfn>` for the first occurrence of a term being introduced.

### Keyboard Input: `<kbd>`

The `<kbd>` element marks **user keyboard input or commands**.

```html
<!-- Keys to press -->
<p>Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy.</p>

<!-- Keyboard shortcut -->
<p>Save your work with <kbd>Cmd</kbd>+<kbd>S</kbd> on Mac
    or <kbd>Ctrl</kbd>+<kbd>S</kbd> on Windows.</p>

<!-- Terminal commands -->
<pre><kbd>$ npm install</kbd></pre>

<!-- Menu navigation -->
<p>Go to <kbd>File</kbd> → <kbd>Open</kbd> → select your file.</p>
```

**Rendering**: Monospace font, often with border styling.

### Sample Output: `<samp>`

The `<samp>` element marks **sample output from a computer program**.

```html
<!-- Terminal output -->
<pre><samp>$ node script.js
Hello, World!
Execution complete</samp></pre>

<!-- Program output in text -->
<p>When you run the script, you'll see
    <samp>Process completed successfully</samp>.</p>

<!-- Error message example -->
<p>If the file isn't found, you'll get:
    <samp>Error: File not found</samp></p>
```

**Rendering**: Monospace font, similar to `<code>`.

### Variable: `<var>`

The `<var>` element marks a **variable, placeholder, or mathematical variable**.

```html
<!-- Mathematical equation -->
<p>The formula is: <var>E</var> = <var>mc</var><sup>2</sup></p>

<!-- Programming variable -->
<p>In the equation <code>x = <var>a</var> + <var>b</var></code>,
    <var>x</var> is the result.</p>

<!-- Placeholder in instructions -->
<p>Navigate to <code>http://example.com/<var>username</var>/profile</code>
    and replace <var>username</var> with your actual username.</p>

<!-- Algebra -->
<p>Solve for <var>x</var>: 2<var>x</var> + 5 = 15</p>
```

**Rendering**: Italic by default.

### Superscript and Subscript: `<sup>` and `<sub>`

**Superscript** (`<sup>`): Raised text above the baseline.

```html
<!-- Mathematical exponents -->
<p>E=mc<sup>2</sup></p>

<!-- Footnote references -->
<p>This is a statement<sup>1</sup> that needs citation.</p>

<!-- Ordinal numbers -->
<p>She finished in 1<sup>st</sup> place.</p>
```

**Subscript** (`<sub>`): Lowered text below the baseline.

```html
<!-- Chemical formulas -->
<p>Water is H<sub>2</sub>O.</p>

<!-- Mathematical subscripts -->
<p>In the sequence, <var>a</var><sub>1</sub>, <var>a</var><sub>2</sub>,
    <var>a</var><sub>n</sub>...</p>

<!-- Footnote anchors -->
<p>Reference to note<sub>1</sub></p>
```

### Bidirectional Override: `<bdo>`

The `<bdo>` element overrides **text direction** for right-to-left or left-to-right text.

```html
<!-- Force left-to-right text -->
<p><bdo dir="ltr">This will display left-to-right</bdo></p>

<!-- Override right-to-left text to left-to-right -->
<p><bdo dir="ltr">مرحبا</bdo></p>

<!-- In mixed-language context -->
<p>English text and <bdo dir="rtl">نص عربي</bdo> mixed.</p>
```

**Use case**: Rare, primarily for mixed-language content needing directional override.

### Inline Quotation: `<q>`

The `<q>` element marks a **short, inline quotation** (not block-level like `<blockquote>`).

```html
<!-- Short quotation -->
<p>The teacher said, <q>Everyone needs to submit their work by Friday.</q></p>

<!-- Quotation with citation -->
<p>Einstein famously said, <q cite="https://example.com">Imagination is more
    important than knowledge.</q></p>

<!-- Nested quotes -->
<p>She said, <q>He told me, <q>I'll be there.</q></q></p>
```

**Browser rendering**: Browsers typically add quotation marks automatically.

**Difference from `<blockquote>`:**

- **`<q>`**: Inline, short quotations (use naturally in text)
- **`<blockquote>`**: Block-level, extended quotations (separate paragraph)

```html
<!-- Short, inline: use q -->
<p>He said <q>hello</q> and waved.</p>

<!-- Extended, separate: use blockquote -->
<blockquote>
    <p>This is a longer quote that spans multiple paragraphs
        and represents an extended passage from a source.</p>
</blockquote>
```

---

## 5.6 Content Grouping: Figure and Figcaption

### Figure: `<figure>`

The `<figure>` element represents **self-contained illustration, diagram, photo, or code snippet with optional caption
**.

```html
<!-- Image with caption -->
<figure>
    <img src="workflow.png" alt="Workflow diagram showing process steps">
    <figcaption>Figure 1: The development workflow</figcaption>
</figure>

<!-- Diagram or illustration -->
<figure>
    <svg width="200" height="200">
        <!-- SVG content -->
    </svg>
    <figcaption>Figure 2: System architecture</figcaption>
</figure>

<!-- Code snippet as figure -->
<figure>
  <pre><code>
function greet(name) {
  console.log("Hello, " + name);
}
  </code></pre>
    <figcaption>Example 1: Simple greeting function</figcaption>
</figure>

<!-- Data table as figure -->
<figure>
    <table>
        <caption>Monthly Sales</caption>
        <tr>
            <th>Month</th>
            <th>Sales</th>
        </tr>
        <tr>
            <td>January</td>
            <td>$50,000</td>
        </tr>
    </table>
    <figcaption>Table 1: Q1 sales data</figcaption>
</figure>
```

### Figcaption: `<figcaption>`

The `<figcaption>` element provides a **caption or legend for a `<figure>`**.

```html
<!-- Caption inside figure -->
<figure>
    <img src="photo.jpg" alt="Team photo">
    <figcaption>The development team at our 2024 retreat</figcaption>
</figure>

<!-- Complex figure with detailed caption -->
<figure>
    <img src="graph.png" alt="Revenue growth chart">
    <figcaption>
        <strong>Figure 3:</strong> Annual revenue growth from 2020-2024.
        The chart shows steady growth with a significant spike in Q3 2024.
    </figcaption>
</figure>

<!-- Multiple images in one figure -->
<figure>
    <img src="before.jpg" alt="Before renovation">
    <img src="after.jpg" alt="After renovation">
    <figcaption>Kitchen renovation completed in March 2024</figcaption>
</figure>
```

**Figcaption position:**

- Can be first or last child of `<figure>`
- Usually positioned at bottom (visually and semantically)

```html
<!-- Caption at top -->
<figure>
    <figcaption>Early prototype design</figcaption>
    <img src="prototype.jpg" alt="Prototype">
</figure>

<!-- Caption at bottom (more common) -->
<figure>
    <img src="prototype.jpg" alt="Prototype">
    <figcaption>Early prototype design</figcaption>
</figure>
```

---

## 5.7 Heading Usage and Hierarchy Revisited

### Complete Heading Structure Example

```html

<body>
<h1>Site Title: Web Development Guide</h1>
<!-- Only one h1 per page -->

<h2>Introduction to HTML</h2>
<p>Content about HTML...</p>

<h2>HTML Document Structure</h2>
<section>
    <h3>The Head Element</h3>
    <p>Content about head...</p>

    <h4>Metadata Tags</h4>
    <p>Content about metadata...</p>

    <h4>Linking External Resources</h4>
    <p>Content about linking...</p>
</section>

<section>
    <h3>The Body Element</h3>
    <p>Content about body...</p>
</section>

<h2>Semantic Elements</h2>
<section>
    <h3>Landmark Elements</h3>
    <p>Content about landmarks...</p>
</section>
</body>
```

**Screen reader outline:**

```
1. Site Title: Web Development Guide
  1.1. Introduction to HTML
  1.2. HTML Document Structure
    1.2.1. The Head Element
      1.2.1.1. Metadata Tags
      1.2.1.2. Linking External Resources
    1.2.2. The Body Element
  1.3. Semantic Elements
    1.3.1. Landmark Elements
```

---

## Summary: Section 5 Key Takeaways

- ✅ **Text elements convey semantic meaning** (not just visual styling)
- ✅ **`<strong>`** = importance/urgency (semantic)
- ✅ **`<b>`** = bold styling without semantic meaning (visual only)
- ✅ **`<em>`** = stress emphasis (changes meaning)
- ✅ **`<i>`** = italic styling without emphasis (visual only - foreign words, titles, alternate voice)
- ✅ **`<p>`** for paragraphs, `<br>` for line breaks (not spacing)
- ✅ **`<pre>`** preserves whitespace and line breaks exactly
- ✅ **`<blockquote>`** for extended quotations with `cite` attribute
- ✅ **`<figure>` and `<figcaption>`** for self-contained illustrations
- ✅ **`<del>` and `<ins>`** for tracked revisions with `datetime` and `cite`
- ✅ **`<dfn>`** for term definitions, `<kbd>` for keyboard input, `<samp>` for output
- ✅ **`<time datetime="...">`** with machine-readable ISO 8601 format
- ✅ **Headings create document outline** accessible to screen readers

- ❌ **Never**: Use styling elements (b, i) when semantic elements (strong, em) apply
- ❌ **Never**: Use `<br>` for spacing (use CSS margins)
- ❌ **Never**: Use `<hr>` for visual decoration (use CSS borders)
- ❌ **Never**: Skip heading levels (h1 → h2 → h3, not h1 → h3)
- ❌ **Never**: Use `<cite>` for author names (use plain text or `<footer>`)

---

## Links & Resources

- [MDN: Text Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN: em vs strong](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)
- [MDN: Quotations](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote)
- [HTML Living Standard: Text-level semantics](https://html.spec.whatwg.org/multipage/text-level-semantics.html)
- [WCAG: Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)

---

# 6. List Elements

## 6.1 Unordered Lists: `<ul>` and `<li>`

An **unordered list** (`<ul>`) represents a collection of items **without specific order or sequence**. Items are marked
with bullets by default.

### Basic Unordered List

```html
<!-- Simple unordered list -->
<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>
```

**Browser rendering**: Displays as bulleted list

```
• First item
• Second item
• Third item
```

### List Item: `<li>`

The `<li>` element represents a **list item**. Must be a direct child of `<ul>`, `<ol>`, or `<menu>`.

```html
<!-- List items -->
<ul>
    <li>Apples</li>
    <li>Oranges</li>
    <li>Bananas</li>
</ul>

<!-- List items can contain block elements -->
<ul>
    <li>
        <h3>First Topic</h3>
        <p>Description of the topic</p>
    </li>
    <li>
        <h3>Second Topic</h3>
        <p>Description of the topic</p>
    </li>
</ul>

<!-- List items can contain inline elements -->
<ul>
    <li>Item with <strong>emphasis</strong></li>
    <li>Item with <em>italic text</em></li>
    <li>Item with a <a href="/page">link</a></li>
</ul>
```

### Common Uses for Unordered Lists

```html
<!-- Navigation menu (semantic alternative to divs) -->
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Feature list -->
<ul>
    <li>Fast performance</li>
    <li>Easy to use</li>
    <li>Fully responsive</li>
    <li>SEO optimized</li>
</ul>

<!-- Ingredients in a recipe -->
<h3>Ingredients</h3>
<ul>
    <li>2 cups flour</li>
    <li>1 cup sugar</li>
    <li>3 eggs</li>
    <li>1 teaspoon vanilla</li>
</ul>

<!-- Checklist (semantic, styled with CSS) -->
<ul>
    <li>Complete project proposal</li>
    <li>Get team approval</li>
    <li>Schedule kickoff meeting</li>
    <li>Begin development</li>
</ul>
```

### List Styling with CSS

```html

<ul style="list-style-type: none;">  <!-- No bullets -->
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ul style="list-style-type: square;">  <!-- Square bullets -->
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ul style="list-style-type: disc;">  <!-- Default circles -->
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
```

---

## 6.2 Ordered Lists: `<ol>` and `<li>`

An **ordered list** (`<ol>`) represents a collection of items **in a specific sequence or priority**.

### Basic Ordered List

```html
<!-- Numbered list (default) -->
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>
```

**Browser rendering**: Displays as numbered list

```
1. First step
2. Second step
3. Third step
```

### List Attributes

#### `type` — Number Format

Controls how items are numbered:

```html
<!-- 1, 2, 3 (default) -->
<ol type="1">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ol>

<!-- a, b, c (lowercase letters) -->
<ol type="a">
    <li>Item a</li>
    <li>Item b</li>
    <li>Item c</li>
</ol>

<!-- A, B, C (uppercase letters) -->
<ol type="A">
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
</ol>

<!-- i, ii, iii (lowercase Roman numerals) -->
<ol type="i">
    <li>Item i</li>
    <li>Item ii</li>
    <li>Item iii</li>
</ol>

<!-- I, II, III (uppercase Roman numerals) -->
<ol type="I">
    <li>Item I</li>
    <li>Item II</li>
    <li>Item III</li>
</ol>
```

#### `start` — Starting Number

Specifies the starting number (must be an integer):

```html
<!-- Start at 5 instead of 1 -->
<ol start="5">
    <li>Fifth item</li>
    <li>Sixth item</li>
    <li>Seventh item</li>
</ol>

<!-- Renders as: 5. 6. 7. -->

<!-- Start with custom type -->
<ol type="a" start="3">
    <li>Third item (c)</li>
    <li>Fourth item (d)</li>
    <li>Fifth item (e)</li>
</ol>

<!-- Renders as: c. d. e. -->
```

#### `reversed` — Countdown Order

Lists items in **reverse order** (countdown). A boolean attribute (no value needed).

```html
<!-- Countdown list -->
<ol reversed>
    <li>Launch</li>
    <li>Final checks</li>
    <li>Testing</li>
    <li>Development</li>
    <li>Planning</li>
</ol>

<!-- Renders as: 5. 4. 3. 2. 1. -->

<!-- Combined with start -->
<ol reversed start="10">
    <li>Number 10</li>
    <li>Number 9</li>
    <li>Number 8</li>
</ol>

<!-- Renders as: 10. 9. 8. -->
```

### Common Uses for Ordered Lists

```html
<!-- Step-by-step instructions -->
<h3>How to Make Coffee</h3>
<ol>
    <li>Boil water</li>
    <li>Grind coffee beans</li>
    <li>Pour hot water over grounds</li>
    <li>Wait 4 minutes</li>
    <li>Enjoy</li>
</ol>

<!-- Rankings or priorities -->
<h3>Top 5 Most Visited Countries</h3>
<ol>
    <li>France</li>
    <li>Spain</li>
    <li>United States</li>
    <li>Italy</li>
    <li>Turkey</li>
</ol>

<!-- Timeline or milestones -->
<h3>Project Timeline</h3>
<ol>
    <li>Phase 1: Discovery (Weeks 1-2)</li>
    <li>Phase 2: Design (Weeks 3-4)</li>
    <li>Phase 3: Development (Weeks 5-8)</li>
    <li>Phase 4: Testing (Weeks 9-10)</li>
    <li>Phase 5: Launch (Week 11)</li>
</ol>

<!-- Legal/numbered requirements -->
<h3>Terms and Conditions</h3>
<ol>
    <li>User agrees to terms...</li>
    <li>Liability limitations...</li>
    <li>Intellectual property rights...</li>
</ol>
```

---

## 6.3 Nested Lists: Multi-Level Structure

Lists can be **nested inside other lists** to create hierarchical structures.

### Nested List Example

```html
<!-- Outline with nested lists -->
<ol>
    <li>Introduction
        <ol>
            <li>Background</li>
            <li>Problem Statement</li>
            <li>Objectives</li>
        </ol>
    </li>
    <li>Methodology
        <ol>
            <li>Research Design</li>
            <li>Data Collection</li>
            <li>Analysis Methods</li>
        </ol>
    </li>
    <li>Results
        <ol>
            <li>Findings</li>
            <li>Key Insights</li>
        </ol>
    </li>
</ol>
```

**Browser rendering:**

```
1. Introduction
   1. Background
   2. Problem Statement
   3. Objectives
2. Methodology
   1. Research Design
   2. Data Collection
   3. Analysis Methods
3. Results
   1. Findings
   2. Key Insights
```

### Mixed List Types (Ordered + Unordered)

```html
<!-- Ordered main topics with unordered subtopics -->
<ol>
    <li>Web Development
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
        </ul>
    </li>
    <li>Backend Development
        <ul>
            <li>Node.js</li>
            <li>Python</li>
            <li>Java</li>
        </ul>
    </li>
    <li>DevOps
        <ul>
            <li>Docker</li>
            <li>Kubernetes</li>
            <li>CI/CD</li>
        </ul>
    </li>
</ol>
```

### Deeply Nested Lists

```html
<!-- Multiple nesting levels -->
<ol>
    <li>Topic 1
        <ol>
            <li>Subtopic 1.1
                <ol>
                    <li>Detail 1.1.1</li>
                    <li>Detail 1.1.2</li>
                </ol>
            </li>
            <li>Subtopic 1.2</li>
        </ol>
    </li>
    <li>Topic 2</li>
</ol>
```

---

## 6.4 Description Lists: `<dl>`, `<dt>`, and `<dd>`

A **description list** (`<dl>`) associates terms with descriptions or definitions.

### Basic Description List

```html
<!-- Term with definition -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language, the standard markup language for web pages</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets, used to style and layout web pages</dd>

    <dt>JavaScript</dt>
    <dd>A programming language that adds interactivity to web pages</dd>
</dl>
```

**Browser rendering:**

```
HTML
    HyperText Markup Language, the standard markup language for web pages
CSS
    Cascading Style Sheets, used to style and layout web pages
JavaScript
    A programming language that adds interactivity to web pages
```

### Multiple Definitions Per Term

A single `<dt>` can have multiple `<dd>` elements:

```html
<!-- Term with multiple definitions/translations -->
<dl>
    <dt>Color</dt>
    <dd>The property of objects that depends on the light they reflect</dd>
    <dd>In American English spelling</dd>

    <dt>Colour</dt>
    <dd>The property of objects that depends on the light they reflect</dd>
    <dd>In British English spelling</dd>
</dl>

<!-- Word with multiple meanings -->
<dl>
    <dt>Bank</dt>
    <dd>A financial institution that handles money and credit</dd>
    <dd>The slope of land beside a river or stream</dd>
    <dd>A row or series of objects arranged closely together</dd>
</dl>
```

### Multiple Terms with Same Definition

Multiple `<dt>` elements can precede one `<dd>`:

```html
<!-- Synonyms with shared definition -->
<dl>
    <dt>Synonyms</dt>
    <dt>Similar Words</dt>
    <dt>Related Terms</dt>
    <dd>Words that have nearly identical meanings and can often be used interchangeably</dd>
</dl>

<!-- Alternative forms of same term -->
<dl>
    <dt>Color</dt>
    <dt>Colour</dt>
    <dd>The visual property of objects based on light reflection</dd>
</dl>
```

### Common Uses for Description Lists

```html
<!-- Glossary -->
<h2>Web Development Glossary</h2>
<dl>
    <dt>API</dt>
    <dd>Application Programming Interface - a set of rules for software communication</dd>

    <dt>CDN</dt>
    <dd>Content Delivery Network - a network of servers that deliver content efficiently</dd>

    <dt>DOM</dt>
    <dd>Document Object Model - the browser's representation of HTML as objects</dd>
</dl>

<!-- Key-value pairs (metadata) -->
<dl>
    <dt>Author</dt>
    <dd>Jane Doe</dd>

    <dt>Published</dt>
    <dd>March 18, 2024</dd>

    <dt>Category</dt>
    <dd>Web Development</dd>
</dl>

<!-- FAQ format -->
<dl>
    <dt>How long does shipping take?</dt>
    <dd>Standard shipping takes 5-7 business days.</dd>

    <dt>Do you offer returns?</dt>
    <dd>Yes, we offer 30-day returns for all products.</dd>

    <dt>What's your return policy?</dt>
    <dd>Items must be in original condition with all packaging.</dd>
</dl>

<!-- Contact information -->
<dl>
    <dt>Email</dt>
    <dd><a href="mailto:info@example.com">info@example.com</a></dd>

    <dt>Phone</dt>
    <dd><a href="tel:+1234567890">+1 (234) 567-8900</a></dd>

    <dt>Office</dt>
    <dd>123 Main Street, New York, NY 10001</dd>
</dl>
```

---

## 6.5 List Accessibility and Semantics

### Lists and Screen Readers

Screen readers announce list structure:

```html

<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>

<!-- Screen reader announces:
  "List with 3 items"
  "First item"
  "Second item"
  "Third item"
-->
```

**Benefits for screen reader users:**

- Announces number of items in list
- Allows jumping between list items
- Enables skipping entire list if desired
- Clear indication of list structure

### Navigation Lists

```html
<!-- Proper semantic list for navigation -->
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Screen reader announces:
  "Navigation landmark"
  "List with 3 items"
  "Home link"
  "About link"
  "Contact link"
-->
```

### Removing List Styling with CSS

Lists can be visually unstyled while maintaining semantic structure:

```html
<!-- Styled as buttons, but semantically a list -->
<nav>
    <ul style="list-style: none; padding: 0; display: flex; gap: 10px;">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Still announces as list to screen readers -->
```

---

## 6.6 Common List Mistakes

### Mistake 1: Not Using Semantic List Elements

```html
<!-- ✗ WRONG: Using div and links instead of list -->
<div class="navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</div>

<!-- ✓ CORRECT: Using semantic list -->
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

**Impact**: Without semantic list, screen readers can't announce list structure or count items.

### Mistake 2: Using List for Layout

```html
<!-- ✗ WRONG: Using list for CSS layout -->
<ul style="display: grid; grid-template-columns: repeat(3, 1fr);">
    <li><img src="image1.jpg"></li>
    <li><img src="image2.jpg"></li>
    <li><img src="image3.jpg"></li>
</ul>

<!-- ✓ BETTER: Use div for layout -->
<div style="display: grid; grid-template-columns: repeat(3, 1fr);">
    <img src="image1.jpg" alt="">
    <img src="image2.jpg" alt="">
    <img src="image3.jpg" alt="">
</div>
```

**Reason**: Use list semantics only when content is actually a list.

### Mistake 3: Skipping List Item Levels

```html
<!-- ✗ WRONG: Nested list outside li -->
<ol>
    <li>First item</li>
    <ol>  <!-- Wrong: ol should be inside li -->
        <li>Nested item</li>
    </ol>
    <li>Second item</li>
</ol>

<!-- ✓ CORRECT: Nested list inside li -->
<ol>
    <li>First item
        <ol>
            <li>Nested item</li>
        </ol>
    </li>
    <li>Second item</li>
</ol>
```

### Mistake 4: Putting Block Elements Directly in `<ul>`/`<ol>`

```html
<!-- ✗ WRONG: Block elements not in li -->
<ul>
    <section>Content</section>  <!-- Must be in li -->
    <article>Content</article>
</ul>

<!-- ✓ CORRECT: Block elements inside li -->
<ul>
    <li>
        <section>Content</section>
    </li>
    <li>
        <article>Content</article>
    </li>
</ul>
```

### Mistake 5: Using Description List Incorrectly

```html
<!-- ✗ WRONG: Using dl for two-column layout -->
<dl>
    <dt>Name</dt>
    <dd>John</dd>
    <dt>Age</dt>
    <dd>30</dd>
    <dt>City</dt>
    <dd>New York</dd>
</dl>

<!-- Use dl ONLY for terms and definitions -->

<!-- ✓ CORRECT: Using dl for actual glossary -->
<dl>
    <dt>Responsive Design</dt>
    <dd>Web design that adapts to different screen sizes</dd>

    <dt>API</dt>
    <dd>Application Programming Interface for software communication</dd>
</dl>
```

---

## 6.7 List Semantics Summary

### When to Use Each List Type

| List Type | Use For                             | Example                           |
|-----------|-------------------------------------|-----------------------------------|
| `<ul>`    | Unordered items, no sequence        | Features, ingredients, navigation |
| `<ol>`    | Ordered items, specific sequence    | Steps, rankings, timelines        |
| `<dl>`    | Terms with definitions/descriptions | Glossary, FAQs, metadata          |

### Complete List Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Web Development Guide</title>
</head>
<body>

<h1>Web Development</h1>

<!-- Unordered list of technologies -->
<h2>Technologies to Learn</h2>
<ul>
    <li>HTML - Markup language</li>
    <li>CSS - Styling and layout</li>
    <li>JavaScript - Interactivity</li>
</ul>

<!-- Ordered list of learning steps -->
<h2>Learning Path</h2>
<ol>
    <li>Learn HTML fundamentals</li>
    <li>Master CSS styling</li>
    <li>Understand JavaScript basics</li>
    <li>Build a simple website</li>
    <li>Learn responsive design</li>
    <li>Explore frameworks (React, Vue)</li>
</ol>

<!-- Description list for glossary -->
<h2>Glossary</h2>
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - standard markup for web pages</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets - controls visual presentation</dd>

    <dt>JavaScript</dt>
    <dd>Programming language that adds interactivity to web pages</dd>
</dl>

<!-- Nested lists for complex structure -->
<h2>Frontend Tools</h2>
<ul>
    <li>IDEs
        <ul>
            <li>VS Code</li>
            <li>WebStorm</li>
            <li>Sublime Text</li>
        </ul>
    </li>
    <li>Frameworks
        <ul>
            <li>React</li>
            <li>Vue</li>
            <li>Angular</li>
        </ul>
    </li>
    <li>Build Tools
        <ul>
            <li>Webpack</li>
            <li>Vite</li>
            <li>Parcel</li>
        </ul>
    </li>
</ul>

</body>
</html>
```

---

## Summary: Section 6 Key Takeaways

- ✅ **`<ul>`** for unordered items (bullets, no sequence)
- ✅ **`<ol>`** for ordered items (numbered, specific sequence)
- ✅ **`<li>`** required as direct child of `<ul>`, `<ol>`, or `<menu>`
- ✅ **`<dl>`, `<dt>`, `<dd>`** for terms and definitions (glossary, FAQ)
- ✅ **`reversed` attribute** on `<ol>` for countdown
- ✅ **`start` attribute** on `<ol>` for custom starting number
- ✅ **`type` attribute** on `<ol>` for number format (1, a, A, i, I)
- ✅ **Nested lists** create hierarchical structures (nested list inside `<li>`)
- ✅ **Multiple `<dd>` per `<dt>`** for multiple definitions
- ✅ **Multiple `<dt>` per `<dd>`** for synonyms or alternatives
- ✅ **Lists improve accessibility** - screen readers announce structure and item count
- ✅ **Semantic lists preferred** - use `<ul>`, `<ol>`, `<dl>` instead of `<div>` + styling
- ❌ **Never**: Put nested list outside of `<li>`
- ❌ **Never**: Use list for layout (use `<div>` instead)
- ❌ **Never**: Put block elements directly in `<ul>`/`<ol>` (must be in `<li>`)
- ❌ **Never**: Use `<dl>` for non-definition-related content
- ❌ **Never**: Skip list structure for visual styling (lists provide accessibility benefits)

---

## Links & Resources

- [MDN: Lists](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)
- [MDN: Ordered Lists](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
- [MDN: Description Lists](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)
- [HTML Living Standard: Lists](https://html.spec.whatwg.org/multipage/grouping-content.html)
- [WCAG: Lists](https://www.w3.org/WAI/tutorials/page-structure/lists/)
- [WebAIM: Semantic Markup](https://webaim.org/articles/semanticHTML/)

---

# 7. Links and Navigation

## 7.1 The Anchor Element: `<a>`

The **anchor** (`<a>`) element creates a **hyperlink** to other pages, resources, or locations within the current page.

### Basic Link Syntax

```html
<!-- Simple link -->
<a href="https://example.com">Click here</a>

<!-- Link with descriptive text -->
<a href="/about">Learn more about us</a>

<!-- Link opening in new tab -->
<a href="https://example.com" target="_blank">Visit external site</a>

<!-- Link to page section -->
<a href="#section-two">Jump to Section Two</a>
```

### The `href` Attribute

The **`href`** (hypertext reference) attribute specifies the **link destination**. Supports multiple URL formats:

#### Absolute URLs (Complete Path)

```html
<!-- Full URL with protocol -->
<a href="https://www.example.com/page">Link</a>
<a href="http://www.example.com/page">Link (HTTP - avoid)</a>

<!-- With port number -->
<a href="https://example.com:8080/page">Link</a>

<!-- With query parameters -->
<a href="https://example.com/search?q=html&sort=date">Search results</a>

<!-- With fragment/anchor -->
<a href="https://example.com/page#section">Link to section</a>
```

#### Relative URLs (Path Relative to Current Page)

```html
<!-- Same directory -->
<a href="about.html">About page</a>

<!-- Subdirectory -->
<a href="pages/contact.html">Contact</a>

<!-- Parent directory -->
<a href="../index.html">Home</a>

<!-- Root-relative (from site root) -->
<a href="/about">About page</a>
<a href="/pages/contact.html">Contact</a>

<!-- Protocol-relative URL (uses same protocol as current page) -->
<a href="//example.com/page">Link</a>
<!-- If on https://mysite.com, loads https://example.com/page -->
<!-- If on http://mysite.com, loads http://example.com/page -->
```

#### Fragment Identifiers (Jump to Page Section)

```html
<!-- Jump to element with matching id -->
<a href="#introduction">Go to introduction</a>
<a href="#faqs">Jump to FAQs</a>

<!-- Jump to section on another page -->
<a href="/about#our-team">Our team section</a>
<a href="https://example.com/page#section">External page section</a>

<!-- Link to top of page -->
<a href="#top">Back to top</a>
```

#### Special URL Schemes

**Email Links** (`mailto:`)

```html
<!-- Simple email link -->
<a href="mailto:contact@example.com">Email us</a>

<!-- With subject and body -->
<a href="mailto:contact@example.com?subject=Inquiry&body=Hello%20there">
    Contact us
</a>

<!-- Multiple recipients -->
<a href="mailto:contact@example.com?cc=info@example.com">Email us</a>

<!-- In footer -->
<footer>
    <p>Email: <a href="mailto:support@example.com">support@example.com</a></p>
</footer>
```

**Telephone Links** (`tel:`)

```html
<!-- Click to call on mobile -->
<a href="tel:+1234567890">Call us: +1 (234) 567-8900</a>

<!-- With extension -->
<a href="tel:+1234567890p123">Call sales extension</a>

<!-- In contact card -->
<address>
    <p>Phone: <a href="tel:+14155552671">+1 (415) 555-2671</a></p>
</address>
```

**Data URLs** (`data:`)

```html
<!-- Inline image as data URL -->
<a href="data:text/plain;base64,SGVsbG8gV29ybGQ=">
    Link with embedded data
</a>

<!-- Download file with data URL -->
<a href="data:text/csv;base64,bmFtZSxhZ2UKSm9obiwzMApKYW5lLDI4"
   download="data.csv">
    Download CSV
</a>
```

**JavaScript URLs** (`javascript:`) - ⚠️ Avoid

```html
<!-- ✗ NOT RECOMMENDED: JavaScript in href -->
<a href="javascript:alert('Hello')">Click me</a>

<!-- ✓ CORRECT: Use onclick or addEventListener instead -->
<a href="#" onclick="handleClick(); return false;">Click me</a>
<!-- Or better: -->
<button onclick="handleClick()">Click me</button>
```

---

## 7.2 Link Target and Window Behavior

The **`target`** attribute controls **where the link opens** (current window, new tab, etc.).

### Target Values

#### `_self` (Default)

```html
<!-- Opens in same window/tab (default behavior) -->
<a href="/page" target="_self">Link</a>

<!-- Equivalent to: -->
<a href="/page">Link</a>
```

#### `_blank`

```html
<!-- Opens in new tab/window -->
<a href="https://example.com" target="_blank">Visit external site</a>

<!-- When to use: External links, potentially unreliable sources -->
```

#### `_parent`

```html
<!-- Opens in parent frame (used with framesets - deprecated) -->
<a href="/page" target="_parent">Link</a>
```

#### `_top`

```html
<!-- Opens in topmost frame (used with framesets - deprecated) -->
<a href="/page" target="_top">Link</a>
```

### Security: The Tabnabbing Attack

When using `target="_blank"`, **always add security attributes** to prevent malicious sites from accessing your page.

#### The Problem: Tabnabbing

```html
<!-- ✗ DANGEROUS: External link with target="_blank" -->
<a href="https://untrusted-site.com" target="_blank">
    Visit external site
</a>

<!-- PROBLEM:
  1. User clicks link, external site opens in new tab
  2. External site has access to window.opener JavaScript API
  3. Malicious site can redirect your page to phishing site
  4. User returns to what looks like your site, but it's fake
  5. User enters credentials on fake site
-->
```

#### The Solution: Security Attributes

```html
<!-- ✓ SAFE: Using rel with noopener and noreferrer -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
    Visit external site
</a>

<!-- noopener: Prevents window.opener access (security) -->
<!-- noreferrer: Doesn't send referrer info (privacy) + implies noopener -->
```

#### When to Use Each

```html
<!-- External third-party sites: Use both noopener and noreferrer -->
<a href="https://untrusted-site.com" target="_blank" rel="noopener noreferrer">
    Link
</a>

<!-- Your own external property: noopener is sufficient -->
<a href="https://blog.example.com" target="_blank" rel="noopener">
    Our blog
</a>

<!-- Same-site links: No need for target="_blank" -->
<a href="/about">About page</a>

<!-- If same-site must open in new tab: Use noopener -->
<a href="/terms" target="_blank" rel="noopener">
    Terms of Service
</a>
```

### Browser Default Behavior (Modern)

Modern browsers (Chrome 88+, Firefox 79+, Safari 13.1+) add `noopener` by default when using `target="_blank"`, but *
*explicitly declaring it is still best practice** for compatibility.

---

## 7.3 The `rel` Attribute: Link Relationship

The **`rel`** attribute describes the **relationship between the current page and the linked resource**.

### Common `rel` Values

#### Document Relationships

| Value        | Purpose                     | Example                                                  |
|--------------|-----------------------------|----------------------------------------------------------|
| `stylesheet` | Link to CSS stylesheet      | `<link rel="stylesheet" href="styles.css">`              |
| `alternate`  | Alternative version of page | `<link rel="alternate" hreflang="es" href="/es/">`       |
| `canonical`  | Preferred URL for SEO       | `<link rel="canonical" href="https://example.com/page">` |
| `author`     | Link to author info         | `<a rel="author" href="/author">Author</a>`              |
| `help`       | Link to help document       | `<a rel="help" href="/help">Help</a>`                    |
| `license`    | Link to license             | `<a rel="license" href="/license">License</a>`           |
| `next`       | Next page in sequence       | `<link rel="next" href="/page2">`                        |
| `prev`       | Previous page in sequence   | `<link rel="prev" href="/page1">`                        |

#### Social and Sharing

| Value    | Purpose                  | Example                                                       |
|----------|--------------------------|---------------------------------------------------------------|
| `me`     | Link to author's profile | `<a rel="me" href="https://twitter.com/username">Twitter</a>` |
| `friend` | Author is a friend       | `<a rel="friend" href="/friend-blog">Friend's blog</a>`       |

#### Security and Performance

| Value        | Purpose                        | Security   | Performance |
|--------------|--------------------------------|------------|-------------|
| `noopener`   | Prevent window.opener access   | ✅ Security | Minimal     |
| `noreferrer` | Don't send referrer + noopener | ✅ Privacy  | Minimal     |
| `external`   | Link to external site          | None       | None        |

#### Performance Hints

| Value          | Purpose                                  | Use Case                        |
|----------------|------------------------------------------|---------------------------------|
| `prefetch`     | Load resource when idle (lower priority) | Pages likely to be visited next |
| `preload`      | Load resource now (higher priority)      | Critical resources              |
| `dns-prefetch` | Resolve DNS ahead of time                | Third-party domains you'll use  |
| `preconnect`   | Establish connection ahead of time       | Third-party APIs/CDNs           |

### Performance: Resource Hints

```html
<!-- DNS Prefetch: Resolve domain name in advance -->
<link rel="dns-prefetch" href="//example.com">

<!-- Preconnect: Open connection to external domain -->
<!-- Includes DNS, TCP, and TLS handshake -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Prefetch: Download resource when browser is idle -->
<!-- Lower priority, used for likely next page -->
<link rel="prefetch" href="/likely-next-page.html">

<!-- Preload: Download resource now, high priority -->
<!-- Used for critical resources on current page -->
<link rel="preload" href="fonts/custom-font.woff2" as="font" crossorigin>

<!-- Typical pattern: Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700">
```

### Multiple `rel` Values

```html
<!-- Multiple relationship types (space-separated) -->
<a href="https://untrusted-external.com"
   target="_blank"
   rel="noopener noreferrer external">
    External link
</a>

<!-- Performance + Security -->
<link rel="dns-prefetch" href="//example.com">

<!-- Semantic + Security -->
<a href="https://other-site.com"
   target="_blank"
   rel="author noopener noreferrer">
    Author profile
</a>
```

---

## 7.4 Accessible Links: Best Practices

### Link Text Clarity

Links should have **descriptive text** that explains the destination or action.

#### Good Link Text

```html
<!-- ✓ CLEAR: Describes destination -->
<a href="/about">Learn about our company</a>

<!-- ✓ CLEAR: Describes action -->
<a href="/download">Download the PDF</a>

<!-- ✓ CLEAR: Context from surrounding text -->
<p>Read our <a href="/blog/html-guide">complete HTML guide</a> for details.</p>

<!-- ✓ CLEAR: Form submission -->
<a href="/search?q=html">Search results for "html"</a>
```

#### Vague Link Text (Avoid)

```html
<!-- ✗ UNCLEAR: No context -->
<a href="/page">Click here</a>

<!-- ✗ UNCLEAR: Repetitive -->
<a href="/page1">Link</a>
<a href="/page2">Link</a>
<a href="/page3">Link</a>

<!-- ✗ UNCLEAR: "Read more" without context -->
<p>Article title... <a href="/article">Read more</a></p>

<!-- ✗ UNCLEAR: URL as link text -->
<a href="https://example.com">https://example.com</a>
```

#### Screen Reader Experience

```html
<!-- Screen reader announces: "Learn about our company" -->
<a href="/about">Learn about our company</a>

<!-- Screen reader announces: "Click here" (unhelpful!) -->
<a href="/page">Click here</a>

<!-- Screen reader announces:
     "Search results for 'html', link" (helpful) -->
<a href="/search?q=html">Search results for "html"</a>
```

### Skip Links: Bypass Repetitive Content

```html

<body>
<!-- Skip link at top of page (usually hidden visually) -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Navigation repeated on every page -->
<header>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
    </nav>
</header>

<!-- Main content -->
<main id="main-content">
    <h1>Page Title</h1>
    <p>Page content...</p>
</main>
</body>

<style>
    /* Hide skip link visually but keep for screen readers */
    .skip-link {
        position: absolute;
        left: -9999px;
    }

    /* Show on focus (keyboard navigation) -->
    .skip-link:focus {
      position: static;
    }
</style>
```

### Link Titles: Use Sparingly

The **`title`** attribute shows a tooltip on hover but **is invisible to keyboard users** and unreliable on mobile.

```html
<!-- ✓ OK: Title adds helpful detail -->
<a href="/download" title="PDF, 2.5 MB">Download the guide</a>

<!-- ✗ WRONG: Title contains essential information -->
<a href="/page" title="This page explains X">Link</a>
<!-- Should be in link text instead: -->
<a href="/page">Learn about X</a>

<!-- ✗ WRONG: Duplicating link text -->
<a href="/about" title="About us">About us</a>
<!-- Redundant - title and text are identical -->
```

**Better approach**: Include important information in the link text, not the title.

---

## 7.5 Visited Link Styling: CSS Limitations

The **`:visited`** CSS pseudo-class styles links the user has visited. **Browsers restrict what properties can be
changed** for security.

### Allowed Properties (Limited)

```css
/* ✓ ALLOWED: These properties can be styled on :visited links */
a:visited {
    color: purple; /* Color change (common) */
    background-color: #f0f0f0; /* Background color */
    border-color: gray; /* Border color */
    outline-color: gray; /* Outline color */
}

/* ✗ NOT ALLOWED: These are blocked for security (can't detect visited sites via CSS) */
a:visited {
    display: none; /* BLOCKED */
    visibility: hidden; /* BLOCKED */
    width: 200px; /* BLOCKED */
    background-image: url("https://example.com"); /* BLOCKED */
    font-size: 20px; /* BLOCKED */
}
```

**Why the restrictions?** To prevent malicious sites from detecting which sites you've visited via CSS.

### Good Visited Link Pattern

```html

<style>
    /* Default (unvisited) link -->
    a {
      color: blue;
      text-decoration: underline;
    }
    
    /* Visited link (subtle change) -->
    a:visited {
      color: purple;
    }
    
    /* Hover state (applies to both visited and unvisited) -->
    a:hover {
      background-color: yellow;
    }
    
    /* Focus state (keyboard navigation) -->
    a:focus {
      outline: 2px solid blue;
    }
</style>

<p><a href="https://www.visited-site.com">Site you've visited</a></p>
<p><a href="https://www.unvisited-site.com">Site you haven't visited</a></p>
```

---

## 7.6 Focus Indicators and Keyboard Navigation

**Keyboard users** navigate using the Tab key. Links must have visible **focus indicators** so users know which element
is focused.

### Focus States

```css
/* Default focus (browser provides, but often changed) */
a:focus {
    outline: 1px solid blue;
}

/* Custom focus indicator */
a:focus-visible { /* :focus-visible is better (only shows on keyboard nav) */
    outline: 3px solid #4A90E2;
    outline-offset: 2px;
}

/* Hover state (doesn't require focus) */
a:hover {
    text-decoration: underline;
    background-color: #f0f0f0;
}
```

### Common Mistakes

```css
/* ✗ WRONG: Removing focus indicator entirely (breaks keyboard nav) */
a:focus {
    outline: none;
}

/* ✓ CORRECT: Replace with custom indicator -->
a:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* ✓ CORRECT: Use :focus-visible (only keyboard) -->
a:focus-visible {
  outline: 2px solid blue;
}
```

### Complete Accessible Link Pattern

```css
a {
    color: #0066cc;
    text-decoration: underline;
    cursor: pointer;
}

a:visited {
    color: #663399;
}

a:hover {
    text-decoration-thickness: 2px;
}

a:focus-visible {
    outline: 3px solid #4A90E2;
    outline-offset: 2px;
    border-radius: 2px;
}

/* Remove focus on mouse click (show only on keyboard nav) */
a:focus:not(:focus-visible) {
    outline: none;
}
```

---

## 7.7 Links vs Buttons: Semantic Distinction

**Links** (`<a>`) and **buttons** (`<button>`) are different elements with different purposes.

### When to Use `<a>` (Link)

Links navigate to **different page, URL, or page section**.

```html
<!-- Navigation -->
<a href="/about">About page</a>

<!-- Section jump -->
<a href="#contact-form">Jump to contact form</a>

<!-- External site -->
<a href="https://example.com">External site</a>

<!-- Email/phone -->
<a href="mailto:contact@example.com">Send email</a>
<a href="tel:+1234567890">Call us</a>

<!-- Download -->
<a href="/files/guide.pdf" download>Download PDF</a>
```

### When to Use `<button>` (Button)

Buttons perform **actions on the current page** (submit form, toggle, etc.).

```html
<!-- Form submission -->
<form>
    <input type="text" name="name">
    <button type="submit">Submit</button>
</form>

<!-- Toggle action -->
<button onclick="toggleMenu()">Show menu</button>

<!-- Increment counter -->
<button onclick="count++">Click me</button>

<!-- Delete action -->
<button onclick="deleteItem(id)">Delete</button>

<!-- Close dialog -->
<button onclick="closeDialog()">Close</button>
```

### Anti-Patterns

```html
<!-- ✗ WRONG: Using link when button is appropriate -->
<a href="#" onclick="toggleMenu()">Show menu</a>
<!-- Should be: -->
<button onclick="toggleMenu()">Show menu</button>

<!-- ✗ WRONG: Using button for navigation -->
<button onclick="window.location = '/about'">About page</button>
<!-- Should be: -->
<a href="/about">About page</a>

<!-- ✗ WRONG: Styled link to look like button, but semantically still a link -->
<a href="/page" class="button-style">Click me</a>
<!-- OK if semantically correct (navigating), but confusing if doing action -->

<!-- ✓ CORRECT: Semantic link styled as button -->
<a href="/download" class="button-style">Download PDF</a>

<!-- ✓ CORRECT: Semantic button styled as link -->
<button class="link-style" onclick="saveData()">Save changes</button>
```

### Accessibility Implications

```html
<!-- Link behavior -->
<a href="/page">Link</a>
<!-- Screen reader: "Link, link" -->
<!-- Keyboard: Enter key activates -->
<!-- ARIA role: implicit "link" role -->

<!-- Button behavior -->
<button>Button</button>
<!-- Screen reader: "Button, button" -->
<!-- Keyboard: Space or Enter key activates -->
<!-- ARIA role: implicit "button" role -->
```

---

## 7.8 The Base Element: Setting Default URL Context

The `<base>` element **sets a base URL for all relative links** in the document.

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <!-- All relative URLs are resolved relative to this base -->
    <base href="https://example.com/app/">
</head>
<body>
<!-- Resolves to: https://example.com/app/about -->
<a href="about">About</a>

<!-- Resolves to: https://example.com/app/contact -->
<a href="contact">Contact</a>

<!-- Absolute URLs unaffected -->
<a href="https://other-site.com">External</a>
</body>
</html>
```

### Common Use Cases

```html
<!-- Single Page Application with hash routing -->
<base href="/">
<!-- Links work with hash-based routing: /#/page1, /#/page2 -->

<!-- Subdirectory deployment -->
<base href="/app/v2/">
<!-- Deployed to subdirectory, all relative links adjusted -->

<!-- Different protocol/domain for API -->
<base href="https://api.example.com/">
<!-- Fetch and link requests use new base URL -->
```

### Important Limitations

- **Only one `<base>` per document**
- **Affects all relative URLs** (links, images, scripts, stylesheets)
- **Can cause confusion** if not clearly documented
- **Modern SPAs** usually don't use `<base>` (use JavaScript routing instead)

```html
<!-- ⚠️ CAREFUL: base affects all resources -->
<base href="https://cdn.example.com/">

<!-- This image loads from: https://cdn.example.com/logo.png -->
<img src="logo.png">

<!-- This stylesheet loads from: https://cdn.example.com/styles.css -->
<link rel="stylesheet" href="styles.css">

<!-- This script loads from: https://cdn.example.com/app.js -->
<script src="app.js"></script>
```

---

## 7.9 Complete Navigation Examples

### Primary Navigation Menu

```html

<header>
    <h1>Site Name</h1>
    <nav aria-label="Primary navigation">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
</header>
```

### Breadcrumb Navigation

```html

<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/products/electronics">Electronics</a></li>
        <li aria-current="page">Laptop</li>
    </ol>
</nav>

<style>
    nav[aria-label="Breadcrumb"] ol {
        list-style: none;
        display: flex;
        gap: 0.5em;
    }

    nav[aria-label="Breadcrumb"] li:not(:last-child)::after {
        content: " / ";
    }
</style>
```

### Footer Navigation

```html

<footer>
    <nav aria-label="Footer">
        <section>
            <h3>Company</h3>
            <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/press">Press</a></li>
            </ul>
        </section>

        <section>
            <h3>Support</h3>
            <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/faq">FAQ</a></li>
            </ul>
        </section>

        <section>
            <h3>Legal</h3>
            <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
        </section>
    </nav>

    <p>&copy; 2024 Company Name. All rights reserved.</p>
</footer>
```

### Pagination Navigation

```html

<nav aria-label="Pagination">
    <ul>
        <li>
            <a href="?page=1" rel="prev">Previous</a>
        </li>
        <li>
            <a href="?page=1">1</a>
        </li>
        <li>
            <a href="?page=2">2</a>
        </li>
        <li aria-current="page">
            <span>3</span>
        </li>
        <li>
            <a href="?page=4">4</a>
        </li>
        <li>
            <a href="?page=5">5</a>
        </li>
        <li>
            <a href="?page=4" rel="next">Next</a>
        </li>
    </ul>
</nav>
```

### Skip Links Pattern

```html

<body>
<!-- Hidden skip link (visible on focus) -->
<a href="#main-content" class="skip-link">
    Skip to main content
</a>

<!-- Header/navigation (repeated on every page) -->
<header>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>
</header>

<!-- Main unique content -->
<main id="main-content">
    <h1>Page Title</h1>
    <p>Page content...</p>
</main>

<footer>Footer content</footer>
</body>

<style>
    .skip-link {
        position: absolute;
        left: -9999px;
        top: 0;
        z-index: 999;
        background: #000;
        color: #fff;
        padding: 0.5em 1em;
        text-decoration: none;
    }

    .skip-link:focus {
        left: 0;
    }
</style>
```

---

## Summary: Section 7 Key Takeaways

- ✅ **`href` supports multiple formats**: absolute URLs, relative URLs, fragments, mailto:, tel:, data: URLs
- ✅ **`target="_blank"`** should always include `rel="noopener noreferrer"` (security)
- ✅ **Tabnabbing attack**: External links with target="_blank" can hijack your page via window.opener
- ✅ **`rel` attribute** describes link relationship (stylesheet, noopener, noreferrer, prefetch, preload, etc.)
- ✅ **Performance hints** (prefetch, preload, dns-prefetch, preconnect) improve resource loading
- ✅ **Link text must be clear** - describe destination or action
- ✅ **Skip links** let keyboard users bypass repetitive navigation
- ✅ **:visited pseudo-class** limited by browsers (only color, background-color, border-color)
- ✅ **Focus indicators required** - visible outline for keyboard navigation
- ✅ **Links navigate**, **buttons perform actions** - use semantic element for each purpose
- ✅ **`<base>` element** sets default URL context for all relative links
- ✅ **Keyboard navigation**: Tab to move between links, Enter to activate

- ❌ **Never**: Use `target="_blank"` without `rel="noopener noreferrer"`
- ❌ **Never**: Remove focus outline (add custom indicator instead)
- ❌ **Never**: Use vague link text ("Click here", "Link", "Read more")
- ❌ **Never**: Use `<a href="#">` for actions (use `<button>` instead)
- ❌ **Never**: Put essential info only in title attribute (use link text)
- ❌ **Never**: Prevent :visited styling with CSS hacks (browsers block them)

---

## Links & Resources

- [MDN: Anchor Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [MDN: Hyperlinks](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks)
- [OWASP: Tabnabbing](https://owasp.org/www-community/attacks/Tabnabbing)
- [MDN: Resource Hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)
- [MDN: Focus Visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
- [WCAG: Link Purpose](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context)
- [WebAIM: Skip Links](https://webaim.org/articles/skipnav/)
- [HTML Living Standard: Links](https://html.spec.whatwg.org/multipage/semantics.html#the-a-element)

---

# 8. Images and Media

## 8.1 The Image Element: `<img>`

The **`<img>`** (void element) embeds an **image** in the page. It requires an `src` attribute (source) and strongly
recommended `alt` attribute (alternative text).

### Basic Image Syntax

```html
<!-- Simple image -->
<img src="photo.jpg" alt="Description of image">

<!-- With dimensions -->
<img src="photo.jpg" alt="Photo" width="800" height="600">

<!-- With CSS class for styling -->
<img src="photo.jpg" alt="Product photo" class="product-image">
```

### Essential Attributes

#### `src` — Image Source (Required)

The **`src`** attribute specifies the **image file location**.

```html
<!-- Absolute URL -->
<img src="https://cdn.example.com/image.jpg" alt="Image">

<!-- Relative URL -->
<img src="images/photo.jpg" alt="Photo">
<img src="../assets/logo.png" alt="Logo">

<!-- Root-relative URL -->
<img src="/images/banner.jpg" alt="Banner">
```

#### `alt` — Alternative Text (Critical for Accessibility)

The **`alt`** attribute provides **text description** shown when image fails to load and read aloud by screen readers.

**Alt text rules:**

```html
<!-- ✓ GOOD: Descriptive alt text for meaningful images -->
<img src="team.jpg" alt="Development team at 2024 company retreat">

<!-- ✓ GOOD: Functional description if image has function -->
<img src="search-icon.png" alt="Search button">

<!-- ✓ GOOD: Empty alt for decorative images -->
<img src="decorative-line.png" alt="">

<!-- ✗ BAD: No alt attribute -->
<img src="photo.jpg">

<!-- ✗ BAD: Filename as alt text -->
<img src="IMG_2024_03_18.jpg" alt="IMG_2024_03_18.jpg">

<!-- ✗ BAD: "Image of" prefix (redundant) -->
<img src="dog.jpg" alt="Image of a dog">
<!-- Better: -->
<img src="dog.jpg" alt="Golden retriever running in park">

<!-- ✗ BAD: Too long (alt text should be concise) -->
<img src="photo.jpg" alt="This is a very long description that explains every detail of the photo including...">
<!-- Better: -->
<img src="photo.jpg" alt="Product demonstration in warehouse">
```

**Decorative vs Informative Images:**

```html
<!-- INFORMATIVE: Image conveys important information -->
<img src="chart.png" alt="Q1 sales increased 25% compared to Q4">

<!-- DECORATIVE: Image is purely visual, no information -->
<img src="decorative-border.png" alt="">
<!-- Use empty alt, not alt="decorative line" -->

<!-- FUNCTIONAL: Image is a button/control -->
<button onclick="search()">
    <img src="search-icon.svg" alt="Search">
</button>
```

#### `width` and `height` — Image Dimensions

Specify image dimensions to **prevent layout shift** when image loads.

```html
<!-- With dimensions (prevents layout shift) -->
<img src="photo.jpg" alt="Photo" width="800" height="600">

<!-- Aspect ratio preserved if only one dimension specified -->
<img src="photo.jpg" alt="Photo" width="400">
<!-- Height automatically adjusted to maintain aspect ratio -->

<!-- CSS can override HTML dimensions -->
<img src="photo.jpg" alt="Photo" width="800" height="600" style="width: 100%; height: auto;">
```

**Why dimensions matter:**

```html
<!-- WITHOUT dimensions: Browser doesn't know image size until loaded -->
<!-- Page layout "jumps" when image appears (poor UX) -->
<img src="large-image.jpg" alt="Image">

<!-- WITH dimensions: Browser reserves space, layout stays stable -->
<img src="large-image.jpg" alt="Image" width="1200" height="800">
<!-- Layout stays stable even if image takes time to load -->
```

#### `loading` — Lazy Loading

Controls whether image loads **immediately** or **when needed**.

```html
<!-- Load immediately (default) -->
<img src="above-fold.jpg" alt="Hero image" loading="eager">

<!-- OR just use default (eager is implicit) -->
<img src="above-fold.jpg" alt="Hero image">

<!-- Load when image approaches viewport (lazy load) -->
<img src="below-fold.jpg" alt="Related product" loading="lazy">

<!-- Common pattern: Lazy load images below fold -->
<article>
    <img src="hero.jpg" alt="Hero" loading="eager">
    <h2>Article Title</h2>
    <p>Content...</p>
    <img src="related-1.jpg" alt="Related" loading="lazy">
    <img src="related-2.jpg" alt="Related" loading="lazy">
    <img src="related-3.jpg" alt="Related" loading="lazy">
</article>
```

**Supported browsers:** Modern browsers (Chrome, Firefox, Safari, Edge all support lazy loading).

---

## 8.2 Responsive Images: `srcset` and `sizes`

Responsive images allow browsers to **download appropriately sized images** based on device and viewport.

### The `srcset` Attribute

Provides **multiple image sources** at different resolutions:

```html
<!-- Image with 1x and 2x versions (for high-DPI screens) -->
<img src="photo.jpg"
     srcset="photo.jpg 1x, photo-2x.jpg 2x"
     alt="Photo">

<!-- Image at different widths -->
<img src="photo-small.jpg"
     srcset="photo-small.jpg 480w, 
             photo-medium.jpg 800w, 
             photo-large.jpg 1200w"
     sizes="100vw"
     alt="Photo">
```

**Width descriptors** (`480w`, `800w`) tell browser the **actual image width**:

```html
<!-- Browser chooses appropriate image based on viewport -->
<img src="photo-small.jpg"
     srcset="photo-small.jpg 480w,    <!-- 480px wide -->
             photo-medium.jpg 800w,   <!-- 800px wide -->
             photo-large.jpg 1200w"   <!-- 1200px wide -->
sizes="(max-width: 600px) 100vw,
(max-width: 1200px) 75vw,
50vw"
alt="Photo">

<!-- Browser logic:
  1. Determine viewport width and device DPI
  2. Check sizes attribute for image width
  3. Pick the smallest image that covers that width + DPI
  4. Example: 768px viewport on 2x DPI device
     - Needs 768 * 2 = 1536px width image
     - Selects photo-large.jpg (1200w) + 2x = 2400px
     - OR photo-large.jpg (1200w) if no 2x
-->
```

### The `sizes` Attribute

Tells browser **how wide the image will be displayed** at different viewports:

```html
<!-- Mobile: 100% width, Tablet: 75% width, Desktop: 50% width -->
<img src="photo.jpg"
     srcset="photo-480w.jpg 480w,
             photo-800w.jpg 800w,
             photo-1200w.jpg 1200w"
     sizes="(max-width: 600px) 100vw,
            (max-width: 1200px) 75vw,
            50vw"
     alt="Photo">

<!-- Simpler: Image always 100% width of container -->
<img src="photo.jpg"
     srcset="photo-480w.jpg 480w,
             photo-800w.jpg 800w,
             photo-1200w.jpg 1200w"
     sizes="100vw"
     alt="Photo">

<!-- No sizes: Defaults to 100vw -->
<img src="photo.jpg"
     srcset="photo-480w.jpg 480w,
             photo-800w.jpg 800w"
     alt="Photo">
```

### Complete Responsive Image Pattern

```html
<!-- Responsive image with proper srcset and sizes -->
<img src="photo-800w.jpg"
     srcset="photo-480w.jpg 480w,
             photo-800w.jpg 800w,
             photo-1200w.jpg 1200w,
             photo-1600w.jpg 1600w"
     sizes="(max-width: 480px) 90vw,
            (max-width: 768px) 80vw,
            (max-width: 1024px) 70vw,
            50vw"
     width="800"
     height="600"
     alt="Product photography">
```

---

## 8.3 The Picture Element: Art Direction

The `<picture>` element allows **art-directed responsive images**—different crops or images at different breakpoints.

### Basic Picture Pattern

```html
<!-- Different image for mobile vs desktop -->
<picture>
    <!-- Mobile: Portrait crop -->
    <source media="(max-width: 600px)" srcset="photo-mobile.jpg">

    <!-- Tablet: Different crop -->
    <source media="(max-width: 1024px)" srcset="photo-tablet.jpg">

    <!-- Desktop: Full wide image -->
    <source media="(min-width: 1025px)" srcset="photo-desktop.jpg">

    <!-- Fallback for browsers that don't support picture -->
    <img src="photo-default.jpg" alt="Photo">
</picture>
```

### Picture with srcset (Combining Art Direction + Responsive Sizing)

```html

<picture>
    <!-- Mobile portrait crop, responsive sizes -->
    <source media="(max-width: 600px)"
            srcset="mobile-small.jpg 320w,
                  mobile-medium.jpg 480w,
                  mobile-large.jpg 640w"
            sizes="90vw">

    <!-- Desktop landscape, responsive sizes -->
    <source media="(min-width: 601px)"
            srcset="desktop-small.jpg 600w,
                  desktop-medium.jpg 1000w,
                  desktop-large.jpg 1400w"
            sizes="70vw">

    <!-- Fallback -->
    <img src="default.jpg" alt="Photo">
</picture>
```

### Format Switching (Modern Image Formats)

```html
<!-- Modern formats first, fallback to JPG -->
<picture>
    <!-- WebP: Modern format, smaller file size -->
    <source srcset="photo.webp" type="image/webp">

    <!-- AVIF: Newer format, even better compression -->
    <source srcset="photo.avif" type="image/avif">

    <!-- JPEG: Fallback for older browsers -->
    <img src="photo.jpg" alt="Photo">
</picture>

<!-- Complete: Art direction + format switching + responsive -->
<picture>
    <!-- Mobile WebP -->
    <source media="(max-width: 600px)"
            srcset="mobile.webp"
            type="image/webp">

    <!-- Mobile AVIF -->
    <source media="(max-width: 600px)"
            srcset="mobile.avif"
            type="image/avif">

    <!-- Mobile JPEG fallback -->
    <source media="(max-width: 600px)"
            srcset="mobile.jpg">

    <!-- Desktop WebP -->
    <source media="(min-width: 601px)"
            srcset="desktop.webp"
            type="image/webp">

    <!-- Desktop AVIF -->
    <source media="(min-width: 601px)"
            srcset="desktop.avif"
            type="image/avif">

    <!-- Desktop JPEG fallback -->
    <source media="(min-width: 601px)"
            srcset="desktop.jpg">

    <!-- Ultimate fallback -->
    <img src="fallback.jpg" alt="Photo">
</picture>
```

---

## 8.4 Image Maps: `<map>` and `<area>`

Image maps allow **clickable regions within a single image**.

### Basic Image Map

```html
<!-- Image with clickable regions -->
<img src="world-map.jpg" alt="World map" usemap="#worldmap">

<!-- Define clickable regions -->
<map name="worldmap">
    <!-- Rectangle region (x1,y1,x2,y2) -->
    <area shape="rect" coords="0,0,100,100"
          href="/north-america" alt="North America">

    <!-- Circle region (center-x, center-y, radius) -->
    <area shape="circle" coords="150,150,50"
          href="/europe" alt="Europe">

    <!-- Polygon region (multiple x,y pairs) -->
    <area shape="poly" coords="200,200,300,250,250,300"
          href="/asia" alt="Asia">
</map>
```

### Complete Image Map Example

```html
<!-- Clickable solar system diagram -->
<img src="solar-system.jpg" alt="Solar system" usemap="#planets">

<map name="planets">
    <area shape="circle" coords="50,50,20"
          href="/mercury" alt="Mercury">
    <area shape="circle" coords="100,50,22"
          href="/venus" alt="Venus">
    <area shape="circle" coords="150,50,25"
          href="/earth" alt="Earth">
    <area shape="circle" coords="200,50,20"
          href="/mars" alt="Mars">
</map>
```

**Note:** Image maps are **rarely used** in modern web design. Prefer:

- Responsive `<picture>` element
- SVG overlay with clickable regions
- CSS-positioned elements
- Interactive canvas/WebGL

---

## 8.5 Figure and Figcaption: Self-Contained Images

The `<figure>` element groups **self-contained illustrations** with optional captions. The `<figcaption>` element
provides the caption.

### Figure with Image and Caption

```html
<!-- Image with caption -->
<figure>
    <img src="workflow.png" alt="Development workflow diagram">
    <figcaption>Figure 1: The development workflow from planning to launch</figcaption>
</figure>

<!-- Multiple images in figure -->
<figure>
    <img src="before.jpg" alt="Kitchen before renovation">
    <img src="after.jpg" alt="Kitchen after renovation">
    <figcaption>Kitchen renovation completed in March 2024</figcaption>
</figure>

<!-- Figcaption at top or bottom -->
<figure>
    <figcaption>Diagram 2: System architecture</figcaption>
    <img src="architecture.png" alt="System architecture showing microservices">
</figure>
```

### Figure with Code Block

```html
<!-- Code example as figure -->
<figure>
    <figcaption>Example: Basic HTML structure</figcaption>
    <pre><code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Content&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;
  </code></pre>
</figure>
```

### Figure with SVG Diagram

```html
<!-- SVG diagram with caption -->
<figure>
    <svg width="200" height="200">
        <circle cx="100" cy="100" r="50" fill="blue"/>
    </svg>
    <figcaption>Figure 3: Circle diagram demonstrating SVG graphics</figcaption>
</figure>
```

---

## 8.6 Video: `<video>` Element

The `<video>` element embeds **video content** with controls and multiple format support.

### Basic Video Syntax

```html
<!-- Simple video -->
<video width="640" height="480" controls>
    <source src="video.mp4" type="video/mp4">
    Your browser doesn't support HTML5 video.
</video>

<!-- With attributes -->
<video width="640" height="480" controls autoplay muted loop>
    <source src="video.mp4" type="video/mp4">
    Fallback text for older browsers
</video>
```

### Video Attributes

| Attribute        | Purpose                                               | Example                            |
|------------------|-------------------------------------------------------|------------------------------------|
| `controls`       | Show playback controls (play, pause, volume)          | `<video controls>`                 |
| `autoplay`       | Play when page loads                                  | `<video autoplay>`                 |
| `muted`          | Start muted (required with autoplay in many browsers) | `<video autoplay muted>`           |
| `loop`           | Restart when finished                                 | `<video loop>`                     |
| `poster`         | Image shown before playback starts                    | `<video poster="image.jpg">`       |
| `width`/`height` | Video dimensions                                      | `<video width="640" height="480">` |
| `preload`        | How much to preload (`auto`, `metadata`, `none`)      | `<video preload="metadata">`       |

### Multiple Video Formats

```html
<!-- Provide multiple formats for browser compatibility -->
<video width="640" height="480" controls poster="poster.jpg">
    <!-- MP4: Widely supported -->
    <source src="video.mp4" type="video/mp4">

    <!-- WebM: Better compression -->
    <source src="video.webm" type="video/webm">

    <!-- Fallback -->
    Your browser doesn't support HTML5 video.
    <a href="video.mp4">Download the video</a>
</video>
```

### Video with Captions

```html
<!-- Video with multiple caption tracks -->
<video width="640" height="480" controls>
    <source src="video.mp4" type="video/mp4">

    <!-- English captions (default) -->
    <track kind="captions" src="captions-en.vtt" srclang="en" label="English">

    <!-- Spanish captions -->
    <track kind="captions" src="captions-es.vtt" srclang="es" label="Español">

    <!-- French captions -->
    <track kind="captions" src="captions-fr.vtt" srclang="fr" label="Français">

    Your browser doesn't support HTML5 video.
</video>
```

### Complete Video Pattern

```html

<figure>
    <video width="1280" height="720"
           controls
           poster="thumbnail.jpg"
           preload="metadata">

        <!-- Video sources in order of preference -->
        <source src="video.webm" type="video/webm">
        <source src="video.mp4" type="video/mp4">

        <!-- Captions/Subtitles -->
        <track kind="captions" src="captions.vtt" srclang="en" label="English">
        <track kind="subtitles" src="subs.vtt" srclang="es" label="Español">

        <!-- Fallback -->
        Your browser doesn't support HTML5 video.
        <a href="video.mp4">Download video</a>
    </video>

    <figcaption>How to use the product (4 minutes)</figcaption>
</figure>
```

---

## 8.7 Audio: `<audio>` Element

The `<audio>` element embeds **audio content** with controls.

### Basic Audio Syntax

```html
<!-- Simple audio player -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    Your browser doesn't support HTML5 audio.
</audio>

<!-- With attributes -->
<audio controls autoplay muted loop>
    <source src="audio.mp3" type="audio/mpeg">
</audio>
```

### Audio Attributes

Same as video: `controls`, `autoplay`, `muted`, `loop`, `preload`

### Multiple Audio Formats

```html
<!-- Provide multiple formats for compatibility -->
<audio controls>
    <!-- MP3: Most compatible -->
    <source src="audio.mp3" type="audio/mpeg">

    <!-- OGG: Better compression -->
    <source src="audio.ogg" type="audio/ogg">

    <!-- WAV: Uncompressed -->
    <source src="audio.wav" type="audio/wav">

    Your browser doesn't support HTML5 audio.
    <a href="audio.mp3">Download audio</a>
</audio>
```

### Audio with Transcript

```html
<!-- Audio with visual transcript (required for accessibility) -->
<figure>
    <audio controls>
        <source src="podcast.mp3" type="audio/mpeg">
        <source src="podcast.ogg" type="audio/ogg">
        Your browser doesn't support HTML5 audio.
    </audio>

    <figcaption>Podcast: Episode 42 - Web Standards</figcaption>
</figure>

<!-- Required: Transcript of audio content -->
<details>
    <summary>Transcript</summary>
    <p>
        Host: Welcome to the Web Standards podcast. Today we're discussing...
        [Full transcript of audio content]
    </p>
</details>
```

---

## 8.8 The Track Element: Captions and Subtitles

The `<track>` element adds **captions, subtitles, or descriptions** to video/audio.

### Track Kinds

| Kind           | Purpose                                  | Use Case                       |
|----------------|------------------------------------------|--------------------------------|
| `captions`     | Dialogue + descriptions for deaf viewers | Video with dialogue            |
| `subtitles`    | Translation of dialogue                  | Foreign language videos        |
| `descriptions` | Audio descriptions for blind viewers     | Video scenes needing narration |
| `chapters`     | Chapter markers for navigation           | Long videos, tutorials         |
| `metadata`     | Searchable metadata (not displayed)      | Video indexing                 |

### Track Attributes

```html
<!-- Captions -->
<track kind="captions" src="captions.vtt" srclang="en" label="English">

<!-- Subtitles (translation) -->
<track kind="subtitles" src="subtitles-es.vtt" srclang="es" label="Español">

<!-- Description (audio description) -->
<track kind="descriptions" src="descriptions.vtt" srclang="en">

<!-- Chapters -->
<track kind="chapters" src="chapters.vtt">
```

### WebVTT Format (Caption File)

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to our tutorial

00:00:05.500 --> 00:00:10.000
Today we'll learn about HTML5 video

00:00:10.500 --> 00:00:15.000
This is an important concept
```

### Complete Video with Captions and Descriptions

```html

<video width="1280" height="720" controls poster="poster.jpg">
    <source src="tutorial.mp4" type="video/mp4">
    <source src="tutorial.webm" type="video/webm">

    <!-- Captions for dialogue -->
    <track kind="captions"
           src="captions-en.vtt"
           srclang="en"
           label="English"
           default>

    <!-- Subtitles in other languages -->
    <track kind="subtitles"
           src="subtitles-es.vtt"
           srclang="es"
           label="Español">

    <!-- Audio descriptions for blind users -->
    <track kind="descriptions"
           src="descriptions.vtt"
           srclang="en">

    <!-- Chapter markers -->
    <track kind="chapters"
           src="chapters.vtt">

    Your browser doesn't support video.
</video>
```

---

## 8.9 Iframe: Embedding External Content

The `<iframe>` element embeds **external web pages or applications** (maps, videos, widgets, etc.).

### Basic Iframe

```html
<!-- Embed external page -->
<iframe src="https://example.com"></iframe>

<!-- YouTube video (easier than figuring out source) -->
<iframe width="560" height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowfullscreen></iframe>

<!-- Google Map -->
<iframe src="https://www.google.com/maps/embed?pb=..."
        width="400"
        height="300"
        allowfullscreen=""
        loading="lazy"></iframe>
```

### Iframe Security: The `sandbox` Attribute

The **`sandbox`** attribute **restricts iframe capabilities** to prevent malicious content from:

- Running JavaScript
- Accessing cookies/local storage
- Submitting forms
- Accessing parent page

```html
<!-- Most restrictive: Allows nothing -->
<iframe src="untrusted.html" sandbox></iframe>

<!-- Allow specific capabilities -->
<iframe src="widget.html"
        sandbox="allow-scripts allow-same-origin allow-forms">
</iframe>

<!-- Common pattern: Allow scripts but restrict access -->
<iframe src="https://example.com"
        sandbox="allow-scripts allow-same-origin">
</iframe>
```

**Sandbox allowances:**

| Allowance              | Enables                                    |
|------------------------|--------------------------------------------|
| `allow-same-origin`    | Access to parent domain (cookies, storage) |
| `allow-scripts`        | JavaScript execution                       |
| `allow-forms`          | Form submission                            |
| `allow-popups`         | Opening new windows                        |
| `allow-top-navigation` | Changing parent URL                        |
| `allow-pointer-lock`   | Pointer lock API                           |

### Iframe with Title and Description

```html
<!-- Accessible iframe with proper title -->
<iframe src="https://www.youtube.com/embed/video-id"
        title="How to learn HTML - 10 minute tutorial"
        width="560"
        height="315"
        allowfullscreen
        loading="lazy">
</iframe>

<!-- Important: Always include title for accessibility -->
```

---

## 8.10 Image Format Considerations

### Common Image Formats

| Format   | Use Case                                  | Pros                                    | Cons                             |
|----------|-------------------------------------------|-----------------------------------------|----------------------------------|
| **JPEG** | Photographs, complex colors               | High compression, universal support     | Lossy, no transparency           |
| **PNG**  | Graphics, icons, transparency needed      | Lossless, transparency, universal       | Larger file size than JPEG       |
| **WebP** | Modern web (photos and graphics)          | Smaller than JPEG/PNG, good compression | Not supported in older browsers  |
| **AVIF** | Newest format (photos)                    | Smallest files, modern compression      | Limited browser support          |
| **SVG**  | Icons, logos, diagrams, scalable graphics | Vector, scalable, small file size       | Not suitable for photographs     |
| **GIF**  | Animations (legacy)                       | Animation support, universal            | Poor compression, limited colors |

### Choosing Image Format

```html
<!-- Photograph: Use JPEG or WebP -->
<picture>
    <source srcset="photo.webp" type="image/webp">
    <img src="photo.jpg" alt="Photo">
</picture>

<!-- Icon/Logo: Use SVG (best) or PNG -->
<svg width="100" height="100">
    <circle cx="50" cy="50" r="40"/>
</svg>

<!-- Graphic with transparency: Use PNG or WebP -->
<picture>
    <source srcset="graphic.webp" type="image/webp">
    <img src="graphic.png" alt="Graphic">
</picture>

<!-- Animation: Use video (best) or WebP (modern) -->
<video autoplay muted loop>
    <source src="animation.webm">
</video>
```

---

## 8.11 Accessibility: Image and Media

### Alt Text Guidelines Recap

```html
<!-- ✓ Informative: Describes what's shown -->
<img src="dog.jpg" alt="Brown and white spaniel running in grass">

<!-- ✓ Functional: Describes purpose -->
<button><img src="search.svg" alt="Search"></button>

<!-- ✓ Decorative: Empty alt for purely visual images -->
<img src="divider.png" alt="">

<!-- ✗ Bad: Filename -->
<img src="IMG_1234.jpg" alt="IMG_1234.jpg">

<!-- ✗ Bad: "Image of" redundancy -->
<img src="cat.jpg" alt="Image of a cat">
```

### Video Captions are Required (WCAG)

```html
<!-- ✓ REQUIRED: Video captions for deaf viewers -->
<video controls>
    <source src="video.mp4">
    <track kind="captions" src="captions.vtt" srclang="en">
</video>

<!-- ✗ INACCESSIBLE: Video without captions -->
<video controls>
    <source src="video.mp4">
</video>
```

### Audio Transcripts Required

```html
<!-- Audio requires text transcript -->
<audio controls>
    <source src="podcast.mp3" type="audio/mpeg">
</audio>

<!-- Provide transcript -->
<h3>Transcript</h3>
<p>
    Host: Welcome to the podcast...
    [Full text of audio content]
</p>
```

### Responsive Images for Accessibility

```html
<!-- ✓ Clear alt text -->
<img src="product.jpg"
     alt="Blue wireless headphones with noise cancellation button"
     srcset="product-480w.jpg 480w,
             product-800w.jpg 800w,
             product-1200w.jpg 1200w"
     sizes="100vw">

<!-- ✗ Generic alt text -->
<img src="product.jpg" alt="Product">
```

---

## Summary: Section 8 Key Takeaways

- ✅ **`<img src="" alt="">`** - Both attributes critical
- ✅ **Alt text should be descriptive** (not filename, not "image of...")
- ✅ **Empty alt (`alt=""`) for decorative images** (not `alt="decorative"`)
- ✅ **Dimensions (`width`, `height`)** prevent layout shift
- ✅ **Lazy loading (`loading="lazy"`)** for off-screen images
- ✅ **Responsive images** with `srcset` and `sizes`
- ✅ **`<picture>` for art direction** (different crops at breakpoints)
- ✅ **Modern formats first** (WebP, AVIF) with JPEG fallback
- ✅ **`<video>` and `<audio>`** with `<track>` for captions/subtitles
- ✅ **Captions required** for accessibility (WCAG)
- ✅ **Audio transcripts required** for accessibility
- ✅ **`<figure>` and `<figcaption>`** for self-contained images with captions
- ✅ **`<iframe sandbox>`** restricts untrusted content
- ✅ **Image formats**: JPEG/WebP (photos), PNG/SVG (graphics), Video (animation)
- ❌ **Never**: Omit `alt` attribute on meaningful images
- ❌ **Never**: Use filename as alt text
- ❌ **Never**: Say "image of" in alt text (redundant)
- ❌ **Never**: Skip `width`/`height` on images (causes layout shift)
- ❌ **Never**: Include video without captions/subtitles
- ❌ **Never**: Embed audio without transcript
- ❌ **Never**: Use untrusted iframe without `sandbox` attribute
- ❌ **Never**: Use GIF for animation (use video instead)

---

## Links & Resources

- [MDN: Image Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [MDN: Video Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [MDN: Audio Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [WebAIM: Alt Text](https://webaim.org/articles/alttext/)
- [WCAG: Images](https://www.w3.org/WAI/tutorials/images/)
- [Web.dev: Image Optimization](https://web.dev/image-optimization/)
- [MDN: Picture Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [WebVTT Format Specification](https://www.w3.org/TR/webvtt1/)
- [HTML Living Standard: Media](https://html.spec.whatwg.org/multipage/embedded-content.html)

---

# 9. Tables

## 9.1 Table Structure: Core Elements

A **table** organizes data into **rows and columns**. Tables should be used **only for tabular data**, never for page
layout.

### Basic Table Syntax

```html
<!-- Simple table with headers and data -->
<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>John</td>
        <td>28</td>
        <td>New York</td>
    </tr>
    <tr>
        <td>Jane</td>
        <td>32</td>
        <td>Los Angeles</td>
    </tr>
    </tbody>
</table>
```

**Browser rendering:**

```
| Name | Age | City        |
|------|-----|-------------|
| John | 28  | New York    |
| Jane | 32  | Los Angeles |
```

### Table Elements

| Element      | Purpose                                   |
|--------------|-------------------------------------------|
| `<table>`    | Container for all table content           |
| `<thead>`    | Table header (column titles)              |
| `<tbody>`    | Table body (data rows)                    |
| `<tfoot>`    | Table footer (totals, notes)              |
| `<tr>`       | Table row                                 |
| `<th>`       | Table header cell (with semantic meaning) |
| `<td>`       | Table data cell                           |
| `<caption>`  | Table title/description                   |
| `<colgroup>` | Groups columns for styling                |
| `<col>`      | Individual column definition              |

### Complete Table with All Parts

```html

<table>
    <!-- Table caption/title -->
    <caption>Monthly Sales by Region (Q1 2024)</caption>

    <!-- Header section -->
    <thead>
    <tr>
        <th>Region</th>
        <th>January</th>
        <th>February</th>
        <th>March</th>
    </tr>
    </thead>

    <!-- Body section -->
    <tbody>
    <tr>
        <td>North</td>
        <td>$50,000</td>
        <td>$55,000</td>
        <td>$60,000</td>
    </tr>
    <tr>
        <td>South</td>
        <td>$40,000</td>
        <td>$42,000</td>
        <td>$45,000</td>
    </tr>
    <tr>
        <td>East</td>
        <td>$60,000</td>
        <td>$65,000</td>
        <td>$70,000</td>
    </tr>
    </tbody>

    <!-- Footer section (totals, notes) -->
    <tfoot>
    <tr>
        <th>Total</th>
        <td>$150,000</td>
        <td>$162,000</td>
        <td>$175,000</td>
    </tr>
    </tfoot>
</table>
```

---

## 9.2 Table Semantics: `<thead>`, `<tbody>`, `<tfoot>`

These elements provide **semantic structure** and help assistive technologies understand table organization.

### Header: `<thead>`

Groups all **header rows** (column titles).

```html
<!-- Single header row -->
<table>
    <thead>
    <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Stock</th>
    </tr>
    </thead>
    <tbody>
    <!-- Data rows -->
    </tbody>
</table>

<!-- Multiple header rows (hierarchical) -->
<table>
    <thead>
    <tr>
        <th colspan="3">Q1 Sales</th>
    </tr>
    <tr>
        <th>Month</th>
        <th>Revenue</th>
        <th>Growth</th>
    </tr>
    </thead>
    <tbody>
    <!-- Data rows -->
    </tbody>
</table>
```

### Body: `<tbody>`

Groups all **data rows**.

```html

<table>
    <thead>
    <!-- Headers -->
    </thead>
    <tbody>
    <tr>
        <td>Data cell 1</td>
        <td>Data cell 2</td>
    </tr>
    <tr>
        <td>Data cell 3</td>
        <td>Data cell 4</td>
    </tr>
    </tbody>
</table>
```

### Footer: `<tfoot>`

Groups **footer rows** (totals, notes, summaries).

```html

<table>
    <thead>
    <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Widget A</td>
        <td>5</td>
        <td>$10</td>
        <td>$50</td>
    </tr>
    <tr>
        <td>Widget B</td>
        <td>3</td>
        <td>$15</td>
        <td>$45</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <th colspan="3">Total</th>
        <td>$95</td>
    </tr>
    </tfoot>
</table>
```

---

## 9.3 Header Cells: `<th>` vs `<td>`

**`<th>`** (table header) identifies column or row headers. **`<td>`** identifies data cells.

### Proper Th vs Td Usage

```html
<!-- ✓ CORRECT: th for headers, td for data -->
<table>
    <thead>
    <tr>
        <th>Name</th>        <!-- Header cell -->
        <th>Age</th>         <!-- Header cell -->
        <th>Occupation</th>  <!-- Header cell -->
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>John</td>        <!-- Data cell -->
        <td>28</td>          <!-- Data cell -->
        <td>Engineer</td>    <!-- Data cell -->
    </tr>
    </tbody>
</table>

<!-- ✓ CORRECT: th for row headers too -->
<table>
    <tbody>
    <tr>
        <th>North Region</th>  <!-- Row header -->
        <td>$50,000</td>
        <td>$55,000</td>
    </tr>
    </tbody>
</table>

<!-- ✗ WRONG: Using td for headers -->
<table>
    <thead>
    <tr>
        <td>Name</td>       <!-- Should be th -->
        <td>Age</td>        <!-- Should be th -->
    </tr>
    </thead>
</table>
```

---

## 9.4 Column and Row Spanning

**Spanning** allows cells to **stretch across multiple columns or rows**.

### Column Spanning: `colspan`

```html
<!-- Cell spans 3 columns -->
<table>
    <thead>
    <tr>
        <th colspan="3">Q1 Performance</th>
    </tr>
    <tr>
        <th>Jan</th>
        <th>Feb</th>
        <th>Mar</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>$50K</td>
        <td>$55K</td>
        <td>$60K</td>
    </tr>
    </tbody>
</table>
```

**Visual result:**

```
┌─────────────────┐
│  Q1 Performance │
├────┬────┬────┤
│Jan │Feb │Mar │
├────┼────┼────┤
│50K │55K │60K │
└────┴────┴────┘
```

### Row Spanning: `rowspan`

```html
<!-- Cell spans 3 rows -->
<table>
    <tbody>
    <tr>
        <th rowspan="3">North</th>
        <td>January</td>
        <td>$50,000</td>
    </tr>
    <tr>
        <td>February</td>
        <td>$55,000</td>
    </tr>
    <tr>
        <td>March</td>
        <td>$60,000</td>
    </tr>
    </tbody>
</table>
```

**Visual result:**

```
┌───────┬─────────┬─────────┐
│       │ January │ $50,000 │
│ North ├─────────┼─────────┤
│       │February │ $55,000 │
│       ├─────────┼─────────┤
│       │  March  │ $60,000 │
└───────┴─────────┴─────────┘
```

### Complex Spanning

```html
<!-- Multiple spans -->
<table>
    <thead>
    <tr>
        <th colspan="2">First Half</th>
        <th colspan="2">Second Half</th>
    </tr>
    <tr>
        <th>Q1</th>
        <th>Q2</th>
        <th>Q3</th>
        <th>Q4</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>$100K</td>
        <td>$110K</td>
        <td>$120K</td>
        <td>$130K</td>
    </tr>
    </tbody>
</table>
```

---

## 9.5 Table Caption: `<caption>`

The **`<caption>`** element provides a **title or description** for the table.

```html
<!-- Caption at top (default) -->
<table>
    <caption>Sales Performance - Q1 2024</caption>
    <thead>
    <tr>
        <th>Region</th>
        <th>Revenue</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>North</td>
        <td>$150,000</td>
    </tr>
    </tbody>
</table>

<!-- Caption with longer description -->
<table>
    <caption>
        <strong>Table 1:</strong> Regional sales data for the first quarter,
        showing revenue across all territories and growth trends.
    </caption>
    <!-- Table content -->
</table>

<!-- Position caption at bottom with CSS -->
<table class="caption-bottom">
    <caption>Source: Internal Sales Database</caption>
    <!-- Table content -->
</table>

<style>
    table.caption-bottom caption {
        caption-side: bottom;
    }
</style>
```

**Screen reader announces:** "Table caption: Sales Performance - Q1 2024"

---

## 9.6 Column Grouping: `<colgroup>` and `<col>`

**`<colgroup>`** and **`<col>`** allow **grouping and styling columns**.

### Basic Colgroup

```html
<!-- Apply styling to entire columns -->
<table>
    <colgroup>
        <col class="label-col">
        <col class="data-col">
        <col class="data-col">
    </colgroup>
    <thead>
    <tr>
        <th>Product</th>
        <th>2023</th>
        <th>2024</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Widget A</td>
        <td>$100</td>
        <td>$120</td>
    </tr>
    <tr>
        <td>Widget B</td>
        <td>$80</td>
        <td>$95</td>
    </tr>
    </tbody>
</table>

<style>
    .label-col {
        width: 200px;
    }

    .data-col {
        width: 100px;
        text-align: right;
    }
</style>
```

### Grouped Columns with `<colgroup span>`

```html
<!-- Group multiple columns -->
<table>
    <colgroup>
        <col class="label">         <!-- 1 column -->
        <col span="2" class="year"> <!-- 2 columns (2023, 2024) -->
        <col span="2" class="year"> <!-- 2 columns (2023, 2024) -->
    </colgroup>
    <thead>
    <tr>
        <th>Product</th>
        <th colspan="2">2024</th>
        <th colspan="2">2025</th>
    </tr>
    <tr>
        <th></th>
        <th>Q1</th>
        <th>Q2</th>
        <th>Q1</th>
        <th>Q2</th>
    </tr>
    </thead>
</table>

<style>
    .label {
        width: 150px;
    }

    .year {
        width: 80px;
    }
</style>
```

---

## 9.7 Table Accessibility: The `scope` Attribute

The **`scope`** attribute tells **assistive technologies which cells are headers** for which data.

### Scope Values

```html
<!-- scope="col": Header applies to entire column -->
<table>
    <thead>
    <tr>
        <th scope="col">Name</th>
        <th scope="col">Age</th>
        <th scope="col">City</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>John</td>
        <td>28</td>
        <td>New York</td>
    </tr>
    </tbody>
</table>

<!-- scope="row": Header applies to entire row -->
<table>
    <tbody>
    <tr>
        <th scope="row">North Region</th>
        <td>$50,000</td>
        <td>$55,000</td>
    </tr>
    <tr>
        <th scope="row">South Region</th>
        <td>$40,000</td>
        <td>$45,000</td>
    </tr>
    </tbody>
</table>

<!-- scope="colgroup": Header applies to column group -->
<table>
    <colgroup>
        <col>
        <col span="2">
    </colgroup>
    <thead>
    <tr>
        <th></th>
        <th scope="colgroup" colspan="2">Sales</th>
    </tr>
    <tr>
        <th>Month</th>
        <th>East</th>
        <th>West</th>
    </tr>
    </thead>
</table>

<!-- scope="rowgroup": Header applies to row group -->
<table>
    <tbody>
    <tr>
        <th scope="rowgroup">Q1</th>
        <td>Jan</td>
        <td>$50K</td>
    </tr>
    <tr>
        <td></td>
        <td>Feb</td>
        <td>$55K</td>
    </tr>
    </tbody>
</table>
```

### When Scope is Essential

```html
<!-- SIMPLE TABLE: scope is optional but recommended -->
<table>
    <thead>
    <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>John</td>
        <td>john@example.com</td>
    </tr>
    </tbody>
</table>

<!-- COMPLEX TABLE: scope is critical for accessibility -->
<table>
    <thead>
    <tr>
        <th></th>
        <th scope="col">2024 Q1</th>
        <th scope="col">2024 Q2</th>
        <th scope="col">2024 Q3</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">North</th>
        <td>$150K</td>
        <td>$160K</td>
        <td>$170K</td>
    </tr>
    <tr>
        <th scope="row">South</th>
        <td>$140K</td>
        <td>$150K</td>
        <td>$160K</td>
    </tr>
    </tbody>
</table>
```

---

## 9.8 Complex Table Accessibility: The `headers` Attribute

For **very complex tables**, use the **`headers`** attribute to explicitly link data cells to their headers.

### Headers Attribute Pattern

```html
<!-- Complex table with headers attribute -->
<table>
    <thead>
    <tr>
        <th id="name">Name</th>
        <th id="jan">January</th>
        <th id="feb">February</th>
        <th id="mar">March</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th id="north">North Region</th>
        <td headers="north jan">$50K</td>
        <td headers="north feb">$55K</td>
        <td headers="north mar">$60K</td>
    </tr>
    <tr>
        <th id="south">South Region</th>
        <td headers="south jan">$40K</td>
        <td headers="south feb">$42K</td>
        <td headers="south mar">$45K</td>
    </tr>
    </tbody>
</table>

<!-- Screen reader announces:
  Cell: "$50K"
  Headers: "North Region, January"
-->
```

### When to Use Headers Attribute

```html
<!-- SIMPLE: Use scope (easier) -->
<table>
    <thead>
    <tr>
        <th scope="col">Product</th>
        <th scope="col">Price</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Widget</td>
        <td>$10</td>
    </tr>
    </tbody>
</table>

<!-- VERY COMPLEX: Use headers attribute -->
<table>
    <thead>
    <tr>
        <th id="h1">Product</th>
        <th id="h2" colspan="2">Q1 Sales</th>
        <th id="h3" colspan="2">Q2 Sales</th>
    </tr>
    <tr>
        <th></th>
        <th id="h4">East</th>
        <th id="h5">West</th>
        <th id="h6">East</th>
        <th id="h7">West</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th id="r1">Widget A</th>
        <td headers="r1 h4">$10K</td>
        <td headers="r1 h5">$12K</td>
        <td headers="r1 h6">$11K</td>
        <td headers="r1 h7">$13K</td>
    </tr>
    </tbody>
</table>
```

---

## 9.9 Responsive Tables

Tables on mobile require special handling since horizontal scrolling is poor UX.

### Strategy 1: Horizontal Scroll (Simple)

```html
<!-- Simple: Allow horizontal scroll on narrow screens -->
<div style="overflow-x: auto;">
    <table>
        <thead>
        <tr>
            <th>Product</th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Q4</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Widget A</td>
            <td>$10K</td>
            <td>$12K</td>
            <td>$15K</td>
            <td>$18K</td>
        </tr>
        </tbody>
    </table>
</div>
```

### Strategy 2: Transform to Stacked Rows (CSS)

```html
<!-- Mobile: Stack rows vertically, desktop: normal table -->
<table class="responsive">
    <thead>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>City</th>
        <th>Occupation</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td data-label="Name">John</td>
        <td data-label="Age">28</td>
        <td data-label="City">New York</td>
        <td data-label="Occupation">Engineer</td>
    </tr>
    </tbody>
</table>

<style>
    @media (max-width: 768px) {
        table.responsive {
            display: block;
        }

        table.responsive thead {
            display: none;
        }

        table.responsive tbody,
        table.responsive tr,
        table.responsive td {
            display: block;
            width: 100%;
        }

        table.responsive tr {
            margin-bottom: 1em;
            border: 1px solid #ddd;
            padding: 1em;
        }

        table.responsive td {
            padding-left: 50%;
            position: relative;
        }

        table.responsive td::before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 45%;
            font-weight: bold;
        }
    }
</style>
```

### Strategy 3: Collapse Columns (Hide Less Important)

```html
<!-- Mobile: Hide less important columns, show on desktop -->
<table>
    <thead>
    <tr>
        <th>Product</th>
        <th>Price</th>
        <th class="desktop-only">Stock</th>
        <th class="desktop-only">Category</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Widget A</td>
        <td>$10</td>
        <td class="desktop-only">50</td>
        <td class="desktop-only">Hardware</td>
    </tr>
    </tbody>
</table>

<style>
    @media (max-width: 768px) {
        .desktop-only {
            display: none;
        }
    }
</style>
```

---

## 9.10 Common Table Mistakes

### Mistake 1: Using Tables for Layout

```html
<!-- ✗ WRONG: Using table for page layout -->
<table>
    <tr>
        <td>Sidebar</td>
        <td>Main content</td>
    </tr>
</table>

<!-- ✓ CORRECT: Use CSS Grid or Flexbox for layout -->
<div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
    <aside>Sidebar</aside>
    <main>Main content</main>
</div>
```

### Mistake 2: Missing Thead/Tbody/Tfoot

```html
<!-- ✗ WEAK: No semantic sections -->
<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>John</td>
        <td>28</td>
    </tr>
    <tr>
        <td>Jane</td>
        <td>32</td>
    </tr>
</table>

<!-- ✓ BETTER: Clear semantic structure -->
<table>
    <thead>
    <tr>
        <th>Name</th>
        <th>Age</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>John</td>
        <td>28</td>
    </tr>
    <tr>
        <td>Jane</td>
        <td>32</td>
    </tr>
    </tbody>
</table>
```

### Mistake 3: Using `<td>` for Headers

```html
<!-- ✗ WRONG: Using td for headers -->
<table>
    <tr>
        <td><strong>Product</strong></td>
        <td><strong>Price</strong></td>
    </tr>
    <tr>
        <td>Widget</td>
        <td>$10</td>
    </tr>
</table>

<!-- ✓ CORRECT: Using th for headers -->
<table>
    <thead>
    <tr>
        <th>Product</th>
        <th>Price</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Widget</td>
        <td>$10</td>
    </tr>
    </tbody>
</table>
```

### Mistake 4: No Caption

```html
<!-- ✗ WEAK: No table title -->
<table>
    <thead>
    <tr>
        <th>Month</th>
        <th>Revenue</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>January</td>
        <td>$50K</td>
    </tr>
    </tbody>
</table>

<!-- ✓ BETTER: Add caption -->
<table>
    <caption>Monthly Revenue - Q1 2024</caption>
    <thead>
    <tr>
        <th>Month</th>
        <th>Revenue</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>January</td>
        <td>$50K</td>
    </tr>
    </tbody>
</table>
```

### Mistake 5: Missing Scope on Headers

```html
<!-- ✗ WEAK: No scope attribute (ambiguous for complex tables) -->
<table>
    <thead>
    <tr>
        <th>Region</th>
        <th>Q1</th>
        <th>Q2</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th>North</th>
        <td>$100K</td>
        <td>$110K</td>
    </tr>
    </tbody>
</table>

<!-- ✓ BETTER: Clear scope attributes -->
<table>
    <thead>
    <tr>
        <th scope="col">Region</th>
        <th scope="col">Q1</th>
        <th scope="col">Q2</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">North</th>
        <td>$100K</td>
        <td>$110K</td>
    </tr>
    </tbody>
</table>
```

---

## 9.11 Complete Table Examples

### Simple Data Table

```html

<table>
    <caption>Team Members</caption>
    <thead>
    <tr>
        <th scope="col">Name</th>
        <th scope="col">Role</th>
        <th scope="col">Email</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Alice Johnson</td>
        <td>Lead Designer</td>
        <td>alice@example.com</td>
    </tr>
    <tr>
        <td>Bob Smith</td>
        <td>Developer</td>
        <td>bob@example.com</td>
    </tr>
    <tr>
        <td>Charlie Brown</td>
        <td>Project Manager</td>
        <td>charlie@example.com</td>
    </tr>
    </tbody>
</table>
```

### Financial Table (With Totals)

```html

<table>
    <caption>Q1 2024 Financial Summary</caption>
    <thead>
    <tr>
        <th scope="col">Category</th>
        <th scope="col" style="text-align: right;">Revenue</th>
        <th scope="col" style="text-align: right;">Expenses</th>
        <th scope="col" style="text-align: right;">Profit</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">Sales</th>
        <td style="text-align: right;">$150,000</td>
        <td style="text-align: right;">$50,000</td>
        <td style="text-align: right;">$100,000</td>
    </tr>
    <tr>
        <th scope="row">Services</th>
        <td style="text-align: right;">$80,000</td>
        <td style="text-align: right;">$30,000</td>
        <td style="text-align: right;">$50,000</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <th scope="row">Total</th>
        <td style="text-align: right;">$230,000</td>
        <td style="text-align: right;">$80,000</td>
        <td style="text-align: right;">$150,000</td>
    </tr>
    </tfoot>
</table>
```

### Comparison Table (With Spanning)

```html

<table>
    <caption>Product Comparison</caption>
    <thead>
    <tr>
        <th scope="col">Feature</th>
        <th scope="col" colspan="2">Basic Plan</th>
        <th scope="col" colspan="2">Pro Plan</th>
    </tr>
    <tr>
        <th></th>
        <th scope="col">Price</th>
        <th scope="col">Included</th>
        <th scope="col">Price</th>
        <th scope="col">Included</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th scope="row">Users</th>
        <td>$9.99</td>
        <td>1</td>
        <td>$29.99</td>
        <td>Unlimited</td>
    </tr>
    <tr>
        <th scope="row">Storage</th>
        <td></td>
        <td>5 GB</td>
        <td></td>
        <td>1 TB</td>
    </tr>
    <tr>
        <th scope="row">Support</th>
        <td></td>
        <td>Email</td>
        <td></td>
        <td>24/7 Priority</td>
    </tr>
    </tbody>
</table>
```

---

## Summary: Section 9 Key Takeaways

- ✅ **Tables for tabular data ONLY**, never for layout
- ✅ **Structure**: `<table>` → `<thead>`, `<tbody>`, `<tfoot>` → `<tr>` → `<th>`, `<td>`
- ✅ **`<th>` for headers**, `<td>` for data
- ✅ **`scope="col"`** for column headers, **`scope="row"`** for row headers
- ✅ **`<caption>` provides table title** (announced by screen readers)
- ✅ **`colspan` and `rowspan`** for cells spanning multiple columns/rows
- ✅ **`headers` attribute** for complex tables (explicit header linkage)
- ✅ **`<colgroup>` and `<col>`** for column grouping and styling
- ✅ **Responsive tables** need special handling (scroll, stack, or hide columns)
- ✅ **Accessibility critical**: scope, caption, proper th/td usage
- ✅ **Always use thead/tbody/tfoot** for semantic structure
- ❌ **Never**: Use tables for page layout (use CSS Grid/Flexbox)
- ❌ **Never**: Use `<td>` for headers (use `<th>`)
- ❌ **Never**: Skip caption (especially important tables)
- ❌ **Never**: Forget scope attributes on complex tables
- ❌ **Never**: Mix complex spanning without clear headers
- ❌ **Never**: Skip thead/tbody structure (aids accessibility)

---

## Links & Resources

- [MDN: Table Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
- [MDN: Table Headers](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced)
- [WCAG: Tables](https://www.w3.org/WAI/tutorials/tables/)
- [WebAIM: Tables](https://webaim.org/articles/tables/)
- [HTML Living Standard: Tables](https://html.spec.whatwg.org/multipage/tables.html)

---

# 10. Forms and Inputs

## 10.1 The Form Element: `<form>`

The **`<form>`** element is a **container for interactive controls** that collect and submit user data.

### Basic Form Syntax

```html
<!-- Simple form -->
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">

    <button type="submit">Submit</button>
</form>
```

### Form Attributes

| Attribute      | Purpose                          | Example                         |
|----------------|----------------------------------|---------------------------------|
| `action`       | URL where form data is submitted | `action="/submit"`              |
| `method`       | HTTP method (GET, POST)          | `method="POST"`                 |
| `enctype`      | Encoding type for file uploads   | `enctype="multipart/form-data"` |
| `novalidate`   | Disable HTML5 validation         | `novalidate`                    |
| `autocomplete` | Enable/disable form autocomplete | `autocomplete="off"`            |

### Method: GET vs POST

```html
<!-- GET: Data in URL (visible, limited size, caching) -->
<form action="/search" method="GET">
    <input type="text" name="q" placeholder="Search">
    <button type="submit">Search</button>
</form>
<!-- Submits to: /search?q=html -->

<!-- POST: Data in request body (hidden, larger, no caching) -->
<form action="/login" method="POST">
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
```

**When to use:**

- **GET**: Search, filtering, non-sensitive data
- **POST**: Login, payment, file upload, sensitive data

### Enctype: File Uploads

```html
<!-- Standard form (application/x-www-form-urlencoded) -->
<form action="/submit" method="POST">
    <input type="text" name="username">
    <button type="submit">Submit</button>
</form>

<!-- With file upload (multipart/form-data) -->
<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="document">
    <button type="submit">Upload</button>
</form>
```

---

## 10.2 Labels and Input Association

**Labels** (`<label>`) associate **text with form inputs** for accessibility and usability.

### Proper Label Association

```html
<!-- ✓ CORRECT: Using for/id association -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email">

<!-- ✓ CORRECT: Implicit association (label wraps input) -->
<label>
    Email Address:
    <input type="email" name="email">
</label>

<!-- ✗ WRONG: No association (no label or loose text) -->
Email Address:
<input type="email" name="email">

<!-- ✗ WRONG: Label without for attribute -->
<label>Email Address:</label>
<input type="email" name="email">
```

### Benefits of Proper Labels

```html
<!-- Larger click target (click label to focus input) -->
<label for="checkbox">
    <input type="checkbox" id="checkbox" name="agree">
    I agree to the terms
</label>

<!-- Screen reader announces label text -->
<!-- Semantic association for validation messages -->
```

---

## 10.3 Input Types: Complete Reference

HTML5 provides **20+ input types** for different data types. Each type includes native validation and appropriate
on-screen keyboards on mobile.

### Text Inputs

#### Text: `type="text"`

```html
<!-- Basic text input -->
<label for="username">Username:</label>
<input type="text" id="username" name="username"
       placeholder="Enter username"
       minlength="3"
       maxlength="20"
       required>

<!-- With autocomplete -->
<input type="text" name="country"
       list="countries"
       autocomplete="country">
<datalist id="countries">
    <option value="USA">
    <option value="Canada">
    <option value="Mexico">
</datalist>
```

#### Email: `type="email"`

```html
<!-- Email input with validation -->
<label for="email">Email:</label>
<input type="email" id="email" name="email"
       placeholder="user@example.com"
       required>

<!-- Multiple email addresses -->
<input type="email" name="emails" multiple>

<!-- Shows email keyboard on mobile, built-in validation -->
```

#### Password: `type="password"`

```html
<!-- Password (masked input) -->
<label for="password">Password:</label>
<input type="password" id="password" name="password"
       minlength="8"
       required>
```

#### URL: `type="url"`

```html
<!-- URL input with validation -->
<label for="website">Website:</label>
<input type="url" id="website" name="website"
       placeholder="https://example.com"
       required>

<!-- Shows URL keyboard on mobile, validates URL format -->
```

#### Telephone: `type="tel"`

```html
<!-- Phone number (no built-in validation format) -->
<label for="phone">Phone:</label>
<input type="tel" id="phone" name="phone"
       placeholder="+1 (555) 123-4567"
       pattern="[0-9+\-() ]+"
       required>

<!-- Shows numeric keyboard on mobile -->
```

#### Search: `type="search"`

```html
<!-- Search input (has clear button on most browsers) -->
<input type="search" name="q"
       placeholder="Search products..."
       autocomplete="off">
```

### Numeric Inputs

#### Number: `type="number"`

```html
<!-- Numeric input with validation -->
<label for="quantity">Quantity:</label>
<input type="number" id="quantity" name="quantity"
       min="1"
       max="100"
       step="1"
       required>

<!-- Decimals -->
<input type="number" name="price"
       min="0"
       max="9999.99"
       step="0.01"
       placeholder="0.00">

<!-- Shows numeric keyboard on mobile -->
```

#### Range: `type="range"`

```html
<!-- Slider input -->
<label for="volume">Volume:</label>
<input type="range" id="volume" name="volume"
       min="0"
       max="100"
       step="1"
       value="50">

<!-- Output value with JavaScript -->
<input type="range" id="brightness" min="0" max="100"
       oninput="document.getElementById('value').innerText = this.value">
<output id="value">50</output>
```

### Date and Time Inputs

#### Date: `type="date"`

```html
<!-- Date picker (YYYY-MM-DD format) -->
<label for="birthdate">Birth Date:</label>
<input type="date" id="birthdate" name="birthdate"
       min="1950-01-01"
       max="2010-12-31"
       required>

<!-- Shows date picker on all browsers -->
```

#### Time: `type="time"`

```html
<!-- Time picker (HH:MM format) -->
<label for="appointment">Appointment Time:</label>
<input type="time" id="appointment" name="appointment"
       min="09:00"
       max="17:00"
       required>
```

#### Month: `type="month"`

```html
<!-- Month picker (YYYY-MM format) -->
<label for="expiry">Card Expiry:</label>
<input type="month" id="expiry" name="expiry" required>
```

#### Week: `type="week"`

```html
<!-- Week picker (YYYY-W## format) -->
<label for="week">Select Week:</label>
<input type="week" id="week" name="week" required>
```

#### Datetime-Local: `type="datetime-local"`

```html
<!-- Date and time picker (YYYY-MM-DDTHH:MM format) -->
<label for="appointment">Event Date/Time:</label>
<input type="datetime-local" id="appointment" name="appointment" required>
```

### Color Input

#### Color: `type="color"`

```html
<!-- Color picker -->
<label for="themecolor">Theme Color:</label>
<input type="color" id="themecolor" name="themecolor"
       value="#ff0000">

<!-- Shows color picker on all browsers -->
```

### Boolean and Selection Inputs

#### Checkbox: `type="checkbox"`

```html
<!-- Single checkbox -->
<label for="remember">
    <input type="checkbox" id="remember" name="remember">
    Remember me
</label>

<!-- Multiple checkboxes (same name, different values) -->
<fieldset>
    <legend>Choose interests:</legend>
    <label>
        <input type="checkbox" name="interests" value="sports">
        Sports
    </label>
    <label>
        <input type="checkbox" name="interests" value="music">
        Music
    </label>
    <label>
        <input type="checkbox" name="interests" value="reading">
        Reading
    </label>
</fieldset>

<!-- Checked by default -->
<input type="checkbox" name="agree" checked>
```

#### Radio: `type="radio"`

```html
<!-- Radio buttons (mutually exclusive) -->
<fieldset>
    <legend>Select one:</legend>
    <label>
        <input type="radio" name="size" value="small">
        Small
    </label>
    <label>
        <input type="radio" name="size" value="medium" checked>
        Medium
    </label>
    <label>
        <input type="radio" name="size" value="large">
        Large
    </label>
</fieldset>
```

#### File: `type="file"`

```html
<!-- File upload -->
<label for="document">Upload Document:</label>
<input type="file" id="document" name="document"
       accept=".pdf,.doc,.docx"
       required>

<!-- Multiple files -->
<input type="file" name="images"
       accept="image/*"
       multiple>

<!-- Specific file types -->
<input type="file" name="photo"
       accept="image/png,image/jpeg">
```

### Buttons within Inputs

#### Submit: `type="submit"`

```html
<!-- Submit button (sends form) -->
<button type="submit">Submit Form</button>

<!-- Or using input -->
<input type="submit" value="Submit Form">
```

#### Reset: `type="reset"`

```html
<!-- Reset button (clears form) -->
<button type="reset">Clear Form</button>

<!-- Or using input -->
<input type="reset" value="Clear">
```

#### Button: `type="button"`

```html
<!-- Generic button (no default action) -->
<button type="button" onclick="alert('Clicked!')">Click Me</button>

<!-- Or using input -->
<input type="button" value="Click Me" onclick="alert('Clicked!')">
```

---

## 10.4 Select and Datalist Elements

### Select: Dropdown List

```html
<!-- Simple dropdown -->
<label for="country">Country:</label>
<select id="country" name="country" required>
    <option value="">-- Select a country --</option>
    <option value="usa">United States</option>
    <option value="canada">Canada</option>
    <option value="mexico">Mexico</option>
</select>

<!-- With selected default -->
<select name="size">
    <option>Small</option>
    <option selected>Medium</option>
    <option>Large</option>
</select>

<!-- Multiple selection -->
<label for="interests">Select interests:</label>
<select id="interests" name="interests" multiple size="5">
    <option>Sports</option>
    <option>Music</option>
    <option>Reading</option>
    <option>Gaming</option>
</select>
```

### Optgroup: Grouped Options

```html
<!-- Group related options -->
<label for="category">Category:</label>
<select id="category" name="category">
    <optgroup label="Fruits">
        <option>Apple</option>
        <option>Banana</option>
        <option>Orange</option>
    </optgroup>
    <optgroup label="Vegetables">
        <option>Carrot</option>
        <option>Broccoli</option>
        <option>Spinach</option>
    </optgroup>
</select>
```

### Datalist: Autocomplete Suggestions

```html
<!-- Text input with autocomplete suggestions -->
<label for="city">City:</label>
<input type="text" id="city" name="city"
       list="cities"
       placeholder="Enter city">
<datalist id="cities">
    <option value="New York">
    <option value="Los Angeles">
    <option value="Chicago">
    <option value="Houston">
    <option value="Phoenix">
</datalist>

<!-- User can type or select from list -->
```

### Select vs Datalist

| Element      | Type         | Interaction                     | Use Case                           |
|--------------|--------------|---------------------------------|------------------------------------|
| `<select>`   | Dropdown     | Click to open, select from list | Fixed options, single selection    |
| `<datalist>` | Autocomplete | Type to filter suggestions      | Many options, custom input allowed |

```html
<!-- SELECT: Limited options, closed list -->
<select name="status">
    <option>Active</option>
    <option>Inactive</option>
    <option>Pending</option>
</select>

<!-- DATALIST: Many options, custom input allowed -->
<input list="countries" name="country">
<datalist id="countries">
    <option value="USA">
    <option value="Canada">
        <!-- 195+ more countries... -->
</datalist>
```

---

## 10.5 Textarea and Button Elements

### Textarea: Multi-Line Text

```html
<!-- Basic textarea -->
<label for="message">Message:</label>
<textarea id="message" name="message"
          rows="5"
          cols="40"
          placeholder="Enter your message"
          maxlength="500"
          required></textarea>

<!-- With default content -->
<textarea name="comment" rows="10">
This is default text in the textarea
</textarea>

<!-- Character counter -->
<textarea id="bio" name="bio" maxlength="150"></textarea>
<output id="count">0</output>/150
<script>
    document.getElementById('bio').addEventListener('input', (e) => {
        document.getElementById('count').textContent = e.target.value.length;
    });
</script>
```

### Button Element

**`<button>`** is the recommended button element (not `<input type="submit">`).

```html
<!-- Submit button -->
<button type="submit">Submit Form</button>

<!-- Reset button -->
<button type="reset">Clear Form</button>

<!-- Generic button -->
<button type="button" onclick="doSomething()">Click Me</button>

<!-- Button with icon/content -->
<button type="button">
    <svg width="16" height="16">...</svg>
    Download
</button>

<!-- Disabled button -->
<button type="submit" disabled>Submitting...</button>

<!-- Button outside form (using form attribute) -->
<form id="myform">
    <input type="text" name="username">
</form>
<button type="submit" form="myform">Submit</button>
```

---

## 10.6 HTML5 Form Validation

HTML5 provides **built-in validation** without JavaScript.

### Required Attribute

```html
<!-- Field is required -->
<input type="text" name="username" required>
<input type="email" name="email" required>
<select name="country" required>
    <option value="">-- Select --</option>
    <option>USA</option>
</select>

<!-- Show validation error message -->
<input type="text" name="name" required
       title="Name is required">
```

### Type Validation

```html
<!-- Automatic type validation -->
<input type="email" name="email" required>
<!-- Validates email format automatically -->

<input type="number" name="age" required>
<!-- Only accepts numbers -->

<input type="url" name="website">
<!-- Validates URL format -->

<input type="date" name="birthdate">
<!-- Date picker with format validation -->
```

### Length Constraints

```html
<!-- Minimum and maximum length -->
<input type="text" name="username"
       minlength="3"
       maxlength="20">

<!-- Minimum and maximum number -->
<input type="number" name="age"
       min="18"
       max="100">

<!-- Date range -->
<input type="date" name="birthdate"
       min="1950-01-01"
       max="2010-12-31">

<!-- Time range -->
<input type="time" name="appointment"
       min="09:00"
       max="17:00">
```

### Pattern Validation

```html
<!-- Custom regex pattern -->
<input type="text" name="phone"
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
       placeholder="123-456-7890"
       title="Format: 123-456-7890">

<!-- Username (alphanumeric only) -->
<input type="text" name="username"
       pattern="[a-zA-Z0-9]+"
       title="Username can only contain letters and numbers">

<!-- Postal code -->
<input type="text" name="zip"
       pattern="[0-9]{5}"
       title="Postal code must be 5 digits">
```

### Step Validation

```html
<!-- Number step -->
<input type="number" name="quantity"
       step="1"
       min="0">

<!-- Decimal step -->
<input type="number" name="price"
       step="0.01"
       min="0"
       placeholder="0.00">

<!-- Time step (every 30 minutes) -->
<input type="time" name="appointment"
       step="1800">
```

### Validation Feedback

```html
<!-- HTML5 native error messages -->
<input type="email" name="email" required>
<!-- Browser shows: "Please include an @ in the email address" -->

<!-- Custom error message with title -->
<input type="text" name="username"
       minlength="3"
       title="Username must be at least 3 characters">

<!-- JavaScript for custom validation -->
<form id="myform">
    <input type="text" id="username" name="username" required>
</form>
<script>
    document.getElementById('myform').addEventListener('submit', (e) => {
        const username = document.getElementById('username').value;
        if (username.length < 3) {
            e.preventDefault();
            e.target.username.setCustomValidity('Username must be at least 3 characters');
        }
    });
</script>
```

---

## 10.7 Fieldset and Legend: Grouping Inputs

**`<fieldset>`** groups related form controls. **`<legend>`** provides a title for the group.

```html
<!-- Basic fieldset -->
<form>
    <fieldset>
        <legend>Personal Information</legend>

        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </fieldset>

    <fieldset>
        <legend>Contact Preferences</legend>

        <label>
            <input type="checkbox" name="phone">
            Call me
        </label>

        <label>
            <input type="checkbox" name="email">
            Email me
        </label>
    </fieldset>

    <button type="submit">Submit</button>
</form>
```

### Disabled Fieldset

```html
<!-- All inputs in fieldset disabled -->
<fieldset disabled>
    <legend>Previous Address (if applicable)</legend>

    <label for="street">Street:</label>
    <input type="text" id="street" name="prev_street">

    <label for="city">City:</label>
    <input type="text" id="city" name="prev_city">
</fieldset>
```

---

## 10.8 Advanced Input Attributes

### Disabled vs Readonly

```html
<!-- DISABLED: Not included in form submission, gray appearance -->
<input type="text" name="id" value="123" disabled>
<!-- Won't be sent to server -->

<!-- READONLY: Included in submission, appears editable but can't be modified -->
<input type="text" name="timestamp" value="2024-03-18" readonly>
<!-- Will be sent to server with value -->
```

### Placeholder vs Value

```html
<!-- Placeholder: Hint text (disappears when typing) -->
<input type="text" name="search"
       placeholder="Enter search term">

<!-- Value: Default value (remains until changed) -->
<input type="text" name="city"
       value="New York">

<!-- Both: Placeholder visible when empty, value is default -->
<input type="email" name="email"
       value="user@example.com"
       placeholder="example@domain.com">
```

### Autocomplete

```html
<!-- Enable autocomplete (browser remembers) -->
<input type="email" name="email" autocomplete="email">
<input type="password" name="password" autocomplete="current-password">

<!-- Disable autocomplete -->
<input type="password" name="sensitive" autocomplete="off">

<!-- Specific autocomplete hints -->
<input type="text" name="cardname" autocomplete="cc-name">
<input type="text" name="cardnumber" autocomplete="cc-number">
```

### Size and Maxlength

```html
<!-- Visual size (columns displayed) -->
<input type="text" name="username" size="20">

<!-- Maximum input length -->
<input type="text" name="code" maxlength="6">

<!-- For textarea: rows and cols -->
<textarea name="message" rows="5" cols="40"></textarea>
```

---

## 10.9 Output, Progress, and Meter Elements

### Output: Calculation Results

```html
<!-- Display calculation result -->
<form oninput="result.value=parseInt(a.value)+parseInt(b.value)">
    <input type="number" id="a" value="0"> +
    <input type="number" id="b" value="0">
    =
    <output id="result" name="result">0</output>
</form>

<!-- Product selector showing total -->
<select onchange="updateTotal()">
    <option value="10">Item 1 - $10</option>
    <option value="20">Item 2 - $20</option>
</select>
<output name="total">$10</output>
```

### Progress: Progress Bar

```html
<!-- Progress indicator -->
<label for="progress">Download Progress:</label>
<progress id="progress" value="35" max="100"></progress> 35%

<!-- In JavaScript -->
<progress id="upload" value="0" max="100"></progress>
<script>
    document.getElementById('upload').value = 75; // 75% complete
</script>
```

### Meter: Measurement Gauge

```html
<!-- Gauge display -->
<label for="storage">Storage Used:</label>
<meter id="storage" value="6" min="0" max="10"></meter>

<!-- Low, high, and optimum values -->
<label for="temp">Temperature:</label>
<meter value="37" min="35" max="40" low="36" high="39" optimum="37.5"></meter>

<!-- Rating gauge -->
<label for="rating">Product Rating:</label>
<meter id="rating" value="4" min="1" max="5"></meter>
```

---

## 10.10 Form Best Practices and Accessibility

### Accessible Form Layout

```html
<!-- ✓ GOOD: Clear labels, logical grouping, good spacing -->
<form>
    <fieldset>
        <legend>Sign Up</legend>

        <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required
                   aria-required="true"
                   aria-describedby="email-help">
            <small id="email-help">We'll never share your email</small>
        </div>

        <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" name="password" required
                   minlength="8"
                   aria-required="true"
                   aria-describedby="pwd-help">
            <small id="pwd-help">At least 8 characters</small>
        </div>

        <button type="submit">Create Account</button>
    </fieldset>
</form>

<style>
    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input {
        display: block;
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
    }

    small {
        display: block;
        margin-top: 0.25rem;
        color: #666;
        font-size: 0.875rem;
    }
</style>
```

### Error Messages and Validation

```html
<!-- Clear error handling -->
<form id="loginform">
    <fieldset>
        <legend>Login</legend>

        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
            <span id="username-error" role="alert"></span>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            <span id="password-error" role="alert"></span>
        </div>

        <button type="submit">Login</button>
    </fieldset>
</form>

<script>
    document.getElementById('loginform').addEventListener('submit', (e) => {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        let isValid = true;

        // Clear previous errors
        document.getElementById('username-error').textContent = '';
        document.getElementById('password-error').textContent = '';

        // Validate username
        if (username.value.length < 3) {
            document.getElementById('username-error').textContent =
                    'Username must be at least 3 characters';
            isValid = false;
        }

        // Validate password
        if (password.value.length < 8) {
            document.getElementById('password-error').textContent =
                    'Password must be at least 8 characters';
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            username.focus(); // Focus first error field
        }
    });
</script>
```

### Form Focus and Keyboard Navigation

```html
<!-- Proper tab order -->
<form>
    <input type="text" name="first" tabindex="1" placeholder="First">
    <input type="text" name="second" tabindex="2" placeholder="Second">
    <input type="text" name="third" tabindex="3" placeholder="Third">

    <!-- Skip back button (rarely needed) -->
    <button type="button" tabindex="0">Help</button>

    <button type="submit" tabindex="4">Submit</button>
</form>

<!-- Natural tab order (recommended) -->
<form>
    <input type="text" name="first" placeholder="First">
    <input type="text" name="second" placeholder="Second">
    <input type="text" name="third" placeholder="Third">
    <button type="submit">Submit</button>
    <!-- Tab order: first → second → third → submit (automatic) -->
</form>
```

---

## 10.11 Common Form Mistakes

### Mistake 1: Missing Labels

```html
<!-- ✗ WRONG: No labels -->
<input type="text" placeholder="Name">
<input type="email" placeholder="Email">

<!-- ✓ CORRECT: Clear labels -->
<label for="name">Name:</label>
<input type="text" id="name" name="name" placeholder="John Doe">

<label for="email">Email:</label>
<input type="email" id="email" name="email" placeholder="john@example.com">
```

### Mistake 2: Using Div Instead of Fieldset

```html
<!-- ✗ WRONG: Using div for grouping -->
<div class="form-section">
    <h3>Address</h3>
    <input type="text" placeholder="Street">
    <input type="text" placeholder="City">
</div>

<!-- ✓ CORRECT: Using fieldset -->
<fieldset>
    <legend>Address</legend>
    <input type="text" placeholder="Street">
    <input type="text" placeholder="City">
</fieldset>
```

### Mistake 3: Placeholder Instead of Label

```html
<!-- ✗ WRONG: Only placeholder (disappears when typing) -->
<input type="email" placeholder="Email address">

<!-- ✓ CORRECT: Label + optional placeholder -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email"
       placeholder="example@domain.com">
```

### Mistake 4: No Validation

```html
<!-- ✗ WEAK: No validation -->
<input type="text" name="email">

<!-- ✓ BETTER: Built-in HTML5 validation -->
<input type="email" name="email" required>

<!-- ✓ BEST: Validation + helpful text -->
<label for="email">Email Address *</label>
<input type="email" id="email" name="email" required
       aria-describedby="email-help">
<small id="email-help">We'll never share your email</small>
```

### Mistake 5: Submitting Sensitive Data via GET

```html
<!-- ✗ WRONG: GET method with password (visible in URL) -->
<form action="/login" method="GET">
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>

<!-- ✓ CORRECT: POST method for sensitive data -->
<form action="/login" method="POST">
    <input type="email" name="email">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
```

---

## Summary: Section 10 Key Takeaways

- ✅ **`<form>` with action and method** (GET vs POST)
- ✅ **`<label for="">` + `id` association** for accessibility
- ✅ **20+ input types** (text, email, password, number, date, color, file, etc.)
- ✅ **HTML5 validation**: required, type, min, max, minlength, maxlength, pattern
- ✅ **`<select>` for fixed options**, **`<datalist>` for autocomplete**
- ✅ **`<optgroup>`** to group options
- ✅ **`<fieldset>` and `<legend>`** for grouping related inputs
- ✅ **`<textarea>`** for multi-line text
- ✅ **`<button type="">` (submit, reset, button)**
- ✅ **`<output>`, `<progress>`, `<meter>`** for special displays
- ✅ **Disabled vs readonly** (different submission behavior)
- ✅ **POST for sensitive data**, GET for search/filters
- ✅ **Keyboard navigation** (tab order, focus management)
- ✅ **Clear labels, validation, and error messages** (accessibility)
- ❌ **Never**: Skip labels (always use for/id association)
- ❌ **Never**: Use placeholder as label
- ❌ **Never**: Submit passwords via GET method
- ❌ **Never**: Use div instead of fieldset for grouping
- ❌ **Never**: Skip validation on sensitive inputs (email, password, number)
- ❌ **Never**: Ignore keyboard navigation and focus management
- ❌ **Never**: Forget name attribute (data won't be sent)

---

## Links & Resources

- [MDN: Form Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [MDN: Input Types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [MDN: HTML5 Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [WCAG: Forms](https://www.w3.org/WAI/tutorials/forms/)
- [WebAIM: Forms](https://webaim.org/articles/forms/)
- [HTML Living Standard: Forms](https://html.spec.whatwg.org/multipage/forms.html)
- [Web.dev: Sign-in Form Best Practices](https://web.dev/sign-in-form-best-practices/)

---

# 11. Metadata, SEO, and Document Head

## 11.1 Purpose of the Head Element

The **`<head>`** element contains **metadata** about the document—information for browsers, search engines, and social
media platforms. Content in `<head>` is **not displayed** on the page.

### Critical Head Elements (Every Page Needs These)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Character encoding (must be first) -->
    <meta charset="UTF-8">

    <!-- Viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Page title (browser tab, search results, bookmarks) -->
    <title>Page Title - Your Site Name</title>

    <!-- Description for search results and social sharing -->
    <meta name="description" content="Brief description of page content (150-160 characters)">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<!-- Page content -->
</body>
</html>
```

---

## 11.2 Meta Tags: Comprehensive Reference

**Meta tags** provide metadata to browsers and tools. All go in the `<head>` element.

### Essential Meta Tags

#### Charset (MUST be first in head)

```html
<!-- Character encoding -->
<meta charset="UTF-8">
```

#### Viewport (Mobile Responsiveness)

```html
<!-- Mobile-friendly viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### Description (Search Results)

```html
<!-- Page description (150-160 chars for search results) -->
<meta name="description"
      content="Complete HTML guide covering all elements, attributes, and best practices for web development. Learn semantic HTML, forms, accessibility, and more.">
```

#### Theme Color (Browser UI)

```html
<!-- Color for browser address bar and tab (Chrome, Edge, Android) -->
<meta name="theme-color" content="#0066cc">
```

#### Color Scheme (Dark/Light Mode)

```html
<!-- Hint for light or dark mode preference -->
<meta name="color-scheme" content="light dark">
<!-- Browser will respect system preference -->
```

### Search Engine and Robot Meta Tags

#### Robots Meta Tag

```html
<!-- Control indexing and following -->
<meta name="robots" content="index, follow">
<!-- Options: index/noindex, follow/nofollow -->

<!-- Don't index, don't follow -->
<meta name="robots" content="noindex, nofollow">

<!-- Index but don't follow links -->
<meta name="robots" content="index, nofollow">

<!-- Specific robot directives -->
<meta name="googlebot" content="index, follow">
<meta name="bingbot" content="index, follow">
```

#### Canonical URL (SEO)

```html
<!-- Preferred URL for this page (prevents duplicate content) -->
<link rel="canonical" href="https://example.com/article">

<!-- Use case: Different URLs for same content -->
<!-- https://example.com/article -->
<!-- https://example.com/article?utm_source=email -->
<!-- Both have canonical link to first version -->
```

---

## 11.3 Open Graph: Social Media Sharing

**Open Graph** tags control how content appears when shared on Facebook, LinkedIn, etc.

### Basic Open Graph Tags

```html
<!-- Open Graph meta tags for social sharing -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description shown when shared">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
```

### Open Graph Image Requirements

```html
<!-- Image for social sharing (important!) -->
<meta property="og:image" content="https://example.com/share-image.jpg">

<!-- Image specifications (recommended) -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Description of image">

<!-- Multiple images (for image carousel) -->
<meta property="og:image" content="https://example.com/image1.jpg">
<meta property="og:image" content="https://example.com/image2.jpg">
<meta property="og:image" content="https://example.com/image3.jpg">
```

**Optimal dimensions for social sharing:**

- **Aspect ratio**: 1.91:1 (width:height)
- **Recommended**: 1200x630 pixels
- **Format**: JPG, PNG, or GIF
- **Size**: < 8MB

### Open Graph Article Tags

```html
<!-- For articles and blog posts -->
<meta property="og:type" content="article">
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Article excerpt">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/article">

<!-- Publication metadata -->
<meta property="article:published_time" content="2024-03-18T10:00:00Z">
<meta property="article:modified_time" content="2024-03-18T15:00:00Z">
<meta property="article:author" content="https://facebook.com/author">
<meta property="article:section" content="Technology">
<meta property="article:tag" content="HTML">
<meta property="article:tag" content="Web Development">
```

### Complete Open Graph Example

```html

<head>
    <!-- Basic -->
    <meta property="og:title" content="How to Learn HTML - Complete Guide">
    <meta property="og:description"
          content="Master HTML with this comprehensive guide covering all elements, semantics, forms, and accessibility best practices.">
    <meta property="og:url" content="https://example.com/html-guide">
    <meta property="og:type" content="article">

    <!-- Image (1200x630 is ideal) -->
    <meta property="og:image" content="https://example.com/html-guide-1200x630.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="HTML code editor showing semantic elements">

    <!-- Article-specific -->
    <meta property="article:published_time" content="2024-03-18T10:00:00Z">
    <meta property="article:author" content="Jane Developer">
    <meta property="article:section" content="Web Development">
    <meta property="article:tag" content="HTML">
</head>
```

---

## 11.4 Twitter Card Tags

**Twitter Cards** control how links appear when shared on Twitter/X.

### Twitter Card Types

#### Summary Card (Default)

```html
<!-- Summary card with image -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

#### Summary Card with Large Image

```html
<!-- Summary with larger image -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Article Title">
<meta name="twitter:description" content="Article excerpt">
<meta name="twitter:image" content="https://example.com/large-image.jpg">
```

#### Complete Twitter Card Example

```html

<head>
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Learn HTML: Complete Guide">
    <meta name="twitter:description"
          content="Master HTML with this comprehensive guide covering all elements and best practices.">
    <meta name="twitter:image" content="https://example.com/image-1200x630.jpg">

    <!-- Creator (optional) -->
    <meta name="twitter:creator" content="@yourhandle">

    <!-- Site (optional) -->
    <meta name="twitter:site" content="@yoursite">
</head>
```

---

## 11.5 Structured Data: JSON-LD

**Structured data** (JSON-LD) helps search engines understand content and enables rich snippets (ratings, prices, FAQs,
etc.).

### JSON-LD Basics

```html
<!-- Structured data in JSON-LD format -->
<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Learn HTML",
      "description": "Complete guide to HTML",
      "author": {
        "@type": "Person",
        "name": "Jane Developer"
      },
      "datePublished": "2024-03-18",
      "image": "https://example.com/image.jpg"
    }
</script>
```

### Schema.org Types (Common)

#### Article

```html

<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Article Title",
      "description": "Article summary",
      "image": "https://example.com/image.jpg",
      "datePublished": "2024-03-18T10:00:00Z",
      "dateModified": "2024-03-18T15:00:00Z",
      "author": {
        "@type": "Person",
        "name": "Author Name"
      }
    }
</script>
```

#### Product

```html

<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Product Name",
      "description": "Product description",
      "image": "https://example.com/product.jpg",
      "brand": {
        "@type": "Brand",
        "name": "Brand Name"
      },
      "offers": {
        "@type": "Offer",
        "price": "19.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "100"
      }
    }
</script>
```

#### Organization

```html

<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Company Name",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png",
      "description": "Company description",
      "foundingDate": "2020",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "telephone": "+1-800-123-4567",
        "email": "support@example.com"
      }
    }
</script>
```

#### FAQ (Rich Snippet)

```html

<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is HTML?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HTML is the markup language for creating web pages."
          }
        },
        {
          "@type": "Question",
          "name": "Is HTML a programming language?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, HTML is a markup language, not a programming language."
          }
        }
      ]
    }
</script>
```

#### Event

```html

<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Web Development Conference",
      "description": "Learn the latest in web development",
      "startDate": "2024-06-15T09:00:00",
      "endDate": "2024-06-15T17:00:00",
      "location": {
        "@type": "Place",
        "name": "Convention Center",
        "address": "123 Main St, New York, NY"
      },
      "image": "https://example.com/event.jpg",
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "USD"
      }
    }
</script>
```

---

## 11.6 Language and Internationalization: Hreflang

The **`hreflang`** attribute tells search engines about **alternate language versions** of a page.

### Basic Hreflang Pattern

```html
<!-- English version -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">

<!-- Spanish version -->
<link rel="alternate" hreflang="es" href="https://example.com/es/page">

<!-- French version -->
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">

<!-- Fallback (use if no exact language match) -->
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

### Self-Referential Hreflang

```html
<!-- Each version links to itself + alternates -->
<!-- On English page: -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">

<!-- On Spanish page: -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">
```

### Regional Variations (Language + Country)

```html
<!-- Spanish in Spain -->
<link rel="alternate" hreflang="es-ES" href="https://example.com/es-es/page">

<!-- Spanish in Mexico -->
<link rel="alternate" hreflang="es-MX" href="https://example.com/es-mx/page">

<!-- English in USA -->
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/page">

<!-- English in UK -->
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/page">
```

---

## 11.7 Resource Hints: Performance Optimization

**Resource hints** tell the browser **how to prioritize resource loading**.

### DNS Prefetch

```html
<!-- Resolve DNS for third-party domain in advance -->
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//analytics.google.com">

<!-- Typical use: APIs, CDNs, third-party services -->
```

**When to use**: Many third-party domains you'll connect to later (analytics, fonts, APIs).

### Preconnect

```html
<!-- Establish full connection (DNS + TCP + TLS) in advance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- More aggressive than dns-prefetch, use for critical resources -->
```

**When to use**: Critical third-party services loaded in page (fonts, API responses).

### Prefetch

```html
<!-- Download resource when browser is idle (lower priority) -->
<!-- Used for likely next page -->
<link rel="prefetch" href="/likely-next-page.html">
<link rel="prefetch" href="/styles-for-next-page.css">

<!-- Don't use for current page resources -->
```

**When to use**: Resources likely needed for next page (pagination, navigation flows).

### Preload

```html
<!-- Download resource now, high priority -->
<!-- Used for critical resources on current page -->
<link rel="preload" href="/fonts/custom-font.woff2" as="font" crossorigin>
<link rel="preload" href="/images/hero.jpg" as="image">
<link rel="preload" href="/scripts/critical.js" as="script">

<!-- Must include "as" attribute specifying resource type -->
```

**"as" values**: style, script, image, font, fetch, document, audio, video, track

### Complete Performance Pattern

```html

<head>
    <!-- Critical for rendering -->
    <link rel="preload" href="fonts/main.woff2" as="font" type="font/woff2" crossorigin>

    <!-- Third-party connections (establish early) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//cdn.example.com">
    <link rel="dns-prefetch" href="//analytics.google.com">

    <!-- External stylesheet -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700">

    <!-- Prefetch next page (if using pagination) -->
    <link rel="prefetch" href="/?page=2">

    <!-- Critical styles inline or preloaded -->
    <style>
        /* Critical CSS for above-the-fold */
    </style>
</head>
```

---

## 11.8 Security Meta Tags

### Content Security Policy (CSP)

```html
<!-- Prevent XSS and injection attacks -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'">

<!-- More restrictive (recommended) -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' fonts.googleapis.com">

<!-- Allow specific sources -->
<meta http-equiv="Content-Security-Policy"
      content="script-src 'self' cdn.example.com; img-src 'self' *.example.com">
```

**Note**: CSP is better configured via HTTP headers than meta tags.

### X-UA-Compatible (Deprecated)

```html
<!-- Force latest IE mode (deprecated, IE is dead) -->
<meta http-equiv="X-UA-Compatible" content="ie=edge">

<!-- Don't use in modern projects -->
```

---

## 11.9 Favicon: Browser Icon

```html
<!-- Favicon (appears in browser tab) -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- Modern format (recommended) -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple touch icon (iOS home screen) -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<!-- Web app manifest (PWA) -->
<link rel="manifest" href="/site.webmanifest">
```

---

## 11.10 Complete Head Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- === ESSENTIAL === -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - Site Name</title>
    <meta name="description" content="150-160 character description for search results">

    <!-- === APPEARANCE === -->
    <meta name="theme-color" content="#0066cc">
    <meta name="color-scheme" content="light dark">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- === OPEN GRAPH (Social Sharing) === -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="Page description">
    <meta property="og:image" content="https://example.com/og-image-1200x630.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://example.com/page">

    <!-- === TWITTER CARD === -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Page Title">
    <meta name="twitter:description" content="Page description">
    <meta name="twitter:image" content="https://example.com/og-image-1200x630.jpg">

    <!-- === MULTILINGUAL === -->
    <link rel="alternate" hreflang="en" href="https://example.com/en/page">
    <link rel="alternate" hreflang="es" href="https://example.com/es/page">
    <link rel="alternate" hreflang="x-default" href="https://example.com/page">

    <!-- === SEARCH ENGINE === -->
    <link rel="canonical" href="https://example.com/page">
    <meta name="robots" content="index, follow">

    <!-- === PERFORMANCE === -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//cdn.example.com">
    <link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin>

    <!-- === STYLESHEETS === -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700">
    <link rel="stylesheet" href="/styles.css">

    <!-- === STRUCTURED DATA === -->
    <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Title",
          "description": "Page description",
          "url": "https://example.com/page"
        }
    </script>
</head>
<body>
<!-- Page content -->
</body>
</html>
```

---

## 11.11 Common SEO Mistakes

### Mistake 1: Missing or Thin Description

```html
<!-- ✗ WRONG: No description -->
<head>
    <title>Page</title>
    <!-- No description meta tag -->
</head>

<!-- ✓ CORRECT: Clear, descriptive meta description -->
<head>
    <title>Learn HTML: Complete Guide for Beginners</title>
    <meta name="description"
          content="Master HTML with this comprehensive guide covering all elements, semantics, forms, and accessibility best practices for modern web development.">
</head>
```

### Mistake 2: Poor Open Graph Image

```html
<!-- ✗ WRONG: No og:image or wrong dimensions -->
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Article description">
<!-- Missing og:image -->

<!-- ✓ CORRECT: Proper og:image with correct dimensions -->
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Article description">
<meta property="og:image" content="https://example.com/share-image-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

### Mistake 3: Duplicate Content Without Canonical

```html
<!-- ✗ WRONG: No canonical URL -->
<!-- Multiple URLs with same content:
  https://example.com/article
  https://example.com/article?utm_source=email
  https://example.com/article?sort=date
-->
<!-- No canonical link -->

<!-- ✓ CORRECT: Canonical links to preferred version -->
<link rel="canonical" href="https://example.com/article">
```

### Mistake 4: Inadequate Structured Data

```html
<!-- ✗ WEAK: No structured data -->
<h1>Product Name</h1>
<p>Product description</p>
<p>Price: $19.99</p>
<p>Rating: 4.5/5</p>

<!-- ✓ BETTER: Structured data enables rich results -->
<h1>Product Name</h1>
<p>Product description</p>
<p>Price: $19.99</p>
<p>Rating: 4.5/5</p>

<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Product Name",
      "description": "Product description",
      "offers": {
        "@type": "Offer",
        "price": "19.99",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "100"
      }
    }
</script>
```

### Mistake 5: Not Using Hreflang for Multilingual Sites

```html
<!-- ✗ WRONG: Multiple language versions without hreflang -->
<!-- Site has /en/, /es/, /fr/ but no hreflang links -->
<!-- Search engines treat as duplicate content -->

<!-- ✓ CORRECT: Hreflang on each language version -->
<!-- On /en/page: -->
<link rel="alternate" hreflang="en" href="https://example.com/en/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

---

## Summary: Section 11 Key Takeaways

- ✅ **Critical head elements**: charset, viewport, title, description, stylesheet
- ✅ **Open Graph tags** control social media appearance (og:image 1200x630 is critical)
- ✅ **Twitter Cards** for Twitter/X sharing (summary_large_image recommended)
- ✅ **Structured data (JSON-LD)** enables rich snippets and SEO benefits
- ✅ **Hreflang** for multilingual sites (language-specific versions)
- ✅ **Canonical URL** prevents duplicate content issues
- ✅ **Resource hints** (dns-prefetch, preconnect, prefetch, preload) for performance
- ✅ **Favicon** for branding and browser tab appearance
- ✅ **Theme color** and **color-scheme** for visual consistency
- ✅ **CSP meta tag** for security (though HTTP headers preferred)
- ✅ **Title 50-60 chars**, **description 150-160 chars** (search result constraints)
- ✅ **Test with**: Google Search Console, Facebook Debugger, Twitter Card Validator
- ❌ **Never**: Skip meta description (impacts click-through from search)
- ❌ **Never**: Use wrong og:image dimensions (1.91:1 aspect ratio, 1200x630 recommended)
- ❌ **Never**: Have duplicate content without canonical URL
- ❌ **Never**: Forget charset (must be first in head)
- ❌ **Never**: Skip viewport meta tag (breaks mobile responsiveness)
- ❌ **Never**: Use multiple language versions without hreflang

---

## Tools and Resources

- [Google Search Console](https://search.google.com/search-console)
- [Facebook Debugger](https://developers.facebook.com/tools/debug)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Documentation](https://schema.org/)
- [MDN: The Document Metadata Element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)
- [Web.dev: SEO for developers](https://web.dev/lighthouse-seo/)
- [Structured Data Testing Tool](https://search.google.com/test/rich-results)

---

## Links & Resources

- [MDN: Meta Tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
- [MDN: Open Graph Protocol](https://ogp.me/)
- [MDN: Link Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
- [HTML Living Standard: Document Metadata](https://html.spec.whatwg.org/multipage/semantics.html#semantics-2)
- [Yoast SEO Guide](https://yoast.com/meta-descriptions/)
- [Google Search Central: Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

---

# 12. Accessibility in HTML

## 12.1 Why Accessibility Matters

**Web accessibility** ensures everyone can use your site, regardless of ability. Over **1 billion people worldwide**
have disabilities (WHO), and digital accessibility is **legally required** (ADA, WCAG, EN 301 549 in different regions).

### The POUR Principles

**WCAG 2.1** (Web Content Accessibility Guidelines) organizes accessibility into four principles:

#### 1. Perceivable: Content Must Be Perceivable

Users must be able to **perceive content** regardless of sensory limitations.

**Key requirements:**

- Text alternatives for images (alt text)
- Captions and transcripts for audio/video
- Sufficient color contrast (4.5:1 for normal text)
- Text is not the only way to convey information
- Resizable text and no loss of functionality when zoomed

```html
<!-- ✓ PERCEIVABLE: Alt text, captions, sufficient contrast -->
<img src="chart.png" alt="Sales increased 25% year-over-year">
<video controls>
    <track kind="captions" src="captions.vtt">
</video>
<button style="color: white; background: #0066cc;">Submit</button>
<!-- 4.5:1 contrast ratio ✓ -->

<!-- ✗ NOT PERCEIVABLE: No alt text, no captions, poor contrast -->
<img src="chart.png">
<video controls></video> <!-- No captions -->
<button style="color: gray; background: lightgray;">Submit</button>
<!-- Poor contrast ✗ -->
```

#### 2. Operable: Functionality Must Be Operable

Users must be able to **operate interface controls** regardless of input method.

**Key requirements:**

- All functionality available via keyboard (no mouse-only)
- No keyboard traps (can tab out of elements)
- Sufficient time to interact (no auto-advancing content)
- No seizure-inducing flashing (> 3 flashes per second)
- Skip links and landmark navigation

```html
<!-- ✓ OPERABLE: Keyboard accessible, skip link, landmarks -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<header>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>
<main id="main-content">
    <h1>Page Title</h1>
    <p>Content accessible by keyboard and screen readers</p>
</main>

<!-- ✗ NOT OPERABLE: Mouse-only interactions -->
<div onmouseover="showMenu()">Menu</div>
<!-- Can't operate via keyboard -->
```

#### 3. Understandable: Content Must Be Understandable

Users must be able to **understand content and interface**.

**Key requirements:**

- Clear, simple language
- Predictable navigation and interaction
- Form labels and error messages
- Consistent interface patterns
- Headings and lists for structure

```html
<!-- ✓ UNDERSTANDABLE: Clear structure, labeled form, good language -->
<form>
    <h2>Login</h2>
    <label for="email">Email Address *</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password *</label>
    <input type="password" id="password" name="password" required>

    <button type="submit">Sign In</button>
</form>

<!-- ✗ NOT UNDERSTANDABLE: No labels, unclear language -->
<form>
    <p>Enter your info</p>
    <input type="email"> <!-- No label -->
    <input type="password"> <!-- No label -->
    <button>Go</button> <!-- Unclear action -->
</form>
```

#### 4. Robust: Content Must Be Robust

Content must work with **current and future assistive technologies**.

**Key requirements:**

- Valid HTML (no syntax errors)
- Proper semantic markup
- ARIA used correctly when needed
- No reliance on proprietary technologies

```html
<!-- ✓ ROBUST: Valid HTML, semantic elements, proper ARIA -->
<button type="button" aria-label="Close menu">×</button>
<nav aria-label="Primary navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<!-- ✗ NOT ROBUST: Invalid HTML, no semantics -->
<div onclick="closeMenu()">×</div> <!-- Wrong element -->
<div class="nav"> <!-- No semantic meaning -->
    <span><a href="/">Home</a></span>
</div>
```

---

## 12.2 Semantic HTML: The Foundation

**The most important accessibility practice is using semantic HTML.**

### Semantic HTML Provides Accessibility Automatically

```html
<!-- SEMANTIC: Accessibility built-in -->
<header>Page header</header>
<nav>Navigation</nav>
<main>Main content</main>
<article>Article</article>
<section>Section</section>
<aside>Sidebar</aside>
<footer>Footer</footer>

<!-- Non-semantic: Requires ARIA to make accessible -->
<div role="banner">Page header</div>
<div role="navigation">Navigation</div>
<div role="main">Main content</div>

<!-- Screen readers announce:
  Semantic: "Banner landmark", "Navigation landmark", "Main landmark"
  Non-semantic: Same roles, but harder to maintain
-->
```

### Semantic HTML vs ARIA

**Rule 1: Use semantic HTML before ARIA**

```html
<!-- ✓ CORRECT: Semantic HTML (preferred) -->
<button>Click me</button>
<strong>Important</strong>
<em>Emphasized</em>

<!-- ⚠️ UNNECESSARY: ARIA on semantic element -->
<button role="button">Click me</button> <!-- Role is redundant -->

<!-- ✗ WRONG: ARIA instead of semantic -->
<div role="button">Click me</div> <!-- Use <button> instead -->
```

**Rule 2: ARIA only when semantic HTML insufficient**

```html
<!-- Semantic HTML solution (preferred) -->
<article>Content</article>

<!-- ARIA solution (only when semantic HTML won't work) -->
<div role="article">Content</div> <!-- Only use if <article> impossible -->
```

---

## 12.3 HTML5 Landmark Elements and Navigation

**Landmarks** are regions that assistive technology users can navigate directly to.

### Landmark Elements and Implicit Roles

```html
<!-- Each landmark has an implicit ARIA role -->
<header>          <!-- role="banner" (page-level) -->
    <nav>             <!-- role="navigation" -->
        <main>            <!-- role="main" -->
            <article>         <!-- role="article" -->
                <section>         <!-- role="region" -->
                    <aside>           <!-- role="complementary" -->
                        <footer>          <!-- role="contentinfo" (page-level) -->

                            <!-- Screen reader: Lists all landmarks and lets user jump between them -->
```

### Using Aria-Label with Multiple Landmarks

```html
<!-- Distinguish multiple landmarks of same type -->
<nav aria-label="Primary navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
</nav>

<main>
    <article>Article content</article>
</main>

<nav aria-label="Pagination">
    <a href="?page=1">Previous</a>
    <a href="?page=3">Next</a>
</nav>

<footer>
    <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
    </nav>
</footer>

<!-- Screen reader announces:
  "Primary navigation landmark"
  "Main landmark"
  "Pagination navigation landmark"
  "Footer navigation landmark"
-->
```

### Skip Links: Bypass Repetitive Content

```html

<body>
<!-- Hidden skip link (visible on focus) -->
<a href="#main-content" class="skip-link">
    Skip to main content
</a>

<!-- Repeated header (every page) -->
<header>
    <nav>Primary navigation</nav>
</header>

<!-- Unique content (page-specific) -->
<main id="main-content">
    <h1>Page Title</h1>
    <p>Content</p>
</main>

<footer>Footer</footer>
</body>

<style>
    .skip-link {
        position: absolute;
        left: -9999px;
        z-index: 999;
    }

    .skip-link:focus {
        left: 0;
        top: 0;
        right: auto;
    }
</style>
```

---

## 12.4 Color Contrast Requirements (WCAG)

**Color contrast** must meet minimum ratios so users with low vision can read text.

### WCAG Contrast Ratios

| Level              | Normal Text | Large Text | Graphics |
|--------------------|-------------|------------|----------|
| **AA (Minimum)**   | 4.5:1       | 3:1        | 3:1      |
| **AAA (Enhanced)** | 7:1         | 4.5:1      | 3:1      |

**Normal text**: < 18pt or < 14pt bold
**Large text**: ≥ 18pt or ≥ 14pt bold

### Calculating Contrast Ratio

```html
<!-- Calculate: Use WCAG contrast formula or tools -->

<!-- ✓ GOOD: Black on white = 21:1 (exceeds AAA) -->
<p style="color: #000000; background: #ffffff;">High contrast text</p>

<!-- ✓ GOOD: Dark blue on white = 8.6:1 (exceeds AA and AAA) -->
<p style="color: #003399; background: #ffffff;">Good contrast</p>

<!-- ⚠️ MINIMUM AA: Navy on light blue = 4.5:1 (AA only) -->
<p style="color: #000080; background: #ADD8E6;">Minimum contrast</p>

<!-- ✗ FAILS: Gray on white = 4.2:1 (less than 4.5:1 AA) -->
<p style="color: #777777; background: #ffffff;">Poor contrast text</p>

<!-- ✗ FAILS: Yellow text on light background = 1.4:1 -->
<p style="color: #ffff00; background: #ffffff;">Unreadable</p>
```

### Testing Contrast

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [Browser DevTools](https://developer.chrome.com/docs/devtools/) (built-in checker)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (automated audit)

### Common Contrast Mistakes

```html
<!-- ✗ WRONG: Colored text is often too light -->
<p style="color: #cc99ff;">Purple text (too light)</p>
<p style="color: #66ccff;">Light blue text (too light)</p>

<!-- ✓ CORRECT: Darker colors for text -->
<p style="color: #663399;">Dark purple</p>
<p style="color: #0066cc;">Dark blue</p>

<!-- ✗ WRONG: Light text on light background -->
<p style="color: #cccccc; background: #ffffff;">Gray on white (bad)</p>

<!-- ✓ CORRECT: Sufficient contrast -->
<p style="color: #333333; background: #ffffff;">Dark gray on white (good)</p>
```

---

## 12.5 Image Accessibility: Alt Text

**Alt text** describes images for screen reader users and when images fail to load.

### Alt Text Best Practices

#### Informative Images: Describe the Content

```html
<!-- ✓ GOOD: Descriptive alt text -->
<img src="team.jpg" alt="Development team at company retreat in 2024">

<!-- ✓ GOOD: Functional description if image has purpose -->
<img src="search-icon.svg" alt="Search">

<!-- ✗ WRONG: Filename -->
<img src="DSC_2024_03_18.jpg" alt="DSC_2024_03_18.jpg">

<!-- ✗ WRONG: "Image of" prefix (redundant, screen readers say "image") -->
<img src="dog.jpg" alt="Image of a golden retriever">
<!-- Better: -->
<img src="dog.jpg" alt="Golden retriever running in park">
```

#### Decorative Images: Empty Alt Text

```html
<!-- DECORATIVE: Empty alt text (not "decorative") -->
<img src="decorative-line.png" alt="">
<!-- Screen reader skips it, good! -->

<!-- ✗ WRONG: "decorative" text -->
<img src="decorative-line.png" alt="decorative">
<!-- Screen reader announces "decorative line image" (unhelpful) -->

<!-- ✗ WRONG: Ornamental images without empty alt -->
<img src="star.png"> <!-- No alt attribute? Worse than empty alt -->
```

#### Linked Images: Describe the Link

```html
<!-- Image is a link: describe destination -->
<a href="/about">
    <img src="company-logo.png" alt="Learn about our company">
</a>

<!-- NOT: -->
<a href="/about">
    <img src="company-logo.png" alt="Company Logo">
</a>
<!-- Says "Company Logo" but doesn't tell where it goes -->
```

#### Complex Images (Charts, Diagrams): Provide Description

```html
<!-- Chart or diagram: Provide detailed description -->
<img src="sales-chart.png"
     alt="Q1 sales by region: North $150K, South $140K, East $160K">

<!-- Or use figure and figcaption: -->
<figure>
    <img src="sales-chart.png" alt="Q1 sales by region">
    <figcaption>
        <strong>Figure 1:</strong> Q1 sales increased across all regions.
        East region led with $160K, followed by North ($150K) and South ($140K).
    </figcaption>
</figure>

<!-- Or provide long description link: -->
<img src="complex-diagram.png"
     alt="System architecture diagram"
     usemap="#architecture">
<a href="/system-architecture-description">Full description of system architecture</a>
```

---

## 12.6 Form Accessibility: Labels and Error Messages

### Required Labels

```html
<!-- ✓ CORRECT: Every input has associated label -->
<label for="email">Email Address *</label>
<input type="email" id="email" name="email" required
       aria-required="true">

<!-- ✗ WRONG: No label (placeholder is not enough) -->
<input type="email" placeholder="Email address">
<!-- Screen reader doesn't announce field purpose -->

<!-- ✗ WRONG: Label without association -->
<label>Email Address</label>
<input type="email"> <!-- No id/for association -->
```

### Form Validation and Error Messages

```html
<!-- Form with validation and error handling -->
<form id="signup-form">
    <div class="form-group">
        <label for="username">Username *</label>
        <input type="text"
               id="username"
               name="username"
               minlength="3"
               required
               aria-required="true"
               aria-describedby="username-error">
        <span id="username-error" role="alert"></span>
    </div>

    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email"
               id="email"
               name="email"
               required
               aria-required="true"
               aria-describedby="email-error">
        <span id="email-error" role="alert"></span>
    </div>

    <button type="submit">Create Account</button>
</form>

<script>
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        let isValid = true;

        // Validate username
        const username = document.getElementById('username');
        const usernameError = document.getElementById('username-error');
        if (username.value.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters';
            username.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            usernameError.textContent = '';
            username.setAttribute('aria-invalid', 'false');
        }

        // Validate email
        const email = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.textContent = 'Please enter a valid email address';
            email.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            emailError.textContent = '';
            email.setAttribute('aria-invalid', 'false');
        }

        if (!isValid) {
            e.preventDefault();
            username.focus(); // Focus first error
        }
    });
</script>
```

---

## 12.7 Keyboard Navigation

All functionality must be available via keyboard.

### Keyboard Navigation Implementation

```html
<!-- Tab order and focus management -->
<form>
    <input type="text" tabindex="1" placeholder="First field">
    <input type="text" tabindex="2" placeholder="Second field">
    <input type="text" tabindex="3" placeholder="Third field">
    <button type="submit" tabindex="4">Submit</button>
</form>

<!-- Better: Natural tab order (no tabindex needed) -->
<form>
    <input type="text" placeholder="First field">
    <input type="text" placeholder="Second field">
    <input type="text" placeholder="Third field">
    <button type="submit">Submit</button>
    <!-- Tab order is automatic: first → second → third → submit -->
</form>

<!-- Focus visible (keyboard users see which element has focus) -->
<style>
    button:focus-visible {
        outline: 3px solid #0066cc;
        outline-offset: 2px;
    }

    input:focus-visible {
        outline: 3px solid #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }
</style>

<!-- No keyboard traps (users can tab out of elements) -->
<!-- Modal dialogs are exceptions (intentional traps) -->
```

### Interactive Elements Must Be Keyboard Accessible

```html
<!-- ✓ CORRECT: Button handles keyboard natively -->
<button onclick="toggleMenu()">Toggle Menu</button>

<!-- ✓ CORRECT: Link is keyboard accessible -->
<a href="/page">Page Link</a>

<!-- ✗ WRONG: Div with click handler (not keyboard accessible) -->
<div onclick="toggleMenu()">Toggle Menu</div>

<!-- ✗ WRONG: Non-standard keyboard handling -->
<span onclick="doSomething()" onkeydown="doSomething()">Action</span>
<!-- Use <button> instead -->
```

---

## 12.8 ARIA: When Semantic HTML Insufficient

**ARIA (Accessible Rich Internet Applications)** provides accessibility info when HTML alone isn't enough.

### ARIA Roles

```html
<!-- Only when semantic HTML won't work -->
<div role="button" onclick="search()">Search</div>
<!-- Better: Use <button> instead -->
<button onclick="search()">Search</button>

<!-- Custom widgets may need ARIA -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div id="panel1" role="tabpanel" aria-labelledby="tab1">Tab 1 content</div>
<div id="panel2" role="tabpanel" aria-labelledby="tab2" hidden>Tab 2 content</div>
```

### ARIA Properties and States

```html
<!-- aria-label: Label for element without visible text -->
<button aria-label="Close menu">×</button>

<!-- aria-labelledby: Link element to heading/label -->
<h2 id="dialog-title">Delete Item?</h2>
<div role="dialog" aria-labelledby="dialog-title">
    Are you sure?
    <button>Delete</button>
    <button>Cancel</button>
</div>

<!-- aria-describedby: Additional description -->
<input type="password" aria-describedby="pwd-hint">
<small id="pwd-hint">At least 8 characters with numbers and symbols</small>

<!-- aria-required: Mark form fields as required -->
<input type="text" aria-required="true" required>

<!-- aria-invalid: Mark invalid form fields -->
<input type="email" aria-invalid="true">
<span role="alert">Please enter a valid email</span>

<!-- aria-live: Announce dynamic updates -->
<div aria-live="polite" aria-atomic="true" id="updates">
    <p>Waiting for updates...</p>
</div>
<!-- When this div content changes, screen reader announces it -->

<!-- aria-hidden: Hide from accessibility tree -->
<span aria-hidden="true">→</span>
<!-- Screen reader won't announce this decorative arrow -->

<!-- aria-expanded: Toggle menu state -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<nav id="menu" hidden>Menu items</nav>
```

---

## 12.9 Testing Accessibility

### Automated Testing Tools

#### Lighthouse (Chrome DevTools)

```
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility"
4. Click "Analyze page load"
5. Review accessibility score and issues
```

#### axe DevTools

```
1. Install axe DevTools extension
2. Open page to test
3. Click axe icon
4. Select "Scan Page"
5. Review results (Violations, Best Practices, etc.)
```

#### WAVE

```
1. Install WAVE extension
2. Open page to test
3. Review errors, warnings, and features
4. Pay special attention to contrast and alt text
```

### Manual Testing: Keyboard Navigation

```
1. Disable mouse (or just avoid using it)
2. Use Tab to navigate forward
3. Use Shift+Tab to navigate backward
4. Use Enter to activate buttons/links
5. Use Space to toggle checkboxes
6. Use Arrow keys in custom widgets (tabs, menus)
7. Ensure logical order and no traps
8. Check focus indicators are visible
```

### Manual Testing: Screen Reader

#### NVDA (Windows, Free)

```
1. Download and install NVDA
2. Start NVDA (Insert key toggles speak mode)
3. Use arrow keys to navigate by element
4. Use Tab for focusable elements
5. Press Ctrl+Home for page start
6. H for headings, L for links, B for buttons
```

#### JAWS (Windows/Mac, Commercial)

```
1. Similar to NVDA
2. Use Insert+H for heading navigation
3. Insert+L for link navigation
4. Insert+B for button navigation
```

#### VoiceOver (Mac/iOS, Built-in)

```
1. Enable: Cmd+F5
2. Use VO (Ctrl+Option) + arrow keys to navigate
3. VO+Space to activate
4. Rotor (VO+U) for headings, links, etc.
```

### Contrast Checking

```
Use tools to check color contrast:
- WebAIM Contrast Checker: webaim.org/resources/contrastchecker/
- Lighthouse (built into Chrome)
- axe DevTools (browser extension)
- Colour Contrast Analyzer (desktop app)

Target: 4.5:1 minimum (AA), 7:1 (AAA)
```

---

## 12.10 Common Accessibility Mistakes

### Mistake 1: Missing Alt Text

```html
<!-- ✗ WRONG: No alt text -->
<img src="product.jpg">

<!-- ✓ CORRECT: Descriptive alt text -->
<img src="product.jpg" alt="Blue wireless headphones with noise cancellation">
```

### Mistake 2: Poor Color Contrast

```html
<!-- ✗ WRONG: Insufficient contrast -->
<p style="color: #cccccc; background: #ffffff;">Gray on white</p>

<!-- ✓ CORRECT: 4.5:1 minimum contrast -->
<p style="color: #333333; background: #ffffff;">Dark gray on white</p>
```

### Mistake 3: Removing Focus Outline

```html
<!-- ✗ WRONG: Removing focus indicator -->
<button style="outline: none;">Button</button>

<!-- ✓ CORRECT: Keep or replace with custom -->
<button style="outline: 3px solid blue; outline-offset: 2px;">Button</button>
```

### Mistake 4: Using Semantic HTML Incorrectly

```html
<!-- ✗ WRONG: All divs instead of semantic elements -->
<div class="header">Header</div>
<div class="nav">Navigation</div>
<div class="main">Main content</div>

<!-- ✓ CORRECT: Semantic HTML -->
<header>Header</header>
<nav>Navigation</nav>
<main>Main content</main>
```

### Mistake 5: No Form Labels

```html
<!-- ✗ WRONG: Placeholder instead of label -->
<input type="text" placeholder="Name">
<input type="email" placeholder="Email">

<!-- ✓ CORRECT: Labels + optional placeholder -->
<label for="name">Name</label>
<input type="text" id="name" name="name" placeholder="John Doe">

<label for="email">Email</label>
<input type="email" id="email" name="email" placeholder="john@example.com">
```

### Mistake 6: Using Non-Standard Widgets Without ARIA

```html
<!-- ✗ WRONG: Custom button without role -->
<div onclick="toggleMenu()">Menu</div>

<!-- ✓ CORRECT: Use semantic element -->
<button onclick="toggleMenu()">Menu</button>

<!-- ✓ CORRECT: If custom widget needed, add ARIA -->
<div role="button" tabindex="0" onclick="toggleMenu()" onkeypress="toggleMenu()">
    Menu
</div>
```

---

## 12.11 Complete Accessible Page Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessible HTML Page - Complete Example</title>
    <meta name="description" content="Example of fully accessible HTML page following WCAG 2.1 AA standards">
    <style>
        body {
            font-family: sans-serif;
            color: #333;
        }

        a:focus-visible {
            outline: 3px solid #0066cc;
        }

        button:focus-visible {
            outline: 3px solid #0066cc;
            outline-offset: 2px;
        }
    </style>
</head>
<body>
<!-- Skip Link: Bypass repetitive content -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Header Landmark -->
<header>
    <h1>My Accessible Website</h1>
    <p>Welcome to our accessible web experience</p>
</header>

<!-- Navigation Landmark -->
<nav aria-label="Primary navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Main Content Landmark -->
<main id="main-content">
    <!-- Page Heading -->
    <h2>Welcome</h2>

    <!-- Content Section -->
    <section>
        <h3>About Our Services</h3>
        <p>We provide accessible web design and development services.</p>

        <!-- Image with Alt Text -->
        <figure>
            <img src="team.jpg" alt="Our team collaborating on a web project">
            <figcaption>Figure 1: Our team at work</figcaption>
        </figure>
    </section>

    <!-- Accessible Form -->
    <section>
        <h3>Contact Us</h3>
        <form>
            <fieldset>
                <legend>Contact Information</legend>

                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" id="name" name="name" required
                           aria-required="true" aria-describedby="name-help">
                    <small id="name-help">Full name (required)</small>
                </div>

                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required
                           aria-required="true" aria-describedby="email-help">
                    <small id="email-help">We'll never share your email</small>
                </div>

                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" rows="5" required
                              aria-required="true"></textarea>
                </div>

                <button type="submit">Send Message</button>
            </fieldset>
        </form>
    </section>
</main>

<!-- Complementary Content -->
<aside aria-label="Related resources">
    <h3>Resources</h3>
    <ul>
        <li><a href="https://www.w3.org/WAI/WCAG21/quickref/">WCAG Quick Reference</a></li>
        <li><a href="https://www.a11y-101.com/">Accessibility 101</a></li>
        <li><a href="https://webaim.org/">WebAIM</a></li>
    </ul>
</aside>

<!-- Footer Landmark -->
<footer>
    <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/sitemap">Sitemap</a>
    </nav>
    <p>&copy; 2024 My Accessible Website. All rights reserved.</p>
</footer>
</body>
</html>
```

---

## 12.12 WCAG Compliance Checklist

### Level A (Minimum)

- ☐ Provide text alternatives for images
- ☐ Provide audio/video descriptions or captions
- ☐ Create content that can be presented in different ways
- ☐ Make it easier to see and hear content
- ☐ Make all functionality available from keyboard
- ☐ No seizure-inducing flashing (> 3 flashes/second)
- ☐ Help users navigate, find content, determine where they are
- ☐ Make text readable and understandable
- ☐ Make pages appear and operate in predictable ways
- ☐ Help prevent and correct mistakes

### Level AA (Standard - Recommended)

- ☐ **Contrast**: 4.5:1 for normal text, 3:1 for large text
- ☐ **Resizable text**: No loss of functionality when zoomed to 200%
- ☐ **Multiple ways to find pages**: Search, navigation, site map
- ☐ **Link purpose clear**: From link text or context
- ☐ **Error prevention**: Confirmation for important actions
- ☐ **Headings and labels**: Present and descriptive
- ☐ **Focus visible**: Users can see which element has focus
- ☐ **Language identified**: Primary page language specified

### Level AAA (Enhanced - Ideal)

- ☐ **Contrast**: 7:1 for normal text, 4.5:1 for large text
- ☐ **Sign language**: Provided for audio content
- ☐ **Full audio descriptions**: For video content
- ☐ **Extended audio descriptions**: For complex video

---

## Summary: Section 12 Key Takeaways

- ✅ **POUR Principles**: Perceivable, Operable, Understandable, Robust
- ✅ **Semantic HTML is accessibility foundation** (header, nav, main, article, section, aside, footer, etc.)
- ✅ **Alt text for all meaningful images** (empty alt for decorative)
- ✅ **Color contrast**: 4.5:1 minimum (AA), 7:1 (AAA)
- ✅ **Keyboard accessible** (Tab navigation, no traps, focus visible)
- ✅ **Form labels required** (every input must have associated label)
- ✅ **Landmarks for navigation** (header, nav, main, footer, aside with aria-label)
- ✅ **Error messages and validation** (role="alert", aria-invalid, aria-describedby)
- ✅ **Skip links** to bypass repetitive content
- ✅ **ARIA only when semantic HTML insufficient** (Rule 1)
- ✅ **Test with automated tools** (Lighthouse, axe, WAVE) AND screen readers
- ✅ **Keyboard testing** (Tab through entire page, test all functionality)
- ❌ **Never**: Skip alt text on meaningful images
- ❌ **Never**: Remove focus outline (add custom indicator instead)
- ❌ **Never**: Use color alone to convey information
- ❌ **Never**: Use placeholder as label (use proper `<label>`)
- ❌ **Never**: Create mouse-only interactions (keyboard essential)
- ❌ **Never**: Use ARIA instead of semantic HTML
- ❌ **Never**: Forget error handling in forms (validation messages required)

---

## Testing Tools and Resources

**Automated Testing:**

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (free, built-in)
- [axe DevTools](https://www.deque.com/axe/devtools/) (free extension)
- [WAVE](https://wave.webaim.org/) (free extension)
- [TOTA11y](https://www.bignerdranch.com/blog/tota11y/) (free bookmarklet)

**Screen Readers:**

- [NVDA](https://www.nvaccess.org/) (free, Windows)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (commercial)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (free, Mac/iOS)
- [Narrator](https://support.microsoft.com/en-us/windows/narrator-get-started-4174d8d1-3f9b-557c-00bc-16fe3b60f18d) (
  free, Windows)

**Contrast Checking:**

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

**Learning Resources:**

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

## Links & Resources

- [MDN: Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WCAG 2.1 Specification](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM: Web Accessibility for Beginners](https://webaim.org/articles/)
- [HTML Living Standard: Accessibility](https://html.spec.whatwg.org/)
- [The A11Y Project](https://www.a11yproject.com/)

---

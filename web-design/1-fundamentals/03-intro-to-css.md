# Introduction to CSS

This comprehensive guide covers CSS from fundamentals through advanced topics, following modern best practices, MDN
standards, and 2026 web platform features.

1. **Foundation matters** — Understand box model, cascade, specificity, inheritance
2. **Modern tools** — Use flexbox/grid, not floats; use `@layer` for cascade control
3. **Accessibility first** — Respect user preferences, keyboard navigation, color contrast
4. **Performance counts** — Animate `transform`/`opacity`, minimize CSS, inline critical
5. **Responsive by default** — Mobile-first approach with container queries
6. **Custom properties** — Use CSS variables for design tokens and dynamic theming
7. **New features** — Leverage `:has()`, logical properties, modern color functions

CSS is constantly evolving. Stay updated
with [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS), [Can I Use](https://caniuse.com/),
and [Web.dev](https://web.dev/).

**Last updated:** 2026 | **Standards:** CSS Selectors Level 3+, CSS Cascade and Inheritance Level 5, MDN Web Docs

---

## Part 1: CSS Fundamentals

### 1.1 What is CSS?

**CSS (Cascading Style Sheets)** controls the **visual presentation and layout** of HTML documents. While HTML defines
content structure and semantic meaning, CSS defines **how that content appears**: colors, fonts, spacing, layout,
animations, and responsive behavior.

CSS operates through a **declarative rule-based system**:

```css
selector {
    property: value;
}
```

**Core components:**

- **Selector** — Identifies which HTML elements the rule applies to
- **Declaration block** — Contains property-value pairs
- **Property** — What aspect to style (color, size, spacing)
- **Value** — How to style it

**Example:**

```css
p {
    color: #333; /* Text color */
    font-size: 16px; /* Font size */
    line-height: 1.6; /* Space between lines */
    margin: 1em 0; /* Vertical spacing */
}
```

---

### 1.2 Three Methods of Applying CSS

#### Inline Styles (Style Attribute)

Applied directly to elements using the `style` attribute:

```html
<p style="color: #333; font-size: 16px;">Styled text</p>
```

**Advantages:**

- Highest specificity (immediate visual effect)
- Quick testing or one-off overrides

**Disadvantages:**

- Not reusable across elements
- Violates separation of concerns
- Can't use media queries or pseudo-classes
- Difficult to maintain at scale
- Increases HTML file size

**When to use:** Rarely. Only for JavaScript-driven dynamic styles.

#### Internal Styles (Style Tag in Head)

Defined in `<head>` section within a `<style>` element:

```html

<head>
    <style>
        p {
            color: #333;
            font-size: 16px;
            line-height: 1.6;
        }
    </style>
</head>
```

**Advantages:**

- Organized in one place
- Can use media queries and pseudo-classes
- No additional HTTP request

**Disadvantages:**

- Not reusable across pages
- Increases HTML file size
- Harder to manage in large projects

**When to use:**

- Critical above-the-fold CSS (for fast First Contentful Paint)
- Email templates
- Single-page documents

#### External Stylesheets (Recommended)

Linked from a separate `.css` file:

```html

<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

**Advantages:**

- **Reusable across all pages**
- Cached by browsers (loaded once, used everywhere)
- Separates concerns (structure vs presentation)
- Easier to maintain and scale
- Better performance with HTTP/2
- Enables team collaboration

**Disadvantages:**

- Additional HTTP request (minimal with HTTP/2)
- Not available until file loads

**When to use:** All production projects.

**Modern hybrid approach (best practice):**

```html

<head>
    <!-- Inline critical CSS for fast first paint -->
    <style>
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
        }

        .hero {
            display: flex;
            align-items: center;
            height: 100vh;
        }
    </style>

    <!-- Main stylesheet (loaded async) -->
    <link rel="stylesheet" href="styles.css">
</head>
```

---

### 1.3 Browser Default Styles (User-Agent Stylesheet)

Every browser includes a **default stylesheet (user-agent stylesheet)** that applies base styling to HTML elements.
Without these defaults, unstyled HTML would be completely unformatted.

**Common browser defaults:**

- Headings (`<h1>`–`<h6>`) are bold with progressively smaller font sizes
- Paragraphs (`<p>`) have top and bottom margins
- Lists (`<ul>`, `<ol>`) have left padding and bullet/numbering
- Links (`<a>`) are blue and underlined
- Form inputs have borders and padding
- Tables have borders (varies by browser)

**Why defaults vary:**

Different browsers evolved with different design philosophies. While modern browsers (Chrome, Firefox, Safari, Edge) are
more consistent than in the past, subtle differences remain.

**Impact on your styles:**

Your CSS is applied *after* browser defaults. If you don't override them, they remain visible. This is why resetting
common properties is standard practice.

---

### 1.4 CSS Resets vs Normalizers vs Custom Base Styles

#### CSS Resets: Aggressive Approach

A CSS reset removes *all* browser default styles, creating a blank canvas.

**Example (Meyer Reset):**

```css
html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, ul, ol, li {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}

body {
    line-height: 1;
}

ol, ul {
    list-style: none;
}
```

**Philosophy:** Remove everything. Developers restyle from scratch.

**Disadvantages:**

- Loses semantic defaults (bold headings, list markers)
- Requires restoring basic styles manually
- More CSS to write
- Semantic meaning is obscured

**Modern verdict:** Falling out of favor. Wastes effort resetting useful defaults.

#### CSS Normalizers: Pragmatic Approach

Normalizers fix browser bugs and inconsistencies *while preserving* useful semantic defaults.

**Normalize.css (by Nicolas Gallagher):**

```css
/* Correct the font size and margin on h1 elements */
h1 {
    font-size: 2em;
    margin: 0.67em 0;
}

/* Remove the gray background on active links in IE 10 */
a {
    background-color: transparent;
}

/* Fix table borders */
table {
    border-collapse: collapse;
    border-spacing: 0;
}
```

**Advantages:**

- Minimal; only fixes actual problems
- Preserves semantic defaults
- Thoroughly tested and documented
- Less CSS to override later

**Modern verdict:** Still useful, though browser consistency has improved.

#### Modern Approach: Minimal Reset + Custom Base Styles

In 2026, the trend is **minimal resets** + **project-specific base styles**:

```css
/* Reset only problematic defaults */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Semantic elements retain visual defaults */
h1 {
    font-size: 2em;
}

h2 {
    font-size: 1.75em;
}

a {
    color: #0066cc;
    text-decoration: underline;
}
```

**Using CSS Layers (modern best practice):**

```css
@layer reset, base, components, utilities;

@layer reset {
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
}

@layer base {
    body {
        font-family: system-ui, sans-serif;
        line-height: 1.6;
    }

    h1 {
        font-size: 2em;
    }
}

@layer components {
    .button { /* ... */
    }

    .card { /* ... */
    }
}

@layer utilities {
    .hidden {
        display: none;
    }

    .sr-only { /* accessibility */
    }
}
```

**Recommendation (2026):**

- **Using a framework:** Let framework handle resets (Tailwind Preflight, Bootstrap Reboot)
- **Design system:** Create minimal reset + custom base styles
- **Simple projects:** Use Normalize.css or minimal custom reset
- **Avoid:** Aggressive resets that require restoring everything

---

## 2. Selectors: Targeting HTML Elements

### 2.1 Basic Selectors: Type, Class, ID

#### Type (Element) Selectors

Type selectors target HTML elements by tag name:

```css
p {
    color: #333;
}

h1 {
    font-size: 2em;
}

article {
    max-width: 800px;
}
```

**Specificity:** 0-0-0-1 (lowest)

**Use:** Base styles for HTML elements.

#### Class Selectors

Target elements with a specific `class` attribute:

```css
.highlight {
    background-color: yellow;
}

.button {
    padding: 10px 20px;
    background: blue;
}

.card {
    border: 1px solid #ddd;
}
```

**Specificity:** 0-0-1-0 (moderate)

**Advantages:**

- Reusable across multiple elements
- Moderate specificity (easy to override)
- Most common selector in modern CSS

**Use:** Component and utility styling.

#### ID Selectors

Target a single element with a specific `id` attribute:

```css
#header {
    background: navy;
}

#main {
    max-width: 1200px;
}
```

**Specificity:** 0-1-0-0 (very high)

**Why avoid for styling:**

- IDs have very high specificity (hard to override)
- Can only have one per page (not reusable)
- Promotes tight coupling (ID = specific element)
- Makes CSS harder to scale

**Best practice:**

```css
/* ✓ Use classes for styling */
.nav-primary {
}

.card {
}

.button {
}

/* ✗ Avoid IDs for styling */
#nav {
}

#card {
}

#submit-button {
}
```

**IDs are better for:**

- JavaScript selectors (`document.getElementById()`)
- URL fragment identifiers (`#section`)
- Form labels (`<label for="input-id">`)

---

### 2.2 Attribute Selectors

Attribute selectors target elements based on HTML attributes:

#### Presence Selector `[attr]`

```css
input[required] {
    border: 2px solid red;
}

/* Images with alt text */
img[alt] {
    border: 1px solid green;
}
```

#### Exact Match `[attr="value"]`

```css
input[type="email"] {
    background-color: #f0f0ff;
}

a[target="_blank"] {
    color: purple;
}
```

#### Substring Matches

```css
/* Starts with */
a[href^="https://"] {
    color: green;
}

/* Ends with */
a[href$=".pdf"] {
    color: red;
}

/* Contains substring */
a[href*="example.com"] {
    color: blue;
}

/* Contains word (space-separated) */
a[title~="external"] {
    color: orange;
}
```

#### Case-Insensitive Matching

```css
input[type="email" i] {
    background: #f0f0ff;
}
```

**Practical uses:**

```css
/* Form styling */
input[type="text"],
input[type="email"],
textarea {
    padding: 8px;
    border: 1px solid #ccc;
    font-family: inherit;
}

/* External link indicator */
a[target="_blank"]::after {
    content: " ↗";
}

/* Highlight images without alt text (accessibility) */
img:not([alt]) {
    opacity: 0.5;
    filter: grayscale(100%);
}
```

---

### 2.3 Pseudo-Classes: Element States and Positions

Pseudo-classes select elements in specific states or at specific positions:

#### User Interaction Pseudo-Classes

```css
a:hover {
    color: #003d99;
    text-decoration: underline;
}

button:focus {
    outline: 3px solid #0066cc;
}

button:focus-visible {
    outline: 3px solid #0066cc;
}

/* Keyboard focus only */
button:active {
    transform: scale(0.98);
}
```

**Modern best practice:** Use `:focus-visible` instead of `:focus` to style only keyboard focus:

```css
/* Only style when keyboard-focused (not mouse-focused) */
button:focus-visible {
    outline: 3px solid blue;
}
```

#### Form State Pseudo-Classes

```css
input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

input:checked + label {
    font-weight: bold;
}

input:valid {
    border-color: green;
}

input:invalid {
    border-color: red;
}

input:required {
    border-color: orange;
}
```

#### Structural Pseudo-Classes

```css
li:first-child {
    margin-top: 0;
}

li:last-child {
    margin-bottom: 0;
}

li:nth-child(odd) {
    background: #f9f9f9;
}

li:nth-child(3) {
    color: red;
}

li:nth-child(2n) {
    /* Every even child */
}

li:nth-child(3n + 1) {
    /* Every 3rd child starting from 1st */
}

li:only-child {
    margin: 0;
}
```

#### Negation and Target

```css
button:not(.primary) {
    background: gray;
}

:target {
    outline: 3px solid yellow;
}

/* URL fragment (#section) */
p:empty {
    display: none;
}
```

---

### 2.4 Pseudo-Elements: Generated and Virtual Elements

Pseudo-elements create virtual elements or style specific parts of elements:

#### `::before` and `::after`

Insert generated content before or after an element:

```css
.icon::before {
    content: "→ ";
    color: blue;
}

blockquote::after {
    content: " ―";
    font-style: italic;
}

/* Decorative element */
.card::after {
    content: "";
    position: absolute;
    top: -10px;
    right: 0;
    width: 20px;
    height: 20px;
    background: url('corner.png');
}
```

**The `content` property:**

```css
/* Text content */
.selector::before {
    content: "text";
}

/* Empty (for decoration) */
.selector-empty::before {
    content: "";
}

/* Counter */
.selector-counter::before {
    content: counter(list-item);
}

/* Attribute value */
.selector-attr::before {
    content: attr(data-value);
}

/* Image URL */
.selector-image::before {
    content: url("image.png");
}
```

#### `::placeholder`

Style placeholder text in form inputs:

```css
input::placeholder {
    color: #999;
    opacity: 1;
}
```

#### `::first-line` and `::first-letter`

Style the first line or letter of text:

```css
p::first-line {
    font-weight: bold;
    text-transform: uppercase;
}

article p::first-letter {
    font-size: 2em;
    float: left;
    margin-right: 0.1em;
}
```

#### `::selection`

Style selected text:

```css
::selection {
    background: #0066cc;
    color: white;
}
```

**Modern syntax:** Use `::` (double colons) for pseudo-elements to distinguish from pseudo-classes `:`.

---

### 2.5 Modern Selectors: `:is()`, `:where()`, `:has()`

#### `:is()` — Selector List Grouping

Groups selectors for cleaner code:

```css
/* Traditional */
h1, h2, h3 {
    margin-top: 0;
}

/* Using :is() */
:is(h1, h2, h3) {
    margin-top: 0;
}
```

**Powerful with combinators:**

```css
/* Traditional: Verbose */
article h2, article h3, section h2, section h3 {
    color: blue;
}

/* Using :is(): Concise */
:is(article, section) :is(h2, h3) {
    color: blue;
}

/* Combined with other selectors */
form :is(input, textarea, select):focus {
    outline: 2px solid blue;
}
```

**Specificity:** Uses the highest specificity of its arguments.

```css
:is(h1, .class, #id) {
    margin-top: 0;
}

/* Specificity: 0-1-0-0 (from #id) */
```

#### `:where()` — Zero-Specificity Selector List

Identical to `:is()` but always has zero specificity:

```css
:where(h1, h2, h3) {
    margin-top: 0;
}

/* Specificity: 0-0-0-0 */
```

**Use case:** Base/reset styles that should be easily overridden:

```css
:where(h1, h2, h3, h4, h5, h6) {
    margin: 0;
    font-weight: 600;
}

/* Easy to override with higher specificity */
.custom-heading {
    margin: 1em 0;
}
```

#### `:has()` — Parent/Sibling Selection (Game Changer)

**Most powerful recent CSS addition.** Selects elements based on descendants or following siblings:

```css
/* Card with image uses grid layout */
.card:has(img) {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 16px;
}

/* Card without image uses block layout */
.card:not(:has(img)) {
    display: block;
}

/* Form with validation errors */
form:has(input:invalid) {
    border: 2px solid red;
    padding: 16px;
}

/* Style labels of checked checkboxes */
label:has(input:checked) {
    font-weight: bold;
    color: blue;
}

/* Style section if it contains error message */
section:has(.error) {
    border-left: 4px solid red;
    padding-left: 16px;
}
```

**With previous sibling:**

```css
/* Style heading if followed by list */
h2:has(+ ul) {
    margin-bottom: 0.5em;
}
```

**Real-world patterns:**

```css
/* Component styling based on content */
.product-card:has(.badge-new) {
    border: 2px solid #0066cc;
}

.product-card:has(.badge-sale) {
    background: #ffffcc;
}

/* Replace JavaScript toggle behavior */
.dropdown:has(input:checked) .dropdown-menu {
    display: block;
}
```

**Browser support (2026):** Widely supported (Chrome 105+, Safari 15.4+, Firefox 121+).

---

### 2.6 Combinators: Defining Relationships

Combinators show relationships and structure between selectors:

#### Descendant Combinator (Space)

Selects all matching descendants at any depth:

```css
article p {
    line-height: 1.8;
}
```

Targets all `<p>` elements inside `<article>`, at any nesting level.

```html

<article>
    <p>Selected</p>
    <section>
        <p>Also selected (nested deeper)</p>
    </section>
</article>
```

#### Child Combinator `>`

Selects only direct children:

```css
nav > ul {
    list-style: none;
}
```

Matches `<ul>` elements that are immediate children of `<nav>`, not nested deeper.

```html

<nav>
    <ul>Selected</ul>
    <div>
        <ul>NOT selected (not direct child)</ul>
    </div>
</nav>
```

#### Adjacent Sibling Combinator `+`

Selects the first element immediately following the matched element:

```css
h2 + p {
    font-weight: bold;
    margin-top: 0;
}
```

Only the first `<p>` directly after `<h2>` is selected.

```html
<h2>Heading</h2>
<p>Selected</p>
<p>NOT selected</p>
```

#### General Sibling Combinator `~`

Selects all elements following the matched element (same parent level):

```css
h2 ~ p {
    color: #666;
}
```

All `<p>` elements that follow an `<h2>` are selected.

```html
<h2>Heading</h2>
<p>Selected</p>
<p>Also selected</p>
<span>Also selected (if styled)</span>
```

#### Combining Combinators

```css
article > section h2 + p {
    margin-top: 0;
}
```

Read right-to-left: paragraphs immediately after `h2` elements, inside sections that are direct children of articles.

---

## 3. The Cascade, Specificity, and Inheritance

### 3.1 How the Cascade Works

The **cascade** is the algorithm determining which CSS rule applies when multiple rules target the same element with
conflicting properties.

**Cascade priority order (highest to lowest):**

1. **Inline styles** (`style` attribute) — 1-0-0-0
2. **Author `!important`** rules
3. **Author normal** declarations
4. **User agent** (browser) normal declarations
5. **CSS Cascade layers** (`@layer`) — ordered by declaration

**Key principle:** When specificity is equal, the **last rule in source order wins**.

**Example 1 — Order of appearance:**

```css
p {
    color: blue;
}

p {
    color: red;
}

/* Wins because it's last */
```

Result: Color is red.

**Example 2 — Specificity beats order:**

```css
p {
    color: blue;
}

/* Specificity: 0-0-0-1 */

.highlight {
    color: red;
}

/* Specificity: 0-0-1-0 (higher) */
```

Result: Color is red, even if `p` rule appeared later.

**Example 3 — Importance (`!important`):**

```css
p {
    color: blue;
}

p {
    color: red !important;
}

/* Wins */
```

Result: Color is red. `!important` has highest priority.

---

### 3.2 Specificity: How CSS Selectors Win

**Specificity** determines which rule wins when multiple rules target the same element. Calculated as a **four-part
value: a-b-c-d**:

- **a** = Inline styles (0 or 1)
- **b** = ID selectors
- **c** = Classes, attributes, pseudo-classes
- **d** = Type selectors, pseudo-elements

**Specificity weights:**

| Selector Type  | Weight  | Example               |
|----------------|---------|-----------------------|
| Inline style   | 1-0-0-0 | `style="color: red"`  |
| ID             | 0-1-0-0 | `#header`             |
| Class          | 0-0-1-0 | `.highlight`          |
| Attribute      | 0-0-1-0 | `[type="email"]`      |
| Pseudo-class   | 0-0-1-0 | `:hover`, `:focus`    |
| Type           | 0-0-0-1 | `p`, `div`, `h1`      |
| Pseudo-element | 0-0-0-1 | `::before`, `::after` |
| Universal      | 0-0-0-0 | `*` (no specificity)  |

**Calculating combined selectors:**

```css
p /* 0-0-0-1 */
.class /* 0-0-1-0 */
p.class /* 0-0-1-1 */
#id .class /* 0-1-1-0 */
#id .class:hover /* 0-1-2-0 */
nav ul li.active /* 0-0-1-3 */
header nav ul li:first-child

/* 0-0-1-4 */
```

**Comparison rule:** Compare left-to-right. First non-zero difference wins.

```
0-1-0-0 beats 0-0-9-9   (one ID beats unlimited classes)
0-0-2-0 beats 0-0-1-9   (two classes beat one class + types)
```

**Problem:** High specificity selectors are hard to override. Avoid IDs and long selector chains.

---

### 3.3 Specificity with Modern Selectors

#### `:is()` Specificity

Uses the highest specificity of its arguments:

```css
:is(h1, .class, #id) {
    /* Specificity: 0-1-0-0 (from #id) */
}
```

#### `:where()` Specificity

Always zero specificity:

```css
:where(h1, h2, h3) {
    /* Specificity: 0-0-0-0 */
}
```

#### `:not()` Specificity

Argument's specificity counts:

```css
.button:not(.primary) {
    /* Specificity: 0-0-1-1 */
}

#id:not(.class) {
    /* Specificity: 0-1-1-0 */
}
```

---

### 3.4 Inheritance: Properties That Cascade Down

**Inheritance** is the mechanism where certain CSS properties automatically apply to child elements.

#### Inherited Properties (by default)

Text and color properties inherit naturally:

```css
body {
    /* All text inside body inherits these */
    font-family: system-ui, sans-serif;
    color: #333;
    line-height: 1.6;
}
```

**Complete list of inherited properties:**

- Text: `color`, `font-family`, `font-size`, `font-weight`, `font-style`, `line-height`, `letter-spacing`,
  `word-spacing`, `text-align`, `text-transform`, `text-shadow`
- Visibility: `visibility`, `cursor`
- List: `list-style`, `list-style-type`

#### Non-Inherited Properties (by default)

Layout and visual properties don't inherit:

```css
.box {
    margin: 20px; /* Does NOT inherit */
    padding: 20px; /* Does NOT inherit */
    border: 1px solid; /* Does NOT inherit */
    width: 300px; /* Does NOT inherit */
}
```

**Box model and layout don't inherit:**

- Box model: `margin`, `padding`, `border`, `width`, `height`
- Positioning: `position`, `top`, `left`, `z-index`
- Layout: `display`, `float`, `flex`, `grid`
- Visual: `background`, `background-color`, `opacity`, `box-shadow`

#### Forcing Inheritance

```css
button {
    font-family: inherit; /* Inherit from parent, not browser default */
}

.reset-color {
    color: inherit; /* Use parent's color */
}
```

#### Resetting Inheritance

```css
.reset {
    color: initial; /* Reset to browser default */
    all: initial; /* Reset all properties */
}

.unset {
    color: unset; /* Use inherited value if exists, else initial */
}
```

---

### 3.5 `!important`: Avoid When Possible

The `!important` flag gives a declaration maximum priority, overriding normal cascade:

```css
p {
    color: blue;
}

p {
    color: red !important;
}

/* Wins regardless of specificity */
```

**Cascade order with `!important`:**

1. User-agent `!important`
2. User `!important`
3. **Author `!important`** (your CSS)
4. Author normal
5. User normal
6. User-agent normal

#### When `!important` Might Be Justified

**Utility classes (must always apply):**

```css
.hidden {
    display: none !important;
}

.sr-only {
    position: absolute !important;
    width: 1px !important;
    overflow: hidden !important;
}
```

**Accessibility overrides:**

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}
```

#### Why Avoid `!important`

- **Breaks the cascade** — Defeats CSS's design principle
- **Creates escalation** — One `!important` leads to more
- **Difficult to override** — Any override needs `!important` too
- **Hard to debug** — Makes style origin unclear
- **Reduces maintainability** — Team can't understand intent

#### Better Alternatives

**1. Increase specificity naturally:**

```css
/* Instead of */
.button {
    color: red !important;
}

/* Do this */
.button-primary {
    color: red;
}
```

**2. Use cascade layers (`@layer`):**

```css
@layer utilities, components;

@layer components {
    .button {
        color: blue;
    }
}

@layer utilities {
    .text-red {
        color: red;
    }

    /* Wins because declared later */
}
```

**3. Be more specific in selector:**

```css
/* Instead of */
.card {
    padding: 10px !important;
}

/* Do this */
.card--large {
    padding: 20px;
}
```

---

### 3.6 CSS Cascade Layers (`@layer`) — Modern Cascade Control

**Cascade layers** provide explicit, declarative control over CSS priority **without relying on specificity** or
`!important`.

#### Basic Syntax

```css
/* Declare layers in priority order (low to high) */
@layer reset, base, components, utilities;

@layer reset {
    * {
        box-sizing: border-box;
    }
}

@layer base {
    body {
        font-family: system-ui, sans-serif;
    }

    h1 {
        font-size: 2em;
    }
}

@layer components {
    .button {
        padding: 10px 20px;
    }

    .card {
        border: 1px solid #ddd;
    }
}

@layer utilities {
    .hidden {
        display: none;
    }

    .flex {
        display: flex;
    }
}
```

#### How Layers Work

- Layers declared *first* have **lower** priority
- Layers declared *later* have **higher** priority
- **Unlayered styles** have the highest priority of all

**Priority order:**

```
reset < base < components < utilities < unlayered styles
```

Even if a selector in `reset` has higher specificity, `utilities` layer wins because it's declared later.

#### Layer Priority Example

```css
@layer theme, utilities;

@layer theme {
    .button {
        color: blue;
    }

    /* Specificity: 0-0-1-0 */
}

@layer utilities {
    .text-red {
        color: red;
    }

    /* Specificity: 0-0-1-0, but wins (higher layer) */
}

/* Unlayered always wins */
.text-red {
    color: green;
}

/* This wins over both layers */
```

#### Practical Use: Integrating Third-Party CSS

```css
@layer framework, custom;

@layer framework {
    @import url('bootstrap.css');  /* Lower priority */
}

@layer custom {
    .button {
        color: blue;
    }

    /* Overrides Bootstrap styles */
}
```

#### Real-World Layer Structure

```css
@layer reset, base, theme, patterns, components, utilities;

@layer reset {
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
}

@layer base {
    body {
        font-family: system-ui, sans-serif;
        color: #333;
    }

    a {
        color: #0066cc;
    }

    a:hover {
        text-decoration: underline;
    }
}

@layer theme {
    :root {
        --primary: #0066cc;
        --text: #333;
    }
}

@layer patterns {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .grid {
        display: grid;
        gap: 16px;
    }
}

@layer components {
    .button {
        padding: 10px 20px;
        background: var(--primary);
    }

    .card {
        border: 1px solid #ddd;
        padding: 16px;
    }
}

@layer utilities {
    .hidden {
        display: none;
    }

    .text-center {
        text-align: center;
    }

    .p-4 {
        padding: 16px;
    }
}
```

**Browser support (2026):** Universally supported (Chrome 99+, Safari 15.4+, Firefox 97+).

---

# Part 2: CSS Box Model and Layout

## 4. The Box Model: Content, Padding, Border, Margin

### 4.1 Box Model Layers

Every HTML element is rendered as a **rectangular box** with four concentric layers:

```
┌─────────────────────────── MARGIN ────────────────────────────┐
│ (Transparent space outside element)                           │
│                                                               │
│  ┌──────────────────── BORDER ────────────────────┐           │
│  │ (Element's visible edge)                       │           │
│  │                                                │           │
│  │  ┌──────────────── PADDING ──────────┐         │           │
│  │  │ (Space inside border)             │         │           │
│  │  │                                   │         │           │
│  │  │  ┌────── CONTENT ────┐            │         │           │
│  │  │  │ (Text, children)  │            │         │           │
│  │  │  └───────────────────┘            │         │           │
│  │  │                                   │         │           │
│  │  └───────────────────────────────────┘         │           │
│  │                                                │           │
│  └────────────────────────────────────────────────┘           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

#### Content Area

The innermost area where text and child elements render. Size controlled by `width` and `height` properties (when
`box-sizing: content-box`).

```css
.box {
    width: 300px;
    height: 200px;
}
```

#### Padding

Space *inside* the border, between content and border:

- Inherits element's **background color** (part of visual appearance)
- Takes space from content area
- Useful for breathing room around content

```css
.box {
    padding: 20px; /* All sides */
    padding: 10px 20px; /* Vertical, Horizontal */
    padding: 10px 20px 15px 20px; /* TRBL (clockwise) */
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 15px;
    padding-left: 20px;
}
```

#### Border

A visible line around padding and content:

- Has **width**, **style**, **color**
- Sits between padding and margin
- Takes space from element's box

```css
.box {
    border: 2px solid #333; /* Width, Style, Color */
    border: 2px dashed blue;
    border: 1px dotted gray;

    /* Individual sides */
    border-top: 2px solid #333;
    border-right: 2px solid #333;
    border-bottom: 2px solid #333;
    border-left: 2px solid #333;

    /* Rounded corners */
    border-radius: 8px;
    border-radius: 50%; /* Circle */
    border-radius: 8px 4px 4px 8px; /* TL, TR, BR, BL */
}
```

#### Margin

Space *outside* the border, between this element and neighbors:

- Always **transparent** (not part of background)
- Doesn't affect element's appearance
- Can be **negative** (overlapping elements)
- **Collapses** vertically between block elements (section 4.3)

```css
.box {
    margin: 20px; /* All sides */
    margin: 10px 20px; /* Vertical, Horizontal */
    margin: 10px 20px 15px 20px; /* TRBL */
    margin-top: 10px;
    margin-right: auto; /* Useful for centering */
    margin-bottom: 15px;
    margin-left: auto;
}
```

#### Total Rendered Size

With default `box-sizing: content-box`:

```css
.box {
    width: 300px; /* Content width */
    padding: 20px; /* 20px each side */
    border: 2px solid; /* 2px each side */
    margin: 10px; /* Not included in total */
}

/* Total rendered width: 300 + 20 + 20 + 2 + 2 = 344px */
/* Margin adds space around but not to element width */
```

---

### 4.2 `box-sizing`: `content-box` vs `border-box`

The `box-sizing` property controls how `width` and `height` are calculated.

#### `box-sizing: content-box` (Default, Legacy)

`width` and `height` apply to **content only**. Padding and border are added on top.

```css
.box {
    box-sizing: content-box;
    width: 300px;
    padding: 20px;
    border: 2px solid;
}

/* Actual rendered width: 300 + 20 + 20 + 2 + 2 = 344px */
```

**Problem:** Unpredictable sizing. Adding padding forces recalculating width.

#### `box-sizing: border-box` (Recommended)

`width` and `height` **include** padding and border. Content area shrinks to accommodate them.

```css
.box {
    box-sizing: border-box;
    width: 300px;
    padding: 20px;
    border: 2px solid;
}

/* Actual rendered width: exactly 300px */
/* Content area: 300 - 20 - 20 - 2 - 2 = 256px */
```

**Benefit:** Predictable. Element is exactly the width you specify.

#### Global `border-box` Reset (Best Practice)

Apply `border-box` to all elements:

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

This should be the **first rule** in every stylesheet. Modern frameworks (Tailwind, Bootstrap) do this automatically.

#### Why `border-box` Is Modern Standard

1. **More intuitive** — Width means actual rendered width
2. **Easier layouts** — No mental math for padding/border
3. **Fewer bugs** — Reduces sizing miscalculations
4. **Industry standard** — Widely adopted across frameworks

---

### 4.3 Margin Collapsing: Vertical Margin Behavior

**Margin collapsing** is a CSS behavior where vertical margins between adjacent block elements **combine** rather than
add together.

#### Basic Margin Collapse Example

```css
.box1 {
    margin-bottom: 30px;
}

.box2 {
    margin-top: 20px;
}
```

Space between `.box1` and `.box2`: **30px** (not 50px).

When vertical margins touch, the **larger margin wins**. This prevents excessive spacing.

#### When Margin Collapse Occurs

**1. Adjacent sibling block elements:**

```html

<div class="box1"></div>
<div class="box2"></div>
```

`.box1`'s `margin-bottom` and `.box2`'s `margin-top` collapse.

**2. Parent and first/last child (if no separator):**

```html

<div class="parent">
    <div class="child"></div>
</div>
```

```css
.parent {
    margin-top: 50px;
}

.child {
    margin-top: 30px;
}
```

If no padding, border, or content separates them, child's margin "escapes" and combines with parent's. Effective top
margin: 50px.

**3. Empty elements:**

Top and bottom margins collapse together:

```css
.empty {
    margin: 30px;
}
```

#### When Margin Collapse DOES NOT Occur

- **Horizontal margins** (left/right) never collapse
- **Flex items** (`display: flex`)
- **Grid items** (`display: grid`)
- **Absolutely positioned** (`position: absolute`)
- **Floated elements** (`float: left/right`)
- `overflow` other than `visible`
- `display: inline-block`

#### Preventing Parent-Child Collapse

```css
.parent {
    padding-top: 1px; /* Smallest padding */
}

/* OR */
.parent {
    border-top: 1px solid transparent;
}

/* OR */
.parent {
    overflow: hidden; /* Creates new formatting context */
}

/* OR (modern) */
.parent {
    display: flow-root; /* Clean, explicit */
}
```

**Modern best practice — Use `display: flow-root`:**

```css
.parent {
    display: flow-root; /* Contains margins, cleaner syntax */
}
```

#### Why Margin Collapse Exists

Prevents excessive spacing when multiple elements stack vertically. Margins combine instead of adding, creating
consistent spacing:

```css
p {
    margin: 1em 0;
}

/* Multiple paragraphs: collapse to single 1em space (not 2em) */
```

---

### 4.4 `display`: Controlling Layout Participation

The `display` property controls how an element participates in layout.

#### `display: block` (Default for Block Elements)

- Starts on a **new line**
- Stretches to **full container width**
- Respects `width`, `height`, all margins and padding

```css
div, p, h1, section, header, footer {
    display: block;
}
```

#### `display: inline` (Default for Inline Elements)

- Sits **within text flow**, only as wide as content
- Ignores `width` and `height`
- Respects **horizontal** margins/padding
- Vertical margins/padding don't push other elements away

```css
span, a, strong, em, button {
    display: inline;
}

/* Example: Can't set width on inline */
a {
    width: 200px; /* Ignored */
    padding: 10px 20px; /* Horizontal works, vertical doesn't affect layout */
}
```

#### `display: inline-block` (Hybrid)

- Sits in text flow like inline
- Accepts `width`, `height`, all margins and padding like block
- Respects all four sides of spacing

```css
.button {
    display: inline-block;
    width: 150px;
    padding: 10px 20px;
    margin: 10px;
}
```

**Problem:** Whitespace in HTML creates gaps between elements.

**Solution:** Use `flexbox` or `grid` instead of `inline-block`.

#### `display: none`

- Element **removed from flow entirely**
- Doesn't render, doesn't take up space
- Different from `visibility: hidden` (which hides but reserves space)

```css
.hidden {
    display: none;
}
```

#### `display: flex`

Creates a flex container (see section 7).

```css
.container {
    display: flex;
    gap: 10px;
}
```

#### `display: grid`

Creates a grid container (see section 8).

```css
.container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
}
```

#### `display: contents`

Element's box disappears, but children remain in layout:

```html

<div class="wrapper">
    <div class="disappear">
        <p>Child 1</p>
        <p>Child 2</p>
    </div>
</div>
```

```css
.disappear {
    display: contents;
}

/* .wrapper now directly contains the <p> elements */
```

**Use case:** Semantic HTML wrappers that shouldn't affect layout (extra `<div>` in Grid).

#### `display: flow-root`

Creates new block formatting context without other side effects:

```css
.parent {
    display: flow-root;
    /* Contains floats, prevents margin collapse */
}
```

**Use case:** Clean way to contain floats or prevent margin collapse.

---

### 4.5 `overflow`: Handling Content That Doesn't Fit

The `overflow` property controls what happens when content is larger than its container.

#### `overflow: visible` (Default)

Content spills outside the box boundaries:

```css
.box {
    width: 200px;
    height: 100px;
    overflow: visible;
}

/* Content extends beyond edges */
```

#### `overflow: hidden`

Content is clipped. Anything outside the boundary is invisible:

```css
.box {
    overflow: hidden;
}
```

**Use cases:**

- Hiding excess content
- Clearing floats (creates block formatting context)
- Creating scroll containers
- Preventing margin collapse (alternative to `display: flow-root`)

#### `overflow: scroll`

Always shows scrollbars, even if content fits:

```css
.box {
    overflow: scroll;
}

/* Always shows horizontal and vertical scrollbars */
```

**Problem:** Unnecessary scrollbars waste space.

#### `overflow: auto`

Shows scrollbars only when content overflows:

```css
.box {
    overflow: auto;
}

/* Scrollbars appear only if needed */
```

**Recommended:** Use `auto` instead of `scroll`.

#### `overflow: clip`

Clips content like `hidden`, but doesn't create a scroll container:

```css
.box {
    overflow: clip;
}

/* Content can't scroll programmatically */
```

#### Directional Overflow

```css
.box {
    overflow-x: auto; /* Horizontal scrolling */
    overflow-y: hidden; /* Vertical clipping */
}

.box {
    overflow-x: clip;
    overflow-y: scroll;
}
```

#### Scroll Container Side Effects

When `overflow` is anything other than `visible`, the element becomes a **scroll container** and creates a **new block
formatting context (BFC)**:

- Margin collapse doesn't occur
- Floats are contained
- Element clips its content

---

## 5. Positioning: Controlling Element Flow and Stacking

### 5.1 `position`: Static, Relative, Absolute, Fixed, Sticky

The `position` property determines how an element is positioned in the document flow.

#### `position: static` (Default)

Element follows normal document flow. Offset properties (`top`, `left`, etc.) have no effect.

```css
div {
    position: static;
    top: 50px; /* Ignored */
}
```

#### `position: relative`

Element stays in normal flow but can be offset from its original position:

- Original space is **preserved**
- Offset using `top`, `left`, `bottom`, `right`

```css
.box {
    position: relative;
    top: 20px; /* Move down 20px */
    left: 10px; /* Move right 10px */
}
```

**Use cases:**

- Slight offset adjustments
- Creating positioning context for absolutely positioned children
- Using with `z-index` for stacking control

#### `position: absolute`

Element removed from normal flow. Positioned relative to **nearest positioned ancestor** (or `<html>` if none):

- **Original space is removed** (no longer affects surrounding layout)
- Positioned using `top`, `left`, `bottom`, `right`

```css
.parent {
    position: relative; /* Creates positioning context */
}

.child {
    position: absolute;
    top: 10px;
    right: 10px;
}
```

`.child` positioned 10px from top and right of `.parent`.

**Use cases:**

- Overlays
- Tooltips
- Dropdown menus
- Badges on top of images

**Important: Positioning context:**

```css
.container {
    position: static;
}

/* NO context created */
.container.positioned {
    position: relative;
}

/* Creates context */

.child {
    position: absolute;
    /* Positioned relative to .container.positioned, not .container */
}
```

Any `position` value other than `static` creates a positioning context.

#### `position: fixed`

Positioned relative to **viewport**. Stays in place when scrolling:

```css
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.content {
    margin-top: 80px; /* Offset for fixed header */
}
```

**Use cases:**

- Fixed headers/footers
- Floating action buttons
- Sticky navigation
- Modals

**Important:** `position: fixed` elements with `transform` are repositioned relative to the transformed parent (not
viewport).

#### `position: sticky`

**Hybrid between relative and fixed.** Element is relative until it reaches a threshold, then becomes fixed:

```css
.sticky-header {
    position: sticky;
    top: 0; /* Threshold: stick when 0px from top */
}
```

Scrolls normally until reaching `top: 0`, then sticks to top while its container is visible.

**Important:** Requires a **threshold** (`top`, `bottom`, `left`, `right`). Without it, behaves like `relative`.

**Use cases:**

- Table headers that stick while scrolling rows
- Section headers in long documents
- Filter bars in infinite scroll

**Sticky positioning constraints:**

- Element must be inside a scrolling container
- Sticking point relative to nearest scrolling ancestor
- Doesn't work with `overflow: hidden` on ancestor

---

### 5.2 The Stacking Context and `z-index`

`z-index` controls the stacking order of positioned elements along the z-axis (front to back).

#### Basic `z-index`

```css
.box1 {
    position: relative;
    z-index: 1;
}

.box2 {
    position: relative;
    z-index: 2; /* Appears in front of .box1 */
}
```

Higher `z-index` = closer to viewer.

#### Important: `z-index` Only Works on Positioned Elements

Elements with `position: static` ignore `z-index`:

```css
/* z-index ignored */
div {
    z-index: 9999;
}

/* z-index works */
div {
    position: relative;
    z-index: 9999;
}
```

#### Stacking Contexts: Isolation and Nesting

A **stacking context** is a 3D conceptual box. Elements within a stacking context stack relative to each other, but the
entire context stacks as a unit relative to parent contexts.

**What creates a stacking context:**

1. Root element (`<html>`)
2. Positioned elements with `z-index` ≠ `auto`
3. Flex/grid items with `z-index` ≠ `auto`
4. `opacity` < 1
5. `transform`, `filter`, `perspective`, `clip-path`, `mask` (any non-`none` value)
6. `will-change` (any property creating a stacking context)
7. `mix-blend-mode` ≠ `normal`
8. `isolation: isolate`

#### The Problem with Stacking Contexts

```css
.parent {
    position: relative;
    z-index: 1; /* Creates stacking context */
}

.child {
    position: relative;
    z-index: 9999; /* Very high, but confined to parent context */
}

.sibling {
    position: relative;
    z-index: 2; /* Higher than parent's context */
}
```

Even though `.child` has `z-index: 9999`, it **cannot** appear above `.sibling` (with `z-index: 2`), because `.child` is
confined to its parent's stacking context.

#### Fixing Stacking Issues

**1. Avoid creating unintended contexts:**

```css
/* BAD: opacity creates context */
.parent {
    opacity: 0.99; /* Almost invisible, still creates context */
    z-index: 1;
}

/* GOOD: Only create context when needed */
.parent {
    z-index: 1; /* Explicit context creation */
}
```

**2. Use explicit `isolation`:**

```css
.isolated {
    isolation: isolate; /* Creates context without side effects */
}
```

**3. Restructure DOM if possible:**

Move high-z-index elements out of problematic parents.

---

### 5.3 Practical Positioning Patterns

**Center absolutely positioned element:**

```css
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Modern approach */
}
```

**Cover entire parent:**

```css
.overlay {
    position: absolute;
    inset: 0; /* Modern shorthand: top, right, bottom, left all 0 */
}

/* Or older syntax */
.overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
```

**Fixed header with content offset:**

```css
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 100;
}

.content {
    margin-top: 60px; /* Offset for fixed header */
}
```

**Sticky section headers:**

```css
h2 {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
}

/* Stays at top while section visible */
```

**Tooltip positioned above element:**

```css
.tooltip-trigger {
    position: relative;
}

.tooltip {
    position: absolute;
    bottom: 100%; /* Above parent */
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 8px;
    border-radius: 4px;
}
```

---

# Part 3: Typography, Flexbox, and Grid

## 6. Typography and Text Styling

### 6.1 Font Family and Web Fonts

#### `font-family`: Specifying Typefaces

```css
body {
    font-family: system-ui, -apple-system, sans-serif;
}

.serif {
    font-family: 'Georgia', 'Times New Roman', serif;
}

.monospace {
    font-family: 'Courier New', monospace;
}
```

#### Font Stack (Fallback Chain)

Browser tries each font left-to-right:

```css
.selector {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
```

1. 'Segoe UI' (Windows)
2. Tahoma (Windows fallback)
3. Geneva (macOS)
4. Verdana (Generic fallback)
5. sans-serif (Generic family fallback)

#### System Font Stack (Modern Best Practice)

Uses native OS font for each platform (fastest, most consistent):

```css
.selector {
    font-family: system-ui, -apple-system, sans-serif;
}
```

Provides:

- **Fastest loading** — Uses system font, no download needed
- **Most consistent** — Matches platform design language
- **Smallest file size** — No web font download

#### Generic Font Families

```css
/* Georgia, Times, with serifs */
.serif {
    font-family: serif;
}

/* Arial, Helvetica, no serifs */
.sans-serif {
    font-family: sans-serif;
}

/* Courier, fixed-width */
.monospace {
    font-family: monospace;
}

/* Handwriting fonts */
.cursive {
    font-family: cursive;
}

/* Decorative fonts */
.fantasy {
    font-family: fantasy;
}
```

#### Web Fonts with `@font-face`

```css
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2'),
    url('font.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;  /* Show fallback while loading */
}

body {
    font-family: 'CustomFont', system-ui, sans-serif;
}
```

**`font-display` strategies:**

```css
/* Browser default */
@font-face {
    font-family: "MyFont";
    src: url("myfont.woff2") format("woff2");
    font-display: auto;
}

/* Hide text until font loads */
@font-face {
    font-family: "MyFontBlock";
    src: url("myfont.woff2") format("woff2");
    font-display: block;
}

/* Show fallback, swap when loaded (recommended) */
@font-face {
    font-family: "MyFontSwap";
    src: url("myfont.woff2") format("woff2");
    font-display: swap;
}

/* Brief block, then swap */
@font-face {
    font-family: "MyFontFallback";
    src: url("myfont.woff2") format("woff2");
    font-display: fallback;
}

/* Only use if loads quickly */
@font-face {
    font-family: "MyFontOptional";
    src: url("myfont.woff2") format("woff2");
    font-display: optional;
}
```

**Best practice:** Use `swap` for body text, `optional` for decorative fonts.

---

### 6.2 Font Size, Weight, and Style

#### `font-size`: Specifying Type Size

```css
p {
    font-size: 16px; /* Fixed size */
}

p {
    font-size: 1rem; /* Relative to root (recommended) */
}

p {
    font-size: 1.125em; /* Relative to parent */
}

p {
    font-size: 112.5%; /* Percentage of parent */
}

h1 {
    font-size: clamp(1.5rem, 5vw, 3rem); /* Fluid */
}
```

**Units:**

- `px` — Fixed pixels (not recommended for text)
- `rem` — Relative to root `<html>` font size (best practice)
- `em` — Relative to parent element font size
- `%` — Percentage of parent font size
- `vw` — Relative to viewport width (for fluid typography)

**Recommended approach:**

```css
html {
    font-size: 16px; /* Base size */
}

body {
    font-size: 1rem; /* 16px */
}

h1 {
    font-size: 2rem; /* 32px */
}

h2 {
    font-size: 1.5rem; /* 24px */
}

small {
    font-size: 0.875rem; /* 14px */
}
```

#### `font-weight`: Thickness of Type

```css
p {
    font-weight: normal; /* 400 */
}

strong {
    font-weight: bold; /* 700 */
}

.thin {
    font-weight: 100; /* thin/hairline */
}

.light {
    font-weight: 300;
}

.semibold {
    font-weight: 600;
}

.black {
    font-weight: 900;
}
```

**Common values:**

- `100` — Thin
- `300` — Light
- `400` — Normal (default)
- `600` — Semibold
- `700` — Bold
- `900` — Black

**Variable fonts (modern):**

Support any weight value between font's min and max:

```css
.text {
    font-weight: 450;
}

/* Any value */
```

#### `font-style`: Italic and Oblique

```css
em {
    font-style: italic;
}

/* True italic from font */
.oblique {
    font-style: oblique;
}

/* Mathematically skewed */
.normal {
    font-style: normal;
}
```

---

### 6.3 Line Height and Letter Spacing

#### `line-height`: Vertical Spacing Between Lines

```css
p {
    line-height: 1.6; /* Unitless multiplier (recommended) */
    line-height: 1.6em;
    line-height: 24px;
}

/* Unitless multiplier is inherited from element's font size */
```

**Recommended values for readability:**

- **Body text:** 1.5–1.8
- **Headings:** 1.2–1.4
- **Code:** 1.4–1.6

**Why unitless is best:**

```css
/* BAD: em-based compounds */
p {
    font-size: 16px;
    line-height: 1.6em; /* 25.6px */
}

p small {
    font-size: 14px;
    line-height: 1.6em; /* Still 25.6px (inherited value) */
}

/* GOOD: Unitless recalculates */
p {
    font-size: 16px;
    line-height: 1.6; /* 25.6px */
}

p small {
    font-size: 14px;
    line-height: 1.6; /* 22.4px (recalculated) */
}
```

#### `letter-spacing`: Spacing Between Characters

```css
h1 {
    letter-spacing: 0.05em;
}

/* Recommended: relative unit */
.tight {
    letter-spacing: -0.5px;
}

/* Tighter */
.loose {
    letter-spacing: 2px;
}

/* Looser */
```

**Use sparingly.** Most fonts have optimal spacing built-in.

#### `word-spacing`: Spacing Between Words

```css
p {
    word-spacing: 0.15em;
}
```

**Rarely used** in modern design.

---

### 6.4 Text Alignment and Decoration

#### `text-align`: Horizontal Alignment

```css

.left {
    text-align: left; /* Default */
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}

.justify {
    text-align: justify; /* Stretches to full width */
}
```

**Important:** `text-align` only affects inline content, not block elements.

**For centering block elements:**

```css
.centered {
    margin: 0 auto; /* Center block element */
}

.flex-center {
    display: flex;
    justify-content: center;
}
```

#### `text-decoration`: Underlines and Overlines

```css
a {
    text-decoration: underline;
}

a {
    text-decoration: none;
}

.overline {
    text-decoration: overline;
}

.strikethrough {
    text-decoration: line-through;
}

/* Modern detailed syntax */
a {
    text-decoration-line: underline;
    text-decoration-color: blue;
    text-decoration-style: solid; /* solid, wavy, dashed, dotted */
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
}
```

#### `text-transform`: Changing Case

```css
.uppercase {
    text-transform: uppercase; /* UPPERCASE */
}

.lowercase {
    text-transform: lowercase; /* lowercase */
}

.capitalize {
    text-transform: capitalize; /* Capitalize Each */
}
```

**Note:** Only affects visual display. Content remains unchanged in DOM.

---

### 6.5 Color, Opacity, and Text Overflow

#### `color`: Text Color

```css
p {
    color: #333;
}

p {
    color: rgb(51, 51, 51);
}

p {
    color: hsl(0, 0%, 20%);
}

p {
    color: currentColor; /* Inherits from parent */
}
```

**Modern color functions (2026):**

```css
p {
    color: oklch(60% 0.1 200); /* Perceptually uniform */
}

p {
    color: color-mix(in srgb, blue 70%, white); /* Mixing */
}
```

#### `opacity`: Element Transparency

```css
.transparent {
    opacity: 0.5; /* 50% transparent */
}
```

Affects entire element and children. For color-specific transparency, use `rgba()`.

#### Text Overflow and Truncation

**`text-overflow` with `overflow: hidden`:**

```css
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Result: "Long text that does..." */
```

**Multi-line truncation:**

```css
.truncate-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Number of lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Result: Shows 3 lines, then ellipsis */
```

---

## 7. Flexbox: One-Dimensional Layout

### 7.1 Flex Container and Flex Items

**Flexbox** is a one-dimensional layout system for arranging items in rows or columns with intelligent space
distribution.

**Flex container:** Parent element with `display: flex`.

**Flex items:** Direct children of the flex container.

```html

<div class="container">  <!-- Flex container -->
    <div>Item 1</div>      <!-- Flex item -->
    <div>Item 2</div>      <!-- Flex item -->
    <div>Item 3</div>      <!-- Flex item -->
</div>
```

```css
.container {
    display: flex;
}
```

**Default behavior:**

- Items sit **side by side** (row direction)
- Items **stretch to equal height**
- Items **don't wrap** (all fit on one line)

**Why flexbox is revolutionary:**

Before flexbox (pre-2015), layouts required floats, positioning hacks, or table markup. Flexbox provides predictable,
powerful one-dimensional layout.

---

### 7.2 `flex-direction`, `flex-wrap`, `flex-flow`

#### `flex-direction`: Main Axis Direction

```css
.container {
    flex-direction: row; /* Default: left to right */
    flex-direction: row-reverse; /* Right to left */
    flex-direction: column; /* Top to bottom */
    flex-direction: column-reverse; /* Bottom to top */
}
```

**Axis terminology:**

- **Main axis:** Direction items flow (controlled by `flex-direction`)
- **Cross axis:** Perpendicular to main axis

#### `flex-wrap`: Line Wrapping

```css
.container {
    flex-wrap: nowrap; /* Default: single line */
    flex-wrap: wrap; /* Wrap to multiple lines */
    flex-wrap: wrap-reverse; /* Wrap in reverse order */
}
```

#### `flex-flow`: Shorthand

```css
.container {
    flex-flow: row wrap; /* direction + wrap */
}
```

---

### 7.3 `justify-content`, `align-items`, `align-content`

#### `justify-content`: Main Axis Alignment

Distributes space between and around items along main axis:

```css
.container {
    justify-content: flex-start; /* Default: at start */
    justify-content: flex-end; /* At end */
    justify-content: center; /* Centered */
    justify-content: space-between; /* Equal space between */
    justify-content: space-around; /* Equal space around */
    justify-content: space-evenly; /* Equal space everywhere */
}
```

#### `align-items`: Cross Axis Alignment

Aligns items perpendicular to main axis:

```css
.container {
    align-items: stretch; /* Default: fill container */
    align-items: flex-start; /* At cross-axis start */
    align-items: flex-end; /* At cross-axis end */
    align-items: center; /* Centered */
    align-items: baseline; /* Aligned by baseline */
}
```

#### `align-content`: Multiple Lines Alignment

Only affects multi-line flex containers:

```css
.container {
    flex-wrap: wrap;
    align-content: flex-start;
    align-content: center;
    align-content: space-between;
    align-content: stretch; /* Default */
}
```

---

### 7.4 `flex-grow`, `flex-shrink`, `flex-basis`

#### `flex-basis`: Initial Size

Initial size before space distribution:

```css
.item {
    flex-basis: 200px; /* Item starts at 200px */
    flex-basis: auto; /* Default: based on content */
}
```

#### `flex-grow`: Growth Factor

How much an item grows when extra space is available:

```css
.item {
    flex-grow: 0; /* Default: doesn't grow */
    flex-grow: 1; /* Grows equally with other 1-items */
    flex-grow: 2; /* Grows twice as much */
}
```

#### `flex-shrink`: Shrink Factor

How much an item shrinks when space is limited:

```css
.item {
    flex-shrink: 1; /* Default: can shrink */
    flex-shrink: 0; /* Won't shrink */
}
```

#### `flex`: Shorthand

```css
.item {
    flex: 1; /* grow: 1, shrink: 1, basis: 0% */
    flex: 0 1 200px; /* grow: 0, shrink: 1, basis: 200px */
}
```

**Common patterns:**

```css
/* Equal-width items */
.item {
    flex: 1;
}

/* Fixed-width item */
.item {
    flex: 0 0 200px;
}

/* Item grows but doesn't shrink */
.item {
    flex: 1 0 auto;
}
```

---

### 7.5 `align-self`, `order`, and `gap`

#### `align-self`: Override Container's `align-items`

```css
.item.special {
    align-self: flex-end;
    align-self: center;
}
```

#### `order`: Change Visual Order

```css
.item1 {
    order: 3; /* Appears third */
}

.item2 {
    order: 1; /* Appears first */
}

.item3 {
    order: 2; /* Appears second */
}
```

**⚠️ Accessibility warning:** Changes visual order but not DOM order. Use sparingly.

#### `gap`: Spacing Between Items

```css
.container {
    display: flex;
    gap: 16px; /* Space between items */
}

/* Directional */
.container {
    row-gap: 16px;
    column-gap: 24px;
}
```

**Browser support (2026):** Universal (Chrome 84+, Safari 14.1+, Firefox 63+).

---

### 7.6 Common Flexbox Patterns

**Navigation bar:**

```css
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}
```

**Card layout (column):**

```css
.card {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-title {
    flex-shrink: 0;
}

.card-content {
    flex-grow: 1;
}

.card-footer {
    flex-shrink: 0;
}
```

**Sidebar + main content:**

```css
.layout {
    display: flex;
    gap: 20px;
}

.sidebar {
    flex: 0 0 250px; /* Fixed width */
}

.main {
    flex: 1; /* Fills remaining space */
}
```

**Responsive layout (mobile-first):**

```css
.container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

@media (min-width: 768px) {
    .container {
        flex-direction: row;
    }

    .sidebar {
        flex: 0 0 300px;
    }

    .main {
        flex: 1;
    }
}
```

---

## 8. CSS Grid: Two-Dimensional Layout

### 8.1 Grid Container and Grid Items

**CSS Grid** is a two-dimensional layout system for rows and columns simultaneously.

```html

<div class="container">  <!-- Grid container -->
    <div>Item 1</div>      <!-- Grid item -->
    <div>Item 2</div>      <!-- Grid item -->
</div>
```

```css
.container {
    display: grid;
    grid-template-columns: 200px 200px 200px;
    grid-template-rows: 100px 100px;
}
```

Creates 3-column, 2-row grid.

---

### 8.2 `grid-template-columns` and `grid-template-rows`

#### Fixed Sizes

```css
.container {
    grid-template-columns: 200px 300px 200px;
    grid-template-rows: 100px 150px;
}
```

#### Fractional Units (`fr`)

Distributes available space proportionally:

```css
.container {
    grid-template-columns: 1fr 2fr 1fr; /* Middle gets 2x space */
}
```

#### Mixing Units

```css
.container {
    grid-template-columns: 200px 1fr 2fr;
}

/* First: fixed 200px, Rest: 1/3 and 2/3 of remaining */
```

---

### 8.3 `repeat()`, `minmax()`, `auto-fill`, `auto-fit`

#### `repeat()`

```css
.container {
    grid-template-columns: repeat(3, 1fr); /* 1fr 1fr 1fr */
}
```

#### `minmax()`

```css
.container {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
}

/* Each column: minimum 200px, can grow to fill */
```

#### `auto-fill` vs `auto-fit`

```css
/* auto-fill: Create as many columns as fit, leave empty */
.container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* auto-fit: Create as many columns, collapse empty */
.container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

**Responsive without media queries:**

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}

/* Automatically adjusts columns based on container width */
```

---

### 8.4 Explicit Placement and Spanning

#### Spanning Cells

```css
.item {
    grid-column: span 2; /* Span 2 columns */
    grid-row: span 3; /* Span 3 rows */
}
```

#### Explicit Placement (Grid Lines)

```css
.item {
    grid-column: 1 / 3; /* Start line 1, end before line 3 */
    grid-row: 2 / 4;
}
```

#### Negative Line Numbers

```css
.item {
    grid-column: 1 / -1; /* First column to last (full width) */
}
```

---

### 8.5 Named Lines and Template Areas

**Template areas (ASCII art layout):**

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 80px 1fr 60px;
    grid-template-areas:
        "header header header"
        "sidebar content aside"
        "footer footer footer";
}

.header {
    grid-area: header;
}

.sidebar {
    grid-area: sidebar;
}

.content {
    grid-area: content;
}

.aside {
    grid-area: aside;
}

.footer {
    grid-area: footer;
}
```

Visual, readable layout definition.

---

# Part 4: Advanced CSS

## 9. Units and Values

### 9.1 Absolute and Relative Units

#### Absolute Units

**`px` (pixels):**

Fixed size, doesn't scale:

```css
selector {
    border: 1px solid;
    width: 300px;
}
```

**When to use:** Borders, small fixed dimensions.

**When NOT to use:** Font sizes (reduces accessibility).

#### Relative Units

**`rem` (root em) — Recommended:**

Relative to root `<html>` font size:

```css
html {
    font-size: 16px;
}

p {
    font-size: 1rem; /* 16px */
}

h1 {
    font-size: 2rem; /* 32px */
}
```

**Predictable** sizing across entire document.

**`em`:**

Relative to parent element font size:

```css
p {
    font-size: 16px;
}

p strong {
    font-size: 1.5em; /* 24px */
}
```

Compounds when nested (can cause issues).

**`%` (percentage):**

Relative to parent element:

```css
.child {
    width: 50%; /* 50% of parent width */
}
```

---

### 9.2 Viewport Units

#### `vw` / `vh` (viewport width/height)

```css
selector {
    width: 50vw; /* 50% of viewport width */
    height: 100vh; /* 100% of viewport height */
}
```

**Problem on mobile:** Address bar affects viewport height, causing shifts.

#### `svh` / `dvh` (small/dynamic viewport height)

```css
selector {
    height: 100svh; /* Small viewport (stable) */
    height: 100dvh; /* Dynamic (adjusts as UI shows/hides) */
}
```

**Browser support (2026):** Safari 15.4+, Chrome 108+, Firefox 110+.

---

### 9.3 Functional Values: `clamp()`, `min()`, `max()`

#### `clamp(min, preferred, max)`

Constrains a value between minimum and maximum:

```css
selector {
    font-size: clamp(16px, 4vw, 32px);
    /* Font is 4vw, but never < 16px or > 32px */
}
```

**Fluid typography without media queries:**

```css
h1 {
    font-size: clamp(1.5rem, 5vw, 3rem);
}
```

#### `min()` and `max()`

```css
selector {
    width: min(600px, 100%); /* Smaller of the two */
    width: max(300px, 50%); /* Larger of the two */
}
```

---

## 10. Responsive Design

### 10.1 Mobile-First vs Desktop-First

#### Mobile-First (Recommended)

Write base styles for small screens, enhance for larger:

```css
/* Base: mobile */
.container {
    padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        padding: 32px;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .container {
        padding: 48px;
    }
}
```

**Advantages:**

- Progressive enhancement
- Better mobile performance
- Prioritizes content

#### Desktop-First

Write for large screens, adapt for smaller:

```css
/* Base: desktop */
.container {
    padding: 48px;
}

/* Tablet and down */
@media (max-width: 1023px) {
    .container {
        padding: 32px;
    }
}

/* Mobile */
@media (max-width: 767px) {
    .container {
        padding: 16px;
    }
}
```

**Modern verdict:** Mobile-first is standard.

---

### 10.2 Media Queries and Breakpoints

#### Basic Media Queries

```css
@media (min-width: 768px) {
    /* Styles for tablets and up */
}

@media (max-width: 767px) {
    /* Styles for mobile only */
}
```

#### Modern Range Syntax

```css
@media (width >= 768px) {
}

@media (600px <= width < 1024px) {
}
```

#### Common Breakpoints (2026)

```css
/* Mobile: < 768px (base) */

/* Tablet */
@media (min-width: 768px) {
}

/* Desktop */
@media (min-width: 1024px) {
}

/* Large desktop */
@media (min-width: 1280px) {
}

/* Extra large */
@media (min-width: 1536px) {
}
```

#### User Preference Queries

```css
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #000;
        --text: #fff;
    }
}

@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}

@media (prefers-contrast: high) {
    button {
        border: 2px solid currentColor;
    }
}
```

**Always respect `prefers-reduced-motion`** for accessibility.

---

### 10.3 Container Queries

Elements respond to *container* size, not viewport:

```css
.container {
    container-type: inline-size; /* Make this a query container */
}

@container (min-width: 400px) {
    .card__title {
        font-size: 24px;
    }
}
```

**Use case:** Responsive components that adapt based on placement.

**Browser support (2026):** Chrome 105+, Safari 16+, Firefox 110+.

---

## 11. Animations and Transitions

### 11.1 Transitions: Animating Property Changes

```css
button {
    background-color: blue;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: red; /* Animates over 0.3 seconds */
}
```

**Syntax:**

```css
selector {
    transition: property duration easing delay;
}
```

**Multiple properties:**

```css
button {
    transition: background-color 0.3s ease, transform 0.2s ease-out;
}
```

**Best practice:** Specify exact properties for performance:

```css
selector {
    transition: background-color 0.3s ease; /* Good */
    transition: all 0.3s ease; /* Avoid: animates everything */
}
```

---

### 11.2 Keyframe Animations

Multi-step animations:

```css
@keyframes slide-in {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.element {
    animation: slide-in 0.5s ease-out;
}
```

**Percentage keyframes:**

```css
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
```

**Animation properties:**

```css
.element {
    animation-name: pulse;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-delay: 0.2s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-fill-mode: forwards;
}

/* Shorthand */
selector {
    animation: pulse 1s ease-in-out 0.2s infinite alternate forwards;
}
```

---

### 11.3 `transform`: 2D and 3D Transformations

Modify position, size, rotation without affecting layout:

```css
selector {
    transform: translate(50px, 100px); /* Move */
    transform: scale(1.2); /* Resize */
    transform: rotate(45deg); /* Rotate */
    transform: skew(10deg, 5deg); /* Skew */

    /* Combining */
    transform: translate(50px, 100px) rotate(45deg) scale(1.2);

    /* 3D */
    transform: rotateX(45deg);
    transform: rotateY(30deg);
    transform: translateZ(100px);
}
```

**Performance tip:** Animate `transform` and `opacity` for smooth 60fps animations.

```css
/* BAD: Triggers layout */
.element:hover {
    width: 400px;
}

/* GOOD: Composite only */
.element:hover {
    transform: scaleX(1.5);
}
```

---

### 11.4 Accessibility: `prefers-reduced-motion`

Always respect user's motion preferences:

```css
.element {
    transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
    .element {
        transition: none;
    }
}
```

**Global accessibility reset:**

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 12. Modern CSS Features

### 12.1 CSS Custom Properties (CSS Variables)

Dynamic, runtime values:

```css
:root {
    --primary-color: #007bff;
    --spacing-unit: 8px;
}

button {
    background-color: var(--primary-color);
    padding: var(--spacing-unit);
}
```

**Fallback values:**

```css
selector {
    color: var(--text-color, black); /* Uses black if --text-color undefined */
}
```

**Local scope:**

```css
.card {
    --card-spacing: 16px;
}

.card__title {
    margin-bottom: var(--card-spacing);
}
```

**Dynamic updates:**

```css
:root {
    --bg-color: white;
    --text-color: black;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: black;
        --text-color: white;
    }
}

body {
    background: var(--bg-color);
    color: var(--text-color);
}
```

**JavaScript manipulation:**

```javascript
document.documentElement.style.setProperty('--primary-color', '#ff0000');
```

---

### 12.2 CSS Logical Properties

Adapt to writing direction (LTR, RTL):

```css
selector {
    /* Physical (old) */
    margin-left: 20px;
    margin-right: 10px;

    /* Logical (new) */
    margin-inline-start: 20px; /* Left in LTR, right in RTL */
    margin-inline-end: 10px; /* Right in LTR, left in RTL */
}
```

**Complete mapping:**

| Physical        | Logical               |
|-----------------|-----------------------|
| `margin-left`   | `margin-inline-start` |
| `margin-right`  | `margin-inline-end`   |
| `margin-top`    | `margin-block-start`  |
| `margin-bottom` | `margin-block-end`    |
| `width`         | `inline-size`         |
| `height`        | `block-size`          |

**Shorthand:**

```css
selector {
    margin-inline: 20px; /* Start and end */
    padding-block: 10px 20px; /* Start, end */
}
```

**Use case:** Internationalization (works in RTL languages without changes).

---

### 12.3 Native CSS Nesting

Nest selectors without preprocessors:

```css
.card {
    padding: 16px;

    .card__title {
        font-size: 24px;
    }

    &:hover {
        background: gray;
    }

    & .card__footer {
        margin-top: auto;
    }
}
```

Equivalent to:

```css
.card {
    padding: 16px;
}

.card .card__title {
    font-size: 24px;
}

.card:hover {
    background: gray;
}

.card .card__footer {
    margin-top: auto;
}
```

**Browser support (2026):** Chrome 112+, Safari 16.5+, Firefox 117+.

---

### 12.4 Modern Color Functions

#### `oklch()`: Perceptually Uniform Color Space

```css
selector {
    color: oklch(60% 0.15 180); /* Lightness, Chroma, Hue */
}
```

Better for color manipulation than RGB/HSL.

#### `color-mix()`: Mix Two Colors

```css
selector {
    background: color-mix(in srgb, blue 70%, white); /* 70% blue, 30% white */
}
```

#### Relative Color Syntax

Modify existing colors:

```css
:root {
    --primary: oklch(60% 0.2 200);
}

button {
    background: oklch(from var(--primary) l c calc(h + 30));
    /* Same lightness and chroma, hue shifted by 30deg */
}
```

**Browser support (2026):** Safari 16.4+, Chrome 111+, Firefox 113+.

---

### 12.5 `:has()` for Parent Selection

Select elements based on children:

```css
.card:has(img) {
    display: grid;
    grid-template-columns: 200px 1fr;
}

form:has(input:invalid) {
    border: 2px solid red;
}

label:has(input:checked) {
    font-weight: bold;
}
```

**Game-changing pattern** for component styling.

---

## 13. CSS Performance and Optimization

### 13.1 Critical Rendering Path

Browser rendering sequence:

1. **Parse HTML** → Build DOM
2. **Parse CSS** → Build CSSOM
3. **Combine DOM + CSSOM** → Render tree
4. **Layout** → Calculate positions
5. **Paint** → Draw pixels
6. **Composite** → Layer composition

**CSS blocks rendering** until CSSOM is complete.

**Optimization:**

- Minimize CSS file size
- Inline critical CSS (above-the-fold)
- Load non-critical CSS asynchronously

```html
<!-- Inline critical CSS -->
<style>
    body {
        margin: 0;
        font-family: system-ui;
    }

    .hero {
        display: flex;
        height: 100vh;
    }
</style>

<!-- Load main stylesheet asynchronously -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

---

### 13.2 Paint vs Layout vs Composite Triggers

#### Layout Triggers (Most Expensive)

Changing these forces layout recalculation:

```css
width, height, margin, padding, border
position, top, left, display, float
```

#### Paint Triggers (Moderate)

Changing these forces repaint but not layout:

```css
color, background-color, box-shadow, border-radius, visibility
```

#### Composite Triggers (Cheapest)

Handled by GPU, no layout/paint:

```css
transform, opacity
```

**Best practice:** Animate `transform` and `opacity` for smooth 60fps:

```css
/* BAD: Triggers layout */
.element:hover {
    width: 400px;
}

/* GOOD: Composite only */
.element:hover {
    transform: scale(1.2);
}
```

---

### 13.3 CSS Containment

Isolate elements for performance optimization:

```css
.widget {
    contain: layout; /* Internal layout independent */
    contain: paint; /* Descendants can't paint outside */
    contain: size; /* Size independent of content */
    contain: strict; /* All of above */
}
```

**Use case:** Independent widgets, cards, components.

---

### 13.4 `content-visibility: auto`

Skip rendering off-screen elements:

```css
.article {
    content-visibility: auto;
    contain-intrinsic-size: 800px; /* Placeholder size */
}
```

Improves initial page load for long lists/infinite scroll.

**Browser support (2026):** Chrome 85+, Edge 85+.

---

### 13.5 Font Loading Strategies

#### `font-display: swap`

Show fallback font immediately, swap when loaded:

```css
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: swap;  /* Recommended */
}
```

**Values:**

- `auto` — Browser default
- `block` — Hide text until loaded (3 sec timeout)
- `swap` — Show fallback, swap when loaded (best for body text)
- `fallback` — Brief block, swap if fast (3 sec timeout)
- `optional` — Only swap if loads quickly

---

### 13.6 CSS Selector Performance

Modern browsers are **extremely fast** at CSS matching. Selector performance rarely matters unless you have thousands of
rules.

**Focus on readability** and maintainability instead:

```css
/* GOOD: Fast and readable */
.nav-link:hover {
    color: red;
}

/* BAD: Slower and hard to maintain */
body div.container ul li a.link:hover {
    color: red;
}
```

**Best practices:**

- Use class selectors over complex selectors
- Avoid universal selectors in complex contexts
- Follow BEM or similar methodology
- Keep selector chains short

---

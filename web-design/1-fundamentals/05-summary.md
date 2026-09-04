# Summary

---

## Include CSS

There are 3 ways to include CSS:

- **Internal Inline Style** - using `style` attribute
- **Internal (Embedded) Style** - using `<style>` tag in the HTML page
- **External Style** (linking or importing) from external resource

---

## CSS Styles

- Browser's Default Styles
- **CSS Reset**: Aggressive approach, that removes all browser default styles creating a blank canvas.
- **CSS Normalize**: Pragmatic approach, normalizers fix browser bugs and inconsistencies while preserving useful
  semantic
  defaults.
- **Modern Approach**:
    - **Minimal Reset + Custom Base Style**
    - **Minimal Rest + Project-specific Base Style**
    - **Modern best practices using CSS Layers**

### Recommendation

- Using a framework
- Design System - Minimal Reset + Custom Base Style
- Use CSS Layers
- Avoid using aggressive resets that require restoring everything.

---

## Basic Selectors

### **Type (Element) Selectors**

- Target HTML elements by tag name.
- Specificity: `0-0-0-1` (lowest).

### **Class Selectors**

- Target HTML elements with specific class attribute.
- Specificity: `0-0-1-0` (moderate).

### **ID Selectors**

- Target HTML elements with specific id attribute.
- Specificity: `0-1-0-0` (highest).

Recommendations:

- Use **Type** selectors for base styles for HTML elements.
- Use **Class** selectors for component and utility studying.
- Use **ID** selectors for JavaScript selectors, sections, input labels...
- Avoid using **ID** selectors for styling HTML elements.

---

## Attribute Selectors

- Target elements based on the HTML attribute.
- Specificity: `0-0-1-0` (moderate).

### Presence Selector

`img[alt] { prop:value }`

### Exact Match

`img[alt="hero-img"] { prop:value }`

### Substring Matches

- Starts with `element[attr^="value"]`
- Ends with `element[attr$="value"]`
- Contains substring `element[attr*="value"]`
- Contains word `element[attr~="value"]`
- Contains hyphen-prefix `element[attr|="value"]`

### Case-sensitive Match

`element[attr="value" i]`

---

## Pseudo-Classes

- Pseudo-classes select elements in specific state or at specific position.
- Specificity: `0-0-1-0` (moderate).

`element:pseudo-class`

### Form State Pseudo Classes

- `input:disabled`
- `input:checked`
- `input:valid`
- `input:invalid`
- `input:required`

### Structural Pseudo Classes

- `li:first-child`
- `li:last-child`
- `li:nth-child(odd)`
- `li:nth-child(even)`
- `li:nth-child(3)`
- `li:nth-child(2n)`
- `li:nth-child(3n+1)`
- `li:only-child`

### Negation and Target

- `:not()`
- `:empty()`
- `:target()`

---

## Pseudo-Elements

- Pseudo-elements create virtual elements or style specific parts of elements.
- Specificity: `0-0-0-1` (lowest).

Use double colons to distinguish pseudo-elements from pseudo-classes.

- `::before` - insert generated content before
- `::after` - insert generated content after
- `::placeholder`
- `::first-line`
- `::first-letter`
- `::selection`

---

## Modern Selectors

### `is()`

Uses the highest specificity of its arguments list.

### `where()`

Where has 0 specificity

### `has()`

Selects based on dependents or following siblings.


---

## Combinators

### Descendants Combinator

- uses space to select descendants`div p`

### Child Combinator

- uses > to select direct child `div > p`

### Adjacent Sibling

- uses + to select adjacent element `div + p`

### General Sibling

- uses ~ to select all following siblings `div ~ p`

### Combining Combinators

Combinators can be used in combination with other combinators and elements creating complex and more specific rules.

---

## CSS Cascade

The cascade is the algorithm, which CSS rule applies when multiple rules target the same element with conflicting
properties.

### Priority Order

- Inline Styles
- ID Selectors
- Classes, attributes, pseudo-classes
- Type selectors, pseudo-elements

---

## Specificity

| Selector Type  | Specificity Value    | Points |
|----------------|----------------------|--------|
| Inline style   | `1-0-0-0`            | 1000   |
| ID             | `0-1-0-0`            | 100    |
| Class          | `0-0-1-0`            | 10     |
| Pseudo-class   | `0-0-1-0`            | 10     |
| Attribute      | `0-0-1-0`            | 10     |
| Type           | `0-0-0-1`            | 1      |
| Pseudo-element | `0-0-0-1`            | 1      |
| Universal `*`  | `0-0-0-0`            | 0      |
| Combinators    | `0-0-0-0`            | 0      |
| `:where()`     | `0-0-0-0`            | 0      |
| `:is()`        | Depends on arguments | —      |
| `:has()`       | Depends on arguments | —      |
| `:not()`       | Depends on arguments | —      |

---

## Inheritance

Inheritance is the mechanism where certain CSS properties automatically apply to child elements.

### Inherited properties

- **Text**: `color`, `font-*`, `line-height`...
- Visibility: `visibility`, `cursor`
- List:` list-style`, `list-style-type`

### Non-inherited properties

- **Box Model**: `margin`, `border`, `padding`, `content`
- **Position**: `position`, `top`, `left`, `bottom`, `right`, `z-index`...
- **Layout**: `display`, `float`, `flex`, `grid`
- **Visual**: `background`, `background`-`color`, `opacity`, `box-shadow`

### Forcing Inheritance

- Forcing Inheritance `font-family: inherit`
- Resetting Inheritance `font-family: initial`

---

## Important

Avoid using important, the flag gives maximum priority overriding normal cascade.

Recommendations:

- Increase specificity
- Be more specific in selectors
- use cascade of layers

---

## CSS Cascade Layer

```css
@layer reset, base, components, utilities;

@layer reset {
}

@layer base {
}

@layer components {
}

@layer utilities {
}
```

- Layers declared **first** have **lower** priority
- Layers declared **later** have **higher** priority
- **Unlayered** styles have the highest priority

---

## Box Model

Every HTML element is rendered as a rectangular box with 4 concentric layers:

- margin
- border
- padding
- content

### Content Area

- The **innermost area** where text and child elements render.
- Size controlled by width and height (when `box-sizing: content-box`).

### Padding

- **Space inside the border**, between the border and content.

### Border

- The **visible line** around padding and content.

### Margin

- **Space outside the border**, between this element and neighbors.

#### Box Sizing

**Box-sizing** property controls **how width and height are calculated**.

- `box-sizing: content-box` - **width** and **height** apply to content only, padding and border are added on top.
- `box-sizing: border-box` - **width** and **height** include padding and border. Content area shrinks to accommodate
  them.

#### Margin Collapsing

**Margin collapsing** is a CSS behavior where vertical margins between adjacent block elements combine rather than add
together. When vertical margins touch, the **larger margin wins**.

Margin does not collapse:

- Horizontal margins
- Flex items
- Grid items
- Absolutely positioned elements
- Float elements

---

## Display

Controls how an element participates in layout.

- `display:block` - default for block elements
- `display:inline` - default for inline elements
- `display:inline-block` - hybrid, best of both worlds
- `display:none` - the element is completely removed from the flow, different than `visibility:hidden`

---

## Overflow

Controls what happens when content is larger than its container.

- `overflow:visible` - content spills outside.
- `overflow:hidden` - content is clipped.
- `overflow:scroll` - creates scroll container scroll is always visible.
- `overflow:auto` - creates scroll container scroll is dynamically rendered.
- `overflow:clip` - content is clipped but does not create a scroll container.

---

## Position

Controls how an element is positioned in the document flow.

- `position:static` - default, normal flow offset properties have no effects
- `position:relative` - normal flow but can be offset from original position
- `position:absolute` - remove from normal flow offset based on nearest positioned ancestor.
- `position:fixed` - positions element to viewport, stays in place when scrolling.
- `position:sticky` - hybrid between relative and fixed. After the element reaches a certain threshold it becomes fixed.

**Any position value other than static creates a positioning context**.

---

## Z-Index

Controls the stacking order of positioned elements along the z-axis (front-to-back).

---

## Typography

Generic font families:

- **serif**: Georgia, Times, with serif
- **sans-serif**: Arial, Helvetica, no serifs
- **monospace**: Courier, fixed width
- **cursive**: handwritten fonts
- **fantasy**: decorative fonts

---

## CSS Flexbox - One-Dimensional Layout

Flex Container and Flex Items

Flexbox is a one-dimensional layout system for arranging items in rows or columns with intelligent space distribution.

- **Flex Container**: Parent element with `display:flex`
- **Flex Item**: Direct child element of flex container

Flexbox Axis:

- **Main Axis**: Direction items flow
- **Cross Axis**: Crossing the main axis

Other important properties:

- `flex-direction`, `flex-wrap`, `flex-flow`
- `justify-content`,`align-content`,`align-items`
- `flex-grow`,`flex-shrink`,`flex-basis`,`flex`
- `align-self`,`order`,`gap`

Common Flexbox Patterns:

- Navigation bar
- Card Layout
- Sidebar - Main content
- Responsive Layout

---

## CSS Grid - Two-Dimensional Layout

Grid Container and Grid Items

Grid is a two-dimensional layout system for rows and columns simultaneously.

- `grid-template-columns` - defines number of columns and column width
- `grid-template-rows` - defines number of rows and row width
- `grid-template-areas` - defines a grid area template or placeholder
- `grid-area` - maps the area names with the elements
- `fr` - Fractional Units -
- `repeat()` - repeats column creation for responsive design
- `minmax()` - creates column with size between min and max
- `auto-fil()` - creates as many columns as fit, leaves empty columns
- `auto-fit()` - creates as many columns, but collapse empty

---

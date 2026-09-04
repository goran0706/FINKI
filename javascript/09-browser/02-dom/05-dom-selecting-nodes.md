# Selecting DOM Nodes

## Node-Level Selection vs Element-Level Selection

While element selection methods prioritize HTML tags and structural containers, node-level selection provides granular
access to every entity in the Document Object Model. This includes non-element nodes such as text fragments, comments,
CDATA sections, and processing instructions. Selecting and inspecting specific node instances is essential when building
template engines, rich text editors, or low-level parser utilities where raw text content, whitespace, and comment
directives carry structural or functional significance. Selecting at the node level ensures that whitespace and comment
nodes are not stripped or ignored during document processing.

| Selection Approach    | Targeted Entities                                   | API Output Types                                 | Primary Architectural Focus                          |
|:----------------------|:----------------------------------------------------|:-------------------------------------------------|:-----------------------------------------------------|
| **Element Selection** | HTML elements only (`<div>`, `<p>`, etc.)           | `Element`, `HTMLCollection`                      | Managing layout, styling, and DOM components         |
| **Node Selection**    | All DOM entities (Text, Comment, Element, Document) | `Node`, `NodeList`, `TreeWalker`, `NodeIterator` | Processing content streams, text nodes, and metadata |

## Traversal-Based Node Selection

Navigating directly from an existing node reference allows precise selection of adjacent text, comment, or element nodes
using explicit relational properties defined on the base `Node` interface. Because traversal properties inspect every
raw node, formatting whitespace inside HTML markup creates text nodes that are returned by `firstChild`, `lastChild`,
and sibling references.

| Node Property         | Direction / Relation | Target Entity Type              | Behavior on Missing Entity            |
|:----------------------|:---------------------|:--------------------------------|:--------------------------------------|
| **`parentNode`**      | Upward               | Immediate parent node           | Returns `null` at document root       |
| **`firstChild`**      | Downward             | First child node of any type    | Returns `null` if container is empty  |
| **`lastChild`**       | Downward             | Terminal child node of any type | Returns `null` if container is empty  |
| **`previousSibling`** | Lateral (Backward)   | Preceding sibling node          | Returns `null` if node is first child |
| **`nextSibling`**     | Lateral (Forward)    | Following sibling node          | Returns `null` if node is last child  |

```javascript
// Navigating through raw child nodes including text and comments
const container = document.querySelector('.content-box');

// Selects the initial child node (often a text node containing whitespace/line break)
const firstRawNode = container.firstChild;

if (firstRawNode.nodeType === Node.TEXT_NODE) {
    console.log('Leading text/whitespace content:', firstRawNode.nodeValue);
}
```

## Advanced Node Selection APIs (`TreeWalker` & `NodeIterator`)

For complex document traversal filtering, the DOM standard exposes the `Document.createTreeWalker()` and
`Document.createNodeIterator()` factory methods. These APIs traverse node subtrees according to configurable type
bitmasks and custom filtering routines. Custom filtering logic can be implemented by passing a callback function or an
object with an `acceptNode()` method that returns `NodeFilter.FILTER_ACCEPT`, `NodeFilter.FILTER_SKIP`, or
`NodeFilter.FILTER_REJECT`.

| API Engine         | Traversal Model                                | Key Navigational Methods                                      | Use Case                                           |
|:-------------------|:-----------------------------------------------|:--------------------------------------------------------------|:---------------------------------------------------|
| **`TreeWalker`**   | Represents a full tree hierarchy               | `parentNode()`, `firstChild()`, `nextSibling()`, `nextNode()` | Structural subtree navigation with custom filters  |
| **`NodeIterator`** | Flattens nodes into a sequential document list | `nextNode()`, `previousNode()`                                | Linear document traversal and sequential searching |

```javascript
// Creating a TreeWalker to collect all Comment nodes within a container
const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT, // Filter bitmask targeting comments exclusively
    null
);

let currentComment = walker.nextNode();
while (currentComment) {
    console.log('Found comment directive:', currentComment.nodeValue);
    currentComment = walker.nextNode();
}
```

## XPath Document Querying

XPath (XML Path Language) allows complex node selection queries based on node types, relationships, text content, and
position within the document hierarchy. The `document.evaluate()` method executes XPath expressions against the DOM
tree. XPath querying provides powerful pattern-matching capabilities, such as selecting text nodes directly or filtering
elements by text content, which CSS selectors cannot accomplish natively.

| Method Parameter  | Parameter Description                                                           | Expected Type           |
|:------------------|:--------------------------------------------------------------------------------|:------------------------|
| **`expression`**  | The XPath string expression to evaluate                                         | `string`                |
| **`contextNode`** | The root node context for evaluating the expression                             | `Node`                  |
| **`resolver`**    | Custom namespace resolver callback function                                     | `Function` or `null`    |
| **`type`**        | Desired result format constant (e.g., `XPathResult.ORDERED_NODE_SNAPSHOT_TYPE`) | `number`                |
| **`result`**      | Reusable `XPathResult` object container                                         | `XPathResult` or `null` |

```javascript
// Using XPath to locate all text nodes containing specific text
const xpathResult = document.evaluate(
    "//div[@class='article']//text()[contains(., 'important')]",
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
);

for (let i = 0; i < xpathResult.snapshotLength; i++) {
    const textNode = xpathResult.snapshotItem(i);
    console.log('Matching text node:', textNode.nodeValue);
}
```

## Use Cases

* **Custom Rich Text Editors:** Selecting, wrapping, and splitting individual `Text` nodes inside contenteditable
  elements during text selection and formatting operations.
* **Metadata Extraction from Comments:** Scanning document comment nodes via `TreeWalker` to extract build timestamps,
  template directives, or micro-framework bindings.
* **Text Search and Highlighting:** Locating specific string sequences within raw text nodes using `TreeWalker` or XPath
  to apply highlight markup without breaking structural HTML.
* **DOM Sanitization:** Iterating through raw nodes to identify and strip unwanted processing instructions, comments, or
  unapproved nodes prior to rendering.

## Best Practices

* **Prefer `TreeWalker` Over Recursive Traversal:** Use `document.createTreeWalker()` instead of custom recursive
  JavaScript functions when searching subtrees for performance and memory efficiency.
* **Filter Explicitly with Node Bitmasks:** Pass specific bitmasks (e.g.,
  `NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT`) to restrict `TreeWalker` processing exclusively to target node
  types.
* **Verify `nodeType` Before Reading Node Values:** Always check `node.nodeType === Node.TEXT_NODE` before reading or
  modifying `node.nodeValue` to prevent unintended operations on element nodes.
* **Handle Blank Text Nodes in Traversal Loops:** Account for formatting whitespace when using `nextSibling` or
  `previousSibling` to traverse elements, or use element-specific alternatives (`nextElementSibling`) when text nodes
  are not required.
* **Reuse `XPathResult` Objects in High-Frequency Queries:** Pass an existing `XPathResult` instance as the final
  parameter to `document.evaluate()` to reduce memory allocations during repeated lookups.
* **Avoid Modifying Subtrees During Active `NodeIterator` Loops:** Mutating the DOM tree while iterating over a
  `NodeIterator` can skip nodes or lead to unpredictable iteration states; collect target nodes into an array before
  applying destructive changes.
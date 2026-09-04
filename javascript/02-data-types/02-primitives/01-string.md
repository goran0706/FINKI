# Strings Deep-Dive

* **String Creation:** Instantiated through literal syntax wrappers or via the `String()` function wrapper to type-cast
  expressions into primitive strings.
    * *Anti-Pattern:* Invoking `new String()` instantiates an object wrapper structure over the string data, breaking
      standard primitive equality and matching operations.


* **String Literals:** Character sets enclosed within uniform quote markings. Double quotes (`"..."`) and single quotes
  (`'...'`) behave identically in the language engine, requiring escaping patterns if the surrounding quote boundary
  character is repeated within the text stream.


* **String Escaping Characters:** Backslash (`\`) escape prefixes used to encode specific non-printable control
  sequences or structural text boundary characters:
    * `\'` Single Quote
    * `\"` Double Quote
    * `\\` Backslash
    * `\n` Newline (Line Feed)
    * `\r` Carriage Return
    * `\t` Horizontal Tab
    * `\uXXXX` Unicode character code denoted by exactly four hexadecimal digits.


* **Template Literals:** Multi-line string containers bounded by backtick expressions (`` `...` ``). They allow embedded
  expressions to be parsed and evaluated at runtime via template interpolation placeholders (`${expression}`).


* **Tagged Template Literals:** Advanced execution syntax parsing template literals through a specified processing
  function. The target tag function receives an array of literal string segments as its first parameter, followed by
  each individual evaluated expression placeholder as rest parameters, enabling highly customized string parsing
  pipelines.


* **Unicode Strings:** JavaScript processes string characters via UTF-16 code units. Standard characters require a
  single 16-bit code unit, while extended characters (such as emojis or complex symbols) require two code units (a
  surrogate pair) totaling 32 bits. This causes characters outside the Base Multilingual Plane to register a `.length`
  value of `2`.

## Strings Examples

```javascript
// 1. String Creation
// Primitive literal creation vs type-casting using String()
let literalString = "Hello, World!";
let castedString = String(12345);

// Anti-Pattern: Using `new String()` creates an object wrapper, not a primitive
// The String() constructor creates String objects.
// When called as a function (without new), it returns primitive values of type String.
let objectString = new String("Hello");
console.log(typeof objectString); // "object"
console.log(literalString === objectString); // false


// 2. String Literals
// Double and single quotes behave identically
let singleQuoted = 'Software Engineer';
let doubleQuoted = "Software Engineer";
let escapedQuote = 'It\'s a wonderful day!';


// 3. String Escaping Characters
// Using backslash escapes for control sequences and Unicode
let multiLineText = "Line 1\nLine 2\tTabbed Column";
let unicodeChar = "\u0041"; // Evaluates to 'A'
console.log(unicodeChar); // "A"


// 4. Template Literals
// Multi-line support and runtime expression interpolation using ${expression}
let userName = "Alice";
let greeting = `Welcome back, ${userName}!`;
console.log(greeting);


// 5. Tagged Template Literals
// Parsing literal segments and evaluated expressions through a custom tag function
const firstName = "John";
const lastName = "Doe";

function templateTag(strings, ...values) {
    console.log(strings);
    console.log(values);
    return strings[0] + values[0] + strings[1] + values[1];
}

const res = templateTag`Employee Name: ${firstName} ${lastName}`;
console.log(res);


// 6. Unicode Strings & Length Gotchas
// UTF-16 surrogate pairs count as two code units (.length of 2)
let standardText = "abc";
console.log(standardText.length); // 3

let emojiText = "🚀";
console.log(emojiText.length); // 2 (Surrogate pair)
```

## Tagged Template Literals Use Cases

Tagged template literals are not used for simple string concatenation; their true power lies in **processing,
transforming, or analyzing** the strings and values *before* they are combined into a final output.

When you just output `strings[0] + values[0]`, it behaves identically to a standard template literal. However, because
the function intercepts the string segments and expression values separately, you can use tagged templates for powerful
real-world use cases:

### Automatic Sanitization & Security (Preventing XSS)

You can automatically escape or sanitize user-supplied inputs to prevent injection attacks before they hit the DOM or
database.

```javascript
function sanitize(strings, ...values) {
    return strings.reduce((result, str, i) => {
        let val = values[i] !== undefined
            ? String(values[i]).replace(/</g, "&lt;").replace(/>/g, "&gt;")
            : "";
        return result + str + val;
    }, "");
}

const userComment = "<script>alert('hack')</script>";
const safeHTML = sanitize`User comment: ${userComment}`;
// Result: "User comment: &lt;script&gt;alert('hack')&lt;/script&gt;"
```

### Internationalization & Localization (i18n)

You can pass dynamic variables into a translation dictionary lookup using the raw string segments as keys.

```javascript
function localize(strings, ...values) {
    const key = strings.join("{placeholder}");
    // Look up `key` in a translation map and inject `values` dynamically
    return translateDatabase[key] || key;
}
```

### Styled Components & CSS-in-JS

Libraries like styled-components use tagged template literals to parse CSS strings, scope styles, and inject them
dynamically into the document header when components render.

```javascript
const Button = styled.button`
    background: ${props => props.primary ? "blue" : "gray"};
    color: white;
`;
```

### SQL Query Builders

Libraries use tags to safely construct parameterized SQL queries, protecting against SQL injection by separating the
query structure (`strings`) from user inputs (`values`).

```javascript
const userId = 5;
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
// Separates safe SQL syntax from user data parameters automatically
```

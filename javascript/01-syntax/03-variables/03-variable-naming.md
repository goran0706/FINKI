# Variable Naming

* **Valid Identifier Character Rules:** The JavaScript engine parser enforces strict byte-level criteria for
  constructing identifier tokens:
    * Must begin explicitly with a Unicode letter (`a-z`, `A-Z`), an underscore (`_`), or a dollar sign (`$`).
    * **The `#` Token Exception:** The hash symbol (`#`) cannot be used to start a general variable identifier. It is
      restricted by the ECMAScript grammar exclusively as a prefix modifier for declaring private class elements inside
      structural class bodies.
    * Subsequent characters may include alphanumeric digits (`0-9`), underscores (`_`), and dollar signs (`$`).
    * Identifiers cannot contain structural whitespace, hyphens (`-`), or match engine-reserved keywords (`if`, `while`,
      `export`, `let`, `class`).


* **Case Sensitivity Enforcement:** JavaScript identifiers are strictly case-sensitive. The tokens `userName`,
  `username`, and `USERNAME` point to three entirely distinct and unique memory locations inside the environment record.


* **Naming Standards:**
    * *camelCase (Standard Variables/Functions):* Starts lowercase, capitalizing subsequent internal words (
      `let totalInvoiceAmount;`).
    * *PascalCase (Classes/Constructors):* Every word starts capitalized (`class OrderProcessor {}`).
    * *SCREAMING_SNAKE_CASE (Global Constants):* All capital letters linked via underscores. Used for fixed, pre-runtime
      configuration values (`const MAX_API_RETRIES = 5;`).
    * *Descriptive Context Principle:* Identifiers must clearly explain their tracked state. Boolean values should
      contain semantic verbal prefixes (`isActive`, `hasPermission`), and single-character identifiers must be rejected
      outside of loop indices (`i`, `j`).

```javascript
// Valid Syntax Examples
let userName;          // Optimal camelCase practice
let ageGroup5;         // Alphanumeric composition
let $specialWrapper;   // Valid leading dollar operator
let _internalCache;    // Valid leading underscore for internal isolation

// Invalid Syntax Examples
let user_name;         // Permitted by engine, but violates modern camelCase style conventions
let 21players;         // SyntaxError: Cannot begin an identifier token with a digit
let user-id;           // SyntaxError: Evaluated as a subtraction operator (-) instead of a name
let let;               // SyntaxError: Cannot overwrite a language-reserved keyword
let #privateVar;       // SyntaxError: Hash prefix is illegal on standalone variables (restricted to Class elements)
```

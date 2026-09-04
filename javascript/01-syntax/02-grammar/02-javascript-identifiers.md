# Identifiers

* **Identifier Naming Rules:** Strict lexical rules governing binding names. Identifiers can contain Unicode letters,
  digits, underscores (`_`), and dollar signs (`$`). They must not begin with a numeric digit and cannot match reserved
  keywords.


* **Case Sensitivity Enforcement:** JavaScript identifiers are strictly case-sensitive at the byte level. The tokens
  `userAge`, `userage`, and `USERAGE` represent three entirely unique, distinct memory references within the Lexical
  Environment record.


* **Naming Conventions:** Unenforced semantic standards used to organize intent:
    * *camelCase:* First letter lowercase, capitalizing subsequent embedded words; used for local variables, properties,
      and function names.
    * *PascalCase:* Capitalizing every word start; reserved for classes and constructor structures.
    * *SCREAMING_SNAKE_CASE:* All capital letters separated by underscores; reserved for global, immutable, compile-time
      constants.


* **Reserved Keywords:** Syntactic tokens permanently set aside by the language specification (`if`, `for`, `function`,
  `class`, `const`). They possess specific predefined semantic roles and cannot be repurposed as identifier names.

```javascript
// allowed
let userName;  // Best practice use camelCase
let user_name; // Bad practice
let ageGroup5;
let $kindOfSpecial;
let #privateProperty;
let _internalValue;

// not allowed
let 21players;
let user-b;
let let;

// Naming best practices
let userName = "camelCase";             // variables
let UserName = "PascalCase";            // classes and objects
let USERNAME = "SCREAMING_SNAKE_CASE";  // constants
```

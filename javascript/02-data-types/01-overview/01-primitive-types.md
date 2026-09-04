# Primitive Data Types

* **String:** An immutable sequence of 16-bit unsigned integer values representing UTF-16 code units. They are indexed
  positionally starting at `0` and possess a read-only `.length` property tracking code units.


* **Number:** A 64-bit binary format IEEE 754 floating-point value. It handles both integer values and fractional
  floating-point numbers within distinct structural precision limits ($2^{53} - 1$ down to $- (2^{53} - 1)$).


* **BigInt:** An arbitrary-precision integer primitive capable of safely processing integers beyond the structural safe
  limit of the `Number` type. It cannot represent fractional numbers and cannot be mixed with standard numbers in
  arithmetic operations without explicit casting.


* **Boolean:** A logical primitive representing exactly one of two semantic values: `true` or `false`.


* **Undefined:** A primitive type with exactly one structural value: `undefined`. It signifies the complete absence of
  an assigned value, automatically matching uninitialized variables or missing functional parameters. Architectural
  standard rules specify that `undefined` should be left strictly as the system-level default marker; developers should
  avoid explicitly assigning `undefined` to clear references, opting instead to use `null` to signify an intentional
  reset.


* **Null:** A primitive type with exactly one structural value: `null`. It signifies the intentional, explicit absence
  of any object reference value. *Type System Exception:* Evaluating `typeof null` returns `"object"`. This is an
  uncorrected legacy flaw in the initial ECMAScript implementation where the type tags for objects (`000`) matched the
  memory layout of the null pointer representation.


* **Symbol:**  An immutable, unique primitive value used primarily to create property keys that are guaranteed never to
  collide with string keys or with other symbols — even ones created with the exact same description. Every call to
  Symbol ('description') produces a distinct value; the description is just a debugging label, not an identifier.
  Symbol-keyed properties are excluded from `for...in`, `Object.keys()`, `JSON.stringify()`, and normal enumeration —
  not because symbols are inherently "hidden," but because these mechanisms were specified to skip them, keeping
  symbol-based metadata out of code that iterates an object expecting only its "data" properties. (They're still
  discoverable via `Object.getOwnPropertySymbols()`, so "hidden" is a relative term.) This makes Symbols the right tool
  when two independent, unrelated pieces of code — two mixins, or your code and a third-party library — need to attach
  data to the same shared object under a conceptually similar name without one silently overwriting the other. They are
  not for cases of intentional overriding (e.g., a subclass replacing a value its parent set via super ()) — that's
  expected, related-code overwrite behavior, not a collision to prevent.

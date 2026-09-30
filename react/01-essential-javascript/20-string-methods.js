/**
 * String Methods
 * ==============
 *
 * JavaScript provides built-in methods for inspecting, searching, extracting,
 * transforming, formatting, and comparing strings.
 *
 * Strings are immutable, so string methods do not modify the original string.
 * Methods that transform a string return a new string, while inspection methods
 * return other values such as numbers, booleans, arrays, or match iterators.
 */

// ---------------------------------------------------------------------
// 1. Strings are immutable
// ---------------------------------------------------------------------

// String methods do not modify the original string.
// A transformation returns a new string instead.

const message = "Hello, JavaScript";
const upperMessage = message.toUpperCase();

console.log(message); // "Hello, JavaScript"
console.log(upperMessage); // "HELLO, JAVASCRIPT"

// The original string remains unchanged.

// ---------------------------------------------------------------------
// 2. `length`
// ---------------------------------------------------------------------

// `length` is a property, not a method.
// It returns the number of UTF-16 code units in the string.

const username = "johndoe";
const empty = "";

console.log(username.length); // 7
console.log(empty.length); // 0

// `length` is commonly used when validating or iterating over strings.

// ---------------------------------------------------------------------
// 3. `toUpperCase()`
// ---------------------------------------------------------------------

// `toUpperCase()` returns a new string with letters converted to uppercase.

const text = "JavaScript";

console.log(text.toUpperCase()); // "JAVASCRIPT"
console.log(text); // "JavaScript"

// The original string is unchanged.

// ---------------------------------------------------------------------
// 4. `toLowerCase()`
// ---------------------------------------------------------------------

// `toLowerCase()` returns a new string with letters converted to lowercase.

const language = "JavaScript";

console.log(language.toLowerCase()); // "javascript"
console.log(language); // "JavaScript"

// This is commonly useful when a comparison should ignore case.

// ---------------------------------------------------------------------
// 5. `trim()`
// ---------------------------------------------------------------------

// `trim()` removes whitespace from both ends of a string.

const input = "   JavaScript   ";

console.log(input.trim()); // "JavaScript"
console.log(input); // "   JavaScript   "

// Whitespace inside the string is not removed.

// ---------------------------------------------------------------------
// 6. `trimStart()` and `trimEnd()`
// ---------------------------------------------------------------------

// `trimStart()` removes whitespace from the beginning.
// `trimEnd()` removes whitespace from the end.

const value = "   JavaScript   ";

console.log(value.trimStart()); // "JavaScript   "
console.log(value.trimEnd()); // "   JavaScript"

// Use these methods when only one side should be normalized.

// ---------------------------------------------------------------------
// 7. `charAt()`
// ---------------------------------------------------------------------

// `charAt()` returns the UTF-16 code unit at a specified index as a string.
// The index is zero-based.

const word = "JavaScript";

console.log(word.charAt(0)); // "J"
console.log(word.charAt(4)); // "S"
console.log(word.charAt(9)); // "t"
console.log(word.charAt(20)); // ""

// An index outside the string returns an empty string.

// ---------------------------------------------------------------------
// 8. Bracket notation
// ---------------------------------------------------------------------

// Strings can also be accessed using bracket notation.
// Like `charAt()`, the index refers to a UTF-16 code unit position.

const framework = "React";

console.log(framework[0]); // "R"
console.log(framework[1]); // "e"
console.log(framework[4]); // "t"
console.log(framework[20]); // undefined

// Bracket notation returns `undefined` when the index does not exist,
// while `charAt()` returns an empty string.

// ---------------------------------------------------------------------
// 9. `charCodeAt()`
// ---------------------------------------------------------------------

// `charCodeAt()` returns the numeric UTF-16 code unit at a given index.

const letter = "A";
const wordValue = "ABC";

console.log(letter.charCodeAt(0)); // 65
console.log(wordValue.charCodeAt(0)); // 65
console.log(wordValue.charCodeAt(1)); // 66
console.log(wordValue.charCodeAt(2)); // 67

// For characters represented by surrogate pairs, `codePointAt()`
// can be used to retrieve the complete Unicode code point.

// ---------------------------------------------------------------------
// 10. `codePointAt()`
// ---------------------------------------------------------------------

// `codePointAt()` returns the Unicode code point beginning at the given index.

const symbol = "😀";

console.log(symbol.codePointAt(0)); // 128512

// Some Unicode characters require two UTF-16 code units.
// This is why `length` and index-based access can sometimes be surprising.

// ---------------------------------------------------------------------
// 11. `at()`
// ---------------------------------------------------------------------

// `at()` returns the character at an index and supports negative indexes.

const letters = "JavaScript";

console.log(letters.at(0)); // "J"
console.log(letters.at(4)); // "S"
console.log(letters.at(-1)); // "t"
console.log(letters.at(-2)); // "p"

// Negative indexes count backward from the end.
// An out-of-range index returns `undefined`.

// ---------------------------------------------------------------------
// 12. `includes()`
// ---------------------------------------------------------------------

// `includes()` checks whether a string contains another string.
// It returns a boolean and is case-sensitive.

const sentence = "JavaScript is powerful";

console.log(sentence.includes("JavaScript")); // true
console.log(sentence.includes("powerful")); // true
console.log(sentence.includes("Python")); // false
console.log(sentence.includes("javascript")); // false

// ---------------------------------------------------------------------
// 13. `startsWith()`
// ---------------------------------------------------------------------

// `startsWith()` checks whether a string begins with a specified value.

const url = "https://example.com";

console.log(url.startsWith("https://")); // true
console.log(url.startsWith("http://")); // false

// The optional second argument specifies the position at which to start checking.

const textValue = "JavaScript";

console.log(textValue.startsWith("Script", 4)); // true

// ---------------------------------------------------------------------
// 14. `endsWith()`
// ---------------------------------------------------------------------

// `endsWith()` checks whether a string ends with a specified value.

const filename = "document.pdf";

console.log(filename.endsWith(".pdf")); // true
console.log(filename.endsWith(".js")); // false

// The optional second argument specifies the string length to consider.

console.log("JavaScript".endsWith("Java", 4)); // true

// ---------------------------------------------------------------------
// 15. `indexOf()`
// ---------------------------------------------------------------------

// `indexOf()` returns the first index where a substring occurs.
// It returns -1 when the substring cannot be found.

const phrase = "JavaScript is JavaScript";

console.log(phrase.indexOf("JavaScript")); // 0
console.log(phrase.indexOf("is")); // 11
console.log(phrase.indexOf("Python")); // -1

// The search is case-sensitive.

// ---------------------------------------------------------------------
// 16. `lastIndexOf()`
// ---------------------------------------------------------------------

// `lastIndexOf()` returns the index of the last occurrence of a substring.
// It returns -1 when the substring cannot be found.

const repeated = "JavaScript is JavaScript";

console.log(repeated.lastIndexOf("JavaScript")); // 18
console.log(repeated.lastIndexOf("Java")); // 18
console.log(repeated.lastIndexOf("Python")); // -1

// This is useful when the final occurrence matters.

// ---------------------------------------------------------------------
// 17. `indexOf()` with a starting position
// ---------------------------------------------------------------------

// The optional second argument specifies the position from which the search begins.

const path = "src/components/Button/Button.js";

const firstSlash = path.indexOf("/");
const secondSlash = path.indexOf("/", firstSlash + 1);

console.log(firstSlash); // 3
console.log(secondSlash); // 14

// Starting the search after a previous match allows later occurrences to be located.

// ---------------------------------------------------------------------
// 18. `search()`
// ---------------------------------------------------------------------

// `search()` searches using a regular expression and returns the first match index.
// It returns -1 when no match is found.

const email = "[john@example.com](mailto:john@example.com)";

console.log(email.search("@")); // 4
console.log(email.search(/example/)); // 5
console.log(email.search(/admin/)); // -1

// Unlike `indexOf()`, `search()` accepts a regular expression.

// ---------------------------------------------------------------------
// 19. `match()`
// ---------------------------------------------------------------------

// `match()` searches a string using a regular expression.
// Its return value depends on the regular expression flags.

const sentenceValue = "JavaScript JavaScript";

console.log(sentenceValue.match(/JavaScript/));
// ["JavaScript", index: 0, input: "JavaScript JavaScript", groups: undefined]

console.log(sentenceValue.match(/JavaScript/g));
// ["JavaScript", "JavaScript"]

// Without `g`, the result includes details about the first match.
// With `g`, the result contains the matched strings for all occurrences.

// ---------------------------------------------------------------------
// 20. `matchAll()`
// ---------------------------------------------------------------------

// `matchAll()` returns an iterator containing detailed information
// about every regular-expression match.
// The regular expression must use the `g` flag.

const source = "JavaScript JavaScript";
const matches = [...source.matchAll(/JavaScript/g)];

console.log(matches.length); // 2
console.log(matches[0][0]); // "JavaScript"
console.log(matches[1][0]); // "JavaScript"

// Unlike `match()` with `g`, `matchAll()` preserves match details
// such as indexes and capture groups for each occurrence.

// ---------------------------------------------------------------------
// 21. `slice()`
// ---------------------------------------------------------------------

// `slice()` extracts part of a string and returns a new string.
// The start index is inclusive and the end index is exclusive.

const languageName = "JavaScript";

console.log(languageName.slice(0, 4)); // "Java"
console.log(languageName.slice(4, 10)); // "Script"
console.log(languageName); // "JavaScript"

// The original string is unchanged.

// ---------------------------------------------------------------------
// 22. `slice()` with negative indexes
// ---------------------------------------------------------------------

// Negative indexes count backward from the end.

const filenameValue = "application.js";

console.log(filenameValue.slice(-2)); // "js"
console.log(filenameValue.slice(-5)); // "n.js"
console.log(filenameValue.slice(0, -3)); // "application"

// Negative indexes are useful for extracting suffixes and prefixes.

// ---------------------------------------------------------------------
// 23. `substring()`
// ---------------------------------------------------------------------

// `substring()` extracts characters between two indexes.
// The end index is exclusive.

const wordValue = "JavaScript";

console.log(wordValue.substring(0, 4)); // "Java"
console.log(wordValue.substring(4, 10)); // "Script"

// Unlike `slice()`, `substring()` converts negative arguments to 0.

// ---------------------------------------------------------------------
// 24. `slice()` vs `substring()`
// ---------------------------------------------------------------------

const valueA = "JavaScript";

console.log(valueA.slice(-6)); // "Script"
console.log(valueA.substring(-6)); // "JavaScript"

// `slice()` supports negative indexes.
// `substring()` converts negative indexes to 0.

// `slice()` is often the clearer choice when negative indexes are useful.

// ---------------------------------------------------------------------
// 25. `substr()`
// ---------------------------------------------------------------------

// `substr()` is a legacy method and should not be used in new code.
//
// It accepted a starting index and a length:
//
// "JavaScript".substr(4, 6); // "Script"
//
// Prefer `slice()` instead:
//
// "JavaScript".slice(4, 10); // "Script"

// `substr()` is included here because older JavaScript codebases
// may still contain it.

// ---------------------------------------------------------------------
// 26. `replace()`
// ---------------------------------------------------------------------

// `replace()` replaces the first matching occurrence when given a string.

const messageValue = "Hello, John. Hello, Jane.";
const replaced = messageValue.replace("Hello", "Hi");

console.log(replaced); // "Hi, John. Hello, Jane."

// Only the first matching occurrence was replaced.

// ---------------------------------------------------------------------
// 27. `replaceAll()`
// ---------------------------------------------------------------------

// `replaceAll()` replaces every occurrence of a string.

const greetingText = "Hello, John. Hello, Jane.";
const replacedAll = greetingText.replaceAll("Hello", "Hi");

console.log(replacedAll); // "Hi, John. Hi, Jane."

// The original string remains unchanged.

// ---------------------------------------------------------------------
// 28. `replace()` with a regular expression
// ---------------------------------------------------------------------

// `replace()` can use a regular expression.
// The `g` flag makes every matching occurrence eligible for replacement.

const code = "123-456-789";
const masked = code.replace(/\d/g, "*");

console.log(masked); // "***-***-***"

// Regular expressions provide more flexible matching rules.

// ---------------------------------------------------------------------
// 29. `replace()` with a callback
// ---------------------------------------------------------------------

// The replacement can be a function.
// The callback receives information about each match and returns its replacement.

const pricesText = "10 20 30";

const doubledPrices = pricesText.replace(/\d+/g, (value) => {
  return String(Number(value) * 2);
});

console.log(doubledPrices); // "20 40 60"

// Each matched value is converted to a number, doubled, and converted back to a string.

// ---------------------------------------------------------------------
// 30. `split()`
// ---------------------------------------------------------------------

// `split()` divides a string into an array using a separator.

const csv = "apple,banana,orange";
const fruits = csv.split(",");

console.log(fruits); // ["apple", "banana", "orange"]

// `split()` is useful for converting delimited text into an array.

// ---------------------------------------------------------------------
// 31. `split()` with a limit
// ---------------------------------------------------------------------

// The optional second argument limits the number of returned elements.

const values = "one,two,three,four";

console.log(values.split(",", 2)); // ["one", "two"]

// Values after the limit are not included in the returned array.

// ---------------------------------------------------------------------
// 32. `split()` with an empty string
// ---------------------------------------------------------------------

// Splitting with an empty string creates elements from UTF-16 code units.

const wordText = "JavaScript";

console.log(wordText.split(""));
// ["J", "a", "v", "a", "S", "c", "r", "i", "p", "t"]

// For Unicode characters represented by surrogate pairs,
// this can split one user-perceived character into multiple elements.

// ---------------------------------------------------------------------
// 33. `concat()`
// ---------------------------------------------------------------------

// `concat()` combines strings and returns a new string.

const first = "Hello";
const second = "World";
const combined = first.concat(", ", second, "!");

console.log(combined); // "Hello, World!"

// Template literals are often more readable when combining dynamic values.

// ---------------------------------------------------------------------
// 34. `repeat()`
// ---------------------------------------------------------------------

// `repeat()` creates a new string by repeating the original string
// the specified number of times.

const separator = "-";

console.log(separator.repeat(10)); // "----------"

const indentation = "  ".repeat(3);

console.log(indentation + "Indented"); // "      Indented"

// The count must be a non-negative finite integer.

// ---------------------------------------------------------------------
// 35. `padStart()`
// ---------------------------------------------------------------------

// `padStart()` adds characters to the beginning until the string
// reaches the specified target length.

const id = "42";
const minute = "7";

console.log(id.padStart(5, "0")); // "00042"
console.log(minute.padStart(2, "0")); // "07"

// The original string is unchanged.

// ---------------------------------------------------------------------
// 36. `padEnd()`
// ---------------------------------------------------------------------

// `padEnd()` adds characters to the end until the string
// reaches the specified target length.

const label = "Name";
const valueText = "42";

console.log(label.padEnd(10, ".")); // "Name......"
console.log(valueText.padEnd(5, "0")); // "42000"

// Padding is useful for fixed-width textual output.

// ---------------------------------------------------------------------
// 37. `normalize()`
// ---------------------------------------------------------------------

// `normalize()` converts a string to a Unicode normalization form.

const composed = "\u00E9";
const decomposed = "e\u0301";

console.log(composed === decomposed); // false

console.log(composed.normalize() === decomposed.normalize()); // true

// Unicode can represent visually equivalent text using different
// sequences of code points. Normalization can make such comparisons consistent.

// ---------------------------------------------------------------------
// 38. `localeCompare()`
// ---------------------------------------------------------------------

// `localeCompare()` compares strings according to locale-sensitive ordering.
// The result is negative, positive, or zero depending on the comparison.

console.log("apple".localeCompare("banana")); // negative number
console.log("banana".localeCompare("apple")); // positive number
console.log("apple".localeCompare("apple")); // 0

// The exact negative or positive value is implementation-dependent.
// Only the sign should generally be relied upon.

// It can also be used as a sorting comparator:

const namesToSort = ["John", "Alice", "Mike"];

namesToSort.sort((a, b) => a.localeCompare(b));

console.log(namesToSort); // ["Alice", "John", "Mike"]

// ---------------------------------------------------------------------
// 39. Case-insensitive comparisons
// ---------------------------------------------------------------------

// String comparison is case-sensitive by default.

const roleName = "Admin";

console.log(roleName === "admin"); // false

// Normalize both values when a case-insensitive comparison is intended.

const inputRole = "ADMIN";
const isAdminRole = inputRole.toLowerCase() === "admin";

console.log(isAdminRole); // true

// The appropriate normalization depends on the application's requirements.

// ---------------------------------------------------------------------
// 40. Chaining string methods
// ---------------------------------------------------------------------

// String methods return values that can often be passed directly
// into another string method.

const rawUsername = "   JohnDoe   ";

const normalized = rawUsername.trim().toLowerCase();

console.log(normalized); // "johndoe"

// Chaining is useful when each operation performs a simple transformation.

// ---------------------------------------------------------------------
// 41. Combining search and transformation
// ---------------------------------------------------------------------

// Small transformations can be composed before performing a search.

const inputValue = "  JavaScript  ";
const normalizedInput = inputValue.trim().toLowerCase();

if (normalizedInput.includes("javascript")) {
  console.log("JavaScript detected"); // "JavaScript detected"
}

// Each operation produces the value consumed by the next operation.

// ---------------------------------------------------------------------
// 42. Strings and immutability
// ---------------------------------------------------------------------

// Multiple operations can produce different strings from the same original value.

const originalText = "hello";

const upperText = originalText.toUpperCase();
const replacedText = originalText.replace("h", "H");

console.log(originalText); // "hello"
console.log(upperText); // "HELLO"
console.log(replacedText); // "Hello"

// String methods do not mutate the original string.
// They return new strings when a transformation is needed.

// ---------------------------------------------------------------------
// 43. Common mistake: case-sensitive searches
// ---------------------------------------------------------------------

// Methods such as `includes()` are case-sensitive by default.

const title = "JavaScript Methods";

console.log(title.includes("javascript")); // false
console.log(title.includes("JavaScript")); // true

// Normalize case when the search should be case-insensitive.

const normalizedTitle = title.toLowerCase();

console.log(normalizedTitle.includes("javascript")); // true

// The appropriate normalization depends on the application's requirements.

// ---------------------------------------------------------------------
// 44. Common mistake: using `indexOf()` as a boolean
// ---------------------------------------------------------------------

// `indexOf()` returns an index, not a boolean.
// An index of 0 is a valid match but is also falsy.

const textToSearch = "JavaScript";

if (textToSearch.indexOf("Java") !== -1) {
  console.log("Found"); // "Found"
}

// Avoid:
//
// if (textToSearch.indexOf("Java")) {
//     ...
// }
//
// because an index of 0 would incorrectly behave as false.

// Prefer `includes()` when only existence needs to be checked.

if (textToSearch.includes("Java")) {
  console.log("Found"); // "Found"
}

// ---------------------------------------------------------------------
// 45. Common mistake: expecting methods to mutate the string
// ---------------------------------------------------------------------

// Calling a string method does not replace the original value.

let mutableLookingText = "hello";

mutableLookingText.toUpperCase();

console.log(mutableLookingText); // "hello"

// Store or assign the returned string when the transformed value is needed.

mutableLookingText = mutableLookingText.toUpperCase();

console.log(mutableLookingText); // "HELLO"

// Strings are immutable.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Strings are immutable; string methods do not modify the original string.
// - `length` returns the number of UTF-16 code units.
// - `toUpperCase()` and `toLowerCase()` return strings with transformed casing.
// - `trim()`, `trimStart()`, and `trimEnd()` remove surrounding whitespace.
// - `includes()`, `startsWith()`, and `endsWith()` perform common string checks.
// - `indexOf()` and `lastIndexOf()` locate substring positions.
// - `search()`, `match()`, and `matchAll()` support regular-expression searches.
// - `slice()`, `substring()`, and `at()` provide different forms of string access and extraction.
// - `replace()` and `replaceAll()` return strings with replacements applied.
// - `split()` converts a string into an array.
// - `concat()` combines strings, although template literals are often clearer.
// - `repeat()`, `padStart()`, and `padEnd()` support textual formatting.
// - `normalize()` handles Unicode normalization.
// - `localeCompare()` provides locale-sensitive string comparison and sorting.
// - String methods can be chained to build readable transformation pipelines.

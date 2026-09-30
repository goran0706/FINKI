/**
 * Destructuring Arrays
 * ====================
 *
 * Array destructuring allows values to be extracted from an array and
 * assigned to variables using a concise syntax.
 *
 * Unlike object destructuring, array destructuring is based on position:
 * the first pattern element receives the first array value, the second
 * receives the second value, and so on.
 */

// ---------------------------------------------------------------------
// 1. Basic array destructuring
// ---------------------------------------------------------------------

// Values are extracted according to their position in the array.
const colors = ["red", "green", "blue"];

const [firstColor, secondColor, thirdColor] = colors;

console.log(firstColor); // "red"
console.log(secondColor); // "green"
console.log(thirdColor); // "blue"

// ---------------------------------------------------------------------
// 2. Destructuring by position
// ---------------------------------------------------------------------

// Array destructuring is purely positional; variable names have no effect on mapping.
const numbers = [10, 20, 30];

const [a, b, c] = numbers;

console.log(a); // 10
console.log(b); // 20
console.log(c); // 30

// ---------------------------------------------------------------------
// 3. Skipping values
// ---------------------------------------------------------------------

// Empty positions in the pattern skip corresponding values in the array.
const values = [10, 20, 30, 40];

const [first, , third, fourth] = values;

console.log(first); // 10
console.log(third); // 30
console.log(fourth); // 40

// ---------------------------------------------------------------------
// 4. Destructuring fewer values
// ---------------------------------------------------------------------

// Unextracted remaining values stay in the original array.
const user = ["John", "Doe", 30, "admin"];

const [firstName, lastName] = user;

console.log(firstName); // "John"
console.log(lastName); // "Doe"

// ---------------------------------------------------------------------
// 5. Missing values
// ---------------------------------------------------------------------

// Missing array elements at requested positions evaluate to `undefined`.
const coordinates = [10];

const [x, y] = coordinates;

console.log(x); // 10
console.log(y); // undefined

// ---------------------------------------------------------------------
// 6. Default values
// ---------------------------------------------------------------------

// Default values are applied only when the destructured value is `undefined`.
const settings = ["dark"];

const [theme, language = "en"] = settings;

console.log(theme); // "dark"
console.log(language); // "en"

const preferences = ["dark", null];
const [selectedTheme, selectedLanguage = "en"] = preferences;

console.log(selectedTheme); // "dark"
console.log(selectedLanguage); // null (`null` does not trigger defaults)

// ---------------------------------------------------------------------
// 7. Rest elements
// ---------------------------------------------------------------------

// The rest element must be last and collects all remaining values into a new array.
const scores = [100, 90, 80, 70];

const [highest, ...remainingScores] = scores;

console.log(highest); // 100
console.log(remainingScores); // [90, 80, 70]

// ---------------------------------------------------------------------
// 8. Rest elements after skipped values
// ---------------------------------------------------------------------

// Rest elements can follow skipped array positions.
const items = ["first", "second", "third", "fourth"];

const [, secondItem, ...otherItems] = items;

console.log(secondItem); // "second"
console.log(otherItems); // ["third", "fourth"]

// ---------------------------------------------------------------------
// 9. Swapping variables
// ---------------------------------------------------------------------

// Array destructuring provides a concise way to swap variable values.
let firstValue = 10;
let secondValue = 20;

[firstValue, secondValue] = [secondValue, firstValue];

console.log(firstValue); // 20
console.log(secondValue); // 10

// ---------------------------------------------------------------------
// 10. Destructuring existing variables
// ---------------------------------------------------------------------

// Parentheses are optional for array destructuring assignments since `[]` is not a block.
let name;
let age;

const person = ["John", 30];
[name, age] = person;

console.log(name); // "John"
console.log(age); // 30

// ---------------------------------------------------------------------
// 11. Nested array destructuring
// ---------------------------------------------------------------------

// Nested arrays can be destructured recursively by position.
const matrix = [
  [1, 2],
  [3, 4],
];

const [[a1, a2], [b1, b2]] = matrix;

console.log(a1); // 1
console.log(a2); // 2
console.log(b1); // 3
console.log(b2); // 4

// ---------------------------------------------------------------------
// 12. Mixed array and object destructuring
// ---------------------------------------------------------------------

// Array and object destructuring can be combined for complex data structures.
const users = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
];

const [{ name: firstUserName }, { name: secondUserName }] = users;

console.log(firstUserName); // "John"
console.log(secondUserName); // "Jane"

// ---------------------------------------------------------------------
// 13. Destructuring function parameters
// ---------------------------------------------------------------------

// Arrays can be destructured directly inside function parameter lists.
function addCoordinates([x, y]) {
  return x + y;
}

console.log(addCoordinates([10, 20])); // 30

// ---------------------------------------------------------------------
// 14. Default values in function parameters
// ---------------------------------------------------------------------

// Defaults can be applied to individual array elements and fallback arrays.
function getPosition([x = 0, y = 0]) {
  return { x, y };
}

console.log(getPosition([10, 20])); // { x: 10, y: 20 }
console.log(getPosition([10])); // { x: 10, y: 0 }

function createPosition([x = 0, y = 0] = []) {
  return { x, y };
}

console.log(createPosition()); // { x: 0, y: 0 }

// ---------------------------------------------------------------------
// 15. Destructuring returned arrays
// ---------------------------------------------------------------------

// Destructuring is useful for unpacking multiple positional values returned from functions.
function getCoordinates() {
  return [10, 20];
}

const [coordinateX, coordinateY] = getCoordinates();

console.log(coordinateX); // 10
console.log(coordinateY); // 20

// ---------------------------------------------------------------------
// 16. Destructuring strings
// ---------------------------------------------------------------------

// Array destructuring works with any iterable, including string characters.
const word = "React";

const [firstLetter, secondLetter, thirdLetter] = word;

console.log(firstLetter); // "R"
console.log(secondLetter); // "e"
console.log(thirdLetter); // "a"

// ---------------------------------------------------------------------
// 17. Destructuring other iterables
// ---------------------------------------------------------------------

// Iterables such as Sets can be consumed in iteration order via destructuring.
const numbersSet = new Set([10, 20, 30]);

const [firstNumber, secondNumber] = numbersSet;

console.log(firstNumber); // 10
console.log(secondNumber); // 20

// ---------------------------------------------------------------------
// 18. Array destructuring does not clone nested values
// ---------------------------------------------------------------------

// Array destructuring copies references rather than performing deep clones.
const data = [
  {
    name: "John",
  },
];

const [extractedUser] = data;
extractedUser.name = "Jane";

console.log(data[0].name); // "Jane"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Array destructuring extracts values according to their position.
// - Empty positions can skip values that are not needed.
// - Missing values produce `undefined` unless a default is provided.
// - Default values are used only when the value is `undefined`.
// - Rest elements collect remaining values into a new array.
// - Array destructuring can be nested and combined with object destructuring.
// - It can be used in variable declarations, assignments, and function parameters.
// - Array destructuring works with iterable values such as strings and Sets.
// - Destructuring assigns existing values by reference and does not deep-clone nested objects.

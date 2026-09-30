/**
 * Array.prototype.flatMap()
 * =========================
 *
 * The `Array.prototype.flatMap()` maps each array element and then flattens the
 * result by exactly one level. It combines the behavior of `map()` and
 * `flat(1)` into a single operation.
 *
 * This file covers basic usage, one-level flattening, filtering,
 * expansion, empty arrays, sparse arrays, callback arguments, and
 * practical data-transformation patterns.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

// `flatMap()` calls a callback for each element and collects the returned values.
// The resulting array is flattened by one level.

const numbers = [1, 2, 3];

const doubled = numbers.flatMap((number) => [number * 2]);

console.log(doubled); // [2, 4, 6]

// With this callback, `flatMap()` is equivalent to:
// `numbers.map((number) => [number * 2]).flat(1)`

const mapped = numbers.map((number) => [number * 2]);

console.log(mapped); // [[2], [4], [6]]
console.log(mapped.flat()); // [2, 4, 6]

// `flatMap()` combines those two operations:

console.log(numbers.flatMap((number) => [number * 2])); // [2, 4, 6]

// ---------------------------------------------------------------------
// 2. `flatMap()` always flattens one level
// ---------------------------------------------------------------------

// The callback can return multiple values as an array.
// Those arrays are flattened into the result.

const values = [1, 2, 3];

const expanded = values.flatMap((value) => [value, value * 10]);

console.log(expanded); // [1, 10, 2, 20, 3, 30]

// Compare this with `map()`:

const mappedValues = values.map((value) => [value, value * 10]);

console.log(mappedValues); // [[1, 10], [2, 20], [3, 30]]

// `map()` preserves the nested arrays.
// `flatMap()` removes exactly one level of nesting.

// ---------------------------------------------------------------------
// 3. `flatMap()` is equivalent to `map()` followed by `flat(1)`
// ---------------------------------------------------------------------

const input = [1, 2, 3];

const usingMapAndFlat = input.map((value) => [value, value * 2]).flat(1);

const usingFlatMap = input.flatMap((value) => [value, value * 2]);

console.log(usingMapAndFlat); // [1, 2, 2, 4, 3, 6]
console.log(usingFlatMap); // [1, 2, 2, 4, 3, 6]

// `flatMap()` communicates the intent more directly when both operations
// are intentionally performed together.

// ---------------------------------------------------------------------
// 4. `flatMap()` can filter elements
// ---------------------------------------------------------------------

// Returning an empty array removes the current element from the result.
// Returning an array with one element keeps it.

const numbersToFilter = [1, 2, 3, 4, 5];

const evenNumbers = numbersToFilter.flatMap((number) => (number % 2 === 0 ? [number] : []));

console.log(evenNumbers); // [2, 4]

// This is equivalent to:

const filtered = numbersToFilter.map((number) => (number % 2 === 0 ? [number] : [])).flat();

console.log(filtered); // [2, 4]

// `flatMap()` can therefore perform a mapping and filtering operation together.

// ---------------------------------------------------------------------
// 5. Returning an empty array removes an element
// ---------------------------------------------------------------------

// An empty array contributes zero elements to the final result.

const words = ["hello", "", "world"];

const nonEmptyWords = words.flatMap((word) => (word === "" ? [] : [word]));

console.log(nonEmptyWords); // ["hello", "world"]

// The callback result determines how many elements each input contributes:
//
// []       -> contributes zero elements
// [value]  -> contributes one element
// [a, b]   -> contributes two elements

// ---------------------------------------------------------------------
// 6. Returning multiple elements expands an element
// ---------------------------------------------------------------------

// A callback can expand one input value into multiple output values.

const names = ["Ada", "Grace"];

const characters = names.flatMap((name) => [...name]);

console.log(characters);
// ["A", "d", "a", "G", "r", "a", "c", "e"]

// Each string is converted to an array of characters,
// then `flatMap()` combines those arrays into one array.

// ---------------------------------------------------------------------
// 7. One input can produce zero, one, or many outputs
// ---------------------------------------------------------------------

// This makes `flatMap()` useful for transformations where each input
// does not necessarily correspond to exactly one output.

const orders = [
  { id: 1, quantity: 2 },
  { id: 2, quantity: 1 },
  { id: 3, quantity: 3 },
];

const orderIds = orders.flatMap((order) => Array(order.quantity).fill(order.id));

console.log(orderIds); // [1, 1, 2, 3, 3, 3]

// Order 1 contributes two values.
// Order 2 contributes one value.
// Order 3 contributes three values.

// ---------------------------------------------------------------------
// 8. Nested arrays are flattened by one level only
// ---------------------------------------------------------------------

// `flatMap()` does not recursively flatten every nested array.

const nested = [1, 2];

const result = nested.flatMap((value) => [[value, value * 2]]);

console.log(result);
// [[1, 2], [2, 4]]

// One level was flattened, but the inner arrays remain.

// `flatMap()` is effectively `flat(1)`, not `flat(Infinity)`.

const deeplyNested = [1, 2];

const deepResult = deeplyNested.flatMap((value) => [[value, [value * 2]]]);

console.log(deepResult);
// [[1, [2]], [2, [4]]]

// Only the outer returned array was flattened.

// ---------------------------------------------------------------------
// 9. `flatMap()` does not recursively flatten callback results
// ---------------------------------------------------------------------

// Returning three levels of nesting does not cause recursive flattening.

const nestedValues = [1];

const flattenedOnce = nestedValues.flatMap((value) => [[[value]]]);

console.log(flattenedOnce);
// [[[1]]]

// The result has still been flattened by only one level.

// If deeper flattening is actually required, call `flat()` separately:

const flattenedDeeply = nestedValues.flatMap((value) => [[[value]]]).flat(Infinity);

console.log(flattenedDeeply); // [1]

// ---------------------------------------------------------------------
// 10. Callback arguments
// ---------------------------------------------------------------------

// The callback receives three arguments:
//
// 1. current element
// 2. current index
// 3. the array being processed

const letters = ["a", "b", "c"];

const withIndexes = letters.flatMap((letter, index, array) => {
  console.log(letter, index, array);
  return [`${index}:${letter}`];
});

console.log(withIndexes);
// ["0:a", "1:b", "2:c"]

// The third argument is the original array being processed.
// It is not the array currently being built by `flatMap()`.

// ---------------------------------------------------------------------
// 11. Using the index
// ---------------------------------------------------------------------

// The index can be used to create additional information.

const products = ["Keyboard", "Mouse", "Monitor"];

const numberedProducts = products.flatMap((product, index) => [`${index + 1}. ${product}`]);

console.log(numberedProducts);
// ["1. Keyboard", "2. Mouse", "3. Monitor"]

// The index starts at zero, just like other array iteration methods.

// ---------------------------------------------------------------------
// 12. Using the original array
// ---------------------------------------------------------------------

// The third callback argument can be used when the transformation
// depends on neighboring or related values.

const scores = [10, 20, 30];

const differences = scores.flatMap((score, index, array) => {
  if (index === 0) {
    return [];
  }

  return [score - array[index - 1]];
});

console.log(differences); // [10, 10]

// The first element has no previous value, so it contributes nothing.
// The remaining elements contribute their difference from the previous value.

// ---------------------------------------------------------------------
// 13. Returning non-array values
// ---------------------------------------------------------------------

// If the callback returns a non-array value, that value is added directly.
// It is not wrapped and does not need flattening.

const valuesAgain = [1, 2, 3];

const directValues = valuesAgain.flatMap((value) => value * 2);

console.log(directValues); // [2, 4, 6]

// This behaves like `map()` when the callback returns non-array values.

const mappedDirectly = valuesAgain.map((value) => value * 2);

console.log(mappedDirectly); // [2, 4, 6]

// The flattening behavior only matters when the callback returns arrays.

// ---------------------------------------------------------------------
// 14. Returning strings does not flatten the string
// ---------------------------------------------------------------------

// Strings are iterable, but `flatMap()` does not recursively iterate
// through arbitrary iterable values.
//
// A returned string is treated as one value.

const wordsAgain = ["hello", "world"];

const strings = wordsAgain.flatMap((word) => word);

console.log(strings); // ["hello", "world"]

// To produce individual characters, explicitly return an array:

const chars = wordsAgain.flatMap((word) => [...word]);

console.log(chars); // ["h", "e", "l", "l", "o", "w", "o", "r", "l", "d"]

// ---------------------------------------------------------------------
// 15. Practical transformation: splitting groups
// ---------------------------------------------------------------------

// Suppose each object contains a list of tags.
// `flatMap()` can turn the nested structure into one flat list.

const posts = [
  { title: "Post 1", tags: ["javascript", "react"] },
  { title: "Post 2", tags: ["typescript"] },
  { title: "Post 3", tags: ["react", "css"] },
];

const allTags = posts.flatMap((post) => post.tags);

console.log(allTags);
// ["javascript", "react", "typescript", "react", "css"]

// `map()` would leave the tags nested:

const nestedTags = posts.map((post) => post.tags);

console.log(nestedTags);
// [["javascript", "react"], ["typescript"], ["react", "css"]]

// ---------------------------------------------------------------------
// 16. Practical transformation: flattening optional data
// ---------------------------------------------------------------------

// An element can contribute nothing when data is missing.

const users = [
  { name: "Ada", email: "ada@example.com" },
  { name: "Grace", email: null },
  { name: "Linus", email: "linus@example.com" },
];

const emails = users.flatMap((user) => (user.email ? [user.email] : []));

console.log(emails);
// ["ada@example.com", "linus@example.com"]

// Each user contributes either:
// - one email
// - no email

// ---------------------------------------------------------------------
// 17. Practical React example: rendering multiple items
// ---------------------------------------------------------------------

// `flatMap()` can transform grouped data into a flat list of renderable data.
//
// Example:
//
// const sections = [
//   {
//     title: "Frontend",
//     items: ["React", "CSS"],
//   },
//   {
//     title: "Backend",
//     items: ["Node.js", "PostgreSQL"],
//   },
// ];
//
// const items = sections.flatMap((section) =>
//   section.items.map((item) => ({
//     section: section.title,
//     name: item,
//   })),
// );
//
// The result is:
//
// [
//   { section: "Frontend", name: "React" },
//   { section: "Frontend", name: "CSS" },
//   { section: "Backend", name: "Node.js" },
//   { section: "Backend", name: "PostgreSQL" },
// ]
//
// This can be useful when the UI ultimately needs one flat collection
// even though the source data is grouped.

// ---------------------------------------------------------------------
// 18. Practical React example: conditional expansion
// ---------------------------------------------------------------------

// A grouped UI model can also produce zero or more items per source item.
//
// Example:
//
// const navigation = [
//   {
//     label: "Dashboard",
//     visible: true,
//   },
//   {
//     label: "Admin",
//     visible: false,
//   },
//   {
//     label: "Profile",
//     visible: true,
//   },
// ];
//
// const visibleLinks = navigation.flatMap((item) =>
//   item.visible ? [item] : [],
// );
//
// `visibleLinks` contains only the visible navigation items.
//
// In cases where simple filtering is all that is required,
// `filter()` is usually clearer. `flatMap()` becomes useful when
// each input can produce multiple output values.

// ---------------------------------------------------------------------
// 19. `flatMap()` does not mutate the source array
// ---------------------------------------------------------------------

// Like `map()` and `flat()`, `flatMap()` creates a new result array.

const source = [1, 2, 3];

const transformed = source.flatMap((value) => [value * 2]);

console.log(source); // [1, 2, 3]
console.log(transformed); // [2, 4, 6]

console.log(source === transformed); // false

// The source array remains unchanged.

// ---------------------------------------------------------------------
// 20. `flatMap()` and sparse arrays
// ---------------------------------------------------------------------

// `flatMap()` skips empty slots in the source array,
// just like `map()` does.

const sparseValues = [];

sparseValues[0] = "a";
sparseValues[2] = "c";

console.log(sparseValues); // ["a", empty, "c"]

const mappedSparse = sparseValues.flatMap((value) => [value]);

console.log(mappedSparse); // ["a", "c"]

// The empty slot at index 1 is not passed to the callback.

// ---------------------------------------------------------------------
// 21. `flatMap()` vs. `map()`
// ---------------------------------------------------------------------

// Use `map()` when every input produces exactly one output
// and the output should preserve the same array structure.

const prices = [10, 20, 30];

const withTax = prices.map((price) => price * 1.2);

console.log(withTax); // [12, 24, 36]

// Use `flatMap()` when each input can produce zero, one, or many outputs.

const selectedPrices = prices.flatMap((price) => (price >= 20 ? [price] : []));

console.log(selectedPrices); // [20, 30]

// ---------------------------------------------------------------------
// 22. `flatMap()` vs. `filter()`
// ---------------------------------------------------------------------

// `filter()` is clearer when the only operation is deciding
// whether to keep an existing element.

const numbersForFilter = [1, 2, 3, 4];

const evensWithFilter = numbersForFilter.filter((number) => number % 2 === 0);

console.log(evensWithFilter); // [2, 4]

// `flatMap()` can express the same result:

const evensWithFlatMap = numbersForFilter.flatMap((number) => (number % 2 === 0 ? [number] : []));

console.log(evensWithFlatMap); // [2, 4]

// Prefer `filter()` when there is no transformation or expansion.
// `flatMap()` is most useful when mapping and flattening are both intentional.

// ---------------------------------------------------------------------
// 23. `flatMap()` vs. `flat()`
// ---------------------------------------------------------------------

// `flat()` flattens an existing nested array.

const nestedNumbers = [
  [1, 2],
  [3, 4],
];

console.log(nestedNumbers.flat()); // [1, 2, 3, 4]

// `flatMap()` first transforms each source element,
// then flattens the returned arrays by one level.

const generatedNumbers = [1, 2].flatMap((number) => [number, number * 10]);

console.log(generatedNumbers); // [1, 10, 2, 20]

// Use `flat()` when the nested structure already exists.
// Use `flatMap()` when the nested structure is produced by a mapping step.

// ---------------------------------------------------------------------
// 24. A common mistake: expecting recursive flattening
// ---------------------------------------------------------------------

// `flatMap()` does NOT behave like `flat(Infinity)`.

const nestedData = [1, 2];

const resultOnce = nestedData.flatMap((number) => [[number, number * 2]]);

console.log(resultOnce);
// [[1, 2], [2, 4]]

// If recursive flattening is required, it must be requested explicitly:

const resultDeep = nestedData.flatMap((number) => [[number, number * 2]]).flat(Infinity);

console.log(resultDeep);
// [1, 2, 2, 4]

// Do not use `flatMap()` when the real requirement is arbitrary-depth flattening.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `flatMap()` maps every element and then flattens the result by one level.
// - It is equivalent to `map(...).flat(1)`.
// - The callback can return zero, one, or many output values.
// - Returning `[]` removes the current element from the result.
// - Returning `[value]` keeps or transforms one element.
// - Returning `[valueA, valueB]` expands one input into multiple outputs.
// - Non-array callback results are added directly.
// - Nested arrays are flattened by exactly one level, never recursively.
// - The callback receives the current value, index, and original array.
// - `flatMap()` does not mutate the source array.
// - Use `map()` when each input produces exactly one output.
// - Use `filter()` when the only decision is whether to keep an element.
// - Use `flat()` when you already have nested arrays that need flattening.
// - `flatMap()` is particularly useful for transforming grouped data
//   into a single flat collection.

/**
 * URLSearchParams
 * ===============
 *
 * The URLSearchParams API provides methods for creating, reading, modifying,
 * and serializing URL query parameters. It handles URL encoding and repeated
 * parameters while providing an iterable interface similar to Map.
 */

// ---------------------------------------------------------------------
// 1. Creating URLSearchParams
// ---------------------------------------------------------------------

const params = new URLSearchParams();

console.log(params.toString()); // ""

// URLSearchParams can start empty and receive parameters later.

// ---------------------------------------------------------------------
// 2. Creating from a query string
// ---------------------------------------------------------------------

const searchParams = new URLSearchParams("name=John&age=30&role=developer");

console.log(searchParams.get("name")); // "John"
console.log(searchParams.get("age")); // "30"
console.log(searchParams.get("role")); // "developer"

// Query parameter values are strings.

// ---------------------------------------------------------------------
// 3. Creating from an object
// ---------------------------------------------------------------------

const userParams = new URLSearchParams({
  name: "John",
  age: "30",
  role: "developer",
});

console.log(userParams.toString());
// name=John&age=30&role=developer

// Object property values are converted to strings.

// ---------------------------------------------------------------------
// 4. Creating from an array of entries
// ---------------------------------------------------------------------

const filters = new URLSearchParams([
  ["category", "books"],
  ["sort", "price"],
  ["order", "ascending"],
]);

console.log(filters.toString());
// category=books&sort=price&order=ascending

// An iterable of key-value pairs can be used to initialize the object.

// ---------------------------------------------------------------------
// 5. get()
// ---------------------------------------------------------------------

const query = new URLSearchParams("page=2&limit=20&search=javascript");

console.log(query.get("page")); // "2"
console.log(query.get("limit")); // "20"
console.log(query.get("search")); // "javascript"

console.log(query.get("missing")); // null

// get() returns the first value associated with a parameter.
// If the parameter does not exist, it returns null.

// ---------------------------------------------------------------------
// 6. Values are strings
// ---------------------------------------------------------------------

const values = new URLSearchParams({
  page: "2",
  active: "true",
  score: "95.5",
});

const page = Number(values.get("page"));
const active = values.get("active") === "true";
const score = Number(values.get("score"));

console.log(page); // 2
console.log(active); // true
console.log(score); // 95.5

// URL query parameters are text.
// Convert them explicitly when an application needs another type.

// ---------------------------------------------------------------------
// 7. has()
// ---------------------------------------------------------------------

const search = new URLSearchParams("page=2&sort=price");

console.log(search.has("page")); // true
console.log(search.has("sort")); // true
console.log(search.has("filter")); // false

// has() checks whether a parameter exists.

// ---------------------------------------------------------------------
// 8. has() with a specific value
// ---------------------------------------------------------------------

const categories = new URLSearchParams("category=books&category=games");

console.log(categories.has("category")); // true
console.log(categories.has("category", "books")); // true
console.log(categories.has("category", "music")); // false

// When supported, has(name, value) checks for a specific name/value pair.

// ---------------------------------------------------------------------
// 9. set()
// ---------------------------------------------------------------------

const settings = new URLSearchParams("theme=dark&language=en");

settings.set("theme", "light");

console.log(settings.toString());
// theme=light&language=en

// set() replaces all existing values for the specified parameter.

// ---------------------------------------------------------------------
// 10. set() creates missing parameters
// ---------------------------------------------------------------------

const profile = new URLSearchParams();

profile.set("name", "John");
profile.set("role", "developer");

console.log(profile.toString());
// name=John&role=developer

// If the parameter does not exist, set() creates it.

// ---------------------------------------------------------------------
// 11. set() replaces repeated parameters
// ---------------------------------------------------------------------

const repeated = new URLSearchParams("tag=javascript&tag=typescript&tag=react");

repeated.set("tag", "node");

console.log(repeated.toString());
// tag=node

// set() keeps only one value for that parameter.

// ---------------------------------------------------------------------
// 12. append()
// ---------------------------------------------------------------------

const tags = new URLSearchParams();

tags.append("tag", "javascript");
tags.append("tag", "typescript");
tags.append("tag", "react");

console.log(tags.toString());
// tag=javascript&tag=typescript&tag=react

// append() always adds another name/value pair.
// Unlike set(), it does not replace existing values.

// ---------------------------------------------------------------------
// 13. append() vs. set()
// ---------------------------------------------------------------------

const parameters = new URLSearchParams();

parameters.append("tag", "javascript");
parameters.append("tag", "typescript");

console.log(parameters.getAll("tag"));
// [ "javascript", "typescript" ]

parameters.set("tag", "react");

console.log(parameters.getAll("tag"));
// [ "react" ]

// append() adds.
// set() replaces all existing values for the name.

// ---------------------------------------------------------------------
// 14. getAll()
// ---------------------------------------------------------------------

const multiValue = new URLSearchParams("tag=javascript&tag=typescript&tag=react");

console.log(multiValue.get("tag")); // "javascript"
console.log(multiValue.getAll("tag")); // [ "javascript", "typescript", "react" ]

// get() returns the first value.
// getAll() returns every value associated with the parameter.

// ---------------------------------------------------------------------
// 15. delete()
// ---------------------------------------------------------------------

const removable = new URLSearchParams("page=2&sort=price&filter=books");

removable.delete("filter");

console.log(removable.toString());
// page=2&sort=price

// delete() removes all values associated with the specified parameter.

// ---------------------------------------------------------------------
// 16. delete() with a specific value
// ---------------------------------------------------------------------

const selected = new URLSearchParams("tag=javascript&tag=typescript&tag=react");

selected.delete("tag", "typescript");

console.log(selected.toString());
// tag=javascript&tag=react

// When supported, delete(name, value) removes only matching pairs.

// ---------------------------------------------------------------------
// 17. sort()
// ---------------------------------------------------------------------

const unsorted = new URLSearchParams();

unsorted.append("z", "last");
unsorted.append("a", "first");
unsorted.append("m", "middle");

unsorted.sort();

console.log(unsorted.toString());
// a=first&m=middle&z=last

// sort() orders parameters by their names using code-unit ordering.

// ---------------------------------------------------------------------
// 18. sort() and repeated keys
// ---------------------------------------------------------------------

const repeatedKeys = new URLSearchParams();

repeatedKeys.append("b", "2");
repeatedKeys.append("a", "1");
repeatedKeys.append("b", "3");
repeatedKeys.append("a", "4");

repeatedKeys.sort();

console.log(repeatedKeys.toString());
// a=1&a=4&b=2&b=3

// sort() sorts by parameter name.
// Values with the same name retain their relative order.

// ---------------------------------------------------------------------
// 19. toString()
// ---------------------------------------------------------------------

const serialized = new URLSearchParams();

serialized.set("name", "John");
serialized.set("role", "software engineer");

console.log(serialized.toString());
// name=John&role=software+engineer

// toString() returns the query-string representation without
// the leading "?" character.

// ---------------------------------------------------------------------
// 20. URLSearchParams handles encoding
// ---------------------------------------------------------------------

const encoded = new URLSearchParams();

encoded.set("search", "JavaScript & TypeScript");
encoded.set("city", "Skopje");

console.log(encoded.toString());
// search=JavaScript+%26+TypeScript&city=Skopje

// URLSearchParams percent-encodes characters that need encoding.
// Spaces are serialized as "+" in application/x-www-form-urlencoded format.

// ---------------------------------------------------------------------
// 21. Decoding happens when values are read
// ---------------------------------------------------------------------

const encodedQuery = new URLSearchParams("search=JavaScript+%26+TypeScript");

console.log(encodedQuery.get("search"));
// "JavaScript & TypeScript"

// URLSearchParams decodes the serialized value when get() is used.

// ---------------------------------------------------------------------
// 22. URL and searchParams
// ---------------------------------------------------------------------

const url = new URL("https://example.com/products?category=books&page=2");

console.log(url.search); // "?category=books&page=2"
console.log(url.searchParams.get("category")); // "books"
console.log(url.searchParams.get("page")); // "2"

// URL objects expose their query parameters through searchParams.

// ---------------------------------------------------------------------
// 23. Modifying URL.searchParams
// ---------------------------------------------------------------------

const productUrl = new URL("https://example.com/products?page=1");

productUrl.searchParams.set("page", "2");
productUrl.searchParams.set("sort", "price");

console.log(productUrl.href);
// https://example.com/products?page=2&sort=price

// Changes made through url.searchParams update the URL.

// ---------------------------------------------------------------------
// 24. Adding parameters to an existing URL
// ---------------------------------------------------------------------

const apiUrl = new URL("https://api.example.com/users");

apiUrl.searchParams.set("page", "2");
apiUrl.searchParams.set("limit", "20");

console.log(apiUrl.href);
// https://api.example.com/users?page=2&limit=20

// This is usually safer than manually concatenating "?key=value"
// strings because URLSearchParams handles encoding.

// ---------------------------------------------------------------------
// 25. Removing URL parameters
// ---------------------------------------------------------------------

const filteredUrl = new URL("https://example.com/products?category=books&page=2&sort=price");

filteredUrl.searchParams.delete("sort");

console.log(filteredUrl.href);
// https://example.com/products?category=books&page=2

// ---------------------------------------------------------------------
// 26. Reading URL parameters from a browser location
// ---------------------------------------------------------------------

// In a browser:
//
// const params = new URLSearchParams(window.location.search);
//
// const page = params.get("page");
// const search = params.get("search");
//
// If the current URL is:
//
// https://example.com/products?page=2&search=javascript
//
// then:
//
// page  -> "2"
// search -> "javascript"

// ---------------------------------------------------------------------
// 27. Iterating with for...of
// ---------------------------------------------------------------------

const iterationParams = new URLSearchParams("page=2&sort=price&category=books");

for (const [key, value] of iterationParams) {
  console.log(`${key}: ${value}`);
}

// page: 2
// sort: price
// category: books

// URLSearchParams is iterable and yields [name, value] pairs.

// ---------------------------------------------------------------------
// 28. entries()
// ---------------------------------------------------------------------

const entries = new URLSearchParams("name=John&role=developer");

for (const [key, value] of entries.entries()) {
  console.log(key, value);
}

// name John
// role developer

// entries() returns an iterator containing name/value pairs.

// ---------------------------------------------------------------------
// 29. keys()
// ---------------------------------------------------------------------

const keyParams = new URLSearchParams("name=John&role=developer");

for (const key of keyParams.keys()) {
  console.log(key);
}

// name
// role

// keys() iterates over parameter names.

// ---------------------------------------------------------------------
// 30. values()
// ---------------------------------------------------------------------

const valueParams = new URLSearchParams("name=John&role=developer");

for (const value of valueParams.values()) {
  console.log(value);
}

// John
// developer

// values() iterates over parameter values.

// ---------------------------------------------------------------------
// 31. forEach()
// ---------------------------------------------------------------------

const forEachParams = new URLSearchParams("page=2&sort=price");

forEachParams.forEach((value, key) => {
  console.log(`${key} = ${value}`);
});

// page = 2
// sort = price

// forEach() calls the callback for each name/value pair.

// ---------------------------------------------------------------------
// 32. URLSearchParams is not exactly a Map
// ---------------------------------------------------------------------

const paramsMap = new URLSearchParams();

paramsMap.set("name", "John");

console.log(paramsMap instanceof Map); // false

// URLSearchParams has a Map-like interface, but it is a distinct Web API
// with URL query-string semantics and support for duplicate parameter names.

// ---------------------------------------------------------------------
// 33. Duplicate parameter names
// ---------------------------------------------------------------------

const duplicateParams = new URLSearchParams();

duplicateParams.append("filter", "active");
duplicateParams.append("filter", "recent");

console.log(duplicateParams.getAll("filter"));
// [ "active", "recent" ]

// Query parameters do not have to be unique.

// ---------------------------------------------------------------------
// 34. Constructing a query from arrays
// ---------------------------------------------------------------------

const selectedTags = ["javascript", "typescript", "react"];

const tagParams = new URLSearchParams();

for (const tag of selectedTags) {
  tagParams.append("tag", tag);
}

console.log(tagParams.toString());
// tag=javascript&tag=typescript&tag=react

// append() is useful when an API expects repeated query parameters.

// ---------------------------------------------------------------------
// 35. Constructing query parameters from an object
// ---------------------------------------------------------------------

const filtersObject = {
  category: "books",
  sort: "price",
  page: "2",
};

const filterParams = new URLSearchParams(filtersObject);

console.log(filterParams.toString());
// category=books&sort=price&page=2

// Object initialization is convenient when each parameter has one value.

// ---------------------------------------------------------------------
// 36. Arrays passed through an object are converted to strings
// ---------------------------------------------------------------------

const objectWithArray = new URLSearchParams({
  tags: ["javascript", "typescript", "react"],
});

console.log(objectWithArray.toString());
// tags=javascript%2Ctypescript%2Creact

// An object initializer does not interpret an array value as repeated
// parameters. The array is converted to a string.

// For repeated parameters, use append() or an iterable of pairs.

// ---------------------------------------------------------------------
// 37. Building repeated parameters correctly
// ---------------------------------------------------------------------

const repeatedTags = new URLSearchParams();

for (const tag of ["javascript", "typescript", "react"]) {
  repeatedTags.append("tag", tag);
}

console.log(repeatedTags.toString());
// tag=javascript&tag=typescript&tag=react

// ---------------------------------------------------------------------
// 38. FormData to URLSearchParams
// ---------------------------------------------------------------------

// In a browser:
//
// const formData = new FormData(formElement);
// const params = new URLSearchParams(formData);
//
// fetch("/search", {
//   method: "POST",
//   body: params,
// });
//
// URLSearchParams is commonly useful when data needs to be represented
// using application/x-www-form-urlencoded semantics.

// ---------------------------------------------------------------------
// 39. Fetch with URLSearchParams
// ---------------------------------------------------------------------

async function searchProducts(term) {
  const params = new URLSearchParams({
    q: term,
    page: "1",
    limit: "20",
  });

  const response = await fetch(`https://api.example.com/products?${params}`);

  return response;
}

// The template literal converts URLSearchParams to its serialized form
// through its string representation.

// ---------------------------------------------------------------------
// 40. Fetch POST body with URLSearchParams
// ---------------------------------------------------------------------

async function submitLogin(username, password) {
  const body = new URLSearchParams();

  body.set("username", username);
  body.set("password", password);

  return fetch("/login", {
    method: "POST",
    body,
  });
}

// Passing URLSearchParams as a fetch body uses URL-encoded form semantics.
// The fetch implementation can set the appropriate content type.

// ---------------------------------------------------------------------
// 41. URLSearchParams and React
// ---------------------------------------------------------------------

// Query parameters are useful for state that should be represented in
// a shareable URL, such as:
//
// /products?search=javascript&page=2&sort=price
//
// A React component can read them and use them to initialize or derive
// UI state:
//
// const params = new URLSearchParams(window.location.search);
// const search = params.get("search") ?? "";
// const page = Number(params.get("page") ?? "1");

// ---------------------------------------------------------------------
// 42. Updating browser query parameters
// ---------------------------------------------------------------------

// In a browser:
//
// const url = new URL(window.location.href);
//
// url.searchParams.set("page", "2");
// url.searchParams.set("sort", "price");
//
// history.pushState({}, "", url);
//
// The URL changes without requiring manual string concatenation.

// ---------------------------------------------------------------------
// 43. Removing an optional query parameter
// ---------------------------------------------------------------------

function removeSearchParameter(url, parameter) {
  const copy = new URL(url);

  copy.searchParams.delete(parameter);

  return copy;
}

const originalUrl = "https://example.com/products?page=2&sort=price";

const updatedUrl = removeSearchParameter(originalUrl, "sort");

console.log(updatedUrl.href);
// https://example.com/products?page=2

// Creating a new URL makes it explicit that the original URL is not
// being modified.

// ---------------------------------------------------------------------
// 44. Clone URLSearchParams
// ---------------------------------------------------------------------

const originalParams = new URLSearchParams("page=2&sort=price");

const clonedParams = new URLSearchParams(originalParams);

clonedParams.set("page", "3");

console.log(originalParams.toString());
// page=2&sort=price

console.log(clonedParams.toString());
// page=3&sort=price

// Constructing URLSearchParams from another URLSearchParams creates
// an independent parameter collection.

// ---------------------------------------------------------------------
// 45. URLSearchParams from a URL
// ---------------------------------------------------------------------

const sourceUrl = new URL("https://example.com/products?page=2&category=books");

const copiedParams = new URLSearchParams(sourceUrl.searchParams);

console.log(copiedParams.toString());
// page=2&category=books

// The URL's searchParams can be copied when an independent collection
// is required.

// ---------------------------------------------------------------------
// 46. Leading question marks
// ---------------------------------------------------------------------

const withQuestionMark = new URLSearchParams("?page=2&sort=price");

console.log(withQuestionMark.get("page")); // "2"
console.log(withQuestionMark.toString());
// page=2&sort=price

// A leading "?" is accepted when constructing from a query string.
// toString() does not include the leading question mark.

// ---------------------------------------------------------------------
// 47. Empty values
// ---------------------------------------------------------------------

const emptyValue = new URLSearchParams("search=&page=2");

console.log(emptyValue.get("search")); // ""
console.log(emptyValue.has("search")); // true

// An existing parameter with an empty value is different from
// a missing parameter.

// ---------------------------------------------------------------------
// 48. Missing values
// ---------------------------------------------------------------------

const missingValue = new URLSearchParams("page=2");

console.log(missingValue.get("search")); // null
console.log(missingValue.has("search")); // false

// get() returns null when the parameter does not exist.

// ---------------------------------------------------------------------
// 49. Converting a URLSearchParams value to a number
// ---------------------------------------------------------------------

const paginationParams = new URLSearchParams("page=3&limit=25");

const currentPage = Number(paginationParams.get("page"));
const pageSize = Number(paginationParams.get("limit"));

console.log(currentPage); // 3
console.log(pageSize); // 25

// Explicit conversion avoids treating numeric query parameters as strings.

// ---------------------------------------------------------------------
// 50. Safe defaults for missing values
// ---------------------------------------------------------------------

const requestParams = new URLSearchParams("search=javascript");

const pageNumber = Number(requestParams.get("page") ?? "1");
const limit = Number(requestParams.get("limit") ?? "20");

console.log(pageNumber); // 1
console.log(limit); // 20

// The nullish coalescing operator provides defaults only when get()
// returns null or undefined.

// ---------------------------------------------------------------------
// 51. Boolean query parameters
// ---------------------------------------------------------------------

const booleanParams = new URLSearchParams("active=true&archived=false");

const isActive = booleanParams.get("active") === "true";
const isArchived = booleanParams.get("archived") === "true";

console.log(isActive); // true
console.log(isArchived); // false

// Query parameters are strings, so boolean interpretation must be explicit.

// ---------------------------------------------------------------------
// 52. Encoding special characters
// ---------------------------------------------------------------------

const specialCharacters = new URLSearchParams();

specialCharacters.set("message", "hello?name=John&role=developer");

console.log(specialCharacters.toString());
// message=hello%3Fname%3DJohn%26role%3Ddeveloper

// Special URL characters inside a parameter value are encoded so they
// remain part of the value rather than becoming URL syntax.

// ---------------------------------------------------------------------
// 53. Do not manually concatenate query strings
// ---------------------------------------------------------------------

const searchTerm = "JavaScript & TypeScript";

// Avoid:
//
// const url = `/search?q=${searchTerm}`;

// Prefer:
//
// const params = new URLSearchParams({
//   q: searchTerm,
// });
//
// const url = `/search?${params}`;

// URLSearchParams handles the required encoding automatically.

// ---------------------------------------------------------------------
// 54. Query parameter names are case-sensitive
// ---------------------------------------------------------------------

const caseSensitive = new URLSearchParams("page=2&Page=3");

console.log(caseSensitive.get("page")); // "2"
console.log(caseSensitive.get("Page")); // "3"

// "page" and "Page" are different parameter names.

// ---------------------------------------------------------------------
// 55. Empty parameter names
// ---------------------------------------------------------------------

const emptyName = new URLSearchParams("=value&page=2");

console.log(emptyName.get("")); // "value"
console.log(emptyName.get("page")); // "2"

// URLSearchParams can represent an empty parameter name.

// ---------------------------------------------------------------------
// 56. Serialization is not JSON
// ---------------------------------------------------------------------

const paramsObject = new URLSearchParams({
  name: "John",
  age: "30",
});

console.log(paramsObject.toString());
// name=John&age=30

console.log(JSON.stringify(paramsObject));
// {}

// URLSearchParams is a query-parameter collection, not a normal
// JavaScript object intended for JSON serialization.

// ---------------------------------------------------------------------
// 57. Convert URLSearchParams to an object
// ---------------------------------------------------------------------

const objectParams = new URLSearchParams("name=John&age=30");

const object = Object.fromEntries(objectParams);

console.log(object);
// { name: "John", age: "30" }

// Object.fromEntries() creates an ordinary object from the entries.

// ---------------------------------------------------------------------
// 58. Duplicate values and Object.fromEntries()
// ---------------------------------------------------------------------

const duplicateObjectParams = new URLSearchParams("tag=javascript&tag=typescript");

const duplicateObject = Object.fromEntries(duplicateObjectParams);

console.log(duplicateObject);
// { tag: "typescript" }

// Object.fromEntries() cannot represent duplicate keys.
// The last value replaces the previous value.

// Use getAll() when duplicate parameters matter.

// ---------------------------------------------------------------------
// 59. Convert to an array of entries
// ---------------------------------------------------------------------

const entryParams = new URLSearchParams("tag=javascript&tag=typescript");

const entriesArray = [...entryParams];

console.log(entriesArray);
// [ [ "tag", "javascript" ], [ "tag", "typescript" ] ]

// The iterable interface makes conversion to arrays straightforward.

// ---------------------------------------------------------------------
// 60. URLSearchParams and object identity
// ---------------------------------------------------------------------

const paramsA = new URLSearchParams("page=1");
const paramsB = new URLSearchParams("page=1");

console.log(paramsA === paramsB); // false

// Two URLSearchParams instances with identical content are still
// different objects.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - URLSearchParams provides a standard API for URL query parameters.
// - Query parameter values are strings.
// - get() returns the first value or null when the parameter is missing.
// - getAll() returns every value associated with a parameter.
// - has() checks whether a parameter exists.
// - set() replaces all existing values for a parameter.
// - append() adds another value without removing existing values.
// - delete() removes parameter values.
// - sort() sorts parameters by name.
// - toString() serializes the parameters without a leading "?".
// - URLSearchParams automatically handles URL encoding and decoding.
// - URL objects expose their query parameters through searchParams.
// - Duplicate parameter names are supported.
// - URLSearchParams is iterable and supports entries(), keys(), values(),
//   and forEach().
// - It can be used with fetch() for query strings and URL-encoded bodies.
// - Explicit conversion is required for numbers and booleans.
// - URLSearchParams should generally be preferred over manual query-string
//   concatenation when constructing URLs.
// - Be careful when converting duplicate parameters to an object because
//   ordinary object keys cannot represent multiple values.

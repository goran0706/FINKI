/**
 * Index Signatures
 * ================
 *
 * Index signatures describe objects whose property names are not known in
 * advance but whose keys and values follow a consistent type relationship.
 */

// ---------------------------------------------------------------------
// 1. Basic index signature
// ---------------------------------------------------------------------

// An index signature defines the type of dynamically named properties.
type UserScores = {
  [username: string]: number;
};

const scores: UserScores = {
  john: 95,
  alice: 88,
  michael: 92,
};

console.log(scores.john); // 95
console.log(scores["alice"]); // 88
console.log(scores["michael"]); // 92

// ---------------------------------------------------------------------
// 2. Reading dynamic properties
// ---------------------------------------------------------------------

type Prices = {
  [product: string]: number;
};

const prices: Prices = {
  laptop: 1200,
  mouse: 40,
  keyboard: 100,
};

const productName = "laptop";

console.log(prices[productName]); // 1200
console.log(prices["mouse"]); // 40

// Any string can be used as a key because the index signature allows
// dynamically named string properties.

// ---------------------------------------------------------------------
// 3. Adding dynamic properties
// ---------------------------------------------------------------------

type Inventory = {
  [product: string]: number;
};

const inventory: Inventory = {
  laptop: 10,
  mouse: 25,
};

inventory.keyboard = 15;
inventory["monitor"] = 8;

console.log(inventory.keyboard); // 15
console.log(inventory.monitor); // 8

// The assigned values must match the index signature's value type.

// ---------------------------------------------------------------------
// 4. Type checking indexed values
// ---------------------------------------------------------------------

type Scores = {
  [player: string]: number;
};

const playerScores: Scores = {
  john: 100,
  alice: 95,
};

playerScores.michael = 90;

// playerScores.david = "excellent";
// Error:
// Type 'string' is not assignable to type 'number'.

console.log(playerScores);

// ---------------------------------------------------------------------
// 5. Index signatures with number keys
// ---------------------------------------------------------------------

type ErrorMessages = {
  [code: number]: string;
};

const errors: ErrorMessages = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

console.log(errors[404]); // "Not Found"
console.log(errors[500]); // "Internal Server Error"

// Number index signatures are useful when numeric keys represent
// identifiers, codes, positions, or other numeric lookup values.

// ---------------------------------------------------------------------
// 6. String keys vs. number keys
// ---------------------------------------------------------------------

type StringDictionary = {
  [key: string]: string;
};

type NumberDictionary = {
  [key: number]: string;
};

const languages: StringDictionary = {
  javascript: "JS",
  typescript: "TS",
  python: "Python",
};

const httpErrors: NumberDictionary = {
  404: "Not Found",
  500: "Internal Server Error",
};

console.log(languages.javascript); // "JS"
console.log(httpErrors[404]); // "Not Found"

// ---------------------------------------------------------------------
// 7. Known properties with an index signature
// ---------------------------------------------------------------------

type User = {
  id: number;
  name: string;
  [key: string]: string | number;
};

const user: User = {
  id: 1,
  name: "John",
  age: 30,
  role: "admin",
};

console.log(user.id); // 1
console.log(user.name); // "John"
console.log(user.age); // 30
console.log(user.role); // "admin"

// Every explicitly declared property must be compatible with the
// string index signature's value type.

// This would be invalid:
//
// type InvalidUser = {
//   id: number;
//   [key: string]: string;
// };
//
// Error:
// Property 'id' of type 'number' is not assignable to
// 'string' index type 'string'.

// ---------------------------------------------------------------------
// 8. Index signatures with union value types
// ---------------------------------------------------------------------

type Configuration = {
  [key: string]: string | number | boolean;
};

const config: Configuration = {
  host: "localhost",
  port: 3000,
  debug: true,
};

console.log(config.host); // "localhost"
console.log(config.port); // 3000
console.log(config.debug); // true

// A union allows different value types while keeping the object shape
// dynamically extensible.

// ---------------------------------------------------------------------
// 9. Narrowing values from an index signature
// ---------------------------------------------------------------------

const configuration: Configuration = {
  host: "localhost",
  port: 3000,
  debug: true,
};

const value = configuration["port"];

if (typeof value === "number") {
  console.log(value.toFixed(0)); // "3000"
}

const host = configuration["host"];

if (typeof host === "string") {
  console.log(host.toUpperCase()); // "LOCALHOST"
}

// When an index signature returns a union, normal TypeScript narrowing
// is required before using type-specific operations.

// ---------------------------------------------------------------------
// 10. Index signatures with functions
// ---------------------------------------------------------------------

type EventHandlers = {
  [eventName: string]: () => void;
};

const handlers: EventHandlers = {
  click: () => console.log("Clicked"),
  submit: () => console.log("Submitted"),
  reset: () => console.log("Reset"),
};

handlers.click(); // "Clicked"
handlers.submit(); // "Submitted"

// This pattern is useful for registries and dynamically named callbacks.

// ---------------------------------------------------------------------
// 11. Function parameters in index signatures
// ---------------------------------------------------------------------

type Validators = {
  [field: string]: (value: string) => boolean;
};

const validators: Validators = {
  username: (value) => value.length >= 3,
  email: (value) => value.includes("@"),
};

console.log(validators.username("john")); // true
console.log(validators.email("test")); // false

// Every dynamically named property must contain a function matching
// the declared signature.

// ---------------------------------------------------------------------
// 12. Readonly index signatures
// ---------------------------------------------------------------------

type ReadonlyScores = {
  readonly [player: string]: number;
};

const readonlyScores: ReadonlyScores = {
  john: 95,
  alice: 88,
};

console.log(readonlyScores.john); // 95

// readonlyScores.john = 100;
// Error:
// Index signature in type 'ReadonlyScores' only permits reading.

// Readonly index signatures prevent modifying properties through the
// indexed object.

/**
 * readonly applies to properties accessed through this type.
 //
 // readonlyScores["john"] = 100;
 // Error
 */

// ---------------------------------------------------------------------
// 13. Index signatures with optional properties
// ---------------------------------------------------------------------

// Index signatures describe arbitrary properties, while optional
// properties describe specific known properties.

type Settings = {
  theme?: string;
  language?: string;
  [key: string]: string | undefined;
};

const settings: Settings = {
  theme: "dark",
  language: "en",
};

settings.fontSize = "16";

console.log(settings.theme); // "dark"
console.log(settings.fontSize); // "16"

// With strictNullChecks enabled, an optional property can be undefined,
// so the index signature must allow undefined as a value.

// ---------------------------------------------------------------------
// 14. Nested index signatures
// ---------------------------------------------------------------------

type Translations = {
  [language: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    greeting: "Hello",
    goodbye: "Goodbye",
  },
  mk: {
    greeting: "Здраво",
    goodbye: "Довидување",
  },
};

console.log(translations.en.greeting); // "Hello"
console.log(translations.mk.greeting); // "Здраво"

// Nested index signatures model dynamic objects at multiple levels.

// ---------------------------------------------------------------------
// 15. Using Record instead of an index signature
// ---------------------------------------------------------------------

type UserRoles = {
  [username: string]: string;
};

type UserRolesRecord = Record<string, string>;

const rolesA: UserRoles = {
  john: "admin",
  alice: "editor",
};

const rolesB: UserRolesRecord = {
  john: "admin",
  alice: "editor",
};

console.log(rolesA.john); // "admin"
console.log(rolesB.john); // "admin"

// Record<K, V> is a utility type that often provides a concise alternative
// to a basic index signature.

// ---------------------------------------------------------------------
// 16. Index signatures and keyof
// ---------------------------------------------------------------------

type Dictionary = {
  [key: string]: number;
};

type DictionaryKeys = keyof Dictionary;

const dictionaryKey: DictionaryKeys = "score";

console.log(dictionaryKey); // "score"

// For a string index signature, keyof includes string and number because
// JavaScript object property keys can be accessed through numeric keys
// that are converted to strings.

// ---------------------------------------------------------------------
// 17. Index signatures do not require every possible property
// ---------------------------------------------------------------------

type FeatureFlags = {
  [feature: string]: boolean;
};

const featureFlags: FeatureFlags = {
  darkMode: true,
  betaDashboard: false,
};

console.log(featureFlags.darkMode); // true
console.log(featureFlags.newFeature); // undefined

// The index signature describes what type a property must have if it
// exists. It does not require every possible string key to exist.

// ---------------------------------------------------------------------
// 18. Checking dynamically accessed properties
// ---------------------------------------------------------------------

const flags: FeatureFlags = {
  darkMode: true,
  betaDashboard: false,
};

const feature = "darkMode";

if (feature in flags) {
  console.log(flags[feature]); // true
}

// The in operator checks whether a property exists on the object.
// With an index signature, the accessed value can still be undefined
// at runtime if the requested property has not been created.

// ---------------------------------------------------------------------
// 19. Index signatures with object values
// ---------------------------------------------------------------------

type Product = {
  name: string;
  price: number;
};

type ProductCatalog = {
  [productId: string]: Product;
};

const catalog: ProductCatalog = {
  p100: {
    name: "Laptop",
    price: 1200,
  },
  p200: {
    name: "Keyboard",
    price: 100,
  },
};

console.log(catalog.p100.name); // "Laptop"
console.log(catalog.p200.price); // 100

// This pattern is useful for dictionaries, registries, caches, and
// collections indexed by identifiers.

// ---------------------------------------------------------------------
// 20. React: component registry
// ---------------------------------------------------------------------

type Component = () => string;

type ComponentRegistry = {
  [name: string]: Component;
};

const components: ComponentRegistry = {
  header: () => "Header",
  footer: () => "Footer",
  sidebar: () => "Sidebar",
};

console.log(components.header()); // "Header"
console.log(components.footer()); // "Footer"

// In React, the same concept can be used for dynamically selected
// components, although React component types should be used for the
// actual component values:
//
// type ComponentRegistry = {
//   [name: string]: React.ComponentType;
// };

// ---------------------------------------------------------------------
// 21. React: dynamic form fields
// ---------------------------------------------------------------------

type FormValues = {
  [fieldName: string]: string;
};

const formValues: FormValues = {
  username: "john",
  email: "john@example.com",
};

function getFieldValue(values: FormValues, fieldName: string): string | undefined {
  return values[fieldName];
}

console.log(getFieldValue(formValues, "username")); // "john"
console.log(getFieldValue(formValues, "phone")); // undefined

// Index signatures are useful when form fields are dynamic or generated
// from configuration rather than being known entirely at compile time.

// ---------------------------------------------------------------------
// 22. Prefer explicit properties when the shape is known
// ---------------------------------------------------------------------

type ExplicitUser = {
  id: number;
  name: string;
  email: string;
};

const explicitUser: ExplicitUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
};

console.log(explicitUser.name); // "John"

// If the complete set of properties is known, explicit properties are
// usually more precise than an index signature.

// ---------------------------------------------------------------------
// 23. Avoid overly broad index signatures
// ---------------------------------------------------------------------

// This type accepts almost anything as a value.
type LooseObject = {
  [key: string]: unknown;
};

const data: LooseObject = {
  name: "John",
  age: 30,
  active: true,
};

console.log(data.name); // "John"

// unknown is safer than any because values must be narrowed before
// type-specific operations are performed.

// ---------------------------------------------------------------------
// 24. Index signatures with any
// ---------------------------------------------------------------------

// any removes type checking for indexed values.
type UnsafeDictionary = {
  [key: string]: any;
};

const unsafeData: UnsafeDictionary = {
  name: "John",
  age: 30,
};

console.log(unsafeData.name.toUpperCase()); // "JOHN"

// Although this works for the current data, an unexpected runtime value
// could cause an exception. Prefer a precise value type or unknown when
// possible.

// ---------------------------------------------------------------------
// 25. Symbols as property keys
// ---------------------------------------------------------------------

// Index signatures can also use symbol keys.
type SymbolDictionary = {
  [key: symbol]: string;
};

const symbolKey = Symbol("id");

const symbolData: SymbolDictionary = {
  [symbolKey]: "user-1",
};

console.log(symbolData[symbolKey]); // "user-1"

// Symbol index signatures are less common than string index signatures,
// but they are useful when APIs deliberately use symbol-based keys.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - Index signatures describe objects with dynamically named properties.
// - String index signatures use [key: string]: Value.
// - Number index signatures use [key: number]: Value.
// - Every property compatible with an index signature must have a compatible
//   value type.
// - Union value types allow several kinds of values in one dynamic object.
// - readonly index signatures prevent indexed properties from being modified.
// - Index signatures can contain functions, objects, arrays, and other types.
// - Nested index signatures can model dynamic structures at multiple levels.
// - Record<K, V> is a concise alternative for many dictionary-like types.
// - An index signature does not require every possible key to exist.
// - If the object shape is known, explicit properties are usually more precise.
// - unknown is generally safer than any for unstructured dynamic values.
// - Index signatures are useful for dictionaries, registries, caches,
//   configuration objects, dynamic forms, and other runtime-keyed structures.
// - In React applications, they are useful when keys or fields are generated
//   dynamically rather than being completely known at compile time.

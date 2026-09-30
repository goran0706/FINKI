/**
 * Keyof Operator
 * ==============
 *
 * TypeScript's `keyof` operator takes an object type and produces a string
 * or numeric literal union of its keys, enabling type-safe property access
 * and robust generic constraints.
 */

// ---------------------------------------------------------------------
// 1. Basic `keyof` with Interfaces and Types
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
}

// Produces a union of literal string types: "id" | "name" | "email"
type UserKeys = keyof User;

const validKey: UserKeys = "name"; // Valid
// const invalidKey: UserKeys = "age"; // Error: Type '"age"' is not assignable to type 'UserKeys'

// ---------------------------------------------------------------------
// 2. Combining `keyof` with `typeof` (Object Literals)
// ---------------------------------------------------------------------

const settings = {
  theme: "dark",
  notifications: true,
  maxRetries: 3,
};

// `typeof settings` evaluates the object's shape, and `keyof` extracts its keys:
type SettingKeys = keyof typeof settings; // "theme" | "notifications" | "maxRetries"

// ---------------------------------------------------------------------
// 3. Type-Safe Property Access (Generics with `keyof`)
// ---------------------------------------------------------------------

// Ensures the key passed belongs strictly to the object's type keys:
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "Ana", email: "ana@example.com" };

const userName = getProperty(user, "name"); // Inferred return type: string
const userId = getProperty(user, "id"); // Inferred return type: number

// ---------------------------------------------------------------------
// 4. Index Signatures and `keyof`
// ---------------------------------------------------------------------

interface StringDictionary {
  [key: string]: string;
}

// When an interface has a string index signature, `keyof` returns `string | number`
// (since JavaScript object keys are automatically converted to strings).
type DictKeys = keyof StringDictionary; // string | number

interface NumericDictionary {
  [index: number]: boolean;
}

type NumericKeys = keyof NumericDictionary; // number

// ---------------------------------------------------------------------
// 5. Practical Application: Updating an Object
// ---------------------------------------------------------------------

function updateProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return {
    ...obj,
    [key]: value,
  };
}

const updatedUser = updateProperty(user, "name", "Elena"); // Valid type check and assignment

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The `keyof` operator extracts a union of literal types representing an object's keys.
// - Commonly paired with `typeof` (`keyof typeof obj`) to generate type unions from runtime objects.
// - Crucial for generic constraints (`K extends keyof T`) to enforce safe property lookups and updates.
// - Automatically accounts for string and numeric index signatures.

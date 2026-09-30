/**
 * Record Utility Type
 * ===================
 *
 * TypeScript's built-in `Record<K, T>` utility type constructs an object type
 * whose property keys are `K` and whose property values are `T`. It is the
 * go-to type for creating dictionaries, lookup maps, and objects with fixed
 * or restricted sets of keys.
 */

// ---------------------------------------------------------------------
// 1. Basic Usage of `Record<K, T>`
// ---------------------------------------------------------------------

// Define a union of allowed keys:
type Role = "admin" | "editor" | "viewer";

// Create an object type where every role maps to a boolean value:
// Equivalent to: { admin: boolean; editor: boolean; viewer: boolean; }
type RolePermissions = Record<Role, boolean>;

const permissions: RolePermissions = {
  admin: true,
  editor: true,
  viewer: false,
};

// ---------------------------------------------------------------------
// 2. Practical Application: Status or Color Mappings
// ---------------------------------------------------------------------

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

// Map each order status to a specific UI badge color string:
const statusColors: Record<OrderStatus, string> = {
  pending: "yellow",
  shipped: "blue",
  delivered: "green",
  cancelled: "red",
};

function getBadgeColor(status: OrderStatus): string {
  return statusColors[status];
}

// ---------------------------------------------------------------------
// 3. Using `string` or `number` Keys for Dynamic Dictionaries
// ---------------------------------------------------------------------

// When keys are dynamic strings, `Record` acts as a clean alternative
// to traditional index signatures:
type UserCache = Record<string, { id: number; name: string }>;

const cache: UserCache = {
  user_1: { id: 1, name: "Ana" },
  user_2: { id: 2, name: "Elena" },
};

// ---------------------------------------------------------------------
// 4. How `Record<K, T>` Works Under the Hood
// ---------------------------------------------------------------------

// TypeScript implements `Record<K, T>` internally using mapped types
// combined with a constraint that guarantees keys `K` are valid property keys:
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

type CustomStringMap = MyRecord<"keyA" | "keyB", number>;

const customMap: CustomStringMap = {
  keyA: 10,
  keyB: 20,
};

// ---------------------------------------------------------------------
// 5. Combining `Record` with Other Utility Types (`Partial`)
// ---------------------------------------------------------------------

type Settings = "theme" | "notifications" | "sound";

// Often, you want a record where properties are optional (e.g., user preferences):
type UserPreferences = Partial<Record<Settings, boolean>>;

const userPrefs: UserPreferences = {
  theme: true,
  // notifications and sound are optional and can be omitted
};

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Record<K, T>` constructs an object type with keys `K` and uniform values of type `T`.
// - Ideal for configuration maps, lookup tables, dictionary structures, and translating union types into object shapes.
// - Supports string, number, symbol literals, or general unions (`string`) as keys.
// - Easily combined with `Partial<T>` when mapping optional or incremental configuration states.

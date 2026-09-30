/**
 * Pick Utility Type
 * =================
 *
 * TypeScript's built-in `Pick<T, K>` utility type allows you to construct a
 * new type by selecting a specific set of properties `K` (given as a string
 * literal or union of literal types) from an existing type `T`.
 */

// ---------------------------------------------------------------------
// 1. Basic Usage of `Pick<T, K>`
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

// Create a new type containing only `name` and `email` from `User`:
// Equivalent to: { name: string; email: string; }
type UserContactInfo = Pick<User, "name" | "email">;

const contact: UserContactInfo = {
  name: "Ana",
  email: "ana@example.com",
  // id, role, and createdAt are omitted and cannot be included here
};

// ---------------------------------------------------------------------
// 2. Practical Application: Creating DTOs or Summaries
// ---------------------------------------------------------------------

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
}

// Extract a lightweight summary type for catalog views:
type ProductSummary = Pick<Product, "id" | "title" | "price">;

function renderProductCard(product: ProductSummary): string {
  return `${product.title} - $${product.price}`;
}

const item: ProductSummary = {
  id: "prod_123",
  title: "Mechanical Keyboard",
  price: 129.99,
};

renderProductCard(item);

// ---------------------------------------------------------------------
// 3. How `Pick<T, K>` Works Under the Hood (Mapped Types)
// ---------------------------------------------------------------------

// TypeScript implements `Pick<T, K>` internally using mapped types combined
// with generic constraints to guarantee `K` belongs strictly to `keyof T`:
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type CustomUserSummary = MyPick<User, "id" | "name">;

const customUser: CustomUserSummary = {
  id: 1,
  name: "Elena",
};

// ---------------------------------------------------------------------
// 4. Combining `Pick` with Other Utility Types
// ---------------------------------------------------------------------

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  published: boolean;
}

// Often, you want to pick specific editable fields and make them optional
// for patch operations by combining `Pick` and `Partial`:
type ArticlePatchInput = Partial<Pick<Article, "title" | "content" | "published">>;

const patchData: ArticlePatchInput = {
  title: "Updated TypeScript Tips",
  // content and published are optional
};

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Pick<T, K>` constructs a type by picking a subset of properties `K` from type `T`.
// - Ideal for creating data transfer objects (DTOs), view models, summary types, and function payloads.
// - Enforces compile-time safety by requiring picked keys to explicitly exist in the source type (`K extends keyof T`).
// - Easily combined with other utility types like `Partial<T>` or `Readonly<T>` to mold exact data shapes.

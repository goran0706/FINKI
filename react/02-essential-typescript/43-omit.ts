/**
 * Omit Utility Type
 * =================
 *
 * TypeScript's built-in `Omit<T, K>` utility type allows you to construct a
 * new type by taking all properties from an existing type `T` and then removing
 * a specified set of keys `K` (given as a string literal or union of literals).
 * It is effectively the inverse of `Pick<T, K>`.
 */

// ---------------------------------------------------------------------
// 1. Basic Usage of `Omit<T, K>`
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Create a new type by omitting the `id` property from `User`:
// Equivalent to: { name: string; email: string; role: string; }
type UserWithoutId = Omit<User, "id">;

const newUser: UserWithoutId = {
  name: "Ana",
  email: "ana@example.com",
  role: "developer",
  // id cannot be provided here
};

// ---------------------------------------------------------------------
// 2. Practical Application: Creation DTOs (Data Transfer Objects)
// ---------------------------------------------------------------------

interface Product {
  id: string;
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// When creating a new product, database-generated fields like `id`, `createdAt`,
// and `updatedAt` should be excluded from the payload type:
type CreateProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

function createProduct(payload: CreateProductInput): Product {
  return {
    id: Math.random().toString(),
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const newProduct = createProduct({
  title: "Mechanical Keyboard",
  price: 129.99,
});

// ---------------------------------------------------------------------
// 3. How `Omit<T, K>` Works Under the Hood
// ---------------------------------------------------------------------

// TypeScript implements `Omit<T, K>` internally using a combination of `Pick`,
// `Exclude`, and `keyof`. It excludes the specified keys from the full set of
// keys, and then picks the remaining properties:
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type CustomUserWithoutRole = MyOmit<User, "role">;

const customUser: CustomUserWithoutRole = {
  id: 1,
  name: "Elena",
  email: "elena@example.com",
};

// ---------------------------------------------------------------------
// 4. Combining `Omit` with Other Utility Types
// ---------------------------------------------------------------------

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
}

// A common pattern for patch/update operations is to omit system-generated
// fields and make all remaining editable fields optional via `Partial`:
type UpdateArticleInput = Partial<Omit<Article, "id" | "publishedAt">>;

const patchData: UpdateArticleInput = {
  title: "Advanced TypeScript Patterns",
  // content and author are optional
};

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `Omit<T, K>` constructs a type by removing a specified set of keys `K` from type `T`.
// - Ideal for creating creation payloads, DTOs, and filtering out sensitive or database-managed properties (e.g., `id`, timestamps).
// - Operates as the exact complement to `Pick<T, K>`.
// - Can be seamlessly combined with other utility types like `Partial<T>` for flexible update models.

/**
 * Generic Types
 * ==================
 *
 * Generic types allow you to create flexible, reusable components, interfaces,
 * type aliases, and classes that can work with a variety of data types while
 * maintaining strict compile-time type safety.
 */

// ---------------------------------------------------------------------
// 1. Generic Interfaces
// ---------------------------------------------------------------------

// The type parameter `<T>` makes the interface reusable for any data structure:
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface User {
  id: number;
  name: string;
}

// Pass a specific type argument when using the generic interface:
const userResponse: ApiResponse<User> = {
  status: 200,
  message: "Success",
  data: { id: 1, name: "Ana" },
};

const stringResponse: ApiResponse<string> = {
  status: 200,
  message: "Success",
  data: "Operation completed",
};

// ---------------------------------------------------------------------
// 2. Generic Type Aliases
// ---------------------------------------------------------------------

// Type aliases can also accept type parameters:
type Container<T> = {
  value: T;
  timestamp: number;
};

const numberContainer: Container<number> = {
  value: 42,
  timestamp: Date.now(),
};

// Representing a nullable type wrapper:
type Maybe<T> = T | null | undefined;

const activeUser: Maybe<User> = null;

// ---------------------------------------------------------------------
// 3. Generic Classes
// ---------------------------------------------------------------------

// Classes can be parameterized to handle multiple types internally:
class DataStore<T> {
  private items: T[] = [];

  addItem(item: T): void {
    this.items.push(item);
  }

  getItems(): T[] {
    return [...this.items];
  }
}

const stringStore = new DataStore<string>();
stringStore.addItem("TypeScript");
stringStore.addItem("Generics");

// ---------------------------------------------------------------------
// 4. Generic Constraints (`extends`)
// ---------------------------------------------------------------------

// Restricting type parameters to ensure they satisfy specific structural shapes:
interface Identifiable {
  id: number;
}

class Repository<T extends Identifiable> {
  private records: T[] = [];

  findById(id: number): T | undefined {
    return this.records.find((record) => record.id === id);
  }

  save(record: T): void {
    this.records.push(record);
  }
}

// ---------------------------------------------------------------------
// 5. Default Type Arguments
// ---------------------------------------------------------------------

// Providing fallback types if no type argument is explicitly provided:
interface PaginationOptions<T = string> {
  cursor: T;
  limit: number;
}

const defaultPagination: PaginationOptions = {
  cursor: "page_1", // Defaulted to string
  limit: 10,
};

const numericPagination: PaginationOptions<number> = {
  cursor: 100500,
  limit: 20,
};

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Generic types enable reusable data structures (interfaces, type aliases, classes) without losing type safety.
// - Type parameters (e.g., `<T>`) act as placeholders filled when the type is consumed.
// - Use `extends` constraints to guarantee that generic parameters possess necessary properties.
// - Support default type arguments to provide convenient fallbacks for common use cases.

/**
 * Intersection Types
 * ==================
 *
 * Intersection types combine multiple types into a single type using the `&`
 * operator. A value of an intersection type must satisfy every constituent type.
 */

// ---------------------------------------------------------------------
// 1. Basic intersection type
// ---------------------------------------------------------------------

type Person = {
  name: string;
};

type Employee = {
  employeeId: number;
};

type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "John",
  employeeId: 1001,
};

console.log(employee.name); // "John"
console.log(employee.employeeId); // 1001

// EmployeePerson must contain the properties from both Person and Employee.

// ---------------------------------------------------------------------
// 2. Combining object types
// ---------------------------------------------------------------------

type HasId = {
  id: number;
};

type HasName = {
  name: string;
};

type IdentifiedUser = HasId & HasName;

const user: IdentifiedUser = {
  id: 1,
  name: "Alice",
};

console.log(user.id); // 1
console.log(user.name); // "Alice"

// ---------------------------------------------------------------------
// 3. Intersection types require every property
// ---------------------------------------------------------------------

type Address = {
  city: string;
};

type Contact = {
  email: string;
};

type Customer = Address & Contact;

const customer: Customer = {
  city: "Tetovo",
  email: "john@example.com",
};

console.log(customer.city); // "Tetovo"
console.log(customer.email); // "john@example.com"

// This would be invalid:
//
// const incompleteCustomer: Customer = {
//   city: "Tetovo",
// };
//
// Error:
// Property 'email' is missing in type ...

/**
 * Intersection:
 //
 // A & B
 //
 // means:
 //
 // A AND B
 //
 // The resulting value must satisfy both types.
 */

// ---------------------------------------------------------------------
// 4. Intersection of three types
// ---------------------------------------------------------------------

type Identifiable = {
  id: number;
};

type Timestamped = {
  createdAt: Date;
};

type Auditable = {
  updatedBy: string;
};

type Entity = Identifiable & Timestamped & Auditable;

const entity: Entity = {
  id: 1,
  createdAt: new Date("2026-01-01"),
  updatedBy: "admin",
};

console.log(entity.id); // 1
console.log(entity.createdAt.getFullYear()); // 2026
console.log(entity.updatedBy); // "admin"

// Multiple types can be combined into one intersection.

// ---------------------------------------------------------------------
// 5. Intersection vs. union
// ---------------------------------------------------------------------

type Admin = {
  role: "admin";
};

type Moderator = {
  role: "moderator";
};

type AdminOrModerator = Admin | Moderator;

type AdminAndModerator = Admin & Moderator;

// A union means a value can satisfy either type.
// An intersection means a value must satisfy both types.

const moderator: AdminOrModerator = {
  role: "moderator",
};

console.log(moderator.role); // "moderator"

// AdminAndModerator is problematic because the role property would have
// to be both "admin" and "moderator" at the same time.

// ---------------------------------------------------------------------
// 6. Compatible properties in intersections
// ---------------------------------------------------------------------

type Name = {
  name: string;
};

type OptionalName = {
  name?: string;
};

type NamedObject = Name & OptionalName;

const namedObject: NamedObject = {
  name: "John",
};

console.log(namedObject.name); // "John"

// The resulting type must satisfy both property declarations.
// The required property from Name remains required.

// ---------------------------------------------------------------------
// 7. Intersecting compatible primitive types
// ---------------------------------------------------------------------

type StringAndString = string & string;

const value: StringAndString = "hello";

console.log(value); // "hello"

// Intersecting identical types produces that same type.

// ---------------------------------------------------------------------
// 8. Intersecting incompatible primitive types
// ---------------------------------------------------------------------

type StringAndNumber = string & number;

// No JavaScript value can simultaneously be both a string and a number.
// The resulting type is effectively never.

function impossible(value: StringAndNumber): never {
  throw new Error(`Impossible value: ${value}`);
}

// impossible("hello");
// Error: Argument of type 'string' is not assignable to parameter of type 'never'.

// Intersections of incompatible primitive types produce an impossible type.

// ---------------------------------------------------------------------
// 9. Intersection and never
// ---------------------------------------------------------------------

type Impossible = "red" & "blue";

function handleImpossible(value: Impossible): never {
  throw new Error(`Impossible value: ${value}`);
}

// Impossible is never because no value can be both "red" and "blue".

console.log(typeof handleImpossible); // "function"

// ---------------------------------------------------------------------
// 10. Extending an object with an intersection
// ---------------------------------------------------------------------

type BasicUser = {
  name: string;
  email: string;
};

type WithPermissions = {
  permissions: string[];
};

type UserWithPermissions = BasicUser & WithPermissions;

const authorizedUser: UserWithPermissions = {
  name: "John",
  email: "john@example.com",
  permissions: ["read", "write"],
};

console.log(authorizedUser.name); // "John"
console.log(authorizedUser.permissions); // ["read", "write"]

// Intersections are useful for composing reusable object types.

/**
 * An intersection does not create a new runtime object.
 // It only describes the required structure at compile time.
 */

// ---------------------------------------------------------------------
// 11. Intersection types with functions
// ---------------------------------------------------------------------

type LogFunction = (message: string) => void;
type IdFunction = (id: number) => void;

type CombinedFunction = LogFunction & IdFunction;

const handler = ((value: string | number) => {
  console.log(value);
}) as CombinedFunction;

handler("Hello"); // "Hello"
handler(100); // 100

// Function intersections are more specialized than object intersections.
// They are commonly used when representing overloaded call signatures.

// ---------------------------------------------------------------------
// 12. Intersection types and overloaded functions
// ---------------------------------------------------------------------

type Formatter = {
  (value: string): string;
  (value: number): string;
};

const format: Formatter = (value: string | number): string => {
  return String(value);
};

console.log(format("hello")); // "hello"
console.log(format(100)); // "100"

// An intersection of compatible callable types can represent multiple
// callable signatures. Explicit overload syntax is often clearer when
// declaring public functions.

// ---------------------------------------------------------------------
// 13. Intersections and generic types
// ---------------------------------------------------------------------

type ApiResponse<T> = {
  data: T;
};

type ResponseMetadata = {
  status: number;
  requestId: string;
};

type ApiResult<T> = ApiResponse<T> & ResponseMetadata;

const response: ApiResult<string[]> = {
  data: ["John", "Alice"],
  status: 200,
  requestId: "req-100",
};

console.log(response.data); // ["John", "Alice"]
console.log(response.status); // 200
console.log(response.requestId); // "req-100"

// Generic types can be combined with intersections to create reusable
// response or domain models.

// ---------------------------------------------------------------------
// 14. Intersections for API responses
// ---------------------------------------------------------------------

type UserData = {
  id: number;
  name: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

type PaginatedUsers = {
  users: UserData[];
} & Pagination;

const usersResponse: PaginatedUsers = {
  users: [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
  ],
  page: 1,
  pageSize: 20,
  total: 2,
};

console.log(usersResponse.users); // [{ id: 1, name: "John" }, ...]
console.log(usersResponse.page); // 1
console.log(usersResponse.total); // 2

// ---------------------------------------------------------------------
// 15. Intersection with readonly properties
// ---------------------------------------------------------------------

type ReadonlyIdentity = {
  readonly id: number;
};

type UserDetails = {
  name: string;
};

type ReadonlyUser = ReadonlyIdentity & UserDetails;

const readonlyUser: ReadonlyUser = {
  id: 1,
  name: "John",
};

console.log(readonlyUser.id); // 1
console.log(readonlyUser.name); // "John"

// readonlyUser.id = 2;
// Error: Cannot assign to 'id' because it is a read-only property.

// The readonly modifier is preserved through the intersection.

// ---------------------------------------------------------------------
// 16. Intersection with optional properties
// ---------------------------------------------------------------------

type Profile = {
  name: string;
};

type OptionalContact = {
  phone?: string;
};

type UserProfile = Profile & OptionalContact;

const profile: UserProfile = {
  name: "John",
};

console.log(profile.name); // "John"
console.log(profile.phone); // undefined

// Optional properties remain optional when intersected with another type,
// unless another constituent type requires the same property.

// ---------------------------------------------------------------------
// 17. Required property wins over optional property
// ---------------------------------------------------------------------

type RequiredEmail = {
  email: string;
};

type OptionalEmail = {
  email?: string;
};

type UserWithEmail = RequiredEmail & OptionalEmail;

const userWithEmail: UserWithEmail = {
  email: "john@example.com",
};

console.log(userWithEmail.email); // "john@example.com"

// Because one constituent requires email, the resulting property is required.

// ---------------------------------------------------------------------
// 18. Conflicting property types
// ---------------------------------------------------------------------

type NumericId = {
  id: number;
};

type StringId = {
  id: string;
};

type ConflictingId = NumericId & StringId;

// ConflictingId requires id to be both number and string.
// No normal value can satisfy that requirement.

// ---------------------------------------------------------------------
// 19. Intersections and object composition
// ---------------------------------------------------------------------

type BaseEntity = {
  id: number;
};

type SoftDeletable = {
  deletedAt: Date | null;
};

type Versioned = {
  version: number;
};

type VersionedEntity = BaseEntity & SoftDeletable & Versioned;

const documentEntity: VersionedEntity = {
  id: 10,
  deletedAt: null,
  version: 3,
};

console.log(documentEntity.id); // 10
console.log(documentEntity.deletedAt); // null
console.log(documentEntity.version); // 3

// Small reusable types can be composed into larger domain models.

// ---------------------------------------------------------------------
// 20. Intersection types and type aliases
// ---------------------------------------------------------------------

type PersonInfo = {
  name: string;
};

type EmployeeInfo = {
  employeeId: number;
};

type ManagerInfo = {
  teamSize: number;
};

type Manager = PersonInfo & EmployeeInfo & ManagerInfo;

const manager: Manager = {
  name: "John",
  employeeId: 1001,
  teamSize: 8,
};

console.log(manager.name); // "John"
console.log(manager.employeeId); // 1001
console.log(manager.teamSize); // 8

// Type aliases make complex intersections easier to name and reuse.

// ---------------------------------------------------------------------
// 21. Intersection types with interfaces
// ---------------------------------------------------------------------

interface HasUsername {
  username: string;
}

interface HasAvatar {
  avatarUrl: string;
}

type UserAccount = HasUsername & HasAvatar;

const account: UserAccount = {
  username: "john",
  avatarUrl: "/avatars/john.png",
};

console.log(account.username); // "john"
console.log(account.avatarUrl); // "/avatars/john.png"

// Interfaces can participate in intersections just like type aliases.

// ---------------------------------------------------------------------
// 22. Intersection vs. interface extends
// ---------------------------------------------------------------------

interface BaseUser {
  id: number;
}

interface NamedUser extends BaseUser {
  name: string;
}

type UserWithTypeAlias = BaseUser & {
  name: string;
};

const userA: NamedUser = {
  id: 1,
  name: "John",
};

const userB: UserWithTypeAlias = {
  id: 2,
  name: "Alice",
};

console.log(userA.name); // "John"
console.log(userB.name); // "Alice"

// Both approaches can compose object structures.
// Intersections are especially convenient when combining existing types,
// including unions and type aliases.

// ---------------------------------------------------------------------
// 23. Intersection with a union
// ---------------------------------------------------------------------

type TextValue = {
  value: string;
};

type NumericValue = {
  value: number;
};

type HasLabel = {
  label: string;
};

type LabeledValue = (TextValue | NumericValue) & HasLabel;

const textValue: LabeledValue = {
  value: "Hello",
  label: "message",
};

const numericValue: LabeledValue = {
  value: 100,
  label: "score",
};

console.log(textValue.value); // "Hello"
console.log(numericValue.value); // 100
console.log(textValue.label); // "message"

// Parentheses make the intended grouping explicit:
//
// (A | B) & C
//
// means the value must satisfy C and either A or B.

// ---------------------------------------------------------------------
// 24. Narrowing an intersection
// ---------------------------------------------------------------------

type TextData = {
  kind: "text";
  value: string;
};

type NumericData = {
  kind: "number";
  value: number;
};

type Metadata = {
  createdBy: string;
};

type Data = (TextData | NumericData) & Metadata;

function printData(data: Data): void {
  if (data.kind === "text") {
    console.log(data.value.toUpperCase());
  } else {
    console.log(data.value.toFixed(2));
  }

  console.log(data.createdBy);
}

printData({
  kind: "text",
  value: "hello",
  createdBy: "John",
}); // "HELLO" then "John"

printData({
  kind: "number",
  value: 42,
  createdBy: "Alice",
}); // "42.00" then "Alice"

// Intersection types can be combined with discriminated unions and
// narrowed normally.

// ---------------------------------------------------------------------
// 25. React: combining component props
// ---------------------------------------------------------------------

type BaseProps = {
  id: string;
  className?: string;
};

type LoadingProps = {
  isLoading: boolean;
};

type ButtonProps = BaseProps & LoadingProps;

function getButtonLabel(props: ButtonProps): string {
  return props.isLoading ? "Loading..." : "Submit";
}

const buttonProps: ButtonProps = {
  id: "submit-button",
  className: "primary",
  isLoading: false,
};

console.log(getButtonLabel(buttonProps)); // "Submit"

// Intersections are commonly useful for composing reusable React prop types.

// ---------------------------------------------------------------------
// 26. React: extending native element props
// ---------------------------------------------------------------------

// React component props are often composed from several sources.
//
// import type { ButtonHTMLAttributes } from "react";
//
// type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
//   variant: "primary" | "secondary";
// };
//
// function Button({
//   variant,
//   ...props
// }: CustomButtonProps) {
//   return <button {...props} data-variant={variant} />;
// }

// The intersection combines React's native button props with the component's
// custom props.

// ---------------------------------------------------------------------
// 27. Intersection types and utility types
// ---------------------------------------------------------------------

type UserRecord = {
  id: number;
  name: string;
  email: string;
};

type UserUpdate = Partial<UserRecord>;

type IdentifiedUpdate = UserUpdate & {
  id: number;
};

const update: IdentifiedUpdate = {
  id: 1,
  name: "Alice",
};

console.log(update.id); // 1
console.log(update.name); // "Alice"

// Utility types can be combined with intersections to create specialized
// variations of existing types.

// ---------------------------------------------------------------------
// 28. Intersection types are compile-time constructs
// ---------------------------------------------------------------------

type ProductInfo = {
  name: string;
};

type ProductPrice = {
  price: number;
};

type Product = ProductInfo & ProductPrice;

const product: Product = {
  name: "Laptop",
  price: 1200,
};

console.log(product);

// No special JavaScript operation is generated for `ProductInfo & ProductPrice`.
// The intersection exists only in TypeScript's type system.

// ---------------------------------------------------------------------
// 29. Practical domain composition
// ---------------------------------------------------------------------

type IdentifiableEntity = {
  id: string;
};

type TimestampedEntity = {
  createdAt: Date;
  updatedAt: Date;
};

type OwnedEntity = {
  ownerId: string;
};

type Project = IdentifiableEntity &
  TimestampedEntity &
  OwnedEntity & {
    name: string;
  };

const project: Project = {
  id: "project-1",
  name: "Website",
  ownerId: "user-1",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-10"),
};

console.log(project.id); // "project-1"
console.log(project.name); // "Website"
console.log(project.ownerId); // "user-1"
console.log(project.createdAt); // 2026-01-01T00:00:00.000Z

// This composition style keeps reusable domain capabilities separate while
// allowing concrete models to combine them.

// ---------------------------------------------------------------------
// 30. Choosing intersection or union
// ---------------------------------------------------------------------

type CanEdit = {
  edit(): void;
};

type CanDelete = {
  delete(): void;
};

type Editor = CanEdit;
type EditorAndAdmin = CanEdit & CanDelete;

const editor: Editor = {
  edit() {
    console.log("Editing");
  },
};

const administrator: EditorAndAdmin = {
  edit() {
    console.log("Editing");
  },
  delete() {
    console.log("Deleting");
  },
};

editor.edit(); // "Editing"
administrator.edit(); // "Editing"
administrator.delete(); // "Deleting"

// Use an intersection when a value must provide every capability.
// Use a union when a value can provide one of several alternatives.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - Intersection types combine types with the `&` operator.
// - A value of A & B must satisfy both A and B.
// - Intersections are useful for composing reusable object types.
// - Multiple types can be combined with A & B & C.
// - Compatible properties are combined into the resulting type.
// - Conflicting property types can produce an impossible, never-like type.
// - Required properties remain required when combined with optional versions.
// - readonly modifiers are preserved through intersections.
// - Intersections can combine type aliases, interfaces, generics, and utility types.
// - Function intersections can represent multiple callable signatures.
// - Intersections can be combined with unions using explicit parentheses.
// - Intersection types are compile-time constructs and do not create runtime
//   objects or runtime merging behavior.
// - In React, intersections are useful for composing component props and
//   combining native element props with custom component requirements.
// - Use intersections when a value must satisfy multiple requirements.
// - Use unions when a value can represent one of several alternatives.

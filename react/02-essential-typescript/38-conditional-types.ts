/**
 * Conditional Types
 * =================
 *
 * Conditional types select one type or another based on a type relationship.
 * They use the `extends` keyword to express type-level conditions and are
 * especially useful for reusable generic type transformations.
 */

// ---------------------------------------------------------------------
// 1. Basic conditional type
// ---------------------------------------------------------------------

type IsString<T> = T extends string ? true : false;

type StringResult = IsString<string>;
type NumberResult = IsString<number>;

const stringResult: StringResult = true;
const numberResult: NumberResult = false;

console.log(stringResult);
console.log(numberResult);

// `T extends string ? true : false` means:
// If T is assignable to string, use true; otherwise, use false.

// ---------------------------------------------------------------------
// 2. Conditional types with unions
// ---------------------------------------------------------------------

type IsNumber<T> = T extends number ? "number" : "other";

type NumberCheck = IsNumber<number>;
type StringCheck = IsNumber<string>;

const numberCheck: NumberCheck = "number";
const stringCheck: StringCheck = "other";

console.log(numberCheck);
console.log(stringCheck);

// ---------------------------------------------------------------------
// 3. Conditional types with generic functions
// ---------------------------------------------------------------------

type ValueType<T> = T extends string ? string : T extends number ? number : boolean;

type StringValue = ValueType<string>;
type NumberValue = ValueType<number>;
type BooleanValue = ValueType<boolean>;

const stringValue: StringValue = "Hello";
const numberValue: NumberValue = 42;
const booleanValue: BooleanValue = true;

console.log(stringValue);
console.log(numberValue);
console.log(booleanValue);

// ---------------------------------------------------------------------
// 4. Conditional types as type-level if/else
// ---------------------------------------------------------------------

type AccessLevel<T> = T extends "admin" ? "full" : T extends "editor" ? "limited" : "read-only";

type AdminAccess = AccessLevel<"admin">;
type EditorAccess = AccessLevel<"editor">;
type ViewerAccess = AccessLevel<"viewer">;

const adminAccess: AdminAccess = "full";
const editorAccess: EditorAccess = "limited";
const viewerAccess: ViewerAccess = "read-only";

console.log(adminAccess);
console.log(editorAccess);
console.log(viewerAccess);

// ---------------------------------------------------------------------
// 5. Conditional types with object shapes
// ---------------------------------------------------------------------

type HasId<T> = T extends { id: number } ? true : false;

type WithId = HasId<{ id: number; name: string }>;
type WithoutId = HasId<{ name: string }>;

const withId: WithId = true;
const withoutId: WithoutId = false;

console.log(withId);
console.log(withoutId);

// ---------------------------------------------------------------------
// 6. Conditional types with generic constraints
// ---------------------------------------------------------------------

type ElementType<T> = T extends readonly unknown[] ? T[number] : T;

type StringElement = ElementType<string[]>;
type NumberElement = ElementType<number[]>;
type PlainValue = ElementType<boolean>;

const stringElement: StringElement = "Hello";
const numberElement: NumberElement = 42;
const plainValue: PlainValue = true;

console.log(stringElement);
console.log(numberElement);
console.log(plainValue);

// ---------------------------------------------------------------------
// 7. Extracting array element types
// ---------------------------------------------------------------------

type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

type UserArray = ArrayElement<User[]>;
type StringArray = ArrayElement<string[]>;
type NotArray = ArrayElement<number>;

const userElement: UserArray = {
  name: "John",
  age: 30,
  isActive: true,
};

const textElement: StringArray = "Hello";

console.log(userElement.name);
console.log(textElement);

// `infer U` lets TypeScript capture the element type from the array.

// ---------------------------------------------------------------------
// 8. The infer keyword
// ---------------------------------------------------------------------

type ReturnTypeOf<T> = T extends (...args: never[]) => infer R ? R : never;

type StringReturn = ReturnTypeOf<() => string>;
type NumberReturn = ReturnTypeOf<(value: number) => number>;

const stringReturn: StringReturn = "Hello";
const numberReturn: NumberReturn = 42;

console.log(stringReturn);
console.log(numberReturn);

// `infer R` asks TypeScript to infer the function's return type.

// ---------------------------------------------------------------------
// 9. Inferring function parameters
// ---------------------------------------------------------------------

type FirstParameter<T> = T extends (first: infer P, ...args: never[]) => unknown ? P : never;

type NameParameter = FirstParameter<(name: string, age: number) => void>;
type IdParameter = FirstParameter<(id: number) => string>;

const nameParameter: NameParameter = "John";
const idParameter: IdParameter = 1;

console.log(nameParameter);
console.log(idParameter);

// ---------------------------------------------------------------------
// 10. Conditional types with Promise
// ---------------------------------------------------------------------

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type AsyncString = UnwrapPromise<Promise<string>>;
type AsyncNumber = UnwrapPromise<Promise<number>>;
type SyncBoolean = UnwrapPromise<boolean>;

const asyncString: AsyncString = "Loaded";
const asyncNumber: AsyncNumber = 42;
const syncBoolean: SyncBoolean = true;

console.log(asyncString);
console.log(asyncNumber);
console.log(syncBoolean);

// ---------------------------------------------------------------------
// 11. Nested conditional types
// ---------------------------------------------------------------------

type PrimitiveName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : "other";

type StringName = PrimitiveName<string>;
type NumberName = PrimitiveName<number>;
type BooleanName = PrimitiveName<boolean>;
type ObjectName = PrimitiveName<object>;

const stringName: StringName = "string";
const numberName: NumberName = "number";
const booleanName: BooleanName = "boolean";
const objectName: ObjectName = "other";

console.log(stringName);
console.log(numberName);
console.log(booleanName);
console.log(objectName);

// ---------------------------------------------------------------------
// 12. Distributive conditional types
// ---------------------------------------------------------------------

type ToArray<T> = T extends unknown ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;

const arrays: StringOrNumberArray = ["Hello"];

console.log(arrays);

// For a union, a naked type parameter distributes:
//
// ToArray<string | number>
// becomes:
// ToArray<string> | ToArray<number>
// becomes:
// string[] | number[]

// ---------------------------------------------------------------------
// 13. Distribution with filtering
// ---------------------------------------------------------------------

type OnlyStrings<T> = T extends string ? T : never;

type StringValues = OnlyStrings<string | number | boolean>;

const onlyString: StringValues = "Hello";

console.log(onlyString);

// The union is evaluated member by member:
//
// string  -> string
// number  -> never
// boolean -> never
//
// string | never | never becomes string.

// ---------------------------------------------------------------------
// 14. Filtering union members
// ---------------------------------------------------------------------

type OnlyNumbers<T> = T extends number ? T : never;

type NumericValues = OnlyNumbers<string | number | boolean | 42>;

const numericValue: NumericValues = 42;

console.log(numericValue);

// ---------------------------------------------------------------------
// 15. Excluding union members
// ---------------------------------------------------------------------

type WithoutStrings<T> = T extends string ? never : T;

type NonStringValues = WithoutStrings<string | number | boolean>;

const nonString: NonStringValues = 42;
const anotherNonString: NonStringValues = true;

console.log(nonString);
console.log(anotherNonString);

// ---------------------------------------------------------------------
// 16. Built-in Extract utility type
// ---------------------------------------------------------------------

type MixedValues = string | number | boolean;

type StringOnly = Extract<MixedValues, string>;
type NumericOnly = Extract<MixedValues, number>;

const extractedString: StringOnly = "Hello";
const extractedNumber: NumericOnly = 42;

console.log(extractedString);
console.log(extractedNumber);

// `Extract<T, U>` is effectively:
//
// type Extract<T, U> = T extends U ? T : never;

// ---------------------------------------------------------------------
// 17. Built-in Exclude utility type
// ---------------------------------------------------------------------

type Status = "loading" | "success" | "error";

type FinishedStatus = Exclude<Status, "loading">;

const finishedStatus: FinishedStatus = "success";

console.log(finishedStatus);

// `Exclude<T, U>` is effectively:
//
// type Exclude<T, U> = T extends U ? never : T;

// ---------------------------------------------------------------------
// 18. Conditional types with object properties
// ---------------------------------------------------------------------

type PropertyType<T, K extends keyof T> = T[K] extends string ? "text" : T[K] extends number ? "numeric" : "other";

type NameProperty = PropertyType<User, "name">;
type AgeProperty = PropertyType<User, "age">;
type ActiveProperty = PropertyType<User, "isActive">;

const nameProperty: NameProperty = "text";
const ageProperty: AgeProperty = "numeric";
const activeProperty: ActiveProperty = "other";

console.log(nameProperty);
console.log(ageProperty);
console.log(activeProperty);

// ---------------------------------------------------------------------
// 19. Conditional types with discriminated unions
// ---------------------------------------------------------------------

type Shape =
  | {
      kind: "circle";
      radius: number;
    }
  | {
      kind: "square";
      side: number;
    };

type Circle = Extract<Shape, { kind: "circle" }>;
type Square = Extract<Shape, { kind: "square" }>;

const circle: Circle = {
  kind: "circle",
  radius: 10,
};

const square: Square = {
  kind: "square",
  side: 20,
};

console.log(circle.radius);
console.log(square.side);

// ---------------------------------------------------------------------
// 20. Conditional type for API responses
// ---------------------------------------------------------------------

type ApiResponse<T> = T extends Error
  ? {
      success: false;
      error: T;
    }
  : {
      success: true;
      data: T;
    };

type SuccessResponse = ApiResponse<User>;
type ErrorResponse = ApiResponse<Error>;

const successResponse: SuccessResponse = {
  success: true,
  data: {
    name: "John",
    age: 30,
    isActive: true,
  },
};

const errorResponse: ErrorResponse = {
  success: false,
  error: new Error("Request failed"),
};

console.log(successResponse.data.name);
console.log(errorResponse.error.message);

// ---------------------------------------------------------------------
// 21. Conditional types and never
// ---------------------------------------------------------------------

type IsNever<T> = [T] extends [never] ? true : false;

type NeverResult = IsNever<never>;
type StringResultFromNeverCheck = IsNever<string>;

const neverResult: NeverResult = true;
const stringResultFromNeverCheck: StringResultFromNeverCheck = false;

console.log(neverResult);
console.log(stringResultFromNeverCheck);

// Wrapping T in a tuple prevents distributive behavior.
// This is important when checking whether T is exactly `never`.

// ---------------------------------------------------------------------
// 22. Preventing distributive behavior
// ---------------------------------------------------------------------

type IsStringDistributed<T> = T extends string ? true : false;

type IsStringNonDistributed<T> = [T] extends [string] ? true : false;

type DistributedResult = IsStringDistributed<string | number>;
type NonDistributedResult = IsStringNonDistributed<string | number>;

// DistributedResult becomes true | false.
// NonDistributedResult becomes false.

const distributedResult: DistributedResult = true;
const nonDistributedResult: NonDistributedResult = false;

console.log(distributedResult);
console.log(nonDistributedResult);

// ---------------------------------------------------------------------
// 23. Conditional types and readonly arrays
// ---------------------------------------------------------------------

type Element<T> = T extends readonly (infer U)[] ? U : never;

type ReadonlyStringElement = Element<readonly string[]>;
type ReadonlyNumberElement = Element<readonly number[]>;

const readonlyStringElement: ReadonlyStringElement = "Hello";
const readonlyNumberElement: ReadonlyNumberElement = 42;

console.log(readonlyStringElement);
console.log(readonlyNumberElement);

// ---------------------------------------------------------------------
// 24. Conditional types and functions
// ---------------------------------------------------------------------

type IsFunction<T> = T extends (...args: never[]) => unknown ? true : false;

type FunctionResult = IsFunction<() => void>;
type ObjectResult = IsFunction<{ name: string }>;

const functionResult: FunctionResult = true;
const objectResult: ObjectResult = false;

console.log(functionResult);
console.log(objectResult);

// ---------------------------------------------------------------------
// 25. Conditional types for React-style component props
// ---------------------------------------------------------------------

type ButtonProps =
  | {
      variant: "link";
      href: string;
    }
  | {
      variant: "button";
      onClick: () => void;
    };

type PropsForVariant<T> = T extends { variant: infer V } ? V : never;

type AvailableVariants = PropsForVariant<ButtonProps>;

const variant: AvailableVariants = "link";

console.log(variant);

// ---------------------------------------------------------------------
// 26. Conditional type for event handlers
// ---------------------------------------------------------------------

type EventForElement<T> = T extends "input" ? { value: string } : T extends "button" ? { clicked: boolean } : Event;

type InputEventData = EventForElement<"input">;
type ButtonEventData = EventForElement<"button">;

const inputEvent: InputEventData = {
  value: "Hello",
};

const buttonEvent: ButtonEventData = {
  clicked: true,
};

console.log(inputEvent.value);
console.log(buttonEvent.clicked);

// ---------------------------------------------------------------------
// 27. Conditional types with generic defaults
// ---------------------------------------------------------------------

type Data<T = string> = T extends string
  ? {
      value: string;
    }
  : {
      value: T;
    };

const defaultData: Data = {
  value: "Hello",
};

const numberData: Data<number> = {
  value: 42,
};

console.log(defaultData.value);
console.log(numberData.value);

// ---------------------------------------------------------------------
// 28. Conditional types with mapped types
// ---------------------------------------------------------------------

type NullableStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | null : T[K];
};

type Profile = {
  name: string;
  age: number;
  active: boolean;
};

const nullableProfile: NullableStrings<Profile> = {
  name: null,
  age: 30,
  active: true,
};

console.log(nullableProfile.name);
console.log(nullableProfile.age);
console.log(nullableProfile.active);

// ---------------------------------------------------------------------
// 29. Conditional types as reusable type logic
// ---------------------------------------------------------------------

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type IsPrimitive<T> = T extends Primitive ? true : false;

type StringIsPrimitive = IsPrimitive<string>;
type ObjectIsPrimitive = IsPrimitive<{ name: string }>;

const stringIsPrimitive: StringIsPrimitive = true;
const objectIsPrimitive: ObjectIsPrimitive = false;

console.log(stringIsPrimitive);
console.log(objectIsPrimitive);

// ---------------------------------------------------------------------
// 30. Practical conditional type pattern
// ---------------------------------------------------------------------

type IdValue<T> = T extends { id: infer I } ? I : never;

type UserId = IdValue<User>;

const userId: UserId = 1;

console.log(userId);

// This pattern extracts a property type only when the input type contains
// the required structure.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// Conditional types use this structure:
//
// T extends U ? X : Y
//
// Meaning:
// - If T is assignable to U, the result is X.
// - Otherwise, the result is Y.
//
// Important concepts:
// - `extends` performs a type relationship check.
// - `infer` captures a type from a matching structure.
// - Conditional types can distribute over unions.
// - Wrapping T in a tuple prevents distribution.
// - `never` is commonly used to filter union members.
// - `Extract` and `Exclude` are built from conditional types.
// - Conditional types can be combined with mapped types.
// - They are useful for API models, utility types, React props,
//   function types, and reusable generic abstractions.
//
// Conditional types operate entirely at the type level and have no runtime
// behavior.

/**
 * NonNullable
 * ===========
 *
 * The `NonNullable<T>` utility type removes `null` and `undefined` from a
 * type. It is useful when a value must be known to exist before it is used.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

type MaybeString = string | null | undefined;

type StringValue = NonNullable<MaybeString>;

const value: StringValue = "Hello";

console.log(value);

// NonNullable<MaybeString> becomes:
//
// string

// ---------------------------------------------------------------------
// 2. Removing null and undefined
// ---------------------------------------------------------------------

type MixedValue = string | number | null | undefined;

type DefinedValue = NonNullable<MixedValue>;

const stringValue: DefinedValue = "Hello";
const numberValue: DefinedValue = 42;

console.log(stringValue);
console.log(numberValue);

// `null` and `undefined` are removed.
// string | number | null | undefined
// becomes:
// string | number

// ---------------------------------------------------------------------
// 3. NonNullable with only nullable values
// ---------------------------------------------------------------------

type NullableOnly = null | undefined;
type Nothing = NonNullable<NullableOnly>;

// `Nothing` becomes `never`.

const values: Nothing[] = [];

console.log(values);

// ---------------------------------------------------------------------
// 4. NonNullable with a non-nullable type
// ---------------------------------------------------------------------

type User = {
  name: string;
  age: number;
};

type DefinedUser = NonNullable<User>;

const user: DefinedUser = {
  name: "John",
  age: 30,
};

console.log(user.name);
console.log(user.age);

// Applying NonNullable to an already non-nullable type does not change it.

// ---------------------------------------------------------------------
// 5. NonNullable with nullable objects
// ---------------------------------------------------------------------

type MaybeUser = User | null | undefined;

type ExistingUser = NonNullable<MaybeUser>;

const existingUser: ExistingUser = {
  name: "John",
  age: 30,
};

console.log(existingUser.name);
console.log(existingUser.age);

// ---------------------------------------------------------------------
// 6. NonNullable with unions
// ---------------------------------------------------------------------

type Input = string | number | boolean | null | undefined;

type DefinedInput = NonNullable<Input>;

const textInput: DefinedInput = "Hello";
const numericInput: DefinedInput = 123;
const booleanInput: DefinedInput = true;

console.log(textInput);
console.log(numericInput);
console.log(booleanInput);

// ---------------------------------------------------------------------
// 7. NonNullable is a conditional type
// ---------------------------------------------------------------------

type MyNonNullable<T> = T extends null | undefined ? never : T;

type Example = MyNonNullable<string | number | null | undefined>;

const exampleString: Example = "Hello";
const exampleNumber: Example = 42;

console.log(exampleString);
console.log(exampleNumber);

// `NonNullable<T>` is conceptually equivalent to:
//
// type NonNullable<T> = T extends null | undefined ? never : T;
//
// The built-in implementation is defined by TypeScript itself.

// ---------------------------------------------------------------------
// 8. NonNullable and strictNullChecks
// ---------------------------------------------------------------------

// `NonNullable<T>` is most meaningful when `strictNullChecks` is enabled.
//
// With strict null checking:
//
// string
// string | null
// string | undefined
// string | null | undefined
//
// are distinct types.

type NullableName = string | null;
type DefinedName = NonNullable<NullableName>;

const name: DefinedName = "John";

console.log(name);

// ---------------------------------------------------------------------
// 9. Narrowing before NonNullable
// ---------------------------------------------------------------------

function printName(name: string | null | undefined): void {
  if (name !== null && name !== undefined) {
    console.log(name);
  }
}

printName("John");
printName(null);
printName(undefined);

// Runtime checks narrow values inside a specific control-flow branch.
// NonNullable<T> performs a type-level transformation for a type itself.

// ---------------------------------------------------------------------
// 10. NonNullable with nullish checks
// ---------------------------------------------------------------------

function getUsername(user: User | null | undefined): string {
  if (user == null) {
    return "Guest";
  }

  return user.name;
}

console.log(getUsername(user));
console.log(getUsername(null));
console.log(getUsername(undefined));

// `user == null` checks for both null and undefined.
// After the check, TypeScript narrows user to User.

// ---------------------------------------------------------------------
// 11. NonNullable with function parameters
// ---------------------------------------------------------------------

function processUser(user: NonNullable<User | null>): void {
  console.log(user.name);
  console.log(user.age);
}

processUser({
  name: "John",
  age: 30,
});

// The parameter type is simply User because null has been removed.

// ---------------------------------------------------------------------
// 12. NonNullable with arrays
// ---------------------------------------------------------------------

type MaybeNumbers = (number | null | undefined)[];

type Numbers = Array<NonNullable<MaybeNumbers[number]>>;

const numbers: Numbers = [10, 20, 30];

console.log(numbers);

// The original element type is:
//
// number | null | undefined
//
// NonNullable removes the nullable members:
//
// number

// ---------------------------------------------------------------------
// 13. NonNullable with tuples
// ---------------------------------------------------------------------

type MaybeCoordinates = [number | null, number | undefined];

type Coordinates = {
  [K in keyof MaybeCoordinates]: NonNullable<MaybeCoordinates[K]>;
};

const coordinates: Coordinates = [10, 20];

console.log(coordinates[0]);
console.log(coordinates[1]);

// ---------------------------------------------------------------------
// 14. NonNullable with object properties
// ---------------------------------------------------------------------

type Profile = {
  name: string | null;
  age: number | null;
  email?: string;
};

type DefinedProfile = {
  [K in keyof Profile]-?: NonNullable<Profile[K]>;
};

const profile: DefinedProfile = {
  name: "John",
  age: 30,
  email: "john@example.com",
};

console.log(profile.name);
console.log(profile.age);
console.log(profile.email);

// This combines mapped types with NonNullable.
// The `-?` also removes optionality from email.

// ---------------------------------------------------------------------
// 15. NonNullable does not automatically change object properties
// ---------------------------------------------------------------------

type NullableProfile = {
  name: string | null;
  email: string | null;
};

type NonNullableProfile = NonNullable<NullableProfile>;

const nullableProfile: NonNullableProfile = {
  name: null,
  email: null,
};

console.log(nullableProfile.name);
console.log(nullableProfile.email);

// Important:
// NonNullable<NullableProfile> removes null/undefined from the OBJECT type.
// It does not recursively remove null/undefined from the object's properties.
//
// For property-level transformation, each property must be transformed
// explicitly, usually with a mapped type.

// ---------------------------------------------------------------------
// 16. Transforming every property with NonNullable
// ---------------------------------------------------------------------

type RemoveNullish<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

type NullableUser = {
  id: number | null;
  name: string | null;
  email?: string | null;
};

type DefinedUserProperties = RemoveNullish<NullableUser>;

const definedUser: DefinedUserProperties = {
  id: 1,
  name: "John",
  email: "john@example.com",
};

console.log(definedUser.id);
console.log(definedUser.name);
console.log(definedUser.email);

// Note that the optional modifier on email is still present.
// NonNullable changes the value type, not property optionality.

// ---------------------------------------------------------------------
// 17. Combining NonNullable with Required
// ---------------------------------------------------------------------

type CompleteDefinedUser = Required<RemoveNullish<NullableUser>>;

const completeDefinedUser: CompleteDefinedUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
};

console.log(completeDefinedUser.id);
console.log(completeDefinedUser.name);
console.log(completeDefinedUser.email);

// `RemoveNullish` removes null and undefined from property values.
// `Required` then removes optional property modifiers.

// ---------------------------------------------------------------------
// 18. NonNullable with API responses
// ---------------------------------------------------------------------

type ApiResponse = {
  data: User | null;
  error: Error | null;
};

type ApiData = NonNullable<ApiResponse["data"]>;

const apiData: ApiData = {
  name: "John",
  age: 30,
};

console.log(apiData.name);
console.log(apiData.age);

// Indexed access obtains the property type.
// NonNullable then removes null from that property type.

// ---------------------------------------------------------------------
// 19. NonNullable with API state
// ---------------------------------------------------------------------

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type LoadedUser = NonNullable<ApiState<User>["data"]>;

const loadedUser: LoadedUser = {
  name: "John",
  age: 30,
};

console.log(loadedUser.name);
console.log(loadedUser.age);

// ---------------------------------------------------------------------
// 20. React-style nullable state
// ---------------------------------------------------------------------

type UserState = {
  currentUser: User | null;
};

const userState: UserState = {
  currentUser: {
    name: "John",
    age: 30,
  },
};

type CurrentUser = NonNullable<UserState["currentUser"]>;

const currentUser: CurrentUser = {
  name: "John",
  age: 30,
};

console.log(currentUser.name);
console.log(currentUser.age);

// A React state value may legitimately be null while loading.
// NonNullable is useful when defining the type of the state after the
// existence of the value has been established.

// ---------------------------------------------------------------------
// 21. NonNullable and discriminated unions
// ---------------------------------------------------------------------

type Result =
  | {
      status: "success";
      data: User;
    }
  | {
      status: "error";
      data: null;
    }
  | null;

type DefinedResult = NonNullable<Result>;

const result: DefinedResult = {
  status: "success",
  data: {
    name: "John",
    age: 30,
  },
};

console.log(result.status);

// The top-level `null` member is removed.
// The `data` property of the error branch is still null because
// NonNullable does not recursively transform nested properties.

// ---------------------------------------------------------------------
// 22. NonNullable with function return types
// ---------------------------------------------------------------------

type MaybeUserFactory = () => User | null | undefined;

type UserFactory = () => NonNullable<ReturnType<MaybeUserFactory>>;

const createUser: UserFactory = () => ({
  name: "John",
  age: 30,
});

const createdUser = createUser();

console.log(createdUser.name);
console.log(createdUser.age);

// `ReturnType` obtains the function's return type.
// `NonNullable` removes null and undefined from that type.

// ---------------------------------------------------------------------
// 23. NonNullable with Promise values
// ---------------------------------------------------------------------

type MaybeUserPromise = Promise<User | null>;

type UserPromise = Promise<NonNullable<User | null>>;

const userPromise: UserPromise = Promise.resolve({
  name: "John",
  age: 30,
});

userPromise.then((value) => {
  console.log(value.name);
  console.log(value.age);
});

// NonNullable can be used inside another generic type such as Promise.

// ---------------------------------------------------------------------
// 24. NonNullable with optional properties
// ---------------------------------------------------------------------

type Contact = {
  name: string;
  email?: string;
};

type ContactEmail = NonNullable<Contact["email"]>;

const email: ContactEmail = "john@example.com";

console.log(email);

// `Contact["email"]` is string | undefined.
// NonNullable removes undefined, producing string.

// ---------------------------------------------------------------------
// 25. NonNullable with indexed access types
// ---------------------------------------------------------------------

type Settings = {
  theme?: {
    name: string;
  };
};

type Theme = NonNullable<Settings["theme"]>;

const theme: Theme = {
  name: "dark",
};

console.log(theme.name);

// Indexed access + NonNullable is a common pattern for extracting a
// guaranteed-present nested value type.

// ---------------------------------------------------------------------
// 26. NonNullable with utility type composition
// ---------------------------------------------------------------------

type Account = {
  id: number;
  profile?: {
    name: string;
    email?: string;
  };
};

type RequiredProfile = Required<Pick<Account, "profile">>;
type ExistingProfile = NonNullable<RequiredProfile["profile"]>;

const existingProfile: ExistingProfile = {
  name: "John",
};

console.log(existingProfile.name);

// Utility types can be composed to progressively transform a type:
//
// Pick       -> select the property.
// Required   -> require the property.
// NonNullable -> remove null/undefined from its value.

// ---------------------------------------------------------------------
// 27. NonNullable and runtime safety
// ---------------------------------------------------------------------

function printUser(user: User | null): void {
  if (user === null) {
    return;
  }

  const definedUser: NonNullable<User | null> = user;

  console.log(definedUser.name);
  console.log(definedUser.age);
}

printUser(user);
printUser(null);

// NonNullable itself does not perform a runtime check.
// The actual value must be validated or narrowed before it is treated
// as definitely present.

// ---------------------------------------------------------------------
// 28. NonNullable does not create values
// ---------------------------------------------------------------------

type MaybeValue = string | null | undefined;
type DefiniteValue = NonNullable<MaybeValue>;

function getValue(value: MaybeValue): DefiniteValue {
  if (value == null) {
    return "Default";
  }

  return value;
}

console.log(getValue("Hello"));
console.log(getValue(null));
console.log(getValue(undefined));

// The type transformation does not convert null or undefined at runtime.
// The function must decide what value to return when the input is absent.

// ---------------------------------------------------------------------
// 29. When to use NonNullable
// ---------------------------------------------------------------------

// Use `NonNullable<T>` when:
// - A type contains null or undefined.
// - A value is known to exist after validation or narrowing.
// - You need to extract a guaranteed-present property type.
// - You are composing utility types.
// - You are defining the type of data after a loading/validation step.
// - You need to remove nullish members from a union.

// Do not use NonNullable as a substitute for runtime validation.
// It changes the type system, not the runtime value.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// `NonNullable<T>` removes `null` and `undefined` from T.
//
// type MaybeValue = string | number | null | undefined;
// type Value = NonNullable<MaybeValue>;
//
// Value becomes:
//
// string | number
//
// Key points:
// - Removes `null`.
// - Removes `undefined`.
// - Preserves all other union members.
// - Produces `never` when nothing remains.
// - Is shallow and does not recursively transform object properties.
// - Works well with indexed access and other utility types.
// - Can be combined with `Required`, `Pick`, `ReturnType`, and mapped types.
// - Does not perform runtime validation or conversion.
//
// Conceptually:
//
// type MyNonNullable<T> =
//   T extends null | undefined ? never : T;

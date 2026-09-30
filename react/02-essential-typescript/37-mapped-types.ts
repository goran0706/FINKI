/**
 * Mapped Types
 * ============
 *
 * Mapped types create new object types by transforming the properties of an
 * existing type. They are useful for systematically changing property types,
 * modifiers, or selected keys without manually redefining the object type.
 */

// ---------------------------------------------------------------------
// 1. Basic mapped type
// ---------------------------------------------------------------------

type User = {
  name: string;
  age: number;
  isActive: boolean;
};

type StringifiedUser = {
  [K in keyof User]: string;
};

const user: StringifiedUser = {
  name: "John",
  age: "30",
  isActive: "true",
};

console.log(user.name);
console.log(user.age);
console.log(user.isActive);

// `K` represents each property key in `keyof User`.
// The mapped type transforms every property into a string.

// ---------------------------------------------------------------------
// 2. Mapping over keyof
// ---------------------------------------------------------------------

type Product = {
  id: number;
  name: string;
  price: number;
};

type ProductKeys = keyof Product;

type OptionalProduct = {
  [K in keyof Product]?: Product[K];
};

const product: OptionalProduct = {
  name: "Laptop",
  price: 999,
};

console.log(product.name);
console.log(product.price);

// `Product[K]` accesses the original type of each property.
// The mapped type makes every property optional while preserving its type.

// ---------------------------------------------------------------------
// 3. Preserving property types
// ---------------------------------------------------------------------

type Profile = {
  username: string;
  age: number;
  verified: boolean;
};

type ReadonlyProfile = {
  readonly [K in keyof Profile]: Profile[K];
};

const profile: ReadonlyProfile = {
  username: "johndoe",
  age: 30,
  verified: true,
};

console.log(profile.username);
console.log(profile.age);
console.log(profile.verified);

// profile.age = 31;
// Error: Cannot assign to 'age' because it is a read-only property.

// ---------------------------------------------------------------------
// 4. Creating a readonly mapped type
// ---------------------------------------------------------------------

type ReadonlyType<T> = {
  readonly [K in keyof T]: T[K];
};

type Settings = {
  theme: string;
  language: string;
};

const settings: ReadonlyType<Settings> = {
  theme: "dark",
  language: "en",
};

console.log(settings.theme);
console.log(settings.language);

// ---------------------------------------------------------------------
// 5. Creating an optional mapped type
// ---------------------------------------------------------------------

type OptionalType<T> = {
  [K in keyof T]?: T[K];
};

type Account = {
  username: string;
  email: string;
  age: number;
};

const partialAccount: OptionalType<Account> = {
  username: "johndoe",
};

console.log(partialAccount.username);
console.log(partialAccount.email);

// ---------------------------------------------------------------------
// 6. Removing readonly with -readonly
// ---------------------------------------------------------------------

type MutableType<T> = {
  -readonly [K in keyof T]: T[K];
};

type ImmutableSettings = {
  readonly theme: string;
  readonly language: string;
};

const mutableSettings: MutableType<ImmutableSettings> = {
  theme: "dark",
  language: "en",
};

mutableSettings.theme = "light";
mutableSettings.language = "fr";

console.log(mutableSettings.theme);
console.log(mutableSettings.language);

// ---------------------------------------------------------------------
// 7. Removing optional modifiers with -?
// ---------------------------------------------------------------------

type RequiredType<T> = {
  [K in keyof T]-?: T[K];
};

type OptionalSettings = {
  theme?: string;
  language?: string;
};

const requiredSettings: RequiredType<OptionalSettings> = {
  theme: "dark",
  language: "en",
};

console.log(requiredSettings.theme);
console.log(requiredSettings.language);

// The `-?` modifier removes optionality from every property.

// ---------------------------------------------------------------------
// 8. Adding optional and readonly modifiers
// ---------------------------------------------------------------------

type ReadonlyOptional<T> = {
  readonly [K in keyof T]?: T[K];
};

type FormValues = {
  username: string;
  email: string;
};

const readonlyForm: ReadonlyOptional<FormValues> = {
  username: "johndoe",
};

console.log(readonlyForm.username);
console.log(readonlyForm.email);

// ---------------------------------------------------------------------
// 9. Mapped types with key constraints
// ---------------------------------------------------------------------

type Permissions = {
  read: boolean;
  write: boolean;
  delete: boolean;
};

type PermissionStatus = {
  [K in keyof Permissions]: boolean;
};

const permissions: PermissionStatus = {
  read: true,
  write: false,
  delete: false,
};

console.log(permissions.read);
console.log(permissions.write);
console.log(permissions.delete);

// ---------------------------------------------------------------------
// 10. Mapped types over a union of keys
// ---------------------------------------------------------------------

type Status = "loading" | "success" | "error";

type StatusMessages = {
  [K in Status]: string;
};

const messages: StatusMessages = {
  loading: "Loading...",
  success: "Request completed.",
  error: "Request failed.",
};

console.log(messages.loading);
console.log(messages.success);
console.log(messages.error);

// ---------------------------------------------------------------------
// 11. Mapped types and Record
// ---------------------------------------------------------------------

type Role = "admin" | "editor" | "viewer";

type RolePermissions = Record<Role, string[]>;

const rolePermissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};

console.log(rolePermissions.admin);
console.log(rolePermissions.viewer);

// `Record<K, T>` is a built-in mapped type.
//
// type Record<K extends keyof any, T> = {
//   [P in K]: T;
// };

// ---------------------------------------------------------------------
// 12. Mapping property values
// ---------------------------------------------------------------------

type Scores = {
  math: number;
  english: number;
  science: number;
};

type ScoreLabels = {
  [K in keyof Scores]: string;
};

const scoreLabels: ScoreLabels = {
  math: "95",
  english: "88",
  science: "92",
};

console.log(scoreLabels.math);
console.log(scoreLabels.english);
console.log(scoreLabels.science);

// ---------------------------------------------------------------------
// 13. Mapping property values using a generic
// ---------------------------------------------------------------------

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type UserData = {
  name: string;
  age: number;
  active: boolean;
};

const nullableUser: Nullable<UserData> = {
  name: null,
  age: 30,
  active: true,
};

console.log(nullableUser.name);
console.log(nullableUser.age);
console.log(nullableUser.active);

// ---------------------------------------------------------------------
// 14. Creating a boolean flags type
// ---------------------------------------------------------------------

type Features = {
  darkMode: unknown;
  notifications: unknown;
  analytics: unknown;
};

type FeatureFlags<T> = {
  [K in keyof T]: boolean;
};

const featureFlags: FeatureFlags<Features> = {
  darkMode: true,
  notifications: false,
  analytics: true,
};

console.log(featureFlags.darkMode);
console.log(featureFlags.notifications);
console.log(featureFlags.analytics);

// ---------------------------------------------------------------------
// 15. Mapping function properties
// ---------------------------------------------------------------------

type Fields = {
  username: string;
  email: string;
  age: number;
};

type Validators<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

const validators: Validators<Fields> = {
  username: (value) => value.length > 0,
  email: (value) => value.includes("@"),
  age: (value) => value >= 18,
};

console.log(validators.username("john"));
console.log(validators.email("john@example.com"));
console.log(validators.age(30));

// ---------------------------------------------------------------------
// 16. Mapped types with keyof and indexed access
// ---------------------------------------------------------------------

type ApiUser = {
  id: number;
  name: string;
  email: string;
};

type PropertyTypes<T> = {
  [K in keyof T]: T[K];
};

type ApiUserProperties = PropertyTypes<ApiUser>;

const apiUser: ApiUserProperties = {
  id: 1,
  name: "John",
  email: "john@example.com",
};

console.log(apiUser.id);
console.log(apiUser.name);
console.log(apiUser.email);

// `T[K]` retrieves the type of the current property K from T.

// ---------------------------------------------------------------------
// 17. Filtering properties with conditional types
// ---------------------------------------------------------------------

type MixedObject = {
  id: number;
  name: string;
  active: boolean;
  score: number;
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type StringProperties<T> = {
  [K in StringKeys<T>]: T[K];
};

type MixedStrings = StringProperties<MixedObject>;

const strings: MixedStrings = {
  name: "John",
};

console.log(strings.name);

// ---------------------------------------------------------------------
// 18. Filtering number properties
// ---------------------------------------------------------------------

type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type NumberProperties<T> = {
  [K in NumberKeys<T>]: T[K];
};

type NumericData = NumberProperties<MixedObject>;

const numericData: NumericData = {
  id: 1,
  score: 95,
};

console.log(numericData.id);
console.log(numericData.score);

// ---------------------------------------------------------------------
// 19. Excluding properties
// ---------------------------------------------------------------------

type PublicUser = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type WithoutPassword<T> = {
  [K in keyof T as K extends "password" ? never : K]: T[K];
};

type SafeUser = WithoutPassword<PublicUser>;

const safeUser: SafeUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
};

console.log(safeUser.id);
console.log(safeUser.name);
console.log(safeUser.email);

// ---------------------------------------------------------------------
// 20. Key remapping with as
// ---------------------------------------------------------------------

type Person = {
  name: string;
  age: number;
};

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

const personGetters: Getters<Person> = {
  getName: () => "John",
  getAge: () => 30,
};

console.log(personGetters.getName());
console.log(personGetters.getAge());

// ---------------------------------------------------------------------
// 21. Key remapping to create setters
// ---------------------------------------------------------------------

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

const personSetters: Setters<Person> = {
  setName: (value) => console.log(value),
  setAge: (value) => console.log(value),
};

personSetters.setName("John");
personSetters.setAge(30);

// ---------------------------------------------------------------------
// 22. Key remapping with filtering
// ---------------------------------------------------------------------

type InternalData = {
  id: number;
  name: string;
  _debug: boolean;
};

type PublicData<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

type CleanData = PublicData<InternalData>;

const cleanData: CleanData = {
  id: 1,
  name: "John",
};

console.log(cleanData.id);
console.log(cleanData.name);

// ---------------------------------------------------------------------
// 23. Template literal keys
// ---------------------------------------------------------------------

type EventNames = "click" | "focus" | "blur";

type EventHandlers = {
  [K in EventNames as `on${Capitalize<K>}`]: () => void;
};

const handlers: EventHandlers = {
  onClick: () => console.log("click"),
  onFocus: () => console.log("focus"),
  onBlur: () => console.log("blur"),
};

handlers.onClick();
handlers.onFocus();
handlers.onBlur();

// ---------------------------------------------------------------------
// 24. Mapped types with discriminated unions
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

type ShapeMap = {
  [K in Shape as K["kind"]]: K;
};

const shapes: ShapeMap = {
  circle: {
    kind: "circle",
    radius: 10,
  },
  square: {
    kind: "square",
    side: 20,
  },
};

console.log(shapes.circle.radius);
console.log(shapes.square.side);

// ---------------------------------------------------------------------
// 25. Mapping over object keys for React-style props
// ---------------------------------------------------------------------

type InputValues = {
  username: string;
  email: string;
  age: number;
};

type InputHandlers<T> = {
  [K in keyof T]: (value: T[K]) => void;
};

const inputHandlers: InputHandlers<InputValues> = {
  username: (value) => console.log(value),
  email: (value) => console.log(value),
  age: (value) => console.log(value),
};

inputHandlers.username("john");
inputHandlers.email("john@example.com");
inputHandlers.age(30);

// ---------------------------------------------------------------------
// 26. Mapped types for form state
// ---------------------------------------------------------------------

type FormData = {
  username: string;
  email: string;
  password: string;
};

type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
  };
};

const formState: FormState<FormData> = {
  username: {
    value: "johndoe",
    error: null,
  },
  email: {
    value: "john@example.com",
    error: null,
  },
  password: {
    value: "secret",
    error: null,
  },
};

console.log(formState.username.value);
console.log(formState.email.value);
console.log(formState.password.value);

// ---------------------------------------------------------------------
// 27. Mapped types are type-level transformations
// ---------------------------------------------------------------------

type Original = {
  name: string;
  age: number;
};

type Transformed = {
  readonly [K in keyof Original]?: Original[K];
};

const transformed: Transformed = {
  name: "John",
};

console.log(transformed.name);
console.log(transformed.age);

// Mapped types do not transform JavaScript objects at runtime.
// They only describe the resulting type to TypeScript.

// ---------------------------------------------------------------------
// 28. Built-in utility types are mapped-type patterns
// ---------------------------------------------------------------------

type UserSettings = {
  theme: string;
  language: string;
  notifications: boolean;
};

type PartialSettings = Partial<UserSettings>;
type RequiredSettings = Required<PartialSettings>;
type ReadonlySettings = Readonly<UserSettings>;

const partialSettings: PartialSettings = {
  theme: "dark",
};

const requiredSettings: RequiredSettings = {
  theme: "dark",
  language: "en",
  notifications: true,
};

const readonlySettings: ReadonlySettings = {
  theme: "light",
  language: "en",
  notifications: false,
};

console.log(partialSettings.theme);
console.log(requiredSettings.language);
console.log(readonlySettings.notifications);

// `Partial`, `Required`, and `Readonly` are based on mapped-type syntax.

// ---------------------------------------------------------------------
// 29. Choosing mapped types
// ---------------------------------------------------------------------

// Use a mapped type when:
// - You need to transform every property of an existing type.
// - You need to preserve the original keys while changing their values.
// - You need to add or remove readonly/optional modifiers.
// - You need to generate keys from another union.
// - You need to filter or rename properties.
// - You need a reusable type-level transformation.

// Common patterns:
//
// type Optional<T> = {
//   [K in keyof T]?: T[K];
// };
//
// type Readonly<T> = {
//   readonly [K in keyof T]: T[K];
// };
//
// type Mutable<T> = {
//   -readonly [K in keyof T]: T[K];
// };

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// Mapped types transform object types by iterating over their keys.
//
// type Optional<T> = {
//   [K in keyof T]?: T[K];
// };
//
// Important syntax:
//
// `keyof T`              -> obtains the keys of T.
// `[K in keyof T]`       -> iterates over those keys.
// `T[K]`                 -> gets the value type for the current key.
// `readonly`             -> adds a readonly modifier.
// `-readonly`            -> removes a readonly modifier.
// `?`                    -> adds an optional modifier.
// `-?`                   -> removes an optional modifier.
// `as`                   -> remaps or filters keys.
//
// Mapped types are the foundation for many TypeScript utility types and are
// particularly useful when building reusable APIs, configuration objects,
// form types, state models, and React component props.

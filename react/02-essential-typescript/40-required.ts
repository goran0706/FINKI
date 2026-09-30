/**
 * Required
 * ========
 *
 * The `Required<T>` utility type removes optional modifiers from all
 * properties of an object type. It is useful when a partially defined type
 * must become fully populated.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

type User = {
  name: string;
  age?: number;
  email?: string;
};

type RequiredUser = Required<User>;

const user: RequiredUser = {
  name: "John",
  age: 30,
  email: "john@example.com",
};

console.log(user.name);
console.log(user.age);
console.log(user.email);

// `Required<User>` changes:
// age?: number   -> age: number
// email?: string -> email: string

// ---------------------------------------------------------------------
// 2. Optional properties become required
// ---------------------------------------------------------------------

type Settings = {
  theme?: string;
  language?: string;
  notifications?: boolean;
};

type CompleteSettings = Required<Settings>;

const settings: CompleteSettings = {
  theme: "dark",
  language: "en",
  notifications: true,
};

console.log(settings.theme);
console.log(settings.language);
console.log(settings.notifications);

// All properties must now be present.

// ---------------------------------------------------------------------
// 3. Missing required properties cause errors
// ---------------------------------------------------------------------

type Profile = {
  username: string;
  bio?: string;
  avatar?: string;
};

type CompleteProfile = Required<Profile>;

const profile: CompleteProfile = {
  username: "johndoe",
  bio: "Frontend developer",
  avatar: "/images/avatar.png",
};

console.log(profile.username);
console.log(profile.bio);
console.log(profile.avatar);

// This would be invalid:
//
// const incompleteProfile: CompleteProfile = {
//   username: "johndoe",
// };
//
// Error: bio and avatar are required.

// ---------------------------------------------------------------------
// 4. Required preserves property types
// ---------------------------------------------------------------------

type Product = {
  name?: string;
  price?: number;
  available?: boolean;
};

type CompleteProduct = Required<Product>;

const product: CompleteProduct = {
  name: "Laptop",
  price: 999,
  available: true,
};

const productName: string = product.name;
const productPrice: number = product.price;
const productAvailable: boolean = product.available;

console.log(productName);
console.log(productPrice);
console.log(productAvailable);

// `Required<T>` changes optionality, not the underlying property types.

// ---------------------------------------------------------------------
// 5. Required with mixed properties
// ---------------------------------------------------------------------

type Account = {
  id: number;
  username: string;
  email?: string;
  phone?: string;
};

type CompleteAccount = Required<Account>;

const account: CompleteAccount = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  phone: "+38970123456",
};

console.log(account.id);
console.log(account.username);
console.log(account.email);
console.log(account.phone);

// Already-required properties remain required.
// Optional properties become required.

// ---------------------------------------------------------------------
// 6. Required is shallow
// ---------------------------------------------------------------------

type Address = {
  city?: string;
  country?: string;
};

type Customer = {
  name?: string;
  address?: Address;
};

type RequiredCustomer = Required<Customer>;

const customer: RequiredCustomer = {
  name: "John",
  address: {},
};

console.log(customer.name);
console.log(customer.address);

// `name` and `address` are required.
// However, `address.city` and `address.country` remain optional.
//
// Required<Customer> does not recursively make nested properties required.

// ---------------------------------------------------------------------
// 7. Making nested properties required
// ---------------------------------------------------------------------

type CompleteAddress = Required<Address>;

type CompleteCustomer = {
  name: string;
  address: CompleteAddress;
};

const completeCustomer: CompleteCustomer = {
  name: "John",
  address: {
    city: "Skopje",
    country: "North Macedonia",
  },
};

console.log(completeCustomer.name);
console.log(completeCustomer.address.city);
console.log(completeCustomer.address.country);

// ---------------------------------------------------------------------
// 8. Required with readonly properties
// ---------------------------------------------------------------------

type ReadonlySettings = {
  readonly theme?: string;
  readonly language?: string;
};

type CompleteReadonlySettings = Required<ReadonlySettings>;

const readonlySettings: CompleteReadonlySettings = {
  theme: "dark",
  language: "en",
};

console.log(readonlySettings.theme);
console.log(readonlySettings.language);

// `Required` removes optionality but preserves readonly.
//
// readonly theme?: string
// becomes
// readonly theme: string

// ---------------------------------------------------------------------
// 9. Required does not remove readonly
// ---------------------------------------------------------------------

type ImmutableUser = {
  readonly id: number;
  readonly name?: string;
};

type CompleteImmutableUser = Required<ImmutableUser>;

const immutableUser: CompleteImmutableUser = {
  id: 1,
  name: "John",
};

console.log(immutableUser.id);
console.log(immutableUser.name);

// immutableUser.name = "Jane";
// Error: Cannot assign to 'name' because it is a read-only property.

// ---------------------------------------------------------------------
// 10. Required with union property types
// ---------------------------------------------------------------------

type Response = {
  data?: string | number;
  status?: "success" | "error";
};

type CompleteResponse = Required<Response>;

const response: CompleteResponse = {
  data: "Success",
  status: "success",
};

console.log(response.data);
console.log(response.status);

// Required does not narrow union types.
// It only removes the optional modifier.

// ---------------------------------------------------------------------
// 11. Required with nullable properties
// ---------------------------------------------------------------------

type UserProfile = {
  name?: string;
  avatar?: string | null;
};

type CompleteUserProfile = Required<UserProfile>;

const profileWithNullAvatar: CompleteUserProfile = {
  name: "John",
  avatar: null,
};

console.log(profileWithNullAvatar.name);
console.log(profileWithNullAvatar.avatar);

// `avatar` must exist, but its value can still be null.
//
// Optional:
// avatar?: string | null
//
// Required:
// avatar: string | null

// ---------------------------------------------------------------------
// 12. Required and undefined
// ---------------------------------------------------------------------

type Data = {
  value?: string | undefined;
};

type RequiredData = Required<Data>;

const data: RequiredData = {
  value: undefined,
};

console.log(data.value);

// `Required` removes the optional property modifier.
// The explicit `undefined` in the property type remains relevant.

// ---------------------------------------------------------------------
// 13. Required with function properties
// ---------------------------------------------------------------------

type Handlers = {
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
};

type CompleteHandlers = Required<Handlers>;

const handlers: CompleteHandlers = {
  onSubmit: (value) => console.log(value),
  onCancel: () => console.log("Cancelled"),
};

handlers.onSubmit("Form submitted");
handlers.onCancel();

// ---------------------------------------------------------------------
// 14. React-style component props
// ---------------------------------------------------------------------

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
};

type CompleteButtonProps = Required<ButtonProps>;

const buttonProps: CompleteButtonProps = {
  label: "Save",
  variant: "primary",
  disabled: false,
  onClick: () => console.log("Saved"),
};

console.log(buttonProps.label);
console.log(buttonProps.variant);
console.log(buttonProps.disabled);

buttonProps.onClick();

// ---------------------------------------------------------------------
// 15. Required after Partial
// ---------------------------------------------------------------------

type FormData = {
  username: string;
  email: string;
  password: string;
};

type PartialFormData = Partial<FormData>;
type RequiredFormData = Required<PartialFormData>;

const formData: RequiredFormData = {
  username: "johndoe",
  email: "john@example.com",
  password: "secret",
};

console.log(formData.username);
console.log(formData.email);
console.log(formData.password);

// Partial<T> makes all properties optional.
// Required<T> can reverse that transformation.

// ---------------------------------------------------------------------
// 16. Required with Partial in a workflow
// ---------------------------------------------------------------------

type ProductForm = {
  name: string;
  price: number;
  description: string;
};

function createDraft(): Partial<ProductForm> {
  return {
    name: "Laptop",
    price: 999,
  };
}

function saveProduct(product: Required<ProductForm>): void {
  console.log(product.name);
  console.log(product.price);
  console.log(product.description);
}

const draft = createDraft();

const completedProduct: Required<ProductForm> = {
  ...draft,
  description: "A laptop computer",
};

saveProduct(completedProduct);

// ---------------------------------------------------------------------
// 17. Required with Pick
// ---------------------------------------------------------------------

type Employee = {
  id: number;
  name: string;
  department?: string;
  manager?: string;
};

type RequiredEmployeeDetails = Required<Pick<Employee, "department" | "manager">>;

const employeeDetails: RequiredEmployeeDetails = {
  department: "Engineering",
  manager: "Jane",
};

console.log(employeeDetails.department);
console.log(employeeDetails.manager);

// Utility types can be composed.
// `Pick` selects properties, then `Required` makes those selected
// properties mandatory.

// ---------------------------------------------------------------------
// 18. Required with Omit
// ---------------------------------------------------------------------

type UserAccount = {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
};

type RequiredPublicAccount = Required<Omit<UserAccount, "id">>;

const publicAccount: RequiredPublicAccount = {
  username: "johndoe",
  email: "john@example.com",
  avatar: "/avatar.png",
};

console.log(publicAccount.username);
console.log(publicAccount.email);
console.log(publicAccount.avatar);

// `Omit` removes properties first.
// `Required` then makes all remaining properties required.

// ---------------------------------------------------------------------
// 19. Required with Record
// ---------------------------------------------------------------------

type Permission = "read" | "write" | "delete";

type Permissions = {
  read?: boolean;
  write?: boolean;
  delete?: boolean;
};

type CompletePermissions = Required<Permissions>;

const permissions: CompletePermissions = {
  read: true,
  write: false,
  delete: false,
};

console.log(permissions.read);
console.log(permissions.write);
console.log(permissions.delete);

// ---------------------------------------------------------------------
// 20. Required with mapped types
// ---------------------------------------------------------------------

type RequiredType<T> = {
  [K in keyof T]-?: T[K];
};

type Options = {
  debug?: boolean;
  timeout?: number;
};

type CompleteOptions = RequiredType<Options>;

const options: CompleteOptions = {
  debug: true,
  timeout: 5000,
};

console.log(options.debug);
console.log(options.timeout);

// `Required<T>` is essentially this mapped-type transformation:
//
// type Required<T> = {
//   [P in keyof T]-?: T[P];
// };
//
// The `-?` removes the optional modifier.

// ---------------------------------------------------------------------
// 21. Required and index signatures
// ---------------------------------------------------------------------

type Dictionary = {
  [key: string]: string;
  title?: string;
};

// An optional named property must still be compatible with the index
// signature's value type.

type CompleteDictionary = Required<Dictionary>;

const dictionary: CompleteDictionary = {
  title: "Products",
  item1: "Laptop",
  item2: "Keyboard",
};

console.log(dictionary.title);
console.log(dictionary.item1);
console.log(dictionary.item2);

// ---------------------------------------------------------------------
// 22. Required with discriminated unions
// ---------------------------------------------------------------------

type Result =
  | {
      kind: "success";
      data?: string;
    }
  | {
      kind: "error";
      message?: string;
    };

type RequiredResult = Required<Result>;

const success: RequiredResult = {
  kind: "success",
  data: "Loaded",
};

const error: RequiredResult = {
  kind: "error",
  message: "Request failed",
};

console.log(success.kind);
console.log(success.data);
console.log(error.kind);
console.log(error.message);

// ---------------------------------------------------------------------
// 23. Required is useful at API boundaries
// ---------------------------------------------------------------------

type ApiConfig = {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
};

function initializeClient(config: Required<ApiConfig>): void {
  console.log(config.baseUrl);
  console.log(config.timeout);
  console.log(config.retries);
}

initializeClient({
  baseUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
});

// A configuration can be flexible while being built, then required when
// it reaches a function that needs every option to exist.

// ---------------------------------------------------------------------
// 24. Required and type inference
// ---------------------------------------------------------------------

type OptionsConfig = {
  mode?: "development" | "production";
  minify?: boolean;
};

const optionsConfig: Required<OptionsConfig> = {
  mode: "development",
  minify: false,
};

const mode = optionsConfig.mode;
const minify = optionsConfig.minify;

console.log(mode);
console.log(minify);

// Required does not remove the original value types.
// It only changes whether the properties must be present.

// ---------------------------------------------------------------------
// 25. Required is shallow by design
// ---------------------------------------------------------------------

type ApplicationConfig = {
  server?: {
    host?: string;
    port?: number;
  };
};

type RequiredApplicationConfig = Required<ApplicationConfig>;

const config: RequiredApplicationConfig = {
  server: {},
};

console.log(config.server);

// `server` is required.
// `server.host` and `server.port` are still optional.
//
// For deeply nested required properties, a custom recursive utility is
// necessary. `Required<T>` itself intentionally performs only one level.

// ---------------------------------------------------------------------
// 26. Required vs. Partial
// ---------------------------------------------------------------------

type SettingsData = {
  theme: string;
  language: string;
  notifications: boolean;
};

type PartialSettingsData = Partial<SettingsData>;
type CompleteSettingsData = Required<PartialSettingsData>;

const partialSettings: PartialSettingsData = {
  theme: "dark",
};

const completeSettings: CompleteSettingsData = {
  theme: "dark",
  language: "en",
  notifications: true,
};

console.log(partialSettings.theme);
console.log(completeSettings.language);

// Partial<T> and Required<T> represent opposite transformations:
//
// Partial<T>  -> properties become optional.
// Required<T> -> properties become required.

// ---------------------------------------------------------------------
// 27. When to use Required
// ---------------------------------------------------------------------

// Use `Required<T>` when:
// - An existing type contains optional properties.
// - A later stage of a workflow requires every property.
// - A configuration has been fully initialized.
// - A form has been completed and validated.
// - A function requires a complete object.
// - You want to compose utility types such as Pick + Required.

// Avoid using Required<T> when optionality represents a meaningful state.
// Making every property required can incorrectly model data that is
// legitimately incomplete.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// `Required<T>` removes the optional `?` modifier from every property:
//
// type User = {
//   name: string;
//   age?: number;
// };
//
// type CompleteUser = Required<User>;
//
// CompleteUser becomes:
//
// {
//   name: string;
//   age: number;
// }
//
// Key points:
// - `Required<T>` makes all properties required.
// - Existing property types are preserved.
// - `readonly` modifiers are preserved.
// - Nullable types remain nullable.
// - The transformation is shallow.
// - It can be combined with Partial, Pick, Omit, Record, and other utilities.
// - It is implemented using a mapped type with `-?`.
//
// `Required<T>` is a compile-time utility. It does not modify or validate
// JavaScript objects at runtime.

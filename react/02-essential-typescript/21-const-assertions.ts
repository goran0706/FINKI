/**
 * Const Assertions
 * ================
 *
 * Const assertions use `as const` to preserve literal types and make object
 * properties and array elements readonly instead of widening their types.
 */

// ---------------------------------------------------------------------
// 1. Basic const assertion
// ---------------------------------------------------------------------

const status = "active" as const;

console.log(status); // "active"

// Without `as const`, a mutable variable can be widened to string.
// With `as const`, the value keeps its exact literal type: "active".

// ---------------------------------------------------------------------
// 2. Literal type widening
// ---------------------------------------------------------------------

let mutableStatus = "active"; // string
const constantStatus = "active"; // "active"
const assertedStatus = "active" as const; // "active"

console.log(mutableStatus); // "active"
console.log(constantStatus); // "active"
console.log(assertedStatus); // "active"

// const declarations already preserve literal types in many primitive
// cases. `as const` becomes especially useful for objects and arrays.

// ---------------------------------------------------------------------
// 3. Const assertions on objects
// ---------------------------------------------------------------------

const user = {
  name: "John",
  role: "admin",
} as const;

console.log(user.name); // "John"
console.log(user.role); // "admin"

// `as const` makes the properties readonly and preserves their literal types.
//
// user.name = "Alice";
// Error: Cannot assign to 'name' because it is a read-only property.
//
// user.role = "user";
// Error: Cannot assign to 'role' because it is a read-only property.

// ---------------------------------------------------------------------
// 4. Object properties without as const
// ---------------------------------------------------------------------

const normalUser = {
  name: "John",
  role: "admin",
};

// The variable itself is const, but its properties remain mutable.
normalUser.name = "Alice";
normalUser.role = "user";

console.log(normalUser.name); // "Alice"
console.log(normalUser.role); // "user"

// `const` prevents reassignment of the variable.
// It does not make the object's properties readonly.

// ---------------------------------------------------------------------
// 5. Object properties with as const
// ---------------------------------------------------------------------

const readonlyUser = {
  name: "John",
  role: "admin",
} as const;

// readonlyUser.name = "Alice";
// Error: Cannot assign to 'name' because it is a read-only property.

console.log(readonlyUser.name); // "John"

// `as const` effectively gives the object deeply readonly literal properties
// for the object and nested values represented by the assertion.

// ---------------------------------------------------------------------
// 6. Const assertions on arrays
// ---------------------------------------------------------------------

const numbers = [1, 2, 3] as const;

console.log(numbers); // [1, 2, 3]
console.log(numbers[0]); // 1

// The array becomes a readonly tuple:
// readonly [1, 2, 3]

// numbers.push(4);
// Error: Property 'push' does not exist on type 'readonly [1, 2, 3]'.

// numbers[0] = 10;
// Error: Cannot assign to '0' because it is a read-only property.

// ---------------------------------------------------------------------
// 7. Regular arrays vs. readonly tuples
// ---------------------------------------------------------------------

const regularNumbers = [1, 2, 3];
const readonlyNumbers = [1, 2, 3] as const;

regularNumbers.push(4);

console.log(regularNumbers); // [1, 2, 3, 4]
console.log(readonlyNumbers); // [1, 2, 3]

// regularNumbers is inferred as number[].
// readonlyNumbers is inferred as readonly [1, 2, 3].

// ---------------------------------------------------------------------
// 8. Preserving literal element types
// ---------------------------------------------------------------------

const directions = ["up", "down", "left", "right"] as const;

console.log(directions[0]); // "up"
console.log(directions[1]); // "down"

// Without `as const`, an array of string literals is normally inferred as
// string[], losing the individual literal types.

// ---------------------------------------------------------------------
// 9. Creating a union from an as const array
// ---------------------------------------------------------------------

const roles = ["admin", "editor", "viewer"] as const;

type Role = (typeof roles)[number];

const roleA: Role = "admin";
const roleB: Role = "editor";
const roleC: Role = "viewer";

console.log(roleA); // "admin"
console.log(roleB); // "editor"
console.log(roleC); // "viewer"

// type Role becomes:
//
// "admin" | "editor" | "viewer"

// This pattern is useful when the runtime array and the TypeScript union
// should come from the same source.

// ---------------------------------------------------------------------
// 10. Preventing invalid literal values
// ---------------------------------------------------------------------

const allowedRoles = ["admin", "editor", "viewer"] as const;

type AllowedRole = (typeof allowedRoles)[number];

function setRole(role: AllowedRole): void {
  console.log(`Role: ${role}`);
}

setRole("admin"); // "Role: admin"
setRole("viewer"); // "Role: viewer"

// setRole("guest");
// Error: Argument of type '"guest"' is not assignable to parameter of type
// '"admin" | "editor" | "viewer"'.

// ---------------------------------------------------------------------
// 11. Const assertions and discriminated unions
// ---------------------------------------------------------------------

const loadingState = {
  status: "loading",
} as const;

const successState = {
  status: "success",
  data: ["John", "Alice"],
} as const;

const errorState = {
  status: "error",
  message: "Request failed",
} as const;

console.log(loadingState.status); // "loading"
console.log(successState.status); // "success"
console.log(errorState.status); // "error"

// Literal status values are useful as discriminants in union types.

type State = typeof loadingState | typeof successState | typeof errorState;

function renderState(state: State): string {
  switch (state.status) {
    case "loading":
      return "Loading...";

    case "success":
      return `Users: ${state.data.join(", ")}`;

    case "error":
      return `Error: ${state.message}`;
  }
}

console.log(renderState(loadingState)); // "Loading..."
console.log(renderState(successState)); // "Users: John, Alice"
console.log(renderState(errorState)); // "Error: Request failed"

// ---------------------------------------------------------------------
// 12. Const assertions with object literals
// ---------------------------------------------------------------------

const httpStatus = {
  ok: 200,
  notFound: 404,
  serverError: 500,
} as const;

console.log(httpStatus.ok); // 200
console.log(httpStatus.notFound); // 404
console.log(httpStatus.serverError); // 500

// The values are inferred as the numeric literals 200, 404, and 500
// rather than the broader number type.

// ---------------------------------------------------------------------
// 13. Deriving a union from object values
// ---------------------------------------------------------------------

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

const successCode: HttpStatus = 200;
const missingCode: HttpStatus = 404;

console.log(successCode); // 200
console.log(missingCode); // 404

// HttpStatus becomes:
//
// 200 | 404 | 500

// ---------------------------------------------------------------------
// 14. Deriving a union from object keys
// ---------------------------------------------------------------------

type HttpStatusName = keyof typeof HTTP_STATUS;

const statusName: HttpStatusName = "OK";

console.log(statusName); // "OK"

// keyof typeof HTTP_STATUS produces:
//
// "OK" | "NOT_FOUND" | "SERVER_ERROR"

// ---------------------------------------------------------------------
// 15. Const assertions with nested objects
// ---------------------------------------------------------------------

const applicationConfig = {
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000,
  },
  features: {
    darkMode: true,
    analytics: false,
  },
} as const;

console.log(applicationConfig.api.baseUrl); // "https://api.example.com"
console.log(applicationConfig.api.timeout); // 5000
console.log(applicationConfig.features.darkMode); // true

// Nested properties also preserve their literal types and readonly status.
//
// applicationConfig.api.timeout = 10000;
// Error: Cannot assign to 'timeout' because it is a read-only property.

// ---------------------------------------------------------------------
// 16. Const assertions and function arguments
// ---------------------------------------------------------------------

type Command = { type: "start" } | { type: "stop" } | { type: "restart" };

function executeCommand(command: Command): void {
  console.log(`Executing: ${command.type}`);
}

executeCommand({ type: "start" }); // "Executing: start"
executeCommand({ type: "stop" }); // "Executing: stop"

// A literal object passed directly to a function can often retain the
// required literal type through contextual typing.

// ---------------------------------------------------------------------
// 17. Const assertions for reusable values
// ---------------------------------------------------------------------

const startCommand = {
  type: "start",
} as const;

const stopCommand = {
  type: "stop",
} as const;

executeCommand(startCommand); // "Executing: start"
executeCommand(stopCommand); // "Executing: stop"

// The assertion is useful when the object is created separately and its
// literal properties need to remain narrow.

// ---------------------------------------------------------------------
// 18. Const assertions and mutation
// ---------------------------------------------------------------------

const settings = {
  theme: "dark",
  fontSize: 16,
} as const;

// settings.theme = "light";
// Error: Cannot assign to 'theme' because it is a read-only property.
//
// settings.fontSize = 18;
// Error: Cannot assign to 'fontSize' because it is a read-only property.

console.log(settings.theme); // "dark"
console.log(settings.fontSize); // 16

// `as const` is not just a type-narrowing feature.
// It also changes the inferred mutability of the expression.

// ---------------------------------------------------------------------
// 19. Const assertions do not freeze runtime objects
// ---------------------------------------------------------------------

const config = {
  theme: "dark",
  fontSize: 16,
} as const;

console.log(config.theme); // "dark"

// TypeScript prevents direct mutation through this type, but `as const`
// does not call Object.freeze() and does not create a runtime immutable object.

// Object.freeze() is a runtime operation:
//
// const frozenConfig = Object.freeze({
//   theme: "dark",
// });

// `as const` and Object.freeze() solve different problems.

// ---------------------------------------------------------------------
// 20. Const assertions and runtime immutability
// ---------------------------------------------------------------------

const runtimeConfig = Object.freeze({
  theme: "dark",
  fontSize: 16,
} as const);

console.log(runtimeConfig.theme); // "dark"

// `as const` provides compile-time readonly/literal typing.
// Object.freeze() provides runtime freezing semantics.

// They can be used together when both guarantees are useful.

// ---------------------------------------------------------------------
// 21. Const assertions vs. type annotations
// ---------------------------------------------------------------------

type Theme = {
  name: string;
  dark: boolean;
};

const annotatedTheme: Theme = {
  name: "dark",
  dark: true,
};

const assertedTheme = {
  name: "dark",
  dark: true,
} as const;

console.log(annotatedTheme.name); // "dark"
console.log(assertedTheme.name); // "dark"

// annotatedTheme.name is string.
// assertedTheme.name is the literal type "dark".

// The annotation describes the required shape.
// The const assertion preserves the exact values and makes them readonly.

// ---------------------------------------------------------------------
// 22. Const assertions vs. satisfies
// ---------------------------------------------------------------------

type ThemeConfig = {
  name: string;
  dark: boolean;
};

const themeWithSatisfies = {
  name: "dark",
  dark: true,
} satisfies ThemeConfig;

const themeWithConstAssertion = {
  name: "dark",
  dark: true,
} as const;

console.log(themeWithSatisfies.name); // "dark"
console.log(themeWithConstAssertion.name); // "dark"

// `satisfies` checks that a value conforms to a type while preserving
// useful inferred information.
// `as const` specifically requests literal preservation and readonly types.

// ---------------------------------------------------------------------
// 23. Combining satisfies and as const
// ---------------------------------------------------------------------

const themes = {
  dark: {
    background: "#000000",
    foreground: "#ffffff",
  },
  light: {
    background: "#ffffff",
    foreground: "#000000",
  },
} as const satisfies Record<
  string,
  {
    background: string;
    foreground: string;
  }
>;

console.log(themes.dark.background); // "#000000"
console.log(themes.light.background); // "#ffffff"

// This combination is useful when you want:
// - validation against a known structural type
// - preserved literal values
// - readonly properties

// ---------------------------------------------------------------------
// 24. Const assertions and React
// ---------------------------------------------------------------------

const buttonVariants = ["primary", "secondary", "danger"] as const;

type ButtonVariant = (typeof buttonVariants)[number];

type ButtonProps = {
  variant: ButtonVariant;
};

function getButtonClass(variant: ButtonVariant): string {
  return `button-${variant}`;
}

const buttonProps: ButtonProps = {
  variant: "primary",
};

console.log(getButtonClass(buttonProps.variant)); // "button-primary"

// This pattern works well for React props when a component should accept
// one of a finite set of string literals.

// ---------------------------------------------------------------------
// 25. React configuration objects
// ---------------------------------------------------------------------

const routes = {
  home: "/",
  profile: "/profile",
  settings: "/settings",
} as const;

type RouteName = keyof typeof routes;
type RoutePath = (typeof routes)[RouteName];

const currentRoute: RouteName = "profile";
const currentPath: RoutePath = routes[currentRoute];

console.log(currentRoute); // "profile"
console.log(currentPath); // "/profile"

// A single runtime object can provide both the values and the derived
// compile-time unions.

// ---------------------------------------------------------------------
// 26. Const assertions with tuples
// ---------------------------------------------------------------------

const coordinate = [40.7128, -74.006] as const;

console.log(coordinate[0]); // 40.7128
console.log(coordinate[1]); // -74.006

// The type is:
// readonly [40.7128, -74.006]

// This is more precise than:
// number[]

// because both the tuple length and individual literal values are known.

// ---------------------------------------------------------------------
// 27. Const assertions and function parameters
// ---------------------------------------------------------------------

function useCoordinate(coordinate: readonly [number, number]): void {
  console.log(coordinate[0], coordinate[1]);
}

const point = [10, 20] as const;

useCoordinate(point); // 10 20

// A readonly tuple can be passed to a function that only needs to read it.
// The function does not need to mutate the tuple.

// ---------------------------------------------------------------------
// 28. Const type parameters
// ---------------------------------------------------------------------

// TypeScript also supports const type parameters for preserving literal
// inference in generic functions.

function createTuple<const T extends readonly unknown[]>(values: T): T {
  return values;
}

const tuple = createTuple(["red", "green", "blue"]);

console.log(tuple); // ["red", "green", "blue"]

// A const type parameter asks TypeScript to preserve literal information
// during generic inference.

// This is related to `as const`, but the two mechanisms are used in
// different places:
// - `as const` asserts an expression
// - `const` type parameters influence generic inference

// ---------------------------------------------------------------------
// 29. When not to use as const
// ---------------------------------------------------------------------

// Do not use `as const` simply because a value happens to be declared with
// const. It is useful when literal preservation or readonly semantics are
// actually part of the intended type.

const username = "john";

console.log(username); // "john"

// For a primitive const variable, TypeScript already preserves the literal
// type in many cases, so this is usually unnecessary:
//
// const username = "john" as const;

// ---------------------------------------------------------------------
// 30. A practical literal configuration pattern
// ---------------------------------------------------------------------

const environments = {
  development: {
    url: "http://localhost:3000",
    debug: true,
  },
  production: {
    url: "https://example.com",
    debug: false,
  },
} as const;

type Environment = keyof typeof environments;

function getEnvironmentConfig(environment: Environment) {
  return environments[environment];
}

console.log(getEnvironmentConfig("development"));
// { url: "http://localhost:3000", debug: true }

console.log(getEnvironmentConfig("production"));
// { url: "https://example.com", debug: false }

// The object acts as both:
// - runtime configuration data
// - a source for compile-time literal types

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - `as const` is a const assertion that preserves literal types.
// - Object properties become readonly under a const assertion.
// - Arrays become readonly tuples with literal element types.
// - Nested object and array values retain their literal/readonly structure.
// - `const` variable declarations and `as const` are related but not identical.
// - A const declaration does not make object properties readonly.
// - `as const` is useful for discriminated unions and finite sets of values.
// - `(typeof values)[number]` can derive a union from an `as const` array.
// - `keyof typeof object` can derive a union of keys from an `as const` object.
// - `(typeof object)[keyof typeof object]` can derive a union of its values.
// - `as const` provides compile-time typing; it does not freeze objects at runtime.
// - Object.freeze() provides runtime freezing semantics.
// - `satisfies` can be combined with `as const` when both validation and literal
//   preservation are desired.
// - Const assertions are particularly useful for configuration objects,
//   discriminated unions, route maps, React props, and readonly tuples.

/**
 * satisfies
 * =========
 *
 * The `satisfies` operator validates that an expression conforms to a type
 * without changing the expression's inferred type. It is useful when you
 * want type checking while preserving specific literal and property types.
 */

// ---------------------------------------------------------------------
// 1. Basic usage
// ---------------------------------------------------------------------

type User = {
  name: string;
  age: number;
};

const user = {
  name: "John",
  age: 30,
} satisfies User;

console.log(user.name);
console.log(user.age);

// `user` keeps its inferred property types while being checked against User.
const username = user.name; // string
const age = user.age; // number

// ---------------------------------------------------------------------
// 2. satisfies vs. type annotation
// ---------------------------------------------------------------------

type Colors = {
  primary: string;
  secondary: string;
};

const annotatedColors: Colors = {
  primary: "blue",
  secondary: "gray",
};

// The annotation explicitly gives the variable the type Colors.
const primaryColor = annotatedColors.primary; // string

const checkedColors = {
  primary: "blue",
  secondary: "gray",
} satisfies Colors;

// `satisfies` validates the object but preserves its inferred property types.
const checkedPrimaryColor = checkedColors.primary; // string

// ---------------------------------------------------------------------
// 3. Detecting invalid properties
// ---------------------------------------------------------------------

type Theme = {
  light: string;
  dark: string;
};

const theme = {
  light: "#ffffff",
  dark: "#000000",
  // system: "#808080", // Error: object literal may only specify known properties.
} satisfies Theme;

console.log(theme.light);
console.log(theme.dark);

// ---------------------------------------------------------------------
// 4. satisfies preserves literal types
// ---------------------------------------------------------------------

type DirectionConfig = {
  direction: "left" | "right";
};

const config = {
  direction: "left",
} satisfies DirectionConfig;

// The property remains the specific literal type "left".
const direction = config.direction; // "left"

console.log(direction);

// ---------------------------------------------------------------------
// 5. satisfies with Record
// ---------------------------------------------------------------------

type Color = "red" | "green" | "blue";

const colorCodes = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
} satisfies Record<Color, string>;

console.log(colorCodes.red);
console.log(colorCodes.green);
console.log(colorCodes.blue);

// Missing or extra keys are checked.
// const invalidColorCodes = {
//   red: "#ff0000",
//   green: "#00ff00",
// } satisfies Record<Color, string>;

// const anotherInvalidColorCodes = {
//   red: "#ff0000",
//   green: "#00ff00",
//   blue: "#0000ff",
//   yellow: "#ffff00",
// } satisfies Record<Color, string>;

// ---------------------------------------------------------------------
// 6. satisfies with nested objects
// ---------------------------------------------------------------------

type ServerConfig = {
  host: string;
  port: number;
  security: {
    enabled: boolean;
    protocol: "http" | "https";
  };
};

const serverConfig = {
  host: "localhost",
  port: 3000,
  security: {
    enabled: true,
    protocol: "https",
  },
} satisfies ServerConfig;

console.log(serverConfig.host);
console.log(serverConfig.port);
console.log(serverConfig.security.protocol);

// ---------------------------------------------------------------------
// 7. satisfies checks nested property values
// ---------------------------------------------------------------------

type DatabaseConfig = {
  host: string;
  port: number;
  options: {
    ssl: boolean;
    timeout: number;
  };
};

const databaseConfig = {
  host: "localhost",
  port: 5432,
  options: {
    ssl: true,
    timeout: 5000,
  },
} satisfies DatabaseConfig;

// Invalid nested values are detected.
// const invalidDatabaseConfig = {
//   host: "localhost",
//   port: 5432,
//   options: {
//     ssl: "true", // Error: string is not assignable to boolean.
//     timeout: 5000,
//   },
// } satisfies DatabaseConfig;

// ---------------------------------------------------------------------
// 8. satisfies with arrays
// ---------------------------------------------------------------------

type UserRole = "admin" | "editor" | "viewer";

const roles = ["admin", "editor", "viewer"] satisfies UserRole[];

console.log(roles[0]);
console.log(roles[1]);
console.log(roles[2]);

// Invalid array elements are detected.
// const invalidRoles = ["admin", "guest"] satisfies UserRole[];

// ---------------------------------------------------------------------
// 9. satisfies with tuples
// ---------------------------------------------------------------------

type Coordinates = [number, number];

const coordinates = [10, 20] satisfies Coordinates;

console.log(coordinates[0]);
console.log(coordinates[1]);

// The tuple structure is checked.
// const invalidCoordinates = [10] satisfies Coordinates;

// ---------------------------------------------------------------------
// 10. satisfies with function properties
// ---------------------------------------------------------------------

type FormatterConfig = {
  format: (value: number) => string;
};

const formatterConfig = {
  format: (value) => `$${value.toFixed(2)}`,
} satisfies FormatterConfig;

console.log(formatterConfig.format(19.99));

// ---------------------------------------------------------------------
// 11. satisfies with discriminated unions
// ---------------------------------------------------------------------

type ButtonConfig =
  | {
      kind: "button";
      label: string;
    }
  | {
      kind: "link";
      label: string;
      href: string;
    };

const button = {
  kind: "button",
  label: "Save",
} satisfies ButtonConfig;

const link = {
  kind: "link",
  label: "Documentation",
  href: "/docs",
} satisfies ButtonConfig;

console.log(button.kind);
console.log(button.label);
console.log(link.kind);
console.log(link.href);

// ---------------------------------------------------------------------
// 12. satisfies helps preserve useful property information
// ---------------------------------------------------------------------

type ComponentConfig = {
  type: "button" | "input";
  required: boolean;
};

const component = {
  type: "button",
  required: true,
} satisfies ComponentConfig;

// `component.type` remains the specific literal "button".
if (component.type === "button") {
  console.log("Button component");
}

// ---------------------------------------------------------------------
// 13. satisfies vs. as
// ---------------------------------------------------------------------

type RequestMethod = "GET" | "POST";

const methodWithSatisfies = "GET" satisfies RequestMethod;

// `as` is an assertion: it tells TypeScript to treat the value as a type.
const methodWithAssertion = "GET" as RequestMethod;

console.log(methodWithSatisfies);
console.log(methodWithAssertion);

// `satisfies` checks compatibility instead of simply asserting it.
// const invalidMethod = "DELETE" satisfies RequestMethod;

// An assertion can also be used to override the compiler's understanding.
// `satisfies` is generally preferable when the goal is validation.

// ---------------------------------------------------------------------
// 14. satisfies vs. as const
// ---------------------------------------------------------------------

type Status = "idle" | "loading" | "success" | "error";

const status = "loading" as const;
const checkedStatus = "loading" satisfies Status;

console.log(status);
console.log(checkedStatus);

// `as const` preserves literal types and makes object/array properties readonly.
// `satisfies` validates against another type while preserving inference.

const settings = {
  mode: "dark",
  compact: true,
} as const;

type Settings = {
  mode: "dark" | "light";
  compact: boolean;
};

const checkedSettings = {
  mode: "dark",
  compact: true,
} satisfies Settings;

console.log(settings.mode);
console.log(checkedSettings.mode);

// ---------------------------------------------------------------------
// 15. Combining satisfies with as const
// ---------------------------------------------------------------------

type Route = {
  path: string;
  method: "GET" | "POST";
};

const routes = {
  home: {
    path: "/",
    method: "GET",
  },
  users: {
    path: "/users",
    method: "GET",
  },
  createUser: {
    path: "/users",
    method: "POST",
  },
} as const satisfies Record<string, Route>;

console.log(routes.home.path);
console.log(routes.users.method);
console.log(routes.createUser.method);

// `as const` preserves readonly literal values.
// `satisfies` validates that every route conforms to Route.

// ---------------------------------------------------------------------
// 16. React-style configuration
// ---------------------------------------------------------------------

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonStyle = {
  background: string;
  color: string;
};

const buttonStyles = {
  primary: {
    background: "#2563eb",
    color: "#ffffff",
  },
  secondary: {
    background: "#e5e7eb",
    color: "#111827",
  },
  danger: {
    background: "#dc2626",
    color: "#ffffff",
  },
} satisfies Record<ButtonVariant, ButtonStyle>;

console.log(buttonStyles.primary.background);
console.log(buttonStyles.danger.color);

// ---------------------------------------------------------------------
// 17. Configuration maps with different inferred values
// ---------------------------------------------------------------------

type RouteDefinition = {
  path: string;
  method: "GET" | "POST";
};

const routeDefinitions = {
  users: {
    path: "/users",
    method: "GET",
  },
  createUser: {
    path: "/users",
    method: "POST",
  },
} as const satisfies Record<string, RouteDefinition>;

console.log(routeDefinitions.users.path);
console.log(routeDefinitions.createUser.method);

// The exact keys remain available for keyof.
type RouteName = keyof typeof routeDefinitions;

const routeName: RouteName = "users";

console.log(routeName);

// ---------------------------------------------------------------------
// 18. satisfies with optional properties
// ---------------------------------------------------------------------

type CardConfig = {
  title: string;
  description?: string;
  featured?: boolean;
};

const card = {
  title: "TypeScript",
  featured: true,
} satisfies CardConfig;

console.log(card.title);
console.log(card.featured);

// Unknown properties are still rejected.
// const invalidCard = {
//   title: "TypeScript",
//   colour: "blue",
// } satisfies CardConfig;

// ---------------------------------------------------------------------
// 19. satisfies with readonly data
// ---------------------------------------------------------------------

type Permission = "read" | "write" | "delete";

const permissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
} as const satisfies Record<"admin" | "editor" | "viewer", readonly Permission[]>;

console.log(permissions.admin);
console.log(permissions.viewer);

// ---------------------------------------------------------------------
// 20. Deriving types from a satisfies object
// ---------------------------------------------------------------------

type PageConfig = {
  title: string;
  path: string;
};

const pages = {
  home: {
    title: "Home",
    path: "/",
  },
  about: {
    title: "About",
    path: "/about",
  },
  contact: {
    title: "Contact",
    path: "/contact",
  },
} as const satisfies Record<string, PageConfig>;

type PageName = keyof typeof pages;

const currentPage: PageName = "home";

console.log(currentPage);
console.log(pages[currentPage].title);

// ---------------------------------------------------------------------
// 21. satisfies does not change runtime behavior
// ---------------------------------------------------------------------

type Environment = {
  name: string;
  production: boolean;
};

const environment = {
  name: "development",
  production: false,
} satisfies Environment;

console.log(environment);

// `satisfies` exists only for TypeScript's type checking.
// It is removed when TypeScript is compiled to JavaScript.

// ---------------------------------------------------------------------
// 22. Practical use: strongly typed application configuration
// ---------------------------------------------------------------------

type AppConfig = {
  apiUrl: string;
  timeout: number;
  features: {
    darkMode: boolean;
    notifications: boolean;
  };
};

const appConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  features: {
    darkMode: true,
    notifications: false,
  },
} satisfies AppConfig;

console.log(appConfig.apiUrl);
console.log(appConfig.timeout);
console.log(appConfig.features.darkMode);
console.log(appConfig.features.notifications);

// ---------------------------------------------------------------------
// 23. When to use satisfies
// ---------------------------------------------------------------------

// Use `satisfies` when you want to:
// - Validate an object against a known type.
// - Detect missing or extra properties.
// - Preserve specific inferred property types.
// - Validate configuration objects and lookup tables.
// - Combine validation with `as const`.
// - Keep precise keys, values, and discriminants for later type derivation.

// Use a type annotation when you intentionally want the variable to have
// exactly the annotated type rather than preserving its narrower inference.

// Use `as` when you have established information that TypeScript cannot infer
// and a type assertion is actually required.

// Use `as const` when the primary goal is preserving literal values and
// making object properties or array elements readonly.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// `satisfies` checks whether an expression conforms to a type without
// replacing the expression's inferred type with that target type.
//
// const config = {
//   mode: "dark",
// } satisfies { mode: "dark" | "light" };
//
// It is particularly useful for typed configuration objects, route maps,
// lookup tables, React component configuration, and other structured data.
//
// The key distinction is:
//
// Type annotation  -> assigns the variable the specified type.
// `as`             -> asserts a type to TypeScript.
// `as const`       -> preserves literal values and readonly properties.
// `satisfies`      -> validates compatibility while preserving inference.

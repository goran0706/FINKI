/**
 * ReturnType
 * ==========
 *
 * ReturnType<T> extracts the return type of a function type. It is useful
 * when a type should stay synchronized with an existing function's output.
 */

// ---------------------------------------------------------------------
// 1. Basic ReturnType
// ---------------------------------------------------------------------

function getUsername() {
  return "johndoe";
}

type Username = ReturnType<typeof getUsername>;

const username: Username = "janedoe";

console.log(username);

// ---------------------------------------------------------------------
// 2. Returning a number
// ---------------------------------------------------------------------

function getAge() {
  return 30;
}

type Age = ReturnType<typeof getAge>;

const age: Age = 25;

console.log(age);

// ---------------------------------------------------------------------
// 3. Returning a boolean
// ---------------------------------------------------------------------

function isAuthenticated() {
  return true;
}

type AuthenticationState = ReturnType<typeof isAuthenticated>;

const authenticated: AuthenticationState = false;

console.log(authenticated);

// ---------------------------------------------------------------------
// 4. Returning an object
// ---------------------------------------------------------------------

function createUser() {
  return {
    id: 1,
    username: "johndoe",
    isAdmin: false,
  };
}

type User = ReturnType<typeof createUser>;

const user: User = {
  id: 2,
  username: "janedoe",
  isAdmin: true,
};

console.log(user);

// ---------------------------------------------------------------------
// 5. Returning an array
// ---------------------------------------------------------------------

function getTags() {
  return ["typescript", "react", "javascript"];
}

type Tags = ReturnType<typeof getTags>;

const tags: Tags = ["typescript", "react"];

console.log(tags);

// ---------------------------------------------------------------------
// 6. Returning a tuple
// ---------------------------------------------------------------------

function getCoordinates() {
  return [100, 200] as const;
}

type Coordinates = ReturnType<typeof getCoordinates>;

const coordinates: Coordinates = [50, 75];

console.log(coordinates);

// ---------------------------------------------------------------------
// 7. Returning null
// ---------------------------------------------------------------------

function clearSelection() {
  return null;
}

type Selection = ReturnType<typeof clearSelection>;

const selection: Selection = null;

console.log(selection);

// ---------------------------------------------------------------------
// 8. Returning undefined
// ---------------------------------------------------------------------

function logMessage(message: string) {
  console.log(message);
}

type LogResult = ReturnType<typeof logMessage>;

const logResult: LogResult = undefined;

console.log(logResult);

// ---------------------------------------------------------------------
// 9. Explicit return types
// ---------------------------------------------------------------------

function getVersion(): string {
  return "1.0.0";
}

type Version = ReturnType<typeof getVersion>;

const version: Version = "2.0.0";

console.log(version);

// ---------------------------------------------------------------------
// 10. Union return types
// ---------------------------------------------------------------------

function getValue(success: boolean): string | number {
  return success ? "success" : 404;
}

type Value = ReturnType<typeof getValue>;

let value: Value = "success";
value = 404;

console.log(value);

// ---------------------------------------------------------------------
// 11. Conditional return types
// ---------------------------------------------------------------------

function getData(isAdmin: boolean) {
  if (isAdmin) {
    return {
      role: "admin",
      permissions: ["read", "write", "delete"],
    };
  }

  return {
    role: "user",
    permissions: ["read"],
  };
}

type Data = ReturnType<typeof getData>;

const data: Data = {
  role: "admin",
  permissions: ["read", "write", "delete"],
};

console.log(data);

// ---------------------------------------------------------------------
// 12. ReturnType with function type aliases
// ---------------------------------------------------------------------

type CreateUser = () => {
  id: number;
  username: string;
};

type CreatedUser = ReturnType<CreateUser>;

const createdUser: CreatedUser = {
  id: 1,
  username: "johndoe",
};

console.log(createdUser);

// ---------------------------------------------------------------------
// 13. ReturnType with function parameters
// ---------------------------------------------------------------------

type FormatUser = (
  id: number,
  username: string,
) => {
  id: number;
  username: string;
  displayName: string;
};

type FormattedUser = ReturnType<FormatUser>;

const formattedUser: FormattedUser = {
  id: 1,
  username: "johndoe",
  displayName: "John Doe",
};

console.log(formattedUser);

// ---------------------------------------------------------------------
// 14. ReturnType with callbacks
// ---------------------------------------------------------------------

type Callback = (value: string) => boolean;

type CallbackResult = ReturnType<Callback>;

const callbackResult: CallbackResult = true;

console.log(callbackResult);

// ---------------------------------------------------------------------
// 15. ReturnType with async functions
// ---------------------------------------------------------------------

async function fetchUser() {
  return {
    id: 1,
    username: "johndoe",
  };
}

type FetchUserResult = ReturnType<typeof fetchUser>;

const fetchUserResult: FetchUserResult = Promise.resolve({
  id: 1,
  username: "johndoe",
});

console.log(fetchUserResult);

// ---------------------------------------------------------------------
// 16. ReturnType and Promise
// ---------------------------------------------------------------------

type ResolvedUser = Awaited<ReturnType<typeof fetchUser>>;

const resolvedUser: ResolvedUser = {
  id: 1,
  username: "johndoe",
};

console.log(resolvedUser);

// ---------------------------------------------------------------------
// 17. ReturnType with Promise<string>
// ---------------------------------------------------------------------

async function fetchUsername() {
  return "johndoe";
}

type UsernamePromise = ReturnType<typeof fetchUsername>;
type ResolvedUsername = Awaited<UsernamePromise>;

const usernamePromise: UsernamePromise = Promise.resolve("johndoe");
const resolvedUsername: ResolvedUsername = "janedoe";

console.log(usernamePromise);
console.log(resolvedUsername);

// ---------------------------------------------------------------------
// 18. ReturnType with generic functions
// ---------------------------------------------------------------------

function createPair<T>(value: T) {
  return {
    value,
  };
}

type Pair = ReturnType<typeof createPair>;

const pair: Pair = {
  value: "hello",
};

console.log(pair);

// ---------------------------------------------------------------------
// 19. Generic return type limitation
// ---------------------------------------------------------------------

function identity<T>(value: T): T {
  return value;
}

type IdentityResult = ReturnType<typeof identity>;

const identityResult: IdentityResult = "hello";

console.log(identityResult);

// ReturnType<typeof identity> represents the generic function's return type
// after its type parameter is instantiated without a specific argument.
// For generic functions, ReturnType does not capture one particular call.

// ---------------------------------------------------------------------
// 20. ReturnType with overloaded functions
// ---------------------------------------------------------------------

function parseValue(value: string): string;
function parseValue(value: number): number;
function parseValue(value: string | number): string | number {
  return value;
}

type ParsedValue = ReturnType<typeof parseValue>;

const parsedValue: ParsedValue = 42;

console.log(parsedValue);

// ReturnType uses the last overload signature when extracting the return type.

// ---------------------------------------------------------------------
// 21. ReturnType and discriminated unions
// ---------------------------------------------------------------------

function getResponse(success: boolean) {
  if (success) {
    return {
      status: "success" as const,
      data: {
        id: 1,
        username: "johndoe",
      },
    };
  }

  return {
    status: "error" as const,
    error: "Request failed",
  };
}

type Response = ReturnType<typeof getResponse>;

const response: Response = {
  status: "success",
  data: {
    id: 1,
    username: "johndoe",
  },
};

console.log(response);

// ---------------------------------------------------------------------
// 22. Extracting a specific response variant
// ---------------------------------------------------------------------

type SuccessResponse = Extract<Response, { status: "success" }>;
type ErrorResponse = Extract<Response, { status: "error" }>;

const successResponse: SuccessResponse = {
  status: "success",
  data: {
    id: 1,
    username: "johndoe",
  },
};

const errorResponse: ErrorResponse = {
  status: "error",
  error: "Request failed",
};

console.log(successResponse);
console.log(errorResponse);

// ---------------------------------------------------------------------
// 23. ReturnType with object methods
// ---------------------------------------------------------------------

const api = {
  getUser() {
    return {
      id: 1,
      username: "johndoe",
    };
  },

  getPosts() {
    return [
      { id: 1, title: "First post" },
      { id: 2, title: "Second post" },
    ];
  },
};

type ApiUser = ReturnType<typeof api.getUser>;
type ApiPosts = ReturnType<typeof api.getPosts>;

const apiUser: ApiUser = {
  id: 2,
  username: "janedoe",
};

const apiPosts: ApiPosts = [{ id: 3, title: "Third post" }];

console.log(apiUser);
console.log(apiPosts);

// ---------------------------------------------------------------------
// 24. ReturnType for configuration factories
// ---------------------------------------------------------------------

function createConfig() {
  return {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retry: true,
  };
}

type Config = ReturnType<typeof createConfig>;

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 3000,
  retry: false,
};

console.log(config);

// ---------------------------------------------------------------------
// 25. ReturnType for React-style state factories
// ---------------------------------------------------------------------

function createInitialState() {
  return {
    user: null as User | null,
    loading: false,
    error: null as string | null,
  };
}

type InitialState = ReturnType<typeof createInitialState>;

const initialState: InitialState = {
  user: null,
  loading: true,
  error: null,
};

console.log(initialState);

// ---------------------------------------------------------------------
// 26. ReturnType for action creators
// ---------------------------------------------------------------------

function createLoginAction(username: string) {
  return {
    type: "login" as const,
    payload: {
      username,
    },
  };
}

function createLogoutAction() {
  return {
    type: "logout" as const,
  };
}

type LoginAction = ReturnType<typeof createLoginAction>;
type LogoutAction = ReturnType<typeof createLogoutAction>;

const loginAction: LoginAction = createLoginAction("johndoe");
const logoutAction: LogoutAction = createLogoutAction();

console.log(loginAction);
console.log(logoutAction);

// ---------------------------------------------------------------------
// 27. Building an action union from ReturnType
// ---------------------------------------------------------------------

type Action = LoginAction | LogoutAction;

function reduceAction(action: Action): string {
  switch (action.type) {
    case "login":
      return `Logged in as ${action.payload.username}`;

    case "logout":
      return "Logged out";
  }
}

console.log(reduceAction(loginAction));
console.log(reduceAction(logoutAction));

// ---------------------------------------------------------------------
// 28. ReturnType with higher-order functions
// ---------------------------------------------------------------------

function createFormatter() {
  return (value: number) => value.toFixed(2);
}

type Formatter = ReturnType<typeof createFormatter>;

const formatter: Formatter = (value) => value.toFixed(2);

console.log(formatter(12.5));

// ---------------------------------------------------------------------
// 29. ReturnType and nested function results
// ---------------------------------------------------------------------

function createService() {
  return {
    getUser() {
      return {
        id: 1,
        username: "johndoe",
      };
    },
  };
}

type Service = ReturnType<typeof createService>;
type ServiceUser = ReturnType<Service["getUser"]>;

const serviceUser: ServiceUser = {
  id: 2,
  username: "janedoe",
};

console.log(serviceUser);

// ---------------------------------------------------------------------
// 30. ReturnType with indexed access types
// ---------------------------------------------------------------------

const repository = {
  findUser() {
    return {
      id: 1,
      username: "johndoe",
    };
  },

  findAllUsers() {
    return [
      {
        id: 1,
        username: "johndoe",
      },
      {
        id: 2,
        username: "janedoe",
      },
    ];
  },
};

type FindUser = (typeof repository)["findUser"];
type RepositoryUser = ReturnType<FindUser>;

type FindAllUsers = (typeof repository)["findAllUsers"];
type RepositoryUsers = ReturnType<FindAllUsers>;

const repositoryUser: RepositoryUser = {
  id: 3,
  username: "alex",
};

const repositoryUsers: RepositoryUsers = [
  {
    id: 3,
    username: "alex",
  },
];

console.log(repositoryUser);
console.log(repositoryUsers);

// ---------------------------------------------------------------------
// 31. ReturnType with utility type composition
// ---------------------------------------------------------------------

function getAccount() {
  return {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    isAdmin: true,
  };
}

type Account = ReturnType<typeof getAccount>;
type AccountId = Account["id"];
type AccountWithoutId = Omit<Account, "id">;

const accountId: AccountId = 1;

const accountWithoutId: AccountWithoutId = {
  username: "johndoe",
  email: "john@example.com",
  isAdmin: true,
};

console.log(accountId);
console.log(accountWithoutId);

// ---------------------------------------------------------------------
// 32. ReturnType for reusable API contracts
// ---------------------------------------------------------------------

function loadProducts() {
  return [
    {
      id: 1,
      name: "Keyboard",
      price: 99,
    },
    {
      id: 2,
      name: "Mouse",
      price: 49,
    },
  ];
}

type Products = ReturnType<typeof loadProducts>;
type Product = Products[number];

const product: Product = {
  id: 3,
  name: "Monitor",
  price: 299,
};

console.log(product);

// ---------------------------------------------------------------------
// 33. ReturnType does not execute functions
// ---------------------------------------------------------------------

function generateId() {
  return Math.random();
}

type GeneratedId = ReturnType<typeof generateId>;

const generatedId: GeneratedId = 0.123;

console.log(generatedId);

// ReturnType only inspects the function's type.
// It has no runtime effect and does not call the function.

// ---------------------------------------------------------------------
// 34. ReturnType requires a function type
// ---------------------------------------------------------------------

type FunctionResult = ReturnType<() => string>;

const functionResult: FunctionResult = "hello";

console.log(functionResult);

// ReturnType accepts function types directly or through typeof.

// ---------------------------------------------------------------------
// 35. ReturnType and never
// ---------------------------------------------------------------------

function fail(message: string): never {
  throw new Error(message);
}

type FailureResult = ReturnType<typeof fail>;

function demonstrateFailureResult(): FailureResult {
  throw new Error("Something went wrong");
}

// The return type is never because the function never completes normally.

console.log(demonstrateFailureResult);

// ---------------------------------------------------------------------
// 36. ReturnType and void
// ---------------------------------------------------------------------

function notify(message: string): void {
  console.log(message);
}

type NotificationResult = ReturnType<typeof notify>;

const notificationResult: NotificationResult = undefined;

console.log(notificationResult);

// void means the function does not produce a usable return value.

// ---------------------------------------------------------------------
// 37. Practical React-style selector
// ---------------------------------------------------------------------

type AppState = {
  user: {
    id: number;
    username: string;
  } | null;
  theme: "light" | "dark";
  loading: boolean;
};

function selectUser(state: AppState) {
  return state.user;
}

function selectTheme(state: AppState) {
  return state.theme;
}

type SelectedUser = ReturnType<typeof selectUser>;
type SelectedTheme = ReturnType<typeof selectTheme>;

const selectedUser: SelectedUser = {
  id: 1,
  username: "johndoe",
};

const selectedTheme: SelectedTheme = "dark";

console.log(selectedUser);
console.log(selectedTheme);

// ---------------------------------------------------------------------
// 38. Practical React-style hook result
// ---------------------------------------------------------------------

function useUser() {
  return {
    user: {
      id: 1,
      username: "johndoe",
    },
    isLoading: false,
    logout() {
      console.log("Logged out");
    },
  };
}

type UseUserResult = ReturnType<typeof useUser>;

const useUserResult: UseUserResult = {
  user: {
    id: 2,
    username: "janedoe",
  },
  isLoading: true,
  logout() {
    console.log("Logged out");
  },
};

console.log(useUserResult);

// ---------------------------------------------------------------------
// 39. Practical factory pattern
// ---------------------------------------------------------------------

function createUserService() {
  return {
    findById(id: number) {
      return {
        id,
        username: "johndoe",
      };
    },

    exists(id: number) {
      return id > 0;
    },
  };
}

type UserService = ReturnType<typeof createUserService>;
type FoundUser = ReturnType<UserService["findById"]>;
type UserExists = ReturnType<UserService["exists"]>;

const foundUser: FoundUser = {
  id: 1,
  username: "johndoe",
};

const userExists: UserExists = true;

console.log(foundUser);
console.log(userExists);

// ---------------------------------------------------------------------
// 40. Key ideas
// ---------------------------------------------------------------------

// ReturnType<T> extracts the return type from a function type.
// Use typeof functionName when working with an existing function.
// ReturnType works with synchronous and asynchronous functions.
// Async functions return Promise<T>, so Awaited<ReturnType<T>> gets T.
// ReturnType does not execute the function or inspect runtime values.
// It can be combined with Extract, Awaited, keyof, indexed access, and other
// utility types to derive types directly from existing application code.

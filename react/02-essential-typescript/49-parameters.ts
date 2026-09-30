/**
 * Parameters
 * ==========
 *
 * Parameters<T> extracts a function's parameter types as a tuple. It is
 * useful for reusing function signatures and keeping related types synchronized.
 */

// ---------------------------------------------------------------------
// 1. Basic Parameters
// ---------------------------------------------------------------------

function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age}.`;
}

type GreetParameters = Parameters<typeof greet>;

const greetParameters: GreetParameters = ["John", 30];

console.log(greetParameters);

// ---------------------------------------------------------------------
// 2. Extracting a single parameter
// ---------------------------------------------------------------------

type GreetName = GreetParameters[0];
type GreetAge = GreetParameters[1];

const greetName: GreetName = "Jane";
const greetAge: GreetAge = 25;

console.log(greetName);
console.log(greetAge);

// ---------------------------------------------------------------------
// 3. Functions with no parameters
// ---------------------------------------------------------------------

function getVersion() {
  return "1.0.0";
}

type VersionParameters = Parameters<typeof getVersion>;

const versionParameters: VersionParameters = [];

console.log(versionParameters);

// ---------------------------------------------------------------------
// 4. Functions with one parameter
// ---------------------------------------------------------------------

function getUser(id: number) {
  return {
    id,
    username: "johndoe",
  };
}

type GetUserParameters = Parameters<typeof getUser>;

const getUserParameters: GetUserParameters = [1];

console.log(getUserParameters);

// ---------------------------------------------------------------------
// 5. Functions with multiple parameters
// ---------------------------------------------------------------------

function createUser(username: string, age: number, isAdmin: boolean) {
  return {
    username,
    age,
    isAdmin,
  };
}

type CreateUserParameters = Parameters<typeof createUser>;

const createUserParameters: CreateUserParameters = ["johndoe", 30, true];

console.log(createUserParameters);

// ---------------------------------------------------------------------
// 6. Parameters preserves parameter order
// ---------------------------------------------------------------------

function createAccount(id: number, username: string, active: boolean) {
  return {
    id,
    username,
    active,
  };
}

type AccountParameters = Parameters<typeof createAccount>;

const accountParameters: AccountParameters = [1, "johndoe", true];

console.log(accountParameters);

// The tuple order must match the function's parameter order.

// ---------------------------------------------------------------------
// 7. Parameter types can be accessed by index
// ---------------------------------------------------------------------

type AccountId = AccountParameters[0];
type AccountUsername = AccountParameters[1];
type AccountActive = AccountParameters[2];

const accountId: AccountId = 1;
const accountUsername: AccountUsername = "johndoe";
const accountActive: AccountActive = true;

console.log(accountId);
console.log(accountUsername);
console.log(accountActive);

// ---------------------------------------------------------------------
// 8. Rest parameters
// ---------------------------------------------------------------------

function sum(...numbers: number[]) {
  return numbers.reduce((total, number) => total + number, 0);
}

type SumParameters = Parameters<typeof sum>;

const sumParameters: SumParameters = [10, 20, 30, 40];

console.log(sumParameters);
console.log(sum(...sumParameters));

// ---------------------------------------------------------------------
// 9. Optional parameters
// ---------------------------------------------------------------------

function searchUsers(query: string, limit?: number) {
  return {
    query,
    limit,
  };
}

type SearchParameters = Parameters<typeof searchUsers>;

const searchParameters: SearchParameters = ["typescript"];
const searchParametersWithLimit: SearchParameters = ["typescript", 10];

console.log(searchParameters);
console.log(searchParametersWithLimit);

// ---------------------------------------------------------------------
// 10. Default parameters
// ---------------------------------------------------------------------

function createPagination(page: number, limit = 20) {
  return {
    page,
    limit,
  };
}

type PaginationParameters = Parameters<typeof createPagination>;

const paginationParameters: PaginationParameters = [1];
const paginationParametersWithLimit: PaginationParameters = [1, 50];

console.log(paginationParameters);
console.log(paginationParametersWithLimit);

// A default parameter is represented as an optional parameter in the
// extracted parameter tuple.

// ---------------------------------------------------------------------
// 11. Union parameter types
// ---------------------------------------------------------------------

function formatId(id: string | number) {
  return String(id);
}

type FormatIdParameters = Parameters<typeof formatId>;

const formatIdParameters: FormatIdParameters = ["user-1"];
const numericFormatIdParameters: FormatIdParameters = [100];

console.log(formatIdParameters);
console.log(numericFormatIdParameters);

// ---------------------------------------------------------------------
// 12. Object parameters
// ---------------------------------------------------------------------

function updateUser(user: { id: number; username: string }) {
  return user;
}

type UpdateUserParameters = Parameters<typeof updateUser>;
type UpdateUserArgument = UpdateUserParameters[0];

const updateUserArgument: UpdateUserArgument = {
  id: 1,
  username: "johndoe",
};

console.log(updateUserArgument);

// ---------------------------------------------------------------------
// 13. Function parameters with callbacks
// ---------------------------------------------------------------------

function processUser(user: { id: number; username: string }, callback: (username: string) => void) {
  callback(user.username);
}

type ProcessUserParameters = Parameters<typeof processUser>;

const processUserParameters: ProcessUserParameters = [
  {
    id: 1,
    username: "johndoe",
  },
  (username) => {
    console.log(username);
  },
];

console.log(processUserParameters);

// ---------------------------------------------------------------------
// 14. Extracting the callback parameter
// ---------------------------------------------------------------------

type ProcessUserCallback = ProcessUserParameters[1];

const processUserCallback: ProcessUserCallback = (username) => {
  console.log(`User: ${username}`);
};

console.log(processUserCallback);

// ---------------------------------------------------------------------
// 15. Function type aliases
// ---------------------------------------------------------------------

type CreateProduct = (
  name: string,
  price: number,
) => {
  name: string;
  price: number;
};

type CreateProductParameters = Parameters<CreateProduct>;

const createProductParameters: CreateProductParameters = ["Keyboard", 99];

console.log(createProductParameters);

// ---------------------------------------------------------------------
// 16. Parameters accepts function types directly
// ---------------------------------------------------------------------

type HandlerParameters = Parameters<(event: string, timestamp: number) => void>;

const handlerParameters: HandlerParameters = ["click", Date.now()];

console.log(handlerParameters);

// ---------------------------------------------------------------------
// 17. Parameters with async functions
// ---------------------------------------------------------------------

async function fetchUser(id: number, includePosts: boolean) {
  return {
    id,
    includePosts,
  };
}

type FetchUserParameters = Parameters<typeof fetchUser>;

const fetchUserParameters: FetchUserParameters = [1, true];

console.log(fetchUserParameters);

// Parameters extracts the input types only.
// The Promise return type is unrelated to Parameters.

// ---------------------------------------------------------------------
// 18. Parameters and ReturnType together
// ---------------------------------------------------------------------

function createOrder(productId: number, quantity: number) {
  return {
    productId,
    quantity,
    total: quantity * 100,
  };
}

type CreateOrderParameters = Parameters<typeof createOrder>;
type CreateOrderResult = ReturnType<typeof createOrder>;

const createOrderParameters: CreateOrderParameters = [10, 2];
const createOrderResult: CreateOrderResult = {
  productId: 10,
  quantity: 2,
  total: 200,
};

console.log(createOrderParameters);
console.log(createOrderResult);

// ---------------------------------------------------------------------
// 19. Reusing parameters with spread syntax
// ---------------------------------------------------------------------

function logUser(id: number, username: string) {
  console.log(id, username);
}

type LogUserParameters = Parameters<typeof logUser>;

const logUserArguments: LogUserParameters = [1, "johndoe"];

logUser(...logUserArguments);

// Parameters produces a tuple compatible with spread arguments.

// ---------------------------------------------------------------------
// 20. Wrapper functions
// ---------------------------------------------------------------------

function saveUser(id: number, username: string) {
  console.log(`Saving ${id}: ${username}`);
}

type SaveUserParameters = Parameters<typeof saveUser>;

function logAndSaveUser(...args: SaveUserParameters) {
  console.log("Saving user...");
  saveUser(...args);
}

logAndSaveUser(1, "johndoe");

// ---------------------------------------------------------------------
// 21. Generic wrapper functions
// ---------------------------------------------------------------------

function callFunction<T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>): ReturnType<T> {
  return fn(...args);
}

function multiply(left: number, right: number) {
  return left * right;
}

const multiplicationResult = callFunction(multiply, 5, 4);

console.log(multiplicationResult);

// Parameters and ReturnType can preserve the relationship between a
// function's arguments and its return value.

// ---------------------------------------------------------------------
// 22. Generic forwarding helper
// ---------------------------------------------------------------------

function execute<T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>) {
  return fn(...args);
}

const executionResult = execute((name: string, age: number) => `${name}: ${age}`, "John", 30);

console.log(executionResult);

// ---------------------------------------------------------------------
// 23. Extracting constructor parameters
// ---------------------------------------------------------------------

class UserAccount {
  constructor(
    public username: string,
    public isAdmin: boolean,
  ) {}
}

type UserAccountConstructorParameters = ConstructorParameters<typeof UserAccount>;

const userAccountConstructorParameters: UserAccountConstructorParameters = ["johndoe", true];

const userAccount = new UserAccount(...userAccountConstructorParameters);

console.log(userAccount);

// ConstructorParameters is the constructor equivalent of Parameters.

// ---------------------------------------------------------------------
// 24. Function overloads
// ---------------------------------------------------------------------

function parseValue(value: string): string;
function parseValue(value: number): number;
function parseValue(value: string | number): string | number {
  return value;
}

type ParseValueParameters = Parameters<typeof parseValue>;

const parseValueParameters: ParseValueParameters = [42];

console.log(parseValueParameters);

// For overloaded functions, Parameters uses the last overload signature.

// ---------------------------------------------------------------------
// 25. Parameters and discriminated unions
// ---------------------------------------------------------------------

type AppEvent = { type: "click"; x: number; y: number } | { type: "input"; value: string };

function handleEvent(event: AppEvent) {
  console.log(event.type);
}

type HandleEventParameters = Parameters<typeof handleEvent>;
type HandleEventArgument = HandleEventParameters[0];

const handleEventArgument: HandleEventArgument = {
  type: "click",
  x: 100,
  y: 200,
};

console.log(handleEventArgument);

// ---------------------------------------------------------------------
// 26. Parameters with React-style event handlers
// ---------------------------------------------------------------------

function handleChange(value: string, field: "username" | "email") {
  console.log(field, value);
}

type HandleChangeParameters = Parameters<typeof handleChange>;

const handleChangeParameters: HandleChangeParameters = ["johndoe@example.com", "email"];

console.log(handleChangeParameters);

// ---------------------------------------------------------------------
// 27. Parameters for reusable event utilities
// ---------------------------------------------------------------------

function onSubmit(
  event: {
    preventDefault(): void;
  },
  values: {
    username: string;
    password: string;
  },
) {
  event.preventDefault();
  console.log(values.username);
}

type OnSubmitParameters = Parameters<typeof onSubmit>;

function submitForm(...args: OnSubmitParameters) {
  onSubmit(...args);
}

const submitEvent = {
  preventDefault() {
    console.log("Default prevented");
  },
};

submitForm(submitEvent, {
  username: "johndoe",
  password: "secret",
});

// ---------------------------------------------------------------------
// 28. Extracting parameters from object methods
// ---------------------------------------------------------------------

const api = {
  getUser(id: number, includePosts: boolean) {
    return {
      id,
      includePosts,
    };
  },

  deleteUser(id: number) {
    return id;
  },
};

type GetUserParameters = Parameters<typeof api.getUser>;
type DeleteUserParameters = Parameters<typeof api.deleteUser>;

const getUserArguments: GetUserParameters = [1, true];
const deleteUserArguments: DeleteUserParameters = [1];

console.log(getUserArguments);
console.log(deleteUserArguments);

// ---------------------------------------------------------------------
// 29. Indexed access into parameter tuples
// ---------------------------------------------------------------------

function createPost(title: string, body: string, published: boolean) {
  return {
    title,
    body,
    published,
  };
}

type CreatePostParameters = Parameters<typeof createPost>;

type PostTitle = CreatePostParameters[0];
type PostBody = CreatePostParameters[1];
type PostPublished = CreatePostParameters[2];

const postTitle: PostTitle = "TypeScript";
const postBody: PostBody = "Learning utility types.";
const postPublished: PostPublished = true;

console.log(postTitle);
console.log(postBody);
console.log(postPublished);

// ---------------------------------------------------------------------
// 30. Extracting all parameter types
// ---------------------------------------------------------------------

function registerUser(username: string, age: number, role: "admin" | "user") {
  return {
    username,
    age,
    role,
  };
}

type RegisterUserParameters = Parameters<typeof registerUser>;
type RegisterUserParameter = RegisterUserParameters[number];

const firstParameter: RegisterUserParameter = "johndoe";
const secondParameter: RegisterUserParameter = 30;
const thirdParameter: RegisterUserParameter = "admin";

console.log(firstParameter);
console.log(secondParameter);
console.log(thirdParameter);

// Indexing a parameter tuple with number produces a union of its elements.

// ---------------------------------------------------------------------
// 31. Parameters and optional tuple elements
// ---------------------------------------------------------------------

function createUrl(path: string, query?: string, hash?: string) {
  return `${path}${query ?? ""}${hash ?? ""}`;
}

type CreateUrlParameters = Parameters<typeof createUrl>;

const urlParameters: CreateUrlParameters = ["/users"];
const fullUrlParameters: CreateUrlParameters = ["/users", "?page=1", "#top"];

console.log(urlParameters);
console.log(fullUrlParameters);

// ---------------------------------------------------------------------
// 32. Parameters and readonly tuples
// ---------------------------------------------------------------------

function printCoordinates(x: number, y: number) {
  console.log(x, y);
}

type CoordinateParameters = Parameters<typeof printCoordinates>;

const coordinateParameters: CoordinateParameters = [100, 200];

printCoordinates(...coordinateParameters);

// Parameters produces a tuple suitable for passing to the function.

// ---------------------------------------------------------------------
// 33. Parameters with generic constraints
// ---------------------------------------------------------------------

function getProperty<T extends object, K extends keyof T>(object: T, key: K) {
  return object[key];
}

type GetPropertyParameters = Parameters<typeof getProperty>;

const getPropertyParameters: GetPropertyParameters = [{ id: 1, username: "johndoe" }, "id"];

console.log(getPropertyParameters);

// Generic functions retain their generic function structure when inspected
// through Parameters; a specific call is still resolved through inference.

// ---------------------------------------------------------------------
// 34. Parameters and function composition
// ---------------------------------------------------------------------

function formatUsername(username: string) {
  return username.toUpperCase();
}

type FormatUsernameParameters = Parameters<typeof formatUsername>;

function applyFormatter(formatter: typeof formatUsername, ...args: FormatUsernameParameters) {
  return formatter(...args);
}

const formattedUsername = applyFormatter(formatUsername, "johndoe");

console.log(formattedUsername);

// ---------------------------------------------------------------------
// 35. Parameters with utility type composition
// ---------------------------------------------------------------------

function createProfile(username: string, email: string, age: number) {
  return {
    username,
    email,
    age,
  };
}

type ProfileParameters = Parameters<typeof createProfile>;
type ProfileArguments = Pick<
  {
    username: ProfileParameters[0];
    email: ProfileParameters[1];
    age: ProfileParameters[2];
  },
  "username" | "email"
>;

const profileArguments: ProfileArguments = {
  username: "johndoe",
  email: "john@example.com",
};

console.log(profileArguments);

// ---------------------------------------------------------------------
// 36. Building a typed logger
// ---------------------------------------------------------------------

function log(level: "info" | "warn" | "error", message: string, context?: Record<string, unknown>) {
  console.log(level, message, context);
}

type LogParameters = Parameters<typeof log>;

function logger(...args: LogParameters) {
  log(...args);
}

logger("info", "User logged in");
logger("error", "Request failed", {
  requestId: 123,
});

// ---------------------------------------------------------------------
// 37. Building a typed command runner
// ---------------------------------------------------------------------

function runCommand(command: string, args: string[]) {
  return `${command} ${args.join(" ")}`;
}

type RunCommandParameters = Parameters<typeof runCommand>;

function executeCommand(...args: RunCommandParameters) {
  return runCommand(...args);
}

const commandResult = executeCommand("npm", ["run", "build"]);

console.log(commandResult);

// ---------------------------------------------------------------------
// 38. Parameters with a function registry
// ---------------------------------------------------------------------

const commands = {
  add(left: number, right: number) {
    return left + right;
  },

  greet(name: string) {
    return `Hello ${name}`;
  },
};

type AddParameters = Parameters<typeof commands.add>;
type GreetParameters = Parameters<typeof commands.greet>;

const addArguments: AddParameters = [10, 20];
const greetArguments: GreetParameters = ["John"];

console.log(commands.add(...addArguments));
console.log(commands.greet(...greetArguments));

// ---------------------------------------------------------------------
// 39. Parameters and API wrappers
// ---------------------------------------------------------------------

async function fetchPosts(userId: number, limit: number) {
  return {
    userId,
    limit,
  };
}

type FetchPostsParameters = Parameters<typeof fetchPosts>;

async function loadPosts(...args: FetchPostsParameters) {
  return fetchPosts(...args);
}

loadPosts(1, 20).then((result) => {
  console.log(result);
});

// ---------------------------------------------------------------------
// 40. Key ideas
// ---------------------------------------------------------------------

// Parameters<T> extracts a function's parameter types as a tuple.
// Use typeof functionName to derive parameters from an existing function.
// Tuple positions preserve the original parameter order.
// Optional and rest parameters are represented in the extracted tuple.
// Parameters can be indexed to access individual parameter types.
// The resulting tuple can be spread back into the original function.
// Parameters is useful for wrappers, forwarding functions, callbacks, APIs,
// event handlers, and other abstractions that should stay type-safe.

/**
 * Awaited
 * =======
 *
 * Awaited<T> recursively unwraps Promise-like types and extracts the type
 * produced after asynchronous resolution. It is useful when working with
 * async functions, nested promises, and asynchronous API results.
 */

// ---------------------------------------------------------------------
// 1. Basic Awaited
// ---------------------------------------------------------------------

type StringPromise = Promise<string>;
type ResolvedString = Awaited<StringPromise>;

const resolvedString: ResolvedString = "hello";

console.log(resolvedString);

// ---------------------------------------------------------------------
// 2. Awaited with number
// ---------------------------------------------------------------------

type NumberPromise = Promise<number>;
type ResolvedNumber = Awaited<NumberPromise>;

const resolvedNumber: ResolvedNumber = 42;

console.log(resolvedNumber);

// ---------------------------------------------------------------------
// 3. Awaited with boolean
// ---------------------------------------------------------------------

type BooleanPromise = Promise<boolean>;
type ResolvedBoolean = Awaited<BooleanPromise>;

const resolvedBoolean: ResolvedBoolean = true;

console.log(resolvedBoolean);

// ---------------------------------------------------------------------
// 4. Awaited with a non-Promise type
// ---------------------------------------------------------------------

type PlainString = Awaited<string>;
type PlainNumber = Awaited<number>;

const plainString: PlainString = "hello";
const plainNumber: PlainNumber = 100;

console.log(plainString);
console.log(plainNumber);

// Awaited leaves non-Promise values unchanged.

// ---------------------------------------------------------------------
// 5. Awaited with null and undefined
// ---------------------------------------------------------------------

type NullValue = Awaited<null>;
type UndefinedValue = Awaited<undefined>;

const nullValue: NullValue = null;
const undefinedValue: UndefinedValue = undefined;

console.log(nullValue);
console.log(undefinedValue);

// ---------------------------------------------------------------------
// 6. Awaited with a union
// ---------------------------------------------------------------------

type MixedPromise = Promise<string> | Promise<number>;
type MixedValue = Awaited<MixedPromise>;

let mixedValue: MixedValue = "hello";
mixedValue = 42;

console.log(mixedValue);

// Awaited distributes across unions and unwraps each Promise member.

// ---------------------------------------------------------------------
// 7. Awaited with a mixed Promise and non-Promise union
// ---------------------------------------------------------------------

type MixedResult = Promise<string> | number | boolean;
type ResolvedMixedResult = Awaited<MixedResult>;

let resolvedMixedResult: ResolvedMixedResult = "hello";
resolvedMixedResult = 42;
resolvedMixedResult = true;

console.log(resolvedMixedResult);

// ---------------------------------------------------------------------
// 8. Nested Promises
// ---------------------------------------------------------------------

type NestedPromise = Promise<Promise<string>>;
type ResolvedNestedPromise = Awaited<NestedPromise>;

const resolvedNestedPromise: ResolvedNestedPromise = "hello";

console.log(resolvedNestedPromise);

// Awaited recursively unwraps nested Promise-like types.

// ---------------------------------------------------------------------
// 9. Multiple levels of nesting
// ---------------------------------------------------------------------

type DeepPromise = Promise<Promise<Promise<number>>>;
type ResolvedDeepPromise = Awaited<DeepPromise>;

const resolvedDeepPromise: ResolvedDeepPromise = 123;

console.log(resolvedDeepPromise);

// ---------------------------------------------------------------------
// 10. Async functions
// ---------------------------------------------------------------------

async function getUsername() {
  return "johndoe";
}

type UsernamePromise = ReturnType<typeof getUsername>;
type Username = Awaited<UsernamePromise>;

const username: Username = "janedoe";

console.log(username);

// Async functions return Promise<T>, so Awaited<ReturnType<T>> extracts T.

// ---------------------------------------------------------------------
// 11. Awaited and ReturnType together
// ---------------------------------------------------------------------

async function getUser() {
  return {
    id: 1,
    username: "johndoe",
  };
}

type UserPromise = ReturnType<typeof getUser>;
type User = Awaited<UserPromise>;

const user: User = {
  id: 2,
  username: "janedoe",
};

console.log(user);

// ---------------------------------------------------------------------
// 12. Async function returning an array
// ---------------------------------------------------------------------

async function getUsers() {
  return [
    { id: 1, username: "johndoe" },
    { id: 2, username: "janedoe" },
  ];
}

type Users = Awaited<ReturnType<typeof getUsers>>;

const users: Users = [{ id: 3, username: "alex" }];

console.log(users);

// ---------------------------------------------------------------------
// 13. Extracting an array element after Awaited
// ---------------------------------------------------------------------

type UsersResult = Awaited<ReturnType<typeof getUsers>>;
type UserElement = UsersResult[number];

const userElement: UserElement = {
  id: 1,
  username: "johndoe",
};

console.log(userElement);

// ---------------------------------------------------------------------
// 14. Async function returning an object
// ---------------------------------------------------------------------

async function fetchProfile() {
  return {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
  };
}

type Profile = Awaited<ReturnType<typeof fetchProfile>>;

const profile: Profile = {
  id: 2,
  username: "janedoe",
  email: "jane@example.com",
};

console.log(profile);

// ---------------------------------------------------------------------
// 15. Async function returning a union
// ---------------------------------------------------------------------

async function fetchValue(success: boolean) {
  if (success) {
    return "success";
  }

  return 404;
}

type FetchValue = Awaited<ReturnType<typeof fetchValue>>;

let fetchValue: FetchValue = "success";
fetchValue = 404;

console.log(fetchValue);

// ---------------------------------------------------------------------
// 16. Async function returning null
// ---------------------------------------------------------------------

async function findUser(id: number) {
  if (id > 0) {
    return {
      id,
      username: "johndoe",
    };
  }

  return null;
}

type FindUserResult = Awaited<ReturnType<typeof findUser>>;

let findUserResult: FindUserResult = {
  id: 1,
  username: "johndoe",
};

findUserResult = null;

console.log(findUserResult);

// ---------------------------------------------------------------------
// 17. Async function returning Promise explicitly
// ---------------------------------------------------------------------

function fetchUsername(): Promise<string> {
  return Promise.resolve("johndoe");
}

type FetchedUsername = Awaited<ReturnType<typeof fetchUsername>>;

const fetchedUsername: FetchedUsername = "janedoe";

console.log(fetchedUsername);

// ---------------------------------------------------------------------
// 18. Awaited with Promise.all
// ---------------------------------------------------------------------

const userPromise = Promise.resolve({
  id: 1,
  username: "johndoe",
});

const settingsPromise = Promise.resolve({
  theme: "dark" as const,
  notifications: true,
});

type UserPromiseResult = Awaited<typeof userPromise>;
type SettingsPromiseResult = Awaited<typeof settingsPromise>;

const userPromiseResult: UserPromiseResult = {
  id: 2,
  username: "janedoe",
};

const settingsPromiseResult: SettingsPromiseResult = {
  theme: "light",
  notifications: false,
};

console.log(userPromiseResult);
console.log(settingsPromiseResult);

// ---------------------------------------------------------------------
// 19. Awaited with Promise.all results
// ---------------------------------------------------------------------

const results = await Promise.all([userPromise, settingsPromise]);

type Results = typeof results;
type FirstResult = Results[0];
type SecondResult = Results[1];

const firstResult: FirstResult = {
  id: 1,
  username: "johndoe",
};

const secondResult: SecondResult = {
  theme: "dark",
  notifications: true,
};

console.log(firstResult);
console.log(secondResult);

// ---------------------------------------------------------------------
// 20. Awaited with arrays of promises
// ---------------------------------------------------------------------

type UserPromises = Array<Promise<User>>;
type ResolvedUsers = Awaited<UserPromises>;

const resolvedUsers: ResolvedUsers = [
  {
    id: 1,
    username: "johndoe",
  },
  {
    id: 2,
    username: "janedoe",
  },
];

console.log(resolvedUsers);

// Awaited unwraps the Promise members only when applied to each member type.
// Awaited<UserPromises> itself is still an array type.

// ---------------------------------------------------------------------
// 21. Awaited and optional values
// ---------------------------------------------------------------------

type OptionalPromise = Promise<string> | undefined;
type OptionalValue = Awaited<OptionalPromise>;

let optionalValue: OptionalValue = "hello";
optionalValue = undefined;

console.log(optionalValue);

// ---------------------------------------------------------------------
// 22. Awaited and nullish values
// ---------------------------------------------------------------------

type NullablePromise = Promise<number> | null;
type NullableValue = Awaited<NullablePromise>;

let nullableValue: NullableValue = 42;
nullableValue = null;

console.log(nullableValue);

// ---------------------------------------------------------------------
// 23. Awaited with discriminated unions
// ---------------------------------------------------------------------

type ApiResponse =
  | Promise<{
      status: "success";
      data: string;
    }>
  | Promise<{
      status: "error";
      error: string;
    }>;

type ResolvedApiResponse = Awaited<ApiResponse>;

const successResponse: ResolvedApiResponse = {
  status: "success",
  data: "User loaded",
};

const errorResponse: ResolvedApiResponse = {
  status: "error",
  error: "Request failed",
};

console.log(successResponse);
console.log(errorResponse);

// ---------------------------------------------------------------------
// 24. Extracting a specific resolved variant
// ---------------------------------------------------------------------

type SuccessResponse = Extract<ResolvedApiResponse, { status: "success" }>;

type ErrorResponse = Extract<ResolvedApiResponse, { status: "error" }>;

const success: SuccessResponse = {
  status: "success",
  data: "User loaded",
};

const error: ErrorResponse = {
  status: "error",
  error: "Request failed",
};

console.log(success);
console.log(error);

// ---------------------------------------------------------------------
// 25. Awaited with Promise-like values
// ---------------------------------------------------------------------

type Thenable<T> = {
  then(onfulfilled: (value: T) => unknown): unknown;
};

type ResolvedThenable = Awaited<Thenable<string>>;

const resolvedThenable: ResolvedThenable = "hello";

console.log(resolvedThenable);

// Awaited works with Promise-like "thenable" objects, not only Promise<T>.

// ---------------------------------------------------------------------
// 26. Awaited recursively unwraps thenables
// ---------------------------------------------------------------------

type NestedThenable = Thenable<Thenable<number>>;
type ResolvedNestedThenable = Awaited<NestedThenable>;

const resolvedNestedThenable: ResolvedNestedThenable = 42;

console.log(resolvedNestedThenable);

// ---------------------------------------------------------------------
// 27. Awaited and function return values
// ---------------------------------------------------------------------

function createLoader() {
  return async () => {
    return {
      id: 1,
      username: "johndoe",
    };
  };
}

type Loader = ReturnType<typeof createLoader>;
type LoadedUser = Awaited<ReturnType<Loader>>;

const loadedUser: LoadedUser = {
  id: 2,
  username: "janedoe",
};

console.log(loadedUser);

// ---------------------------------------------------------------------
// 28. Awaited with a service method
// ---------------------------------------------------------------------

const userService = {
  async findById(id: number) {
    return {
      id,
      username: "johndoe",
    };
  },

  async exists(id: number) {
    return id > 0;
  },
};

type ServiceUser = Awaited<ReturnType<typeof userService.findById>>;

type ServiceExists = Awaited<ReturnType<typeof userService.exists>>;

const serviceUser: ServiceUser = {
  id: 1,
  username: "johndoe",
};

const serviceExists: ServiceExists = true;

console.log(serviceUser);
console.log(serviceExists);

// ---------------------------------------------------------------------
// 29. React-style hook result
// ---------------------------------------------------------------------

async function useUserData() {
  return {
    user: {
      id: 1,
      username: "johndoe",
    },
    loading: false,
  };
}

type UserData = Awaited<ReturnType<typeof useUserData>>;

const userData: UserData = {
  user: {
    id: 2,
    username: "janedoe",
  },
  loading: true,
};

console.log(userData);

// ---------------------------------------------------------------------
// 30. Awaited and API client functions
// ---------------------------------------------------------------------

async function fetchPosts(userId: number) {
  return [
    {
      id: 1,
      userId,
      title: "First post",
    },
    {
      id: 2,
      userId,
      title: "Second post",
    },
  ];
}

type Posts = Awaited<ReturnType<typeof fetchPosts>>;
type Post = Posts[number];

const post: Post = {
  id: 3,
  userId: 1,
  title: "Third post",
};

console.log(post);

// ---------------------------------------------------------------------
// 31. Awaited with nested API results
// ---------------------------------------------------------------------

async function fetchDashboard() {
  return Promise.resolve({
    user: {
      id: 1,
      username: "johndoe",
    },
    statistics: {
      posts: 10,
      followers: 100,
    },
  });
}

type Dashboard = Awaited<ReturnType<typeof fetchDashboard>>;

const dashboard: Dashboard = {
  user: {
    id: 1,
    username: "johndoe",
  },
  statistics: {
    posts: 20,
    followers: 150,
  },
};

console.log(dashboard);

// ---------------------------------------------------------------------
// 32. Awaited and Promise<void>
// ---------------------------------------------------------------------

async function saveUser(): Promise<void> {
  console.log("User saved");
}

type SaveUserResult = Awaited<ReturnType<typeof saveUser>>;

const saveUserResult: SaveUserResult = undefined;

console.log(saveUserResult);

// Awaited<Promise<void>> is void.

// ---------------------------------------------------------------------
// 33. Awaited and Promise<never>
// ---------------------------------------------------------------------

function failRequest(): Promise<never> {
  return Promise.reject(new Error("Request failed"));
}

type FailedRequest = Awaited<ReturnType<typeof failRequest>>;

function demonstrateFailedRequest(): FailedRequest {
  throw new Error("Request failed");
}

console.log(demonstrateFailedRequest);

// Awaited<Promise<never>> is never.

// ---------------------------------------------------------------------
// 34. Awaited compared with ReturnType
// ---------------------------------------------------------------------

async function loadSettings() {
  return {
    theme: "dark" as const,
    language: "en",
  };
}

type SettingsPromise = ReturnType<typeof loadSettings>;
type Settings = Awaited<SettingsPromise>;

const settingsPromise: SettingsPromise = Promise.resolve({
  theme: "dark",
  language: "en",
});

const settings: Settings = {
  theme: "light",
  language: "mk",
};

console.log(settingsPromise);
console.log(settings);

// ReturnType gives Promise<...>.
// Awaited<ReturnType<...>> gives the resolved value.

// ---------------------------------------------------------------------
// 35. Awaited with generic asynchronous functions
// ---------------------------------------------------------------------

async function identity<T>(value: T): Promise<T> {
  return value;
}

type IdentityPromise = ReturnType<typeof identity>;
type IdentityValue = Awaited<IdentityPromise>;

const identityValue: IdentityValue = "hello";

console.log(identityValue);

// For a generic function, the extracted type reflects the generic function's
// return structure rather than the type of one particular invocation.

// ---------------------------------------------------------------------
// 36. Awaited and union distribution
// ---------------------------------------------------------------------

type PromiseValues = Promise<string> | Promise<number> | Promise<boolean>;

type ResolvedValues = Awaited<PromiseValues>;

let resolvedValues: ResolvedValues = "hello";
resolvedValues = 42;
resolvedValues = true;

console.log(resolvedValues);

// Awaited distributes over the union and resolves each member separately.

// ---------------------------------------------------------------------
// 37. Building a reusable async result type
// ---------------------------------------------------------------------

type AsyncResult<T> = Awaited<T>;

type UserResult = AsyncResult<
  Promise<{
    id: number;
    username: string;
  }>
>;

const userResult: UserResult = {
  id: 1,
  username: "johndoe",
};

console.log(userResult);

// ---------------------------------------------------------------------
// 38. Combining Awaited with Extract
// ---------------------------------------------------------------------

type Result =
  | Promise<{
      status: "success";
      data: string;
    }>
  | Promise<{
      status: "error";
      error: string;
    }>;

type ResolvedResult = Awaited<Result>;

type ResultData = Extract<ResolvedResult, { status: "success" }>;

const resultData: ResultData = {
  status: "success",
  data: "Loaded successfully",
};

console.log(resultData);

// ---------------------------------------------------------------------
// 39. Combining Awaited with NonNullable
// ---------------------------------------------------------------------

async function findProduct(id: number) {
  if (id > 0) {
    return {
      id,
      name: "Keyboard",
    };
  }

  return null;
}

type ProductResult = Awaited<ReturnType<typeof findProduct>>;
type Product = NonNullable<ProductResult>;

const product: Product = {
  id: 1,
  name: "Keyboard",
};

console.log(product);

// Awaited resolves the Promise first.
// NonNullable then removes null and undefined from the resolved union.

// ---------------------------------------------------------------------
// 40. Key ideas
// ---------------------------------------------------------------------

// Awaited<T> recursively unwraps Promise-like values.
// Non-Promise values remain unchanged.
// Nested Promises are recursively unwrapped.
// Awaited distributes over unions.
// Awaited works with Promise-like thenable objects.
// Awaited<ReturnType<typeof asyncFunction>> extracts an async function's
// resolved value type.
// Awaited is especially useful for API results, async services, hooks,
// Promise-based utilities, and other asynchronous application code.

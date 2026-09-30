/**
 * Generic Defaults
 * ================
 *
 * Generic type parameters can have default types, allowing callers to omit
 * type arguments when a sensible default can be inferred or assumed.
 */

// ---------------------------------------------------------------------
// 1. Basic generic default
// ---------------------------------------------------------------------

type Box<T = string> = {
  value: T;
};

const stringBox: Box = {
  value: "Hello",
};

const numberBox: Box<number> = {
  value: 42,
};

console.log(stringBox.value);
console.log(numberBox.value);

// ---------------------------------------------------------------------
// 2. Generic defaults are optional
// ---------------------------------------------------------------------

type Response<T = string> = {
  data: T;
  status: number;
};

const textResponse: Response = {
  data: "Success",
  status: 200,
};

const userResponse: Response<{ id: number; name: string }> = {
  data: {
    id: 1,
    name: "John",
  },
  status: 200,
};

console.log(textResponse.data);
console.log(userResponse.data.name);

// ---------------------------------------------------------------------
// 3. Explicit type arguments override the default
// ---------------------------------------------------------------------

type Result<T = string> = {
  value: T;
  success: boolean;
};

const defaultResult: Result = {
  value: "Done",
  success: true,
};

const numericResult: Result<number> = {
  value: 100,
  success: true,
};

console.log(defaultResult.value);
console.log(numericResult.value);

// ---------------------------------------------------------------------
// 4. Generic functions with default types
// ---------------------------------------------------------------------

function identity<T = string>(value: T): T {
  return value;
}

const defaultValue = identity("Hello");
const numberValue = identity(42);

console.log(defaultValue);
console.log(numberValue);

// The argument provides enough information for TypeScript to infer T.
// The default is used when T cannot otherwise be inferred.

// ---------------------------------------------------------------------
// 5. Default used when no type argument can be inferred
// ---------------------------------------------------------------------

function createValue<T = string>(): T | undefined {
  return undefined;
}

const value = createValue();
const numericValue = createValue<number>();

console.log(value);
console.log(numericValue);

// ---------------------------------------------------------------------
// 6. Multiple generic parameters
// ---------------------------------------------------------------------

type Pair<T = string, U = number> = {
  first: T;
  second: U;
};

const defaultPair: Pair = {
  first: "Age",
  second: 30,
};

const customPair: Pair<boolean, string> = {
  first: true,
  second: "Active",
};

console.log(defaultPair.first);
console.log(defaultPair.second);
console.log(customPair.first);
console.log(customPair.second);

// ---------------------------------------------------------------------
// 7. Providing only earlier type arguments
// ---------------------------------------------------------------------

type Triple<T = string, U = number, V = boolean> = {
  first: T;
  second: U;
  third: V;
};

const customTriple: Triple<Date, number, boolean> = {
  first: new Date(),
  second: 10,
  third: true,
};

console.log(customTriple.first);
console.log(customTriple.second);
console.log(customTriple.third);

// Generic arguments are supplied from left to right.
// You cannot skip T and provide only U.
//
// For example, this is not valid:
//
// Triple<, string, boolean>

// ---------------------------------------------------------------------
// 8. Defaults can depend on earlier type parameters
// ---------------------------------------------------------------------

type KeyValue<K = string, V = K> = {
  key: K;
  value: V;
};

const stringKeyValue: KeyValue = {
  key: "name",
  value: "John",
};

const numericKeyValue: KeyValue<number> = {
  key: 1,
  value: 100,
};

const mixedKeyValue: KeyValue<number, string> = {
  key: 1,
  value: "One",
};

console.log(stringKeyValue.key);
console.log(stringKeyValue.value);
console.log(numericKeyValue.key);
console.log(numericKeyValue.value);
console.log(mixedKeyValue.key);
console.log(mixedKeyValue.value);

// ---------------------------------------------------------------------
// 9. Generic defaults with constraints
// ---------------------------------------------------------------------

type Entity = {
  id: number;
};

type Repository<T extends Entity = Entity> = {
  findById(id: number): T | undefined;
};

const entityRepository: Repository = {
  findById(id) {
    return {
      id,
    };
  },
};

type User = Entity & {
  name: string;
};

const userRepository: Repository<User> = {
  findById(id) {
    return {
      id,
      name: "John",
    };
  },
};

console.log(entityRepository.findById(1));
console.log(userRepository.findById(1));

// ---------------------------------------------------------------------
// 10. Generic defaults and constraints
// ---------------------------------------------------------------------

type ApiData = {
  id: number;
};

type ApiResponse<T extends ApiData = ApiData> = {
  data: T;
  status: number;
};

const defaultApiResponse: ApiResponse = {
  data: {
    id: 1,
  },
  status: 200,
};

const userApiResponse: ApiResponse<User> = {
  data: {
    id: 1,
    name: "John",
  },
  status: 200,
};

console.log(defaultApiResponse.data.id);
console.log(userApiResponse.data.name);

// ---------------------------------------------------------------------
// 11. Generic classes with defaults
// ---------------------------------------------------------------------

class Storage<T = string> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const stringStorage = new Storage("Hello");
const numberStorage = new Storage<number>(42);

console.log(stringStorage.getValue());
console.log(numberStorage.getValue());

// ---------------------------------------------------------------------
// 12. Generic interfaces with defaults
// ---------------------------------------------------------------------

interface State<T = null> {
  value: T;
  loading: boolean;
}

const emptyState: State = {
  value: null,
  loading: false,
};

const userState: State<User> = {
  value: {
    id: 1,
    name: "John",
  },
  loading: false,
};

console.log(emptyState.value);
console.log(userState.value.name);

// ---------------------------------------------------------------------
// 13. Generic aliases for React-style state
// ---------------------------------------------------------------------

type AsyncState<T = null> = {
  data: T;
  loading: boolean;
  error: Error | null;
};

const initialState: AsyncState = {
  data: null,
  loading: false,
  error: null,
};

const loadedState: AsyncState<User> = {
  data: {
    id: 1,
    name: "John",
  },
  loading: false,
  error: null,
};

console.log(initialState.data);
console.log(loadedState.data.name);

// ---------------------------------------------------------------------
// 14. Generic defaults with React-style props
// ---------------------------------------------------------------------

type ListProps<T = string> = {
  items: T[];
  renderItem: (item: T) => string;
};

const stringList: ListProps = {
  items: ["Apple", "Banana", "Orange"],
  renderItem: (item) => item.toUpperCase(),
};

const numberList: ListProps<number> = {
  items: [10, 20, 30],
  renderItem: (item) => item.toFixed(2),
};

console.log(stringList.items);
console.log(numberList.items);
console.log(stringList.renderItem("apple"));
console.log(numberList.renderItem(10));

// ---------------------------------------------------------------------
// 15. Generic defaults in generic functions
// ---------------------------------------------------------------------

function createPair<T = string, U = number>(first: T, second: U): Pair<T, U> {
  return {
    first,
    second,
  };
}

const pair = createPair("Age", 30);
const customPairFromFunction = createPair<boolean, string>(true, "Active");

console.log(pair.first);
console.log(pair.second);
console.log(customPairFromFunction.first);
console.log(customPairFromFunction.second);

// ---------------------------------------------------------------------
// 16. Defaults and type inference
// ---------------------------------------------------------------------

function wrap<T = string>(value?: T): T | undefined {
  return value;
}

const inferredString = wrap("Hello");
const inferredNumber = wrap(42);
const defaultWrapped = wrap();

console.log(inferredString);
console.log(inferredNumber);
console.log(defaultWrapped);

// When an argument is present, TypeScript can infer T from that argument.
// When no argument provides inference, the default type is available as T.

// ---------------------------------------------------------------------
// 17. Default type parameters are not fallback conversions
// ---------------------------------------------------------------------

function getValue<T = string>(value: T): T {
  return value;
}

const numberResult = getValue(123);

console.log(numberResult);

// T is inferred as number.
// The default string type does not force the argument to become a string.

// ---------------------------------------------------------------------
// 18. Defaults with utility-style types
// ---------------------------------------------------------------------

type Dictionary<T = string> = Record<string, T>;

const names: Dictionary = {
  first: "John",
  second: "Jane",
};

const scores: Dictionary<number> = {
  John: 95,
  Jane: 88,
};

console.log(names.first);
console.log(scores.John);

// ---------------------------------------------------------------------
// 19. Generic defaults with mapped types
// ---------------------------------------------------------------------

type Flags<T = string> = {
  [K in T & string]: boolean;
};

const featureFlags: Flags<"darkMode" | "notifications"> = {
  darkMode: true,
  notifications: false,
};

console.log(featureFlags.darkMode);
console.log(featureFlags.notifications);

// ---------------------------------------------------------------------
// 20. Generic defaults with conditional types
// ---------------------------------------------------------------------

type Id<T = number> = T extends number ? { id: T } : { id: string };

const numericId: Id = {
  id: 1,
};

const stringId: Id<string> = {
  id: "user-1",
};

console.log(numericId.id);
console.log(stringId.id);

// ---------------------------------------------------------------------
// 21. Defaults can make APIs easier to use
// ---------------------------------------------------------------------

type EventHandler<Event = Event> = (event: Event) => void;

const genericHandler: EventHandler = (event) => {
  console.log(event.type);
};

const keyboardHandler: EventHandler<KeyboardEvent> = (event) => {
  console.log(event.key);
};

genericHandler(new Event("click"));
keyboardHandler(new KeyboardEvent("keydown", { key: "Enter" }));

// ---------------------------------------------------------------------
// 22. Practical configuration pattern
// ---------------------------------------------------------------------

type ClientOptions<T = Record<string, unknown>> = {
  baseUrl: string;
  options: T;
};

const defaultClient: ClientOptions = {
  baseUrl: "/api",
  options: {
    retries: 3,
  },
};

type AuthOptions = {
  token: string;
};

const authenticatedClient: ClientOptions<AuthOptions> = {
  baseUrl: "/api",
  options: {
    token: "abc123",
  },
};

console.log(defaultClient.options);
console.log(authenticatedClient.options.token);

// ---------------------------------------------------------------------
// 23. Rules for generic defaults
// ---------------------------------------------------------------------

// A generic parameter with a default becomes optional.
//
// type Box<T = string> = {
//   value: T;
// };
//
// Box              -> T is string.
// Box<number>      -> T is number.

// Required type parameters cannot appear after optional type parameters.
//
// Valid:
// type Example<T = string, U = number> = {
//   first: T;
//   second: U;
// };
//
// Invalid:
// type Invalid<T = string, U> = {
//   first: T;
//   second: U;
// };

// A default can reference an earlier type parameter.
//
// type KeyValue<K = string, V = K> = {
//   key: K;
//   value: V;
// };

// A default may also have a constraint.
//
// type Repository<T extends Entity = Entity> = {
//   findById(id: number): T | undefined;
// };

// ---------------------------------------------------------------------
// 24. Generic defaults vs. inference
// ---------------------------------------------------------------------

// Generic defaults are used when a type argument is not otherwise provided
// through inference or explicit type arguments.

// Inference:
const inferred = identity(123); // T is number

// Explicit type argument:
const explicit = identity<boolean>(true); // T is boolean

// Default:
const defaultGeneric = createValue(); // T uses the default string type

console.log(inferred);
console.log(explicit);
console.log(defaultGeneric);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// Generic defaults provide a fallback type for generic type parameters.
//
// type Box<T = string> = {
//   value: T;
// };
//
// They make generic APIs easier to use when one type is the common case,
// while still allowing callers to provide a different type when necessary.
//
// Key points:
// - `T = Default` gives a generic parameter a default type.
// - The default makes that type parameter optional.
// - Explicit type arguments override the default.
// - Type inference takes precedence when enough information is available.
// - Defaults can reference earlier generic parameters.
// - Defaults can be combined with constraints.
// - Generic defaults work with aliases, interfaces, classes, and functions.
// - They are especially useful for reusable libraries and React-style APIs.

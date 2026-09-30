/**
 * Optional Chaining
 * =================
 *
 * Optional chaining (`?.`) allows property, method, and element access
 * to safely continue when a value is `null` or `undefined`.
 *
 * Instead of throwing a TypeError when an intermediate value is missing,
 * optional chaining returns `undefined`.
 */

// ---------------------------------------------------------------------
// 1. Basic optional property access
// ---------------------------------------------------------------------

// Optional chaining stops property access and returns `undefined` when the target is nullish.
const user = null;
console.log(user?.name); // undefined

const account = {
  name: "John",
};

console.log(account?.name); // "John"
console.log(account?.email); // undefined

// ---------------------------------------------------------------------
// 2. Optional chaining with nested properties
// ---------------------------------------------------------------------

// Optional chaining prevents TypeErrors when accessing nested properties of missing objects.
const profile = {
  name: "John",
  address: {
    city: "Skopje",
  },
};

console.log(profile.address.city); // "Skopje"

const incompleteProfile = {
  name: "John",
};

console.log(incompleteProfile.address?.city); // undefined

// ---------------------------------------------------------------------
// 3. Chaining multiple optional accesses
// ---------------------------------------------------------------------

// If any link in a continuous optional chain evaluates to nullish, the entire expression returns `undefined`.
const response = {
  user: {
    profile: {
      address: {
        city: "Skopje",
      },
    },
  },
};

const city = response.user?.profile?.address?.city;
console.log(city); // "Skopje"

const emptyResponse = {
  user: null,
};

const missingCity = emptyResponse.user?.profile?.address?.city;
console.log(missingCity); // undefined

// ---------------------------------------------------------------------
// 4. Optional chaining only stops for `null` and `undefined`
// ---------------------------------------------------------------------

// Other falsy values like `0`, `""`, or `false` do not short-circuit the optional chain.
const values = {
  zero: 0,
  emptyString: "",
  falseValue: false,
};

console.log(values.zero?.toString()); // "0"
console.log(values.emptyString?.length); // 0
console.log(values.falseValue?.valueOf()); // false

// ---------------------------------------------------------------------
// 5. Optional method calls
// ---------------------------------------------------------------------

// The `?.()` syntax safely executes a method only if it exists.
const userActions = {
  save() {
    return "saved";
  },
};

console.log(userActions.save?.()); // "saved"
console.log(userActions.cancel?.()); // undefined

// ---------------------------------------------------------------------
// 6. Optional calls with a possibly missing function
// ---------------------------------------------------------------------

// This pattern is ideal for executing optional callback functions.
function execute(callback) {
  return callback?.();
}

console.log(execute(() => "completed")); // "completed"
console.log(execute()); // undefined

// ---------------------------------------------------------------------
// 7. Optional element access
// ---------------------------------------------------------------------

// The `?.[]` syntax safely accesses array items or computed property names.
const users = [{ name: "John" }, { name: "Jane" }];

console.log(users?.[0]?.name); // "John"
console.log(users?.[10]?.name); // undefined

const settings = {
  theme: "dark",
};
const propertyName = "theme";

console.log(settings?.[propertyName]); // "dark"

// ---------------------------------------------------------------------
// 8. Optional chaining with arrays
// ---------------------------------------------------------------------

// Optional chaining can safely guard against uninitialized or missing arrays.
const data = undefined;
console.log(data?.[0]); // undefined

const items = ["first", "second"];
console.log(items?.[0]); // "first"
console.log(items?.[5]); // undefined

// ---------------------------------------------------------------------
// 9. Optional chaining with function results
// ---------------------------------------------------------------------

// Optional chaining applies to the value returned by a function call, not the call itself.
function findUser() {
  return null;
}

const foundUser = findUser();
console.log(foundUser?.name); // undefined

// ---------------------------------------------------------------------
// 10. Optional chaining and grouping
// ---------------------------------------------------------------------

// Parentheses can terminate an optional chain, exposing subsequent operations to normal checks.
const accountData = null;

console.log(accountData?.profile?.name); // undefined

const grouped = accountData?.profile;
// (grouped).name; // TypeError: Cannot read properties of undefined

// ---------------------------------------------------------------------
// 11. Optional chaining does not suppress unrelated errors
// ---------------------------------------------------------------------

// Optional chaining only short-circuits nullish values and does not swallow internal exceptions.
const userData = {
  getName() {
    throw new Error("Unexpected failure");
  },
};

// userData.getName?.(); // Error: Unexpected failure

// ---------------------------------------------------------------------
// 12. Optional chaining and undeclared variables
// ---------------------------------------------------------------------

// Optional chaining requires the identifier to exist in scope; it cannot protect undeclared variables.
// undeclaredUser?.name; // ReferenceError: undeclaredUser is not defined

// ---------------------------------------------------------------------
// 13. Optional chaining with `null`
// ---------------------------------------------------------------------

// Both `null` and `undefined` safely trigger short-circuiting.
const nullValue = null;
const undefinedValue = undefined;

console.log(nullValue?.name); // undefined
console.log(undefinedValue?.name); // undefined

// ---------------------------------------------------------------------
// 14. Optional chaining and `delete`
// ---------------------------------------------------------------------

// Optional chaining works seamlessly with the `delete` operator without throwing on nullish targets.
const userRecord = {
  name: "John",
};

delete userRecord?.name;
console.log(userRecord); // {}

const missingRecord = null;
console.log(delete missingRecord?.name); // true

// ---------------------------------------------------------------------
// 15. Optional chaining cannot be used for assignment
// ---------------------------------------------------------------------

// An optional chain is a read-only construct and cannot serve as a left-side assignment target.
// const user = null;
// user?.name = "John"; // SyntaxError: Invalid left-hand side in assignment

// ---------------------------------------------------------------------
// 16. Optional chaining cannot be used with `new`
// ---------------------------------------------------------------------

// Optional chaining cannot be directly chained into constructor instantiation.
// new User?.(); // SyntaxError

// ---------------------------------------------------------------------
// 17. Optional chaining vs. manual checks
// ---------------------------------------------------------------------

// Optional chaining simplifies deep property checks compared to nested `if` statements.
const customer = {
  profile: {
    name: "John",
  },
};

let manualName;
if (customer && customer.profile) {
  manualName = customer.profile.name;
}
console.log(manualName); // "John"

const chainedName = customer?.profile?.name;
console.log(chainedName); // "John"

// ---------------------------------------------------------------------
// 18. Optional chaining does not replace validation
// ---------------------------------------------------------------------

// Suppressing missing values with optional chaining should be used for expected states, not to mask bugs.
const config = {};
const timeout = config?.request?.timeout;

console.log(timeout); // undefined

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `?.` safely accesses a property when the value may be `null` or `undefined`.
// - Optional chaining returns `undefined` instead of throwing for nullish values.
// - `?.` can be used for property access, `?.[]` for element access, and `?.()` for method/function calls.
// - Optional chaining only short-circuits on `null` and `undefined`, not other falsy values.
// - A continuous optional chain can safely traverse multiple nested properties.
// - Optional chaining does not catch arbitrary exceptions thrown by existing methods.
// - It does not protect undeclared identifiers.
// - It cannot be used as an assignment target or directly with `new`.
// - Optional chaining is for safe access, not a replacement for required-state validation.

/**
 * Immutable Object Transformations
 * ================================
 *
 * Immutable object transformations create new objects instead of
 * modifying existing objects in place.
 *
 * Object spread, `Object.assign()`, and related techniques can create
 * updated object values while preserving the original object reference.
 *
 * Because object copying is shallow, nested objects and arrays require
 * additional copies when they are changed.
 */

// ---------------------------------------------------------------------
// 1. What immutability means for objects
// ---------------------------------------------------------------------

// Immutable transformations leave the original object unchanged and produce a new object.
const user = { name: "John", age: 30 };
const updatedUser = { ...user, age: 31 };

console.log(user); // { name: "John", age: 30 }
console.log(updatedUser); // { name: "John", age: 31 }
console.log(user === updatedUser); // false

// ---------------------------------------------------------------------
// 2. Object spread creates a new object
// ---------------------------------------------------------------------

// Object spread creates a new object with the source's own enumerable properties.
const person = { name: "John", age: 30 };
const personCopy = { ...person };

console.log(person === personCopy); // false

// ---------------------------------------------------------------------
// 3. Updating a property immutably
// ---------------------------------------------------------------------

// Modify object values while leaving the source object reference intact.
const account = { id: 1, name: "John", active: false };
const activeAccount = { ...account, active: true };

console.log(activeAccount); // { id: 1, name: "John", active: true }

// ---------------------------------------------------------------------
// 4. Adding a property immutably
// ---------------------------------------------------------------------

// Expand objects with new properties using the spread operator.
const product = { name: "Laptop", price: 1200 };
const productWithCategory = { ...product, category: "electronics" };

console.log(productWithCategory); // { name: "Laptop", price: 1200, category: "electronics" }

// ---------------------------------------------------------------------
// 5. Removing a property immutably
// ---------------------------------------------------------------------

// Combine destructuring and rest syntax to omit properties safely.
const userWithPassword = { id: 1, name: "John", password: "secret" };
const { password, ...safeUser } = userWithPassword;

console.log(safeUser); // { id: 1, name: "John" }

// ---------------------------------------------------------------------
// 6. Replacing multiple properties
// ---------------------------------------------------------------------

// Later property definitions override earlier properties during object spread.
const employee = { name: "John", department: "engineering", salary: 50000 };
const promotedEmployee = {
  ...employee,
  department: "management",
  salary: 70000,
};

console.log(promotedEmployee); // { name: "John", department: "management", salary: 70000 }

// ---------------------------------------------------------------------
// 7. Property order and overriding
// ---------------------------------------------------------------------

// Merge objects sequentially so that later source properties take precedence.
const defaults = { theme: "light", language: "en" };
const preferences = { theme: "dark" };
const settings = { ...defaults, ...preferences };

console.log(settings); // { theme: "dark", language: "en" }

// ---------------------------------------------------------------------
// 8. Creating an object from selected properties
// ---------------------------------------------------------------------

// Construct customized objects explicitly from subset properties.
const fullUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  role: "admin",
};
const publicUser = { id: fullUser.id, name: fullUser.name };

console.log(publicUser); // { id: 1, name: "John" }

// ---------------------------------------------------------------------
// 9. Conditional property updates
// ---------------------------------------------------------------------

// Conditionally append properties using logical short-circuiting.
const settingsBeforeUpdate = { darkMode: false, notifications: true };
const enableDarkMode = true;

const settingsAfterUpdate = {
  ...settingsBeforeUpdate,
  ...(enableDarkMode && { darkMode: true }),
};

console.log(settingsAfterUpdate); // { darkMode: true, notifications: true }

// ---------------------------------------------------------------------
// 10. Updating nested objects
// ---------------------------------------------------------------------

// Nested mutations require new object references along the entire parent-child path.
const userProfile = {
  name: "John",
  profile: { city: "London", country: "UK" },
};

const updatedProfile = {
  ...userProfile,
  profile: { ...userProfile.profile, city: "Paris" },
};

console.log(updatedProfile.profile.city); // "Paris"

// ---------------------------------------------------------------------
// 11. Updating deeply nested objects
// ---------------------------------------------------------------------

// Cascade spread operations down through multi-level nested structures.
const customer = {
  id: 1,
  profile: { address: { city: "London", country: "UK" } },
};

const updatedCustomer = {
  ...customer,
  profile: {
    ...customer.profile,
    address: { ...customer.profile.address, city: "Paris" },
  },
};

console.log(updatedCustomer.profile.address.city); // "Paris"

// ---------------------------------------------------------------------
// 12. Preserving unchanged references
// ---------------------------------------------------------------------

// Unchanged nested sub-objects retain their original memory references.
const originalUser = {
  name: "John",
  profile: { city: "London" },
  preferences: { theme: "dark" },
};

const changedUser = {
  ...originalUser,
  profile: { ...originalUser.profile, city: "Paris" },
};

console.log(originalUser.preferences === changedUser.preferences); // true

// ---------------------------------------------------------------------
// 13. Updating arrays inside objects
// ---------------------------------------------------------------------

// Combine object spread with array spread to update nested collections immutably.
const state = { name: "John", tags: ["javascript", "react"] };
const updatedState = { ...state, tags: [...state.tags, "typescript"] };

console.log(updatedState.tags); // ["javascript", "react", "typescript"]

// ---------------------------------------------------------------------
// 14. Updating an object inside an array
// ---------------------------------------------------------------------

// Update targeted items inside arrays using methods like `map()`.
const team = {
  name: "Frontend",
  members: [
    { id: 1, name: "John", active: true },
    { id: 2, name: "Jane", active: false },
  ],
};

const updatedTeam = {
  ...team,
  members: team.members.map((m) => (m.id === 2 ? { ...m, active: true } : m)),
};

console.log(updatedTeam.members[1].active); // true

// ---------------------------------------------------------------------
// 15. Removing an object from an array property
// ---------------------------------------------------------------------

// Filter out array items inside object properties safely.
const project = {
  name: "Website",
  members: [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
    { id: 3, name: "Mark" },
  ],
};

const projectWithoutJane = {
  ...project,
  members: project.members.filter((m) => m.id !== 2),
};

console.log(projectWithoutJane.members.length); // 2

// ---------------------------------------------------------------------
// 16. `Object.assign()`
// ---------------------------------------------------------------------

// Use an empty target `{}` with `Object.assign()` to construct a new merged object.
const originalSettings = { theme: "light", language: "en" };
const newSettings = Object.assign({}, originalSettings, { theme: "dark" });

console.log(newSettings); // { theme: "dark", language: "en" }

// ---------------------------------------------------------------------
// 17. `Object.assign()` can mutate its target
// ---------------------------------------------------------------------

// Caution: Passing an existing object as the first argument will mutate it directly.
const target = { name: "John" };
Object.assign(target, { age: 30 }); // mutates `target`

// ---------------------------------------------------------------------
// 18. Shallow copying
// ---------------------------------------------------------------------

// Object spread is shallow; inner objects remain shared references.
const originalProfile = { name: "John", address: { city: "London" } };
const copiedProfile = { ...originalProfile };

copiedProfile.address.city = "Paris";
console.log(originalProfile.address.city); // "Paris" (shared mutation)

// ---------------------------------------------------------------------
// 19. Deep immutable updates
// ---------------------------------------------------------------------

// Copy every level along the transformation path to ensure deep immutability.
const originalAccount = {
  id: 1,
  profile: { name: "John", contact: { email: "john@example.com" } },
};

const updatedAccount = {
  ...originalAccount,
  profile: {
    ...originalAccount.profile,
    contact: { ...originalAccount.profile.contact, email: "new@example.com" },
  },
};

console.log(updatedAccount.profile.contact.email); // "new@example.com"

// ---------------------------------------------------------------------
// 20. `structuredClone()` and deep copying
// ---------------------------------------------------------------------

// `structuredClone()` performs deep duplication of complex values.
const originalData = { user: { name: "John" }, items: [1, 2, 3] };
const clonedData = structuredClone(originalData);

clonedData.user.name = "Jane";
console.log(originalData.user.name); // "John" (fully independent)

// ---------------------------------------------------------------------
// 21. Object freezing
// ---------------------------------------------------------------------

// `Object.freeze()` prevents property modifications, but it is shallow.
const frozenUser = Object.freeze({ name: "John", age: 30 });
// frozenUser.age = 31; // Fails / throws in strict mode

// ---------------------------------------------------------------------
// 22. Avoiding direct mutation
// ---------------------------------------------------------------------

// Never mutate state/objects directly; create new copies with updates.
const todo = { id: 1, text: "Learn JavaScript", completed: false };
const completedTodo = { ...todo, completed: true };

console.log(completedTodo.completed); // true

// ---------------------------------------------------------------------
// 23. Immutable transformations in React
// ---------------------------------------------------------------------

// React state relies on immutable object updates to detect changes and trigger re-renders.
const initialUser = { name: "John", age: 30 };
const nextUser = { ...initialUser, age: 31 };

console.log(nextUser); // { name: "John", age: 31 }

// ---------------------------------------------------------------------
// 24. Immutable nested React state updates
// ---------------------------------------------------------------------

// Ensure deep states update correctly by cloning all changed hierarchical layers.
const initialSettings = { appearance: { theme: "light", fontSize: 16 } };
const nextSettings = {
  ...initialSettings,
  appearance: { ...initialSettings.appearance, theme: "dark" },
};

console.log(nextSettings.appearance.theme); // "dark"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Immutable object updates return new instances rather than modifying source objects.
// - Object spread (`{ ...obj }`) and destructuring rest syntax are ideal tools.
// - `Object.assign({}, ...)` works well, but watch out for target mutation.
// - Copies are shallow; nested paths require explicit structural duplication.
// - `structuredClone()` handles deep cloning, while `Object.freeze()` locks properties shallowly.
// - Immutable patterns are essential for safe application state management and React updates.

/**
 * Async Await
 * ===========
 *
 * `async` and `await` provide syntax for working with Promises using a
 * sequential style. An async function always returns a Promise, and `await`
 * pauses that function until a Promise settles.
 */

// ---------------------------------------------------------------------
// 1. Async functions
// ---------------------------------------------------------------------

async function getValue() {
  return "value";
}

const valuePromise = getValue();

// ---------------------------------------------------------------------
// 2. Awaiting a promise
// ---------------------------------------------------------------------

function loadUser() {
  return Promise.resolve({ id: 1, name: "Ada" });
}

async function showUser() {
  const user = await loadUser();
  return user.name;
}

// ---------------------------------------------------------------------
// 3. Awaiting a resolved value
// ---------------------------------------------------------------------

async function getUserName() {
  const user = await Promise.resolve({ name: "Ada" });
  return user.name;
}

// ---------------------------------------------------------------------
// 4. Awaiting non-Promise values
// ---------------------------------------------------------------------

async function getNumber() {
  const value = await 42;
  return value;
}

// ---------------------------------------------------------------------
// 5. Async return values
// ---------------------------------------------------------------------

async function getResult() {
  return 42;
}

getResult().then((value) => {
  // `value` is 42.
});

// ---------------------------------------------------------------------
// 6. Async return of a promise
// ---------------------------------------------------------------------

async function getUser() {
  return Promise.resolve({ id: 1, name: "Ada" });
}

getUser().then((user) => {
  // The returned Promise is adopted by the async function.
});

// ---------------------------------------------------------------------
// 7. Handling rejected promises
// ---------------------------------------------------------------------

async function loadData() {
  const response = await Promise.reject(new Error("Request failed"));
  return response;
}

loadData().catch((error) => {
  // Rejected promises from `await` reject the async function.
});

// ---------------------------------------------------------------------
// 8. try-catch with await
// ---------------------------------------------------------------------

async function loadUserSafely() {
  try {
    return await loadUser();
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------------
// 9. finally with await
// ---------------------------------------------------------------------

async function processRequest() {
  try {
    return await Promise.resolve("completed");
  } catch (error) {
    throw error;
  } finally {
    // Cleanup runs after the awaited operation settles.
  }
}

// ---------------------------------------------------------------------
// 10. Sequential awaits
// ---------------------------------------------------------------------

function loadProfileByUserId(id) {
  return Promise.resolve({ userId: id, bio: "Developer" });
}

async function loadProfile() {
  const user = await loadUser();
  const profile = await loadProfileByUserId(user.id);
  return profile;
}

// ---------------------------------------------------------------------
// 11. Transforming values between awaits
// ---------------------------------------------------------------------

async function getDisplayName() {
  const user = await loadUser();
  return `${user.name} User`;
}

// ---------------------------------------------------------------------
// 12. Awaiting multiple operations sequentially
// ---------------------------------------------------------------------

async function loadDashboard() {
  const user = await loadUser();
  const profile = await loadProfileByUserId(user.id);
  return { user, profile };
}

// ---------------------------------------------------------------------
// 13. Async arrow functions
// ---------------------------------------------------------------------

const fetchUser = async (id) => {
  return { id, name: "Ada" };
};

// ---------------------------------------------------------------------
// 14. Async function expressions
// ---------------------------------------------------------------------

const fetchSettings = async function () {
  return { theme: "dark" };
};

// ---------------------------------------------------------------------
// 15. Await inside loops
// ---------------------------------------------------------------------

async function loadUsers(ids) {
  const users = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    users.push(user);
  }
  return users;
}

// ---------------------------------------------------------------------
// 16. Await inside conditional logic
// ---------------------------------------------------------------------

async function getData(shouldLoad) {
  if (!shouldLoad) {
    return null;
  }
  return await Promise.resolve({ value: 42 });
}

// ---------------------------------------------------------------------
// 17. Await pauses the async function
// ---------------------------------------------------------------------

async function process() {
  const first = await Promise.resolve("first");
  return `${first}-second`;
}

// ---------------------------------------------------------------------
// 18. Errors thrown after await
// ---------------------------------------------------------------------

async function parseData() {
  const value = await Promise.resolve("invalid");
  if (value === "invalid") {
    throw new Error("Invalid data");
  }
  return value;
}

// ---------------------------------------------------------------------
// 19. Reusing async functions
// ---------------------------------------------------------------------

async function getUserId() {
  const user = await loadUser();
  return user.id;
}

async function loadUserProfile() {
  const id = await getUserId();
  return loadProfileByUserId(id);
}

// ---------------------------------------------------------------------
// 20. Async functions compose with Promise APIs
// ---------------------------------------------------------------------

async function getFirstUser() {
  const users = await Promise.resolve([
    { id: 1, name: "Ada" },
    { id: 2, name: "Grace" },
  ]);
  return users[0];
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `async` automatically wraps return values in a Promise.
// - `await` pauses execution of the async function until the Promise settles.
// - Rejected promises awaited inside async functions throw errors catchable via `try-catch`.
// - `await` accepts non-Promise values, treating them as already resolved.
// - Execution remains non-blocking for the surrounding JavaScript thread.
// - Async functions can be declared as regular functions, arrow functions, or expressions.

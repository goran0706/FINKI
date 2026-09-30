/**
 * Race Conditions
 * ===============
 *
 * A race condition occurs when the correctness of a program depends on the
 * order in which concurrent operations complete. With asynchronous requests,
 * an older operation can finish after a newer operation and overwrite newer
 * data.
 */

// ---------------------------------------------------------------------
// 1. Asynchronous operations can finish in different orders
// ---------------------------------------------------------------------

function delay(value, milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), milliseconds);
  });
}

async function run() {
  const first = delay("first", 100);
  const second = delay("second", 10);
  return await Promise.all([first, second]);
}

// ---------------------------------------------------------------------
// 2. A request race
// ---------------------------------------------------------------------

let displayedData;

async function loadData(url) {
  const response = await fetch(url);
  const data = await response.json();
  displayedData = data;
}

// ---------------------------------------------------------------------
// 3. Stale results
// ---------------------------------------------------------------------

let currentQuery = "";

async function search(query) {
  currentQuery = query;
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const results = await response.json();

  if (query === currentQuery) {
    return results;
  }
  return null;
}

// ---------------------------------------------------------------------
// 4. Request identity
// ---------------------------------------------------------------------

let latestRequestId = 0;

async function loadLatest(url) {
  const requestId = ++latestRequestId;
  const response = await fetch(url);
  const data = await response.json();

  if (requestId !== latestRequestId) {
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------
// 5. Ignoring stale results
// ---------------------------------------------------------------------

let activeRequest = 0;

async function loadUser(id) {
  const requestId = ++activeRequest;
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();

  if (requestId !== activeRequest) {
    return null;
  }
  return user;
}

// ---------------------------------------------------------------------
// 6. Cancelling stale requests
// ---------------------------------------------------------------------

let activeController = null;

async function loadCurrentUser(id) {
  activeController?.abort();

  const controller = new AbortController();
  activeController = controller;

  try {
    const response = await fetch(`/api/users/${id}`, {
      signal: controller.signal,
    });
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// 7. Search input race condition
// ---------------------------------------------------------------------

let searchRequestId = 0;

async function searchProducts(query) {
  const requestId = ++searchRequestId;
  const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
  const products = await response.json();

  if (requestId !== searchRequestId) {
    return null;
  }
  return products;
}

// ---------------------------------------------------------------------
// 8. Race conditions with shared state
// ---------------------------------------------------------------------

let state = 0;

async function updateStateAfter(value, milliseconds) {
  await delay(null, milliseconds);
  state = value;
}

// ---------------------------------------------------------------------
// 9. Last-write-wins protection
// ---------------------------------------------------------------------

let latestOperation = 0;

async function updateLatest(value, milliseconds) {
  const operationId = ++latestOperation;
  await delay(null, milliseconds);

  if (operationId !== latestOperation) {
    return;
  }
  state = value;
}

// ---------------------------------------------------------------------
// 10. Race conditions with dependent data
// ---------------------------------------------------------------------

let selectedUserId = null;

async function loadProfileForUser(userId) {
  selectedUserId = userId;
  const response = await fetch(`/api/users/${userId}/profile`);
  const profile = await response.json();

  if (userId !== selectedUserId) {
    return null;
  }
  return profile;
}

// ---------------------------------------------------------------------
// 11. Request cancellation and stale-result protection
// ---------------------------------------------------------------------

let requestController = null;
let requestVersion = 0;

async function loadCurrentData(url) {
  requestController?.abort();

  const controller = new AbortController();
  const version = ++requestVersion;
  requestController = controller;

  try {
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();

    if (version !== requestVersion) {
      return null;
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }
    throw error;
  } finally {
    if (requestController === controller) {
      requestController = null;
    }
  }
}

// ---------------------------------------------------------------------
// 12. Promise.all does not remove races inside operations
// ---------------------------------------------------------------------

async function loadDashboardData() {
  const usersPromise = fetch("/api/users").then((res) => res.json());
  const settingsPromise = fetch("/api/settings").then((res) => res.json());

  const [users, settings] = await Promise.all([usersPromise, settingsPromise]);
  return { users, settings };
}

// ---------------------------------------------------------------------
// 13. Race conditions versus normal concurrency
// ---------------------------------------------------------------------

async function loadIndependentData() {
  const [users, products] = await Promise.all([
    fetch("/api/users").then((res) => res.json()),
    fetch("/api/products").then((res) => res.json()),
  ]);
  return { users, products };
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Race conditions occur when completion order affects application correctness.
// - Asynchronous requests can finish out of order, leading to stale results overwriting newer updates.
// - Request IDs, version tracking, and `AbortController` provide effective defenses against race conditions.
// - Concurrent operations are safe as long as their completion order does not compromise state consistency.

/**
 * Request Cancellation
 * ====================
 *
 * Request cancellation stops an asynchronous request when its result is no
 * longer needed. With Fetch, cancellation is signaled through AbortController
 * and AbortSignal.
 */

// ---------------------------------------------------------------------
// 1. Why requests need cancellation
// ---------------------------------------------------------------------

// A request may become unnecessary when navigation occurs, components unmount,
// queries change, or newer requests replace older ones.

// ---------------------------------------------------------------------
// 2. Cancelling a fetch request
// ---------------------------------------------------------------------

async function loadUsers(signal) {
  const response = await fetch("/api/users", { signal });
  return response.json();
}

const controller = new AbortController();
loadUsers(controller.signal);
controller.abort();

// ---------------------------------------------------------------------
// 3. Keeping the controller with the request
// ---------------------------------------------------------------------

function createUserRequest() {
  const controller = new AbortController();
  const promise = fetch("/api/users", { signal: controller.signal });
  return {
    promise,
    cancel: () => controller.abort(),
  };
}

const request = createUserRequest();
request.cancel();

// ---------------------------------------------------------------------
// 4. Handling cancellation separately
// ---------------------------------------------------------------------

async function loadData(signal) {
  try {
    const response = await fetch("/api/data", { signal });
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// 5. Cancelling from another function
// ---------------------------------------------------------------------

function createRequest() {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel() {
      controller.abort();
    },
  };
}

const operation = createRequest();
fetch("/api/data", { signal: operation.signal });
operation.cancel();

// ---------------------------------------------------------------------
// 6. Cancelling the previous request
// ---------------------------------------------------------------------

let currentController = null;

async function loadLatestData(url) {
  currentController?.abort();
  const controller = new AbortController();
  currentController = controller;

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } finally {
    if (currentController === controller) {
      currentController = null;
    }
  }
}

// ---------------------------------------------------------------------
// 7. Search request cancellation
// ---------------------------------------------------------------------

let searchController = null;

async function searchUsers(query) {
  searchController?.abort();
  const controller = new AbortController();
  searchController = controller;

  try {
    const response = await fetch(`/api/users?search=${encodeURIComponent(query)}`, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// 8. Cancelling when work is no longer needed
// ---------------------------------------------------------------------

async function processRequest(signal) {
  const response = await fetch("/api/data", { signal });
  return response.json();
}

const controllerProc = new AbortController();
const promiseProc = processRequest(controllerProc.signal);
controllerProc.abort();

// ---------------------------------------------------------------------
// 9. Cancellation during cleanup
// ---------------------------------------------------------------------

function startRequest() {
  const controller = new AbortController();
  fetch("/api/data", { signal: controller.signal });
  return () => controller.abort();
}

const cleanup = startRequest();
cleanup();

// ---------------------------------------------------------------------
// 10. Request cancellation in React-style code
// ---------------------------------------------------------------------

function loadUser(id, signal) {
  return fetch(`/api/users/${id}`, { signal }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
}

// ---------------------------------------------------------------------
// 11. Cancellation versus HTTP errors
// ---------------------------------------------------------------------

async function getData(signal) {
  try {
    const response = await fetch("/api/data", { signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// 12. Cancellation versus ignoring a result
// ---------------------------------------------------------------------

let activeRequest = 0;

async function loadCurrentData() {
  const requestId = ++activeRequest;
  const response = await fetch("/api/data");
  const data = await response.json();

  if (requestId !== activeRequest) {
    return null;
  }
  return data;
}

// ---------------------------------------------------------------------
// 13. Combining cancellation with a timeout
// ---------------------------------------------------------------------

async function loadWithCancellation(signal) {
  const timeoutSignal = AbortSignal.timeout(5000);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
  const response = await fetch("/api/data", { signal: combinedSignal });
  return response.json();
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Request cancellation stops unnecessary asynchronous work using `AbortController`.
// - Pass the controller's signal to `fetch()` and call `controller.abort()` when needed.
// - Handle `AbortError` separately from standard network failures and HTTP errors.
// - Search interfaces and UI cleanups commonly cancel obsolete requests to save bandwidth and prevent stale state.
// - Signals can be combined with timeouts using `AbortSignal.any()`.

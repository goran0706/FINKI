/**
 * Abort Controller
 * ================
 *
 * AbortController provides a standard way to signal that an asynchronous
 * operation should be canceled. Fetch supports AbortSignal through its
 * `signal` option.
 */

// ---------------------------------------------------------------------
// 1. Creating an AbortController
// ---------------------------------------------------------------------

const controller = new AbortController();
const signal = controller.signal;

// ---------------------------------------------------------------------
// 2. Passing a signal to fetch
// ---------------------------------------------------------------------

async function loadUsers() {
  const controller = new AbortController();
  const response = await fetch("/api/users", {
    signal: controller.signal,
  });
  return response.json();
}

// ---------------------------------------------------------------------
// 3. Aborting a fetch request
// ---------------------------------------------------------------------

async function loadData() {
  const controller = new AbortController();
  const promise = fetch("/api/data", {
    signal: controller.signal,
  });
  controller.abort(); // Signals cancellation to the operation using its signal.
  return promise;
}

// ---------------------------------------------------------------------
// 4. Handling an aborted fetch
// ---------------------------------------------------------------------

async function loadUser() {
  const controller = new AbortController();
  try {
    const response = await fetch("/api/user", {
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
// 5. Checking whether a signal is aborted
// ---------------------------------------------------------------------

const controllerCheck = new AbortController();
controllerCheck.abort();
const wasAborted = controllerCheck.signal.aborted; // Becomes true after `abort()` is called.

// ---------------------------------------------------------------------
// 6. Abort reason
// ---------------------------------------------------------------------

const controllerReason = new AbortController();
controllerReason.abort("Request no longer needed");
const reason = controllerReason.signal.reason; // Explains why the operation was cancelled.

// ---------------------------------------------------------------------
// 7. Aborting with an Error
// ---------------------------------------------------------------------

const controllerError = new AbortController();
controllerError.abort(new Error("Request was cancelled"));

// ---------------------------------------------------------------------
// 8. Listening for abort
// ---------------------------------------------------------------------

const controllerListener = new AbortController();
controllerListener.signal.addEventListener("abort", () => {
  // Perform cancellation-related work.
});
controllerListener.abort();

// ---------------------------------------------------------------------
// 9. AbortSignal.timeout
// ---------------------------------------------------------------------

async function loadWithTimeout() {
  const response = await fetch("/api/data", {
    signal: AbortSignal.timeout(5000), // Automatically aborts after specified milliseconds.
  });
  return response.json();
}

// ---------------------------------------------------------------------
// 10. Handling a timeout
// ---------------------------------------------------------------------

async function loadWithTimeoutHandling() {
  try {
    const response = await fetch("/api/data", {
      signal: AbortSignal.timeout(5000),
    });
    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError") {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// 11. AbortSignal.any
// ---------------------------------------------------------------------

async function loadWithMultipleCancellationSources(userSignal) {
  const timeoutSignal = AbortSignal.timeout(5000);
  const signal = AbortSignal.any([userSignal, timeoutSignal]); // Aborts when any source signal aborts.
  const response = await fetch("/api/data", { signal });
  return response.json();
}

// ---------------------------------------------------------------------
// 12. A controller can abort multiple operations
// ---------------------------------------------------------------------

async function loadDashboard() {
  const controller = new AbortController();
  const usersPromise = fetch("/api/users", { signal: controller.signal });
  const settingsPromise = fetch("/api/settings", { signal: controller.signal });
  controller.abort(); // One controller signals cancellation to multiple operations.
  return Promise.all([usersPromise, settingsPromise]);
}

// ---------------------------------------------------------------------
// 13. One signal can be passed to multiple APIs
// ---------------------------------------------------------------------

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

async function performWork() {
  const controller = new AbortController();
  const operation = wait(5000, controller.signal);
  controller.abort();
  return operation;
}

// ---------------------------------------------------------------------
// 14. A signal is one-way
// ---------------------------------------------------------------------

const controllerOneWay = new AbortController();
controllerOneWay.abort();
// Signals cannot be reset; create a new AbortController for a new operation.

// ---------------------------------------------------------------------
// 15. Checking an already-aborted signal
// ---------------------------------------------------------------------

const controllerExisting = new AbortController();
controllerExisting.abort();

async function loadWithExistingSignal() {
  if (controllerExisting.signal.aborted) {
    return null;
  }
  const response = await fetch("/api/data", {
    signal: controllerExisting.signal,
  });
  return response.json();
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `AbortController` provides a standardized way to signal asynchronous operation cancellation.
// - `controller.signal` produces the `AbortSignal` passed into operations like `fetch()`.
// - Aborted fetch requests typically reject with an `AbortError`.
// - `AbortSignal.timeout()` creates signals that automatically abort after a set duration.
// - `AbortSignal.any()` combines multiple signals so that any trigger aborts the operation.
// - Signals are one-way and cannot be reset; a new controller must be instantiated for new operations.

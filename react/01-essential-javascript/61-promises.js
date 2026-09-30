/**
 * Promises
 * ========
 *
 * A Promise represents the eventual result of an asynchronous operation.
 * It starts in a pending state and eventually becomes fulfilled or rejected.
 */

// ---------------------------------------------------------------------
// 1. Creating a promise
// ---------------------------------------------------------------------

const promise = new Promise((resolve, reject) => {
  resolve("Operation completed");
});

// ---------------------------------------------------------------------
// 2. Promise states
// ---------------------------------------------------------------------

// A Promise moves through three states:
// - pending: operation has not finished yet
// - fulfilled: operation completed successfully
// - rejected: operation failed
// A fulfilled or rejected promise is settled and cannot change state again.

// ---------------------------------------------------------------------
// 3. Resolving a promise
// ---------------------------------------------------------------------

const successfulOperation = new Promise((resolve) => {
  resolve("Success");
});

// ---------------------------------------------------------------------
// 4. Rejecting a promise
// ---------------------------------------------------------------------

const failedOperation = new Promise((resolve, reject) => {
  reject(new Error("Operation failed"));
});

// ---------------------------------------------------------------------
// 5. Handling a fulfilled promise
// ---------------------------------------------------------------------

successfulOperation.then((value) => {
  // `value` is "Success".
});

// ---------------------------------------------------------------------
// 6. Handling a rejected promise
// ---------------------------------------------------------------------

failedOperation.catch((error) => {
  // `error` is the Error object passed to `reject`.
});

// ---------------------------------------------------------------------
// 7. Handling both outcomes
// ---------------------------------------------------------------------

new Promise((resolve) => resolve("Done")).then(
  (value) => {
    // Runs on fulfillment.
  },
  (error) => {
    // Runs on rejection.
  },
);

// ---------------------------------------------------------------------
// 8. finally
// ---------------------------------------------------------------------

successfulOperation
  .then((value) => {
    // Handle success.
  })
  .finally(() => {
    // Runs regardless of fulfillment or rejection.
  });

// ---------------------------------------------------------------------
// 9. Promise chaining
// ---------------------------------------------------------------------

Promise.resolve(10)
  .then((value) => value * 2)
  .then((value) => value + 5)
  .then((value) => {
    // `value` is 25.
  });

// ---------------------------------------------------------------------
// 10. Returning a value from then
// ---------------------------------------------------------------------

Promise.resolve(10)
  .then((value) => value * 2)
  .then((value) => {
    // `value` is 20.
  });

// ---------------------------------------------------------------------
// 11. Returning a promise from then
// ---------------------------------------------------------------------

function loadUser() {
  return Promise.resolve({ id: 1, name: "Ada" });
}

loadUser()
  .then((user) => Promise.resolve(user.name))
  .then((name) => {
    // `name` is "Ada".
  });

// ---------------------------------------------------------------------
// 12. Chaining asynchronous operations
// ---------------------------------------------------------------------

function loadUserId() {
  return Promise.resolve(42);
}

function loadUserById(id) {
  return Promise.resolve({ id, name: "Ada" });
}

loadUserId()
  .then((id) => loadUserById(id))
  .then((user) => {
    // Use the loaded user object.
  });

// ---------------------------------------------------------------------
// 13. Errors in promise handlers
// ---------------------------------------------------------------------

Promise.resolve("value")
  .then(() => {
    throw new Error("Processing failed");
  })
  .catch((error) => {
    // Errors thrown inside a handler reject the next promise in the chain.
  });

// ---------------------------------------------------------------------
// 14. Catching errors from a promise chain
// ---------------------------------------------------------------------

Promise.resolve()
  .then(() => {
    throw new Error("Failure");
  })
  .then(() => {
    // Skipped because the previous promise rejected.
  })
  .catch((error) => {
    // Handles the rejection.
  });

// ---------------------------------------------------------------------
// 15. Recovery from a rejection
// ---------------------------------------------------------------------

Promise.reject(new Error("Request failed"))
  .catch((error) => "Fallback value")
  .then((value) => {
    // `value` is "Fallback value".
  });

// ---------------------------------------------------------------------
// 16. finally preserves the result
// ---------------------------------------------------------------------

Promise.resolve("value")
  .finally(() => {
    // Cleanup work.
  })
  .then((value) => {
    // `value` is still "value".
  });

// ---------------------------------------------------------------------
// 17. Promise.resolve
// ---------------------------------------------------------------------

const resolved = Promise.resolve("value"); // Creates an already-fulfilled promise

// ---------------------------------------------------------------------
// 18. Promise.reject
// ---------------------------------------------------------------------

const rejected = Promise.reject(new Error("Failure")); // Creates an already-rejected promise

// ---------------------------------------------------------------------
// 19. Resolving with another promise
// ---------------------------------------------------------------------

const outerPromise = new Promise((resolve) => {
  resolve(Promise.resolve("value"));
});

outerPromise.then((value) => {
  // `value` is "value", unwrapping the inner Promise automatically.
});

// ---------------------------------------------------------------------
// 20. A promise settles only once
// ---------------------------------------------------------------------

const once = new Promise((resolve, reject) => {
  resolve("first");
  reject(new Error("second")); // Ignored
  resolve("third"); // Ignored
});

// ---------------------------------------------------------------------
// 21. Promise callbacks are asynchronous
// ---------------------------------------------------------------------

const order = [];
Promise.resolve().then(() => order.push("promise"));
order.push("synchronous");
// `order` becomes: ["synchronous", "promise"]

// ---------------------------------------------------------------------
// 22. Promise executor runs immediately
// ---------------------------------------------------------------------

const executionOrder = [];
const immediate = new Promise((resolve) => {
  executionOrder.push("executor");
  resolve();
});
executionOrder.push("after");
// executionOrder: ["executor", "after"]

// ---------------------------------------------------------------------
// 23. Promise executor errors
// ---------------------------------------------------------------------

const executorFailure = new Promise(() => {
  throw new Error("Executor failed");
});
executorFailure.catch((error) => {
  // Thrown errors inside the executor automatically reject the promise.
});

// ---------------------------------------------------------------------
// 24. Promise-based API design
// ---------------------------------------------------------------------

function getUser() {
  return new Promise((resolve, reject) => {
    const user = { id: 1, name: "Ada" };
    user ? resolve(user) : reject(new Error("User not found"));
  });
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A Promise represents the eventual completion or failure of an async operation.
// - Starts as `pending` and settles as either `fulfilled` or `rejected` (only once).
// - `then` handles fulfillment, `catch` handles rejection, and `finally` runs regardless.
// - Returning values or promises from `then` facilitates clean chaining.
// - Promise callbacks execute asynchronously, while the executor function runs immediately.

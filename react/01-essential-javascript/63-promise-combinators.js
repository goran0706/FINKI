/**
 * Promise Combinators
 * ===================
 *
 * Promise combinators coordinate multiple Promises and produce a new Promise
 * based on how the input Promises settle. The main combinators are all(),
 * allSettled(), race(), and any(), each with different completion semantics.
 */

// ---------------------------------------------------------------------
// 1. Promise.all()
// ---------------------------------------------------------------------

const firstRequest = Promise.resolve("users");
const secondRequest = Promise.resolve("posts");
const thirdRequest = Promise.resolve("comments");

Promise.all([firstRequest, secondRequest, thirdRequest]).then((results) => {
  console.log(results);
});

// [ "users", "posts", "comments" ]

// Promise.all() fulfills only when every input Promise fulfills.
// The resulting array preserves the order of the input values.

// ---------------------------------------------------------------------
// 2. Promise.all() with direct values
// ---------------------------------------------------------------------

Promise.all([Promise.resolve("async"), "synchronous value", 42, true]).then((results) => {
  console.log(results);
});

// [ "async", "synchronous value", 42, true ]

// Promise combinators accept iterables containing Promises and ordinary
// values. Non-Promise values are treated as already fulfilled values.

// ---------------------------------------------------------------------
// 3. Promise.all() preserves input order
// ---------------------------------------------------------------------

const slow = new Promise((resolve) => {
  setTimeout(() => {
    resolve("slow");
  }, 300);
});

const fast = new Promise((resolve) => {
  setTimeout(() => {
    resolve("fast");
  }, 100);
});

Promise.all([slow, fast]).then((results) => {
  console.log(results);
});

// [ "slow", "fast" ]

// The "fast" Promise settles first, but its result remains in the
// second position because Promise.all() preserves input order.

// ---------------------------------------------------------------------
// 4. Promise.all() rejects when one Promise rejects
// ---------------------------------------------------------------------

const successfulRequest = Promise.resolve("success");

const failedRequest = Promise.reject(new Error("Request failed"));

Promise.all([successfulRequest, failedRequest])
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.log(error.message);
  });

// Request failed

// Promise.all() rejects as soon as one input Promise rejects.
// It does not return partial successful results.

// ---------------------------------------------------------------------
// 5. Promise.all() does not cancel other Promises
// ---------------------------------------------------------------------

const slowSuccess = new Promise((resolve) => {
  setTimeout(() => {
    console.log("Slow Promise finished");
    resolve("success");
  }, 300);
});

const fastFailure = new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error("Fast failure"));
  }, 100);
});

Promise.all([slowSuccess, fastFailure]).catch((error) => {
  console.log(error.message);
});

// Fast failure
// Slow Promise finished

// Promise.all() rejects its resulting Promise, but it does not automatically
// cancel the other operations that were already started.

// ---------------------------------------------------------------------
// 6. Promise.all() is useful for independent required operations
// ---------------------------------------------------------------------

async function loadDashboard() {
  const [user, settings, notifications] = await Promise.all([fetchUser(), fetchSettings(), fetchNotifications()]);

  return {
    user,
    settings,
    notifications,
  };
}

function fetchUser() {
  return Promise.resolve({ id: 1, name: "John" });
}

function fetchSettings() {
  return Promise.resolve({ theme: "dark" });
}

function fetchNotifications() {
  return Promise.resolve([{ id: 1, read: false }]);
}

loadDashboard().then((dashboard) => {
  console.log(dashboard);
});

// All three independent operations can be started without waiting for
// the previous operation to finish.

// ---------------------------------------------------------------------
// 7. Do not accidentally serialize independent requests
// ---------------------------------------------------------------------

async function loadDataSequentially() {
  const user = await fetchUser();
  const settings = await fetchSettings();
  const notifications = await fetchNotifications();

  return { user, settings, notifications };
}

// The operations above are awaited one after another.
//
// When the operations are independent, Promise.all() allows them to be
// started together:
//
// const [user, settings, notifications] = await Promise.all([
//   fetchUser(),
//   fetchSettings(),
//   fetchNotifications(),
// ]);

// ---------------------------------------------------------------------
// 8. Promise.all() with an empty iterable
// ---------------------------------------------------------------------

Promise.all([]).then((results) => {
  console.log(results);
});

// []

// Promise.all([]) fulfills with an empty array.

// ---------------------------------------------------------------------
// 9. Promise.allSettled()
// ---------------------------------------------------------------------

const successfulOperation = Promise.resolve("success");
const failedOperation = Promise.reject(new Error("Something went wrong"));

Promise.allSettled([successfulOperation, failedOperation]).then((results) => {
  console.log(results);
});

// [
//   { status: "fulfilled", value: "success" },
//   { status: "rejected", reason: Error("Something went wrong") }
// ]

// Promise.allSettled() waits for every input Promise to settle,
// regardless of whether it fulfills or rejects.

// ---------------------------------------------------------------------
// 10. Fulfilled allSettled result
// ---------------------------------------------------------------------

Promise.allSettled([Promise.resolve("A"), Promise.resolve("B"), Promise.resolve("C")]).then((results) => {
  console.log(results);
});

// [
//   { status: "fulfilled", value: "A" },
//   { status: "fulfilled", value: "B" },
//   { status: "fulfilled", value: "C" }
// ]

// A fulfilled result has:
// status: "fulfilled"
// value: the fulfilled value

// ---------------------------------------------------------------------
// 11. Rejected allSettled result
// ---------------------------------------------------------------------

Promise.allSettled([Promise.reject(new Error("Network error"))]).then((results) => {
  console.log(results[0].status); // "rejected"
  console.log(results[0].reason.message); // "Network error"
});

// A rejected result has:
// status: "rejected"
// reason: the rejection reason

// ---------------------------------------------------------------------
// 12. Filtering allSettled results
// ---------------------------------------------------------------------

Promise.allSettled([Promise.resolve("A"), Promise.reject(new Error("B failed")), Promise.resolve("C")]).then(
  (results) => {
    const successful = results.filter((result) => result.status === "fulfilled").map((result) => result.value);

    const failed = results.filter((result) => result.status === "rejected").map((result) => result.reason);

    console.log(successful); // [ "A", "C" ]
    console.log(failed.length); // 1
  },
);

// allSettled() is useful when every operation should be allowed to finish,
// even when some operations fail.

// ---------------------------------------------------------------------
// 13. Promise.allSettled() is useful for independent operations
// ---------------------------------------------------------------------

async function processNotifications() {
  const results = await Promise.allSettled([sendEmail(), sendPushNotification(), sendSms()]);

  return results;
}

function sendEmail() {
  return Promise.resolve("Email sent");
}

function sendPushNotification() {
  return Promise.reject(new Error("Push service unavailable"));
}

function sendSms() {
  return Promise.resolve("SMS sent");
}

processNotifications().then((results) => {
  console.log(results);
});

// One failure does not prevent the other operations from producing
// their individual settlement results.

// ---------------------------------------------------------------------
// 14. Promise.allSettled() with an empty iterable
// ---------------------------------------------------------------------

Promise.allSettled([]).then((results) => {
  console.log(results);
});

// []

// ---------------------------------------------------------------------
// 15. Promise.race()
// ---------------------------------------------------------------------

const first = new Promise((resolve) => {
  setTimeout(() => {
    resolve("first");
  }, 100);
});

const second = new Promise((resolve) => {
  setTimeout(() => {
    resolve("second");
  }, 300);
});

Promise.race([first, second]).then((result) => {
  console.log(result);
});

// first

// Promise.race() settles when the first input Promise settles.

// ---------------------------------------------------------------------
// 16. Promise.race() can reject first
// ---------------------------------------------------------------------

const fastRejection = new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error("Failed first"));
  }, 100);
});

const slowSuccess = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Succeeded later");
  }, 300);
});

Promise.race([fastRejection, slowSuccess]).catch((error) => {
  console.log(error.message);
});

// Failed first

// Promise.race() does not care whether the first settled Promise
// fulfilled or rejected.

// ---------------------------------------------------------------------
// 17. Promise.race() does not return the fastest value specifically
// ---------------------------------------------------------------------

const rejectedQuickly = Promise.reject(new Error("Rejected quickly"));

const fulfilledLater = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Fulfilled later");
  }, 100);
});

Promise.race([rejectedQuickly, fulfilledLater]).catch((error) => {
  console.log(error.message);
});

// Rejected quickly

// "Race" means first settlement, not first fulfillment.

// ---------------------------------------------------------------------
// 18. Promise.race() preserves no input ordering
// ---------------------------------------------------------------------

const slowResult = new Promise((resolve) => {
  setTimeout(() => {
    resolve("slow");
  }, 300);
});

const fastResult = new Promise((resolve) => {
  setTimeout(() => {
    resolve("fast");
  }, 100);
});

Promise.race([slowResult, fastResult]).then((result) => {
  console.log(result);
});

// fast

// Unlike Promise.all(), race() returns the result of whichever input
// Promise settles first.

// ---------------------------------------------------------------------
// 19. Promise.race() does not cancel losing operations
// ---------------------------------------------------------------------

const operationA = new Promise((resolve) => {
  setTimeout(() => {
    console.log("Operation A finished");
    resolve("A");
  }, 100);
});

const operationB = new Promise((resolve) => {
  setTimeout(() => {
    console.log("Operation B finished");
    resolve("B");
  }, 300);
});

Promise.race([operationA, operationB]).then((winner) => {
  console.log(`Race result: ${winner}`);
});

// Operation A finished
// Race result: A
// Operation B finished

// The losing operation continues unless the underlying operation
// supports and is explicitly given cancellation.

// ---------------------------------------------------------------------
// 20. Promise.race() for timeouts
// ---------------------------------------------------------------------

function withTimeout(promise, milliseconds) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, milliseconds);
  });

  return Promise.race([promise, timeout]);
}

const operation = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Operation completed");
  }, 500);
});

withTimeout(operation, 200)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error.message);
  });

// Operation timed out

// Promise.race() is useful for implementing a timeout boundary.
// The timeout rejects the wrapper Promise, but it does not automatically
// cancel the underlying operation.

// ---------------------------------------------------------------------
// 21. Promise.any()
// ---------------------------------------------------------------------

const firstAttempt = Promise.reject(new Error("Server 1 unavailable"));

const secondAttempt = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Server 2 response");
  }, 100);
});

const thirdAttempt = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Server 3 response");
  }, 200);
});

Promise.any([firstAttempt, secondAttempt, thirdAttempt]).then((result) => {
  console.log(result);
});

// Server 2 response

// Promise.any() fulfills when the first input Promise fulfills.
// Earlier rejections are ignored as long as another Promise fulfills.

// ---------------------------------------------------------------------
// 22. Promise.any() ignores earlier rejections
// ---------------------------------------------------------------------

Promise.any([
  Promise.reject(new Error("A failed")),
  Promise.reject(new Error("B failed")),
  Promise.resolve("C succeeded"),
]).then((result) => {
  console.log(result);
});

// C succeeded

// Promise.any() is concerned with the first successful fulfillment,
// not the first settlement.

// ---------------------------------------------------------------------
// 23. Promise.any() rejects when everything rejects
// ---------------------------------------------------------------------

Promise.any([
  Promise.reject(new Error("A failed")),
  Promise.reject(new Error("B failed")),
  Promise.reject(new Error("C failed")),
]).catch((error) => {
  console.log(error.name); // "AggregateError"
  console.log(error.errors.length); // 3
});

// If every input Promise rejects, Promise.any() rejects with an
// AggregateError containing the individual rejection reasons.

// ---------------------------------------------------------------------
// 24. AggregateError
// ---------------------------------------------------------------------

Promise.any([Promise.reject(new Error("Server A")), Promise.reject(new Error("Server B"))]).catch((error) => {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors.length); // 2
  console.log(error.errors[0].message); // "Server A"
  console.log(error.errors[1].message); // "Server B"
});

// AggregateError groups multiple errors into one rejection.

// ---------------------------------------------------------------------
// 25. Promise.any() with an empty iterable
// ---------------------------------------------------------------------

Promise.any([]).catch((error) => {
  console.log(error.name); // "AggregateError"
  console.log(error.errors); // []
});

// With no possible fulfillment, Promise.any([]) rejects with
// an AggregateError whose errors array is empty.

// ---------------------------------------------------------------------
// 26. Promise.race() vs. Promise.any()
// ---------------------------------------------------------------------

const rejectedFirst = new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error("Rejected first"));
  }, 100);
});

const fulfilledLater = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Fulfilled later");
  }, 200);
});

Promise.race([rejectedFirst, fulfilledLater]).catch((error) => {
  console.log(`race: ${error.message}`);
});

Promise.any([rejectedFirst, fulfilledLater]).then((result) => {
  console.log(`any: ${result}`);
});

// race: Rejected first
// any: Fulfilled later

// race() settles on the first settlement.
// any() waits for the first fulfillment.

// ---------------------------------------------------------------------
// 27. Promise.all() vs. Promise.allSettled()
// ---------------------------------------------------------------------

const resultA = Promise.resolve("A");
const resultB = Promise.reject(new Error("B failed"));

Promise.all([resultA, resultB]).catch((error) => {
  console.log(`all: ${error.message}`);
});

Promise.allSettled([resultA, resultB]).then((results) => {
  console.log(`allSettled: ${results[0].status}`);
  console.log(`allSettled: ${results[1].status}`);
});

// all: B failed
// allSettled: fulfilled
// allSettled: rejected

// all() requires every input to fulfill.
// allSettled() reports every input regardless of outcome.

// ---------------------------------------------------------------------
// 28. The four main combinators
// ---------------------------------------------------------------------

// Promise.all()
//
// Every Promise must fulfill.
// Result: array of fulfillment values.
// Failure: rejects on the first rejection.

// Promise.allSettled()
//
// Waits for every Promise.
// Result: array of settlement objects.
// Failure: the returned Promise itself does not reject because of
// an input rejection.

// Promise.race()
//
// First Promise to settle wins.
// Result: the first fulfillment value or rejection reason.

// Promise.any()
//
// First Promise to fulfill wins.
// Result: the first fulfillment value.
// Failure: rejects with AggregateError when every input rejects.

// ---------------------------------------------------------------------
// 29. Visual comparison
// ---------------------------------------------------------------------

// Input:
//
// A -> fulfills after 300ms
// B -> rejects after 100ms
// C -> fulfills after 200ms
//
// Promise.all([A, B, C])
// -> rejects after B rejects
//
// Promise.allSettled([A, B, C])
// -> waits for A, B, and C
//
// Promise.race([A, B, C])
// -> rejects after B settles first
//
// Promise.any([A, B, C])
// -> fulfills with C after C fulfills
//
// The key difference is what event each combinator considers decisive.

// ---------------------------------------------------------------------
// 30. Combining API requests with Promise.all()
// ---------------------------------------------------------------------

async function loadPage() {
  const [profile, posts, followers] = await Promise.all([fetchProfile(), fetchPosts(), fetchFollowers()]);

  return {
    profile,
    posts,
    followers,
  };
}

function fetchProfile() {
  return Promise.resolve({ id: 1, name: "John" });
}

function fetchPosts() {
  return Promise.resolve(["Post 1", "Post 2"]);
}

function fetchFollowers() {
  return Promise.resolve(["Alice", "Bob"]);
}

loadPage().then((page) => {
  console.log(page);
});

// This pattern is useful when all pieces of data are required
// before the page can be considered ready.

// ---------------------------------------------------------------------
// 31. Independent UI operations with Promise.allSettled()
// ---------------------------------------------------------------------

async function savePreferences() {
  const results = await Promise.allSettled([saveToDatabase(), syncToCloud(), updateAnalytics()]);

  return results;
}

function saveToDatabase() {
  return Promise.resolve("Database updated");
}

function syncToCloud() {
  return Promise.reject(new Error("Cloud unavailable"));
}

function updateAnalytics() {
  return Promise.resolve("Analytics updated");
}

savePreferences().then((results) => {
  const failed = results.filter((result) => result.status === "rejected");

  console.log(`Failed operations: ${failed.length}`);
});

// One failed operation does not prevent the other independent operations
// from completing.

// ---------------------------------------------------------------------
// 32. Multiple service endpoints with Promise.any()
// ---------------------------------------------------------------------

const primaryServer = Promise.reject(new Error("Primary unavailable"));

const backupServer = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Backup response");
  }, 100);
});

Promise.any([primaryServer, backupServer]).then((response) => {
  console.log(response);
});

// Backup response

// Promise.any() is useful when several equivalent sources can provide
// the same result and the first successful source is sufficient.

// ---------------------------------------------------------------------
// 33. Timeout boundary with Promise.race()
// ---------------------------------------------------------------------

function fetchWithTimeout(request, timeoutMs) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeoutMs);
  });

  return Promise.race([request, timeout]);
}

const request = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Response received");
  }, 100);
});

fetchWithTimeout(request, 500)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error.message);
  });

// Response received

// race() can create a time boundary around an asynchronous operation.

// ---------------------------------------------------------------------
// 34. Promise combinators accept any iterable
// ---------------------------------------------------------------------

const promises = new Set([Promise.resolve("A"), Promise.resolve("B")]);

Promise.all(promises).then((results) => {
  console.log(results);
});

// [ "A", "B" ]

// The combinators accept iterables, not only arrays.
// Arrays are simply the most common input.

// ---------------------------------------------------------------------
// 35. Promise combinators and non-Promise values
// ---------------------------------------------------------------------

Promise.all(new Set([10, "hello", true])).then((results) => {
  console.log(results);
});

// [ 10, "hello", true ]

// Non-Promise values are treated as fulfilled values.

// ---------------------------------------------------------------------
// 36. Thenables
// ---------------------------------------------------------------------

const thenable = {
  then(resolve) {
    resolve("Thenable resolved");
  },
};

Promise.all([thenable]).then((results) => {
  console.log(results);
});

// [ "Thenable resolved" ]

// Promise combinators use Promise resolution semantics, so thenable
// objects can participate in the operation.

// ---------------------------------------------------------------------
// 37. Empty iterable behavior
// ---------------------------------------------------------------------

Promise.all([]).then((result) => {
  console.log(`all: ${result.length}`);
});

Promise.allSettled([]).then((result) => {
  console.log(`allSettled: ${result.length}`);
});

Promise.race([]).then(() => {
  console.log("race fulfilled");
});

// race([]) remains pending because there is no input Promise that can settle it.

Promise.any([]).catch((error) => {
  console.log(`any: ${error.name}`);
});

// all: 0
// allSettled: 0
// any: AggregateError

// The empty-input behavior differs between the combinators.

// ---------------------------------------------------------------------
// 38. Combining combinators
// ---------------------------------------------------------------------

const servers = [Promise.resolve("Server A"), Promise.resolve("Server B")];

Promise.any(servers)
  .then((server) => {
    return Promise.all([fetchProfile(), fetchPosts()]);
  })
  .then(([profile, posts]) => {
    console.log(profile);
    console.log(posts);
  });

// Combinators can be composed when an application needs multiple
// layers of asynchronous coordination.

// ---------------------------------------------------------------------
// 39. Error handling with Promise.all()
// ---------------------------------------------------------------------

async function loadRequiredData() {
  try {
    const [user, settings] = await Promise.all([fetchUser(), fetchSettings()]);

    return {
      user,
      settings,
    };
  } catch (error) {
    console.log("Could not load required data");
    throw error;
  }
}

loadRequiredData().catch((error) => {
  console.log(error.message);
});

// If either required operation fails, the combined operation fails.

// ---------------------------------------------------------------------
// 40. Choosing the right combinator
// ---------------------------------------------------------------------

// Use Promise.all() when:
//
// - every operation must succeed
// - results from all operations are required
// - operations are independent and can start together
//
// Use Promise.allSettled() when:
//
// - every operation should be allowed to finish
// - individual failures should be reported
// - partial success is useful
//
// Use Promise.race() when:
//
// - the first settlement determines the result
// - a timeout boundary is required
// - the first completion, whether success or failure, matters
//
// Use Promise.any() when:
//
// - the first successful result is enough
// - failures should be ignored until every option fails
// - multiple equivalent fallback sources are available

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - Promise.all() waits for all inputs and rejects when one rejects.
// - Promise.allSettled() waits for all inputs and reports each outcome.
// - Promise.race() settles when the first input settles.
// - Promise.any() fulfills when the first input fulfills.
// - Promise.any() rejects with AggregateError when every input rejects.
// - Promise.all() preserves the input order in its result array.
// - Promise.allSettled() also preserves input order in its result array.
// - Promise.race() and Promise.any() return the result of the Promise
//   that determines their outcome, not an array of all results.
// - Promise combinators do not automatically cancel underlying operations.
// - Non-Promise values can be supplied to the combinators.
// - The combinators accept iterables, not only arrays.
// - Empty iterables have different semantics for each combinator.
// - Promise.all() is useful when every result is required.
// - Promise.allSettled() is useful when partial success is acceptable.
// - Promise.race() is useful for first-settlement and timeout patterns.
// - Promise.any() is useful when any successful source is sufficient.
// - Choosing the combinator based on the required failure semantics
//   is more important than choosing one based only on timing.

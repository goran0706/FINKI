/**
 * Timers
 * ======
 *
 * JavaScript timers schedule callbacks to run after a specified delay or
 * repeatedly at an interval. Timers are asynchronous scheduling mechanisms,
 * not guarantees that a callback will execute at an exact time.
 */

// ---------------------------------------------------------------------
// 1. setTimeout()
// ---------------------------------------------------------------------

console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 1000);

console.log("End");

// Start
// End
// Timeout callback

// setTimeout() schedules a callback to run after the specified delay.
// The callback does not execute immediately after setTimeout() is called.

// ---------------------------------------------------------------------
// 2. The delay is a minimum delay
// ---------------------------------------------------------------------

const start = Date.now();

setTimeout(() => {
  const elapsed = Date.now() - start;

  console.log(`Callback executed after approximately ${elapsed}ms`);
}, 100);

// The callback becomes eligible after the delay has elapsed.
// Other synchronous work or event-loop activity can delay execution.

// ---------------------------------------------------------------------
// 3. A 0ms timeout is asynchronous
// ---------------------------------------------------------------------

console.log("First");

setTimeout(() => {
  console.log("Second");
}, 0);

console.log("Third");

// First
// Third
// Second

// A delay of 0 does not mean "run immediately".
// The callback must wait until the current synchronous job finishes.

// ---------------------------------------------------------------------
// 4. setTimeout() returns a timer ID
// ---------------------------------------------------------------------

const timerId = setTimeout(() => {
  console.log("This callback will run");
}, 1000);

console.log(timerId);

// In browsers, the returned value is a numeric timer ID.
// In Node.js, the returned value is a Timeout object.

// The returned value can be passed to clearTimeout().

// ---------------------------------------------------------------------
// 5. Canceling a timeout
// ---------------------------------------------------------------------

const timeoutId = setTimeout(() => {
  console.log("This will not run");
}, 1000);

clearTimeout(timeoutId);

console.log("Timeout canceled");

// clearTimeout() prevents the scheduled callback from running
// if it has not already started executing.

// ---------------------------------------------------------------------
// 6. Clearing an already completed timeout
// ---------------------------------------------------------------------

const completedTimer = setTimeout(() => {
  console.log("Timer completed");
}, 0);

setTimeout(() => {
  clearTimeout(completedTimer);

  console.log("clearTimeout() called after completion");
}, 100);

// Clearing a timer after its callback has already executed
// has no practical effect.

// ---------------------------------------------------------------------
// 7. Multiple timers
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Timer 1");
}, 300);

setTimeout(() => {
  console.log("Timer 2");
}, 100);

setTimeout(() => {
  console.log("Timer 3");
}, 200);

// Timer 2
// Timer 3
// Timer 1

// Timers with different delays become eligible at different times.
// Their callbacks are then processed by the event loop.

// ---------------------------------------------------------------------
// 8. Timer registration order
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("First timer");
}, 0);

setTimeout(() => {
  console.log("Second timer");
}, 0);

setTimeout(() => {
  console.log("Third timer");
}, 0);

// First timer
// Second timer
// Third timer

// When timers become eligible in the same scheduling window,
// their callbacks are generally processed according to registration order.
// Exact scheduling behavior is host-dependent.

// ---------------------------------------------------------------------
// 9. setInterval()
// ---------------------------------------------------------------------

let count = 0;

const intervalId = setInterval(() => {
  count++;

  console.log(`Interval: ${count}`);

  if (count === 3) {
    clearInterval(intervalId);
  }
}, 1000);

// Interval: 1
// Interval: 2
// Interval: 3

// setInterval() repeatedly schedules the callback until clearInterval()
// is called or the environment otherwise stops the interval.

// ---------------------------------------------------------------------
// 10. Canceling an interval
// ---------------------------------------------------------------------

let seconds = 0;

const interval = setInterval(() => {
  seconds++;

  console.log(`Seconds: ${seconds}`);

  if (seconds >= 5) {
    clearInterval(interval);
  }
}, 1000);

// Seconds: 1
// Seconds: 2
// Seconds: 3
// Seconds: 4
// Seconds: 5

// clearInterval() stops future executions of the interval callback.

// ---------------------------------------------------------------------
// 11. setInterval() returns an ID
// ---------------------------------------------------------------------

const intervalTimerId = setInterval(() => {
  console.log("Running...");
}, 1000);

console.log(intervalTimerId);

clearInterval(intervalTimerId);

// The returned value identifies the interval and can be passed
// to clearInterval().

// ---------------------------------------------------------------------
// 12. setTimeout() can be used for one-time scheduling
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Run once");
}, 1000);

// setTimeout() schedules one callback execution.
// Once the callback has run, that timer does not repeat automatically.

// ---------------------------------------------------------------------
// 13. setInterval() can be used for repeated scheduling
// ---------------------------------------------------------------------

let attempts = 0;

const retryInterval = setInterval(() => {
  attempts++;

  console.log(`Attempt ${attempts}`);

  if (attempts === 3) {
    clearInterval(retryInterval);
  }
}, 500);

// Attempt 1
// Attempt 2
// Attempt 3

// setInterval() is appropriate when repeated scheduling is actually
// required and the callback can safely run on that schedule.

// ---------------------------------------------------------------------
// 14. Recursive setTimeout()
// ---------------------------------------------------------------------

let iteration = 0;

function runAgain() {
  iteration++;

  console.log(`Iteration ${iteration}`);

  if (iteration < 3) {
    setTimeout(runAgain, 500);
  }
}

setTimeout(runAgain, 500);

// Iteration 1
// Iteration 2
// Iteration 3

// Recursive setTimeout() schedules the next execution only after
// the current callback has completed.

// ---------------------------------------------------------------------
// 15. setInterval() vs. recursive setTimeout()
// ---------------------------------------------------------------------

let intervalCount = 0;

const id = setInterval(() => {
  intervalCount++;

  // Simulate work performed during the callback.
  console.log(`Interval execution ${intervalCount}`);

  if (intervalCount === 3) {
    clearInterval(id);
  }
}, 1000);

// With setInterval(), the timer mechanism continues scheduling
// according to its interval. The callback itself must still wait
// for the event loop to become available.

// Recursive setTimeout() gives the callback explicit control over
// when the next timer is scheduled:
//
// function execute() {
//   // Work...
//   setTimeout(execute, 1000);
// }

// ---------------------------------------------------------------------
// 16. Timer callbacks cannot interrupt synchronous code
// ---------------------------------------------------------------------

console.log("Before");

setTimeout(() => {
  console.log("Timer");
}, 0);

const startTime = Date.now();

while (Date.now() - startTime < 500) {
  // Deliberately block the JavaScript thread.
}

console.log("After");

// Before
// After
// Timer

// The timer cannot execute while synchronous JavaScript is blocking
// the thread that must process its callback.

// ---------------------------------------------------------------------
// 17. Timers and the event loop
// ---------------------------------------------------------------------

console.log("Synchronous");

setTimeout(() => {
  console.log("Timer");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask");
});

// Synchronous
// Microtask
// Timer

// Promise callbacks are microtasks.
// Timer callbacks are tasks.
// Microtasks are processed before the event loop proceeds to the timer task.

// ---------------------------------------------------------------------
// 18. Timer callback creates a microtask
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Timer");

  Promise.resolve().then(() => {
    console.log("Microtask from timer");
  });
}, 0);

setTimeout(() => {
  console.log("Second timer");
}, 0);

// Timer
// Microtask from timer
// Second timer

// After the first timer callback finishes, its microtask can run
// before the event loop proceeds to another timer task.

// ---------------------------------------------------------------------
// 19. Passing arguments to setTimeout()
// ---------------------------------------------------------------------

function greet(name, role) {
  console.log(`Hello, ${name}. You are a ${role}.`);
}

setTimeout(greet, 1000, "John", "developer");

// Hello, John. You are a developer.

// Additional arguments supplied to setTimeout() are passed to
// the callback when it executes.

// ---------------------------------------------------------------------
// 20. Passing arguments to setInterval()
// ---------------------------------------------------------------------

function reportStatus(status) {
  console.log(`Status: ${status}`);
}

const statusInterval = setInterval(reportStatus, 1000, "active");

setTimeout(() => {
  clearInterval(statusInterval);
}, 3500);

// Status: active
// Status: active
// Status: active

// Additional arguments can also be supplied to setInterval().

// ---------------------------------------------------------------------
// 21. Prefer closures for complex timer state
// ---------------------------------------------------------------------

function startCounter(limit) {
  let count = 0;

  const id = setInterval(() => {
    count++;

    console.log(`Count: ${count}`);

    if (count >= limit) {
      clearInterval(id);
    }
  }, 1000);
}

startCounter(3);

// Count: 1
// Count: 2
// Count: 3

// A closure keeps the counter state available to the timer callback.

// ---------------------------------------------------------------------
// 22. Debounce with setTimeout()
// ---------------------------------------------------------------------

function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

const saveSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

saveSearch("j");
saveSearch("ja");
saveSearch("jav");
saveSearch("java");

// Searching for: java

// Each call cancels the previous timer.
// Only the final call remains scheduled after the user stops triggering
// the debounced function.

// ---------------------------------------------------------------------
// 23. Debounce in a UI
// ---------------------------------------------------------------------

// In a browser:
//
// const handleSearch = debounce((event) => {
//   console.log("Search:", event.target.value);
// }, 300);
//
// input.addEventListener("input", handleSearch);
//
// Debouncing is useful when an event can fire many times in a short period,
// such as typing into a search field.

// ---------------------------------------------------------------------
// 24. Throttle with setTimeout()
// ---------------------------------------------------------------------

function throttle(callback, delay) {
  let waiting = false;

  return (...args) => {
    if (waiting) {
      return;
    }

    waiting = true;
    callback(...args);

    setTimeout(() => {
      waiting = false;
    }, delay);
  };
}

const handleScroll = throttle(() => {
  console.log("Scroll handler");
}, 200);

handleScroll();
handleScroll();
handleScroll();

// Scroll handler

// Throttling limits how frequently a function can execute.
// Unlike debouncing, throttling does not wait for the activity to stop.

// ---------------------------------------------------------------------
// 25. Timer cleanup
// ---------------------------------------------------------------------

function startPolling() {
  const intervalId = setInterval(() => {
    console.log("Polling...");
  }, 1000);

  return () => {
    clearInterval(intervalId);
    console.log("Polling stopped");
  };
}

const stopPolling = startPolling();

setTimeout(() => {
  stopPolling();
}, 3500);

// Polling...
// Polling...
// Polling...
// Polling stopped

// Returning a cleanup function makes ownership of the timer explicit.

// ---------------------------------------------------------------------
// 26. React timer cleanup
// ---------------------------------------------------------------------

// In React, timers created by an effect should normally be cleaned up
// when the effect is no longer active:
//
// useEffect(() => {
//   const timeoutId = setTimeout(() => {
//     console.log("Finished");
//   }, 1000);
//
//   return () => {
//     clearTimeout(timeoutId);
//   };
// }, []);
//
// Cleanup prevents an obsolete timer from continuing after the effect
// has been cleaned up.

// ---------------------------------------------------------------------
// 27. React interval cleanup
// ---------------------------------------------------------------------

// A repeating timer also requires cleanup:
//
// useEffect(() => {
//   const intervalId = setInterval(() => {
//     setSeconds((value) => value + 1);
//   }, 1000);
//
//   return () => {
//     clearInterval(intervalId);
//   };
// }, []);
//
// The cleanup function prevents the interval from continuing after
// the component/effect is no longer using it.

// ---------------------------------------------------------------------
// 28. Timer IDs and cleanup ownership
// ---------------------------------------------------------------------

let activeTimer = null;

function startTimer() {
  if (activeTimer !== null) {
    clearTimeout(activeTimer);
  }

  activeTimer = setTimeout(() => {
    console.log("Timer finished");
    activeTimer = null;
  }, 1000);
}

function cancelTimer() {
  if (activeTimer !== null) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}

startTimer();
cancelTimer();

// Keeping the active timer ID makes cancellation explicit and prevents
// accidentally leaving an obsolete timer scheduled.

// ---------------------------------------------------------------------
// 29. Timers are not clocks
// ---------------------------------------------------------------------

let tick = 0;

const clockInterval = setInterval(() => {
  tick++;

  console.log(`Tick ${tick}`);

  if (tick === 3) {
    clearInterval(clockInterval);
  }
}, 1000);

// setInterval() should not be treated as a precise clock.
// Delays can be affected by synchronous work, event-loop scheduling,
// browser throttling, system load, and other host-environment behavior.

// ---------------------------------------------------------------------
// 30. Measuring elapsed time
// ---------------------------------------------------------------------

const startedAt = Date.now();

setTimeout(() => {
  const elapsed = Date.now() - startedAt;

  console.log(`Elapsed time: ${elapsed}ms`);
}, 500);

// When measuring elapsed time, record the actual start time and calculate
// the elapsed duration when the callback executes.

// ---------------------------------------------------------------------
// 31. Timer delay and heavy work
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("Timer callback");
}, 100);

const blockingStart = Date.now();

while (Date.now() - blockingStart < 1000) {
  // Deliberately block execution.
}

console.log("Blocking work finished");

// Blocking work finished
// Timer callback

// Although the timer delay was only 100ms, the callback cannot execute
// until the blocking synchronous work releases the JavaScript thread.

// ---------------------------------------------------------------------
// 32. Nested timers
// ---------------------------------------------------------------------

setTimeout(() => {
  console.log("First timer");

  setTimeout(() => {
    console.log("Second timer");

    setTimeout(() => {
      console.log("Third timer");
    }, 500);
  }, 500);
}, 500);

// First timer
// Second timer
// Third timer

// Timers can schedule additional timers.
// Each nested callback is a separate asynchronous execution step.

// ---------------------------------------------------------------------
// 33. setTimeout() as a scheduling boundary
// ---------------------------------------------------------------------

console.log("Before");

setTimeout(() => {
  console.log("Later");
}, 0);

console.log("After");

// Before
// After
// Later

// A 0ms timer is sometimes used to defer work until the current
// synchronous execution has completed.

// ---------------------------------------------------------------------
// 34. Do not use string-based timer callbacks
// ---------------------------------------------------------------------

// Avoid:
//
// setTimeout("console.log('Hello')", 1000);
//
// Prefer:
//
// setTimeout(() => {
//   console.log("Hello");
// }, 1000);
//
// Passing a function is clearer, safer, and avoids evaluating
// JavaScript source code from a string.

// ---------------------------------------------------------------------
// 35. Common timer mistakes
// ---------------------------------------------------------------------

// Mistake 1: assuming 0ms means immediate execution.
//
// setTimeout(callback, 0);

// Mistake 2: forgetting to clear an interval.
//
// const id = setInterval(callback, 1000);
// clearInterval(id);

// Mistake 3: assuming timers execute at exact times.
//
// setTimeout(callback, 1000);

// Mistake 4: blocking the event loop and expecting timers to run.
//
// while (blockingWork) {
//   // Timer callbacks cannot interrupt this work.
// }

// Mistake 5: creating timers without cleanup in long-lived UI code.
//
// useEffect(() => {
//   const id = setInterval(callback, 1000);
//
//   return () => {
//     clearInterval(id);
//   };
// }, []);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - setTimeout() schedules a callback for a later task.
// - setInterval() schedules repeated timer callbacks.
// - clearTimeout() cancels a pending timeout.
// - clearInterval() cancels a pending interval.
// - A 0ms delay does not execute a callback immediately.
// - Timer delays are minimum delays, not exact execution guarantees.
// - Synchronous JavaScript can delay timer callbacks.
// - Promise callbacks and queueMicrotask() callbacks run before timer tasks
//   when their microtasks are pending.
// - Recursive setTimeout() can provide more control than setInterval().
// - Debouncing delays execution until triggering activity stops.
// - Throttling limits how frequently execution can occur.
// - Timer IDs should be retained when later cleanup is required.
// - React effects should clean up timers and intervals.
// - Timers are scheduling mechanisms, not precision clocks.
// - Avoid blocking the event loop when timers and responsive UI matter.

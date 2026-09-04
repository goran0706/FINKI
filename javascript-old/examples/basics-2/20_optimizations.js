/* Writing Optimized Code */

{
  /* inline caching done by JavaScript */
  const person = { fname: "John", lname: "Doe" };

  function findUser(person) {
    return `Found ${person.fname} + ${person.lname}`;
  }

  findUser(person);
  findUser(person);
  findUser(person); // calling the function several times eventually it will get optimized to just `Found John Doe`
}

{
  /* hidden classes */
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  const point1 = new Point();
  point1.x = 1;
  point1.y = 2;

  const point2 = new Point(); // always instantiate object properties in the same order they were declared
  point2.y = 1;
  point2.x = 2;
}

{
  /* try block code optimization */
  try {
    for (let i = 0; i < 100; i++) {
      console.log("expensive computation");
    }

    for (let i = 0; i < 100; i++) {
      console.log("another expensive computation");
    }
  } catch {}

  // Try code blocks are not automatically optimized by the JavaScript profiler/compiler.
  // Instead extract the code into functions and call them from inside the try block.
  function expensiveComputation() {
    for (let i = 0; i < 100; i++) {
      console.log("expensive computation");
    }
  }

  function anotherExpensiveComputation() {
    for (let i = 0; i < 100; i++) {
      console.log("another expensive computation");
    }
  }

  try {
    expensiveComputation();
    anotherExpensiveComputation();
  } catch {}
}

{
  /* Memoization */
  function slow(x) {
    if (slow.x) {
      return slow.x;
    } else {
      let result;
      // some expensive calculation...
      slow.x = result;
      return result;
    }
  }

  // caching decorator for single argument
  function cachingDecorator(func) {
    const map = new WeakMap();
    return function (key) {
      if (map.has(key)) return map.get(key);
      let result = func(key);
      map.set(key, result);
      return result;
    };
  }

  // caching decorator that supports multiple arguments and objects methods, by forwarding the context 'this'
  function cachingDecorator(func, hash) {
    const cache = new WeakMap();
    return function () {
      const key = hash(arguments);
      if (cache.has(key)) return cache.get(key);
      const result = func.call(this, ...arguments);
      cache.set(key, result);
      return result;
    };
  }

  // memoized fibonacci
  function fibonacciMemo(n, memo) {
    memo = memo || {};
    if (memo[n]) return memo[n];
    if (n <= 1) return 1;
    return (memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo));
  }
}

{
  /* Avoid memory leaks */

  // memory leaks with global variables
  var a = 10;
  a = { a: 1 };
  a = 1;
  b = 10;

  // avoid silly mistakes like this - missing keyword var, let or const
  for (i = 0; i < 3; i++) {
    console.log("i is a global variable");
  }

  function foo() {
    // the number has been reassigned, so nothing references the number object anymore.
    // the JavaScript garbage collector should mark it and sweep it from memory, releasing the allocated memory space.
    let number = { type: "number", value: 100 };
    number = 100;
    return number;
  }

  // Memory leaks when switching between pages in Single Page Applications. Prevent adding up event listeners without removing them.
  let element = document.body;
  element.addEventListener("click", () => {});

  // correct way to handle events
  const eventHandler = () => {};
  element.addEventListener("click", eventHandler);
  element.removeEventListener("click", eventHandler);

  // don't forget to clean up the timers and intervals.
  // Any referenced objects will not be cleared from the memory because the interval is still running.
  setTimeout(() => {}, 1000);
  setInterval(() => {}, 1000);

  const timeoutId = setTimeout(() => {}, 1000);
  const intervalId = setInterval(() => {}, 1000);

  clearTimeout(timeoutId);
  clearInterval(intervalId);
}

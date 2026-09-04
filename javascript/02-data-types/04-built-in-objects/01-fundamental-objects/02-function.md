# Function

## Concept and ECMAScript Specification

The `Function` constructor creates function objects capable of being called and instantiated. In ECMAScript, every
function is an instance of `Function` and inherits from `Function.prototype`. Functions in ECMAScript are first-class
citizens and exotic objects that implement the `[[Call]]` internal method, allowing them to be invoked, and optionally
the `[[Construct]]` internal method, allowing them to be instantiated with the `new` operator.

| Characteristic               | ECMAScript Specification Behavior                                                                                          |
|:-----------------------------|:---------------------------------------------------------------------------------------------------------------------------|
| Internal Slots               | Every callable object implements `[[Call]]`; instantiable functions also implement `[[Construct]]`                         |
| Prototype Hierarchy          | Inherits directly from `Function.prototype`, whose own prototype points to `Object.prototype`                              |
| Dynamic Creation             | Evaluates code strings into executable function instances via the `Function()` constructor using `ToString` operations     |
| Standard Instance Properties | Implements `name` (string identifying the function) and `length` (number of expected parameters excluding rest parameters) |

## Function Prototype Properties and Methods

The `Function.prototype` object provides essential execution context controls and method binding operations. These
methods manipulate the `this` binding, modify arguments arrays, or generate explicit function instances bound to fixed
execution environments.

| Method                                         | Specification Behavior                                                                                       |
|:-----------------------------------------------|:-------------------------------------------------------------------------------------------------------------|
| `Function.prototype.call(thisArg, ...args)`    | Invokes `[[Call]]` with an explicit `thisArg` context and individual arguments passed directly               |
| `Function.prototype.apply(thisArg, argsArray)` | Invokes `[[Call]]` with an explicit `thisArg` context and arguments unpacked from an array-like object       |
| `Function.prototype.bind(thisArg, ...args)`    | Creates a new bound function exotic object overriding `thisArg` and pre-pending initial arguments            |
| `Function.prototype.toString()`                | Returns a source code text representation of the function compliant with the `NativeFunction` syntax grammar |

**When to reach for which:**

| Need                                                        | Use                                                                                    |
|:------------------------------------------------------------|:---------------------------------------------------------------------------------------|
| Call once, right now, with individually-listed arguments    | `call()`                                                                               |
| Call once, right now, with arguments already in an array    | `apply()`                                                                              |
| Produce a reusable function with `this` locked in for later | `bind()`                                                                               |
| Spread an array into a normal call without changing `this`  | Spread syntax (`fn(...args)`) — modern replacement for `apply()` in this specific case |

## Invocation Mechanisms and Function Types

ECMAScript defines multiple syntax forms for function expressions, declarations, arrow functions, and class
constructors. Differences in internal slots determine whether a function form supports `this` lexical binding, generator
pauses, or object construction.

| Function Form                     | Implements `[[Construct]]` | `this` Binding Behavior                                                          |
|:----------------------------------|:---------------------------|:---------------------------------------------------------------------------------|
| Standard Declaration / Expression | Yes                        | Dynamically determined by invocation pattern                                     |
| Arrow Function                    | No                         | Lexically bound from the enclosing execution context                             |
| Method Shorthand                  | No                         | Dynamically determined by object target upon invocation                          |
| Class Constructor                 | Yes                        | Dynamically bound, requires `new` invocation (throws `TypeError` on direct call) |

**Decision guide — which form to write:**

| Condition                                                                          | Use                                                     |
|:-----------------------------------------------------------------------------------|:--------------------------------------------------------|
| Needs `this` to refer to *whoever calls it* (an object method)                     | Standard function / method shorthand                    |
| Needs `this` to refer to the *surrounding* scope (a callback inside a method)      | Arrow function                                          |
| Will be used with `new` to construct instances                                     | Standard declaration or class constructor — never arrow |
| Needs to be hoisted and callable before its definition line                        | Function declaration — not an expression, not arrow     |
| Is a one-line, non-method utility (array callback, event handler, promise `.then`) | Arrow function                                          |

## Use Cases

**`call()` / `apply()` — use when:**

* Borrowing a method from one object to run against another without permanently attaching it:
  `Array.prototype.slice.call(arrayLikeObject)` to convert an `arguments` object or NodeList into a real array.
* Invoking a function once with a specific `this` you already have on hand and don't need to reuse — a one-off, not a
  pattern you'll repeat.
* `apply()` specifically when the arguments already exist as an array (e.g., `Math.max.apply(null, numbersArray)` before
  spread syntax existed — modern code should prefer `Math.max(...numbersArray)` instead).

**`bind()` — use when:**

* Passing an object method as a callback where `this` would otherwise be lost — e.g.,
  `element.addEventListener('click', this.handleClick.bind(this))` inside a class, so `handleClick` still refers to the
  right instance when the browser invokes it.
* Pre-filling ("partially applying") some arguments of a function ahead of time to create a more specific, reusable
  version: `const double = multiply.bind(null, 2);`.
* You need the *same* bound function reference multiple times (e.g., to later `removeEventListener` it) — bind once,
  store the reference, reuse it; binding inline on every call creates a new function each time and breaks reference
  equality.

**Arrow functions — use when:**

* Writing a callback inside a method that needs access to the enclosing `this` (e.g., a `setTimeout` or array callback
  inside a class method that should still refer to the instance).
* Writing short, non-method utility functions — array transformations (`.map()`, `.filter()`), one-line event handlers,
  promise chains — where there's no `this` concern at all.

**Arrow functions — do NOT use when:**

* Defining an object or class **method** that needs `this` to refer to the object it's called on — an arrow method
  captures `this` from where it was *defined* (often the outer/module scope), not from the caller, which silently breaks
  the method.
* Writing a constructor function meant to be used with `new` — arrows have no `[[Construct]]`, so `new ArrowFn()` throws
  immediately.
* You need access to `arguments` — arrows don't have their own `arguments` object; they inherit the enclosing scope's
  (or none exists), so use a standard function if you need it.

**Function declarations vs expressions — use a declaration when:**

* The function needs to be callable from code that runs *before* its definition appears in the file (hoisting) — common
  for a "main entry point" defined at the top calling helpers defined further down.

**Use an expression (including arrow) when:**

* You want the function's availability strictly tied to execution order — no hoisting surprises — or you're assigning it
  conditionally, passing it inline as an argument, or storing it in a data structure.

**The `Function()` constructor and dynamic code evaluation — use when:**

* Almost never in application code. Legitimate uses are narrow: certain sandboxed code-generation tools or template
  compilers that must build a function from a runtime-determined string. If you're reaching for it to "just try
  something," this is a sign to reconsider — see Best Practices below.

**Class constructors — use when:**

* You need multiple objects with shared, prototype-based behavior and a fixed initialization sequence — this is the
  standard case, so "use a class constructor" is close to a default whenever `new` is involved, not a narrow case like
  the others above.

## Best Practices

* **Use arrow functions specifically when you need the *enclosing* `this` — not as a blanket default for every function
  you write.** The deciding condition is: "does this function need to know who called it, or does it need to inherit
  `this` from where it's written?" Object/class methods need the former (regular function); nested callbacks inside a
  method usually need the latter (arrow). Defaulting to arrows everywhere silently breaks the method case.
* **Avoid the `Function()` constructor whenever the code string isn't coming from a fully trusted, non-user source.**
  The condition that makes this dangerous is dynamic input — if the string being evaluated could ever contain
  user-influenced data, this is an injection vector equivalent to `eval()`. If the string is a fixed literal known at
  write-time, there's rarely a reason to use `Function()` over just writing the function normally, so the safe answer is
  almost always "don't."
* **Use rest parameters (`...args`) instead of `arguments` whenever the function is not a legacy codebase you're
  maintaining as-is.** The `arguments` object is array-like but not a real array (no `.map()`/`.filter()` without
  conversion), doesn't exist in arrow functions, and blocks certain engine optimizations — there's no case where a
  `arguments`-based new function is actually preferable to rest parameters.
* **Recompute `length` expectations whenever a function has default parameters — `length` only counts parameters
  *before* the first one with a default.** `function f(a, b = 1, c)` has `length === 1`, not 3. If code relies on
  `length` for validation or introspection (e.g., a dependency-injection resolver reading parameter count), this
  mismatch will silently produce wrong results — either avoid relying on `length` with defaults present, or document the
  discrepancy explicitly.
* **Bind once and store the reference whenever the same bound function will be called or removed more than once — never
  `bind()` inline inside a render loop or a repeated event-handler setup.** Each `.bind()` call allocates a new function
  object; calling it fresh every render (React) or every loop iteration means a new object every time, which is wasted
  allocation and — critically — breaks `removeEventListener` (which needs the exact same function reference used in
  `addEventListener`).
* **Choose arrow functions as object methods only when you deliberately want `this` to be lexical, not dynamic — this is
  rare and should be a documented exception, not an accident.** The one legitimate case: a class field arrow method used
  specifically so the method stays bound to the instance even when passed around as a bare reference (a common pattern
  for React class component handlers before hooks). Outside that specific case, an arrow method is usually a bug waiting
  to surface once someone calls it as `obj.method()` and expects normal `this` semantics.
* **Validate parameter counts and types explicitly whenever a function is part of a public API surface — internal helper
  functions with a controlled, small set of callers can skip this.** The condition here is exposure surface: a function
  only ever called from three known internal places doesn't need defensive checks; an exported utility or public API
  method does, since it will eventually be called with the wrong shape of arguments by someone (including future-you).
* **Never attach custom methods to `Function.prototype` — there is no condition under which this is the right call in
  application code.** Unlike some prototype extensions that are debatable, this one affects literally every function in
  the runtime, including third-party library internals, making collisions essentially guaranteed at scale.
* **Prefer spread syntax (`fn(...args)`) over `apply()` whenever `this`-binding isn't the reason you reached for
  `apply()` in the first place.** If the *only* thing `apply()` is doing is unpacking an array into arguments (not
  setting a custom `this`), spread syntax does the same thing with less machinery and reads more clearly; keep `apply()`
  specifically for the case where you also need to control `this`.
* **Enforce `new`-only invocation on class constructors and constructor-style functions whenever the function performs
  `this`-dependent initialization that would corrupt global/undefined state if called without `new`.** In non-strict
  mode, calling a constructor-style function without `new` binds `this` to the global object instead of a new instance —
  a real, dangerous default. Classes already throw automatically on direct calls; hand-written constructor functions
  need an explicit `new.target` check if this is a real risk in your codebase.
* **Keep utility/transformation functions pure (no reliance on or mutation of outer closure state) specifically when the
  function will be reused, tested independently, or run concurrently — a one-off inline callback used exactly once
  doesn't need this rigor.** The condition is reusability and testability, not purity as a universal rule; a tiny
  one-line arrow passed directly to a single `.map()` call is fine to reference a local variable if it's never going to
  be extracted or reused elsewhere.
* **Name function expressions explicitly whenever the function is complex enough that its identity would matter in a
  stack trace or profiler — trivial one-line arrows in a `.map()`/`.filter()` chain don't need it.**
  `const processOrder = function processOrder(order) {...}` (rather than a bare anonymous `function(order) {...}`)
  preserves the name in stack traces even if the variable is later reassigned or the function is passed around.
* **Guard recursive functions with an explicit, reachable base case whenever recursion depth is input-dependent rather
  than fixed** — a fixed, small, hardcoded recursion depth (e.g., always exactly 3 levels) is safe without extra guards;
  recursion driven by user input or unbounded data structures (tree traversal, deep object walking) needs an explicit
  depth limit or iterative fallback to avoid `RangeError: Maximum call stack size exceeded` on unexpectedly large input.
* **Use concise arrow bodies (`x => x * 2`) only when the entire function body is a single return expression with no
  intermediate steps — switch to a block body the moment you need a local variable, a conditional, or a debugging
  `console.log`.** Forcing multi-step logic into a concise body via comma operators or nested ternaries to "keep it one
  line" trades real readability for a stylistic preference; the condition for concise-body use is genuine simplicity,
  not code golf.
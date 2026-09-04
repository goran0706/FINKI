# JavaScript Keywords

## Variable & Binding Declarations

* **var:** Declares a function-scoped or globally scoped variable. It initializes with a value of `undefined` during the
  context creation phase (hoisting) and completely ignores structural block brackets `{}`.

* **let:** Declares a block-scoped variable allocation. It is reserved in an uninitialized status inside the Temporal
  Dead Zone (TDZ) during scope creation and remains unreadable until its actual declaration line evaluates.

* **const:** Declares an immutable block-scoped binding layout. It forces mandatory initial value assignment upon
  declaration line evaluation. The reference binding is locked permanently, though any underlying heap object values it
  points to can still be modified.

## Function Declarations

* **function:** Declares a callable function object block. Function declarations are hoisted completely along with their
  internal logic statements, allowing invocation anywhere within their parent execution scope.

## Class Declarations

* **class:** Declares a syntax template blueprint representing prototype-based inheritance structures. Class
  declarations are block-scoped and are not hoisted with initialization, requiring definition prior to execution usage.

* **extends:** Establishes prototype inheritance between classes.

* **super:** References the parent class constructor or parent prototype methods within derived classes.

* **static:** Declares class members that belong to the class constructor itself rather than individual instances.

* **get:** Defines a getter accessor method for an object or class property.

* **set:** Defines a setter accessor method for an object or class property.

## Flow Control

* **if:** Evaluates a boolean expression and conditionally executes a statement block only when the expression resolves
  to a truthy value.

* **else:** Defines an alternative execution branch when the preceding `if` condition evaluates to a falsy value.

* **switch:** Performs multi-way conditional branching by comparing a single expression against multiple `case` labels
  using strict equality (`===`).

* **case:** Represents an individual comparison branch inside a `switch` statement.

* **default:** Defines the fallback execution branch within a `switch` statement when no `case` label matches.

* **break:** Immediately terminates execution of the current loop or `switch` statement and transfers control to the
  following statement.

* **continue:** Skips the remaining statements of the current loop iteration and proceeds directly to the next
  iteration.

* **return:** Terminates current functional execution paths, handing thread control back to the caller while optionally
  yielding a specific computed expression value.

## Loops

* **for:** Creates a loop structure with optional initialization, condition testing, and iteration expressions.

* **for...in:** Iterates over the enumerable property names (keys) of an object.

* **for...of:** Iterates over the values produced by an iterable object such as arrays, strings, maps, sets, and
  generators.

* **while:** Repeatedly executes a statement block while a specified condition remains truthy.

* **do:** Executes a statement block once before evaluating the associated `while` condition, guaranteeing at least one
  iteration.

## Error Handling

* **try:** Defines a protected execution block whose runtime exceptions can be intercepted.

* **catch:** Receives and handles exceptions thrown within the associated `try` block.

* **finally:** Executes after a `try`/`catch` sequence regardless of whether an exception occurred.

* **throw:** Explicitly raises an exception object, immediately interrupting normal execution flow.

## Asynchronous & Generator Operations

* **async:** Marks a function as asynchronous, automatically causing it to return a Promise and enabling use of `await`
  within its body.

* **await:** Suspends execution of an `async` function until a Promise settles, then resumes with its fulfilled value or
  throws its rejection reason.

* **yield:** Temporarily pauses execution of a generator function, returning a value while preserving internal execution
  state.

* **yield\*:** Delegates generator control to another iterable or generator object.

## Modules

* **import:** Declares dependencies on exported bindings from another ECMAScript module.

* **export:** Exposes variables, functions, classes, or values from the current module for external consumption.

## Operators & Runtime Keywords

* **this:** A contextual reference property. Its target identity is not statically bound during compilation but is
  evaluated dynamically at runtime based entirely on how a function is called (e.g., method invocation vs. simple
  invocation).

* **new:** An instantiation operator. It constructs an empty, raw object instance, links that instance's internal
  prototype pointer (`[[Prototype]]`) to the constructor function's public `prototype` object, locks the context `this`
  binding to the new instance, and returns it.

* **typeof:** A unary operator evaluation that returns a string identifier detailing the primary structural primitive or
  object data type category of an expression (e.g., `"string"`, `"number"`, `"object"`).

* **instanceof:** A binary evaluation operator that traverses an object's prototype chain structure to determine if the
  target `prototype` property of a specified constructor or class layout appears anywhere along that chain.

* **delete:** Removes a configurable property from an object and returns a boolean indicating success.

* **void:** Evaluates an expression while always producing the value `undefined`.

* **in:** Determines whether a specified property exists within an object or anywhere along its prototype chain.

* **of:** Contextual keyword used exclusively within `for...of` iteration syntax to retrieve iterable values.

* **with:** Temporarily extends the scope chain using an object's properties. Its use is deprecated and prohibited in
  strict mode because it makes code unpredictable.

* **debugger:** Invokes any available debugging facility by triggering a breakpoint when developer tools are attached.

## Reserved Future Keywords

* **enum:** Reserved keyword for future language features. It is currently unavailable for normal JavaScript
  declarations.

* **implements:** Reserved keyword reserved for future language extensions.

* **interface:** Reserved keyword reserved for future language extensions.

* **package:** Reserved keyword reserved for future language extensions.

* **private:** Reserved keyword. Also used as a contextual keyword for private class fields and methods (`#field`
  syntax).

* **protected:** Reserved keyword reserved for future language extensions.

* **public:** Reserved keyword reserved for future language extensions.

* **abstract:** Reserved keyword reserved for future language extensions.

* **boolean:** Reserved keyword reserved for future language extensions.

* **byte:** Reserved keyword reserved for future language extensions.

* **char:** Reserved keyword reserved for future language extensions.

* **double:** Reserved keyword reserved for future language extensions.

* **final:** Reserved keyword reserved for future language extensions.

* **float:** Reserved keyword reserved for future language extensions.

* **goto:** Reserved keyword intentionally left unsupported.

* **int:** Reserved keyword reserved for future language extensions.

* **long:** Reserved keyword reserved for future language extensions.

* **native:** Reserved keyword reserved for future language extensions.

* **short:** Reserved keyword reserved for future language extensions.

* **synchronized:** Reserved keyword reserved for future language extensions.

* **throws:** Reserved keyword reserved for future language extensions.

* **transient:** Reserved keyword reserved for future language extensions.

* **volatile:** Reserved keyword reserved for future language extensions.

## Primitive Literals

* **null:** A primitive literal representing the intentional absence of any object value.

* **true:** A boolean literal representing logical truth.

* **false:** A boolean literal representing logical false.

## Important JavaScript Syntax (Not Keywords)

The following are fundamental JavaScript language features, although they are **not reserved keywords**:

* **Arrow Functions (`=>`):** Concise function syntax that lexically binds `this`.

* **Optional Chaining (`?.`):** Safely accesses nested object properties without throwing if an intermediate value is
  `null` or `undefined`.

* **Nullish Coalescing (`??`):** Returns the right-hand operand only when the left-hand operand is `null` or
  `undefined`.

* **Logical Assignment (`&&=`, `||=`, `??=`):** Combines logical evaluation with assignment.

* **Spread Syntax (`...`):** Expands iterable values or object properties into individual elements.

* **Rest Parameters (`...`):** Collects remaining function arguments into a single array.

* **Destructuring Assignment:** Extracts values from arrays or properties from objects into individual variables.

* **Template Literals (`` `...${}` ``):** Allows embedded expressions, multiline strings, and tagged templates.

* **Dynamic `import()`:** Loads ECMAScript modules asynchronously at runtime.

* **Private Class Fields (`#field`):** Declares class fields and methods inaccessible outside the declaring class.

* **Static Initialization Blocks (`static {}`):** Executes one-time initialization logic when a class is evaluated.

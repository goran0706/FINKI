# Impure Functions

## Impure Function Concept

**Impure Function:** A function whose output depends on external state or that modifies state outside its own scope,
often producing different results when called with the same input because it interacts with external values or systems,
making it a necessary component for applications to interact with the real world.

## Characteristics of Impure Functions

A function is considered impure when it exhibits one or more of the following defining characteristics.

| Characteristic              | Description                           |
|:----------------------------|:--------------------------------------|
| External state access       | Reads values outside its parameters   |
| External state modification | Changes values outside its scope      |
| Non-deterministic behavior  | Results depend on changing conditions |
| Side effects                | Produces observable changes           |

## External State Access

Impure functions may depend on external values that are not provided as arguments, meaning the function result can
change whenever the external dependency changes.

| Dependency       | Example                          |
|:-----------------|:---------------------------------|
| Global variables | Reading shared application data  |
| Current time     | Using the system clock           |
| Random values    | Generating unpredictable results |
| Environment data | Reading configuration values     |

## External State Modification

Impure functions can modify values outside their own execution context, potentially affecting other parts of a program
in unexpected ways.

| Modified State    | Example                     |
|:------------------|:----------------------------|
| Global variables  | Updating shared values      |
| Object properties | Changing existing objects   |
| Arrays            | Adding or removing elements |
| Application state | Updating stored information |

## Non-Deterministic Behavior

**Non-Deterministic Behavior:** A function property where different results are produced even when called with the exact
same input due to reliance on external, changing sources.

| Source            | Description                        |
|:------------------|:-----------------------------------|
| Random values     | Results change each execution      |
| Current time      | Output depends on execution moment |
| User input        | External actions affect results    |
| Network responses | External systems provide data      |

## Side Effects in Impure Functions

Impure functions often perform side effects—such as updating application state, writing data, sending requests,
modifying user interfaces, or logging information—which are not inherently bad but must be intentional and controlled.

## Impure Function Examples

Common operations that inherently require impure behavior include:

| Operation                | Reason                      |
|:-------------------------|:----------------------------|
| Fetching API data        | Depends on external systems |
| Updating the DOM         | Changes external state      |
| Writing files            | Modifies external resources |
| Reading global variables | Uses outside values         |
| Generating random values | Produces changing output    |

## Pure and Impure Functions Together

Applications commonly separate responsibilities by delegating data processing to pure functions and external
interactions to impure functions to keep complex systems easier to maintain.

| Function Type    | Responsibility                 |
|:-----------------|:-------------------------------|
| Pure functions   | Process and transform data     |
| Impure functions | Interact with external systems |

## Controlling Impurity

Impure behavior should be isolated where possible by keeping external interactions at application boundaries, passing
data into pure functions for processing, avoiding unnecessary shared mutable state, and making side effects explicitly
clear through descriptive function names.

## Benefits of Impure Functions

Although harder to test, impure functions are completely necessary for real-world applications because they allow
programs to communicate with external systems, store information, update interfaces, respond to user actions, and manage
application state.

## Impure Functions vs Pure Functions

| Feature                   | Pure Function | Impure Function |
|:--------------------------|:--------------|:----------------|
| Depends on external state | No            | Possible        |
| Modifies external state   | No            | Possible        |
| Predictable output        | Yes           | Not always      |
| Easier testing            | Yes           | More difficult  |
| Real-world interaction    | Limited       | Required        |

## Use Cases

* **API communication:** Retrieve or send external data.
* **State management:** Update application information.
* **User interaction:** Respond to events and input.
* **Persistence:** Save information to external storage.

## Best Practices

* **Keep impure functions focused:** Limit external interactions to strictly defined, specific responsibilities.
* **Make side effects obvious:** Use clear naming conventions and structures to broadcast impure behavior.
* **Combine with pure functions:** Isolate impure logic at the boundaries and use pure logic for core processing
  wherever possible.
* **Avoid unnecessary global state:** Minimize shared mutable data to reduce complexity and unpredictable side effects.
* **Isolate side effects to application boundaries:** Restrict impure operations like API calls, database writes, and UI
  updates to specific service layers or event handlers.
* **Inject external dependencies as parameters:** Pass system clocks, random number generators, or configuration configs
  into functions to simplify testing and control non-determinism.
* **Document side-effecting functions explicitly:** Use JSDoc tags or clear naming conventions to warn developers when a
  function mutates external state or performs I/O.
* **Avoid hidden state mutations within utility functions:** Ensure helper functions do not silently modify arrays,
  objects, or global configurations passed into them.
* **Handle asynchronous side effects cleanly using modern syntax:** Manage network and file system promises using
  `async/await` rather than convoluted nested callbacks to improve error tracking.
* **Mock impure dependencies during unit testing:** Replace external API calls and random state sources with mock
  implementations or test doubles to ensure predictable test suites.
* **Keep state mutation logic centralized:** Limit state updates to dedicated management modules or reducers rather than
  scattering direct variable mutations across components.
* **Log side effects transparently:** Ensure logging mechanisms record inputs and system states clearly when debugging
  impure actions and unexpected failures.
* **Guard against race conditions in asynchronous impure code:** Implement proper locking, debouncing, or cancellation
  tokens when handling concurrent network or user interaction events.
* **Handle errors gracefully during external communication:** Wrap network requests, file operations, and DOM
  manipulations in robust `try...catch` blocks to prevent application crashes.
* **Limit the scope of shared mutable variables:** Encapsulate state inside closures, classes, or modules rather than
  exposing variables directly on the global window object.
* **Separate data fetching from data presentation:** Keep UI components focused on rendering by fetching external data
  in parent controllers or dedicated service layers.
* **Avoid relying on unpredictable system state:** Minimize direct reads from mutable environment variables or global
  caches deep within business logic functions.
* **Freeze configuration objects to prevent accidental mutations:** Use `Object.freeze()` on shared app settings or
  constant states to catch accidental modifications early.
* **Audit side-effect performance overhead:** Monitor heavy DOM manipulations, frequent local storage writes, and
  continuous network polling to prevent UI stuttering.
* **Embrace functional architecture patterns:** Structure applications so that a pure core handles calculations while an
  impure shell manages external I/O interactions.
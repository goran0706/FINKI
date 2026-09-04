# Function Execution

## Function Invocation

**Function Invocation:** The process of executing a function by requesting that its function body runs, since defining a
function only creates the function object while invocation starts its execution. During invocation, JavaScript creates a
new execution context containing parameters, local variables, scope references, and the execution context's `this`
value.

| Component       | Description                                      |
|:----------------|:-------------------------------------------------|
| Parameters      | Local bindings for received values               |
| Local variables | Variables declared inside the function           |
| Scope reference | Connection to outer lexical environments         |
| `this` value    | Execution context determined by invocation style |

## Direct Function Invocation

**Direct Invocation:** Calling a function by using its identifier followed by parentheses. Direct invocation is the most
common execution pattern where the function executes immediately when the call expression is evaluated.

| Behavior     | Description                        |
|:-------------|:-----------------------------------|
| Execution    | Starts immediately                 |
| Return value | Available to the caller            |
| Arguments    | Passed through the call expression |
| Context      | Determined by the call form        |

## Function Calls

**Function Call:** The expression that triggers function execution, consisting of a function reference, input arguments,
and an invocation operator. The same function can be called multiple times with different arguments, creating separate
execution contexts for each call.

| Component           | Purpose                            |
|:--------------------|:-----------------------------------|
| Function reference  | Identifies which function executes |
| Arguments           | Provides input values              |
| Invocation operator | Executes the function              |

## Function Execution Context

**Execution Context:** The internal environment created by JavaScript while evaluating code. A function invocation
creates an independent function execution context containing a variable environment, a lexical environment, a `this`
binding, and an outer scope reference.

| Component            | Purpose                             |
|:---------------------|:------------------------------------|
| Variable Environment | Stores local bindings               |
| Lexical Environment  | Resolves variable references        |
| `this` Binding       | Determines current execution object |
| Outer Reference      | Links to surrounding scope          |

## Function Call Stack

**Call Stack:** A runtime structure that tracks active function executions. When a function is invoked, a new execution
context is created and placed onto the call stack where function statements execute before the context is removed upon
completion, with nested calls creating multiple stack entries following the Last-In, First-Out principle.

## Nested Function Calls

**Nested Function Invocation:** A function execution that occurs while another function is still running. The call stack
manages execution order by completing the most recently added function first, adhering strictly to the Last-In,
First-Out (LIFO) principle.

## Indirect Invocation

**Indirect Invocation:** Executing a function through another mechanism rather than directly calling its identifier,
which separates function definition from the moment it executes. Common forms include callback execution, event
handlers, timer callbacks, and explicit methods like `call()`, `apply()`, or `bind()`.

| Method             | Description                                         |
|:-------------------|:----------------------------------------------------|
| Callback execution | Another function invokes it                         |
| Event handlers     | Runtime invokes it after an event                   |
| Timer callbacks    | Runtime schedules execution                         |
| Function methods   | Invocation through `call()`, `apply()`, or `bind()` |

## Callback Execution

**Callback Execution:** A function execution controlled by another function or runtime system where the callback
function is provided as a value and executed later when a specific condition occurs.

| Scenario                | Executor           |
|:------------------------|:-------------------|
| Array processing        | Array methods      |
| Events                  | Browser or runtime |
| Asynchronous operations | Event loop         |

## Invocation Type and Context

The way a function is invoked determines its execution behavior, especially the value of `this`. Different invocation
patterns establish distinct context rules independently of the function definition.

| Invocation Type  | Context Behavior                         |
|:-----------------|:-----------------------------------------|
| Function call    | Depends on strict mode and function type |
| Method call      | Uses the object before the dot           |
| Constructor call | Creates a new instance context           |
| Explicit call    | Manually sets context                    |

## Function Calls and Return Flow

When a function returns, its execution context is removed, the return value is produced, and execution continues after
the original function call based on how the caller decides to use the result.

## Function Execution Timing

Functions can execute at different times depending on how they are invoked, ranging from immediate execution during
direct calls to delayed execution triggered by systems, events, or timers.

| Invocation Pattern | Timing                          |
|:-------------------|:--------------------------------|
| Direct call        | Immediately during execution    |
| Callback           | When another system triggers it |
| Event handler      | When an event occurs            |
| Timer callback     | After scheduled delay           |

## Best Practices

* **Understand invocation style:** Remember that function behavior depends on how it is called, not only on how it is
  defined.
* **Keep functions independent of execution timing:** Ensure functions clearly define their required inputs and expected
  outputs regardless of when they run.
* **Avoid deeply nested function calls:** Prevent excessive nesting to keep the execution flow easy to trace and debug.
* **Separate function creation from invocation:** Keep in mind that defining a function does not execute it.
* **Use clear callback boundaries:** Ensure that when functions execute indirectly, the triggering mechanism remains
  understandable.
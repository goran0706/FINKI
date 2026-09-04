# Function Parameters

## Parameters vs Arguments

**Parameter:** A named variable declared in a function definition that represents an expected input value, whereas an
**Argument** is the actual value provided when a function is invoked. Parameters define what data a function can
receive, while arguments provide the specific values used during execution, allowing a single function definition to
receive different arguments across distinct executions.

| Concept   | Created When        | Purpose                |
|:----------|:--------------------|:-----------------------|
| Parameter | Function definition | Defines expected input |
| Argument  | Function invocation | Provides actual value  |

## Function Parameters

**Function Parameters:** Local bindings created during function execution that store values received from arguments.
Parameters exist only inside the function execution context unless their values are returned or exposed externally,
adhering to specific lifecycle and scoping rules within the function body.

| Behavior    | Description                           |
|:------------|:--------------------------------------|
| Declaration | Defined inside the function signature |
| Assignment  | Receives matching argument values     |
| Scope       | Limited to the function body          |
| Lifetime    | Exists during function execution      |

## Parameter Matching

JavaScript matches arguments to parameters strictly based on their positional order, assigning the first argument to the
first parameter, the second argument to the second parameter, and continuing sequentially. Parameter matching does not
require the number of provided arguments to equal the number of declared parameters, allowing functions to handle
varying amounts of input flexibly.

## Missing Arguments

When fewer arguments are provided than declared parameters, the unassigned parameters automatically receive `undefined`,
which allows functions to support optional inputs. Developers can manage missing arguments through various techniques,
including default parameters, manual conditional checks, or destructuring defaults.

| Technique              | Purpose                              |
|:-----------------------|:-------------------------------------|
| Default parameters     | Provide fallback values              |
| Conditional checks     | Handle missing data manually         |
| Destructuring defaults | Define defaults for structured input |

## Extra Arguments

JavaScript allows functions to receive more arguments than the number of declared parameters without throwing errors,
though additional values are not automatically assigned to named parameters. Modern JavaScript generally prefers rest
parameters over legacy features to capture these extra inputs explicitly and maintain compatibility with arrow
functions.

| Method             | Description                            |
|:-------------------|:---------------------------------------|
| Rest parameters    | Collect remaining values into an array |
| `arguments` object | Legacy array-like collection           |

## Default Parameters

**Default Parameter:** A parameter that receives a predefined value when the corresponding argument is `undefined`.
Default parameters define fallback behavior directly inside the function signature and are evaluated dynamically each
time the function is invoked.

## Default Parameter Evaluation

Default parameter expressions execute during function invocation rather than at function creation time. This runtime
evaluation allows fallback expressions to utilize various standard JavaScript constructs to determine default values
dynamically.

| Expression Type     | Example Purpose                 |
|:--------------------|:--------------------------------|
| Literal values      | Provide constant defaults       |
| Calculations        | Generate dynamic defaults       |
| Function calls      | Create computed fallback values |
| Previous parameters | Build dependent defaults        |

## Default Parameter Conditions

Default parameters are applied strictly when an argument is `undefined`, meaning they do not trigger for other falsy
values such as `null`, `false`, `0`, or empty strings. This distinction allows functions to differentiate between
missing inputs and intentionally provided falsy values.

| Provided Value | Default Used |
|:---------------|:-------------|
| `undefined`    | Yes          |
| `null`         | No           |
| `false`        | No           |
| `0`            | No           |
| `""`           | No           |

## Rest Parameters

**Rest Parameter:** A parameter syntax that collects remaining function arguments into a single array. Rest parameters
use the spread syntax (`...`) inside the function parameter list, allowing functions to support variable numbers of
arguments while maintaining clean, explicit input handling.

## Rest Parameter Rules

Rest parameters follow strict positional and quantity rules within a function signature to ensure parameters are parsed
correctly and unambiguously during invocation.

| Rule     | Description                             |
|:---------|:----------------------------------------|
| Position | Must be the final parameter             |
| Quantity | Only one rest parameter is allowed      |
| Storage  | Collected values are stored in an array |
| Purpose  | Handles variable-length input           |

## Rest Parameters vs arguments

Rest parameters provide clearer architectural intent than the legacy `arguments` object because the collected values
form a true Array instance, receive an explicit variable name, and work reliably within arrow functions.

| Feature                    | Rest Parameters | `arguments` Object |
|:---------------------------|:----------------|:-------------------|
| Data structure             | Array           | Array-like object  |
| Explicit naming            | Yes             | No                 |
| Works with arrow functions | Yes             | No                 |
| Modern syntax              | Yes             | Legacy feature     |

## Parameter Destructuring

**Parameter Destructuring:** A technique that extracts values from objects or arrays directly within the function
parameter list. Destructuring allows functions to receive structured data while accessing only the required values, and
it is commonly combined with default parameters to handle optional structured data cleanly.

| Input             | Purpose                  |
|:------------------|:-------------------------|
| Object parameters | Extract named properties |
| Array parameters  | Extract ordered values   |

## Parameter Scope

Parameters follow standard function scope rules, meaning each function invocation creates a separate execution context
containing independent parameter bindings. Because of this execution isolation, multiple calls to the same function
never share or leak parameter values between executions.

## Best Practices

* **Use meaningful parameter names:** Choose descriptive identifiers that clearly communicate the expected input type
  and purpose.
* **Avoid excessive parameters:** Limit the total number of parameters since functions with many inputs become harder to
  read, test, and maintain.
* **Use object parameters for related values:** Group related parameters into a single configuration object to improve
  readability and future extensibility.
* **Use default parameters for optional values:** Define explicit fallback values within the function signature to make
  optional behavior visible and predictable.
* **Prefer rest parameters over the arguments object:** Utilize rest parameters for variable-length inputs to benefit
  from standard array methods and arrow function compatibility.
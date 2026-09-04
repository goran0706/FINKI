# if Statement

## if Statement

**`if` Statement:** A control flow statement that conditionally executes a block of code when its condition expression
evaluates to a truthy value. JavaScript evaluates the expression inside the `if` statement using Boolean conversion
rules. The condition does not need to return an actual Boolean value because any value can be converted to a truthy or
falsy result. The `if` statement controls whether a specific execution path is entered; when the condition evaluates to
falsy, execution continues after the conditional block.

```javascript
if (condition) {
    statement;
}
```

| Value Type    | Condition Result |
|:--------------|:-----------------|
| Truthy values | Block executes   |
| Falsy values  | Block is skipped |

## if...else Statement

**`if...else` Statement:** A conditional structure that defines two mutually exclusive execution paths. The `if` branch
executes when the condition is truthy, while the `else` branch executes when the condition is falsy. The `else` branch
does not evaluate a condition; it acts as the fallback path when the `if` condition fails.

```javascript
if (condition) {
    statementA;
} else {
    statementB;
}
```

Only one branch of an `if...else` statement executes during a particular evaluation.

| Condition Result | Executed Branch |
|:-----------------|:----------------|
| Truthy           | `if` branch     |
| Falsy            | `else` branch   |

## else if Chains

**`else if` Statement:** A mechanism for creating multiple conditional branches that are evaluated in order until one
condition evaluates to truthy. Only the first matching branch executes, and once a branch executes, the remaining
conditions are ignored. `else if` chains are appropriate when multiple possible states must be evaluated sequentially.

```javascript
if (conditionA) {
    statementA;
} else if (conditionB) {
    statementB;
} else if (conditionC) {
    statementC;
} else {
    statementD;
}
```

The conditions are evaluated from top to bottom. Each `else if` condition is evaluated only when all preceding
conditions have evaluated to falsy.

| Evaluation Result                | Behavior                                                  |
|:---------------------------------|:----------------------------------------------------------|
| First condition is truthy        | First branch executes                                     |
| First condition is falsy         | Next condition is evaluated                               |
| Intermediate condition is truthy | That branch executes and remaining conditions are skipped |
| All conditions are falsy         | `else` branch executes if present                         |

When many exact values are compared against a single expression, a `switch` statement may provide clearer structure.

## Nested if Statements

**Nested `if` Statement:** An `if` statement placed inside another control flow block, allowing a secondary condition to
be evaluated only after an outer condition has been satisfied.

```javascript
if (user) {
    if (user.isActive) {
        processUser(user);
    }
}
```

Nested conditions create additional execution paths because the inner condition is dependent on reaching the outer block
first.

```javascript
if (isAuthenticated) {
    if (hasPermission) {
        accessResource();
    }
}
```

In this example, `hasPermission` is evaluated only when `isAuthenticated` is truthy.

Nested conditions can sometimes be flattened by combining conditions:

```javascript
if (isAuthenticated && hasPermission) {
    accessResource();
}
```

The appropriate form depends on whether the individual conditions represent meaningful separate decisions or whether
they are simply prerequisites for the same operation.

## Conditional Branch Selection

**Conditional Branch Selection:** The process of evaluating conditions and choosing which block of code becomes part of
the active execution path. When evaluating an `if...else if...else` structure, only the first selected branch executes,
while all remaining branches are skipped.

| Branch Type        | Purpose                                         |
|:-------------------|:------------------------------------------------|
| Primary branch     | Executes when the main condition succeeds       |
| Alternative branch | Executes when an alternative condition succeeds |
| Fallback branch    | Executes when no previous condition matches     |

For an `if...else if...else` chain, JavaScript evaluates conditions sequentially:

```javascript
if (conditionA) {
    // selected when conditionA is truthy
} else if (conditionB) {
    // selected when conditionA is falsy and conditionB is truthy
} else {
    // selected when all previous conditions are falsy
}
```

Once a condition evaluates to truthy, JavaScript executes that branch and does not evaluate the remaining conditions in
the chain.

## Branch Ordering

**Branch Ordering:** The deliberate arrangement of conditions within an `else if` chain so that more specific conditions
are evaluated before broader conditions that could otherwise capture the same values.

```javascript
if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else {
    grade = "F";
}
```

The order is important because `score >= 70` would also be true for values of `80` and `90`, but those values must reach
the more specific branches first.

A broad condition placed before a more specific condition can make the later branch unreachable:

```javascript
if (score >= 70) {
    grade = "C or higher";
} else if (score >= 90) {
    grade = "A";
}
```

The second condition can never be reached for a value that satisfies it.

## Guard Clauses

**Guard Clause:** An early conditional check that handles an invalid, exceptional, or otherwise non-primary case before
allowing execution to continue into the main logic.

```javascript
function process(user) {
    if (!user) {
        return null;
    }

    if (!user.isActive) {
        return null;
    }

    return processUser(user);
}
```

Guard clauses reduce unnecessary nesting by terminating execution for cases that do not belong to the primary execution
path.

Without guard clauses, the same logic may require additional nesting:

```javascript
function process(user) {
    if (user) {
        if (user.isActive) {
            return processUser(user);
        }
    }

    return null;
}
```

The guard-clause form keeps the normal execution path flat and makes the function's preconditions explicit.

## Early Returns

**Early Return:** A `return` statement executed before the normal end of a function, commonly used to terminate
execution when a condition indicates that further processing is unnecessary.

```javascript
function getUserName(user) {
    if (!user) {
        return null;
    }

    return user.name;
}
```

Early returns are particularly useful for validation, preconditions, error cases, and guard clauses.

Although early returns are implemented using `return`, their use is closely related to `if` branching because the
condition determines whether the current execution path continues or terminates.

## Condition Evaluation

The condition of an `if` statement is evaluated before the controlled statement or block is executed.

```javascript
if (getStatus()) {
    process();
}
```

The expression `getStatus()` is evaluated first. Its resulting value is converted to a Boolean value for the purpose of
determining whether the block executes.

If the condition is truthy:

```text
condition → Boolean conversion → true → execute block
```

If the condition is falsy:

```text
condition → Boolean conversion → false → skip block
```

The condition is evaluated each time execution reaches the `if` statement.

## Multiple Conditions

An `if` statement can use logical operators to combine multiple conditions.

```javascript
if (user.isActive && user.hasPermission) {
    accessResource();
}
```

The resulting expression is evaluated according to the semantics of the operators involved. Logical operators may
short-circuit evaluation, meaning later operands may not be evaluated when the result is already determined.

Complex conditions should remain understandable and should be extracted into named predicates when their meaning is
difficult to determine from the expression itself.

```javascript
function isEligibleForRefund(order) {
    return order.isPaid &&
        !order.isShipped &&
        order.daysSincePurchase <= 30;
}

if (isEligibleForRefund(order)) {
    refund(order);
}
```

A named predicate makes the decision explicit and allows the condition to be independently tested and reused.

## Truthy and Falsy Conditions

The condition of an `if` statement is not restricted to Boolean values.

```javascript
if (value) {
    execute();
}
```

JavaScript converts `value` to a Boolean value when determining whether the branch executes.

The following values are falsy:

| Value       | Type      |
|:------------|:----------|
| `false`     | Boolean   |
| `0`         | Number    |
| `-0`        | Number    |
| `0n`        | BigInt    |
| `""`        | String    |
| `null`      | Null      |
| `undefined` | Undefined |
| `NaN`       | Number    |

All other JavaScript values are truthy, including empty arrays and empty objects.

```javascript
if ([]) {
    // Executes
}

if ({}) {
    // Executes
}
```

When a condition needs to distinguish between an empty collection and a non-empty collection, the collection's contents
should be checked explicitly.

## Strict Equality in Conditions

Strict equality (`===`) and strict inequality (`!==`) should normally be used when an `if` condition compares values.

```javascript
if (status === "active") {
    activate();
}
```

Strict equality compares operands without performing the type conversions associated with loose equality.

```javascript
if (value === 5) {
    process();
}
```

Using loose equality can introduce implicit type conversion:

```javascript
if (value == 5) {
    process();
}
```

The second form can match values of different types and should only be used when that coercion is intentional and
understood.

## Assignment in Conditions

Assignment (`=`) inside a condition is valid JavaScript but can easily be introduced accidentally when a comparison
operator was intended.

```javascript
if (value = 10) {
    // Assignment occurs before the condition is evaluated.
}
```

The assignment expression produces the assigned value, which is then evaluated for truthiness.

Intentional assignments inside conditions should be made explicit, but avoiding the pattern entirely is generally
clearer.

```javascript
const value = getValue();

if (value === 10) {
    process();
}
```

## Boolean Comparison

A Boolean condition generally does not need to be compared against a Boolean literal.

```javascript
// Avoid
if (isValid === true) {
    process();
}

// Prefer
if (isValid) {
    process();
}
```

Similarly, negation can be used directly when testing a falsy Boolean condition:

```javascript
if (!isValid) {
    reject();
}
```

Explicit comparison can be appropriate when the distinction between Boolean values and other truthy or falsy values is
itself meaningful, but ordinary Boolean predicates should normally be used directly.

## Lookup-Based Branching

When branching is based on a known discrete value, a lookup table can sometimes replace a long `if...else if` chain.

```javascript
const handlers = {
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete
};

const handler = handlers[action];

if (handler) {
    handler();
}
```

A `Map` can provide the same pattern:

```javascript
const handlers = new Map([
    ["create", handleCreate],
    ["update", handleUpdate],
    ["delete", handleDelete]
]);

const handler = handlers.get(action);

if (handler) {
    handler();
}
```

Lookup-based dispatch removes sequential conditional comparisons and can make value-to-behavior mappings easier to
extend. A `switch` statement may still be clearer when each case requires substantially different control flow rather
than simple dispatch.

## Boolean Flag Branching

Boolean flag parameters can increase the number of possible execution paths and make function behavior less explicit.

```javascript
function process(order, isUrgent) {
    if (isUrgent) {
        processUrgently(order);
    } else {
        processNormally(order);
    }
}
```

When the distinction represents genuinely different operations, separate functions can make the API clearer:

```javascript
function processUrgently(order) {
    // ...
}

function processNormally(order) {
    // ...
}
```

Alternatively, a discriminated value can make the supported modes explicit:

```javascript
function process(order, mode) {
    if (mode === "urgent") {
        processUrgently(order);
    } else {
        processNormally(order);
    }
}
```

Stacking independent Boolean flags can cause the number of possible combinations to grow exponentially as additional
flags are introduced.

## State-Based Branching

Multiple independent Boolean variables can represent mutually exclusive application states poorly.

```javascript
if (isLoading) {
    // ...
}

if (isError) {
    // ...
}

if (isDone) {
    // ...
}
```

This model permits combinations that may be invalid, such as:

```javascript
isLoading === true
isError === true
```

A discriminated state can make the possible states explicit:

```javascript
const state = "loading";

if (state === "loading") {
    showLoading();
} else if (state === "error") {
    showError();
} else if (state === "success") {
    showResult();
}
```

For complex workflows such as order processing, wizard navigation, or connection management, an explicit state machine
or transition table can provide stronger guarantees than unrelated Boolean flags.

## Cyclomatic Complexity

**Cyclomatic Complexity:** A software metric representing the number of linearly independent execution paths through a
function. McCabe's metric is commonly expressed as the number of decision points plus one.

Additional conditions increase the number of paths that must be considered and tested.

A function containing many independent early-return conditions can therefore have substantial complexity even when its
indentation remains shallow.

```javascript
function validate(value) {
    if (!value) return false;
    if (!value.enabled) return false;
    if (!value.valid) return false;
    if (!value.authorized) return false;

    return true;
}
```

The code is visually simple, but each decision contributes to its control-flow complexity.

Static analysis tools such as ESLint can enforce a maximum complexity threshold through their `complexity` rule.

## Performance Considerations

Branch behavior can matter in performance-critical code, although correctness and maintainability should normally take
precedence over speculative optimization.

JavaScript engines such as V8 use runtime feedback when optimizing frequently executed functions. Stable operand types
and object shapes can provide more predictable optimization behavior than highly polymorphic code.

For example, repeatedly comparing a value with different types can create more complex runtime type feedback:

```javascript
function check(value) {
    return value === 5;
}
```

Calling the function with consistently numeric values is generally more type-stable than repeatedly mixing unrelated
types.

This is primarily a concern for genuinely hot code paths. Branch structure should not be distorted solely to influence
JIT behavior without profiling evidence.

## Side Effects in Conditional Expressions

Logical operators can conditionally execute expressions through short-circuit evaluation:

```javascript
condition && doSomething();
```

Although this resembles control flow, it is an expression rather than an `if` statement.

For operations whose side effects are important to the program's behavior, an explicit `if` statement is generally
clearer:

```javascript
if (condition) {
    doSomething();
}
```

The explicit statement communicates that execution, rather than value selection, is the purpose of the condition.

## Loop-Invariant Conditions

A condition that does not change during loop execution can sometimes be evaluated outside the loop.

```javascript
const shouldProcess = configuration.enabled;

for (const item of items) {
    if (shouldProcess) {
        process(item);
    }
}
```

This can avoid repeated evaluation when the condition is genuinely invariant.

Modern JavaScript engines may perform some loop-invariant optimization automatically, but non-trivial expressions
involving function calls, getters, or observable operations may not be safely hoisted. Manual hoisting should therefore
be based on actual invariance and, for performance-sensitive code, profiling rather than assumptions about JIT behavior.

## Best Practices

* **Keep branching logic explicit:** Conditions should clearly describe the decision being made instead of hiding
  behavior through unnecessarily complex expressions.
* **Use `if` statements for complex conditions:** Conditions involving ranges, multiple comparisons, or logical
  combinations are generally clearer with `if` because they directly express the decision being evaluated.
* **Avoid unnecessary nesting:** Deeply nested conditional structures make execution paths harder to analyze and
  maintain.
* **Prefer guard clauses / early returns over nested `if...else`:** Returning early for invalid or edge cases reduces
  indentation and keeps the main logic path flat.
* **Always use strict equality (`===`/`!==`) inside conditions:** Loose equality (`==`) triggers implicit type coercion,
  which can silently produce unintended matches.
* **Never use assignment (`=`) inside a condition:** Easy to mistake `=` for `==`/`===`, resulting in assignment instead
  of comparison. Intentional assignments should be avoided where practical.
* **Avoid comparing Boolean conditions to literal `true`/`false`:** The condition already provides the required
  truthy/falsy evaluation.

  ```javascript
  // Avoid
  if (isValid === true) {
  }
  
  // Prefer
  if (isValid) {
  }
  ```

* **Order `else if` branches deliberately:** Since only the first matching branch executes, place more specific
  conditions before broader conditions that could mask them.
* **Extract complex conditions into named predicate functions, not just variables:** `if (isEligibleForRefund(order))`
  communicates intent more clearly than a repeated inline multi-clause Boolean expression and allows the predicate to be
  independently tested.
* **Avoid boolean flag arguments when they represent distinct behaviors:** Split operations into distinct functions or
  use a discriminated value when this makes the supported states explicit.
* **Model multi-state workflows explicitly:** State machines or discriminated states prevent invalid combinations that
  can arise from multiple independent Boolean flags.
* **Track cyclomatic complexity, not just visual nesting:** A flat function containing many independent decisions can be
  more complex than a nested function containing only a few branches.
* **Do not rely on short-circuit evaluation for side effects that must execute:** Use an explicit `if` statement when
  conditional execution is the actual intent.
* **Use lookup-table dispatch when branching on a known value:** An object or `Map` keyed by the value can eliminate
  long sequential comparisons and simplify dispatch when each value maps directly to an operation.
* **Do not optimize branch structure for JIT behavior without evidence:** Type stability can matter in hot paths, but
  performance-related changes should be driven by profiling rather than assumptions about engine optimization.
* **Hoist genuinely invariant conditions out of loops when this improves clarity or measured performance:** Do not
  manually transform code merely because an expression appears inside a loop; first establish that the condition is
  invariant.

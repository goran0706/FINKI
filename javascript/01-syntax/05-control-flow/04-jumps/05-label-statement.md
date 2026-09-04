# Label Statement

The `label` statement associates an identifier with a statement. A label can then be used by `break` or `continue` to
transfer control to a specific enclosing labeled statement.

```javascript id="label-basic"
loop: for (const value of values) {
    console.log(value);
}
```

The label itself does not change the normal execution of the statement.

```javascript id="label-execution"
start: {
    console.log("running");
}

console.log("finished");
```

The label is simply a named target for labeled control-flow statements.

## Label Syntax

The general syntax is:

```javascript id="label-syntax"
labelIdentifier: statement
```

For example:

```javascript id="label-loop"
outer: for (let i = 0; i < 3; i++) {
    console.log(i);
}
```

A label is an identifier followed by a colon and a statement.

Labels can be applied to any statement that can form the required labeled-statement grammar.

## Label Identifier

The label name follows JavaScript identifier rules.

```javascript id="label-identifier"
outerLoop: for (const item of items) {
    process(item);
}
```

Labels are case-sensitive.

```javascript id="label-case-sensitive"
outer: {
    break outer;
}
```

A different spelling refers to a different identifier.

```javascript id="label-case-sensitive-invalid"
outer: {
    break Outer;
}
```

The label `Outer` does not refer to `outer`.

## Label Scope

Labels have their own control-flow scope.

```javascript id="label-scope"
outer: {
    console.log("inside");
}

outer: {
    console.log("another block");
}
```

The first label does not remain available throughout the entire surrounding scope.

A labeled `break` or `continue` must resolve to an appropriate enclosing label at the point where it appears.

```javascript id="label-enclosing"
outer: for (const row of matrix) {
    for (const value of row) {
        if (value === 42) {
            break outer;
        }
    }
}
```

The `outer` label is visible as a target from the nested statement where the `break` occurs.

## Labeling Loops

Labels are most commonly used with loops.

```javascript id="label-loop-basic"
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        console.log(i, j);
    }
}
```

The label allows an inner loop to target the outer loop.

```javascript id="label-break-outer"
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outer;
        }
    }
}
```

`break outer` terminates the labeled outer loop.

Without the label, an ordinary `break` would terminate only the nearest inner loop.

```javascript id="label-break-nearest"
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break;
        }
    }
}
```

## Labeling `while` Loops

Labels can be applied to `while` statements.

```javascript id="label-while"
outer: while (condition) {
    while (nestedCondition) {
        if (shouldStop()) {
            break outer;
        }
    }
}
```

The labeled `break` terminates the labeled `while` loop.

## Labeling `do...while` Loops

Labels can also be applied to `do...while` statements.

```javascript id="label-do-while"
outer: do {
    do {
        if (shouldStop()) {
            break outer;
        }
    } while (innerCondition);
} while (outerCondition);
```

The label identifies the outer `do...while` statement as the target of the `break`.

## Labeling `for...in` Loops

A `for...in` statement can be labeled.

```javascript id="label-for-in"
objects: for (const key in object) {
    processKey(key);
}
```

An inner statement can terminate that loop with a labeled `break`.

```javascript id="label-for-in-break"
objects: for (const key in object) {
    if (shouldStop(key)) {
        break objects;
    }

    processKey(key);
}
```

## Labeling `for...of` Loops

A `for...of` statement can also be labeled.

```javascript id="label-for-of"
rows: for (const row of matrix) {
    for (const value of row) {
        if (value === 42) {
            break rows;
        }
    }
}
```

The labeled `break` terminates the outer `for...of` loop.

## Labeled `break`

The primary purpose of labels is to provide explicit targets for labeled `break`.

```javascript id="labeled-break"
outer: for (const row of matrix) {
    for (const value of row) {
        if (value === 42) {
            break outer;
        }
    }
}
```

An unlabeled `break` targets the nearest enclosing breakable statement.

```javascript id="unlabeled-break"
for (const row of matrix) {
    for (const value of row) {
        if (value === 42) {
            break;
        }
    }
}
```

A labeled `break` can target a specific enclosing labeled statement.

```javascript id="specific-break-target"
outer: for (const row of matrix) {
    for (const value of row) {
        if (value === 42) {
            break outer;
        }
    }

    processRow(row);
}
```

When `break outer` executes, control continues after the labeled outer loop.

## Labeled `continue`

Labels can also provide targets for `continue`.

```javascript id="labeled-continue"
outer: for (const row of matrix) {
    for (const value of row) {
        if (!isValid(value)) {
            continue outer;
        }

        process(value);
    }
}
```

Here, `continue outer` skips the remainder of the current outer-loop iteration.

This differs from an unlabeled `continue`, which would target the nearest inner loop.

```javascript id="unlabeled-continue"
for (const row of matrix) {
    for (const value of row) {
        if (!isValid(value)) {
            continue;
        }

        process(value);
    }
}
```

The unlabeled version skips only the current inner-loop iteration.

## Labeled `continue` Target

A labeled `continue` must target an enclosing iteration statement.

```javascript id="continue-target"
outer: for (const row of matrix) {
    for (const value of row) {
        if (!isValid(value)) {
            continue outer;
        }
    }
}
```

The target must be a loop.

A label on a non-loop statement cannot be used as the target of `continue`.

```javascript id="invalid-continue-target"
block: {
    continue block;
}
```

This is invalid because `block` labels a block rather than an iteration statement.

A labeled `break`, however, can target a labeled block.

## Labeled Blocks

Labels can be applied to ordinary blocks.

```javascript id="labeled-block"
processing: {
    if (!isValid(input)) {
        break processing;
    }

    performStepOne();
    performStepTwo();
}
```

The `break processing` exits the labeled block.

Execution then continues after the block.

```javascript id="labeled-block-after"
processing: {
    if (shouldStop()) {
        break processing;
    }

    performWork();
}

console.log("continues here");
```

Labeled blocks can therefore provide a structured alternative to certain flag-variable patterns.

## Labeled Block for Multi-Step Processing

A labeled block can group several sequential operations into a single breakable unit.

```javascript id="labeled-processing"
process: {
    const user = findUser();

    if (!user) {
        break process;
    }

    const account = findAccount(user);

    if (!account) {
        break process;
    }

    updateAccount(account);
    notifyUser(user);
}
```

The label allows the block to terminate early without introducing another loop.

This should be used selectively because ordinary `if`/guard-clause control flow is often clearer.

## Nested Labeled Statements

Labels can be nested.

```javascript id="nested-labels"
outer: {
    inner: {
        if (condition) {
            break outer;
        }

        break inner;
    }
}
```

`break outer` targets the outer labeled block.

`break inner` targets the inner labeled block.

The label determines exactly which enclosing labeled statement receives the control transfer.

## Multiple Labels

A statement can have multiple labels.

```javascript id="multiple-labels"
outer:
    middle:
        for (const value of values) {
            process(value);
        }
```

Both labels refer to the same statement.

They can be used as targets where applicable.

```javascript id="multiple-label-target"
outer:
    middle:
        for (const value of values) {
            if (conditionA(value)) {
                break outer;
            }

            if (conditionB(value)) {
                break middle;
            }
        }
```

Multiple labels are legal but are rarely necessary.

Using a single descriptive label generally produces clearer control flow.

## Labels and Nested Loops

Labels are particularly useful when multiple loops are nested.

```javascript id="nested-search"
search: for (const row of matrix) {
    for (const value of row) {
        if (value === target) {
            break search;
        }
    }
}
```

Without a label, the outer loop would require another mechanism to communicate termination from the inner loop.

A label directly expresses the intended control-flow target.

## Labels and Search Operations

A labeled outer loop can terminate a multidimensional search.

```javascript id="matrix-search"
search: for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
        if (matrix[row][column] === target) {
            result = {
                row,
                column
            };

            break search;
        }
    }
}
```

This is one of the canonical uses of labeled `break`.

The alternative is to extract the search into a function and use `return`.

```javascript id="search-function"
function findPosition(matrix, target) {
    for (let row = 0; row < matrix.length; row++) {
        for (let column = 0; column < matrix[row].length; column++) {
            if (matrix[row][column] === target) {
                return {
                    row,
                    column
                };
            }
        }
    }

    return undefined;
}
```

When the search naturally belongs in its own function, `return` is often clearer than a label.

## Labels and Nested Processing

A label can terminate multiple levels of nested processing without introducing state variables.

```javascript id="nested-processing"
processRows: for (const row of rows) {
    for (const item of row.items) {
        if (isFatal(item)) {
            break processRows;
        }

        process(item);
    }
}
```

This directly communicates that the outer processing operation should terminate.

## Labels vs Flag Variables

Before labeled control flow, code may use a flag to communicate termination from an inner loop.

```javascript id="flag-variable"
let found = false;

for (const row of matrix) {
    for (const value of row) {
        if (value === target) {
            found = true;
            break;
        }
    }

    if (found) {
        break;
    }
}
```

A label can express the same control flow directly.

```javascript id="label-replacement"
search: for (const row of matrix) {
    for (const value of row) {
        if (value === target) {
            break search;
        }
    }
}
```

The labeled version avoids an additional mutable state variable.

However, labels should not automatically replace every flag variable. If the state itself has semantic meaning beyond
loop termination, the explicit variable may be preferable.

## Labels vs Function Extraction

Function extraction is another alternative to labeled control flow.

```javascript id="function-extraction"
function findTarget(matrix, target) {
    for (const row of matrix) {
        for (const value of row) {
            if (value === target) {
                return value;
            }
        }
    }

    return undefined;
}
```

A `return` naturally exits all nested loops because it exits the function.

This can be clearer when the nested operation represents a meaningful reusable computation.

Labels are more appropriate when the control-flow structure should remain within the current function.

## Labels and `switch`

A `switch` statement can be labeled.

```javascript id="label-switch"
dispatch: switch (action) {
    case "start":
        start();
        break;

    case "stop":
        stop();
        break;

    default:
        break dispatch;
}
```

A labeled `break` can target the labeled `switch`.

```javascript id="label-switch-break"
outer: switch (value) {
    case 1:
        if (shouldStop()) {
            break outer;
        }

        process();
        break;

    default:
        handleDefault();
}
```

A `continue` cannot target a `switch` because `switch` is not an iteration statement.

## Labels and Blocks

Labels can be attached to blocks to create explicit control-flow exit points.

```javascript id="label-block-flow"
operation: {
    stepOne();

    if (failed()) {
        break operation;
    }

    stepTwo();

    if (failed()) {
        break operation;
    }

    stepThree();
}
```

This can be useful for linear processing where several operations can terminate the sequence.

However, ordinary conditional structure may be clearer when the block contains only a small amount of logic.

## Labels and Function Boundaries

A label cannot be used to transfer control across a function boundary.

```javascript id="label-function-boundary"
outer: for (const value of values) {
    process(value);
}

function process(value) {
    // Cannot use `break outer` here.
}
```

The label is not available inside the separate function body.

Labels operate within the current syntactic control-flow structure.

## Labels and Callbacks

A label cannot be used from inside a callback to control the loop that invoked the callback.

```javascript id="label-callback"
outer: for (const value of values) {
    values.forEach(item => {
        // `break outer` is invalid here.
    });
}
```

The callback is a separate function boundary.

If control must leave the outer function or loop based on callback processing, the design should usually be changed to
an explicit loop or a suitable higher-order operation.

## Labels and `return`

A label is not a replacement for `return`.

```javascript id="label-vs-return"
search: {
    for (const value of values) {
        if (value === target) {
            break search;
        }
    }
}

return result;
```

The labeled `break` exits only the labeled statement.

A `return` exits the entire function.

```javascript id="return-search"
function find(values, target) {
    for (const value of values) {
        if (value === target) {
            return value;
        }
    }

    return undefined;
}
```

Use `return` when the function itself should terminate.

Use a labeled `break` when only a specific enclosing statement should terminate.

## Labels and `break` vs `continue`

The two labeled control-flow statements have different effects.

```javascript id="label-break-continue"
outer: for (const row of matrix) {
    for (const value of row) {
        if (value === null) {
            continue outer;
        }

        if (value === 42) {
            break outer;
        }

        process(value);
    }
}
```

`continue outer` begins the next iteration of the outer loop.

`break outer` terminates the outer loop entirely.

## Labels and Loop Updates

A labeled `continue` targets the specified loop's next iteration.

```javascript id="label-continue-update"
outer: for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (shouldSkipRow(i, j)) {
            continue outer;
        }

        process(i, j);
    }
}
```

For a `for` loop, the outer loop's update expression still occurs as part of continuing that loop.

```javascript id="label-continue-for"
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) {
            continue outer;
        }
    }
}
```

The control flow continues with the outer loop's update and subsequent condition evaluation.

## Labels and Iterator Cleanup

When a labeled `break` exits a `for...of` loop, normal iterator-closing behavior applies.

```javascript id="label-iterator-cleanup"
outer: for (const row of rows) {
    for (const value of row) {
        if (value === target) {
            break outer;
        }
    }
}
```

The abrupt completion caused by the `break` can cause the iterator associated with the exited `for...of` loop to be
closed.

This is important when iterators or generators implement cleanup through their `return()` method.

## Labels and Readability

Labels should communicate a meaningful control-flow target.

```javascript id="descriptive-label"
search: for (const row of matrix) {
    for (const value of row) {
        if (value === target) {
            break search;
        }
    }
}
```

A generic label such as `a`, `b`, or `x` provides little information.

```javascript id="poor-label"
x: for (const row of matrix) {
    for (const value of row) {
        if (value === target) {
            break x;
        }
    }
}
```

The label should describe the operation or scope being controlled rather than merely identifying its nesting level.

## Labels and Control-Flow Complexity

Labels can reduce complexity when they replace multiple state variables and nested termination checks.

```javascript id="label-complexity"
search: for (const row of matrix) {
    for (const value of row) {
        if (isTarget(value)) {
            break search;
        }
    }
}
```

However, excessive labeled jumps can make code resemble unstructured control flow.

```javascript id="many-labels"
first: {
    second: {
        third: {
            if (conditionA) {
                break first;
            }

            if (conditionB) {
                break second;
            }

            if (conditionC) {
                break third;
            }
        }
    }
}
```

Multiple nested labels can make control flow harder to follow than structured conditionals or extracted functions.

## Labels and Structured Control Flow

Labels are still structured control flow because the target is explicitly defined by an enclosing labeled statement.

```javascript id="structured-label"
search: for (const row of matrix) {
    for (const value of row) {
        if (value === target) {
            break search;
        }
    }
}
```

The transfer target is constrained by the lexical nesting structure.

Labels should therefore not be confused with arbitrary jumps to unrelated locations in code.

## Best Practices

* **Use labels primarily for multi-level loop control.** This is the clearest and most common use of labeled statements.
* **Choose descriptive labels.** Names such as `search`, `outer`, `processing`, or `rows` should communicate what the
  labeled statement represents.
* **Use labeled `break` when an inner loop must terminate an outer loop.** This can be clearer than maintaining a
  separate boolean flag.
* **Use labeled `continue` when an inner loop must skip directly to the next iteration of a specific outer loop.** This
  is particularly useful for nested data processing.
* **Remember that unlabeled `break` and `continue` target the nearest applicable loop.** Add a label only when a
  different enclosing loop is the intended target.
* **Remember that labeled `break` can target labeled blocks.** This provides a structured way to terminate a larger
  sequential operation without introducing a loop solely for control flow.
* **Do not use `continue` with a label that targets a non-loop statement.** A labeled `continue` must target an
  enclosing iteration statement.
* **Do not use labels to cross function boundaries.** Labels are local to their syntactic control-flow structure.
* **Do not expect labels to work from callbacks.** A callback is a separate function boundary.
* **Prefer `return` when the entire function should terminate.** A label is unnecessary when the desired control flow
  naturally corresponds to function completion.
* **Consider function extraction for complex nested searches.** A dedicated function with `return` can be clearer than a
  deeply nested labeled structure.
* **Do not introduce a label merely to avoid ordinary structured control flow.** Simple `if`, `break`, `continue`, and
  `return` statements are preferable when they express the required behavior directly.
* **Avoid excessive nesting of labels.** Multiple labels can make control flow difficult to trace.
* **Do not use arbitrary or meaningless label names.** The label should identify the semantic operation or control-flow
  scope.
* **Use labels instead of mutable flags when the flag exists solely to communicate loop termination.** A labeled `break`
  expresses that intent directly.
* **Keep labels close to their control-flow targets.** The reader should be able to identify the target immediately.
* **Remember that labels do not change normal statement execution.** A label only creates a named control-flow target.
* **Use labels deliberately with `for...of`.** Breaking or continuing an outer `for...of` loop can trigger iterator
  cleanup as required by iterator semantics.
* **Prefer the simplest control-flow mechanism that accurately expresses the required transfer.** Labels are useful for
  specific multi-level control-flow cases, but they should not become the default structure for ordinary branching.

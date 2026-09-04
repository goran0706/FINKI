# continue Statement

The `continue` statement skips the remainder of the **current iteration** of the nearest enclosing loop and proceeds
with the loop's next iteration.

Unlike `break`, which terminates the loop completely, `continue` keeps the loop active.

```javascript id="continue-basic"
for (let index = 0; index < 5; index++) {
    if (index === 2) {
        continue;
    }

    console.log(index);
}
```

Output:

```text id="continue-basic-output"
0
1
3
4
```

When `index === 2`, the remaining statements in the current iteration are skipped. The loop then proceeds according to
the iteration semantics of the enclosing loop.

## Basic Syntax

The general syntax is:

```javascript id="continue-syntax"
continue;
```

A labeled form is also available:

```javascript id="continue-label-syntax"
continue labelName;
```

An unlabeled `continue` applies to the nearest enclosing loop.

A labeled `continue` applies to the loop identified by the specified label.

## Unlabeled continue

An ordinary `continue` affects only the nearest enclosing loop.

```javascript id="continue-nearest"
for (let index = 0; index < 5; index++) {
    if (index === 2) {
        continue;
    }

    process(index);
}
```

When `continue` executes, the statements after it in the current loop body are skipped.

```text id="continue-flow"
loop iteration
      ↓
condition
      ↓
body
      ↓
continue
      ↓
loop-specific continuation step
      ↓
next iteration
```

The exact continuation step depends on the type of loop.

## continue in for Loops

In a traditional `for` loop, `continue` causes execution to proceed to the loop's **update expression**, followed by the
condition check.

```javascript id="continue-for"
for (let index = 0; index < 5; index++) {
    if (index === 2) {
        continue;
    }

    console.log(index);
}
```

When `index === 2`:

```text id="continue-for-flow"
continue
   ↓
index++
   ↓
index < 5
   ↓
next iteration
```

The update expression is therefore still executed.

This is an important difference between `continue` and `break`.

## continue and the for Update Expression

Consider:

```javascript id="continue-for-update"
for (
    let index = 0;
    index < 5;
    index++
) {
    if (index === 2) {
        continue;
    }

    process(index);
}
```

The `index++` update still occurs when `continue` executes.

This means a `continue` does not bypass the update expression of a traditional `for` loop.

## continue in while Loops

In a `while` loop, `continue` skips the remainder of the body and proceeds to the loop's condition check.

```javascript id="continue-while"
let index = 0;

while (index < 5) {
    index++;

    if (index === 2) {
        continue;
    }

    console.log(index);
}
```

The control flow is:

```text id="continue-while-flow"
continue
   ↓
while condition
   ↓
next iteration
```

Unlike a traditional `for` loop, there is no separate update expression automatically executed by the loop.

This makes it particularly important to ensure that any required state update occurs before `continue`.

## Infinite while Loops Caused by continue

A `continue` can accidentally prevent the state required for loop termination from being updated.

```javascript id="continue-while-infinite"
let index = 0;

while (index < 5) {
    if (index === 2) {
        continue;
    }

    index++;
}
```

When `index` becomes `2`, `continue` executes before `index++`.

The condition is checked again with:

```text id="continue-while-infinite-state"
index === 2
```

The condition remains true, so the loop repeatedly executes `continue`.

The result is an infinite loop.

The state update must occur before the possible `continue`:

```javascript id="continue-while-fixed"
let index = 0;

while (index < 5) {
    index++;

    if (index === 2) {
        continue;
    }

    process(index);
}
```

## continue in do...while Loops

In a `do...while` loop, `continue` proceeds to the loop's condition check.

```javascript id="continue-do-while"
let index = 0;

do {
    index++;

    if (index === 2) {
        continue;
    }

    process(index);
} while (index < 5);
```

The flow is:

```text id="continue-do-flow"
continue
   ↓
while condition
   ↓
next iteration
```

As with `while`, there is no separate update expression automatically executed after `continue`.

Any state required for the next condition evaluation must already have been updated.

## continue in for...in Loops

`continue` can skip the current property during `for...in` enumeration.

```javascript id="continue-for-in"
const object = {
    first: 1,
    second: 2,
    third: 3
};

for (const key in object) {
    if (key === "second") {
        continue;
    }

    console.log(key);
}
```

Output:

```text id="continue-for-in-output"
first
third
```

The property is not removed or altered. Its current iteration is simply skipped.

## continue in for...of Loops

`continue` skips the current value produced by a `for...of` iterator.

```javascript id="continue-for-of"
const values = [10, 20, 30, 40];

for (const value of values) {
    if (value === 20) {
        continue;
    }

    console.log(value);
}
```

Output:

```text id="continue-for-of-output"
10
30
40
```

The iterator remains active and produces the next value.

## continue and Iterators

`continue` does not terminate a `for...of` loop.

```javascript id="continue-iterator"
for (const value of iterable) {
    if (shouldSkip(value)) {
        continue;
    }

    process(value);
}
```

The current iteration is abandoned, but the loop continues consuming the iterable.

This differs from `break`, which terminates the iteration and can trigger iterator cleanup.

## continue and Generator Iterators

The distinction is particularly relevant for generators:

```javascript id="continue-generator"
function* values() {
    yield 1;
    yield 2;
    yield 3;
}

for (const value of values()) {
    if (value === 2) {
        continue;
    }

    console.log(value);
}
```

The generator continues to produce subsequent values after `continue`.

The result is:

```text id="continue-generator-output"
1
3
```

## Nested Loops

An unlabeled `continue` applies only to the nearest enclosing loop.

```javascript id="continue-nested"
for (let outer = 0; outer < 3; outer++) {
    for (let inner = 0; inner < 3; inner++) {
        if (inner === 1) {
            continue;
        }

        console.log(outer, inner);
    }
}
```

The `continue` affects only the inner loop.

The outer loop continues normally.

Output:

```text id="continue-nested-output"
0 0
0 2
1 0
1 2
2 0
2 2
```

## continue in Nested Loop Types

The nearest-loop rule applies regardless of the loop types involved.

```javascript id="continue-mixed-nested"
for (const value of values) {
    while (condition()) {
        if (shouldSkip()) {
            continue;
        }

        process(value);
    }
}
```

The `continue` targets the `while` loop because it is the nearest enclosing loop.

It does not continue the outer `for...of` loop.

## Labeled continue

A labeled `continue` allows control to proceed to the next iteration of a specific enclosing loop.

```javascript id="continue-labeled"
outerLoop:
    for (let outer = 0; outer < 3; outer++) {
        for (let inner = 0; inner < 3; inner++) {
            if (shouldSkipOuterIteration(outer, inner)) {
                continue outerLoop;
            }

            process(outer, inner);
        }
    }
```

`continue outerLoop` skips the remainder of the current outer-loop iteration.

Control then proceeds with the next iteration of `outerLoop`.

## Labeled continue Flow

The difference between ordinary and labeled `continue` is:

```text id="continue-label-flow"
continue
    ↓
next iteration of nearest loop
```

versus:

```text id="continue-label-flow-outer"
continue outerLoop
        ↓
skip nested loops
        ↓
next iteration of outerLoop
```

This is useful when a condition discovered inside a nested loop should cause the entire current outer iteration to be
skipped.

## Labeled continue Syntax

A loop can be labeled:

```javascript id="continue-label-definition"
outerLoop:
    for (const outer of outerValues) {
        // ...
    }
```

The label can then be targeted:

```javascript id="continue-label-target"
continue outerLoop;
```

The label must identify an enclosing loop suitable for the `continue` operation.

Unlike labeled `break`, a labeled `continue` must target a loop rather than an arbitrary labeled block.

## Labeled continue vs Flag Variables

Without a labeled `continue`:

```javascript id="continue-flag"
for (const outer of outerValues) {
    let skip = false;

    for (const inner of innerValues) {
        if (shouldSkipOuterIteration(outer, inner)) {
            skip = true;
            break;
        }
    }

    if (skip) {
        continue;
    }

    processOuter(outer);
}
```

A labeled `continue` can express the same control flow directly:

```javascript id="continue-label-replacement"
outerLoop:
    for (const outer of outerValues) {
        for (const inner of innerValues) {
            if (shouldSkipOuterIteration(outer, inner)) {
                continue outerLoop;
            }
        }

        processOuter(outer);
    }
```

The labeled form avoids introducing an auxiliary state variable solely to communicate the desired control transfer.

Labels should still be used selectively because excessive use can make nested control flow harder to understand.

## continue vs break

The distinction is fundamental.

```javascript id="continue-vs-break"
for (const value of values) {
    if (shouldSkip(value)) {
        continue;
    }

    if (shouldStop(value)) {
        break;
    }

    process(value);
}
```

`continue`:

```text id="continue-vs-break-continue"
skip current iteration
        ↓
continue loop
```

`break`:

```text id="continue-vs-break-break"
terminate loop
        ↓
continue after loop
```

Use `continue` when the current value should not be processed but later values still should be.

Use `break` when no further iteration is required.

## continue vs return

`continue` only affects the current loop.

```javascript id="continue-vs-return"
function process(values) {
    for (const value of values) {
        if (shouldSkip(value)) {
            continue;
        }

        handle(value);
    }

    finalize();
}
```

`return` exits the entire function:

```javascript id="return-comparison"
function process(values) {
    for (const value of values) {
        if (shouldStop(value)) {
            return;
        }

        handle(value);
    }

    finalize();
}
```

The distinction is:

```text id="continue-return-distinction"
continue → skip current loop iteration
return   → exit current function
```

## Conditional Processing

A common use of `continue` is to process only elements satisfying a condition.

```javascript id="continue-filter"
for (const value of values) {
    if (!isValid(value)) {
        continue;
    }

    process(value);
}
```

This creates a guard at the beginning of the loop body.

An alternative is to invert the condition:

```javascript id="continue-inverted"
for (const value of values) {
    if (isValid(value)) {
        process(value);
    }
}
```

The better form depends on the complexity of the loop body.

For more complex processing, `continue` can reduce nesting:

```javascript id="continue-guard"
for (const item of items) {
    if (!item.enabled) {
        continue;
    }

    if (!isValid(item)) {
        continue;
    }

    if (isExpired(item)) {
        continue;
    }

    process(item);
}
```

## Guard-Style Loop Processing

Multiple `continue` statements can act as guards:

```javascript id="continue-guards"
for (const user of users) {
    if (!user.active) {
        continue;
    }

    if (!user.verified) {
        continue;
    }

    if (user.suspended) {
        continue;
    }

    process(user);
}
```

This avoids deeply nested conditionals:

```javascript id="continue-nested-alternative"
for (const user of users) {
    if (user.active) {
        if (user.verified) {
            if (!user.suspended) {
                process(user);
            }
        }
    }
}
```

Guard-style `continue` is particularly useful when the loop has a clear processing pipeline.

## Skipping Invalid Values

`continue` can skip values that fail validation while allowing processing to continue.

```javascript id="continue-invalid"
for (const value of values) {
    if (!isValid(value)) {
        continue;
    }

    process(value);
}
```

This differs from `break`:

```javascript id="break-invalid"
for (const value of values) {
    if (!isValid(value)) {
        break;
    }

    process(value);
}
```

The first pattern skips invalid values.

The second stops processing at the first invalid value.

## Skipping Special Cases

`continue` can isolate exceptional cases from the main processing path.

```javascript id="continue-special"
for (const item of items) {
    if (item.type === "metadata") {
        continue;
    }

    processData(item);
}
```

The loop body after the guard represents the normal processing path.

## continue and Side Effects

Statements after `continue` in the current iteration do not execute.

```javascript id="continue-side-effects"
for (const item of items) {
    if (shouldSkip(item)) {
        continue;
    }

    record(item);
    updateStatistics(item);
    emitEvent(item);
}
```

For skipped items:

```text id="continue-side-effects-skipped"
record()          → not executed
updateStatistics() → not executed
emitEvent()       → not executed
```

Therefore, any required cleanup, accounting, or state updates must occur before the `continue` or through a structure
that guarantees their execution.

## continue and finally

A `continue` does not bypass `finally` blocks.

```javascript id="continue-finally"
for (const item of items) {
    try {
        if (shouldSkip(item)) {
            continue;
        }

        process(item);
    } finally {
        cleanup(item);
    }
}
```

The `finally` block executes before control proceeds with the next iteration.

This is important when the loop body acquires or temporarily modifies resources or state.

## continue and try...catch

`continue` can be used inside `try` or `catch` blocks when an enclosing loop exists.

```javascript id="continue-catch"
for (const item of items) {
    try {
        process(item);
    } catch (error) {
        logError(error);
        continue;
    }

    finalize(item);
}
```

When the `catch` executes `continue`, the `finalize(item)` statement is skipped and the loop proceeds to its next
iteration.

## continue and Cleanup

If an iteration requires cleanup regardless of whether processing succeeds, cleanup should not be placed after a
possible `continue`.

This is problematic:

```javascript id="continue-cleanup-bad"
for (const item of items) {
    acquire(item);

    if (shouldSkip(item)) {
        continue;
    }

    release(item);
}
```

For skipped items, `release(item)` is never reached.

A `finally` block provides a reliable structure:

```javascript id="continue-cleanup-good"
for (const item of items) {
    acquire(item);

    try {
        if (shouldSkip(item)) {
            continue;
        }

        process(item);
    } finally {
        release(item);
    }
}
```

## continue and Array Methods

Many uses of `continue` correspond conceptually to filtering elements before processing them.

For example:

```javascript id="continue-array-filter"
for (const value of values) {
    if (!isValid(value)) {
        continue;
    }

    process(value);
}
```

can sometimes be represented as:

```javascript id="continue-array-filter-method"
values
    .filter(isValid)
    .forEach(process);
```

However, these approaches are not equivalent in every situation.

A loop is often preferable when:

* processing has complex control flow,
* multiple statements depend on mutable state,
* early termination may be required,
* performance characteristics matter,
* or the operation is naturally imperative.

Do not replace a clear loop mechanically merely to eliminate `continue`.

## continue and forEach ()

`continue` cannot be used inside a `forEach()` callback to continue the surrounding loop.

This is invalid:

```javascript id="continue-foreach-invalid"
values.forEach((value) => {
    if (shouldSkip(value)) {
        // continue; // Invalid
    }

    process(value);
});
```

A callback is a separate function boundary.

To skip the current callback execution, use an explicit `return`:

```javascript id="continue-foreach-return"
values.forEach((value) => {
    if (shouldSkip(value)) {
        return;
    }

    process(value);
});
```

This returns from the callback; it does not provide the same general loop-control semantics as `continue`.

When actual loop control is required, use an appropriate loop statement.

## continue and Function Boundaries

A `continue` cannot cross a function boundary.

```javascript id="continue-function-invalid"
for (const value of values) {
    function processValue() {
        // continue; // Invalid
    }
}
```

The nested function does not belong to the loop's control-flow context.

The same rule applies to callbacks:

```javascript id="continue-callback-boundary"
values.forEach((value) => {
    // continue; // Invalid
});
```

The callback must use its own control flow.

## continue and Nested Callbacks

A function called from inside a loop cannot execute `continue` on behalf of that loop.

```javascript id="continue-helper"
function shouldSkip(value) {
    return !isValid(value);
}

for (const value of values) {
    if (shouldSkip(value)) {
        continue;
    }

    process(value);
}
```

The `continue` remains directly within the loop's control-flow structure.

This separation is generally preferable because helper functions return information rather than attempting to manipulate
the caller's loop control.

## Performance Considerations

`continue` can avoid unnecessary work by skipping the remainder of an iteration.

```javascript id="continue-performance"
for (const item of items) {
    if (!isRelevant(item)) {
        continue;
    }

    expensiveProcessing(item);
}
```

The expensive operation is never invoked for irrelevant items.

However, `continue` itself should not be treated as a performance optimization independent of algorithm design. Its
primary purpose is expressing control flow.

The significant performance benefit comes from avoiding unnecessary work in the loop body.

## Best Practices

* **Use `continue` when the current iteration should be skipped:** It is appropriate when an item is irrelevant,
  invalid, disabled, expired, or otherwise not eligible for processing.
* **Use `break` when the loop should terminate:** Do not use `continue` when no subsequent iteration should occur.
* **Use `return` when the function should terminate:** `continue` affects only the enclosing loop; it does not exit the
  surrounding function.
* **Use guard-style `continue` to reduce nesting:** Early rejection of values can make the normal processing path easier
  to read.
* **Be especially careful in `while` and `do...while` loops:** Unlike a traditional `for` loop, these loops do not
  automatically execute a separate update expression after `continue`.
* **Update loop state before `continue` when necessary:** A missing state update can create an infinite loop.
* **Remember `for` update semantics:** In a traditional `for` loop, `continue` proceeds to the update expression before
  the next condition check.
* **Remember `for...of` iterator semantics:** `continue` skips the current value but keeps consuming the iterator.
* **Remember `for...in` enumerates the next property:** `continue` skips processing of the current property and allows
  enumeration to proceed.
* **Use labeled `continue` sparingly:** It can be useful for skipping an entire outer-loop iteration from inside nested
  loops, but excessive labels can make control flow difficult to follow.
* **Prefer clear conditions over excessive `continue` statements:** A small number of guard-style continues can improve
  readability; many scattered continues can make execution paths difficult to trace.
* **Do not place mandatory cleanup after a possible `continue`:** Use `finally` or another guaranteed cleanup mechanism
  when resources or temporary state must be released.
* **Do not attempt to use `continue` across function boundaries:** Callback functions and nested functions have their
  own control-flow contexts.
* **Do not confuse `return` inside `forEach()` with `continue`:** Returning from a callback only ends that callback
  invocation.
* **Choose loops over array methods when complex control flow is required:** `continue` is a legitimate reason to use an
  explicit loop when the operation is clearer imperatively.
* **Use `continue` to isolate the normal processing path:** When several conditions can reject an item, early `continue`
  statements can keep the main operation at a low indentation level.
* **Avoid using `continue` merely to create clever control flow:** The statement should represent an obvious decision to
  skip the current iteration.
* **Consider whether filtering belongs before iteration:** If all invalid values can be identified independently and no
  early termination or stateful processing is required, preprocessing or collection methods may provide a clearer
  abstraction.

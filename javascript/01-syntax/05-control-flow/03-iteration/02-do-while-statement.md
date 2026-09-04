# do...while Statement

## do...while Statement

**`do...while` Statement:** A loop statement that executes a statement or block of statements once before evaluating its
condition. The condition is evaluated after each iteration, making `do...while` a post-test loop.

```javascript
do {
    statement;
} while (condition);
```

The general execution flow is:

```text
execute body → condition → truthy → execute body → condition → ...
                    ↓
                  falsy
                    ↓
             continue after loop
```

Unlike a `while` statement, the `do...while` body is guaranteed to execute at least once.

```javascript
let count = 0;

do {
    console.log(count);
    count++;
} while (count < 5);
```

The output is:

```text
0
1
2
3
4
```

When `count` becomes `5`, the condition evaluates to falsy and execution continues after the loop.

## Condition Evaluation

The condition of a `do...while` statement is evaluated after the loop body executes.

```javascript
let value = 0;

do {
    console.log(value);
    value++;
} while (value < 3);
```

The evaluation sequence is:

```text
execute body
    ↓
value < 3 → true
    ↓
execute body
    ↓
value < 3 → true
    ↓
execute body
    ↓
value < 3 → false
    ↓
exit loop
```

The condition is therefore never evaluated before the first iteration.

This distinguishes `do...while` from `while`:

```javascript
let value = 0;

while (value > 0) {
    console.log(value);
}
```

The `while` body executes zero times because its initial condition is falsy.

```javascript
let value = 0;

do {
    console.log(value);
} while (value > 0);
```

The `do...while` body executes once even though the condition is falsy.

## Guaranteed First Iteration

**Guaranteed First Iteration:** The defining characteristic of `do...while` is that the loop body executes before the
first condition check.

```javascript
do {
    initialize();
} while (shouldContinue());
```

This structure is appropriate when the first operation must occur before the program can determine whether another
iteration is necessary.

Common examples include:

* displaying a menu before asking whether the user wants to continue
* performing an operation before validating its result
* reading input before deciding whether more input is required
* executing a retry attempt before checking whether another attempt is needed

```javascript
let input;

do {
    input = readInput();
} while (!isValid(input));
```

The input operation occurs at least once because validation cannot determine whether the first input is needed until
after an input has been obtained.

## Initialization

The state used by the loop can be initialized before entering the `do...while` statement.

```javascript
let count = 0;

do {
    process(count);
    count++;
} while (count < 10);
```

The initialization establishes the initial state, while the condition determines whether another iteration should occur.

Because the body always executes once, the initial state does not need to satisfy the continuation condition for the
first execution to occur.

```javascript
let count = 100;

do {
    console.log(count);
    count++;
} while (count < 10);
```

The body executes once and then the condition `count < 10` evaluates to falsy.

## Loop Update

**Loop Update:** An operation that changes the state used by the loop condition so that the condition eventually becomes
falsy.

```javascript
let count = 0;

do {
    process(count);
    count++;
} while (count < 10);
```

The `count++` operation advances the loop state.

Without an appropriate state transition, a loop can continue indefinitely:

```javascript
let count = 0;

do {
    process(count);
} while (count < 10);
```

Because `count` never changes, the condition remains truthy.

The update does not have to be numeric:

```javascript
let node = head;

do {
    process(node);
    node = node.next;
} while (node !== null);
```

The loop progresses by advancing through the linked structure.

## Infinite do...while Loops

**Infinite Loop:** A loop whose condition remains truthy indefinitely.

```javascript
do {
    process();
} while (true);
```

An infinite `do...while` loop can be intentional when an explicit termination mechanism exists.

```javascript
do {
    const command = readCommand();

    if (command === "quit") {
        break;
    }

    processCommand(command);
} while (true);
```

An infinite loop is accidental when the state required for termination is never changed.

```javascript
let count = 0;

do {
    process(count);
} while (count < 10);
```

The loop has no operation that changes `count`, so the continuation condition never changes.

## Loop Termination

A `do...while` loop normally terminates when its condition becomes falsy.

```javascript
let remaining = 5;

do {
    process(remaining);
    remaining--;
} while (remaining > 0);
```

The loop can also terminate explicitly using `break`.

```javascript
do {
    const value = readValue();

    if (value === null) {
        break;
    }

    process(value);
} while (hasMoreValues());
```

`break` immediately terminates the nearest enclosing loop and transfers control to the statement following the loop.

## break in do...while Loops

**`break` Statement:** A jump statement that immediately terminates the nearest enclosing loop.

```javascript
let count = 0;

do {
    if (count === 5) {
        break;
    }

    console.log(count);
    count++;
} while (count < 10);
```

The loop terminates when `count` reaches `5`, even though the normal loop condition would still permit another
iteration.

`break` is useful when a secondary termination condition is discovered inside the loop body.

```javascript
do {
    const item = getNextItem();

    if (isInvalid(item)) {
        break;
    }

    process(item);
} while (hasNext());
```

The primary continuation condition remains `hasNext()`, while `break` handles the exceptional termination condition.

## continue in do...while Loops

**`continue` Statement:** A jump statement that skips the remainder of the current iteration and proceeds to the loop's
condition evaluation.

```javascript
let count = 0;

do {
    count++;

    if (count % 2 === 0) {
        continue;
    }

    console.log(count);
} while (count < 10);
```

The output is:

```text
1
3
5
7
9
```

Unlike `continue` in a `while` loop, execution of a `continue` in a `do...while` statement proceeds to the condition at
the bottom of the loop.

This distinction is important when the loop contains state updates.

```javascript
let count = 0;

do {
    if (count % 2 === 0) {
        count++;
        continue;
    }

    console.log(count);
    count++;
} while (count < 10);
```

The state update must still occur before `continue` when it is required for termination.

## Nested do...while Loops

A `do...while` loop can contain another `do...while` loop.

```javascript
let row = 0;

do {
    let column = 0;

    do {
        console.log(row, column);
        column++;
    } while (column < 3);

    row++;
} while (row < 3);
```

The inner loop executes completely for each iteration of the outer loop.

Because both loops are post-test loops, both bodies execute at least once.

Nested loops increase the number of operations performed and can increase algorithmic complexity.

For example, two nested loops that each perform `n` iterations generally perform `O(n²)` iterations:

```javascript
let row = 0;

do {
    let column = 0;

    do {
        process(row, column);
        column++;
    } while (column < n);

    row++;
} while (row < n);
```

The exact complexity depends on how many times each loop executes and how their iteration counts depend on one another.

## Nested break

A `break` statement terminates only the nearest enclosing loop.

```javascript
let row = 0;

do {
    let column = 0;

    do {
        if (column === 1) {
            break;
        }

        process(row, column);
        column++;
    } while (column < 3);

    row++;
} while (row < 3);
```

The `break` terminates the inner `do...while` loop but does not terminate the outer loop.

Multiple nested levels can be terminated using a labeled statement:

```javascript
outer:
    do {
        let column = 0;

        do {
            if (shouldStop()) {
                break outer;
            }

            process(column);
            column++;
        } while (column < 3);

        row++;
    } while (row < 3);
```

Labeled control flow should be used deliberately because it introduces a non-local transfer of control.

## Input Validation

`do...while` is particularly useful for input validation because an input operation must occur before its validity can
be evaluated.

```javascript
let input;

do {
    input = readInput();
} while (!isValid(input));
```

The input is guaranteed to be requested at least once.

A more explicit version can provide feedback for invalid input:

```javascript
let input;

do {
    input = readInput();

    if (!isValid(input)) {
        showInvalidInputMessage();
    }
} while (!isValid(input));
```

When the validation operation is expensive or has side effects, avoid evaluating it unnecessarily. Store the result when
appropriate:

```javascript
let input;
let valid;

do {
    input = readInput();
    valid = isValid(input);

    if (!valid) {
        showInvalidInputMessage();
    }
} while (!valid);
```

This makes the validation result explicit and avoids repeating the same operation.

## Menu Processing

A menu-driven interaction is a common use case for `do...while` because the menu must normally be displayed at least
once.

```javascript
let choice;

do {
    displayMenu();
    choice = readChoice();

    processChoice(choice);
} while (choice !== "exit");
```

The menu is displayed before the continuation condition is checked.

This naturally expresses the intended sequence:

```text
display menu
    ↓
read choice
    ↓
process choice
    ↓
choice is exit?
    ├── yes → terminate
    └── no  → display menu again
```

## Retry Logic

`do...while` can represent an operation that must be attempted before deciding whether another attempt is required.

```javascript
let success;
let attempts = 0;

do {
    attempts++;
    success = attemptOperation();
} while (!success && attempts < 3);
```

The operation is attempted at least once.

The condition combines the retry requirement with a maximum attempt count, preventing unbounded retries.

```javascript
let success;
let attempts = 0;

do {
    attempts++;
    success = attemptOperation();

    if (success) {
        break;
    }
} while (attempts < 3);
```

The exact structure depends on whether success, failure, cancellation, or other states require distinct handling.

## Sentinel-Controlled Loops

A **sentinel value** is a value that indicates that processing should terminate.

```javascript
let value;

do {
    value = readValue();

    if (value !== "quit") {
        process(value);
    }
} while (value !== "quit");
```

The first value is always read before the sentinel can be checked.

The sentinel should be clearly defined and should not be confused with valid input.

```javascript
const SENTINEL = "quit";

let value;

do {
    value = readValue();

    if (value !== SENTINEL) {
        process(value);
    }
} while (value !== SENTINEL);
```

For complex input protocols, an explicit result or state object may be clearer than using a special sentinel value.

## do...while with Expressions

The condition can contain any expression whose resulting value can be evaluated for truthiness.

```javascript
do {
    process();
} while (hasMoreItems());
```

The condition may also combine multiple predicates:

```javascript
do {
    process();
} while (hasMoreItems() && !shouldStop());
```

The condition is evaluated after every iteration.

Side effects in the condition should be used cautiously because they occur at the bottom of every iteration:

```javascript
do {
    process();
} while (index++ < items.length);
```

Separating state changes from the condition can make the loop easier to understand:

```javascript
do {
    process(items[index]);
    index++;
} while (index < items.length);
```

## Condition Side Effects

A `do...while` condition may call functions or otherwise produce side effects.

```javascript
do {
    process();
} while (hasNext());
```

The `hasNext()` function executes after each iteration.

Because the condition is evaluated after the body, side effects in the condition occur after the current iteration's
processing.

Conditions should generally express whether another iteration should occur rather than perform unrelated operations.

```javascript
do {
    const item = getNextItem();
    process(item);
} while (hasMoreItems());
```

If evaluating the continuation state requires substantial logic, calculate it explicitly when this improves readability.

## do...while and Block Scope

A `do...while` statement can contain block-scoped declarations inside its body.

```javascript
do {
    const value = getValue();
    process(value);
} while (hasMoreValues());
```

The lexical binding `value` is local to the body block and is recreated for each iteration.

If a variable must be available to both the body and the condition, it must be declared outside the loop body.

```javascript
let value;

do {
    value = getValue();
    process(value);
} while (value !== null);
```

The condition can then access `value`.

## do...while and Return

A `return` statement can terminate the enclosing function from inside a `do...while` loop.

```javascript
function findValid(values) {
    let index = 0;

    do {
        if (isValid(values[index])) {
            return values[index];
        }

        index++;
    } while (index < values.length);

    return null;
}
```

When `return` is executed, the function terminates immediately and the loop does not perform another condition
evaluation.

`return` can therefore be used as an early termination mechanism when the desired result has been found.

## do...while and throw

A `throw` statement can terminate execution from inside a `do...while` loop.

```javascript
do {
    const result = process();

    if (result.error) {
        throw new Error(result.error);
    }
} while (hasMoreWork());
```

When `throw` executes, control leaves the loop and propagates the exception according to normal exception-handling
rules.

No additional loop condition evaluation occurs after the exception is thrown.

## do...while vs while

Both statements repeatedly execute a block while a condition remains truthy, but they differ in when the condition is
evaluated.

`while` evaluates its condition before the first iteration:

```javascript
while (condition) {
    process();
}
```

`do...while` evaluates its condition after the first iteration:

```javascript
do {
    process();
} while (condition);
```

This produces an important behavioral difference:

```javascript
let value = 0;

while (value > 0) {
    console.log("while");
}
```

The body executes zero times.

```javascript
let value = 0;

do {
    console.log("do...while");
} while (value > 0);
```

The body executes once.

Use `while` when the condition must be satisfied before the first execution.

Use `do...while` when the operation must occur at least once before determining whether another iteration is required.

## do...while vs for

A `for` statement is generally clearer when iteration follows a known initialization, condition, and update structure.

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

A `do...while` statement is generally clearer when the body must execute before the continuation condition can be
evaluated.

```javascript
let input;

do {
    input = readInput();
} while (!isValid(input));
```

The distinction is semantic rather than performance-based.

## Best Practices

* **Use `do...while` when the body must execute at least once:** This is the defining characteristic of the construct
  and should be the reason for choosing it over `while`.
* **Use `while` when zero iterations are valid:** If the condition must be checked before any work occurs, a pre-test
  `while` loop communicates that requirement more directly.
* **Use `do...while` for input validation:** Read or obtain the value first, then determine whether another attempt is
  required.
* **Use `do...while` for menu-driven interactions:** The menu or initial interaction normally needs to be presented
  before the continuation condition can be evaluated.
* **Use `do...while` for bounded retry operations:** Perform the initial attempt first, then evaluate whether another
  attempt is necessary.
* **Make the termination condition explicit:** The condition should clearly describe why another iteration should
  continue.
* **Ensure loop state progresses toward termination:** If the condition depends on mutable state, make sure that state
  changes appropriately.
* **Be especially careful with `continue`:** `continue` proceeds to the condition at the bottom of a `do...while` loop,
  so required state updates must occur before it.
* **Use `break` for secondary termination conditions:** Keep the primary continuation rule in the `while` condition when
  possible.
* **Avoid accidental infinite loops:** A condition that remains truthy combined with an unchanging loop state can cause
  unbounded execution.
* **Keep side effects out of the loop condition when possible:** Conditions containing assignments, increments, or
  complex function calls can obscure the loop's progression.
* **Do not repeat expensive or stateful validation unnecessarily:** Store the result of a validation operation when
  evaluating it multiple times would be costly or produce different results.
* **Use explicit state variables when the continuation condition depends on values produced by the body:** Declare the
  state outside the body when the condition needs access to it.
* **Use nested loops carefully:** Nested `do...while` loops can produce substantial algorithmic complexity and make
  control flow harder to analyze.
* **Remember that `break` affects only the nearest loop:** Use labels or another explicit mechanism when multiple nested
  levels must be terminated.
* **Use `return` when the enclosing function should terminate:** There is no reason to continue evaluating the loop when
  the function's required result has already been produced.
* **Use `throw` when an unrecoverable or invalid state should escape the loop:** Exception propagation terminates the
  current loop execution.
* **Prefer explicit conditions over hidden control flow:** The condition should communicate whether another iteration is
  required rather than perform unrelated work.
* **Do not use `do...while` merely because it is shorter:** The guaranteed first iteration should correspond to an
  actual semantic requirement.
* **Avoid using `do...while` when the first iteration is only conditionally valid:** If the body must not execute when
  the initial state is invalid, use `while` instead.
* **Keep the body focused:** Extract complex processing logic into functions rather than allowing the loop to become
  responsible for unrelated operations.
* **Do not optimize loop structure based solely on assumptions about JavaScript engine behavior:** Prefer the clearest
  correct loop structure and use profiling when performance is genuinely relevant.

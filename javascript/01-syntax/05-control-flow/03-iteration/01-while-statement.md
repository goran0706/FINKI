# while Statement

## while Statement

**`while` Statement:** A loop statement that repeatedly executes a statement or block of statements as long as its
condition evaluates to a truthy value. The condition is evaluated before each iteration, making `while` a pre-test loop.

```javascript
while (condition) {
    statement;
}
```

The general execution flow is:

```text
condition → truthy → execute body → condition → truthy → execute body → ...
                   ↓
                 falsy
                   ↓
              continue after loop
```

The loop body is executed only when the condition evaluates to truthy.

```javascript
let count = 0;

while (count < 5) {
    console.log(count);
    count++;
}
```

The output is:

```text
0
1
2
3
4
```

When `count` becomes `5`, the condition `count < 5` evaluates to falsy and execution continues after the loop.

## Condition Evaluation

The `while` condition is evaluated before every iteration.

```javascript
let value = 10;

while (value > 0) {
    console.log(value);
    value--;
}
```

The evaluation sequence is:

```text
value > 0 → true  → execute body
value > 0 → true  → execute body
...
value > 0 → false → exit loop
```

Because the condition is evaluated before the body, the loop body may execute zero times.

```javascript
let value = 0;

while (value > 0) {
    console.log(value);
}
```

Nothing is printed because the initial condition is already falsy.

## Loop Initialization

The state used by the loop is normally initialized before entering the `while` statement.

```javascript
let index = 0;

while (index < items.length) {
    process(items[index]);
    index++;
}
```

The initialization establishes the starting state, while the loop condition determines whether another iteration should
occur.

The update operation is normally performed inside the loop body.

```javascript
let index = 0;

while (index < 10) {
    process(index);
    index++;
}
```

Unlike a `for` statement, `while` does not provide dedicated syntax for initialization, condition, and update. This can
make `while` clearer when the initialization and update logic are not naturally expressed as a simple counter
progression.

## Loop Update

**Loop Update:** An operation that changes the state used by the loop condition so that the condition eventually becomes
falsy.

```javascript
let count = 0;

while (count < 10) {
    process(count);
    count++;
}
```

The update `count++` is necessary for termination.

A loop whose condition never becomes falsy can execute indefinitely:

```javascript
let count = 0;

while (count < 10) {
    console.log(count);
}
```

Because `count` never changes, `count < 10` remains true.

The update does not necessarily need to be a numeric increment:

```javascript
let node = head;

while (node !== null) {
    process(node);
    node = node.next;
}
```

The important requirement is that the loop's state progresses toward a terminating condition when termination is
intended.

## Infinite while Loops

**Infinite Loop:** A loop whose condition remains truthy indefinitely.

```javascript
while (true) {
    process();
}
```

An infinite loop can be intentional when the loop represents a continuously running process and contains an explicit
mechanism for termination.

```javascript
while (true) {
    const command = readCommand();

    if (command === "quit") {
        break;
    }

    processCommand(command);
}
```

An infinite loop is accidental when the loop's state never reaches a condition that allows termination.

```javascript
let count = 0;

while (count < 10) {
    process(count);
}
```

Infinite loops should therefore be intentional and should have a clearly identifiable termination mechanism when the
application requires termination.

## Loop Termination

A `while` loop normally terminates when its condition becomes falsy.

```javascript
let remaining = 5;

while (remaining > 0) {
    process(remaining);
    remaining--;
}
```

The loop can also be terminated explicitly with `break`.

```javascript
while (true) {
    const value = readValue();

    if (value === null) {
        break;
    }

    process(value);
}
```

`break` immediately terminates the nearest enclosing loop and transfers control to the statement following the loop.

## break in while Loops

**`break` Statement:** A jump statement that immediately terminates the nearest enclosing loop.

```javascript
let count = 0;

while (count < 10) {
    if (count === 5) {
        break;
    }

    console.log(count);
    count++;
}
```

The loop terminates when `count` reaches `5`, even though the loop condition `count < 10` remains truthy.

`break` is useful when the termination condition cannot naturally be expressed as the primary loop condition or when
multiple conditions can terminate the loop.

```javascript
while (hasMoreItems()) {
    const item = getNextItem();

    if (isInvalid(item)) {
        break;
    }

    process(item);
}
```

## continue in while Loops

**`continue` Statement:** A jump statement that skips the remainder of the current iteration and proceeds to the next
iteration of the nearest enclosing loop.

```javascript
let count = 0;

while (count < 10) {
    count++;

    if (count % 2 === 0) {
        continue;
    }

    console.log(count);
}
```

The output is:

```text
1
3
5
7
9
```

For a `while` loop, reaching `continue` causes execution to proceed to the loop's condition evaluation.

This makes it important to update the loop state before `continue` when the update is required for termination.

```javascript
let count = 0;

while (count < 10) {
    if (count % 2 === 0) {
        count++;
        continue;
    }

    console.log(count);
    count++;
}
```

Failing to update the state before `continue` can create an infinite loop.

## Nested while Loops

A `while` loop can contain another `while` loop.

```javascript
let row = 0;

while (row < 3) {
    let column = 0;

    while (column < 3) {
        console.log(row, column);
        column++;
    }

    row++;
}
```

Each iteration of the outer loop executes the complete inner loop.

Nested loops increase the number of operations performed and can increase algorithmic complexity.

For example, two nested loops that each iterate `n` times generally perform `O(n²)` iterations:

```javascript
let row = 0;

while (row < n) {
    let column = 0;

    while (column < n) {
        process(row, column);
        column++;
    }

    row++;
}
```

The actual complexity depends on how many times each loop executes and whether their iteration counts are independent.

## Nested break

A `break` statement terminates only the nearest enclosing loop.

```javascript
let row = 0;

while (row < 3) {
    let column = 0;

    while (column < 3) {
        if (column === 1) {
            break;
        }

        process(row, column);
        column++;
    }

    row++;
}
```

The `break` terminates the inner `while` loop but does not terminate the outer loop.

To terminate multiple levels of nested loops, additional control flow is required, such as a labeled statement:

```javascript
outer:
    while (row < 3) {
        let column = 0;

        while (column < 3) {
            if (shouldStop()) {
                break outer;
            }

            process(row, column);
            column++;
        }

        row++;
    }
```

Labeled control flow should be used deliberately because it introduces a non-local transfer of control.

## while with External State

A `while` loop is particularly useful when the number of iterations is not known in advance and termination depends on
changing external or dynamically obtained state.

```javascript
while (hasNext()) {
    const item = next();
    process(item);
}
```

This is useful for processing streams, queues, iterators, input sources, and other stateful processes where the total
number of iterations is determined during execution.

```javascript
while (queue.length > 0) {
    const item = queue.shift();
    process(item);
}
```

The loop continues until the state represented by `queue.length` reaches zero.

## while with Input Processing

A `while` loop can process input until a sentinel value or termination condition is encountered.

```javascript
let input = readInput();

while (input !== "quit") {
    process(input);
    input = readInput();
}
```

The initial input is evaluated before the first iteration, and a new input value is obtained at the end of each
iteration.

A sentinel-based loop should make the termination value explicit:

```javascript
let command = readCommand();

while (command !== "exit") {
    execute(command);
    command = readCommand();
}
```

If the input operation can itself fail or return an unexpected value, that state should be handled explicitly.

## while with Mutable Collections

A `while` loop can process a mutable collection by repeatedly changing the collection until a termination condition is
reached.

```javascript
while (items.length > 0) {
    const item = items.pop();
    process(item);
}
```

Each iteration removes one element, causing `items.length` to decrease.

Mutating a collection while iterating over it requires careful consideration of how the mutation affects the loop
condition and the remaining elements.

```javascript
while (items.length > 0) {
    const item = items.shift();
    process(item);
}
```

For large arrays, repeatedly using `shift()` can introduce unnecessary work because removing the first element requires
the remaining elements to be reindexed. An index-based approach or another queue representation may be more appropriate
for performance-sensitive code.

## while and Iterator Protocols

A `while` loop can manually consume an iterator.

```javascript
const iterator = collection[Symbol.iterator]();

let result = iterator.next();

while (!result.done) {
    process(result.value);
    result = iterator.next();
}
```

The loop continues while the iterator result has not reached its completed state.

The equivalent `for...of` form is generally clearer when manual iterator control is not required:

```javascript
for (const value of collection) {
    process(value);
}
```

Manual iterator consumption is useful when the program needs direct control over calls to `next()` or needs to
interleave iterator advancement with other operations.

## while vs for

Both `while` and `for` can implement repeated execution, but they communicate different loop structures.

A `for` statement is generally appropriate when initialization, condition, and update form a compact iteration
structure:

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

A `while` statement is generally appropriate when the number of iterations is not known in advance or when the state
transition is more naturally expressed inside the loop:

```javascript
let item = getNextItem();

while (item !== null) {
    process(item);
    item = getNextItem();
}
```

The distinction is primarily semantic and structural rather than performance-based.

## while vs do...while

A `while` statement evaluates its condition before the first iteration, so the body can execute zero times.

```javascript
while (condition) {
    process();
}
```

A `do...while` statement evaluates its condition after the first iteration, so its body always executes at least once.

```javascript
do {
    process();
} while (condition);
```

Use `while` when execution depends on the condition being true before entering the loop.

Use `do...while` when one execution is required before the condition can be evaluated.

## while and Side Effects

The loop condition may contain function calls or other side effects.

```javascript
while (hasNext()) {
    process();
}
```

The function `hasNext()` executes before every iteration.

Conditions with side effects can make the loop harder to reason about:

```javascript
while (index++ < items.length) {
    process(items[index]);
}
```

The state mutation is hidden inside the condition, making the loop's progression less explicit.

A clearer structure separates condition evaluation from state changes when practical:

```javascript
while (index < items.length) {
    process(items[index]);
    index++;
}
```

The condition should generally communicate whether another iteration is permitted rather than perform unrelated work.

## Loop-Invariant Conditions

**Loop-Invariant Condition:** A condition or portion of a condition whose value does not change during loop execution.

```javascript
const enabled = configuration.enabled;

while (hasItems()) {
    if (enabled) {
        processNext();
    }
}
```

If a condition is genuinely invariant, evaluating it repeatedly may be unnecessary.

However, manual optimization should not be performed blindly. Function calls, getters, proxies, mutable objects, and
other observable behavior can make apparently stable expressions non-invariant.

Clarity should generally take precedence unless profiling demonstrates a meaningful performance impact.

## Best Practices

* **Use `while` when the iteration count is not known in advance:** It is well suited to loops whose termination depends
  on state that changes during execution.
* **Use `for` when initialization, condition, and update naturally form one iteration structure:** A `for` loop
  generally communicates counter-based iteration more clearly.
* **Use `do...while` when the body must execute at least once:** `while` performs its condition check before the first
  iteration, whereas `do...while` checks afterward.
* **Make the termination condition explicit:** The condition should clearly communicate what must remain true for
  another iteration to execute.
* **Ensure loop state progresses toward termination:** Every potentially infinite `while` loop should have an
  intentional reason for remaining infinite or a clearly identifiable path to termination.
* **Do not forget the loop update:** If the condition depends on mutable state, ensure that state is actually changed
  when necessary.
* **Be especially careful with `continue`:** Since `continue` proceeds directly to the next condition evaluation in a
  `while` loop, any required state update must occur before the `continue`.
* **Use `break` for exceptional or secondary termination conditions:** Keep the primary termination rule in the loop
  condition when possible.
* **Avoid hidden state changes inside the condition:** Conditions containing assignments, increments, function calls, or
  other side effects can obscure how the loop progresses.
* **Keep loop conditions cheap and predictable:** Conditions execute before every iteration, so unnecessary work should
  not be repeated without reason.
* **Avoid accidental infinite loops:** A loop whose condition can never become falsy will continue indefinitely unless
  explicitly terminated.
* **Use explicit state transitions for complex loops:** When the loop represents a stateful process, make changes to the
  state visible rather than embedding them across complicated expressions.
* **Use nested loops carefully:** Nested `while` loops can increase algorithmic complexity substantially, particularly
  when both loops scale with the same input size.
* **Remember that `break` affects only the nearest loop:** Use labels or other explicit coordination when multiple
  nested levels must be terminated.
* **Do not mutate collections without considering iteration semantics:** Removing or adding elements can change indexes,
  ordering, and the termination condition.
* **Prefer appropriate queue structures for repeated removal from the front:** Repeated `Array.prototype.shift()`
  operations can be inefficient for large collections.
* **Use `for...of` instead of manually consuming an iterator when direct iterator control is unnecessary:** It provides
  clearer iteration semantics and handles iterator advancement automatically.
* **Do not optimize loop structure based solely on assumptions about the JavaScript engine:** Modern engines perform
  their own optimizations; measure genuinely hot paths before introducing complexity for performance.
* **Keep the main execution path readable:** Extract complex processing logic into functions rather than allowing the
  loop body to become a large block of unrelated operations.
* **Use infinite `while (true)` loops only intentionally:** They are appropriate for event-processing or retry-style
  control flow when an explicit `break`, `return`, `throw`, or external termination mechanism exists.

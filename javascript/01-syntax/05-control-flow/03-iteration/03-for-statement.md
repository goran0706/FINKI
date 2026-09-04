# for Statement

## for Statement

**`for` Statement:** A loop statement that repeatedly executes a statement or block of statements while a condition
remains truthy. The `for` statement provides dedicated syntax for initialization, condition evaluation, and iteration
update, making it well suited to counter-based and sequence-based iteration.

```javascript
for (initialization; condition; update) {
    statement;
}
```

The general execution flow is:

```text
initialization
     ↓
condition → falsy → exit loop
     ↓
   truthy
     ↓
 execute body
     ↓
   update
     ↓
 condition → ...
```

The initialization is executed once before the first condition evaluation. The condition is evaluated before each
iteration, and the update expression is evaluated after each iteration.

```javascript
for (let count = 0; count < 5; count++) {
    console.log(count);
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

The loop terminates when `count < 5` evaluates to falsy.

## Initialization

**Initialization:** The first component of a `for` statement. It executes once before the first condition evaluation and
is commonly used to declare and initialize the loop variable.

```javascript
for (let index = 0; index < 10; index++) {
    process(index);
}
```

The initialization `let index = 0` executes once.

The initialization can contain an expression:

```javascript
let index = 0;

for (index = 0; index < 10; index++) {
    process(index);
}
```

It can also be omitted:

```javascript
let index = 0;

for (; index < 10; index++) {
    process(index);
}
```

An omitted initialization does not prevent the loop from operating; it simply means the loop state is established
elsewhere.

Multiple expressions can be used in the initialization section, separated by commas:

```javascript
for (let left = 0, right = items.length - 1;
     left < right;
     left++, right--) {
    process(left, right);
}
```

When multiple initialization expressions are used, they should represent closely related loop state.

## Condition

**Condition:** The second component of a `for` statement. It is evaluated before each iteration and determines whether
the loop body executes.

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

If the condition evaluates to truthy, the body executes.

If it evaluates to falsy, the loop terminates.

The condition can be omitted:

```javascript
for (; ;) {
    process();
}
```

An omitted condition is treated as always allowing another iteration, creating an infinite loop unless another
control-flow mechanism terminates it.

```javascript
for (; ;) {
    const value = readValue();

    if (value === null) {
        break;
    }

    process(value);
}
```

## Update

**Update:** The third component of a `for` statement. It executes after each iteration of the loop body and before the
next condition evaluation.

```javascript
for (let index = 0; index < 10; index++) {
    process(index);
}
```

The update `index++` occurs after the body executes.

The update does not need to be an increment:

```javascript
for (let index = 10; index > 0; index--) {
    process(index);
}
```

Multiple update expressions can also be used:

```javascript
for (let left = 0, right = items.length - 1;
     left < right;
     left++, right--) {
    process(left, right);
}
```

The update section should clearly represent the state transition required by the loop.

## Execution Order

A `for` statement follows a well-defined execution sequence.

```javascript
for (let index = 0; index < 3; index++) {
    console.log(index);
}
```

The execution order is:

```text
let index = 0
    ↓
index < 3
    ↓
body
    ↓
index++
    ↓
index < 3
    ↓
body
    ↓
index++
    ↓
index < 3
    ↓
body
    ↓
index++
    ↓
index < 3 → false
    ↓
exit loop
```

The initialization executes exactly once.

The condition executes before every iteration.

The update executes after every completed iteration, unless control leaves the loop before reaching it.

## Block Scope

A `let` or `const` declaration in the initialization section is scoped to the `for` statement.

```javascript
for (let index = 0; index < 5; index++) {
    console.log(index);
}

console.log(index);
```

The final `console.log(index)` causes a `ReferenceError` because `index` does not exist outside the `for` statement's
scope.

This differs from using `var`:

```javascript
for (var index = 0; index < 5; index++) {
    console.log(index);
}

console.log(index);
```

Here `index` remains accessible after the loop because `var` is function-scoped rather than block-scoped.

`let` is generally preferred for loop variables because it limits the variable's lifetime to the loop.

## Per-Iteration Bindings

A `let` declaration in a `for` loop creates a distinct per-iteration binding when the loop body creates closures that
capture the loop variable.

```javascript
const callbacks = [];

for (let index = 0; index < 3; index++) {
    callbacks.push(() => index);
}

console.log(callbacks[0]());
console.log(callbacks[1]());
console.log(callbacks[2]());
```

The output is:

```text
0
1
2
```

Each iteration has its own `index` binding.

Using `var` produces different behavior:

```javascript
const callbacks = [];

for (var index = 0; index < 3; index++) {
    callbacks.push(() => index);
}

console.log(callbacks[0]());
console.log(callbacks[1]());
console.log(callbacks[2]());
```

The output is:

```text
3
3
3
```

All callbacks reference the same function-scoped `index` binding.

## Multiple Loop Variables

A `for` statement can maintain multiple pieces of loop state.

```javascript
for (let left = 0, right = items.length - 1;
     left < right;
     left++, right--) {
    process(items[left], items[right]);
}
```

The initialization creates both variables, while the update changes both after each iteration.

Multiple loop variables can be useful for algorithms that process a sequence from both ends or maintain multiple related
indexes.

The state should remain simple enough that the relationship between the variables and the termination condition is
obvious.

## Increment and Decrement

The update expression commonly increments or decrements a loop variable.

```javascript
for (let index = 0; index < 10; index++) {
    process(index);
}
```

A decrementing loop can iterate in reverse:

```javascript
for (let index = 9; index >= 0; index--) {
    process(index);
}
```

The increment does not have to be one:

```javascript
for (let index = 0; index < 100; index += 10) {
    process(index);
}
```

The update can also use multiplication or another state transition:

```javascript
for (let value = 1; value <= 100; value *= 2) {
    process(value);
}
```

The update should make the progression toward termination clear.

## Reverse Iteration

A `for` statement can iterate through a sequence in reverse.

```javascript
for (let index = items.length - 1; index >= 0; index--) {
    process(items[index]);
}
```

Reverse iteration is useful when removing elements from an array by index because removing an element does not
invalidate the indexes of elements that have already been processed at higher indexes.

```javascript
for (let index = items.length - 1; index >= 0; index--) {
    if (shouldRemove(items[index])) {
        items.splice(index, 1);
    }
}
```

When iteration does not require index-based control, `for...of` may provide clearer semantics.

## Empty for Statements

All three components of a `for` statement are optional.

```javascript
for (; ;) {
    process();
}
```

An omitted initialization, condition, and update creates an infinite loop.

Individual components can also be omitted:

```javascript
let index = 0;

for (; index < 10;) {
    process(index);
    index++;
}
```

This is valid but generally less readable than:

```javascript
for (let index = 0; index < 10; index++) {
    process(index);
}
```

The ability to omit components is useful when the loop's state management does not fit the conventional `for` structure,
but unnecessary omission should be avoided.

## break in for Loops

**`break` Statement:** A jump statement that immediately terminates the nearest enclosing loop.

```javascript
for (let index = 0; index < items.length; index++) {
    if (isMatch(items[index])) {
        break;
    }

    process(items[index]);
}
```

When `break` executes, the loop terminates immediately.

The update expression does not execute after the `break`.

```javascript
for (let index = 0; index < 10; index++) {
    if (index === 5) {
        break;
    }

    console.log(index);
}
```

The values `0` through `4` are printed. When `index` is `5`, the loop exits before executing `index++`.

## continue in for Loops

**`continue` Statement:** A jump statement that skips the remainder of the current iteration and proceeds to the loop's
update expression.

```javascript
for (let index = 0; index < 10; index++) {
    if (index % 2 === 0) {
        continue;
    }

    console.log(index);
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

Unlike `break`, `continue` does not terminate the loop.

For a `for` statement, `continue` transfers control to the update expression before the next condition evaluation.

```text
body
 ↓
continue
 ↓
update
 ↓
condition
```

This differs from a `while` loop, where `continue` proceeds directly to the condition.

## Nested for Loops

A `for` loop can contain another `for` loop.

```javascript
for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
        process(row, column);
    }
}
```

The inner loop executes completely for each iteration of the outer loop.

Two nested loops that each execute `n` iterations generally produce `O(n²)` iterations:

```javascript
for (let row = 0; row < n; row++) {
    for (let column = 0; column < n; column++) {
        process(row, column);
    }
}
```

The actual complexity depends on the relationship between the iteration counts.

## Nested break

A `break` statement terminates only the nearest enclosing loop.

```javascript
for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
        if (column === 1) {
            break;
        }

        process(row, column);
    }
}
```

The `break` terminates the inner loop but does not terminate the outer loop.

A labeled statement can be used when multiple nested levels must be terminated:

```javascript
outer:
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (shouldStop()) {
                break outer;
            }

            process(row, column);
        }
    }
```

Labeled control flow should be used deliberately because it creates a non-local transfer of control.

## for and Arrays

A traditional `for` loop can iterate through an array using indexes.

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

The array length is read during each condition evaluation.

When the array itself is not being structurally modified and index-based access is required, this is a straightforward
representation of the iteration.

A cached length can be used when appropriate:

```javascript
for (let index = 0, length = items.length;
     index < length;
     index++) {
    process(items[index]);
}
```

However, manually caching `.length` is usually unnecessary for ordinary arrays and should not be introduced solely based
on historical JavaScript performance assumptions.

If the purpose is simply to visit every element, `for...of` often expresses the intent more directly:

```javascript
for (const item of items) {
    process(item);
}
```

## for and Array Mutation

Mutating an array while iterating with an index requires careful handling because structural changes can shift indexes.

This can skip elements:

```javascript
for (let index = 0; index < items.length; index++) {
    if (shouldRemove(items[index])) {
        items.splice(index, 1);
    }
}
```

After removing an element, the next element shifts into the current index, but the update expression increments the
index, causing that shifted element to be skipped.

One solution is to decrement the index after removal:

```javascript
for (let index = 0; index < items.length; index++) {
    if (shouldRemove(items[index])) {
        items.splice(index, 1);
        index--;
    }
}
```

Reverse iteration can avoid this issue:

```javascript
for (let index = items.length - 1; index >= 0; index--) {
    if (shouldRemove(items[index])) {
        items.splice(index, 1);
    }
}
```

The appropriate approach depends on the required mutation semantics.

## for and Strings

A traditional `for` loop can access string characters by index.

```javascript
const value = "JavaScript";

for (let index = 0; index < value.length; index++) {
    console.log(value[index]);
}
```

When the requirement is simply to iterate over Unicode code points, `for...of` is generally more appropriate because
string indexing operates on UTF-16 code units.

```javascript
for (const character of value) {
    console.log(character);
}
```

A traditional index-based `for` loop remains appropriate when direct index access or UTF-16 code-unit semantics are
specifically required.

## for with Expressions

The initialization, condition, and update sections are expression contexts and can contain expressions appropriate to
their roles.

```javascript
for (
    initialize();
    shouldContinue();
    update()
) {
    process();
}
```

The condition is reevaluated on every iteration:

```javascript
for (
    let index = 0;
    getLimit() > index;
    index++
) {
    process(index);
}
```

Here `getLimit()` is called for every condition evaluation.

When the value does not change and repeated evaluation has no useful purpose, calculate it separately:

```javascript
const limit = getLimit();

for (let index = 0; index < limit; index++) {
    process(index);
}
```

This can also make the loop's termination rule easier to understand.

## for with Side Effects

Initialization, condition, and update expressions can all contain side effects.

```javascript
for (
    initializeResource();
    hasMoreWork();
    releaseOrAdvance()
) {
    process();
}
```

Although valid, complex side effects can make the execution order difficult to understand.

A conventional `for` loop should generally keep its three control expressions focused on loop state:

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

Substantial operations should normally occur in the loop body or in named functions rather than being hidden inside the
loop header.

## for with Multiple Conditions

A loop condition can combine multiple predicates.

```javascript
for (
    let index = 0;
    index < items.length && !shouldStop();
    index++
) {
    process(items[index]);
}
```

The loop continues only while both conditions remain satisfied.

Logical operators may short-circuit evaluation, so later conditions may not execute when an earlier condition already
determines the result.

```javascript
for (
    let index = 0;
    index < items.length && items[index] !== null;
    index++
) {
    process(items[index]);
}
```

Complex loop conditions should be extracted into named predicates when their meaning becomes difficult to understand.

## for with Multiple Statements

The body of a `for` loop can contain multiple statements.

```javascript
for (let index = 0; index < items.length; index++) {
    const item = items[index];

    validate(item);
    process(item);
    recordResult(item);
}
```

Braces should normally be used even when the body contains only one statement:

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

Braces make later modifications safer and make the scope of the loop body explicit.

## for with Function Calls

A loop condition or update expression can invoke functions.

```javascript
for (
    let item = getFirst();
    item !== null;
    item = getNext(item)
) {
    process(item);
}
```

This pattern is useful when traversal follows a dynamically determined sequence rather than numeric indexing.

The loop expresses a three-stage process:

```text
initial item
    ↓
process item
    ↓
get next item
    ↓
is item valid?
    ↓
repeat
```

This can be clearer than maintaining a separate `while` loop when the initialization, continuation condition, and
progression naturally form a single traversal structure.

## for and Return

A `return` statement can terminate the enclosing function from inside a `for` loop.

```javascript
function findItem(items, target) {
    for (let index = 0; index < items.length; index++) {
        if (items[index] === target) {
            return items[index];
        }
    }

    return null;
}
```

When `return` executes, the loop terminates immediately and the function returns.

The loop's update expression does not execute after the `return`.

Early returns are often useful for search operations where the desired result can terminate iteration immediately.

## for and throw

A `throw` statement can terminate execution from inside a `for` loop.

```javascript
for (let index = 0; index < items.length; index++) {
    if (!isValid(items[index])) {
        throw new Error("Invalid item");
    }

    process(items[index]);
}
```

When `throw` executes, the loop terminates and the exception propagates according to normal exception-handling rules.

The update expression does not execute after `throw`.

## for and Iterator Protocols

A traditional `for` loop can manually consume an iterator when direct iterator control is required.

```javascript
const iterator = collection[Symbol.iterator]();

for (
    let result = iterator.next();
    !result.done;
    result = iterator.next()
) {
    process(result.value);
}
```

This provides direct access to each iterator result.

When direct control over the iterator is unnecessary, `for...of` is generally clearer:

```javascript
for (const value of collection) {
    process(value);
}
```

The traditional `for` form is useful when iterator advancement must be coordinated with additional state or operations.

## for vs while

Both `for` and `while` are pre-test loops, but they communicate iteration state differently.

A `for` statement groups initialization, condition, and update in one construct:

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

A `while` statement separates those operations:

```javascript
let index = 0;

while (index < items.length) {
    process(items[index]);
    index++;
}
```

Use `for` when the initialization, continuation condition, and state update form a clear iteration structure.

Use `while` when the loop's state transitions are more naturally expressed within the body or when the iteration
mechanism does not fit the conventional three-part structure.

## for vs for...of

A traditional `for` loop provides explicit index control.

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

A `for...of` loop directly iterates over values:

```javascript
for (const item of items) {
    process(item);
}
```

Use a traditional `for` loop when the index is required, when iteration must proceed in a custom numeric pattern, or
when direct index manipulation is part of the algorithm.

Use `for...of` when the requirement is simply to process each iterable value.

## for vs for...in

A traditional `for` loop is generally used for controlled iteration over indexes or numeric ranges.

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

`for...in` is designed for enumerating property keys of an object.

```javascript
for (const key in object) {
    process(key, object[key]);
}
```

`for...in` should not normally be used to iterate array values because it enumerates property keys rather than array
elements and can include inherited enumerable properties.

For iterable values such as arrays, strings, maps, sets, and other iterable objects, `for...of` is generally the
appropriate iteration construct.

## Algorithmic Complexity

The complexity of a `for` loop depends on how the loop state progresses and how much work is performed during each
iteration.

A loop that visits `n` elements once is generally `O(n)`:

```javascript
for (let index = 0; index < n; index++) {
    process(index);
}
```

Two nested loops that independently iterate `n` times are generally `O(n²)`:

```javascript
for (let row = 0; row < n; row++) {
    for (let column = 0; column < n; column++) {
        process(row, column);
    }
}
```

A loop whose counter doubles on every iteration has logarithmic iteration count:

```javascript
for (let value = 1; value < n; value *= 2) {
    process(value);
}
```

This is generally `O(log n)` with respect to the number of iterations.

The cost of the loop body must also be considered when determining total complexity.

## Loop-Invariant Work

**Loop-Invariant Work:** Work whose result does not change between loop iterations.

Avoid repeatedly calculating values that are genuinely invariant when doing so obscures the loop or creates measurable
unnecessary work.

```javascript
const limit = calculateLimit();

for (let index = 0; index < limit; index++) {
    process(index);
}
```

Instead of:

```javascript
for (let index = 0; index < calculateLimit(); index++) {
    process(index);
}
```

However, extracting a function call is not merely an optimization if the function has side effects or can produce
different results. The two versions can have different semantics.

```javascript
for (
    let index = 0;
    index < getCurrentLimit();
    index++
) {
    process(index);
}
```

Here repeated evaluation may be intentional.

Manual loop-invariant optimization should therefore be based on actual invariance and, for performance-sensitive code,
profiling.

## Performance Considerations

The `for` statement itself does not guarantee better performance than other loop constructs.

Modern JavaScript engines optimize different loop forms based on runtime behavior, types, object shapes, and other
factors.

A conventional loop:

```javascript
for (let index = 0; index < items.length; index++) {
    process(items[index]);
}
```

should not be rewritten into a less readable form solely because of assumptions about historical engine optimizations.

For example, manually caching an array's length:

```javascript
for (let index = 0, length = items.length;
     index < length;
     index++) {
    process(items[index]);
}
```

may have been relevant to some historical JavaScript optimization patterns, but modern code should generally prioritize
clear semantics unless profiling demonstrates a meaningful benefit.

Performance-sensitive iteration should be measured using representative workloads.

## Best Practices

* **Use `for` when initialization, condition, and update form a natural iteration structure:** Counter-based iteration
  and explicit index traversal are particularly well suited to `for`.
* **Keep initialization, condition, and update focused on loop state:** Avoid hiding substantial business logic or
  unrelated side effects in the loop header.
* **Use `let` for loop variables by default:** Block scoping prevents the iteration variable from leaking outside the
  loop and provides per-iteration bindings for closures.
* **Avoid `var` for loop variables unless function-scoped behavior is explicitly required:** `var` remains accessible
  after the loop and does not provide the same per-iteration closure semantics as `let`.
* **Make the termination condition obvious:** The relationship between the loop state and its termination should be
  immediately understandable.
* **Ensure the update progresses toward termination:** A counter or other loop state should change appropriately when
  the loop is intended to terminate.
* **Use `break` for secondary termination conditions:** Keep the normal termination rule in the loop condition when
  possible.
* **Use `continue` deliberately:** Remember that `continue` in a `for` loop executes the update expression before
  evaluating the condition again.
* **Avoid accidental infinite loops:** An omitted condition creates an infinite loop and should only be used when
  explicit termination exists elsewhere.
* **Prefer reverse iteration when removing array elements by index:** Processing from the end prevents removal of an
  element from shifting unprocessed lower indexes.
* **Do not mutate arrays during forward index iteration without accounting for index shifts:** Structural changes can
  cause elements to be skipped or processed multiple times.
* **Use `for...of` when only values are required:** It communicates value-oriented iteration more directly than manual
  index management.
* **Use a traditional `for` loop when indexes matter:** Explicit indexes are appropriate for positional algorithms,
  custom step sizes, reverse traversal, and direct index manipulation.
* **Do not use `for...in` for normal array iteration:** `for...in` enumerates property keys and can include inherited
  enumerable properties.
* **Use `return` for immediate function-level termination:** Search and lookup operations can often terminate iteration
  as soon as the desired result is found.
* **Use `throw` when invalid state should terminate processing:** An exception immediately leaves the loop and transfers
  control according to normal exception propagation.
* **Be careful with closures over loop variables:** Prefer `let` when callbacks created during iteration need the value
  associated with each individual iteration.
* **Avoid unnecessary multiple loop variables:** Multiple state variables are appropriate when they represent a clear
  algorithmic relationship; otherwise they increase cognitive complexity.
* **Avoid unnecessary work in the loop condition:** Conditions execute before every iteration, so repeated expensive
  calculations should be avoided when the value is genuinely invariant.
* **Do not manually cache array length solely for historical performance reasons:** Modern engines optimize common
  iteration patterns; prioritize readability unless profiling demonstrates a benefit.
* **Do not assume `for` is inherently faster than `while`, `for...of`, or other iteration constructs:** Choose the
  construct that accurately represents the required iteration semantics.
* **Analyze nested loops for algorithmic complexity:** Two independent `n`-sized loops generally produce `O(n²)` work,
  while additional nesting can increase complexity further.
* **Keep the loop body focused:** Extract substantial processing logic into named functions when the body becomes
  difficult to understand.
* **Use explicit state transitions for non-standard iteration:** If the update logic is complex enough that its position
  in the loop header obscures the algorithm, a `while` loop may communicate the process more clearly.
* **Use infinite `for (;;)` loops only intentionally:** They are appropriate for processes whose termination is
  controlled by `break`, `return`, `throw`, or another explicit mechanism.
* **Measure before optimizing iteration:** Performance changes should be based on representative profiling rather than
  assumptions about JavaScript engine internals.

# switch Statement

## switch Statement

**`switch` Statement:** A control flow statement that selects one execution path from multiple possible paths by
comparing a single expression against a sequence of `case` clauses. The `switch` expression is evaluated once, then its
resulting value is compared against each `case` value in source order until a matching case is found.

```javascript
switch (expression) {
    case value1:
        statementA;
        break;

    case value2:
        statementB;
        break;

    default:
        statementC;
}
```

A `switch` statement can be understood as a multi-way branch where the selection is based on the value of one
expression.

```javascript
const status = "active";

switch (status) {
    case "pending":
        handlePending();
        break;

    case "active":
        handleActive();
        break;

    case "disabled":
        handleDisabled();
        break;

    default:
        handleUnknown();
}
```

The `switch` expression is evaluated once. The resulting value is then compared against the case expressions in source
order.

## case Clauses

**`case` Clause:** A labeled branch within a `switch` statement that provides a value against which the `switch`
expression is compared.

```javascript
switch (value) {
    case 1:
        handleOne();
        break;

    case 2:
        handleTwo();
        break;
}
```

Each `case` expression is evaluated when the `switch` statement reaches that comparison. The first matching `case`
determines where execution begins.

```javascript
const command = "save";

switch (command) {
    case "open":
        openFile();
        break;

    case "save":
        saveFile();
        break;

    case "close":
        closeFile();
        break;
}
```

If `command` is `"save"`, execution begins at the `"save"` case.

The case expressions are not required to be literals:

```javascript
switch (value) {
    case getExpectedValue():
        handleMatch();
        break;
}
```

Case expressions are evaluated as part of the `switch` matching process, so expressions with side effects should be
avoided unless their evaluation is intentional.

## Case Matching

`switch` case matching uses strict equality comparison semantics. No implicit type coercion is performed between the
`switch` expression and a case value.

```javascript
const value = 1;

switch (value) {
    case 1:
        console.log("number");
        break;

    case "1":
        console.log("string");
        break;
}
```

The `"number"` branch executes because `1` matches `1`, while `"1"` is a different value and type.

This makes the following cases distinct:

```javascript
switch (value) {
    case 0:
        // number
        break;

    case "0":
        // string
        break;

    case false:
        // boolean
        break;
}
```

The distinction between types is important when using `switch` with values originating from external input, APIs, form
fields, or other dynamically typed sources.

## Multiple case Clauses

Multiple `case` clauses can be associated with the same execution block when several values should produce identical
behavior.

```javascript
switch (status) {
    case "pending":
    case "processing":
        showProgress();
        break;

    case "completed":
        showResult();
        break;

    case "failed":
        showError();
        break;
}
```

When `status` is either `"pending"` or `"processing"`, execution enters the shared block containing `showProgress()`.

This is commonly used when several discrete values represent the same logical category.

```javascript
switch (day) {
    case "Saturday":
    case "Sunday":
        type = "weekend";
        break;

    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
        type = "weekday";
        break;
}
```

Multiple case labels should be used when the relationship between the values is intentional and clear.

## default Clause

**`default` Clause:** The fallback branch of a `switch` statement that executes when no `case` matches the `switch`
expression.

```javascript
switch (status) {
    case "active":
        activate();
        break;

    case "disabled":
        disable();
        break;

    default:
        handleUnknownStatus();
}
```

The `default` clause is optional.

```javascript
switch (status) {
    case "active":
        activate();
        break;

    case "disabled":
        disable();
        break;
}
```

When no case matches and no `default` clause exists, execution continues after the entire `switch` statement.

The `default` clause can appear anywhere within the `switch` statement, although placing it last is normally clearer:

```javascript
switch (value) {
    case 1:
        handleOne();
        break;

    default:
        handleOther();
        break;

    case 2:
        handleTwo();
        break;
}
```

Although valid, this ordering makes the control flow less obvious and should generally be avoided.

## Fall-Through Behavior

**Fall-Through:** The behavior where execution continues from one `case` block into the next case block without
automatically stopping at the end of the current case.

```javascript
switch (value) {
    case 1:
        console.log("one");

    case 2:
        console.log("two");
}
```

If `value` is `1`, both messages are printed because execution begins at `case 1` and continues into `case 2`.

A `switch` statement does not automatically terminate execution at the end of a matching case.

The `break` statement is commonly used to terminate the `switch` after the selected branch:

```javascript
switch (value) {
    case 1:
        console.log("one");
        break;

    case 2:
        console.log("two");
        break;
}
```

Fall-through can be intentional when several cases should share behavior, but accidental fall-through is a common source
of bugs.

## Intentional Fall-Through

Fall-through can intentionally combine cases that should execute the same statements.

```javascript
switch (role) {
    case "admin":
    case "moderator":
        accessManagementPanel();
        break;

    case "user":
        accessUserPanel();
        break;

    default:
        denyAccess();
}
```

Here, `"admin"` and `"moderator"` intentionally fall through to the same execution block.

Fall-through can also be used when one case must perform additional work before continuing into another case:

```javascript
switch (level) {
    case 3:
        enableAdvancedFeatures();

    case 2:
        enableStandardFeatures();

    case 1:
        enableBasicFeatures();
        break;
}
```

If `level` is `3`, all three operations execute.

This form should only be used when the cumulative behavior is intentional and obvious. Otherwise, explicit function
calls or separate conditions usually communicate the intent more clearly.

## break Statement

**`break` Statement:** A jump statement that terminates the nearest enclosing `switch` or loop and transfers control to
the statement following it.

```javascript
switch (command) {
    case "start":
        start();
        break;

    case "stop":
        stop();
        break;
}
```

Without `break`, execution continues into subsequent cases.

```javascript
switch (command) {
    case "start":
        start();

    case "stop":
        stop();
}
```

If `command` is `"start"`, both `start()` and `stop()` execute.

The `break` statement belongs to jump control flow, but its use is fundamental to the standard non-fall-through form of
`switch`.

## switch and Block Scope

A `switch` statement uses a single lexical block for its clauses. Declaring lexical bindings directly in multiple cases
can therefore cause duplicate declaration errors.

This can cause problems:

```javascript
switch (value) {
    case 1:
        const result = processOne();
        break;

    case 2:
        const result = processTwo();
        break;
}
```

Both declarations belong to the same `switch` block and therefore conflict.

Each case can instead introduce its own block:

```javascript
switch (value) {
    case 1: {
        const result = processOne();
        use(result);
        break;
    }

    case 2: {
        const result = processTwo();
        use(result);
        break;
    }
}
```

Block-scoping each case is useful when cases contain local `let`, `const`, or `class` declarations.

## switch with Expressions

The `switch` expression can be any expression that produces a value.

```javascript
switch (getStatus()) {
    case "active":
        activate();
        break;

    case "disabled":
        disable();
        break;

    default:
        handleUnknown();
}
```

The expression can also be computed:

```javascript
switch (user.role.toLowerCase()) {
    case "admin":
        showAdminPanel();
        break;

    case "user":
        showUserPanel();
        break;
}
```

The expression is evaluated once when execution enters the `switch`.

Avoid unnecessarily complex expressions in the `switch` expression. If determining the value itself requires substantial
logic, calculate it separately:

```javascript
const category = determineCategory(value);

switch (category) {
    case "valid":
        handleValid();
        break;

    case "invalid":
        handleInvalid();
        break;

    default:
        handleUnknown();
}
```

This separates classification from branch execution.

## switch (true)

A `switch` statement can technically use `true` as its controlling expression to emulate condition-based branching:

```javascript
switch (true) {
    case score >= 90:
        grade = "A";
        break;

    case score >= 80:
        grade = "B";
        break;

    case score >= 70:
        grade = "C";
        break;

    default:
        grade = "F";
}
```

Each case expression produces a Boolean value, which is then compared against `true`.

Although valid, `switch (true)` generally obscures the fact that the code is performing ordered conditional evaluation.
An `if...else if` chain is normally clearer:

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

`switch` is best suited to discrete value-based selection rather than arbitrary Boolean conditions.

## switch and Range Conditions

A `switch` statement does not directly provide range matching.

For example, this is not valid syntax:

```javascript
switch (score) {
    case score >= 90:
        grade = "A";
        break;
}
```

The `case` expression evaluates to a Boolean value, while the `switch` expression is the numeric `score`. The values do
not match.

For range-based decisions, an `if...else if` chain is generally more appropriate:

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

A `switch (true)` structure can technically express the same logic, but it is usually less direct.

## switch and Object Values

When the `switch` expression produces an object, case matching compares object references rather than object contents.

```javascript
const value = {status: "active"};

switch (value) {
    case {status: "active"}:
        console.log("active");
        break;
}
```

The case does not match because the two object literals create different object references.

```javascript
const active = {status: "active"};
const value = active;

switch (value) {
    case active:
        console.log("active");
        break;
}
```

Here the case matches because both variables reference the same object.

When branching based on object properties, extract the relevant value:

```javascript
switch (value.status) {
    case "active":
        activate();
        break;

    case "disabled":
        disable();
        break;
}
```

## switch and Return

A `return` statement can terminate the enclosing function from inside a `switch` case.

```javascript
function getLabel(status) {
    switch (status) {
        case "active":
            return "Active";

        case "disabled":
            return "Disabled";

        default:
            return "Unknown";
    }
}
```

When every case returns, `break` is unnecessary because execution cannot continue into subsequent cases after the
function has returned.

```javascript
function getLabel(status) {
    switch (status) {
        case "active":
            return "Active";

        case "disabled":
            return "Disabled";

        default:
            return "Unknown";
    }
}
```

This pattern can be appropriate when the purpose of the `switch` is directly to select a return value.

## switch and throw

A case can throw an exception instead of continuing execution.

```javascript
switch (status) {
    case "active":
        return processActive();

    case "disabled":
        return processDisabled();

    default:
        throw new Error("Unsupported status");
}
```

Because `throw` transfers control out of the current execution path, no `break` is required after it.

This is useful when an unexpected case represents a programming error or invalid state rather than a normal fallback.

## switch for State Dispatch

`switch` is particularly useful when a variable represents a finite set of discrete states.

```javascript
switch (state) {
    case "idle":
        handleIdle();
        break;

    case "loading":
        handleLoading();
        break;

    case "success":
        handleSuccess();
        break;

    case "error":
        handleError();
        break;

    default:
        handleUnknownState();
}
```

This makes the set of supported states visible in one location.

For more complex state transitions, however, a dedicated state machine or transition structure may provide a better
representation than an increasingly large `switch`.

## switch vs if...else

Both `switch` and `if...else` can represent multiple execution paths, but they communicate different decision
structures.

Use `switch` when several discrete values of the same expression determine the selected branch:

```javascript
switch (command) {
    case "create":
        create();
        break;

    case "update":
        update();
        break;

    case "delete":
        remove();
        break;
}
```

Use `if...else` when conditions involve ranges, compound expressions, unrelated predicates, or ordered Boolean
decisions:

```javascript
if (user.isActive && user.hasPermission) {
    access();
} else if (user.isSuspended) {
    deny();
} else {
    authenticate();
}
```

The choice should primarily be based on the semantic structure of the decision rather than a presumed performance
difference.

## switch vs Lookup Dispatch

When each discrete value simply maps to one operation, a lookup structure can be clearer than a large `switch`.

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

A `switch` is generally preferable when individual cases contain substantial control flow, local logic, multiple
operations, or different handling requirements.

```javascript
switch (action) {
    case "create":
        validateInput();
        createRecord();
        logCreation();
        break;

    case "delete":
        confirmDeletion();
        deleteRecord();
        logDeletion();
        break;
}
```

Lookup dispatch is primarily a data-to-behavior mapping, while `switch` is a control-flow construct.

## Exhaustive Case Handling

When a `switch` represents a finite set of valid states, handling every known state can make omissions easier to detect.

```javascript
switch (state) {
    case "idle":
        handleIdle();
        break;

    case "loading":
        handleLoading();
        break;

    case "success":
        handleSuccess();
        break;

    case "error":
        handleError();
        break;

    default:
        throw new Error(`Unknown state: ${state}`);
}
```

Using `default` to reject unknown states can be preferable to silently doing nothing when encountering an invalid state.

Whether unknown values should throw, log, return a fallback, or be ignored depends on the application's requirements.

## Best Practices

* **Use `switch` for discrete value matching:** `switch` is most appropriate when one expression is compared against
  several known values.
* **Use `if...else` for complex conditions:** Ranges, compound predicates, unrelated conditions, and ordered Boolean
  decisions are generally clearer with `if...else`.
* **Include a `default` clause when unexpected values require explicit handling:** This prevents unsupported values from
  silently producing no behavior.
* **Terminate normal cases explicitly with `break`:** Prevent accidental fall-through when each case represents an
  independent execution path.
* **Use intentional fall-through only when the shared behavior is obvious:** Consecutive cases without `break` should
  represent a deliberate relationship between the values.
* **Group equivalent cases together:** Multiple case labels can share one execution block when several values require
  identical behavior.
* **Keep `default` last:** Although JavaScript permits `default` anywhere in the case list, placing it last makes the
  control flow easier to read and maintain.
* **Do not use `switch (true)` for ordinary condition chains:** Use `if...else if` when the decision is based on Boolean
  predicates rather than discrete values.
* **Do not use `switch` for range matching:** Conditions such as `score >= 90` and `score < 50` are naturally expressed
  with `if...else`.
* **Remember that case matching does not perform type coercion:** Numeric, string, Boolean, and other values remain
  distinct according to strict equality comparison semantics.
* **Extract object properties before switching:** When the decision depends on object data, switch on the relevant
  property rather than attempting to match object contents.
* **Use blocks for cases with lexical declarations:** Wrap individual cases in `{}` when they contain `let`, `const`, or
  `class` declarations that would otherwise share the `switch` block's lexical scope.
* **Keep case logic focused:** When a case contains substantial unrelated logic, extract that behavior into named
  functions rather than creating a large monolithic `switch`.
* **Use `return` directly when a case determines a function's result:** A `break` is unnecessary when execution leaves
  the function through `return`.
* **Use `throw` directly for invalid states when appropriate:** A throwing case also does not require `break` because
  control leaves the current execution path.
* **Prefer lookup dispatch for simple value-to-function mappings:** Objects or `Map` can make straightforward dispatch
  tables easier to extend and maintain.
* **Prefer `switch` when cases contain different control-flow behavior:** Validation, multiple operations, early
  returns, exceptions, and other case-specific logic can be more naturally represented by `switch`.
* **Do not choose `switch` based on assumed performance advantages:** Choose the construct that most accurately
  represents the decision structure; optimize only when profiling identifies a genuine performance problem.
* **Make fall-through intentional and visible:** Comment non-obvious fall-through when the relationship between cases is
  not immediately apparent from the code.
* **Handle unsupported states explicitly:** When a `switch` represents a finite state set, consider making unexpected
  states fail loudly instead of silently continuing.

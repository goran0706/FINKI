# Conditional Operator

## Conditional Operator

The conditional operator, commonly called the **ternary operator**, is a JavaScript expression that selects one of two
expressions based on the result of a condition.

It is the only JavaScript operator that takes three operands.

```javascript
const result = condition ? consequent : alternate;
```

The three operands are:

| Operand      | Description                                                 |
|:-------------|:------------------------------------------------------------|
| `condition`  | Expression whose result determines which branch is selected |
| `consequent` | Expression evaluated when `condition` is truthy             |
| `alternate`  | Expression evaluated when `condition` is falsy              |

The conditional operator evaluates the condition first. If the condition is truthy, the consequent expression is
evaluated and its value becomes the result of the entire conditional expression. Otherwise, the alternate expression is
evaluated and its value becomes the result.

```javascript
const age = 20;

const status = age >= 18 ? "adult" : "minor";
```

The conditional operator does not execute both branches.

```javascript
const value = condition
    ? firstExpression()
    : secondExpression();
```

Only `firstExpression()` or `secondExpression()` is evaluated.

## Basic Syntax

The general syntax is:

```javascript
condition ? consequent : alternate
```

Example:

```javascript
const age = 25;

const message = age >= 18 ? "Allowed" : "Denied";
```

The condition is evaluated first:

```javascript
age >= 18
```

If it produces a truthy value, the expression:

```javascript
"Allowed"
```

is selected.

Otherwise:

```javascript
"Denied"
```

is selected.

The selected expression produces the value of the entire conditional expression.

```javascript
const result = true ? "yes" : "no";

console.log(result); // "yes"
```

## Conditional Operator as an Expression

The conditional operator is an **expression**, not a statement.

It produces a value and can therefore appear wherever an expression is allowed.

```javascript
const value = condition ? a : b;
```

It can be used as:

```javascript
const result = condition ? a : b;
```

```javascript
return condition ? a : b;
```

```javascript
console.log(condition ? a : b);
```

```javascript
someFunction(condition ? a : b);
```

```javascript
const array = [condition ? a : b];
```

```javascript
const object = {
    value: condition ? a : b
};
```

This expression-oriented nature is the primary distinction between the conditional operator and `if...else`.

## Condition Evaluation

The condition is evaluated before either branch.

```javascript
const result = getCondition() ? first() : second();
```

Evaluation proceeds conceptually as:

```text
evaluate getCondition()
        |
        +-- truthy --> evaluate first()
        |
        +-- falsy  --> evaluate second()
```

The condition is evaluated exactly once as part of the conditional expression.

```javascript
let count = 0;

const result = (++count > 0) ? "yes" : "no";

console.log(result); // "yes"
console.log(count);  // 1
```

The condition can be any expression.

```javascript
const result = value > 10 ? "large" : "small";
```

```javascript
const result = user ? user.name : "Guest";
```

```javascript
const result = isEnabled() ? start() : stop();
```

```javascript
const result = items.length ? items[0] : null;
```

The condition is interpreted according to JavaScript's normal truthiness rules.

## Consequent Expression

The expression between `?` and `:` is the **consequent**.

```javascript
condition ? consequent : alternate
```

It is evaluated only when the condition is truthy.

```javascript
const result = true
    ? calculateValue()
    : calculateFallback();
```

Here:

```javascript
calculateValue()
```

is evaluated, while:

```javascript
calculateFallback()
```

is not.

The consequent can be any valid expression.

```javascript
const result = condition
    ? 42
    : 0;
```

```javascript
const result = condition
    ? getValue()
    : getDefaultValue();
```

```javascript
const result = condition
    ? {enabled: true}
    : {enabled: false};
```

## Alternate Expression

The expression after `:` is the **alternate**.

```javascript
condition ? consequent : alternate
```

It is evaluated only when the condition is falsy.

```javascript
const result = false
    ? first()
    : second();
```

Only:

```javascript
second()
```

is evaluated.

The alternate can also be any valid expression.

```javascript
const result = condition
    ? value
    : defaultValue;
```

```javascript
const result = condition
    ? createPrimary()
    : createFallback();
```

## Branch Evaluation

The conditional operator evaluates exactly one of its two branch expressions.

```javascript
const result = condition
    ? expressionA()
    : expressionB();
```

If `condition` is truthy:

```javascript
expressionA();
```

is evaluated and `expressionB()` is skipped.

If `condition` is falsy:

```javascript
expressionB();
```

is evaluated and `expressionA()` is skipped.

This makes the conditional operator suitable for selecting between expressions that may have side effects.

```javascript
const result = shouldSave
    ? save()
    : discard();
```

Only one operation occurs.

## Skipped Branches

An unselected branch is not evaluated.

```javascript
const result = true
    ? "selected"
    : unknownFunction();
```

This does not throw an error because `unknownFunction()` is never evaluated.

Similarly:

```javascript
const result = false
    ? unknownFunction()
    : "selected";
```

is valid because the nonexistent function is in the branch that is not evaluated.

This behavior is an important semantic property of the conditional operator.

## Result Value

The conditional operator evaluates to the value produced by the selected branch.

```javascript
const result = true ? 10 : 20;

console.log(result); // 10
```

```javascript
const result = false ? 10 : 20;

console.log(result); // 20
```

The branches do not need to produce the same type.

```javascript
const result = condition
    ? "enabled"
    : null;
```

The resulting value depends entirely on the selected expression.

```javascript
const result = condition
    ? calculateNumber()
    : createObject();
```

The conditional expression itself has the value produced by whichever branch executes.

## Assignment

The conditional operator can directly select a value for assignment.

```javascript
const message = isValid
    ? "Valid"
    : "Invalid";
```

It can also be used with mutable variables:

```javascript
let value;

value = condition
    ? firstValue
    : secondValue;
```

Multiple expressions can be used as the source of an assignment.

```javascript
const timeout = isProduction
    ? 5000
    : 100;
```

The operator is particularly useful when the assignment is the primary purpose of the selection.

## Return

The conditional operator is commonly used when a function returns one of two values.

```javascript
function getStatus(isActive) {
    return isActive ? "active" : "inactive";
}
```

The same pattern can be used with computed values:

```javascript
function getPrice(isMember) {
    return isMember ? memberPrice : regularPrice;
}
```

It can also select between function calls:

```javascript
function execute(isPrimary) {
    return isPrimary
        ? primaryOperation()
        : fallbackOperation();
}
```

This keeps simple two-way value selection within the expression returned by the function.

## Function Arguments

The conditional operator can select an argument before a function call.

```javascript
sendMessage(isError ? errorMessage : successMessage);
```

It can also select configuration values:

```javascript
createUser({
    role: isAdmin ? "admin" : "user"
});
```

The selected expression is evaluated before the function is called.

## Function Calls

Either branch can contain a function call.

```javascript
const result = condition
    ? calculatePrimary()
    : calculateSecondary();
```

Only the selected function is called.

This can be useful when both branches represent alternative computations.

```javascript
const value = useCache
    ? readFromCache()
    : readFromDatabase();
```

It should not be used to hide large amounts of procedural logic inside an expression.

## Object Literals

Object literals can be used as either branch.

```javascript
const options = isProduction
    ? {debug: false}
    : {debug: true};
```

Multiple properties are allowed:

```javascript
const config = isAdmin
    ? {
        role: "admin",
        access: "full"
    }
    : {
        role: "user",
        access: "limited"
    };
```

The selected object is the result of the conditional expression.

## Array Literals

Arrays can also be selected.

```javascript
const values = condition
    ? [1, 2, 3]
    : [4, 5, 6];
```

The conditional operator can also be used inside an array literal:

```javascript
const values = [
    firstValue,
    condition ? selectedValue : fallbackValue
];
```

The latter form makes the conditional expression one element of the array.

## Nested Conditional Operators

A conditional expression can contain another conditional expression.

```javascript
const result = condition1
    ? value1
    : condition2
        ? value2
        : value3;
```

This represents:

```text
condition1
├── truthy → value1
└── falsy
    ├── condition2 → value2
    └── otherwise → value3
```

Nested conditionals can express more than two alternatives.

```javascript
const grade =
    score >= 90 ? "A" :
        score >= 80 ? "B" :
            score >= 70 ? "C" :
                score >= 60 ? "D" :
                    "F";
```

Although valid, deeply nested conditional operators can become difficult to read.

## Associativity

The conditional operator is **right-associative**.

An expression such as:

```javascript
a ? b : c ? d : e
```

is interpreted as:

```javascript
a ? b : (c ? d : e)
```

not:

```javascript
(a ? b : c) ? d : e
```

This allows chained conditional expressions to naturally represent a sequence of fallback decisions.

```javascript
const result =
    conditionA ? valueA :
        conditionB ? valueB :
            valueC;
```

Equivalent explicit grouping:

```javascript
const result =
    conditionA
        ? valueA
        : (conditionB
            ? valueB
            : valueC);
```

Parentheses should be used when the intended grouping is not immediately obvious.

## Parentheses

Parentheses can make complex conditional expressions easier to understand.

```javascript
const result = condition
    ? (firstCondition ? a : b)
    : c;
```

They are especially useful when conditional expressions are nested inside other expressions.

```javascript
const value = condition
    ? (a + b)
    : (c + d);
```

They can also clarify the result of a nested conditional:

```javascript
const result = conditionA
    ? valueA
    : (conditionB ? valueB : valueC);
```

Parentheses should clarify grouping rather than be added indiscriminately.

## Operator Precedence

The conditional operator has lower precedence than logical operators such as `&&` and `||`, and higher precedence than
assignment operators.

Therefore:

```javascript
const result = a || b ? c : d;
```

is interpreted as:

```javascript
const result = (a || b) ? c : d;
```

Similarly:

```javascript
const result = a && b ? c : d;
```

is interpreted as:

```javascript
const result = (a && b) ? c : d;
```

The conditional operator binds more tightly than assignment:

```javascript
result = condition ? a : b;
```

is interpreted as:

```javascript
result = (condition ? a : b);
```

When precedence is not immediately clear, explicit parentheses should be preferred.

## Conditional Operator and Logical Operators

Logical operators can form the condition of a conditional expression.

```javascript
const result = isEnabled && isValid
    ? "allowed"
    : "denied";
```

They can also appear inside either branch:

```javascript
const result = condition
    ? value || fallback
    : defaultValue;
```

The logical expression and conditional expression have different semantics.

The conditional operator explicitly selects between two expressions:

```javascript
condition ? a : b
```

Logical operators select operands according to their own logical evaluation rules:

```javascript
a && b
```

```javascript
a || b
```

```javascript
a ?? b
```

These mechanisms should not be treated as interchangeable merely because they can sometimes produce similar results.

## Conditional Operator and Nullish Coalescing

The conditional operator can explicitly distinguish between conditions and fallback values.

```javascript
const result = value !== null
    ? value
    : fallback;
```

Nullish coalescing expresses a different operation:

```javascript
const result = value ?? fallback;
```

The conditional operator evaluates an explicit condition and chooses between two expressions.

Nullish coalescing selects the left operand unless it is `null` or `undefined`.

Use the operator that expresses the actual decision being made.

## Conditional Expressions in Template Literals

A conditional expression can be embedded directly in a template literal.

```javascript
const message = `Status: ${isActive ? "active" : "inactive"}`;
```

The conditional operator produces the value that is interpolated.

More complex expressions can be written over multiple lines:

```javascript
const message = `
  User: ${name}
  Status: ${isActive ? "active" : "inactive"}
`;
```

## Conditional Operator in Destructuring Defaults

The conditional operator can be used as an expression within destructuring-related assignments and initializers.

```javascript
const source = condition
    ? primaryObject
    : fallbackObject;

const {value} = source;
```

It can also be used when constructing the value to destructure:

```javascript
const {value} = condition
    ? primaryObject
    : fallbackObject;
```

The selected object becomes the source of the destructuring operation.

## Conditional Variable Initialization

The conditional operator is useful when a variable has one of two initial values.

```javascript
const timeout = isProduction
    ? 5000
    : 1000;
```

```javascript
const logger = isDebug
    ? debugLogger
    : productionLogger;
```

This is often preferable to declaring a mutable variable and assigning it through an `if` statement when the variable is
conceptually initialized from a single decision.

## Conditional Object Properties

A conditional operator can determine an individual property value.

```javascript
const user = {
    name,
    access: isAdmin ? "full" : "limited"
};
```

This keeps the conditional value selection local to the property that depends on it.

It can also select an entire property structure:

```javascript
const options = isAdvanced
    ? {
        mode: "advanced",
        cache: true
    }
    : {
        mode: "basic",
        cache: false
    };
```

## Conditional Array Elements

The conditional operator can select individual array elements.

```javascript
const values = [
    condition ? primaryValue : fallbackValue
];
```

It can also be combined with spread expressions:

```javascript
const values = [
    ...baseValues,
    ...(condition ? extraValues : [])
];
```

Here the conditional operator determines which iterable is spread into the resulting array.

## Conditional Property Access

The conditional operator can select between objects before accessing a property.

```javascript
const name = isPrimary
    ? primaryUser.name
    : secondaryUser.name;
```

It can also select the object itself:

```javascript
const user = isPrimary
    ? primaryUser
    : secondaryUser;

const name = user.name;
```

The second form can be preferable when the selected object is used more than once.

## Side Effects in Branches

Either branch can contain side effects.

```javascript
const result = condition
    ? incrementCounter()
    : decrementCounter();
```

Only one side effect occurs because only one branch is evaluated.

However, side-effect-heavy conditional expressions can reduce readability.

For example:

```javascript
condition
    ? updateState()
    : writeToDatabase();
```

may be technically valid but can obscure control flow when the operations become substantial.

In such cases, `if...else` is usually clearer.

## Conditional Operator and `if...else`

The conditional operator and `if...else` can express similar decisions, but they serve different syntactic purposes.

Conditional operator:

```javascript
const result = condition
    ? valueA
    : valueB;
```

`if...else`:

```javascript
let result;

if (condition) {
    result = valueA;
} else {
    result = valueB;
}
```

The conditional operator is an expression and directly produces a value.

`if...else` is a statement and controls which statement block executes.

The conditional operator is generally appropriate when the decision selects a value.

```javascript
const status = isActive ? "active" : "inactive";
```

`if...else` is generally more appropriate when the branches perform multiple operations.

```javascript
if (isActive) {
    startService();
    logStart();
    updateStatus();
} else {
    stopService();
    logStop();
    updateStatus();
}
```

The distinction is not simply about line count. It is primarily about whether the decision is naturally an
expression-level value selection or statement-level control flow.

## Expression vs Statement

The conditional operator can be nested inside larger expressions because it produces a value.

```javascript
const result = condition
    ? a + b
    : c + d;
```

An `if` statement cannot be used in this position:

```javascript
// Invalid
const result =
if (condition) {
    a;
} else {
    b;
}
;
```

This difference is fundamental.

The conditional operator answers:

```text
Which value should this expression produce?
```

`if...else` answers:

```text
Which statements should execute?
```

## Conditional Return

A conditional operator can make a simple conditional return concise.

```javascript
function getLabel(value) {
    return value > 0 ? "positive" : "non-positive";
}
```

For multiple conditions, a chained conditional can be used:

```javascript
function classify(value) {
    return value > 0
        ? "positive"
        : value < 0
            ? "negative"
            : "zero";
}
```

If the decision becomes difficult to read, an `if...else if...else` chain is preferable.

## Conditional Assignment vs Conditional Mutation

When selecting an initial value, a conditional expression works naturally:

```javascript
const mode = isProduction
    ? "production"
    : "development";
```

For multiple state mutations, `if...else` is clearer:

```javascript
if (isProduction) {
    config.mode = "production";
    config.debug = false;
    config.timeout = 5000;
} else {
    config.mode = "development";
    config.debug = true;
    config.timeout = 1000;
}
```

The conditional operator should not be forced into a role better served by statement-level branching.

## Using Ternary for Side Effects

A conditional operator can technically be used as a standalone expression:

```javascript
condition ? doSomething() : doSomethingElse();
```

This is valid JavaScript, but it is generally poor style.

The result of the conditional expression is being discarded, while the branches are being used primarily for their side
effects.

An `if...else` statement communicates the intent more directly:

```javascript
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}
```

The conditional operator is strongest when its resulting value is actually used.

## Multiple Statements in Branches

The operands of the conditional operator are expressions, not statement blocks.

A branch cannot directly contain an arbitrary sequence of statements:

```javascript
// Not valid as a normal conditional-expression branch
condition ? {
    statementA();
    statementB();
} : value;
```

An object literal is an expression, but its contents are object properties rather than a statement block.

When multiple statements are required in a branch, use `if...else` or extract the operations into a function.

```javascript
if (condition) {
    statementA();
    statementB();
} else {
    statementC();
}
```

Alternatively:

```javascript
const result = condition
    ? performPrimaryOperation()
    : performSecondaryOperation();
```

when the operations are appropriately encapsulated by functions.

## Conditional Operator with Function Expressions

Functions themselves are expressions and can therefore be selected conditionally.

```javascript
const handler = condition
    ? primaryHandler
    : fallbackHandler;
```

The selected function can then be invoked:

```javascript
handler();
```

The conditional operator can therefore be useful for selecting behavior rather than only primitive values.

## Conditional Operator with Arrow Functions

Arrow functions can be selected conditionally.

```javascript
const transform = isAdvanced
    ? value => value * 2
    : value => value + 1;
```

The selected function can then be used:

```javascript
const result = transform(10);
```

Parentheses and formatting should be used when the syntax becomes difficult to distinguish.

## Conditional Operator and Assignment Expressions

Assignment expressions can occur inside either branch.

```javascript
const result = condition
    ? (value = primaryValue)
    : (value = fallbackValue);
```

This is valid but usually less clear than assigning the selected value directly:

```javascript
value = condition
    ? primaryValue
    : fallbackValue;
```

The latter expresses the actual operation more directly.

## Conditional Operator and Comma Expressions

A comma expression can be used inside a conditional branch.

```javascript
const result = condition
    ? (firstOperation(), secondValue)
    : fallbackValue;
```

The comma expression evaluates its operands from left to right and produces the value of the final operand.

Although valid, this construction can obscure control flow and should generally be avoided when ordinary statements
would be clearer.

## Conditional Operator and `await`

The conditional operator can select between asynchronous expressions.

```javascript
const result = condition
    ? await primaryOperation()
    : await fallbackOperation();
```

Only the selected branch is awaited and evaluated.

It can also select between promises:

```javascript
const promise = condition
    ? primaryOperation()
    : fallbackOperation();
```

The distinction is whether the function needs the resulting value immediately or wants to return/compose the selected
promise.

## Conditional Operator and `yield`

Within a generator, the conditional operator can select an expression involving `yield`.

```javascript
const result = condition
    ? yield primaryValue
    : fallbackValue;
```

The grammar and precedence of `yield` can make such expressions difficult to read. Parentheses and explicit control flow
should be preferred when the interaction becomes complex.

## Conditional Operator and Exceptions

A selected branch can throw an exception.

```javascript
const result = condition
    ? getValue()
    : throwError();
```

If the throwing branch is selected, execution does not produce a normal conditional-expression value because the
exception interrupts evaluation.

An unselected throwing branch is not evaluated:

```javascript
const result = true
    ? "success"
    : throwError();
```

No exception is thrown by the unselected branch.

## Conditional Operator and Evaluation Order

The condition is evaluated first.

Afterward, exactly one branch is evaluated.

```javascript
const result =
    checkCondition()
        ? firstOperation()
        : secondOperation();
```

The order is:

```text
1. Evaluate condition.
2. Determine truthiness.
3. Evaluate consequent if truthy.
4. Otherwise evaluate alternate.
5. Produce the selected branch's value.
```

The unselected branch is not evaluated.

## Conditional Operator and Type Selection

The conditional operator does not automatically convert the two branches to a common type.

```javascript
const result = condition
    ? 42
    : "42";
```

Depending on the condition, `result` is either a number or a string.

Likewise:

```javascript
const result = condition
    ? null
    : {value: 42};
```

The selected value retains the semantics of the selected expression.

If both branches are intended to represent the same conceptual value, keeping their types compatible generally makes
subsequent code easier to reason about.

## Conditional Operator and Boolean Results

The conditional operator can explicitly produce boolean values:

```javascript
const result = condition
    ? true
    : false;
```

However, this is usually redundant when `condition` already produces the desired boolean result.

For example:

```javascript
const result = value > 10
    ? true
    : false;
```

can normally be written as:

```javascript
const result = value > 10;
```

The conditional operator should express an actual alternative selection rather than reproduce an existing boolean value.

## Default and Fallback Values

A conditional expression can provide an explicit fallback.

```javascript
const label = value !== undefined
    ? value
    : "Unknown";
```

The condition determines exactly when the fallback is selected.

This differs from operators such as `??` or `||`, which have their own operand-selection semantics.

Use a conditional expression when the fallback decision depends on an explicit condition.

## Conditional Formatting

The conditional operator is often useful for formatting values.

```javascript
const label = count === 1
    ? "item"
    : "items";
```

```javascript
const message = isOnline
    ? "User is online"
    : "User is offline";
```

```javascript
const sign = value >= 0
    ? "+"
    : "-";
```

These are good candidates because the expression directly represents a value selection.

## Conditional Rendering

The conditional operator is frequently used in expression-oriented UI code.

```javascript
const content = isLoading
    ? loadingView
    : contentView;
```

It can also select between components or renderable values:

```javascript
const view = hasPermission
    ? adminView
    : accessDeniedView;
```

The exact rendering mechanism depends on the framework, but the underlying JavaScript semantics remain the same: one
expression is selected and evaluated.

## Formatting Multiline Ternaries

A simple conditional can remain on one line:

```javascript
const status = isActive ? "active" : "inactive";
```

When the expressions become longer, formatting each branch separately improves readability:

```javascript
const result = condition
    ? calculatePrimaryValue()
    : calculateFallbackValue();
```

For chained conditionals:

```javascript
const label =
    conditionA ? valueA :
        conditionB ? valueB :
            conditionC ? valueC :
                defaultValue;
```

The formatting should make the branching hierarchy immediately visible.

## Deeply Nested Ternaries

Nested ternaries are syntactically valid:

```javascript
const result =
    conditionA
        ? valueA
        : conditionB
            ? valueB
            : conditionC
                ? valueC
                : valueD;
```

However, readability decreases as nesting depth increases.

When multiple conditions contain substantial logic, use an `if...else if...else` chain:

```javascript
if (conditionA) {
    result = valueA;
} else if (conditionB) {
    result = valueB;
} else if (conditionC) {
    result = valueC;
} else {
    result = valueD;
}
```

Alternatively, extract the decision into a dedicated function.

## Conditional Operator vs Lookup-Based Selection

Some two-way decisions are naturally expressed using the conditional operator:

```javascript
const label = isAdmin ? "Admin" : "User";
```

When the selection is based on many discrete keys, a lookup structure can be clearer:

```javascript
const labels = {
    admin: "Admin",
    user: "User",
    guest: "Guest"
};

const label = labels[role];
```

The conditional operator is best suited to an actual binary condition rather than replacing a larger dispatch mechanism.

## Conditional Operator vs `switch`

The conditional operator is appropriate for compact expression-level selection:

```javascript
const label = isActive ? "active" : "inactive";
```

A `switch` is more appropriate when selecting behavior or values among multiple discrete cases:

```javascript
switch (status) {
    case "pending":
        return "Waiting";
    case "active":
        return "Running";
    case "disabled":
        return "Stopped";
}
```

The choice should reflect the structure of the decision rather than an attempt to minimize the number of lines.

## Common Mistakes

### Using the Conditional Operator Without Using Its Result

```javascript
condition ? doSomething() : doSomethingElse();
```

Although valid, this uses the operator primarily for side effects.

Prefer:

```javascript
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}
```

### Excessive Nesting

```javascript
const result = a ? b : c ? d : e ? f : g;
```

This can be difficult to parse.

Prefer a clearer conditional structure when the decision tree becomes complex.

### Confusing `:` with Object Syntax

The conditional operator uses:

```javascript
condition ? consequent : alternate
```

Object literals also use colons:

```javascript
const object = {
    key: value
};
```

The syntactic context determines the meaning.

### Assuming Both Branches Execute

```javascript
const result = condition
    ? first()
    : second();
```

Only one function is called.

The unselected branch is not evaluated.

### Repeating Expensive Conditions

Avoid unnecessary repeated evaluation:

```javascript
const result = expensiveCheck()
    ? valueA
    : expensiveCheck()
        ? valueB
        : valueC;
```

If the result of the condition is needed more than once, calculate it once and structure the decision around that value.

### Using Ternary for Large Procedural Branches

A conditional operator is not a replacement for arbitrary statement blocks.

When each branch contains multiple operations, use `if...else` or extract each operation into a function.

## Best Practices

* **Use the conditional operator for value selection.** It is most appropriate when a condition determines which value
  or expression should be produced.
* **Keep simple ternaries simple.** Expressions such as `isActive ? "active" : "inactive"` are concise and immediately
  understandable.
* **Remember that only one branch is evaluated.** Do not assume both consequent and alternate expressions execute.
* **Use `if...else` for procedural control flow.** When branches contain multiple statements, substantial side effects,
  or complex logic, an `if...else` statement is usually clearer.
* **Avoid deeply nested ternaries.** Right-associativity makes nested expressions legal, but excessive nesting makes the
  control-flow hierarchy difficult to understand.
* **Use parentheses when they improve clarity.** Do not rely on readers remembering precedence and associativity when
  grouping is important.
* **Do not use ternary solely for side effects.** If the result of the conditional expression is discarded, `if...else`
  usually communicates the intent better.
* **Keep branch types conceptually compatible when practical.** A conditional expression can return values of completely
  different types, but compatible branch results generally make consuming code easier to reason about.
* **Do not use a ternary merely to convert a value to boolean.** Prefer the condition itself when it already produces
  the required boolean result.
* **Do not confuse the conditional operator with logical operators.** `?:`, `&&`, `||`, and `??` have different
  evaluation and operand-selection semantics.
* **Use explicit conditions when the decision is semantic.** A conditional operator is preferable when the code is
  expressing a specific binary choice, not when it is hiding complex truthiness logic.
* **Prefer direct assignment to assignment inside branches.** Prefer:

  ```javascript
  value = condition ? a : b;
  ```

  over:

  ```javascript
  condition ? (value = a) : (value = b);
  ```

* **Preserve the expression nature of the operator.** The conditional operator is most useful when its resulting value
  participates naturally in an assignment, return statement, function argument, object property, array element, or
  larger expression.
* **Format multiline ternaries consistently.** Each branch should remain visually associated with its corresponding
  condition.
* **Choose readability over terseness.** A shorter expression is not automatically better if the branching logic becomes
  harder to understand.


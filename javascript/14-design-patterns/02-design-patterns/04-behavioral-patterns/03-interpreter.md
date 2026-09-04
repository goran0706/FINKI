# Interpreter

Interpreter is a behavioral design pattern that defines a representation for a language's grammar and provides an
interpreter for evaluating sentences in that language. Each grammatical construct is represented by an object or
equivalent abstraction, and larger expressions are composed from smaller expressions according to the grammar.

The pattern is most appropriate for small, specialized languages where the grammar is relatively simple and the
resulting expressions can be represented directly as an object structure. It becomes less attractive when the language
requires substantial parsing, optimization, static analysis, error recovery, or compilation infrastructure.

## Intent

Interpreter defines a representation for a language's grammar and provides an interpreter that evaluates sentences in
that language.

The central idea is to represent the syntax of a language as an object structure whose elements know how to interpret
themselves within an execution context.

## The Problem

Applications sometimes need to understand and evaluate a small language embedded inside a larger system.

Examples include:

* search expressions
* filtering expressions
* permission rules
* configuration expressions
* validation rules
* query predicates
* mathematical expressions
* template expressions
* business rules
* pattern-matching languages
* command expressions
* simple scripting languages

A direct implementation might place all evaluation logic inside a large conditional:

```js
function evaluate(expression, context) {
    if (expression.type === "and") {
        return evaluate(expression.left, context) &&
            evaluate(expression.right, context);
    }

    if (expression.type === "or") {
        return evaluate(expression.left, context) ||
            evaluate(expression.right, context);
    }

    if (expression.type === "equals") {
        return context[expression.name] === expression.value;
    }

    throw new Error("Unknown expression");
}
```

This can work for a small number of constructs, but as the grammar grows, the representation and evaluation rules can
become tightly coupled to one central dispatcher.

Interpreter instead represents the language constructs explicitly.

```js
const expression = new AndExpression(
    new EqualsExpression("role", "admin"),
    new EqualsExpression("active", true)
);

expression.interpret(context);
```

The structure of the expression reflects the structure of the language itself.

## Grammar

Interpreter begins with a language grammar.

For example, a small boolean expression language might conceptually contain:

```text
Expression
    ::= Literal
     |  Variable
     |  And
     |  Or
     |  Not
     |  Equals
```

The exact grammar notation is not important to the pattern. What matters is that the application has a language with
defined syntactic constructs and those constructs need to be represented and evaluated.

The object model can then correspond to those grammatical constructs.

## Abstract Expression

The Abstract Expression defines the common interpretation operation.

```js
class Expression {
    interpret(context) {
        throw new Error("Not implemented");
    }
}
```

Every concrete grammatical construct implements the interpretation operation according to its semantics.

In JavaScript, this abstraction can also be represented by a convention rather than an abstract class.

```js
function evaluate(expression, context) {
    return expression.interpret(context);
}
```

The pattern does not require inheritance. The important property is the common interpretation protocol.

## Terminal Expression

A Terminal Expression represents a grammatical construct that does not contain other expressions.

For example, a literal can be represented as:

```js
class LiteralExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return this.value;
    }
}
```

A variable can also be terminal:

```js
class VariableExpression {
    constructor(name) {
        this.name = name;
    }

    interpret(context) {
        return context[this.name];
    }
}
```

Terminal expressions provide the leaves of the expression structure.

## Nonterminal Expression

A Nonterminal Expression represents a grammatical construct composed from other expressions.

For example:

```js
class AndExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        return (
            this.left.interpret(context) &&
            this.right.interpret(context)
        );
    }
}
```

The nonterminal expression delegates interpretation to its child expressions and combines their results according to the
grammar.

## Recursive Expression Structures

Interpreter naturally produces recursive object structures when the grammar is recursive.

```js
const expression = new AndExpression(
    new VariableExpression("active"),
    new OrExpression(
        new VariableExpression("admin"),
        new VariableExpression("owner")
    )
);
```

The resulting structure corresponds to the nested structure of the language expression.

Evaluation recursively traverses that structure:

```js
expression.interpret({
    active: true,
    admin: false,
    owner: true
});
```

The recursive nature of Interpreter is closely related to Composite, but the purpose is different. Composite provides
uniform treatment of part-whole structures in general; Interpreter uses a compositional structure specifically to
represent and evaluate a language grammar.

## Context

Interpretation often requires a Context containing information needed to evaluate expressions.

```js
const context = {
    username: "alice",
    role: "admin",
    active: true
};
```

An expression can read from the context:

```js
class VariableExpression {
    constructor(name) {
        this.name = name;
    }

    interpret(context) {
        return context[this.name];
    }
}
```

The context should represent runtime information required by the language rather than becoming an uncontrolled global
object containing unrelated application state.

## Explicit Context Objects

A dedicated context object can provide stronger structure.

```js
class EvaluationContext {
    constructor(values) {
        this.values = new Map(Object.entries(values));
    }

    get(name) {
        return this.values.get(name);
    }
}
```

Expressions can then depend on the context abstraction:

```js
class VariableExpression {
    constructor(name) {
        this.name = name;
    }

    interpret(context) {
        return context.get(this.name);
    }
}
```

This makes context access easier to control and evolve.

## Literal Expressions

Literal expressions return fixed values.

```js
class NumberExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return this.value;
    }
}
```

A boolean literal can use the same concept:

```js
class BooleanExpression {
    constructor(value) {
        this.value = value;
    }

    interpret() {
        return this.value;
    }
}
```

Different literal types may share a common representation when the language semantics allow it.

## Equality Expressions

A binary equality expression can compare two expressions.

```js
class EqualsExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        return (
            this.left.interpret(context) ===
            this.right.interpret(context)
        );
    }
}
```

The operands can themselves be arbitrary expressions.

```js
const expression = new EqualsExpression(
    new VariableExpression("role"),
    new LiteralExpression("admin")
);
```

This allows the grammar to be composed recursively.

## Boolean Expressions

Logical operators can be represented as nonterminal expressions.

```js
class OrExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        return (
            this.left.interpret(context) ||
            this.right.interpret(context)
        );
    }
}
```

Negation is unary:

```js
class NotExpression {
    constructor(expression) {
        this.expression = expression;
    }

    interpret(context) {
        return !this.expression.interpret(context);
    }
}
```

These objects directly represent grammar productions.

## Short-Circuit Semantics

Interpreter implementations should preserve the semantics of the language.

For logical conjunction:

```js
class AndExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        const left = this.left.interpret(context);

        if (!left) {
            return false;
        }

        return Boolean(this.right.interpret(context));
    }
}
```

This differs from eagerly evaluating both operands.

If the language defines short-circuit evaluation, the Interpreter must preserve it.

This becomes particularly important when expressions can have side effects or when evaluation can fail.

## Arithmetic Expressions

Interpreter can represent arithmetic grammar.

```js
class AddExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        return (
            this.left.interpret(context) +
            this.right.interpret(context)
        );
    }
}
```

A complete expression can then be constructed:

```js
const expression = new AddExpression(
    new NumberExpression(10),
    new NumberExpression(20)
);

expression.interpret();
```

More complex expressions can be nested recursively.

```js
const expression = new MultiplyExpression(
    new AddExpression(
        new NumberExpression(2),
        new NumberExpression(3)
    ),
    new NumberExpression(4)
);
```

The expression structure itself represents the parsed semantics.

## Operator Precedence

When expressions are created directly as objects, precedence is normally already encoded by the structure.

For example:

```js
new MultiplyExpression(
    new AddExpression(
        new NumberExpression(2),
        new NumberExpression(3)
    ),
    new NumberExpression(4)
);
```

represents `(2 + 3) * 4`.

However, if expressions originate from textual input, the Interpreter pattern alone does not determine how text is
parsed into this structure.

A parser must apply the language's precedence and associativity rules.

This distinction is important: **Interpreter evaluates an expression representation; it does not inherently parse source
text.**

## Parsing

A textual language usually requires a pipeline that separates parsing from interpretation.

For example:

```text
source text
parse
expression structure
interpret
result
```

The parsing stage converts source text into an expression representation.

The interpretation stage evaluates that representation.

A small application can combine these responsibilities, but separating them becomes valuable as the language grows.

## Handwritten Parsing

A simple recursive-descent parser can construct Interpreter objects.

```js
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    parseLiteral() {
        const token = this.tokens[this.position++];

        return new NumberExpression(Number(token));
    }
}
```

The parser knows the syntax of the language. The expression objects know the semantics of the represented operations.

This separation prevents the Interpreter classes from becoming responsible for lexical analysis and parsing.

## Abstract Syntax Tree

Interpreter commonly works with an Abstract Syntax Tree, or AST.

An AST represents the semantic structure of source code rather than preserving every syntactic detail.

For example, an arithmetic expression such as:

```text
2 + 3 * 4
```

can be represented by a tree in which multiplication is nested under addition.

Interpreter can operate directly on such an AST.

However, an AST is a representation technique rather than the Interpreter pattern itself. An AST can be used for
interpretation, compilation, optimization, static analysis, formatting, code generation, and many other purposes.

## Interpreter and Composite

Interpreter frequently uses a Composite-like structure.

Terminal expressions act as leaves, while nonterminal expressions contain child expressions.

However, the patterns have different primary intentions.

Composite answers:

**How can individual objects and compositions of those objects be treated uniformly?**

Interpreter answers:

**How can the constructs of a language grammar be represented and evaluated?**

A generic file-system tree may use Composite without being an Interpreter. An expression tree may use recursive
composition without necessarily implementing the full Interpreter pattern.

The presence of a tree is therefore not sufficient to identify Interpreter.

## Interpreter and Visitor

Interpreter and Visitor are often combined because both can operate over expression trees.

Interpreter places the evaluation behavior on expression nodes:

```js
class AddExpression {
    interpret(context) {
        return (
            this.left.interpret(context) +
            this.right.interpret(context)
        );
    }
}
```

Visitor moves an operation outside the expression structure:

```js
class AddExpression {
    accept(visitor) {
        return visitor.visitAdd(this);
    }
}
```

Visitor is useful when many independent operations must be performed over the same stable grammar.

Interpreter is useful when the language constructs naturally define their own interpretation semantics.

## Multiple Interpretations

A language may need more than one interpretation.

For example, the same expression might need to be:

* evaluated
* serialized
* pretty-printed
* optimized
* compiled
* analyzed
* translated

If every operation is implemented directly inside every expression node, the number of responsibilities can grow.

At that point, Visitor or another external operation mechanism may be more appropriate.

A practical architecture may therefore use Interpreter-like expression objects as the representation and Visitor-like
operations for additional processing.

## Interpreter and Strategy

Strategy encapsulates interchangeable algorithms.

Interpreter represents and evaluates grammatical constructs.

For example, an expression evaluator might choose a Strategy for numeric operations:

```js
class AddExpression {
    constructor(left, right, strategy) {
        this.left = left;
        this.right = right;
        this.strategy = strategy;
    }

    interpret(context) {
        return this.strategy.combine(
            this.left.interpret(context),
            this.right.interpret(context)
        );
    }
}
```

The expression structure remains the language representation, while the strategy controls an interchangeable algorithm.

## Interpreter and Command

Command encapsulates a request for execution.

Interpreter evaluates a sentence in a language.

A language can contain commands:

```text
move north
open door
take key
```

Those commands can be represented as interpreted expressions.

The resulting interpreted operation may then produce or execute a Command.

In such a design, Interpreter handles language semantics while Command represents an executable application request.

## Interpreter and State

State changes an object's behavior according to its current state.

Interpreter evaluates a language expression according to an evaluation context.

An interpreter can maintain state during execution, but that does not make it an implementation of State.

The distinction is between **representing language semantics** and **changing object behavior according to object
state**.

## Interpreter and Chain of Responsibility

Chain of Responsibility passes a request through potential handlers.

Interpreter recursively evaluates grammatical constructs.

An interpreter can use a chain to resolve variables, functions, operators, or commands, but the chain is an auxiliary
mechanism rather than the defining structure of Interpreter.

A sequence of handlers should not be classified as Interpreter merely because each handler performs some evaluation.

## Interpreter and Template Method

Template Method defines the skeleton of an algorithm while allowing subclasses to vary individual steps.

Interpreter defines a grammar representation and semantics for evaluating its constructs.

An interpreter implementation may use inheritance and Template Method internally, but the two patterns address different
structural problems.

## Expression Immutability

Expression objects are often naturally immutable.

```js
class AddExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;

        Object.freeze(this);
    }

    interpret(context) {
        return (
            this.left.interpret(context) +
            this.right.interpret(context)
        );
    }
}
```

Immutable expressions can safely be reused across evaluations.

```js
const expression = new EqualsExpression(
    new VariableExpression("role"),
    new LiteralExpression("admin")
);

expression.interpret({role: "admin"});
expression.interpret({role: "user"});
```

The expression represents the language semantics, while the context supplies the runtime values.

## Reusing Expression Trees

An expression tree can be evaluated multiple times against different contexts.

```js
const rule = new AndExpression(
    new EqualsExpression(
        new VariableExpression("role"),
        new LiteralExpression("admin")
    ),
    new VariableExpression("active")
);

rule.interpret({
    role: "admin",
    active: true
});

rule.interpret({
    role: "admin",
    active: false
});
```

This separation between static expression structure and dynamic context is useful for reusable rules and policies.

## Expression Construction

Manually constructing large expression trees can become verbose.

```js
const expression = new AndExpression(
    new EqualsExpression(
        new VariableExpression("role"),
        new LiteralExpression("admin")
    ),
    new OrExpression(
        new VariableExpression("active"),
        new VariableExpression("owner")
    )
);
```

A parser, builder, factory, or domain-specific API can improve construction.

The construction mechanism is separate from the Interpreter pattern itself.

## Builder and Interpreter

A builder can provide a fluent representation for constructing expressions:

```js
const expression = expr("role")
    .equals("admin")
    .and(
        expr("active").isTrue()
    );
```

The builder constructs the expression representation.

Interpreter evaluates the resulting expression.

These concerns should not be conflated.

## Domain-Specific Languages

Interpreter is particularly suitable for small Domain-Specific Languages, or DSLs.

A DSL defines a restricted language for a particular problem domain.

Examples include:

* authorization rules
* search filters
* pricing expressions
* validation conditions
* workflow conditions
* feature rules
* scheduling expressions
* configuration predicates

A DSL can be represented as an AST and interpreted against an application context.

For example:

```text
role == "admin" AND active == true
```

can become an expression structure containing equality and conjunction nodes.

## Rule Engines

A rule engine can represent business rules as expressions.

```js
const rule = new AndExpression(
    new EqualsExpression(
        new VariableExpression("customerType"),
        new LiteralExpression("premium")
    ),
    new GreaterThanExpression(
        new VariableExpression("orderTotal"),
        new NumberExpression(1000)
    )
);
```

The rule can then be evaluated against a context.

```js
const eligible = rule.interpret({
    customerType: "premium",
    orderTotal: 1500
});
```

The expression can be stored independently of a particular evaluation.

This makes Interpreter useful for configurable business logic when the language remains sufficiently small.

## Search Expressions

Search systems often use small query languages.

A query such as:

```text
status:active AND role:admin
```

can be represented by expression nodes.

The interpreter can evaluate the expression against records:

```js
class FieldEqualsExpression {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }

    interpret(record) {
        return record[this.field] === this.value;
    }
}
```

A compound expression can combine the results.

This approach allows the search grammar to evolve independently from the application code that executes searches.

## Authorization Rules

Permission expressions are another common use.

```text
admin OR (owner AND active)
```

can be represented as an expression tree.

```js
const rule = new OrExpression(
    new VariableExpression("admin"),
    new AndExpression(
        new VariableExpression("owner"),
        new VariableExpression("active")
    )
);
```

The interpreter evaluates the rule against an authorization context.

Security-sensitive interpreters should use a deliberately restricted grammar and should never interpret arbitrary
JavaScript source as part of the DSL.

## Safety and Sandboxing

A major advantage of a dedicated Interpreter-based DSL is that the language can be deliberately restricted.

A safe expression language might allow:

```text
AND
OR
NOT
==
>
<
field references
literal values
```

but not arbitrary function execution.

The interpreter controls exactly which operations exist.

This can be safer than evaluating source code directly.

For example, `eval()` should not be used as a generic substitute for an interpreter:

```js
eval(userInput);
```

That executes JavaScript rather than interpreting a controlled domain language and can introduce severe security
vulnerabilities.

## Function Calls

A DSL may support function calls.

```js
class FunctionExpression {
    constructor(name, argumentsList) {
        this.name = name;
        this.argumentsList = argumentsList;
    }

    interpret(context) {
        const fn = context.functions.get(this.name);

        if (!fn) {
            throw new Error(`Unknown function: ${this.name}`);
        }

        const args = this.argumentsList.map(
            argument => argument.interpret(context)
        );

        return fn(...args);
    }
}
```

Function lookup should be explicit.

An interpreter should never automatically resolve arbitrary names to arbitrary executable JavaScript objects.

The language defines which functions are available and what their semantics are.

## TypeScript

TypeScript can express an Interpreter hierarchy through interfaces.

```ts
interface Expression<TResult> {
    interpret(context: EvaluationContext): TResult;
}
```

A literal expression can implement it:

```ts
class LiteralExpression<T> implements Expression<T> {
    constructor(private readonly value: T) {
    }

    interpret(): T {
        return this.value;
    }
}
```

A binary expression can be generic:

```ts
class AddExpression implements Expression<number> {
    constructor(
        private readonly left: Expression<number>,
        private readonly right: Expression<number>
    ) {
    }

    interpret(context: EvaluationContext): number {
        return (
            this.left.interpret(context) +
            this.right.interpret(context)
        );
    }
}
```

The type system can therefore enforce that operands and results have compatible types.

## Discriminated-Union Alternative

TypeScript can represent an AST without an object-oriented hierarchy.

```ts
type Expression =
    | {
    type: "literal";
    value: number;
}
    | {
    type: "variable";
    name: string;
}
    | {
    type: "add";
    left: Expression;
    right: Expression;
};
```

Evaluation can then use a discriminated union:

```ts
function interpret(
    expression: Expression,
    context: Record<string, number>
): number {
    switch (expression.type) {
        case "literal":
            return expression.value;

        case "variable":
            return context[expression.name];

        case "add":
            return (
                interpret(expression.left, context) +
                interpret(expression.right, context)
            );
    }
}
```

This is often more idiomatic in TypeScript than creating a class for every grammatical construct.

The underlying Interpreter concept remains the same: the language grammar is represented explicitly and evaluated
according to defined semantics.

## Recursive Types

AST representations naturally require recursive types.

```ts
type Expression =
    | LiteralExpression
    | VariableExpression
    | BinaryExpression;

interface BinaryExpression {
    type: "binary";
    operator: "+" | "-" | "*" | "/";
    left: Expression;
    right: Expression;
}
```

Recursive types make the grammar visible in the type system.

This can provide stronger guarantees than loosely typed expression objects.

## Evaluation Result Types

An interpreter does not necessarily return a boolean or number.

It may return:

```ts
type Value =
    | string
    | number
    | boolean
    | null;
```

The interpreter can then define language-level values separately from JavaScript implementation details.

```ts
interface Expression {
    interpret(context: EvaluationContext): Value;
}
```

A more sophisticated language may require explicit runtime value types rather than returning arbitrary JavaScript
values.

## Type Checking

For nontrivial languages, interpretation should often be preceded by validation or type checking.

Consider:

```text
5 + true
```

If the language does not allow adding a number and boolean, the expression should be rejected.

A type-checking phase can detect the error before evaluation.

This produces a broader architecture:

```text
source
parsing
AST
validation/type checking
evaluation
```

Interpreter remains responsible for execution semantics rather than necessarily performing every compiler-like phase.

## Static Analysis

Expression structures can be analyzed without executing them.

For example, an analyzer can determine which variables an expression references.

```js
function collectVariables(expression, result = new Set()) {
    if (expression instanceof VariableExpression) {
        result.add(expression.name);
        return result;
    }

    if (expression.left) {
        collectVariables(expression.left, result);
    }

    if (expression.right) {
        collectVariables(expression.right, result);
    }

    return result;
}
```

This demonstrates why separating representation from interpretation can be valuable.

Once expressions exist as explicit structures, other operations can inspect them without executing them.

## Optimization

An interpreter can optimize expressions before evaluation.

For example:

```text
true AND expression
```

can be simplified to:

```text
expression
```

Similarly:

```text
5 + 0
```

can be simplified to:

```text
5
```

An optimization pass can transform the AST while preserving semantics.

This is one reason a parser and AST representation can outlive the original need for direct Interpreter behavior.

## Constant Folding

Constant expressions can be evaluated ahead of time.

```js
new AddExpression(
    new NumberExpression(2),
    new NumberExpression(3)
);
```

can be transformed into:

```js
new NumberExpression(5);
```

This reduces runtime work.

However, optimization is an additional concern. A small interpreter should not automatically become a compiler optimizer
unless the application's requirements justify it.

## Caching

Expression results can sometimes be cached.

```js
const cache = new WeakMap();

function evaluate(expression, context) {
    if (cache.has(expression)) {
        return cache.get(expression);
    }

    const result = expression.interpret(context);

    cache.set(expression, result);

    return result;
}
```

This example is only safe when the result is independent of mutable context.

If the expression depends on changing variables, blindly caching by expression identity produces incorrect results.

Caching must therefore account for the semantic inputs of the expression.

## Memoization vs Interpreter

Memoization caches results of function calls.

Interpreter represents and evaluates a language.

An interpreter may use memoization internally, but memoization is not the reason the interpreter exists.

The distinction is between **language representation and evaluation** versus **result caching**.

## Evaluation Context and Side Effects

Pure expressions are easier to reason about.

```js
class AddExpression {
    interpret(context) {
        return (
            this.left.interpret(context) +
            this.right.interpret(context)
        );
    }
}
```

If expressions can perform side effects, evaluation order becomes part of the language semantics.

For example:

```text
incrementCounter() AND checkPermission()
```

requires the language to define whether the first expression is always evaluated and whether short-circuiting applies.

Side effects therefore increase interpreter complexity significantly.

## Error Handling

An interpreter should produce meaningful language-level errors.

```js
class VariableExpression {
    constructor(name) {
        this.name = name;
    }

    interpret(context) {
        if (!(this.name in context)) {
            throw new Error(
                `Undefined variable: ${this.name}`
            );
        }

        return context[this.name];
    }
}
```

When expressions originate from source text, errors should ideally preserve source locations.

For example, the parser may associate source positions with AST nodes:

```js
class VariableExpression {
    constructor(name, location) {
        this.name = name;
        this.location = location;
    }
}
```

This allows runtime errors to identify the relevant part of the original expression.

## Source Locations

Source locations become increasingly valuable as a language grows.

```js
{
    start: 12,
        end
:
    18
}
```

or:

```js
{
    line: 3,
        column
:
    7
}
```

can be associated with an expression.

The interpreter can then produce errors such as:

```text
Undefined variable "role" at line 3, column 7.
```

This is an implementation concern rather than a required component of the GoF pattern, but it is essential for usable
language tooling.

## Recursion Depth

Recursive interpretation can encounter deeply nested expressions.

```js
expression.interpret(context);
```

may recursively call child expressions many times.

Extremely deep structures can exceed the JavaScript call stack.

If the language allows arbitrary nesting, an iterative evaluator or explicit evaluation stack may be necessary.

For small DSLs with controlled expression depth, ordinary recursion is usually sufficient.

## Performance

The classic object-oriented Interpreter implementation introduces method calls and object allocations for individual
grammar nodes.

A deeply nested expression can therefore contain many objects and many dynamic dispatch operations.

For small DSLs, this is usually acceptable.

For large languages or performance-critical workloads, alternatives may include:

* compiled JavaScript
* bytecode
* virtual machines
* optimized AST evaluation
* generated functions
* parser generators
* specialized evaluators

The Interpreter pattern should not be treated as a universal implementation technique for programming languages.

## Compiling Instead of Interpreting

An expression representation can be compiled into a more efficient executable representation.

For example:

```js
function compile(expression) {
    return context => expression.interpret(context);
}
```

This example does not provide meaningful optimization, but illustrates the separation between expression representation
and execution.

A real compiler could instead generate a specialized function.

```js
function compileAdd(left, right) {
    return context =>
        left(context) + right(context);
}
```

The resulting architecture may retain the same AST while replacing direct interpretation with compilation.

## Security

An Interpreter-based DSL can provide a controlled execution surface, but only if the grammar and runtime are
deliberately restricted.

The following is unsafe as a general language implementation:

```js
new Function("return " + source)();
```

This converts input into executable JavaScript rather than interpreting a constrained language.

A proper interpreter should explicitly define:

* allowed syntax
* allowed operations
* available variables
* available functions
* value types
* resource limits
* execution limits

Security boundaries should be enforced independently of the expression representation.

## Resource Limits

A malicious or accidental expression may consume excessive resources.

Potential limits include:

* maximum expression depth
* maximum number of nodes
* maximum evaluation steps
* maximum execution time
* maximum collection size
* maximum recursion depth

A context can carry evaluation state:

```js
class EvaluationContext {
    constructor(values, options = {}) {
        this.values = values;
        this.steps = 0;
        this.maxSteps = options.maxSteps ?? 10000;
    }

    step() {
        this.steps++;

        if (this.steps > this.maxSteps) {
            throw new Error("Evaluation limit exceeded");
        }
    }
}
```

Each expression can increment the counter before performing work.

This is particularly important when expressions are supplied by untrusted users.

## Persistence

Expression structures can be serialized.

```js
{
    "type"
:
    "equals",
        "left"
:
    {
        "type"
    :
        "variable",
            "name"
    :
        "role"
    }
,
    "right"
:
    {
        "type"
    :
        "literal",
            "value"
    :
        "admin"
    }
}
```

A deserializer can reconstruct the appropriate expression representation.

For persisted expressions, the serialized format becomes a data contract.

Schema versioning may therefore be required:

```js
{
    "version"
:
    2,
        "type"
:
    "equals",
        "left"
:
    {
    }
,
    "right"
:
    {
    }
}
```

Executable object instances should generally not be persisted directly. Persist the language representation and
reconstruct the runtime objects when needed.

## Versioning the Grammar

Once expressions are persisted or transmitted, changing the grammar can become a compatibility problem.

For example, an expression created under version 1 may contain constructs that version 2 interprets differently.

A production system may therefore need:

* explicit grammar versions
* migration rules
* backward-compatible semantics
* validation
* rejected constructs
* migration tooling

Interpreter becomes part of a language contract once expressions persist beyond a single process.

## Extending the Grammar

Adding a new grammatical construct usually means adding a new expression representation.

For example:

```js
class GreaterThanExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        return (
            this.left.interpret(context) >
            this.right.interpret(context)
        );
    }
}
```

This is one of the strengths of the pattern when the grammar itself is expected to evolve.

The new construct can encapsulate its own semantics without modifying a large centralized evaluator.

## Changing the Interpretation

The opposite change can be more expensive.

Suppose the same grammar must support:

* evaluation
* SQL generation
* JavaScript generation
* documentation output
* static analysis

If each expression class contains every operation, each new interpretation requires modifying many expression classes.

This is the central trade-off of the object-oriented Interpreter structure.

If the grammar changes frequently, Interpreter can be attractive. If the grammar is stable but operations over the
grammar change frequently, Visitor or another external operation mechanism may be better.

## Grammar Stability

Interpreter is most effective when the grammar is relatively simple and stable enough that representing each construct
as an explicit abstraction remains manageable.

A rapidly expanding grammar can cause class proliferation.

For example:

```text
LiteralExpression
VariableExpression
AddExpression
SubtractExpression
MultiplyExpression
DivideExpression
ModuloExpression
AndExpression
OrExpression
NotExpression
EqualsExpression
GreaterThanExpression
LessThanExpression
FunctionExpression
ConditionalExpression
...
```

At some point, a formal parser, AST framework, and external evaluation passes may provide a better architecture.

## Small DSLs

Interpreter is particularly effective for small languages such as:

```text
active AND role == "admin"
```

or:

```text
price > 100 AND category == "electronics"
```

The grammar is small, the semantics are clear, and direct expression objects are easy to understand.

The pattern becomes less attractive when the language begins approaching the complexity of a general-purpose programming
language.

## Common Misuse

A common misuse is calling any recursive expression evaluator an Interpreter without having a language grammar.

For example:

```js
class Folder {
    calculateSize() {
        return this.files.reduce(
            (total, file) => total + file.size,
            0
        );
    }
}
```

This is recursive Composite-style behavior, not necessarily Interpreter.

Interpreter requires a language or grammar whose constructs are being represented and interpreted.

Another misuse is creating dozens of expression classes for a trivial condition that could be expressed directly in
ordinary JavaScript.

```js
user.role === "admin" && user.active
```

does not need an Interpreter merely because it is a logical expression.

## Reimplementing JavaScript

Another common misuse is creating an Interpreter for functionality already provided directly by the host language.

If the application can safely and appropriately use JavaScript expressions directly, recreating a large subset of
JavaScript is usually unjustified.

Interpreter is most valuable when the application needs a deliberately restricted, domain-specific language rather than
another implementation of the host language.

## Overly Generic Interpreters

A generic interpreter can become difficult to understand:

```js
class Expression {
    interpret(context, options, state, environment, metadata) {
        // ...
    }
}
```

If every expression requires many unrelated parameters, the Context has probably become an unstructured dependency
container.

Separate language semantics from application infrastructure.

The interpreter should receive the information required by the language rather than arbitrary global application state.

## Refactoring Toward Interpreter

Interpreter is a candidate refactoring when an application has a small language represented by complicated conditionals
or switches.

Suppose the application contains:

```js
function evaluate(node, context) {
    switch (node.type) {
        case "literal":
            return node.value;

        case "and":
            return (
                evaluate(node.left, context) &&
                evaluate(node.right, context)
            );

        case "equals":
            return (
                evaluate(node.left, context) ===
                evaluate(node.right, context)
            );

        default:
            throw new Error("Unknown expression");
    }
}
```

The grammatical constructs can be promoted into explicit expression types.

```js
class EqualsExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    interpret(context) {
        return (
            this.left.interpret(context) ===
            this.right.interpret(context)
        );
    }
}
```

This is worthwhile when the language representation needs to become independently reusable, inspectable, persisted, or
extensible.

## When Not to Refactor

A centralized evaluator is not automatically bad.

For a small discriminated-union AST:

```js
function evaluate(node, context) {
    switch (node.type) {
        case "literal":
            return node.value;

        case "variable":
            return context[node.name];

        case "add":
            return evaluate(node.left, context) +
                evaluate(node.right, context);
    }
}
```

this may be simpler and easier to maintain than a hierarchy of classes.

Interpreter should be introduced when its separation of grammar constructs and interpretation provides a concrete
architectural benefit.

## Testing

Each expression can be tested independently.

```js
const expression = new AddExpression(
    new NumberExpression(2),
    new NumberExpression(3)
);

console.assert(
    expression.interpret() === 5
);
```

Compound expressions should be tested against representative contexts.

```js
const rule = new AndExpression(
    new VariableExpression("active"),
    new VariableExpression("admin")
);

console.assert(
    rule.interpret({
        active: true,
        admin: true
    }) === true
);
```

The parser, expression representation, and interpreter can also be tested independently.

## Testing Language Semantics

Testing should focus on language semantics rather than implementation details.

For example, tests should verify:

```text
true AND false = false
true OR false = true
NOT true = false
5 > 3 = true
2 + 3 * 4 = 14
```

If the language has precedence, associativity, coercion, or short-circuit rules, those semantics should have explicit
tests.

## Property-Based Testing

Expression languages can benefit from property-based testing.

For example, arithmetic expressions may be tested for algebraic properties where the language semantics guarantee them.

Boolean expressions can test identities such as:

```text
x AND true = x
x OR false = x
NOT NOT x = x
```

provided the language semantics are pure and the transformations are valid.

This is especially useful when optimization passes transform expression trees.

## Observability

Interpreters used in production systems may require execution tracing.

A context can carry instrumentation:

```js
class EvaluationContext {
    constructor(values, tracer) {
        this.values = values;
        this.tracer = tracer;
    }

    trace(event) {
        this.tracer?.record(event);
    }
}
```

An expression can report its execution:

```js
class VariableExpression {
    constructor(name) {
        this.name = name;
    }

    interpret(context) {
        context.trace({
            type: "variable-read",
            name: this.name
        });

        return context.values[this.name];
    }
}
```

Tracing should remain separate from language semantics where possible.

Decorator, Visitor, middleware, or evaluator instrumentation can sometimes provide a cleaner separation.

## Benefits

Interpreter provides several important benefits:

* represents language grammar explicitly
* separates language structure from surrounding application code
* allows expressions to be composed recursively
* makes language constructs independently testable
* supports reusable expression representations
* allows the same expression to be evaluated against different contexts
* enables restricted domain-specific languages
* can support persistence of language expressions
* provides a controlled alternative to arbitrary code execution
* allows additional processing such as validation, analysis, optimization, and compilation
* makes grammar-specific behavior explicit

## Costs

Interpreter also introduces significant costs:

* one abstraction may be required for each grammatical construct
* expression trees can contain many objects
* recursive evaluation introduces runtime overhead
* grammar growth can produce class proliferation
* error handling becomes a language-design concern
* parsing is a separate problem when input is textual
* persisted grammars require versioning
* multiple interpretations can produce duplicated behavior
* complex languages require compiler-like infrastructure
* security and resource limits become important for untrusted expressions

## Decision Criteria

Use Interpreter when the application has a genuine language or DSL whose grammar can be represented compactly and whose
expressions need to be evaluated according to explicit semantics.

It is particularly appropriate when the language is small, specialized, and potentially reusable across different
contexts.

Do not use Interpreter merely because data is recursive or because an application contains conditions.

The key question is:

**Does the application need to represent and evaluate sentences of a defined language independently of the code that
created those sentences?**

If yes, Interpreter may be appropriate.

If the requirement is simply to evaluate a few ordinary application conditions, direct JavaScript is usually clearer.

If the language is large or compiler-like, a dedicated parsing and compiler architecture is usually more appropriate.

## Summary

Interpreter represents the grammar of a language as an explicit structure and defines semantics for evaluating that
structure.

Terminal expressions represent atomic constructs. Nonterminal expressions combine other expressions according to grammar
rules. A Context provides runtime information required during evaluation.

The pattern is particularly useful for small domain-specific languages such as filtering, validation, authorization,
configuration, search, and business-rule expressions.

Interpreter is closely related to recursive expression trees and often uses Composite-like composition, but its defining
purpose is language representation and interpretation rather than generic tree composition.

JavaScript and TypeScript provide several ways to implement the concept. Classes and interfaces can model explicit
expression objects, while discriminated unions and functions can provide a more idiomatic representation for many
TypeScript applications.

The pattern becomes less attractive as the language grows in complexity. Parsing, type checking, optimization, static
analysis, error recovery, compilation, persistence, security, and resource management may eventually require a broader
language-processing architecture.

The defining idea remains: **represent the constructs of a language explicitly so that sentences in that language can be
interpreted according to its grammar and semantics.**

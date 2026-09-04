# Chain of Responsibility

## Intent

Chain of Responsibility passes a request through a sequence of potential handlers until a handler decides to process it
or the chain is exhausted.

The pattern decouples the sender of a request from the specific object responsible for handling it. The sender submits
the request to the chain without needing to know which handler will process it.

Each handler decides whether it can handle the request. If it cannot, it delegates the request to another handler.

The essential characteristic is **sequential responsibility resolution**: responsibility for handling a request is
distributed across a chain of handlers rather than assigned directly to the sender.

## Problem

A request may have several possible handlers, but the sender should not need to contain logic that determines which
handler should process it.

For example:

```js id="8m3h2r"
function processRequest(request) {
    if (request.type === "authentication") {
        return handleAuthentication(request);
    }

    if (request.type === "authorization") {
        return handleAuthorization(request);
    }

    if (request.type === "validation") {
        return handleValidation(request);
    }

    if (request.type === "logging") {
        return handleLogging(request);
    }

    throw new Error("Unknown request type");
}
```

This directly couples the request sender to every possible handler.

Adding another handler requires modifying the dispatcher.

Chain of Responsibility moves the responsibility for deciding who handles the request into the handlers themselves.

```js id="l5xj8v"
class Handler {
    #next = null;

    setNext(handler) {
        this.#next = handler;
        return handler;
    }

    handle(request) {
        if (this.#next) {
            return this.#next.handle(request);
        }

        return undefined;
    }
}
```

A client can construct a chain and send requests to its first handler without knowing which handler will ultimately
process them.

## Structure

The pattern consists of a request, one or more handlers, and a mechanism for delegating to the next handler.

A **Handler** defines the operation used to process or forward a request.

A **Concrete Handler** determines whether it can handle the request and performs the appropriate processing when it can.

The **next handler** represents the continuation of responsibility.

A typical implementation is:

```js id="m4c1za"
class Handler {
    #next = null;

    setNext(handler) {
        this.#next = handler;
        return handler;
    }

    handle(request) {
        if (this.canHandle(request)) {
            return this.process(request);
        }

        if (this.#next) {
            return this.#next.handle(request);
        }

        return undefined;
    }

    canHandle(request) {
        return false;
    }

    process(request) {
        throw new Error("Not implemented");
    }
}
```

Concrete handlers specialize the decision:

```js id="q2t7yk"
class AuthenticationHandler extends Handler {
    canHandle(request) {
        return request.type === "authentication";
    }

    process(request) {
        return authenticate(request);
    }
}
```

The sender only needs access to the first handler:

```js id="b8w5er"
const chain = new AuthenticationHandler();

chain
    .setNext(new AuthorizationHandler())
    .setNext(new ValidationHandler());

chain.handle(request);
```

## Handler Responsibility

A handler has two fundamental responsibilities:

1. Determine whether it should handle the request.
2. Either process the request or delegate it to the next handler.

For example:

```js id="7b8p0y"
class FileHandler {
    #next = null;

    setNext(handler) {
        this.#next = handler;
        return handler;
    }

    handle(file) {
        if (file.extension === ".pdf") {
            return processPdf(file);
        }

        return this.#next?.handle(file);
    }
}
```

The handler does not need to know the complete chain.

It only needs to know its immediate successor.

This local knowledge is an important source of decoupling.

## Chain Construction

The chain can be assembled explicitly:

```js id="y0n4kp"
const chain = new AuthenticationHandler();

chain
    .setNext(new AuthorizationHandler())
    .setNext(new ValidationHandler())
    .setNext(new ApplicationHandler());
```

The client can then submit requests:

```js id="4r9p0w"
chain.handle(request);
```

The sender does not select the handler directly.

The chain itself determines where responsibility ends up.

Chain construction can also be delegated to a factory or dependency-injection container when the chain is part of
application configuration.

## First Handler

The object given to the client is usually the first handler in the chain.

```js id="6s5e4v"
const handler = createRequestChain();

handler.handle(request);
```

The client should not need to understand the internal sequence.

This allows the chain configuration to change independently from request-producing code.

For example, a production chain might contain:

```js id="c5h4bn"
authentication
authorization
validation
business
processing
```

while a test chain might contain only:

```js id="g7j2px"
validation
business
processing
```

The caller can remain unchanged.

## Handler Selection

Chain of Responsibility can be used when the appropriate handler is determined dynamically from the request.

```js id="m2y8qa"
class ImageHandler {
    handle(request) {
        if (request.type !== "image") {
            return undefined;
        }

        return processImage(request);
    }
}

class DocumentHandler {
    handle(request) {
        if (request.type !== "document") {
            return undefined;
        }

        return processDocument(request);
    }
}
```

The request is passed through the handlers until one accepts responsibility.

The sender therefore does not need a central dispatch table.

## First Match

The most common Chain of Responsibility semantics are **first matching handler**.

```js id="0w3d6r"
class Handler {
    #next;

    setNext(next) {
        this.#next = next;
        return next;
    }

    handle(request) {
        if (this.canHandle(request)) {
            return this.process(request);
        }

        return this.#next?.handle(request);
    }
}
```

Once a handler processes the request, traversal stops.

This is useful when exactly one handler should be responsible for the request.

Examples include:

* selecting a parser;
* resolving a command;
* handling a file type;
* choosing an escalation level;
* selecting a fallback;
* resolving an exception-like condition.

## Multiple Handlers

Chain of Responsibility can also allow multiple handlers to process the same request.

```js id="h4z8yd"
class LoggingHandler {
    handle(request, next) {
        logRequest(request);
        return next();
    }
}

class MetricsHandler {
    handle(request, next) {
        const start = performance.now();

        try {
            return next();
        } finally {
            recordDuration(performance.now() - start);
        }
    }
}
```

Here, every handler can participate.

This form resembles middleware because each handler can perform work before and after delegating.

The conceptual distinction is important.

A first-match chain resolves responsibility among possible handlers.

A middleware-style chain allows multiple handlers to participate in processing.

Both can be implemented with the same structural idea, but their semantics differ.

## Middleware-Style Chain

A continuation-based design makes multiple participation explicit:

```js id="p7c2ds"
class Middleware {
    constructor(handler) {
        this.handler = handler;
    }

    async execute(context, next) {
        return this.handler(context, next);
    }
}
```

A chain can be composed:

```js id="2t5c8q"
const middleware = [
    loggingMiddleware,
    authenticationMiddleware,
    validationMiddleware,
    applicationMiddleware
];
```

Execution can be centralized:

```js id="9d3m5k"
async function executeChain(context, middleware) {
    let index = -1;

    async function dispatch(position) {
        if (position <= index) {
            throw new Error("next() called multiple times");
        }

        index = position;

        const handler = middleware[position];

        if (!handler) {
            return;
        }

        return handler(context, () => dispatch(position + 1));
    }

    return dispatch(0);
}
```

This is conceptually related to Chain of Responsibility but introduces explicit continuation semantics.

The pattern should not be reduced to the implementation technique. What matters is that request processing
responsibility is distributed across a sequence of handlers.

## Request Mutation

Handlers may modify the request before passing it onward.

```js id="g3x4bq"
class NormalizationHandler {
    #next;

    constructor(next) {
        this.#next = next;
    }

    handle(request) {
        const normalized = {
            ...request,
            username: request.username.trim().toLowerCase()
        };

        return this.#next.handle(normalized);
    }
}
```

Mutation can be useful but creates coupling between handlers.

A later handler may implicitly depend on fields added or transformed by an earlier handler.

For predictable chains, the request contract should clearly define which transformations are permitted.

Immutable request objects can reduce accidental coupling:

```js id="7f9v2a"
const nextRequest = {
    ...request,
    normalized: true
};
```

## Context Objects

Complex chains often pass a context object.

```js id="w6k8cp"
const context = {
    request,
    user,
    metadata: {},
    result: undefined
};
```

Handlers can enrich the context:

```js id="q4x2hm"
class AuthenticationHandler {
    async handle(context, next) {
        context.user = await authenticate(context.request);

        return next();
    }
}
```

The context becomes the shared state of the chain.

This can be useful, but an uncontrolled context object can become an implicit global state container.

Its fields and lifecycle should therefore be treated as an explicit contract.

## Short-Circuiting

A handler may terminate the chain.

```js id="g0d7pw"
class AuthorizationHandler {
    handle(context, next) {
        if (!context.user.canAccess) {
            return {
                status: 403
            };
        }

        return next();
    }
}
```

This is one of the most useful properties of the pattern.

A handler can prevent later processing without the sender knowing which handler performed the decision.

Short-circuiting can represent:

* authorization failure;
* validation failure;
* cache hit;
* request rejection;
* successful resolution;
* fallback selection;
* policy violation.

## Fallback Handler

A final handler can provide a fallback when no earlier handler accepts the request.

```js id="a6v9zr"
class NotFoundHandler {
    handle(request) {
        throw new Error(
            `No handler found for request type: ${request.type}`
        );
    }
}
```

This makes exhaustion explicit.

Without a fallback, the chain may silently return `undefined`:

```js id="k8c3fd"
return this.#next?.handle(request);
```

That behavior may be appropriate in some cases but dangerous when every request is expected to be handled.

The chain contract should specify what happens when responsibility remains unresolved.

## Chain Ordering

Order is often semantically significant.

Consider:

```js id="j2m5tx"
authentication
authorization
validation
execution
```

Changing the order can change system behavior.

For example, validating an unauthenticated request before authentication may reveal information that should remain
inaccessible.

Likewise, placing caching before authorization can accidentally expose cached data if authorization is not independently
enforced.

Chain ordering should therefore be treated as part of the configuration and contract rather than as an incidental
implementation detail.

## Validation Chains

Validation is a common application of sequential handlers.

```js id="q9w6ac"
class RequiredFieldsValidator {
    handle(context, next) {
        if (!context.request.email) {
            throw new Error("Email is required");
        }

        return next();
    }
}

class EmailValidator {
    handle(context, next) {
        if (!context.request.email.includes("@")) {
            throw new Error("Invalid email");
        }

        return next();
    }
}
```

The validators form a chain:

```js id="6e5b3k"
requiredFields
    -> emailFormat
    -> businessRules
```

The important characteristic is that each validator is independently responsible for one stage of request handling.

## Authentication and Authorization

Request-processing pipelines often separate authentication and authorization:

```js id="e4z7ns"
class AuthenticationHandler {
    async handle(context, next) {
        context.user = await authenticate(context.request);
        return next();
    }
}

class AuthorizationHandler {
    async handle(context, next) {
        if (!context.user) {
            throw new Error("Unauthenticated");
        }

        if (!context.user.canAccess) {
            throw new Error("Forbidden");
        }

        return next();
    }
}
```

The order matters because authorization depends on authentication having already established the user identity.

In security-sensitive systems, these controls should be enforced at actual security boundaries rather than relying
exclusively on an application-level chain.

## Logging and Metrics

Cross-cutting processing can be represented through chain handlers:

```js id="r3d8mj"
class LoggingHandler {
    async handle(context, next) {
        console.log("Request started");

        try {
            return await next();
        } finally {
            console.log("Request finished");
        }
    }
}
```

This resembles Decorator and middleware.

The distinguishing feature is that the request is explicitly being passed through a sequence of processing
responsibilities.

If the design instead wraps one stable component to add a reusable responsibility, Decorator may be the clearer
abstraction.

## Exception Handling

Chain of Responsibility is historically associated with passing requests through potential handlers, including
exception-like handling.

In JavaScript, native `try`/`catch` already provides structured exception handling:

```js id="f3x1cw"
try {
    execute();
} catch (error) {
    handleError(error);
}
```

A custom chain can be useful when different handlers should handle different categories of errors:

```js id="z8t6kv"
class ErrorHandler {
    #next;

    setNext(next) {
        this.#next = next;
        return next;
    }

    handle(error) {
        if (this.canHandle(error)) {
            return this.process(error);
        }

        return this.#next?.handle(error);
    }
}
```

However, introducing a custom chain around language-level exception handling is unnecessary unless the application has a
distinct responsibility-resolution requirement.

## Event Processing

Events can be passed through handlers when responsibility is conditional.

```js id="w8h4dc"
class PaymentEventHandler {
    handle(event) {
        if (event.type !== "payment.completed") {
            return false;
        }

        processPayment(event);
        return true;
    }
}
```

The chain can try handlers until one accepts the event.

However, this should not be confused with ordinary event broadcasting.

An event bus typically delivers an event to all interested subscribers.

A first-match Chain of Responsibility typically searches for the handler that should assume responsibility.

## Command Resolution

A chain can resolve commands dynamically.

```js id="v5n2rp"
class CreateUserHandler {
    handle(command) {
        if (command.type !== "create-user") {
            return undefined;
        }

        return createUser(command);
    }
}

class DeleteUserHandler {
    handle(command) {
        if (command.type !== "delete-user") {
            return undefined;
        }

        return deleteUser(command);
    }
}
```

The caller submits the command without selecting its concrete handler.

This can be useful when command resolution rules are expected to evolve independently from command producers.

## Fallback and Escalation

A chain can model progressively broader responsibility.

```js id="k7r5dy"
class LocalHandler {
    handle(request) {
        if (canHandleLocally(request)) {
            return handleLocally(request);
        }

        return this.next?.handle(request);
    }
}

class RegionalHandler {
    handle(request) {
        if (canHandleRegionally(request)) {
            return handleRegionally(request);
        }

        return this.next?.handle(request);
    }
}

class GlobalHandler {
    handle(request) {
        return handleGlobally(request);
    }
}
```

Each handler attempts responsibility before escalating.

This is a natural fit for systems where responsibility progressively moves to broader scopes.

## Chain Topology

A classic Chain of Responsibility is linear.

Each handler has at most one next handler:

```js id="b0w5nk"
handler.setNext(next);
```

More complex systems may use branching or graph-based routing.

Once handlers can select among multiple successors based on arbitrary routing rules, the design begins to resemble a
workflow engine, router, state machine, or decision graph rather than a straightforward Chain of Responsibility.

The pattern is strongest when responsibility flows through a relatively simple ordered sequence.

## Dynamic Chains

The chain can be changed at runtime.

```js id="t9y2wm"
chain
    .setNext(new ValidationHandler())
    .setNext(new ProcessingHandler());
```

A dynamic chain is useful when processing policy varies by:

* configuration;
* tenant;
* environment;
* request type;
* feature flags;
* deployment;
* runtime capabilities.

However, changing chains dynamically can complicate reasoning about behavior.

When chain structure is security-sensitive or operationally critical, immutable configuration is often preferable.

## Immutable Chain Construction

A chain can be represented as immutable composition.

```js id="c6m3sx"
const chain = [
    authenticate,
    authorize,
    validate,
    execute
];
```

The chain is then interpreted by a dispatcher:

```js id="p8r4ay"
async function executeChain(context, handlers) {
    for (const handler of handlers) {
        const result = await handler(context);

        if (result !== undefined) {
            return result;
        }
    }
}
```

This avoids mutable `setNext()` links and makes ordering explicit.

The implementation is different, but the underlying pattern can remain Chain of Responsibility when handlers are
responsible for deciding whether they will handle the request.

## Functional Implementation

JavaScript's functional style can express the pattern without classes.

```js id="e7w2vc"
const handlers = [
    request => request.type === "image"
        ? processImage(request)
        : undefined,

    request => request.type === "document"
        ? processDocument(request)
        : undefined,

    request => request.type === "audio"
        ? processAudio(request)
        : undefined
];

function handleRequest(request) {
    for (const handler of handlers) {
        const result = handler(request);

        if (result !== undefined) {
            return result;
        }
    }

    throw new Error("Unhandled request");
}
```

This is often a natural implementation in JavaScript.

The GoF pattern does not require classes. The essential structure is distributed responsibility and sequential
delegation.

## Async Chains

Handlers may perform asynchronous work:

```js id="a5v7kd"
class AuthenticationHandler {
    async handle(context, next) {
        context.user = await authenticate(context.request);

        return next();
    }
}
```

The chain must define whether handlers execute sequentially:

```js id="n8x2cp"
await next();
```

or whether some operations may run concurrently.

A first-match chain generally cannot evaluate handlers concurrently because ordering may determine which handler
receives responsibility.

A middleware-style chain can contain parallel work, but concurrency must be explicit because it changes the semantics of
the pipeline.

## Error Propagation

Errors can either terminate the chain or be handled by later infrastructure.

A simple chain:

```js id="v2r8hf"
handle(request)
{
    if (this.canHandle(request)) {
        return this.process(request);
    }

    return this.#next?.handle(request);
}
```

allows processing errors to propagate naturally.

A middleware-style chain can intercept errors:

```js id="h3w7xm"
async
handle(context, next)
{
    try {
        return await next();
    } catch (error) {
        return handleError(error);
    }
}
```

Error-handling behavior should be part of the chain contract.

Otherwise, different handlers may make incompatible assumptions about whether an error terminates processing.

## Return Values

A first-match chain needs a way to indicate that a handler did not handle the request.

One simple approach is `undefined`:

```js id="y5c9mj"
if (!this.canHandle(request)) {
    return this.#next?.handle(request);
}
```

Another is an explicit result:

```js id="j8p4cz"
return {
    handled: false
};
```

The explicit form avoids ambiguity when `undefined` is itself a valid processing result.

For example:

```js id="n7x2qa"
return {
    handled: true,
    value: undefined
};
```

A robust chain should define its handling-result contract explicitly.

## TypeScript

TypeScript can express a common handler contract:

```ts id="k4v6sb"
interface Handler<TRequest, TResult> {
    handle(request: TRequest): TResult | undefined;
}
```

A concrete handler can implement it:

```ts id="d3m9px"
class ImageHandler implements Handler<Request, Result> {
    handle(request: Request): Result | undefined {
        if (request.type !== "image") {
            return undefined;
        }

        return processImage(request);
    }
}
```

A chain can then operate over the common contract:

```ts id="u7q2mw"
class Chain<TRequest, TResult> {
    constructor(
        private readonly handlers: Handler<TRequest, TResult>[]
    ) {
    }

    handle(request: TRequest): TResult {
        for (const handler of this.handlers) {
            const result = handler.handle(request);

            if (result !== undefined) {
                return result;
            }
        }

        throw new Error("Unhandled request");
    }
}
```

Generics make the request and result contracts explicit while allowing different concrete handlers to participate in the
same chain.

## Middleware Types

Continuation-based middleware can be expressed explicitly:

```ts id="f6z1rk"
type Next = () => Promise<Response>;

type Middleware<TContext> = (
    context: TContext,
    next: Next
) => Promise<Response>;
```

This makes the distinction between first-match handlers and continuation-based middleware clearer.

First-match handlers answer:

```text
Can I handle this request?
```

Middleware answers:

```text
What should I do before and after the next handler?
```

Both can use sequential delegation, but their responsibilities are different.

## Chain of Responsibility and Decorator

Decorator and Chain of Responsibility can look almost identical structurally.

A Decorator wraps one component to add a responsibility:

```js id="n5w7se"
class LoggingService {
    constructor(service) {
        this.service = service;
    }

    execute(input) {
        console.log(input);
        return this.service.execute(input);
    }
}
```

The logging decorator is not deciding whether it owns the request. It always delegates while adding behavior.

A Chain of Responsibility handler may decide not to handle the request:

```js id="z4p6qh"
handle(request)
{
    if (this.canHandle(request)) {
        return this.process(request);
    }

    return this.next?.handle(request);
}
```

The key distinction is **augmentation versus responsibility selection**.

Decorator adds behavior to an existing component.

Chain of Responsibility determines which handler assumes responsibility.

## Chain of Responsibility and Proxy

Proxy controls access to a particular target.

```js id="v9k3df"
class ServiceProxy {
    execute(input) {
        authorize();
        return this.target.execute(input);
    }
}
```

Chain of Responsibility passes a request through multiple possible handlers:

```js id="x4c8mh"
firstHandler.handle(request);
```

A proxy generally has one target.

A chain has a sequence of potential handlers.

A proxy asks:

**How should access to this target be controlled?**

A chain asks:

**Which handler should take responsibility for this request?**

## Chain of Responsibility and Strategy

Strategy selects an algorithm explicitly or through configuration.

```js id="p2w7aj"
const strategy = strategies[paymentType];

strategy.calculate(order);
```

Chain of Responsibility tries handlers sequentially until one accepts responsibility.

Strategy is about interchangeable algorithms.

Chain of Responsibility is about distributed request handling.

If the selection mechanism is simply a deterministic mapping from a known key to one algorithm, a Strategy or registry
is often clearer than a chain.

## Chain of Responsibility and State

State changes an object's behavior based on its current state.

```js id="s8f5mc"
class Order {
    constructor(state) {
        this.state = state;
    }
}
```

Chain of Responsibility evaluates a request against multiple handlers.

A handler's position in a chain does not represent the object's current state.

State is about behavioral variation over lifecycle state.

Chain of Responsibility is about responsibility distribution.

## Chain of Responsibility and Mediator

Mediator centralizes communication among multiple objects.

```js id="c7m4xb"
class Mediator {
    notify(sender, event) {
        // Coordinate participants.
    }
}
```

Chain of Responsibility decentralizes responsibility across handlers.

The sender submits the request to the first handler and handlers decide whether to continue.

Mediator asks:

**How should these participants communicate?**

Chain of Responsibility asks:

**Which participant should handle this request?**

## Chain of Responsibility and Command

Command encapsulates a request as an object.

```js id="q1w8vz"
class CreateUserCommand {
    constructor(data) {
        this.data = data;
    }
}
```

Chain of Responsibility determines which handler processes a request.

They are frequently combined.

A command can travel through a chain of authorization, validation, logging, and execution handlers.

Command represents the request.

Chain of Responsibility determines how responsibility for that request is distributed.

## Chain of Responsibility and Composite

Composite represents recursive part-whole structures.

A chain is usually a linear sequence of handlers.

A composite may contain many children and recursively apply operations to them.

A chain can be implemented using linked objects, but that does not make it a Composite.

The defining concern remains sequential responsibility delegation.

## Chain of Responsibility and Iterator

Iterator provides sequential traversal over a collection.

```js id="b6z3nj"
for (const handler of handlers) {
    // Traverse handler.
}
```

A chain may happen to traverse handlers sequentially, but it is not an Iterator.

Iterator exposes traversal of a collection.

Chain of Responsibility defines the semantics of request handling during traversal.

## Chain of Responsibility and Visitor

Visitor separates operations from object structures by dispatching behavior based on object types.

Chain of Responsibility selects a handler based on whether that handler accepts the request.

Visitor generally knows the structure being visited.

Chain of Responsibility intentionally allows the sender to remain unaware of which handler will assume responsibility.

## Request Routing

Chain of Responsibility can resemble routing:

```js id="f5v2ya"
handlerA
handlerB
handlerC
```

However, a dedicated router is often preferable when routing is deterministic:

```js id="n9r4zc"
const handlers = {
    image: imageHandler,
    document: documentHandler,
    audio: audioHandler
};
```

A chain is more appropriate when handlers independently decide whether they can handle the request, when ordering
matters, or when responsibility can evolve incrementally.

A map or registry is usually simpler when the request contains an explicit routing key.

## Dependency Injection

Chains are natural candidates for dependency injection.

```js id="m7x3qp"
class RequestPipeline {
    constructor(handlers) {
        this.handlers = handlers;
    }

    async handle(request) {
        for (const handler of this.handlers) {
            const result = await handler.handle(request);

            if (result !== undefined) {
                return result;
            }
        }

        throw new Error("Unhandled request");
    }
}
```

The container can provide the handler sequence.

This separates chain composition from handler implementation.

The chain's order becomes configuration rather than hard-coded construction logic.

## Configuration

Chain order is often configuration.

For example:

```js id="k2w5fd"
const handlers = [
    authenticationHandler,
    authorizationHandler,
    validationHandler,
    businessHandler
];
```

A configuration-driven chain can vary between deployments or contexts.

However, configuration should not be allowed to produce invalid security or processing orders accidentally.

When ordering is semantically constrained, those constraints should be represented explicitly rather than left entirely
to configuration.

## Testing

Each handler should be testable independently.

```js id="w4n8cz"
const handler = new AuthenticationHandler();

await expect(
    handler.handle(validContext, next)
).resolves.toEqual(expectedResult);
```

The chain should also be tested as a composition.

For first-match chains, verify that:

* the correct handler handles the request;
* earlier non-matching handlers delegate;
* later handlers are not invoked after successful handling;
* unresolved requests produce the expected fallback behavior.

For middleware-style chains, verify that:

* handlers execute in the expected order;
* `next()` is called correctly;
* short-circuiting works;
* errors propagate or are intercepted as designed;
* before/after behavior occurs in the intended order.

## Observability

Long chains can make request execution difficult to trace.

A request may pass through many handlers before being processed or rejected.

Useful observability information includes:

* handler name;
* execution duration;
* handling decision;
* rejection reason;
* chain termination point;
* downstream result.

However, logging every handler can produce excessive noise.

Observability should make the chain's decision path understandable without overwhelming normal application logs.

## Performance

A first-match chain has traversal cost proportional to the number of handlers evaluated before the request is handled.

If there are `n` handlers and the matching handler is near the end, up to `n` handler checks may occur.

For small chains this is generally negligible.

For very large handler collections, a registry, map, trie, indexed dispatch table, or other direct-selection mechanism
may be more appropriate.

Do not use a chain merely because it is flexible when deterministic indexing can provide simpler and faster dispatch.

## Long Chains

Long chains can become difficult to reason about.

A chain containing dozens of handlers may create:

* hidden dependencies between handlers;
* difficult ordering constraints;
* unpredictable latency;
* complicated failure paths;
* difficult debugging;
* unclear ownership of the final result.

If the chain becomes a complete application workflow, it may be better modeled as an explicit workflow or orchestration
component.

Chain of Responsibility is strongest when each handler has a relatively small and well-defined responsibility.

## Stateful Handlers

Handlers may contain state:

```js id="a3v9hx"
class RateLimitHandler {
    #requests = new Map();

    handle(request) {
        // Update rate-limit state.
    }
}
```

This introduces lifecycle questions.

If the handler is shared across requests, its state must be safe for concurrent use.

If each request gets a new handler instance, state is isolated but object creation increases.

Dependency-injection scope should therefore be chosen according to the handler's state semantics.

## Reentrancy

Handlers should be careful when they recursively invoke the chain.

```js id="j5c8qy"
handle(request)
{
    return this.next.handle(transform(request));
}
```

This is normal delegation.

But a handler that accidentally sends the same request back into an earlier handler can create cycles.

For example:

```js id="r7m2wd"
handlerA -> handlerB -> handlerA
```

A chain should generally have a well-defined direction and termination condition.

## Cycles

A mutable chain can accidentally contain a cycle:

```js id="u4x9kp"
a.setNext(b);
b.setNext(a);
```

A request can then recurse indefinitely.

If chains are configured dynamically, construction-time validation can detect cycles.

Immutable array-based chains naturally avoid linked-list cycles because their topology is explicit.

## Resource Ownership

Handlers that allocate resources must define whether those resources belong to the handler, the request, or the broader
application.

For asynchronous handlers:

```js id="c9w5jt"
async
handle(context, next)
{
    const connection = await acquireConnection();

    try {
        return await next();
    } finally {
        await connection.release();
    }
}
```

This is useful for scoped resources because the handler can establish and clean up a resource around downstream
execution.

Resource ownership should remain explicit, especially when several handlers wrap one another.

## Transaction Boundaries

A chain may establish transactional scope:

```js id="x6k2mq"
async
handle(context, next)
{
    const transaction = await beginTransaction();

    try {
        const result = await next();

        await transaction.commit();

        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
```

This resembles middleware because the handler surrounds downstream execution.

Transaction scope should be placed at the architectural boundary where transactional consistency is actually required.

A chain does not automatically make multiple operations transactional.

## Cancellation

Long-running asynchronous chains should support cancellation when required.

```js id="e8p3vz"
async
handle(context, next)
{
    if (context.signal.aborted) {
        throw new DOMException(
            "Operation aborted",
            "AbortError"
        );
    }

    return next();
}
```

Each handler should respect the cancellation contract rather than assuming that cancellation automatically stops
downstream work.

## Common Misuse

Do not use Chain of Responsibility when the handler can be selected directly.

If the request contains:

```js id="x7m5ra"
request.type
```

and the mapping is stable:

```js id="y3n8kc"
const handlers = {
    image: imageHandler,
    document: documentHandler
};
```

a registry or map is often clearer.

Do not use a chain merely to execute a fixed sequence of operations. If every handler always runs and there is no
responsibility-selection semantics, a straightforward pipeline may communicate the design better.

Do not use a chain to hide complex workflow orchestration.

If the sequence represents a business process with explicit branching, compensation, retries, persistence, and lifecycle
semantics, a workflow or orchestration model may be more appropriate.

## Hidden Ordering Dependencies

A chain becomes problematic when handlers silently depend on one another.

For example:

```js id="n2q7wc"
handlerA
adds
context.user
handlerB
assumes
context.user
exists
handlerC
assumes
handlerB
already
normalized
the
request
```

The chain may work, but the dependency is implicit.

Handlers should document or encode required preconditions where practical.

If dependencies become extensive, explicit orchestration may be clearer than a loosely coupled chain.

## Security Ordering

Security-sensitive chains require particular care.

For example:

```js id="p8m4yd"
authentication
authorization
business
logic
```

is fundamentally different from:

```js id="e6x9ka"
business
logic
authorization
```

If the business logic can expose sensitive information before authorization executes, the chain is insecure regardless
of how well each individual handler is implemented.

Security constraints should therefore be treated as architectural invariants.

## Refactoring Toward Chain of Responsibility

A common refactoring starts with a large conditional dispatcher:

```js id="j3v7qx"
function handle(request) {
    if (isImage(request)) {
        return handleImage(request);
    }

    if (isDocument(request)) {
        return handleDocument(request);
    }

    if (isAudio(request)) {
        return handleAudio(request);
    }

    throw new Error("Unsupported request");
}
```

If each branch represents an independently evolving responsibility, handlers can be extracted:

```js id="m9c2wf"
const handlers = [
    imageHandler,
    documentHandler,
    audioHandler
];

function handle(request) {
    for (const handler of handlers) {
        const result = handler.handle(request);

        if (result !== undefined) {
            return result;
        }
    }

    throw new Error("Unsupported request");
}
```

The caller no longer owns the complete dispatch logic.

New handlers can be added without expanding one central conditional.

## Recognizing a Chain Opportunity

Look for:

* repeated conditional responsibility selection;
* multiple possible handlers for the same request;
* handlers that can independently decide whether they apply;
* progressively broader fallback behavior;
* request-processing stages that can short-circuit;
* policies that need configurable ordering;
* duplicated dispatch logic across consumers.

The strongest signal is that **the sender should submit the request without knowing which handler should ultimately take
responsibility**.

## Benefits

Chain of Responsibility reduces coupling between request senders and concrete handlers.

Handlers can be added, removed, reordered, or replaced without changing request-producing code.

Each handler can encapsulate one responsibility.

Processing can terminate early when a handler accepts or rejects the request.

Fallback and escalation behavior can be modeled naturally.

Chains can be assembled dynamically or through dependency injection.

The pattern works well with synchronous and asynchronous processing.

Functional JavaScript can implement the pattern without requiring class hierarchies.

## Costs

Request processing can become difficult to trace when chains become long.

Handler ordering can become semantically significant.

A request may traverse many handlers before being processed.

Unresolved requests require explicit fallback behavior.

Shared state inside handlers can introduce lifecycle and concurrency concerns.

Implicit dependencies between handlers can undermine the intended decoupling.

A chain can be unnecessarily complex when direct dispatch, a registry, or a simple pipeline would be clearer.

## Decision Criteria

Use Chain of Responsibility when:

* multiple objects may handle a request;
* the sender should not select the handler;
* handlers can independently determine whether they apply;
* responsibility may change as the chain evolves;
* ordering of responsibility matters;
* fallback or escalation is meaningful;
* handlers should be independently composable;
* processing may terminate before the end of the chain.

Prefer direct dispatch, a registry, or a map when the correct handler is directly identifiable from a stable key.

Prefer a simple pipeline when every processing stage always executes and responsibility selection is not involved.

Prefer Decorator when the primary goal is adding reusable behavior around a component rather than selecting
responsibility.

Prefer Strategy when the primary concern is selecting among interchangeable algorithms.

Prefer Mediator when the primary concern is coordinating communication among multiple participants.

Prefer an explicit workflow or orchestration model when the sequence represents a complex business process rather than
request-handler responsibility.

## Summary

Chain of Responsibility passes a request through a sequence of handlers until one handler assumes responsibility or the
chain is exhausted.

The sender depends on the chain rather than on a particular concrete handler.

Each handler decides whether it can process the request and otherwise delegates to the next handler.

The pattern is especially useful for dynamic responsibility selection, fallback and escalation, validation chains,
command resolution, request filtering, and middleware-like processing.

Its key distinctions are:

* **Chain of Responsibility** distributes responsibility for handling a request across sequential handlers.
* **Decorator** adds responsibilities to an existing component.
* **Proxy** controls access to a particular target.
* **Strategy** encapsulates interchangeable algorithms.
* **Mediator** centralizes communication among participants.
* **Command** encapsulates a request rather than determining which handler processes it.

The essential design rule is:

**When the sender should submit a request without knowing which object should handle it, and multiple handlers can
independently decide whether to assume responsibility, use a Chain of Responsibility.**

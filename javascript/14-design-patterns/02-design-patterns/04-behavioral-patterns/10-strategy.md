# Strategy

The Strategy pattern defines a family of interchangeable algorithms, encapsulates each algorithm behind a common
contract, and allows the algorithm used by a Context to vary independently from the Context itself.

Strategy separates **what operation is being performed** from **how that operation is performed**. The Context owns the
overall responsibility and delegates a variable part of that responsibility to a Strategy.

The central idea is:

**Encapsulate an algorithm or policy behind a common interface so that the Context can use different implementations
without changing its core logic.**

## Intent

Strategy is used when multiple algorithms or policies can perform the same conceptual operation and the choice between
them should be isolated from the code that uses them.

The pattern is useful when:

* Several algorithms solve the same conceptual problem.
* The algorithm may vary at runtime.
* Algorithms should be independently replaceable.
* A Context should not contain a growing collection of algorithm-specific conditionals.
* New algorithms should be addable without modifying the Context.
* Different environments or configurations require different policies.
* The algorithm needs to be tested independently from the Context.

Strategy is fundamentally about **encapsulating variation in an algorithm or policy**.

## Problem

Consider a shipping service that calculates shipping cost differently depending on the selected shipping method:

```js
class ShippingCalculator {
    calculate(order, method) {
        if (method === "standard") {
            return order.weight * 2;
        }

        if (method === "express") {
            return order.weight * 5 + 10;
        }

        if (method === "overnight") {
            return order.weight * 10 + 25;
        }

        throw new Error(`Unknown shipping method: ${method}`);
    }
}
```

This works while the number of algorithms is small.

As more algorithms are introduced, the Context accumulates conditional logic:

```js
if (method === "standard") {
    // ...
} else if (method === "express") {
    // ...
} else if (method === "overnight") {
    // ...
} else if (method === "international") {
    // ...
} else if (method === "pickup") {
    // ...
}
```

The Context now knows the details of every shipping algorithm.

Strategy extracts those algorithms into independent implementations:

```js
class StandardShipping {
    calculate(order) {
        return order.weight * 2;
    }
}

class ExpressShipping {
    calculate(order) {
        return order.weight * 5 + 10;
    }
}

class OvernightShipping {
    calculate(order) {
        return order.weight * 10 + 25;
    }
}
```

The Context delegates the variable behavior:

```js
class ShippingCalculator {
    constructor(strategy) {
        this.strategy = strategy;
    }

    calculate(order) {
        return this.strategy.calculate(order);
    }
}
```

The algorithm can then be selected externally:

```js
const calculator = new ShippingCalculator(
    new ExpressShipping()
);

calculator.calculate(order);
```

The Context no longer contains the implementation details of the shipping algorithms.

## Structure

The traditional Strategy pattern has three primary participants.

### Context

The **Context** defines the operation that the client wants to perform and delegates the variable portion of that
operation to a Strategy.

```js
class SortService {
    constructor(strategy) {
        this.strategy = strategy;
    }

    sort(items) {
        return this.strategy.sort(items);
    }
}
```

The Context may perform work before or after the Strategy:

```js
class ReportService {
    constructor(strategy) {
        this.strategy = strategy;
    }

    generate(data) {
        const preparedData = this.prepare(data);
        const result = this.strategy.generate(preparedData);

        return this.finalize(result);
    }
}
```

The Strategy owns the algorithmic variation, while the Context retains the surrounding responsibility.

### Strategy

The **Strategy** defines the common contract for the interchangeable algorithms.

In JavaScript, this can be an informal interface:

```js
class SortStrategy {
    sort(items) {
        throw new Error("Not implemented");
    }
}
```

Or simply a convention:

```js
const strategy = {
    sort(items) {
        // ...
    }
};
```

### Concrete Strategy

A **Concrete Strategy** implements one algorithm or policy.

```js
class QuickSortStrategy {
    sort(items) {
        // Quick sort implementation.
    }
}

class MergeSortStrategy {
    sort(items) {
        // Merge sort implementation.
    }
}
```

Both satisfy the same conceptual contract but use different implementations.

## Algorithm Encapsulation

The most important responsibility of Strategy is isolating algorithmic variation.

Without Strategy:

```js
class Compressor {
    compress(data, format) {
        if (format === "gzip") {
            // gzip algorithm
        } else if (format === "brotli") {
            // Brotli algorithm
        }
    }
}
```

With Strategy:

```js
class GzipCompressor {
    compress(data) {
        // gzip
    }
}

class BrotliCompressor {
    compress(data) {
        // Brotli
    }
}
```

The Context can operate against either implementation:

```js
class Compressor {
    constructor(strategy) {
        this.strategy = strategy;
    }

    compress(data) {
        return this.strategy.compress(data);
    }
}
```

The algorithm becomes an independent unit of change.

## Policy as Strategy

Strategy is not limited to computational algorithms.

A **policy** can also be a Strategy when the policy determines how a Context performs an operation.

Examples include:

* Pricing policy.
* Discount policy.
* Authorization policy.
* Retry policy.
* Routing policy.
* Serialization policy.
* Scheduling policy.
* Validation policy.
* Resource allocation policy.
* Cache eviction policy.

For example:

```js
class PricingService {
    constructor(pricingPolicy) {
        this.pricingPolicy = pricingPolicy;
    }

    calculate(product, customer) {
        return this.pricingPolicy.calculate(product, customer);
    }
}
```

The Context owns pricing as a responsibility; the Strategy owns the variable pricing policy.

## Runtime Strategy Selection

A Strategy can be selected at runtime:

```js
const strategies = {
    standard: new StandardShipping(),
    express: new ExpressShipping(),
    overnight: new OvernightShipping()
};

const strategy = strategies[shippingMethod];

const calculator = new ShippingCalculator(strategy);
```

The selection mechanism is separate from the Strategy implementations.

This is useful when the algorithm depends on:

* Configuration.
* User selection.
* Environment.
* Feature flags.
* Tenant configuration.
* Runtime capabilities.
* Input characteristics.
* Deployment conditions.

The selection logic itself should not necessarily be placed inside the Strategy.

## Changing Strategy

The Context may allow the Strategy to change:

```js
class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    process(payment) {
        return this.strategy.process(payment);
    }
}
```

This permits:

```js
processor.setStrategy(new CardPaymentStrategy());
processor.process(payment);

processor.setStrategy(new BankTransferStrategy());
processor.process(payment);
```

Runtime replacement is useful when the algorithm genuinely needs to change during the Context's lifetime.

It is unnecessary when the Strategy is fixed for the lifetime of the Context. In that case, constructor injection can
provide a simpler and stronger invariant.

## Constructor Injection

A Context can receive its Strategy through its constructor:

```js
class TaxCalculator {
    constructor(strategy) {
        this.strategy = strategy;
    }

    calculate(order) {
        return this.strategy.calculate(order);
    }
}
```

This establishes the Strategy as a required dependency.

It also makes the Context easier to test:

```js
const calculator = new TaxCalculator({
    calculate() {
        return 42;
    }
});
```

Constructor injection is generally preferable when the Context cannot meaningfully operate without a Strategy.

## Setter Injection

A setter can be appropriate when changing Strategy is part of normal runtime behavior:

```js
class Renderer {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    render(data) {
        return this.strategy.render(data);
    }
}
```

However, a mutable Strategy dependency weakens the invariant that the Context always has one stable algorithm.

The API should therefore make runtime replacement explicit when it is actually required.

## Function-Based Strategies

JavaScript functions are often more natural Strategies than classes.

For example:

```js
function calculateTotal(order, pricingStrategy) {
    return pricingStrategy(order);
}
```

Strategies can simply be functions:

```js
const standardPricing = order => order.total;

const discountedPricing = order =>
    order.total * 0.9;
```

Usage:

```js
calculateTotal(order, discountedPricing);
```

This is still Strategy when the function represents an interchangeable algorithm or policy.

The GoF pattern does not require classes.

## Higher-Order Functions

Higher-order functions make Strategy especially compact:

```js
function process(items, algorithm) {
    return algorithm(items);
}
```

Different algorithms can be passed directly:

```js
process(items, items => items.sort());
process(items, items => items.toReversed());
```

The important question is whether the argument represents a variable algorithm that the Context delegates to.

A one-off callback is not automatically a Strategy. Strategy describes a deliberate separation of interchangeable
algorithmic behavior.

## Closures as Strategies

A closure can encapsulate algorithm-specific configuration:

```js
function createThresholdStrategy(threshold) {
    return value => value >= threshold;
}
```

Different strategies can then be created:

```js
const strictStrategy = createThresholdStrategy(100);
const relaxedStrategy = createThresholdStrategy(50);
```

This can be preferable to creating classes when the Strategy consists primarily of a function and private configuration.

## Strategy Objects

Object literals are another natural JavaScript representation:

```js
const ascendingStrategy = {
    compare(a, b) {
        return a - b;
    }
};

const descendingStrategy = {
    compare(a, b) {
        return b - a;
    }
};
```

The Context can depend on the contract rather than the object's concrete type:

```js
function sort(items, strategy) {
    return [...items].sort(strategy.compare);
}
```

This uses JavaScript's structural nature effectively.

## TypeScript

TypeScript can make the Strategy contract explicit:

```ts
interface PricingStrategy {
    calculate(order: Order): number;
}
```

Concrete strategies implement it:

```ts
class StandardPricing implements PricingStrategy {
    calculate(order: Order): number {
        return order.total;
    }
}

class DiscountPricing implements PricingStrategy {
    calculate(order: Order): number {
        return order.total * 0.9;
    }
}
```

The Context depends on the abstraction:

```ts
class PricingService {
    constructor(
        private readonly strategy: PricingStrategy
    ) {
    }

    calculate(order: Order): number {
        return this.strategy.calculate(order);
    }
}
```

A function type is often even simpler:

```ts
type PricingStrategy = (order: Order) => number;

function calculatePrice(
    order: Order,
    strategy: PricingStrategy
): number {
    return strategy(order);
}
```

TypeScript's structural typing means unrelated classes can satisfy the same Strategy contract without sharing an
inheritance hierarchy.

## Generic Strategies

Strategies can be generic when the algorithm operates over different data types:

```ts
interface Comparator<T> {
    compare(a: T, b: T): number;
}
```

A generic Context can then consume the Strategy:

```ts
function sortWith<T>(
    items: T[],
    comparator: Comparator<T>
): T[] {
    return [...items].sort(
        (a, b) => comparator.compare(a, b)
    );
}
```

This allows the algorithm abstraction to remain reusable without sacrificing type safety.

## Strategy and Context Responsibilities

A common design mistake is moving too much responsibility into the Strategy.

The Context should generally own the stable workflow surrounding the variable algorithm.

For example:

```js
class Checkout {
    constructor(paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    checkout(order) {
        this.validate(order);
        const result = this.paymentStrategy.pay(order);
        this.recordResult(result);

        return result;
    }
}
```

The Strategy determines how payment is performed.

The Context still owns validation and recording because those responsibilities are part of the stable checkout workflow.

If the Strategy starts controlling validation, persistence, notification, logging, and unrelated lifecycle operations,
it is no longer simply encapsulating the variable algorithm.

## Strategy Granularity

A Strategy should represent a meaningful unit of variation.

Too large:

```js
class EverythingStrategy {
    execute(context) {
        // validation
        // persistence
        // logging
        // notification
        // payment
        // reporting
    }
}
```

This merely moves the entire Context into another object.

Too small:

```js
const additionStrategy = a => a + 1;
```

may provide little value if the operation is trivial and never varies independently.

The useful boundary is where an algorithm or policy represents a coherent dimension of change.

## Multiple Strategies

A Context may use more than one Strategy:

```js
class OrderProcessor {
    constructor(
        pricingStrategy,
        shippingStrategy,
        taxStrategy
    ) {
        this.pricingStrategy = pricingStrategy;
        this.shippingStrategy = shippingStrategy;
        this.taxStrategy = taxStrategy;
    }
}
```

Each Strategy represents an independent dimension of variation.

This can be useful when pricing, tax, and shipping policies vary independently.

However, too many Strategy dependencies can make the Context difficult to construct and understand. If every small
operation becomes a Strategy, the design may be over-factored.

## Strategy Composition

Strategies can themselves be composed:

```js
const withDiscount =
    pricing =>
        order =>
            pricing(order) * 0.9;

const withTax =
    pricing =>
        order =>
            pricing(order) * 1.2;
```

A base Strategy can be wrapped:

```js
const pricing = withTax(
    withDiscount(
        basePricing
    )
);
```

This combines Strategy-like algorithm selection with functional composition.

The distinction from Decorator is important: the functions here represent composable algorithms or policies. Decorator
specifically wraps an object implementing a common component contract to add responsibilities around it.

## Strategy Selection

The Strategy should generally not be responsible for selecting itself.

Avoid:

```js
class PricingStrategy {
    select(customer) {
        if (customer.isPremium) {
            return new PremiumStrategy();
        }

        return new StandardStrategy();
    }
}
```

This mixes algorithm implementation with algorithm selection.

A factory, configuration layer, dependency-injection container, or application service can make the selection:

```js
function createPricingStrategy(customer) {
    if (customer.isPremium) {
        return new PremiumStrategy();
    }

    return new StandardStrategy();
}
```

The Context then receives the selected Strategy.

Selection and implementation are separate concerns.

## Strategy and Configuration

Configuration can determine which Strategy is used:

```js
const strategy = strategyRegistry[config.pricingModel];

const service = new PricingService(strategy);
```

This allows deployment or environment configuration to alter behavior without modifying the Context.

However, configuration should not be used to obscure domain rules. If a Strategy choice is a business decision that
requires validation, authorization, or contextual logic, that selection belongs in an appropriate application or domain
boundary.

## Strategy and Dependency Injection

Strategy is naturally compatible with dependency injection.

The Context depends on an abstraction:

```js
class ExportService {
    constructor(formatStrategy) {
        this.formatStrategy = formatStrategy;
    }

    export(data) {
        return this.formatStrategy.format(data);
    }
}
```

The composition root decides which implementation to provide:

```js
const service = new ExportService(
    new JsonExportStrategy()
);
```

This keeps implementation selection outside the Context.

## Strategy and Open/Closed Principle

Strategy can support the Open/Closed Principle by allowing new algorithms to be introduced as new implementations rather
than by repeatedly modifying a Context.

For example:

```js
class JsonFormatter {
    format(data) {
        return JSON.stringify(data);
    }
}

class CsvFormatter {
    format(data) {
        // ...
    }
}
```

The Context remains unchanged:

```js
class Exporter {
    constructor(formatter) {
        this.formatter = formatter;
    }

    export(data) {
        return this.formatter.format(data);
    }
}
```

Adding `XmlFormatter` does not require changing `Exporter`.

This benefit depends on a stable Strategy contract. If every new Strategy requires changes to the Context, the
abstraction boundary has not successfully isolated the variation.

## Strategy and Encapsulation

A Strategy should encapsulate the implementation details of its algorithm.

The Context should interact through the Strategy contract:

```js
strategy.calculate(input);
```

rather than depending on implementation-specific operations:

```js
if (strategy.type === "advanced") {
    strategy.prepareAdvancedMode();
}
```

Once the Context starts inspecting concrete Strategy types, the abstraction has weakened.

## Strategy and Return Values

Strategies should normally share compatible result semantics.

For example:

```js
interface
DiscountStrategy
{
    calculate(order
:
    Order
):
    number;
}
```

A Strategy returning a number and another returning an unrelated object do not form a coherent Strategy family unless
the contract explicitly permits that variation.

A common interface is not merely a shared method name. It should define compatible input, output, side-effect, error,
and lifecycle semantics.

## Strategy and Errors

Strategies should have predictable error semantics.

For example:

```js
class CardPaymentStrategy {
    async pay(payment) {
        // May throw PaymentError.
    }
}
```

If another Strategy silently returns failure while the first throws exceptions, the Context must handle two incompatible
contracts.

The Strategy abstraction should therefore define whether failure is represented by:

* Exceptions.
* Result objects.
* Rejected promises.
* Status values.
* Domain-specific error types.

Different algorithms may fail for different reasons, but their failure contract should remain compatible.

## Strategy and Asynchronous Algorithms

Strategies can be asynchronous:

```js
class RemotePricingStrategy {
    async calculate(order) {
        const result = await fetchPricing(order);
        return result.total;
    }
}
```

The Context can depend on an asynchronous contract:

```js
class PricingService {
    constructor(strategy) {
        this.strategy = strategy;
    }

    async calculate(order) {
        return this.strategy.calculate(order);
    }
}
```

All Strategies should follow compatible asynchronous semantics.

A Context should not have to determine whether a particular Strategy returns a value or a Promise.

## Strategy and Cancellation

Long-running Strategies may need cancellation:

```js
class SearchStrategy {
    async search(query, signal) {
        return performSearch(query, {signal});
    }
}
```

The Context can define cancellation as part of the Strategy contract:

```js
await strategy.search(query, signal);
```

Cancellation should be part of the abstraction when different Strategies are expected to support it.

Otherwise, a Context that assumes cancellation exists may not be substitutable with every Strategy.

## Strategy and Side Effects

Strategies can be pure algorithms:

```js
const calculateDiscount = order =>
    order.total * 0.9;
```

or side-effecting policies:

```js
class PaymentStrategy {
    async pay(payment) {
        return gateway.charge(payment);
    }
}
```

The Strategy contract should make side effects explicit.

A Context should not assume that a Strategy is pure if some implementations perform network calls, persistence, logging,
or other external operations.

## Strategy and State

Strategy and State are among the most easily confused design patterns because both use composition and polymorphism.

Strategy represents **interchangeable algorithms or policies**.

State represents **behavior that changes because the Context itself has entered a different state**.

For Strategy:

```js
calculator.setStrategy(new ProgressiveTaxStrategy());
```

The application chooses an algorithm.

For State:

```js
connection.setState(new ConnectedState());
```

The Context's lifecycle has changed, and its behavior changes accordingly.

A Strategy is normally selected because the application wants a particular algorithm.

A State is normally selected because the Context is now in a different condition.

## Strategy Versus Template Method

Template Method uses inheritance to define an algorithm skeleton while allowing subclasses to override selected steps.

Strategy uses composition to replace an algorithm or policy.

Template Method:

```js
class Report {
    generate() {
        this.load();
        this.transform();
        this.render();
    }

    load() {
    }

    transform() {
    }

    render() {
    }
}
```

Strategy:

```js
class Report {
    constructor(formatStrategy) {
        this.formatStrategy = formatStrategy;
    }

    generate(data) {
        return this.formatStrategy.format(data);
    }
}
```

Template Method variation is structurally tied to a class hierarchy.

Strategy variation can be changed by replacing a composed object or function.

## Strategy Versus State

State can change which implementation is active because the Context has transitioned.

Strategy can change which implementation is active because the algorithm or policy selection has changed.

The implementations may look identical:

```js
class A {
    execute(context) {
    }
}

class B {
    execute(context) {
    }
}
```

The pattern cannot be identified solely from the code structure.

The key question is whether the implementations represent **alternative algorithms** or **different behavioral states of
the Context**.

## Strategy Versus Bridge

Bridge separates two independently varying dimensions of abstraction and implementation.

Strategy usually encapsulates one dimension of algorithmic variation.

For example, a rendering system might use Bridge to separate a high-level renderer abstraction from platform-specific
rendering implementations, while Strategy selects a particular layout algorithm.

The two patterns can coexist when the system has independent dimensions of change.

## Strategy Versus Adapter

Adapter translates an existing incompatible interface into the interface expected by a client.

Strategy does not primarily translate interfaces. It provides an alternative implementation of an already-compatible
contract.

An Adapter answers:

**How can this existing component satisfy the interface I already need?**

A Strategy answers:

**Which compatible algorithm should perform this operation?**

## Strategy Versus Decorator

Decorator wraps an object and adds responsibilities while preserving a compatible component interface.

Strategy replaces the algorithm used to perform an operation.

For example:

```js
const compressed = new CompressionDecorator(service);
```

adds behavior around `service`.

By contrast:

```js
const service = new Service(new CompressionStrategy());
```

selects the algorithm used by `Service`.

The difference is **responsibility augmentation versus algorithm substitution**.

## Strategy Versus Command

Command encapsulates a request or operation.

Strategy encapsulates an algorithm for performing a conceptual operation.

A Command might represent:

```js
new SendEmailCommand(message)
```

while a Strategy might determine:

```js
new EmailDeliveryStrategy()
```

The Command represents what operation should be executed. The Strategy represents how a particular operation is
performed.

They can be combined.

## Strategy Versus Chain of Responsibility

Chain of Responsibility distributes responsibility across a sequence of handlers.

Strategy selects one algorithm or policy.

A Chain may invoke multiple handlers:

```js
handler1.handle(request);
handler2.handle(request);
```

A Strategy normally provides one selected implementation:

```js
strategy.execute(request);
```

The fundamental distinction is **responsibility routing versus algorithm selection**.

## Strategy Versus Observer

Observer distributes notifications to interested consumers.

Strategy provides an algorithm that the Context actively invokes.

An Observer generally reacts because a subject changed.

A Strategy generally executes because the Context needs an algorithm.

## Strategy and Native JavaScript Methods

JavaScript's standard library already provides many algorithm-selection mechanisms.

For example:

```js
items.sort(compare);
```

The `compare` function is effectively an algorithmic policy supplied by the caller.

Likewise:

```js
items.map(transform);
items.filter(predicate);
items.reduce(reducer, initialValue);
```

These APIs accept interchangeable behavior as functions.

This does not mean every callback is formally a GoF Strategy, but it demonstrates that JavaScript naturally supports the
core mechanism through first-class functions.

## Strategy and Array Operations

Higher-order array methods often provide Strategy-like extension points.

For example:

```js
const activeUsers = users.filter(
    user => user.active
);
```

The filtering operation is fixed while the predicate varies.

Similarly:

```js
const sorted = users.toSorted(
    (a, b) => a.name.localeCompare(b.name)
);
```

The sorting mechanism remains stable while the comparison policy varies.

The Strategy concept therefore appears throughout idiomatic JavaScript without requiring explicit Strategy classes.

## Strategy and Dependency Inversion

Strategy can reduce coupling by ensuring that the Context depends on a behavioral abstraction rather than a concrete
algorithm.

```js
class Validator {
    constructor(strategy) {
        this.strategy = strategy;
    }

    validate(input) {
        return this.strategy.validate(input);
    }
}
```

The Context does not depend on `EmailValidator`, `PhoneValidator`, or `PostalCodeValidator`.

This can also make testing easier because a deterministic Strategy can be injected.

## Strategy and Testing

Strategy naturally supports isolated algorithm testing.

A Concrete Strategy can be tested independently:

```js
const strategy = new DiscountStrategy();

expect(
    strategy.calculate(order)
).toBe(expected);
```

The Context can separately be tested with a fake Strategy:

```js
const strategy = {
    calculate() {
        return 100;
    }
};

const service = new PricingService(strategy);
```

The test can then focus on whether the Context invokes the Strategy correctly and handles its result appropriately.

## Strategy as a Test Seam

A Strategy can be useful as an explicit test seam when an operation normally depends on nondeterministic behavior.

For example:

```js
class TokenService {
    constructor(randomStrategy) {
        this.randomStrategy = randomStrategy;
    }

    generate() {
        return this.randomStrategy.generate();
    }
}
```

A production implementation can use cryptographically secure randomness, while a deterministic test Strategy can provide
predictable results.

The abstraction is justified when the variability represents a meaningful policy or implementation boundary rather than
merely because testing is difficult.

## Strategy and Performance

Strategy introduces an additional dispatch step:

```js
this.strategy.execute(input);
```

For ordinary application code, this overhead is usually negligible.

The more important performance consideration is whether different Strategies have substantially different computational
characteristics.

For example:

* One sorting Strategy may be `O(n log n)`.
* Another may be `O(n²)`.
* One pricing Strategy may be local.
* Another may require a network call.
* One serialization Strategy may allocate heavily.
* Another may stream output.

The Strategy contract should therefore make performance-relevant behavior clear when it materially affects the Context.

## Strategy and Caching

A Strategy may internally cache results:

```js
class CachedPricingStrategy {
    #cache = new Map();

    calculate(order) {
        if (this.#cache.has(order.id)) {
            return this.#cache.get(order.id);
        }

        const result = this.calculateFresh(order);

        this.#cache.set(order.id, result);

        return result;
    }
}
```

Caching is not inherent to Strategy.

The cache belongs to the Strategy only when caching is part of that algorithm's implementation or policy.

If caching is a cross-cutting responsibility that should apply independently to any Strategy, Decorator or another
composition mechanism may be more appropriate.

## Strategy and Immutability

Pure Strategies are often easier to reason about:

```js
const calculateTax = (amount, rate) =>
    amount * rate;
```

They have no internal mutable state and produce a result from their inputs.

Stateful Strategies are also valid:

```js
class RateLimitedStrategy {
    #lastExecution = 0;

    execute(input) {
        // ...
    }
}
```

However, stateful Strategies introduce lifecycle and concurrency considerations.

If a Strategy is shared between multiple Context instances, its mutable state may unintentionally become shared as well.

## Strategy Lifetime

The lifetime of a Strategy should be considered explicitly.

A stateless Strategy can often be shared:

```js
const standardStrategy = {
    calculate(order) {
        return order.total;
    }
};
```

A stateful Strategy may need to be instantiated per Context:

```js
const strategy = new StatefulStrategy();
const service = new Service(strategy);
```

The dependency-injection scope should reflect this lifecycle.

## Strategy and Concurrency

A stateless Strategy is naturally easier to use concurrently.

A stateful Strategy may need synchronization or independent instances.

For example:

```js
class StatefulStrategy {
    #counter = 0;

    execute() {
        this.#counter++;
    }
}
```

Sharing one instance across concurrent operations introduces shared mutable state.

The Context and composition layer should therefore define whether Strategies are:

* Stateless and shareable.
* Stateful and instance-specific.
* Request-scoped.
* Thread-safe.
* Reentrant.

## Strategy and Resource Ownership

A Strategy may own external resources:

```js
class DatabaseStrategy {
    constructor(connection) {
        this.connection = connection;
    }
}
```

The design should make resource ownership explicit.

If replacing the Strategy requires closing resources, a simple setter:

```js
context.setStrategy(newStrategy);
```

may be insufficient.

Runtime Strategy replacement can therefore require lifecycle operations such as initialization, disposal, or
asynchronous teardown.

## Strategy and Factories

A factory can select and construct a Strategy:

```js
function createShippingStrategy(method) {
    switch (method) {
        case "standard":
            return new StandardShipping();

        case "express":
            return new ExpressShipping();

        case "overnight":
            return new OvernightShipping();

        default:
            throw new Error(`Unknown method: ${method}`);
    }
}
```

The factory owns construction and selection.

The Strategy owns the algorithm.

The Context owns the operation that delegates to the selected Strategy.

These responsibilities should not be collapsed unnecessarily.

## Strategy Registries

When Strategies are dynamically selected, a registry can replace a large conditional:

```js
const strategies = new Map([
    ["standard", () => new StandardShipping()],
    ["express", () => new ExpressShipping()],
    ["overnight", () => new OvernightShipping()]
]);

function createStrategy(name) {
    const factory = strategies.get(name);

    if (!factory) {
        throw new Error(`Unknown strategy: ${name}`);
    }

    return factory();
}
```

This is useful when the set of algorithms is extensible or configuration-driven.

However, a registry does not itself constitute Strategy. It is a selection mechanism for Strategy implementations.

## Strategy and Plugins

Strategy can provide a natural extension point for plugins.

For example:

```js
class Exporter {
    constructor(formatter) {
        this.formatter = formatter;
    }

    export(data) {
        return this.formatter.format(data);
    }
}
```

A plugin can provide a new formatter without modifying the exporter.

This is particularly useful when third parties need to supply algorithms through a stable contract.

Plugin architectures introduce additional concerns such as versioning, security, lifecycle, and capability restrictions.
Strategy solves only the algorithm-substitution part.

## Strategy and Security

A Strategy can represent a security policy:

```js
class AuthorizationService {
    constructor(policy) {
        this.policy = policy;
    }

    authorize(subject, action, resource) {
        return this.policy.authorize(
            subject,
            action,
            resource
        );
    }
}
```

Different policies can be injected for different contexts.

However, security-sensitive Strategy selection must itself be protected. An untrusted caller should not be able to
select a more permissive Strategy merely by supplying a configuration value.

The composition boundary must therefore control which Strategies are available.

## Strategy and Domain Policies

Domain policies are often natural Strategies when multiple valid policy implementations exist.

For example:

```js
class ShippingService {
    constructor(policy) {
        this.policy = policy;
    }

    calculate(order) {
        return this.policy.calculate(order);
    }
}
```

The policy might depend on geography, customer category, product type, or business rules.

The distinction between Strategy and an ordinary domain service depends on whether the policy represents a meaningful
dimension of interchangeable variation.

A domain service does not become a Strategy merely because it is injected.

## Common Misuse

### Using Strategy for One Implementation

If there is only one implementation and no meaningful reason to vary it, creating a Strategy interface and a Concrete
Strategy class may add unnecessary indirection.

The abstraction should correspond to a real or expected dimension of change.

### Creating a Strategy for Every Function

Not every helper function deserves a Strategy abstraction.

```js
function add(a, b) {
    return a + b;
}
```

does not become more maintainable merely because it is wrapped in:

```js
class AdditionStrategy {
    execute(a, b) {
        return a + b;
    }
}
```

Strategy is useful when interchangeable behavior is an actual design concern.

### Strategy Selection Inside the Context

This defeats much of the separation:

```js
class Service {
    execute(type, input) {
        if (type === "a") {
            return new StrategyA().execute(input);
        }

        if (type === "b") {
            return new StrategyB().execute(input);
        }
    }
}
```

The Context still knows every Concrete Strategy.

Selection should generally occur outside the Context or in a dedicated selection mechanism.

### Inspecting Concrete Strategies

Avoid:

```js
if (this.strategy instanceof PremiumStrategy) {
    // ...
}
```

This reintroduces coupling to concrete implementations.

If the Context requires information not represented by the Strategy contract, the abstraction may be incomplete or the
responsibility may belong elsewhere.

### Making Strategies Too Large

A Strategy that owns the entire application workflow is usually not encapsulating one algorithm.

The Context should retain stable orchestration responsibilities.

### Using Strategy to Hide State

A collection of Strategies selected according to an object's lifecycle state may actually represent State.

If the implementation changes because the object has transitioned from `pending` to `completed`, State is likely the
better conceptual model.

### Using Strategy for Cross-Cutting Behavior

Logging, authorization checks, metrics, tracing, and retries may surround an algorithm without replacing it.

If the concern adds behavior around every Strategy, Decorator or middleware may be more appropriate.

### Making Every Strategy Stateful

State is not required for Strategy.

Stateless implementations are often simpler and more reusable.

State should exist only when the algorithm genuinely requires it.

## Refactoring Toward Strategy

A common refactoring starts with a conditional selecting algorithms:

```js
class ReportExporter {
    export(report, format) {
        if (format === "json") {
            return JSON.stringify(report);
        }

        if (format === "csv") {
            return convertToCsv(report);
        }

        if (format === "xml") {
            return convertToXml(report);
        }

        throw new Error(`Unsupported format: ${format}`);
    }
}
```

First identify the stable operation:

```js
export
(report)
```

Then identify the varying algorithm:

```js
format(report)
```

The algorithms can become Strategies:

```js
const jsonStrategy = {
    format(report) {
        return JSON.stringify(report);
    }
};

const csvStrategy = {
    format(report) {
        return convertToCsv(report);
    }
};
```

The Context then delegates:

```js
class ReportExporter {
    constructor(strategy) {
        this.strategy = strategy;
    }

    export(report) {
        return this.strategy.format(report);
    }
}
```

Selection is moved outside:

```js
const strategy = formatStrategies[format];

const exporter = new ReportExporter(strategy);
```

The result separates algorithm selection from algorithm execution.

## Recognizing a Strategy Opportunity

Strategy is a strong candidate when:

* Multiple implementations perform the same conceptual operation.
* The implementations are independently meaningful.
* The algorithm can be selected without changing the Context's core responsibility.
* Conditional logic selecting algorithms is growing.
* Algorithms need independent testing.
* New algorithms are expected.
* Different environments or configurations require different policies.
* The algorithm may change independently from the Context.

Strategy is less useful when the alternatives differ in their overall responsibilities rather than merely in how one
operation is performed.

## Architectural Considerations

Strategy is primarily an object-level design pattern, but it can also define important application boundaries.

Examples include:

* Pluggable payment providers.
* Storage implementations.
* Serialization formats.
* Pricing policies.
* Authorization policies.
* Search algorithms.
* Routing policies.
* Cloud-provider integrations.
* Deployment-specific implementations.

At an architectural boundary, Strategy can prevent infrastructure-specific algorithms from leaking into domain or
application code.

For example:

```js
class DocumentService {
    constructor(storageStrategy) {
        this.storageStrategy = storageStrategy;
    }

    save(document) {
        return this.storageStrategy.save(document);
    }
}
```

The application service does not need to know whether storage uses a local filesystem, object storage, or another
persistence mechanism.

However, if the implementations have incompatible semantics rather than merely different algorithms, Adapter or
Port/Adapter architecture may be more appropriate.

## Strategy and Ports and Adapters

A port defines an abstraction through which an application communicates with an external capability.

Multiple adapters can implement that port.

This can resemble Strategy:

```js
interface
Storage
{
    save(document)
:
    Promise < void >;
}
```

with implementations such as:

```js
class FileStorage {
}

class DatabaseStorage {
}

class ObjectStorage {
}
```

The distinction is conceptual.

Strategy emphasizes interchangeable algorithms or policies.

Ports and Adapters emphasizes architectural dependency direction and isolation from external systems.

An infrastructure adapter can also be used as a Strategy implementation when the application is deliberately selecting
among interchangeable implementations.

## Strategy and API Boundaries

A Strategy abstraction can prevent implementation details from leaking through an API.

For example:

```js
class ImageProcessor {
    constructor(resizeStrategy) {
        this.resizeStrategy = resizeStrategy;
    }

    process(image) {
        return this.resizeStrategy.resize(image);
    }
}
```

The API consumer does not need to know which resizing algorithm is used.

This makes algorithm replacement easier, but the abstraction must still define stable semantics.

## Strategy and Versioning

If Strategies are supplied by plugins or independent modules, their contract becomes a versioned boundary.

Changing:

```js
strategy.execute(input);
```

to require additional arguments can break every implementation.

A stable Strategy interface should therefore evolve deliberately.

Optional configuration objects can sometimes make evolution easier:

```js
strategy.execute(input, {
    signal,
    locale
});
```

But configuration objects should not become arbitrary bags of Context state.

## Benefits

Strategy provides several benefits:

* Encapsulates interchangeable algorithms.
* Reduces algorithm-specific conditional logic.
* Supports runtime algorithm selection.
* Allows algorithms to evolve independently.
* Improves independent testing.
* Supports dependency injection.
* Encourages composition over inheritance.
* Works naturally with JavaScript functions and closures.
* Supports plugin-style extension points.
* Keeps stable Context responsibilities separate from variable algorithms.

## Costs

Strategy also introduces costs:

* Additional indirection.
* More objects, functions, or modules.
* More dependencies to construct.
* Potential proliferation of tiny Strategies.
* Increased configuration complexity.
* Runtime selection can become difficult to trace.
* Strategy contracts must remain semantically compatible.
* Stateful Strategies introduce lifecycle and concurrency concerns.

The abstraction is valuable only when the algorithmic variation is significant enough to justify it.

## Decision Criteria

Use Strategy when:

* Several algorithms solve the same conceptual problem.
* The algorithm is a meaningful dimension of variation.
* The Context should remain independent of Concrete Strategies.
* Algorithms need to be selected, replaced, or tested independently.
* New algorithms are expected to evolve separately.
* The variation is algorithmic or policy-oriented.

Prefer ordinary functions when the algorithm is small and a formal abstraction adds no value.

Prefer State when behavior changes because the Context has entered a different state.

Prefer Template Method when variation naturally belongs to subclass-defined steps within a fixed algorithm skeleton.

Prefer Adapter when the problem is interface incompatibility.

Prefer Decorator when the requirement is to add responsibilities around an existing implementation.

Prefer Chain of Responsibility when the problem is selecting or distributing request handling across multiple potential
handlers.

Prefer Mediator when the primary problem is coordinating interactions among multiple objects.

Prefer Bridge when two dimensions of abstraction and implementation must vary independently.

## Summary

The Strategy pattern encapsulates interchangeable algorithms or policies behind a common contract and allows a Context
to delegate variable behavior without knowing the implementation details of each alternative.

The Context owns the stable responsibility. The Strategy owns the algorithmic variation. Strategy selection should
generally remain outside the Concrete Strategies and, where practical, outside the Context itself.

JavaScript makes Strategy particularly lightweight because functions, closures, objects, and higher-order functions can
all serve as Strategy implementations. A class hierarchy is only one possible representation.

Strategy should not be introduced merely to eliminate a conditional, nor should every callback or injected service
automatically be classified as a Strategy. The defining characteristic is a deliberate **dimension of interchangeable
algorithmic or policy behavior**.

The most important distinction is from State. Strategy represents alternative algorithms selected because the
application wants a different way to perform an operation. State represents behavior that changes because the Context
itself has entered a different state.

A well-designed Strategy abstraction has a narrow and stable contract, compatible result and error semantics, explicit
lifecycle and concurrency expectations, and a clear boundary between algorithm selection and algorithm execution.

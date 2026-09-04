# Builder

The Builder pattern is a creational design pattern that separates the construction of a complex object from its
representation. It allows the same construction process to produce different representations by moving object assembly
into a dedicated builder.

Builder is particularly useful when an object has many construction parameters, when construction involves multiple
steps, when some parameters are optional, or when the construction process itself needs to be controlled independently
from the resulting object.

## Intent

The intent of Builder is to construct complex objects incrementally while keeping the construction process separate from
the final representation.

The pattern addresses situations where directly constructing an object would require a large constructor, numerous
optional parameters, ambiguous argument positions, or a complicated sequence of initialization steps.

Builder does not primarily exist to make constructors shorter. Its purpose is to make complex object construction
explicit, controlled, and independently composable.

## Problem

Consider an object with several configuration options:

```javascript
const request = new HttpRequest(
    "https://example.com",
    "POST",
    {"Content-Type": "application/json"},
    JSON.stringify(data),
    5000,
    true,
    false,
    3
);
```

The constructor technically works, but the call site provides little information about what each argument represents.
Optional parameters make the situation worse because callers must either provide placeholder values or rely on
positional conventions.

A constructor can also become difficult to maintain as the object grows:

```javascript
class Report {
    constructor(
        title,
        author,
        format,
        includeSummary,
        includeCharts,
        includeMetadata,
        pageSize,
        orientation,
        compression
    ) {
        // ...
    }
}
```

The problem is not simply the number of parameters. Construction may itself involve meaningful operations, validation,
normalization, conditional configuration, or ordering constraints.

A complex object may also have multiple valid representations. For example, a report may be rendered as HTML, PDF, or
Markdown while sharing the same conceptual construction process.

Builder moves that construction complexity away from the object's public constructor and gives the caller an explicit
API for assembling the object.

## Structure

The classical Builder pattern contains several conceptual roles.

| Role             | Responsibility                                                                     |
|------------------|------------------------------------------------------------------------------------|
| Builder          | Defines operations used to construct the product                                   |
| Concrete Builder | Implements construction operations and maintains the partially constructed product |
| Product          | The complex object being constructed                                               |
| Director         | Defines or coordinates a particular construction sequence                          |
| Client           | Selects the builder and initiates construction                                     |

The Director is optional in many modern implementations. In JavaScript, the builder itself commonly exposes a fluent API
and a final `build()` operation, making a separate Director unnecessary.

The essential relationship is between the construction process and the resulting product. The product should not need to
expose every intermediate construction operation merely because those operations are required to assemble it.

## Construction Process

Builder typically divides construction into a sequence of operations followed by a finalization step.

```javascript
const report = new ReportBuilder()
    .setTitle("Annual Report")
    .setAuthor("Engineering")
    .setFormat("pdf")
    .includeSummary()
    .includeCharts()
    .build();
```

Each operation configures the builder rather than immediately exposing the partially constructed product.

The `build()` operation is the point at which the builder creates and returns the final object. This gives the builder
an opportunity to validate the accumulated state, normalize values, calculate derived properties, and enforce
construction invariants.

## JavaScript Implementation

A straightforward JavaScript implementation can use a mutable builder with fluent methods:

```javascript
class HttpRequest {
    constructor({
                    url,
                    method,
                    headers,
                    body,
                    timeout,
                    credentials,
                    retries
                }) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
        this.timeout = timeout;
        this.credentials = credentials;
        this.retries = retries;
    }
}

class HttpRequestBuilder {
    #url;
    #method = "GET";
    #headers = {};
    #body;
    #timeout = 5000;
    #credentials = false;
    #retries = 0;

    setUrl(url) {
        this.#url = url;
        return this;
    }

    setMethod(method) {
        this.#method = method;
        return this;
    }

    setHeader(name, value) {
        this.#headers[name] = value;
        return this;
    }

    setBody(body) {
        this.#body = body;
        return this;
    }

    setTimeout(timeout) {
        this.#timeout = timeout;
        return this;
    }

    withCredentials() {
        this.#credentials = true;
        return this;
    }

    setRetries(retries) {
        this.#retries = retries;
        return this;
    }

    build() {
        if (!this.#url) {
            throw new Error("URL is required");
        }

        return new HttpRequest({
            url: this.#url,
            method: this.#method,
            headers: {...this.#headers},
            body: this.#body,
            timeout: this.#timeout,
            credentials: this.#credentials,
            retries: this.#retries
        });
    }
}
```

The resulting API is explicit:

```javascript
const request = new HttpRequestBuilder()
    .setUrl("https://example.com/api")
    .setMethod("POST")
    .setHeader("Content-Type", "application/json")
    .setBody(JSON.stringify(data))
    .setTimeout(10000)
    .setRetries(3)
    .withCredentials()
    .build();
```

The product constructor is no longer responsible for exposing a large positional parameter list to callers.

## Fluent Builders

Returning `this` from configuration methods enables method chaining:

```javascript
const user = new UserBuilder()
    .setName("Alice")
    .setEmail("alice@example.com")
    .setRole("admin")
    .build();
```

Fluent syntax is common in JavaScript Builder implementations, but fluent APIs are not themselves the Builder pattern. A
fluent API is an interface style. Builder is a construction strategy.

A builder can therefore exist without method chaining:

```javascript
const builder = new UserBuilder();

builder.setName("Alice");
builder.setEmail("alice@example.com");
builder.setRole("admin");

const user = builder.build();
```

The important property is the separation of object assembly from the final product, not the syntax used to invoke the
builder.

## Object-Parameter Alternatives

JavaScript already provides a strong alternative to Builder for objects whose main problem is constructor readability.

Instead of:

```javascript
new HttpRequest(
    url,
    method,
    headers,
    body,
    timeout,
    credentials,
    retries
);
```

the object-parameter approach can be used:

```javascript
new HttpRequest({
    url,
    method,
    headers,
    body,
    timeout,
    credentials,
    retries
});
```

This eliminates positional ambiguity without introducing a separate builder.

For simple data objects, this is often the better design.

Builder becomes more justified when construction requires behavior rather than merely named values.

Examples include:

* validation across multiple fields
* conditional configuration
* normalization
* derived values
* staged construction
* construction invariants
* reusable construction procedures
* multiple representations
* complex object assembly

The distinction is important because replacing every options object with a Builder adds unnecessary abstraction.

## Builder with Validation

One of the strongest uses of Builder is delaying final validation until enough information has been provided.

```javascript
class DatabaseConnection {
    constructor({host, port, database, username, ssl}) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.username = username;
        this.ssl = ssl;
    }
}

class DatabaseConnectionBuilder {
    #options = {
        port: 5432,
        ssl: false
    };

    setHost(host) {
        this.#options.host = host;
        return this;
    }

    setDatabase(database) {
        this.#options.database = database;
        return this;
    }

    setUsername(username) {
        this.#options.username = username;
        return this;
    }

    enableSsl() {
        this.#options.ssl = true;
        return this;
    }

    build() {
        const {host, database, username} = this.#options;

        if (!host) {
            throw new Error("Host is required");
        }

        if (!database) {
            throw new Error("Database is required");
        }

        if (!username) {
            throw new Error("Username is required");
        }

        return new DatabaseConnection({
            ...this.#options
        });
    }
}
```

The builder can therefore act as a construction boundary where the accumulated configuration is checked before the
product becomes observable.

## Construction Invariants

Builder is particularly useful when the validity of one property depends on another.

For example:

```javascript
class SearchQueryBuilder {
    #query = {};

    setText(text) {
        this.#query.text = text;
        return this;
    }

    setPage(page) {
        this.#query.page = page;
        return this;
    }

    setPageSize(pageSize) {
        this.#query.pageSize = pageSize;
        return this;
    }

    build() {
        const {page, pageSize} = this.#query;

        if (pageSize !== undefined && page === undefined) {
            throw new Error("Page is required when pageSize is specified");
        }

        return Object.freeze({
            ...this.#query
        });
    }
}
```

The builder can enforce relationships that would otherwise have to be distributed across setters, constructors, or
calling code.

This is one reason Builder can be more valuable than merely replacing positional constructor arguments with an options
object.

## Immutable Products

A useful Builder design is to keep the builder mutable while making the resulting product immutable.

```javascript
class Configuration {
    constructor(options) {
        Object.assign(this, options);
        Object.freeze(this);
    }
}

class ConfigurationBuilder {
    #options = {};

    setEnvironment(environment) {
        this.#options.environment = environment;
        return this;
    }

    setDebug(debug) {
        this.#options.debug = debug;
        return this;
    }

    build() {
        return new Configuration({
            ...this.#options
        });
    }
}
```

The mutable state exists only during construction. Once `build()` completes, the resulting object can have a stable
representation and lifecycle.

This separation is especially useful when products are shared between components or passed across architectural
boundaries.

## Reusing a Builder

Builders can either be single-use or reusable.

A single-use builder can prevent accidental state leakage:

```javascript
const builder = new UserBuilder();

const firstUser = builder
    .setName("Alice")
    .build();

const secondUser = builder
    .setName("Bob")
    .build();
```

This implementation is potentially problematic if the builder retains other state from the first construction.

A reusable builder should provide an explicit reset operation or otherwise guarantee that each construction starts from
a known state:

```javascript
class UserBuilder {
    #options = {};

    setName(name) {
        this.#options.name = name;
        return this;
    }

    reset() {
        this.#options = {};
        return this;
    }

    build() {
        return new User({
            ...this.#options
        });
    }
}
```

Whether reuse is desirable depends on the lifecycle of the builder. For most application-level builders, creating a new
builder per product is simpler and safer.

## Builder and Optional Properties

Builder is often introduced when an object has many optional properties:

```javascript
const document = new DocumentBuilder()
    .setTitle("Architecture")
    .setAuthor("Engineering")
    .setFormat("pdf")
    .enableTableOfContents()
    .enableIndex()
    .build();
```

This makes optional features visible at the call site.

However, a large number of setters is not automatically evidence that Builder is appropriate. If every setter simply
assigns a property with no meaningful construction behavior, an object parameter may remain the simpler design.

The relevant question is whether the construction process has enough complexity to justify its own abstraction.

## Builder and Directors

The classical GoF Builder pattern includes a Director that controls construction sequences.

```javascript
class ReportDirector {
    constructor(builder) {
        this.builder = builder;
    }

    buildExecutiveReport() {
        return this.builder
            .setTitle("Executive Report")
            .includeSummary()
            .includeCharts()
            .build();
    }
}
```

The Director encapsulates a predefined construction procedure:

```javascript
const director = new ReportDirector(new ReportBuilder());

const report = director.buildExecutiveReport();
```

A Director is useful when the same construction procedure must be reused independently of the concrete builder.

For example, multiple builders may produce different report representations while the conceptual construction process
remains the same.

```javascript
class HtmlReportBuilder {
    // ...
}

class PdfReportBuilder {
    // ...
}

class ReportDirector {
    buildExecutiveReport(builder) {
        return builder
            .setTitle("Executive Report")
            .includeSummary()
            .includeCharts()
            .build();
    }
}
```

The Director is not mandatory. In modern JavaScript, it is often unnecessary when the construction sequence is short and
the fluent builder itself provides sufficient control.

## Builder with Different Representations

One classical motivation for Builder is constructing different representations from the same conceptual process.

For example, the construction of a report can be separated from its representation:

```javascript
class HtmlReportBuilder {
    #sections = [];

    addSection(title, content) {
        this.#sections.push({title, content});
        return this;
    }

    build() {
        return this.#sections
            .map(section => `<section><h2>${section.title}</h2><p>${section.content}</p></section>`)
            .join("");
    }
}

class MarkdownReportBuilder {
    #sections = [];

    addSection(title, content) {
        this.#sections.push({title, content});
        return this;
    }

    build() {
        return this.#sections
            .map(section => `## ${section.title}\n\n${section.content}`)
            .join("\n\n");
    }
}
```

The construction operations can remain conceptually consistent while the final representation differs.

This is closer to the classical Builder motivation than using Builder merely as a fluent replacement for a constructor.

## Builder and Factory

Builder and Factory solve different construction problems.

A Factory decides which object to create and encapsulates object creation logic.

Builder controls how a complex object is assembled.

A Factory might create the appropriate product:

```javascript
const parser = ParserFactory.create("json");
```

A Builder might configure a complex parser:

```javascript
const parser = new ParserBuilder()
    .setFormat("json")
    .setStrict(true)
    .setMaxDepth(20)
    .build();
```

They can also be combined. A Factory can select a builder implementation while the builder performs the detailed
construction.

## Builder and Factory Method

Factory Method primarily delegates the creation of an object to a method that can vary by implementation or subclass.

Builder instead separates the construction process from the final representation.

A useful distinction is:

| Pattern          | Primary concern                                  |
|------------------|--------------------------------------------------|
| Factory Method   | Which product is created                         |
| Builder          | How a complex product is assembled               |
| Abstract Factory | Which family of related products is created      |
| Prototype        | Creating objects by copying an existing instance |

The patterns can coexist because their responsibilities are different.

## Builder and Prototype

Prototype creates objects by cloning existing instances.

Builder creates objects through an explicit construction process.

Prototype is useful when a configured object provides a useful starting point:

```javascript
const customized = baseConfiguration.clone();
```

Builder is useful when the desired object must be assembled from individual construction decisions:

```javascript
const configuration = new ConfigurationBuilder()
    .setEnvironment("production")
    .enableCaching()
    .enableCompression()
    .build();
```

The choice depends on whether construction is fundamentally incremental or copy-based.

## Builder and Dependency Injection

Builder can be used to construct dependency graphs or complex infrastructure configuration before passing the resulting
object into an application component.

```javascript
const service = new ServiceBuilder()
    .setRepository(repository)
    .setLogger(logger)
    .setCache(cache)
    .setTimeout(5000)
    .build();
```

This can make configuration explicit, but Builder should not become a replacement for a dependency injection container.

If a dependency graph is primarily controlled by an application composition root, ordinary constructors or dependency
injection configuration may be more appropriate.

Builder is most useful when the object itself has a meaningful construction process.

## TypeScript Implementation

TypeScript can use an explicit interface for the builder:

```typescript
interface Report {
    readonly title: string;
    readonly author: string;
    readonly format: "html" | "pdf";
    readonly includeCharts: boolean;
}

interface ReportBuilder {
    setTitle(title: string): this;

    setAuthor(author: string): this;

    setFormat(format: "html" | "pdf"): this;

    includeCharts(): this;

    build(): Report;
}
```

A concrete implementation can enforce the construction rules:

```typescript
class DefaultReportBuilder implements ReportBuilder {
    private title?: string;
    private author?: string;
    private format: "html" | "pdf" = "html";
    private charts = false;

    setTitle(title: string): this {
        this.title = title;
        return this;
    }

    setAuthor(author: string): this {
        this.author = author;
        return this;
    }

    setFormat(format: "html" | "pdf"): this {
        this.format = format;
        return this;
    }

    includeCharts(): this {
        this.charts = true;
        return this;
    }

    build(): Report {
        if (!this.title) {
            throw new Error("Title is required");
        }

        if (!this.author) {
            throw new Error("Author is required");
        }

        return Object.freeze({
            title: this.title,
            author: this.author,
            format: this.format,
            includeCharts: this.charts
        });
    }
}
```

The `this` return type preserves the concrete fluent type when builder methods are inherited or specialized.

## Type-Safe Staged Builders

TypeScript can encode some construction requirements statically.

For example:

```typescript
interface User {
    name: string;
    email: string;
}

interface UserNameStage {
    setName(name: string): UserEmailStage;
}

interface UserEmailStage {
    setEmail(email: string): UserBuildStage;
}

interface UserBuildStage {
    build(): User;
}

class UserBuilder implements UserNameStage, UserEmailStage, UserBuildStage {
    private name!: string;
    private email!: string;

    setName(name: string): UserEmailStage {
        this.name = name;
        return this;
    }

    setEmail(email: string): UserBuildStage {
        this.email = email;
        return this;
    }

    build(): User {
        return {
            name: this.name,
            email: this.email
        };
    }
}
```

The resulting API can require the caller to provide mandatory construction steps before `build()` becomes available.

This technique can be useful for APIs with strict construction protocols, but it also increases type-system complexity.
Runtime validation remains necessary whenever values originate outside the type system.

## Builder and Async Construction

Builder itself does not imply synchronous construction.

A builder can accumulate configuration synchronously and perform asynchronous work during finalization:

```javascript
class ClientBuilder {
    #options = {};

    setEndpoint(endpoint) {
        this.#options.endpoint = endpoint;
        return this;
    }

    setCredentials(credentials) {
        this.#options.credentials = credentials;
        return this;
    }

    async build() {
        const token = await obtainToken(this.#options.credentials);

        return new Client({
            endpoint: this.#options.endpoint,
            token
        });
    }
}
```

In this case, `build()` returns a promise because construction depends on asynchronous initialization.

The distinction between configuration and resource initialization should remain explicit. If asynchronous initialization
represents an independent lifecycle operation, it may be cleaner to keep construction synchronous and expose a separate
initialization method.

## Builder for Complex Configuration

Builder is particularly common for infrastructure and configuration objects.

```javascript
const server = new ServerBuilder()
    .setHost("0.0.0.0")
    .setPort(8080)
    .setWorkers(4)
    .enableCompression()
    .enableMetrics()
    .setTimeout(30000)
    .build();
```

The builder provides a controlled vocabulary for configuration rather than exposing an unconstrained mutable
configuration object.

This can be valuable when configuration values require normalization or when certain combinations are invalid.

## Builder as an Encapsulation Boundary

A builder can prevent callers from directly manipulating construction state.

Instead of:

```javascript
const options = {};

options.host = "localhost";
options.port = 5432;
options.ssl = true;
options.timeout = 5000;
```

the builder can expose only supported construction operations:

```javascript
const connection = new ConnectionBuilder()
    .setHost("localhost")
    .setPort(5432)
    .enableSsl()
    .setTimeout(5000)
    .build();
```

This gives the builder control over what configuration is permitted and how that configuration is interpreted.

The value of this abstraction increases when construction rules are expected to evolve independently of callers.

## Builder and Encapsulation

The builder should not expose internal mutable structures unnecessarily.

A weak implementation might return the internal options object:

```javascript
build()
{
    return this.#options;
}
```

This exposes builder state directly and makes subsequent mutations potentially affect the resulting product.

A safer implementation creates the product from a copy:

```javascript
build()
{
    return new Configuration({
        ...this.#options
    });
}
```

For nested mutable structures, shallow copying may not be sufficient. The appropriate copying strategy depends on the
product's ownership and mutability requirements.

## Common Misuse

Builder is often overused for simple objects.

This is unnecessary:

```javascript
new PointBuilder()
    .setX(10)
    .setY(20)
    .build();
```

when the product is simply:

```javascript
new Point({x: 10, y: 20});
```

Builder also becomes problematic when every product receives a builder regardless of construction complexity. This
creates additional classes, additional state, additional APIs, and additional indirection without solving a real design
problem.

Another misuse is creating dozens of trivial setters that merely forward values to a product without validation,
transformation, sequencing, or other construction logic. In such cases, an options object is often more appropriate.

A builder can also become a disguised mutable global configuration object if instances are shared across unrelated
construction operations. Builder state should normally have a clear ownership and lifecycle.

## Builder and Mutable State

Builder implementations commonly use mutable internal state because incremental construction requires state to
accumulate.

That does not mean the resulting product must be mutable.

The distinction is:

* Builder state is temporary construction state.
* Product state is the resulting object's state.
* Product mutability should be an independent design decision.

Keeping these concepts separate prevents the builder from becoming an accidental extension of the product's public
mutable API.

## Builder and Open-Closed Design

Builder can improve extensibility when new construction options can be added without changing the product's constructor
signature.

For example:

```javascript
new ServerBuilder()
    .setHost("localhost")
    .setPort(8080)
    .enableMetrics()
    .enableCompression()
    .build();
```

A new configuration capability can be represented by another builder operation rather than another constructor
parameter.

However, the builder itself remains an API. Continually adding methods can eventually make the builder as difficult to
maintain as the constructor it replaced.

Builder therefore does not eliminate complexity. It relocates construction complexity into a dedicated abstraction where
that complexity can be managed explicitly.

## Builder and Testing

Builders can simplify tests for complex objects by making test construction explicit:

```javascript
const user = new UserBuilder()
    .setName("Alice")
    .setEmail("alice@example.com")
    .setRole("admin")
    .build();
```

A test can also focus directly on construction rules:

```javascript
expect(() =>
    new UserBuilder()
        .setEmail("alice@example.com")
        .build()
).toThrow();
```

This gives construction validation a clear testing boundary.

Builders can also provide reusable test fixtures, although test-specific builders should not automatically become part
of production architecture merely because they are convenient in tests.

## Refactoring Toward Builder

A common indication for introducing Builder is a constructor that has accumulated substantial construction complexity.

Before:

```javascript
const report = new Report(
    title,
    author,
    format,
    includeSummary,
    includeCharts,
    includeMetadata,
    pageSize,
    orientation
);
```

The refactoring can introduce a builder:

```javascript
const report = new ReportBuilder()
    .setTitle(title)
    .setAuthor(author)
    .setFormat(format)
    .includeSummary(includeSummary)
    .includeCharts(includeCharts)
    .includeMetadata(includeMetadata)
    .setPageSize(pageSize)
    .setOrientation(orientation)
    .build();
```

The refactoring is justified when the construction API itself has become complex.

If the only problem is positional readability, first consider an object parameter:

```javascript
const report = new Report({
    title,
    author,
    format,
    includeSummary,
    includeCharts,
    includeMetadata,
    pageSize,
    orientation
});
```

This is usually the lower-complexity solution.

## Refactoring Away from Builder

Builder should be removed when construction becomes trivial.

For example, if the builder has evolved into:

```javascript
new UserBuilder()
    .setName(name)
    .setEmail(email)
    .build();
```

and those methods perform no meaningful construction work, the abstraction may no longer provide sufficient value.

The simpler representation may be:

```javascript
new User({
    name,
    email
});
```

Patterns should be removed when the problem that justified them disappears.

## Builder Granularity

A builder should correspond to a meaningful construction boundary.

A single builder can construct a large aggregate:

```javascript
new ApplicationBuilder()
    .setConfiguration(configuration)
    .addModule(module)
    .addPlugin(plugin)
    .setLogger(logger)
    .build();
```

But excessively large builders can become difficult to understand and maintain.

Conversely, creating one builder for every small value object produces unnecessary ceremony.

The appropriate granularity depends on the complexity, volatility, validation requirements, and reuse of the
construction process.

## Builder and Domain Objects

Builder can be useful for domain objects with complex creation rules.

```javascript
const order = new OrderBuilder()
    .setCustomer(customer)
    .addItem(product, 2)
    .applyDiscount(discount)
    .setShippingAddress(address)
    .build();
```

Here the builder is more than a parameter bag. It can calculate totals, validate item quantities, enforce required
information, and ensure that the resulting order satisfies domain invariants.

This is a stronger justification for Builder than simply replacing a constructor with chained setters.

## Builder and Aggregate Construction

In domain-driven designs, a builder can serve as a boundary for assembling an aggregate before the aggregate becomes
available to the rest of the system.

The builder can ensure that required components exist and that cross-component constraints are satisfied.

The aggregate itself should still own domain invariants that must remain true throughout its lifetime. Builder should
not become the only location where an invariant is enforced if the object can later be mutated into an invalid state.

## Decision Criteria

| Situation                                               | Builder suitability              |
|---------------------------------------------------------|----------------------------------|
| Object has two or three simple properties               | Usually unnecessary              |
| Constructor has many optional parameters                | Potentially useful               |
| Positional arguments are difficult to understand        | Consider an options object first |
| Construction requires multiple meaningful steps         | Strong fit                       |
| Construction requires cross-field validation            | Strong fit                       |
| Multiple representations share a construction process   | Strong fit                       |
| Product creation requires asynchronous initialization   | Potentially useful               |
| Object is created primarily by cloning                  | Prefer Prototype                 |
| Main problem is selecting a concrete product            | Prefer Factory                   |
| Product is simple immutable data                        | Usually unnecessary              |
| Construction procedure is reused across representations | Builder with Director can fit    |

## Benefits

Builder provides several architectural benefits.

It separates construction logic from product representation, makes complex construction explicit, supports incremental
configuration, centralizes construction validation, and can support multiple representations through a common
construction process.

It can also reduce constructor complexity and provide a stable, intention-revealing API for callers.

## Costs

Builder introduces additional abstraction and usually additional mutable state.

A builder can increase the number of classes and methods, duplicate property definitions between builder and product,
and create maintenance overhead when the product is simple.

Fluent APIs can also make debugging more difficult because a long construction chain compresses many operations into a
single expression.

Staged TypeScript builders introduce additional type complexity and can make the API harder to understand for relatively
simple construction requirements.

## Architectural Considerations

Builder is most valuable when construction is itself a meaningful architectural concern.

At an application boundary, a builder may encapsulate the assembly of infrastructure clients, configuration objects,
request objects, domain aggregates, or complex execution plans.

The builder should have a clear responsibility. It should not become a general-purpose service locator, dependency
container, mutable configuration singleton, or replacement for ordinary constructors.

Construction logic should remain close to the abstraction that owns the construction rules. If the builder begins
accumulating unrelated business operations, orchestration responsibilities, or runtime service lookup, its boundary is
probably incorrect.

## Recognizing Builder in Existing Code

Existing code may already implement Builder without using the name explicitly.

Common indicators include:

* a mutable configuration object with chained methods
* a `build()` or `create()` finalization method
* many optional construction operations
* validation performed only after several configuration operations
* separate objects responsible for assembling a complex product
* multiple implementations producing different representations from similar construction steps
* repeated sequences of object configuration
* constructors that have become difficult to call or maintain

Not every fluent API is a Builder. The defining characteristic is the separation of complex construction from the
resulting product.

## Summary

Builder separates the construction of a complex object from its final representation. It is most useful when
construction involves multiple steps, optional configuration, cross-field validation, construction invariants, reusable
construction procedures, or multiple representations.

In JavaScript, Builder is often implemented as a fluent object with a `build()` method, but fluent syntax is not a
requirement. A builder may be mutable during construction while producing an immutable product.

The pattern should not be introduced merely because an object has several properties. JavaScript's object-parameter
syntax already solves many constructor readability problems with substantially less abstraction.

The central decision is whether object construction has enough complexity, behavior, validation, sequencing, or
representation variability to deserve its own abstraction. If it does, Builder provides a clear boundary for that
complexity. If it does not, a constructor, object parameter, factory function, or ordinary factory is usually simpler.

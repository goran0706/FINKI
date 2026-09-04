# Factory Method

Factory Method is a creational design pattern that defines an interface for creating an object while allowing subclasses
or implementations to determine which concrete object is created.

The pattern moves the decision about the concrete product away from code that consumes the product. The consumer works
with a product abstraction while the creation decision is delegated to a factory method.

## Intent

The intent of Factory Method is to encapsulate a variable object-creation decision behind a method whose result is
defined by an abstraction.

The pattern is particularly useful when a class needs to work with objects whose concrete type may vary, and the class
should not be tightly coupled to the concrete implementation it creates.

The defining characteristic is not simply the presence of a method named `create()`, `createProduct()`, or `make()`.
Factory Method specifically uses a creation method whose implementation can vary while the surrounding algorithm remains
stable.

## Problem

Consider a class that processes notifications:

```javascript
class NotificationService {
    send(message) {
        const notification = new EmailNotification();

        notification.send(message);
    }
}
```

The service contains both the business operation and the concrete creation decision.

If the application later needs SMS notifications, the class must change:

```javascript
class NotificationService {
    send(message, type) {
        const notification =
            type === "email"
                ? new EmailNotification()
                : new SmsNotification();

        notification.send(message);
    }
}
```

As more product types are introduced, the creation logic can become increasingly coupled to the consumer:

```javascript
class NotificationService {
    send(message, type) {
        let notification;

        if (type === "email") {
            notification = new EmailNotification();
        } else if (type === "sms") {
            notification = new SmsNotification();
        } else if (type === "push") {
            notification = new PushNotification();
        } else {
            throw new Error("Unsupported notification type");
        }

        notification.send(message);
    }
}
```

The core operation does not actually care which concrete notification implementation it receives. It only requires the
notification contract.

Factory Method separates that creation decision from the operation that uses the product.

## Structure

The classical Factory Method pattern contains several conceptual roles.

| Role             | Responsibility                                                              |
|------------------|-----------------------------------------------------------------------------|
| Product          | Defines the interface expected by client code                               |
| Concrete Product | Implements the product interface                                            |
| Creator          | Defines the factory method and contains the algorithm that uses the product |
| Concrete Creator | Overrides the factory method to select a concrete product                   |
| Client           | Uses the creator and product abstractions                                   |

The important relationship is between the Creator's algorithm and its factory method. The algorithm can remain stable
while the factory method determines which concrete product participates in that algorithm.

## Classical Implementation

A direct representation of the GoF structure uses inheritance:

```javascript
class Notification {
    send(message) {
        throw new Error("Not implemented");
    }
}

class EmailNotification extends Notification {
    send(message) {
        console.log(`Email: ${message}`);
    }
}

class SmsNotification extends Notification {
    send(message) {
        console.log(`SMS: ${message}`);
    }
}

class NotificationService {
    send(message) {
        const notification = this.createNotification();

        notification.send(message);
    }

    createNotification() {
        throw new Error("createNotification() must be implemented");
    }
}

class EmailNotificationService extends NotificationService {
    createNotification() {
        return new EmailNotification();
    }
}

class SmsNotificationService extends NotificationService {
    createNotification() {
        return new SmsNotification();
    }
}
```

The common operation remains in `NotificationService`:

```javascript
class NotificationService {
    send(message) {
        const notification = this.createNotification();

        notification.send(message);
    }

    createNotification() {
        throw new Error("createNotification() must be implemented");
    }
}
```

Concrete creators only determine which product is constructed:

```javascript
const service = new EmailNotificationService();

service.send("Account created");
```

The algorithm does not need to know that the product is an `EmailNotification`.

## The Factory Method

The factory method is the method responsible for product creation:

```javascript
createNotification()
{
    return new EmailNotification();
}
```

The surrounding operation uses the factory method rather than constructing the concrete product directly:

```javascript
send(message)
{
    const notification = this.createNotification();

    notification.send(message);
}
```

This distinction is essential.

If the algorithm directly constructs the product:

```javascript
send(message)
{
    const notification = new EmailNotification();

    notification.send(message);
}
```

there is no Factory Method regardless of whether another method called `createNotification()` exists elsewhere.

The creation operation must be part of the abstraction's extension mechanism.

## Factory Method with a Shared Algorithm

Factory Method becomes especially useful when the Creator contains an algorithm that should remain invariant.

```javascript
class ReportGenerator {
    generate(data) {
        const report = this.createReport();

        report.addHeader(data);
        report.addBody(data);
        report.addFooter(data);

        return report.render();
    }

    createReport() {
        throw new Error("createReport() must be implemented");
    }
}
```

Different creators can select different report implementations:

```javascript
class HtmlReportGenerator extends ReportGenerator {
    createReport() {
        return new HtmlReport();
    }
}

class PdfReportGenerator extends ReportGenerator {
    createReport() {
        return new PdfReport();
    }
}
```

The construction decision varies, but the generation procedure remains centralized.

This is one of the strongest indicators that Factory Method is appropriate: a stable algorithm depends on a product
whose concrete implementation must vary.

## Factory Method and Polymorphism

Factory Method relies on polymorphism at the creation boundary.

The Creator depends on the product abstraction:

```javascript
const report = this.createReport();

report.addHeader(data);
report.addBody(data);
report.addFooter(data);
```

It does not depend on:

```javascript
const report = new HtmlReport();
```

The concrete creator provides the implementation-specific decision.

This allows the Creator's algorithm to remain independent of the concrete product class.

## JavaScript and the Prototype Model

JavaScript does not require class inheritance to implement the concept.

A factory method can be represented with ordinary objects and functions:

```javascript
const reportGenerator = {
    generate(data) {
        const report = this.createReport();

        report.addHeader(data);
        report.addBody(data);
        report.addFooter(data);

        return report.render();
    },

    createReport() {
        throw new Error("createReport() must be implemented");
    }
};
```

An implementation can provide the creation method:

```javascript
const htmlReportGenerator = Object.create(reportGenerator);

htmlReportGenerator.createReport = function () {
    return new HtmlReport();
};
```

The mechanism differs from classical class inheritance, but the underlying relationship remains the same: the algorithm
delegates product creation to a method that can vary.

## Function-Based Factory Method

A simpler JavaScript implementation can use a function as the creation hook:

```javascript
function createReportGenerator(createReport) {
    return {
        generate(data) {
            const report = createReport();

            report.addHeader(data);
            report.addBody(data);
            report.addFooter(data);

            return report.render();
        }
    };
}
```

The concrete creation strategy is supplied by the caller:

```javascript
const generator = createReportGenerator(
    () => new HtmlReport()
);
```

This is structurally closer to dependency injection than classical GoF Factory Method, but it expresses the same
fundamental separation: the algorithm depends on a creation abstraction rather than directly selecting the concrete
product.

## Factory Method and Dependency Injection

Dependency injection can replace inheritance-based Factory Method when the variable creation behavior is better
represented as a supplied dependency.

For example:

```javascript
class ReportGenerator {
    constructor(createReport) {
        this.createReport = createReport;
    }

    generate(data) {
        const report = this.createReport();

        report.addHeader(data);
        report.addBody(data);
        report.addFooter(data);

        return report.render();
    }
}
```

Usage:

```javascript
const generator = new ReportGenerator(
    () => new HtmlReport()
);
```

This approach avoids creating a separate Creator subclass for every product type.

The conceptual distinction is useful:

* Classical Factory Method varies creation through polymorphic method overriding.
* Dependency injection varies creation through an externally supplied dependency.
* Both can remove direct concrete-product construction from the consuming algorithm.

In JavaScript, dependency injection is often the simpler implementation.

## Factory Method and Factory Functions

A factory function is any function whose purpose is to create and return an object.

For example:

```javascript
function createUser(name, email) {
    return new User(name, email);
}
```

This alone is not the Factory Method pattern.

Factory Method specifically involves a creation operation that is part of a larger abstraction and whose implementation
can vary independently from the algorithm using the created product.

A factory function can therefore be used to implement Factory Method, but the terms are not interchangeable.

## Factory Method and Simple Factory

A common simple factory selects a product using a parameter:

```javascript
function createNotification(type) {
    switch (type) {
        case "email":
            return new EmailNotification();

        case "sms":
            return new SmsNotification();

        case "push":
            return new PushNotification();

        default:
            throw new Error(`Unsupported notification type: ${type}`);
    }
}
```

This centralizes object creation but does not use the classical Factory Method structure.

Factory Method instead allows the creation decision to vary through the creator abstraction:

```javascript
class NotificationService {
    send(message) {
        const notification = this.createNotification();

        notification.send(message);
    }

    createNotification() {
        throw new Error("Not implemented");
    }
}
```

The distinction is primarily about where the variation lives.

A simple factory varies through selection logic inside one function. Factory Method varies through the implementation of
a creation method.

## Factory Method and Abstract Factory

Abstract Factory creates families of related products.

Factory Method creates a product through a single creation mechanism that can vary by implementation.

For example, an Abstract Factory might provide:

```javascript
factory.createButton();
factory.createDialog();
factory.createMenu();
```

while a Factory Method might provide:

```javascript
creator.createDocument();
```

The patterns can also be combined. An Abstract Factory implementation may use Factory Methods internally to create
individual products.

The difference is therefore not whether either pattern contains methods that create objects. The difference is the scope
of the creation abstraction.

## Factory Method and Builder

Builder separates complex object construction from the resulting product.

Factory Method delegates the choice of which product to create.

For example:

```javascript
const document = documentCreator.createDocument();
```

is primarily concerned with product selection.

By contrast:

```javascript
const document = new DocumentBuilder()
    .setTitle(title)
    .setAuthor(author)
    .setFormat("pdf")
    .build();
```

is concerned with product assembly.

A system can use both when it needs to select a concrete builder and then use that builder to construct a complex
product.

## Factory Method and Prototype

Prototype creates an object by copying an existing object.

Factory Method can create a product without exposing how that product is instantiated.

The distinction is:

| Pattern          | Main concern                                    |
|------------------|-------------------------------------------------|
| Factory Method   | Varying the creation operation                  |
| Prototype        | Creating through an existing object's structure |
| Builder          | Incremental construction                        |
| Abstract Factory | Creating related product families               |

The implementation techniques can overlap. A Factory Method could technically return a clone, but that does not make the
patterns conceptually identical.

## Factory Method and Constructors

A constructor is the normal mechanism for creating an instance of a known class:

```javascript
const user = new User(options);
```

Factory Method becomes useful when the creator should not need to know which concrete class is instantiated.

For example:

```javascript
class FileImporter {
    import(data) {
        const parser = this.createParser();

        return parser.parse(data);
    }

    createParser() {
        throw new Error("createParser() must be implemented");
    }
}
```

The algorithm works with the parser abstraction while concrete subclasses determine the parser implementation.

If the concrete type is stable and known, introducing Factory Method adds unnecessary indirection.

## Factory Method and Open-Closed Design

Factory Method can support extension by allowing a new concrete creator to select a new product without modifying the
existing creation algorithm.

For example:

```javascript
class JsonFileImporter extends FileImporter {
    createParser() {
        return new JsonParser();
    }
}
```

A new implementation can be introduced by extending the creator abstraction.

However, this does not mean Factory Method automatically satisfies the Open-Closed Principle in every design. Adding a
new product may still require changes elsewhere, especially when product-specific behavior leaks into the Creator or
client.

The useful property is narrower: the product-selection mechanism can be extended through a polymorphic creation
operation.

## Factory Method and Dependency Inversion

A well-designed Factory Method can keep high-level logic dependent on abstractions rather than concrete product classes.

```javascript
class Importer {
    import(data) {
        const parser = this.createParser();

        return parser.parse(data);
    }

    createParser() {
        throw new Error("Not implemented");
    }
}
```

The algorithm requires only the parser contract.

```javascript
class JsonParser {
    parse(data) {
        // ...
    }
}
```

The concrete parser is introduced by a concrete creator rather than by the high-level algorithm itself.

This is particularly useful at architectural boundaries where implementations may vary by environment, provider,
protocol, or deployment configuration.

## Factory Method and Configuration

Factory Method can allow runtime configuration to determine which concrete creator is used:

```javascript
function createImporter(format) {
    switch (format) {
        case "json":
            return new JsonImporter();

        case "xml":
            return new XmlImporter();

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}
```

The selection of the concrete creator is separate from the algorithm performed by the creator.

This often produces a two-level design:

```javascript
const importer = createImporter(configuration.format);

importer.import(data);
```

The outer selection mechanism determines the concrete creator. The Factory Method inside that creator determines the
product used by its algorithm.

This distinction prevents the Factory Method itself from being overloaded with every possible runtime selection concern.

## Factory Method at Architectural Boundaries

Factory Method is useful where concrete implementations vary according to an architectural boundary.

Examples include:

* persistence implementations
* message transports
* file parsers
* payment integrations
* cloud-provider clients
* serialization formats
* notification channels
* platform-specific adapters
* rendering implementations

For example:

```javascript
class MessageProcessor {
    process(message) {
        const transport = this.createTransport();

        transport.send(message);
    }

    createTransport() {
        throw new Error("createTransport() must be implemented");
    }
}
```

Concrete creators can select different transport implementations while the processing algorithm remains independent of
those implementations.

## Factory Method with Adapters

Factory Method can select an Adapter implementation when the surrounding algorithm should remain independent of an
external API.

```javascript
class PaymentProcessor {
    process(payment) {
        const gateway = this.createGateway();

        return gateway.charge(payment);
    }

    createGateway() {
        throw new Error("createGateway() must be implemented");
    }
}
```

A concrete creator can select an adapter for a particular provider:

```javascript
class ProviderPaymentProcessor extends PaymentProcessor {
    createGateway() {
        return new ProviderPaymentAdapter();
    }
}
```

The processor depends on the application's gateway abstraction rather than the external provider's API.

Factory Method therefore often appears naturally alongside Adapter in integration-heavy systems.

## Factory Method and Testing

Factory Method can provide a controlled replacement point for tests.

```javascript
class OrderProcessor {
    process(order) {
        const repository = this.createRepository();

        repository.save(order);
    }

    createRepository() {
        return new DatabaseOrderRepository();
    }
}
```

A test-specific creator can supply a test implementation:

```javascript
class TestOrderProcessor extends OrderProcessor {
    createRepository() {
        return new InMemoryOrderRepository();
    }
}
```

This can be useful in legacy systems or inheritance-oriented designs.

In modern JavaScript, dependency injection is often more explicit:

```javascript
const processor = new OrderProcessor(repository);
```

Therefore, Factory Method should not be introduced solely for testing when ordinary dependency injection provides a
simpler dependency boundary.

## Factory Method and Resource Lifecycle

Factory Method can control not only which implementation is created but also how creation is initialized.

```javascript
class ConnectionService {
    async execute(query) {
        const connection = await this.createConnection();

        try {
            return await connection.execute(query);
        } finally {
            await connection.close();
        }
    }

    async createConnection() {
        throw new Error("createConnection() must be implemented");
    }
}
```

Different concrete creators can provide different connection implementations while the lifecycle remains centralized.

This is useful when all products satisfy the same lifecycle contract but differ in their concrete implementation.

## Factory Method with Asynchronous Creation

JavaScript applications frequently create resources asynchronously.

A Factory Method can therefore return a promise:

```javascript
class ClientService {
    async execute(request) {
        const client = await this.createClient();

        return client.execute(request);
    }

    async createClient() {
        throw new Error("createClient() must be implemented");
    }
}
```

Concrete implementations can perform asynchronous initialization:

```javascript
class CloudClientService extends ClientService {
    async createClient() {
        const credentials = await loadCredentials();

        return new CloudClient(credentials);
    }
}
```

The Creator's algorithm remains independent of the details of client initialization.

## Factory Method and Caching

The Factory Method does not require a new object to be created on every invocation.

```javascript
class ClientService {
    #client;

    execute(request) {
        const client = this.createClient();

        return client.execute(request);
    }

    createClient() {
        if (!this.#client) {
            this.#client = new Client();
        }

        return this.#client;
    }
}
```

The creation method can therefore incorporate caching, pooling, lazy initialization, or other lifecycle policies when
those policies belong to the Creator.

However, caching should not be introduced implicitly merely because Factory Method exists. Object lifetime remains a
separate design concern.

## Factory Method and Singleton

Factory Method can return a shared instance:

```javascript
class ServiceCreator {
    #service;

    createService() {
        if (!this.#service) {
            this.#service = new Service();
        }

        return this.#service;
    }
}
```

The Factory Method determines how the product is obtained, while the caching policy determines whether multiple calls
produce the same instance.

Factory Method and Singleton therefore solve different problems and can coexist without being the same pattern.

## Common Misuse

A common misuse is calling any method that returns an object a Factory Method.

```javascript
class User {
    getProfile() {
        return new Profile();
    }
}
```

This is simply an object-creation method unless it participates in a polymorphic creation mechanism.

Another misuse is introducing a hierarchy of Creator subclasses when the only variation is a simple runtime value:

```javascript
new EmailNotificationService();
new SmsNotificationService();
new PushNotificationService();
```

If the only purpose of the hierarchy is selecting a product based on a configuration value, a factory function,
registry, dependency injection, or another simpler mechanism may be preferable.

Factory Method is also unnecessary when the Creator always creates the same concrete product and there is no meaningful
extension point.

## Inheritance Cost

The classical Factory Method implementation often requires subclassing:

```javascript
class EmailService extends NotificationService {
    createNotification() {
        return new EmailNotification();
    }
}
```

This creates a relationship between product variation and Creator inheritance.

That relationship can be useful when the concrete Creator already has meaningful specialized behavior.

It becomes undesirable when subclasses exist only to override one line:

```javascript
createNotification()
{
    return new SomeProduct();
}
```

In JavaScript, composition and dependency injection often provide the same variation with less coupling.

## Factory Method with Composition

Creation behavior can be composed rather than inherited:

```javascript
class NotificationService {
    constructor(createNotification) {
        this.createNotification = createNotification;
    }

    send(message) {
        const notification = this.createNotification();

        notification.send(message);
    }
}
```

Different creation strategies can now be supplied directly:

```javascript
const emailService = new NotificationService(
    () => new EmailNotification()
);

const smsService = new NotificationService(
    () => new SmsNotification()
);
```

This is often preferable when the Creator has no meaningful behavioral differences beyond the product creation
operation.

The important architectural principle is to vary the creation dependency without forcing unnecessary inheritance.

## Refactoring Toward Factory Method

A useful starting point is code where a stable algorithm directly constructs a concrete implementation:

```javascript
class ReportGenerator {
    generate(data) {
        const report = new HtmlReport();

        report.addHeader(data);
        report.addBody(data);
        report.addFooter(data);

        return report.render();
    }
}
```

First identify the stable product contract:

```javascript
class Report {
    addHeader(data) {
    }

    addBody(data) {
    }

    addFooter(data) {
    }

    render() {
    }
}
```

Then move creation behind a method:

```javascript
class ReportGenerator {
    generate(data) {
        const report = this.createReport();

        report.addHeader(data);
        report.addBody(data);
        report.addFooter(data);

        return report.render();
    }

    createReport() {
        return new HtmlReport();
    }
}
```

A specialized creator can then override the creation method:

```javascript
class PdfReportGenerator extends ReportGenerator {
    createReport() {
        return new PdfReport();
    }
}
```

The refactoring is justified when product variation is a genuine extension point of the algorithm.

## Refactoring Away from Factory Method

Factory Method should be removed when the variation no longer exists or when the inheritance structure provides no
meaningful value.

Before:

```javascript
class EmailService extends NotificationService {
    createNotification() {
        return new EmailNotification();
    }
}
```

If there is only one implementation and no realistic variation:

```javascript
class NotificationService {
    send(message) {
        const notification = new EmailNotification();

        notification.send(message);
    }
}
```

may be simpler.

Alternatively, if product selection is configuration-driven rather than polymorphic, an external factory or dependency
injection mechanism may be more appropriate.

A pattern should not remain in the design merely because the code historically evolved around it.

## Factory Method and Product Contracts

The Creator should depend on a stable product contract.

For example:

```javascript
class FileParser {
    parse(data) {
        throw new Error("parse() must be implemented");
    }
}
```

The Creator can then use any implementation satisfying the contract:

```javascript
class FileImporter {
    import(data) {
        const parser = this.createParser();

        return parser.parse(data);
    }
}
```

If the Creator starts checking concrete types:

```javascript
if (parser instanceof JsonParser) {
    // ...
}
```

the abstraction is leaking.

Product-specific behavior should generally remain behind the product abstraction. Otherwise, the Factory Method may only
hide the concrete type temporarily while the surrounding algorithm remains coupled to it.

## Factory Method and TypeScript

TypeScript can make the product contract explicit:

```typescript
interface Parser {
    parse(data: string): unknown;
}

abstract class FileImporter {
    import(data: string): unknown {
        const parser = this.createParser();

        return parser.parse(data);
    }

    protected abstract createParser(): Parser;
}
```

Concrete creators select the product:

```typescript
class JsonImporter extends FileImporter {
    protected createParser(): Parser {
        return new JsonParser();
    }
}

class XmlImporter extends FileImporter {
    protected createParser(): Parser {
        return new XmlParser();
    }
}
```

The type system makes the Factory Method contract explicit: every concrete Creator must provide a `Parser`.

## TypeScript Visibility

The factory method can be `protected` when it exists only as an extension point for subclasses:

```typescript
abstract class Importer {
    import(data: string): unknown {
        const parser = this.createParser();

        return parser.parse(data);
    }

    protected abstract createParser(): Parser;
}
```

This prevents external callers from treating the Factory Method as part of the public API.

The visibility should reflect the actual responsibility of the method. If callers legitimately need to request product
creation directly, the method may instead be public, but that represents a different API requirement.

## Factory Method and Abstract Base Classes

TypeScript and JavaScript class hierarchies often express Factory Method through an abstract Creator:

```typescript
abstract class DocumentProcessor {
    process(data: string): string {
        const document = this.createDocument();

        return document.process(data);
    }

    protected abstract createDocument(): Document;
}
```

This provides a strong structural representation of the pattern:

* The base class owns the algorithm.
* The base class defines the creation operation.
* Concrete subclasses select the product.
* The algorithm depends on the product abstraction.

This is the clearest classical form of Factory Method.

## Factory Method and Runtime Selection

Factory Method itself does not require runtime selection.

For example:

```javascript
const processor = new PdfProcessor();
```

The runtime selection may happen outside the Factory Method:

```javascript
const processor =
    configuration.format === "pdf"
        ? new PdfProcessor()
        : new HtmlProcessor();
```

The selected Creator then controls product creation through its Factory Method.

Keeping these responsibilities separate prevents the Factory Method from becoming a general-purpose type-selection
mechanism.

## Factory Method and Registries

A registry can be used when product types are dynamically extensible:

```javascript
const parsers = new Map();

parsers.set("json", () => new JsonParser());
parsers.set("xml", () => new XmlParser());

function createParser(format) {
    const factory = parsers.get(format);

    if (!factory) {
        throw new Error(`Unsupported format: ${format}`);
    }

    return factory();
}
```

This is useful for plugin systems and runtime registration.

It should not automatically be called Factory Method. It is better understood as a registry-based factory mechanism
unless the creation operation is specifically part of a polymorphic Creator abstraction.

## Factory Method in Plugin Architectures

Factory Method can provide an extension point for plugin implementations.

```javascript
class PluginHost {
    start() {
        const plugin = this.createPlugin();

        plugin.initialize();
        plugin.start();
    }

    createPlugin() {
        throw new Error("createPlugin() must be implemented");
    }
}
```

A plugin-specific host can select its implementation:

```javascript
class AnalyticsHost extends PluginHost {
    createPlugin() {
        return new AnalyticsPlugin();
    }
}
```

The host's lifecycle remains centralized while the concrete plugin implementation varies.

For larger plugin ecosystems, explicit registration and dependency injection may scale better than a large inheritance
hierarchy.

## Benefits

Factory Method separates product creation from the algorithm that uses the product. It reduces direct coupling to
concrete implementations, provides a polymorphic creation point, supports extension through new creators, and can keep
product-specific construction decisions outside high-level operations.

It is particularly effective when a stable algorithm must operate on products whose concrete implementations vary.

## Costs

Classical Factory Method can introduce inheritance and additional types. Each product variation may require another
Creator subclass even when the only difference is which product is instantiated.

The pattern also introduces an additional level of indirection between the algorithm and object creation.

In JavaScript, where functions and closures provide inexpensive alternatives to inheritance, a classical Factory Method
hierarchy can be more ceremony than the problem requires.

## Decision Criteria

| Situation                                                     | Factory Method suitability                |
|---------------------------------------------------------------|-------------------------------------------|
| Stable algorithm needs variable concrete products             | Strong fit                                |
| Concrete product selection belongs to subclasses              | Strong fit                                |
| Product creation is an extension point                        | Strong fit                                |
| Only one concrete product will ever exist                     | Usually unnecessary                       |
| Need only a function that creates an object                   | Factory function may be sufficient        |
| Selection is based on a runtime type/value                    | Simple factory or registry may be simpler |
| Complex object assembly is the primary concern                | Prefer Builder                            |
| Need a family of related products                             | Consider Abstract Factory                 |
| Need to clone an existing product                             | Prefer Prototype                          |
| Only dependency substitution is required                      | Dependency injection may be simpler       |
| Class hierarchy exists solely to override one creation method | Consider composition                      |

## Summary

Factory Method encapsulates a variable object-creation decision behind a method while keeping the algorithm that
consumes the resulting product independent of its concrete type.

The classical form uses a Creator hierarchy: the base Creator owns the algorithm, the Factory Method defines the
creation point, and concrete Creators select concrete Products.

JavaScript provides several alternatives to inheritance-based Factory Method, including functions, closures, dependency
injection, registries, and composition. These alternatives can express the same underlying separation with less
structural overhead.

The pattern is most justified when product creation is a genuine polymorphic extension point of a stable algorithm. If
the only requirement is constructing an object, use a constructor or factory function. If the requirement is selecting
among products based on runtime data, use an appropriate factory or registry. If the requirement is assembling a complex
object through multiple construction steps, use Builder.

The defining question is not whether a method creates an object. The defining question is whether a stable algorithm
delegates product creation to a variable implementation so that the algorithm remains independent of the concrete
product.

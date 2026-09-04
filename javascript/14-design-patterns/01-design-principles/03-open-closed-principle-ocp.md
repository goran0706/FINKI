# Open-Closed Principle (OCP)

The **Open-Closed Principle (OCP)** states that software entities should be structured so that they can be extended with
new behavior without requiring modification to existing, already-working behavior.

The principle is fundamentally concerned with controlling the impact of change. Software inevitably evolves as new
requirements, implementations, integrations, and business rules are introduced. OCP does not attempt to prevent
modification altogether. Instead, it encourages the design of boundaries that allow predictable forms of extension to
occur without repeatedly changing stable code.

OCP is therefore closely associated with extension points, change isolation, abstraction, polymorphism, composition, and
dependency management. Its purpose is not to make software permanently immutable, but to prevent volatile behavior from
repeatedly forcing changes into stable behavior.

## The Meaning of "Open" and "Closed"

The terms describe two complementary properties of the same software entity.

**Open for extension** means that new behavior or implementations can be introduced without redesigning the existing
component. **Closed for modification** means that existing implementation does not need to be changed every time another
supported variation is introduced.

This does not mean that existing code can literally never be modified. A bug fix, security correction, performance
improvement, or genuine change to an existing requirement may legitimately require modifying existing implementation.

For example:

```js
class TaxCalculator {
    calculate(amount) {
        return amount * 0.2;
    }
}
```

If the calculation is incorrect, modifying `TaxCalculator` is entirely appropriate. OCP is concerned primarily with new
requirements that represent extensions of an established variation point. If a new tax calculation method is expected to
be introduced repeatedly, the design should avoid requiring the stable calculation infrastructure to be modified for
every new implementation.

The objective is therefore not to eliminate modification, but to prevent predictable extensions from repeatedly
modifying code that should otherwise remain stable.

## OCP Is About Change

Consider a function that calculates discounts according to customer type:

```js
function calculateDiscount(customerType, amount) {
    if (customerType === "regular") {
        return amount * 0.05;
    }

    if (customerType === "premium") {
        return amount * 0.10;
    }

    if (customerType === "vip") {
        return amount * 0.20;
    }

    return 0;
}
```

When an employee customer type is introduced, the function must be modified:

```js
if (customerType === "employee") {
    return amount * 0.25;
}
```

The problem is not the existence of the conditional itself. The problem is that the same stable decision logic must
repeatedly be modified whenever another implementation of the same conceptual behavior is introduced.

If customer discount policies are expected to grow independently, the customer type represents a meaningful variation
point. That variation can instead be represented by replaceable implementations.

```js
class DiscountPolicy {
    calculate(amount) {
        return 0;
    }
}

class RegularDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.05;
    }
}

class PremiumDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.10;
    }
}

class VipDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.20;
    }
}
```

The consuming code can now depend on the behavior rather than knowing every possible customer type:

```js
function calculateDiscount(policy, amount) {
    return policy.calculate(amount);
}
```

A new variation can be introduced independently:

```js
class EmployeeDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.25;
    }
}
```

The consumer does not need to change merely because another discount policy exists.

This is the central idea behind OCP: stable behavior should not have to know or be modified for every new implementation
of a behavior that has been deliberately isolated as a variation point.

## Extension Through Polymorphism

Polymorphism is one of the most common mechanisms for implementing OCP. A stable component depends on a behavioral
abstraction, while multiple implementations provide different variations of that behavior.

The abstraction does not necessarily have to be a formal interface or abstract class. It can simply represent the
operations the consumer requires.

```js
class DiscountPolicy {
    calculate(amount) {
        return 0;
    }
}

class RegularDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.05;
    }
}

class PremiumDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.10;
    }
}

class VipDiscount extends DiscountPolicy {
    calculate(amount) {
        return amount * 0.20;
    }
}
```

The consumer can operate against the abstraction:

```js
function calculateDiscount(policy, amount) {
    return policy.calculate(amount);
}
```

Adding `EmployeeDiscount` does not require changing `calculateDiscount`. The new implementation participates in the
existing contract.

The important property is therefore not the inheritance hierarchy itself. The important property is that the stable
consumer is separated from the volatile implementations.

## OCP Does Not Require Inheritance

Inheritance is only one possible mechanism for implementing OCP. Composition is often simpler and more appropriate,
particularly in JavaScript.

```js
class DiscountCalculator {
    constructor(policy) {
        this.policy = policy;
    }

    calculate(amount) {
        return this.policy.calculate(amount);
    }
}
```

A policy can be supplied as an object:

```js
const calculator = new DiscountCalculator({
    calculate(amount) {
        return amount * 0.10;
    }
});
```

The calculator does not care whether the policy is an instance of a class, a plain object, or another implementation. It
only depends on the behavior it requires.

JavaScript's structural nature makes this approach particularly natural. An object providing the expected operation can
act as an implementation without formally inheriting from a common base class.

OCP therefore concerns the separation between stable consumers and replaceable behavior, not the use of inheritance.

## OCP and Abstractions

OCP depends heavily on choosing an appropriate abstraction boundary. The abstraction must represent the behavior that is
expected to vary while hiding implementation details from the stable consumer.

Consider:

```js
function processPayment(type, amount) {
    if (type === "card") {
        // ...
    } else if (type === "bank") {
        // ...
    } else if (type === "crypto") {
        // ...
    }
}
```

Payment method is a potential variation point. Instead of encoding every payment mechanism inside the processor, the
operation can be represented by an abstraction:

```js
class PaymentMethod {
    pay(amount) {
        throw new Error("Not implemented");
    }
}
```

Concrete implementations provide the variations:

```js
class CardPayment extends PaymentMethod {
    pay(amount) {
        // ...
    }
}

class BankTransferPayment extends PaymentMethod {
    pay(amount) {
        // ...
    }
}

class CryptoPayment extends PaymentMethod {
    pay(amount) {
        // ...
    }
}
```

The stable processing logic can then depend on the abstraction:

```js
class PaymentProcessor {
    process(paymentMethod, amount) {
        paymentMethod.pay(amount);
    }
}
```

A new payment mechanism extends the existing abstraction rather than requiring the processor to acquire another branch.

The quality of this design depends on the abstraction being correct. An abstraction that exposes provider-specific
details or combines unrelated variation points will merely move coupling rather than eliminate it.

## OCP Requires a Stable Boundary

Not every component should be closed for modification. Extensibility requires a place where variation is expected and a
stable boundary around that variation.

A useful architectural distinction is between stable policy and volatile implementation. The stable component should
depend on an abstraction that represents the capability it requires, while implementations behind that abstraction can
change or multiply independently.

The key question when applying OCP is therefore:

> Which part of this behavior is likely to vary?

That question should be answered using evidence from requirements, existing implementations, dependency boundaries, and
historical changes rather than by automatically introducing abstractions.

## Identifying Variation Points

OCP becomes useful when variation can be identified explicitly. Common variation points include payment methods, storage
providers, notification channels, pricing strategies, serialization formats, authentication mechanisms, shipping
methods, tax rules, report formats, algorithms, external providers, and business policies.

For example:

```js
function notify(channel, message) {
    if (channel === "email") {
        // ...
    }

    if (channel === "sms") {
        // ...
    }

    if (channel === "push") {
        // ...
    }
}
```

The notification channel represents a potential variation point. If new channels are expected to be introduced
independently, the sending behavior can be isolated behind a contract:

```js
class NotificationChannel {
    send(message) {
        throw new Error("Not implemented");
    }
}
```

Individual implementations can then evolve independently.

The existence of several branches is not sufficient by itself. The important question is whether those branches
represent implementations of a behavior that is expected to change independently.

## OCP and Conditional Statements

Conditional statements are not inherently violations of OCP.

For example:

```js
function classifyAge(age) {
    if (age < 13) {
        return "child";
    }

    if (age < 18) {
        return "teenager";
    }

    return "adult";
}
```

There is no meaningful polymorphic extension point here. Introducing separate classes for `Child`, `Teenager`, and
`Adult` would add complexity without providing useful extensibility.

OCP becomes more relevant when a conditional repeatedly grows because new implementations of the same conceptual
behavior are continually introduced.

```js
function calculateShipping(method, order) {
    if (method === "standard") {
        // ...
    } else if (method === "express") {
        // ...
    } else if (method === "overnight") {
        // ...
    } else if (method === "international") {
        // ...
    }
}
```

If shipping methods are expected to grow independently, the shipping method is a stronger candidate for an extension
point.

The problem is therefore not "conditional versus polymorphism." The relevant distinction is between a stable finite
decision and a repeatedly changing variation dimension.

## OCP and Switch Statements

A `switch` statement is likewise not automatically an OCP violation.

For example:

```js
function getDayName(day) {
    switch (day) {
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        default:
            return "Unknown";
    }
}
```

Replacing this with a polymorphic hierarchy would provide little value because the domain is finite and well-defined.

A different situation occurs when the cases represent implementations that are continually added:

```js
function renderShape(shape) {
    switch (shape.type) {
        case "circle":
            return renderCircle(shape);

        case "rectangle":
            return renderRectangle(shape);

        case "triangle":
            return renderTriangle(shape);

        default:
            throw new Error("Unsupported shape");
    }
}
```

If new shape types are continuously introduced, the renderer becomes a modification hotspot. An extensible shape
abstraction may then be more appropriate.

OCP should therefore be applied according to the nature of the change, not according to the syntactic form of the code.

## OCP and Data-Driven Design

Not every extensibility problem requires polymorphism. Sometimes the variation is better represented as data.

```js
const discounts = {
    regular: 0.05,
    premium: 0.10,
    vip: 0.20
};

function calculateDiscount(type, amount) {
    return amount * (discounts[type] ?? 0);
}
```

A new rate can be represented as data:

```js
discounts.employee = 0.25;
```

This approach is appropriate when the variation consists primarily of values or configuration rather than independent
algorithms.

OCP does not prescribe classes, inheritance, interfaces, or strategies. The appropriate extension mechanism depends on
the nature of the variation.

## OCP and Configuration

Configuration can also act as an extension mechanism.

```js
const formats = {
    json: JSONFormatter,
    xml: XmlFormatter,
    csv: CsvFormatter
};
```

The system can select implementations through configuration:

```js
function format(data, formatName) {
    const Formatter = formats[formatName];

    if (!Formatter) {
        throw new Error(`Unsupported format: ${formatName}`);
    }

    return new Formatter().format(data);
}
```

Adding a new format requires modifying the registration data, but the formatting infrastructure itself does not need to
change.

That distinction is important. OCP does not require that no source file anywhere in the application changes when a new
implementation is introduced. It requires that modification be localized to an appropriate boundary rather than
spreading into stable policy or infrastructure.

## OCP and Plugins

Plugin systems provide a strong architectural example of OCP.

A core application can define an extension contract:

```js
class Plugin {
    initialize(context) {
    }
}
```

Additional behavior can then be supplied by plugins:

```js
class AnalyticsPlugin extends Plugin {
    initialize(context) {
        // ...
    }
}

class LoggingPlugin extends Plugin {
    initialize(context) {
        // ...
    }
}
```

The core application does not need to be modified whenever another plugin is introduced.

At this scale, OCP becomes an architectural property rather than merely a property of individual classes. The core
system establishes a stable extension contract while independently developed implementations provide additional
capabilities.

## OCP and Dependency Inversion

OCP and the **Dependency Inversion Principle (DIP)** are closely related, although they answer different questions.

OCP asks:

> How can this behavior be extended without modifying stable code?

DIP asks:

> How should dependencies be structured so that high-level policy does not depend directly on volatile implementation
> details?

For example:

```js
class OrderService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    pay(order) {
        this.paymentGateway.charge(order.total);
    }
}
```

`OrderService` depends on a payment capability rather than directly constructing a particular provider.

Different implementations can satisfy that capability:

```js
class StripeGateway {
    charge(amount) {
        // ...
    }
}

class BankGateway {
    charge(amount) {
        // ...
    }
}
```

The service remains stable while the implementation can vary.

DIP therefore frequently provides the dependency structure required to establish OCP-friendly boundaries. The principles
remain distinct: DIP concerns the direction and abstraction of dependencies, while OCP concerns the ability to extend
behavior without repeatedly modifying stable code.

## OCP and Dependency Injection

Dependency Injection makes extension points explicit by allowing implementations to be supplied from outside the
component.

```js
class ReportService {
    constructor(formatter) {
        this.formatter = formatter;
    }

    generate(data) {
        return this.formatter.format(data);
    }
}
```

Different formatters can be injected:

```js
const jsonReport = new ReportService(new JsonFormatter());
const csvReport = new ReportService(new CsvFormatter());
const xmlReport = new ReportService(new XmlFormatter());
```

The service does not need to know which concrete formatter is being used.

Dependency Injection therefore supports OCP by separating implementation selection from the stable component. However,
DI does not automatically produce an OCP-compliant design. Injecting a dependency that has no meaningful variation point
simply moves construction elsewhere without creating useful extensibility.

## OCP and Strategy Pattern

The **Strategy Pattern** is one of the most direct implementations of OCP. A stable context delegates variable behavior
to a supplied strategy.

```js
class Checkout {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculateTotal(cart) {
        return this.pricingStrategy.calculate(cart);
    }
}
```

Different pricing algorithms can be represented independently:

```js
class RegularPricing {
    calculate(cart) {
        return cart.subtotal;
    }
}

class PromotionalPricing {
    calculate(cart) {
        return cart.subtotal * 0.9;
    }
}

class SeasonalPricing {
    calculate(cart) {
        return cart.subtotal * 0.8;
    }
}
```

The checkout implementation remains stable while pricing algorithms evolve independently.

In JavaScript, the same design can often be expressed more simply using functions:

```js
class Checkout {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculateTotal(cart) {
        return this.pricingStrategy(cart);
    }
}
```

The principle remains the same regardless of whether the strategy is represented by a class, object, or function.

## OCP and Template Method

The **Template Method Pattern** can also establish an OCP-oriented extension point. A base class defines the stable
workflow while subclasses provide variable steps.

```js
class DataImporter {
    import(source) {
        const data = this.read(source);
        const parsed = this.parse(data);

        return this.process(parsed);
    }

    read(source) {
        throw new Error("Not implemented");
    }

    parse(data) {
        throw new Error("Not implemented");
    }

    process(data) {
        throw new Error("Not implemented");
    }
}
```

A specialized implementation provides the variable behavior:

```js
class CsvImporter extends DataImporter {
    read(source) {
        // ...
    }

    parse(data) {
        // ...
    }

    process(data) {
        // ...
    }
}
```

The workflow remains stable while the implementation details vary.

Composition is often preferable in modern JavaScript because it avoids some of the coupling associated with inheritance,
but Template Method demonstrates that OCP is compatible with inheritance when the variation and hierarchy are
appropriate.

## OCP and Factory Method

Factories can isolate object creation from stable business logic.

```js
class NotificationService {
    constructor(channelFactory) {
        this.channelFactory = channelFactory;
    }

    send(type, message) {
        const channel = this.channelFactory.create(type);
        channel.send(message);
    }
}
```

The service delegates the volatile creation decision to another abstraction.

A factory can therefore prevent knowledge about concrete implementations from spreading throughout the application.

However, the factory itself may still need modification when a new implementation is introduced. This does not
automatically violate OCP. The important question is whether the modification has been localized to the appropriate
composition or registration boundary instead of forcing changes throughout stable business logic.

## OCP Does Not Mean "Never Modify Existing Code"

OCP is frequently misunderstood as a prohibition against modifying existing code.

Consider:

```js
class EmailNotifier {
    send(message) {
        // ...
    }
}
```

If the email implementation contains a bug, modifying the class is correct.

Likewise, if an existing requirement changes rather than being extended through an established variation point,
modifying the existing implementation may be the correct response.

OCP protects stable behavior from predictable extension. It does not freeze source code permanently.

## OCP Is Relative to the Expected Change

An abstraction is useful only relative to some meaningful variation.

Suppose:

```js
class Invoice {
    calculateTotal() {
        // ...
    }
}
```

If there is no evidence that invoice calculation will have multiple implementations, introducing an entire hierarchy
such as `InvoiceCalculator`, `InvoiceCalculatorFactory`, `InvoiceCalculatorStrategy`, and `InvoiceCalculatorProvider`
adds complexity without providing meaningful value.

OCP therefore requires a judgment about expected change:

> What kind of change is sufficiently likely, sufficiently costly, or sufficiently important that it deserves an
> extension point?

The answer should be based on evidence rather than abstract preference for extensibility.

## Predicting Variation

The difficult part of OCP is usually identifying the correct variation point, not implementing polymorphism.

Useful evidence includes:

* multiple existing implementations;
* repeated conditional branches for the same variation dimension;
* explicit product requirements for extensibility;
* multiple external providers;
* business rules that vary by tenant or context;
* configurable policies;
* plugin requirements;
* historical change patterns;
* independent teams owning different implementations.

Weak evidence includes statements such as "we might need this someday," "someone could request another implementation,"
or "interfaces are cleaner."

The stronger the evidence that a particular behavior will vary independently, the stronger the case for introducing an
extension boundary.

## OCP and Speculative Generalization

**Speculative generalization** occurs when abstractions are introduced for hypothetical future requirements.

For example:

```js
class AbstractUserRepositoryFactoryProvider {
    createRepositoryStrategy() {
        // ...
    }
}
```

If an application has one repository implementation and no evidence that multiple implementations are needed, this
structure is likely unnecessary.

The abstraction increases code volume, cognitive load, indirection, and maintenance cost without solving an actual
problem.

A simpler implementation can be modified later when a real extension requirement appears.

The practical rule is to design for likely and meaningful change rather than imaginary change.

## OCP and YAGNI

OCP should be balanced with **You Aren't Gonna Need It (YAGNI)**.

YAGNI discourages implementing functionality or abstractions that are not currently needed. OCP encourages protecting
stable code from predictable extensions. These principles can appear to conflict, but they address different design
decisions.

When there is strong evidence that a behavior will have multiple implementations, introducing an extension point may be
justified even before every implementation exists. When the variation is purely speculative, simplicity is usually
preferable.

Good architecture does not attempt to anticipate every possible future requirement. It anticipates changes for which
there is enough evidence to justify the associated complexity.

## OCP and Complexity

Every extension mechanism has a cost. A polymorphic design may introduce abstractions, implementations, factories,
dependency injection, configuration, registration, and additional indirection.

For stable behavior with no expected variation, that complexity is unnecessary. For highly volatile behavior with many
independent implementations, the same abstraction may provide substantial value.

The relevant question is therefore not:

> Can this be made extensible?

It is:

> Is this extension point worth the complexity it introduces?

OCP is valuable when the expected cost of repeatedly modifying stable code is greater than the cost of introducing and
maintaining the extension boundary.

## OCP and Coupling

OCP aims to reduce coupling between stable behavior and volatile implementations.

Without an appropriate boundary, a payment processor may contain knowledge of every concrete payment provider. Every new
provider then requires changes to the processor.

With an abstraction, the processor depends on a payment capability while concrete implementations remain behind that
boundary.

The resulting design does not eliminate coupling. The stable component is still coupled to the abstraction's contract,
and the composition layer is coupled to concrete implementations. The important improvement is that volatile
provider-specific details are prevented from contaminating the stable policy.

This distinction is fundamental to OCP: the goal is not zero coupling, but coupling arranged so that common changes do
not propagate unnecessarily.

## OCP and Change Amplification

A practical benefit of OCP is reduced change amplification.

Suppose a payment processor directly contains Stripe, bank-transfer, and cryptocurrency logic. Adding another provider
may require modifying the processor, changing its tests, reviewing interactions with existing branches, and redeploying
code that previously had no reason to change.

With an appropriate payment abstraction, adding a provider can instead consist primarily of implementing the existing
contract and registering the new implementation.

The new implementation still requires testing and integration work, but the stable payment workflow does not have to be
modified merely because another implementation exists.

OCP therefore tends to improve **change locality**: the code affected by a new variation is concentrated around that
variation and its composition boundary.

## OCP and Testing

OCP can reduce regression risk by isolating new implementations from stable consumers.

For example:

```js
class PaymentProcessor {
    constructor(gateway) {
        this.gateway = gateway;
    }

    process(amount) {
        return this.gateway.charge(amount);
    }
}
```

A new gateway can be implemented and tested independently:

```js
class NewPaymentGateway {
    charge(amount) {
        // new implementation
    }
}
```

Existing tests for `PaymentProcessor` can continue to verify the stable interaction contract, while tests specific to
`NewPaymentGateway` verify the new implementation.

This does not eliminate integration testing. The new implementation still has to be tested with the surrounding system.
OCP simply reduces the amount of stable code that must be modified or retested when the new implementation is
introduced.

## OCP and Versioning

OCP is particularly valuable in libraries and frameworks because their source code is often controlled by the library
author while extensions are controlled by consumers.

Suppose a library defines:

```js
class Serializer {
    serialize(value) {
        throw new Error("Not implemented");
    }
}
```

Consumers can implement additional serializers without modifying the library itself.

In this context, the extension boundary becomes part of the library's public contract. That makes the design more
sensitive to compatibility concerns: once consumers depend on an extension contract, changing that contract can itself
become a breaking change.

OCP therefore has particular significance at public API boundaries, where stable contracts can allow implementations to
evolve independently.

## OCP and APIs

Public APIs should be designed carefully because consumers may depend on their behavior for a long time.

For example:

```js
class PaymentGateway {
    charge(request) {
        // stable contract
    }
}
```

The implementation behind the contract can evolve while the public capability remains stable. Multiple providers can
implement the same contract, allowing application code to remain independent of provider-specific details.

OCP at an API boundary therefore means more than adding an interface. It means defining a contract that is sufficiently
stable and general to support legitimate implementations without exposing unnecessary implementation-specific
assumptions.

## OCP and Modules

OCP does not require classes.

A module can expose stable functionality while accepting variable behavior through functions:

```js
export function calculateTotal(cart, pricing) {
    return pricing(cart);
}
```

Different pricing implementations can then be supplied:

```js
const regularPricing = cart => cart.subtotal;

const promotionalPricing = cart =>
    cart.subtotal * 0.9;

calculateTotal(cart, regularPricing);
calculateTotal(cart, promotionalPricing);
```

The stable consumer is closed with respect to new pricing algorithms because those algorithms are represented as
supplied behavior rather than embedded in the consumer.

This style is often preferable in JavaScript when the variation can be expressed naturally as a function.

## OCP in JavaScript

JavaScript provides many mechanisms for implementing OCP, including functions, higher-order functions, objects,
composition, prototypes, classes, modules, dependency injection, configuration, registries, and plugin systems.

For example, a higher-order function can create a calculator around a supplied policy:

```js
function createDiscountCalculator(discountPolicy) {
    return function calculate(amount) {
        return discountPolicy(amount);
    };
}
```

Different policies can be supplied as functions:

```js
const premiumDiscount = amount => amount * 0.10;
const vipDiscount = amount => amount * 0.20;

const premiumCalculator =
    createDiscountCalculator(premiumDiscount);

const vipCalculator =
    createDiscountCalculator(vipDiscount);
```

No class hierarchy is necessary. JavaScript's first-class functions make this form of extension particularly
lightweight.

## OCP and Structural Typing

JavaScript's dynamic nature makes behavioral contracts particularly important.

Consider:

```js
function processPayment(paymentMethod, amount) {
    paymentMethod.pay(amount);
}
```

Any object providing the required `pay()` operation can participate:

```js
const cardPayment = {
    pay(amount) {
        // ...
    }
};

const bankPayment = {
    pay(amount) {
        // ...
    }
};
```

The consumer does not need to know the concrete type of either object.

This is a natural form of polymorphism in JavaScript. The contract is based on supported behavior rather than nominal
inheritance.

The same principle becomes explicit in TypeScript through structural typing.

## OCP and TypeScript

TypeScript can make extension contracts more explicit with interfaces.

```ts
interface PaymentGateway {
    charge(amount: number): Promise<void>;
}
```

Implementations can satisfy the contract:

```ts
class CardGateway implements PaymentGateway {
    async charge(amount: number) {
        // ...
    }
}

class BankGateway implements PaymentGateway {
    async charge(amount: number) {
        // ...
    }
}
```

The consumer depends on the abstraction:

```ts
class PaymentService {
    constructor(private gateway: PaymentGateway) {
    }

    async pay(amount: number) {
        await this.gateway.charge(amount);
    }
}
```

The interface establishes a clear behavioral boundary between the service and its implementations.

TypeScript does not create OCP automatically. An interface can still represent a poor abstraction, expose unnecessary
details, or exist without meaningful variation. The interface is useful when it represents a real boundary between
stable policy and replaceable behavior.

## OCP and Composition Over Inheritance

OCP is frequently easier to implement through composition than inheritance.

Instead of representing every pricing variation as a subclass:

```js
class PremiumCheckout extends Checkout {
}

class VipCheckout extends Checkout {
}

class EmployeeCheckout extends Checkout {
}
```

the variation can be supplied as a policy:

```js
class Checkout {
    constructor(discountPolicy) {
        this.discountPolicy = discountPolicy;
    }

    calculateTotal(cart) {
        return this.discountPolicy.calculate(cart);
    }
}
```

Composition allows multiple dimensions of behavior to vary independently and avoids creating subclasses solely to
combine different combinations of behavior.

This is particularly important when a system has several independent variation dimensions.

## OCP and Multiple Variation Dimensions

Inheritance becomes problematic when a hierarchy attempts to represent multiple independent axes of variation.

Suppose an order-processing system varies according to payment type, region, and pricing policy. Representing every
combination through subclasses can quickly produce a large number of specialized classes.

The problem is not simply the number of classes. Each independent variation dimension multiplies the number of
combinations that the hierarchy must represent.

Composition allows those dimensions to remain independent:

```js
class OrderProcessor {
    constructor(payment, pricing, regionPolicy) {
        this.payment = payment;
        this.pricing = pricing;
        this.regionPolicy = regionPolicy;
    }
}
```

Payment behavior can evolve independently of pricing, and pricing can evolve independently of regional policy.

This is one reason composition is often a stronger mechanism for implementing OCP than inheritance.

## OCP and Stable Dependencies

A useful architectural objective is to keep stable policy independent from volatile implementation details.

This is particularly important at boundaries involving databases, message brokers, external APIs, payment providers,
cloud services, file formats, and notification systems.

The stable application logic should depend on the capability it requires rather than on the concrete technology that
currently provides that capability.

This does not mean every external dependency needs an interface. It means that when a dependency represents a meaningful
and independently changing variation point, the boundary should prevent that volatility from unnecessarily propagating
into stable policy.

## OCP and the Database

Consider a service that constructs its persistence implementation directly:

```js
class UserService {
    constructor() {
        this.database = new PostgresDatabase();
    }

    save(user) {
        this.database.insert(user);
    }
}
```

The service is directly coupled to PostgreSQL.

A more extensible design can depend on a repository capability:

```js
class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    save(user) {
        this.repository.save(user);
    }
}
```

Different persistence implementations can provide that capability:

```js
class PostgresUserRepository {
    save(user) {
        // ...
    }
}

class MongoUserRepository {
    save(user) {
        // ...
    }
}
```

The service remains stable if the persistence implementation changes.

However, this abstraction is justified only when persistence implementation is actually a meaningful variation point. If
the application is permanently coupled to PostgreSQL by design and there is no reason to support another implementation,
introducing a repository abstraction solely to satisfy OCP may add unnecessary indirection.

## OCP and External APIs

External APIs are frequently volatile dependencies.

Consider:

```js
class ShippingService {
    async ship(order) {
        return fetch("https://provider.example.com/ship", {
            method: "POST",
            body: JSON.stringify(order)
        });
    }
}
```

The service contains provider-specific integration details.

Those details can be isolated behind a provider capability:

```js
class ShippingService {
    constructor(provider) {
        this.provider = provider;
    }

    ship(order) {
        return this.provider.ship(order);
    }
}
```

A second provider can then be introduced without modifying the shipping workflow.

The abstraction protects application policy from provider-specific protocol details, request construction,
authentication mechanisms, and response handling.

## OCP Does Not Mean Every Dependency Needs an Interface

A common over-application of OCP is introducing an abstraction around every dependency.

For example, a codebase may accumulate structures such as:

```text
IUserService
IUserServiceFactory
IUserServiceProvider
IUserServiceStrategy
```

without having any meaningful variation between implementations.

This does not create useful extensibility. It creates additional types, indirection, and maintenance work.

An abstraction is valuable when it separates a meaningful variation point or establishes an important architectural
boundary. It is not valuable merely because a principle recommends abstractions.

## OCP and Existing Code

When introducing OCP into an existing system, the process should begin with change rather than abstraction.

First identify code that changes frequently. Determine why it changes and whether those changes represent distinct
variations of the same behavior. Then identify the stable behavior surrounding those variations and extract the volatile
behavior behind an appropriate boundary.

The stable component should depend on that boundary, while new implementations should be added through the extension
point. Existing conditionals that existed solely to distinguish implementations can then be removed from the stable
component.

The resulting design should be evaluated after the refactoring. The goal is not simply to increase the number of classes
or abstractions. The goal is to produce a clearer and more localized change boundary.

## OCP Refactoring Example

Consider a report service that contains all formatting implementations:

```js
class ReportService {
    generate(data, format) {
        if (format === "json") {
            return JSON.stringify(data);
        }

        if (format === "csv") {
            return convertToCsv(data);
        }

        if (format === "xml") {
            return convertToXml(data);
        }

        throw new Error("Unsupported format");
    }
}
```

If report formats are expected to grow independently, formatting can be isolated:

```js
class ReportService {
    constructor(formatter) {
        this.formatter = formatter;
    }

    generate(data) {
        return this.formatter.format(data);
    }
}
```

The individual implementations provide the variation:

```js
class JsonFormatter {
    format(data) {
        return JSON.stringify(data);
    }
}

class CsvFormatter {
    format(data) {
        return convertToCsv(data);
    }
}

class XmlFormatter {
    format(data) {
        return convertToXml(data);
    }
}
```

Adding another formatter no longer requires modifying `ReportService`.

The improvement is not simply that there are more classes. The important change is that report generation is now stable
with respect to the addition of formatting implementations.

## The Registration Problem

Extensible systems frequently require a registration or composition mechanism.

For example:

```js
const formatters = new Map();

formatters.set("json", new JsonFormatter());
formatters.set("csv", new CsvFormatter());
formatters.set("xml", new XmlFormatter());
```

Adding another formatter still requires registration:

```js
formatters.set("yaml", new YamlFormatter());
```

This does not necessarily violate OCP.

Some component must know which implementations are available. In a conventional application, that knowledge belongs
naturally in the composition or registration boundary.

The important distinction is that the modification is localized there rather than forcing the stable reporting logic to
change.

OCP therefore does not require an implementation to appear magically without modifying any code anywhere. It requires
the modification required by an extension to occur in the appropriate part of the system.

## OCP and the Composition Root

Dependency Injection systems commonly have a **composition root** where concrete implementations are assembled.

For example:

```js
const paymentGateway = new StripeGateway();

const paymentService =
    new PaymentService(paymentGateway);
```

`PaymentService` remains independent of the concrete provider. The composition root is intentionally the location where
the application selects concrete implementations.

This leads to an important qualification of OCP:

> OCP does not require every part of the system to be closed to modification. It requires changes to be localized to
> appropriate extension and composition boundaries.

The composition root is often one of the places where modification is expected when an application adopts another
implementation.

## OCP and Architecture

At an architectural level, OCP encourages stable policy to remain independent from volatile technical and implementation
details.

For example, application policy may depend on abstractions representing persistence, messaging, external services, or
other capabilities while concrete infrastructure implementations remain outside those policy decisions.

This arrangement allows infrastructure technologies to change without forcing corresponding changes throughout the
application policy.

OCP therefore extends beyond individual classes. The same reasoning can be applied to modules, packages, subsystems,
plugins, and system boundaries whenever one part is expected to remain stable while another part evolves independently.

## Common OCP Violations

### Growing Conditional Logic

A common violation occurs when a conditional grows continuously because new implementations are repeatedly added:

```js
if (type === "a") {
} else if (type === "b") {
} else if (type === "c") {
} else if (type === "d") {
}
```

The conditional itself is not inherently wrong. The concern is the repeated modification of stable logic to accommodate
every new implementation of the same variation.

### Type-Based Behavior

Another warning sign is a consumer that explicitly identifies every concrete implementation:

```js
function process(payment) {
    if (payment instanceof CardPayment) {
        // ...
    }

    if (payment instanceof BankPayment) {
        // ...
    }
}
```

The consumer is now coupled to the concrete types it is supposed to be independent of. Adding another payment type
requires modifying the consumer.

Polymorphism is often more appropriate when the behavior represents a genuine extension point.

### Centralized Provider Logic

A central provider switch can become a maintenance hotspot:

```js
switch (provider) {
    case "stripe":
        // ...
        break;

    case "paypal":
        // ...
        break;

    case "adyen":
        // ...
        break;
}
```

When providers are expected to grow independently, provider-specific behavior is a candidate for isolation behind a
common capability.

### Repeated Modification of Stable Components

Historical change is often stronger evidence than theoretical predictions.

If a payment processor has been modified repeatedly because a new provider was added in January, another in February,
another in March, and another in April, that pattern provides concrete evidence that provider selection is a volatile
variation dimension.

Repeated changes of the same kind are a strong signal that the architecture may benefit from an extension point.

## OCP Is Not a Requirement to Eliminate All Conditionals

Conditionals are useful for simple business rules, bounded state spaces, input validation, exceptional cases, and finite
mappings.

For example:

```js
function getMonthName(month) {
    const names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return names[month - 1];
}
```

There is no need for a `Month` class hierarchy merely because twelve possible values exist.

OCP should be applied where extension is meaningful. Turning every conditional or finite mapping into an abstraction
increases complexity without necessarily improving change isolation.

## OCP and Open Source Libraries

For open source libraries, OCP can be especially valuable because consumers may need capabilities that the original
author did not anticipate.

A library can expose an extension API:

```js
export function registerFormatter(name, formatter) {
    // ...
}
```

Consumers can then provide additional implementations:

```js
registerFormatter("yaml", {
    format(data) {
        // ...
    }
});
```

The library's core does not need to be modified for every consumer-specific extension.

This is a natural extension-oriented API design because the library explicitly establishes where consumers are permitted
to introduce behavior.

## OCP and Security

Extension boundaries can also help structure security-sensitive integrations by defining what an implementation is
permitted to do.

For example, an extension contract can specify allowed operations, expected inputs and outputs, error semantics, timeout
behavior, and authorization requirements.

However, OCP itself does not provide security. An abstraction that permits arbitrary behavior does not make that
behavior trustworthy. Security controls must be explicitly designed around the extension boundary.

The value of OCP in this context is architectural containment: volatile or externally supplied behavior can be kept
behind a defined contract rather than being embedded throughout stable policy.

## OCP and Performance

Abstraction mechanisms can introduce additional function calls, dynamic dispatch, object allocation, and indirection.

For most application-level code, these costs are negligible compared with the maintainability benefits of a
well-justified extension boundary. However, performance-sensitive code may have different requirements.

OCP should not be used as a blanket justification for abstraction in hot paths where the additional indirection has
measurable cost and the variation is not sufficiently valuable to justify it.

Performance requirements should be evaluated with evidence rather than assumed either way.

## OCP and Trade-Offs

| Benefit                             | Cost                       |
|:------------------------------------|:---------------------------|
| Localizes extensions                | Additional abstractions    |
| Reduces modification of stable code | More indirection           |
| Reduces regression risk             | More implementation types  |
| Supports plugins                    | Registration complexity    |
| Supports multiple providers         | Dependency wiring          |
| Encourages modularity               | Potential over-engineering |
| Enables independent testing         | Larger conceptual surface  |

The principle becomes valuable when the expected cost of future modification exceeds the cost of introducing and
maintaining the extension boundary.

The opposite is also true. If the behavior is stable and there is no meaningful evidence of variation, introducing an
abstraction can make the system worse.

## Best Practices

* **Identify real variation points.** Create extension boundaries around behavior that is actually expected to vary
  rather than around every theoretically possible future requirement.

* **Protect stable code from volatile behavior.** Keep changing implementations behind boundaries that prevent their
  details from spreading into stable policy.

* **Prefer composition when practical.** Strategies, injected functions, objects, and modules often provide simpler
  extension mechanisms than inheritance.

* **Do not treat conditionals as automatic violations.** A conditional is a problem when it represents a meaningful and
  repeatedly changing variation point, not merely because it exists.

* **Localize unavoidable modification.** Registration and composition code may legitimately change when a new
  implementation is introduced.

* **Use dependency inversion to support extensibility.** Stable policy should depend on appropriate abstractions rather
  than directly on volatile implementation details.

* **Use historical change as evidence.** Repeated modifications in the same variation dimension are strong evidence that
  an extension point may be justified.

* **Avoid speculative abstractions.** Design for probable and meaningful change rather than every imaginable future
  requirement.

* **Avoid interface proliferation.** Not every class needs an interface, factory, strategy, provider, or additional
  abstraction.

* **Prefer independent variation dimensions.** Composition prevents inheritance hierarchies from becoming combinatorial
  when multiple behaviors vary independently.

* **Keep extension contracts focused.** A narrow behavioral contract is easier to implement and less likely to couple
  extensions to irrelevant details.

* **Test stable consumers and individual extensions separately.** This keeps regression testing localized while still
  allowing integration behavior to be verified.

* **Keep the composition root explicit.** Concrete implementations should be assembled in an appropriate composition
  boundary.

* **Evaluate complexity costs.** An extension mechanism is justified only when its benefits exceed the indirection and
  maintenance cost it introduces.

* **Apply OCP at the appropriate architectural level.** The relevant boundary may be a function, module, class, package,
  subsystem, public API, or plugin architecture.

## Summary

The Open-Closed Principle is about designing software so that **predictable extensions can be introduced without
repeatedly modifying stable behavior**.

OCP does not mean that existing code can never change, that every conditional is bad, that every class needs an
interface, that inheritance is required, or that every component must be designed for unlimited future extensibility. It
also does not justify speculative abstractions created solely because another implementation might theoretically exist.

Instead, OCP encourages identifying stable behavior and volatile variation, then placing an appropriate boundary between
them. That boundary may be implemented using polymorphism, composition, functions, modules, configuration, dependency
injection, registries, factories, or plugin contracts.

The central practical question is:

> **Which part of this behavior is expected to vary, and can that variation be isolated so that stable code does not
need to change every time a new implementation appears?**

When meaningful variation exists, an extension point can reduce coupling, change amplification, and regression risk.
When meaningful variation does not exist, introducing one usually adds complexity without providing corresponding value.

OCP is therefore not a mandate to make software maximally extensible. It is a principle for making **the right parts of
software extensible while keeping stable parts stable**.

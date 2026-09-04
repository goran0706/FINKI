# Abstract Factory

**Abstract Factory** is a creational design pattern that provides an interface for creating **families of related or
dependent objects without specifying their concrete classes**.

The pattern is useful when a system needs multiple products that must be created consistently as a compatible family.
The client works with abstract product interfaces and an abstract factory rather than directly instantiating concrete
implementations.

The central design problem is not simply object creation. It is **coordinated creation of related products while keeping
the client independent of their concrete implementations**.

## Intent

The intent of Abstract Factory is to:

* Provide an interface for creating related objects.
* Keep concrete product classes hidden from clients.
* Ensure products belonging to the same family are compatible.
* Allow an entire product family to be replaced without changing client code.
* Centralize family-specific creation decisions.
* Separate product usage from product construction.

The pattern is particularly valuable when several objects must vary together.

For example, an application may support multiple UI themes. Each theme may define a button, dialog, checkbox, and input
component. The client should not accidentally combine components from incompatible themes.

Abstract Factory allows the application to select one factory representing the desired family and obtain all products
from that family.

## The Problem

Consider an application that supports multiple platforms.

Each platform requires its own implementations of several related components:

```js id="4k5n7s"
class WindowsButton {
    render() {
        return "Windows button";
    }
}

class WindowsCheckbox {
    render() {
        return "Windows checkbox";
    }
}

class MacButton {
    render() {
        return "Mac button";
    }
}

class MacCheckbox {
    render() {
        return "Mac checkbox";
    }
```

A client that creates these classes directly becomes coupled to the concrete product implementations:

```js id="8q2m1p"
const button = new WindowsButton();
const checkbox = new WindowsCheckbox();
```

The problem becomes more significant when the application must select the product family dynamically.

The client would need to contain platform-specific creation logic:

```js id="x7v3c9"
if (platform === "windows") {
    button = new WindowsButton();
    checkbox = new WindowsCheckbox();
} else if (platform === "mac") {
    button = new MacButton();
    checkbox = new MacCheckbox();
}
```

As the number of products and families grows, creation logic becomes increasingly coupled to concrete classes.

Abstract Factory moves that family-specific creation logic behind a common factory interface.

## Product Families

The defining concept of Abstract Factory is the **product family**.

A product family is a group of related products that are intended to work together.

For example:

| Product type | Windows family  | Mac family  |
|--------------|-----------------|-------------|
| Button       | WindowsButton   | MacButton   |
| Checkbox     | WindowsCheckbox | MacCheckbox |
| Dialog       | WindowsDialog   | MacDialog   |

The individual products belong to corresponding product types:

* Button
* Checkbox
* Dialog

The concrete implementations belong to a particular family:

* Windows
* Mac

The Abstract Factory provides creation operations for the product types while each concrete factory supplies
implementations from one specific family.

## Abstract Factory Structure

The conceptual participants are:

| Participant      | Responsibility                                  |
|------------------|-------------------------------------------------|
| Abstract Factory | Declares operations for creating products       |
| Concrete Factory | Creates products belonging to one family        |
| Abstract Product | Defines the interface of a product type         |
| Concrete Product | Implements a product for a specific family      |
| Client           | Uses abstract products and the abstract factory |

The client depends on the factory and product abstractions rather than the concrete implementations.

The concrete factory determines which concrete products are created.

## Abstract Factory Example

The product interfaces can be represented with JavaScript classes:

```js id="n2d6q8"
class Button {
    render() {
        throw new Error("Not implemented");
    }
}

class Checkbox {
    render() {
        throw new Error("Not implemented");
    }
}
```

Concrete products implement those product types:

```js id="r4m8t1"
class WindowsButton extends Button {
    render() {
        return "Windows button";
    }
}

class WindowsCheckbox extends Checkbox {
    render() {
        return "Windows checkbox";
    }
}

class MacButton extends Button {
    render() {
        return "Mac button";
    }
}

class MacCheckbox extends Checkbox {
    render() {
        return "Mac checkbox";
    }
}
```

The abstract factory defines the product creation operations:

```js id="p9v3k2"
class GUIFactory {
    createButton() {
        throw new Error("Not implemented");
    }

    createCheckbox() {
        throw new Error("Not implemented");
    }
}
```

Concrete factories create products from their respective families:

```js id="w5c7m4"
class WindowsFactory extends GUIFactory {
    createButton() {
        return new WindowsButton();
    }

    createCheckbox() {
        return new WindowsCheckbox();
    }
}

class MacFactory extends GUIFactory {
    createButton() {
        return new MacButton();
    }

    createCheckbox() {
        return new MacCheckbox();
    }
}
```

The client depends only on the factory interface:

```js id="z8h2q6"
function renderUI(factory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();

    return {
        button: button.render(),
        checkbox: checkbox.render()
    };
}
```

The family can be selected externally:

```js id="m3x7r5"
const factory = new WindowsFactory();

const ui = renderUI(factory);
```

The client does not need to know that `WindowsFactory` creates `WindowsButton` and `WindowsCheckbox`.

## Family Consistency

One of the most important properties of Abstract Factory is **family consistency**.

Suppose the system accidentally combines products from different families:

```js id="b6q4t9"
const button = new WindowsButton();
const checkbox = new MacCheckbox();
```

The individual objects may satisfy their respective interfaces, but they may not be compatible from a product-family
perspective.

Abstract Factory makes it natural for the client to obtain both products from the same factory:

```js id="f2k8p5"
const factory = new WindowsFactory();

const button = factory.createButton();
const checkbox = factory.createCheckbox();
```

The factory establishes the family boundary.

This is one of the main reasons Abstract Factory is more specific than simply using multiple factory functions.

## Client Dependency

The client should depend on abstractions representing the factory and products.

Conceptually, the dependency should be:

```text
Client
  ↓
Abstract Factory
  ↓
Abstract Products
```

rather than directly connecting the client to every concrete product.

In JavaScript, these abstractions do not necessarily need to be classes. They can be represented by conventions,
functions, objects, TypeScript interfaces, or other mechanisms appropriate to the application.

The essential property is that the client does not need concrete product knowledge to perform its work.

## Factory Selection

Abstract Factory does not necessarily determine which concrete factory should be used.

Factory selection can occur elsewhere.

For example:

```js id="e7n4s2"
function createFactory(platform) {
    switch (platform) {
        case "windows":
            return new WindowsFactory();

        case "mac":
            return new MacFactory();

        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}
```

The application can then select the factory once:

```js id="u5c9k3"
const factory = createFactory(platform);

renderUI(factory);
```

The client remains independent of the concrete products.

This separation is important. Abstract Factory handles **family-specific product creation**; it does not require the
pattern itself to contain the application's entire factory-selection mechanism.

## JavaScript Implementation

JavaScript does not require the traditional GoF class hierarchy.

An Abstract Factory can often be expressed more simply using objects containing creation functions:

```js id="q4m7x8"
const windowsFactory = {
    createButton: () => ({
        render: () => "Windows button"
    }),

    createCheckbox: () => ({
        render: () => "Windows checkbox"
    })
};

const macFactory = {
    createButton: () => ({
        render: () => "Mac button"
    }),

    createCheckbox: () => ({
        render: () => "Mac checkbox"
    })
};
```

The client can consume either factory through the same contract:

```js id="s8v2k6"
function renderUI(factory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();

    return {
        button: button.render(),
        checkbox: checkbox.render()
    };
}
```

The design concept remains the same even though there are no abstract or concrete factory classes.

## TypeScript Implementation

TypeScript can express the Abstract Factory contract explicitly through interfaces:

```ts id="t6p3w9"
interface Button {
    render(): string;
}

interface Checkbox {
    render(): string;
}

interface GUIFactory {
    createButton(): Button;

    createCheckbox(): Checkbox;
}
```

Concrete products implement the product interfaces:

```ts id="a7r4m2"
class WindowsButton implements Button {
    render(): string {
        return "Windows button";
    }
}

class WindowsCheckbox implements Checkbox {
    render(): string {
        return "Windows checkbox";
    }
}

class MacButton implements Button {
    render(): string {
        return "Mac button";
    }
}

class MacCheckbox implements Checkbox {
    render(): string {
        return "Mac checkbox";
    }
}
```

Concrete factories implement the factory interface:

```ts id="k9v5c1"
class WindowsFactory implements GUIFactory {
    createButton(): Button {
        return new WindowsButton();
    }

    createCheckbox(): Checkbox {
        return new WindowsCheckbox();
    }
}

class MacFactory implements GUIFactory {
    createButton(): Button {
        return new MacButton();
    }

    createCheckbox(): Checkbox {
        return new MacCheckbox();
    }
}
```

The client depends only on the abstraction:

```ts id="d3x8q7"
function renderUI(factory: GUIFactory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();

    return {
        button: button.render(),
        checkbox: checkbox.render()
    };
}
```

TypeScript is particularly useful for Abstract Factory because the factory interface can explicitly guarantee that every
concrete factory provides the complete set of product-creation operations.

## Abstract Factory as a Family Contract

The factory interface does more than provide construction methods. It defines the **shape of a product family**.

For example:

```ts id="v2m6r4"
interface GUIFactory {
    createButton(): Button;

    createCheckbox(): Checkbox;

    createDialog(): Dialog;
}
```

Every concrete factory must provide all three products.

This provides a strong form of family-level consistency.

Adding a new product type can therefore have a deliberate architectural impact: every factory must decide how that
product is implemented.

This characteristic is both a benefit and a cost.

## Adding a New Product Family

Adding a new product family is generally straightforward.

Suppose a Linux family is introduced:

```js id="j5q8n3"
class LinuxButton extends Button {
    render() {
        return "Linux button";
    }
}

class LinuxCheckbox extends Checkbox {
    render() {
        return "Linux checkbox";
    }
}
```

A corresponding factory can create the entire family:

```js id="c4w7p2"
class LinuxFactory extends GUIFactory {
    createButton() {
        return new LinuxButton();
    }

    createCheckbox() {
        return new LinuxCheckbox();
    }
}
```

Existing client code can continue to work:

```js id="h8m3r6"
renderUI(new LinuxFactory());
```

The client does not need to know the concrete product classes.

## Adding a New Product Type

Adding a new product type has a different cost.

Suppose the system introduces `Slider`.

The abstract factory must now include:

```js id="y6p2k9"
class GUIFactory {
    createButton() {
        throw new Error("Not implemented");
    }

    createCheckbox() {
        throw new Error("Not implemented");
    }

    createSlider() {
        throw new Error("Not implemented");
    }
}
```

Every concrete factory must implement the new operation.

This means Abstract Factory is generally favorable when **product families are expected to vary more frequently than the
set of product types**.

That trade-off is fundamental to the pattern.

## Product Families Versus Product Types

The most important design question is whether the system has two dimensions of variation:

1. Which product type is being created?
2. Which family does that product belong to?

For example:

| Product type | Family A  | Family B  | Family C  |
|--------------|-----------|-----------|-----------|
| Button       | AButton   | BButton   | CButton   |
| Checkbox     | ACheckbox | BCheckbox | CCheckbox |
| Dialog       | ADialog   | BDialog   | CDialog   |

Abstract Factory makes the family dimension explicit.

The client chooses a family and then creates products within that family.

## When Abstract Factory Is Appropriate

Abstract Factory is particularly appropriate when:

* Multiple related products must be created together.
* Products belong to identifiable families.
* Product compatibility matters.
* The client should remain independent of concrete product classes.
* The entire product family may need to be replaced.
* Product creation is sufficiently complex or variable to justify an abstraction.
* New families are expected to be introduced over time.

Typical examples include platform-specific UI components, database-provider-specific components, cloud-provider
abstractions, document-format families, and theme-specific component sets.

## When Abstract Factory Is Unnecessary

Abstract Factory is usually unnecessary when there is only one product type or no meaningful family relationship.

For example, this may be excessive:

```js id="n7c4x5"
const factory = {
    createUser: () => new User()
};
```

If there is no family of related products and construction does not need to be isolated, direct construction may be
clearer:

```js id="r2m8k6"
const user = new User();
```

Likewise, introducing an Abstract Factory solely because the application contains `new` expressions does not provide a
meaningful design benefit.

The pattern should solve a real family-creation problem.

## Abstract Factory Versus Factory Method

Abstract Factory and Factory Method are closely related but solve different problems.

**Factory Method** delegates the creation of a product to a method and is typically associated with a creator
abstraction and an individual product type.

**Abstract Factory** provides multiple creation operations for a family of related products.

| Concern              | Factory Method                    | Abstract Factory                        |
|----------------------|-----------------------------------|-----------------------------------------|
| Primary scope        | Individual product creation       | Product family creation                 |
| Creation operations  | Typically one factory method      | Multiple product-creation methods       |
| Main variation       | Which concrete product is created | Which compatible product family is used |
| Typical relationship | Creator → Product                 | Factory → Multiple Products             |

An Abstract Factory can itself use Factory Methods internally. The patterns are not mutually exclusive.

## Abstract Factory Versus Simple Factory

A simple factory centralizes creation of one or more products but does not necessarily establish the GoF Abstract
Factory structure.

For example:

```js id="p8v4q2"
function createButton(platform) {
    if (platform === "windows") {
        return new WindowsButton();
    }

    if (platform === "mac") {
        return new MacButton();
    }

    throw new Error(`Unsupported platform: ${platform}`);
}
```

This is a factory function, but it does not by itself represent Abstract Factory.

Abstract Factory is concerned with a **family-level creation contract**.

## Abstract Factory Versus Factory Function

JavaScript makes factory functions extremely convenient:

```js id="x5k9m3"
function createButton(theme) {
    return {
        render() {
            return `${theme} button`;
        }
    };
}
```

There is no reason to introduce Abstract Factory merely because a factory function exists.

Abstract Factory becomes relevant when several related creation operations must be coordinated around the same family:

```js id="g3r7w8"
const factory = {
    createButton,
    createCheckbox,
    createDialog
};
```

The factory becomes a family-level abstraction rather than a single construction helper.

## Abstract Factory Versus Builder

Builder and Abstract Factory both concern object creation, but they address different dimensions.

**Builder** separates the construction process of a complex object from its representation.

**Abstract Factory** selects and creates a family of related objects.

Builder is concerned with **how one complex product is constructed**. Abstract Factory is concerned with **which
compatible family of products should be created**.

They can also be combined. A concrete factory may use builders internally when individual products require complex
construction.

## Abstract Factory Versus Prototype

Prototype creates objects by cloning existing instances. Abstract Factory creates products through family-specific
creation operations.

Prototype is useful when the existing object's configuration or state serves as the basis for a new instance.

Abstract Factory is useful when the application needs a consistent family of concrete implementations.

The two can also be combined if a concrete factory creates products by cloning registered prototypes.

## Abstract Factory and Dependency Injection

Abstract Factory can be used as a dependency-injection mechanism when a component needs to create several related
dependencies.

For example:

```js id="m4c8v1"
class Application {
    constructor(factory) {
        this.factory = factory;
    }

    start() {
        const logger = this.factory.createLogger();
        const repository = this.factory.createRepository();

        return {
            logger,
            repository
        };
    }
}
```

The application does not need to know which concrete implementations are being created.

However, Dependency Injection and Abstract Factory are different concepts.

Dependency Injection is about supplying dependencies from outside. Abstract Factory is about encapsulating the creation
of related products.

A factory can be injected, but injecting a factory does not make every dependency-injection design an Abstract Factory.

## Abstract Factory and Dependency Inversion

Abstract Factory can support the Dependency Inversion Principle by preventing high-level code from depending directly on
concrete product implementations.

For example:

```js id="q7w3n6"
class CheckoutService {
    constructor(factory) {
        this.factory = factory;
    }

    checkout(order) {
        const payment = this.factory.createPayment();
        const notifier = this.factory.createNotifier();

        payment.charge(order);
        notifier.send(order);
    }
}
```

The service depends on the factory contract rather than directly constructing provider-specific implementations.

The pattern does not automatically guarantee Dependency Inversion. The abstractions must still be correctly owned and
designed.

## Abstract Factory and Configuration

Abstract Factory is often selected according to configuration.

For example:

```js id="v8p2c5"
const factories = {
    production: productionFactory,
    testing: testingFactory
};

const factory = factories[environment];
```

The rest of the application can operate through the selected factory.

This can be useful when an entire implementation family changes between environments.

However, configuration-based object selection does not automatically require Abstract Factory. If only one dependency
varies, a simpler dependency-injection mechanism may be sufficient.

## Abstract Factory and Testing

Abstract Factory can make testing easier when a complete family of test doubles is required.

For example:

```js id="a6m9r4"
const testFactory = {
    createPayment: () => new FakePayment(),
    createNotifier: () => new FakeNotifier(),
    createRepository: () => new FakeRepository()
};
```

A component can receive the test factory instead of the production factory.

This can prevent accidental mixing of production and test implementations.

However, if only one dependency needs to be replaced, injecting that dependency directly is usually simpler than
introducing an entire factory abstraction.

## Family Compatibility

One of the strongest reasons to use Abstract Factory is to prevent incompatible product combinations.

Consider a rendering system where each product family corresponds to a specific rendering technology. A button, dialog,
and menu created from one family should use compatible rendering primitives.

The factory creates the products as a coherent unit:

```js id="f9k3w7"
const factory = createRenderingFactory("svg");

const button = factory.createButton();
const dialog = factory.createDialog();
const menu = factory.createMenu();
```

The client does not have to independently select the implementation of each product.

This reduces the possibility of accidentally combining incompatible implementations.

## Runtime Family Switching

Abstract Factory can support runtime selection of a product family.

For example:

```js id="c8q5m2"
function createUI(platform) {
    const factory = createFactory(platform);

    return {
        button: factory.createButton(),
        checkbox: factory.createCheckbox(),
        dialog: factory.createDialog()
    };
}
```

The application can select a family based on configuration, environment, user preference, platform, tenant, or another
runtime concern.

The important point is that the client interacts with the family abstraction rather than repeating the selection logic
for every product.

## Static Versus Dynamic Family Selection

The family can be selected once during application composition:

```js id="r5v8k3"
const factory = createFactory(config.platform);

const application = new Application(factory);
```

This is often preferable when the family should remain stable throughout the application's lifetime.

Alternatively, a factory can be selected dynamically for individual operations when the family genuinely changes at
runtime.

The pattern does not require runtime switching. It only provides the abstraction necessary to represent product families
independently from the client.

## Generic Abstract Factory in TypeScript

TypeScript can model a family of products with a generic factory contract:

```ts id="w2k6p9"
interface ProductFamily {
    button: Button;
    checkbox: Checkbox;
    dialog: Dialog;
}

interface AbstractFactory<F extends ProductFamily> {
    createButton(): F["button"];

    createCheckbox(): F["checkbox"];

    createDialog(): F["dialog"];
}
```

More elaborate generic designs can encode stronger relationships between product families and their concrete products.

However, generic abstractions should not be introduced merely to make the pattern mathematically expressive. The
simplest contract that provides the required type safety is usually preferable.

## Abstract Factory and Modules

JavaScript modules can provide a natural implementation boundary for product families.

A family can expose its factory without exposing its concrete product implementations:

```js id="j7m4c8"
export const factory = {
    createButton,
    createCheckbox,
    createDialog
};
```

The module becomes the boundary through which clients obtain products.

This can eliminate the need for explicit factory classes when the language's module system already provides sufficient
encapsulation.

## Abstract Factory Without an Abstract Class

The word "abstract" in Abstract Factory does not require a JavaScript `abstract class`.

A factory can be represented through a structural contract:

```js id="e4r8n2"
const factory = {
    createButton() {
    },
    createCheckbox() {
    },
    createDialog() {
    }
};
```

In JavaScript, the important requirement is that concrete factories provide the expected creation operations.

In TypeScript, an interface can make that contract explicit.

The pattern is therefore about the **abstraction and relationships**, not about a particular language construct.

## Abstract Factory and Functional JavaScript

Functional JavaScript can express Abstract Factory using closures and higher-order functions.

For example:

```js id="s3k7v5"
function createFactory(theme) {
    return {
        createButton() {
            return createButton(theme);
        },

        createCheckbox() {
            return createCheckbox(theme);
        }
    };
}
```

The returned object represents the family-level creation interface.

This approach can be preferable when the products are naturally represented as functions or plain objects rather than
classes.

## Abstract Factory and Service Providers

Abstract Factory is useful when a system supports multiple providers that supply several related services.

For example, an application might support different cloud providers:

```text
Storage
Messaging
Secrets
Compute
```

Each provider may have a corresponding family of implementations.

The factory can expose:

```js id="n6p2w4"
const factory = {
    createStorage(),
    createMessaging(),
    createSecrets(),
    createCompute()
};
```

Selecting a provider then selects the corresponding family.

This can prevent provider-specific construction logic from spreading throughout the application.

## Abstract Factory and Database Families

A similar structure can occur with database-related components.

For example, a system might need a family consisting of:

* Connection
* Query builder
* Transaction manager
* Repository implementation

Different database technologies may provide different implementations.

An Abstract Factory can create the complete family associated with the selected database technology.

However, a database abstraction should not automatically be modeled as Abstract Factory. If the application only
requires one repository implementation at a time, direct dependency injection may be more appropriate.

## Abstract Factory and UI Frameworks

UI component families are one of the classic examples.

A design system may provide families such as:

* Light theme
* Dark theme
* Compact theme
* Accessible theme

Each family can provide compatible buttons, inputs, dialogs, menus, and other components.

The factory allows the application to select the family without embedding family-specific construction throughout the UI
code.

## Open-Closed Trade-off

Abstract Factory often provides a useful trade-off around the Open-Closed Principle.

Adding a **new product family** can usually be done by adding a new concrete factory and its products without changing
the client.

Adding a **new product type** generally requires modifying the abstract factory contract and every concrete factory.

Therefore, the pattern is naturally optimized for systems where new families are more likely than new product types.

This trade-off should be considered before adopting the pattern.

## Benefits

Abstract Factory provides several benefits:

* It isolates concrete product creation.
* It keeps clients independent of concrete product classes.
* It makes product families explicit.
* It helps maintain compatibility between related products.
* It allows complete product families to be replaced.
* It centralizes family-specific construction decisions.
* It can support dependency injection and dependency inversion.
* It provides a stable creation contract.
* It can simplify testing when complete alternative families are required.

The value comes from the combination of these properties rather than from simply moving `new` expressions into another
class.

## Costs

Abstract Factory also introduces costs:

* More abstractions.
* More factory methods.
* More concrete factory implementations.
* Additional indirection.
* More code.
* Increased conceptual overhead.
* A larger change surface when new product types are introduced.
* Potential duplication across concrete factories.

The pattern is therefore not inherently better than direct construction.

It is justified when the product-family problem is significant enough to warrant the additional structure.

## Common Misuse

### Using Abstract Factory for One Product

If the system only creates one meaningful product type, Abstract Factory may be unnecessary.

A factory function or direct construction may provide the same benefit with less complexity.

### Calling Every Factory an Abstract Factory

A factory that creates one product is not automatically an Abstract Factory.

The defining characteristic is the creation of a **family of related products**.

### Creating Incompatible Families

If a concrete factory can arbitrarily return products from unrelated families, it undermines one of the primary reasons
for using Abstract Factory.

Concrete factories should normally represent coherent product families.

### Excessive Factory Abstraction

Creating an Abstract Factory before multiple related product implementations actually exist can create speculative
architecture.

If there is no meaningful variation yet, direct construction may be preferable.

### Hiding All Construction

Abstract Factory does not require every `new` expression in an application to be hidden behind a factory.

Only creation decisions that benefit from family-level abstraction should be centralized.

### Confusing Factory Selection with Product Creation

The code responsible for selecting which factory to use is conceptually different from the factory responsible for
creating products.

Keeping these concerns separate can prevent the factory itself from becoming a large configuration and
application-control component.

## Abstract Factory and Singleton

Abstract Factory is sometimes combined with Singleton when an application requires exactly one factory instance for a
product family.

For example, a single configured provider factory might be shared across an application.

However, Singleton is not inherently part of Abstract Factory.

A factory can be instantiated normally, injected through dependency injection, or created once during application
composition without implementing the GoF Singleton pattern.

## Abstract Factory and Adapter

Abstract Factory and Adapter can work together when products need to be created behind a stable family interface while
their concrete implementations wrap incompatible external systems.

For example, a provider-specific factory might create adapters around several third-party services.

The factory determines which family is created; the adapters isolate the incompatible external interfaces.

These are separate design responsibilities.

## Abstract Factory and Facade

Abstract Factory controls creation of related products, while Facade provides a simplified interface to a subsystem.

A facade may internally use an Abstract Factory to construct the components required to perform a high-level operation.

The factory answers **which related objects should be created**. The facade answers **how clients can interact with the
subsystem through a simpler interface**.

## Abstract Factory and Dependency Ownership

The abstract factory interface should belong to the policy or client-facing side of the boundary when it represents the
set of capabilities the client requires.

Concrete factories belong to the implementation side because they contain knowledge of concrete products.

This keeps the client from becoming dependent on implementation-specific creation details.

## Abstract Factory and Volatility

Abstract Factory is most valuable when the concrete product family is volatile.

If an application frequently changes between:

* Providers
* Platforms
* Themes
* Environments
* Vendors
* Implementations

then centralizing family creation can prevent those changes from spreading throughout the application.

If the concrete implementation is stable and unlikely to vary, the abstraction may provide little value.

## Abstract Factory as an Architectural Boundary

Abstract Factory can serve as a boundary between application policy and implementation details.

For example, an application may depend on:

```text
Payment
Notification
Storage
```

while a concrete provider supplies implementations for all three.

The application interacts with the abstract factory and abstract products. Provider-specific details remain outside the
application policy.

This can be particularly useful at infrastructure boundaries.

However, Abstract Factory should not be confused with an architectural layer. It is a design pattern that can support an
architectural boundary but does not define the architecture itself.

## Abstract Factory and Ports and Adapters

In a ports-and-adapters architecture, an Abstract Factory can sometimes provide multiple related infrastructure
implementations behind an application-facing port.

For example, an application may require a family of infrastructure capabilities corresponding to one external provider.

The application defines what it needs, while infrastructure supplies a concrete factory that creates the
provider-specific implementations.

The factory is therefore one possible mechanism for assembling an adapter family.

It is not required by ports-and-adapters architecture.

## Testing Product Families

When product compatibility itself needs to be tested, Abstract Factory provides a useful test boundary.

A test can verify that a factory creates products belonging to the same family:

```js id="p5r9k2"
const factory = new WindowsFactory();

const button = factory.createButton();
const checkbox = factory.createCheckbox();

expect(button).toBeInstanceOf(WindowsButton);
expect(checkbox).toBeInstanceOf(WindowsCheckbox);
```

More importantly, the client can be tested against an alternative factory without changing its creation logic.

The test suite can therefore distinguish:

* Product-family correctness.
* Client behavior.
* Factory selection.
* Concrete product implementation.

## Abstract Factory Granularity

An Abstract Factory should expose product types that actually belong together.

A factory with dozens of unrelated creation methods is usually a sign that the abstraction boundary is too broad.

For example, combining:

```text
createButton()
createDatabase()
createEmailSender()
createPdfGenerator()
createWeatherService()
createLogger()
```

into one factory may be unjustified unless these products genuinely form a coherent family.

The factory should represent a meaningful product family rather than becoming a generic application-wide object
container.

## Factory Interface Stability

The factory interface should remain stable enough that clients can depend on it without knowing its implementations.

However, stability does not mean the interface should never change.

When a new product type is introduced, the factory contract may need to evolve. That change should be deliberate because
it affects every concrete factory.

This is one reason product-family boundaries should be defined around coherent sets of related capabilities.

## Registration-Based Abstract Factories

A family can also be constructed through registration rather than explicit concrete factory classes:

```js id="v7m3q8"
function createFactory(products) {
    return {
        createButton() {
            return products.button();
        },

        createCheckbox() {
            return products.checkbox();
        }
    };
}
```

Families can then be registered:

```js id="c2n6w4"
const windowsFactory = createFactory({
    button: () => new WindowsButton(),
    checkbox: () => new WindowsCheckbox()
});

const macFactory = createFactory({
    button: () => new MacButton(),
    checkbox: () => new MacCheckbox()
});
```

This remains consistent with the Abstract Factory concept because the family-level creation contract is preserved.

## Abstract Factory and Immutability

Abstract Factory does not prescribe whether created products are mutable or immutable.

The pattern concerns creation relationships rather than object mutability.

In functional JavaScript systems, a factory may return immutable values or pure functions rather than mutable class
instances.

The important requirement remains that related products are created through a coherent family abstraction.

## Abstract Factory and Asynchronous Creation

Factories can also create resources asynchronously when construction requires I/O or remote initialization.

For example:

```js id="k4r8p1"
const factory = {
    async createStorage() {
        return connectToStorage();
    },

    async createMessaging() {
        return connectToMessaging();
    }
};
```

The asynchronous nature of creation does not change the pattern's intent.

The factory still encapsulates creation of a related product family.

However, asynchronous initialization can introduce lifecycle concerns, and those concerns should not be hidden behind
the pattern merely for the sake of abstraction.

## Abstract Factory and Resource Lifecycle

If products require explicit initialization and disposal, the factory may also need to participate in lifecycle
management.

For example, a family of resources may need to be initialized together and released together.

In such cases, the factory can become an assembly boundary rather than merely a collection of constructor functions.

Care should be taken not to turn the factory into a service locator or global resource manager.

## Abstract Factory Versus Service Locator

A Service Locator provides access to services through a central registry. Abstract Factory provides operations for
creating a coherent family of products.

They can look similar in code, but their design intent differs.

A service locator answers:

> Which service can I retrieve?

An Abstract Factory answers:

> Which product from this family should I create?

A generic registry that exposes arbitrary services should not be labeled an Abstract Factory merely because it contains
factory functions.

## Abstract Factory and Service Locators in JavaScript

A JavaScript object such as:

```js id="m8q3v6"
const services = {
    database,
    logger,
    cache,
    mailer
};
```

is not automatically an Abstract Factory.

If the object simply exposes existing services, it is closer to a service registry or dependency container.

An Abstract Factory is specifically concerned with **creation operations** and **related product families**.

## Recognizing Abstract Factory in Existing Code

When analyzing an existing system, look for several related creation operations that vary together.

Questions to ask include:

1. Are multiple product types being created?
2. Do those products belong to identifiable families?
3. Must products from the same family remain compatible?
4. Does the client currently know concrete product classes?
5. Is family selection repeated throughout the codebase?
6. Would replacing an entire family otherwise require widespread changes?
7. Are new families expected to be introduced?

If the answers are consistently yes, Abstract Factory may be an appropriate abstraction.

## Refactoring Toward Abstract Factory

A common refactoring path starts with scattered family-specific construction:

```js id="q6w2n9"
function createScreen(platform) {
    let button;
    let checkbox;

    if (platform === "windows") {
        button = new WindowsButton();
        checkbox = new WindowsCheckbox();
    } else {
        button = new MacButton();
        checkbox = new MacCheckbox();
    }

    return {button, checkbox};
}
```

The family-specific construction can be moved into concrete factories:

```js id="r9k4m7"
class WindowsFactory {
    createButton() {
        return new WindowsButton();
    }

    createCheckbox() {
        return new WindowsCheckbox();
    }
}

class MacFactory {
    createButton() {
        return new MacButton();
    }

    createCheckbox() {
        return new MacCheckbox();
    }
}
```

The client can then receive a factory:

```js id="w3p8c5"
function createScreen(factory) {
    return {
        button: factory.createButton(),
        checkbox: factory.createCheckbox()
    };
}
```

The resulting abstraction is justified because it isolates a real family-level variation.

## Refactoring Away from Abstract Factory

The reverse refactoring can also be appropriate.

If a product family disappears and only one implementation remains, the Abstract Factory may become unnecessary.

For example, if an application no longer supports multiple UI families, continuing to maintain:

```text
GUIFactory
WindowsFactory
MacFactory
LinuxFactory
```

may create unnecessary complexity.

The abstraction should be removed when the variation it isolates no longer exists and is not expected to return.

## Abstract Factory and Over-Abstraction

The primary risk of Abstract Factory is premature abstraction.

A developer may anticipate several future product families and introduce a factory hierarchy before the variation is
real.

This can result in:

* Empty or artificial abstractions.
* Boilerplate factory methods.
* Concrete factories that merely forward constructors.
* More difficult navigation.
* Increased conceptual overhead.

The existence of a possible future family is not sufficient justification.

The pattern should be introduced when the family-level variation is real or when the architectural boundary genuinely
requires it.

## Abstract Factory and Simpler Alternatives

Before choosing Abstract Factory, consider simpler alternatives:

* Direct construction.
* Factory functions.
* Dependency injection.
* Object literals containing creation functions.
* Configuration objects.
* Lookup tables.
* Modules exposing family-specific constructors.
* A single factory for one product type.

Abstract Factory is justified when these simpler mechanisms do not adequately express the family-level design
requirement.

## Decision Criteria

Abstract Factory is a strong candidate when the following conditions hold:

| Condition                                | Relevance                 |
|------------------------------------------|---------------------------|
| Multiple related products exist          | Core requirement          |
| Products form identifiable families      | Core requirement          |
| Family compatibility matters             | Strong justification      |
| Concrete products should be hidden       | Strong justification      |
| Entire families may be replaced          | Strong justification      |
| New families are likely                  | Favors the pattern        |
| New product types are rare               | Favors the pattern        |
| Only one product exists                  | Usually argues against it |
| Product creation is trivial              | Usually argues against it |
| No meaningful family relationship exists | Argues against it         |

The pattern should be selected based on the actual volatility and dependency structure rather than because the system
contains many constructors.

## Summary

Abstract Factory provides an interface for creating **families of related or dependent objects without specifying their
concrete classes**.

Its defining concepts are:

* Product families.
* Multiple related product types.
* Family-level creation.
* Concrete product isolation.
* Compatibility between products.
* Client independence from concrete implementations.

The pattern is particularly useful when an application must support multiple coherent implementations of the same set of
related products.

In JavaScript, Abstract Factory does not require a traditional class hierarchy. The same design can be expressed with
classes, objects, functions, closures, modules, or TypeScript interfaces.

The central trade-off is important: **Abstract Factory makes adding new product families easier while making the
addition of new product types more expensive**, because every concrete factory must support the expanded product
contract.

Abstract Factory should therefore be used when the system's primary variation is at the **product-family level**.

The pattern is not simply a more sophisticated factory. It is a mechanism for representing and controlling the creation
of a **coherent family of related products** while keeping clients independent of their concrete implementations.

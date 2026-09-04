# Single Responsibility Principle (SRP)

The **Single Responsibility Principle (SRP)** states that a software component should have a single, cohesive
responsibility and, more precisely, a single primary reason to change. The principle is commonly reduced to the phrase
“a class should do one thing,” but that interpretation is too narrow to be useful. A class can contain many methods and
still have a single responsibility when those methods collectively implement one coherent concept. Conversely, a small
class can violate SRP when its behavior serves several unrelated reasons for change.

The central question is therefore not how many operations a component performs, but whether those operations belong to
the same responsibility and evolve together. A component is more likely to violate SRP when different parts of it can
change independently because of unrelated business requirements, technical concerns, stakeholders, dependencies, or
external systems.

## Responsibility

A **responsibility** is a coherent area of behavior, knowledge, or decision-making that belongs together because it
exists for the same underlying purpose and changes for related reasons.

Consider an order-processing component responsible for calculating order totals, persisting orders, sending confirmation
emails, generating invoices, and recording audit events. All of these activities concern orders, but that does not mean
they constitute one responsibility. Pricing rules can change independently of the database technology. Notification
requirements can change independently of accounting requirements. Audit requirements can change independently of both.

The distinction becomes clearer when considering the reasons for change. A database schema change should not normally
require modification to pricing rules. A new email provider should not require changes to persistence logic. A change in
invoice formatting should not require changes to order calculation. When these concerns are combined inside the same
component, the component becomes a common change point for requirements that are otherwise unrelated.

SRP therefore concerns the boundary between responsibilities, not simply the number of operations performed by a
component.

## The Meaning of "Single"

The word “single” in SRP does not mean one method, one statement, one field, one operation, one dependency, or one
business rule. It means that the component has one cohesive responsibility from the perspective of change.

For example, the following class can legitimately contain several methods:

```javascript id="srp-cohesive-class"
class ShoppingCart {
    addItem(item) {
        // ...
    }

    removeItem(itemId) {
        // ...
    }

    getItem(itemId) {
        // ...
    }

    getTotal() {
        // ...
    }

    isEmpty() {
        // ...
    }
}
```

These methods represent different operations, but they all belong to the responsibility of managing a shopping cart.
Extracting every method into its own class would not create better separation. It would simply distribute one cohesive
responsibility across multiple abstractions.

The relevant question is whether the methods are related by the same conceptual purpose and tend to change together. If
they do, keeping them together is often the more cohesive design.

## The Reason to Change

The most practical way to apply SRP is to examine what could cause a component to change.

Consider:

```javascript id="srp-multiple-reasons"
class Employee {
    calculatePay() {
        // payroll calculation
    }

    save() {
        // persistence
    }

    generateHoursReport() {
        // reporting
    }
}
```

The payroll calculation can change because compensation rules change. The persistence implementation can change because
the storage mechanism or database schema changes. The reporting behavior can change because reporting requirements
change. These are independent change dimensions, so the class combines several responsibilities.

A more cohesive design separates those concerns:

```javascript id="srp-separated-responsibilities"
class PayrollCalculator {
    calculatePay(employee) {
        // payroll calculation
    }
}

class EmployeeRepository {
    save(employee) {
        // persistence
    }
}

class HoursReportGenerator {
    generate(employee) {
        // reporting
    }
}
```

The value of this separation is not simply that the classes are smaller. The important result is that each class
establishes a narrower change boundary. Payroll changes primarily affect the payroll calculation component, persistence
changes primarily affect the repository, and reporting changes primarily affect the report generator.

## Responsibility Is Not the Same as a Method

A common mistake is to interpret SRP as requiring every method to become its own responsibility. That approach confuses
operations with responsibilities.

For example:

```javascript id="srp-method-count"
class User {
    setName(name) {
        this.name = name;
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password;
    }

    isValid() {
        return true;
    }
}
```

The existence of several methods does not establish an SRP violation. These operations can collectively represent the
state and invariants of a user.

The same applies to a more substantial domain object:

```javascript id="srp-many-methods"
class ShoppingCart {
    addItem(item) {
    }

    removeItem(itemId) {
    }

    updateQuantity(itemId, quantity) {
    }

    getItem(itemId) {
    }

    getItems() {
    }

    getSubtotal() {
    }

    getTax() {
    }

    getTotal() {
    }

    clear() {
    }
}
```

The class contains many operations, but they are all related to the same domain concept. Splitting these methods simply
because there are many of them would weaken cohesion rather than improve it.

Method count is therefore not a meaningful definition of SRP.

## Responsibility Is Not the Same as Size

Class size can be a useful warning signal, but size alone does not establish an SRP violation.

A domain object can legitimately contain substantial behavior:

```javascript id="srp-large-domain-object"
class Order {
    addLineItem(item) {
    }

    removeLineItem(itemId) {
    }

    changeQuantity(itemId, quantity) {
    }

    calculateSubtotal() {
    }

    calculateTax() {
    }

    calculateTotal() {
    }

    applyDiscount(discount) {
    }

    isEmpty() {
    }

    canBeCancelled() {
    }

    cancel() {
    }
}
```

Although this class is relatively large, its operations can collectively represent the lifecycle and business rules of
an order. The fact that it contains many methods does not by itself justify decomposition.

Conversely, a much smaller class can combine unrelated responsibilities:

```javascript id="srp-small-but-multiple"
class UserService {
    createUser() {
    }

    sendWelcomeEmail() {
    }

    writeAuditLog() {
    }
}
```

The important difference is not size. User creation, email delivery, and audit logging may have different change drivers
and different dependencies.

**Size is a signal, not the definition of SRP.**

## Responsibility Is Not the Same as Domain Entity

SRP does not require every responsibility to correspond to a domain entity, nor does it require every domain entity to
contain only one trivial operation.

A domain entity can contain substantial behavior when that behavior defines the entity's own invariants and lifecycle.
Likewise, a responsibility can be implemented by a service, repository, module, function, or other abstraction that does
not represent a domain entity.

For example:

```javascript id="srp-service-responsibility"
class TaxCalculator {
    calculate(order) {
        // ...
    }
}
```

`TaxCalculator` is not a domain entity. Its responsibility is calculating tax.

Similarly:

```javascript id="srp-repository-responsibility"
class OrderRepository {
    findById(id) {
    }

    save(order) {
    }

    delete(order) {
    }
}
```

The repository represents a persistence responsibility rather than the order itself.

SRP is concerned with behavioral and change boundaries. It does not impose a one-to-one mapping between responsibilities
and domain entities.

## Identifying Responsibilities

A practical way to identify responsibilities is to examine how a component changes over time. Ask what business rules
can change independently, what technical concerns can change independently, which stakeholders request changes, which
methods tend to change together, which methods change for unrelated reasons, and which dependencies are required only by
particular parts of the component.

Consider:

```javascript id="srp-identification"
class OrderService {
    calculateTotal(order) {
    }

    saveOrder(order) {
    }

    sendConfirmation(order) {
    }

    generateInvoice(order) {
    }
}
```

The methods suggest several different change dimensions. `calculateTotal()` is affected by pricing rules, `saveOrder()`
is affected by storage infrastructure, `sendConfirmation()` is affected by communication requirements, and
`generateInvoice()` is affected by billing or accounting requirements.

The component therefore provides a useful candidate for decomposition because its methods do not necessarily evolve as
one coherent unit.

Actual change history is particularly valuable here. If the same class repeatedly receives unrelated modifications for
pricing, persistence, notifications, and reporting, that is stronger evidence of multiple responsibilities than merely
predicting that those concerns might change independently.

## Actors and Stakeholders

Another useful way to identify responsibilities is to consider the stakeholders who drive changes to the component.

Suppose a component calculates salaries, generates tax reports, and persists employee records. Payroll may own salary
calculation, accounting may own tax reporting, and infrastructure or another technical group may own persistence.
Although all three behaviors concern employees, they respond to different requirements and may therefore have different
reasons to change.

This perspective is useful because SRP is not purely about technical concerns. Responsibility boundaries can also
reflect organizational boundaries. When unrelated stakeholders repeatedly modify the same component, that component can
become a coupling point between independent areas of the system.

## Cohesion

SRP is closely related to **cohesion**, which describes how strongly the elements of a module belong together.

A highly cohesive component contains behavior that supports the same conceptual purpose. A low-cohesion component groups
behavior together primarily because it is convenient to place it in one location.

For example:

```javascript id="srp-low-cohesion"
class ApplicationUtils {
    formatCurrency() {
    }

    validateEmail() {
    }

    compressImage() {
    }

    hashPassword() {
    }

    generatePdf() {
    }
}
```

These operations have little conceptual relationship. Grouping them under `ApplicationUtils` does not establish a
meaningful responsibility. It creates a broad dumping ground for unrelated behavior.

A more cohesive design separates those concerns:

```javascript id="srp-high-cohesion"
class CurrencyFormatter {
    format(value) {
    }
}

class EmailValidator {
    validate(email) {
    }
}

class ImageCompressor {
    compress(image) {
    }
}

class PasswordHasher {
    hash(password) {
    }
}

class PdfGenerator {
    generate(data) {
    }
}
```

The important improvement is not the increase in class count. The improvement is that each abstraction now represents a
clearer responsibility and a more meaningful reason to change.

## Temporal Cohesion

Not every group of operations that executes together needs to be separated. Code can legitimately be grouped because it
performs a coherent orchestration task.

For example:

```javascript id="srp-temporal-cohesion"
function initializeApplication() {
    loadConfiguration();
    connectDatabase();
    initializeLogging();
    registerRoutes();
    startMetrics();
}
```

The individual operations have different technical responsibilities, but `initializeApplication()` can have the coherent
responsibility of initializing the application.

This distinction is important because SRP does not prohibit composition. A function responsible for orchestrating a
workflow can legitimately invoke several operations that belong to other responsibilities.

`loadConfiguration()` can be responsible for configuration loading, `connectDatabase()` can be responsible for
establishing database connectivity, and `initializeApplication()` can be responsible for coordinating startup.

## Business Responsibilities and Technical Responsibilities

A particularly important SRP boundary exists between business behavior and infrastructure concerns.

Consider:

```javascript id="srp-business-infrastructure"
class OrderService {
    calculateTotal(order) {
        // business rules
    }

    save(order) {
        // database access
    }

    sendEmail(order) {
        // external email provider
    }
}
```

The calculation rules, persistence mechanism, and communication mechanism can evolve independently. A more separated
design can represent those responsibilities explicitly:

```javascript id="srp-business-infrastructure-separated"
class OrderPricing {
    calculateTotal(order) {
        // business rules
    }
}

class OrderRepository {
    save(order) {
        // database access
    }
}

class OrderNotificationService {
    sendConfirmation(order) {
        // email provider
    }
}
```

An application-level component can then coordinate them:

```javascript id="srp-orchestrator"
class OrderApplicationService {
    constructor(pricing, repository, notifications) {
        this.pricing = pricing;
        this.repository = repository;
        this.notifications = notifications;
    }

    placeOrder(order) {
        order.total = this.pricing.calculateTotal(order);
        this.repository.save(order);
        this.notifications.sendConfirmation(order);
    }
}
```

The application service is not implementing pricing, persistence, or notification itself. Its responsibility is
coordinating the order-placement use case.

This distinction is central to applying SRP correctly. A component may use several responsibilities without owning all
of their implementation.

## Orchestration Is a Responsibility

SRP does not require every workflow to be decomposed until there is no component left that coordinates anything.

Consider:

```javascript id="srp-orchestration"
class CheckoutService {
    constructor(payment, inventory, orders) {
        this.payment = payment;
        this.inventory = inventory;
        this.orders = orders;
    }

    checkout(cart) {
        this.payment.charge(cart.total);
        this.inventory.reserve(cart.items);
        this.orders.create(cart);
    }
}
```

This service interacts with payment, inventory, and order management, but that does not automatically make it
responsible for payment processing, inventory management, and order persistence. Its responsibility can be the checkout
use case itself.

The distinction is between **implementing a responsibility** and **coordinating responsibilities**. A coordinator can
invoke specialized components while remaining cohesive around the workflow it owns.

This distinction prevents SRP from producing excessive decomposition.

## SRP and Abstraction Boundaries

Responsibility boundaries frequently become abstraction boundaries.

When unrelated responsibilities are combined, the public API of the component often exposes unrelated operations:

```javascript id="srp-bad-api"
class UserManager {
    createUser() {
    }

    deleteUser() {
    }

    authenticateUser() {
    }

    sendPasswordResetEmail() {
    }

    exportUsersToCsv() {
    }
}
```

Consumers may need only one subset of these capabilities. A consumer interested in authentication should not necessarily
depend on user export functionality, and a consumer responsible for reporting should not necessarily depend on
password-reset behavior.

Separating responsibilities produces narrower abstractions:

```javascript id="srp-narrow-abstractions"
class UserService {
    createUser() {
    }

    deleteUser() {
    }
}

class AuthenticationService {
    authenticateUser() {
    }
}

class PasswordResetService {
    sendResetEmail() {
    }
}

class UserExporter {
    exportCsv() {
    }
}
```

This can reduce coupling because consumers can depend on the capability they actually require.

## SRP and Dependencies

Dependencies are useful diagnostic signals when evaluating responsibility boundaries.

Suppose a component requires a database, email client, logger, payment client, PDF generator, cache, and metrics system:

```javascript id="srp-dependencies"
class UserService {
    constructor(
        database,
        emailClient,
        logger,
        paymentClient,
        pdfGenerator,
        cache,
        metrics
    ) {
        // ...
    }
}
```

The dependency surface suggests that the component may be combining several concerns. The database suggests persistence,
the email client suggests communication, the payment client suggests payment processing, the PDF generator suggests
document generation, and the metrics dependency suggests observability.

This is not formal proof of an SRP violation. A component can legitimately have several dependencies while remaining
cohesive. The important question is whether those dependencies collectively support one responsibility or whether
different dependencies exist for unrelated behaviors.

Methods that use completely different subsets of the component's dependencies are particularly strong evidence of
multiple responsibilities.

## SRP and Change Amplification

One of the most practical reasons to apply SRP is to reduce **change amplification**.

Suppose a single component contains tax calculation, persistence, and email delivery. A change to tax rules should
primarily affect tax calculation. A change to the persistence mechanism should primarily affect persistence. A change to
email delivery should primarily affect notification.

When these concerns are combined, every change is made through the same component even though the concerns are
unrelated. This increases the probability that an otherwise localized requirement will affect unrelated code, tests,
dependencies, and behavior.

Separating responsibilities reduces the blast radius of such changes.

The goal is not to guarantee that only one file changes for every requirement. Real changes often cross boundaries. The
goal is to make those boundaries correspond to meaningful areas of change so that unrelated behavior is not
unnecessarily coupled.

## SRP and Testing

SRP can improve testability because cohesive components generally have narrower behavioral surfaces and more focused
dependencies.

Consider a user service that performs validation, database access, password hashing, email delivery, and audit logging
inside a single operation:

```javascript id="srp-testing-bad"
class UserService {
    createUser() {
        // validation
        // database access
        // password hashing
        // email delivery
        // audit logging
    }
}
```

Testing this operation may require database infrastructure, email mocks, hashing mocks, logging mocks, validation
scenarios, and several unrelated failure conditions.

After separating those concerns, each component can be tested against its own contract:

```javascript id="srp-testing-good"
class UserValidator {
    validate(user) {
    }
}

class PasswordHasher {
    hash(password) {
    }
}

class UserRepository {
    save(user) {
    }
}

class WelcomeEmailSender {
    send(user) {
    }
}

class AuditLogger {
    record(event) {
    }
}
```

SRP does not imply that every class should only have unit tests or that integration testing becomes unnecessary.
Workflow behavior still needs integration and system-level tests. The advantage is that individual responsibilities can
be tested without unnecessarily constructing unrelated infrastructure.

## SRP and Functional Programming

SRP is not limited to object-oriented classes. The same reasoning applies to functions, modules, packages, services, and
other forms of software organization.

A function such as:

```javascript id="srp-functions-bad"
function processOrder(order) {
    validateOrder(order);
    calculateTotal(order);
    saveToDatabase(order);
    sendEmail(order);
    writeAuditLog(order);
}
```

may be combining several responsibilities if it directly owns all of those concerns. Those operations can instead be
implemented separately and composed by a function whose responsibility is coordinating the order-processing workflow.

```javascript id="srp-functions-separated"
function validateOrder(order) {
    // ...
}

function calculateTotal(order) {
    // ...
}

function saveOrder(order) {
    // ...
}

function sendOrderConfirmation(order) {
    // ...
}

function auditOrder(order) {
    // ...
}
```

The workflow can still be expressed as a single operation:

```javascript id="srp-function-orchestration"
function processOrder(order) {
    validateOrder(order);

    const total = calculateTotal(order);

    saveOrder({
        ...order,
        total
    });

    sendOrderConfirmation(order);
    auditOrder(order);
}
```

The existence of orchestration does not violate SRP. The important distinction is whether `processOrder()` owns the
implementation of all those concerns or merely coordinates responsibilities that belong elsewhere.

## SRP in JavaScript Modules

In JavaScript, module boundaries can be more important than class boundaries.

A module containing validation, persistence, email delivery, and document generation may have several unrelated reasons
to change even if each exported function is individually well implemented.

For example:

```javascript id="srp-module-bad"
export function validateUser() {
}

export function saveUser() {
}

export function sendEmail() {
}

export function generatePdf() {
}
```

The functions can be separated into modules that correspond to their actual responsibilities. That does not mean every
module should contain exactly one function. A module can contain multiple closely related functions when they
collectively implement one coherent responsibility.

The relevant boundary is therefore the module's conceptual purpose, not the number of exports.

## SRP and React Components

SRP also applies to UI components, although the appropriate boundary depends heavily on the complexity of the
application.

A component that fetches data, transforms API responses, validates forms, submits data, renders the interface, formats
values, and records analytics may have several independent responsibilities.

```javascript id="srp-react-bad"
function UserProfile() {
    // fetch user
    // transform API data
    // validate form
    // submit form
    // render UI
    // format data
    // track analytics
}
```

These concerns can be separated according to actual architectural boundaries. Data access can be handled by an API
module or hook, form behavior can be handled by a form abstraction, analytics can be delegated to an analytics boundary,
and presentation can remain in the component.

The objective is not to turn every UI concern into a separate file or hook. The objective is to prevent unrelated change
dimensions from accumulating inside one component.

## SRP and Separation of Concerns

SRP and **Separation of Concerns (SoC)** are closely related, but they are not identical.

Separation of concerns is the broader principle of keeping distinct concerns separate. SRP provides a more specific way
of reasoning about responsibility within a component or boundary.

A system may separate presentation, business logic, persistence, infrastructure, and security at an architectural level
while still containing a class or module that combines several responsibilities within one of those areas.

SRP can therefore be applied within broader separation-of-concerns boundaries rather than being treated as a replacement
for them.

## SRP and DRY

SRP should not be confused with **Don't Repeat Yourself (DRY)**.

DRY concerns duplication of knowledge. SRP concerns responsibility and reasons for change.

Developers sometimes combine unrelated behavior merely because they want to avoid duplication. That is the wrong
trade-off when the resulting abstraction couples independent responsibilities.

For example:

```javascript id="srp-dry-misuse"
class UserService {
    createUser() {
    }

    createAdmin() {
    }

    exportUsers() {
    }

    sendEmail() {
    }
}
```

The fact that several operations share a normalization or formatting function does not mean they should belong to the
same class. Shared implementation can be extracted independently:

```javascript id="srp-shared-logic"
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
```

Separate responsibilities can therefore share implementation without being forced into the same abstraction.

## SRP Does Not Mean One Class per Responsibility Forever

Responsibility boundaries can be composed.

For example:

```javascript id="srp-composition"
class CheckoutService {
    constructor(
        orderValidator,
        pricing,
        payment,
        repository
    ) {
        this.orderValidator = orderValidator;
        this.pricing = pricing;
        this.payment = payment;
        this.repository = repository;
    }

    execute(order) {
        this.orderValidator.validate(order);

        const total = this.pricing.calculate(order);

        this.payment.charge(total);

        this.repository.save(order);
    }
}
```

`CheckoutService` coordinates several specialized components without owning all of their implementation details.

This distinction is important because SRP does not require responsibilities to become isolated islands. A cohesive
component can compose other cohesive components to implement a higher-level responsibility.

## Over-Fragmentation

Applying SRP mechanically can create the opposite problem: excessive fragmentation.

Consider:

```javascript id="srp-overfragmentation"
class UserNameGetter {
    get(user) {
        return user.name;
    }
}

class UserEmailGetter {
    get(user) {
        return user.email;
    }
}

class UserIdGetter {
    get(user) {
        return user.id;
    }
}
```

These classes isolate individual operations, but the responsibilities are not meaningfully independent. The resulting
architecture introduces additional names, files, dependencies, navigation, and indirection without providing a
meaningful reduction in change coupling.

The goal of SRP is therefore not to maximize the number of components. A component should be extracted when the
resulting boundary represents a useful responsibility, not merely because a method can technically be moved somewhere
else.

## The Cost of a New Abstraction

Every new class, module, service, interface, or wrapper introduces cost. That cost can include additional names,
dependency wiring, configuration, testing surfaces, files, indirection, and cognitive overhead.

Separation is more likely to be justified when the resulting boundary provides a concrete benefit such as independent
change, independent testing, different ownership, different volatility, different dependencies, different security
requirements, or a distinct architectural boundary.

If two pieces of behavior always change together, share the same invariants, and have no meaningful independent
variation, extracting them may simply create artificial complexity.

## When Responsibilities Should Stay Together

Behaviors can reasonably remain in the same component when they represent the same conceptual responsibility, change for
the same reasons, have strong cohesion, or share important invariants. Keeping them together is also appropriate when
separating them would introduce artificial abstractions or when they are small and unlikely to evolve independently.

For example:

```javascript id="srp-related-behavior"
class Money {
    constructor(amount, currency) {
        this.amount = amount;
        this.currency = currency;
    }

    add(other) {
        // ...
    }

    subtract(other) {
        // ...
    }

    multiply(factor) {
        // ...
    }

    equals(other) {
        // ...
    }
}
```

These operations collectively define money-related behavior. Splitting arithmetic operations into separate services
would make the design less cohesive rather than more compliant with SRP.

## When Responsibilities Should Be Separated

Separation becomes more valuable when behaviors change independently, belong to different stakeholders, use different
infrastructure, have different dependencies, require different security controls, have different lifecycles, require
different testing strategies, or evolve at different rates.

For example:

```javascript id="srp-change-rates"
class UserAccount {
    changePassword() {
    }

    saveToDatabase() {
    }

    sendSecurityEmail() {
    }
}
```

Password rules, database technology, and email delivery represent different change dimensions. They are therefore
stronger candidates for separate responsibilities than the operations of a cohesive `UserAccount` domain object.

The decision should be based on actual design pressure rather than on the mere presence of multiple operations.

## SRP and Persistence

Persistence is a frequent source of SRP discussions because whether persistence belongs inside a domain object depends
on the architectural style.

Consider:

```javascript id="srp-persistence"
class User {
    save() {
        database.users.insert(this);
    }
}
```

This is not automatically an SRP violation. An Active Record design intentionally combines domain data and persistence
behavior into one abstraction. Within that model, persistence can be part of the abstraction's intended responsibility.

In a domain model that is intended to remain independent of infrastructure, however, direct database access creates
coupling between domain behavior and persistence technology.

A separated design might look like:

```javascript id="srp-domain-persistence"
class User {
    changeEmail(email) {
        this.email = email;
    }
}

class UserRepository {
    save(user) {
        // persistence
    }
}
```

The important point is that SRP does not prescribe one universal persistence architecture. The appropriate boundary
depends on the intended responsibilities and architectural model.

## SRP and Validation

Validation provides another example where mechanical decomposition can produce poor designs.

Consider a domain invariant enforced directly by an entity:

```javascript id="srp-validation"
class User {
    setEmail(email) {
        if (!email.includes("@")) {
            throw new Error("Invalid email");
        }

        this.email = email;
    }
}
```

The validation may be part of the user's domain responsibility because the rule protects an invariant of the entity.

External request validation can represent a different responsibility:

```javascript id="srp-request-validation"
class CreateUserRequestValidator {
    validate(request) {
        // request-shape validation
    }
}
```

The distinction is useful between domain invariants and application or input validation. Domain invariants can
legitimately belong to the domain model, while request-shape validation may belong to an application boundary.

SRP helps identify these different responsibilities, but it does not dictate that every validation rule must be
extracted into a separate validator.

## SRP and Dependency Injection

SRP frequently works together with **Dependency Injection (DI)** because a cohesive component often has a more focused
set of dependencies.

For example:

```javascript id="srp-di"
class OrderService {
    constructor(repository, pricing) {
        this.repository = repository;
        this.pricing = pricing;
    }

    place(order) {
        order.total = this.pricing.calculate(order);
        this.repository.save(order);
    }
}
```

The service coordinates order placement while delegating pricing and persistence responsibilities to specialized
collaborators.

Dependency Injection makes those relationships explicit and allows implementations to be replaced or controlled during
testing.

However, Dependency Injection does not create SRP. A class can receive ten dependencies through dependency injection and
still contain multiple unrelated responsibilities.

## SRP and the Open-Closed Principle

SRP and the **Open-Closed Principle (OCP)** often reinforce one another.

A component containing unrelated responsibilities tends to require modification whenever any of those responsibilities
changes. Separating the responsibilities creates narrower change boundaries, which makes controlled extension easier.

For example:

```javascript id="srp-ocp"
class ReportService {
    generatePdf() {
    }

    generateCsv() {
    }

    saveToDatabase() {
    }

    sendEmail() {
    }
}
```

A change to reporting formats affects a component that also contains persistence and communication behavior. Separating
those concerns allows the reporting dimension to evolve without unnecessarily involving unrelated functionality.

SRP can therefore provide part of the structural foundation needed for OCP, although neither principle implies that
every variation requires a separate abstraction.

## SRP and the Dependency Inversion Principle

SRP and the **Dependency Inversion Principle (DIP)** address different design questions.

SRP asks what responsibility belongs in a component and whether unrelated reasons for change have been combined. DIP
asks in which direction dependencies should point and whether high-level policy is unnecessarily coupled to low-level
implementation details.

For example:

```javascript id="srp-dip"
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    place(order) {
        this.orderRepository.save(order);
    }
}
```

SRP may justify separating persistence from order-processing logic. DIP may then be applied to ensure the application
service depends on an appropriate abstraction rather than a specific database implementation.

The principles complement one another, but they should not be conflated.

## SRP and Interface Segregation

SRP also interacts with the **Interface Segregation Principle (ISP)**.

A component that combines unrelated responsibilities often exposes a broad API:

```javascript id="srp-isp"
class EmployeeService {
    calculatePayroll() {
    }

    saveEmployee() {
    }

    generateReport() {
    }
}
```

Different consumers may need different parts of this API. Separating the responsibilities naturally produces narrower
contracts:

```javascript id="srp-isp-separated"
class PayrollService {
    calculatePayroll() {
    }
}

class EmployeeRepository {
    saveEmployee() {
    }
}

class EmployeeReportGenerator {
    generateReport() {
    }
}
```

SRP helps determine where responsibility boundaries should exist, while ISP addresses whether consumers are forced to
depend on capabilities they do not require.

## Common SRP Violations

A **God Object** is a common manifestation of poor responsibility boundaries. Such a class accumulates unrelated
behavior until it becomes responsible for authentication, user management, payment processing, reporting, communication,
caching, logging, and infrastructure.

```javascript id="srp-god-object"
class ApplicationManager {
    authenticate() {
    }

    createUsers() {
    }

    processPayments() {
    }

    generateReports() {
    }

    sendEmails() {
    }

    manageCache() {
    }

    writeLogs() {
    }

    connectDatabase() {
    }
}
```

Generic utility abstractions can develop the same problem. A `Utils` or `Helpers` class containing date formatting,
password hashing, image compression, PDF generation, and token generation is not cohesive simply because all of its
operations are technically reusable.

```javascript id="srp-utils"
class Utils {
    formatDate() {
    }

    validateEmail() {
    }

    hashPassword() {
    }

    compressImage() {
    }

    generateToken() {
    }
}
```

The problem is not utility functions themselves. The problem is grouping unrelated responsibilities under an abstraction
that has no meaningful conceptual boundary.

Broadly named `Manager`, `Helper`, `Processor`, `Handler`, `Service`, and `Utility` classes can conceal the same
problem. Their names do not prove an SRP violation, but they should prompt examination of what the abstraction actually
owns.

For example:

```javascript id="srp-manager"
class UserManager {
    createUser() {
    }

    authenticate() {
    }

    sendEmail() {
    }

    exportData() {
    }
}
```

The implementation should be evaluated according to its responsibilities rather than according to its name.

A service class can also become a dumping ground:

```javascript id="srp-service"
class UserService {
    register() {
    }

    authenticate() {
    }

    resetPassword() {
    }

    exportUsers() {
    }

    importUsers() {
    }

    sendNewsletter() {
    }
}
```

The fact that the class is called a service does not make its responsibilities cohesive.

## Refactoring Toward SRP

Refactoring toward SRP begins by identifying what the component currently does rather than immediately extracting
classes. The existing behavior should first be understood in terms of responsibilities, dependencies, change history,
stakeholders, and invariants.

Suppose an order service validates orders, calculates prices, persists orders, sends confirmations, and generates
invoices. Those activities should be examined separately to determine whether they represent independent change
dimensions.

Validation may change because of input or business rules. Pricing may change because of pricing policy. Persistence may
change because of storage infrastructure. Notifications may change because of communication requirements. Invoice
generation may change because of accounting requirements.

Once these boundaries are understood, responsibilities can be extracted where the separation provides meaningful value:

```javascript id="srp-refactoring-orchestration"
class OrderApplicationService {
    constructor(
        validator,
        pricing,
        repository,
        notifications,
        invoices
    ) {
        this.validator = validator;
        this.pricing = pricing;
        this.repository = repository;
        this.notifications = notifications;
        this.invoices = invoices;
    }

    placeOrder(order) {
        this.validator.validate(order);

        order.total = this.pricing.calculate(order);

        this.repository.save(order);
        this.notifications.sendConfirmation(order);
        this.invoices.generate(order);
    }
}
```

The resulting application service still contains orchestration because coordinating the order-placement workflow is
itself a meaningful responsibility.

Refactoring should not end with class extraction. The resulting architecture should be evaluated for change locality,
cohesion, coupling, readability, testability, ownership, and dependency direction. A refactoring that produces ten
additional classes but makes the system harder to navigate has not necessarily improved the design.

## SRP as a Refactoring Heuristic

SRP is particularly useful when analyzing existing design smells.

Unrelated methods grouped together, large constructor dependency lists, frequent merge conflicts within the same class,
changes to one feature repeatedly affecting unrelated behavior, methods that use completely different subsets of fields,
methods that depend on different external systems, and conditional branches for unrelated business concerns can all
indicate that a component contains multiple responsibilities.

For example:

```javascript id="srp-subsets"
class UserService {
    createUser() {
        // uses database
    }

    sendEmail() {
        // uses emailClient
    }

    exportUsers() {
        // uses csvGenerator
    }
}
```

The methods depend on completely different infrastructure. That is a strong diagnostic signal that the class may be
combining several responsibilities.

These signals are not formal proofs. They indicate where further analysis is warranted.

## SRP and Change Locality

One of the most valuable outcomes of SRP is **change locality**.

When a requirement changes, the ideal design allows the affected responsibility to be modified without unnecessarily
disturbing unrelated behavior.

This does not mean every requirement change should modify exactly one class. Real changes frequently cross multiple
boundaries. It means those boundaries should correspond to meaningful responsibilities so that the change does not
propagate through unrelated implementation.

Without meaningful boundaries, a small change can affect a large multipurpose component, its unrelated dependencies, its
tests, and its consumers. The resulting blast radius makes defects and regressions more likely.

SRP therefore contributes to maintainability by reducing unnecessary change amplification.

## SRP and Ownership

Responsibility boundaries can also correspond to ownership boundaries.

If payroll owns salary calculation, infrastructure owns persistence, and compliance owns audit reporting, placing all
three responsibilities inside one component creates organizational coupling in addition to technical coupling.

Separating those responsibilities can allow different teams, modules, or stakeholders to evolve their respective areas
independently.

This becomes increasingly important as systems and development teams grow. Responsibility boundaries are not purely a
code-organization concern; they can also determine where organizational dependencies occur.

## SRP and Microservices

SRP should not be interpreted as an instruction to turn every responsibility into a microservice.

A monolithic application can contain strong internal responsibility boundaries:

```javascript id="srp-modular-monolith"
const orders = {};
const payments = {};
const users = {};
const notifications = {};
const reporting = {};
```

These concerns can remain inside one deployable system while maintaining clear internal ownership and dependency
boundaries.

Creating a separate service introduces distributed-system costs such as network communication, independent deployment,
observability requirements, failure modes, distributed transactions, operational complexity, and additional
infrastructure.

SRP is therefore about responsibility boundaries, not deployment boundaries.

A responsibility may deserve a separate class, module, package, or service depending on the system's needs. The
principle itself does not determine the deployment topology.

## SRP and Package Design

SRP can be evaluated at multiple levels of a system.

A class can be cohesive while the module containing it combines unrelated classes. A module can be cohesive while a
package combines unrelated modules. A collection of well-designed packages can still be placed inside an architectural
boundary that has unrelated responsibilities.

The appropriate boundary depends on the level at which change occurs.

If two modules are repeatedly modified together because they implement one cohesive responsibility, separating them may
provide little value. If one module repeatedly changes for several unrelated reasons, the module boundary itself may
need to be reconsidered even if every individual function is small and focused.

SRP is therefore not exclusively a class-level principle. In JavaScript especially, module and package boundaries can be
more significant than class boundaries.

## Common Misinterpretations

### “One class must do one thing”

This is too simplistic. A class can contain many related operations when those operations collectively implement one
cohesive responsibility.

### “Every method should become a class”

This is incorrect. Methods that belong to the same responsibility should generally remain together.

### “SRP means small classes”

Not necessarily. Small classes can result from good decomposition, but size does not define responsibility.

### “Every domain entity should contain only data”

Incorrect. Domain entities can contain substantial behavior when that behavior belongs to the entity's responsibility
and protects its invariants.

### “Every external dependency violates SRP”

Incorrect. A cohesive component can legitimately have several dependencies. The relevant question is whether those
dependencies support one responsibility or several unrelated ones.

### “SRP means no orchestration”

Incorrect. Orchestration can itself be a coherent responsibility.

### “SRP requires dependency injection”

Incorrect. Dependency Injection can support SRP, but SRP does not depend on a particular dependency-management
technique.

### “SRP means business and technical concerns must always be separate classes”

Not universally. Separating business logic from infrastructure is often valuable, but the appropriate boundary depends
on the architectural style and actual change patterns.

### “SRP means maximum decomposition”

Incorrect. Excessive decomposition can introduce more complexity than it removes.

## Best Practices

* **Define responsibility in terms of change.** Ask what requirement, stakeholder, business rule, or technical concern
  would cause the component to change.

* **Optimize for cohesion rather than small size.** Strongly related behavior should remain together even when the
  resulting component is relatively large.

* **Look for independent change axes.** Pricing, persistence, communication, reporting, security, and infrastructure
  frequently evolve independently.

* **Use dependencies as diagnostic signals.** A component requiring many unrelated dependencies may be combining
  multiple responsibilities.

* **Use actual change history when available.** Repeated modifications to unrelated parts of the same component provide
  stronger evidence than speculative predictions about future changes.

* **Consider stakeholders and ownership.** Different groups repeatedly changing different parts of the same component
  can indicate multiple responsibilities.

* **Separate infrastructure from domain behavior when their change drivers differ.** Persistence, messaging, external
  APIs, and file generation are common examples, but the correct boundary depends on the architecture.

* **Keep orchestration explicit.** Coordinating several specialized components can itself be a legitimate
  responsibility.

* **Apply SRP to modules and functions, not only classes.** In JavaScript, module boundaries are often more significant
  than class boundaries.

* **Do not extract abstractions mechanically.** An abstraction should establish a meaningful responsibility or boundary
  rather than exist merely to reduce method count.

* **Avoid generic dumping-ground abstractions.** `Utils`, `Helpers`, and broad `Manager` or `Service` classes often
  conceal poor responsibility boundaries.

* **Preserve domain cohesion.** Do not extract domain behavior merely because it can technically be moved into another
  class.

* **Balance responsibility separation against complexity.** Every new component introduces names, dependencies, files,
  indirection, and cognitive overhead.

* **Refactor incrementally.** Extract one meaningful responsibility at a time and preserve behavior with appropriate
  tests.

* **Treat SRP as a heuristic rather than a mechanical rule.** The objective is a maintainable change structure, not a
  particular number of classes or files.

## Summary

The Single Responsibility Principle is fundamentally about **responsibility boundaries and reasons for change**.

A component follows SRP when its behavior forms a cohesive responsibility and primarily changes because of one related
set of requirements. The principle does not require one method per class, one class per operation, tiny classes,
data-only domain objects, absence of orchestration, absence of dependencies, or maximum decomposition.

A cohesive class can contain many related operations. A cohesive service can coordinate several specialized components.
A domain entity can contain substantial business behavior. A module can contain multiple functions when those functions
collectively represent one responsibility.

The practical question is whether different parts of the component have independent reasons to change. If pricing rules,
persistence technology, notification requirements, and accounting requirements can evolve independently, placing all of
them inside the same abstraction creates unnecessary coupling. If several operations collectively define one domain
concept and change together, separating them may be counterproductive.

SRP therefore provides a way to reason about **cohesion, coupling, change locality, ownership, volatility, and
responsibility boundaries**.

The objective is not to produce the smallest possible classes or the largest possible number of abstractions. The
objective is to organize software so that responsibilities that evolve together remain together and responsibilities
that evolve independently can change independently.

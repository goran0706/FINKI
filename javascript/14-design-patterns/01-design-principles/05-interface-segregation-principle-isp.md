# Interface Segregation Principle (ISP)

The **Interface Segregation Principle (ISP)** states that clients should not be forced to depend on methods they do not
use. In practical terms, an abstraction should expose a **cohesive set of capabilities relevant to its consumers**
rather than forcing every consumer to depend on a large, general-purpose contract. The principle is therefore
fundamentally concerned with dependency boundaries and interface cohesion.

The commonly used formulation is: **Clients should not be forced to depend on interfaces they do not use.**

The important word is **clients**. ISP does not impose an arbitrary limit on the number of methods an interface may
contain. An interface with many methods can be well designed if those operations form one coherent contract and its
clients legitimately depend on that contract. Conversely, an interface with only a few methods can violate ISP if those
methods represent unrelated capabilities that different clients should not have to depend upon together.

The objective is to make the dependency surface correspond to the client's actual requirements.

## The Problem ISP Addresses

Consider a broad abstraction:

```js
class Worker {
    work() {
        // ...
    }

    eat() {
        // ...
    }

    sleep() {
        // ...
    }

    report() {
        // ...
    }
}
```

A human worker may legitimately support all four operations. A robotic worker, however, may only need `work()` and
`report()`. If every implementation must conform to the complete abstraction, the robot is forced to provide operations
that are irrelevant to its capabilities:

```js
class RobotWorker extends Worker {
    work() {
        // ...
    }

    eat() {
        throw new Error("Robots do not eat");
    }

    sleep() {
        throw new Error("Robots do not sleep");
    }

    report() {
        // ...
    }
}
```

The problem is not that `Worker` contains four methods. The problem is that those methods do not form one universally
applicable contract. The abstraction has combined several independent capabilities and made them mandatory for every
implementation.

## Interface Segregation

The broad abstraction can instead be expressed through capability-oriented contracts:

```js
class Workable {
    work() {
        // ...
    }
}

class Eatable {
    eat() {
        // ...
    }
}

class Sleepable {
    sleep() {
        // ...
    }
}

class Reportable {
    report() {
        // ...
    }
}
```

A human worker can provide all four capabilities:

```js
class HumanWorker {
    work() {
    }

    eat() {
    }

    sleep() {
    }

    report() {
    }
}
```

A robot can provide only the capabilities that actually apply to it:

```js
class RobotWorker {
    work() {
    }

    report() {
    }
}
```

The improvement is not simply that the abstractions are smaller. Each contract represents a coherent capability,
allowing implementations and clients to depend only on the behavior relevant to them.

## ISP Is About Clients

The word **client** is central to understanding ISP. Suppose a payment provider exposes:

```text
charge()
refund()
capture()
void()
generateReport()
configure()
rotateCredentials()
```

A payment-processing function may require only `charge()`:

```js
function processPayment(gateway) {
    return gateway.charge();
}
```

The concrete provider may legitimately support all of the other operations. That does not mean the payment-processing
client should depend on them. The distinction is between what the implementation provides and what the client requires.
A concrete implementation may have a broad implementation surface while different consumers depend on narrower
contracts.

The implementation surface and the dependency surface do not have to be identical.

## Client-Specific Contracts

Instead of forcing every consumer to depend on a broad payment gateway:

```js
class PaymentGateway {
    charge() {
    }

    refund() {
    }

    capture() {
    }

    void() {
    }
}
```

the application can define the capability required by a charging client:

```js
class Chargeable {
    charge() {
    }
}
```

A different consumer can depend on a refund capability:

```js
class Refundable {
    refund() {
    }
}
```

A concrete provider can support both:

```js
class PaymentProvider {
    charge() {
    }

    refund() {
    }
}
```

The provider is not required to be physically divided into separate implementations. The contracts through which clients
depend on it are what matter.

## ISP Does Not Mean Every Class Needs an Interface

ISP is sometimes incorrectly reduced to the claim that every class should have a tiny interface or that every class
should implement multiple interfaces. Neither is required.

Consider:

```js
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    displayName() {
        return this.name;
    }

    emailAddress() {
        return this.email;
    }
}
```

There is no automatic reason to split this abstraction merely because it contains multiple methods. The operations may
form one coherent concept for the clients that use it. The relevant question is whether different consumers require
**different, independently meaningful capabilities**.

If there is only one coherent contract, introducing additional interfaces can add indirection without providing
meaningful dependency isolation.

## Interface Cohesion

The correct way to evaluate an interface is through **cohesion**, not method count. Consider:

```js
class FileReader {
    open() {
    }

    read() {
    }

    close() {
    }
}
```

Opening, reading, and closing can naturally form one file-reading lifecycle. The presence of several operations does not
make the interface a violation of ISP.

By contrast:

```js
class FileService {
    read() {
    }

    write() {
    }

    compress() {
    }

    sendEmail() {
    }

    generatePdf() {
    }

    authenticateUser() {
    }
}
```

combines multiple independent capabilities. The problem is not that the interface has many methods; the problem is that
these methods do not form one cohesive contract for all of its clients.

## Fat Interfaces

A **fat interface** exposes significantly more functionality than some or many of its clients require. For example:

```js
class Repository {
    findById() {
    }

    findAll() {
    }

    save() {
    }

    update() {
    }

    delete() {
    }

    bulkInsert() {
    }

    exportCsv() {
    }

    rebuildIndex() {
    }

    backup() {
    }
}
```

A reporting service may require only:

```js
function generateReport(repository) {
    return repository.findAll();
}
```

The reporting service does not conceptually require persistence mutation, deletion, bulk insertion, CSV export, index
maintenance, or backup behavior. The abstraction is broader than the client's requirement, so a fat interface increases
the dependency surface through which a client is coupled to the system.

## Dependency Surface

Every abstraction exposes a **dependency surface**. Suppose a repository provides:

```js
class Repository {
    findById() {
    }

    save() {
    }

    delete() {
    }

    backup() {
    }
}
```

A client that only calls `findById()` is still coupled to the repository abstraction as a whole if that abstraction is
the dependency boundary. This can create conceptual coupling, change coupling, testing coupling, implementation
coupling, versioning coupling, and, in some systems, unnecessary authority.

ISP reduces this dependency surface by allowing clients to depend on narrower contracts. The goal is not to prevent the
implementation from having additional functionality. The goal is to prevent clients from becoming dependent on
functionality they do not require.

## Change Coupling

One of the most important benefits of ISP is reducing **change coupling**. Consider:

```js
class Storage {
    read() {
    }

    write() {
    }

    delete() {
    }

    configureReplication() {
    }
}
```

A client that only reads data is still dependent on the broad storage abstraction. If replication configuration changes,
the broad abstraction may change for a reason completely unrelated to the read client. Depending on the language, type
system, packaging model, and implementation strategy, that change may force unrelated implementations or consumers to
reconsider the contract.

A narrower boundary avoids this coupling:

```js
class ReadableStorage {
    read() {
    }
}
```

The read client now depends only on the behavior it requires. ISP therefore helps establish **change locality**: changes
to one capability should have as little impact as possible on clients that do not depend on that capability.

## Implementation Burden

Fat interfaces can also impose unnecessary implementation requirements. Consider:

```js
class Printer {
    print() {
    }

    scan() {
    }

    fax() {
    }

    staple() {
    }
}
```

A basic printer may support only printing:

```js
class BasicPrinter extends Printer {
    print() {
    }

    scan() {
        throw new Error("Not supported");
    }

    fax() {
        throw new Error("Not supported");
    }

    staple() {
        throw new Error("Not supported");
    }
}
```

Repeated unsupported operations are a design smell because the implementation is being forced to participate in
capabilities that do not belong to it. The capabilities can instead be represented independently:

```js
class Printable {
    print() {
    }
}

class Scannable {
    scan() {
    }
}

class Faxable {
    fax() {
    }
}

class Stapleable {
    staple() {
    }
}
```

A basic printer can provide only printing, while a multifunction printer can provide several capabilities. This also
creates a useful relationship with LSP: if an implementation cannot honor part of a base contract, the base contract may
itself be too broad.

## ISP and Liskov Substitution

ISP and LSP address different problems but frequently interact. Consider:

```js
class Printer {
    print() {
    }

    scan() {
    }
}

class BasicPrinter extends Printer {
    print() {
    }

    scan() {
        throw new Error("Not supported");
    }
}
```

If the `Printer` contract states that every printer supports scanning, then `BasicPrinter` cannot be substituted for
`Printer` in a client that relies on `scan()`. That is an LSP problem.

ISP addresses the abstraction that created the problem. If printing and scanning are independent capabilities, they
should not necessarily be represented as one mandatory contract.

The principles should not be conflated. ISP asks whether clients are forced to depend on capabilities they do not
require. LSP asks whether an implementation can satisfy the behavioral contract of the abstraction for which it
substitutes.

Segregated interfaces can therefore prevent certain LSP violations by ensuring that implementations are only required to
satisfy capabilities they genuinely support.

## ISP and Single Responsibility

ISP and SRP are related but distinct. **SRP** concerns responsibility and reasons for change. **ISP** concerns
dependencies between clients and abstractions.

Consider:

```js
class UserService {
    createUser() {
    }

    deleteUser() {
    }

    sendEmail() {
    }

    generateReport() {
    }
}
```

This may violate SRP because several independent responsibilities have been combined. It may also violate ISP if
different clients depend on unrelated subsets of those operations.

The principles can therefore lead to the same refactoring while identifying different problems. SRP asks whether the
abstraction contains multiple independent responsibilities. ISP asks whether clients are being forced to depend on
capabilities they do not require.

## ISP and Open-Closed Principle

ISP can support the **Open-Closed Principle** by reducing the number of clients exposed to unrelated interface
evolution. Consider:

```js
class Storage {
    read() {
    }

    write() {
    }
}
```

If replication becomes a new capability, a broad contract might become:

```js
class Storage {
    read() {
    }

    write() {
    }

    replicate() {
    }
}
```

Depending on the language and abstraction mechanism, implementations and consumers may now need to reconsider a contract
that changed for reasons unrelated to them.

Capability-specific contracts isolate that evolution:

```js
class ReadableStorage {
    read() {
    }
}

class WritableStorage {
    write() {
    }
}

class ReplicableStorage {
    replicate() {
    }
}
```

Replication can now evolve as an independent capability without inherently affecting consumers that do not require it.
ISP does not make a system open to every possible extension; it reduces the number of unrelated dependencies that an
extension can disturb.

## ISP and Dependency Inversion

The **Dependency Inversion Principle** encourages high-level code to depend on abstractions rather than concrete
implementation details. ISP helps determine **how broad those abstractions should be**.

A service such as:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

may have an unnecessarily broad dependency if the repository exposes dozens of operations while the service uses only
`findById()`. A narrower contract makes the actual dependency explicit:

```js
class OrderReader {
    findById(id) {
    }
}

class OrderService {
    constructor(orderReader) {
        this.orderReader = orderReader;
    }
}
```

DIP answers the question of what kind of dependency should cross a boundary. ISP helps determine how much of that
dependency the client actually needs.

## ISP and Dependency Injection

Dependency injection makes interface segregation particularly visible because constructor parameters expose component
dependencies. Consider:

```js
class ReportService {
    constructor(repository) {
        this.repository = repository;
    }

    generate() {
        return this.repository.findAll();
    }
}
```

If `repository` represents a large abstraction, the constructor communicates a broader dependency than the service
actually requires. A narrower dependency makes the boundary explicit:

```js
class ReportReader {
    findAll() {
    }
}

class ReportService {
    constructor(reader) {
        this.reader = reader;
    }

    generate() {
        return this.reader.findAll();
    }
}
```

The injected dependency now communicates the capability required by the service.

## ISP in JavaScript

JavaScript does not have native nominal interfaces. ISP can therefore be expressed through classes, object shapes,
functions, modules, dependency injection, and composition.

For example:

```js
function generateReport(reader) {
    return reader.findAll();
}

const reader = {
    findAll() {
        return [];
    }
};

generateReport(reader);
```

The function establishes a minimal structural contract. The caller must provide an object with `findAll()`, but the
object does not need to expose unrelated behavior. This demonstrates that ISP is not dependent on a language having an
`interface` keyword.

## Structural Typing

TypeScript makes this approach explicit through structural typing:

```ts
interface UserReader {
    findById(id: string): User | null;
}

function loadUser(reader: UserReader, id: string) {
    return reader.findById(id);
}
```

An object can satisfy `UserReader` without explicitly declaring that it implements the interface:

```ts
const repository = {
    findById(id: string) {
        // ...
    },

    save(user: User) {
        // ...
    },

    delete(id: string) {
        // ...
    }
};

loadUser(repository, "42");
```

The consumer depends only on `findById()`. The concrete object can expose additional behavior without expanding the
consumer's dependency contract.

## TypeScript Interfaces

TypeScript also provides explicit language support for segregated contracts:

```ts
interface Reader {
    read(): string;
}

interface Writer {
    write(value: string): void;
}

interface Closer {
    close(): void;
}
```

A component can satisfy several interfaces:

```ts
class File implements Reader, Writer, Closer {
    read() {
        return "";
    }

    write(value: string) {
        // ...
    }

    close() {
        // ...
    }
}
```

A consumer can depend only on the capability it requires:

```ts
function display(reader: Reader) {
    console.log(reader.read());
}
```

`display()` has no dependency on writing or closing.

## ISP and Functions

Functions themselves can represent segregated contracts. Instead of passing a broad service:

```js
function generateReport(reportService) {
    return reportService.generate();
}
```

a consumer can receive the exact capability it requires:

```js
function generateReport(loadReports) {
    const reports = loadReports();
    // ...
}
```

The dependency is now a single function. This can be described as **functional dependency injection** or
**parameter-level dependency injection**. The same design principle applies even though no formal interface exists.

## ISP and Higher-Order Functions

Higher-order functions naturally support narrow dependency boundaries:

```js
function createOrderService(saveOrder, publishEvent) {
    return {
        create(order) {
            saveOrder(order);
            publishEvent({
                type: "OrderCreated",
                order
            });
        }
    };
}
```

The service receives two explicit capabilities: one for saving an order and one for publishing an event. It does not
receive a broad infrastructure object containing database access, event management, logging, metrics, configuration, and
administrative operations.

Interface segregation is therefore possible even when there are no formal interfaces or classes.

## ISP and Modules

Modules provide another mechanism for controlling dependency surfaces. A broad infrastructure module might export:

```js
export {
    createUser,
    deleteUser,
    authenticate,
    generateReport,
    exportUsers,
    rebuildSearchIndex
};
```

A consumer responsible only for authentication can depend on the specific capability it requires:

```js
import {authenticate} from "./authentication.js";
```

Module boundaries therefore participate in interface segregation just as object and class boundaries do. The principle
applies whether the dependency boundary is an object, class, function, module, package, or service.

## ISP and API Design

ISP applies directly to APIs. Suppose an SDK exposes a broad `UserApi` containing operations for creating, updating,
deleting, searching, exporting, suspending, resetting passwords, and auditing users. A component responsible only for
displaying users may require only `searchUsers`.

The application can therefore define a read-oriented abstraction over the SDK:

```js
class UserReader {
    constructor(api) {
        this.api = api;
    }

    searchUsers(query) {
        return this.api.searchUsers(query);
    }
}
```

The underlying SDK may remain broad. The application's dependency boundary does not have to be. This distinction is
important because ISP does not require external APIs to be redesigned. A local adapter, facade, wrapper, or
application-level port can provide the segregation required by the consuming system.

## ISP and REST APIs

REST APIs already separate operations through resources and HTTP methods, but an application's client abstraction can
still be unnecessarily broad. Consider:

```js
class UserApiClient {
    getUsers() {
    }

    createUser() {
    }

    updateUser() {
    }

    deleteUser() {
    }

    resetPassword() {
    }
}
```

A read-only component may require only:

```js
class UserReader {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    getUsers() {
        return this.httpClient.get("/users");
    }
}
```

The underlying HTTP client can remain broad while the application-level dependency remains narrow.

## ISP and Event Systems

Event consumers often need only a subset of an event system's capabilities. Suppose the infrastructure provides:

```js
class EventBus {
    publish(event) {
    }

    subscribe(type, handler) {
    }

    unsubscribe(type, handler) {
    }

    replay(stream) {
    }

    inspect() {
    }

    purge() {
    }
}
```

A consumer that only registers handlers can depend on the required capability:

```js
function registerHandlers(subscribe) {
    subscribe("OrderCreated", handleOrderCreated);
}
```

The consumer does not need publishing, replay, inspection, or administrative operations merely because the underlying
event bus supports them.

## ISP and Repositories

Repositories are frequently designed as broad CRUD abstractions:

```js
class Repository {
    findById(id) {
    }

    findAll() {
    }

    save(entity) {
    }

    update(entity) {
    }

    delete(id) {
    }
}
```

Different application services may require completely different subsets of these operations. The consumer-facing
contracts can instead be separated:

```js
class UserReader {
    findById(id) {
    }
}

class UserWriter {
    save(user) {
    }
}

class UserDeleter {
    delete(id) {
    }
}
```

A read-only service can depend on `UserReader` without acquiring a dependency on mutation operations. The concrete
repository can still implement all of these capabilities.

## ISP and CQRS

**Command Query Responsibility Segregation (CQRS)** naturally aligns with interface segregation because commands and
queries often have different consumers and dependency requirements.

Instead of:

```js
class UserRepository {
    findById(id) {
    }

    save(user) {
    }

    delete(id) {
    }
}
```

a system can provide separate consumer-facing contracts:

```js
class UserReader {
    findById(id) {
    }
}

class UserWriter {
    save(user) {
    }

    delete(id) {
    }
}
```

CQRS is not required by ISP, and ISP does not require CQRS. They simply align naturally when read and write capabilities
are consumed by different parts of the system.

## ISP and Security

Interface segregation can also reduce unnecessary authority. Consider:

```js
class UserService {
    readUsers() {
    }

    deleteUsers() {
    }

    resetPasswords() {
    }

    promoteUsers() {
    }
}
```

A component that only needs to display users should not necessarily receive an object exposing administrative
capabilities. A narrower contract makes the intended authority explicit:

```js
class UserReader {
    readUsers() {
    }
}
```

This relates to the principle of **least authority**. ISP is not itself a security model, but narrower interfaces can
reduce the capabilities available to components and make authority boundaries easier to reason about and enforce.

## ISP and Encapsulation

A broad interface can expose behavior that a consumer does not need to know about. Consider:

```js
class AccountService {
    getBalance() {
    }

    deposit() {
    }

    withdraw() {
    }

    closeAccount() {
    }
}
```

A dashboard may require only:

```js
class AccountReader {
    getBalance() {
    }
}
```

The dashboard's dependency is now explicitly read-oriented. The improvement is not merely aesthetic. The consumer is
coupled only to the capability relevant to its purpose rather than to the complete operational surface of the account
service.

## ISP and Testing

Large interfaces often make test doubles unnecessarily complicated. Suppose a repository exposes:

```js
class Repository {
    findById() {
    }

    save() {
    }

    delete() {
    }

    backup() {
    }

    restore() {
    }

    migrate() {
    }
}
```

A read-only test may create a mock such as:

```js
const repository = {
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    backup: jest.fn(),
    restore: jest.fn(),
    migrate: jest.fn()
};
```

A segregated dependency requires only:

```js
const reader = {
    findById: jest.fn()
};
```

Smaller interfaces therefore tend to produce simpler test doubles and clearer tests. Excessive mocking can be a useful
architectural signal. If most of a mock exists only because a type or abstraction requires methods that the client never
uses, the dependency boundary deserves investigation.

## ISP and Mocking

Mock complexity is often a practical symptom of an overly broad dependency. When a test must construct a large object
containing many methods that are irrelevant to the behavior under test, the mock is reflecting the shape of the
production dependency rather than the actual requirements of the client.

A narrow dependency makes the test double correspond directly to the required capability. This does not mean that every
large mock proves an ISP violation; some cohesive abstractions legitimately require substantial contracts. The useful
signal is whether the unused portions of the mock correspond to unrelated capabilities.

## ISP and Dependency Graphs

Broad interfaces create unnecessary dependency edges between clients and capabilities. If several clients depend on one
large abstraction, a change to one capability can potentially propagate through the shared contract even when the other
clients do not use that capability.

Segregated contracts make those relationships explicit. A read client depends on a reader contract, a write client
depends on a writer contract, and an administrative client depends on an administrative contract. The runtime
implementation may remain one object. What changes is the conceptual dependency graph.

ISP therefore reduces **unrelated conceptual dependencies**, not necessarily the number of runtime objects.

## ISP and Package Dependencies

The same principle applies at package boundaries. Suppose a package exposes database access, logging, metrics, tracing,
configuration, and migration facilities through one broad dependency.

A consumer that only needs logging should ideally depend on a logging abstraction rather than on the entire
infrastructure surface. This matters particularly in large systems because package-level dependencies affect build
times, deployment, testing, versioning, ownership, and architectural boundaries.

A package API can therefore become a fat interface even when no class named `Interface` exists.

## ISP and Versioning

Broad interfaces can also be harder to evolve safely. Suppose a storage contract contains:

```js
class Storage {
    read() {
    }

    write() {
    }
}
```

A migration capability is later introduced:

```js
class Storage {
    read() {
    }

    write() {
    }

    migrate() {
    }
}
```

Depending on the language and abstraction mechanism, implementations may now need to change even when they do not
participate in migration. If migration represents an independent capability, a separate contract isolates that
evolution:

```js
class MigratableStorage {
    migrate() {
    }
}
```

Smaller, cohesive contracts can therefore provide more stable versioning boundaries.

## ISP and Optional Methods

Optional methods do not automatically solve interface pollution. Consider:

```js
class Worker {
    work() {
    }

    eat() {
        // optional
    }

    sleep() {
        // optional
    }
}
```

If clients must write:

```js
if (typeof worker.eat === "function") {
    worker.eat();
}
```

they are still reasoning about a capability that is not universally available.

Optional members are appropriate when optionality is genuinely part of the abstraction's contract. They should not be
used merely to conceal an abstraction that combines unrelated capabilities. A disabled capability and an absent
capability are also different concepts: feature flags control runtime availability, while ISP concerns dependency
structure.

## ISP and Capability Detection

Code such as:

```js
if (typeof service.export === "function") {
    service.export();
}
```

can indicate that a capability-oriented design exists implicitly but has not been modeled explicitly.

If exporting is an independent capability, it can be represented separately:

```js
class Exporter {
    export() {
    }
}
```

Consumers that require exporting can depend on that capability, while other consumers remain unaware of it.

Capability detection is not automatically a design error in dynamic JavaScript. However, repeated capability checks can
indicate that the abstraction boundary should be made explicit.

## ISP and Feature Flags

Feature flags and interface segregation solve different problems. A feature flag determines whether a capability is
available at runtime, while ISP determines whether a client should depend on that capability at all.

A disabled export feature does not make an `export()` dependency architecturally irrelevant. If a client structurally
depends on an export-capable service, the dependency still exists even when the feature is currently disabled.

Feature management therefore should not be used as a substitute for segregating unrelated capabilities.

## ISP and Abstract Base Classes

Abstract base classes can become too broad just like interfaces can. Consider:

```js
class DocumentProcessor {
    parse() {
    }

    validate() {
    }

    render() {
    }

    print() {
    }

    archive() {
    }
}
```

Different processors may require only subsets of these capabilities. Inheritance does not make an abstraction cohesive.
The base class should contain behavior that is genuinely common to its valid implementations.

If subclasses repeatedly inherit operations they cannot support, the abstraction may need to be split or replaced with
composition.

## ISP and Mixins

Mixins can provide capability-oriented composition in JavaScript:

```js
const Printable = Base => class extends Base {
    print() {
    }
};

const Scannable = Base => class extends Base {
    scan() {
    }
};

class Device {
}

class MultifunctionDevice extends Printable(Scannable(Device)) {
}
```

The capabilities are composed independently. However, mixins do not automatically produce good interface design. Each
mixin still needs a coherent contract and a meaningful reason to exist.

The principle remains the same: clients should depend on coherent capabilities rather than unrelated behavior.

## ISP and Composition

Composition is often a natural implementation mechanism for segregated capabilities:

```js
class Device {
    constructor({printer, scanner}) {
        this.printer = printer;
        this.scanner = scanner;
    }

    print(document) {
        return this.printer.print(document);
    }

    scan(document) {
        return this.scanner.scan(document);
    }
}
```

The device is assembled from independent capabilities instead of requiring every implementation to inherit one broad
abstraction.

Composition and ISP complement one another, but ISP does not require composition. A single class can provide multiple
segregated contracts just as effectively.

## ISP and Strategy

The **Strategy Pattern** naturally works with narrow interfaces. Instead of defining a strategy abstraction containing
unrelated behavior:

```js
class Strategy {
    calculate() {
    }

    validate() {
    }

    serialize() {
    }

    log() {
    }
}
```

the strategy can expose only the behavior that actually varies:

```js
class PricingStrategy {
    calculate(cart) {
    }
}
```

The consumer depends only on pricing behavior. Validation, serialization, and logging can remain separate concerns when
they represent independent responsibilities.

## ISP and Adapter

An Adapter can expose a narrow interface over a broad external dependency. For example:

```js
class PaymentAdapter {
    constructor(provider) {
        this.provider = provider;
    }

    charge(amount) {
        return this.provider.makePayment(amount);
    }
}
```

The external provider may expose dozens of operations, but the application receives only the `charge()` capability from
the adapter.

This is particularly useful at integration boundaries because the adapter prevents unnecessary external API surface from
leaking into application code.

## ISP and Facade

The **Facade Pattern** can similarly provide a narrower client-facing contract over a complex subsystem. Suppose a
subsystem exposes:

```js
class VideoSubsystem {
    decode() {
    }

    encode() {
    }

    stream() {
    }

    transcode() {
    }

    inspectMetadata() {
    }

    generateThumbnail() {
    }
}
```

A client may require only thumbnail generation. A facade can expose the relevant workflow:

```js
class VideoThumbnailService {
    generate(video) {
        // ...
    }
}
```

The facade does not need to expose the entire subsystem API. Facade and ISP therefore complement one another: the facade
can establish a cohesive client-facing contract over a broader implementation.

## ISP and Service Interfaces

Service abstractions should reflect the capabilities required by their consumers. A broad service might contain:

```js
class UserService {
    create() {
    }

    read() {
    }

    update() {
    }

    delete() {
    }

    authenticate() {
    }

    resetPassword() {
    }

    export() {
    }
}
```

Different consumers may instead depend on distinct contracts:

```js
class UserReader {
    read() {
    }
}

class UserWriter {
    create() {
    }

    update() {
    }
}

class UserDeleter {
    delete() {
    }
}

class AuthenticationService {
    authenticate() {
    }
}

class PasswordResetService {
    resetPassword() {
    }
}
```

These contracts can still be implemented by one underlying component if that is appropriate. Segregation does not
require duplication of implementation.

## ISP Does Not Require Physical Separation

Interfaces can be logically separate while sharing one implementation. For example:

```js
class UserService {
    read() {
    }

    create() {
    }

    update() {
    }

    delete() {
    }
}
```

The same object can provide multiple client-facing capabilities. The important distinction is between the
**implementation** and the **contract through which a client depends on that implementation**.

A single `UserService` does not have to become four classes merely because four different client-facing contracts exist.
This is particularly important in JavaScript and TypeScript, where one object can naturally satisfy several structural
contracts.

## ISP and Internal and External Interfaces

A component can have a broad internal implementation while exposing narrow external contracts. Consider:

```js
class RepositoryImplementation {
    findById() {
    }

    save() {
    }

    delete() {
    }

    rebuildIndex() {
    }

    backup() {
    }
}
```

One consumer may receive a reader view, another a writer view, and an administrative component a maintenance view. The
implementation remains centralized while the dependency boundaries remain segregated.

This is often the most practical form of ISP: **one implementation, multiple appropriately scoped contracts.**

## ISP and Read Models

Read-oriented consumers frequently need only a subset of domain behavior. For example:

```js
class OrderQuery {
    findRecentOrders() {
    }
}
```

A reporting component should not need to depend on the complete order aggregate merely because the aggregate contains
many operations:

```js
class Order {
    create() {
    }

    cancel() {
    }

    ship() {
    }

    refund() {
    }

    calculateTax() {
    }
}
```

The reporting component needs a query capability, not lifecycle mutation, refund, or other domain-operation
capabilities. Separating the dependency keeps read-oriented consumers independent from mutation-oriented behavior.

## ISP and Domain-Driven Design

In domain-driven systems, ISP aligns naturally with **bounded contexts, capabilities, use cases, and aggregate
boundaries**. A domain model may contain many operations related to an entity, but that does not mean every consumer
should depend on all of them.

An order may participate in lifecycle management, payment, fulfillment, shipment, and reporting. Different consumers may
require different subsets of those capabilities. Segregated contracts allow each consumer to depend on the behavior
relevant to its use case.

ISP does not require splitting a domain entity merely because different consumers use different methods. The question is
whether the consumer-facing dependency should expose those other capabilities.

## ISP and Ports and Adapters

In Hexagonal Architecture, application ports should describe the capabilities required by the application. A broad
infrastructure abstraction such as:

```js
class DatabasePort {
    connect() {
    }

    query() {
    }

    migrate() {
    }

    backup() {
    }

    restore() {
    }
}
```

may expose far more capability than a particular use case requires. A user-related use case may require only:

```js
class UserReader {
    findById(id) {
    }
}
```

An infrastructure adapter can implement that required contract. This prevents infrastructure capabilities from leaking
into application-level dependencies and keeps the application dependent on the behavior it actually requires.

## ISP and Clean Architecture

Clean Architecture encourages dependencies toward stable abstractions. ISP helps ensure that those abstractions are
scoped to the needs of their consumers.

A use case that needs to load a user can depend on a `UserReader` contract rather than a broad database service
containing querying, migration, backup, restoration, replication, and administrative operations. The narrower boundary
makes the dependency more explicit and reduces the amount of infrastructure knowledge crossing into the use-case layer.

## ISP and Microservices

ISP can influence service contracts, but it does not prescribe microservice decomposition. A service may expose
authentication, billing, reporting, notification, and profile-management capabilities through one deployment. Different
consumers can still depend on different logical contracts.

Separating those contracts can reduce dependency coupling even when the underlying implementation remains physically
unified.

Physical decomposition is an architectural decision involving deployment, scalability, ownership, operational
complexity, data boundaries, and other concerns. ISP concerns the dependency boundary, not the number of deployed
services.

## ISP Does Not Mean Microservice Decomposition

Logical contract segregation and physical service decomposition are independent decisions. Several segregated contracts
can exist inside one process, package, application, or deployed service.

A system does not become more ISP-compliant merely because one broad service is replaced by several microservices. If
the resulting services still expose broad, unrelated contracts, the original dependency problem remains at a different
physical boundary.

Conversely, a single deployed service can provide excellent interface segregation if its consumers depend only on the
capabilities relevant to them.

## Detecting ISP Violations

Common indicators of ISP problems include interfaces with many unrelated methods, implementations containing empty
methods, implementations throwing `NotSupportedError`, clients using only a small fraction of an interface, frequent
interface changes affecting unrelated clients, clients depending on large service objects, repeated capability checks,
excessive mocking of unused methods, interfaces combining read and write responsibilities, administrative operations
mixed with ordinary operations, and clients receiving more authority than they require.

No individual indicator proves an ISP violation. A class can legitimately have many methods, and a client can
legitimately use only some methods of a cohesive abstraction.

The important question is whether **unrelated clients or implementations are coupled through the same abstraction**.

## A Practical Heuristic

A useful heuristic is: **If two groups of clients use completely different subsets of an interface, investigate whether
those subsets represent independent capabilities.**

Suppose one group consistently uses `A` and `B`, another uses `C` and `D`, and another uses `E` and `F`. That is a
strong signal that the original interface may contain several independent contracts.

By contrast, an interface containing `open()`, `read()`, `seek()`, and `close()` may be perfectly cohesive if those
operations together represent one file-access capability. Different clients using different subsets is therefore a
**diagnostic signal**, not a mechanical rule for splitting interfaces.

## The Interface Pollution Test

When evaluating an abstraction, consider whether every implementation genuinely supports every operation, whether
clients use most of the interface, whether the operations are conceptually related, whether different clients depend on
unrelated subsets, whether implementations contain unsupported methods, whether clients perform capability detection,
whether unrelated changes repeatedly affect the interface, whether separating the interface would clarify dependencies,
whether smaller contracts would reduce testing complexity, and whether narrower contracts would reduce unnecessary
authority.

Several positive answers indicate that interface segregation may be appropriate. The result should still be evaluated
against cohesion. Splitting every method into its own interface can create a different design problem.

## Refactoring a Fat Interface

A practical refactoring begins by identifying every client of the abstraction and recording which operations each client
actually uses.

Suppose the existing abstraction contains `read`, `write`, `delete`, and `backup`. One client may use only `read`,
another may use `read` and `write`, a third may use `delete`, and a fourth may use `backup`.

A dependency matrix makes these relationships visible:

| Client   | read | write | delete | backup |
|:---------|:----:|:-----:|:------:|:------:|
| Client A |  ✓  |       |        |        |
| Client B |  ✓  |  ✓   |        |        |
| Client C |      |       |   ✓   |        |
| Client D |      |       |        |   ✓   |

The next step is to determine whether the operations form meaningful capabilities. In this example, reading, writing,
deleting, and backup are likely to represent independent concerns.

Those capabilities can then be represented by narrower contracts:

```js
class Reader {
    read() {
    }
}

class Writer {
    write() {
    }
}

class Deleter {
    delete() {
    }
}

class BackupManager {
    backup() {
    }
```

The concrete implementation does not necessarily need to be split:

```js
class Storage {
    read() {
    }

    write() {
    }

    delete() {
    }

    backup() {
    }
}
```

Consumers can then depend on the contract they actually require:

```js
class ReportService {
    constructor(reader) {
        this.reader = reader;
    }
}
```

Once all consumers have migrated, the original broad contract can be removed if it no longer represents a useful
abstraction. The refactoring should therefore focus on **changing dependency boundaries**, not mechanically multiplying
classes.

## Over-Segregation

ISP can itself be overapplied. Consider:

```js
class Reader {
    read() {
    }
}

class Opener {
    open() {
    }
}

class Closer {
    close() {
    }
}

class Seeker {
    seek() {
    }
}
```

If every consumer always needs all four operations as one coherent file-access capability, this may be excessive
fragmentation. The result can be more abstractions, more indirection, harder navigation, unnecessary composition, and
reduced conceptual clarity.

ISP does not mean: **Make every method an interface.** It means: **Do not force unrelated clients to depend on
capabilities they do not require.**

The correct design lies between a fat interface containing unrelated capabilities and a collection of meaningless
one-method interfaces.

## Cohesion Versus Fragmentation

The central design problem is finding the appropriate abstraction boundary.

An abstraction is too broad when unrelated capabilities are grouped together and clients are forced to depend on them as
one contract. An abstraction is too fragmented when behavior that naturally belongs together is split into numerous
artificial interfaces, forcing clients to assemble abstractions that have no meaningful reason to be separate.

The appropriate boundary preserves **cohesion while minimizing unnecessary client dependencies**.

For example, `open()`, `read()`, `seek()`, and `close()` may form one coherent file-access capability. Splitting each
operation into a separate interface provides little value if clients consistently require all four. By contrast,
combining `read()`, `sendEmail()`, `backup()`, and `rebuildIndex()` into one abstraction creates unrelated dependencies.

## ISP and API Evolution

A good interface should be relatively stable for its consumers. If adding an unrelated capability repeatedly forces
existing clients to reconsider their dependencies, the abstraction is probably too broad.

Segregated contracts allow capabilities to evolve more independently because clients depend only on the contracts
relevant to them. This is particularly valuable for public libraries, SDKs, plugin APIs, infrastructure ports, domain
services, and shared packages.

## ISP and Architectural Stability

Interfaces are architectural boundaries. A broad interface can cause multiple components to move together when the
interface changes, even if only one capability was modified.

Segregated contracts reduce the number of components affected by unrelated changes because each component depends on a
narrower contract. This is one of the architectural benefits of ISP: it can reduce the **blast radius of interface
evolution**.

## ISP and Stable Dependencies

A useful abstraction should be stable relative to its consumers. If a client depends on a `Reader` contract, changes to
unrelated writing, deletion, backup, or administration capabilities should not inherently affect that dependency.

This reduces accidental coupling and supports more independent evolution of the system.

## ISP and Least Knowledge

ISP can complement the **Law of Demeter** by reducing the amount of implementation knowledge available to a client. For
example:

```js
function displayUser(reader, id) {
    return reader.findById(id);
}
```

The function knows that it can read a user. It does not need to know how users are persisted, deleted, backed up,
indexed, or administered.

Narrow interfaces therefore reinforce encapsulation and information hiding. The principles are distinct, however. ISP
concerns dependency on capabilities, while the Law of Demeter concerns how objects and modules navigate relationships.

## ISP and Authority

A broad interface can grant more authority than a client requires. Consider:

```js
class AccountAdmin {
    readBalance() {
    }

    withdraw() {
    }

    closeAccount() {
    }

    changeOwner() {
    }
}
```

A reporting component should not require the entire administrative interface. Instead, it can depend on:

```js
class BalanceReader {
    readBalance() {
    }
}
```

The consumer receives only the capability it needs. This is useful even when security is not the primary concern because
the dependency itself communicates the intended authority of the component.

## ISP and Testing Contracts

Segregated interfaces make behavioral contracts easier to define. For example:

```js
function verifyReader(reader) {
    const user = reader.findById("42");

    if (user === undefined) {
        throw new Error("Reader contract violated");
    }
}
```

The test concerns only reading behavior. It does not need to account for unrelated operations such as deletion, backup,
or administration.

This produces more focused contract tests and makes failures easier to interpret.

## ISP and Functional Design

Functional programming naturally encourages small dependency surfaces. For example:

```js
const createOrder = (saveOrder, publishEvent) => order => {
    saveOrder(order);

    publishEvent({
        type: "OrderCreated",
        order
    });
};
```

The function receives exactly two capabilities. There is no broad interface to segregate because the dependency surface
is already explicit.

This demonstrates that ISP is fundamentally about **dependency shape**, not object-oriented syntax.

## ISP and Object Capabilities

JavaScript's ability to pass individual objects and functions makes capability-oriented design straightforward. For
example:

```js
function process(reader) {
    return reader.read();
}
```

The caller can provide exactly the required capability:

```js
process({
    read() {
        return "data";
    }
});
```

The consumer has no dependency on unrelated operations. This is interface segregation expressed through JavaScript's
structural and functional characteristics rather than through formal interface declarations.

## ISP and Classes

Classes remain useful when the implementation itself is naturally cohesive. For example:

```js
class FileStorage {
    open() {
    }

    read() {
    }

    write() {
    }

    close() {
    }
}
```

This may be a perfectly reasonable implementation. ISP does not require splitting the implementation into separate
reader, writer, opener, and closer classes.

The segregation can exist at the dependency boundary. A reporting client might receive a read-oriented view of the
object, while another component receives a write-oriented view. The implementation and the client-facing interface
structure do not have to be identical.

## ISP and the Dependency View

A useful mental model is that a concrete object can provide multiple **views** to different consumers. Consider:

```js
class Repository {
    findById(id) {
    }

    save(entity) {
    }

    delete(id) {
    }
}
```

One consumer may depend on the reading capability:

```js
class Reader {
    findById(id) {
    }
}
```

Another may depend on writing:

```js
class Writer {
    save(entity) {
    }
}
```

The concrete repository does not need to become two separate implementations. The dependency contract differs by
consumer.

This distinction is particularly important in JavaScript and TypeScript, where structural typing and duck typing make it
natural for one object to satisfy several narrower contracts.

## Common Misconceptions

### ISP Means Interfaces Must Have One Method

Incorrect. A multi-method interface can be perfectly segregated if its operations form one cohesive capability.

### Every Class Should Implement Several Interfaces

Incorrect. A class may implement one contract, several contracts, or none explicitly. ISP concerns client dependencies
rather than a required number of interfaces per class.

### Large Interfaces Are Always Bad

Incorrect. A large but cohesive interface can be appropriate. The problem is unnecessary dependency on unrelated
operations.

### Small Interfaces Are Always Better

Also incorrect. Excessive fragmentation can create meaningless abstractions, increase indirection, and reduce conceptual
clarity. Interfaces should be **cohesive**, not arbitrarily small.

### ISP Requires Separate Implementations

Incorrect. One implementation can satisfy multiple segregated contracts.

### ISP Requires Microservices

Incorrect. Interface segregation is independent of deployment topology.

### Optional Methods Solve ISP

Not necessarily. Optional members can still represent an abstraction that is too broad if clients must reason about
capabilities that are not universally available.

### ISP Is Only Relevant to Statically Typed Languages

Incorrect. JavaScript can apply ISP through structural contracts, functions, modules, dependency injection, composition,
and object capabilities.

### ISP Means Exposing Fewer Methods to Everyone

Not exactly. The principle is about exposing the **right capabilities to each client**. Different clients can
legitimately receive different interfaces to the same underlying implementation.

## Practical Guidelines

When applying ISP, several principles provide useful guidance.

* **Design around client needs.** Start from what consumers actually require rather than from every operation an
  implementation happens to provide.
* **Prefer cohesive contracts.** Operations should represent a meaningful capability or responsibility for the clients
  that consume them.
* **Treat different client subsets as a signal.** If unrelated groups consistently use different parts of an interface,
  investigate whether those parts represent independent capabilities.
* **Do not use method count as the criterion.** A ten-method cohesive contract can be better than ten unrelated
  one-method interfaces.
* **Separate contracts from implementations.** A broad implementation can legitimately satisfy several narrow
  consumer-facing contracts.
* **Use composition when capabilities vary independently.** Composition often makes capability boundaries explicit
  without forcing unrelated inheritance relationships.
* **Avoid unsupported operations.** Empty methods, `NotSupportedError`, and meaningless implementations can indicate
  that a contract is forcing capabilities onto implementations that do not possess them.
* **Keep client dependencies narrow.** Inject, import, or expose only the capabilities required by the consumer.
* **Consider change coupling.** If unrelated interface changes repeatedly affect consumers, reconsider the abstraction
  boundary.
* **Consider authority.** Do not give a component administrative or mutation capabilities when it only needs read
  access.
* **Use adapters and facades at external boundaries.** A broad third-party API does not require application code to
  depend on its complete surface.
* **Do not confuse logical segregation with physical decomposition.** Multiple contracts can share one implementation,
  package, process, or service.
* **Avoid over-segregation.** Split interfaces when the resulting contracts represent meaningful independent
  capabilities, not merely because smaller interfaces are aesthetically preferable.
* **Use tests as architectural evidence.** Large mocks, unused mock methods, and repeated capability setup can reveal
  overly broad dependencies.

## Summary

The Interface Segregation Principle states: **Clients should not be forced to depend on interfaces they do not use.**

The principle is fundamentally about **cohesion and dependency boundaries**. A good interface represents a coherent
capability, exposes behavior relevant to its consumers, avoids unrelated operations, minimizes unnecessary dependency
surface, allows implementations to satisfy complete contracts, reduces change coupling, simplifies testing, improves
encapsulation, and can reduce unnecessary authority.

ISP does not mean that every interface must be tiny. It does not require every method to have its own interface, every
class to implement multiple interfaces, every implementation to be physically separated, or every capability to become a
separate microservice. It also does not prohibit broad concrete implementations.

The implementation and the interface are separate design concerns. A concrete component may legitimately provide many
capabilities:

```js
class Storage {
    read() {
    }

    write() {
    }

    delete() {
    }

    backup() {
    }
}
```

while different clients depend on narrower contracts:

```js
class Reader {
    read() {
    }
}

class Writer {
    write() {
    }
}

class Deleter {
    delete() {
    }
}

class BackupManager {
    backup() {
    }
}
```

The implementation does not have to be fragmented merely because its consumers require different capabilities. The
essential distinction is between **what an implementation can do** and **what a client is required to depend upon**.

The central design problem is a broad abstraction that forces unrelated clients to share one dependency surface. The
preferred design is to expose cohesive contracts corresponding to the capabilities those clients actually require.

The essential idea behind ISP is: **Segregate the contracts that clients depend on, not necessarily the implementations
that provide them.**

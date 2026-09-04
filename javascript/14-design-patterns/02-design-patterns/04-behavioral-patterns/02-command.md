# Command

Command is a behavioral design pattern that encapsulates a request as an object. Instead of directly invoking an
operation on its receiver, a client creates a command that represents the requested operation and its required
arguments. The command can then be passed to another component, stored, queued, delayed, retried, logged, audited,
composed, or executed independently of the code that originally requested it.

The essential separation is between **requesting an operation** and **performing the operation**. A command object
represents what should happen, while a receiver contains the domain or application logic that actually performs it.

## Intent

Command encapsulates a request as an object, allowing the request to be parameterized, stored, transferred, delayed,
queued, logged, retried, or otherwise manipulated independently of the receiver that performs it.

The pattern is particularly useful when an operation needs to become a first-class value rather than remaining an
immediate method call.

## The Problem

Direct method invocation tightly couples the code that initiates an operation to the object that performs it.

Consider a user-interface component that directly invokes several operations:

```js
editor.insertText("Hello");
editor.save();
editor.close();
```

The UI knows which object performs the operations, which methods exist, which arguments they require, and when each
operation must be executed.

That coupling becomes problematic when the operation needs to be placed in a queue, executed later, recorded for
auditing, retried after failure, exposed through a generic action mechanism, or undone.

A command introduces an intermediate representation:

```js
const command = new InsertTextCommand(editor, "Hello");

command.execute();
```

The caller now deals with a representation of the request rather than directly depending on the receiver's invocation
details.

## Structure

A typical Command implementation contains four conceptual roles.

### Command

The Command abstraction defines the operation used to execute the request.

```js
class Command {
    execute() {
        throw new Error("Not implemented");
    }
}
```

The abstraction may also define additional lifecycle operations such as `undo()`, `redo()`, validation, serialization,
or cancellation when those concerns are genuinely required.

### Concrete Command

A Concrete Command represents a particular request and stores the information required to execute it.

```js
class InsertTextCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }

    execute() {
        this.editor.insertText(this.text);
    }
}
```

The command normally holds a reference to its receiver and any request-specific arguments.

### Receiver

The Receiver contains the actual implementation of the operation.

```js
class Editor {
    insertText(text) {
        console.log(`Inserted: ${text}`);
    }
}
```

The receiver does not need to know that a Command object exists. It simply provides the operation that the command
invokes.

### Invoker

The Invoker accepts or stores commands and determines when they are executed.

```js
class Button {
    constructor(command) {
        this.command = command;
    }

    click() {
        this.command.execute();
    }
}
```

The Invoker does not need to know the receiver's implementation. It only needs to know how to execute the command.

### Client

The Client creates and configures the command and associates it with the appropriate receiver.

```js
const editor = new Editor();
const command = new InsertTextCommand(editor, "Hello");
const button = new Button(command);

button.click();
```

The Client is responsible for assembling the objects participating in the operation.

## Encapsulating a Request

The defining characteristic of Command is that the request itself becomes an object.

A direct method call represents an operation in executable syntax:

```js
receiver.perform(value);
```

A command represents that same operation as data plus behavior:

```js
const command = new PerformCommand(receiver, value);
```

This distinction matters because an object can be passed around, stored, inspected, scheduled, queued, retried, or
persisted in ways that an immediate method invocation cannot.

Command therefore creates a boundary between **request representation** and **request execution**.

## Parameterizing Operations

Commands allow operations to be treated as values that can be selected dynamically.

```js
function executeCommand(command) {
    return command.execute();
}
```

The caller does not need to know which receiver or method is involved.

```js
executeCommand(new SaveDocumentCommand(document));
executeCommand(new CloseDocumentCommand(document));
executeCommand(new PublishDocumentCommand(document));
```

This is particularly useful when an application has generic infrastructure that must process different operations
through a common interface.

Examples include command buses, job queues, menu systems, UI actions, workflow engines, transaction logs, and task
schedulers.

## Storing Requests

Because a command is an object, it can be stored.

```js
class CommandHistory {
    constructor() {
        this.commands = [];
    }

    add(command) {
        this.commands.push(command);
    }

    execute(command) {
        command.execute();
        this.add(command);
    }
}
```

The history can retain commands after execution.

```js
history.execute(new InsertTextCommand(editor, "Hello"));
history.execute(new InsertTextCommand(editor, "World"));
```

The important property is not the history itself. It is that the operation has been represented as an object that can
exist independently of its immediate execution.

## Queuing Commands

Command is particularly useful when execution must be separated from request creation.

```js
class CommandQueue {
    constructor() {
        this.commands = [];
    }

    enqueue(command) {
        this.commands.push(command);
    }

    process() {
        while (this.commands.length > 0) {
            const command = this.commands.shift();
            command.execute();
        }
    }
}
```

The producer can create requests without executing them immediately.

```js
queue.enqueue(new SendEmailCommand(emailService, message));
queue.enqueue(new GenerateReportCommand(reportService, report));
queue.enqueue(new PublishEventCommand(eventBus, event));
```

Another component can process them later.

This separation is one of the strongest reasons to introduce Command.

## Delayed Execution

Commands can be scheduled for future execution.

```js
setTimeout(() => command.execute(), 5000);
```

The scheduling mechanism does not need to understand the underlying operation.

A more explicit scheduler can operate entirely on the Command abstraction:

```js
class Scheduler {
    schedule(command, delay) {
        setTimeout(() => command.execute(), delay);
    }
}
```

This allows scheduling infrastructure to remain independent of the domain operation.

## Queueing and Asynchronous Execution

Commands frequently represent asynchronous operations.

```js
class SaveDocumentCommand {
    constructor(documentService, document) {
        this.documentService = documentService;
        this.document = document;
    }

    async execute() {
        return this.documentService.save(this.document);
    }
}
```

A generic invoker can await commands without knowing their concrete implementation.

```js
async function executeCommand(command) {
    return await command.execute();
}
```

The Command abstraction therefore does not inherently imply synchronous execution. `execute()` may return a value, a
Promise, or another application-specific result.

## Returning Results

Not every command is naturally `void`.

A command may return the result of the receiver operation:

```js
class CreateUserCommand {
    constructor(userService, input) {
        this.userService = userService;
        this.input = input;
    }

    execute() {
        return this.userService.create(this.input);
    }
}
```

A command infrastructure should define whether results are expected.

In some systems, commands are intentionally fire-and-forget. In others, commands return domain results, operation
identifiers, persistence identifiers, or execution metadata.

The choice should be explicit because result handling affects queueing, retries, error propagation, and transaction
semantics.

## Commands and Undo

Command is often associated with undo because a command can retain enough information to reverse an operation.

```js
class InsertTextCommand {
    constructor(editor, text) {
        this.editor = editor;
        this.text = text;
    }

    execute() {
        this.editor.insertText(this.text);
    }

    undo() {
        this.editor.deleteLast(this.text.length);
    }
}
```

An invoker can maintain an undo stack.

```js
class History {
    constructor() {
        this.undoStack = [];
    }

    execute(command) {
        command.execute();
        this.undoStack.push(command);
    }

    undo() {
        const command = this.undoStack.pop();

        if (command) {
            command.undo();
        }
    }
}
```

However, Command does not inherently provide undo. The ability to reverse an operation requires additional state, a
reversible operation, or some other compensation mechanism.

A command can exist perfectly well without `undo()`.

## Undo Requires State Semantics

An undo operation must account for the state that existed when the command executed.

Consider:

```js
document.setTitle("Draft");
```

An undo operation cannot necessarily assume that restoring a fixed value is correct.

A command may therefore capture the previous state:

```js
class SetTitleCommand {
    constructor(document, title) {
        this.document = document;
        this.title = title;
        this.previousTitle = undefined;
    }

    execute() {
        this.previousTitle = this.document.title;
        this.document.title = this.title;
    }

    undo() {
        this.document.title = this.previousTitle;
    }
}
```

This introduces lifecycle requirements. A command may need to be executed before it can be undone, and executing the
same command multiple times may require clearly defined semantics.

## Idempotency

Commands that may be retried should define whether repeated execution is safe.

An idempotent command can be executed more than once without producing an unintended additional effect.

For example, setting a resource to a desired state can often be idempotent:

```js
class ActivateUserCommand {
    constructor(userService, userId) {
        this.userService = userService;
        this.userId = userId;
    }

    execute() {
        return this.userService.activate(this.userId);
    }
}
```

An operation such as "charge a credit card" is not naturally idempotent. Repeating the command could produce multiple
charges.

This distinction becomes critical when commands are retried by queues or distributed infrastructure.

## Command Identity

Commands sometimes require a unique identifier.

```js
class Command {
    constructor(id) {
        this.id = id;
    }
}
```

Command identity can support deduplication, tracing, auditing, persistence, or correlation.

For example, a queue processor can record processed command identifiers to avoid accidentally executing the same logical
request twice.

Command identity is an application concern rather than an intrinsic requirement of the GoF pattern.

## Command Metadata

A command may carry metadata in addition to the actual request.

```js
class Command {
    constructor({id, userId, timestamp}) {
        this.id = id;
        this.userId = userId;
        this.timestamp = timestamp;
    }

    execute() {
        throw new Error("Not implemented");
    }
}
```

Metadata can support authorization, auditing, tracing, correlation, scheduling, or observability.

However, commands should not become arbitrary containers for unrelated infrastructure state. Metadata should represent
information genuinely associated with the request.

## Command Composition

Commands can themselves be composed.

```js
class MacroCommand {
    constructor(commands) {
        this.commands = commands;
    }

    execute() {
        for (const command of this.commands) {
            command.execute();
        }
    }
}
```

A macro command represents several operations as one higher-level command.

```js
const command = new MacroCommand([
    new OpenDocumentCommand(editor),
    new InsertTextCommand(editor, "Hello"),
    new SaveDocumentCommand(editor)
]);

command.execute();
```

This can be useful for UI macros, workflows, batch operations, or transaction-like application operations.

Composition must define failure semantics. If the third command fails after the first two succeed, the system must
decide whether the previous operations remain applied, are compensated, or are otherwise handled.

## Transactions and Compensation

Command composition does not automatically provide transactional behavior.

Consider:

```js
const command = new MacroCommand([
    reserveInventory,
    chargePayment,
    createShipment
]);
```

If `createShipment` fails, simply knowing that the previous commands succeeded does not provide a rollback mechanism.

A system may instead define compensating commands:

```js
reserveInventory.execute();
chargePayment.execute();

try {
    createShipment.execute();
} catch (error) {
    refundPayment.execute();
    releaseInventory.execute();
    throw error;
}
```

This is a domain-specific compensation strategy. It should not be confused with the structural Command pattern itself.

## Command as Data

A command can be implemented as an object containing executable behavior.

```js
const command = {
    execute() {
        editor.save();
    }
};
```

This is sufficient for many JavaScript applications.

Command does not require an inheritance hierarchy. The important property is the encapsulation of a request behind a
common execution abstraction.

## Functional Commands

JavaScript functions are naturally suited to representing commands.

```js
const saveCommand = () => editor.save();
const closeCommand = () => editor.close();

saveCommand();
closeCommand();
```

A queue can therefore store functions directly:

```js
const queue = [];

queue.push(() => editor.save());
queue.push(() => editor.close());

for (const command of queue) {
    command();
}
```

This is conceptually compatible with Command when the function represents a request that can be independently stored and
executed.

The explicit Command object becomes valuable when the request needs additional structure, metadata, identity,
validation, serialization, undo behavior, or a stable contract.

## Object Commands vs Function Commands

Function commands are concise and idiomatic in JavaScript.

```js
const command = () => receiver.perform(value);
```

Object commands provide a richer representation.

```js
class PerformCommand {
    constructor(receiver, value) {
        this.receiver = receiver;
        this.value = value;
    }

    execute() {
        return this.receiver.perform(this.value);
    }
}
```

The object form is generally preferable when the command participates in a larger protocol.

The function form is generally preferable when the only required capability is deferred invocation and there is no need
for additional command state or behavior.

The pattern should not be made more elaborate merely to satisfy a textbook structure.

## Commands with Validation

Commands can validate their inputs before execution.

```js
class DeleteUserCommand {
    constructor(userService, userId) {
        this.userService = userService;
        this.userId = userId;
    }

    validate() {
        if (!this.userId) {
            throw new Error("User ID is required");
        }
    }

    execute() {
        this.validate();
        return this.userService.delete(this.userId);
    }
}
```

Whether validation belongs in the command depends on the application's architecture.

Commands can perform request-level validation, while domain invariants should remain enforced by the domain model or
receiver rather than relying exclusively on the command.

## Commands and Authorization

A command can provide a useful authorization boundary because it represents a concrete operation.

```js
class DeleteUserCommand {
    constructor(userService, userId, actor) {
        this.userService = userService;
        this.userId = userId;
        this.actor = actor;
    }

    execute() {
        if (!this.actor.canDeleteUsers()) {
            throw new Error("Unauthorized");
        }

        return this.userService.delete(this.userId);
    }
}
```

However, authorization should not exist only inside a command if the operation can be invoked through other paths.

The command can participate in authorization, but the receiver or domain boundary may still need independent
enforcement.

## Commands and Logging

Because a command represents a request, it provides a natural point for logging.

```js
class LoggingInvoker {
    execute(command) {
        console.log(`Executing ${command.constructor.name}`);
        return command.execute();
    }
}
```

This allows invocation infrastructure to observe commands without modifying every receiver.

Command metadata can make the logging more useful:

```js
console.log({
    commandId: command.id,
    commandType: command.type,
    timestamp: command.timestamp
});
```

Care must be taken not to log sensitive request data indiscriminately.

## Commands and Auditing

Command objects can represent meaningful business operations such as:

```text
CreateAccount
ApproveInvoice
TransferFunds
ChangeSubscription
PublishDocument
DeleteUser
```

Recording those commands can provide an audit trail at the level of business intent rather than merely recording
low-level method calls.

An audit system may store a serialized representation of the request instead of the executable command object itself.

This distinction becomes important when commands cross process or persistence boundaries.

## Serialization

Executable JavaScript functions and object references generally cannot be serialized directly into durable storage.

A persisted command should therefore be represented as data:

```js
const command = {
    type: "CreateUser",
    version: 1,
    payload: {
        name: "Alice",
        email: "alice@example.com"
    }
};
```

A dispatcher can resolve the command type:

```js
const handlers = {
    CreateUser: command => userService.create(command.payload)
};

handlers[command.type](command);
```

This is a related but more infrastructure-oriented use of Command.

Once commands are serialized, schema versioning, compatibility, validation, security, and migration become part of the
design.

## Command Handlers and Command Objects

In some architectures, the command itself contains no executable behavior.

```js
class CreateUserCommand {
    constructor(data) {
        this.data = data;
    }
}
```

A separate handler performs the operation:

```js
class CreateUserHandler {
    constructor(userService) {
        this.userService = userService;
    }

    execute(command) {
        return this.userService.create(command.data);
    }
}
```

This is still commonly described as a Command-based architecture, but the responsibility is split between the command as
request data and a handler as request executor.

This form is especially useful when commands must cross process boundaries or be serialized.

## Command Dispatching

A command bus can route commands to their handlers.

```js
class CommandBus {
    constructor() {
        this.handlers = new Map();
    }

    register(type, handler) {
        this.handlers.set(type, handler);
    }

    execute(command) {
        const handler = this.handlers.get(command.type);

        if (!handler) {
            throw new Error(`No handler registered for ${command.type}`);
        }

        return handler.execute(command);
    }
}
```

The bus decouples the caller from the concrete handler.

```js
commandBus.execute(
    new CreateUserCommand({
        name: "Alice"
    })
);
```

A command bus is not required by the GoF Command pattern. It is an architectural mechanism that can be built around
commands when centralized dispatch provides value.

## Command Bus vs Invoker

The terms Invoker and Command Bus can overlap, but they represent different levels of abstraction.

A simple Invoker determines when a command executes:

```js
invoker.execute(command);
```

A Command Bus typically also resolves the handler associated with a command type:

```js
commandBus.execute(command);
```

It may additionally provide middleware, validation, authorization, transactions, tracing, retries, and other
infrastructure.

A command bus should therefore not be introduced merely because commands exist.

## Command Middleware

Command dispatch infrastructure can apply cross-cutting behavior around execution.

```js
class LoggingMiddleware {
    async execute(command, next) {
        console.log(`Executing ${command.type}`);
        return await next();
    }
}
```

Other middleware may provide:

* authorization
* validation
* transaction management
* retries
* tracing
* metrics
* idempotency
* rate limiting
* error handling

This resembles middleware pipelines, but the underlying abstraction remains request execution rather than arbitrary
transformation.

## Error Handling

Command execution can fail.

```js
class SaveCommand {
    constructor(repository, entity) {
        this.repository = repository;
        this.entity = entity;
    }

    execute() {
        return this.repository.save(this.entity);
    }
}
```

The command itself does not prescribe error-handling semantics.

An invoker may propagate the error:

```js
try {
    command.execute();
} catch (error) {
    report(error);
    throw error;
}
```

A queue may instead record the failed command and retry it.

Distributed command systems must additionally distinguish transient failures from permanent failures.

## Retries

Retrying a command requires more than simply calling `execute()` again.

```js
async function executeWithRetry(command, attempts) {
    let lastError;

    for (let i = 0; i < attempts; i++) {
        try {
            return await command.execute();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}
```

The command must tolerate the resulting execution semantics.

For operations that are not naturally idempotent, retries can produce duplicate side effects. Idempotency keys,
transactional guarantees, deduplication, or explicit compensation may therefore be necessary.

## Cancellation

Asynchronous commands may need cancellation.

```js
class DownloadCommand {
    constructor(service, url, signal) {
        this.service = service;
        this.url = url;
        this.signal = signal;
    }

    execute() {
        return this.service.download(this.url, {
            signal: this.signal
        });
    }
}
```

Cancellation is normally delegated to the underlying operation rather than being invented as a generic Command feature.

A command infrastructure can coordinate cancellation, but the receiver must support meaningful cancellation for it to
have an effect.

## Concurrency

A command queue may execute commands sequentially:

```js
for (const command of commands) {
    await command.execute();
}
```

Or concurrently:

```js
await Promise.all(
    commands.map(command => command.execute())
);
```

These are semantically different.

Sequential execution may be required when commands depend on state transitions. Concurrent execution may improve
throughput when commands are independent.

Command does not determine the execution policy. The invoker or execution infrastructure does.

## Ordering

When commands mutate shared state, execution order can be significant.

```js
const commands = [
    new SetBalanceCommand(account, 100),
    new SetBalanceCommand(account, 200)
];
```

Executing these commands in a different order produces a different final state.

A command queue should therefore define its ordering guarantees explicitly when order affects correctness.

## Stateful Commands

A command can contain mutable state.

```js
class SetNameCommand {
    constructor(user, name) {
        this.user = user;
        this.name = name;
        this.previousName = undefined;
    }

    execute() {
        this.previousName = this.user.name;
        this.user.name = this.name;
    }

    undo() {
        this.user.name = this.previousName;
    }
}
```

Stateful commands require careful lifecycle management.

Reusing the same command instance for multiple executions can overwrite state required for undo.

For example:

```js
command.execute();
command.execute();
command.undo();
```

The meaning of the final `undo()` is ambiguous unless repeated execution semantics are explicitly defined.

Immutable command data is often preferable for queued or distributed systems.

## Command Lifetime

A command may be short-lived:

```js
button.click();
```

Or long-lived:

```js
queue.enqueue(command);
```

Long-lived commands create ownership and lifecycle considerations.

A command should not retain resources unnecessarily while waiting in a queue. Holding a database connection, request
object, UI component, or large object graph for hours can create memory and resource-management problems.

For durable queues, commands should generally contain serializable identifiers and request data rather than live object
references.

## JavaScript Closures and Lifetime

Function-based commands can accidentally capture more state than intended.

```js
const command = () => {
    editor.save(document);
};
```

The closure may retain references to `editor`, `document`, and everything else captured by the surrounding scope.

For short-lived commands this is normally harmless. For large queues or long-lived schedulers, explicit command data can
make ownership and memory usage easier to reason about.

## TypeScript

TypeScript can express a generic Command contract.

```ts
interface Command<TResult = void> {
    execute(): TResult;
}
```

A concrete command can implement it:

```ts
class SaveDocumentCommand implements Command<Promise<void>> {
    constructor(
        private readonly service: DocumentService,
        private readonly documentId: string
    ) {
    }

    execute(): Promise<void> {
        return this.service.save(this.documentId);
    }
}
```

A generic invoker can preserve the result type:

```ts
function executeCommand<TResult>(
    command: Command<TResult>
): TResult {
    return command.execute();
}
```

For data-only commands, discriminated unions are often more appropriate:

```ts
type Command =
    | {
    type: "CreateUser";
    payload: {
        name: string;
        email: string;
    };
}
    | {
    type: "DeleteUser";
    payload: {
        userId: string;
    };
};
```

The appropriate representation depends on whether commands need executable behavior or primarily need to act as
transportable request data.

## Generic Command Handlers

A TypeScript command-handler architecture can associate command types with result types.

```ts
interface Command<TResult> {
    type: string;
}

interface CommandHandler<
    TCommand extends Command<TResult>,
    TResult
> {
    execute(command: TCommand): TResult;
}
```

A concrete implementation can then preserve the relationship between the request and result.

```ts
interface CreateUserCommand extends Command<User> {
    type: "CreateUser";
    name: string;
}

class CreateUserHandler
    implements CommandHandler<CreateUserCommand, User> {

    execute(command: CreateUserCommand): User {
        return createUser(command.name);
    }
}
```

This becomes useful in larger TypeScript systems where compile-time correspondence between commands and results matters.

## Command vs Strategy

Command and Strategy both encapsulate behavior, but they solve different problems.

Strategy encapsulates an algorithm or policy so that one behavior can be substituted for another.

Command encapsulates a request so that the request itself can be represented, passed around, stored, scheduled, or
executed independently of the caller.

A strategy answers **how should this operation be performed?**

A command answers **what operation has been requested?**

A command may internally use a Strategy.

## Command vs Chain of Responsibility

Chain of Responsibility passes a request through a sequence of handlers until responsibility is assumed or the chain is
exhausted.

Command encapsulates the request itself.

A system can combine the two:

```js
chain.handle(command);
```

The chain may determine which handler should execute the command.

The concepts remain separate. Chain of Responsibility distributes responsibility for handling a request; Command turns
the request into an object.

## Command vs Decorator

Decorator wraps an existing component to add responsibilities while preserving its interface.

Command represents an operation as an independently manipulable request.

A command can be decorated:

```js
const command = new LoggingCommand(
    new SaveCommand(service)
);
```

The decorator adds behavior around command execution, while the underlying command still represents the requested
operation.

## Command vs Proxy

Proxy controls access to a target.

Command represents a request.

A proxy can execute commands:

```js
proxy.execute(command);
```

But the proxy and command solve different problems. Proxy controls access to the receiver or service; Command
encapsulates the operation being requested.

## Command vs Adapter

Adapter translates one interface into another compatible interface.

Command does not primarily translate interfaces. It creates an object representation of an operation.

An adapter can be used inside a command when the receiver exposes an incompatible API, but that does not make Command an
Adapter.

## Command vs Facade

Facade provides a simplified interface over a complex subsystem.

A command represents a particular request.

A facade may create commands internally:

```js
class ApplicationFacade {
    publishDocument(documentId) {
        return new PublishDocumentCommand(
            this.publisher,
            documentId
        );
    }
}
```

The facade simplifies subsystem access; the command encapsulates the resulting operation.

## Command vs Mediator

Mediator centralizes communication between multiple collaborating objects.

Command encapsulates a request.

A mediator may receive commands and coordinate multiple components:

```js
mediator.execute(command);
```

In such a design, Command represents the requested operation while Mediator coordinates the participants.

A command should not become a disguised mediator by accumulating responsibility for coordinating an entire object
network unless that coordination is genuinely part of the requested operation.

## Command vs Memento

Memento captures and restores an object's state.

Command represents an operation.

Undo systems frequently combine both patterns. A command can capture a Memento before executing an operation and use
that state to restore the receiver later.

```js
class EditCommand {
    constructor(editor, change) {
        this.editor = editor;
        this.change = change;
        this.previousState = null;
    }

    execute() {
        this.previousState = this.editor.createMemento();
        this.editor.apply(this.change);
    }

    undo() {
        this.editor.restore(this.previousState);
    }
}
```

The command represents the operation; the memento represents state.

## Command vs Event

Commands and events are not interchangeable.

A command represents an intended operation.

An event represents something that has already happened.

For example:

```text
ApproveInvoiceCommand
InvoiceApprovedEvent
```

The command requests approval. The event states that approval occurred.

This distinction matters in event-driven architectures. A command normally has a directed target or handler, while an
event may be observed by multiple subscribers.

## Command vs Query

In systems following Command Query Separation, a command changes state while a query retrieves information without
changing state.

A command such as:

```text
CreateUser
```

requests a state-changing operation.

A query such as:

```text
GetUser
```

retrieves information.

The GoF Command pattern is compatible with this distinction, but Command itself does not require operations to mutate
state. The important point is that commands represent requests, while query objects represent retrieval operations when
such an architectural separation is used.

## UI Actions

User interfaces are a natural environment for Command.

A button can receive a command:

```js
button.setCommand(
    new SaveDocumentCommand(documentService, document)
);
```

The button does not need to know how saving works.

Menus, keyboard shortcuts, toolbar actions, context menus, and accessibility actions can all invoke the same command.

```js
saveButton.execute();
saveMenuItem.execute();
keyboardShortcut.execute();
```

This allows multiple interaction mechanisms to trigger the same application operation without duplicating invocation
logic.

## Workflow Systems

Commands can represent workflow steps.

```js
const workflow = [
    new ValidateOrderCommand(orderService, order),
    new ReserveInventoryCommand(inventoryService, order),
    new CapturePaymentCommand(paymentService, order),
    new CreateShipmentCommand(shippingService, order)
];
```

The workflow engine can execute the commands without embedding the details of each operation.

This makes command-based workflows easier to inspect and manipulate, but it also introduces the need to define failure,
retry, compensation, and persistence semantics.

## Background Jobs

A background job is frequently a command represented as durable data.

```js
{
    "type"
:
    "GenerateReport",
        "version"
:
    2,
        "payload"
:
    {
        "reportId"
    :
        "123"
    }
}
```

A worker can deserialize the request and dispatch it.

The command representation becomes a contract between the producer and consumer.

This makes versioning especially important. A worker may receive commands created by an older version of the
application, so command schemas should be treated as explicit contracts rather than incidental object shapes.

## Distributed Systems

Commands can cross process or service boundaries.

A service may send:

```text
CreatePayment
```

to another service responsible for payment processing.

At this point the Command pattern intersects with messaging architecture.

The command is no longer simply an in-memory object. It becomes a message with concerns such as:

* serialization
* schema versioning
* authentication
* authorization
* delivery guarantees
* duplication
* ordering
* retries
* idempotency
* dead-letter handling
* observability

These are distributed-systems concerns rather than requirements of the original GoF pattern.

## Security Boundaries

A command that crosses a trust boundary must not be treated as inherently trusted.

```js
const command = JSON.parse(message);
```

Parsing the command does not validate it.

A command consumer should validate:

```js
if (command.type !== "CreateUser") {
    throw new Error("Unknown command");
}
```

It should also validate payload structure, authorization, allowed operations, and any security-sensitive values.

Commands should not be allowed to encode arbitrary executable behavior in externally supplied data.

For example, a serialized command should identify an allowed operation rather than contain a function body to evaluate.

## Dependency Injection

Commands frequently receive their receiver or service through dependency injection.

```js
class DeleteUserCommand {
    constructor(userService, userId) {
        this.userService = userService;
        this.userId = userId;
    }

    execute() {
        return this.userService.delete(this.userId);
    }
}
```

This keeps command construction explicit and makes testing straightforward.

A command factory can centralize construction when commands require many dependencies.

```js
class CommandFactory {
    constructor(userService) {
        this.userService = userService;
    }

    createDeleteUser(userId) {
        return new DeleteUserCommand(
            this.userService,
            userId
        );
    }
}
```

Dependency injection should not be used to hide command ownership or create an unnecessarily global command registry.

## Testing Commands

Commands are usually straightforward to unit test because the request representation and execution behavior are
explicit.

```js
class FakeEditor {
    constructor() {
        this.inserted = [];
    }

    insertText(text) {
        this.inserted.push(text);
    }
}

const editor = new FakeEditor();
const command = new InsertTextCommand(editor, "Hello");

command.execute();

console.assert(
    editor.inserted[0] === "Hello"
);
```

A command test should primarily verify that the correct receiver operation is invoked with the correct request data.

Integration tests should verify the actual receiver behavior separately.

## Testing Invokers

Invoker tests should focus on execution policy.

For example, a queue can be tested for ordering:

```js
const calls = [];

const first = {
    execute() {
        calls.push("first");
    }
};

const second = {
    execute() {
        calls.push("second");
    }
};

queue.enqueue(first);
queue.enqueue(second);
queue.process();

console.assert(
    calls.join(",") === "first,second"
);
```

This keeps command semantics separate from queue semantics.

## Immutability

Commands that represent queued or distributed requests benefit from immutable request data.

```js
class CreateUserCommand {
    constructor(data) {
        this.data = Object.freeze({
            ...data
        });

        Object.freeze(this);
    }

    execute(service) {
        return service.create(this.data);
    }
}
```

Immutability reduces the risk that a command changes between creation and execution.

This is especially important when execution is delayed or concurrent.

However, freezing an object does not automatically make nested structures deeply immutable. If deep immutability is
required, the application's data model must provide it explicitly.

## Resource Ownership

Commands should generally avoid owning scarce resources across long waiting periods.

Bad examples include commands that retain:

* open database connections
* file handles
* network sockets
* request streams
* large temporary buffers

A queued command should normally retain the information needed to reacquire those resources when execution begins.

```js
class ExportReportCommand {
    constructor(reportId) {
        this.reportId = reportId;
    }

    async execute(reportService) {
        return reportService.export(this.reportId);
    }
}
```

This is usually safer than retaining an already-open resource for an unknown period.

## Performance

Command objects introduce allocation and indirection.

Instead of:

```js
service.save(document);
```

the system may perform:

```js
const command = new SaveCommand(service, document);
queue.enqueue(command);
```

The additional object and dispatch layer have a cost.

For high-frequency operations where no decoupling, queuing, persistence, undo, or request manipulation is required,
direct invocation is generally preferable.

Command should be introduced because the request needs to become independently manipulable, not because object-oriented
structure is inherently better.

## Common Misuse

A common misuse is creating a Command class for every trivial method call.

```js
class GetNameCommand {
    constructor(user) {
        this.user = user;
    }

    execute() {
        return this.user.getName();
    }
}
```

If the operation is never queued, stored, logged, retried, composed, scheduled, dispatched, undone, or otherwise
manipulated independently, the command may provide no meaningful benefit.

Another misuse is creating commands that merely forward to a method while adding no useful boundary:

```js
class SaveCommand {
    execute() {
        return service.save();
    }
}
```

If there is no independent request lifecycle, direct invocation may be clearer.

## Command Explosion

Large applications can accumulate hundreds of command classes.

This is not automatically a problem. Explicit command types can provide strong architectural boundaries.

The problem appears when commands contain almost no meaningful semantics and exist solely because the architecture
mandates a class for every operation.

JavaScript and TypeScript provide alternatives such as functions, discriminated unions, typed request objects, and
handler registries.

The representation should match the actual complexity of the system.

## Commands as Anemic Data Objects

The opposite problem is turning every command into a data object while placing all meaningful behavior elsewhere without
a clear reason.

For example:

```js
class CreateUserCommand {
    constructor(data) {
        this.data = data;
    }
}
```

followed by a large dispatcher containing every operation:

```js
switch (command.type) {
    // dozens of unrelated operations
}
```

This can produce a centralized procedural dispatch mechanism that becomes difficult to maintain.

A handler-based architecture can improve separation:

```js
handlers.get(command.type).execute(command);
```

The appropriate design depends on the number of commands, deployment boundaries, serialization requirements, and
ownership of business logic.

## Hidden Dependencies

A command that reaches into global state is difficult to reason about.

```js
class SaveCommand {
    execute() {
        globalContainer
            .get("documentService")
            .save(globalDocument);
    }
}
```

Explicit dependencies are preferable:

```js
class SaveCommand {
    constructor(documentService, document) {
        this.documentService = documentService;
        this.document = document;
    }

    execute() {
        return this.documentService.save(this.document);
    }
}
```

Explicit dependencies make ownership, testing, and lifecycle easier to understand.

## Commands and Domain Logic

A command should not automatically become the domain model.

Consider:

```js
class TransferMoneyCommand {
    execute() {
        account.debit(amount);
        destination.credit(amount);
    }
}
```

The command represents the requested transfer, but domain invariants should generally remain enforced by the account or
domain model.

For example:

```js
account.debit(amount);
```

should not rely on every possible caller correctly checking that the account has sufficient funds.

The command orchestrates the operation; the domain model protects its own invariants.

## Commands and Application Services

An application service may execute a command:

```js
class TransferMoneyService {
    execute(command) {
        const source = this.accounts.get(command.sourceId);
        const destination = this.accounts.get(command.destinationId);

        source.debit(command.amount);
        destination.credit(command.amount);
    }
}
```

This can be a useful architecture when commands represent application-level requests and services coordinate domain
objects.

The command does not need to contain every step of the operation. Its primary role is to represent the request.

## Refactoring Toward Command

Command is a useful refactoring when the same operation needs to move through infrastructure that expects a generic
executable request.

A direct invocation:

```js
service.generateReport(reportId);
```

can become:

```js
const command = new GenerateReportCommand(
    service,
    reportId
);

queue.enqueue(command);
```

The important architectural change is not the new class. It is the ability to separate request creation from execution.

A strong signal for the refactoring is when the application begins duplicating conditional logic around when, where, or
how an operation executes.

## Recognizing a Command Opportunity

Command is appropriate when one or more of the following requirements exist:

* requests must be queued
* requests must execute later
* requests must be retried
* requests must be logged
* requests must be audited
* requests must be persisted
* requests must be serialized
* requests must support undo
* requests must be composed
* multiple invokers must trigger the same operation
* callers should not depend directly on receivers
* a generic execution infrastructure is required
* operations need identity or correlation
* execution needs to be scheduled independently of request creation

The strongest signal is that the request itself has acquired a lifecycle independent of the code that created it.

## Architectural Considerations

Command introduces an explicit request boundary.

This can reduce coupling between UI, application services, queues, schedulers, workflows, and domain operations.

It also creates additional types, dispatching infrastructure, lifecycle semantics, and potentially serialization
contracts.

At an architectural level, Command is therefore useful when **operations themselves need to participate in the
architecture as first-class messages or objects**.

It is less useful when an operation is local, immediate, simple, and has no independent lifecycle.

## Benefits

Command provides several important benefits:

* decouples requesters from receivers
* turns operations into first-class objects or values
* supports deferred execution
* supports queues and schedulers
* enables command history
* can support undo and redo
* enables logging and auditing
* enables generic invokers
* supports command composition
* provides a natural boundary for retries and idempotency
* can support serialization and distributed messaging
* allows multiple clients to invoke the same operation
* can provide stable application-level operation contracts

## Costs

Command also introduces costs:

* additional objects or functions
* additional indirection
* more types and abstractions
* command lifecycle complexity
* potential command proliferation
* serialization and versioning concerns for durable commands
* retry and idempotency concerns
* additional infrastructure such as buses or queues
* possible duplication between commands and handlers
* more complex failure semantics for composed commands

These costs are justified when requests genuinely need to become independently manipulable.

## Decision Criteria

Use Command when the important requirement is to represent a request independently from its immediate execution.

Do not introduce Command merely because an operation exists or because a codebase benefits from generic abstractions.

The key question is:

**Does this request need to become an independently manipulable value with its own execution lifecycle?**

If the answer is yes, Command may provide a strong fit.

If the answer is no and the operation is simply a direct method invocation, the additional command layer is likely
unnecessary.

## Summary

Command encapsulates a request as an object or equivalent first-class value, separating the code that requests an
operation from the code that performs it.

The command represents the requested operation and its required data. The receiver performs the actual work. The invoker
controls when and how the command executes. The client assembles these relationships.

The pattern becomes particularly valuable when requests must be queued, delayed, retried, logged, audited, composed,
persisted, serialized, dispatched, or undone.

JavaScript does not require a class-based implementation. Functions, closures, plain objects, discriminated unions, and
handler-based architectures can all express the same underlying concept.

The defining idea remains unchanged: **the request itself becomes independently representable and manipulable rather
than existing only as an immediate method call.**

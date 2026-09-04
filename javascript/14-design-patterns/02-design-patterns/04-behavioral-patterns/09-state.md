# State

The State pattern allows an object to alter its behavior when its internal state changes, so that the object appears to
change its class. Instead of concentrating state-dependent behavior into a large collection of conditional statements,
the behavior associated with each state is represented explicitly and can be changed as the object's state changes.

State is fundamentally about **behavior that varies according to an object's current state**. The object remains the
same conceptual entity, but the rules governing its operations change as its state changes.

## Intent

State encapsulates state-specific behavior and state transitions so that an object can change its behavior without
accumulating increasingly complex conditional logic.

The pattern is useful when:

* An object has several meaningful states.
* Its behavior depends substantially on its current state.
* The same operations behave differently in different states.
* State transitions follow explicit rules.
* State-dependent logic is becoming difficult to maintain.
* Adding a new state would otherwise require modifying many conditional branches.

The central idea is:

**Represent each meaningful behavioral state explicitly and delegate state-dependent operations to the representation of
the current state.**

## Problem

Consider a connection that can be disconnected, connecting, connected, or closing.

A straightforward implementation might use a state field:

```js
class Connection {
    constructor() {
        this.state = "disconnected";
    }

    open() {
        if (this.state === "disconnected") {
            this.state = "connecting";
            this.startConnection();
            return;
        }

        if (this.state === "connecting") {
            return;
        }

        if (this.state === "connected") {
            throw new Error("Connection is already open");
        }

        if (this.state === "closing") {
            throw new Error("Connection is closing");
        }
    }

    close() {
        if (this.state === "connected") {
            this.state = "closing";
            this.stopConnection();
            return;
        }

        if (this.state === "disconnected") {
            return;
        }

        if (this.state === "connecting") {
            throw new Error("Cannot close while connecting");
        }

        if (this.state === "closing") {
            return;
        }
    }
}
```

The problem is not the existence of a state field or conditional statement by itself. The problem appears when
state-dependent behavior spreads across many operations.

With additional operations such as `send`, `receive`, `pause`, `resume`, `retry`, and `reconnect`, each operation may
accumulate its own collection of state checks.

The result is duplicated state knowledge, increasingly difficult transition logic, and a growing number of combinations
that must be considered whenever a state changes.

State moves those behavioral rules into explicit state objects.

## Structure

The traditional State pattern has several conceptual participants.

### Context

The **Context** is the object whose behavior changes according to its current state.

It maintains a reference to the current state and delegates state-dependent operations to it.

```js
class Connection {
    #state;

    constructor() {
        this.#state = new DisconnectedState();
    }

    setState(state) {
        this.#state = state;
    }

    open() {
        this.#state.open(this);
    }

    close() {
        this.#state.close(this);
    }

    send(data) {
        this.#state.send(this, data);
    }
}
```

The context generally owns the identity and long-lived data of the object.

### State

The **State** defines the behavior associated with a particular state.

```js
class ConnectionState {
    open(context) {
        throw new Error("Unsupported operation");
    }

    close(context) {
        throw new Error("Unsupported operation");
    }

    send(context, data) {
        throw new Error("Unsupported operation");
    }
}
```

### Concrete States

Each **Concrete State** represents one state and implements the behavior appropriate to that state.

```js
class DisconnectedState extends ConnectionState {
    open(context) {
        context.setState(new ConnectingState());
    }

    close() {
        // Already closed.
    }

    send() {
        throw new Error("Connection is not open");
    }
}
```

Another state can provide completely different behavior:

```js
class ConnectedState extends ConnectionState {
    open() {
        // Already open.
    }

    close(context) {
        context.setState(new DisconnectedState());
    }

    send(context, data) {
        context.write(data);
    }
}
```

The context does not need a separate conditional branch for every operation and state combination.

## Context and State Ownership

The division of responsibility between the Context and State objects is one of the most important design decisions.

The Context should generally own identity, resources, and data that persist across state transitions.

The State should generally own behavior that is specific to the current state.

For example, a connection object may own:

* Socket resources.
* Connection configuration.
* Authentication information.
* Connection identity.
* Metrics.
* Public API.

The state objects may own:

* Whether `send()` is allowed.
* What `close()` means.
* What happens when `open()` is called.
* Which transition occurs after an operation.

This separation prevents state objects from becoming alternative representations of the entire Context.

## State Transitions

State transitions are central to the pattern.

A transition can be performed by the Context:

```js
class Connection {
    #state;

    transitionTo(state) {
        this.#state = state;
    }
}
```

A state can request the transition:

```js
class DisconnectedState {
    open(context) {
        context.transitionTo(new ConnectingState());
    }
}
```

Or transition logic can be centralized:

```js
class Connection {
    #state = "disconnected";

    transitionTo(state) {
        this.#state = state;
    }
}
```

There is no universally correct transition ownership model.

The important requirement is that transitions remain explicit and consistent with the domain's state machine.

## State Machine Semantics

A State implementation often corresponds naturally to a finite state machine.

A state machine consists conceptually of:

* A set of states.
* A set of events or operations.
* Transition rules.
* State-dependent outputs or actions.

For example, an order might have states such as:

```text
draft
submitted
approved
rejected
cancelled
```

The important architectural distinction is that State does not merely store one of these labels. The pattern becomes
useful when those states change the behavior of the object.

A string property such as:

```js
order.status = "approved";
```

does not itself constitute the State pattern.

## State Versus State Data

A state field is often sufficient.

```js
class Order {
    constructor() {
        this.status = "draft";
    }
}
```

There is no reason to introduce State objects simply because an object has multiple possible values.

State becomes useful when those values produce substantial behavioral variation.

For example:

```js
if (order.status === "draft") {
    // ...
}

if (order.status === "submitted") {
    // ...
}

if (order.status === "approved") {
    // ...
}
```

If this logic remains small and localized, a simple state field may be clearer.

If the same state distinctions appear throughout many operations, explicit State objects can provide a better structure.

## Conditional State Logic

State is often introduced by refactoring repeated conditionals.

Before:

```js
class Document {
    save() {
        if (this.status === "draft") {
            // draft behavior
        } else if (this.status === "review") {
            // review behavior
        } else if (this.status === "published") {
            // published behavior
        }
    }

    edit() {
        if (this.status === "draft") {
            // draft behavior
        } else if (this.status === "review") {
            // review behavior
        } else if (this.status === "published") {
            // published behavior
        }
    }

    delete() {
        if (this.status === "draft") {
            // draft behavior
        } else if (this.status === "review") {
            // review behavior
        } else if (this.status === "published") {
            // published behavior
        }
    }
}
```

The same state knowledge has been duplicated across multiple operations.

The State pattern groups those rules by state instead.

## State Objects

A direct JavaScript implementation can use objects rather than classes:

```js
const draftState = {
    save(document) {
        document.persist();
    },

    edit() {
        // Drafts can be edited.
    },

    publish(document) {
        document.setState(publishedState);
    }
};

const publishedState = {
    save(document) {
        document.persist();
    },

    edit() {
        throw new Error("Published documents cannot be edited");
    },

    publish() {
        throw new Error("Document is already published");
    }
};
```

The Context can delegate to the current object:

```js
class Document {
    #state = draftState;

    setState(state) {
        this.#state = state;
    }

    save() {
        this.#state.save(this);
    }

    edit() {
        this.#state.edit(this);
    }

    publish() {
        this.#state.publish(this);
    }
}
```

JavaScript's object model makes this representation particularly natural.

## State Objects as Singletons

State objects that contain no mutable per-instance data can often be shared:

```js
const draftState = {
    save(document) {
        document.persist();
    }
};
```

Multiple Context instances can use the same state object.

This avoids allocating a new state object for every transition.

However, shared states must remain stateless or otherwise carefully isolated. Per-context mutable state should not be
stored on a shared State object.

## State Objects with Data

A state object may require state-specific data.

```js
class RetryState {
    constructor(attempts) {
        this.attempts = attempts;
    }

    retry(context) {
        if (this.attempts >= 3) {
            context.transitionTo(new FailedState());
            return;
        }

        context.transitionTo(new ConnectingState());
    }
}
```

This is appropriate when the data genuinely belongs to the state representation.

It should not be used merely to move arbitrary Context state into State objects.

## Context Data Versus State Data

A useful distinction is whether data survives a transition.

If the value belongs to the identity or long-lived lifecycle of the Context, it generally belongs on the Context.

If the value exists only because the Context is currently in a particular state, it may belong to the State.

For example, a network connection's endpoint belongs naturally to the Context. A retry counter specific to the current
reconnecting state may belong to the state representation.

The boundary should follow domain ownership rather than an arbitrary rule.

## State Transitions and Invariants

State transitions should preserve domain invariants.

For example, an order should not transition directly from `cancelled` to `approved` merely because both are represented
as valid state objects.

A state transition should therefore enforce the allowed transition rules:

```js
class CancelledState {
    approve() {
        throw new Error("Cancelled orders cannot be approved");
    }
}
```

For more complex state machines, centralizing transition validation may be preferable to allowing every State object to
independently implement transition rules.

## Centralized Versus Distributed Transitions

State transitions can be distributed among state objects:

```js
class DraftState {
    submit(context) {
        context.setState(new SubmittedState());
    }
}
```

This makes each state responsible for knowing its valid transitions.

Alternatively, the Context can centralize transitions:

```js
class Order {
    transition(event) {
        const nextState = transitionTable[this.#state][event];

        if (!nextState) {
            throw new Error("Invalid transition");
        }

        this.#state = nextState;
    }
}
```

Distributed transitions are often easier to understand when each state has distinct transition behavior.

Centralized transition tables can be preferable when the state machine itself is the primary domain concern and the
transition matrix is large or needs formal inspection.

The State pattern does not require transitions to be distributed.

## State Transition Tables

For relatively simple state machines, a transition table can be clearer than a collection of classes:

```js
const transitions = {
    draft: {
        submit: "submitted",
        cancel: "cancelled"
    },

    submitted: {
        approve: "approved",
        reject: "rejected",
        cancel: "cancelled"
    },

    approved: {
        cancel: "cancelled"
    }
};
```

This can be combined with a state field:

```js
function transition(order, event) {
    const nextState = transitions[order.status]?.[event];

    if (!nextState) {
        throw new Error(
            `Cannot apply ${event} while in ${order.status}`
        );
    }

    order.status = nextState;
}
```

This is often preferable when the variation is primarily **transition data** rather than complex **state-specific
behavior**.

State objects become more valuable when each state contains substantial behavioral rules.

## State and Polymorphism

The State pattern replaces explicit state-based branching with polymorphic behavior.

Instead of asking:

```js
if (this.state === "connected") {
    // ...
}
```

the Context asks the current state to perform the operation:

```js
this.#state.send(this, data);
```

The State object determines the appropriate behavior.

This is an application of polymorphism rather than a requirement to eliminate every conditional statement.

Conditional logic remains appropriate when the state distinction is simple and local.

## State and JavaScript Classes

JavaScript classes can implement State explicitly:

```js
class ConnectedState {
    send(context, data) {
        context.socket.send(data);
    }

    close(context) {
        context.socket.close();
        context.setState(new DisconnectedState());
    }
}
```

The Context maintains the current State:

```js
class Connection {
    #state = new DisconnectedState();

    setState(state) {
        this.#state = state;
    }

    send(data) {
        this.#state.send(this, data);
    }

    close() {
        this.#state.close(this);
    }
}
```

This representation is useful when states have substantial logic, dependencies, or lifecycle behavior.

## State and Functions

JavaScript also permits a functional representation:

```js
const disconnected = {
    send() {
        throw new Error("Not connected");
    },

    open(context) {
        context.state = connecting;
    }
};

const connected = {
    send(context, data) {
        context.socket.send(data);
    },

    close(context) {
        context.socket.close();
        context.state = disconnected;
    }
};
```

State does not depend on inheritance.

The essential property is behavioral delegation based on the current state.

## State and Closures

State can also be represented using closures:

```js
function createConnectedState() {
    return {
        send(data) {
            socket.send(data);
        },

        close() {
            socket.close();
            return createDisconnectedState();
        }
    };
}
```

Closures can encapsulate state-specific implementation details without exposing them as class properties.

This can be particularly effective when state is local to a module or factory-created object.

## State and TypeScript

TypeScript can define a common state interface:

```ts
interface ConnectionState {
    open(context: Connection): void;

    close(context: Connection): void;

    send(context: Connection, data: string): void;
}
```

Concrete states implement the contract:

```ts
class ConnectedState implements ConnectionState {
    open(): void {
        // Already connected.
    }

    close(context: Connection): void {
        context.setState(new DisconnectedState());
    }

    send(context: Connection, data: string): void {
        context.write(data);
    }
}
```

The Context can depend on the abstraction:

```ts
class Connection {
    #state: ConnectionState;

    constructor(state: ConnectionState) {
        this.#state = state;
    }

    setState(state: ConnectionState): void {
        this.#state = state;
    }

    send(data: string): void {
        this.#state.send(this, data);
    }
}
```

The interface documents the operations whose behavior varies by state.

## State-Specific Unsupported Operations

Not every operation must have meaningful behavior in every state.

A State implementation can reject an operation:

```js
class DisconnectedState {
    send() {
        throw new Error("Cannot send while disconnected");
    }
}
```

It can also treat an operation as a no-op:

```js
class DisconnectedState {
    close() {
        // Already disconnected.
    }
}
```

The correct behavior depends on the domain contract.

Silently ignoring an operation is appropriate only when the operation is legitimately idempotent or irrelevant in that
state. Otherwise, rejecting the operation makes invalid use visible.

## State and Lifecycle

Some state machines represent lifecycle stages:

```text
created
initialized
running
stopped
```

State is useful when operations have materially different meanings at each stage.

For example:

```js
class StoppedState {
    start(context) {
        context.initializeResources();
        context.setState(new RunningState());
    }

    stop() {
        // Already stopped.
    }
}
```

Lifecycle state should not be introduced merely to rename ordinary object initialization. The value comes from the
behavior associated with the lifecycle stage.

## State and Resources

State transitions often involve acquiring or releasing resources.

For example, a connection may acquire a socket when entering `connected` and release it when leaving that state.

This introduces an important ownership question: which component owns the resource and which component performs the
transition-related operation?

A safe design should ensure that resource ownership remains explicit and that transitions cannot leave the Context in a
partially transitioned state.

## Enter and Exit Behavior

State objects can define lifecycle hooks:

```js
class State {
    enter(context) {
    }

    exit(context) {
    }
}
```

The Context can perform the transition:

```js
setState(nextState)
{
    this.#state.exit(this);
    this.#state = nextState;
    this.#state.enter(this);
}
```

This can be useful when entering or leaving a state has meaningful behavior.

However, lifecycle hooks increase complexity. They should not be introduced merely because every state happens to have
an empty `enter()` and `exit()` method.

## State and Asynchronous Transitions

State transitions may involve asynchronous operations.

```js
class ConnectingState {
    async open(context) {
        try {
            await context.connect();
            context.setState(new ConnectedState());
        } catch {
            context.setState(new DisconnectedState());
        }
    }
}
```

This introduces race conditions if multiple operations can occur concurrently.

For example, a connection may begin connecting and then receive a close request before the connection attempt completes.

The implementation must determine whether:

* Operations are serialized.
* Transitions invalidate previous operations.
* Cancellation is supported.
* Late asynchronous results are ignored.
* State transitions use versioning or operation tokens.

State machines with asynchronous transitions therefore need explicit concurrency semantics.

## State and Concurrency

A state transition is often assumed to be atomic:

```js
context.setState(new ConnectedState());
```

In asynchronous systems, the logical transition may span multiple operations.

The Context should avoid situations where an asynchronous operation completes after the Context has already transitioned
to another state and incorrectly mutates the state machine.

A common solution is to associate asynchronous work with the state or transition that initiated it and validate that it
is still current before applying the result.

## State and Immutability

State objects can be immutable:

```js
class AuthenticatedState {
    constructor(userId) {
        this.userId = userId;
        Object.freeze(this);
    }
}
```

Immutable states make transitions easier to reason about because changing state creates a new representation rather than
mutating the existing one.

This is especially useful when state objects contain state-specific data.

## State and Identity

The Context's identity should generally remain stable while its State changes.

```js
const connection = new Connection();

connection.open();
connection.send("hello");
connection.close();
```

The same `connection` remains the conceptual object throughout the lifecycle.

The State object represents the current behavioral mode rather than replacing the identity of the Context.

This distinction is important when external consumers hold references to the Context.

## State Versus Strategy

State and Strategy both use composition and polymorphism, and their implementations can look nearly identical.

The distinction is in **why the behavior varies**.

Strategy represents an interchangeable algorithm or policy selected because the application wants one of several
alternatives:

```js
calculator.setStrategy(new TaxStrategy());
```

State represents behavior that changes because the Context itself has entered a different state:

```js
connection.setState(new ConnectedState());
```

Strategy selection is generally an algorithm-selection concern.

State transition is generally an object-lifecycle or state-machine concern.

A Strategy does not normally own the lifecycle of the Context. A State often participates directly in determining or
enforcing the Context's next state.

## State Versus Conditional Logic

State does not automatically replace `if`, `else if`, `switch`, or conditional expressions.

A small state machine can often be clearer as ordinary conditional logic:

```js
function canEdit(status) {
    return status === "draft" || status === "review";
}
```

Introducing a hierarchy of State objects for this single predicate would add unnecessary abstraction.

State becomes justified when behavioral variation is broad, repeated, evolving, or difficult to keep coherent in
conditional branches.

## State Versus State Pattern in General

Not every state machine requires the GoF State pattern.

A system may represent its state with:

* Strings.
* Enums.
* Symbols.
* Numeric values.
* Tagged unions.
* Discriminated unions.
* Transition tables.
* Reducers.
* State-machine libraries.
* Explicit State objects.

The GoF State pattern specifically emphasizes encapsulating state-dependent behavior so the Context delegates behavior
to the current state.

The broader concept of a state machine is therefore larger than the State design pattern.

## State Versus Observer

Observer notifies consumers that a state or event has changed.

State changes the behavior of the object whose state changed.

The two patterns can work together:

```js
context.setState(new ConnectedState());
context.notifyObservers();
```

The State pattern owns behavioral variation.

Observer owns notification to external dependents.

They should not be merged merely because state transitions produce events.

## State Versus Command

Command encapsulates an operation.

State determines how an operation behaves under the current state.

The same command can therefore produce different results depending on the Context's current State.

```js
command.execute(context);
```

The Context's State may determine whether that command is accepted, rejected, or interpreted differently.

## State Versus Template Method

Template Method defines a fixed algorithm structure in a base class while allowing subclasses to override selected
steps.

State does not primarily define an algorithm skeleton. It changes the behavior of a Context according to its current
state.

Template Method variation is usually organized by inheritance.

State variation is usually organized by composition and runtime state replacement.

## State Versus Bridge

Bridge separates two dimensions of variation so they can evolve independently.

State represents behavioral variation associated with the current state of one Context.

A system can use both. For example, a connection Context could use State to represent lifecycle behavior while using a
Bridge to separate connection abstraction from transport implementation.

They solve different dimensions of change.

## State and Finite State Machines

State is particularly useful when the domain can be expressed naturally as a finite state machine.

For example, a payment might have:

```js
const states = [
    "pending",
    "authorized",
    "captured",
    "failed",
    "refunded"
];
```

The important part is not the list itself. The state machine defines which transitions and operations are valid from
each state.

A formal state-machine model can make invalid transitions explicit and testable.

When the state graph becomes complex enough to require transition guards, hierarchical states, parallel states, history,
or event queues, a dedicated state-machine abstraction may be more appropriate than hand-built State classes.

## State Guards

A transition may depend on additional conditions:

```js
class SubmittedState {
    approve(context) {
        if (!context.hasRequiredApproval()) {
            throw new Error("Approval requirements not satisfied");
        }

        context.setState(new ApprovedState());
    }
}
```

Such conditions are often called guards.

Guards should remain close to the transition or domain rule they protect.

Moving every condition into a generic state engine can make business rules harder to understand.

## State History

Some systems need to remember previous states.

A Context can maintain history:

```js
class Workflow {
    #state;
    #history = [];

    setState(nextState) {
        this.#history.push(this.#state);
        this.#state = nextState;
    }
}
```

However, state history is not inherent to the State pattern.

If the requirement is to restore previous object state, Memento may be more appropriate.

If the requirement is to record an authoritative sequence of domain events, Event Sourcing is a different architectural
concern.

## State and Persistence

Persisting state usually means storing enough information to reconstruct the current behavioral state.

A state object itself does not necessarily need to be serialized.

For example:

```js
{
    status: "approved"
}
```

may be sufficient to reconstruct:

```js
new ApprovedState()
```

If a state contains additional data:

```js
{
    status: "retrying",
        attempt
:
    2
}
```

that data may also need to be persisted.

Persistence should therefore generally represent stable domain state rather than serialize implementation-specific State
object instances.

## State and Serialization

Do not assume that serializing a State instance is a reliable persistence mechanism.

```js
JSON.stringify(new ApprovedState());
```

does not capture the semantics of the class, prototype, behavior, dependencies, or future implementation changes.

Persist a stable representation and reconstruct the State object when loading.

## State and Dependency Injection

State objects may require dependencies:

```js
class ConnectedState {
    constructor(logger) {
        this.logger = logger;
    }

    send(context, data) {
        this.logger.info("Sending data");
        context.write(data);
    }
}
```

The composition layer can provide these dependencies:

```js
const connectedState = new ConnectedState(logger);
```

If every state requires the same large collection of dependencies, the Context may be carrying a broad dependency graph
into every State.

This can indicate that responsibilities are poorly separated.

## State and Factories

Factories can simplify state construction:

```js
class StateFactory {
    create(status) {
        switch (status) {
            case "draft":
                return new DraftState();

            case "submitted":
                return new SubmittedState();

            case "approved":
                return new ApprovedState();

            default:
                throw new Error(`Unknown status: ${status}`);
        }
    }
}
```

A factory is especially useful when State construction requires dependencies, configuration, or initialization.

The factory does not replace the State pattern. It handles construction of State representations.

## State and Dependency Direction

The Context should generally depend on the State abstraction rather than concrete states for ordinary delegation.

```js
class Context {
    #state;

    constructor(state) {
        this.#state = state;
    }

    operation() {
        this.#state.operation(this);
    }
}
```

Concrete State implementations may depend on the Context's stable public operations.

Care should be taken to avoid circular dependencies in module structure. In JavaScript modules, this can become
particularly important when Context and multiple State implementations import each other.

## State and Module Organization

For a small state machine, states can remain in one module.

For larger systems, states can be separated:

```text
connection/
  connection.js
  states/
    disconnected.js
    connecting.js
    connected.js
```

The organizational decision should follow complexity rather than pattern terminology.

A state hierarchy with only trivial methods may be harder to navigate than a single module containing a simple
transition table.

## Testing

State-based systems should test both behavior and transitions.

Important cases include:

* Each operation behaves correctly in each state.
* Valid transitions produce the expected next state.
* Invalid transitions are rejected correctly.
* State-specific invariants are enforced.
* State transitions preserve Context identity.
* State-specific data is preserved or discarded appropriately.
* Asynchronous transitions cannot apply stale results.
* Enter and exit hooks execute according to their contract.
* Resource acquisition and release occur at the correct boundaries.
* Persistence reconstructs the correct behavioral state.

Tests should focus on externally observable behavior rather than merely verifying that a particular State class was
instantiated.

## Performance

State delegation introduces an additional object or function call for state-dependent operations.

In most business applications, this overhead is negligible compared with the benefits of separating complex behavior.

Performance may matter when State is used in extremely high-frequency paths, such as parsers, protocol engines,
simulations, or game loops.

Possible optimizations include:

* Sharing stateless State objects.
* Using immutable singleton states.
* Using transition tables for simple machines.
* Avoiding unnecessary state allocation.
* Keeping state-specific data compact.
* Combining state and data representations where profiling demonstrates a real bottleneck.

The design should be driven by measured performance rather than theoretical dispatch costs.

## Common Misuse

### Creating State Objects for Every Enum

A few state values do not justify the State pattern.

If behavior remains simple:

```js
if (status === "active") {
    return true;
}
```

a State hierarchy may add more complexity than it removes.

### Replacing Every Conditional with Polymorphism

Conditional logic is not inherently bad.

A local conditional can be clearer than introducing several classes and an abstraction solely to avoid `if` or `switch`.

State is justified by substantial behavioral variation, not by a blanket rule against conditionals.

### Putting All Context Data in State Objects

State objects should not become alternate Context implementations containing arbitrary copies of the Context's data.

The Context should retain ownership of data that represents the enduring identity of the object.

### Allowing States to Mutate Everything

If every State can arbitrarily modify every Context property, invariants become difficult to maintain.

The Context should expose a controlled set of operations for state-specific behavior.

### Creating an Unbounded State Hierarchy

A state object should represent a meaningful behavioral distinction.

Creating separate classes for tiny variations that could be represented as data can make the design unnecessarily
fragmented.

### Hiding Transitions

If state transitions happen indirectly through unrelated observers, callbacks, timers, and side effects, the resulting
state machine becomes difficult to reason about.

Transitions should be explicit enough that the allowed lifecycle can be understood and tested.

### Ignoring Invalid Transitions

A state machine is defined as much by its invalid transitions as its valid ones.

Silently allowing operations that have no valid meaning can produce corrupted domain state.

### Confusing State with Strategy

Two classes with identical method signatures do not automatically represent either pattern.

If the alternative implementation is selected because the application wants a different algorithm, Strategy is more
appropriate.

If the alternative implementation exists because the Context has entered a different lifecycle or behavioral state,
State is more appropriate.

## Refactoring Toward State

A typical refactoring begins with repeated state checks:

```js
class Player {
    play() {
        if (this.status === "stopped") {
            // ...
        } else if (this.status === "playing") {
            // ...
        } else if (this.status === "paused") {
            // ...
        }
    }

    pause() {
        if (this.status === "stopped") {
            // ...
        } else if (this.status === "playing") {
            // ...
        } else if (this.status === "paused") {
            // ...
        }
    }

    stop() {
        if (this.status === "stopped") {
            // ...
        } else if (this.status === "playing") {
            // ...
        } else if (this.status === "paused") {
            // ...
        }
    }
}
```

The first step is to identify the actual state-dependent behavior rather than mechanically extracting every branch.

The next step is to define a stable State contract:

```js
class PlayerState {
    play(context) {
    }

    pause(context) {
    }

    stop(context) {
    }
}
```

Concrete states then take ownership of their behavior:

```js
class PlayingState extends PlayerState {
    play() {
        // Already playing.
    }

    pause(context) {
        context.setState(new PausedState());
    }

    stop(context) {
        context.setState(new StoppedState());
    }
}
```

The Context becomes responsible for delegation:

```js
class Player {
    #state = new StoppedState();

    setState(state) {
        this.#state = state;
    }

    play() {
        this.#state.play(this);
    }

    pause() {
        this.#state.pause(this);
    }

    stop() {
        this.#state.stop(this);
    }
}
```

The refactoring is complete when state-specific behavior has a coherent home and the Context no longer contains
duplicated branching for the same state distinctions.

## Architectural Considerations

State is primarily an object-design pattern, but it becomes architecturally significant when lifecycle state determines
which operations are available across an application boundary.

Examples include:

* Connection lifecycle.
* Order lifecycle.
* Workflow stages.
* Authentication lifecycle.
* Resource lifecycle.
* Job execution.
* Protocol states.
* Session states.

At architectural boundaries, state transitions should generally correspond to meaningful domain or protocol semantics
rather than implementation details.

A service should not expose dozens of internal states merely because its implementation happens to have them.

## State and API Design

Public APIs should expose meaningful state-dependent behavior without unnecessarily exposing State implementation
classes.

A consumer may need:

```js
connection.open();
connection.send(data);
connection.close();
```

but not:

```js
connection.setState(new ConnectedState());
```

If external consumers can arbitrarily replace the Context's State, they can bypass transition rules and invariants.

State transitions should generally be controlled by the Context or by a dedicated domain mechanism.

## State and Encapsulation

The State abstraction should expose only the operations required for state-dependent behavior.

A broad State interface such as:

```js
class State {
    everything(context) {
    }
}
```

is a sign that the Context's responsibilities have not been properly separated.

A narrow interface makes state-specific behavior easier to understand and test.

## State Explosion

Complex domains can produce many states.

For example, a workflow might have:

```text
draft
submitted
underReview
approved
rejected
scheduled
processing
completed
failed
cancelled
```

If every state has unique behavior and transition rules, explicit State objects may be justified.

If many states differ only by data, however, a data-driven state machine may be more appropriate.

State explosion is therefore often a signal to examine whether the model contains:

* Genuine behavioral states.
* State-specific data that should remain data.
* Independent dimensions of state that should not be encoded as a Cartesian product.
* Hierarchical states.
* Separate sub-state machines.

## Multiple State Dimensions

An object can have several independent dimensions:

```js
{
    connection: "connected",
        authentication
:
    "authenticated",
        availability
:
    "online"
}
```

Combining every dimension into one State class can produce a combinatorial explosion.

If three independent dimensions each have several possible values, the number of combined states can become large even
though the dimensions themselves are simple.

In such cases, separate state machines, policies, or state fields may be more appropriate than one monolithic State
hierarchy.

## State and Hierarchical State Machines

Some domains contain nested states.

For example, a system may be:

```text
connected
```

while simultaneously being in:

```text
authenticated
```

and:

```text
idle
```

A simple flat State pattern can struggle with these combinations.

Hierarchical or orthogonal state-machine models can represent such systems more naturally.

This is an important boundary: the GoF State pattern is a useful object-design technique, but it is not a complete
formal state-machine framework.

## State and Distributed Systems

Distributed systems often expose states such as:

* Pending.
* Processing.
* Completed.
* Failed.
* Retrying.

These states may not be under the control of one object or one process.

A local State object can still represent the behavior of a service or aggregate based on its current known state, but
distributed state introduces additional concerns:

* Eventual consistency.
* Duplicate messages.
* Out-of-order events.
* Retries.
* Idempotency.
* Concurrent transitions.
* Stale state.
* Version conflicts.

A local State implementation should not be mistaken for a distributed state-management solution.

## State and Observability

State transitions are often useful observability boundaries:

```js
transition(from, to);
```

Logging or metrics can record transitions without embedding observability logic into every State operation.

Observer can also be used to notify external consumers of transitions.

The two concerns should remain separate: State determines behavior and transitions; Observer distributes information
about those transitions.

## Benefits

State provides several benefits:

* Encapsulates state-dependent behavior.
* Reduces repeated conditional logic.
* Makes behavioral states explicit.
* Localizes state-specific rules.
* Makes transitions easier to identify and test.
* Allows states to evolve independently.
* Supports runtime behavioral changes.
* Preserves Context identity while behavior changes.
* Can improve cohesion by grouping behavior according to state.

## Costs

State also introduces costs:

* More objects or modules.
* Additional abstraction.
* More indirection between the Context and behavior.
* Potential state-class proliferation.
* More complicated transition ownership.
* Increased lifecycle complexity.
* Possible difficulty understanding behavior across several State classes.
* Additional design work for asynchronous transitions and concurrency.

State should therefore be introduced when state-dependent complexity justifies the separation.

## Decision Criteria

Use State when:

* An object's behavior changes substantially according to its current state.
* The same state distinctions appear across multiple operations.
* State-specific rules are growing or evolving independently.
* Valid transitions are an important part of the domain.
* Conditional state logic is becoming difficult to maintain.
* The Context should retain a stable identity while its behavior changes.

Prefer simple state data when state-specific behavior is small and localized.

Prefer a transition table when the primary complexity is the transition graph rather than state-specific behavior.

Prefer Strategy when the variation represents interchangeable algorithms or policies rather than lifecycle state.

Prefer Observer when consumers need to be notified about state changes.

Prefer Memento when the requirement is to capture and restore previous state.

Prefer a dedicated state-machine abstraction when the domain requires advanced state-machine semantics such as
hierarchical states, parallel states, history, formal transition guards, or complex event processing.

## Summary

The State pattern encapsulates behavior associated with an object's current state and allows that behavior to change as
the object's state changes. The Context maintains a stable identity while delegating state-dependent operations to the
current State representation.

The pattern is particularly effective when state-dependent behavior is repeated across many operations and a growing
collection of conditional branches is becoming difficult to maintain. It is not justified merely because an object has a
`status` property or because a codebase contains an `if`, `else if`, or `switch`.

JavaScript supports State naturally through classes, objects, functions, closures, and state-machine data structures.
The implementation mechanism is secondary to the underlying responsibility: **behavior varies because the Context is in
a different state**.

State should be distinguished carefully from Strategy, Observer, Command, Memento, Bridge, and generic state-machine
implementations. Strategy selects interchangeable algorithms; Observer distributes notifications; Command encapsulates
operations; Memento preserves state for restoration; Bridge separates independent dimensions of implementation; State
encapsulates behavior according to the Context's current lifecycle or behavioral state.

The strongest State implementations make state-specific behavior, valid transitions, invalid operations, ownership, and
lifecycle semantics explicit without turning every state value into a class or every conditional into a polymorphic
hierarchy.

# Observer

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all
dependent objects are notified automatically. The object whose state is observed is the **Subject**, while each
dependent object is an **Observer**. The pattern separates the producer of a change from the consumers that react to it,
allowing observers to be added, removed, or changed without modifying the subject's core behavior.

Observer is fundamentally a **notification relationship**. The subject owns some state or produces some meaningful
change, and observers express interest in those changes. When the relevant event occurs, the subject delivers a
notification according to an established contract.

## Intent

Observer is used when multiple independent consumers need to react to changes produced by another object without the
producer having compile-time or structural knowledge of every consumer.

The pattern addresses several related problems:

* Multiple objects need to react to the same state change.
* The set of consumers can change at runtime.
* The producer should not depend directly on concrete consumers.
* Consumers should be independently replaceable.
* A producer should not need to know the internal behavior of its consumers.
* Notification should be decoupled from the implementation of the reaction.

The essential relationship is therefore:

**One subject produces a change; multiple observers independently receive notification of that change.**

## Problem

Consider an object representing application state:

```js
class Account {
    constructor() {
        this.balance = 0;
    }

    deposit(amount) {
        this.balance += amount;
    }
}
```

Suppose several parts of the application need to react whenever the balance changes. A UI component might update its
display, an audit component might record the change, and a metrics component might update a counter.

Without Observer, the `Account` object could directly invoke each consumer:

```js
class Account {
    constructor(display, audit, metrics) {
        this.balance = 0;
        this.display = display;
        this.audit = audit;
        this.metrics = metrics;
    }

    deposit(amount) {
        this.balance += amount;

        this.display.update(this.balance);
        this.audit.record(this.balance);
        this.metrics.increment();
    }
}
```

This creates unnecessary coupling. `Account` now knows which consumers exist, how they are invoked, and how many of them
are required. Adding another consumer requires modifying `Account`.

Observer moves that dependency into a subscription mechanism.

```js
class Account {
    #observers = new Set();
    #balance = 0;

    subscribe(observer) {
        this.#observers.add(observer);

        return () => {
            this.#observers.delete(observer);
        };
    }

    deposit(amount) {
        this.#balance += amount;

        for (const observer of this.#observers) {
            observer.update(this.#balance);
        }
    }
}
```

Consumers subscribe independently:

```js
const account = new Account();

const unsubscribeDisplay = account.subscribe({
    update(balance) {
        console.log(`Balance: ${balance}`);
    }
});

const unsubscribeAudit = account.subscribe({
    update(balance) {
        console.log(`Audit: ${balance}`);
    }
});
```

The account does not need to know why an observer is interested in the change.

## Structure

The traditional Observer structure consists of four conceptual participants.

### Subject

The **Subject** owns the observable state or produces the changes that observers care about.

It maintains a collection of observers and provides operations for subscribing and unsubscribing.

```js
class Subject {
    #observers = new Set();

    subscribe(observer) {
        this.#observers.add(observer);

        return () => {
            this.#observers.delete(observer);
        };
    }

    notify(value) {
        for (const observer of this.#observers) {
            observer.update(value);
        }
    }
}
```

The subject should generally own the subscription relationship. Observers should not need to modify the subject's
internal collection directly.

### Observer

The **Observer** defines the notification contract.

```js
const observer = {
    update(value) {
        console.log(value);
    }
};
```

The contract can be represented by a method such as `update`, a callback function, or another application-specific
notification interface.

### Concrete Subject

A **Concrete Subject** maintains actual state and determines when observers should be notified.

```js
class TemperatureSensor {
    #temperature = 20;
    #observers = new Set();

    subscribe(observer) {
        this.#observers.add(observer);

        return () => {
            this.#observers.delete(observer);
        };
    }

    setTemperature(value) {
        if (value === this.#temperature) {
            return;
        }

        this.#temperature = value;

        for (const observer of this.#observers) {
            observer.update(this.#temperature);
        }
    }
}
```

### Concrete Observer

A **Concrete Observer** implements the reaction to a notification.

```js
const display = {
    update(temperature) {
        console.log(`Temperature: ${temperature}°C`);
    }
};
```

Different observers can react independently to the same notification.

## Subscription

Subscription is the mechanism through which an observer establishes its dependency on a subject.

A basic implementation can use a `Set`:

```js
class Subject {
    #observers = new Set();

    subscribe(observer) {
        this.#observers.add(observer);
    }

    unsubscribe(observer) {
        this.#observers.delete(observer);
    }

    notify(value) {
        for (const observer of this.#observers) {
            observer.update(value);
        }
    }
}
```

A `Set` is useful because the same observer object is naturally registered at most once.

The API can instead return an unsubscribe function:

```js
subscribe(observer)
{
    this.#observers.add(observer);

    return () => {
        this.#observers.delete(observer);
    };
}
```

This style is particularly useful in JavaScript because subscription setup and teardown can remain local to the
consumer.

```js
const unsubscribe = subject.subscribe(observer);

unsubscribe();
```

Returning an explicit teardown operation also makes lifecycle management easier to reason about.

## Notification

The subject determines when notification occurs.

Notification can happen after a state mutation:

```js
setValue(value)
{
    this.#value = value;
    this.notify(value);
}
```

It can happen only when a meaningful change occurs:

```js
setValue(value)
{
    if (value === this.#value) {
        return;
    }

    this.#value = value;
    this.notify(value);
}
```

It can also happen because an external event occurred rather than because the subject itself owns the changed state.

The important distinction is that the subject defines the **observable event boundary**. Observers should not have to
continuously inspect the subject to discover whether something changed.

## What Should Be Notified

There are several common notification models.

### New Value

The observer receives the new state directly.

```js
observer.update(newValue);
```

This is simple when the observer only needs the resulting value.

### Previous and New Values

The observer receives both states.

```js
observer.update(previousValue, newValue);
```

This is useful when the observer needs to determine what changed.

```js
update(previous, current)
{
    if (current > previous) {
        console.log("Value increased");
    }
}
```

### Event Object

The subject publishes a structured event.

```js
observer.update({
    type: "balanceChanged",
    previousBalance,
    balance: currentBalance
});
```

This allows the notification contract to evolve without continually changing the number of method parameters.

### Subject Reference

A traditional Observer implementation may give the observer access to the subject:

```js
observer.update(subject);
```

The observer can then query the current state.

This provides flexibility but increases coupling because the observer now depends on the subject's public interface.
Passing only the required data generally produces a narrower dependency.

## Push and Pull Models

Observer implementations are commonly described as either **push** or **pull**.

In a push model, the subject sends the relevant information with the notification.

```js
observer.update({
    temperature: 25,
    timestamp: Date.now()
});
```

The observer does not need to query the subject.

In a pull model, the subject primarily signals that something changed:

```js
observer.update();
```

The observer then obtains the state from the subject.

```js
update()
{
    const temperature = sensor.getTemperature();
}
```

Push notification generally provides a narrower and more explicit contract, while pull notification can reduce the
amount of information the subject must decide to expose. Pull also couples observers more strongly to the subject's
query interface.

## Notification Ordering

When multiple observers exist, the subject must define whether notification order has meaning.

A `Set` preserves insertion order during iteration:

```js
for (const observer of this.#observers) {
    observer.update(value);
}
```

This means observers will normally receive notifications in subscription order.

However, an application should not rely on ordering accidentally. If observer ordering is semantically important, that
requirement should be explicit.

For example, an observer responsible for validation should not implicitly depend on another observer having already
executed merely because it happened to subscribe first.

When ordering represents an actual workflow, Observer may be the wrong abstraction. A workflow or explicit orchestration
mechanism may express the dependency more clearly.

## Adding and Removing Observers During Notification

Observers can modify the subscription collection while notification is occurring.

Consider:

```js
notify(value)
{
    for (const observer of this.#observers) {
        observer.update(value);
    }
}
```

An observer could unsubscribe itself:

```js
const observer = {
    update(value) {
        unsubscribe();
    }
};
```

It could also subscribe another observer.

The resulting behavior depends on the collection implementation and iteration semantics. Robust implementations should
define whether modifications affect the current notification cycle or only future cycles.

One approach is to iterate over a snapshot:

```js
notify(value)
{
    const observers = [...this.#observers];

    for (const observer of observers) {
        observer.update(value);
    }
}
```

This establishes a stable notification set for that notification cycle.

The choice is semantic rather than merely technical. The contract should specify whether observers added during
notification receive the current event and whether observers removed during notification still receive it.

## Reentrancy

An observer can cause another state change while handling a notification:

```js
update(value)
{
    subject.setValue(transform(value));
}
```

This can result in nested notifications.

Reentrancy becomes particularly dangerous when observers indirectly trigger one another:

```js
observerA.update();
observerB.update();
```

If `observerA` modifies state that causes another notification, observers may be invoked recursively before the original
notification cycle has completed.

A subject may therefore need explicit rules concerning:

* Whether notifications may be reentrant.
* Whether state changes are queued.
* Whether duplicate notifications are collapsed.
* Whether nested changes are processed immediately.
* Whether notification cycles are detected.
* Whether observers are allowed to mutate the subject.

These concerns become increasingly important in reactive or state-management systems.

## Synchronous Notification

The simplest Observer implementation is synchronous.

```js
notify(value)
{
    for (const observer of this.#observers) {
        observer.update(value);
    }
}
```

The subject does not consider the change complete until all observers have returned.

This has predictable ordering and straightforward error propagation, but it means a slow observer directly increases the
latency of the subject operation.

For example:

```js
subject.setValue(value);
```

may not return until every observer has finished processing the notification.

Synchronous Observer is appropriate when notification is part of the same operation and observers are expected to
execute quickly.

## Asynchronous Notification

Observers may instead perform asynchronous work:

```js
const observer = {
    async update(value) {
        await saveValue(value);
    }
};
```

The subject must then decide whether it waits for observers.

A simple asynchronous implementation is:

```js
async
notify(value)
{
    for (const observer of this.#observers) {
        await observer.update(value);
    }
}
```

This preserves sequential processing.

Alternatively, observers can be invoked concurrently:

```js
async
notify(value)
{
    await Promise.all(
        [...this.#observers].map(observer => observer.update(value))
    );
}
```

These approaches have different semantics.

Sequential notification provides ordering and limits concurrent work. Parallel notification reduces total latency when
observers are independent but introduces concurrency and failure-isolation concerns.

The choice should be explicit rather than being an accidental consequence of using `async` functions.

## Error Handling

Observer failure requires a defined policy.

A synchronous subject may naturally propagate the first exception:

```js
notify(value)
{
    for (const observer of this.#observers) {
        observer.update(value);
    }
}
```

If one observer throws, later observers may never execute.

That may be correct when all observers are part of one transactional operation, but it is often undesirable for
independent observers.

An implementation can isolate failures:

```js
notify(value)
{
    for (const observer of this.#observers) {
        try {
            observer.update(value);
        } catch (error) {
            this.handleObserverError(observer, error);
        }
    }
}
```

The correct policy depends on the semantics of the notification.

For independent logging, metrics, and analytics observers, one observer failing generally should not prevent unrelated
observers from receiving the event. For observers participating in a required consistency operation, failure may need to
propagate.

Error isolation should therefore be part of the Observer contract rather than an implementation detail.

## Observer Lifecycle

Subscription creates a dependency that must eventually be removed when the observer no longer needs notifications.

A common pattern is:

```js
const unsubscribe = subject.subscribe(observer);

// Later
unsubscribe();
```

This is particularly important for long-lived subjects.

If a short-lived object subscribes to a long-lived subject and never unsubscribes, the subject may retain the observer
indefinitely:

```text
long-lived subject
    |
    +-- retained observer
```

The actual implementation should not use such diagrams; the important architectural relationship is that the subject's
subscription collection creates a strong reference to its observers.

In JavaScript, this can produce memory leaks even when the observer is otherwise unreachable.

Framework integrations should therefore connect subscription lifetime to the lifecycle of the consuming component.

## Duplicate Subscriptions

The API should define whether the same observer can subscribe multiple times.

Using a `Set` produces idempotent registration:

```js
this.#observers.add(observer);
```

The observer receives one notification regardless of how many times the same object is passed to `subscribe`.

An array allows duplicate registrations:

```js
this.#observers.push(observer);
```

The same observer may then receive the same notification multiple times.

Neither behavior is universally correct. The subscription contract must define the intended semantics.

## One Observer with Multiple Subjects

An observer may subscribe to multiple subjects:

```js
const observer = {
    update(value) {
        console.log(value);
    }
};

subjectA.subscribe(observer);
subjectB.subscribe(observer);
```

The observer may need to know which subject generated the notification.

A structured event can provide that context:

```js
observer.update({
    source: subject,
    value
});
```

However, passing the complete subject can increase coupling. A stable source identifier or event type may provide a
narrower contract.

## Multiple Event Types

A subject may expose multiple notification types:

```js
subject.subscribe("created", observer);
subject.subscribe("updated", observer);
subject.subscribe("deleted", observer);
```

A simple implementation can use separate observer collections:

```js
class Subject {
    #observers = new Map();

    subscribe(type, observer) {
        if (!this.#observers.has(type)) {
            this.#observers.set(type, new Set());
        }

        this.#observers.get(type).add(observer);

        return () => {
            this.#observers.get(type)?.delete(observer);
        };
    }

    notify(type, value) {
        for (const observer of this.#observers.get(type) ?? []) {
            observer.update(value);
        }
    }
}
```

This is still compatible with Observer when the subscriptions represent dependencies on a particular subject's events.

However, once the system becomes a general-purpose message distribution mechanism spanning unrelated producers and
consumers, it starts to resemble publish/subscribe rather than the classic Observer relationship.

## Callback-Based Observer

JavaScript does not require observer objects with an `update` method.

Functions naturally represent observers:

```js
class Subject {
    #listeners = new Set();

    subscribe(listener) {
        this.#listeners.add(listener);

        return () => {
            this.#listeners.delete(listener);
        };
    }

    notify(value) {
        for (const listener of this.#listeners) {
            listener(value);
        }
    }
}
```

Usage:

```js
const unsubscribe = subject.subscribe(value => {
    console.log(value);
});
```

This is often the most idiomatic JavaScript representation when the notification contract consists of a single callback.

The underlying relationship remains Observer even though the participants are functions rather than classes.

## EventTarget

JavaScript provides a native event-observation mechanism through `EventTarget`.

```js
const target = new EventTarget();

function handleChange(event) {
    console.log(event.detail);
}

target.addEventListener("change", handleChange);

target.dispatchEvent(
    new CustomEvent("change", {
        detail: {value: 42}
    })
);

target.removeEventListener("change", handleChange);
```

This provides subscription and notification semantics without requiring a custom observer collection.

`EventTarget` is particularly appropriate for browser-facing APIs and objects that naturally expose events.

The existence of `EventTarget` does not eliminate the Observer pattern. It provides a reusable mechanism implementing a
closely related event-notification model.

## Event Emitters

Many JavaScript environments and libraries provide event-emitter abstractions:

```js
emitter.on("change", handler);
emitter.emit("change", value);
emitter.off("change", handler);
```

This can implement Observer-like behavior.

The important architectural question is not whether the API is named `Observer`, `EventEmitter`, `Listener`, or
`Subscription`. The relevant property is whether consumers establish a one-to-many dependency on a producer and receive
notifications when relevant changes occur.

## Reactive Streams

Reactive programming extends the basic Observer relationship with additional concepts such as:

* Transformation.
* Filtering.
* Composition.
* Backpressure.
* Scheduling.
* Cancellation.
* Error channels.
* Completion.
* Multicasting.
* Replay.
* Buffering.

A simple observer:

```js
subject.subscribe(observer);
```

can therefore evolve into a substantially richer stream abstraction.

At that point, the system is no longer merely a minimal Observer implementation. It is a reactive stream or observable
abstraction with its own execution and lifecycle semantics.

## Backpressure

Traditional Observer assumes that observers can keep up with notifications.

That assumption fails when a subject produces events faster than observers can process them.

For example, a high-frequency source may produce thousands of notifications per second while a consumer can process only
a fraction of that rate.

Possible policies include:

* Queue every notification.
* Drop the newest notification.
* Drop the oldest notification.
* Keep only the latest state.
* Batch notifications.
* Apply throttling.
* Apply debouncing.
* Block the producer.
* Apply explicit backpressure.

The correct choice depends on whether every event is semantically significant.

A state-change observer may only care about the latest state, while an audit observer may require every individual
event.

## State Observation Versus Event Observation

Observer can represent two related but distinct concepts.

State observation means observers care about the current state:

```js
state.subscribe(value => {
    render(value);
});
```

Event observation means observers care about an occurrence:

```js
button.subscribe(event => {
    handleClick(event);
});
```

The distinction matters because state observers may reasonably expect a current or initial value, while event observers
generally should not receive historical events unless replay is explicitly part of the contract.

## Initial Notification

A subscription API may immediately notify a new observer with the current state:

```js
subscribe(observer)
{
    this.#observers.add(observer);
    observer.update(this.#value);

    return () => {
        this.#observers.delete(observer);
    };
}
```

This is useful for state-oriented observation because the observer does not have to separately retrieve the initial
state.

However, it changes the semantics of `subscribe`: subscribing now performs an observable callback.

An event-oriented API generally should not emit an artificial event merely because a consumer subscribed.

## Replay

Some observer systems retain recent notifications and replay them to new subscribers.

For example, a state container may retain its current value and provide it immediately to new observers.

Replay can be useful but introduces history semantics into the abstraction. The system must define how much history is
retained, how it is bounded, and whether replayed notifications are distinguishable from live notifications.

If history is a fundamental requirement, a dedicated state or event-stream abstraction may be clearer than adding
increasingly complex behavior to a basic Observer implementation.

## Weak References

JavaScript provides `WeakRef` and `FinalizationRegistry`, which can sometimes be considered for observer lifecycle
management.

However, weak references should not normally replace explicit subscription ownership.

Garbage collection is nondeterministic, and application behavior should not depend on when an observer becomes
collectible.

Explicit unsubscription remains the clearer mechanism when the application knows when an observation relationship should
end.

## Observer and Memory Leaks

A common leak has this structure conceptually: a long-lived subject retains a short-lived observer because the observer
remains registered after its useful lifetime.

For example:

```js
class Component {
    constructor(store) {
        this.unsubscribe = store.subscribe(value => {
            this.render(value);
        });
    }

    destroy() {
        this.unsubscribe();
    }

    render(value) {
        // ...
    }
}
```

The component's lifecycle explicitly owns its subscription.

Frameworks should generally establish this same relationship automatically where possible.

## Observer and Encapsulation

The subject should expose only the state or events that observers are supposed to consume.

A poor design might expose mutable internal structures:

```js
notify(this.#internalState);
```

If observers can mutate that object, the subject's encapsulation is compromised.

Prefer immutable values or defensive copies when necessary:

```js
notify({
    items: [...this.#items]
});
```

The observer contract should define ownership of supplied objects and whether consumers are permitted to mutate them.

## Observer and Mutable State

Observers can become difficult to reason about when notifications expose mutable state.

Consider:

```js
notify(this.#state);
```

If several observers mutate the same object, the result depends on observer ordering and shared references.

Immutable snapshots are often safer:

```js
notify({
    ...this.#state
});
```

For nested structures, shallow copying may not be sufficient. The appropriate ownership strategy depends on the data
model.

Observer does not inherently require immutability, but immutable notification payloads significantly reduce accidental
coupling between observers.

## Observer and Transactions

A subject may undergo multiple internal mutations during one logical operation.

For example:

```js
account.debit();
account.updateLedger();
account.recordTransaction();
```

If each internal mutation triggers notification, observers may see intermediate states that should never be externally
observable.

A transactional subject may instead delay notification until the logical operation reaches a consistent boundary.

The important principle is that **notification should generally occur at a semantically meaningful state boundary**, not
merely after every internal assignment.

## Observer and Batching

A subject may combine multiple changes into one notification:

```js
subject.beginBatch();

subject.add(itemA);
subject.add(itemB);
subject.remove(itemC);

subject.endBatch();
```

The observer may then receive one notification representing the resulting state.

Batching can significantly reduce notification overhead, but it changes the observable semantics. Consumers that require
individual events cannot use a state-oriented batched notification as a substitute for an event stream.

## Observer and Cancellation

Subscription teardown and notification cancellation are separate concerns.

Unsubscribing means the observer no longer wants future notifications.

Cancellation may instead mean that an in-progress asynchronous operation should stop.

For example:

```js
const unsubscribe = subject.subscribe(async value => {
    await process(value);
});
```

Calling `unsubscribe()` does not automatically cancel the `process(value)` operation that has already started.

Systems with asynchronous observers may therefore need explicit cancellation semantics such as `AbortSignal`.

## TypeScript

A traditional Observer contract can be represented with an interface:

```ts
interface Observer<T> {
    update(value: T): void;
}

interface Subject<T> {
    subscribe(observer: Observer<T>): () => void;
}
```

A concrete implementation can then be strongly typed:

```ts
class Store<T> {
    #observers = new Set<Observer<T>>();
    #value: T;

    constructor(initialValue: T) {
        this.#value = initialValue;
    }

    subscribe(observer: Observer<T>): () => void {
        this.#observers.add(observer);

        return () => {
            this.#observers.delete(observer);
        };
    }

    set(value: T): void {
        this.#value = value;

        for (const observer of this.#observers) {
            observer.update(value);
        }
    }
}
```

A callback-based API is simpler:

```ts
type Listener<T> = (value: T) => void;

class Store<T> {
    #listeners = new Set<Listener<T>>();

    subscribe(listener: Listener<T>): () => void {
        this.#listeners.add(listener);

        return () => {
            this.#listeners.delete(listener);
        };
    }

    set(value: T): void {
        for (const listener of this.#listeners) {
            listener(value);
        }
    }
}
```

Generic notification types allow the same mechanism to support different subjects without sacrificing static type
checking.

## Observer Versus Pub/Sub

Observer and publish/subscribe are related but should not be treated as identical.

In Observer, the subject and observers have an explicit dependency relationship. Observers subscribe to a particular
subject, and the subject maintains knowledge of its observers.

Publish/subscribe introduces an intermediary messaging mechanism. Producers generally publish messages without knowing
which consumers receive them, and consumers subscribe to topics or channels rather than directly to a particular
producer.

The architectural distinction is therefore **direct subject-to-observer dependency versus mediated message
distribution**.

A local object notifying its registered listeners is naturally Observer. A system-wide event broker distributing
messages between independently deployed components is better described as publish/subscribe.

## Observer Versus Mediator

Mediator encapsulates how a set of objects interact with each other.

Observer primarily communicates that something happened or that observable state changed.

For example:

```js
subject.notify(change);
```

is Observer behavior.

By contrast, a mediator might receive an action from one component, invoke several other components, inspect their
results, coordinate ordering, and decide what happens next.

The key distinction is **notification versus interaction coordination**.

An Observer should not gradually become the component responsible for understanding and orchestrating every participant
in a workflow. Once it does, Mediator or an application-service-style coordinator may be the more appropriate
abstraction.

## Observer Versus Chain of Responsibility

Chain of Responsibility passes a request through a sequence of potential handlers, generally until a handler assumes
responsibility or the chain reaches its end.

Observer broadcasts a notification to multiple interested observers.

A chain answers:

**Which handler should process this request?**

Observer answers:

**Which observers should be notified that this change occurred?**

An observer collection should therefore not be treated as a Chain of Responsibility merely because observers execute
sequentially.

## Observer Versus Mediated Event Systems

An event system can combine several patterns.

For example, a subject may notify a mediator, which coordinates several components. The mediator may use commands to
initiate operations and observers to report resulting state changes.

These patterns can coexist, but their responsibilities should remain distinct.

Observer owns the notification relationship. Mediator owns collaboration coordination. Command owns request
encapsulation. Chain of Responsibility owns responsibility selection.

## Observer Versus State

State changes the behavior of an object according to its internal state.

Observer reacts to state changes or events produced by another object.

A state object might determine how a connection behaves when it is connected, disconnected, or reconnecting. An observer
might be notified whenever that connection changes state.

The two patterns can therefore be used together without being interchangeable.

## Observer Versus Strategy

Strategy encapsulates interchangeable algorithms.

An observer does not normally represent alternative implementations of one algorithm. Multiple observers may all react
to the same notification simultaneously.

If the question is "Which algorithm should process this operation?", Strategy is relevant.

If the question is "Which consumers should be informed when this operation changes something?", Observer is relevant.

## Observer Versus Decorator

Decorator wraps an object to add responsibilities while preserving a compatible interface.

Observer does not normally wrap the subject. It establishes a separate dependency in which independent consumers receive
notifications.

A logging decorator might intercept a method call and then delegate to the wrapped object. An observer instead receives
a notification because the subject has explicitly exposed that event or state change.

## Observer Versus Event Sourcing

Event Sourcing stores state transitions as an authoritative sequence of events.

Observer merely distributes notifications.

An observer may receive an event that is also stored by an event-sourced system, but notification does not imply
persistence, replayability, ordering guarantees, or historical authority.

These are separate concerns.

## Observer Versus Command

Command encapsulates an operation as an object.

Observer communicates that something has happened.

A command might request:

```js
execute();
```

An observer might receive:

```js
update(event);
```

A command can cause an observable state change, after which observers may be notified.

## Observer in UI Systems

UI systems are a common application of Observer.

A state source can notify multiple UI consumers:

```js
const unsubscribe = store.subscribe(state => {
    render(state);
});
```

Different consumers can observe different aspects of state:

```js
store.subscribe(state => {
    renderHeader(state.user);
});

store.subscribe(state => {
    renderCart(state.cart);
});

store.subscribe(state => {
    updateMetrics(state);
});
```

This allows the state producer to remain independent from the presentation logic.

However, overly broad observation can cause unnecessary rendering and excessive coupling. Fine-grained subscriptions,
selectors, memoization, and batching may be necessary in larger systems.

## Observer in Domain Models

A domain object may expose domain-relevant state changes:

```js
class Order {
    #observers = new Set();

    subscribe(observer) {
        this.#observers.add(observer);

        return () => this.#observers.delete(observer);
    }

    ship() {
        // validate and change domain state

        this.#notify({
            type: "OrderShipped"
        });
    }

    #notify(event) {
        for (const observer of this.#observers) {
            observer.update(event);
        }
    }
}
```

The important consideration is whether the notification belongs to the domain model or merely to the application
infrastructure.

Domain events and Observer can overlap, but they should not automatically be treated as identical concepts. A domain
event represents a meaningful domain occurrence; Observer describes the mechanism by which interested consumers are
notified.

## Observer in Infrastructure

Observer is also useful for infrastructure components:

* Connection state.
* Cache invalidation.
* Configuration changes.
* File-system monitoring.
* Resource lifecycle.
* Metrics.
* Application state.
* Job progress.
* Device state.
* UI events.

The pattern is especially useful when multiple independent consumers need to respond to the same producer-owned change.

## Dependency Injection

Observers are naturally compatible with dependency injection.

Instead of constructing consumers inside the subject:

```js
class Subject {
    constructor() {
        this.logger = new Logger();
        this.metrics = new Metrics();
    }
}
```

the application composition layer can create observers and subscribe them:

```js
const subject = new Subject();

subject.subscribe(logger);
subject.subscribe(metrics);
subject.subscribe(cacheInvalidator);
```

The subject remains unaware of the concrete observer implementations.

This preserves dependency inversion and keeps application wiring outside the domain object.

## Testing

Observer-based systems should test both notification behavior and subscription lifecycle.

Important cases include:

* Observer receives the expected notification.
* Observer does not receive unrelated notifications.
* Multiple observers receive the same notification.
* Unsubscribed observers no longer receive notifications.
* Duplicate subscriptions behave according to the contract.
* Observer failures follow the documented error policy.
* Notification ordering follows the documented semantics.
* State changes produce notifications only at the intended boundaries.
* Observers can safely subscribe or unsubscribe during notification if that behavior is supported.
* Asynchronous observers follow the intended concurrency semantics.

A simple test can verify teardown:

```js
const received = [];

const unsubscribe = subject.subscribe(value => {
    received.push(value);
});

subject.set(1);

unsubscribe();

subject.set(2);

console.log(received);
// [1]
```

## Performance

Observer has relatively low computational complexity.

If a subject has `n` observers, notifying all observers is generally `O(n)` for that notification.

The more significant performance cost may be the work performed by observers rather than the iteration itself.

Large observer populations can introduce:

* Notification overhead.
* Allocation of event objects.
* Repeated serialization.
* Excessive rendering.
* Queue growth.
* Async task accumulation.
* Garbage-collection pressure.
* Lock contention in concurrent environments.

Optimization should therefore focus on notification frequency, payload size, observer work, batching, filtering, and
scheduling rather than prematurely optimizing the subscription collection.

## Observer Granularity

The granularity of notifications strongly affects coupling.

A subject exposing:

```js
notify("changed");
```

provides little information but may force observers to retrieve additional state.

A subject exposing:

```js
notify({
    type: "OrderUpdated",
    orderId,
    changedFields,
    timestamp
});
```

provides richer information but creates a more detailed notification contract.

Too little information produces unnecessary coupling through follow-up queries. Too much information exposes
implementation details and makes the event contract difficult to evolve.

The notification payload should therefore contain the minimum stable information required by consumers.

## Event Naming

Event names should represent meaningful observable semantics.

Good event names generally describe something that happened:

```js
"orderCreated"
"orderShipped"
"connectionClosed"
"configurationChanged"
```

Avoid names that expose implementation mechanics:

```js
"setOrderCalled"
"internalArrayModified"
"propertyAssigned"
```

Implementation-oriented events make observers dependent on internal structure rather than stable behavior.

## Notification Contracts

The notification contract should define:

* Event or state type.
* Payload structure.
* Whether the payload is mutable.
* Whether notifications are synchronous.
* Whether ordering is guaranteed.
* Whether duplicate notifications are possible.
* Whether initial state is emitted.
* Whether historical events are replayed.
* Error behavior.
* Subscription lifetime.
* Cancellation behavior.
* Concurrency behavior.

A small observer API can therefore have significant semantic complexity. The subscription method itself is only the
visible surface of the contract.

## Refactoring Toward Observer

Observer is often introduced when a subject contains direct calls to multiple independent consumers.

Before:

```js
class OrderService {
    constructor() {
        this.emailService = new EmailService();
        this.auditService = new AuditService();
        this.metrics = new Metrics();
    }

    complete(order) {
        order.complete();

        this.emailService.send(order);
        this.auditService.record(order);
        this.metrics.increment("orders.completed");
    }
}
```

The service now knows every reaction that must occur after completion.

The reactions can be extracted:

```js
class OrderService {
    #observers = new Set();

    subscribe(observer) {
        this.#observers.add(observer);

        return () => {
            this.#observers.delete(observer);
        };
    }

    complete(order) {
        order.complete();

        for (const observer of this.#observers) {
            observer.update(order);
        }
    }
}
```

The application composition layer can register the required consumers.

The refactoring is valuable when the reactions are genuinely independent and should evolve separately. It is not
automatically beneficial merely because several method calls occur sequentially.

## Recognizing an Observer Opportunity

Observer is a strong candidate when:

* One object has many independent dependents.
* New dependents are expected over time.
* Dependents should be replaceable without modifying the producer.
* The producer naturally exposes meaningful state changes or events.
* Consumers perform independent reactions.
* Subscription lifetime can be defined clearly.
* Notification does not require complex coordination between consumers.

Observer is less suitable when the producer must control a specific sequence of dependent operations or make decisions
based on their results.

## Common Misuse

### Treating Every Callback as Observer

A callback passed to a single function call is not necessarily an Observer.

```js
doSomething(result => {
    console.log(result);
});
```

A callback becomes Observer-like when it represents a persistent dependency on notifications from a subject.

### Building an Undocumented Global Event Bus

A global event bus can appear convenient:

```js
events.emit("somethingChanged", data);
```

but it can create hidden dependencies, unclear ownership, difficult lifecycle management, and poor discoverability.

Observer works best when the producer-consumer relationship remains understandable.

### Hiding Required Control Flow

Observer should not be used to hide a workflow that has strict dependencies.

If operation B must execute only after operation A succeeds and operation C must receive B's result, independent
observers may obscure the required control flow.

An explicit coordinator is often clearer.

### Ignoring Unsubscription

Long-lived subjects combined with short-lived observers are a common source of memory leaks.

Every subscription should have a clearly defined owner and teardown path.

### Swallowing Observer Failures

Ignoring all observer errors can make production failures invisible.

Error policy should be explicit and should account for whether observers are independent or transactionally significant.

### Overly Broad Events

An event such as:

```js
"applicationChanged"
```

may force every observer to inspect large amounts of state to determine whether it is interested.

More precise events or selectors can reduce unnecessary work.

### Exposing Internal State

Passing mutable internal structures directly to observers can allow consumers to accidentally mutate producer-owned
state.

Notification should preserve the subject's ownership and encapsulation rules.

## Architectural Considerations

Observer is primarily an intra-process decoupling mechanism, although similar notification semantics can appear in
distributed systems.

Inside an application, it is commonly used between domain objects, application state, UI components, and infrastructure
components.

At larger architectural boundaries, direct Observer relationships may be replaced by:

* Message brokers.
* Event buses.
* Domain events.
* Publish/subscribe infrastructure.
* Reactive streams.
* Webhooks.
* Queues.

The architectural scale changes the reliability, delivery, persistence, and failure semantics. A distributed event
mechanism should not be assumed to behave like an in-memory Observer merely because both use notification terminology.

## Coupling

Observer reduces direct coupling between the subject and concrete consumers, but it does not eliminate coupling.

The subject and observers remain coupled through the notification contract.

For example:

```js
observer.update({
    type: "OrderShipped",
    orderId
});
```

creates a dependency on that event structure.

Good Observer design therefore attempts to stabilize the notification contract rather than pretending the participants
have no dependency at all.

## Cohesion

The subject should remain responsible for determining what constitutes an observable change.

It should not become responsible for understanding every observer's business logic.

Likewise, observers should contain their own reactions rather than pushing those reactions back into the subject.

A healthy division is:

**Subject owns change detection and notification. Observer owns reaction.**

## Benefits

Observer provides several advantages:

* Reduces direct producer-to-consumer coupling.
* Supports one-to-many dependencies.
* Allows observers to be added and removed dynamically.
* Keeps reactions independently replaceable.
* Supports event-driven and reactive designs.
* Works naturally with JavaScript callbacks and event APIs.
* Encourages dependency inversion.
* Separates change production from change handling.
* Allows multiple independent consumers to react to the same state change.

## Costs

Observer also introduces costs:

* Subscription lifecycle must be managed.
* Notification ordering can become significant.
* Reentrancy can complicate execution.
* Observer failures require explicit handling.
* Long-lived subjects can retain observers and cause memory leaks.
* Event contracts become part of the system's coupling surface.
* Excessive notifications can hurt performance.
* Debugging indirect control flow can be harder than debugging direct calls.
* Global event systems can create hidden dependencies.
* Asynchronous observers introduce scheduling and concurrency concerns.

Observer is therefore not automatically superior to direct method calls. Its value comes from decoupling a genuinely
variable set of consumers from a stable producer.

## Decision Criteria

Use Observer when:

* One subject has multiple independent dependents.
* Consumers need notification rather than coordinated control flow.
* Consumers may be added or removed dynamically.
* The subject should remain unaware of concrete consumers.
* The notification contract can be kept stable.
* Subscription lifetime can be managed explicitly.

Prefer direct calls when the set of consumers is fixed and their invocation is part of the producer's essential
behavior.

Prefer Mediator when the primary problem is coordinating interactions among multiple objects.

Prefer Chain of Responsibility when a request must be passed through potential handlers to determine responsibility.

Prefer Strategy when the primary problem is selecting between interchangeable algorithms.

Prefer publish/subscribe when producers and consumers should communicate through an intermediary messaging mechanism
rather than maintain direct subject-observer relationships.

Prefer a reactive-stream abstraction when the system requires composition, transformation, scheduling, replay,
buffering, cancellation, or backpressure beyond simple notification.

## Summary

Observer establishes a one-to-many dependency in which a subject notifies interested observers when a meaningful state
change or event occurs. The subject owns the observable change and the subscription relationship; observers own their
reactions.

JavaScript naturally supports Observer through callback subscriptions, `EventTarget`, event emitters, iterables of
listeners, and reactive abstractions. The pattern does not require classes or a formal `Observer` interface.

The central design problem is not merely how to call several callbacks. It is how to represent and manage a stable
notification relationship between a producer and a variable set of independent consumers.

A sound implementation therefore makes subscription ownership, notification boundaries, payload semantics, ordering,
error handling, asynchronous execution, cancellation, and lifecycle explicit.

Observer should remain focused on **notification**. When the system begins using the observer mechanism to coordinate
complex workflows, select handlers, encapsulate commands, or distribute messages across unrelated architectural
boundaries, another abstraction may better represent the underlying responsibility.

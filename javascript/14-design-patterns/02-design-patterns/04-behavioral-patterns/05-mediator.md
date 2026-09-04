# Mediator

## Intent

**Mediator defines an object that encapsulates how a set of objects interact, reducing the direct coupling between those
objects.** Instead of allowing participating objects to communicate with each other directly, they communicate through a
mediator that coordinates their interactions.

The pattern is useful when a group of objects has become tightly coupled because each object knows about and
communicates with several others. The mediator centralizes that interaction logic so participating objects can remain
focused on their own responsibilities.

Mediator does not primarily simplify a subsystem for external clients, notify an arbitrary set of subscribers, or
represent a request as an object. Its defining concern is **centralizing the rules governing interaction between
collaborating objects**.

## Problem

Objects that participate in a complex collaboration often accumulate references to one another.

For example, a dialog might contain a text field, checkbox, dropdown, button, and validation message. The button may
need to inspect the checkbox, the dropdown may affect the text field, the text field may affect the validation message,
and several controls may affect whether the button is enabled.

Without coordination, each component can become aware of several other components:

```js
class TextField {
    constructor(checkbox, button, message) {
        this.checkbox = checkbox;
        this.button = button;
        this.message = message;
    }

    change(value) {
        this.value = value;
        this.button.update();
        this.message.validate(value);
    }
}

class Checkbox {
    constructor(textField, button) {
        this.textField = textField;
        this.button = button;
    }

    change(checked) {
        this.checked = checked;
        this.button.update();
        this.textField.update();
    }
}
```

As the number of participants grows, the interaction relationships become difficult to understand and modify. Changing
one participant can require changes in several other participants.

The problem is not necessarily that the individual objects are large. The problem is that **collaboration logic is
distributed across many objects and their dependencies become tightly interconnected**.

Mediator moves that collaboration logic into a dedicated coordinating object.

## Structure

The pattern consists of collaborating participants and a mediator responsible for coordinating them.

The participants know the mediator but do not need to know the other participants involved in the collaboration. A
participant reports an event or requests coordination through the mediator. The mediator decides which other
participants should be affected and how.

A participant therefore owns its own state and local behavior, while the mediator owns the interaction rules connecting
participants.

```js
class DialogMediator {
    constructor() {
        this.username = null;
        this.password = null;
        this.rememberMe = false;
    }

    setUsername(value) {
        this.username = value;
        this.updateLoginButton();
    }

    setPassword(value) {
        this.password = value;
        this.updateLoginButton();
    }

    setRememberMe(value) {
        this.rememberMe = value;
    }

    updateLoginButton() {
        const enabled =
            this.username.length > 0 &&
            this.password.length > 0;

        this.loginButton.setEnabled(enabled);
    }

    submit() {
        return this.authenticator.login(
            this.username,
            this.password,
            this.rememberMe
        );
    }
}
```

The important property is not the specific class structure. It is the **ownership of collaboration rules**. The mediator
becomes the explicit location where relationships between participants are defined.

## Participants

A Mediator-based design typically contains two conceptual roles.

### Mediator

The mediator defines the coordination interface and contains the collaboration rules.

It determines how participant actions affect other participants and may coordinate multiple operations as one
higher-level interaction.

```js
class Mediator {
    notify(sender, event) {
        // coordinate participants
    }
}
```

The mediator should coordinate participants rather than absorb all of their domain behavior.

### Concrete Mediator

The concrete mediator implements the actual collaboration logic for a particular group of participants.

```js
class ConcreteMediator {
    constructor() {
        this.editor = null;
        this.preview = null;
        this.toolbar = null;
    }

    notify(sender, event) {
        if (sender === this.editor && event === "changed") {
            this.preview.render(this.editor.getContent());
            this.toolbar.update(this.editor);
        }
    }
}
```

The concrete mediator usually knows the participants it coordinates.

### Colleagues

Colleagues are the objects participating in the collaboration.

They contain their own state and responsibilities but delegate cross-object coordination to the mediator.

```js
class Editor {
    constructor(mediator) {
        this.mediator = mediator;
        this.content = "";
    }

    setContent(content) {
        this.content = content;
        this.mediator.notify(this, "changed");
    }

    getContent() {
        return this.content;
    }
}
```

A colleague should generally know enough about the mediator to report relevant events or request coordination, but
should not need direct references to every other colleague.

## Centralized Collaboration

The central reason to introduce a mediator is to give interaction logic a clear owner.

Without a mediator:

```js
class A {
    handle() {
        this.b.update();
        this.c.refresh();
    }
}
```

```js
class B {
    handle() {
        this.a.update();
        this.c.refresh();
    }
}
```

```js
class C {
    handle() {
        this.a.update();
        this.b.refresh();
    }
}
```

Each object participates in the coordination rules.

With a mediator:

```js
class Mediator {
    notify(sender, event) {
        // coordination rules
    }
}
```

The participants retain their local responsibilities while the mediator owns the relationships between them.

This is particularly valuable when the interaction rules themselves are complex enough to deserve a separate
abstraction.

## Reducing Coupling

Mediator reduces coupling by changing the dependency structure between participants.

A participant does not need to know:

* which other participants exist;
* how those participants are implemented;
* which participants must react to an event;
* in what order they should react;
* which conditions determine whether they should react;
* how a multi-participant operation should be coordinated.

Instead, it communicates with the mediator.

This makes individual participants easier to reuse because their collaboration dependencies are no longer hard-coded
into them.

The coupling does not disappear. It is **concentrated in the mediator**.

That distinction is important. A mediator trades distributed coupling for centralized coordination.

## Interaction Ownership

The mediator should own behavior that exists primarily because multiple participants must cooperate.

Consider a checkout process involving:

* cart;
* inventory;
* pricing;
* promotion;
* payment;
* shipping;
* notification.

The individual components may each have well-defined responsibilities. The sequence and conditions connecting them are a
separate concern.

A mediator can own that coordination:

```js
class CheckoutMediator {
    async checkout(order) {
        await this.inventory.reserve(order);

        const price = await this.pricing.calculate(order);
        const discounted = await this.promotions.apply(order, price);

        await this.payment.charge(order.customer, discounted);
        await this.shipping.schedule(order);

        await this.notifications.sendConfirmation(order);
    }
}
```

The mediator does not need to implement inventory management, payment processing, or shipping. It coordinates those
participants.

## Event-Based Mediation

A common implementation uses notifications from participants.

```js
class ChatMediator {
    constructor() {
        this.users = new Set();
    }

    addUser(user) {
        this.users.add(user);
        user.setMediator(this);
    }

    send(sender, message) {
        for (const user of this.users) {
            if (user !== sender) {
                user.receive(message);
            }
        }
    }
}
```

Participants communicate through the mediator:

```js
class User {
    setMediator(mediator) {
        this.mediator = mediator;
    }

    send(message) {
        this.mediator.send(this, message);
    }

    receive(message) {
        console.log(message);
    }
}
```

The mediator decides how the interaction occurs.

It can therefore implement policies such as filtering, routing, validation, ordering, suppression, authorization, or
transformation without requiring every participant to know about those policies.

## Explicit Interaction Methods

The mediator does not have to expose a generic `notify()` method.

For complex collaborations, explicit methods can make the interaction contract clearer.

```js
class FormMediator {
    usernameChanged(value) {
        this.usernameValidator.validate(value);
        this.submitButton.update();
    }

    passwordChanged(value) {
        this.passwordValidator.validate(value);
        this.submitButton.update();
    }

    submit() {
        return this.authenticationService.authenticate(
            this.usernameField.value,
            this.passwordField.value
        );
    }
}
```

Explicit methods are often preferable when the mediator represents a meaningful application-level interaction.

A generic notification method is useful when participants emit heterogeneous events and the mediator is intentionally
event-driven.

## Mediator as a Coordination Boundary

A mediator can serve as an explicit boundary around a collaboration.

This can be useful when a set of objects forms a coherent interaction subsystem but the individual objects should not
depend on one another.

For example:

```js
class OrderMediator {
    constructor({
                    pricing,
                    inventory,
                    payment,
                    shipping
                }) {
        this.pricing = pricing;
        this.inventory = inventory;
        this.payment = payment;
        this.shipping = shipping;
    }

    async place(order) {
        const total = await this.pricing.calculate(order);

        await this.inventory.reserve(order);
        await this.payment.charge(order.customer, total);
        await this.shipping.schedule(order);
    }
}
```

The mediator establishes the collaboration boundary while the participating services remain independently replaceable.

## Mediator and Dependency Direction

Mediator changes where dependencies are expressed.

Instead of:

```text
Component A -> Component B
Component A -> Component C
Component B -> Component C
```

the conceptual dependency becomes:

```text
Component A -> Mediator
Component B -> Mediator
Component C -> Mediator
```

These relationships are expressed here only conceptually; the important design property is that colleagues depend on the
coordination abstraction rather than directly depending on one another.

This can substantially reduce the number of direct dependencies in a collaboration.

## Registration and Dynamic Participants

A mediator can support participants being registered dynamically.

```js
class Mediator {
    constructor() {
        this.participants = new Set();
    }

    register(participant) {
        this.participants.add(participant);
        participant.mediator = this;
    }

    unregister(participant) {
        this.participants.delete(participant);
    }

    notify(sender, event) {
        for (const participant of this.participants) {
            if (participant !== sender) {
                participant.handle(event);
            }
        }
    }
}
```

Dynamic registration is useful when participants are created and destroyed during the lifetime of the collaboration.

However, the mediator must define lifecycle semantics clearly. A participant that remains registered after it has been
destroyed can cause memory retention, stale callbacks, or unexpected interaction.

## Direct References Versus Registration

A mediator does not necessarily need a collection of every participant.

For a fixed collaboration, explicit references can be clearer:

```js
class DialogMediator {
    constructor({
                    usernameField,
                    passwordField,
                    submitButton
                }) {
        this.usernameField = usernameField;
        this.passwordField = passwordField;
        this.submitButton = submitButton;
    }
}
```

For dynamic systems, registration may be more appropriate.

The choice depends on whether the participant set is structurally fixed or dynamically extensible.

## Ordering

When a mediator coordinates multiple operations, ordering becomes part of its responsibility.

```js
class ImportMediator {
    async import(data) {
        const parsed = this.parser.parse(data);
        const validated = this.validator.validate(parsed);

        await this.repository.save(validated);
        await this.index.update(validated);
        await this.notifier.publish(validated);
    }
}
```

The mediator establishes the sequence in which participants interact.

If operations can be performed independently, the mediator may coordinate them concurrently:

```js
await Promise.all([
    this.cache.invalidate(key),
    this.index.update(record),
    this.audit.log(record)
]);
```

The distinction between sequential and concurrent coordination should be explicit because it affects consistency,
failure handling, and observable behavior.

## Failure Handling

When a mediator coordinates multiple operations, it must define what happens when one operation fails.

For example:

```js
class RegistrationMediator {
    async register(user) {
        await this.account.create(user);

        try {
            await this.email.sendWelcome(user);
        } catch (error) {
            await this.account.markNotificationFailure(user);
            throw error;
        }
    }
}
```

The mediator can coordinate compensating actions, retries, fallbacks, or error propagation.

It should not silently absorb failures merely because it is responsible for coordination.

## Transactions and Consistency

A mediator may coordinate operations that need transactional consistency.

For example:

```js
class TransferMediator {
    async transfer(from, to, amount) {
        await this.accounts.debit(from, amount);

        try {
            await this.accounts.credit(to, amount);
        } catch (error) {
            await this.accounts.credit(from, amount);
            throw error;
        }
    }
}
```

In distributed systems, the mediator cannot assume that multiple operations form an atomic transaction.

The coordination mechanism may instead require:

* compensation;
* idempotency;
* retries;
* durable workflow state;
* transactional messaging;
* saga-style coordination.

Mediator therefore concerns the organization of interaction, not the guarantee of atomicity.

## Asynchronous Coordination

Mediator works naturally with asynchronous participants.

```js
class UploadMediator {
    async upload(file) {
        const metadata = await this.metadata.extract(file);
        const stored = await this.storage.save(file);

        await this.index.add({
            ...metadata,
            location: stored.location
        });

        await this.events.publish({
            type: "file.uploaded",
            file: stored
        });
    }
}
```

The mediator can coordinate promises, asynchronous iterators, event sources, queues, and remote services.

The same design concerns remain: ordering, cancellation, retries, timeout behavior, and failure propagation.

## Cancellation

Long-running coordinated operations may require cancellation.

```js
class ImportMediator {
    async import(data, signal) {
        signal?.throwIfAborted();

        const parsed = await this.parser.parse(data, {signal});

        signal?.throwIfAborted();

        await this.repository.save(parsed, {signal});
    }
}
```

A mediator that coordinates cancellable operations should establish whether cancellation propagates to every participant
or only stops future coordination.

## State in the Mediator

A mediator may be stateless or stateful.

A stateless mediator simply coordinates current interactions:

```js
class Mediator {
    async execute(request) {
        const result = await this.service.execute(request);
        return this.transformer.transform(result);
    }
}
```

A stateful mediator may maintain workflow state:

```js
class WorkflowMediator {
    constructor() {
        this.state = "idle";
    }

    async start() {
        this.state = "running";

        try {
            await this.execute();
            this.state = "completed";
        } catch (error) {
            this.state = "failed";
            throw error;
        }
    }
}
```

Once the mediator owns substantial lifecycle state, its design begins to overlap with workflow orchestration or
state-machine concerns. The state should exist because the collaboration requires it, not simply because the mediator
has become a convenient place to store unrelated data.

## Mediator and Observer

Mediator and Observer can both involve notifications, but they solve different problems.

Observer establishes a one-to-many dependency in which observers are notified when a subject changes.

Mediator establishes a coordination relationship in which a central object decides how multiple participants interact.

For example, this is primarily Observer:

```js
subject.subscribe(observer);
subject.notify();
```

This is primarily Mediator:

```js
mediator.notify(sender, event);
```

where the mediator decides which other participants should react and what interaction should occur.

A mediator can internally use Observer mechanisms. The mechanisms are not the pattern's defining intent.

## Mediator and Facade

Facade provides a simplified interface to a subsystem.

Mediator coordinates interaction between participants.

A facade answers:

**How can a client use this complex subsystem more simply?**

A mediator answers:

**How should these participating objects interact with one another?**

A facade may internally use a mediator, and a mediator may expose a simplified interface, but their primary
responsibilities remain different.

## Mediator and Command

Command encapsulates a request as an object.

Mediator coordinates participants.

A mediator can create, execute, queue, or dispatch Command objects, but Command is concerned with representing the
request itself.

```js
class Command {
    execute() {
    }
}

class Mediator {
    submit(command) {
        return command.execute();
    }
}
```

The mediator determines how participants collaborate; the command represents an operation.

## Mediator and Chain of Responsibility

Chain of Responsibility passes a request through handlers that may assume responsibility for it.

Mediator does not require a linear handler sequence or a decision about which handler should handle a request.

A mediator can invoke several participants, invoke them conditionally, or coordinate them in a specific sequence.

Chain focuses on **responsibility selection**.

Mediator focuses on **collaboration coordination**.

## Mediator and State

State changes an object's behavior according to its internal state.

A mediator may itself have state, but that does not make it a State pattern implementation.

If the important design problem is that an object behaves differently depending on whether it is authenticated,
processing, suspended, or completed, State may be appropriate.

If the important problem is that several objects must coordinate differently based on their interactions, Mediator may
be appropriate.

The two patterns can also be combined.

## Mediator and Strategy

Strategy encapsulates interchangeable algorithms.

Mediator coordinates participants.

A mediator may select a strategy while coordinating a collaboration:

```js
class PricingMediator {
    constructor(strategy) {
        this.strategy = strategy;
    }

    calculate(order) {
        return this.strategy.calculate(order);
    }
}
```

The strategy owns the algorithm. The mediator owns the collaboration surrounding it.

## Mediator and Dependency Injection

Dependency injection is frequently useful when constructing a mediator.

```js
const mediator = new CheckoutMediator({
    inventory,
    pricing,
    payment,
    shipping
});
```

The mediator does not need to construct the services it coordinates.

This separates composition from coordination and makes the mediator easier to test with substitutes.

## Mediator and Event Systems

JavaScript applications often implement mediation through event mechanisms.

```js
class UIEventMediator {
    constructor() {
        this.handlers = new Map();
    }

    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }

        this.handlers.get(event).add(handler);
    }

    emit(event, payload) {
        for (const handler of this.handlers.get(event) ?? []) {
            handler(payload);
        }
    }
}
```

However, a generic event bus is not automatically a Mediator.

An event bus primarily provides message publication and subscription. A mediator has explicit knowledge of the
collaboration it coordinates and contains rules governing participant interaction.

The distinction is architectural rather than syntactic.

## TypeScript

TypeScript can make the mediator contract explicit.

```ts
interface Mediator {
    notify(sender: Colleague, event: string): void;
}

interface Colleague {
    setMediator(mediator: Mediator): void;
}
```

A concrete mediator can narrow the participant types:

```ts
interface Editor {
    getContent(): string;
}

interface Preview {
    render(content: string): void;
}

class EditorMediator {
    constructor(
        private readonly editor: Editor,
        private readonly preview: Preview
    ) {
    }

    editorChanged(): void {
        this.preview.render(this.editor.getContent());
    }
}
```

TypeScript interfaces are especially useful when participants should depend on a narrow mediator contract rather than
the concrete mediator implementation.

## Generic Event Contracts

For event-driven mediation, a typed event map can prevent invalid events.

```ts
interface Events {
    usernameChanged: string;
    passwordChanged: string;
    submitted: void;
}

class Mediator<E extends Record<string, unknown>> {
    private handlers = new Map<
        keyof E,
        Set<(payload: E[keyof E]) => void>
    >();

    emit<K extends keyof E>(event: K, payload: E[K]): void {
        for (const handler of this.handlers.get(event) ?? []) {
            handler(payload);
        }
    }
}
```

In a production implementation, the handler storage may require additional generic machinery to preserve the exact
relationship between event keys and payload types. The important design principle is that the mediator contract should
reflect the actual collaboration rather than reducing everything to untyped strings.

## Functional Mediators

Mediator does not require classes.

A closure can encapsulate collaboration rules:

```js
function createCheckoutMediator({
                                    inventory,
                                    pricing,
                                    payment
                                }) {
    return {
        async checkout(order) {
            const total = await pricing.calculate(order);

            await inventory.reserve(order);
            await payment.charge(order.customer, total);

            return total;
        }
    };
}
```

Functions, closures, modules, and objects can all implement the pattern.

The pattern is about responsibility and collaboration structure, not inheritance or class syntax.

## UI Coordination

User interfaces are a common application of Mediator.

A form can contain controls whose behavior depends on other controls:

```js
class FormMediator {
    constructor({
                    emailField,
                    passwordField,
                    submitButton,
                    errorMessage
                }) {
        this.emailField = emailField;
        this.passwordField = passwordField;
        this.submitButton = submitButton;
        this.errorMessage = errorMessage;
    }

    validate() {
        const valid =
            this.emailField.isValid() &&
            this.passwordField.isValid();

        this.submitButton.setEnabled(valid);

        if (valid) {
            this.errorMessage.clear();
        }
    }
}
```

The controls do not need to know how every other control works.

The mediator becomes the owner of the form-level interaction rules.

## Application-Level Coordination

Mediator can also appear above individual UI components.

An application service or workflow coordinator can coordinate multiple domain or infrastructure services:

```js
class AccountRegistrationMediator {
    constructor({
                    accounts,
                    profiles,
                    email,
                    audit
                }) {
        this.accounts = accounts;
        this.profiles = profiles;
        this.email = email;
        this.audit = audit;
    }

    async register(input) {
        const account = await this.accounts.create(input);

        await this.profiles.create({
            accountId: account.id,
            name: input.name
        });

        await this.email.sendWelcome(account);
        await this.audit.record("account.created", account.id);

        return account;
    }
}
```

This resembles an application service because application services frequently coordinate use cases.

The name of the class is not what determines the pattern. The relevant question is whether the abstraction exists
primarily to encapsulate the collaboration among participants.

## Distributed Systems

In distributed systems, mediator-like coordination can exist between services.

A coordinator may receive an operation and orchestrate calls to several services:

```js
class OrderCoordinator {
    async create(order) {
        const reservation =
            await this.inventory.reserve(order);

        try {
            const payment =
                await this.payment.authorize(order);

            await this.shipping.create(order);

            return {
                reservation,
                payment
            };
        } catch (error) {
            await this.inventory.release(reservation);
            throw error;
        }
    }
}
```

At this scale, the design may more specifically be called an orchestrator or workflow coordinator.

Mediator remains useful as the underlying design concept, but distributed coordination introduces additional concerns
such as durability, retries, idempotency, timeouts, compensation, partial failure, and observability.

## Mediator Granularity

A mediator should have a meaningful collaboration boundary.

A mediator that coordinates two trivial objects may add unnecessary indirection:

```js
class Mediator {
    connect(a, b) {
        a.connect(b);
    }
}
```

There is little value if the mediator merely forwards calls without encapsulating meaningful interaction logic.

A useful mediator generally exists because the collaboration itself has enough complexity, volatility, or coupling to
justify independent representation.

## Mediator Explosion

Centralization can become harmful when too much behavior accumulates in one mediator.

A mediator can gradually become a god object that knows:

* every participant;
* every business rule;
* every workflow;
* every validation rule;
* every persistence detail;
* every UI detail;
* every error-handling policy.

At that point, the mediator has become a new coupling hotspot.

The solution is not necessarily to eliminate mediation. Instead, separate distinct collaboration boundaries.

```js
class PaymentCoordinator {
    // payment collaboration
}

class NotificationCoordinator {
    // notification collaboration
}

class OrderCoordinator {
    // order-level collaboration
}
```

Each mediator should represent a coherent interaction context.

## Cohesion

The mediator should have high cohesion around collaboration.

A useful test is:

**Can the rules contained in the mediator be explained as one coherent set of interactions between a recognizable group
of participants?**

If not, the mediator may be aggregating unrelated responsibilities.

A mediator that coordinates a form is cohesive when its operations explain how the form controls interact.

A mediator that simultaneously coordinates UI controls, database migrations, email templates, logging configuration, and
unrelated background jobs is not.

## Stability and Change

Mediator is particularly useful when the relationships between participants change frequently.

Suppose several UI controls repeatedly change how they interact. Without a mediator, each participant may require
modification.

With a mediator, the interaction rules can change centrally:

```js
class FormMediator {
    passwordChanged(password) {
        this.passwordStrength.update(password);
        this.confirmPassword.update(password);
        this.submitButton.update();
    }
}
```

The participants can remain stable while collaboration rules evolve.

This is especially useful when the participants themselves are reused in different collaborations.

## Reuse of Participants

A participant becomes easier to reuse when it does not contain assumptions about specific collaborators.

```js
class SearchField {
    constructor(mediator) {
        this.mediator = mediator;
    }

    setValue(value) {
        this.value = value;
        this.mediator.searchChanged(value);
    }
}
```

The same search field can participate in different dialogs or applications with different mediators.

The collaboration-specific behavior stays outside the participant.

## Testing

Mediator makes collaboration rules independently testable.

```js
test("enables submission when the form becomes valid", () => {
    const submitButton = {
        setEnabled: jest.fn()
    };

    const mediator = new FormMediator({
        emailField: {
            isValid: () => true
        },
        passwordField: {
            isValid: () => true
        },
        submitButton,
        errorMessage: {
            clear: jest.fn()
        }
    });

    mediator.validate();

    expect(submitButton.setEnabled)
        .toHaveBeenCalledWith(true);
});
```

Tests can focus on interaction behavior without requiring every participant to be fully implemented.

Mediator tests should primarily verify collaboration rules rather than re-test the internal behavior of every
participant.

## Observability

Because interaction logic is centralized, a mediator can provide a useful observation point.

```js
class OrderMediator {
    async place(order) {
        const start = performance.now();

        try {
            return await this.execute(order);
        } finally {
            console.log(
                "order workflow duration",
                performance.now() - start
            );
        }
    }
}
```

Logging, tracing, metrics, correlation identifiers, and workflow diagnostics can therefore be applied at the
coordination boundary.

Observability should remain separate from core coordination logic when it becomes substantial. Decorator-style wrappers,
middleware, instrumentation libraries, or tracing infrastructure may be more appropriate.

## Security Boundaries

A mediator can enforce interaction-level authorization.

```js
class AccountMediator {
    async deleteAccount(actor, accountId) {
        if (!actor.permissions.includes("account.delete")) {
            throw new Error("Forbidden");
        }

        return this.accounts.delete(accountId);
    }
}
```

This can be useful when authorization depends on the interaction rather than on an individual participant.

However, a mediator should not become the sole security mechanism when participants can be reached through other paths.
Security invariants that must always hold should be enforced at the appropriate domain or resource boundary as well.

## Refactoring Toward Mediator

A system is a candidate for Mediator when several objects have increasingly complex mutual dependencies.

Typical warning signs include:

* participants contain many references to other participants;
* changing one participant requires changes to several others;
* interaction rules are duplicated across participants;
* collaboration order is distributed across multiple classes;
* participants contain behavior that exists primarily to coordinate other objects;
* reusable components cannot be reused because they are coupled to specific collaborators;
* integration logic is difficult to test independently.

A refactoring can extract that coordination into a mediator:

```js
class A {
    constructor(mediator) {
        this.mediator = mediator;
    }

    changed() {
        this.mediator.aChanged();
    }
}
```

```js
class B {
    constructor(mediator) {
        this.mediator = mediator;
    }

    changed() {
        this.mediator.bChanged();
    }
}
```

```js
class Mediator {
    aChanged() {
        // coordinate the consequences
    }

    bChanged() {
        // coordinate the consequences
    }
}
```

The goal is not simply to move methods from several classes into one larger class. The extracted methods should
represent genuine interaction logic.

## When Not to Use Mediator

Do not introduce a mediator merely because multiple objects communicate.

Direct collaboration is often preferable when:

* there are only a few participants;
* dependencies are stable;
* interactions are simple;
* the relationships are intrinsic to the domain;
* the mediator would merely forward calls;
* the mediator would obscure straightforward dependencies.

For example:

```js
order.calculateTotal();
```

does not become better simply because the call is routed through a mediator.

The abstraction should solve an actual coupling or coordination problem.

## Benefits

Mediator provides several important benefits:

1. It reduces direct coupling between collaborating objects.
2. It centralizes interaction rules.
3. It makes collaboration behavior independently testable.
4. It allows participants to be reused in different collaborations.
5. It gives complex interactions an explicit architectural owner.
6. It can simplify changes to collaboration rules.
7. It can provide a natural boundary for workflow-level observability and policy.

## Costs

Mediator also introduces costs:

1. The mediator can become a central coupling hotspot.
2. Complex mediators can become difficult to understand.
3. Centralized coordination can hide important relationships if poorly designed.
4. Changes to many interactions may converge on the same class.
5. The mediator may accumulate unrelated responsibilities over time.
6. Debugging can require following indirect communication through the mediator.
7. Generic event-based mediators can become difficult to type and reason about.

The pattern therefore trades **distributed coupling for centralized coordination**.

## Decision Criteria

Mediator is appropriate when the following conditions are present:

1. Several objects participate in a non-trivial collaboration.
2. Those objects have too many direct dependencies on one another.
3. Interaction rules are distributed across participants.
4. The collaboration has a coherent boundary.
5. The interaction logic changes independently from the participants themselves.
6. Centralizing the collaboration would improve maintainability more than it would increase mediator complexity.

The strongest signal is not simply “many objects communicate.” It is that **the interaction between the objects has
become a distinct responsibility of its own**.

## Summary

Mediator encapsulates the interaction logic between a group of collaborating objects.

Its primary purpose is to reduce direct coupling between participants by giving their collaboration an explicit owner.
Participants maintain their own state and local responsibilities while the mediator determines how their actions affect
one another.

Mediator is distinct from Facade because Facade simplifies access to a subsystem for clients. It is distinct from
Observer because Observer establishes notification relationships rather than centralizing collaboration rules. It is
distinct from Command because Command represents a request rather than coordinating participants. It is distinct from
Chain of Responsibility because Chain distributes responsibility across handlers rather than coordinating a
collaboration. It is distinct from State because State changes an object's behavior according to its state.

In JavaScript, Mediator can be implemented with classes, objects, functions, closures, event mechanisms, or
application-level coordinators. The implementation mechanism is secondary. The defining characteristic is the
architectural responsibility: **encapsulating how a set of objects interact so that the participants themselves do not
need to manage those relationships directly.**

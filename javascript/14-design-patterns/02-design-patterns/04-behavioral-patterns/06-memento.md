# Memento

## Intent

**Memento captures and externalizes an object's internal state without violating encapsulation, so that the object can
later be restored to that state.**

The pattern is primarily concerned with checkpointing and restoration. A common application is undo functionality, but
Memento can also represent snapshots, checkpoints, rollback points, drafts, recovery states, and temporary state
preservation.

The important property is that the object whose state is being captured does not need to expose its internal
representation to the object responsible for storing the snapshot.

## Problem

An object may have complex internal state that must occasionally be saved so it can later be restored.

For example, an editor might maintain:

```js
class Editor {
    constructor() {
        this.content = "";
        this.cursor = 0;
        this.selection = null;
    }

    type(text) {
        this.content =
            this.content.slice(0, this.cursor) +
            text +
            this.content.slice(this.cursor);

        this.cursor += text.length;
    }
}
```

An undo mechanism needs to preserve enough state to restore the editor.

A naive implementation might expose the internal state:

```js
editor.getState();
editor.setState(state);
```

This can expose representation details that should remain private.

It also creates a dependency between the state manager and the internal structure of the editor. If the editor changes
how it represents its state, the external state manager may need to change as well.

Memento moves responsibility for creating and restoring the state representation back to the object that owns that
state.

## Structure

The classic pattern has three participants:

* Originator — the object whose state is being captured and restored.
* Memento — an opaque representation of the Originator's saved state.
* Caretaker — the object that stores and manages Mementos without interpreting their contents.

The Originator creates a Memento from its current state and later restores itself from a Memento.

The Caretaker maintains the history but should not need to understand the internal state contained in each Memento.

```js
class Editor {
    #content = "";
    #cursor = 0;

    createMemento() {
        return new EditorMemento(
            this.#content,
            this.#cursor
        );
    }

    restore(memento) {
        this.#content = memento.content;
        this.#cursor = memento.cursor;
    }

    type(text) {
        this.#content =
            this.#content.slice(0, this.#cursor) +
            text +
            this.#content.slice(this.#cursor);

        this.#cursor += text.length;
    }
}

class EditorMemento {
    constructor(content, cursor) {
        this.content = content;
        this.cursor = cursor;
    }
}
```

The example demonstrates the basic relationship, although stronger encapsulation can prevent arbitrary consumers from
constructing or inspecting Mementos.

## Originator

The Originator owns the state being captured.

It knows:

* which state must be saved;
* how to create a snapshot;
* how to interpret its own snapshot;
* how to restore itself from a snapshot.

```js
class Document {
    constructor() {
        this.content = "";
        this.selection = null;
    }

    save() {
        return new DocumentMemento(
            this.content,
            this.selection
        );
    }

    restore(memento) {
        this.content = memento.content;
        this.selection = memento.selection;
    }
}
```

The Originator is responsible for understanding the Memento's representation.

This is important because it preserves representation independence between the Originator and the Caretaker.

## Memento

A Memento contains the saved state required for restoration.

Conceptually, it should be opaque to the Caretaker.

```js
class DocumentMemento {
    constructor(content, selection) {
        this.content = content;
        this.selection = selection;
    }
}
```

In a stronger design, the Memento's internal state should not be publicly mutable.

```js
class DocumentMemento {
    #content;
    #selection;

    constructor(content, selection) {
        this.#content = content;
        this.#selection = selection;
    }

    getContent() {
        return this.#content;
    }

    getSelection() {
        return this.#selection;
    }
}
```

Even this is not completely opaque because the getters expose the representation. The classic design instead relies on
access control mechanisms so that only the Originator can access the Memento's internal representation.

JavaScript does not provide friendship between classes, so practical implementations commonly use closures, modules,
private fields, symbols, or carefully controlled APIs.

## Caretaker

The Caretaker stores Mementos and determines when they are saved or restored.

It should not need to understand their contents.

```js
class History {
    #states = [];

    push(memento) {
        this.#states.push(memento);
    }

    pop() {
        return this.#states.pop();
    }
}
```

The Caretaker can therefore maintain arbitrary history:

```js
const history = new History();

history.push(editor.createMemento());
editor.type("Hello");

history.push(editor.createMemento());
editor.type(" World");
```

The history mechanism does not need to know what an editor state means.

## Encapsulation

Encapsulation is central to Memento.

The snapshot should preserve the Originator's representation without requiring that representation to become part of the
Originator's public API.

For example, suppose an editor internally changes from:

```js
{
    content: "hello",
        cursor
:
    5
}
```

to:

```js
{
    document: {
        text: "hello"
    }
,
    selection: {
        start: 5,
            end
    :
        5
    }
}
```

The Caretaker should not need to change.

The Originator controls both snapshot creation and restoration, so the internal representation can evolve independently.

## Snapshot Boundaries

The Originator must decide what constitutes restorable state.

A snapshot might include:

```js
{
    content,
        cursor,
        selection,
        formatting,
        scrollPosition
}
```

It may deliberately exclude:

* caches;
* derived values;
* open network connections;
* active timers;
* external resource handles;
* transient instrumentation;
* runtime-only objects.

The goal is not necessarily to capture every property. It is to capture the state required to reproduce the intended
logical state.

## Complete Versus Partial State

A Memento can capture complete or partial state.

Complete state:

```js
class Editor {
    save() {
        return {
            content: this.content,
            cursor: this.cursor,
            selection: this.selection,
            mode: this.mode
        };
    }
}
```

Partial state:

```js
class Editor {
    save() {
        return {
            content: this.content,
            cursor: this.cursor
        };
    }
}
```

Partial snapshots are appropriate when omitted state is derived or intentionally not restorable.

However, restoration must preserve the object's invariants. If restoring only part of the state can leave the object
inconsistent, the snapshot is incomplete for that restoration boundary.

## Immutable Mementos

Mementos should generally be immutable after creation.

```js
class EditorMemento {
    constructor(content, cursor) {
        this.content = content;
        this.cursor = cursor;

        Object.freeze(this);
    }
}
```

Immutability prevents historical state from being accidentally modified after it has been stored.

For nested structures, shallow freezing may not be sufficient.

```js
const snapshot = {
    content,
    selection: {
        start,
        end
    }
};
```

If `selection` remains mutable, the supposedly immutable snapshot can still change.

Deep immutability, immutable data structures, defensive copying, or serialization may therefore be necessary depending
on the state.

## Aliasing

Snapshot correctness can be broken by shared mutable references.

Consider:

```js
class Cart {
    save() {
        return new CartMemento(this.items);
    }
}
```

If `this.items` is mutable and the Memento retains the same array, later mutations can modify the supposedly historical
state.

A safer implementation copies the structure:

```js
class Cart {
    save() {
        return new CartMemento([...this.items]);
    }
}
```

For nested objects, a deeper copy may be necessary.

The correct strategy depends on the ownership and mutability semantics of the state.

## Value Objects

Immutable value objects simplify Memento implementations.

```js
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        Object.freeze(this);
    }
}
```

If an Originator's state consists largely of immutable values, a Memento can safely retain references to those values.

This reduces copying while preserving snapshot semantics.

## Deep Copy

Deep copying is one way to create an independent snapshot.

```js
class StateMemento {
    constructor(state) {
        this.state = structuredClone(state);
    }
}
```

`structuredClone()` is useful for many structured data values, but it is not a universal serialization mechanism.
Functions, external resources, class semantics, and certain host objects require different treatment.

The Originator should define the snapshot representation explicitly rather than assuming arbitrary object cloning is
sufficient.

## Serialization

A Memento may use a serializable representation.

```js
class Document {
    save() {
        return JSON.stringify({
            content: this.content,
            cursor: this.cursor
        });
    }

    restore(snapshot) {
        const state = JSON.parse(snapshot);

        this.content = state.content;
        this.cursor = state.cursor;
    }
}
```

Serialization is useful when snapshots need to cross process boundaries, be persisted, or be transmitted.

However, serialization changes the semantics of the Memento. It introduces concerns such as:

* schema versioning;
* compatibility;
* validation;
* data size;
* security;
* encoding;
* migration.

A serialized snapshot is therefore not automatically equivalent to an in-memory Memento.

## Snapshot Versioning

Persistent Mementos may outlive the code version that created them.

For example:

```js
{
    version: 2,
        content
:
    "Hello",
        cursor
:
    5
}
```

The Originator can migrate older snapshots:

```js
restore(snapshot)
{
    const state = this.migrate(snapshot);

    this.content = state.content;
    this.cursor = state.cursor;
}
```

Versioning becomes important when snapshots are persisted across deployments.

Without a versioning strategy, internal representation changes can make old snapshots impossible to restore.

## Undo

Undo is one of the most common applications of Memento.

```js
class EditorHistory {
    constructor(editor) {
        this.editor = editor;
        this.history = [];
    }

    save() {
        this.history.push(this.editor.createMemento());
    }

    undo() {
        const snapshot = this.history.pop();

        if (snapshot) {
            this.editor.restore(snapshot);
        }
    }
}
```

The Caretaker stores previous states while the Originator controls how those states are created and restored.

For a typical undo stack, the Caretaker may also need to maintain a separate redo stack.

## Redo

Redo requires retaining states that were undone.

```js
class History {
    constructor(editor) {
        this.editor = editor;
        this.undoStack = [];
        this.redoStack = [];
    }

    save() {
        this.undoStack.push(this.editor.createMemento());
        this.redoStack.length = 0;
    }

    undo() {
        const current = this.editor.createMemento();
        const previous = this.undoStack.pop();

        if (!previous) {
            return;
        }

        this.redoStack.push(current);
        this.editor.restore(previous);
    }

    redo() {
        const current = this.editor.createMemento();
        const next = this.redoStack.pop();

        if (!next) {
            return;
        }

        this.undoStack.push(current);
        this.editor.restore(next);
    }
}
```

The important detail is that restoration itself does not necessarily create a new history entry. The history manager
must explicitly control how undo and redo affect the stacks.

## History Limits

Unbounded snapshot history can consume substantial memory.

A Caretaker can impose a limit:

```js
class History {
    constructor(limit = 100) {
        this.limit = limit;
        this.states = [];
    }

    push(state) {
        this.states.push(state);

        if (this.states.length > this.limit) {
            this.states.shift();
        }
    }
}
```

History policies may instead be based on:

* maximum number of snapshots;
* maximum memory;
* time;
* operation count;
* checkpoints;
* user-visible milestones.

The appropriate policy depends on the cost and importance of historical state.

## Full Snapshots Versus Deltas

Memento commonly stores complete snapshots.

```js
snapshot = {
    content: "Hello World"
};
```

An alternative is to store changes:

```js
operation = {
    type: "insert",
    position: 5,
    value: " World"
};
```

Delta-based history can reduce memory consumption, but restoration becomes more complex.

The system may need to replay a sequence of operations:

```js
for (const operation of history) {
    apply(operation);
}
```

A hybrid approach can periodically create full snapshots and store deltas between them.

Memento does not require a particular representation. The defining concern is that the saved representation allows the
Originator to restore the required state.

## Memento and Command

Command and Memento frequently appear together in undo systems, but they represent different concepts.

Command encapsulates an operation:

```js
class InsertTextCommand {
    execute(editor) {
        editor.insert("Hello");
    }
}
```

Memento encapsulates state:

```js
const snapshot = editor.createMemento();
```

Command-based undo can reverse an operation:

```js
command.execute();
command.undo();
```

Memento-based undo can restore a previous state:

```js
editor.restore(snapshot);
```

A Command can use a Memento to implement undo:

```js
class Command {
    execute(editor) {
        this.before = editor.createMemento();
        editor.performOperation();
    }

    undo(editor) {
        editor.restore(this.before);
    }
}
```

The patterns are complementary, not interchangeable.

## Memento and Prototype

Prototype creates a new object based on an existing object.

Memento captures state for later restoration.

A clone may therefore be used internally to construct a Memento, but the purposes are different.

Prototype answers:

**How do I create another object based on this object?**

Memento answers:

**How do I preserve this object's state so it can later return to it?**

## Memento and State

State represents the behavior associated with an object's current state.

Memento preserves a state for later restoration.

For example, an application might use State objects to represent:

```js
IdleState
RunningState
PausedState
CompletedState
```

A Memento could capture which state the object is currently in along with its other data:

```js
class WorkflowMemento {
    constructor(status, data) {
        this.status = status;
        this.data = data;
    }
}
```

State determines current behavior. Memento preserves state.

## Memento and Event Sourcing

Event Sourcing stores a sequence of domain events as the authoritative history of state changes.

Memento stores snapshots of state for later restoration.

The two can be combined:

* events provide the history;
* snapshots accelerate reconstruction;
* a snapshot provides a checkpoint from which later events can be replayed.

A Memento should not therefore be confused with an event log.

A snapshot records **state**.

An event records **a fact about a state transition**.

## Checkpoints

Memento is useful for checkpointing long-running operations.

```js
class ImportProcess {
    saveCheckpoint() {
        return new ImportMemento({
            processed: this.processed,
            failures: [...this.failures]
        });
    }

    restoreCheckpoint(snapshot) {
        this.processed = snapshot.processed;
        this.failures = [...snapshot.failures];
    }
}
```

A checkpoint can allow an operation to resume from a known state rather than starting again.

This is particularly useful when operations are expensive or interruptible.

## Drafts

Memento can represent temporary user-visible drafts.

```js
class Document {
    createDraft() {
        return new DocumentMemento({
            content: this.content,
            title: this.title
        });
    }
}
```

The snapshot can be stored independently and restored later.

Persistent drafts require the same versioning, validation, compatibility, and security considerations as other persisted
snapshots.

## Database State

A Memento-like snapshot can represent application state that must be restored after a failure.

However, restoring application memory is not equivalent to rolling back external side effects.

If an object has:

```js
this.balance = 100;
```

and also performed:

```js
await paymentService.charge(50);
```

restoring the in-memory balance does not undo the external payment.

Memento therefore works best when the captured state has a well-defined ownership boundary.

External effects require their own compensation or transactional mechanism.

## Resource Ownership

Resources such as file handles, sockets, database connections, timers, and locks generally should not be blindly stored
in a Memento.

For example:

```js
{
    connection: databaseConnection
}
```

does not necessarily represent meaningful restorable state.

The Memento should capture the logical state needed to reconstruct the resource relationship:

```js
{
    databaseId,
        transactionPosition
}
```

if such a representation is actually valid.

Restoration should reacquire or reconstruct resources rather than assuming a historical resource object remains valid.

## Concurrency

Memento must account for concurrent modifications.

Suppose an object creates a snapshot while another asynchronous operation is modifying its state. The snapshot must
represent a coherent state.

Possible approaches include:

* synchronization;
* immutable state;
* transactional updates;
* version checks;
* copy-on-write;
* serialized mutation.

Without a defined consistency boundary, a Memento may represent a combination of values that never existed as a valid
logical state.

## Optimistic Concurrency

A Memento can contain a version identifier:

```js
class DocumentMemento {
    constructor(version, content) {
        this.version = version;
        this.content = content;
    }
}
```

Restoration can then verify that the snapshot applies to the expected version:

```js
restore(snapshot)
{
    if (snapshot.version > this.version) {
        throw new Error("Invalid snapshot");
    }

    this.content = snapshot.content;
    this.version = snapshot.version;
}
```

The exact policy depends on the application's consistency model.

## Memory and Performance

Full snapshots can be expensive when state is large.

Consider an editor with a 10 MB document and 1,000 historical states. Naively retaining every complete document can
require substantial memory.

Potential optimizations include:

* structural sharing;
* persistent data structures;
* compression;
* deltas;
* periodic checkpoints;
* bounded history;
* lazy snapshot creation.

Optimization should preserve the semantic guarantee that a snapshot represents a stable historical state.

## Structural Sharing

Persistent immutable data structures can make snapshots inexpensive.

```js
const state1 = {
    document,
    cursor: 10
};

const state2 = {
    ...state1,
    cursor: 11
};
```

If `document` is immutable, both states can safely share the same document reference.

This provides snapshot semantics without copying every nested value.

Memento therefore works particularly well with immutable application state.

## Lazy Snapshots

A Memento can sometimes defer expensive materialization.

```js
class LazyMemento {
    constructor(createState) {
        this.createState = createState;
        this.state = undefined;
    }

    getState() {
        if (this.state === undefined) {
            this.state = this.createState();
        }

        return this.state;
    }
}
```

However, lazy snapshot creation is only correct if the captured state is defined relative to the time the snapshot was
requested.

If the underlying state can change before materialization, the snapshot may capture the wrong state.

## Snapshot Identity

Two Mementos may contain equivalent state without being the same object.

```js
const a = editor.createMemento();
const b = editor.createMemento();
```

The snapshots may represent the same logical state while having different identities.

Applications that compare snapshots should therefore distinguish:

* object identity;
* structural equality;
* logical state equality.

This can matter for deduplicating history.

## Deduplication

A history manager can avoid storing redundant snapshots.

```js
class History {
    push(snapshot) {
        const previous = this.states.at(-1);

        if (previous?.equals(snapshot)) {
            return;
        }

        this.states.push(snapshot);
    }
}
```

Deduplication can reduce memory usage when many operations do not change meaningful state.

The equality definition should reflect the restoration boundary rather than incidental internal details.

## Security

Snapshots may contain sensitive information.

A Memento can preserve data that is not otherwise persisted, such as:

* authentication-related state;
* private document content;
* personal information;
* access configuration;
* temporary secrets.

History storage must therefore have appropriate access control and lifecycle policies.

Persistent snapshots may also require encryption, retention limits, secure deletion, and auditing.

The fact that a snapshot is internal to an application does not make its contents inherently safe.

## TypeScript

TypeScript can model a Memento explicitly.

```ts
interface EditorMemento {
    readonly content: string;
    readonly cursor: number;
}
```

The Originator can expose creation and restoration:

```ts
class Editor {
    private content = "";
    private cursor = 0;

    createMemento(): EditorMemento {
        return {
            content: this.content,
            cursor: this.cursor
        };
    }

    restore(memento: EditorMemento): void {
        this.content = memento.content;
        this.cursor = memento.cursor;
    }
}
```

This is convenient but does not provide complete opacity because any consumer holding the interface can inspect the
fields.

TypeScript's type system primarily provides compile-time structure, not runtime access control.

## Stronger TypeScript Encapsulation

A module can hide the concrete Memento representation.

```ts
const createMemento = Symbol("createMemento");

class Editor {
    private content = "";
    private cursor = 0;

    [createMemento]() {
        return {
            content: this.content,
            cursor: this.cursor
        };
    }
}
```

A more practical approach is often to keep the Memento type and construction functions inside a module and expose only
the operations that the Caretaker needs.

The exact mechanism depends on how strong the required encapsulation boundary is.

## Private Fields in JavaScript

Native private fields can protect Originator state:

```js
class Editor {
    #content = "";
    #cursor = 0;

    createMemento() {
        return {
            content: this.#content,
            cursor: this.#cursor
        };
    }

    restore(memento) {
        this.#content = memento.content;
        this.#cursor = memento.cursor;
    }
}
```

The Caretaker can hold the returned object without accessing the Originator's private fields.

This is a practical JavaScript implementation even though it does not reproduce the access-control semantics of
languages that support friend classes.

## Module Encapsulation

JavaScript modules can provide stronger separation.

```js
const createEditor = (() => {
    class Memento {
        constructor(content, cursor) {
            this.content = content;
            this.cursor = cursor;
        }
    }

    return function createEditor() {
        let content = "";
        let cursor = 0;

        return {
            type(text) {
                content += text;
                cursor += text.length;
            },

            save() {
                return new Memento(content, cursor);
            },

            restore(memento) {
                content = memento.content;
                cursor = memento.cursor;
            }
        };
    };
})();
```

The Memento implementation can remain private to the module.

This approach can approximate the conceptual separation between Originator and opaque Memento more closely than a public
class.

## Testing

Memento tests should verify restoration semantics.

```js
test("restores the previous editor state", () => {
    const editor = new Editor();

    editor.type("Hello");
    const snapshot = editor.createMemento();

    editor.type(" World");
    editor.restore(snapshot);

    expect(editor.getContent()).toBe("Hello");
});
```

Tests should also verify that snapshots remain stable:

```js
test("snapshot is not affected by later mutations", () => {
    const editor = new Editor();

    editor.type("Hello");
    const snapshot = editor.createMemento();

    editor.type(" World");

    expect(snapshot.content).toBe("Hello");
});
```

For complex state, tests should verify invariants after restoration rather than merely checking individual fields.

## Refactoring Toward Memento

A system is a candidate for Memento when an object needs reliable restoration but state management is beginning to leak
its internal representation.

Typical warning signs include:

* undo logic directly accesses object internals;
* history managers duplicate knowledge of object state;
* external components construct restoration state;
* snapshots are scattered across unrelated code;
* restoring state requires manipulating many public properties;
* changes to internal representation require changes to history management.

A refactoring can move snapshot creation into the state-owning object:

```js
class Originator {
    createMemento() {
        return new Memento(/* internal state */);
    }

    restore(memento) {
        // restore internal state
    }
}
```

The history manager can then become representation-independent:

```js
class Caretaker {
    save(memento) {
        this.history.push(memento);
    }
}
```

## Common Misuse

Memento is often misused as a generic object-copy mechanism.

Creating:

```js
const copy = structuredClone(object);
```

does not automatically mean the design uses Memento.

The defining property is not copying. It is **preserving state for later restoration while keeping state representation
under the Originator's control**.

Memento is also unnecessary when an object's complete state is already naturally immutable and previous versions can
simply be retained as values.

## Excessive Snapshotting

Saving a Memento after every insignificant mutation can create unnecessary memory and performance costs.

For example:

```js
for (const character of text) {
    editor.type(character);
    history.save();
}
```

may produce hundreds or thousands of snapshots when the user-visible operation is actually a single edit.

The snapshot boundary should correspond to meaningful restoration points.

## Capturing Too Much State

Capturing every property can be just as problematic as capturing too little.

```js
save()
{
    return structuredClone(this);
}
```

This approach couples the snapshot to the entire runtime representation and can capture values that should not be
restored.

It may also include caches, resources, implementation details, or transient state.

Explicit snapshot definitions are generally safer.

## Capturing Too Little State

The opposite problem occurs when restoration does not restore a coherent state.

```js
save()
{
    return {
        content: this.content
    };
}
```

If the cursor, selection, mode, or other state determines how the object behaves, restoring only `content` may produce a
state that did not previously exist.

The snapshot boundary should be defined according to the object's invariants and intended restoration semantics.

## Memento at Architectural Boundaries

Memento can be useful inside:

* editors;
* workflow engines;
* simulations;
* stateful domain objects;
* configuration systems;
* transactional application components;
* long-running processes;
* UI state management.

At larger architectural boundaries, however, explicit snapshot models, persistence schemas, checkpoint stores, or
event-sourced aggregates may be more appropriate than an in-memory Memento abstraction.

The pattern remains useful conceptually, but the implementation mechanism should match the scope of the state.

## Persistence

Persistent Mementos introduce a lifecycle beyond the lifetime of the Originator.

A persistent snapshot may require:

```js
{
    id,
        originatorType,
        version,
        createdAt,
        state
}
```

The persistence mechanism then becomes part of the Caretaker's responsibility or a separate persistence component.

The Originator should still own the meaning and restoration of its state.

## Snapshot Storage

The Caretaker can store snapshots:

```js
class SnapshotStore {
    constructor(repository) {
        this.repository = repository;
    }

    async save(id, snapshot) {
        await this.repository.put(id, snapshot);
    }

    async load(id) {
        return this.repository.get(id);
    }
}
```

The storage mechanism can be memory, a database, a file, object storage, or another durable system.

The Memento abstraction remains concerned with the saved state rather than where it is stored.

## Benefits

Memento provides several important benefits:

1. It preserves encapsulation while supporting state restoration.
2. It separates state capture from state history management.
3. It supports undo, redo, checkpoints, drafts, and rollback.
4. It allows the Originator's internal representation to evolve independently of the Caretaker.
5. It allows historical state to be retained without exposing mutable internals.
6. It can work with immutable data structures and structural sharing.
7. It provides a clear abstraction for restoration boundaries.

## Costs

Memento also introduces costs:

1. Full snapshots can consume substantial memory.
2. Snapshot creation can be computationally expensive.
3. Complex state may require careful copying or immutability.
4. Persistent snapshots require versioning and migration.
5. Large histories require retention policies.
6. External side effects cannot generally be undone by restoring in-memory state.
7. Poorly designed Mementos can expose implementation details or capture invalid state.
8. Snapshot management can become complex when concurrency and distributed state are involved.

## Decision Criteria

Memento is appropriate when:

1. An object has meaningful internal state that must be restored later.
2. The state representation should remain encapsulated.
3. A separate component needs to retain historical states.
4. Restoration is a meaningful operation in the domain or application.
5. Snapshot boundaries can be defined clearly.
6. The cost of retaining snapshots is acceptable or can be controlled.

Memento is especially strong when an object owns complex state whose representation should not become part of the
history manager's responsibilities.

## Summary

Memento captures an object's state so that the object can later restore itself to that state without exposing its
internal representation.

The Originator defines what state is captured and how restoration works. The Memento preserves the captured
representation. The Caretaker stores and manages Mementos without needing to understand their contents.

Memento is commonly used for undo, redo, checkpoints, drafts, and rollback. It can use full snapshots, immutable values,
structural sharing, serialized representations, or other state-preservation techniques.

Memento is distinct from Command because Command represents an operation while Memento represents state. It is distinct
from Prototype because Prototype creates another object while Memento preserves state for restoration. It is distinct
from State because State controls behavior according to current state while Memento preserves state. It is distinct from
Event Sourcing because Event Sourcing records state-changing events rather than simply storing restorable snapshots.

The defining property is **encapsulated state preservation for later restoration**. The representation belongs to the
object whose state is being captured, while the history mechanism remains independent of that representation.

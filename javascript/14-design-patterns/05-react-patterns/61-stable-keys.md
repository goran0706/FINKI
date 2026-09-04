# Stable Keys

## Intent

Stable Keys provide React with persistent identity for elements produced from collections.

When React renders a collection, it needs to determine which rendered item corresponds to which item in the next render.
The `key` identifies an item within its sibling collection so React can preserve, update, move, or remove the
appropriate component instance.

The key is therefore not primarily a DOM identifier and not application data passed to the component. It is an identity
signal used by React's reconciliation process.

The central rule is:

**A key should be stable for the same logical item and unique among its siblings.**

## Basic Pattern

A collection can provide a key derived from the identity of each item:

```tsx id="1y1p8j"
function UserList({users}: { users: User[] }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
}
```

If the same user remains in the collection across renders, `user.id` continues to identify that user.

The key represents:

```text id="p4v0m8"
logical item identity
```

not:

```text id="0v2m6a"
current array position
```

## What a Key Represents

Consider:

```tsx id="e8m3y5"
const users = [
    {id: "a", name: "Alice"},
    {id: "b", name: "Bob"},
    {id: "c", name: "Carol"},
];
```

The keys:

```tsx id="7z0b1s"
key = "a"
key = "b"
key = "c"
```

tell React which logical items correspond to the rendered children.

If the collection becomes:

```tsx id="f3x1a7"
const users = [
    {id: "c", name: "Carol"},
    {id: "a", name: "Alice"},
    {id: "b", name: "Bob"},
];
```

the logical identities have not changed.

Only their positions changed.

Stable keys allow React to preserve the identity of each corresponding component.

## Identity Versus Position

Array position is not necessarily item identity.

Consider:

```tsx id="q5j2r9"
const items = [
    {id: "a", name: "A"},
    {id: "b", name: "B"},
];
```

After inserting an item at the beginning:

```tsx id="m8c6q1"
const items = [
    {id: "x", name: "X"},
    {id: "a", name: "A"},
    {id: "b", name: "B"},
];
```

the positions have changed:

```text id="6l2d0n"
0 → X
1 → A
2 → B
```

but the logical identities remain:

```text id="0l5n9c"
X
A
B
```

Stable keys allow React to track the logical identities rather than interpreting the positional shift as a replacement
of every item.

## Keys Are Local to Sibling Collections

Keys must be unique among the relevant siblings.

For example:

```tsx id="r9z8c2"
<ul>
    {users.map(user => (
        <li key={user.id}>
            {user.name}
        </li>
    ))}
</ul>
```

requires `user.id` to be unique within that collection.

The same key can appear elsewhere in the component tree:

```tsx id="n7k3f4"
<UserList users={usersA}/>
<UserList users={usersB}/>
```

without creating a global key collision.

Keys establish identity within their reconciliation context, not globally across the application.

## Uniqueness Is Not Enough

A key can be unique and still be incorrect.

For example:

```tsx id="6p4s8n"
key = {Math.random()}
```

can produce a different unique key every render.

The keys are unique, but they are not stable.

React therefore loses continuity between renders.

The required properties are both:

* uniqueness among siblings;
* stability across renders for the same logical item.

## Stability

A stable key continues to identify the same logical item across renders.

Good:

```tsx id="z5j3x8"
key = {user.id}
```

Problematic:

```tsx id="q8h1k4"
key = {users.indexOf(user)}
```

if the collection can reorder, insert, delete, or filter items.

Also problematic:

```tsx id="4f8x2s"
key = {Math.random()}
```

because the identity changes independently of the item.

Stability is about preserving logical identity, not merely producing a deterministic value for one render.

## Stable Does Not Mean Immutable Data

The key itself should remain associated with the same logical entity, but other properties of that entity can change.

For example:

```tsx id="x6b9p1"
{
    id: "user-42",
        name
:
    "Alice"
}
```

can become:

```tsx id="d2m7q4"
{
    id: "user-42",
        name
:
    "Alicia"
}
```

The name changed, but the user identity did not.

Therefore:

```tsx id="7h0c5m"
key = {user.id}
```

remains appropriate.

## Keys and Component State

Keys become particularly important when list items contain state.

Consider:

```tsx id="h7q1n9"
function UserRow({user}: { user: User }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <button onClick={() => setExpanded(value => !value)}>
                {user.name}
            </button>

            {expanded && <UserDetails user={user}/>}
        </div>
    );
}
```

If the collection changes order, stable keys allow React to preserve the state associated with the same logical user.

Without appropriate keys, state can become associated with the wrong item or components can be unnecessarily recreated.

## The Index-Key Problem

Using an array index as a key:

```tsx id="k1p6c3"
items.map((item, index) => (
    <Item key={index} item={item}/>
))
```

is safe only when the position itself represents stable identity.

For collections that can be reordered, inserted into, removed from, or filtered, the index represents position rather
than identity.

Consider:

```tsx id="f0k9w2"
[
    {id: "a", name: "A"},
    {id: "b", name: "B"},
    {id: "c", name: "C"}
]
```

After removing `A`:

```tsx id="r3v8j5"
[
    {id: "b", name: "B"},
    {id: "c", name: "C"}
]
```

index keys become:

```tsx id="w4x7p0"
B → 0
C → 1
```

Previously:

```tsx id="s9c2k6"
A → 0
B → 1
C → 2
```

React sees the same keys at those positions and may preserve component identity according to position rather than the
logical item.

This can cause state to follow the wrong item.

## When Index Keys Are Acceptable

Index keys are not universally incorrect.

They can be appropriate when all of the following are effectively true:

* the collection is static;
* items are never reordered;
* items are never inserted or removed;
* items are not filtered;
* item identity is inherently positional;
* the component does not depend on state whose identity could be confused.

For example:

```tsx id="y4q0r7"
const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

weekdays.map((day, index) => (
    <span key={index}>{day}</span>
))
```

can be reasonable if the collection is fixed and its ordering is immutable.

Even in these cases, a genuine domain identifier may communicate identity more clearly.

## Filtering and Index Keys

Filtering changes positions without necessarily changing item identity.

For example:

```tsx id="m3v5x1"
const visibleUsers = users.filter(user => user.active);
```

Using:

```tsx id="a6z2q8"
key = {index}
```

means the key represents the position in the filtered collection, not the identity of the original user.

When the filter changes, state can therefore be associated with a different user.

Prefer:

```tsx id="j8c4w6"
key = {user.id}
```

## Sorting and Index Keys

Sorting is another direct failure mode.

Before:

```tsx id="s7n1k3"
[
    {id: "a", name: "Alice"},
    {id: "b", name: "Bob"},
]
```

After sorting:

```tsx id="c9q2v5"
[
    {id: "b", name: "Bob"},
    {id: "a", name: "Alice"},
]
```

The item identities remain unchanged while their positions change.

An index key encodes the wrong identity.

A stable domain key preserves the relationship.

## Insertion and Index Keys

Insertion at any position changes the indexes of subsequent items.

```tsx id="0m7f4p"
[
    {id: "a"},
    {id: "b"},
    {id: "c"}
]
```

becomes:

```tsx id="e5k1r8"
[
    {id: "a"},
    {id: "x"},
    {id: "b"},
    {id: "c"}
]
```

With index keys, `b` and `c` receive different keys despite remaining the same logical items.

With stable identifiers:

```tsx id="3u9h2s"
a
x
b
c
```

each item retains its identity.

## Deletion and Index Keys

Deletion has the same problem.

Removing an item shifts the indexes of all following elements.

If those components own local state, state can appear to move between items.

This is one of the strongest reasons to avoid index keys for dynamic collections.

## Reordering and State Preservation

Stable keys are especially important when components have state.

Consider a list of editable rows:

```tsx id="6q2v9m"
function Row({item}: { item: Item }) {
    const [value, setValue] = useState(item.value);

    return (
        <input
            value={value}
            onChange={event => setValue(event.target.value)}
        />
    );
}
```

With stable keys:

```tsx id="b4w8y0"
items.map(item => (
    <Row key={item.id} item={item}/>
))
```

reordering the collection preserves the editing state with the logical item.

With index keys, reordering can associate one row's state with another item's data.

## Keys and DOM State

Keys can also affect preservation of DOM state managed by the browser.

Examples include:

* input values in uncontrolled inputs;
* selection;
* focus;
* other DOM-local state.

When React determines that an existing component/element identity can be preserved, its underlying DOM can also be
reused.

Changing the key intentionally changes that identity.

## Keys and Remounting

Changing a key tells React that the keyed identity has changed.

For example:

```tsx id="f3x8q1"
<Editor key={documentId}/>
```

When `documentId` changes, React can treat the editor as a different instance.

This can be used deliberately to reset component state.

For example:

```tsx id="w9c5m2"
<ChatWindow key={conversationId}/>
```

can create a new component identity when switching conversations.

This is not the same as using keys correctly for collection identity, but it relies on the same identity mechanism.

## Key as a Reset Mechanism

A key can intentionally force a component instance to be replaced:

```tsx id="x1v6k8"
<Form key={userId} user={user}/>
```

When `userId` changes, the form can receive a fresh component identity.

This can be useful when the desired semantic behavior is:

**This is a different logical instance; discard the previous component state.**

The technique should be explicit.

Do not use changing keys accidentally to solve state synchronization problems.

## Keys Are Not Props

The key is used by React for reconciliation.

It is not automatically available as a component prop.

For example:

```tsx id="j6p3r9"
<Item key={item.id}/>
```

does not make this possible:

```tsx id="z4m8t1"
function Item({key}: { key: string }) {
    // ...
}
```

If the component needs the identifier as application data, pass it explicitly:

```tsx id="n2v7c5"
<Item
    key={item.id}
    itemId={item.id}
/>
```

The two concepts have different ownership:

* `key` is React reconciliation metadata;
* `itemId` is component data.

## Keys Are Not DOM IDs

A React key is not equivalent to the HTML `id` attribute.

For example:

```tsx id="a5q9w3"
<li
    id={`user-${user.id}`}
    key={user.id}
>
    {user.name}
</li>
```

Here:

* `key` establishes React identity;
* `id` establishes a DOM identifier.

The DOM identifier can be referenced by:

```tsx id="r7c1m4"
<label htmlFor="user-email">
```

The React key cannot.

## Keys and Accessibility

Keys do not establish accessibility relationships.

For example:

```tsx id="h4s8q0"
<input
    id={`email-${user.id}`}
    key={user.id}
/>
```

The `id` attribute is what participates in HTML relationships such as `htmlFor`.

The key only informs React's reconciliation.

Do not use a React key as a substitute for a DOM identifier.

## Keys and Generated IDs

Generating a unique ID for each render does not create a stable key.

Problematic:

```tsx id="k3n7y1"
items.map(item => (
    <Item
        key={crypto.randomUUID()}
        item={item}
    />
))
```

Each render can produce a new identity.

React may therefore discard the previous component identity and create a new one.

If an item already has an identity, use that identity.

## Deriving Keys

Keys can be derived from stable data when no dedicated identifier exists.

For example:

```tsx id="m8q2c4"
const colors = ["red", "green", "blue"];

colors.map(color => (
    <Color key={color} value={color}/>
))
```

If the value itself is unique and stable within the collection, it can serve as the key.

A compound key can also be used when identity is defined by multiple stable properties:

```tsx id="p1x6v9"
key = {`${product.id}:${variant.id}`
}
```

The compound value should represent actual logical identity rather than merely producing an arbitrary unique string.

## Do Not Use Display Values Blindly

A displayed value is not necessarily an identity.

For example:

```tsx id="q7m4b2"
users.map(user => (
    <User key={user.name} user={user}/>
))
```

is unsafe if names are not guaranteed to be unique and stable.

Two users can share a name.

A user's name can also change.

Prefer the actual domain identifier:

```tsx id="c5z8n1"
key = {user.id}
```

## Keys and Database IDs

Database identifiers are often good key candidates because they frequently represent persistent entity identity.

For example:

```tsx id="v2h7m0"
products.map(product => (
    <ProductCard
        key={product.id}
        product={product}
    />
))
```

This is appropriate when `product.id` remains associated with the same logical product.

However, the fact that a value originates from a database does not automatically make it correct. The key must represent
the identity of the rendered item in the relevant collection.

## Keys and Client-Generated IDs

Client-generated identifiers can also be valid.

For example:

```tsx id="x8r4k2"
const item = {
    id: crypto.randomUUID(),
    text: "Draft",
};
```

Once assigned, the identifier should remain stable for that logical item.

The important property is not whether the identifier originated on the server or client.

The important property is that it persists with the item.

## Keys and Optimistic Items

Optimistic client-created items require stable identity.

For example:

```tsx id="e7n3p5"
const optimisticComment = {
    id: clientGeneratedId,
    text,
    pending: true,
};
```

The same temporary identity should remain associated with the optimistic item while it exists.

When the server assigns a permanent identity, the application must decide whether the logical identity is intended to
remain continuous or whether the temporary and persisted representations are separate identities.

The key should reflect that semantic decision.

## Keys and Temporary IDs

A temporary ID is preferable to an array index when the item itself has a persistent client-side identity.

For example:

```tsx id="u5c1z7"
{
    id: "temp-123",
        status
:
    "pending"
}
```

is generally more useful as a key than:

```tsx id="w3p9h6"
key = {index}
```

because the temporary identifier can remain attached to the logical item while its position changes.

## Keys and Pagination

Paginated collections require an explicit identity strategy.

If pages are rendered together:

```tsx id="y1q8m4"
pages.flatMap(page =>
    page.items.map(item => (
        <Item key={item.id} item={item}/>
    ))
)
```

the key should identify the logical item across the combined sibling collection.

If the same logical entity can appear in multiple places intentionally, the relevant identity context must be
considered.

Do not blindly prepend page numbers to every key merely to avoid warnings if the underlying item identity is already
sufficient.

## Keys and Virtualized Lists

Virtualized list libraries often reuse a limited number of rendered DOM nodes while representing a much larger logical
collection.

Stable item identity remains important.

If a virtualization library accepts an item-key function, it should generally return the item's logical identity:

```tsx id="s4m9x2"
getItemKey = {(index, item)
=>
item.id
}
```

rather than a value that changes merely because the item moves.

The virtualization mechanism may have its own recycling model, but logical item identity still matters for React state
and application semantics.

## Keys and Nested Collections

Each sibling collection has its own key scope.

For example:

```tsx id="g2v6k9"
sections.map(section => (
    <section key={section.id}>
        {section.items.map(item => (
            <Item
                key={item.id}
                item={item}
            />
        ))}
    </section>
))
```

`section.id` identifies the section among the top-level siblings.

`item.id` identifies the item among that section's item siblings.

The same item key can appear in different sibling collections without being globally unique.

## Keys and Fragments

When mapping a collection to multiple sibling elements, the fragment itself may need the key.

For example:

```tsx id="k7p2m5"
items.map(item => (
    <React.Fragment key={item.id}>
        <dt>{item.term}</dt>
        <dd>{item.description}</dd>
    </React.Fragment>
))
```

The identity belongs to the fragment representing the logical item.

Putting the key on only one descendant does not establish the same identity for the complete mapped group.

## Keys and Nested Components

A key applies to the children being reconciled at the level where the key is assigned.

For example:

```tsx id="f8c3n6"
items.map(item => (
    <Wrapper key={item.id}>
        <Item item={item}/>
    </Wrapper>
))
```

The key identifies `Wrapper` among its siblings.

It does not directly assign an identity to `Item` independently of that component hierarchy.

If `Item` itself renders a collection, its children require their own appropriate keys.

## Keys and Conditional Rendering

Keys can distinguish alternative component identities.

For example:

```tsx id="p6x1r4"
{
    mode === "login" ? (
        <Form key="login"/>
    ) : (
        <Form key="register"/>
    )
}
```

The distinct keys communicate that these are intentionally different component identities.

Without distinct identities, React may preserve state between branches depending on their structural position.

Keys can therefore be used to make identity changes explicit.

## Keys and State Reset

Consider:

```tsx id="z8m4q7"
function ProfileEditor({
                           user,
                       }: {
    user: User;
}) {
    const [name, setName] = useState(user.name);

    return (
        <input
            value={name}
            onChange={event => setName(event.target.value)}
        />
    );
}
```

If the editor switches from one user to another but retains the same component identity, the local state does not
automatically reinitialize from `user.name`.

A deliberate key can express the desired identity change:

```tsx id="c1v7s5"
<ProfileEditor
    key={user.id}
    user={user}
/>
```

Now a different user represents a different component instance.

This is a legitimate use of keys because the key corresponds to a real semantic identity change.

## Keys and Data Synchronization

Keys should not be used to force remounts merely because a component's internal state is poorly synchronized with props.

For example:

```tsx id="y6n2k8"
<Editor key={JSON.stringify(data)} data={data}/>
```

can cause the editor to reset whenever any data changes.

This may hide an underlying state ownership problem.

If the component should synchronize state with changing input data, use an explicit state-management strategy.

Use keys for identity, not as a general-purpose reset mechanism.

## Keys and Referential Equality

Keys are independent of JavaScript object identity.

For example:

```tsx id="m9r5x1"
const nextUsers = users.map(user => ({
    ...user,
}));
```

creates new object references but does not necessarily change logical user identity.

If:

```tsx id="b7k3q0"
key = {user.id}
```

remains stable, React can still identify the same logical user.

Keys therefore represent semantic identity rather than object reference identity.

## Keys and Memoization

Stable keys and memoization solve different problems.

A stable key tells React which child identity corresponds to which logical item.

`memo` can allow a component to skip rendering when its props are considered unchanged.

For example:

```tsx id="r2v8c6"
const UserRow = memo(function UserRow({
                                          user,
                                      }: {
    user: User;
}) {
    return <div>{user.name}</div>;
});

users.map(user => (
    <UserRow
        key={user.id}
        user={user}
    />
))
```

The key preserves identity across collection changes.

Memoization controls whether rendering work can be skipped.

Neither replaces the other.

## Keys and Referential Stability

Stable keys are a specific form of stable identity, but they are not equivalent to referential stability.

A key can remain stable while the object passed as a prop is recreated:

```tsx id="n4x7c2"
<UserRow
    key={user.id}
    user={{...user}}
/>
```

The key still identifies the logical user.

Referential stability concerns JavaScript object and function identity.

Keys concern React child identity.

## Keys and Reconciliation

During reconciliation, React compares the previous and next child collections to determine which identities correspond.

Keys provide an explicit identity signal when children are generated dynamically.

For example:

```tsx id="t5m1p9"
previous: [A, B, C]
next:     [C, A, B]
```

with stable keys lets React recognize:

* `A` is still `A`;
* `B` is still `B`;
* `C` is still `C`.

Only their positions changed.

Without meaningful keys, React has less information about the intended logical correspondence.

## Keys and Performance

Stable keys can improve reconciliation quality because React can identify preserved logical children across collection
changes.

However, keys are not a general performance optimization.

Changing a key forces identity replacement:

```tsx id="d8q4v2"
<Component key={someChangingValue}/>
```

can cause:

* state reset;
* effect cleanup;
* new effect setup;
* DOM replacement or reconstruction where necessary;
* additional rendering work.

Therefore, unstable keys can create both correctness and performance problems.

## Keys and Effects

Component identity determines effect lifecycle.

For example:

```tsx id="p7m3x9"
function Subscription({roomId}: { roomId: string }) {
    useEffect(() => {
        const connection = connect(roomId);

        return () => {
            connection.disconnect();
        };
    }, [roomId]);

    return null;
}
```

If the component's key changes:

```tsx id="v5c8n1"
<Subscription
    key={roomId}
    roomId={roomId}
/>
```

React can treat the component as a new instance.

That can cause the previous instance's effects to clean up and the new instance's effects to initialize.

Keys therefore influence lifecycle by determining component identity.

## Keys and Refs

Changing a key can replace a component instance and its associated DOM/ref relationships.

For example:

```tsx id="q2w7k4"
<Editor
    key={documentId}
    ref={editorRef}
/>
```

when `documentId` changes can produce a new instance.

This can be useful when the application intentionally wants a fresh imperative object.

Again, this is an identity decision, not a generic ref-management technique.

## Keys and Animation

Animation libraries often use keys to determine which items entered, exited, or moved.

For example:

```tsx id="x3m8r5"
items.map(item => (
    <AnimatedItem
        key={item.id}
        item={item}
    />
))
```

Stable keys allow the animation system and React to distinguish persistent items from newly introduced or removed items.

Changing keys unnecessarily can make an item appear to leave and re-enter because its identity has been replaced.

## Keys and Drag-and-Drop

Drag-and-drop interfaces frequently reorder collections.

Stable keys are particularly important because position changes are expected behavior.

For example:

```tsx id="b6q1t8"
items.map(item => (
    <DraggableItem
        key={item.id}
        item={item}
    />
))
```

When an item moves from one position to another, its identity should remain the same.

An index key encodes exactly the property that is changing: position.

## Keys and Editable Collections

Editable lists should almost always use domain or client-generated item identifiers when items can be inserted, deleted,
or reordered.

For example:

```tsx id="m5r9x2"
items.map(item => (
    <EditableRow
        key={item.id}
        item={item}
    />
))
```

This preserves row identity while the collection changes.

This is particularly important when rows contain:

* uncontrolled inputs;
* local draft state;
* validation state;
* focus state;
* expanded state;
* asynchronous operation state.

## Keys and Server Data

When server data contains stable identifiers, those identifiers are usually the preferred key source.

For example:

```tsx id="j3c7v1"
orders.map(order => (
    <OrderRow
        key={order.id}
        order={order}
    />
))
```

The server's identifier expresses domain identity while React uses it for UI identity.

This is generally preferable to inventing a second UI-specific identity.

## Keys and Data Transformation

Transforming data does not necessarily change identity.

For example:

```tsx id="h8n2q6"
const rows = orders.map(order => ({
    id: order.id,
    label: `${order.number} — ${order.customerName}`,
}));
```

The transformed representation can retain:

```tsx id="u4x9m7"
key = {row.id}
```

The key should follow the logical entity through transformations.

## Keys and Composite Identity

Sometimes a rendered item represents a relationship rather than a single entity.

For example:

```tsx id="c8p2y5"
memberships.map(membership => (
    <Membership
        key={`${membership.userId}:${membership.teamId}`}
        membership={membership}
    />
))
```

If the logical identity is the user-team relationship, the compound key can correctly represent that identity.

The important requirement is that the compound identifier be:

* deterministic;
* stable;
* unique among siblings;
* derived from the actual logical identity.

## Avoid Accidental Collisions

Compound keys should use an encoding that cannot ambiguously combine distinct values.

For example:

```tsx id="v7m3q9"
`${userId}:${teamId}`
```

is usually reasonable when the component values cannot themselves contain the separator or when the encoding is
otherwise unambiguous.

For more complex identities, structured identifiers or a collision-resistant encoding may be appropriate.

The goal is semantic uniqueness, not merely syntactic variety.

## Keys and Duplicate Data

If a collection legitimately contains duplicate values, the duplicated value should not be used as the key.

For example:

```tsx id="s1q6x4"
const tags = ["react", "javascript", "react"];
```

Using:

```tsx id="z8c3n7"
key = {tag}
```

creates duplicate sibling keys.

The collection needs a more appropriate identity:

```tsx id="p5r2m9"
tags.map((tag, index) => (
    <Tag key={`${tag}:${index}`} value={tag}/>
))
```

if the duplicate entries are genuinely distinct and positional identity is part of their semantics.

A better solution is often to assign an explicit identity when the items are created.

## Keys and Generated Data

If application data lacks identity, add identity at the point where the application creates the logical entity.

For example:

```tsx id="k4v9c2"
const newTodo = {
    id: crypto.randomUUID(),
    text,
};
```

Then:

```tsx id="f6m1x8"
<Todo key={todo.id} todo={todo}/>
```

The identifier becomes part of the item's persistent client-side identity rather than being regenerated during
rendering.

## Do Not Generate Keys During Render

Avoid:

```tsx id="u3q7n5"
items.map(item => (
    <Item
        key={crypto.randomUUID()}
        item={item}
    />
))
```

or:

```tsx id="b9w4p1"
items.map(item => (
    <Item
        key={Date.now()}
        item={item}
    />
))
```

These values describe the render operation rather than the logical item.

Keys should represent the item, not the act of rendering it.

## Keys and Randomness

Randomness is generally incompatible with stable identity when generated during render.

Even if a random value happens to remain unique, it does not remain associated with the same logical item.

Randomness can be used when creating an item's persistent identity:

```tsx id="r6x2m8"
const item = {
    id: crypto.randomUUID(),
};
```

It should not normally be used to generate the key independently on every render.

## Keys and Timestamps

Timestamps can be valid identifiers if they are assigned once as part of entity creation and guaranteed to identify the
entity correctly.

They are problematic when generated during rendering:

```tsx id="c4n8v5"
key = {Date.now()}
```

The distinction is between:

**stable identifier generated during entity creation**

and:

**new value generated during rendering.**

Only the first expresses persistent identity.

## Keys and UI State

A useful mental model is:

```text id="v8m1q3"
key → component identity
state → state associated with that identity
```

If the key remains stable, React can preserve the component's identity across renders.

If the key changes, React can treat the component as a different identity.

This explains why incorrect keys often manifest as state bugs rather than obvious rendering errors.

## Keys and Logical Identity

The best key is usually the identifier that answers:

**Which logical thing is this?**

Examples:

```tsx id="e2r7k5"
user.id
product.id
order.id
message.id
document.id
```

For a relationship:

```tsx id="m6c1x9"
`${userId}:${roleId}`
```

For a static value collection:

```tsx id="q8p4v2"
color
```

when `color` itself is unique and stable.

The key should correspond to the application's semantic model.

## Keys and Component Boundaries

Keys are evaluated where React reconciles siblings.

A parent component controls the identity of its direct children:

```tsx id="w2n7c4"
function List() {
    return items.map(item => (
        <Item key={item.id} item={item}/>
    ));
}
```

The key belongs at the mapping boundary.

Passing the key through another component is not equivalent:

```tsx id="n5x9q1"
items.map(item => (
    <Item item={item}/>
))
```

with:

```tsx id="g7c3m8"
function Item({item}: Props) {
    return <Row key={item.id}/>;
}
```

The `Row` key identifies `Row` among `Item`'s children. It does not identify the `Item` components among the parent's
siblings.

Therefore, place keys at the collection boundary where the siblings are created.

## Keys and Abstraction Boundaries

A reusable component receiving a collection can own its own key mapping:

```tsx id="x4q8m1"
function UserList({users}: { users: User[] }) {
    return users.map(user => (
        <UserRow
            key={user.id}
            user={user}
        />
    ));
}
```

The caller does not need to know how the internal collection is rendered.

Keys should be assigned at the level where the collection becomes React children.

## Keys and Fragmented UI

When one logical item produces multiple sibling nodes, represent the complete item identity with a keyed fragment:

```tsx id="p9m5v2"
items.map(item => (
    <Fragment key={item.id}>
        <dt>{item.name}</dt>
        <dd>{item.description}</dd>
    </Fragment>
))
```

This avoids assigning the identity to only one part of the logical item.

## Keys and Portals

Moving UI into a portal does not make keys globally unique.

Keys still establish identity within the relevant React child collection.

Portal rendering changes DOM placement, not the fundamental concept of React child identity.

## Keys and Server Rendering

Stable keys are also relevant when the initial UI is rendered on the server and subsequently activated on the client.

The server and client must agree on the identity structure of the component tree.

Keys generated nondeterministically during rendering can therefore create additional server/client consistency problems.

The key should be derived from stable data available to both environments when the same logical collection is rendered
on both sides.

## Keys and Hydration

Hydration depends on the client React tree corresponding appropriately to server-produced UI.

Stable keys contribute to deterministic component identity within collections.

However, keys alone do not solve hydration mismatches.

They do not compensate for:

* different data;
* browser-only state;
* random rendering;
* time-dependent output;
* inconsistent component structure.

Hydration correctness remains a separate concern.

## Keys and Server Components

Keys can be used in component trees containing Server Components and Client Components.

The key still represents React child identity.

The execution environment does not change the fundamental meaning of the key.

For example:

```tsx id="s7k2m9"
products.map(product => (
    <ProductCard
        key={product.id}
        product={product}
    />
))
```

Whether `ProductCard` is server-oriented or client-executed, `product.id` represents the logical product identity.

## Keys and Suspense

Keys and Suspense can interact when the same logical region is rendered through asynchronous boundaries.

A stable key should continue to represent the same logical child.

Changing the key intentionally can cause React to treat the content as a new identity, which may affect associated state
and lifecycle.

Suspense owns rendering readiness; keys own child identity.

## Keys and Transitions

Transitions can reorder or replace UI while React manages concurrent rendering.

Stable keys remain important because the renderer still needs to understand which logical children persist across
versions of the UI.

Transitions do not eliminate the need for correct keys.

## Keys and Deferred Values

A deferred value can temporarily represent an older version of a collection.

Stable keys allow React to maintain meaningful correspondence between items as the deferred and current versions differ.

The deferred-value mechanism controls when a value is consumed; keys control identity within the resulting child
collection.

## Keys and Memoized Components

A memoized component should still receive a stable key when rendered in a collection:

```tsx id="f1c6y8"
const Row = memo(function Row({item}: Props) {
    return <div>{item.name}</div>;
});

items.map(item => (
    <Row
        key={item.id}
        item={item}
    />
))
```

Memoization does not provide item identity.

The key and memoization mechanisms remain independent.

## Common Misuse

### Using the Array Index for Dynamic Collections

```tsx id="x7m2q9"
items.map((item, index) => (
    <Item key={index} item={item}/>
))
```

This makes position the identity.

### Generating Random Keys

```tsx id="n4v8c1"
<Item key={Math.random()}/>
```

The identity changes on every render.

### Generating UUIDs During Render

```tsx id="r6k1p3"
<Item key={crypto.randomUUID()}/>
```

The generated identifier is not attached to the logical item.

### Using Non-Unique Display Values

```tsx id="j9w3m5"
<User key={user.name} user={user}/>
```

Names may collide or change.

### Using a Mutable Property as Identity

```tsx id="c2x7q8"
<Item key={item.title}/>
```

If the title changes, React sees a different identity even when the logical item remains the same.

### Passing `key` as a Component Prop

```tsx id="v5n1m7"
<Item key={item.id}/>
```

does not make `key` available through `props`.

### Putting the Key Inside the Child

```tsx id="a8q4z2"
items.map(item => (
    <Item item={item}/>
))
```

with the key applied inside `Item` does not establish the identity of the `Item` siblings.

### Using Keys as a General Reset Mechanism

```tsx id="m3p9k6"
<Component key={JSON.stringify(props)}/>
```

This can cause unnecessary remounting and hide state-ownership problems.

### Assuming Keys Must Be Globally Unique

Keys only need to be unique within their relevant sibling collection.

### Assuming Unique Means Stable

A key can be unique on every render and still be completely wrong if it changes for the same logical item.

## Advantages

Stable keys provide:

* explicit logical identity;
* reliable state preservation;
* correct handling of insertion;
* correct handling of deletion;
* correct handling of reordering;
* predictable component lifecycle;
* more accurate reconciliation;
* better support for dynamic collections;
* controlled remounting when identity intentionally changes.

## Disadvantages

Keys introduce an additional identity concept that developers must model correctly.

Problems arise when:

* domain entities lack identifiers;
* collections contain duplicate values;
* identity is not clearly defined;
* temporary entities change identity;
* transformed data loses its original identifier;
* developers confuse keys with DOM IDs;
* developers use keys to mask state-management problems.

The complexity comes from correctly modeling identity, not from the `key` syntax itself.

## When to Use

Use stable keys whenever React renders a collection of sibling elements whose logical identities can be distinguished.

Prefer:

```tsx id="z2c7m4"
items.map(item => (
    <Item key={item.id} item={item}/>
))
```

when `item.id` represents persistent identity.

Use index keys only when positional identity is genuinely stable and meaningful.

Use deliberate key changes when a different logical identity should intentionally create a new component instance.

## When Not to Use a Key as a Reset

Do not change keys simply because a component needs to respond to changing props.

For example:

```tsx id="p8v3x1"
<Editor key={value} value={value}/>
```

may reset the entire editor whenever `value` changes.

If the component should preserve some state while updating other state, model that behavior explicitly.

A key should change because **identity changed**, not because **data changed**.

## Design Rules

1. Derive keys from logical item identity.
2. Keep keys stable across renders for the same logical item.
3. Ensure keys are unique among the relevant siblings.
4. Prefer persistent domain identifiers when available.
5. Use client-generated identifiers when they are assigned to the logical item and persisted with it.
6. Avoid array indexes for collections that can reorder, insert, delete, or filter items.
7. Do not generate keys during rendering.
8. Do not use randomness or timestamps generated during render as keys.
9. Do not confuse React keys with DOM `id` attributes.
10. Do not expect `key` to appear in component props.
11. Assign keys at the collection boundary where siblings are created.
12. Use keyed fragments when one logical item produces multiple sibling nodes.
13. Preserve identity through data transformations.
14. Use compound keys when logical identity consists of multiple stable values.
15. Ensure compound keys cannot collide.
16. Treat key changes as component identity changes.
17. Use intentional key changes when a fresh component instance is actually required.
18. Do not use changing keys to hide state-synchronization problems.
19. Remember that keys are local to sibling collections, not globally unique.
20. Treat stable keys as an identity contract rather than a warning-suppression mechanism.

## Relationship to Other Patterns

**Component Composition:** Composition determines how components are assembled. Stable keys determine the identity of
dynamically generated children within that composition.

**State Colocation:** State is associated with component identity. Stable keys help ensure that colocated state remains
associated with the intended logical item when a collection changes.

**Controlled Components:** Controlled state normally comes from outside the component, but the component instance can
still have local lifecycle state. Stable keys preserve the intended instance identity.

**Uncontrolled Components:** Uncontrolled DOM state is particularly sensitive to incorrect keys because preserving or
replacing a DOM node can affect browser-managed state such as input values and focus.

**Memoized Components:** Memoization can skip rendering work. Keys determine which component instances correspond to
logical items. Memoization does not replace keys.

**Referential Stability:** Referential stability concerns JavaScript object and function references. Stable keys concern
React child identity. They are related forms of identity but operate at different levels.

**Ref Pattern:** Changing a key can replace the component or DOM instance associated with a ref. Ref management remains
a separate concern.

**Effect Synchronization:** Component identity influences effect setup and cleanup. An unintended key change can
therefore cause effects to restart.

**External Store:** An external store owns state outside React. Keys determine which component instance consumes that
state for a particular logical item.

**Selector Pattern:** Selectors determine which state a component consumes. Keys determine which logical child the
component instance represents.

**List Rendering:** List rendering creates collections of React children. Stable keys provide the identity information
required for those children.

**Hydration Boundary:** Stable keys contribute to consistent server/client component identity but do not by themselves
solve hydration mismatches.

**Client Component Boundary:** Client boundaries determine execution environment. Keys determine child identity
regardless of whether the component executes on the server or client.

**Server Components:** Server Components can participate in keyed collections. Their server execution model does not
change the fundamental semantics of keys.

**Suspense Boundary:** Suspense controls rendering readiness. Keys control identity. Changing a key can intentionally
establish a new identity even when the surrounding UI remains structurally similar.

**Transition:** Transitions coordinate update priority. Stable keys allow React to maintain logical identity while
transitioning between collection states.

**Deferred Value:** Deferred values can represent older collection versions temporarily. Stable keys allow logical items
to remain identifiable across those versions.

**Lazy Components:** Lazy loading determines when component code becomes available. Keys determine the identity of the
resulting component instances.

## Summary

Stable Keys provide React with the identity of dynamically rendered children.

A correct key answers:

**Which logical item is this?**

The answer should remain stable for that item and be unique among its siblings.

The strongest key is normally a persistent identifier belonging to the logical entity:

```tsx id="q5r8m2"
items.map(item => (
    <Item
        key={item.id}
        item={item}
    />
))
```

Array indexes are appropriate only when position itself is stable identity. Random values, timestamps generated during
rendering, mutable display properties, and other render-dependent values should not be used as keys.

Keys affect more than warnings. They influence component identity, state preservation, DOM reuse, effect lifecycle,
refs, animations, and intentional remounting.

The core rule is:

**Use a stable identifier for the logical item, not the item's current position or the current render.**

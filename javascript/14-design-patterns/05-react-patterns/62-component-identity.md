# Component Identity

Component identity is the rule by which React determines whether a component at a particular position in the rendered
tree represents the same component instance as in the previous render or represents a different instance.

Identity is fundamental to state preservation. When React considers a component to be the same identity across renders,
its state, refs, and other instance-associated React data can be preserved. When React considers the identity different,
the previous component instance is discarded and a new one is created.

Component identity is therefore distinct from component value, rendered markup, object identity, or DOM identity. Two
renders can produce visually identical output while representing different component instances, and two renders can
produce different output while preserving the same component identity.

## Intent

Use a stable component identity when state, refs, effects, and other component-local resources should survive changes in
rendered values.

Change component identity deliberately when an entire component subtree should be reset and initialized as a new
instance.

The central design question is not merely whether two renders produce the same UI. It is whether React should treat the
component occupying a position in the tree as the continuation of the previous component instance.

## Component Identity

A React component does not receive a permanent identity simply because its function or class exists.

Identity is established by the component's position within the rendered tree together with its component type and, where
applicable, its key.

```tsx
function Profile() {
    const [name, setName] = useState("");

    return <input value={name} onChange={event => setName(event.target.value)}/>;
}

function App() {
    return <Profile/>;
}
```

Across ordinary re-renders, React can recognize that the `Profile` component at that position is the same component as
before. Its state is therefore preserved.

Identity is not equivalent to calling the component function again. React may invoke the component function again while
still treating the resulting component as the same logical instance.

## Identity Is Not Function Invocation

A function component is an ordinary JavaScript function, but React component identity is not determined by whether the
function is invoked again.

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

React may execute `Counter` repeatedly as it renders updates. Those executions do not represent new component instances
by themselves.

The state belongs to the React component instance represented by the position in the rendered tree, not to a particular
invocation of the JavaScript function.

This distinction is essential when reasoning about Hooks. A repeated render does not normally imply that `useState`
starts from its initial value again.

## Identity Is Not DOM Identity

Component identity and DOM node identity are related but different concepts.

A component may preserve its identity while changing the DOM it renders.

```tsx
function Status({active}: { active: boolean }) {
    return active
        ? <button>Active</button>
        : <span>Inactive</span>;
}
```

The `Status` component can remain the same component instance while the host element changes from `button` to `span`.

Conversely, a component can be remounted even when its rendered markup appears identical.

```tsx
function App({reset}: { reset: boolean }) {
    return <Profile key={reset ? "reset" : "normal"}/>;
}
```

Changing the key deliberately changes the component identity, even though `Profile` may render exactly the same markup
afterward.

## Identity Is Not Object Identity

React component identity should not be confused with JavaScript object identity.

```tsx
const propsA = {enabled: true};
const propsB = {enabled: true};

console.log(propsA === propsB); // false
```

Different props objects do not automatically imply different component identity.

Likewise, two different objects may represent data for the same component instance across renders.

```tsx
function UserCard({user}: { user: User }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <article>
            {user.name}
            <button onClick={() => setExpanded(value => !value)}>
                {expanded ? "Collapse" : "Expand"}
            </button>
        </article>
    );
}
```

Replacing `user` with another object does not by itself remount `UserCard`.

Component identity is determined by React's tree reconciliation rules rather than by ordinary JavaScript object
equality.

## Type and Identity

Component type is one of the primary inputs to identity.

Consider:

```tsx
function Profile() {
    return <div>Profile</div>;
}

function Settings() {
    return <div>Profile</div>;
}
```

Although `Profile` and `Settings` can produce identical output, they are different component types.

```tsx
function App({settings}: { settings: boolean }) {
    return settings ? <Settings/> : <Profile/>;
}
```

Switching between these types represents a different component identity.

React does not infer identity from rendered appearance. It does not conclude that two components are equivalent merely
because they return the same element structure.

## Same Type, Same Position

When the same component type occupies the same logical position across renders, React normally preserves the component
instance.

```tsx
function App({enabled}: { enabled: boolean }) {
    return (
        <section>
            {enabled ? <Counter/> : <Counter/>}
        </section>
    );
}
```

The conditional expression changes, but both branches contain the same component type at the same position.

The `Counter` state can therefore be preserved.

The important property is not that the JSX source appears in the same textual location. The important property is the
resulting tree structure that React reconciles.

## Conditional Rendering

Conditional rendering does not inherently remount a component.

```tsx
function App({show}: { show: boolean }) {
    return (
        <main>
            {show && <Counter/>}
        </main>
    );
}
```

When `show` changes from `true` to `false`, the `Counter` is removed. When it later becomes `true`, a new `Counter`
instance is created because the previous one no longer exists in the tree.

By contrast:

```tsx
function App({mode}: { mode: "a" | "b" }) {
    return (
        <main>
            {mode === "a" ? <Counter/> : <Counter/>}
        </main>
    );
}
```

Both branches produce a `Counter` at the same position, so changing `mode` does not inherently reset its state.

## Position Matters

React associates component instances with positions in the rendered tree.

```tsx
function App({showExtra}: { showExtra: boolean }) {
    return (
        <>
            {showExtra && <Banner/>}
            <Counter/>
        </>
    );
}
```

The `Counter` occupies the second conceptual position when `Banner` exists, but React's reconciliation model does not
simply interpret this as the `Counter` moving from one fixed DOM slot to another based on source formatting. What
matters is the resulting element structure and the identity information React uses when reconciling it.

This is why identity should be reasoned about in terms of the rendered tree rather than JSX indentation or source-code
line numbers.

## Same Component, Different Position

Moving a component to another structural position can change its identity relationship.

```tsx
function App({left}: { left: boolean }) {
    return left ? (
        <section>
            <Counter/>
        </section>
    ) : (
        <aside>
            <Counter/>
        </aside>
    );
}
```

The `Counter` appears in different parent structures. React reconciles the resulting trees according to their element
hierarchy. A component that moves across structural boundaries should not automatically be assumed to retain its
previous instance.

This is one reason state should not be mentally attached to a JSX tag alone. The surrounding tree participates in
identity.

## Keys Participate in Identity

Keys provide explicit identity information for elements in collections and can also deliberately distinguish otherwise
equivalent component positions.

```tsx
function UserProfile({userId}: { userId: string }) {
    const [draft, setDraft] = useState("");

    return (
        <input
            value={draft}
            onChange={event => setDraft(event.target.value)}
        />
    );
}

function App({userId}: { userId: string }) {
    return <UserProfile key={userId} userId={userId}/>;
}
```

When `userId` changes, the key changes. React can therefore treat the `UserProfile` as a different identity and reset
its component-local state.

Without the key:

```tsx
function App({userId}: { userId: string }) {
    return <UserProfile userId={userId}/>;
}
```

The component type remains the same at the same position, so changing `userId` does not inherently reset its local
state.

Keys therefore provide an explicit identity dimension.

## Keys Are Identity, Not Data

A key should represent the identity of the entity represented by that element within its sibling collection.

```tsx
users.map(user => (
    <UserCard key={user.id} user={user}/>
))
```

The key is not an ordinary prop used by `UserCard`.

```tsx
function UserCard(props: { user: User }) {
    // props.key is not the React element key
}
```

If the component needs the identifier as data, pass it separately.

```tsx
<UserCard key={user.id} userId={user.id} user={user}/>
```

The distinction is important because the key controls React's reconciliation identity while `userId` is application
data.

The dedicated stable-keys pattern covers key selection, stability, collisions, index keys, remounting, and collection
identity in greater detail.

## Deliberate Remounting

Changing identity can be used intentionally to reset a component.

```tsx
function Editor({documentId}: { documentId: string }) {
    const [draft, setDraft] = useState("");

    return (
        <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
        />
    );
}

function DocumentEditor({documentId}: { documentId: string }) {
    return <Editor key={documentId} documentId={documentId}/>;
}
```

When `documentId` changes, the old `Editor` instance is replaced with a new one.

This resets component-local state and other instance-associated resources.

A key used in this way is not merely a list-management mechanism. It is an explicit instruction that a particular
identity should differ.

## Resetting a Subtree

Identity changes can reset an entire descendant subtree.

```tsx
function AccountPage({accountId}: { accountId: string }) {
    return (
        <AccountForm key={accountId} accountId={accountId}/>
    );
}
```

If `AccountForm` contains multiple stateful descendants, changing its key causes the keyed subtree to be replaced.

This can be useful when the semantic entity changes and preserving the previous editing state would be incorrect.

The tradeoff is that the reset is broad. Every descendant whose identity falls under the replaced subtree can lose local
state, refs, and other instance-specific resources.

## Identity and State Preservation

State preservation is one of the most visible consequences of component identity.

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(value => value + 1)}>
            {count}
        </button>
    );
}
```

If React preserves the `Counter` identity, `count` survives subsequent renders.

If React replaces the identity, the new instance starts with the initial state.

```tsx
<Counter key={version}/>
```

Changing `version` deliberately creates a new identity and therefore resets the state.

## Identity and Refs

Refs are also associated with component instances.

```tsx
function SearchBox() {
    const inputRef = useRef<HTMLInputElement>(null);

    return <input ref={inputRef}/>;
}
```

When the component instance is preserved, its ref state is preserved as part of that instance.

When the component is remounted, the new instance receives its own ref state and the previous instance is discarded.

This matters especially for imperative state such as DOM references and values stored in refs.

## Identity and Effects

Effects participate in component lifecycle behavior.

```tsx
function Subscription({topic}: { topic: string }) {
    useEffect(() => {
        const subscription = subscribe(topic);

        return () => subscription.unsubscribe();
    }, [topic]);

    return null;
}
```

Changing `topic` while preserving the component identity causes the effect to synchronize according to its dependency
semantics.

Changing the component identity instead creates a new component instance. The previous instance is removed and its
effects are cleaned up as part of that lifecycle transition before the new instance establishes its own effects.

Identity therefore affects lifecycle, but identity should not be confused with dependency-array behavior.

## Identity and Memoization

Memoization does not define component identity.

```tsx
const UserCard = memo(function UserCard({user}: Props) {
    return <article>{user.name}</article>;
});
```

`memo` can allow React to skip unnecessary rendering work when its comparison determines that rendering can be avoided.

It does not mean that the component receives a new identity whenever its props change, nor does it replace React's
identity model.

A component can preserve identity while rendering again, and a component can be remounted despite being memoized.

Memoization is therefore a rendering optimization rather than an identity mechanism.

## Identity and Referential Stability

Referential stability concerns whether a JavaScript value retains its reference identity across renders.

Component identity is a separate concept.

```tsx
function App() {
    const options = {enabled: true};

    return <Widget options={options}/>;
}
```

`options` is a new object on each render, but that does not inherently remount `Widget`.

Conversely, a component can be remounted while receiving exactly the same object reference.

The two concepts can interact through effects, memoization, selectors, and other mechanisms, but they should not be
conflated.

## Identity and Props

Changing props does not normally change component identity.

```tsx
function Profile({userId}: { userId: string }) {
    const [draft, setDraft] = useState("");

    return (
        <div>
            <span>{userId}</span>
            <input
                value={draft}
                onChange={event => setDraft(event.target.value)}
            />
        </div>
    );
}
```

Changing `userId` updates the existing `Profile` instance.

If the application requires a reset when the entity changes, that reset should be represented deliberately, for example
through a key or explicit state-transition logic.

Do not use changing props as evidence that a component has been recreated.

## Identity and Component Type

Changing the component type is a stronger identity change than changing its props.

```tsx
function Form() {
    return <input/>;
}

function Preview() {
    return <input/>;
}

function App({preview}: { preview: boolean }) {
    return preview ? <Preview/> : <Form/>;
}
```

Even though both components render an `input`, they represent different component types.

React should not be expected to preserve `Form` state as `Preview` state merely because the host output looks similar.

## Wrapper Changes

Adding or removing wrappers can affect the structure used for reconciliation.

```tsx
function App({wrapped}: { wrapped: boolean }) {
    return wrapped ? (
        <section>
            <Counter/>
        </section>
    ) : (
        <Counter/>
    );
}
```

The `Counter` changes structural position relative to the root.

This can affect whether React can preserve the previous identity. Refactoring JSX structure is therefore not always
semantically neutral when stateful components are involved.

A component's state should be considered part of the rendered tree's semantics rather than an independent property that
follows JSX wherever it moves.

## Identity and Fragments

Fragments allow multiple elements to occupy a structural position without introducing an additional DOM node.

```tsx
function App() {
    return (
        <>
            <Counter/>
            <Panel/>
        </>
    );
}
```

Fragments participate in the React element tree even though they do not normally produce a DOM element.

A keyed Fragment can also provide explicit identity to a group of elements.

```tsx
<Fragment key={groupId}>
    <Counter/>
    <Panel/>
</Fragment>
```

Changing the Fragment key can replace the keyed group and reset the relevant descendant identities.

## Identity and Lists

Lists introduce multiple sibling instances of the same component type.

```tsx
users.map(user => (
    <UserCard key={user.id} user={user}/>
))
```

The component type alone is insufficient to distinguish all the `UserCard` instances. The key supplies identity within
the sibling collection.

If users reorder, stable keys allow React to associate each rendered element with the corresponding existing identity
rather than treating the new ordering as a sequence of unrelated positions.

This is why keys are essential when the identity of items matters.

## Identity Is Local to the Tree

Keys are interpreted relative to their sibling collection. A key does not create a globally unique component identity.

```tsx
function App() {
    return (
        <>
            <UserCard key="42"/>
            <Sidebar>
                <UserCard key="42"/>
            </Sidebar>
        </>
    );
}
```

The two keys do not collide globally because they belong to different sibling collections.

Identity is consequently a property of the rendered tree rather than a global registry of component instances.

## Identity and State Ownership

Component identity should be considered when deciding where state belongs.

If a stateful component represents a stable conceptual entity, its identity should remain stable while the entity
remains the same.

```tsx
function ChatWindow({conversationId}: Props) {
    const [draft, setDraft] = useState("");

    return (
        <textarea
            value={draft}
            onChange={event => setDraft(event.target.value)}
        />
    );
}
```

If `conversationId` changes, the application must decide whether the draft belongs to the component instance or to the
conversation entity.

If the draft is inherently local to the current conversation view, using the conversation identity as a key may be
appropriate:

```tsx
<ChatWindow key={conversationId} conversationId={conversationId}/>
```

If drafts must survive switching between conversations, the state belongs at a higher ownership boundary instead.

Identity can expose an ownership problem rather than solve it.

## Identity and State Reset

There are two fundamentally different approaches to resetting state.

The first is an explicit state transition:

```tsx
setDraft("");
```

The second is replacing the component identity:

```tsx
<Editor key={documentId}/>
```

Explicit state transitions are appropriate when only particular state fields should change.

Identity replacement is appropriate when the semantic requirement is that the entire component instance represents a new
entity.

Do not use remounting as a substitute for ordinary state management when only a small subset of state needs resetting.

## Identity and Controlled Components

Controlled components generally receive their authoritative value from outside the component.

```tsx
<input
    value={value}
    onChange={event => setValue(event.target.value)}
/>
```

Changing the value does not require changing component identity.

This makes controlled state largely independent of remounting.

However, controlled components can still contain local state such as focus-related behavior, transient interaction
state, or internal implementation state. Deliberately changing their identity can still reset those resources.

## Identity and Uncontrolled Components

Identity is particularly visible with uncontrolled inputs.

```tsx
function NameField() {
    return <input defaultValue="Initial value"/>;
}
```

`defaultValue` establishes initial state rather than continuously controlling the current value.

If the component identity is preserved, changing the `defaultValue` prop does not mean the current input state is
automatically reset.

Changing the component key can force a new input instance:

```tsx
<NameField key={userId}/>
```

This can be a useful reset mechanism when an uncontrolled subtree must be reinitialized for a different entity.

## Identity and DOM State

Some state belongs to the DOM rather than React state.

Examples include:

* current value of an uncontrolled input;
* selection and caret position;
* focus;
* certain browser-managed element state;
* media playback state.

Replacing a component or host element can discard such state.

Consequently, deliberate identity changes can have effects beyond `useState`. A remount can reset browser-managed state
because the underlying DOM nodes may be replaced as part of the new tree.

## Identity and Animation

Animations often depend on whether an element is considered entering, leaving, or continuing.

Changing identity can intentionally make an element appear as a new instance.

```tsx
<AnimatedPanel key={panelId} panelId={panelId}/>
```

When `panelId` changes, animation infrastructure can observe the old and new identities as separate elements.

Stable identity is preferable when continuity should be preserved. Deliberate identity changes are useful when
replacement semantics are required.

## Identity and Focus

Focus is often associated with a particular DOM node.

```tsx
<input autoFocus/>
```

Remounting the component can create a new DOM node and therefore alter focus behavior.

This is especially important when using keys as reset mechanisms. A convenient state reset may also unexpectedly clear
focus, selection, or cursor position.

Identity changes should therefore be evaluated as lifecycle and DOM replacement operations, not merely as state resets.

## Identity and Portals

Portals allow React content to be rendered into a different DOM location while remaining part of the React tree.

```tsx
createPortal(
    <Dialog/>,
    document.body
);
```

The physical DOM destination is not the same thing as React component identity.

A component should not be considered a different React instance merely because its DOM is hosted elsewhere through a
portal. Identity remains a property of the React tree and reconciliation model.

## Identity and Server Rendering

Server rendering introduces an additional distinction between the server-generated representation and the client-side
React tree.

The server can produce HTML representing a component tree, while the client later establishes interactive React behavior
around that output.

Hydration is concerned with matching the client React tree to the server-rendered structure. Component identity remains
relevant because inconsistent tree structure, keys, or rendering conditions can prevent the client from matching the
expected server representation.

Hydration-specific behavior belongs to the hydration-boundary pattern; this file concerns identity itself.

## Identity and Server Components

Server Components and Client Components introduce execution boundaries, but those boundaries do not eliminate the need
for ordinary React identity reasoning.

A server-rendered component can produce different output when its inputs change, while a Client Component can preserve
browser-side state across compatible renders.

The important distinction is that component identity must be considered together with where the component executes and
where its state can exist.

Server Component architecture belongs to the Server Components pattern; this pattern focuses only on the identity
semantics that remain relevant within the resulting React tree.

## Identity and Suspense

Suspense can temporarily display fallback content while suspended content is not ready.

```tsx
<Suspense fallback={<Loading/>}>
    <Profile/>
</Suspense>
```

The fallback representation should not be interpreted simply as an ordinary prop change to `Profile`.

Suspense manages rendering readiness and fallback behavior. Component identity concerns which component instances React
preserves or replaces as the tree changes.

These concepts interact, but they solve different problems.

## Identity and Transitions

Transitions affect the scheduling priority of updates. They do not define component identity.

```tsx
startTransition(() => {
    setTab(nextTab);
});
```

Whether the resulting component is preserved or remounted depends on the reconciled tree, types, keys, and structure.

A transition can therefore contain an identity change, but the transition itself is not the cause of that identity rule.

## Identity and Deferred Values

`useDeferredValue` can provide a later version of a value to a subtree.

```tsx
const deferredQuery = useDeferredValue(query);

return <SearchResults query={deferredQuery}/>;
```

Changing the value does not inherently change `SearchResults` identity.

If the component type, position, and relevant key remain compatible, the same component instance can receive successive
deferred values.

Deferral concerns when a value is consumed; identity concerns whether the component instance continues to exist.

## Identity and External Stores

External-store subscriptions can survive component renders when the component identity is preserved.

```tsx
function Status() {
    const state = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot
    );

    return <span>{state.status}</span>;
}
```

Changing the external store snapshot does not itself remount `Status`.

If `Status` is replaced because its identity changes, the old subscription lifecycle ends and the new component
establishes its own subscription.

The ownership of the state remains external; component identity still governs the lifetime of the subscriber.

## Identity and Context

Context values can change without changing the identity of consumers.

```tsx
const ThemeContext = createContext("light");

function Button() {
    const theme = useContext(ThemeContext);

    return <button data-theme={theme}>Button</button>;
}
```

A new context value does not inherently create a new `Button` instance.

Context propagation and component identity are therefore separate mechanisms.

Changing a provider's value can cause consumers to render with new data while preserving their component instances.

## Identity and Dependency Injection

Context-based dependency injection follows the same principle.

```tsx
<ApiProvider client={client}>
    <Dashboard/>
</ApiProvider>
```

Changing the injected dependency does not automatically imply that `Dashboard` should be remounted.

Whether the dependency change should preserve or reset local state is an application design decision.

If a dependency represents a fundamentally different execution context, deliberate identity changes may be appropriate.
Otherwise, the existing component can remain alive and synchronize with the new dependency.

## Identity and Feature Boundaries

Feature-oriented component boundaries should avoid accidental identity changes.

```tsx
function CheckoutFeature({cartId}: Props) {
    return <CheckoutForm cartId={cartId}/>;
}
```

If the feature represents a stable workflow, its internal component identities should generally remain stable as
ordinary data changes.

If switching from one semantic workflow to another requires a clean state boundary, that boundary can be expressed
explicitly through component structure or keys.

Feature decomposition and component identity solve different architectural problems. Feature boundaries organize
ownership; identity controls continuity of component instances.

## Identity and Component Refactoring

Refactoring JSX can change component identity semantics even when the visual result appears unchanged.

For example, extracting a component:

```tsx
function Panel() {
    return <Counter/>;
}
```

and then using:

```tsx
<Panel/>
```

introduces a new component boundary.

The extracted `Panel` does not automatically make every refactoring behaviorally equivalent with respect to state
ownership, lifecycle, and identity.

Structural refactoring should therefore be evaluated not only for visual equivalence but also for state and lifecycle
semantics.

## Avoid Defining Identity Through Rendered Output

Do not attempt to reason about identity by comparing HTML output.

```tsx
function A() {
    return <div/>;
}

function B() {
    return <div/>;
}
```

`A` and `B` can render the same output while representing different component types.

Identity is semantic and structural, not visual.

This principle is particularly important when abstractions produce equivalent markup but different component boundaries.

## Avoid Accidental Remounts

Unnecessary identity changes can cause:

* local state resets;
* ref resets;
* effect cleanup and reinitialization;
* DOM node replacement;
* focus loss;
* uncontrolled input resets;
* browser state loss;
* unnecessary initialization work.

For example:

```tsx
function App({userId}: Props) {
    return <Editor key={Math.random()} userId={userId}/>;
}
```

Generating a new key during every render guarantees an identity change.

This is almost always incorrect because the component cannot maintain continuity between renders.

Keys should represent stable identity, not force React to recreate components on demand.

## Do Not Use Random Keys

Random keys destroy identity stability.

```tsx
items.map(item => (
    <Item key={Math.random()} item={item}/>
))
```

Each render can assign a different identity to every item.

React consequently cannot reliably associate the new elements with their previous instances.

Use stable identifiers instead.

```tsx
items.map(item => (
    <Item key={item.id} item={item}/>
))
```

## Do Not Use Changing Values as Accidental Identity

A value that changes frequently should not be used as a key merely because it is available.

```tsx
<Message key={message.timestamp} message={message}/>
```

If the timestamp changes while the message is conceptually the same entity, the component can be remounted
unnecessarily.

Identity should describe the entity's identity, not an arbitrary mutable property.

## Identity Should Match Semantic Continuity

A useful design test is:

**Should this component be considered the same instance after this update?**

If yes, preserve its identity.

If no, create a deliberate identity boundary.

For example, changing a user's display name usually should not create a new profile editor instance:

```tsx
<ProfileEditor user={user}/>
```

Changing from one user to another may require a reset:

```tsx
<ProfileEditor key={user.id} user={user}/>
```

The correct choice depends on the ownership and lifecycle semantics of the state.

## Identity Versus State Synchronization

A common mistake is using remounting to synchronize state that should instead be derived or explicitly synchronized.

```tsx
function Editor({value}: { value: string }) {
    const [draft, setDraft] = useState(value);

    return (
        <input
            value={draft}
            onChange={event => setDraft(event.target.value)}
        />
    );
}
```

If `value` changes, there may be a legitimate need to update `draft`, but remounting the entire component is not
automatically the correct solution.

The correct approach depends on whether `draft` represents independent local state, a derived value, or state that
should reset when an entity changes.

Identity should represent lifecycle semantics, not compensate for unclear state ownership.

## Identity Versus Conditional State

Similarly, do not create separate component identities merely to represent ordinary UI modes unless the modes genuinely
require independent lifecycle.

```tsx
function Panel({mode}: { mode: "view" | "edit" }) {
    return mode === "edit"
        ? <Editor/>
        : <Viewer/>;
}
```

If switching modes should discard the editor state, separate identities can be appropriate.

If switching modes should preserve the editor state, the architecture may need a stable editor instance whose visibility
or behavior changes instead.

Identity is therefore a deliberate state-preservation decision.

## Component Identity as a Lifecycle Boundary

A component identity boundary defines the lifetime of component-local resources.

Within a preserved identity, React can retain:

* state;
* refs;
* effect lifecycle;
* component-local subscriptions;
* uncontrolled DOM state associated with preserved host nodes;
* other instance-associated React data.

When identity is replaced, those resources belong to the old instance and do not automatically transfer to the new one.

This makes identity one of the fundamental lifecycle boundaries in React.

## Common Misuse

Common identity mistakes include:

* assuming every function invocation creates a new component instance;
* assuming changed props imply remounting;
* assuming identical rendered HTML means identical component identity;
* using random keys;
* using array indexes as keys when item identity is not positional;
* changing keys to force updates that should be handled by state;
* relying on remounting to synchronize unrelated state;
* assuming `memo` controls component identity;
* confusing JavaScript object identity with React component identity;
* ignoring focus and uncontrolled DOM state when deliberately remounting;
* accidentally changing component structure during refactoring and assuming state behavior is unchanged.

## Advantages

Explicit component identity provides a precise mechanism for controlling continuity.

Stable identity preserves component-local state and resources across compatible renders.

Deliberate identity changes provide a simple mechanism for resetting an entire subtree when the semantic entity or
lifecycle genuinely changes.

Identity also gives React enough information to associate rendered elements with existing component instances during
reconciliation.

## Disadvantages

Identity can be difficult to reason about when the rendered tree is structurally complex.

Small JSX changes can alter lifecycle and state-preservation behavior.

Incorrect keys can produce subtle state association bugs that are difficult to reproduce.

Using remounting as a generic reset mechanism can discard more state than intended and can unexpectedly affect focus,
uncontrolled inputs, effects, refs, and browser-managed state.

## When to Use

Preserve component identity when:

* the component represents the same conceptual entity;
* local state should survive prop changes;
* refs should remain associated with the existing instance;
* subscriptions should continue across ordinary updates;
* uncontrolled DOM state should be preserved;
* the component is continuing the same workflow.

Use a deliberate identity boundary when:

* switching to a different semantic entity requires a clean local state;
* an entire subtree must be reinitialized;
* uncontrolled inputs must be recreated;
* a workflow genuinely has a new lifecycle;
* an animation or transition requires distinct instances;
* preserving the old instance would represent incorrect application semantics.

## When Not to Use Identity Changes

Do not change component identity merely to:

* force a render;
* respond to an ordinary prop change;
* compensate for missing state synchronization;
* bypass unclear state ownership;
* force an effect to run;
* refresh data that has its own invalidation mechanism;
* trigger arbitrary initialization logic;
* avoid understanding existing local state.

Use the mechanism that corresponds to the actual requirement.

Rendering belongs to rendering. State transitions belong to state management. Effects belong to synchronization. Data
refresh belongs to the data lifecycle. Identity changes belong to lifecycle and state-continuity semantics.

## Design Rules

1. Treat component identity as a lifecycle concept, not a JavaScript function concept.
2. Preserve identity when the component represents the same conceptual instance.
3. Use stable keys when sibling identity matters.
4. Use keys deliberately when a subtree must reset.
5. Never generate keys randomly during render.
6. Do not infer identity from rendered HTML.
7. Do not confuse prop changes with remounting.
8. Do not confuse referential equality with component identity.
9. Remember that identity changes can reset more than React state.
10. Evaluate focus, uncontrolled inputs, refs, effects, subscriptions, and browser state before deliberately remounting.
11. Treat structural JSX refactoring as potentially relevant to state preservation.
12. Prefer explicit state transitions when only selected state should reset.
13. Move state upward when state must survive component identity changes.
14. Make identity correspond to semantic continuity rather than incidental values.
15. Use component identity as an intentional architectural boundary, not an accidental side effect.

## Relationship to Other Patterns

`stable-keys.md` defines how stable keys provide identity information in sibling collections and how key choice affects
reconciliation. This file focuses more broadly on component identity and the consequences of preserving or replacing an
instance.

`state-colocation.md` determines where state should live. Component identity determines whether that state remains
associated with the same component instance.

`state-lifting.md` addresses moving state to a higher owner when multiple components need to share or preserve it. This
becomes especially relevant when a component's identity can legitimately change.

`controlled-components.md` and `uncontrolled-components.md` describe state ownership. Identity affects how long that
owned state remains attached to a particular component or DOM instance.

`memoized-components.md` concerns render optimization. Memoization does not define identity.

`memoization-hooks.md` concerns memoized values and callbacks. Referential equality from memoization is distinct from
component identity.

`referential-stability.md` describes stable JavaScript references as a design property. Component identity is a React
tree property and should not be treated as the same mechanism.

`effect-synchronization.md` defines synchronization with external systems. Identity changes affect effect lifetime, but
effect dependencies determine synchronization within a preserved instance.

`ref-pattern.md` and `imperative-handle.md` define ref-based access to component and DOM capabilities. Identity
determines whether the existing ref-associated instance continues or is replaced.

`hydration-boundary.md` addresses the transition from server-rendered output to client-side interactivity. Identity
remains relevant during that process but is not equivalent to hydration.

`server-components.md` and `client-component-boundary.md` define execution and browser-ownership boundaries. Component
identity remains an independent React tree concept.

## Summary

Component identity determines whether React should regard a rendered component as the continuation of an existing
instance or as a new instance.

Identity is based on the structure and semantics of the rendered React tree, including component type, position, and
keys where applicable. It is not the same as JavaScript function invocation, object identity, rendered HTML identity, or
DOM identity.

Preserving identity allows component-local state, refs, effects, subscriptions, and other instance-associated resources
to continue across renders. Replacing identity establishes a new lifecycle and can reset an entire subtree.

The most important design rule is to make identity reflect semantic continuity. If the component represents the same
instance, preserve its identity. If it represents a genuinely new instance and its previous local state should not
survive, establish a deliberate identity boundary.

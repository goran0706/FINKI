# Slots

The Slots pattern is a React composition pattern in which a component exposes multiple named regions that consumers can
fill with custom content. The component owns the overall structure while consumers provide the concrete elements
rendered into specific regions.

The pattern is useful when a component has a stable structural layout but several independently customizable areas.
Instead of representing every possible variation through configuration props and conditional rendering, the component
exposes explicit composition points.

A simple example is:

```jsx
function Layout({header, sidebar, content, footer}) {
    return (
        <div className="layout">
            <header>{header}</header>
            <aside>{sidebar}</aside>
            <main>{content}</main>
            <footer>{footer}</footer>
        </div>
    );
}
```

Consumers provide the contents of each region:

```jsx
<Layout
    header={<Header/>}
    sidebar={<Navigation/>}
    content={<Dashboard/>}
    footer={<Footer/>}
/>
```

The component controls the layout, while the caller controls the implementation of each slot.

## Intent

Use Slots when a component has a known structural arrangement with multiple independently customizable regions.

The pattern provides:

* explicit named composition points;
* separation between layout and content;
* customization without modifying the component;
* a stable structural contract;
* reuse of the same layout with different content;
* reduced conditional rendering inside the component;
* clearer ownership of structural responsibilities.

Slots are particularly useful for layouts, dialogs, cards, panels, pages, navigation shells, tables, toolbars, and other
components with recognizable regions.

## Basic Form

A slot is normally represented by a prop containing a React node.

```jsx
function Card({
                  header,
                  children,
                  footer
              }) {
    return (
        <article className="card">
            {header && (
                <header className="card-header">
                    {header}
                </header>
            )}

            <div className="card-body">
                {children}
            </div>

            {footer && (
                <footer className="card-footer">
                    {footer}
                </footer>
            )}
        </article>
    );
}
```

The consumer controls each region independently.

```jsx
<Card
    header={<h2>Account</h2>}
    footer={<button>Save</button>}
>
    <AccountForm/>
</Card>
```

Here `children` acts as the primary content slot, while `header` and `footer` are named slots.

## `children` as a Slot

The `children` prop is itself a form of composition point.

```jsx
function Panel({children}) {
    return (
        <section className="panel">
            {children}
        </section>
    );
}
```

When a component has only one primary insertion point, `children` is usually preferable to inventing a named `content`
prop.

Named slots become useful when there are multiple semantically distinct regions.

```jsx
function Dialog({
                    title,
                    body,
                    actions
                }) {
    return (
        <div role="dialog">
            <header>{title}</header>
            <section>{body}</section>
            <footer>{actions}</footer>
        </div>
    );
}
```

The distinction is primarily about the number and semantics of composition points.

## Element-Valued Slots

The simplest slot API accepts React elements.

```jsx
function Page({
                  header,
                  navigation,
                  content
              }) {
    return (
        <>
            <header>{header}</header>
            <nav>{navigation}</nav>
            <main>{content}</main>
        </>
    );
}
```

Usage:

```jsx
<Page
    header={<SiteHeader/>}
    navigation={<Navigation/>}
    content={<Dashboard/>}
/>
```

This gives the consumer complete control over the supplied element.

The receiving component does not need to know the implementation of the element. It only knows where that element
belongs in the layout.

## Component-Valued Slots

A slot can instead accept a component type.

```jsx
function Page({
                  Header,
                  Navigation,
                  Content
              }) {
    return (
        <>
            <Header/>
            <Navigation/>
            <Content/>
        </>
    );
}
```

Usage:

```jsx
<Page
    Header={AdminHeader}
    Navigation={AdminNavigation}
    Content={AdminDashboard}
/>
```

This is different from an element-valued slot.

```jsx
<Page header={<AdminHeader/>}/>
```

The element is already created by the caller. A component-valued slot gives the receiving component control over
creating the component.

That distinction becomes important when the receiving component needs to provide props, context, or other information to
the supplied component.

## Passing Data to a Slot

Sometimes the layout component owns information that a slot needs.

An element-valued slot cannot naturally receive additional props after it has been supplied.

```jsx
<Page
    header={<Header/>}
/>
```

If `Page` needs to provide data to the header, a component-valued slot may be more appropriate.

```jsx
function Page({Header}) {
    const title = "Dashboard";

    return (
        <header>
            <Header title={title}/>
        </header>
    );
}
```

The component-valued slot establishes an explicit contract for the props supplied by the receiving component.

Another option is a function-valued slot.

```jsx
function Page({renderHeader}) {
    const title = "Dashboard";

    return (
        <header>
            {renderHeader({title})}
        </header>
    );
}
```

This moves the API toward the Render Props pattern. The distinction matters because a function-valued slot is no longer
merely supplying content; it establishes a data-to-rendering callback contract.

## Slot Ownership

The component that defines a slot owns the structural responsibility associated with that region.

```jsx
function DashboardLayout({
                             sidebar,
                             children
                         }) {
    return (
        <div className="dashboard">
            <aside>{sidebar}</aside>
            <main>{children}</main>
        </div>
    );
}
```

`DashboardLayout` owns the fact that the sidebar is an `aside` and that the main content belongs in `main`.

The consumer owns what appears inside those regions.

This distinction allows layout components to enforce structural and accessibility invariants without controlling
application-specific content.

## Layout and Content Separation

Slots are especially useful when the structure of a UI is stable while its content varies.

```jsx
function SettingsLayout({
                            navigation,
                            content
                        }) {
    return (
        <div className="settings-layout">
            <aside>
                {navigation}
            </aside>

            <main>
                {content}
            </main>
        </div>
    );
}
```

Different features can reuse the same structural layout.

```jsx
<SettingsLayout
    navigation={<SettingsNavigation/>}
    content={<ProfileSettings/>}
/>
```

```jsx
<SettingsLayout
    navigation={<SettingsNavigation/>}
    content={<SecuritySettings/>}
/>
```

The layout does not need to know which settings screen is being rendered.

## Optional Slots

Slots can be optional.

```jsx
function Card({
                  header,
                  children,
                  footer
              }) {
    return (
        <article>
            {header && <header>{header}</header>}

            <div>{children}</div>

            {footer && <footer>{footer}</footer>}
        </article>
    );
}
```

Optional slots should have clearly defined semantics.

The component should determine whether absence means:

* omit the region entirely;
* render an empty structural element;
* use a default;
* disable a related feature.

For example, omitting the `<header>` element may be preferable to rendering an empty header when the semantic region
does not exist.

## Default Slot Content

A slot can provide a default implementation.

```jsx
function Dialog({
                    actions = <DefaultActions/>
                }) {
    return (
        <div role="dialog">
            <footer>{actions}</footer>
        </div>
    );
}
```

Consumers can override the default when necessary.

```jsx
<Dialog
    actions={
        <>
            <button>Cancel</button>
            <button>Confirm</button>
        </>
    }
/>
```

Defaults should represent genuinely reusable behavior rather than hiding important application behavior.

## Named Regions

Slots are most useful when each region has a semantic purpose.

```jsx
function PageShell({
                       topBar,
                       navigation,
                       main,
                       aside,
                       bottomBar
                   }) {
    return (
        <div className="page-shell">
            {topBar}
            <div className="page-body">
                {navigation}
                <main>{main}</main>
                {aside}
            </div>
            {bottomBar}
        </div>
    );
}
```

The names communicate the component's structural contract.

Names such as `header`, `sidebar`, `actions`, and `footer` generally provide more useful information than generic names
such as `slot1`, `slot2`, and `slot3`.

## Slot Contracts

Each slot should have a clear contract.

A slot contract can define:

* whether the slot is required;
* whether it is optional;
* which content is accepted;
* whether the component supplies props;
* whether the content must satisfy an accessibility requirement;
* whether the slot may contain arbitrary descendants;
* whether the slot is rendered once or multiple times.

For example:

```jsx
function Dialog({
                    title,
                    actions,
                    children
                }) {
    return (
        <div role="dialog">
            <h2>{title}</h2>
            <div>{children}</div>
            <footer>{actions}</footer>
        </div>
    );
}
```

The API establishes that `title` belongs to the dialog heading, `children` is the body, and `actions` belongs to the
action region.

A good slot API communicates these responsibilities without requiring consumers to understand the component's internal
implementation.

## Multiple Instances

A slot can be rendered multiple times if that is part of its contract.

```jsx
function Repeated({
                      content
                  }) {
    return (
        <>
            {content}
            {content}
        </>
    );
}
```

However, rendering the same React element multiple times can have implications for component identity and state.

If the intention is to create separate component instances, the receiving component should accept a component type or
render function instead.

```jsx
function Repeated({
                      Content
                  }) {
    return (
        <>
            <Content/>
            <Content/>
        </>
    );
}
```

This distinction should be explicit in the API.

## Slot Props

A slot can receive data through a function.

```jsx
function Table({
                   rows,
                   renderRow
               }) {
    return (
        <table>
            <tbody>
            {rows.map(row => (
                <React.Fragment key={row.id}>
                    {renderRow(row)}
                </React.Fragment>
            ))}
            </tbody>
        </table>
    );
}
```

Usage:

```jsx
<Table
    rows={users}
    renderRow={user => (
        <tr>
            <td>{user.name}</td>
        </tr>
    )}
/>
```

This is function-based composition and is more precisely classified as a Render Props pattern when the callback is the
primary abstraction.

The Slot pattern should therefore not absorb every function callback into its definition. A normal slot supplies
content; a render prop supplies a rendering function with data.

## Slot Props in TypeScript

A component-valued slot can be explicitly typed.

```tsx
interface HeaderProps {
    title: string;
}

interface LayoutProps {
    Header: React.ComponentType<HeaderProps>;
}

function Layout({Header}: LayoutProps) {
    return (
        <header>
            <Header title="Dashboard"/>
        </header>
    );
}
```

An element-valued slot is simpler.

```tsx
interface LayoutProps {
    header: React.ReactNode;
    children: React.ReactNode;
}
```

A function-valued slot can expose an explicit input contract.

```tsx
interface HeaderSlotProps {
    title: string;
}

interface LayoutProps {
    renderHeader: (
        props: HeaderSlotProps
    ) => React.ReactNode;
}
```

The type should reflect the actual composition mechanism rather than making all slots generic.

## Slot Props and Dependency Direction

Slots establish dependency direction from the consumer toward the layout component.

The layout defines where content belongs. The consumer chooses the concrete content.

```jsx
function ApplicationPage() {
    return (
        <PageLayout
            sidebar={<ApplicationNavigation/>}
            content={<ApplicationContent/>}
        />
    );
}
```

`PageLayout` does not need to import `ApplicationNavigation` or `ApplicationContent`.

This reduces coupling between reusable layout components and application-specific components.

## Slots and Inversion of Control

A slot is a simple form of inversion of control.

The component controls when and where supplied content is rendered, while the consumer controls what that content is.

```jsx
function Modal({content}) {
    return (
        <div role="dialog">
            {content}
        </div>
    );
}
```

The modal determines the rendering location. The caller determines the content.

This is one of the reasons Slots are effective for reusable UI infrastructure.

## Slots and Context

Slots can be combined with Context when supplied content needs access to state owned by the receiving component.

```jsx
const DialogContext = createContext(null);

function Dialog({header, children}) {
    const [open, setOpen] = useState(true);

    return (
        <DialogContext.Provider value={{open, setOpen}}>
            <section role="dialog">
                {header}
                {children}
            </section>
        </DialogContext.Provider>
    );
}
```

A supplied element rendered within the provider can consume the context.

```jsx
function DialogHeader() {
    const {setOpen} = useContext(DialogContext);

    return (
        <header>
            <button onClick={() => setOpen(false)}>
                Close
            </button>
        </header>
    );
}
```

This introduces an important distinction.

The slot determines where the content is inserted. Context determines how descendants can access shared state.

If the component requires a coordinated family of descendants, the design may be better classified as Compound
Components.

## Slots and Compound Components

Slots and Compound Components are related but distinct.

A slot exposes a region into which arbitrary content can be inserted.

```jsx
<Dialog
    header={<DialogHeader/>}
    actions={<DialogActions/>}
>
    <DialogBody/>
</Dialog>
```

A Compound Component exposes a coordinated family of components.

```jsx
<Dialog>
    <Dialog.Header/>
    <Dialog.Body/>
    <Dialog.Actions/>
</Dialog>
```

The second form implies a component protocol. `Dialog.Header`, `Dialog.Body`, and `Dialog.Actions` may depend on shared
dialog state and behavior.

The first form does not inherently require such coordination.

Slots therefore describe named insertion points, while Compound Components describe coordinated component members.

## Slots and Ordinary Composition

Slots are a specialization of ordinary component composition.

Ordinary composition might use:

```jsx
<Card>
    <Profile/>
</Card>
```

Slots introduce multiple named composition points:

```jsx
<Card
    header={<CardHeader/>}
    footer={<CardFooter/>}
>
    <Profile/>
</Card>
```

The underlying mechanism is still props and React nodes. The Slot pattern becomes meaningful because the component
defines several semantically named regions.

## Slots and Render Props

A React node slot provides content:

```jsx
<Layout
    sidebar={<Sidebar/>}
/>
```

A render prop provides a function:

```jsx
<Layout
    renderSidebar={data => (
        <Sidebar data={data}/>
    )}
/>
```

The second API allows the layout to provide data to the rendering function.

That makes the second pattern behavior-oriented rather than simply structural.

Render Props should therefore remain a separate pattern.

## Slots and Higher-Order Components

Higher-Order Components operate by transforming components.

```jsx
const Enhanced = withFeature(Component);
```

Slots operate by supplying content to a rendered component.

```jsx
<Layout
    sidebar={<Sidebar/>}
/>
```

The two patterns can be combined, but they solve different composition problems.

## Slots and Custom Hooks

Custom Hooks compose stateful behavior.

Slots compose UI regions.

A layout may use a Custom Hook internally while exposing Slots to consumers.

```jsx
function DashboardLayout({
                             sidebar,
                             children
                         }) {
    const isMobile = useResponsiveLayout();

    return (
        <div data-mobile={isMobile}>
            {sidebar}
            {children}
        </div>
    );
}
```

The Hook controls internal behavior; the slots control supplied UI.

## Slots and Conditional Rendering

Slots can reduce conditional rendering inside reusable components.

Instead of:

```jsx
function Page({type}) {
    return (
        <>
            {type === "admin" && <AdminHeader/>}
            {type === "user" && <UserHeader/>}
            {type === "guest" && <GuestHeader/>}
        </>
    );
}
```

the consumer can select the appropriate implementation.

```jsx
<Page
    header={
        user.isAdmin
            ? <AdminHeader/>
            : <UserHeader/>
    }
/>
```

The page layout does not need to know about the application's header variants.

This moves application-specific selection toward the composition boundary.

## Slots and State Ownership

The layout should not automatically own the state of the content supplied to its slots.

```jsx
function Layout({sidebar}) {
    return (
        <div>
            <aside>{sidebar}</aside>
        </div>
    );
}
```

If `sidebar` contains a navigation component with its own state, that state belongs to the navigation component unless
the layout must coordinate it.

The slot boundary should not become an excuse to centralize unrelated state.

## Slots and Accessibility

The component defining the slot remains responsible for the semantics of the region it owns.

```jsx
function Layout({navigation, children}) {
    return (
        <div>
            <nav aria-label="Primary">
                {navigation}
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
}
```

The consumer supplies the navigation content, but the layout establishes the semantic region.

This allows reusable layout components to preserve accessibility guarantees while remaining customizable.

Some slots may require stronger contracts.

For example, a dialog's title slot may need to produce a heading that is referenced by `aria-labelledby`. An arbitrary
`ReactNode` does not guarantee that requirement.

In such cases, a specialized component protocol may be more appropriate than an unrestricted slot.

## Slot Ordering

The component controls the rendering order of slots.

```jsx
function Layout({
                    header,
                    sidebar,
                    content,
                    footer
                }) {
    return (
        <>
            {header}
            <div>
                {sidebar}
                {content}
            </div>
            {footer}
        </>
    );
}
```

The consumer cannot reorder those regions without changing the component's API.

This is desirable when the layout owns the structural contract.

If consumers must freely reorder structural regions, the abstraction may be too restrictive or the layout may need to
expose a more flexible composition model.

## Slot Granularity

Slots should correspond to meaningful regions.

Too few slots can make customization difficult.

```jsx
<Page
    content={<EverythingInsideThePage/>}
/>
```

Too many slots can make the API cumbersome.

```jsx
<Page
    topLeft={...}
    topCenter={...}
    topRight={...}
    middleLeft={...}
    middleCenter={...}
    middleRight={...}
/>
```

A good slot boundary represents a meaningful semantic or structural unit.

## Slot Granularity and Component Boundaries

A slot does not necessarily imply that every supplied region needs to become its own component.

This is valid:

```jsx
<Card
    footer={
        <>
            <button>Cancel</button>
            <button>Save</button>
        </>
    }
/>
```

The footer content can remain inline if it is simple.

A dedicated component becomes useful when the region has independent behavior, reuse, or a meaningful abstraction.

## Default and Custom Implementations

A reusable component can provide defaults while allowing slots to override them.

```jsx
function Panel({
                   header = <DefaultHeader/>,
                   footer = <DefaultFooter/>,
                   children
               }) {
    return (
        <section>
            {header}
            {children}
            {footer}
        </section>
    );
}
```

This creates a balance between convenience and customization.

The defaults should remain part of the documented contract because replacing a slot may affect behavior or
accessibility.

## Performance

Slots generally have little inherent performance cost beyond normal React composition.

Performance can nevertheless be affected by:

* recreating slot elements;
* unstable slot props;
* expensive slot rendering;
* context consumed by slot descendants;
* repeated rendering of the same slot;
* broad parent state updates.

For example:

```jsx
function Page({user}) {
    return (
        <Layout
            sidebar={<Sidebar user={user}/>}
            content={<Content user={user}/>}
        />
    );
}
```

When `Page` rerenders, the supplied elements are recreated as part of that render.

This is normally acceptable. Optimization should be driven by measured rendering costs rather than by the existence of
slots.

## Component Identity

Passing an element as a slot preserves the identity semantics of that element within its rendered position.

```jsx
<Layout
    sidebar={<Sidebar/>}
/>
```

If the slot switches to a different component type:

```jsx
<Layout
    sidebar={isAdmin ? <AdminSidebar/> : <UserSidebar/>}
/>
```

React may treat the two branches as different component identities.

If state preservation across implementations is important, the component structure and keys should be designed
deliberately.

Slots do not override React's normal reconciliation rules.

## Repeated Rendering

A slot should not be assumed to be a reusable template.

Consider:

```jsx
function Layout({item}) {
    return (
        <>
            {item}
            {item}
        </>
    );
}
```

The same React element is being rendered twice.

If the intent is to create two independent instances, use a component or render function.

```jsx
function Layout({Item}) {
    return (
        <>
            <Item/>
            <Item/>
        </>
    );
}
```

This distinction is important when the supplied content contains stateful components.

## Async Content

Slots can contain components that perform asynchronous work.

```jsx
<Layout
    content={<UserDashboard/>}
/>
```

The layout does not need to know whether `UserDashboard` performs data fetching, suspends, or renders asynchronously.

This keeps the layout structurally independent of the implementation of its content.

If the layout itself must coordinate loading or error states for a slot, those states should become part of the slot
contract.

## Loading and Error Slots

A component can expose dedicated slots for loading and error content.

```jsx
function DataPanel({
                       loading,
                       error,
                       content
                   }) {
    if (loading) {
        return loading;
    }

    if (error) {
        return error;
    }

    return content;
}
```

This can be useful when the component owns the loading state but should not prescribe the visual representation.

However, if the component does not own the asynchronous operation, it may be cleaner for the parent to choose the entire
content state instead.

The slot should represent a real ownership boundary rather than merely moving conditional rendering around.

## Type Safety and Accessibility

An unrestricted `ReactNode` slot provides maximum flexibility but weakens static guarantees.

```tsx
interface DialogProps {
    title: React.ReactNode;
}
```

The type system cannot guarantee that `title` contains an appropriate heading.

A stronger API can use a specialized component:

```tsx
interface DialogTitleProps {
    children: React.ReactNode;
}

function DialogTitle({
                         children
                     }: DialogTitleProps) {
    return <h2>{children}</h2>;
}
```

The API then moves from an unrestricted Slot toward a Compound Component or specialized component protocol.

The correct level of constraint depends on how strongly the component must enforce its invariants.

## Testing

Slot-based components should be tested according to their structural contracts.

Tests should verify:

* each slot renders in the correct region;
* optional slots behave correctly when absent;
* default slots are applied when appropriate;
* supplied content remains intact;
* structural semantics are preserved;
* accessibility relationships remain valid;
* slot content can contain arbitrary supported descendants;
* component identity behaves correctly when slot implementations change.

Tests should not normally inspect the internal implementation used to render the slot.

## Common Misuse

### Too Many Slots

A component with an excessive number of slots may be exposing its entire implementation structure.

```jsx
<Component
    headerLeft={...}
    headerCenter={...}
    headerRight={...}
    bodyTop={...}
    bodyCenter={...}
    bodyBottom={...}
    footerLeft={...}
    footerCenter={...}
    footerRight={...}
/>
```

At some point, consumers are effectively reconstructing the component themselves.

A better design may expose fewer semantic regions or allow the entire region to be supplied as `children`.

### Generic Slot Names

Names such as `slotA`, `slotB`, and `slotC` communicate implementation details rather than meaning.

Prefer names based on the semantic role of the region.

```jsx
<Dialog
    title={...}
    actions={...}
/>
```

is clearer than:

```jsx
<Dialog
    slot1={...}
    slot2={...}
/>
```

### Slots Used for State Management

Slots should not become a mechanism for moving unrelated state into a layout component.

The component should own only the state necessary for its structural and behavioral responsibilities.

### Hidden Requirements

If a slot must contain a specific component or provide a specific property, accepting arbitrary `ReactNode` can create a
misleading API.

In that case, use a stronger component protocol.

### Replacing Every Prop With a Slot

Not every variable value should become a React node.

This:

```jsx
<Button
    label="Save"
/>
```

does not necessarily become better as:

```jsx
<Button
    label={<span>Save</span>}
/>
```

A normal prop is often the correct API when the value is data rather than structure.

Slots should be used when consumers need control over rendered content or structure.

## Refactoring Toward Slots

A component can often be refactored toward Slots when it contains repeated conditional rendering for
application-specific variations.

Before:

```jsx
function Page({mode}) {
    return (
        <div>
            {mode === "admin" ? (
                <AdminHeader/>
            ) : (
                <UserHeader/>
            )}

            <main>
                {mode === "admin" ? (
                    <AdminContent/>
                ) : (
                    <UserContent/>
                )}
            </main>
        </div>
    );
}
```

After:

```jsx
function Page({
                  header,
                  content
              }) {
    return (
        <div>
            {header}
            <main>{content}</main>
        </div>
    );
}
```

The caller chooses the concrete implementations:

```jsx
<Page
    header={isAdmin ? <AdminHeader/> : <UserHeader/>}
    content={isAdmin ? <AdminContent/> : <UserContent/>}
/>
```

The reusable component no longer needs to know about application-specific modes.

## Decision Criteria

Use Slots when:

* the component has multiple meaningful structural regions;
* those regions need independent customization;
* the component should own the layout;
* consumers should provide the concrete content;
* the structure is stable while the content varies;
* named regions make the API easier to understand.

Prefer ordinary `children` composition when there is only one primary insertion point.

Prefer normal props when the varying value is data rather than UI structure.

Prefer Compound Components when the supplied components must participate in a shared state or behavior protocol.

Prefer Render Props when the receiving component needs to supply data or behavior to a rendering function.

Prefer Custom Hooks when the primary concern is reusable stateful logic rather than UI structure.

## Summary

The Slots pattern provides named composition points within a React component.

The component owns the overall structure, while consumers supply the content rendered into specific regions. Slots can
be represented by `children`, element-valued props, component-valued props, or, in more specialized cases,
function-valued props.

The most important distinction is between structural customization and behavioral coordination. A simple slot supplies
content to a region. A Compound Component establishes a shared protocol between related components. A Render Prop
supplies a rendering function that receives data or behavior. A normal prop supplies data.

Slots are most effective when a component has a stable structural contract with a small number of meaningful regions
that vary independently. They become counterproductive when every internal implementation detail is exposed as a slot or
when slots are used to replace ordinary data props.

The pattern is therefore fundamentally about separating layout ownership from content ownership while preserving a clear
and deliberate component API.

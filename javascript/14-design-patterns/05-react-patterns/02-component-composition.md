# Component Composition

Component composition is the primary React pattern for building complex components by combining smaller components rather than creating large components that own every piece of behavior and presentation. A composed component delegates responsibilities to its children and collaborators through React's component model, props, `children`, context, and other composition mechanisms.

The central idea is that a component should expose meaningful composition points rather than requiring consumers to modify its internal implementation. A component defines the responsibilities it owns while allowing the surrounding component tree to determine which concrete pieces participate in the resulting UI.

## Intent

Use component composition to construct a larger UI component from smaller, independently understandable components.

The pattern provides a way to:

* divide a complex UI into cohesive components;
* isolate responsibilities;
* reuse components in different contexts;
* allow consumers to control parts of a component's structure;
* reduce inheritance and conditional branching;
* keep component APIs explicit;
* make variations possible without modifying the component's implementation;
* establish clear ownership of state and behavior.

Composition is particularly important in React because React's component model is fundamentally based on assembling components into trees. Most reusable React abstractions are therefore expressed through composition rather than class inheritance.

## Basic Form

A component can accept other components or elements as props and render them as part of its own structure.

```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </section>
  );
}

function Profile() {
  return (
    <Card title="Profile">
      <p>Account information</p>
      <button>Edit</button>
    </Card>
  );
}
```

`Card` owns the card structure while the caller owns the contents of the body. The component therefore provides structure without hard-coding every possible child.

The same principle can be expressed using component-valued props.

```jsx
function Page({ header, content, footer }) {
  return (
    <div className="page">
      {header}
      <main>{content}</main>
      {footer}
    </div>
  );
}
```

The exact mechanism is less important than the ownership boundary: the parent component establishes the structural contract while consumers supply the parts that are intended to vary.

## Composition Through `children`

The `children` prop is the most fundamental React composition mechanism.

```jsx
function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

Consumers can provide arbitrary React nodes.

```jsx
<Panel>
  <h2>Settings</h2>
  <p>Configure your account.</p>
</Panel>
```

`children` is appropriate when the component has one primary insertion point. It allows the component to control its outer structure without prescribing the exact contents.

A component should not automatically expose every internal element through `children`. Composition works best when the component has a clear structural contract.

## Multiple Composition Points

Components can expose multiple named composition points through props.

```jsx
function Dialog({ title, body, actions }) {
  return (
    <section className="dialog">
      <header>{title}</header>
      <div>{body}</div>
      <footer>{actions}</footer>
    </section>
  );
}
```

A consumer can then independently supply each region.

```jsx
<Dialog
  title={<h2>Delete account</h2>}
  body={<p>This action cannot be undone.</p>}
  actions={
    <>
      <button>Cancel</button>
      <button>Delete</button>
    </>
  }
/>
```

This is still ordinary component composition. A more formalized version of this idea is commonly called the Slots pattern and should be treated separately when slot semantics become an explicit part of the component API.

## Composition With Component Props

A component can receive a component or component-like value when the component itself needs to instantiate or configure that component.

```jsx
function List({ items, Item }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
}
```

The caller chooses the presentation component.

```jsx
function UserItem({ item }) {
  return <span>{item.name}</span>;
}

<List items={users} Item={UserItem} />
```

This differs from passing an already-created React element.

```jsx
function Layout({ sidebar }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
    </div>
  );
}
```

```jsx
<Layout sidebar={<Navigation />} />
```

A component-valued prop gives the receiving component control over instantiation and props. An element-valued prop gives the caller control over the already-created element. The distinction matters when the receiving component needs to supply data, configuration, or lifecycle-sensitive props.

## Ownership

Composition is fundamentally an ownership pattern.

A component should own the state and behavior required to fulfill its responsibility, while the parent should own state that must coordinate multiple children or survive independently of one child.

For example:

```jsx
function SearchBox({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <SearchBox
      value={query}
      onChange={setQuery}
    />
  );
}
```

`SearchBox` owns the input representation, while `SearchPage` owns the search query because that state may be relevant to other parts of the page.

Composition does not require that all state live in the parent. Moving every piece of state upward merely because components are composed produces unnecessary coupling. State should remain as close as possible to the components that require it unless broader ownership is necessary.

## Parent and Child Responsibilities

Composition establishes a boundary between structural responsibility and supplied behavior or content.

A parent component commonly owns:

* layout;
* coordination;
* state shared between children;
* lifecycle of the composed subtree;
* domain-independent structural behavior.

A child commonly owns:

* its internal presentation;
* behavior that does not need to be coordinated externally;
* local state;
* implementation details of its own UI.

These are conventions rather than rigid rules. A child can expose controlled state to its parent, and a parent can delegate almost all implementation details to composed children.

## Composition Over Conditional Configuration

A component can become difficult to maintain when it attempts to represent every variation through boolean and enum props.

```jsx
<Button
  primary
  large
  rounded
  loading
  destructive
  iconLeft
  iconRight
/>
```

Some configuration is legitimate, but a growing collection of orthogonal flags can indicate that the component is accumulating unrelated responsibilities.

Composition can move variation into separate components.

```jsx
function SaveAction() {
  return (
    <Button>
      <SaveIcon />
      Save
    </Button>
  );
}

function DeleteAction() {
  return (
    <Button>
      <DeleteIcon />
      Delete
    </Button>
  );
}
```

The goal is not to eliminate props. Props are themselves one of React's fundamental composition mechanisms. The goal is to avoid encoding every structural variation as conditional logic inside one component.

## Composition and Dependency Direction

Composition also determines dependency direction.

A reusable low-level component should generally not need to know the concrete application-level component that will use it.

```jsx
function Modal({ children }) {
  return (
    <div role="dialog">
      {children}
    </div>
  );
}
```

Application code composes the generic component with domain-specific content.

```jsx
<Modal>
  <DeleteAccountForm />
</Modal>
```

The generic component depends only on the contract necessary to provide its structural behavior. The application supplies the domain-specific implementation.

This supports dependency inversion at the component level: reusable infrastructure provides extension points while higher-level components decide which concrete pieces participate.

## Composition and State Sharing

Composition becomes particularly useful when several components need coordinated state.

```jsx
function Tabs({ children, activeTab, onChange }) {
  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          activeTab,
          onChange
        })
      )}
    </div>
  );
}
```

However, direct manipulation of children with `cloneElement` introduces coupling to the expected child structure. Context or a more explicit composition API is often preferable when the relationship becomes substantial.

A common design is for a parent component to own shared state while composed descendants consume that state through explicit props or context.

```jsx
function Form({ children }) {
  const [values, setValues] = useState({});

  return (
    <FormContext.Provider value={{ values, setValues }}>
      {children}
    </FormContext.Provider>
  );
}
```

This moves the design toward the Provider and Context patterns rather than ordinary prop composition alone.

## Composition and `React.Children`

React provides utilities for working with the `children` prop.

```jsx
function Stack({ children }) {
  const items = React.Children.toArray(children);

  return (
    <div className="stack">
      {items}
    </div>
  );
}
```

`React.Children` can normalize opaque children structures and make certain structural operations possible.

However, manipulating children should not be treated as a general-purpose component architecture technique. When a component needs to inspect, clone, inject props into, or otherwise interpret its children extensively, the API is often becoming a specialized composition pattern such as compound components, render props, or a context-based protocol.

## Composition and `cloneElement`

`cloneElement` can be used to augment a supplied element.

```jsx
function Highlight({ children }) {
  return React.cloneElement(children, {
    className: "highlight"
  });
}
```

This is useful when a component has a tightly defined relationship with the element it receives.

It also has significant limitations. The receiving component must understand the element's expected props, injected properties can collide with consumer-provided properties, and the resulting API becomes dependent on the concrete child implementation.

For more complex relationships, explicit props, context, render props, or compound components usually provide clearer contracts.

## Composition With Functions

Composition does not require components to receive only React elements. A function can be supplied as a composition point.

```jsx
function DataView({ data, render }) {
  return (
    <section>
      {render(data)}
    </section>
  );
}
```

```jsx
<DataView
  data={user}
  render={user => (
    <div>{user.name}</div>
  )}
/>
```

This is the basis of the Render Props pattern. The general principle remains composition, but the function callback introduces a specific reusable protocol and therefore belongs conceptually to the more specialized Render Props pattern.

## Composition and Custom Hooks

Custom Hooks provide another form of composition, but they compose behavior rather than UI structure.

```jsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}
```

```jsx
function StatusIndicator() {
  const online = useOnlineStatus();

  return <span>{online ? "Online" : "Offline"}</span>;
}
```

The UI components remain independently composable while the Hook encapsulates reusable stateful behavior.

Custom Hooks therefore represent a distinct React composition pattern. They should not be treated as merely another spelling of component composition.

## Composition and Inheritance

React components can technically use JavaScript class inheritance, but inheritance is generally not the primary mechanism for composing React behavior.

Composition avoids requiring a component to inherit implementation details from a base component.

Instead of:

```jsx
class SpecialButton extends BaseButton {
  render() {
    // specialized implementation
  }
}
```

composition typically looks like:

```jsx
function SpecialButton({ children }) {
  return (
    <Button>
      <SpecialIcon />
      {children}
    </Button>
  );
}
```

The specialized component delegates common behavior to an existing component and controls the additional structure itself.

This is one reason composition is generally preferred when multiple independent dimensions of variation must be combined.

## Composition and Reuse

Composition does not necessarily mean maximizing reuse.

A component should be reusable when reuse provides a meaningful architectural benefit. Excessive abstraction can produce components whose APIs exist primarily to support hypothetical future use cases.

A useful component boundary generally corresponds to a coherent responsibility, a meaningful reuse boundary, an independently testable behavior, or an independently varying part of the UI.

A component that merely wraps another component without establishing a useful contract may add indirection without providing meaningful composition.

## Composition and Component Identity

Composition interacts directly with React's reconciliation model.

The structure of the rendered component tree affects component identity and therefore state preservation. Changing the type at a position can cause React to treat the subtree as a different component.

```jsx
function View({ compact }) {
  return compact
    ? <CompactView />
    : <FullView />;
}
```

Here the two branches represent different component types. Switching between them can result in different component identity and state behavior.

Composition APIs should therefore be designed with awareness of whether changing a supplied component, element, or structural branch is expected to preserve or replace state.

Keys are also part of this identity model, but key management is a separate React reconciliation concern rather than a component-composition mechanism.

## Composition and Accessibility

Composition must preserve semantic and accessibility contracts.

A generic component should not assume that arbitrary children satisfy accessibility requirements.

For example, a component that renders a labeled control must ensure that its composition API provides enough information to associate the label and control correctly.

```jsx
function Field({ label, children }) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  );
}
```

This API may be insufficient if the label must reference a specific form control. A stronger composition contract may explicitly require an identifier or use a specialized component protocol.

Composition therefore does not remove responsibility for semantic correctness. The component defining the structural contract remains responsible for the invariants that belong to that structure.

## Composition and TypeScript

TypeScript can make composition contracts explicit.

```tsx
interface CardProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

Component-valued composition points can also be typed.

```tsx
interface ItemProps {
  item: User;
}

interface ListProps {
  items: User[];
  Item: React.ComponentType<ItemProps>;
}

function List({ items, Item }: ListProps) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Item item={item} />
        </li>
      ))}
    </ul>
  );
}
```

Typing composition points is particularly useful when the receiving component supplies required props to the composed component.

The type should express the actual contract rather than unnecessarily exposing implementation details.

## Composition and Server/Client Boundaries

In React environments that distinguish server and client execution, composition can cross or stop at execution boundaries depending on the framework and rendering model.

A server-rendered component may compose client-interactive components, but values crossing that boundary can be subject to serialization and framework-specific constraints.

The composition pattern itself does not define those constraints. Server Components, Client Components, and hydration are separate architectural mechanisms that determine which compositions are valid in a particular runtime.

## Composition and Performance

Composition introduces component boundaries, but component boundaries should not automatically be treated as performance problems.

React can efficiently render trees containing many components, and component decomposition often improves maintainability enough to justify additional boundaries.

Performance problems should be measured rather than inferred from component count.

Composition can nevertheless affect:

* rendering frequency;
* prop propagation;
* object and function identity;
* context propagation;
* memoization opportunities;
* reconciliation;
* allocation;
* subscription boundaries.

A poorly designed composition API can also cause unnecessary rerenders by recreating values or functions on every render.

Performance optimization should therefore target the actual rendering or state-propagation bottleneck rather than collapsing components merely to reduce component count.

## Composition and Referential Stability

A parent may create new objects or functions for composed children on every render.

```jsx
function Parent({ user }) {
  return (
    <Child
      options={{ userId: user.id }}
      onSelect={() => selectUser(user.id)}
    />
  );
}
```

If `Child` relies on referential equality for memoization or effects, these values can cause additional work.

The appropriate response depends on the actual performance requirements. `useMemo` and `useCallback` should not be added mechanically. Stable ownership and a simpler component API are often more important than indiscriminate memoization.

## Composition and Testing

Composed components should be tested according to their contracts.

A component should generally be tested for:

* the structure it guarantees;
* the behavior it owns;
* the composition points it exposes;
* interactions between its owned state and supplied children;
* accessibility invariants;
* behavior when optional composition points are absent;
* behavior when arbitrary valid children are supplied.

Consumers should not normally be required to know the private implementation structure of the composed component.

For example, a `Card` test should verify that its title and children appear in the expected semantic structure rather than asserting every internal wrapper element unless those wrappers are part of the contract.

## Common Misuse

Composition becomes problematic when the parent component becomes a generic orchestration layer for unrelated responsibilities.

```jsx
function ApplicationComponent() {
  // authentication
  // data fetching
  // routing
  // forms
  // notifications
  // modal management
  // analytics
  // layout
  // business rules
}
```

Breaking this component into smaller components is useful only when the resulting boundaries correspond to meaningful responsibilities. Arbitrary decomposition can produce excessive prop forwarding and make the system harder to understand.

Another misuse is creating a generic component with dozens of composition props.

```jsx
<Component
  header={...}
  footer={...}
  sidebar={...}
  toolbar={...}
  beforeContent={...}
  afterContent={...}
  emptyState={...}
  loadingState={...}
  errorState={...}
/>
```

There is nothing inherently wrong with multiple composition points, but a large number of independently configurable regions can indicate that the component is actually several components or that a more specialized composition protocol is needed.

## Common Failure Modes

### Excessive Prop Drilling

Composition can expose dependencies explicitly through props, but deeply forwarding the same props through many layers can become cumbersome.

```jsx
<App user={user}>
  <Page user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Page>
</App>
```

If intermediate components do not actually use `user`, they are functioning as transport layers.

Possible solutions include restructuring component ownership, colocating the consumer with the state, using context for genuinely cross-cutting data, or introducing a more appropriate state boundary.

Context should not automatically replace every prop because explicit props often provide a clearer dependency contract.

### Hidden Coupling Through Children

A component can appear generic while assuming a specific child structure.

```jsx
function Wrapper({ children }) {
  const child = React.Children.only(children);

  return React.cloneElement(child, {
    requiredProp: true
  });
}
```

Although the API accepts `children`, it actually requires a specific component contract.

Such an API should make the requirement explicit rather than pretending to accept arbitrary children.

### Overusing `cloneElement`

Repeated cloning and prop injection can make data flow difficult to reason about. If descendants require shared behavior or state, context or an explicit component protocol may provide a clearer abstraction.

### Conditional Component Explosion

Replacing every conditional branch with a separate component does not automatically improve architecture.

```jsx
function Button() {
  if (type === "a") {
    return <AButton />;
  }

  if (type === "b") {
    return <BButton />;
  }

  if (type === "c") {
    return <CButton />;
  }

  return <DefaultButton />;
}
```

If the variants share a meaningful abstraction, composition can help. If they do not, artificially forcing them into one component family merely moves complexity elsewhere.

### Composition Without Ownership

If no component clearly owns state, effects, resources, or side effects, composition can produce a collection of components that depend on implicit external behavior.

Every important piece of mutable state and every resource lifecycle should have a clear owner.

## Relationship to Compound Components

Compound Components are a specialized composition pattern in which several components form a coordinated component family.

A typical API might look like:

```jsx
<Select>
  <Select.Trigger />
  <Select.Menu>
    <Select.Option value="one">One</Select.Option>
    <Select.Option value="two">Two</Select.Option>
  </Select.Menu>
</Select>
```

The parent and descendants share an implicit protocol, commonly implemented with context.

Ordinary component composition does not require this shared protocol. It simply combines independently meaningful components.

Compound Components should therefore be treated as a specialization of composition rather than as a replacement for it.

## Relationship to Slots

Slots formalize multiple insertion points into a component.

```jsx
<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  content={<Content />}
/>
```

The important distinction is that the receiving component defines named structural regions.

Simple `children` composition is sufficient when there is one primary insertion point. Named slots become useful when several independent regions need to be customized.

## Relationship to Render Props

Render Props compose behavior through a function supplied by the consumer.

```jsx
<DataProvider
  render={data => <View data={data} />}
/>
```

The provider owns the behavior or state, while the consumer controls rendering.

This is more specialized than ordinary structural composition because the function establishes a callback contract between the two components.

## Relationship to Higher-Order Components

A Higher-Order Component composes behavior by receiving a component and returning another component.

```jsx
const EnhancedComponent = withFeature(Component);
```

This differs from ordinary component composition because the composition occurs at component-definition time rather than simply by nesting rendered components.

Higher-Order Components remain useful in certain library and cross-cutting concerns, but custom Hooks often provide a more direct way to compose reusable behavior.

## Relationship to Custom Hooks

Custom Hooks compose stateful logic without composing UI structure.

Component composition answers the question of how UI components are assembled. Custom Hooks answer the question of how reusable React behavior is assembled.

They are complementary mechanisms.

## Relationship to Context

Context allows composed descendants to access shared values without explicit prop forwarding through every intermediate component.

Composition establishes the component tree. Context establishes an implicit dependency channel within that tree.

Context should be introduced when the dependency genuinely belongs to a shared subtree or cross-cutting concern. It should not be used merely to avoid writing one or two props.

## Relationship to Dependency Injection

Component composition is a natural dependency-injection mechanism.

```jsx
function Screen({ repository }) {
  return <UserList repository={repository} />;
}
```

The component does not construct the repository. The composition root supplies it.

Context can provide a more implicit form of dependency injection, particularly for application-wide services, but explicit props generally provide stronger local visibility of dependencies.

## Relationship to Dependency Inversion

Composition supports dependency inversion by allowing high-level components to select implementations while reusable components depend on stable contracts.

```jsx
function Checkout({ paymentForm }) {
  return (
    <section>
      {paymentForm}
    </section>
  );
}
```

The checkout structure does not need to know which concrete payment form is being used.

This is especially useful when the same structural component must support different implementations.

## Relationship to Strategy

Strategy composes interchangeable algorithms or policies.

Composition is broader. A component can compose a Strategy, but not every component composition is a Strategy.

```jsx
function SortableList({ items, sortStrategy }) {
  const sortedItems = sortStrategy(items);

  return (
    <List items={sortedItems} />
  );
}
```

The list composition supplies an algorithm as a dependency. The algorithm itself is the Strategy.

## Relationship to Decorator

A Decorator wraps an object or component with additional behavior while preserving a compatible contract.

Composition can be used to implement decorators, but ordinary nesting is not automatically a Decorator.

```jsx
function LoggedButton(props) {
  return (
    <Button
      {...props}
      onClick={event => {
        console.log("clicked");
        props.onClick?.(event);
      }}
    />
  );
}
```

The wrapper specifically augments behavior while preserving the underlying component's role.

## Relationship to Adapter

An Adapter changes one interface into another.

A composed component may use an Adapter internally, but composition itself does not imply interface translation.

```jsx
function LegacyUserView({ legacyUser }) {
  const user = adaptUser(legacyUser);

  return <UserCard user={user} />;
}
```

`adaptUser` performs the adaptation. `UserCard` and `LegacyUserView` are then composed.

## Relationship to Facade

A Facade provides a simplified interface over a subsystem.

A component can act as a UI facade by coordinating several lower-level components, but the defining concern is simplification of a subsystem rather than composition alone.

```jsx
function CheckoutPage() {
  return (
    <>
      <Cart />
      <ShippingForm />
      <PaymentForm />
      <OrderSummary />
    </>
  );
}
```

If `CheckoutPage` simply assembles those components, it is primarily composition. If it also exposes a simplified application-level interaction over a complex checkout subsystem, the Facade concept becomes relevant.

## Relationship to Inheritance

Inheritance establishes an `is-a` relationship and shares implementation through a prototype or class hierarchy.

Composition establishes a `has-a` or structural assembly relationship.

React's component model strongly favors composition because independently varying concerns can be assembled without creating increasingly specialized inheritance hierarchies.

## Relationship to State Colocation

State colocation determines where state should live. Composition determines how components are assembled.

They are closely related because component boundaries often determine natural state ownership boundaries.

A component should generally keep state local until another component actually needs to coordinate with it. When coordination is required, state can move upward into the nearest suitable common owner.

## Relationship to Lazy Components

A component can be composed conditionally and loaded lazily.

```jsx
const Settings = lazy(() => import("./Settings.jsx"));

function App({ showSettings }) {
  return showSettings ? <Settings /> : <Home />;
}
```

The composition relationship remains a React concern, while the dynamic loading behavior belongs to lazy loading and code splitting.

The two patterns can therefore be combined without being treated as the same pattern.

## Architectural Use

Component composition is appropriate at several architectural levels.

At the leaf level, it combines small visual primitives.

At the feature level, it combines controls, forms, data views, and domain-specific components.

At the page level, it combines features into application screens.

At the application level, it composes providers, routing structures, layouts, and top-level infrastructure.

The pattern is most effective when each level exposes a deliberate contract to the level above it.

## Design Criteria

A component is a good candidate for composition when at least one of the following applies:

* part of its structure must vary independently;
* consumers need to provide custom content;
* behavior should be supplied rather than hard-coded;
* several components must share a structural relationship;
* the component should remain independent of application-specific implementations;
* different implementations must be selected at the composition boundary;
* state ownership belongs to a parent while presentation belongs to a child;
* the component represents a stable structural concept with variable contents.

Composition is less useful when the supposed components have no meaningful independent responsibility or when the abstraction exists solely to reduce line count.

## API Design Guidelines

A good composition API should make ownership and variation explicit.

Prefer a small number of meaningful composition points over a large collection of incidental customization props.

Prefer semantic component boundaries over arbitrary wrappers.

Prefer explicit props when a dependency is local and important.

Use `children` when the component has a natural primary content region.

Use named composition props when independent structural regions genuinely need customization.

Use context when descendants share a dependency that should belong to the composed subtree.

Use specialized patterns such as compound components, render props, custom Hooks, or higher-order components when their additional protocol provides a concrete benefit.

Avoid exposing implementation details merely because they are technically composable.

## Performance Criteria

Composition should primarily be evaluated for architectural clarity and responsibility boundaries, not for minimizing component count.

When performance matters, measure:

* render frequency;
* commit duration;
* expensive calculations;
* context propagation;
* prop identity;
* state update scope;
* DOM work;
* network and resource behavior.

Optimize the specific bottleneck.

Do not collapse well-designed component boundaries solely because they introduce additional component instances.

## Testing Criteria

Composition boundaries should be tested as contracts.

A component test should establish that the component:

* renders valid supplied content correctly;
* preserves the required structural invariants;
* exposes expected composition points;
* maintains state ownership correctly;
* forwards only the intended information;
* preserves accessibility semantics;
* behaves correctly when optional composed content is absent;
* handles supported child variations.

Tests should avoid coupling themselves to implementation details that are not part of the component's public contract.

## Refactoring Toward Composition

A large component can often be refactored incrementally.

First identify distinct responsibilities rather than arbitrary sections of JSX. Extract a cohesive responsibility into a child component. Decide which state belongs to the extracted component and which state must remain with the parent. Replace direct dependencies on application-specific implementations with explicit props or composition points where appropriate. Only introduce context, render props, compound components, or other specialized patterns when simple composition is insufficient.

The goal is not to maximize the number of components. The goal is to establish boundaries around independently understandable and independently varying responsibilities.

## Summary

Component Composition is the foundational React pattern for assembling UI from smaller components while keeping responsibilities and ownership explicit.

Its core mechanism is simple: a component defines a structural or behavioral contract, and another component supplies the pieces that vary within that contract.

The primary mechanisms are `children`, element-valued props, component-valued props, and ordinary component nesting. More specialized React patterns build on the same underlying idea: compound components establish coordinated child protocols, Slots expose named insertion points, Render Props compose behavior through functions, Higher-Order Components compose component behavior, Custom Hooks compose stateful logic, and Context provides shared dependencies within a composed subtree.

Composition should therefore be treated as the foundational mechanism rather than as a collection of unrelated APIs. The important architectural questions are what the component owns, what it allows consumers to control, which dependencies are explicit, where state lives, and which variations deserve dedicated composition points.

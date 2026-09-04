# React Patterns Overview

React introduces a set of patterns for structuring component composition, state management, rendering, data flow,
asynchronous behavior, and application architecture. Some of these patterns originate in general software design, while
others emerge directly from React's component model, Hooks, Context, reconciliation, rendering lifecycle, and
server/client architecture.

React patterns should not be treated as a replacement for general design patterns. Patterns such as Strategy, Adapter,
Observer, Factory, Dependency Injection, and Composite remain applicable to React applications. React-specific patterns
primarily address how those general concepts map onto components, hooks, props, context, state, rendering, and the React
runtime.

The purpose of this catalog is to separate React-specific patterns from the general JavaScript patterns already covered
elsewhere. A pattern belongs here when React's programming model materially affects its implementation, trade-offs, or
semantics.

## Component Composition Patterns

### Component Composition

Component Composition builds larger components by combining smaller components rather than creating large inheritance
hierarchies.

React's component model is fundamentally composition-oriented. Components can receive other components, elements, render
functions, or arbitrary React nodes as inputs.

```jsx
function Panel({header, children, footer}) {
    return (
        <section>
            <header>{header}</header>
            <main>{children}</main>
            <footer>{footer}</footer>
        </section>
    );
}
```

Composition is the fundamental structural mechanism behind many other React patterns.

### Containment

Containment represents a component's variable content through `children` or other React node props.

```jsx
function Card({children}) {
    return (
        <article className="card">
            {children}
        </article>
    );
}
```

The component owns the container structure while the caller controls its contents.

Containment is particularly useful when a component should provide layout, behavior, styling, or lifecycle management
without determining the exact content rendered inside it.

### Specialization

Specialization creates a component with more specific behavior or presentation from a more general component.

```jsx
function Button(props) {
    return <button {...props} />;
}

function SubmitButton(props) {
    return <Button type="submit" {...props} />;
}
```

React generally favors specialization through composition and props rather than class inheritance.

### Compound Components

Compound Components allow multiple related components to work together as one conceptual component API.

```jsx
function Tabs({children}) {
    return <div>{children}</div>;
}

Tabs.List = function TabsList({children}) {
    return <div role="tablist">{children}</div>;
};

Tabs.Panel = function TabsPanel({children}) {
    return <div role="tabpanel">{children}</div>;
};
```

The components share a conceptual contract and often communicate through Context.

A more complete implementation can use a provider internally so that compound children can coordinate without requiring
every value to be passed through intermediate components.

### Slots

Slot-style composition provides named insertion points rather than relying exclusively on `children`.

```jsx
function Dialog({header, body, actions}) {
    return (
        <section>
            <header>{header}</header>
            <div>{body}</div>
            <footer>{actions}</footer>
        </section>
    );
}
```

Slots are useful when a component has several semantically distinct content regions.

React does not provide a dedicated slot primitive equivalent to some other component systems. Slot behavior is normally
implemented with props containing React nodes or components.

### Render Props

Render Props pass a function that determines what should be rendered.

```jsx
function MousePosition({children}) {
    const [position, setPosition] = React.useState({
        x: 0,
        y: 0
    });

    return children(position);
}
```

The consuming component controls presentation while the provider controls the underlying behavior.

Render Props were historically important for reusable stateful behavior before Hooks. They remain valid but are often
replaced by custom Hooks when the consumer does not need direct control over rendering.

### Function-as-Children

Function-as-Children is a specialized Render Props form where `children` itself is a function.

```jsx
<DataLoader>
    {({data, loading}) => (
        loading ? <Spinner/> : <List data={data}/>
    )}
</DataLoader>
```

This pattern should be distinguished from ordinary `children` containment because the child is executable behavior
rather than merely a React node.

## Higher-Order Component Patterns

### Higher-Order Components

A Higher-Order Component is a function that accepts a component and returns another component with additional behavior.

```jsx
function withLoading(Component) {
    return function WithLoading({loading, ...props}) {
        if (loading) {
            return <Spinner/>;
        }

        return <Component {...props} />;
    };
}
```

Higher-Order Components provide component-level behavioral composition.

They were historically used for concerns such as subscriptions, authorization, data loading, and instrumentation. Hooks
have replaced many of these use cases, but Higher-Order Components remain relevant when behavior must be attached to
component boundaries or when integrating older React ecosystems.

### Higher-Order Component Composition

Multiple Higher-Order Components can be composed around the same component.

```jsx
const EnhancedComponent = withLogging(
    withAuthorization(
        withLoading(Component)
    )
);
```

Composition order matters because each wrapper receives the result of the previous transformation.

Excessive Higher-Order Components can make component trees and debugging more difficult. Modern React code should
generally prefer Hooks or direct composition when they express the same concern more clearly.

## Hook Patterns

### Custom Hooks

A Custom Hook extracts reusable stateful or effectful behavior into a function whose name begins with `use`.

```jsx
function useOnlineStatus() {
    const [online, setOnline] = React.useState(
        navigator.onLine
    );

    React.useEffect(() => {
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

Custom Hooks are one of the primary React mechanisms for behavioral reuse.

They encapsulate Hook usage rather than creating a new component. The consuming component receives values and operations
from the Hook and determines how they are rendered.

### State Hook Pattern

`useState` and related state Hooks encapsulate component-local state.

```jsx
function Counter() {
    const [count, setCount] = React.useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

State should represent information that affects rendering or component behavior. Values that do not affect rendering
generally do not belong in state.

### Reducer Pattern

`useReducer` models state transitions through actions and a reducer.

```jsx
function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1
            };

        case "reset":
            return {
                ...state,
                count: 0
            };

        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}
```

The component can then dispatch explicit state transitions:

```jsx
function Counter() {
    const [state, dispatch] = React.useReducer(reducer, {
        count: 0
    });

    return (
        <button onClick={() => dispatch({type: "increment"})}>
            {state.count}
        </button>
    );
}
```

The Reducer Pattern is particularly useful when state transitions are numerous, interdependent, or easier to describe as
domain actions.

### State Machine Pattern

A component can represent its state as a finite set of explicit states and transitions.

```jsx
const initialState = {
    status: "idle"
};

function reducer(state, action) {
    switch (action.type) {
        case "start":
            return {status: "loading"};

        case "success":
            return {
                status: "success",
                data: action.data
            };

        case "failure":
            return {
                status: "error",
                error: action.error
            };

        default:
            return state;
    }
}
```

This prevents invalid combinations such as simultaneously representing mutually exclusive loading and failure states.

State machines are especially useful for asynchronous workflows, forms, dialogs, authentication flows, media controls,
and multi-step processes.

### Effect Encapsulation

A Custom Hook can encapsulate an external synchronization effect.

```jsx
function useDocumentTitle(title) {
    React.useEffect(() => {
        document.title = title;
    }, [title]);
}
```

The component expresses the semantic requirement while the Hook owns the interaction with the external system.

This is preferable to scattering identical effect logic across multiple components.

### Effect Synchronization

Effects should generally be modeled as synchronization with external systems rather than as arbitrary lifecycle
callbacks.

```jsx
function Connection({roomId}) {
    React.useEffect(() => {
        const connection = createConnection(roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);

    return null;
}
```

The dependency list expresses which reactive values determine the synchronization.

This pattern is distinct from simply "running code after render." Its architectural purpose is to synchronize React
state with something outside React.

### Ref Pattern

Refs provide mutable values that persist across renders without themselves causing re-renders.

```jsx
function Input() {
    const inputRef = React.useRef(null);

    function focus() {
        inputRef.current?.focus();
    }

    return (
        <>
            <input ref={inputRef}/>
            <button onClick={focus}>Focus</button>
        </>
    );
}
```

Refs are appropriate for DOM references, imperative handles, mutable values whose changes should not trigger rendering,
and integration with external APIs.

Using refs as an alternative state store can bypass React's rendering model and should be avoided when the value affects
rendered output.

## Context Patterns

### Context Provider

Context provides values to a subtree without passing them through every intermediate component.

```jsx
const ThemeContext = React.createContext(null);

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Page/>
        </ThemeContext.Provider>
    );
}
```

A descendant can consume the value:

```jsx
function Button() {
    const theme = React.useContext(ThemeContext);

    return (
        <button data-theme={theme}>
            Save
        </button>
    );
}
```

Context is primarily a dependency propagation mechanism. It is not inherently a global state-management solution.

### Context + Custom Hook

A Context can expose a dedicated custom Hook as its consumer API.

```jsx
const AuthContext = React.createContext(null);

function useAuth() {
    const value = React.useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return value;
}
```

This centralizes validation and prevents consumers from depending directly on the Context implementation.

### Context Module Pattern

A feature can encapsulate its Context, provider, and consumer Hook in one module.

```jsx
const CartContext = React.createContext(null);

export function CartProvider({children}) {
    const [items, setItems] = React.useState([]);

    return (
        <CartContext.Provider value={{items, setItems}}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const value = React.useContext(CartContext);

    if (!value) {
        throw new Error("useCart must be used within CartProvider");
    }

    return value;
}
```

This establishes a feature-level dependency boundary.

### Context Partitioning

Large Context values can cause unrelated consumers to re-render when the provider value changes.

Instead of placing unrelated state into one Context, contexts can be partitioned according to consumption boundaries.

```jsx
const UserContext = React.createContext(null);
const ThemeContext = React.createContext(null);
const LocaleContext = React.createContext(null);
```

The goal is not to create a Context for every individual value. The goal is to align Context boundaries with meaningful
dependency and update boundaries.

## State Ownership Patterns

### Local State

State belongs to the smallest component subtree that actually requires it.

```jsx
function SearchBox() {
    const [query, setQuery] = React.useState("");

    return (
        <input
            value={query}
            onChange={event => setQuery(event.target.value)}
        />
    );
}
```

Local state minimizes coupling and avoids unnecessary propagation.

### State Lifting

When multiple components need the same state, the state can be moved to their nearest appropriate common ancestor.

```jsx
function Parent() {
    const [value, setValue] = React.useState("");

    return (
        <>
            <Editor value={value} onChange={setValue}/>
            <Preview value={value}/>
        </>
    );
}
```

The parent becomes the owner of the shared state.

State lifting should stop at the appropriate ownership boundary. Moving all state to the root of an application is not
an automatic improvement.

### Controlled Component

A controlled component receives its current value from React state and reports changes through callbacks.

```jsx
function Input({value, onChange}) {
    return (
        <input
            value={value}
            onChange={event => onChange(event.target.value)}
        />
    );
}
```

The parent owns the state.

Controlled components make state transitions explicit and are useful when other components need to observe, validate,
synchronize, or transform the value.

### Uncontrolled Component

An uncontrolled component allows the underlying DOM or component implementation to own its current value.

```jsx
function Form() {
    const inputRef = React.useRef(null);

    function submit() {
        console.log(inputRef.current.value);
    }

    return (
        <>
            <input ref={inputRef} defaultValue=""/>
            <button onClick={submit}>Submit</button>
        </>
    );
}
```

Uncontrolled components can reduce state synchronization overhead and are useful when React does not need to observe
every intermediate value.

### Controlled-Uncontrolled Hybrid

Reusable components can support both controlled and uncontrolled usage.

```jsx
function Toggle({
                    value,
                    defaultValue = false,
                    onChange
                }) {
    const [internalValue, setInternalValue] =
        React.useState(defaultValue);

    const controlled = value !== undefined;
    const currentValue = controlled
        ? value
        : internalValue;

    function update(nextValue) {
        if (!controlled) {
            setInternalValue(nextValue);
        }

        onChange?.(nextValue);
    }

    return (
        <button onClick={() => update(!currentValue)}>
            {currentValue ? "On" : "Off"}
        </button>
    );
}
```

The component supports both externally controlled state and internally managed state.

This pattern requires precise rules for transitions between controlled and uncontrolled modes.

## Data Fetching Patterns

### Fetching Hook

A custom Hook can encapsulate asynchronous resource state.

```jsx
function useUser(id) {
    const [state, setState] = React.useState({
        status: "loading",
        data: null,
        error: null
    });

    React.useEffect(() => {
        let active = true;

        fetchUser(id)
            .then(data => {
                if (active) {
                    setState({
                        status: "success",
                        data,
                        error: null
                    });
                }
            })
            .catch(error => {
                if (active) {
                    setState({
                        status: "error",
                        data: null,
                        error
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [id]);

    return state;
}
```

Modern applications frequently delegate this concern to dedicated data-fetching libraries rather than implementing the
complete caching, synchronization, and invalidation model manually.

### Resource Cache

A resource cache retains asynchronous results and coordinates concurrent consumers.

```js
const cache = new Map();

function getUser(id) {
    if (!cache.has(id)) {
        cache.set(id, fetchUser(id));
    }

    return cache.get(id);
}
```

React-specific resource systems can build on this general caching concept to coordinate rendering and asynchronous data
access.

The cache policy remains a separate concern involving invalidation, freshness, errors, and ownership.

### Server State Versus UI State

Server state and client UI state have different semantics.

Server state originates outside the React process and can become stale independently of the current component tree. It
often requires caching, synchronization, invalidation, retries, deduplication, and background refresh.

UI state is normally owned by the application itself and represents interaction state such as selected tabs, open
dialogs, input values, or local view preferences.

Treating all state as one undifferentiated category often produces unnecessary complexity.

## Rendering Patterns

### Conditional Rendering

Components can choose their rendered output based on state or props.

```jsx
function Status({loading, error, data}) {
    if (loading) {
        return <Spinner/>;
    }

    if (error) {
        return <ErrorMessage error={error}/>;
    }

    return <Result data={data}/>;
}
```

Conditional rendering is a basic React mechanism and is often combined with explicit state-machine modeling for complex
UI states.

### Element Variables

A component can compute a React element before returning it.

```jsx
function Dashboard({authenticated}) {
    let content;

    if (authenticated) {
        content = <Account/>;
    } else {
        content = <Login/>;
    }

    return <main>{content}</main>;
}
```

This is useful when multiple branches share surrounding rendering structure.

### Null Rendering

A component can intentionally render nothing.

```jsx
function Analytics({enabled}) {
    if (!enabled) {
        return null;
    }

    return <AnalyticsPanel/>;
}
```

This is useful for optional UI behavior, although authorization and security must never rely on client-side omission
alone.

### Error Boundary

An Error Boundary isolates rendering errors in a subtree and provides fallback UI.

```jsx
class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    };

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback/>;
        }

        return this.props.children;
    }
}
```

Error boundaries are React-specific because they integrate with React's rendering error model.

They should be placed according to recovery boundaries rather than arbitrarily wrapping every component.

### Suspense Boundary

A Suspense boundary defines a fallback UI while supported asynchronous work prevents part of the tree from being ready.

```jsx
function App() {
    return (
        <React.Suspense fallback={<Spinner/>}>
            <LazyFeature/>
        </React.Suspense>
    );
}
```

Suspense is a rendering coordination mechanism. Its exact applicability depends on the React feature and data-loading
architecture being used.

### Nested Suspense Boundaries

Multiple Suspense boundaries can represent different loading granularity.

```jsx
function Dashboard() {
    return (
        <main>
            <React.Suspense fallback={<HeaderSkeleton/>}>
                <Header/>
            </React.Suspense>

            <React.Suspense fallback={<ContentSkeleton/>}>
                <Content/>
            </React.Suspense>
        </main>
    );
}
```

The boundaries determine which parts of the interface can become visible independently.

## Code Loading Patterns

### Lazy Component

`React.lazy` integrates dynamic module loading with component rendering.

```jsx
const Settings = React.lazy(
    () => import("./Settings.js")
);
```

It is commonly combined with Suspense:

```jsx
function App() {
    return (
        <React.Suspense fallback={<Spinner/>}>
            <Settings/>
        </React.Suspense>
    );
}
```

The underlying resource acquisition remains a JavaScript Lazy Loading concern, while `React.lazy` integrates that
loading process with React rendering.

### Route-Based Code Splitting

Routes can define lazy component boundaries.

```jsx
const AdminPage = React.lazy(
    () => import("./pages/AdminPage.js")
);
```

A router can then render the component only when the corresponding route is activated.

This combines React component composition with JavaScript Code Splitting and Lazy Loading.

## Performance Patterns

### Memoized Component

`React.memo` can skip rendering a component when its props are considered equal.

```jsx
const UserCard = React.memo(function UserCard({
                                                  user
                                              }) {
    return <div>{user.name}</div>;
});
```

Memoization is an optimization, not a semantic requirement.

It is effective only when avoiding the render work is more valuable than the cost of comparison and when the component
frequently receives equivalent props.

### Memoized Value

`useMemo` can cache a computed value between renders.

```jsx
const filtered = React.useMemo(
    () => filterItems(items, query),
    [items, query]
);
```

The cache is controlled by React and should not be treated as a general-purpose application cache.

`useMemo` is primarily an optimization mechanism for expensive calculations or stable references required by another
optimization.

### Memoized Callback

`useCallback` preserves a function reference between renders when dependencies remain unchanged.

```jsx
const handleSelect = React.useCallback(
    item => {
        selectItem(item.id);
    },
    [selectItem]
);
```

It is most useful when function identity affects another optimization or dependency relationship.

Using `useCallback` indiscriminately can add complexity without producing measurable benefit.

### Referential Stability

React relies heavily on identity comparisons.

```jsx
const value = {
    theme,
    setTheme
};
```

A new object is created on every render.

When identity stability matters, the value can be memoized:

```jsx
const value = React.useMemo(
    () => ({
        theme,
        setTheme
    }),
    [theme, setTheme]
);
```

Referential stability is particularly relevant to Context values, memoized components, dependency arrays, and
external-store subscriptions.

## External Store Patterns

### External Store Subscription

State can live outside React while React subscribes to it.

```jsx
function useStore() {
    return React.useSyncExternalStore(
        store.subscribe,
        store.getSnapshot
    );
}
```

This separates state ownership from component ownership.

`useSyncExternalStore` provides React-aware subscription semantics for external stores and is particularly important
when consistency with concurrent rendering matters.

### Selector Pattern

A component can consume only a selected portion of external state.

```jsx
const count = useStore(
    state => state.count
);
```

Selector-based access can reduce unnecessary updates when the state-management system supports efficient equality or
subscription semantics.

The selector itself must have appropriate identity and equality behavior for the particular store implementation.

## Ref Forwarding and Imperative Patterns

### Ref Forwarding

A reusable component can expose a DOM or component reference to its consumer.

Modern React APIs differ across React versions regarding how refs are passed, so the exact implementation should follow
the version's supported ref model.

The architectural purpose is to allow controlled imperative access across a component boundary.

### Imperative Handle

A component can expose a restricted imperative API rather than exposing its underlying DOM node.

```jsx
const Input = React.forwardRef(function Input(props, ref) {
    const inputRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current?.focus();
        }
    }), []);

    return <input ref={inputRef}/>;
});
```

The consumer receives the intended capability rather than the complete internal representation.

Imperative APIs should remain narrow because they bypass React's declarative data flow.

## Form Patterns

### Form State Pattern

A form can maintain its fields in React state.

```jsx
function Form() {
    const [form, setForm] = React.useState({
        name: "",
        email: ""
    });

    function update(field, value) {
        setForm(current => ({
            ...current,
            [field]: value
        }));
    }

    return (
        <>
            <input
                value={form.name}
                onChange={event =>
                    update("name", event.target.value)
                }
            />

            <input
                value={form.email}
                onChange={event =>
                    update("email", event.target.value)
                }
            />
        </>
    );
}
```

This provides explicit control but can become verbose for large forms.

### Form Reducer

Complex forms can model updates as actions.

```jsx
function reducer(state, action) {
    switch (action.type) {
        case "change":
            return {
                ...state,
                [action.field]: action.value
            };

        case "reset":
            return action.initialState;

        default:
            return state;
    }
}
```

This is useful when validation, submission, touched state, dirty state, and asynchronous submission produce many related
transitions.

## Event Patterns

### Event Handler Propagation

Components communicate upward by receiving callbacks as props.

```jsx
function Child({onSelect}) {
    return (
        <button onClick={() => onSelect("selected")}>
            Select
        </button>
    );
}
```

This is the normal React alternative to relying on a global event bus for local component communication.

### Event Delegation Through Parent Components

A parent can own event behavior and delegate the relevant operation to children through callbacks.

```jsx
function List({items, onSelect}) {
    return items.map(item => (
        <Item
            key={item.id}
            item={item}
            onSelect={onSelect}
        />
    ));
}
```

This keeps communication explicit and preserves component boundaries.

### Event Bus

An event bus can decouple unrelated parts of an application, but it should be used carefully in React.

A global event bus can bypass the component tree and make dependencies difficult to discover. Context, props, external
stores, or domain-level messaging are often preferable when the communication has a clear ownership relationship.

## State Synchronization Patterns

### Derived State

A value that can be calculated from existing props or state generally should not be stored independently.

```jsx
function Cart({items}) {
    const total = items.reduce(
        (sum, item) => sum + item.price,
        0
    );

    return <Total value={total}/>;
}
```

Storing both `items` and `total` introduces two representations that can become inconsistent.

### State Synchronization

When two independent sources of truth must remain synchronized, the synchronization should be explicit.

```jsx
function Search({query}) {
    const [input, setInput] = React.useState(query);

    React.useEffect(() => {
        setInput(query);
    }, [query]);

    return (
        <input
            value={input}
            onChange={event => setInput(event.target.value)}
        />
    );
}
```

Synchronization introduces temporal behavior and should not be confused with ordinary derivation.

Whenever possible, derive a value from its authoritative source rather than maintaining duplicate state.

### State Colocation

State should be located near the components that use and mutate it.

This minimizes the number of components coupled to a particular state representation and reduces unnecessary updates.

State Colocation is one of the most important architectural heuristics for React applications because it prevents the
application root from becoming a universal state owner.

## Composition and Layout Patterns

### Layout Component

A layout component owns structural arrangement while accepting content through composition.

```jsx
function DashboardLayout({sidebar, children}) {
    return (
        <div className="dashboard">
            <aside>{sidebar}</aside>
            <main>{children}</main>
        </div>
    );
}
```

The layout can be reused across pages without controlling the domain content rendered inside it.

### Provider Composition

Multiple providers can be composed into a reusable boundary.

```jsx
function AppProviders({children}) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

This keeps application bootstrap code readable while making infrastructure dependencies explicit.

Provider composition should not become a justification for creating global state for every concern.

## Dependency Patterns

### Dependency Through Props

The simplest React dependency injection mechanism is passing a dependency as a prop.

```jsx
function UserList({repository}) {
    // repository is supplied by the parent
}
```

This makes dependencies explicit and keeps the component independent from a concrete implementation.

### Dependency Through Context

Context can provide a dependency to a subtree.

```jsx
const RepositoryContext = React.createContext(null);

function UserList() {
    const repository = React.useContext(
        RepositoryContext
    );

    // use repository
}
```

This is appropriate when many components require the same dependency and explicit prop propagation would create
excessive plumbing.

### Dependency Through Custom Hooks

A custom Hook can provide a stable domain-specific dependency API.

```jsx
function useUserRepository() {
    return React.useContext(RepositoryContext);
}
```

Consumers depend on the Hook contract rather than the Context implementation.

## Server and Client Patterns

### Server Component Boundary

React applications that use a framework supporting Server Components can separate server-rendered components from client
components.

A server component can perform server-side work without making that implementation part of the client JavaScript bundle.

The boundary is architectural: client components require client-side behavior, while server components can remain on the
server.

The exact rules depend on the React framework and version implementing Server Components.

### Client Component Boundary

Interactive behavior such as event handlers, browser APIs, and client-side state requires an appropriate client boundary
in architectures that distinguish server and client components.

```jsx
"use client";

function Counter() {
    const [count, setCount] = React.useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

The boundary determines where client-side JavaScript and interactive behavior are required.

### Server Data Composition

Server-rendered component trees can compose data access with rendering without necessarily exposing the data-access
implementation to the browser.

This differs from traditional client-side fetching because the data acquisition occurs in a server execution
environment.

The architectural boundary should remain explicit so that client components do not accidentally depend on server-only
resources.

## Hydration Patterns

### Hydration Boundary

Hydration attaches React behavior to server-rendered markup.

In applications using server rendering, not every part of the page necessarily needs identical client-side behavior.

Hydration boundaries can therefore be used to control where interactive client behavior becomes active.

### Progressive Enhancement

A server-rendered interface can provide useful HTML before client-side JavaScript becomes available.

Interactive behavior can then enhance that initial representation.

This pattern reduces dependence on immediate JavaScript execution and can improve resilience and perceived performance.

## Concurrency Patterns

### Transition

React transitions distinguish urgent updates from non-urgent rendering work.

```jsx
const [isPending, startTransition] =
    React.useTransition();

function selectTab(tab) {
    startTransition(() => {
        setTab(tab);
    });
}
```

This allows React to prioritize more urgent interactions while rendering less urgent updates.

### Deferred Value

`useDeferredValue` allows a derived value to lag behind an urgent value.

```jsx
const deferredQuery = React.useDeferredValue(query);

return <SearchResults query={deferredQuery}/>;
```

This can keep input interactions responsive while expensive rendering catches up.

Deferred rendering does not cancel the underlying computation automatically. It changes scheduling priority within
React's rendering model.

### Interruptible Rendering

Concurrent React rendering allows rendering work to be interrupted and restarted.

Component logic should therefore remain render-pure. Side effects should not be performed during rendering because React
may execute rendering work without committing the result.

This is a fundamental architectural constraint of modern React.

## Identity Patterns

### Stable Keys

Lists require stable keys that identify logical items.

```jsx
function Users({users}) {
    return users.map(user => (
        <User
            key={user.id}
            user={user}
        />
    ));
}
```

Keys allow React to associate rendered elements with logical entities across updates.

Using array indexes as keys can be incorrect when list order changes or items are inserted or removed because identity
becomes associated with position rather than the underlying entity.

### Component Identity

React's reconciliation behavior depends on component type and key identity.

Changing a key intentionally can force React to treat a subtree as a new identity:

```jsx
<Form key={userId} userId={userId}/>
```

This can be useful when a component's local state should be reset when its logical identity changes.

Key changes should therefore be understood as identity changes rather than merely rendering hints.

## Resource and Lifecycle Patterns

### Cleanup Pattern

Effects that establish subscriptions, timers, listeners, or external resources should return cleanup logic.

```jsx
React.useEffect(() => {
    const subscription = store.subscribe(update);

    return () => {
        subscription.unsubscribe();
    };
}, []);
```

The cleanup function defines ownership of the external resource established by the effect.

### Abortable Async Effect

Asynchronous operations can be coordinated with cancellation mechanisms where the underlying API supports them.

```jsx
React.useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${id}`, {
        signal: controller.signal
    });

    return () => {
        controller.abort();
    };
}, [id]);
```

Cancellation prevents obsolete operations from continuing when the component no longer needs them.

The underlying API must actually support cancellation; cleanup alone does not cancel arbitrary asynchronous JavaScript
work.

## Accessibility Patterns

### Semantic Component

Reusable components should preserve semantic HTML rather than replacing native controls unnecessarily.

```jsx
function SubmitButton({children}) {
    return (
        <button type="submit">
            {children}
        </button>
    );
}
```

A custom component should preserve the semantics, keyboard behavior, focus behavior, and accessibility expectations of
the underlying control.

### Controlled Focus

Refs and effects can coordinate focus when a component becomes active.

```jsx
function Dialog({open}) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (open) {
            ref.current?.focus();
        }
    }, [open]);

    return (
        <section
            ref={ref}
            tabIndex={-1}
        >
            Dialog
        </section>
    );
}
```

Imperative focus management is one of the legitimate places where refs and effects interact directly with the DOM.

## Architectural Patterns

### Feature-Sliced Components

Components can be organized around business capabilities rather than generic technical categories.

A feature can contain its components, Hooks, state logic, API integration, and tests within a coherent boundary.

This reduces coupling between unrelated application areas and makes ownership clearer.

### Container and Presentational Components

The Container/Presentational distinction separates data and coordination from visual rendering.

A container may obtain data and construct behavior:

```jsx
function UserPage() {
    const user = useUser();

    return <UserView user={user}/>;
}
```

The presentational component receives explicit inputs:

```jsx
function UserView({user}) {
    return <h1>{user.name}</h1>;
}
```

Hooks have reduced the need for strict container components because behavioral logic can often be extracted without
introducing another component layer.

The underlying separation of concerns remains useful even when the terminology is less important.

### Smart and Dumb Components

"Smart" and "dumb" components are older terminology for components that respectively contain coordination/state behavior
and components that primarily render supplied data.

The distinction can be useful for reasoning about responsibilities, but React does not require such a separation. A
component can legitimately own both behavior and presentation when those responsibilities form a coherent unit.

### Headless Component

A Headless Component provides behavior, state, accessibility logic, and interaction semantics without prescribing visual
presentation.

```jsx
function useToggle(defaultValue = false) {
    const [value, setValue] = React.useState(defaultValue);

    return {
        value,
        toggle: () => setValue(current => !current)
    };
}
```

A visual component can then decide how the behavior is presented.

Headless architecture is particularly useful for design systems where behavior and accessibility should be standardized
while visual styling remains customizable.

### Provider-Based Architecture

Cross-cutting infrastructure can be represented by providers.

Examples include authentication, theming, localization, routing, data clients, and feature configuration.

Providers establish dependency scope rather than automatically implying global mutable state.

## Patterns Commonly Combined With React

React applications frequently use general JavaScript patterns alongside React-specific patterns.

Strategy can represent interchangeable rendering, validation, formatting, or business policies.

Factory Functions can construct domain objects or select implementations independently of React components.

Adapter can translate external API models into view models or component-friendly contracts.

Decorator can add behavior around services, data clients, or components.

Observer underlies many subscription-based systems, although React itself provides more specialized subscription
mechanisms.

Dependency Injection can supply repositories, clients, configuration, clocks, and other infrastructure dependencies.

Memoization can optimize expensive computations, although React's own memoization primitives have specific rendering
semantics.

Caching can retain server data, computations, or resources, while React components consume the resulting state.

Lazy Loading can defer component and resource acquisition, frequently through dynamic imports and `React.lazy`.

Composite is naturally represented by React's component tree because components recursively compose other components.

These patterns should remain conceptually distinct. React provides mechanisms that can implement or integrate with
general patterns, but the mechanisms do not redefine the underlying pattern.

## Anti-Patterns

### Prop Drilling Without Need

Prop drilling is not inherently an anti-pattern. Passing data through a small number of components can be clearer than
introducing Context.

It becomes problematic when intermediate components repeatedly forward values they do not use solely because distant
descendants require them.

Context, composition, or state restructuring may then provide a better boundary.

### Excessive Context

Putting large amounts of unrelated application state into Context can increase coupling and cause broad update
propagation.

Context should represent a meaningful dependency boundary rather than becoming a universal global variable.

### Effect for Derived Data

Using an effect to calculate something that can be derived during rendering introduces unnecessary state
synchronization.

```jsx
const [fullName, setFullName] = React.useState("");

React.useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

The derived value can instead be calculated directly:

```jsx
const fullName = `${firstName} ${lastName}`;
```

The latter has one source of truth and no synchronization step.

### Effect for Event Logic

An event that occurs because the user clicked a button generally belongs in the event handler rather than in an effect
triggered by state that merely records the event.

Effects should primarily synchronize with external systems.

### Mutating State

State should be replaced rather than mutated in place.

```jsx
setUser(current => ({
    ...current,
    name: "Ada"
}));
```

Mutating an existing object can violate React's identity-based update model and produce stale or inconsistent rendering
behavior.

### Index Keys

Using array indexes as keys can cause component identity to follow position rather than logical item identity.

This is particularly problematic for reorderable, insertable, or removable lists.

### Global Mutable State

A module-level mutable object can bypass React's state and subscription mechanisms.

```js
export const state = {
    user: null
};
```

If React components depend on this state, changes must still be propagated through a React-compatible subscription or
state mechanism.

### Premature Memoization

`React.memo`, `useMemo`, and `useCallback` should not be added automatically.

Memoization introduces identity constraints and comparison work. It should address a measured rendering or
reference-stability problem.

### Monolithic Components

A component that owns data access, state transitions, validation, business rules, layout, rendering, and infrastructure
integration can become difficult to test and evolve.

The solution is not to split every component mechanically. Boundaries should follow cohesive responsibilities and
dependency relationships.

## Pattern Selection

The appropriate React pattern depends on the problem being solved.

Use composition when the primary problem is combining components.

Use containment or slots when the consumer should control part of a component's content.

Use Compound Components when several related components must form a coordinated API.

Use Render Props when reusable behavior needs to control how a consumer renders the result.

Use Custom Hooks when reusable stateful or effectful behavior does not require another component boundary.

Use Context when a dependency or value must be available across a subtree without explicit prop propagation.

Use state lifting when multiple components genuinely share ownership of state.

Use controlled components when the parent must own and coordinate the value.

Use uncontrolled components when the component or DOM can own the value without React observing every intermediate
change.

Use reducers when state transitions form a meaningful action-driven model.

Use state machines when valid states and transitions are sufficiently complex that implicit boolean combinations become
difficult to reason about.

Use Error Boundaries to establish rendering failure and recovery boundaries.

Use Suspense boundaries to establish asynchronous rendering boundaries supported by the application's React
architecture.

Use `React.memo`, `useMemo`, and `useCallback` only when referential stability or rendering cost justifies them.

Use external stores when state ownership must exist outside the React component tree.

Use Headless Components when behavior and presentation need independent reuse.

Use lazy components and code splitting when a component does not need to be part of the initial client-side execution
path.

Use Server and Client Component boundaries when the application's rendering architecture supports them and server/client
execution concerns need to be separated.

## Pattern Relationships

Many React patterns are different expressions of the same underlying architectural concerns.

Component Composition is the fundamental structural mechanism.

Custom Hooks provide behavioral composition without adding a component to the rendered tree.

Higher-Order Components provide behavioral composition by transforming component boundaries.

Render Props provide behavioral composition through executable render inputs.

Context provides scoped dependency propagation.

State Lifting provides explicit state ownership through the component hierarchy.

External Stores move state ownership outside React while preserving a React-aware subscription boundary.

Controlled Components move state ownership to the consumer.

Headless Components separate behavior and accessibility from presentation.

Suspense and Error Boundaries establish rendering boundaries for asynchronous readiness and failure recovery.

Lazy Components combine React rendering boundaries with JavaScript Lazy Loading.

Memoization controls identity and computation reuse.

Reducers and State Machines make state transitions explicit.

These mechanisms can be combined, but combining patterns should have a clear reason. More abstractions do not
automatically produce a better component architecture.

## React Pattern Taxonomy

The React-specific catalog can therefore be organized into the following conceptual families.

Component composition patterns include Component Composition, Containment, Specialization, Compound Components, Slots,
Render Props, and Function-as-Children.

Component transformation patterns include Higher-Order Components and Higher-Order Component Composition.

Hook patterns include Custom Hooks, State Hooks, Reducers, Effect Encapsulation, Effect Synchronization, Refs, and
related Hook-based abstractions.

Context patterns include Context Providers, Context plus Custom Hooks, Context Modules, and Context Partitioning.

State ownership patterns include Local State, State Lifting, State Colocation, Controlled Components, Uncontrolled
Components, and Controlled-Uncontrolled Hybrids.

Data patterns include Fetching Hooks, Resource Caches, Server State separation, and asynchronous resource coordination.

Rendering patterns include Conditional Rendering, Null Rendering, Error Boundaries, Suspense Boundaries, and nested
rendering boundaries.

Performance patterns include Memoized Components, Memoized Values, Memoized Callbacks, and Referential Stability.

External-state patterns include External Store Subscriptions and Selectors.

Imperative patterns include Refs, Ref Forwarding, Imperative Handles, and controlled DOM integration.

Form patterns include Controlled Forms, Uncontrolled Forms, Form Reducers, and validation state modeling.

Loading patterns include Lazy Components, Route-Based Code Splitting, and Suspense-based loading boundaries.

Concurrency patterns include Transitions, Deferred Values, and render-safe pure component logic.

Server architecture patterns include Server Components, Client Component Boundaries, Hydration Boundaries, and
Progressive Enhancement.

Architectural component patterns include Layout Components, Provider Composition, Container/Presentational separation,
Headless Components, Feature-Sliced Components, and dependency-oriented component boundaries.

## What Is React-Specific

Not every pattern commonly used in a React project is a React pattern.

Factory Functions, Constructor Functions, Prototype-Based Design, Dependency Injection, Strategy, Adapter, Decorator,
Proxy, Observer, Mediator, Command, State, Composite, Iterator, caching, memoization, lazy loading, and object pooling
are broader software or JavaScript concepts.

React-specificity comes from how a technique interacts with React's rendering and component model.

For example, memoization is a general programming technique, but `React.memo` is React-specific. Dependency Injection is
a general architectural pattern, but providing a dependency through React Context creates a React-specific
implementation. Lazy Loading is a general resource-loading technique, while `React.lazy` integrates lazy module
acquisition with React rendering and Suspense.

This distinction prevents the catalog from duplicating general JavaScript and GoF pattern documentation.

## Summary

React's pattern vocabulary is primarily concerned with component composition, behavioral reuse, state ownership,
rendering boundaries, dependency propagation, asynchronous rendering, external state, and server/client execution
boundaries.

The core structural pattern is composition. Custom Hooks, Render Props, Higher-Order Components, Context, Controlled
Components, Headless Components, and Provider Composition are different mechanisms for controlling where behavior,
state, dependencies, and presentation belong.

The core state-management concerns are ownership, derivation, synchronization, transition modeling, and subscription.
The core rendering concerns are identity, purity, boundaries, asynchronous readiness, errors, and scheduling. The core
architectural concerns are dependency direction, component boundaries, server/client separation, and keeping state and
behavior close to the components that actually own them.

React-specific patterns should complement rather than replace general design patterns. The most effective React
architecture normally combines React's component and rendering primitives with ordinary JavaScript composition,
functional techniques, dependency management, domain modeling, and established software design patterns.

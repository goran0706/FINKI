# Reducer Pattern

The Reducer pattern is a state-management pattern in React in which state transitions are represented by a pure reducer
function that receives the current state and an action and returns the next state.

The defining characteristic is that state transitions are centralized into an explicit function:

```tsx
type State = {
    count: number;
};

type Action =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "reset" };

function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1,
            };

        case "decrement":
            return {
                ...state,
                count: state.count - 1,
            };

        case "reset":
            return {
                ...state,
                count: 0,
            };
    }
}
```

The component owns the reducer state through `useReducer`:

```tsx
function Counter() {
    const [state, dispatch] = React.useReducer(
        reducer,
        {count: 0},
    );

    return (
        <div>
            <button
                onClick={() => dispatch({type: "decrement"})}
            >
                -
            </button>

            <span>{state.count}</span>

            <button
                onClick={() => dispatch({type: "increment"})}
            >
                +
            </button>
        </div>
    );
}
```

The reducer determines how actions transform state. The component determines when actions are dispatched and how the
resulting state is rendered.

## Intent

Use the Reducer pattern when state consists of multiple related values or when state transitions are sufficiently
complex that distributing updates across multiple `setState` calls makes the transition logic difficult to reason about.

A reducer is particularly useful when:

* multiple state fields change together;
* several events can produce related transitions;
* transitions have explicit domain semantics;
* state has mutually exclusive modes;
* the next state depends on the previous state;
* state transitions should be centralized and testable;
* event handling would otherwise contain substantial branching logic.

The pattern turns implicit state transitions into an explicit transition model.

## Core Structure

A reducer has the conceptual signature:

```tsx
type Reducer<State, Action> = (
    state: State,
    action: Action,
) => State;
```

React's `useReducer` connects this transition function to a component:

```tsx
const [state, dispatch] = React.useReducer(
    reducer,
    initialState,
);
```

The component dispatches an action:

```tsx
dispatch({
    type: "increment",
});
```

React invokes the reducer with the current state and action and uses the returned value as the next state.

The reducer itself does not render UI.

## State

State should represent the minimum information necessary to describe the current condition of the behavior.

```tsx
type State = {
    status: "idle" | "loading" | "success" | "error";
    data: User[] | null;
    error: Error | null;
};
```

A reducer can then enforce relationships between these fields.

For example, a successful state can contain data while an error state contains an error.

The state model should avoid storing values that can be derived reliably from other state.

```tsx
type State = {
    items: Item[];
    selectedId: string | null;
};
```

If the number of items is simply `items.length`, storing both `items` and `itemCount` creates two sources of truth.

Prefer:

```tsx
const itemCount = state.items.length;
```

This keeps the reducer responsible for actual state transitions rather than maintaining redundant derived values.

## Actions

Actions describe events or requested transitions.

```tsx
type Action =
    | { type: "add"; item: Item }
    | { type: "remove"; id: string }
    | { type: "clear" };
```

The action type should communicate what happened or what transition is being requested.

Domain-oriented action names are generally clearer than implementation-oriented names.

Prefer:

```tsx
dispatch({
    type: "itemAdded",
    item,
});
```

over:

```tsx
dispatch({
    type: "setItems",
    items: [...state.items, item],
});
```

The first describes an event. The second exposes a particular state mutation strategy to the caller.

This distinction allows the reducer to remain responsible for determining the resulting state.

## Action Payloads

Actions can carry the information necessary to perform the transition.

```tsx
type Action =
    | {
    type: "quantityChanged";
    productId: string;
    quantity: number;
}
    | {
    type: "itemRemoved";
    productId: string;
};
```

The payload should contain transition inputs rather than unnecessary copies of the entire state.

Avoid actions that simply transmit a complete replacement state unless replacing the state is itself the intended domain
operation.

```tsx
dispatch({
    type: "setState",
    state: nextState,
});
```

This effectively bypasses the reducer's role as the owner of transition semantics.

## Pure Reducers

A reducer should be a pure function.

Given the same state and action, it should produce the same next state without observable side effects.

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1,
            };

        default:
            return state;
    }
}
```

A reducer should not:

* perform network requests;
* mutate external variables;
* modify the DOM;
* start timers;
* subscribe to external systems;
* perform logging that is semantically required for the transition;
* generate side effects required for correctness.

Those responsibilities belong outside the reducer.

Purity makes reducers easier to test, reason about, replay, and reuse.

## Immutability

Reducers should return new state rather than mutating the existing state.

Avoid:

```tsx
function reducer(state: State, action: Action) {
    state.count += 1;

    return state;
}
```

Prefer:

```tsx
function reducer(state: State, action: Action) {
    return {
        ...state,
        count: state.count + 1,
    };
}
```

For nested structures, create new objects along the modified path.

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "profileNameChanged":
            return {
                ...state,
                profile: {
                    ...state.profile,
                    name: action.name,
                },
            };

        default:
            return state;
    }
}
```

Structural sharing preserves references for unchanged portions of the state.

## Explicit Transitions

The primary advantage of a reducer is that transitions become explicit.

Without a reducer, related state changes may be distributed across event handlers:

```tsx
function handleSubmit() {
    setStatus("loading");
    setError(null);
    setData(null);
}
```

With a reducer:

```tsx
dispatch({
    type: "submitStarted",
});
```

The transition is centralized:

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "submitStarted":
            return {
                ...state,
                status: "loading",
                error: null,
                data: null,
            };

        default:
            return state;
    }
}
```

The action communicates the domain event while the reducer determines which state fields must change together.

## Multiple Related State Values

Reducers are particularly valuable when several values must remain consistent.

Consider a form submission state:

```tsx
type State = {
    status: "idle" | "submitting" | "success" | "error";
    error: Error | null;
};
```

A transition can update both fields atomically:

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "submitStarted":
            return {
                status: "submitting",
                error: null,
            };

        case "submitFailed":
            return {
                status: "error",
                error: action.error,
            };

        case "submitSucceeded":
            return {
                status: "success",
                error: null,
            };

        default:
            return state;
    }
}
```

The reducer establishes valid relationships between the state fields.

## Discriminated Union State

TypeScript discriminated unions can make reducer state models more precise.

```tsx
type State =
    | { status: "idle" }
    | { status: "loading" }
    | {
    status: "success";
    data: User[];
}
    | {
    status: "error";
    error: Error;
};
```

The state now encodes which data is valid for each status.

A component can use exhaustive narrowing:

```tsx
function UserList({state}: { state: State }) {
    switch (state.status) {
        case "idle":
            return <EmptyState/>;

        case "loading":
            return <Spinner/>;

        case "success":
            return <List users={state.data}/>;

        case "error":
            return <ErrorMessage error={state.error}/>;
    }
}
```

This can prevent impossible combinations such as a `"success"` state without data or an `"error"` state without an
error.

## Exhaustive Actions

Actions can also be modeled as discriminated unions.

```tsx
type Action =
    | { type: "load" }
    | { type: "success"; data: User[] }
    | { type: "failure"; error: Error };
```

The reducer then handles every known transition:

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "load":
            return {
                status: "loading",
            };

        case "success":
            return {
                status: "success",
                data: action.data,
            };

        case "failure":
            return {
                status: "error",
                error: action.error,
            };
    }
}
```

When the action union changes, TypeScript can help identify reducers that no longer handle the complete action set.

An explicit unreachable branch can make the exhaustiveness requirement stronger:

```tsx
function assertNever(
    value: never,
): never {
    throw new Error(
        `Unhandled action: ${String(value)}`,
    );
}
```

The reducer can then use:

```tsx
default:
return assertNever(action);
```

This is especially useful in large state machines.

## Reducer Initialization

`useReducer` accepts an initial state directly:

```tsx
const [state, dispatch] = React.useReducer(
    reducer,
    initialState,
);
```

It can also derive the initial state through an initialization function:

```tsx
function initialize(initialCount: number) {
    return {
        count: initialCount,
    };
}

const [state, dispatch] = React.useReducer(
    reducer,
    initialCount,
    initialize,
);
```

Lazy initialization is useful when creating the initial state requires computation or normalization.

The initializer should not be used as a substitute for general initialization side effects. Initialization should remain
deterministic.

## Resetting State

A reducer can represent reset as an explicit transition.

```tsx
type Action =
    | { type: "increment" }
    | { type: "reset" };
```

The reducer can restore the initial state:

```tsx
const initialState = {
    count: 0,
};

function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "increment":
            return {
                count: state.count + 1,
            };

        case "reset":
            return initialState;
    }
}
```

If the initial state depends on runtime input, the reducer can use the appropriate reset payload or initialization
strategy rather than assuming a module-level constant.

## Reducers and Event Semantics

An action should generally describe an event rather than prescribe the exact state mutation.

For example:

```tsx
dispatch({
    type: "taskCompleted",
    taskId,
});
```

The reducer decides what completion means:

```tsx
case
"taskCompleted"
:
return {
    ...state,
    tasks: state.tasks.map((task) =>
        task.id === action.taskId
            ? {...task, completed: true}
            : task,
    ),
};
```

This keeps transition rules centralized.

An action such as:

```tsx
dispatch({
    type: "setTasks",
    tasks: nextTasks,
});
```

can be valid when replacing the task collection is genuinely the operation being modeled. The problem is not the action
name itself but using generic state replacement to bypass domain-level transition semantics.

## Reducers and Effects

Reducers should not perform Effects.

Avoid:

```tsx
function reducer(state: State, action: Action) {
    if (action.type === "save") {
        fetch("/api/save", {
            method: "POST",
            body: JSON.stringify(state),
        });
    }

    return state;
}
```

Instead, dispatch the event and perform the asynchronous operation in an appropriate Effect or event handler.

```tsx
function Component() {
    const [state, dispatch] =
        React.useReducer(reducer, initialState);

    async function handleSave() {
        dispatch({type: "saveStarted"});

        try {
            await save(state);
            dispatch({type: "saveSucceeded"});
        } catch (error) {
            dispatch({
                type: "saveFailed",
                error: normalizeError(error),
            });
        }
    }

    // rendering
}
```

The reducer describes state transitions. The surrounding code coordinates external effects.

## Reducers and Asynchronous Operations

A reducer itself is synchronous.

It can represent the state of an asynchronous operation:

```tsx
type State =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: User }
    | { status: "error"; error: Error };
```

The asynchronous operation occurs elsewhere:

```tsx
async function loadUser() {
    dispatch({type: "loadStarted"});

    try {
        const user = await fetchUser();

        dispatch({
            type: "loadSucceeded",
            user,
        });
    } catch (error) {
        dispatch({
            type: "loadFailed",
            error: normalizeError(error),
        });
    }
}
```

The reducer remains responsible for representing the resulting state transitions.

Cancellation, request identity, retries, and resource ownership are separate concerns that may require additional
coordination.

## Reducers and Event Handlers

Event handlers are often responsible for dispatching actions.

```tsx
function Form() {
    const [state, dispatch] =
        React.useReducer(reducer, initialState);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        dispatch({
            type: "fieldChanged",
            field: event.target.name,
            value: event.target.value,
        });
    }

    return (
        <input
            name="email"
            value={state.email}
            onChange={handleChange}
        />
    );
}
```

The event handler translates a UI event into an application action.

The reducer translates the action into a state transition.

This separation keeps event-specific DOM details outside the state-transition function.

## Reducer Composition

Large reducers can become difficult to maintain when unrelated state domains are handled by one function.

A reducer can sometimes be divided into smaller reducers.

```tsx
function userReducer(
    state: UserState,
    action: UserAction,
): UserState {
    // ...
}

function cartReducer(
    state: CartState,
    action: CartAction,
): CartState {
    // ...
}
```

A parent reducer can coordinate them:

```tsx
function appReducer(
    state: AppState,
    action: AppAction,
): AppState {
    return {
        user: userReducer(state.user, action),
        cart: cartReducer(state.cart, action),
    };
}
```

The action types and ownership model need to remain clear. Reducer composition should reduce conceptual complexity
rather than merely distribute a large switch statement across files.

## Reducer with Context

A reducer can be combined with Context to create a shared state-and-dispatch API.

```tsx
const StateContext =
    React.createContext<State | null>(null);

const DispatchContext =
    React.createContext<React.Dispatch<Action> | null>(
        null,
    );
```

A provider can own the reducer:

```tsx
function AppProvider({
                         children,
                     }: {
    children: React.ReactNode;
}) {
    const [state, dispatch] =
        React.useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}
```

Consumers can then access state and dispatch through dedicated Hooks:

```tsx
function useAppState() {
    const state = React.useContext(StateContext);

    if (state === null) {
        throw new Error(
            "useAppState must be used within AppProvider",
        );
    }

    return state;
}

function useAppDispatch() {
    const dispatch =
        React.useContext(DispatchContext);

    if (dispatch === null) {
        throw new Error(
            "useAppDispatch must be used within AppProvider",
        );
    }

    return dispatch;
}
```

This combination provides centralized transitions and shared access.

However, Context does not become necessary merely because a reducer is used. A local reducer can remain entirely local
to one component.

## Local Reducer vs Shared Reducer

A reducer is often most appropriate when the state is local to a component or a small component subtree.

```tsx
function Editor() {
    const [state, dispatch] =
        React.useReducer(editorReducer, initialState);

    // ...
}
```

If many unrelated descendants need the same state, the reducer can be moved behind Context or an external store.

The reducer pattern and the state-sharing mechanism are independent concerns.

A reducer answers:

> How are state transitions defined?

Context answers:

> How do descendants obtain the state or dispatch function?

An external store answers a different question:

> Where does shared state live, and how do consumers subscribe to it?

These mechanisms can be combined without being conceptually identical.

## Reducers and State Machines

A reducer can implement a finite state machine when the state and actions explicitly define valid transitions.

```tsx
type State =
    | { status: "idle" }
    | { status: "running" }
    | { status: "completed" };

type Action =
    | { type: "start" }
    | { type: "complete" }
    | { type: "reset" };
```

The reducer defines which transitions are allowed:

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (state.status) {
        case "idle":
            if (action.type === "start") {
                return {status: "running"};
            }

            return state;

        case "running":
            if (action.type === "complete") {
                return {status: "completed"};
            }

            return state;

        case "completed":
            if (action.type === "reset") {
                return {status: "idle"};
            }

            return state;
    }
}
```

The Reducer pattern is therefore capable of expressing state-machine behavior, but not every reducer should be treated
as a formal finite-state-machine implementation.

The distinction depends on whether the state model and transition relation are explicitly modeled as such.

## Reducers and `useState`

`useState` is often simpler when state transitions are straightforward.

```tsx
const [count, setCount] = React.useState(0);
```

A reducer becomes useful when transitions have meaningful event semantics:

```tsx
const [state, dispatch] =
    React.useReducer(reducer, initialState);

dispatch({
    type: "increment",
});
```

For simple independent values, a reducer can introduce unnecessary ceremony.

For tightly coupled state values with many transitions, a reducer can make the model significantly clearer.

The decision should be based on transition complexity rather than on a general preference for one API.

## Reducers and Immer

Reducers can use immutable update helpers such as Immer when deeply nested state would otherwise require extensive
structural copying.

```tsx
import {produce} from "immer";

const reducer = produce(
    (draft: State, action: Action) => {
        switch (action.type) {
            case "renameUser":
                draft.user.name = action.name;
                break;
        }
    },
);
```

The reducer still conceptually produces immutable state transitions. The helper changes the mechanics of expressing
those transitions.

An immutable-state helper is not part of the Reducer pattern itself.

## Testing

Pure reducers are particularly easy to unit test because they have deterministic input and output.

```tsx
const initialState = {
    count: 0,
};

expect(
    reducer(initialState, {
        type: "increment",
    }),
).toEqual({
    count: 1,
});
```

Multiple transitions can be tested independently:

```tsx
const state1 = reducer(
    initialState,
    {type: "increment"},
);

const state2 = reducer(
    state1,
    {type: "increment"},
);

expect(state2).toEqual({
    count: 2,
});
```

Reducer tests should focus on transition semantics:

* given this state;
* when this action occurs;
* the resulting state should be this.

Because reducers should be pure, these tests do not require rendering a component.

## Error Handling

Reducers should have an explicit policy for unknown or invalid actions.

For TypeScript discriminated unions, exhaustive handling is generally preferable.

```tsx
function reducer(
    state: State,
    action: Action,
): State {
    switch (action.type) {
        case "increment":
            return {
                count: state.count + 1,
            };

        case "decrement":
            return {
                count: state.count - 1,
            };
    }
}
```

A runtime default branch can also reject unsupported actions:

```tsx
default:
throw new Error(
    `Unknown action: ${action.type}`,
);
```

Returning the current state for unknown actions can be appropriate in some architectures, particularly when reducers
intentionally receive a broader action stream. The correct choice depends on the reducer's contract.

## Performance

Reducers do not inherently make an application faster.

The primary benefit is state-transition organization and predictability.

Every dispatch causes React to process the reducer and determine whether the resulting state should trigger an update.

Returning the existing state object can communicate that no state change occurred:

```tsx
case
"noop"
:
return state;
```

Returning a newly allocated equivalent object instead:

```tsx
case
"noop"
:
return {
    ...state,
};
```

creates a different state reference and can cause unnecessary work.

Reducer performance therefore depends on state size, update frequency, structural sharing, component boundaries, and
downstream rendering behavior.

## Common Misuses

Do not use reducers for trivial state solely because the pattern appears more architectural.

Do not put side effects inside reducers.

Do not mutate the current state.

Do not store redundant derived values unless there is a specific reason to materialize them.

Do not create generic `"setState"` actions that allow every caller to bypass the reducer's transition semantics.

Do not put unrelated domains into a single reducer merely because they happen to exist in the same component.

Do not assume `useReducer` automatically provides shared state.

Do not dispatch actions merely to perform synchronous calculations that could be expressed directly as derived values.

Do not make actions unnecessarily coupled to React or DOM implementation details. A reducer can often remain independent
of React entirely.

## Advantages

The Reducer pattern centralizes state transitions into an explicit and testable model.

It makes complex state relationships easier to reason about because related changes can occur as one named transition.

It provides a natural place to encode invariants and state-machine-like transitions.

Pure reducers are also straightforward to test independently of React rendering.

The pattern scales well when a state domain contains many distinct events and transitions.

## Disadvantages

Reducers introduce additional concepts: state, actions, dispatch, and a transition function.

For simple state, this can be unnecessary ceremony.

Large reducers can become difficult to navigate if they accumulate too many unrelated actions and state domains.

Poorly designed action types can also obscure rather than clarify the state model. An action vocabulary consisting
almost entirely of generic setters provides little semantic value.

Reducers do not solve asynchronous coordination, resource management, caching, or state sharing by themselves. Those
concerns require additional mechanisms.

## When to Use

Use the Reducer pattern when:

* state contains multiple related values;
* transitions are numerous or non-trivial;
* several events modify the same state domain;
* state invariants need centralized enforcement;
* explicit domain events improve readability;
* transitions should be independently unit tested;
* the state behaves like a small state machine.

Prefer `useState` when:

* state is simple;
* transitions are obvious;
* there are only a few independent updates;
* a reducer would add more ceremony than clarity.

Combine a reducer with Context when:

* the reducer-managed state must be consumed by multiple descendants.

Use an external store when:

* shared state needs store-level subscription, independent lifecycle, or broader application-level ownership.

Use a dedicated state-machine abstraction when:

* the transition model is sufficiently complex that explicit states, events, guards, effects, and transition rules
  deserve a first-class architecture.

## Relationship to Other Patterns

The Reducer pattern is specifically concerned with state transition logic.

`useState` manages state but does not require a centralized transition function. A reducer introduces explicit actions
and a pure transition function.

Custom Hooks can encapsulate a reducer and expose a domain-specific behavioral API:

```tsx
function useEditor() {
    const [state, dispatch] =
        React.useReducer(editorReducer, initialState);

    return {
        state,
        dispatch,
    };
}
```

Context can distribute reducer state and dispatch to descendants, but Context itself is not a reducer.

State Machines can be implemented with reducers when the reducer explicitly models states and valid transitions.

The defining property of the Reducer pattern is therefore the centralization of state transitions:

```tsx
nextState = reducer(currentState, action);
```

React's `useReducer` provides the mechanism for connecting that transition model to component state, while the reducer
itself remains a pure representation of how the state changes.

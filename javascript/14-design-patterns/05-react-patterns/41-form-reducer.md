# Form Reducer

The Form Reducer pattern uses a reducer to model form state transitions as explicit actions. Instead of updating
multiple pieces of form state directly from event handlers, user interactions and form lifecycle events are represented
as actions that a reducer transforms into the next state.

This pattern is useful when a form contains enough related state and transitions that independently updating values,
errors, touched state, submission state, and other metadata becomes difficult to reason about.

A simple form can use `useState`:

```tsx
function Form() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // ...
}
```

A more complex form can centralize those transitions:

```tsx
type FormState = {
    values: Values;
    errors: Errors;
    touched: Record<string, boolean>;
    status: "idle" | "submitting" | "success" | "error";
};

type Action =
    | {
    type: "fieldChanged";
    field: keyof Values;
    value: string;
}
    | {
    type: "fieldBlurred";
    field: keyof Values;
}
    | {
    type: "validationFailed";
    errors: Errors;
}
    | {
    type: "submitStarted";
}
    | {
    type: "submitSucceeded";
}
    | {
    type: "submitFailed";
}
    | {
    type: "reset";
};
```

The reducer becomes the single transition function:

```tsx
function reducer(
    state: FormState,
    action: Action
): FormState {
    switch (action.type) {
        case "fieldChanged":
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.field]: action.value,
                },
            };

        case "fieldBlurred":
            return {
                ...state,
                touched: {
                    ...state.touched,
                    [action.field]: true,
                },
            };

        case "validationFailed":
            return {
                ...state,
                errors: action.errors,
            };

        case "submitStarted":
            return {
                ...state,
                status: "submitting",
            };

        case "submitSucceeded":
            return {
                ...state,
                status: "success",
            };

        case "submitFailed":
            return {
                ...state,
                status: "error",
            };

        case "reset":
            return initialState;

        default:
            return state;
    }
}
```

The important property is not the use of `useReducer` itself. The pattern is the explicit modeling of form transitions
as domain-level actions.

## Intent

The intent is to centralize complex form transitions so that state changes are explicit, predictable, and testable.

A Form Reducer is particularly useful when one user interaction affects several related pieces of state.

For example, submitting a form may need to:

* Validate current values.
* Mark fields as touched.
* Clear previous errors.
* Enter a submitting state.
* Preserve the current values.
* Record a successful result.
* Record a submission failure.
* Reset submission metadata.

Representing these transitions independently in multiple event handlers can make the form's lifecycle difficult to
follow.

A reducer provides one transition model.

## Form State vs Form Reducer

Form State and Form Reducer are related but distinct concerns.

Form State defines what the form needs to remember:

```tsx
type FormState = {
    values: Values;
    errors: Errors;
    touched: Record<string, boolean>;
    status: Status;
};
```

Form Reducer defines how that state changes:

```tsx
function reducer(
    state: FormState,
    action: Action
): FormState {
    // ...
}
```

Form State therefore owns the data model.

Form Reducer owns the transition model.

A form can have Form State without a reducer.

A reducer becomes useful when the number or relationship of transitions justifies centralizing them.

## Basic Reducer

The smallest useful form reducer can manage field changes.

```tsx
type Values = {
    email: string;
    password: string;
};

type Action =
    | {
    type: "fieldChanged";
    field: keyof Values;
    value: string;
};

function reducer(
    state: Values,
    action: Action
): Values {
    switch (action.type) {
        case "fieldChanged":
            return {
                ...state,
                [action.field]: action.value,
            };

        default:
            return state;
    }
}
```

The component dispatches semantic actions:

```tsx
dispatch({
    type: "fieldChanged",
    field: "email",
    value: event.target.value,
});
```

The event handler does not directly manipulate the entire state structure.

## `useReducer`

React provides `useReducer` for reducer-based state transitions.

```tsx
const [state, dispatch] = useReducer(
    reducer,
    initialState
);
```

The component reads the current state:

```tsx
state.values.email
```

and dispatches actions:

```tsx
dispatch({
    type: "fieldChanged",
    field: "email",
    value: nextValue,
});
```

The reducer receives the current state and action and returns the next state.

The reducer should be a pure function.

## Pure Reducers

A reducer should not perform side effects.

```tsx
function reducer(
    state: FormState,
    action: Action
): FormState {
    switch (action.type) {
        case "fieldChanged":
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.field]: action.value,
                },
            };

        default:
            return state;
    }
}
```

The reducer should not:

* Send network requests.
* Modify the DOM.
* Read browser storage.
* Start timers.
* Perform asynchronous validation.
* Trigger analytics.
* Mutate external objects.

Those operations belong outside the reducer.

The reducer determines the next form state from the current state and action.

## Action Design

Actions should describe meaningful events or state transitions.

Good examples include:

```tsx
type Action =
    | {
    type: "fieldChanged";
    field: keyof Values;
    value: string;
}
    | {
    type: "fieldBlurred";
    field: keyof Values;
}
    | {
    type: "validationStarted";
}
    | {
    type: "validationSucceeded";
    errors: Errors;
}
    | {
    type: "submitStarted";
}
    | {
    type: "submitSucceeded";
}
    | {
    type: "submitFailed";
    message: string;
};
```

The action should communicate what happened rather than expose arbitrary implementation operations.

Prefer:

```tsx
dispatch({
    type: "submitStarted",
});
```

over actions that merely mirror state assignments:

```tsx
dispatch({
    type: "setSubmitting",
    value: true,
});
```

The first expresses a domain event.

The second exposes an implementation detail.

## Field Actions

Field-level interactions commonly become actions.

```tsx
type Action =
    | {
    type: "fieldChanged";
    field: keyof Values;
    value: string;
}
    | {
    type: "fieldFocused";
    field: keyof Values;
}
    | {
    type: "fieldBlurred";
    field: keyof Values;
};
```

The reducer can then update the corresponding metadata.

```tsx
case
"fieldBlurred"
:
return {
    ...state,
    touched: {
        ...state.touched,
        [action.field]: true,
    },
};
```

This centralizes field lifecycle behavior.

## Field-Specific Actions

Generic field actions are not always the best choice.

A complex form may have domain-specific transitions:

```tsx
type Action =
    | {
    type: "emailChanged";
    value: string;
}
    | {
    type: "passwordChanged";
    value: string;
}
    | {
    type: "shippingAddressChanged";
    address: Address;
};
```

Explicit actions can provide stronger semantics and type safety.

The appropriate level of genericity depends on the form.

A generic `"fieldChanged"` action is useful for uniform field behavior.

Domain-specific actions are useful when different fields have different transition rules.

## Nested State

Reducers are useful when form state contains nested structures.

```tsx
type Values = {
    customer: {
        name: string;
        email: string;
    };
    address: {
        city: string;
        postalCode: string;
    };
};
```

A reducer can centralize immutable updates:

```tsx
case
"customerNameChanged"
:
return {
    ...state,
    values: {
        ...state.values,
        customer: {
            ...state.values.customer,
            name: action.value,
        },
    },
};
```

The reducer makes the update structure explicit.

## Immutable State Transitions

Reducer transitions should return new state rather than mutate the existing state.

Correct:

```tsx
case
"fieldChanged"
:
return {
    ...state,
    values: {
        ...state.values,
        [action.field]: action.value,
    },
};
```

Incorrect:

```tsx
case
"fieldChanged"
:
state.values[action.field] = action.value;
return state;
```

Immutable transitions make state changes predictable and preserve React's change-detection assumptions.

Structural sharing also allows unchanged portions of a form state tree to retain their existing references.

## Initial State

The initial form state should be explicit.

```tsx
const initialState: FormState = {
    values: {
        email: "",
        password: "",
    },
    errors: {},
    touched: {},
    status: "idle",
};
```

The initial state can also establish the reset baseline.

```tsx
case
"reset"
:
return initialState;
```

If reset semantics differ from initialization semantics, they should use separate state definitions.

For example, a form initialized from server data may need to retain the latest persisted values as its reset baseline.

## Reset

Reset should be represented as an explicit transition when the form uses a reducer.

```tsx
dispatch({
    type: "reset",
});
```

The reducer can restore the appropriate baseline:

```tsx
case
"reset"
:
return initialState;
```

A more complex form may distinguish between resetting to the original initial values and resetting to the latest
persisted values.

```tsx
type Action =
    | { type: "resetToInitial" }
    | { type: "resetToSaved" };
```

The distinction matters when the form represents editable server-backed data.

## Dirty State

Dirty state can be derived from form values rather than stored independently.

```tsx
const dirty =
    !areEqual(state.values, initialValues);
```

If dirty state has more complex semantics, such as comparing against the latest successfully persisted values, the
reducer can update the appropriate baseline explicitly.

Avoid storing both the authoritative values and redundant dirty information unless there is a concrete reason.

## Touched State

Touched metadata is naturally represented by reducer transitions.

```tsx
case
"fieldBlurred"
:
return {
    ...state,
    touched: {
        ...state.touched,
        [action.field]: true,
    },
};
```

The reducer provides a single place to define what `"fieldBlurred"` means.

For example, a submit action might mark all relevant fields as touched:

```tsx
case
"submitAttempted"
:
return {
    ...state,
    touched: allFieldsTouched,
};
```

This avoids duplicating that behavior across multiple submission paths.

## Validation

Validation should generally remain separate from the reducer.

A pure validation function can consume form values:

```tsx
function validate(values: Values): Errors {
    const errors: Errors = {};

    if (!values.email.includes("@")) {
        errors.email = "Enter a valid email address.";
    }

    if (values.password.length < 8) {
        errors.password = "Password must contain at least 8 characters.";
    }

    return errors;
}
```

The result can then be dispatched:

```tsx
const errors = validate(state.values);

dispatch({
    type: "validationCompleted",
    errors,
});
```

This preserves reducer purity while still allowing validation results to become part of form state.

## Validation Transitions

A more explicit validation lifecycle can be represented as:

```tsx
type Action =
    | {
    type: "validationStarted";
}
    | {
    type: "validationCompleted";
    errors: Errors;
};
```

The reducer controls the resulting state:

```tsx
case
"validationStarted"
:
return {
    ...state,
    validation: {
        status: "validating",
        errors: {},
    },
};

case
"validationCompleted"
:
return {
    ...state,
    validation: {
        status: "complete",
        errors: action.errors,
    },
};
```

This is useful when validation itself has meaningful lifecycle state.

## Asynchronous Validation

Asynchronous validation must not be performed inside the reducer.

Instead, an external operation performs validation:

```tsx
async function validateUsername(
    username: string
): Promise<string | null> {
    return checkUsernameAvailability(username);
}
```

The operation can dispatch lifecycle actions:

```tsx
dispatch({
    type: "validationStarted",
});

const error = await validateUsername(
    state.values.username
);

dispatch({
    type: "validationCompleted",
    errors: error
        ? {username: error}
        : {},
});
```

The asynchronous operation must also handle stale results and cancellation where necessary.

The reducer remains responsible only for applying the resulting action.

## Preventing Stale Validation Results

Consider two validation operations:

```text
"alice"
"alice1"
```

If the `"alice"` request completes after `"alice1"`, applying the older result can corrupt the current form state.

The operation layer must establish whether a result is still current.

A request identifier can be included in actions:

```tsx
type Action =
    | {
    type: "validationStarted";
    requestId: number;
}
    | {
    type: "validationCompleted";
    requestId: number;
    errors: Errors;
};
```

The reducer can then reject obsolete results:

```tsx
case
"validationCompleted"
:
if (action.requestId !== state.validation.requestId) {
    return state;
}

return {
    ...state,
    validation: {
        status: "complete",
        errors: action.errors,
        requestId: action.requestId,
    },
};
```

This is useful when asynchronous validation has meaningful concurrency.

## Submission State

Submission is often a strong reason to use a reducer because one submission attempt can affect several pieces of state.

```tsx
type Submission =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success" }
    | { status: "error"; message: string };
```

Actions can model the lifecycle:

```tsx
type Action =
    | { type: "submitStarted" }
    | { type: "submitSucceeded" }
    | { type: "submitFailed"; message: string };
```

The reducer transitions between these states explicitly.

```tsx
case
"submitStarted"
:
return {
    ...state,
    submission: {
        status: "submitting",
    },
};

case
"submitSucceeded"
:
return {
    ...state,
    submission: {
        status: "success",
    },
};

case
"submitFailed"
:
return {
    ...state,
    submission: {
        status: "error",
        message: action.message,
    },
};
```

A discriminated union prevents invalid combinations of submission flags.

## Submission Effects

The reducer should not submit the form itself.

The component or another operation layer can coordinate the asynchronous request:

```tsx
async function handleSubmit() {
    dispatch({
        type: "submitStarted",
    });

    try {
        await submit(state.values);

        dispatch({
            type: "submitSucceeded",
        });
    } catch (error) {
        dispatch({
            type: "submitFailed",
            message: getErrorMessage(error),
        });
    }
}
```

The reducer describes the resulting state transitions.

The asynchronous function owns the side effect.

## Submission Snapshots

When submitting asynchronously, the request should generally use a deliberate snapshot of the values being submitted.

```tsx
const valuesToSubmit = state.values;

dispatch({
    type: "submitStarted",
});

await submit(valuesToSubmit);
```

The user may continue editing while the request is in progress.

The form should distinguish the values associated with a submission from the current draft when those semantics matter.

This becomes especially important for autosave or concurrent submissions.

## Submission Race Conditions

If multiple submissions can be active simultaneously, completion order may not match initiation order.

For example:

```text
submission A
submission B
```

If B completes first and A completes later, blindly applying A's result can overwrite newer state.

A submission identifier can establish ordering:

```tsx
type Action =
    | {
    type: "submitStarted";
    submissionId: number;
}
    | {
    type: "submitSucceeded";
    submissionId: number;
}
    | {
    type: "submitFailed";
    submissionId: number;
    message: string;
};
```

The reducer can ignore results that no longer correspond to the active submission.

Whether concurrent submissions should be allowed at all is a domain decision.

## Action Granularity

Actions should be neither excessively generic nor unnecessarily granular.

This:

```tsx
{
    type: "setState",
        state
:
    nextState
}
```

defeats most of the purpose of a reducer because it simply moves state construction outside the reducer.

This:

```tsx
{
    type: "setSubmitting",
        value
:
    true
}
```

may be technically valid but can expose low-level implementation details.

This:

```tsx
{
    type: "submitStarted"
}
```

better communicates the semantic event.

The reducer can then determine exactly what `"submitStarted"` means.

## Domain Events

Actions can represent meaningful form events:

```tsx
type Action =
    | { type: "fieldChanged"; field: keyof Values; value: string }
    | { type: "fieldBlurred"; field: keyof Values }
    | { type: "submitAttempted" }
    | { type: "validationCompleted"; errors: Errors }
    | { type: "submitStarted" }
    | { type: "submitSucceeded" }
    | { type: "submitFailed"; message: string }
    | { type: "reset" };
```

This creates a vocabulary for the form's lifecycle.

The vocabulary should remain specific to the form's actual behavior.

## Reducer Invariants

A useful reducer should preserve state invariants.

For example:

```tsx
type FormState = {
    values: Values;
    submission:
        | { status: "idle" }
        | { status: "submitting" }
        | { status: "success" }
        | { status: "error"; message: string };
};
```

An invariant might be that `"submitting"` is the only state in which an active submission exists.

The reducer can enforce this consistently across every action.

This is one of the main advantages over independently manipulating several booleans.

## Avoiding Contradictory Flags

Prefer:

```tsx
type Submission =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success" }
    | { status: "error"; message: string };
```

over:

```tsx
type Submission = {
    submitting: boolean;
    succeeded: boolean;
    failed: boolean;
};
```

The union makes impossible combinations unrepresentable.

A reducer can then transition between valid states rather than manually keeping several flags synchronized.

## Derived State

Reducers should not automatically store every value that can be derived.

For example:

```tsx
const isValid = Object.keys(state.errors).length === 0;
```

may be sufficient.

Likewise:

```tsx
const dirty = !areEqual(
    state.values,
    initialValues
);
```

may be preferable to maintaining:

```tsx
state.dirty
```

as independent state.

Store information when it has its own lifecycle or semantics. Derive information when it is a deterministic consequence
of existing state and cheap enough to compute.

## Reducer State Shape

The reducer's state should represent meaningful form state rather than event history.

A reasonable state might be:

```tsx
type FormState = {
    values: Values;
    touched: Record<string, boolean>;
    errors: Errors;
    submission: Submission;
};
```

An unnecessarily historical state might contain:

```tsx
type FormState = {
    lastAction: Action;
    previousState: FormState | null;
    actionCount: number;
    values: Values;
};
```

unless the application explicitly needs those concepts.

The reducer is not an event-sourcing system merely because it processes actions.

## Reducer and State Ownership

Using a reducer does not determine where form state should live.

A reducer can manage local component state:

```tsx
const [state, dispatch] = useReducer(
    reducer,
    initialState
);
```

It can also be placed in a parent when several components genuinely need the same form state.

The State Colocation and State Lifting patterns determine ownership.

The Form Reducer determines how an already-owned state model transitions.

## Reducer and Context

A complex form can combine a reducer with Context.

The provider owns:

```tsx
const [state, dispatch] = useReducer(
    reducer,
    initialState
);
```

and distributes them to deeply nested fields.

A field can then dispatch:

```tsx
dispatch({
    type: "fieldChanged",
    field: "email",
    value: nextValue,
});
```

This avoids passing state and dispatch through every intermediate component.

Context owns distribution.

The reducer owns transitions.

Form State owns the domain model.

These are separate concerns.

## Context Partitioning

Large forms may benefit from separating contexts so that unrelated consumers do not all subscribe to one changing
context value.

For example, state and dispatch can be exposed separately:

```tsx
const FormStateContext =
    createContext<FormState | null>(null);

const FormDispatchContext =
    createContext<Dispatch<Action> | null>(null);
```

This can reduce unnecessary subscriptions for components that only dispatch actions.

Further partitioning may be appropriate when independent form regions change independently.

The Context Partitioning pattern owns the broader context-boundary strategy.

## Reducer and Custom Hooks

A custom Hook can encapsulate a form reducer:

```tsx
function useFormReducer() {
    const [state, dispatch] = useReducer(
        reducer,
        initialState
    );

    return {
        state,
        dispatch,
    };
}
```

The Hook can expose higher-level operations:

```tsx
function useFormReducer() {
    const [state, dispatch] = useReducer(
        reducer,
        initialState
    );

    function changeField(
        field: keyof Values,
        value: string
    ) {
        dispatch({
            type: "fieldChanged",
            field,
            value,
        });
    }

    return {
        state,
        changeField,
    };
}
```

The Custom Hook pattern owns reusable Hook behavior.

The Form Reducer remains responsible for the transition architecture.

## Reducer and Controlled Components

A reducer can serve as the state owner for controlled fields.

```tsx
<input
    value={state.values.email}
    onChange={(event) =>
        dispatch({
            type: "fieldChanged",
            field: "email",
            value: event.target.value,
        })
    }
/>
```

The input remains controlled because its value comes from React state.

The reducer only changes how that React state is updated.

## Reducer and Uncontrolled Components

A reducer is not required for uncontrolled form fields.

An uncontrolled form can rely on DOM state and `FormData`:

```tsx
const formData = new FormData(event.currentTarget);
```

A reducer becomes relevant only for the state that the application itself needs to own.

Using a reducer does not turn an uncontrolled field into a controlled field.

## Reducer and Imperative Handles

A form component can expose imperative operations while internally using a reducer.

```tsx
interface FormHandle {
    reset(): void;

    submit(): void;
}
```

The handle can dispatch actions:

```tsx
useImperativeHandle(ref, () => ({
    reset() {
        dispatch({
            type: "reset",
        });
    },

    submit() {
        dispatch({
            type: "submitAttempted",
        });
    },
}));
```

The imperative handle provides the external command interface.

The reducer provides the internal transition model.

Neither replaces the other.

## Reducer and Validation Libraries

A reducer-based form architecture can integrate with external validation libraries.

The validator can produce:

```tsx
const errors = validate(values);
```

and the reducer can receive:

```tsx
dispatch({
    type: "validationCompleted",
    errors,
});
```

The validation library does not need to own the form's complete state machine unless the application intentionally
chooses that architecture.

## Reducer and Server State

A reducer should not become a replacement for Server State management.

A form reducer can represent:

```tsx
submission.status
```

while server-state infrastructure manages:

* Remote data.
* Cache identity.
* Freshness.
* Invalidation.
* Revalidation.
* Mutation synchronization.

The form reducer may initiate or respond to those operations, but it should not implicitly become a remote-data cache.

## Reducer and Resource Cache

A Resource Cache can provide initial data for a form.

The reducer can initialize its local form state from that data:

```tsx
const initialState = createFormState(profile);
```

After initialization, the reducer manages the editing state.

The cache remains responsible for resource reuse and freshness.

The form reducer remains responsible for local transition semantics.

## Reducer and External Store

A local `useReducer` state is different from an External Store.

`useReducer` creates state owned by a React component instance.

An External Store owns state outside the React component state model and provides a subscription interface.

A form reducer therefore does not become an external store simply because many actions are dispatched.

## Reducer and Selectors

Selectors can derive specific parts of a complex reducer state.

For example:

```tsx
const emailError = selectEmailError(state);
```

This can be useful when form state is consumed by many independent components.

The Selector Pattern owns state projection.

The reducer owns state transitions.

## Reducer and Referential Stability

Reducer updates should preserve references for unchanged branches.

```tsx
return {
    ...state,
    values: {
        ...state.values,
        email: action.value,
    },
};
```

Here unrelated portions of `state` remain structurally shared.

This supports referential-stability-sensitive consumers.

Avoid recreating unrelated structures unnecessarily:

```tsx
return {
    ...state,
    values: {
        email: action.value,
        password: state.values.password,
    },
    touched: {
        ...state.touched,
    },
};
```

The copied `touched` object is unnecessary if it did not change.

Structural sharing is therefore both a correctness-friendly update strategy and a useful performance property.

## Reducer and Memoization

A reducer does not automatically solve rendering performance.

If every field consumes the complete reducer state from Context, every state change may cause many consumers to render.

Potential solutions include:

* Context partitioning.
* Selectors.
* Component memoization.
* State colocation.
* More granular state ownership.

Do not add memoization before identifying the actual rendering bottleneck.

## Side Effects Outside the Reducer

Side effects can be coordinated around reducer transitions.

For example:

```tsx
async function submitForm(values: Values) {
    dispatch({
        type: "submitStarted",
    });

    try {
        await submit(values);

        dispatch({
            type: "submitSucceeded",
        });
    } catch (error) {
        dispatch({
            type: "submitFailed",
            message: getErrorMessage(error),
        });
    }
}
```

The side effect happens outside the reducer.

The reducer only represents its consequences in application state.

This separation keeps the transition function deterministic.

## Effects and Reducers

An Effect can coordinate external synchronization based on reducer state when necessary.

For example, an Effect might respond to a state transition by integrating with an external system.

However, Effects should not be introduced merely to connect every reducer action to another dispatch.

Prefer direct event-to-action transitions when the relationship is synchronous and local.

The Effect pattern owns synchronization with external systems; the reducer owns state transitions.

## Reducer Testing

Reducers are particularly easy to test because they are pure functions.

A test can provide a state and action:

```tsx
const nextState = reducer(
    initialState,
    {
        type: "fieldChanged",
        field: "email",
        value: "user@example.com",
    }
);
```

and assert the resulting state:

```tsx
expect(nextState.values.email)
    .toBe("user@example.com");
```

Other tests can verify:

* Reset behavior.
* Validation transitions.
* Submission transitions.
* Error handling.
* Stale request rejection.
* Preservation of unrelated state.
* State invariants.
* Invalid action handling.

Reducer tests should focus on transition semantics rather than React rendering details.

## Testing Form Behavior

Reducer tests do not replace interaction tests.

A component test should verify that:

```tsx
user
types
into
the
email
field
```

results in:

```tsx
state.values.email
```

containing the expected value.

It should also verify observable validation, submission, reset, and error behavior.

The reducer can be unit-tested independently while the component tests verify integration.

## Common Misuse

A common misuse is using a reducer for a trivial form:

```tsx
const [email, setEmail] = useState("");
```

does not become better merely because it is rewritten as:

```tsx
dispatch({
    type: "emailChanged",
    value,
});
```

The reducer should solve actual transition complexity.

Another misuse is putting side effects into the reducer.

Another is creating generic `"setState"` actions that bypass the reducer's domain model.

Another is storing every derived property.

Another is creating dozens of actions that simply assign individual booleans.

Another is using a reducer to compensate for incorrect state ownership.

Another is putting server-state caching and synchronization into the form reducer.

Another is treating the action log as persistent history without actually implementing event-sourcing semantics.

## Advantages

The Form Reducer pattern provides:

* Centralized form transitions.
* Explicit action vocabulary.
* Predictable state changes.
* Pure and independently testable transition logic.
* Stronger modeling of complex form lifecycles.
* Easier enforcement of state invariants.
* Natural support for discriminated union state.
* Clear separation between state transitions and side effects.
* A useful foundation for Context-based complex forms.
* Better scalability than scattered state updates when form complexity is genuinely high.

## Disadvantages

The pattern also introduces overhead.

* More boilerplate than simple `useState`.
* More types and actions to maintain.
* Potentially excessive abstraction for small forms.
* Large reducers can become difficult to navigate.
* Poorly designed actions can obscure rather than clarify behavior.
* Complex asynchronous workflows still require coordination outside the reducer.
* Reducers do not automatically solve rendering performance.
* A reducer can become an accidental dumping ground for unrelated state.

## When to Use

Use a Form Reducer when:

* Many form fields participate in one state model.
* One event changes multiple pieces of form state.
* Submission has multiple meaningful lifecycle states.
* Validation has explicit transitions.
* Reset semantics are complex.
* The form contains nested or dynamic state.
* State invariants matter.
* Several components need to dispatch well-defined form actions.
* The transition logic is substantial enough to benefit from independent testing.

## When Not to Use

Do not use a reducer when simple `useState` updates are already clear.

Do not use a reducer merely because the form contains several fields.

Do not put asynchronous operations or side effects directly into the reducer.

Do not use a reducer as a server-state cache.

Do not introduce a reducer to avoid deciding where form state should be owned.

Do not create a generic state-management abstraction when the form has only a handful of straightforward transitions.

## Design Rules

A robust Form Reducer generally follows these rules:

1. Keep the reducer pure.
2. Make actions describe meaningful form events or transitions.
3. Keep side effects outside the reducer.
4. Use discriminated unions for mutually exclusive lifecycle states.
5. Preserve immutable state updates and structural sharing.
6. Avoid storing cheap, deterministic derived state.
7. Define reset semantics explicitly.
8. Treat asynchronous validation and submission as external operations whose results become actions.
9. Protect against stale asynchronous results when operations can overlap.
10. Keep action granularity appropriate to the form's domain.
11. Do not use generic `"setState"` actions that bypass the reducer's transition model.
12. Keep form state separate from server-state ownership.
13. Use Context only when state distribution requires it.
14. Use selectors or partitioning when large reducer state causes unnecessary consumption.
15. Use a reducer because transition complexity justifies it, not because forms are expected to use reducers.

## Relationship to Form State

Form State defines the information the form represents.

Form Reducer defines how that information transitions.

A form can therefore use:

```tsx
const [state, setState] = useState(initialState);
```

without using a reducer.

The reducer becomes useful when the transition model itself deserves explicit representation.

## Relationship to Reducer Pattern

The general Reducer Pattern defines state transitions through pure functions of state and actions.

Form Reducer is a domain-specific application of that pattern.

The general reducer concept belongs to the Reducer Pattern documentation.

This file focuses on the additional concerns introduced when the reduced state represents a form: field changes,
validation, touched state, reset, submission, asynchronous validation, and form-specific invariants.

## Relationship to State Colocation

State Colocation determines where form state should live.

A form reducer does not change that ownership decision.

A small local form may colocate its reducer inside the form component.

A multi-step workflow may lift the reducer-managed state to a common parent.

The reducer defines transitions after the appropriate owner has been selected.

## Relationship to State Lifting

State Lifting moves form state to a common owner when multiple components require one authoritative form state.

The reducer can move with that state.

For example, a parent can own:

```tsx
const [state, dispatch] = useReducer(
    reducer,
    initialState
);
```

while separate form sections receive the relevant state and dispatch capabilities.

Lifting determines ownership.

The reducer determines transitions.

## Relationship to Controlled Components

A reducer can provide the state backing controlled form fields.

The input remains controlled because its `value` is derived from React state.

The reducer only provides the transition mechanism used by `onChange`.

## Relationship to Uncontrolled Components

Uncontrolled fields do not require reducer-managed value state.

A reducer can still manage other application state surrounding an uncontrolled form, but the DOM remains authoritative
for the field values.

## Relationship to Custom Hooks

A custom Hook can package a reducer and its actions into a reusable form API.

The Hook owns reusable Hook behavior.

The reducer owns state transitions.

These should not be conflated.

## Relationship to Context

Context can distribute form state and dispatch to deeply nested fields.

The reducer remains responsible for state transitions.

Context remains responsible for distribution.

Context Partitioning can further divide the subscription boundaries when necessary.

## Relationship to Imperative Handle

An imperative handle can expose commands such as `reset()` or `submit()` while the reducer handles the resulting state
transitions.

The handle is the external imperative API.

The reducer is the internal transition mechanism.

## Relationship to External Store

A local reducer creates React-owned state.

An External Store moves authoritative state outside React component state and exposes a subscription model.

The two should not be conflated merely because both use reducer-like update logic.

## Relationship to Selector Pattern

A selector reads a projection of reducer state.

For example:

```tsx
const error = selectFieldError(state, "email");
```

The selector does not change state.

The reducer changes state.

These are complementary concerns.

## Relationship to Referential Stability

Immutable reducer updates naturally support structural sharing.

When only one nested branch changes, unrelated branches can retain their existing references.

This can help consumers relying on referential equality.

The Refer­ential Stability pattern owns the broader identity semantics.

## Relationship to Server State

Form reducers should generally represent transient editing and submission state.

Remote authoritative data belongs to Server State management.

The reducer may coordinate a mutation's local lifecycle, but it should not become the server-state cache or
synchronization layer.

## Relationship to Resource Cache

A Resource Cache may provide initial data used to initialize the reducer.

The reducer then owns the local editing state.

The cache continues to own resource reuse, freshness, and invalidation.

## Relationship to Data Fetching

Data Fetching can retrieve the initial values needed by a form or perform a submission request.

The reducer represents the local form state and the resulting lifecycle transitions.

Fetching logic should not be embedded directly into the reducer.

## Summary

The Form Reducer pattern models complex form transitions through explicit actions and a pure reducer.

The form state might contain:

```tsx
type FormState = {
    values: Values;
    errors: Errors;
    touched: Record<string, boolean>;
    submission: Submission;
};
```

and transitions might be expressed as:

```tsx
dispatch({
    type: "fieldChanged",
    field: "email",
    value: nextValue,
});
```

or:

```tsx
dispatch({
    type: "submitStarted",
});
```

The reducer determines the resulting state.

Side effects such as validation requests and submissions happen outside the reducer, with their outcomes represented as
actions.

The pattern is most valuable when a form has enough related transitions, lifecycle states, invariants, or nested state
that scattered `useState` updates become difficult to reason about.

It is not a requirement for forms, and it should not be used as a generic replacement for `useState`. The correct
architecture is to establish form state ownership first, model the necessary form state second, and introduce a reducer
only when the transition complexity justifies the additional structure.

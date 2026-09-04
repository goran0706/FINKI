# Form State

Form State is the state required to represent, edit, validate, submit, and reset user input within a form. It includes
the current values of fields and, depending on the form's requirements, metadata such as validation errors,
touched/visited status, dirty state, submission state, and submission results.

Form state is distinct from the general concept of component state. The pattern exists because forms commonly contain
multiple related values whose transitions are coupled by user interaction, validation, submission, and reset behavior.

A simple form can use ordinary React state:

```tsx
function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        // Submit email and password.
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit">Sign in</button>
        </form>
    );
}
```

The important architectural question is not whether form state must use a particular hook. It is how the form's values
and associated metadata are represented, owned, updated, validated, and submitted.

## Intent

The intent is to give a form an explicit state model that represents the user's current input and the lifecycle of that
input.

Form state commonly answers questions such as:

* What are the current field values?
* Which fields have been modified?
* Which fields have been visited?
* Which fields currently contain validation errors?
* Is the form currently submitting?
* Did submission succeed or fail?
* What values should be restored by reset?
* Which values are valid for submission?

The form's state model should contain only information that the form actually needs.

## Form Values

The primary form state is usually the collection of current field values.

```tsx
type LoginValues = {
    email: string;
    password: string;
};
```

A form can represent those values as one state object:

```tsx
const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
});
```

Individual fields can then update their corresponding value:

```tsx
function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValues((current) => ({
        ...current,
        email: event.target.value,
    }));
}
```

This representation makes the relationship between the fields explicit.

## Field-Level State

Small forms can keep each field in its own state variable.

```tsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

This is often sufficient when the form has only a few fields and little associated metadata.

Separate state variables become less convenient as the number of related transitions increases.

For example, a field may have:

```tsx
type FieldState = {
    value: string;
    touched: boolean;
    error: string | null;
};
```

At that point, grouping related information can make the state model clearer.

## Form-Level State

A form can represent all related state in one structure.

```tsx
type FormState = {
    values: LoginValues;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    submitting: boolean;
};
```

This makes form-wide transitions easier to reason about.

For example, submission may affect multiple pieces of metadata at once:

```tsx
setFormState((current) => ({
    ...current,
    submitting: true,
    errors: {},
}));
```

The appropriate granularity depends on the form's complexity.

There is no requirement that every form use one monolithic state object.

## Controlled Form Fields

A controlled field derives its displayed value from React state.

```tsx
<input
    value={values.email}
    onChange={(event) =>
        setValues((current) => ({
            ...current,
            email: event.target.value,
        }))
    }
/>
```

React therefore participates directly in the field's current-value representation.

Controlled fields are useful when the application needs to react to every value change, perform validation, derive UI
from values, or coordinate values between fields.

The Controlled Components pattern owns the general controlled-component mechanism. This file focuses on how that
mechanism is applied to form state.

## Uncontrolled Form Fields

A form can instead allow the DOM to maintain current field values.

```tsx
function LoginForm() {
    const formRef = useRef<HTMLFormElement>(null);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        const email = form.get("email");
        const password = form.get("password");

        // Submit values.
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <input name="email"/>
            <input name="password" type="password"/>
            <button type="submit">Sign in</button>
        </form>
    );
}
```

This can be an appropriate design when continuous React state is unnecessary.

The Uncontrolled Components pattern owns the broader uncontrolled-component mechanism. Form State owns the form-specific
representation and lifecycle concerns.

## Form State Ownership

The form's state should have one clear authoritative owner.

For a self-contained form:

```tsx
function ProfileForm() {
    const [values, setValues] = useState(initialValues);

    // ...
}
```

the form component owns its values.

If another component genuinely needs the current form values, the state can be lifted:

```tsx
function ProfilePage() {
    const [values, setValues] = useState(initialValues);

    return (
        <>
            <ProfileForm values={values} onChange={setValues}/>
            <ProfilePreview values={values}/>
        </>
    );
}
```

State ownership should follow the normal State Colocation and State Lifting rules rather than being determined solely by
the fact that the data originates from a form.

## Initial Values

Forms commonly require an explicit initial-value definition.

```tsx
const initialValues: LoginValues = {
    email: "",
    password: "",
};
```

The initial values establish the form's starting state.

They may also serve as the reset baseline:

```tsx
setValues(initialValues);
```

When initial values are objects, avoid unintentionally sharing mutable state between independent form instances.

```tsx
const initialValues = {
    email: "",
    password: "",
};
```

Using a fresh value structure for each independent instance can make ownership explicit.

## Reset State

Resetting a form is not necessarily equivalent to clearing every field.

A reset generally restores the form to its initial state.

```tsx
function reset() {
    setValues(initialValues);
    setErrors({});
    setTouched({});
}
```

The exact reset semantics should be defined by the form.

For some forms, reset means returning to the original initial values.

For others, it may mean returning to the latest successfully loaded values.

The baseline should therefore be explicit rather than implicitly tied to whatever values happen to be present during
reset.

## Dirty State

Dirty state indicates whether the current form differs from its baseline.

A simple implementation might compare the current values against the initial values:

```tsx
const dirty = values.email !== initialValues.email ||
    values.password !== initialValues.password;
```

For larger forms, the comparison strategy becomes a domain concern.

The baseline might represent:

* Initial values.
* Last persisted values.
* Last successfully submitted values.
* Values loaded from a server.

Dirty state should therefore be defined against a known baseline.

## Touched State

Touched state commonly indicates that a field has been interacted with or blurred.

```tsx
const [touched, setTouched] = useState<Record<string, boolean>>({});
```

A field can be marked touched on blur:

```tsx
onBlur = {()
=>
setTouched((current) => ({
    ...current,
    email: true,
}))
}
```

Touched state is useful for deciding when validation feedback should become visible.

It is metadata about interaction, not the field value itself.

## Visited State

Some forms distinguish between touched and visited.

Visited can mean that a field has received focus or otherwise entered the user's interaction path.

Touched often means that the user has completed or left an interaction with the field.

The exact distinction is application-defined.

Do not introduce separate metadata concepts unless their different semantics are actually useful.

## Validation Errors

Validation state represents whether current values satisfy the form's rules.

```tsx
type Errors = {
    email?: string;
    password?: string;
};
```

A validation function can derive errors from values:

```tsx
function validate(values: LoginValues): Errors {
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

Validation should normally be treated as a pure computation over the relevant form state.

```tsx
const errors = validate(values);
```

Whether validation results should themselves be stored depends on when and how validation is performed.

## Derived Validation State

Not every piece of form information needs to be stored.

For example:

```tsx
const errors = validate(values);
const isValid = Object.keys(errors).length === 0;
```

Here `errors` and `isValid` are derived from `values`.

Storing all of these independently can create synchronization problems.

Avoid redundant state such as:

```tsx
const [values, setValues] = useState(initialValues);
const [isValid, setIsValid] = useState(true);
```

when `isValid` can reliably be computed from `values`.

The Derived State principle applies to forms just as it does elsewhere.

## Validation Timing

Validation can occur at different points in the form lifecycle.

Common strategies include:

* On every value change.
* On blur.
* On submit.
* On explicit user action.
* Asynchronous validation triggered by selected changes.

The choice should reflect the validation requirement.

Immediate validation is useful for constraints that benefit from instant feedback.

Blur validation can reduce noise while the user is actively typing.

Submit validation is appropriate when validation is primarily a submission gate.

Different fields can also use different validation strategies.

## Synchronous Validation

Synchronous validation can be represented as a pure function:

```tsx
function validateEmail(email: string): string | null {
    if (!email) {
        return "Email is required.";
    }

    if (!email.includes("@")) {
        return "Enter a valid email address.";
    }

    return null;
}
```

The result can be calculated without asynchronous coordination.

This makes synchronous validation straightforward to test.

## Asynchronous Validation

Some validation requires an external system.

For example, checking whether a username is already registered may require a request.

```tsx
async function validateUsername(username: string): Promise<string | null> {
    const available = await checkUsernameAvailability(username);

    return available ? null : "Username is already taken.";
}
```

Asynchronous validation introduces concerns that ordinary synchronous validation does not have, including:

* Cancellation.
* Stale responses.
* Race conditions.
* Loading state.
* Failure handling.
* Debouncing.
* Request ownership.

These concerns belong to the asynchronous operation itself rather than to the basic representation of form values.

A stale validation response must not overwrite a newer validation result.

## Submission State

Submission commonly introduces its own state.

```tsx
type SubmissionState =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success" }
    | { status: "error"; message: string };
```

This makes mutually exclusive submission states explicit.

The form can derive UI from this state:

```tsx
const submitting = submission.status === "submitting";
```

A discriminated union can be preferable to several independent booleans because it prevents contradictory combinations
such as:

```tsx
{
    submitting: true,
        submitted
:
    true,
        error
:
    true
}
```

when those states should be mutually exclusive.

## Submission Lifecycle

A typical submission lifecycle consists of:

1. Preventing the browser's default submission behavior when handling submission in React.
2. Reading or using the current form values.
3. Validating the values.
4. Entering the submitting state.
5. Executing the submission operation.
6. Handling success or failure.
7. Updating submission metadata.
8. Resetting or preserving values according to the form's requirements.

A simple implementation is:

```tsx
async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    setSubmitting(true);

    try {
        await submit(values);
        setSubmissionStatus("success");
    } catch {
        setSubmissionStatus("error");
    } finally {
        setSubmitting(false);
    }
}
```

The exact submission mechanism depends on whether the form uses a native browser submission, an application request, an
action-based API, or another integration.

## Preventing Duplicate Submission

Submission state commonly needs to prevent repeated submissions while an operation is already in progress.

```tsx
<button type="submit" disabled={submitting}>
    {submitting ? "Saving..." : "Save"}
</button>
```

The UI restriction should correspond to the actual submission lifecycle.

Client-side disabling is not a substitute for server-side idempotency where duplicate requests have meaningful
consequences.

## Submission Errors vs Field Errors

A form can have different categories of errors.

Field-level errors identify invalid input:

```tsx
{
    email: "Invalid email address."
}
```

Form-level or submission errors describe failures that are not naturally associated with one field:

```tsx
{
    form: "Unable to save your changes."
}
```

These should not automatically be collapsed into one generic error representation.

A useful model distinguishes validation failures from operational submission failures.

## Server Validation

A form can pass local validation and still fail server-side validation.

For example, a value may satisfy local syntax rules but violate a server-side uniqueness constraint.

The submission lifecycle should therefore allow the server to return field-level or form-level validation errors.

```tsx
try {
    await submit(values);
} catch (error) {
    // Map server validation errors into form state.
}
```

Server validation remains authoritative for constraints enforced by the server.

Client validation improves feedback but does not establish server truth.

## Form Submission and Server State

Submitted form values can produce or mutate Server State.

The form itself represents transient user-editing state.

Server State represents remote authoritative data.

These should not automatically be treated as the same state.

For example:

```text
form values
```

represent what the user is currently editing, while:

```text
saved profile
```

represents data currently accepted by the server.

The form may temporarily differ from the server representation.

After a successful mutation, the application's server-state representation may need to be reconciled with the submitted
result.

## Form State and Data Fetching

Forms often require initial data loaded asynchronously.

For example:

```tsx
const {data} = useProfile();
```

The fetched profile can establish the form's initial values:

```tsx
const initialValues = {
    name: data.name,
    email: data.email,
};
```

The distinction remains important.

Data Fetching obtains the data.

Form State represents the user's editable copy.

Once the user begins editing, the form should not automatically overwrite their changes every time remote data changes
unless that behavior is explicitly intended.

## Resource Cache and Form State

A Resource Cache may provide the data from which a form is initialized.

The cache does not become the form's editable state merely because it provided the initial values.

A common architecture is:

```text
cached server data
```

used to initialize:

```text
local form state
```

The two representations then have different ownership and lifecycle semantics.

The cache remains concerned with reusable remote resources; the form remains concerned with transient user edits.

## Form State and Server State Synchronization

Editing server-backed data creates two representations:

* The currently persisted server representation.
* The user's current draft.

These representations can diverge intentionally.

For example:

```tsx
const [values, setValues] = useState(initialProfile);
```

If the user changes `name`, the form should not necessarily be overwritten when unrelated server data updates.

This is why form state should generally be treated as a deliberate local projection of server data rather than as
another cache of the server.

## Draft State

Some applications need to preserve incomplete user input across navigation or sessions.

A draft is still form state from the user's perspective, but persistence changes its lifecycle.

Possible persistence mechanisms include:

* Local storage.
* IndexedDB.
* URL parameters.
* Application state.
* Server-side drafts.

Persistence introduces another state owner and therefore requires explicit synchronization semantics.

A form should not silently treat persisted drafts as authoritative unless that is the intended domain model.

## Multi-Field Dependencies

Form fields frequently depend on one another.

For example, a confirmation field may depend on a password:

```tsx
function validate(values: Values) {
    const errors: Errors = {};

    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
}
```

The validation function consumes the complete relevant state rather than treating every field as an independent unit.

Other examples include:

* Start and end dates.
* Country and region.
* Minimum and maximum values.
* Conditional required fields.
* Mutually exclusive options.

These relationships are part of the form's domain model.

## Conditional Fields

A form can render fields conditionally based on current values.

```tsx
{
    values.accountType === "business" && (
        <input
            name="companyName"
            value={values.companyName}
            onChange={handleChange}
        />
    )
}
```

The state model must define what happens when a field becomes inactive.

Possible policies include:

* Preserve its value.
* Clear its value.
* Exclude it from submission.
* Keep it in state but ignore it during validation.

The correct choice depends on the domain.

Conditional rendering alone does not define the lifecycle of the field's data.

## Field Arrays

Forms may contain variable-length collections.

```tsx
type Values = {
    contacts: Array<{
        name: string;
        email: string;
    }>;
};
```

Operations then include:

* Add.
* Remove.
* Reorder.
* Update.
* Replace.

The collection should have stable identity where individual entries represent domain entities or independently editable
records.

This is particularly important when rendering lists of fields.

## Form Keys and Field Identity

When rendering dynamic form fields, React keys determine component identity.

```tsx
{
    values.contacts.map((contact) => (
        <ContactField
            key={contact.id}
            contact={contact}
        />
    ))
}
```

Stable keys help preserve the correct field component state when items are inserted, removed, or reordered.

The Stable Keys and Component Identity patterns own the general reconciliation semantics. Form State only needs to
account for them when representing dynamic fields.

## Partial Updates

A field update should preserve unrelated fields.

```tsx
setValues((current) => ({
    ...current,
    email: nextEmail,
}));
```

Replacing the entire object with an incomplete value can accidentally discard other fields.

A form state API should therefore make partial field updates explicit.

## Nested Values

Forms can represent nested domain structures.

```tsx
type Values = {
    profile: {
        name: string;
        email: string;
    };
    preferences: {
        notifications: boolean;
    };
};
```

Nested updates should preserve unaffected branches.

```tsx
setValues((current) => ({
    ...current,
    profile: {
        ...current.profile,
        name: nextName,
    },
}));
```

Structural sharing also helps preserve referential stability for unchanged portions of the state.

## Immutable Updates

Form state should generally be updated immutably when represented with React state.

```tsx
setValues((current) => ({
    ...current,
    email: nextEmail,
}));
```

Do not mutate the existing state object:

```tsx
values.email = nextEmail;
setValues(values);
```

The latter can produce incorrect change detection and makes state transitions harder to reason about.

## Event Handling

Form input events commonly provide the next value through the event target.

```tsx
function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
) {
    const {name, value} = event.target;

    setValues((current) => ({
        ...current,
        [name]: value,
    }));
}
```

This generic handler is useful when field names correspond directly to keys in the form state.

For complex forms, explicit field handlers can be clearer when different fields have different transformation or
validation requirements.

## Value Normalization

Input values often require normalization.

For example:

```tsx
const email = event.target.value.trim().toLowerCase();
```

Normalization can occur during input handling or before submission.

The choice depends on whether the normalized representation should be visible immediately to the user.

For example, automatically lowercasing a visible email field may be appropriate in some applications but undesirable in
others.

Form state should distinguish between user-visible values and canonical submission values when those representations
differ.

## Form Serialization

A form's internal state does not necessarily have the same shape as the submission payload.

For example:

```tsx
type FormValues = {
    firstName: string;
    lastName: string;
};
```

may become:

```tsx
const payload = {
    name: `${values.firstName} ${values.lastName}`,
};
```

The transformation should occur at an explicit boundary.

Do not force the form's internal state representation to match an API payload when doing so makes editing less natural.

## Native Form Semantics

React forms still participate in HTML form semantics.

A semantic form should generally use:

```tsx
<form onSubmit={handleSubmit}>
    ...
    <button type="submit">Submit</button>
</form>
```

rather than implementing submission entirely through arbitrary click handlers.

Native semantics provide useful behavior such as keyboard submission and integration with browser accessibility
mechanisms.

## Browser Validation

HTML provides native validation attributes:

```tsx
<input
    type="email"
    required
/>
```

Applications can combine native validation with application-level validation.

The two systems have different responsibilities.

Native constraints can provide basic browser-level validation.

Application validation handles domain-specific rules.

Do not assume that browser validation alone is sufficient for server-enforced business constraints.

## Accessibility

Form state and validation must be reflected in accessible UI.

For example, an invalid field can expose its error:

```tsx
<input
    aria-invalid={Boolean(errors.email)}
    aria-describedby={errors.email ? "email-error" : undefined}
/>

{
    errors.email && (
        <p id="email-error">{errors.email}</p>
    )
}
```

The state model should therefore support the information required to communicate validation state to assistive
technologies.

Accessibility is part of the form behavior, not merely a visual concern.

## Form State and Context

A complex form may use Context to distribute form state and operations to deeply nested fields.

For example, a form provider can expose:

```tsx
type FormContextValue = {
    values: Values;
    errors: Errors;
    updateField(name: string, value: unknown): void;
};
```

This can avoid passing form state through many intermediate components.

Context distributes the form state; it does not itself define the form state model.

The Context Provider and Context Partitioning patterns own the broader context mechanics.

## Form State and Custom Hooks

A custom Hook can encapsulate form behavior:

```tsx
function useForm<T>(initialValues: T) {
    const [values, setValues] = useState(initialValues);

    function updateField<K extends keyof T>(
        key: K,
        value: T[K]
    ) {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    }

    return {
        values,
        updateField,
    };
}
```

The Hook provides reusable behavior, while Form State describes the underlying state model.

Custom Hooks do not automatically share state between consumers. Each Hook invocation owns its own state unless the Hook
connects to a shared external source.

## Form State and Reducers

Simple forms can use `useState`.

More complex forms can use a reducer when many related transitions exist.

```tsx
type Action =
    | {
    type: "fieldChanged";
    field: keyof Values;
    value: string;
}
    | {
    type: "submitted";
}
    | {
    type: "reset";
};
```

The reducer can centralize state transitions:

```tsx
function reducer(state: FormState, action: Action): FormState {
    switch (action.type) {
        case "fieldChanged":
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.field]: action.value,
                },
            };

        case "submitted":
            return {
                ...state,
                submitting: true,
            };

        case "reset":
            return initialState;
    }
}
```

The Reducer Pattern owns transition structure. Form State owns the domain model being transitioned.

## Form State and Imperative Handles

A form component may expose imperative commands when a parent needs to trigger an operation that is naturally
imperative.

```tsx
interface FormHandle {
    reset(): void;

    focusFirstInvalidField(): void;
}
```

This does not make the handle the form's state owner.

The form still owns its state, while the handle provides a narrow command interface.

The Imperative Handle pattern owns the public imperative API.

## Form State and External Stores

Most forms do not need an External Store.

Form edits are typically local, transient state and therefore fit naturally inside the component subtree that owns the
form.

An external store may be appropriate when draft state must intentionally be shared across independently mounted parts of
the application or persist beyond the lifetime of a particular form component.

The external store should then have explicit ownership and synchronization semantics.

## Form State and Selectors

Selectors become useful when a large form state object is consumed by many independent components.

A field component may need only:

```tsx
state.values.email
```

rather than the entire form state.

Selective consumption can reduce unnecessary updates when the underlying state architecture supports it.

The Selector Pattern owns projection and selective consumption. Form State owns the semantics of the form data being
selected.

## Form State and Memoization

Memoization can reduce unnecessary calculations or renders in complex forms, but it does not define form-state
architecture.

Do not introduce memoization merely because a form contains multiple fields.

First establish:

* Correct state ownership.
* Correct field identity.
* Appropriate state granularity.
* Correct derived-state boundaries.

Only then optimize measured bottlenecks.

## Submission and Cancellation

Asynchronous form submission can outlive the interaction that initiated it.

For example, a user may navigate away while a request is still pending.

Submission logic may therefore need cancellation support:

```tsx
const controller = new AbortController();

await submit(values, {
    signal: controller.signal,
});
```

The exact cancellation mechanism depends on the submission API.

The important boundary is that cancellation belongs to the asynchronous operation and its ownership lifecycle, while
form state represents the resulting submission status.

## Race Conditions

Forms can encounter race conditions when asynchronous operations are triggered repeatedly.

For example, asynchronous validation can produce:

```text
validation for "abc"
validation for "abcd"
```

If the `"abc"` response arrives after `"abcd"`, applying it blindly can overwrite the newer result.

The operation must therefore establish which result is current before updating form state.

This is particularly important for asynchronous validation and autosave.

## Autosave

Autosave turns changes in form state into asynchronous persistence operations.

A naive implementation can create excessive requests:

```tsx
useEffect(() => {
    save(values);
}, [values]);
```

Autosave normally requires additional policy such as:

* Debouncing.
* Cancellation.
* Request ordering.
* Retry behavior.
* Failure reporting.
* Dirty-state management.
* Conflict handling.

The form remains the owner of the draft state, while the persistence mechanism owns the remote operation.

## Optimistic Form Updates

A form can optimistically treat a submission as successful before the server confirms it, but this should be
distinguished from ordinary local editing.

For most forms, the user already sees their local draft immediately. The important optimistic behavior concerns the
transition from draft to persisted state.

Server State and mutation semantics govern the remote representation.

Form State governs the local editing experience.

## Persistence Boundaries

A form may need to survive component unmounting.

For example, a multi-step form may preserve values while navigating between steps.

In such a design, the form state may be lifted to a common owner:

```tsx
function Checkout() {
    const [values, setValues] = useState(initialValues);

    return (
        <>
            <ShippingStep values={values} onChange={setValues}/>
            <PaymentStep values={values} onChange={setValues}/>
        </>
    );
}
```

The form's state ownership should correspond to the lifecycle required by the workflow.

## Multi-Step Forms

A multi-step form is still one logical form when its steps contribute to one submission.

```tsx
type CheckoutValues = {
    shipping: ShippingValues;
    payment: PaymentValues;
    confirmation: ConfirmationValues;
};
```

The state can be owned above the individual step components.

Each step consumes and updates its relevant portion.

This avoids making each step independently authoritative over data that ultimately belongs to the whole workflow.

## Form State Machine

Some forms have a lifecycle complex enough to benefit from explicit state-machine thinking.

For example, submission might have states such as:

```tsx
type Status =
    | "editing"
    | "validating"
    | "submitting"
    | "success"
    | "failure";
```

Transitions between these states should be explicit.

This can be implemented with a reducer or another state-machine approach.

The form state model should represent only states that have distinct behavioral consequences.

## Common Misuse

A common misuse is storing every derived property:

```tsx
const [values, setValues] = useState(initialValues);
const [isValid, setIsValid] = useState(false);
const [isEmpty, setIsEmpty] = useState(true);
const [errorCount, setErrorCount] = useState(0);
```

If these values can be derived reliably from `values` and validation results, storing them independently creates
unnecessary synchronization.

Another misuse is putting the form into a global store without a requirement for global ownership.

Most form drafts are local and transient.

Another misuse is treating server data and form values as one state object. The user may intentionally have unsaved
edits that differ from the server.

Another misuse is allowing asynchronous validation or autosave responses to overwrite newer input without checking
request freshness.

Another misuse is using imperative APIs to control ordinary form state that should instead be represented through props
and events.

## Advantages

A deliberate form-state model provides:

* Explicit ownership of user input.
* Predictable field updates.
* Clear validation boundaries.
* Explicit submission lifecycle.
* Support for dirty, touched, and visited metadata.
* Controlled reset semantics.
* Clear separation between draft state and server state.
* Better testability of validation and transitions.
* A foundation for reusable form behavior.

## Disadvantages

Form state can become unnecessarily complex.

Potential costs include:

* Large state structures.
* Excessive metadata.
* Redundant derived state.
* Complex validation lifecycles.
* Asynchronous race conditions.
* Difficult synchronization with server state.
* Excessive global state.
* Performance problems in very large controlled forms.
* Overengineering simple forms.

The appropriate form-state architecture should therefore scale with actual form complexity.

## When to Use

Use explicit form state when the application needs to:

* React to field changes.
* Validate values.
* Display validation errors.
* Track touched or dirty fields.
* Coordinate dependent fields.
* Manage multi-step workflows.
* Control submission state.
* Preserve drafts.
* Transform values before submission.
* Integrate form state with other application behavior.

For a simple native form where React does not need continuous access to values, uncontrolled fields and `FormData` may
be sufficient.

## When Not to Use

Do not create elaborate form-state infrastructure for a form that only needs native browser submission.

Do not store values globally merely because multiple fields exist.

Do not duplicate server state and form state without a clear reason.

Do not store derived validation metadata when it can be calculated cheaply and reliably.

Do not introduce reducers, Context, external stores, or custom form abstractions until the form's complexity actually
justifies them.

## Testing

Form state should be tested through observable behavior.

Important cases include:

* Initial values.
* Field updates.
* Validation.
* Touched behavior.
* Dirty-state calculation.
* Reset.
* Conditional fields.
* Submission success.
* Submission failure.
* Server validation errors.
* Duplicate submission prevention.
* Asynchronous validation races.
* Cancellation where applicable.

Pure validation functions can be tested independently:

```tsx
expect(
    validate({
        email: "",
        password: "",
    })
).toEqual({
    email: "Email is required.",
    password: "Password is required.",
});
```

Interaction tests should verify that user actions produce the expected form behavior rather than testing implementation
details of state variables.

## Design Rules

A robust form-state design generally follows these rules:

1. Give the form state one clear authoritative owner.
2. Keep transient editing state separate from authoritative server state.
3. Store user-controlled values; derive inexpensive information when possible.
4. Define the baseline used for dirty and reset semantics.
5. Keep field-level and form-level errors conceptually distinct.
6. Make submission states explicit when their transitions matter.
7. Treat asynchronous validation as an asynchronous operation with race and cancellation concerns.
8. Preserve newer user input when older asynchronous operations complete.
9. Keep dynamic field identity stable.
10. Use controlled fields when continuous React ownership is required.
11. Use uncontrolled fields when continuous React state is unnecessary.
12. Use Context, reducers, external stores, or custom Hooks only when their respective concerns justify them.
13. Keep imperative handles limited to genuinely imperative commands.
14. Do not use form state as a substitute for server-state management.
15. Keep the form's internal representation independent from API payloads when the two have different purposes.

## Summary

Form State represents the transient state of user interaction with a form: values, validation, interaction metadata,
submission lifecycle, and related workflow state.

Its central architectural distinction is between the user's editable draft and other state sources.

A server response can initialize a form without becoming its ongoing owner. A cache can provide initial data without
becoming the form's state. Context can distribute form state without owning its semantics. A reducer can structure form
transitions without defining the ownership model. An imperative handle can expose commands without becoming the state
itself.

For simple forms, ordinary `useState` or uncontrolled HTML form semantics may be enough. As requirements grow, the state
model can expand to include validation, touched and dirty metadata, asynchronous operations, multi-step workflows,
persistence, and submission lifecycle.

The key is to model only the state and transitions that have meaningful behavioral consequences while keeping form
ownership, server ownership, derived state, and imperative commands as separate concerns.

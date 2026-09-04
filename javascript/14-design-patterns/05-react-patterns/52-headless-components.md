# Headless Components

A headless component separates reusable UI behavior, state management, interaction logic, and accessibility behavior
from the visual presentation of that UI. The component provides the mechanics required to implement an interaction
without imposing a particular visual design, DOM structure, CSS system, or styling convention.

A headless component is therefore concerned primarily with **what the UI does**, while the consuming application decides
**how the UI looks and how its structure is rendered**.

The pattern is particularly useful for reusable interaction primitives such as comboboxes, listboxes, menus, dialogs,
popovers, tabs, accordions, disclosure controls, date pickers, sortable lists, and other components whose behavior is
complex but whose visual presentation varies substantially between consumers.

## Intent

Use a headless component when the interaction model, state transitions, accessibility requirements, or event handling
should be reused independently of the visual implementation.

The component should encapsulate behavior that is difficult or undesirable to duplicate while exposing enough
information for the consumer to construct its own presentation.

The fundamental separation is:

* **Headless component:** owns reusable interaction behavior.
* **Consumer:** owns markup, styling, visual hierarchy, and presentation decisions.

This allows the same interaction primitive to support different design systems, themes, layouts, CSS architectures, and
product surfaces without creating separate behavioral implementations.

## Basic Pattern

A headless component can expose state and behavior through a custom Hook.

```tsx
function useDisclosure() {
    const [open, setOpen] = useState(false);

    const toggle = useCallback(() => {
        setOpen(value => !value);
    }, []);

    return {
        open,
        open: () => setOpen(true),
        close: () => setOpen(false),
        toggle
    };
}
```

The consumer determines the rendered structure:

```tsx
function SettingsSection() {
    const disclosure = useDisclosure();

    return (
        <section>
            <button onClick={disclosure.toggle}>
                Settings
            </button>

            {disclosure.open && (
                <div>
                    Settings content
                </div>
            )}
        </section>
    );
}
```

The reusable abstraction contains the interaction semantics while the consumer controls the resulting UI.

A more sophisticated headless component may return state, event handlers, generated IDs, accessibility attributes, refs,
and derived interaction properties.

```tsx
const menu = useMenu({
    items
});

return (
    <div>
        <button {...menu.triggerProps}>
            Actions
        </button>

        {menu.open && (
            <ul {...menu.menuProps}>
                {menu.items.map(item => (
                    <li key={item.id} {...item.props}>
                        {item.label}
                    </li>
                ))}
            </ul>
        )}
    </div>
);
```

The returned properties form a behavioral contract rather than a visual contract.

## Behavioral Ownership

The most important design decision is determining what the headless component actually owns.

A headless component commonly owns:

* interaction state
* state transitions
* event handling
* keyboard behavior
* focus management
* selection behavior
* open/close behavior
* active-item tracking
* accessibility attributes
* generated IDs and relationships
* interaction-related refs
* derived behavioral state
* coordination between related elements
* interaction-specific validation

It normally does not own:

* colors
* typography
* spacing
* visual hierarchy
* borders
* shadows
* animations that are purely visual
* application-specific layout
* product-specific content
* design-system-specific CSS

The boundary should be defined by behavioral reuse rather than by an arbitrary amount of logic.

## Headless Does Not Mean Stateless

A headless component may own substantial state.

For example, a headless combobox can manage:

```tsx
const [open, setOpen] = useState(false);
const [query, setQuery] = useState("");
const [activeIndex, setActiveIndex] = useState(-1);
const [selected, setSelected] = useState<Option | null>(null);
```

The fact that the component has no visual implementation does not make it stateless.

The state belongs to the interaction model rather than the presentation.

A headless component can therefore be stateful, partially controlled, or completely controlled.

## Controlled Headless Components

A headless component can allow consumers to own its authoritative state.

```tsx
function useDisclosure({
                           open,
                           defaultOpen = false,
                           onOpenChange
                       }: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : internalOpen;

    const setOpen = (next: boolean) => {
        if (!isControlled) {
            setInternalOpen(next);
        }

        onOpenChange?.(next);
    };

    return {
        open: currentOpen,
        openMenu: () => setOpen(true),
        closeMenu: () => setOpen(false)
    };
}
```

This permits the same behavioral abstraction to work in both controlled and uncontrolled environments.

The distinction is about state ownership, not headless design itself.

## Renderless Components

A renderless component provides behavior without rendering its own meaningful UI.

A custom Hook is the simplest form:

```tsx
function useToggle(initial = false) {
    const [value, setValue] = useState(initial);

    return {
        value,
        toggle: () => setValue(value => !value)
    };
}
```

A component can also expose behavior through a render prop:

```tsx
function Toggle({
                    children
                }: {
    children: (state: {
        value: boolean;
        toggle(): void;
    }) => React.ReactNode;
}) {
    const [value, setValue] = useState(false);

    return children({
        value,
        toggle: () => setValue(current => !current)
    });
}
```

The component itself renders no domain-specific UI.

Hooks are generally the more direct mechanism when the consumer should control the entire rendering structure.

## Headless Components and Custom Hooks

A custom Hook and a headless component are closely related but are not identical concepts.

A custom Hook is a mechanism for reusing React behavior.

A headless component is a reusable UI abstraction whose visual representation is intentionally left to the consumer.

A headless component may therefore be implemented with:

* a custom Hook
* a render-prop component
* compound components
* Context
* a combination of these mechanisms

The distinction is conceptual rather than syntactic.

```tsx
function useTabs({
                     value,
                     defaultValue,
                     onChange
                 }: TabsOptions) {
    // interaction and state management
}
```

The Hook can be the implementation mechanism for the headless abstraction.

## Accessibility as Behavioral Ownership

Accessibility is one of the strongest reasons to create headless components.

Complex interactive widgets frequently require more than visual markup. They may need:

* correct ARIA roles
* accessible names
* relationships between controls and content
* keyboard navigation
* focus movement
* focus restoration
* active descendant management
* disabled-state semantics
* selection semantics
* generated IDs
* appropriate event handling

A headless component can centralize these requirements while leaving the visual implementation to the consumer.

For example:

```tsx
const triggerProps = {
    id: triggerId,
    "aria-controls": panelId,
    "aria-expanded": open,
    onClick: toggle
};

const panelProps = {
    id: panelId,
    "aria-labelledby": triggerId
};
```

The consumer can apply these properties to whatever visual elements represent the interaction.

Accessibility should not be treated as a visual concern merely because the component is headless.

## Keyboard Interaction

Keyboard behavior is often part of the reusable behavioral contract.

A headless menu may need to support:

* ArrowUp
* ArrowDown
* Home
* End
* Enter
* Space
* Escape

The headless abstraction can manage the state transitions while the consumer determines the appearance of the menu.

```tsx
function handleKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
        case "ArrowDown":
            moveNext();
            break;

        case "ArrowUp":
            movePrevious();
            break;

        case "Home":
            moveFirst();
            break;

        case "End":
            moveLast();
            break;

        case "Escape":
            close();
            break;
    }
}
```

The exact interaction contract should depend on the widget being implemented rather than on a generic headless
abstraction.

## Focus Management

Complex headless components frequently need to manage focus independently of presentation.

Examples include:

* focusing the first item when a menu opens
* restoring focus to the trigger when a dialog closes
* moving focus into a newly opened popover
* maintaining focus while navigating a list
* preventing focus from escaping a modal interaction
* coordinating focus between composite widgets

Refs are often required for this behavior.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
    if (open) {
        inputRef.current?.focus();
    }
}, [open]);
```

The headless abstraction can expose the ref or consume it internally depending on the required rendering flexibility.

## State Machines

Complex headless interactions can benefit from explicitly modeling states and transitions.

For example, a dialog might have states such as:

* closed
* opening
* open
* closing

A combobox might track:

* input value
* selected value
* open state
* active option
* filtered options
* interaction mode

The implementation does not necessarily require a formal state-machine library. The important property is that
interaction transitions are explicit and predictable.

```tsx
type Action =
    | { type: "open" }
    | { type: "close" }
    | { type: "move-next" }
    | { type: "move-previous" }
    | { type: "select"; id: string };
```

This is particularly useful when multiple events can produce the same state transitions.

## Compound Headless Components

A headless interaction can be exposed through compound components.

```tsx
<Tabs>
    <Tabs.List>
        <Tabs.Trigger value="profile">
            Profile
        </Tabs.Trigger>

        <Tabs.Trigger value="security">
            Security
        </Tabs.Trigger>
    </Tabs.List>

    <Tabs.Panel value="profile">
        Profile settings
    </Tabs.Panel>

    <Tabs.Panel value="security">
        Security settings
    </Tabs.Panel>
</Tabs>
```

The compound components can share behavioral state through Context while the consumer controls the actual markup and
styling.

This combines the headless component pattern with the compound components pattern.

The compound structure should still expose a meaningful behavioral API rather than simply hiding arbitrary component
internals.

## Render Props

Render props can expose behavioral state directly to the rendering function.

```tsx
<Combobox>
    {({
          open,
          query,
          activeOption,
          getInputProps,
          getOptionProps
      }) => (
        <div>
            <input {...getInputProps()} />

            {open && (
                <ul>
                    {options.map(option => (
                        <li key={option.id} {...getOptionProps(option)}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )}
</Combobox>
```

Render props provide maximum rendering flexibility but can produce more deeply nested component APIs.

A custom Hook is often preferable when direct access to the behavioral API is sufficient.

## Props Getters

Headless libraries sometimes expose functions that produce the props required for a particular interactive element.

```tsx
const inputProps = getInputProps();

return <input {...inputProps} />;
```

A props getter can centralize:

* event handlers
* ARIA attributes
* IDs
* roles
* refs
* data attributes
* interaction state

This allows consumers to render their own elements while preserving the behavior contract.

Props getters must be designed carefully because blindly merging arbitrary props can create conflicts.

For example:

```tsx
<input
    {...getInputProps()}
    className={className}
/>
```

The API should define how consumer-provided handlers, refs, and attributes interact with internally generated values.

## Event Handler Composition

Headless components frequently need to combine internal and consumer event handlers.

A naïve implementation can accidentally replace internal behavior:

```tsx
<button
    onClick={consumerOnClick}
>
    Open
</button>
```

If the headless abstraction requires its own click behavior, the two handlers must be composed.

```tsx
function composeHandlers<E>(
    internalHandler: ((event: E) => void) | undefined,
    externalHandler: ((event: E) => void) | undefined
) {
    return (event: E) => {
        internalHandler?.(event);
        externalHandler?.(event);
    };
}
```

Real implementations must additionally define ordering and cancellation semantics, especially when
`event.preventDefault()` affects whether the external behavior should execute.

The component should document these semantics rather than leaving them accidental.

## Refs

Refs are particularly important for headless components because interaction logic frequently needs access to DOM nodes.

A headless API may expose:

```tsx
const {
    triggerRef,
    contentRef
} = usePopover();
```

or provide ref-aware props:

```tsx
<button {...getTriggerProps()}>
    Open
</button>
```

When multiple layers need to attach refs to the same element, ref composition may be necessary.

The headless abstraction should avoid unnecessarily requiring consumers to understand its internal DOM assumptions.

## Styling

Headless components should generally avoid prescribing styling.

The consumer can use:

```tsx
<button className="primary-button">
    Open
</button>
```

or:

```tsx
<button className={styles.trigger}>
    Open
</button>
```

or a design-system abstraction:

```tsx
<Button>
    Open
</Button>
```

A headless component can expose state through data attributes when useful:

```tsx
<button
    data-open={open}
    data-disabled={disabled}
>
    Menu
</button>
```

This allows CSS to react to behavioral state without coupling the headless implementation to a particular styling
technology.

## Visual State

Although headless components should not own visual styling, they may expose behavioral state that consumers can
translate into visual state.

```tsx
const {
    open,
    activeIndex,
    disabled
} = useMenu();
```

The consumer can then decide:

```tsx
<li
    data-active={index === activeIndex}
    data-disabled={item.disabled}
>
    {item.label}
</li>
```

The distinction is important:

**The headless component exposes state; the consumer determines its visual representation.**

## Polymorphic Rendering

Some headless abstractions allow consumers to select the element used for a behavioral role.

```tsx
<Menu.Trigger asChild>
    <Button>
        Actions
    </Button>
</Menu.Trigger>
```

This can integrate behavioral primitives with an existing design system.

However, polymorphic APIs introduce complexity around:

* refs
* event handlers
* accessibility
* valid HTML
* prop forwarding
* element semantics

Changing the underlying element should not invalidate the accessibility or interaction contract.

## Semantic HTML

Headless does not mean “render arbitrary elements.”

A consumer can control markup while still being responsible for semantic correctness.

For example, a button interaction should generally be represented by a `<button>` rather than a `<div>` with an
`onClick`.

A headless abstraction should make semantically correct usage straightforward and should not encourage consumers to
replace native semantics unnecessarily.

## Portals and Overlays

Dialogs, popovers, menus, and tooltips often require rendering outside their logical parent DOM subtree.

A headless abstraction may provide the interaction logic while allowing the consumer to decide whether to use a portal.

```tsx
{
    open && (
        <Portal>
            <div {...dialogProps}>
                Dialog content
            </div>
        </Portal>
    )
}
```

The headless component should own the interaction semantics that require coordination, while the consumer can determine
the rendering mechanism.

Portal behavior should not be hidden when it materially affects layout, stacking, focus, or event behavior.

## Headless Components and Context

Context is useful when a headless component consists of several cooperating elements.

```tsx
const MenuContext = createContext<MenuContextValue | null>(null);
```

The provider can expose:

* open state
* active item
* selection state
* interaction methods
* registration functions
* IDs

Descendants consume that state without requiring every value to be threaded through props.

Context is an implementation mechanism here. The headless pattern itself is the separation of behavior from
presentation.

## Dynamic Item Registration

Complex headless widgets may need descendants to register themselves.

Examples include:

* menu items
* tabs
* listbox options
* accordion panels
* sortable items

Registration can allow the parent interaction model to track:

* DOM nodes
* item IDs
* disabled state
* ordering
* labels
* active state

A registration mechanism should account for mounting, unmounting, reordering, and Strict Mode development behavior.

## Stable Identity

Headless components frequently generate IDs or maintain references between related elements.

For example:

```tsx
const triggerId = useId();
const panelId = useId();
```

The identity relationship must remain stable across renders.

Stable identities are particularly important for:

* `aria-controls`
* `aria-labelledby`
* `aria-describedby`
* active descendant relationships
* item registration
* controlled state association

Identity management should not depend on array indexes when the underlying collection can reorder.

## Data Fetching

A headless component may consume externally fetched data, but data acquisition is usually not its fundamental
responsibility.

For example, a headless combobox can receive:

```tsx
const {
    options,
    loading,
    error
} = useSearchOptions(query);
```

The interaction component can manage selection and keyboard behavior while another abstraction manages remote data.

This separation prevents the headless UI primitive from becoming coupled to a particular API, cache, or server-state
implementation.

## Server State

Headless components can render server-derived data, but they should not automatically become server-state managers.

A headless select component can receive options from:

* local state
* an external store
* a resource cache
* a server-state library
* a static array

The interaction abstraction should remain independent from the source of those options unless remote data management is
explicitly part of its contract.

## Forms

Headless components are particularly useful for form controls.

A headless field can provide:

* value
* validation state
* focus behavior
* error relationships
* input properties
* label relationships

The consumer can then render the field according to the application's design system.

However, a generic headless input should not automatically own application-specific form state unless that
responsibility is explicitly part of the abstraction.

## Integration with Controlled Components

Headless behavior can be embedded inside controlled components.

For example:

```tsx
function Select({
                    value,
                    onChange
                }: SelectProps) {
    const select = useHeadlessSelect({
        value,
        onChange
    });

    return (
        <div>
            {/* presentation */}
        </div>
    );
}
```

The outer component can provide the visual API while the headless implementation provides the reusable interaction
behavior.

This is a common architecture for design-system components.

## Headless Components and Design Systems

Headless components are particularly useful when a product has multiple visual systems that share interaction semantics.

For example, the same accessible menu behavior could support:

* a desktop application
* a mobile-oriented interface
* an administrative interface
* an embedded widget
* a branded product surface

The behavioral implementation can remain centralized while each consumer supplies its own visual component.

This reduces duplication of interaction logic without forcing every product surface into one visual component.

## Headless Components and Container-Presentational Components

Headless components and container-presentational components solve related but different problems.

Container-presentational decomposition separates **application orchestration** from **UI rendering**.

A container might coordinate:

* data fetching
* state ownership
* domain operations
* dependency access
* event orchestration

A presentational component renders the resulting UI.

A headless component instead isolates **reusable UI interaction behavior** from its visual rendering.

For example, a container may fetch users, while a headless combobox manages keyboard navigation and selection, and a
presentation component renders the resulting interface.

The patterns can therefore be combined without being interchangeable.

## Headless Components and Compound Components

Compound components define a cooperating component API.

Headless components define behavior without prescribing visual presentation.

They frequently appear together:

```tsx
<Combobox>
    <Combobox.Input/>
    <Combobox.List>
        <Combobox.Option value="one">
            One
        </Combobox.Option>
    </Combobox.List>
</Combobox>
```

The compound structure organizes the interaction while the components remain visually unopinionated.

The two patterns should not be conflated. A compound component can have a strong visual design, while a headless
component can expose a Hook without using compound components at all.

## Headless Components and Render Props

Render props are one implementation mechanism for headless components.

The render function receives behavioral state and determines the UI.

This is especially useful when:

* rendering flexibility is required
* the consumer needs direct access to derived state
* the interaction API is naturally represented as a render contract

Custom Hooks are often preferable when the consumer should have complete control over where and how the behavior is
used.

## Headless Components and Refs

Refs are commonly part of the behavioral boundary because focus and DOM coordination are interaction concerns.

A headless abstraction may therefore expose refs or attach them through returned props.

The imperative API should remain narrow. A headless component should not expose arbitrary DOM manipulation merely
because it has access to a DOM node.

## Headless Components and Imperative Handles

An imperative handle can complement a headless component when consumers need explicit commands such as:

```tsx
ref.current?.focus();
ref.current?.open();
ref.current?.close();
```

The imperative handle should expose only operations that are meaningful to the interaction contract.

The existence of an imperative API does not make the component non-headless.

## Headless Components and Reducers

A reducer can model the internal interaction state.

```tsx
function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "open":
            return {
                ...state,
                open: true
            };

        case "close":
            return {
                ...state,
                open: false
            };

        case "select":
            return {
                ...state,
                selectedId: action.id,
                open: false
            };

        default:
            return state;
    }
}
```

Reducers are useful when the interaction has many transitions or when behavior should be tested independently of
rendering.

The reducer is an implementation technique; the headless boundary is the reusable behavioral abstraction.

## Testing

Headless components should be tested primarily through their behavioral contract.

Important cases include:

* initial state
* state transitions
* keyboard interaction
* focus behavior
* selection behavior
* disabled items
* event handling
* accessibility attributes
* controlled state
* uncontrolled state
* mounting and unmounting
* item registration
* reordering
* cancellation behavior

A headless Hook can often be tested without asserting the visual structure of a consuming component.

Integration tests should additionally verify that the behavioral API is correctly applied to actual DOM elements.

## Accessibility Testing

Accessibility should be tested as part of the component contract.

Tests should verify the semantic relationships produced by the headless behavior, such as:

```tsx
expect(trigger).toHaveAttribute(
    "aria-expanded",
    "true"
);
```

and:

```tsx
expect(input).toHaveAttribute(
    "aria-controls",
    listbox.id
);
```

Keyboard and focus behavior should be tested with actual user interactions rather than only by invoking internal
functions.

## Server Rendering

Headless components must remain compatible with React's rendering model when used in server-rendered applications.

Particular care is required for:

* generated IDs
* browser-only APIs
* DOM references
* focus management
* effects
* event handlers
* hydration consistency

DOM-dependent behavior should not be executed during server rendering.

The headless abstraction should produce deterministic render output when hydration requires it.

## Performance

Headless abstractions can introduce performance costs when behavioral state is broad or frequently changing.

Potential causes include:

* large Context values
* unnecessary consumer subscriptions
* unstable callback identities
* repeated derived calculations
* registering large collections
* excessive state updates

The solution is not automatically memoization.

The state model should first be structured so that unrelated consumers do not subscribe to unrelated changes.

Context partitioning, selectors, state colocation, and stable identities can be used where justified.

## API Design

A headless API should expose behavior rather than implementation details.

Prefer:

```tsx
const {
    open,
    close,
    toggle
} = useDisclosure();
```

over exposing internal state-management mechanisms:

```tsx
const {
    setOpen,
    internalState,
    dispatch
} = useDisclosure();
```

The consumer should depend on the interaction contract, not on how that contract is implemented.

A good headless API should also make invalid combinations difficult to express.

For example, a component should not expose arbitrary methods for manipulating internal indexes if the consumer only
needs semantic operations such as `next()`, `previous()`, `select()`, and `close()`.

## Granularity

A headless component should represent a coherent interaction.

Good boundaries include:

```text
useDisclosure
useTabs
useCombobox
useListbox
useMenu
useDialog
usePopover
```

An abstraction such as:

```text
useEverything
```

is usually a sign that unrelated behavior has been coupled together.

The unit should be large enough to encapsulate meaningful interaction complexity but small enough to remain reusable.

## Avoiding Visual Leakage

A headless abstraction becomes less reusable when it starts prescribing presentation.

For example, requiring:

```tsx
variant = "rounded-blue"
```

is generally a visual concern.

Similarly, embedding assumptions about a specific CSS framework, design-token system, typography scale, or spacing
convention weakens the headless boundary.

Behavioral state can be exposed:

```tsx
data - open = {open}
```

but visual interpretation should remain with the consumer.

## Avoiding DOM Leakage

The opposite problem is exposing too many assumptions about the DOM.

An API that requires a consumer to render a specific hierarchy defeats much of the purpose of headless design.

For example, an abstraction should avoid unnecessarily requiring:

```tsx
<div>
    <div>
        <button>
            ...
        </button>
    </div>
</div>
```

unless that structure is intrinsic to the interaction semantics.

The more structural assumptions the abstraction makes, the less headless it becomes.

## Avoiding Accessibility Leakage

Headless does not mean that accessibility becomes the consumer's problem.

If the reusable interaction has known accessibility requirements, those requirements should be part of the behavioral
abstraction.

The consumer should have presentation freedom without having to independently rediscover the accessibility model.

This is one of the primary differences between a genuinely headless primitive and merely extracting some state into a
Hook.

## Common Misuse

A common misuse is calling any custom Hook a headless component.

A Hook such as:

```tsx
function useCounter() {
    const [count, setCount] = useState(0);

    return {
        count,
        increment: () => setCount(value => value + 1)
    };
}
```

is reusable behavior, but it is not necessarily a headless UI component.

The headless pattern becomes meaningful when the behavior represents a reusable UI interaction whose rendering is
intentionally delegated to the consumer.

Another misuse is creating a headless abstraction that contains application-specific domain logic, API calls, and
product-specific assumptions. This makes the abstraction difficult to reuse.

Another misuse is providing so much configuration that consumers effectively have to reconstruct the component's
implementation manually. A headless API should provide meaningful behavioral primitives rather than expose every
internal detail.

## Advantages

Headless components provide several architectural benefits.

They centralize complex interaction behavior and accessibility logic.

They allow multiple visual implementations to share one behavioral contract.

They reduce duplication across design systems and product surfaces.

They allow consumers to use different CSS and component libraries without rewriting interaction logic.

They make behavioral logic easier to test independently from presentation.

They can provide a stable interaction API while visual implementations evolve independently.

They can also support controlled and uncontrolled usage without coupling the behavior to a particular presentation.

## Disadvantages

Headless components can produce more complex APIs than ordinary UI components.

Consumers are responsible for constructing the visual implementation correctly.

Incorrect use of returned props, refs, roles, or event handlers can break accessibility or behavior.

Highly generic headless abstractions can become difficult to understand.

Context-heavy implementations can create unnecessary rendering costs.

Complex registration and focus management can introduce subtle lifecycle bugs.

There is also a risk of overengineering simple interactions that could be implemented directly.

## When to Use

Use a headless component when:

* interaction behavior is genuinely reusable
* multiple visual implementations need the same behavior
* accessibility behavior is complex
* keyboard navigation is nontrivial
* focus management must be centralized
* consumers require different visual structures
* a design system needs behavior independent of styling
* the same interaction appears across multiple product surfaces

## When Not to Use

Do not introduce a headless abstraction when:

* the interaction is trivial and local
* there is only one consumer
* the behavior is tightly coupled to one visual implementation
* the abstraction would expose more complexity than it removes
* consumers do not need rendering flexibility
* a normal component already provides the required reuse

A conventional reusable component is often preferable when behavior and presentation naturally belong together.

## Design Rules

1. Own reusable interaction behavior, not visual design.
2. Keep application-specific domain logic outside generic headless primitives.
3. Treat accessibility as part of the behavioral contract.
4. Expose semantic operations instead of internal implementation details.
5. Support controlled state only when consumers genuinely need state ownership.
6. Define event-handler composition and cancellation semantics explicitly.
7. Preserve stable identities for related interactive elements.
8. Avoid unnecessary DOM-structure assumptions.
9. Keep styling decisions with the consumer.
10. Keep server-state and data-fetching concerns separate unless they are intrinsic to the abstraction.
11. Test the behavioral contract independently from visual presentation.
12. Prefer a coherent interaction boundary over a collection of unrelated utilities.
13. Make semantically correct rendering straightforward.
14. Do not expose imperative APIs merely because the implementation can access the DOM.
15. Do not create a headless abstraction solely to avoid writing a small amount of local UI code.

## Relationship to Other Patterns

Headless Components and Custom Hooks are closely related because Hooks are a common implementation mechanism for
renderless behavior.

Headless Components and Compound Components can be combined when a reusable interaction is exposed as a cooperating
component API.

Headless Components and Render Props can be combined when consumers need a function-based rendering contract.

Headless Components and Controlled Components can be combined when the consumer owns the authoritative interaction
state.

Headless Components and Reducers can be combined when the interaction contains complex state transitions.

Headless Components and Context can be combined when multiple descendants must participate in the same interaction
state.

Headless Components and Ref Patterns are frequently combined for focus and DOM coordination.

Headless Components and Imperative Handles can be combined when a narrow imperative API is part of the interaction
contract.

Headless Components and Container-Presentational Components address different boundaries. Headless Components separate
reusable interaction behavior from presentation; Container-Presentational Components separate application orchestration
from rendering.

Headless Components and Layout Components are independent. A headless component defines interaction behavior, while a
layout component defines spatial arrangement.

Headless Components and Provider Composition are independent. Providers assemble shared capabilities; headless
components consume whatever capabilities they require.

Headless Components and Server State are also independent. Server state concerns remote authoritative data, whereas
headless behavior concerns interaction with UI state and user input.

## Summary

A headless component encapsulates reusable UI behavior while leaving visual implementation to the consumer. It can own
state, state transitions, keyboard interaction, focus management, accessibility semantics, IDs, refs, and other
interaction mechanics without prescribing colors, layout, styling, or visual hierarchy.

The strongest headless abstractions expose a semantic behavioral contract. They allow consumers to construct different
presentations while preserving the difficult parts of the interaction model.

The core principle is: **the headless component owns how the interaction behaves; the consumer owns how that behavior is
presented.**

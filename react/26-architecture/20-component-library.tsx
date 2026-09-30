/**
 * Component Library
 * =================
 *
 * A component library is a collection of reusable UI components exposed through
 * stable APIs for use across an application, product, or group of applications.
 *
 * A component library focuses on reusable implementation and component contracts,
 * while a broader design system can also define design foundations, patterns,
 * accessibility standards, and usage guidance.
 */

import { type FC, type FormEvent, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Component library concept
// ---------------------------------------------------------------------

// A component library typically provides:
//
// - reusable components
// - stable component APIs
// - shared interaction behavior
// - accessibility conventions
// - styling conventions
// - component documentation
// - tests
//
// Consumers use the library rather than reimplementing the same UI behavior.

// ---------------------------------------------------------------------
// 2. Component library versus design system
// ---------------------------------------------------------------------

// Component library:
//
// Button
// Input
// Dialog
// Card
// Select
//
// Design system:
//
// design tokens
// components
// interaction patterns
// accessibility standards
// visual language
// usage guidance
//
// A component library can implement part of a design system,
// but the two concepts are not identical.

// ---------------------------------------------------------------------
// 3. Library consumers
// ---------------------------------------------------------------------

// A component library may be consumed by:
//
// Application A
// Application B
// Application C
//
// Each application depends on the library's public contracts.
//
// The library should therefore minimize assumptions about its consumers.

// ---------------------------------------------------------------------
// 4. Public component API
// ---------------------------------------------------------------------

export interface ButtonProps {
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly size?: "small" | "medium" | "large";
  readonly type?: "button" | "submit" | "reset";
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

// The public API is the contract consumers program against.
//
// It should expose meaningful behavior rather than implementation details.

// ---------------------------------------------------------------------
// 5. Library button
// ---------------------------------------------------------------------

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  onClick,
}): ReactElement => {
  return (
    <button type={type} disabled={disabled} onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  );
};

// The implementation can change internally as long as the public contract
// and documented behavior remain compatible.

// ---------------------------------------------------------------------
// 6. API surface versus implementation
// ---------------------------------------------------------------------

// Consumers should depend on:
//
// ButtonProps
// Button
//
// Consumers should not depend on:
//
// internal helper functions
// private style objects
// internal state structures
// implementation-specific DOM details
//
// A library should expose only what consumers need.

// ---------------------------------------------------------------------
// 7. Named exports
// ---------------------------------------------------------------------

export interface CardProps {
  readonly children: ReactNode;
  readonly title?: string;
}

export const Card: FC<CardProps> = ({ children, title }): ReactElement => {
  return (
    <section>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
};

// Named exports make the intended public API explicit.

// ---------------------------------------------------------------------
// 8. Default exports
// ---------------------------------------------------------------------

// A component library can use default exports,
// but named exports often make large APIs easier to discover:
//
// import {Button, Card} from "...";
//
// Explicit names also make it easier to see which symbols belong to
// the library's public API.

// ---------------------------------------------------------------------
// 9. Component naming
// ---------------------------------------------------------------------

// Public component names should communicate their purpose:
//
// Button
// Dialog
// TextField
// DataTable
//
// Avoid exposing implementation-oriented names:
//
// StyledButtonImplementation
// InternalCardWrapper
// ButtonBaseV2Temporary
//
// Internal implementation names should remain internal.

// ---------------------------------------------------------------------
// 10. Stable prop contracts
// ---------------------------------------------------------------------

export interface AlertProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly tone?: "info" | "success" | "warning" | "danger";
}

export const Alert: FC<AlertProps> = ({ title, children, tone = "info" }): ReactElement => {
  return (
    <aside role="status" data-tone={tone}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
};

// Public props should describe stable concepts.
// Internal state or implementation details should not leak into the API.

// ---------------------------------------------------------------------
// 11. Avoid implementation leakage
// ---------------------------------------------------------------------

// Avoid public props such as:
//
// readonly internalClassName?: string
// readonly implementationMode?: string
// readonly renderEngine?: "legacy" | "new"
//
// when these values exist only because of internal implementation details.
//
// Public APIs should express consumer intent.

// ---------------------------------------------------------------------
// 12. Semantic callbacks
// ---------------------------------------------------------------------

export interface DialogProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export const Dialog: FC<DialogProps> = ({ title, children, onClose }): ReactElement => {
  return (
    <div role="dialog" aria-modal="true">
      <header>
        <h2>{title}</h2>

        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </header>

      <div>{children}</div>
    </div>
  );
};

// `onClose` communicates intent more clearly than exposing an internal
// event such as `onButtonClick`.

// ---------------------------------------------------------------------
// 13. Controlled components
// ---------------------------------------------------------------------

export interface TextFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly onChange: (value: string) => void;
}

export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  disabled = false,
  onChange,
}): ReactElement => {
  return (
    <label>
      <span>{label}</span>

      <input
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};

// Controlled components make state ownership explicit:
//
// Consumer state
//     ↓
// value
//     ↓
// TextField
//     ↓
// onChange
//     ↓
// Consumer state

// ---------------------------------------------------------------------
// 14. Uncontrolled components
// ---------------------------------------------------------------------

export interface SearchInputProps {
  readonly defaultValue?: string;
  readonly placeholder?: string;
  readonly onSubmit: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ defaultValue = "", placeholder, onSubmit }): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const value = String(formData.get("query") ?? "");

    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" defaultValue={defaultValue} placeholder={placeholder} />

      <Button type="submit">Search</Button>
    </form>
  );
};

// Uncontrolled components can be useful when the consumer does not need
// to synchronize every input change with React state.

// ---------------------------------------------------------------------
// 15. Controlled versus uncontrolled API
// ---------------------------------------------------------------------

// A component library should clearly define whether a component is:
//
// controlled
// uncontrolled
// or intentionally supports both.
//
// Ambiguous state ownership creates difficult integration behavior.

// ---------------------------------------------------------------------
// 16. Dual controlled/uncontrolled components
// ---------------------------------------------------------------------

export interface ToggleProps {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ checked, defaultChecked = false, onCheckedChange }): ReactElement => {
  const isControlled = checked !== undefined;

  const currentValue = isControlled ? checked : defaultChecked;

  return (
    <button type="button" aria-pressed={currentValue} onClick={() => onCheckedChange?.(!currentValue)}>
      {currentValue ? "On" : "Off"}
    </button>
  );
};

// A real dual-mode component would maintain internal state in uncontrolled mode.
// The important library concern is that the state ownership contract must be explicit.

// ---------------------------------------------------------------------
// 17. Component composition
// ---------------------------------------------------------------------

export interface ModalProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

export const Modal: FC<ModalProps> = ({ title, children, footer }): ReactElement => {
  return (
    <div role="dialog" aria-modal="true">
      <h2>{title}</h2>

      <div>{children}</div>

      {footer && <footer>{footer}</footer>}
    </div>
  );
};

// Composition gives consumers flexibility without creating a prop
// for every possible content variation.

// ---------------------------------------------------------------------
// 18. Composition over configuration
// ---------------------------------------------------------------------

// Prefer:
//
// <Modal
//     title="Delete item"
//     footer={<Button>Delete</Button>}
// >
//     ...
// </Modal>
//
// over:
//
// <Modal
//     showFooter
//     footerAlignment="right"
//     footerButtonLabel="Delete"
//     footerButtonVariant="danger"
// />
//
// Composition keeps the library API smaller and more expressive.

// ---------------------------------------------------------------------
// 19. Slots through ReactNode
// ---------------------------------------------------------------------

export interface PageHeaderProps {
  readonly title: string;
  readonly description?: ReactNode;
  readonly actions?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description, actions }): ReactElement => {
  return (
    <header>
      <div>
        <h1>{title}</h1>
        {description && <div>{description}</div>}
      </div>

      {actions && <div>{actions}</div>}
    </header>
  );
};

// ReactNode slots allow consumers to compose content without requiring
// the library to understand the content's implementation.

// ---------------------------------------------------------------------
// 20. Generic components
// ---------------------------------------------------------------------

export interface ListProps<T> {
  readonly items: readonly T[];
  readonly getKey: (item: T) => string;
  readonly renderItem: (item: T) => ReactNode;
}

export const List = <T,>({ items, getKey, renderItem }: ListProps<T>): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

// Generic components allow a library to remain reusable without replacing
// application-specific data types with `unknown` or `any`.

// ---------------------------------------------------------------------
// 21. Generic table
// ---------------------------------------------------------------------

export interface TableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly render: (item: T) => ReactNode;
}

export interface TableProps<T> {
  readonly items: readonly T[];
  readonly columns: readonly TableColumn<T>[];
  readonly getKey: (item: T) => string;
}

export const DataTable = <T,>({ items, columns, getKey }: TableProps<T>): ReactElement => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr key={getKey(item)}>
            {columns.map((column) => (
              <td key={column.key}>{column.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Generic APIs preserve the relationship between data and rendering logic.

// ---------------------------------------------------------------------
// 22. Narrow component contracts
// ---------------------------------------------------------------------

export interface AvatarProps {
  readonly name: string;
  readonly src?: string;
  readonly size?: "small" | "medium" | "large";
}

export const Avatar: FC<AvatarProps> = ({ name, src, size = "medium" }): ReactElement => {
  return (
    <img
      src={src}
      alt={name}
      width={size === "small" ? 32 : size === "large" ? 64 : 48}
      height={size === "small" ? 32 : size === "large" ? 64 : 48}
    />
  );
};

// A narrow API exposes only the information needed to render the component.

// ---------------------------------------------------------------------
// 23. Avoid passing domain objects unnecessarily
// ---------------------------------------------------------------------

// Avoid:
//
// <Avatar user={user} />
//
// when Avatar only needs:
//
// name
// src
//
// Prefer:
//
// <Avatar
//     name={user.name}
//     src={user.avatarUrl}
// />
//
// This prevents the library from coupling itself to an application's
// domain model.

// ---------------------------------------------------------------------
// 24. Presentation-oriented data
// ---------------------------------------------------------------------

export interface PriceProps {
  readonly amount: number;
  readonly currency: string;
}

export const Price: FC<PriceProps> = ({ amount, currency }): ReactElement => {
  return (
    <span>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(amount)}
    </span>
  );
};

// The component accepts presentation-oriented values,
// rather than requiring an application-specific Product or Order type.

// ---------------------------------------------------------------------
// 25. Avoid library domain coupling
// ---------------------------------------------------------------------

// A reusable component library should generally avoid APIs such as:
//
// <ProductCard product={product} />
//
// if `Product` is an application-specific domain type.
//
// A more reusable component can accept:
//
// name
// price
// image
// actions
//
// The application remains responsible for transforming domain data.

// ---------------------------------------------------------------------
// 26. Accessibility contract
// ---------------------------------------------------------------------

export interface IconButtonProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const IconButton: FC<IconButtonProps> = ({ label, children, disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// The API requires an accessible label,
// making an important accessibility requirement explicit.

// ---------------------------------------------------------------------
// 27. Native semantics
// ---------------------------------------------------------------------

// Prefer native HTML semantics where they match the intended interaction:
//
// <button>
// <a>
// <input>
// <select>
// <textarea>
//
// Replacing native controls with generic elements can create unnecessary
// keyboard, focus, and accessibility responsibilities.

// ---------------------------------------------------------------------
// 28. Keyboard behavior
// ---------------------------------------------------------------------

// Interactive library components should document and test keyboard behavior.
//
// A button should behave like a button.
//
// A link should behave like a link.
//
// A custom menu, combobox, or dialog may require additional keyboard rules.
//
// The library should own those rules when it owns the component.

// ---------------------------------------------------------------------
// 29. Focus behavior
// ---------------------------------------------------------------------

export interface FocusablePanelProps {
  readonly children: ReactNode;
}

export const FocusablePanel: FC<FocusablePanelProps> = ({ children }): ReactElement => {
  return (
    <section tabIndex={0} aria-label="Panel">
      {children}
    </section>
  );
};

// Focusability should be introduced intentionally.
// Not every container should become keyboard-focusable merely for convenience.

// ---------------------------------------------------------------------
// 30. Component state
// ---------------------------------------------------------------------

export type ButtonState = "default" | "disabled" | "loading";

export interface StatefulButtonProps {
  readonly children: ReactNode;
  readonly state?: ButtonState;
  readonly onClick?: () => void;
}

export const StatefulButton: FC<StatefulButtonProps> = ({ children, state = "default", onClick }): ReactElement => {
  const disabled = state !== "default";

  return (
    <Button disabled={disabled} onClick={onClick}>
      {state === "loading" ? "Loading..." : children}
    </Button>
  );
};

// Shared components should define observable states clearly.

// ---------------------------------------------------------------------
// 31. State semantics
// ---------------------------------------------------------------------

// `disabled` and `loading` are not necessarily equivalent.
//
// Disabled:
//
// the action is unavailable.
//
// Loading:
//
// an operation is in progress.
//
// A component library should document these semantics
// so consumers do not have to infer them.

// ---------------------------------------------------------------------
// 32. Error state
// ---------------------------------------------------------------------

export interface FieldErrorProps {
  readonly message: string;
}

export const FieldError: FC<FieldErrorProps> = ({ message }): ReactElement => {
  return <p role="alert">{message}</p>;
};

// Error presentation can be standardized without making the component
// responsible for determining why the error occurred.

// ---------------------------------------------------------------------
// 33. Loading indicator
// ---------------------------------------------------------------------

export interface SpinnerProps {
  readonly label?: string;
}

export const Spinner: FC<SpinnerProps> = ({ label = "Loading" }): ReactElement => {
  return (
    <span role="status" aria-label={label}>
      ...
    </span>
  );
};

// Loading indicators should expose an accessible status when appropriate.

// ---------------------------------------------------------------------
// 34. Empty states
// ---------------------------------------------------------------------

export interface EmptyStateProps {
  readonly title: string;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, description, action }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>

      {description && <div>{description}</div>}

      {action && <div>{action}</div>}
    </section>
  );
};

// EmptyState is reusable because it describes a presentation pattern,
// not a particular application's domain.

// ---------------------------------------------------------------------
// 35. Component library and styling
// ---------------------------------------------------------------------

// A component library can implement styling through:
//
// CSS
// CSS Modules
// CSS-in-JS
// utility classes
// CSS custom properties
//
// The architectural concern is not the styling technology itself.
// The important concern is keeping the public component contract stable.

// ---------------------------------------------------------------------
// 36. Styling isolation
// ---------------------------------------------------------------------

// Library components should avoid accidentally depending on global application styles.
//
// Prefer styles that are:
//
// predictable
// scoped
// documented
// composable
//
// Global selectors can create hidden coupling between applications and the library.

// ---------------------------------------------------------------------
// 37. Class name customization
// ---------------------------------------------------------------------

export interface PanelProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export const Panel: FC<PanelProps> = ({ children, className }): ReactElement => {
  return <section className={className}>{children}</section>;
};

// `className` can be useful as an escape hatch,
// but a library should not require consumers to understand internal selectors.

// ---------------------------------------------------------------------
// 38. Style customization
// ---------------------------------------------------------------------

export interface SurfaceProps {
  readonly children: ReactNode;
  readonly style?: React.CSSProperties;
}

// The React namespace is not imported here.
// Use a named type import when React namespace types are needed.
import type { CSSProperties } from "react";

export const Surface: FC<SurfaceProps> = ({ children, style }): ReactElement => {
  return <div style={style}>{children}</div>;
};

// Style escape hatches can be useful,
// but excessive styling freedom can undermine the library's consistency.

// ---------------------------------------------------------------------
// 39. Correcting namespace-dependent types
// ---------------------------------------------------------------------

// The `SurfaceProps` example above uses React.CSSProperties conceptually,
// but library source should prefer a type-only import:
//
// import type {CSSProperties} from "react";
//
// and:
//
// readonly style?: CSSProperties;
//
// Keeping the type import explicit avoids depending on a React namespace
// that is not otherwise imported.

// ---------------------------------------------------------------------
// 40. Public API surface
// ---------------------------------------------------------------------

// A library may contain many internal implementation modules:
//
// components/
//     Button.tsx
//     Dialog.tsx
//     Input.tsx
//     internal/
//         useDialogState.ts
//         dialogFocus.ts
//
// Only selected symbols should be exposed through the package's public API.

// ---------------------------------------------------------------------
// 41. Public entry point
// ---------------------------------------------------------------------

// A package entry point can expose:
//
// export {Button} from "./components/Button";
// export {Card} from "./components/Card";
// export type {ButtonProps} from "./components/Button";
//
// Consumers then depend on stable package-level imports
// rather than internal file paths.

// ---------------------------------------------------------------------
// 42. Avoid deep imports
// ---------------------------------------------------------------------

// Prefer:
//
// import {Button} from "@example/ui";
//
// over:
//
// import {Button} from "@example/ui/src/components/Button";
//
// Deep imports couple consumers to internal package structure.

// ---------------------------------------------------------------------
// 43. Export types deliberately
// ---------------------------------------------------------------------

export type ButtonVariant = "primary" | "secondary" | "danger";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

// Public type exports are part of the component library contract.

// ---------------------------------------------------------------------
// 44. Internal helpers
// ---------------------------------------------------------------------

const normalizeLabel = (label: string): string => {
  return label.trim();
};

// Internal helpers can remain unexported.
// They can change without creating a public API compatibility requirement.

// ---------------------------------------------------------------------
// 45. Public factory API
// ---------------------------------------------------------------------

export interface DialogController {
  readonly open: () => void;
  readonly close: () => void;
}

export const createDialogController = (): DialogController => {
  return {
    open: () => undefined,
    close: () => undefined,
  };
};

// A factory can expose a stable abstraction while hiding its internal implementation.

// ---------------------------------------------------------------------
// 46. Avoid exposing implementation classes
// ---------------------------------------------------------------------

// Prefer:
//
// export interface DialogController
//
// when consumers only need the contract.
//
// Avoid exposing a concrete implementation class merely because
// the library happens to use a class internally.

// ---------------------------------------------------------------------
// 47. Component library and hooks
// ---------------------------------------------------------------------

export interface UseDisclosureResult {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
}

export const useDisclosure = (initialOpen = false): UseDisclosureResult => {
  return {
    isOpen: initialOpen,
    open: () => undefined,
    close: () => undefined,
  };
};

// A real hook would manage React state.
// The public contract can still be expressed independently of its implementation.

// ---------------------------------------------------------------------
// 48. Hooks and component APIs
// ---------------------------------------------------------------------

// A library may expose both:
//
// component
// hook
//
// when consumers need lower-level control.
//
// For example:
//
// Dialog
// useDialog
//
// The hook should not expose internal state structures that consumers
// should not depend on.

// ---------------------------------------------------------------------
// 49. Component library and controlled state
// ---------------------------------------------------------------------

export interface DisclosureProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly children: ReactNode;
}

export const Disclosure: FC<DisclosureProps> = ({ open, onOpenChange, children }): ReactElement => {
  return (
    <section data-open={open}>
      {children}

      <Button onClick={() => onOpenChange(!open)}>{open ? "Close" : "Open"}</Button>
    </section>
  );
};

// Controlled state makes ownership explicit and keeps the component reusable.

// ---------------------------------------------------------------------
// 50. Component library and asynchronous behavior
// ---------------------------------------------------------------------

export interface AsyncState<T> {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly data?: T;
  readonly error?: Error;
}

export interface AsyncContentProps<T> {
  readonly state: AsyncState<T>;
  readonly renderData: (data: T) => ReactNode;
}

export const AsyncContent = <T,>({ state, renderData }: AsyncContentProps<T>): ReactElement => {
  if (state.status === "loading") {
    return <Spinner />;
  }

  if (state.status === "error") {
    return <FieldError message={state.error?.message ?? "An error occurred."} />;
  }

  if (state.status === "success" && state.data !== undefined) {
    return <>{renderData(state.data)}</>;
  }

  return <></>;
};

// The library can provide presentation patterns for asynchronous state
// without owning the application's data-fetching mechanism.

// ---------------------------------------------------------------------
// 51. Library should not own application fetching
// ---------------------------------------------------------------------

// Avoid making a generic component automatically fetch:
//
// <UserList />
//
// if the component is intended for many applications.
//
// Prefer:
//
// <List
//     items={users}
//     renderItem={...}
// />
//
// The application owns data retrieval.
// The library owns reusable presentation.

// ---------------------------------------------------------------------
// 52. Dependency injection through props
// ---------------------------------------------------------------------

export interface DataLoaderProps<T> {
  readonly data: readonly T[];
  readonly renderItem: (item: T) => ReactNode;
}

export const DataLoader = <T,>({ data, renderItem }: DataLoaderProps<T>): ReactElement => {
  return <List items={data} getKey={(item) => String(item)} renderItem={renderItem} />;
};

// Passing data and rendering behavior keeps the library independent
// from the application's data source.

// ---------------------------------------------------------------------
// 53. Component library and routing
// ---------------------------------------------------------------------

// Generic components should not assume a specific router unless routing
// is explicitly part of the component's responsibility.
//
// Prefer:
//
// <Link href="/account">
//
// for a generic library.
//
// A router-specific package can provide:
//
// <RouterLink to="/account">
//
// when router integration is intentionally part of that library.

// ---------------------------------------------------------------------
// 54. Component library and application context
// ---------------------------------------------------------------------

// Avoid silently requiring application-specific providers:
//
// Button
//     ↓
// hidden application context
//     ↓
// feature store
//
// A component library should make important dependencies explicit
// through props or clearly documented providers.

// ---------------------------------------------------------------------
// 55. Peer dependencies
// ---------------------------------------------------------------------

// React component libraries commonly treat React as a peer dependency
// so the consuming application provides the React runtime.
//
// Conceptually:
//
// Application
//     ├── React
//     └── Component library
//             └── React as peer dependency
//
// This helps avoid accidentally bundling a separate React runtime.

// ---------------------------------------------------------------------
// 56. React runtime compatibility
// ---------------------------------------------------------------------

// A component library should define supported React versions
// and verify compatibility with the APIs it uses.
//
// The exact supported range belongs to the package's release policy.

// ---------------------------------------------------------------------
// 57. Avoid duplicate React runtimes
// ---------------------------------------------------------------------

// A library should generally resolve React from the consuming application
// rather than bundling a second incompatible copy.
//
// Multiple React runtimes can cause identity-sensitive problems,
// particularly with hooks and context.

// ---------------------------------------------------------------------
// 58. Package exports
// ---------------------------------------------------------------------

// A package can expose a controlled set of entry points:
//
// @example/ui
// @example/ui/forms
// @example/ui/layout
//
// Each public entry point becomes part of the package's navigational API.
//
// Internal source paths should remain private.

// ---------------------------------------------------------------------
// 59. Subpath APIs
// ---------------------------------------------------------------------

// Subpath APIs can be useful when a library is large:
//
// import {TextField} from "@example/ui/forms";
//
// import {Stack} from "@example/ui/layout";
//
// The package should keep these entry points intentional and documented.

// ---------------------------------------------------------------------
// 60. Avoid accidental exports
// ---------------------------------------------------------------------

// Exporting every internal module makes future refactoring harder:
//
// export * from "./internal";
//
// Consumers may begin depending on implementation details.
//
// Public exports should be deliberate.

// ---------------------------------------------------------------------
// 61. Barrel exports
// ---------------------------------------------------------------------

// A barrel can provide a convenient public API:
//
// export {Button} from "./Button";
// export {Card} from "./Card";
// export {Dialog} from "./Dialog";
//
// But barrels should not automatically re-export private modules.

// ---------------------------------------------------------------------
// 62. Component documentation
// ---------------------------------------------------------------------

export interface DocumentationMetadata {
  readonly name: string;
  readonly description: string;
  readonly whenToUse: string;
  readonly whenNotToUse: string;
}

export const buttonDocumentation: DocumentationMetadata = {
  name: "Button",
  description: "Triggers an explicit user action.",
  whenToUse: "Use for actions performed within the current interface.",
  whenNotToUse: "Use a link when the interaction navigates to another resource.",
};

// Component documentation should explain usage decisions,
// not only list props.

// ---------------------------------------------------------------------
// 63. When not to use a component
// ---------------------------------------------------------------------

// Good documentation can distinguish:
//
// Button → performs an action
// Link   → navigates to a resource
//
// This prevents consumers from choosing components solely based on appearance.

// ---------------------------------------------------------------------
// 64. Component examples
// ---------------------------------------------------------------------

export const ComponentLibraryExample: FC = (): ReactElement => {
  return (
    <Card title="Account">
      <PageHeader title="Profile" description="Manage account information." actions={<Button>Save</Button>} />

      <TextField id="name" label="Name" value="John Doe" onChange={() => undefined} />
    </Card>
  );
};

// Examples should demonstrate realistic composition,
// not merely isolated component rendering.

// ---------------------------------------------------------------------
// 65. Component API testing
// ---------------------------------------------------------------------

// A component library should test:
//
// - rendering
// - props
// - state transitions
// - callbacks
// - keyboard behavior
// - focus behavior
// - accessibility
// - controlled/uncontrolled behavior
// - error states
// - loading states
//
// Tests should verify public behavior rather than internal implementation details.

// ---------------------------------------------------------------------
// 66. Behavioral tests
// ---------------------------------------------------------------------

export interface TestableButtonProps {
  readonly onAction: () => void;
}

export const TestableButton: FC<TestableButtonProps> = ({ onAction }): ReactElement => {
  return <Button onClick={onAction}>Confirm</Button>;
};

// Consumers and tests should reason about:
//
// click → onAction
//
// rather than:
//
// click → internal helper → state object → implementation detail

// ---------------------------------------------------------------------
// 67. Visual regression
// ---------------------------------------------------------------------

// Visual regression tests can protect shared component appearance:
//
// Button
// Dialog
// TextField
// Card
//
// A small visual change in a library can affect many consuming applications.

// ---------------------------------------------------------------------
// 68. Accessibility testing
// ---------------------------------------------------------------------

// Accessibility tests should verify observable requirements such as:
//
// - accessible names
// - roles
// - labels
// - keyboard interaction
// - focus behavior
// - disabled semantics
// - error announcements
//
// Accessibility should be part of the library contract,
// not an optional consumer responsibility.

// ---------------------------------------------------------------------
// 69. Versioning
// ---------------------------------------------------------------------

// Component libraries often require explicit versioning because
// many consumers can depend on the same API.
//
// Potential breaking changes:
//
// - removed props
// - renamed props
// - changed defaults
// - changed semantics
// - changed keyboard behavior
// - changed focus behavior
// - changed rendered elements

// ---------------------------------------------------------------------
// 70. Deprecation
// ---------------------------------------------------------------------

/**
 * @deprecated Use `Button` with `variant="secondary"` instead.
 */
export const SecondaryButton: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return <Button variant="secondary">{children}</Button>;
};

// Deprecation lets consumers migrate without requiring an immediate rewrite.

// ---------------------------------------------------------------------
// 71. Migration paths
// ---------------------------------------------------------------------

// A good library release should provide:
//
// old API
//     ↓
// deprecation period
//     ↓
// replacement API
//     ↓
// migration guidance
//     ↓
// eventual removal
//
// The exact process depends on the library's release policy.

// ---------------------------------------------------------------------
// 72. Avoid API fragmentation
// ---------------------------------------------------------------------

// Avoid creating many nearly identical components:
//
// PrimaryButton
// SecondaryButton
// DangerButton
// LargePrimaryButton
//
// when one well-designed component can express the stable dimensions:
//
// <Button
//     variant="primary"
//     size="large"
// />

// ---------------------------------------------------------------------
// 73. Avoid prop explosion
// ---------------------------------------------------------------------

// Avoid an API such as:
//
// <Button
//     primary
//     large
//     rounded
//     outlined
//     shadow
//     compact
//     fullWidth
//     loading
//     ...
// />
//
// when many combinations create unclear semantics.
//
// Prefer a small set of intentional props and composition where appropriate.

// ---------------------------------------------------------------------
// 74. API extensibility
// ---------------------------------------------------------------------

export interface FlexibleButtonProps {
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary";
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
}

export const FlexibleButton: FC<FlexibleButtonProps> = ({
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
}): ReactElement => {
  return (
    <Button variant={variant} disabled={disabled}>
      {children}
    </Button>
  );
};

// Extensibility should be intentional.
// Every additional prop becomes part of the component's API surface.

// ---------------------------------------------------------------------
// 75. Stable defaults
// ---------------------------------------------------------------------

export interface NotificationProps {
  readonly title: string;
  readonly tone?: "info" | "success" | "warning" | "danger";
}

export const Notification: FC<NotificationProps> = ({ title, tone = "info" }): ReactElement => {
  return (
    <Alert title={title} tone={tone}>
      Notification
    </Alert>
  );
};

// Defaults are part of observable component behavior.
// Changing a default can therefore be a breaking visual or behavioral change.

// ---------------------------------------------------------------------
// 76. Component library and feature ownership
// ---------------------------------------------------------------------

// Feature team:
//
// owns feature workflows
// owns domain decisions
// owns application state
//
// Component library:
//
// owns reusable UI primitives
// owns reusable interaction behavior
// owns component accessibility contracts
//
// Clear ownership prevents the library from becoming an application layer.

// ---------------------------------------------------------------------
// 77. Component library dependency direction
// ---------------------------------------------------------------------

// Prefer:
//
// Application
//     ↓
// Component library
//     ↓
// React / platform
//
// Avoid:
//
// Component library
//     ↓
// Application feature
//
// The library should remain usable by multiple consumers.

// ---------------------------------------------------------------------
// 78. Component library and domain independence
// ---------------------------------------------------------------------

// Generic library:
//
// <Price amount={100} currency="USD" />
//
// Application-specific:
//
// <OrderTotal order={order} />
//
// The first is reusable across domains.
// The second contains application-specific meaning.

// ---------------------------------------------------------------------
// 79. Component library and business workflows
// ---------------------------------------------------------------------

export interface ConfirmationActionsProps {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ConfirmationActions: FC<ConfirmationActionsProps> = ({ onConfirm, onCancel }): ReactElement => {
  return (
    <div>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>

      <Button variant="danger" onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  );
};

// The library can provide generic confirmation controls.
// The application decides what "confirm" actually does.

// ---------------------------------------------------------------------
// 80. Complete library composition
// ---------------------------------------------------------------------

export interface ProfilePanelProps {
  readonly name: string;
  readonly email: string;
  readonly onSave: () => void;
}

export const ProfilePanel: FC<ProfilePanelProps> = ({ name, email, onSave }): ReactElement => {
  return (
    <Card title="Profile">
      <div>
        <TextField id="profile-name" label="Name" value={name} onChange={() => undefined} />

        <TextField id="profile-email" label="Email" value={email} onChange={() => undefined} />

        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </div>
    </Card>
  );
};

// A consuming feature can compose the library without the library
// needing to know anything about profile persistence or application state.

// ---------------------------------------------------------------------
// 81. Complete application example
// ---------------------------------------------------------------------

export const LibraryApplicationExample: FC = (): ReactElement => {
  return (
    <main>
      <PageHeader title="Account" description="Manage your account details." actions={<Button>Help</Button>} />

      <ProfilePanel name="John Doe" email="john@example.com" onSave={() => undefined} />

      <Alert title="Account status" tone="success">
        Your account is active.
      </Alert>
    </main>
  );
};

// The application composes library components while retaining ownership
// of application-specific behavior.

// ---------------------------------------------------------------------
// 82. Component library architecture
// ---------------------------------------------------------------------

// A practical architecture can look like:
//
// component-library/
//     public entry point
//     components/
//     hooks/
//     tokens/
//     accessibility/
//     internal/
//     tests/
//     documentation/
//
// Only the intended public modules should be exported.

// ---------------------------------------------------------------------
// 83. Internal versus public modules
// ---------------------------------------------------------------------

// Public:
//
// Button
// Card
// Dialog
// TextField
//
// Internal:
//
// normalizeLabel
// focus helpers
// internal state utilities
// implementation-specific style helpers
//
// Keeping this distinction explicit allows the library to evolve internally.

// ---------------------------------------------------------------------
// 84. Public API review
// ---------------------------------------------------------------------

// Before exposing a symbol, ask:
//
// - Does a consumer need this?
// - Is its name stable?
// - Is its behavior documented?
// - Is its type understandable?
// - Can it evolve independently?
// - Does exposing it leak implementation details?
//
// Every export creates a compatibility responsibility.

// ---------------------------------------------------------------------
// 85. Component library evolution
// ---------------------------------------------------------------------

// A healthy library can evolve by:
//
// adding components
// adding variants
// improving accessibility
// deprecating obsolete APIs
// improving implementation
// refining tokens
//
// while preserving stable contracts where possible.

// ---------------------------------------------------------------------
// 86. Complete public API example
// ---------------------------------------------------------------------

export { Button as PublicButton, Card as PublicCard, Dialog as PublicDialog, TextField as PublicTextField };

// A package-level entry point would normally perform this role.
// The important architectural idea is that consumers receive a deliberate
// public surface rather than depending on internal source paths.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A component library is a collection of reusable UI components exposed through stable public contracts.
// - A component library is narrower than a complete design system, which can also define foundations, patterns, accessibility standards, and usage guidance.
// - Public component APIs include props, defaults, callbacks, rendered semantics, and observable behavior.
// - Library consumers should depend on public entry points rather than internal source paths.
// - Named exports make public APIs explicit and easier to discover.
// - Internal helpers should remain unexported unless consumers genuinely need them.
// - Public props should express consumer intent rather than expose implementation details.
// - Semantic callbacks such as onClose and onOpenChange create clearer contracts than implementation-oriented event names.
// - Controlled and uncontrolled components require explicit state-ownership semantics.
// - Composition and ReactNode slots allow consumers to customize content without creating large configuration APIs.
// - Generic components preserve type relationships while keeping the library independent of application-specific domain models.
// - Reusable components should generally accept presentation-oriented data rather than application-specific domain objects.
// - Accessibility requirements should be part of the component contract and reinforced through semantic HTML, keyboard behavior, focus management, and accessible naming.
// - Native HTML controls should be preferred when their semantics match the required interaction.
// - A component library should avoid owning application-specific data fetching, routing, state stores, business rules, and domain workflows unless those concerns are explicitly part of the library's purpose.
// - Dependency injection through props and callbacks keeps reusable components independent from application infrastructure.
// - Styling should remain predictable and should not require consumers to depend on internal implementation details.
// - Package entry points and subpath exports should expose deliberate public APIs while keeping internal modules private.
// - React should normally be treated as a shared peer dependency so the consuming application provides the runtime.
// - Component libraries need documentation that explains not only how a component works, but when to use it and when not to use it.
// - Tests should focus on public behavior, including rendering, callbacks, state, accessibility, keyboard interaction, focus, and controlled/uncontrolled behavior.
// - Visual regression testing is useful because one shared component change can affect many consumers.
// - Public APIs should evolve through deliberate versioning, deprecation, migration guidance, and compatibility policies.
// - The core dependency direction is application → component library → React/platform.
// - A well-designed component library provides reusable implementation and stable contracts without becoming an application-specific architecture layer.

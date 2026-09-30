/**
 * Shared Components
 * ==================
 *
 * Shared components are reusable UI components consumed by multiple parts of an application
 * or by multiple applications. A good shared component exposes a stable, focused interface
 * while keeping feature-specific behavior outside the shared component itself.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Shared component concept
// ---------------------------------------------------------------------

// A shared component provides reusable UI behavior:
//
// Feature A ─┐
// Feature B ─┼──→ Shared Component
// Feature C ─┘
//
// The component should represent a reusable UI concept rather than a single feature's
// private implementation.

// ---------------------------------------------------------------------
// 2. A focused shared component
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// A shared Button owns generic button presentation and interaction.
// It does not know whether the caller is submitting an order, saving a profile,
// or opening a dialog.

// ---------------------------------------------------------------------
// 3. Shared component boundaries
// ---------------------------------------------------------------------

// A shared component should expose:
//
// - inputs through props
// - outputs through callbacks
// - composition through children or slots
//
// It should avoid reaching directly into feature-specific state or services.

// ---------------------------------------------------------------------
// 4. Generic props
// ---------------------------------------------------------------------

interface TextFieldProps {
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
    <label htmlFor={id}>
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

// The component exposes a domain-neutral value callback.
// Callers decide what changing the value means in their own feature.

// ---------------------------------------------------------------------
// 5. Shared components should avoid feature knowledge
// ---------------------------------------------------------------------

// Avoid:
//
// <OrderSubmitButton />
//
// inside a generic shared component package when the component only exists
// because one feature happens to need it.
//
// Prefer:
//
// <Button>Submit order</Button>
//
// and let the order feature provide the business-specific behavior.

// ---------------------------------------------------------------------
// 6. Semantic shared components
// ---------------------------------------------------------------------

interface AlertProps {
  readonly title?: string;
  readonly children: ReactNode;
  readonly tone?: "info" | "success" | "warning" | "error";
}

export const Alert: FC<AlertProps> = ({ title, children, tone = "info" }): ReactElement => {
  return (
    <aside role={tone === "error" ? "alert" : "status"}>
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </aside>
  );
};

// A shared component can still have semantic meaning.
// Its semantics should remain broadly reusable across consuming features.

// ---------------------------------------------------------------------
// 7. Shared component versus feature component
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductCardProps {
  readonly product: Product;
  readonly onSelect?: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onSelect }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
      {onSelect && <Button onClick={() => onSelect(product.id)}>Select</Button>}
    </article>
  );
};

// ProductCard may be shared if multiple parts of the application genuinely
// need the same product presentation and interaction contract.
//
// If only one feature needs it, keeping it feature-local can be simpler.

// ---------------------------------------------------------------------
// 8. Reuse should follow actual need
// ---------------------------------------------------------------------

// A component does not need to become shared merely because it is reusable.
//
// Reusability is a potential property.
// Shared ownership is an architectural decision.
//
// Promote a component when multiple consumers need the same stable concept
// and the abstraction remains coherent across those consumers.

// ---------------------------------------------------------------------
// 9. Shared component API stability
// ---------------------------------------------------------------------

interface IconButtonProps {
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

// Shared components become dependency surfaces.
// Changing their props can affect every consumer, so their public APIs should remain focused.

// ---------------------------------------------------------------------
// 10. Narrow props
// ---------------------------------------------------------------------

interface DialogProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export const Dialog: FC<DialogProps> = ({ title, children, onClose }): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-label={title}>
      <h2>{title}</h2>
      {children}
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

// The component receives only what it needs.
// Passing an entire application object would create unnecessary coupling.

// ---------------------------------------------------------------------
// 11. Avoid application-wide props
// ---------------------------------------------------------------------

// Avoid:
//
// interface ButtonProps {
//     user: User;
//     permissions: Permissions;
//     settings: Settings;
//     applicationState: ApplicationState;
// }
//
// A shared component should not need to understand the entire application.
//
// Prefer a narrow interface such as:
//
// interface ButtonProps {
//     children: ReactNode;
//     disabled?: boolean;
//     onClick?: () => void;
// }

// ---------------------------------------------------------------------
// 12. Composition through children
// ---------------------------------------------------------------------

interface CardProps {
  readonly title?: string;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ title, children }): ReactElement => {
  return (
    <article>
      {title && <h2>{title}</h2>}
      <div>{children}</div>
    </article>
  );
};

// children allows consumers to provide feature-specific content
// without forcing the shared component to know what that content means.

// ---------------------------------------------------------------------
// 13. Composition reduces conditional APIs
// ---------------------------------------------------------------------

// A shared component with many feature-specific props can become difficult to maintain:
//
// showOrderActions
// showCustomerActions
// showInventoryActions
// showAdminActions
//
// Composition is often more stable:
//
// <Card>
//     <FeatureSpecificContent />
// </Card>
//
// The shared component remains responsible only for its own visual structure.

// ---------------------------------------------------------------------
// 14. Shared layout components
// ---------------------------------------------------------------------

interface StackProps {
  readonly children: ReactNode;
  readonly gap?: number;
}

export const Stack: FC<StackProps> = ({ children, gap = 8 }): ReactElement => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {children}
    </div>
  );
};

// Layout primitives are common shared components because their responsibility
// is generic and independent from a particular business feature.

// ---------------------------------------------------------------------
// 15. Shared components and design tokens
// ---------------------------------------------------------------------

interface SpacingProps {
  readonly children: ReactNode;
  readonly spacing?: "small" | "medium" | "large";
}

const spacingValues: Record<NonNullable<SpacingProps["spacing"]>, number> = {
  small: 4,
  medium: 8,
  large: 16,
};

export const Spacing: FC<SpacingProps> = ({ children, spacing = "medium" }): ReactElement => {
  return <div style={{ padding: spacingValues[spacing] }}>{children}</div>;
};

// Shared components can consume shared design decisions without embedding
// business-specific knowledge.

// ---------------------------------------------------------------------
// 16. Shared components and accessibility
// ---------------------------------------------------------------------

interface AccessibleButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const AccessibleButton: FC<AccessibleButtonProps> = ({ children, disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// Accessibility behavior is a strong candidate for shared ownership because
// the same baseline requirements can apply across many consuming features.

// ---------------------------------------------------------------------
// 17. Shared components should establish accessible semantics
// ---------------------------------------------------------------------

interface LoadingIndicatorProps {
  readonly label?: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ label = "Loading" }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      {label}
    </div>
  );
};

// Shared components can provide consistent semantic behavior across the application.

// ---------------------------------------------------------------------
// 18. Shared state versus shared component
// ---------------------------------------------------------------------

interface AccordionProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Accordion: FC<AccordionProps> = ({ title, children }): ReactElement => {
  return (
    <details>
      <summary>{title}</summary>
      {children}
    </details>
  );
};

// A shared component can own local UI state when that state belongs to the component.
// It does not need to expose every internal implementation detail to consumers.

// ---------------------------------------------------------------------
// 19. Controlled shared components
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
}

export const Toggle: FC<ToggleProps> = ({ checked, onChange, label }): ReactElement => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
};

// A controlled shared component delegates state ownership to its consumer.
// The shared component owns presentation and interaction mechanics.

// ---------------------------------------------------------------------
// 20. Uncontrolled shared components
// ---------------------------------------------------------------------

interface UncontrolledDisclosureProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}

export const UncontrolledDisclosure: FC<UncontrolledDisclosureProps> = ({
  title,
  children,
  defaultOpen = false,
}): ReactElement => {
  return (
    <details open={defaultOpen}>
      <summary>{title}</summary>
      {children}
    </details>
  );
};

// Uncontrolled components can be appropriate when consumers do not need to own
// or observe the component's internal UI state.

// ---------------------------------------------------------------------
// 21. Controlled versus uncontrolled APIs
// ---------------------------------------------------------------------

// Controlled:
//
// <Toggle
//     checked={enabled}
//     onChange={setEnabled}
// />
//
// Consumer owns the state.
//
// Uncontrolled:
//
// <UncontrolledDisclosure
//     defaultOpen
// />
//
// Component owns the interaction state.
//
// A shared library can provide either model when the distinction is intentional.

// ---------------------------------------------------------------------
// 22. Shared callbacks
// ---------------------------------------------------------------------

interface SelectProps {
  readonly value: string;
  readonly options: readonly string[];
  readonly onChange: (value: string) => void;
}

export const Select: FC<SelectProps> = ({ value, options, onChange }): ReactElement => {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// A generic callback such as onChange keeps the shared component independent
// from the business meaning assigned to the selected value.

// ---------------------------------------------------------------------
// 23. Semantic callbacks
// ---------------------------------------------------------------------

interface ConfirmationDialogProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  title,
  children,
  onConfirm,
  onCancel,
}): ReactElement => {
  return (
    <Dialog title={title} onClose={onCancel}>
      {children}
      <Stack gap={8}>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </Dialog>
  );
};

// onConfirm and onCancel express component-level semantics.
// They are still generic enough to be used by many features.

// ---------------------------------------------------------------------
// 24. Avoid business callbacks in generic primitives
// ---------------------------------------------------------------------

// Avoid:
//
// <Button onSubmitOrder={submitOrder} />
//
// in a generic Button.
//
// Prefer:
//
// <Button onClick={submitOrder}>
//     Submit order
// </Button>
//
// The business meaning remains with the feature while the shared component
// handles generic button behavior.

// ---------------------------------------------------------------------
// 25. Shared form primitives
// ---------------------------------------------------------------------

interface FormFieldProps {
  readonly label: string;
  readonly htmlFor: string;
  readonly error?: string;
  readonly children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({ label, htmlFor, error, children }): ReactElement => {
  return (
    <div>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// A form primitive can provide consistent structure and accessibility
// while allowing the feature to decide what input it contains.

// ---------------------------------------------------------------------
// 26. Shared components and domain models
// ---------------------------------------------------------------------

interface PriceDisplayProps {
  readonly amountInCents: number;
  readonly currency?: string;
}

export const PriceDisplay: FC<PriceDisplayProps> = ({ amountInCents, currency = "USD" }): ReactElement => {
  return (
    <span>
      {currency} {(amountInCents / 100).toFixed(2)}
    </span>
  );
};

// A shared component can consume a domain value without owning the domain model.
// It should avoid fetching or mutating that domain data itself.

// ---------------------------------------------------------------------
// 27. Shared components should not fetch feature data
// ---------------------------------------------------------------------

// Avoid:
//
// <ProductCard productId="product-1" />
//
// where ProductCard internally fetches the product.
//
// Prefer:
//
// <ProductCard product={product} />
//
// The caller owns data acquisition.
// The shared component owns presentation.

// ---------------------------------------------------------------------
// 28. Data fetching belongs outside generic UI
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

interface UserRepository {
  readonly findById: (userId: string) => Promise<User | null>;
}

const loadUser = async (repository: UserRepository, userId: string): Promise<User> => {
  const user = await repository.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// The repository and application logic remain outside the shared presentation component.

// ---------------------------------------------------------------------
// 29. Shared components and dependency injection
// ---------------------------------------------------------------------

interface DataTableProps<T> {
  readonly rows: readonly T[];
  readonly renderRow: (row: T) => ReactNode;
}

export const DataTable = <T,>({ rows, renderRow }: DataTableProps<T>): ReactElement => {
  return (
    <div>
      {rows.map((row, index) => (
        <div key={index}>{renderRow(row)}</div>
      ))}
    </div>
  );
};

// Generic render functions allow consumers to provide domain-specific rendering
// without coupling the shared component to a particular model.

// ---------------------------------------------------------------------
// 30. Generic shared components
// ---------------------------------------------------------------------

interface ListProps<T> {
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

// Generic components can provide reusable mechanics without assuming the
// domain type of the consuming feature.

// ---------------------------------------------------------------------
// 31. Shared component customization
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, actions, children }): ReactElement => {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
};

// Composition points such as actions and children allow customization
// without multiplying feature-specific props.

// ---------------------------------------------------------------------
// 32. Avoid boolean-prop explosion
// ---------------------------------------------------------------------

// A shared component can become difficult to understand when its API grows:
//
// compact
// bordered
// elevated
// dense
// showHeader
// showFooter
// showActions
// danger
// warning
//
// Some options may be legitimate, but a growing collection of unrelated flags
// can indicate that multiple visual concepts are being forced into one component.

// ---------------------------------------------------------------------
// 33. Prefer cohesive variants
// ---------------------------------------------------------------------

interface BadgeProps {
  readonly children: ReactNode;
  readonly variant?: "neutral" | "success" | "warning" | "error";
}

export const Badge: FC<BadgeProps> = ({ children, variant = "neutral" }): ReactElement => {
  return <span data-variant={variant}>{children}</span>;
};

// A variant is useful when the alternatives represent one coherent visual concept.

// ---------------------------------------------------------------------
// 34. Shared components and feature composition
// ---------------------------------------------------------------------

interface ProductActionsProps {
  readonly productId: string;
  readonly onAddToCart: (productId: string) => void;
}

export const ProductActions: FC<ProductActionsProps> = ({ productId, onAddToCart }): ReactElement => {
  return <Button onClick={() => onAddToCart(productId)}>Add to cart</Button>;
};

export const ProductFeatureCard: FC<
  ProductCardProps & {
    readonly onAddToCart: (productId: string) => void;
  }
> = ({ product, onAddToCart }): ReactElement => {
  return (
    <Card title={product.name}>
      <PriceDisplay amountInCents={product.priceInCents} />
      <ProductActions productId={product.id} onAddToCart={onAddToCart} />
    </Card>
  );
};

// The shared components provide generic UI primitives.
// The feature component composes them with product-specific behavior.

// ---------------------------------------------------------------------
// 35. Shared components should not own feature workflows
// ---------------------------------------------------------------------

// A shared Button should not:
//
// - submit an order
// - update a product
// - navigate to a feature-specific route
// - write to a feature database
// - decide business permissions
//
// Those responsibilities belong to the consuming application or feature.

// ---------------------------------------------------------------------
// 36. Shared components and permissions
// ---------------------------------------------------------------------

interface PermissionAwareActionProps {
  readonly allowed: boolean;
  readonly children: ReactNode;
  readonly onClick: () => void;
}

export const PermissionAwareAction: FC<PermissionAwareActionProps> = ({
  allowed,
  children,
  onClick,
}): ReactElement | null => {
  if (!allowed) {
    return null;
  }

  return <Button onClick={onClick}>{children}</Button>;
};

// The shared component can respond to a simple presentation-level permission input.
// It should not determine permissions by importing a feature-specific authorization service.

// ---------------------------------------------------------------------
// 37. Shared components and responsive behavior
// ---------------------------------------------------------------------

interface ResponsivePanelProps {
  readonly children: ReactNode;
}

export const ResponsivePanel: FC<ResponsivePanelProps> = ({ children }): ReactElement => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        marginInline: "auto",
      }}
    >
      {children}
    </div>
  );
};

// Generic layout behavior is suitable for shared ownership.
// Feature-specific responsive decisions can remain within feature components.

// ---------------------------------------------------------------------
// 38. Shared components and styling ownership
// ---------------------------------------------------------------------

// A shared component should have a clear styling contract.
//
// It may own:
//
// - structural styles
// - typography rules
// - interaction states
// - accessibility-related visual states
//
// It should avoid embedding assumptions about one feature's layout or workflow.

// ---------------------------------------------------------------------
// 39. Shared components and localization
// ---------------------------------------------------------------------

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, description }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};

// Passing translated strings into a shared component keeps localization ownership
// with the application or feature that knows the appropriate language and context.

// ---------------------------------------------------------------------
// 40. Shared components and formatting
// ---------------------------------------------------------------------

interface DateDisplayProps {
  readonly date: Date;
}

export const DateDisplay: FC<DateDisplayProps> = ({ date }): ReactElement => {
  return <time dateTime={date.toISOString()}>{date.toLocaleDateString()}</time>;
};

// Formatting components can be shared when the formatting contract is stable.
// Locale selection and broader internationalization policy may remain outside the component.

// ---------------------------------------------------------------------
// 41. Shared components and business rules
// ---------------------------------------------------------------------

interface DiscountBadgeProps {
  readonly discountPercentage: number;
}

export const DiscountBadge: FC<DiscountBadgeProps> = ({ discountPercentage }): ReactElement => {
  return <Badge variant="success">{discountPercentage}% off</Badge>;
};

// The component displays a supplied value.
// It should not decide whether a customer qualifies for the discount.
// That decision belongs to the appropriate domain or application layer.

// ---------------------------------------------------------------------
// 42. Shared component contracts
// ---------------------------------------------------------------------

interface ModalFooterProps {
  readonly children: ReactNode;
}

export const ModalFooter: FC<ModalFooterProps> = ({ children }): ReactElement => {
  return <footer>{children}</footer>;
};

// Small shared components should have interfaces that describe exactly what they own.
// Clear contracts make them easier to compose and evolve.

// ---------------------------------------------------------------------
// 43. Shared components and refactoring
// ---------------------------------------------------------------------

// A component can be promoted from feature-local to shared when:
//
// 1. multiple consumers exist
// 2. the responsibility is genuinely common
// 3. the public interface can remain narrow
// 4. feature-specific assumptions can be removed
// 5. ownership can be clearly assigned
//
// Copying a component twice is sometimes preferable to creating an abstraction too early.

// ---------------------------------------------------------------------
// 44. Duplication versus premature abstraction
// ---------------------------------------------------------------------

// Two components may currently look similar but represent different concepts.
//
// Similar implementation does not necessarily mean identical responsibility.
//
// Sharing should follow semantic cohesion, not only visual similarity.

// ---------------------------------------------------------------------
// 45. Shared components and breaking changes
// ---------------------------------------------------------------------

// Because many consumers can depend on a shared component,
// changes to its public API can have a large impact.
//
// Safer evolution often means:
//
// - adding optional capabilities
// - preserving existing semantics
// - introducing explicit variants
// - providing migration paths for breaking changes
// - removing obsolete APIs deliberately

// ---------------------------------------------------------------------
// 46. Shared component versioning
// ---------------------------------------------------------------------

// A shared component library can be versioned independently from consuming features.
//
// Consumers should understand:
//
// - which component version they use
// - which APIs are stable
// - which changes are breaking
// - which dependencies are required
//
// Versioning becomes especially important when multiple applications consume the same library.

// ---------------------------------------------------------------------
// 47. Shared component ownership
// ---------------------------------------------------------------------

// Shared ownership should be explicit.
//
// A shared component typically has:
//
// - a canonical implementation
// - a public API
// - documented behavior
// - tests
// - accessibility expectations
// - a defined ownership model
//
// Without ownership, different teams can make incompatible assumptions about the component.

// ---------------------------------------------------------------------
// 48. Shared component testing
// ---------------------------------------------------------------------

export const ButtonTestExample: FC = (): ReactElement => {
  return (
    <Button
      onClick={() => {
        console.log("Clicked");
      }}
    >
      Save
    </Button>
  );
};

// Shared components should be tested according to their public behavior:
// rendering, interaction, accessibility, states, and API semantics.
//
// Tests should not depend unnecessarily on private implementation details.

// ---------------------------------------------------------------------
// 49. Shared component composition test
// ---------------------------------------------------------------------

export const SharedCompositionExample: FC = (): ReactElement => {
  const products: readonly Product[] = [
    {
      id: "product-1",
      name: "Notebook",
      priceInCents: 1200,
    },
    {
      id: "product-2",
      name: "Pen",
      priceInCents: 500,
    },
  ];

  return (
    <Card title="Products">
      <List
        items={products}
        getKey={(product) => product.id}
        renderItem={(product) => (
          <div>
            <strong>{product.name}</strong>
            <PriceDisplay amountInCents={product.priceInCents} />
          </div>
        )}
      />
    </Card>
  );
};

// The example demonstrates several shared components composed around
// a domain-specific Product model without making those components Product-aware.

// ---------------------------------------------------------------------
// 50. Shared component dependency direction
// ---------------------------------------------------------------------

// A healthy dependency direction is:
//
// Feature
//    ↓
// Shared UI
//
// Shared UI should not depend on:
//
// Feature A
// Feature B
// Feature C
//
// Otherwise the supposedly shared layer becomes coupled to the features it is
// intended to support.

// ---------------------------------------------------------------------
// 51. Shared components and domain dependencies
// ---------------------------------------------------------------------

// Shared UI may consume stable domain-neutral contracts.
// It should avoid importing large domain modules simply to obtain unrelated behavior.
//
// Prefer:
//
// <PriceDisplay amountInCents={price} />
//
// over:
//
// <PriceDisplay product={product} />
//
// when the component only needs the price.

// ---------------------------------------------------------------------
// 52. Shared component API surface
// ---------------------------------------------------------------------

interface SearchInputProps {
  readonly value: string;
  readonly placeholder?: string;
  readonly onChange: (value: string) => void;
  readonly onSubmit?: () => void;
}

export const SearchInput: FC<SearchInputProps> = ({ value, placeholder, onChange, onSubmit }): ReactElement => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      <Button type="submit">Search</Button>
    </form>
  );
};

// The public API describes search-input mechanics.
// It does not define what searching means for a particular feature.

// ---------------------------------------------------------------------
// 53. Shared components and HTML contracts
// ---------------------------------------------------------------------

interface NativeButtonProps {
  readonly children: ReactNode;
  readonly type?: "button" | "submit" | "reset";
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const NativeButton: FC<NativeButtonProps> = ({
  children,
  type = "button",
  disabled = false,
  onClick,
}): ReactElement => {
  return (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// Shared components should preserve the semantics of the underlying HTML elements
// instead of hiding important behavior behind ambiguous abstractions.

// ---------------------------------------------------------------------
// 54. Complete shared-component composition
// ---------------------------------------------------------------------

interface ProductCatalogProps {
  readonly products: readonly Product[];
  readonly onAddToCart: (productId: string) => void;
}

export const ProductCatalog: FC<ProductCatalogProps> = ({ products, onAddToCart }): ReactElement => {
  if (products.length === 0) {
    return <EmptyState title="No products" description="There are no products to display." />;
  }

  return (
    <Stack gap={16}>
      {products.map((product) => (
        <Card key={product.id} title={product.name}>
          <Stack gap={8}>
            <PriceDisplay amountInCents={product.priceInCents} />
            <ProductActions productId={product.id} onAddToCart={onAddToCart} />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export const SharedComponentsExample: FC = (): ReactElement => {
  const products: readonly Product[] = [
    {
      id: "product-1",
      name: "Notebook",
      priceInCents: 1200,
    },
    {
      id: "product-2",
      name: "Pen",
      priceInCents: 500,
    },
  ];

  const handleAddToCart = (productId: string): void => {
    console.log(`Add product ${productId} to cart`);
  };

  return <ProductCatalog products={products} onAddToCart={handleAddToCart} />;
};

// ProductCatalog is feature-specific because it understands Product.
// Card, Stack, PriceDisplay, Button, EmptyState, and ProductActions can be
// shared because their responsibilities remain independently reusable.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Shared components are reusable UI units consumed by multiple parts of an application or multiple applications.
// - A shared component should have a focused responsibility and a stable public interface.
// - Props, callbacks, children, and composition provide explicit component boundaries.
// - Shared components should avoid importing feature-specific state, services, or workflows.
// - Generic UI primitives such as buttons, inputs, layout components, and feedback components are common shared components.
// - A component should become shared because its responsibility is genuinely common, not merely because its implementation looks reusable.
// - Narrow props reduce coupling and make shared components easier to compose and evolve.
// - Composition through children or slots can prevent shared APIs from accumulating feature-specific boolean props.
// - Controlled components let consumers own state, while uncontrolled components can own local interaction state.
// - Generic callbacks communicate component behavior without encoding business meaning.
// - Shared components should not fetch feature data or implement feature-specific business workflows.
// - Domain and application layers should determine business rules while shared UI renders their results.
// - Generic components can use TypeScript generics to remain independent from consuming domain models.
// - Shared components can establish consistent accessibility, semantics, styling, and interaction behavior.
// - Shared component APIs are dependency surfaces, so breaking changes affect every consumer.
// - Shared component ownership, testing, versioning, and compatibility should be explicit.
// - Duplication can be preferable to premature abstraction when two similar components do not represent the same concept.
// - The shared layer should depend downward on stable UI contracts, while feature-specific code composes shared components around its own behavior.

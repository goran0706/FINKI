/**
 * Design System
 * =============
 *
 * A design system is a shared set of visual foundations, reusable UI components,
 * interaction patterns, accessibility rules, and usage conventions that provides
 * a consistent language for building interfaces across an application or product.
 *
 * A design system is more than a component library: it defines shared decisions
 * and constraints while components provide the implementation of those decisions.
 */

import { type FC, type FormEvent, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Design system concept
// ---------------------------------------------------------------------

// A design system connects:
//
// Design decisions
//     ↓
// Design tokens
//     ↓
// Shared components
//     ↓
// Patterns
//     ↓
// Product interfaces
//
// The goal is consistency without forcing every interface
// to become identical.

// ---------------------------------------------------------------------
// 2. Design system foundations
// ---------------------------------------------------------------------

// Common foundations include:
//
// - color
// - typography
// - spacing
// - sizing
// - borders
// - radii
// - elevation
// - motion
// - breakpoints
// - accessibility
//
// These foundations should be expressed consistently across components.

// ---------------------------------------------------------------------
// 3. Design tokens
// ---------------------------------------------------------------------

export const colors = {
  text: "#1f2937",
  textMuted: "#6b7280",
  surface: "#ffffff",
  surfaceMuted: "#f3f4f6",
  border: "#d1d5db",
  primary: "#2563eb",
  primaryContrast: "#ffffff",
  danger: "#dc2626",
  success: "#16a34a",
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
} as const;

export const radii = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  pill: "999px",
} as const;

// Tokens provide shared design decisions.
// Components consume the decisions instead of independently inventing values.

// ---------------------------------------------------------------------
// 4. Typography tokens
// ---------------------------------------------------------------------

export const typography = {
  fontFamily: "system-ui, sans-serif",
  bodySize: "16px",
  bodyLineHeight: 1.5,
  headingLarge: "32px",
  headingMedium: "24px",
  headingSmall: "20px",
} as const;

// Typography tokens create consistency in text hierarchy.

// ---------------------------------------------------------------------
// 5. Component foundations
// ---------------------------------------------------------------------

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly type?: "button" | "submit" | "reset";
  readonly onClick?: () => void;
}

// A shared component API should expose design-system concepts,
// not arbitrary implementation details.

// ---------------------------------------------------------------------
// 6. Shared button component
// ---------------------------------------------------------------------

const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary: colors.primary,
  secondary: colors.surfaceMuted,
  danger: colors.danger,
  ghost: "transparent",
};

const buttonSizeStyles: Record<ButtonSize, string> = {
  small: spacing.sm,
  medium: spacing.md,
  large: spacing.lg,
};

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  onClick,
}): ReactElement => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        background: buttonVariantStyles[variant],
        color: variant === "secondary" || variant === "ghost" ? colors.text : colors.primaryContrast,
        padding: buttonSizeStyles[size],
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
      }}
    >
      {children}
    </button>
  );
};

// Button centralizes a common interaction and its visual rules.

// ---------------------------------------------------------------------
// 7. Design system components versus generic components
// ---------------------------------------------------------------------

// A generic component may solve a technical rendering problem.
//
// A design-system component also carries shared product decisions.
//
// For example:
//
// HTML <button>
//     ↓
// Button
//
// Button defines:
//
// - supported variants
// - supported sizes
// - disabled behavior
// - spacing
// - colors
// - interaction conventions
// - accessibility expectations

// ---------------------------------------------------------------------
// 8. Semantic variants
// ---------------------------------------------------------------------

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly tone?: AlertTone;
}

const alertToneStyles: Record<AlertTone, string> = {
  info: colors.primary,
  success: colors.success,
  warning: "#ca8a04",
  danger: colors.danger,
};

export const Alert: FC<AlertProps> = ({ title, children, tone = "info" }): ReactElement => {
  return (
    <aside
      role="status"
      style={{
        borderLeft: `4px solid ${alertToneStyles[tone]}`,
        padding: spacing.md,
      }}
    >
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
};

// Semantic variants make component APIs express intent.
// "danger" communicates more than an arbitrary color choice.

// ---------------------------------------------------------------------
// 9. Design tokens versus component variants
// ---------------------------------------------------------------------

// Tokens answer:
//
// "Which design value should be used?"
//
// Variants answer:
//
// "Which semantic option should the consumer choose?"
//
// For example:
//
// colors.primary
//     ↓
// Button variant="primary"
//
// The component maps semantic intent to design tokens.

// ---------------------------------------------------------------------
// 10. Surface components
// ---------------------------------------------------------------------

export interface CardProps {
  readonly children: ReactNode;
  readonly title?: string;
}

export const Card: FC<CardProps> = ({ children, title }): ReactElement => {
  return (
    <section
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
        padding: spacing.lg,
      }}
    >
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
};

// Surface components establish shared visual structure.

// ---------------------------------------------------------------------
// 11. Layout primitives
// ---------------------------------------------------------------------

export interface StackProps {
  readonly children: ReactNode;
  readonly gap?: keyof typeof spacing;
}

export const Stack: FC<StackProps> = ({ children, gap = "md" }): ReactElement => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[gap],
      }}
    >
      {children}
    </div>
  );
};

// Layout primitives encode common structural decisions
// without knowing anything about a particular feature.

// ---------------------------------------------------------------------
// 12. Inline layout primitive
// ---------------------------------------------------------------------

export interface InlineProps {
  readonly children: ReactNode;
  readonly gap?: keyof typeof spacing;
  readonly align?: "start" | "center" | "end";
}

export const Inline: FC<InlineProps> = ({ children, gap = "md", align = "center" }): ReactElement => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center",
        gap: spacing[gap],
      }}
    >
      {children}
    </div>
  );
};

// Shared layout primitives help interfaces use the same spacing language.

// ---------------------------------------------------------------------
// 13. Form field foundation
// ---------------------------------------------------------------------

export interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly children: ReactNode;
  readonly description?: string;
  readonly error?: string;
}

export const Field: FC<FieldProps> = ({ id, label, children, description, error }): ReactElement => {
  const descriptionId = `${id}-description`;

  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>

      {children}

      {description && <div id={descriptionId}>{description}</div>}

      {error && (
        <div id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

// Form foundations centralize recurring accessibility and layout conventions.

// ---------------------------------------------------------------------
// 14. Input component
// ---------------------------------------------------------------------

export interface InputProps {
  readonly id: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly invalid?: boolean;
  readonly onChange: (value: string) => void;
}

export const Input: FC<InputProps> = ({
  id,
  value,
  placeholder,
  disabled = false,
  invalid = false,
  onChange,
}): ReactElement => {
  return (
    <input
      id={id}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

// The shared Input component standardizes behavior and accessibility attributes.

// ---------------------------------------------------------------------
// 15. Form field composition
// ---------------------------------------------------------------------

export interface TextFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly description?: string;
  readonly error?: string;
  readonly onChange: (value: string) => void;
}

export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  description,
  error,
  onChange,
}): ReactElement => {
  return (
    <Field id={id} label={label} description={description} error={error}>
      <Input id={id} value={value} placeholder={placeholder} invalid={Boolean(error)} onChange={onChange} />
    </Field>
  );
};

// A higher-level field composes lower-level design-system primitives.

// ---------------------------------------------------------------------
// 16. Accessibility as a system concern
// ---------------------------------------------------------------------

// Accessibility should not depend entirely on individual feature teams.
//
// A design system can establish conventions for:
//
// - semantic HTML
// - keyboard interaction
// - focus behavior
// - labels
// - descriptions
// - error messaging
// - disabled states
// - ARIA attributes
// - color-independent status communication
//
// Components still need context-specific accessibility decisions.

// ---------------------------------------------------------------------
// 17. Native semantics
// ---------------------------------------------------------------------

export interface LinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly external?: boolean;
}

export const Link: FC<LinkProps> = ({ href, children, external = false }): ReactElement => {
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children}
    </a>
  );
};

// Prefer native elements when their semantics match the interaction.
// A design system should not replace semantic HTML with generic elements unnecessarily.

// ---------------------------------------------------------------------
// 18. Consistent focus behavior
// ---------------------------------------------------------------------

// Interactive design-system components should establish consistent focus behavior.
//
// Consumers should not need to recreate focus styling independently for every button,
// input, link, or menu item.

// ---------------------------------------------------------------------
// 19. State conventions
// ---------------------------------------------------------------------

export type ComponentState = "default" | "hover" | "focus" | "active" | "disabled" | "loading" | "error";

// A design system can define the states that components must support.
// The exact states depend on the component's interaction model.

// ---------------------------------------------------------------------
// 20. Loading state
// ---------------------------------------------------------------------

export interface LoadingButtonProps {
  readonly children: ReactNode;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const LoadingButton: FC<LoadingButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  onClick,
}): ReactElement => {
  const isDisabled = disabled || loading;

  return (
    <Button disabled={isDisabled} onClick={onClick}>
      {loading ? "Loading..." : children}
    </Button>
  );
};

// Shared loading behavior prevents every feature from inventing its own button convention.

// ---------------------------------------------------------------------
// 21. Disabled versus loading
// ---------------------------------------------------------------------

// Disabled means the action is currently unavailable.
//
// Loading means an operation is in progress.
//
// A design system should distinguish these states when their behavior differs.
//
// Loading may also need:
//
// - an accessible status
// - prevention of duplicate submission
// - preserved button dimensions
// - appropriate focus behavior

// ---------------------------------------------------------------------
// 22. Status component
// ---------------------------------------------------------------------

export interface StatusProps {
  readonly tone: AlertTone;
  readonly children: ReactNode;
}

export const Status: FC<StatusProps> = ({ tone, children }): ReactElement => {
  return (
    <span
      role="status"
      style={{
        color: alertToneStyles[tone],
      }}
    >
      {children}
    </span>
  );
};

// Shared status semantics keep feedback behavior consistent across interfaces.

// ---------------------------------------------------------------------
// 23. Design system and responsive behavior
// ---------------------------------------------------------------------

export const breakpoints = {
  small: "640px",
  medium: "768px",
  large: "1024px",
  extraLarge: "1280px",
} as const;

// Responsive decisions can be centralized as design-system foundations.
// Components should use the same breakpoint vocabulary rather than inventing
// unrelated values.

// ---------------------------------------------------------------------
// 24. Spacing consistency
// ---------------------------------------------------------------------

export const Section: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return (
    <section
      style={{
        marginBlock: spacing.xl,
      }}
    >
      {children}
    </section>
  );
};

// Shared spacing tokens reduce arbitrary one-off values.

// ---------------------------------------------------------------------
// 25. Avoid arbitrary visual values
// ---------------------------------------------------------------------

// Prefer:
//
// padding: spacing.md
//
// over:
//
// padding: "17px"
//
// when the value represents a recurring design decision.
//
// Arbitrary values are sometimes necessary,
// but recurring values should usually become tokens.

// ---------------------------------------------------------------------
// 26. Component composition
// ---------------------------------------------------------------------

export interface DialogProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
}

export const Dialog: FC<DialogProps> = ({ title, children, actions }): ReactElement => {
  return (
    <div role="dialog" aria-modal="true">
      <div>
        <h2>{title}</h2>
        <div>{children}</div>
        {actions && <Inline>{actions}</Inline>}
      </div>
    </div>
  );
};

// Composition lets consumers provide feature-specific content
// while the design system owns the shared dialog structure.

// ---------------------------------------------------------------------
// 27. Avoid feature-specific design-system components
// ---------------------------------------------------------------------

// A design-system component should generally solve a recurring interface problem.
//
// Avoid turning a feature-specific workflow into a shared component:
//
// <CheckoutDiscountApprovalPanel />
//
// when the behavior is meaningful only inside one feature.
//
// Instead, compose shared primitives:
//
// <Card>
//     <TextField />
//     <Button />
// </Card>

// ---------------------------------------------------------------------
// 28. Shared component versus feature component
// ---------------------------------------------------------------------

// Shared component:
//
// Button
// Input
// Dialog
// Card
// Stack
//
// Feature component:
//
// CheckoutSummary
// ProductApprovalPanel
// AccountRecoveryForm
//
// The distinction is based on responsibility and reuse,
// not simply on where the file is stored.

// ---------------------------------------------------------------------
// 29. Avoid premature abstraction
// ---------------------------------------------------------------------

export interface SimpleNoticeProps {
  readonly children: ReactNode;
}

export const SimpleNotice: FC<SimpleNoticeProps> = ({ children }): ReactElement => {
  return (
    <div
      role="note"
      style={{
        padding: spacing.md,
      }}
    >
      {children}
    </div>
  );
};

// A small component does not automatically need a large abstraction system.
// Extract when a stable pattern or shared decision actually exists.

// ---------------------------------------------------------------------
// 30. Component variants
// ---------------------------------------------------------------------

export type BadgeTone = "neutral" | "success" | "warning" | "danger";

export interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
}

export const Badge: FC<BadgeProps> = ({ children, tone = "neutral" }): ReactElement => {
  const toneColor =
    tone === "success"
      ? colors.success
      : tone === "warning"
        ? "#ca8a04"
        : tone === "danger"
          ? colors.danger
          : colors.textMuted;

  return (
    <span
      style={{
        color: toneColor,
        borderRadius: radii.pill,
        padding: `2px ${spacing.sm}`,
      }}
    >
      {children}
    </span>
  );
};

// Variants should represent meaningful states or intentions,
// not an uncontrolled collection of arbitrary styling options.

// ---------------------------------------------------------------------
// 31. Avoid boolean prop explosion
// ---------------------------------------------------------------------

// Avoid:
//
// <Button
//     primary
//     large
//     rounded
//     outlined
//     loading
//     danger
// />
//
// when several booleans can create contradictory combinations.
//
// Prefer semantic variants and explicitly modeled state:
//
// <LoadingButton
//     loading
//     variant="danger"
// />

// ---------------------------------------------------------------------
// 32. Component API constraints
// ---------------------------------------------------------------------

// A design system should deliberately constrain combinations.
//
// For example:
//
// variant="primary"
// size="medium"
//
// can be valid combinations.
//
// But arbitrary combinations such as:
//
// variant="danger"
// appearance="minimal"
// emphasis="maximum"
// borderStyle="dashed"
// cornerStyle="soft"
//
// may create an API that is difficult to reason about.

// ---------------------------------------------------------------------
// 33. Design tokens and constraints
// ---------------------------------------------------------------------

export type SpacingToken = keyof typeof spacing;

export interface DividerProps {
  readonly spacingBefore?: SpacingToken;
  readonly spacingAfter?: SpacingToken;
}

export const Divider: FC<DividerProps> = ({ spacingBefore = "md", spacingAfter = "md" }): ReactElement => {
  return (
    <hr
      style={{
        marginBlockStart: spacing[spacingBefore],
        marginBlockEnd: spacing[spacingAfter],
      }}
    />
  );
};

// The component accepts known design tokens rather than arbitrary values.
// This makes the design system easier to keep consistent.

// ---------------------------------------------------------------------
// 34. Theming concept
// ---------------------------------------------------------------------

export interface Theme {
  readonly colors: typeof colors;
  readonly spacing: typeof spacing;
  readonly radii: typeof radii;
  readonly typography: typeof typography;
}

export const defaultTheme: Theme = {
  colors,
  spacing,
  radii,
  typography,
};

// A theme can group design decisions into one coherent configuration.

// ---------------------------------------------------------------------
// 35. Theme-aware components
// ---------------------------------------------------------------------

export interface ThemedTextProps {
  readonly children: ReactNode;
  readonly muted?: boolean;
}

export const ThemedText: FC<ThemedTextProps> = ({ children, muted = false }): ReactElement => {
  const color = muted ? colors.textMuted : colors.text;

  return (
    <span
      style={{
        color,
        fontFamily: typography.fontFamily,
        fontSize: typography.bodySize,
        lineHeight: typography.bodyLineHeight,
      }}
    >
      {children}
    </span>
  );
};

// The component consumes design-system foundations instead of hard-coding
// unrelated values in each usage site.

// ---------------------------------------------------------------------
// 36. Theme versus component customization
// ---------------------------------------------------------------------

// Theme-level customization:
//
// colors
// spacing
// typography
//
// Component-level customization:
//
// variant
// size
// state
//
// Consumer content:
//
// children
//
// These layers should remain conceptually distinct.

// ---------------------------------------------------------------------
// 37. Design system and localization
// ---------------------------------------------------------------------

// A design system should avoid assuming:
//
// - a specific language
// - fixed text widths
// - left-to-right layout only
// - one date format
// - one number format
//
// Components should provide enough flexibility for localized content
// without embedding product-specific translations.

// ---------------------------------------------------------------------
// 38. Design system and content
// ---------------------------------------------------------------------

export interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, description, action }): ReactElement => {
  return (
    <Card title={title}>
      {description && <ThemedText muted>{description}</ThemedText>}

      {action && (
        <div
          style={{
            marginTop: spacing.md,
          }}
        >
          {action}
        </div>
      )}
    </Card>
  );
};

// The component defines structure and behavior,
// while consumers provide localized and feature-specific content.

// ---------------------------------------------------------------------
// 39. Design system and data formatting
// ---------------------------------------------------------------------

export const formatCurrency = (amountInCents: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountInCents / 100);
};

// Formatting helpers can be shared when the formatting decision
// is genuinely part of the product's common language.

// ---------------------------------------------------------------------
// 40. Design system and business rules
// ---------------------------------------------------------------------

// A design system should generally not decide:
//
// - whether a product is purchasable
// - whether an account is eligible
// - whether a discount is valid
// - whether a user has permission
//
// Those are domain or feature decisions.
//
// The design system can provide the UI primitives used to represent those decisions.

// ---------------------------------------------------------------------
// 41. Business rule versus presentation state
// ---------------------------------------------------------------------

export interface ApprovalBadgeProps {
  readonly approved: boolean;
}

export const ApprovalBadge: FC<ApprovalBadgeProps> = ({ approved }): ReactElement => {
  return <Badge tone={approved ? "success" : "warning"}>{approved ? "Approved" : "Pending"}</Badge>;
};

// The business decision belongs to the caller.
// The design system provides the visual representation.

// ---------------------------------------------------------------------
// 42. Design system and accessibility contracts
// ---------------------------------------------------------------------

export interface IconButtonProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const IconButton: FC<IconButtonProps> = ({ label, children, onClick }): ReactElement => {
  return (
    <button type="button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
};

// Icon-only controls require an accessible name.
// A design system can encode this requirement directly into the API.

// ---------------------------------------------------------------------
// 43. Accessibility-oriented API design
// ---------------------------------------------------------------------

// An API can make accessible usage easier by requiring:
//
// label
// title
// description
// input association
// semantic role
//
// Good component APIs guide consumers toward correct usage
// instead of leaving every accessibility detail optional.

// ---------------------------------------------------------------------
// 44. Design system and keyboard behavior
// ---------------------------------------------------------------------

// Interactive components should follow predictable keyboard conventions.
//
// Examples:
//
// button → Enter / Space
// link   → Enter
// input  → native text editing behavior
//
// Custom interactive widgets require additional keyboard behavior
// appropriate to their interaction pattern.

// ---------------------------------------------------------------------
// 45. Design system and native controls
// ---------------------------------------------------------------------

// Prefer native controls when possible:
//
// <button>
// <input>
// <select>
// <textarea>
// <a>
//
// Native semantics provide built-in behavior that custom elements would
// otherwise need to reproduce.

// ---------------------------------------------------------------------
// 46. Design system and motion
// ---------------------------------------------------------------------

export const motion = {
  durationFast: "120ms",
  durationNormal: "200ms",
  durationSlow: "300ms",
} as const;

// Motion can be standardized as another design foundation.
//
// Components should also respect user preferences such as reduced motion
// when implementing animated behavior.

// ---------------------------------------------------------------------
// 47. Design system and visual consistency
// ---------------------------------------------------------------------

// Consistency means related components should share:
//
// - spacing scale
// - typography hierarchy
// - color semantics
// - interaction states
// - border treatment
// - focus treatment
// - accessibility conventions
//
// Consistency does not mean every component has identical structure.

// ---------------------------------------------------------------------
// 48. Design system and flexibility
// ---------------------------------------------------------------------

export interface SectionHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, description, actions }): ReactElement => {
  return (
    <header>
      <Inline align="start">
        <div>
          <h2>{title}</h2>

          {description && <ThemedText muted>{description}</ThemedText>}
        </div>

        {actions && <div>{actions}</div>}
      </Inline>
    </header>
  );
};

// A good design system constrains visual decisions while still allowing
// composition and content flexibility.

// ---------------------------------------------------------------------
// 49. Design system and composition over configuration
// ---------------------------------------------------------------------

// Prefer:
//
// <Dialog
//     title="Delete item"
//     actions={<Button>Delete</Button>}
// >
//     ...
// </Dialog>
//
// over a component with dozens of configuration props:
//
// <Dialog
//     title="..."
//     showHeader
//     showFooter
//     footerAlignment="right"
//     bodySpacing="large"
//     ...
// />
//
// Composition often produces a smaller and more expressive API.

// ---------------------------------------------------------------------
// 50. Design system and feature composition
// ---------------------------------------------------------------------

export const DeleteConfirmation: FC<{
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}> = ({ onConfirm, onCancel }): ReactElement => {
  return (
    <Dialog
      title="Delete item"
      actions={
        <Inline>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </Inline>
      }
    >
      <p>This action cannot be undone.</p>
    </Dialog>
  );
};

// The feature owns the workflow.
// The design system owns the shared dialog and button primitives.

// ---------------------------------------------------------------------
// 51. Design system ownership
// ---------------------------------------------------------------------

// A design system usually needs explicit ownership for:
//
// - tokens
// - component APIs
// - accessibility standards
// - visual consistency
// - documentation
// - testing
// - release management
//
// Without ownership, shared components tend to accumulate inconsistent behavior.

// ---------------------------------------------------------------------
// 52. Design system documentation
// ---------------------------------------------------------------------

// Documentation should explain:
//
// - when to use a component
// - when not to use it
// - supported variants
// - accessibility requirements
// - interaction behavior
// - composition patterns
// - content expectations
//
// API documentation alone does not explain design intent.

// ---------------------------------------------------------------------
// 53. Usage guidance
// ---------------------------------------------------------------------

export const DesignSystemUsageExample: FC = (): ReactElement => {
  return (
    <Stack gap="lg">
      <SectionHeader title="Account" description="Manage account information." actions={<Button>Save</Button>} />

      <Card title="Profile">
        <Stack>
          <TextField id="name" label="Name" value="John Doe" onChange={() => undefined} />

          <TextField id="email" label="Email" value="john@example.com" onChange={() => undefined} />
        </Stack>
      </Card>
    </Stack>
  );
};

// A design-system usage example demonstrates composition,
// not just isolated component rendering.

// ---------------------------------------------------------------------
// 54. Design system testing
// ---------------------------------------------------------------------

// Shared components deserve strong tests because one defect can affect
// many consumers.
//
// Useful tests include:
//
// - rendering
// - keyboard interaction
// - focus behavior
// - disabled behavior
// - loading behavior
// - accessible names
// - labels and descriptions
// - variant semantics
// - callback behavior

// ---------------------------------------------------------------------
// 55. Design system and visual testing
// ---------------------------------------------------------------------

// Visual regression testing can help detect unintended changes
// to shared components.
//
// This is particularly useful for:
//
// - typography
// - spacing
// - color
// - responsive layouts
// - component states
// - interaction states

// ---------------------------------------------------------------------
// 56. Design system and API stability
// ---------------------------------------------------------------------

// Shared components often have many consumers.
//
// Therefore:
//
// changing Button
//     ↓
// potentially changes many features
//
// A design system should treat component APIs as stable contracts,
// not as implementation details that can change casually.

// ---------------------------------------------------------------------
// 57. Breaking component changes
// ---------------------------------------------------------------------

// Potentially breaking changes include:
//
// - removing a prop
// - renaming a prop
// - changing a prop's meaning
// - removing a variant
// - changing keyboard behavior
// - changing focus behavior
// - changing default styling
// - changing rendered semantics
//
// Visual and behavioral changes can be breaking even when TypeScript still compiles.

// ---------------------------------------------------------------------
// 58. Deprecating design-system APIs
// ---------------------------------------------------------------------

/**
 * @deprecated Use `LoadingButton` when an explicit loading state is required.
 */
export const AsyncButton: FC<LoadingButtonProps> = (props): ReactElement => {
  return <LoadingButton {...props} />;
};

// Deprecation provides consumers with a migration path
// while allowing the design system to evolve.

// ---------------------------------------------------------------------
// 59. Design system versioning
// ---------------------------------------------------------------------

// A shared design system should have an explicit strategy for:
//
// - releases
// - breaking changes
// - deprecations
// - migration guidance
// - compatibility
//
// The larger the consumer base, the more important predictable evolution becomes.

// ---------------------------------------------------------------------
// 60. Design system and package boundaries
// ---------------------------------------------------------------------

// A design system may be packaged independently:
//
// design-system/
//     tokens
//     components
//     accessibility utilities
//     documentation
//
// Product features consume the public design-system API.
//
// The design system should not depend on feature-specific application logic.

// ---------------------------------------------------------------------
// 61. Design system dependency direction
// ---------------------------------------------------------------------

// Prefer:
//
// Application features
//        ↓
// Design system
//        ↓
// React / platform
//
// Avoid:
//
// Design system
//        ↓
// Application feature
//
// A shared design system should not require knowledge of a specific feature.

// ---------------------------------------------------------------------
// 62. Design system and domain independence
// ---------------------------------------------------------------------

// The design system can know:
//
// Button
// Dialog
// Input
// Card
// Stack
// Alert
//
// It generally should not know:
//
// OrderApproval
// CustomerEligibility
// ProductPurchasePolicy
//
// Domain concepts belong to higher-level application layers.

// ---------------------------------------------------------------------
// 63. Design system and domain data
// ---------------------------------------------------------------------

export interface ProductSummaryCardProps {
  readonly name: string;
  readonly price: string;
  readonly action?: ReactNode;
}

export const ProductSummaryCard: FC<ProductSummaryCardProps> = ({ name, price, action }): ReactElement => {
  return (
    <Card title={name}>
      <Stack>
        <ThemedText>{price}</ThemedText>

        {action}
      </Stack>
    </Card>
  );
};

// The component accepts presentation-oriented data.
// It does not need to know how product pricing or eligibility is calculated.

// ---------------------------------------------------------------------
// 64. Design system and data ownership
// ---------------------------------------------------------------------

// The design system should generally render data supplied by consumers.
//
// It should not automatically:
//
// - fetch application data
// - access a product database
// - decide business permissions
// - submit domain workflows
//
// Those responsibilities belong to application or domain layers.

// ---------------------------------------------------------------------
// 65. Design system and infrastructure independence
// ---------------------------------------------------------------------

// A design-system Button should not know about:
//
// HTTP
// databases
// routing libraries
// application stores
// product repositories
//
// It should receive the information it needs through its public API.

// ---------------------------------------------------------------------
// 66. Design system and dependency injection
// ---------------------------------------------------------------------

export interface SaveButtonProps {
  readonly onSave: () => void;
  readonly disabled?: boolean;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled = false }): ReactElement => {
  return (
    <Button disabled={disabled} onClick={onSave}>
      Save
    </Button>
  );
};

// The component receives behavior through a callback.
// It does not need to know which service performs the save.

// ---------------------------------------------------------------------
// 67. Design system and application state
// ---------------------------------------------------------------------

// Avoid embedding a global application store inside a primitive component:
//
// Button
//     ✕ reads application store
//     ✕ dispatches feature-specific actions
//
// Instead:
//
// Feature
//     ↓
// SaveButton
//     ↓
// onSave()
//     ↓
// Feature state / application service

// ---------------------------------------------------------------------
// 68. Design system and context
// ---------------------------------------------------------------------

// Context can be appropriate for genuinely cross-cutting design-system concerns:
//
// - theme
// - direction
// - locale-related UI configuration
// - accessibility configuration
//
// Context should not become a hidden dependency for ordinary component behavior.

// ---------------------------------------------------------------------
// 69. Design system and theming boundary
// ---------------------------------------------------------------------

export interface ThemeProviderProps {
  readonly theme: Theme;
  readonly children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }): ReactElement => {
  return (
    <div
      data-theme="custom"
      style={{
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {children}
    </div>
  );
};

// A real implementation could use React context.
// The important architectural point is that theme configuration
// remains a design-system concern rather than a feature concern.

// ---------------------------------------------------------------------
// 70. Design system and multiple themes
// ---------------------------------------------------------------------

export const highContrastTheme: Theme = {
  colors: {
    ...colors,
    text: "#000000",
    surface: "#ffffff",
    border: "#000000",
  },
  spacing,
  radii,
  typography,
};

// A design system can support multiple themes when there is a genuine requirement.
// Theme variation should remain based on the same semantic design language.

// ---------------------------------------------------------------------
// 71. Design system and semantic color
// ---------------------------------------------------------------------

// Prefer semantic roles:
//
// primary
// danger
// success
// textMuted
// surface
//
// over exposing only raw palette names:
//
// blue500
// red600
// gray400
//
// Semantic names communicate intended use and make theme changes easier.

// ---------------------------------------------------------------------
// 72. Design system and dark mode
// ---------------------------------------------------------------------

export const darkTheme: Theme = {
  colors: {
    ...colors,
    text: "#f9fafb",
    textMuted: "#d1d5db",
    surface: "#111827",
    surfaceMuted: "#1f2937",
    border: "#4b5563",
  },
  spacing,
  radii,
  typography,
};

// A dark theme can change underlying values while preserving
// the semantic token names consumed by components.

// ---------------------------------------------------------------------
// 73. Design system and consistency boundaries
// ---------------------------------------------------------------------

// Not every application concern belongs in the design system.
//
// Design system:
//
// visual language
// reusable UI
// accessibility conventions
// interaction primitives
//
// Application:
//
// workflows
// domain rules
// feature state
// data fetching
// permissions
//
// Keeping these boundaries clear prevents the design system from becoming
// a second application layer.

// ---------------------------------------------------------------------
// 74. Complete design-system composition
// ---------------------------------------------------------------------

export interface ProfileCardProps {
  readonly name: string;
  readonly email: string;
  readonly onEdit: () => void;
}

export const ProfileCard: FC<ProfileCardProps> = ({ name, email, onEdit }): ReactElement => {
  return (
    <Card title="Profile">
      <Stack>
        <ThemedText>{name}</ThemedText>

        <ThemedText muted>{email}</ThemedText>

        <Inline>
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

// The feature-specific ProfileCard composes design-system primitives.
// The design system itself does not need to know what a profile means.

// ---------------------------------------------------------------------
// 75. Complete form composition
// ---------------------------------------------------------------------

export interface AccountFormProps {
  readonly name: string;
  readonly email: string;
  readonly onNameChange: (value: string) => void;
  readonly onEmailChange: (value: string) => void;
  readonly onSubmit: () => void;
}

export const AccountForm: FC<AccountFormProps> = ({
  name,
  email,
  onNameChange,
  onEmailChange,
  onSubmit,
}): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <TextField id="name" label="Name" value={name} onChange={onNameChange} />

        <TextField id="email" label="Email" value={email} onChange={onEmailChange} />

        <Button type="submit">Save</Button>
      </Stack>
    </form>
  );
};

// The form owns workflow behavior.
// TextField, Input, Button, and Stack provide shared UI behavior.

// ---------------------------------------------------------------------
// 76. Complete design-system application
// ---------------------------------------------------------------------

export const DesignSystemApplication: FC = (): ReactElement => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Stack gap="xl">
        <SectionHeader title="Account" description="Manage your account details." />

        <AccountForm
          name="John Doe"
          email="john@example.com"
          onNameChange={() => undefined}
          onEmailChange={() => undefined}
          onSubmit={() => undefined}
        />

        <ProfileCard name="John Doe" email="john@example.com" onEdit={() => undefined} />

        <Alert title="Saved" tone="success">
          Your changes have been saved.
        </Alert>
      </Stack>
    </ThemeProvider>
  );
};

// This composition demonstrates the architectural relationship:
//
// Design foundations
//        ↓
// Tokens
//        ↓
// Primitives
//        ↓
// Shared components
//        ↓
// Feature components
//        ↓
// Application workflows

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A design system is a shared language of design decisions, components, interaction patterns, and accessibility conventions.
// - A design system is broader than a component library because it also defines foundations, constraints, and usage guidance.
// - Design tokens centralize recurring decisions such as color, spacing, typography, radii, and motion.
// - Semantic tokens communicate intended meaning more effectively than raw palette values.
// - Shared components translate design-system decisions into reusable implementation contracts.
// - Component variants should represent meaningful semantic states rather than arbitrary combinations of styling options.
// - Good component APIs constrain invalid combinations while preserving useful composition and flexibility.
// - Accessibility should be treated as a system concern and reinforced through component APIs, semantic HTML, and interaction conventions.
// - Native HTML controls should be preferred when their built-in semantics match the required interaction.
// - Shared components should own reusable UI behavior, while feature components should own feature-specific workflows and domain meaning.
// - The design system should not contain application-specific business rules, data fetching, domain policies, or infrastructure dependencies.
// - Composition allows feature-specific interfaces to reuse design-system primitives without making the design system aware of those features.
// - A design system should avoid premature abstractions and should extract patterns when stable shared decisions actually exist.
// - Loading, disabled, focus, error, and other interaction states should be modeled consistently across shared components.
// - Themes can change underlying design values while preserving stable semantic tokens and component contracts.
// - Responsive behavior, localization, reduced motion, and accessibility should be considered as part of the shared design language.
// - Public component APIs include props, defaults, callbacks, semantics, accessibility behavior, and observable interaction behavior.
// - Shared components require strong unit, accessibility, interaction, and visual regression testing because one change can affect many consumers.
// - Design-system APIs should be treated as stable contracts and evolved through deliberate versioning, deprecation, and migration strategies.
// - The dependency direction should generally flow from application features into the design system, not from the design system into feature-specific application logic.
// - A well-designed system balances consistency and constraint with composition and flexibility.
// - The architectural flow is design foundations → tokens → primitives → shared components → feature components → application workflows.

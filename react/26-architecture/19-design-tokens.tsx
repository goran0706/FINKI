/**
 * Design Tokens
 * =============
 *
 * Design tokens are named values that represent shared design decisions such as colors,
 * spacing, typography, sizing, borders, shadows, motion, and responsive breakpoints.
 *
 * Tokens provide a common vocabulary between design decisions and UI implementation,
 * allowing components to consume semantic values instead of independently defining
 * arbitrary visual values.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Design token concept
// ---------------------------------------------------------------------

// A raw value:
//
// "#2563eb"
//
// is an implementation detail.
//
// A token:
//
// colors.actionPrimary
//
// gives that value a name and communicates its intended purpose.
//
// Design tokens therefore create a layer between design decisions
// and the components that consume those decisions.

// ---------------------------------------------------------------------
// 2. Token categories
// ---------------------------------------------------------------------

// Common token categories include:
//
// - color
// - spacing
// - typography
// - sizing
// - radius
// - border
// - shadow
// - opacity
// - z-index
// - motion
// - breakpoint
//
// A design system does not need every category.
// Tokens should exist where values represent recurring design decisions.

// ---------------------------------------------------------------------
// 3. Primitive tokens
// ---------------------------------------------------------------------

// Primitive tokens represent underlying values.
//
// They are often useful as building blocks for semantic tokens.
//
// Examples:
//
// blue500
// gray100
// space4
// radiusMedium
//
// Primitive tokens should not automatically become the public vocabulary
// consumed directly by every application component.

export const primitiveColors = {
  blue500: "#2563eb",
  blue600: "#1d4ed8",
  green500: "#16a34a",
  red500: "#dc2626",
  yellow500: "#ca8a04",
  gray0: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray300: "#d1d5db",
  gray500: "#6b7280",
  gray700: "#374151",
  gray900: "#111827",
} as const;

// Primitive tokens describe available values.
// They do not necessarily describe where those values should be used.

// ---------------------------------------------------------------------
// 4. Semantic tokens
// ---------------------------------------------------------------------

export const semanticColors = {
  textPrimary: primitiveColors.gray900,
  textSecondary: primitiveColors.gray500,
  surfaceDefault: primitiveColors.gray0,
  surfaceMuted: primitiveColors.gray50,
  borderDefault: primitiveColors.gray300,
  actionPrimary: primitiveColors.blue500,
  actionPrimaryHover: primitiveColors.blue600,
  statusSuccess: primitiveColors.green500,
  statusWarning: primitiveColors.yellow500,
  statusDanger: primitiveColors.red500,
} as const;

// Semantic tokens describe purpose rather than palette position.
//
// "actionPrimary" communicates intent.
// "blue500" only communicates the underlying color value.

// ---------------------------------------------------------------------
// 5. Primitive versus semantic tokens
// ---------------------------------------------------------------------

// Primitive:
//
// primitiveColors.blue500
//
// Semantic:
//
// semanticColors.actionPrimary
//
// A component should generally consume the semantic token:
//
// background: semanticColors.actionPrimary
//
// rather than:
//
// background: primitiveColors.blue500
//
// This allows the underlying color to change without changing
// the component's conceptual contract.

// ---------------------------------------------------------------------
// 6. Spacing tokens
// ---------------------------------------------------------------------

export const spacingTokens = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
} as const;

// Spacing tokens establish a shared spacing scale.

// ---------------------------------------------------------------------
// 7. Spacing scale
// ---------------------------------------------------------------------

export type SpacingToken = keyof typeof spacingTokens;

export interface SpacingExampleProps {
  readonly children: ReactNode;
  readonly gap?: SpacingToken;
}

export const SpacingExample: FC<SpacingExampleProps> = ({ children, gap = "md" }): ReactElement => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens[gap],
      }}
    >
      {children}
    </div>
  );
};

// Consumers select from the shared spacing vocabulary
// instead of introducing arbitrary spacing values.

// ---------------------------------------------------------------------
// 8. Typography tokens
// ---------------------------------------------------------------------

export const typographyTokens = {
  fontFamily: "system-ui, sans-serif",
  fontSizeBody: "16px",
  fontSizeSmall: "14px",
  fontSizeLarge: "18px",
  fontSizeHeadingSmall: "20px",
  fontSizeHeadingMedium: "24px",
  fontSizeHeadingLarge: "32px",
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.7,
} as const;

// Typography tokens define the shared typographic vocabulary.

// ---------------------------------------------------------------------
// 9. Typography roles
// ---------------------------------------------------------------------

export const typographyRoles = {
  body: {
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSizeBody,
    fontWeight: typographyTokens.fontWeightRegular,
    lineHeight: typographyTokens.lineHeightNormal,
  },
  bodySmall: {
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSizeSmall,
    fontWeight: typographyTokens.fontWeightRegular,
    lineHeight: typographyTokens.lineHeightNormal,
  },
  heading: {
    fontFamily: typographyTokens.fontFamily,
    fontSize: typographyTokens.fontSizeHeadingLarge,
    fontWeight: typographyTokens.fontWeightBold,
    lineHeight: typographyTokens.lineHeightTight,
  },
} as const;

// Primitive typography tokens provide values.
// Typography roles combine those values into reusable semantic styles.

// ---------------------------------------------------------------------
// 10. Border tokens
// ---------------------------------------------------------------------

export const borderTokens = {
  widthThin: "1px",
  widthMedium: "2px",
  styleDefault: "solid",
  colorDefault: semanticColors.borderDefault,
} as const;

// Border tokens centralize recurring border decisions.

// ---------------------------------------------------------------------
// 11. Radius tokens
// ---------------------------------------------------------------------

export const radiusTokens = {
  none: "0",
  small: "4px",
  medium: "8px",
  large: "12px",
  pill: "999px",
} as const;

// Radius tokens establish a shared vocabulary for corner treatment.

// ---------------------------------------------------------------------
// 12. Shadow tokens
// ---------------------------------------------------------------------

export const shadowTokens = {
  none: "none",
  small: "0 1px 2px rgba(0, 0, 0, 0.08)",
  medium: "0 4px 8px rgba(0, 0, 0, 0.12)",
  large: "0 12px 24px rgba(0, 0, 0, 0.16)",
} as const;

// Shadows can be tokenized so elevation remains consistent.

// ---------------------------------------------------------------------
// 13. Opacity tokens
// ---------------------------------------------------------------------

export const opacityTokens = {
  disabled: 0.5,
  muted: 0.7,
  overlay: 0.6,
} as const;

// Opacity tokens can standardize recurring visual states.

// ---------------------------------------------------------------------
// 14. Sizing tokens
// ---------------------------------------------------------------------

export const sizeTokens = {
  controlSmall: "32px",
  controlMedium: "40px",
  controlLarge: "48px",
  iconSmall: "16px",
  iconMedium: "20px",
  iconLarge: "24px",
} as const;

// Shared sizing tokens help controls and icons maintain consistent proportions.

// ---------------------------------------------------------------------
// 15. Container tokens
// ---------------------------------------------------------------------

export const containerTokens = {
  small: "640px",
  medium: "768px",
  large: "1024px",
  extraLarge: "1280px",
} as const;

// Container widths are design decisions that can be shared across layouts.

// ---------------------------------------------------------------------
// 16. Breakpoint tokens
// ---------------------------------------------------------------------

export const breakpointTokens = {
  small: "640px",
  medium: "768px",
  large: "1024px",
  extraLarge: "1280px",
} as const;

// Breakpoint tokens establish a common responsive vocabulary.
//
// They should not be confused with component-specific media-query logic.

// ---------------------------------------------------------------------
// 17. Motion tokens
// ---------------------------------------------------------------------

export const motionTokens = {
  durationFast: "120ms",
  durationNormal: "200ms",
  durationSlow: "300ms",
  easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

// Motion tokens make transitions predictable across components.

// ---------------------------------------------------------------------
// 18. Z-index tokens
// ---------------------------------------------------------------------

export const zIndexTokens = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;

// Z-index values are easier to reason about when they form a shared hierarchy
// instead of being independently invented by every component.

// ---------------------------------------------------------------------
// 19. Token naming
// ---------------------------------------------------------------------

// Good token names describe meaning:
//
// actionPrimary
// textSecondary
// surfaceDefault
// statusDanger
//
// Weak names expose only implementation details:
//
// blue
// darkGray
// tenPixels
//
// Semantic naming makes tokens easier to understand and replace.

// ---------------------------------------------------------------------
// 20. Token names should describe stable intent
// ---------------------------------------------------------------------

export const semanticSpacing = {
  componentGap: spacingTokens.md,
  sectionGap: spacingTokens.xl,
  controlPadding: spacingTokens.sm,
} as const;

// Semantic spacing can describe recurring relationships.
//
// The important distinction is:
//
// spacingTokens.md
//     → raw scale value
//
// semanticSpacing.componentGap
//     → named design decision

// ---------------------------------------------------------------------
// 21. Token composition
// ---------------------------------------------------------------------

export const buttonTokens = {
  height: sizeTokens.controlMedium,
  horizontalPadding: spacingTokens.md,
  radius: radiusTokens.medium,
  borderWidth: borderTokens.widthThin,
  transitionDuration: motionTokens.durationFast,
} as const;

// Component-level tokens can compose foundational tokens
// into a coherent component contract.

// ---------------------------------------------------------------------
// 22. Token layers
// ---------------------------------------------------------------------

// A useful token architecture can contain:
//
// Primitive tokens
//     ↓
// Semantic tokens
//     ↓
// Component tokens
//     ↓
// Components
//
// Each layer answers a different question.
//
// Primitive:
// "What values are available?"
//
// Semantic:
// "What does this value mean?"
//
// Component:
// "How does this component use those decisions?"

// ---------------------------------------------------------------------
// 23. Component tokens
// ---------------------------------------------------------------------

export const buttonColorTokens = {
  primaryBackground: semanticColors.actionPrimary,
  primaryHoverBackground: semanticColors.actionPrimaryHover,
  primaryText: semanticColors.surfaceDefault,
  disabledOpacity: opacityTokens.disabled,
} as const;

// Component tokens make component-specific decisions explicit
// without exposing every implementation detail to consumers.

// ---------------------------------------------------------------------
// 24. Token-driven button
// ---------------------------------------------------------------------

export interface TokenButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
}

export const TokenButton: FC<TokenButtonProps> = ({ children, disabled = false }): ReactElement => {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        minHeight: buttonTokens.height,
        paddingInline: buttonTokens.horizontalPadding,
        borderRadius: buttonTokens.radius,
        border: `${buttonTokens.borderWidth} ${borderTokens.styleDefault} ${borderTokens.colorDefault}`,
        background: buttonColorTokens.primaryBackground,
        color: buttonColorTokens.primaryText,
        opacity: disabled ? buttonColorTokens.disabledOpacity : 1,
        transition: `opacity ${buttonTokens.transitionDuration}`,
      }}
    >
      {children}
    </button>
  );
};

// The component consumes component tokens rather than scattered raw values.

// ---------------------------------------------------------------------
// 25. Avoid raw values inside components
// ---------------------------------------------------------------------

// Prefer:
//
// padding: spacingTokens.md
//
// over:
//
// padding: "16px"
//
// when "16px" represents an established spacing decision.
//
// Not every literal must become a token.
// Tokenize values when they represent reusable design decisions.

// ---------------------------------------------------------------------
// 26. Tokenization threshold
// ---------------------------------------------------------------------

// A value is a good token candidate when it is:
//
// - reused
// - meaningful
// - part of a visual system
// - expected to remain consistent
// - likely to change as a design decision
//
// A one-off value does not automatically justify a new token.

// ---------------------------------------------------------------------
// 27. Avoid token proliferation
// ---------------------------------------------------------------------

// Avoid creating dozens of nearly identical tokens:
//
// spacing17
// spacing18
// spacing19
// spacing20
//
// when a coherent spacing scale is sufficient.
//
// Too many tokens recreate the same problem as arbitrary values:
// consumers have too many choices.

// ---------------------------------------------------------------------
// 28. Token constraints
// ---------------------------------------------------------------------

export type ControlSize = "small" | "medium" | "large";

export const controlHeightTokens: Record<ControlSize, string> = {
  small: sizeTokens.controlSmall,
  medium: sizeTokens.controlMedium,
  large: sizeTokens.controlLarge,
};

// A constrained token map makes supported values explicit.

// ---------------------------------------------------------------------
// 29. Tokens and TypeScript
// ---------------------------------------------------------------------

export type ColorToken = keyof typeof semanticColors;

export type RadiusToken = keyof typeof radiusTokens;

export type ShadowToken = keyof typeof shadowTokens;

export interface TokenPreviewProps {
  readonly color: ColorToken;
  readonly radius: RadiusToken;
  readonly shadow: ShadowToken;
}

export const TokenPreview: FC<TokenPreviewProps> = ({ color, radius, shadow }): ReactElement => {
  return (
    <div
      style={{
        background: semanticColors[color],
        borderRadius: radiusTokens[radius],
        boxShadow: shadowTokens[shadow],
        padding: spacingTokens.lg,
      }}
    >
      Token-driven surface
    </div>
  );
};

// `keyof typeof` converts the token object into a type-safe vocabulary.

// ---------------------------------------------------------------------
// 30. Tokens and autocomplete
// ---------------------------------------------------------------------

// A typed token object gives consumers:
//
// semanticColors.actionPrimary
//
// instead of:
//
// semanticColors["someUnknownValue"]
//
// TypeScript can therefore catch invalid token names
// before the application runs.

// ---------------------------------------------------------------------
// 31. Readonly token objects
// ---------------------------------------------------------------------

export const immutableTokens = {
  spacing: spacingTokens,
  colors: semanticColors,
  radii: radiusTokens,
} as const;

// `as const` preserves literal values and makes the object readonly.
//
// This is useful for token definitions because consumers should not mutate
// the shared design vocabulary at runtime.

// ---------------------------------------------------------------------
// 32. Token references
// ---------------------------------------------------------------------

export const cardTokens = {
  background: semanticColors.surfaceDefault,
  border: semanticColors.borderDefault,
  radius: radiusTokens.medium,
  padding: spacingTokens.lg,
  shadow: shadowTokens.small,
} as const;

// Tokens can reference other tokens rather than duplicating raw values.

// ---------------------------------------------------------------------
// 33. Token aliasing
// ---------------------------------------------------------------------

// An alias creates a semantic relationship:
//
// cardTokens.padding
//     → spacingTokens.lg
//
// This means the card does not need to know the literal value.
//
// If the spacing scale changes,
// the card can inherit the updated decision.

// ---------------------------------------------------------------------
// 34. Color roles
// ---------------------------------------------------------------------

export const colorRoles = {
  text: {
    primary: semanticColors.textPrimary,
    secondary: semanticColors.textSecondary,
  },
  surface: {
    default: semanticColors.surfaceDefault,
    muted: semanticColors.surfaceMuted,
  },
  action: {
    primary: semanticColors.actionPrimary,
    primaryHover: semanticColors.actionPrimaryHover,
  },
  status: {
    success: semanticColors.statusSuccess,
    warning: semanticColors.statusWarning,
    danger: semanticColors.statusDanger,
  },
} as const;

// Grouping related semantic roles makes the design vocabulary easier to navigate.

// ---------------------------------------------------------------------
// 35. Token hierarchy
// ---------------------------------------------------------------------

// The hierarchy can be understood as:
//
// palette
//     ↓
// semantic color
//     ↓
// component color
//
// For example:
//
// blue500
//     ↓
// actionPrimary
//     ↓
// button primary background
//
// Each layer adds meaning.

// ---------------------------------------------------------------------
// 36. Light theme
// ---------------------------------------------------------------------

export interface ColorTheme {
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly surfaceDefault: string;
  readonly surfaceMuted: string;
  readonly borderDefault: string;
  readonly actionPrimary: string;
  readonly actionPrimaryHover: string;
  readonly statusSuccess: string;
  readonly statusWarning: string;
  readonly statusDanger: string;
}

export const lightColorTheme: ColorTheme = {
  textPrimary: "#111827",
  textSecondary: "#6b7280",
  surfaceDefault: "#ffffff",
  surfaceMuted: "#f9fafb",
  borderDefault: "#d1d5db",
  actionPrimary: "#2563eb",
  actionPrimaryHover: "#1d4ed8",
  statusSuccess: "#16a34a",
  statusWarning: "#ca8a04",
  statusDanger: "#dc2626",
};

// A theme preserves semantic roles while supplying different underlying values.

// ---------------------------------------------------------------------
// 37. Dark theme
// ---------------------------------------------------------------------

export const darkColorTheme: ColorTheme = {
  textPrimary: "#f9fafb",
  textSecondary: "#d1d5db",
  surfaceDefault: "#111827",
  surfaceMuted: "#1f2937",
  borderDefault: "#4b5563",
  actionPrimary: "#60a5fa",
  actionPrimaryHover: "#93c5fd",
  statusSuccess: "#4ade80",
  statusWarning: "#facc15",
  statusDanger: "#f87171",
};

// The component can continue consuming:
//
// textPrimary
// surfaceDefault
// actionPrimary
//
// without knowing which concrete colors are active.

// ---------------------------------------------------------------------
// 38. Theme-aware surface
// ---------------------------------------------------------------------

export interface ThemeSurfaceProps {
  readonly theme: ColorTheme;
  readonly children: ReactNode;
}

export const ThemeSurface: FC<ThemeSurfaceProps> = ({ theme, children }): ReactElement => {
  return (
    <div
      style={{
        color: theme.textPrimary,
        background: theme.surfaceDefault,
        border: `1px solid ${theme.borderDefault}`,
        padding: spacingTokens.lg,
        borderRadius: radiusTokens.medium,
      }}
    >
      {children}
    </div>
  );
};

// Theme-aware components consume semantic roles rather than raw palette values.

// ---------------------------------------------------------------------
// 39. Theme switching
// ---------------------------------------------------------------------

export const ThemeComparison: FC = (): ReactElement => {
  return (
    <div
      style={{
        display: "grid",
        gap: spacingTokens.lg,
      }}
    >
      <ThemeSurface theme={lightColorTheme}>Light theme</ThemeSurface>

      <ThemeSurface theme={darkColorTheme}>Dark theme</ThemeSurface>
    </div>
  );
};

// Both themes satisfy the same ColorTheme contract.

// ---------------------------------------------------------------------
// 40. Token contract stability
// ---------------------------------------------------------------------

// Components depend on semantic token contracts:
//
// actionPrimary
// textPrimary
// surfaceDefault
//
// The underlying value can change without requiring component consumers
// to change their code.
//
// This is one of the main architectural benefits of semantic tokens.

// ---------------------------------------------------------------------
// 41. Token naming versus CSS naming
// ---------------------------------------------------------------------

// A TypeScript token:
//
// semanticColors.actionPrimary
//
// could eventually be represented as a CSS custom property:
//
// --color-action-primary
//
// The important concept is the semantic contract,
// not the particular storage mechanism.

// ---------------------------------------------------------------------
// 42. CSS custom properties
// ---------------------------------------------------------------------

export const cssVariableNames = {
  actionPrimary: "--color-action-primary",
  textPrimary: "--color-text-primary",
  surfaceDefault: "--color-surface-default",
  spacingMedium: "--spacing-md",
} as const;

// CSS custom properties can expose tokens to CSS,
// browser styling, and runtime theme changes.

// ---------------------------------------------------------------------
// 43. Token values versus CSS variables
// ---------------------------------------------------------------------

// JavaScript token:
//
// spacingTokens.md
//
// CSS variable:
//
// var(--spacing-md)
//
// Both can represent the same design decision.
//
// The choice depends on where the value needs to be consumed.

// ---------------------------------------------------------------------
// 44. Runtime theming
// ---------------------------------------------------------------------

export const themeStyle = {
  "--color-action-primary": lightColorTheme.actionPrimary,
  "--color-text-primary": lightColorTheme.textPrimary,
  "--color-surface-default": lightColorTheme.surfaceDefault,
} as const;

// CSS variables are especially useful when theme values need to change
// without reconstructing every component's JavaScript style object.

// ---------------------------------------------------------------------
// 45. Tokenized typography component
// ---------------------------------------------------------------------

export interface HeadingProps {
  readonly children: ReactNode;
  readonly level?: 1 | 2 | 3;
}

export const Heading: FC<HeadingProps> = ({ children, level = 2 }): ReactElement => {
  const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";

  const fontSize =
    level === 1
      ? typographyTokens.fontSizeHeadingLarge
      : level === 2
        ? typographyTokens.fontSizeHeadingMedium
        : typographyTokens.fontSizeHeadingSmall;

  return (
    <Tag
      style={{
        fontFamily: typographyTokens.fontFamily,
        fontSize,
        fontWeight: typographyTokens.fontWeightBold,
        lineHeight: typographyTokens.lineHeightTight,
        color: semanticColors.textPrimary,
      }}
    >
      {children}
    </Tag>
  );
};

// The component combines semantic structure with tokenized visual treatment.

// ---------------------------------------------------------------------
// 46. Tokenized card
// ---------------------------------------------------------------------

export interface TokenCardProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const TokenCard: FC<TokenCardProps> = ({ title, children }): ReactElement => {
  return (
    <section
      style={{
        background: cardTokens.background,
        border: `${borderTokens.widthThin} ${borderTokens.styleDefault} ${cardTokens.border}`,
        borderRadius: cardTokens.radius,
        padding: cardTokens.padding,
        boxShadow: cardTokens.shadow,
      }}
    >
      <Heading level={2}>{title}</Heading>

      {children}
    </section>
  );
};

// The card's visual contract is assembled from shared tokens.

// ---------------------------------------------------------------------
// 47. Tokenized control sizes
// ---------------------------------------------------------------------

export interface ControlProps {
  readonly size?: ControlSize;
  readonly children: ReactNode;
}

export const Control: FC<ControlProps> = ({ size = "medium", children }): ReactElement => {
  return (
    <div
      style={{
        minHeight: controlHeightTokens[size],
        display: "inline-flex",
        alignItems: "center",
        paddingInline: spacingTokens.md,
        borderRadius: radiusTokens.medium,
        border: `${borderTokens.widthThin} ${borderTokens.styleDefault} ${borderTokens.colorDefault}`,
      }}
    >
      {children}
    </div>
  );
};

// A shared size vocabulary keeps controls visually related.

// ---------------------------------------------------------------------
// 48. Tokenized status
// ---------------------------------------------------------------------

export type StatusToken = "success" | "warning" | "danger";

export interface TokenStatusProps {
  readonly status: StatusToken;
  readonly children: ReactNode;
}

export const TokenStatus: FC<TokenStatusProps> = ({ status, children }): ReactElement => {
  return (
    <span
      style={{
        color:
          status === "success"
            ? semanticColors.statusSuccess
            : status === "warning"
              ? semanticColors.statusWarning
              : semanticColors.statusDanger,
      }}
    >
      {children}
    </span>
  );
};

// Semantic status tokens keep status communication consistent.

// ---------------------------------------------------------------------
// 49. Tokenized elevation
// ---------------------------------------------------------------------

export interface ElevationProps {
  readonly level?: "none" | "small" | "medium" | "large";
  readonly children: ReactNode;
}

export const Elevation: FC<ElevationProps> = ({ level = "small", children }): ReactElement => {
  return (
    <div
      style={{
        boxShadow: shadowTokens[level],
        borderRadius: radiusTokens.medium,
        padding: spacingTokens.lg,
      }}
    >
      {children}
    </div>
  );
};

// Elevation levels form a controlled visual vocabulary.

// ---------------------------------------------------------------------
// 50. Tokenized motion
// ---------------------------------------------------------------------

export interface AnimatedSurfaceProps {
  readonly children: ReactNode;
}

export const AnimatedSurface: FC<AnimatedSurfaceProps> = ({ children }): ReactElement => {
  return (
    <div
      style={{
        transition: [`opacity ${motionTokens.durationNormal}`, `transform ${motionTokens.durationNormal}`].join(", "),
        transitionTimingFunction: motionTokens.easingStandard,
      }}
    >
      {children}
    </div>
  );
};

// Motion tokens prevent each component from inventing unrelated durations
// and easing functions.

// ---------------------------------------------------------------------
// 51. Reduced motion
// ---------------------------------------------------------------------

// A motion token does not by itself solve accessibility.
//
// Components that animate should also account for reduced-motion preferences.
//
// Tokenization provides a shared default;
// the component still needs appropriate runtime or CSS behavior.

// ---------------------------------------------------------------------
// 52. Tokenized responsive container
// ---------------------------------------------------------------------

export interface ContainerProps {
  readonly children: ReactNode;
  readonly size?: "small" | "medium" | "large" | "extraLarge";
}

export const Container: FC<ContainerProps> = ({ children, size = "large" }): ReactElement => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: containerTokens[size],
        marginInline: "auto",
        paddingInline: spacingTokens.md,
      }}
    >
      {children}
    </div>
  );
};

// The container exposes a controlled set of layout sizes.

// ---------------------------------------------------------------------
// 53. Tokenized spacing composition
// ---------------------------------------------------------------------

export interface SectionLayoutProps {
  readonly children: ReactNode;
}

export const SectionLayout: FC<SectionLayoutProps> = ({ children }): ReactElement => {
  return (
    <section
      style={{
        paddingBlock: spacingTokens.xl,
        paddingInline: spacingTokens.lg,
      }}
    >
      {children}
    </section>
  );
};

// Shared layout values can be composed without creating new arbitrary values.

// ---------------------------------------------------------------------
// 54. Token-driven component contract
// ---------------------------------------------------------------------

export interface TokenDrivenPanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const TokenDrivenPanel: FC<TokenDrivenPanelProps> = ({ title, children }): ReactElement => {
  return (
    <Container size="medium">
      <TokenCard title={title}>
        <SectionLayout>{children}</SectionLayout>
      </TokenCard>
    </Container>
  );
};

// The panel indirectly consumes container, spacing, typography,
// border, radius, shadow, and color tokens.

// ---------------------------------------------------------------------
// 55. Tokens should not encode business meaning
// ---------------------------------------------------------------------

// Avoid token names such as:
//
// approvedOrderGreen
// premiumCustomerSpacing
// checkoutButtonBlue
//
// These values belong to application or domain-specific decisions.
//
// Prefer:
//
// statusSuccess
// spacingMd
// actionPrimary
//
// The design system should provide reusable semantic foundations.

// ---------------------------------------------------------------------
// 56. Tokens should not encode component internals unnecessarily
// ---------------------------------------------------------------------

// Avoid exposing every internal value:
//
// buttonBorderRadiusForDisabledCompactVariant
//
// when the underlying decision can remain internal:
//
// buttonTokens.radius
//
// Tokens should expose stable design decisions,
// not every implementation detail.

// ---------------------------------------------------------------------
// 57. Token ownership
// ---------------------------------------------------------------------

// Tokens need a clear owner.
//
// Ownership usually includes:
//
// - naming
// - values
// - documentation
// - deprecation
// - migration
// - theme compatibility
//
// Without ownership, token collections tend to become arbitrary constants.

// ---------------------------------------------------------------------
// 58. Token documentation
// ---------------------------------------------------------------------

export interface TokenDocumentation {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
}

export const documentedToken: TokenDocumentation = {
  name: "actionPrimary",
  description: "Primary interactive action color.",
  usage: "Use for primary actions and their related interactive states.",
};

// Documentation explains intent that the value itself cannot communicate.

// ---------------------------------------------------------------------
// 59. Token discoverability
// ---------------------------------------------------------------------

// A token system should make it easy to answer:
//
// "Which token should I use here?"
//
// Clear categories and semantic names reduce the need for consumers
// to inspect raw values before choosing a token.

// ---------------------------------------------------------------------
// 60. Token aliases and migration
// ---------------------------------------------------------------------

export const legacyTokenAliases = {
  primaryBlue: semanticColors.actionPrimary,
  standardText: semanticColors.textPrimary,
} as const;

// Aliases can provide a migration path when token names evolve.
//
// They should generally be temporary rather than becoming a second
// permanent vocabulary.

// ---------------------------------------------------------------------
// 61. Avoid duplicate token vocabularies
// ---------------------------------------------------------------------

// Avoid maintaining two equivalent names:
//
// actionPrimary
// primaryAction
//
// unless they intentionally represent different concepts.
//
// Duplicate names create uncertainty about which token consumers should use.

// ---------------------------------------------------------------------
// 62. Token versioning
// ---------------------------------------------------------------------

// Changing a token can affect many components:
//
// token value changes
//     ↓
// shared component appearance changes
//     ↓
// many application interfaces change
//
// Token changes therefore deserve the same care as shared component API changes.

// ---------------------------------------------------------------------
// 63. Breaking visual changes
// ---------------------------------------------------------------------

// A token change can be breaking even when TypeScript reports no errors.
//
// Examples:
//
// spacing.md changes from 16px to 20px
// actionPrimary changes color
// controlMedium changes height
//
// The API remains type-correct,
// but the rendered interface changes.

// ---------------------------------------------------------------------
// 64. Token testing
// ---------------------------------------------------------------------

// Token systems can be tested for:
//
// - expected keys
// - valid references
// - theme compatibility
// - semantic completeness
// - generated CSS variables
// - visual regression
//
// Component tests then verify how components consume those tokens.

// ---------------------------------------------------------------------
// 65. Token consistency
// ---------------------------------------------------------------------

export const tokenConsistencyExample = {
  cardPadding: spacingTokens.lg,
  sectionPadding: spacingTokens.xl,
  controlPadding: spacingTokens.sm,
  cardRadius: radiusTokens.medium,
  controlRadius: radiusTokens.medium,
} as const;

// Reusing tokens creates relationships between components.
// Those relationships are part of the design language.

// ---------------------------------------------------------------------
// 66. Token-driven form
// ---------------------------------------------------------------------

export interface TokenFormProps {
  readonly children: ReactNode;
}

export const TokenForm: FC<TokenFormProps> = ({ children }): ReactElement => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacingTokens.lg,
        padding: spacingTokens.xl,
        background: semanticColors.surfaceDefault,
        border: `${borderTokens.widthThin} ${borderTokens.styleDefault} ${semanticColors.borderDefault}`,
        borderRadius: radiusTokens.large,
        boxShadow: shadowTokens.small,
      }}
    >
      {children}
    </form>
  );
};

// The form derives its visual structure from shared tokens.

// ---------------------------------------------------------------------
// 67. Token-driven application example
// ---------------------------------------------------------------------

export const TokenApplicationExample: FC = (): ReactElement => {
  return (
    <Container size="medium">
      <TokenForm>
        <Heading level={1}>Profile</Heading>

        <SpacingExample gap="md">
          <Control size="medium">Name</Control>

          <Control size="medium">john@example.com</Control>

          <TokenButton>Save</TokenButton>
        </SpacingExample>
      </TokenForm>
    </Container>
  );
};

// The application consumes components that are themselves built from tokens.
// Consumers do not need to repeat the underlying design values.

// ---------------------------------------------------------------------
// 68. Token pipeline
// ---------------------------------------------------------------------

// In a larger system, the conceptual pipeline can be:
//
// Design decisions
//     ↓
// Token source
//     ↓
// Token transformation
//     ↓
// CSS / TypeScript / platform outputs
//     ↓
// Components
//
// The exact tooling can vary.
// The architectural principle is the separation of design decisions
// from their platform-specific representation.

// ---------------------------------------------------------------------
// 69. Multi-platform tokens
// ---------------------------------------------------------------------

// Tokens can represent decisions shared across platforms:
//
// Web
// Mobile
// Desktop
//
// The same semantic decision may produce different platform-specific values.
//
// The token concept is therefore not inherently tied to React or CSS.

// ---------------------------------------------------------------------
// 70. Token source of truth
// ---------------------------------------------------------------------

// A mature token system should avoid having multiple independent sources
// of truth for the same design decision.
//
// Prefer:
//
// one source
//     ↓
// generated representations
//
// over:
//
// manually maintained web tokens
// manually maintained mobile tokens
// manually maintained documentation values

// ---------------------------------------------------------------------
// 71. Generated token representations
// ---------------------------------------------------------------------

export const generatedTokenExample = {
  css: "--color-action-primary",
  javascript: semanticColors.actionPrimary,
} as const;

// A real token pipeline may generate CSS variables,
// TypeScript constants, native platform values, and documentation
// from a common source.

// ---------------------------------------------------------------------
// 72. Token consumption boundary
// ---------------------------------------------------------------------

// Components should generally consume tokens through a stable interface:
//
// Component
//     ↓
// Semantic token
//
// Rather than:
//
// Component
//     ↓
// raw palette
//
// This reduces coupling between components and the underlying token implementation.

// ---------------------------------------------------------------------
// 73. Token refactoring
// ---------------------------------------------------------------------

// A useful refactoring sequence is:
//
// 1. identify repeated raw values
// 2. determine whether they represent the same decision
// 3. create a token
// 4. replace consumers
// 5. document the token's meaning
// 6. remove unnecessary duplicates
//
// Repetition alone does not prove that two values should share one token.

// ---------------------------------------------------------------------
// 74. Tokens and intentional differences
// ---------------------------------------------------------------------

// Two identical values do not necessarily represent the same decision.
//
// For example:
//
// actionPrimary = "#2563eb"
// informationalAccent = "#2563eb"
//
// may currently share a value while representing different semantic roles.
//
// Do not merge tokens solely because their current values happen to match.

// ---------------------------------------------------------------------
// 75. Complete token hierarchy
// ---------------------------------------------------------------------

export const designTokens = {
  primitive: {
    colors: primitiveColors,
  },
  semantic: {
    colors: semanticColors,
    spacing: spacingTokens,
    typography: typographyTokens,
    radius: radiusTokens,
    shadow: shadowTokens,
    opacity: opacityTokens,
    size: sizeTokens,
    breakpoint: breakpointTokens,
    motion: motionTokens,
    zIndex: zIndexTokens,
  },
  component: {
    button: buttonTokens,
    buttonColors: buttonColorTokens,
    card: cardTokens,
  },
} as const;

// This hierarchy demonstrates one possible organization:
//
// primitive → semantic → component
//
// The exact structure can differ between systems,
// but the separation of concerns remains useful.

// ---------------------------------------------------------------------
// 76. Complete token composition
// ---------------------------------------------------------------------

export const CompleteTokenExample: FC = (): ReactElement => {
  return (
    <Container size="large">
      <SpacingExample gap="xl">
        <Heading level={1}>Account</Heading>

        <TokenCard title="Profile">
          <SpacingExample gap="md">
            <ThemedText>John Doe</ThemedText>

            <ThemedText muted>john@example.com</ThemedText>

            <TokenButton>Save changes</TokenButton>
          </SpacingExample>
        </TokenCard>

        <TokenStatus status="success">Changes saved successfully.</TokenStatus>
      </SpacingExample>
    </Container>
  );
};

// The final composition demonstrates how a shared token vocabulary
// propagates through component APIs into a complete interface.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Design tokens are named representations of shared design decisions.
// - Tokens can represent color, spacing, typography, sizing, radius, borders, shadows, opacity, motion, z-index, and responsive values.
// - Primitive tokens describe underlying values, while semantic tokens describe the purpose of those values.
// - Components should generally consume semantic tokens rather than raw palette values.
// - Component tokens can compose foundational and semantic tokens into stable component-specific contracts.
// - A useful token architecture can separate primitive, semantic, and component-level decisions.
// - Semantic token names such as actionPrimary and statusDanger communicate intent more effectively than names such as blue500 or red500.
// - Token naming should describe stable meaning rather than implementation details.
// - `keyof typeof` can turn token objects into type-safe TypeScript vocabularies.
// - `as const` is useful for preserving literal token values and preventing accidental mutation of shared definitions.
// - Tokenization should be deliberate; not every literal value needs to become a token.
// - Too many tokens can recreate the complexity that tokens were intended to reduce.
// - Reusing tokens creates visual relationships between components and helps maintain consistency.
// - Two values should not automatically share one token merely because their current concrete values are identical.
// - Theme systems can preserve semantic token roles while changing their underlying values.
// - CSS custom properties are another representation through which tokens can be consumed, especially for runtime theming.
// - Token systems should account for accessibility concerns such as reduced motion rather than treating tokenization as a complete accessibility solution.
// - Design tokens should generally remain independent of application-specific business rules, domain concepts, and infrastructure.
// - Token changes can be visually breaking even when TypeScript continues to compile successfully.
// - Token systems benefit from documentation, ownership, testing, versioning, and migration strategies.
// - A mature token pipeline can use one source of truth to generate representations for different platforms and technologies.
// - The main architectural relationship is design decisions → tokens → components → application interfaces.

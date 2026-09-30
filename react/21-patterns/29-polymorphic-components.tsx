/**
 * Polymorphic Components
 * =======================
 *
 * A polymorphic component can render as different element types while preserving a shared component
 * API. The `as` prop selects the rendered element, while TypeScript derives the valid native props
 * for that element and prevents props that do not belong to the selected element.
 */

// ---------------------------------------------------------------------
// 1. The basic polymorphic pattern
// ---------------------------------------------------------------------

import { type ComponentPropsWithoutRef, type ElementType, type FC, type ReactElement, type ReactNode } from "react";

interface PolymorphicProps<Element extends ElementType, OwnProps> {
  as?: Element;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface TextOwnProps {
  readonly weight?: "normal" | "medium" | "bold";
}

type TextProps<Element extends ElementType> = TextOwnProps & {
  readonly as?: Element;
} & Omit<ComponentPropsWithoutRef<Element>, keyof TextOwnProps | "as">;

export const Text = <Element extends ElementType = "span">({
  as,
  weight = "normal",
  ...props
}: TextProps<Element>): ReactElement => {
  const Component = as ?? "span";

  return <Component {...props} data-weight={weight} />;
};

export const BasicPolymorphicExample: FC = (): ReactElement => {
  return (
    <div>
      <Text>Default span</Text>
      <Text as="p">Paragraph text</Text>
      <Text as="h1" weight="bold">
        Heading text
      </Text>
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. Preserving native element props
// ---------------------------------------------------------------------

interface BoxOwnProps {
  readonly padding?: "small" | "medium" | "large";
}

type BoxProps<Element extends ElementType> = BoxOwnProps & {
  readonly as?: Element;
} & Omit<ComponentPropsWithoutRef<Element>, keyof BoxOwnProps | "as">;

export const Box = <Element extends ElementType = "div">({
  as,
  padding = "medium",
  ...props
}: BoxProps<Element>): ReactElement => {
  const Component = as ?? "div";

  return <Component {...props} data-padding={padding} />;
};

export const NativePropsExample: FC = (): ReactElement => {
  return (
    <div>
      <Box id="container" aria-label="Container">
        Content
      </Box>

      <Box as="section" aria-labelledby="section-title">
        <h2 id="section-title">Section</h2>
      </Box>

      <Box as="a" href="https://example.com" target="_blank" rel="noreferrer">
        Visit example.com
      </Box>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Polymorphic buttons
// ---------------------------------------------------------------------

interface ButtonOwnProps {
  readonly variant?: "primary" | "secondary" | "danger";
  readonly size?: "small" | "medium" | "large";
}

type ButtonProps<Element extends ElementType> = ButtonOwnProps & {
  readonly as?: Element;
} & Omit<ComponentPropsWithoutRef<Element>, keyof ButtonOwnProps | "as">;

export const Button = <Element extends ElementType = "button">({
  as,
  variant = "primary",
  size = "medium",
  ...props
}: ButtonProps<Element>): ReactElement => {
  const Component = as ?? "button";

  return <Component {...props} data-variant={variant} data-size={size} />;
};

export const PolymorphicButtonExample: FC = (): ReactElement => {
  const handleClick = (): void => {
    console.log("Button clicked.");
  };

  return (
    <div>
      <Button type="button" variant="primary" onClick={handleClick}>
        Save
      </Button>

      <Button as="a" href="https://example.com" variant="secondary">
        Visit example.com
      </Button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Element-specific props are inferred from `as`
// ---------------------------------------------------------------------

export const ElementSpecificPropsExample: FC = (): ReactElement => {
  return (
    <div>
      <Button as="a" href="https://example.com">
        External link
      </Button>

      <Button as="button" type="button" disabled>
        Disabled button
      </Button>

      <Text as="label" htmlFor="name" weight="medium">
        Name
      </Text>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Custom components can also be used
// ---------------------------------------------------------------------

interface LinkProps {
  readonly href: string;
  readonly children: ReactNode;
}

const Link: FC<LinkProps> = ({ href, children }): ReactElement => {
  return (
    <a href={href} data-link="custom">
      {children}
    </a>
  );
};

export const CustomComponentExample: FC = (): ReactElement => {
  return (
    <div>
      <Text as={Link} href="https://example.com">
        Custom link component
      </Text>

      <Box as={Link} href="https://example.com">
        Custom box link
      </Box>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Shared props and native props
// ---------------------------------------------------------------------

interface HeadingOwnProps {
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
}

type HeadingProps<Element extends ElementType> = HeadingOwnProps & {
  readonly as?: Element;
} & Omit<ComponentPropsWithoutRef<Element>, keyof HeadingOwnProps | "as">;

export const Heading = <Element extends ElementType = "h2">({
  as,
  level = 2,
  ...props
}: HeadingProps<Element>): ReactElement => {
  const Component = as ?? "h2";

  return <Component {...props} data-level={level} />;
};

export const SharedPropsExample: FC = (): ReactElement => {
  return (
    <div>
      <Heading level={1} id="page-title">
        Account
      </Heading>

      <Heading as="div" level={2} aria-label="Account section">
        Account details
      </Heading>
    </div>
  );
};

// ---------------------------------------------------------------------
// 7. Restricting the allowed element types
// ---------------------------------------------------------------------

type TextElement = "p" | "span" | "strong" | "em";

interface InlineTextOwnProps {
  readonly tone?: "default" | "muted" | "danger";
}

type InlineTextProps<Element extends TextElement> = InlineTextOwnProps & {
  readonly as?: Element;
} & Omit<ComponentPropsWithoutRef<Element>, keyof InlineTextOwnProps | "as">;

export const InlineText = <Element extends TextElement = "span">({
  as,
  tone = "default",
  ...props
}: InlineTextProps<Element>): ReactElement => {
  const Component = as ?? "span";

  return <Component {...props} data-tone={tone} />;
};

export const RestrictedElementExample: FC = (): ReactElement => {
  return (
    <div>
      <InlineText>Inline text</InlineText>
      <InlineText as="strong" tone="muted">
        Important text
      </InlineText>
      <InlineText as="em" tone="danger">
        Warning text
      </InlineText>
    </div>
  );
};

// ---------------------------------------------------------------------
// 8. A polymorphic component with required own props
// ---------------------------------------------------------------------

interface LabelOwnProps {
  readonly label: string;
  readonly required?: boolean;
}

type LabelProps<Element extends ElementType> = LabelOwnProps & {
  readonly as?: Element;
} & Omit<ComponentPropsWithoutRef<Element>, keyof LabelOwnProps | "as">;

export const Label = <Element extends ElementType = "label">({
  as,
  label,
  required = false,
  ...props
}: LabelProps<Element>): ReactElement => {
  const Component = as ?? "label";

  return (
    <Component {...props}>
      {label}
      {required && <span aria-hidden="true"> *</span>}
    </Component>
  );
};

export const RequiredPropsExample: FC = (): ReactElement => {
  return (
    <div>
      <Label htmlFor="name" label="Name" required />

      <Label as="div" label="Account information" aria-label="Account information" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Polymorphism is different from simple configuration
// ---------------------------------------------------------------------

interface ConfiguredTextProps {
  readonly children: ReactNode;
  readonly variant?: "heading" | "body" | "caption";
}

export const ConfiguredText: FC<ConfiguredTextProps> = ({ children, variant = "body" }): ReactElement => {
  return <span data-variant={variant}>{children}</span>;
};

export const ConfigurationVsPolymorphismExample: FC = (): ReactElement => {
  return (
    <div>
      <ConfiguredText variant="heading">Configured text</ConfiguredText>

      <Text as="h2">Polymorphic text</Text>
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Complete demonstration
// ---------------------------------------------------------------------

export const PolymorphicComponentsDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicPolymorphicExample />
      <NativePropsExample />
      <PolymorphicButtonExample />
      <ElementSpecificPropsExample />
      <CustomComponentExample />
      <SharedPropsExample />
      <RestrictedElementExample />
      <RequiredPropsExample />
      <ConfigurationVsPolymorphismExample />
    </main>
  );
};

export default PolymorphicComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A polymorphic component uses an `as` prop to select the element or component it renders.
// - Generic element types allow TypeScript to infer the props supported by the selected element.
// - `ComponentPropsWithoutRef<Element>` provides the native props associated with the selected element.
// - `Omit` removes props owned by the polymorphic component before native props are merged into its API.
// - Polymorphic components can preserve shared component behavior while supporting different rendered elements.
// - Custom React components can also be used as polymorphic targets when their props are compatible.
// - Restricting the allowed element types keeps a polymorphic API predictable and prevents unsupported combinations.
// - Polymorphism is different from ordinary configuration because the rendered element type itself can change.
// - A good polymorphic API extends native element capabilities without unnecessarily replacing or duplicating them.

/**
 * Layout Components
 * =================
 *
 * Layout components are responsible for controlling how UI elements are positioned, sized,
 * spaced, and aligned. They provide reusable visual arrangements such as stacks, grids,
 * split layouts, and centered content without owning the meaning of the content they arrange.
 */

import { type CSSProperties, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Stack layout
// ---------------------------------------------------------------------

interface StackProps {
  readonly children: ReactNode;
  readonly gap?: number;
}

export const Stack: FC<StackProps> = ({ children, gap = 16 }): ReactElement => {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap,
  };

  return <div style={style}>{children}</div>;
};

// ---------------------------------------------------------------------
// 2. Row layout
// ---------------------------------------------------------------------

interface RowProps {
  readonly children: ReactNode;
  readonly gap?: number;
  readonly align?: CSSProperties["alignItems"];
}

export const Row: FC<RowProps> = ({ children, gap = 16, align = "center" }): ReactElement => {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: align,
    gap,
  };

  return <div style={style}>{children}</div>;
};

// ---------------------------------------------------------------------
// 3. Grid layout
// ---------------------------------------------------------------------

interface GridProps {
  readonly children: ReactNode;
  readonly columns?: number;
  readonly gap?: number;
}

export const Grid: FC<GridProps> = ({ children, columns = 2, gap = 16 }): ReactElement => {
  const style: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap,
  };

  return <div style={style}>{children}</div>;
};

// ---------------------------------------------------------------------
// 4. Centered layout
// ---------------------------------------------------------------------

interface CenterProps {
  readonly children: ReactNode;
  readonly minHeight?: string;
}

export const Center: FC<CenterProps> = ({ children, minHeight = "200px" }): ReactElement => {
  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight,
  };

  return <div style={style}>{children}</div>;
};

// ---------------------------------------------------------------------
// 5. Split layout
// ---------------------------------------------------------------------

interface SplitProps {
  readonly left: ReactNode;
  readonly right: ReactNode;
  readonly gap?: number;
}

export const Split: FC<SplitProps> = ({ left, right, gap = 24 }): ReactElement => {
  const style: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap,
  };

  return (
    <div style={style}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Container layout
// ---------------------------------------------------------------------

interface ContainerProps {
  readonly children: ReactNode;
  readonly maxWidth?: string;
}

export const Container: FC<ContainerProps> = ({ children, maxWidth = "1200px" }): ReactElement => {
  const style: CSSProperties = {
    width: "100%",
    maxWidth,
    margin: "0 auto",
    boxSizing: "border-box",
    padding: "0 24px",
  };

  return <div style={style}>{children}</div>;
};

// ---------------------------------------------------------------------
// 7. Composing layout components
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly name: string;
  readonly email: string;
}

export const UserCard: FC<UserCardProps> = ({ name, email }): ReactElement => (
  <div>
    <strong>{name}</strong>
    <p>{email}</p>
  </div>
);

export const LayoutComponentsDemo: FC = (): ReactElement => (
  <Container>
    <Stack gap={24}>
      <Row gap={12}>
        <strong>User Dashboard</strong>
        <span>Overview</span>
      </Row>

      <Grid columns={2} gap={16}>
        <UserCard name="John Doe" email="john@example.com" />
        <UserCard name="Jane Doe" email="jane@example.com" />
        <UserCard name="Alex Smith" email="alex@example.com" />
        <UserCard name="Sam Taylor" email="sam@example.com" />
      </Grid>

      <Split left={<div>Account information</div>} right={<div>Recent activity</div>} />

      <Center minHeight="120px">
        <span>No additional activity</span>
      </Center>
    </Stack>
  </Container>
);

// ---------------------------------------------------------------------
// 8. Layout responsibility
// ---------------------------------------------------------------------

interface ProfileLayoutProps {
  readonly header: ReactNode;
  readonly content: ReactNode;
  readonly actions: ReactNode;
}

export const ProfileLayout: FC<ProfileLayoutProps> = ({ header, content, actions }): ReactElement => (
  <Stack gap={24}>
    <Row gap={16}>
      {header}
      <div style={{ marginLeft: "auto" }}>{actions}</div>
    </Row>

    {content}
  </Stack>
);

// Layout components determine arrangement, spacing, sizing, and alignment.
// The content passed to them remains responsible for its own meaning and behavior.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Layout components control the spatial arrangement of UI elements.
// - Common layout primitives include stacks, rows, grids, split layouts, and centered content.
// - Layout components generally accept ReactNode so they can arrange arbitrary child content.
// - Layout-specific props can expose reusable controls such as gap, alignment, columns, and sizing.
// - Layout components should focus on spatial concerns rather than domain-specific behavior.
// - Multiple layout components can be composed to create more complex reusable arrangements.

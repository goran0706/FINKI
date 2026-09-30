/**
 * Structural Components
 * =====================
 *
 * Structural components are responsible for defining the structural shell of a user interface.
 * They organize major regions such as headers, sidebars, navigation areas, content regions, and
 * footers while leaving domain-specific content to the components rendered inside those regions.
 */

// ---------------------------------------------------------------------
// 1. Basic structural component
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

interface PageShellProps {
  readonly header: ReactNode;
  readonly sidebar: ReactNode;
  readonly content: ReactNode;
  readonly footer: ReactNode;
}

export const PageShell: FC<PageShellProps> = ({ header, sidebar, content, footer }): ReactElement => (
  <div>
    <header>{header}</header>
    <div>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
    <footer>{footer}</footer>
  </div>
);

// ---------------------------------------------------------------------
// 2. Structural regions
// ---------------------------------------------------------------------

interface DashboardShellProps {
  readonly navigation: ReactNode;
  readonly header: ReactNode;
  readonly content: ReactNode;
}

export const DashboardShell: FC<DashboardShellProps> = ({ navigation, header, content }): ReactElement => (
  <div>
    <aside>{navigation}</aside>
    <section>
      <header>{header}</header>
      <main>{content}</main>
    </section>
  </div>
);

// ---------------------------------------------------------------------
// 3. Structural components with semantic regions
// ---------------------------------------------------------------------

interface ApplicationShellProps {
  readonly topBar: ReactNode;
  readonly navigation: ReactNode;
  readonly main: ReactNode;
}

export const ApplicationShell: FC<ApplicationShellProps> = ({ topBar, navigation, main }): ReactElement => (
  <div>
    <header>{topBar}</header>
    <div>
      <nav>{navigation}</nav>
      <main>{main}</main>
    </div>
  </div>
);

// ---------------------------------------------------------------------
// 4. Composing structural components
// ---------------------------------------------------------------------

interface HeaderProps {
  readonly title: string;
}

export const Header: FC<HeaderProps> = ({ title }): ReactElement => (
  <div>
    <strong>{title}</strong>
  </div>
);

interface NavigationProps {
  readonly items: readonly string[];
}

export const Navigation: FC<NavigationProps> = ({ items }): ReactElement => (
  <ul>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

interface ContentProps {
  readonly title: string;
  readonly description: string;
}

export const Content: FC<ContentProps> = ({ title, description }): ReactElement => (
  <article>
    <h1>{title}</h1>
    <p>{description}</p>
  </article>
);

// ---------------------------------------------------------------------
// 5. Using the structural shell
// ---------------------------------------------------------------------

export const StructuralComponentsDemo: FC = (): ReactElement => (
  <ApplicationShell
    topBar={<Header title="User Dashboard" />}
    navigation={<Navigation items={["Overview", "Profile", "Settings"]} />}
    main={
      <Content
        title="Overview"
        description="The structural shell determines where each major region appears without defining the content of those regions."
      />
    }
  />
);

// ---------------------------------------------------------------------
// 6. Structural responsibility
// ---------------------------------------------------------------------

interface AccountPageProps {
  readonly navigation: ReactNode;
  readonly accountContent: ReactNode;
}

export const AccountPage: FC<AccountPageProps> = ({ navigation, accountContent }): ReactElement => (
  <ApplicationShell topBar={<Header title="Account" />} navigation={navigation} main={accountContent} />
);

// The structural component decides which regions exist and where they are rendered.
// The content components decide what those regions contain.
// This separation allows the same structural shell to host different page content.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Structural components define the major regions and hierarchy of a user interface.
// - Their responsibility is organization rather than domain-specific content.
// - ReactNode props allow a structural component to render arbitrary content inside each region.
// - Semantic elements such as header, nav, main, aside, and footer can communicate structural roles.
// - Structural components can be composed to build larger application shells.
// - Separating structure from content keeps page organization independent from individual features.

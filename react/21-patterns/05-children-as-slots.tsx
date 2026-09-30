/**
 * Children as Slots
 * =================
 *
 * The children-as-slots pattern uses ReactNode props to let a component receive arbitrary
 * React content for specific regions of its rendered structure. Instead of defining the
 * content itself, the component provides stable placement points while the caller supplies
 * the elements that belong in those positions.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Using children as a single slot
// ---------------------------------------------------------------------

interface CardProps {
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }): ReactElement => <section>{children}</section>;

// ---------------------------------------------------------------------
// 2. Providing named slots
// ---------------------------------------------------------------------

interface PanelProps {
  readonly header: ReactNode;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

export const Panel: FC<PanelProps> = ({ header, children, footer }): ReactElement => (
  <section>
    <header>{header}</header>
    <main>{children}</main>
    {footer && <footer>{footer}</footer>}
  </section>
);

// ---------------------------------------------------------------------
// 3. Supplying different content to the same slots
// ---------------------------------------------------------------------

export const UserPanel: FC = (): ReactElement => (
  <Panel header={<h2>User Profile</h2>} footer={<button type="button">Edit Profile</button>}>
    <p>John Doe</p>
    <p>john@example.com</p>
  </Panel>
);

// ---------------------------------------------------------------------
// 4. Multiple named slots
// ---------------------------------------------------------------------

interface DashboardPanelProps {
  readonly title: ReactNode;
  readonly actions?: ReactNode;
  readonly content: ReactNode;
}

export const DashboardPanel: FC<DashboardPanelProps> = ({ title, actions, content }): ReactElement => (
  <section>
    <header>
      <h2>{title}</h2>
      {actions && <div>{actions}</div>}
    </header>
    <main>{content}</main>
  </section>
);

// ---------------------------------------------------------------------
// 5. Reusing the same structural component
// ---------------------------------------------------------------------

export const AccountPanel: FC = (): ReactElement => (
  <DashboardPanel
    title="Account"
    actions={<button type="button">Edit</button>}
    content={
      <div>
        <p>John Doe</p>
        <p>john@example.com</p>
      </div>
    }
  />
);

export const ActivityPanel: FC = (): ReactElement => (
  <DashboardPanel
    title="Recent Activity"
    actions={<button type="button">View All</button>}
    content={
      <ul>
        <li>Profile updated</li>
        <li>Email address verified</li>
      </ul>
    }
  />
);

// ---------------------------------------------------------------------
// 6. Slots with optional content
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly avatar?: ReactNode;
  readonly name: ReactNode;
  readonly details?: ReactNode;
  readonly actions?: ReactNode;
}

export const UserCard: FC<UserCardProps> = ({ avatar, name, details, actions }): ReactElement => (
  <article>
    {avatar && <div>{avatar}</div>}

    <div>
      <h2>{name}</h2>
      {details && <div>{details}</div>}
    </div>

    {actions && <div>{actions}</div>}
  </article>
);

// ---------------------------------------------------------------------
// 7. Slot content can contain behavior
// ---------------------------------------------------------------------

export const InteractiveUserCard: FC = (): ReactElement => (
  <UserCard
    avatar={<span aria-hidden="true">JD</span>}
    name="John Doe"
    details={<span>john@example.com</span>}
    actions={
      <button type="button" onClick={() => console.log("Profile opened")}>
        Open Profile
      </button>
    }
  />
);

// The slot component controls where the content is rendered.
// The caller controls what the supplied slot content contains and how it behaves.

// ---------------------------------------------------------------------
// 8. Children versus named slots
// ---------------------------------------------------------------------

interface MessageCardProps {
  readonly children: ReactNode;
}

export const MessageCard: FC<MessageCardProps> = ({ children }): ReactElement => <section>{children}</section>;

export const NamedMessageCard: FC = (): ReactElement => (
  <Panel header={<h2>Message</h2>} footer={<small>john@example.com</small>}>
    <p>Your account settings were updated.</p>
  </Panel>
);

// `children` is useful when a component has one natural content region.
// Named slots are useful when a component has several distinct content regions.

// ---------------------------------------------------------------------
// 9. Complete slots example
// ---------------------------------------------------------------------

export const ChildrenAsSlotsDemo: FC = (): ReactElement => (
  <div>
    <UserPanel />

    <AccountPanel />

    <ActivityPanel />

    <InteractiveUserCard />

    <Card>
      <h2>Notifications</h2>
      <p>You have no new notifications.</p>
    </Card>
  </div>
);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The children-as-slots pattern lets callers provide content for predefined regions.
// - `children` represents the default or primary content slot.
// - Named ReactNode props can represent distinct slots such as header, footer, actions, or content.
// - The receiving component controls placement while the caller controls the supplied content.
// - Slot content can contain markup, components, event handlers, and other React behavior.
// - A single `children` slot works well for one natural content region.
// - Named slots are useful when a component has multiple semantically distinct regions.

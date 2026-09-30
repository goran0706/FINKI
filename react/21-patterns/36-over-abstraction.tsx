/**
 * Over-Abstraction
 * =================
 *
 * Over-abstraction occurs when a component or abstraction introduces more indirection, configuration,
 * or conceptual complexity than the problem requires. An abstraction should reduce meaningful
 * duplication or isolate a stable responsibility; when it instead makes simple behavior harder to
 * understand, change, or debug, the abstraction has become counterproductive.
 */

// ---------------------------------------------------------------------
// 1. Simple behavior does not always need an abstraction
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

export const SimpleButtonExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return (
    <button type="button" onClick={handleSave}>
      Save
    </button>
  );
};

// An abstraction is not automatically useful just because two pieces of code
// could technically be expressed through the same component or helper.

// ---------------------------------------------------------------------
// 2. Overly generic components can hide simple behavior
// ---------------------------------------------------------------------

interface OverGenericComponentProps {
  readonly content: ReactNode;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
  readonly onPrimaryAction?: () => void;
  readonly onSecondaryAction?: () => void;
  readonly primaryActionLabel?: string;
  readonly secondaryActionLabel?: string;
}

export const OverGenericComponent: FC<OverGenericComponentProps> = ({
  content,
  header,
  footer,
  leading,
  trailing,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel = "Primary",
  secondaryActionLabel = "Secondary",
}): ReactElement => {
  return (
    <section>
      <header>
        {leading}
        {header}
        {trailing}
      </header>

      <div>{content}</div>

      <footer>
        {onPrimaryAction && (
          <button type="button" onClick={onPrimaryAction}>
            {primaryActionLabel}
          </button>
        )}

        {onSecondaryAction && (
          <button type="button" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </button>
        )}

        {footer}
      </footer>
    </section>
  );
};

// A component becomes harder to reason about when its API contains many options
// that are unrelated to the component's actual responsibility.

// ---------------------------------------------------------------------
// 3. A focused component can make the same responsibility explicit
// ---------------------------------------------------------------------

interface AccountPanelProps {
  readonly children: ReactNode;
  readonly onEdit: () => void;
}

export const AccountPanel: FC<AccountPanelProps> = ({ children, onEdit }): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <div>{children}</div>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
    </section>
  );
};

export const FocusedComponentExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <AccountPanel onEdit={handleEdit}>
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </AccountPanel>
  );
};

// The focused component has fewer decisions because it represents one
// recognizable responsibility instead of attempting to represent many layouts.

// ---------------------------------------------------------------------
// 4. Duplicate data shapes do not always require a shared abstraction
// ---------------------------------------------------------------------

interface UserSummary {
  readonly name: string;
  readonly email: string;
}

interface AccountSummary {
  readonly name: string;
  readonly email: string;
}

export const UserSummaryExample: FC = (): ReactElement => {
  const user: UserSummary = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <section>
      <h2>User</h2>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </section>
  );
};

export const AccountSummaryExample: FC = (): ReactElement => {
  const account: AccountSummary = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <section>
      <h2>Account</h2>
      <p>{account.name}</p>
      <p>{account.email}</p>
    </section>
  );
};

// Two types may currently have the same shape while representing different
// concepts. Combining them only because their fields match can create coupling.

// ---------------------------------------------------------------------
// 5. Reuse behavior when the responsibility is genuinely shared
// ---------------------------------------------------------------------

interface Person {
  readonly name: string;
  readonly email: string;
}

interface PersonDetailsProps {
  readonly person: Person;
}

export const PersonDetails: FC<PersonDetailsProps> = ({ person }): ReactElement => {
  return (
    <div>
      <strong>{person.name}</strong>
      <p>{person.email}</p>
    </div>
  );
};

export const GenuineReuseExample: FC = (): ReactElement => {
  const user: Person = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const contact: Person = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
  };

  return (
    <div>
      <PersonDetails person={user} />
      <PersonDetails person={contact} />
    </div>
  );
};

// A shared component is more meaningful when the same rendering responsibility
// exists across multiple consumers, not merely when the data happens to match.

// ---------------------------------------------------------------------
// 6. Configuration can become an abstraction problem
// ---------------------------------------------------------------------

interface ConfigurablePanelProps {
  readonly title: string;
  readonly compact?: boolean;
  readonly bordered?: boolean;
  readonly elevated?: boolean;
  readonly centered?: boolean;
  readonly padded?: boolean;
  readonly muted?: boolean;
  readonly interactive?: boolean;
  readonly children: ReactNode;
}

export const ConfigurablePanel: FC<ConfigurablePanelProps> = ({
  title,
  compact = false,
  bordered = false,
  elevated = false,
  centered = false,
  padded = true,
  muted = false,
  interactive = false,
  children,
}): ReactElement => {
  return (
    <section
      data-compact={compact}
      data-bordered={bordered}
      data-elevated={elevated}
      data-centered={centered}
      data-padded={padded}
      data-muted={muted}
      data-interactive={interactive}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
};

export const ConfigurationExample: FC = (): ReactElement => {
  return (
    <ConfigurablePanel title="Account" compact bordered padded>
      <p>John Doe</p>
    </ConfigurablePanel>
  );
};

// Many independent boolean options create a large combination space.
// Consumers must understand how those options interact before they can use the component.

// ---------------------------------------------------------------------
// 7. Constrained variants can make the API easier to reason about
// ---------------------------------------------------------------------

type PanelVariant = "default" | "compact" | "featured";

interface VariantPanelProps {
  readonly title: string;
  readonly variant?: PanelVariant;
  readonly children: ReactNode;
}

export const VariantPanel: FC<VariantPanelProps> = ({ title, variant = "default", children }): ReactElement => {
  return (
    <section data-variant={variant}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

export const VariantExample: FC = (): ReactElement => {
  return (
    <VariantPanel title="Account" variant="featured">
      <p>John Doe</p>
    </VariantPanel>
  );
};

// A finite set of named variants communicates the supported combinations
// more clearly than a large collection of independent flags.

// ---------------------------------------------------------------------
// 8. Wrapper chains can hide where behavior comes from
// ---------------------------------------------------------------------

interface ContentProps {
  readonly children: ReactNode;
}

const BaseContent: FC<ContentProps> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

const WithSpacing: FC<ContentProps> = ({ children }): ReactElement => {
  return <div data-spacing="medium">{children}</div>;
};

const WithBorder: FC<ContentProps> = ({ children }): ReactElement => {
  return <div data-border="default">{children}</div>;
};

const WithBackground: FC<ContentProps> = ({ children }): ReactElement => {
  return <div data-background="surface">{children}</div>;
};

export const WrapperChainExample: FC = (): ReactElement => {
  return (
    <WithBackground>
      <WithBorder>
        <WithSpacing>
          <BaseContent>
            <p>Account content</p>
          </BaseContent>
        </WithSpacing>
      </WithBorder>
    </WithBackground>
  );
};

// Each wrapper can be reasonable in isolation, but a long chain makes the
// final behavior difficult to locate and increases the number of layers to inspect.

// ---------------------------------------------------------------------
// 9. Composition can replace unnecessary wrapper layers
// ---------------------------------------------------------------------

interface ContentSectionProps {
  readonly children: ReactNode;
}

export const ContentSection: FC<ContentSectionProps> = ({ children }): ReactElement => {
  return (
    <section data-spacing="medium" data-border="default">
      {children}
    </section>
  );
};

export const CompositionInsteadOfWrappersExample: FC = (): ReactElement => {
  return (
    <ContentSection>
      <p>Account content</p>
    </ContentSection>
  );
};

// Composition keeps the meaningful structure visible while allowing the
// implementation to remain inside a focused component.

// ---------------------------------------------------------------------
// 10. Premature generic helpers can make local code harder to read
// ---------------------------------------------------------------------

const createMappedValue = <Input, Output>(value: Input, transform: (value: Input) => Output): Output => {
  return transform(value);
};

export const PrematureGenericHelperExample: FC = (): ReactElement => {
  const userName = createMappedValue("John Doe", (name) => name.toUpperCase());

  return <p>{userName}</p>;
};

// A helper is useful when the abstraction itself has a meaningful reusable
// responsibility. Wrapping a simple local expression can add indirection without benefit.

// ---------------------------------------------------------------------
// 11. Keep simple local transformations local
// ---------------------------------------------------------------------

export const LocalTransformationExample: FC = (): ReactElement => {
  const userName = "John Doe".toUpperCase();

  return <p>{userName}</p>;
};

// The local expression directly communicates what happens. No abstraction is
// necessary when there is no meaningful reuse or responsibility to isolate.

// ---------------------------------------------------------------------
// 12. Abstraction can become harder to debug
// ---------------------------------------------------------------------

interface DataViewProps {
  readonly value: string;
}

export const DataView: FC<DataViewProps> = ({ value }): ReactElement => {
  return <p>{value}</p>;
};

interface DataContainerProps {
  readonly value: string;
}

export const DataContainer: FC<DataContainerProps> = ({ value }): ReactElement => {
  return <DataView value={value} />;
};

interface DataBoundaryProps {
  readonly value: string;
}

export const DataBoundary: FC<DataBoundaryProps> = ({ value }): ReactElement => {
  return <DataContainer value={value} />;
};

export const IndirectionExample: FC = (): ReactElement => {
  return <DataBoundary value="Account loaded." />;
};

// When wrappers only forward props without adding responsibility, the extra
// layers can make it harder to identify where behavior is actually implemented.

// ---------------------------------------------------------------------
// 13. A useful abstraction adds a meaningful boundary
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserListProps {
  readonly users: readonly User[];
  readonly renderUser: (user: User) => ReactNode;
}

export const UserList: FC<UserListProps> = ({ users, renderUser }): ReactElement => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{renderUser(user)}</li>
      ))}
    </ul>
  );
};

export const MeaningfulBoundaryExample: FC = (): ReactElement => {
  const users: readonly User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
  ];

  return (
    <UserList
      users={users}
      renderUser={(user) => (
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
};

// UserList owns a stable responsibility: iterating over users and rendering
// each item. The render function keeps item presentation outside that responsibility.

// ---------------------------------------------------------------------
// 14. Choose the abstraction boundary around stable behavior
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => void;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
};

export const StableBoundaryExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return <SaveButton onSave={handleSave} />;
};

// The component exposes the stable interaction contract while leaving the
// operation itself with the consuming component.

// ---------------------------------------------------------------------
// 15. Complete demonstration
// ---------------------------------------------------------------------

export const OverAbstractionDemo: FC = (): ReactElement => {
  return (
    <main>
      <SimpleButtonExample />
      <FocusedComponentExample />
      <UserSummaryExample />
      <AccountSummaryExample />
      <GenuineReuseExample />
      <ConfigurationExample />
      <VariantExample />
      <WrapperChainExample />
      <CompositionInsteadOfWrappersExample />
      <PrematureGenericHelperExample />
      <LocalTransformationExample />
      <IndirectionExample />
      <MeaningfulBoundaryExample />
      <StableBoundaryExample />
    </main>
  );
};

export default OverAbstractionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Over-abstraction introduces indirection, configuration, or generality that exceeds the problem being solved.
// - A component with one focused responsibility is usually easier to understand than a component supporting unrelated behaviors.
// - Similar data shapes do not automatically mean the underlying concepts should share an abstraction.
// - Large collections of independent configuration flags can create many combinations that consumers must understand.
// - Named variants can constrain supported combinations and make component intent more explicit.
// - Long wrapper chains can hide where behavior originates and make debugging more difficult.
// - Composition can replace wrapper layers when the wrappers do not provide meaningful independent responsibilities.
// - Generic helpers should represent a reusable responsibility rather than simply wrap a simple local expression.
// - An abstraction is more valuable when it creates a stable boundary around behavior that is genuinely shared.
// - The goal is not maximum reuse; the goal is an abstraction whose complexity is justified by the responsibility it isolates.

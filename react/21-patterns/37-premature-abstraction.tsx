/**
 * Premature Abstraction
 * ======================
 *
 * Premature abstraction occurs when a reusable component, helper, or API is introduced before
 * the underlying requirements or repetition are stable enough to justify it. An abstraction
 * created too early can encode assumptions that later become constraints when real use cases diverge.
 */

// ---------------------------------------------------------------------
// 1. Duplication is not automatically a reason to abstract
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

export const UserNameExample: FC = (): ReactElement => {
  const name = "John Doe";

  return <strong>{name}</strong>;
};

export const AccountNameExample: FC = (): ReactElement => {
  const name = "John Doe";

  return <strong>{name}</strong>;
};

// These two components currently render the same markup, but that alone does
// not establish that they represent the same concept or should share an API.

// ---------------------------------------------------------------------
// 2. Similar markup can evolve for different reasons
// ---------------------------------------------------------------------

export const UserHeader: FC = (): ReactElement => {
  return (
    <header>
      <h2>John Doe</h2>
      <p>john.doe@example.com</p>
    </header>
  );
};

export const AccountHeader: FC = (): ReactElement => {
  return (
    <header>
      <h2>John Doe</h2>
      <p>john.doe@example.com</p>
    </header>
  );
};

// The user header and account header happen to have the same structure.
// Their future requirements may differ even though their current markup matches.

// ---------------------------------------------------------------------
// 3. Premature abstraction can force unrelated concepts together
// ---------------------------------------------------------------------

interface PersonHeaderProps {
  readonly title: string;
  readonly description: string;
}

export const PersonHeader: FC<PersonHeaderProps> = ({ title, description }): ReactElement => {
  return (
    <header>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
};

export const ForcedReuseExample: FC = (): ReactElement => {
  return (
    <div>
      <PersonHeader title="John Doe" description="john.doe@example.com" />
      <PersonHeader title="Account" description="Active" />
    </div>
  );
};

// The generic name and API hide the fact that the two uses represent different
// concepts. The abstraction has generalized the markup rather than a stable responsibility.

// ---------------------------------------------------------------------
// 4. Abstracting before requirements are known can create speculative props
// ---------------------------------------------------------------------

interface FutureProofCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly icon?: ReactElement;
  readonly badge?: ReactElement;
  readonly leading?: ReactElement;
  readonly trailing?: ReactElement;
  readonly footer?: ReactElement;
  readonly actions?: ReactElement;
  readonly loading?: boolean;
  readonly compact?: boolean;
  readonly interactive?: boolean;
  readonly selected?: boolean;
  readonly disabled?: boolean;
}

export const FutureProofCard: FC<FutureProofCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  leading,
  trailing,
  footer,
  actions,
  loading = false,
  compact = false,
  interactive = false,
  selected = false,
  disabled = false,
}): ReactElement => {
  return (
    <article data-compact={compact} data-interactive={interactive} data-selected={selected} data-disabled={disabled}>
      <header>
        {leading}
        {icon}
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {badge}
        {trailing}
      </header>

      <div>{loading ? <p>Loading...</p> : <p>Content</p>}</div>

      {actions}
      {footer}
    </article>
  );
};

// Props added for hypothetical future requirements increase the API surface
// without providing evidence that those requirements actually exist.

// ---------------------------------------------------------------------
// 5. Start with the concrete requirement
// ---------------------------------------------------------------------

interface AccountCardProps {
  readonly name: string;
  readonly email: string;
}

export const AccountCard: FC<AccountCardProps> = ({ name, email }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
    </article>
  );
};

export const ConcreteRequirementExample: FC = (): ReactElement => {
  return <AccountCard name="John Doe" email="john.doe@example.com" />;
};

// A concrete component can establish the actual responsibility before a
// generalized API is introduced.

// ---------------------------------------------------------------------
// 6. Repetition becomes more meaningful when behavior is also shared
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserCardProps {
  readonly user: User;
}

export const UserCard: FC<UserCardProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

export const RepeatedResponsibilityExample: FC = (): ReactElement => {
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
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

// Here the repeated responsibility is concrete: rendering the same kind of
// user data with the same structure and semantics.

// ---------------------------------------------------------------------
// 7. Different requirements can reveal the correct boundary
// ---------------------------------------------------------------------

interface UserSummaryProps {
  readonly user: User;
}

export const UserSummary: FC<UserSummaryProps> = ({ user }): ReactElement => {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

interface UserActionsProps {
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export const UserActions: FC<UserActionsProps> = ({ onEdit, onDelete }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export const EvolvingRequirementsExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (): void => {
    console.log("Editing user.");
  };

  const handleDelete = (): void => {
    console.log("Deleting user.");
  };

  return (
    <div>
      <UserSummary user={user} />
      <UserActions onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

// Separating summary and actions keeps each responsibility independent.
// Their APIs can evolve without requiring one generic component to represent both.

// ---------------------------------------------------------------------
// 8. Premature generic helpers can encode the wrong abstraction
// ---------------------------------------------------------------------

const renderValue = <Value,>(value: Value): ReactElement => {
  return <span>{String(value)}</span>;
};

export const PrematureGenericHelperExample: FC = (): ReactElement => {
  return (
    <div>
      {renderValue("John Doe")}
      {renderValue(42)}
      {renderValue(true)}
    </div>
  );
};

// The helper accepts many types, but converting arbitrary values to strings
// does not necessarily represent a meaningful shared UI responsibility.

// ---------------------------------------------------------------------
// 9. Generalize when the repeated behavior becomes clear
// ---------------------------------------------------------------------

interface ValueListProps<Value> {
  readonly values: readonly Value[];
  readonly renderValue: (value: Value) => ReactElement;
}

export const ValueList = <Value,>({ values, renderValue }: ValueListProps<Value>): ReactElement => {
  return (
    <ul>
      {values.map((value, index) => (
        <li key={index}>{renderValue(value)}</li>
      ))}
    </ul>
  );
};

export const MeaningfulGenericExample: FC = (): ReactElement => {
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

  return <ValueList values={users} renderValue={(user) => <span>{user.name}</span>} />;
};

// The generic boundary now represents a stable responsibility: iterating over
// values and delegating item rendering to the consumer.

// ---------------------------------------------------------------------
// 10. Do not design an API around hypothetical consumers
// ---------------------------------------------------------------------

interface SpeculativeButtonProps {
  readonly label: string;
  readonly icon?: ReactElement;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly href?: string;
  readonly target?: string;
  readonly external?: boolean;
  readonly confirm?: boolean;
  readonly confirmMessage?: string;
  readonly analyticsEvent?: string;
  readonly analyticsPayload?: Record<string, unknown>;
}

export const SpeculativeButton: FC<SpeculativeButtonProps> = ({
  label,
  icon,
  loading = false,
  loadingLabel = "Loading...",
  href,
  target,
  external = false,
  confirm = false,
  confirmMessage,
  analyticsEvent,
  analyticsPayload,
}): ReactElement => {
  return (
    <button
      type="button"
      data-href={href}
      data-target={target}
      data-external={external}
      data-confirm={confirm}
      data-confirm-message={confirmMessage}
      data-analytics-event={analyticsEvent}
      data-analytics-payload={JSON.stringify(analyticsPayload)}
    >
      {icon}
      {loading ? loadingLabel : label}
    </button>
  );
};

// Designing for every imagined consumer makes the API difficult to understand.
// The component now carries unrelated responsibilities such as navigation,
// confirmation, analytics, and loading behavior.

// ---------------------------------------------------------------------
// 11. Prefer the requirements that actually exist
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly children: ReactElement | string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

export const ActionButton: FC<ActionButtonProps> = ({ children, onClick, disabled = false }): ReactElement => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export const ActualRequirementsExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return <ActionButton onClick={handleSave}>Save</ActionButton>;
};

// The API represents only the requirements that this component actually owns.

// ---------------------------------------------------------------------
// 12. Abstraction can be introduced after multiple consumers emerge
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
  readonly email: string;
}

interface ProfileHeaderProps {
  readonly profile: Profile;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ profile }): ReactElement => {
  return (
    <header>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
    </header>
  );
};

export const ProfilePageExample: FC = (): ReactElement => {
  const profile: Profile = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return <ProfileHeader profile={profile} />;
};

export const ProfileCardExample: FC = (): ReactElement => {
  const profile: Profile = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
  };

  return <ProfileHeader profile={profile} />;
};

// Once the same responsibility appears in multiple contexts, a shared boundary
// can be introduced based on observed requirements rather than speculation.

// ---------------------------------------------------------------------
// 13. Do not abstract away meaningful differences
// ---------------------------------------------------------------------

interface SearchResult {
  readonly title: string;
  readonly description: string;
}

export const SearchResultItem: FC<{
  readonly result: SearchResult;
}> = ({ result }): ReactElement => {
  return (
    <article>
      <h2>{result.title}</h2>
      <p>{result.description}</p>
    </article>
  );
};

export const SearchResults: FC<{
  readonly results: readonly SearchResult[];
}> = ({ results }): ReactElement => {
  return (
    <section>
      {results.map((result) => (
        <SearchResultItem key={result.title} result={result} />
      ))}
    </section>
  );
};

export const SearchExample: FC = (): ReactElement => {
  const results: readonly SearchResult[] = [
    {
      title: "Account settings",
      description: "Manage account preferences.",
    },
    {
      title: "Profile settings",
      description: "Update profile information.",
    },
  ];

  return <SearchResults results={results} />;
};

// The list owns collection behavior while the item owns item presentation.
// Combining both into one highly configurable abstraction would obscure the boundary.

// ---------------------------------------------------------------------
// 14. A useful abstraction should reduce future change cost
// ---------------------------------------------------------------------

interface LoadingStateProps {
  readonly isLoading: boolean;
  readonly children: ReactElement;
}

export const LoadingState: FC<LoadingStateProps> = ({ isLoading, children }): ReactElement => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return children;
};

export const StableAbstractionExample: FC = (): ReactElement => {
  return (
    <LoadingState isLoading={false}>
      <p>Account details.</p>
    </LoadingState>
  );
};

// This abstraction isolates a concrete, reusable responsibility. Consumers
// do not need to duplicate the loading-state decision around each piece of content.

// ---------------------------------------------------------------------
// 15. Complete demonstration
// ---------------------------------------------------------------------

export const PrematureAbstractionDemo: FC = (): ReactElement => {
  return (
    <main>
      <UserNameExample />
      <AccountNameExample />
      <UserHeader />
      <AccountHeader />
      <ForcedReuseExample />
      <FutureProofCard title="Account" subtitle="John Doe" />
      <ConcreteRequirementExample />
      <RepeatedResponsibilityExample />
      <EvolvingRequirementsExample />
      <PrematureGenericHelperExample />
      <MeaningfulGenericExample />
      <SpeculativeButton label="Save" analyticsEvent="account_save" />
      <ActualRequirementsExample />
      <ProfilePageExample />
      <ProfileCardExample />
      <SearchExample />
      <StableAbstractionExample />
    </main>
  );
};

export default PrematureAbstractionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Premature abstraction introduces a reusable boundary before its requirements or repetition are stable enough to justify it.
// - Similar markup does not necessarily represent the same responsibility or domain concept.
// - Speculative props encode hypothetical requirements and increase the public API without evidence that they are needed.
// - A concrete implementation can reveal the actual responsibility before a reusable abstraction is introduced.
// - Repetition becomes stronger evidence for abstraction when the same behavior, semantics, and responsibility are repeated.
// - Generic helpers should represent meaningful reusable behavior rather than simply accept many possible types.
// - APIs should be designed around current requirements instead of hypothetical future consumers.
// - Meaningful differences between use cases should remain visible instead of being hidden behind a highly configurable abstraction.
// - A shared component becomes more justified when multiple consumers require the same stable responsibility.
// - A useful abstraction should reduce future change cost rather than merely reduce the number of lines of duplicated code.

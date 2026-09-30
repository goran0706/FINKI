/**
 * Component Configuration
 * ========================
 *
 * Component configuration defines the supported ways consumers can customize a component's behavior,
 * appearance, and composition. A well-designed configuration API exposes meaningful options while
 * keeping implementation details internal and preventing unsupported combinations.
 */

// ---------------------------------------------------------------------
// 1. Basic component configuration
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  disabled = false,
  children,
  onClick,
}): ReactElement => {
  return (
    <button type="button" data-variant={variant} data-size={size} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export const BasicConfigurationExample: FC = (): ReactElement => {
  return (
    <div>
      <Button>Save</Button>
      <Button variant="secondary" size="small">
        Cancel
      </Button>
      <Button variant="danger" size="large">
        Delete
      </Button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. Default values provide predictable configuration
// ---------------------------------------------------------------------

interface AlertProps {
  readonly title: string;
  readonly message: string;
  readonly severity?: "info" | "success" | "warning" | "error";
  readonly dismissible?: boolean;
  readonly onDismiss?: () => void;
}

export const Alert: FC<AlertProps> = ({
  title,
  message,
  severity = "info",
  dismissible = false,
  onDismiss,
}): ReactElement => {
  return (
    <section data-severity={severity}>
      <h2>{title}</h2>
      <p>{message}</p>

      {dismissible && onDismiss && (
        <button type="button" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </section>
  );
};

export const DefaultConfigurationExample: FC = (): ReactElement => {
  return <Alert title="Account" message="Your account is ready." />;
};

// ---------------------------------------------------------------------
// 3. Configuration can control presentation
// ---------------------------------------------------------------------

type CardVariant = "default" | "outlined" | "elevated";

interface CardProps {
  readonly variant?: CardVariant;
  readonly padding?: "none" | "small" | "medium" | "large";
  readonly title?: string;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ variant = "default", padding = "medium", title, children }): ReactElement => {
  return (
    <article data-variant={variant} data-padding={padding}>
      {title && <h2>{title}</h2>}
      <div>{children}</div>
    </article>
  );
};

export const PresentationConfigurationExample: FC = (): ReactElement => {
  return (
    <Card variant="outlined" padding="large" title="Account">
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Card>
  );
};

// ---------------------------------------------------------------------
// 4. Configuration can control behavior
// ---------------------------------------------------------------------

interface PaginationProps {
  readonly page: number;
  readonly pageCount: number;
  readonly showFirstLast?: boolean;
  readonly onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  page,
  pageCount,
  showFirstLast = false,
  onPageChange,
}): ReactElement => {
  const goToPage = (nextPage: number): void => {
    if (nextPage >= 1 && nextPage <= pageCount) {
      onPageChange(nextPage);
    }
  };

  return (
    <nav>
      {showFirstLast && (
        <button type="button" disabled={page === 1} onClick={() => goToPage(1)}>
          First
        </button>
      )}

      <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)}>
        Previous
      </button>

      <span>
        Page {page} of {pageCount}
      </span>

      <button type="button" disabled={page === pageCount} onClick={() => goToPage(page + 1)}>
        Next
      </button>

      {showFirstLast && (
        <button type="button" disabled={page === pageCount} onClick={() => goToPage(pageCount)}>
          Last
        </button>
      )}
    </nav>
  );
};

export const BehaviorConfigurationExample: FC = (): ReactElement => {
  const handlePageChange = (page: number): void => {
    console.log("Selected page:", page);
  };

  return <Pagination page={2} pageCount={5} showFirstLast onPageChange={handlePageChange} />;
};

// ---------------------------------------------------------------------
// 5. Configuration can provide custom rendering
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserListProps {
  readonly users: readonly User[];
  readonly renderUser?: (user: User) => ReactNode;
  readonly emptyState?: ReactNode;
}

export const UserList: FC<UserListProps> = ({
  users,
  renderUser = (user) => (
    <div>
      <strong>{user.name}</strong>
      <p>{user.email}</p>
    </div>
  ),
  emptyState = <p>No users found.</p>,
}): ReactElement => {
  if (users.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{renderUser(user)}</li>
      ))}
    </ul>
  );
};

export const RenderingConfigurationExample: FC = (): ReactElement => {
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
        <article>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </article>
      )}
    />
  );
};

// ---------------------------------------------------------------------
// 6. Configuration can expose composition points
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly headerAction?: ReactNode;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, headerAction, footer, children }): ReactElement => {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        {headerAction}
      </header>

      <div>{children}</div>

      {footer && <footer>{footer}</footer>}
    </section>
  );
};

export const CompositionConfigurationExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <Panel
      title="Account"
      headerAction={
        <Button variant="secondary" size="small" onClick={handleEdit}>
          Edit
        </Button>
      }
      footer={<p>Last updated recently.</p>}
    >
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Panel>
  );
};

// ---------------------------------------------------------------------
// 7. Configuration should constrain supported values
// ---------------------------------------------------------------------

type InputSize = "small" | "medium" | "large";
type InputStatus = "default" | "success" | "error";

interface InputProps {
  readonly value: string;
  readonly size?: InputSize;
  readonly status?: InputStatus;
  readonly placeholder?: string;
  readonly onChange: (value: string) => void;
}

export const Input: FC<InputProps> = ({
  value,
  size = "medium",
  status = "default",
  placeholder,
  onChange,
}): ReactElement => {
  return (
    <input
      value={value}
      data-size={size}
      data-status={status}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export const ConstrainedConfigurationExample: FC = (): ReactElement => {
  return (
    <Input
      value="John Doe"
      size="medium"
      status="success"
      placeholder="Enter a name"
      onChange={(value) => console.log("Value:", value)}
    />
  );
};

// ---------------------------------------------------------------------
// 8. Related configuration can be grouped
// ---------------------------------------------------------------------

interface ModalBehavior {
  readonly closeOnBackdropClick?: boolean;
  readonly closeOnEscape?: boolean;
}

interface ModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly behavior?: ModalBehavior;
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ open, title, behavior = {}, children, onClose }): ReactElement | null => {
  const { closeOnBackdropClick = true, closeOnEscape = true } = behavior;

  if (!open) {
    return null;
  }

  const handleBackdropClick = (): void => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div role="presentation" data-close-on-escape={closeOnEscape} onClick={handleBackdropClick}>
      <section role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        {children}
      </section>
    </div>
  );
};

export const GroupedConfigurationExample: FC = (): ReactElement => {
  const handleClose = (): void => {
    console.log("Closing modal.");
  };

  return (
    <Modal
      open
      title="Account"
      behavior={{
        closeOnBackdropClick: true,
        closeOnEscape: true,
      }}
      onClose={handleClose}
    >
      <p>Account details.</p>
    </Modal>
  );
};

// ---------------------------------------------------------------------
// 9. Configuration should avoid unnecessary implementation exposure
// ---------------------------------------------------------------------

interface SearchProps {
  readonly placeholder?: string;
  readonly initialQuery?: string;
  readonly onSearch: (query: string) => void;
}

export const Search: FC<SearchProps> = ({ placeholder = "Search", initialQuery = "", onSearch }): ReactElement => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const input = form.elements.namedItem("query");

        if (input instanceof HTMLInputElement) {
          onSearch(input.value);
        }
      }}
    >
      <input name="query" defaultValue={initialQuery} placeholder={placeholder} />
      <button type="submit">Search</button>
    </form>
  );
};

export const EncapsulationConfigurationExample: FC = (): ReactElement => {
  const handleSearch = (query: string): void => {
    console.log("Searching for:", query);
  };

  return <Search placeholder="Search accounts" initialQuery="John" onSearch={handleSearch} />;
};

// ---------------------------------------------------------------------
// 10. Complete configurable component
// ---------------------------------------------------------------------

type AccountCardVariant = "default" | "compact" | "featured";

interface AccountCardProps {
  readonly user: User;
  readonly variant?: AccountCardVariant;
  readonly showEmail?: boolean;
  readonly verified?: boolean;
  readonly actions?: ReactNode;
  readonly footer?: ReactNode;
}

export const AccountCard: FC<AccountCardProps> = ({
  user,
  variant = "default",
  showEmail = true,
  verified = false,
  actions,
  footer,
}): ReactElement => {
  return (
    <article data-variant={variant}>
      <header>
        <h2>
          {user.name} {verified && <span>Verified</span>}
        </h2>

        {actions}
      </header>

      {showEmail && <p>{user.email}</p>}

      {footer && <footer>{footer}</footer>}
    </article>
  );
};

export const AccountCardExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <AccountCard
      user={user}
      variant="featured"
      showEmail
      verified
      actions={
        <Button variant="secondary" size="small" onClick={handleEdit}>
          Edit
        </Button>
      }
      footer={<p>Account administrator.</p>}
    />
  );
};

// ---------------------------------------------------------------------
// 11. Complete demonstration
// ---------------------------------------------------------------------

export const ComponentConfigurationDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicConfigurationExample />
      <DefaultConfigurationExample />
      <PresentationConfigurationExample />
      <BehaviorConfigurationExample />
      <RenderingConfigurationExample />
      <CompositionConfigurationExample />
      <ConstrainedConfigurationExample />
      <GroupedConfigurationExample />
      <EncapsulationConfigurationExample />
      <AccountCardExample />
    </main>
  );
};

export default ComponentConfigurationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Component configuration defines the supported ways consumers can customize a component.
// - Default values make optional configuration predictable and reduce unnecessary consumer code.
// - Configuration can control presentation, behavior, rendering, and composition.
// - Constrained values make supported configuration explicit and prevent invalid combinations at compile time.
// - Related options can be grouped when they represent one coherent configuration concern.
// - Composition points allow consumers to customize content without exposing internal implementation details.
// - A component should expose meaningful configuration rather than low-level implementation mechanics.
// - A focused configuration API makes a component easier to understand, reuse, and evolve.

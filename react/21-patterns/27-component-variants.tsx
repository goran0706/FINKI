/**
 * Component Variants
 * ===================
 *
 * Component variants represent predefined, named alternatives for a component's presentation
 * or behavior. Variants make supported combinations explicit while allowing consumers to select
 * a meaningful component state through a constrained API.
 */

// ---------------------------------------------------------------------
// 1. Basic component variants
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ variant = "primary", children, onClick }): ReactElement => {
  return (
    <button type="button" data-variant={variant} onClick={onClick}>
      {children}
    </button>
  );
};

export const BasicVariantExample: FC = (): ReactElement => {
  return (
    <div>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="danger">Delete</Button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. Size variants
// ---------------------------------------------------------------------

type ButtonSize = "small" | "medium" | "large";

interface SizedButtonProps {
  readonly size?: ButtonSize;
  readonly children: ReactNode;
}

export const SizedButton: FC<SizedButtonProps> = ({ size = "medium", children }): ReactElement => {
  return (
    <button type="button" data-size={size}>
      {children}
    </button>
  );
};

export const SizeVariantExample: FC = (): ReactElement => {
  return (
    <div>
      <SizedButton size="small">Small</SizedButton>
      <SizedButton size="medium">Medium</SizedButton>
      <SizedButton size="large">Large</SizedButton>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Variants can represent semantic states
// ---------------------------------------------------------------------

type Status = "active" | "pending" | "inactive" | "error";

interface StatusBadgeProps {
  readonly status: Status;
  readonly label: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, label }): ReactElement => {
  return (
    <span data-status={status}>
      {label}: {status}
    </span>
  );
};

export const StatusVariantExample: FC = (): ReactElement => {
  return (
    <div>
      <StatusBadge status="active" label="Account" />
      <StatusBadge status="pending" label="Verification" />
      <StatusBadge status="inactive" label="Subscription" />
      <StatusBadge status="error" label="Connection" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Variants can control component behavior
// ---------------------------------------------------------------------

type DialogVariant = "confirmation" | "information" | "warning";

interface DialogProps {
  readonly variant: DialogVariant;
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export const Dialog: FC<DialogProps> = ({ variant, title, children, onClose }): ReactElement => {
  return (
    <section role="dialog" data-variant={variant}>
      <header>
        <h2>{title}</h2>
      </header>

      <div>{children}</div>

      <footer>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </footer>
    </section>
  );
};

export const BehaviorVariantExample: FC = (): ReactElement => {
  const handleClose = (): void => {
    console.log("Closing dialog.");
  };

  return (
    <Dialog variant="confirmation" title="Delete account" onClose={handleClose}>
      <p>This action requires confirmation.</p>
    </Dialog>
  );
};

// ---------------------------------------------------------------------
// 5. Variants can be combined when dimensions are independent
// ---------------------------------------------------------------------

type CardVariant = "default" | "outlined" | "elevated";
type CardSize = "small" | "medium" | "large";

interface CardProps {
  readonly variant?: CardVariant;
  readonly size?: CardSize;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ variant = "default", size = "medium", children }): ReactElement => {
  return (
    <article data-variant={variant} data-size={size}>
      {children}
    </article>
  );
};

export const CombinedVariantsExample: FC = (): ReactElement => {
  return (
    <Card variant="outlined" size="large">
      <h2>Account</h2>
      <p>John Doe</p>
    </Card>
  );
};

// ---------------------------------------------------------------------
// 6. Variants can provide constrained component states
// ---------------------------------------------------------------------

type InputVariant = "default" | "success" | "error";

interface InputProps {
  readonly value: string;
  readonly variant?: InputVariant;
  readonly message?: string;
  readonly onChange: (value: string) => void;
}

export const Input: FC<InputProps> = ({ value, variant = "default", message, onChange }): ReactElement => {
  return (
    <div data-variant={variant}>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
      {message && <p>{message}</p>}
    </div>
  );
};

export const InputVariantExample: FC = (): ReactElement => {
  return (
    <div>
      <Input value="John Doe" variant="default" onChange={(value) => console.log("Value:", value)} />
      <Input
        value="john.doe@example.com"
        variant="success"
        message="Email is valid."
        onChange={(value) => console.log("Email:", value)}
      />
      <Input value="" variant="error" message="Email is required." onChange={(value) => console.log("Email:", value)} />
    </div>
  );
};

// ---------------------------------------------------------------------
// 7. Discriminated variants can enforce variant-specific props
// ---------------------------------------------------------------------

interface LinkButtonProps {
  readonly variant: "link";
  readonly href: string;
  readonly children: ReactNode;
}

interface ActionButtonProps {
  readonly variant: "action";
  readonly onClick: () => void;
  readonly children: ReactNode;
}

type SmartButtonProps = LinkButtonProps | ActionButtonProps;

export const SmartButton: FC<SmartButtonProps> = (props): ReactElement => {
  if (props.variant === "link") {
    return <a href={props.href}>{props.children}</a>;
  }

  return (
    <button type="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export const DiscriminatedVariantExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return (
    <div>
      <SmartButton variant="link" href="https://example.com">
        View account
      </SmartButton>
      <SmartButton variant="action" onClick={handleSave}>
        Save account
      </SmartButton>
    </div>
  );
};

// ---------------------------------------------------------------------
// 8. Variants can express mutually exclusive states
// ---------------------------------------------------------------------

interface LoadingButtonProps {
  readonly state: "loading";
  readonly children: ReactNode;
}

interface DisabledButtonProps {
  readonly state: "disabled";
  readonly children: ReactNode;
}

interface ReadyButtonProps {
  readonly state: "ready";
  readonly onClick: () => void;
  readonly children: ReactNode;
}

type StatefulButtonProps = LoadingButtonProps | DisabledButtonProps | ReadyButtonProps;

export const StatefulButton: FC<StatefulButtonProps> = (props): ReactElement => {
  if (props.state === "loading") {
    return (
      <button type="button" disabled>
        Loading...
      </button>
    );
  }

  if (props.state === "disabled") {
    return (
      <button type="button" disabled>
        {props.children}
      </button>
    );
  }

  return (
    <button type="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export const StatefulVariantExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return (
    <div>
      <StatefulButton state="ready" onClick={handleSave}>
        Save
      </StatefulButton>
      <StatefulButton state="loading">Save</StatefulButton>
      <StatefulButton state="disabled">Save</StatefulButton>
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Variants should represent meaningful design decisions
// ---------------------------------------------------------------------

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  readonly variant: AlertVariant;
  readonly title: string;
  readonly message: string;
}

export const Alert: FC<AlertProps> = ({ variant, title, message }): ReactElement => {
  return (
    <section data-variant={variant}>
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
};

export const SemanticVariantExample: FC = (): ReactElement => {
  return (
    <div>
      <Alert variant="info" title="Information" message="Your account is ready." />
      <Alert variant="success" title="Saved" message="Your changes were saved." />
      <Alert variant="warning" title="Review required" message="Some account details need attention." />
      <Alert variant="error" title="Unable to save" message="The account could not be updated." />
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Variants should avoid arbitrary styling APIs
// ---------------------------------------------------------------------

type BadgeVariant = "neutral" | "success" | "warning" | "danger";

interface BadgeProps {
  readonly variant?: BadgeVariant;
  readonly children: ReactNode;
}

export const Badge: FC<BadgeProps> = ({ variant = "neutral", children }): ReactElement => {
  return <span data-variant={variant}>{children}</span>;
};

export const ConstrainedVariantExample: FC = (): ReactElement => {
  return (
    <div>
      <Badge variant="neutral">Draft</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Blocked</Badge>
    </div>
  );
};

// ---------------------------------------------------------------------
// 11. Complete component variant example
// ---------------------------------------------------------------------

type AccountCardVariant = "default" | "compact" | "featured";

interface AccountCardProps {
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
  readonly variant?: AccountCardVariant;
  readonly verified?: boolean;
  readonly actions?: ReactNode;
}

export const AccountCard: FC<AccountCardProps> = ({
  user,
  variant = "default",
  verified = false,
  actions,
}): ReactElement => {
  return (
    <article data-variant={variant}>
      <header>
        <h2>
          {user.name} {verified && <span>Verified</span>}
        </h2>
        {actions}
      </header>

      <p>{user.email}</p>
    </article>
  );
};

export const AccountCardExample: FC = (): ReactElement => {
  const user = {
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
      verified
      actions={
        <Button variant="secondary" onClick={handleEdit}>
          Edit
        </Button>
      }
    />
  );
};

// ---------------------------------------------------------------------
// 12. Complete demonstration
// ---------------------------------------------------------------------

export const ComponentVariantsDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicVariantExample />
      <SizeVariantExample />
      <StatusVariantExample />
      <BehaviorVariantExample />
      <CombinedVariantsExample />
      <InputVariantExample />
      <DiscriminatedVariantExample />
      <StatefulVariantExample />
      <SemanticVariantExample />
      <ConstrainedVariantExample />
      <AccountCardExample />
    </main>
  );
};

export default ComponentVariantsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Component variants are predefined, named alternatives for a component's presentation or behavior.
// - String literal unions make supported variant values explicit and type-safe.
// - Independent variant dimensions can be combined when their meanings do not conflict.
// - Discriminated unions can enforce different props for different variants.
// - Mutually exclusive states can use discriminated variants to make invalid combinations unrepresentable.
// - Variants should describe meaningful component states or design decisions rather than arbitrary implementation details.
// - A constrained variant API is preferable to exposing unrestricted styling or configuration values.
// - Variants make component behavior easier to understand, use consistently, and evolve safely.

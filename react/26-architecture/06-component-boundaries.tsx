/**
 * Component Boundaries
 * =====================
 *
 * A component boundary defines what a component owns, what it exposes, and how other parts of
 * the application interact with it. Clear boundaries keep implementation details private while
 * providing stable interfaces for data, events, state, and composition.
 */

import { useState } from "react";
import type { ChangeEvent, FC, ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Basic component boundary
// ---------------------------------------------------------------------

// A component boundary begins with a public interface.
// Consumers need to know what the component accepts, but not how it implements its behavior.
interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <p>Hello, {name}.</p>;
};

// The consumer interacts with the boundary through props.
// The implementation details inside Greeting remain private.
export const GreetingExample: FC = (): ReactElement => {
  return <Greeting name="John Doe" />;
};

// ---------------------------------------------------------------------
// 2. Inputs belong on the boundary
// ---------------------------------------------------------------------

// Props represent explicit inputs into a component.
// They make dependencies visible at the point where the component is used.
interface UserCardProps {
  readonly name: string;
  readonly email: string;
}

export const UserCard: FC<UserCardProps> = ({ name, email }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
    </article>
  );
};

// A component with explicit props does not need to know where its data originated.
// The parent owns the responsibility of obtaining or transforming that data.
export const UserCardExample: FC = (): ReactElement => {
  return <UserCard name="John Doe" email="john@example.com" />;
};

// ---------------------------------------------------------------------
// 3. Outputs belong on the boundary
// ---------------------------------------------------------------------

// Callback props define how a component communicates an event to its parent.
// The component does not need to know what the parent will do with the event.
interface SaveButtonProps {
  readonly onSave: () => void;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  return <button onClick={onSave}>Save</button>;
};

// The parent decides what saving means.
// The button only reports that the user activated it.
export const SaveButtonExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving...");
  };

  return <SaveButton onSave={handleSave} />;
};

// ---------------------------------------------------------------------
// 4. Keep implementation details inside the boundary
// ---------------------------------------------------------------------

interface PasswordInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const PasswordInput: FC<PasswordInputProps> = ({ value, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return <input type="password" value={value} onChange={handleChange} />;
};

// Consumers work with a string value rather than a browser event.
// The component boundary hides the DOM event representation.
export const PasswordInputExample: FC = (): ReactElement => {
  const [password, setPassword] = useState("");

  return <PasswordInput value={password} onChange={setPassword} />;
};

// ---------------------------------------------------------------------
// 5. Narrow boundaries
// ---------------------------------------------------------------------

// A boundary should expose only the capabilities its consumers need.
// This interface is intentionally smaller than a possible full application service.
interface UserNameSource {
  readonly getUserName: () => string;
}

interface UserGreetingProps {
  readonly user: UserNameSource;
}

export const UserGreeting: FC<UserGreetingProps> = ({ user }): ReactElement => {
  return <p>Welcome, {user.getUserName()}.</p>;
};

// The component depends on one capability instead of an entire service object.
export const UserGreetingExample: FC = (): ReactElement => {
  const user: UserNameSource = {
    getUserName: () => "John Doe",
  };

  return <UserGreeting user={user} />;
};

// ---------------------------------------------------------------------
// 6. Avoid leaking internal state
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ value, onChange }): ReactElement => {
  const handleClick = (): void => {
    onChange(!value);
  };

  return (
    <button type="button" onClick={handleClick} aria-pressed={value}>
      {value ? "Enabled" : "Disabled"}
    </button>
  );
};

// The component does not expose how its state is represented internally.
// Consumers interact with a boolean value and a semantic change operation.
export const ToggleExample: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return <Toggle value={enabled} onChange={setEnabled} />;
};

// ---------------------------------------------------------------------
// 7. State ownership is a boundary decision
// ---------------------------------------------------------------------

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ value, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return <input value={value} onChange={handleChange} placeholder="Search" />;
};

// State belongs to the component that needs to coordinate it.
// Here the parent owns the query because another component may also need it.
export const SearchExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <section>
      <SearchInput value={query} onChange={setQuery} />
      <p>Searching for: {query || "nothing"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. Local state can remain inside the boundary
// ---------------------------------------------------------------------

interface DisclosureProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Disclosure: FC<DisclosureProps> = ({ title, children }): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} {title}
      </button>
      {open && <div>{children}</div>}
    </section>
  );
};

// The open/closed state is an implementation detail because no parent needs to coordinate it.
export const DisclosureExample: FC = (): ReactElement => {
  return (
    <Disclosure title="Details">
      <p>Additional information.</p>
    </Disclosure>
  );
};

// ---------------------------------------------------------------------
// 9. Composition creates a boundary
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

// The panel owns its structural presentation.
// The parent owns the content that belongs inside the panel.
export const PanelExample: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <p>Account information.</p>
    </Panel>
  );
};

// ---------------------------------------------------------------------
// 10. Children can prevent unnecessary coupling
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly sidebar: ReactNode;
  readonly children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ sidebar, children }): ReactElement => {
  return (
    <div>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
};

// Layout does not need to know which components produce its content.
// The boundary is based on composition rather than concrete component types.
export const LayoutExample: FC = (): ReactElement => {
  return (
    <Layout sidebar={<nav>Navigation</nav>}>
      <article>Main content</article>
    </Layout>
  );
};

// ---------------------------------------------------------------------
// 11. Semantic callbacks create stable boundaries
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductListProps {
  readonly products: readonly Product[];
  readonly onProductSelect: (productId: string) => void;
}

export const ProductList: FC<ProductListProps> = ({ products, onProductSelect }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button type="button" onClick={() => onProductSelect(product.id)}>
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

// The child reports a domain-level event rather than exposing its DOM event.
export const ProductListExample: FC = (): ReactElement => {
  const products: readonly Product[] = [
    { id: "product-1", name: "Notebook", priceInCents: 1200 },
    { id: "product-2", name: "Pen", priceInCents: 500 },
  ];

  const handleProductSelect = (productId: string): void => {
    console.log(`Selected product: ${productId}`);
  };

  return <ProductList products={products} onProductSelect={handleProductSelect} />;
};

// ---------------------------------------------------------------------
// 12. Avoid control-oriented component APIs
// ---------------------------------------------------------------------

// A control-oriented API exposes implementation decisions instead of intent.
interface WeakModalProps {
  readonly open: boolean;
  readonly mode: "create" | "edit" | "delete";
  readonly animation: "fade" | "slide";
}

// A more stable boundary describes what the consumer wants to accomplish.
interface ModalProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ title, children, onClose }): ReactElement => {
  return (
    <section role="dialog" aria-modal="true">
      <header>
        <h2>{title}</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </header>
      {children}
    </section>
  );
};

// The internal animation, positioning, and state-management strategy can change
// without forcing consumers to change their usage of the component.
export const ModalExample: FC = (): ReactElement => {
  const [open, setOpen] = useState(true);

  if (!open) {
    return <button onClick={() => setOpen(true)}>Open</button>;
  }

  return (
    <Modal title="Account" onClose={() => setOpen(false)}>
      <p>Account details.</p>
    </Modal>
  );
};

// ---------------------------------------------------------------------
// 13. Data transformation can protect the boundary
// ---------------------------------------------------------------------

interface ApiUser {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
}

interface DisplayUser {
  readonly id: string;
  readonly displayName: string;
}

// External representations do not need to become component contracts.
// Transform them before crossing the presentation boundary.
const toDisplayUser = (user: ApiUser): DisplayUser => {
  return {
    id: user.id,
    displayName: `${user.first_name} ${user.last_name}`,
  };
};

interface DisplayUserProps {
  readonly user: DisplayUser;
}

export const DisplayUser: FC<DisplayUserProps> = ({ user }): ReactElement => {
  return <p>{user.displayName}</p>;
};

export const DisplayUserExample: FC = (): ReactElement => {
  const apiUser: ApiUser = {
    id: "user-1",
    first_name: "John",
    last_name: "Doe",
  };

  const user = toDisplayUser(apiUser);

  return <DisplayUser user={user} />;
};

// ---------------------------------------------------------------------
// 14. Do not expose infrastructure through UI boundaries
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly getProduct: (id: string) => Promise<Product>;
}

interface ProductDetailsProps {
  readonly product: Product;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
    </article>
  );
};

// ProductDetails does not know about HTTP clients, database drivers, URLs,
// request headers, or serialization formats.
export const ProductDetailsExample: FC<ProductDetailsProps> = ({ product }): ReactElement => {
  return <ProductDetails product={product} />;
};

// ---------------------------------------------------------------------
// 15. Component boundaries can separate infrastructure and presentation
// ---------------------------------------------------------------------

const createProductRepository = (): ProductRepository => {
  return {
    getProduct: async (id: string): Promise<Product> => {
      return {
        id,
        name: "Notebook",
        priceInCents: 1200,
      };
    },
  };
};

interface ProductPageProps {
  readonly repository: ProductRepository;
  readonly productId: string;
}

export const ProductPage: FC<ProductPageProps> = ({ repository, productId }): ReactElement => {
  const product: Product = {
    id: productId,
    name: "Notebook",
    priceInCents: 1200,
  };

  void repository;
  return <ProductDetails product={product} />;
};

export const ProductPageExample: FC = (): ReactElement => {
  const repository = createProductRepository();

  return <ProductPage repository={repository} productId="product-1" />;
};

// ---------------------------------------------------------------------
// 16. Boundaries should not expose unnecessary object graphs
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly name: string;
  readonly settings: {
    readonly theme: "light" | "dark";
    readonly language: string;
  };
}

interface AccountHeaderProps {
  readonly name: string;
}

export const AccountHeader: FC<AccountHeaderProps> = ({ name }): ReactElement => {
  return <h1>{name}</h1>;
};

// Passing only the required value keeps the boundary smaller than the source object.
export const AccountHeaderExample: FC = (): ReactElement => {
  const account: Account = {
    id: "account-1",
    name: "John Doe",
    settings: {
      theme: "light",
      language: "en",
    },
  };

  return <AccountHeader name={account.name} />;
};

// ---------------------------------------------------------------------
// 17. Stable boundaries reduce change propagation
// ---------------------------------------------------------------------

interface AvatarProps {
  readonly imageUrl: string;
  readonly alt: string;
}

export const Avatar: FC<AvatarProps> = ({ imageUrl, alt }): ReactElement => {
  return <img src={imageUrl} alt={alt} />;
};

// The consumer depends on a small rendering contract.
// Internal image-loading, caching, or optimization strategies can change independently.
export const AvatarExample: FC = (): ReactElement => {
  return <Avatar imageUrl="https://example.com/avatar.jpg" alt="John Doe" />;
};

// ---------------------------------------------------------------------
// 18. Avoid leaking internal event objects
// ---------------------------------------------------------------------

interface TextFieldProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
}

export const TextField: FC<TextFieldProps> = ({ value, onValueChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onValueChange(event.target.value);
  };

  return <input value={value} onChange={handleChange} />;
};

// The parent does not need to know that the component uses an HTML input.
export const TextFieldExample: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  return <TextField value={value} onValueChange={setValue} />;
};

// ---------------------------------------------------------------------
// 19. Boundary ownership should be explicit
// ---------------------------------------------------------------------

interface CounterProps {
  readonly value: number;
  readonly onIncrement: () => void;
}

export const Counter: FC<CounterProps> = ({ value, onIncrement }): ReactElement => {
  return (
    <div>
      <p>Count: {value}</p>
      <button type="button" onClick={onIncrement}>
        Increment
      </button>
    </div>
  );
};

// The parent owns the count because the state is part of its coordination responsibility.
export const CounterExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return <Counter value={count} onIncrement={() => setCount(count + 1)} />;
};

// ---------------------------------------------------------------------
// 20. Boundaries should expose intent rather than implementation
// ---------------------------------------------------------------------

interface DialogActionsProps {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const DialogActions: FC<DialogActionsProps> = ({ onConfirm, onCancel }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" onClick={onConfirm}>
        Confirm
      </button>
    </div>
  );
};

// `onConfirm` communicates intent.
// A lower-level API such as `onButtonClick` would expose less useful information.
export const DialogActionsExample: FC = (): ReactElement => {
  const handleConfirm = (): void => {
    console.log("Confirmed");
  };

  const handleCancel = (): void => {
    console.log("Cancelled");
  };

  return <DialogActions onConfirm={handleConfirm} onCancel={handleCancel} />;
};

// ---------------------------------------------------------------------
// 21. Feature boundaries
// ---------------------------------------------------------------------

interface CheckoutSummaryProps {
  readonly itemCount: number;
  readonly totalInCents: number;
  readonly onCheckout: () => void;
}

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({ itemCount, totalInCents, onCheckout }): ReactElement => {
  return (
    <section>
      <p>Items: {itemCount}</p>
      <p>Total: ${(totalInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={onCheckout}>
        Checkout
      </button>
    </section>
  );
};

// A feature boundary can expose only the information required to perform the feature.
// The component does not need access to the entire cart or account model.
export const CheckoutSummaryExample: FC = (): ReactElement => {
  const handleCheckout = (): void => {
    console.log("Checkout started");
  };

  return <CheckoutSummary itemCount={2} totalInCents={3500} onCheckout={handleCheckout} />;
};

// ---------------------------------------------------------------------
// 22. Avoid leaky boundaries
// ---------------------------------------------------------------------

// This boundary leaks a storage implementation detail into the component API.
interface LeakyPreferencesProps {
  readonly storageKey: string;
}

// A better boundary expresses the data required by the component.
interface PreferencesProps {
  readonly theme: "light" | "dark";
  readonly onThemeChange: (theme: "light" | "dark") => void;
}

export const Preferences: FC<PreferencesProps> = ({ theme, onThemeChange }): ReactElement => {
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button type="button" onClick={() => onThemeChange(nextTheme)}>
      Theme: {theme}
    </button>
  );
};

// Storage can be introduced outside the component without changing this boundary.
export const PreferencesExample: FC = (): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return <Preferences theme={theme} onThemeChange={setTheme} />;
};

// ---------------------------------------------------------------------
// 23. Boundary smells
// ---------------------------------------------------------------------

// A boundary becomes suspicious when it:
// - exposes many unrelated props
// - requires consumers to understand internal state
// - accepts infrastructure objects unnecessarily
// - exposes DOM events when semantic events would suffice
// - requires consumers to coordinate internal implementation steps
// - changes frequently because of unrelated internal details
//
// These are signals to investigate, not automatic proof that a component is badly designed.

// ---------------------------------------------------------------------
// 24. Too many props can indicate multiple responsibilities
// ---------------------------------------------------------------------

interface OverloadedProfileProps {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly isOnline: boolean;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onMessage: () => void;
  readonly onSettings: () => void;
}

// A large interface is not inherently wrong.
// It becomes problematic when the props represent several independent responsibilities.
//
// A useful refactoring is to identify distinct interaction and presentation boundaries
// rather than blindly splitting every prop into a separate component.

// ---------------------------------------------------------------------
// 25. Stable boundaries and optional behavior
// ---------------------------------------------------------------------

interface NoticeProps {
  readonly message: string;
  readonly action?: ReactNode;
}

export const Notice: FC<NoticeProps> = ({ message, action }): ReactElement => {
  return (
    <aside>
      <span>{message}</span>
      {action}
    </aside>
  );
};

// Optional composition keeps the core boundary small while allowing consumers
// to provide additional behavior when needed.
export const NoticeExample: FC = (): ReactElement => {
  return <Notice message="Your changes were saved." action={<button type="button">Undo</button>} />;
};

// ---------------------------------------------------------------------
// 26. Boundary tests should use the public contract
// ---------------------------------------------------------------------

interface StatusBadgeProps {
  readonly status: "active" | "inactive";
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }): ReactElement => {
  return <span>{status === "active" ? "Active" : "Inactive"}</span>;
};

// A test should normally verify the public behavior:
// given a status, the component renders the corresponding result.
//
// It should not need to know whether StatusBadge uses a span, helper function,
// conditional expression, CSS class, or another internal representation.

// ---------------------------------------------------------------------
// 27. Refactoring toward a boundary
// ---------------------------------------------------------------------

interface Order {
  readonly id: string;
  readonly totalInCents: number;
}

interface OrderSummaryProps {
  readonly order: Order;
  readonly onViewDetails: (orderId: string) => void;
}

export const OrderSummary: FC<OrderSummaryProps> = ({ order, onViewDetails }): ReactElement => {
  return (
    <article>
      <p>Order total: ${(order.totalInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={() => onViewDetails(order.id)}>
        View details
      </button>
    </article>
  );
};

// The boundary contains the minimum information needed for presentation and interaction.
// The component does not need the entire application state.
export const OrderSummaryExample: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    totalInCents: 4200,
  };

  const handleViewDetails = (orderId: string): void => {
    console.log(`Viewing order: ${orderId}`);
  };

  return <OrderSummary order={order} onViewDetails={handleViewDetails} />;
};

// ---------------------------------------------------------------------
// 28. Complete boundary example
// ---------------------------------------------------------------------

interface Profile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface ProfileCardProps {
  readonly profile: Profile;
  readonly onEdit: (profileId: string) => void;
}

export const ProfileCard: FC<ProfileCardProps> = ({ profile, onEdit }): ReactElement => {
  return (
    <article>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
      <button type="button" onClick={() => onEdit(profile.id)}>
        Edit
      </button>
    </article>
  );
};

export const ProfilePage: FC = (): ReactElement => {
  const profile: Profile = {
    id: "profile-1",
    name: "John Doe",
    email: "john@example.com",
  };

  const handleEdit = (profileId: string): void => {
    console.log(`Editing profile: ${profileId}`);
  };

  return <ProfileCard profile={profile} onEdit={handleEdit} />;
};

// The boundary is explicit:
//
// ProfilePage owns:
// - obtaining the profile
// - deciding what happens after editing
//
// ProfileCard owns:
// - displaying profile information
// - translating the user interaction into the onEdit callback
//
// Neither component needs to know the other's internal implementation.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A component boundary defines what a component owns, accepts, and exposes.
// - Props are explicit inputs into a component boundary.
// - Callback props define explicit outputs and communication paths.
// - State ownership should remain with the component that needs to coordinate that state.
// - Local implementation details should remain inside the component boundary.
// - Composition through children and ReactNode can reduce coupling between components.
// - Semantic callbacks are generally more stable than exposing low-level DOM events.
// - Narrow interfaces prevent components from depending on unnecessary capabilities.
// - Data transformation can prevent external representations from leaking into UI boundaries.
// - Infrastructure concerns should not become accidental component API requirements.
// - Stable boundaries reduce the number of consumers affected by internal changes.
// - Large or frequently changing boundaries can indicate multiple responsibilities or leakage.
// - Component boundaries should be designed around ownership, intent, and public behavior.

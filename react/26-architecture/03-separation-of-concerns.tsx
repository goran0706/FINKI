/**
 * Separation of Concerns
 * =======================
 *
 * Separation of concerns means organizing an application so that different kinds of
 * responsibilities are handled independently. In React, this commonly means separating
 * UI rendering from state management, data access, domain logic, validation, and side effects.
 *
 * Separation does not require every concern to live in a different file or component.
 * The goal is to create boundaries that keep unrelated responsibilities from becoming
 * unnecessarily dependent on one another.
 */

import { type FC, type FormEvent, type ReactElement, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. A concern is a distinct kind of responsibility
// ---------------------------------------------------------------------

// Common concerns in a React application include:
//
// - rendering UI
// - handling user interaction
// - managing component state
// - validating input
// - transforming data
// - performing network requests
// - persisting data
// - applying business rules
// - handling browser APIs
//
// Separation of concerns means these responsibilities do not all have to be
// implemented in the same component or function.

// ---------------------------------------------------------------------
// 2. Keep simple presentation focused on presentation
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <section>
      <h1>Hello, {name}</h1>
      <p>Welcome to your account.</p>
    </section>
  );
};

// `Greeting` has a presentation concern.
// It does not need to know where the name came from or how it was stored.

// ---------------------------------------------------------------------
// 3. Separate data from presentation
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
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

// `UserCard` receives already-prepared data.
// The component does not need to know whether the user came from an API,
// a database, a server component, or local application state.

// ---------------------------------------------------------------------
// 4. Keep data access separate from presentation
// ---------------------------------------------------------------------

async function getUser(userId: string): Promise<User> {
  console.log(`Load user ${userId}.`);

  return {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
  };
}

// `getUser` represents a data-access concern.
// It can change independently of the markup rendered by `UserCard`.

// ---------------------------------------------------------------------
// 5. A component can coordinate data and presentation
// ---------------------------------------------------------------------

interface UserProfileProps {
  readonly userId: string;
}

export const UserProfile: FC<UserProfileProps> = ({ userId }): ReactElement => {
  const [user, setUser] = useState<User | null>(null);

  const handleLoad = async (): Promise<void> => {
    const nextUser = await getUser(userId);

    setUser(nextUser);
  };

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          void handleLoad();
        }}
      >
        Load profile
      </button>

      {user !== null && <UserCard user={user} />}
    </section>
  );
};

// The component coordinates application state and presentation.
// The actual data-access operation remains separate.

// ---------------------------------------------------------------------
// 6. Separate validation from form presentation
// ---------------------------------------------------------------------

interface LoginValues {
  readonly email: string;
  readonly password: string;
}

interface ValidationResult {
  readonly valid: boolean;
  readonly message: string | null;
}

function validateLogin(values: LoginValues): ValidationResult {
  if (!values.email.includes("@")) {
    return {
      valid: false,
      message: "Enter a valid email address.",
    };
  }

  if (values.password.length < 8) {
    return {
      valid: false,
      message: "Password must contain at least 8 characters.",
    };
  }

  return {
    valid: true,
    message: null,
  };
}

// Validation is a separate concern because the rules can be tested and changed
// without changing the form's JSX structure.

// ---------------------------------------------------------------------
// 7. The form handles interaction, not validation implementation
// ---------------------------------------------------------------------

export const LoginForm: FC = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = validateLogin({
      email,
      password,
    });

    if (!result.valid) {
      setError(result.message);
      return;
    }

    setError(null);
    console.log("Submit login.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        type="email"
        placeholder="Email"
      />

      <input
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        type="password"
        placeholder="Password"
      />

      <button type="submit">Sign in</button>

      {error !== null && <p role="alert">{error}</p>}
    </form>
  );
};

// The form owns input state and interaction.
// `validateLogin` owns the validation rules.

// ---------------------------------------------------------------------
// 8. Separate transformation from rendering
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductViewModel {
  readonly id: string;
  readonly title: string;
  readonly price: string;
}

function toProductViewModel(product: Product): ProductViewModel {
  return {
    id: product.id,
    title: product.name,
    price: `$${(product.priceInCents / 100).toFixed(2)}`,
  };
}

// Data transformation is independent of the component that renders the result.

// ---------------------------------------------------------------------
// 9. Render the transformed data
// ---------------------------------------------------------------------

interface ProductCardProps {
  readonly product: ProductViewModel;
}

export const ProductCard: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.title}</h2>
      <p>{product.price}</p>
    </article>
  );
};

// The component does not need to know that the original price was stored in cents.
// That implementation detail belongs to the transformation concern.

// ---------------------------------------------------------------------
// 10. Separate domain rules from formatting
// ---------------------------------------------------------------------

function calculateDiscount(priceInCents: number, percentage: number): number {
  return Math.round(priceInCents * (percentage / 100));
}

function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

// Calculation and formatting are different concerns.
// The first determines a value; the second determines how that value is displayed.

// ---------------------------------------------------------------------
// 11. Use domain logic from a UI component
// ---------------------------------------------------------------------

interface PriceSummaryProps {
  readonly priceInCents: number;
  readonly discountPercentage: number;
}

export const PriceSummary: FC<PriceSummaryProps> = ({ priceInCents, discountPercentage }): ReactElement => {
  const discount = calculateDiscount(priceInCents, discountPercentage);

  const finalPrice = priceInCents - discount;

  return (
    <section>
      <p>Original: {formatPrice(priceInCents)}</p>

      <p>Discount: {formatPrice(discount)}</p>

      <strong>Final: {formatPrice(finalPrice)}</strong>
    </section>
  );
};

// The component coordinates the presentation.
// Domain calculation and formatting remain independently understandable.

// ---------------------------------------------------------------------
// 12. Separate side effects from pure calculations
// ---------------------------------------------------------------------

function calculateTotal(prices: readonly number[]): number {
  return prices.reduce((total, price) => total + price, 0);
}

function saveTotal(total: number): void {
  console.log(`Save total ${total}.`);
}

// `calculateTotal` is a pure calculation.
// `saveTotal` represents a side effect.
// Keeping them separate makes the calculation deterministic and easy to test.

// ---------------------------------------------------------------------
// 13. Components can coordinate side effects
// ---------------------------------------------------------------------

interface CartSummaryProps {
  readonly prices: readonly number[];
}

export const CartSummary: FC<CartSummaryProps> = ({ prices }): ReactElement => {
  const total = calculateTotal(prices);

  const handleSave = (): void => {
    saveTotal(total);
  };

  return (
    <section>
      <p>Total: ${total.toFixed(2)}</p>

      <button type="button" onClick={handleSave}>
        Save total
      </button>
    </section>
  );
};

// The component connects the UI event to the side effect.
// It does not need to embed the calculation and persistence implementation
// directly into the event handler.

// ---------------------------------------------------------------------
// 14. Separate browser concerns from domain logic
// ---------------------------------------------------------------------

function isValidProductName(name: string): boolean {
  return name.trim().length >= 3;
}

function readStoredProductName(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("product-name");
}

// Validation is a domain concern.
// `localStorage` access is a browser/platform concern.
// Keeping them separate prevents domain logic from depending on browser APIs.

// ---------------------------------------------------------------------
// 15. Components can coordinate browser state
// ---------------------------------------------------------------------

export const StoredProductName: FC = (): ReactElement => {
  const [name, setName] = useState(() => readStoredProductName() ?? "");

  const handleChange = (value: string): void => {
    setName(value);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("product-name", value);
    }
  };

  return (
    <label>
      Product name
      <input
        value={name}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      />
    </label>
  );
};

// The component coordinates browser persistence with the input.
// The product-name validation rule remains independent of localStorage.

// ---------------------------------------------------------------------
// 16. Separate reusable state behavior into a custom hook
// ---------------------------------------------------------------------

interface UseToggleResult {
  readonly value: boolean;
  readonly toggle: () => void;
}

function useToggle(initialValue = false): UseToggleResult {
  const [value, setValue] = useState(initialValue);

  const toggle = (): void => {
    setValue((currentValue) => !currentValue);
  };

  return {
    value,
    toggle,
  };
}

// The hook owns reusable state behavior.
// A component can consume that behavior without duplicating the implementation.

// ---------------------------------------------------------------------
// 17. Use the hook from a component
// ---------------------------------------------------------------------

export const SettingsPanel: FC = (): ReactElement => {
  const { value: isOpen, toggle } = useToggle();

  return (
    <section>
      <button type="button" onClick={toggle} aria-expanded={isOpen}>
        {isOpen ? "Hide settings" : "Show settings"}
      </button>

      {isOpen && (
        <div>
          <p>Settings content.</p>
        </div>
      )}
    </section>
  );
};

// The component owns the visual representation.
// The hook owns the reusable toggle-state behavior.

// ---------------------------------------------------------------------
// 18. Separate asynchronous state management from presentation
// ---------------------------------------------------------------------

interface AsyncState<T> {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly data: T | null;
  readonly error: string | null;
}

function createInitialAsyncState<T>(): AsyncState<T> {
  return {
    status: "idle",
    data: null,
    error: null,
  };
}

// This type describes asynchronous state.
// It does not contain any UI markup or network implementation.

// ---------------------------------------------------------------------
// 19. Keep the data source independent
// ---------------------------------------------------------------------

async function loadProducts(): Promise<Product[]> {
  console.log("Load products.");

  return [
    {
      id: "product-1",
      name: "Example Product",
      priceInCents: 2500,
    },
  ];
}

// The function represents a data-access concern.
// It can later be replaced with a real API client without requiring
// the presentation component to understand the transport mechanism.

// ---------------------------------------------------------------------
// 20. A component can coordinate asynchronous state
// ---------------------------------------------------------------------

export const ProductList: FC = (): ReactElement => {
  const [state, setState] = useState<AsyncState<Product[]>>(createInitialAsyncState);

  const handleLoad = async (): Promise<void> => {
    setState({
      status: "loading",
      data: null,
      error: null,
    });

    try {
      const products = await loadProducts();

      setState({
        status: "success",
        data: products,
        error: null,
      });
    } catch {
      setState({
        status: "error",
        data: null,
        error: "Unable to load products.",
      });
    }
  };

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          void handleLoad();
        }}
      >
        Load products
      </button>

      {state.status === "loading" && <p>Loading...</p>}

      {state.status === "error" && <p role="alert">{state.error}</p>}

      {state.status === "success" && (
        <div>
          {state.data?.map((product) => (
            <ProductCard key={product.id} product={toProductViewModel(product)} />
          ))}
        </div>
      )}
    </section>
  );
};

// The component coordinates asynchronous state and presentation.
// Loading the data and transforming individual products remain separate concerns.

// ---------------------------------------------------------------------
// 21. Separate concerns through composition
// ---------------------------------------------------------------------

interface PageLayoutProps {
  readonly header: ReactNode;
  readonly children: ReactNode;
}

export const PageLayout: FC<PageLayoutProps> = ({ header, children }): ReactElement => {
  return (
    <div>
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
};

// Layout concerns are independent from the content rendered inside the layout.

// ---------------------------------------------------------------------
// 22. Compose independently responsible pieces
// ---------------------------------------------------------------------

export const ProductPage: FC = (): ReactElement => {
  return (
    <PageLayout header={<Greeting name="John Doe" />}>
      <ProductList />
    </PageLayout>
  );
};

// `ProductPage` composes the application pieces.
// It does not need to reimplement layout, greeting, loading, or product rendering.

// ---------------------------------------------------------------------
// 23. Separate feature state from reusable presentation
// ---------------------------------------------------------------------

interface SelectProps {
  readonly value: string;
  readonly options: readonly string[];
  readonly onChange: (value: string) => void;
}

export const Select: FC<SelectProps> = ({ value, options, onChange }): ReactElement => {
  return (
    <select
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// `Select` is concerned with rendering and interacting with a select control.
// It does not decide what the selected value means to a feature.

// ---------------------------------------------------------------------
// 24. Feature logic can own the meaning of the value
// ---------------------------------------------------------------------

export const ProductFilter: FC = (): ReactElement => {
  const [category, setCategory] = useState("All");

  return (
    <section>
      <Select value={category} options={["All", "Books", "Games"]} onChange={setCategory} />

      <p>Selected category: {category}</p>
    </section>
  );
};

// The feature owns the category state because it gives that state meaning.
// The generic select control only handles the mechanics of selection.

// ---------------------------------------------------------------------
// 25. Separate reusable formatting from feature decisions
// ---------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

interface DateLabelProps {
  readonly date: Date;
}

export const DateLabel: FC<DateLabelProps> = ({ date }): ReactElement => {
  return <time dateTime={date.toISOString()}>{formatDate(date)}</time>;
};

// Formatting is isolated from the feature that decides which date to display.

// ---------------------------------------------------------------------
// 26. Separate authorization decisions from presentation
// ---------------------------------------------------------------------

interface PermissionState {
  readonly canEdit: boolean;
}

function canEditProduct(userId: string, productId: string): boolean {
  console.log(`Check permissions for ${userId} and ${productId}.`);

  return true;
}

// Authorization logic should be treated as its own concern.
// In a real application, security-sensitive authorization must be enforced
// on the server or other trusted boundary rather than only in the UI.

// ---------------------------------------------------------------------
// 27. The UI can consume an authorization decision
// ---------------------------------------------------------------------

interface EditProductButtonProps {
  readonly allowed: boolean;
  readonly onEdit: () => void;
}

export const EditProductButton: FC<EditProductButtonProps> = ({ allowed, onEdit }): ReactElement => {
  if (!allowed) {
    return <></>;
  }

  return <Button onClick={onEdit}>Edit</Button>;
};

// The button renders according to a permission decision.
// It does not determine the application's authorization policy.

// ---------------------------------------------------------------------
// 28. Keep environment-specific concerns at a boundary
// ---------------------------------------------------------------------

function getApiBaseUrl(): string {
  return "https://example.com/api";
}

async function fetchProduct(productId: string): Promise<Product> {
  const response = await fetch(`${getApiBaseUrl()}/products/${productId}`);

  if (!response.ok) {
    throw new Error("Unable to load product.");
  }

  return response.json() as Promise<Product>;
}

// API configuration and HTTP communication are infrastructure concerns.
// The UI does not need to construct URLs or interpret HTTP responses directly.

// ---------------------------------------------------------------------
// 29. Components consume application-level results
// ---------------------------------------------------------------------

interface RemoteProductProps {
  readonly productId: string;
}

export const RemoteProduct: FC<RemoteProductProps> = ({ productId }): ReactElement => {
  const [product, setProduct] = useState<Product | null>(null);

  const handleLoad = async (): Promise<void> => {
    const nextProduct = await fetchProduct(productId);

    setProduct(nextProduct);
  };

  return (
    <section>
      <Button
        onClick={() => {
          void handleLoad();
        }}
      >
        Load product
      </Button>

      {product !== null && <ProductCard product={toProductViewModel(product)} />}
    </section>
  );
};

// The component coordinates user interaction and application state.
// HTTP details remain behind the data-access boundary.

// ---------------------------------------------------------------------
// 30. Do not confuse separation with isolation
// ---------------------------------------------------------------------

// Separated concerns still need to collaborate:
//
// UI
//  -> application state
//      -> domain logic
//          -> data access
//
// Separation means the boundaries are explicit.
// It does not mean every concern must operate independently without communication.

// ---------------------------------------------------------------------
// 31. Keep related concerns together
// ---------------------------------------------------------------------

interface NotificationProps {
  readonly message: string;
  readonly onDismiss: () => void;
}

export const Notification: FC<NotificationProps> = ({ message, onDismiss }): ReactElement => {
  return (
    <aside role="status">
      <span>{message}</span>

      <IconButton label="Dismiss notification" onClick={onDismiss} />
    </aside>
  );
};

// Rendering the message and providing its dismiss interaction are related concerns.
// Splitting every small operation into separate components would make the design harder
// to follow rather than improving separation.

// ---------------------------------------------------------------------
// 32. Avoid artificial abstraction boundaries
// ---------------------------------------------------------------------

// This is usually unnecessary:
//
// function getMessage(
//     message: string,
// ): string {
//     return message;
// }
//
// function MessageText({
//     message,
// }: {readonly message: string}): ReactElement {
//     return <span>{getMessage(message)}</span>;
// }
//
// If no independent responsibility exists, the extra abstraction does not improve separation.
// Separation of concerns should clarify the design rather than add indirection for its own sake.

// ---------------------------------------------------------------------
// 33. Separate application coordination from reusable primitives
// ---------------------------------------------------------------------

interface ModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ open, title, children, onClose }): ReactElement => {
  if (!open) {
    return <></>;
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={title}>
      <h2>{title}</h2>

      <div>{children}</div>

      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

// `Modal` handles modal presentation.
// It does not decide why the modal is open or what the modal content means.

// ---------------------------------------------------------------------
// 34. The feature owns the modal's meaning
// ---------------------------------------------------------------------

export const DeleteProductDialog: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleDelete = (): void => {
    console.log("Delete product.");
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Delete product
      </Button>

      <Modal
        open={open}
        title="Delete product"
        onClose={() => {
          setOpen(false);
        }}
      >
        <p>This action cannot be undone.</p>

        <Button onClick={handleDelete}>Confirm</Button>
      </Modal>
    </>
  );
};

// The feature owns the decision to open the dialog and the meaning of confirmation.
// The generic modal remains unaware of those application details.

// ---------------------------------------------------------------------
// 35. Separate client interaction from server-side concerns
// ---------------------------------------------------------------------

// A client component can own:
//
// - input state
// - click handlers
// - browser APIs
// - visual interaction
//
// Server-side code can own:
//
// - database access
// - private credentials
// - trusted authorization
// - server-only resources
//
// The exact boundary depends on the application's architecture and framework integration.
// The important principle is to avoid mixing incompatible runtime concerns in one abstraction.

// ---------------------------------------------------------------------
// 36. Separation of concerns does not require one concern per component
// ---------------------------------------------------------------------

interface ProfileCardProps {
  readonly user: User;
  readonly onEdit: () => void;
}

export const ProfileCard: FC<ProfileCardProps> = ({ user, onEdit }): ReactElement => {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>

      <Button onClick={onEdit}>Edit</Button>
    </article>
  );
};

// `ProfileCard` has both presentation and a related interaction.
// These concerns belong together because they describe the same UI concept.

// ---------------------------------------------------------------------
// 37. A useful separation boundary follows change
// ---------------------------------------------------------------------

// If changing the API endpoint requires modifying:
//
// - a reusable Button
// - a user avatar
// - a product card
//
// the data-access concern has probably leaked into unrelated UI.
//
// A stronger boundary allows the API implementation to change
// without requiring unrelated presentation components to change.

// ---------------------------------------------------------------------
// 38. Separate concerns when they change for different reasons
// ---------------------------------------------------------------------

// A component may contain a problem when one change requires unrelated modifications:
//
// "Change the product API"
//     -> change JSX
//     -> change validation
//     -> change HTTP handling
//
// "Change the product card design"
//     -> change API parsing
//     -> change persistence
//
// These different reasons for change are signals that responsibilities
// may be coupled more tightly than necessary.

// ---------------------------------------------------------------------
// 39. A cohesive feature can still contain several concerns
// ---------------------------------------------------------------------

interface ProfileEditorProps {
  readonly user: User;
  readonly onSave: (user: User) => Promise<void>;
}

export const ProfileEditor: FC<ProfileEditorProps> = ({ user, onSave }): ReactElement => {
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        ...user,
        name: name.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <label htmlFor="profile-name">Name</label>

      <input
        id="profile-name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        disabled={isSaving}
      />

      <Button type="submit">{isSaving ? "Saving..." : "Save"}</Button>
    </form>
  );
};

// This component contains several related concerns:
// input state, form interaction, and save coordination.
// They all belong to the coherent responsibility of editing a profile.

// ---------------------------------------------------------------------
// 40. Complete separation-of-concerns example
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

function validateAccountName(name: string): string | null {
  if (name.trim().length < 2) {
    return "Name must contain at least 2 characters.";
  }

  return null;
}

async function saveAccount(account: Account): Promise<void> {
  console.log(`Save account ${account.id}.`);
}

interface AccountEditorProps {
  readonly account: Account;
}

export const AccountEditor: FC<AccountEditorProps> = ({ account }): ReactElement => {
  const [name, setName] = useState(account.name);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const validationError = validateAccountName(name);

    if (validationError !== null) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await saveAccount({
        ...account,
        name: name.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <label htmlFor="account-name">Name</label>

      <input
        id="account-name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        disabled={isSaving}
      />

      {error !== null && <p role="alert">{error}</p>}

      <Button type="submit">{isSaving ? "Saving..." : "Save"}</Button>
    </form>
  );
};

// The example separates the major concerns:
//
// - `AccountEditor` handles UI state, events, and presentation.
// - `validateAccountName` handles the validation rule.
// - `saveAccount` handles persistence.
//
// The concerns collaborate through explicit inputs and outputs rather than
// being implemented as one undifferentiated block.

// ---------------------------------------------------------------------
// 41. Practical separation-of-concerns checklist
// ---------------------------------------------------------------------

// Ask:
//
// - Is this code responsible for rendering, state, data access, domain rules, or side effects?
// - Does another concern need to change independently?
// - Can the concern be expressed through a small, explicit interface?
// - Is a component depending on implementation details it does not need?
// - Are unrelated runtime environments being mixed?
// - Is an abstraction clarifying a real boundary or merely adding indirection?
// - Do related behaviors belong together because they describe the same UI concept?
//
// The goal is not to maximize the number of files or components.
// The goal is to make responsibilities understandable and changeable.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Separation of concerns organizes different kinds of responsibilities behind clear boundaries.
// - React components commonly combine closely related rendering, state, and interaction concerns.
// - Data access, validation, transformation, domain rules, persistence, and browser APIs can often be separated from presentation.
// - A component can coordinate multiple concerns without implementing every underlying detail itself.
// - Props and callbacks provide explicit boundaries between components and their collaborators.
// - Custom hooks are useful for extracting reusable stateful behavior without extracting presentation.
// - Pure calculations should remain separate from side effects when that separation creates a meaningful boundary.
// - Reusable UI components should not contain feature-specific business or persistence logic.
// - Related concerns should remain together when separating them would create artificial or confusing abstractions.
// - Separation of concerns is about meaningful boundaries, not one concern per file or one component per responsibility.
// - Different reasons for change are a useful signal that concerns may be too tightly coupled.
// - Good separation reduces unnecessary dependencies while preserving straightforward collaboration between related parts.

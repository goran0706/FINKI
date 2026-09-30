/**
 * Component Coupling
 * ===================
 *
 * Component coupling describes how strongly one component depends on another component,
 * module, state source, implementation detail, or external service. Some coupling is
 * necessary because components must communicate, but excessive or inappropriate coupling
 * makes changes propagate through unrelated parts of the application.
 *
 * Good component architecture does not eliminate coupling. It keeps necessary dependencies
 * explicit, keeps interfaces small, and places dependencies at boundaries where they can
 * change without unnecessarily affecting other components.
 */

import { type FC, type FormEvent, type ReactElement, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Components necessarily collaborate
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <h1>Hello, {name}</h1>;
};

export const AccountHeader: FC = (): ReactElement => {
  return (
    <header>
      <Greeting name="John Doe" />
    </header>
  );
};

// `AccountHeader` depends on `Greeting`.
// This is normal component composition and therefore intentional coupling.

// ---------------------------------------------------------------------
// 2. Coupling is not automatically bad
// ---------------------------------------------------------------------

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

// A parent passing data through props creates a dependency on the component's
// public interface, but the parent does not depend on the child's implementation.

// ---------------------------------------------------------------------
// 3. Prefer coupling through explicit props
// ---------------------------------------------------------------------

interface ProductPriceProps {
  readonly price: number;
  readonly currency: string;
}

export const ProductPrice: FC<ProductPriceProps> = ({ price, currency }): ReactElement => {
  return (
    <span>
      {currency} {price.toFixed(2)}
    </span>
  );
};

// The parent only needs to know:
//
// - which values are required
// - their types
//
// It does not need to know how the price is rendered internally.

// ---------------------------------------------------------------------
// 4. Depend on the public interface, not implementation details
// ---------------------------------------------------------------------

interface ProductCardProps {
  readonly name: string;
  readonly price: number;
}

export const ProductCard: FC<ProductCardProps> = ({ name, price }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>

      <ProductPrice price={price} currency="$" />
    </article>
  );
};

// `ProductCard` depends on the public props of `ProductPrice`.
// It does not depend on the internal JSX structure of `ProductPrice`.

// ---------------------------------------------------------------------
// 5. Tight coupling through implementation details
// ---------------------------------------------------------------------

// Avoid APIs that force parents to understand internal implementation:
//
// interface ProductCardProps {
//     readonly priceElement: ReactElement;
//     readonly internalPriceClassName: string;
//     readonly useLegacyPriceLayout: boolean;
// };
//
// Such props expose implementation decisions instead of expressing
// the component's actual conceptual interface.

// ---------------------------------------------------------------------
// 6. Narrow interfaces reduce coupling
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => void;
  readonly disabled?: boolean;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled = false }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onSave}>
      Save
    </button>
  );
};

// `SaveButton` only depends on what it needs to perform its responsibility.
// It does not require an entire application state object.

// ---------------------------------------------------------------------
// 7. Avoid passing large objects when only one value is needed
// ---------------------------------------------------------------------

interface Profile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly createdAt: string;
}

interface ProfileNameProps {
  readonly name: string;
}

export const ProfileName: FC<ProfileNameProps> = ({ name }): ReactElement => {
  return <h2>{name}</h2>;
};

// Passing `name` directly communicates the dependency precisely.
// Passing the entire `Profile` object would couple the component to fields
// that it does not actually use.

// ---------------------------------------------------------------------
// 8. Passing children can reduce structural coupling
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

export const AccountPanel: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <p>Account information.</p>
    </Panel>
  );
};

// `Panel` does not need to know the concrete structure of its content.
// The caller supplies the content through composition.

// ---------------------------------------------------------------------
// 9. Callback props create behavioral coupling
// ---------------------------------------------------------------------

interface DeleteButtonProps {
  readonly onDelete: () => void;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ onDelete }): ReactElement => {
  return (
    <button type="button" onClick={onDelete}>
      Delete
    </button>
  );
};

// The child depends on the existence of an `onDelete` callback,
// but it does not depend on what the parent does when deletion occurs.

// ---------------------------------------------------------------------
// 10. Keep callback contracts small
// ---------------------------------------------------------------------

interface SearchFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const SearchField: FC<SearchFieldProps> = ({ value, onChange }): ReactElement => {
  return (
    <input
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder="Search"
    />
  );
};

// The child communicates only the information the parent needs.
// It does not expose the entire DOM event as part of the application contract.

// ---------------------------------------------------------------------
// 11. Avoid coupling components to DOM event details unnecessarily
// ---------------------------------------------------------------------

interface SearchFieldWithEventProps {
  readonly value: string;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchFieldWithEvent: FC<SearchFieldWithEventProps> = ({ value, onChange }): ReactElement => {
  return <input value={value} onChange={onChange} placeholder="Search" />;
};

// This API is valid, but it exposes a React/DOM event contract.
// The previous `onChange(value)` interface is more decoupled when the parent
// only needs the resulting string.

// ---------------------------------------------------------------------
// 12. Data coupling
// ---------------------------------------------------------------------

interface ProductSummaryProps {
  readonly name: string;
  readonly price: number;
}

export const ProductSummary: FC<ProductSummaryProps> = ({ name, price }): ReactElement => {
  return (
    <div>
      <strong>{name}</strong>
      <span>${price.toFixed(2)}</span>
    </div>
  );
};

// Passing only the required values is a form of narrow data coupling.
// The component does not depend on unrelated product fields.

// ---------------------------------------------------------------------
// 13. Control coupling
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
  readonly mode: "success" | "error";
}

export const Message: FC<MessageProps> = ({ message, mode }): ReactElement => {
  return <p data-mode={mode}>{message}</p>;
};

// `mode` controls how the component behaves.
// Some control coupling is reasonable when the modes represent legitimate
// variations of the component's single responsibility.

// ---------------------------------------------------------------------
// 14. Too many modes can create excessive control coupling
// ---------------------------------------------------------------------

// An API like this can become difficult to reason about:
//
// interface MessageProps {
//     readonly mode:
//         | "success"
//         | "error"
//         | "warning"
//         | "toast"
//         | "modal"
//         | "banner"
//         | "inline"
//         | "compact"
//         | "admin";
// };
//
// If each mode changes unrelated behavior, the component may actually
// represent several different responsibilities.

// ---------------------------------------------------------------------
// 15. Prefer composition when variations become unrelated
// ---------------------------------------------------------------------

interface NoticeProps {
  readonly children: ReactNode;
}

export const Notice: FC<NoticeProps> = ({ children }): ReactElement => {
  return <aside>{children}</aside>;
};

export const ErrorNotice: FC = (): ReactElement => {
  return (
    <Notice>
      <strong>Error:</strong>
      <span>Unable to load the requested data.</span>
    </Notice>
  );
};

// Composition can avoid a large configuration object when variations
// represent different UI concepts.

// ---------------------------------------------------------------------
// 16. Avoid coupling through shared mutable state
// ---------------------------------------------------------------------

let selectedProductId: string | null = null;

export function selectProduct(productId: string): void {
  selectedProductId = productId;
}

// A module-level mutable value creates an implicit dependency.
// Components that read or modify `selectedProductId` become coupled through
// shared state without expressing that relationship through their interfaces.

// ---------------------------------------------------------------------
// 17. Prefer explicit state ownership
// ---------------------------------------------------------------------

interface ProductSelectorProps {
  readonly value: string | null;
  readonly onChange: (productId: string) => void;
}

export const ProductSelector: FC<ProductSelectorProps> = ({ value, onChange }): ReactElement => {
  return (
    <select
      value={value ?? ""}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      <option value="">Select a product</option>

      <option value="product-1">Example Product</option>
    </select>
  );
};

// The selected product is explicit in the component contract.
// The parent decides where that state belongs.

// ---------------------------------------------------------------------
// 18. Lift shared state to a meaningful owner
// ---------------------------------------------------------------------

export const ProductSelection: FC = (): ReactElement => {
  const [productId, setProductId] = useState<string | null>(null);

  return (
    <section>
      <ProductSelector value={productId} onChange={setProductId} />

      <p>Selected: {productId ?? "None"}</p>
    </section>
  );
};

// Both pieces of UI depend on the same state, so the state is owned by
// the nearest meaningful common coordinator.

// ---------------------------------------------------------------------
// 19. Context can create implicit coupling
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly mode: "light" | "dark";
}

const exampleThemeContext: ThemeContextValue = {
  mode: "light",
};

// This object illustrates the shape of a shared context value.
// A real React context would be created with `createContext`.
//
// Context is useful when many descendants need the same dependency,
// but it also creates an implicit dependency for every consumer.

// ---------------------------------------------------------------------
// 20. Make context dependencies intentional
// ---------------------------------------------------------------------

interface ThemeLabelProps {
  readonly mode: "light" | "dark";
}

export const ThemeLabel: FC<ThemeLabelProps> = ({ mode }): ReactElement => {
  return <span>Theme: {mode}</span>;
};

// Passing a value through props makes the dependency explicit.
// Context is more appropriate when prop drilling would create unnecessary
// coupling between intermediate components.

// ---------------------------------------------------------------------
// 21. Context can be appropriate for cross-cutting dependencies
// ---------------------------------------------------------------------

// Common examples include:
//
// - theme
// - localization
// - authenticated user context
// - dependency containers
// - application-wide configuration
//
// The fact that context creates implicit coupling does not make it wrong.
// The dependency should simply be intentional and appropriately scoped.

// ---------------------------------------------------------------------
// 22. Avoid using context for unrelated local state
// ---------------------------------------------------------------------

// If only one small component needs a value, moving that value into global
// context increases the number of components coupled to the context.
//
// Prefer local state when the state has a local ownership boundary.

// ---------------------------------------------------------------------
// 23. Module coupling
// ---------------------------------------------------------------------

function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

interface PriceLabelProps {
  readonly priceInCents: number;
}

export const PriceLabel: FC<PriceLabelProps> = ({ priceInCents }): ReactElement => {
  return <span>{formatPrice(priceInCents)}</span>;
};

// The component depends on the formatting function.
// If the function is a stable module-level abstraction, this is usually
// a manageable and explicit dependency.

// ---------------------------------------------------------------------
// 24. Avoid importing concrete infrastructure into presentation
// ---------------------------------------------------------------------

async function fetchProductFromApi(productId: string): Promise<{
  readonly id: string;
  readonly name: string;
}> {
  const response = await fetch(`https://example.com/api/products/${productId}`);

  if (!response.ok) {
    throw new Error("Unable to load product.");
  }

  return response.json();
}

// Directly depending on a concrete API implementation couples consumers
// to the transport and endpoint details.

// ---------------------------------------------------------------------
// 25. Depend on an application-level contract
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface ProductLoader {
  readonly load: (productId: string) => Promise<Product>;
}

interface ProductViewProps {
  readonly productLoader: ProductLoader;
  readonly productId: string;
}

export const ProductView: FC<ProductViewProps> = ({ productLoader, productId }): ReactElement => {
  const [product, setProduct] = useState<Product | null>(null);

  const handleLoad = async (): Promise<void> => {
    const nextProduct = await productLoader.load(productId);

    setProduct(nextProduct);
  };

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          void handleLoad();
        }}
      >
        Load product
      </button>

      {product !== null && (
        <article>
          <h2>{product.name}</h2>
          <p>${product.price.toFixed(2)}</p>
        </article>
      )}
    </section>
  );
};

// `ProductView` depends on the `ProductLoader` contract rather than a
// concrete HTTP implementation.

// ---------------------------------------------------------------------
// 26. Dependency injection reduces concrete coupling
// ---------------------------------------------------------------------

const apiProductLoader: ProductLoader = {
  async load(productId): Promise<Product> {
    const response = await fetch(`https://example.com/api/products/${productId}`);

    if (!response.ok) {
      throw new Error("Unable to load product.");
    }

    return response.json();
  },
};

export const ApiProductView: FC = (): ReactElement => {
  return <ProductView productLoader={apiProductLoader} productId="product-1" />;
};

// The concrete infrastructure is selected at the boundary.
// The presentation component depends only on the contract.

// ---------------------------------------------------------------------
// 27. Dependency direction matters
// ---------------------------------------------------------------------

// A useful direction is:
//
// UI component
//     -> application contract
//         -> infrastructure implementation
//
// A problematic direction is:
//
// reusable UI component
//     -> concrete API client
//         -> application-specific endpoint
//
// The latter makes the reusable UI component aware of infrastructure details.

// ---------------------------------------------------------------------
// 28. Do not make reusable components know feature-specific modules
// ---------------------------------------------------------------------

// Avoid:
//
// Button
//     -> checkout service
//     -> account service
//     -> product service
//
// Prefer:
//
// Button
//     -> onClick callback
//
// The feature component can connect the callback to the appropriate operation.

// ---------------------------------------------------------------------
// 29. Callback injection keeps reusable UI decoupled
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly label: string;
  readonly onAction: () => void;
}

export const ActionButton: FC<ActionButtonProps> = ({ label, onAction }): ReactElement => {
  return (
    <button type="button" onClick={onAction}>
      {label}
    </button>
  );
};

export const ProductActions: FC = (): ReactElement => {
  const handleAddToCart = (): void => {
    console.log("Add product to cart.");
  };

  return <ActionButton label="Add to cart" onAction={handleAddToCart} />;
};

// `ActionButton` does not know anything about products or carts.
// The feature supplies the meaning of the action.

// ---------------------------------------------------------------------
// 30. Avoid coupling through concrete child structures
// ---------------------------------------------------------------------

interface CardProps {
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }): ReactElement => {
  return <article>{children}</article>;
};

export const UserCardComposition: FC = (): ReactElement => {
  return (
    <Card>
      <h2>John Doe</h2>
      <p>john@example.com</p>
    </Card>
  );
};

// `Card` depends only on its children contract.
// The parent is free to change the content without changing `Card`.

// ---------------------------------------------------------------------
// 31. Render props can create explicit behavioral boundaries
// ---------------------------------------------------------------------

interface DataStateProps<T> {
  readonly value: T | null;
  readonly render: (value: T) => ReactNode;
}

export function DataState<T>({ value, render }: DataStateProps<T>): ReactElement {
  if (value === null) {
    return <p>No data.</p>;
  }

  return <>{render(value)}</>;
}

// The generic component does not know the concrete representation of the data.
// The caller supplies the rendering behavior.

// ---------------------------------------------------------------------
// 32. Avoid exposing internal state unnecessarily
// ---------------------------------------------------------------------

interface CounterProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

export const Counter: FC<CounterProps> = ({ value, onChange }): ReactElement => {
  return (
    <div>
      <span>{value}</span>

      <button
        type="button"
        onClick={() => {
          onChange(value + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};

// The component exposes only the state value and state transition it needs.
// It does not expose the parent's entire state management implementation.

// ---------------------------------------------------------------------
// 33. Avoid passing state setters when a domain action is clearer
// ---------------------------------------------------------------------

interface QuantityControlProps {
  readonly quantity: number;
  readonly onIncrease: () => void;
  readonly onDecrease: () => void;
}

export const QuantityControl: FC<QuantityControlProps> = ({ quantity, onIncrease, onDecrease }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onDecrease}>
        -
      </button>

      <span>{quantity}</span>

      <button type="button" onClick={onIncrease}>
        +
      </button>
    </div>
  );
};

// Domain-oriented callbacks communicate intent.
// The child does not need to know that the parent uses `useState` internally.

// ---------------------------------------------------------------------
// 34. Coupling through state setters can expose implementation details
// ---------------------------------------------------------------------

interface StateSetterProps {
  readonly value: number;
  readonly setValue: (value: number) => void;
}

// This can be perfectly valid for simple controlled inputs,
// but a domain-specific callback can provide a narrower and more stable contract
// when the child represents a meaningful business action.

// ---------------------------------------------------------------------
// 35. Avoid temporal coupling when possible
// ---------------------------------------------------------------------

interface SaveProfileProps {
  readonly validate: () => boolean;
  readonly save: () => Promise<void>;
}

export const SaveProfile: FC<SaveProfileProps> = ({ validate, save }): ReactElement => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (): Promise<void> => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);

    try {
      await save();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isSaving}
      onClick={() => {
        void handleSave();
      }}
    >
      {isSaving ? "Saving..." : "Save"}
    </button>
  );
};

// Temporal coupling occurs when one operation must happen before another.
// Here the sequence is explicit, but the component still depends on the
// caller supplying compatible validation and save operations.

// ---------------------------------------------------------------------
// 36. Keep workflows behind meaningful abstractions
// ---------------------------------------------------------------------

interface Profile {
  readonly id: string;
  readonly name: string;
}

interface ProfileService {
  readonly save: (profile: Profile) => Promise<void>;
}

interface ProfileEditorProps {
  readonly profile: Profile;
  readonly service: ProfileService;
}

export const ProfileEditor: FC<ProfileEditorProps> = ({ profile, service }): ReactElement => {
  const [name, setName] = useState(profile.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await service.save({
        ...profile,
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
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        disabled={isSaving}
      />

      <button type="submit" disabled={isSaving}>
        Save
      </button>
    </form>
  );
};

// The component depends on one meaningful service contract instead of
// coordinating a sequence of unrelated infrastructure calls.

// ---------------------------------------------------------------------
// 37. Avoid coupling through global event channels
// ---------------------------------------------------------------------

// An implicit event channel can create hidden relationships:
//
// ProductCard
//     -> dispatches "product-selected"
//
// Unrelated component
//     -> listens for "product-selected"
//
// The relationship is difficult to discover because neither component's
// props communicate the dependency.

// ---------------------------------------------------------------------
// 38. Prefer explicit communication for local relationships
// ---------------------------------------------------------------------

interface ProductListProps {
  readonly onSelect: (productId: string) => void;
}

export const ProductList: FC<ProductListProps> = ({ onSelect }): ReactElement => {
  return (
    <ul>
      <li>
        <button
          type="button"
          onClick={() => {
            onSelect("product-1");
          }}
        >
          Example Product
        </button>
      </li>
    </ul>
  );
};

// The relationship is visible in the component's public interface.
// Explicit dependencies are generally easier to trace and refactor.

// ---------------------------------------------------------------------
// 39. Avoid coupling through mutable singleton services
// ---------------------------------------------------------------------

// A mutable singleton can make many components depend on shared hidden state:
//
// const cart = {
//     items: [],
// };
//
// Components that mutate `cart.items` are coupled through a shared object.
// The dependency is not visible in their props or return values.
//
// Shared services can still be appropriate, but their mutable state should
// have an intentional ownership and lifecycle model.

// ---------------------------------------------------------------------
// 40. Coupling through module imports
// ---------------------------------------------------------------------

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

interface NameLabelProps {
  readonly name: string;
}

export const NameLabel: FC<NameLabelProps> = ({ name }): ReactElement => {
  return <span>{normalizeName(name)}</span>;
};

// Module imports are explicit dependencies.
// The architectural question is whether the imported abstraction belongs
// at this component's boundary and is stable enough to depend on.

// ---------------------------------------------------------------------
// 41. Keep infrastructure dependencies away from generic UI
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly type?: "button" | "submit";
}

export const Button: FC<ButtonProps> = ({ children, onClick, type = "button" }): ReactElement => {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
};

// This button knows nothing about HTTP, routing, authentication,
// analytics, or application-specific state.

// ---------------------------------------------------------------------
// 42. Feature components can connect infrastructure to UI
// ---------------------------------------------------------------------

export const SaveProductButton: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Save product.");
  };

  return <Button onClick={handleSave}>Save product</Button>;
};

// The feature establishes the connection.
// The reusable button remains decoupled from the feature.

// ---------------------------------------------------------------------
// 43. Coupling and testing
// ---------------------------------------------------------------------

interface Clock {
  readonly now: () => Date;
}

interface GreetingWithClockProps {
  readonly clock: Clock;
}

export const GreetingWithClock: FC<GreetingWithClockProps> = ({ clock }): ReactElement => {
  const hour = clock.now().getHours();

  return <p>{hour < 12 ? "Good morning" : "Good afternoon"}</p>;
};

// The component depends on a small `Clock` contract.
// Tests can provide a deterministic implementation without coupling
// the component directly to the current system time.

// ---------------------------------------------------------------------
// 44. Coupling and test doubles
// ---------------------------------------------------------------------

const fixedMorningClock: Clock = {
  now: () => new Date("2026-01-01T09:00:00Z"),
};

export const TestableGreeting: FC = (): ReactElement => {
  return <GreetingWithClock clock={fixedMorningClock} />;
};

// The dependency can be replaced because the component depends on an abstraction
// rather than constructing its own time source.

// ---------------------------------------------------------------------
// 45. Avoid over-abstracting every dependency
// ---------------------------------------------------------------------

// Not every value needs an interface.
//
// A component does not necessarily need:
//
// interface StringFormatter {
//     format(value: string): string;
// }
//
// for a simple local operation.
//
// Abstraction is useful when it creates a meaningful substitution boundary,
// not merely because a dependency exists.

// ---------------------------------------------------------------------
// 46. Coupling through routing
// ---------------------------------------------------------------------

interface NavigationProps {
  readonly onNavigate: (path: string) => void;
}

export const NavigationLink: FC<NavigationProps> = ({ onNavigate }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        onNavigate("/account");
      }}
    >
      Account
    </button>
  );
};

// The component depends on a navigation capability,
// not on a particular router implementation.

// ---------------------------------------------------------------------
// 47. Coupling through application-specific hooks
// ---------------------------------------------------------------------

interface AuthState {
  readonly user: User | null;
}

function useExampleAuth(): AuthState {
  return {
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    },
  };
}

export const AccountGreeting: FC = (): ReactElement => {
  const { user } = useExampleAuth();

  if (user === null) {
    return <p>Sign in to continue.</p>;
  }

  return <Greeting name={user.name} />;
};

// A feature-specific hook creates coupling to the authentication mechanism,
// but that coupling may be appropriate for a component whose responsibility
// is explicitly tied to authenticated account UI.

// ---------------------------------------------------------------------
// 48. Avoid coupling generic components to feature hooks
// ---------------------------------------------------------------------

// Avoid:
//
// const Button = (): ReactElement => {
//     const {user} = useExampleAuth();
//     ...
// };
//
// A generic button should not know about authentication.
// Feature-specific dependencies should remain at feature-specific boundaries.

// ---------------------------------------------------------------------
// 49. Coupling through prop drilling
// ---------------------------------------------------------------------

interface ToolbarProps {
  readonly userName: string;
  readonly onLogout: () => void;
}

export const Toolbar: FC<ToolbarProps> = ({ userName, onLogout }): ReactElement => {
  return (
    <header>
      <span>{userName}</span>

      <Button onClick={onLogout}>Sign out</Button>
    </header>
  );
};

// Passing values explicitly through several layers can become cumbersome.
// However, explicit coupling is often easier to understand than hidden coupling.

// ---------------------------------------------------------------------
// 50. Use composition to avoid unnecessary prop drilling
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly header: ReactNode;
  readonly children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ header, children }): ReactElement => {
  return (
    <div>
      <header>{header}</header>

      <main>{children}</main>
    </div>
  );
};

export const AccountLayout: FC = (): ReactElement => {
  return (
    <Layout
      header={
        <Toolbar
          userName="John Doe"
          onLogout={() => {
            console.log("Sign out.");
          }}
        />
      }
    >
      <p>Account content.</p>
    </Layout>
  );
};

// `Layout` does not need to know anything about users or authentication.
// Composition prevents unrelated intermediate components from receiving props
// they only need to forward.

// ---------------------------------------------------------------------
// 51. Coupling and component replacement
// ---------------------------------------------------------------------

interface UserAvatarProps {
  readonly src: string;
  readonly alt: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({ src, alt }): ReactElement => {
  return <img src={src} alt={alt} width={48} height={48} />;
};

export const UserHeader: FC = (): ReactElement => {
  return (
    <header>
      <UserAvatar src="/profile.jpg" alt="John Doe" />

      <Greeting name="John Doe" />
    </header>
  );
};

// `UserHeader` depends on the public contracts of its children.
// Their internal implementations can change without requiring changes here,
// provided those contracts remain compatible.

// ---------------------------------------------------------------------
// 52. Coupling and stable boundaries
// ---------------------------------------------------------------------

// A useful boundary tends to have:
//
// - a small interface
// - explicit inputs
// - explicit outputs or callbacks
// - limited knowledge of implementation details
// - a clear responsibility
//
// These properties make the dependency easier to replace or modify.

// ---------------------------------------------------------------------
// 53. Complete decoupled form example
// ---------------------------------------------------------------------

interface ContactFormValues {
  readonly name: string;
  readonly email: string;
}

interface ContactFormProps {
  readonly initialValues?: ContactFormValues;
  readonly onSubmit: (values: ContactFormValues) => Promise<void>;
}

export const ContactForm: FC<ContactFormProps> = ({
  initialValues = {
    name: "",
    email: "",
  },
  onSubmit,
}): ReactElement => {
  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <label>
        Name
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          disabled={isSubmitting}
        />
      </label>

      <label>
        Email
        <input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          type="email"
          disabled={isSubmitting}
        />
      </label>

      <Button type="submit">{isSubmitting ? "Sending..." : "Send"}</Button>
    </form>
  );
};

// `ContactForm` owns form interaction and local state.
// The caller owns what happens when the form is submitted.
// This avoids coupling the reusable form directly to an API, database,
// notification system, or routing implementation.

// ---------------------------------------------------------------------
// 54. Connect the form at the feature boundary
// ---------------------------------------------------------------------

export const ContactSection: FC = (): ReactElement => {
  const handleSubmit = async (values: ContactFormValues): Promise<void> => {
    console.log(`Submit contact form for ${values.email}.`);
  };

  return (
    <section>
      <ContactForm onSubmit={handleSubmit} />
    </section>
  );
};

// The feature establishes the application-specific behavior.
// The reusable form remains independent of that implementation.

// ---------------------------------------------------------------------
// 55. Coupling checklist
// ---------------------------------------------------------------------

// Ask:
//
// - What does this component depend on?
// - Are those dependencies visible through props, imports, or documented contracts?
// - Does the component depend on implementation details?
// - Could the dependency be replaced without changing the component?
// - Is a callback narrower than the dependency it currently exposes?
// - Is context being used for an appropriate cross-cutting concern?
// - Is shared mutable state creating hidden relationships?
// - Are generic components importing feature-specific services?
// - Would composition remove unnecessary prop drilling?
// - Is an abstraction providing a real substitution boundary?
//
// The goal is not zero coupling.
// The goal is explicit, appropriate, and manageable coupling.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Component coupling describes how strongly one component depends on another component, module, state source, or external service.
// - Some coupling is necessary because components must communicate and compose.
// - Explicit props and callbacks make dependencies visible and easier to reason about.
// - Narrow interfaces reduce the amount of implementation knowledge shared between components.
// - Passing only the data a component needs avoids unnecessary coupling to larger data structures.
// - Children and composition can reduce structural coupling between containers and their content.
// - Domain-oriented callbacks can expose intent without exposing state-management implementation details.
// - Context is useful for appropriate cross-cutting dependencies but creates implicit coupling for consumers.
// - Shared mutable state and global event channels can create hidden coupling that is harder to trace.
// - Reusable UI components should avoid direct dependencies on feature-specific infrastructure.
// - Dependency injection can separate presentation components from concrete services and transport implementations.
// - Components should generally depend on stable contracts rather than concrete implementation details when substitution is valuable.
// - Prop drilling is explicit coupling; composition or appropriately scoped context can reduce unnecessary intermediate dependencies.
// - Abstractions should create meaningful boundaries rather than exist solely to eliminate every dependency.
// - Coupling should be evaluated together with cohesion, responsibility, and dependency direction.
// - The goal is not to eliminate coupling but to keep necessary dependencies explicit, narrow, and appropriately placed.

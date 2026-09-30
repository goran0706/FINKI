/**
 * Component Responsibility
 * ========================
 *
 * A React component should have a clear purpose within the UI and should own the behavior,
 * state, and rendering logic that naturally belong to that purpose. Component responsibility
 * is about defining a useful boundary around UI behavior without forcing every implementation
 * detail into the component or extracting every small operation into another abstraction.
 */

import { type FC, type FormEvent, type ReactElement, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. A component should have a clear purpose
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <h1>Hello, {name}</h1>;
};

// `Greeting` has a clear UI responsibility:
// it renders a greeting for the supplied name.

// ---------------------------------------------------------------------
// 2. Responsibility is broader than rendering one element
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

// A component can render several elements while still having one cohesive purpose.
// The responsibility is "render a user card", not "render one HTML element."

// ---------------------------------------------------------------------
// 3. Components should own behavior that belongs to their UI
// ---------------------------------------------------------------------

export const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>

      <button
        type="button"
        onClick={() => {
          setCount((value) => value + 1);
        }}
      >
        Increment
      </button>
    </section>
  );
};

// The counter owns its local state because the state exists specifically
// to control the behavior of this component.

// ---------------------------------------------------------------------
// 4. State should live where its responsibility is needed
// ---------------------------------------------------------------------

interface QuantitySelectorProps {
  readonly initialQuantity: number;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ initialQuantity }): ReactElement => {
  const [quantity, setQuantity] = useState(initialQuantity);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setQuantity((value) => Math.max(1, value - 1));
        }}
      >
        -
      </button>

      <span>{quantity}</span>

      <button
        type="button"
        onClick={() => {
          setQuantity((value) => value + 1);
        }}
      >
        +
      </button>
    </div>
  );
};

// `QuantitySelector` owns quantity because quantity directly controls its UI behavior.
// State does not need to be moved to a parent unless another component needs to coordinate it.

// ---------------------------------------------------------------------
// 5. Do not lift state without a reason
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly productName: string;
}

export const ProductPage: FC<ProductPageProps> = ({ productName }): ReactElement => {
  return (
    <section>
      <h1>{productName}</h1>
      <QuantitySelector initialQuantity={1} />
    </section>
  );
};

// The page does not need to own `quantity` because no other part of the page
// needs to read or control that state.

// ---------------------------------------------------------------------
// 6. Lift state when multiple components need the same state
// ---------------------------------------------------------------------

interface TemperatureInputProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

export const TemperatureInput: FC<TemperatureInputProps> = ({ value, onChange }): ReactElement => {
  return (
    <label>
      Temperature
      <input
        type="number"
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value));
        }}
      />
    </label>
  );
};

export const TemperatureConverter: FC = (): ReactElement => {
  const [temperature, setTemperature] = useState(20);

  return (
    <section>
      <TemperatureInput value={temperature} onChange={setTemperature} />

      <p>Celsius: {temperature}</p>

      <p>Fahrenheit: {((temperature * 9) / 5 + 32).toFixed(1)}</p>
    </section>
  );
};

// The parent owns the state because multiple pieces of UI depend on the same value.
// The input owns the responsibility of editing the value it receives.

// ---------------------------------------------------------------------
// 7. Props define a component's collaboration boundary
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

// Props describe what the component needs from its parent.
// A focused props interface makes the component's responsibility easier to understand.

// ---------------------------------------------------------------------
// 8. Event handlers can belong to the component
// ---------------------------------------------------------------------

export const SearchInput: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <label>
      Search
      <input value={query} onChange={handleChange} />
    </label>
  );
};

// The event handler belongs to the component because it directly manages
// the component's local interaction state.

// ---------------------------------------------------------------------
// 9. Use callbacks when a parent owns the responsibility
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

// A controlled component does not own the source of truth.
// It owns the responsibility of rendering an input and reporting changes.

// ---------------------------------------------------------------------
// 10. Presentational responsibility
// ---------------------------------------------------------------------

interface StatusMessageProps {
  readonly message: string;
  readonly type: "success" | "error" | "info";
}

export const StatusMessage: FC<StatusMessageProps> = ({ message, type }): ReactElement => {
  return <p data-status={type}>{message}</p>;
};

// `StatusMessage` focuses on displaying status information.
// It does not decide when the status changes or how it is persisted.

// ---------------------------------------------------------------------
// 11. Container responsibility
// ---------------------------------------------------------------------

interface UserProfileContainerProps {
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
}

export const UserProfileContainer: FC<UserProfileContainerProps> = ({ user }): ReactElement => {
  return (
    <section>
      <UserCard name={user.name} email={user.email} />

      <StatusMessage message="Profile loaded." type="success" />
    </section>
  );
};

// A higher-level component can coordinate child components.
// Coordination is a legitimate component responsibility when it represents
// a meaningful part of the UI composition.

// ---------------------------------------------------------------------
// 12. Avoid embedding unrelated business rules
// ---------------------------------------------------------------------

interface OrderProps {
  readonly subtotal: number;
}

export const OrderSummary: FC<OrderProps> = ({ subtotal }): ReactElement => {
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  return (
    <section>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>

      <p>Tax: ${tax.toFixed(2)}</p>

      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
};

// Simple calculations can reasonably remain local when they are tightly coupled
// to the component's presentation and have no independent architectural significance.

// ---------------------------------------------------------------------
// 13. Extract domain logic when it becomes an independent responsibility
// ---------------------------------------------------------------------

function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export const OrderSummaryWithDomainLogic: FC<OrderProps> = ({ subtotal }): ReactElement => {
  const tax = calculateTax(subtotal, 0.2);
  const total = calculateTotal(subtotal, tax);

  return (
    <section>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>

      <p>Tax: ${tax.toFixed(2)}</p>

      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
};

// Extraction is useful when the rule is meaningful independently of the component,
// can be reused, or needs to be tested separately.

// ---------------------------------------------------------------------
// 14. Components should not become application-wide coordinators by default
// ---------------------------------------------------------------------

// Avoid a component that owns all of these unrelated concerns:
//
// - authentication
// - database access
// - routing
// - form validation
// - analytics
// - product calculations
// - global state
// - rendering every section
//
// Such a component becomes difficult to understand because its responsibility
// is no longer aligned with a meaningful part of the UI.

// ---------------------------------------------------------------------
// 15. A component can coordinate a feature
// ---------------------------------------------------------------------

interface CheckoutProps {
  readonly items: readonly {
    readonly name: string;
    readonly price: number;
  }[];
}

export const Checkout: FC<CheckoutProps> = ({ items }): ReactElement => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <section>
      <h1>Checkout</h1>

      <ul>
        {items.map((item) => (
          <li key={item.name}>
            {item.name}: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>

      <strong>Total: ${total.toFixed(2)}</strong>
    </section>
  );
};

// A feature-level component can coordinate related UI concerns.
// The important question is whether the responsibilities form a coherent feature.

// ---------------------------------------------------------------------
// 16. Separate reusable visual responsibilities
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

// A reusable Button owns generic button presentation and interaction wiring.
// It should not contain product-specific or account-specific business rules.

// ---------------------------------------------------------------------
// 17. Avoid feature-specific behavior in shared components
// ---------------------------------------------------------------------

// A generic Button should not contain logic such as:
//
// if (userIsAdmin) {
//     deleteProduct();
// }
//
// That behavior belongs to the feature that understands the operation.
//
// The Button should remain responsible for being a button.

// ---------------------------------------------------------------------
// 18. Components can expose behavior through callbacks
// ---------------------------------------------------------------------

interface DeleteButtonProps {
  readonly onDelete: () => void;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ onDelete }): ReactElement => {
  return <Button onClick={onDelete}>Delete</Button>;
};

// `DeleteButton` knows that it represents a delete interaction.
// The parent owns what deletion actually does.

// ---------------------------------------------------------------------
// 19. The parent can own the operation
// ---------------------------------------------------------------------

export const ProductEditor: FC = (): ReactElement => {
  const handleDelete = (): void => {
    console.log("Delete product.");
  };

  return (
    <section>
      <DeleteButton onDelete={handleDelete} />
    </section>
  );
};

// The editor coordinates the product-level operation.
// The button handles the user interaction that triggers it.

// ---------------------------------------------------------------------
// 20. Components should expose the smallest useful interface
// ---------------------------------------------------------------------

interface AvatarProps {
  readonly src: string;
  readonly alt: string;
}

export const Avatar: FC<AvatarProps> = ({ src, alt }): ReactElement => {
  return <img src={src} alt={alt} width={48} height={48} />;
};

// The component exposes only the information required to render the avatar.
// Parents do not need to know how the image element is constructed.

// ---------------------------------------------------------------------
// 21. Avoid leaking implementation details through props
// ---------------------------------------------------------------------

// Prefer:
//
// <Avatar
//     src="/profile.jpg"
//     alt="John Doe"
// />
//
// over exposing unrelated internal details such as:
//
// <Avatar
//     imageElement={<img ... />}
//     calculateImageSize={...}
//     internalClassName="..."
// />
//
// Props should express the component's public responsibility rather than its internals.

// ---------------------------------------------------------------------
// 22. Components can encapsulate UI state machines
// ---------------------------------------------------------------------

type DisclosureState = "closed" | "open";

export const Disclosure: FC = (): ReactElement => {
  const [state, setState] = useState<DisclosureState>("closed");

  const isOpen = state === "open";

  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setState(isOpen ? "closed" : "open");
        }}
      >
        {isOpen ? "Hide" : "Show"}
      </button>

      {isOpen && <p>Additional information.</p>}
    </section>
  );
};

// The component owns the disclosure state because that state exists
// specifically to control the disclosure interaction.

// ---------------------------------------------------------------------
// 23. A component should not own unrelated global state
// ---------------------------------------------------------------------

// Avoid making an unrelated component responsible for application-wide concerns:
//
// export const ProductCard = (): ReactElement => {
//     // Authentication state
//     // Theme state
//     // Shopping cart state
//     // Notification state
//     // Product presentation
// };
//
// If several features need the same state, the state should have a boundary
// appropriate to its scope rather than being attached to an arbitrary component.

// ---------------------------------------------------------------------
// 24. State ownership follows dependency
// ---------------------------------------------------------------------

interface TabsProps {
  readonly activeTab: string;
  readonly onChange: (tab: string) => void;
  readonly tabs: readonly string[];
}

export const Tabs: FC<TabsProps> = ({ activeTab, onChange, tabs }): ReactElement => {
  return (
    <nav>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-selected={tab === activeTab}
          onClick={() => {
            onChange(tab);
          }}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

// `Tabs` owns the presentation and interaction of tabs.
// The parent owns the active tab because it may need to coordinate the selected value.

// ---------------------------------------------------------------------
// 25. Component responsibility and children
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
};

// `Panel` owns the layout and presentation of a panel.
// Its children remain the responsibility of the caller.

// ---------------------------------------------------------------------
// 26. Composition avoids responsibility accumulation
// ---------------------------------------------------------------------

export const AccountPage: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <Greeting name="John Doe" />
      <StatusMessage message="Account is active." type="success" />
    </Panel>
  );
};

// The page composes the feature.
// `Panel`, `Greeting`, and `StatusMessage` each retain focused responsibilities.

// ---------------------------------------------------------------------
// 27. Form responsibility
// ---------------------------------------------------------------------

interface LoginValues {
  readonly email: string;
  readonly password: string;
}

function validateLogin(values: LoginValues): string | null {
  if (!values.email.includes("@")) {
    return "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  return null;
}

export const LoginForm: FC = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const error = validateLogin({
      email,
      password,
    });

    if (error !== null) {
      console.log(error);
      return;
    }

    console.log("Submit credentials.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        placeholder="Email"
        type="email"
      />

      <input
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        placeholder="Password"
        type="password"
      />

      <button type="submit">Sign in</button>
    </form>
  );
};

// The form owns the UI state and submission interaction.
// The validation rule is delegated because it represents a distinct concern.

// ---------------------------------------------------------------------
// 28. Avoid putting persistence directly into presentation
// ---------------------------------------------------------------------

// This makes the component responsible for both UI and persistence:
//
// const handleSubmit = async (): Promise<void> => {
//     await fetch("/api/profile", {
//         method: "POST",
//         body: JSON.stringify(...),
//     });
// };
//
// Depending on the application architecture, the persistence operation can instead
// be delegated to a data-access function, Server Action, mutation layer, or service.

// ---------------------------------------------------------------------
// 29. A component can coordinate a data operation
// ---------------------------------------------------------------------

interface SaveProfileProps {
  readonly save: (values: LoginValues) => Promise<void>;
}

export const SaveProfileForm: FC<SaveProfileProps> = ({ save }): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await save({
      email,
      password,
    });
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <input
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        type="email"
      />

      <input
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        type="password"
      />

      <button type="submit">Save</button>
    </form>
  );
};

// The form owns interaction behavior.
// The caller supplies the persistence operation.

// ---------------------------------------------------------------------
// 30. Responsibility and dependency direction
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly getProduct: (productId: string) => Promise<Product>;
}

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface ProductDetailsProps {
  readonly product: Product;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h1>{product.name}</h1>
      <ProductPrice price={product.price} currency="$" />
    </article>
  );
};

// The UI component depends on product data, not on the repository implementation.
// This keeps the component's responsibility centered on rendering product details.

// ---------------------------------------------------------------------
// 31. Responsibility and asynchronous loading
// ---------------------------------------------------------------------

interface ProductLoaderProps {
  readonly load: () => Promise<Product>;
}

export const ProductLoader: FC<ProductLoaderProps> = ({ load }): ReactElement => {
  const [product, setProduct] = useState<Product | null>(null);

  const handleLoad = async (): Promise<void> => {
    const nextProduct = await load();

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

      {product !== null && <ProductDetails product={product} />}
    </section>
  );
};

// The loader coordinates loading state and rendering.
// The actual data source is supplied from outside.

// ---------------------------------------------------------------------
// 32. Avoid component responsibility based only on file size
// ---------------------------------------------------------------------

// A 200-line component is not automatically poorly designed.
// A 20-line component is not automatically well designed.
//
// The more useful questions are:
//
// - What does this component represent?
// - What state does it own?
// - What behavior does it coordinate?
// - What changes should require modifying it?
// - Are unrelated concerns embedded inside it?
//
// Responsibility is a semantic boundary, not a line-count threshold.

// ---------------------------------------------------------------------
// 33. Avoid extracting every JSX fragment
// ---------------------------------------------------------------------

export const ProductHeader: FC<ProductProps> = ({ name }): ReactElement => {
  return (
    <header>
      <h1>{name}</h1>
    </header>
  );
};

// This is meaningful if the product header is reused or has its own behavior.
// Extracting a component solely because a few JSX elements exist does not
// automatically create a useful responsibility boundary.

// ---------------------------------------------------------------------
// 34. Component responsibility can evolve
// ---------------------------------------------------------------------

interface EmptyStateProps {
  readonly message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

// A component that begins as simple presentation may later gain meaningful
// interaction or accessibility behavior. Its responsibility can evolve
// as long as the resulting boundary remains coherent.

// ---------------------------------------------------------------------
// 35. Recognizing responsibility drift
// ---------------------------------------------------------------------

// Responsibility drift occurs when a component gradually accumulates unrelated
// behavior:
//
// ProductCard
//     -> product presentation
//     -> cart persistence
//     -> analytics configuration
//     -> authentication
//     -> notification management
//
// Each addition may appear convenient in isolation.
// Together they make the component responsible for unrelated concerns.

// ---------------------------------------------------------------------
// 36. Refactoring responsibility drift
// ---------------------------------------------------------------------

function addToCart(productId: string): void {
  console.log(`Add ${productId} to cart.`);
}

function trackProductView(productId: string): void {
  console.log(`Track ${productId}.`);
}

interface ProductActionsProps {
  readonly productId: string;
}

export const ProductActions: FC<ProductActionsProps> = ({ productId }): ReactElement => {
  return (
    <div>
      <Button
        onClick={() => {
          addToCart(productId);
        }}
      >
        Add to cart
      </Button>

      <Button
        onClick={() => {
          trackProductView(productId);
        }}
      >
        Track view
      </Button>
    </div>
  );
};

// The component coordinates user actions.
// The underlying operations remain separate from the component's JSX.

// ---------------------------------------------------------------------
// 37. Component responsibility and accessibility
// ---------------------------------------------------------------------

interface IconButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

export const IconButton: FC<IconButtonProps> = ({ label, onClick }): ReactElement => {
  return (
    <button type="button" aria-label={label} onClick={onClick}>
      ×
    </button>
  );
};

// Accessibility behavior that is intrinsic to the component's UI responsibility
// belongs in the component rather than being repeatedly implemented by callers.

// ---------------------------------------------------------------------
// 38. Component responsibility and styling
// ---------------------------------------------------------------------

interface CardProps {
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }): ReactElement => {
  return <div className="card">{children}</div>;
};

// Styling and structural markup are naturally part of a presentational component's responsibility.
// Business rules do not need to be embedded in the same abstraction.

// ---------------------------------------------------------------------
// 39. Feature components can compose specialized components
// ---------------------------------------------------------------------

export const UserAccount: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <UserCard name="John Doe" email="john@example.com" />

      <Card>
        <StatusMessage message="Your account is active." type="success" />
      </Card>

      <Button>Sign out</Button>
    </Panel>
  );
};

// `UserAccount` represents the account UI as a feature.
// Specialized children own their own presentation and interaction responsibilities.

// ---------------------------------------------------------------------
// 40. Component responsibility and testing
// ---------------------------------------------------------------------

// A component with a focused responsibility allows tests to ask focused questions:
//
// Greeting
//     -> Does the expected name render?
//
// Counter
//     -> Does clicking increment the count?
//
// validateLogin
//     -> Are invalid credentials rejected?
//
// calculateTotal
//     -> Is the total calculated correctly?
//
// Each abstraction can be tested at the level appropriate to its responsibility.

// ---------------------------------------------------------------------
// 41. A practical responsibility checklist
// ---------------------------------------------------------------------

// When designing a component, ask:
//
// 1. What UI concept does this component represent?
// 2. What state does it need to own?
// 3. What behavior naturally belongs to that UI concept?
// 4. Which values should come from props?
// 5. Which operations should be delegated?
// 6. Does it contain unrelated business or infrastructure logic?
// 7. Are several components forced to coordinate through unnecessary shared state?
// 8. Would a meaningful change require modifying unrelated parts of the component?
//
// These questions help establish a useful component boundary.

// ---------------------------------------------------------------------
// 42. Complete focused component example
// ---------------------------------------------------------------------

interface ProductEditorProps {
  readonly product: Product;
  readonly onSave: (product: Product) => Promise<void>;
}

export const ProductEditor: FC<ProductEditorProps> = ({ product, onSave }): ReactElement => {
  const [name, setName] = useState(product.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        ...product,
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
      <label htmlFor="product-name">Product name</label>

      <input
        id="product-name"
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

// `ProductEditor` owns a coherent responsibility:
// editing product information and coordinating its save interaction.
//
// It does not own how the product is persisted.
// The `onSave` dependency keeps that concern outside the component.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A component should represent a clear and meaningful UI responsibility.
// - Component responsibility includes the rendering and interaction behavior that naturally belongs to that UI concept.
// - A component can contain multiple elements and operations while still having one cohesive responsibility.
// - Local state should generally live in the component that directly owns the corresponding UI behavior.
// - State should be lifted when multiple components need to coordinate the same source of truth.
// - Props define the collaboration boundary between a component and its parent.
// - Controlled components render values supplied by their parent and report changes through callbacks.
// - Feature components can coordinate several related child components without implementing every detail themselves.
// - Reusable components should expose the smallest useful public interface.
// - Shared UI components should not contain feature-specific business rules.
// - Domain calculations, validation, persistence, and other independent concerns can be delegated when they have meaningful boundaries.
// - Not every small expression or JSX fragment needs to become a separate abstraction.
// - Responsibility is semantic and should not be determined by component line count alone.
// - Responsibility drift occurs when unrelated behavior accumulates inside an existing component.
// - Composition allows specialized components to collaborate while preserving clear responsibilities.
// - A component should own behavior that naturally belongs to its UI and delegate concerns that belong elsewhere.
// - The goal is not maximum decomposition; the goal is coherent component boundaries that localize change.

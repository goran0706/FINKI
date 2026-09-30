/**
 * Component Cohesion
 * ===================
 *
 * Component cohesion describes how closely the responsibilities, state, behavior, and UI
 * contained within a component belong together. A cohesive component represents a focused
 * concept and its internal parts naturally work toward the same purpose.
 *
 * High cohesion does not mean that a component must be small. A component can contain
 * substantial logic when that logic belongs to one coherent responsibility. The goal is
 * to keep related behavior together while separating unrelated concerns.
 */

import { type FC, type FormEvent, type ReactElement, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. A cohesive component represents one meaningful concept
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <section>
      <h1>Hello, {name}</h1>
      <p>Welcome back.</p>
    </section>
  );
};

// The heading and supporting text belong together because they describe
// the same UI concept: a greeting.

// ---------------------------------------------------------------------
// 2. Cohesion is about relationships between responsibilities
// ---------------------------------------------------------------------

interface ProductCardProps {
  readonly name: string;
  readonly price: number;
}

export const ProductCard: FC<ProductCardProps> = ({ name, price }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>${price.toFixed(2)}</p>

      <button type="button">Add to cart</button>
    </article>
  );
};

// Rendering the product name, displaying its price, and providing
// the product's primary action are closely related responsibilities.

// ---------------------------------------------------------------------
// 3. Cohesion does not mean "one JSX element"
//
// ---------------------------------------------------------------------

interface UserSummaryProps {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

export const UserSummary: FC<UserSummaryProps> = ({ name, email, role }): ReactElement => {
  return (
    <article>
      <header>
        <h2>{name}</h2>
        <p>{email}</p>
      </header>

      <footer>
        <span>{role}</span>
      </footer>
    </article>
  );
};

// Several elements can form one cohesive component when they collectively
// represent one concept: a user summary.

// ---------------------------------------------------------------------
// 4. Local state should support the component's concept
// ---------------------------------------------------------------------

export const Disclosure: FC = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((value) => !value);
        }}
      >
        {isOpen ? "Hide details" : "Show details"}
      </button>

      {isOpen && <p>Additional information.</p>}
    </section>
  );
};

// `isOpen` and the toggle behavior are highly cohesive with the disclosure UI.
// The state exists specifically to support this component's concept.

// ---------------------------------------------------------------------
// 5. Related state tends to indicate cohesion
// ---------------------------------------------------------------------

export const SearchBox: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label>
      Search
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        aria-label="Search"
      />
      {isFocused && query.length > 0 && <span>Searching for: {query}</span>}
    </label>
  );
};

// Both pieces of state describe the search input's interaction.
// They therefore form a cohesive state boundary.

// ---------------------------------------------------------------------
// 6. Unrelated state reduces cohesion
// ---------------------------------------------------------------------

// Avoid a component where local state represents unrelated concepts:
//
// const Dashboard = (): ReactElement => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedTheme, setSelectedTheme] = useState("light");
//     const [cartCount, setCartCount] = useState(0);
//     const [notificationOpen, setNotificationOpen] = useState(false);
// };
//
// Each state value may be valid individually, but the collection does not
// necessarily form one cohesive responsibility.

// ---------------------------------------------------------------------
// 7. Cohesive state can still coordinate multiple UI elements
// ---------------------------------------------------------------------

export const Tabs: FC = (): ReactElement => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section>
      <nav>
        {["overview", "details"].map((tab) => (
          <button
            key={tab}
            type="button"
            aria-selected={activeTab === tab}
            onClick={() => {
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && <p>Overview information.</p>}

      {activeTab === "details" && <p>Detailed information.</p>}
    </section>
  );
};

// The navigation and displayed content are cohesive because both depend
// on the same tab-selection concept.

// ---------------------------------------------------------------------
// 8. Cohesion can be weakened by unrelated UI
// ---------------------------------------------------------------------

// A component becomes less cohesive when unrelated concerns are added:
//
// ProductCard
//     -> product information
//     -> product actions
//     -> application navigation
//     -> global notification management
//     -> account authentication
//
// The problem is not necessarily the number of lines.
// The problem is that the responsibilities no longer form one clear concept.

// ---------------------------------------------------------------------
// 9. Keep behavior close to the UI it controls
// ---------------------------------------------------------------------

interface QuantitySelectorProps {
  readonly initialQuantity: number;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ initialQuantity }): ReactElement => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increase = (): void => {
    setQuantity((value) => value + 1);
  };

  const decrease = (): void => {
    setQuantity((value) => Math.max(1, value - 1));
  };

  return (
    <div>
      <button type="button" onClick={decrease}>
        -
      </button>

      <span>{quantity}</span>

      <button type="button" onClick={increase}>
        +
      </button>
    </div>
  );
};

// State, increment/decrement behavior, and the quantity controls all
// belong to the same cohesive concept.

// ---------------------------------------------------------------------
// 10. Extract reusable behavior when the behavior itself is cohesive
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

// The hook has a cohesive responsibility: reusable toggle state behavior.
// It does not contain UI markup because presentation is not part of its concern.

// ---------------------------------------------------------------------
// 11. A component can consume cohesive behavior
// ---------------------------------------------------------------------

export const SettingsSection: FC = (): ReactElement => {
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

// The component remains cohesive because its concern is still the settings section.
// The reusable toggle mechanics have simply been extracted.

// ---------------------------------------------------------------------
// 12. Cohesive components can contain derived values
// ---------------------------------------------------------------------

interface CartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

interface CartSummaryProps {
  readonly items: readonly CartItem[];
}

export const CartSummary: FC<CartSummaryProps> = ({ items }): ReactElement => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <section>
      <p>Items: {totalQuantity}</p>

      <p>Total: ${totalPrice.toFixed(2)}</p>
    </section>
  );
};

// Both derived values describe the same concern: summarizing the cart.
// Keeping them together is cohesive.

// ---------------------------------------------------------------------
// 13. Extract independent domain calculations when appropriate
// ---------------------------------------------------------------------

function calculateCartTotal(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export const CartSummaryWithCalculation: FC<CartSummaryProps> = ({ items }): ReactElement => {
  const total = calculateCartTotal(items);

  return (
    <section>
      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
};

// The calculation can be extracted when it represents an independently meaningful
// domain rule. Extraction should preserve cohesion rather than merely shorten the component.

// ---------------------------------------------------------------------
// 14. Cohesion and props
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

// These props directly support the component's responsibility.
// A component requiring many unrelated props can be a signal that its
// responsibility is broader than one coherent concept.

// ---------------------------------------------------------------------
// 15. Too many unrelated props can signal weak cohesion
// ---------------------------------------------------------------------

// This shape can be suspicious:
//
// interface ComponentProps {
//     readonly productName: string;
//     readonly productPrice: number;
//     readonly userName: string;
//     readonly userEmail: string;
//     readonly theme: string;
//     readonly notificationCount: number;
// };
//
// The issue is not the number of props itself.
// The issue is whether those values belong to one meaningful responsibility.

// ---------------------------------------------------------------------
// 16. Props should describe one conceptual boundary
// ---------------------------------------------------------------------

interface ProfileCardProps {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string;
}

export const ProfileCard: FC<ProfileCardProps> = ({ name, email, avatarUrl }): ReactElement => {
  return (
    <article>
      <img src={avatarUrl} alt="" width={48} height={48} />

      <div>
        <h2>{name}</h2>
        <p>{email}</p>
      </div>
    </article>
  );
};

// These props collectively describe one concept: a user's profile presentation.

// ---------------------------------------------------------------------
// 17. Cohesion and callbacks
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

// `onDelete` is cohesive with this component because the component represents
// a delete action and needs to report that action to its parent.

// ---------------------------------------------------------------------
// 18. The component should not decide unrelated operations
// ---------------------------------------------------------------------

// Avoid:
//
// const DeleteButton = ({
//     onDelete,
//     sendAnalytics,
//     refreshProfile,
//     updateTheme,
// }: Props): ReactElement => {
//     ...
// };
//
// If all of these operations are unrelated to the button's responsibility,
// the component is becoming a coordination point for unrelated concerns.

// ---------------------------------------------------------------------
// 19. Feature-level cohesion
// ---------------------------------------------------------------------

interface CheckoutProps {
  readonly items: readonly CartItem[];
  readonly onSubmit: () => Promise<void>;
}

export const Checkout: FC<CheckoutProps> = ({ items, onSubmit }): ReactElement => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = calculateCartTotal(items);

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);

    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Checkout</h1>

      <p>Total: ${total.toFixed(2)}</p>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          void handleSubmit();
        }}
      >
        {isSubmitting ? "Submitting..." : "Place order"}
      </button>
    </section>
  );
};

// The checkout heading, total, submission state, and submission action
// form one coherent feature-level responsibility.

// ---------------------------------------------------------------------
// 20. Cohesion is not the same as small size
// ---------------------------------------------------------------------

// A cohesive component can legitimately contain:
//
// - several pieces of JSX
// - local state
// - event handlers
// - derived values
// - accessibility behavior
// - validation directly tied to its interaction
//
// Size alone does not determine cohesion.

// ---------------------------------------------------------------------
// 21. A large component can still be cohesive
// ---------------------------------------------------------------------

interface ProfileEditorProps {
  readonly name: string;
  readonly email: string;
  readonly onSave: (name: string, email: string) => Promise<void>;
}

export const ProfileEditor: FC<ProfileEditorProps> = ({
  name: initialName,
  email: initialEmail,
  onSave,
}): ReactElement => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("Enter a valid name.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await onSave(name.trim(), email.trim());
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
      <label>
        Name
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          disabled={isSaving}
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
          disabled={isSaving}
        />
      </label>

      {error !== null && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
};

// Although this component contains several implementation details,
// they all support one concept: editing and saving a profile.

// ---------------------------------------------------------------------
// 22. Extract when a new concept becomes visible
// ---------------------------------------------------------------------

interface ValidationMessageProps {
  readonly message: string;
}

export const ValidationMessage: FC<ValidationMessageProps> = ({ message }): ReactElement => {
  return <p role="alert">{message}</p>;
};

// Extraction becomes useful when the extracted behavior or UI represents
// a meaningful concept that can stand on its own.

// ---------------------------------------------------------------------
// 23. Avoid extraction solely because code is repeated once
// ---------------------------------------------------------------------

// This does not automatically justify a new component:
//
// <span>{name}</span>
//
// Creating `NameText` only to wrap one span can make the architecture
// more fragmented without improving cohesion.
//
// A new component becomes more useful when the name has its own behavior,
// accessibility rules, styling contract, or repeated conceptual role.

// ---------------------------------------------------------------------
// 24. Cohesion and conditional rendering
// ---------------------------------------------------------------------

type LoadState = "idle" | "loading" | "success" | "error";

interface LoadingPanelProps {
  readonly state: LoadState;
}

export const LoadingPanel: FC<LoadingPanelProps> = ({ state }): ReactElement => {
  if (state === "loading") {
    return <p>Loading...</p>;
  }

  if (state === "error") {
    return <p role="alert">Unable to load data.</p>;
  }

  if (state === "success") {
    return <p>Data loaded.</p>;
  }

  return <p>Ready.</p>;
};

// These states all belong to one cohesive responsibility:
// representing the status of the same loading operation.

// ---------------------------------------------------------------------
// 25. Cohesion and state transitions
// ---------------------------------------------------------------------

type FormState = "idle" | "editing" | "submitting" | "success" | "error";

interface FormStatusProps {
  readonly state: FormState;
}

export const FormStatus: FC<FormStatusProps> = ({ state }): ReactElement => {
  switch (state) {
    case "editing":
      return <p>Editing...</p>;

    case "submitting":
      return <p>Saving...</p>;

    case "success":
      return <p>Saved successfully.</p>;

    case "error":
      return <p role="alert">Unable to save.</p>;

    default:
      return <p>Ready.</p>;
  }
};

// A group of related states often forms a cohesive model when all states
// describe one interaction or lifecycle.

// ---------------------------------------------------------------------
// 26. Avoid mixing unrelated state machines
// ---------------------------------------------------------------------

// A component becomes harder to reason about when one state model controls
// unrelated features:
//
// FormState
//     + ModalState
//     + ThemeState
//     + NotificationState
//
// These concerns may all exist on the same page, but they do not necessarily
// belong to the same component state boundary.

// ---------------------------------------------------------------------
// 27. Cohesion and custom hooks
// ---------------------------------------------------------------------

interface UseFormStateResult {
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly reset: () => void;
}

function useFormState(initialValue: string): UseFormStateResult {
  const [value, setValue] = useState(initialValue);

  const reset = (): void => {
    setValue(initialValue);
  };

  return {
    value,
    setValue,
    reset,
  };
}

// This hook is cohesive because its state, setter, and reset behavior
// all describe one reusable form-value concern.

// ---------------------------------------------------------------------
// 28. Use cohesive hooks inside cohesive components
// ---------------------------------------------------------------------

export const NameField: FC = (): ReactElement => {
  const { value: name, setValue: setName, reset } = useFormState("");

  return (
    <label>
      Name
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <button type="button" onClick={reset}>
        Reset
      </button>
    </label>
  );
};

// The component owns the name field's presentation.
// The hook owns reusable value-management behavior.

// ---------------------------------------------------------------------
// 29. Cohesion and derived UI
// ---------------------------------------------------------------------

interface PasswordFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const PasswordField: FC<PasswordFieldProps> = ({ value, onChange }): ReactElement => {
  const strength = value.length >= 12 ? "Strong" : value.length >= 8 ? "Medium" : "Weak";

  return (
    <label>
      Password
      <input
        type="password"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <span>Strength: {strength}</span>
    </label>
  );
};

// The strength indicator is derived directly from the password field's state.
// It is therefore cohesive with the field's presentation.

// ---------------------------------------------------------------------
// 30. Cohesion and reusable data models
// ---------------------------------------------------------------------

interface Address {
  readonly street: string;
  readonly city: string;
  readonly postalCode: string;
}

interface AddressSummaryProps {
  readonly address: Address;
}

export const AddressSummary: FC<AddressSummaryProps> = ({ address }): ReactElement => {
  return (
    <address>
      <div>{address.street}</div>
      <div>
        {address.postalCode} {address.city}
      </div>
    </address>
  );
};

// The component's props represent one coherent domain concept.
// The data model and UI model align naturally.

// ---------------------------------------------------------------------
// 31. Cohesion can exist at different architectural levels
// ---------------------------------------------------------------------

// Component-level cohesion:
//
// ProductCard
//     -> product presentation
//
// Hook-level cohesion:
//
// useToggle
//     -> toggle state behavior
//
// Function-level cohesion:
//
// calculateCartTotal
//     -> cart total calculation
//
// Feature-level cohesion:
//
// Checkout
//     -> checkout interaction and coordination
//
// Module-level cohesion:
//
// product-data module
//     -> product-related data access
//
// The same principle applies at each level: related responsibilities should
// remain close when they naturally change and collaborate together.

// ---------------------------------------------------------------------
// 32. Cohesion and module boundaries
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly getProduct: (productId: string) => Promise<Product>;
}

async function loadProduct(repository: ProductRepository, productId: string): Promise<Product> {
  return repository.getProduct(productId);
}

// The repository abstraction represents product data access.
// It should not also become responsible for rendering buttons or formatting UI text.

// ---------------------------------------------------------------------
// 33. Cohesion and composition
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

export const AccountOverview: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <ProfileCard name="John Doe" email="john@example.com" avatarUrl="/profile.jpg" />
    </Panel>
  );
};

// Composition allows each component to remain cohesive while the parent
// assembles them into a larger UI concept.

// ---------------------------------------------------------------------
// 34. Weak cohesion: the "everything page"
// ---------------------------------------------------------------------

// A page component can become weakly cohesive when it directly owns:
//
// - unrelated modal state
// - product calculations
// - authentication rules
// - notification delivery
// - API parsing
// - theme switching
// - analytics
// - several unrelated forms
//
// The page may still render correctly, but its internal responsibilities
// become difficult to describe as one coherent concept.

// ---------------------------------------------------------------------
// 35. Improve cohesion through meaningful boundaries
// ---------------------------------------------------------------------

interface AccountPageProps {
  readonly user: User;
}

export const AccountPage: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <ProfileCard name={user.name} email={user.email} avatarUrl="/profile.jpg" />

      <SettingsSection />

      <Button>Sign out</Button>
    </main>
  );
};

// The page coordinates account-related sections while each child retains
// a more focused internal responsibility.

// ---------------------------------------------------------------------
// 36. Cohesion should guide extraction decisions
// ---------------------------------------------------------------------

// Consider extraction when:
//
// - a group of logic represents a recognizable concept
// - the extracted code has its own state or behavior
// - the code is reused
// - the code changes for a different reason
// - the component becomes difficult to describe as one concept
//
// Avoid extraction when:
//
// - the abstraction has no meaningful identity
// - the extracted component only wraps trivial markup
// - the new boundary increases indirection without reducing complexity

// ---------------------------------------------------------------------
// 37. Cohesion and testing
// ---------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return email.includes("@");
}

// A cohesive function can be tested directly because its responsibility
// is narrow and independent of rendering.

// ---------------------------------------------------------------------
// 38. Test cohesive component behavior
// ---------------------------------------------------------------------

interface EmailFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const EmailField: FC<EmailFieldProps> = ({ value, onChange }): ReactElement => {
  return (
    <label>
      Email
      <input
        type="email"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </label>
  );
};

// A focused component allows tests to concentrate on one UI responsibility:
// rendering and editing an email field.

// ---------------------------------------------------------------------
// 39. Cohesion and responsibility are related but distinct
// ---------------------------------------------------------------------

// Responsibility asks:
//
// "What is this component responsible for?"
//
// Cohesion asks:
//
// "How closely related are the things inside that responsibility?"
//
// A component can have a valid responsibility but weak internal cohesion
// if unrelated implementation details have accumulated within it.

// ---------------------------------------------------------------------
// 40. Complete cohesive feature example
// ---------------------------------------------------------------------

interface ProductEditorProps {
  readonly product: Product;
  readonly onSave: (product: Product) => Promise<void>;
}

export const ProductEditor: FC<ProductEditorProps> = ({ product, onSave }): ReactElement => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.priceInCents.toString());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedPrice = Number(price);

    if (normalizedName.length < 2) {
      setError("Enter a valid product name.");
      return;
    }

    if (!Number.isInteger(normalizedPrice) || normalizedPrice < 0) {
      setError("Enter a valid price.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await onSave({
        ...product,
        name: normalizedName,
        priceInCents: normalizedPrice,
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
      <label>
        Product name
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          disabled={isSaving}
        />
      </label>

      <label>
        Price in cents
        <input
          value={price}
          onChange={(event) => {
            setPrice(event.target.value);
          }}
          inputMode="numeric"
          disabled={isSaving}
        />
      </label>

      {error !== null && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save product"}
      </button>
    </form>
  );
};

// The component contains multiple pieces of state, validation, event handling,
// and presentation, but they all serve one coherent concept: editing a product.
//
// If unrelated concerns such as global theme management, analytics configuration,
// or authentication were added, cohesion would begin to decrease.

// ---------------------------------------------------------------------
// 41. Practical cohesion checklist
// ---------------------------------------------------------------------

// Ask:
//
// - Can the component be described with one clear conceptual purpose?
// - Do its state values support that purpose?
// - Do its event handlers operate on that same concept?
// - Do its props belong to the same conceptual boundary?
// - Do its derived values describe the same UI or domain concept?
// - Would removing one part leave the remaining parts unrelated?
// - Are unrelated features accumulating inside the component?
// - Would extraction create a meaningful concept or only another layer of indirection?
//
// Cohesion should guide component boundaries rather than arbitrary file-size rules.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Component cohesion describes how closely the responsibilities inside a component belong together.
// - A cohesive component represents one meaningful concept even when it contains several elements and behaviors.
// - Cohesion is about related responsibilities, not component line count.
// - Local state should support the component's conceptual responsibility.
// - Related state, derived values, event handlers, and UI often form a cohesive boundary.
// - Unrelated state and unrelated application behavior can weaken cohesion.
// - Props should describe a coherent collaboration boundary rather than unrelated application concerns.
// - Custom hooks can encapsulate cohesive reusable stateful behavior without owning presentation.
// - Domain functions can be extracted when they represent independently meaningful rules.
// - Extraction is useful when it creates a recognizable concept, reuse boundary, or independent reason for change.
// - Extraction is not automatically beneficial when it only wraps trivial JSX or adds unnecessary indirection.
// - Cohesion exists at component, hook, function, module, and feature levels.
// - Composition allows larger features to remain understandable while individual components retain focused responsibilities.
// - High cohesion helps localize changes, reduce mental overhead, and make behavior easier to test.
// - The goal is not the smallest possible component; the goal is a component whose internal parts naturally belong together.

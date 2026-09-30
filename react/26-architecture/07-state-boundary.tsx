/**
 * State Boundary
 * ===============
 *
 * A state boundary defines which component owns a piece of state, which components may read or
 * update it, and how that state crosses component boundaries. Deliberate state ownership keeps
 * updates predictable, limits unnecessary dependencies, and prevents unrelated components from
 * becoming coupled to the same state.
 */

import { useState } from "react";
import type { FC, ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. State ownership
// ---------------------------------------------------------------------

// A state boundary begins with an ownership decision.
// The component that owns state controls how that state changes.
export const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </section>
  );
};

// The count is private to Counter.
// No parent or sibling can modify it directly.

// ---------------------------------------------------------------------
// 2. Local state should remain local when possible
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

// The parent does not need to know whether the disclosure is open.
// Keeping the state here prevents unnecessary state ownership at a higher level.
export const DisclosureExample: FC = (): ReactElement => {
  return (
    <Disclosure title="Details">
      <p>Additional information.</p>
    </Disclosure>
  );
};

// ---------------------------------------------------------------------
// 3. State should be lifted when coordination is required
// ---------------------------------------------------------------------

interface TextFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const TextField: FC<TextFieldProps> = ({ value, onChange }): ReactElement => {
  return <input value={value} onChange={(event) => onChange(event.target.value)} />;
};

export const SearchPage: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <section>
      <TextField value={query} onChange={setQuery} />
      <p>Current query: {query || "None"}</p>
    </section>
  );
};

// The parent owns query because both the input and result display depend on it.

// ---------------------------------------------------------------------
// 4. Shared state belongs at the nearest common owner
// ---------------------------------------------------------------------

interface SearchResultsProps {
  readonly query: string;
}

export const SearchResults: FC<SearchResultsProps> = ({ query }): ReactElement => {
  return <p>Results for: {query || "all items"}</p>;
};

export const SearchInterface: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <section>
      <TextField value={query} onChange={setQuery} />
      <SearchResults query={query} />
    </section>
  );
};

// The state is owned by the nearest component that needs to coordinate both consumers.
// This is commonly called lifting state up.

// ---------------------------------------------------------------------
// 5. Avoid duplicated state
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductSelectionProps {
  readonly products: readonly Product[];
  readonly selectedProductId: string | null;
  readonly onSelect: (productId: string) => void;
}

export const ProductSelection: FC<ProductSelectionProps> = ({
  products,
  selectedProductId,
  onSelect,
}): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button type="button" aria-pressed={selectedProductId === product.id} onClick={() => onSelect(product.id)}>
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export const ProductSelectionExample: FC = (): ReactElement => {
  const products: readonly Product[] = [
    { id: "product-1", name: "Notebook", priceInCents: 1200 },
    { id: "product-2", name: "Pen", priceInCents: 500 },
  ];
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  return <ProductSelection products={products} selectedProductId={selectedProductId} onSelect={setSelectedProductId} />;
};

// One source of truth is preferable to separate selectedProduct state
// maintained independently by multiple components.

// ---------------------------------------------------------------------
// 6. Derived state should usually not have its own boundary
// ---------------------------------------------------------------------

interface CartItem {
  readonly id: string;
  readonly quantity: number;
  readonly priceInCents: number;
}

export const CartSummary: FC = (): ReactElement => {
  const [items, setItems] = useState<readonly CartItem[]>([
    { id: "item-1", quantity: 2, priceInCents: 1000 },
    { id: "item-2", quantity: 1, priceInCents: 2500 },
  ]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalInCents = items.reduce((total, item) => total + item.quantity * item.priceInCents, 0);

  const addItem = (): void => {
    setItems([...items, { id: `item-${items.length + 1}`, quantity: 1, priceInCents: 1500 }]);
  };

  return (
    <section>
      <p>Items: {itemCount}</p>
      <p>Total: ${(totalInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={addItem}>
        Add item
      </button>
    </section>
  );
};

// itemCount and totalInCents are derived from items.
// They do not need separate state because they have no independent source of truth.

// ---------------------------------------------------------------------
// 7. Avoid mirrored state across boundaries
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

interface UserProfileProps {
  readonly user: User;
}

export const UserProfile: FC<UserProfileProps> = ({ user }): ReactElement => {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>ID: {user.id}</p>
    </section>
  );
};

// The component renders directly from the prop.
// Creating separate local state for the same user object would create two possible sources of truth.
export const UserProfileExample: FC = (): ReactElement => {
  const user: User = {
    id: "user-1",
    name: "John Doe",
  };

  return <UserProfile user={user} />;
};

// ---------------------------------------------------------------------
// 8. Controlled state crosses a boundary explicitly
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ value, onChange }): ReactElement => {
  return (
    <button type="button" aria-pressed={value} onClick={() => onChange(!value)}>
      {value ? "Enabled" : "Disabled"}
    </button>
  );
};

// The parent owns the state while Toggle owns only its presentation and interaction.
export const ToggleExample: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return <Toggle value={enabled} onChange={setEnabled} />;
};

// ---------------------------------------------------------------------
// 9. Uncontrolled state can remain inside a boundary
// ---------------------------------------------------------------------

interface ExpandablePanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const ExpandablePanel: FC<ExpandablePanelProps> = ({ title, children }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Collapse" : "Expand"} {title}
      </button>
      {expanded && children}
    </section>
  );
};

// No external component needs the expanded value.
// The state therefore remains inside the component boundary.
export const ExpandablePanelExample: FC = (): ReactElement => {
  return (
    <ExpandablePanel title="Information">
      <p>Panel content.</p>
    </ExpandablePanel>
  );
};

// ---------------------------------------------------------------------
// 10. State ownership determines event direction
// ---------------------------------------------------------------------

interface QuantityInputProps {
  readonly quantity: number;
  readonly onQuantityChange: (quantity: number) => void;
}

export const QuantityInput: FC<QuantityInputProps> = ({ quantity, onQuantityChange }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={() => onQuantityChange(Math.max(0, quantity - 1))}>
        -
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={() => onQuantityChange(quantity + 1)}>
        +
      </button>
    </div>
  );
};

// Data flows down through props.
// Events flow up through callbacks.
export const QuantityExample: FC = (): ReactElement => {
  const [quantity, setQuantity] = useState(1);

  return <QuantityInput quantity={quantity} onQuantityChange={setQuantity} />;
};

// ---------------------------------------------------------------------
// 11. State boundaries and composition
// ---------------------------------------------------------------------

interface CardProps {
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ children }): ReactElement => {
  return <article>{children}</article>;
};

interface ProductCardProps {
  readonly product: Product;
  readonly onSelect: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onSelect }): ReactElement => {
  return (
    <Card>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={() => onSelect(product.id)}>
        Select
      </button>
    </Card>
  );
};

// Card does not own product selection state.
// ProductCard receives the state and event boundary it needs.
export const ProductCardExample: FC = (): ReactElement => {
  const product: Product = {
    id: "product-1",
    name: "Notebook",
    priceInCents: 1200,
  };
  const [selected, setSelected] = useState(false);

  return <ProductCard product={product} onSelect={() => setSelected(!selected)} />;
};

// ---------------------------------------------------------------------
// 12. State boundaries should follow coordination needs
// ---------------------------------------------------------------------

interface StepOneProps {
  readonly onNext: () => void;
}

export const StepOne: FC<StepOneProps> = ({ onNext }): ReactElement => {
  return (
    <section>
      <h2>Step One</h2>
      <button type="button" onClick={onNext}>
        Next
      </button>
    </section>
  );
};

interface StepTwoProps {
  readonly onBack: () => void;
}

export const StepTwo: FC<StepTwoProps> = ({ onBack }): ReactElement => {
  return (
    <section>
      <h2>Step Two</h2>
      <button type="button" onClick={onBack}>
        Back
      </button>
    </section>
  );
};

export const Wizard: FC = (): ReactElement => {
  const [step, setStep] = useState<1 | 2>(1);

  return step === 1 ? <StepOne onNext={() => setStep(2)} /> : <StepTwo onBack={() => setStep(1)} />;
};

// The wizard owns the current step because it coordinates multiple child views.

// ---------------------------------------------------------------------
// 13. State should not be owned by an unrelated ancestor
// ---------------------------------------------------------------------

interface PageHeaderProps {
  readonly title: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title }): ReactElement => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

// Header does not need access to application state merely because it is rendered
// somewhere above a stateful feature.
export const PageExample: FC = (): ReactElement => {
  return (
    <section>
      <PageHeader title="Products" />
      <ProductSelectionExample />
    </section>
  );
};

// Unrelated ancestors should not become state containers by default.

// ---------------------------------------------------------------------
// 14. State locality reduces dependency surface
// ---------------------------------------------------------------------

interface TabsProps {
  readonly tabs: readonly string[];
}

export const Tabs: FC<TabsProps> = ({ tabs }): ReactElement => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section>
      <nav>
        {tabs.map((tab, index) => (
          <button key={tab} type="button" aria-selected={index === activeTab} onClick={() => setActiveTab(index)}>
            {tab}
          </button>
        ))}
      </nav>
      <p>Active tab: {tabs[activeTab]}</p>
    </section>
  );
};

// activeTab affects only Tabs.
// Keeping it local avoids exposing an implementation detail to the rest of the tree.
export const TabsExample: FC = (): ReactElement => {
  return <Tabs tabs={["Overview", "Details", "Settings"]} />;
};

// ---------------------------------------------------------------------
// 15. Context can create a wider state boundary
// ---------------------------------------------------------------------

interface ThemeState {
  readonly theme: "light" | "dark";
  readonly setTheme: (theme: "light" | "dark") => void;
}

// Context can be appropriate when many descendants need the same state.
// It should not be used merely to avoid passing one prop through a small tree.
//
// A context provider effectively establishes a wider state boundary:
// descendants become coupled to the context contract.

// ---------------------------------------------------------------------
// 16. Global state should represent genuinely shared state
// ---------------------------------------------------------------------

interface SessionState {
  readonly userId: string | null;
  readonly isAuthenticated: boolean;
}

// Session state can legitimately affect many independent features.
// Such state may justify a broader application-level boundary.
//
// Local UI state such as whether one menu is expanded usually does not.

// ---------------------------------------------------------------------
// 17. Server data and UI state are different boundaries
// ---------------------------------------------------------------------

interface ProductData {
  readonly id: string;
  readonly name: string;
}

interface ProductViewProps {
  readonly product: ProductData;
}

export const ProductView: FC<ProductViewProps> = ({ product }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article>
      <h2>{product.name}</h2>
      <button type="button" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide" : "Show"} details
      </button>
      {expanded && <p>Product ID: {product.id}</p>}
    </article>
  );
};

// product represents external/application data.
// expanded represents local interaction state.
// These values have different ownership and lifecycle characteristics.

// ---------------------------------------------------------------------
// 18. State boundaries should respect lifecycle
// ---------------------------------------------------------------------

interface Notification {
  readonly id: string;
  readonly message: string;
}

interface NotificationListProps {
  readonly notifications: readonly Notification[];
}

export const NotificationList: FC<NotificationListProps> = ({ notifications }): ReactElement => {
  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>{notification.message}</li>
      ))}
    </ul>
  );
};

// Notifications may belong to a broader application or server-data boundary.
// NotificationList should not automatically copy them into local state.
// The appropriate owner depends on who is responsible for their lifecycle.

// ---------------------------------------------------------------------
// 19. State boundaries and derived values
// ---------------------------------------------------------------------

interface CartState {
  readonly items: readonly CartItem[];
}

export const CartTotals: FC = (): ReactElement => {
  const [cart, setCart] = useState<CartState>({
    items: [{ id: "item-1", quantity: 2, priceInCents: 1000 }],
  });

  const totalInCents = cart.items.reduce((total, item) => total + item.quantity * item.priceInCents, 0);

  const clearCart = (): void => {
    setCart({ items: [] });
  };

  return (
    <section>
      <p>Total: ${(totalInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={clearCart}>
        Clear cart
      </button>
    </section>
  );
};

// The cart is state.
// The total is derived data.
// Keeping only the source state prevents synchronization problems.

// ---------------------------------------------------------------------
// 20. State boundaries and identity
// ---------------------------------------------------------------------

interface EditorState {
  readonly title: string;
  readonly description: string;
}

export const Editor: FC = (): ReactElement => {
  const [state, setState] = useState<EditorState>({
    title: "",
    description: "",
  });

  const updateTitle = (title: string): void => {
    setState({
      ...state,
      title,
    });
  };

  return (
    <section>
      <input value={state.title} onChange={(event) => updateTitle(event.target.value)} />
      <textarea
        value={state.description}
        onChange={(event) =>
          setState({
            ...state,
            description: event.target.value,
          })
        }
      />
    </section>
  );
};

// Immutable replacement creates a new state value at the boundary.
// Mutating the existing object would make state transitions harder to reason about.

// ---------------------------------------------------------------------
// 21. Functional updates protect state transitions
// ---------------------------------------------------------------------

export const ScoreCounter: FC = (): ReactElement => {
  const [score, setScore] = useState(0);

  const addPoint = (): void => {
    setScore((currentScore) => currentScore + 1);
  };

  return (
    <section>
      <p>Score: {score}</p>
      <button type="button" onClick={addPoint}>
        Add point
      </button>
    </section>
  );
};

// Functional updates express the transition from the previous state.
// They are useful when the next state depends on the previous state.

// ---------------------------------------------------------------------
// 22. State machines can define explicit boundaries
// ---------------------------------------------------------------------

type RequestStatus =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly message: string }
  | { readonly status: "error"; readonly message: string };

interface RequestStateProps {
  readonly state: RequestStatus;
}

export const RequestState: FC<RequestStateProps> = ({ state }): ReactElement => {
  switch (state.status) {
    case "idle":
      return <p>Ready.</p>;
    case "loading":
      return <p>Loading...</p>;
    case "success":
      return <p>{state.message}</p>;
    case "error":
      return <p>{state.message}</p>;
  }
};

// A discriminated union makes valid states explicit.
// The state boundary can prevent impossible combinations such as
// `status: "loading"` with a required success message.

// ---------------------------------------------------------------------
// 23. Avoid exposing state transition mechanics
// ---------------------------------------------------------------------

interface FormActions {
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

export const FormActions: FC<FormActions> = ({ onSubmit, onCancel }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

// Consumers express intent through callbacks.
// They do not need to know whether the parent uses useState, useReducer,
// a state machine, or another state-management mechanism.

// ---------------------------------------------------------------------
// 24. State boundaries and reducers
// ---------------------------------------------------------------------

type EditorAction =
  | { readonly type: "set-title"; readonly title: string }
  | { readonly type: "set-description"; readonly description: string }
  | { readonly type: "reset" };

const initialEditorState: EditorState = {
  title: "",
  description: "",
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "set-title":
      return { ...state, title: action.title };
    case "set-description":
      return { ...state, description: action.description };
    case "reset":
      return initialEditorState;
  }
};

// A reducer can establish a stronger state-transition boundary.
// The component interacts with actions rather than directly manipulating every state field.

// ---------------------------------------------------------------------
// 25. State boundary smells
// ---------------------------------------------------------------------

// Common warning signs include:
// - duplicated copies of the same state
// - state owned by an unrelated ancestor
// - state unnecessarily placed in global storage
// - derived values stored separately from their source
// - child components modifying parent state through hidden mechanisms
// - many components depending on a broad shared state object
// - state transitions spread across unrelated components
//
// These signals suggest reviewing ownership, not automatically moving state elsewhere.

// ---------------------------------------------------------------------
// 26. A state boundary should have one clear owner
// ---------------------------------------------------------------------

interface FilterState {
  readonly query: string;
  readonly category: string;
}

interface FilterControlsProps {
  readonly state: FilterState;
  readonly onChange: (state: FilterState) => void;
}

export const FilterControls: FC<FilterControlsProps> = ({ state, onChange }): ReactElement => {
  return (
    <section>
      <input
        value={state.query}
        onChange={(event) =>
          onChange({
            ...state,
            query: event.target.value,
          })
        }
      />
      <select
        value={state.category}
        onChange={(event) =>
          onChange({
            ...state,
            category: event.target.value,
          })
        }
      >
        <option value="all">All</option>
        <option value="books">Books</option>
        <option value="office">Office</option>
      </select>
    </section>
  );
};

export const FilterExample: FC = (): ReactElement => {
  const [state, setState] = useState<FilterState>({
    query: "",
    category: "all",
  });

  return <FilterControls state={state} onChange={setState} />;
};

// The parent owns the complete filter state.
// FilterControls owns only the interaction details for editing that state.

// ---------------------------------------------------------------------
// 27. State boundary with multiple coordinated children
// ---------------------------------------------------------------------

interface ResultsProps {
  readonly query: string;
  readonly category: string;
}

export const Results: FC<ResultsProps> = ({ query, category }): ReactElement => {
  return (
    <p>
      Query: {query || "all"} | Category: {category}
    </p>
  );
};

export const FilteredResultsPage: FC = (): ReactElement => {
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category: "all",
  });

  return (
    <section>
      <FilterControls state={filters} onChange={setFilters} />
      <Results query={filters.query} category={filters.category} />
    </section>
  );
};

// FilteredResultsPage is the state boundary because it coordinates
// both editing the filters and displaying their effect.

// ---------------------------------------------------------------------
// 28. Refactoring an overly broad state boundary
// ---------------------------------------------------------------------

interface ApplicationState {
  readonly user: User | null;
  readonly theme: "light" | "dark";
  readonly searchQuery: string;
  readonly isMenuOpen: boolean;
}

// A single application state object can become an accidental boundary for unrelated concerns.
//
// User/session state, theme preferences, search state, and menu visibility have different
// ownership and lifecycle requirements. They should not automatically share one state owner.
//
// A useful refactoring is to identify which consumers actually coordinate each piece of state.

// ---------------------------------------------------------------------
// 29. Complete state-boundary example
// ---------------------------------------------------------------------

interface CartItemRowProps {
  readonly item: CartItem;
  readonly onQuantityChange: (itemId: string, quantity: number) => void;
}

export const CartItemRow: FC<CartItemRowProps> = ({ item, onQuantityChange }): ReactElement => {
  return (
    <li>
      <span>{item.id}</span>
      <QuantityInput quantity={item.quantity} onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)} />
    </li>
  );
};

export const Cart: FC = (): ReactElement => {
  const [items, setItems] = useState<readonly CartItem[]>([
    { id: "item-1", quantity: 1, priceInCents: 1200 },
    { id: "item-2", quantity: 2, priceInCents: 800 },
  ]);

  const handleQuantityChange = (itemId: string, quantity: number): void => {
    setItems((currentItems) => currentItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const totalInCents = items.reduce((total, item) => total + item.quantity * item.priceInCents, 0);

  return (
    <section>
      <h2>Cart</h2>
      <ul>
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} onQuantityChange={handleQuantityChange} />
        ))}
      </ul>
      <p>Total: ${(totalInCents / 100).toFixed(2)}</p>
    </section>
  );
};

// Cart owns the collection because it coordinates:
// - which items exist
// - item quantities
// - derived totals
// - updates to individual items
//
// CartItemRow owns only the interaction needed to edit one quantity.
// The state boundary therefore follows the coordination responsibility.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A state boundary defines who owns, reads, and changes a piece of state.
// - Local state should remain local when no other component needs to coordinate it.
// - Shared state should usually live at the nearest common owner of its consumers.
// - Lifting state up is appropriate when multiple components must coordinate the same value.
// - A single source of truth prevents duplicated and conflicting state.
// - Derived values should generally be calculated from source state instead of stored separately.
// - Controlled components receive state and report changes through explicit callbacks.
// - Uncontrolled components can keep self-contained interaction state inside their boundary.
// - State ownership determines the direction of data and event flow between components.
// - Context and global state create wider boundaries and should represent genuinely shared concerns.
// - External data and local UI state can have different owners and lifecycles.
// - Reducers and state machines can make complex state transitions explicit.
// - Functional state updates are useful when the next state depends on the previous state.
// - State boundaries should be based on coordination, lifecycle, and ownership rather than convenience.
// - Duplicated state, unrelated global state, and overly broad owners are common boundary smells.

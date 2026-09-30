/**
 * Single Responsibility
 * =====================
 *
 * The Single Responsibility Principle (SRP) says that a module or component should have a focused
 * responsibility and therefore a focused reason to change. In React applications, this usually means
 * separating rendering, state management, data access, validation, and domain operations when those
 * concerns would otherwise make one component difficult to understand, test, or change.
 */

import { type FC, type FormEvent, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. A component with a focused responsibility
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <h1>Hello, {name}</h1>;
};

// `Greeting` has one clear responsibility: rendering a greeting.
// Its behavior is easy to understand because it does not also manage unrelated concerns.

// ---------------------------------------------------------------------
// 2. Responsibility is not the same as having one line of code
// ---------------------------------------------------------------------

interface ProductProps {
  readonly name: string;
  readonly price: number;
}

export const ProductSummary: FC<ProductProps> = ({ name, price }): ReactElement => {
  const formattedPrice = `$${price.toFixed(2)}`;

  return (
    <article>
      <h2>{name}</h2>
      <p>{formattedPrice}</p>
    </article>
  );
};

// A component can contain several statements and still have one cohesive responsibility.
// SRP does not mean that every component must contain only one operation.

// ---------------------------------------------------------------------
// 3. A component with too many responsibilities
// ---------------------------------------------------------------------

// A component becomes harder to maintain when it simultaneously:
//
// - fetches data
// - validates input
// - manages unrelated state
// - transforms domain data
// - performs persistence
// - renders the interface
//
// For example:
//
// export const UserProfile = (): ReactElement => {
//     const [name, setName] = useState("");
//
//     // Fetch user.
//     // Validate user.
//     // Save user.
//     // Format user.
//     // Render user.
// };
//
// The problem is not simply that the component is large.
// The problem is that several independent responsibilities are coupled together.

// ---------------------------------------------------------------------
// 4. Separating data access
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

async function fetchUser(userId: string): Promise<User> {
  return {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
  };
}

// Data retrieval has its own responsibility.
// The component does not need to know how the user is obtained.

// ---------------------------------------------------------------------
// 5. Separating data transformation
// ---------------------------------------------------------------------

interface UserViewModel {
  readonly displayName: string;
  readonly email: string;
}

function createUserViewModel(user: User): UserViewModel {
  return {
    displayName: user.name,
    email: user.email,
  };
}

// Transformation logic can be isolated when it represents a meaningful
// responsibility that may change independently of the UI.

// ---------------------------------------------------------------------
// 6. Separating presentation
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly user: UserViewModel;
}

export const UserCard: FC<UserCardProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
    </article>
  );
};

// `UserCard` focuses on presentation.
// It does not fetch the user or decide how raw API data is transformed.

// ---------------------------------------------------------------------
// 7. Composition keeps responsibilities separate
// ---------------------------------------------------------------------

export const UserProfile: FC<{ readonly userId: string }> = ({ userId }): ReactElement => {
  return (
    <section>
      <UserLoader userId={userId} />
    </section>
  );
};

export const UserLoader: FC<{ readonly userId: string }> = ({ userId }): ReactElement => {
  return (
    <UserCard
      user={{
        displayName: `User ${userId}`,
        email: "john@example.com",
      }}
    />
  );
};

// In a real application, the data-loading responsibility would usually
// live in a data layer, hook, Server Component, or framework-specific loader.
// The important architectural idea is that rendering does not need to own every concern.

// ---------------------------------------------------------------------
// 8. Separating validation
// ---------------------------------------------------------------------

interface ProfileInput {
  readonly name: string;
  readonly email: string;
}

interface ValidationResult {
  readonly valid: boolean;
  readonly message: string | null;
}

function validateProfile(input: ProfileInput): ValidationResult {
  if (input.name.trim() === "") {
    return {
      valid: false,
      message: "Name is required.",
    };
  }

  if (!input.email.includes("@")) {
    return {
      valid: false,
      message: "A valid email address is required.",
    };
  }

  return {
    valid: true,
    message: null,
  };
}

// Validation has a distinct reason to change from presentation.
// Keeping it separate also makes it reusable outside a specific component.

// ---------------------------------------------------------------------
// 9. A form can delegate validation
// ---------------------------------------------------------------------

export const ProfileForm: FC = (): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = validateProfile({
      name,
      email,
    });

    if (!result.valid) {
      console.log(result.message);
      return;
    }

    console.log("Profile is valid.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        placeholder="Name"
      />

      <input
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        placeholder="Email"
        type="email"
      />

      <button type="submit">Save</button>
    </form>
  );
};

// The form owns interaction state and rendering.
// Validation is delegated to a separate function.

// ---------------------------------------------------------------------
// 10. Separating domain operations
// ---------------------------------------------------------------------

async function saveProfile(input: ProfileInput): Promise<void> {
  console.log(`Saving ${input.name} (${input.email})`);
}

// The persistence operation has a different reason to change than the form's
// visual structure, so it can live outside the component.

// ---------------------------------------------------------------------
// 11. A focused component can coordinate other responsibilities
// ---------------------------------------------------------------------

export const ProfileEditor: FC = (): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const input: ProfileInput = {
      name,
      email,
    };

    const result = validateProfile(input);

    if (!result.valid) {
      console.log(result.message);
      return;
    }

    await saveProfile(input);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        placeholder="Name"
      />

      <input
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        placeholder="Email"
        type="email"
      />

      <button type="submit">Save</button>
    </form>
  );
};

// Coordination is still a responsibility.
// `ProfileEditor` coordinates input state, validation, and persistence without
// implementing all of those concerns itself.

// ---------------------------------------------------------------------
// 12. Responsibility should follow change
// ---------------------------------------------------------------------

// Consider three possible changes:
//
// 1. The visual layout changes.
// 2. The validation rules change.
// 3. The persistence mechanism changes.
//
// If all three changes require modifying one large component, the responsibilities
// are tightly coupled.
//
// If each concern has an appropriate boundary, changes can remain localized:
//
// UI change
//     -> ProfileEditor / presentational components
//
// Validation change
//     -> validateProfile
//
// Persistence change
//     -> saveProfile

// ---------------------------------------------------------------------
// 13. SRP does not mean "one component per function"
// ---------------------------------------------------------------------

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function calculateSubtotal(price: number, quantity: number): number {
  return price * quantity;
}

// These functions have small, focused responsibilities.
// They do not necessarily need separate modules.
//
// SRP is about responsibility boundaries, not arbitrary file or function counts.

// ---------------------------------------------------------------------
// 14. Avoid artificial fragmentation
// ---------------------------------------------------------------------

// This can be unnecessarily fragmented:
//
// function getName(user: User): string {
//     return user.name;
// }
//
// function getEmail(user: User): string {
//     return user.email;
// }
//
// function getId(user: User): string {
//     return user.id;
// }
//
// Splitting every expression into a separate abstraction does not automatically
// improve architecture. The abstractions should represent meaningful responsibilities.

// ---------------------------------------------------------------------
// 15. Component responsibility should match the component's purpose
// ---------------------------------------------------------------------

interface PriceProps {
  readonly price: number;
  readonly quantity: number;
}

export const OrderTotal: FC<PriceProps> = ({ price, quantity }): ReactElement => {
  const subtotal = calculateSubtotal(price, quantity);

  return <p>Total: {formatPrice(subtotal)}</p>;
};

// `OrderTotal` owns presentation of the total.
// The arithmetic and formatting are delegated to focused functions.

// ---------------------------------------------------------------------
// 16. Hooks can isolate stateful responsibilities
// ---------------------------------------------------------------------

interface FormState {
  readonly name: string;
  readonly email: string;
}

function useProfileForm(): {
  readonly state: FormState;
  readonly setName: (name: string) => void;
  readonly setEmail: (email: string) => void;
} {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return {
    state: {
      name,
      email,
    },
    setName,
    setEmail,
  };
}

// A custom hook can encapsulate reusable stateful behavior.
// The hook should represent a meaningful responsibility rather than merely
// moving arbitrary lines of component code elsewhere.

// ---------------------------------------------------------------------
// 17. Using the stateful responsibility
// ---------------------------------------------------------------------

export const ProfileEditorWithHook: FC = (): ReactElement => {
  const { state, setName, setEmail } = useProfileForm();

  return (
    <form>
      <input
        value={state.name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        placeholder="Name"
      />

      <input
        value={state.email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
        placeholder="Email"
        type="email"
      />

      <button type="submit">Save</button>
    </form>
  );
};

// The component focuses on the form's structure.
// The hook owns the form's reusable state behavior.

// ---------------------------------------------------------------------
// 18. Separating domain logic from UI state
// ---------------------------------------------------------------------

interface CartItem {
  readonly price: number;
  readonly quantity: number;
}

function calculateCartTotal(items: readonly CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// The calculation is domain logic.
// It does not depend on React, JSX, browser APIs, or component state.

// ---------------------------------------------------------------------
// 19. Rendering the domain result
// ---------------------------------------------------------------------

interface CartSummaryProps {
  readonly items: readonly CartItem[];
}

export const CartSummary: FC<CartSummaryProps> = ({ items }): ReactElement => {
  const total = calculateCartTotal(items);

  return (
    <aside>
      <strong>Total: {formatPrice(total)}</strong>
    </aside>
  );
};

// The component translates domain data into UI.
// The calculation remains independent from React.

// ---------------------------------------------------------------------
// 20. Separating side effects
// ---------------------------------------------------------------------

async function sendAnalyticsEvent(eventName: string): Promise<void> {
  console.log(`Analytics event: ${eventName}`);
}

// Analytics is a side-effect concern.
// It should not become intertwined with unrelated rendering logic.

// ---------------------------------------------------------------------
// 21. Avoid putting unrelated side effects into components
// ---------------------------------------------------------------------

// A component that renders a button does not automatically need to know
// how analytics, persistence, logging, and network requests work.
//
// Instead, it can coordinate those operations:
//
// export const SaveButton = (): ReactElement => {
//     const handleClick = async (): Promise<void> => {
//         await saveProfile(...);
//         await sendAnalyticsEvent("profile_saved");
//     };
//
//     return (
//         <button onClick={handleClick}>
//             Save
//         </button>
//     );
// };
//
// The button coordinates an interaction while the underlying operations
// remain separate concerns.

// ---------------------------------------------------------------------
// 22. SRP applies to modules as well as components
// ---------------------------------------------------------------------

// A module that contains:
//
// - UI components
// - database access
// - authentication
// - validation
// - analytics
// - unrelated utility functions
//
// may have several independent reasons to change.
//
// A module boundary should group code that changes together for a meaningful reason.

// ---------------------------------------------------------------------
// 23. A focused module API
// ---------------------------------------------------------------------

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.includes("@");
}

// These functions form a cohesive group around email normalization and validation.
// They can change together if the application's email rules change.

// ---------------------------------------------------------------------
// 24. Avoid unrelated exports from a focused module
// ---------------------------------------------------------------------

// A module centered on email validation should not also export:
//
// export function calculateCartTotal() {}
// export function renderProductCard() {}
// export async function connectToDatabase() {}
//
// Those functions represent different responsibilities and may change independently.

// ---------------------------------------------------------------------
// 25. Component responsibility and composition
// ---------------------------------------------------------------------

interface HeaderProps {
  readonly title: string;
}

export const Header: FC<HeaderProps> = ({ title }): ReactElement => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

interface PageProps {
  readonly children: ReactElement;
}

export const Page: FC<PageProps> = ({ children }): ReactElement => {
  return (
    <main>
      <Header title="Example Page" />
      {children}
    </main>
  );
};

// Composition allows each component to remain focused.
// `Page` composes the layout; `Header` renders the heading.

// ---------------------------------------------------------------------
// 26. Avoid a "god component"
// ---------------------------------------------------------------------

// A "god component" attempts to own nearly every application concern:
//
// - routing
// - authentication
// - data fetching
// - business rules
// - persistence
// - global state
// - form validation
// - analytics
// - complex rendering
//
// Such a component becomes difficult to reason about because unrelated
// changes all converge on the same implementation.

// ---------------------------------------------------------------------
// 27. Refactoring a large responsibility
// ---------------------------------------------------------------------

interface Order {
  readonly id: string;
  readonly items: readonly CartItem[];
}

function getOrderTotal(order: Order): number {
  return calculateCartTotal(order.items);
}

interface OrderSummaryProps {
  readonly order: Order;
}

export const OrderSummary: FC<OrderSummaryProps> = ({ order }): ReactElement => {
  const total = getOrderTotal(order);

  return (
    <section>
      <h2>Order {order.id}</h2>
      <p>Total: {formatPrice(total)}</p>
    </section>
  );
};

// The component focuses on displaying the order summary.
// Domain calculations remain outside the component.

// ---------------------------------------------------------------------
// 28. Responsibility can exist at different levels
// ---------------------------------------------------------------------

// Responsibility can be assigned to:
//
// Application
//     -> coordinates major features
//
// Feature
//     -> coordinates a user-facing capability
//
// Component
//     -> renders and coordinates a UI responsibility
//
// Hook
//     -> encapsulates reusable stateful behavior
//
// Domain function
//     -> implements business rules
//
// Data module
//     -> communicates with a data source
//
// The appropriate level depends on the application's architecture.

// ---------------------------------------------------------------------
// 29. SRP and testability
// ---------------------------------------------------------------------

function calculateDiscount(subtotal: number, percentage: number): number {
  return subtotal * (percentage / 100);
}

// A pure domain function can be tested without rendering a component,
// mounting a DOM tree, or mocking React.

// ---------------------------------------------------------------------
// 30. UI tests can remain focused
// ---------------------------------------------------------------------

interface DiscountProps {
  readonly subtotal: number;
  readonly percentage: number;
}

export const DiscountSummary: FC<DiscountProps> = ({ subtotal, percentage }): ReactElement => {
  const discount = calculateDiscount(subtotal, percentage);

  return <p>Discount: {formatPrice(discount)}</p>;
};

// The component test can focus on whether the UI displays the result.
// The discount calculation can be tested independently.

// ---------------------------------------------------------------------
// 31. SRP and change localization
// ---------------------------------------------------------------------

// Suppose the discount formula changes.
//
// If the formula lives inside a large component:
//
// Component
//     -> UI + discount rules + persistence + analytics
//
// the component must change.
//
// If the formula is isolated:
//
// calculateDiscount()
//     -> discount rule changes
//
// DiscountSummary
//     -> remains focused on rendering.
//
// The architectural goal is to localize changes that have the same reason.

// ---------------------------------------------------------------------
// 32. Responsibility does not mean isolation from collaboration
// ---------------------------------------------------------------------

interface ProductCardProps {
  readonly product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>{formatPrice(product.price)}</p>
    </article>
  );
};

// A focused component can depend on other focused abstractions.
// SRP does not require every component to operate independently.

// ---------------------------------------------------------------------
// 33. Composition is preferable to duplication
// ---------------------------------------------------------------------

export const ProductListItem: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <li>
      <ProductCard product={product} />
    </li>
  );
};

// `ProductListItem` composes `ProductCard` rather than duplicating
// its product presentation logic.

// ---------------------------------------------------------------------
// 34. Responsibility and abstraction boundaries
// ---------------------------------------------------------------------

interface Notification {
  readonly id: string;
  readonly message: string;
}

function formatNotification(notification: Notification): string {
  return notification.message.trim();
}

interface NotificationProps {
  readonly notification: Notification;
}

export const NotificationItem: FC<NotificationProps> = ({ notification }): ReactElement => {
  return <li>{formatNotification(notification)}</li>;
};

// Formatting is separated from the component because the formatting rule
// can be reused or changed independently from the markup.

// ---------------------------------------------------------------------
// 35. Avoid extracting trivial implementation details
// ---------------------------------------------------------------------

// This does not necessarily improve responsibility:
//
// function renderName(name: string): string {
//     return name;
// }
//
// export const Name: FC<{readonly name: string}> = ({
//     name,
// }): ReactElement => {
//     return <span>{renderName(name)}</span>;
// };
//
// The extraction adds an abstraction without creating a meaningful
// responsibility boundary.

// ---------------------------------------------------------------------
// 36. A meaningful abstraction has a reason to exist
// ---------------------------------------------------------------------

function normalizeProductName(name: string): string {
  return name.trim();
}

function validateProductName(name: string): boolean {
  return name.trim().length > 0;
}

// These functions represent meaningful domain rules around product names.
// They can evolve independently from the component markup.

// ---------------------------------------------------------------------
// 37. SRP and dependency boundaries
// ---------------------------------------------------------------------

interface UserRepository {
  readonly findById: (userId: string) => Promise<User>;
}

async function loadUser(repository: UserRepository, userId: string): Promise<User> {
  return repository.findById(userId);
}

// The component does not need to know whether the repository uses HTTP,
// a database, a cache, or another implementation.

// ---------------------------------------------------------------------
// 38. The UI coordinates the dependency
// ---------------------------------------------------------------------

interface UserDetailsProps {
  readonly user: User;
}

export const UserDetails: FC<UserDetailsProps> = ({ user }): ReactElement => {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

// Rendering remains independent of the repository implementation.

// ---------------------------------------------------------------------
// 39. Responsibility and Server Components
// ---------------------------------------------------------------------

export const UserPage = async (): Promise<ReactElement> => {
  const user = await fetchUser("user-001");

  return <UserDetails user={user} />;
};

// A Server Component can own server-side composition while delegating
// presentation to a focused component.

// ---------------------------------------------------------------------
// 40. Responsibility and Client Components
// ---------------------------------------------------------------------

interface CounterProps {
  readonly initialValue: number;
}

export const Counter: FC<CounterProps> = ({ initialValue }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <button
      type="button"
      onClick={() => {
        setCount((value) => value + 1);
      }}
    >
      Count: {count}
    </button>
  );
};

// This component has a focused interactive responsibility:
// rendering and managing the state of a counter.

// ---------------------------------------------------------------------
// 41. Do not force server concerns into client components
// ---------------------------------------------------------------------

// A Client Component should not directly own:
//
// - database connections
// - private server credentials
// - server-only filesystem access
//
// Instead, the client can invoke an appropriate server-side operation
// through the application's server boundary.

// ---------------------------------------------------------------------
// 42. A focused feature can coordinate multiple responsibilities
// ---------------------------------------------------------------------

interface CheckoutProps {
  readonly items: readonly CartItem[];
}

function validateCart(items: readonly CartItem[]): boolean {
  return items.length > 0;
}

async function submitOrder(items: readonly CartItem[]): Promise<void> {
  console.log(`Submitting ${items.length} items.`);
}

export const Checkout: FC<CheckoutProps> = ({ items }): ReactElement => {
  const total = calculateCartTotal(items);

  const handleSubmit = async (): Promise<void> => {
    if (!validateCart(items)) {
      return;
    }

    await submitOrder(items);
  };

  return (
    <section>
      <p>Total: {formatPrice(total)}</p>

      <button
        type="button"
        onClick={() => {
          void handleSubmit();
        }}
      >
        Checkout
      </button>
    </section>
  );
};

// The feature component coordinates several focused operations.
// SRP does not prohibit orchestration; it prevents unrelated implementation
// responsibilities from being unnecessarily embedded in the same abstraction.

// ---------------------------------------------------------------------
// 43. Refactoring signals
// ---------------------------------------------------------------------

// Common signals that a component may contain too many responsibilities:
//
// - unrelated sections of code change for unrelated reasons
// - the component contains several independent data sources
// - domain rules are embedded inside JSX
// - persistence details appear in event handlers
// - the same validation logic appears in multiple components
// - testing the component requires many unrelated mocks
// - a small UI change requires understanding unrelated business logic
//
// These are signals to examine the boundaries, not automatic proof that
// extraction is required.

// ---------------------------------------------------------------------
// 44. SRP is about reasons to change
// ---------------------------------------------------------------------

// Consider:
//
// `ProductCard`
//
// Reason to change:
//     Product presentation changes.
//
// `calculateCartTotal`
//
// Reason to change:
//     Cart pricing rules change.
//
// `saveOrder`
//
// Reason to change:
//     Order persistence changes.
//
// These are distinct responsibilities because the underlying reasons for
// modifying them are different.

// ---------------------------------------------------------------------
// 45. Complete focused architecture example
// ---------------------------------------------------------------------

interface CheckoutSummaryProps {
  readonly items: readonly CartItem[];
}

function validateCheckout(items: readonly CartItem[]): ValidationResult {
  if (items.length === 0) {
    return {
      valid: false,
      message: "The cart is empty.",
    };
  }

  return {
    valid: true,
    message: null,
  };
}

async function createOrder(items: readonly CartItem[]): Promise<string> {
  console.log(`Creating order for ${items.length} items.`);

  return "order-001";
}

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({ items }): ReactElement => {
  const total = calculateCartTotal(items);

  const handleCheckout = async (): Promise<void> => {
    const validation = validateCheckout(items);

    if (!validation.valid) {
      console.log(validation.message);
      return;
    }

    const orderId = await createOrder(items);

    console.log(`Created ${orderId}.`);
  };

  return (
    <section>
      <h2>Checkout</h2>

      <p>Total: {formatPrice(total)}</p>

      <button
        type="button"
        onClick={() => {
          void handleCheckout();
        }}
      >
        Place order
      </button>
    </section>
  );
};

// The component coordinates the feature while focused responsibilities remain
// explicit:
//
// UI
//     -> CheckoutSummary
//
// Domain calculation
//     -> calculateCartTotal
//
// Validation
//     -> validateCheckout
//
// Persistence
//     -> createOrder

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The Single Responsibility Principle focuses an abstraction around one meaningful responsibility.
// - A responsibility is a reason for an abstraction to change, not simply a single line of code.
// - Components can coordinate several focused operations without implementing every operation themselves.
// - Presentation logic should remain distinct from unrelated data access, validation, persistence, and domain rules when those concerns change independently.
// - Custom hooks can encapsulate meaningful reusable stateful behavior.
// - Domain functions can isolate business rules from React and UI concerns.
// - Data-access functions can isolate server or repository concerns from presentation.
// - Validation functions can isolate rules that would otherwise be duplicated across components.
// - SRP does not mean creating one file, component, or function for every small operation.
// - Artificial fragmentation creates abstractions without meaningful responsibility boundaries.
// - Composition lets focused components collaborate without combining all implementation details into one component.
// - A "god component" is difficult to maintain because many unrelated responsibilities converge on the same abstraction.
// - Responsibility can exist at the application, feature, component, hook, domain, or data-access level.
// - Focused responsibilities improve change localization and can make testing more targeted.
// - A component can depend on other abstractions while still maintaining a focused responsibility.
// - SRP is a design guideline for meaningful boundaries, not a mechanical rule about component size.

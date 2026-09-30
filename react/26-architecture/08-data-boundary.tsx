/**
 * Data Boundary
 * ==============
 *
 * A data boundary defines how data enters, moves through, and leaves a component or feature.
 * A well-designed boundary separates external data representations from UI concerns, exposes only
 * the data consumers need, and keeps fetching, transformation, validation, and presentation from
 * becoming unnecessarily coupled.
 */

import { useState } from "react";
import type { FC, ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. External data versus UI data
// ---------------------------------------------------------------------

// External systems often use representations designed for APIs, databases, or transport.
// UI components can use a representation designed specifically for rendering.
interface ApiUser {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email_address: string;
}

interface UserViewModel {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
}

// Transformation creates a boundary between the external representation and the UI model.
const toUserViewModel = (user: ApiUser): UserViewModel => {
  return {
    id: user.id,
    displayName: `${user.first_name} ${user.last_name}`,
    email: user.email_address,
  };
};

interface UserDetailsProps {
  readonly user: UserViewModel;
}

export const UserDetails: FC<UserDetailsProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
    </article>
  );
};

// UserDetails does not need to know the API field names.
export const UserDetailsExample: FC = (): ReactElement => {
  const apiUser: ApiUser = {
    id: "user-1",
    first_name: "John",
    last_name: "Doe",
    email_address: "john@example.com",
  };

  const user = toUserViewModel(apiUser);

  return <UserDetails user={user} />;
};

// ---------------------------------------------------------------------
// 2. Data ownership
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductCardProps {
  readonly product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
    </article>
  );
};

// The component consumes product data but does not need to own its source.
// The parent or data layer determines where the product came from.
export const ProductCardExample: FC = (): ReactElement => {
  const product: Product = {
    id: "product-1",
    name: "Notebook",
    priceInCents: 1200,
  };

  return <ProductCard product={product} />;
};

// ---------------------------------------------------------------------
// 3. Data should cross boundaries explicitly
// ---------------------------------------------------------------------

interface ProfileHeaderProps {
  readonly name: string;
  readonly email: string;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ name, email }): ReactElement => {
  return (
    <header>
      <h1>{name}</h1>
      <p>{email}</p>
    </header>
  );
};

interface Profile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

export const ProfileExample: FC = (): ReactElement => {
  const profile: Profile = {
    id: "profile-1",
    name: "John Doe",
    email: "john@example.com",
    role: "editor",
  };

  return <ProfileHeader name={profile.name} email={profile.email} />;
};

// Only the values required by the child cross its boundary.
// The child does not need the complete Profile object.

// ---------------------------------------------------------------------
// 4. Narrow data contracts
// ---------------------------------------------------------------------

interface ProductPriceProps {
  readonly priceInCents: number;
}

export const ProductPrice: FC<ProductPriceProps> = ({ priceInCents }): ReactElement => {
  return <span>${(priceInCents / 100).toFixed(2)}</span>;
};

// Passing only the required value keeps the boundary narrow.
export const ProductPriceExample: FC = (): ReactElement => {
  const product: Product = {
    id: "product-1",
    name: "Notebook",
    priceInCents: 1200,
  };

  return <ProductPrice priceInCents={product.priceInCents} />;
};

// ---------------------------------------------------------------------
// 5. Avoid passing unnecessary data
// ---------------------------------------------------------------------

interface UserBadgeProps {
  readonly name: string;
}

export const UserBadge: FC<UserBadgeProps> = ({ name }): ReactElement => {
  return <span>{name}</span>;
};

export const UserBadgeExample: FC = (): ReactElement => {
  const user: Profile = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "editor",
  };

  return <UserBadge name={user.name} />;
};

// A large object should not cross a boundary merely because it is convenient.
// Passing the required field makes the dependency explicit.

// ---------------------------------------------------------------------
// 6. Data fetching belongs to an appropriate boundary
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly getProduct: (id: string) => Promise<Product>;
}

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

// The repository represents the data-access boundary.
// ProductCard remains concerned only with presentation.
export const ProductRepositoryExample: FC = (): ReactElement => {
  const repository = createProductRepository();

  void repository;

  return <ProductCardExample />;
};

// ---------------------------------------------------------------------
// 7. Data transformation belongs between boundaries
// ---------------------------------------------------------------------

interface ApiProduct {
  readonly product_id: string;
  readonly product_name: string;
  readonly price: number;
}

const toProduct = (product: ApiProduct): Product => {
  return {
    id: product.product_id,
    name: product.product_name,
    priceInCents: product.price,
  };
};

export const ProductTransformationExample: FC = (): ReactElement => {
  const apiProduct: ApiProduct = {
    product_id: "product-1",
    product_name: "Notebook",
    price: 1200,
  };

  const product = toProduct(apiProduct);

  return <ProductCard product={product} />;
};

// The API contract does not become the presentation contract.
// The transformation function establishes the boundary between them.

// ---------------------------------------------------------------------
// 8. Validate data before crossing the UI boundary
// ---------------------------------------------------------------------

interface ExternalAccount {
  readonly id: unknown;
  readonly name: unknown;
}

interface Account {
  readonly id: string;
  readonly name: string;
}

const parseAccount = (value: ExternalAccount): Account => {
  if (typeof value.id !== "string" || typeof value.name !== "string") {
    throw new Error("Invalid account data");
  }

  return {
    id: value.id,
    name: value.name,
  };
};

interface AccountCardProps {
  readonly account: Account;
}

export const AccountCard: FC<AccountCardProps> = ({ account }): ReactElement => {
  return (
    <article>
      <h2>{account.name}</h2>
      <p>{account.id}</p>
    </article>
  );
};

// Runtime validation protects the boundary when data originates outside TypeScript's type system.
export const AccountValidationExample: FC = (): ReactElement => {
  const externalAccount: ExternalAccount = {
    id: "account-1",
    name: "John Doe",
  };

  const account = parseAccount(externalAccount);

  return <AccountCard account={account} />;
};

// ---------------------------------------------------------------------
// 9. TypeScript types do not validate runtime data
// ---------------------------------------------------------------------

interface ServerResponse {
  readonly name: string;
}

// A TypeScript annotation describes what the program expects.
// It does not verify that arbitrary runtime data actually has that shape.
const consumeServerResponse = (response: ServerResponse): string => {
  return response.name;
};

export const RuntimeBoundaryExample: FC = (): ReactElement => {
  const response: ServerResponse = {
    name: "John Doe",
  };

  return <p>{consumeServerResponse(response)}</p>;
};

// Runtime validation is required when the source cannot be trusted to satisfy the type.

// ---------------------------------------------------------------------
// 10. Keep loading state at the appropriate data boundary
// ---------------------------------------------------------------------

interface DataState<T> {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly data: T | null;
  readonly error: string | null;
}

interface ProductDataViewProps {
  readonly state: DataState<Product>;
}

export const ProductDataView: FC<ProductDataViewProps> = ({ state }): ReactElement => {
  if (state.status === "loading") {
    return <p>Loading...</p>;
  }

  if (state.status === "error") {
    return <p>{state.error ?? "Unable to load product."}</p>;
  }

  if (state.status === "success" && state.data) {
    return <ProductCard product={state.data} />;
  }

  return <p>No product loaded.</p>;
};

// Loading state belongs to the boundary responsible for coordinating the data request.
// Presentation components can receive a normalized state instead of managing transport details.

// ---------------------------------------------------------------------
// 11. Separate transport state from view state
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly dataState: DataState<Product>;
}

export const ProductPage: FC<ProductPageProps> = ({ dataState }): ReactElement => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section>
      <ProductDataView state={dataState} />
      {dataState.status === "success" && (
        <button type="button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "Show"} details
        </button>
      )}
    </section>
  );
};

// dataState describes external/application data.
// showDetails describes local UI state.
// Keeping the two concerns distinct prevents unrelated state from sharing one boundary.

// ---------------------------------------------------------------------
// 12. Data and events form a boundary pair
// ---------------------------------------------------------------------

interface ProductSelectorProps {
  readonly products: readonly Product[];
  readonly selectedProductId: string | null;
  readonly onSelect: (productId: string) => void;
}

export const ProductSelector: FC<ProductSelectorProps> = ({ products, selectedProductId, onSelect }): ReactElement => {
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

// Data flows into the component.
// Semantic events flow back out.
// The component does not need access to the parent's complete state.

// ---------------------------------------------------------------------
// 13. Do not expose transport details
// ---------------------------------------------------------------------

interface ProductRequestProps {
  readonly productId: string;
  readonly onLoad: (product: Product) => void;
}

// This kind of boundary exposes a request-oriented abstraction.
// A presentation component generally should not need to know about URLs,
// HTTP methods, headers, or request objects.
export const ProductRequestBoundary: FC<ProductRequestProps> = ({ productId, onLoad }): ReactElement => {
  const product: Product = {
    id: productId,
    name: "Notebook",
    priceInCents: 1200,
  };

  return (
    <button type="button" onClick={() => onLoad(product)}>
      Load product
    </button>
  );
};

// A real application could place HTTP or RPC logic outside this presentation boundary.

// ---------------------------------------------------------------------
// 14. Repository boundaries
// ---------------------------------------------------------------------

interface UserRepository {
  readonly findById: (id: string) => Promise<Profile | null>;
}

const createUserRepository = (): UserRepository => {
  return {
    findById: async (id: string): Promise<Profile | null> => {
      return {
        id,
        name: "John Doe",
        email: "john@example.com",
        role: "editor",
      };
    },
  };
};

interface UserPageProps {
  readonly repository: UserRepository;
  readonly userId: string;
}

export const UserPage: FC<UserPageProps> = ({ repository, userId }): ReactElement => {
  void repository;
  return <p>User: {userId}</p>;
};

export const UserPageExample: FC = (): ReactElement => {
  const repository = createUserRepository();

  return <UserPage repository={repository} userId="user-1" />;
};

// The repository boundary isolates data-access implementation.
// The UI depends on the repository contract rather than a specific transport mechanism.

// ---------------------------------------------------------------------
// 15. Query boundaries
// ---------------------------------------------------------------------

interface ProductQuery {
  readonly category: string;
  readonly search: string;
}

interface ProductResultsProps {
  readonly products: readonly Product[];
}

export const ProductResults: FC<ProductResultsProps> = ({ products }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

// A query describes what data is requested.
// It does not need to expose how that query is implemented.
export const ProductQueryExample: FC = (): ReactElement => {
  const query: ProductQuery = {
    category: "office",
    search: "note",
  };

  void query;

  return <ProductResults products={[]} />;
};

// ---------------------------------------------------------------------
// 16. Pagination data boundaries
// ---------------------------------------------------------------------

interface PageInfo {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

interface ProductPageData {
  readonly items: readonly Product[];
  readonly pageInfo: PageInfo;
}

interface ProductTableProps {
  readonly data: ProductPageData;
}

export const ProductTable: FC<ProductTableProps> = ({ data }): ReactElement => {
  return (
    <section>
      <ul>
        {data.items.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      <p>
        Page {data.pageInfo.page} of {Math.max(1, Math.ceil(data.pageInfo.total / data.pageInfo.pageSize))}
      </p>
    </section>
  );
};

// Pagination metadata is part of the data contract because the UI needs it.
// Transport-specific pagination fields should be transformed before this boundary.

// ---------------------------------------------------------------------
// 17. Normalize data at the boundary
// ---------------------------------------------------------------------

interface ApiCategory {
  readonly category_id: string;
  readonly category_name: string;
}

interface Category {
  readonly id: string;
  readonly name: string;
}

const normalizeCategory = (category: ApiCategory): Category => {
  return {
    id: category.category_id,
    name: category.category_name,
  };
};

interface CategoryListProps {
  readonly categories: readonly Category[];
}

export const CategoryList: FC<CategoryListProps> = ({ categories }): ReactElement => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  );
};

// Normalization prevents external naming conventions from spreading through the component tree.
export const CategoryExample: FC = (): ReactElement => {
  const apiCategories: readonly ApiCategory[] = [{ category_id: "office", category_name: "Office" }];

  const categories = apiCategories.map(normalizeCategory);

  return <CategoryList categories={categories} />;
};

// ---------------------------------------------------------------------
// 18. Avoid transport-shaped props
// ---------------------------------------------------------------------

interface WeakUserProps {
  readonly response: {
    readonly data: {
      readonly first_name: string;
      readonly last_name: string;
    };
    readonly status_code: number;
  };
}

// This boundary couples a component to a specific transport response shape.
//
// Prefer a UI-oriented contract:
interface UserNameProps {
  readonly name: string;
}

export const UserName: FC<UserNameProps> = ({ name }): ReactElement => {
  return <span>{name}</span>;
};

export const UserNameExample: FC = (): ReactElement => {
  return <UserName name="John Doe" />;
};

// ---------------------------------------------------------------------
// 19. Data boundaries and errors
// ---------------------------------------------------------------------

type LoadResult<T> =
  { readonly status: "success"; readonly data: T } | { readonly status: "error"; readonly message: string };

interface ProductResultProps {
  readonly result: LoadResult<Product>;
}

export const ProductResult: FC<ProductResultProps> = ({ result }): ReactElement => {
  if (result.status === "error") {
    return <p>{result.message}</p>;
  }

  return <ProductCard product={result.data} />;
};

// Errors cross the boundary as explicit data.
// The component does not need to understand the underlying HTTP or database error type.

// ---------------------------------------------------------------------
// 20. Data boundaries and optional data
// ---------------------------------------------------------------------

interface AvatarProps {
  readonly imageUrl?: string;
  readonly name: string;
}

export const Avatar: FC<AvatarProps> = ({ imageUrl, name }): ReactElement => {
  return imageUrl ? <img src={imageUrl} alt={name} /> : <span>{name}</span>;
};

// Optional data belongs in the contract when the absence of that data is a valid state.
export const AvatarExample: FC = (): ReactElement => {
  return <Avatar name="John Doe" />;
};

// ---------------------------------------------------------------------
// 21. Do not hide required data dependencies
// ---------------------------------------------------------------------

interface Order {
  readonly id: string;
  readonly totalInCents: number;
}

interface OrderSummaryProps {
  readonly order: Order;
}

export const OrderSummary: FC<OrderSummaryProps> = ({ order }): ReactElement => {
  return (
    <section>
      <p>Order: {order.id}</p>
      <p>Total: ${(order.totalInCents / 100).toFixed(2)}</p>
    </section>
  );
};

// Required data should normally appear in props or another explicit dependency.
// Reading arbitrary application state from hidden locations makes the data boundary harder to understand.

// ---------------------------------------------------------------------
// 22. Avoid broad data contexts
// ---------------------------------------------------------------------

interface ApplicationData {
  readonly user: Profile | null;
  readonly products: readonly Product[];
  readonly categories: readonly Category[];
  readonly orders: readonly Order[];
}

// A broad data context can make every consumer depend on the entire application data model.
//
// Narrow data boundaries allow components to depend on the smallest relevant contract.

// ---------------------------------------------------------------------
// 23. Data ownership and caching
// ---------------------------------------------------------------------

interface CachedProduct {
  readonly product: Product;
  readonly fetchedAt: number;
}

interface ProductCache {
  readonly get: (id: string) => CachedProduct | undefined;
}

// Caching is a data-lifecycle concern.
// It should not automatically become part of the rendering component's public contract.
export const ProductCacheExample: FC = (): ReactElement => {
  const cache: ProductCache = {
    get: () => undefined,
  };

  void cache;

  return <ProductCardExample />;
};

// ---------------------------------------------------------------------
// 24. Data boundaries and forms
// ---------------------------------------------------------------------

interface FormValues {
  readonly name: string;
  readonly email: string;
}

interface ProfileFormProps {
  readonly values: FormValues;
  readonly onChange: (values: FormValues) => void;
  readonly onSubmit: (values: FormValues) => void;
}

export const ProfileForm: FC<ProfileFormProps> = ({ values, onChange, onSubmit }): ReactElement => {
  const updateName = (name: string): void => {
    onChange({
      ...values,
      name,
    });
  };

  const updateEmail = (email: string): void => {
    onChange({
      ...values,
      email,
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <input value={values.name} onChange={(event) => updateName(event.target.value)} />
      <input value={values.email} onChange={(event) => updateEmail(event.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
};

// FormValues is the UI data contract.
// The component does not need to know how those values are eventually persisted.

// ---------------------------------------------------------------------
// 25. Data boundaries and serialization
// ---------------------------------------------------------------------

interface SerializableProfile {
  readonly id: string;
  readonly name: string;
}

const serializeProfile = (profile: SerializableProfile): string => {
  return JSON.stringify(profile);
};

const deserializeProfile = (value: string): SerializableProfile => {
  const parsed: unknown = JSON.parse(value);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("id" in parsed) ||
    !("name" in parsed) ||
    typeof parsed.id !== "string" ||
    typeof parsed.name !== "string"
  ) {
    throw new Error("Invalid serialized profile");
  }

  return {
    id: parsed.id,
    name: parsed.name,
  };
};

// Serialization is itself a boundary.
// Data should be validated when it crosses from an untrusted serialized representation
// back into the application's typed model.
export const SerializationExample: FC = (): ReactElement => {
  const profile: SerializableProfile = {
    id: "profile-1",
    name: "John Doe",
  };

  const serialized = serializeProfile(profile);
  const restored = deserializeProfile(serialized);

  return <p>{restored.name}</p>;
};

// ---------------------------------------------------------------------
// 26. Data boundaries and server/client separation
// ---------------------------------------------------------------------

interface ServerGeneratedData {
  readonly id: string;
  readonly title: string;
}

interface ClientViewProps {
  readonly data: ServerGeneratedData;
}

export const ClientView: FC<ClientViewProps> = ({ data }): ReactElement => {
  const [selected, setSelected] = useState(false);

  return (
    <article>
      <h2>{data.title}</h2>
      <button type="button" onClick={() => setSelected(!selected)}>
        {selected ? "Selected" : "Select"}
      </button>
    </article>
  );
};

// Data can cross a rendering boundary as explicit props.
// The client component does not need to know how the server obtained the data.

// ---------------------------------------------------------------------
// 27. Data boundaries and children
// ---------------------------------------------------------------------

interface DataLayoutProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const DataLayout: FC<DataLayoutProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  );
};

// Composition allows data-producing logic and layout concerns to remain separate.
// DataLayout does not need to understand the shape or source of its child content.
export const DataLayoutExample: FC = (): ReactElement => {
  return (
    <DataLayout title="Products">
      <ProductCardExample />
    </DataLayout>
  );
};

// ---------------------------------------------------------------------
// 28. Data boundaries and mutation
// ---------------------------------------------------------------------

interface EditableNameProps {
  readonly name: string;
  readonly onSave: (name: string) => void;
}

export const EditableName: FC<EditableNameProps> = ({ name, onSave }): ReactElement => {
  const [draft, setDraft] = useState(name);

  return (
    <section>
      <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="button" onClick={() => onSave(draft)}>
        Save
      </button>
    </section>
  );
};

// The draft is local editing state.
// Persisting the final value belongs to the boundary that owns the saved data.

// ---------------------------------------------------------------------
// 29. Avoid exposing persistence mechanisms
// ---------------------------------------------------------------------

interface Settings {
  readonly theme: "light" | "dark";
}

interface SettingsEditorProps {
  readonly settings: Settings;
  readonly onSave: (settings: Settings) => void;
}

export const SettingsEditor: FC<SettingsEditorProps> = ({ settings, onSave }): ReactElement => {
  const nextTheme = settings.theme === "light" ? "dark" : "light";

  return (
    <button type="button" onClick={() => onSave({ ...settings, theme: nextTheme })}>
      Theme: {settings.theme}
    </button>
  );
};

// The component does not know whether onSave writes to a database,
// sends an HTTP request, updates a cache, or changes another state boundary.

// ---------------------------------------------------------------------
// 30. Data boundary smells
// ---------------------------------------------------------------------

// Common warning signs include:
// - API response objects passed directly through many UI components
// - transport-specific field names appearing in presentation components
// - unvalidated external data entering trusted application models
// - components directly creating HTTP requests or database queries
// - large objects passed when only a few fields are needed
// - hidden dependencies on global data stores
// - persistence details exposed through component props
// - duplicated transformations performed independently by consumers
//
// These signals suggest that data responsibilities may be crossing boundaries incorrectly.

// ---------------------------------------------------------------------
// 31. Complete data-boundary example
// ---------------------------------------------------------------------

interface ApiOrder {
  readonly order_id: string;
  readonly total: number;
  readonly customer_name: string;
}

interface OrderViewModel {
  readonly id: string;
  readonly totalInCents: number;
  readonly customerName: string;
}

const toOrderViewModel = (order: ApiOrder): OrderViewModel => {
  return {
    id: order.order_id,
    totalInCents: order.total,
    customerName: order.customer_name,
  };
};

interface OrderCardProps {
  readonly order: OrderViewModel;
  readonly onOpen: (orderId: string) => void;
}

export const OrderCard: FC<OrderCardProps> = ({ order, onOpen }): ReactElement => {
  return (
    <article>
      <h2>Order {order.id}</h2>
      <p>{order.customerName}</p>
      <p>${(order.totalInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={() => onOpen(order.id)}>
        Open
      </button>
    </article>
  );
};

export const OrderPage: FC = (): ReactElement => {
  const apiOrder: ApiOrder = {
    order_id: "order-1",
    total: 4200,
    customer_name: "John Doe",
  };

  const order = toOrderViewModel(apiOrder);

  const handleOpen = (orderId: string): void => {
    console.log(`Opening order: ${orderId}`);
  };

  return <OrderCard order={order} onOpen={handleOpen} />;
};

// The complete flow is:
//
// External representation
//     ↓
// Transformation
//     ↓
// Application/UI data model
//     ↓
// Component boundary
//     ↓
// Semantic user event
//     ↓
// Parent/application behavior
//
// Each boundary has an explicit contract and a distinct responsibility.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A data boundary defines how data enters, leaves, and moves between components or features.
// - External data representations should not automatically become UI contracts.
// - Transform external data into models that match the needs of the receiving boundary.
// - Runtime validation is required when data originates outside TypeScript's type system.
// - Components should receive only the data they actually need.
// - Data-fetching and persistence concerns should remain outside presentation components when possible.
// - Repository and query contracts can isolate data-access implementation details.
// - Loading and error states are part of the data boundary when the consumer needs them.
// - External data and local UI state often have different ownership and lifecycles.
// - Data and semantic events form the primary input/output contract of many components.
// - Transport-shaped props can leak infrastructure details into the presentation layer.
// - Serialization is a boundary that requires validation when data becomes trusted application state.
// - Broad global data objects can create unnecessary coupling between otherwise independent consumers.
// - Data boundary smells include leaked transport details, hidden dependencies, duplicated transformations, and unvalidated input.
// - Strong data boundaries make external systems replaceable and component contracts easier to understand.

/**
 * Suspense for Data
 * =================
 *
 * Suspense can coordinate UI that reads data through a Suspense-enabled
 * mechanism. In React 19, the `use()` API can read a Promise during rendering.
 * If the Promise is pending, the component suspends and the nearest Suspense
 * boundary displays its fallback until the Promise resolves.
 *
 * A Promise read by `use()` must be stable and reusable across render retries.
 * Creating a new Promise during component rendering can cause repeated
 * suspension because each render would produce a different asynchronous
 * resource. Real applications commonly obtain these resources from a framework
 * or data library that integrates with React's Suspense model.
 */

import { type FC, type ReactElement, Suspense, use, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

export interface DataResourceProps {
  readonly userPromise: Promise<User>;
}

export interface ProductResourceProps {
  readonly productPromise: Promise<Product>;
}

export interface DataFallbackProps {
  readonly label: string;
}

export interface DataCache {
  readonly users: Map<number, Promise<User>>;
  readonly products: Map<number, Promise<Product>>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a Promise that simulates an asynchronous data source.
 *
 * The delay is only used to make the Suspense behavior observable in the
 * example. A production application would normally obtain the Promise from
 * an API client, framework, or Suspense-enabled data library.
 */
const createUserResource = (id: number, name: string, email: string, delay: number): Promise<User> => {
  return new Promise<User>((resolve): void => {
    window.setTimeout((): void => {
      resolve({
        id,
        name,
        email,
      });
    }, delay);
  });
};

const createProductResource = (id: number, name: string, price: number, delay: number): Promise<Product> => {
  return new Promise<Product>((resolve): void => {
    window.setTimeout((): void => {
      resolve({
        id,
        name,
        price,
      });
    }, delay);
  });
};

/**
 * Creates stable module-level resources for the demonstrations.
 *
 * These Promises are intentionally created outside component rendering so
 * repeated render attempts continue reading the same Promise.
 */
const userPromise: Promise<User> = createUserResource(1, "John Doe", "john.doe@example.com", 1200);

const productPromise: Promise<Product> = createProductResource(1, "Example Product", 49.99, 1800);

const cachedUsers: Map<number, Promise<User>> = new Map<number, Promise<User>>();
const cachedProducts: Map<number, Promise<Product>> = new Map<number, Promise<Product>>();

/**
 * Provides a reusable user resource.
 *
 * The cache preserves Promise identity for the same user ID. This is important
 * because `use()` can suspend and React may retry rendering the component.
 */
const getUserResource = (id: number): Promise<User> => {
  const existingPromise: Promise<User> | undefined = cachedUsers.get(id);

  if (existingPromise !== undefined) {
    return existingPromise;
  }

  const resource: Promise<User> = createUserResource(
    id,
    id === 1 ? "John Doe" : "Jane Doe",
    id === 1 ? "john.doe@example.com" : "jane.doe@example.com",
    1000,
  );

  cachedUsers.set(id, resource);
  return resource;
};

/**
 * Provides a reusable product resource.
 *
 * Like the user cache, this cache ensures that repeated reads for the same
 * product reuse the same Promise.
 */
const getProductResource = (id: number): Promise<Product> => {
  const existingPromise: Promise<Product> | undefined = cachedProducts.get(id);

  if (existingPromise !== undefined) {
    return existingPromise;
  }

  const resource: Promise<Product> = createProductResource(
    id,
    id === 1 ? "Example Product" : "Example Keyboard",
    id === 1 ? 49.99 : 79.99,
    1400,
  );

  cachedProducts.set(id, resource);
  return resource;
};

/**
 * Displays loading UI for a Suspense boundary.
 */
export const DataFallback: FC<DataFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Reads user data with `use()`.
 *
 * If the Promise is pending, rendering suspends and the nearest Suspense
 * boundary renders its fallback. Once the Promise resolves, React retries the
 * suspended subtree and `use()` returns the resolved User value.
 */
export const UserDataExample: FC<DataResourceProps> = ({ userPromise }): ReactElement => {
  const user: User = use(userPromise);

  return (
    <article>
      <h3>{user.name}</h3>
      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
    </article>
  );
};

/**
 * Demonstrates the basic Suspense-for-data pattern.
 *
 * The component reads a stable Promise during rendering rather than managing
 * a separate loading state for the same asynchronous resource.
 */
export const BasicDataSuspenseExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<DataFallback label="Loading user..." />}>
        <UserDataExample userPromise={userPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Reads product data with `use()`.
 */
export const ProductDataExample: FC<ProductResourceProps> = ({ productPromise }): ReactElement => {
  const product: Product = use(productPromise);

  return (
    <article>
      <h3>{product.name}</h3>
      <p>Product ID: {product.id}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
    </article>
  );
};

/**
 * Demonstrates multiple data resources inside one Suspense boundary.
 *
 * Both components belong to the same boundary, so the boundary provides the
 * fallback while suspended work in this subtree is not yet ready.
 */
export const MultipleDataResourcesExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<DataFallback label="Loading user and product data..." />}>
        <UserDataExample userPromise={userPromise} />
        <ProductDataExample productPromise={productPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates independent data boundaries.
 *
 * Each data region has its own Suspense boundary, allowing the regions to
 * reveal independently when their respective resources become available.
 */
export const IndependentDataBoundariesExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<DataFallback label="Loading user..." />}>
        <UserDataExample userPromise={userPromise} />
      </Suspense>

      <Suspense fallback={<DataFallback label="Loading product..." />}>
        <ProductDataExample productPromise={productPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a cached data resource.
 *
 * Calling the resource function repeatedly for the same ID returns the same
 * Promise instead of creating a new asynchronous operation for every render.
 */
export const CachedDataResourceExample: FC = (): ReactElement => {
  const resource: Promise<User> = getUserResource(1);

  return (
    <section>
      <Suspense fallback={<DataFallback label="Loading cached user resource..." />}>
        <UserDataExample userPromise={resource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates two components reading the same cached resource.
 *
 * Both components receive the same Promise, so the application can share one
 * resource instead of starting duplicate asynchronous work for the same key.
 */
export const SharedDataResourceExample: FC = (): ReactElement => {
  const sharedUserResource: Promise<User> = getUserResource(1);

  return (
    <section>
      <Suspense fallback={<DataFallback label="Loading shared user..." />}>
        <UserDataExample userPromise={sharedUserResource} />
        <UserDataExample userPromise={sharedUserResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates parameterized resource lookup.
 *
 * The resource key determines which cached Promise is returned. The component
 * itself remains responsible only for reading and rendering the resource.
 */
export const ParameterizedDataExample: FC = (): ReactElement => {
  const userId: number = 2;
  const resource: Promise<User> = getUserResource(userId);

  return (
    <section>
      <Suspense fallback={<DataFallback label={`Loading user ${userId}...`} />}>
        <UserDataExample userPromise={resource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the important distinction between Suspense-enabled data and
 * ordinary Effect-based fetching.
 *
 * Fetching inside an Effect does not cause React Suspense to display a
 * fallback. Suspense requires a supported mechanism that communicates
 * suspension to React, such as reading a Promise with `use()`.
 */
export const SuspenseVersusEffectFetchingExample: FC = (): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <section>
      <h3>Suspense versus Effect-based fetching</h3>

      <p>An ordinary fetch started inside an Effect does not activate Suspense automatically.</p>

      <button
        type="button"
        onClick={(): void => {
          setIsLoading(true);
        }}
      >
        Start ordinary loading
      </button>

      {isLoading ? (
        <p>Loading state managed explicitly by component state.</p>
      ) : (
        <p>No ordinary request is currently running.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates why creating a Promise during rendering is problematic.
 *
 * A new Promise would be produced every time the component renders. If that
 * Promise is read with `use()`, React could repeatedly encounter new pending
 * resources instead of reusing the original resource.
 */
export const StableResourceRequirementExample: FC = (): ReactElement => {
  const stableResource: Promise<User> = getUserResource(1);

  return (
    <section>
      <h3>Stable resource requirement</h3>

      <p>The Promise supplied here comes from a cache, so repeated renders reuse the same resource identity.</p>

      <Suspense fallback={<DataFallback label="Loading stable resource..." />}>
        <UserDataExample userPromise={stableResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the separation between resource acquisition and rendering.
 *
 * The component receives a Promise as a prop and focuses on reading and
 * displaying the resolved value. The resource provider is responsible for
 * creating or retrieving the asynchronous resource.
 */
export const ResourceSeparationExample: FC = (): ReactElement => {
  const resource: Promise<Product> = getProductResource(1);

  return (
    <section>
      <Suspense fallback={<DataFallback label="Loading separated product resource..." />}>
        <ProductDataExample productPromise={resource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that data suspension and an explicit UI loading state are
 * different patterns.
 *
 * Suspense coordinates suspended rendering at the boundary level, while local
 * state is useful for UI state that is not itself a Suspense-enabled resource.
 */
export const SuspenseAndLocalStateExample: FC = (): ReactElement => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          setIsExpanded((current: boolean): boolean => !current);
        }}
      >
        {isExpanded ? "Collapse details" : "Expand details"}
      </button>

      {isExpanded ? (
        <Suspense fallback={<DataFallback label="Loading details..." />}>
          <UserDataExample userPromise={getUserResource(1)} />
        </Suspense>
      ) : (
        <p>Details are collapsed.</p>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseForDataDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense for Data</h1>

      <section>
        <h2>1. Basic data Suspense</h2>
        <BasicDataSuspenseExample />
      </section>

      <section>
        <h2>2. Multiple data resources</h2>
        <MultipleDataResourcesExample />
      </section>

      <section>
        <h2>3. Independent data boundaries</h2>
        <IndependentDataBoundariesExample />
      </section>

      <section>
        <h2>4. Cached data resource</h2>
        <CachedDataResourceExample />
      </section>

      <section>
        <h2>5. Shared data resource</h2>
        <SharedDataResourceExample />
      </section>

      <section>
        <h2>6. Parameterized data resource</h2>
        <ParameterizedDataExample />
      </section>

      <section>
        <h2>7. Suspense versus Effect-based fetching</h2>
        <SuspenseVersusEffectFetchingExample />
      </section>

      <section>
        <h2>8. Stable resource requirement</h2>
        <StableResourceRequirementExample />
      </section>

      <section>
        <h2>9. Resource separation</h2>
        <ResourceSeparationExample />
      </section>

      <section>
        <h2>10. Suspense and local state</h2>
        <SuspenseAndLocalStateExample />
      </section>
    </main>
  );
};

export default SuspenseForDataDemo;

// ---------------------------------------------------------------------
// Summary
// `use()` can read a Promise during rendering and suspend the component while the Promise is pending.
// The nearest Suspense boundary displays its fallback while the data resource is suspended.
// Promises read with `use()` must be stable and reusable across render retries.
// Resource caching can preserve Promise identity and prevent duplicate asynchronous requests.
// Multiple components can share the same cached resource.
// Separate Suspense boundaries allow independent data regions to reveal independently.
// Suspense-enabled data loading is different from ordinary fetching performed inside an Effect.
// Resource acquisition and resource rendering can be separated so components focus on displaying resolved data.
// Local state remains useful for UI state that is not itself a Suspense-enabled asynchronous resource.
// ---------------------------------------------------------------------

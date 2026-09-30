/**
 * Render-as-You-Fetch
 * ===================
 *
 * Render-as-you-fetch is a data-loading strategy where asynchronous work is
 * started before the component that consumes the data renders. The Promise is
 * then passed into the component and read with `use()` inside a Suspense
 * boundary.
 *
 * Starting the resource early avoids delaying the request until a descendant
 * reaches the point where it needs the data. This can reduce unnecessary
 * request waterfalls, while the Suspense boundary controls what the user sees
 * while the resource is still pending.
 *
 * React requires Promises passed to `use()` in Client Components to be cached
 * so the same Promise instance is reused across render retries. A Promise
 * created directly during render is not a valid render-as-you-fetch resource.
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

export interface DashboardData {
  readonly title: string;
  readonly summary: string;
}

export interface ActivityData {
  readonly title: string;
  readonly summary: string;
}

export interface UserContentProps {
  readonly userPromise: Promise<User>;
}

export interface DashboardContentProps {
  readonly dashboardPromise: Promise<DashboardData>;
}

export interface ActivityContentProps {
  readonly activityPromise: Promise<ActivityData>;
}

export interface LoadingFallbackProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a delayed resource for the examples.
 *
 * The delay makes the loading behavior observable. In a real application,
 * this resource could come from a router loader, framework data layer,
 * Suspense-compatible cache, or another resource provider.
 */
const createResource = <T,>(value: T, delay: number): Promise<T> => {
  return new Promise<T>((resolve): void => {
    window.setTimeout((): void => {
      resolve(value);
    }, delay);
  });
};

/**
 * Starts the user request before the consuming component renders.
 *
 * This is the central render-as-you-fetch idea: the asynchronous operation is
 * initiated outside the component that eventually reads the resource.
 */
const userPromise: Promise<User> = createResource<User>(
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  1200,
);

/**
 * Starts independent dashboard resources early.
 *
 * These Promises are created together, so their asynchronous work can overlap
 * instead of being started one after another during rendering.
 */
const dashboardPromise: Promise<DashboardData> = createResource<DashboardData>(
  {
    title: "Dashboard",
    summary: "Dashboard data is ready.",
  },
  1500,
);

const activityPromise: Promise<ActivityData> = createResource<ActivityData>(
  {
    title: "Recent activity",
    summary: "Recent activity data is ready.",
  },
  1800,
);

/**
 * Provides a reusable Suspense fallback.
 */
export const LoadingFallback: FC<LoadingFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Reads the user resource during rendering.
 *
 * The component does not start the request. It only consumes the Promise
 * supplied by its parent or resource provider.
 */
export const UserContent: FC<UserContentProps> = ({ userPromise }): ReactElement => {
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
 * Reads dashboard data during rendering.
 */
export const DashboardContent: FC<DashboardContentProps> = ({ dashboardPromise }): ReactElement => {
  const dashboard: DashboardData = use(dashboardPromise);

  return (
    <article>
      <h3>{dashboard.title}</h3>
      <p>{dashboard.summary}</p>
    </article>
  );
};

/**
 * Reads activity data during rendering.
 */
export const ActivityContent: FC<ActivityContentProps> = ({ activityPromise }): ReactElement => {
  const activity: ActivityData = use(activityPromise);

  return (
    <article>
      <h3>{activity.title}</h3>
      <p>{activity.summary}</p>
    </article>
  );
};

/**
 * Demonstrates the basic render-as-you-fetch pattern.
 *
 * The user Promise starts before `UserContent` renders. The component reads
 * that existing Promise with `use()`, and Suspense displays its fallback while
 * the resource remains pending.
 */
export const BasicRenderAsYouFetchExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading user..." />}>
        <UserContent userPromise={userPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that the resource and the consuming component have separate
 * responsibilities.
 *
 * The resource provider starts the asynchronous work, while the component
 * simply reads and renders the resolved value.
 */
export const ResourceAndConsumerExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Resource and consumer</h3>

      <p>The resource starts the request before the consumer reads it.</p>

      <Suspense fallback={<LoadingFallback label="Loading user..." />}>
        <UserContent userPromise={userPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates several resources started before rendering.
 *
 * Because both Promises are created before the consuming components render,
 * their asynchronous operations can proceed concurrently.
 */
export const MultipleEarlyResourcesExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading dashboard..." />}>
        <DashboardContent dashboardPromise={dashboardPromise} />
        <ActivityContent activityPromise={activityPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates independent Suspense boundaries around resources that were
 * already started.
 *
 * The boundaries control presentation independently; they do not determine
 * when the underlying requests begin.
 */
export const IndependentEarlyResourcesExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading dashboard..." />}>
        <DashboardContent dashboardPromise={dashboardPromise} />
      </Suspense>

      <Suspense fallback={<LoadingFallback label="Loading activity..." />}>
        <ActivityContent activityPromise={activityPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a common render-as-you-fetch use case: route-level data
 * preparation.
 *
 * The Promise is conceptually created by a routing or framework layer before
 * the destination component renders. The component receives that resource as
 * a prop and reads it with `use()`.
 */
export const RoutePreparedResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Route-prepared resource</h3>

      <Suspense fallback={<LoadingFallback label="Loading route data..." />}>
        <DashboardContent dashboardPromise={dashboardPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that starting data loading in an event handler can also prepare
 * a resource before a later render consumes it.
 *
 * The Promise is stored in state, so the same Promise instance is retained
 * while the Suspense consumer renders.
 */
export const EventPreparedResourceExample: FC = (): ReactElement => {
  const [preparedUserPromise, setPreparedUserPromise] = useState<Promise<User> | null>(null);

  const handlePrepare = (): void => {
    const resource: Promise<User> = createResource<User>(
      {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com",
      },
      1200,
    );

    setPreparedUserPromise(resource);
  };

  return (
    <section>
      <button type="button" onClick={handlePrepare}>
        Prepare user data
      </button>

      {preparedUserPromise === null ? (
        <p>User data has not been prepared.</p>
      ) : (
        <Suspense fallback={<LoadingFallback label="Loading prepared user..." />}>
          <UserContent userPromise={preparedUserPromise} />
        </Suspense>
      )}
    </section>
  );
};

/**
 * Demonstrates preloading before the user explicitly opens a region.
 *
 * Calling the resource provider can begin the asynchronous work before the
 * consuming UI is rendered. The Promise is then reused when the content is
 * eventually displayed.
 */
const preloadedActivityPromise: Promise<ActivityData> = createResource<ActivityData>(
  {
    title: "Preloaded activity",
    summary: "The activity resource was started before the content was shown.",
  },
  1400,
);

export const PreloadedResourceExample: FC = (): ReactElement => {
  const [showActivity, setShowActivity] = useState<boolean>(false);

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          setShowActivity((current: boolean): boolean => !current);
        }}
      >
        {showActivity ? "Hide activity" : "Show activity"}
      </button>

      {showActivity ? (
        <Suspense fallback={<LoadingFallback label="Loading preloaded activity..." />}>
          <ActivityContent activityPromise={preloadedActivityPromise} />
        </Suspense>
      ) : (
        <p>The activity component is hidden, but its resource has already started.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates why creating the resource inside the consuming component is
 * not the render-as-you-fetch pattern.
 *
 * A Promise created directly during render is recreated when React retries
 * rendering after suspension. React requires a cached Promise for `use()` in
 * Client Components.
 */
export const StableResourceRequirementExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Stable resource requirement</h3>

      <p>
        The resource used here was created outside the consuming component and can therefore be reused across render
        retries.
      </p>

      <Suspense fallback={<LoadingFallback label="Loading stable resource..." />}>
        <UserContent userPromise={userPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates render-as-you-fetch versus fetch-on-render.
 *
 * In a fetch-on-render design, a component first renders and then starts its
 * request. In render-as-you-fetch, the resource starts before the consuming
 * component needs to read it.
 */
export const FetchStrategyComparisonExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Fetch strategy comparison</h3>

      <ul>
        <li>
          <strong>Fetch-on-render:</strong> rendering a component initiates its request.
        </li>
        <li>
          <strong>Render-as-you-fetch:</strong> the resource starts before the consuming component reads it.
        </li>
        <li>
          <strong>Suspense:</strong> coordinates the UI while the resource is still pending.
        </li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates avoiding an unnecessary dependency chain.
 *
 * The profile and activity resources are independent, so both are prepared
 * before their consumers render. They do not need to wait for one another.
 */
export const AvoidUnnecessaryWaterfallExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading independent dashboard data..." />}>
        <article>
          <h3>Dashboard</h3>

          <Suspense fallback={<LoadingFallback label="Loading dashboard..." />}>
            <DashboardContent dashboardPromise={dashboardPromise} />
          </Suspense>

          <Suspense fallback={<LoadingFallback label="Loading activity..." />}>
            <ActivityContent activityPromise={activityPromise} />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RenderAsYouFetchDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Render-as-You-Fetch</h1>

      <section>
        <h2>1. Basic render-as-you-fetch</h2>
        <BasicRenderAsYouFetchExample />
      </section>

      <section>
        <h2>2. Resource and consumer</h2>
        <ResourceAndConsumerExample />
      </section>

      <section>
        <h2>3. Multiple early resources</h2>
        <MultipleEarlyResourcesExample />
      </section>

      <section>
        <h2>4. Independent early resources</h2>
        <IndependentEarlyResourcesExample />
      </section>

      <section>
        <h2>5. Route-prepared resource</h2>
        <RoutePreparedResourceExample />
      </section>

      <section>
        <h2>6. Event-prepared resource</h2>
        <EventPreparedResourceExample />
      </section>

      <section>
        <h2>7. Preloaded resource</h2>
        <PreloadedResourceExample />
      </section>

      <section>
        <h2>8. Stable resource requirement</h2>
        <StableResourceRequirementExample />
      </section>

      <section>
        <h2>9. Fetch strategy comparison</h2>
        <FetchStrategyComparisonExample />
      </section>

      <section>
        <h2>10. Avoiding an unnecessary waterfall</h2>
        <AvoidUnnecessaryWaterfallExample />
      </section>
    </main>
  );
};

export default RenderAsYouFetchDemo;

// ---------------------------------------------------------------------
// Summary
// Render-as-you-fetch starts asynchronous work before the consuming component needs to read it.
// The consuming component receives the resource and reads it with `use()` during rendering.
// Suspense displays fallback UI while the Promise read by `use()` remains pending.
// Promises passed to `use()` in Client Components must be cached and reusable across render retries.
// Independent resources can be started together so their asynchronous work can overlap.
// Route loaders, event handlers, caches, and framework data layers can prepare resources before consumption.
// Preloading can begin work before a component is actually rendered.
// Render-as-you-fetch can reduce unnecessary request waterfalls compared with starting requests only after rendering.
// ---------------------------------------------------------------------

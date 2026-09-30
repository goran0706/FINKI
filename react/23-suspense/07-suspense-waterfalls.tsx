/**
 * Suspense Waterfalls
 * ===================
 *
 * A Suspense waterfall occurs when asynchronous work that could have started
 * earlier is delayed until another suspended operation finishes. Waterfalls
 * can happen when resources are requested sequentially, when nested components
 * cannot begin their work until parent data is available, or when rendering
 * causes the next resource to be discovered too late.
 *
 * Suspense does not automatically make asynchronous work parallel. The
 * application still determines when resources are created and whether
 * independent resources can begin concurrently. Starting independent work
 * early and sharing stable resources can reduce unnecessary sequential
 * waiting.
 */

import { type FC, type ReactElement, Suspense, use } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface Profile {
  readonly userId: number;
  readonly summary: string;
}

export interface Activity {
  readonly userId: number;
  readonly summary: string;
}

export interface Recommendation {
  readonly userId: number;
  readonly product: string;
}

export interface UserContentProps {
  readonly promise: Promise<User>;
}

export interface ProfileContentProps {
  readonly promise: Promise<Profile>;
}

export interface ActivityContentProps {
  readonly promise: Promise<Activity>;
}

export interface RecommendationContentProps {
  readonly promise: Promise<Recommendation>;
}

export interface LoadingFallbackProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a delayed asynchronous resource.
 *
 * The examples use delayed Promises only to make the timing of the different
 * request strategies visible. The same concepts apply to real asynchronous
 * data resources.
 */
const createResource = <T,>(value: T, delay: number): Promise<T> => {
  return new Promise<T>((resolve): void => {
    window.setTimeout((): void => {
      resolve(value);
    }, delay);
  });
};

/**
 * Creates a stable user resource.
 */
const userResource: Promise<User> = createResource<User>(
  {
    id: 1,
    name: "John Doe",
  },
  1000,
);

/**
 * Creates independent resources at module scope.
 *
 * Because these Promises are created together, their asynchronous work can
 * begin concurrently instead of waiting for one resource to resolve before
 * creating the next.
 */
const profileResource: Promise<Profile> = createResource<Profile>(
  {
    userId: 1,
    summary: "Profile information is ready.",
  },
  1500,
);

const activityResource: Promise<Activity> = createResource<Activity>(
  {
    userId: 1,
    summary: "Recent activity is ready.",
  },
  1200,
);

const recommendationResource: Promise<Recommendation> = createResource<Recommendation>(
  {
    userId: 1,
    product: "Example Product",
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
 * Reads user data.
 */
export const UserContent: FC<UserContentProps> = ({ promise }): ReactElement => {
  const user: User = use(promise);

  return (
    <article>
      <h3>User</h3>
      <p>{user.name}</p>
    </article>
  );
};

/**
 * Reads profile data.
 */
export const ProfileContent: FC<ProfileContentProps> = ({ promise }): ReactElement => {
  const profile: Profile = use(promise);

  return (
    <article>
      <h3>Profile</h3>
      <p>{profile.summary}</p>
    </article>
  );
};

/**
 * Reads activity data.
 */
export const ActivityContent: FC<ActivityContentProps> = ({ promise }): ReactElement => {
  const activity: Activity = use(promise);

  return (
    <article>
      <h3>Activity</h3>
      <p>{activity.summary}</p>
    </article>
  );
};

/**
 * Reads recommendation data.
 */
export const RecommendationContent: FC<RecommendationContentProps> = ({ promise }): ReactElement => {
  const recommendation: Recommendation = use(promise);

  return (
    <article>
      <h3>Recommendation</h3>
      <p>{recommendation.product}</p>
    </article>
  );
};

/**
 * Demonstrates a conceptual request waterfall.
 *
 * The second resource is not created until the first resource resolves. The
 * second operation therefore cannot begin during the first operation's delay.
 */
const createSequentialResources = async (): Promise<{
  readonly profile: Profile;
  readonly activity: Activity;
}> => {
  const profile: Profile = await createResource<Profile>(
    {
      userId: 1,
      summary: "Profile request completed.",
    },
    1200,
  );

  const activity: Activity = await createResource<Activity>(
    {
      userId: 1,
      summary: "Activity request started after profile completed.",
    },
    1200,
  );

  return {
    profile,
    activity,
  };
};

const sequentialResourcesPromise: Promise<{
  readonly profile: Profile;
  readonly activity: Activity;
}> = createSequentialResources();

/**
 * Demonstrates a sequential resource dependency.
 *
 * The second asynchronous operation starts only after the first one resolves.
 * This is the defining timing characteristic of a request waterfall.
 */
export const SequentialWaterfallExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading sequential resources..." />}>
        <SequentialResourceContent />
      </Suspense>
    </section>
  );
};

const SequentialResourceContent: FC = (): ReactElement => {
  const resources: {
    readonly profile: Profile;
    readonly activity: Activity;
  } = use(sequentialResourcesPromise);

  return (
    <article>
      <h3>Sequential resources</h3>
      <p>{resources.profile.summary}</p>
      <p>{resources.activity.summary}</p>
    </article>
  );
};

/**
 * Demonstrates independent resources that begin concurrently.
 *
 * The resources are created at module scope before rendering. Their delays
 * therefore overlap rather than forming a chain.
 */
export const ParallelResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading independent resources..." />}>
        <ProfileContent promise={profileResource} />
        <ActivityContent promise={activityResource} />
        <RecommendationContent promise={recommendationResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates sibling Suspense boundaries around independent resources.
 *
 * The boundaries do not serialize the underlying Promises. Each resource can
 * resolve independently and reveal its own subtree.
 */
export const ParallelBoundariesExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading profile..." />}>
        <ProfileContent promise={profileResource} />
      </Suspense>

      <Suspense fallback={<LoadingFallback label="Loading activity..." />}>
        <ActivityContent promise={activityResource} />
      </Suspense>

      <Suspense fallback={<LoadingFallback label="Loading recommendations..." />}>
        <RecommendationContent promise={recommendationResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a waterfall caused by a parent resource determining the
 * resource needed by a child.
 *
 * The child cannot obtain its user-specific data until the parent has resolved
 * the user identifier.
 */
const createUserDependentResource = async (): Promise<Activity> => {
  const user: User = await userResource;

  return createResource<Activity>(
    {
      userId: user.id,
      summary: "User-dependent activity is ready.",
    },
    1200,
  );
};

const userDependentActivityResource: Promise<Activity> = createUserDependentResource();

const UserDependentActivityContent: FC = (): ReactElement => {
  const activity: Activity = use(userDependentActivityResource);

  return (
    <article>
      <h3>User-dependent activity</h3>
      <p>{activity.summary}</p>
    </article>
  );
};

export const DependentResourceWaterfallExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading user-dependent data..." />}>
        <UserDependentActivityContent />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates how an independent resource can be started before another
 * resource is rendered.
 *
 * The activity resource is created at module scope rather than waiting for the
 * user component to render, so its asynchronous work can overlap with the
 * user request.
 */
export const RenderAsEarlyAsPossibleExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading dashboard..." />}>
        <UserContent promise={userResource} />
        <ActivityContent promise={activityResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that nested Suspense boundaries do not themselves create a
 * request waterfall.
 *
 * A waterfall comes from the timing of resource creation or dependency, not
 * simply from placing one Suspense boundary inside another.
 */
export const NestedBoundaryWithoutWaterfallExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading dashboard shell..." />}>
        <UserContent promise={userResource} />

        <Suspense fallback={<LoadingFallback label="Loading activity panel..." />}>
          <ActivityContent promise={activityResource} />
        </Suspense>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates stable shared resources.
 *
 * Both components consume the same Promise rather than independently starting
 * duplicate work for the same resource.
 */
export const SharedResourceExample: FC = (): ReactElement => {
  const sharedResource: Promise<User> = userResource;

  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading shared user..." />}>
        <UserContent promise={sharedResource} />
        <UserContent promise={sharedResource} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a common anti-pattern: starting an independent resource only
 * after another resource has resolved even though the second resource does
 * not actually depend on the first.
 */
const createArtificialWaterfall = async (): Promise<{
  readonly user: User;
  readonly recommendations: Recommendation;
}> => {
  const user: User = await userResource;

  const recommendations: Recommendation = await createResource<Recommendation>(
    {
      userId: user.id,
      product: "Example Product",
    },
    1400,
  );

  return {
    user,
    recommendations,
  };
};

const artificialWaterfallResource: Promise<{
  readonly user: User;
  readonly recommendations: Recommendation;
}> = createArtificialWaterfall();

const ArtificialWaterfallContent: FC = (): ReactElement => {
  const result: {
    readonly user: User;
    readonly recommendations: Recommendation;
  } = use(artificialWaterfallResource);

  return (
    <article>
      <h3>{result.user.name}</h3>
      <p>{result.recommendations.product}</p>
    </article>
  );
};

export const ArtificialWaterfallExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading artificially sequential data..." />}>
        <ArtificialWaterfallContent />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the difference between dependency and mere ordering.
 *
 * If the second resource genuinely needs the result of the first resource,
 * sequential work can be necessary. If it does not, delaying its creation is
 * unnecessary serialization.
 */
export const DependencyVersusOrderingExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Dependency versus ordering</h3>

      <ul>
        <li>
          <strong>Dependent:</strong> resource B needs data produced by resource A, so B may need to wait for A.
        </li>
        <li>
          <strong>Independent:</strong> resource B does not need A, so both resources can begin concurrently.
        </li>
        <li>
          <strong>Ordering alone:</strong> rendering B after A does not necessarily mean B depends on A.
        </li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates the architectural goal of avoiding unnecessary waterfalls.
 *
 * Independent resources are started early, while genuinely dependent
 * resources remain sequential where the dependency requires it.
 */
export const WaterfallAvoidanceExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading dashboard resources..." />}>
        <article>
          <h3>Dashboard</h3>

          <Suspense fallback={<LoadingFallback label="Loading profile..." />}>
            <ProfileContent promise={profileResource} />
          </Suspense>

          <Suspense fallback={<LoadingFallback label="Loading activity..." />}>
            <ActivityContent promise={activityResource} />
          </Suspense>

          <Suspense fallback={<LoadingFallback label="Loading recommendations..." />}>
            <RecommendationContent promise={recommendationResource} />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseWaterfallsDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense Waterfalls</h1>

      <section>
        <h2>1. Sequential resource waterfall</h2>
        <SequentialWaterfallExample />
      </section>

      <section>
        <h2>2. Parallel resources</h2>
        <ParallelResourceExample />
      </section>

      <section>
        <h2>3. Parallel Suspense boundaries</h2>
        <ParallelBoundariesExample />
      </section>

      <section>
        <h2>4. Dependent resource waterfall</h2>
        <DependentResourceWaterfallExample />
      </section>

      <section>
        <h2>5. Start resources early</h2>
        <RenderAsEarlyAsPossibleExample />
      </section>

      <section>
        <h2>6. Nested boundaries without a waterfall</h2>
        <NestedBoundaryWithoutWaterfallExample />
      </section>

      <section>
        <h2>7. Shared resource</h2>
        <SharedResourceExample />
      </section>

      <section>
        <h2>8. Artificial waterfall</h2>
        <ArtificialWaterfallExample />
      </section>

      <section>
        <h2>9. Dependency versus ordering</h2>
        <DependencyVersusOrderingExample />
      </section>

      <section>
        <h2>10. Waterfall avoidance</h2>
        <WaterfallAvoidanceExample />
      </section>
    </main>
  );
};

export default SuspenseWaterfallsDemo;

// ---------------------------------------------------------------------
// Summary
// A Suspense waterfall occurs when asynchronous work is unnecessarily delayed behind other asynchronous work.
// Suspense itself does not serialize independent resources; resource creation and dependencies determine timing.
// Independent resources can begin concurrently when they are created before the dependent rendering path needs them.
// Genuine data dependencies can require sequential work because the later resource needs the earlier result.
// Nested Suspense boundaries do not inherently create waterfalls.
// Stable shared resources can prevent duplicate requests and preserve resource identity across render retries.
// Starting independent resources early can reduce unnecessary sequential waiting.
// Resource ordering should be distinguished from actual resource dependency.
// ---------------------------------------------------------------------

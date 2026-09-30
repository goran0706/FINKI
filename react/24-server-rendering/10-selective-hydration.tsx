/**
 * Selective Hydration
 * ===================
 *
 * Selective hydration allows React to hydrate different parts of server-rendered HTML independently
 * instead of requiring the entire application to become interactive at once. Suspense boundaries
 * divide the tree into independent units so React can prioritize hydration of the parts users interact
 * with while other parts are still waiting for code, data, or other rendering work.
 */

import { Suspense, use, useState, type FC, type ReactElement } from "react";
import { hydrateRoot } from "react-dom/client";

// ---------------------------------------------------------------------
// 1. Basic selective hydration structure
// ---------------------------------------------------------------------

export const MessageComposer: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <section>
      <h2>Message Composer</h2>
      <label>
        Message
        <input
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
      </label>
      <p>{message || "No message entered."}</p>
    </section>
  );
};

export const ChatList: FC = (): ReactElement => {
  return (
    <section>
      <h2>Chats</h2>
      <ul>
        <li>John Doe</li>
        <li>Jane Doe</li>
        <li>Example User</li>
      </ul>
    </section>
  );
};

export const SelectiveHydrationPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Messages</h1>

      <MessageComposer />

      <Suspense fallback={<p>Loading chats...</p>}>
        <ChatList />
      </Suspense>
    </main>
  );
};

// Suspense boundaries divide the tree into independently hydratable regions.
// The message composer does not need to wait for the chat section to hydrate.

// ---------------------------------------------------------------------
// 2. Hydrating the server-rendered application
// ---------------------------------------------------------------------

interface HydrationOptions {
  readonly container: HTMLElement;
}

export const hydrateApplication = ({ container }: HydrationOptions): void => {
  hydrateRoot(container, <SelectiveHydrationPage />);
};

// `hydrateRoot` starts hydration of the server-rendered application.
// React can then coordinate hydration of the individual boundaries in the tree.

// ---------------------------------------------------------------------
// 3. Independent interactive regions
// ---------------------------------------------------------------------

export const SearchBox: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <section>
      <h2>Search</h2>
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        placeholder="Search"
      />
      <p>Query: {query || "None"}</p>
    </section>
  );
};

export const Notifications: FC = (): ReactElement => {
  return (
    <section>
      <h2>Notifications</h2>
      <p>You have 3 notifications.</p>
    </section>
  );
};

export const AccountPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <SearchBox />

      <Suspense fallback={<p>Loading notifications...</p>}>
        <Notifications />
      </Suspense>
    </main>
  );
};

// Each independent part of the tree can participate in hydration without
// requiring unrelated content to become interactive first.

// ---------------------------------------------------------------------
// 4. Suspense creates hydration boundaries
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

const userPromise = Promise.resolve<User>({
  name: "John Doe",
});

export const UserDetails: FC = (): ReactElement => {
  const user = use(userPromise);

  return (
    <section>
      <h2>{user.name}</h2>
      <p>Account details are available.</p>
    </section>
  );
};

export const UserPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <Suspense fallback={<p>Loading account...</p>}>
        <UserDetails />
      </Suspense>
    </main>
  );
};

// Suspense boundaries are useful for selective hydration because they provide
// natural boundaries between portions of the server-rendered component tree.

// ---------------------------------------------------------------------
// 5. A boundary can wait for code or data
// ---------------------------------------------------------------------

export const ProductSummary: FC = (): ReactElement => {
  return (
    <section>
      <h2>Example Product</h2>
      <p>The product is available.</p>
    </section>
  );
};

export const ProductReviews: FC = (): ReactElement => {
  return (
    <section>
      <h2>Reviews</h2>
      <p>Reviews are being loaded.</p>
    </section>
  );
};

export const ProductPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Product</h1>
      <ProductSummary />

      <Suspense fallback={<p>Loading reviews...</p>}>
        <ProductReviews />
      </Suspense>
    </main>
  );
};

// The summary can hydrate independently from the reviews boundary.
// The exact reason a boundary is not immediately ready can depend on the
// application architecture, including code or Suspense-enabled data loading.

// ---------------------------------------------------------------------
// 6. User interaction can prioritize hydration
// ---------------------------------------------------------------------

export const InteractiveNavigation: FC = (): ReactElement => {
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <nav>
      {["Home", "Profile", "Settings"].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => {
            setActiveItem(item);
          }}
        >
          {item}
        </button>
      ))}

      <p>Active: {activeItem}</p>
    </nav>
  );
};

export const NavigationPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <InteractiveNavigation />

      <Suspense fallback={<p>Loading account...</p>}>
        <UserDetails />
      </Suspense>
    </main>
  );
};

// If the user interacts with an area that needs hydration, React can prioritize
// the relevant work rather than treating every part of the page as equally urgent.

// ---------------------------------------------------------------------
// 7. Selective hydration is not multiple React roots
// ---------------------------------------------------------------------

export const IndependentSection: FC = (): ReactElement => {
  return (
    <section>
      <h2>Independent Section</h2>
      <p>This section belongs to the same React tree.</p>
    </section>
  );
};

export const SingleApplicationTree: FC = (): ReactElement => {
  return (
    <main>
      <InteractiveNavigation />

      <Suspense fallback={<p>Loading content...</p>}>
        <IndependentSection />
      </Suspense>
    </main>
  );
};

// Selective hydration does not require creating a separate React root for every section.
// One root can contain multiple Suspense boundaries that React hydrates selectively.

// ---------------------------------------------------------------------
// 8. Multiple Suspense boundaries
// ---------------------------------------------------------------------

const profilePromise = Promise.resolve({
  name: "John Doe",
});

const ordersPromise = Promise.resolve(["Order #1001", "Order #1002"]);

export const Profile: FC = (): ReactElement => {
  const profile = use(profilePromise);

  return (
    <section>
      <h2>Profile</h2>
      <p>{profile.name}</p>
    </section>
  );
};

export const Orders: FC = (): ReactElement => {
  const orders = use(ordersPromise);

  return (
    <section>
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order}>{order}</li>
        ))}
      </ul>
    </section>
  );
};

export const Dashboard: FC = (): ReactElement => {
  return (
    <main>
      <h1>Dashboard</h1>

      <InteractiveNavigation />

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading orders...</p>}>
        <Orders />
      </Suspense>
    </main>
  );
};

// Separate boundaries provide separate units that can participate in hydration independently.
// A slow profile section does not inherently prevent an unrelated orders boundary from hydrating.

// ---------------------------------------------------------------------
// 9. Nested boundaries
// ---------------------------------------------------------------------

export const ActivityFeed: FC = (): ReactElement => {
  return (
    <section>
      <h2>Activity</h2>
      <p>Recent activity is available.</p>
    </section>
  );
};

export const Recommendations: FC = (): ReactElement => {
  return (
    <aside>
      <h2>Recommendations</h2>
      <p>Recommended content is available.</p>
    </aside>
  );
};

export const NestedHydrationPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>

      <Suspense fallback={<p>Loading dashboard...</p>}>
        <ActivityFeed />

        <Suspense fallback={<p>Loading recommendations...</p>}>
          <Recommendations />
        </Suspense>
      </Suspense>
    </main>
  );
};

// Nested boundaries allow more granular separation of rendering and hydration work.
// The outer boundary provides a larger unit, while the inner boundary provides a smaller one.

// ---------------------------------------------------------------------
// 10. Selective hydration and server-rendered HTML
// ---------------------------------------------------------------------

export const ServerRenderedNavigation: FC = (): ReactElement => {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/profile">Profile</a>
      <a href="/settings">Settings</a>
    </nav>
  );
};

export const ServerRenderedPage: FC = (): ReactElement => {
  return (
    <main>
      <ServerRenderedNavigation />

      <Suspense fallback={<p>Loading content...</p>}>
        <ProductReviews />
      </Suspense>
    </main>
  );
};

// The browser can display the server-rendered HTML before hydration finishes.
// Selective hydration determines when different parts of that existing HTML become React-managed.

// ---------------------------------------------------------------------
// 11. Hydration does not regenerate the initial HTML
// ---------------------------------------------------------------------

export const HydrationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => {
          setCount((current) => current + 1);
        }}
      >
        Increment
      </button>
    </section>
  );
};

// During hydration, React attaches its behavior to the existing server-rendered HTML.
// It does not simply discard the HTML and render a completely new tree from scratch.

// ---------------------------------------------------------------------
// 12. Suspense fallback during hydration
// ---------------------------------------------------------------------

export const SlowSection: FC = (): ReactElement => {
  return (
    <section>
      <h2>Slow Section</h2>
      <p>This section can become interactive later.</p>
    </section>
  );
};

export const FallbackHydrationPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>

      <section>
        <h2>Immediately Available</h2>
        <button type="button">Continue</button>
      </section>

      <Suspense fallback={<p>Loading additional content...</p>}>
        <SlowSection />
      </Suspense>
    </main>
  );
};

// The fallback is part of the server-rendering strategy for a suspended boundary.
// Once the boundary is ready to hydrate, React can replace the fallback with its actual content.

// ---------------------------------------------------------------------
// 13. Avoiding one large hydration boundary
// ---------------------------------------------------------------------

export const LargePage: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example Application</h1>
      </header>

      <section>
        <h2>Search</h2>
        <input placeholder="Search" />
      </section>

      <section>
        <h2>Profile</h2>
        <p>John Doe</p>
      </section>

      <section>
        <h2>Orders</h2>
        <p>2 orders</p>
      </section>

      <section>
        <h2>Recommendations</h2>
        <p>Example recommendations.</p>
      </section>
    </main>
  );
};

// A large undivided tree provides fewer natural boundaries for React to prioritize.
// Introducing meaningful Suspense boundaries can divide independent regions of a page.

// ---------------------------------------------------------------------
// 14. Dividing independent regions
// ---------------------------------------------------------------------

export const DividedPage: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example Application</h1>
      </header>

      <Suspense fallback={<p>Loading search...</p>}>
        <SearchBox />
      </Suspense>

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading orders...</p>}>
        <Orders />
      </Suspense>
    </main>
  );
};

// The boundaries should represent meaningful independent parts of the application.
// Adding Suspense boundaries everywhere is not automatically beneficial.

// ---------------------------------------------------------------------
// 15. Hydration and Suspense-enabled data
// ---------------------------------------------------------------------

interface Comment {
  readonly id: number;
  readonly text: string;
}

const commentsPromise = Promise.resolve<Comment[]>([
  {
    id: 1,
    text: "Example comment.",
  },
  {
    id: 2,
    text: "Another example comment.",
  },
]);

export const Comments: FC = (): ReactElement => {
  const comments = use(commentsPromise);

  return (
    <section>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <p key={comment.id}>{comment.text}</p>
      ))}
    </section>
  );
};

export const CommentsPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Article</h1>

      <article>
        <p>This article can be displayed before its comments become ready.</p>
      </article>

      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments />
      </Suspense>
    </main>
  );
};

// Suspense-enabled data sources can keep a boundary from being ready immediately.
// Selective hydration lets unrelated parts of the page remain independently actionable.

// ---------------------------------------------------------------------
// 16. Selective hydration and code loading
// ---------------------------------------------------------------------

export const CodeDependentSection: FC = (): ReactElement => {
  return (
    <section>
      <h2>Additional Feature</h2>
      <button type="button">Continue</button>
    </section>
  );
};

export const CodeLoadingPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>

      <section>
        <h2>Primary Feature</h2>
        <button type="button">Start</button>
      </section>

      <Suspense fallback={<p>Loading additional feature...</p>}>
        <CodeDependentSection />
      </Suspense>
    </main>
  );
};

// Suspense boundaries can also provide independent units around components whose code
// is loaded asynchronously through mechanisms such as `lazy`.

// ---------------------------------------------------------------------
// 17. Selective hydration is automatic
// ---------------------------------------------------------------------

export const AutomaticHydrationPage: FC = (): ReactElement => {
  return (
    <main>
      <InteractiveNavigation />

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>
    </main>
  );
};

// Applications do not call a separate "selectiveHydrate" function.
// Selective hydration is an internal React behavior integrated with `hydrateRoot` and Suspense.

// ---------------------------------------------------------------------
// 18. Hydration priority is not a manual API
// ---------------------------------------------------------------------

export const PriorityExample: FC = (): ReactElement => {
  return (
    <main>
      <button type="button">Primary Action</button>

      <Suspense fallback={<p>Loading secondary content...</p>}>
        <section>
          <h2>Secondary Content</h2>
          <p>Additional information.</p>
        </section>
      </Suspense>
    </main>
  );
};

// Developers define component boundaries and Suspense boundaries.
// React decides how to schedule and prioritize hydration work internally.

// ---------------------------------------------------------------------
// 19. Hydration and updates before a boundary is ready
// ---------------------------------------------------------------------

export const UpdatingBoundary: FC = (): ReactElement => {
  const [selected, setSelected] = useState("First");

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setSelected("First");
        }}
      >
        First
      </button>

      <button
        type="button"
        onClick={() => {
          setSelected("Second");
        }}
      >
        Second
      </button>

      <p>Selected: {selected}</p>
    </section>
  );
};

export const UpdatingHydrationPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>

      <Suspense fallback={<p>Loading controls...</p>}>
        <UpdatingBoundary />
      </Suspense>
    </main>
  );
};

// A Suspense boundary that receives an update before it has finished hydrating
// may switch to client rendering. Updates that can wait can be coordinated with
// React's transition mechanisms when appropriate.

// ---------------------------------------------------------------------
// 20. Selective hydration and Activity
// ---------------------------------------------------------------------

export const TabContent: FC<{
  readonly title: string;
}> = ({ title }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <p>Example tab content.</p>
    </section>
  );
};

// React's Activity boundaries can also participate in selective hydration.
// They are useful for UI that is shown or hidden without introducing a loading fallback.
// Suspense remains the primary boundary for content that suspends during rendering.

// ---------------------------------------------------------------------
// 21. Complete demonstration
// ---------------------------------------------------------------------

export const SelectiveHydrationDemo: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example Application</h1>
        <InteractiveNavigation />
      </header>

      <section>
        <h2>Message Composer</h2>
        <MessageComposer />
      </section>

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading orders...</p>}>
        <Orders />
      </Suspense>

      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments />
      </Suspense>
    </main>
  );
};

export const hydrateSelectiveApplication = (container: HTMLElement): void => {
  hydrateRoot(container, <SelectiveHydrationDemo />);
};

export default SelectiveHydrationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Selective hydration lets React hydrate different parts of server-rendered HTML independently.
// - `hydrateRoot` starts hydration of the server-rendered React tree.
// - Suspense boundaries provide natural boundaries that React can hydrate independently.
// - A component outside a pending Suspense boundary can become interactive without waiting for that boundary.
// - User interaction can cause React to prioritize hydration work for the relevant part of the application.
// - Suspense-enabled code or data can cause a boundary to remain pending while unrelated regions continue independently.
// - Selective hydration is automatic; applications do not call a separate selective-hydration API.
// - Developers influence hydration boundaries by structuring the component tree and placing meaningful Suspense boundaries.
// - Multiple Suspense boundaries can allow several independent regions to hydrate progressively.
// - Selective hydration does not require multiple React roots for different sections of the same application.
// - The server-rendered HTML remains visible while hydration progressively makes the application interactive.
// - Selective hydration is an internal React optimization integrated with server rendering, hydration, and Suspense.

/**
 * Dynamic Rendering
 * ==================
 *
 * Dynamic rendering means generating a React result from data that is determined at render time,
 * such as request-specific information, authenticated user data, cookies, headers, or frequently
 * changing application state. Unlike static rendering, the output is generated again when the
 * application needs a fresh result rather than being reused as pre-generated HTML.
 */

// ---------------------------------------------------------------------
// 1. Rendering with request-specific data
// ---------------------------------------------------------------------

import { renderToString } from "react-dom/server";
import { type FC, type ReactElement } from "react";

interface User {
  readonly name: string;
  readonly email: string;
}

interface AccountPageProps {
  readonly user: User;
}

export const AccountPage: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

export const renderAccountPage = (user: User): string => {
  return renderToString(<AccountPage user={user} />);
};

const accountMarkup = renderAccountPage({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(accountMarkup);

// The data is supplied when the page is rendered.
// Different requests can therefore produce different HTML.

// ---------------------------------------------------------------------
// 2. Dynamic rendering is about when data is resolved
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: string;
}

interface ProductPageProps {
  readonly product: Product;
}

export const ProductPage: FC<ProductPageProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
    </article>
  );
};

export const renderProductPage = (product: Product): string => {
  return renderToString(<ProductPage product={product} />);
};

const firstProductMarkup = renderProductPage({
  name: "Example Product",
  price: "$49.99",
});

const secondProductMarkup = renderProductPage({
  name: "Another Product",
  price: "$79.99",
});

console.log(firstProductMarkup);
console.log(secondProductMarkup);

// The same component can produce different output when its render-time data changes.
// Dynamic rendering is therefore concerned with data freshness rather than a special JSX syntax.

// ---------------------------------------------------------------------
// 3. Request-specific rendering
// ---------------------------------------------------------------------

interface RequestData {
  readonly userName: string;
  readonly requestId: string;
}

interface RequestPageProps {
  readonly request: RequestData;
}

export const RequestPage: FC<RequestPageProps> = ({ request }): ReactElement => {
  return (
    <main>
      <h1>Hello, {request.userName}</h1>
      <p>Request: {request.requestId}</p>
    </main>
  );
};

export const renderRequestPage = (request: RequestData): string => {
  return renderToString(<RequestPage request={request} />);
};

const requestMarkup = renderRequestPage({
  userName: "John Doe",
  requestId: "example-request",
});

console.log(requestMarkup);

// Request-specific values cannot be known when a page is permanently pre-generated.
// They must be available when that request is rendered.

// ---------------------------------------------------------------------
// 4. Dynamic rendering with authenticated user data
// ---------------------------------------------------------------------

interface DashboardProps {
  readonly user: User;
  readonly notificationCount: number;
}

export const Dashboard: FC<DashboardProps> = ({ user, notificationCount }): ReactElement => {
  return (
    <main>
      <h1>{user.name}'s Dashboard</h1>
      <p>{user.email}</p>
      <p>Notifications: {notificationCount}</p>
    </main>
  );
};

export const renderDashboard = (user: User, notificationCount: number): string => {
  return renderToString(<Dashboard user={user} notificationCount={notificationCount} />);
};

const dashboardMarkup = renderDashboard(
  {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  3,
);

console.log(dashboardMarkup);

// Authentication and user-specific application data are examples of information
// that commonly needs to be resolved for the individual request.

// ---------------------------------------------------------------------
// 5. Dynamic rendering with request headers
// ---------------------------------------------------------------------

interface HeaderData {
  readonly userAgent: string;
  readonly language: string;
}

interface RequestInformationProps {
  readonly headers: HeaderData;
}

export const RequestInformation: FC<RequestInformationProps> = ({ headers }): ReactElement => {
  return (
    <section>
      <h1>Request Information</h1>
      <p>User agent: {headers.userAgent}</p>
      <p>Language: {headers.language}</p>
    </section>
  );
};

export const renderRequestInformation = (headers: HeaderData): string => {
  return renderToString(<RequestInformation headers={headers} />);
};

const requestInformationMarkup = renderRequestInformation({
  userAgent: "Example Browser",
  language: "en",
});

console.log(requestInformationMarkup);

// Request headers are inherently associated with an individual request.
// Rendering content from them therefore requires request-time information.

// ---------------------------------------------------------------------
// 6. Dynamic rendering with cookies
// ---------------------------------------------------------------------

interface Preferences {
  readonly theme: "light" | "dark";
}

interface PreferencesPageProps {
  readonly preferences: Preferences;
}

export const PreferencesPage: FC<PreferencesPageProps> = ({ preferences }): ReactElement => {
  return (
    <main data-theme={preferences.theme}>
      <h1>Preferences</h1>
      <p>Selected theme: {preferences.theme}</p>
    </main>
  );
};

export const renderPreferencesPage = (preferences: Preferences): string => {
  return renderToString(<PreferencesPage preferences={preferences} />);
};

const preferencesMarkup = renderPreferencesPage({
  theme: "dark",
});

console.log(preferencesMarkup);

// A preference read from a request cookie can affect the generated HTML.
// The React component itself only receives the resolved preference as a prop.

// ---------------------------------------------------------------------
// 7. Dynamic data can come from a server-side function
// ---------------------------------------------------------------------

export const getCurrentUser = async (): Promise<User> => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

export const renderCurrentUserPage = async (): Promise<string> => {
  const user = await getCurrentUser();

  return renderToString(<AccountPage user={user} />);
};

const currentUserMarkup = renderCurrentUserPage();

console.log(currentUserMarkup);

// The data source can be asynchronous.
// The important distinction is that the value is resolved as part of rendering
// instead of being permanently embedded into pre-generated output.

// ---------------------------------------------------------------------
// 8. Dynamic rendering can use frequently changing data
// ---------------------------------------------------------------------

interface Stock {
  readonly symbol: string;
  readonly price: string;
}

interface StockPageProps {
  readonly stock: Stock;
}

export const StockPage: FC<StockPageProps> = ({ stock }): ReactElement => {
  return (
    <section>
      <h1>{stock.symbol}</h1>
      <p>Current price: {stock.price}</p>
    </section>
  );
};

export const getCurrentStock = async (): Promise<Stock> => {
  return {
    symbol: "EXAMPLE",
    price: "$125.00",
  };
};

export const renderStockPage = async (): Promise<string> => {
  const stock = await getCurrentStock();

  return renderToString(<StockPage stock={stock} />);
};

const stockMarkup = renderStockPage();

console.log(stockMarkup);

// Data that changes frequently may be resolved at render time when fresh output is required.
// Whether the result is regenerated on every request is ultimately controlled by the surrounding server architecture.

// ---------------------------------------------------------------------
// 9. Dynamic rendering can vary by request
// ---------------------------------------------------------------------

interface PersonalizedPageProps {
  readonly userName: string;
  readonly theme: "light" | "dark";
}

export const PersonalizedPage: FC<PersonalizedPageProps> = ({ userName, theme }): ReactElement => {
  return (
    <main data-theme={theme}>
      <h1>Hello, {userName}</h1>
      <p>Your personalized page is ready.</p>
    </main>
  );
};

export const renderPersonalizedPage = (userName: string, theme: "light" | "dark"): string => {
  return renderToString(<PersonalizedPage userName={userName} theme={theme} />);
};

const lightPage = renderPersonalizedPage("John Doe", "light");

const darkPage = renderPersonalizedPage("Jane Doe", "dark");

console.log(lightPage);
console.log(darkPage);

// Two requests can produce different HTML from the same component tree
// because their request-specific inputs differ.

// ---------------------------------------------------------------------
// 10. Dynamic rendering does not mean every component must be dynamic
// ---------------------------------------------------------------------

export const SiteHeader: FC = (): ReactElement => {
  return (
    <header>
      <strong>Example Application</strong>
    </header>
  );
};

export const DynamicAccountSection: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <section>
      <h1>Account</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </section>
  );
};

export const DynamicApplication: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <SiteHeader />
      <DynamicAccountSection user={user} />
    </main>
  );
};

export const renderDynamicApplication = (user: User): string => {
  return renderToString(<DynamicApplication user={user} />);
};

const dynamicApplicationMarkup = renderDynamicApplication({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(dynamicApplicationMarkup);

// A dynamically rendered page can contain components whose output is identical
// across requests. Dynamic rendering describes the rendering strategy, not every component.

// ---------------------------------------------------------------------
// 11. Dynamic rendering and static rendering use the same React components
// ---------------------------------------------------------------------

export const Content: FC = (): ReactElement => {
  return (
    <article>
      <h1>Example Content</h1>
      <p>This component does not depend on request-specific data.</p>
    </article>
  );
};

export const DynamicContentPage: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <Content />
      <AccountPage user={user} />
    </main>
  );
};

export const renderDynamicContentPage = (user: User): string => {
  return renderToString(<DynamicContentPage user={user} />);
};

const dynamicContentMarkup = renderDynamicContentPage({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(dynamicContentMarkup);

// React components do not become "dynamic components" through a special API.
// The surrounding rendering strategy determines when their output is generated.

// ---------------------------------------------------------------------
// 12. Dynamic rendering can produce HTML for hydration
// ---------------------------------------------------------------------

export const InteractiveDashboard: FC<DashboardProps> = ({ user, notificationCount }): ReactElement => {
  return (
    <main>
      <h1>{user.name}'s Dashboard</h1>
      <p>Notifications: {notificationCount}</p>
      <button type="button">Mark all as read</button>
    </main>
  );
};

export const renderInteractiveDashboard = (user: User, notificationCount: number): string => {
  return renderToString(<InteractiveDashboard user={user} notificationCount={notificationCount} />);
};

const interactiveDashboardMarkup = renderInteractiveDashboard(
  {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  3,
);

console.log(interactiveDashboardMarkup);

// Dynamic server rendering can produce the initial HTML for an interactive application.
// A compatible client hydration step can subsequently attach React behavior to that markup.

// ---------------------------------------------------------------------
// 13. Dynamic rendering is different from client rendering
// ---------------------------------------------------------------------

export const DynamicServerPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Server-rendered page</h1>
      <p>This HTML is generated before it reaches the browser.</p>
    </main>
  );
};

export const renderServerPage = (): string => {
  return renderToString(<DynamicServerPage />);
};

// The server produces HTML:
const serverMarkup = renderServerPage();

console.log(serverMarkup);

// A client-rendered application instead creates the React tree in the browser.
// Dynamic server rendering determines the HTML before the browser receives it.

// ---------------------------------------------------------------------
// 14. Dynamic rendering is not the same as streaming
// ---------------------------------------------------------------------

export const StreamingCompatiblePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>
      <p>The page can be rendered dynamically and streamed to the client.</p>
    </main>
  );
};

export const renderStreamingCompatiblePage = (): string => {
  return renderToString(<StreamingCompatiblePage />);
};

const streamingCompatibleMarkup = renderStreamingCompatiblePage();

console.log(streamingCompatibleMarkup);

// Dynamic rendering describes when the result needs to be generated.
// Streaming describes how the generated result is delivered.
// A dynamically rendered page can therefore also use a streaming server API.

// ---------------------------------------------------------------------
// 15. Dynamic rendering does not automatically imply no caching
// ---------------------------------------------------------------------

export const CachedDataPage: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

export const renderCachedDataPage = (user: User): string => {
  return renderToString(<CachedDataPage user={user} />);
};

const cachedDataMarkup = renderCachedDataPage({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(cachedDataMarkup);

// Dynamic rendering and caching are separate concerns.
// A system can resolve data at request time, cache data used during rendering,
// or cache the final response depending on its architecture.

// ---------------------------------------------------------------------
// 16. Complete demonstration
// ---------------------------------------------------------------------

export const DynamicRenderingDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const product: Product = {
    name: "Example Product",
    price: "$49.99",
  };

  return (
    <main>
      <AccountPage user={user} />
      <ProductPage product={product} />
      <Dashboard user={user} notificationCount={3} />
      <RequestPage
        request={{
          userName: "John Doe",
          requestId: "example-request",
        }}
      />
      <RequestInformation
        headers={{
          userAgent: "Example Browser",
          language: "en",
        }}
      />
      <PreferencesPage
        preferences={{
          theme: "dark",
        }}
      />
      <StockPage
        stock={{
          symbol: "EXAMPLE",
          price: "$125.00",
        }}
      />
      <PersonalizedPage userName="John Doe" theme="light" />
      <DynamicApplication user={user} />
      <DynamicContentPage user={user} />
      <InteractiveDashboard user={user} notificationCount={3} />
      <DynamicServerPage />
      <StreamingCompatiblePage />
      <CachedDataPage user={user} />
    </main>
  );
};

export default DynamicRenderingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dynamic rendering generates React output from data that is resolved at render time.
// - Request-specific data can include authenticated users, headers, cookies, and other request values.
// - Frequently changing data can also be resolved when fresh output is required.
// - Dynamic rendering does not require a special React component or JSX syntax.
// - A dynamically rendered page can contain components whose output is identical across requests.
// - The same React components can participate in static or dynamic rendering depending on the surrounding strategy.
// - Dynamic server rendering can produce initial HTML that is later hydrated in the browser.
// - Dynamic rendering describes when output is generated, while streaming describes how output is delivered.
// - Dynamic rendering and caching are separate concerns and can be combined in different ways.

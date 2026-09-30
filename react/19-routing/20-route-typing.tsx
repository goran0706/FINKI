/**
 * Route Typing
 * ============
 *
 * React Router provides TypeScript types for route-level APIs such as loaders,
 * actions, route parameters, and route data. In Data Mode, these APIs can be
 * typed explicitly with `LoaderFunctionArgs` and `ActionFunctionArgs`, while
 * hooks such as `useLoaderData` and `useActionData` can infer their returned
 * data types from the corresponding loader and action functions.
 *
 * Type-safe route parameters are particularly important because URL parameters
 * are runtime strings and may be absent when a route is not matched as expected.
 * Explicitly typing the loader or action arguments makes those runtime values
 * visible to TypeScript and encourages appropriate validation before they are
 * used.
 *
 * React Router's Framework Mode also provides generated route-specific types
 * through `Route.LoaderArgs`, `Route.ActionArgs`, and `Route.ComponentProps`.
 * This example focuses on explicit typing in Data Mode, where the route
 * configuration is created directly with `createBrowserRouter`.
 */

import { type FC, type ReactElement } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  Form,
  Link,
  Outlet,
  RouterProvider,
  useActionData,
  useLoaderData,
  useParams,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserRouteData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export interface UserActionData {
  readonly message: string;
  readonly name: string;
}

export interface DashboardRouteData {
  readonly title: string;
  readonly username: string;
}

export interface RouteParameterExampleProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates typing loader data through `useLoaderData`.
 *
 * Passing `typeof userLoader` lets React Router derive the hook's data type
 * from the loader's return value instead of duplicating the same data type
 * at the component boundary.
 */
export const TypedLoaderDataExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>1. Typed loader data</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </section>
  );
};

/**
 * Demonstrates explicitly typing `LoaderFunctionArgs`.
 *
 * The loader argument contains route parameters, the request, and other
 * information supplied by the router when the loader executes.
 */
export const TypedLoaderArgsExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof parameterLoader>();

  return (
    <section>
      <h2>2. Typed loader arguments</h2>
      <p>User ID: {user.id}</p>
      <p>User: {user.name}</p>
    </section>
  );
};

/**
 * Demonstrates that route parameters are strings.
 *
 * Even when a parameter represents a number semantically, React Router provides
 * the URL parameter as a string, so conversion or validation must be explicit.
 */
export const StringRouteParameterExample: FC = (): ReactElement => {
  const { userId } = useParams<"userId">();

  const numericUserId: number = Number(userId);

  return (
    <section>
      <h2>3. Route parameters are strings</h2>
      <p>Raw parameter: {userId}</p>
      <p>Converted number: {numericUserId}</p>
    </section>
  );
};

/**
 * Demonstrates typed action data through `useActionData`.
 *
 * Passing `typeof userAction` allows the hook to derive its data type from
 * the action function.
 */
export const TypedActionDataExample: FC = (): ReactElement => {
  const actionData = useActionData<typeof userAction>();

  return (
    <section>
      <h2>4. Typed action data</h2>
      <Form method="post">
        <label>
          Name
          <input name="name" type="text" defaultValue="John Doe" required />
        </label>
        <button type="submit">Save</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates explicitly typing action arguments.
 *
 * `ActionFunctionArgs` describes the request and route information supplied
 * by React Router when an action is executed.
 */
export const TypedActionArgsExample: FC = (): ReactElement => {
  const actionData = useActionData<typeof parameterAction>();

  return (
    <section>
      <h2>5. Typed action arguments</h2>
      <Form method="post">
        <input name="name" type="text" defaultValue="Example Product" />
        <button type="submit">Update</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates typed parent route data.
 *
 * A parent loader can return a known object shape, while its child route
 * renders through the parent's outlet.
 */
export const TypedParentRouteDataExample: FC = (): ReactElement => {
  const dashboard = useLoaderData<typeof dashboardLoader>();

  return (
    <div>
      <h2>6. Typed parent route data</h2>
      <p>{dashboard.title}</p>
      <p>User: {dashboard.username}</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates why parameter validation matters even when parameters are
 * statically typed as strings.
 *
 * TypeScript can describe the value's type, but it cannot guarantee that a
 * runtime URL contains a valid application-level identifier.
 */
export const RuntimeParameterValidationExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof validatedUserLoader>();

  return (
    <section>
      <h2>7. Runtime parameter validation</h2>
      <p>User ID: {user.id}</p>
      <p>User: {user.name}</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about route typing.
 *
 * TypeScript types describe the values supplied to application code, but they
 * do not validate arbitrary URL input at runtime.
 */
export const TypesDoNotValidateUrlsExample: FC = (): ReactElement => {
  const { userId } = useParams<"userId">();

  return (
    <section>
      <h2>8. Types do not validate URLs</h2>
      <p>Received route parameter: {userId ?? "(missing)"}</p>
      <p>Runtime validation is still required when the value must satisfy application-specific rules.</p>
    </section>
  );
};

/**
 * Demonstrates keeping route data types close to the functions that produce
 * them.
 *
 * Explicit return types document the data contract while the component can
 * infer its hook data from the function itself.
 */
export const ExplicitRouteDataContractExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof explicitlyTypedLoader>();

  return (
    <section>
      <h2>9. Explicit route data contract</h2>
      <p>
        {user.name} — {user.email}
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const userLoader = async (): Promise<UserRouteData> => {
  return {
    id: "100",
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

const parameterLoader = async ({ params }: LoaderFunctionArgs): Promise<UserRouteData> => {
  const userId: string = params.userId ?? "unknown";

  return {
    id: userId,
    name: userId === "200" ? "Jane Doe" : "John Doe",
    email: userId === "200" ? "jane.doe@example.com" : "john.doe@example.com",
  };
};

const userAction = async ({ request }: ActionFunctionArgs): Promise<UserActionData> => {
  const formData: FormData = await request.formData();
  const nameValue: FormDataEntryValue | null = formData.get("name");
  const name: string = typeof nameValue === "string" ? nameValue : "";

  return {
    message: `Saved ${name || "the user"}.`,
    name,
  };
};

const parameterAction = async ({ params, request }: ActionFunctionArgs): Promise<UserActionData> => {
  const formData: FormData = await request.formData();
  const nameValue: FormDataEntryValue | null = formData.get("name");
  const name: string = typeof nameValue === "string" ? nameValue : "Example Product";

  const userId: string = params.userId ?? "unknown";

  return {
    message: `Updated ${userId} for ${name}.`,
    name,
  };
};

const dashboardLoader = async (): Promise<DashboardRouteData> => {
  return {
    title: "Dashboard",
    username: "John Doe",
  };
};

const validatedUserLoader = async ({ params }: LoaderFunctionArgs): Promise<UserRouteData> => {
  const userId: string | undefined = params.userId;

  if (!userId || !/^\d+$/.test(userId)) {
    throw new Response("Invalid user ID", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  return {
    id: userId,
    name: userId === "200" ? "Jane Doe" : "John Doe",
    email: userId === "200" ? "jane.doe@example.com" : "john.doe@example.com",
  };
};

const explicitlyTypedLoader = async (): Promise<UserRouteData> => {
  return {
    id: "100",
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

const DashboardChildPage: FC = (): ReactElement => {
  return (
    <section>
      <h3>Dashboard home</h3>
      <p>This child route is rendered beneath the typed parent route.</p>
    </section>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Typing</h1>
      <p>Select an example to inspect TypeScript types used with React Router.</p>

      <nav aria-label="Route typing examples">
        <ul>
          <li>
            <Link to="/typed-loader">Typed loader data</Link>
          </li>
          <li>
            <Link to="/users/100">Typed loader arguments</Link>
          </li>
          <li>
            <Link to="/users/200/parameter">String route parameter</Link>
          </li>
          <li>
            <Link to="/typed-action">Typed action data</Link>
          </li>
          <li>
            <Link to="/users/100/action">Typed action arguments</Link>
          </li>
          <li>
            <Link to="/dashboard">Typed parent route data</Link>
          </li>
          <li>
            <Link to="/validated-users/100">Runtime parameter validation</Link>
          </li>
          <li>
            <Link to="/types-do-not-validate/100">Types do not validate URLs</Link>
          </li>
          <li>
            <Link to="/explicit-contract">Explicit route data contract</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RouteTypingDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/typed-loader",
      element: <TypedLoaderDataExample />,
      loader: userLoader,
    },
    {
      path: "/users/:userId",
      element: <TypedLoaderArgsExample />,
      loader: parameterLoader,
    },
    {
      path: "/users/:userId/parameter",
      element: <StringRouteParameterExample />,
    },
    {
      path: "/typed-action",
      element: <TypedActionDataExample />,
      action: userAction,
    },
    {
      path: "/users/:userId/action",
      element: <TypedActionArgsExample />,
      action: parameterAction,
    },
    {
      id: "dashboard",
      path: "/dashboard",
      element: <TypedParentRouteDataExample />,
      loader: dashboardLoader,
      children: [
        {
          index: true,
          element: <DashboardChildPage />,
        },
      ],
    },
    {
      path: "/validated-users/:userId",
      element: <RuntimeParameterValidationExample />,
      loader: validatedUserLoader,
    },
    {
      path: "/types-do-not-validate/:userId",
      element: <TypesDoNotValidateUrlsExample />,
    },
    {
      path: "/explicit-contract",
      element: <ExplicitRouteDataContractExample />,
      loader: explicitlyTypedLoader,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteTypingDemo;

// ---------------------------------------------------------------------
// Summary
// React Router route APIs can be explicitly typed with TypeScript.
// `LoaderFunctionArgs` types arguments received by data-mode loaders.
// `ActionFunctionArgs` types arguments received by data-mode actions.
// `useLoaderData<typeof loader>()` derives the loader-data type from the loader function.
// `useActionData<typeof action>()` derives the action-data type from the action function.
// Route parameters are runtime strings and should be validated or converted when necessary.
// TypeScript describes route values but does not validate arbitrary URL input at runtime.
// Explicit return types can document and enforce the data contract produced by route functions.
// React Router Framework Mode also provides generated route-specific types such as `Route.LoaderArgs`.
// ---------------------------------------------------------------------

/**
 * Route Actions
 * =============
 *
 * A route action is a function associated with a React Router data route that
 * handles mutations submitted to that route. Actions receive the submitted
 * request and can process form data, update application data, and return a
 * result for the navigation that triggered the mutation.
 *
 * Route actions are designed for write operations such as creating, updating,
 * or deleting records. A route can use an HTML form or React Router's `Form`
 * component to submit data to the action, while `useActionData` reads the
 * action result returned by the most recent submission.
 *
 * Actions are route-level mutation handlers. They are distinct from loaders,
 * which provide data for rendering, and from ordinary event handlers, which
 * execute entirely within a component.
 */

import { type FC, type ReactElement } from "react";
import type { ActionFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  Form,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ContactActionData {
  readonly message: string;
  readonly name: string;
}

export interface ProductActionData {
  readonly message: string;
  readonly productId: string;
}

export interface ActionResult {
  readonly message: string;
}

export interface ActionNavigationProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic purpose of a route action.
 *
 * The React Router `Form` submits to the current route, causing the route's
 * action to receive the submitted request data.
 */
export const BasicRouteActionExample: FC = (): ReactElement => {
  const actionData = useActionData() as ContactActionData | undefined;
  const navigation = useNavigation();

  const isSubmitting: boolean = navigation.state === "submitting";

  return (
    <section>
      <h2>1. Basic route action</h2>
      <Form method="post">
        <label>
          Name
          <input name="name" type="text" required />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates reading submitted form data inside an action.
 *
 * The action receives a `Request`, converts its body to `FormData`, and reads
 * individual fields using their form control names.
 */
export const FormDataActionExample: FC = (): ReactElement => {
  const actionData = useActionData() as ContactActionData | undefined;

  return (
    <section>
      <h2>2. Reading submitted form data</h2>
      <Form method="post">
        <label>
          Name
          <input name="name" type="text" defaultValue="John Doe" required />
        </label>
        <button type="submit">Submit</button>
      </Form>
      {actionData && <p>Received: {actionData.name}</p>}
    </section>
  );
};

/**
 * Demonstrates an action returning a result.
 *
 * The returned value becomes the action data available to the route component
 * through `useActionData`.
 */
export const ActionResultExample: FC = (): ReactElement => {
  const actionData = useActionData() as ActionResult | undefined;

  return (
    <section>
      <h2>3. Returning action data</h2>
      <Form method="post">
        <label>
          Message
          <input name="message" type="text" required />
        </label>
        <button type="submit">Send</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates using a route parameter inside an action.
 *
 * The action can read route parameters from `params` while processing the
 * submitted request.
 */
export const ParameterActionExample: FC = (): ReactElement => {
  const actionData = useActionData() as ProductActionData | undefined;

  return (
    <section>
      <h2>4. Route parameters in actions</h2>
      <p>Product ID: 100</p>
      <Form method="post">
        <input name="name" type="text" defaultValue="Example Product" />
        <button type="submit">Update product</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates action submission state.
 *
 * `useNavigation` exposes the router's current navigation state, allowing
 * the component to disable controls or display feedback while an action runs.
 */
export const ActionSubmissionStateExample: FC = (): ReactElement => {
  const navigation = useNavigation();

  const isSubmitting: boolean = navigation.state === "submitting";

  return (
    <section>
      <h2>5. Action submission state</h2>
      <Form method="post">
        <input name="message" type="text" defaultValue="Example submission" />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Form>
      <p>Navigation state: {navigation.state}</p>
    </section>
  );
};

/**
 * Demonstrates a redirect returned from an action.
 *
 * An action can return `redirect()` after a successful mutation so the router
 * navigates to another route instead of rendering the action result.
 */
export const ActionRedirectExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>6. Redirecting after an action</h2>
      <Form method="post">
        <button type="submit">Create and continue</button>
      </Form>
    </section>
  );
};

/**
 * Demonstrates that an action is associated with a route.
 *
 * The action belongs to the route receiving the submission rather than being
 * a globally registered mutation handler.
 */
export const RouteSpecificActionExample: FC = (): ReactElement => {
  const actionData = useActionData() as ActionResult | undefined;

  return (
    <section>
      <h2>7. Route-specific action</h2>
      <Form method="post">
        <input name="message" type="text" defaultValue="Route-specific mutation" />
        <button type="submit">Submit</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates that actions handle mutations rather than initial data loading.
 *
 * The route loader supplies the existing product while the action processes
 * the submitted update.
 */
export const LoaderAndActionExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof productLoader>();
  const actionData = useActionData() as ActionResult | undefined;

  return (
    <section>
      <h2>8. Loader and action</h2>
      <p>Current product: {product.name}</p>
      <Form method="post">
        <input name="name" type="text" defaultValue={product.name} />
        <button type="submit">Update</button>
      </Form>
      {actionData && <p>{actionData.message}</p>}
    </section>
  );
};

/**
 * Demonstrates a common misconception about route actions.
 *
 * An action is not a replacement for every client-side event handler. It is
 * specifically integrated with React Router's data mutations and navigation.
 */
export const ActionIsNotEveryEventHandlerExample: FC = (): ReactElement => {
  const [message, setMessage] = useStateFallback();

  const handleClick = (): void => {
    setMessage("This is ordinary component event handling.");
  };

  return (
    <section>
      <h2>9. Action versus ordinary event handler</h2>
      <button type="button" onClick={handleClick}>
        Run event handler
      </button>
      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const useStateFallback = (): readonly [string, (value: string) => void] => {
  let currentValue: string = "";

  const setValue = (value: string): void => {
    currentValue = value;
  };

  return [currentValue, setValue];
};

const contactAction = async ({ request }: ActionFunctionArgs): Promise<ContactActionData> => {
  const formData: FormData = await request.formData();
  const nameValue: FormDataEntryValue | null = formData.get("name");
  const name: string = typeof nameValue === "string" ? nameValue : "";

  return {
    message: `Saved information for ${name || "the user"}.`,
    name,
  };
};

const messageAction = async ({ request }: ActionFunctionArgs): Promise<ActionResult> => {
  const formData: FormData = await request.formData();
  const messageValue: FormDataEntryValue | null = formData.get("message");
  const message: string = typeof messageValue === "string" ? messageValue : "";

  return {
    message: `Received: ${message}`,
  };
};

const productAction = async ({ request, params }: ActionFunctionArgs): Promise<ProductActionData> => {
  const formData: FormData = await request.formData();
  const nameValue: FormDataEntryValue | null = formData.get("name");
  const name: string = typeof nameValue === "string" ? nameValue : "Example Product";

  return {
    message: `Updated product ${params.productId ?? "unknown"} to "${name}".`,
    productId: params.productId ?? "unknown",
  };
};

const redirectAction = async (): Promise<Response> => {
  return redirect("/action-result");
};

const productLoader = async (): Promise<{ readonly name: string }> => {
  return {
    name: "Example Product",
  };
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Actions</h1>
      <p>Select an example to inspect route-level mutation handling.</p>

      <nav aria-label="Route action examples">
        <ul>
          <li>
            <Link to="/basic-action">Basic route action</Link>
          </li>
          <li>
            <Link to="/form-data-action">Form data</Link>
          </li>
          <li>
            <Link to="/action-result">Action result</Link>
          </li>
          <li>
            <Link to="/products/100/edit">Parameter action</Link>
          </li>
          <li>
            <Link to="/submission-state">Submission state</Link>
          </li>
          <li>
            <Link to="/redirect-action">Action redirect</Link>
          </li>
          <li>
            <Link to="/route-specific-action">Route-specific action</Link>
          </li>
          <li>
            <Link to="/loader-and-action">Loader and action</Link>
          </li>
          <li>
            <Link to="/event-handler">Event handler versus action</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RedirectResultPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Action completed</h2>
      <p>The action redirected the navigation to this route.</p>
    </main>
  );
};

const ProductEditPage: FC = (): ReactElement => {
  return <ParameterActionExample />;
};

const SubmissionStateAction: FC = (): ReactElement => {
  return <ActionSubmissionStateExample />;
};

const RouteActionsDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/basic-action",
      element: <BasicRouteActionExample />,
      action: contactAction,
    },
    {
      path: "/form-data-action",
      element: <FormDataActionExample />,
      action: contactAction,
    },
    {
      path: "/action-result",
      element: <ActionResultExample />,
      action: messageAction,
    },
    {
      path: "/products/:productId/edit",
      element: <ProductEditPage />,
      action: productAction,
    },
    {
      path: "/submission-state",
      element: <SubmissionStateAction />,
      action: messageAction,
    },
    {
      path: "/redirect-action",
      element: <ActionRedirectExample />,
      action: redirectAction,
    },
    {
      path: "/route-specific-action",
      element: <RouteSpecificActionExample />,
      action: messageAction,
    },
    {
      path: "/loader-and-action",
      element: <LoaderAndActionExample />,
      loader: productLoader,
      action: messageAction,
    },
    {
      path: "/event-handler",
      element: <ActionIsNotEveryEventHandlerExample />,
    },
    {
      path: "/dashboard",
      element: <Outlet />,
    },
    {
      path: "/redirect-result",
      element: <RedirectResultPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteActionsDemo;

// ---------------------------------------------------------------------
// Summary
// A route action is a route-level function that handles mutations submitted to a route.
// React Router `Form` can submit data to the action associated with the matched route.
// An action receives an `ActionFunctionArgs` object containing the request and route parameters.
// `request.formData()` reads submitted form controls as `FormData`.
// `useActionData` reads the value returned by the most recent action submission.
// `useNavigation` exposes the router's current submission and navigation state.
// An action can return `redirect()` to navigate after a successful mutation.
// Actions handle route-level mutations and are distinct from loaders that provide route data.
// An action is not a replacement for ordinary component event handlers.
// ---------------------------------------------------------------------

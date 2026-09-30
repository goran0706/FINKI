/**
 * Route Parameters
 * ================
 *
 * Route parameters are dynamic values captured from URL path segments. A route segment
 * beginning with `:` defines a named parameter, such as `:userId` in `/users/:userId`.
 *
 * React Router exposes matched parameters through `useParams`. Parameter values are strings
 * because they originate from the URL, even when they represent numbers or other structured
 * values in the application domain. A component should therefore validate or convert a
 * parameter before using it as another type.
 *
 * A route can contain multiple dynamic parameters, optional parameters, and a splat (`*`)
 * parameter that captures the remaining path. Child routes inherit parameters from their
 * matched parent routes.
 */

import type { FC, ReactElement } from "react";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserRouteParams {
  readonly userId: string;
}

export interface ProductRouteParams {
  readonly categoryId: string;
  readonly productId: string;
}

export interface FileRouteParams {
  readonly "*": string | undefined;
}

export interface OptionalLanguageRouteParams {
  readonly lang?: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates reading a single route parameter.
 *
 * The `:userId` segment in `/users/:userId` captures the corresponding value
 * from the URL. For `/users/42`, `userId` is the string `"42"`.
 */
export const SingleRouteParameterExample: FC = (): ReactElement => {
  const { userId } = useParams<keyof UserRouteParams>();

  return (
    <div>
      <p>User ID: {userId}</p>
      <p>The parameter is received as a string from the URL.</p>
    </div>
  );
};

/**
 * Demonstrates multiple route parameters.
 *
 * Every named dynamic segment contributes a property to the parameters object.
 * The route `/catalog/:categoryId/products/:productId` therefore exposes both
 * `categoryId` and `productId`.
 */
export const MultipleRouteParametersExample: FC = (): ReactElement => {
  const { categoryId, productId } = useParams<keyof ProductRouteParams>();

  return (
    <div>
      <p>Category: {categoryId}</p>
      <p>Product: {productId}</p>
    </div>
  );
};

/**
 * Demonstrates that route parameters are strings.
 *
 * A numeric-looking URL segment such as `42` is still returned as `"42"`.
 * Conversion to a number is an explicit application-level operation.
 */
export const StringRouteParameterExample: FC = (): ReactElement => {
  const { userId } = useParams<keyof UserRouteParams>();
  const numericUserId: number = Number(userId);

  return (
    <div>
      <p>Raw parameter: {userId}</p>
      <p>Converted number: {numericUserId}</p>
    </div>
  );
};

/**
 * Demonstrates validating a converted route parameter.
 *
 * `Number` can produce `NaN` when the parameter is not a valid numeric value.
 * A route parameter should therefore be validated before being treated as a number.
 */
export const ValidatedRouteParameterExample: FC = (): ReactElement => {
  const { userId } = useParams<keyof UserRouteParams>();
  const numericUserId: number = Number(userId);
  const isValidUserId: boolean = Number.isInteger(numericUserId) && numericUserId > 0;

  if (!isValidUserId) {
    return <p>Invalid user ID: {userId}</p>;
  }

  return <p>Validated user ID: {numericUserId}</p>;
};

/**
 * Demonstrates an optional route parameter.
 *
 * A `?` makes a dynamic segment optional. The component must handle the case
 * where the parameter is absent from the URL.
 */
export const OptionalRouteParameterExample: FC = (): ReactElement => {
  const { lang } = useParams<keyof OptionalLanguageRouteParams>();

  return (
    <div>
      <p>Language: {lang ?? "default"}</p>
      <p>The parameter is absent when the optional segment is not present.</p>
    </div>
  );
};

/**
 * Demonstrates a splat route parameter.
 *
 * A route ending in `/*` captures the remaining URL path in the `"*"` parameter.
 * Unlike a normal dynamic segment, the captured value can contain additional `/`
 * path separators.
 */
export const SplatRouteParameterExample: FC = (): ReactElement => {
  const params = useParams<FileRouteParams>();
  const filePath: string = params["*"] ?? "";

  return (
    <div>
      <p>Captured path: {filePath}</p>
    </div>
  );
};

/**
 * Demonstrates destructuring a splat parameter with a local name.
 *
 * The parameter key is literally `"*"`, but JavaScript destructuring can rename
 * that property to a conventional local variable such as `filePath`.
 */
export const NamedSplatParameterExample: FC = (): ReactElement => {
  const { "*": filePath } = useParams<FileRouteParams>();

  return <p>File path: {filePath ?? "No path"}</p>;
};

/**
 * Demonstrates that child routes inherit parent parameters.
 *
 * A parent route such as `/teams/:teamId` can provide `teamId` to a nested
 * child route without repeating the parameter in the child's path.
 */
export const InheritedRouteParameterExample: FC = (): ReactElement => {
  const { teamId } = useParams<"teamId">();

  return (
    <div>
      <p>Team ID: {teamId}</p>
      <p>This parameter was defined by the parent route.</p>
    </div>
  );
};

/**
 * Demonstrates multiple parameters across nested routes.
 *
 * Parent and child dynamic segments are available together to the component
 * rendered by the child route.
 */
export const NestedRouteParametersExample: FC = (): ReactElement => {
  const { teamId, memberId } = useParams<"teamId" | "memberId">();

  return (
    <div>
      <p>Team ID: {teamId}</p>
      <p>Member ID: {memberId}</p>
    </div>
  );
};

/**
 * Demonstrates route parameters as identifiers rather than query parameters.
 *
 * The `:productId` value is part of the pathname. Query parameters such as
 * `?sort=price` are a separate URL mechanism and are not returned by `useParams`.
 */
export const PathVsQueryParameterExample: FC = (): ReactElement => {
  const { productId } = useParams<"productId">();

  return (
    <div>
      <p>Product route parameter: {productId}</p>
      <p>Query-string values are handled separately from route parameters.</p>
    </div>
  );
};

/**
 * Demonstrates a common misconception about parameter typing.
 *
 * The generic passed to `useParams` describes parameter names and does not convert
 * the runtime URL values into numbers, booleans, or other application-specific types.
 */
export const ParameterTypingDoesNotConvertValueExample: FC = (): ReactElement => {
  const { userId } = useParams<"userId">();

  const numericUserId: number = Number(userId);

  return (
    <div>
      <p>URL value: {userId}</p>
      <p>Converted value: {numericUserId}</p>
      <p>The explicit conversion is still required.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Route Parameters</h2>
      <p>Select a route to inspect its parameters.</p>

      <nav aria-label="Route parameter examples">
        <ul>
          <li>
            <Link to="/users/42">Single parameter</Link>
          </li>
          <li>
            <Link to="/catalog/books/products/123">Multiple parameters</Link>
          </li>
          <li>
            <Link to="/users/42/number">String parameter</Link>
          </li>
          <li>
            <Link to="/users/invalid/validated">Validated parameter</Link>
          </li>
          <li>
            <Link to="/language">Optional parameter without value</Link>
          </li>
          <li>
            <Link to="/language/en">Optional parameter with value</Link>
          </li>
          <li>
            <Link to="/files/documents/projects/report.pdf">Splat parameter</Link>
          </li>
          <li>
            <Link to="/teams/frontend">Inherited parameter</Link>
          </li>
          <li>
            <Link to="/teams/frontend/members/7">Nested parameters</Link>
          </li>
          <li>
            <Link to="/products/123?sort=price">Path vs query parameter</Link>
          </li>
          <li>
            <Link to="/users/42/typed">Parameter typing</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const LanguagePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Language</h2>
      <OptionalRouteParameterExample />
    </main>
  );
};

const TeamLayout: FC = (): ReactElement => {
  return (
    <main>
      <h2>Team</h2>
      <InheritedRouteParameterExample />
      <NestedRouteParametersExample />
    </main>
  );
};

const RouteParametersDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/:userId" element={<SingleRouteParameterExample />} />
        <Route path="/catalog/:categoryId/products/:productId" element={<MultipleRouteParametersExample />} />
        <Route path="/users/:userId/number" element={<StringRouteParameterExample />} />
        <Route path="/users/:userId/validated" element={<ValidatedRouteParameterExample />} />
        <Route path="/language/:lang?" element={<LanguagePage />} />
        <Route path="/files/*" element={<SplatRouteParameterExample />} />
        <Route path="/files-named/*" element={<NamedSplatParameterExample />} />
        <Route path="/teams/:teamId" element={<TeamLayout />}>
          <Route path="members/:memberId" element={<NestedRouteParametersExample />} />
        </Route>
        <Route path="/products/:productId" element={<PathVsQueryParameterExample />} />
        <Route path="/users/:userId/typed" element={<ParameterTypingDoesNotConvertValueExample />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteParametersDemo;

// ---------------------------------------------------------------------
// Summary
// Dynamic segments such as `:userId` define named route parameters.
// `useParams` returns the parameter values matched by the current route.
// Route parameter values are strings because they originate from the URL.
// Multiple dynamic segments can provide multiple named parameters.
// Optional parameters use the `?` suffix and may be undefined.
// A splat `*` parameter captures the remaining portion of a path.
// Child routes inherit parameters defined by their matched parent routes.
// Route parameters are part of the pathname, while query parameters are separate URL values.
// Type annotations do not convert URL strings into numbers or other runtime types.
// Parameters should be validated before being used as application-specific values.
// ---------------------------------------------------------------------

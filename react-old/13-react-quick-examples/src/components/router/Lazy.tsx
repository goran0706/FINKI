import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Navigation = lazy(() => import("./Navigation"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Lazy loading navigation component</div>}>
        <Navigation />
      </Suspense>
    ),
  },
]);

const Lazy = () => {
  return <RouterProvider router={router} />;
};

export default Lazy;

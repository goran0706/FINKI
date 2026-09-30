/**
 * Mocking API with MSW
 * =====================
 *
 * Mock Service Worker (MSW) intercepts network requests at the network boundary and provides
 * controlled responses without replacing the application's HTTP client. This allows tests to
 * exercise the same request and response flow used by the application while controlling API behavior.
 */

import { useEffect, useState, type FC, type ReactElement } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// ---------------------------------------------------------------------
// 1. Defining an API handler
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

export const userHandler = http.get("https://api.example.com/user", () => {
  return HttpResponse.json<User>({
    id: "42",
    name: "John Doe",
  });
});

// MSW handlers describe network behavior rather than replacing `fetch`:
//
// http.get(
//     "https://api.example.com/user",
//     () => {
//         return HttpResponse.json({
//             id: "42",
//             name: "John Doe",
//         });
//     },
// );
//
// The application can continue using its normal HTTP client.

// ---------------------------------------------------------------------
// 2. Grouping handlers
// ---------------------------------------------------------------------

export const handlers = [userHandler];

// A larger application can define multiple handlers:
//
// export const handlers = [
//     userHandler,
//     usersHandler,
//     createUserHandler,
//     deleteUserHandler,
// ];
//
// Keeping handlers together provides a reusable description of the mocked API.

// ---------------------------------------------------------------------
// 3. Creating a Node.js MSW server
// ---------------------------------------------------------------------

export const server = setupServer(...handlers);

// `setupServer` integrates MSW with a Node.js process.
//
// The server does not start automatically:
//
// server.listen();
//
// Starting and stopping the server belongs to the test environment setup.

// ---------------------------------------------------------------------
// 4. Starting the server for tests
// ---------------------------------------------------------------------

// A Vitest setup file can enable the server:
//
// import {
//     afterAll,
//     afterEach,
//     beforeAll,
// } from "vitest";
//
// beforeAll(() => {
//     server.listen();
// });
//
// afterEach(() => {
//     server.resetHandlers();
// });
//
// afterAll(() => {
//     server.close();
// });
//
// `listen()` enables interception.
// `resetHandlers()` removes runtime handler overrides.
// `close()` stops the server and restores the normal network behavior.
//
// MSW's Node integration is not specific to Vitest; the same server can be
// integrated into other Node.js-based test environments.

// ---------------------------------------------------------------------
// 5. Testing a component through the network boundary
// ---------------------------------------------------------------------

export const UserProfile: FC = (): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        const response = await fetch("https://api.example.com/user");

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = (await response.json()) as User;
        setUser(data);
      } catch {
        setError("Could not load user.");
      }
    };

    void loadUser();
  }, []);

  if (error !== null) {
    return <p role="alert">{error}</p>;
  }

  if (user === null) {
    return <p>Loading...</p>;
  }

  return <p>Hello, {user.name}.</p>;
};

// The test does not need to mock `fetch` directly:
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// The component makes its normal `fetch` request.
// MSW intercepts that request and supplies the configured response.

// ---------------------------------------------------------------------
// 6. `HttpResponse.json`
// ---------------------------------------------------------------------

// `HttpResponse.json` creates a JSON response:
//
// return HttpResponse.json({
//     id: "42",
//     name: "John Doe",
// });
//
// A status can be supplied through the response options:
//
// return HttpResponse.json(
//     {
//         id: "42",
//         name: "John Doe",
//     },
//     {
//         status: 201,
//     },
// );
//
// MSW uses standard Fetch API request and response concepts.

// ---------------------------------------------------------------------
// 7. Mocking HTTP errors
// ---------------------------------------------------------------------

export const userErrorHandler = http.get("https://api.example.com/user", () => {
  return HttpResponse.json(
    {
      message: "User service unavailable.",
    },
    {
      status: 500,
    },
  );
});

// A server response with status 500 still represents an HTTP response.
// The application's `fetch` call resolves with that Response.
//
// The application must decide how `response.ok` or `response.status`
// affects its behavior.

// ---------------------------------------------------------------------
// 8. Overriding a handler for one test
// ---------------------------------------------------------------------

// `server.use` adds runtime handlers:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json(
//                 {
//                     message: "User service unavailable.",
//                 },
//                 {
//                     status: 500,
//                 },
//             );
//         },
//     ),
// );
//
// This lets one test replace the default response without changing the
// shared handler definition.

// ---------------------------------------------------------------------
// 9. Resetting runtime overrides
// ---------------------------------------------------------------------

// Runtime handlers should normally be reset after each test:
//
// afterEach(() => {
//     server.resetHandlers();
// });
//
// The original handlers passed to `setupServer` remain available.
//
// This keeps one test's network scenario from leaking into another test.

// ---------------------------------------------------------------------
// 10. Mocking a network error
// ---------------------------------------------------------------------

// A network-level failure can be represented with `HttpResponse.error()`:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.error();
//         },
//     ),
// );
//
// This is different from returning an HTTP error response such as:
//
// return HttpResponse.json(
//     {message: "Server error"},
//     {status: 500},
// );
//
// The first represents a network error.
// The second represents a completed HTTP response with an error status.

// ---------------------------------------------------------------------
// 11. Mocking loading behavior
// ---------------------------------------------------------------------

// A delayed response can model a slow API:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         async () => {
//             await delay(1000);
//
//             return HttpResponse.json({
//                 id: "42",
//                 name: "John Doe",
//             });
//         },
//     ),
// );
//
// The component can then be tested while the request is still pending.
//
// Fake timers can be used when the test needs deterministic control over
// the configured delay.

// ---------------------------------------------------------------------
// 12. Request path parameters
// ---------------------------------------------------------------------

interface UserDetails {
  readonly id: string;
  readonly name: string;
}

export const userByIdHandler = http.get("https://api.example.com/users/:userId", ({ params }) => {
  const userId = params.userId as string;

  return HttpResponse.json<UserDetails>({
    id: userId,
    name: "John Doe",
  });
});

// MSW exposes path parameters through the handler's `params` object:
//
// http.get(
//     "https://api.example.com/users/:userId",
//     ({params}) => {
//         const userId = params.userId as string;
//
//         return HttpResponse.json({
//             id: userId,
//             name: "John Doe",
//         });
//     },
// );
//
// A request to:
//
// https://api.example.com/users/42
//
// matches the handler and provides "42" as the `userId` parameter.

// ---------------------------------------------------------------------
// 13. Query parameters
// ---------------------------------------------------------------------

export const searchUsersHandler = http.get("https://api.example.com/users", ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  return HttpResponse.json<UserDetails[]>([
    {
      id: "42",
      name: query ?? "John Doe",
    },
  ]);
});

// Query parameters are read from the standard Request URL:
//
// const url = new URL(request.url);
// const query = url.searchParams.get("q");
//
// MSW does not require a separate mocking API for query strings.

// ---------------------------------------------------------------------
// 14. Request headers
// ---------------------------------------------------------------------

export const authenticatedUserHandler = http.get("https://api.example.com/profile", ({ request }) => {
  const authorization = request.headers.get("Authorization");

  if (authorization === null) {
    return HttpResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  return HttpResponse.json({
    id: "42",
    name: "John Doe",
  });
});

// Request headers are available through the standard Request object:
//
// const authorization = request.headers.get("Authorization");
//
// This allows handlers to model authentication and other header-dependent
// server behavior.

// ---------------------------------------------------------------------
// 15. Reading a JSON request body
// ---------------------------------------------------------------------

interface CreateUserRequest {
  readonly name: string;
}

export const createUserHandler = http.post("https://api.example.com/users", async ({ request }) => {
  const body = (await request.json()) as CreateUserRequest;

  return HttpResponse.json<User>(
    {
      id: "42",
      name: body.name,
    },
    {
      status: 201,
    },
  );
});

// Request bodies use the standard Fetch API Request interface:
//
// const body = await request.json();
//
// MSW does not require application code to use a special HTTP client.

// ---------------------------------------------------------------------
// 16. Testing a POST request
// ---------------------------------------------------------------------

export const CreateUser: FC = (): ReactElement => {
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  const handleCreate = async (): Promise<void> => {
    const response = await fetch("https://api.example.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "John Doe",
      }),
    });

    if (!response.ok) {
      return;
    }

    const user = (await response.json()) as User;
    setCreatedUser(user);
  };

  return (
    <>
      <button type="button" onClick={() => void handleCreate()}>
        Create user
      </button>

      {createdUser !== null && <p>Created {createdUser.name}.</p>}
    </>
  );
};

// A test can exercise the actual POST request:
//
// const user = userEvent.setup();
//
// render(<CreateUser />);
//
// await user.click(
//     screen.getByRole("button", {name: "Create user"}),
// );
//
// expect(
//     await screen.findByText("Created John Doe."),
// ).toBeInTheDocument();
//
// MSW receives the POST request and returns the configured response.

// ---------------------------------------------------------------------
// 17. Testing different API scenarios
// ---------------------------------------------------------------------

// A default handler can represent the normal response:
//
// http.get(
//     "https://api.example.com/user",
//     () => {
//         return HttpResponse.json({
//             id: "42",
//             name: "John Doe",
//         });
//     },
// );
//
// A test can override it with an error:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json(
//                 {message: "Unavailable"},
//                 {status: 503},
//             );
//         },
//     ),
// );
//
// Another test can override it with different data:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json({
//                 id: "99",
//                 name: "Jane Doe",
//             });
//         },
//     ),
// );

// ---------------------------------------------------------------------
// 18. Testing the empty state
// ---------------------------------------------------------------------

export const UserList: FC = (): ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      const response = await fetch("https://api.example.com/users");

      if (!response.ok) {
        setLoaded(true);
        return;
      }

      const data = (await response.json()) as User[];
      setUsers(data);
      setLoaded(true);
    };

    void loadUsers();
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// The empty state can be modeled without changing the component:
//
// server.use(
//     http.get(
//         "https://api.example.com/users",
//         () => {
//             return HttpResponse.json<User[]>([]);
//         },
//     ),
// );
//
// render(<UserList />);
//
// expect(
//     await screen.findByText("No users found."),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 19. Testing an unauthorized response
// ---------------------------------------------------------------------

// Authentication behavior can be represented at the network boundary:
//
// server.use(
//     http.get(
//         "https://api.example.com/profile",
//         () => {
//             return HttpResponse.json(
//                 {
//                     message: "Unauthorized",
//                 },
//                 {
//                     status: 401,
//                 },
//             );
//         },
//     ),
// );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByRole("alert"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 20. Testing a server error
// ---------------------------------------------------------------------

// A server failure can be modeled independently from the normal response:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json(
//                 {
//                     message: "Internal server error",
//                 },
//                 {
//                     status: 500,
//                 },
//             );
//         },
//     ),
// );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByRole("alert"),
// ).toHaveTextContent("Could not load user.");

// ---------------------------------------------------------------------
// 21. Testing a network failure
// ---------------------------------------------------------------------

// A network failure exercises a different branch:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.error();
//         },
//     ),
// );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByRole("alert"),
// ).toHaveTextContent("Could not load user.");
//
// This models failure before an HTTP response is successfully received.

// ---------------------------------------------------------------------
// 22. Avoiding direct request assertions
// ---------------------------------------------------------------------

// MSW's best-practice approach is to focus primarily on observable behavior:
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// The test does not need to mock `fetch` or inspect its internal calls.
//
// Request assertions are appropriate when request details themselves are
// meaningful to the behavior being tested, but they should not replace
// testing the resulting user-visible behavior.

// ---------------------------------------------------------------------
// 23. MSW versus direct fetch mocking
// ---------------------------------------------------------------------

// Direct fetch mocking:
//
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(...);
//
// replaces the HTTP client function.
//
// MSW:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => HttpResponse.json(...),
//     ),
// );
//
// intercepts the request at the network boundary.
//
// MSW therefore keeps the application unaware that the response is mocked.
// The same request can be made through `fetch`, Axios, or another supported
// HTTP client while the handler remains focused on the HTTP interaction.

// ---------------------------------------------------------------------
// 24. Reusing handlers
// ---------------------------------------------------------------------

// One set of handlers can be reused across environments:
//
// const handlers = [
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json({
//                 id: "42",
//                 name: "John Doe",
//             });
//         },
//     ),
// ];
//
// Node.js tests:
//
// const server = setupServer(...handlers);
//
// Browser development:
//
// const worker = setupWorker(...handlers);
//
// The handler describes the network behavior.
// The environment-specific integration determines how requests are intercepted.

// ---------------------------------------------------------------------
// 25. Browser integration
// ---------------------------------------------------------------------

// Browser applications use `setupWorker` from `msw/browser`:
//
// import {setupWorker} from "msw/browser";
//
// const worker = setupWorker(...handlers);
//
// await worker.start();
//
// Browser interception is performed by a Service Worker, while the same
// request handlers can be reused from Node.js tests.
//
// The worker requires the generated MSW service-worker file to be available
// at the appropriate public path in the application.

// ---------------------------------------------------------------------
// 26. Node.js integration
// ---------------------------------------------------------------------

// Node.js tests use `setupServer` from `msw/node`:
//
// import {setupServer} from "msw/node";
//
// const server = setupServer(...handlers);
//
// beforeAll(() => {
//     server.listen();
// });
//
// afterEach(() => {
//     server.resetHandlers();
// });
//
// afterAll(() => {
//     server.close();
// });
//
// This enables request interception without starting a real HTTP server.

// ---------------------------------------------------------------------
// 27. Handler lifecycle
// ---------------------------------------------------------------------

// The normal lifecycle is:
//
// beforeAll(() => server.listen());
//
// afterEach(() => server.resetHandlers());
//
// afterAll(() => server.close());
//
// `listen()` starts interception.
// `resetHandlers()` restores the initial handler set after each test.
// `close()` stops the server.

// ---------------------------------------------------------------------
// 28. Unhandled requests
// ---------------------------------------------------------------------

// MSW can be configured to determine what happens when a request does not
// match a handler:
//
// server.listen({
//     onUnhandledRequest: "error",
// });
//
// This can make missing API handlers fail tests immediately instead of
// allowing an unexpected real network request.
//
// Another option is:
//
// server.listen({
//     onUnhandledRequest: "warn",
// });
//
// The appropriate policy depends on the test environment and whether
// unmocked requests are intentionally allowed.

// ---------------------------------------------------------------------
// 29. Runtime handler composition
// ---------------------------------------------------------------------

// Runtime handlers are useful for test-specific scenarios:
//
// server.use(
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json(
//                 {
//                     id: "42",
//                     name: "John Doe",
//                 },
//             );
//         },
//     ),
// );
//
// The override is scoped to the current server instance and remains active
// until `resetHandlers()` restores the initial configuration.

// ---------------------------------------------------------------------
// 30. Network mocking without implementation replacement
// ---------------------------------------------------------------------

// The application remains ordinary production code:
//
// const response = await fetch(
//     "https://api.example.com/user",
// );
//
// No special testing branch is required.
//
// MSW supplies the response externally:
//
// http.get(
//     "https://api.example.com/user",
//     () => {
//         return HttpResponse.json({
//             id: "42",
//             name: "John Doe",
//         });
//     },
// );
//
// This separation keeps application behavior and test infrastructure distinct.

// ---------------------------------------------------------------------
// 31. Complete Vitest setup pattern
// ---------------------------------------------------------------------

// A typical Node.js MSW integration consists of three pieces:
//
// // handlers.ts
// export const handlers = [
//     http.get(
//         "https://api.example.com/user",
//         () => {
//             return HttpResponse.json({
//                 id: "42",
//                 name: "John Doe",
//             });
//         },
//     ),
// ];
//
//
// // node.ts
// export const server = setupServer(...handlers);
//
//
// // vitest.setup.ts
// beforeAll(() => server.listen());
//
// afterEach(() => server.resetHandlers());
//
// afterAll(() => server.close());
//
// Keeping these responsibilities separate makes the handlers reusable and
// keeps lifecycle management centralized.

// ---------------------------------------------------------------------
// 32. Complete scenario override
// ---------------------------------------------------------------------

// A test can override the default success response:
//
// it("handles a server failure", async () => {
//     server.use(
//         http.get(
//             "https://api.example.com/user",
//             () => {
//                 return HttpResponse.json(
//                     {
//                         message: "Service unavailable",
//                     },
//                     {
//                         status: 503,
//                     },
//                 );
//             },
//         ),
//     );
//
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByRole("alert"),
//     ).toHaveTextContent("Could not load user.");
// });
//
// The test changes the network scenario rather than changing the component
// or replacing its HTTP client.

// ---------------------------------------------------------------------
// 33. MSW and realistic integration tests
// ---------------------------------------------------------------------

// MSW is particularly useful when several layers participate in a request:
//
// Component
//     -> data hook
//     -> API client
//     -> fetch
//     -> MSW handler
//     -> mocked HTTP response
//
// The production request path remains intact until the network boundary.
// This makes the test less coupled to the implementation of the API client.

// ---------------------------------------------------------------------
// 34. What MSW does not replace
// ---------------------------------------------------------------------

// MSW does not replace the need to test:
//
// - Loading states.
// - Success states.
// - Empty states.
// - Validation behavior.
// - Error states.
// - Authentication behavior.
// - Request construction when it is part of the contract.
// - Runtime response validation.
//
// MSW controls the network scenario; the test still verifies application behavior.

// ---------------------------------------------------------------------
// 35. Complete MSW testing pattern
// ---------------------------------------------------------------------

// A focused component test can look like:
//
// it("renders the mocked user", async () => {
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByText("Hello, John Doe."),
//     ).toBeInTheDocument();
// });
//
// The default handler supplies the API response:
//
// http.get(
//     "https://api.example.com/user",
//     () => {
//         return HttpResponse.json({
//             id: "42",
//             name: "John Doe",
//         });
//     },
// );
//
// An error test can override the same endpoint:
//
// it("renders an error when the API fails", async () => {
//     server.use(
//         http.get(
//             "https://api.example.com/user",
//             () => {
//                 return HttpResponse.json(
//                     {message: "Unavailable"},
//                     {status: 503},
//                 );
//             },
//         ),
//     );
//
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByRole("alert"),
//     ).toHaveTextContent("Could not load user.");
// });
//
// This keeps the application code unchanged while testing multiple API scenarios.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - MSW intercepts requests at the network boundary instead of mocking `fetch` directly.
// - `http.get`, `http.post`, and related APIs define HTTP request handlers.
// - `HttpResponse.json` creates controlled JSON responses.
// - `setupServer` integrates handlers into Node.js-based tests.
// - `setupWorker` integrates the same handlers into browser environments.
// - `server.listen()` starts Node.js request interception.
// - `server.resetHandlers()` removes test-specific runtime overrides.
// - `server.close()` stops the Node.js interceptor.
// - `server.use()` allows individual tests to override default network behavior.
// - Path parameters, query parameters, headers, and request bodies are available through standard Request data.
// - HTTP errors such as 500 and network failures are different scenarios and should be tested separately when they produce different application behavior.
// - MSW can reuse the same network descriptions across testing, development, and other supported environments.
// - Direct fetch mocking replaces the HTTP client, while MSW intercepts the network request.
// - Prefer observable application behavior over direct request assertions unless request details are part of the contract.
// - Configure unhandled-request behavior deliberately so unexpected network calls do not silently escape the test boundary.

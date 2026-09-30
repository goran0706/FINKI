/**
 * Mocking Fetch
 * =============
 *
 * Mocking `fetch` allows tests to control network responses without making real HTTP requests.
 * Tests can therefore verify loading, success, empty, and error states deterministically while
 * keeping the component focused on how it handles the response.
 */

import { useEffect, useState, type FC, type ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// ---------------------------------------------------------------------
// 1. Why mock fetch
// ---------------------------------------------------------------------

// Tests should generally avoid making real network requests.
//
// Real requests can be:
//
// - Slow.
// - Unreliable.
// - Dependent on external services.
// - Difficult to reproduce.
// - Unsafe when they modify real data.
//
// Mocking `fetch` gives the test complete control over the response.

// ---------------------------------------------------------------------
// 2. Component that uses fetch
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

export const UserProfile: FC = (): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        const response = await fetch("/api/user");

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

// ---------------------------------------------------------------------
// 3. Mocking fetch
// ---------------------------------------------------------------------

// `fetch` returns a Promise<Response>, so the mock should resolve to a
// Response-shaped value.
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//             {
//                 status: 200,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             },
//         ),
//     );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// expect(fetchMock).toHaveBeenCalledWith("/api/user");
//
// fetchMock.mockRestore();

// ---------------------------------------------------------------------
// 4. Mocking a successful JSON response
// ---------------------------------------------------------------------

// `Response` can represent a successful JSON response:
//
// const response = new Response(
//     JSON.stringify({
//         id: "42",
//         name: "John Doe",
//     }),
//     {
//         status: 200,
//         headers: {
//             "Content-Type": "application/json",
//         },
//     },
// );
//
// vi.spyOn(globalThis, "fetch").mockResolvedValue(response);
//
// The component receives a real `Response` object while the network request
// itself is replaced by a mock.

// ---------------------------------------------------------------------
// 5. Verifying the request
// ---------------------------------------------------------------------

// A fetch mock records its arguments:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//         ),
//     );
//
// render(<UserProfile />);
//
// await screen.findByText("Hello, John Doe.");
//
// expect(fetchMock).toHaveBeenCalledTimes(1);
// expect(fetchMock).toHaveBeenCalledWith("/api/user");
//
// Testing the requested URL can be useful when the URL itself is part of
// the component's behavior.

// ---------------------------------------------------------------------
// 6. Mocking a rejected fetch
// ---------------------------------------------------------------------

// A rejected fetch models a network-level failure:
//
// vi.spyOn(globalThis, "fetch")
//     .mockRejectedValue(
//         new Error("Network unavailable"),
//     );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByRole("alert"),
// ).toHaveTextContent("Could not load user.");
//
// A rejected Promise represents failures such as a network error.
// It is different from receiving an HTTP response with a non-2xx status.

// ---------------------------------------------------------------------
// 7. HTTP errors are still resolved Responses
// ---------------------------------------------------------------------

// `fetch` does not reject its Promise merely because the server returns
// an HTTP error status.
//
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(null, {
//             status: 500,
//         }),
//     );
//
// The Promise resolves successfully with a Response whose `ok` property
// is `false`.
//
// Application code must check `response.ok` or inspect `response.status`
// when HTTP failures should be treated as errors.

// ---------------------------------------------------------------------
// 8. Testing an HTTP error
// ---------------------------------------------------------------------

// The component explicitly checks `response.ok`, so a 500 response exercises
// that branch:
//
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(null, {
//             status: 500,
//         }),
//     );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByRole("alert"),
// ).toHaveTextContent("Could not load user.");

// ---------------------------------------------------------------------
// 9. Mocking an empty response
// ---------------------------------------------------------------------

interface UserListProps {
  readonly url: string;
}

export const UserList: FC<UserListProps> = ({ url }): ReactElement => {
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      const response = await fetch(url);

      if (!response.ok) {
        setLoaded(true);
        return;
      }

      const data = (await response.json()) as User[];
      setUsers(data);
      setLoaded(true);
    };

    void loadUsers();
  }, [url]);

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

// An empty array can be returned as valid JSON:
//
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify([]),
//             {
//                 status: 200,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             },
//         ),
//     );
//
// render(<UserList url="/api/users" />);
//
// expect(
//     await screen.findByText("No users found."),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 10. Mocking multiple responses
// ---------------------------------------------------------------------

// `mockResolvedValueOnce` can provide different responses for successive
// requests:
//
// const fetchMock = vi.spyOn(globalThis, "fetch");
//
// fetchMock
//     .mockResolvedValueOnce(
//         new Response(
//             JSON.stringify({
//                 id: "1",
//                 name: "John Doe",
//             }),
//         ),
//     )
//     .mockResolvedValueOnce(
//         new Response(
//             JSON.stringify({
//                 id: "2",
//                 name: "Jane Doe",
//             }),
//         ),
//     );
//
// Each call consumes the next configured response.

// ---------------------------------------------------------------------
// 11. Mocking based on the request URL
// ---------------------------------------------------------------------

// A custom implementation can inspect the requested URL:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockImplementation(async (input) => {
//         const url = String(input);
//
//         if (url === "/api/user") {
//             return new Response(
//                 JSON.stringify({
//                     id: "42",
//                     name: "John Doe",
//                 }),
//             );
//         }
//
//         return new Response(null, {status: 404});
//     });
//
// This approach is useful when one test needs different responses for
// different endpoints.

// ---------------------------------------------------------------------
// 12. Mocking request methods
// ---------------------------------------------------------------------

interface CreateUserProps {
  readonly onCreated: (user: User) => void;
}

export const CreateUser: FC<CreateUserProps> = ({ onCreated }): ReactElement => {
  const handleCreate = async (): Promise<void> => {
    const response = await fetch("/api/users", {
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
    onCreated(user);
  };

  return (
    <button type="button" onClick={() => void handleCreate()}>
      Create user
    </button>
  );
};

// The request configuration can be inspected:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//             {status: 201},
//         ),
//     );
//
// const onCreated = vi.fn();
// const user = userEvent.setup();
//
// render(<CreateUser onCreated={onCreated} />);
//
// await user.click(
//     screen.getByRole("button", {name: "Create user"}),
// );
//
// expect(fetchMock).toHaveBeenCalledWith(
//     "/api/users",
//     {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             name: "John Doe",
//         }),
//     },
// );
//
// expect(onCreated).toHaveBeenCalledWith({
//     id: "42",
//     name: "John Doe",
// });

// ---------------------------------------------------------------------
// 13. Inspecting RequestInit
// ---------------------------------------------------------------------

// When request options are important, inspect the second argument:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//         ),
//     );
//
// render(<CreateUser onCreated={vi.fn()} />);
//
// await user.click(
//     screen.getByRole("button", {name: "Create user"}),
// );
//
// const [, options] = fetchMock.mock.calls[0];
//
// expect(options?.method).toBe("POST");
// expect(options?.headers).toEqual({
//     "Content-Type": "application/json",
// });

// ---------------------------------------------------------------------
// 14. Testing loading state
// ---------------------------------------------------------------------

// A pending Promise can keep a request unresolved:
//
// let resolveFetch!: (response: Response) => void;
//
// const pendingFetch = new Promise<Response>((resolve) => {
//     resolveFetch = resolve;
// });
//
// vi.spyOn(globalThis, "fetch")
//     .mockReturnValue(pendingFetch);
//
// render(<UserProfile />);
//
// expect(
//     screen.getByText("Loading..."),
// ).toBeInTheDocument();
//
// resolveFetch(
//     new Response(
//         JSON.stringify({
//             id: "42",
//             name: "John Doe",
//         }),
//     ),
// );
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// The test controls exactly when the network operation completes.

// ---------------------------------------------------------------------
// 15. Testing JSON parsing failures
// ---------------------------------------------------------------------

// A response can resolve successfully but contain invalid JSON:
//
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response("not valid JSON", {
//             status: 200,
//         }),
//     );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByRole("alert"),
// ).toHaveTextContent("Could not load user.");
//
// This exercises a different failure path from a rejected `fetch` Promise.

// ---------------------------------------------------------------------
// 16. Testing malformed application data
// ---------------------------------------------------------------------

// A successful HTTP response does not guarantee that the response body
// has the shape the application expects.
//
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 unexpected: true,
//             }),
//             {status: 200},
//         ),
//     );
//
// If runtime validation is part of the application, the test should verify
// that invalid data is rejected by that validation logic.
//
// TypeScript assertions such as:
//
// const data = (await response.json()) as User;
//
// do not validate data at runtime.

// ---------------------------------------------------------------------
// 17. Testing request headers
// ---------------------------------------------------------------------

// Headers are part of the request contract when the application depends on them:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//         ),
//     );
//
// // Trigger the request.
//
// const [, options] = fetchMock.mock.calls[0];
//
// expect(options?.headers).toEqual(
//     expect.objectContaining({
//         "Content-Type": "application/json",
//     }),
// );

// ---------------------------------------------------------------------
// 18. Testing query parameters
// ---------------------------------------------------------------------

interface SearchUsersProps {
  readonly query: string;
}

export const SearchUsers: FC<SearchUsersProps> = ({ query }): ReactElement => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const search = async (): Promise<void> => {
      const params = new URLSearchParams({
        q: query,
      });

      const response = await fetch(`/api/users?${params.toString()}`);

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as User[];
      setUsers(data);
    };

    void search();
  }, [query]);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// The resulting URL can be verified:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify([
//                 {
//                     id: "42",
//                     name: "John Doe",
//                 },
//             ]),
//         ),
//     );
//
// render(<SearchUsers query="John" />);
//
// await screen.findByText("John Doe");
//
// expect(fetchMock).toHaveBeenCalledWith(
//     "/api/users?q=John",
// );

// ---------------------------------------------------------------------
// 19. Restoring fetch
// ---------------------------------------------------------------------

// A spy should be restored after the test:
//
// const fetchMock = vi.spyOn(globalThis, "fetch");
//
// // Configure and use the spy.
//
// fetchMock.mockRestore();
//
// Restoring is important because `globalThis.fetch` is shared by other tests.

// ---------------------------------------------------------------------
// 20. Clearing versus restoring
// ---------------------------------------------------------------------

// `mockClear()` removes recorded calls but leaves the mocked implementation:
//
// const fetchMock = vi.spyOn(globalThis, "fetch");
//
// fetchMock.mockClear();
//
// `mockReset()` removes recorded calls and resets the mock implementation:
//
// fetchMock.mockReset();
//
// `mockRestore()` restores the original `fetch` implementation:
//
// fetchMock.mockRestore();
//
// For a global API such as `fetch`, restoring the spy is generally the
// appropriate final cleanup when the real implementation should return.

// ---------------------------------------------------------------------
// 21. Test cleanup
// ---------------------------------------------------------------------

// A suite can restore all spies after each test:
//
// afterEach(() => {
//     vi.restoreAllMocks();
// });
//
// This prevents a mocked `fetch` implementation from leaking into another test.
//
// If the suite uses a broader mock strategy, cleanup should still ensure that
// every test starts with the intended network behavior.

// ---------------------------------------------------------------------
// 22. Avoiding real network requests
// ---------------------------------------------------------------------

// A component test should not accidentally call the real service:
//
// // Bad for a unit/component test:
// render(<UserProfile />);
//
//
// // Controlled:
// vi.spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//         ),
//     );
//
// The test should explicitly control the network boundary when real HTTP
// communication is outside the behavior being tested.

// ---------------------------------------------------------------------
// 23. Mocking fetch versus mocking a service
// ---------------------------------------------------------------------

// There are two common boundaries:
//
// 1. Mock `fetch` directly.
//    Useful when testing code whose responsibility includes constructing
//    requests, interpreting HTTP responses, and handling network failures.
//
// 2. Mock an application-level service.
//    Useful when the component should only care about domain operations such
//    as `getUser()` and should not know about HTTP details.
//
// The appropriate boundary depends on what behavior the test is intended to verify.

// ---------------------------------------------------------------------
// 24. When MSW is useful
// ---------------------------------------------------------------------

// For larger integration-style tests, Mock Service Worker (MSW) can intercept
// requests at the network boundary instead of replacing `fetch` directly.
//
// This allows application code to execute its normal request layer while
// tests provide controlled server responses.
//
// A direct `fetch` mock is often simpler for a focused unit/component test.
// MSW is useful when multiple components or modules should interact through
// the same mocked HTTP boundary.

// ---------------------------------------------------------------------
// 25. Testing success and failure separately
// ---------------------------------------------------------------------

// Keep different network scenarios explicit:
//
// it("renders the user", async () => {
//     vi.spyOn(globalThis, "fetch")
//         .mockResolvedValue(
//             new Response(
//                 JSON.stringify({
//                     id: "42",
//                     name: "John Doe",
//                 }),
//             ),
//         );
//
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByText("Hello, John Doe."),
//     ).toBeInTheDocument();
// });
//
// it("renders an error", async () => {
//     vi.spyOn(globalThis, "fetch")
//         .mockRejectedValue(
//             new Error("Network unavailable"),
//         );
//
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByRole("alert"),
//     ).toHaveTextContent("Could not load user.");
// });

// ---------------------------------------------------------------------
// 26. Testing observable behavior
// ---------------------------------------------------------------------

// Prefer assertions about what the user can observe:
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// Instead of asserting implementation details such as:
//
// expect(fetchMock).toHaveBeenCalledTimes(1);
//
// unless the number of requests itself is part of the behavior being tested.
//
// Request assertions are still appropriate when URL, method, headers, body,
// or request count are meaningful parts of the contract.

// ---------------------------------------------------------------------
// 27. Complete fetch-testing pattern
// ---------------------------------------------------------------------

// A focused successful-request test can follow this structure:
//
// const fetchMock = vi
//     .spyOn(globalThis, "fetch")
//     .mockResolvedValue(
//         new Response(
//             JSON.stringify({
//                 id: "42",
//                 name: "John Doe",
//             }),
//             {
//                 status: 200,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             },
//         ),
//     );
//
// render(<UserProfile />);
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// expect(fetchMock).toHaveBeenCalledWith("/api/user");
//
// fetchMock.mockRestore();

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Mocking `fetch` prevents tests from making real network requests.
// - `vi.spyOn(globalThis, "fetch")` can replace and observe the global fetch function.
// - A resolved `Response` represents an HTTP response, including non-2xx statuses.
// - A rejected `fetch` Promise represents a network-level failure.
// - HTTP error responses do not automatically reject `fetch`; application code must check `response.ok` or `response.status`.
// - `Response` can be constructed with JSON data to create realistic test responses.
// - `mockResolvedValue` and `mockRejectedValue` control asynchronous fetch outcomes.
// - `mockResolvedValueOnce` can model different responses across successive requests.
// - Request URLs, methods, headers, and bodies can be inspected when they are part of the contract.
// - A pending Promise can be used to test loading behavior deterministically.
// - Successful HTTP responses can still fail during JSON parsing or application-level validation.
// - TypeScript assertions do not provide runtime validation of fetched data.
// - Restore mocked global APIs so network behavior does not leak between tests.
// - Direct fetch mocks are useful for focused tests; MSW can provide a broader network boundary for integration-style tests.
// - Prefer assertions about observable behavior, adding request assertions when the request itself is meaningful.

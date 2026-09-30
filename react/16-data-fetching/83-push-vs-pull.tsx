/**
 * Push vs. Pull Data Fetching
 * ===========================
 *
 * Data fetching describes how an application obtains data from an external source.
 * In a pull model, the client requests data when it needs it. In a push model,
 * the server or data source sends updates to the client when new data becomes available.
 *
 * React can consume data from traditional request-based APIs as well as
 * push-based real-time connections.
 */

import { useEffect, useState, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Pull-based data fetching
// ---------------------------------------------------------------------

// In a pull model, the client initiates the request.
//
// The typical sequence is:
//
// client -> request -> server
// client <- response <- server
//
// The server does not send data until the client asks for it.

// ---------------------------------------------------------------------
// 2. Fetching data with fetch()
// ---------------------------------------------------------------------

interface User {
  id: number;
  name: string;
}

function UserList(): ReactElement {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: User[] = await response.json();

      setUsers(data);
    }

    void loadUsers();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// fetch() is pull-based because the client explicitly requests the data.
// The server responds to that request.

// ---------------------------------------------------------------------
// 3. The pull data-fetching sequence
// ---------------------------------------------------------------------

// A request-based fetch typically follows this sequence:
//
// 1. The component starts a request.
// 2. The client sends an HTTP request.
// 3. The server processes the request.
// 4. The server sends a response.
// 5. The application receives the data.
// 6. React state is updated.
// 7. React renders using the new data.

// ---------------------------------------------------------------------
// 4. Fetching when a component mounts
// ---------------------------------------------------------------------

interface Product {
  id: number;
  name: string;
}

function ProductList(): ReactElement {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: Product[] = await response.json();

      setProducts(data);
    }

    void loadProducts();
  }, []);

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// The effect starts after the component renders.
// The empty dependency array means React does not re-run the effect
// because of state changes caused by this effect.

// ---------------------------------------------------------------------
// 5. Pulling data on demand
// ---------------------------------------------------------------------

function SearchButton(): ReactElement {
  const [users, setUsers] = useState<User[]>([]);

  async function search(): Promise<void> {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data: User[] = await response.json();

    setUsers(data);
  }

  return (
    <>
      <button onClick={() => void search()}>Load users</button>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

// The request happens when the user initiates the operation.
// The client controls when the data is requested.

// ---------------------------------------------------------------------
// 6. Polling
// ---------------------------------------------------------------------

function PollingStatus(): ReactElement {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function loadStatus(): Promise<void> {
      const response = await fetch("/api/status");

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: { status: string } = await response.json();

      setStatus(data.status);
    }

    void loadStatus();

    const intervalId = window.setInterval(() => {
      void loadStatus();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return <p>{status}</p>;
}

// Polling is still pull-based.
// The client repeatedly asks the server for the latest value.

// ---------------------------------------------------------------------
// 7. Limitations of polling
// ---------------------------------------------------------------------

// Polling can introduce unnecessary requests:
//
// Client -> request
// Server -> response
// Client -> wait
// Client -> request
// Server -> response
//
// If the data has not changed, the response may contain the same value.
//
// A shorter polling interval can reduce the time before a change is noticed,
// but it also increases the number of requests.

// ---------------------------------------------------------------------
// 8. Push-based data delivery
// ---------------------------------------------------------------------

// In a push model, the client establishes a connection or subscription,
// and the server sends updates when they become available.
//
// The conceptual flow is:
//
// client -> establish connection -> server
// server -> update
// server -> update
// server -> update
//
// The client does not need to repeatedly request each update.

// ---------------------------------------------------------------------
// 9. WebSocket example
// ---------------------------------------------------------------------

function LiveMessages(): ReactElement {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/messages");

    socket.addEventListener("message", (event) => {
      setMessages((currentMessages) => [...currentMessages, String(event.data)]);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ul>
      {messages.map((message, index) => (
        <li key={`${message}-${index}`}>{message}</li>
      ))}
    </ul>
  );
}

// After the connection is established, the server can send messages
// without the client issuing a new request for every message.

// ---------------------------------------------------------------------
// 10. Server-Sent Events
// ---------------------------------------------------------------------

function LiveStatus(): ReactElement {
  const [status, setStatus] = useState("Waiting...");

  useEffect(() => {
    const events = new EventSource("/api/status-stream");

    events.addEventListener("status", (event) => {
      if (!(event instanceof MessageEvent)) {
        return;
      }

      const data = JSON.parse(event.data) as { status: string };

      setStatus(data.status);
    });

    return () => {
      events.close();
    };
  }, []);

  return <p>{status}</p>;
}

// Server-Sent Events provide a persistent HTTP connection through which
// the server can send events to the browser.

// ---------------------------------------------------------------------
// 11. Pull vs. push
// ---------------------------------------------------------------------

// Pull:
//
// client -> request -> server
// client <- response <- server
//
// Push:
//
// client -> establish connection -> server
// client <- update <- server
// client <- update <- server
// client <- update <- server
//
// The primary difference is which side initiates each data delivery.

// ---------------------------------------------------------------------
// 12. React does not determine the transport model
// ---------------------------------------------------------------------

// React can consume data obtained through:
//
// - HTTP requests
// - polling
// - WebSockets
// - Server-Sent Events
// - other client-side data sources
//
// React's role is to render the current application state.
// The data-fetching mechanism determines how that state is updated.

// ---------------------------------------------------------------------
// 13. Pull data can be refreshed after a mutation
// ---------------------------------------------------------------------

interface CreateUserResponse {
  user: User;
}

function CreateUser(): ReactElement {
  async function createUser(): Promise<void> {
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
      throw new Error(`Request failed: ${response.status}`);
    }

    const data: CreateUserResponse = await response.json();

    console.log(data.user);
  }

  return <button onClick={() => void createUser()}>Create user</button>;
}

// A mutation can be followed by another pull request:
//
// 1. Send the mutation.
// 2. The server updates its data.
// 3. The client requests the latest collection.
// 4. React renders the refreshed data.

// ---------------------------------------------------------------------
// 14. Push data can update the UI automatically
// ---------------------------------------------------------------------

interface Notification {
  id: string;
  message: string;
}

function Notifications(): ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/notifications");

    socket.addEventListener("message", (event) => {
      const notification = JSON.parse(event.data) as Notification;

      setNotifications((currentNotifications) => [...currentNotifications, notification]);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>{notification.message}</li>
      ))}
    </ul>
  );
}

// New data can arrive without the component explicitly requesting it.
// The push connection updates React state whenever the server sends data.

// ---------------------------------------------------------------------
// 15. Push does not eliminate the initial connection
// ---------------------------------------------------------------------

// A push-based system usually requires an initial connection:
//
// 1. Client connects.
// 2. Server accepts the connection.
// 3. Server sends updates.
//
// "Push" describes how updates are delivered after the connection or
// subscription exists. It does not mean the client never communicates
// with the server.

// ---------------------------------------------------------------------
// 16. Pull and push can be combined
// ---------------------------------------------------------------------

function LiveData(): ReactElement {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    async function loadInitialData(): Promise<void> {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const initialData: User[] = await response.json();

      setData(initialData);
    }

    void loadInitialData();

    const socket = new WebSocket("wss://example.com/users");

    socket.addEventListener("message", (event) => {
      const updatedUser = JSON.parse(event.data) as User;

      setData((currentData) => currentData.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// A common architecture is:
//
// pull -> load the initial state
// push -> receive subsequent changes
//
// The initial HTTP request provides the starting data.
// The persistent connection keeps the client synchronized with later updates.

// ---------------------------------------------------------------------
// 17. Pull is often appropriate for request-response data
// ---------------------------------------------------------------------

// Pull-based fetching is often suitable when:
//
// - data is needed on demand,
// - updates are relatively infrequent,
// - the client controls when data should be refreshed,
// - a request-response API provides the required data.
//
// Examples include:
//
// - loading a product page,
// - submitting a form and reading the response,
// - loading a user profile,
// - searching for data.

// ---------------------------------------------------------------------
// 18. Push is often appropriate for real-time updates
// ---------------------------------------------------------------------

// Push-based delivery is often useful when:
//
// - updates can happen at unpredictable times,
// - clients need changes soon after they occur,
// - repeatedly polling would be inefficient,
// - the server is the natural source of update timing.
//
// Examples include:
//
// - chat messages,
// - live notifications,
// - collaborative editing,
// - live status updates,
// - real-time dashboards.

// ---------------------------------------------------------------------
// 19. Data freshness
// ---------------------------------------------------------------------

// Pull-based data can become stale between requests.
//
// 10:00 -> client fetches data
// 10:01 -> server data changes
// 10:02 -> client fetches again
//
// The client does not know about the 10:01 change until it fetches again.
//
// Push-based delivery can notify the client when the change occurs:
//
// 10:00 -> initial data
// 10:01 -> server pushes update
// 10:01 -> client updates its state

// ---------------------------------------------------------------------
// 20. Network and resource considerations
// ---------------------------------------------------------------------

// Pulling too frequently can create unnecessary network traffic:
//
// setInterval(() => {
//     void fetch("/api/status");
// }, 1000);
//
// Push connections can avoid repeated requests, but they also introduce
// connection-management concerns such as reconnecting, cleanup, and
// handling connection failures.
//
// Neither model is universally better; the appropriate choice depends
// on the application's data requirements.

// ---------------------------------------------------------------------
// 21. Cleanup matters for push connections
// ---------------------------------------------------------------------

function Connection(): ReactElement {
  useEffect(() => {
    const socket = new WebSocket("wss://example.com/data");

    socket.addEventListener("open", () => {
      console.log("Connected");
    });

    socket.addEventListener("message", (event) => {
      console.log(event.data);
    });

    return () => {
      socket.close();
    };
  }, []);

  return <p>Connected to data source.</p>;
}

// A component should clean up a persistent connection when it no longer
// needs it.
//
// Without cleanup, connections and listeners can remain active after
// the component has been removed.

// ---------------------------------------------------------------------
// 22. Error handling applies to both models
// ---------------------------------------------------------------------

// Pull:
//
// async function loadUsers(): Promise<void> {
//     try {
//         const response = await fetch("/api/users");
//
//         if (!response.ok) {
//             throw new Error("Request failed");
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }
//
// Push:
//
// socket.addEventListener("error", (event) => {
//     console.error("Connection error", event);
// });
//
// Both models require handling failures.
// Push connections additionally need to consider disconnection and
// reconnection behavior.

// ---------------------------------------------------------------------
// 23. Push vs. pull is not the same as synchronous vs. asynchronous
// ---------------------------------------------------------------------

// These concepts describe different properties.
//
// Push vs. pull:
//     Who initiates data delivery?
//
// Synchronous vs. asynchronous:
//     When does the operation complete relative to the current execution?
//
// A pull request can be asynchronous:
//
// const response = await fetch("/api/users");
//
// A push connection is also asynchronous:
//
// socket.addEventListener("message", handleMessage);
//
// Therefore, "pull" does not mean synchronous and "push" does not
// automatically mean asynchronous.

// ---------------------------------------------------------------------
// 24. React's role
// ---------------------------------------------------------------------

// React does not decide whether a data source is push-based or pull-based.
//
// The data source determines how data reaches the application.
// React renders the current application state.
//
// A simplified flow is:
//
// data source
//     |
//     v
// application state
//     |
//     v
// React render
//     |
//     v
// UI

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Pull-based fetching means the client requests data when it needs it.
// - fetch() is commonly used for pull-based HTTP requests.
// - Polling is a repeated pull-based strategy.
// - Push-based delivery means the server or data source sends updates
//   when they become available.
// - WebSockets provide a common push-based communication mechanism.
// - Server-Sent Events provide another push-based mechanism.
// - Pulling can be appropriate for on-demand and request-response data.
// - Pushing can be useful for real-time or unpredictable updates.
// - Pull-based data can become stale between requests.
// - Push-based systems can deliver changes without repeated polling.
// - Push connections still require an initial connection or setup.
// - Pull and push can be combined, such as fetching initial data and then
//   receiving subsequent updates through a WebSocket.
// - React can consume data from either model.
// - Cleanup is important for persistent push connections.
// - Error handling and reconnection strategies are important for both models.
// - Push vs. pull describes data delivery, not whether code is synchronous
//   or asynchronous.

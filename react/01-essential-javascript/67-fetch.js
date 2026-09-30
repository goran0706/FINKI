/**
 * Fetch
 * =====
 *
 * The Fetch API provides a Promise-based interface for making HTTP requests.
 * `fetch()` returns a Promise that fulfills with a Response object when the
 * request receives an HTTP response.
 */

// ---------------------------------------------------------------------
// 1. Basic fetch request
// ---------------------------------------------------------------------

fetch("/api/users");

// ---------------------------------------------------------------------
// 2. Fetch returns a Promise
// ---------------------------------------------------------------------

const responsePromise = fetch("/api/users");

responsePromise.then((response) => {
  // `response` is a Response object.
});

// ---------------------------------------------------------------------
// 3. Using fetch with async-await
// ---------------------------------------------------------------------

async function loadUsers() {
  const response = await fetch("/api/users");
  return response;
}

// ---------------------------------------------------------------------
// 4. Reading a JSON response
// ---------------------------------------------------------------------

async function getUsers() {
  const response = await fetch("/api/users");
  return await response.json(); // `response.json()` returns a Promise parsing the body as JSON.
}

// ---------------------------------------------------------------------
// 5. Reading a text response
// ---------------------------------------------------------------------

async function getMessage() {
  const response = await fetch("/api/message");
  return await response.text();
}

// ---------------------------------------------------------------------
// 6. Reading other response body formats
// ---------------------------------------------------------------------

async function getResponseData() {
  const response = await fetch("/api/data");
  return await response.blob();
}

// ---------------------------------------------------------------------
// 7. Checking the response status
// ---------------------------------------------------------------------

async function loadUser() {
  const response = await fetch("/api/user");
  if (!response.ok) {
    return null;
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 8. Response status and status text
// ---------------------------------------------------------------------

async function inspectResponse() {
  const response = await fetch("/api/users");
  return {
    status: response.status,
    statusText: response.statusText,
  };
}

// ---------------------------------------------------------------------
// 9. GET request
// ---------------------------------------------------------------------

async function getProducts() {
  const response = await fetch("/api/products"); // GET is the default method.
  return response.json();
}

// ---------------------------------------------------------------------
// 10. POST request
// ---------------------------------------------------------------------

async function createUser(user) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

// ---------------------------------------------------------------------
// 11. PUT request
// ---------------------------------------------------------------------

async function replaceUser(id, user) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

// ---------------------------------------------------------------------
// 12. PATCH request
// ---------------------------------------------------------------------

async function updateUser(id, changes) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
  return response.json();
}

// ---------------------------------------------------------------------
// 13. DELETE request
// ---------------------------------------------------------------------

async function deleteUser(id) {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  return response;
}

// ---------------------------------------------------------------------
// 14. Request headers
// ---------------------------------------------------------------------

async function loadPrivateData(token) {
  const response = await fetch("/api/private", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.json();
}

// ---------------------------------------------------------------------
// 15. Request body
// ---------------------------------------------------------------------

async function sendUser(user) {
  return fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

// ---------------------------------------------------------------------
// 16. Query parameters
// ---------------------------------------------------------------------

async function searchUsers(search, page) {
  const params = new URLSearchParams({ search, page: String(page) });
  const response = await fetch(`/api/users?${params}`);
  return response.json();
}

// ---------------------------------------------------------------------
// 17. Reading response headers
// ---------------------------------------------------------------------

async function loadData() {
  const response = await fetch("/api/data");
  const contentType = response.headers.get("Content-Type");
  return {
    contentType,
    data: await response.json(),
  };
}

// ---------------------------------------------------------------------
// 18. Request options
// ---------------------------------------------------------------------

async function makeRequest(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  return response;
}

// ---------------------------------------------------------------------
// 19. Fetching from an absolute URL
// ---------------------------------------------------------------------

async function loadExternalData() {
  const response = await fetch("https://example.com/api/data");
  return response.json();
}

// ---------------------------------------------------------------------
// 20. Handling fetch errors
// ---------------------------------------------------------------------

async function loadSettings() {
  try {
    const response = await fetch("/api/settings");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------------
// 21. Using a Request object
// ---------------------------------------------------------------------

const request = new Request("/api/users", {
  method: "GET",
  headers: { Accept: "application/json" },
});

async function loadWithRequest() {
  const response = await fetch(request);
  return response.json();
}

// ---------------------------------------------------------------------
// 22. Using fetch with data loading
// ---------------------------------------------------------------------

async function loadUserData(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load user: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `fetch()` makes HTTP requests and returns a Promise resolving to a `Response` object.
// - Response bodies are read asynchronously using methods like `json()`, `text()`, or `blob()`.
// - `response.ok` checks for successful 2xx status codes.
// - HTTP errors (like 404 or 500) do not automatically reject the fetch promise; explicit checks are needed.
// - Additional request configurations (methods, headers, bodies) are passed via the second argument.
// - Relative and absolute URLs are fully supported.

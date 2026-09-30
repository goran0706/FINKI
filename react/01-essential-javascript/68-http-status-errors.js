/**
 * HTTP Status Errors
 * ==================
 *
 * HTTP status codes describe the result of an HTTP request. The Fetch API
 * resolves its Promise for HTTP error responses, so application code must
 * explicitly decide which status codes should be treated as errors.
 */

// ---------------------------------------------------------------------
// 1. HTTP status categories
// ---------------------------------------------------------------------

// HTTP status codes fall into five categories:
// - 1xx: Informational
// - 2xx: Successful
// - 3xx: Redirection
// - 4xx: Client errors
// - 5xx: Server errors

// ---------------------------------------------------------------------
// 2. Successful responses
// ---------------------------------------------------------------------

async function loadUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 3. Checking the status code
// ---------------------------------------------------------------------

async function loadUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (response.status === 200) {
    return response.json();
  }
  throw new Error(`Unexpected status: ${response.status}`);
}

// ---------------------------------------------------------------------
// 4. Handling 404 Not Found
// ---------------------------------------------------------------------

async function findUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to load user: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 5. Handling 401 Unauthorized
// ---------------------------------------------------------------------

async function loadPrivateUser() {
  const response = await fetch("/api/me");
  if (response.status === 401) {
    throw new Error("Authentication is required");
  }
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 6. Handling 403 Forbidden
// ---------------------------------------------------------------------

async function loadAdminData() {
  const response = await fetch("/api/admin");
  if (response.status === 403) {
    throw new Error("You do not have permission to access this resource");
  }
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 7. Handling 429 Too Many Requests
// ---------------------------------------------------------------------

async function loadWithRateLimitCheck() {
  const response = await fetch("/api/data");
  if (response.status === 429) {
    throw new Error("Too many requests");
  }
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 8. Handling 500-level errors
// ---------------------------------------------------------------------

async function loadFromServer() {
  const response = await fetch("/api/data");
  if (response.status >= 500 && response.status <= 599) {
    throw new Error("The server failed to process the request");
  }
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 9. Creating an HTTP error
// ---------------------------------------------------------------------

class HttpError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.response = response;
  }
}

async function request(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new HttpError(`HTTP request failed with status ${response.status}`, response.status, response);
  }
  return response;
}

// ---------------------------------------------------------------------
// 10. Using an HTTP error
// ---------------------------------------------------------------------

async function loadData() {
  try {
    const response = await request("/api/data");
    return await response.json();
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// ---------------------------------------------------------------------
// 11. Preserving status information
// ---------------------------------------------------------------------

async function createUser(user) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new HttpError(`Failed to create user: ${response.status}`, response.status, response);
  }
  return response.json();
}

// ---------------------------------------------------------------------
// 12. Checking status ranges
// ---------------------------------------------------------------------

function isSuccessStatus(status) {
  return status >= 200 && status < 300;
}

function isClientError(status) {
  return status >= 400 && status < 500;
}

function isServerError(status) {
  return status >= 500 && status < 600;
}

// ---------------------------------------------------------------------
// 13. Handling status-specific application behavior
// ---------------------------------------------------------------------

async function getResource(url) {
  const response = await fetch(url);
  switch (response.status) {
    case 200:
      return response.json();
    case 204:
      return null;
    case 401:
      throw new HttpError("Authentication required", 401, response);
    case 403:
      throw new HttpError("Access denied", 403, response);
    case 404:
      throw new HttpError("Resource not found", 404, response);
    default:
      if (!response.ok) {
        throw new HttpError(`Unexpected HTTP status: ${response.status}`, response.status, response);
      }
      return response.json();
  }
}

// ---------------------------------------------------------------------
// 14. HTTP errors are different from network errors
// ---------------------------------------------------------------------

async function loadResource(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new HttpError(`HTTP error: ${response.status}`, response.status, response);
    }
    return await response.json();
  } catch (error) {
    // HTTP errors are thrown manually, whereas network failures cause `fetch()` to reject.
    throw error;
  }
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HTTP status codes describe the result of an HTTP request (2xx success, 4xx client, 5xx server).
// - `fetch()` resolves successfully for HTTP error codes, so application code must explicitly check `response.ok` or `response.status`.
// - Custom error classes like `HttpError` help preserve status codes and response context.
// - HTTP errors handled via status codes are distinct from lower-level network failures that cause Promise rejections.

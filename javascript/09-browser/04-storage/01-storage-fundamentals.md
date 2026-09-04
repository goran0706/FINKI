# Browser Storage Fundamentals

## Overview of Web Storage Options

Modern web browsers provide multiple mechanisms for storing data on the client side. Choosing the right storage solution
depends on data persistence requirements, capacity limits, security sensitivity, and whether the data needs to be
accessible by server-side scripts.

| Storage Mechanism    | Capacity Limit            | Persistence Lifetime                   | Accessible by Server via HTTP?                  | Primary Use Case                                                |
|:---------------------|:--------------------------|:---------------------------------------|:------------------------------------------------|:----------------------------------------------------------------|
| **`localStorage`**   | ~5MB–10MB                 | Permanent (Until explicitly cleared)   | No (Client-side only)                           | Storing user preferences, UI themes, application state          |
| **`sessionStorage`** | ~5MB–10MB                 | Tab Session (Cleared when tab closes)  | No (Client-side only)                           | Temporary form data, single-session workflow state              |
| **HTTP Cookies**     | ~4KB                      | Configurable via `Expires` / `Max-Age` | **Yes** (Sent automatically with HTTP requests) | Session identification, authentication tokens, tracking         |
| **IndexedDB**        | Varies (Large, gigabytes) | Permanent (Until explicitly cleared)   | No (Client-side only)                           | Large structured data, offline caching, complex relational data |

## LocalStorage & SessionStorage

Both `localStorage` and `sessionStorage` share the same simple key-value string API (`setItem`, `getItem`, `removeItem`,
`clear`), but differ entirely in their data lifespan.

```javascript
// Storing data
localStorage.setItem('theme', 'dark');
localStorage.setItem('userPrefs', JSON.stringify({notifications: true}));

// Retrieving and parsing data
const theme = localStorage.getItem('theme');
const prefs = JSON.parse(localStorage.getItem('userPrefs'));

// Removing specific items or clearing all
localStorage.removeItem('theme');
localStorage.clear();
```

* **`localStorage` Scope:** Data persists across browser restarts, OS reboots, and closed tabs. It is shared across all
  tabs and windows from the same origin (protocol + domain + port).
* **`sessionStorage` Scope:** Data is strictly isolated to a single browser tab. If you open a link in a new tab, a new
  session storage instance is created. Closing the tab wipes the data instantly.

## HTTP Cookies

Cookies are small pieces of data sent by the server via the `Set-Cookie` header and automatically included by the
browser in subsequent HTTP requests to the same domain.

```http
Set-Cookie: sessionId=abc123xyz; Secure; HttpOnly; SameSite=Strict; Max-Age=86400
```

### Critical Cookie Security Attributes

* **`HttpOnly`**: Prevents client-side JavaScript (via `document.cookie`) from accessing the cookie, mitigating
  Cross-Site Scripting (XSS) data theft risks.
* **`Secure`**: Ensures the cookie is only transmitted over encrypted HTTPS connections.
* **`SameSite=Strict / Lax`**: Controls whether cookies are sent with cross-site requests, protecting against Cross-Site
  Request Forgery (CSRF) attacks.
* **`Max-Age` / `Expires`**: Defines how long the cookie persists before browser deletion.

## IndexedDB

For complex web applications requiring robust offline storage, relational querying, or large blobs of data, `IndexedDB`
provides a low-level, transactional, asynchronous NoSQL database built directly into the browser.

```javascript
// Opening an IndexedDB database
const request = indexedDB.open('MyApplicationDB', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Create an object store (similar to a database table)
    if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', {keyPath: 'id'});
    }
};

request.onsuccess = (event) => {
    const db = event.target.result;
    console.log('IndexedDB opened successfully', db);
};
```

## Use Cases

* **UI Preferences & Themes:** Saving light/dark mode choices or sidebar collapse states in `localStorage`.
* **Multi-Step Form Wizards:** Storing temporary state in `sessionStorage` so users don't lose progress if they
  accidentally refresh a single tab.
* **Authentication Tokens:** Storing JWT or session tokens securely using `HttpOnly` cookies to block XSS access.
* **Offline Progressive Web Apps (PWAs):** Caching relational records, user files, or heavy application state locally
  using `IndexedDB`.

## Best Practices

* **Never Store Sensitive Credentials in LocalStorage:** Avoid saving raw passwords, sensitive API keys, or critical
  auth tokens in `localStorage` or `sessionStorage`, as any XSS vulnerability can read them instantly.
* **Use `HttpOnly` Cookies for Auth:** Store sensitive session identifiers in `HttpOnly`, `Secure`, `SameSite` cookies
  to prevent client-side script theft.
* **Always Handle Storage Quota Exceptions:** Wrap storage writes (`localStorage.setItem`) in `try...catch` blocks, as
  writing to full storage or running in private browsing modes with strict quota limits will throw exceptions.
* **Serialize Non-String Data:** Remember that `localStorage` and `sessionStorage` only store strings; always use
  `JSON.stringify()` before saving objects and `JSON.parse()` when retrieving them.
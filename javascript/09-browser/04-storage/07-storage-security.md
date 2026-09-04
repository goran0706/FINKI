# Browser Security and Storage Guide

## Overview of Browser Storage Mechanisms

Modern web browsers provide multiple mechanisms for storing data on the client side. Choosing the right storage medium
depends on data sensitivity, lifecycle requirements, capacity needs, and whether the data must be automatically
transmitted to the server.

| Storage Type       | Capacity Limit  | Lifecycle                               | Server Transmission                        | Primary Use Case                                                             |
|:-------------------|:----------------|:----------------------------------------|:-------------------------------------------|:-----------------------------------------------------------------------------|
| **LocalStorage**   | ~5MB - 10MB     | Permanent until explicitly cleared      | Never                                      | Storing non-sensitive user preferences and persistent UI state               |
| **SessionStorage** | ~5MB - 10MB     | Cleared when the tab or window closes   | Never                                      | Storing temporary form drafts or single-session UI states                    |
| **IndexedDB**      | Gigabytes       | Permanent until explicitly cleared      | Never                                      | Storing large structured objects, files, blobs, and offline application data |
| **Cookies**        | ~4KB per cookie | Configurable via `Expires` or `Max-Age` | Automatically sent with every HTTP request | Server-side session tracking and authentication tokens                       |

## LocalStorage Management

### Overview of LocalStorage

`localStorage` allows JavaScript applications to save key-value pairs persistently across browser sessions. Data stored
here persists even after the browser is closed and reopened.

### Core API Methods

```javascript
// Store data
localStorage.setItem('theme', 'dark');

// Retrieve data
const userTheme = localStorage.getItem('theme');

// Remove a specific key
localStorage.removeItem('theme');

// Clear all data for the origin
localStorage.clear();
```

### Handling Non-String Data and Quotas

Because `localStorage` only accepts string values, objects and arrays must be serialized using `JSON.stringify` and
parsed using `JSON.parse`.

```javascript
const userConfig = {notifications: true, layout: 'grid'};

// Serialize and save
localStorage.setItem('config', JSON.stringify(userConfig));

// Retrieve and parse safely
try {
    const savedConfig = JSON.parse(localStorage.getItem('config'));
} catch (error) {
    console.error('Failed to parse local storage data:', error);
}

// Quota handling
try {
    localStorage.setItem('heavy_data', JSON.stringify(largeObject));
} catch (error) {
    if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded.');
    }
}
```

## SessionStorage Management

### Overview of SessionStorage

`sessionStorage` shares the exact same API structure as `localStorage`, but its lifespan is strictly tied to the
top-level browsing context tab or window. Once the tab closes, all stored data is instantly purged.

### Core API Methods

```javascript
// Store temporary data
sessionStorage.setItem('draft_post', 'Hello world draft content');

// Retrieve temporary data
const currentDraft = sessionStorage.getItem('draft_post');

// Remove item
sessionStorage.removeItem('draft_post');
```

## IndexedDB Management

### Overview of IndexedDB

`IndexedDB` is a low-level, transactional, asynchronous NoSQL database built into web browsers. It handles massive
amounts of structured data, complex objects, and binary files without blocking the main UI thread.

### Opening a Database and Defining Schema

```javascript
const request = indexedDB.open('EnterpriseAppDB', 1);

request.onerror = (event) => {
    console.error('Database failed to open:', event.target.error);
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', {keyPath: 'id'});
        userStore.createIndex('email_idx', 'email', {unique: true});
    }
};

request.onsuccess = (event) => {
    const db = event.target.result;
    console.log('Database opened successfully.');
};
```

### Performing CRUD Operations

```javascript
async function saveUser(db, userObject) {
    try {
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        await store.put(userObject);
        console.log('User saved successfully.');
    } catch (error) {
        console.error('Error saving user:', error);
    }
}
```

## HTTP Cookies and Secure Cookie Management

### Cookie Fundamentals

HTTP cookies are small text files sent by servers via the `Set-Cookie` response header. Unlike web storage APIs, cookies
are automatically attached to outgoing HTTP requests matching the domain.

### Creating and Reading Cookies

```http
Set-Cookie: user_session=abc123xyz; Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=86400
```

```javascript
// Setting non-sensitive cookies client-side
document.cookie = "user_pref=dark_mode; max-age=31536000; path=/; SameSite=Lax";

// Reading cookies
const allCookies = document.cookie;
```

### Cookie Security Attributes

* **`HttpOnly`**: Blocks client-side JavaScript (`document.cookie`) from accessing the cookie, serving as the primary
  defense against Cross-Site Scripting (XSS) token theft.
* **`Secure`**: Enforces that cookies are only transmitted over encrypted HTTPS connections, preventing
  Man-in-the-Middle (MitM) eavesdropping.
* **`SameSite=Strict / Lax / None`**: Mitigates Cross-Site Request Forgery (CSRF) by controlling whether cookies are
  included on cross-origin requests.

## Best Practices

* **Never Store Secrets in Web Storage:** Avoid placing raw passwords, API keys, or sensitive auth tokens in
  `localStorage` or `sessionStorage`, as any injected XSS script can instantly read them.
* **Use HttpOnly Cookies for Auth Tokens:** Keep session identifiers and JWTs inside `HttpOnly`, `Secure`, and
  `SameSite` protected cookies to isolate them from client-side script execution.
* **Sanitize and Validate All Inputs:** Protect your application against XSS vulnerabilities to prevent malicious actors
  from exploiting client storage mechanisms.
* **Handle Quota Exceptions Gracefully:** Always wrap storage write actions in `try...catch` blocks to handle storage
  limits smoothly without crashing the application.
* **Keep Payloads Lightweight in Web Storage:** Use `localStorage` and `sessionStorage` exclusively for small
  configuration objects, flags, and transient states; offload large datasets to `IndexedDB`.
* **Always Serialize Structured Data:** Wrap objects and arrays consistently with `JSON.stringify()` prior to storage
  and `JSON.parse()` during retrieval with fallback catch blocks.
* **Implement Versioned Storage Keys:** Append version identifiers to keys or object stores (e.g., `app_state_v2`) to
  prevent legacy client schemas from throwing runtime parsing errors.
* **Clean Up Stale Records:** Implement periodic pruning routines to delete outdated or orphaned keys and records,
  preventing long-term storage bloat within the browser profile.
* **Guard Against Private Browsing Failures:** Handle environments where strict privacy modes or security settings throw
  exceptions or completely disable persistent storage access.
* **Avoid Main Thread Disk Blocking:** Minimize synchronous read and write calls during critical rendering paths to
  preserve smooth 60fps UI performance.
* **Validate Storage Availability:** Check for the existence and operational viability of storage objects before
  executing read or write routines in unfamiliar web environments.
* **Namespace Storage Keys:** Prefix all storage keys, object stores, and cache names with application identifiers to
  prevent key collision bugs.
* **Never Store Unencrypted PII:** Exclude sensitive user personal data from clear-text local storage, session storage,
  databases, and client-accessible cookies.
* **Test Storage Fallbacks:** Implement reliable in-memory object fallbacks when storage mechanisms throw security
  exceptions or encounter hardware storage blocks.
* **Monitor Storage Consumption Metrics:** Track storage consumption patterns using the Storage Manager API (
  `navigator.storage.estimate()`) to identify unexpected data bloat.
* **Avoid Storing Function References:** Never attempt to store functions, closures, or DOM element references in client
  storage systems, as serialization will discard them or throw cloning errors.
* **Expire Transient Caches Manually:** Attach timestamp properties or expiration logic to stored records and temporary
  cache entries to prevent stale data usage.
* **Encrypt Sensitive Persistent State:** Apply robust client-side encryption algorithms via the Web Crypto API before
  persisting semi-sensitive payloads into local stores or databases.
* **Review Storage Access Permissions:** Ensure embedded frames, third-party CDNs, and injected scripts do not inherit
  unauthorized access to origin storage spaces.
* **Keep Database Transactions Short-Lived:** Avoid performing asynchronous network fetch requests inside active
  `IndexedDB` transaction blocks to prevent automatic browser aborts.
* **Clone Response Objects Before Storing:** Explicitly call `response.clone()` when passing network responses to both
  the browser client and the Cache Storage API to avoid consumed body errors.
* **Enforce Secure Cookie Attributes:** Always pair production cookies with `Secure`, `HttpOnly`, and appropriate
  `SameSite` flags (`Lax` or `Strict`) to mitigate XSS and CSRF vectors.
* **Respect Storage Size Constraints:** Adhere strictly to client storage limits, maintaining cookie payloads under 4KB
  and keeping web storage within manageable bounds.
* **Test Quota Exhaustion Scenarios:** Simulate storage limit boundaries in automated test suites to verify that error
  recovery and fallback mechanisms trigger correctly.
* **Avoid Storing Mutable Derived State:** Restrict storage entries strictly to raw source-of-truth configuration values
  rather than cached computations that can be recalculated easily.
* **Protect Against Prototype Pollution:** Ensure JSON parsing and deserialization routines do not merge untrusted
  parsed objects directly into application state prototypes.
* **Migrate Legacy Data Formats Gracefully:** Include schema migration adapters to transform older stored object
  structures smoothly into modern formats upon application startup.
* **Disable Storage in Restricted WebViews:** Implement defensive guards to prevent runtime crashes when running inside
  constrained mobile webviews or embedded social browsers where storage is disabled.
* **Audit Storage Footprint Periodically:** Run automated code reviews, bundle inspections, and security scans to detect
  abandoned or redundant storage keys left behind by deprecated features.
* **Test Cookie and Storage Attributes in Automation:** Verify that security flags, expiration rules, and storage quotas
  are correctly validated in automated CI/CD security pipelines.
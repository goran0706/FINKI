# IndexedDB Management

## Overview of IndexedDB

`IndexedDB` is a low-level, transactional, asynchronous NoSQL database built directly into modern web browsers. Unlike
`localStorage`—which is synchronous and limited to string-based key-value pairs—`IndexedDB` can store massive amounts of
structured data, including complex JavaScript objects, files, and binary blobs, while supporting indexing and
high-performance querying.

| Feature             | `IndexedDB` Characteristic                                                      |
|:--------------------|:--------------------------------------------------------------------------------|
| **Data Format**     | Structured JavaScript objects, files, and blobs (supports arbitrary data types) |
| **Capacity Limit**  | Varies widely by browser and available disk space (typically gigabytes)         |
| **Execution Model** | Fully asynchronous (prevents UI blocking during heavy read/write operations)    |
| **Persistence**     | Permanent until explicitly cleared by user, code, or storage eviction policies  |

## Core Architecture and Concepts

Understanding `IndexedDB` requires familiarizing yourself with its core database structures:

* **Database (`IDBDatabase`):** The top-level container holding one or more object stores. Each database has a name and
  a version number.
* **Object Store (`IDBObjectStore`):** The equivalent of a table or collection in traditional databases, where records
  are stored as key-value pairs.
* **Key Path (`keyPath`):** A property within stored objects designated to act as the unique primary key (e.g., `id`).
* **Transaction (`IDBTransaction`):** An isolated, atomic wrapper around database read/write operations that ensures
  data integrity (either all changes succeed or all roll back).
* **Index (`IDBIndex`):** A secondary lookup mechanism allowing queries on properties other than the primary key.

## Opening a Database and Defining Schema (Native vs. Promise-Based)

To interact with `IndexedDB`, you open a database connection specifying a version number. Schema creation and updates *
*must** occur inside the `onupgradeneeded` event handler (or the `upgrade` callback when using promise wrappers).

### Native Opening Approach

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
    console.log('Database opened successfully:', db);
};
```

### Promise-Based Opening Approach (Using `idb` Library)

```javascript
import {openDB} from 'idb';

async function initDatabase() {
    const db = await openDB('EnterpriseAppDB', 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (!db.objectStoreNames.contains('users')) {
                const store = db.createObjectStore('users', {keyPath: 'id'});
                store.createIndex('email_idx', 'email', {unique: true});
            }
        },
    });
    return db;
}
```

## Performing CRUD Operations

You can execute database operations using either native transaction callbacks or clean async/await syntax with promise
wrappers.

### Native Transaction CRUD

```javascript
function addUserRecord(db, userData) {
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(userData);

    request.onsuccess = () => console.log('User record added successfully.');
    request.onerror = (event) => console.error('Error adding user record:', event.target.error);
}
```

### Promise-Based Async/Await CRUD

```javascript
async function saveUser(db, userObject) {
    try {
        const result = await db.put('users', userObject);
        console.log('User saved successfully with key:', result);
        return true;
    } catch (error) {
        console.error('Failed to save user:', error);
        return false;
    }
}

async function getUser(db, userId) {
    try {
        return (await db.get('users', userId)) || null;
    } catch (error) {
        console.error('Failed to retrieve user:', error);
        return null;
    }
}

async function getAllUsers(db) {
    try {
        return await db.getAll('users');
    } catch (error) {
        console.error('Failed to fetch all users:', error);
        return [];
    }
}
```

## Reading Data Using Cursors

When retrieving multiple records dynamically or performing range queries, you can use cursors or high-level methods.

```javascript
function getAllUsersCursor(db) {
    const transaction = db.transaction(['users'], 'readonly');
    const store = transaction.objectStore('users');
    const request = store.openCursor();

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            console.log(`User ID: ${cursor.key}, Data:`, cursor.value);
            cursor.continue();
        } else {
            console.log('No more records found.');
        }
    };
}
```

## Use Cases

* **Offline-First Progressive Web Apps (PWAs):** Storing full relational database tables and user records locally so
  applications function without internet connectivity.
* **Modern Component Architecture:** Integrating `IndexedDB` seamlessly into React, Vue, or Svelte via clean
  `async/await` data layers.
* **Large File & Blob Caching:** Storing heavy media assets, PDFs, or user-uploaded images locally to minimize server
  bandwidth.
* **Offline Sync Queues:** Awaiting local database writes before syncing pending offline mutations back to a remote
  cloud server.

## Best Practices

* **Use Promise-Based Wrappers:** Consider using lightweight wrapper libraries (like `idb` by Jake Archibald) or custom
  promise wrappers to maintain clean code and avoid callback hell.
* **Always Wrap Database Calls in `try...catch`:** Ensure robust error handling for unexpected storage evictions,
  constraint violations, or transaction aborts.
* **Keep Transactions Short-Lived:** Avoid performing asynchronous network requests (`fetch`) inside an active
  transaction block, or the browser will automatically abort it.
* **Handle Version Upgrades Carefully:** Never change object store schemas outside of the upgrade handler; always
  increment the database version integer when modifying stores or indexes.
* **Never Store Authentication Tokens:** Avoid storing raw JSON Web Tokens (JWTs), session identifiers, OAuth refresh
  tokens, or API keys in `IndexedDB`, as any Cross-Site Scripting (XSS) vulnerability can read them instantly.
* **Sanitize Retrieved Data:** Treat all data read from `IndexedDB` as untrusted input. Validate data structures, types,
  and schemas before passing them into core application logic or rendering them into the DOM.
* **Limit Sensitive State Persistence:** Restrict stored information strictly to non-sensitive application state caches,
  offline records, and user content blobs.
* **Handle Quota Exceptions Robustly:** Always wrap write operations in `try...catch` blocks to gracefully handle quota
  exceeded exceptions triggered when origin storage limits are reached.
* **Implement Versioned Database Schemas:** Append version identifiers or migration scripts to handle schema upgrades
  smoothly when modifying object stores or index structures across app updates.
* **Clean Up Stale Records:** Implement periodic pruning routines to delete outdated or orphaned records, preventing
  long-term storage bloat within the browser profile.
* **Guard Against Private Browsing Failures:** Handle environments where private browsing modes or strict browser
  settings throw exceptions or completely restrict persistent database access.
* **Validate Storage Availability:** Check for the existence and operational viability of `indexedDB` before attempting
  connection initialization in unfamiliar browser extensions or web views.
* **Namespace Object Store Names:** Prefix all object store names with your application or module identifiers to prevent
  naming collision bugs when multiple apps share an origin.
* **Never Store Personally Identifiable Information (PII) Unencrypted:** Exclude sensitive user data such as passwords,
  emails, or personal records from clear-text database entries unless encrypted via the Web Crypto API.
* **Test Storage Fallbacks:** Implement reliable in-memory object fallbacks when `IndexedDB` access throws security
  exceptions or encounters hardware storage blocks.
* **Monitor Storage Usage Metrics:** Track storage consumption patterns using the Storage Manager API (
  `navigator.storage.estimate()`) to identify unexpected data bloat across client sessions.
* **Avoid Storing Function References:** Never attempt to store functions, closures, or DOM element references in
  `IndexedDB`, as structured cloning algorithms will throw serialization errors.
* **Expire Transient Caches Manually:** Attach timestamp properties to stored records and validate expiration thresholds
  upon retrieval to prevent stale data usage.
* **Encrypt Sensitive Persistent State:** Apply client-side encryption algorithms via the Web Crypto API before
  persisting sensitive payloads into database records.
* **Review Storage Access Permissions:** Ensure embedded frames or third-party scripts do not inherit unauthorized
  access to origin database spaces.
* **Implement Transactional Error Rollbacks:** Handle transaction abort callbacks cleanly to ensure database integrity
  is preserved when multi-step batch writes fail partway through.
* **Optimize Index Creation:** Create indexes only on properties that require high-performance query lookups to avoid
  unnecessary disk write overhead during record insertions.
* **Handle Version Change Events:** Listen for `versionchange` events on database instances to gracefully close active
  connections when another tab initiates a database upgrade.
* **Test Storage Quota Edge Cases:** Simulate quota exhaustion limits in automated test suites to verify that fallback
  error boundaries trigger correctly.
* **Avoid Storing Mutable Derived State:** Restrict database records strictly to raw source-of-truth data models rather
  than cached computations that can be recalculated easily.
* **Protect Against Prototype Pollution:** Ensure data parsing and deserialization routines do not merge untrusted
  objects directly into application state prototypes.
* **Migrate Legacy Data Formats Gracefully:** Include schema migration adapters inside version upgrade handlers to
  transform older stored object structures smoothly into modern formats.
* **Disable Storage in Restricted WebViews:** Implement defensive guards to prevent runtime crashes when running inside
  constrained mobile webviews or embedded social browser environments where database access is disabled.
* **Audit Database Footprint Periodically:** Run automated code reviews and bundle inspections to detect abandoned or
  redundant object stores left behind by deprecated features.
* **Avoid Blocking UI Threads with Large Iterations:** Process large `IndexedDB` datasets asynchronously using cursors
  or batched queries to prevent frame drops during heavy data processing.
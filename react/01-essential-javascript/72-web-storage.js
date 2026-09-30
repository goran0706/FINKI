/**
 * Web Storage
 * ===========
 *
 * The Web Storage API provides simple key-value storage through localStorage
 * and sessionStorage. Both APIs store strings and are commonly used for
 * browser-side persistence, preferences, and short-lived session state.
 */

// ---------------------------------------------------------------------
// 1. localStorage and sessionStorage
// ---------------------------------------------------------------------

// localStorage persists data until it is explicitly removed.
// sessionStorage persists data for the lifetime of the browser tab.
localStorage.setItem("username", "john");
sessionStorage.setItem("sessionId", "abc123");

console.log(localStorage.getItem("username")); // "john"
console.log(sessionStorage.getItem("sessionId")); // "abc123"

// Both APIs expose the same Storage interface.
console.log(typeof localStorage.setItem); // "function"
console.log(typeof sessionStorage.getItem); // "function"

// ---------------------------------------------------------------------
// 2. Storing and retrieving values
// ---------------------------------------------------------------------

// setItem() stores a value under a string key.
localStorage.setItem("theme", "dark");
localStorage.setItem("language", "en");

console.log(localStorage.getItem("theme")); // "dark"
console.log(localStorage.getItem("language")); // "en"

// getItem() returns null when the key does not exist.
console.log(localStorage.getItem("missing")); // null

// ---------------------------------------------------------------------
// 3. Updating existing values
// ---------------------------------------------------------------------

// Setting an existing key replaces its previous value.
localStorage.setItem("theme", "dark");
localStorage.setItem("theme", "light");

console.log(localStorage.getItem("theme")); // "light"

// ---------------------------------------------------------------------
// 4. Removing values
// ---------------------------------------------------------------------

localStorage.setItem("username", "john");
localStorage.setItem("theme", "dark");

localStorage.removeItem("theme");

console.log(localStorage.getItem("username")); // "john"
console.log(localStorage.getItem("theme")); // null

// ---------------------------------------------------------------------
// 5. Clearing storage
// ---------------------------------------------------------------------

// clear() removes every key belonging to the current storage area.
sessionStorage.setItem("step", "1");
sessionStorage.setItem("authenticated", "true");

sessionStorage.clear();

console.log(sessionStorage.getItem("step")); // null
console.log(sessionStorage.getItem("authenticated")); // null

// ---------------------------------------------------------------------
// 6. Checking whether a key exists
// ---------------------------------------------------------------------

localStorage.setItem("theme", "dark");

console.log(localStorage.getItem("theme") !== null); // true
console.log(localStorage.getItem("fontSize") !== null); // false

// hasOwnProperty() can also be used with Storage.
// getItem() is generally clearer when checking stored values.
console.log(Object.prototype.hasOwnProperty.call(localStorage, "theme")); // true

// ---------------------------------------------------------------------
// 7. Storage is string-based
// ---------------------------------------------------------------------

// Web Storage stores strings, even when another primitive is supplied.
localStorage.setItem("age", 30);
localStorage.setItem("isActive", true);

console.log(localStorage.getItem("age")); // "30"
console.log(typeof localStorage.getItem("age")); // "string"

console.log(localStorage.getItem("isActive")); // "true"
console.log(typeof localStorage.getItem("isActive")); // "string"

// ---------------------------------------------------------------------
// 8. Converting stored values back to numbers and booleans
// ---------------------------------------------------------------------

localStorage.setItem("age", "30");
localStorage.setItem("isActive", "true");

const age = Number(localStorage.getItem("age"));
const isActive = localStorage.getItem("isActive") === "true";

console.log(age); // 30
console.log(typeof age); // "number"
console.log(isActive); // true
console.log(typeof isActive); // "boolean"

// ---------------------------------------------------------------------
// 9. Storing objects with JSON
// ---------------------------------------------------------------------

// Objects cannot be stored directly.
// JSON.stringify() converts the object into a string representation.
const user = {
  id: 1,
  name: "John",
  role: "admin",
};

localStorage.setItem("user", JSON.stringify(user));

console.log(localStorage.getItem("user"));
// '{"id":1,"name":"John","role":"admin"}'

// JSON.parse() reconstructs the object.
const storedUser = JSON.parse(localStorage.getItem("user"));

console.log(storedUser); // { id: 1, name: "John", role: "admin" }
console.log(storedUser.name); // "John"

// ---------------------------------------------------------------------
// 10. Storing arrays with JSON
// ---------------------------------------------------------------------

const favorites = ["javascript", "typescript", "react"];

localStorage.setItem("favorites", JSON.stringify(favorites));

const storedFavorites = JSON.parse(localStorage.getItem("favorites"));

console.log(storedFavorites); // ["javascript", "typescript", "react"]
console.log(storedFavorites[0]); // "javascript"

// ---------------------------------------------------------------------
// 11. Safely reading JSON data
// ---------------------------------------------------------------------

// Stored data may be missing or may contain invalid JSON.
// Parsing should therefore be handled deliberately.
const storedSettings = localStorage.getItem("settings");

let settings = null;

if (storedSettings !== null) {
  try {
    settings = JSON.parse(storedSettings);
  } catch {
    settings = null;
  }
}

console.log(settings); // null

// ---------------------------------------------------------------------
// 12. Default values
// ---------------------------------------------------------------------

// The nullish coalescing operator provides a fallback when getItem()
// returns null.
const theme = localStorage.getItem("theme") ?? "light";

console.log(theme); // "light"

// The default is only used when the key is missing.
localStorage.setItem("theme", "dark");

const currentTheme = localStorage.getItem("theme") ?? "light";

console.log(currentTheme); // "dark"

// ---------------------------------------------------------------------
// 13. Storage length
// ---------------------------------------------------------------------

localStorage.clear();

localStorage.setItem("username", "john");
localStorage.setItem("theme", "dark");
localStorage.setItem("language", "en");

console.log(localStorage.length); // 3

localStorage.removeItem("language");

console.log(localStorage.length); // 2

// ---------------------------------------------------------------------
// 14. Accessing keys by index
// ---------------------------------------------------------------------

localStorage.clear();

localStorage.setItem("username", "john");
localStorage.setItem("theme", "dark");
localStorage.setItem("language", "en");

// key(index) returns the key at a particular storage position.
console.log(localStorage.key(0)); // "username"
console.log(localStorage.key(1)); // "theme"
console.log(localStorage.key(2)); // "language"
console.log(localStorage.key(3)); // null

// Storage key order should not be used as application data.
// Use explicit keys when the order matters.

/**
 * Storage iteration is useful when inspecting or migrating stored data.
 */
for (let index = 0; index < localStorage.length; index++) {
  const key = localStorage.key(index);

  console.log(key, localStorage.getItem(key));
}

// ---------------------------------------------------------------------
// 15. Iterating over storage
// ---------------------------------------------------------------------

localStorage.clear();

localStorage.setItem("theme", "dark");
localStorage.setItem("language", "en");
localStorage.setItem("fontSize", "16");

for (const key of Object.keys(localStorage)) {
  console.log(key, localStorage.getItem(key));
}

// Object.keys() is convenient for inspecting the enumerable storage keys.
// Storage also supports direct key(index) access through its API.

// ---------------------------------------------------------------------
// 16. localStorage persistence
// ---------------------------------------------------------------------

// localStorage survives page reloads and browser restarts, subject to
// browser storage policies and the user clearing site data.
localStorage.setItem("preferredLanguage", "en");

console.log(localStorage.getItem("preferredLanguage")); // "en"

// Reloading the page does not normally remove this value.

// ---------------------------------------------------------------------
// 17. sessionStorage lifetime
// ---------------------------------------------------------------------

// sessionStorage is scoped to the current browser tab/session.
sessionStorage.setItem("checkoutStep", "payment");

console.log(sessionStorage.getItem("checkoutStep")); // "payment"

// Closing the tab normally ends that page session.
// A new tab does not automatically share the same sessionStorage.

/**
 * localStorage is appropriate for persistent preferences.
 * sessionStorage is appropriate for temporary state tied to a tab.
 */

// ---------------------------------------------------------------------
// 18. localStorage vs. sessionStorage
// ---------------------------------------------------------------------

// localStorage:
// - persists across page reloads
// - normally survives browser restarts
// - shared by same-origin documents
// - remains until explicitly removed or storage is cleared

// sessionStorage:
// - persists across page reloads
// - scoped to a page session/tab
// - is not generally shared between independent tabs
// - is removed when the page session ends

// ---------------------------------------------------------------------
// 19. Same-origin storage
// ---------------------------------------------------------------------

// Web Storage is associated with the document's origin.
// An origin is determined by the scheme, host, and port.

// https://example.com
// https://example.com
// Same origin -> same localStorage area.

// http://example.com
// Different scheme -> different origin.

// https://api.example.com
// Different host -> different origin.

// https://example.com:8443
// Different port -> different origin.

// Storage is therefore not a general cross-domain database.

// ---------------------------------------------------------------------
// 20. Web Storage events
// ---------------------------------------------------------------------

// The storage event is fired in other same-origin documents when a
// storage area is changed. It is not fired in the document that made
// the change.
window.addEventListener("storage", (event) => {
  console.log("Storage changed");
  console.log(event.key); // changed key
  console.log(event.oldValue); // previous value
  console.log(event.newValue); // new value
  console.log(event.url); // document URL that made the change
});

// A storage event is typically useful for synchronizing state between
// multiple tabs or windows.

/**
 * Example:
 *
 * Tab A:
 * localStorage.setItem("theme", "dark");
 *
 * Tab B:
 * storage event -> key: "theme", newValue: "dark"
 *
 * The event is received by Tab B, not by Tab A.
 */

// ---------------------------------------------------------------------
// 21. Removing a value and the storage event
// ---------------------------------------------------------------------

window.addEventListener("storage", (event) => {
  if (event.key === "theme" && event.newValue === null) {
    console.log("Theme was removed in another document");
  }
});

// removeItem("theme") produces a storage event in other same-origin
// documents when the stored value actually changes.

// ---------------------------------------------------------------------
// 22. React: persisting a preference
// ---------------------------------------------------------------------

// Browser storage can be used to persist simple client-side preferences.
// In React, access it from browser-side code rather than assuming that
// localStorage exists during server-side rendering.

const savedTheme = localStorage.getItem("theme") ?? "light";

console.log(savedTheme);

// ---------------------------------------------------------------------
// 23. React: storing state changes
// ---------------------------------------------------------------------

// A React component can persist a preference whenever its state changes.
//
// Example:
//
// import { useEffect, useState } from "react";
//
// function Settings() {
//   const [theme, setTheme] = useState(() => {
//     return localStorage.getItem("theme") ?? "light";
//   });
//
//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//   }, [theme]);
//
//   return (
//     <button onClick={() => setTheme("dark")}>
//       Current theme: {theme}
//     </button>
//   );
// }

// The lazy initializer avoids reading storage on every render.
// The effect persists the updated state.

// ---------------------------------------------------------------------
// 24. React and server-side rendering
// ---------------------------------------------------------------------

// localStorage and sessionStorage are browser APIs.
// They are not available during server-side rendering.

// Avoid code such as:
//
// const theme = localStorage.getItem("theme");

// when that code can execute on the server.
//
// Browser-specific access can instead be deferred until client execution:
//
// useEffect(() => {
//   const theme = localStorage.getItem("theme");
// }, []);

// Framework-specific client/server boundaries may require additional
// handling depending on the React environment.

// ---------------------------------------------------------------------
// 25. Storage availability
// ---------------------------------------------------------------------

// Access to Web Storage can fail in some browser environments or under
// restrictive privacy/security policies. Storage operations can therefore
// be wrapped when the application must tolerate unavailable storage.

function saveValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

console.log(saveValue("theme", "dark")); // true in a normal browser

// ---------------------------------------------------------------------
// 26. Quota and storage limits
// ---------------------------------------------------------------------

// Web Storage is intended for relatively small amounts of client-side
// data. It is not a replacement for a database or large file storage.

// Exceeding the available quota can cause setItem() to throw an error.
// The exact quota is browser-dependent and should not be hard-coded.

function saveLargeValue(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("Unable to save value:", error);
    return false;
  }
}

// ---------------------------------------------------------------------
// 27. Web Storage is synchronous
// ---------------------------------------------------------------------

// localStorage and sessionStorage operations are synchronous.
// Reading or writing large amounts of data can therefore block the
// main thread.

const value = localStorage.getItem("theme");

console.log(value);

// Keep Web Storage payloads small and avoid repeatedly serializing large
// objects during performance-sensitive UI work.

// ---------------------------------------------------------------------
// 28. Do not store secrets in Web Storage
// ---------------------------------------------------------------------

// Web Storage should not be treated as a secure secret store.
//
// Avoid storing:
// - passwords
// - private encryption keys
// - sensitive authentication secrets
// - highly sensitive personal data
//
// JavaScript running in the page can generally read localStorage.
// An XSS vulnerability can therefore expose values stored there.

// Example of data that should NOT be stored this way:
//
// localStorage.setItem("password", userPassword);
//
// Prefer security mechanisms appropriate to the application and threat
// model instead of treating localStorage as a secure credential vault.

// ---------------------------------------------------------------------
// 29. localStorage is not reactive
// ---------------------------------------------------------------------

// Changing localStorage does not automatically update application state.

localStorage.setItem("theme", "dark");

let themeState = "light";

console.log(themeState); // "light"

// React state, signals, or another reactive mechanism must be updated
// separately when UI state should reflect the stored value.

// ---------------------------------------------------------------------
// 30. Storage as persistence, not application state
// ---------------------------------------------------------------------

// A useful architecture is:
//
// UI state
//     ↓
// application logic
//     ↓
// persistence layer
//     ↓
// localStorage / sessionStorage

// Keep business logic independent from storage where practical.

function loadTheme() {
  return localStorage.getItem("theme") ?? "light";
}

function saveTheme(theme) {
  localStorage.setItem("theme", theme);
}

const selectedTheme = loadTheme();

console.log(selectedTheme);

saveTheme("dark");

// ---------------------------------------------------------------------
// 31. A small storage helper
// ---------------------------------------------------------------------

const storage = {
  get(key) {
    return localStorage.getItem(key);
  },

  set(key, value) {
    localStorage.setItem(key, value);
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

storage.set("language", "en");

console.log(storage.get("language")); // "en"

storage.remove("language");

console.log(storage.get("language")); // null

// ---------------------------------------------------------------------
// 32. JSON storage helper
// ---------------------------------------------------------------------

const jsonStorage = {
  get(key, fallback = null) {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

jsonStorage.set("user", {
  id: 1,
  name: "John",
});

const userFromStorage = jsonStorage.get("user");

console.log(userFromStorage); // { id: 1, name: "John" }

// ---------------------------------------------------------------------
// 33. Storage serialization limitations
// ---------------------------------------------------------------------

// JSON serialization does not preserve every JavaScript value exactly.
//
// Examples:
// - undefined properties are omitted
// - functions are omitted
// - Symbol values are omitted
// - Date values become strings
// - Map and Set require custom serialization
// - circular references cause JSON.stringify() to throw

const data = {
  name: "John",
  createdAt: new Date("2026-01-01"),
};

localStorage.setItem("data", JSON.stringify(data));

const storedData = JSON.parse(localStorage.getItem("data"));

console.log(storedData.createdAt); // "2026-01-01T00:00:00.000Z"
console.log(typeof storedData.createdAt); // "string"

// Serialization format should therefore be designed deliberately when
// storing structured application data.

// ---------------------------------------------------------------------
// 34. Key naming conventions
// ---------------------------------------------------------------------

// Use predictable, descriptive keys.
localStorage.setItem("app:theme", "dark");
localStorage.setItem("app:language", "en");
localStorage.setItem(
  "app:settings",
  JSON.stringify({
    fontSize: 16,
  }),
);

console.log(localStorage.getItem("app:theme")); // "dark"

// Namespaces such as "app:" help reduce collisions between unrelated
// features that use the same origin.

/**
 * Web Storage is intentionally simple:
 *
 *     setItem(key, value)
 *     getItem(key)
 *     removeItem(key)
 *     clear()
 *     key(index)
 *     length
 *
 * The main additional concern is serialization because every stored value
 * is represented as a string.
 */

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - localStorage persists key-value data beyond page reloads.
// - sessionStorage stores key-value data for the current page session/tab.
// - Both APIs store strings only.
// - getItem() returns null when a key does not exist.
// - setItem() replaces an existing value for the same key.
// - removeItem() deletes one key; clear() deletes all keys in that storage area.
// - JSON.stringify() and JSON.parse() are commonly used for objects and arrays.
// - Web Storage is synchronous and intended for relatively small amounts of data.
// - Storage is scoped by origin and is not a cross-domain data store.
// - The storage event can synchronize changes between same-origin documents.
// - localStorage should not be treated as a secure secret or credential store.
// - React applications should separate persistent storage from reactive UI state.
// - Browser-only APIs require care when React code can execute during SSR.
// - For larger, structured, or asynchronous client-side storage needs, consider
//   IndexedDB or an application-specific persistence layer.

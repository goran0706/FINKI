/**
 * Session Storage Token
 * =====================
 *
 * A session-storage token is an authentication credential stored as a string in
 * the browser's sessionStorage object. sessionStorage is scoped to a single
 * top-level browsing context, so a value normally remains available across
 * page reloads in the same tab but is not shared with other tabs.
 *
 * Web Storage exposes synchronous setItem, getItem, removeItem, and clear
 * operations. All stored values are strings, so token objects must be
 * serialized before storage and parsed after retrieval. The browser does not
 * automatically validate, expire, or refresh a stored authentication token.
 *
 * sessionStorage persistence and authentication validity are independent.
 * A token can remain in sessionStorage after its server-side expiration or
 * revocation. Conversely, removing the value from sessionStorage removes only
 * the browser's copy; it does not necessarily revoke the credential on the
 * server.
 *
 * A common edge case is malformed stored data. JSON.parse can throw when a
 * stored value is not valid JSON, so structured token data should be parsed
 * inside error handling. A second edge case is storage availability: browser
 * storage can fail in restricted environments or throw a DOMException when
 * storage access is unavailable.
 *
 * sessionStorage is accessible to JavaScript running in the page. Therefore,
 * storing an access token there does not protect it from malicious JavaScript
 * executing in the same origin. Avoiding unnecessary persistence and preventing
 * XSS remain important regardless of the storage mechanism.
 *
 * The examples use generic credentials and do not render the actual token
 * values. UI code can indicate whether a credential exists without exposing the
 * credential itself.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SessionStorageTokenProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

export interface SessionStorageTokenLoadProps {
  readonly storage: Storage;
  readonly storageKey: string;
  readonly initialToken: string | null;
}

export interface SessionStorageTokenClearProps {
  readonly storage: Storage;
  readonly storageKey: string;
  readonly initialToken: string | null;
}

export interface SessionStorageTokenJsonProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

export interface SessionStorageTokenAvailabilityProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates writing an access token to sessionStorage.
 *
 * sessionStorage accepts string values, so the access token is passed directly
 * to setItem. The component keeps a separate boolean to represent whether the
 * credential is currently stored without rendering the credential itself.
 */
export const SessionStorageToken: React.FC<SessionStorageTokenProps> = ({
  storage,
  storageKey,
}: SessionStorageTokenProps): React.ReactElement => {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    const token: string = "example-session-access-token";

    try {
      storage.setItem(storageKey, token);

      setHasToken(true);
      setMessage("The access token was stored in session storage.");
    } catch {
      setHasToken(false);
      setMessage("The browser rejected the session-storage write.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleStore}>
        Store Access Token
      </button>

      <p>Token stored: {hasToken ? "Yes" : "No"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates loading an existing token from sessionStorage.
 *
 * getItem returns null when the requested key does not exist. The null result
 * is handled explicitly so the component can distinguish an absent credential
 * from a stored string.
 */
export const SessionStorageTokenLoad: React.FC<SessionStorageTokenLoadProps> = ({
  storage,
  storageKey,
  initialToken,
}: SessionStorageTokenLoadProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleLoad = (): void => {
    try {
      const storedToken: string | null = storage.getItem(storageKey);

      setToken(storedToken);

      setMessage(
        storedToken === null ? "No session-storage token was found." : "The session-storage token was loaded.",
      );
    } catch {
      setToken(null);
      setMessage("The browser rejected the session-storage read.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleLoad}>
        Load Access Token
      </button>

      <p>Token available: {token !== null ? "Yes" : "No"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates removing an access token from sessionStorage.
 *
 * removeItem removes only the specified storage entry. Removing the browser's
 * copy does not itself perform server-side token revocation.
 */
export const SessionStorageTokenClear: React.FC<SessionStorageTokenClearProps> = ({
  storage,
  storageKey,
  initialToken,
}: SessionStorageTokenClearProps): React.ReactElement => {
  const [hasToken, setHasToken] = useState<boolean>(initialToken !== null);
  const [message, setMessage] = useState<string>("Token state initialized.");

  const handleClear = (): void => {
    try {
      storage.removeItem(storageKey);

      setHasToken(false);
      setMessage("The session-storage token was removed. Server-side invalidation is a separate operation.");
    } catch {
      setMessage("The browser rejected the session-storage removal.");
    }
  };

  return (
    <section>
      <p>Token believed to be stored: {hasToken ? "Yes" : "No"}</p>

      <button type="button" onClick={handleClear}>
        Remove Access Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates storing structured token metadata in sessionStorage.
 *
 * Because Web Storage stores strings, an object must be converted with
 * JSON.stringify before being stored. The resulting string is parsed with
 * JSON.parse when it is loaded, and malformed data is handled explicitly.
 */
export const SessionStorageTokenJson: React.FC<SessionStorageTokenJsonProps> = ({
  storage,
  storageKey,
}: SessionStorageTokenJsonProps): React.ReactElement => {
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    const tokenData: {
      readonly accessToken: string;
      readonly expiresIn: number;
    } = {
      accessToken: "example-session-access-token",
      expiresIn: 3600,
    };

    try {
      const serializedToken: string = JSON.stringify(tokenData);

      storage.setItem(storageKey, serializedToken);

      setExpiresIn(tokenData.expiresIn);

      setMessage("Structured token data was serialized into session storage.");
    } catch {
      setMessage("The structured token could not be stored.");
    }
  };

  const handleLoad = (): void => {
    let serializedToken: string | null = null;

    try {
      serializedToken = storage.getItem(storageKey);
    } catch {
      setExpiresIn(null);
      setMessage("The browser rejected the session-storage read.");

      return;
    }

    if (serializedToken === null) {
      setExpiresIn(null);
      setMessage("No structured token was found.");

      return;
    }

    try {
      const parsedToken: unknown = JSON.parse(serializedToken);

      if (
        typeof parsedToken !== "object" ||
        parsedToken === null ||
        !("expiresIn" in parsedToken) ||
        typeof parsedToken.expiresIn !== "number"
      ) {
        setExpiresIn(null);
        setMessage("Stored token data has an unexpected structure.");

        return;
      }

      setExpiresIn(parsedToken.expiresIn);

      setMessage("Structured token data was parsed successfully.");
    } catch {
      setExpiresIn(null);
      setMessage("Stored token data is not valid JSON.");
    }
  };

  const handleClear = (): void => {
    try {
      storage.removeItem(storageKey);

      setExpiresIn(null);
      setMessage("Structured token data was removed.");
    } catch {
      setMessage("The browser rejected the storage removal.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleStore}>
        Store Structured Token
      </button>

      <button type="button" onClick={handleLoad}>
        Load Structured Token
      </button>

      <button type="button" onClick={handleClear}>
        Clear Structured Token
      </button>

      <p>Stored expiration: {expiresIn !== null ? `${expiresIn} seconds` : "None"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates checking the storage layer separately from authentication
 * validity.
 *
 * A value existing in sessionStorage only proves that the browser has a local
 * copy. It does not prove that the server accepts the credential.
 */
export const SessionStorageTokenAvailability: React.FC<SessionStorageTokenAvailabilityProps> = ({
  storage,
  storageKey,
}: SessionStorageTokenAvailabilityProps): React.ReactElement => {
  const [hasStoredToken, setHasStoredToken] = useState<boolean>(false);
  const [serverValid, setServerValid] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    try {
      storage.setItem(storageKey, "example-session-access-token");

      setHasStoredToken(true);
      setServerValid(true);
      setMessage("An example token is now stored.");
    } catch {
      setMessage("The browser rejected the session-storage write.");
    }
  };

  const handleSimulateExpiration = (): void => {
    setServerValid(false);

    setMessage("The example server no longer accepts the stored credential.");
  };

  const handleClear = (): void => {
    try {
      storage.removeItem(storageKey);

      setHasStoredToken(false);
      setMessage("The local session-storage copy was removed.");
    } catch {
      setMessage("The browser rejected the session-storage removal.");
    }
  };

  return (
    <section>
      <p>Local token exists: {hasStoredToken ? "Yes" : "No"}</p>

      <p>Example server accepts token: {serverValid ? "Yes" : "No"}</p>

      <button type="button" onClick={handleStore}>
        Store Example Token
      </button>

      <button type="button" onClick={handleSimulateExpiration}>
        Simulate Server Expiration
      </button>

      <button type="button" onClick={handleClear}>
        Clear Session Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const sessionStorageKey: string = "example-session-access-token";

export const SessionStorageTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Session Storage Token</h1>

      <h2>1. Store an Access Token in Session Storage</h2>
      <SessionStorageToken storage={window.sessionStorage} storageKey={sessionStorageKey} />

      <h2>2. Load an Existing Token From Session Storage</h2>
      <SessionStorageTokenLoad storage={window.sessionStorage} storageKey={sessionStorageKey} initialToken={null} />

      <h2>3. Remove a Token From Session Storage</h2>
      <SessionStorageTokenClear storage={window.sessionStorage} storageKey={sessionStorageKey} initialToken={null} />

      <h2>4. Serialize Structured Token Data for Session Storage</h2>
      <SessionStorageTokenJson storage={window.sessionStorage} storageKey={`${sessionStorageKey}-json`} />

      <h2>5. Separate Storage Presence From Server-Side Validity</h2>
      <SessionStorageTokenAvailability storage={window.sessionStorage} storageKey={`${sessionStorageKey}-validity`} />
    </main>
  );
};

export default SessionStorageTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - sessionStorage stores string values associated with the current browser tab.
// - A session-storage token can survive page reloads within the same tab.
// - sessionStorage is distinct from localStorage because its lifetime is tied to the browsing session.
// - Web Storage APIs return null when a requested key does not exist.
// - Structured token data must be serialized before storage and parsed after retrieval.
// - JSON.parse can throw when stored data is malformed and should be handled explicitly.
// - Removing a session-storage token removes the browser's copy but does not automatically revoke the server-side credential.
// - Storage presence does not prove that the server still accepts the credential.
// - sessionStorage is accessible to JavaScript and therefore does not eliminate XSS-related credential exposure.
// - Token storage, token validity, expiration, and server-side revocation are separate concerns.

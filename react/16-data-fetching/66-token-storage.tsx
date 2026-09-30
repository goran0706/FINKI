/**
 * Token Storage
 * =============
 *
 * Token storage is the mechanism used by a client application to retain
 * authentication credentials between operations. Common browser mechanisms
 * include in-memory state, sessionStorage, localStorage, and cookies. Each
 * mechanism has different lifetime, accessibility, and security properties.
 *
 * In-memory storage exists only while the JavaScript application remains
 * running. sessionStorage is scoped to a browser tab and normally survives
 * reloads within that tab. localStorage persists across browser sessions until
 * the stored entry is removed. Cookies are managed by the browser and can be
 * configured with attributes such as HttpOnly, Secure, SameSite, Path, and
 * expiration.
 *
 * Web Storage stores string values. Objects must therefore be serialized before
 * storage and parsed after retrieval. JSON.parse can throw when stored data is
 * malformed, so production code should handle parsing failures instead of
 * assuming the stored value is valid.
 *
 * A common misconception is that localStorage or sessionStorage automatically
 * provides secure token storage. They are accessible to JavaScript running in
 * the page, so an XSS vulnerability can potentially expose credentials stored
 * there. HttpOnly cookies are not readable by JavaScript, which changes the
 * browser threat model, although cookie-based authentication introduces
 * additional considerations such as CSRF protection and SameSite configuration.
 *
 * Storage persistence is also different from token validity. A token remaining
 * in localStorage does not mean that the server still considers the credential
 * valid. Expiration, revocation, logout, and server-side session state remain
 * authoritative.
 *
 * This example demonstrates storage mechanics with example credentials only.
 * Real applications should choose a storage strategy based on their
 * authentication architecture and threat model rather than treating one
 * browser storage mechanism as universally safe.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TokenStorageMemoryProps {
  readonly initialToken: string | null;
}

export interface TokenStorageSessionProps {
  readonly storage: Storage;
  readonly storageKey: string;
  readonly initialToken: string | null;
}

export interface TokenStorageLocalProps {
  readonly storage: Storage;
  readonly storageKey: string;
  readonly initialToken: string | null;
}

export interface TokenStorageJsonProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

export interface TokenStorageComparisonProps {
  readonly initialToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates in-memory token storage.
 *
 * The token exists only in React state while the component is mounted. It is
 * not persisted to browser storage and therefore disappears when the component
 * state is lost.
 */
export const TokenStorageMemory: React.FC<TokenStorageMemoryProps> = ({
  initialToken,
}: TokenStorageMemoryProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    setToken("example-memory-token");

    setMessage("The token is stored in memory.");
  };

  const handleClear = (): void => {
    setToken(null);

    setMessage("The in-memory token was removed.");
  };

  return (
    <section>
      <button type="button" onClick={handleStore}>
        Store In Memory
      </button>

      <button type="button" onClick={handleClear}>
        Clear Memory
      </button>

      <p>Token available: {token !== null ? "Yes" : "No"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates sessionStorage token persistence.
 *
 * sessionStorage stores string values associated with the current browser tab.
 * The value can survive a page reload in that tab, but it is normally cleared
 * when the tab or its browsing session ends.
 */
export const TokenStorageSession: React.FC<TokenStorageSessionProps> = ({
  storage,
  storageKey,
  initialToken,
}: TokenStorageSessionProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    const value: string = "example-session-token";

    storage.setItem(storageKey, value);

    setToken(value);
    setMessage("The token was written to session storage.");
  };

  const handleLoad = (): void => {
    const storedToken: string | null = storage.getItem(storageKey);

    setToken(storedToken);

    setMessage(
      storedToken === null ? "No token was found in session storage." : "The token was loaded from session storage.",
    );
  };

  const handleClear = (): void => {
    storage.removeItem(storageKey);

    setToken(null);
    setMessage("The session-storage token was removed.");
  };

  return (
    <section>
      <button type="button" onClick={handleStore}>
        Store In Session Storage
      </button>

      <button type="button" onClick={handleLoad}>
        Load From Session Storage
      </button>

      <button type="button" onClick={handleClear}>
        Clear Session Storage
      </button>

      <p>Token available: {token !== null ? "Yes" : "No"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates localStorage token persistence.
 *
 * localStorage persists string values beyond a page reload and normally across
 * browser sessions. Removing the item is therefore important when application
 * authentication is explicitly cleared.
 */
export const TokenStorageLocal: React.FC<TokenStorageLocalProps> = ({
  storage,
  storageKey,
  initialToken,
}: TokenStorageLocalProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    const value: string = "example-local-token";

    storage.setItem(storageKey, value);

    setToken(value);
    setMessage("The token was written to local storage.");
  };

  const handleLoad = (): void => {
    const storedToken: string | null = storage.getItem(storageKey);

    setToken(storedToken);

    setMessage(
      storedToken === null ? "No token was found in local storage." : "The token was loaded from local storage.",
    );
  };

  const handleClear = (): void => {
    storage.removeItem(storageKey);

    setToken(null);
    setMessage("The local-storage token was removed.");
  };

  return (
    <section>
      <button type="button" onClick={handleStore}>
        Store In Local Storage
      </button>

      <button type="button" onClick={handleLoad}>
        Load From Local Storage
      </button>

      <button type="button" onClick={handleClear}>
        Clear Local Storage
      </button>

      <p>Token available: {token !== null ? "Yes" : "No"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates serialization and parsing when storing structured token data.
 *
 * Web Storage accepts strings only, so structured values require
 * JSON.stringify before storage and JSON.parse after retrieval. Invalid JSON
 * is handled explicitly so corrupted storage does not crash the component.
 */
export const TokenStorageJson: React.FC<TokenStorageJsonProps> = ({
  storage,
  storageKey,
}: TokenStorageJsonProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const handleStore = (): void => {
    const tokenData: {
      readonly accessToken: string;
      readonly expiresIn: number;
    } = {
      accessToken: "example-structured-token",
      expiresIn: 3600,
    };

    const serialized: string = JSON.stringify(tokenData);

    storage.setItem(storageKey, serialized);

    setExpiresIn(tokenData.expiresIn);

    setMessage("Structured token data was serialized and stored.");
  };

  const handleLoad = (): void => {
    const serialized: string | null = storage.getItem(storageKey);

    if (serialized === null) {
      setExpiresIn(null);
      setMessage("No structured token data was found.");

      return;
    }

    try {
      const parsed: unknown = JSON.parse(serialized);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("expiresIn" in parsed) ||
        typeof parsed.expiresIn !== "number"
      ) {
        setExpiresIn(null);
        setMessage("Stored token data has an unexpected shape.");

        return;
      }

      setExpiresIn(parsed.expiresIn);

      setMessage("Structured token data was parsed successfully.");
    } catch {
      setExpiresIn(null);
      setMessage("Stored token data was not valid JSON.");
    }
  };

  const handleClear = (): void => {
    storage.removeItem(storageKey);

    setExpiresIn(null);
    setMessage("Structured token data was removed.");
  };

  return (
    <section>
      <button type="button" onClick={handleStore}>
        Store Structured Token
      </button>

      <button type="button" onClick={handleLoad}>
        Parse Stored Token
      </button>

      <button type="button" onClick={handleClear}>
        Clear Structured Token
      </button>

      <p>Stored expiration value: {expiresIn !== null ? `${expiresIn} seconds` : "None"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between storage persistence and authentication
 * validity.
 *
 * A stored value can still exist after the server has expired or revoked the
 * associated credential. Storage presence alone therefore cannot establish
 * that a request is authenticated.
 */
export const TokenStorageComparison: React.FC<TokenStorageComparisonProps> = ({
  initialToken,
}: TokenStorageComparisonProps): React.ReactElement => {
  const [stored, setStored] = useState<boolean>(initialToken !== null);
  const [serverValid, setServerValid] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Ready.");

  const handleRevoke = (): void => {
    setServerValid(false);

    setMessage("The example server-side credential state is now invalid.");
  };

  const handleRemove = (): void => {
    setStored(false);

    setMessage("The client-side stored value was removed.");
  };

  const handleReset = (): void => {
    setStored(true);
    setServerValid(true);

    setMessage("The example storage and server state were reset.");
  };

  return (
    <section>
      <p>Client storage contains a token: {stored ? "Yes" : "No"}</p>

      <p>Example server considers token valid: {serverValid ? "Yes" : "No"}</p>

      <button type="button" onClick={handleRevoke}>
        Simulate Server Revocation
      </button>

      <button type="button" onClick={handleRemove}>
        Remove Stored Token
      </button>

      <button type="button" onClick={handleReset}>
        Reset Example State
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleStorageKey: string = "example-access-token";

const exampleInitialToken: string = "example-access-token";

export const TokenStorageDemo: React.FC = (): React.ReactElement => {
  const browserStorage: Storage = window.localStorage;

  return (
    <main>
      <h1>Token Storage</h1>

      <h2>1. Store a Token Only in Application Memory</h2>
      <TokenStorageMemory initialToken={null} />

      <h2>2. Store a Token in Session Storage</h2>
      <TokenStorageSession
        storage={window.sessionStorage}
        storageKey={`${exampleStorageKey}-session`}
        initialToken={null}
      />

      <h2>3. Store a Token in Local Storage</h2>
      <TokenStorageLocal storage={browserStorage} storageKey={`${exampleStorageKey}-local`} initialToken={null} />

      <h2>4. Serialize and Parse Structured Token Data</h2>
      <TokenStorageJson storage={browserStorage} storageKey={`${exampleStorageKey}-json`} />

      <h2>5. Distinguish Storage Persistence From Token Validity</h2>
      <TokenStorageComparison initialToken={exampleInitialToken} />
    </main>
  );
};

export default TokenStorageDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - In-memory state does not persist a token across loss of the application state.
// - sessionStorage persists string values for the current browser tab and browsing session.
// - localStorage persists string values across page reloads and browser sessions until removed.
// - Web Storage stores strings, so structured token data must be serialized and parsed.
// - JSON parsing can fail when stored data is malformed and should be handled explicitly.
// - Storage presence does not prove that a server still considers a token valid.
// - localStorage and sessionStorage are accessible to JavaScript and therefore require careful XSS considerations.
// - HttpOnly cookies are not readable by JavaScript and have a different security and authentication model.
// - Token storage strategy should be selected according to the application's authentication architecture and threat model.

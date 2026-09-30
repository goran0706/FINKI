/**
 * Local Storage Token
 * ===================
 *
 * A local-storage token is an authentication credential stored as a string in
 * the browser's localStorage object. localStorage is associated with the
 * document's origin and normally persists across page reloads and browser
 * restarts until the entry is explicitly removed or browser-managed storage is
 * cleared.
 *
 * Web Storage exposes synchronous setItem, getItem, removeItem, and clear
 * operations. Because Web Storage stores strings, structured token metadata
 * must be serialized before storage and parsed after retrieval. JSON.parse can
 * throw for malformed values, so persisted data must be treated as untrusted
 * input.
 *
 * localStorage persistence is independent from authentication validity. A
 * credential can remain in localStorage after the server has expired or revoked
 * it. Conversely, removing the localStorage value removes only the browser's
 * copy and does not automatically invalidate a credential on the server.
 *
 * localStorage is accessible to JavaScript executing in the same origin. An
 * XSS vulnerability can therefore potentially expose tokens stored there.
 * Persistent browser storage should not be considered a security boundary, and
 * applications should choose an authentication architecture according to their
 * threat model.
 *
 * A common edge case is storage failure. Browser storage access can throw a
 * DOMException in restricted environments or when storage is unavailable.
 * Storage operations should therefore be isolated behind error handling when
 * application behavior depends on them succeeding.
 *
 * Another common misconception is that a stored token remains authenticated
 * merely because it can still be retrieved. Token expiration, revocation, and
 * server-side session state remain authoritative.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LocalStorageTokenProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

export interface LocalStorageTokenLoadProps {
  readonly storage: Storage;
  readonly storageKey: string;
  readonly initialToken: string | null;
}

export interface LocalStorageTokenClearProps {
  readonly storage: Storage;
  readonly storageKey: string;
  readonly initialToken: string | null;
}

export interface LocalStorageTokenJsonProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

export interface LocalStorageTokenValidityProps {
  readonly storage: Storage;
  readonly storageKey: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates writing an access token to localStorage.
 *
 * The credential is converted to a string before being passed to setItem.
 * The component tracks only whether a token exists so that the credential itself
 * is not rendered into the page.
 */
export const LocalStorageToken: React.FC<LocalStorageTokenProps> = ({
  storage,
  storageKey,
}: LocalStorageTokenProps): React.ReactElement => {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    const token: string = "example-local-access-token";

    try {
      storage.setItem(storageKey, token);

      setHasToken(true);
      setMessage("The access token was stored in local storage.");
    } catch {
      setHasToken(false);
      setMessage("The browser rejected the local-storage write.");
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
 * Demonstrates retrieving an access token from localStorage.
 *
 * getItem returns either the stored string or null when the key does not exist.
 * The component handles both cases without displaying the credential value.
 */
export const LocalStorageTokenLoad: React.FC<LocalStorageTokenLoadProps> = ({
  storage,
  storageKey,
  initialToken,
}: LocalStorageTokenLoadProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleLoad = (): void => {
    try {
      const storedToken: string | null = storage.getItem(storageKey);

      setToken(storedToken);

      setMessage(storedToken === null ? "No local-storage token was found." : "The local-storage token was loaded.");
    } catch {
      setToken(null);
      setMessage("The browser rejected the local-storage read.");
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
 * Demonstrates removing an access token from localStorage.
 *
 * removeItem affects only the specified browser storage entry. It does not
 * perform server-side logout or credential revocation.
 */
export const LocalStorageTokenClear: React.FC<LocalStorageTokenClearProps> = ({
  storage,
  storageKey,
  initialToken,
}: LocalStorageTokenClearProps): React.ReactElement => {
  const [hasToken, setHasToken] = useState<boolean>(initialToken !== null);
  const [message, setMessage] = useState<string>("Token state initialized.");

  const handleClear = (): void => {
    try {
      storage.removeItem(storageKey);

      setHasToken(false);
      setMessage("The local-storage token was removed. Server-side invalidation is a separate operation.");
    } catch {
      setMessage("The browser rejected the local-storage removal.");
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
 * Demonstrates JSON serialization for structured token data.
 *
 * Web Storage cannot directly store an object. JSON.stringify converts the
 * object to a string, while JSON.parse reconstructs a JavaScript value during
 * retrieval. The parsed value is validated before its fields are used.
 */
export const LocalStorageTokenJson: React.FC<LocalStorageTokenJsonProps> = ({
  storage,
  storageKey,
}: LocalStorageTokenJsonProps): React.ReactElement => {
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    const tokenData: {
      readonly accessToken: string;
      readonly expiresIn: number;
    } = {
      accessToken: "example-local-access-token",
      expiresIn: 3600,
    };

    try {
      const serializedToken: string = JSON.stringify(tokenData);

      storage.setItem(storageKey, serializedToken);

      setExpiresIn(tokenData.expiresIn);
      setMessage("Structured token data was serialized into local storage.");
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
      setMessage("The browser rejected the local-storage read.");

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
 * Demonstrates that localStorage persistence does not establish token validity.
 *
 * The example intentionally maintains separate client-storage and server-validity
 * states. These states can diverge when a server expires or revokes a credential
 * while the browser still contains its local copy.
 */
export const LocalStorageTokenValidity: React.FC<LocalStorageTokenValidityProps> = ({
  storage,
  storageKey,
}: LocalStorageTokenValidityProps): React.ReactElement => {
  const [hasStoredToken, setHasStoredToken] = useState<boolean>(false);
  const [serverValid, setServerValid] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    try {
      storage.setItem(storageKey, "example-local-access-token");

      setHasStoredToken(true);
      setServerValid(true);
      setMessage("An example token is now stored.");
    } catch {
      setMessage("The browser rejected the local-storage write.");
    }
  };

  const handleExpireServerToken = (): void => {
    setServerValid(false);

    setMessage("The example server no longer accepts the stored credential.");
  };

  const handleClear = (): void => {
    try {
      storage.removeItem(storageKey);

      setHasStoredToken(false);
      setMessage("The local-storage copy was removed.");
    } catch {
      setMessage("The browser rejected the local-storage removal.");
    }
  };

  return (
    <section>
      <p>Local token exists: {hasStoredToken ? "Yes" : "No"}</p>

      <p>Example server accepts token: {serverValid ? "Yes" : "No"}</p>

      <button type="button" onClick={handleStore}>
        Store Example Token
      </button>

      <button type="button" onClick={handleExpireServerToken}>
        Simulate Server Expiration
      </button>

      <button type="button" onClick={handleClear}>
        Clear Local Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const localStorageKey: string = "example-local-access-token";

export const LocalStorageTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Local Storage Token</h1>

      <h2>1. Store an Access Token in Local Storage</h2>
      <LocalStorageToken storage={window.localStorage} storageKey={localStorageKey} />

      <h2>2. Load an Existing Token From Local Storage</h2>
      <LocalStorageTokenLoad storage={window.localStorage} storageKey={localStorageKey} initialToken={null} />

      <h2>3. Remove a Token From Local Storage</h2>
      <LocalStorageTokenClear storage={window.localStorage} storageKey={localStorageKey} initialToken={null} />

      <h2>4. Serialize Structured Token Data for Local Storage</h2>
      <LocalStorageTokenJson storage={window.localStorage} storageKey={`${localStorageKey}-json`} />

      <h2>5. Separate Storage Persistence From Token Validity</h2>
      <LocalStorageTokenValidity storage={window.localStorage} storageKey={`${localStorageKey}-validity`} />
    </main>
  );
};

export default LocalStorageTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - localStorage stores string values associated with the document's origin.
// - A local-storage token normally survives page reloads and browser restarts until it is removed.
// - Web Storage operations can throw when browser storage is unavailable or restricted.
// - getItem returns null when the requested storage key does not exist.
// - Structured token data must be serialized before storage and parsed after retrieval.
// - Parsed persisted data should be validated before application code relies on its fields.
// - Removing a local-storage token removes the browser's copy but does not automatically revoke the server-side credential.
// - A token remaining in localStorage does not prove that the server still considers it valid.
// - localStorage is accessible to JavaScript and can expose stored credentials if malicious JavaScript executes in the same origin.
// - Token persistence, token validity, expiration, and server-side revocation are separate concerns.

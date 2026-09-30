/**
 * In-Memory Token
 * ===============
 *
 * An in-memory token is an authentication credential held only by the running
 * JavaScript application, typically in React state, a context store, or another
 * runtime data structure. Unlike browser persistence mechanisms, the token is
 * not intentionally written to localStorage, sessionStorage, IndexedDB, or a
 * cookie by the storage layer demonstrated here.
 *
 * React state keeps the token in the component's current runtime state. Updating
 * that state schedules a render, and the new token becomes available to code
 * that reads the current state. When the component is unmounted, its state is
 * discarded. A full page reload also creates a new JavaScript runtime, so the
 * previous in-memory value is normally lost.
 *
 * An important property of in-memory storage is that token persistence and token
 * lifetime are separate concerns. A token can remain in memory while it is
 * still valid, but the server can independently expire or revoke it. Likewise,
 * clearing the React state removes the application's copy without necessarily
 * invalidating the credential on the server.
 *
 * A common use case is keeping a short-lived access token in memory while using
 * another authentication mechanism to obtain a new token after a page reload.
 * The exact architecture depends on the authentication system and its security
 * requirements.
 *
 * A common edge case is stale state captured by asynchronous work. An async
 * callback can retain a value from the render in which it was created. When
 * code needs the latest token during an asynchronous operation, a ref can
 * provide a mutable reference to the current value while React state continues
 * to drive the UI.
 *
 * In-memory storage is not automatically immune to JavaScript-based attacks.
 * Code executing in the same page context can potentially access credentials
 * held in JavaScript memory. Avoiding persistent browser storage can reduce
 * persistence exposure, but it does not eliminate the need for XSS protection
 * and careful credential handling.
 */

import React, { useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface InMemoryTokenProps {
  readonly initialToken: string | null;
}

export interface InMemoryTokenUpdateProps {
  readonly initialToken: string | null;
}

export interface InMemoryTokenClearProps {
  readonly initialToken: string | null;
}

export interface InMemoryTokenLatestValueProps {
  readonly initialToken: string | null;
}

export interface InMemoryTokenExpirationProps {
  readonly initialToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates storing an access token exclusively in React state.
 *
 * The token exists in the component's JavaScript memory and is discarded when
 * the component state is lost. The token is not persisted by this component.
 */
export const InMemoryToken: React.FC<InMemoryTokenProps> = ({
  initialToken,
}: InMemoryTokenProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleStore = (): void => {
    setToken("example-in-memory-access-token");

    setMessage("The access token is now held in React memory.");
  };

  const handleClear = (): void => {
    setToken(null);

    setMessage("The in-memory access token was cleared.");
  };

  return (
    <section>
      <p>Token available: {token !== null ? "Yes" : "No"}</p>

      <button type="button" onClick={handleStore}>
        Store Token
      </button>

      <button type="button" onClick={handleClear}>
        Clear Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates replacing an in-memory access token.
 *
 * React state replacement causes consumers of the state to receive the new
 * credential on subsequent renders. The previous string is no longer retained
 * by this state variable after the replacement.
 */
export const InMemoryTokenUpdate: React.FC<InMemoryTokenUpdateProps> = ({
  initialToken,
}: InMemoryTokenUpdateProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  const handleReplace = (): void => {
    const replacementToken: string = "example-replacement-access-token";

    setToken(replacementToken);

    setMessage("The in-memory access token was replaced.");
  };

  return (
    <section>
      <p>Current token available: {token !== null ? "Yes" : "No"}</p>

      <button type="button" onClick={handleReplace}>
        Replace Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates explicitly clearing an in-memory token during logout.
 *
 * Clearing client-side state removes the application's copy of the credential.
 * It does not by itself notify the server or invalidate a credential that the
 * server has already issued.
 */
export const InMemoryTokenClear: React.FC<InMemoryTokenClearProps> = ({
  initialToken,
}: InMemoryTokenClearProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Authenticated.");

  const handleLogout = (): void => {
    setToken(null);

    setMessage(
      "The local in-memory credential was cleared. Server-side invalidation requires a separate authentication operation.",
    );
  };

  return (
    <section>
      <p>Local token present: {token !== null ? "Yes" : "No"}</p>

      <button type="button" onClick={handleLogout}>
        Clear In-Memory Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates keeping a ref synchronized with the current in-memory token.
 *
 * React state is useful for rendering, while a ref can expose the latest token
 * to asynchronous callbacks without requiring those callbacks to be recreated
 * solely because the token changed.
 */
export const InMemoryTokenLatestValue: React.FC<InMemoryTokenLatestValueProps> = ({
  initialToken,
}: InMemoryTokenLatestValueProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const tokenRef = useRef<string | null>(initialToken);
  const [message, setMessage] = useState<string>("Ready.");

  tokenRef.current = token;

  const handleReplace = (): void => {
    const replacementToken: string = "example-latest-access-token";

    setToken(replacementToken);

    setMessage("The current token was replaced and synchronized with the ref.");
  };

  const handleReadLatest = (): void => {
    const latestToken: string | null = tokenRef.current;

    setMessage(
      latestToken === null ? "No token is currently available." : "The ref contains the current in-memory token.",
    );
  };

  return (
    <section>
      <button type="button" onClick={handleReplace}>
        Replace Token
      </button>

      <button type="button" onClick={handleReadLatest}>
        Read Latest Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that in-memory persistence does not determine token validity.
 *
 * The component keeps a token in memory while separately representing whether
 * an example server considers that credential valid. These states can diverge:
 * a token can remain in memory after server-side expiration or revocation.
 */
export const InMemoryTokenExpiration: React.FC<InMemoryTokenExpirationProps> = ({
  initialToken,
}: InMemoryTokenExpirationProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [serverValid, setServerValid] = useState<boolean>(initialToken !== null);
  const [message, setMessage] = useState<string>("Ready.");

  const handleExpireServerToken = (): void => {
    setServerValid(false);

    setMessage("The example server-side token validity is now expired.");
  };

  const handleClearMemory = (): void => {
    setToken(null);

    setMessage("The local in-memory copy was cleared.");
  };

  const handleRestore = (): void => {
    const restoredToken: string = "example-restored-access-token";

    setToken(restoredToken);
    setServerValid(true);

    setMessage("A new example token was placed in memory and marked valid by the example server state.");
  };

  return (
    <section>
      <p>Token stored in memory: {token !== null ? "Yes" : "No"}</p>

      <p>Example server considers token valid: {serverValid ? "Yes" : "No"}</p>

      <button type="button" onClick={handleExpireServerToken}>
        Simulate Server Expiration
      </button>

      <button type="button" onClick={handleClearMemory}>
        Clear Memory
      </button>

      <button type="button" onClick={handleRestore}>
        Store New Token
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleAccessToken: string = "example-access-token";

export const InMemoryTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>In-Memory Token</h1>

      <h2>1. Store an Access Token in React Memory</h2>
      <InMemoryToken initialToken={null} />

      <h2>2. Replace an Existing In-Memory Token</h2>
      <InMemoryTokenUpdate initialToken={exampleAccessToken} />

      <h2>3. Clear the In-Memory Token During Logout</h2>
      <InMemoryTokenClear initialToken={exampleAccessToken} />

      <h2>4. Read the Latest Token From a Mutable Ref</h2>
      <InMemoryTokenLatestValue initialToken={exampleAccessToken} />

      <h2>5. Separate In-Memory Storage From Token Validity</h2>
      <InMemoryTokenExpiration initialToken={exampleAccessToken} />
    </main>
  );
};

export default InMemoryTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An in-memory token exists only inside the running JavaScript application.
// - React state can hold an access token without persisting it to browser storage.
// - In-memory state is normally lost when the application is fully reloaded.
// - Replacing the state value changes the credential available to subsequent renders.
// - Clearing in-memory state removes the application's local copy but does not automatically revoke the server-side credential.
// - A ref can expose the latest token to asynchronous code while React state continues to drive rendering.
// - In-memory storage does not make a token immune to JavaScript-based attacks.
// - Token presence in memory does not prove that the server still considers the credential valid.
// - Token lifetime, server-side validity, and client-side storage lifetime are separate concepts.

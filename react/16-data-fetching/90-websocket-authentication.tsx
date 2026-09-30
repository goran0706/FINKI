/**
 * WebSocket Authentication
 * ========================
 *
 * WebSocket authentication establishes the identity and permissions of a client before the
 * server accepts application messages. Unlike `fetch`, the browser WebSocket constructor does
 * not provide a general API for setting arbitrary HTTP headers such as `Authorization`, so browser
 * applications commonly authenticate through an existing cookie-based session, a short-lived
 * credential supplied during the WebSocket handshake, or an application-level authentication
 * message sent immediately after the connection opens.
 *
 * Authentication and authorization are separate concerns. Authentication establishes who the
 * client is, while authorization determines what that authenticated client is allowed to do.
 * Credentials should be transmitted only over `wss://`, should be short-lived when possible, and
 * should not be placed in URLs when doing so would expose sensitive credentials through logs,
 * browser history, monitoring systems, or intermediary infrastructure.
 */

import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface CookieAuthenticationProps {
  readonly url: string;
}

interface MessageAuthenticationProps {
  readonly url: string;
  readonly token: string;
}

interface AuthenticationStateProps {
  readonly authenticated: boolean;
  readonly authorizationResult: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates cookie-based WebSocket authentication.
 *
 * Browsers automatically include cookies that are applicable to the WebSocket handshake, so an
 * existing session cookie can authenticate the connection without exposing the session credential
 * in the WebSocket URL. The server must still validate the session and apply its own authorization
 * rules before accepting application messages.
 */
export const CookieAuthentication: React.FC<CookieAuthenticationProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const socket: WebSocket = new WebSocket(url);

    socket.onopen = (_event: Event): void => {
      setStatus("Authenticated session connected");
    };

    socket.onclose = (_event: CloseEvent): void => {
      setStatus("Disconnected");
    };

    socket.onerror = (_event: Event): void => {
      setStatus("Connection error");
    };

    return (): void => {
      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [url]);

  return (
    <div>
      <p>Connection: {status}</p>
      <p>Authentication source: browser session cookie</p>
    </div>
  );
};

/**
 * Authenticates a WebSocket connection with an application-level message.
 *
 * The client sends an authentication message immediately after the connection opens. The server
 * must validate the credential and must not process protected application messages until it has
 * accepted the authentication request.
 */
export const MessageAuthentication: React.FC<MessageAuthenticationProps> = ({ url, token }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect((): (() => void) => {
    const socket: WebSocket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = (_event: Event): void => {
      setStatus("Authenticating");

      socket.send(
        JSON.stringify({
          type: "authenticate",
          token,
        }),
      );
    };

    socket.onmessage = (event: MessageEvent<string>): void => {
      let message: unknown;

      try {
        message = JSON.parse(event.data);
      } catch {
        setStatus("Invalid server response");
        return;
      }

      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === "authentication_success"
      ) {
        setStatus("Authenticated");
        return;
      }

      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === "authentication_failure"
      ) {
        setStatus("Authentication failed");
        socket.close();
      }
    };

    socket.onerror = (_event: Event): void => {
      setStatus("Connection error");
    };

    socket.onclose = (_event: CloseEvent): void => {
      socketRef.current = null;
    };

    return (): void => {
      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }

      socketRef.current = null;
    };
  }, [token, url]);

  return (
    <div>
      <p>Connection: {status}</p>
      <p>Authentication source: application-level message</p>
    </div>
  );
};

/**
 * Separates authentication from authorization.
 *
 * A successful authentication identifies the client, but it does not automatically grant access
 * to every operation exposed by the WebSocket server. The server must independently evaluate the
 * authenticated identity and permissions for protected operations.
 */
export const AuthenticationState: React.FC<AuthenticationStateProps> = ({
  authenticated,
  authorizationResult,
}): React.ReactElement => {
  return (
    <div>
      <p>Authentication: {authenticated ? "successful" : "failed"}</p>
      <p>Authorization: {authorizationResult}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const WebSocketAuthenticationExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>WebSocket Authentication</h1>

      <h2>1. Cookie-Based Authentication</h2>
      <CookieAuthentication url="wss://example.com/socket" />

      <h2>2. Application-Level Authentication</h2>
      <MessageAuthentication url="wss://example.com/socket" token="short-lived-example-token" />

      <h2>3. Authentication and Authorization</h2>
      <AuthenticationState authenticated={true} authorizationResult="User may access the requested resource" />
    </main>
  );
};

export default WebSocketAuthenticationExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Browser WebSocket connections do not provide a general API for arbitrary Authorization headers.
// - Cookie-based sessions can authenticate the WebSocket handshake without placing credentials in the URL.
// - Application-level authentication can send a credential after the WebSocket connection opens.
// - The server should authenticate the client before processing protected application messages.
// - Authentication establishes identity; authorization determines which operations that identity may perform.
// - WebSocket credentials should be transmitted over `wss://` rather than unencrypted `ws://` connections.
// - Sensitive credentials should not be placed in URLs when they can instead be supplied through a safer mechanism.
// - Short-lived credentials reduce the impact of credential exposure and should be validated server-side.
// - Closing a connection after authentication failure prevents unauthenticated use of the WebSocket channel.

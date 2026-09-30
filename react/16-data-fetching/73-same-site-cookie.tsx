/**
 * SameSite Cookie
 * ===============
 *
 * The SameSite cookie attribute controls whether a browser includes a cookie
 * with requests that are considered cross-site. Its values are Strict, Lax,
 * and None, and each value applies different cross-site sending rules.
 *
 * SameSite is based on the relationship between the request's site and the
 * cookie's site. "Site" is broader than "origin": schemeful site comparisons
 * consider the registrable domain together with the scheme. Consequently,
 * different origins can still be same-site when they belong to the same site.
 *
 * SameSite=Strict applies the strongest restriction. The browser generally
 * withholds the cookie from cross-site requests, including navigation contexts
 * where Lax may still permit the cookie.
 *
 * SameSite=Lax permits same-site requests and commonly permits cookies on
 * top-level cross-site navigations using safe methods such as GET. It does not
 * generally attach the cookie to cross-site subrequests such as fetch requests.
 *
 * SameSite=None explicitly permits cross-site cookie sending, but browsers
 * require SameSite=None cookies to also use the Secure attribute. This makes
 * None appropriate only when cross-site cookie behavior is actually required.
 *
 * SameSite is an important CSRF defense because many cross-site requests will
 * not automatically carry Strict or Lax cookies. It is not a complete
 * replacement for application-level CSRF protections in every architecture.
 *
 * A common misconception is that SameSite controls whether JavaScript can read
 * a cookie. It does not. HttpOnly controls JavaScript access, while SameSite
 * controls cookie participation in cross-site requests.
 *
 * Another important distinction is SameSite versus CORS. SameSite is a browser
 * cookie policy, while CORS controls whether browser JavaScript may access
 * cross-origin responses. They solve different problems and can apply to the
 * same request.
 */

import React, { useState } from "react";
import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SameSiteStrictProps {
  readonly client: AxiosInstance;
}

export interface SameSiteLaxProps {
  readonly client: AxiosInstance;
}

export interface SameSiteNoneProps {
  readonly client: AxiosInstance;
}

export interface SameSiteSecurityProps {
  readonly client: AxiosInstance;
}

export interface SameSiteCorsProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a session configured conceptually with SameSite=Strict.
 *
 * The browser makes the final decision about whether the cookie accompanies a
 * particular request. JavaScript does not manually add a SameSite cookie value.
 */
export const SameSiteStrict: React.FC<SameSiteStrictProps> = ({ client }: SameSiteStrictProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Checking the authenticated session...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setMessage(
        "The server accepted the request. Browser cookie rules determine whether the Strict cookie was included.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>SameSite=Strict: cookies are generally withheld from cross-site requests.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Check Session"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the behavior associated with SameSite=Lax.
 *
 * Lax allows same-site requests and commonly permits cookies during top-level
 * cross-site navigations using safe methods such as GET, while restricting many
 * cross-site subrequests.
 */
export const SameSiteLax: React.FC<SameSiteLaxProps> = ({ client }: SameSiteLaxProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a request that includes browser-managed credentials...");

    try {
      await client.get<unknown>("/users/me", {
        withCredentials: true,
      });

      setMessage("The request completed. Lax cookie rules are enforced by the browser.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>
        SameSite=Lax: cookies commonly remain available for top-level safe navigations while being restricted for many
        cross-site subrequests.
      </p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the requirements associated with SameSite=None.
 *
 * SameSite=None explicitly permits cross-site cookie sending, and browsers
 * require the cookie to also have Secure. This option should therefore be used
 * only when the authentication architecture genuinely needs cross-site cookies.
 */
export const SameSiteNone: React.FC<SameSiteNoneProps> = ({ client }: SameSiteNoneProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("SameSite=None requires Secure.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a cross-origin credentialed request...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setMessage(
        "The request completed. A SameSite=None cookie can participate when its other browser requirements are satisfied.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Credentialed request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Credentialed request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>SameSite=None must be combined with Secure.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Credentialed Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates SameSite as one part of CSRF protection.
 *
 * SameSite restrictions can prevent many cross-site requests from carrying an
 * authentication cookie, but applications may still require explicit CSRF
 * defenses depending on their request model and security requirements.
 */
export const SameSiteSecurity: React.FC<SameSiteSecurityProps> = ({
  client,
}: SameSiteSecurityProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleStateChange = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending an authenticated state-changing request...");

    try {
      await client.post<void>(
        "/profile/update",
        {
          displayName: "John Doe",
        },
        {
          withCredentials: true,
        },
      );

      setMessage("The server accepted the state-changing request.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`State-changing request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("State-changing request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>SameSite reduces automatic cross-site cookie sending, but it is not necessarily a complete CSRF defense.</p>

      <button type="button" onClick={handleStateChange} disabled={loading}>
        {loading ? "Updating..." : "Send State-Changing Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that SameSite and CORS are separate browser mechanisms.
 *
 * withCredentials controls whether Axios requests are made with browser
 * credentials. CORS controls whether JavaScript may access a permitted
 * cross-origin response. Neither setting changes the cookie's SameSite value.
 */
export const SameSiteCors: React.FC<SameSiteCorsProps> = ({ client }: SameSiteCorsProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a credentialed cross-origin request...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setMessage("The browser exposed the response to JavaScript.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          `The request was not successfully exposed to the application. HTTP status: ${
            error.response?.status ?? "unknown"
          }.`,
        );
      } else {
        setMessage("The request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>SameSite controls cookie sending; CORS controls cross-origin response access.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Credentialed Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
});

export const SameSiteCookieDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>SameSite Cookie</h1>

      <h2>1. Restrict Cross-Site Cookies With SameSite=Strict</h2>
      <SameSiteStrict client={apiClient} />

      <h2>2. Allow Limited Cross-Site Navigation With SameSite=Lax</h2>
      <SameSiteLax client={apiClient} />

      <h2>3. Permit Cross-Site Cookies With SameSite=None</h2>
      <SameSiteNone client={apiClient} />

      <h2>4. Use SameSite as Part of CSRF Protection</h2>
      <SameSiteSecurity client={apiClient} />

      <h2>5. Distinguish SameSite Cookie Rules From CORS</h2>
      <SameSiteCors client={apiClient} />
    </main>
  );
};

export default SameSiteCookieDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - SameSite controls whether cookies participate in cross-site requests.
// - SameSite=Strict applies the strongest cross-site cookie restriction.
// - SameSite=Lax permits same-site requests and commonly allows cookies on top-level cross-site safe navigations.
// - SameSite=None explicitly permits cross-site cookie sending and requires Secure.
// - SameSite is independent from HttpOnly, which controls JavaScript access to a cookie.
// - SameSite is independent from Secure, which restricts cookie transmission to secure connections.
// - SameSite can reduce CSRF exposure but does not automatically provide every CSRF defense an application may require.
// - SameSite and CORS are different browser mechanisms with different responsibilities.
// - Axios withCredentials enables credentialed requests, but browser cookie rules and server CORS policy still apply.

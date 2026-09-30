/**
 * HTTPS
 * =====
 *
 * HTTPS (Hypertext Transfer Protocol Secure) is HTTP transported through a
 * TLS-protected connection. TLS provides encryption, integrity protection,
 * and server authentication for application data exchanged between a client
 * and server.
 *
 * An HTTPS URL uses the `https` scheme and normally communicates over TCP
 * port 443. Modern HTTP/2 and HTTP/3 deployments commonly use TLS as part of
 * the connection setup, while HTTP/3 transports HTTP over QUIC rather than
 * TCP.
 *
 * During a TLS handshake, the client and server negotiate cryptographic
 * parameters and establish shared session keys. The server presents a
 * certificate containing its identity information and a public key. The
 * browser validates the certificate against its trusted certificate
 * authorities and verifies that the certificate is valid for the requested
 * hostname.
 *
 * After the handshake, application data is encrypted and authenticated.
 * HTTPS therefore protects HTTP headers and body data while they travel
 * between the client and server. It does not make the data inherently safe
 * after it reaches the server, and it does not protect against application
 * vulnerabilities, malicious JavaScript already running in the page, or
 * compromised endpoints.
 *
 * JavaScript running in a browser normally does not perform the TLS handshake
 * itself. Browser networking APIs such as fetch() delegate connection
 * establishment, certificate validation, encryption, and decryption to the
 * browser's networking and cryptographic implementation.
 *
 * An important security property is that an HTTPS page should not load active
 * HTTP content as mixed content. Browsers can block insecure resources because
 * allowing active HTTP resources could let an attacker modify code executed
 * by an otherwise secure page.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpsUrlProps {
  readonly url: string;
}

export interface HttpsProtocolProps {
  readonly url: string;
}

export interface HttpsRequestProps {
  readonly url: string;
  readonly method: string;
}

export interface HttpsSecurityProps {
  readonly encryptedValue: string;
}

export interface HttpsCertificateProps {
  readonly hostname: string;
  readonly issuer: string;
}

export interface HttpsMixedContentProps {
  readonly secureUrl: string;
  readonly insecureUrl: string;
}

export interface HttpsValidationProps {
  readonly url: string;
}

export interface HttpsHttpComparisonProps {
  readonly secureUrl: string;
  readonly insecureUrl: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates identifying HTTPS from the URL scheme.
 */
export const HttpsUrlExample: FC<HttpsUrlProps> = ({ url }: HttpsUrlProps): ReactNode => {
  const parsedUrl: URL = new URL(url);

  const isHttps: boolean = parsedUrl.protocol === "https:";

  return (
    <section>
      <h3>HTTPS URL scheme</h3>

      <p>URL: {parsedUrl.href}</p>

      <p>Protocol: {parsedUrl.protocol}</p>

      <p>HTTPS enabled: {isHttps ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates that HTTPS is represented by the `https:` URL protocol.
 */
export const HttpsProtocolExample: FC<HttpsProtocolProps> = ({ url }: HttpsProtocolProps): ReactNode => {
  const parsedUrl: URL = new URL(url);

  const protocolDescription: string =
    parsedUrl.protocol === "https:" ? "The URL uses HTTPS." : "The URL does not use HTTPS.";

  return (
    <section>
      <h3>Detecting the HTTPS protocol</h3>

      <p>{protocolDescription}</p>

      <p>Host: {parsedUrl.host}</p>

      <p>Default HTTPS port: 443</p>
    </section>
  );
};

/**
 * Demonstrates creating an HTTPS Request object. Creating the Request does
 * not itself perform network I/O; the request is sent when fetch() is called.
 */
export const HttpsRequestExample: FC<HttpsRequestProps> = ({ url, method }: HttpsRequestProps): ReactNode => {
  const request: Request = new Request(url, {
    method,
  });

  return (
    <section>
      <h3>Creating an HTTPS request</h3>

      <p>Method: {request.method}</p>

      <p>URL: {request.url}</p>

      <p>Protocol: {new URL(request.url).protocol}</p>
    </section>
  );
};

/**
 * Demonstrates that HTTPS protects HTTP payload data while it is transported
 * between the browser and server. The example represents the conceptual
 * result rather than implementing TLS encryption in application JavaScript.
 */
export const HttpsSecurityExample: FC<HttpsSecurityProps> = ({ encryptedValue }: HttpsSecurityProps): ReactNode => {
  return (
    <section>
      <h3>Transport encryption</h3>

      <p>Application value: {encryptedValue}</p>

      <p>HTTPS encrypts the HTTP traffic while it travels across the network.</p>

      <p>
        JavaScript does not need to manually encrypt ordinary fetch() request data to obtain HTTPS transport protection.
      </p>
    </section>
  );
};

/**
 * Demonstrates the identity information represented by a TLS certificate.
 * Certificate validation itself is performed by the browser rather than by
 * application-level fetch() code.
 */
export const HttpsCertificateExample: FC<HttpsCertificateProps> = ({
  hostname,
  issuer,
}: HttpsCertificateProps): ReactNode => {
  return (
    <section>
      <h3>TLS certificate identity</h3>

      <dl>
        <dt>Hostname</dt>
        <dd>{hostname}</dd>

        <dt>Certificate issuer</dt>
        <dd>{issuer}</dd>
      </dl>

      <p>The browser validates the server certificate during TLS connection establishment.</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between HTTPS resources and insecure HTTP
 * resources that may create mixed-content problems on an HTTPS page.
 */
export const HttpsMixedContentExample: FC<HttpsMixedContentProps> = ({
  secureUrl,
  insecureUrl,
}: HttpsMixedContentProps): ReactNode => {
  const secureProtocol: string = new URL(secureUrl).protocol;

  const insecureProtocol: string = new URL(insecureUrl).protocol;

  const mixedContent: boolean = secureProtocol === "https:" && insecureProtocol === "http:";

  return (
    <section>
      <h3>HTTPS and mixed content</h3>

      <p>Secure resource: {secureUrl}</p>

      <p>Insecure resource: {insecureUrl}</p>

      <p>Mixed-content relationship: {mixedContent ? "Yes" : "No"}</p>

      <p>Browsers can block insecure active resources loaded by secure pages.</p>
    </section>
  );
};

/**
 * Demonstrates validating an application's URL before making a request. This
 * check can enforce an application's requirement that a configured endpoint
 * use HTTPS, although the browser remains responsible for TLS validation.
 */
export const HttpsValidationExample: FC<HttpsValidationProps> = ({ url }: HttpsValidationProps): ReactNode => {
  const parsedUrl: URL = new URL(url);

  const isHttps: boolean = parsedUrl.protocol === "https:";

  const message: string = isHttps ? "The endpoint uses HTTPS." : "The endpoint does not use HTTPS.";

  return (
    <section>
      <h3>Checking an endpoint before a request</h3>

      <p>{message}</p>

      <p>Endpoint: {parsedUrl.href}</p>
    </section>
  );
};

/**
 * Demonstrates the conceptual difference between HTTP and HTTPS URLs. HTTPS
 * adds TLS protection to the HTTP communication path.
 */
export const HttpsHttpComparisonExample: FC<HttpsHttpComparisonProps> = ({
  secureUrl,
  insecureUrl,
}: HttpsHttpComparisonProps): ReactNode => {
  const secureProtocol: string = new URL(secureUrl).protocol;

  const insecureProtocol: string = new URL(insecureUrl).protocol;

  return (
    <section>
      <h3>HTTP versus HTTPS</h3>

      <dl>
        <dt>HTTPS URL</dt>
        <dd>
          {secureUrl} ({secureProtocol})
        </dd>

        <dt>HTTP URL</dt>
        <dd>
          {insecureUrl} ({insecureProtocol})
        </dd>
      </dl>

      <p>HTTPS uses TLS to provide transport confidentiality, integrity, and server authentication.</p>

      <p>HTTP does not provide those TLS protections.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTPS</h1>

      <h2>1. Identifying an HTTPS URL</h2>
      <HttpsUrlExample url="https://example.com/users" />

      <h2>2. Detecting the HTTPS protocol</h2>
      <HttpsProtocolExample url="https://example.com/api/users" />

      <h2>3. Creating an HTTPS request</h2>
      <HttpsRequestExample url="https://example.com/api/users" method="GET" />

      <h2>4. Understanding transport encryption</h2>
      <HttpsSecurityExample encryptedValue="John Doe" />

      <h2>5. Understanding TLS certificate identity</h2>
      <HttpsCertificateExample hostname="example.com" issuer="Example Certificate Authority" />

      <h2>6. Understanding mixed content</h2>
      <HttpsMixedContentExample secureUrl="https://example.com/app" insecureUrl="http://example.com/image.png" />

      <h2>7. Validating an HTTPS endpoint</h2>
      <HttpsValidationExample url="https://example.com/api/users" />

      <h2>8. Comparing HTTP and HTTPS</h2>
      <HttpsHttpComparisonExample secureUrl="https://example.com" insecureUrl="http://example.com" />
    </main>
  );
};

export default HttpsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HTTPS is HTTP transported through a TLS-protected connection.
// - TLS provides encryption, integrity protection, and server authentication.
// - HTTPS URLs use the `https:` scheme.
// - HTTPS normally uses port 443 for TCP-based HTTP connections.
// - HTTP/3 uses QUIC rather than TCP while still using TLS for security.
// - TLS certificates allow browsers to authenticate the requested server hostname.
// - The browser performs TLS negotiation and certificate validation outside application-level fetch() code.
// - HTTPS protects HTTP traffic while it is transported between endpoints.
// - HTTPS does not automatically make server-side application data secure after receipt.
// - HTTPS pages should avoid insecure active resources because browsers enforce mixed-content protections.
// - Creating a Request object does not send network traffic; fetch() performs the request.
// - Application code can enforce HTTPS endpoint requirements before making requests.

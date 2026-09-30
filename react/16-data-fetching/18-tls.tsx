/**
 * TLS
 * ===
 *
 * TLS (Transport Layer Security) is a cryptographic protocol that protects
 * network communication against interception, modification, and impersonation.
 * HTTPS uses TLS to protect HTTP traffic between a client and server.
 *
 * A TLS connection begins with a handshake. The client and server negotiate
 * protocol parameters and cryptographic algorithms, and the server provides a
 * certificate containing its public-key identity information. The client
 * validates the certificate using its trust store and verifies that the
 * certificate is appropriate for the requested hostname.
 *
 * Modern TLS establishes symmetric session keys for protecting application
 * traffic. Public-key (asymmetric) cryptography is used during the handshake to
 * authenticate the server and establish keying material, while symmetric
 * cryptography is used for the high-volume application data that follows.
 *
 * Symmetric cryptography uses one shared secret key: the same key encrypts and
 * decrypts (for example AES-GCM or ChaCha20-Poly1305). It is fast, which makes it
 * suitable for bulk data, but both sides must already hold the key, and sending
 * it over an untrusted network would defeat its purpose.
 *
 * Asymmetric cryptography uses a key pair: a public key that can be shared with
 * anyone, and a private key that never leaves its owner. The pair is used in two
 * different directions for two different goals:
 *
 * - Protecting a message (confidentiality): data encrypted with a public key can
 *   only be decrypted with the matching private key. Anyone can encrypt, but
 *   only the private key holder can read. This hides the message but does not
 *   prove who sent it, because the public key is not secret.
 *
 * - Proving the signer (authentication): the signer creates a digital signature
 *   over a hash of the data using the private key, and anyone can verify it
 *   using the public key. This proves that the holder of the private key
 *   produced the data and that it was not modified, but it does NOT hide the
 *   data. (This is often informally described as "encrypting with the private
 *   key", but it is a signing operation, not message protection.)
 *
 * In short: encryption protects the message and goes from public key to private
 * key; signing proves the signer and goes from private key to public key.
 *
 * TLS uses both kinds of cryptography for different jobs. The certificate is a
 * signature by a trusted certificate authority that binds a hostname to a public
 * key. During the handshake the server signs handshake data with its private key,
 * proving it owns the key in that certificate. The endpoints also perform an
 * ephemeral Diffie-Hellman key exchange (ECDHE) to derive the same shared secret
 * without ever sending it over the network; TLS 1.3 does not encrypt a secret with
 * the server's public key. From that secret, symmetric session keys are derived
 * and protect all application data.
 *
 * TLS provides confidentiality and integrity for protected traffic. An
 * authenticated TLS connection also provides server authentication when
 * certificate validation succeeds. TLS does not authenticate application users,
 * authorize API operations, validate application payloads, or make an
 * application immune to vulnerabilities.
 *
 * Browser JavaScript normally does not directly implement the TLS handshake.
 * APIs such as fetch() delegate connection establishment, certificate
 * validation, encryption, and decryption to the browser's networking stack.
 *
 * TLS versions and cipher suites are negotiated by the endpoints. Application
 * code generally should not attempt to select TLS cipher suites or implement
 * the protocol manually. Browsers and operating systems maintain the supported
 * protocol and trust configuration.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TlsProtocolProps {
  readonly protocol: string;
  readonly hostname: string;
}

export interface TlsHandshakeProps {
  readonly hostname: string;
  readonly tlsVersion: string;
}

export interface TlsCertificateProps {
  readonly hostname: string;
  readonly issuer: string;
  readonly validUntil: string;
}

export interface TlsEncryptionProps {
  readonly message: string;
}

export interface TlsAuthenticationProps {
  readonly hostname: string;
  readonly certificateHostname: string;
}

export interface TlsSessionProps {
  readonly hostname: string;
  readonly cipher: string;
}

export interface TlsHttpsProps {
  readonly url: string;
}

export interface TlsLimitationProps {
  readonly protectedValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates identifying the TLS protocol used conceptually by an HTTPS
 * connection.
 */
export const TlsProtocolExample: FC<TlsProtocolProps> = ({ protocol, hostname }: TlsProtocolProps): ReactNode => {
  const isModernTls: boolean = protocol === "TLS 1.2" || protocol === "TLS 1.3";

  return (
    <section>
      <h3>TLS protocol version</h3>

      <p>Hostname: {hostname}</p>

      <p>Protocol: {protocol}</p>

      <p>Modern TLS version: {isModernTls ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates the conceptual stages of a TLS handshake without implementing
 * the cryptographic protocol in application JavaScript.
 */
export const TlsHandshakeExample: FC<TlsHandshakeProps> = ({ hostname, tlsVersion }: TlsHandshakeProps): ReactNode => {
  const steps: readonly string[] = [
    "Client and server negotiate TLS parameters.",
    "The server presents its certificate.",
    "The client validates the certificate.",
    "The endpoints establish shared session keys.",
    "Encrypted application data can be exchanged.",
  ];

  return (
    <section>
      <h3>TLS handshake</h3>

      <p>Hostname: {hostname}</p>

      <p>Negotiated protocol: {tlsVersion}</p>

      <ol>
        {steps.map(
          (step: string, index: number): ReactNode => (
            <li key={index}>{step}</li>
          ),
        )}
      </ol>
    </section>
  );
};

/**
 * Demonstrates the identity information commonly associated with a TLS
 * certificate. Actual certificate validation is performed by the browser or
 * operating system trust infrastructure.
 */
export const TlsCertificateExample: FC<TlsCertificateProps> = ({
  hostname,
  issuer,
  validUntil,
}: TlsCertificateProps): ReactNode => {
  return (
    <section>
      <h3>TLS certificate</h3>

      <dl>
        <dt>Requested hostname</dt>
        <dd>{hostname}</dd>

        <dt>Certificate issuer</dt>
        <dd>{issuer}</dd>

        <dt>Valid until</dt>
        <dd>{validUntil}</dd>
      </dl>

      <p>The browser validates the certificate before treating the TLS server identity as trusted.</p>
    </section>
  );
};

/**
 * Demonstrates the purpose of TLS encryption. The example describes the
 * protection provided by an established TLS connection rather than performing
 * application-level encryption.
 */
export const TlsEncryptionExample: FC<TlsEncryptionProps> = ({ message }: TlsEncryptionProps): ReactNode => {
  return (
    <section>
      <h3>TLS confidentiality</h3>

      <p>Application message: {message}</p>

      <p>TLS encrypts protected application traffic while it travels between the endpoints.</p>

      <p>
        Browser application code does not need to manually encrypt ordinary HTTPS request bodies to obtain TLS transport
        protection.
      </p>
    </section>
  );
};

/**
 * Demonstrates hostname authentication conceptually. A certificate must be
 * valid for the hostname the client is connecting to for normal browser TLS
 * validation to succeed.
 */
export const TlsAuthenticationExample: FC<TlsAuthenticationProps> = ({
  hostname,
  certificateHostname,
}: TlsAuthenticationProps): ReactNode => {
  const hostnameMatches: boolean = hostname === certificateHostname;

  return (
    <section>
      <h3>Server authentication</h3>

      <p>Requested hostname: {hostname}</p>

      <p>Certificate hostname: {certificateHostname}</p>

      <p>Hostname match: {hostnameMatches ? "Yes" : "No"}</p>

      <p>A hostname mismatch can cause browser TLS certificate validation to fail.</p>
    </section>
  );
};

/**
 * Demonstrates that an established TLS connection uses symmetric session
 * cryptography for protecting application traffic. The specific cipher suite
 * is negotiated by the TLS implementation.
 */
export const TlsSessionExample: FC<TlsSessionProps> = ({ hostname, cipher }: TlsSessionProps): ReactNode => {
  return (
    <section>
      <h3>TLS session protection</h3>

      <p>Hostname: {hostname}</p>

      <p>Negotiated cipher: {cipher}</p>

      <p>Session cryptography protects the application data exchanged after the TLS handshake.</p>
    </section>
  );
};

/**
 * Demonstrates the relationship between an HTTPS URL and TLS. Browser
 * networking automatically performs the required TLS setup when an HTTPS
 * request is sent.
 */
export const TlsHttpsExample: FC<TlsHttpsProps> = ({ url }: TlsHttpsProps): ReactNode => {
  const parsedUrl: URL = new URL(url);

  const usesHttps: boolean = parsedUrl.protocol === "https:";

  return (
    <section>
      <h3>HTTPS uses TLS</h3>

      <p>URL: {parsedUrl.href}</p>

      <p>HTTPS protocol: {usesHttps ? "Yes" : "No"}</p>

      <p>The browser performs TLS connection setup when an HTTPS network connection is required.</p>
    </section>
  );
};

/**
 * Demonstrates an important TLS limitation: transport encryption does not
 * provide application-level authorization or validation of the protected data.
 */
export const TlsLimitationExample: FC<TlsLimitationProps> = ({ protectedValue }: TlsLimitationProps): ReactNode => {
  return (
    <section>
      <h3>What TLS does not provide</h3>

      <p>Protected value: {protectedValue}</p>

      <ul>
        <li>TLS does not decide whether a user is authorized to perform an operation.</li>
        <li>TLS does not validate application business rules.</li>
        <li>TLS does not remove vulnerabilities from server-side application code.</li>
        <li>TLS does not protect data after it has reached a compromised endpoint.</li>
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const TlsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>TLS</h1>

      <h2>1. Identifying a TLS protocol version</h2>
      <TlsProtocolExample protocol="TLS 1.3" hostname="example.com" />

      <h2>2. Understanding the TLS handshake</h2>
      <TlsHandshakeExample hostname="example.com" tlsVersion="TLS 1.3" />

      <h2>3. Understanding TLS certificates</h2>
      <TlsCertificateExample hostname="example.com" issuer="Example Certificate Authority" validUntil="2027-12-31" />

      <h2>4. Understanding TLS confidentiality</h2>
      <TlsEncryptionExample message="Example private message" />

      <h2>5. Understanding server authentication</h2>
      <TlsAuthenticationExample hostname="example.com" certificateHostname="example.com" />

      <h2>6. Understanding TLS session protection</h2>
      <TlsSessionExample hostname="example.com" cipher="TLS_AES_128_GCM_SHA256" />

      <h2>7. Understanding HTTPS and TLS</h2>
      <TlsHttpsExample url="https://example.com/api/users" />

      <h2>8. Understanding TLS limitations</h2>
      <TlsLimitationExample protectedValue="John Doe" />
    </main>
  );
};

export default TlsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - TLS is a cryptographic protocol used to protect network communication.
// - HTTPS uses TLS to protect HTTP traffic between clients and servers.
// - A TLS handshake negotiates protocol parameters and establishes session keys.
// - TLS certificates provide server identity information and support authentication.
// - Browsers validate certificates using trusted certificate authorities.
// - Hostname validation helps prevent a certificate for one server from being used as another server's identity.
// - Symmetric cryptography uses one shared key for encryption and decryption; it is fast and protects the application data after the handshake.
// - Asymmetric cryptography uses a public/private key pair and is used during the handshake, not for bulk data.
// - Encryption protects a message: encrypt with the public key, only the private key can decrypt it.
// - Signing proves the signer: sign with the private key, anyone verifies with the public key; the data is not hidden.
// - Certificates are CA signatures; the server proves key ownership by signing handshake data; ECDHE derives the shared secret without sending it.
// - TLS provides confidentiality and integrity for protected traffic.
// - Browser JavaScript normally does not implement the TLS handshake directly.
// - Application code should normally rely on browser and operating-system TLS implementations.
// - TLS does not authenticate application users or authorize application operations.
// - TLS does not validate application business rules or eliminate endpoint vulnerabilities.

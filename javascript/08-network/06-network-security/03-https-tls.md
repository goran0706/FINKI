# HTTPS and Transport Layer Security Specifications

Hypertext Transfer Protocol Secure (HTTPS) secures HTTP communications by encapsulating traffic within an encrypted
Transport Layer Security (TLS) channel. Defined by IETF RFC 8446 (TLS 1.3), modern transport security provides
confidentiality, data integrity, and server authentication using asymmetric cryptography during the initial handshake
and symmetric key encryption for application data transport. TLS 1.3 reduces handshake latency to a single round-trip
time (1-RTT) by combining key exchange and authentication steps, while removing legacy cryptographic algorithms like RSA
key exchange, static Diffie-Hellman, and insecure ciphers.

| TLS Component          | Cryptographic Role   | Operational Function                                                                    |
|:-----------------------|:---------------------|:----------------------------------------------------------------------------------------|
| `ClientHello`          | Handshake Initiation | Sends client supported TLS versions, cipher suites, and key share parameters.           |
| `ServerHello`          | Key Agreement        | Selects protocol version, cipher suite, and transmits server key share.                 |
| `ECDHE`                | Key Exchange         | Elliptic-Curve Diffie-Hellman Ephemeral key exchange providing Perfect Forward Secrecy. |
| `Certificate`          | Authentication       | Transmits server X.509 certificate chain signed by a trusted Certificate Authority.     |
| `AES-GCM` / `ChaCha20` | Symmetric Encryption | Authenticated Encryption with Associated Data (AEAD) ciphers for payload traffic.       |
| `HSTS`                 | Security Policy      | HTTP header instructing browsers to enforce HTTPS connections exclusively.              |

## TLS 1.3 Handshake Execution Sequence

The 1-RTT TLS 1.3 handshake negotiates encryption keys and verifies server identity before application data exchange
begins:

1. **Handshake Initiation:** The client sends a `ClientHello` message containing supported TLS versions, a list of
   symmetric AEAD cipher suites, and ECDHE key share parameters.
2. **Parameter Selection:** The server processes the parameters, selects a mutually supported cipher suite, generates
   its own key share, and responds with a `ServerHello` message.
3. **Identity Verification:** The server sends its digital X.509 certificate and `CertificateVerify` signature,
   establishing mutual session keys via Diffie-Hellman exchange.
4. **Payload Encryption:** The client validates the server certificate against trusted Root CA certificates; upon
   validation, both endpoints transition to encrypted payload transmission.

## Best Practices

* **Mandate TLS 1.3 Exclusively:** Disable legacy protocol versions (TLS 1.0, TLS 1.1, and SSL) on web servers to
  mitigate cryptographic downgrade vulnerabilities.
* **Deploy HSTS Headers:** Enforce HTTP Strict Transport Security by setting
  `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` to prevent SSL stripping attacks.
* **Enable OCSP Stapling:** Configure servers to staple Online Certificate Status Protocol responses to handshakes,
  improving performance and protecting client privacy during certificate revocation checks.
* **Restrict Cipher Suites to AEAD:** Configure cipher suites strictly to robust algorithms such as
  `TLS_AES_128_GCM_SHA256` and `TLS_CHACHA20_POLY1305_SHA256`.
* **Automate Certificate Lifecycle:** Utilize automated certificate management environments (such as ACME protocols) to
  renew X.509 certificates before expiration.
* **Enforce strong public key cryptography:** Utilize modern elliptic-curve keys (e.g., ECDSA P-256 or Ed25519) or
  RSA-4096 alternatives for server certificate signing.
* **Configure session resumption securely:** Implement TLS session tickets with proper key rotation schedules to balance
  reconnection performance and forward secrecy.
* **Disable insecure renegotiation:** Explicitly disable client-initiated renegotiation and insecure legacy session
  extensions on web server configurations.
* **Implement certificate transparency monitoring:** Audit certificate transparency logs regularly to detect
  unauthorized or fraudulently issued certificates for domain names.
* **Test SSL/TLS configurations continuously:** Utilize automated scanning tools to verify cipher strengths, protocol
  policies, and certificate chains against current security standards.
* **Secure private key storage:** Restrict file permissions and store server TLS private keys in hardware security
  modules (HSMs) or encrypted key vaults.
* **Enable forward secrecy exclusively:** Reject non-ephemeral key exchange cipher suites to ensure past session
  recordings cannot be decrypted if server keys are compromised.
* **Configure intermediate certificate chains properly:** Ensure web servers transmit complete, correctly ordered X.509
  intermediate certificate chains to avoid client validation errors.
* **Monitor certificate expiration alerts:** Set up automated notification systems to flag impending domain certificate
  expirations weeks in advance.
* **Validate cipher suite prioritization:** Configure web servers to enforce server-side cipher preference orders rather
  than relying on client-side selections.
* **Disable insecure compression extensions:** Turn off TLS compression features (such as CRIME) to prevent side-channel
  cryptographic extraction attacks.
* **Protect against downgrade attacks:** Ensure servers implement fallback protection mechanisms to reject rogue clients
  attempting forced protocol downgrades.
* **Restrict SNI exposure:** Implement proper Server Name Indication handling to prevent information disclosure on
  multi-tenant hosting infrastructures.
* **Audit cipher suites periodically:** Review and update enabled server ciphers annually to phase out newly deprecated
  cryptographic primitives.
* **Review wildcard certificate risks:** Limit the scope of wildcard TLS certificates to minimize blast radiuses if a
  single subdomain private key is leaked.
* **Test client trust store compatibility:** Verify that deployed server certificates chain up to root CAs trusted
  natively by all target mobile and desktop operating systems.
* **Enforce secure TLS termination at load balancers:** Ensure internal proxy tiers maintain end-to-end encryption
  standards when decrypting client traffic at gateway edges.
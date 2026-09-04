# Crypto Object in JavaScript

## Crypto Architecture and Core Capabilities

The `crypto` object provides cryptographically secure pseudo-random number generation, hashing capabilities, and digital
signature primitives directly within browser environments. Accessible via `window.crypto` (or `globalThis.crypto`), the
Web Crypto API guarantees that generated random values and cryptographic keys are suitable for security-sensitive
operations such as session token generation, encryption initialization vectors, and password hashing salts.

| Capability Feature     | Target Property / Interface | Operational Role                                      |
|:-----------------------|:----------------------------|:------------------------------------------------------|
| **Secure Randomness**  | `crypto.getRandomValues()`  | Populating typed arrays with secure random bytes      |
| **Unique Identifiers** | `crypto.randomUUID()`       | Generating cryptographically secure version 4 UUIDs   |
| **Subtle Crypto**      | `crypto.subtle`             | Performing low-level encryption, signing, and hashing |

## Secure Random Number Generation

Unlike Math.random(), which utilizes insecure pseudo-random number algorithms unsuitable for security contexts,
`crypto.getRandomValues()` utilizes cryptographically secure entropy sources provided by the underlying operating
system.

| Randomization Method    | Functional Signature                 | Operational Target                                      |
|:------------------------|:-------------------------------------|:--------------------------------------------------------|
| **Typed Array Filling** | `crypto.getRandomValues(typedArray)` | Populates integer typed arrays with secure random bytes |
| **UUID Generation**     | `crypto.randomUUID()`                | Returns a standard 36-character RFC 4122 version 4 UUID |

## SubtleCrypto Interface and Operations

The `crypto.subtle` property exposes the `SubtleCrypto` interface, enabling advanced web applications to perform
cryptographic operations natively in JavaScript without external library dependencies.

| Cryptographic Operation   | Primary SubtleCrypto Method      | Functional Purpose                                    |
|:--------------------------|:---------------------------------|:------------------------------------------------------|
| **Cryptographic Hashing** | `subtle.digest(algorithm, data)` | Generates cryptographic hashes (SHA-256, SHA-512)     |
| **Key Generation**        | `subtle.generateKey(...)`        | Creates symmetric or asymmetric cryptographic keys    |
| **Data Encryption**       | `subtle.encrypt(...)`            | Encrypts plaintext using algorithms like AES-GCM      |
| **Digital Signing**       | `subtle.sign(...)`               | Generates cryptographic signatures using RSA or ECDSA |

## Use Cases

* **Cryptographic Token Generation:** Producing high-entropy session tokens, nonces, and API request identifiers.
* **Client-Side Password Hashing:** Salting and hashing user passwords securely using `subtle.digest()` prior to network
  transmission.
* **Local Data Encryption:** Encrypting sensitive data stored in IndexedDB or local caches using AES-GCM encryption
  keys.
* **Unique Transaction Tracking:** Generating collision-resistant tracking IDs using `crypto.randomUUID()` for
  distributed logging systems.

## Best Practices

* **Never Use Math.random for Security:** Always employ `crypto.getRandomValues()` or `crypto.randomUUID()` for
  security-critical tokens, encryption keys, or authentication nonces.
* **Handle SubtleCrypto Asynchronously:** Ensure proper handling of asynchronous promises returned by `crypto.subtle`
  operations during heavy cryptographic tasks.
* **Secure Key Storage:** Store generated cryptographic keys securely using the Web Crypto Key Storage API or IndexedDB
  rather than plain text variables.
* **Select Robust Algorithms:** Utilize modern standardized algorithms (such as AES-GCM, SHA-256, and ECDSA) while
  avoiding deprecated primitives like MD5 or SHA-1.

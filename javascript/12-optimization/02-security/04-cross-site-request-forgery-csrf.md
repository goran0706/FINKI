# Cross-Site Request Forgery (CSRF): Mechanics and Protection Strategies

Cross-Site Request Forgery (CSRF) is a client-side vulnerability that tricks an authenticated user's browser into
executing unwanted, unauthorized actions on a trusted web application. Unlike Cross-Site Scripting (XSS), which relies
on executing malicious scripts to steal data, CSRF exploits the implicit trust a web application has in the user's
browser, specifically the browser's behavior of automatically appending ambient credentials (such as session cookies) to
outgoing cross-origin requests.

## What is CSRF

When a user logs into a web application, the server typically issues a session cookie to maintain state. The browser
automatically includes this cookie in all subsequent HTTP requests made to that domain, regardless of where the request
originated.

A CSRF attack occurs when a malicious website, email, or blog post causes the user's web browser to perform an unwanted
action on a trusted site where the user is currently authenticated. Because the browser automatically attaches the valid
session cookie, the server processes the forged request as if it were legitimately initiated by the user.

## CSRF Attacks and Exploitation Vectors

CSRF attacks target state-changing requests, such as transferring funds, changing an email address, or modifying account
passwords. They do not allow the attacker to read the response data (due to the Same-Origin Policy), but the
state-changing action is still executed.

* **GET Request Exploitation:** If an application improperly uses HTTP GET requests for state-changing operations, an
  attacker can trigger a CSRF attack simply by embedding the target URL in an image tag.
* **POST Request Exploitation:** If the application requires a POST request, an attacker can embed a hidden HTML form on
  a malicious site and use JavaScript to submit it automatically when the victim visits the page.

```html
<!-- Example of a hidden CSRF attack form on a malicious website -->
<form action="[https://bank.example.com/transfer](https://bank.example.com/transfer)" method="POST" id="csrf-form">
    <input type="hidden" name="amount" value="10000"/>
    <input type="hidden" name="destinationAccount" value="ATTACKER_ACCOUNT_ID"/>
</form>

<script>
    // Automatically submits the form using the victim's ambient session cookies
    document.getElementById('csrf-form').submit();
</script>
```

## CSRF Protection Mechanisms

Defending against CSRF requires verifying that state-changing requests were intentionally initiated by the user from
within the legitimate application interface, rather than forged by an external site.

### Anti-CSRF Tokens (Synchronizer Token Pattern)

The application generates a cryptographically strong, unique, and unpredictable token for the user's session. This token
is embedded into the application's HTML forms or JavaScript variables. Any state-changing request must include this
token. The server validates the token before processing the request; if it is missing or invalid, the request is
rejected.

### SameSite Cookie Attributes

Modern browsers support the `SameSite` attribute for cookies, which dictates how cookies are handled during cross-origin
requests. This is the most effective defense-in-depth measure against CSRF.

| SameSite Value | Browser Behavior                                                                                                                                        | Primary Use Case                                                                 |
|:---------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------|
| **Strict**     | The cookie is never sent on cross-site requests.                                                                                                        | High-security contexts like banking operations.                                  |
| **Lax**        | The cookie is not sent on cross-site subrequests (like images or frames) but is sent when a user navigates to the origin site (e.g., following a link). | Default behavior in modern browsers; ideal for general web applications.         |
| **None**       | The cookie is sent in all contexts. Must be paired with the `Secure` flag.                                                                              | Embedded widgets, third-party authentication flows, or external API consumption. |

## Architectural Trade-Offs

Implementing robust CSRF protections involves balancing security with user experience and architectural complexity:

* **Advantages:** Neutralizes unauthorized state-changing operations, protecting user data integrity and financial
  assets.
* **Disadvantages:** Managing stateful CSRF tokens can complicate stateless API designs and Single Page Application (
  SPA) architectures, requiring dedicated token-fetching endpoints or specialized header configurations.

## Best Practices

* **Enforce SameSite cookie attributes:** Always configure session cookies with `SameSite=Lax` or `SameSite=Strict`
  alongside the `Secure` and `HttpOnly` flags.
* **Never use GET requests for state changes:** Strictly adhere to RESTful principles; ensure HTTP GET requests are
  idempotent and never mutate application state.
* **Require explicit re-authentication:** For highly sensitive operations (like changing passwords or transferring large
  sums of money), force the user to re-authenticate or provide a one-time password (OTP) regardless of their active
  session state.
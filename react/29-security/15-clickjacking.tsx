/**
 * Clickjacking
 * ============
 *
 * Clickjacking is a UI redress attack in which an attacker causes a user to interact with
 * a legitimate application through an attacker-controlled visual layer or embedded frame.
 * The attacker attempts to make a user activate a sensitive control without realizing which
 * application or action is actually receiving the interaction.
 *
 * The primary defense is to control which documents are allowed to embed the application,
 * using the Content-Security-Policy `frame-ancestors` directive and, for defense in depth,
 * the X-Frame-Options response header. Additional protections include secure session-cookie
 * settings, server-side authorization, and explicit authorization for sensitive actions.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What is clickjacking?
// ---------------------------------------------------------------------

interface ClickjackingModel {
  readonly attackerControlsPage: boolean;
  readonly targetIsEmbedded: boolean;
  readonly userInteractsWithTarget: boolean;
}

const clickjackingModel: ClickjackingModel = {
  attackerControlsPage: true,
  targetIsEmbedded: true,
  userInteractsWithTarget: true,
};

const ClickjackingDefinition: FC = (): ReactElement => {
  return (
    <ul>
      <li>Attacker-controlled page: {String(clickjackingModel.attackerControlsPage)}</li>
      <li>Target embedded: {String(clickjackingModel.targetIsEmbedded)}</li>
      <li>User interacts with target: {String(clickjackingModel.userInteractsWithTarget)}</li>
    </ul>
  );
};

// A typical frame-based clickjacking flow is:
//
// attacker-controlled page
//     ↓
// transparent or disguised iframe
//     ↓
// legitimate application
//     ↓
// user clicks what appears to be an attacker-controlled control
//     ↓
// legitimate application receives the interaction
//
// The attack depends on the target application being embeddable.

// ---------------------------------------------------------------------
// 2. UI redress
// ---------------------------------------------------------------------

const UiRedressExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>UI redress</h2>
      <p>
        The attacker changes the visual context around a legitimate interface so that the user misinterprets the action.
      </p>
    </section>
  );
};

// Clickjacking is also called UI redress because the legitimate interface is
// visually repurposed.
//
// The underlying button is real.
//
// The application is real.
//
// The user's click is real.
//
// The deceptive part is the context in which the target interface is presented.

// ---------------------------------------------------------------------
// 3. The iframe attack model
// ---------------------------------------------------------------------

interface FrameAttack {
  readonly element: "iframe";
  readonly attackerControlsParent: boolean;
  readonly targetControlsEmbeddedDocument: boolean;
}

const frameAttack: FrameAttack = {
  element: "iframe",
  attackerControlsParent: true,
  targetControlsEmbeddedDocument: true,
};

const IframeAttackExample: FC = (): ReactElement => {
  return (
    <p>The attacker can attempt to place the target application inside an iframe controlled by the attacker's page.</p>
  );
};

// Conceptually:
//
// <iframe src="https://example.com/account"></iframe>
//
// The attacker controls the surrounding page.
//
// If the target permits the embedding, the target page can become part of the
// attacker's visual composition.

// ---------------------------------------------------------------------
// 4. Why authentication makes clickjacking dangerous
// ---------------------------------------------------------------------

interface AuthenticatedFrame {
  readonly userAuthenticated: boolean;
  readonly targetContainsSensitiveActions: boolean;
  readonly attackCanReuseUserAuthority: boolean;
}

const authenticatedFrame: AuthenticatedFrame = {
  userAuthenticated: true,
  targetContainsSensitiveActions: true,
  attackCanReuseUserAuthority: true,
};

const AuthenticatedClickjackingExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>User authenticated: {String(authenticatedFrame.userAuthenticated)}</li>
      <li>Sensitive actions available: {String(authenticatedFrame.targetContainsSensitiveActions)}</li>
      <li>Existing authority can matter: {String(authenticatedFrame.attackCanReuseUserAuthority)}</li>
    </ul>
  );
};

// If the target application is already authenticated, an embedded legitimate
// interface may contain actions available to that user.
//
// The attacker does not need to steal the session cookie.
//
// The attacker may instead try to make the user activate a legitimate control
// while the browser maintains the existing authenticated session.

// ---------------------------------------------------------------------
// 5. Clickjacking does not require stealing cookies
// ---------------------------------------------------------------------

const CookieTheftDistinction: FC = (): ReactElement => {
  return (
    <p>
      Clickjacking can abuse a user's existing authenticated session without requiring the attacker to read the session
      cookie.
    </p>
  );
};

// This is different from:
//
// cookie theft
//     → attacker obtains the credential
//
// clickjacking
//     → attacker manipulates the user's interaction with the authenticated UI
//
// HttpOnly can prevent JavaScript from directly reading an HttpOnly cookie, but
// it does not by itself prevent clickjacking.

// ---------------------------------------------------------------------
// 6. Sensitive actions are the main concern
// ---------------------------------------------------------------------

const sensitiveActions = [
  "Change email address",
  "Change password",
  "Disable MFA",
  "Delete account",
  "Confirm a payment",
] as const;

const SensitiveActionsExample: FC = (): ReactElement => {
  return (
    <ul>
      {sensitiveActions.map((action) => (
        <li key={action}>{action}</li>
      ))}
    </ul>
  );
};

// Clickjacking risk is particularly important when a page contains controls
// that perform meaningful state changes.
//
// The exact impact depends on:
//
// user privileges,
// available actions,
// authorization checks,
// confirmation requirements,
// and the application's framing policy.

// ---------------------------------------------------------------------
// 7. The primary defense: prevent framing
// ---------------------------------------------------------------------

interface FramingPolicy {
  readonly allowsEmbedding: boolean;
  readonly protectionEnabled: boolean;
}

const framingPolicy: FramingPolicy = {
  allowsEmbedding: false,
  protectionEnabled: true,
};

const FramingProtectionExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Embedding allowed: {String(framingPolicy.allowsEmbedding)}</li>
      <li>Protection enabled: {String(framingPolicy.protectionEnabled)}</li>
    </ul>
  );
};

// If a page does not need to be embedded, the simplest policy is:
//
// do not allow embedding.
//
// The server can communicate this policy through HTTP response headers.

// ---------------------------------------------------------------------
// 8. Content Security Policy frame-ancestors
// ---------------------------------------------------------------------

const frameAncestorsNone = "Content-Security-Policy: frame-ancestors 'none'";

const FrameAncestorsExample: FC = (): ReactElement => {
  return <pre>{frameAncestorsNone}</pre>;
};

// `frame-ancestors` controls which documents may embed the protected document.
//
// The strongest common policy is:
//
// Content-Security-Policy: frame-ancestors 'none'
//
// This prevents the protected document from being embedded.

// ---------------------------------------------------------------------
// 9. frame-ancestors self
// ---------------------------------------------------------------------

const frameAncestorsSelf = "Content-Security-Policy: frame-ancestors 'self'";

const FrameAncestorsSelfExample: FC = (): ReactElement => {
  return <pre>{frameAncestorsSelf}</pre>;
};

// Use:
//
// frame-ancestors 'self'
//
// when the application needs to be embedded by pages from the same origin.
//
// This still prevents unrelated origins from embedding the protected page.

// ---------------------------------------------------------------------
// 10. Allowing a trusted embedding origin
// ---------------------------------------------------------------------

const trustedEmbeddingPolicy = "Content-Security-Policy: frame-ancestors 'self' https://example.com";

const TrustedEmbeddingExample: FC = (): ReactElement => {
  return <pre>{trustedEmbeddingPolicy}</pre>;
};

// A page can explicitly allow trusted embedding origins:
//
// frame-ancestors 'self' https://example.com
//
// Only add origins that genuinely need to embed the protected content.
//
// The allowlist should be intentionally small.

// ---------------------------------------------------------------------
// 11. frame-ancestors is an HTTP response policy
// ---------------------------------------------------------------------

const FrameAncestorsHeaderExample: FC = (): ReactElement => {
  return <p>frame-ancestors should be delivered as part of the Content-Security-Policy response header.</p>;
};

// Do not attempt:
//
// <meta
//     httpEquiv="Content-Security-Policy"
//     content="frame-ancestors 'none'"
// />
//
// `frame-ancestors` is not supported through a meta element.
//
// Configure the directive in the HTTP response.

// ---------------------------------------------------------------------
// 12. frame-src versus frame-ancestors
// ---------------------------------------------------------------------

interface FrameDirectiveComparison {
  readonly frameAncestors: string;
  readonly frameSrc: string;
}

const frameDirectiveComparison: FrameDirectiveComparison = {
  frameAncestors: "Controls who may embed this document",
  frameSrc: "Controls which sources this document may embed",
};

const FrameDirectiveComparisonExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>frame-ancestors: {frameDirectiveComparison.frameAncestors}</li>
      <li>frame-src: {frameDirectiveComparison.frameSrc}</li>
    </ul>
  );
};

// These directives describe opposite sides of an embedding relationship.
//
// frame-ancestors:
//
// "Who may embed me?"
//
// frame-src:
//
// "Which frames may I load?"

// ---------------------------------------------------------------------
// 13. frame-ancestors does not fall back to default-src
// ---------------------------------------------------------------------

const frameAncestorsFallbackExample: FC = (): ReactElement => {
  return <p>frame-ancestors must be configured explicitly; default-src does not provide its fallback behavior.</p>;
};

// This does not automatically define an embedding policy:
//
// Content-Security-Policy: default-src 'self'
//
// If framing must be restricted, specify:
//
// frame-ancestors 'none'
//
// or another intentional allowlist.

// ---------------------------------------------------------------------
// 14. X-Frame-Options
// ---------------------------------------------------------------------

const xFrameOptionsDeny = "X-Frame-Options: DENY";

const XFrameOptionsExample: FC = (): ReactElement => {
  return <pre>{xFrameOptionsDeny}</pre>;
};

// X-Frame-Options is a legacy response header for controlling framing.
//
// Common values:
//
// X-Frame-Options: DENY
//
// X-Frame-Options: SAMEORIGIN
//
// `DENY` blocks framing entirely.
//
// `SAMEORIGIN` permits same-origin framing.

// ---------------------------------------------------------------------
// 15. X-Frame-Options SAMEORIGIN
// ---------------------------------------------------------------------

const xFrameOptionsSameOrigin = "X-Frame-Options: SAMEORIGIN";

const SameOriginFrameExample: FC = (): ReactElement => {
  return <pre>{xFrameOptionsSameOrigin}</pre>;
};

// SAMEORIGIN allows the document to be framed by a page from the same origin.
//
// It does not provide the flexible multi-origin allowlist supported by
// CSP frame-ancestors.

// ---------------------------------------------------------------------
// 16. X-Frame-Options ALLOW-FROM
// ---------------------------------------------------------------------

const obsoleteXFrameOption = "X-Frame-Options: ALLOW-FROM https://example.com";

const ObsoleteXFrameOptionExample: FC = (): ReactElement => {
  return <p>X-Frame-Options ALLOW-FROM is obsolete and should not be used for modern framing policies.</p>;
};

// Do not build a current security policy around:
//
// X-Frame-Options: ALLOW-FROM ...
//
// Use CSP frame-ancestors for configurable framing policies.

// ---------------------------------------------------------------------
// 17. CSP frame-ancestors versus X-Frame-Options
// ---------------------------------------------------------------------

interface FrameProtectionComparison {
  readonly csp: string;
  readonly xFrameOptions: string;
}

const frameProtectionComparison: FrameProtectionComparison = {
  csp: "Flexible framing policy",
  xFrameOptions: "Older and less flexible framing policy",
};

const FrameProtectionComparisonExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>CSP frame-ancestors: {frameProtectionComparison.csp}</li>
      <li>X-Frame-Options: {frameProtectionComparison.xFrameOptions}</li>
    </ul>
  );
};

// CSP frame-ancestors is the modern mechanism for controlling which origins
// may embed a page.
//
// X-Frame-Options remains useful as a defense-in-depth compatibility header.
//
// When both are present, browsers supporting frame-ancestors use that CSP
// policy for the framing decision.

// ---------------------------------------------------------------------
// 18. Deny framing by default
// ---------------------------------------------------------------------

const defaultFramePolicy = "Content-Security-Policy: frame-ancestors 'none';";

const DefaultFramePolicyExample: FC = (): ReactElement => {
  return <pre>{defaultFramePolicy}</pre>;
};

// If a page does not have a legitimate embedding requirement:
//
// frame-ancestors 'none'
//
// is a straightforward policy.
//
// A security policy should not permit framing merely because an embedding
// requirement has not yet been considered.

// ---------------------------------------------------------------------
// 19. Protect sensitive application pages
// ---------------------------------------------------------------------

const protectedPages = ["/account", "/settings", "/security", "/billing"] as const;

const ProtectedPagesExample: FC = (): ReactElement => {
  return (
    <ul>
      {protectedPages.map((path) => (
        <li key={path}>{path}</li>
      ))}
    </ul>
  );
};

// Pages containing sensitive authenticated actions should generally have
// explicit framing restrictions.
//
// Examples:
//
// account settings,
// security settings,
// payment confirmation,
// administrative controls.

// ---------------------------------------------------------------------
// 20. Not every response has the same clickjacking risk
// ---------------------------------------------------------------------

interface ResponseRisk {
  readonly response: "interactive HTML" | "JSON API" | "redirect";
  readonly framingInteraction: boolean;
}

const responseRisks: readonly ResponseRisk[] = [
  {
    response: "interactive HTML",
    framingInteraction: true,
  },
  {
    response: "JSON API",
    framingInteraction: false,
  },
  {
    response: "redirect",
    framingInteraction: false,
  },
];

const ResponseRiskExample: FC = (): ReactElement => {
  return (
    <ul>
      {responseRisks.map((item) => (
        <li key={item.response}>
          {item.response}:{" "}
          {item.framingInteraction ? "can contain interactive UI" : "does not normally provide interactive framed UI"}
        </li>
      ))}
    </ul>
  );
};

// Clickjacking is fundamentally about deceptive interaction with rendered
// content.
//
// An API returning JSON is not normally the target of a frame-based UI
// redress attack in the same way as an interactive HTML page.

// ---------------------------------------------------------------------
// 21. SameSite cookies as defense in depth
// ---------------------------------------------------------------------

interface SameSiteCookiePolicy {
  readonly sameSite: "Strict" | "Lax";
  readonly reducesCrossSiteCookieSending: boolean;
}

const sameSiteCookiePolicy: SameSiteCookiePolicy = {
  sameSite: "Lax",
  reducesCrossSiteCookieSending: true,
};

const SameSiteClickjackingExample: FC = (): ReactElement => {
  return (
    <p>
      SameSite=Lax or SameSite=Strict can provide additional protection by restricting when session cookies accompany
      cross-site requests.
    </p>
  );
};

// SameSite is not a replacement for framing protection.
//
// It is useful defense in depth because an embedded cross-site document may
// not receive a SameSite-restricted session cookie.
//
// The exact behavior depends on the SameSite mode and request context.

// ---------------------------------------------------------------------
// 22. SameSite does not prevent UI redress
// ---------------------------------------------------------------------

const SameSiteLimitation: FC = (): ReactElement => {
  return (
    <p>
      SameSite does not stop an attacker from visually presenting an embedded interface; it limits when cookies
      accompany requests.
    </p>
  );
};

// Two different controls:
//
// frame-ancestors
//     → controls whether the page can be embedded
//
// SameSite
//     → controls cookie inclusion in cross-site contexts
//
// They protect different parts of the attack.

// ---------------------------------------------------------------------
// 23. HttpOnly does not prevent clickjacking
// ---------------------------------------------------------------------

const HttpOnlyClickjackingLimitation: FC = (): ReactElement => {
  return (
    <p>
      HttpOnly protects cookie confidentiality from JavaScript but does not prevent a legitimate page from being
      embedded.
    </p>
  );
};

// An attacker does not need:
//
// document.cookie
//
// to perform frame-based clickjacking.
//
// The target page can remain authenticated while embedded.

// ---------------------------------------------------------------------
// 24. Secure does not prevent clickjacking
// ---------------------------------------------------------------------

const SecureClickjackingLimitation: FC = (): ReactElement => {
  return (
    <p>Secure protects cookie transmission over HTTPS but does not control which pages may embed the application.</p>
  );
};

// Secure:
//
// transport protection
//
// frame-ancestors:
//
// embedding protection
//
// These are separate security controls.

// ---------------------------------------------------------------------
// 25. Frame busting scripts
// ---------------------------------------------------------------------

const FrameBustingExample: FC = (): ReactElement => {
  return (
    <p>
      Client-side frame-busting scripts can provide legacy-browser defense in specific circumstances but should not
      replace HTTP framing policy.
    </p>
  );
};

// Historical frame-busting patterns attempted to detect:
//
// window.top !== window.self
//
// and navigate the page out of the frame.
//
// Modern applications should prefer server-enforced:
//
// Content-Security-Policy: frame-ancestors ...
//
// and, where useful:
//
// X-Frame-Options: DENY
//
// Client-side frame busting is not equivalent to a browser-enforced framing
// policy.

// ---------------------------------------------------------------------
// 26. Why frame busting is weaker
// ---------------------------------------------------------------------

const FrameBustingLimitation: FC = (): ReactElement => {
  return (
    <p>
      Client-side frame-busting logic executes after the document has started loading and can be affected by browser
      framing behavior.
    </p>
  );
};

// A security boundary should be enforced before the protected application is
// made available for deceptive framing.
//
// Server-delivered framing policy is therefore preferable to relying on
// JavaScript to detect and escape an iframe.

// ---------------------------------------------------------------------
// 27. Do not use meta X-Frame-Options
// ---------------------------------------------------------------------

const MetaHeaderMistake: FC = (): ReactElement => {
  return <p>X-Frame-Options is an HTTP response header and should not be configured through a meta element.</p>;
};

// This does not provide the intended X-Frame-Options protection:
//
// <meta http-equiv="X-Frame-Options" content="DENY" />
//
// Configure the actual response header on the server or at the relevant
// reverse-proxy/web-server layer.

// ---------------------------------------------------------------------
// 28. Framing policy belongs at the HTTP boundary
// ---------------------------------------------------------------------

interface HttpSecurityPolicy {
  readonly frameAncestors: string;
  readonly xFrameOptions: string;
}

const httpSecurityPolicy: HttpSecurityPolicy = {
  frameAncestors: "'none'",
  xFrameOptions: "DENY",
};

const HttpBoundaryExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>frame-ancestors: {httpSecurityPolicy.frameAncestors}</li>
      <li>X-Frame-Options: {httpSecurityPolicy.xFrameOptions}</li>
    </ul>
  );
};

// React renders application content.
//
// The server or deployment layer controls the HTTP response headers.
//
// Therefore clickjacking protection should be configured where the application's
// HTTP responses are generated or modified.

// ---------------------------------------------------------------------
// 29. Embedding requirements must be explicit
// ---------------------------------------------------------------------

type EmbeddingRequirement = "none" | "same-origin" | "trusted-origin";

interface ApplicationEmbeddingPolicy {
  readonly requirement: EmbeddingRequirement;
}

const applicationEmbeddingPolicy: ApplicationEmbeddingPolicy = {
  requirement: "none",
};

const EmbeddingRequirementExample: FC = (): ReactElement => {
  return <p>An application should explicitly determine whether a page needs to be embedded and by whom.</p>;
};

// Possible policies:
//
// none
//     → frame-ancestors 'none'
//
// same-origin
//     → frame-ancestors 'self'
//
// trusted origin
//     → frame-ancestors 'self' https://example.com
//
// Avoid broad allowlists when a narrower policy is sufficient.

// ---------------------------------------------------------------------
// 30. Do not allow arbitrary framing origins
// ---------------------------------------------------------------------

const ArbitraryFramingExample: FC = (): ReactElement => {
  return <p>Framing policies should not allow arbitrary origins merely for convenience.</p>;
};

// A policy such as:
//
// frame-ancestors *
//
// defeats the purpose of restricting embedding.
//
// Explicitly identify the origins that genuinely require access.

// ---------------------------------------------------------------------
// 31. Nested frames
// ---------------------------------------------------------------------

interface NestedFramePolicy {
  readonly ancestorCount: number;
  readonly allAncestorsMustMatch: boolean;
}

const nestedFramePolicy: NestedFramePolicy = {
  ancestorCount: 2,
  allAncestorsMustMatch: true,
};

const NestedFrameExample: FC = (): ReactElement => {
  return (
    <p>
      frame-ancestors evaluates the embedding ancestor chain, so nested framing must satisfy the policy at each relevant
      level.
    </p>
  );
};

// Consider:
//
// attacker
//   ↓
// trusted.example
//   ↓
// target.example
//
// The target's framing policy is evaluated against the ancestor chain.
//
// Allowing one immediate parent does not mean arbitrary outer ancestors are
// automatically trusted.

// ---------------------------------------------------------------------
// 32. Third-party widgets
// ---------------------------------------------------------------------

interface WidgetEmbeddingPolicy {
  readonly widgetRequiresEmbedding: boolean;
  readonly parentIsTrusted: boolean;
}

const widgetEmbeddingPolicy: WidgetEmbeddingPolicy = {
  widgetRequiresEmbedding: true,
  parentIsTrusted: true,
};

const WidgetEmbeddingExample: FC = (): ReactElement => {
  return (
    <p>Legitimate embedded widgets require an explicit framing policy that permits the intended parent origins.</p>
  );
};

// Some applications genuinely need framing:
//
// dashboards,
// payment widgets,
// identity flows,
// embedded reports,
// partner integrations.
//
// In these cases:
//
// do not disable framing protection globally.
//
// Instead, define the smallest legitimate embedding policy for the relevant
// resource.

// ---------------------------------------------------------------------
// 33. Separate embeddable and non-embeddable pages
// ---------------------------------------------------------------------

const embeddablePages = ["/widgets/profile", "/widgets/report"] as const;

const nonEmbeddablePages = ["/account/security", "/account/password", "/account/delete"] as const;

const PageFramingPolicyExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Embedding policy</h2>

      <p>Embeddable: {embeddablePages.join(", ")}</p>

      <p>Non-embeddable: {nonEmbeddablePages.join(", ")}</p>
    </section>
  );
};

// Framing policy can be applied according to the page's actual purpose.
//
// A widget that must be embedded should not force the entire application to
// become embeddable.

// ---------------------------------------------------------------------
// 34. Server-side authorization still matters
// ---------------------------------------------------------------------

interface SensitiveOperation {
  readonly authenticated: boolean;
  readonly authorized: boolean;
  readonly framingAllowed: boolean;
}

const sensitiveOperation: SensitiveOperation = {
  authenticated: true,
  authorized: true,
  framingAllowed: false,
};

const ServerAuthorizationExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Authenticated: {String(sensitiveOperation.authenticated)}</li>
      <li>Authorized: {String(sensitiveOperation.authorized)}</li>
      <li>Framing allowed: {String(sensitiveOperation.framingAllowed)}</li>
    </ul>
  );
};

// Framing protection is not authorization.
//
// Even if framing is completely prevented, every sensitive server endpoint
// must still enforce authentication and authorization independently.

// ---------------------------------------------------------------------
// 35. Sensitive actions need transaction authorization
// ---------------------------------------------------------------------

const TransactionAuthorizationExample: FC = (): ReactElement => {
  return (
    <p>
      High-risk operations should have explicit server-side authorization and, where appropriate, additional transaction
      authorization.
    </p>
  );
};

// Particularly sensitive operations can require:
//
// reauthentication,
// MFA,
// transaction confirmation,
// explicit display of important details.
//
// A confirmation control alone is not a substitute for server-side
// authorization.

// ---------------------------------------------------------------------
// 36. Double-clickjacking
// ---------------------------------------------------------------------

const DoubleClickjackingExample: FC = (): ReactElement => {
  return (
    <p>
      DoubleClickjacking uses a different interaction model and is not prevented by ordinary iframe framing restrictions
      alone.
    </p>
  );
};

// Traditional clickjacking:
//
// target page embedded in an attacker-controlled frame
//
// DoubleClickjacking:
//
// attacker manipulates separate windows or interaction timing so that a user's
// double-click activates a sensitive control.
//
// Because the target can remain top-level, frame-ancestors and X-Frame-Options
// do not by themselves address this variant.

// ---------------------------------------------------------------------
// 37. High-risk action confirmation
// ---------------------------------------------------------------------

interface SensitiveActionConfirmation {
  readonly action: string;
  readonly requiresExplicitAuthorization: boolean;
}

const sensitiveActionConfirmation: SensitiveActionConfirmation = {
  action: "Confirm payment",
  requiresExplicitAuthorization: true,
};

const SensitiveActionConfirmationExample: FC = (): ReactElement => {
  return (
    <p>
      Sensitive actions can require the user to review important details and complete an explicit authorization step.
    </p>
  );
};

// For high-risk operations, the server should authorize the actual transaction
// rather than relying only on the visual state of a button.
//
// The authorization should be bound to the operation the user intends to
// approve.

// ---------------------------------------------------------------------
// 38. Disabled controls as supplementary mitigation
// ---------------------------------------------------------------------

const DisabledControlExample: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Confirm sensitive action
    </button>
  );
};

// A sensitive control can be disabled until the application has established
// an appropriate interaction state.
//
// This can be useful as supplementary defense in specific designs.
//
// It is not a replacement for:
//
// frame-ancestors,
// authorization,
// transaction validation.

// ---------------------------------------------------------------------
// 39. Do not rely on mouse movement alone
// ---------------------------------------------------------------------

const InteractionValidationExample: FC = (): ReactElement => {
  return (
    <p>
      Mouse movement or a key press alone does not prove that the user understands or approves a sensitive transaction.
    </p>
  );
};

// A mitigation should account for:
//
// mouse,
// keyboard,
// touch,
// assistive technology.
//
// More importantly, the server must still authorize the requested operation.

// ---------------------------------------------------------------------
// 40. Same-origin iframe testing
// ---------------------------------------------------------------------

interface FrameTest {
  readonly source: string;
  readonly expected: "allowed" | "blocked";
}

const frameTests: readonly FrameTest[] = [
  {
    source: "same-origin",
    expected: "blocked",
  },
  {
    source: "trusted-origin",
    expected: "blocked",
  },
  {
    source: "untrusted-origin",
    expected: "blocked",
  },
];

const FrameTestingExample: FC = (): ReactElement => {
  return (
    <ul>
      {frameTests.map((test) => (
        <li key={test.source}>
          {test.source}: {test.expected}
        </li>
      ))}
    </ul>
  );
};

// The expected result depends on the configured policy.
//
// For:
//
// frame-ancestors 'none'
//
// every framing attempt should be blocked.
//
// For:
//
// frame-ancestors 'self'
//
// same-origin framing should be allowed while unrelated origins should be
// blocked.

// ---------------------------------------------------------------------
// 41. Test the actual HTTP response
// ---------------------------------------------------------------------

const HeaderTestingExample: FC = (): ReactElement => {
  return (
    <p>Clickjacking tests should inspect the actual HTTP response headers, not only the React component source.</p>
  );
};

// Verify the deployed response contains the intended policy:
//
// Content-Security-Policy: frame-ancestors 'none'
//
// and, where used:
//
// X-Frame-Options: DENY
//
// Security headers can be changed by:
//
// reverse proxies,
// CDNs,
// web servers,
// middleware,
// application frameworks.
//
// Test the final response received by the browser.

// ---------------------------------------------------------------------
// 42. Test every relevant page
// ---------------------------------------------------------------------

const pagesToTest = ["/", "/account", "/settings", "/security", "/billing"] as const;

const PageTestingExample: FC = (): ReactElement => {
  return (
    <ul>
      {pagesToTest.map((path) => (
        <li key={path}>{path}</li>
      ))}
    </ul>
  );
};

// Do not verify framing protection on only one route if different middleware,
// templates, or response paths can produce different headers.
//
// Test representative sensitive pages and any pages with intentionally
// different embedding requirements.

// ---------------------------------------------------------------------
// 43. Avoid inconsistent policies
// ---------------------------------------------------------------------

interface DeploymentPolicy {
  readonly applicationPolicy: string;
  readonly proxyPolicy: string;
}

const deploymentPolicy: DeploymentPolicy = {
  applicationPolicy: "frame-ancestors 'none'",
  proxyPolicy: "frame-ancestors 'none'",
};

const DeploymentPolicyExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Application: {deploymentPolicy.applicationPolicy}</li>
      <li>Proxy: {deploymentPolicy.proxyPolicy}</li>
    </ul>
  );
};

// Multiple infrastructure layers can modify response headers.
//
// Keep the effective policy predictable.
//
// Avoid situations where:
//
// application says DENY
// proxy removes the header
// CDN adds a different policy
//
// Verify the final browser-visible response.

// ---------------------------------------------------------------------
// 44. CSP report-only does not enforce protection
// ---------------------------------------------------------------------

const ReportOnlyExample: FC = (): ReactElement => {
  return <p>Content-Security-Policy-Report-Only reports violations but does not enforce frame-ancestors blocking.</p>;
};

// Report-only is useful for observing the effect of a proposed policy.
//
// But:
//
// Content-Security-Policy-Report-Only
//
// does not provide the enforcement behavior of:
//
// Content-Security-Policy
//
// Move to an enforcing policy when the deployment has been validated.

// ---------------------------------------------------------------------
// 45. Clickjacking and XSS
// ---------------------------------------------------------------------

interface SecurityControlComparison {
  readonly clickjacking: string;
  readonly xss: string;
}

const securityControlComparison: SecurityControlComparison = {
  clickjacking: "Restrict deceptive embedding and UI redress",
  xss: "Prevent attacker-controlled script execution",
};

const ClickjackingVsXssExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Clickjacking: {securityControlComparison.clickjacking}</li>
      <li>XSS: {securityControlComparison.xss}</li>
    </ul>
  );
};

// These are different attack classes.
//
// Clickjacking:
//
// attacker-controlled embedding
//     ↓
// deceptive interaction
//
// XSS:
//
// attacker-controlled content
//     ↓
// JavaScript execution in the target origin
//
// An application can require defenses against both.

// ---------------------------------------------------------------------
// 46. Clickjacking and CSRF
// ---------------------------------------------------------------------

const ClickjackingVsCsrfExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Clickjacking: manipulates the user's interaction with embedded UI.</li>
      <li>CSRF: causes an authenticated request from an unintended context.</li>
    </ul>
  );
};

// Clickjacking and CSRF can overlap in impact but are not identical.
//
// A clickjacking attack can cause a user to intentionally perform a real click
// on a legitimate control.
//
// CSRF generally attempts to cause a request without requiring the user to
// understand or directly interact with the target control.

// ---------------------------------------------------------------------
// 47. Defense-in-depth model
// ---------------------------------------------------------------------

interface ClickjackingDefense {
  readonly framingPolicy: boolean;
  readonly sameSiteCookie: boolean;
  readonly authorization: boolean;
  readonly transactionValidation: boolean;
}

const clickjackingDefense: ClickjackingDefense = {
  framingPolicy: true,
  sameSiteCookie: true,
  authorization: true,
  transactionValidation: true,
};

const DefenseInDepthExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Framing policy: {String(clickjackingDefense.framingPolicy)}</li>
      <li>SameSite cookie: {String(clickjackingDefense.sameSiteCookie)}</li>
      <li>Server authorization: {String(clickjackingDefense.authorization)}</li>
      <li>Transaction validation: {String(clickjackingDefense.transactionValidation)}</li>
    </ul>
  );
};

// A layered design can include:
//
// frame-ancestors
//     +
// X-Frame-Options
//     +
// SameSite
//     +
// server-side authorization
//     +
// transaction authorization
//
// Each control addresses a different part of the security problem.

// ---------------------------------------------------------------------
// 48. React does not configure response headers
// ---------------------------------------------------------------------

const ReactHeaderBoundaryExample: FC = (): ReactElement => {
  return (
    <p>
      Rendering a React component does not automatically set Content-Security-Policy or X-Frame-Options response
      headers.
    </p>
  );
};

// The security policy belongs to the HTTP response.
//
// Depending on the deployment, headers can be configured by:
//
// application middleware,
// server framework,
// reverse proxy,
// CDN,
// web server.
//
// React components remain responsible for the UI itself.

// ---------------------------------------------------------------------
// 49. Integrated protected application
// ---------------------------------------------------------------------

interface AccountSettingsProps {
  readonly userName: string;
}

const AccountSettings = ({ userName }: AccountSettingsProps): ReactElement => {
  const [status, setStatus] = useState<"idle" | "confirmed">("idle");

  const confirmSecurityChange = (): void => {
    setStatus("confirmed");
  };

  return (
    <section>
      <h2>Account security</h2>

      <p>Signed in as {userName}</p>

      <button type="button" onClick={confirmSecurityChange}>
        Confirm security change
      </button>

      <p role="status">
        {status === "idle" && "No security change confirmed"}
        {status === "confirmed" && "Security change confirmed"}
      </p>
    </section>
  );
};

const ClickjackingProtectionDemo: FC = (): ReactElement => {
  return <AccountSettings userName="John Doe" />;
};

export default ClickjackingProtectionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Clickjacking is a UI redress attack in which an attacker attempts to make a user interact with a legitimate application through a deceptive visual context.
// - Frame-based clickjacking commonly depends on embedding the target application inside an attacker-controlled iframe.
// - An authenticated target can be especially sensitive because the browser may already have access to the user's legitimate session.
// - Clickjacking does not require the attacker to steal or read the user's session cookie.
// - The primary defense for frame-based clickjacking is controlling which documents may embed the protected page.
// - Content-Security-Policy frame-ancestors is the modern mechanism for defining an application's framing policy.
// - frame-ancestors 'none' prevents the protected document from being embedded.
// - frame-ancestors 'self' permits same-origin embedding.
// - frame-ancestors can explicitly allow selected trusted origins when legitimate embedding is required.
// - frame-ancestors is an HTTP response policy and is not supported through a meta element.
// - frame-ancestors does not fall back to default-src.
// - frame-ancestors and frame-src solve different problems: one controls who may embed the page, while the other controls what the page may embed.
// - X-Frame-Options supports DENY and SAMEORIGIN as its useful modern policies.
// - X-Frame-Options ALLOW-FROM is obsolete and should not be used for modern framing policies.
// - CSP frame-ancestors provides more flexible framing control than X-Frame-Options.
// - X-Frame-Options can still provide defense in depth and compatibility with browsers that do not support the modern CSP directive.
// - If a page does not need to be embedded, a restrictive framing policy should be the default.
// - Sensitive authenticated pages should generally have explicit framing restrictions.
// - Interactive HTML is more directly relevant to frame-based clickjacking than a JSON API response.
// - SameSite cookies can provide additional protection by restricting when session cookies accompany cross-site requests.
// - SameSite does not itself prevent an attacker from visually embedding a page; it controls cookie inclusion in relevant cross-site contexts.
// - HttpOnly protects cookie confidentiality from JavaScript but does not prevent clickjacking.
// - Secure protects cookie transmission over HTTPS but does not control framing.
// - Client-side frame-busting scripts are weaker than server-enforced framing policies and should not replace them.
// - X-Frame-Options must be delivered as an HTTP response header rather than configured through a meta element.
// - Framing requirements should be explicit: pages can be non-embeddable, same-origin embeddable, or embeddable by specific trusted origins.
// - Arbitrary framing origins should not be allowed merely for convenience.
// - Nested frames are subject to the frame-ancestors policy across the relevant ancestor chain.
// - Legitimate widgets should receive narrowly scoped embedding policies rather than making the entire application embeddable.
// - Framing protection does not replace authentication or server-side authorization.
// - Highly sensitive operations can require additional transaction authorization, reauthentication, or MFA.
// - DoubleClickjacking is a distinct interaction attack that is not prevented by iframe framing restrictions alone.
// - Supplementary interaction controls should not be treated as a replacement for server-side authorization.
// - Security testing should inspect the actual HTTP response headers delivered to the browser.
// - Different routes and infrastructure layers can produce different effective security headers, so representative sensitive pages should be tested.
// - Content-Security-Policy-Report-Only observes violations but does not enforce the framing restriction.
// - Clickjacking, XSS, and CSRF are different attack classes and require different primary defenses.
// - A defense-in-depth strategy can combine framing restrictions, secure session cookies, server-side authorization, and explicit authorization of sensitive transactions.

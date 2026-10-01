# Frontend Deployment

Frontend deployment is the process of delivering a production build of a web application to users. It connects the build artifact, hosting infrastructure, domain, HTTPS, caching, configuration, and release process.

## 1. Production build

A deployment normally starts by creating a production build.

```text
Source code
    ↓
Install dependencies
    ↓
Build application
    ↓
Static assets / generated files
    ↓
Deploy artifact
```

The deployment should use the exact artifact produced by the build rather than rebuilding it differently for each environment.

## 2. Static hosting

A typical React application produces static assets:

```text
index.html
assets/
├── index-abc123.js
├── index-def456.css
└── logo-789xyz.svg
```

These files can be served by a CDN, object storage service, web server, or static hosting platform.

Static hosting is appropriate when application rendering happens in the browser.

## 3. SPA routing

A single-page application usually needs a fallback to `index.html`.

For example:

```text
GET /products
        ↓
        └── index.html
                ↓
             React Router
```

Without the fallback, directly requesting `/products` may produce a server-side `404` even though the client application has a route for it.

## 4. HTTPS and domain

Production applications should normally be served through HTTPS.

```text
https://example.com
```

HTTPS protects data in transit and is required for many browser capabilities and security mechanisms.

## 5. CDN delivery

A CDN can serve static assets from geographically distributed locations.

```text
User
  ↓
CDN
  ↓
Cached frontend assets
```

Immutable, hashed assets are particularly suitable for aggressive caching.

## 6. Cache headers

Different resources can have different caching policies.

| Resource       | Typical strategy          |
| -------------- | ------------------------- |
| Hashed JS/CSS  | Long-lived cache          |
| Images         | Long-lived when versioned |
| `index.html`   | Shorter cache             |
| Runtime config | Explicitly controlled     |

The HTML entry point often needs fresher caching than immutable assets.

## 7. Asset hashing

Build systems commonly generate content-hashed filenames:

```text
app-a81f3c.js
app-92bc10.css
```

When the content changes, the filename changes.

This allows old assets to remain cached while new deployments use new filenames.

## 8. Runtime configuration

A frontend can receive configuration after deployment:

```text
Browser
   ↓
/config.json
   ↓
API URL / feature configuration
```

This allows the same build artifact to be deployed to multiple environments.

Never treat browser-delivered configuration as secret. Users can inspect everything delivered to their browser.

## 9. Deployment strategies

Common strategies include:

```text
Rolling deployment
Blue/green deployment
Canary deployment
Atomic deployment
```

The appropriate strategy depends on infrastructure, rollback requirements, traffic patterns, and operational constraints.

## 10. Rollbacks

A deployment should have a known rollback path.

```text
Release A
   ↓
Release B
   ↓
Problem detected
   ↓
Restore Release A
```

Keeping previous immutable artifacts makes rollback simpler and more reliable.

## 11. Deployment checklist

Before releasing:

- Build in production mode.
- Verify the generated artifact.
- Validate runtime configuration.
- Confirm SPA fallback routing.
- Verify HTTPS.
- Check cache headers.
- Verify source-map handling.
- Confirm monitoring and error reporting.
- Test the deployed application.
- Keep the previous release available for rollback.

## Summary

Frontend deployment delivers a production artifact through hosting infrastructure to the browser. A reliable deployment accounts for SPA routing, HTTPS, CDN and caching behavior, runtime configuration, release identity, monitoring, and rollback rather than treating deployment as simply uploading files.

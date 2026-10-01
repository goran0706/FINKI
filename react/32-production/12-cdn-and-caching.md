# CDN and Caching

A CDN distributes frontend assets through geographically distributed edge servers. Caching allows browsers and CDNs to reuse previously downloaded resources instead of requesting them again.

## 1. CDN

A typical request flow is:

```text
Browser
   ↓
CDN edge
   ↓
Origin server
```

If the CDN has the requested resource cached, it can respond without contacting the origin.

## 2. What to cache

Frontend applications commonly contain:

```text
JavaScript
CSS
Images
Fonts
HTML
Runtime configuration
```

These resources do not necessarily need the same caching policy.

## 3. Cache-Control

HTTP caching is primarily controlled through `Cache-Control`.

Example:

```http
Cache-Control: public, max-age=31536000, immutable
```

This is appropriate for versioned, content-hashed assets that will never change at the same URL.

## 4. Hashed assets

Build tools commonly generate filenames such as:

```text
app-a81f3c.js
styles-92bc10.css
```

When the content changes, the filename changes.

Therefore an old asset can remain cached while the new deployment references a new filename.

## 5. HTML caching

`index.html` is different.

```http
Cache-Control: no-cache
```

or a short cache lifetime can ensure that browsers obtain relatively fresh deployment information.

The HTML usually references the current hashed assets.

## 6. Cache hierarchy

A request may pass through multiple caches:

```text
Browser cache
      ↓
CDN cache
      ↓
Origin
```

A stale response at any layer can affect what the user receives.

## 7. Cache invalidation

Changing an asset does not necessarily invalidate every existing cached copy immediately.

Content hashing avoids much of this problem:

```text
Old: app-a81f3c.js
New: app-b72d91.js
```

The URLs are different, so the CDN can safely cache both versions.

## 8. CDN versus browser cache

A CDN primarily reduces distance and origin traffic.

A browser cache can avoid the network request entirely.

Both can improve load performance, but they operate at different layers.

## 9. Compression

CDNs commonly serve compressed responses when supported:

```text
Brotli
Gzip
```

Compression reduces transfer size but does not change the underlying cached resource.

## 10. Cache keys

A CDN determines whether two requests represent the same cached resource using a cache key.

The key can depend on information such as:

```text
URL
query parameters
HTTP method
selected headers
```

Incorrect cache-key configuration can cause users to receive the wrong response.

## 11. Dynamic content

Not every response should be publicly cached.

Be careful with:

```text
Authenticated responses
Personalized content
User-specific data
Sensitive API responses
```

Caching such responses incorrectly can expose one user's data to another user.

## 12. Cache-Control directives

Common directives include:

| Directive   | Meaning                              |
| ----------- | ------------------------------------ |
| `public`    | Can be cached by shared caches       |
| `private`   | Intended for a private cache         |
| `no-cache`  | Must be revalidated before reuse     |
| `no-store`  | Do not store the response            |
| `max-age`   | Freshness lifetime                   |
| `immutable` | Resource will not change at this URL |

`no-cache` does not mean "do not cache"; it means the cached response must be validated before reuse.

## 13. Purging

CDNs can provide cache invalidation or purge mechanisms.

Purging can be useful when:

- a resource was cached incorrectly;
- an emergency change is required;
- an asset was deployed under an incorrect URL.

Content hashing should remain the normal strategy for versioned static assets rather than relying on frequent manual purges.

## 14. Deployment relationship

A deployment can produce:

```text
index.html
app-a81f3c.js
styles-92bc10.css
```

The HTML should reference the exact assets belonging to that release.

A deployment that mixes HTML from one release with assets from another can produce runtime failures.

## 15. Common mistakes

Avoid:

- Long caching for mutable `index.html`.
- Long caching for unversioned JavaScript.
- Caching personalized responses publicly.
- Ignoring CDN cache keys.
- Assuming `no-cache` means `no-store`.
- Deploying HTML and assets inconsistently.
- Depending entirely on manual cache purges.

## Summary

CDNs reduce latency and origin traffic by serving cached resources closer to users. Browser and CDN caching operate at different layers, and each resource should have an appropriate policy.

Content-hashed static assets can generally use long-lived caching, while the HTML entry point usually requires fresher validation. Correct cache keys, cache-control directives, deployment consistency, and protection of personalized data are essential for reliable frontend caching.

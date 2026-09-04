# Network Request Mocking and Service Virtualization

Network request mocking and service virtualization are critical techniques for isolating applications during local
development, automated testing, and CI/CD pipelines. Rather than relying on live backend infrastructure—which introduces
flakiness, network latency, and environment state dependency—developers simulate network layer interactions. Modern
tooling spans a spectrum from in-process network interception (intercepting requests directly in the browser or runtime
memory) to external service virtualization (spinning up standalone HTTP mock servers via API clients or schema-driven
engines).

| Mocking Strategy                | Representative Tools       | Interception Layer            | Operational Mechanism                                                                                    | Best Use Case                                                                         |
|:--------------------------------|:---------------------------|:------------------------------|:---------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------|
| **Service Worker Interception** | MSW (Mock Service Worker)  | Browser Network Layer         | Intercepts `fetch` events via a browser Service Worker without modifying application code or base URLs.  | Automated frontend unit/integration tests (Jest, Vitest, Playwright), offline UI dev. |
| **Runtime Process Patching**    | Nock, MSW (Node mode)      | Node.js Runtime Memory        | Overrides low-level Node.js `http.ClientRequest` modules to catch outgoing requests at the socket level. | Server-side integration testing, backend microservice testing.                        |
| **Schema-Driven Mock Servers**  | Prism (Stoplight), Mockoon | External Local Server         | Reads OpenAPI/Swagger specs and spins up a local HTTP server with automatic contract/payload validation. | Prototyping before backend implementation, contract compliance testing.               |
| **API Client Mocking**          | Postman, Insomnia          | Cloud / Out-of-Process Server | Hosts mock endpoints in a cloud or local proxy server based on saved request/response examples.          | Manual QA, multi-team documentation, early API integration prototyping.               |
| **Enterprise Virtualization**   | WireMock, Hoverfly         | Standalone Proxy / Gateway    | Records live network traffic and replays stateful HTTP interactions with advanced stubbing rules.        | Microservices integration, fault injection, performance/chaos testing.                |

## In-Process Interception vs. External Mock Servers

The primary architectural distinction between mocking tools lies in **where and how** request interception occurs:

* **In-Process Interceptors (e.g., MSW, Nock):** Intercept network calls directly inside the execution thread (e.g.,
  browser Service Worker or Node.js process). Your application makes requests to real URLs (`https://api.example.com`),
  but the request is caught locally before hitting the wire. This introduces zero network socket overhead and requires
  no environment configuration changes.
* **External Mock Servers & API Clients (e.g., Postman, Prism, WireMock):** Operate as standalone HTTP servers running
  locally (e.g., `http://localhost:4000`) or in the cloud (e.g., `https://mock.postman.co`). Applications route real
  HTTP traffic over TCP sockets to these servers. While this requires configuring an `API_BASE_URL` override, it enables
  multi-application mock sharing, automated schema validation, and language-agnostic integration.

## Contract Testing & Execution Sequence

To maintain fidelity between frontend mocks and production backend behavior, schema-driven contract testing aligns
frontend mocks with backend API specifications:

1. **Schema Definition:** Author or export an OpenAPI/Swagger contract defining API routes, payload models, and HTTP
   status codes.
2. **Mock Provisioning:** Feed the schema into an external mock tool (e.g., Prism) or generate mock handler definitions
   for in-process interception (e.g., MSW handlers).
3. **Request Interception & Routing:** Route outgoing client network requests either through the browser Service Worker
   or directly to the external mock server gateway.
4. **Contract Validation:** Evaluate incoming request headers and parameters against the defined schema, returning
   validated synthetic responses or flagging contract mismatches.

## Best Practices

* **Match Tooling to Workflow Phase:** Use Postman or Prism for early schema prototyping, and transition to MSW or Nock
  for automated CI/CD test suites.
* **Avoid Unsafe Global Stubbing:** Prefer Service Worker interception (MSW) or schema proxy servers over
  monkey-patching `window.fetch` to ensure realistic network layer behavior.
* **Automate Mock Generation from OpenAPI:** Generate MSW handlers or Prism routes directly from OpenAPI specifications
  to prevent mock contracts from diverging from backend code over time.
* **Simulate Latency and Network Errors:** Inject synthetic network delays, 500-level server errors, and connection
  drops to test UI loading states and retry logic under degraded conditions.
* **Enforce Deterministic State:** Reset mock handlers and state stores between individual test executions to prevent
  state leakages and non-deterministic test failures.
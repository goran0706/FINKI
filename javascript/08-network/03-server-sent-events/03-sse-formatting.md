# Server-Sent Events Stream Formatting Specification

The Server-Sent Events (SSE) wire format is a plain UTF-8 text stream delivered over an HTTP connection configured with
the `text/event-stream` `Content-Type` header. According to the W3C and HTML specifications, event messages consist of
field-value pairs separated by colons and terminated by single newline characters, with individual event blocks
separated by two consecutive newline characters. Lines beginning with a colon character (`:`) represent stream comments
and are discarded by the client parser, serving as keep-alive signals to keep proxy connections active.

| Field Name | Expected Value | Operational Behavior                                                                                     |
|:-----------|:---------------|:---------------------------------------------------------------------------------------------------------|
| `data`     | `String`       | Contains the payload message string, with consecutive data fields concatenated using newline characters. |
| `event`    | `String`       | Defines a custom event type name that triggers specifically registered event listeners on the client.    |
| `id`       | `String`       | Sets the event identifier string, updating the client's internal last event identifier state.            |
| `retry`    | `Number`       | Configures the client reconnection delay in milliseconds following an unexpected connection drop.        |

## Stream Tracking & Reconnection Protocols

The Server-Sent Events specification provides built-in stream state tracking to ensure message delivery continuity
across network interruptions. When an event frame includes an `id` field, the browser stores the provided value as the
active stream state identifier. If the HTTP stream connection drops unexpectedly, the browser automatically includes the
stored string inside the `Last-Event-ID` HTTP header during the subsequent reconnection request, allowing the server to
replay missed messages:

1. **Frame Parsing:** Parse incoming field lines sequentially until encountering two consecutive newline characters
   indicating frame completion.
2. **Identifier Storage:** Store the string value from the `id` field into internal user agent memory as the most recent
   event identifier.
3. **Header Resynchronization:** Include the stored identifier string in the `Last-Event-ID` HTTP request header when
   executing automatic reconnection attempts.
4. **Backoff Configuration:** Process the `retry` field value on the client to reconfigure the base time delay used for
   future network reconnection backoff calculations.

## Best Practices

* **Terminate Message Frame Boundaries:** Append two consecutive newline characters (`\n\n`) at the end of each message
  payload to ensure the browser parser dispatches the event.
* **Format Multi-Line Data Payloads:** Prefix each individual line of a multi-line string payload with the `data:` field
  identifier to ensure proper line concatenation.
* **Assign Unique Event Identifiers:** Include an `id` field in every server frame to enable automatic stream
  resynchronization following temporary connection failures.
* **Control Reconnection Delays:** Dispatch a `retry` field during initial stream setup to prevent aggressive client
  reconnect attempts during server outages.
* **Sanitize event identifiers:** Validate and escape `Last-Event-ID` strings on the server before querying database
  state logs to prevent injection vulnerabilities.
* **Handle missing ID states defensively:** Implement robust fallback mechanisms on backend replay routes when clients
  reconnect without a `Last-Event-ID` header.
* **Keep comment payloads lightweight:** Restrict SSE comment lines to minimal keep-alive tokens (e.g., `: ping`) to
  avoid inflating bandwidth usage over long-lived streams.
* **Avoid trailing whitespace corruption:** Ensure field lines do not contain trailing spaces before newline separators
  to maintain strict compliance with SSE parsing rules.
* **Encode JSON payloads cleanly:** Serialize complex data objects into single-line JSON strings when assigning to
  `data` fields to prevent unintended line breaks in client parsers.
* **Track active client streams for replay:** Maintain temporary ring buffers or message queues in server memory to
  support event replay for reconnecting clients.
* **Monitor stream reconnection rates:** Audit frequency spikes in `Last-Event-ID` header handshakes to detect unstable
  network infrastructure or upstream proxy drops.
* **Enforce maximum replay windows:** Place time or count limits on historical event replays to prevent excessive memory
  consumption and database load during mass reconnections.
* **Test multi-line data parsing:** Verify that client applications correctly reconstruct multi-line text payloads
  separated by newline characters.
* **Handle duplicate event IDs gracefully:** Design client-side state reducers to be idempotent so duplicated event
  deliveries during network retries do not corrupt application data.
* **Clear stale buffer histories:** Evict old event payloads from server-side replay buffers periodically to optimize
  memory management.
* **Document custom field extensions:** Maintain explicit internal documentation if utilizing non-standard custom fields
  alongside core SSE specifications.
* **Validate retry time bounds:** Ensure server-configured `retry` millisecond values fall within reasonable operational
  limits to prevent client lockout.
* **Ensure proper chunked transfer encoding:** Verify that backend HTTP servers flush response chunks immediately when
  writing SSE frames to prevent output buffering delays.
* **Test stream recovery with simulated drops:** Use proxy termination tools to simulate abrupt network cuts and verify
  that `Last-Event-ID` headers are sent correctly.
* **Log unparseable stream frames:** Capture and log malformed event frames on the client to diagnose server-side
  serialization bugs quickly.
* **Secure stream replay endpoints:** Restrict historical event replays behind proper user authentication and channel
  authorization checks.
* **Review proxy timeout compatibility:** Configure intermediate load balancer timeout parameters to align with
  application keep-alive emission intervals.
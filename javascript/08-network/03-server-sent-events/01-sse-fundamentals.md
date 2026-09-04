# Server-Sent Events (SSE) Fundamentals

Server-Sent Events (SSE) is a standardized web technology that enables a server to push real-time, UTF-8 text updates to
client browsers over a single, persistent HTTP connection. Specified as part of the HTML standard, SSE provides a
lightweight, native alternative to WebSockets for application features where data flows strictly in one direction: from
server to client.

## Wire Protocol & Frame Structure

The SSE wire format is a plain text stream transmitted using the `text/event-stream` MIME type. The client sends a
standard HTTP request, and the server holds the connection open, streaming formatted text frames terminated by newline
characters (`\n`).

### Message Fields

An individual SSE event consists of one or more field-value pairs separated by colons. Multiple data lines within a
single event are concatenated with newline characters, and event frames are delimited by two consecutive newlines (
`\n\n`).

| Field Name | Expected Value | Description                                                                                      |
|:-----------|:---------------|:-------------------------------------------------------------------------------------------------|
| `data`     | `String`       | The payload string. Multiple consecutive `data` lines in one frame are merged with newlines.     |
| `event`    | `String`       | Custom event type name. Triggers specifically named event listeners on the client.               |
| `id`       | `String`       | Event identifier string. Updates the client's internal last event ID state.                      |
| `retry`    | `Number`       | Reconnection delay in milliseconds if the network connection drops.                              |
| `:`        | `String`       | Lines starting with a colon are comment lines ignored by the parser; used as keep-alive signals. |

### Stream Example

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

: ping keep-alive

event: user-login
id: 101
retry: 5000
data: {"userId": "usr_8923", "status": "active"}

data: {"message": "System broadcast: maintenance in 10 minutes."}
```

## Client-Side Implementation

Browsers provide a native `EventSource` JavaScript interface to manage stream connections, parse incoming frames, and
automatically handle network reconnections.

```javascript
// Establish connection
const eventSource = new EventSource('/api/v1/stream', {
    withCredentials: true // Transmit cookies/headers for cross-origin requests
});

// Default message handler (handles unnamed events)
eventSource.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    console.log('Received generic event:', payload);
};

// Custom named event handler
eventSource.addEventListener('user-login', (event) => {
    const userData = JSON.parse(event.data);
    console.log('User logged in:', userData);
});

// Lifecycle handlers
eventSource.onopen = () => console.log('SSE connection established.');
eventSource.onerror = (err) => console.error('SSE connection error:', err);

// Clean connection termination
function disconnectStream() {
    eventSource.close();
    console.log('SSE stream terminated by client.');
}
```

## Server-Side Execution

To maintain a healthy SSE stream, backend applications must set explicit HTTP headers to prevent reverse proxies and
browsers from buffering response payloads.

```javascript
app.get('/api/v1/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });

    // Send initial reconnection configuration
    res.write('retry: 3000\n\n');

    // Emit periodic payload
    const intervalId = setInterval(() => {
        const data = JSON.stringify({timestamp: Date.now(), status: 'healthy'});
        res.write(`data: ${data}\n\n`);
    }, 2000);

    // Send periodic keep-alive ping (every 15s) to prevent proxy timeouts
    const keepAliveId = setInterval(() => {
        res.write(': ping\n\n');
    }, 15000);

    // Clean up resources on client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
        clearInterval(keepAliveId);
        res.end();
    });
});
```

## Protocol Comparison Matrix

Selecting the appropriate real-time transport depends on communication directionality, payload types, and existing
network infrastructure.

| Feature                        | Server-Sent Events (SSE)                  | WebSockets                                      | Long Polling                      |
|:-------------------------------|:------------------------------------------|:------------------------------------------------|:----------------------------------|
| **Data Direction**             | Unidirectional (Server -> Client)         | Bidirectional (Full-Duplex)                     | Unidirectional (Request-Response) |
| **Protocol**                   | Standard HTTP / HTTP/2                    | Custom TCP (`ws://`, `wss://`)                  | Standard HTTP                     |
| **Data Types**                 | UTF-8 Text                                | UTF-8 Text & Raw Binary                         | UTF-8 Text & Binary               |
| **Auto Reconnection**          | Built-in (Native browser feature)         | Manual application logic                        | Manual application logic          |
| **HTTP/2 Multiplexing**        | Fully Supported                           | Not Native (Requires HTTP/3 or custom framing)  | Supported                         |
| **Firewall & Proxy Traversal** | Seamless (Standard HTTP ports 80/443)     | Can be blocked by strict proxies                | Seamless                          |
| **Ideal Use Cases**            | LLM Text Streaming, Dashboards, Newsfeeds | Live Audio/Video, Gaming, Collaborative Editors | Legacy Fallbacks                  |

## Best Practices

* **Leverage HTTP/2 Multiplexing:** Serve SSE streams over HTTP/2 to eliminate HTTP/1.1 per-domain socket limitations (6
  connections per domain) and multiplex streams over a single connection.
* **Implement Resynchronization Loops:** Include an `id` field in server events so the browser automatically
  re-transmits the last received ID in the `Last-Event-ID` header upon reconnecting.
* **Emit Periodic Heartbeats:** Send a comment line (`: keep-alive\n\n`) every 15–30 seconds to prevent reverse proxies
  and load balancers from closing idle connections.
* **Enforce Proper Connection Lifecycle Management:** Explicitly invoke `eventSource.close()` in single-page application
  lifecycle hooks when unmounting components to prevent background connection leaks.
* **Disable nginx and proxy response buffering:** Include specific headers like `X-Accel-Buffering: no` or configure
  proxy pass-through to ensure server-sent data frames stream to clients immediately without being held in intermediate
  buffers.
* **Handle network reconnect states cleanly:** Monitor `eventSource.readyState` (`0` for CONNECTING, `1` for OPEN, `2`
  for CLOSED) to reflect live stream health in user interfaces.
* **Validate Origin Headers on SSE routes:** Secure backend SSE endpoints against unauthorized cross-origin access by
  inspecting and validating `Origin` headers manually if cookies or credentials are included.
* **Sanitize Last-Event-ID inputs:** Parse and validate the `Last-Event-ID` header carefully on the server before
  querying databases to prevent injection attacks or malformed state recovery queries.
* **Control reconnection delays dynamically:** Adjust the `retry` field value in event streams based on server load to
  prevent thundering herd spikes when backend services recover from outages.
* **Ensure UTF-8 text formatting strictness:** Validate that all serialized message data pushed down event streams
  strictly conforms to valid UTF-8 string encoding to prevent client parser crashes.
* **Handle JSON parsing exceptions safely:** Wrap `JSON.parse(event.data)` calls inside try-catch blocks within message
  listeners to prevent unhandled runtime errors from malformed frames.
* **Limit concurrent streams per user:** Track active SSE connections per authenticated user session on the backend to
  prevent resource exhaustion and connection flooding.
* **Configure appropriate CORS policies:** Set explicit `Access-Control-Allow-Origin` headers on SSE endpoints when
  client applications are hosted on separate domains.
* **Test reconnection event recovery:** Write automated integration tests that simulate dropped HTTP connections to
  verify that clients correctly send `Last-Event-ID` headers upon retry.
* **Avoid sending binary payloads directly:** Base64-encode binary data or use WebSockets when low-level raw binary
  streaming is required, as SSE natively processes UTF-8 text frames.
* **Log stream disconnection metrics:** Track client disconnect frequency and duration distributions in application
  monitoring tools to audit real-world network stability.
* **Prevent memory leaks from custom event listeners:** Remove named event listeners or nullify `EventSource` references
  appropriately during component unmount cycles.
* **Use compression cautiously with SSE:** Configure reverse proxy gzip or brotli compression settings correctly for
  `text/event-stream` to avoid output buffering delays.
* **Implement proper authentication during handshake:** Pass tokens via query parameters or custom headers (using
  fetch-based SSE polyfills) to secure initial stream connections.
* **Monitor server socket file descriptors:** Track open HTTP response streams in Node.js or backend servers to ensure
  closed connections release system resources promptly.
* **Design idempotent message handling:** Ensure client applications process retransmitted event IDs safely without
  duplicating state mutations if network drops occur mid-stream.
* **Document event schema contracts:** Maintain clear documentation of all named event types, IDs, and JSON payload
  structures streamed across SSE endpoints.
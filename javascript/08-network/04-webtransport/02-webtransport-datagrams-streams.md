# WebTransport Datagrams and Streams

WebTransport datagrams provide a low-latency mechanism for transmitting unreliable, out-of-order data payloads between
clients and servers over a WebTransport session. Managed via the `datagrams` property on the `WebTransport` instance,
datagram communication utilizes a `WebTransportDatagramDuplexStream` interface combining readable and writable streams.
Because datagrams rely on QUIC datagram frames, packets are delivered without retransmission guarantees or flow control
overhead, making them ideal for high-frequency telemetry, real-time gaming inputs, and perishable media data. The
browser dynamically regulates maximum datagram payload sizes based on path maximum transmission unit (PMTU) discovery,
exposing `maxDatagramSize` properties to prevent packet fragmentation.

## Stream Types & Transmission Mechanics

WebTransport streams offer reliable, ordered byte delivery built on top of QUIC stream multiplexing. The API supports
both unidirectional streams, where data flows in a single direction from sender to receiver, and bidirectional streams,
which establish paired incoming and outgoing channels. Developers manage stream data using standard Streams API
primitives, reading from `ReadableStream` instances and writing to `WritableStream` instances. Because each QUIC stream
operates with independent flow control and error tracking, packet loss on one stream does not stall data processing on
other concurrent streams.

| Stream Capability         | Datagrams                      | Unidirectional Streams      | Bidirectional Streams       |
|:--------------------------|:-------------------------------|:----------------------------|:----------------------------|
| **Delivery Guarantee**    | Unreliable (No retransmission) | Reliable (Guaranteed order) | Reliable (Guaranteed order) |
| **Directionality**        | Bidirectional messaging        | Single-direction transfer   | Two-way paired transfer     |
| **Flow Control**          | None                           | Enforced per stream         | Enforced per stream         |
| **Head-of-Line Blocking** | None                           | Restricted to single stream | Restricted to single stream |

## Stream Processing Sequence

Opening and consuming a WebTransport stream requires creating stream instances and acquiring reader locks to process
incoming byte chunks asynchronously:

1. **Stream Initiation:** Invoke `createUnidirectionalStream()` or `createBidirectionalStream()` on the `WebTransport`
   instance to initiate a new outgoing stream.
2. **Writer Acquisition:** Obtain a `WritableStreamDefaultWriter` lock from the stream's `writable` property to prepare
   payload byte chunks.
3. **Data Transmission:** Write `Uint8Array` data chunks sequentially using the writer's `write()` method to transmit
   data over the QUIC stream.
4. **Clean Termination:** Call the writer's `close()` method to transmit a stream FIN bit signal and terminate the
   individual stream channel cleanly.

## Best Practices

* **Inspect Datagram Size Limits:** Query the `maxDatagramSize` property before sending datagram payloads to ensure data
  fits within single path transmission units.
* **Release Stream Readers:** Call `releaseLock()` on stream readers and writers when processing completes to prevent
  resource leaks in stream pipelines.
* **Utilize Datagrams for Perishable Data:** Direct time-sensitive data like cursor coordinates and game state updates
  through datagrams rather than reliable streams.
* **Handle Stream Cancellation:** Cancel readable streams explicitly when incoming data is no longer required to signal
  stream resets to the remote endpoint.
* **Handle dropped datagrams gracefully:** Design application logic to tolerate missing or out-of-order packets when
  consuming unreliable datagram streams.
* **Batch small datagram payloads:** Aggregate multiple small metrics or events into single datagrams where appropriate
  to maximize network bandwidth efficiency.
* **Monitor stream high water marks:** Configure appropriate queue strategies on readable and writable streams to manage
  memory backpressure effectively.
* **Catch stream read abort errors:** Wrap asynchronous stream reading loops in try-catch blocks to handle abrupt
  network resets or stream cancellations smoothly.
* **Close writable writers properly:** Invoke `.close()` on stream writers to ensure remote endpoints receive final
  stream termination indicators.
* **Avoid blocking stream microtasks:** Process incoming stream chunks asynchronously without stalling the main event
  loop during high-throughput data transfers.
* **Validate incoming datagram types:** Check that received payloads are valid `Uint8Array` byte buffers before passing
  them into core application parsers.
* **Limit concurrent open streams:** Restrict the number of active bidirectional and unidirectional streams to prevent
  excessive memory and descriptor overhead.
* **Handle stream abort signals:** Pass `AbortController` signals into stream operations to enable clean cancellation
  workflows across application components.
* **Test network congestion behavior:** Simulate packet loss and jitter conditions in test environments to verify
  datagram and stream resilience.
* **Buffer stream chunks efficiently:** Utilize typed arrays and avoid unnecessary memory allocations when serializing
  data objects into stream byte chunks.
* **Clean up event listeners on streams:** Remove references and listeners bound to stream instances during component
  unmounts to prevent memory leaks.
* **Optimize writer queue strategies:** Set custom byte-length queuing strategies on streams to tune memory consumption
  for high-speed data streams.
* **Handle session dropouts during writes:** Catch runtime exceptions thrown during `.write()` calls when underlying
  WebTransport sessions drop unexpectedly.
* **Log stream performance metrics:** Track throughput, latency, and drop rates for both datagrams and streams to audit
  real-time network performance.
* **Ensure proper chunk serialization:** Convert complex JavaScript objects or JSON strings into UTF-8 encoded
  `Uint8Array` buffers prior to writing into streams.
* **Review bidirectional stream pairing:** Manage paired incoming and outgoing streams carefully to prevent deadlocks in
  custom request-response application protocols.
* **Document stream protocol boundaries:** Maintain clear technical documentation outlining byte-level serialization
  formats for all custom stream channels.
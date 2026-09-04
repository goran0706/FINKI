# WebSocket Resilience: Heartbeats and Reconnection Strategies

Persistent TCP connections are inherently vulnerable to silent network dropouts, dynamic IP reassignments, client sleep
states, and intermediary proxy timeouts that terminate idle sockets without transmitting FIN or RST packets. These
scenarios produce "half-open" or "zombie" connections where one endpoint assumes the socket is healthy while the other
has dropped it. Maintaining reliable real-time communication requires proactive connection vitality monitoring and
structured reconnection mechanisms.

## Connection Vitality & Heartbeat Protocols

To detect silent failures before write operations fail, endpoints implement heartbeat mechanisms operating either at the
protocol level or the application level.

### Protocol-Level Control Frames (RFC 6455)

The WebSocket protocol defines native control frames for channel monitoring:

* **Ping Frame (`0x9`):** Sent by either endpoint to verify channel responsiveness. May contain an optional application
  payload.
* **Pong Frame (`0xA`):** Automatically returned by the receiving endpoint in response to a Ping. It must contain the
  identical payload as the received Ping frame.

> **Browser Limitation:** Browser JavaScript runtimes do not expose low-level Ping/Pong frame APIs. Web browsers
> automatically respond to server-initiated Ping frames at the user-agent layer, but client applications cannot manually
> emit native `0x9` Ping frames.

### Application-Level Heartbeats

Because of browser API limitations, modern client-server architectures implement application-layer heartbeats using
standard text or binary frames.

```
Client                                  Server
  |                                       |
  |--- Application Ping ("ping") -------->| (Resets server-side timeout)
  |<-- Application Pong ("pong") ---------| (Resets client-side timeout)
  |                                       |
  |             (Network Drop)            |
  |                                       |
  |--- Application Ping ("ping") -------->X (Lost)
  |                                       |
  | (Pong timeout expires)                | (Ping timeout expires)
  | [Force close socket]                  | [Force close socket]
```

| Metric / Parameter      | Function                                                                                                | Typical Default |
|:------------------------|:--------------------------------------------------------------------------------------------------------|:----------------|
| **Heartbeat Interval**  | Frequency of outgoing keep-alive signals.                                                               | 15–30 seconds   |
| **Heartbeat Timeout**   | Maximum allowed duration to wait for a matching Pong before declaring a socket dead.                    | 5–10 seconds    |
| **Passive Timer Reset** | Resetting the heartbeat timer upon receiving *any* incoming data frame to minimize unnecessary traffic. | Enabled         |

## Exponential Backoff and Jitter

When a server node restarts or experiences a network disruption, thousands of connected clients attempt to reconnect
simultaneously. If clients retry on a static timer, they trigger a **Thundering Herd** problem that repeatedly crashes
the server under excessive load.

To distribute reconnection traffic evenly over time, clients compute reconnect intervals using exponential backoff with
randomized jitter:

$$T_{\text{backoff}} = \min\left(T_{\text{max}}, T_{\text{base}} \times 2^{\text{attempt}}\right) + \text{jitter}$$

* **Base Delay ($T_{\text{base}}$):** Initial wait duration before the first retry (e.g., 1 second).
* **Exponential Factor ($2^{\text{attempt}}$):** Doubles the delay window on each consecutive failure.
* **Maximum Cap ($T_{\text{max}}$):** Sets a firm upper limit to maintain acceptable recovery windows (e.g., 30
  seconds).
* **Jitter:** A randomized variance added to or multiplied by the calculated backoff value to desynchronize simultaneous
  client reconnect requests.

## Connection Recovery Lifecycle

Re-establishing an active WebSocket connection involves four distinct phases to handle state recovery cleanly:

1. **Failure Detection:** The heartbeat timer expires without receiving a Pong response, or the socket emits a `close`/
   `error` event.
2. **Resource Cleanup & Isolation:** The client forcibly terminates the active socket (`socket.close()`), detaches old
   event handlers, and transitions the UI state to `CONNECTING` or `DISCONNECTED`.
3. **Backoff Delay Execution:** The client calculates the next retry interval using exponential backoff with randomized
   jitter and sets an internal timer.
4. **Re-handshake & State Synchronization:** The client initiates a new WebSocket handshake. Upon receiving the `open`
   event, the client re-authenticates and re-subscribes to required pub/sub topics or requests missed state deltas.

## Best Practices

* **Adopt Full Jitter:** Calculate randomized backoff using uniform distribution between 0 and the current exponential
  limit to achieve optimal traffic distribution across restarting servers.
* **Reset Heartbeat Timers Passively:** Reset the outgoing Ping timer whenever valid incoming data frames arrive;
  sending heartbeats over an actively streaming connection wastes network bandwidth.
* **Terminate Unresponsive Sockets Explicitly:** Forcefully call `socket.close()` when a Pong timeout occurs to free
  underlying memory and TCP socket buffers immediately.
* **Cap Maximum Retry Intervals:** Keep maximum backoff limits under 30–60 seconds to ensure clients reconnect promptly
  once server health is restored.
* **Re-establish State After Reconnecting:** Ensure that connection state (subscriptions, auth tokens, channel joins) is
  automatically retransmitted upon successful socket re-instantiation.
* **Implement max retry limits:** Prevent infinite reconnection loops by setting a ceiling on total reconnection
  attempts before presenting a manual retry prompt to users.
* **Buffer outgoing messages during disconnection:** Queue critical application messages sent during offline states and
  flush the buffer automatically upon successful socket re-handshake.
* **Distinguish reconnection states in UI:** Display clear connection banner indicators (e.g., "Reconnecting...") to
  keep users informed during network drops and recovery cycles.
* **Prevent concurrent reconnection triggers:** Guard reconnection routines with boolean locks to ensure multiple event
  listeners do not spawn parallel retry loops.
* **Synchronize server session states:** Leverage unique client session identifiers or token cookies during reconnection
  handshakes to recover lost server-side session contexts.
* **Log reconnection metrics:** Track backoff durations, failure counts, and recovery success rates to audit real-world
  client network reliability.
* **Handle abrupt device sleep states:** Listen for operating system resume or visibility change events to trigger
  immediate heartbeat validation or socket reconnection.
* **Tune heartbeat intervals conservatively:** Balance detection speed against server load by selecting heartbeat
  intervals suited to application-specific responsiveness requirements.
* **Sanitize reconnection payloads:** Ensure re-transmitted subscription or authentication tokens are securely validated
  before sending over newly established sockets.
* **Validate network reachability prior to retry:** Check `navigator.onLine` status before executing backoff timers to
  avoid unnecessary CPU wakeups during complete device offline states.
* **Test reconnection storm resilience:** Simulate mass client disconnections in staging environments to verify that
  backoff jitter effectively neutralizes thundering herds.
* **Clear stale retry timers on close:** Cancel active backoff timeouts immediately if users manually navigate away or
  close the application view.
* **Preserve message ordering during recovery:** Ensure buffered or queued messages are processed sequentially after the
  socket transitions back to the open state.
* **Monitor half-open socket detection times:** Adjust application ping-pong timeout windows to catch proxy idle drops
  before intermediate firewalls terminate the TCP pipe.
* **Isolate reconnection logic into modules:** Encapsulate backoff algorithms and state recovery handlers within
  dedicated connection manager classes to maintain clean code architecture.
* **Handle token expiration during retries:** Refresh authentication credentials automatically if a reconnection
  handshake fails due to an expired authorization token.
* **Document reconnection architecture:** Maintain clear sequence diagrams outlining heartbeat timeouts, backoff math,
  and state resynchronization flows for engineering teams.
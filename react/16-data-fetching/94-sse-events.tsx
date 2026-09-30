/**
 * SSE Events
 * ==========
 *
 * Server-Sent Events represent individual messages delivered through an SSE connection. Each event
 * consists of text fields separated by a blank line. The standard `data` field contains the event
 * payload, `event` assigns an optional event type, `id` identifies the event for reconnection, and
 * `retry` communicates a reconnection delay to the browser.
 *
 * The browser parses the SSE stream and dispatches each event according to its type. Events without
 * an `event` field are delivered through the `message` event. Named events require listeners for
 * their specific event names, while the `MessageEvent` supplied to handlers exposes the event data
 * and, when provided by the server, the event identifier.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface SseMessageEventProps {
  readonly url: string;
}

interface SseNamedEventsProps {
  readonly url: string;
  readonly eventName: string;
}

interface SseEventMetadataProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Handles standard SSE messages.
 *
 * An SSE event without an explicit `event` field is delivered through the EventSource `message`
 * event. The event data is exposed as a string through `MessageEvent.data`.
 */
export const SseMessageEvent: React.FC<SseMessageEventProps> = ({ url }): React.ReactElement => {
  const [data, setData] = useState<string>("No message received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleMessage = (event: MessageEvent<string>): void => {
      setData(event.data);
    };

    eventSource.addEventListener("message", handleMessage);

    return (): void => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>Latest message: {data}</p>
    </div>
  );
};

/**
 * Handles an application-defined named SSE event.
 *
 * When the server sends an event containing an `event` field, EventSource dispatches it using that
 * event type instead of the generic `message` event. The event name is therefore part of the
 * application's event protocol.
 */
export const SseNamedEvents: React.FC<SseNamedEventsProps> = ({ url, eventName }): React.ReactElement => {
  const [data, setData] = useState<string>("No named event received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleEvent = (event: Event): void => {
      if (event instanceof MessageEvent) {
        setData(event.data);
      }
    };

    eventSource.addEventListener(eventName, handleEvent);

    return (): void => {
      eventSource.removeEventListener(eventName, handleEvent);
      eventSource.close();
    };
  }, [eventName, url]);

  return (
    <div>
      <p>Event type: {eventName}</p>
      <p>Latest data: {data}</p>
    </div>
  );
};

/**
 * Reads SSE event metadata such as the server-provided event identifier.
 *
 * The `id` field from an SSE event is exposed through `MessageEvent.lastEventId`. The browser can
 * use the last received event ID when reconnecting so the server can resume the stream from an
 * appropriate position when its SSE implementation supports that behavior.
 */
export const SseEventMetadata: React.FC<SseEventMetadataProps> = ({ url }): React.ReactElement => {
  const [eventId, setEventId] = useState<string>("No event ID received");
  const [data, setData] = useState<string>("No event received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleMessage = (event: MessageEvent<string>): void => {
      setData(event.data);
      setEventId(event.lastEventId === "" ? "No event ID supplied" : event.lastEventId);
    };

    eventSource.addEventListener("message", handleMessage);

    return (): void => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>Event ID: {eventId}</p>
      <p>Data: {data}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SseEventsExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>SSE Events</h1>

      <h2>1. Standard SSE Messages</h2>
      <SseMessageEvent url="https://example.com/events" />

      <h2>2. Named SSE Events</h2>
      <SseNamedEvents url="https://example.com/events" eventName="notification" />

      <h2>3. SSE Event Metadata</h2>
      <SseEventMetadata url="https://example.com/events" />
    </main>
  );
};

export default SseEventsExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - SSE events are parsed from a text/event-stream response and dispatched by EventSource.
// - An event without an `event` field is delivered through the generic `message` event.
// - The SSE `event` field determines the event type used for named event listeners.
// - `MessageEvent.data` contains the event payload as a string.
// - `MessageEvent.lastEventId` contains the value supplied by the SSE `id` field.
// - Multiple `data` fields in one SSE event are combined by the SSE parser with newline separators.
// - SSE payloads are text; structured data such as JSON must be parsed by application code.
// - Event listeners should be removed and the EventSource closed during React effect cleanup.
// - The SSE `retry` field can communicate a reconnection delay to the browser.

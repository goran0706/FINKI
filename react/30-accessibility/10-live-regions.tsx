/**
 * Live Regions
 * =============
 *
 * ARIA live regions allow assistive technologies to be informed when content changes
 * dynamically without moving keyboard focus. They are useful for status messages,
 * validation feedback, notifications, search results, chat messages, and other updates
 * that may occur while the user's attention is elsewhere.
 *
 * Live regions should be used selectively. The goal is to communicate meaningful
 * changes without unnecessarily interrupting the user's current task.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What a live region does
// ---------------------------------------------------------------------

// A live region is an area of the page whose dynamic changes can be
// announced by assistive technologies.
//
// This is useful because a screen-reader user's virtual or interaction
// focus may be somewhere else when the update occurs.

export const LiveRegionExample: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Changes saved.")}>
        Save
      </button>

      <p aria-live="polite">{message}</p>
    </div>
  );
};

// The button remains focused after the update.
// The live region communicates the status separately.

// ---------------------------------------------------------------------
// 2. aria-live
// ---------------------------------------------------------------------

// aria-live defines the politeness level of a live region.
//
// Common values are:
//
// "off"       -> do not proactively announce updates.
// "polite"    -> announce at the next appropriate opportunity.
// "assertive" -> announce immediately and may interrupt current output.
//
// "polite" is the usual choice for ordinary status updates.
// "assertive" should be reserved for genuinely urgent information.
//
// aria-live does not move keyboard focus.

export const LivePoliteness: FC = (): ReactElement => {
  return (
    <div>
      <p aria-live="polite">Background synchronization completed.</p>

      <p aria-live="assertive">Connection lost.</p>
    </div>
  );
};

// Prefer the least disruptive announcement that still communicates
// information the user needs.

// ---------------------------------------------------------------------
// 3. aria-live="polite"
// ---------------------------------------------------------------------

// A polite live region allows the user agent and assistive technology to
// wait for a suitable opportunity to communicate the update.
//
// This is appropriate for many ordinary application-status messages.

export const PoliteStatus: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setSaved(true)}>
        Save profile
      </button>

      <p aria-live="polite">{saved ? "Profile saved." : ""}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. aria-live="assertive"
// ---------------------------------------------------------------------

// Assertive updates have a higher announcement priority and can interrupt
// speech that is currently being presented.
//
// This should not be used merely because an update is important to the
// application. It should be reserved for information requiring immediate
// attention.

export const AssertiveMessage: FC = (): ReactElement => {
  const [error, setError] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setError("Your session is about to expire.")}>
        Check session
      </button>

      <p aria-live="assertive">{error}</p>
    </div>
  );
};

// Avoid making ordinary notifications assertive because frequent
// interruptions can disrupt the user's current task.

// ---------------------------------------------------------------------
// 5. aria-live="off"
// ---------------------------------------------------------------------

// aria-live="off" means updates should not normally be proactively
// announced unless the user is currently interacting with the region.
//
// It does not mean that the content becomes inaccessible.

export const NonAnnouncedUpdates: FC = (): ReactElement => {
  return (
    <div aria-live="off">
      <p>Background information.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Establish the live region before updating it
// ---------------------------------------------------------------------

// For reliable live-region behavior, establish the live region in the
// document before its content changes.
//
// A useful React pattern is to render an initially empty live region and
// then update its contents.

export const PrimedLiveRegion: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <p aria-live="polite">{message}</p>

      <button type="button" onClick={() => setMessage("Report generated.")}>
        Generate report
      </button>
    </div>
  );
};

// The live region exists before the button causes its contents to change.

// ---------------------------------------------------------------------
// 7. Do not recreate the live region unnecessarily
// ---------------------------------------------------------------------

// A stable live-region element is generally preferable to repeatedly
// creating and removing the region itself.
//
// The region can remain in the DOM while its contents change.

export const StableLiveRegion: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <section>
      <button type="button" onClick={() => setMessage("Upload completed.")}>
        Upload
      </button>

      <div aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </section>
  );
};

// Keeping the region stable gives assistive technology a persistent
// target to monitor.

// ---------------------------------------------------------------------
// 8. role="status"
// ---------------------------------------------------------------------

// role="status" is intended for advisory information that does not require
// the urgency of an alert.
//
// It is a live-region role with implicit polite live behavior and atomic
// announcement semantics.

export const StatusRole: FC = (): ReactElement => {
  const [status, setStatus] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setStatus("Settings saved.")}>
        Save
      </button>

      <p role="status">{status}</p>
    </div>
  );
};

// A status message normally does not require focus to move to it.

// ---------------------------------------------------------------------
// 9. role="status" versus aria-live="polite"
// ---------------------------------------------------------------------

// Both patterns can communicate non-urgent updates.
//
// role="status" expresses the semantic purpose of the region.
// aria-live="polite" explicitly defines the announcement priority.
//
// Use the semantic role when the content represents a status.

export const StatusComparison: FC = (): ReactElement => {
  return (
    <div>
      <p role="status">Profile saved.</p>

      <p aria-live="polite">Search results updated.</p>
    </div>
  );
};

// role="status" is particularly appropriate when the content represents
// application status rather than an arbitrary changing region.

// ---------------------------------------------------------------------
// 10. role="alert"
// ---------------------------------------------------------------------

// role="alert" is intended for important, usually time-sensitive
// information that requires the user's immediate attention.
//
// It is an assertive, atomic live-region role.

export const AlertRole: FC = (): ReactElement => {
  const [error, setError] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setError("Unable to save changes.")}>
        Save
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
};

// Alerts should be used sparingly because they can interrupt the user's
// current screen-reader output.

// ---------------------------------------------------------------------
// 11. Alert versus status
// ---------------------------------------------------------------------

// Use status for ordinary advisory information.
// Use alert for important information that requires immediate attention.
//
// Examples:
//
// status -> "Profile saved."
// alert  -> "Your session is about to expire."

export const StatusAndAlert: FC = (): ReactElement => {
  return (
    <div>
      <p role="status">Profile saved.</p>

      <p role="alert">Your session is about to expire.</p>
    </div>
  );
};

// The distinction is based on urgency, not simply whether the message
// represents success or failure.

// ---------------------------------------------------------------------
// 12. Alerts should contain text
// ---------------------------------------------------------------------

// role="alert" is intended for communicating a message.
// It should not be used as a container for interactive controls.

export const TextAlert: FC = (): ReactElement => {
  return <p role="alert">Unable to save your changes.</p>;
};

// If the user must interact with a modal interruption, a dialog pattern
// is more appropriate than putting buttons or links inside an alert.

// ---------------------------------------------------------------------
// 13. Do not use alerts for ordinary content
// ---------------------------------------------------------------------

// A page should not mark ordinary static content as an alert simply to
// make it more likely that a screen reader will announce it.
//
// Alerts are intended for dynamic, important notifications.

export const OrdinaryContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account information</h2>

      <p>Your account information is displayed below.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 14. aria-atomic
// ---------------------------------------------------------------------

// aria-atomic controls whether assistive technologies should present the
// entire live region or only the portion that changed.
//
// false -> announce the relevant changed portion.
// true  -> present the live region as a whole.
//
// The default is false.

export const AtomicLiveRegion: FC = (): ReactElement => {
  const [count, setCount] = useState(1);

  return (
    <div>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increase
      </button>

      <p aria-live="polite" aria-atomic="true">
        Items in cart: {count}
      </p>
    </div>
  );
};

// With aria-atomic="true", the complete message can be presented when
// the changing value is updated.

// ---------------------------------------------------------------------
// 15. When aria-atomic is useful
// ---------------------------------------------------------------------

// Atomic announcements are useful when the changed value only makes sense
// together with its surrounding context.

export const AtomicContext: FC = (): ReactElement => {
  const [minutes, setMinutes] = useState(5);

  return (
    <div>
      <button type="button" onClick={() => setMinutes((current) => current - 1)}>
        One minute elapsed
      </button>

      <p aria-live="polite" aria-atomic="true">
        Time remaining: {minutes} minutes.
      </p>
    </div>
  );
};

// The surrounding words give meaning to the changing value.

// ---------------------------------------------------------------------
// 16. aria-relevant
// ---------------------------------------------------------------------

// aria-relevant defines which types of changes in a live region are
// relevant for notification.
//
// Values include:
//
// additions
// removals
// text
// all
//
// "all" is equivalent to additions, removals, and text.

export const RelevantChanges: FC = (): ReactElement => {
  return (
    <ul aria-live="polite" aria-relevant="additions removals">
      <li>Example user</li>
    </ul>
  );
};

// This is useful when the distinction between additions and removals
// matters to the user.

// ---------------------------------------------------------------------
// 17. aria-relevant does not determine priority
// ---------------------------------------------------------------------

// aria-relevant answers:
//
// "Which types of changes matter?"
//
// aria-live answers:
//
// "How urgently should relevant changes be announced?"

export const RelevanceAndPriority: FC = (): ReactElement => {
  return (
    <ul aria-live="polite" aria-relevant="additions removals">
      <li>Example user</li>
    </ul>
  );
};

// The example announces relevant changes politely.
// aria-relevant does not make those changes assertive.

// ---------------------------------------------------------------------
// 18. Live chat messages
// ---------------------------------------------------------------------

// A chat transcript is a common example of a dynamic collection.
//
// New messages can be announced while focus remains in the message input.

export const ChatLog: FC = (): ReactElement => {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <section>
      <h2>Messages</h2>

      <button type="button" onClick={() => setMessages((current) => [...current, "Example user sent a message."])}>
        Receive message
      </button>

      <ul aria-live="polite" aria-relevant="additions">
        {messages.map((message, index) => (
          <li key={`${message}-${index}`}>{message}</li>
        ))}
      </ul>
    </section>
  );
};

// In a real chat interface, announcement frequency and message grouping
// should be designed carefully to avoid excessive interruptions.

// ---------------------------------------------------------------------
// 19. role="log"
// ---------------------------------------------------------------------

// role="log" identifies a sequential record of dynamic information,
// such as chat messages or an activity history.
//
// It is a live-region role intended for additions to a log.

export const ActivityLog: FC = (): ReactElement => {
  const [entries, setEntries] = useState<string[]>([]);

  return (
    <section>
      <button type="button" onClick={() => setEntries((current) => [...current, "Example action completed."])}>
        Add activity
      </button>

      <div role="log" aria-live="polite" aria-relevant="additions">
        {entries.map((entry, index) => (
          <p key={`${entry}-${index}`}>{entry}</p>
        ))}
      </div>
    </section>
  );
};

// The log represents a sequence of entries rather than a single status.

// ---------------------------------------------------------------------
// 20. Live search results
// ---------------------------------------------------------------------

// Search results can update while the user remains focused on a search
// field.
//
// The result count can be communicated separately from the result list.

export const SearchResults: FC = (): ReactElement => {
  const [results, setResults] = useState(0);

  return (
    <section>
      <label htmlFor="search">Search</label>

      <input
        id="search"
        type="search"
        onChange={(event) => {
          setResults(event.target.value.length > 0 ? 4 : 0);
        }}
      />

      <p role="status">{results > 0 ? `${results} results found.` : "No results."}</p>
    </section>
  );
};

// The status communicates the important result summary without forcing
// focus away from the search field.

// ---------------------------------------------------------------------
// 21. Avoid announcing every keystroke
// ---------------------------------------------------------------------

// Rapid updates can produce excessive announcements.
//
// For example, announcing a complete search result set after every
// keystroke can overwhelm the user.
//
// Prefer concise result summaries and appropriate update timing.

export const ConciseSearchStatus: FC = (): ReactElement => {
  const [status, setStatus] = useState("");

  return (
    <div>
      <label htmlFor="query">Search</label>

      <input
        id="query"
        type="search"
        onChange={(event) => {
          const query = event.target.value.trim();

          setStatus(query ? "Search results are updating." : "");
        }}
      />

      <p role="status">{status}</p>
    </div>
  );
};

// The live region should communicate useful information rather than
// becoming a second stream of every intermediate UI change.

// ---------------------------------------------------------------------
// 22. Form validation messages
// ---------------------------------------------------------------------

// Validation errors can be communicated through an association with the
// relevant control and, when appropriate, a live-region announcement.

export const ValidationMessage: FC = (): ReactElement => {
  const [error, setError] = useState("");

  return (
    <div>
      <label htmlFor="email">Email address</label>

      <input
        id="email"
        type="email"
        aria-invalid={error !== ""}
        aria-describedby={error ? "email-error" : undefined}
        onBlur={() => setError("Enter a valid email address.")}
      />

      {error && (
        <p id="email-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// The error is both associated with the field and announced as an
// important validation message.

// ---------------------------------------------------------------------
// 23. Do not duplicate announcements unnecessarily
// ---------------------------------------------------------------------

// Combining multiple announcement mechanisms for the same message can
// cause duplicate speech.
//
// Choose one appropriate mechanism for the message.

export const SingleAnnouncement: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Profile updated.")}>
        Save
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// There is no need to additionally add aria-live="assertive" when the
// status semantics already express the intended behavior.

// ---------------------------------------------------------------------
// 24. role="status" already has live-region semantics
// ---------------------------------------------------------------------

// Some ARIA roles have implicit live-region behavior.
//
// role="status" has implicit polite live behavior and atomic behavior.

export const ImplicitStatusSemantics: FC = (): ReactElement => {
  return <p role="status">Profile updated.</p>;
};

// Additional attributes are not automatically better.
// Use explicit attributes when they clarify a deliberate requirement.

// ---------------------------------------------------------------------
// 25. role="alert" already has assertive semantics
// ---------------------------------------------------------------------

// role="alert" has assertive, atomic live-region semantics.
//
// Avoid mechanically combining role="alert" with an explicit
// aria-live="assertive" unless there is a specific compatibility reason
// and the resulting behavior has been tested.

export const ImplicitAlertSemantics: FC = (): ReactElement => {
  return <p role="alert">Unable to save changes.</p>;
};

// Redundant live-region configuration can produce inconsistent behavior
// across browser and assistive-technology combinations.

// ---------------------------------------------------------------------
// 26. aria-busy
// ---------------------------------------------------------------------

// aria-busy communicates that a region is being updated and that assistive
// technology should wait before presenting its final state.
//
// This can be useful when several related changes occur together.

export const BusyRegion: FC = (): ReactElement => {
  const [busy, setBusy] = useState(false);

  return (
    <section aria-busy={busy}>
      <button type="button" onClick={() => setBusy((current) => !current)}>
        Toggle update
      </button>

      <p>{busy ? "Updating information..." : "Information is current."}</p>
    </section>
  );
};

// aria-busy communicates update state; it does not itself perform the
// asynchronous operation or announce a completion message.

// ---------------------------------------------------------------------
// 27. aria-busy with a live region
// ---------------------------------------------------------------------

// A busy live region can prevent assistive technologies from announcing
// intermediate states while several changes are being made.

export const BusyLiveRegion: FC = (): ReactElement => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Ready.");

  return (
    <section aria-live="polite" aria-busy={busy}>
      <button
        type="button"
        onClick={() => {
          setBusy(true);
          setMessage("Updating...");
        }}
      >
        Update
      </button>

      <p>{message}</p>
    </section>
  );
};

// In a real asynchronous workflow, set aria-busy back to false when the
// related update has completed.

// ---------------------------------------------------------------------
// 28. Live regions do not move focus
// ---------------------------------------------------------------------

// Live-region announcements are separate from keyboard focus.
//
// This allows a user to continue working while receiving information
// about an update elsewhere on the page.

export const FocusPreserved: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <label htmlFor="name">Name</label>

      <input id="name" />

      <button type="button" onClick={() => setMessage("Name saved.")}>
        Save
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// The status message should not receive focus merely because its content
// changed.

// ---------------------------------------------------------------------
// 29. Do not use live regions as a substitute for focus management
// ---------------------------------------------------------------------

// If a workflow moves the user into a new interactive context, a live
// region alone is not sufficient.
//
// Dialogs, menus, and other focus-managed widgets require appropriate
// focus behavior in addition to accessible semantics.

export const InteractiveContext: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account settings</h2>

      <button type="button">Open settings</button>
    </section>
  );
};

// Use live regions for announcements, not as a replacement for moving
// focus when the interaction model requires it.

// ---------------------------------------------------------------------
// 30. Live-region content should be concise
// ---------------------------------------------------------------------

// Announcements are easier to understand when they communicate only the
// information that changed and the context needed to understand it.

export const ConciseNotification: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("File uploaded.")}>
        Upload
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// Avoid repeating the complete surrounding page state in every
// announcement.

// ---------------------------------------------------------------------
// 31. Avoid rapidly changing live regions
// ---------------------------------------------------------------------

// A live region that changes many times per second can create excessive
// announcements.
//
// Progress indicators, timers, and continuously changing values require
// careful consideration of how often users actually need updates.

export const ControlledUpdates: FC = (): ReactElement => {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <button type="button" onClick={() => setProgress((current) => Math.min(current + 25, 100))}>
        Advance
      </button>

      <p role="status" aria-atomic="true">
        Progress: {progress}%.
      </p>
    </div>
  );
};

// Announcing meaningful milestones can be preferable to announcing every
// tiny intermediate value.

// ---------------------------------------------------------------------
// 32. Timer updates need special consideration
// ---------------------------------------------------------------------

// A timer is itself a live-region role, but its implicit live behavior is
// not the same as an assertive notification.
//
// Do not announce every timer tick unless users actually need that
// information.

export const TimerExample: FC = (): ReactElement => {
  return (
    <div role="timer" aria-atomic="true">
      5 minutes remaining.
    </div>
  );
};

// The visual timer can update without necessarily interrupting the user's
// current screen-reader output on every tick.

// ---------------------------------------------------------------------
// 33. Live regions and hidden content
// ---------------------------------------------------------------------

// A live region must contain content that can be exposed to assistive
// technologies.
//
// Do not combine live-region announcements with techniques that hide
// the announcement from the accessibility tree.

export const VisibleLiveMessage: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Download complete.")}>
        Download
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// The announcement exists in the accessibility representation even though
// it may be visually styled as a subtle status message.

// ---------------------------------------------------------------------
// 34. Visually hidden live-region announcements
// ---------------------------------------------------------------------

// A live-region message can be visually hidden when displaying it would
// unnecessarily duplicate visible UI, provided the hiding technique
// keeps it available to assistive technologies.

export const VisuallyHiddenStatus: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Copy completed.")}>
        Copy
      </button>

      <span className="visually-hidden" role="status">
        {message}
      </span>
    </div>
  );
};

// The visually-hidden CSS must preserve accessibility-tree exposure.
// display:none would not provide the intended live-region announcement.

// ---------------------------------------------------------------------
// 35. Multiple live regions
// ---------------------------------------------------------------------

// Different kinds of updates can use different live regions.
//
// Keep each region focused on a clear purpose rather than creating one
// global announcement container for every possible message.

export const MultipleLiveRegions: FC = (): ReactElement => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setStatus("Profile saved.")}>
        Save
      </button>

      <button type="button" onClick={() => setError("Unable to connect.")}>
        Test connection
      </button>

      <p role="status">{status}</p>

      <p role="alert">{error}</p>
    </div>
  );
};

// The two messages have different urgency and therefore use different
// live-region semantics.

// ---------------------------------------------------------------------
// 36. Live regions should not contain unnecessary duplicate text
// ---------------------------------------------------------------------

// If visible content already communicates an update and a live region
// repeats the same information, users may hear duplicate announcements.
//
// Add a live-region announcement only when it provides useful information
// that would otherwise be missed.

export const NonDuplicatedStatus: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setSaved(true)}>
        Save
      </button>

      <p role="status">{saved ? "Changes saved." : ""}</p>
    </div>
  );
};

// Keep the announcement concise rather than repeating a complete visible
// success panel.

// ---------------------------------------------------------------------
// 37. Dynamic result counts
// ---------------------------------------------------------------------

// A result count is often a better live-region update than making an entire
// result list live.
//
// The count gives the user a concise summary of what changed.

export const ResultCount: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <button type="button" onClick={() => setCount(12)}>
        Load results
      </button>

      <p role="status">{count === 0 ? "No results loaded." : `${count} results available.`}</p>
    </section>
  );
};

// The result list itself can remain a normal semantic collection.

// ---------------------------------------------------------------------
// 38. Dynamic content inside a live region
// ---------------------------------------------------------------------

// A live region includes its descendants.
// The region therefore does not need to be placed on every changing child.

export const DescendantUpdates: FC = (): ReactElement => {
  const [count, setCount] = useState(1);

  return (
    <div aria-live="polite" aria-atomic="true">
      <p>Notifications: {count}</p>

      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Add notification
      </button>
    </div>
  );
};

// Prefer one appropriately scoped live region instead of marking every
// descendant as independently live.

// ---------------------------------------------------------------------
// 39. Do not make the entire application live
// ---------------------------------------------------------------------

// Applying aria-live to a large application container can result in
// excessive and unpredictable announcements because unrelated updates
// become candidates for notification.

export const ScopedLiveRegion: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <main>
      <h1>Account settings</h1>

      <button type="button" onClick={() => setMessage("Settings saved.")}>
        Save
      </button>

      <p role="status">{message}</p>
    </main>
  );
};

// Scope live regions to the specific dynamic information that needs
// announcement.

// ---------------------------------------------------------------------
// 40. Live regions and React state
// ---------------------------------------------------------------------

// React state changes produce DOM updates.
// When the changed DOM is inside a properly established live region,
// assistive technologies can respond to the resulting accessibility-tree
// update.

export const ReactStateAnnouncement: FC = (): ReactElement => {
  const [complete, setComplete] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setComplete(true)}>
        Complete task
      </button>

      <p role="status">{complete ? "Task completed." : ""}</p>
    </div>
  );
};

// React does not provide a separate screen-reader announcement API for
// ordinary live-region use. The accessibility semantics belong in the DOM.

// ---------------------------------------------------------------------
// 41. Live regions do not make inaccessible widgets accessible
// ---------------------------------------------------------------------

// A live region communicates updates.
// It does not provide:
//
// - keyboard interaction;
// - focus management;
// - button semantics;
// - form labeling;
// - dialog behavior;
// - authorization;
// - validation logic.

export const SeparateResponsibilities: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Menu opened.")}>
        Open menu
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// The button remains responsible for being an accessible interactive
// control. The status only communicates the resulting update.

// ---------------------------------------------------------------------
// 42. Use semantic roles when they match the message
// ---------------------------------------------------------------------

// Prefer a semantic live-region role when it accurately describes the
// information being communicated.
//
// Common choices include:
//
// status -> advisory status
// alert  -> urgent information
// log    -> sequential record

export const SemanticLiveRoles: FC = (): ReactElement => {
  return (
    <div>
      <p role="status">Profile saved.</p>

      <p role="alert">Session expiration is imminent.</p>

      <div role="log">Example activity.</div>
    </div>
  );
};

// These roles communicate different purposes rather than merely different
// visual presentations.

// ---------------------------------------------------------------------
// 43. Live-region announcements should preserve context
// ---------------------------------------------------------------------

// A message should contain enough context to make sense when announced
// independently from the surrounding visual interface.

export const ContextualAnnouncement: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Profile photo uploaded.")}>
        Upload photo
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// "Uploaded." is less informative than "Profile photo uploaded."
// when the announcement is heard without visual context.

// ---------------------------------------------------------------------
// 44. Do not overuse aria-atomic
// ---------------------------------------------------------------------

// aria-atomic="true" is useful when the surrounding context is required,
// but it can cause larger announcements than necessary.
//
// Choose atomic behavior based on the information users need.

export const SelectiveAtomicity: FC = (): ReactElement => {
  const [count, setCount] = useState(1);

  return (
    <div>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Add item
      </button>

      <p role="status" aria-atomic="true">
        Items selected: {count}.
      </p>
    </div>
  );
};

// Atomicity should add context, not simply maximize the amount of speech.

// ---------------------------------------------------------------------
// 45. Do not use assertive announcements for convenience
// ---------------------------------------------------------------------

// Assertive announcements can interrupt speech or other activity.
//
// This makes them inappropriate for routine updates such as:
//
// "Saved."
// "Loaded."
// "Filter changed."
// "Results updated."

export const PoliteRoutineUpdate: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Filter updated.")}>
        Apply filter
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// Reserve assertive behavior for situations where delaying the message
// would materially affect the user's ability to respond.

// ---------------------------------------------------------------------
// 46. Live regions and focus placement
// ---------------------------------------------------------------------

// A live region should normally communicate information without changing
// keyboard focus.
//
// If the user needs to interact with the newly available content,
// appropriate focus management may also be necessary.

export const AnnouncementWithInteraction: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <section>
      <button type="button" onClick={() => setMessage("New settings are available.")}>
        Check for updates
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// If the update instead opens a dialog or another interactive context,
// that component needs its own focus-management strategy.

// ---------------------------------------------------------------------
// 47. Live regions and accessible names
// ---------------------------------------------------------------------

// A live region's purpose is to communicate changing information.
// Its content should not depend on visual-only context.
//
// If a status needs a name, use an appropriate accessible naming mechanism,
// but avoid adding redundant labels.

export const NamedStatus: FC = (): ReactElement => {
  return (
    <section aria-labelledby="sync-heading">
      <h2 id="sync-heading">Synchronization status</h2>

      <p role="status">Synchronization complete.</p>
    </section>
  );
};

// The visible heading provides context without forcing the status message
// itself to repeat the heading.

// ---------------------------------------------------------------------
// 48. Live regions and error recovery
// ---------------------------------------------------------------------

// When an operation fails, the announcement should explain what happened
// and, where appropriate, what the user can do next.
//
// The live region communicates the message; the controls provide recovery.

export const RecoverableError: FC = (): ReactElement => {
  const [error, setError] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setError("Upload failed. Try again.")}>
        Upload
      </button>

      {error && <p role="alert">{error}</p>}

      {error && (
        <button type="button" onClick={() => setError("")}>
          Dismiss error
        </button>
      )}
    </div>
  );
};

// The alert communicates the error.
// The button provides an actual interaction for recovery.

// ---------------------------------------------------------------------
// 49. Live-region testing
// ---------------------------------------------------------------------

// Test live regions with actual dynamic interactions.
//
// Verify:
//
// 1. The region exists before the update.
// 2. The intended content changes.
// 3. The update is announced at the intended urgency.
// 4. Focus remains appropriate.
// 5. The announcement is understandable without visual context.
// 6. Repeated updates do not create excessive noise.

export const TestableAnnouncement: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Export completed.")}>
        Export
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// Automated accessibility testing can verify markup and many structural
// properties, but live-region behavior should also be tested with
// representative browser and assistive-technology combinations.

// ---------------------------------------------------------------------
// 50. Complete live-region example
// ---------------------------------------------------------------------

export const AccessibleLiveRegionExample: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);

  const saveProfile = (): void => {
    setError("");
    setSaved(true);
  };

  const simulateError = (): void => {
    setSaved(false);
    setError("Unable to save profile. Try again.");
  };

  const receiveNotification = (): void => {
    setNotifications((current) => [...current, "New notification received."]);
  };

  return (
    <main>
      <h1>Account settings</h1>

      <section aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>

        <button type="button" onClick={saveProfile}>
          Save profile
        </button>

        <button type="button" onClick={simulateError}>
          Simulate error
        </button>

        <p role="status">{saved ? "Profile saved." : ""}</p>

        {error && <p role="alert">{error}</p>}
      </section>

      <section aria-labelledby="notifications-heading">
        <h2 id="notifications-heading">Notifications</h2>

        <button type="button" onClick={receiveNotification}>
          Receive notification
        </button>

        <ul role="log" aria-live="polite" aria-relevant="additions">
          {notifications.map((notification, index) => (
            <li key={`${notification}-${index}`}>{notification}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

// This example demonstrates:
//
// - a stable status region for ordinary updates;
// - an alert for an urgent error;
// - a log for sequential notifications;
// - appropriate live-region scope;
// - no unnecessary focus movement;
// - concise announcement text;
// - React state driving the dynamic content.
//
// The live-region semantics communicate changes, while the native buttons
// provide the actual interaction behavior.

// ---------------------------------------------------------------------
// 51. Live-region checklist
// ---------------------------------------------------------------------
// - Use live regions when important content changes without moving focus.
// - Prefer aria-live="polite" for ordinary, non-urgent updates.
// - Reserve assertive announcements for genuinely time-sensitive information.
// - Use role="status" for advisory status information.
// - Use role="alert" for important, usually time-sensitive messages.
// - Use role="log" for sequential dynamic records such as activity or chat.
// - Establish the live region before updating its contents.
// - Keep live regions stable when practical.
// - Keep announcements concise and understandable without visual context.
// - Use aria-atomic when the changed value requires surrounding context.
// - Use aria-relevant when specific types of changes need notification.
// - Use aria-busy when related updates should be treated as a single update.
// - Do not move focus merely because a live-region message changed.
// - Do not use live regions as a substitute for focus management.
// - Do not use assertive announcements for routine application updates.
// - Avoid making large application containers live.
// - Avoid duplicate announcement mechanisms for the same message.
// - Do not hide live-region content from the accessibility tree.
// - Test dynamic announcements with representative browsers and assistive technologies.
// - Remember that live regions communicate changes but do not implement widget behavior.

// ---------------------------------------------------------------------
// 52. Summary
// ---------------------------------------------------------------------
// - Live regions expose dynamic content changes to assistive technologies when focus is elsewhere.
// - aria-live controls the announcement priority of a live region.
// - "polite" is appropriate for most routine updates and waits for a suitable opportunity to announce.
// - "assertive" can interrupt current output and should be reserved for genuinely urgent information.
// - role="status" provides semantics for advisory status information and has implicit polite live behavior.
// - role="alert" provides assertive, atomic semantics for important, usually time-sensitive messages.
// - role="log" is appropriate for sequential dynamic information such as activity or chat messages.
// - aria-atomic determines whether the changed portion or the complete live region should be presented.
// - aria-relevant identifies which kinds of changes are relevant to announce.
// - aria-busy can indicate that a live region is being updated and that intermediate changes should not be announced.
// - A live region should generally exist before its contents are dynamically updated.
// - Live regions should be scoped narrowly so unrelated application updates do not generate announcements.
// - Live-region announcements should be concise and provide enough context to be understood independently.
// - Live regions do not move focus and should not be used as a replacement for focus management.
// - Live regions communicate dynamic information but do not provide keyboard behavior or other widget functionality.
// - Automated accessibility testing should be complemented by manual testing with representative browsers and assistive technologies.

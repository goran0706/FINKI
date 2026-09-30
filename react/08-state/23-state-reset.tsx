/**
 * State Reset
 * ===========
 *
 * When a component receives new props, React re-renders the component with those new props.
 * The component's local state, however, is normally preserved as long as React considers the
 * component to have the same identity in the component tree.
 *
 * This means that changing a prop does not automatically reset related local state. When local
 * state is conceptually tied to a changing prop, the component must explicitly synchronize or
 * reset that state when the relevant prop changes.
 */

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export interface Contact {
  readonly id: number;
  readonly name: string;
}

export interface ContactFormProps {
  readonly contact: Contact;
}

// ---------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------

export function ContactForm({ contact }: ContactFormProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [contact.id]);

  return (
    <div>
      <h2>{contact.name}</h2>
      <p>Selected contact ID: {contact.id}</p>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={`Message ${contact.name}`}
      />
      <p>Message: {message || "Empty"}</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Without Explicit Reset
// ---------------------------------------------------------------------

export function ContactFormWithoutReset({ contact }: ContactFormProps) {
  const [message, setMessage] = useState("");

  return (
    <div>
      <h2>{contact.name}</h2>
      <p>Selected contact ID: {contact.id}</p>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={`Message ${contact.name}`}
      />
      <p>Message: {message || "Empty"}</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------

export function StateResetDemo() {
  const [selectedContactId, setSelectedContactId] = useState(1);

  const selectedContact: Contact = selectedContactId === 1 ? { id: 1, name: "Alice" } : { id: 2, name: "Bob" };

  return (
    <div>
      <button type="button" onClick={() => setSelectedContactId((id) => (id === 1 ? 2 : 1))}>
        Switch Contact
      </button>

      <h3>Explicit State Reset</h3>
      <ContactForm contact={selectedContact} />

      <h3>State Preserved</h3>
      <ContactFormWithoutReset contact={selectedContact} />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A prop change causes the child component to re-render with the new props.
// - Local state is normally preserved when the component keeps the same identity.
// - Prop changes do not automatically reset related local state.
// - State can be explicitly reset or synchronized when a relevant prop changes.
// - `useEffect` can perform that reset when a dependency such as `contact.id` changes.
// - A changing `key` provides a different mechanism by giving the component a new identity.

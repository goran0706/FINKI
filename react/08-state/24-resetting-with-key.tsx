/**
 * Resetting with Key
 * ==================
 *
 * A component normally preserves its local state when its props change because React continues
 * to treat it as the same component identity. Changing a prop therefore causes a re-render with
 * the new prop value, but does not by itself recreate the component's local state.
 *
 * A changing `key` provides a way to intentionally give a component a new identity. When the key
 * changes, React does not preserve the previous component state for that position and the new
 * component starts with its initial state.
 */

import { useState } from "react";

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

export function ResettingWithKeyDemo() {
  const [selectedContactId, setSelectedContactId] = useState(1);

  const selectedContact: Contact = selectedContactId === 1 ? { id: 1, name: "Alice" } : { id: 2, name: "Bob" };

  return (
    <div>
      <button type="button" onClick={() => setSelectedContactId((id) => (id === 1 ? 2 : 1))}>
        Switch Contact
      </button>

      <ContactForm key={selectedContact.id} contact={selectedContact} />
    </div>
  );
}

// ---------------------------------------------------------------------
// What Happens
// ---------------------------------------------------------------------

/**
 * Without `key`:
 *
 * Alice
 *   message = "Hello Alice"
 *
 *        ↓ contact changes
 *
 * Bob
 *   message = "Hello Alice"
 *
 * The child re-renders with Bob as the new prop, but its existing local
 * state is preserved because the component keeps the same identity.
 *
 * With `key={selectedContact.id}`:
 *
 * Alice
 *   key = 1
 *   message = "Hello Alice"
 *
 *        ↓ key changes
 *
 * Bob
 *   key = 2
 *   message = ""
 *
 * The child still receives the new Bob prop. The difference is that the
 * changed key gives the component a new identity, so its previous local
 * state is not preserved.
 */

// Common list usage:
//
// {users.map((user) => (
//     <UserCard key={user.id} user={user} />
// ))}
//
// In a list, the key identifies each item for React's reconciliation.
//
// Intentional state reset:
//
// <Chat
//     key={contact.id}
//     contact={contact}
// />
//
// Here the key can intentionally make the chat state belong to the selected
// contact rather than being preserved when switching between contacts.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `key` is not required for props to update.
// - The child re-renders with new props when its parent provides new values.
// - Without a changing key, React normally preserves the child's local state.
// - Changing the key tells React to treat the component as a different identity.
// - The new component therefore starts with its initial state.
// - Use a changing key when the entire component state should belong to a
//   particular identity represented by the key.

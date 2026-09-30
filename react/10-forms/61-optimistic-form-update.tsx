/**
 * Optimistic Form Update
 * =======================
 *
 * `useOptimistic` allows a form to display an expected result immediately while the
 * underlying Action is still executing. The optimistic value is temporary: React
 * displays it while the Action is pending and restores the source state when the
 * Action finishes unless the real state has been updated separately.
 *
 * Optimistic updates are useful when the expected result is predictable, such as
 * adding a submitted item to a list, toggling a setting, or showing a temporary
 * status. They improve perceived responsiveness without treating the optimistic
 * value as confirmed server state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface Message {
  readonly id: number;
  readonly text: string;
}

interface OptimisticMessageAction {
  readonly type: "add";
  readonly message: Message;
}

interface OptimisticToggleAction {
  readonly type: "toggle";
}

interface OptimisticFormItemProps {
  readonly item: Message;
}

interface OptimisticFormListProps {
  readonly items: readonly Message[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * The optimistic reducer receives the current visible state and an optimistic
 * value. The optimistic value can be applied immediately before an Action finishes.
 */
export const OptimisticFormItem: React.FC<OptimisticFormItemProps> = ({ item }): React.ReactElement => {
  return <li>{item.text}</li>;
};

/**
 * A form can optimistically add an item before the asynchronous Action completes.
 * The real state is updated after the simulated server operation succeeds.
 */
export const OptimisticFormList: React.FC<OptimisticFormListProps> = ({ items }): React.ReactElement => {
  const [messages, setMessages] = React.useState<readonly Message[]>(items);

  const [optimisticMessages, addOptimisticMessage] = React.useOptimistic<readonly Message[], OptimisticMessageAction>(
    messages,
    (currentMessages: readonly Message[], action: OptimisticMessageAction): readonly Message[] => {
      if (action.type === "add") {
        return [...currentMessages, action.message];
      }

      return currentMessages;
    },
  );

  const nextId = React.useRef<number>(messages.length + 1);

  const addMessage = async (formData: FormData): Promise<void> => {
    const text: string = String(formData.get("message") ?? "").trim();

    if (text === "") {
      return;
    }

    const message: Message = {
      id: nextId.current,
      text,
    };

    nextId.current += 1;

    addOptimisticMessage({
      type: "add",
      message,
    });

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    setMessages((currentMessages: readonly Message[]): readonly Message[] => [...currentMessages, message]);
  };

  return (
    <form action={addMessage}>
      <input name="message" defaultValue="New message" />

      <button type="submit">Add message</button>

      <ul>
        {optimisticMessages.map((message: Message): React.ReactElement => (
          <OptimisticFormItem key={message.id} item={message} />
        ))}
      </ul>
    </form>
  );
};

/**
 * Optimistic state can represent an immediate toggle while the actual Action
 * performs the asynchronous operation that confirms the change.
 */
export const OptimisticFormToggle: React.FC = (): React.ReactElement => {
  const [enabled, setEnabled] = React.useState<boolean>(false);

  const [optimisticEnabled, addOptimisticToggle] = React.useOptimistic<boolean, OptimisticToggleAction>(
    enabled,
    (currentEnabled: boolean, action: OptimisticToggleAction): boolean => {
      if (action.type === "toggle") {
        return !currentEnabled;
      }

      return currentEnabled;
    },
  );

  const toggleAction = async (): Promise<void> => {
    addOptimisticToggle({ type: "toggle" });

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    setEnabled((currentEnabled: boolean): boolean => !currentEnabled);
  };

  return (
    <form action={toggleAction}>
      <button type="submit">{optimisticEnabled ? "Enabled" : "Disabled"}</button>
    </form>
  );
};

/**
 * An optimistic value is not confirmation from the server. If the asynchronous
 * operation fails and the source state is not updated, React can return to the
 * source state after the Action completes.
 */
export const OptimisticFormFailure: React.FC = (): React.ReactElement => {
  const [items, setItems] = React.useState<readonly string[]>(["Existing item"]);

  const [optimisticItems, addOptimisticItem] = React.useOptimistic<readonly string[], string>(
    items,
    (currentItems: readonly string[], optimisticItem: string): readonly string[] => [...currentItems, optimisticItem],
  );

  const addItem = async (formData: FormData): Promise<void> => {
    const value: string = String(formData.get("value") ?? "").trim();

    if (value === "") {
      return;
    }

    addOptimisticItem(value);

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    // The source state is intentionally not updated here. When the Action
    // completes, the optimistic item is therefore not treated as confirmed.
  };

  return (
    <form action={addItem}>
      <input name="value" defaultValue="Temporary item" />
      <button type="submit">Add optimistically</button>

      <ul>
        {optimisticItems.map((item: string, index: number): React.ReactElement => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </form>
  );
};

/**
 * Optimistic state can include a temporary visual status. The status belongs
 * to the optimistic representation rather than to confirmed application state.
 */
export const OptimisticFormStatus: React.FC = (): React.ReactElement => {
  const [items, setItems] = React.useState<readonly Message[]>([]);

  const [optimisticItems, addOptimisticItem] = React.useOptimistic<readonly Message[], Message>(
    items,
    (currentItems: readonly Message[], optimisticItem: Message): readonly Message[] => [
      ...currentItems,
      optimisticItem,
    ],
  );

  const addItem = async (formData: FormData): Promise<void> => {
    const text: string = String(formData.get("text") ?? "").trim();

    if (text === "") {
      return;
    }

    const optimisticItem: Message = {
      id: Date.now(),
      text: `${text} (sending...)`,
    };

    addOptimisticItem(optimisticItem);

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    setItems((currentItems: readonly Message[]): readonly Message[] => [
      ...currentItems,
      {
        id: optimisticItem.id,
        text,
      },
    ]);
  };

  return (
    <form action={addItem}>
      <input name="text" defaultValue="Message" />
      <button type="submit">Send</button>

      <ul>
        {optimisticItems.map((item: Message): React.ReactElement => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const OptimisticFormUpdate: React.FC = (): React.ReactElement => {
  const initialMessages: readonly Message[] = [
    {
      id: 1,
      text: "Existing message",
    },
  ];

  return (
    <div>
      <h1>Optimistic Form Update</h1>

      <h2>1. Optimistic List Update</h2>
      <OptimisticFormList items={initialMessages} />

      <h2>2. Optimistic Toggle</h2>
      <OptimisticFormToggle />

      <h2>3. Optimistic State Without Confirmation</h2>
      <OptimisticFormFailure />

      <h2>4. Optimistic Status</h2>
      <OptimisticFormStatus />
    </div>
  );
};

export default OptimisticFormUpdate;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useOptimistic` provides temporary UI state while an Action is executing.
// - `addOptimistic` applies the expected result immediately.
// - The optimistic reducer derives the temporary representation from source state.
// - Optimistic state should represent an expected result, not confirmed server state.
// - The source state should be updated when the underlying operation succeeds.
// - If the source state is not updated, the optimistic value does not become permanent.
// - Optimistic updates are useful for predictable operations such as adding items or toggling state.
// - Optimistic UI improves responsiveness but does not replace server-side confirmation or error handling.

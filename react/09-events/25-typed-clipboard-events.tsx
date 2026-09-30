/**
 * Typed Clipboard Events
 * ======================
 *
 * React provides the `ClipboardEvent<T>` type for clipboard interactions such as copying, cutting,
 * and pasting content. The generic element parameter identifies the element receiving the handler
 * and gives `currentTarget` an element-specific TypeScript type.
 *
 * Clipboard events expose the browser's `clipboardData` object, which implements the
 * `DataTransfer` interface. It can contain text and other clipboard representations, allowing
 * handlers to inspect pasted content or control data placed on the clipboard during copy and cut.
 *
 * Clipboard access through event handlers is distinct from the asynchronous Clipboard API.
 * Clipboard events describe a user-initiated clipboard operation, while APIs such as
 * `navigator.clipboard.readText()` and `navigator.clipboard.writeText()` provide programmatic
 * clipboard access subject to browser security and permission requirements.
 */

import React, { type ClipboardEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ClipboardCopyProps {
  readonly label: string;
}

export interface ClipboardPasteProps {
  readonly label: string;
}

export interface ClipboardCutProps {
  readonly label: string;
}

export interface ClipboardDataProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `ClipboardEvent<HTMLInputElement>` gives a copy handler an input-specific
 * `currentTarget` while exposing clipboard data through `clipboardData`.
 */
export const ClipboardCopy: React.FC<ClipboardCopyProps> = ({ label }): ReactElement => {
  const handleCopy = (event: ClipboardEvent<HTMLInputElement>): void => {
    console.log("Copied value:", event.currentTarget.value);
    console.log("Clipboard data:", event.clipboardData);
  };

  return <input aria-label={label} defaultValue="Copy this text" onCopy={handleCopy} />;
};

/**
 * A paste event exposes clipboard data through `clipboardData`. Reading text
 * from it is synchronous within the clipboard event handler.
 */
export const ClipboardPaste: React.FC<ClipboardPasteProps> = ({ label }): ReactElement => {
  const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
    const pastedText: string = event.clipboardData.getData("text");

    console.log("Pasted text:", pastedText);
  };

  return <input aria-label={label} onPaste={handlePaste} />;
};

/**
 * Cut events provide the same `ClipboardEvent<T>` shape as copy and paste
 * events, while representing removal of selected content.
 */
export const ClipboardCut: React.FC<ClipboardCutProps> = ({ label }): ReactElement => {
  const handleCut = (event: ClipboardEvent<HTMLInputElement>): void => {
    console.log("Cut value:", event.currentTarget.value);
    console.log("Clipboard data:", event.clipboardData);
  };

  return <input aria-label={label} defaultValue="Cut this text" onCut={handleCut} />;
};

/**
 * `clipboardData` is a `DataTransfer` object that can expose multiple
 * representations of the clipboard contents. `types` identifies available
 * data formats.
 */
export const ClipboardData: React.FC<ClipboardDataProps> = ({ label }): ReactElement => {
  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>): void => {
    const clipboardTypes: readonly string[] = Array.from(event.clipboardData.types);

    console.log("Clipboard types:", clipboardTypes);
    console.log("Plain text:", event.clipboardData.getData("text/plain"));
  };

  return <textarea aria-label={label} placeholder={label} onPaste={handlePaste} />;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedClipboardEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Handling Copy Events</h2>
      <ClipboardCopy label="Copy text" />

      <h2>2. Reading Pasted Text</h2>
      <ClipboardPaste label="Paste text" />

      <h2>3. Handling Cut Events</h2>
      <ClipboardCut label="Cut text" />

      <h2>4. Inspecting Clipboard Data</h2>
      <ClipboardData label="Paste into this field" />
    </div>
  );
};

export default TypedClipboardEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React clipboard handlers use the specialized `ClipboardEvent<T>` type.
// - The generic parameter identifies the element receiving the clipboard handler.
// - Copy, cut, and paste events expose clipboard contents through `event.clipboardData`.
// - `clipboardData` implements the browser's `DataTransfer` interface.
// - `getData("text/plain")` reads plain-text clipboard data during a clipboard event.
// - `clipboardData.types` identifies the data representations available on the clipboard.
// - Clipboard events are distinct from the asynchronous `navigator.clipboard` API.

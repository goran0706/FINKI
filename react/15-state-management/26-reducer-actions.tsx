/**
 * Reducer Actions
 * ===============
 *
 * Reducer actions represent explicit intent-driven events that describe what happened in the application
 * rather than how state should change. In TypeScript, discriminated unions model action types, using
 * a common string literal `type` field to provide complete type safety across action handlers.
 *
 * Descriptive, action-oriented payloads capture user actions cleanly, keeping business transition rules
 * localized within the reducer while keeping dispatch calls declarative and expressive.
 */

import React, { useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface & Discriminated Union Definitions
// ---------------------------------------------------------------------

export interface DocumentState {
  readonly title: string;
  readonly content: string;
  readonly isPublished: boolean;
}

export type DocumentAction =
  | { readonly type: "TITLE_CHANGED"; readonly newTitle: string }
  | { readonly type: "CONTENT_CHANGED"; readonly newContent: string }
  | { readonly type: "PUBLISH_STATUS_TOGGLED" }
  | { readonly type: "DOCUMENT_RESET" };

// ---------------------------------------------------------------------
// 2. Pure Reducer Function
// ---------------------------------------------------------------------

export const initialDocumentState: DocumentState = {
  title: "Untitled Document",
  content: "",
  isPublished: false,
};

export const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case "TITLE_CHANGED":
      return { ...state, title: action.newTitle };
    case "CONTENT_CHANGED":
      return { ...state, content: action.newContent };
    case "PUBLISH_STATUS_TOGGLED":
      return { ...state, isPublished: !state.isPublished };
    case "DOCUMENT_RESET":
      return initialDocumentState;
    default:
      return state;
  }
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const DocumentEditor: React.FC = () => {
  const [state, dispatch] = useReducer(documentReducer, initialDocumentState);

  return (
    <div>
      <h4>Document Editor</h4>

      <div>
        <label>
          Title:
          <input
            type="text"
            value={state.title}
            onChange={(e) =>
              dispatch({
                type: "TITLE_CHANGED",
                newTitle: e.target.value,
              })
            }
          />
        </label>
      </div>

      <div>
        <label>Content:</label>
        <textarea
          rows={4}
          value={state.content}
          onChange={(e) =>
            dispatch({
              type: "CONTENT_CHANGED",
              newContent: e.target.value,
            })
          }
        />
      </div>

      <div>
        <button type="button" onClick={() => dispatch({ type: "PUBLISH_STATUS_TOGGLED" })}>
          {state.isPublished ? "Unpublish Document" : "Publish Document"}
        </button>
        <button type="button" onClick={() => dispatch({ type: "DOCUMENT_RESET" })}>
          Reset All Fields
        </button>
      </div>

      <div>
        <h5>Document Status Preview</h5>
        <p>
          <strong>Title:</strong> {state.title}
        </p>
        <p>
          <strong>Status:</strong> {state.isPublished ? "Published" : "Draft"}
        </p>
        <p>
          <strong>Word Count:</strong> {state.content.trim() ? state.content.trim().split(/\s+/).length : 0}
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ReducerActionsContainer: React.FC = () => {
  return (
    <div>
      <h1>26 - Reducer Actions</h1>

      <h2>1. Intent-Driven Discriminated Union Actions in Reducer State Transitions</h2>
      <DocumentEditor />
    </div>
  );
};

export default ReducerActionsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reducer actions describe domain events rather than direct state mutation commands.
// - Discriminated unions model action types in TypeScript with strict compile-time safety.
// - Action type strings reflect user intent clearly, supporting straightforward audit logging.
// - Dispatching semantic actions decouples UI components from concrete state modifications.
// - Strongly typed actions prevent missing property errors and state transition bugs.

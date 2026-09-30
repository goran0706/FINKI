/**
 * State Normalization
 * ===================
 *
 * Deeply nested state structures make updates complex and error-prone because updating an item requires
 * making copies of every object level above it. State normalization flattens complex nested data trees into
 * table-like lookup maps keyed by unique IDs.
 *
 * Normalized state splits nested structures into lookup dictionaries and ID arrays. This structure allows
 * updating, inserting, or removing individual elements in constant time ($O(1)$) without traversing or
 * duplicating deep object hierarchies.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CommentItem {
  readonly id: number;
  readonly text: string;
}

export interface PostItem {
  readonly id: number;
  readonly title: string;
  readonly commentIds: readonly number[];
}

export interface NormalizedState {
  readonly posts: { readonly [id: number]: PostItem };
  readonly comments: { readonly [id: number]: CommentItem };
  readonly allPostIds: readonly number[];
}

export interface NormalizationProps {
  readonly initialState: NormalizedState;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const NormalizedDataViewer: React.FC<NormalizationProps> = ({ initialState }) => {
  const [state, setState] = useState<NormalizedState>(initialState);

  const handleUpdateCommentText = (commentId: number, newText: string): void => {
    // Direct flat update to comments dictionary in O(1) without touching post hierarchy
    setState((prevState) => ({
      ...prevState,
      comments: {
        ...prevState.comments,
        [commentId]: {
          ...prevState.comments[commentId],
          text: newText,
        },
      },
    }));
  };

  const handleRemoveCommentFromPost = (postId: number, commentId: number): void => {
    // Remove comment ID from post's commentIds list immutably
    setState((prevState) => ({
      ...prevState,
      posts: {
        ...prevState.posts,
        [postId]: {
          ...prevState.posts[postId],
          commentIds: prevState.posts[postId].commentIds.filter((id) => id !== commentId),
        },
      },
    }));
  };

  return (
    <div>
      {state.allPostIds.map((postId) => {
        const post = state.posts[postId];
        if (!post) {
          return null;
        }

        return (
          <div key={post.id} style={{ marginBottom: "16px", paddingLeft: "8px" }}>
            <h3>{post.title}</h3>
            <ul>
              {post.commentIds.map((commentId) => {
                const comment = state.comments[commentId];
                if (!comment) {
                  return null;
                }

                return (
                  <li key={comment.id}>
                    {comment.text}{" "}
                    <button
                      type="button"
                      onClick={() => handleUpdateCommentText(comment.id, `${comment.text} (Edited)`)}
                    >
                      Edit Comment Text
                    </button>{" "}
                    <button type="button" onClick={() => handleRemoveCommentFromPost(post.id, comment.id)}>
                      Unlink Comment
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateNormalizationContainer: React.FC = () => {
  const initialNormalizedData: NormalizedState = {
    posts: {
      1: {
        id: 1,
        title: "React Architecture Principles",
        commentIds: [101, 102],
      },
      2: { id: 2, title: "State Management Modules", commentIds: [103] },
    },
    comments: {
      101: { id: 101, text: "Great structure overview." },
      102: { id: 102, text: "Normalization keeps updates fast." },
      103: { id: 103, text: "Looking forward to next chapters." },
    },
    allPostIds: [1, 2],
  };

  return (
    <div>
      <h1>21 - State Normalization</h1>

      <h2>1. Flat Lookup Dictionaries and Isolated ID Arrays</h2>
      <NormalizedDataViewer initialState={initialNormalizedData} />
    </div>
  );
};

export default StateNormalizationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State normalization flattens nested hierarchies into table-like lookup dictionaries keyed by ID.
// - Flat lookup maps enable direct O(1) element access without traversing nested tree nodes.
// - Updating isolated dictionary items prevents re-copying unchanged parent nodes throughout the tree.
// - Separating data entities from ordering arrays simplifies entity reuse across multiple views.
// - Normalized state structures make complex state updates predictable, maintainable, and bug-free.

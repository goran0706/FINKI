/**
 * React Textarea
 * ==============
 *
 * React `<textarea>` elements represent multi-line text input. A controlled textarea stores its
 * current contents in React state and passes that state through the `value` prop. The `onChange`
 * handler receives a `ChangeEvent<HTMLTextAreaElement>`, and `event.target.value` contains the
 * textarea's current string value.
 *
 * Unlike native HTML syntax, React uses the `value` prop to control the current textarea contents
 * rather than placing the initial text between the opening and closing `<textarea>` tags.
 * `defaultValue` can be used when the textarea should remain uncontrolled after its initial render.
 *
 * Textareas can also be constrained with native attributes such as `maxLength` and `required`.
 * These constraints are enforced by the browser, while React state continues to represent the
 * current value. The `rows` and `cols` attributes affect the textarea's initial displayed
 * dimensions but do not limit the amount of text that can be entered.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TextareaProps {
  readonly label: string;
  readonly initialValue: string;
}

export interface LimitedTextareaProps {
  readonly label: string;
  readonly initialValue: string;
  readonly maxLength: number;
}

export interface RequiredTextareaProps {
  readonly label: string;
  readonly placeholder: string;
}

export interface UncontrolledTextareaProps {
  readonly label: string;
  readonly defaultValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const Textarea: React.FC<TextareaProps> = ({ label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <textarea value={value} onChange={handleChange} rows={4} />
      <span> Characters: {value.length}</span>
    </label>
  );
};

export const LimitedTextarea: React.FC<LimitedTextareaProps> = ({
  label,
  initialValue,
  maxLength,
}): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <textarea value={value} onChange={handleChange} maxLength={maxLength} rows={4} />
      <span>
        {value.length} / {maxLength}
      </span>
    </label>
  );
};

export const RequiredTextarea: React.FC<RequiredTextareaProps> = ({ label, placeholder }): React.ReactElement => {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <textarea required value={value} onChange={handleChange} placeholder={placeholder} rows={4} />
    </label>
  );
};

export const UncontrolledTextarea: React.FC<UncontrolledTextareaProps> = ({
  label,
  defaultValue,
}): React.ReactElement => {
  return (
    <label>
      {label}
      <textarea defaultValue={defaultValue} rows={4} />
    </label>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>React Textarea</h1>

      <h2>1. Controlled Textarea</h2>
      <Textarea label="Description" initialValue="React is a JavaScript library for building user interfaces." />

      <h2>2. Maximum Text Length</h2>
      <LimitedTextarea label="Short message" initialValue="" maxLength={100} />

      <h2>3. Required Textarea</h2>
      <RequiredTextarea label="Comment" placeholder="Enter your comment" />

      <h2>4. Uncontrolled Textarea</h2>
      <UncontrolledTextarea label="Notes" defaultValue="Initial notes" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A controlled `<textarea>` uses `value` and `onChange` to synchronize text with React state.
// - `ChangeEvent<HTMLTextAreaElement>` is the appropriate event type for textarea changes.
// - `event.target.value` contains the textarea's current string value.
// - React uses the `value` prop instead of child content to control a textarea.
// - `defaultValue` creates an uncontrolled textarea with an initial value.
// - `maxLength` limits the number of characters accepted by the browser.
// - `required` prevents form submission when the textarea is empty.
// - `rows` controls the initial visible height but does not limit the text length.

/**
 * Multiple Files
 * ==============
 *
 * A file input can allow users to select multiple files by using the `multiple` attribute.
 * When multiple selection is enabled, the input exposes a `FileList` containing every selected
 * file. `FileList` is array-like but is not a normal JavaScript array, so applications commonly
 * convert it to `File[]` when they need array operations such as `map`, `filter`, or `slice`.
 *
 * Selecting files again replaces the input's current `FileList`; it does not automatically append
 * the newly selected files to the previous selection. If an application needs an accumulating
 * collection, the selected `File` objects must be copied into React state and managed explicitly.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MultipleFilesBasicProps {
  readonly initialFiles: readonly File[];
}

export interface MultipleFilesListProps {
  readonly initialFiles: readonly File[];
}

export interface MultipleFilesAccumulationProps {
  readonly initialFiles: readonly File[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MultipleFilesBasic: React.FC<MultipleFilesBasicProps> = ({ initialFiles }): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>((): File[] => [...initialFiles]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    setFiles(selectedFiles);
  };

  return (
    <div>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      <p>Selected files: {files.length}</p>

      {files.length > 0 && (
        <ul>
          {files.map((file: File): React.ReactElement => (
            <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MultipleFilesList: React.FC<MultipleFilesListProps> = ({ initialFiles }): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>((): File[] => [...initialFiles]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    setFiles(selectedFiles);
  };

  const totalSize: number = files.reduce((total: number, file: File): number => total + file.size, 0);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label>
        Upload documents
        <input type="file" multiple accept=".pdf,.txt,.doc,.docx" onChange={handleChange} />
      </label>

      {files.length === 0 ? (
        <p>No files selected.</p>
      ) : (
        <>
          <ul>
            {files.map((file: File, index: number): React.ReactElement => (
              <li key={`${file.name}-${file.lastModified}-${index}`}>
                <strong>{file.name}</strong> — {file.type || "Unknown type"} — {formatSize(file.size)}
              </li>
            ))}
          </ul>

          <p>
            {files.length} file
            {files.length === 1 ? "" : "s"} — {formatSize(totalSize)} total
          </p>
        </>
      )}
    </div>
  );
};

export const MultipleFilesAccumulation: React.FC<MultipleFilesAccumulationProps> = ({
  initialFiles,
}): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>((): File[] => [...initialFiles]);

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    setFiles((currentFiles: File[]): File[] => {
      const existingFiles: Set<string> = new Set(
        currentFiles.map((file: File): string => `${file.name}:${file.size}:${file.lastModified}`),
      );

      const newFiles: File[] = selectedFiles.filter(
        (file: File): boolean => !existingFiles.has(`${file.name}:${file.size}:${file.lastModified}`),
      );

      return [...currentFiles, ...newFiles];
    });

    event.target.value = "";
  };

  const handleRemove = (fileIndex: number): void => {
    setFiles((currentFiles: File[]): File[] =>
      currentFiles.filter((_file: File, index: number): boolean => index !== fileIndex),
    );
  };

  const handleClear = (): void => {
    setFiles([]);
  };

  return (
    <div>
      <label>
        Add files
        <input type="file" multiple onChange={handleAddFiles} />
      </label>

      {files.length > 0 && (
        <>
          <ul>
            {files.map((file: File, index: number): React.ReactElement => (
              <li key={`${file.name}-${file.lastModified}-${index}`}>
                {file.name}

                <button
                  type="button"
                  onClick={(): void => {
                    handleRemove(index);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button type="button" onClick={handleClear}>
            Clear all
          </button>
        </>
      )}

      {files.length === 0 && <p>No files have been added.</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Multiple Files</h1>

      <h2>1. Reading Multiple Selected Files</h2>
      <MultipleFilesBasic initialFiles={[]} />

      <h2>2. Displaying Metadata for Multiple Files</h2>
      <MultipleFilesList initialFiles={[]} />

      <h2>3. Accumulating, Removing, and Clearing Files</h2>
      <MultipleFilesAccumulation initialFiles={[]} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The `multiple` attribute allows a file input to select more than one file.
// - `event.target.files` is a `FileList` or `null` when no files are available.
// - `FileList` is array-like but is not a normal JavaScript array.
// - `Array.from()` converts a `FileList` into a `File[]` that can be manipulated with array methods.
// - Selecting files again replaces the input's current selection rather than automatically appending to it.
// - An application can copy selected files into React state when it needs an accumulating collection.
// - `File` objects expose metadata such as `name`, `size`, `type`, and `lastModified`.
// - The `accept` attribute filters the file types presented by the file picker but does not provide security validation.
// - Clearing the native file input with `event.target.value = ""` allows a later selection of the same file to produce another change event.
// - File contents should not be trusted solely because a browser file input restricts the selectable file types.

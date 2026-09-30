/**
 * File List
 * =========
 *
 * A file list represents the files currently selected by a file input as application state that
 * can be displayed, inspected, filtered, or removed before submission. The native `FileList`
 * provided by an `<input type="file">` is read-only and belongs to the input element, so applications
 * that need to manipulate the collection should copy its `File` objects into their own state.
 *
 * A `File` contains metadata such as its name, size, MIME type, and last-modified timestamp.
 * File objects can also be passed directly to APIs such as `FormData` or `URL.createObjectURL()`
 * when the application needs to submit or preview their contents.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FileListItem {
  readonly id: string;
  readonly file: File;
}

export interface FileListDisplayProps {
  readonly initialFiles: readonly File[];
}

export interface FileListFilterProps {
  readonly initialFiles: readonly File[];
}

export interface FileListRemoveProps {
  readonly initialFiles: readonly File[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FileListDisplay: React.FC<FileListDisplayProps> = ({ initialFiles }): React.ReactElement => {
  const [files, setFiles] = React.useState<FileListItem[]>((): FileListItem[] =>
    initialFiles.map((file: File, index: number): FileListItem => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
    })),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    setFiles(
      selectedFiles.map((file: File, index: number): FileListItem => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        file,
      })),
    );
  };

  const formatSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      {files.length === 0 ? (
        <p>No files selected.</p>
      ) : (
        <ul>
          {files.map((item: FileListItem): React.ReactElement => (
            <li key={item.id}>
              <strong>{item.file.name}</strong> — {formatSize(item.file.size)} — {item.file.type || "Unknown type"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FileListFilter: React.FC<FileListFilterProps> = ({ initialFiles }): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>((): File[] => [...initialFiles]);
  const [query, setQuery] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    setFiles(selectedFiles);
  };

  const normalizedQuery: string = query.trim().toLowerCase();

  const filteredFiles: File[] =
    normalizedQuery === ""
      ? files
      : files.filter((file: File): boolean => file.name.toLowerCase().includes(normalizedQuery));

  return (
    <div>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      <label>
        Filter by name
        <input
          type="search"
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setQuery(event.target.value);
          }}
        />
      </label>

      <p>
        Showing {filteredFiles.length} of {files.length} files.
      </p>

      {filteredFiles.length > 0 && (
        <ul>
          {filteredFiles.map((file: File, index: number): React.ReactElement => (
            <li key={`${file.name}-${file.lastModified}-${index}`}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FileListRemove: React.FC<FileListRemoveProps> = ({ initialFiles }): React.ReactElement => {
  const [files, setFiles] = React.useState<FileListItem[]>((): FileListItem[] =>
    initialFiles.map((file: File, index: number): FileListItem => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
    })),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    setFiles(
      selectedFiles.map((file: File, index: number): FileListItem => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        file,
      })),
    );
  };

  const handleRemove = (id: string): void => {
    setFiles((currentFiles: FileListItem[]): FileListItem[] =>
      currentFiles.filter((item: FileListItem): boolean => item.id !== id),
    );
  };

  const handleClear = (): void => {
    setFiles([]);
  };

  return (
    <div>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      {files.length > 0 && (
        <>
          <ul>
            {files.map((item: FileListItem): React.ReactElement => (
              <li key={item.id}>
                {item.file.name}

                <button
                  type="button"
                  onClick={(): void => {
                    handleRemove(item.id);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button type="button" onClick={handleClear}>
            Clear list
          </button>
        </>
      )}

      {files.length === 0 && <p>No files remain in the list.</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>File List</h1>

      <h2>1. Displaying Files and Their Metadata</h2>
      <FileListDisplay initialFiles={[]} />

      <h2>2. Filtering a File List by File Name</h2>
      <FileListFilter initialFiles={[]} />

      <h2>3. Removing Files from an Application-Owned List</h2>
      <FileListRemove initialFiles={[]} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A native file input exposes its current selection through `FileList`.
// - `FileList` is read-only and should be converted to an array when the application needs to manipulate the collection.
// - A `File` contains metadata such as its name, size, MIME type, and last-modified timestamp.
// - Application state can store `File` objects when files need to be displayed or manipulated before submission.
// - Filtering a file list changes the displayed collection without changing the underlying selected files.
// - Removing an item from application state does not modify the native `FileList` owned by the file input.
// - A native file input cannot be controlled by assigning arbitrary file values to its `value` property.
// - Stable application-level identities make targeted removal and React list rendering easier to reason about.
// - File metadata such as `type` comes from the browser and should not be treated as a security guarantee.
// - Keeping a file in React state does not upload it; the file remains local until application code sends it to a server or another API.

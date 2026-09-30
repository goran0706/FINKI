/**
 * Multiple File Upload
 * =====================
 *
 * Multiple file uploads allow several `File` objects to be transferred in a single submission.
 * A file input with the `multiple` attribute exposes a `FileList`, which can be converted into a
 * normal `File[]` for application state and processing.
 *
 * `FormData` can contain multiple values under the same field name. Calling `append()` once for
 * each selected file preserves every file in the multipart request, whereas `set()` replaces the
 * existing value for that field name. The server must therefore be designed to accept repeated
 * multipart fields when multiple files are uploaded under one name.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MultipleFileUploadBasicProps {
  readonly uploadUrl: string;
  readonly maxFiles: number;
}

export interface MultipleFileUploadMetadataProps {
  readonly uploadUrl: string;
  readonly maxFiles: number;
}

export interface MultipleFileUploadSelectionProps {
  readonly uploadUrl: string;
  readonly maxFiles: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MultipleFileUploadBasic: React.FC<MultipleFileUploadBasicProps> = ({
  uploadUrl,
  maxFiles,
}): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    if (selectedFiles.length > maxFiles) {
      setFiles([]);
      setStatus(`Select no more than ${maxFiles} files.`);
      return;
    }

    setFiles(selectedFiles);
    setStatus("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (files.length === 0) {
      setStatus("Select at least one file before uploading.");
      return;
    }

    const formData: FormData = new FormData();

    files.forEach((file: File): void => {
      formData.append("files", file);
    });

    setStatus("Uploading...");

    try {
      const response: Response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}.`);
      }

      setStatus(`${files.length} file(s) uploaded successfully.`);
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "The upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      <p>
        Selected {files.length} of {maxFiles} allowed files.
      </p>

      {files.length > 0 && (
        <ul>
          {files.map((file: File): React.ReactElement => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`}>{file.name}</li>
          ))}
        </ul>
      )}

      <button type="submit">Upload files</button>

      {status !== "" && <p role="status">{status}</p>}
    </form>
  );
};

export const MultipleFileUploadMetadata: React.FC<MultipleFileUploadMetadataProps> = ({
  uploadUrl,
  maxFiles,
}): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    if (selectedFiles.length > maxFiles) {
      setFiles([]);
      setStatus(`You can select up to ${maxFiles} files.`);
      return;
    }

    setFiles(selectedFiles);
    setStatus("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (files.length === 0) {
      setStatus("No files selected.");
      return;
    }

    const formData: FormData = new FormData();

    files.forEach((file: File): void => {
      formData.append("files", file);
    });

    formData.append("fileCount", String(files.length));

    formData.append("totalBytes", String(files.reduce((total: number, file: File): number => total + file.size, 0)));

    setStatus("Uploading...");

    try {
      const response: Response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}.`);
      }

      setStatus("Files and upload metadata were submitted.");
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "The upload failed.");
    }
  };

  const totalBytes: number = files.reduce((total: number, file: File): number => total + file.size, 0);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      <p>Files: {files.length}</p>

      <p>Total size: {totalBytes} bytes</p>

      {files.length > 0 && (
        <ul>
          {files.map((file: File): React.ReactElement => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`}>
              {file.name} — {file.size} bytes — {file.type || "unknown type"}
            </li>
          ))}
        </ul>
      )}

      <button type="submit">Upload files</button>

      {status !== "" && <p role="status">{status}</p>}
    </form>
  );
};

export const MultipleFileUploadSelection: React.FC<MultipleFileUploadSelectionProps> = ({
  uploadUrl,
  maxFiles,
}): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    if (selectedFiles.length > maxFiles) {
      setFiles([]);
      setStatus(`Select no more than ${maxFiles} files.`);
      return;
    }

    setFiles(selectedFiles);
    setStatus("");
  };

  const handleRemove = (indexToRemove: number): void => {
    setFiles((currentFiles: File[]): File[] =>
      currentFiles.filter((_file: File, index: number): boolean => index !== indexToRemove),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (files.length === 0) {
      setStatus("Select at least one file.");
      return;
    }

    const formData: FormData = new FormData();

    files.forEach((file: File): void => {
      formData.append("files", file);
    });

    setStatus("Uploading...");

    try {
      const response: Response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}.`);
      }

      setStatus(`${files.length} selected file(s) uploaded successfully.`);
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "The upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select files
        <input type="file" multiple onChange={handleChange} />
      </label>

      {files.length === 0 ? (
        <p>No files selected.</p>
      ) : (
        <ul>
          {files.map((file: File, index: number): React.ReactElement => (
            <li key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
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
      )}

      <button type="submit" disabled={files.length === 0}>
        Upload selected files
      </button>

      {status !== "" && <p role="status">{status}</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Multiple File Upload</h1>

      <h2>1. Uploading Multiple Files Under One FormData Field</h2>
      <MultipleFileUploadBasic uploadUrl="/api/upload" maxFiles={5} />

      <h2>2. Sending Multiple Files with Upload Metadata</h2>
      <MultipleFileUploadMetadata uploadUrl="/api/upload" maxFiles={5} />

      <h2>3. Removing Individual Files Before Upload</h2>
      <MultipleFileUploadSelection uploadUrl="/api/upload" maxFiles={5} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The `multiple` attribute allows a file input to expose more than one selected file.
// - `FileList` can be converted to `File[]` with `Array.from()` for easier application-level processing.
// - `FormData.append()` preserves multiple values under the same field name.
// - Repeated calls to `append("files", file)` create multiple multipart entries named `files`.
// - `FormData.set()` replaces the existing value for a field name and therefore has different semantics from `append()`.
// - Multiple selected files can be processed individually before they are added to the upload request.
// - Application state can allow users to remove individual files before submission.
// - Upload metadata such as file count and total byte size can be sent as ordinary `FormData` fields alongside the files.
// - File selection state should be treated as application state rather than assuming the browser input itself is the complete upload model.
// - The server must explicitly support the multipart field structure used for multiple files.
// - Client-side file limits improve the user experience but do not replace server-side limits and validation.

/**
 * File Upload
 * ============
 *
 * File uploads transfer user-selected `File` objects from the browser to a server. The browser
 * represents selected files with the File API, while `FormData` provides a multipart/form-data
 * request body that can carry files together with ordinary form fields.
 *
 * A file input does not upload anything by itself. Application code must explicitly submit the
 * selected file, commonly with `fetch()` or `XMLHttpRequest`. When sending `FormData`, the browser
 * generates the multipart boundary automatically, so application code should not manually set the
 * `Content-Type` header.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FileUploadBasicProps {
  readonly uploadUrl: string;
}

export interface FileUploadMultipleProps {
  readonly uploadUrl: string;
  readonly maxFiles: number;
}

export interface FileUploadProgressProps {
  readonly uploadUrl: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FileUploadBasic: React.FC<FileUploadBasicProps> = ({ uploadUrl }): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
    setStatus("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (file === null) {
      setStatus("Select a file before uploading.");
      return;
    }

    const formData: FormData = new FormData();

    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const response: Response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}.`);
      }

      setStatus("Upload completed.");
    } catch (error: unknown) {
      setStatus(error instanceof Error ? error.message : "The upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select a file
        <input type="file" onChange={handleChange} />
      </label>

      {file !== null && <p>Selected: {file.name}</p>}

      <button type="submit">Upload</button>

      {status !== "" && <p role="status">{status}</p>}
    </form>
  );
};

export const FileUploadMultiple: React.FC<FileUploadMultipleProps> = ({ uploadUrl, maxFiles }): React.ReactElement => {
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
        Select multiple files
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

export const FileUploadProgress: React.FC<FileUploadProgressProps> = ({ uploadUrl }): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
    setProgress(0);
    setStatus("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (file === null) {
      setStatus("Select a file before uploading.");
      return;
    }

    const formData: FormData = new FormData();

    formData.append("file", file);

    const request: XMLHttpRequest = new XMLHttpRequest();

    request.upload.addEventListener("progress", (progressEvent: ProgressEvent<XMLHttpRequestEventTarget>): void => {
      if (!progressEvent.lengthComputable) {
        return;
      }

      const nextProgress: number = Math.round((progressEvent.loaded / progressEvent.total) * 100);

      setProgress(nextProgress);
    });

    request.addEventListener("load", (): void => {
      setUploading(false);

      if (request.status >= 200 && request.status < 300) {
        setProgress(100);
        setStatus("Upload completed.");
        return;
      }

      setStatus(`Upload failed with status ${request.status}.`);
    });

    request.addEventListener("error", (): void => {
      setUploading(false);
      setStatus("The upload failed.");
    });

    request.addEventListener("abort", (): void => {
      setUploading(false);
      setStatus("The upload was cancelled.");
    });

    setProgress(0);
    setStatus("Uploading...");
    setUploading(true);

    request.open("POST", uploadUrl);

    request.send(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select a file
        <input type="file" onChange={handleChange} disabled={uploading} />
      </label>

      {file !== null && <p>Selected: {file.name}</p>}

      <progress value={progress} max={100}>
        {progress}%
      </progress>

      <p>Upload progress: {progress}%</p>

      <button type="submit" disabled={uploading || file === null}>
        {uploading ? "Uploading..." : "Upload"}
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
      <h1>File Upload</h1>

      <h2>1. Uploading a Single File with FormData</h2>
      <FileUploadBasic uploadUrl="/api/upload" />

      <h2>2. Uploading Multiple Files</h2>
      <FileUploadMultiple uploadUrl="/api/upload" maxFiles={5} />

      <h2>3. Tracking Upload Progress with XMLHttpRequest</h2>
      <FileUploadProgress uploadUrl="/api/upload" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Selecting a file does not upload it; application code must explicitly send the File object.
// - `FormData` is commonly used to construct multipart/form-data upload requests.
// - `FormData.append()` can associate a file with the field name expected by the server.
// - Multiple files can be appended under the same field name when the server supports repeated multipart fields.
// - When sending `FormData` with `fetch()`, do not manually set the `Content-Type` header because the browser generates the multipart boundary.
// - `fetch()` provides a straightforward upload API but does not expose standard upload-progress events.
// - `XMLHttpRequest.upload` provides upload progress events that can be used to display progress to the user.
// - `ProgressEvent.lengthComputable` must be checked before calculating a percentage from `loaded` and `total`.
// - A successful HTTP request only means the server returned a successful HTTP status; application-specific response validation may still be required.
// - Client-side file selection and validation do not establish that an uploaded file is safe or acceptable.
// - The server must authenticate, authorize, validate, and process uploaded files according to its own security requirements.

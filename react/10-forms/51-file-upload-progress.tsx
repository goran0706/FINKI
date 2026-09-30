/**
 * File Upload Progress
 * =====================
 *
 * File upload progress describes how much of a selected file has been transferred to the server.
 * Unlike `fetch()`, `XMLHttpRequest` exposes upload progress events through its `upload` event
 * target, allowing an application to calculate and display transfer progress while the request
 * is in progress.
 *
 * A progress event provides `loaded` and `total` byte counts. The percentage can only be calculated
 * when `lengthComputable` is true. Upload progress represents bytes transferred by the browser; it
 * does not necessarily represent server-side processing, validation, or persistence after transfer
 * has completed.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FileUploadProgressBasicProps {
  readonly uploadUrl: string;
}

export interface FileUploadProgressCancelProps {
  readonly uploadUrl: string;
}

export interface FileUploadProgressUnknownTotalProps {
  readonly uploadUrl: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FileUploadProgressBasic: React.FC<FileUploadProgressBasicProps> = ({ uploadUrl }): React.ReactElement => {
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

    setProgress(0);
    setUploading(true);
    setStatus("Uploading...");

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

export const FileUploadProgressCancel: React.FC<FileUploadProgressCancelProps> = ({
  uploadUrl,
}): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>("");

  const requestRef = React.useRef<XMLHttpRequest | null>(null);

  React.useEffect((): (() => void) => {
    return (): void => {
      requestRef.current?.abort();
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
    setProgress(0);
    setStatus("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (file === null || uploading) {
      return;
    }

    const formData: FormData = new FormData();

    formData.append("file", file);

    const request: XMLHttpRequest = new XMLHttpRequest();

    requestRef.current = request;

    request.upload.addEventListener("progress", (progressEvent: ProgressEvent<XMLHttpRequestEventTarget>): void => {
      if (!progressEvent.lengthComputable) {
        return;
      }

      setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
    });

    request.addEventListener("load", (): void => {
      requestRef.current = null;
      setUploading(false);

      if (request.status >= 200 && request.status < 300) {
        setProgress(100);
        setStatus("Upload completed.");
        return;
      }

      setStatus(`Upload failed with status ${request.status}.`);
    });

    request.addEventListener("error", (): void => {
      requestRef.current = null;
      setUploading(false);
      setStatus("The upload failed.");
    });

    request.addEventListener("abort", (): void => {
      requestRef.current = null;
      setUploading(false);
      setStatus("Upload cancelled.");
    });

    setProgress(0);
    setUploading(true);
    setStatus("Uploading...");

    request.open("POST", uploadUrl);

    request.send(formData);
  };

  const handleCancel = (): void => {
    requestRef.current?.abort();
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
        Upload
      </button>

      <button type="button" onClick={handleCancel} disabled={!uploading}>
        Cancel
      </button>

      {status !== "" && <p role="status">{status}</p>}
    </form>
  );
};

export const FileUploadProgressUnknownTotal: React.FC<FileUploadProgressUnknownTotalProps> = ({
  uploadUrl,
}): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(null);
  const [loadedBytes, setLoadedBytes] = React.useState<number>(0);
  const [progressKnown, setProgressKnown] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
    setLoadedBytes(0);
    setProgress(0);
    setProgressKnown(false);
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
      setLoadedBytes(progressEvent.loaded);

      setProgressKnown(progressEvent.lengthComputable);

      if (!progressEvent.lengthComputable) {
        return;
      }

      setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
    });

    request.addEventListener("load", (): void => {
      setUploading(false);

      if (request.status >= 200 && request.status < 300) {
        setProgress(100);
        setProgressKnown(true);
        setStatus("Upload completed.");
        return;
      }

      setStatus(`Upload failed with status ${request.status}.`);
    });

    request.addEventListener("error", (): void => {
      setUploading(false);
      setStatus("The upload failed.");
    });

    setLoadedBytes(0);
    setProgress(0);
    setProgressKnown(false);
    setUploading(true);
    setStatus("Uploading...");

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

      {progressKnown ? (
        <>
          <progress value={progress} max={100}>
            {progress}%
          </progress>

          <p>Upload progress: {progress}%</p>
        </>
      ) : (
        <p>Uploaded: {loadedBytes} bytes</p>
      )}

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
      <h1>File Upload Progress</h1>

      <h2>1. Displaying Percentage-Based Upload Progress</h2>
      <FileUploadProgressBasic uploadUrl="/api/upload" />

      <h2>2. Cancelling an In-Progress Upload</h2>
      <FileUploadProgressCancel uploadUrl="/api/upload" />

      <h2>3. Handling Uploads with an Unknown Total Size</h2>
      <FileUploadProgressUnknownTotal uploadUrl="/api/upload" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `XMLHttpRequest.upload` exposes progress events for data being uploaded from the browser.
// - `ProgressEvent.loaded` reports the number of bytes transferred so far.
// - `ProgressEvent.total` represents the total number of bytes when `lengthComputable` is true.
// - Upload percentage can be calculated as `loaded / total * 100` when the total is known.
// - When `lengthComputable` is false, an application should not calculate a percentage from `total`.
// - `XMLHttpRequest.abort()` cancels an in-progress upload request.
// - A request reference can be stored in `useRef` so event handlers can cancel the active request.
// - Upload progress describes network transfer and does not prove that server-side processing has completed.
// - A successful HTTP response should still be checked through the response status before reporting success.
// - An upload request should be aborted during component cleanup when the component owns an active request.
// - Progress state should be reset when a new file is selected so stale progress is not displayed for the new file.

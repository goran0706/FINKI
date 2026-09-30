/**
 * File Preview
 * =============
 *
 * File previews allow users to inspect selected local files before they are submitted. Browser
 * APIs can preview different file types without uploading them: images can be displayed through
 * object URLs, text files can be read as text, and other file types can be represented through
 * metadata when their contents cannot be rendered directly.
 *
 * `URL.createObjectURL()` creates a temporary blob URL that references a `File` or `Blob`. The URL
 * should be revoked with `URL.revokeObjectURL()` when it is no longer needed, especially when a
 * component repeatedly creates previews, to avoid retaining browser resources unnecessarily.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FilePreviewImageProps {
  readonly initialFile: File | null;
}

export interface FilePreviewTextProps {
  readonly initialFile: File | null;
}

export interface FilePreviewMultipleProps {
  readonly initialFiles: readonly File[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FilePreviewImage: React.FC<FilePreviewImageProps> = ({ initialFile }): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(initialFile);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect((): (() => void) => {
    if (file === null) {
      setPreviewUrl(null);

      return (): void => {
        // No object URL exists when no file is selected.
      };
    }

    const objectUrl: string = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    return (): void => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
  };

  return (
    <div>
      <label>
        Select an image
        <input type="file" accept="image/*" onChange={handleChange} />
      </label>

      {previewUrl !== null && <img src={previewUrl} alt={`Preview of ${file?.name ?? "selected image"}`} width={240} />}

      {file !== null && <p>{file.name}</p>}
    </div>
  );
};

export const FilePreviewText: React.FC<FilePreviewTextProps> = ({ initialFile }): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(initialFile);
  const [content, setContent] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  React.useEffect((): (() => void) => {
    if (file === null) {
      setContent("");
      setError("");

      return (): void => {
        // No file needs to be read when the selection is empty.
      };
    }

    let cancelled: boolean = false;
    const reader: FileReader = new FileReader();

    reader.onload = (): void => {
      if (cancelled) {
        return;
      }

      const result: string | ArrayBuffer | null = reader.result;

      setContent(typeof result === "string" ? result : "");
      setError("");
    };

    reader.onerror = (): void => {
      if (cancelled) {
        return;
      }

      setContent("");
      setError("The file could not be read.");
    };

    reader.readAsText(file);

    return (): void => {
      cancelled = true;
      reader.abort();
    };
  }, [file]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(event.target.files?.[0] ?? null);
  };

  return (
    <div>
      <label>
        Select a text file
        <input type="file" accept=".txt,text/plain" onChange={handleChange} />
      </label>

      {file !== null && <p>Selected: {file.name}</p>}

      {error !== "" && <p role="alert">{error}</p>}

      {content !== "" && <pre>{content}</pre>}
    </div>
  );
};

export const FilePreviewMultiple: React.FC<FilePreviewMultipleProps> = ({ initialFiles }): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>((): File[] => [...initialFiles]);

  const [previewUrls, setPreviewUrls] = React.useState<Record<string, string>>({});

  React.useEffect((): (() => void) => {
    const imageFiles: File[] = files.filter((file: File): boolean => file.type.startsWith("image/"));

    const nextPreviewUrls: Record<string, string> = {};

    imageFiles.forEach((file: File): void => {
      const key: string = `${file.name}:${file.size}:${file.lastModified}`;

      nextPreviewUrls[key] = URL.createObjectURL(file);
    });

    setPreviewUrls(nextPreviewUrls);

    return (): void => {
      Object.values(nextPreviewUrls).forEach((url: string): void => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    setFiles(selectedFiles);
  };

  const getFileKey = (file: File): string => `${file.name}:${file.size}:${file.lastModified}`;

  return (
    <div>
      <label>
        Select images
        <input type="file" accept="image/*" multiple onChange={handleChange} />
      </label>

      {files.length === 0 ? (
        <p>No files selected.</p>
      ) : (
        <ul>
          {files.map((file: File): React.ReactElement => {
            const key: string = getFileKey(file);
            const previewUrl: string | undefined = previewUrls[key];

            return (
              <li key={key}>
                <p>{file.name}</p>

                {previewUrl !== undefined && <img src={previewUrl} alt={`Preview of ${file.name}`} width={160} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>File Preview</h1>

      <h2>1. Previewing an Image with an Object URL</h2>
      <FilePreviewImage initialFile={null} />

      <h2>2. Reading and Previewing Text File Contents</h2>
      <FilePreviewText initialFile={null} />

      <h2>3. Previewing Multiple Image Files</h2>
      <FilePreviewMultiple initialFiles={[]} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - File previews allow locally selected files to be inspected before submission.
// - `URL.createObjectURL()` creates a temporary URL that can reference a selected `File`.
// - Object URLs should be revoked with `URL.revokeObjectURL()` when they are no longer needed.
// - `FileReader` can asynchronously read local file contents such as text.
// - A `FileReader` operation can be aborted when a component no longer needs its result.
// - Image previews can use object URLs without uploading the image to a server.
// - Text previews read the actual file contents rather than creating a URL for the file.
// - Multiple image previews require managing multiple object URLs and cleaning them up when the selection changes.
// - A file selected through an `<input>` remains local until application code explicitly reads, uploads, or otherwise processes it.
// - Previewing a file does not validate that the file is safe or trustworthy; security-sensitive processing still belongs on the server.

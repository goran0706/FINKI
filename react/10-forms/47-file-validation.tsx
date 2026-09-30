/**
 * File Validation
 * ================
 *
 * File validation checks selected files against application-defined constraints before they are
 * processed or submitted. Typical constraints include file count, file size, MIME type, and file
 * extension.
 *
 * Browser-provided file metadata is useful for user-facing validation, but it is not a security
 * boundary. The `type` property is based on metadata supplied by the browser and the file name can
 * be changed independently of its contents. Server-side validation must therefore enforce any
 * security-sensitive file restrictions before accepting uploaded data.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FileValidationResult {
  readonly valid: boolean;
  readonly error: string;
}

export interface FileValidationBasicProps {
  readonly maxSizeBytes: number;
}

export interface FileValidationMultipleProps {
  readonly maxFiles: number;
  readonly maxSizeBytes: number;
}

export interface FileValidationRulesProps {
  readonly maxSizeBytes: number;
  readonly acceptedTypes: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FileValidationBasic: React.FC<FileValidationBasicProps> = ({ maxSizeBytes }): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");

  const validateFile = (selectedFile: File): FileValidationResult => {
    if (selectedFile.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File must not exceed ${maxSizeBytes} bytes.`,
      };
    }

    return {
      valid: true,
      error: "",
    };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile: File | null = event.target.files?.[0] ?? null;

    if (selectedFile === null) {
      setFile(null);
      setError("");
      return;
    }

    const result: FileValidationResult = validateFile(selectedFile);

    setFile(selectedFile);
    setError(result.error);
  };

  return (
    <div>
      <label>
        Select a file
        <input
          type="file"
          onChange={handleChange}
          aria-invalid={error !== ""}
          aria-describedby={error !== "" ? "file-size-error" : undefined}
        />
      </label>

      {file !== null && (
        <p>
          Selected: {file.name} ({file.size} bytes)
        </p>
      )}

      {error !== "" && (
        <p id="file-size-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export const FileValidationMultiple: React.FC<FileValidationMultipleProps> = ({
  maxFiles,
  maxSizeBytes,
}): React.ReactElement => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  const validateFiles = (selectedFiles: File[]): string[] => {
    const nextErrors: string[] = [];

    if (selectedFiles.length > maxFiles) {
      nextErrors.push(`Select no more than ${maxFiles} files.`);
    }

    selectedFiles.forEach((file: File): void => {
      if (file.size > maxSizeBytes) {
        nextErrors.push(`${file.name} exceeds the maximum file size.`);
      }
    });

    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = event.target.files === null ? [] : Array.from(event.target.files);

    const nextErrors: string[] = validateFiles(selectedFiles);

    setFiles(selectedFiles);
    setErrors(nextErrors);
  };

  return (
    <div>
      <label>
        Select multiple files
        <input type="file" multiple onChange={handleChange} aria-invalid={errors.length > 0} />
      </label>

      <p>
        Selected {files.length} of {maxFiles} allowed files.
      </p>

      {errors.length > 0 && (
        <ul role="alert">
          {errors.map((error: string, index: number): React.ReactElement => (
            <li key={`${error}-${index}`}>{error}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul>
          {files.map((file: File, index: number): React.ReactElement => (
            <li key={`${file.name}-${file.lastModified}-${index}`}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FileValidationRules: React.FC<FileValidationRulesProps> = ({
  maxSizeBytes,
  acceptedTypes,
}): React.ReactElement => {
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");

  const validateFile = (selectedFile: File): FileValidationResult => {
    if (selectedFile.size === 0) {
      return {
        valid: false,
        error: "The selected file is empty.",
      };
    }

    if (selectedFile.size > maxSizeBytes) {
      return {
        valid: false,
        error: "The selected file is too large.",
      };
    }

    if (!acceptedTypes.includes(selectedFile.type)) {
      return {
        valid: false,
        error: "The selected file type is not allowed.",
      };
    }

    return {
      valid: true,
      error: "",
    };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile: File | null = event.target.files?.[0] ?? null;

    if (selectedFile === null) {
      setFile(null);
      setError("");
      return;
    }

    const result: FileValidationResult = validateFile(selectedFile);

    setFile(selectedFile);
    setError(result.error);
  };

  return (
    <div>
      <label>
        Select an image
        <input type="file" accept="image/png,image/jpeg" onChange={handleChange} aria-invalid={error !== ""} />
      </label>

      {file !== null && (
        <p>
          {file.name} — {file.type || "Unknown type"}
        </p>
      )}

      {error !== "" && <p role="alert">{error}</p>}

      {file !== null && error === "" && <p>File passed client-side validation.</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>File Validation</h1>

      <h2>1. Validating a Single File's Size</h2>
      <FileValidationBasic maxSizeBytes={1024 * 1024} />

      <h2>2. Validating File Count and Individual File Sizes</h2>
      <FileValidationMultiple maxFiles={3} maxSizeBytes={5 * 1024 * 1024} />

      <h2>3. Combining File Size, Type, and Empty-File Validation</h2>
      <FileValidationRules maxSizeBytes={2 * 1024 * 1024} acceptedTypes={["image/png", "image/jpeg"]} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - File validation can check constraints such as file count, size, MIME type, and empty files.
// - `File.size` is measured in bytes and can be compared directly with a maximum size in bytes.
// - `File.type` exposes the browser-reported MIME type of the selected file.
// - Multiple-file validation should check both the total number of files and each individual file.
// - Validation errors can be represented separately from the selected files.
// - The `accept` attribute helps guide file selection but does not replace application validation.
// - Client-side file validation improves user feedback but must not be treated as a security boundary.
// - File names and browser-reported MIME types do not prove what a file actually contains.
// - Security-sensitive upload validation must be performed again on the server before accepting the file.
// - An empty `File` can have a valid-looking name and MIME type, so size validation may need to reject zero-byte files explicitly.

/**
 * Input Validation
 * =================
 *
 * Input validation is the process of checking that externally supplied data has the expected
 * structure, type, length, format, and semantic meaning before the application processes it.
 * Validation should be performed at trust boundaries, especially on the server, because client-side
 * validation can be bypassed by modifying the browser or sending requests directly.
 *
 * Client-side validation improves usability by providing immediate feedback, while server-side
 * validation provides the security boundary. Validation is an important defense, but it is not
 * a replacement for context-specific protections such as output encoding, parameterized queries,
 * safe command APIs, authorization, or HTML sanitization.
 */

import { useState, type FC, type FormEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What input validation means
// ---------------------------------------------------------------------

// Input validation checks whether externally supplied data satisfies the
// application's expectations before that data enters a workflow.
//
// External input can come from:
// - form fields
// - URL parameters
// - request bodies
// - cookies
// - HTTP headers
// - uploaded files
// - APIs
// - other services
//
// The source being "our frontend" does not make the data trustworthy.

// ---------------------------------------------------------------------
// 2. Input is untrusted at the trust boundary
// ---------------------------------------------------------------------

export interface UntrustedInput {
  readonly value: string;
  readonly source: "form" | "query" | "json" | "cookie" | "header" | "upload";
}

export const exampleUntrustedInput: UntrustedInput = {
  value: "example",
  source: "form",
};

// The server should treat externally supplied values as untrusted until
// they have passed the application's required validation and security
// checks.

// ---------------------------------------------------------------------
// 3. Client-side validation
// ---------------------------------------------------------------------

// Client-side validation is useful for user experience.
//
// It can:
// - provide immediate feedback
// - prevent obviously invalid submissions
// - reduce unnecessary requests
// - explain formatting requirements
//
// It is not a security boundary because an attacker can bypass the
// browser entirely.

// ---------------------------------------------------------------------
// 4. Server-side validation
// ---------------------------------------------------------------------

// Server-side validation must be performed before processing untrusted
// input.
//
// An attacker can:
//
// 1. modify the browser
// 2. disable JavaScript
// 3. alter the DOM
// 4. construct HTTP requests manually
// 5. call the API without using the frontend
//
// Therefore, server-side validation must not depend on the frontend's
// validation having executed.

// ---------------------------------------------------------------------
// 5. Client and server validation work together
// ---------------------------------------------------------------------

export interface ValidationResponsibilities {
  readonly client: readonly string[];
  readonly server: readonly string[];
}

export const validationResponsibilities: ValidationResponsibilities = {
  client: ["Immediate feedback", "Basic format checks", "User experience"],
  server: ["Security validation", "Business-rule validation", "Final trust-boundary enforcement"],
};

// The same logical rules may exist in both places.
//
// The server remains authoritative.

// ---------------------------------------------------------------------
// 6. Syntactic validation
// ---------------------------------------------------------------------

// Syntactic validation checks whether a value has the expected form.
//
// Examples:
//
// email -> expected email syntax
// date  -> expected date representation
// UUID  -> expected UUID format
// number -> expected numeric representation
//
// Syntax alone does not establish that a value makes sense in the
// application's business domain.

// ---------------------------------------------------------------------
// 7. Semantic validation
// ---------------------------------------------------------------------

// Semantic validation checks whether a syntactically valid value is
// meaningful in the application's context.
//
// Example:
//
// startDate = 2026-10-10
// endDate   = 2026-10-01
//
// Both values can be valid dates, but the relationship may be invalid
// because the end date occurs before the start date.

export interface DateRange {
  readonly startDate: string;
  readonly endDate: string;
}

export const isValidDateRange = (range: DateRange): boolean => {
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);

  return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start.getTime() <= end.getTime();
};

// ---------------------------------------------------------------------
// 8. Allowlist validation
// ---------------------------------------------------------------------

// Allowlist validation defines what is permitted.
//
// For a role field, for example:
//
// "user"
// "admin"
//
// could be the complete allowed set.
//
// Everything outside the explicitly allowed set is rejected.

export const allowedRoles = ["user", "admin"] as const;

export type AllowedRole = (typeof allowedRoles)[number];

export const isAllowedRole = (value: string): value is AllowedRole => {
  return value === "user" || value === "admin";
};

// ---------------------------------------------------------------------
// 9. Denylist validation
// ---------------------------------------------------------------------

// A denylist rejects values that are known to be dangerous.
//
// A denylist is generally weaker as the primary validation strategy
// because an attacker may provide a value that was not included in the
// denylist.
//
// Denylists can still be useful as an additional detection or defense
// layer in appropriate contexts.

// Never assume that rejecting "<script>" makes HTML input safe.

// ---------------------------------------------------------------------
// 10. Allowlist vs. denylist
// ---------------------------------------------------------------------

export type ValidationStrategy = "allowlist" | "denylist";

export const preferredValidationStrategy: ValidationStrategy = "allowlist";

// The appropriate allowlist depends on the field.
//
// A username, country code, sort direction, filename, and free-form
// comment each have different valid input domains.

// ---------------------------------------------------------------------
// 11. Required values
// ---------------------------------------------------------------------

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Required validation should define what "empty" means for the field.
//
// Trimming whitespace can be appropriate for fields where surrounding
// whitespace has no semantic meaning, but normalization rules should be
// chosen according to the field rather than applied blindly.

// ---------------------------------------------------------------------
// 12. String length limits
// ---------------------------------------------------------------------

export const validateLength = (value: string, minimum: number, maximum: number): boolean => {
  return value.length >= minimum && value.length <= maximum;
};

// Length limits protect data quality and can also reduce resource abuse.
//
// The maximum should reflect the application's legitimate requirements.
// Arbitrarily tiny limits can reject valid user input.

// ---------------------------------------------------------------------
// 13. Numeric range validation
// ---------------------------------------------------------------------

export const validateIntegerRange = (value: number, minimum: number, maximum: number): boolean => {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
};

// A numeric type alone does not guarantee that the number is within the
// application's permitted range.

// ---------------------------------------------------------------------
// 14. Integer parsing
// ---------------------------------------------------------------------

export const parseInteger = (value: string): number | null => {
  if (!/^-?\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) ? parsed : null;
};

// Parsing should be explicit.
//
// Avoid accepting unexpected numeric representations when the application
// expects a specific integer syntax.

// ---------------------------------------------------------------------
// 15. Floating-point validation
// ---------------------------------------------------------------------

export const parseFiniteNumber = (value: string): number | null => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

// Number parsing should still be followed by semantic validation such as
// minimum and maximum values when the application requires a range.

// ---------------------------------------------------------------------
// 16. Enumerated values
// ---------------------------------------------------------------------

export const allowedSortDirections = ["asc", "desc"] as const;

export type SortDirection = (typeof allowedSortDirections)[number];

export const validateSortDirection = (value: string): value is SortDirection => {
  return value === "asc" || value === "desc";
};

// Fixed sets of values should be validated against the exact allowed
// values rather than accepting arbitrary strings.

// ---------------------------------------------------------------------
// 17. Select fields must be validated on the server
// ---------------------------------------------------------------------

// A <select> element does not make its selected value trustworthy.
//
// An attacker can modify the request:
//
// role=admin
//
// even if the original HTML only offered:
//
// role=user
//
// The server must validate discrete values independently.

// ---------------------------------------------------------------------
// 18. Boolean input
// ---------------------------------------------------------------------

export const parseBoolean = (value: string): boolean | null => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
};

// Explicit parsing prevents arbitrary strings from being treated as
// meaningful boolean values.

// ---------------------------------------------------------------------
// 19. Email validation
// ---------------------------------------------------------------------

export const isPlausibleEmail = (value: string): boolean => {
  const normalized = value.trim();

  return normalized.length > 0 && normalized.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

// Email syntax is more complicated than a simple regular expression can
// completely describe.
//
// Application validation should use an appropriate parser or established
// validation mechanism when strict email semantics are required.
//
// Syntax validation also does not prove that the mailbox exists.

// ---------------------------------------------------------------------
// 20. URL validation
// ---------------------------------------------------------------------

export const isHttpsUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "https:";
  } catch {
    return false;
  }
};

// URL validation should be based on parsing rather than simplistic
// string-prefix checks.
//
// Additional allowlisting may be necessary when the application permits
// only specific hosts or URL schemes.

// ---------------------------------------------------------------------
// 21. URL validation and allowlisted hosts
// ---------------------------------------------------------------------

export const isAllowedExampleHost = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "https:" && url.hostname === "example.com";
  } catch {
    return false;
  }
};

// If the application expects one specific host, validate the parsed
// hostname explicitly.
//
// Never treat an arbitrary user-controlled URL as trusted merely because
// it begins with an expected string.

// ---------------------------------------------------------------------
// 22. Canonicalization and normalization
// ---------------------------------------------------------------------

// Different textual representations can sometimes describe equivalent
// values.
//
// Validation should occur against an appropriate canonical representation
// when the application's security decision depends on equivalence.
//
// Unicode normalization can also matter for free-form text and identifiers.
//
// Normalization is not a universal security transformation; it must match
// the semantics of the field.

// ---------------------------------------------------------------------
// 23. Unicode input
// ---------------------------------------------------------------------

export const normalizeUserText = (value: string): string => {
  return value.normalize("NFC");
};

// Unicode-aware applications should define which characters and scripts
// are appropriate for each field.
//
// Free-form text should not be reduced to an ASCII-only allowlist merely
// because Unicode is more difficult to reason about.

// ---------------------------------------------------------------------
// 24. Free-form text
// ---------------------------------------------------------------------

export const validateComment = (value: string): boolean => {
  return value.length <= 5000 && value.trim().length > 0;
};

// Free-form text is different from structured identifiers.
//
// A comment may legitimately contain characters such as:
//
// <
// >
// '
// "
//
// Rejecting these characters is not a reliable XSS defense.
//
// The application must use context-appropriate output handling when the
// text is later rendered.

// ---------------------------------------------------------------------
// 25. Validation is not HTML sanitization
// ---------------------------------------------------------------------

// Input validation asks:
//
// "Is this value acceptable for this field?"
//
// HTML sanitization asks:
//
// "Which HTML structures are safe to retain?"
//
// They solve different problems.
//
// If an application intentionally accepts HTML, it needs a dedicated
// sanitization strategy rather than assuming generic validation is enough.

// ---------------------------------------------------------------------
// 26. Validation is not output encoding
// ---------------------------------------------------------------------

// A value can be valid input and still require encoding when inserted
// into a particular output context.
//
// For example, a valid comment can contain characters that require
// context-specific encoding when rendered as HTML.
//
// Validation does not remove the need for safe output handling.

// ---------------------------------------------------------------------
// 27. Validation is not SQL injection prevention
// ---------------------------------------------------------------------

// Validation can restrict input to expected values, but it should not be
// the primary defense against SQL injection.
//
// Database queries should use parameterized queries or other safe database
// APIs that separate data from SQL syntax.

// ---------------------------------------------------------------------
// 28. Validation is not command injection prevention
// ---------------------------------------------------------------------

// Similarly, validation alone should not be treated as the primary
// protection against operating-system command injection.
//
// Prefer APIs that do not invoke a shell and keep untrusted data separate
// from executable commands.

// ---------------------------------------------------------------------
// 29. Validation should happen before processing
// ---------------------------------------------------------------------

export interface UserRegistrationInput {
  readonly email: string;
  readonly displayName: string;
  readonly age: number;
}

export const validateRegistrationInput = (input: UserRegistrationInput): boolean => {
  return (
    isPlausibleEmail(input.email) &&
    validateLength(input.displayName, 1, 100) &&
    validateIntegerRange(input.age, 13, 120)
  );
};

// The validation boundary should occur before the application performs
// operations that depend on the input.

// ---------------------------------------------------------------------
// 30. Validation order
// ---------------------------------------------------------------------

// A practical validation sequence can be:
//
// 1. Parse the request.
// 2. Check the expected structure.
// 3. Validate types and syntax.
// 4. Apply normalization where appropriate.
// 5. Apply length and range constraints.
// 6. Apply semantic/business rules.
// 7. Process the validated value.
//
// The exact sequence depends on the data format and application.

// ---------------------------------------------------------------------
// 31. JSON request validation
// ---------------------------------------------------------------------

export interface CreateUserRequest {
  readonly email: string;
  readonly displayName: string;
}

export const isCreateUserRequest = (value: unknown): value is CreateUserRequest => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.email === "string" && typeof candidate.displayName === "string";
};

// Runtime validation is necessary when data enters TypeScript from an
// external source.
//
// TypeScript types disappear at runtime and cannot validate JSON received
// over HTTP.

// ---------------------------------------------------------------------
// 32. Type assertions do not validate input
// ---------------------------------------------------------------------

export const unsafeTypeAssertionExample = (value: unknown): CreateUserRequest => {
  return value as CreateUserRequest;
};

// The assertion changes TypeScript's static view of the value.
//
// It does not inspect the runtime object.
//
// Never use a type assertion as a substitute for runtime validation at an
// untrusted boundary.

// ---------------------------------------------------------------------
// 33. Runtime type checks
// ---------------------------------------------------------------------

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Runtime type guards can establish basic structural facts before more
// specific validation is performed.

// ---------------------------------------------------------------------
// 34. Unknown is appropriate for external data
// ---------------------------------------------------------------------

export const processExternalData = (value: unknown): CreateUserRequest | null => {
  if (!isCreateUserRequest(value)) {
    return null;
  }

  return value;
};

// unknown prevents the application from accidentally treating arbitrary
// external data as a known TypeScript type before checking it.

// ---------------------------------------------------------------------
// 35. Object shape validation
// ---------------------------------------------------------------------

export const hasRequiredUserFields = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.email === "string" && typeof value.displayName === "string";
};

// Shape validation should also consider whether unexpected fields are
// allowed.
//
// Some APIs intentionally reject unknown properties to reduce ambiguity
// and prevent accidental mass assignment.

// ---------------------------------------------------------------------
// 36. Mass assignment
// ---------------------------------------------------------------------

export interface SafeUserUpdate {
  readonly displayName?: string;
}

export const createSafeUserUpdate = (input: Record<string, unknown>): SafeUserUpdate => {
  const update: SafeUserUpdate = {};

  if (typeof input.displayName === "string") {
    return {
      displayName: input.displayName,
    };
  }

  return update;
};

// Do not blindly map every client-provided property into an internal
// object.
//
// Fields such as role, permissions, account status, or ownership should
// not become writable merely because the client includes them.

// ---------------------------------------------------------------------
// 37. Business-rule validation
// ---------------------------------------------------------------------

export interface TransferInput {
  readonly amount: number;
  readonly sourceAccountId: string;
  readonly destinationAccountId: string;
}

export const validateTransferBusinessRules = (input: TransferInput): boolean => {
  return Number.isSafeInteger(input.amount) && input.amount > 0 && input.sourceAccountId !== input.destinationAccountId;
};

// Business validation may need additional server-side authorization,
// balance checks, transaction limits, and concurrency controls.
//
// Validation alone does not establish permission to perform the action.

// ---------------------------------------------------------------------
// 38. Validation and authorization are different
// ---------------------------------------------------------------------

export interface DeleteRequest {
  readonly resourceId: string;
}

export const validateDeleteRequest = (request: DeleteRequest): boolean => {
  return request.resourceId.trim().length > 0;
};

// This establishes that resourceId is structurally acceptable.
//
// It does NOT establish that the authenticated user is authorized to
// delete that resource.

// ---------------------------------------------------------------------
// 39. Regular expressions
// ---------------------------------------------------------------------

export const isExampleIdentifier = (value: string): boolean => {
  return /^[a-z0-9]{3,20}$/.test(value);
};

// Regular expressions are useful for structured formats with clearly
// defined syntax.
//
// Keep patterns bounded and avoid unnecessarily complex expressions that
// can cause excessive processing.

// ---------------------------------------------------------------------
// 40. Regular-expression denial of service
// ---------------------------------------------------------------------

// Poorly designed regular expressions can exhibit catastrophic backtracking
// and consume excessive CPU on attacker-controlled input.
//
// Avoid complex patterns when simpler parsing or established validation
// libraries are available.
//
// Length limits also reduce the amount of data supplied to a regex.

// ---------------------------------------------------------------------
// 41. Validate complete values
// ---------------------------------------------------------------------

export const isCompleteIdentifier = (value: string): boolean => {
  return /^[a-z0-9]{3,20}$/.test(value);
};

// Structured validation should normally describe the complete expected
// value rather than finding a valid-looking substring inside arbitrary
// input.

// ---------------------------------------------------------------------
// 42. Error messages
// ---------------------------------------------------------------------

export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

export const createValidationError = (field: string, message: string): ValidationError => {
  return { field, message };
};

// Validation errors should tell legitimate users what they need to fix,
// without disclosing secrets, internal implementation details, or
// sensitive security information.

// ---------------------------------------------------------------------
// 43. Do not echo dangerous input into HTML
// ---------------------------------------------------------------------

export const validationErrorForDisplay = (value: string): string => {
  return `The provided value is invalid.`;
};

// Do not construct an HTML error message by inserting untrusted input
// into an HTML string.
//
// React's normal JSX text rendering escapes text, but dangerous sinks
// such as dangerouslySetInnerHTML require separate security controls.

// ---------------------------------------------------------------------
// 44. Validation failure responses
// ---------------------------------------------------------------------

export interface ValidationResponse {
  readonly status: 400;
  readonly errors: readonly ValidationError[];
}

export const invalidRequestResponse: ValidationResponse = {
  status: 400,
  errors: [
    {
      field: "email",
      message: "Enter a valid email address.",
    },
  ],
};

// A server can return structured validation errors with an appropriate
// client-error status such as 400 Bad Request.
//
// The exact response format should match the API contract.

// ---------------------------------------------------------------------
// 45. Client-side form validation
// ---------------------------------------------------------------------

export const RegistrationForm: FC = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isPlausibleEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!validateLength(displayName, 1, 100)) {
      setError("Display name must contain 1 to 100 characters.");
      return;
    }

    setError("");
    // A real application would now submit the data to the server,
    // where the same security requirements are enforced again.
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          maxLength={254}
          required
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label>
        Display name
        <input
          type="text"
          value={displayName}
          minLength={1}
          maxLength={100}
          required
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </label>

      <button type="submit">Create account</button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 46. HTML constraint validation
// ---------------------------------------------------------------------

// HTML provides built-in client-side constraints such as:
//
// required
// minLength
// maxLength
// min
// max
// step
// pattern
// type="email"
//
// These constraints improve the browser-side user experience.
//
// They do not replace server-side validation.

// ---------------------------------------------------------------------
// 47. Client validation can be bypassed
// ---------------------------------------------------------------------

// The following browser constraints:
//
// maxLength={100}
// required
// type="email"
//
// can be modified or removed by the user.
//
// An attacker can also send a request directly to the server without
// loading the React application at all.
//
// Therefore, the server must enforce the constraints independently.

// ---------------------------------------------------------------------
// 48. File upload validation
// ---------------------------------------------------------------------

export interface FileUploadConstraints {
  readonly maximumBytes: number;
  readonly allowedExtensions: readonly string[];
  readonly allowedMediaTypes: readonly string[];
}

export const imageUploadConstraints: FileUploadConstraints = {
  maximumBytes: 5 * 1024 * 1024,
  allowedExtensions: [".jpg", ".jpeg", ".png"],
  allowedMediaTypes: ["image/jpeg", "image/png"],
};

// File uploads require additional controls because filenames, extensions,
// declared media types, content, and size are all attacker-influenced.
//
// The server should validate uploads independently of the browser.

// ---------------------------------------------------------------------
// 49. File names are untrusted input
// ---------------------------------------------------------------------

export const isSafeUploadedFileName = (value: string): boolean => {
  return value.length > 0 && value.length <= 100 && !value.includes("/") && !value.includes("\\");
};

// Applications should avoid using user-controlled filenames directly
// as filesystem paths.
//
// Prefer generating server-controlled storage names and treating the
// original filename as untrusted metadata.

// ---------------------------------------------------------------------
// 50. File size limits
// ---------------------------------------------------------------------

export const isAllowedFileSize = (size: number, maximumBytes: number): boolean => {
  return Number.isSafeInteger(size) && size >= 0 && size <= maximumBytes;
};

// Size limits can reduce memory, storage, and processing abuse.
//
// Limits should be enforced before expensive processing where possible.

// ---------------------------------------------------------------------
// 51. File type validation
// ---------------------------------------------------------------------

// The client-provided filename and MIME type should not be treated as
// authoritative proof of the file's actual contents.
//
// Depending on the file type, the server may need content inspection,
// safe parsing, rewriting, or dedicated upload-processing controls.

// ---------------------------------------------------------------------
// 52. JSON schema validation
// ---------------------------------------------------------------------

export interface JsonSchemaConcept {
  readonly validatesStructure: boolean;
  readonly validatesTypes: boolean;
  readonly validatesConstraints: boolean;
}

export const jsonSchemaConcept: JsonSchemaConcept = {
  validatesStructure: true,
  validatesTypes: true,
  validatesConstraints: true,
};

// JSON Schema can define structured API contracts.
//
// A schema validator can enforce those constraints at runtime.
//
// TypeScript interfaces alone cannot perform this runtime validation.

// ---------------------------------------------------------------------
// 53. Validation libraries
// ---------------------------------------------------------------------

// Runtime validation libraries can centralize parsing and validation.
//
// Examples include schema-oriented libraries that can:
//
// - parse unknown input
// - validate object structure
// - validate string and numeric constraints
// - produce structured errors
//
// The important property is runtime enforcement, not the specific library.

// ---------------------------------------------------------------------
// 54. Validate at every trust boundary
// ---------------------------------------------------------------------

export type TrustBoundary = "browser" | "public-api" | "internal-service" | "database" | "file-upload";

export const trustBoundaries: readonly TrustBoundary[] = [
  "browser",
  "public-api",
  "internal-service",
  "database",
  "file-upload",
];

// Data received from another service should not automatically be assumed
// safe merely because the service is internal.
//
// Validation requirements should reflect the trust relationship and the
// consequences of malformed data.

// ---------------------------------------------------------------------
// 55. Validation and output contexts
// ---------------------------------------------------------------------

export type OutputContext = "html" | "javascript" | "css" | "url" | "sql" | "shell";

export const outputContexts: readonly OutputContext[] = ["html", "javascript", "css", "url", "sql", "shell"];

// Security controls must match the interpreter or output context.
//
// Validating a string as an email address does not make it safe to insert
// into arbitrary HTML, SQL, or shell commands.

// ---------------------------------------------------------------------
// 56. Reject unexpected properties when appropriate
// ---------------------------------------------------------------------

export interface StrictUserRequest {
  readonly email: string;
  readonly displayName: string;
}

export const hasOnlyExpectedUserFields = (value: Record<string, unknown>): boolean => {
  const allowedFields = new Set(["email", "displayName"]);

  return Object.keys(value).every((key) => allowedFields.has(key));
};

// Rejecting unknown fields can make API contracts stricter and can help
// detect tampering.
//
// Whether unknown fields should be rejected depends on the API contract.

// ---------------------------------------------------------------------
// 57. Validate before database persistence
// ---------------------------------------------------------------------

export interface PersistableUser {
  readonly email: string;
  readonly displayName: string;
}

export const prepareUserForPersistence = (input: unknown): PersistableUser | null => {
  if (!isCreateUserRequest(input)) {
    return null;
  }

  if (!isPlausibleEmail(input.email)) {
    return null;
  }

  if (!validateLength(input.displayName, 1, 100)) {
    return null;
  }

  return {
    email: input.email,
    displayName: input.displayName,
  };
};

// Validation should occur before malformed or unauthorized values are
// persisted.
//
// Database constraints can provide an additional integrity layer.

// ---------------------------------------------------------------------
// 58. Database constraints are additional defense
// ---------------------------------------------------------------------

// Application validation and database constraints solve different
// problems.
//
// Application validation provides useful semantic feedback.
//
// Database constraints can enforce structural invariants such as:
//
// - NOT NULL
// - UNIQUE
// - CHECK
// - foreign keys
//
// Defense in depth reduces the consequences of a missed validation path.

// ---------------------------------------------------------------------
// 59. Validation and logging
// ---------------------------------------------------------------------

export interface ValidationFailureEvent {
  readonly event: "input_validation_failure";
  readonly field: string;
  readonly userId?: string;
}

export const exampleValidationFailureEvent: ValidationFailureEvent = {
  event: "input_validation_failure",
  field: "role",
};

// Validation failures can provide useful security signals, particularly
// when a value violates a discrete server-side allowlist.
//
// Logs should avoid storing sensitive input or credentials.

// ---------------------------------------------------------------------
// 60. Avoid sensitive validation logs
// ---------------------------------------------------------------------

export const safeValidationLog = (field: string): string => {
  return `Input validation failed for field: ${field}`;
};

// Do not log passwords, session tokens, API credentials, full payment
// details, or other sensitive input merely because validation failed.

// ---------------------------------------------------------------------
// 61. Validation and authorization
// ---------------------------------------------------------------------

export interface AuthorizedValidationContext {
  readonly authenticated: boolean;
  readonly validInput: boolean;
  readonly authorized: boolean;
}

export const canProcessRequest = (context: AuthorizedValidationContext): boolean => {
  return context.authenticated && context.validInput && context.authorized;
};

// A request can be valid but unauthorized.
//
// A request can be authorized in principle but malformed.
//
// Authentication, validation, and authorization are separate controls.

// ---------------------------------------------------------------------
// 62. Validation does not prove intent
// ---------------------------------------------------------------------

// A perfectly valid request can still be malicious.
//
// For example:
//
// amount = 100
// recipient = "example"
//
// may be structurally valid but still unauthorized or fraudulent.
//
// Validation establishes that data conforms to expected constraints;
// it does not establish the user's intent or permission.

// ---------------------------------------------------------------------
// 63. Avoid trusting client-generated security fields
// ---------------------------------------------------------------------

export interface UnsafeSecurityFields {
  readonly userId: string;
  readonly role: string;
  readonly isAdmin: boolean;
}

export const unsafeSecurityFields: UnsafeSecurityFields = {
  userId: "user-example",
  role: "user",
  isAdmin: false,
};

// Security-sensitive identity and authorization attributes should come
// from trusted server-side state, not from arbitrary client fields.
//
// Validating that isAdmin is a boolean would not make the client-provided
// authorization decision trustworthy.

// ---------------------------------------------------------------------
// 64. Validation of identifiers
// ---------------------------------------------------------------------

export const isValidIdentifier = (value: string): boolean => {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value);
};

// Identifier formats should be defined according to the application's
// actual identifier scheme.
//
// If identifiers are UUIDs, validate UUIDs instead of inventing a
// different format merely for convenience.

// ---------------------------------------------------------------------
// 65. Validation and Unicode identifiers
// ---------------------------------------------------------------------

// If an application intentionally supports Unicode identifiers, the
// validation policy should explicitly define supported scripts,
// normalization, length semantics, and comparison rules.
//
// ASCII-only validation should not be presented as a universal security
// requirement.

// ---------------------------------------------------------------------
// 66. Date validation
// ---------------------------------------------------------------------

export const isValidIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(`${value}T`);
};

// Date validation should distinguish representation from business
// semantics such as allowable ranges or relationships between dates.

// ---------------------------------------------------------------------
// 67. Validation of pagination parameters
// ---------------------------------------------------------------------

export interface Pagination {
  readonly page: number;
  readonly limit: number;
}

export const validatePagination = (pagination: Pagination): boolean => {
  return (
    Number.isInteger(pagination.page) &&
    pagination.page >= 1 &&
    Number.isInteger(pagination.limit) &&
    pagination.limit >= 1 &&
    pagination.limit <= 100
  );
};

// Pagination limits can prevent clients from requesting unreasonably
// large result sets and consuming excessive resources.

// ---------------------------------------------------------------------
// 68. Validation of sorting parameters
// ---------------------------------------------------------------------

export const allowedSortFields = ["name", "createdAt"] as const;

export type AllowedSortField = (typeof allowedSortFields)[number];

export const isAllowedSortField = (value: string): value is AllowedSortField => {
  return value === "name" || value === "createdAt";
};

// Dynamic SQL identifiers such as column names cannot always be supplied
// through ordinary query parameters.
//
// When user input selects one of a fixed set of fields, map it against an
// explicit allowlist rather than concatenating arbitrary identifiers.

// ---------------------------------------------------------------------
// 69. Validation and rate limits
// ---------------------------------------------------------------------

export interface RequestLimits {
  readonly maximumBodyBytes: number;
  readonly maximumItems: number;
}

export const requestLimits: RequestLimits = {
  maximumBodyBytes: 1_000_000,
  maximumItems: 100,
};

// Validation can reduce malformed input, but resource-exhaustion
// protections such as request-size limits, rate limits, and timeouts are
// separate controls.

// ---------------------------------------------------------------------
// 70. Integrated validation boundary
// ---------------------------------------------------------------------

export interface ValidatedRegistration {
  readonly email: string;
  readonly displayName: string;
}

export const validateRegistration = (input: unknown): ValidatedRegistration | null => {
  if (!isCreateUserRequest(input)) {
    return null;
  }

  const email = input.email.trim();
  const displayName = input.displayName.trim();

  if (!isPlausibleEmail(email)) {
    return null;
  }

  if (!validateLength(displayName, 1, 100)) {
    return null;
  }

  return {
    email,
    displayName,
  };
};

// This illustrates a validation boundary:
//
// unknown input
//      |
//      v
// structural validation
//      |
//      v
// field validation
//      |
//      v
// normalization
//      |
//      v
// validated application data

// ---------------------------------------------------------------------
// 71. Integrated React example
// ---------------------------------------------------------------------

export const InputValidationDemo: FC = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const result = validateRegistration({
      email,
      displayName,
    });

    if (!result) {
      setError("Enter valid registration information.");
      return;
    }

    setError("");

    // A real application would submit `result` to the server.
    // The server must validate the received request independently.
    console.log("Validated client input:", result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          maxLength={254}
          required
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label>
        Display name
        <input
          type="text"
          value={displayName}
          minLength={1}
          maxLength={100}
          required
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </label>

      <button type="submit">Submit</button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
};

export default InputValidationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Input validation checks externally supplied data against expected structural and semantic constraints.
// - Client-side validation improves user experience but cannot be treated as a security boundary.
// - Server-side validation must be performed before untrusted input is processed.
// - Syntactic validation checks format; semantic validation checks whether a value makes sense in context.
// - Allowlists are generally stronger as the primary validation strategy than denylists.
// - Required fields, length limits, numeric ranges, enumerated values, and structured formats should be explicitly constrained.
// - TypeScript types and type assertions do not perform runtime validation on external data.
// - unknown is appropriate for data received from external sources until runtime checks establish its shape.
// - Runtime schema validation can enforce object structure and field constraints at trust boundaries.
// - Free-form Unicode text should be handled according to its intended semantics rather than through simplistic character filtering.
// - Normalization can establish a canonical representation when the application's security decision requires it.
// - Regular expressions are useful for structured formats but should be bounded and designed to avoid excessive processing.
// - Validation is not a replacement for output encoding, HTML sanitization, parameterized database queries, safe command APIs, or authorization.
// - File uploads require validation of size, filename, allowed types, and potentially file contents, with server-side enforcement.
// - Client-provided roles, permissions, ownership, and other security decisions must not be trusted merely because they pass type or format validation.
// - Database constraints can provide additional defense in depth for data integrity.
// - Validation failures can provide useful security signals, but logs must not contain passwords, tokens, or other sensitive input.
// - Valid input does not imply authorized input or legitimate intent.
// - Resource limits such as request-size limits, item-count limits, and rate limits complement input validation.
// - React can validate input for immediate feedback, but the server remains the authoritative validation boundary.

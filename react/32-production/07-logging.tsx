/**
 * Logging
 * =======
 *
 * Logging records structured information about application events so that developers and operators
 * can understand what happened during execution. Production logging should be intentional, consistent,
 * privacy-aware, and separated from debugging output that is useful only during development.
 */

import { useCallback, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Logging
// ---------------------------------------------------------------------

const logMessage = "Application started.";

console.log(logMessage);

// Logging records information about application execution.

// ---------------------------------------------------------------------
// 2. Console logging
// ---------------------------------------------------------------------

console.log("Informational message.");
console.info("Additional informational message.");
console.warn("Warning message.");
console.error("Error message.");

// The browser Console API provides methods for displaying debugging and diagnostic information.

// ---------------------------------------------------------------------
// 3. Log levels
// ---------------------------------------------------------------------

type LogLevel = "debug" | "info" | "warn" | "error";

const logLevels: readonly LogLevel[] = ["debug", "info", "warn", "error"];

console.log(logLevels);

// Log levels communicate the severity or purpose of a log entry.

// ---------------------------------------------------------------------
// 4. Debug logs
// ---------------------------------------------------------------------

const debugValue = {
  component: "ExampleComponent",
  state: "ready",
};

console.debug(debugValue);

// Debug logs are useful during development and detailed troubleshooting.

// ---------------------------------------------------------------------
// 5. Info logs
// ---------------------------------------------------------------------

console.info("Application configuration loaded.");

// Informational logs describe meaningful normal application events.

// ---------------------------------------------------------------------
// 6. Warning logs
// ---------------------------------------------------------------------

console.warn("Example configuration uses a fallback value.");

// Warnings indicate an unexpected or potentially problematic condition that did not necessarily stop execution.

// ---------------------------------------------------------------------
// 7. Error logs
// ---------------------------------------------------------------------

console.error("Example operation failed.");

// Error logs represent failures that require investigation or handling.

// ---------------------------------------------------------------------
// 8. Logging versus error reporting
// ---------------------------------------------------------------------

const loggingAndErrorReporting = {
  logging: "records application events",
  errorReporting: "captures failures for investigation",
};

console.log(loggingAndErrorReporting);

// Logging and error reporting overlap but serve different operational purposes.

// ---------------------------------------------------------------------
// 9. Structured logging
// ---------------------------------------------------------------------

const structuredLog = {
  level: "info",
  event: "application_ready",
  environment: "production",
};

console.log(structuredLog);

// Structured logs represent data as fields instead of embedding everything in one free-form message.

// ---------------------------------------------------------------------
// 10. Log entry type
// ---------------------------------------------------------------------

interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
}

const logEntry: LogEntry = {
  level: "info",
  message: "Application ready.",
  timestamp: new Date().toISOString(),
};

console.log(logEntry);

// A consistent log-entry shape makes logs easier to process and analyze.

// ---------------------------------------------------------------------
// 11. Timestamp
// ---------------------------------------------------------------------

const timestamp = new Date().toISOString();

console.log(timestamp);

// ISO-formatted timestamps provide an unambiguous representation of when an event was recorded.

// ---------------------------------------------------------------------
// 12. Event name
// ---------------------------------------------------------------------

interface ApplicationLog {
  readonly event: string;
  readonly level: LogLevel;
}

const applicationLog: ApplicationLog = {
  event: "profile_loaded",
  level: "info",
};

console.log(applicationLog);

// Stable event names make logs easier to filter and aggregate.

// ---------------------------------------------------------------------
// 13. Event context
// ---------------------------------------------------------------------

interface LogContext {
  readonly operation: string;
  readonly component: string;
}

const logContext: LogContext = {
  operation: "load-profile",
  component: "Profile",
};

console.log(logContext);

// Context explains where and during which operation an event occurred.

// ---------------------------------------------------------------------
// 14. Environment context
// ---------------------------------------------------------------------

type Environment = "development" | "staging" | "production";

const environment: Environment = "production";

console.log(environment);

// Environment information distinguishes logs generated by different deployment environments.

// ---------------------------------------------------------------------
// 15. Release context
// ---------------------------------------------------------------------

interface ReleaseContext {
  readonly version: string;
  readonly revision: string;
}

const releaseContext: ReleaseContext = {
  version: "1.0.0",
  revision: "example-revision",
};

console.log(releaseContext);

// Release metadata allows logs to be associated with a particular application version.

// ---------------------------------------------------------------------
// 16. Request correlation
// ---------------------------------------------------------------------

interface RequestContext {
  readonly requestId: string;
  readonly operation: string;
}

const requestContext: RequestContext = {
  requestId: "example-request",
  operation: "load-profile",
};

console.log(requestContext);

// A request identifier can connect related log entries produced by one operation.

// ---------------------------------------------------------------------
// 17. Session correlation
// ---------------------------------------------------------------------

const sessionCorrelation = {
  sessionReference: "example-session-reference",
};

console.log(sessionCorrelation);

// A non-sensitive session reference can help correlate related events without logging the actual session credential.

// ---------------------------------------------------------------------
// 18. User context
// ---------------------------------------------------------------------

interface UserContext {
  readonly anonymousId: string;
}

const userContext: UserContext = {
  anonymousId: "example-anonymous-id",
};

console.log(userContext);

// User context should contain only the minimum information necessary for the logging purpose.

// ---------------------------------------------------------------------
// 19. Sensitive data
// ---------------------------------------------------------------------

const sensitiveFields = ["password", "accessToken", "apiKey", "encryptionKey"];

console.log(sensitiveFields);

// Secrets and other sensitive values should not be written directly to application logs.

// ---------------------------------------------------------------------
// 20. Sensitive field filtering
// ---------------------------------------------------------------------

const sensitiveFieldNames = new Set(["password", "token", "accessToken", "apiKey", "secret"]);

const shouldLogField = (fieldName: string): boolean => {
  return !sensitiveFieldNames.has(fieldName);
};

console.log(shouldLogField("password"));
console.log(shouldLogField("status"));

// Sensitive fields can be excluded before data reaches the logging layer.

// ---------------------------------------------------------------------
// 21. Redaction
// ---------------------------------------------------------------------

const redact = (value: unknown): string => {
  return value === undefined ? "" : "[REDACTED]";
};

console.log(redact("example-secret"));

// Redaction replaces a sensitive value with a non-sensitive representation.

// ---------------------------------------------------------------------
// 22. Sanitizing an object
// ---------------------------------------------------------------------

const sanitizeObject = (value: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [key, shouldLogField(key) ? fieldValue : "[REDACTED]"]),
  );
};

const sanitizedObject = sanitizeObject({
  operation: "login",
  password: "example-password",
  status: "failed",
});

console.log(sanitizedObject);

// Sanitizing structured data before logging reduces accidental secret disclosure.

// ---------------------------------------------------------------------
// 23. Allowlisted fields
// ---------------------------------------------------------------------

interface SafeOperationContext {
  readonly operation: string;
  readonly outcome: string;
}

const createSafeContext = (context: SafeOperationContext): SafeOperationContext => {
  return {
    operation: context.operation,
    outcome: context.outcome,
  };
};

console.log(
  createSafeContext({
    operation: "search",
    outcome: "success",
  }),
);

// An allowlist can be safer than logging arbitrary application objects.

// ---------------------------------------------------------------------
// 24. Avoid logging entire application state
// ---------------------------------------------------------------------

const applicationState = {
  status: "authenticated",
  theme: "dark",
  internalToken: "example-token",
};

console.log({
  status: applicationState.status,
  theme: applicationState.theme,
});

// Logging selected fields avoids accidentally exposing unrelated state.

// ---------------------------------------------------------------------
// 25. Error objects
// ---------------------------------------------------------------------

const exampleError = new Error("Example operation failed.");

console.error({
  name: exampleError.name,
  message: exampleError.message,
  stack: exampleError.stack,
});

// Error objects provide diagnostic information that can be useful during failure investigation.

// ---------------------------------------------------------------------
// 26. Error context
// ---------------------------------------------------------------------

interface ErrorLogContext {
  readonly operation: string;
  readonly component: string;
  readonly release: string;
}

const errorLogContext: ErrorLogContext = {
  operation: "load-products",
  component: "Products",
  release: releaseContext.version,
};

console.error({
  error: exampleError.message,
  ...errorLogContext,
});

// Error messages become more useful when combined with relevant execution context.

// ---------------------------------------------------------------------
// 27. Error causes
// ---------------------------------------------------------------------

const originalError = new Error("Network request failed.");

const applicationError = new Error("Unable to load products.", {
  cause: originalError,
});

console.error(applicationError);

// Error causes preserve a relationship between a higher-level failure and its underlying cause.

// ---------------------------------------------------------------------
// 28. Error serialization
// ---------------------------------------------------------------------

const serializeError = (error: Error): Record<string, unknown> => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  };
};

console.log(serializeError(exampleError));

// Explicit serialization makes the fields included in a log entry intentional.

// ---------------------------------------------------------------------
// 29. Log message design
// ---------------------------------------------------------------------

const operation = "load-products";
const outcome = "success";

console.info(`Operation completed: ${operation} (${outcome}).`);

// Messages should communicate what happened without requiring hidden application state to interpret them.

// ---------------------------------------------------------------------
// 30. Prefer event names for machine processing
// ---------------------------------------------------------------------

const machineReadableLog = {
  event: "products_loaded",
  level: "info",
  operation: "load-products",
};

console.log(machineReadableLog);

// Stable fields allow log processors to work without parsing human-oriented prose.

// ---------------------------------------------------------------------
// 31. Event outcome
// ---------------------------------------------------------------------

type LogOutcome = "success" | "failure";

const logOutcome: LogOutcome = "success";

console.log(logOutcome);

// Explicit outcomes make success and failure states easy to query.

// ---------------------------------------------------------------------
// 32. Duration
// ---------------------------------------------------------------------

interface DurationLog {
  readonly event: string;
  readonly durationMs: number;
}

const durationLog: DurationLog = {
  event: "products_loaded",
  durationMs: 240,
};

console.log(durationLog);

// Duration fields make slow operations visible in structured logs.

// ---------------------------------------------------------------------
// 33. Request status
// ---------------------------------------------------------------------

interface RequestLog {
  readonly event: string;
  readonly statusCode: number;
  readonly outcome: LogOutcome;
}

const requestLog: RequestLog = {
  event: "api_request_completed",
  statusCode: 200,
  outcome: "success",
};

console.log(requestLog);

// HTTP status and operation outcome provide useful request-level context.

// ---------------------------------------------------------------------
// 34. Logging failed requests
// ---------------------------------------------------------------------

const failedRequestLog = {
  event: "api_request_failed",
  statusCode: 500,
  outcome: "failure",
};

console.error(failedRequestLog);

// Failed operations should provide enough context to distinguish and investigate failure classes.

// ---------------------------------------------------------------------
// 35. Log levels in application code
// ---------------------------------------------------------------------

const logByLevel = (level: LogLevel, message: string): void => {
  switch (level) {
    case "debug":
      console.debug(message);
      break;
    case "info":
      console.info(message);
      break;
    case "warn":
      console.warn(message);
      break;
    case "error":
      console.error(message);
      break;
  }
};

logByLevel("info", "Example application event.");

// Centralizing level selection makes logging behavior consistent.

// ---------------------------------------------------------------------
// 36. Logger interface
// ---------------------------------------------------------------------

interface Logger {
  readonly debug: (message: string, context?: Record<string, unknown>) => void;
  readonly info: (message: string, context?: Record<string, unknown>) => void;
  readonly warn: (message: string, context?: Record<string, unknown>) => void;
  readonly error: (message: string, context?: Record<string, unknown>) => void;
}

// A logger interface decouples application code from a particular logging implementation.

// ---------------------------------------------------------------------
// 37. Basic logger implementation
// ---------------------------------------------------------------------

const logger: Logger = {
  debug: (message, context): void => {
    console.debug(message, context);
  },
  info: (message, context): void => {
    console.info(message, context);
  },
  warn: (message, context): void => {
    console.warn(message, context);
  },
  error: (message, context): void => {
    console.error(message, context);
  },
};

logger.info("Application ready.");

// The application can use the logger instead of calling console methods throughout the codebase.

// ---------------------------------------------------------------------
// 38. Logger context
// ---------------------------------------------------------------------

interface LoggerContext {
  readonly environment: Environment;
  readonly release: string;
}

const loggerContext: LoggerContext = {
  environment: "production",
  release: "example-release",
};

console.log(loggerContext);

// Shared context can be attached consistently to log entries.

// ---------------------------------------------------------------------
// 39. Context-aware logger
// ---------------------------------------------------------------------

const createContextLogger = (context: LoggerContext): Logger => {
  const enrich = (values: Record<string, unknown>): Record<string, unknown> => {
    return {
      environment: context.environment,
      release: context.release,
      ...values,
    };
  };

  return {
    debug: (message, values): void => {
      console.debug(message, enrich(values ?? {}));
    },
    info: (message, values): void => {
      console.info(message, enrich(values ?? {}));
    },
    warn: (message, values): void => {
      console.warn(message, enrich(values ?? {}));
    },
    error: (message, values): void => {
      console.error(message, enrich(values ?? {}));
    },
  };
};

const contextualLogger = createContextLogger(loggerContext);

contextualLogger.info("Products loaded.", {
  operation: "load-products",
});

// A context-aware logger prevents repeated manual attachment of deployment metadata.

// ---------------------------------------------------------------------
// 40. Development logging
// ---------------------------------------------------------------------

const developmentLogging = {
  environment: "development" as const,
  level: "debug" as const,
};

console.log(developmentLogging);

// Development environments commonly need more detailed diagnostic output.

// ---------------------------------------------------------------------
// 41. Production logging
// ---------------------------------------------------------------------

const productionLogging = {
  environment: "production" as const,
  level: "info" as const,
};

console.log(productionLogging);

// Production logging should prioritize useful operational information over unrestricted debugging output.

// ---------------------------------------------------------------------
// 42. Log-level filtering
// ---------------------------------------------------------------------

const logLevelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const shouldEmitLog = (level: LogLevel, minimumLevel: LogLevel): boolean => {
  return logLevelOrder[level] >= logLevelOrder[minimumLevel];
};

console.log(shouldEmitLog("debug", "info"));
console.log(shouldEmitLog("error", "info"));

// A minimum log level can prevent low-value messages from being emitted in production.

// ---------------------------------------------------------------------
// 43. Configurable logging
// ---------------------------------------------------------------------

interface LoggingConfiguration {
  readonly minimumLevel: LogLevel;
}

const loggingConfiguration: LoggingConfiguration = {
  minimumLevel: "info",
};

console.log(loggingConfiguration);

// Logging configuration should be explicit rather than controlled by arbitrary application state.

// ---------------------------------------------------------------------
// 44. Never disable required security logging
// ---------------------------------------------------------------------

const securityLoggingPolicy = {
  securityEventsRequired: true,
  ordinaryDebugLogsOptional: true,
};

console.log(securityLoggingPolicy);

// Operational debug output can be reduced without removing logging required for security or compliance purposes.

// ---------------------------------------------------------------------
// 45. Security events
// ---------------------------------------------------------------------

const securityEvents = [
  "authentication_failure",
  "authorization_failure",
  "input_validation_failure",
  "suspicious_operation",
];

console.log(securityEvents);

// Security-relevant events should be identifiable and handled according to the application's security requirements.

// ---------------------------------------------------------------------
// 46. Client versus server logging
// ---------------------------------------------------------------------

const loggingBoundary = {
  client: ["user-interface failures", "browser performance", "client-side operations"],
  server: ["authorization decisions", "database operations", "server-side security events"],
};

console.log(loggingBoundary);

// Client and server logs observe different execution environments and should not be treated as interchangeable.

// ---------------------------------------------------------------------
// 47. Do not trust client-generated security logs
// ---------------------------------------------------------------------

const clientGeneratedSecurityEvent = {
  event: "authorization_failure",
  source: "browser",
};

console.log(clientGeneratedSecurityEvent);

// Client telemetry can be useful evidence, but security-critical decisions and authoritative audit records belong on trusted server-side systems.

// ---------------------------------------------------------------------
// 48. Log injection
// ---------------------------------------------------------------------

const unsafeInput = "Example input\nFAKE LOG ENTRY";

console.log(unsafeInput);

// Untrusted input can contain control characters or delimiters that make log output misleading or difficult to parse.

// ---------------------------------------------------------------------
// 49. Sanitizing line breaks
// ---------------------------------------------------------------------

const sanitizeForLog = (value: string): string => {
  return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
};

console.log(sanitizeForLog(unsafeInput));

// Encoding control characters reduces the risk of forged or ambiguous log records.

// ---------------------------------------------------------------------
// 50. Sanitizing delimiters
// ---------------------------------------------------------------------

const sanitizeLogField = (value: string): string => {
  return value.replace(/[\r\n\t]/g, " ");
};

console.log(sanitizeLogField(unsafeInput));

// Sanitization should match the format and parser used by the logging system.

// ---------------------------------------------------------------------
// 51. Untrusted values
// ---------------------------------------------------------------------

const userProvidedValue = "Example user input";

logger.info("Search completed.", {
  queryLength: userProvidedValue.length,
});

// Prefer logging derived, non-sensitive properties when the raw input is unnecessary.

// ---------------------------------------------------------------------
// 52. Avoid logging credentials
// ---------------------------------------------------------------------

const loginAttempt = {
  username: "example-user",
  password: "example-password",
};

logger.info("Login attempt processed.", {
  usernamePresent: loginAttempt.username.length > 0,
  passwordProvided: loginAttempt.password.length > 0,
});

// Log the operational result rather than the credential itself.

// ---------------------------------------------------------------------
// 53. Avoid logging access tokens
// ---------------------------------------------------------------------

const authorizationHeader = "Bearer example-token";

logger.info("Authorization header received.", {
  authorizationPresent: authorizationHeader.length > 0,
});

// Presence can sometimes be useful; the credential value itself should not be logged.

// ---------------------------------------------------------------------
// 54. Avoid logging session identifiers
// ---------------------------------------------------------------------

const sessionIdentifier = "example-session-id";

logger.debug("Session context available.", {
  sessionPresent: sessionIdentifier.length > 0,
});

// Session credentials should not be copied into ordinary log records.

// ---------------------------------------------------------------------
// 55. Privacy-aware user logging
// ---------------------------------------------------------------------

interface PrivacyAwareUserLog {
  readonly event: string;
  readonly anonymousUserId: string;
}

const privacyAwareUserLog: PrivacyAwareUserLog = {
  event: "settings_updated",
  anonymousUserId: "example-anonymous-id",
};

console.log(privacyAwareUserLog);

// Pseudonymous identifiers can reduce unnecessary exposure when direct identity is not required.

// ---------------------------------------------------------------------
// 56. Data minimization
// ---------------------------------------------------------------------

const minimizedLog = {
  event: "profile_updated",
  fieldsChanged: 2,
};

console.log(minimizedLog);

// Logging the count of changed fields may be sufficient when the field values themselves are unnecessary.

// ---------------------------------------------------------------------
// 57. Logging request URLs
// ---------------------------------------------------------------------

const requestUrl = new URL("https://example.com/api/products");

logger.info("Request started.", {
  path: requestUrl.pathname,
  method: "GET",
});

// Log only the URL components required for diagnosis, especially when query parameters may contain sensitive data.

// ---------------------------------------------------------------------
// 58. Logging HTTP status
// ---------------------------------------------------------------------

const response = {
  status: 200,
};

logger.info("Request completed.", {
  statusCode: response.status,
});

// HTTP status codes provide useful outcome information without requiring the response body.

// ---------------------------------------------------------------------
// 59. Avoid logging response bodies
// ---------------------------------------------------------------------

const responseBody = {
  products: [
    {
      id: "example-product",
      name: "Example Product",
    },
  ],
};

logger.debug("Products response received.", {
  productCount: responseBody.products.length,
});

// Response bodies can contain unnecessary personal or confidential information and should not be logged by default.

// ---------------------------------------------------------------------
// 60. Request timing
// ---------------------------------------------------------------------

const measureRequest = (startTime: number, endTime: number): number => {
  return endTime - startTime;
};

const requestDuration = measureRequest(1000, 1240);

logger.info("Request completed.", {
  durationMs: requestDuration,
});

// Duration provides useful performance context without logging the payload.

// ---------------------------------------------------------------------
// 61. Logging user interactions
// ---------------------------------------------------------------------

const userInteraction = {
  event: "search_submitted",
  source: "search-form",
};

logger.info("User interaction completed.", userInteraction);

// Interaction logs should represent meaningful product events rather than every low-level browser event.

// ---------------------------------------------------------------------
// 62. Avoid logging every interaction
// ---------------------------------------------------------------------

const interactionLoggingPolicy = {
  logButtonClicks: false,
  logImportantActions: true,
};

console.log(interactionLoggingPolicy);

// Excessive interaction logging increases volume and can obscure more important events.

// ---------------------------------------------------------------------
// 63. Component logging
// ---------------------------------------------------------------------

interface ComponentLogProps {
  readonly componentName: string;
}

export const ComponentLogExample: FC<ComponentLogProps> = ({ componentName }): ReactElement => {
  logger.debug("Component rendered.", {
    component: componentName,
  });

  return (
    <section>
      <h2>{componentName}</h2>
      <p>Example component.</p>
    </section>
  );
};

// Component-level logs should be used selectively because rendering can occur frequently.

// ---------------------------------------------------------------------
// 64. Logging inside event handlers
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly onComplete: () => void;
}

export const ActionButton: FC<ActionButtonProps> = ({ onComplete }): ReactElement => {
  const handleClick = useCallback((): void => {
    logger.info("Action started.", {
      action: "example-action",
    });

    onComplete();

    logger.info("Action completed.", {
      action: "example-action",
      outcome: "success",
    });
  }, [onComplete]);

  return (
    <button type="button" onClick={handleClick}>
      Run action
    </button>
  );
};

// Event handlers are useful locations for logging meaningful user-triggered operations.

// ---------------------------------------------------------------------
// 65. Logging failures in event handlers
// ---------------------------------------------------------------------

export const SafeActionButton: FC<ActionButtonProps> = ({ onComplete }): ReactElement => {
  const handleClick = useCallback((): void => {
    try {
      onComplete();

      logger.info("Action completed.", {
        action: "example-action",
        outcome: "success",
      });
    } catch (error) {
      logger.error("Action failed.", {
        action: "example-action",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [onComplete]);

  return (
    <button type="button" onClick={handleClick}>
      Run action
    </button>
  );
};

// Failed operations should produce useful diagnostic context while avoiding sensitive values.

// ---------------------------------------------------------------------
// 66. Logging asynchronous operations
// ---------------------------------------------------------------------

const runAsyncOperation = async (): Promise<void> => {
  logger.debug("Async operation started.");

  await Promise.resolve();

  logger.debug("Async operation completed.");
};

void runAsyncOperation();

// Async operations can log meaningful lifecycle boundaries when those boundaries help investigation.

// ---------------------------------------------------------------------
// 67. Avoid duplicate error logs
// ---------------------------------------------------------------------

const handleError = (error: Error): void => {
  logger.error("Operation failed.", {
    error: error.message,
  });
};

try {
  throw new Error("Example failure.");
} catch (error) {
  if (error instanceof Error) {
    handleError(error);
  }
}

// The same failure should not be repeatedly logged by every layer unless each layer adds necessary context.

// ---------------------------------------------------------------------
// 68. Error propagation
// ---------------------------------------------------------------------

const processOperation = (): void => {
  try {
    throw new Error("Example failure.");
  } catch (error) {
    logger.error("Operation failed.");

    throw error;
  }
};

try {
  processOperation();
} catch {
  console.log("Failure handled by caller.");
}

// A lower layer can log a failure while preserving the original error for an appropriate higher-level handler.

// ---------------------------------------------------------------------
// 69. Log buffering
// ---------------------------------------------------------------------

interface LogBuffer {
  readonly entries: readonly string[];
}

const logBuffer: LogBuffer = {
  entries: ["event-a", "event-b"],
};

console.log(logBuffer);

// Buffered logging can group multiple events before transmission to a remote logging system.

// ---------------------------------------------------------------------
// 70. Remote logging
// ---------------------------------------------------------------------

interface RemoteLogPayload {
  readonly events: readonly string[];
}

const remoteLogPayload: RemoteLogPayload = {
  events: ["application_ready", "profile_loaded"],
};

console.log(remoteLogPayload);

// Remote logging can centralize production events for aggregation, querying, and investigation.

// ---------------------------------------------------------------------
// 71. Secure transport
// ---------------------------------------------------------------------

const remoteLoggingTransport = {
  protocol: "HTTPS",
};

console.log(remoteLoggingTransport);

// Logs sent over untrusted networks should use an appropriately protected transport.

// ---------------------------------------------------------------------
// 72. Logging failures
// ---------------------------------------------------------------------

const reportLogSafely = (report: () => void): void => {
  try {
    report();
  } catch {
    // Logging failures should not normally break the application.
  }
};

reportLogSafely(() => {
  logger.info("Telemetry event submitted.");
});

// Logging infrastructure should be isolated so its failure does not become an application failure.

// ---------------------------------------------------------------------
// 73. Sampling debug logs
// ---------------------------------------------------------------------

const debugSampling = {
  enabledInDevelopment: true,
  enabledForAllProductionUsers: false,
};

console.log(debugSampling);

// Detailed debug logs can be sampled or restricted when their volume is too high for production use.

// ---------------------------------------------------------------------
// 74. Log retention
// ---------------------------------------------------------------------

interface RetentionPolicy {
  readonly category: string;
  readonly retentionDays: number;
}

const retentionPolicies: readonly RetentionPolicy[] = [
  {
    category: "operational",
    retentionDays: 30,
  },
  {
    category: "debug",
    retentionDays: 7,
  },
];

console.log(retentionPolicies);

// Retention should follow operational, legal, regulatory, and privacy requirements rather than arbitrary permanent storage.

// ---------------------------------------------------------------------
// 75. Log access
// ---------------------------------------------------------------------

const logAccessPolicy = {
  authorizedOperatorsOnly: true,
  accessAudited: true,
};

console.log(logAccessPolicy);

// Logs can contain sensitive operational information and therefore require appropriate access controls.

// ---------------------------------------------------------------------
// 76. Log integrity
// ---------------------------------------------------------------------

const logIntegrityPolicy = {
  protectedInTransit: true,
  protectedAtRest: true,
};

console.log(logIntegrityPolicy);

// Production log infrastructure should protect collected data from unauthorized modification or disclosure.

// ---------------------------------------------------------------------
// 77. Logging checklist
// ---------------------------------------------------------------------

const loggingChecklist = [
  "use structured events",
  "include useful context",
  "use consistent levels",
  "redact sensitive data",
  "sanitize untrusted values",
  "avoid excessive volume",
  "protect remote transport",
  "restrict log access",
];

console.log(loggingChecklist);

// A logging strategy should address both diagnostic usefulness and security.

// ---------------------------------------------------------------------
// 78. Integrated logger
// ---------------------------------------------------------------------

interface IntegratedLogger {
  readonly log: (level: LogLevel, event: string, context?: Record<string, unknown>) => void;
}

const integratedLogger: IntegratedLogger = {
  log: (level, event, context): void => {
    const safeContext = sanitizeObject(context ?? {});

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      environment,
      release: releaseContext.version,
      ...safeContext,
    };

    logByLevel(level, JSON.stringify(entry));
  },
};

integratedLogger.log("info", "profile_loaded", {
  operation: "load-profile",
  password: "example-password",
});

// A centralized logger can combine timestamps, severity, event names, deployment context, and sanitization.

// ---------------------------------------------------------------------
// 79. Complete logging example
// ---------------------------------------------------------------------

export const LoggingExample: FC = (): ReactElement => {
  const handleAction = (): void => {
    const startedAt = performance.now();

    integratedLogger.log("info", "example_action_started", {
      component: "LoggingExample",
    });

    try {
      integratedLogger.log("info", "example_action_completed", {
        outcome: "success",
        durationMs: performance.now() - startedAt,
      });
    } catch (error) {
      integratedLogger.log("error", "example_action_failed", {
        outcome: "failure",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <section>
      <h2>Application logging</h2>

      <p>Logging records structured application events with useful operational context.</p>

      <button type="button" onClick={handleAction}>
        Run example action
      </button>
    </section>
  );
};

// The integrated example records lifecycle events while keeping logging separate from application behavior.

// ---------------------------------------------------------------------
// 80. Final logging model
// ---------------------------------------------------------------------

const finalLoggingModel = {
  structure: ["timestamp", "level", "event", "context"],
  protect: ["redaction", "sanitization", "access control", "secure transport"],
  operate: ["filtering", "sampling", "retention", "monitoring"],
  investigate: ["errors", "request correlation", "release comparison", "performance context"],
};

console.log(finalLoggingModel);

export default LoggingExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Logging records application events so that execution can be understood and investigated.
// - Console methods provide basic browser-side diagnostic logging.
// - Log levels communicate the severity or purpose of a log entry.
// - Structured logs represent important information as explicit fields.
// - Stable event names make logs easier to filter, aggregate, and analyze.
// - Useful context includes timestamps, environments, releases, operations, outcomes, and correlation identifiers.
// - Production logs should contain intentional operational information rather than unrestricted application state.
// - Passwords, access tokens, API keys, encryption keys, and other secrets should never be logged.
// - Session credentials should not be copied directly into log records.
// - Sensitive values can be excluded, redacted, or replaced with derived non-sensitive information.
// - Allowlisting fields is often safer than serializing arbitrary objects.
// - Error logs should preserve useful diagnostic context without exposing sensitive data.
// - Client-side logs provide useful evidence but should not be treated as authoritative security records.
// - Security-critical decisions and authoritative audit records belong on trusted server-side systems.
// - Untrusted values should be sanitized before being placed into log formats.
// - Newline and delimiter characters can make untrusted log data ambiguous or enable log injection.
// - Meaningful user interactions should be logged selectively rather than logging every low-level browser event.
// - A centralized logger can provide consistent formatting, filtering, sanitization, and context.
// - Production logging commonly uses stricter levels than development logging.
// - Logging failures should not normally prevent the application from functioning.
// - Remote logs require appropriate transport, access control, retention, and integrity protections.
// - Sampling and filtering can control production log volume without removing important operational events.
// - Logging and error reporting are related but serve different operational purposes.
// - Effective logging balances diagnostic value, security, privacy, performance, storage, and operational requirements.

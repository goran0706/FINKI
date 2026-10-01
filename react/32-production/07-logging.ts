/**
 * 07 - Logging
 * ============
 *
 * Logging in a React application provides visibility into application behavior during development
 * and production. Logs should be intentional, structured, and useful for diagnosing failures without
 * exposing sensitive information or flooding the browser console.
 */

// ---------------------------------------------------------------------
// 1. Basic logging
// ---------------------------------------------------------------------

console.debug("Rendering profile page");
console.info("Profile loaded");
console.warn("Profile data is incomplete");
console.error("Failed to load profile");

// ---------------------------------------------------------------------
// 2. Structured logging
// ---------------------------------------------------------------------

const userId = "user-123";
const requestDuration = 184;

console.info("Profile loaded", {
  userId,
  requestDuration,
});

// ---------------------------------------------------------------------
// 3. Environment-aware logging
// ---------------------------------------------------------------------

const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
  console.debug("Detailed development information", {
    component: "ProfilePage",
  });
}

// ---------------------------------------------------------------------
// 4. Logging errors
// ---------------------------------------------------------------------

try {
  throw new Error("Failed to load profile");
} catch (error) {
  console.error("Profile request failed", {
    error,
  });
}

// ---------------------------------------------------------------------
// 5. Logging in React code
// ---------------------------------------------------------------------

export const logProfileLoad = (durationMs: number): void => {
  console.info("Profile loaded", {
    durationMs,
  });
};

// ---------------------------------------------------------------------
// 6. Avoid sensitive data
// ---------------------------------------------------------------------

const logRequestFailure = (status: number, endpoint: string): void => {
  console.error("API request failed", {
    status,
    endpoint,
  });
};

logRequestFailure(500, "/api/profile");

// Do not log passwords, access tokens, cookies, authorization headers, or other secrets.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Use console methods intentionally to record meaningful application events.
// Prefer structured metadata over embedding many values directly into message strings.
// Keep verbose diagnostic logging limited to development when appropriate.
// Log errors with enough context to diagnose the failure without exposing sensitive data.
// Production logging can later be connected to an error-monitoring or telemetry service.

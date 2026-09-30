/**
 * Date
 * ====
 *
 * The Date object represents a single point in time as a number of
 * milliseconds since the Unix epoch (January 1, 1970, 00:00:00 UTC).
 */

// ---------------------------------------------------------------------
// 1. Creating Date values
// ---------------------------------------------------------------------

const now = new Date(); // Current date and time
const timestamp = Date.now(); // Current timestamp in milliseconds
const epoch = new Date(0); // Unix epoch (1970-01-01T00:00:00.000Z)
const isoDate = new Date("2026-01-01T12:30:00Z"); // From ISO string
const dateOnly = new Date("2026-01-01"); // Interpreted as UTC

// ---------------------------------------------------------------------
// 2. Date components and zero-based months
// ---------------------------------------------------------------------

// Months are zero-based (0 = January, 11 = December).
const componentDate = new Date(2026, 0, 15, 10, 30, 45);
componentDate.getFullYear(); // 2026
componentDate.getMonth(); // 0 (January)
componentDate.getDate(); // 15
componentDate.getDay(); // Day of week (0 = Sunday, 6 = Saturday)

// ---------------------------------------------------------------------
// 3. Local time vs. UTC getters
// ---------------------------------------------------------------------

const localHours = componentDate.getHours();
const utcHours = componentDate.getUTCHours();

// ---------------------------------------------------------------------
// 4. Comparing dates
// ---------------------------------------------------------------------

const earlier = new Date("2026-01-01T00:00:00Z");
const later = new Date("2026-01-02T00:00:00Z");

earlier < later; // true
// `earlier === later` is false because they are distinct object references.
earlier.getTime() === later.getTime(); // false (compare timestamps for instant equality)

// ---------------------------------------------------------------------
// 5. Date arithmetic and mutability
// ---------------------------------------------------------------------

const difference = later.getTime() - earlier.getTime(); // Difference in milliseconds (86400000)
const nextDay = new Date(earlier.getTime() + 24 * 60 * 60 * 1000); // Non-mutating addition

const mutableDate = new Date("2026-01-01T00:00:00Z");
mutableDate.setUTCDate(2); // Mutates the existing Date object

// ---------------------------------------------------------------------
// 6. Date overflow normalization
// ---------------------------------------------------------------------

const overflowDate = new Date(2026, 0, 32); // January 32 normalizes to February 1
overflowDate.toISOString(); // "2026-02-01T00:00:00.000Z"

// ---------------------------------------------------------------------
// 7. Invalid dates
// ---------------------------------------------------------------------

const invalidDate = new Date("not-a-date");
const isValid = invalidDate instanceof Date && !Number.isNaN(invalidDate.getTime()); // false

// ---------------------------------------------------------------------
// 8. Formatting and Intl.DateTimeFormat
// ---------------------------------------------------------------------

const targetDate = new Date("2026-01-01T12:30:00Z");
targetDate.toISOString(); // "2026-01-01T12:30:00.000Z" (always UTC)
targetDate.toUTCString();

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/New_York",
});
formatter.format(targetDate); // Formatted for a specific time zone

// ---------------------------------------------------------------------
// 9. JSON serialization and API dates
// ---------------------------------------------------------------------

const serialized = JSON.stringify({ createdAt: targetDate });
// '{"createdAt":"2026-01-01T12:30:00.000Z"}' (dates serialize as ISO strings)

const parsedData = JSON.parse(serialized);
const restoredDate = new Date(parsedData.createdAt); // Explicit conversion needed

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The `Date` object represents a point in time measured in milliseconds since the Unix epoch.
// - Months are zero-based (0 to 11).
// - Use relational operators or `.getTime()` to compare dates, and compare timestamps for exact equality.
// - Date objects are mutable; copy timestamps to avoid unintended mutations.
// - `Intl.DateTimeFormat` provides robust locale- and time-zone-aware formatting.
// - Serialization converts dates to ISO strings via `toJSON()`, requiring explicit re-instantiation upon parsing.

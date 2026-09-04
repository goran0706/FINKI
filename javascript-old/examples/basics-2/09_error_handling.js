/*
  Error Handling and Error Throwing

  Handle errors to fail gracefully.
*/

function fooThrows() {
  throw "Error: Inside foo";
}

function fooThrows() {
  throw new Error("Error: Inside foo");
}

function fooNotification() {
  console.log("foo notification");
}

try {
  fooThrows();
} catch {
  console.log("some error message");
}

try {
  fooThrows();
} catch (err) {
  console.log(err);
}

try {
  fooThrows();
} catch (err) {
  console.log(err);
} finally {
  console.log("runs anyways");
}

try {
  fooThrows();
} catch (err) {
  console.log(err);
} finally {
  fooNotification();
}

// Create custom error
class AuthError extends Error {
  constructor(msg) {
    super(msg);
  }
}

try {
  throw new AuthError("Invalid Credentials");
} catch (err) {
  console.log(err);
}

const ErrorCollection = {
  authenticationError: new AuthError("Invalid Credentials"),
  username: "username must contain 1 special character",
};

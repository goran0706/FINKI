/**
 * Discriminated Unions
 * ====================
 *
 * A discriminated union combines multiple object types that share a common
 * property whose value identifies which member of the union a value represents.
 * This allows TypeScript to narrow the object to the correct type based on that property.
 */

// -----------------------------------------------------------------------
// 1. Defining discriminated unions
// -----------------------------------------------------------------------

// Each object type has a common `type` property with a different literal value.
type SuccessResponse = {
  type: "success";
  data: string;
};

type ErrorResponse = {
  type: "error";
  message: string;
};

type Response = SuccessResponse | ErrorResponse;

let response: Response = {
  type: "success",
  data: "User loaded",
};

console.log(response); // { type: 'success', data: 'User loaded' }

// -----------------------------------------------------------------------
// 2. Narrowing with the discriminant
// -----------------------------------------------------------------------

// TypeScript uses the discriminant property to determine which union member is present.
function handleResponse(response: Response): void {
  if (response.type === "success") {
    console.log(response.data); // "User loaded"
  } else {
    console.log(response.message); // error message
  }
}

handleResponse({
  type: "success",
  data: "User loaded",
});

handleResponse({
  type: "error",
  message: "User not found",
});

// TypeScript knows that `data` exists only in the `"success"` branch
// and `message` exists only in the `"error"` branch.

// -----------------------------------------------------------------------
// 3. Multiple union members
// -----------------------------------------------------------------------

// A discriminated union can contain more than two object types.
type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: string[];
};

type ErrorState = {
  status: "error";
  message: string;
};

type RequestState = LoadingState | SuccessState | ErrorState;

function renderState(state: RequestState): void {
  if (state.status === "loading") {
    console.log("Loading...");
  } else if (state.status === "success") {
    console.log(state.data);
  } else {
    console.log(state.message);
  }
}

renderState({ status: "loading" });
renderState({ status: "success", data: ["John", "Jane"] });
renderState({ status: "error", message: "Request failed" });

// Each branch narrows `state` to exactly one member of the union.

// -----------------------------------------------------------------------
// 4. Discriminated unions with different properties
// -----------------------------------------------------------------------

// The discriminant does not have to be named `type` or `status`.
type TextMessage = {
  kind: "text";
  content: string;
};

type ImageMessage = {
  kind: "image";
  url: string;
  width: number;
  height: number;
};

type Message = TextMessage | ImageMessage;

function displayMessage(message: Message): void {
  if (message.kind === "text") {
    console.log(message.content);
  } else {
    console.log(message.url);
    console.log(message.width);
    console.log(message.height);
  }
}

displayMessage({
  kind: "text",
  content: "Hello",
});

displayMessage({
  kind: "image",
  url: "/images/profile.png",
  width: 200,
  height: 200,
});

// The important requirement is that the shared property has distinct literal values.

// -----------------------------------------------------------------------
// 5. Discriminated unions in function parameters
// -----------------------------------------------------------------------

// Discriminated unions are useful for functions that accept different object shapes.
type Circle = {
  shape: "circle";
  radius: number;
};

type Rectangle = {
  shape: "rectangle";
  width: number;
  height: number;
};

type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
  if (shape.shape === "circle") {
    return Math.PI * shape.radius ** 2;
  }

  return shape.width * shape.height;
}

console.log(getArea({ shape: "circle", radius: 5 })); // 78.53981633974483
console.log(getArea({ shape: "rectangle", width: 10, height: 5 })); // 50

// TypeScript narrows the parameter before accessing properties specific to each shape.

// -----------------------------------------------------------------------
// 6. Exhaustive handling
// -----------------------------------------------------------------------

// A discriminated union can be handled exhaustively by checking every possible member.
type Payment =
  | { method: "card"; cardNumber: string }
  | { method: "paypal"; email: string }
  | { method: "bank"; accountNumber: string };

function describePayment(payment: Payment): string {
  switch (payment.method) {
    case "card":
      return `Card ending in ${payment.cardNumber.slice(-4)}`;
    case "paypal":
      return `PayPal account: ${payment.email}`;
    case "bank":
      return `Bank account: ${payment.accountNumber}`;
  }
}

console.log(
  describePayment({
    method: "card",
    cardNumber: "1234567890123456",
  }),
); // "Card ending in 3456"

// Every possible `method` value is handled by the switch.

// -----------------------------------------------------------------------
// 7. Invalid combinations
// -----------------------------------------------------------------------

// Discriminated unions prevent properties from being mixed between unrelated variants.
type CircleConfig = {
  kind: "circle";
  radius: number;
};

type SquareConfig = {
  kind: "square";
  side: number;
};

type ShapeConfig = CircleConfig | SquareConfig;

let circle: ShapeConfig = {
  kind: "circle",
  radius: 10,
};

console.log(circle); // { kind: 'circle', radius: 10 }

// A circle cannot use the properties required by a square.
// circle = { kind: "circle", side: 10 }; // TS2353: Object literal may only specify known properties, and 'side' does not exist in type 'CircleConfig'.

// TypeScript uses the discriminant to associate each set of properties with its correct variant.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - A discriminated union combines object types with a shared discriminant property.
// - Each union member uses a different literal value for the discriminant.
// - Checking the discriminant allows TypeScript to narrow the object to one specific member.
// - Discriminated unions are useful for modeling states, events, messages, responses, and configurations.
// - Exhaustive handling ensures every possible union member is accounted for.
// - The discriminant keeps properties belonging to different variants from being mixed together.

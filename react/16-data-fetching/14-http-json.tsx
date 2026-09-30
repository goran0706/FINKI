/**
 * HTTP JSON
 * =========
 *
 * JSON (JavaScript Object Notation) is a text-based data format commonly used
 * to represent structured application data in HTTP request and response
 * bodies. JSON objects contain name-value pairs, while JSON arrays contain
 * ordered values. JSON values can be objects, arrays, strings, numbers,
 * booleans, or null.
 *
 * JavaScript converts values to JSON text with `JSON.stringify()` and parses
 * JSON text back into JavaScript values with `JSON.parse()`. The conversion is
 * explicit: Fetch does not automatically serialize a JavaScript object when
 * it is supplied as a request body. A JSON request normally serializes the
 * value first and declares `Content-Type: application/json`.
 *
 * A JSON response can be consumed through `Response.json()`. The method
 * asynchronously reads the response body and parses it as JSON. Parsing is
 * separate from checking the HTTP status, so application code should inspect
 * the response status before or alongside attempting to parse the body.
 *
 * JSON has several important type differences from JavaScript. `undefined`,
 * functions, and symbols do not have direct JSON representations. Object
 * properties whose values are `undefined`, functions, or symbols are omitted
 * during serialization, while unsupported values inside arrays become
 * `null`. `Date` objects are serialized through their `toJSON()` behavior,
 * producing strings rather than preserving a JavaScript Date instance.
 *
 * JSON numbers are represented as decimal numeric values in the JSON text.
 * JavaScript's JSON parser produces `number` values, which means precision
 * limitations of JavaScript numbers still apply when very large integer
 * values are parsed. APIs that require exact large integers commonly represent
 * them as strings or use another explicitly defined representation.
 *
 * JSON parsing is strict. Invalid JSON causes `JSON.parse()` and
 * `Response.json()` to reject or throw rather than returning a partially
 * parsed value.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { type FC, type ReactNode } from "react";

export interface HttpJsonObjectProps {
  readonly name: string;
  readonly email: string;
}

export interface HttpJsonRequestProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface HttpJsonResponseProps {
  readonly name: string;
  readonly email: string;
}

export interface HttpJsonArrayProps {
  readonly firstName: string;
  readonly secondName: string;
}

export interface HttpJsonSpecialValuesProps {
  readonly name: string;
}

export interface HttpJsonNestedProps {
  readonly name: string;
  readonly city: string;
}

export interface HttpJsonInvalidProps {
  readonly value: string;
}

export interface HttpJsonLargeNumberProps {
  readonly value: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates converting a JavaScript object into JSON text with
 * `JSON.stringify()`.
 */
export const HttpJsonObjectExample: FC<HttpJsonObjectProps> = ({ name, email }: HttpJsonObjectProps): ReactNode => {
  const user: {
    readonly name: string;
    readonly email: string;
  } = {
    name,
    email,
  };

  const json: string = JSON.stringify(user);

  return (
    <section>
      <h3>Serializing a JavaScript object</h3>

      <p>JavaScript object:</p>
      <pre>{`{\n  name: "${user.name}",\n  email: "${user.email}"\n}`}</pre>

      <p>JSON text:</p>
      <pre>{json}</pre>
    </section>
  );
};

/**
 * Demonstrates creating a JSON HTTP request body and declaring its media type.
 */
export const HttpJsonRequestExample: FC<HttpJsonRequestProps> = ({
  url,
  name,
  email,
}: HttpJsonRequestProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
    email,
  });

  const request: Request = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>Sending JSON in an HTTP request</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>Content-Type</dt>
        <dd>{request.headers.get("Content-Type")}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates parsing JSON text into a JavaScript value with `JSON.parse()`.
 */
export const HttpJsonResponseExample: FC<HttpJsonResponseProps> = ({
  name,
  email,
}: HttpJsonResponseProps): ReactNode => {
  const json: string = JSON.stringify({
    name,
    email,
  });

  const parsed: unknown = JSON.parse(json);

  if (typeof parsed !== "object" || parsed === null || !("name" in parsed) || !("email" in parsed)) {
    return (
      <section>
        <h3>Parsing JSON text</h3>
        <p>The parsed value does not have the expected object shape.</p>
      </section>
    );
  }

  const parsedObject: {
    readonly name: unknown;
    readonly email: unknown;
  } = parsed;

  return (
    <section>
      <h3>Parsing JSON text</h3>

      <p>JSON text:</p>
      <pre>{json}</pre>

      <p>Parsed name: {String(parsedObject.name)}</p>

      <p>Parsed email: {String(parsedObject.email)}</p>
    </section>
  );
};

/**
 * Demonstrates a JSON array containing multiple values.
 */
export const HttpJsonArrayExample: FC<HttpJsonArrayProps> = ({
  firstName,
  secondName,
}: HttpJsonArrayProps): ReactNode => {
  const names: readonly string[] = [firstName, secondName];

  const json: string = JSON.stringify(names);

  return (
    <section>
      <h3>Representing arrays as JSON</h3>

      <p>JSON array:</p>
      <pre>{json}</pre>

      <ul>
        {names.map((name: string): ReactNode => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates nested JSON objects. JSON nesting preserves object and array
 * relationships when values are serialized and parsed.
 */
export const HttpJsonNestedExample: FC<HttpJsonNestedProps> = ({ name, city }: HttpJsonNestedProps): ReactNode => {
  const user: {
    readonly name: string;
    readonly address: {
      readonly city: string;
    };
  } = {
    name,
    address: {
      city,
    },
  };

  const json: string = JSON.stringify(user);

  return (
    <section>
      <h3>Representing nested JSON data</h3>

      <pre>{json}</pre>
    </section>
  );
};

/**
 * Demonstrates how values without a direct JSON representation are handled
 * during serialization.
 */
export const HttpJsonSpecialValuesExample: FC<HttpJsonSpecialValuesProps> = ({
  name,
}: HttpJsonSpecialValuesProps): ReactNode => {
  const data: {
    readonly name: string;
    readonly optionalValue?: string;
    readonly callback?: () => void;
  } = {
    name,
    optionalValue: undefined,
    callback: undefined,
  };

  const json: string = JSON.stringify(data);

  return (
    <section>
      <h3>JSON values without direct JavaScript equivalents</h3>

      <p>`undefined` and functions are not represented as JSON object property values.</p>

      <pre>{json}</pre>
    </section>
  );
};

/**
 * Demonstrates handling invalid JSON. JSON.parse() throws a SyntaxError when
 * the supplied text does not conform to JSON syntax.
 */
export const HttpJsonInvalidExample: FC<HttpJsonInvalidProps> = ({ value }: HttpJsonInvalidProps): ReactNode => {
  let result: string;

  try {
    JSON.parse(value);

    result = "The value is valid JSON.";
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      result = "SyntaxError: the value is not valid JSON.";
    } else {
      result = "An unexpected parsing error occurred.";
    }
  }

  return (
    <section>
      <h3>Handling invalid JSON</h3>

      <p>Input: {value}</p>
      <p>{result}</p>
    </section>
  );
};

/**
 * Demonstrates that JSON numeric values are parsed as JavaScript numbers and
 * therefore remain subject to JavaScript number precision limitations.
 */
export const HttpJsonLargeNumberExample: FC<HttpJsonLargeNumberProps> = ({
  value,
}: HttpJsonLargeNumberProps): ReactNode => {
  const json: string = JSON.stringify({
    value,
  });

  const parsed: unknown = JSON.parse(json);

  return (
    <section>
      <h3>JSON numbers and JavaScript number precision</h3>

      <p>Original JavaScript number: {value}</p>

      <p>JSON text:</p>
      <pre>{json}</pre>

      <p>Parsed JavaScript value: {String(parsed.value)}</p>

      <p>
        APIs requiring exact very large integers commonly transmit them as strings instead of relying on JavaScript
        number precision.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpJsonContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP JSON</h1>

      <h2>1. Serializing a JavaScript object</h2>
      <HttpJsonObjectExample name="John Doe" email="john.doe@example.com" />

      <h2>2. Sending JSON in an HTTP request</h2>
      <HttpJsonRequestExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>3. Parsing JSON text</h2>
      <HttpJsonResponseExample name="John Doe" email="john.doe@example.com" />

      <h2>4. Representing arrays as JSON</h2>
      <HttpJsonArrayExample firstName="John Doe" secondName="Jane Doe" />

      <h2>5. Representing nested JSON data</h2>
      <HttpJsonNestedExample name="John Doe" city="Example City" />

      <h2>6. Handling JavaScript values without direct JSON representations</h2>
      <HttpJsonSpecialValuesExample name="John Doe" />

      <h2>7. Handling invalid JSON</h2>
      <HttpJsonInvalidExample value='{"name": "John Doe",}' />

      <h2>8. Handling JSON number precision</h2>
      <HttpJsonLargeNumberExample value={9007199254740991} />
    </main>
  );
};

export default HttpJsonContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSON is a text-based format commonly used for structured HTTP payloads.
// - `JSON.stringify()` converts supported JavaScript values into JSON text.
// - `JSON.parse()` converts valid JSON text into JavaScript values.
// - Fetch does not automatically serialize ordinary JavaScript objects as JSON request bodies.
// - JSON request bodies should normally use `Content-Type: application/json`.
// - `Response.json()` asynchronously reads and parses a response body as JSON.
// - JSON supports objects, arrays, strings, numbers, booleans, and null.
// - `undefined`, functions, and symbols do not have direct JSON representations.
// - Invalid JSON causes `JSON.parse()` and `Response.json()` to fail rather than partially parsing the input.
// - JSON numbers become JavaScript `number` values and are therefore subject to JavaScript number precision limits.
// - APIs that require exact large integers commonly represent those values as strings.
// - JSON parsing does not validate that the resulting JavaScript value matches an application's expected object shape.

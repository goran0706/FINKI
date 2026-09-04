# Object Destructuring

## Object Destructuring Concept

Object destructuring is a JavaScript syntax that extracts values from object properties and assigns them directly to
distinct variables. Rather than requiring repeated dot or bracket notation to access properties individually,
destructuring matches variable names against key names within the target object to cleanly unpack data in a single
declarative expression.

## Basic Object Destructuring

Basic object destructuring extracts designated properties from an object into standalone variables using property name
matching. The operation reads values from the target object without mutating or altering the original instance in
memory.

| Feature                    | Behavior |
|:---------------------------|:---------|
| Extracts object properties | Yes      |
| Creates new variables      | Yes      |
| Modifies original object   | No       |

## Property Matching

Object destructuring relies on key matching to determine value assignment. The variable name declared inside the
destructuring pattern acts as the lookup key against the target object.

| Object Property | Destructured Variable |
|:----------------|:----------------------|
| Property key    | Variable name         |
| Property value  | Assigned value        |

## Renaming Variables

JavaScript destructuring syntax allows extracted properties to be renamed during extraction using a colon syntax (
`propertyName: targetVariableName`). Renaming prevents variable naming collisions, improves readability in local scopes,
and aligns property values with local domain conventions while leaving the underlying object property untouched.

## Missing Properties

Attempting to destructure a property key that does not exist on the target object assigns `undefined` to the target
variable without throwing a runtime error. To avoid dealing with unexpected `undefined` states, destructuring patterns
allow fallback default values to be declared inline.

## Default Values

Default values provide fallback assignments whenever a requested object property resolves strictly to `undefined`.

| Property Value | Default Used |
|:---------------|:-------------|
| Existing value | No           |
| `undefined`    | Yes          |
| `null`         | No           |

## Nested Destructuring

Nested destructuring expands the assignment pattern to extract properties from child objects embedded within complex
parent structures in a single operational step.

## Nested Destructuring Considerations

While nested destructuring enables deep property extraction, overly complex extraction patterns can degrade code
readability and introduce risks if intermediate object layers are `undefined`.

| Situation       | Recommendation                 |
|:----------------|:-------------------------------|
| Simple nesting  | Destructuring is useful        |
| Deep structures | Prefer clearer access patterns |

## Destructuring Function Parameters

Function parameter destructuring unpacks incoming option objects directly within function signatures. This makes
function requirements explicit, reduces boiler-plate lookup calls inside the function body, and streamlines argument
handling.

## Default Values in Parameters

Combining object destructuring, default property values, and empty object parameter fallbacks (
`({ prop = defaultValue } = {})`) allows functions to safely consume optional configuration objects without throwing
null pointer errors when no argument is supplied.

## Rest Properties

Rest property syntax (`...rest`) collects all remaining, unextracted enumerable own properties into a newly allocated
object instance.

| Feature                     | Behavior |
|:----------------------------|:---------|
| Creates new object          | Yes      |
| Copies remaining properties | Yes      |
| Uses shallow copying        | Yes      |

## Destructuring vs Property Access

While standard property access and destructuring both retrieve object values, destructuring provides a cleaner, less
repetitive approach when multiple properties are extracted simultaneously.

| Feature                | Property Access | Destructuring |
|:-----------------------|:----------------|:--------------|
| Single value access    | Yes             | Yes           |
| Multiple values        | Repetitive      | Cleaner       |
| Creates variables      | No              | Yes           |
| Keeps object reference | Yes             | Yes           |

## Destructuring and References

Object destructuring unpacks property values, but it does not perform deep cloning. If an extracted property stores a
reference to a nested object or array, the new variable retains a direct memory reference to that nested value.

## Use Cases

Destructuring simplifies data handling across several standard JavaScript patterns:

* **Extracting function inputs:** Unpacking specific properties directly from parameter configuration objects.
* **Working with structured data:** Filtering and selecting specific properties from API response payloads.
* **Reducing repeated access:** Eliminating redundant object prefix references throughout local scopes.
* **Handling optional data:** Applying fallback values to missing or omitted properties safely.

## Performance Considerations

Destructuring is primarily a syntax convenience that performs standard property lookups under the hood, making its
performance overhead virtually identical to dot-notation access.

| Factor               | Description                                                    |
|:---------------------|:---------------------------------------------------------------|
| Number of properties | Extracting more properties increases internal property lookups |
| Nested structures    | Deeply nested patterns add lookup and validation overhead      |
| Object size          | Unused properties are ignored without unnecessary copying      |

## Best Practices

* **Use destructuring when multiple properties are needed:** Apply destructuring syntax to eliminate redundant property
  lookups and simplify variable declarations.
* **Use meaningful variable names when renaming properties:** Assign clear local variable names during extraction to
  resolve scope collisions and enhance readability.
* **Use default values for optional properties:** Define inline default values to prevent variables from unexpectedly
  resolving to `undefined`.
* **Avoid excessive nested destructuring:** Break deeply nested destructuring into separate statements or standard
  property access calls to maintain code clarity.
* **Remember destructuring does not create deep copies:** Treat extracted object or array references as shared state to
  avoid unintended side effects.
* **Provide empty object fallbacks for function parameters:** Combine object parameter destructuring with an empty
  object default assignment (`= {}`) to prevent runtime crashes when invoking functions without arguments.
* **Guard against nullish targets during destructuring:** Ensure that the target expression evaluated on the right side
  of the assignment is not `null` or `undefined`, as attempting to destructure nullish values throws immediate type
  errors.
* **Order rest properties correctly:** Place rest property syntax (`...rest`) exclusively at the very end of a
  destructuring pattern, as placing it anywhere else results in a syntax error.
* **Combine destructuring with TypeScript type annotations cleanly:** Use explicit TypeScript syntax (
  `const { name }: User = obj`) to preserve robust type safety when extracting variables from typed objects.
* **Avoid variable name collisions in outer scopes:** Ensure that local variable names chosen during property extraction
  do not accidentally overwrite existing block-scoped or outer variables.
* **Keep extraction lists concise:** Limit single-line destructuring expressions to a reasonable number of properties to
  maintain high code readability and scannability.
* **Use computed property names for dynamic extraction:** Utilize computed property syntax (
  `const { [dynamicKey]: localName } = obj`) when property keys must be resolved dynamically at runtime.
* **Beware of lexical scoping restrictions with existing variables:** Wrap destructuring assignments in parentheses when
  re-assigning values to pre-declared variables to avoid syntax ambiguity with block scopes.
* **Validate type consistency of extracted optional properties:** Check that default values match the expected data type
  of the target property to prevent subtle type-coercion bugs down the line.
* **Leverage rest destructuring for payload sanitization:** Use rest properties to extract sensitive fields (such as
  passwords or tokens) into isolated variables while passing down the remaining safe properties.
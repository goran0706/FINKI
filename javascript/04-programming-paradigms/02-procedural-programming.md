# Procedural Programming Concepts and Execution Mechanics

Procedural programming is a direct derivative of imperative programming centered on the concept of procedure calls,
frequently referred to as routines, subroutines, or functions. Code is structured into linear sequences of statements
and modular blocks that perform specific computational tasks, relying heavily on sequential execution, local scope
boundaries, and shared or global state.

## Procedural Concepts and Architectural Structure

Procedural programming structures a software application as a collection of procedures or functions that operate on
shared data structures. This paradigm abstracts repetitive blocks of logic into reusable routines, improving code
organization compared to unstructured `GOTO`-based programming.

* **Modular Subroutines:** Breaking down a monolithic program into smaller, manageable procedures or functions that
  perform specific computational tasks.
* **Shared State and Global Variables:** Storing application state in variables that can be accessed and modified across
  multiple procedures, though this introduces maintenance challenges if not carefully controlled.
* **Control Flow Structures:** Utilizing standard conditional branches (`if`, `switch`) and iteration loops (`for`,
  `while`) to direct the precise path of execution.

## Step-by-Step Execution and Control Flow

Procedural programming executes instructions in a strict, top-down sequence, altered only by explicit control flow
statements and function calls. Below is a comprehensive example demonstrating a procedural shopping cart calculation
with explicit step-by-step execution:

```javascript
// Procedural shopping cart calculation with explicit step-by-step execution
let cartItems = [
    {price: 10, quantity: 2},
    {price: 25, quantity: 1}
];

function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        let currentItem = items[i];
        let itemCost = currentItem.price * currentItem.quantity;
        total += itemCost;
    }
    return total;
}

let finalTotal = calculateTotal(cartItems);
console.log(finalTotal); // Outputs: 45
```

## Architectural Trade-Offs

Procedural programming offers distinct advantages and disadvantages depending on the scale and nature of the software
project:

* **Advantages:** Low execution overhead, straightforward mental model for linear workflows, predictable top-down
  execution, and high compatibility with low-level systems programming.
* **Disadvantages:** Tight coupling between data structures and procedures, vulnerability to unintended side effects
  when modifying shared global state, and difficulty scaling across large engineering teams.

## Best Practices

* **Minimize global state usage:** Pass required data explicitly into procedures as arguments rather than relying on
  shared global variables to prevent unintended mutations.
* **Keep procedures focused:** Ensure each procedure performs a single, well-defined task to improve readability,
  testability, and maintainability.
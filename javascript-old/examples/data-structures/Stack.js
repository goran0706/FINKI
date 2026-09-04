/**
 * Stack Data Structure
 *
 * Definition:
 * A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. In a stack, the most recently added item is the first to be removed.
 * Use a stack when you need to maintain a last-in-first-out order, such as tracking function calls or maintaining state.
 *
 * Key Characteristics:
 * - LIFO Principle: The last element added is the first one to be removed.
 * - Two Primary Operations: Push (to add an item) and Pop (to remove an item).
 * - Additional Operation: Peek (or Top) to view the top element without removing it.
 * - Useful for managing function call history and maintaining state.
 *
 * Basic Operations:
 * - Push: Adds an element to the top of the stack.
 * - Pop: Removes and returns the top element from the stack.
 * - Peek (or Top): Allows you to view the top element without removing it.
 * - Is Empty: Checks if the stack is empty.
 *
 * Common Use Cases:
 * - Function Call Stack: Used by programming languages to manage function call history, enabling functions to return to their caller when execution is complete.
 * - Undo/Redo Functionality: Stacks are used to implement undo and redo functionality in applications. Each action is pushed onto the stack and can be popped to revert or redo actions.
 * - Expression Evaluation: In the parsing of mathematical expressions, stacks help evaluate expressions based on operator precedence.
 * - Backtracking Algorithms: Algorithms like Depth-First Search (DFS) use stacks to backtrack when exploring possible solutions to a problem.
 *
 * Implementing a Stack:
 * - Using Arrays
 * - Using Linked Lists
 *
 * Time Complexity:
 * Stack operations, such as push and pop, generally have a time complexity of O(1) in well-implemented stacks.
 *
 * Stack Variations:
 * - Min Stack: A Min Stack tracks the minimum element in the stack efficiently, often by using an auxiliary stack.
 * - Max Stack: Similarly, a Max Stack tracks the maximum element in the stack.
 * - Implementing a Stack with a Queue: It's possible to simulate a stack using two queues. Push operations are O(1), while pop operations are O(n).
 *
 * Tips and Best Practices:
 * - Appropriate Use Cases: Use a stack when you need to maintain a last-in-first-out order, such as tracking function calls or maintaining state.
 * - Error Handling: Handling stack underflow or overflow is essential to prevent errors in your programs.
 * - Memory Management: Ensure that you release memory occupied by elements popped from the stack, particularly in languages that don't handle memory automatically.
 *
 * Challenges and Considerations:
 * - Stack Overflow: A stack overflow can occur when too many items are pushed onto the stack, leading to a crash. It's crucial to manage stack depth.
 * - Choosing the Right Data Structure: While stacks are excellent for specific use cases, it's essential to choose the right data structure for the task at hand.
 */

class Stack {
  constructor() {
    this.elements = [];
  }

  /**
   * Pushes an element onto the top of the stack.
   * @param {any} element - The element to be pushed.
   */
  push(element) {
    this.elements.push(element);
  }

  /**
   * Removes and returns the top element from the stack.
   * @returns {any} - The top element of the stack.
   */
  pop() {
    return this.elements.pop();
  }

  /**
   * Views the top element of the stack without removing it.
   * @returns {any} - The top element of the stack.
   */
  peek() {
    return this.elements[this.size() - 1];
  }

  /**
   * Returns the number of elements in the stack.
   * @returns {number} - The size of the stack.
   */
  size() {
    return this.elements.length;
  }

  /**
   * Checks if the stack is empty.
   * @returns {boolean} - True if the stack is empty, false otherwise.
   */
  isEmpty() {
    return this.elements.length === 0;
  }
}

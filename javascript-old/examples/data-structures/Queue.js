/**
 * Queue Data Structure
 *
 * Definition:
 * A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. In a queue, the first element added is the first one to be removed. Think of it as a line of people waiting for a service, where the person who arrives first is the first to be served.
 *
 * Key Characteristics:
 * - FIFO Principle: The first element added is the first to be removed.
 * - Two Primary Operations: Enqueue (to add an item) and Dequeue (to remove an item).
 * - Additional Operation: Peek (or Front) to view the front element without removing it.
 * - Useful for managing tasks, scheduling, and data flow.
 *
 * Basic Operations:
 * - Enqueue: Adds an element to the back of the queue.
 * - Dequeue: Removes and returns the front element from the queue.
 * - Peek (or Front): Allows you to view the front element without removing it.
 * - Is Empty: Checks if the queue is empty.
 *
 * Common Use Cases:
 * - Task Scheduling: Queues are used for scheduling tasks or processes in various applications, such as job queues in servers.
 * - Print Queue: In print spooling systems, print jobs are managed in a queue, ensuring fair and orderly printing.
 * - Breadth-First Search (BFS): The BFS algorithm uses a queue to traverse and explore nodes in a graph.
 * - Background Processing: In web applications, queues are used for background processing, such as sending emails or generating reports.
 *
 * Implementing a Queue:
 * - Using Arrays: A queue can be implemented using an array. Items are added to the back and removed from the front.
 * - Using Linked Lists: For dynamic resizing and efficient enqueue and dequeue operations, a linked list can be used to implement a queue.
 *
 * Time Complexity:
 * Queue operations, such as enqueue and dequeue, typically have a time complexity of O(1) in well-implemented queues.
 *
 * Queue Variations:
 * - Priority Queue: A priority queue assigns a priority to each element, and the element with the highest priority is dequeued first.
 * - Double-Ended Queue (Dequeue): A dequeue allows elements to be added or removed from both ends, offering more flexibility than a standard queue.
 *
 * Tips and Best Practices:
 * - Appropriate Use Cases: Use a queue when you need to manage tasks, data flow, or maintain a first-come-first-serve order.
 * - Error Handling: Proper error handling, such as handling queue underflow, is essential to prevent program errors.
 * - Synchronization (in multi-threaded applications): In multi-threaded applications, proper synchronization is needed to prevent data corruption and ensure safe queue operations.
 *
 * Applications:
 * - Print Spooling: Print spoolers use queues to manage print jobs in a first-come-first-serve order.
 * - Task Management: Task scheduling systems use queues to schedule and manage tasks efficiently.
 * - Data Buffering: Queues are used in data streaming and buffering to manage the flow of data.
 * - Synchronization and Communication: Queues are essential for inter-thread communication and synchronization in multi-threaded applications.
 *
 * Queue in Programming Languages:
 * - Queue Data Structures: Programming languages provide built-in queue data structures, such as Queue in Python or Queue in Java.
 * - Message Queues in Distributed Systems: Message queues facilitate communication between distributed components in large-scale systems.
 * - Multi-threading and Concurrency: In multi-threading, queues are used to manage work items and ensure proper synchronization.
 *
 * Challenges and Considerations:
 * - Queue Overflow: A queue overflow can occur when too many items are enqueued, leading to potential data loss. Managing queue size is essential.
 * - Choosing the Right Data Structure: While queues are excellent for specific use cases, it's essential to choose the right data structure for the task at hand.
 */

class Queue {
  constructor() {
    this.elements = [];
  }

  /**
   * Enqueues an element to the back of the queue.
   * @param {any} element - The element to be enqueued.
   */
  enqueue(element) {
    return this.elements.push(element);
  }

  /**
   * Dequeues and returns the front element from the queue.
   * @returns {any} - The front element of the queue.
   */
  dequeue() {
    return this.elements.shift();
  }

  /**
   * Views the front element of the queue without removing it.
   * @returns {any} - The front element of the queue.
   */
  front() {
    return this.elements[0];
  }

  /**
   * Views the rear element of the queue without removing it.
   * @returns {any} - The rear element of the queue.
   */
  rear() {
    return this.elements[this.size() - 1];
  }

  /**
   * Returns the number of elements in the queue.
   * @returns {number} - The size of the queue.
   */
  size() {
    return this.elements.length;
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} - True if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this.elements.length === 0;
  }
}

/**
 * Dequeue Data Structure (Double-Ended Queue)
 * Extends the basic Queue with additional methods.
 */
class Dequeue extends Queue {
  /**
   * Removes and returns the rear element from the queue.
   * @returns {any} - The rear element of the queue.
   */
  pop() {
    return this.elements.pop();
  }
}

/**
 * Priority Queue Data Structure
 * Extends the basic Queue with a priority-based dequeue method.
 */
class PriorityQueue extends Queue {
  /**
   * Removes and returns the element with the highest priority.
   * @returns {any} - The element with the highest priority.
   */
  dequeue() {
    let highestPriority = this.front();

    for (let i = 0; i < this.size(); i++) {
      if (this.elements[i].priority > highestPriority.priority) {
        highestPriority = i;
      }
    }

    return this.elements.splice(highestPriority, 1);
  }
}

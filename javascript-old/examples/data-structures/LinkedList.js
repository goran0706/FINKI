/* 
  * What is a LinkedList?
  A LinkedList is a linear data structure consisting of a sequence of elements where each element points to the next one. 
  LinkedLists can be used to represent various types of data structures, including lists, stacks, and queues.

  * Key Characteristics
  - Dynamic Size: LinkedLists can grow or shrink as needed.
  - Efficient Insertions and Deletions: Adding or removing elements is often efficient.
  - No Wasted Memory: Memory is allocated as elements are added.

  * Basic Operations
  - Insertion - Insertion operations include adding elements to the beginning, middle, or end of the list.
  - Deletion - Deletion operations remove elements from the list.
  - Search -  Search operations involve finding a specific element within the list.
  - Traversal - Traversal involves visiting each element in the list to perform a specific operation.

  * Common Types of LinkedLists
  - Singly LinkedList - A singly LinkedList consists of nodes where each node has data and a reference to the next node.
  - Doubly LinkedList - A doubly LinkedList is similar to a singly LinkedList but includes a reference to the previous node as well.
  - Circular LinkedList - A circular LinkedList connects the tail node to the head node, creating a closed loop.

  * Advantages and Disadvantages
  - Advantages: Dynamic size, efficient insertions and deletions, no wasted memory.
  - Disadvantages: Inefficient random access, extra memory for storing references.
  
  * Implementing a LinkedList
  - Using Classes / objects

  * Time Complexity
  - Insertion: O(1) to O(n) depending on the location of insertion.
  - Deletion: O(1) to O(n) depending on the location of deletion.
  - Search: O(n) in the worst case.

  * Use Cases
  - Dynamic Data Structures: LinkedLists are used to implement dynamic data structures like stacks and queues.
  - Memory Management: Operating systems use LinkedLists to manage memory.
  - Undo/Redo Functionality: Text editors and applications use LinkedLists to implement undo and redo functionality.
  - Hash Tables and Collision Handling: LinkedLists are used to handle collisions in hash tables.

  * Advanced Concepts
  - Sentinel Nodes - Sentinel nodes can be added to the LinkedList to simplify operations and reduce edge cases.
  - Skip Lists Skip Lists are a type of data structure that uses multiple layers of LinkedLists for efficient searching.
  - Self-adjusting Lists - Self-adjusting lists reorder themselves for efficient access to frequently used elements.

  * Tips and Best Practices
  - Implement proper error handling for edge cases.
  - Pay attention to memory management, especially when deleting elements.

  * Applications
  - Text Editors: LinkedLists are used for managing undo/redo functionality and navigating text.
  - Music and Video Playlists: Media players use LinkedLists to manage playlists.
  - Symbol Tables in Compilers: Compilers use LinkedLists to manage symbol tables for efficient variable lookup.
  - Cache Systems: Cache systems use LinkedLists for managing recently accessed data.

  * Challenges and Considerations
  - LinkedLists can introduce memory overhead due to storing references.
  - Efficient operations may require careful design to minimize traversal.
*/
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  insert(target, data) {
    const newNode = new Node(data);
    const current = this.find(target);
    if (current) {
      newNode.next = current.next;
      current.next = newNode;
    } else {
      throw new Error("Target not found in the list.");
    }
  }

  remove(data) {
    if (!this.head) {
      return; // List is empty, nothing to remove.
    }

    if (this.head.data === data) {
      this.head = this.head.next; // Remove the head node.
    } else {
      const previous = this.findPrevious(data);
      if (previous && previous.next) {
        previous.next = previous.next.next;
      }
    }
  }

  find(data) {
    let currNode = this.head;
    while (currNode && currNode.data !== data) {
      currNode = currNode.next;
    }
    return currNode;
  }

  findPrevious(data) {
    let currNode = this.head;
    while (currNode && currNode.next && currNode.next.data !== data) {
      currNode = currNode.next;
    }
    return currNode;
  }

  isEmpty() {
    return this.head === null;
  }

  size() {
    let count = 0;
    let current = this.head;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }

  display() {
    const elements = [];
    let current = this.head;
    while (current) {
      elements.push(current.data);
      current = current.next;
    }
    console.log(elements.join(" -> "));
  }
}

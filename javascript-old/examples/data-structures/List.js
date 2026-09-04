/* 
  * Definition
  The List Abstract Type (List ADT) is a fundamental concept in computer science and data structures, providing a high-level interface for a list data structure.
  A list is an ordered sequence of data. Each data item stored in a list is called an element. 
  In JavaScript, the elements of a list can be of any data type.
  Lists are especially useful if we don’t have to perform searches on the items in the list or put them into some type of sorted order. 
  When we need to perform long searches or complex sorts, lists become less useful, especially with more complex data structures.

  * Properties and Characteristics of List ADT
  - Ordered Collection: Lists are ordered collections of elements where each element has a specific position or index within the list.
  - Variable Size: Lists can dynamically grow or shrink, meaning the size of a list is not fixed and can change over time.
  - Heterogeneous Data: Elements in a list can be of different data types, offering flexibility in storing various kinds of data.
  - Linear Access: Elements are accessed sequentially in a list, making it suitable for operations like iteration.
  - Indexing: Elements in a list can typically be accessed by their index, starting from 0 for the first element.

  * Common Operations and Methods in a list ADT
  - Append (Add): Add an element to the end of the list.
  - Insert: Insert an element at a specific position in the list.
  - Remove: Remove an element from the list at a specified index.
  - Get (Access): Retrieve the element at a given index.
  - Search: Find the index of a specific element in the list.
  - Size (Length): Get the number of elements in the list.
  - Empty (Is Empty): Check if the list is empty.
  - Clear (Empty the List): Remove all elements from the list.
  - Iterate (Traverse): Iterate through the elements in the list.
  - Concatenate (Join): Combine two lists into a single list.
  - Copy (Clone): Create a new list with the same elements as the original.
  - Slice (SubList): Extract a portion of the list based on start and end indices.
  - Sort: Arrange the elements in the list in a specific order.
  - Reverse: Reverse the order of elements in the list.
  - Count (Occurrences): Count how many times a specific element appears in the list.
  - Extend (Append Multiple Elements): Add multiple elements to the end of the list.
  - Pop (Remove and Return): Remove and return an element from a specific position.
  - Index (Find Position): Find the position of the first occurrence of a specific element.
  - Min (Minimum Element): Find the minimum element in the list.
  - Max (Maximum Element): Find the maximum element in the list.

  * Implementations
  Lists can be instantiated using a variety of data structures, with each approach influencing the performance of list operations. 
  Prominent implementations include dynamic arrays, linked lists, and double-ended queues (Dequeues), each offering a unique balance of strengths and trade-offs.

  * Time Complexities
  The efficiency of list operations hinges upon the underlying implementation. 
  - Dynamic arrays typically offer O(1) time complexity for random access but may require O(n) for middle insertions and deletions. 
  - In contrast, linked lists guarantee O(1) time complexity for insertions and deletions but may incur O(n) for random access. 
  - Dequeues strike a balance between these two paradigms, providing an efficient compromise.

  In summary, lists stand as an essential, flexible, and versatile data structure that offers an ordered collection of elements. 
*/

class List {
  constructor() {
    this.elements = [];
    this.pos = 0;
  }

  // Internal helper functions
  #validatePosition(position) {
    if (this.#isPositionInvalid(position)) {
      throw new Error("Invalid position");
    }
  }

  #isPositionInvalid(position) {
    return position < 0 || position >= this.elements.length;
  }

  // Append an element to the end of the list
  append(element) {
    this.elements.push(element);
  }

  // Insert an element at a specific position in the list
  insert(position, element) {
    this.#validatePosition(position);
    this.elements.splice(position, 0, element);
  }

  // Remove an element at a specific position
  remove(position) {
    this.#validatePosition(position);
    this.elements.splice(position, 1);
  }

  // Get an element at a specific position
  get(position) {
    this.#validatePosition(position);
    return this.elements[position];
  }

  // Get the current element based on position
  getCurrentElement() {
    return this.elements[this.pos];
  }

  // Get the current position
  getCurrentPosition() {
    return this.pos;
  }

  // Get the number of elements in the list
  size() {
    return this.elements.length;
  }

  // Check if the list is empty
  isEmpty() {
    return this.elements.length === 0;
  }

  // Clear the list (remove all elements)
  clear() {
    this.elements = [];
  }

  // Iterate through the elements in the list
  forEach(callback) {
    this.elements.forEach(callback);
  }

  // Find the position of the first occurrence of a specific element.
  find(element) {
    return this.elements.indexOf(element);
  }

  // Get the first element in the list
  front() {
    return this.elements[0];
  }

  // Get the last element in the list
  rear() {
    return this.elements[this.size() - 1];
  }

  // Traverse the list, move to the previous element in the list
  prev() {
    if (this.pos > 0) {
      this.pos--;
    }
  }

  // Traverse the list, move to the next element in the list
  next() {
    if (this.pos < this.size() - 1) {
      this.pos++;
    }
  }

  moveTo(position) {
    this.#validatePosition(position);
    this.pos = position;
  }
}

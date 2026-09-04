/* 
  * What is a Dictionary?
  A dictionary is a data structure that stores a collection of key-value pairs. 
  Each key is unique within the dictionary and maps to a specific value. Dictionaries provide efficient methods to store, retrieve, update, and delete key-value pairs. 
  Keys can be of various data types, including strings, numbers, and objects, depending on the programming language or data structure.
  Dictionary data structures consist of key-value pairs, enabling efficient mapping and retrieval of data.

  * Key Characteristics
  - Key-Value Pairs: Dictionaries consist of key-value associations where each key maps to a unique value.
  - Unique Keys: Keys within a dictionary are unique, ensuring that each key corresponds to a single value.
  - Fast Access: Dictionaries offer rapid retrieval of values based on their associated keys.
  - Dynamic Size: The size of a dictionary can change over time as key-value pairs are added or removed.
  - Heterogeneous Data: Keys and values in a dictionary can have different data types.
  - Associative Relationship: Dictionaries establish an associative relationship between keys and values.
  
  * Basic Operations
  - Insertion - Insert: Add a new key-value pair to the dictionary.
  - Deletion - Delete: Remove a key-value pair from the dictionary based on its key.
  - Search - Search: Find the value associated with a specific key.
  - Update - Update: Modify the value associated with a key.
  - Size - Size: Determine the number of key-value pairs in the dictionary.
  - Existence Check - Existence Check: Verify if a key exists in the dictionary.
  
  * Common Types of Dictionaries
  - Hash Table - Hash Table: Utilizes a hash function to map keys to indices in an array, offering efficient average-case time complexity for operations.
  - Tree Map - Tree Map: Implements dictionaries using self-balancing binary search trees, such as AVL trees or Red-Black trees, providing guaranteed logarithmic time complexity.
  - Trie - Trie: Specialized dictionary structure for strings that allows for efficient prefix-based searches and storage.
  - Skip List - Skip List: Offers a probabilistic data structure for dictionaries that allows for efficient searching and modification with probabilistic guarantees.
  
  * Advantages and Disadvantages
  * Advantages
  - Efficient Retrieval: Dictionaries enable rapid access to values associated with keys.
  - Dynamic Size: They can dynamically grow or shrink to accommodate changing data.
  - Unique Keys: Ensure that each key is unique within the dictionary.
  
  * Disadvantages
  - Memory Overhead: Storing key-value pairs may consume extra memory.
  - Complexity: Hash collisions or tree balancing can introduce additional complexity.
  - Hashing Considerations: Hash function quality and distribution affect performance.
  
  * Implementing Dictionaries
  - Using Hash Tables - Hash Table: Implements dictionaries using a hash function to map keys to indices in an array.
  - Using Trees - Tree-Based Dictionary: Utilizes a self-balancing binary search tree, such as AVL or Red-Black tree, for dictionary operations.
  - Using Tries - Trie Dictionary: Specialized data structure for dictionaries with string keys, facilitating prefix-based searches.

  * Time Complexity
  - Average and Worst-Case Time Complexities
  - Average Time Complexity: Time complexity for dictionary operations varies based on the implementation. 
    Hash tables offer O(1) average time complexity, while trees provide O(log n) or O(n) time complexity.
  - Worst-Case Time Complexity: In rare cases, dictionary operations may incur worst-case scenarios with performance degradation.
  
  * Use Cases
  - Database Indexing: Dictionaries play a crucial role in database systems, where keys are often attributes and values are records or objects.
  - Caching Systems: Used to cache frequently accessed data to reduce latency and enhance performance.
  - Symbol Tables in Compilers: Dictionaries are used to manage variables, functions, and other symbols during code compilation.
  - Configurations and Settings: Store configuration parameters and application settings with corresponding values.
  - Counting and Aggregation: Dictionaries can accumulate counts and perform aggregation operations.
  
  * Advanced Concepts
  - Collision Resolution: Techniques to address hash collisions, such as chaining or open addressing, in hash table implementations.
  - Load Factor and Rehashing: Strategies for maintaining hash table efficiency by resizing it dynamically based on load factor.
  - Self-Balancing Trees: Binary search trees are kept balanced to ensure logarithmic time complexity for search operations.
  - Ternary Search Tries: A variant of tries optimized for handling strings.

  * Tips and Best Practices
  - Proper Error Handling: Implement robust error handling for edge cases, such as key not found or dictionary full.
  - Choosing the Right Data Structure: Consider the problem requirements and choose between hash tables, trees, or tries based on performance characteristics.
  - Memory Considerations: Manage memory efficiently, especially when dealing with large dictionaries.
  
  * Applications
  - Databases: Central to database systems for indexing and retrieving records based on attributes.
  - Caching Systems: Used to cache frequently accessed data and reduce the load on backend servers.
  - Language Interpreters: Assist interpreters in managing symbols, functions, and variables during code execution.
  - Network Protocols: Employed in network protocols to map request and response data.
  
  * Challenges and Considerations
  - Hash Function Design: Creating effective hash functions for uniform key distribution.
  - Performance Trade-offs: Balancing speed, memory, and other factors when selecting a dictionary implementation.
  - Memory Efficiency: Managing memory consumption, especially for large dictionaries.
*/

class Dictionary {
  constructor() {
    this.dictionary = {};
  }

  add(key, value) {
    this.dictionary[key] = value;
  }

  remove(key) {
    if (key in this.dictionary) {
      delete this.dictionary[key];
      return true;
    }
    return false;
  }

  clear() {
    this.dictionary = {};
  }

  count() {
    return Object.keys(this.dictionary).length;
  }

  get(key) {
    if (key in this.dictionary) {
      return this.dictionary[key];
    }
    return undefined; // Return undefined when the key is not found.
  }

  has(key) {
    return key in this.dictionary;
  }

  showAll() {
    for (const key in this.dictionary) {
      console.log(`${key}: ${this.dictionary[key]}`);
    }
  }
}

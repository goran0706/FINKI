/* 

  * What is a Hash Table?
  A hash table is a data structure that stores data in an associative manner. It uses a hash function to map keys to specific values. 
  The primary idea behind a hash table is that it enables fast data retrieval and storage by minimizing the need for iterative searches.

  * Key Characteristics
  - Key-Value Pairs: Hash tables consist of key-value pairs, where each key maps to a unique value.
  - Unique Keys: Keys within a hash table are unique, ensuring that each key corresponds to a single value.
  - Fast Access: Hash tables offer rapid retrieval of values based on their associated keys.
  - Dynamic Size: The size of a hash table can change over time as key-value pairs are added or removed.
  
  * Basic Operations
  - Insertion: Insert a new key-value pair into the hash table.
  - Deletion: Remove a key-value pair from the hash table based on its key.
  - Search: Find the value associated with a specific key.
  - Update: Modify the value associated with a key.

  * Components of a Hash Table
  - Hash Function - A hash function is a crucial component of a hash table. It takes an input (or "key") and returns an index within the range of possible indices for the hash table. A good hash function should distribute keys uniformly across the available indices, minimizing collisions.
  - Buckets (or Slots) - A hash table is composed of "buckets" or "slots," each of which can hold multiple key-value pairs. The number of buckets directly impacts the performance of the hash table.
  - Collision Handling - Collisions occur when two different keys hash to the same index in the hash table. There are various techniques for handling collisions, including open addressing and separate chaining.

  * Hashing Techniques
  - Division Method - The division method uses the modulo operation to compute the hash index. It is simple but may result in clustering if not implemented correctly.
  - Multiplication Method - The multiplication method applies a mathematical operation involving multiplication and the fractional part of the key. It offers better distribution than the division method.
  - Universal Hashing - Universal hashing uses a family of hash functions and randomly selects one to compute the hash index. This approach minimizes the probability of collisions.
  - Cryptographic Hash Functions - Cryptographic hash functions are designed for security but are also used in hash tables. They generate unique hash values for different inputs.

  * Common Types of Hash Tables
  - Open Addressing - In open addressing, collisions are resolved by finding the next available slot in the table. Linear probing, quadratic probing, and double hashing are popular open addressing methods.
  - Separate Chaining - Separate chaining addresses collisions by allowing multiple key-value pairs to exist in the same bucket. Each bucket contains a data structure (often a linked list) to manage these pairs.
  - Cuckoo Hashing - Cuckoo hashing is a technique where each key is hashed to two separate locations. If a collision occurs, it triggers a recursive rehashing process.

  * Implementing HashTable
  - Using an array for storing key-value pairs.
  - Using an object for storing key-value pairs is more efficient and idiomatic in JavaScript. Objects provide constant-time (O(1)) access time for retrieving values based on keys.

  * Advantages and Disadvantages
  * Advantages
  - Fast Access: Hash tables provide constant-time (O(1)) access to values.
  - Unique Keys: Each key is unique within the table, ensuring no duplicate keys.
  - Dynamic Size: Hash tables can grow or shrink as data changes.

  * Disadvantages
  - Memory Overhead: Hash tables consume extra memory to store indices.
  - Complexity: Hash collisions or un-optimized hash functions can add complexity.
  - Hashing Considerations: The quality of the hash function impacts performance.
*/

class HashTable {
  constructor(size = 100) {
    this.size = size; // The number of buckets
    this.buckets = new Array(this.size);
  }

  // A basic hash function
  hash(key) {
    let hashValue = 0;
    for (const char of key) {
      hashValue += char.charCodeAt(0);
    }
    return hashValue % this.size;
  }

  // Insert a key-value pair into the hash table
  insert(key, value) {
    const index = this.hash(key);
    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }
    this.buckets[index].push({ key, value });
  }

  // Remove a key-value pair from the hash table
  remove(key) {
    const index = this.hash(key);
    if (!this.buckets[index]) {
      return false;
    }
    const newBucket = this.buckets[index].filter((pair) => pair.key !== key);
    this.buckets[index] = newBucket;
    return true;
  }

  // Retrieve a value associated with a key
  get(key) {
    const index = this.hash(key);
    if (!this.buckets[index]) {
      return undefined;
    }
    for (const pair of this.buckets[index]) {
      if (pair.key === key) {
        return pair.value;
      }
    }
    return undefined;
  }

  // Check if a key exists in the hash table
  contains(key) {
    const index = this.hash(key);
    if (!this.buckets[index]) {
      return false;
    }
    for (const pair of this.buckets[index]) {
      if (pair.key === key) {
        return true;
      }
    }
    return false;
  }

  // Get an array of all keys in the hash table
  keys() {
    const allKeys = [];
    for (const bucket of this.buckets) {
      if (bucket) {
        for (const pair of bucket) {
          allKeys.push(pair.key);
        }
      }
    }
    return allKeys;
  }
}

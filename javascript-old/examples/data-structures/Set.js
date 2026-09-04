/**
 * What is a Set?
 * A set is a data structure that stores a collection of unique elements. Sets are designed to efficiently perform operations related to membership, intersection, union, and difference.
 *
 * Key Characteristics:
 * - Uniqueness: Sets do not allow duplicate elements.
 * - No Particular Order: Elements are not stored in any specific order.
 * - Fast Lookup: Sets provide fast membership testing.
 *
 * Basic Operations:
 * - Insertion: Insertion operations add an element to the set.
 * - Deletion: Deletion operations remove an element from the set.
 * - Search: Search operations check if an element is a member of the set.
 * - Size: The size operation returns the number of elements in the set.
 *
 * Common Types of Sets:
 * - Unordered Set: An unordered set does not maintain any specific order of elements.
 * - Ordered Set: An ordered set maintains elements in a specific order, such as insertion order or lexicographic order.
 *
 * Advantages and Disadvantages:
 * - Advantages: Efficient membership testing, elimination of duplicates, set operations.
 * - Disadvantages: No indexing, unordered nature may not suit all use cases.
 *
 * Implementing a Set:
 * - Using Arrays
 *
 * Time Complexity:
 * - Insertion: O(1) to O(n) depending on data structure used.
 * - Deletion: O(1) to O(n) depending on data structure used.
 * - Search: O(1) to O(n) depending on data structure used.
 *
 * Use Cases:
 * - Eliminating Duplicates: Sets are useful for removing duplicates from a collection of elements.
 * - Checking for Membership: Efficiently check if an element is present in a collection.
 * - Counting Unique Elements: Count the number of unique elements in a collection.
 * - Set Operations (Union, Intersection, Difference): Combine, intersect, or find the difference between sets.
 *
 * Advanced Concepts:
 * - Multi-Sets: Multi-sets allow duplicate elements, but they maintain the count of each element.
 * - Immutable Sets: Immutable sets do not allow modifications after creation and are useful in functional programming.
 * - Set-Based Data Structures: Data structures like Bloom Filters and HyperLogLog are based on sets and are used for approximate set membership testing and cardinality estimation.
 *
 * Tips and Best Practices:
 * - Implement proper error handling for edge cases.
 * - Consider the problem requirements to choose between ordered and unordered sets.
 *
 * Applications:
 * - Unique Identifier Storage: Sets can store unique identifiers in databases and distributed systems.
 * - Database Query Optimization: Query planners use sets for various operations in database systems.
 * - Constraint Satisfaction Problems: Solvers for CSPs use sets to manage domains and constraints.
 * - Set Theory in Mathematics: Sets are fundamental in mathematics for modeling relationships between elements.
 *
 * Challenges and Considerations:
 * - Space Complexity: Sets may consume significant memory.
 * - Hashing Collisions: Hash-based set implementations can have collision issues.
 */

class Set {
  constructor() {
    this.elements = [];
  }

  /**
   * Adds an element to the set if it's not already present.
   * @param {any} element - The element to be added.
   * @returns {boolean} - True if the element was added, false if it already exists in the set.
   */
  add(element) {
    if (this.elements.indexOf(element) < 0) {
      this.elements.push(element);
      return true;
    }
    return false;
  }

  /**
   * Deletes an element from the set if it exists.
   * @param {any} element - The element to be deleted.
   * @returns {boolean} - True if the element was deleted, false if it does not exist in the set.
   */
  delete(element) {
    const position = this.elements.indexOf(element);
    if (position > -1) {
      this.elements.splice(position, 1);
      return true;
    }
    return false;
  }

  /**
   * Checks if an element is a member of the set.
   * @param {any} element - The element to be checked.
   * @returns {boolean} - True if the element is in the set, false otherwise.
   */
  has(element) {
    return this.elements.includes(element);
  }

  /**
   * Returns the number of elements in the set.
   * @returns {number} - The size of the set.
   */
  size() {
    return this.elements.length;
  }

  /**
   * Computes the union of this set with another set.
   * @param {Set} set - The other set.
   * @returns {Set} - The union set.
   */
  union(set) {
    const unionSet = new Set();
    this.elements.forEach((element) => unionSet.add(element));
    set.elements.forEach((element) => unionSet.add(element));
    return unionSet;
  }

  /**
   * Computes the intersection of this set with another set.
   * @param {Set} set - The other set.
   * @returns {Set} - The intersection set.
   */
  intersection(set) {
    const intersectionSet = new Set();
    this.elements.forEach((element) => {
      if (set.has(element)) {
        intersectionSet.add(element);
      }
    });
    return intersectionSet;
  }

  /**
   * Computes the set difference (this set - another set).
   * @param {Set} set - The other set.
   * @returns {Set} - The difference set.
   */
  difference(set) {
    const differenceSet = new Set();
    this.elements.forEach((element) => {
      if (!set.has(element)) {
        differenceSet.add(element);
      }
    });
    return differenceSet;
  }

  /**
   * Checks if this set is a subset of another set.
   * @param {Set} set - The other set.
   * @returns {boolean} - True if this set is a subset of the other set, false otherwise.
   */
  subset(set) {
    return this.elements.every((element) => set.has(element));
  }
}

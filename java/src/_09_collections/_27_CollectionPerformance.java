package _09_collections;

import java.util.*;

public class _27_CollectionPerformance {

    static void main(String[] args) {

        // Collection performance depends on the implementation,
        // operation, data size, and distribution of elements.
        //
        // Big O describes how operation cost grows with collection size.
        // These are typical complexities, not guarantees for every situation.

        // 1. ArrayList
        // Backed by a resizable array.
        //
        // get(index):       O(1)
        // set(index):       O(1)
        // add(element):     amortized O(1)
        // add(index, value): O(n)
        // remove(index):    O(n) because later elements may shift.

        List<Integer> arrayList = new ArrayList<>();

        arrayList.add(10);
        arrayList.add(20);
        arrayList.add(30);

        System.out.println("ArrayList element: " + arrayList.get(1));

        arrayList.add(1, 15);

        System.out.println("ArrayList after insertion: " + arrayList);

        // 2. LinkedList
        // Doubly linked list implementation of List and Deque.
        //
        // get(index):       O(n)
        // add/remove at ends: O(1)
        // add/remove using a known ListIterator position: O(1)
        // Searching for an element: O(n)

        LinkedList<Integer> linkedList = new LinkedList<>();

        linkedList.add(10);
        linkedList.add(20);
        linkedList.add(30);

        linkedList.addFirst(5);
        linkedList.addLast(40);

        System.out.println("\nLinkedList: " + linkedList);
        System.out.println("LinkedList element: " + linkedList.get(2));

        // Although insertion after reaching a position is O(1),
        // finding that position can take O(n).

        // 3. HashMap
        // Expected O(1) get(), put(), and remove() with good hash distribution.
        // Performance can degrade with collisions and expensive hashCode()/equals().

        Map<Integer, String> hashMap = new HashMap<>();

        hashMap.put(101, "Alice");
        hashMap.put(102, "Bob");

        System.out.println("\nHashMap lookup: " + hashMap.get(101));

        // 4. TreeMap
        // Balanced search tree.
        // get(), put(), and remove(): O(log n).
        // Supports sorted keys and range queries.

        TreeMap<Integer, String> treeMap = new TreeMap<>();

        treeMap.put(103, "Charlie");
        treeMap.put(101, "Alice");
        treeMap.put(102, "Bob");

        System.out.println("TreeMap: " + treeMap);
        System.out.println("First key: " + treeMap.firstKey());

        // 5. TreeSet
        // add(), contains(), and remove(): O(log n).
        // Maintains elements in sorted order.

        TreeSet<Integer> treeSet = new TreeSet<>();

        treeSet.add(30);
        treeSet.add(10);
        treeSet.add(20);

        System.out.println("\nTreeSet: " + treeSet);
        System.out.println("Contains 20: " + treeSet.contains(20));

        // 6. ArrayDeque
        // Resizable-array implementation of Deque.
        // Adding and removing at either end are amortized O(1).
        // Usually a good choice for stack and queue operations.

        ArrayDeque<Integer> deque = new ArrayDeque<>();

        deque.addFirst(20);
        deque.addFirst(10);
        deque.addLast(30);

        System.out.println("\nArrayDeque: " + deque);

        System.out.println("Removed first: " + deque.removeFirst());
        System.out.println("Removed last: " + deque.removeLast());

        // Typical operation complexity summary:
        //
        // Operation              ArrayList   LinkedList   HashMap   TreeMap
        // ----------------------------------------------------------------
        // Access by index        O(1)        O(n)         N/A       N/A
        // Search by value        O(n)        O(n)         N/A       N/A
        // Add at end             amort. O(1) O(1)         N/A       N/A
        // Insert at known index  O(n)        O(1)*        N/A       N/A
        // Lookup by key          N/A         N/A          O(1)*     O(log n)
        //
        // * LinkedList insertion is O(1) after reaching the position.
        // * HashMap operations are expected O(1) under suitable conditions.
        //
        // Memory considerations:
        // - ArrayList stores elements in a contiguous backing array.
        // - LinkedList stores each element in a node with link references.
        // - HashMap maintains a table and additional entry metadata.
        // - TreeMap maintains tree nodes and ordering information.
        //
        // Practical guidance:
        // - Prefer ArrayList for general-purpose Lists and frequent indexed access.
        // - Use ArrayDeque for stack and queue operations.
        // - Use HashMap for key-value lookup without sorted-key requirements.
        // - Use TreeMap or TreeSet when sorted ordering and range operations matter.
        //
        // Benchmark real workloads with JMH rather than relying only on
        // small ad hoc timing loops, which are easily distorted by the JVM.
    }
}
package _09_collections;

import java.util.*;

public class _28_ChoosingTheRightCollection {

    static void main(String[] args) {

        // Choose a collection based on the operations and guarantees required,
        // rather than selecting one implementation for every situation.

        // 1. List: ordered elements, duplicates allowed, index-based access.
        List<String> tasks = new ArrayList<>();

        tasks.add("Review requirements");
        tasks.add("Implement feature");
        tasks.add("Review requirements");

        System.out.println("Tasks: " + tasks);
        System.out.println("First task: " + tasks.get(0));

        // ArrayList is the usual default for List.
        // Choose LinkedList only when its specific operations justify its
        // additional memory cost and typically slower traversal.

        // 2. Set: unique elements.
        Set<String> usernames = new HashSet<>();

        usernames.add("alice");
        usernames.add("bob");
        usernames.add("alice");

        System.out.println("\nUnique usernames: " + usernames);

        // HashSet: uniqueness without guaranteed iteration order.
        // LinkedHashSet: uniqueness with insertion-order iteration.
        // TreeSet: uniqueness with sorted iteration.

        Set<Integer> insertionOrderedIds = new LinkedHashSet<>(
                List.of(30, 10, 20, 10)
        );

        NavigableSet<Integer> sortedIds = new TreeSet<>(
                List.of(30, 10, 20, 10)
        );

        System.out.println("Insertion order: " + insertionOrderedIds);
        System.out.println("Sorted order: " + sortedIds);

        // 3. Map: key-value associations.
        Map<Integer, String> employees = new HashMap<>();

        employees.put(101, "Alice");
        employees.put(102, "Bob");
        employees.put(101, "Alex");

        System.out.println("\nEmployees: " + employees);

        // HashMap: general-purpose key-value lookup.
        // LinkedHashMap: predictable insertion or access order.
        // TreeMap: keys maintained in sorted order.

        Map<Integer, String> orderedEmployees = new LinkedHashMap<>();
        orderedEmployees.put(102, "Bob");
        orderedEmployees.put(101, "Alice");

        NavigableMap<Integer, String> sortedEmployees = new TreeMap<>();
        sortedEmployees.put(102, "Bob");
        sortedEmployees.put(101, "Alice");

        System.out.println("Insertion-ordered map: " + orderedEmployees);
        System.out.println("Sorted map: " + sortedEmployees);

        // TreeMap and TreeSet also support range and navigation operations.
        System.out.println("First employee ID: " + sortedEmployees.firstKey());
        System.out.println("IDs below 102: " + sortedEmployees.headMap(102));

        // 4. Queue: process elements in FIFO order when using ordinary
        // offer(), poll(), and peek() operations.
        Queue<String> jobs = new ArrayDeque<>();

        jobs.offer("Generate report");
        jobs.offer("Send notification");
        jobs.offer("Archive records");

        System.out.println("\nNext job: " + jobs.peek());
        System.out.println("Processed job: " + jobs.poll());
        System.out.println("Remaining jobs: " + jobs);

        // ArrayDeque is a good default for FIFO queues.
        // LinkedList also implements Queue, but usually has higher
        // per-element memory overhead.

        // 5. PriorityQueue: retrieve the highest-priority element according
        // to natural ordering or a supplied Comparator.
        Queue<Integer> priorities = new PriorityQueue<>();

        priorities.offer(30);
        priorities.offer(10);
        priorities.offer(20);

        System.out.println("\nHighest-priority value: " + priorities.peek());

        while (!priorities.isEmpty()) {
            System.out.println("Next priority: " + priorities.poll());
        }

        // PriorityQueue iteration is not guaranteed to be sorted.
        // Repeatedly poll() to retrieve elements in priority order.

        // 6. Deque: insertion and removal at both ends.
        ArrayDeque<String> history = new ArrayDeque<>();

        history.push("Page A");
        history.push("Page B");

        System.out.println("\nCurrent page: " + history.peek());
        System.out.println("Back to: " + history.pop());

        // ArrayDeque is generally preferred over the legacy Stack class
        // for stack behavior.

        // 7. Immutable collection: use factory methods when callers should
        // not be able to modify the collection.
        List<String> supportedRoles = List.of("ADMIN", "MANAGER", "EMPLOYEE");

        System.out.println("\nSupported roles: " + supportedRoles);

        // List.of(), Set.of(), and Map.of() create unmodifiable collections.
        // They reject null elements, keys, and values.
        // Unmodifiable collections are not necessarily deeply immutable
        // if their elements are mutable objects.

        // Quick selection guide:
        //
        // Requirement                              Typical choice
        // ----------------------------------------------------------------
        // Ordered elements, duplicates, indexing   ArrayList
        // Unique elements, fast expected lookup    HashSet
        // Unique elements, insertion order         LinkedHashSet
        // Unique elements, sorted order            TreeSet
        // Key-value lookup                         HashMap
        // Key-value mappings, insertion order      LinkedHashMap
        // Key-value mappings, sorted keys          TreeMap
        // FIFO queue                               ArrayDeque
        // Stack (LIFO)                             ArrayDeque
        // Priority-based retrieval                 PriorityQueue
        // Sorted range queries                     TreeMap / TreeSet
        //
        // Thread safety:
        // Most common collection implementations are not thread-safe.
        // Choose an appropriate concurrent collection or synchronization
        // strategy when multiple threads access shared mutable state.
        //
        // Do not choose based on Big O alone. Consider ordering, duplicates,
        // null handling, memory usage, concurrency, and actual access patterns.
    }
}
package _09_collections;

import java.util.*;

public class _01_CollectionOverview {

    static void main(String[] args) {

        // The Java Collections Framework provides interfaces and implementations
        // for storing, retrieving, and manipulating groups of objects.

        // Collection is the root interface for List, Set, and Queue.
        // Map belongs to the framework but does not extend Collection.

        Collection<String> collection = new ArrayList<>();
        collection.add("Alice");
        collection.add("Bob");
        collection.add("Charlie");

        System.out.println("Collection: " + collection);

        // List preserves insertion order and allows duplicate elements.
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Alice");

        System.out.println("List: " + names);
        System.out.println("First element: " + names.get(0));

        // Set stores unique elements.
        // HashSet does not guarantee iteration order.
        Set<String> uniqueNames = new HashSet<>();
        uniqueNames.add("Alice");
        uniqueNames.add("Bob");
        uniqueNames.add("Alice");

        System.out.println("Set: " + uniqueNames);
        System.out.println("Unique name count: " + uniqueNames.size());

        // Queue represents elements waiting to be processed.
        // LinkedList is one implementation of Queue.
        Queue<String> tasks = new java.util.LinkedList<>();
        tasks.offer("Task A");
        tasks.offer("Task B");
        tasks.offer("Task C");

        System.out.println("Queue: " + tasks);
        System.out.println("Next task: " + tasks.peek());
        System.out.println("Processed task: " + tasks.poll());
        System.out.println("Remaining tasks: " + tasks);

        // Map stores key-value pairs.
        // Keys are unique; values may be duplicated.
        Map<Integer, String> employees = new HashMap<>();
        employees.put(101, "Alice");
        employees.put(102, "Bob");
        employees.put(103, "Charlie");
        employees.put(101, "Alex"); // Replaces the value for key 101.

        System.out.println("Map: " + employees);
        System.out.println("Employee 101: " + employees.get(101));
        System.out.println("Employee count: " + employees.size());

        // Common operations are defined by collection interfaces.
        System.out.println("Contains Bob: " + names.contains("Bob"));

        names.remove("Bob");
        System.out.println("After removal: " + names);

        // Collections store objects, not primitive values directly.
        // Autoboxing converts int to Integer automatically.
        List<Integer> numbers = new ArrayList<>();
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        int total = 0;

        for (int number : numbers) {
            total += number;
        }

        System.out.println("Numbers: " + numbers);
        System.out.println("Total: " + total);

        // Program to interfaces rather than concrete implementations.
        // The variable type expresses the operations you need;
        // the implementation determines how those operations are performed.
        List<String> messages = new ArrayList<>();
        messages.add("Collections are reusable data structures.");

        System.out.println(messages);
    }
}
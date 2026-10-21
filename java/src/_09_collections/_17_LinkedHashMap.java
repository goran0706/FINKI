package _09_collections;

import java.util.LinkedHashMap;
import java.util.Map;

public class _17_LinkedHashMap {

    static void main(String[] args) {

        // LinkedHashMap implements Map using a hash table and a linked list.
        // By default, it preserves insertion order.
        // It provides expected O(1) lookup, insertion, and removal.

        Map<Integer, String> employees = new LinkedHashMap<>();

        employees.put(103, "Charlie");
        employees.put(101, "Alice");
        employees.put(102, "Bob");

        System.out.println("Employees: " + employees);

        // Iteration follows insertion order, not key order.
        System.out.println("\nInsertion order:");

        for (Map.Entry<Integer, String> entry : employees.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }

        // Replacing a value does not change its insertion position.
        employees.put(101, "Alex");

        System.out.println("\nAfter replacing key 101: " + employees);

        // Removing and reinserting a key places it at the end.
        employees.remove(103);
        employees.put(103, "Charlie");

        System.out.println("After removing and reinserting key 103: " + employees);

        // LinkedHashMap supports a null key and null values.
        employees.put(null, "Unassigned");
        employees.put(104, null);

        System.out.println("\nAfter adding null mappings: " + employees);

        // LinkedHashMap can also maintain access order.
        // In access-order mode, recently accessed entries move toward the end.
        LinkedHashMap<Integer, String> accessOrderedEmployees =
                new LinkedHashMap<>(16, 0.75f, true);

        accessOrderedEmployees.put(101, "Alice");
        accessOrderedEmployees.put(102, "Bob");
        accessOrderedEmployees.put(103, "Charlie");

        System.out.println("\nBefore access: " + accessOrderedEmployees);

        // Accessing key 101 moves it to the end.
        accessOrderedEmployees.get(101);

        System.out.println("After accessing key 101: " + accessOrderedEmployees);

        // Accessing key 102 moves it to the end.
        accessOrderedEmployees.get(102);

        System.out.println("After accessing key 102: " + accessOrderedEmployees);

        // Access-order LinkedHashMap can be used to build an LRU cache.
        // removeEldestEntry() allows the eldest entry to be removed
        // automatically after a new mapping is inserted.
        LinkedHashMap<Integer, String> cache = new LinkedHashMap<>(16, 0.75f, true) {
            private static final int MAX_ENTRIES = 3;

            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, String> eldest) {
                return size() > MAX_ENTRIES;
            }
        };

        cache.put(1, "A");
        cache.put(2, "B");
        cache.put(3, "C");

        cache.get(1); // Entry 1 becomes most recently accessed.
        cache.put(4, "D"); // Entry 2 is now the least recently used.

        System.out.println("\nLRU cache: " + cache);

        // LinkedHashMap is useful when predictable iteration order matters.
        // Access-order mode is useful for simple LRU-style caching.
        //
        // It uses more memory than HashMap to maintain its linked list.
        // It is not thread-safe by default.
    }
}
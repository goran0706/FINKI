package _09_collections;

import java.util.HashMap;
import java.util.Map;

public class _16_HashMap {

    static void main(String[] args) {

        // HashMap implements Map using a hash table.
        // It provides expected O(1) lookup, insertion, and removal
        // when hash codes are distributed well.

        Map<Integer, String> employees = new HashMap<>();

        // Add key-value mappings.
        employees.put(101, "Alice");
        employees.put(102, "Bob");
        employees.put(103, "Charlie");

        System.out.println("Employees: " + employees);

        // Keys must be unique. Reusing a key replaces its value.
        employees.put(101, "Alex");

        System.out.println("After replacing key 101: " + employees);

        // Retrieve values by key.
        System.out.println("Employee 102: " + employees.get(102));

        // A missing key returns null.
        System.out.println("Missing key: " + employees.get(999));

        // containsKey() distinguishes a missing key from a key
        // explicitly mapped to null.
        employees.put(104, null);

        System.out.println("Contains key 104: " + employees.containsKey(104));
        System.out.println("Value for key 104: " + employees.get(104));
        System.out.println("Contains key 999: " + employees.containsKey(999));

        // HashMap permits one null key and multiple null values.
        employees.put(null, "Unassigned");
        employees.put(105, null);

        System.out.println("\nAfter adding null mappings: " + employees);

        // putIfAbsent() adds a mapping if the key is absent
        // or currently mapped to null.
        employees.putIfAbsent(104, "Diana");

        System.out.println("After putIfAbsent: " + employees);

        // Remove mappings.
        employees.remove(103);
        employees.remove(101, "Alex");

        System.out.println("After removals: " + employees);

        // Iterate through entries to access keys and values together.
        System.out.println("\nEmployee entries:");

        for (Map.Entry<Integer, String> entry : employees.entrySet()) {
            System.out.println(
                    "ID: " + entry.getKey()
                            + ", Name: " + entry.getValue()
            );
        }

        // Iterate through keys.
        System.out.println("\nEmployee IDs:");

        for (Integer id : employees.keySet()) {
            System.out.println(id);
        }

        // Iterate through values.
        System.out.println("\nEmployee names:");

        for (String name : employees.values()) {
            System.out.println(name);
        }

        // computeIfAbsent() calculates a value only when the key
        // is absent or mapped to null.
        employees.computeIfAbsent(106, id -> "Eva");

        // computeIfPresent() updates a non-null existing mapping.
        employees.computeIfPresent(
                102,
                (id, name) -> name.toUpperCase()
        );

        System.out.println("\nAfter compute operations: " + employees);

        // merge() combines a supplied value with an existing non-null value.
        Map<String, Integer> inventory = new HashMap<>();

        inventory.merge("Keyboard", 5, Integer::sum);
        inventory.merge("Keyboard", 3, Integer::sum);
        inventory.merge("Mouse", 2, Integer::sum);

        System.out.println("Inventory: " + inventory);

        // HashMap does not guarantee iteration order.
        // Its performance depends partly on the quality of key hashCode()
        // and equals() implementations.
        //
        // Keys should not be mutated in ways that affect hashCode()
        // or equals() while stored in the map.
        //
        // HashMap is not thread-safe. Use ConcurrentHashMap or another
        // suitable concurrency strategy for shared concurrent access.
    }
}
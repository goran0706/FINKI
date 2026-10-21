package _09_collections;

import java.util.HashMap;
import java.util.Map;

public class _15_MapInterface {

    static void main(String[] args) {

        // Map stores key-value pairs.
        // Keys are unique; values may be duplicated.
        // Map does not extend the Collection interface.

        Map<Integer, String> employees = new HashMap<>();

        // put() inserts a new mapping or replaces an existing value.
        employees.put(101, "Alice");
        employees.put(102, "Bob");
        employees.put(103, "Charlie");

        System.out.println("Employees: " + employees);

        // Keys are unique. Adding an existing key replaces its value.
        String previousValue = employees.put(101, "Alex");

        System.out.println("Previous value for key 101: " + previousValue);
        System.out.println("After replacement: " + employees);

        // get() returns the value associated with a key, or null if absent.
        System.out.println("Employee 102: " + employees.get(102));
        System.out.println("Missing key: " + employees.get(999));

        // containsKey() and containsValue() check for mappings and values.
        System.out.println("Contains key 101: " + employees.containsKey(101));
        System.out.println("Contains value Bob: " + employees.containsValue("Bob"));

        // getOrDefault() returns a fallback when the key is absent.
        System.out.println(
                "Employee 999: " + employees.getOrDefault(999, "Not found")
        );

        // putIfAbsent() inserts only if the key is absent or currently maps to null.
        employees.putIfAbsent(102, "Robert");
        employees.putIfAbsent(104, "Diana");

        System.out.println("\nAfter putIfAbsent: " + employees);

        // remove(key) removes a mapping by key.
        String removedEmployee = employees.remove(103);

        System.out.println("Removed employee: " + removedEmployee);
        System.out.println("After removal: " + employees);

        // remove(key, value) removes only when both match.
        boolean removed = employees.remove(101, "Alex");

        System.out.println("Removed matching mapping: " + removed);
        System.out.println("After conditional removal: " + employees);

        // replace() changes an existing mapping.
        employees.replace(102, "Bobby");

        System.out.println("After replace: " + employees);

        // Map provides views of its keys, values, and entries.
        System.out.println("\nKeys: " + employees.keySet());
        System.out.println("Values: " + employees.values());
        System.out.println("Entries: " + employees.entrySet());

        // Iterate over key-value pairs using entrySet().
        System.out.println("\nEmployee mappings:");

        for (Map.Entry<Integer, String> entry : employees.entrySet()) {
            System.out.println(
                    "ID: " + entry.getKey()
                            + ", Name: " + entry.getValue()
            );
        }

        // computeIfAbsent() calculates and stores a value only when needed.
        Map<Integer, String> departments = new HashMap<>();

        departments.computeIfAbsent(101, id -> "Engineering");

        System.out.println("\nDepartments: " + departments);

        // merge() combines a new value with an existing value.
        Map<String, Integer> productCounts = new HashMap<>();

        productCounts.merge("Keyboard", 1, Integer::sum);
        productCounts.merge("Keyboard", 1, Integer::sum);
        productCounts.merge("Mouse", 1, Integer::sum);

        System.out.println("Product counts: " + productCounts);

        // Map allows at most one null key in implementations such as HashMap.
        // Null-key and null-value support depends on the implementation.
        //
        // HashMap does not guarantee iteration order and is not thread-safe.
    }
}
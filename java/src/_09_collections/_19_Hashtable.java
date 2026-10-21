package _09_collections;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Map;

public class _19_Hashtable {

    static void main(String[] args) {

        // Hashtable is a legacy Map implementation.
        // It stores key-value mappings using a hash table.
        // Basic operations typically take O(1) time with good hash distribution.

        Hashtable<Integer, String> employees = new Hashtable<>();

        // Add mappings.
        employees.put(101, "Alice");
        employees.put(102, "Bob");
        employees.put(103, "Charlie");

        System.out.println("Employees: " + employees);

        // Keys are unique. Reusing a key replaces its value.
        employees.put(101, "Alex");

        System.out.println("After replacing key 101: " + employees);

        // Retrieve a value by key.
        System.out.println("Employee 102: " + employees.get(102));

        // Check whether a key exists.
        System.out.println("Contains key 101: " + employees.containsKey(101));
        System.out.println("Contains value Bob: " + employees.contains("Bob"));

        // Remove a mapping.
        employees.remove(103);

        System.out.println("After removal: " + employees);

        // Hashtable does not permit null keys or null values.
        // The following operations throw NullPointerException:
        //
        // employees.put(null, "Unknown");
        // employees.put(104, null);

        // Iterate through entries to access keys and values together.
        System.out.println("\nEntries:");

        for (Map.Entry<Integer, String> entry : employees.entrySet()) {
            System.out.println(
                    "ID: " + entry.getKey()
                            + ", Name: " + entry.getValue()
            );
        }

        // Hashtable provides legacy Enumeration-based iteration.
        // keys() returns an Enumeration of keys.
        System.out.println("\nKeys using Enumeration:");

        Enumeration<Integer> keys = employees.keys();

        while (keys.hasMoreElements()) {
            System.out.println(keys.nextElement());
        }

        // elements() returns an Enumeration of values.
        System.out.println("\nValues using Enumeration:");

        Enumeration<String> values = employees.elements();

        while (values.hasMoreElements()) {
            System.out.println(values.nextElement());
        }

        // Hashtable is synchronized: individual operations are synchronized.
        // This does not make every multi-step operation atomic.
        //
        // For most new code, prefer HashMap when synchronization is unnecessary.
        // For concurrent access, ConcurrentHashMap is usually the better choice.
        //
        // Hashtable is a legacy class and generally should not be selected
        // for new applications unless compatibility requires it.
    }
}
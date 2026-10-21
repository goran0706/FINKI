package _09_collections;

import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

public class _18_TreeMap {

    static void main(String[] args) {

        // TreeMap implements NavigableMap using a balanced search tree.
        // Entries are sorted by key, using natural ordering by default.
        // Basic get, put, and remove operations take O(log n) time.

        TreeMap<Integer, String> employees = new TreeMap<>();

        employees.put(103, "Charlie");
        employees.put(101, "Alice");
        employees.put(104, "Diana");
        employees.put(102, "Bob");

        System.out.println("Employees: " + employees);

        // Iteration follows ascending key order.
        System.out.println("\nAscending key order:");

        for (Map.Entry<Integer, String> entry : employees.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }

        // Retrieve entries by key.
        System.out.println("\nEmployee 102: " + employees.get(102));
        System.out.println("First key: " + employees.firstKey());
        System.out.println("Last key: " + employees.lastKey());

        // Navigation methods find entries relative to a key.
        System.out.println("Lower key than 103: " + employees.lowerKey(103));
        System.out.println("Floor key of 103: " + employees.floorKey(103));
        System.out.println("Ceiling key of 103: " + employees.ceilingKey(103));
        System.out.println("Higher key than 103: " + employees.higherKey(103));

        System.out.println("Lower entry than 103: " + employees.lowerEntry(103));
        System.out.println("Ceiling entry of 103: " + employees.ceilingEntry(103));

        // pollFirstEntry() and pollLastEntry() return and remove boundary entries.
        System.out.println("\nRemoved first entry: " + employees.pollFirstEntry());
        System.out.println("Removed last entry: " + employees.pollLastEntry());

        System.out.println("After polling: " + employees);

        // Range views provide entries within key boundaries.
        // The lower bound is inclusive; the upper bound is exclusive.
        NavigableMap<Integer, String> range =
                employees.subMap(101, true, 104, false);

        System.out.println("\nRange [101, 104): " + range);

        // Range maps are backed by the original map.
        range.put(102, "Robert");

        System.out.println("After modifying range: " + employees);

        // headMap() returns entries with keys below the boundary.
        System.out.println("Keys below 103: " + employees.headMap(103));

        // tailMap() returns entries with keys at or above the boundary.
        System.out.println("Keys from 102 onward: " + employees.tailMap(102));

        // Descending views reverse the key order.
        NavigableMap<Integer, String> descending = employees.descendingMap();

        System.out.println("\nDescending map: " + descending);

        // A Comparator can define custom key ordering.
        TreeMap<String, Integer> scores = new TreeMap<>(
                (first, second) -> second.compareTo(first)
        );

        scores.put("Alice", 90);
        scores.put("Charlie", 85);
        scores.put("Bob", 95);

        System.out.println("\nReverse alphabetical order: " + scores);

        // TreeMap uses natural key ordering or its Comparator.
        // Keys that compare as equal are treated as the same key.
        //
        // With natural ordering, null keys are not permitted.
        // Null values are permitted.
        //
        // Use TreeMap when you need sorted keys, range queries,
        // or navigation operations.
    }
}
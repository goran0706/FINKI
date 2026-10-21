package _09_collections;

import java.util.ArrayList;
import java.util.List;

public class _03_ArrayList {

    static void main(String[] args) {

        // ArrayList is a resizable-array implementation of the List interface.
        // It preserves insertion order, allows duplicates, and supports null.
        List<String> names = new ArrayList<>();

        // Adding elements.
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        names.add("Alice");

        System.out.println("Names: " + names);

        // ArrayList grows automatically when additional capacity is needed.
        names.add("David");
        names.add("Emma");

        System.out.println("After adding elements: " + names);

        // Access by index is efficient: O(1) time.
        System.out.println("Element at index 2: " + names.get(2));

        // Replacing an element by index is also O(1).
        names.set(2, "Frank");

        System.out.println("After replacement: " + names);

        // Searching by value takes O(n) time.
        System.out.println("Contains Alice: " + names.contains("Alice"));
        System.out.println("Index of Emma: " + names.indexOf("Emma"));

        // Inserting near the beginning requires shifting existing elements.
        // This operation takes O(n) time.
        names.add(1, "Grace");

        System.out.println("After insertion at index 1: " + names);

        // Removing by index also shifts subsequent elements.
        // This operation takes O(n) time in the general case.
        String removed = names.remove(1);

        System.out.println("Removed: " + removed);
        System.out.println("After removal: " + names);

        // Removing by value first searches for the element, then removes it.
        names.remove("Alice");

        System.out.println("After removing Alice: " + names);

        // ArrayList supports null elements.
        names.add(null);

        System.out.println("After adding null: " + names);

        // Iterating through an ArrayList is efficient.
        System.out.println("\nIterating:");

        for (String name : names) {
            System.out.println(name);
        }

        // ArrayList can be initialized with existing values.
        List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));

        System.out.println("\nNumbers: " + numbers);

        // Initial capacity can reduce resizing when the approximate size is known.
        // Capacity is not the same as size.
        ArrayList<String> employees = new ArrayList<>(100);
        employees.add("Employee A");

        System.out.println("Employee list size: " + employees.size());

        // Create an independent, mutable copy of a list.
        List<String> copiedNames = new ArrayList<>(names);

        copiedNames.add("New Employee");

        System.out.println("\nOriginal list: " + names);
        System.out.println("Copied list: " + copiedNames);

        // ArrayList is generally a good choice when:
        // - Indexed access is frequent.
        // - Iteration is frequent.
        // - Adding elements at the end is common.
        //
        // It may be less suitable when frequent insertions or removals
        // occur near the beginning or middle of a large list.
        //
        // ArrayList is not thread-safe by default.
    }
}
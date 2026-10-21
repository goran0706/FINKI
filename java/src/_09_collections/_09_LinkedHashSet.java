package _09_collections;

import java.util.LinkedHashSet;
import java.util.Set;

public class _09_LinkedHashSet {

    static void main(String[] args) {

        // LinkedHashSet implements Set using a hash table and a linked list.
        // It prevents duplicates and preserves insertion order.
        Set<String> names = new LinkedHashSet<>();

        // Elements appear in the order they were first inserted.
        names.add("Charlie");
        names.add("Alice");
        names.add("Bob");

        System.out.println("Names: " + names);

        // Adding a duplicate does not change the set or its insertion order.
        boolean added = names.add("Alice");

        System.out.println("Alice added again: " + added);
        System.out.println("After duplicate insertion: " + names);

        // Removing an element removes it from the set.
        names.remove("Alice");

        System.out.println("After removing Alice: " + names);

        // Adding the element again places it at the end of insertion order.
        names.add("Alice");

        System.out.println("After adding Alice again: " + names);

        // Iteration follows insertion order.
        System.out.println("\nIteration:");

        for (String name : names) {
            System.out.println(name);
        }

        // LinkedHashSet supports one null element.
        names.add(null);
        names.add(null);

        System.out.println("\nAfter adding null twice: " + names);

        // LinkedHashSet supports bulk operations from the Set interface.
        Set<String> additionalNames = Set.of("David", "Eva");

        names.addAll(additionalNames);

        System.out.println("After addAll: " + names);

        // Copying a LinkedHashSet preserves the source iteration order.
        Set<String> copiedNames = new LinkedHashSet<>(names);

        System.out.println("Copied set: " + copiedNames);

        // LinkedHashSet generally provides average O(1) add, remove,
        // and contains operations, with extra memory overhead compared
        // with HashSet to maintain insertion order.
        //
        // Use it when uniqueness and predictable insertion-order iteration
        // are both required.
        //
        // It does not sort elements and is not thread-safe by default.
    }
}
package _09_collections;

import java.util.ArrayList;
import java.util.List;

public class _02_ListInterface {

    static void main(String[] args) {

        // List represents an ordered collection.
        // It preserves encounter order and allows duplicate elements.
        List<String> names = new ArrayList<>();

        // Add elements.
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        names.add("Alice");

        System.out.println("Names: " + names);

        // Access elements by zero-based index.
        System.out.println("First name: " + names.get(0));
        System.out.println("Last name: " + names.get(names.size() - 1));

        // Get the number of elements.
        System.out.println("Size: " + names.size());

        // Check whether an element exists.
        System.out.println("Contains Bob: " + names.contains("Bob"));
        System.out.println("Contains David: " + names.contains("David"));

        // Replace the element at a specific index.
        String previousName = names.set(1, "David");

        System.out.println("Replaced: " + previousName);
        System.out.println("After replacement: " + names);

        // Insert an element at a specific index.
        // Existing elements at that index and after it shift right.
        names.add(1, "Emma");

        System.out.println("After insertion: " + names);

        // Remove by index.
        String removedName = names.remove(2);

        System.out.println("Removed by index: " + removedName);
        System.out.println("After index removal: " + names);

        // Remove by value.
        // Removes the first matching occurrence.
        names.remove("Alice");

        System.out.println("After value removal: " + names);

        // indexOf returns the first matching index, or -1 if absent.
        names.add("Charlie");

        System.out.println("Index of Charlie: " + names.indexOf("Charlie"));
        System.out.println("Last index of Charlie: " + names.lastIndexOf("Charlie"));

        // Iterate over the list in encounter order.
        System.out.println("\nIterating with an enhanced for loop:");

        for (String name : names) {
            System.out.println(name);
        }

        // List supports indexed iteration.
        System.out.println("\nIterating by index:");

        for (int i = 0; i < names.size(); i++) {
            System.out.println(i + ": " + names.get(i));
        }

        // Create a list from existing elements.
        List<String> additionalNames = List.of("Frank", "Grace");

        names.addAll(additionalNames);

        System.out.println("\nAfter addAll: " + names);

        // Remove all matching elements.
        names.removeAll(List.of("Charlie"));

        System.out.println("After removeAll: " + names);

        // Retain only elements present in the supplied collection.
        names.retainAll(List.of("Alice", "Frank", "Grace"));

        System.out.println("After retainAll: " + names);

        // Clear removes every element.
        names.clear();

        System.out.println("After clear: " + names);
        System.out.println("Is empty: " + names.isEmpty());

        // List.of creates an unmodifiable list.
        List<String> fixedNames = List.of("Alice", "Bob");

        System.out.println("\nUnmodifiable list: " + fixedNames);

        // This would throw UnsupportedOperationException:
        // fixedNames.add("Charlie");
        // fixedNames.set(0, "David");
        // fixedNames.remove("Alice");

        // List is an interface. ArrayList is one implementation.
        // Other implementations have different performance characteristics.
    }
}
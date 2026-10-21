package _09_collections;

import java.util.ArrayList;
import java.util.List;

public class _05_ListOperations {

    static void main(String[] args) {

        List<String> employees = new ArrayList<>(
                List.of("Alice", "Bob", "Charlie", "Diana", "Bob")
        );

        System.out.println("Original list: " + employees);

        // size() returns the number of elements.
        System.out.println("Size: " + employees.size());

        // contains() checks whether an element exists.
        System.out.println("Contains Alice: " + employees.contains("Alice"));

        // indexOf() returns the first matching index, or -1 if absent.
        System.out.println("First Bob index: " + employees.indexOf("Bob"));

        // lastIndexOf() returns the last matching index, or -1 if absent.
        System.out.println("Last Bob index: " + employees.lastIndexOf("Bob"));

        // add(element) appends an element.
        employees.add("Eva");

        // add(index, element) inserts at a specific position.
        employees.add(1, "Frank");

        System.out.println("\nAfter additions: " + employees);

        // set(index, element) replaces an element.
        String previous = employees.set(0, "Alex");

        System.out.println("Replaced element: " + previous);
        System.out.println("After replacement: " + employees);

        // remove(index) removes by position.
        String removedByIndex = employees.remove(2);

        System.out.println("Removed by index: " + removedByIndex);
        System.out.println("After index removal: " + employees);

        // remove(Object) removes the first matching occurrence.
        employees.remove("Bob");

        System.out.println("After removing Bob: " + employees);

        // addAll() appends all elements from another collection.
        employees.addAll(List.of("George", "Hannah"));

        System.out.println("\nAfter addAll: " + employees);

        // containsAll() checks whether every supplied element exists.
        System.out.println(
                "Contains Alex and Hannah: "
                        + employees.containsAll(List.of("Alex", "Hannah"))
        );

        // removeAll() removes every element that matches the supplied collection.
        employees.removeAll(List.of("George", "Hannah"));

        System.out.println("After removeAll: " + employees);

        // retainAll() keeps only elements present in the supplied collection.
        employees.retainAll(List.of("Alex", "Charlie", "Diana"));

        System.out.println("After retainAll: " + employees);

        // subList(fromIndex, toIndex) returns a view of a range.
        // The starting index is inclusive; the ending index is exclusive.
        List<String> names = new ArrayList<>(
                List.of("Alice", "Bob", "Charlie", "Diana", "Eva")
        );

        List<String> middleNames = names.subList(1, 4);

        System.out.println("\nOriginal names: " + names);
        System.out.println("Sublist: " + middleNames);

        // Changes through the sublist view affect the original list.
        middleNames.set(0, "Bobby");

        System.out.println("After changing sublist: " + middleNames);
        System.out.println("Original list after change: " + names);

        // clear() removes all elements.
        employees.clear();

        System.out.println("\nAfter clear: " + employees);
        System.out.println("Is empty: " + employees.isEmpty());

        // Avoid modifying a list structurally while iterating over it
        // with an enhanced for loop. Use an Iterator or removeIf()
        // for safe conditional removal.
        List<Integer> numbers = new ArrayList<>(
                List.of(10, 15, 20, 25, 30)
        );

        numbers.removeIf(number -> number % 2 != 0);

        System.out.println("\nAfter removing odd numbers: " + numbers);
    }
}
package _09_collections;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class _24_CollectionsUtilityClass {

    static void main(String[] args) {

        // java.util.Collections is a utility class containing static methods
        // for working with collections.
        // It is different from java.util.Collection, which is an interface.

        List<Integer> numbers = new ArrayList<>(
                List.of(5, 2, 8, 1, 9, 3)
        );

        System.out.println("Original numbers: " + numbers);

        // Sort elements into natural order.
        Collections.sort(numbers);
        System.out.println("Sorted: " + numbers);

        // Reverse the current order.
        Collections.reverse(numbers);
        System.out.println("Reversed: " + numbers);

        // Randomly rearrange elements.
        Collections.shuffle(numbers);
        System.out.println("Shuffled: " + numbers);

        // Find the minimum and maximum elements.
        System.out.println("Minimum: " + Collections.min(numbers));
        System.out.println("Maximum: " + Collections.max(numbers));

        // Find the frequency of an element.
        List<String> fruits = new ArrayList<>(
                List.of("Apple", "Banana", "Apple", "Orange", "Apple")
        );

        System.out.println("\nFruits: " + fruits);
        System.out.println(
                "Occurrences of Apple: " + Collections.frequency(fruits, "Apple")
        );

        // Check whether two collections have any elements in common.
        List<String> tropicalFruits = List.of("Mango", "Papaya", "Banana");

        System.out.println(
                "Fruits share an element with tropical fruits: "
                        + !Collections.disjoint(fruits, tropicalFruits)
        );

        // Copy elements into an existing destination List.
        // The destination must already be large enough.
        List<String> source = List.of("Java", "Python", "Kotlin");

        List<String> destination = new ArrayList<>(
                Collections.nCopies(source.size(), "")
        );

        Collections.copy(destination, source);

        System.out.println("\nCopied elements: " + destination);

        // Fill every position with the specified value.
        Collections.fill(destination, "Unknown");

        System.out.println("After fill: " + destination);

        // Replace every occurrence of an element.
        List<String> statuses = new ArrayList<>(
                List.of("Pending", "Approved", "Pending", "Rejected")
        );

        boolean replaced = Collections.replaceAll(
                statuses,
                "Pending",
                "In Progress"
        );

        System.out.println("\nAfter replaceAll: " + statuses);
        System.out.println("At least one element replaced: " + replaced);

        // Swap elements at two positions.
        Collections.swap(statuses, 0, 2);

        System.out.println("After swap: " + statuses);

        // Rotate elements by the specified distance.
        // Positive distance rotates elements toward the end.
        Collections.rotate(statuses, 1);

        System.out.println("After rotate: " + statuses);

        // Create an immutable empty List.
        List<String> emptyList = Collections.emptyList();

        System.out.println("\nEmpty List: " + emptyList);

        // Create an immutable singleton List.
        List<String> singletonList = Collections.singletonList("Java");

        System.out.println("Singleton List: " + singletonList);

        // Create an immutable List containing repeated references
        // to the same element value.
        List<String> repeated = Collections.nCopies(4, "Java");

        System.out.println("Repeated values: " + repeated);

        // nCopies() returns an immutable List.
        // Attempting to modify it throws UnsupportedOperationException.
        //
        // Collections.unmodifiableList() can expose a read-only view
        // of an existing List, but it does not make the original List immutable.
        //
        // Collections.synchronizedList() creates a synchronized wrapper.
        // Iteration still requires external synchronization on the wrapper.
    }
}
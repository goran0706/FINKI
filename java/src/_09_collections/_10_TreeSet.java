package _09_collections;

import java.util.NavigableSet;
import java.util.TreeSet;

public class _10_TreeSet {

    static void main(String[] args) {

        // TreeSet implements NavigableSet using a balanced search tree.
        // Elements are maintained in sorted order.
        // Basic add, remove, and contains operations take O(log n) time.

        TreeSet<Integer> numbers = new TreeSet<>();

        numbers.add(50);
        numbers.add(10);
        numbers.add(30);
        numbers.add(20);
        numbers.add(40);
        numbers.add(30); // Duplicate ignored.

        System.out.println("Numbers: " + numbers);

        // Elements are sorted by natural ordering by default.
        System.out.println("First: " + numbers.first());
        System.out.println("Last: " + numbers.last());

        // Navigation methods find elements relative to a given value.
        System.out.println("Lower than 30: " + numbers.lower(30));
        System.out.println("Floor of 30: " + numbers.floor(30));
        System.out.println("Ceiling of 25: " + numbers.ceiling(25));
        System.out.println("Higher than 30: " + numbers.higher(30));

        // pollFirst() and pollLast() return and remove boundary elements.
        System.out.println("Removed first: " + numbers.pollFirst());
        System.out.println("Removed last: " + numbers.pollLast());

        System.out.println("After polling: " + numbers);

        // Range views.
        // The lower bound is inclusive; the upper bound is exclusive.
        NavigableSet<Integer> range = numbers.subSet(20, true, 40, false);

        System.out.println("Range [20, 40): " + range);

        // headSet() returns elements below the specified boundary.
        System.out.println("Below 40: " + numbers.headSet(40));

        // tailSet() returns elements at or above the specified boundary.
        System.out.println("From 20 onward: " + numbers.tailSet(20));

        // Range methods return backed views, not independent copies.
        range.remove(20);

        System.out.println("After modifying range: " + numbers);

        // Descending view iterates in reverse order.
        NavigableSet<Integer> descending = numbers.descendingSet();

        System.out.println("Descending: " + descending);

        // TreeSet can use a Comparator for custom ordering.
        TreeSet<String> names = new TreeSet<>(
                (first, second) -> second.compareTo(first)
        );

        names.add("Alice");
        names.add("Charlie");
        names.add("Bob");
        names.add("Alice");

        System.out.println("\nNames in reverse alphabetical order: " + names);

        // TreeSet uses natural ordering or its Comparator to determine
        // whether elements are equivalent for set purposes.
        // A comparison result of zero means the set treats elements as duplicates,
        // even if equals() returns false.
        //
        // TreeSet does not allow null with natural ordering.
        // Comparators that support null may change that behavior.
        //
        // Use TreeSet when you need uniqueness, sorted order, and range queries.
    }
}
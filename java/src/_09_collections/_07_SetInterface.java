package _09_collections;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

public class _07_SetInterface {

    static void main(String[] args) {

        // Set represents a collection that does not contain duplicate elements.
        // Duplicate detection is based on equals() and hashCode(),
        // or on the comparator/natural ordering used by sorted sets.

        Set<String> names = new HashSet<>();

        // Adding elements returns true when the set changes.
        System.out.println(names.add("Alice")); // true
        System.out.println(names.add("Bob"));   // true
        System.out.println(names.add("Alice")); // false

        System.out.println("Names: " + names);
        System.out.println("Size: " + names.size());

        // contains() checks whether an element exists.
        System.out.println("Contains Bob: " + names.contains("Bob"));

        // remove() removes an element if it exists.
        names.remove("Bob");

        System.out.println("After removal: " + names);

        // Set does not provide indexed access.
        // This does not compile:
        // names.get(0);

        // HashSet does not guarantee iteration order.
        Set<Integer> hashSet = new HashSet<>();
        hashSet.add(30);
        hashSet.add(10);
        hashSet.add(20);

        System.out.println("\nHashSet: " + hashSet);

        // LinkedHashSet preserves insertion order.
        Set<Integer> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add(30);
        linkedHashSet.add(10);
        linkedHashSet.add(20);

        System.out.println("LinkedHashSet: " + linkedHashSet);

        // TreeSet stores elements in sorted order.
        // Elements must be mutually comparable, or a Comparator must be supplied.
        Set<Integer> treeSet = new TreeSet<>();
        treeSet.add(30);
        treeSet.add(10);
        treeSet.add(20);

        System.out.println("TreeSet: " + treeSet);

        // Set supports bulk operations.
        Set<Integer> first = new HashSet<>();
        first.add(1);
        first.add(2);
        first.add(3);

        Set<Integer> second = new HashSet<>();
        second.add(3);
        second.add(4);
        second.add(5);

        // Union: elements present in either set.
        Set<Integer> union = new HashSet<>(first);
        union.addAll(second);

        System.out.println("\nUnion: " + union);

        // Intersection: elements present in both sets.
        Set<Integer> intersection = new HashSet<>(first);
        intersection.retainAll(second);

        System.out.println("Intersection: " + intersection);

        // Difference: elements in first but not in second.
        Set<Integer> difference = new HashSet<>(first);
        difference.removeAll(second);

        System.out.println("Difference: " + difference);

        // Check subset relationships.
        Set<Integer> subset = Set.of(1, 2);

        System.out.println(
                "Subset contained in first: " + first.containsAll(subset)
        );

        // Set.of() creates an unmodifiable set.
        Set<String> fixedNames = Set.of("Alice", "Bob");

        System.out.println("\nUnmodifiable set: " + fixedNames);

        // These operations throw UnsupportedOperationException:
        // fixedNames.add("Charlie");
        // fixedNames.remove("Alice");

        // Set implementations have different trade-offs:
        // HashSet: average O(1) add, remove, and contains.
        // LinkedHashSet: average O(1) operations and insertion order.
        // TreeSet: O(log n) operations and sorted order.
    }
}
package _09_collections;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class _25_ImmutableAndUnmodifiableCollections {

    static void main(String[] args) {

        // An immutable collection cannot be modified after creation.
        // An unmodifiable collection is a read-only view or wrapper that
        // prevents modifications through that reference.

        // 1. List.of() creates an unmodifiable List.
        List<String> immutableList = List.of("Java", "Python", "Kotlin");

        System.out.println("List.of(): " + immutableList);

        // These operations throw UnsupportedOperationException:
        // immutableList.add("JavaScript");
        // immutableList.set(0, "C++");
        // immutableList.remove("Java");

        // List.of() does not permit null elements.
        // List<String> invalidList = List.of("Java", null);

        // 2. Collections.unmodifiableList() creates an unmodifiable view.
        List<String> original = new ArrayList<>();
        original.add("Java");
        original.add("Python");

        List<String> unmodifiableView =
                Collections.unmodifiableList(original);

        System.out.println("\nOriginal: " + original);
        System.out.println("Unmodifiable view: " + unmodifiableView);

        // Modification through the view is prohibited.
        // unmodifiableView.add("Kotlin");

        // The original List remains mutable.
        // Changes made to the original are visible through the view.
        original.add("Kotlin");

        System.out.println("After modifying original: " + original);
        System.out.println("View reflects original: " + unmodifiableView);

        // 3. Create an independent, unmodifiable snapshot.
        List<String> snapshot = Collections.unmodifiableList(
                new ArrayList<>(original)
        );

        original.add("JavaScript");

        System.out.println("\nOriginal after another change: " + original);
        System.out.println("Snapshot remains unchanged: " + snapshot);

        // 4. List.copyOf() creates an unmodifiable snapshot.
        List<String> copiedList = List.copyOf(original);

        System.out.println("\nList.copyOf(): " + copiedList);

        // Changes to the original do not affect the copied List.
        original.add("Go");

        System.out.println("Original after change: " + original);
        System.out.println("Copied List: " + copiedList);

        // List.copyOf() rejects null elements.
        // List<String> invalidCopy = List.copyOf(
        //         java.util.Arrays.asList("Java", null)
        // );

        // 5. Unmodifiable collections are shallowly unmodifiable.
        // If their elements are mutable, those elements can still change.
        List<StringBuilder> builders = new ArrayList<>();
        builders.add(new StringBuilder("Java"));

        List<StringBuilder> unmodifiableBuilders =
                Collections.unmodifiableList(builders);

        // The List cannot be structurally modified through this reference.
        // unmodifiableBuilders.add(new StringBuilder("Python"));

        // However, the contained StringBuilder is mutable.
        unmodifiableBuilders.get(0).append(" Collections");

        System.out.println("\nMutable element changed: " + unmodifiableBuilders);

        // 6. List.copyOf() is also shallow.
        List<StringBuilder> copiedBuilders = List.copyOf(builders);

        builders.get(0).append(" Framework");

        System.out.println("Original builders: " + builders);
        System.out.println("Copied builders: " + copiedBuilders);

        // Both Lists reference the same StringBuilder object.
        //
        // Use List.of() for a fixed collection of elements.
        // Use List.copyOf() for an unmodifiable snapshot of another collection.
        // Use Collections.unmodifiableList() when a read-only view is needed.
        //
        // None of these mechanisms automatically makes mutable elements
        // deeply immutable or provides thread safety for mutable elements.
    }
}
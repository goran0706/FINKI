package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * UNBOUNDED WILDCARDS
 *
 * An unbounded wildcard uses the syntax:
 *
 *     List<?>
 *
 * It means a list whose element type is unknown.
 *
 * Use an unbounded wildcard when a method needs to work with a generic
 * collection without depending on its element type.
 *
 * Because the element type is unknown:
 * - Elements can be read as Object.
 * - Arbitrary non-null values cannot be added safely.
 * - The list can be null or empty, regardless of its element type.
 */
public class _09_UnboundedWildcards {

    public static void printList(List<?> items) {
        for (Object item : items) {
            System.out.println(item);
        }
    }

    public static int countElements(List<?> items) {
        return items.size();
    }

    public static boolean isEmpty(List<?> items) {
        return items.isEmpty();
    }

    static void main(String[] args) {

        List<String> names = new ArrayList<>();
        names.add("Alex");
        names.add("Maria");
        names.add("John");

        List<Integer> numbers = new ArrayList<>();
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);

        List<Double> prices = new ArrayList<>();
        prices.add(19.99);
        prices.add(49.99);

        // All three lists can be passed to the same methods.
        printList(names);
        printList(numbers);
        printList(prices);

        System.out.println("Names count: " + countElements(names));
        System.out.println("Numbers count: " + countElements(numbers));
        System.out.println("Prices empty: " + isEmpty(prices));

        /*
         * The wildcard does not mean that the list contains Objects.
         * It means its actual element type is unknown.
         *
         * List<Object> and List<String> are different types.
         * A List<String> cannot be assigned to a List<Object>.
         */
        List<?> unknownItems = names;

        // Compilation error: the actual element type is unknown.
        // unknownItems.add("Robert");

        // Reading an element is safe because every reference type
        // can be treated as Object.
        Object firstItem = unknownItems.get(0);
        System.out.println("First item: " + firstItem);
    }
}
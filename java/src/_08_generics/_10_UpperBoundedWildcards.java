package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * UPPER-BOUNDED WILDCARDS
 *
 * An upper-bounded wildcard uses the syntax:
 *
 *     ? extends SomeType
 *
 * It accepts SomeType or any subtype of SomeType.
 *
 * For example:
 *     List<Integer>
 *     List<Double>
 *
 * can both be passed to a method accepting List<? extends Number>.
 *
 * This is useful when a method needs to READ values from collections
 * of different related types.
 *
 * Reading:
 * - Elements can be safely read as the upper-bound type.
 *
 * Writing:
 * - Arbitrary values cannot be added because the actual subtype is unknown.
 * - null is permitted.
 */
public class _10_UpperBoundedWildcards {

    public static double calculateTotal(List<? extends Number> numbers) {

        double total = 0.0;

        for (Number number : numbers) {
            // Every accepted element is guaranteed to be a Number.
            total += number.doubleValue();
        }

        return total;
    }

    public static void printNumbers(List<? extends Number> numbers) {

        for (Number number : numbers) {
            System.out.println(number);
        }

        // Compilation error: the actual element type is unknown.
        // numbers.add(100);
    }

    static void main(String[] args) {

        List<Integer> quantities = new ArrayList<>();
        quantities.add(10);
        quantities.add(20);
        quantities.add(30);

        List<Double> prices = new ArrayList<>();
        prices.add(19.99);
        prices.add(29.99);
        prices.add(39.99);

        List<Float> measurements = new ArrayList<>();
        measurements.add(1.5f);
        measurements.add(2.5f);

        // Each list has a different element type, but all elements
        // are Number subclasses.
        printNumbers(quantities);
        printNumbers(prices);
        printNumbers(measurements);

        System.out.println("Quantity total: " + calculateTotal(quantities));
        System.out.println("Price total: " + calculateTotal(prices));
        System.out.println("Measurement total: " + calculateTotal(measurements));

        /*
         * List<? extends Number> does not mean List<Number>.
         *
         * It means a list of some unknown type that extends Number.
         * That type could be Integer, Double, Float, or another subtype.
         */
    }
}
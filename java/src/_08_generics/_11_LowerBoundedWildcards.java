package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * LOWER-BOUNDED WILDCARDS
 *
 * A lower-bounded wildcard uses the syntax:
 *
 *     ? super SomeType
 *
 * It accepts SomeType or any of its supertypes.
 *
 * For example, List<? super Integer> can refer to:
 *     List<Integer>
 *     List<Number>
 *     List<Object>
 *
 * Lower-bounded wildcards are useful when a method needs to ADD values
 * of a particular type to a collection.
 *
 * Writing:
 * - Values of the lower-bound type can be added safely.
 * - Values of its subtypes can also be added.
 *
 * Reading:
 * - Elements can safely be read as Object because the actual list type
 *   could be List<Integer>, List<Number>, or List<Object>.
 */
public class _11_LowerBoundedWildcards {

    public static void addNumbers(List<? super Integer> numbers) {

        // Integer values can safely be added to every accepted list.
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        // Reading is safe as Object because the actual element type
        // of the list is not known.
        for (Object number : numbers) {
            System.out.println(number);
        }
    }

    static void main(String[] args) {

        List<Integer> integers = new ArrayList<>();
        List<Number> numbers = new ArrayList<>();
        List<Object> objects = new ArrayList<>();

        // All these lists can accept Integer values.
        addNumbers(integers);
        addNumbers(numbers);
        addNumbers(objects);

        /*
         * List<Double> is not accepted because Double is not a supertype
         * of Integer.
         *
         * Compilation error:
         * addNumbers(new ArrayList<Double>());
         */

        /*
         * Upper-bounded wildcard:
         *     ? extends Number
         *     Commonly used to read Number values.
         *
         * Lower-bounded wildcard:
         *     ? super Integer
         *     Commonly used to write Integer values.
         */
    }
}
package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * GENERIC INHERITANCE
 *
 * A generic class can extend another generic class.
 *
 * The child class can:
 * 1. Pass a concrete type to the parent class.
 * 2. Declare its own type parameter and pass it to the parent.
 * 3. Extend a generic parent while preserving its type parameter.
 *
 * These choices determine which types can be used when creating objects
 * of the child class.
 */
public class _12_GenericInheritance {

    static void main(String[] args) {

        // The inherited methods accept and return String values.
        StringContainer names = new StringContainer();
        names.add("Alex");
        names.addUppercase("Maria");

        String firstName = names.get(0);
        System.out.println(firstName);
        System.out.println(names.get(1));

        // T is Integer for this NumberContainer.
        NumberContainer<Integer> quantities = new NumberContainer<>();
        quantities.add(10);
        quantities.add(20);
        quantities.add(30);

        Integer firstQuantity = quantities.get(0);
        System.out.println("First quantity: " + firstQuantity);
        System.out.println("Total: " + quantities.calculateTotal());

        // T can also be Double.
        NumberContainer<Double> prices = new NumberContainer<>();
        prices.add(19.99);
        prices.add(29.99);

        System.out.println("Price total: " + prices.calculateTotal());

        // Compilation error: String is not a subclass of Number.
        // NumberContainer<String> invalid = new NumberContainer<>();
    }

    /*
     * Generic parent class.
     *
     * T represents the type of value stored by the container.
     */
    static class Container<T> {

        private final List<T> items = new ArrayList<>();

        public void add(T item) {
            items.add(item);
        }

        public T get(int index) {
            return items.get(index);
        }

        public int size() {
            return items.size();
        }
    }

    /*
     * Example 1: Fix the parent's type parameter.
     *
     * StringContainer extends Container<String>.
     *
     * Every StringContainer stores Strings. Callers do not need to
     * specify the type argument when creating a StringContainer.
     */
    static class StringContainer extends Container<String> {

        public void addUppercase(String value) {
            add(value.toUpperCase());
        }
    }

    /*
     * Example 2: Preserve a generic type parameter.
     *
     * NumberContainer<T> extends Container<T>.
     *
     * T remains configurable, but this class restricts T to Number
     * or one of its subclasses.
     */
    static class NumberContainer<T extends Number> extends Container<T> {

        public double calculateTotal() {
            double total = 0.0;

            for (int i = 0; i < size(); i++) {
                total += get(i).doubleValue();
            }

            return total;
        }
    }
}
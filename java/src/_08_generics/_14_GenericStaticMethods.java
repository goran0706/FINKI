package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * GENERIC STATIC METHODS
 *
 * A static method can declare its own type parameters.
 *
 * Syntax:
 *     public static <T> T methodName(T value)
 *
 * The type parameter is declared after the static keyword and before
 * the return type.
 *
 * A static method cannot directly use a generic class's type parameter
 * because static members belong to the class itself, not to a particular
 * instance of that class.
 *
 * Instead, a static method declares its own type parameters.
 */
public record _14_GenericStaticMethods<T>(T value) {

    /*
     * This static method declares its own type parameter U.
     *
     * U is independent of the class's type parameter T.
     * The method can therefore be called without creating an instance
     * of _14_GenericStaticMethods.
     */
    public static <U> U identity(U value) {
        return value;
    }

    /*
     * A generic static method can declare multiple type parameters.
     */
    public static <K, V> void printEntry(K key, V value) {
        System.out.println("Key: " + key + ", Value: " + value);
    }

    /*
     * Generic static methods can also return parameterized types.
     */
    public static <E> List<E> createList(E first, E second) {
        List<E> items = new ArrayList<>();
        items.add(first);
        items.add(second);
        return items;
    }

    static void main(String[] args) {

        // The compiler infers U as String.
        String name = _14_GenericStaticMethods.identity("Alex");
        System.out.println(name);

        // The compiler infers U as Integer.
        Integer number = _14_GenericStaticMethods.identity(100);
        System.out.println(number);

        // The compiler infers K as String and V as Double.
        _14_GenericStaticMethods.printEntry("ACC-001", 1500.75);

        // The compiler infers E as String.
        List<String> names =
                _14_GenericStaticMethods.createList("Alex", "Maria");

        System.out.println(names);

        /*
         * A static method cannot directly reference the class type parameter T.
         *
         * The following declaration would not compile:
         *
         * public static T invalidMethod(T value) {
         *     return value;
         * }
         *
         * T belongs to an instance of the generic class. A static method
         * must declare its own type parameter if it needs a generic type.
         */

        _14_GenericStaticMethods<Integer> instance =
                new _14_GenericStaticMethods<>(42);

        System.out.println(instance.value());
    }
}
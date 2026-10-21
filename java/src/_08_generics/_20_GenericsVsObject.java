package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * GENERICS VS OBJECT
 *
 * Before generics, Java collections commonly stored values as Object.
 *
 * Object is the superclass of all Java reference types, so a collection
 * of Object can hold values of different types.
 *
 * However, this approach has disadvantages:
 *
 * 1. It does not enforce a specific element type at compile time.
 * 2. Retrieving an element often requires an explicit cast.
 * 3. An incorrect cast can cause ClassCastException at runtime.
 *
 * Generics solve these problems by allowing the compiler to enforce
 * the intended element type.
 */
public class _20_GenericsVsObject {

    static void main(String[] args) {

        /*
         * Example 1: Using Object
         *
         * The list accepts unrelated types because every value is stored
         * as an Object.
         */
        List<Object> objectList = new ArrayList<>();

        objectList.add("Alex");
        objectList.add(100);
        objectList.add(25.50);

        // Retrieving an element returns Object.
        Object firstObject = objectList.get(0);

        // An explicit cast is required to assign it to String.
        String name = (String) firstObject;

        System.out.println("Name: " + name);

        /*
         * The compiler allows this cast because it cannot determine
         * the actual type of the object stored at index 1.
         *
         * However, the object is an Integer, not a String.
         * Running this code would throw ClassCastException.
         */
        // String invalidName = (String) objectList.get(1);

        /*
         * Example 2: Using generics
         *
         * List<String> restricts the list to String elements.
         * The compiler rejects incompatible values.
         */
        List<String> stringList = new ArrayList<>();

        stringList.add("Alex");
        stringList.add("Maria");

        // Compilation error: Integer is not a String.
        // stringList.add(100);

        /*
         * Retrieving an element returns String directly.
         * No explicit cast is necessary.
         */
        String firstName = stringList.get(0);

        System.out.println("First name: " + firstName);

        /*
         * Example 3: Generic method
         *
         * A generic method can accept values of different types while
         * preserving each value's compile-time type.
         */
        printValue("Acme");
        printValue(100);
        printValue(25.50);

        /*
         * Summary:
         *
         * List<Object>:
         * - Can hold different reference types.
         * - Does not restrict elements to one specific type.
         * - May require casts when retrieving values.
         *
         * List<String>:
         * - Can hold only String values.
         * - Provides compile-time type safety.
         * - Returns String without requiring a cast.
         *
         * Important distinction:
         * List<Object> is not a supertype of List<String>.
         * A List<String> cannot be assigned to a List<Object>.
         */
    }

    public static <T> void printValue(T value) {
        System.out.println(value);
    }
}
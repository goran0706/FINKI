package _01_fundamentals;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class _18_ArrayLists {

    static void main(String[] args) {

        /*
         * Data Structures
         * Containers that store and organize data.
         *
         * ArrayList:
         * - Implements the List interface.
         * - Uses a dynamically resizable array internally.
         * - Stores elements in insertion order and allows duplicates.
         * - Supports indexed access to elements.
         * - Can grow or shrink as elements are added or removed.
         * - Overrides toString() to display its elements.
         *
         * Generics:
         * - Specify the element type at compile time.
         * - Require reference types rather than primitive types.
         * - Wrapper classes allow collections to store primitive-like values.
         *
         * Prefer declaring variables using the List interface
         * and creating instances using ArrayList.
         */

        // STRING ARRAYLIST

        List<String> names = new ArrayList<>();

        names.add("John");
        names.add("Jane");
        names.add("Matthew");
        names.add("Amanda");
        names.add("Samantha");

        // ArrayList overrides toString() to display its elements.
        System.out.println("Names: " + names);

        // Number of elements.
        System.out.println("Number of names: " + names.size());

        // Access an element by index.
        System.out.println("First name: " + names.get(0));

        // Update an element.
        names.set(0, "Jonathan");
        System.out.println("Updated names: " + names);

        // Remove an element by value.
        names.remove("Jane");
        System.out.println("After removal: " + names);

        // Iterate using a traditional for loop.
        System.out.println("\n--- Traditional for loop ---");

        for (int i = 0; i < names.size(); i++) {
            System.out.println(names.get(i));
        }

        // Iterate using an enhanced for loop.
        System.out.println("\n--- Enhanced for loop ---");

        for (String name : names) {
            System.out.println(name);
        }

        // Iterate using an Iterator.
        System.out.println("\n--- Iterator ---");

        Iterator<String> iterator = names.iterator();

        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }


        // WRAPPER CLASSES

        /*
         * Java primitive types and their corresponding wrapper classes:
         *
         * byte    -> Byte
         * short   -> Short
         * int     -> Integer
         * long    -> Long
         * float   -> Float
         * double  -> Double
         * char    -> Character
         * boolean -> Boolean
         *
         * Collections cannot store primitive types directly.
         * Wrapper classes provide reference types for these values.
         *
         * Autoboxing: primitive value -> wrapper object.
         * Unboxing: wrapper object -> primitive value.
         */

        // INTEGER ARRAYLIST

        List<Integer> integers = new ArrayList<>();

        // Autoboxing converts int values into Integer objects.
        integers.add(1);
        integers.add(2);
        integers.add(3);

        System.out.println("\nIntegers: " + integers);

        // Unboxing converts the Integer object into an int.
        int firstNumber = integers.get(0);

        System.out.println("First integer: " + firstNumber);


        // DOUBLE ARRAYLIST

        List<Double> decimals = new ArrayList<>();

        decimals.add(1.00);
        decimals.add(2.50);
        decimals.add(3.99);

        System.out.println("\nDecimals: " + decimals);

        // Unboxing converts the Double object into a double.
        double lastDecimal = decimals.get(2);

        System.out.println("Last decimal: " + lastDecimal);


        // BOOLEAN ARRAYLIST

        List<Boolean> booleans = new ArrayList<>();

        booleans.add(true);
        booleans.add(false);
        booleans.add(true);

        System.out.println("\nBooleans: " + booleans);

        // Unboxing converts the Boolean object into a boolean.
        boolean lastBoolean = booleans.get(2);

        System.out.println("Last boolean: " + lastBoolean);


        // ARRAYLIST WITH CHARACTERS

        List<Character> characters = new ArrayList<>();

        characters.add('A');
        characters.add('B');
        characters.add('C');

        System.out.println("\nCharacters: " + characters);


        // CLEARING AN ARRAYLIST

        integers.clear();

        System.out.println("\nIntegers after clear(): " + integers);
        System.out.println("Is the list empty? " + integers.isEmpty());


        // IMPORTANT ARRAYLIST METHODS
        //
        // add(element)       - Adds an element.
        // add(index, element)- Inserts an element at an index.
        // get(index)         - Returns the element at an index.
        // set(index, element)- Replaces an element.
        // remove(index)      - Removes the element at an index.
        // remove(object)     - Removes the first matching element.
        // size()             - Returns the number of elements.
        // contains(element)  - Checks whether an element exists.
        // indexOf(element)   - Returns the first matching index, or -1.
        // isEmpty()          - Checks whether the list is empty.
        // clear()            - Removes all elements.
    }
}
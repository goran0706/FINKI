package _01_fundamentals;

import java.util.Arrays;

public class _05_ReferenceTypes {

    static void main(String[] args) {

        /*
         * Primitive Types
         *
         * Java has eight primitive types:
         * byte, short, int, long, float, double, char, boolean.
         *
         * A primitive variable stores its value directly.
         */

        int number = 10;
        char character = 'A';
        boolean active = true;

        System.out.println("Number: " + number);
        System.out.println("Character: " + character);
        System.out.println("Active: " + active);


        /*
         * Reference Types
         *
         * Reference variables hold references to objects, rather than
         * storing the objects themselves.
         *
         * Examples include String, arrays, and instances of classes.
         */

        String greeting = "Hello World";

        int[] numbers = new int[3];
        numbers[0] = 1;
        numbers[1] = 2;
        numbers[2] = 3;

        System.out.println("\nGreeting: " + greeting);
        System.out.println("Array: " + Arrays.toString(numbers));


        /*
         * Printing a Reference
         *
         * Printing an array directly produces its type and hash-code-based
         * representation, not its elements.
         *
         * The exact output is not guaranteed to be the same between runs.
         */

        System.out.println("Array reference representation: " + numbers);
        System.out.println("Array contents: " + Arrays.toString(numbers));


        /*
         * Reference Assignment
         *
         * Assigning one reference variable to another copies the reference.
         * Both variables then refer to the same array.
         */

        int[] anotherReference = numbers;
        anotherReference[0] = 100;

        System.out.println("\nOriginal reference: " + Arrays.toString(numbers));
        System.out.println("Another reference: " + Arrays.toString(anotherReference));


        /*
         * Copying an Array
         *
         * Arrays.copyOf creates a new array containing the copied elements.
         * Changing the new array does not change the original array.
         */

        int[] copiedNumbers = Arrays.copyOf(numbers, numbers.length);
        copiedNumbers[0] = 999;

        System.out.println("\nOriginal array: " + Arrays.toString(numbers));
        System.out.println("Copied array: " + Arrays.toString(copiedNumbers));
    }
}
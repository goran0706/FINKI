package _01_fundamentals;

public class _08_Conversions {

    static void main(String[] args) {

        /*
         * Type Conversion
         *
         * Type conversion changes a value from one representation or type
         * to another.
         *
         * Common conversions include:
         * - String to primitive type
         * - Primitive type to String
         *
         * Parsing and converting values are not the same as boxing
         * and unboxing.
         */


        // 1. String to Integer

        String firstNumber = "10";
        String secondNumber = "20";

        int first = Integer.parseInt(firstNumber);
        int second = Integer.parseInt(secondNumber);

        int sum = first + second;

        System.out.println("Sum: " + sum);


        // 2. Integer to String

        String firstString = String.valueOf(first);
        String secondString = String.valueOf(second);

        // String concatenation joins the strings instead of adding numbers.
        String combined = firstString + secondString;

        System.out.println("First string: " + firstString);
        System.out.println("Second string: " + secondString);
        System.out.println("Concatenated strings: " + combined);


        // 3. String to Double

        String piString = "3.14159";
        double pi = Double.parseDouble(piString);

        System.out.println("\nParsed double: " + pi);


        // 4. Double to String

        String piAsString = String.valueOf(pi);

        System.out.println("Double as string: " + piAsString);


        // 5. Parsing Other Primitive Types

        byte byteValue = Byte.parseByte("100");
        short shortValue = Short.parseShort("1000");
        long longValue = Long.parseLong("100000");
        float floatValue = Float.parseFloat("2.5");
        boolean booleanValue = Boolean.parseBoolean("true");

        System.out.println("\nByte: " + byteValue);
        System.out.println("Short: " + shortValue);
        System.out.println("Long: " + longValue);
        System.out.println("Float: " + floatValue);
        System.out.println("Boolean: " + booleanValue);


        // 6. Invalid Numeric Input

        // Parsing an invalid numeric string throws NumberFormatException.
        // Uncomment the following line to see the exception:
        // int invalidNumber = Integer.parseInt("hello");


        /*
         * Boxing and Unboxing
         *
         * Boxing converts a primitive value into its corresponding wrapper
         * object. Unboxing extracts the primitive value from a wrapper object.
         *
         * String conversion and numeric parsing are not boxing or unboxing.
         */

        // Boxing: int to Integer
        Integer boxedNumber = Integer.valueOf(42);

        // Unboxing: Integer to int
        int unboxedNumber = boxedNumber;

        System.out.println("\nBoxed Integer: " + boxedNumber);
        System.out.println("Unboxed int: " + unboxedNumber);


        // 7. Primitive to String Using Concatenation

        int age = 30;
        String ageString = age + "";

        System.out.println("\nAge as string: " + ageString);

        // Prefer String.valueOf(age) for explicit, readable conversion.
    }
}
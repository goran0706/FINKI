package _01_fundamentals;

public class _09_WrapperClasses {

    static void main(String[] args) {

        /*
         * Wrapper Classes
         *
         * Each primitive type has a corresponding wrapper class:
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
         * Wrapper classes represent primitive values as objects.
         * They provide utility methods for parsing, conversion, comparison,
         * and other operations.
         */


        // 1. Creating Wrapper Objects

        int primitiveInt = 10;

        Integer integerObject1 = Integer.valueOf(primitiveInt);
        Integer integerObject2 = Integer.valueOf(10);

        double primitiveDouble = 3.14159;
        Double doubleObject = Double.valueOf(primitiveDouble);

        boolean primitiveBoolean = true;
        Boolean booleanObject = Boolean.valueOf(primitiveBoolean);

        System.out.println("Integer object: " + integerObject1);
        System.out.println("Double object: " + doubleObject);
        System.out.println("Boolean object: " + booleanObject);


        // 2. Autoboxing

        // Java automatically converts a primitive into its wrapper object.
        Integer boxedInt = primitiveInt;
        Double boxedDouble = primitiveDouble;
        Boolean boxedBoolean = primitiveBoolean;

        System.out.println("\nAutoboxed integer: " + boxedInt);
        System.out.println("Autoboxed double: " + boxedDouble);
        System.out.println("Autoboxed boolean: " + boxedBoolean);


        // 3. Unboxing

        // Java automatically converts a wrapper object into its primitive value.
        int unboxedInt = boxedInt;
        double unboxedDouble = boxedDouble;
        boolean unboxedBoolean = boxedBoolean;

        System.out.println("\nUnboxed integer: " + unboxedInt);
        System.out.println("Unboxed double: " + unboxedDouble);
        System.out.println("Unboxed boolean: " + unboxedBoolean);


        // 4. Parsing Strings

        String piString = "3.14159";
        double parsedDouble = Double.parseDouble(piString);

        String numberString = "42";
        int parsedInt = Integer.parseInt(numberString);

        System.out.println("\nParsed double: " + parsedDouble);
        System.out.println("Parsed integer: " + parsedInt);

        // Parsing converts a String into a primitive value.
        // It is not unboxing because the original value is a String, not a wrapper object.


        // 5. Converting Values to Strings

        String intString = String.valueOf(primitiveInt);
        String doubleString = String.valueOf(primitiveDouble);

        System.out.println("\nInteger as String: " + intString);
        System.out.println("Double as String: " + doubleString);

        // String.valueOf() converts a value into its String representation.
        // It is not boxing.


        // 6. Integer Caching

        // Java guarantees caching for Integer values from -128 through 127.
        // Autoboxing and Integer.valueOf() use this cache for values in that range.

        Integer cached1 = 120;
        Integer cached2 = 120;

        System.out.println("\nCached references are identical: " + (cached1 == cached2));

        // Values outside the guaranteed cache range may produce distinct objects.
        Integer number1 = 1000;
        Integer number2 = 1000;

        System.out.println("Large-value references are identical: " + (number1 == number2));

        // Use equals() to compare wrapper values rather than object references.
        System.out.println("Large-value objects are equal: " + number1.equals(number2));


        // 7. Wrapper Objects Can Be Null

        Integer nullableNumber = null;

        System.out.println("\nNullable wrapper: " + nullableNumber);

        // Unboxing a null wrapper throws NullPointerException.
        // Uncomment the following lines to see the exception:
        // int invalidNumber = nullableNumber;


        // 8. Wrapper Utility Methods

        System.out.println("\nInteger maximum: " + Integer.MAX_VALUE);
        System.out.println("Integer minimum: " + Integer.MIN_VALUE);
        System.out.println("Double maximum: " + Double.MAX_VALUE);
        System.out.println("Character for code 65: " + Character.valueOf((char) 65));
    }
}
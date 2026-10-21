package _01_fundamentals;

public class _07_Casting {

    static void main(String[] args) {

        /*
         * Type Casting
         *
         * Type conversion changes a value from one data type to another.
         *
         * Widening conversion:
         * Converts a value to a compatible type with a wider range.
         * Usually happens implicitly.
         *
         * Narrowing conversion:
         * Converts a value to a type with a smaller range or less precision.
         * Usually requires an explicit cast and may lose information.
         */


        // 1. Widening Conversion (Implicit)

        int intValue = 100;
        long longValue = intValue;
        double doubleValue = intValue;

        System.out.println("Integer: " + intValue);
        System.out.println("Long: " + longValue);
        System.out.println("Double: " + doubleValue);


        // 2. Narrowing Conversion (Explicit)

        double decimalValue = 3.14;
        float floatValue = (float) decimalValue;
        int narrowedValue = (int) decimalValue;

        System.out.println("\nOriginal double: " + decimalValue);
        System.out.println("Casted to float: " + floatValue);
        System.out.println("Casted to int: " + narrowedValue);

        // Casting a floating-point value to an integer discards the fractional part.
        // It does not round the value to the nearest integer.


        // 3. Widening and Narrowing Integral Types

        byte byteValue = 10;
        short shortValue = byteValue;
        int anotherIntValue = shortValue;
        long anotherLongValue = anotherIntValue;

        System.out.println("\nByte: " + byteValue);
        System.out.println("Short: " + shortValue);
        System.out.println("Int: " + anotherIntValue);
        System.out.println("Long: " + anotherLongValue);

        int value = 100;
        short narrowedShort = (short) value;
        byte narrowedByte = (byte) narrowedShort;

        System.out.println("Narrowed to short: " + narrowedShort);
        System.out.println("Narrowed to byte: " + narrowedByte);


        // 4. Information Loss During Narrowing

        int largeValue = 130;
        byte smallValue = (byte) largeValue;

        System.out.println("\nOriginal int: " + largeValue);
        System.out.println("Casted to byte: " + smallValue);

        // A byte ranges from -128 to 127.
        // Values outside this range wrap around when narrowed to byte.


        // 5. Floating-Point Precision

        double preciseValue = 123.456789;
        float reducedPrecision = (float) preciseValue;

        System.out.println("\nOriginal double: " + preciseValue);
        System.out.println("Casted to float: " + reducedPrecision);

        // float has less precision than double, so some digits may be lost.


        // 6. Numeric Promotion in Expressions

        byte first = 10;
        byte second = 20;

        // Arithmetic with byte, short, and char operands produces an int.
        int sum = first + second;

        System.out.println("\nSum: " + sum);

        // An explicit cast is required to store the result in a byte.
        byte byteSum = (byte) (first + second);

        System.out.println("Byte sum: " + byteSum);


        // 7. Widening Does Not Always Preserve Precision

        long largeInteger = 9_007_199_254_740_993L;
        double convertedDouble = largeInteger;

        System.out.println("\nOriginal long: " + largeInteger);
        System.out.println("Converted to double: " + convertedDouble);

        // A double cannot represent every long value exactly.
        // Widening can therefore lose integer precision when converting
        // from long to float or double.
    }
}
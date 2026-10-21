package _01_fundamentals;

public class _04_PrimitiveTypes {

    static void main(String[] args) {

        /*
         * Primitive Types
         *
         * Java has eight primitive types:
         *
         * Integral types:   byte, short, int, long
         * Floating-point:   float, double
         * Character:        char
         * Boolean:          boolean
         *
         * Primitive variables store primitive values directly.
         */

        // 1. Integral Types

        byte byteValue = 18;
        short shortValue = 18;
        int intValue = 18;
        long longValue = 18L;

        // 2. Floating-Point Types

        float floatValue = 20.50F;
        double doubleValue = 20.50;

        // 3. Character Type

        char characterValue = 'A';

        // 4. Boolean Type

        boolean booleanValue = true;

        // 5. Numeric Literals

        // Underscores improve readability and do not affect the value.
        int million = 1_000_000;
        long largeNumber = 1234_5678_9012_3456L;

        // Hexadecimal literals use the 0x prefix.
        long hexBytes = 0xFF_EC_DE_5EL;
        long hexWords = 0xCAFE_BABEL;
        long maxLong = 0x7FFF_FFFF_FFFF_FFFFL;

        // Binary literals use the 0b prefix.
        byte nybbles = 0b0010_0101;
        long binaryValue = 0b110100010_01101001_100L;

        // 6. Printing Values

        System.out.println("byte: " + byteValue);
        System.out.println("short: " + shortValue);
        System.out.println("int: " + intValue);
        System.out.println("long: " + longValue);
        System.out.println("float: " + floatValue);
        System.out.println("double: " + doubleValue);
        System.out.println("char: " + characterValue);
        System.out.println("boolean: " + booleanValue);

        System.out.println("Million: " + million);
        System.out.println("Large number: " + largeNumber);
        System.out.println("Hexadecimal: " + hexBytes);
        System.out.println("Hexadecimal word: " + hexWords);
        System.out.println("Maximum long: " + maxLong);
        System.out.println("Binary byte: " + nybbles);
        System.out.println("Binary value: " + binaryValue);
    }
}
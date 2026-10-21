package _01_fundamentals;

public class _03_Variables {

    static void main(String[] args) {

        // 1. Variable Declaration and Initialization

        int age;          // Declaration
        age = 33;         // Initialization

        int year = 2026;  // Declaration and initialization
        String name = "John";

        // Local Variable Type Inference (Java 10+)

        var num = 10;       // Inferred as int
        var message = "Hello, Java!"; // Inferred as String

        System.out.println("Age: " + age);
        System.out.println("Year: " + year);
        System.out.println("Name: " + name);
        System.out.println("Number: " + num);
        System.out.println("Message: " + message);


        // 2. Primitive Types

        byte byteValue = 10;          // 8-bit signed integer
        short shortValue = 1000;      // 16-bit signed integer
        int intValue = 100_000;       // 32-bit signed integer
        long longValue = 1_000_000L;  // 64-bit signed integer

        float floatValue = 3.14F;     // 32-bit floating-point
        double doubleValue = 3.14159; // 64-bit floating-point

        boolean booleanValue = true;  // true or false
        char charValue = 'A';         // Single UTF-16 code unit

        String stringValue = "Hello, Java!"; // Reference type, not primitive

        System.out.println("\nPrimitive and Reference Types:");
        System.out.println(byteValue);
        System.out.println(shortValue);
        System.out.println(intValue);
        System.out.println(longValue);
        System.out.println(floatValue);
        System.out.println(doubleValue);
        System.out.println(booleanValue);
        System.out.println(charValue);
        System.out.println(stringValue);


        // 3. Constants

        // The final keyword prevents reassignment after initialization.

        final int MAX_USERS = 100;
        final double PI = 3.14159;
        final String APPLICATION_NAME = "Java Playground";

        System.out.println("\nConstants:");
        System.out.println(MAX_USERS);
        System.out.println(PI);
        System.out.println(APPLICATION_NAME);


        // 4. Type Casting

        // Widening: converting a type to a wider compatible type.
        // Usually performed implicitly.

        int integerNumber = 100;
        double widenedNumber = integerNumber;

        System.out.println("\nWidening:");
        System.out.println(integerNumber);
        System.out.println(widenedNumber);


        // Narrowing: converting a type to a type with a smaller range
        // or less precision. An explicit cast is required.

        double decimalNumber = 3.14159;
        int narrowedNumber = (int) decimalNumber;

        System.out.println("\nNarrowing:");
        System.out.println(decimalNumber);
        System.out.println(narrowedNumber); // 3: fractional part is discarded


        // 5. Floating-Point Casting

        double myDouble = 3.14;
        float myFloat = (float) myDouble;
        double yourDouble = myFloat;

        System.out.println("\nFloating-Point Casting:");
        System.out.println(myDouble);
        System.out.println(myFloat);
        System.out.println(yourDouble);
    }
}
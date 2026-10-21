package _01_fundamentals;

public class _19_Number {

    static void main(String[] args) {

        /*
         * Number is an abstract class in java.lang.
         *
         * The following wrapper classes extend Number:
         * - Byte
         * - Short
         * - Integer
         * - Long
         * - Float
         * - Double
         *
         * Because these classes inherit from Number, a Number reference
         * can refer to an instance of any of them.
         *
         * However, wrapper objects of different numeric types cannot be
         * assigned directly to one another. For example, an Integer
         * cannot be assigned to a Double reference.
         */

        Integer integer = 7;

        // A Number reference can refer to an Integer object.
        Number number = integer;

        System.out.println("Value: " + number);
        System.out.println("Integer class: " + integer.getClass());
        System.out.println("Number reference's actual class: " + number.getClass());

        // Number provides methods to convert its value to primitive types.
        System.out.println("As int: " + number.intValue());
        System.out.println("As double: " + number.doubleValue());
        System.out.println("As long: " + number.longValue());

        // Number can also reference other numeric wrapper objects.
        Number decimal = 3.14;
        Number wholeNumber = 100L;

        System.out.println("Decimal: " + decimal);
        System.out.println("Decimal class: " + decimal.getClass());

        System.out.println("Long value: " + wholeNumber);
        System.out.println("Long class: " + wholeNumber.getClass());

        /*
         * Important:
         * - The reference type determines which members are accessible.
         * - The actual object determines the runtime class.
         * - Number does not extend to Character or Boolean because
         *   they are not numeric wrapper classes.
         */
    }
}
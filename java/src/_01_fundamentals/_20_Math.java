package _01_fundamentals;

public class _20_Math {

    static void main(String[] args) {

        /*
         * The java.lang.Math class provides static methods and constants
         * for common mathematical operations.
         *
         * No import is required because java.lang is imported automatically.
         */

        // 1. Absolute value
        System.out.println("abs(-10): " + Math.abs(-10));
        System.out.println("abs(-3.14): " + Math.abs(-3.14));

        // 2. Minimum and maximum
        System.out.println("min(10, 20): " + Math.min(10, 20));
        System.out.println("max(10, 20): " + Math.max(10, 20));

        // 3. Powers and square roots
        System.out.println("pow(2, 3): " + Math.pow(2, 3));
        System.out.println("sqrt(25): " + Math.sqrt(25));
        System.out.println("cbrt(27): " + Math.cbrt(27));

        // 4. Rounding
        System.out.println("round(3.4): " + Math.round(3.4));
        System.out.println("round(3.6): " + Math.round(3.6));
        System.out.println("floor(3.9): " + Math.floor(3.9));
        System.out.println("ceil(3.1): " + Math.ceil(3.1));

        // Math.round() returns long for double input and int for float input.
        // Math.floor() and Math.ceil() return double.

        // 5. Random numbers
        // Math.random() returns a double greater than or equal to 0.0
        // and strictly less than 1.0.
        double randomValue = Math.random();
        System.out.println("Random value [0.0, 1.0): " + randomValue);

        // Random integer from 1 to 10, inclusive.
        int randomNumber = (int) (Math.random() * 10) + 1;
        System.out.println("Random integer [1, 10]: " + randomNumber);

        // 6. Trigonometry
        // Trigonometric methods use radians, not degrees.
        double angleDegrees = 90;
        double angleRadians = Math.toRadians(angleDegrees);

        System.out.println("sin(90 degrees): " + Math.sin(angleRadians));
        System.out.println("cos(90 degrees): " + Math.cos(angleRadians));
        System.out.println("tan(45 degrees): " + Math.tan(Math.toRadians(45)));

        // Convert radians to degrees.
        System.out.println("PI radians in degrees: " + Math.toDegrees(Math.PI));

        // 7. Constants
        System.out.println("PI: " + Math.PI);
        System.out.println("E: " + Math.E);

        // 8. Sign and exponent operations
        System.out.println("signum(-15): " + Math.signum(-15));
        System.out.println("exp(1): " + Math.exp(1));
        System.out.println("log(E): " + Math.log(Math.E));
        System.out.println("log10(1000): " + Math.log10(1000));

        // 9. Integer overflow-safe arithmetic
        // These methods throw ArithmeticException if the result overflows.
        System.out.println("addExact(10, 20): " + Math.addExact(10, 20));
        System.out.println("multiplyExact(5, 6): " + Math.multiplyExact(5, 6));

        // 10. Clamp a value to a range using min() and max().
        int value = 120;
        int clampedValue = Math.max(0, Math.min(value, 100));

        System.out.println("Clamped value [0, 100]: " + clampedValue);
    }
}
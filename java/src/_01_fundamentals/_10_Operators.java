package _01_fundamentals;

public class _10_Operators {

    static void main(String[] args) {

        /*
         * Java Operators
         *
         * Operators perform operations on values and variables.
         *
         * Categories covered:
         * - Assignment
         * - Arithmetic
         * - Unary
         * - Compound assignment
         * - Relational and equality
         * - Logical
         * - Ternary
         * - Type comparison (instanceof)
         */


        // 1. Assignment Operators

        int number = 10;
        int anotherNumber = 5;

        System.out.println("Number: " + number);
        System.out.println("Another number: " + anotherNumber);


        // 2. Arithmetic Operators

        int sum = number + anotherNumber;
        int difference = number - anotherNumber;
        int product = number * anotherNumber;
        int quotient = number / anotherNumber;
        int remainder = number % anotherNumber;

        System.out.println("\nArithmetic Operators");
        System.out.println("Addition: " + sum);
        System.out.println("Subtraction: " + difference);
        System.out.println("Multiplication: " + product);
        System.out.println("Integer division: " + quotient);
        System.out.println("Remainder: " + remainder);

        // Integer division discards the fractional part.
        System.out.println("Integer division 7 / 2: " + (7 / 2));

        // Use floating-point operands when a fractional result is required.
        System.out.println("Floating-point division 7.0 / 2: " + (7.0 / 2));


        // 3. Unary Operators

        int counter = 5;

        System.out.println("\nUnary Operators");
        System.out.println("Initial value: " + counter);

        // Post-increment returns the current value, then increments.
        System.out.println("Post-increment: " + counter++);
        System.out.println("After post-increment: " + counter);

        // Pre-increment increments first, then returns the new value.
        System.out.println("Pre-increment: " + ++counter);

        // Post-decrement returns the current value, then decrements.
        System.out.println("Post-decrement: " + counter--);
        System.out.println("After post-decrement: " + counter);

        // Pre-decrement decrements first, then returns the new value.
        System.out.println("Pre-decrement: " + --counter);

        boolean active = true;
        System.out.println("Logical complement: " + !active);


        // 4. Compound Assignment Operators

        int result = 20;

        result += 5;  // Equivalent to: result = result + 5
        System.out.println("\nAfter += 5: " + result);

        result -= 3;  // Equivalent to: result = result - 3
        System.out.println("After -= 3: " + result);

        result *= 2;  // Equivalent to: result = result * 2
        System.out.println("After *= 2: " + result);

        result /= 4;  // Equivalent to: result = result / 4
        System.out.println("After /= 4: " + result);

        result %= 4;  // Equivalent to: result = result % 4
        System.out.println("After %= 4: " + result);

        // Other compound assignments include &=, |=, ^=, <<=, >>=, and >>>=.


        // 5. Relational and Equality Operators

        int myAge = 33;
        int yourAge = 25;

        System.out.println("\nRelational and Equality Operators");
        System.out.println("myAge > yourAge: " + (myAge > yourAge));
        System.out.println("myAge >= yourAge: " + (myAge >= yourAge));
        System.out.println("myAge < yourAge: " + (myAge < yourAge));
        System.out.println("myAge <= yourAge: " + (myAge <= yourAge));
        System.out.println("myAge == yourAge: " + (myAge == yourAge));
        System.out.println("myAge != yourAge: " + (myAge != yourAge));


        // 6. Logical Operators

        boolean isWinter = false;
        boolean isCold = true;

        System.out.println("\nLogical Operators");
        System.out.println("AND: " + (isWinter && isCold));
        System.out.println("OR: " + (isWinter || isCold));
        System.out.println("NOT: " + !isWinter);

        // && and || use short-circuit evaluation.
        // The second operand is evaluated only when necessary.
        int value = 0;

        boolean andResult = false;
        boolean orResult = true;

        System.out.println("Short-circuit AND: " + andResult);
        System.out.println("Short-circuit OR: " + orResult);
        System.out.println("Value remains unchanged: " + value);


        // 7. Ternary Operator

        int first = 15;
        int second = 25;

        int maximum = first > second ? first : second;

        System.out.println("\nTernary Operator");
        System.out.println("Maximum: " + maximum);

        // Equivalent conditional logic:
        int alternativeMaximum;

        if (first > second) {
            alternativeMaximum = first;
        } else {
            alternativeMaximum = second;
        }

        System.out.println("Maximum using if-else: " + alternativeMaximum);


        // 8. instanceof Operator

        String text = "Java operators";
        Object reference = text;

        System.out.println("\nType Comparison");
        System.out.println("text instanceof String: " + (text instanceof String));
        System.out.println("reference instanceof String: " + (reference instanceof String));
        System.out.println("reference instanceof Integer: " + (reference instanceof Integer));

        // instanceof checks whether an object is compatible with a given type.
        // It returns false for null references.
        String nullText = null;
        System.out.println("null instanceof String: " + (nullText instanceof String));
    }
}
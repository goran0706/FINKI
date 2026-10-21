package _01_fundamentals;

public class _23_HandlingExceptions {

    static void main(String[] args) {
        // 1. Handling a specific exception
        try {
            int result = 10 / 0;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero: " + e.getMessage());
        }

        // 2. Handling multiple exception types
        try {
            int[] numbers = {1, 2, 3};
            System.out.println(numbers[5]);
        } catch (ArrayIndexOutOfBoundsException | NullPointerException e) {
            System.out.println("Invalid array operation: " + e.getMessage());
        }

        // 3. Using multiple catch blocks
        try {
            String text = null;
            System.out.println(text.length());
        } catch (NullPointerException e) {
            System.out.println("The reference is null.");
        } catch (RuntimeException e) {
            System.out.println("A runtime error occurred: " + e.getMessage());
        }

        // 4. Using finally
        try {
            System.out.println("Executing try block.");
        } catch (Exception e) {
            System.out.println("An exception occurred.");
        } finally {
            System.out.println("Finally executes whether an exception occurs or not.");
        }

        // 5. Throwing an exception explicitly
        try {
            validateAge(15);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid age: " + e.getMessage());
        }

        // 6. Handling a checked exception
        try {
            processOrder(-1);
        } catch (InvalidOrderException e) {
            System.out.println("Order failed: " + e.getMessage());
        }

        // 7. Exception chaining
        try {
            performCalculation();
        } catch (ArithmeticException e) {
            System.out.println("Calculation failed: " + e.getMessage());
            System.out.println("Cause: " + e.getCause().getMessage());
        }

        // 8. Inspecting exception details
        try {
            int result = Integer.parseInt("abc");
            System.out.println(result);
        } catch (NumberFormatException e) {
            System.out.println("Exception type: " + e.getClass().getSimpleName());
            System.out.println("Message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    static void validateAge(int age) {
        if (age < 18) {
            throw new IllegalArgumentException("Age must be at least 18.");
        }
    }

    static void processOrder(int quantity) throws InvalidOrderException {
        if (quantity <= 0) {
            throw new InvalidOrderException("Quantity must be greater than zero.");
        }
    }

    static void performCalculation() {
        try {
            int result = 10 / 0;
            System.out.println(result);
        } catch (ArithmeticException cause) {
            ArithmeticException exception = new ArithmeticException("An arithmetic operation failed.");

            exception.initCause(cause);
            throw exception;
        }
    }

    // A checked exception must be caught or declared with throws.
    static class InvalidOrderException extends Exception {
        InvalidOrderException(String message) {
            super(message);
        }
    }
}
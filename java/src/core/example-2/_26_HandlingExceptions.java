import java.io.IOException;

public class _26_HandlingExceptions {
    public static void main(String[] args) {
        /*
         * Throwable - superclass of all Errors and Exceptions
         * - Errors are irreversible conditions in Java we cannot recover from errors.
         * - Exceptions can be handled if they occur.
         * */
        var num1 = 7;
        var num2 = 0;

        // single catch block
        try {
            var quotient = num1 / num2; // division by zero
            System.out.println(quotient);
        } catch (Exception e) {
            System.out.println("Handle division by zero!");
        }

        // multiple catch blocks
        try {
            var quotient = num1 / num2; // division by zero
            System.out.println(quotient);
        } catch (ArithmeticException e) {
            System.out.println("Handle division by zero!");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // multiple catch
        try {
            var quotient = num1 / num2; // division by zero
            System.out.println(quotient);
        } catch (NullPointerException | ArithmeticException e) {
            System.out.println("Handle division by zero!");
        }

        // try-catch-finally
        try {
            exceptionExampleMethod();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("Run anyway");
        }

        try {
            throwCustomException();
        } catch (CustomException e) {
            System.out.println(e);
            System.out.println(e.getMessage());
        }

        try {
            chainedExceptions();
        } catch (Exception e) {
            System.out.println("Caught:" + e);
            System.out.println("Caused by:" + e.getCause());
        }
    }

    static void exceptionExampleMethod() throws IOException {
        throw new IOException();
    }

    static void throwCustomException() throws CustomException {
        throw new CustomException("Custom exception");
    }

    static void chainedExceptions() {
        var error = new ArithmeticException("Div by zero");
        error.initCause(new NullPointerException());
        throw error;
    }
}

class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }

    @Override
    public String toString() {
        return "A CustomException just occurred.";
    }
}
package _01_fundamentals;

public class _28_LambdaExpressions {

    static void main(String[] args) {

        // A lambda expression provides an implementation of a functional interface.
        // Syntax: (parameters) -> expression
        Runnable task = () -> System.out.println("Running a task");

        task.run();

        // Lambda with one parameter.
        // Parentheses around a single parameter are optional when its type is omitted.
        Printer printer = message -> System.out.println(message);

        printer.print("Hello from a lambda expression");

        // Lambda with multiple parameters.
        // Parameter types can be inferred from the functional interface.
        Calculator addition = (a, b) -> a + b;

        System.out.println("Addition: " + addition.calculate(10, 5));

        // Explicit parameter types are also valid.
        Calculator multiplication = (int a, int b) -> a * b;

        System.out.println("Multiplication: " + multiplication.calculate(10, 5));

        // A block body uses braces and requires an explicit return
        // when the functional interface method returns a value.
        Calculator subtraction = (a, b) -> {
            int result = a - b;
            return result;
        };

        System.out.println("Subtraction: " + subtraction.calculate(10, 5));

        // A block body for a void method can contain multiple statements.
        Printer detailedPrinter = message -> {
            System.out.println("Message received:");
            System.out.println(message);
        };

        detailedPrinter.print("Multiple statements inside a lambda");

        // Lambdas can capture local variables that are final
        // or effectively final.
        String prefix = "Employee: ";

        Printer employeePrinter = name -> System.out.println(prefix + name);

        employeePrinter.print("Alice");

        // This would not compile because prefix is captured by a lambda
        // and cannot be reassigned afterward:
        //
        // prefix = "Name: ";

        // A lambda's target type comes from the functional interface.
        // The same lambda syntax cannot be assigned to an arbitrary type.
    }

    @FunctionalInterface
    interface Printer {
        void print(String message);
    }

    @FunctionalInterface
    interface Calculator {
        int calculate(int a, int b);
    }
}
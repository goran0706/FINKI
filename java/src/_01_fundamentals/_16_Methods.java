package _01_fundamentals;

public class _16_Methods {

    /*
     * Methods:
     * - Define reusable blocks of code that perform a task.
     * - Execute when called or invoked.
     * - Can accept parameters and return values.
     * - Can be declared static or instance methods.
     *
     * Method declaration:
     * [access modifier] [static] returnType methodName(parameters) {
     *     // Method body
     * }
     *
     * void means the method does not return a value.
     * return terminates method execution and optionally returns a value.
     * A non-void method must return a compatible value on every possible
     * execution path.
     */

    static void main(String[] args) {

        // Calling a method.
        sayHello();

        // Passing an argument to a method.
        printAge(25);

        // Returning a value from a method.
        int number = getNumber();
        System.out.println("Returned number: " + number);

        // Passing arguments and using the returned result.
        System.out.println("Addition: " + add(10, 20));

        // Calling a recursive method.
        System.out.println("Factorial of 5: " + factorial(5));

        // Calling a method that validates its input.
        System.out.println("Factorial of 0: " + factorial(0));
    }

    // Method with no parameters and no return value.
    private static void sayHello() {
        System.out.println("Hello, World!");
    }

    // Method with one parameter and no return value.
    private static void printAge(int age) {
        System.out.println("My age is " + age);
    }

    // Method with no parameters that returns an int.
    private static int getNumber() {
        return 10;
    }

    // Method with two parameters that returns their sum.
    private static int add(int a, int b) {
        return a + b;
    }

    /*
     * Recursive method:
     * A method that calls itself.
     *
     * Factorial:
     * 5! = 5 * 4 * 3 * 2 * 1 = 120
     * 0! = 1
     *
     * The base case stops the recursion.
     */
    private static long factorial(int n) {

        if (n < 0) {
            throw new IllegalArgumentException(
                    "Factorial is undefined for negative integers."
            );
        }

        if (n == 0 || n == 1) {
            return 1;
        }

        return n * factorial(n - 1);
    }
}
public class Main {
    public static void main(String[] args) {
        fibonacciForLoop();
    }

    public static void fizzBuzz(int n) {
        for (int i = 0; i < n; i++) {
            if (i % 3 == 0) {
                System.out.println("fizz");
            } else if (i % 5 == 0) {
                System.out.println("buzz");
            } else {
                System.out.println("fizzBuzz");
            }
        }
    }

    public static void fibonacciForLoop() {
        System.out.println(fibonacciRecursion(10));

        // Set it to the number of elements you want in the Fibonacci Series
        int maxNumber = 10;
        int previousNumber = 0;
        int nextNumber = 1;

        System.out.print("Fibonacci Series of " + maxNumber + " numbers:");

        for (int i = 1; i <= maxNumber; ++i) {
            System.out.print(previousNumber + " ");
            /* On each iteration, we are assigning second number
             * to the first number and assigning the sum of last two
             * numbers to the second number
             */
            int sum = previousNumber + nextNumber;
            previousNumber = nextNumber;
            nextNumber = sum;
        }
    }

    // Recursion
    public static int fibonacciRecursion(int n) {
        if (n == 0) {
            return 0;
        }

        if (n == 1 || n == 2) {
            return 1;
        }

        return fibonacciRecursion(n - 2) + fibonacciRecursion(n - 1);
    }

    private static int factorial(int n) {
        // Stopping case
        if (n <= 0) return 1;

        // Recursive case
        return n * factorial(n - 1);
    }

    private static void countDown(int n) {
        // Stopping case
        if (n < 0) return;

        // Recursive case
        System.out.println(n);
        countDown(n - 1);
    }

    private static void countUp(int from, int to) {
        // Stopping case
        if (from > to) return;

        // Recursive case
        System.out.println(from);
        countUp(from + 1, to);
    }
}


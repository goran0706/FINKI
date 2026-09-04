package exercises;

public class Recursion {
    public static void main(String[] args) {
        countDown(10);
        countUp(0, 10);
        factorial(5);
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

    private static int factorial(int n) {
        // Stopping case
        if (n <= 0) return 1;

        // Recursive case
        return n * factorial(n - 1);
    }
}

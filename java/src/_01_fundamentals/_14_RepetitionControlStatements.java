package _01_fundamentals;

public class _14_RepetitionControlStatements {

    static void main(String[] args) {

        /*
         * Repetition Control Statements
         *
         * Loops repeatedly execute a block of code while a condition
         * allows it.
         *
         * Java provides:
         * - while loop
         * - do-while loop
         * - for loop
         * - enhanced for loop
         *
         * Use break to terminate a loop and continue to skip the
         * remainder of the current iteration.
         */


        // 1. while Loop

        // Checks the condition before each iteration.
        // If the condition is initially false, the body never executes.

        int count = 0;

        while (count < 5) {
            System.out.println("while: " + count);
            count++;
        }


        // 2. do-while Loop

        // Executes the body before checking the condition.
        // The body always executes at least once.

        count = 5;

        do {
            System.out.println("do-while: " + count);
            count--;
        } while (count > 0);


        // 3. for Loop

        // Structure:
        // for (initialization; condition; update) { ... }
        //
        // Initialization executes once.
        // The condition is checked before each iteration.
        // The update executes after each iteration.

        for (int i = 0; i < 5; i++) {
            System.out.println("for: " + i);
        }


        // 4. Counting Backwards

        for (int i = 5; i > 0; i--) {
            System.out.println("Countdown: " + i);
        }


        // 5. continue Statement

        // Skips the remainder of the current iteration.

        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                continue;
            }

            System.out.println("Odd number: " + i);
        }


        // 6. break Statement

        // Terminates the loop immediately.

        for (int i = 0; i < 10; i++) {
            if (i == 5) {
                System.out.println("Stopping at: " + i);
                break;
            }

            System.out.println("Current number: " + i);
        }


        // 7. Nested Loops

        // A nested loop executes completely for each outer-loop iteration.

        for (int row = 1; row <= 3; row++) {
            for (int column = 1; column <= 3; column++) {
                System.out.print("* ");
            }

            System.out.println();
        }


        // 8. Enhanced for Loop

        // Iterates over each element in an array or other Iterable.

        int[] numbers = {10, 20, 30, 40, 50};

        for (int number : numbers) {
            System.out.println("Number: " + number);
        }
    }
}
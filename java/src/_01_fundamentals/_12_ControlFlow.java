package _01_fundamentals;

public class _12_ControlFlow {

    static void main(String[] args) {

        /*
         * Control Flow
         *
         * Control flow determines the order in which statements execute.
         *
         * _01_OOP categories:
         * - Sequential: statements execute in order.
         * - Selection: execution depends on a condition.
         * - Iteration: statements execute repeatedly in loops.
         *
         * Selection statements:
         * - if, else if, else
         * - switch
         * - Ternary operator (condition ? value1 : value2)
         *
         * Iteration statements:
         * - while
         * - do-while
         * - for
         * - enhanced for
         *
         * Loop control:
         * - break: terminates the nearest enclosing loop or switch.
         * - continue: skips the remainder of the current loop iteration.
         */


        // 1. Sequential Execution

        int firstNumber = 10;
        int secondNumber = 20;
        int sum = firstNumber + secondNumber;

        System.out.println("Sum: " + sum);


        // 2. if-else Statement

        int age = 18;

        if (age >= 18) {
            System.out.println("You are an adult.");
        } else {
            System.out.println("You are a minor.");
        }


        // 3. if-else-if Statement

        int score = 85;

        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else if (score >= 70) {
            System.out.println("Grade: C");
        } else if (score >= 60) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }


        // 4. Ternary Operator

        int number = 15;

        String result = number % 2 == 0 ? "Even" : "Odd";

        System.out.println("Number " + number + " is " + result + ".");


        // 5. switch Statement

        int day = 3;

        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            case 4:
                System.out.println("Thursday");
                break;
            case 5:
                System.out.println("Friday");
                break;
            case 6:
                System.out.println("Saturday");
                break;
            case 7:
                System.out.println("Sunday");
                break;
            default:
                System.out.println("Invalid day.");
        }

        // Without break, traditional switch cases can fall through
        // into subsequent cases.


        // 6. while Loop

        // Checks the condition before each iteration.
        int counter = 0;

        while (counter <= 5) {
            System.out.println("while: " + counter);
            counter++;
        }


        // 7. do-while Loop

        // Executes the body at least once because the condition
        // is checked after each iteration.
        counter = 10;

        do {
            System.out.println("do-while: " + counter);
            counter++;
        } while (counter < 10);


        // 8. for Loop

        // Initialization runs once; the condition is checked before
        // each iteration; the update runs after each iteration.
        for (int i = 0; i < 5; i++) {
            System.out.println("for: " + i);
        }


        // 9. Enhanced for Loop

        int[] numbers = {10, 20, 30, 40, 50};

        for (int value : numbers) {
            System.out.println("Array value: " + value);
        }


        // 10. continue Statement

        // Skips the remainder of the current iteration.
        for (int i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                continue;
            }

            System.out.println("Odd number: " + i);
        }


        // 11. break Statement

        // Terminates the loop immediately.
        for (int i = 0; i < 10; i++) {
            if (i == 5) {
                System.out.println("Stopping at " + i);
                break;
            }

            System.out.println("Current number: " + i);
        }


        // 12. Combining continue and break

        for (int i = 0; i < 10; i++) {
            if (i == 3 || i == 7) {
                continue;
            }

            if (i == 9) {
                break;
            }

            System.out.println("Processed number: " + i);
        }


        // 13. Nested Loops

        for (int row = 1; row <= 3; row++) {
            for (int column = 1; column <= 3; column++) {
                System.out.print("(" + row + ", " + column + ") ");
            }

            System.out.println();
        }
    }
}
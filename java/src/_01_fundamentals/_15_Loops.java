package _01_fundamentals;

public class _15_Loops {

    static void main(String[] args) {

        /*
         * Loops
         *
         * Loops execute a block of code repeatedly.
         *
         * - for loop: iterates using initialization, condition, and update.
         * - enhanced for loop: iterates over arrays and Iterable objects.
         */


        // 1. for Loop

        // Initialization: int i = 0
        // Condition: i < 5
        // Update: i++

        for (int i = 0; i < 5; i++) {
            System.out.println("Index: " + i);
        }


        // 2. Creating and Initializing an Array

        int[] numbers = new int[5];

        numbers[0] = 0;
        numbers[1] = 1;
        numbers[2] = 2;
        numbers[3] = 3;
        numbers[4] = 4;

        // Array elements are indexed from 0 to length - 1.
        // Uninitialized int array elements default to 0.

        System.out.println("\nArray length: " + numbers.length);


        // 3. Array Initialization Using an Array Literal

        int[] values = {1, 2, 3, 4, 5};


        // 4. Enhanced for Loop

        // Iterates over each element without requiring an index.

        System.out.println("\nNumbers:");

        for (int number : numbers) {
            System.out.println(number);
        }


        System.out.println("\nValues:");

        for (int value : values) {
            System.out.println(value);
        }


        // 5. Traditional for Loop with an Array

        // Use a traditional for loop when the index is required.

        System.out.println("\nValues with indexes:");

        for (int i = 0; i < values.length; i++) {
            System.out.println("Index " + i + ": " + values[i]);
        }
    }
}

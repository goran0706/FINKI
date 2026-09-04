package exercises;

import java.util.Random;

public class Loops {
    public static void main(String[] args) {
        Random rng = new Random();

        int[] numbers = new int[10];

        // Fill the numbers array
        for (int i = 0; i < numbers.length; i++) {
            numbers[i] = rng.nextInt(10);
        }

        // Print the numbers array
        for (int num : numbers) {
            System.out.println(num);
        }

        int[][] twoDArray = new int[5][10];

        for (int[] arr : twoDArray) {
            for (int num : arr) {
                num = rng.nextInt(10);
                System.out.println(num);
            }
        }

        // *
        // **
        // ***
        // ****
        // *****
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

        // *****
        //  ****
        //   ***
        //    **
        //     *
        for (int i = 1; i <= 5; i++) {
            // Spaces Loop
            for (int j = 1; j <= i - 1; j++) {
                System.out.print(" ");
            }

            // Stars Loop
            for (int k = 5; k >= i; k--) {
                System.out.print("*");
            }

            System.out.println();
        }
    }
}

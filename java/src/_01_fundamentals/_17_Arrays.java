package _01_fundamentals;

import java.util.Arrays;
import java.util.Iterator;

public class _17_Arrays {

    static void main(String[] args) {

        /*
         * Data Structures
         * Containers that store and organize data.
         *
         * Arrays:
         * - Store elements of the same type.
         * - Have a fixed length after creation.
         * - Use zero-based indices to access elements.
         * - Can store primitive values or object references.
         *
         * Array types:
         * - One-dimensional arrays.
         * - Multidimensional arrays, including two-dimensional arrays.
         */

        // ONE-DIMENSIONAL ARRAYS

        // 1. Declare and initialize an array with a fixed length.
        int[] numbers = new int[5];

        numbers[0] = 0;
        numbers[1] = 1;
        numbers[2] = 2;
        numbers[3] = 3;
        numbers[4] = 4;

        // 2. Declare and initialize an array using an array initializer.
        int[] values = {10, 20, 30, 40, 50};

        // Array elements can also be characters.
        char[] letters = {'A', 'B', 'C'};

        // Arrays.toString() prints a readable representation of a one-dimensional array.
        System.out.println("Letters: " + Arrays.toString(letters));
        System.out.println("Values: " + Arrays.toString(values));

        // The length field returns the number of elements.
        int length = numbers.length;
        System.out.println("\nArray length: " + length);

        // 3. Iterate using a traditional for loop.
        // Use the index when the element position is needed.
        System.out.println("\n--- Traditional for loop ---");

        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Index " + i + ": " + numbers[i]);
        }

        // 4. Iterate using an enhanced for loop (for-each).
        // Use this when the index is not needed.
        System.out.println("\n--- Enhanced for loop ---");

        for (int number : numbers) {
            System.out.println(number);
        }

        // 5. Iterate using an Iterator.
        // Arrays do not directly provide an Iterator, so a stream is used.
        System.out.println("\n--- Iterator ---");

        Iterator<Integer> iterator = Arrays.stream(numbers).iterator();

        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }

        // 6. Print an array directly.
        // This prints the array's type and identity, not its elements.
        System.out.println("\nArray reference: " + numbers);

        // Use Arrays.toString() to print the elements.
        System.out.println("Array elements: " + Arrays.toString(numbers));


        // TWO-DIMENSIONAL ARRAYS

        /*
         * A two-dimensional array is an array of arrays.
         * Each element of the outer array references an inner array.
         * Rows can have different lengths, so Java also supports jagged arrays.
         */

        int[][] matrix = new int[2][3];

        matrix[0][0] = 0;
        matrix[0][1] = 1;
        matrix[0][2] = 2;
        matrix[1][0] = 3;
        matrix[1][1] = 4;
        matrix[1][2] = 5;

        // Alternatively, initialize the entire matrix directly.
        int[][] anotherMatrix = {
                {0, 1, 2},
                {3, 4, 5}
        };

        System.out.println("\n--- Two-dimensional array ---");

        // 1. Iterate using nested traditional for loops.
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.println(
                        "Row " + i + ", column " + j + ": " + matrix[i][j]
                );
            }
        }

        // matrix.length is the number of rows.
        // matrix[i].length is the number of elements in row i.
        System.out.println("\nNumber of rows: " + matrix.length);
        System.out.println("Columns in first row: " + matrix[0].length);

        // 2. Iterate using nested enhanced for loops.
        System.out.println("\n--- Nested enhanced for loops ---");

        for (int[] row : matrix) {
            for (int number : row) {
                System.out.println(number);
            }
        }

        // 3. Print the complete two-dimensional array.
        // Arrays.deepToString() displays nested array contents.
        System.out.println("\nMatrix: " + Arrays.deepToString(anotherMatrix));


        // JAGGED ARRAYS

        // Rows can have different lengths.
        int[][] jaggedArray = {
                {1, 2},
                {3, 4, 5},
                {6}
        };

        System.out.println("\n--- Jagged array ---");

        for (int[] row : jaggedArray) {
            System.out.println(Arrays.toString(row));
        }
    }
}
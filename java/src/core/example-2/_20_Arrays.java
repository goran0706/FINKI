import java.util.Arrays;
import java.util.Iterator;

public class _20_Arrays {
    public static void main(String[] args) {
        /*
         * Data Structures - containers that hold data (collections of elements)
         *
         * Arrays:
         * - Are data structure of indexed elements of the same type
         * - Have fixed size
         * - Elements are accessed by their indices
         *
         * There are two types of arrays:
         * - One dimensional arrays
         * - Two dimensional arrays (matrices)
         * * */

        // ONE DIMENSIONAL ARRAY
        int[] letters = {'A', 'B', 'C'};
        System.out.println(Arrays.toString(letters));

        int[] numbers = new int[5];
        numbers[0] = 0;
        numbers[1] = 1;
        numbers[2] = 2;
        numbers[3] = 3;
        numbers[4] = 4;

        int length = numbers.length;
        System.out.println(length);

        // Using for-i
        for (int i = 0; i < length; i++) {
            System.out.println(i);
        }

        // Using for-each
        for (int num : numbers) {
            System.out.println(num);
        }

        // Using stream iterator
        Iterator<Integer> iterator = Arrays.stream(numbers).iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }


        // TWO DIMENSIONAL ARRAY
        int[][] twoDArray = new int[2][3];
        twoDArray[0][0] = 0;
        twoDArray[0][1] = 1;
        twoDArray[0][2] = 2;
        twoDArray[1][0] = 3;
        twoDArray[1][1] = 4;
        twoDArray[1][2] = 5;

        for (int i = 0; i < twoDArray.length; i++) {
            for (int j = 0; j < twoDArray[i].length; j++) {
                System.out.println(twoDArray[i][j]);
            }
        }

        for (int[] arr : twoDArray) {
            for (int num : arr) {
                System.out.println(num);
            }
        }

        Iterator<Integer> iteratorOuter = Arrays.stream(numbers).iterator();
        Iterator<Integer> iteratorInner = Arrays.stream(numbers).iterator();
        while (iteratorOuter.hasNext()) {
            while (iteratorInner.hasNext()) {
                System.out.println(iteratorInner.next());
            }
        }
    }
}

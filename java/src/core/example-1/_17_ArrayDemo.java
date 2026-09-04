package lessons;

import java.util.Arrays;
import java.util.Iterator;

public class _17_ArrayDemo {
    public static void main(String[] args) {
        // Data Structures
        // - Containers that hold data (collections of elements)

        // Arrays:
        // - Are data structures of elements of same type
        // - Have fixed size
        // - Elements are accessed by their indices

        // One dimensional array
        int[] numbers = new int[5];
        numbers[0] = 0;
        numbers[1] = 1;
        numbers[2] = 2;
        numbers[3] = 3;
        numbers[4] = 4;

        System.out.println("**** For...Loop ****");
        int length = numbers.length;
        for (int i = 0; i < length; i++) {
            int num = numbers[i];
            System.out.println(num);
        }

        System.out.println("**** For...Each ****");
        for (int num : numbers) {
            System.out.println(num);
        }

        System.out.println("**** Iterator ****");
        Iterator<Integer> iterator = Arrays.stream(numbers).iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }

        // Two dimensional array
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

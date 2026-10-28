package playground.exercises._01_java_intro;

/*
    За дадена низа од случајни броеви кои се внесуваат од стандарден влез, да се направи преместување на сите нули на почеток на низата.
    На стандарден излез да се испечати трансформираната низа.

    For example:

    Input:
    12
    1 9 8 4 0 0 2 7 0 6 0 9

    Result:
    Transformiranata niza e:
    0 0 0 0 1 9 8 4 2 7 6 9
*/

import java.util.Arrays;
import java.util.Scanner;

public class PushZero {

    // Time complexity: O(n²)
    // Space complexity: O(1)
    static void pushZerosToBeginning(int[] arr, int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                // Swap non-zero element with the next zero.
                if (arr[j] != 0 && arr[j + 1] == 0) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
    }

    // Time complexity: O(n)
    // Space complexity: O(n)
    static void pushZerosToBeginning2(int[] arr, int n) {
        int[] tmp = new int[n];
        int index = 0;

        // Count zeros to determine where non-zero elements should begin.
        for (int i = 0; i < n; i++) {
            if (arr[i] == 0) {
                index++;
            }
        }

        // Copy non-zero elements, preserving their original order.
        for (int i = 0; i < n; i++) {
            if (arr[i] != 0) {
                tmp[index++] = arr[i];
            }
        }

        // Copy the transformed elements back into the original array.
        System.arraycopy(tmp, 0, arr, 0, n);
    }

    // Time complexity: O(n)
    // Space complexity: O(1)
    static void pushZerosToBeginning3(int[] arr, int n) {
        int index = n - 1;

        // Move all non-zero elements to the end, preserving their order.
        for (int i = n - 1; i >= 0; i--) {
            if (arr[i] != 0) {
                arr[index--] = arr[i];
            }
        }

        // Fill the remaining positions with zeros.
        while (index >= 0) {
            arr[index--] = 0;
        }
    }

    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }

        System.out.println(Arrays.toString(numbers));
        pushZerosToBeginning2(numbers, n);
        System.out.println(Arrays.toString(numbers));
    }
}
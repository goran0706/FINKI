package AV4.Sort;

import java.util.Arrays;

public class MergeSort {

    static void main(String[] args) {

        // 1. Merge Sort: sort a single unsorted array.
        int[] array = {38, 27, 43, 3, 9, 82, 10};

        System.out.println("Original array: " + Arrays.toString(array));

        mergeSort(array);

        System.out.println("Sorted array:   " + Arrays.toString(array));


        // 2. Merge two unsorted arrays into one sorted array.
        int[] unsortedA = {38, 27, 43, 3};
        int[] unsortedB = {9, 82, 10};

        int[] unsortedResult = mergeSortUnsortedArrays(unsortedA, unsortedB);

        System.out.println("\nUnsorted A:     " + Arrays.toString(unsortedA));
        System.out.println("Unsorted B:     " + Arrays.toString(unsortedB));
        System.out.println("Sorted result:  " + Arrays.toString(unsortedResult));


        // 3. Merge two already-sorted arrays into one sorted array.
        int[] sortedA = {3, 27, 38, 43};
        int[] sortedB = {9, 10, 82};

        int[] sortedResult = mergeSortSortedArrays(sortedA, sortedB);

        System.out.println("\nSorted A:       " + Arrays.toString(sortedA));
        System.out.println("Sorted B:       " + Arrays.toString(sortedB));
        System.out.println("Merged result:  " + Arrays.toString(sortedResult));
    }

    // Sort a single array using Merge Sort.
    public static void mergeSort(int[] array) {
        int[] helper = new int[array.length];

        divideAndConquer(array, helper, 0, array.length - 1);
    }

    // Recursively divide the array and merge the sorted halves.
    private static void divideAndConquer(int[] array, int[] helper, int low, int high) {
        if (low >= high) {
            return;
        }

        int middle = low + (high - low) / 2;

        divideAndConquer(array, helper, low, middle);
        divideAndConquer(array, helper, middle + 1, high);

        merge(array, helper, low, middle, high);
    }

    // Merge two sorted sections of the original array.
    private static void merge(int[] array, int[] helper, int low, int middle, int high) {
        System.arraycopy(array, low, helper, low, high - low + 1);

        int i = low;
        int j = middle + 1;
        int k = low;

        while (i <= middle && j <= high) {
            if (helper[i] <= helper[j]) {
                array[k++] = helper[i++];
            } else {
                array[k++] = helper[j++];
            }
        }

        while (i <= middle) {
            array[k++] = helper[i++];
        }

        while (j <= high) {
            array[k++] = helper[j++];
        }
    }

    // Merge two unsorted arrays into one sorted array using Merge Sort.
    public static int[] mergeSortUnsortedArrays(int[] arrayA, int[] arrayB) {
        int[] result = new int[arrayA.length + arrayB.length];

        System.arraycopy(arrayA, 0, result, 0, arrayA.length);
        System.arraycopy(arrayB, 0, result, arrayA.length, arrayB.length);

        int[] helper = new int[result.length];

        // Sort the combined array using an independent Merge Sort implementation.
        for (int width = 1; width < result.length; width *= 2) {
            for (int low = 0; low < result.length - width; low += 2 * width) {
                int middle = low + width - 1;
                int high = Math.min(low + 2 * width - 1, result.length - 1);

                System.arraycopy(result, low, helper, low, high - low + 1);

                int i = low;
                int j = middle + 1;
                int k = low;

                while (i <= middle && j <= high) {
                    if (helper[i] <= helper[j]) {
                        result[k++] = helper[i++];
                    } else {
                        result[k++] = helper[j++];
                    }
                }

                while (i <= middle) {
                    result[k++] = helper[i++];
                }

                while (j <= high) {
                    result[k++] = helper[j++];
                }
            }

            if (width > result.length / 2) {
                break;
            }
        }

        return result;
    }

    // Merge two already-sorted arrays into one sorted array.
    public static int[] mergeSortSortedArrays(int[] arrayA, int[] arrayB) {
        int[] result = new int[arrayA.length + arrayB.length];

        int i = 0;
        int j = 0;
        int k = 0;

        while (i < arrayA.length && j < arrayB.length) {
            if (arrayA[i] <= arrayB[j]) {
                result[k++] = arrayA[i++];
            } else {
                result[k++] = arrayB[j++];
            }
        }

        while (i < arrayA.length) {
            result[k++] = arrayA[i++];
        }

        while (j < arrayB.length) {
            result[k++] = arrayB[j++];
        }

        return result;
    }
}
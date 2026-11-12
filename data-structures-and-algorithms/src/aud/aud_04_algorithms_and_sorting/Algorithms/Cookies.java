package aud.aud_04_algorithms_and_sorting.Algorithms;

// ========================================
// Алчни алгоритми
// ========================================

// Задача 1)
// Имаме N колачиња кои треба да ги поделиме на М деца.
// Секое од колачињата е со дадена големина.
// Секое од децата има желба за колаче со минимум посакувана големина.
// Наша задача е да ги распределиме колачињата така што најголем дел од децата ќе бидат задоволни.

public class Cookies {

    static void main(String[] args) {
        int[] originalSizes = {4, 1, 12, 4, 8};
        int[] desiredSizes = {2, 5, 4, 3, 11};

        bubbleSort(originalSizes);
        bubbleSort(desiredSizes);

        int cookieIndex = 0;
        int childIndex = 0;
        int satisfied = 0;

        while (cookieIndex < originalSizes.length && childIndex < desiredSizes.length) {

            // Check whether the current cookie satisfies the current child.
            if (originalSizes[cookieIndex] >= desiredSizes[childIndex]) {
                System.out.println("Child desired size: " + desiredSizes[childIndex] + ", Cookie size: " + originalSizes[cookieIndex]);

                satisfied++;
                childIndex++;
            }

            // Move to the next cookie, whether it was assigned or discarded.
            cookieIndex++;
        }

        System.out.println("\nSatisfied children: " + satisfied);
        System.out.println("Unsatisfied children: " + (desiredSizes.length - satisfied));
    }

    // Sort the array in ascending order using Bubble Sort.
    public static void bubbleSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[i]) {
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    }
}
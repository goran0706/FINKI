package playground._01_complexity;

import java.util.Scanner;

public class Algorithm3 {
    static void main() {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int[] a = new int[n];

        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }

        System.out.println(max_subsequence_sum(a, n));
    }

    private static int max_subsequence_sum(int[] a, int n) {
        return max_sub_sum(a, 0, n - 1);
    }

    /**
     * Finds the maximum subsequence sum using the Divide and Conquer approach.
     *
     * <p>Algorithm steps:</p>
     * <ol>
     *     <li>Split the array into two halves.</li>
     *     <li>Recursively find the maximum sum in the left half.</li>
     *     <li>Recursively find the maximum sum in the right half.</li>
     *     <li>Find the maximum crossing sum by combining the left and right borders.</li>
     *     <li>Compare all three sums and return the largest.</li>
     *     <li>Repeat recursively until only one element remains (base case).</li>
     * </ol>
     *
     * <p>Recursion finds the maximum inside each half, while the two border
     * loops find the maximum across both halves.</p>
     *
     * @param a     the input array
     * @param left  the starting index
     * @param right the ending index
     * @return the maximum subsequence sum
     */
    private static int max_sub_sum(int[] a, int left, int right) {

        // Base Case
        if (left == right) {
            return Math.max(a[left], 0);
        }

        int center = (left + right) / 2;

        // Maximum sum in left and right halves
        int max_left_sum = max_sub_sum(a, left, center);
        int max_right_sum = max_sub_sum(a, center + 1, right);

        // Maximum sum on the left border
        int max_left_border_sum = 0;
        int left_border_sum = 0;

        for (int i = center; i >= left; i--) {
            left_border_sum += a[i];

            if (left_border_sum > max_left_border_sum) {
                max_left_border_sum = left_border_sum;
            }
        }

        // Maximum sum on the right border
        int max_right_border_sum = 0;
        int right_border_sum = 0;

        for (int i = center + 1; i <= right; i++) {
            right_border_sum += a[i];

            if (right_border_sum > max_right_border_sum) {
                max_right_border_sum = right_border_sum;
            }
        }

        // Return the maximum of the three possibilities
        return Math.max(Math.max(max_left_sum, max_right_sum), max_left_border_sum + max_right_border_sum);
    }
}

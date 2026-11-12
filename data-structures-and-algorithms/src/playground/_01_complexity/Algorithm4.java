package playground._01_complexity;

import java.util.Scanner;

public class Algorithm4 {
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
        int i = 0;
        int curr_sum = 0;
        int max_sum = 0;

        int best_i = -1;
        int best_j = -1;

        for (int j = 0; j < n; j++) {
            curr_sum += a[j];

            if (curr_sum > max_sum) {
                max_sum = curr_sum;
                best_i = i;
                best_j = j;
            } else if (curr_sum < 0) {
                i = j + 1;
                curr_sum = 0;
            }
        }

        System.out.println("Start: " + best_i);
        System.out.println("End: " + best_j);

        return max_sum;
    }
}

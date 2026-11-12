package playground._01_complexity;

import java.util.Scanner;

/*
    Да се најде најголемата позитивна подсума во низа од n цели броеви!

    Пример:
    За влез: -2, 11, -4, 13, -5, -2, одговорот е 20 (a2 до a4).
*/

public class Algorithm1 {
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
        int max_sum = 0;
        int best_i = -1;
        int best_j = -1;

        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int curr_sum = 0;

                for (int k = i; k <= j; k++) {
                    curr_sum += a[k];
                }

                if (curr_sum > max_sum) {
                    max_sum = curr_sum;
                    best_i = i;
                    best_j = j;
                }
            }
        }

        System.out.println("Start: " + best_i);
        System.out.println("End: " + best_j);

        return max_sum;
    }
}


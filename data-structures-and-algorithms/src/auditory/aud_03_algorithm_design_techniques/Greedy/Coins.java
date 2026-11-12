package aud.aud_03_algorithm_design_techniques.Greedy;

// ========================================
// Алчни алгоритми
// ========================================

// Задача 3)
// Дадени се парички со одредена вредност (постојат парички од 50, 10, 5, 2 и 1 денар),
// и притоа бројот на парички од секоја вредност е неограничен.
// За дадена сума да се определи најмалиот број на парички кои се потребни да се формира таа сума.

import java.util.Scanner;

public class Coins {

    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter amount: ");
        int amount = scanner.nextInt();

        int[] coins = {50, 10, 5, 2, 1};

        System.out.println("Minimum number of coins: " + minimumCoins(amount, coins));
    }

    // Greedy: Always select the largest coin that does not exceed the remaining amount.
    public static int minimumCoins(int amount, int[] coins) {
        int count = 0;

        for (int coin : coins) {
            count += amount / coin;
            amount %= coin;
        }

        return count;
    }
}
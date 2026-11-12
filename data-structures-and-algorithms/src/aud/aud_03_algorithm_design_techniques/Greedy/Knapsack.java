package aud.aud_03_algorithm_design_techniques.Greedy;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

// ========================================
// Алчни алгоритми
// ========================================
// Проблем на пакување на ранец (Knapsack Problem)
// ========================================
// Задача 4)
// Студент има куфер со максимална тежина од 20 кг.
// Треба да избере предмети со максимална вкупна вредност.
//
// 1. Fractional Knapsack:
//    Предметите може да се делат на помали делови.
//    Се користи Greedy алгоритам.
//
// 2. 0-1 Knapsack:
//    Предметите не може да се делат.
//    Се користи Dynamic Programming.

public class Knapsack {
    static void main(String[] args) {
        List<Item> items = new ArrayList<>();
        items.add(new Item("Cards", 0.5, 5));
        items.add(new Item("Book", 20, 150));
        items.add(new Item("Clothes", 10, 200));
        items.add(new Item("CD Player", 5, 80));

        double capacity = 20;

        // Fractional Knapsack - Greedy Algorithm
        System.out.println("Fractional Knapsack:");
        List<Item> fractionalItems = fractionalKnapsack(items, capacity);

        for (Item item : fractionalItems) {
            System.out.println(item);
        }

        // 0-1 Knapsack - Dynamic Programming
        System.out.println("\n0-1 Knapsack:");
        List<Item> selectedItems = zeroOneKnapsack(items, capacity);

        for (Item item : selectedItems) {
            System.out.println(item);
        }
    }

    // Greedy: Select items with the highest value-to-weight ratio first.
    // Items can be divided when the remaining capacity is insufficient.
    public static List<Item> fractionalKnapsack(List<Item> items, double capacity) {
        List<Item> sortedItems = new ArrayList<>(items);
        List<Item> selectedItems = new ArrayList<>();

        // Sort items by value-to-weight ratio in descending order.
        sortedItems.sort(Comparator.comparingDouble((Item item) -> item.ratio).reversed());

        double remainingWeight = capacity;

        for (Item item : sortedItems) {
            if (remainingWeight <= 0) {
                break;
            }

            if (item.weight <= remainingWeight) {
                selectedItems.add(item);
                remainingWeight -= item.weight;
            } else {
                // Take only the fraction that fits into the remaining capacity.
                double fraction = remainingWeight / item.weight;
                selectedItems.add(new Item(item.name + " (fractional)", remainingWeight, item.value * fraction));
                remainingWeight = 0;
            }
        }

        return selectedItems;
    }

    // Dynamic Programming: Each item is either selected completely or not selected.
    // Multiply weights and capacity by 2 to represent 0.5 kg using integers.
    public static List<Item> zeroOneKnapsack(List<Item> items, double capacity) {
        int n = items.size();
        int maxWeight = (int) (capacity * 2);

        int[][] dp = new int[n + 1][maxWeight + 1];

        // Build the DP table: dp[i][w] represents the maximum value
        // obtainable using the first i items with capacity w.
        for (int i = 1; i <= n; i++) {
            int weight = (int) (items.get(i - 1).weight * 2);
            int value = (int) items.get(i - 1).value;

            for (int w = 0; w <= maxWeight; w++) {
                // Option 1: Do not select the current item.
                dp[i][w] = dp[i - 1][w];

                // Option 2: Select the current item, if it fits.
                if (weight <= w) {
                    dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weight] + value);
                }
            }
        }

        // Reconstruct the selected items by tracing the DP table backwards.
        List<Item> selectedItems = new ArrayList<>();
        int remainingWeight = maxWeight;

        for (int i = n; i > 0; i--) {
            if (dp[i][remainingWeight] != dp[i - 1][remainingWeight]) {
                Item item = items.get(i - 1);
                selectedItems.add(item);
                remainingWeight -= (int) (item.weight * 2);
            }
        }

        return selectedItems;
    }

    static class Item {
        String name;
        double weight;
        double value;
        double ratio;

        public Item(String name, double weight, double value) {
            this.name = name;
            this.weight = weight;
            this.value = value;
            this.ratio = value / weight;
        }

        @Override
        public String toString() {
            return name + " | Weight: " + weight + " kg | Value: " + value;
        }
    }
}
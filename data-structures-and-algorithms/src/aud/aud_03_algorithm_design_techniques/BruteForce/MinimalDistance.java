package aud.aud_03_algorithm_design_techniques.BruteForce;

import java.util.Scanner;

// ========================================
// Техника на груба сила (brute force)
// ========================================

// Задача 1)
// Дадени се N точки (N >= 2) во дводимензионален простор.
// Пресметајте кое е најмалото растојание помеѓу две точки.

public class MinimalDistance {

    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();

        double[] x = new double[n];
        double[] y = new double[n];

        // Read coordinates of all points.
        for (int i = 0; i < n; i++) {
            x[i] = scanner.nextDouble();
            y[i] = scanner.nextDouble();
        }

        double minDistance = Double.MAX_VALUE;

        // Compare every pair of points.
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {

                double dx = x[i] - x[j];
                double dy = y[i] - y[j];

                // Calculate Euclidean distance.
                double distance = Math.sqrt(dx * dx + dy * dy);

                minDistance = Math.min(minDistance, distance);
            }
        }

        System.out.println(minDistance);

        scanner.close();
    }
}
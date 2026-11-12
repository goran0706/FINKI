package aud.aud_03_algorithm_design_techniques.BruteForce;

// ========================================
// Техника на груба сила (brute force)
// ========================================

// Задача 2)
// Дадена е шаховска табла.
// Пресметајте на колку различни начини можат да се постават две кралици без да се напаѓаат една со друга.
// Две кралици се напаѓаат ако се наоѓаат во ист ред, колона или дијагонала.

public class ChessStrategy {

    static void main(String[] args) {
        int size = 8;
        int count = 0;

        // Try every possible pair of positions.
        for (int row1 = 0; row1 < size; row1++) {
            for (int col1 = 0; col1 < size; col1++) {

                for (int row2 = row1; row2 < size; row2++) {
                    for (int col2 = 0; col2 < size; col2++) {

                        // Skip the same position and duplicate pairs.
                        if (row1 == row2 && col1 >= col2) {
                            continue;
                        }

                        // Check whether the queens attack each other.
                        boolean sameRow = row1 == row2;
                        boolean sameColumn = col1 == col2;
                        boolean sameDiagonal = Math.abs(row1 - row2) == Math.abs(col1 - col2);

                        if (!sameRow && !sameColumn && !sameDiagonal) {
                            count++;
                        }
                    }
                }
            }
        }

        System.out.println(count);
    }
}
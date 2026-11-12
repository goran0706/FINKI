/*
    ============================================================
    TASK 7
    ============================================================
    Од матрица да се генерира низа каде секој елемент е најоддалечениот од аритметичката средина во соодветната редица.
*/
#include <iostream>
#include <cmath>
using namespace std;


int main() {
    int rows, cols;
    cin >> rows >> cols;

    int matrix[100][100];
    int arr[100];

    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            cin >> matrix[i][j];
        }
    }

    for (int i = 0; i < rows; i++) {
        // 1. Најди ја сумата на елементите во тековната редица
        int sum = 0;
        for (int j = 0; j < cols; j++) {
            sum += matrix[i][j];
        }

        // 2. Пресметај ја аритметичката средина
        double average = double(sum) / cols;

        // 3. Најди го најоддалечениот елемент од аритметичката средина
        int furthest = matrix[i][0];
        double maxDiff = abs(matrix[i][0] - average);

        for (int j = 1; j < cols; j++) {
            double currentDiff = abs(matrix[i][j] - average);

            if (currentDiff > maxDiff) {
                maxDiff = currentDiff;
                furthest = matrix[i][j];
            }
        }

        // 4. Зачувај го елементот во низата
        arr[i] = furthest;
    }

    for (int i = 0; i < rows; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    return 0;
}

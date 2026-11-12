/*
    ============================================================
    TASK 4
    ============================================================
    Еден елемент од матрица ја дели матрицата на 4 квадранти.
    Елементот припаѓа во четвртиот квадрант.

    Да се најдат сумите на квадрантите и да се испечатат по ред: Q1, Q2, Q3, Q4.
    Ако квадрант не постои → 0.
*/
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int rows, cols;
    cin >> rows >> cols;

    vector<vector<int> > matrix(rows, vector<int>(cols));
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            cin >> matrix[i][j];
        }
    }

    // Индекси на елементот кој ја дели матрицата
    int r, c;
    cin >> r >> c;

    // Иницијализација на сумите за четирите квадранти
    int sumQ1 = 0, sumQ2 = 0, sumQ3 = 0, sumQ4 = 0;

    // Проверка дали внесените индекси се валидни во рамките на матрицата
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
        // Q1: Top-Right
        // - Rows: Start at 0, stop before r (i < r).
        // - Columns: Start exactly at c, go until the end (j < cols).
        // - Code: for (int i = 0; i < r; ...) $\rightarrow$ for (int j = c; j < cols; ...)

        // Q1: Горе-десно (редови < r, колони >= c)
        for (int i = 0; i < r; ++i) {
            for (int j = c; j < cols; ++j) {
                sumQ1 += matrix[i][j];
            }
        }

        // Q2: Top-Left
        // - Rows: Start at 0, stop before r (i < r).
        // - Columns: Start at 0, stop before c (j < c).
        // - Code: for (int i = 0; i < r; ...) $\rightarrow$ for (int j = 0; j < c; ...)

        // Q2: Горе-лево (редови < r, колони < c)
        for (int i = 0; i < r; ++i) {
            for (int j = 0; j < c; ++j) {
                sumQ2 += matrix[i][j];
            }
        }

        // Q3: Bottom-Left
        // - Rows: Start exactly at r, go until the end (i < rows).
        // - Columns: Start at 0, stop before c (j < c).
        // - Code: for (int i = r; i < rows; ...) $\rightarrow$ for (int j = 0; j < c; ...)

        // Q3: Долу-лево (редови >= r, колони < c)
        for (int i = r; i < rows; ++i) {
            for (int j = 0; j < c; ++j) {
                sumQ3 += matrix[i][j];
            }
        }
        // Q4: Bottom-Right (Includes the divider element)
        // - Rows: Start exactly at r, go until the end (i < rows).
        // - Columns: Start exactly at c, go until the end (j < cols).
        // - Code: for (int i = r; i < rows; ...) $\rightarrow$ for (int j = c; j < cols; ...)

        // Q4: Долу-десно (редови >= r, колони >= c) -> Го вклучува и самиот елемент
        for (int i = r; i < rows; ++i) {
            for (int j = c; j < cols; ++j) {
                sumQ4 += matrix[i][j];
            }
        }
    }

    // Печатење на резултатите по бараниот редослед
    cout << "Q1: " << sumQ1 << endl;
    cout << "Q2: " << sumQ2 << endl;
    cout << "Q3: " << sumQ3 << endl;
    cout << "Q4: " << sumQ4 << endl;

    return 0;
}

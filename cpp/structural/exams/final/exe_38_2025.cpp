/*
    === 4. ===
    Од стандарден влез се внесува матрица со димензии m и n,
    Се внесуваат координати и што претставуваат центар на ромб,
    Треба да се пресмета сумата на сите елементи во ромбот и најголемиот можен ромб во матрицата
*/
#include <iostream>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    int m, n;
    cin >> m >> n;

    int a[100][100];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
        }
    }

    int x, y;
    cin >> x >> y;

    // 1. Прво проверуваме дали центарот е воопшто внатре во матрицата
    if (x < 0 || x >= m || y < 0 || y >= n) {
        cout << 0 << endl;
        return 0;
    }

    // 2. Пресметка на максималниот можен радиус 'r'
    int max_up = x;
    int max_down = m - 1 - x;
    int max_left = y;
    int max_right = n - 1 - y;
    int r = min({max_up, max_down, max_left, max_right});

    int sum = 0;

    // 3. Оптимизирано изминување: само во правоаголникот што го опкружува ромбот
    for (int i = x - r; i <= x + r; i++) {
        for (int j = y - r; j <= y + r; j++) {
            // Условот за Менхетен растојание
            if (abs(i - x) + abs(j - y) <= r) {
                sum += a[i][j];
            }
        }
    }

    cout << sum << endl;

    return 0;
}

/*
    === 13. ===
    Se vnesuvaat m i n (dimenziite na matricata), potoa se vnesuvaat elementite na matricata, i se vnesuvaat koordinati p, q.
    Tockata vo red p i kolona q ke bide centar na romb.
    Celta e da se presmeta sumata na elementite vo toj romb.
    Inaku treba nie samite da go najdime najgolemiot romb sto moze da se formira.
*/
#include <iostream>
#include <algorithm>
#include <cmath> // За abs
using namespace std;

int main() {
    int m, n;
    cin >> m >> n;

    int A[100][100];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cin >> A[i][j];
        }
    }

    int p, q;
    cin >> p >> q;

    // 1. Пресметка на максималното растојание (радиус) до секој од четирите рабoви
    int max_up = p; // Растојание од редица p до почетокот (редица 0)
    int max_down = m - 1 - p; // Растојание од редица p до крајот (редица m-1)
    int max_left = q; // Растојание од колона q до почетокот (колона 0)
    int max_right = n - 1 - q; // Растојание од колона q до крајот (колона n-1)

    // Најмалото од овие растојанија го одредува најголемиот можен симетричен ромб
    int r = min({max_up, max_down, max_left, max_right});
    int sum = 0;

    // 2. Поминување низ матрицата и собирање на елементите внатре во ромбот
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Менхетен растојание од (i, j) до центарот (p, q)
            if (abs(i - p) + abs(j - q) <= r) {
                sum += A[i][j];
            }
        }
    }

    cout << sum << endl;

    return 0;
}

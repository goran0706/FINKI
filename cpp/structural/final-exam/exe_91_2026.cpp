// Se vnesuvaat m i n (dimenziite na matricata), potoa se vnesuvaat elementite na matricata, i se vnesuvaat koordinati p, q.
// Tockata vo red p i kolona q ke bide centar na romb.
// Celta e da se presmeta sumata na elementite vo toj romb.
// Inaku treba nie samite da go najdime najgolemiot romb sto moze da se formira.
#include <iostream>
#include <cmath> // потребно за abs()
using namespace std;

int main() {
    int n, m;
    cin >> n >> m; // n = редици, m = колони

    int matrix[100][100];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    int p, q;
    cin >> p >> q; // p = редица на центарот, q = колона на центарот

    // 1. Чекор: Го наоѓаме МАКСИМАЛНИОТ радиус
    int dist_top = p;
    int dist_bottom = (n - 1) - p;
    int dist_left = q;
    int dist_right = (m - 1) - q;

    int max_r = dist_top;
    if (dist_bottom < max_r) max_r = dist_bottom;
    if (dist_left < max_r) max_r = dist_left;
    if (dist_right < max_r) max_r = dist_right;

    int total_sum = 0;

    // 2. Чекор: Го проверуваме целиот квадратен регион околу центарот одеднаш
    for (int i = p - max_r; i <= p + max_r; i++) {
        for (int j = q - max_r; j <= q + max_r; j++) {
            // Користиме '<=' за да ги опфатиме центарот, внатрешните слоеви и надворешната контура одеднаш.
            if (abs(i - p) + abs(j - q) <= max_r) {
                total_sum += matrix[i][j];
            }
        }
    }

    cout << "Najgolemiot romb ima radius: " << max_r << endl;
    cout << "Zbirot на elementite vo rombot e: " << total_sum << endl;

    return 0;
}

// 2.
// Se vnesuvaat m i n (dimenziite na matricata), potoa se vnesuvaat elementite na matricata, i se vnesuvaat koordinati p, q.
// Tockata vo red p i kolona q ke bide centar na romb. Celta e da se presmeta sumata na elementite vo toj romb.
// Inaku treba nie samite da go najdime najgolemiot romb sto moze da se formira.
#include <iostream>
#include <algorithm>
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

    int max_r_up = p;
    int max_r_down = (n - 1) - p;
    int max_r_left = q;
    int max_r_right = (n - 1) - q;
    int r = min({max_r_up, max_r_down, max_r_left, max_r_right});
    int sum = 0;

    // BAD
    // for (int i = 0; i < n; i++) {
    //     for (int j = 0; j < m; j++) {
    //         // Условот за ромб со радиус 'r': (i - x) + (j - y) == r
    //         if (abs(i - p) + abs(j - q) == r) {
    //             cout << "Element: [" << i << "]:[" << j << "]" << endl;
    //             sum += A[i][j];
    //         }
    //     }
    // }

    // GOOD
    for (int i = p - r; i < p + r; i++) {
        for (int j = q - r; j < q + r; j++) {
            if (abs(i - p) + abs(j - q) == r) {
                cout << "Element: [" << i << "]:[" << j << "]" << endl;
                sum += A[i][j];
            }
        }
    }

    cout << sum << endl;

    return 0;
}


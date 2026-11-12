/*
    Да се напише програма која вчитува матрица со димензии MxN (макс. 100x100).
    На почетокот се внесуваат димензиите на матрицата, а потоа и елементите на матрицата кои се само вредностите 1 и 0.
    Програмата треба да изброи и отпечати на СИ во колку од редиците и колоните има барем 3 последователни елементи со вредност 1.

    Input:
    3 8
    0 0 1 1 1 0 0 0
    1 1 1 0 1 1 1 0
    0 1 1 1 1 0 0 1

    Output: 5
*/
#include <iostream>
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

    int r_count = 0;
    int c_count = 0;

    for (int i = 0; i < m; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            if (a[i][j] == 1) {
                count++;
                if (count >= 3) {
                    c_count++;
                    break;
                }
            } else {
                count = 0;
            }
        }
    }

    for (int j = 0; j < n; j++) {
        int count = 0;
        for (int i = 0; i < m; i++) {
            if (a[i][j] == 1) {
                count++;
                if (count >= 3) {
                    c_count++;
                    break;
                }
            } else {
                count = 0;
            }
        }
    }

    cout << r_count + c_count << endl;
}

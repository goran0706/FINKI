// Еден елемент се заматува ако се најде аритметичка средина на елементот и сите негови соседи.
// Сосед на еден елемент се сите елементи кои припаѓаат на матрицата и се околу истиот елемент (хоризонтално, вертикално и дијагонално).
#include <iomanip>
#include <iostream>
using namespace std;


int main() {
    int n, m;
    cin >> n >> m;

    double A[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> A[i][j];
        }
    }

    int x, y;
    cin >> x >> y;

    int count = 0;
    double sum = 0;

    for (int i = x - 1; i <= x + 1; i++) {
        for (int j = y - 1; j < +y + 1; j++) {
            if (i >= 0 && i < n && j >= 0 && j < m) {
                count++;
                sum += A[i][j];
            }
        }
    }

    A[x][y] = sum / count;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << fixed << setprecision(2) << A[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}


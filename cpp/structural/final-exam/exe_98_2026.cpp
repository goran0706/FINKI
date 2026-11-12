// da se napishe kvadratnata matrica N (n od standard input),
// kade parnite redovi se pecatat od levo kon desno, a neparnite od desno kon levo
//
// Primer:
// input:
// 4
//
// output:
// 1 2 3 4
// 8 7 6 5
// 9 0 1 2
// 6 5 4 3
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int matrix[100][100];
    int counter = 1;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i % 2 == 0) {
                matrix[i][j] = counter++;
            } else {
                matrix[i][n - 1 - j] = counter++;
            }
            if (counter == 10) {
                counter = 0;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}

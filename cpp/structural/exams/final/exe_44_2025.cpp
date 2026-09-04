/*
    === 10. ===
    da se napishe kvadratnata matrica N(n od standard input),
    kade parnite redovi se pecatat od levo kon desno, a neparnite od desno kon levo
    
    input:
    4

    output:
    1 2 3 4
    8 7 6 5
    9 0 1 2
    6 5 4 3
*/
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int value = 1;
    int A[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            const int col = i % 2 == 0 ? j : n - 1 - j;
            A[i][col] = value++;

            if (value == 10) {
                value = 0;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << A[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}

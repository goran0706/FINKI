// Da se napishe kvadratnata matrica N(n od standard input),
// kade parnite redovi se pecatat od levo kon desno, a neparnite od desno kon levo

// pr. input:4
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

    int a[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
        }
    }

    int tmp[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i % 2 == 0) {
                tmp[i][j] = a[i][j];;
            } else {
                tmp[i][n - 1 - j] = a[i][j];;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << tmp[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}

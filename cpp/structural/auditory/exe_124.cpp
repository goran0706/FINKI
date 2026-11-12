/*
    На влез имате NxM матрица, каде прво се вчитуваат N и М, а потоа елементите на матрицата.
    Ваша задача е да ги испечатите дијагоналните елементи (види слика) почнувајќи од првиот ред на матрицата.
    Видете тест примери за печатење
    Напомена: внимавајте во случај да матрицата не е квадратна
*/

#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    int matrix[n][m];

    if (n != m) {
        cout << "Invalid matrix" << endl;
        return 0;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    for (int i = 0; i < n; i++) {
        cout << matrix[i][i] << " ";
    }

    return 0;
}

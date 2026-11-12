/*
    ============================================================
    TASK 3
    ============================================================
    Од тастатура се внесуваат N позитивни цели броеви (N <= 100), потоа индекс ind (ind >= 0).

    Да се напише функција: int sum_pos(int* arr, int ind, int n);

    Функцијата враќа сума од ind до крај.
    Ако ind > N → враќа 0.

    НАПОМЕНА: Да се користат покажувачи, без оператор [].
*/
#include <iostream>
using namespace std;

int sum_pos(int *arr, int ind, int n) {
    if (ind > n) {
        return 0;
    }
    return *(arr + ind) + sum_pos(arr, ind + 1, n);
}


int main() {
    int n;
    cin >> n;

    int a[100] = {};
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int ind;
    cin >> ind;

    cout << sum_pos(a, ind, n) << endl;

    return 0;
}

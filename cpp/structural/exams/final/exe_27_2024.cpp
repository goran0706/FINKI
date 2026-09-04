/*
    ============================================================
    TASK 12
    ============================================================
    Рекурзивна функција:
      int BrojPozitivni(int niza[], int n);

    Го враќа бројот на позитивни елементи.
*/
#include <iostream>
using namespace std;

int count_positive(int arr[], int n) {
    if (n <= 0) {
        return 0;
    }

    if (arr[n - 1] > 0) {
        return 1 + count_positive(arr, n - 1);
    }

    return count_positive(arr, n - 1);
}

int main() {
    int n;
    cin >> n;

    int a[100];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    cout << count_positive(a, n) << endl;

    return 0;
}

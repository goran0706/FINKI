// Од стандарден влез се чита природен број N (N <= 100), како и низа a[ ] од N цели броеви.
// Да се напише функција void premesti(а, n) која го преместува секој пронајден негативен број на крајот на низата.
// По преместувањето редоследот на позитивните броеви треба да остане ист како и во оригиналната низа, а истото важи и за редоследот на негативните.
// Напишете програма која ќе ја повика функцијата premesti за внесената низа a[] и потоа ќе ја испечати новодобиената низа.
#include <iostream>
using namespace std;

// Solution 1:
void premesti1(int *a, int n) {
    int tmp[n];
    int index = 0;

    for (int i = 0; i < n; i++) {
        if (a[i] >= 0) {
            tmp[index++] = a[i];
        }
    }

    for (int i = 0; i < n; i++) {
        if (a[i] < 0) {
            tmp[index++] = a[i];
        }
    }

    for (int i = 0; i < n; i++) {
        a[i] = tmp[i];
    }
}

// Solution 2:
void premesti2(int *a, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] < 0 && a[j + 1] >= 0) {
                swap(a[j], a[j + 1]);
            }
        }
    }
}

// Solution 3:
void premesti3(int *a, int n) {
    int pos_count = 0;

    for (int i = 0; i < n; i++) {
        if (a[i] > 0) {
            pos_count++;
        }
    }

    int tmp[n];
    int pos_index = 0;
    int neg_index = pos_count;

    for (int i = 0; i < n; i++) {
        if (a[i] > 0) {
            tmp[pos_index++] = a[i];
        } else if (a[i] < 0) {
            tmp[neg_index++] = a[i];
        }
    }

    for (int i = 0; i < n; i++) {
        cout << tmp[i] << " ";
    }
}

int main() {
    int n;
    cin >> n;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    premesti1(a, n);
    premesti2(a, n);
    premesti3(a, n);

    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }

    return 0;
}

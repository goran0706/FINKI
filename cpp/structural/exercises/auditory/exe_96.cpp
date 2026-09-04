// Да се напишат фунција за сортирање на низа со помош на методот за сортирање - Метод на меурче (Bubble sort)
// Да се напишат функции за внесување и печатење на елементите на една низа и да се напише главна програма во која се тестира методот

#include <iostream>
using namespace std;

void bubble_sort(int arr[], const int n) {
    for (int i = 0; i < n - 1; i++) {
        // Last i elements are already sorted
        for (int j = 0; j < n - i - 1; j++) {
            // Swap adjacent elements if they are in wrong order
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    int n;
    cin >> n;

    int a[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    bubble_sort(a, n);

    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
}

/*
    Да се напише рекурзивна функција која ќе го најде бројот на позитивни броеви од целобројна низа.
    Функцијата како аргумент ја прима низата, за која се бара бројот на позитивни броеви и вкупниот број на елементи, кои ги има таа низа.
    Функцијата е зададена со следниот прототип:

    int BrojPozitivni(int niza[], int n);

    Да се напише и функција main() за тестирање на функцијата BrojPozitivni.

    For example:

    Input:
    2
    -2
    5

    Output: 1
*/
#include <iostream>
using namespace std;

int positive_count(int arr[], int n) {
    if (n < 0) return 0;

    if (arr[n - 1] > 0) {
        return 1 + positive_count(arr, n - 1);
    }
    return positive_count(arr, n - 1);
}

int main() {
    int n;
    cin >> n;

    int a[100];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    cout << positive_count(a, n) << endl;
}

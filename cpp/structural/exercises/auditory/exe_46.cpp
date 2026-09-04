// Да се напише програма која за две низи кои се внесуваат од тастатура ќе провери дали се еднакви или не.
// На екран да се испачати резултатот од споредбата.
// Максимална големина на низите е 100.

#include <iostream>
using namespace std;

constexpr int array_size = 100;

int main() {
    int n;
    cin >> n;

    int arr1[array_size];
    int arr2[array_size];

    for (int i = 0; i < n; i++) {
        cin >> arr1[i];
    }

    for (int i = 0; i < n; i++) {
        cin >> arr2[i];
    }

    bool equal = true;

    for (int i = 0; i < n; i++) {
        if (arr1[i] != arr2[i]) {
            equal = false;
            break;
        }
    }

    if (equal) {
        cout << "Arrays have same elements" << endl;
    } else {
        cout << "Arrays have different elements" << endl;
    }

    return 0;
}

// Да се напише програма која за две низи кои се внесуваат од тастатура ќе провери дали се еднакви или не.
// На екран да се испачати резултатот од споредбата.
// Максимална големина на низите е 100.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int a[100];
    int b[100];

    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    for (int i = 0; i < n; i++) {
        cin >> b[i];
    }

    for (int i = 0; i < n; i++) {
        if (a[i] != b[i]) {
            cout << "Different elements" << endl;
            return 0;
        }
    }

    cout << "Same elements" << endl;

    return 0;
}


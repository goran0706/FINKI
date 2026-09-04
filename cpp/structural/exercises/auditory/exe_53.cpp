// Од стандарден влез се читаат едноцифрени броеви, се додека не се прочита нешто што не е број.
// Да се испечати на екран статистика колку пати се јавува секоја цифра меѓу прочитаните броеви.

#include <iostream>
using namespace std;

int main() {
    int n;
    int arr[10] = {};

    while (cin >> n) {
        arr[n]++;

        cout << "Statistics:" << endl;
        for (int i = 0; i < 10; i++) {
            cout << i << ":" << arr[i] << endl;
        }
    }

    return 0;
}

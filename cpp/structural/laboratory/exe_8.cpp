// TASK 8:
// Да се напише програма каде од тастатура ќе се внесе еден број кој има пет цифри, но не мора да е петцифрен, како на пример 04569 или 00256.
// Програмата ги печати сумите на паровите цифри од надвор кон внатре, за на крај да ја испечати средишната цифра.
// Така, ако внесениот број е 12596, програмата враќа 7 11 5.
// влез: 12596
// излез: 7 11 5

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // Option 1
    cout << n / 10000 + n % 10 << " ";
    cout << n / 10000 + n / 10 % 10 << " ";
    cout << n / 100 % 10;
    cout << endl;

    int digits[5];
    for (int i = 4; i >= 0; i--) {
        digits[i] = n % 10;
        n /= 10;
    }

    // Option 2
    cout << digits[0] + digits[4] << " ";
    cout << digits[1] + digits[3] << " ";
    cout << digits[2];
    cout << endl;

    // Option 3
    for (int i = 0; i <= 2; i++) {
        cout << (i == 2 ? digits[i] : digits[i] + digits[4 - i]) << " ";
    }
}

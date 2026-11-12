// Да се напише програма за пресметување на аритметичката средина на броевите 3, 5 и 12.

#include <iostream>
using namespace std;

int main() {
    constexpr int avgInteger = (3 + 5 + 12) / 3;
    cout << "avg = " << avgInteger << endl;

    constexpr float avgFloat = (3 + 5 + 12) / 3.0;
    cout << "avg = " << avgFloat << endl;

    return 0;
}

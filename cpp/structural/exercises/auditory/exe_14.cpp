// Од тастатура се внесуваат координати на една точка од рамнина.
// Да се напише програма со која ќе се испечати на кој квадрант припаѓа внесената точка.

#include <iostream>
using namespace std;

int main() {
    int x, y;
    cin >> x >> y;

    if (x > 0 && y > 0) {
        cout << "I" << endl;
    } else if (x > 0 && y < 0) {
        cout << "II" << endl;
    } else if (x < 0 && y < 0) {
        cout << "III" << endl;
    } else if (x < 0 && y > 0) {
        cout << "IV" << endl;
    } else {
        cout << "Invalid coordinates" << endl;
    }

    return 0;
}

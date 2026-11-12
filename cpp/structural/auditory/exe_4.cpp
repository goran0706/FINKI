// Да се напише програма која од СВ ќе прочита два цели броеви и
// ќе ја испечати на компјутерскиот екран нивната сума, разлика, производ и остатокот при делењето.

#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    // Guard against "Division by Zero"
    // - Integer types may crash the program since they have undefined behavior (UD)
    // - Floating points will return Infinity, -Infinity or NaN.
    if (b == 0) {
        cout << "Division by zero" << endl;
        return 0;
    }

    cout << "a + b = " << a + b << endl;
    cout << "a - b = " << a - b << endl;
    cout << "a * b = " << a * b << endl;
    cout << "a / b = " << a / b << endl;

    return 0;
}

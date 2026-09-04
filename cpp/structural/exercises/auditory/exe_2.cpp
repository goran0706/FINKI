// Да се напише програма која за зададена вредност на х (при декларација на променливата)
// ќе го пресмета и отпечати на екран х2.

#include <iostream>
#include <cmath>
using namespace std;

int main() {
    constexpr int x = 2;

    cout << "x = " << x << endl;
    cout << "x * x = " << x * x << endl;
    cout << "x * x = " << pow(x, 2) << endl;

    return 0;
}

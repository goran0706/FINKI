// Да се напише програма каде од тастатура ќе се внесе цена на производ, број на рати на кои се исплаќа и
// камата (каматата е број изразен во проценти од 0 до 100).
// Програмата треба да го испечати износот на ратата и вкупната сума што ќе се исплати за производот.
// ПОМОШ: Пресметајте ја целата сума, па потоа ратата.

#include <iostream>
using namespace std;

int main() {
    double price, rate, interest;
    cin >> price >> rate >> interest;

    if (rate <= 0) {
        cerr << "Invalid rate" << endl;
        return 0;
    }

    const double totalPrice = price + (price * interest / 100);
    const double ratePrice = totalPrice / rate;

    cout << "Rate is " << ratePrice << endl;
    cout << "Price is " << totalPrice << endl;

    return 0;
}

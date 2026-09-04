// Да се напише програма каде од тастатура ќе се внесе цена на производ,
// а потоа ќе ја испечати неговата цена со пресметан ддв.
// ПОМОШ: ДДВ е 18% од почетната цена

#include <iostream>
using namespace std;

int main() {
    double price;
    cin >> price;

    constexpr int tax = 18;
    price = price + (price * tax / 100);
    cout << "Price is " << price << endl;

    return 0;
}

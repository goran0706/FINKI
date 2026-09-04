// TASK 3:
// Да се напише програма коjа за даден цел броj секунди коj се чита од стандарден влез,
// ќе ги отпечати на екран соодветните вредности во часови, минути и секунди.

#include <iomanip>
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int s = n % 100;
    int m = n / 100 % 100;
    int h = n / 10000 % 100;

    cout << setfill('0') << setw(2) << h << ":" << setw(2) << m << ":" << setw(2) << s << endl;
}

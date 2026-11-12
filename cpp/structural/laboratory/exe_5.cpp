// TASK 5:
// Да се напише програма која за дадена сума на пари, ќе испечати со колку најмалку банкноти и монети може да се исплати.
// На влез се чита еден цел број.
// На излез се печатат 9 редови, по колку банкноти или монети од секој апоен ни се потребни за да ја исплатиме сумата.
// Пример 1583 денари, најдобро е да се исплати како: 0*5000 1*1000 1*500 0*100 1*50 3*10 0*5 1*2 1*1

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int denominations[] = {5000, 1000, 500, 100, 50, 10, 5, 2, 1};

    // 1. Iterate for each denomination
    // 2. Divide n by the denomination - use divider (/)
    // 3. Reduce n and extract remined for the next iteration - use modulus (%)
    for (const int denomination: denominations) {
        const int count = n / denomination;
        cout << denomination << ":" << count << endl;
        n = n % denomination;
    }

    return 0;
}

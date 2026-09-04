// Да се напише програма каде од тастатура ќе се внесе трицифрен цел број.
// Програмата ќе ја испечати најзначајната и најмалку значајната цифра од бројот.
// Пример: Ако се внесе бројот 795, програмата ќе испечати: Najznacajna cifra e 7, a najmalku znacajna e 5.
// ПОМОШ: Искористете целобројно делење и остаток од делење.

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // Use division (/) to get the first digit in a number
    const int mostSignificantDigit = n / 100;

    // Use modulus (%) to get the last digit in a number
    const int leastSignificantDigit = n % 10;

    cout << "Najznacajna cifra e " << mostSignificantDigit << endl;
    cout << "Najmalku znacajna e " << leastSignificantDigit << endl;

    return 0;
}

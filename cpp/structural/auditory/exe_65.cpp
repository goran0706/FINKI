// Да се напише програма со која се внесува цел број n (n>0) а потоа ја пресметува сумата на серијата
// (n*n) + …+ (3*3) + (2*2) + (1*1) но САМО за парните членови.
// На излезот се отпечатуваат парните членови, сумата и средната вредност на добиената серија од парните членови.
// Излезот е во дадениот формат (секој парен член, сумата и средната вредност во нови редови, нема празни места).

#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int sum_even = 0;
    int count_digit = 0;

    while (n > 0) {
        if (const int digit = n % 10; digit % 2 == 0) {
            cout << digit << " ";
            sum_even += digit;
            count_digit++;
        }
        n /= 10;
    }
    cout << endl;

    const double average = static_cast<double>(sum_even) / count_digit;

    cout << sum_even << endl;
    cout << average << endl;
}

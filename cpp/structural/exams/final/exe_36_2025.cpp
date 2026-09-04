/*
    === 2. ===
    Vnesuvas broj X i treba da vidis kolku parovi elementi (elementi a i b, od 10 do X) ima kade sto vazi praviloto a+b=X.

    Isto taka za sekoj elementi a i b treba da vazi deka zbirot na parni cifri vo
    a e ednakov na zbirot od neparnite cifri vo a (isto ovaa vazi i za b).

    Ako nema vakvi parovi ispecati samo Ne
*/
#include <iostream>
using namespace std;

bool is_valid(int n) {
    int sum_odd = 0;
    int sum_even = 0;

    while (n > 0) {
        int digit = n % 10;
        if (digit % 2 == 0) {
            sum_even += digit;
        } else {
            sum_odd += digit;
        }
        n /= 10;
    }

    return sum_even == sum_odd;
}

int main() {
    int x;
    cin >> x;

    int pairs_counter = 0;

    // 1. BAD - Doubles the pairs & goes bellow 10 for 'b'
    // for (int a = 10; a < x; a++) {
    //     int b = x - a;
    //     cout << a << " + " << b << endl;
    // }

    // 2. BAD - Doubles the pairs
    // for (int a = 10; a <= x - 10; a++) {
    //     int b = x - a;
    //     cout << a << " + " << b << endl;
    // }

    // 3. GOOD - No duplicates pairs & b stays >= 10 automatically (since a <= x/2)
    for (int a = 10; a <= x / 2; a++) {
        int b = x - a;

        if (is_valid(a) && is_valid(b)) {
            pairs_counter++;
        }
    }

    if (pairs_counter == 0) {
        cout << "Ne" << endl;
    } else {
        cout << pairs_counter << endl;
    }

    return 0;
}

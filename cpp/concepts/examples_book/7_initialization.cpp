#include <iostream>

int main() {
    using namespace std;

    int a = 1;                  // traditional C initialization, sets a to 1
    int b(2);                   // alternative C++ syntax, set b to 2

    int c{3};                   // another format for initialization that’s used with arrays and structures
    int d = {4};                // using a braced initializer for a single-valued variable is not particularly common,

    int e;                      // what could it be?
    e = 5;                      // 5

    cout << a << endl;
    cout << b << endl;
    cout << c << endl;
    cout << d << endl;
    cout << e << endl;
}

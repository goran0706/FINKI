// Од тастатура се внесуваат 3 броеви
// Првиот да се замени со вториот, а потоа третиот да се замени со првиот

#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;

    // 1. Using built-in swap function
    // cout << a << b << c << endl;
    //
    // swap(a, b);
    // swap(c, a);
    //
    // cout << a << b << c << endl;

    // 2. Using another variable to hold the temporary value
    cout << a << b << c << endl;

    int tmp = a;
    a = b;
    b = tmp;

    tmp = c;
    c = a;
    a = tmp;

    cout << a << b << c << endl;

    return 0;
}
